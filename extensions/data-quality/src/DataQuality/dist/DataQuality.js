import { jsxs as c, jsx as r, Fragment as se } from "react/jsx-runtime";
import { useState as q, useRef as P, useEffect as z, useLayoutEffect as wn, useMemo as Ve, useId as jn, useSyncExternalStore as yo, useCallback as Ht } from "react";
import { EntityReferenceMultiSelector as Lt, useKeySequence as Pa, TagBadge as xa, DetailListToolbar as ar, AUDIO_CRITERIA as mi, VIDEO_CRITERIA as Fr, PERFORMER_CRITERIA as gi, NarrativeText as La, AUDIO_SORT_OPTIONS as wo, VIDEO_SORT_OPTIONS as bi, AudioPlayer as Da, VideoPlayer as vo, formatDuration as No, FilterDialog as So, getResolutionLabel as _a, useCustomFieldFilterSection as ja, TAG_SORT_OPTIONS as qo, TAG_CRITERIA as Eo, EntityDetailTabs as Ua, TagTile as Ga, VideoCard as Ka, SortableList as Zr } from "@cove/runtime/components";
import { Search as yi, Ban as ei, Pin as Ba, Tags as Va, Headphones as Co, Film as kr, ChevronLeft as wi, Pencil as vi, RectangleHorizontal as Ja, LayoutGrid as Ni, MoreHorizontal as za, ChevronRight as Si, Layers as Qa, RefreshCw as Wa, Flag as ti, Users as Ha, ChevronDown as Ya, Save as Ao, RotateCcw as ko, ExternalLink as To, Tag as Xa, SkipForward as Za, Check as Ro, AlertTriangle as ni, Settings as es, Loader2 as ts, X as Oo, Plus as ns, Upload as rs, Trash2 as Io, List as is, Grid3X3 as os, GripVertical as qi } from "@cove/runtime/lucide-react";
import { extensionFetch as as } from "@cove/runtime/api";
const Pr = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, xr = Object.keys(
  Pr
);
function xn(e) {
  return e === "excludes" || e === "excludesAll";
}
function Ei(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
const ss = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function ue(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function rr(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function me(e) {
  return rr(Fe(e));
}
function Mo(e) {
  return Fe(e) === "video";
}
function Fe(e) {
  return e.entityType ?? "video";
}
const Ln = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "å",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "ö",
  "ä",
  "z",
  "x",
  "c",
  "v",
  "b"
];
function Tr(e) {
  return ue(e) && !Fo(e.occurrence) ? "Complete the optional occurrence condition before saving." : !Mo(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : Fe(e) !== "tag" && e.actions.some(
    (t) => $o(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => vn(t, Fe(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const cs = {
  video: 1e3,
  audio: 250
};
function Xe(e, t = "video") {
  const n = (i, o) => Number.isFinite(Number(i)) && Number(i) > 0 ? Math.floor(Number(i)) : o;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(cs[t], n(e.perPage, 40))
    )
  };
}
function Ji(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function wt(e) {
  const { page: t, ...n } = e.view.filter, i = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    ue(e) ? [e.entityType, ...i, e.occurrence] : Fe(e) === "video" ? i : [Fe(e), ...i]
  );
}
function vn(e, t) {
  const n = t ?? ("effect" in e ? "tag" : "video");
  return e.label.trim() ? n === "tag" ? !("effect" in e) || "steps" in e || !e.effect || typeof e.effect != "object" ? !1 : ["SET_TAG_GROUP", "CLEAR_TAG_GROUP", "SKIP"].includes(
    e.effect.mode
  ) && (e.effect.mode !== "SET_TAG_GROUP" || Number.isSafeInteger(e.effect.tagGroupId) && e.effect.tagGroupId > 0) : !("steps" in e) || "effect" in e ? !1 : e.steps.every(
    (i) => [
      "ADD",
      "REMOVE",
      "REMOVE_TREE",
      "MARK_PRESENT",
      "MARK_ABSENT",
      "CLEAR_ABSENCE"
    ].includes(i.mode) && i.tagIds.length > 0 && i.tagIds.every((o) => Number.isSafeInteger(o) && o > 0)
  ) && !$o(e) : !1;
}
function ls(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function Yt(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function Lr(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function cn(e) {
  return "steps" in e ? e.steps.some((t) => Yt(t.mode)) : !1;
}
function $o(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (Yt(n.mode))
      for (const i of n.tagIds) {
        const o = t.get(i);
        if (o && o !== n.mode) return !0;
        t.set(i, n.mode);
      }
  return !1;
}
function cr(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || ss.includes(n.entityType)) && (!ls(n.entityType) || Fo(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && ds(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(n.actions) && n.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && (n.entityType === "tag" ? "effect" in i && !("steps" in i) && vn(i, "tag") : "steps" in i && !("effect" in i) && Array.isArray(i.steps) && i.steps.every(
        (o) => o && Array.isArray(o.tagIds)
      ) && vn(i, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => Tr(n)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((n) => n.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function ds(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= 115 && n.cardSize <= 380) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (i) => ["date", "studio", "performers", "tags"].includes(i)
  )) && [n.annotationParents, n.binParents].every(
    (i) => i === void 0 || Array.isArray(i) && i.every((o) => Number.isSafeInteger(o) && o > 0)
  );
}
function ri(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const o of i)
      n.has(o.id) || (n.add(o.id), t.push(o));
  return t;
}
function Fo(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (i) => Array.isArray(i) && i.every((o) => Number.isSafeInteger(o) && o > 0) && new Set(i).size === i.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && xr.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function zi(e, t) {
  return e.size > 0 ? [...e].sort((n, i) => n - i) : t == null ? [] : [t];
}
function Qi(e, t, n, i) {
  if (t.length === 0) return null;
  if (n == null) return t[0];
  if (!i && t.includes(n)) return n;
  const o = Math.max(0, e.indexOf(n));
  if (i) {
    for (const s of e.slice(o + 1))
      if (t.includes(s)) return s;
    if (t.includes(n)) {
      for (const s of e.slice(0, o).reverse())
        if (t.includes(s)) return s;
      return n;
    }
  }
  return t[Math.min(o, t.length - 1)];
}
function us(e, t) {
  const n = new Set(e), i = t.length > 0 && t.every((o) => n.has(o));
  for (const o of t)
    i ? n.delete(o) : n.add(o);
  return n;
}
function fs(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function ps(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function hs(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function ms(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function gs(e, t) {
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
const Po = "ext:com.midnightrider.data-quality:configuration", bs = "ext:cove-data-quality:video-reviews", ii = "ext:com.midnightrider.data-quality:progress", lr = /* @__PURE__ */ new Map(), Nr = /* @__PURE__ */ new Map(), gn = (e, t) => e.includes("*") || e.includes(t), Rr = (e) => Z(`/api/savedfilters?mode=${encodeURIComponent(e)}`), ys = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function oi(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Fn(e) {
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
    reviews: cr(JSON.stringify(t.reviews)),
    deletedIds: oi(t.deletedIds),
    importedIds: oi(t.importedIds)
  };
}
function ws(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const i = /* @__PURE__ */ new Set();
  for (const o of t) {
    const s = localStorage.getItem(o);
    if (s !== null) {
      const a = cr(s);
      n ?? (n = a), a.forEach((d) => i.add(d.id));
    }
    oi(
      JSON.parse(localStorage.getItem(`${o}:account-imports`) ?? "[]")
    ).forEach((a) => i.add(a));
  }
  return {
    reviews: n ?? [],
    known: [...i],
    present: n !== void 0
  };
}
async function xo(e) {
  const t = await Z("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Lo(e, t) {
  const n = (Nr.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Nr.set(e, n), n.finally(() => {
    Nr.get(e) === n && Nr.delete(e);
  }).catch(() => {
  }), n;
}
let tr = null;
function vs() {
  if (tr) return tr;
  const e = Ns();
  return tr = e, e.finally(() => {
    tr === e && (tr = null);
  }).catch(() => {
  }), e;
}
async function Ns() {
  var g;
  const e = await Z("/api/auth/me"), t = String(e.user.id), n = `cove-data-quality-v2:${t}`, i = gn(e.permissions, "savedfilters.read"), o = i && gn(e.permissions, "savedfilters.write"), s = i ? (await Rr(Po)).filter((y) => y.name === "Data Quality configuration").sort((y, v) => y.id - v.id) : [];
  if (s.length > 1) {
    const y = (v) => {
      const { revision: S, ...h } = Fn(v.uiOptions);
      return JSON.stringify(h);
    };
    if (s.some((v) => y(v) !== y(s[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (o)
      for (const v of s.slice(1))
        await Z(`/api/savedfilters/${v.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${v.id}` })
        });
    s.splice(1);
  }
  let a = s.length ? Fn(s[0].uiOptions) : ys();
  const d = localStorage.getItem(`${n}:migrated`) === "true", l = localStorage.getItem(n), u = localStorage.getItem(`${n}:local-only`) === "true";
  !s.length && l && (a = Fn(l));
  let m = !s.length;
  if (s.length && u && l) {
    const y = Fn(l);
    if (y.reviews.some((S) => {
      const h = a.reviews.find((O) => O.id === S.id);
      return h && JSON.stringify(h) !== JSON.stringify(S);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const v = [
      .../* @__PURE__ */ new Set([...a.deletedIds, ...y.deletedIds])
    ];
    a = {
      ...a,
      reviews: ri(a.reviews, y.reviews).filter(
        (S) => !v.includes(S.id)
      ),
      deletedIds: v,
      importedIds: [
        .../* @__PURE__ */ new Set([...a.importedIds, ...y.importedIds])
      ]
    }, m = !0;
  }
  if (!d) {
    const y = JSON.stringify(a), v = ws(t);
    if (s.length && v.reviews.some((C) => {
      const I = a.reviews.find((U) => U.id === C.id);
      return I && JSON.stringify(I) !== JSON.stringify(C);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const S = i ? (await Rr(bs)).flatMap(
      (C) => cr(C.uiOptions ?? "[]")
    ) : [], h = v.known.filter(
      (C) => !v.reviews.some((I) => I.id === C)
    ), O = /* @__PURE__ */ new Set([...a.deletedIds, ...h]);
    a = {
      ...a,
      reviews: ri(
        v.reviews,
        a.reviews,
        S.filter(
          (C) => !v.known.includes(C.id) && !a.importedIds.includes(C.id)
        )
      ).filter((C) => !O.has(C.id)),
      deletedIds: [...O],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...a.importedIds,
          ...v.known,
          ...S.map((C) => C.id)
        ])
      ]
    }, m || (m = JSON.stringify(a) !== y);
  }
  const b = {
    userId: t,
    recordId: (g = s[0]) == null ? void 0 : g.id,
    config: a,
    readable: i,
    writable: o,
    durable: o
  };
  if (lr.set(n, b), m && o) {
    const y = a;
    s.length && (b.config = Fn(s[0].uiOptions)), await Do(n, y), a = b.config;
  } else s.length || (localStorage.setItem(n, JSON.stringify(a)), !i && (!d || u) && localStorage.setItem(`${n}:local-only`, "true"));
  if (!i) localStorage.setItem(`${n}:migrated`, "true");
  else if (o)
    try {
      localStorage.setItem(`${n}:migrated`, "true");
    } catch {
    }
  return {
    reviews: a.reviews,
    storageKey: n,
    canWrite: gn(e.permissions, "videos.write"),
    canWriteVideos: gn(e.permissions, "videos.write"),
    canWriteAudios: gn(e.permissions, "audios.write"),
    canWriteTags: gn(e.permissions, "tags.write"),
    canReadTagGroups: gn(e.permissions, "taggroups.read"),
    canConfigure: !i || o,
    storageNotice: i ? o ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Do(e, t) {
  const n = lr.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await xo(n), n.recordId != null) {
      const s = await Z(
        `/api/savedfilters/${n.recordId}`
      );
      if (Fn(s.uiOptions).revision !== n.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const o = await Z(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Po,
          name: "Data Quality configuration",
          uiOptions: JSON.stringify(i)
        })
      }
    );
    n.recordId = o.id;
  } else
    localStorage.setItem(e, JSON.stringify(i)), localStorage.setItem(`${e}:local-only`, "true");
  if (n.config = i, n.durable)
    try {
      localStorage.setItem(e, JSON.stringify(i)), localStorage.setItem(`${e}:migrated`, "true"), localStorage.removeItem(`${e}:local-only`);
    } catch {
    }
}
function Ss(e, t) {
  return cr(JSON.stringify(t)), Lo(e, async () => {
    const n = lr.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const i = n.config.reviews.filter((o) => !t.some((s) => s.id === o.id)).map((o) => o.id);
    await Do(e, {
      ...n.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...n.config.deletedIds, ...i])
      ].filter((o) => !t.some((s) => s.id === o))
    });
  });
}
function Wi(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, i]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(i)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function qs(e, t) {
  const n = lr.get(e);
  if (!n) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), o = i ? Wi(i) : null;
  if (!n.readable) return o;
  const s = (await Rr(ii)).find(
    (d) => d.name === t
  ), a = s ? Wi(s.uiOptions) : null;
  return o && (!a || o.updatedAt > a.updatedAt) ? o : a;
}
function Es(e, t, n) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(n));
  } catch {
  }
  return Lo(i, async () => {
    const o = lr.get(e);
    if (!(o != null && o.writable)) return;
    await xo(o);
    const s = (await Rr(ii)).find(
      (a) => a.name === t
    );
    await Z(
      s ? `/api/savedfilters/${s.id}` : "/api/savedfilters",
      {
        method: s ? "PUT" : "POST",
        body: JSON.stringify({
          mode: ii,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function ln(e) {
  return e === "audio" ? "audios" : "videos";
}
const Cs = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function vt(e) {
  return Cs[e];
}
const Or = "confirmed_absent_tags", Ci = "Confirmed absent tags", Dr = "confirmed_absent_occurrence_tags", _o = {
  key: Or,
  label: Ci,
  type: "tag",
  subject: "tag assessments"
}, Ai = {
  key: Dr,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, As = {
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
function Xt(e) {
  return Array.isArray(e) ? e.map(Xt) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? As[n] ?? n : t === "key" && typeof n == "string" && [
        Or,
        Dr
      ].includes(n.toLowerCase()) ? n.toLowerCase() : Xt(n)
    ])
  ) : e;
}
async function jo(e, t, n) {
  const i = new Headers(t.headers);
  !(t.body instanceof FormData) && !i.has("Content-Type") && i.set("Content-Type", "application/json");
  const o = await as(e, { ...t, headers: i });
  if (o.status === 404 && n === "null") return null;
  if (!o.ok) {
    let a = o.statusText || `Request failed (${o.status}).`;
    try {
      const d = await o.json();
      a = d.message || d.detail || d.error || a;
    } catch {
    }
    throw new Error(a);
  }
  if (o.status === 204 || o.status === 205) return;
  const s = await o.text();
  return s ? JSON.parse(s) : void 0;
}
async function Z(e, t = {}) {
  return await jo(e, t, "fail");
}
function ks(e, t = {}) {
  return jo(e, t, "null");
}
const Ts = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Rs = 0;
function ai(e, t) {
  return Z(
    `/api/${ln(e)}/${t}?dqRead=${Ts}-${++Rs}`,
    { cache: "no-store" }
  );
}
function Uo(e, t) {
  const n = { ...e.view.objectFilter }, i = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    Xt({
      findFilter: Xe(t, me(e)),
      objectFilter: n,
      filterExpression: i
    })
  );
}
async function ir(e, t, n) {
  return Z(
    `/api/${ln(me(e))}/find`,
    { method: "POST", signal: n, body: Uo(e, t) }
  );
}
async function Os(e, t, n) {
  return (await Z(
    `/api/${ln(me(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: Uo(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function Hi(e, t, n) {
  const i = { ...e.view.objectFilter };
  return delete i._filterExpression, Z("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      Xt({
        findFilter: Xe(t),
        objectFilter: i
      })
    )
  });
}
function Is(e) {
  return Z("/api/taggroups", { signal: e });
}
function si(e, t, n = 1280) {
  return `/api/${ln(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function ci(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function Yi(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Ms(e) {
  return `/api/stream/video/${e}/preview`;
}
function $s(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Fs(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function _r(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const i of e) {
    await Z(`/api/tags/${i}`, { signal: t }), n.add(i);
    for (let o = 1; ; o++) {
      const s = await Z("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Xt({
            findFilter: { page: o, perPage: 1e3, sort: "id", direction: "asc" },
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
      for (const a of s.items) n.add(a.id);
      if (o * 1e3 >= s.totalCount) break;
      if (!s.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...n];
}
async function ki(e, t) {
  const n = Lr(e);
  return (await Promise.all(
    e.steps.map(
      async (o) => o.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await _r(o.tagIds, t)).filter(
          (s) => !n.has(s)
        )
      } : o
    )
  )).filter((o) => o.tagIds.length > 0);
}
function Ps(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function Ti(e, t) {
  const i = (await Z("/api/custom-fields")).find(
    (s) => s.key.toLowerCase() === e.key
  );
  if (!i)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const o = Ps(e, i);
  return o ? { kind: "incompatible", message: o } : i.entityTypes.includes(t) ? { kind: "ready", definition: i, message: "" } : {
    kind: "missing",
    message: `Add ${vt(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: i
  };
}
async function Go(e, t) {
  const n = await Ti(e, t);
  if (n.kind !== "ready") {
    if (n.kind === "incompatible") throw new Error(n.message);
    if (n.definition) {
      await Z(`/api/custom-fields/${n.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...n.definition.entityTypes, t])]
        })
      });
      return;
    }
    await Z("/api/custom-fields", {
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
function Ko(e = "video") {
  return Ti(_o, e);
}
function xs(e = "video") {
  return Go(_o, e);
}
function Bo(e = "video") {
  return Ti(Ai, e);
}
function Ls(e = "video") {
  return Go(Ai, e);
}
function Ir(e) {
  return [...new Set(e)];
}
function Vo(e, t) {
  const n = e.customFields ?? {}, i = Object.keys(n).find(
    (s) => s.toLowerCase() === Dr
  ), o = i === void 0 ? [] : n[i];
  return Ir(
    (Array.isArray(o) ? o : []).filter(
      (s) => typeof s == "string" && /^[1-9]\d*:[1-9]\d*$/.test(s)
    ).map((s) => s.split(":").map(Number)).filter(([s]) => s === t).map(([, s]) => s)
  );
}
async function Ds(e) {
  let t;
  try {
    t = await Bo(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${Ai.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function _s(e, t, n, i, o, s) {
  await Z(`/api/${ln(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: Ir(o).map((a) => `${i}:${a}`)
      },
      customFieldMode: s
    })
  });
}
function js(e, t, n) {
  const i = [...e.tagIds], o = (s) => {
    if (n === null)
      throw new Error(
        `The ${Ci} custom field is not available.`
      );
    return { customFields: { [n]: i }, customFieldMode: s };
  };
  switch (e.mode) {
    case "ADD":
      return { ids: t, tagIds: i, tagMode: "ADD" };
    case "REMOVE":
    case "REMOVE_TREE":
      return { ids: t, tagIds: i, tagMode: "REMOVE" };
    case "MARK_PRESENT":
      return { ids: t, tagIds: i, tagMode: "ADD", ...o("REMOVE") };
    case "MARK_ABSENT":
      return { ids: t, tagIds: i, tagMode: "REMOVE", ...o("ADD") };
    case "CLEAR_ABSENCE":
      return { ids: t, ...o("REMOVE") };
  }
}
async function Jo(e, t, n) {
  if (!vn(t) || n.length === 0 || n.some((l) => !Number.isSafeInteger(l) || l <= 0))
    throw new Error(
      `Choose ${vt(e).many} and configure a valid action first.`
    );
  let i = null;
  if (cn(t)) {
    let l;
    try {
      l = await Ko(e);
    } catch (u) {
      throw new Error(
        `Could not verify the ${Ci} custom field. ${u instanceof Error ? u.message : "Request failed."}`
      );
    }
    if (l.kind !== "ready") throw new Error(l.message);
    i = l.definition.key;
  }
  const o = Ir(n), s = (await ki(t)).map((l) => ({
    mode: l.mode,
    tagIds: Ir(l.tagIds)
  })), d = [
    ...s.filter((l) => !Yt(l.mode)),
    ...s.filter((l) => Yt(l.mode))
  ].map(
    (l) => js(l, o, i)
  );
  for (let l = 0; l < d.length; l++)
    try {
      await Z(`/api/${ln(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(d[l])
      });
    } catch (u) {
      throw new Error(
        `Step ${l + 1} failed; ${l} earlier step(s) completed. Refresh and check the selected ${vt(e).many} before retrying. ${u instanceof Error ? u.message : "Request failed."}`
      );
    }
}
async function Us(e, t) {
  if (!vn(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await Z("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
function Xi({
  review: e,
  onChange: t,
  choices: n = !1
}) {
  const i = e.occurrence, o = vt(me(e)).queue, s = (a) => t({ ...e, occurrence: { ...i, ...a } });
  return n ? /* @__PURE__ */ c("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
    /* @__PURE__ */ c("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      o,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ r(
      Lt,
      {
        entityType: "tag",
        values: i.tagIds,
        onChange: (a) => s({ tagIds: a }),
        placeholder: "Search review tag choices...",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
      /* @__PURE__ */ r(
        "input",
        {
          type: "checkbox",
          checked: i.multiple,
          onChange: (a) => s({ multiple: a.target.checked })
        }
      ),
      "Allow multiple tags, for example when something changes part-way through the ",
      o
    ] }),
    /* @__PURE__ */ r("p", { children: "Save & next performer applies the selected tags and advances. Save choices stays on the performer. Skip only moves the cursor; eligibility comes from the filters." })
  ] }) : /* @__PURE__ */ c("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ r("legend", { children: "Occurrence condition (optional)" }),
    /* @__PURE__ */ r("p", { children: "Leave this unrestricted to review any appearance. Set performer matching in the review workspace and save it with the rule." }),
    /* @__PURE__ */ c("label", { children: [
      "Occurrence condition",
      /* @__PURE__ */ r(
        "select",
        {
          "aria-label": "Occurrence condition",
          value: i.condition,
          onChange: (a) => s({
            condition: a.target.value
          }),
          children: xr.map((a) => /* @__PURE__ */ r("option", { value: a, children: Pr[a] }, a))
        }
      )
    ] }),
    !["any", "isNull"].includes(i.condition) && /* @__PURE__ */ c(se, { children: [
      /* @__PURE__ */ r(
        Lt,
        {
          entityType: "tag",
          values: i.conditionTagIds,
          onChange: (a) => s({ conditionTagIds: a }),
          placeholder: "Search occurrence condition tags...",
          allowCreate: !1
        }
      ),
      /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
        /* @__PURE__ */ r(
          "input",
          {
            type: "checkbox",
            checked: i.includeSubtags ?? !0,
            onChange: (a) => s({ includeSubtags: a.target.checked })
          }
        ),
        "Include subtags"
      ] }),
      xn(i.condition) && /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
        /* @__PURE__ */ r(
          "input",
          {
            type: "checkbox",
            checked: i.hideConfirmedAbsent ?? !0,
            onChange: (a) => s({ hideConfirmedAbsent: a.target.checked })
          }
        ),
        "Hide occurrences confirmed absent"
      ] })
    ] }),
    /* @__PURE__ */ c("p", { children: [
      "Conditions check tags on the same performer’s occurrence, independently of ",
      o,
      " tags and the performer’s profile."
    ] })
  ] });
}
function Gs({
  review: e,
  onChange: t
}) {
  const n = vt(me(e)).many;
  return /* @__PURE__ */ c("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ r("legend", { children: "Performer flags" }),
    /* @__PURE__ */ c("p", { children: [
      "Flag performers whose profile has any of these tags in the performer list and batches, for example a tag noting that something changed during their career. Check a flagged performer’s earliest and latest ",
      n,
      " ",
      "before applying one batch to all of them."
    ] }),
    /* @__PURE__ */ r(
      Lt,
      {
        entityType: "tag",
        values: e.occurrence.flagPerformerTagIds ?? [],
        onChange: (i) => {
          const { flagPerformerTagIds: o, ...s } = e.occurrence;
          t({
            ...e,
            occurrence: i.length ? { ...s, flagPerformerTagIds: i } : s
          });
        },
        placeholder: "Search performer flag tags...",
        allowCreate: !1
      }
    )
  ] });
}
const Zi = 1e3;
async function Ks(e, t, n) {
  const i = await Z(
    `/api/tags/${t}`,
    { signal: n }
  ), o = /* @__PURE__ */ new Map();
  for (let l = 1; ; l++) {
    const u = await Z(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          Xt({
            findFilter: {
              page: l,
              perPage: Zi,
              sort: "name",
              direction: "asc"
            },
            objectFilter: {
              parentsCriterion: { value: [t], modifier: "INCLUDES" }
            }
          })
        )
      }
    );
    for (const m of u.items) o.set(m.id, m);
    if (l * Zi >= u.totalCount) break;
    if (!u.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const s = [...o.values()], a = me(e), d = ue(e) ? await Vs(
    a,
    s.map((l) => l.id),
    n
  ) : s.map((l) => (a === "audio" ? l.audioCount : l.videoCount) ?? 0);
  return {
    parent: { id: t, name: i.name },
    children: s.map((l, u) => ({ id: l.id, name: l.name, uses: d[u] })).sort(
      (l, u) => u.uses - l.uses || l.name.localeCompare(u.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      })
    )
  };
}
function Bs(e) {
  return JSON.stringify(
    Xt({
      findFilter: { page: 1, perPage: 1 },
      objectFilter: {
        performerFilterCriterion: {
          mode: "atLeastOne",
          conditionOperator: "and",
          performerOccurrenceTagsCriterion: {
            modifier: "includes",
            value: [e],
            depth: 0
          }
        }
      }
    })
  );
}
async function Vs(e, t, n) {
  const i = new Array(t.length).fill(0), o = new AbortController(), s = () => o.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && s(), n == null || n.addEventListener("abort", s, { once: !0 });
  let a = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; a < t.length && !o.signal.aborted; ) {
            const d = a++;
            i[d] = (await Z(
              `/api/${ln(e)}/aggregate`,
              {
                method: "POST",
                signal: o.signal,
                body: Bs(t[d])
              }
            )).count;
          }
        } catch (d) {
          throw o.abort(), d;
        }
      })
    );
  } finally {
    n == null || n.removeEventListener("abort", s);
  }
  return o.signal.throwIfAborted(), i;
}
function Js(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((i) => t.has(i.id) ? !1 : (t.add(i.id), !0))
  }));
}
function zs(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const i of n.children)
      t.set(i.id, [...t.get(i.id) ?? [], n.parent.id]);
  return t;
}
function Qs(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const i of Lr(n))
      t.set(i, [...t.get(i) ?? [], n]);
  return t;
}
function Ws(e, t) {
  return {
    id: crypto.randomUUID(),
    label: e.name,
    steps: [
      { mode: "ADD", tagIds: [e.id] },
      ...t.length ? [{ mode: "REMOVE_TREE", tagIds: t }] : []
    ]
  };
}
const Hs = (e) => e instanceof Error ? e.message : "Request failed.";
function Ys({
  id: e,
  review: t,
  disabled: n,
  onAdd: i,
  onCancel: o
}) {
  const [s, a] = q([]), [d, l] = q({}), [u, m] = q({}), [b, g] = q({}), y = P(/* @__PURE__ */ new Map());
  z(
    () => () => {
      for (const $ of y.current.values()) $.abort();
    },
    []
  );
  const v = vt(me(t)), S = ue(t), h = S ? "performer" : v.one;
  function O($) {
    var E;
    (E = y.current.get($)) == null || E.abort();
    const G = new AbortController();
    y.current.set($, G), l((X) => ({ ...X, [$]: { status: "loading" } })), Ks(t, $, G.signal).then(
      (X) => {
        G.signal.aborted || l((ne) => ({
          ...ne,
          [$]: { status: "ready", group: X }
        }));
      },
      (X) => {
        G.signal.aborted || l((ne) => ({
          ...ne,
          [$]: { status: "failed", message: Hs(X) }
        }));
      }
    );
  }
  function C($) {
    var fe;
    const G = s.filter((ce) => !$.includes(ce));
    for (const ce of G)
      (fe = y.current.get(ce)) == null || fe.abort(), y.current.delete(ce);
    const E = (ce) => {
      const Se = d[ce];
      return (Se == null ? void 0 : Se.status) === "ready" ? Se.group.children.map((Dt) => Dt.id) : [];
    }, X = new Set($.flatMap(E)), ne = G.flatMap(E).filter((ce) => !X.has(ce));
    m(
      (ce) => Object.fromEntries(
        Object.entries(ce).filter(([Se]) => !ne.includes(Number(Se)))
      )
    ), g(
      (ce) => Object.fromEntries(
        Object.entries(ce).filter(([Se]) => $.includes(Number(Se)))
      )
    ), l(
      (ce) => Object.fromEntries(
        Object.entries(ce).filter(([Se]) => $.includes(Number(Se)))
      )
    ), a($);
    for (const ce of $) s.includes(ce) || O(ce);
  }
  const I = s.flatMap(($) => {
    const G = d[$];
    return (G == null ? void 0 : G.status) === "ready" ? [G.group] : [];
  }), U = I.length === s.length, D = s.some(
    ($) => {
      var G;
      return (((G = d[$]) == null ? void 0 : G.status) ?? "loading") === "loading";
    }
  ), A = new Map(
    Js(I).map(($) => [$.parent.id, $])
  ), k = zs(I), L = new Map(I.map(($) => [$.parent.id, $.parent.name])), j = Qs(t.actions), ae = ($) => u[$] ?? !j.has($), J = U ? [...A.values()].flatMap(
    ($) => $.children.filter((G) => ae(G.id))
  ) : [], x = ($, G) => m((E) => ({
    ...E,
    ...Object.fromEntries($.children.map((X) => [X.id, G]))
  }));
  return /* @__PURE__ */ c("fieldset", { id: e, className: "dq-actions-from-tags", children: [
    /* @__PURE__ */ r("legend", { children: "Add actions from parent tags" }),
    /* @__PURE__ */ c("p", { className: "dq-editor-note", children: [
      "Each ticked child tag becomes an action that adds it, most used",
      " ",
      S ? "on performers " : "",
      "first. Tags an action already adds start unticked. The new actions go at the end, ready to reorder and edit."
    ] }),
    /* @__PURE__ */ r(
      Lt,
      {
        entityType: "tag",
        values: s,
        onChange: C,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    s.map(($) => {
      const G = d[$];
      if (!G || G.status === "loading")
        return /* @__PURE__ */ r("p", { className: "dq-editor-note", children: "Loading child tags…" }, $);
      if (G.status === "failed")
        return /* @__PURE__ */ c("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ c("span", { children: [
            "Child tags could not be loaded. ",
            G.message
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: n,
              onClick: () => O($),
              children: "Retry"
            }
          )
        ] }, $);
      const E = A.get($);
      if (!E) return null;
      const X = E.parent.name;
      return /* @__PURE__ */ c("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ r("legend", { children: X }),
        G.group.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-editor-note", children: "This tag has no child tags." }) : /* @__PURE__ */ c(se, { children: [
          /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: b[$] ?? !1,
                disabled: n,
                onChange: (ne) => g((fe) => ({
                  ...fe,
                  [$]: ne.target.checked
                }))
              }
            ),
            "Only one per ",
            h,
            ": each action removes every other tag in the ",
            X,
            " tree"
          ] }),
          E.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-editor-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ c(se, { children: [
            /* @__PURE__ */ c("div", { className: "dq-row", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${X}`,
                  onClick: () => x(E, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${X}`,
                  onClick: () => x(E, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ r("div", { className: "dq-child-tags", children: E.children.map((ne) => {
              const fe = j.get(ne.id) ?? [], ce = (k.get(ne.id) ?? []).filter((Se) => Se !== $).map((Se) => `“${L.get(Se)}”`);
              return /* @__PURE__ */ c("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "checkbox",
                    checked: ae(ne.id),
                    disabled: n,
                    onChange: (Se) => m((Dt) => ({
                      ...Dt,
                      [ne.id]: Se.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ c("span", { children: [
                  ne.name,
                  " ",
                  /* @__PURE__ */ c("small", { children: [
                    ne.uses.toLocaleString(),
                    " ",
                    ne.uses === 1 ? v.one : v.many
                  ] }),
                  ce.length > 0 && /* @__PURE__ */ c("small", { children: [
                    " · Also under ",
                    ce.join(", ")
                  ] }),
                  fe.length > 0 && /* @__PURE__ */ c("small", { children: [
                    " ",
                    "· Already in “",
                    fe[0].label || "New action",
                    "”",
                    fe.length > 1 ? ` and ${fe.length - 1} more` : ""
                  ] })
                ] })
              ] }, ne.id);
            }) })
          ] })
        ] })
      ] }, $);
    }),
    /* @__PURE__ */ c("div", { className: "dq-row", children: [
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: n || !J.length,
          onClick: () => i(
            J.map(
              ($) => Ws(
                $,
                (k.get($.id) ?? []).filter(
                  (G) => b[G]
                )
              )
            )
          ),
          children: J.length ? `Add ${J.length} action${J.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: o, children: "Cancel" }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-sr-only", children: D ? "Loading child tags…" : "" })
    ] })
  ] });
}
const zo = "-", Xs = "Ctrl+a", Zs = "Ctrl/⌘A";
function Sr(e) {
  return (t) => {
    t != null && t.repeat || e();
  };
}
function Ri({
  surface: e,
  enabled: t,
  actionCount: n,
  onAction: i,
  onFind: o,
  onSelectAll: s
}) {
  const a = P({ onAction: i, onFind: o, onSelectAll: s });
  wn(() => {
    a.current = { onAction: i, onFind: o, onSelectAll: s };
  });
  const d = Math.max(0, Math.min(n, Ln.length)), l = !!o && n > 0, u = e === "local" && !!s, m = Ve(() => {
    const b = [];
    return u && b.push({
      keys: Xs,
      surface: "local",
      action: Sr(() => {
        var g, y;
        return (y = (g = a.current).onSelectAll) == null ? void 0 : y.call(g);
      })
    }), l && b.push({
      keys: zo,
      surface: e,
      action: Sr(() => {
        var g, y;
        return (y = (g = a.current).onFind) == null ? void 0 : y.call(g);
      })
    }), Ln.slice(0, d).forEach(
      (g, y) => b.push(
        {
          keys: g,
          surface: e,
          action: Sr(() => a.current.onAction(y, !1))
        },
        {
          keys: `Shift+${g}`,
          surface: e,
          action: Sr(() => a.current.onAction(y, !0))
        }
      )
    ), b;
  }, [e, d, l, u]);
  Pa(m, t);
}
const ec = {
  action: (e) => Ln[e] ?? "",
  find: zo,
  selectAll: Zs
};
function Un() {
  return ec;
}
const tc = 600 * 1e3, Oi = /* @__PURE__ */ new Map(), Qo = /* @__PURE__ */ new Map(), sn = /* @__PURE__ */ new Map();
function Wo(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = Qo.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function Ho(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && Qo.set(e.tagGroupId, e.tagGroupSortOrder), Oi.set(e.id, { tag: e, at: Date.now() });
}
function Yo(e) {
  const t = Oi.get(e);
  if (!(!t || Date.now() - t.at > tc))
    return Wo(t.tag);
}
function Xo(e) {
  return {
    id: e.id,
    name: e.name,
    sortName: e.sortName,
    color: e.color,
    tagGroupId: e.tagGroupId,
    tagGroupName: e.tagGroupName,
    tagGroupColor: e.tagGroupColor,
    tagGroupSortOrder: e.tagGroupSortOrder,
    imagePath: e.imagePath,
    hasImage: e.hasImage
  };
}
function li(e) {
  var t;
  for (const n of e) {
    const i = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && i && Ho(Xo({ ...n, name: i }));
  }
}
function nc(e) {
  const t = sn.get(e);
  if (t) return t;
  const n = new AbortController(), i = {
    controller: n,
    waiters: 0,
    promise: Z(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (o) => {
        var m, b;
        const s = ((m = o == null ? void 0 : o.name) == null ? void 0 : m.trim()) || null;
        if (sn.get(e) === i && sn.delete(e), !s) return null;
        const a = Xo({ ...o, id: e, name: s }), d = (b = Oi.get(e)) == null ? void 0 : b.tag, l = (d == null ? void 0 : d.tagGroupId) === a.tagGroupId, u = {
          ...a,
          tagGroupSortOrder: a.tagGroupSortOrder ?? (l ? d == null ? void 0 : d.tagGroupSortOrder : void 0),
          hasImage: a.hasImage ?? (d == null ? void 0 : d.hasImage),
          imagePath: a.imagePath ?? (d == null ? void 0 : d.imagePath)
        };
        return Ho(u), Wo(u);
      },
      () => (sn.get(e) === i && sn.delete(e), null)
    )
  };
  return sn.set(e, i), i;
}
function eo() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function Jr(e) {
  const t = {};
  for (const n of e) {
    const i = Yo(n);
    i !== void 0 && (t[n] = i);
  }
  return t;
}
function rc(e, t) {
  if (t != null && t.aborted) return Promise.reject(eo());
  const n = {}, i = [];
  for (const o of new Set(e)) {
    const s = Yo(o);
    if (s !== void 0) n[o] = s;
    else {
      const a = nc(o);
      a.waiters += 1, i.push({ id: o, entry: a });
    }
  }
  return i.length ? new Promise((o, s) => {
    let a = !1;
    const d = () => {
      for (const { id: u, entry: m } of i)
        m.waiters -= 1, m.waiters === 0 && sn.get(u) === m && (sn.delete(u), m.controller.abort());
    }, l = () => {
      a || (a = !0, d(), s(eo()));
    };
    t == null || t.addEventListener("abort", l, { once: !0 }), Promise.all(
      i.map(
        ({ id: u, entry: m }) => m.promise.then((b) => [u, b])
      )
    ).then((u) => {
      if (!a) {
        a = !0, t == null || t.removeEventListener("abort", l), d();
        for (const [m, b] of u) n[m] = b;
        o(n);
      }
    });
  }) : Promise.resolve(n);
}
function ic(e) {
  const t = {};
  for (const [n, i] of Object.entries(e)) t[Number(n)] = (i == null ? void 0 : i.name) ?? null;
  return t;
}
function Zo(e) {
  const t = [...new Set(e)].sort((o, s) => o - s).join(","), [n, i] = q(() => ({
    key: t,
    tags: Jr(zr(t))
  }));
  return z(() => {
    const o = zr(t), s = Jr(o);
    if (i({ key: t, tags: s }), o.every((d) => d in s)) return;
    const a = new AbortController();
    return rc(o, a.signal).then(
      (d) => i({ key: t, tags: d }),
      () => {
      }
    ), () => a.abort();
  }, [t]), n.key === t ? n.tags : Jr(zr(t));
}
function dr(e) {
  const t = Zo(e);
  return Ve(() => ic(t), [t]);
}
function zr(e) {
  return e ? e.split(",").map(Number) : [];
}
function oc(e, t, n = !1) {
  switch (e) {
    case "ADD":
      return { text: `+ ${t}`, tone: "add" };
    case "REMOVE":
      return { text: `− ${t}`, tone: "remove" };
    case "REMOVE_TREE":
      return { text: n ? `− rest of ${t}` : `− ${t} tree`, tone: "remove" };
    case "MARK_PRESENT":
      return { text: `Mark ${t} present`, tone: "assess" };
    case "MARK_ABSENT":
      return { text: `Mark ${t} absent`, tone: "assess" };
    case "CLEAR_ABSENCE":
      return { text: `Clear ${t} absence`, tone: "neutral" };
  }
}
function ur(e, t, n = [], i) {
  if ("effect" in e) {
    const a = e.effect;
    if (a.mode === "SKIP") return [{ text: "Skip", tone: "neutral" }];
    if (a.mode === "CLEAR_TAG_GROUP")
      return [{ text: "Set Ungrouped", tone: "neutral" }];
    const d = n.find((l) => l.id === a.tagGroupId);
    return [
      {
        text: d ? `Assign ${d.name}` : "Unavailable tag group",
        tone: "neutral"
      }
    ];
  }
  if (!e.steps.length) return [{ text: "Skip", tone: "neutral" }];
  const o = Lr(e), s = (a) => o.has(a) || [...o].some((d) => {
    var l;
    return (l = i == null ? void 0 : i.get(a)) == null ? void 0 : l.includes(d);
  });
  return e.steps.flatMap(
    (a) => a.tagIds.map(
      (d) => oc(
        a.mode,
        t[d] === void 0 ? "…" : t[d] ?? "Unavailable tag",
        a.mode === "REMOVE_TREE" && s(d)
      )
    )
  );
}
function ea(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function Ii({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: i,
  canStay: o = !0,
  onApply: s,
  onClose: a
}) {
  const [d, l] = q(""), [u, m] = q(0), b = P(null), g = P(null), y = P(null), v = P(null), S = P(null), h = jn(), O = dr(Ve(() => ea(e), [e])), C = Un(), I = Ve(() => {
    const L = d.trim().toLocaleLowerCase();
    return e.map((j, ae) => ({ action: j, index: ae, key: C.action(ae) })).filter((j) => !L || j.action.label.toLocaleLowerCase().includes(L));
  }, [e, C, d]), U = I.length ? Math.min(u, I.length - 1) : -1, D = (L) => `${h}-option-${L}`;
  wn(() => {
    var L, j, ae;
    return v.current = document.activeElement, S.current = ((j = (L = y.current) == null ? void 0 : L.parentElement) == null ? void 0 : j.closest('[role="dialog"]')) ?? null, (ae = b.current) == null || ae.focus({ preventScroll: !0 }), () => {
      var x;
      const J = v.current;
      J instanceof HTMLElement && J.isConnected && J.focus({ preventScroll: !0 }), document.activeElement !== J && ((x = S.current) != null && x.isConnected) && S.current.focus({ preventScroll: !0 });
    };
  }, []), z(() => {
    var L, j, ae;
    U < 0 || (ae = (j = (L = g.current) == null ? void 0 : L.querySelector(`[id="${D(I[U].index)}"]`)) == null ? void 0 : j.scrollIntoView) == null || ae.call(j, { block: "nearest" });
  }, [U, I]);
  function A(L, j) {
    !L || i != null && i(L.action) || s(L.action, o && j);
  }
  function k(L) {
    var j;
    if (L.stopPropagation(), L.key === "Escape")
      L.preventDefault(), a();
    else if (L.key === "Enter")
      L.preventDefault(), L.repeat || A(I[U], L.shiftKey);
    else if (L.key === "ArrowDown" || L.key === "ArrowUp") {
      if (L.preventDefault(), !I.length) return;
      const ae = L.key === "ArrowDown" ? 1 : -1;
      m((U + ae + I.length) % I.length);
    } else L.key === "Tab" && (L.preventDefault(), (j = b.current) == null || j.focus());
  }
  return /* @__PURE__ */ c(se, { children: [
    /* @__PURE__ */ r("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: a }),
    /* @__PURE__ */ c(
      "div",
      {
        ref: y,
        role: "dialog",
        "aria-label": "Find an action",
        className: "dq-find-action",
        onKeyDown: k,
        onMouseDown: (L) => {
          L.target !== b.current && L.preventDefault();
        },
        children: [
          /* @__PURE__ */ c("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ r(yi, { "aria-hidden": "true" }),
            /* @__PURE__ */ r(
              "input",
              {
                ref: b,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${h}-list`,
                "aria-activedescendant": U >= 0 ? D(I[U].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: d,
                onChange: (L) => {
                  l(L.target.value), m(0);
                }
              }
            ),
            /* @__PURE__ */ r("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          I.length ? /* @__PURE__ */ r(
            "ul",
            {
              ref: g,
              id: `${h}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: I.map((L, j) => /* @__PURE__ */ r("li", { role: "none", children: /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: D(L.index),
                  tabIndex: -1,
                  "aria-selected": j === U,
                  disabled: (i == null ? void 0 : i(L.action)) ?? !1,
                  onClick: (ae) => A(L, ae.shiftKey),
                  children: [
                    L.key ? /* @__PURE__ */ r("kbd", { children: L.key }) : /* @__PURE__ */ r("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ r("span", { className: "dq-find-label", children: L.action.label }),
                    /* @__PURE__ */ r("span", { className: "dq-find-effect", children: ur(L.action, O, t, n).map(
                      (ae, J) => /* @__PURE__ */ r("span", { "data-effect-tone": ae.tone, children: ae.text }, J)
                    ) })
                  ]
                }
              ) }, L.action.id))
            }
          ) : /* @__PURE__ */ c("p", { className: "dq-find-empty", role: "status", children: [
            "No action matches “",
            d.trim(),
            "”."
          ] }),
          /* @__PURE__ */ c("p", { className: "dq-find-hints", "aria-hidden": "true", children: [
            /* @__PURE__ */ c("span", { children: [
              /* @__PURE__ */ r("kbd", { children: "Enter" }),
              " applies"
            ] }),
            o && /* @__PURE__ */ c("span", { children: [
              /* @__PURE__ */ r("kbd", { children: "Shift" }),
              /* @__PURE__ */ r("kbd", { children: "Enter" }),
              " applies and stays"
            ] }),
            /* @__PURE__ */ c("span", { children: [
              /* @__PURE__ */ r("kbd", { children: "↑" }),
              /* @__PURE__ */ r("kbd", { children: "↓" }),
              " choose"
            ] })
          ] })
        ]
      }
    )
  ] });
}
const qr = (e) => e >= "0" && e <= "9";
function to(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function no(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let n = 0, i = 0;
  for (; n < e.length && i < t.length; ) {
    if (qr(e[n]) && qr(t[i])) {
      const d = n, l = i;
      for (; n < e.length && qr(e[n]); ) n++;
      for (; i < t.length && qr(t[i]); ) i++;
      const u = e.slice(d, n).replace(/^0+/, ""), m = t.slice(l, i).replace(/^0+/, "");
      if (u.length !== m.length) return u.length < m.length ? -1 : 1;
      if (u !== m) return u < m ? -1 : 1;
      continue;
    }
    const s = to(e[n]), a = to(t[i]);
    if (s !== a) return s < a ? -1 : 1;
    n++, i++;
  }
  const o = e.length - n - (t.length - i);
  return o !== 0 ? o < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function ta(e, t) {
  const n = (o) => o.tagGroupId != null ? 0 : 1, i = (o) => o.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(i(e) - i(t)) || no(e.tagGroupName, t.tagGroupName) || no(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function na(e) {
  return [...e].sort(ta);
}
function ac(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const i of n.steps)
        i.mode === "REMOVE_TREE" && i.tagIds.forEach((o) => t.add(o));
  return [...t];
}
function ra(e, t, n) {
  const i = Lr(e), o = [], s = [];
  for (const g of e.steps) {
    if (g.mode !== "REMOVE_TREE") {
      s.push(g);
      continue;
    }
    const y = g.tagIds.flatMap((v) => {
      const S = n.get(v);
      return S || o.push(v), S ?? [v];
    });
    s.push({ mode: "REMOVE", tagIds: y.filter((v) => !i.has(v)) });
  }
  const a = [
    ...s.filter((g) => !Yt(g.mode)),
    ...s.filter((g) => Yt(g.mode))
  ], d = new Set(t.ids), l = new Set(t.absent);
  for (const g of a)
    for (const y of g.tagIds)
      switch (g.mode) {
        case "ADD":
          d.add(y);
          break;
        case "REMOVE":
        case "REMOVE_TREE":
          d.delete(y);
          break;
        case "MARK_PRESENT":
          d.add(y), l.delete(y);
          break;
        case "MARK_ABSENT":
          d.delete(y), l.add(y);
          break;
        case "CLEAR_ABSENCE":
          l.delete(y);
          break;
      }
  const u = new Set(t.ids), m = new Set(t.absent), b = [...new Set(e.steps.flatMap((g) => g.tagIds))];
  return {
    added: b.filter((g) => d.has(g) && !u.has(g)),
    removed: [...u].filter((g) => !d.has(g)),
    markedAbsent: b.filter((g) => l.has(g) && !m.has(g)),
    absenceCleared: [...m].filter((g) => !l.has(g)),
    unresolvedTrees: [...new Set(o)]
  };
}
function sc(e) {
  let t;
  if (e.applications) {
    const n = /* @__PURE__ */ new Map();
    for (const i of e.applications)
      n.has(i.tag.id) || n.set(i.tag.id, i.tag);
    t = [...n.values()];
  } else
    t = e.tags ?? e.ids.map((n, i) => ({ id: n, name: e.names[i] ?? "" }));
  return na(t);
}
function ia(e) {
  const t = ac(e).sort((a, d) => a - d).join(","), [n, i] = q(() => /* @__PURE__ */ new Map()), o = P(/* @__PURE__ */ new Set()), s = P(!0);
  return z(() => (s.current = !0, () => {
    s.current = !1;
  }), []), z(() => {
    const a = t ? t.split(",").map(Number) : [];
    for (const d of a)
      o.current.has(d) || (o.current.add(d), _r([d]).then(
        (l) => {
          s.current && i((u) => new Map(u).set(d, l));
        },
        () => {
          o.current.delete(d);
        }
      ));
  }, [t]), n;
}
function oa() {
  let e = null;
  const t = /* @__PURE__ */ new Set(), n = (i) => {
    i !== e && (e = i, t.forEach((o) => o()));
  };
  return {
    get: () => e,
    set: n,
    clear: (i) => {
      e === i && n(null);
    },
    subscribe: (i) => (t.add(i), () => t.delete(i))
  };
}
function Mi(e) {
  return yo(e.subscribe, e.get, e.get);
}
const ro = [
  { indent: 0, slots: Qr(0, 11), fixed: [] },
  { indent: 1, slots: Qr(11, 22), fixed: [] },
  { indent: 2, slots: Qr(22, 27), fixed: ["n", "m", ",", "."] }
];
function Qr(e, t) {
  return Array.from({ length: t - e }, (n, i) => e + i);
}
function io(e, t) {
  return e === "g" ? "Go to…" : e === "f" ? t === "video" ? "Fullscreen · filters" : "Filters" : t === "video" && e === "k" ? "Play / pause" : t === "video" && e === "m" ? "Mute" : "";
}
function st({ binding: e, hidden: t }) {
  return /* @__PURE__ */ r(
    "kbd",
    {
      className: Array.from(e).length === 1 ? "dq-key dq-key-letter" : "dq-key",
      "aria-hidden": t || void 0,
      children: e
    }
  );
}
function oo(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function cc({
  actions: e,
  mediaKind: t,
  isDisabled: n,
  busy: i,
  tags: o,
  trees: s,
  preview: a,
  onApply: d,
  onFind: l,
  findDisabled: u
}) {
  const m = Un(), b = jn(), g = dr(
    Ve(() => e.flatMap((C) => C.steps.flatMap((I) => I.tagIds)), [e])
  ), y = ro.filter((C) => C.slots.some((I) => I < e.length)), v = y.length === ro.length, S = Math.max(0, e.length - Ln.length), h = (C) => ({
    onMouseEnter: () => a.set(C),
    onMouseLeave: () => a.clear(C),
    onFocus: () => a.set(C),
    onBlur: (I) => {
      I.currentTarget.contains(I.relatedTarget) || a.clear(C);
    }
  }), O = (C) => {
    const I = e[C], U = m.action(C);
    if (!I) {
      const k = io(U, t);
      return /* @__PURE__ */ c(
        "div",
        {
          className: `dq-pad-slot dq-pad-free${k ? " dq-pad-reserved" : ""}`,
          "aria-hidden": "true",
          children: [
            /* @__PURE__ */ r(st, { binding: U }),
            k && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: k })
          ]
        },
        C
      );
    }
    const D = n(I), A = `${b}-effect-${C}`;
    return /* @__PURE__ */ c("div", { className: "dq-pad-slot", ...h(I), children: [
      /* @__PURE__ */ r("span", { id: A, className: "dq-sr-only", children: ur(I, g, [], s).map((k) => k.text).join(", ") }),
      /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: I.label,
          "aria-keyshortcuts": U,
          "aria-describedby": A,
          disabled: D,
          onClick: (k) => d(I, k.shiftKey),
          children: [
            /* @__PURE__ */ r(st, { binding: U }),
            " ",
            /* @__PURE__ */ r("span", { className: "dq-pad-label", children: I.label }),
            oo(I) && " ",
            oo(I) && /* @__PURE__ */ c("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(ei, { "aria-hidden": "true" }),
              "absent"
            ] })
          ]
        }
      ),
      I.steps.length > 0 && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-pad-pin",
          "aria-label": `Apply and stay: ${I.label}`,
          title: "Apply and stay (Shift)",
          disabled: D,
          onClick: () => d(I, !0),
          children: /* @__PURE__ */ r(Ba, { "aria-hidden": "true" })
        }
      )
    ] }, C);
  };
  return /* @__PURE__ */ c("section", { className: "dq-pad", "aria-label": "Actions", "aria-busy": i || void 0, children: [
    /* @__PURE__ */ c("div", { className: "dq-pad-header", children: [
      /* @__PURE__ */ r(
        lc,
        {
          actions: e,
          names: g,
          tags: o,
          trees: s,
          preview: a,
          extra: S,
          findKey: m.find
        }
      ),
      /* @__PURE__ */ c("span", { className: "dq-pad-hint", children: [
        /* @__PURE__ */ r("kbd", { className: "dq-key", children: "Shift" }),
        /* @__PURE__ */ r("span", { children: "+ key applies and stays" })
      ] }),
      !v && /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-pad-find-button",
          "aria-label": "Find action",
          "aria-keyshortcuts": m.find,
          disabled: u,
          onClick: l,
          children: [
            /* @__PURE__ */ r(st, { binding: m.find }),
            /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "Find action" })
          ]
        }
      )
    ] }),
    y.map((C) => /* @__PURE__ */ c("div", { className: "dq-pad-row", "data-indent": C.indent, children: [
      C.slots.map(O),
      C.fixed.map((I) => {
        const U = io(I, t);
        return /* @__PURE__ */ c(
          "div",
          {
            className: `dq-pad-slot dq-pad-free dq-pad-fixed${U ? " dq-pad-reserved" : ""}`,
            "aria-hidden": "true",
            children: [
              /* @__PURE__ */ r(st, { binding: I }),
              U && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: U })
            ]
          },
          I
        );
      }),
      C.fixed.length > 0 && /* @__PURE__ */ r("div", { className: "dq-pad-slot", children: /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-pad-tile dq-pad-find",
          "aria-label": S ? `Find action, ${S} more` : "Find action",
          "aria-keyshortcuts": m.find,
          disabled: u,
          onClick: l,
          children: [
            /* @__PURE__ */ r(st, { binding: m.find }),
            /* @__PURE__ */ c("span", { className: "dq-pad-label", children: [
              /* @__PURE__ */ r(yi, { "aria-hidden": "true" }),
              S ? `${S} more` : "Find action"
            ] })
          ]
        }
      ) })
    ] }, C.indent))
  ] });
}
function lc({
  actions: e,
  names: t,
  tags: n,
  trees: i,
  preview: o,
  extra: s,
  findKey: a
}) {
  const d = Un(), l = Mi(o), u = l ? e.indexOf(l) : -1;
  if (!l || u < 0)
    return /* @__PURE__ */ c("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      s > 0 && /* @__PURE__ */ c(se, { children: [
        ` · ${Ln.length} on keys, ${s} more under `,
        /* @__PURE__ */ r(st, { binding: a })
      ] })
    ] });
  const m = d.action(u), b = n && l.steps.length ? ra(l, n, i) : null, g = b && !b.unresolvedTrees.length && ![b.added, b.removed, b.markedAbsent, b.absenceCleared].some(
    (y) => y.length
  );
  return /* @__PURE__ */ c("p", { className: "dq-pad-effect", children: [
    m && /* @__PURE__ */ r(st, { binding: m }),
    /* @__PURE__ */ r("strong", { children: l.label }),
    ur(l, t, [], i).map((y, v) => /* @__PURE__ */ r("span", { "data-effect-tone": y.tone, children: y.text }, v)),
    g && /* @__PURE__ */ r("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function aa({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: i,
  busy: o,
  onApply: s,
  onFind: a,
  summary: d,
  hints: l,
  notices: u,
  status: m,
  className: b = ""
}) {
  const g = Un(), y = jn(), v = dr(Ve(() => ea(e), [e])), [S] = q(() => oa()), h = P(null), O = dc(h, e), C = e.slice(0, Ln.length), I = e.length - C.length, U = (A) => ur(A, v, t, n).map((k) => k.text).join(", "), D = (A) => ({
    onMouseEnter: () => S.set(A),
    onMouseLeave: () => S.clear(A),
    onFocus: () => S.set(A),
    onBlur: (k) => {
      k.currentTarget.contains(k.relatedTarget) || S.clear(A);
    }
  });
  return /* @__PURE__ */ c(
    "section",
    {
      ref: h,
      className: `dq-action-bar${O ? " dq-bar-stacked" : ""}${o ? " dq-bar-busy" : ""}${b ? ` ${b}` : ""}`,
      "aria-label": "Actions",
      children: [
        /* @__PURE__ */ r("div", { className: "dq-bar-summary", children: d }),
        /* @__PURE__ */ r("span", { className: "dq-bar-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ c("div", { className: "dq-bar-tiles", "aria-busy": o || void 0, children: [
          C.map((A, k) => {
            const L = g.action(k);
            return /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "dq-bar-tile",
                title: A.label,
                "aria-keyshortcuts": L || void 0,
                "aria-describedby": `${y}-effect-${k}`,
                disabled: i(A),
                onClick: () => s(A),
                ...D(A),
                children: [
                  L && /* @__PURE__ */ r(st, { binding: L }),
                  " ",
                  /* @__PURE__ */ r("span", { className: "dq-bar-label", children: A.label })
                ]
              },
              A.id
            );
          }),
          e.length > 0 ? /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "dq-bar-tile dq-bar-find",
              "aria-label": I > 0 ? `Find action, ${I} more` : "Find action",
              "aria-keyshortcuts": g.find,
              onClick: a,
              children: [
                /* @__PURE__ */ r(st, { binding: g.find, hidden: !0 }),
                /* @__PURE__ */ r(yi, { "aria-hidden": "true" }),
                /* @__PURE__ */ r("span", { className: "dq-bar-label", children: I > 0 ? `${I} more` : "Find action" })
              ]
            }
          ) : /* @__PURE__ */ r("p", { className: "dq-bar-empty", children: "This review has no actions." })
        ] }),
        l && /* @__PURE__ */ r("p", { className: "dq-bar-hints", children: l }),
        /* @__PURE__ */ r(uc, { actions: C, preview: S, names: v, tagGroups: t, trees: n }),
        u && /* @__PURE__ */ r("div", { className: "dq-bar-notices", children: u }),
        /* @__PURE__ */ r("div", { hidden: !0, children: C.map((A, k) => /* @__PURE__ */ r("span", { id: `${y}-effect-${k}`, children: U(A) }, A.id)) }),
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: m })
      ]
    }
  );
}
function dc(e, t) {
  const [n, i] = q(!1);
  return wn(() => {
    var u;
    const o = e.current;
    if (!o || typeof ResizeObserver > "u") return;
    const s = o.querySelector(".dq-bar-summary"), a = () => {
      const m = getComputedStyle(o), b = parseFloat(m.columnGap) || 0, g = o.clientWidth - (parseFloat(m.paddingLeft) || 0) - (parseFloat(m.paddingRight) || 0), y = [...o.querySelectorAll(".dq-bar-tiles > *")].map(
        (C) => C.offsetWidth
      ), v = parseFloat(getComputedStyle(o.querySelector(".dq-bar-tiles")).columnGap) || 0, S = o.querySelector(".dq-bar-hints"), h = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (S ? S.offsetWidth + b : 0) + 1 + // the divider
      2 * b, O = (C) => {
        let I = 1, U = 0;
        for (const D of y)
          U > 0 && U + v + D > C ? (I += 1, U = D) : U += (U > 0 ? v : 0) + D;
        return I;
      };
      i(1 + O(g) < O(g - h));
    }, d = new ResizeObserver(a);
    d.observe(o);
    for (const m of o.querySelectorAll(".dq-bar-summary, .dq-bar-tiles, .dq-bar-hints"))
      d.observe(m);
    a();
    let l = !0;
    return (u = document.fonts) == null || u.ready.then(() => {
      l && a();
    }), () => {
      l = !1, d.disconnect();
    };
  }, [e, t]), n;
}
function uc({
  actions: e,
  preview: t,
  names: n,
  tagGroups: i,
  trees: o
}) {
  const s = Un(), a = Mi(t), d = a ? e.indexOf(a) : -1;
  if (!a || d < 0) return null;
  const l = s.action(d);
  return /* @__PURE__ */ c("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    l && /* @__PURE__ */ r(st, { binding: l }),
    /* @__PURE__ */ r("strong", { children: a.label }),
    ur(a, n, i, o).map((u, m) => /* @__PURE__ */ r("span", { "data-effect-tone": u.tone, children: u.text }, m))
  ] });
}
const sa = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
};
function $i({ entityType: e }) {
  const t = sa[e];
  return e === "tag" ? /* @__PURE__ */ r(Va, { role: "img", "aria-label": t }) : rr(e) === "audio" ? /* @__PURE__ */ r(Co, { role: "img", "aria-label": t }) : /* @__PURE__ */ r(kr, { role: "img", "aria-label": t });
}
function ca({
  name: e,
  description: t,
  entityType: n,
  onBack: i,
  backDisabled: o,
  onEdit: s,
  editDisabled: a,
  toolbar: d,
  trailing: l,
  chipsStart: u,
  chipsAfter: m,
  chipsEnd: b
}) {
  return /* @__PURE__ */ c("header", { className: "dq-review-header", children: [
    /* @__PURE__ */ c("div", { className: "dq-review-header-lead", children: [
      i && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: o,
          onClick: i,
          children: /* @__PURE__ */ r(wi, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-type", title: sa[n], children: /* @__PURE__ */ r($i, { entityType: n }) }),
      /* @__PURE__ */ r("h1", { title: t || e, children: e }),
      t && /* @__PURE__ */ r("p", { className: "dq-sr-only", children: t }),
      s && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-icon-button dq-icon-button-small",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: a,
          onClick: s,
          children: /* @__PURE__ */ r(vi, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    d,
    /* @__PURE__ */ r("div", { className: "dq-review-header-trail", children: l }),
    /* @__PURE__ */ r("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    u,
    m && /* @__PURE__ */ r("div", { className: "dq-review-chips-after", children: m }),
    b && /* @__PURE__ */ r("div", { className: "dq-review-chips-end", children: b })
  ] });
}
function la({
  page: e,
  pages: t,
  onPage: n
}) {
  const [i, o] = q(!1), [s, a] = q(""), d = P(null), l = P(null);
  z(() => {
    var b;
    i && ((b = d.current) == null || b.select());
  }, [i]);
  const u = (b) => {
    o(!1), b && requestAnimationFrame(() => {
      var g;
      return (g = l.current) == null ? void 0 : g.focus();
    });
  }, m = () => {
    const b = Math.round(Number(s));
    u(!0), Number.isFinite(b) && b >= 1 && b !== e && n(Math.min(t, b));
  };
  return /* @__PURE__ */ c("span", { className: "dq-pager", children: [
    /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-icon-button",
        "aria-label": "Previous page",
        title: "Previous page",
        disabled: e <= 1,
        onClick: () => n(e - 1),
        children: /* @__PURE__ */ r(wi, { "aria-hidden": "true" })
      }
    ),
    i ? /* @__PURE__ */ r(
      "input",
      {
        ref: d,
        type: "number",
        className: "dq-pager-input",
        "aria-label": `Go to page, 1 to ${t}`,
        min: 1,
        max: t,
        value: s,
        onChange: (b) => a(b.target.value),
        onKeyDown: (b) => {
          b.key === "Enter" ? (b.preventDefault(), m()) : b.key === "Escape" && (b.preventDefault(), b.stopPropagation(), u(!0));
        },
        onBlur: () => u(!1)
      }
    ) : /* @__PURE__ */ c(
      "button",
      {
        ref: l,
        type: "button",
        className: "dq-pager-page",
        "aria-label": `Page ${e} of ${t}. Go to page`,
        title: "Go to page",
        disabled: t <= 1,
        onClick: () => {
          a(String(e)), o(!0);
        },
        children: [
          e,
          " / ",
          t
        ]
      }
    ),
    /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-icon-button",
        "aria-label": "Next page",
        title: "Next page",
        disabled: e >= t,
        onClick: () => n(e + 1),
        children: /* @__PURE__ */ r(Si, { "aria-hidden": "true" })
      }
    )
  ] });
}
function da({
  mode: e,
  disabled: t,
  onChange: n
}) {
  return /* @__PURE__ */ c("div", { className: "dq-segmented", role: "group", "aria-label": "Review layout", children: [
    /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        "aria-pressed": e === "single",
        disabled: t,
        onClick: () => e !== "single" && n("single"),
        children: [
          /* @__PURE__ */ r(Ja, { "aria-hidden": "true" }),
          "Single"
        ]
      }
    ),
    /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        "aria-pressed": e === "multiple",
        disabled: t,
        onClick: () => e !== "multiple" && n("multiple"),
        children: [
          /* @__PURE__ */ r(Ni, { "aria-hidden": "true" }),
          "Grid"
        ]
      }
    )
  ] });
}
function fc({
  options: e,
  value: t,
  disabled: n,
  onChange: i
}) {
  return /* @__PURE__ */ r("div", { className: "dq-segmented dq-segmented-icons", role: "group", "aria-label": "Card view", children: e.map((o) => /* @__PURE__ */ r(
    "button",
    {
      type: "button",
      "aria-label": o.label,
      title: o.label,
      "aria-pressed": t === o.value,
      disabled: n,
      onClick: () => t !== o.value && i(o.value),
      children: o.icon
    },
    o.value
  )) });
}
function ua({
  items: e,
  disabled: t
}) {
  const [n, i] = q(!1), o = P(null), s = P(null), a = jn();
  z(() => {
    var u, m;
    n && ((m = (u = s.current) == null ? void 0 : u.querySelector('[role="menuitem"]:not(:disabled)')) == null || m.focus());
  }, [n]), z(() => {
    t && i(!1);
  }, [t]);
  const d = (u = !0) => {
    var m;
    i(!1), u && ((m = o.current) == null || m.focus());
  };
  return /* @__PURE__ */ c("div", { className: "dq-menu", onKeyDown: (u) => {
    var g, y;
    if (!n) return;
    const m = [
      ...((g = s.current) == null ? void 0 : g.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], b = m.indexOf(document.activeElement);
    if (u.key === "Escape")
      u.preventDefault(), u.stopPropagation(), d();
    else if (u.key === "Tab")
      d(!1);
    else if (u.key === "ArrowDown" || u.key === "ArrowUp") {
      if (u.preventDefault(), !m.length) return;
      const v = u.key === "ArrowDown" ? 1 : -1;
      m[(b + v + m.length) % m.length].focus();
    } else (u.key === "Home" || u.key === "End") && (u.preventDefault(), (y = m.at(u.key === "Home" ? 0 : -1)) == null || y.focus());
  }, children: [
    /* @__PURE__ */ r(
      "button",
      {
        ref: o,
        type: "button",
        className: "dq-icon-button",
        "aria-label": "More review options",
        title: "More review options",
        "aria-haspopup": "menu",
        "aria-expanded": n,
        "aria-controls": n ? a : void 0,
        disabled: t,
        onClick: () => i((u) => !u),
        children: /* @__PURE__ */ r(za, { "aria-hidden": "true" })
      }
    ),
    n && /* @__PURE__ */ c(se, { children: [
      /* @__PURE__ */ r("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => d(!1) }),
      /* @__PURE__ */ r(
        "div",
        {
          ref: s,
          id: a,
          role: "menu",
          "aria-label": "More review options",
          className: "dq-menu-list",
          children: e.map((u) => /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              role: "menuitem",
              disabled: u.disabled,
              onClick: () => {
                d(), u.onSelect();
              },
              children: u.label
            },
            u.label
          ))
        }
      )
    ] })
  ] });
}
function Mr(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Fi(e) {
  return String(e.type).toLowerCase() === "tag";
}
function Pi(e) {
  return !!String(e ?? "").trim();
}
function xi(e) {
  return [
    ...new Set(
      Mr(e.customFieldCriteria).filter(Fi).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !Pi(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function Li(e, t) {
  const n = Mr(e.customFieldCriteria);
  if (!n.length) return e;
  let i = !1;
  const o = n.map((s) => {
    if (!Fi(s)) return s;
    const a = { ...s };
    for (const [d, l] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const u = t[String(s[d] ?? "")];
      u && !Pi(s[l]) && (a[l] = u, i = !0);
    }
    return a;
  });
  return i ? { ...e, customFieldCriteria: o } : e;
}
function fa(e, t, n) {
  const i = Mr(e.customFieldCriteria);
  if (!i.length) return e;
  const o = Mr(n.customFieldCriteria), s = (l, u) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (m) => (l[m] ?? void 0) === (u[m] ?? void 0)
  );
  let a = !1;
  const d = i.map((l) => {
    if (!Fi(l)) return l;
    const u = o.find((b) => s(b, l));
    if (!u) return l;
    const m = { ...l };
    for (const [b, g] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const y = t[String(l[b] ?? "")];
      y && l[g] === y && !Pi(u[g]) && (delete m[g], a = !0);
    }
    return m;
  });
  return a ? { ...e, customFieldCriteria: d } : e;
}
async function pc(e, t, n) {
  if (!vn(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const i = me(e), o = n.steps.some((d) => Yt(d.mode)) ? await Ds(i) : "", s = await ki(n);
  let a = t.applications;
  for (const d of [
    ...s.filter((l) => !Yt(l.mode)),
    ...s.filter((l) => Yt(l.mode))
  ]) {
    const l = (u) => _s(
      o,
      i,
      t.media.id,
      t.performer.id,
      d.tagIds,
      u
    );
    (d.mode === "MARK_PRESENT" || d.mode === "CLEAR_ABSENCE") && await l("REMOVE"), d.mode !== "CLEAR_ABSENCE" && (a = await ga(
      {
        ...e,
        occurrence: {
          ...e.occurrence,
          tagIds: d.tagIds,
          multiple: !0
        }
      },
      t,
      ["ADD", "MARK_PRESENT"].includes(d.mode) ? d.tagIds : []
    )), d.mode === "MARK_ABSENT" && await l("ADD");
  }
  return a;
}
async function Di(e, t) {
  const n = e.occurrence;
  if (Ei(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const i = /* @__PURE__ */ new Set(), { _filterExpression: o, ...s } = n.performerFilter;
  for (let a = 1; ; a++) {
    const d = await Z("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Xt({
          findFilter: { page: a, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: s,
          filterExpression: o
        })
      )
    });
    if (d.items.forEach((l) => i.add(l.id)), a * 1e3 >= d.totalCount) return [...i];
    if (!d.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function pa(e) {
  return xn(e.condition) && e.hideConfirmedAbsent !== !1;
}
function _i(e, t) {
  const { _filterExpression: n, ...i } = e.view.objectFilter, o = e.occurrence, s = {
    mode: "atLeastOne",
    conditionOperator: "and",
    ...t === null ? {} : {
      performerIdsCriterion: { modifier: "includes", value: t }
    },
    ...o.condition === "any" ? {} : {
      performerOccurrenceTagsCriterion: {
        modifier: o.condition,
        value: o.conditionTagIds,
        depth: o.includeSubtags === !1 ? 0 : -1
      }
    }
  }, a = pa(o) && (t == null ? void 0 : t.length) === 1 && o.conditionTagIds.length === 1 ? `${t[0]}:${o.conditionTagIds[0]}` : null;
  return {
    ...e,
    entityType: me(e),
    actions: [],
    view: {
      ...e.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...n ? [{ group: n }] : [],
            { filter: i },
            { filter: { performerFilterCriterion: s } },
            ...a ? [
              {
                filter: {
                  customFieldCriteria: [
                    {
                      key: Dr,
                      type: "text",
                      modifier: "notEquals",
                      value: a
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
async function ji(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => _r([n], t))
  );
}
function ha(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function hc(e, t, n = e.conditionTagIds.map((i) => [i])) {
  const i = new Set(t), o = (s) => s.some((a) => i.has(a));
  switch (e.condition) {
    case "any":
      return !0;
    case "isNull":
      return i.size === 0;
    case "includes":
      return n.some(o);
    case "includesAll":
      return n.every(o);
    case "excludes":
      return !n.some(o);
    case "excludesAll":
      return !n.every(o);
  }
}
function mc(e, t, n, i, o) {
  if (!pa(e)) return !1;
  const s = Vo(t, n);
  return e.conditionTagIds.every(
    (a, d) => s.includes(a) || o[d].some((l) => i.includes(l))
  );
}
async function ma(e, t, n, i) {
  if ((t == null ? void 0 : t.length) === 0 || ha(e.occurrence))
    return { items: [], totalCount: 0 };
  const o = me(e), s = await ir(
    _i(e, t),
    { ...e.view.filter, page: n },
    i
  ), a = t === null ? null : new Set(t), d = e.occurrence, l = s.items.length ? await ji(d, i) : [], u = new Array(s.items.length);
  let m = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, s.items.length) }, async () => {
      for (; m < s.items.length; ) {
        const b = m++, g = s.items[b], y = await Z(
          `/api/tagapplications?hostType=${o}&hostId=${g.id}&contextType=performer`,
          { signal: i }
        );
        u[b] = g.performers.filter((v) => a === null || a.has(v.id)).flatMap((v) => {
          const S = y.filter(
            (O) => O.hostType === o && O.hostId === g.id && O.contextType === "performer" && O.contextId === v.id
          ), h = S.map((O) => O.tag.id);
          return hc(e.occurrence, h, l) && !mc(d, g, v.id, h, l) ? [
            {
              key: `${g.id}:${v.id}`,
              media: g,
              performer: v,
              applications: S
            }
          ] : [];
        });
      }
    })
  ), { items: u.flat(), totalCount: s.totalCount };
}
async function ga(e, t, n) {
  const i = new Set(e.occurrence.tagIds);
  if (n.some((u) => !i.has(u)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const o = me(e), s = await ai(o, t.media.id);
  if (!s.performers.some(
    (u) => u.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${o}. Refresh the queue.`
    );
  const a = `/api/tagapplications?hostType=${o}&hostId=${s.id}&contextType=performer&contextId=${t.performer.id}`, d = (await Z(a)).filter(
    (u) => u.hostType === o && u.hostId === s.id && u.contextType === "performer" && u.contextId === t.performer.id
  ), l = new Set(n);
  try {
    for (const u of l)
      d.some((m) => m.tag.id === u) || await Z("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: o,
          hostId: s.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: u,
          sourceKey: "user"
        })
      });
    for (const u of d)
      i.has(u.tag.id) && !l.has(u.tag.id) && await Z(`/api/tagapplications/${u.id}`, {
        method: "DELETE"
      });
    return await Z(a);
  } catch (u) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${u instanceof Error ? u.message : "Request failed."}`
    );
  }
}
function Dn(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function gc(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function Rt(e, t, n = !0) {
  var d;
  if (t.occurrence) {
    const l = n ? Vo(
      await ai(e, t.media.id),
      t.occurrence.performer.id
    ) : [], u = (await Z(gc(e, t))).filter(
      (m) => m.hostType === e && m.hostId === t.media.id && m.contextType === "performer" && m.contextId === t.occurrence.performer.id
    );
    return li(u.map((m) => m.tag)), {
      ids: [...new Set(u.map((m) => m.tag.id))],
      names: [...new Set(u.map((m) => m.tag.name))],
      absent: l,
      applications: u
    };
  }
  const i = await ai(e, t.media.id), o = (i.tags ?? []).filter(
    (l) => l.canRemove !== !1 || l.isDerived !== !0
  );
  li(o);
  const s = Object.keys(i.customFields ?? {}).find(
    (l) => l.toLowerCase() === Or
  ) ?? Or, a = ((d = i.customFields) == null ? void 0 : d[s]) ?? [];
  if (!Array.isArray(a) || a.some((l) => !Number.isSafeInteger(l)))
    throw new Error(
      `Confirmed absent tags are invalid. Inspect the ${e} before editing.`
    );
  return {
    ids: o.map((l) => l.id),
    names: o.map((l) => l.name),
    absent: a,
    tags: o
  };
}
async function Ui(e, t, n) {
  if (t.occurrence && ue(e))
    await ga(
      {
        ...e,
        occurrence: {
          ...e.occurrence,
          tagIds: [...n.added, ...n.removed],
          multiple: !0
        }
      },
      t.occurrence,
      n.added
    );
  else
    for (const [i, o] of [
      ["ADD", n.added],
      ["REMOVE", n.removed]
    ])
      o.length && await Z(
        `/api/${ln(me(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: i, tagIds: o })
        }
      );
}
async function bc(e, t, n) {
  t.occurrence && ue(e) ? await pc(e, t.occurrence, n) : await Jo(me(e), n, [t.media.id]);
}
function di(e, t, n, i) {
  const o = (s) => s.filter((a) => i.includes(a));
  return {
    item: e,
    before: t,
    after: n,
    tags: Dn(o(t.ids), o(n.ids)),
    absence: Dn(o(t.absent), o(n.absent))
  };
}
function yc(e, t) {
  var n;
  for (const [i, o] of [
    [e.tags, t.ids],
    [e.absence, t.absent]
  ])
    if (i.added.some((s) => !o.includes(s)) || i.removed.some((s) => o.includes(s)))
      throw new Error(
        "Undo conflict: affected tags changed since this operation. Inspect the item; no undo changes were made."
      );
  if (t.applications)
    for (const i of e.tags.added) {
      const o = (n = e.after.applications) == null ? void 0 : n.filter((a) => a.tag.id === i).map((a) => a.id).sort(), s = t.applications.filter((a) => a.tag.id === i).map((a) => a.id).sort();
      if (JSON.stringify(o) !== JSON.stringify(s))
        throw new Error(
          "Undo conflict: an affected occurrence application changed. No undo changes were made."
        );
    }
}
const ui = (e) => e instanceof Error ? e.message : "Request failed.", ao = (e) => [...e].sort((t, n) => t - n), sr = (e, t) => JSON.stringify(ao(e)) === JSON.stringify(ao(t)), fi = (e) => !!(e.tags.added.length || e.tags.removed.length);
function $r(e, t, n, i) {
  const o = new Set(e), s = new Set(e);
  for (const m of t.steps)
    for (const b of m.tagIds)
      m.mode === "ADD" ? s.add(b) : s.delete(b);
  const a = e.some((m) => !s.has(m));
  if (a && !i)
    return { desired: [...e], conflict: a, skipped: !0, kept: [], replaced: [] };
  const d = new Set(
    t.steps.filter((m) => m.mode === "ADD").flatMap((m) => m.tagIds)
  ), l = [], u = [];
  for (const m of n) {
    const b = m.filter((y) => s.has(y) && !o.has(y)), g = m.filter(
      (y) => s.has(y) && o.has(y) && !d.has(y)
    );
    !b.length || !g.length || (i ? (g.forEach((y) => s.delete(y)), u.push(...g)) : (b.forEach((y) => s.delete(y)), l.push({ tagIds: b, existing: g })));
  }
  return { desired: [...s], conflict: a, skipped: !1, kept: l, replaced: u };
}
function wc(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function vc(e, t, n, i) {
  for (const [o, s] of n.entries()) {
    const a = t.filter(
      (u) => u.steps.some(
        (m) => m.mode === "ADD" && m.tagIds.some((b) => s.includes(b))
      )
    );
    if (a.length < 2) continue;
    const d = e.occurrence.conditionTagIds[o];
    let l = `tag ${d}`;
    try {
      l = (await Z(`/api/tags/${d}`, { signal: i })).name;
    } catch {
      i.throwIfAborted();
    }
    throw new Error(
      `${a.map((u) => u.label).join(" and ")} answer the same condition tag, ${l}. Choose one of them.`
    );
  }
}
async function Nc(e, t, n, i = () => {
}) {
  if (!t.length || t.some(
    (g) => !vn(g, e.entityType) || !g.steps.length || g.steps.some(
      (y) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(y.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const o = structuredClone(e), s = structuredClone(t), a = xn(o.occurrence.condition) && o.occurrence.includeSubtags !== !1 ? await ji(o.occurrence, n) : [];
  await vc(o, s, a, n);
  const d = await Promise.all(
    s.map(async (g) => ({
      ...g,
      steps: await ki(g, n)
    }))
  ), l = structuredClone(wc(d));
  n.throwIfAborted();
  const u = [
    .../* @__PURE__ */ new Set([
      ...l.steps.flatMap((g) => g.tagIds),
      ...a.flat()
    ])
  ];
  o.view.filter = {
    ...o.view.filter,
    page: 1,
    perPage: 250,
    sort: "id",
    direction: "asc",
    sorts: void 0
  };
  const m = await Di(o, n), b = /* @__PURE__ */ new Map();
  for (let g = 1; ; g++) {
    n.throwIfAborted();
    const y = await ma(o, m, g, n);
    for (const v of y.items) {
      const S = {
        ids: [...new Set(v.applications.map((O) => O.tag.id))],
        names: v.applications.map((O) => O.tag.name),
        absent: [],
        applications: v.applications
      }, h = $r(S.ids, l, a, !0);
      b.set(v.key, {
        item: { key: v.key, media: v.media, occurrence: v },
        before: S,
        expected: S,
        conflict: h.conflict,
        status: sr(S.ids, h.desired) ? "unchanged" : "pending"
      });
    }
    if (i(b.size), g * 250 >= y.totalCount) break;
    if (g > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return n.throwIfAborted(), {
    review: o,
    actions: s,
    action: l,
    categories: a,
    touched: u,
    entries: [...b.values()]
  };
}
function Sc(e, t, n) {
  const i = (s) => s.ids.filter((a) => n.includes(a));
  if (!sr(i(e), i(t))) return !1;
  const o = (s) => (s.applications ?? []).filter((a) => n.includes(a.tag.id)).map((a) => a.id);
  return sr(o(e), o(t));
}
async function ba(e, t, n, i) {
  let o = 0;
  await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; !t() && o < e.length; ) {
        const s = e[o++];
        await n(s), i();
      }
    })
  );
}
async function qc(e, t, n, i, o = !1) {
  const s = e.entries.filter(
    (a) => o ? a.status === "failed" : a.status === "pending"
  );
  await ba(
    s,
    n,
    async (a) => {
      if (a.conflict && !t) {
        a.status = "skipped", a.error = "Conflicting answer skipped.";
        return;
      }
      if (a.unverified) {
        a.error = "The previous write could not be verified. Inspect this occurrence and create a fresh preview before further changes.";
        return;
      }
      let d;
      try {
        if (d = await Rt(me(e.review), a.item, !1), !Sc(a.expected, d, e.touched)) {
          a.status = "skipped", a.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (y) {
        a.status = "failed", a.error = ui(y);
        return;
      }
      const l = $r(
        a.before.ids,
        e.action,
        e.categories,
        t
      ), u = [
        ...d.ids.filter((y) => !e.touched.includes(y)),
        ...l.desired.filter((y) => e.touched.includes(y))
      ], m = Dn(d.ids, u);
      if (!m.added.length && !m.removed.length) {
        const y = !a.operation && l.kept.length > 0;
        a.status = a.operation ? "changed" : y ? "skipped" : "unchanged", a.error = y ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let b;
      try {
        await Ui(e.review, a.item, m);
      } catch (y) {
        b = y;
      }
      let g = !1;
      try {
        const y = await Rt(me(e.review), a.item, !1);
        g = !0, a.expected = y;
        const v = di(
          a.item,
          a.before,
          y,
          e.touched
        );
        if (a.operation = fi(v) ? v : void 0, b) throw b;
        if (!sr(
          y.ids.filter((S) => e.touched.includes(S)),
          u.filter((S) => e.touched.includes(S))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        a.status = a.operation ? "changed" : "unchanged", a.error = void 0;
      } catch (y) {
        if (a.status = "failed", a.error = ui(y), !g)
          try {
            const v = await Rt(me(e.review), a.item, !1);
            a.expected = v;
            const S = di(
              a.item,
              a.before,
              v,
              e.touched
            );
            a.operation = fi(S) ? S : void 0;
          } catch {
            a.unverified = !0;
          }
      }
    },
    i
  );
}
async function Ec(e, t, n) {
  await ba(
    e.entries.filter((i) => i.operation),
    t,
    async (i) => {
      const o = i.operation;
      if (i.unverified) {
        i.error = "Undo unavailable: the previous write could not be verified. Inspect this occurrence.";
        return;
      }
      const s = [...o.tags.added, ...o.tags.removed];
      let a = !1;
      try {
        const d = await Rt(me(e.review), i.item, !1);
        yc(o, d), a = !0, await Ui(e.review, i.item, {
          added: o.tags.removed,
          removed: o.tags.added
        });
        const l = await Rt(me(e.review), i.item, !1);
        if (!sr(
          l.ids.filter((u) => s.includes(u)),
          i.before.ids.filter((u) => s.includes(u))
        ))
          throw new Error("Undo did not restore all affected tags.");
        i.operation = void 0, i.expected = l, i.status = "unchanged", i.error = void 0;
      } catch (d) {
        if (i.error = `Undo stopped: ${ui(d)}`, i.status = "failed", a)
          try {
            const l = await Rt(me(e.review), i.item, !1), u = di(
              i.item,
              i.before,
              l,
              s
            );
            i.operation = fi(u) ? u : void 0, i.expected = l;
          } catch {
            i.unverified = !0;
          }
      }
    },
    n
  );
}
async function Cc(e, t, n) {
  const i = me(e), o = e.occurrence, [s, a] = await Promise.all([
    Z(
      `/api/tagapplications?hostType=${i}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    ji(o, n)
  ]), d = s.filter(
    (v) => v.hostType === i && v.contextType === "performer" && v.contextId === t
  );
  li(d.map((v) => v.tag));
  const l = await Promise.all(
    a.map(async (v, S) => {
      const h = o.conditionTagIds[S];
      return (await Z(`/api/tags/${h}`, { signal: n })).name;
    })
  ), u = new Set(a.flat()), m = new Set(
    [
      ...e.actions.flatMap((v) => v.steps).filter((v) => v.mode === "ADD" || v.mode === "MARK_PRESENT").flatMap((v) => v.tagIds),
      ...o.tagIds
    ].filter((v) => !u.has(v))
  ), b = (v) => {
    const S = /* @__PURE__ */ new Map();
    for (const h of d) {
      if (!v.has(h.tag.id)) continue;
      const O = S.get(h.tag.id) ?? {
        tag: h.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      O.hosts.add(h.hostId), S.set(h.tag.id, O);
    }
    return [...S.values()].map((h) => ({ ...h.tag, count: h.hosts.size })).sort((h, O) => O.count - h.count || ta(h, O));
  }, g = a.map((v, S) => ({
    id: o.conditionTagIds[S],
    name: l[S],
    tags: b(new Set(v))
  }));
  m.size && g.push({
    id: null,
    name: a.length ? "Other review tags" : "Review tags",
    tags: b(m)
  });
  const y = /* @__PURE__ */ new Set([...u, ...m]);
  return {
    answered: new Set(
      d.filter((v) => y.has(v.tag.id)).map((v) => v.hostId)
    ).size,
    groups: g
  };
}
function bn({ tag: e, name: t }) {
  return /* @__PURE__ */ r(xa, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: e ?? void 0 });
}
function ya({
  review: e,
  performerId: t,
  revision: n = 0
}) {
  const [i, o] = q(null), [s, a] = q(""), d = vt(me(e)), l = e.occurrence, u = JSON.stringify([
    e.entityType,
    t,
    l.condition,
    l.conditionTagIds,
    l.includeSubtags,
    l.tagIds,
    e.actions.map((b) => b.steps)
  ]);
  z(() => {
    const b = new AbortController();
    return o(null), a(""), Cc(e, t, b.signal).then((g) => {
      b.signal.aborted || o(g);
    }).catch((g) => {
      b.signal.aborted || a(g instanceof Error ? g.message : "Request failed.");
    }), () => b.abort();
  }, [u, n]);
  const m = (b) => `${b.toLocaleString()} ${b === 1 ? d.one : d.many}`;
  return /* @__PURE__ */ c("section", { className: "dq-panel-section dq-performer-answers", "aria-label": "Existing answers", children: [
    /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Existing answers" }),
      i && /* @__PURE__ */ r("span", { children: i.answered ? `${m(i.answered)} answered` : "none answered yet" })
    ] }),
    s ? /* @__PURE__ */ c("p", { role: "alert", children: [
      "Could not load existing answers. ",
      s
    ] }) : i ? i.groups.filter((b) => b.id !== null || b.tags.length).map((b) => /* @__PURE__ */ c("div", { className: "dq-answer-group", children: [
      /* @__PURE__ */ c("div", { className: "dq-answer-category", children: [
        /* @__PURE__ */ r("span", { children: b.name }),
        b.id !== null && b.tags.length > 1 && /* @__PURE__ */ r(
          "span",
          {
            className: "dq-badge dq-badge-warning",
            title: "This performer has different answers in this category.",
            children: "Mixed"
          }
        )
      ] }),
      b.tags.length ? /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": b.name, children: b.tags.map((g) => /* @__PURE__ */ c("li", { className: "dq-tag", children: [
        /* @__PURE__ */ r(bn, { tag: g }),
        /* @__PURE__ */ r("span", { className: "dq-chip-count", "aria-hidden": "true", children: g.count.toLocaleString() }),
        /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
          ", ",
          m(g.count)
        ] })
      ] }, g.id)) }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" })
    ] }, b.id ?? "other")) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading existing answers…" })
  ] });
}
async function so(e, t, n) {
  const i = new Array(e.length);
  let o = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; o < e.length; ) {
        n.throwIfAborted();
        const s = o++, a = e[s];
        try {
          i[s] = [
            a,
            (await Z(`/api/${t}/${a}`, {
              signal: n
            })).name
          ];
        } catch {
          n.throwIfAborted(), i[s] = [
            a,
            `${t === "tags" ? "Tag" : "Performer"} ${a}`
          ];
        }
      }
    })
  ), i;
}
function Ac(e, t) {
  const n = 1100 - (Date.now() - e);
  return n <= 0 ? Promise.resolve() : new Promise((i, o) => {
    const s = window.setTimeout(i, n);
    t.addEventListener(
      "abort",
      () => {
        window.clearTimeout(s), o(t.reason);
      },
      { once: !0 }
    );
  });
}
function kc({
  review: e,
  disabled: t,
  hidden: n = !1,
  performerFlags: i = [],
  onOpen: o,
  onClose: s,
  onWrite: a
}) {
  const [d, l] = q(!1), [u, m] = q(null), [b, g] = q([]), [y, v] = q(!1), [S, h] = q(!1), [O, C] = q(""), [I, U] = q(""), [D, A] = q({}), [k, L] = q(!1), [j, ae] = q(!1), J = k && u ? u.review : e, x = me(J), $ = vt(x), G = $.queue, E = x === "audio" ? "Audio" : "Scene", [X, ne] = q([]), [fe, ce] = q(!1), [, Se] = q(0), [Dt, _t] = q(0), jt = P(null), Ut = P(null), ye = P(!1), _e = P(null), qe = P(!1), Ze = P(0), ge = P(!1), et = P({ onClose: s, onWrite: a });
  et.current = { onClose: s, onWrite: a }, z(() => {
    var R;
    d && ((R = jt.current) == null || R.showModal());
  }, [d]), z(() => {
    if (!d || J.occurrence.targetMode !== "selected") return;
    const R = new AbortController();
    return ne([]), so(
      J.occurrence.performerIds,
      "performers",
      R.signal
    ).then((W) => {
      R.signal.aborted || ne(W.map(([, Oe]) => Oe));
    }).catch(() => {
    }), () => R.abort();
  }, [
    d,
    J.occurrence.targetMode,
    JSON.stringify(J.occurrence.performerIds)
  ]), z(
    () => () => {
      var R;
      ye.current = !0, (R = _e.current) == null || R.abort();
    },
    []
  ), z(() => {
    if (!S) return;
    const R = (W) => {
      W.preventDefault(), W.returnValue = "";
    };
    return window.addEventListener("beforeunload", R), () => window.removeEventListener("beforeunload", R);
  }, [S]);
  function Je() {
    m(null), L(!1), ae(!1), v(!1), g([]), U(""), C(""), ce(!1);
  }
  function Re() {
    ge.current || (l(!1), et.current.onClose(qe.current), qe.current = !1, Je(), requestAnimationFrame(() => {
      var R;
      return (R = Ut.current) == null ? void 0 : R.focus();
    }));
  }
  const le = k && u ? u.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((R) => R.steps.length && !cn(R))
  );
  async function oe() {
    const R = le.filter((W) => b.includes(W.id));
    if (!(!R.length || ge.current)) {
      ge.current = !0, h(!0), C(""), U("Loading all matching occurrences…"), m(null), L(!1), ae(!1), ce(!1), _e.current = new AbortController();
      try {
        await Ac(Ze.current, _e.current.signal);
        const W = await Nc(
          e,
          R,
          _e.current.signal,
          (Pe) => U(`Loaded ${Pe.toLocaleString()} matching occurrences…`)
        ), Oe = /* @__PURE__ */ new Map();
        for (const Pe of W.entries)
          for (const pe of Pe.before.applications ?? [])
            Oe.set(pe.tag.id, pe.tag.name);
        const tt = await so(
          [
            .../* @__PURE__ */ new Set([
              ...W.actions.flatMap(
                (Pe) => Pe.steps.flatMap((pe) => pe.tagIds)
              ),
              ...W.review.occurrence.conditionTagIds,
              ...xi(W.review.view.objectFilter)
            ])
          ].filter((Pe) => !Oe.has(Pe)),
          "tags",
          _e.current.signal
        );
        _e.current.signal.throwIfAborted(), A({ ...Object.fromEntries(Oe), ...Object.fromEntries(tt) }), m(W), U("Preview ready. No tags have been changed.");
      } catch (W) {
        C(
          _e.current.signal.aborted ? "Preview cancelled. No tags were changed." : String(W instanceof Error ? W.message : W)
        ), U("");
      } finally {
        ge.current = !1, h(!1), _e.current = null;
      }
    }
  }
  async function F(R) {
    if (!u || ge.current) return;
    ge.current = !0, ye.current = !1, qe.current = !0, et.current.onWrite(), h(!0), L(!0), C(""), R === "undo" && ae(!0), U(R === "undo" ? "Undoing batch…" : "Applying batch…");
    const W = () => Se((Oe) => Oe + 1);
    try {
      R === "undo" ? await Ec(u, () => ye.current, W) : await qc(
        u,
        y,
        () => ye.current,
        W,
        R === "retry"
      ), U(
        ye.current ? "Stopped after in-flight operations settled. Completed changes are retained." : R === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (Oe) {
      C(Oe instanceof Error ? Oe.message : String(Oe));
    } finally {
      Ze.current = Date.now(), ge.current = !1, h(!1), _t((Oe) => Oe + 1), W();
    }
  }
  const H = (u == null ? void 0 : u.entries) ?? [], je = Ve(
    () => new Map(
      ((u == null ? void 0 : u.entries) ?? []).map((R) => [
        R.item.key,
        $r(R.before.ids, u.action, u.categories, y)
      ])
    ),
    [u, y]
  ), Ne = (R) => je.get(R.item.key), Q = (R) => Dn(R.before.ids, Ne(R).desired), Ot = (R) => {
    const W = Q(R);
    return R.status === "pending" && (W.added.length > 0 || W.removed.length > 0);
  }, dn = (R) => {
    const W = Ne(R), Oe = W.skipped ? Dn(
      R.before.ids,
      $r(R.before.ids, u.action, u.categories, !0).desired
    ) : Q(R);
    return [
      W.skipped ? "Skipped unless conflicting answers are replaced. " : "",
      `Add: ${Ue(Oe.added)}; Remove: ${Ue(Oe.removed)}`,
      ...W.kept.map(
        (tt) => `; Keeps ${Ue(tt.existing)} instead of ${Ue(tt.tagIds)}`
      )
    ].join("");
  }, Nt = H.filter((R) => R.conflict), ht = H.filter(
    (R) => Ne(R).kept.length || Ne(R).replaced.length
  ), We = (R) => H.filter((W) => W.status === R).length, Me = H.some((R) => R.operation), Ue = (R) => R.map((W) => D[W] ?? `Tag ${W}`).join(", ") || "None", He = H.filter((R) => R.item.media.date).sort((R, W) => R.item.media.date.localeCompare(W.item.media.date)), It = (R, W) => /* @__PURE__ */ r(
    "a",
    {
      href: `/${x}/${R.item.media.id}`,
      target: "_blank",
      rel: "noreferrer",
      "aria-label": `${W} ${$.one}, ${R.item.media.date}`,
      title: R.item.media.title || E,
      children: R.item.media.date
    }
  ), St = J.occurrence.targetMode === "selected" && J.occurrence.performerIds.length === 1, Mt = xn(J.occurrence.condition) && J.occurrence.includeSubtags !== !1 && J.occurrence.conditionTagIds.length > 0;
  return /* @__PURE__ */ c(se, { children: [
    /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        hidden: n,
        ref: Ut,
        title: "Apply answers to all matching occurrences",
        disabled: t || !le.length,
        onClick: () => {
          Je(), o(), l(!0);
        },
        children: [
          /* @__PURE__ */ r(Qa, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    d && /* @__PURE__ */ c(
      "dialog",
      {
        ref: jt,
        className: "dq-batch-dialog",
        "aria-labelledby": "dq-batch-title",
        "aria-modal": "true",
        onCancel: (R) => {
          R.preventDefault(), Re();
        },
        children: [
          /* @__PURE__ */ r("h2", { id: "dq-batch-title", children: "Batch occurrence approval" }),
          /* @__PURE__ */ r("p", { children: "Apply one or more answers across all matching pages. Only targeted performer occurrences change." }),
          /* @__PURE__ */ r("p", { children: "Keep this page open while running. Results and undo last until you close this dialog or start a new batch." }),
          /* @__PURE__ */ c("fieldset", { disabled: S || k, children: [
            /* @__PURE__ */ r("legend", { children: "Batch scope and answers" }),
            /* @__PURE__ */ r("p", { children: "Uses your current filters. To include every existing appearance, remove filters that exclude already answered occurrences." }),
            /* @__PURE__ */ c("p", { children: [
              "Performer scope:",
              " ",
              Ei(J.occurrence) ? "All performers" : J.occurrence.targetMode === "selected" ? X.join(", ") || `${J.occurrence.performerIds.length} selected performer(s)` : "Matching performer criteria",
              ". Occurrence condition:",
              " ",
              Pr[J.occurrence.condition],
              "."
            ] }),
            i.length > 0 && /* @__PURE__ */ c("p", { className: "dq-batch-flag", children: [
              /* @__PURE__ */ c("strong", { children: [
                "Flagged: ",
                i.join(", "),
                "."
              ] }),
              " Check the earliest and latest ",
              $.many,
              " before applying, or narrow the batch with a date filter."
            ] }),
            xn(J.occurrence.condition) && J.occurrence.hideConfirmedAbsent !== !1 && /* @__PURE__ */ r("p", { children: J.occurrence.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged." }),
            J.occurrence.conditionTagIds.length > 0 && u && /* @__PURE__ */ c("p", { children: [
              "Condition tags:",
              " ",
              Ue(J.occurrence.conditionTagIds),
              J.occurrence.includeSubtags === !1 ? " (exact tags only)" : " (including subtags)",
              "."
            ] }),
            /* @__PURE__ */ c("p", { children: [
              "Search: ",
              String(J.view.filter.q || "Any"),
              ".",
              " ",
              Object.keys(J.view.objectFilter).length === 0 && `${G[0].toUpperCase()}${G.slice(1)} filters: None.`
            ] }),
            /* @__PURE__ */ r(
              "fieldset",
              {
                className: "dq-batch-filter-summary",
                disabled: !0,
                "aria-label": `Batch ${G} filters`,
                children: /* @__PURE__ */ r(
                  ar,
                  {
                    filter: J.view.filter,
                    objectFilter: Li(
                      J.view.objectFilter,
                      D
                    ),
                    criteriaDefinitions: x === "audio" ? mi : Fr,
                    customFieldEntityType: x,
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
            J.occurrence.targetMode === "filter" && /* @__PURE__ */ r(
              "fieldset",
              {
                className: "dq-batch-filter-summary",
                disabled: !0,
                "aria-label": "Batch performer criteria",
                children: /* @__PURE__ */ r(
                  ar,
                  {
                    filter: {},
                    objectFilter: J.occurrence.performerFilter,
                    criteriaDefinitions: gi,
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
            St && /* @__PURE__ */ r(
              ya,
              {
                review: J,
                performerId: J.occurrence.performerIds[0],
                revision: Dt
              }
            ),
            !le.length && /* @__PURE__ */ r("p", { children: "Configure an occurrence tag action in this review before starting a batch." }),
            /* @__PURE__ */ c("fieldset", { className: "dq-batch-answers", children: [
              /* @__PURE__ */ r("legend", { children: "Answers" }),
              le.map((R) => /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "checkbox",
                    checked: k || b.includes(R.id),
                    onChange: (W) => {
                      g(
                        W.target.checked ? [...b, R.id] : b.filter((Oe) => Oe !== R.id)
                      ), m(null), U(""), C("");
                    }
                  }
                ),
                R.label
              ] }, R.id))
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: !b.length,
                onClick: () => void oe(),
                children: "Preview all matches"
              }
            ),
            /* @__PURE__ */ c("label", { children: [
              "Conflicting answers",
              " ",
              /* @__PURE__ */ c(
                "select",
                {
                  "aria-label": "Conflicting answers",
                  value: y ? "replace" : "skip",
                  onChange: (R) => v(R.target.value === "replace"),
                  children: [
                    /* @__PURE__ */ r("option", { value: "skip", children: "Skip conflicts" }),
                    /* @__PURE__ */ r("option", { value: "replace", children: "Replace conflicting answers" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ c("p", { children: [
              "Conflicts are existing tags an answer removes. Configure opposite answers as removals.",
              Mt && " Each condition tag with its subtags is a category: an answer is added only where its category is still empty, and a different existing answer is kept unless conflicting answers are replaced."
            ] })
          ] }),
          /* @__PURE__ */ c("div", { "aria-live": "polite", children: [
            I && /* @__PURE__ */ r("p", { role: "status", children: I }),
            O && /* @__PURE__ */ r("p", { role: "alert", children: O }),
            u && /* @__PURE__ */ c(se, { children: [
              /* @__PURE__ */ r("p", { children: /* @__PURE__ */ c("strong", { children: [
                H.length.toLocaleString(),
                " occurrences in",
                " ",
                new Set(
                  H.map((R) => R.item.media.id)
                ).size.toLocaleString(),
                " ",
                G,
                "s"
              ] }) }),
              k ? /* @__PURE__ */ c("p", { children: [
                We("changed"),
                " changed; ",
                We("unchanged"),
                " unchanged;",
                " ",
                We("skipped"),
                " skipped; ",
                We("failed"),
                " failed;",
                " ",
                We("pending"),
                " remaining."
              ] }) : /* @__PURE__ */ c("p", { children: [
                H.filter(Ot).length.toLocaleString(),
                " to change; ",
                We("unchanged").toLocaleString(),
                " already correct; ",
                Nt.length.toLocaleString(),
                " conflicts (",
                y ? "will replace" : "will skip",
                ").",
                ht.length > 0 && ` ${ht.length.toLocaleString()} already have a different answer in a category (${y ? "will replace" : "kept"}).`
              ] }),
              H.length > 0 && /* @__PURE__ */ c("p", { children: [
                "Dates:",
                " ",
                He.length ? /* @__PURE__ */ c(se, { children: [
                  It(He[0], "Earliest"),
                  He.length > 1 && /* @__PURE__ */ c(se, { children: [
                    " to ",
                    It(He[He.length - 1], "Latest")
                  ] })
                ] }) : "none",
                He.length < H.length && `; ${(H.length - He.length).toLocaleString()} without a date`,
                "."
              ] })
            ] })
          ] }),
          u && /* @__PURE__ */ c(se, { children: [
            !k && /* @__PURE__ */ c("p", { children: [
              "Planned additions:",
              " ",
              Ue([
                ...new Set(H.flatMap((R) => Q(R).added))
              ]),
              ". Planned removals:",
              " ",
              Ue([
                ...new Set(H.flatMap((R) => Q(R).removed))
              ]),
              "."
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => ce(!fe),
                children: fe ? "Hide occurrence details" : "Inspect occurrences and conflicts"
              }
            ),
            fe && /* @__PURE__ */ r("div", { className: "dq-batch-items", children: /* @__PURE__ */ c("table", { children: [
              /* @__PURE__ */ r("thead", { children: /* @__PURE__ */ c("tr", { children: [
                /* @__PURE__ */ r("th", { children: "Occurrence" }),
                /* @__PURE__ */ r("th", { children: "Changes / result" })
              ] }) }),
              /* @__PURE__ */ r("tbody", { children: H.map((R) => {
                var W;
                return /* @__PURE__ */ c("tr", { children: [
                  /* @__PURE__ */ r("td", { children: /* @__PURE__ */ c(
                    "a",
                    {
                      href: `/${x}/${R.item.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      children: [
                        (W = R.item.occurrence) == null ? void 0 : W.performer.name,
                        " —",
                        " ",
                        R.item.media.title || E
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ c("td", { children: [
                    R.conflict && /* @__PURE__ */ r("strong", { children: "Conflict. " }),
                    k ? `${R.status}. ${R.error ?? ""}` : dn(R)
                  ] })
                ] }, R.item.key);
              }) })
            ] }) }),
            /* @__PURE__ */ c("div", { className: "dq-row", children: [
              !j && /* @__PURE__ */ c(se, { children: [
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    className: "dq-button primary",
                    disabled: S || !We("pending"),
                    onClick: () => void F("apply"),
                    children: k ? "Continue remaining" : "Apply batch"
                  }
                ),
                k && We("failed") > 0 && /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: S,
                    onClick: () => void F("retry"),
                    children: "Retry failed occurrences"
                  }
                )
              ] }),
              Me && /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  disabled: S,
                  onClick: () => void F("undo"),
                  children: "Undo batch"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ c("div", { className: "dq-row", children: [
            S && /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => {
                  var R;
                  ye.current = !0, (R = _e.current) == null || R.abort(), U("Stopping after in-flight operations settle…");
                },
                children: [
                  "Cancel ",
                  _e.current ? "preview" : "run"
                ]
              }
            ),
            k && /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: S,
                onClick: Je,
                children: "New batch"
              }
            ),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: S,
                onClick: Re,
                children: "Close"
              }
            )
          ] })
        ]
      }
    )
  ] });
}
const wa = "data-quality.description-collapsed.v1";
function Tc() {
  try {
    return localStorage.getItem(wa) === "true";
  } catch {
    return !1;
  }
}
function Rc({
  details: e,
  label: t
}) {
  const [n, i] = q(Tc), o = Ht(() => {
    i((s) => {
      const a = !s;
      try {
        localStorage.setItem(wa, String(a));
      } catch {
      }
      return a;
    });
  }, []);
  return /* @__PURE__ */ c("section", { className: "dq-media-description", "aria-label": `${t} description`, children: [
    /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button dq-description-toggle",
        "aria-expanded": !n,
        onClick: o,
        children: "Description"
      }
    ),
    !n && (e != null && e.trim() ? /* @__PURE__ */ r(La, { className: "dq-description-body", children: e }) : /* @__PURE__ */ r("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
function nr({
  performer: e
}) {
  return /* @__PURE__ */ c("span", { className: "dq-performer-avatar", "aria-hidden": "true", children: [
    /* @__PURE__ */ r("span", { children: e.name.trim().split(/\s+/).slice(0, 2).map((t) => t[0]).join("").toUpperCase() || "?" }),
    /* @__PURE__ */ r(
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
function Oc({
  ranking: e,
  busy: t,
  error: n,
  focus: i,
  disabled: o,
  labels: s,
  onFocus: a,
  onMore: d,
  onRefresh: l
}) {
  var b;
  const u = e ? e.ranked.slice(0, e.limit) : [], m = !!e && (e.ranked.length > e.limit || (((b = e.candidates[e.cursor]) == null ? void 0 : b.total) ?? 0) > 0);
  return /* @__PURE__ */ c("div", { className: "dq-performer-ranking", children: [
    /* @__PURE__ */ c("div", { className: "dq-performer-ranking-status", children: [
      n ? /* @__PURE__ */ c("p", { role: "alert", children: [
        "Could not rank performers. ",
        n
      ] }) : t ? /* @__PURE__ */ c("p", { role: "status", children: [
        "Counting matching ",
        s.many,
        " per performer…"
      ] }) : e ? /* @__PURE__ */ r("p", { children: u.length ? `Most matching ${s.queue}s first` : `No performer has matching ${s.many}.` }) : null,
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "Refresh counts",
          title: "Refresh counts",
          disabled: t || o,
          onClick: l,
          children: /* @__PURE__ */ r(Wa, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-queue-list", children: u.map((g) => {
      const y = `${g.count.toLocaleString()} matching ${g.count === 1 ? s.one : s.many}`, v = g.flags.length ? `Flagged: ${g.flags.join(", ")}` : "";
      return /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${g.name}, ${y}${v ? `. ${v}` : ""}`,
          title: v || void 0,
          "aria-current": i === g.id ? "true" : void 0,
          disabled: o,
          onClick: () => a(g.id),
          children: [
            /* @__PURE__ */ r(nr, { performer: g }),
            /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: g.name }),
            v && /* @__PURE__ */ r(ti, { className: "dq-flag-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ r("span", { className: "dq-ranked-count", "aria-hidden": "true", children: g.count.toLocaleString() })
          ]
        },
        g.id
      );
    }) }),
    m && !t && !n && /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button dq-ranking-more",
        disabled: o,
        onClick: d,
        children: "Show more performers"
      }
    )
  ] });
}
const Ic = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], Mc = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function $c(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), i = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), o = t.bottom + 8;
  return { top: o, left: i, width: n, maxHeight: Math.max(160, window.innerHeight - o - 16) };
}
function Er(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function Fc(e, t) {
  const n = Ei(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", i = e.conditionTagIds.map(
    (s) => t[s] === void 0 ? "…" : t[s] ?? "Unavailable tag"
  ), o = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${Er(i, "or")}`,
    includesAll: `has ${Er(i, "and")}`,
    excludes: `has none of ${Er(i, "or")}`,
    excludesAll: `missing ${Er(i, "or")}`
  };
  return `${n} · ${o[e.condition]}`;
}
function Pc({
  scope: e,
  disabled: t,
  onChange: n,
  onEditCriteria: i
}) {
  const [o, s] = q(!1), [a, d] = q(null), l = P(null), u = P(null), m = jn(), b = dr(e.conditionTagIds), g = Fc(e, b);
  wn(() => {
    if (!o || !l.current) return;
    const h = () => l.current && d($c(l.current));
    return h(), window.addEventListener("resize", h), () => window.removeEventListener("resize", h);
  }, [o]), z(() => {
    var O, C;
    if (!o) return;
    const h = (O = u.current) == null ? void 0 : O.querySelector('[aria-pressed="true"]');
    h && !h.disabled ? h.focus() : (C = u.current) == null || C.focus();
  }, [o]);
  const y = () => {
    s(!1), requestAnimationFrame(() => {
      var h;
      return (h = l.current) == null ? void 0 : h.focus();
    });
  }, v = (h) => {
    if (!(h.target instanceof Element && h.target.closest('[role="dialog"]') !== u.current || h.defaultPrevented)) {
      if (h.key === "Escape")
        h.preventDefault(), y();
      else if (h.key === "Tab" && u.current) {
        const C = [...u.current.querySelectorAll(Mc)].filter((A) => A.closest('[role="dialog"]') === u.current).sort(
          (A, k) => A.compareDocumentPosition(k) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!C.length) return;
        const I = C[0], U = C[C.length - 1], D = document.activeElement;
        h.shiftKey && (D === I || D === u.current) ? (h.preventDefault(), U.focus()) : !h.shiftKey && D === U && (h.preventDefault(), I.focus());
      }
    }
  }, S = !["any", "isNull"].includes(e.condition);
  return /* @__PURE__ */ c("div", { className: "dq-scope", children: [
    /* @__PURE__ */ c(
      "button",
      {
        ref: l,
        type: "button",
        className: "dq-header-button dq-scope-button",
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        "aria-controls": o ? m : void 0,
        title: g,
        onClick: () => o ? y() : s(!0),
        children: [
          /* @__PURE__ */ r(Ha, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-summary", children: g }),
          /* @__PURE__ */ r(Ya, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ c(se, { children: [
      /* @__PURE__ */ r("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: y }),
      /* @__PURE__ */ c(
        "div",
        {
          ref: u,
          id: m,
          role: "dialog",
          "aria-label": "Queue scope",
          className: "dq-scope-popover",
          tabIndex: -1,
          style: a ? {
            top: a.top,
            left: a.left,
            width: a.width,
            maxHeight: a.maxHeight
          } : void 0,
          onKeyDown: v,
          children: [
            /* @__PURE__ */ c("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Performers to review" }),
              /* @__PURE__ */ r("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: Ic.map(({ mode: h, label: O }) => /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === h,
                  onClick: () => e.targetMode !== h && n({ targetMode: h }),
                  children: O
                },
                h
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ r(
                Lt,
                {
                  entityType: "performer",
                  values: e.performerIds,
                  onChange: (h) => n({ performerIds: h }),
                  placeholder: "All performers...",
                  allowCreate: !1
                }
              ),
              e.targetMode === "filter" && /* @__PURE__ */ c("div", { className: "dq-scope-criteria", children: [
                /* @__PURE__ */ r("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ r(
                  ar,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: gi,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (h) => n({ performerFilter: h })
                  }
                ) }),
                /* @__PURE__ */ c("button", { type: "button", className: "dq-button", onClick: i, children: [
                  /* @__PURE__ */ r(vi, { "aria-hidden": "true" }),
                  "Edit criteria"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Occurrence tags" }),
              /* @__PURE__ */ r(
                "select",
                {
                  className: "dq-select",
                  "aria-label": "Occurrence condition",
                  value: e.condition,
                  onChange: (h) => n({ condition: h.target.value }),
                  children: xr.map((h) => /* @__PURE__ */ r("option", { value: h, children: Pr[h] }, h))
                }
              ),
              S && /* @__PURE__ */ c(se, { children: [
                /* @__PURE__ */ r(
                  Lt,
                  {
                    entityType: "tag",
                    values: e.conditionTagIds,
                    onChange: (h) => n({ conditionTagIds: h }),
                    placeholder: "Add a condition tag…",
                    allowCreate: !1
                  }
                ),
                /* @__PURE__ */ c("div", { className: "dq-scope-options", children: [
                  /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ r(
                      "input",
                      {
                        type: "checkbox",
                        checked: e.includeSubtags ?? !0,
                        onChange: (h) => n({ includeSubtags: h.target.checked })
                      }
                    ),
                    "Include subtags"
                  ] }),
                  xn(e.condition) && /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ r(
                      "input",
                      {
                        type: "checkbox",
                        checked: e.hideConfirmedAbsent ?? !0,
                        onChange: (h) => n({ hideConfirmedAbsent: h.target.checked })
                      }
                    ),
                    "Hide occurrences confirmed absent"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c("div", { className: "dq-scope-footer", children: [
              /* @__PURE__ */ r("p", { children: "Applies to this queue at once. Save it to the review from the filter row." }),
              /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: y, children: "Done" })
            ] })
          ]
        }
      )
    ] })
  ] });
}
function Ar(e) {
  const {
    page: t,
    perPage: n,
    sort: i,
    direction: o,
    sorts: s,
    seed: a,
    ...d
  } = e.view.filter;
  return JSON.stringify([
    e.entityType,
    d,
    e.view.objectFilter,
    e.view.searchMode,
    e.occurrence
  ]);
}
function xc(e) {
  const t = e.occurrence;
  return JSON.stringify([
    me(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {},
    t.flagPerformerTagIds ?? []
  ]);
}
async function Lc(e, t) {
  const n = me(e) === "audio", i = new Set(e.occurrence.flagPerformerTagIds ?? []), o = (d) => ({
    id: d.id,
    name: d.name,
    total: (n ? d.audioCount : d.videoCount) ?? 0,
    flags: (d.tags ?? []).filter((l) => i.has(l.id)).map((l) => l.name)
  }), s = e.occurrence, a = [];
  if (s.targetMode === "selected" && s.performerIds.length > 0)
    for (const d of s.performerIds) {
      const l = await ks(
        `/api/performers/${d}`,
        { signal: t }
      );
      l && a.push(o(l));
    }
  else {
    const { _filterExpression: d, ...l } = s.targetMode === "filter" ? s.performerFilter : {};
    for (let u = 1; ; u++) {
      const m = await Z(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            Xt({
              findFilter: {
                page: u,
                perPage: 1e3,
                sort: n ? "audio_count" : "video_count",
                direction: "desc"
              },
              objectFilter: l,
              filterExpression: d
            })
          )
        }
      );
      if (a.push(...m.items.map(o)), u * 1e3 >= m.totalCount || !m.items.length) break;
    }
  }
  return a.sort((d, l) => l.total - d.total || d.id - l.id);
}
function va(e, t, n) {
  const i = _i(e, [t]);
  return Os(i, i.view.filter, n);
}
function Na(e, t) {
  const n = e.findIndex(
    (i) => i.count < t.count || i.count === t.count && i.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function pi(e, t, n, i) {
  if (t >= e.length) return !0;
  const o = e[t].total;
  return o <= 0 ? !0 : n.length >= i && o < n[i - 1].count;
}
async function Dc(e, t, n, i, o = {}) {
  const s = Ar(e), a = xc(e), d = ha(e.occurrence), l = (t == null ? void 0 : t.signature) === s && !t.partial ? t : {
    signature: s,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: d ? "" : a,
    candidates: d ? [] : (t == null ? void 0 : t.candidatesKey) === a ? t.candidates : await Lc(e, i),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: u } = l, m = [...l.ranked];
  let b = l.cursor, g = !1;
  const y = (v) => ({
    ...l,
    cursor: b,
    ranked: [...m],
    limit: n,
    complete: !v && pi(u, b, m, n),
    ...v ? { partial: v } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: o.concurrency ?? 6 }, async () => {
        var v;
        for (; !g && !pi(u, b, m, n); ) {
          i.throwIfAborted();
          const S = u[b++], h = await va(e, S.id, i);
          h > 0 && Na(m, { ...S, count: h }), (v = o.onProgress) == null || v.call(o, y(!0));
        }
      })
    );
  } catch (v) {
    throw g = !0, v;
  }
  return i.throwIfAborted(), y(!1);
}
function _c(e, t, n) {
  const i = e.candidates.findIndex((s) => s.id === t);
  if (e.partial || i < 0 || i >= e.cursor) return e;
  const o = e.ranked.filter((s) => s.id !== t);
  return n > 0 && Na(o, { ...e.candidates[i], count: n }), {
    ...e,
    ranked: o,
    complete: pi(e.candidates, e.cursor, o, e.limit)
  };
}
function _n(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((a, d) => _n(a, t[d]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, i = t, o = Object.keys(n).sort(), s = Object.keys(i).sort();
  return o.length === s.length && o.every(
    (a, d) => a === s[d] && _n(n[a], i[a])
  );
}
const jr = [
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
  "performer",
  "startFrom"
], jc = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function Pn(e) {
  const t = ue(e) ? e.occurrence : void 0;
  return {
    filter: Xe({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, me(e)),
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
function co(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function hi(e, t) {
  let n;
  if (ue(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!jr.some((d) => d !== "performer" && t.has(d))) {
    const d = Pn(e);
    return {
      query: n ? { ...d, performerFocus: n } : d,
      startAtEnd: d.startFrom === "end"
    };
  }
  const o = {
    q: t.get("q") ?? "",
    page: Number(t.get("page") ?? 1),
    perPage: Number(t.get("perPage") ?? 40),
    sort: t.get("sort") ?? "date",
    direction: t.get("direction") === "asc" ? "asc" : "desc"
  };
  if (t.has("seed") && (o.seed = Number(t.get("seed"))), t.get("sorts")) {
    const d = t.get("sorts").split(",").map((l) => {
      const u = l.lastIndexOf(":");
      return { key: l.slice(0, u), direction: l.slice(u + 1) };
    });
    if (d.some((l) => !l.key || !["asc", "desc"].includes(l.direction)))
      throw new Error("Invalid review URL sort.");
    o.sorts = d, o.sort = d[0].key, o.direction = d[0].direction;
  }
  let s;
  if (ue(e) && (s = {
    ...jc,
    ...co(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(s.targetMode) || !xr.includes(s.condition) || !Array.isArray(s.performerIds) || !Array.isArray(s.conditionTagIds) || typeof s.includeSubtags != "boolean" || typeof s.hideConfirmedAbsent != "boolean" || [...s.performerIds, ...s.conditionTagIds].some(
    (d) => !Number.isSafeInteger(d) || d <= 0
  ) || !s.performerFilter || typeof s.performerFilter != "object" || Array.isArray(s.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const a = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Xe(o, me(e)),
      objectFilter: co(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: a,
      performerScope: s,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && a === "end"
  };
}
function or(e, t) {
  const n = new URLSearchParams(window.location.search);
  jr.forEach((i) => n.delete(i)), n.set("review", e);
  for (const i of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[i] !== void 0 && n.set(i, String(t.filter[i]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((i) => `${i.key}:${i.direction}`).join(",")
  ), n.set("filters", JSON.stringify(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", JSON.stringify(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), window.history.replaceState(
    null,
    "",
    `${window.location.pathname}?${n}${window.location.hash}`
  );
}
function Pt(e, t) {
  const n = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return ue(e) ? {
    ...e,
    view: n,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: n };
}
function lo(e, t) {
  return !t || !ue(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function Wr(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const i of e)
    n.set(i.media.id, [...n.get(i.media.id) ?? [], i]);
  return [...n.values()].reverse().flat();
}
const yt = (e) => e instanceof Error ? e.message : "Request failed.", Hr = 50, uo = '[role="dialog"]:not(.dq-scope-popover), dialog[open]';
function Uc(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? _a(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? No(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function Gc({ media: e, kind: t }) {
  const [n, i] = q(!1);
  return /* @__PURE__ */ r("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ r(Co, {}) : /* @__PURE__ */ r(kr, {}) : /* @__PURE__ */ r(
    "img",
    {
      src: si(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => i(!0)
    }
  ) });
}
function Kc({
  tags: e,
  preview: t,
  showPreview: n,
  trees: i,
  actionTagIds: o,
  label: s
}) {
  const a = Mi(t), d = n ? a : null, l = e == null ? void 0 : e.absent, u = Zo(
    Ve(() => [...o, ...l ?? []], [o, l])
  ), m = (D) => u[D] ?? { id: D, name: u[D] === void 0 ? "…" : "Unavailable tag" }, b = (D) => na(D.map(m)), g = d && e ? ra(d, e, i) : null, y = e ? sc(e) : [], v = new Set(y.map((D) => D.id)), S = new Set(g == null ? void 0 : g.removed), h = new Set(g == null ? void 0 : g.markedAbsent), O = new Set(g == null ? void 0 : g.absenceCleared), C = /* @__PURE__ */ c("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ r(ei, { "aria-hidden": "true" }),
    "absent"
  ] }), I = b((g == null ? void 0 : g.added) ?? []), U = b(((g == null ? void 0 : g.markedAbsent) ?? []).filter((D) => !v.has(D)));
  return /* @__PURE__ */ c("section", { className: "dq-panel-section", "aria-label": s, children: [
    /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ c(se, { children: [
      y.length || I.length || U.length ? /* @__PURE__ */ c("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        y.map(
          (D) => S.has(D.id) ? /* @__PURE__ */ c("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ c("del", { children: [
              "− ",
              /* @__PURE__ */ r(bn, { tag: D })
            ] }),
            h.has(D.id) && C
          ] }, D.id) : /* @__PURE__ */ r("li", { className: "dq-tag", children: /* @__PURE__ */ r(bn, { tag: D }) }, D.id)
        ),
        I.map((D) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ c("ins", { children: [
          "+ ",
          /* @__PURE__ */ r(bn, { tag: D })
        ] }) }, `added-${D.id}`)),
        U.map((D) => /* @__PURE__ */ c("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ r("ins", { children: /* @__PURE__ */ r(bn, { tag: D }) }),
          C
        ] }, `absent-${D.id}`))
      ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" }),
      e.absent.length > 0 && /* @__PURE__ */ c(se, { children: [
        /* @__PURE__ */ r("h4", { className: "dq-subheading", children: "Confirmed absent" }),
        /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: b(e.absent).map((D) => /* @__PURE__ */ c(
          "li",
          {
            className: `dq-tag dq-tag-absent${O.has(D.id) ? " dq-tag-removed" : ""}`,
            children: [
              /* @__PURE__ */ r(ei, { "aria-hidden": "true" }),
              O.has(D.id) ? /* @__PURE__ */ c("del", { children: [
                "− ",
                /* @__PURE__ */ r(bn, { tag: D })
              ] }) : /* @__PURE__ */ r(bn, { tag: D })
            ]
          },
          D.id
        )) })
      ] })
    ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading…" })
  ] });
}
function Bc({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: i,
  onSaveDefaults: o,
  editRequest: s = 0,
  renderRuleEditor: a,
  pageControls: d
}) {
  var br;
  const l = me(e), u = vt(l), m = l === "audio" ? "Audio" : "Scene", b = (f) => {
    var w;
    return f.title || ((w = f.files[0]) == null ? void 0 : w.basename) || m;
  }, g = (f) => `${f.occurrence ? `${f.occurrence.performer.name} — ` : ""}${b(f.media)}`, y = P(null), v = P("");
  if (!y.current)
    try {
      y.current = hi(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (f) {
      v.current = yt(f), y.current = { query: Pn(e), startAtEnd: !1 };
    }
  const [S, h] = q(null), O = P(null), C = P(null), I = P(null), [U, D] = q(!!v.current), A = P(0), [k, L] = q(y.current.query), j = P(k);
  j.current = k;
  const [ae, J] = q(0), x = P(y.current.startAtEnd), [$, G] = q([]), [E, X] = q(null), ne = P(null), [fe, ce] = q(null), [Se, Dt] = q(0), _t = Ve(() => {
    if (!E) return null;
    const f = $.findIndex((w) => w.key === E.key);
    return f < 0 ? null : $.slice(f + 1).find((w) => w.media.id !== E.media.id) ?? null;
  }, [E, $]), [jt, Ut] = q(0), [ye, _e] = q(!1), [qe, Ze] = q(!1), ge = P(!1), et = P(!0), Je = P(null);
  z(() => (et.current = !0, () => {
    et.current = !1;
  }), []);
  const [Re, le] = q(v.current), [oe, F] = q(""), [H, je] = q(null), [Ne, Q] = q(!1), [Ot, dn] = q([]), Nt = P([]), ht = P(null), We = P(null), Me = P(null);
  z(() => {
    var f, w;
    Ne && ((w = (f = Me.current) == null ? void 0 : f.querySelector("input")) == null || w.focus());
  }, [Ne]);
  const [Ue, He] = q(!1), [It, St] = q(!1);
  z(() => {
    if (ye || Ue || !We.current) return;
    const f = requestAnimationFrame(() => {
      if (document.querySelector(uo)) return;
      const w = We.current;
      We.current = null;
      const M = document.activeElement;
      M && M !== document.body || w != null && w.isConnected && !w.disabled && w.focus();
    });
    return () => cancelAnimationFrame(f);
  }, [ye, Ue, ae]);
  const [Mt, R] = q([]), [W, Oe] = q({}), tt = P(null), Pe = P(0), [pe, Nn] = q({});
  z(() => {
    let f = !0;
    return Promise.all(
      xi(k.objectFilter).map(
        async (w) => [
          String(w),
          (await Z(`/api/tags/${w}`)).name
        ]
      )
    ).then((w) => {
      f && Nn(Object.fromEntries(w));
    }).catch(() => {
    }), () => {
      f = !1;
    };
  }, [k.objectFilter]);
  const Ur = Ve(
    () => Li(k.objectFilter, pe),
    [pe, k.objectFilter]
  ), Zt = P(0), Ge = P(e);
  Ge.current = e;
  const mt = S ?? e, re = Ve(
    () => Pt(mt, k),
    [mt, k]
  ), nt = Ve(
    () => lo(re, k.performerFocus),
    [re, k.performerFocus]
  ), Ye = P(nt);
  Ye.current = nt;
  const un = P(re);
  un.current = re;
  const [Gt, Sn] = q("items"), [ct, Gr] = q(null), xe = P(null), lt = P("");
  function qt(f) {
    const w = typeof f == "function" ? f(xe.current) : f;
    xe.current = w, Gr(w);
  }
  const [$t, en] = q(!1), [$e, ze] = q(null), be = P(null), Ee = ue(re) ? Ar(re) : "", [tn, dt] = q(0), [fn, nn] = q(null);
  z(() => () => {
    var f;
    return (f = be.current) == null ? void 0 : f.controller.abort();
  }, []), z(() => {
    const f = be.current;
    !f || f.signature === Ee || (f.controller.abort(), be.current = null, en(!1));
  }, [Ee]), z(() => {
    var M;
    const f = xe.current;
    if (Gt !== "performers" || !Ee || ((M = be.current) == null ? void 0 : M.signature) === Ee || lt.current === Ee || (f == null ? void 0 : f.signature) === Ee && f.complete)
      return;
    const w = (f == null ? void 0 : f.signature) === Ee ? f : null;
    kn(f, (w == null ? void 0 : w.limit) ?? Hr);
  }, [Gt, Ee, ct, $e, $t]);
  const gt = k.performerFocus, Et = JSON.stringify(
    ue(re) ? re.occurrence.flagPerformerTagIds ?? [] : []
  );
  z(() => {
    if (!gt) {
      nn(null);
      return;
    }
    let f = !0;
    const w = new Set(JSON.parse(Et));
    return Z(
      `/api/performers/${gt}`
    ).then((M) => {
      f && nn({
        id: gt,
        name: M.name,
        flags: (M.tags ?? []).filter((B) => w.has(B.id)).map((B) => B.name)
      });
    }).catch(() => {
    }), () => {
      f = !1;
    };
  }, [gt, Et]);
  const Gn = k.startFrom !== (e.view.startFrom ?? "end") || !_n(
    JSON.parse(wt(Pt(e, k))),
    JSON.parse(wt(Pt(e, Pn(e))))
  ), rt = qe || ye || Ne, Kt = Number(k.filter.page);
  function ie(f, w = !1) {
    ge.current || (v.current = "", x.current = w, j.current = f, L(f), Ut(0), _e(!0), w || or(e.id, f), J((M) => M + 1));
  }
  function Ft() {
    if (ge.current = !1, Ze(!1), et.current && Je.current) {
      const f = Je.current;
      Je.current = null, ie(f.query, f.startAtEnd);
    }
  }
  z(() => {
    const f = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const w = hi(
            Ge.current,
            new URLSearchParams(window.location.search)
          );
          ge.current ? Je.current = w : ie(w.query, w.startAtEnd);
        } catch (w) {
          le(yt(w));
        }
    };
    return window.addEventListener("popstate", f), () => window.removeEventListener("popstate", f);
  }, [e.id]), z(() => (i(qe || ye || Ne || !!S), () => i(!1)), [qe, ye, Ne, !!S, i]);
  async function Ct(f, w, M) {
    if (ue(f)) {
      const V = await ma(
        f,
        tt.current,
        w,
        M
      );
      return {
        items: V.items.map((Y) => ({
          key: Y.key,
          media: Y.media,
          occurrence: Y
        })),
        totalCount: V.totalCount
      };
    }
    const B = await ir(
      f,
      { ...f.view.filter, page: w },
      M
    );
    return {
      items: B.items.map((V) => ({ key: String(V.id), media: V })),
      totalCount: B.totalCount
    };
  }
  function Kn(f, w, M, B = !1, V = !1) {
    if (!et.current || Je.current) return;
    D(!0), G(
      V ? f.items : Wr(f.items, j.current.startFrom === "end")
    ), Ut(f.totalCount), Bt(M, B);
    const Y = {
      ...j.current,
      filter: { ...j.current.filter, page: w }
    };
    j.current = Y, L(Y), or(e.id, Y);
  }
  function Bt(f, w = !1) {
    (f == null ? void 0 : f.key) !== (E == null ? void 0 : E.key) && (ne.current = null), (f == null ? void 0 : f.media.id) !== (E == null ? void 0 : E.media.id) && ce(w && f ? f.media.id : null), X(f);
  }
  z(() => {
    if (v.current) return;
    const f = new AbortController();
    I.current = f;
    const w = ++Zt.current;
    return _e(!0), le(""), F(""), ne.current = null, ce(null), X(null), G([]), Q(!1), (async () => {
      const M = lo(
        Pt(Ge.current, j.current),
        j.current.performerFocus
      );
      tt.current = ue(M) ? await Di(M, f.signal) : null;
      let B = Number(M.view.filter.page), V = await Ct(M, B, f.signal);
      const Y = Math.max(
        1,
        Math.ceil(V.totalCount / Number(M.view.filter.perPage))
      );
      (x.current || B > Y) && (B = Y, V = await Ct(M, B, f.signal)), x.current = !1;
      const Ce = M.view.startFrom === "end" ? -1 : 1;
      for (; ue(M) && !V.items.length && B + Ce >= 1 && B + Ce <= Y && !f.signal.aborted; )
        B += Ce, V = await Ct(M, B, f.signal);
      if (w !== Zt.current || f.signal.aborted) return;
      const Ke = Wr(V.items, M.view.startFrom === "end");
      Kn(V, B, Ke[0] ?? null);
    })().catch((M) => {
      !f.signal.aborted && w === Zt.current && le(yt(M));
    }).finally(() => {
      !f.signal.aborted && w === Zt.current && (D(!0), _e(!1));
    }), () => {
      f.abort(), Zt.current++;
    };
  }, [ae, e.id]), z(() => {
    if (je(null), !E) return;
    let f = !0;
    return Rt(l, E).then((w) => {
      f && (je(w), R(
        ue(e) ? w.ids.filter((M) => e.occurrence.tagIds.includes(M)) : []
      ));
    }).catch((w) => {
      f && le(`Could not load current tags. ${yt(w)}`);
    }), () => {
      f = !1;
    };
  }, [E]), z(() => {
    if (!ue(e) || e.actions.length)
      return;
    let f = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (w) => [
          w,
          (await Z(`/api/tags/${w}`)).name
        ]
      )
    ).then((w) => {
      f && Oe(Object.fromEntries(w));
    }).catch((w) => {
      f && le(yt(w));
    }), () => {
      f = !1;
    };
  }, [e]);
  async function rn(f = !1, w = !1, M = !1) {
    var Hn;
    if (!E) return;
    const B = $.findIndex((Ae) => Ae.key === E.key), V = k.startFrom === "end" ? -1 : 1, Y = ((Hn = ne.current) == null ? void 0 : Hn.key) === E.key ? ne.current : { key: E.key, page: Kt, before: $.slice(0, B + 1).map((Ae) => Ae.key), after: $.slice(B + 1).map((Ae) => Ae.key) }, Ce = new Set(Y.after), Ke = new Set(Y.before), an = $.find((Ae) => {
      var it;
      return Ce.has(Ae.key) || (V === 1 || Kt < Y.page) && ((it = ne.current) == null ? void 0 : it.key) === E.key && !Ke.has(Ae.key);
    });
    if (!f && an) {
      Bt(an, M);
      return;
    }
    const Be = f ? Ke : new Set($.map((Ae) => Ae.key)), ut = 1100 - (Date.now() - Pe.current);
    ut > 0 && await new Promise((Ae) => window.setTimeout(Ae, ut));
    let De = V === -1 && !f ? Math.max(1, Kt - 1) : Kt;
    for (; et.current && !Je.current; ) {
      let Ae = await Ct(nt, De);
      const it = Math.max(
        1,
        Math.ceil(Ae.totalCount / Number(k.filter.perPage))
      );
      De > it && (De = it, Ae = await Ct(nt, De));
      const Yn = Wr(Ae.items, V === -1), Xn = new Map(Yn.map((ot) => [ot.key, ot])), In = f ? Y.after.flatMap((ot) => {
        const yr = Xn.get(ot);
        return yr ? [yr] : [];
      }) : [], mn = new Set(In.map((ot) => ot.key)), Zn = f ? {
        ...Ae,
        items: [
          ...In,
          ...Yn.filter(
            (ot) => ot.key !== E.key && !mn.has(ot.key)
          )
        ]
      } : Ae;
      if (w) {
        ne.current = Y, Kn(Zn, De, E, !1, f);
        return;
      }
      const er = V === -1 && Kt === 1 && !f ? void 0 : Zn.items.find(
        (ot) => !Be.has(ot.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(f && V === -1 && De === Y.page) || Ce.has(ot.key))
      );
      if (er || (V === -1 ? De <= 1 : De >= it)) {
        Kn(
          Zn,
          De,
          er ?? null,
          M,
          f
        ), er || F(
          Ae.totalCount ? `Reached the end in this direction. Matching items remain available from the ${u.queue} pages.` : `No matching ${u.many}.`
        );
        return;
      }
      De += V;
    }
  }
  async function Qe(f, w = !1, M = !1, B = !1) {
    if (S || !E || ge.current || ye || Ne && !M)
      return;
    const V = M || B || !!(f != null && f.steps.length), Y = V && !w;
    if (V && (!t || !H) || f && cn(f) && !n) return;
    ge.current = !0, Ze(!0), le(""), F("");
    const Ce = $.findIndex((Be) => Be.key === E.key), Ke = V && !w && Ce >= 0 ? $[Ce + 1] ?? null : null;
    Ke && (G(
      (Be) => Be.filter((ut) => ut.key !== E.key)
    ), Bt(Ke, !0));
    let an = !1;
    try {
      if (V) {
        const Be = await Rt(l, E);
        if (f)
          await bc(nt, E, f);
        else {
          const De = B && ue(e) ? e.occurrence.tagIds.filter((it) => Be.ids.includes(it)) : Nt.current, Ae = Dn(De, B ? Mt : Ot);
          await Ui(nt, E, Ae);
        }
        Pe.current = Date.now();
        const ut = await Rt(l, E);
        Ke || je(ut), an = !0, Q(!1), F("Tags saved."), E.occurrence && (Vn(E.occurrence.performer.id), dt((De) => De + 1));
      }
      if (!et.current || Je.current) return;
      V ? await rn(!0, w, Y) : w || await rn(), w && M && requestAnimationFrame(() => {
        var Be;
        return (Be = ht.current) == null ? void 0 : Be.focus();
      });
    } catch (Be) {
      if (le(
        an ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${yt(Be)}` : V ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${yt(Be)}` : `Could not advance. ${yt(Be)}`
      ), V && !an) {
        Ke && (G($), ce(null), Dt((ut) => ut + 1), X(E)), Pe.current = Date.now();
        try {
          je(await Rt(l, E));
        } catch {
          je(null), le(
            (ut) => `${ut} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      Ft();
    }
  }
  const Bn = !Ne && !S && !Ue && !It && (E != null || ye || qe);
  Ri({
    surface: "local",
    enabled: Bn,
    actionCount: e.actions.length,
    onAction: (f, w) => {
      const M = e.actions[f];
      M && Qe(M, w);
    },
    onFind: () => St(!0)
  });
  const Vt = (f) => qe || ye || !H || !!S || !t && f.steps.length > 0 || !n && cn(f);
  function we() {
    !o || S || ge.current || Ne || (C.current = document.activeElement, O.current = {
      error: Re,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(j.current),
      items: $,
      current: E,
      total: jt,
      targets: tt.current,
      stayedCursor: ne.current
    }, h(structuredClone(Pt(e, j.current))), F(""), le(""));
  }
  z(() => {
    s && s !== A.current && U && !ye && (A.current = s, we());
  }, [s, ye, U]);
  function qn() {
    h(null), requestAnimationFrame(() => {
      var f;
      return (f = C.current) == null ? void 0 : f.focus();
    });
  }
  function fr() {
    var w;
    const f = O.current;
    !f || qe || ((w = I.current) == null || w.abort(), Zt.current++, j.current = f.query, L(f.query), G(f.items), X(f.current), Ut(f.total), tt.current = f.targets, ne.current = f.stayedCursor, _e(!1), le(f.error), F(""), window.history.replaceState(window.history.state, "", f.url), qn());
  }
  async function En() {
    if (!S || !o || ge.current) return;
    const f = Pt(
      { ...S, name: S.name.trim() },
      j.current
    ), w = Tr(f);
    if (w) {
      le(w);
      return;
    }
    ge.current = !0, Ze(!0), le("");
    try {
      if (await o(f) === !1) throw new Error("Could not save review.");
      qn(), F("Review saved.");
    } catch (M) {
      le(
        "Could not save review. Your edits are still open. " + yt(M)
      );
    } finally {
      Ft();
    }
  }
  async function Cn() {
    if (!o || ge.current) return;
    const f = Pt(e, {
      ...j.current,
      filter: { ...j.current.filter, page: 1 }
    });
    ge.current = !0, Ze(!0), le("");
    try {
      if (await o(f) === !1) throw new Error("Could not save review.");
      F("Queue saved to this review.");
    } catch (w) {
      le("Could not save queue. " + yt(w));
    } finally {
      Ft();
    }
  }
  const Le = k.performerScope, An = (f) => {
    const { performerFocus: w, ...M } = j.current, B = w && !("targetMode" in f || "performerIds" in f || "performerFilter" in f);
    ie({
      ...M,
      ...B ? { performerFocus: w } : {},
      filter: { ...M.filter, page: 1 },
      performerScope: { ...Le, ...f }
    });
  };
  async function kn(f, w) {
    var V;
    const M = un.current;
    if (!ue(M)) return;
    (V = be.current) == null || V.controller.abort();
    const B = {
      signature: Ar(M),
      controller: new AbortController()
    };
    be.current = B, lt.current = "", en(!0), ze(null);
    try {
      const Y = await Dc(M, f, w, B.controller.signal, {
        onProgress: (Ce) => {
          be.current === B && qt(Ce);
        }
      });
      be.current === B && qt(Y);
    } catch (Y) {
      be.current === B && !B.controller.signal.aborted && (lt.current = B.signature, ze({ signature: B.signature, message: yt(Y) }));
    } finally {
      be.current === B && (be.current = null, en(!1));
    }
  }
  function Jt() {
    var f;
    (f = be.current) == null || f.controller.abort(), be.current = null, en(!1), qt((w) => w && { ...w, partial: !0, complete: !1 });
  }
  async function Vn(f) {
    var V;
    const w = un.current;
    if (!ue(w)) return;
    if (be.current) {
      Jt();
      return;
    }
    const M = Ar(w);
    if (((V = xe.current) == null ? void 0 : V.signature) !== M || xe.current.partial) return;
    const B = 1100 - (Date.now() - Pe.current);
    B > 0 && await new Promise((Y) => window.setTimeout(Y, B));
    try {
      const Y = await va(w, f);
      if (be.current) {
        Jt();
        return;
      }
      qt(
        (Ce) => (Ce == null ? void 0 : Ce.signature) === M ? _c(Ce, f, Y) : Ce
      );
    } catch {
      qt(
        (Y) => (Y == null ? void 0 : Y.signature) === M ? { ...Y, partial: !0, complete: !1 } : Y
      );
    }
  }
  const Tn = k.performerFocus ? ct == null ? void 0 : ct.candidates.find((f) => f.id === k.performerFocus) : void 0, ke = (fn == null ? void 0 : fn.id) === k.performerFocus ? fn : Tn ?? null;
  function Kr(f) {
    if (ge.current) return;
    const w = {
      ...j.current,
      performerFocus: f,
      filter: { ...j.current.filter, page: 1 }
    };
    ie(w, w.startFrom === "end"), Sn("items");
  }
  function pr() {
    const { performerFocus: f, ...w } = j.current;
    ie(
      { ...w, filter: { ...w.filter, page: 1 } },
      w.startFrom === "end"
    );
  }
  const Rn = P(null);
  Rn.current ?? (Rn.current = oa());
  const hr = Rn.current, Jn = ia(mt.actions), zn = Ve(
    () => mt.actions.flatMap((f) => f.steps.flatMap((w) => w.tagIds)),
    [mt.actions]
  ), mr = P(null);
  z(() => {
    const f = mr.current, w = f == null ? void 0 : f.querySelector('[aria-current="true"]');
    if (!f || !w) return;
    const M = f.getBoundingClientRect(), B = w.getBoundingClientRect();
    B.top < M.top ? f.scrollTop -= M.top - B.top : B.bottom > M.bottom && (f.scrollTop += B.bottom - M.bottom);
  }, [E == null ? void 0 : E.key, Gt]);
  const At = P(null), on = P(null);
  z(() => {
    var M, B;
    const f = on.current;
    if (!f) return;
    on.current = null;
    const w = [...((M = At.current) == null ? void 0 : M.querySelectorAll(".dq-partner")) ?? []];
    (B = w.find((V) => V.dataset.partnerKey === f) ?? w[0]) == null || B.focus();
  }, [E == null ? void 0 : E.key]);
  const zt = qe || ye || Ne || !!S, pn = qe || ye || E != null && !H, Qn = Math.max(1, Number(k.filter.perPage) || 1), gr = P(1);
  ye || (gr.current = Math.max(1, Math.ceil(jt / Qn)));
  const Wn = gr.current, On = Le && E ? $.filter(
    (f) => f.media.id === E.media.id && f.key !== E.key
  ) : [], hn = E != null && E.occurrence && E.occurrence.performer.id === k.performerFocus ? (ke == null ? void 0 : ke.flags) ?? [] : E != null && E.occurrence ? ((br = ct == null ? void 0 : ct.candidates.find((f) => f.id === E.occurrence.performer.id)) == null ? void 0 : br.flags) ?? [] : [], Qt = (f) => {
    var w;
    return f.title || ((w = f.files[0]) == null ? void 0 : w.basename) || `${l === "audio" ? "Audio" : "Video"} ${f.id}`;
  }, he = E ? Uc(E.media, l) : "";
  return /* @__PURE__ */ c(
    "section",
    {
      className: `dq-review-workspace${l === "audio" ? " dq-audio" : ""}${S ? " dq-editing-rule" : ""}`,
      "aria-label": Le ? l === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : l === "audio" ? "Audio review" : "Video review",
      onClickCapture: (f) => {
        var B;
        const w = f.target instanceof Element ? f.target.closest("button") : null, M = (w == null ? void 0 : w.getAttribute("aria-label")) ?? ((B = w == null ? void 0 : w.textContent) == null ? void 0 : B.trim()) ?? "";
        w && !w.closest(uo) && /^(Filters|Edit filter:|Edit criteria)/.test(M) && (We.current = w);
      },
      children: [
        /* @__PURE__ */ r(
          ca,
          {
            name: e.name,
            description: e.description,
            entityType: Fe(e),
            onBack: d == null ? void 0 : d.onBack,
            backDisabled: zt,
            onEdit: we,
            editDisabled: zt || !o,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ c("fieldset", { className: "dq-review-toolbar", disabled: qe || Ne, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: l === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ r(
                  ar,
                  {
                    filter: k.filter,
                    objectFilter: Ur,
                    criteriaDefinitions: l === "audio" ? mi : Fr,
                    customFieldEntityType: l,
                    totalCount: jt,
                    sortOptions: l === "audio" ? wo : bi,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(
                      la,
                      {
                        page: Math.min(Math.max(1, Kt || 1), Wn),
                        pages: Wn,
                        onPage: (f) => ie({
                          ...j.current,
                          filter: Xe(
                            { ...j.current.filter, page: f },
                            l
                          )
                        })
                      }
                    ),
                    onFilterChange: (f) => {
                      (f.sort !== j.current.filter.sort || f.direction !== j.current.filter.direction) && (f = { ...f, sorts: void 0 }), ie({
                        ...j.current,
                        filter: Xe(f, l)
                      });
                    },
                    onObjectFilterChange: (f) => {
                      ie({
                        ...j.current,
                        objectFilter: fa(
                          f,
                          pe,
                          j.current.objectFilter
                        ),
                        filter: { ...j.current.filter, page: 1 }
                      });
                    }
                  }
                )
              ] })
            ),
            trailing: /* @__PURE__ */ c(se, { children: [
              Le && /* @__PURE__ */ r(
                Pc,
                {
                  scope: Le,
                  disabled: qe || Ne,
                  onChange: An,
                  onEditCriteria: () => He(!0)
                }
              ),
              ue(nt) && t && /* @__PURE__ */ r(
                kc,
                {
                  review: nt,
                  hidden: !!S,
                  disabled: rt || !!S,
                  performerFlags: k.performerFocus ? ke == null ? void 0 : ke.flags : void 0,
                  onOpen: () => {
                    ge.current = !0, Ze(!0);
                  },
                  onWrite: () => {
                    Pe.current = Date.now();
                  },
                  onClose: (f) => {
                    if (f) {
                      Pe.current = Date.now();
                      const w = j.current.performerFocus;
                      w ? Vn(w) : Jt(), dt((M) => M + 1), new Promise((M) => window.setTimeout(M, 1100)).then(() => {
                        Ft(), et.current && J((M) => M + 1);
                      });
                    } else Ft();
                  }
                }
              ),
              (d == null ? void 0 : d.onGrid) && /* @__PURE__ */ r(
                da,
                {
                  mode: "single",
                  disabled: zt,
                  onChange: () => {
                    var f;
                    return (f = d.onGrid) == null ? void 0 : f.call(d);
                  }
                }
              ),
              (d == null ? void 0 : d.onManage) && /* @__PURE__ */ r(
                ua,
                {
                  disabled: zt,
                  items: [
                    {
                      label: "Manage reviews",
                      disabled: d.manageDisabled,
                      onSelect: () => {
                        var f;
                        return (f = d.onManage) == null ? void 0 : f.call(d);
                      }
                    }
                  ]
                }
              )
            ] }),
            chipsStart: k.performerFocus ? /* @__PURE__ */ c("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ r(
                nr,
                {
                  performer: {
                    id: k.performerFocus,
                    name: (ke == null ? void 0 : ke.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ c("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ r("strong", { children: (ke == null ? void 0 : ke.name) ?? `performer ${k.performerFocus}` })
              ] }),
              ke != null && ke.flags.length ? /* @__PURE__ */ c(
                "span",
                {
                  className: "dq-focus-flag",
                  title: `Flagged: ${ke.flags.join(", ")}`,
                  children: [
                    /* @__PURE__ */ r(ti, { "aria-hidden": "true" }),
                    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
                      "Flagged: ",
                      ke.flags.join(", ")
                    ] })
                  ]
                }
              ) : null,
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: rt,
                  onClick: pr,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            chipsEnd: !S && Gn ? /* @__PURE__ */ c(se, { children: [
              /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Queue differs from the saved review" }),
              /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: "dq-text-button",
                  title: "Save the current queue criteria to this review",
                  disabled: rt || !o,
                  onClick: () => void Cn(),
                  children: [
                    /* @__PURE__ */ r(Ao, { "aria-hidden": "true" }),
                    "Save to review"
                  ]
                }
              ),
              /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: "dq-text-button",
                  title: "Reset the queue to the review's saved criteria",
                  disabled: rt,
                  onClick: () => {
                    const f = Pn(e);
                    ie(f, f.startFrom === "end");
                  },
                  children: [
                    /* @__PURE__ */ r(ko, { "aria-hidden": "true" }),
                    "Reset"
                  ]
                }
              )
            ] }) : void 0
          }
        ),
        d == null ? void 0 : d.notices,
        /* @__PURE__ */ c("div", { className: "dq-review-main", children: [
          S && /* @__PURE__ */ c("section", { className: "dq-rule-editor", "aria-label": "Edit review rule", children: [
            /* @__PURE__ */ r("h2", { children: "Edit review" }),
            /* @__PURE__ */ r("p", { children: "Preview matching scenes below. Save review keeps all rule changes; Cancel restores your previous view." }),
            /* @__PURE__ */ c("fieldset", { disabled: qe, children: [
              a == null ? void 0 : a(
                Pt(S, k),
                h,
                qe
              ),
              /* @__PURE__ */ c("label", { children: [
                "Review direction",
                /* @__PURE__ */ c(
                  "select",
                  {
                    "aria-label": "Review direction",
                    value: k.startFrom,
                    onChange: (f) => ie({
                      ...j.current,
                      startFrom: f.target.value
                    }),
                    children: [
                      /* @__PURE__ */ r("option", { value: "end", children: "Start from the end" }),
                      /* @__PURE__ */ r("option", { value: "beginning", children: "Start from the beginning" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ c("div", { className: "dq-row", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  className: "dq-button primary",
                  type: "button",
                  disabled: qe || ye,
                  onClick: () => void En(),
                  children: "Save review"
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  className: "dq-button",
                  type: "button",
                  disabled: qe,
                  onClick: fr,
                  children: "Cancel"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ c("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ c("div", { className: "dq-review-stage", children: [
              E ? /* @__PURE__ */ c(se, { children: [
                /* @__PURE__ */ c("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ r("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ c(
                    "a",
                    {
                      href: `/${l}/${E.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${u.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ r("span", { children: Qt(E.media) }),
                        /* @__PURE__ */ r(To, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  he && /* @__PURE__ */ r("span", { className: "dq-stage-meta", children: he })
                ] }),
                /* @__PURE__ */ c("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ r("div", { className: "dq-player-frame", children: [E, _t].filter(Boolean).map((f) => {
                    var B, V, Y, Ce, Ke;
                    const w = f, M = w.key === E.key;
                    return /* @__PURE__ */ r(
                      "div",
                      {
                        className: M ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": M ? void 0 : !0,
                        inert: M ? void 0 : !0,
                        children: l === "audio" ? /* @__PURE__ */ r(
                          Da,
                          {
                            streamUrl: ci("audio", w.media.id),
                            format: ((B = w.media.files[0]) == null ? void 0 : B.format) ?? "",
                            title: b(w.media),
                            coverUrl: M ? si("audio", w.media) : void 0,
                            duration: ((V = w.media.files[0]) == null ? void 0 : V.duration) ?? 0,
                            autostart: M && fe === w.media.id
                          }
                        ) : /* @__PURE__ */ r(
                          vo,
                          {
                            videoId: w.media.id,
                            streamUrl: ci("video", w.media.id),
                            posterUrl: M ? si("video", w.media) : void 0,
                            duration: ((Y = w.media.files[0]) == null ? void 0 : Y.duration) ?? 0,
                            format: (Ce = w.media.files[0]) == null ? void 0 : Ce.format,
                            audioCodec: (Ke = w.media.files[0]) == null ? void 0 : Ke.audioCodec,
                            extensionSurface: M ? "quick-view" : void 0,
                            autostart: M && fe === w.media.id,
                            keyboardShortcutsEnabled: M,
                            showAbLoop: M,
                            clip: w.media.parentVideoId != null ? {
                              start: w.media.clipStartSec ?? 0,
                              end: w.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${w.media.id}:${Se}`
                    );
                  }) }),
                  l === "audio" && /* @__PURE__ */ r(
                    Rc,
                    {
                      details: E.media.details,
                      label: u.one
                    },
                    E.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ r("p", { role: "status", className: "dq-stage-status", children: ye ? "Loading review…" : jt ? "Reached the end in this direction." : `No matching ${u.many}.` }),
              mt.actions.length > 0 ? /* @__PURE__ */ r(
                cc,
                {
                  actions: mt.actions,
                  mediaKind: l,
                  isDisabled: (f) => Ne || Vt(f),
                  busy: pn,
                  tags: H,
                  trees: Jn,
                  preview: hr,
                  onApply: (f, w) => void Qe(f, w),
                  onFind: () => St(!0),
                  findDisabled: Ne || !!S
                }
              ) : ue(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ c(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || qe || Ne || !H || !!S || !E,
                  children: [
                    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((f) => /* @__PURE__ */ c("label", { children: [
                      /* @__PURE__ */ r(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: Mt.includes(f),
                          onChange: (w) => R(
                            e.occurrence.multiple ? w.target.checked ? [...Mt, f] : Mt.filter((M) => M !== f) : [f]
                          )
                        }
                      ),
                      W[f] ?? "Loading tag…"
                    ] }, f)),
                    /* @__PURE__ */ c("div", { className: "dq-row", children: [
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => R([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void Qe(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void Qe(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ c("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ c("div", { className: "dq-panel-body", ref: At, children: [
                E && /* @__PURE__ */ c(se, { children: [
                  /* @__PURE__ */ c("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ c("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: E.occurrence ? E.occurrence.performer.name : `this ${u.one}` })
                    ] }),
                    /* @__PURE__ */ c("div", { className: "dq-reviewing-who", children: [
                      E.occurrence && /* @__PURE__ */ r(nr, { performer: E.occurrence.performer }),
                      /* @__PURE__ */ c("div", { children: [
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: E.occurrence ? E.occurrence.performer.name : `This ${u.one}` }),
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-note", children: Le ? `Tags apply to this performer in this ${u.queue}` : `Tags apply to the whole ${u.one}` })
                      ] })
                    ] }),
                    hn.length > 0 && /* @__PURE__ */ c("p", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
                      /* @__PURE__ */ r(ti, { "aria-hidden": "true" }),
                      "Flagged: ",
                      hn.join(", ")
                    ] })
                  ] }),
                  On.length > 0 && /* @__PURE__ */ c(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${u.queue}`,
                      children: [
                        /* @__PURE__ */ c("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          u.queue
                        ] }),
                        /* @__PURE__ */ r("div", { className: "dq-partners", children: On.map((f) => {
                          var w, M, B;
                          return /* @__PURE__ */ c(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (w = f.occurrence) == null ? void 0 : w.performer.name,
                              "aria-label": (M = f.occurrence) == null ? void 0 : M.performer.name,
                              "data-partner-key": f.key,
                              disabled: rt,
                              onClick: () => {
                                on.current = E.key, Bt(f), le("");
                              },
                              children: [
                                f.occurrence && /* @__PURE__ */ r(nr, { performer: f.occurrence.performer }),
                                /* @__PURE__ */ r("span", { children: (B = f.occurrence) == null ? void 0 : B.performer.name })
                              ]
                            },
                            f.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ r(
                    Kc,
                    {
                      tags: H,
                      preview: hr,
                      showPreview: !Ne,
                      trees: Jn,
                      actionTagIds: zn,
                      label: `Current ${Le ? "occurrence" : u.one} tags`
                    }
                  ),
                  Ne && /* @__PURE__ */ c(
                    "fieldset",
                    {
                      ref: Me,
                      disabled: qe,
                      className: "dq-panel-section dq-tag-editor",
                      children: [
                        /* @__PURE__ */ c("legend", { className: "dq-eyebrow", children: [
                          "Edit ",
                          Le ? "occurrence" : u.one,
                          " tags"
                        ] }),
                        /* @__PURE__ */ r(
                          Lt,
                          {
                            entityType: "tag",
                            values: Ot,
                            onChange: dn,
                            placeholder: "Choose tags for this item...",
                            allowCreate: !1
                          }
                        ),
                        /* @__PURE__ */ c("div", { className: "dq-row", children: [
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button primary",
                              disabled: !H,
                              onClick: () => void Qe(void 0, !0, !0),
                              children: "Save"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              disabled: !H,
                              onClick: () => void Qe(void 0, !1, !0),
                              children: "Save & next"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              onClick: () => {
                                Q(!1), requestAnimationFrame(() => {
                                  var f;
                                  return (f = ht.current) == null ? void 0 : f.focus();
                                });
                              },
                              children: "Cancel"
                            }
                          )
                        ] })
                      ]
                    }
                  )
                ] }),
                ue(re) && k.performerFocus && /* @__PURE__ */ r(
                  ya,
                  {
                    review: re,
                    performerId: k.performerFocus,
                    revision: tn
                  }
                )
              ] }),
              /* @__PURE__ */ c("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ c("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  Re && /* @__PURE__ */ c("p", { role: "alert", children: [
                    Re,
                    " ",
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        disabled: qe,
                        onClick: () => {
                          E ? Rt(l, E).then(je).catch((f) => le(yt(f))) : ie(j.current);
                        },
                        children: E ? "Reload tags" : "Retry queue"
                      }
                    )
                  ] }),
                  oe && /* @__PURE__ */ r("p", { role: "status", children: oe })
                ] }),
                !t && /* @__PURE__ */ r("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                E && /* @__PURE__ */ c("div", { className: "dq-panel-actions", "aria-busy": pn || void 0, children: [
                  /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      ref: ht,
                      className: "dq-button",
                      disabled: rt || !!S || !t || !H,
                      onClick: () => {
                        Nt.current = [...H.ids], dn([...H.ids]), Q(!0);
                      },
                      children: [
                        /* @__PURE__ */ r(Xa, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: rt || !!S,
                      onClick: () => void Qe(),
                      children: [
                        /* @__PURE__ */ r(Za, { "aria-hidden": "true" }),
                        "Skip",
                        Le ? " performer" : ` ${u.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              Le && /* @__PURE__ */ c(
                "div",
                {
                  className: "dq-segmented dq-segmented-fill",
                  role: "group",
                  "aria-label": "Queue view",
                  children: [
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": Gt === "items",
                        onClick: () => Sn("items"),
                        children: l === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": Gt === "performers",
                        onClick: () => Sn("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              Le && Gt === "performers" ? /* @__PURE__ */ r(
                Oc,
                {
                  ranking: (ct == null ? void 0 : ct.signature) === Ee ? ct : null,
                  busy: $t,
                  error: ($e == null ? void 0 : $e.signature) === Ee ? $e.message : "",
                  focus: k.performerFocus,
                  disabled: rt,
                  labels: u,
                  onFocus: Kr,
                  onMore: () => {
                    const f = xe.current;
                    f && kn(f, f.limit + Hr);
                  },
                  onRefresh: () => {
                    qt(null), kn(null, Hr);
                  }
                }
              ) : /* @__PURE__ */ r("div", { className: "dq-queue-list", ref: mr, children: $.map((f) => {
                var M;
                const w = (E == null ? void 0 : E.key) === f.key;
                return /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: g(f),
                    "aria-label": g(f),
                    "aria-current": w ? "true" : void 0,
                    disabled: rt,
                    onClick: () => {
                      Bt(f), le(""), F("");
                    },
                    children: [
                      /* @__PURE__ */ r(Gc, { media: f.media, kind: l }),
                      /* @__PURE__ */ c("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: b(f.media) }),
                        /* @__PURE__ */ c("span", { className: "dq-queue-row-meta", children: [
                          f.occurrence && /* @__PURE__ */ c(se, { children: [
                            /* @__PURE__ */ r(nr, { performer: f.occurrence.performer }),
                            /* @__PURE__ */ r("span", { className: "dq-queue-row-performer", children: f.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ r("span", { className: "dq-queue-row-detail", children: [
                            f.media.date,
                            f.occurrence ? "" : (M = f.media.files[0]) != null && M.duration ? No(f.media.files[0].duration) : ""
                          ].filter(Boolean).join(" · ") })
                        ] })
                      ] })
                    ]
                  },
                  f.key
                );
              }) })
            ] })
          ] })
        ] }),
        Le && /* @__PURE__ */ r(
          So,
          {
            open: Ue,
            onClose: () => He(!1),
            criteria: gi,
            activeFilter: Le.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (f) => {
              He(!1), An({ performerFilter: f });
            }
          }
        ),
        It && /* @__PURE__ */ r(
          Ii,
          {
            actions: e.actions,
            trees: Jn,
            isDisabled: (f) => Vt(f),
            onApply: (f, w) => {
              St(!1), Qe(f, w);
            },
            onClose: () => St(!1)
          }
        )
      ]
    }
  );
}
function Vc(e) {
  var d, l, u;
  const [t, n] = q({}), [i, o] = q(""), s = (((d = e == null ? void 0 : e.presentation) == null ? void 0 : d.annotations) ?? []).includes("tags") ? ((l = e == null ? void 0 : e.presentation) == null ? void 0 : l.annotationParents) ?? [] : [], a = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...s,
      ...((u = e == null ? void 0 : e.presentation) == null ? void 0 : u.binParents) ?? []
    ])
  ]);
  return z(() => {
    let m = !0;
    return n({}), o(""), Promise.all(
      JSON.parse(a).map(
        async (b) => [b, await _r([b])]
      )
    ).then((b) => {
      m && n(Object.fromEntries(b));
    }).catch(() => {
      m && o(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      m = !1;
    };
  }, [a]), { ids: t, error: i };
}
function Jc(e, t, n) {
  const i = t == null ? void 0 : t.presentation, o = (i == null ? void 0 : i.annotations) ?? [], s = (i == null ? void 0 : i.annotationParents) ?? [];
  return {
    ...e,
    details: void 0,
    organized: !1,
    groups: [],
    galleries: [],
    date: o.includes("date") ? e.date : void 0,
    studioId: o.includes("studio") ? e.studioId : void 0,
    studioName: o.includes("studio") ? e.studioName : void 0,
    performers: o.includes("performers") ? e.performers : [],
    tags: o.includes("tags") && s.length > 0 ? (e.tags ?? []).filter(
      (a) => s.some(
        (d) => {
          var l;
          return d !== a.id && ((l = n[d]) == null ? void 0 : l.includes(a.id));
        }
      )
    ) : []
  };
}
function zc({
  videos: e,
  review: t,
  savedObjectFilter: n,
  trees: i,
  disabled: o,
  onToggle: s
}) {
  var v;
  const a = ((v = t.presentation) == null ? void 0 : v.binParents) ?? [], d = new Set(
    a.flatMap((S) => (i[S] ?? []).filter((h) => h !== S))
  ), l = a.every((S) => i[S]), u = Sa(t.view.objectFilter, n).bins.filter(
    (S) => !l || d.has(S)
  ), m = /* @__PURE__ */ new Map();
  for (const S of e)
    for (const h of S.tags ?? [])
      if (d.has(h.id)) {
        const O = m.get(h.id) ?? { name: h.name, count: 0 };
        O.count++, m.set(h.id, O);
      }
  const b = u.filter((S) => !m.has(S)), g = dr(b);
  for (const S of b)
    m.set(S, {
      name: g[S] === void 0 ? "…" : g[S] ?? "Unavailable tag",
      count: 0
    });
  if (!a.length) return null;
  const y = [...m].sort((S, h) => S[1].name.localeCompare(h[1].name));
  return /* @__PURE__ */ c("div", { className: "dq-bins", role: "group", "aria-label": "Tag bins on this page", children: [
    /* @__PURE__ */ r("span", { className: "dq-bins-label", "aria-hidden": "true", children: "On this page" }),
    y.map(([S, h]) => {
      const O = u.includes(S);
      return /* @__PURE__ */ c(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": O,
          title: O ? `Show every video again, not only ${h.name}` : `Show only videos tagged ${h.name}`,
          disabled: o,
          onClick: () => s(S),
          children: [
            O && /* @__PURE__ */ r(Ro, { "aria-hidden": "true" }),
            h.name,
            " ",
            /* @__PURE__ */ r("span", { className: "dq-bin-count", children: h.count })
          ]
        },
        S
      );
    }),
    !y.length && /* @__PURE__ */ r("span", { className: "dq-bins-empty", children: "No matching tag bins on this page." })
  ] });
}
function yn(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Qc(e) {
  if (!yn(e) || Object.keys(e).length !== 1 || !yn(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !yn(t.tagsCriterion)) return null;
  const { value: n, modifier: i, depth: o, ...s } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && i === "INCLUDES" && o === 0 && !Object.keys(s).length ? n[0] : null;
}
function Sa(e, t) {
  let n = e;
  const i = [];
  for (; ; ) {
    if (t && _n(n, t)) {
      n = t;
      break;
    }
    const o = Object.keys(n);
    if (o.length !== 1 || o[0] !== "_filterExpression") break;
    const s = n._filterExpression;
    if (!yn(s) || s.operator !== "AND" || !Array.isArray(s.children))
      break;
    const a = s.children, d = Qc(a.at(-1));
    if (d == null || a.length > 3) break;
    let l = {}, u = null, m = !0;
    for (const [b, g] of a.slice(0, -1).entries())
      !yn(g) || Object.keys(g).length !== 1 ? m = !1 : b === 0 && yn(g.filter) && Object.keys(g.filter).length ? l = g.filter : !u && yn(g.group) ? u = g.group : m = !1;
    if (!m) break;
    i.unshift(d), n = u ? { ...l, _filterExpression: u } : l;
  }
  return { base: n, bins: i };
}
function Wc(e, t, n) {
  const { base: i, bins: o } = Sa(e.view.objectFilter, n);
  return (o.includes(t) ? o.filter((a) => a !== t) : [...o, t]).reduce(Hc, { ...e, view: { ...e.view, objectFilter: i } });
}
function Hc(e, t) {
  const { _filterExpression: n, ...i } = e.view.objectFilter;
  return {
    ...e,
    view: {
      ...e.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...Object.keys(i).length ? [{ filter: i }] : [],
            ...n ? [{ group: n }] : [],
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
function fo({
  draft: e,
  onChange: t,
  presentation: n = !0,
  queue: i = !0
}) {
  const [o, s] = q(!1), a = Fe(e) === "tag" ? "tag" : me(e), d = a === "tag" ? "tags" : `${a}s`, l = ja(
    a === "tag" ? void 0 : a,
    e.view.objectFilter
  ), u = e.view.filter, m = a === "tag" ? qo : a === "audio" ? wo : bi, b = a === "tag" ? Eo : a === "audio" ? mi : Fr, g = (h) => t({
    ...e,
    view: { ...e.view, filter: { ...u, ...h } }
  }), y = a === "video" ? e.presentation ?? {} : {}, v = a !== "audio", S = (h) => t({ ...e, presentation: { ...y, ...h } });
  return /* @__PURE__ */ c(se, { children: [
    i && /* @__PURE__ */ c("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ r("legend", { children: "Queue" }),
      /* @__PURE__ */ c("label", { children: [
        "Search",
        /* @__PURE__ */ r(
          "input",
          {
            value: String(u.q ?? ""),
            onChange: (h) => g({ q: h.target.value })
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
              value: String(u.sort ?? "date"),
              onChange: (h) => g({ sort: h.target.value, sorts: void 0 }),
              children: [
                !m.some((h) => h.value === u.sort) && u.sort != null && /* @__PURE__ */ r("option", { value: String(u.sort), children: String(u.sort) }),
                m.map((h) => /* @__PURE__ */ r("option", { value: h.value, children: h.label }, h.value))
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
              value: String(u.direction ?? "desc"),
              onChange: (h) => g({ direction: h.target.value }),
              children: [
                /* @__PURE__ */ r("option", { value: "asc", children: "Ascending" }),
                /* @__PURE__ */ r("option", { value: "desc", children: "Descending" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ c("label", { children: [
          a === "tag" ? "Tags" : "Videos",
          " per page",
          /* @__PURE__ */ r(
            "input",
            {
              type: "number",
              min: "1",
              max: "1000",
              value: Number(u.perPage) || 40,
              onChange: (h) => g({
                perPage: Math.max(
                  1,
                  Math.min(1e3, Number(h.target.value) || 40)
                )
              })
            }
          )
        ] }),
        /* @__PURE__ */ c("label", { children: [
          "Start from",
          /* @__PURE__ */ c(
            "select",
            {
              "aria-label": "Start from",
              value: e.view.startFrom ?? "end",
              onChange: (h) => t({
                ...e,
                view: {
                  ...e.view,
                  startFrom: h.target.value
                }
              }),
              children: [
                /* @__PURE__ */ r("option", { value: "end", children: "The end" }),
                /* @__PURE__ */ r("option", { value: "beginning", children: "The beginning" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-button",
          onClick: () => s(!0),
          children: [
            "Edit ",
            a,
            " filters"
          ]
        }
      ),
      /* @__PURE__ */ c("p", { children: [
        Object.keys(e.view.objectFilter).length ? `${a[0].toUpperCase()}${a.slice(1)} filters configured` : `No ${a} filters`,
        ". Choose which ",
        d,
        " enter the queue."
      ] }),
      o && /* @__PURE__ */ r("div", { onKeyDown: (h) => h.stopPropagation(), children: /* @__PURE__ */ r(
        So,
        {
          open: !0,
          onClose: () => s(!1),
          criteria: b,
          activeFilter: e.view.objectFilter,
          customSections: l ? [l] : void 0,
          supportsFilterExpressions: a !== "tag",
          subjectLabel: d,
          onApply: (h) => {
            t({ ...e, view: { ...e.view, objectFilter: h } }), s(!1);
          }
        }
      ) })
    ] }),
    n && /* @__PURE__ */ c(se, { children: [
      /* @__PURE__ */ r("h3", { children: "Appearance" }),
      /* @__PURE__ */ c("p", { className: "dq-editor-note", children: [
        "Choose how ",
        a === "tag" ? "tags" : `${d} and tags`,
        " appear while reviewing."
      ] }),
      /* @__PURE__ */ c("div", { className: "dq-field-grid", children: [
        Mo(e) && /* @__PURE__ */ c("label", { children: [
          "Preferred review layout",
          /* @__PURE__ */ c(
            "select",
            {
              value: e.view.reviewMode ?? "single",
              onChange: (h) => t({ ...e, view: { ...e.view, reviewMode: h.target.value } }),
              children: [
                /* @__PURE__ */ r("option", { value: "single", children: "Single video" }),
                /* @__PURE__ */ r("option", { value: "multiple", children: "Multiple videos" })
              ]
            }
          )
        ] }),
        !ue(e) && v && /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: e.view.selectAllOnLoad ?? !1,
              onChange: (h) => t({ ...e, view: { ...e.view, selectAllOnLoad: h.target.checked ? !0 : void 0 } })
            }
          ),
          "Select all ",
          d,
          " on page load",
          a === "video" && /* @__PURE__ */ r("small", { children: " (multiple-videos layout)" })
        ] }),
        v && /* @__PURE__ */ c("label", { children: [
          "Preferred view",
          /* @__PURE__ */ r(
            "select",
            {
              value: a === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid",
              onChange: (h) => t({
                ...e,
                view: {
                  ...e.view,
                  displayMode: h.target.value
                }
              }),
              children: (a === "tag" ? ["grid", "list"] : ["grid", "wall"]).map((h) => /* @__PURE__ */ r("option", { children: h }, h))
            }
          )
        ] })
      ] }),
      a === "video" && /* @__PURE__ */ c(se, { children: [
        /* @__PURE__ */ r("h4", { children: "Card annotations" }),
        /* @__PURE__ */ r("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((h) => {
          const O = y.annotations ?? [];
          return /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: O.includes(h),
                onChange: (C) => S({
                  annotations: C.target.checked ? [...O, h] : O.filter((I) => I !== h)
                })
              }
            ),
            h
          ] }, h);
        }) }),
        (y.annotations ?? []).includes("tags") && /* @__PURE__ */ c(se, { children: [
          /* @__PURE__ */ r("h4", { children: "Card tag bins" }),
          /* @__PURE__ */ r("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected. This setting is separate from the queue filters." }),
          /* @__PURE__ */ r(
            Lt,
            {
              entityType: "tag",
              values: y.annotationParents ?? [],
              placeholder: "Search annotation parent tags...",
              onChange: (h) => S({ annotationParents: h }),
              allowCreate: !1
            }
          )
        ] }),
        /* @__PURE__ */ r("h4", { children: "Queue tag bins" }),
        /* @__PURE__ */ r("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
        /* @__PURE__ */ r(
          Lt,
          {
            entityType: "tag",
            values: y.binParents ?? [],
            placeholder: "Search tag-bin parent tags...",
            onChange: (h) => S({ binParents: h }),
            allowCreate: !1
          }
        )
      ] })
    ] })
  ] });
}
const Yr = 180;
function po(e) {
  return Fe(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function ho(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Xr() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function mo(e) {
  const t = new URLSearchParams(window.location.search);
  jr.forEach((i) => t.delete(i)), e ? t.set("review", e) : t.delete("review");
  const n = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${n ? `?${n}` : ""}`
  );
}
function Yc(e) {
  return Xe({ ...e, page: 1 });
}
function qa(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function xt(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Xc = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(Ni, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ r(os, { "aria-hidden": "true" }) }
], Zc = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(Ni, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ r(is, { "aria-hidden": "true" }) }
], el = [], Ea = "(min-width: 900px)";
function tl(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(Ea);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function nl() {
  return typeof window.matchMedia == "function" && window.matchMedia(Ea).matches;
}
function rl(e) {
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
function il({
  onNavigate: e
}) {
  const [t, n] = q([]), [i] = q(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [o, s] = q(""), [a, d] = q(!0), [l, u] = q(""), [m, b] = q(!1), [g, y] = q(!1), [v, S] = q(!1), [h, O] = q(!1), [C, I] = q([]), [U, D] = q(""), [A, k] = q(!0), [L, j] = q(""), [ae, J] = q(""), [x, $] = q(!1), [G, E] = q(!1), [X, ne] = q(Xr), [fe, ce] = q({}), [Se, Dt] = q("name"), [_t, jt] = q("asc"), Ut = P(null), ye = P(!1), [_e, qe] = q(0), [Ze, ge] = q(!1), [et, Je] = q(!1), [Re, le] = q(
    null
  ), oe = t.find((p) => p.id === X) ?? null, F = Ve(
    () => (Re == null ? void 0 : Re.id) === X && oe ? { ...oe, view: {
      ...oe.view,
      filter: Re.view.filter,
      objectFilter: Re.view.objectFilter,
      searchMode: Re.view.searchMode,
      startFrom: Re.view.startFrom
    } } : oe,
    [Re, X, oe]
  ), H = F ? Fe(F) : "video", je = rr(H), Ne = F ? ue(F) : !1, Q = H === "video" ? F : null, Ot = Ne && !!(F != null && F.actions.some(cn)), dn = !!Q || H === "audio" || Ot, [Nt, ht] = q(null), We = (Nt == null ? void 0 : Nt.id) === (F == null ? void 0 : F.id) ? Nt == null ? void 0 : Nt.mode : (F == null ? void 0 : F.view.reviewMode) ?? "single", Me = Ne || H === "audio" || H === "video" && We === "single", [Ue, He] = q(0), It = P(-1), St = P(!1);
  z(() => {
    const p = () => {
      if (!Me && Ct.current) {
        St.current = !0;
        return;
      }
      It.current = -1, ne(Xr()), Me || He((N) => N + 1);
    };
    return window.addEventListener("popstate", p), () => window.removeEventListener("popstate", p);
  }, [Me]);
  const Mt = je === "audio" ? g : m, R = H === "tag" ? "Tag" : je === "audio" ? "Audio" : "Video", W = H === "tag" ? v : Mt, Oe = Ve(() => {
    const p = _t === "asc" ? 1 : -1;
    return [...t].sort((N, T) => {
      if (Se === "count") {
        const _ = fe[N.id], ee = fe[T.id], K = typeof _ == "number", te = typeof ee == "number";
        if (K !== te) return K ? -1 : 1;
        if (K && te && _ !== ee)
          return (_ - ee) * p;
      }
      return N.name.localeCompare(T.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * p;
    });
  }, [_t, Se, fe, t]), tt = P(
    null
  ), Pe = Vc(Q), [pe, Nn] = q({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Ur, Zt] = q({
    page: 1,
    perPage: 40
  }), [Ge, mt] = q({ items: [], totalCount: 0 }), [re, nt] = q(!1), [Ye, un] = q(""), [Gt, Sn] = q(!1), [ct, Gr] = q(!1), [xe, lt] = q(() => /* @__PURE__ */ new Set()), qt = P(xe);
  qt.current = xe;
  const $t = P(/* @__PURE__ */ new Map()), en = (F == null ? void 0 : F.view.selectAllOnLoad) === !0, [$e, ze] = q(null), be = P($e);
  be.current = $e;
  const [Ee, tn] = q(!1), dt = P(Ee);
  dt.current = Ee;
  const fn = P(null), [nn, gt] = q(!1), [Et, Gn] = q("grid"), [rt, Kt] = q(Yr), [ie, Ft] = q(!1), Ct = P(!1), [Kn, Bt] = q(""), [rn, Qe] = q(""), [Bn, Vt] = q(""), [we, qn] = q(null), [fr, En] = q(""), [Cn, Le] = q(!1), [An, kn] = q({}), Jt = P(/* @__PURE__ */ new Map()), Vn = P(null), Tn = P(null), ke = !!F, Kr = yo(tl, nl, () => !1) && ke, [pr, Rn] = q({ top: 0, bottom: 0 });
  wn(() => {
    if (!ke) return;
    const p = () => {
      const T = Tn.current;
      if (!T) return;
      const _ = Math.round(T.getBoundingClientRect().top + window.scrollY), ee = T.closest("main"), K = ee ? Math.round(parseFloat(getComputedStyle(ee).paddingBottom) || 0) : 0;
      Rn(
        (te) => te.top === _ && te.bottom === K ? te : { top: _, bottom: K }
      );
    };
    p();
    const N = typeof ResizeObserver > "u" ? null : new ResizeObserver(p);
    return N == null || N.observe(document.body), window.addEventListener("resize", p), () => {
      N == null || N.disconnect(), window.removeEventListener("resize", p);
    };
  }, [ke]);
  const [hr, Jn] = q(0), zn = P(null), mr = Ht((p) => {
    var T;
    if ((T = zn.current) == null || T.disconnect(), zn.current = null, !p || typeof ResizeObserver > "u") return;
    const N = new ResizeObserver(
      () => Jn(Math.round(p.getBoundingClientRect().height))
    );
    N.observe(p), zn.current = N;
  }, []), At = P(0), on = P(0), zt = P(null), pn = P(null), Qn = ia(F && !Me ? F.actions : el);
  z(() => {
    if (!rn) return;
    const p = window.setTimeout(() => Qe(""), 4e3);
    return () => window.clearTimeout(p);
  }, [rn]), z(() => {
    const p = Q ? xi(Q.view.objectFilter) : [];
    if (kn({}), !p.length) return;
    const N = new AbortController();
    let T = !0;
    return Promise.all(
      p.map(async (_) => {
        var ee;
        try {
          const K = await Z(`/api/tags/${_}`, {
            signal: N.signal
          });
          return (ee = K.name) != null && ee.trim() ? [String(_), K.name] : null;
        } catch {
          return null;
        }
      })
    ).then((_) => {
      T && kn(
        Object.fromEntries(_.filter((ee) => ee !== null))
      );
    }), () => {
      T = !1, N.abort();
    };
  }, [Q == null ? void 0 : Q.id, Q == null ? void 0 : Q.view.objectFilter]);
  const gr = Ve(
    () => Q ? Li(
      Q.view.objectFilter,
      An
    ) : (F == null ? void 0 : F.view.objectFilter) ?? {},
    [An, F, Q]
  ), Wn = Ht(async () => {
    d(!0), u("");
    try {
      const p = await vs();
      n(p.reviews), s(p.storageKey), b(p.canWriteVideos ?? p.canWrite), y(p.canWriteAudios ?? !1), S(p.canWriteTags ?? !1), O(p.canReadTagGroups ?? !1), k(p.canConfigure ?? !0), j(p.storageNotice ?? ""), X && !p.reviews.some((N) => N.id === X) && (ne(""), mo(""));
    } catch (p) {
      u(
        p instanceof Error ? p.message : "Could not load reviews."
      );
    } finally {
      d(!1);
    }
  }, [X]);
  z(() => {
    if (!h) {
      I([]), D("");
      return;
    }
    const p = new AbortController();
    return D(""), Is(p.signal).then(I).catch((N) => {
      p.signal.aborted || D(
        N instanceof Error ? N.message : "Could not load tag groups."
      );
    }), () => p.abort();
  }, [h]), z(() => {
    Wn();
  }, []), z(() => {
    if (X || t.length === 0) return;
    const p = new AbortController();
    ce({});
    for (const N of t)
      (ue(N) ? Di(N, p.signal).then((_) => (_ == null ? void 0 : _.length) === 0 ? { items: [], totalCount: 0 } : ir(_i(N, _), { ...N.view.filter, page: 1, perPage: 1 }, p.signal)) : Fe(N) === "tag" ? Hi(
        N,
        Xe({ ...N.view.filter, page: 1, perPage: 1 }),
        p.signal
      ) : ir(
        N,
        Xe({ ...N.view.filter, page: 1, perPage: 1 }),
        p.signal
      )).then((_) => {
        p.signal.aborted || ce((ee) => ({
          ...ee,
          [N.id]: _.totalCount
        }));
      }).catch(() => {
        p.signal.aborted || ce((_) => ({ ..._, [N.id]: null }));
      });
    return () => p.abort();
  }, [X, t]), wn(() => {
    var p;
    X || a || !ye.current || (ye.current = !1, (p = Ut.current) == null || p.focus());
  }, [X, a]);
  const On = P(0), hn = Ht(async () => {
    const p = ++On.current;
    qn(null), En("");
    try {
      const N = await (Ot ? Bo(je) : Ko(je));
      p === On.current && qn(N);
    } catch (N) {
      if (p !== On.current) return;
      qn(null), En(
        "Tag assessment setup could not be checked. " + (N instanceof Error ? N.message : "Request failed.")
      );
    }
  }, [Ot, je]);
  z(() => {
    hn();
  }, [hn]);
  const Qt = Ht(
    async (p, N, T = !1, _ = !1) => {
      var at, ve;
      const ee = ++At.current;
      (at = zt.current) == null || at.abort();
      const K = new AbortController();
      zt.current = K, N = Xe(N);
      const te = Number(N.page);
      T && (N = { ...N, page: 1 }), Nn(N), Gr(T), nt(!0), un("");
      try {
        const Te = (Wt) => Fe(p) === "tag" ? Hi(
          p,
          Wt,
          K.signal
        ) : ir(
          p,
          Wt,
          K.signal
        );
        let de = await Te(N);
        const ft = Math.max(
          1,
          Math.ceil(de.totalCount / Number(N.perPage))
        ), Mn = T ? ft : Math.min(te, ft);
        return Number(N.page) !== Mn && (N = { ...N, page: Mn }, de = await Te(N)), ee === At.current && (((ve = pn.current) == null ? void 0 : ve.page) !== Mn && (pn.current = {
          page: Mn,
          ids: new Set(de.items.map((Wt) => Wt.id))
        }), mt(de), _ && Y(
          () => new Set(de.items.map((Wt) => Wt.id))
        ), Nn(N), Zt(N)), de;
      } catch (Te) {
        throw ee === At.current && un(
          Te instanceof Error ? Te.message : "Could not load the review queue."
        ), Te;
      } finally {
        ee === At.current && nt(!1);
      }
    },
    []
  );
  z(() => {
    var N;
    if (on.current += 1, It.current = -1, At.current += 1, (N = zt.current) == null || N.abort(), E(!1), J(""), $(!1), lt(/* @__PURE__ */ new Set()), $t.current.clear(), ze(null), tn(!1), Ft(!1), Ct.current = !1, Bt(""), Qe(""), Vt(""), mt({ items: [], totalCount: 0 }), pn.current = null, Sn(!1), !F || Me) {
      nt(!1);
      return;
    }
    let p = !0;
    return nt(!0), (async () => {
      let T = oe ?? F;
      le(null);
      let _ = null;
      const ee = new URLSearchParams(window.location.search);
      if (Fe(F) === "video" && jr.some((ve) => ee.has(ve)))
        try {
          const ve = T;
          _ = hi(ve, ee);
          const Te = Pt(ve, _.query);
          (_.query.startFrom !== (ve.view.startFrom ?? "end") || !_n(
            JSON.parse(wt(Te)),
            JSON.parse(wt(Pt(ve, Pn(ve))))
          )) && (T = Te, le(T));
        } catch (ve) {
          Sn(!0), un(ve instanceof Error ? ve.message : "Could not read review URL."), nt(!1);
          return;
        }
      let K = null;
      try {
        K = await qs(o, F.id);
      } catch (ve) {
        p && ($(!0), J(
          ve instanceof Error ? ve.message : "Could not load progress."
        ));
      }
      if (!p) return;
      const te = (K == null ? void 0 : K.signature) === wt(T) ? K : null, at = _ ? _.query.filter : te ? Xe(te.filter) : Yc(T.view.filter);
      Nn(at), Gn(
        te ? ho(te.displayMode, Fe(F)) : po(F)
      ), Kt(
        te ? te.cardSize ?? Yr : Yr
      );
      try {
        const ve = await Qt(
          T,
          at,
          _ ? _.startAtEnd : !te && T.view.startFrom !== "beginning",
          T.view.selectAllOnLoad === !0
        );
        if (!p) return;
        const Te = Ji(
          ve.items.map((de) => de.id),
          (te == null ? void 0 : te.focusedId) ?? null,
          (te == null ? void 0 : te.index) ?? 0
        );
        ze(Te), V(Te);
      } catch {
      }
      p && (It.current = Ue, E(!0));
    })(), () => {
      var T;
      p = !1, on.current++, At.current++, (T = zt.current) == null || T.abort();
    };
  }, [F == null ? void 0 : F.id, Me, Ue]), z(() => {
    !Q || Me || !G || re || Ye || ie || St.current || It.current !== Ue || or(Q.id, {
      filter: pe,
      objectFilter: Q.view.objectFilter,
      searchMode: Q.view.searchMode,
      startFrom: Q.view.startFrom ?? "end"
    });
  }, [Q, Me, G, re, Ye, pe, ie, Ue]);
  const he = Ve(
    () => Ge.items.map((p) => p.id),
    [Ge.items]
  );
  z(() => {
    if (!G || !F || !o || re || Ye || ie || (Re == null ? void 0 : Re.id) === F.id || x)
      return;
    const p = {
      version: 1,
      signature: wt(F),
      filter: pe,
      focusedId: $e,
      index: Math.max(0, he.indexOf($e ?? -1)),
      displayMode: Et,
      cardSize: rt,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        o + ":progress:" + F.id,
        JSON.stringify(p)
      );
    } catch {
    }
    if (ae) return;
    let N = !0;
    const T = window.setTimeout(() => {
      Es(o, F.id, p).catch((_) => {
        N && J(
          "Progress is kept in this browser, but account sync failed. " + (_ instanceof Error ? _.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      N = !1, window.clearTimeout(T);
    };
  }, [
    G,
    o,
    F,
    re,
    Ye,
    ie,
    pe,
    $e,
    he,
    Et,
    rt,
    Re,
    ae,
    x
  ]);
  const br = Ge.items.find((p) => p.id === $e) ?? null, f = H === "video" ? br : null;
  Ee && f && (fn.current = f);
  const w = f ?? (Ee ? fn.current : null), M = zi(xe, $e), B = he.length > 0 && he.every((p) => xe.has(p)), V = Ht((p, N = !0) => {
    p != null && window.requestAnimationFrame(() => {
      if (hs(document.activeElement)) return;
      const T = Jt.current.get(p);
      T == null || T.focus({ preventScroll: !0 }), N && (T == null || T.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  z(() => {
    G && !dt.current && V(be.current);
  }, [G, V]), z(() => {
    re || !he.length || (be.current == null || !he.includes(be.current)) && (ze(he[0]), dt.current || V(he[0]));
  }, [V, he, re]);
  const Y = Ht(
    (p) => {
      lt((N) => {
        const T = p(N);
        for (const _ of /* @__PURE__ */ new Set([...N, ...T]))
          N.has(_) !== T.has(_) && $t.current.set(
            _,
            ($t.current.get(_) ?? 0) + 1
          );
        return T;
      });
    },
    []
  ), Ce = Ht(
    (p) => {
      if (!he.length) return;
      const N = Math.max(
        0,
        he.indexOf(be.current ?? he[0])
      ), T = he[Math.max(0, Math.min(he.length - 1, N + p))];
      ze(T), dt.current || V(T);
    },
    [V, he]
  ), Ke = Ht(
    async (p) => {
      const N = "steps" in p ? p.steps.length > 0 : p.effect.mode !== "SKIP", T = "effect" in p && p.effect.mode === "SET_TAG_GROUP" ? p.effect.tagGroupId : null, _ = T != null && (!h || !C.some((Ie) => Ie.id === T)), ee = "effect" in p && N && !h, K = zi(
        qt.current,
        be.current
      );
      if (!F || Ct.current || re || Ye) return;
      const te = N && !W ? `${R} write permission is required to apply ${p.label}.` : ee || _ ? `${p.label} needs a tag group that is unavailable.` : cn(p) && (we == null ? void 0 : we.kind) !== "ready" ? `Set up tag assessments before applying ${p.label}.` : K.length ? "" : `Select or focus a ${H} before applying ${p.label}.`;
      if (te) {
        Vt(te);
        return;
      }
      const at = ++on.current, ve = F.id, Te = [...he], de = Ge, ft = be.current, Mn = new Set(qt.current), Wt = new Map(
        K.map((Ie) => [Ie, $t.current.get(Ie) ?? 0])
      ), $n = () => at === on.current && F.id === ve;
      Ct.current = !0, Ft(!0), Bt(
        qt.current.size ? `${K.length} selected ${H}s` : `the focused ${H}`
      ), Qe(""), Vt("");
      const Gi = de.items.filter(
        (Ie) => !K.includes(Ie.id)
      ), Ia = Gi.map((Ie) => Ie.id), Ki = Qi(
        Te,
        Ia,
        ft,
        K.includes(ft ?? -1)
      );
      mt({
        items: Gi,
        totalCount: de.totalCount
      }), lt((Ie) => {
        const pt = new Set(Ie);
        for (const kt of K) pt.delete(kt);
        return pt;
      }), ze(Ki), dt.current || V(Ki);
      let Br = !1;
      try {
        if ("effect" in p ? await Us(p, K) : await Jo(je, p, K), Br = !0, !$n()) return;
        lt((Ie) => {
          const pt = new Set(Ie);
          for (const kt of K)
            ($t.current.get(kt) ?? 0) === Wt.get(kt) && pt.delete(kt);
          return pt;
        }), Qe(
          `${p.label}: ${K.length} ${H}${K.length === 1 ? "" : "s"} ${N ? "updated" : "skipped"}.`
        );
      } catch (Ie) {
        if (!$n()) return;
        mt(de), lt((pt) => {
          const kt = new Set(pt);
          for (const bt of K)
            Mn.has(bt) && ($t.current.get(bt) ?? 0) === Wt.get(bt) && kt.add(bt);
          return kt;
        }), ze(ft), dt.current || V(ft), Vt(
          Ie instanceof Error ? Ie.message : "Action failed."
        );
      }
      try {
        if (await Fs(p), !$n()) return;
        const Ie = new Set(K), pt = en && Te.length > 0 && Te.every((Tt) => Ie.has(Tt)), kt = await Qt(F, pe, !1, pt);
        if (!$n()) return;
        let bt = kt.items.map((Tt) => Tt.id);
        const wr = pn.current, Ma = (wr == null ? void 0 : wr.page) === Number(pe.page) && bt.some((Tt) => wr.ids.has(Tt)), $a = (F.view.startFrom ?? "end") !== "beginning";
        if (kt.totalCount > 0 && Number(pe.page) > 1 && (!bt.length || $a && !Ma)) {
          const Tt = Math.max(1, Number(pe.page) - 1), vr = { ...pe, page: Tt };
          Nn(vr), bt = (await Qt(
            F,
            vr,
            !1,
            pt
          )).items.map((Vr) => Vr.id), lt(
            (Vr) => new Set([...Vr].filter((Fa) => bt.includes(Fa)))
          );
          const Vi = bt.at(-1) ?? null;
          ze(Vi), dt.current || V(Vi);
        } else {
          lt(
            (vr) => new Set([...vr].filter((Bi) => bt.includes(Bi)))
          );
          const Tt = Qi(
            Te,
            bt,
            ft,
            Br && K.includes(ft ?? -1)
          );
          ze(Tt), dt.current && Tt == null && tn(!1), dt.current || V(Tt);
        }
      } catch (Ie) {
        $n() && Vt(
          (pt) => `${pt ? `${pt} ` : ""}${Br ? "The action completed, but " : ""}the queue could not be refreshed. ${Ie instanceof Error ? Ie.message : "Refresh failed."}`
        );
      } finally {
        $n() && (Ct.current = !1, Ft(!1), Bt(""), St.current && (St.current = !1, ne(Xr()), He((Ie) => Ie + 1)));
      }
    },
    [
      W,
      h,
      C,
      H,
      we,
      Qt,
      pe,
      V,
      he,
      Ge,
      re,
      Ye,
      F
    ]
  );
  function an() {
    var T;
    if (Et === "list") return 1;
    const p = (T = Vn.current) == null ? void 0 : T.firstElementChild, N = p ? getComputedStyle(p).gridTemplateColumns : "";
    return Math.max(1, N.split(" ").filter(Boolean).length);
  }
  const Be = P(() => {
  });
  Be.current = (p) => {
    var K;
    if (Me || p.defaultPrevented || p.repeat || p.ctrlKey || p.altKey || p.metaKey || Ze) return;
    const N = p.target, T = N instanceof Node && ((K = Tn.current) == null ? void 0 : K.contains(N)) === !0, _ = N === document.body || N === document.documentElement;
    if (!T && !_) return;
    if (nn) {
      p.key === "Escape" && (xt(p), gt(!1));
      return;
    }
    if (Ee && p.key === "Escape") {
      xt(p), tn(!1), V(be.current);
      return;
    }
    if (!ps(N)) return;
    const ee = fs(N);
    if (p.key === "Escape") {
      xt(p), Y(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!Ee && p.key === " " && ee) {
      xt(p), $e != null && Y((te) => Cr(te, $e));
      return;
    }
    if (!(ie || re) && !Ee && p.key === "Enter" && $e != null && ee) {
      xt(p), H === "tag" ? window.open(`/tag/${$e}`, "_blank", "noopener,noreferrer") : tn(!0);
      return;
    }
  }, z(() => {
    const p = (N) => Be.current(N);
    return document.addEventListener("keydown", p), () => document.removeEventListener("keydown", p);
  }, []);
  const ut = P(
    () => {
    }
  );
  ut.current = (p) => {
    var K;
    if (Me || Ze || Ee || nn || ie || re || !he.length || p.defaultPrevented || p.repeat || p.ctrlKey || p.altKey || p.metaKey)
      return;
    const N = p.target, T = N instanceof Node && ((K = Tn.current) == null ? void 0 : K.contains(N)) === !0, _ = N === document.body || N === document.documentElement;
    if (!T && !_ || !p.key.startsWith("Arrow") || !ms(N)) return;
    const ee = gs(p.key, an());
    ee && (p.preventDefault(), T ? p.stopImmediatePropagation() : p.stopPropagation(), Ce(ee));
  }, z(() => {
    const p = (N) => ut.current(N);
    return document.addEventListener("keydown", p), () => document.removeEventListener("keydown", p);
  }, []);
  const De = ie || re && !G, Hn = Un();
  Ri({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!F && !Me && !Ze && !Ee && !nn && !Ye && (Ge.items.length > 0 || re || ie),
    actionCount: (F == null ? void 0 : F.actions.length) ?? 0,
    onAction: (p) => {
      const N = F == null ? void 0 : F.actions[p];
      N && Ke(N);
    },
    onFind: () => gt(!0),
    onSelectAll: () => Y((p) => us(p, he))
  }), z(() => gt(!1), [Me, Ee, F == null ? void 0 : F.id]);
  function Ae(p) {
    const N = "steps" in p ? p.steps.length > 0 : p.effect.mode !== "SKIP", T = "effect" in p && p.effect.mode === "SET_TAG_GROUP" ? p.effect.tagGroupId : null, _ = T != null && !C.some((ee) => ee.id === T);
    return ie || re || !!Ye || N && !W || "effect" in p && N && (!h || _) || cn(p) && (we == null ? void 0 : we.kind) !== "ready" || !M.length;
  }
  function it(p) {
    ht(null), qe(0), ne(p), mo(p);
  }
  function Yn() {
    ye.current = !0, ce({}), it("");
  }
  async function Xn(p) {
    if (!o) return !1;
    const N = p.map(al);
    try {
      await Ss(o, N);
    } catch (_) {
      throw _;
    }
    n(N), X && !N.some((_) => _.id === X) && it("");
    const T = N.find((_) => _.id === X);
    return T && ht(null), T && oe && JSON.stringify(T) !== JSON.stringify(oe) && (T.view.displayMode !== oe.view.displayMode && Gn(po(T)), wt(T) !== wt(oe) && (le(null), Fe(T) === "video" && or(T.id, {
      filter: Xe(T.view.filter),
      objectFilter: T.view.objectFilter,
      searchMode: T.view.searchMode,
      startFrom: T.view.startFrom ?? "end"
    }), Me || mn(
      T,
      Xe({ ...T.view.filter, page: pe.page })
    ))), !0;
  }
  if (a)
    return /* @__PURE__ */ r(go, { label: "Loading reviews…" });
  if (l)
    return /* @__PURE__ */ c(se, { children: [
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          onClick: () => void ml().catch(
            (p) => u(
              "Could not export browser reviews. " + (p instanceof Error ? p.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ r(
        bo,
        {
          message: l,
          onRetry: () => void Wn()
        }
      )
    ] });
  const In = /* @__PURE__ */ c(se, { children: [
    L && /* @__PURE__ */ r("p", { className: "dq-status", children: L }),
    dn && (we == null ? void 0 : we.kind) === "missing" && /* @__PURE__ */ c("div", { role: "status", className: "dq-status", children: [
      we.message,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: Cn,
          onClick: () => {
            Le(!0), En(""), (Ot ? Ls(je) : xs(je)).then(hn).catch(
              (p) => En(
                `Could not create the ${Ot ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (p instanceof Error ? p.message : "Request failed.")
              )
            ).finally(() => Le(!1));
          },
          children: Cn ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    dn && ((we == null ? void 0 : we.kind) === "incompatible" || fr) && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(ni, {}),
      fr || (we == null ? void 0 : we.message),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: Cn,
          onClick: () => {
            Le(!0), hn().finally(
              () => Le(!1)
            );
          },
          children: Cn ? "Checking…" : "Check again"
        }
      )
    ] }),
    i && /* @__PURE__ */ c("details", { children: [
      /* @__PURE__ */ r("summary", { children: "Unassigned legacy browser reviews" }),
      /* @__PURE__ */ r("p", { children: "These old reviews have no account owner. They have not been copied into this account. Export them for recovery, then import the reviews only into the intended account. The original data and deletion history stay in this browser." }),
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const p = localStorage.getItem("page-videos") ?? "[]", N = URL.createObjectURL(
              new Blob([p], { type: "application/json" })
            ), T = document.createElement("a");
            T.href = N, T.download = "data-quality-unassigned-legacy-reviews.json", T.click(), URL.revokeObjectURL(N);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    ae && /* @__PURE__ */ c("p", { role: "alert", children: [
      ae,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: () => {
            J(""), $(!1);
          },
          children: x ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] })
  ] });
  return /* @__PURE__ */ c(
    "div",
    {
      ref: Tn,
      className: `data-quality-page${ke ? " dq-page-fit" : ""}`,
      style: ke ? {
        "--dq-fit-top": `${pr.top}px`,
        "--dq-fit-bottom": `${pr.bottom}px`
      } : void 0,
      children: [
        F && Me ? /* @__PURE__ */ r(
          Bc,
          {
            review: F,
            canWrite: Ne ? v : Mt,
            canAssess: (we == null ? void 0 : we.kind) === "ready" && Mt,
            onBusy: Ft,
            editRequest: _e,
            renderRuleEditor: (p, N, T) => /* @__PURE__ */ r(Ca, { workspace: !0, draft: p, entityTypeLocked: !0, tagGroups: C, saving: T, setDraft: (_) => N(_), onSave: () => {
            }, onCancel: () => {
            } }),
            onSaveDefaults: A ? (p) => Xn(t.map((N) => N.id === p.id ? p : N)) : void 0,
            pageControls: {
              onBack: Yn,
              onManage: () => {
                Je(!1), ge(!0);
              },
              manageDisabled: !A,
              onGrid: Q ? () => ht({ id: Q.id, mode: "multiple" }) : void 0,
              notices: In
            }
          },
          F.id
        ) : F ? Ra(F) : /* @__PURE__ */ c(se, { children: [
          /* @__PURE__ */ c("header", { className: "data-quality-header", children: [
            /* @__PURE__ */ r("div", { className: "dq-header-copy", children: /* @__PURE__ */ r("h1", { children: "Data Quality" }) }),
            /* @__PURE__ */ r(
              "button",
              {
                className: "dq-header-action",
                type: "button",
                "aria-label": "Manage reviews",
                title: "Manage reviews",
                disabled: !A,
                onClick: () => {
                  Je(!1), ge(!0);
                },
                children: /* @__PURE__ */ r(es, {})
              }
            )
          ] }),
          In,
          t.length ? /* @__PURE__ */ c(
            "section",
            {
              className: "dq-review-browser",
              "aria-labelledby": "dq-reviews-title",
              children: [
                /* @__PURE__ */ c("div", { className: "dq-review-browser-heading", children: [
                  /* @__PURE__ */ c("div", { children: [
                    /* @__PURE__ */ r(
                      "h2",
                      {
                        id: "dq-reviews-title",
                        ref: Ut,
                        tabIndex: -1,
                        children: "Reviews"
                      }
                    ),
                    /* @__PURE__ */ r("p", { children: "Choose a review to open its queue." }),
                    /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: t.every(
                      (p) => fe[p.id] !== void 0
                    ) ? t.some((p) => fe[p.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
                  ] }),
                  /* @__PURE__ */ c("div", { className: "dq-review-browser-sort", children: [
                    /* @__PURE__ */ c("label", { children: [
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                      /* @__PURE__ */ c(
                        "select",
                        {
                          "aria-label": "Sort reviews by",
                          value: Se,
                          onChange: (p) => Dt(
                            p.target.value
                          ),
                          children: [
                            /* @__PURE__ */ r("option", { value: "name", children: "Name" }),
                            /* @__PURE__ */ r("option", { value: "count", children: "Item count" })
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        "aria-label": _t === "asc" ? "Ascending" : "Descending",
                        title: _t === "asc" ? "Ascending" : "Descending",
                        onClick: () => jt(
                          (p) => p === "asc" ? "desc" : "asc"
                        ),
                        children: /* @__PURE__ */ r(
                          Si,
                          {
                            className: _t === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                          }
                        )
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ r("div", { className: "dq-review-browser-list", children: Oe.map((p) => {
                  const N = fe[p.id], T = Fe(p), _ = T === "tag" ? "tag" : ue(p) ? vt(rr(T)).queue : vt(rr(T)).one;
                  return /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      disabled: ie,
                      onClick: () => it(p.id),
                      children: [
                        /* @__PURE__ */ c("span", { className: "dq-review-browser-summary", children: [
                          /* @__PURE__ */ c("span", { className: "dq-review-title", children: [
                            /* @__PURE__ */ r($i, { entityType: T }),
                            /* @__PURE__ */ r("strong", { children: p.name })
                          ] }),
                          /* @__PURE__ */ r(
                            "span",
                            {
                              className: "dq-review-count",
                              "aria-label": N === void 0 ? `Counting matching ${_}s` : N === null ? `Matching ${_} count unavailable` : `${N.toLocaleString()} matching ${N === 1 ? _ : `${_}s`}`,
                              children: N === void 0 ? "…" : N === null ? "—" : N.toLocaleString()
                            }
                          )
                        ] }),
                        p.description && /* @__PURE__ */ r("span", { className: "dq-review-rule-name", children: p.description })
                      ]
                    },
                    p.id
                  );
                }) })
              ]
            }
          ) : /* @__PURE__ */ c("div", { className: "dq-empty", children: [
            /* @__PURE__ */ r(kr, {}),
            /* @__PURE__ */ r("p", { children: "No saved reviews are available in this browser." })
          ] })
        ] }),
        Ee && w && Q && /* @__PURE__ */ r(
          dl,
          {
            video: w,
            review: Q,
            selectedCount: xe.size,
            pending: ie,
            refreshing: re || !!Ye,
            error: Bn,
            canWrite: m,
            assessmentReady: (we == null ? void 0 : we.kind) === "ready",
            trees: Qn,
            selected: xe.has(w.id),
            hasPrevious: he.indexOf(w.id) > 0,
            hasNext: he.indexOf(w.id) >= 0 && he.indexOf(w.id) < he.length - 1,
            onToggleSelected: () => Y((p) => Cr(p, w.id)),
            onPrevious: () => Ce(-1),
            onNext: () => Ce(1),
            onClose: () => {
              tn(!1), V(be.current);
            },
            onAction: Ke,
            findOpen: nn,
            onFindOpenChange: gt
          }
        ),
        nn && F && !Me && !Ee && /* @__PURE__ */ r(
          Ii,
          {
            actions: F.actions,
            tagGroups: C,
            trees: Qn,
            isDisabled: Ae,
            canStay: !1,
            onApply: (p) => {
              gt(!1), Ke(p);
            },
            onClose: () => gt(!1)
          }
        ),
        Ze && /* @__PURE__ */ r(
          ul,
          {
            reviews: t,
            activeReview: oe,
            tagGroups: C,
            initialEdit: et,
            onSave: Xn,
            onChoose: it,
            onEditWorkspace: (p) => {
              p !== X && it(p), ht({ id: p, mode: "single" }), qe((N) => N + 1), ge(!1);
            },
            onClose: () => {
              ge(!1), et && V(be.current, !1);
            }
          }
        )
      ]
    }
  );
  async function mn(p, N, T = !1) {
    const _ = be.current, ee = Math.max(0, he.indexOf(_ ?? -1));
    try {
      const K = Qt(
        p,
        N,
        T,
        p.view.selectAllOnLoad === !0
      ), te = At.current, at = await K;
      if (te !== At.current) return;
      const ve = at.items.map((de) => de.id);
      lt(
        (de) => new Set([...de].filter((ft) => ve.includes(ft)))
      );
      const Te = Ji(ve, _, ee);
      ze(Te), dt.current || V(Te, !1);
    } catch {
    }
  }
  function Zn(p) {
    const N = tt.current;
    if (tt.current = null, De || !F || !oe) return;
    const T = N ?? F.view.objectFilter, _ = _n(
      T,
      oe.view.objectFilter
    ) ? oe.view.objectFilter : T, ee = Xe({ ...p, page: 1 }), K = {
      ...F,
      view: {
        ...F.view,
        filter: ee,
        objectFilter: _
      }
    }, te = wt(K) !== wt(oe), at = te ? K : oe;
    le(te ? K : null), Qe(te ? "" : "Review queue defaults restored."), mn(at, ee, !0);
  }
  function er() {
    if (ie || re || !oe) return;
    tt.current = null;
    const p = Xe({
      ...oe.view.filter,
      page: 1
    });
    le(null), Qe("Review queue defaults restored."), mn(
      oe,
      p,
      oe.view.startFrom !== "beginning"
    );
  }
  function ot() {
    ie || re || !F || !oe || !A || Xn(
      t.map(
        (p) => p.id === X ? {
          ...p,
          view: {
            ...F.view,
            filter: { ...pe, page: 1 }
          }
        } : p
      )
    ).then(() => {
      le(null), Qe("Queue saved to this review.");
    }).catch(
      (p) => Vt(
        p instanceof Error ? p.message : "Could not save queue."
      )
    );
  }
  function yr() {
    lt(/* @__PURE__ */ new Set()), $t.current.clear(), ze(null);
  }
  function ka(p) {
    !F || ie || p === Number(pe.page) || ol(
      { ...pe, page: p },
      F,
      (N, T) => Qt(N, T, !1, en),
      yr
    );
  }
  function Ta(p) {
    if (!Q || !oe || ie || re) return;
    const N = Wc(Q, p, oe.view.objectFilter), T = wt(N) !== wt(oe);
    le(T ? N : null), T ? mn(N, { ...pe, page: 1 }) : mn(
      oe,
      { ...pe, page: 1 },
      oe.view.startFrom !== "beginning"
    );
  }
  function Ra(p) {
    var ve, Te;
    const N = H === "tag", T = N ? "tag" : "video", _ = Math.max(1, Number(pe.perPage) || 40), ee = Math.max(1, Math.ceil(Ge.totalCount / _)), K = Math.min(Math.max(1, Number(pe.page) || 1), ee), te = [
      W ? "" : `${R} write permission is required to apply actions.`,
      N && U ? `Tag groups are unavailable. ${U}` : ""
    ].filter(Boolean), at = !!Bn && !Ee;
    return /* @__PURE__ */ c(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": N ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ r(
            ca,
            {
              name: p.name,
              description: p.description,
              entityType: H,
              onBack: Yn,
              backDisabled: ie,
              onEdit: () => {
                Je(!0), ge(!0);
              },
              editDisabled: ie || re || !A,
              toolbar: /* @__PURE__ */ c("fieldset", { className: "dq-review-toolbar", disabled: De, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: N ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ r(
                  ar,
                  {
                    filter: Ye ? Ur : pe,
                    onFilterChange: Zn,
                    totalCount: Ge.totalCount,
                    sortOptions: N ? qo : bi,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: Et,
                    zoomLevel: (rt - 225) / 50,
                    onZoomChange: (de) => Kt(Math.round(225 + de * 50)),
                    cardSizeEntityType: N ? "tags" : "videos",
                    criteriaDefinitions: N ? Eo : Fr,
                    customFieldEntityType: H === "video" ? "video" : void 0,
                    objectFilter: gr,
                    onObjectFilterChange: (de) => {
                      De || (tt.current = H === "video" ? fa(
                        de,
                        An,
                        p.view.objectFilter
                      ) : de);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(la, { page: K, pages: ee, onPage: ka })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ c(se, { children: [
                Q && /* @__PURE__ */ r(
                  da,
                  {
                    mode: "multiple",
                    disabled: ie || re || Ze,
                    onChange: () => ht({ id: Q.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ r(
                  fc,
                  {
                    options: N ? Zc : Xc,
                    value: Et,
                    onChange: (de) => Gn(ho(de, H))
                  }
                ),
                /* @__PURE__ */ r(
                  ua,
                  {
                    disabled: ie,
                    items: [
                      {
                        label: "Manage reviews",
                        disabled: re || !A,
                        onSelect: () => {
                          Je(!1), ge(!0);
                        }
                      }
                    ]
                  }
                )
              ] }),
              chipsAfter: (Te = (ve = Q == null ? void 0 : Q.presentation) == null ? void 0 : ve.binParents) != null && Te.length ? /* @__PURE__ */ r(
                zc,
                {
                  videos: Ge.items,
                  review: Q,
                  savedObjectFilter: (oe ?? Q).view.objectFilter,
                  trees: Pe.ids,
                  disabled: ie || re,
                  onToggle: Ta
                }
              ) : void 0,
              chipsEnd: (Re == null ? void 0 : Re.id) === X ? /* @__PURE__ */ c(se, { children: [
                /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Queue differs from the saved review" }),
                /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    className: "dq-text-button",
                    title: "Save the current queue criteria to this review",
                    disabled: ie || re || !A,
                    onClick: ot,
                    children: [
                      /* @__PURE__ */ r(Ao, { "aria-hidden": "true" }),
                      "Save to review"
                    ]
                  }
                ),
                /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    className: "dq-text-button",
                    title: "Reset the queue to the review's saved criteria",
                    disabled: ie || re,
                    onClick: er,
                    children: [
                      /* @__PURE__ */ r(ko, { "aria-hidden": "true" }),
                      "Reset"
                    ]
                  }
                )
              ] }) : void 0
            }
          ),
          In,
          Q && Pe.error && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: Pe.error }),
          /* @__PURE__ */ c(
            "div",
            {
              className: "dq-grid-stage",
              style: { "--dq-dock-height": `${hr}px` },
              children: [
                /* @__PURE__ */ c("div", { className: "dq-grid-content", children: [
                  re && !Ge.items.length && /* @__PURE__ */ r(go, { label: "Loading review queue…" }),
                  Ye && !re && /* @__PURE__ */ r(
                    bo,
                    {
                      message: Ye,
                      retryLabel: Gt ? "Reset to review defaults" : "Retry",
                      onRetry: () => {
                        if (Gt && oe && Fe(oe) === "video") {
                          const de = Pn(oe);
                          or(oe.id, { ...de, filter: { ...de.filter, page: void 0 } }), He((ft) => ft + 1);
                          return;
                        }
                        Qt(
                          p,
                          pe,
                          ct,
                          en
                        ).catch(() => {
                        });
                      }
                    }
                  ),
                  !ie && !re && !Ye && !Ge.items.length && /* @__PURE__ */ c("div", { className: "dq-empty", children: [
                    /* @__PURE__ */ r(kr, {}),
                    /* @__PURE__ */ c("p", { children: [
                      "No ",
                      T,
                      "s match this review."
                    ] })
                  ] }),
                  !!Ge.items.length && /* @__PURE__ */ r("div", { ref: Vn, children: /* @__PURE__ */ r(
                    "div",
                    {
                      className: Et === "list" ? "dq-tag-list" : "dq-grid",
                      style: { "--dq-card-width": `${rt}px` },
                      children: Ge.items.map(Oa)
                    }
                  ) })
                ] }),
                /* @__PURE__ */ r("div", { className: "dq-bar-dock", ref: mr, children: /* @__PURE__ */ r(
                  aa,
                  {
                    actions: p.actions,
                    tagGroups: C,
                    trees: Qn,
                    isDisabled: Ae,
                    busy: ie || re,
                    onApply: (de) => void Ke(de),
                    onFind: () => gt(!0),
                    status: ie ? `Applying action to ${Kn}…` : "",
                    summary: /* @__PURE__ */ c(se, { children: [
                      /* @__PURE__ */ r("p", { className: "dq-bar-target", children: xe.size ? `${xe.size} selected` : $e == null ? "Nothing to apply to" : `Applies to the focused ${T}` }),
                      /* @__PURE__ */ c(
                        "button",
                        {
                          type: "button",
                          className: "dq-text-button",
                          "aria-keyshortcuts": "Control+A Meta+A",
                          title: "Select every card on this page",
                          disabled: !he.length || B,
                          onClick: () => Y((de) => /* @__PURE__ */ new Set([...de, ...he])),
                          children: [
                            "Select all",
                            /* @__PURE__ */ r(st, { binding: Hn.selectAll, hidden: !0 })
                          ]
                        }
                      ),
                      /* @__PURE__ */ c(
                        "button",
                        {
                          type: "button",
                          className: "dq-text-button",
                          "aria-keyshortcuts": "Escape",
                          disabled: !xe.size,
                          onClick: () => Y(() => /* @__PURE__ */ new Set()),
                          children: [
                            "Clear",
                            /* @__PURE__ */ r(st, { binding: "Esc", hidden: !0 })
                          ]
                        }
                      )
                    ] }),
                    hints: te.length ? te.join(" ") : `Arrows move · Space selects · Enter ${N ? "opens" : "previews"}`,
                    notices: at || rn ? /* @__PURE__ */ c(se, { children: [
                      at && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
                        /* @__PURE__ */ r(ni, { "aria-hidden": "true" }),
                        Bn
                      ] }),
                      rn && /* @__PURE__ */ r("p", { role: "status", className: "dq-status", children: rn })
                    ] }) : void 0
                  }
                ) })
              ]
            }
          )
        ]
      }
    );
  }
  function Oa(p) {
    var T, _, ee;
    if (H === "tag") {
      const K = p;
      return /* @__PURE__ */ r(
        sl,
        {
          tag: K,
          displayMode: Et === "list" ? "list" : "grid",
          focused: K.id === $e,
          selected: xe.has(K.id),
          setRef: (te) => {
            te ? Jt.current.set(K.id, te) : Jt.current.delete(K.id);
          },
          onFocus: () => ze(K.id),
          onToggle: () => {
            Y((te) => Cr(te, K.id)), V(K.id, !1);
          },
          onOpen: () => window.open(`/tag/${K.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        K.id
      );
    }
    const N = p;
    return /* @__PURE__ */ r(
      cl,
      {
        video: Jc(N, Q, Pe.ids),
        showTagBins: ((_ = (T = Q == null ? void 0 : Q.presentation) == null ? void 0 : T.annotations) == null ? void 0 : _.includes("tags")) && !!((ee = Q.presentation.annotationParents) != null && ee.length),
        displayMode: Et,
        cardsScroll: Kr,
        focused: N.id === $e,
        selected: xe.has(N.id),
        setRef: (K) => {
          K ? Jt.current.set(N.id, K) : Jt.current.delete(N.id);
        },
        onFocus: () => ze(N.id),
        onToggle: () => Y((K) => Cr(K, N.id)),
        onPreview: () => {
          ze(N.id), tn(!0);
        },
        onNavigate: e
      },
      N.id
    );
  }
}
function ol(e, t, n, i) {
  i(), n(t, e).catch(() => {
  });
}
function Cr(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function al(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function sl({
  tag: e,
  displayMode: t,
  focused: n,
  selected: i,
  setRef: o,
  onFocus: s,
  onToggle: a,
  onOpen: d,
  onNavigate: l
}) {
  return /* @__PURE__ */ r(
    "article",
    {
      ref: o,
      tabIndex: 0,
      "aria-current": n ? "true" : void 0,
      "aria-label": `${e.name}${i ? ", selected" : ""}`,
      onFocus: s,
      onClick: (u) => {
        s(), u.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${n ? "focused" : ""} ${i ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ r(
        Ga,
        {
          tag: e,
          selected: i,
          onSelect: a,
          onClick: d,
          onNavigate: l
        }
      ) : /* @__PURE__ */ c("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            "aria-label": i ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": i,
            onClick: (u) => {
              u.stopPropagation(), a();
            },
            children: i ? "✓" : ""
          }
        ),
        /* @__PURE__ */ r("button", { type: "button", className: "dq-tag-list-name", onClick: d, children: e.name }),
        /* @__PURE__ */ r("span", { children: e.tagGroupName || "Ungrouped" }),
        /* @__PURE__ */ r("span", { children: e.description || "" }),
        /* @__PURE__ */ c("span", { children: [
          e.videoCount ?? 0,
          " videos"
        ] })
      ] })
    }
  );
}
function cl({
  video: e,
  showTagBins: t,
  displayMode: n,
  cardsScroll: i,
  focused: o,
  selected: s,
  setRef: a,
  onFocus: d,
  onToggle: l,
  onPreview: u,
  onNavigate: m
}) {
  var h, O;
  const b = qa(e), g = P(null), y = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, v = !!(y.date || y.studioName), S = !!(y.performers.length || y.tags.length);
  return wn(() => {
    const C = g.current;
    if (!C) return;
    const I = C.querySelector(
      `a[href="/video/${e.id}"]`
    ), U = C.querySelector(".card-title"), D = `dq-card-title-${e.id}`;
    U && (U.id = D), I && (I.target = "_blank", I.rel = "noreferrer", I.removeAttribute("aria-label"), I.setAttribute("aria-labelledby", D), I.classList.add("dq-card-link"));
    const A = C.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    A && A.setAttribute(
      "aria-label",
      s ? `Deselect ${b}` : `Select ${b}`
    );
    const k = C.querySelector(
      'button[title="Quick View"]'
    );
    k && k.setAttribute("aria-label", `Preview ${b}`);
  }), /* @__PURE__ */ c(
    "article",
    {
      ref: (C) => {
        g.current = C, a(C);
      },
      tabIndex: 0,
      "aria-current": o ? "true" : void 0,
      "aria-label": `${b}${s ? ", selected" : ""}`,
      onFocus: d,
      onClick: (C) => {
        d(), C.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${v ? "has-card-metadata" : "no-card-metadata"} ${S ? "has-card-footer" : "no-card-footer"} ${o ? "focused" : ""} ${s ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ r(
          Ka,
          {
            video: y,
            selected: s,
            onSelect: l,
            onNavigate: m,
            onQuickView: u,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ c("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (h = e.tags) == null ? void 0 : h.map((C) => /* @__PURE__ */ r("span", { children: C.name }, C.id)),
          !((O = e.tags) != null && O.length) && /* @__PURE__ */ r("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ r(ll, { video: e, cardsScroll: i })
      ]
    }
  );
}
function ll({ video: e, cardsScroll: t }) {
  const n = P(null), i = P(null), [o, s] = q(!1), [a, d] = q(!1), [l, u] = q(!1);
  return z(() => {
    const m = n.current;
    if (!m || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      s(!0), d(!0);
      return;
    }
    const b = t ? m.closest(".dq-grid-stage") : null, g = new IntersectionObserver(
      ([v]) => s(v.isIntersecting),
      { root: b, rootMargin: "320px 0px", threshold: 0 }
    ), y = new IntersectionObserver(
      ([v]) => d(v.isIntersecting && v.intersectionRatio >= 0.6),
      { root: b, threshold: [0, 0.6, 1] }
    );
    return g.observe(m), y.observe(m), () => {
      g.disconnect(), y.disconnect();
    };
  }, [e.id, e.files.length, t]), z(() => {
    if (!o) {
      u(!1);
      return;
    }
    const m = new AbortController();
    return Z($s(e.id), {
      signal: m.signal
    }).then((b) => {
      m.signal.aborted || u(b.available === !0);
    }).catch(() => {
      m.signal.aborted || u(!1);
    }), () => m.abort();
  }, [o, e.id]), z(() => {
    const m = i.current;
    m && (a ? Promise.resolve(m.play()).catch(() => {
    }) : m.pause());
  }, [l, a]), /* @__PURE__ */ r("div", { ref: n, className: "dq-wall-autoplay", "aria-hidden": "true", children: l && /* @__PURE__ */ r(
    "video",
    {
      ref: i,
      src: Ms(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function dl({
  video: e,
  review: t,
  selectedCount: n,
  pending: i,
  refreshing: o,
  error: s,
  canWrite: a,
  assessmentReady: d,
  trees: l,
  selected: u,
  hasPrevious: m,
  hasNext: b,
  onToggleSelected: g,
  onPrevious: y,
  onNext: v,
  onClose: S,
  onAction: h,
  findOpen: O,
  onFindOpenChange: C
}) {
  const I = P(null), U = P(null), D = e.files[0], A = qa(e), k = (x) => i || o || "steps" in x && x.steps.length > 0 && !a || cn(x) && !d;
  Ri({
    surface: "overlay",
    enabled: !O,
    actionCount: t.actions.length,
    onAction: (x) => {
      const $ = t.actions[x];
      $ && h($);
    },
    onFind: () => C(!0)
  }), z(() => {
    var $;
    const x = document.body.style.overflow;
    return document.body.style.overflow = "hidden", ($ = I.current) == null || $.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = x;
    };
  }, []);
  function L(x) {
    var E, X, ne;
    if (x.key !== "Tab") return;
    const $ = [
      ...((E = I.current) == null ? void 0 : E.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((fe) => fe.offsetParent !== null);
    if (!$.length) {
      x.preventDefault(), (X = I.current) == null || X.focus();
      return;
    }
    const G = $.indexOf(
      document.activeElement
    );
    x.shiftKey && G <= 0 ? (x.preventDefault(), (ne = $.at(-1)) == null || ne.focus()) : !x.shiftKey && G === $.length - 1 && (x.preventDefault(), $[0].focus());
  }
  function j(x) {
    if (O || x.defaultPrevented || x.ctrlKey || x.metaKey || x.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const $ = x.key === "ArrowLeft" || x.key === "ArrowRight";
    if (x.altKey && !$) return;
    const G = U.current, E = x.currentTarget.querySelector("video");
    if (x.key === "Enter" || x.key === "Escape")
      x.repeat || S();
    else if (x.key === " " && G)
      x.repeat || G.toggle();
    else if ($ && G)
      G.seekBy(
        (x.key === "ArrowLeft" ? -1 : 1) * (x.shiftKey ? 5 : x.altKey ? 10 : 60)
      );
    else if ((x.key === "," || x.key === ".") && G) {
      const X = [D == null ? void 0 : D.duration, E == null ? void 0 : E.duration].find(
        (fe) => fe != null && Number.isFinite(fe) && fe > 0
      ) ?? 0, ne = e.parentVideoId != null ? (e.clipEndSec ?? X) - (e.clipStartSec ?? 0) : X;
      Number.isFinite(ne) && ne > 0 && G.seekBy((x.key === "," ? -1 : 1) * ne * 0.1);
    } else if (x.key.toLowerCase() === "n" || x.key.toLowerCase() === "m")
      !x.repeat && !i && !o && (x.key.toLowerCase() === "n" && m && y(), x.key.toLowerCase() === "m" && b && v());
    else if (x.key === "ArrowUp" && E)
      E.volume = Math.min(1, E.volume + 0.1);
    else if (x.key === "ArrowDown" && E)
      E.volume = Math.max(0, E.volume - 0.1);
    else return;
    xt(x);
  }
  function ae(x) {
    const $ = I.current, G = x.target instanceof Element ? x.target.closest("button, a[href]") : null;
    !$ || !G || !$.contains(G) || G.closest(".dq-player, .dq-find-action") || x.detail === 0 || $.focus({ preventScroll: !0 });
  }
  z(() => {
    if (O) return;
    let x = 0;
    const $ = requestAnimationFrame(() => {
      x = requestAnimationFrame(() => {
        var E;
        const G = document.activeElement;
        (E = I.current) != null && E.isConnected && (!G || G === document.body || G === document.documentElement) && I.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame($), cancelAnimationFrame(x);
    };
  }, [O, i, o, b, m, e.id]);
  const J = n ? `the ${n} selected video${n === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ c(
    "div",
    {
      ref: I,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${A}`,
      className: "dq-preview",
      onKeyDown: L,
      onKeyDownCapture: j,
      onMouseDown: (x) => {
        x.target === x.currentTarget && S();
      },
      onClick: ae,
      children: [
        /* @__PURE__ */ c("div", { className: "dq-preview-shell", children: [
          /* @__PURE__ */ c("header", { className: "dq-preview-header", children: [
            /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "dq-preview-button",
                "aria-label": "Previous video",
                "aria-keyshortcuts": "n",
                title: "Previous video",
                disabled: !m || i || o,
                onClick: y,
                children: [
                  /* @__PURE__ */ r(wi, { "aria-hidden": "true" }),
                  /* @__PURE__ */ r(st, { binding: "n", hidden: !0 })
                ]
              }
            ),
            /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "dq-preview-button",
                "aria-label": "Next video",
                "aria-keyshortcuts": "m",
                title: "Next video",
                disabled: !b || i || o,
                onClick: v,
                children: [
                  /* @__PURE__ */ r(st, { binding: "m", hidden: !0 }),
                  /* @__PURE__ */ r(Si, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ c("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ r("h2", { children: A }),
              /* @__PURE__ */ c("p", { children: [
                "Actions apply to ",
                J
              ] })
            ] }),
            /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "dq-preview-button dq-preview-select",
                "aria-pressed": u,
                disabled: o,
                onClick: g,
                children: [
                  /* @__PURE__ */ r("span", { className: "dq-preview-check", "aria-hidden": "true", children: u && /* @__PURE__ */ r(Ro, {}) }),
                  "Selected"
                ]
              }
            ),
            /* @__PURE__ */ r(
              "a",
              {
                href: `/video/${e.id}`,
                target: "_blank",
                rel: "noreferrer",
                className: "dq-preview-button dq-preview-icon",
                "aria-label": `Open ${A} in a new tab`,
                title: "Open video in a new tab",
                children: /* @__PURE__ */ r(To, { "aria-hidden": "true" })
              }
            ),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-preview-button dq-preview-icon",
                "aria-label": "Close preview",
                "aria-keyshortcuts": "Escape",
                title: "Close preview",
                onClick: S,
                children: /* @__PURE__ */ r(Oo, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ r("div", { className: "dq-preview-video", children: D ? /* @__PURE__ */ r(
            vo,
            {
              autostart: !0,
              streamUrl: ci("video", e.id),
              posterUrl: Yi(e),
              format: D.format,
              audioCodec: D.audioCodec,
              duration: D.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onPlaybackControlRegister: (x) => (U.current = x, () => {
                U.current === x && (U.current = null);
              }),
              clip: e.parentVideoId != null ? {
                start: e.clipStartSec ?? 0,
                end: e.clipEndSec,
                loop: !1
              } : void 0
            }
          ) : /* @__PURE__ */ r("img", { src: Yi(e), alt: "" }) }) }),
          s && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert dq-preview-alert", children: s }),
          /* @__PURE__ */ c("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ r("span", { children: "Space play / pause" }),
            /* @__PURE__ */ r("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ r("span", { children: ", . ±10 %" }),
            /* @__PURE__ */ r("span", { children: "↑ ↓ volume" }),
            /* @__PURE__ */ r("span", { children: "N M previous / next" }),
            /* @__PURE__ */ r("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ r(
            aa,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: l,
              isDisabled: k,
              busy: i || o,
              onApply: (x) => void h(x),
              onFind: () => C(!0),
              status: i ? `Applying action to ${J}…` : "",
              summary: /* @__PURE__ */ r("p", { className: "dq-bar-target", children: n ? `${n} selected` : "This video" })
            }
          )
        ] }),
        O && /* @__PURE__ */ r(
          Ii,
          {
            actions: t.actions,
            trees: l,
            isDisabled: k,
            canStay: !1,
            onApply: (x) => {
              C(!1), h(x);
            },
            onClose: () => C(!1)
          }
        )
      ]
    }
  );
}
function ul({
  reviews: e,
  activeReview: t,
  tagGroups: n,
  initialEdit: i = !1,
  onEditWorkspace: o,
  onSave: s,
  onChoose: a,
  onClose: d
}) {
  const [l, u] = q(
    () => i && t ? structuredClone(t) : null
  ), [m, b] = q(""), [g, y] = q(!1), [v, S] = q(
    i && t != null
  ), h = P(null);
  z(() => {
    var L, j;
    const A = document.activeElement, k = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (j = (L = h.current) == null ? void 0 : L.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || j.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = k, A == null || A.focus({ preventScroll: !0 });
    };
  }, []);
  function O(A) {
    var j, ae, J;
    if (A.defaultPrevented) {
      A.stopPropagation();
      return;
    }
    if (A.key === "Escape") {
      xt(A), g || d();
      return;
    }
    if (A.key !== "Tab") {
      A.stopPropagation();
      return;
    }
    const k = [
      ...((j = h.current) == null ? void 0 : j.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((x) => x.offsetParent !== null);
    if (!k.length) {
      xt(A), (ae = h.current) == null || ae.focus();
      return;
    }
    const L = k.indexOf(
      document.activeElement
    );
    A.shiftKey && L <= 0 ? (xt(A), (J = k.at(-1)) == null || J.focus()) : !A.shiftKey && L === k.length - 1 ? (xt(A), k[0].focus()) : A.stopPropagation();
  }
  function C(A, k = !!A) {
    S(k), u(
      A ? structuredClone(A) : {
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
    ), b("");
  }
  async function I() {
    if (g) return;
    if (!l || Tr(l)) {
      b(l ? Tr(l) : "Choose a review.");
      return;
    }
    const A = { ...l, name: l.name.trim() }, k = e.some((L) => L.id === A.id) ? e.map((L) => L.id === A.id ? A : L) : [...e, A];
    y(!0), b("");
    try {
      if (!await s(k)) throw new Error("Could not save reviews.");
      !e.some((L) => L.id === A.id) && A.entityType !== "tag" ? o(A.id) : (a(A.id), d());
    } catch (L) {
      b(
        "Could not save reviews. Your edits are still open. " + (L instanceof Error ? L.message : "Retry saving.")
      );
    } finally {
      y(!1);
    }
  }
  async function U(A) {
    if (!g) {
      y(!0), b("");
      try {
        if (!await s(A)) throw new Error("Could not save reviews.");
      } catch (k) {
        b(
          k instanceof Error ? k.message : "Could not save reviews."
        );
      } finally {
        y(!1);
      }
    }
  }
  async function D(A) {
    var L;
    if (g) return;
    const k = (L = A.target.files) == null ? void 0 : L[0];
    if (A.target.value = "", !!k) {
      if (k.size > 2e6) {
        b("Review files must be smaller than 2 MB.");
        return;
      }
      y(!0), b("");
      try {
        const j = cr(await k.text());
        if (!await s(ri(e, j)))
          throw new Error("Could not save reviews.");
      } catch (j) {
        b(
          j instanceof Error ? j.message : "Could not import reviews."
        );
      } finally {
        y(!1);
      }
    }
  }
  return /* @__PURE__ */ r(
    "div",
    {
      ref: h,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: O,
      children: /* @__PURE__ */ c("div", { className: "dq-manager", children: [
        /* @__PURE__ */ c("header", { children: [
          /* @__PURE__ */ c("div", { children: [
            /* @__PURE__ */ r("h2", { children: l ? e.some((A) => A.id === l.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ r("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: g,
              onClick: d,
              children: /* @__PURE__ */ r(Oo, {})
            }
          )
        ] }),
        m && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: m }),
        /* @__PURE__ */ r("fieldset", { disabled: g, className: "dq-manager-content", children: l ? /* @__PURE__ */ r(
          Ca,
          {
            setup: l.entityType !== "tag" && !e.some((A) => A.id === l.id),
            draft: l,
            entityTypeLocked: v,
            tagGroups: n,
            saving: g,
            setDraft: u,
            onSave: () => void I(),
            onCancel: d
          }
        ) : /* @__PURE__ */ c(se, { children: [
          /* @__PURE__ */ c("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: () => {
              const A = URL.createObjectURL(new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })), k = document.createElement("a");
              k.href = A, k.download = "data-quality-reviews.json", k.click(), URL.revokeObjectURL(A);
            }, children: "Export reviews" }),
            /* @__PURE__ */ c(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => C(),
                children: [
                  /* @__PURE__ */ r(ns, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ c("label", { className: "dq-button", children: [
              /* @__PURE__ */ r(rs, {}),
              " Import reviews",
              /* @__PURE__ */ r(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: D
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-review-list", children: e.map((A) => /* @__PURE__ */ c("article", { children: [
            /* @__PURE__ */ c("div", { children: [
              /* @__PURE__ */ c("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ r($i, { entityType: Fe(A) }),
                /* @__PURE__ */ r("strong", { children: A.name })
              ] }),
              /* @__PURE__ */ r("p", { children: A.description || "No description" })
            ] }),
            /* @__PURE__ */ c("button", { type: "button", onClick: () => A.entityType === "tag" || Fe(A) === "video" && A.view.reviewMode === "multiple" ? C(A) : o(A.id), children: [
              /* @__PURE__ */ r(vi, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: () => C({
                  ...structuredClone(A),
                  id: crypto.randomUUID(),
                  name: `${A.name} copy`
                }, !0),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${A.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${A.name}”?`) && U(
                    e.filter((k) => k.id !== A.id)
                  );
                },
                children: /* @__PURE__ */ r(Io, {})
              }
            )
          ] }, A.id)) })
        ] }) })
      ] })
    }
  );
}
function Ca({
  workspace: e = !1,
  setup: t = !1,
  draft: n,
  entityTypeLocked: i,
  tagGroups: o,
  saving: s = !1,
  setDraft: a,
  onSave: d,
  onCancel: l
}) {
  const [u, m] = q("Review"), b = Fe(n), g = ue(n), y = (h) => {
    if (!(i || h === b)) {
      if (h === "performerOccurrence" || h === "audioPerformerOccurrence") {
        a({
          id: n.id,
          entityType: h,
          name: n.name,
          description: n.description,
          view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "end" },
          actions: [],
          occurrence: { targetMode: "all", performerIds: [], performerFilter: {}, condition: "any", conditionTagIds: [], tagIds: [], multiple: !0 }
        });
        return;
      }
      if (h === "audio") {
        a({
          id: n.id,
          entityType: "audio",
          name: n.name,
          description: n.description,
          view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "end", reviewMode: "single" },
          actions: []
        });
        return;
      }
      a(
        h === "tag" ? {
          id: n.id,
          entityType: "tag",
          name: n.name,
          description: n.description,
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
          id: n.id,
          entityType: "video",
          name: n.name,
          description: n.description,
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
  }, v = P(/* @__PURE__ */ new WeakMap()), S = (h) => {
    let O = v.current.get(h);
    return O || (O = crypto.randomUUID(), v.current.set(h, O)), O;
  };
  return /* @__PURE__ */ c("div", { className: "dq-editor", children: [
    /* @__PURE__ */ r("div", { className: "dq-editor-nav", children: /* @__PURE__ */ r(
      Ua,
      {
        tabs: (t ? ["Review"] : e ? ["Review", ...b === "video" ? ["Appearance"] : [], "Actions", ...g ? ["Tag choices"] : []] : g ? ["Review", "Queue", "Actions", ...n.occurrence.tagIds.length ? ["Tag choices"] : []] : b === "audio" ? ["Review", "Queue", "Actions"] : ["Review", "Queue", "Appearance", "Actions"]).map((h) => ({
          key: h,
          label: h,
          count: h === "Actions" ? n.actions.length : void 0,
          disabled: s
        })),
        activeTab: u,
        onTabChange: m
      }
    ) }),
    /* @__PURE__ */ c("div", { className: "dq-editor-body", children: [
      /* @__PURE__ */ c("section", { hidden: u !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ r("h3", { children: "Review details" }),
        /* @__PURE__ */ r("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ c("label", { children: [
          "Entity type",
          /* @__PURE__ */ c(
            "select",
            {
              "aria-label": "Entity type",
              value: b,
              disabled: i,
              onChange: (h) => y(h.target.value),
              children: [
                /* @__PURE__ */ r("option", { value: "video", children: "Videos" }),
                /* @__PURE__ */ r("option", { value: "audio", children: "Audios" }),
                /* @__PURE__ */ r("option", { value: "tag", children: "Tags" }),
                /* @__PURE__ */ r("option", { value: "performerOccurrence", children: "Performer occurrence tags" }),
                /* @__PURE__ */ r("option", { value: "audioPerformerOccurrence", children: "Audio performer occurrence tags" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ c("label", { children: [
          "Review name",
          /* @__PURE__ */ r(
            "input",
            {
              autoFocus: !0,
              "aria-label": "Review name",
              value: n.name,
              onChange: (h) => a({ ...n, name: h.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ c("label", { children: [
          "Description",
          /* @__PURE__ */ r(
            "textarea",
            {
              "aria-label": "Description",
              value: n.description,
              onChange: (h) => a({ ...n, description: h.target.value })
            }
          )
        ] }),
        g && !t && /* @__PURE__ */ r(
          Gs,
          {
            review: n,
            onChange: a
          }
        )
      ] }),
      !e && !t && /* @__PURE__ */ c("section", { hidden: u !== "Queue", className: "dq-editor-section", children: [
        /* @__PURE__ */ r(fo, { draft: n, onChange: a, presentation: !1 }),
        g && /* @__PURE__ */ r(Xi, { review: n, onChange: a })
      ] }),
      !t && g && /* @__PURE__ */ r("section", { hidden: u !== "Tag choices", className: "dq-editor-section", children: /* @__PURE__ */ r(Xi, { review: n, onChange: a, choices: !0 }) }),
      !t && b !== "audio" && !g && (!e || b === "video") && /* @__PURE__ */ r("section", { hidden: u !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ r(fo, { draft: n, onChange: a, queue: !1 }) }),
      !t && /* @__PURE__ */ r("section", { hidden: u !== "Actions", className: "dq-editor-section", children: b === "tag" ? /* @__PURE__ */ r(
        pl,
        {
          draft: n,
          saving: s,
          tagGroups: o,
          setDraft: a
        }
      ) : /* @__PURE__ */ r(
        fl,
        {
          draft: n,
          saving: s,
          stepKey: S,
          rememberStepKey: (h, O) => v.current.set(h, S(O)),
          setDraft: a
        }
      ) })
    ] }),
    !e && /* @__PURE__ */ c("div", { className: "dq-editor-footer", children: [
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const h = URL.createObjectURL(
              new Blob([JSON.stringify([n], null, 2)], {
                type: "application/json"
              })
            ), O = document.createElement("a");
            O.href = h, O.download = "data-quality-review.json", O.click(), URL.revokeObjectURL(h);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ r("button", { className: "dq-button", type: "button", onClick: l, children: "Cancel" }),
      /* @__PURE__ */ r("button", { className: "dq-button primary", type: "button", onClick: d, children: t ? "Create & configure" : "Save review" })
    ] })
  ] });
}
function Aa({
  action: e,
  onChange: t
}) {
  return /* @__PURE__ */ r("div", { className: "dq-field-grid", children: /* @__PURE__ */ c("label", { children: [
    "Button label",
    /* @__PURE__ */ r(
      "input",
      {
        value: e.label,
        onChange: (n) => t({ ...e, label: n.target.value })
      }
    )
  ] }) });
}
function fl({
  draft: e,
  saving: t,
  stepKey: n,
  rememberStepKey: i,
  setDraft: o
}) {
  const [s, a] = q(!1), [d, l] = q(null), u = P(null), m = jn(), b = () => {
    a(!1), requestAnimationFrame(() => {
      var y;
      return (y = u.current) == null ? void 0 : y.focus();
    });
  }, g = (y, v) => o({
    ...e,
    actions: e.actions.map(
      (S, h) => h === y ? v : S
    )
  });
  return /* @__PURE__ */ c(se, { children: [
    /* @__PURE__ */ r("h3", { children: "Actions" }),
    ue(e) && /* @__PURE__ */ c("p", { children: [
      "Actions apply only to the active performer in this ",
      vt(me(e)).one,
      ". Set performer matching in the review filters below. Save review keeps those criteria with this rule."
    ] }),
    /* @__PURE__ */ r("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails. Removing tags and descendants never removes a tag the same action adds." }),
    /* @__PURE__ */ r("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ r(
      Zr,
      {
        items: e.actions,
        getKey: (y) => y.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (y) => o({ ...e, actions: y }),
        renderItem: (y, { index: v, dragHandleProps: S, isOver: h }) => /* @__PURE__ */ c(
          "fieldset",
          {
            className: h ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ c("legend", { children: [
                "Action ",
                v + 1
              ] }),
              /* @__PURE__ */ c("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    ...S,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${v + 1}`,
                    children: /* @__PURE__ */ r(qi, {})
                  }
                ),
                /* @__PURE__ */ r("strong", { children: y.label || "New action" }),
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    onClick: () => o({
                      ...e,
                      actions: [
                        ...e.actions.slice(0, v + 1),
                        {
                          ...structuredClone(y),
                          id: crypto.randomUUID(),
                          label: y.label + " copy"
                        },
                        ...e.actions.slice(v + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ r(
                Aa,
                {
                  action: y,
                  onChange: (O) => g(v, O)
                }
              ),
              /* @__PURE__ */ r(
                Zr,
                {
                  items: y.steps,
                  getKey: n,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (O) => g(v, { ...y, steps: O }),
                  renderItem: (O, C) => /* @__PURE__ */ r(
                    hl,
                    {
                      dragHandleProps: C.dragHandleProps,
                      saving: t,
                      isOver: C.isOver,
                      step: O,
                      index: C.index,
                      onChange: (I) => {
                        i(I, O), g(v, {
                          ...y,
                          steps: y.steps.map(
                            (U, D) => D === C.index ? I : U
                          )
                        });
                      },
                      onRemove: () => g(v, {
                        ...y,
                        steps: y.steps.filter(
                          (I, U) => U !== C.index
                        )
                      })
                    }
                  )
                }
              ),
              /* @__PURE__ */ c("div", { className: "dq-row", children: [
                /* @__PURE__ */ r(
                  "button",
                  {
                    className: "dq-button",
                    type: "button",
                    onClick: () => g(v, {
                      ...y,
                      steps: [...y.steps, { mode: "ADD", tagIds: [] }]
                    }),
                    children: "Add step"
                  }
                ),
                /* @__PURE__ */ r(
                  "button",
                  {
                    className: "dq-button",
                    type: "button",
                    onClick: () => o({
                      ...e,
                      actions: e.actions.filter(
                        (O, C) => C !== v
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
    /* @__PURE__ */ c("div", { className: "dq-row dq-add-actions", children: [
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => o({
            ...e,
            actions: [
              ...e.actions,
              { id: crypto.randomUUID(), label: "", steps: [] }
            ]
          }),
          children: "Add action"
        }
      ),
      /* @__PURE__ */ r(
        "button",
        {
          ref: u,
          className: "dq-button",
          type: "button",
          "aria-expanded": s,
          "aria-controls": s ? m : void 0,
          disabled: t,
          onClick: () => {
            l(null), a(!s);
          },
          children: "Add actions from parent tags…"
        }
      ),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-editor-note", children: (d == null ? void 0 : d.actions) === e.actions ? `Added ${d.count} action${d.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    s && /* @__PURE__ */ r(
      Ys,
      {
        id: m,
        review: e,
        disabled: t,
        onAdd: (y) => {
          const v = [...e.actions, ...y];
          o({ ...e, actions: v }), l({ actions: v, count: y.length }), b();
        },
        onCancel: b
      }
    )
  ] });
}
function pl({
  draft: e,
  saving: t,
  tagGroups: n,
  setDraft: i
}) {
  const o = (s, a) => i({
    ...e,
    actions: e.actions.map(
      (d, l) => l === s ? a : d
    )
  });
  return /* @__PURE__ */ c(se, { children: [
    /* @__PURE__ */ r("h3", { children: "Actions" }),
    /* @__PURE__ */ r("p", { children: "Each action assigns one tag group, clears the group, or skips." }),
    /* @__PURE__ */ r("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ r(
      Zr,
      {
        items: e.actions,
        getKey: (s) => s.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (s) => i({ ...e, actions: s }),
        renderItem: (s, { index: a, dragHandleProps: d, isOver: l }) => /* @__PURE__ */ c(
          "fieldset",
          {
            className: l ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ c("legend", { children: [
                "Action ",
                a + 1
              ] }),
              /* @__PURE__ */ c("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    ...d,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${a + 1}`,
                    children: /* @__PURE__ */ r(qi, {})
                  }
                ),
                /* @__PURE__ */ r("strong", { children: s.label || "New action" }),
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    onClick: () => i({
                      ...e,
                      actions: [
                        ...e.actions.slice(0, a + 1),
                        {
                          ...structuredClone(s),
                          id: crypto.randomUUID(),
                          label: s.label + " copy"
                        },
                        ...e.actions.slice(a + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ r(
                Aa,
                {
                  action: s,
                  onChange: (u) => o(a, u)
                }
              ),
              /* @__PURE__ */ c("label", { children: [
                "Action effect",
                /* @__PURE__ */ c(
                  "select",
                  {
                    "aria-label": "Tag group action",
                    value: s.effect.mode === "SET_TAG_GROUP" ? `group:${s.effect.tagGroupId}` : s.effect.mode,
                    onChange: (u) => {
                      const m = u.target.value;
                      o(a, {
                        ...s,
                        effect: m === "SKIP" ? { mode: "SKIP" } : m === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : {
                          mode: "SET_TAG_GROUP",
                          tagGroupId: Number(m.slice(6))
                        }
                      });
                    },
                    children: [
                      /* @__PURE__ */ r("option", { value: "SKIP", children: "Skip" }),
                      /* @__PURE__ */ r("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
                      s.effect.mode === "SET_TAG_GROUP" && !n.some(
                        (u) => u.id === s.effect.tagGroupId
                      ) && /* @__PURE__ */ r(
                        "option",
                        {
                          value: `group:${s.effect.tagGroupId}`,
                          disabled: !0,
                          children: "Unavailable tag group"
                        }
                      ),
                      n.map((u) => /* @__PURE__ */ r("option", { value: `group:${u.id}`, children: u.name }, u.id))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ r(
                "button",
                {
                  className: "dq-button",
                  type: "button",
                  onClick: () => i({
                    ...e,
                    actions: e.actions.filter(
                      (u, m) => m !== a
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
    /* @__PURE__ */ r(
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
function hl({
  step: e,
  index: t,
  dragHandleProps: n,
  saving: i,
  isOver: o,
  onChange: s,
  onRemove: a
}) {
  const d = rl(e.mode);
  return /* @__PURE__ */ c(
    "div",
    {
      className: o ? "dq-action-step dq-drag-over" : "dq-action-step",
      "data-step-tone": d,
      children: [
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            ...n,
            disabled: i,
            className: "dq-drag-handle",
            "aria-label": `Reorder step ${t + 1}`,
            children: /* @__PURE__ */ r(qi, {})
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
            onChange: (l) => s({ ...e, mode: l.target.value }),
            children: [
              /* @__PURE__ */ r("option", { value: "ADD", children: "Add tags" }),
              /* @__PURE__ */ r("option", { value: "REMOVE", children: "Remove tags" }),
              /* @__PURE__ */ r("option", { value: "REMOVE_TREE", children: "Remove tags and descendants" }),
              /* @__PURE__ */ r("option", { value: "MARK_PRESENT", children: "Mark present" }),
              /* @__PURE__ */ r("option", { value: "MARK_ABSENT", children: "Mark absent" }),
              /* @__PURE__ */ r("option", { value: "CLEAR_ABSENCE", children: "Clear absence" })
            ]
          }
        ),
        /* @__PURE__ */ r("div", { className: "dq-step-tags", children: /* @__PURE__ */ r(
          Lt,
          {
            entityType: "tag",
            values: e.tagIds,
            onChange: (l) => s({ ...e, tagIds: l }),
            placeholder: "Choose tags",
            allowCreate: !1
          }
        ) }),
        /* @__PURE__ */ r("button", { type: "button", "aria-label": "Remove step", onClick: a, children: /* @__PURE__ */ r(Io, {}) })
      ]
    }
  );
}
async function ml() {
  const e = await Z("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
  let i = n ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (n)
    try {
      const a = JSON.parse(n);
      Array.isArray(a.reviews) && (i = JSON.stringify(a.reviews, null, 2));
    } catch {
    }
  const o = URL.createObjectURL(
    new Blob([i], { type: "application/json" })
  ), s = document.createElement("a");
  s.href = o, s.download = "data-quality-browser-recovery.json", s.click(), URL.revokeObjectURL(o);
}
function go({ label: e }) {
  return /* @__PURE__ */ c("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ r(ts, { className: "dq-spin" }),
    e
  ] });
}
function bo({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ c("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ r(ni, {}),
    /* @__PURE__ */ r("p", { children: e }),
    /* @__PURE__ */ r("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const Nl = { components: { DataQualityPage: il } };
export {
  il as DataQualityPage,
  Nl as default,
  _n as objectFiltersEqual
};
