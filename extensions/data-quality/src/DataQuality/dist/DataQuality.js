import { jsxs as c, jsx as r, Fragment as se } from "react/jsx-runtime";
import { useState as N, useRef as P, useEffect as z, useLayoutEffect as jn, useMemo as We, useId as ir, useSyncExternalStore as ya, useCallback as cn } from "react";
import { EntityReferenceMultiSelector as Lt, useKeySequence as wa, DetailListToolbar as er, AUDIO_CRITERIA as mi, VIDEO_CRITERIA as Ir, PERFORMER_CRITERIA as gi, NarrativeText as va, AUDIO_SORT_OPTIONS as mo, VIDEO_SORT_OPTIONS as bi, AudioPlayer as Sa, VideoPlayer as go, formatDuration as bo, FilterDialog as yo, getResolutionLabel as Na, useCustomFieldFilterSection as Ea, TAG_SORT_OPTIONS as wo, TAG_CRITERIA as vo, DetailListPagination as qa, EntityDetailTabs as Ca, TagTile as Aa, VideoCard as ka, SortableList as Yr } from "@cove/runtime/components";
import { Search as yi, Layers as Ta, Ban as Xr, Pin as Ra, RefreshCw as Ia, Flag as Zr, Tags as Oa, Headphones as So, Film as Er, ChevronLeft as Or, Pencil as Mr, RectangleHorizontal as Ma, LayoutGrid as $a, MoreHorizontal as Pa, ChevronRight as wi, Users as Fa, ChevronDown as xa, Save as No, RotateCcw as Eo, ExternalLink as qo, Tag as La, SkipForward as Da, AlertTriangle as ei, Settings as _a, Loader2 as Co, X as Ao, Plus as ja, Upload as Ua, Trash2 as ko, GripVertical as vi } from "@cove/runtime/lucide-react";
import { extensionFetch as Ka } from "@cove/runtime/api";
const $r = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, Pr = Object.keys(
  $r
);
function Un(e) {
  return e === "excludes" || e === "excludesAll";
}
function Si(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
const Ba = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function de(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function Yn(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function he(e) {
  return Yn(Me(e));
}
function To(e) {
  return Me(e) === "video";
}
function Me(e) {
  return e.entityType ?? "video";
}
const tr = [
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
function qr(e) {
  return de(e) && !Io(e.occurrence) ? "Complete the optional occurrence condition before saving." : !To(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : Me(e) !== "tag" && e.actions.some(
    (t) => Ro(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => kn(t, Me(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const Ga = {
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
      Math.min(Ga[t], n(e.perPage, 40))
    )
  };
}
function Gi(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function Pt(e) {
  const { page: t, ...n } = e.view.filter, i = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    de(e) ? [e.entityType, ...i, e.occurrence] : Me(e) === "video" ? i : [Me(e), ...i]
  );
}
function kn(e, t) {
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
  ) && !Ro(e) : !1;
}
function Va(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function Qt(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function Fr(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function dn(e) {
  return "steps" in e ? e.steps.some((t) => Qt(t.mode)) : !1;
}
function Ro(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (Qt(n.mode))
      for (const i of n.tagIds) {
        const o = t.get(i);
        if (o && o !== n.mode) return !0;
        t.set(i, n.mode);
      }
  return !1;
}
function or(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || Ba.includes(n.entityType)) && (!Va(n.entityType) || Io(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && Ja(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(n.actions) && n.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && (n.entityType === "tag" ? "effect" in i && !("steps" in i) && kn(i, "tag") : "steps" in i && !("effect" in i) && Array.isArray(i.steps) && i.steps.every(
        (o) => o && Array.isArray(o.tagIds)
      ) && kn(i, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => qr(n)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((n) => n.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function Ja(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= 115 && n.cardSize <= 380) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (i) => ["date", "studio", "performers", "tags"].includes(i)
  )) && [n.annotationParents, n.binParents].every(
    (i) => i === void 0 || Array.isArray(i) && i.every((o) => Number.isSafeInteger(o) && o > 0)
  );
}
function ti(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const o of i)
      n.has(o.id) || (n.add(o.id), t.push(o));
  return t;
}
function Io(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (i) => Array.isArray(i) && i.every((o) => Number.isSafeInteger(o) && o > 0) && new Set(i).size === i.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && Pr.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function Vi(e, t) {
  return e.size > 0 ? [...e].sort((n, i) => n - i) : t == null ? [] : [t];
}
function Ji(e, t, n, i) {
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
function zi(e, t) {
  const n = new Set(e), i = t.length > 0 && t.every((o) => n.has(o));
  for (const o of t)
    i ? n.delete(o) : n.add(o);
  return n;
}
function za(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function Wa(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-actions, .dq-pagination-row, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function Qa(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function Ha(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function Ya(e, t) {
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
const Oo = "ext:com.midnightrider.data-quality:configuration", Xa = "ext:cove-data-quality:video-reviews", ni = "ext:com.midnightrider.data-quality:progress", ar = /* @__PURE__ */ new Map(), yr = /* @__PURE__ */ new Map(), Cn = (e, t) => e.includes("*") || e.includes(t), Cr = (e) => Z(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Za = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function ri(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Dn(e) {
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
    reviews: or(JSON.stringify(t.reviews)),
    deletedIds: ri(t.deletedIds),
    importedIds: ri(t.importedIds)
  };
}
function es(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const i = /* @__PURE__ */ new Set();
  for (const o of t) {
    const s = localStorage.getItem(o);
    if (s !== null) {
      const a = or(s);
      n ?? (n = a), a.forEach((p) => i.add(p.id));
    }
    ri(
      JSON.parse(localStorage.getItem(`${o}:account-imports`) ?? "[]")
    ).forEach((a) => i.add(a));
  }
  return {
    reviews: n ?? [],
    known: [...i],
    present: n !== void 0
  };
}
async function Mo(e) {
  const t = await Z("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function $o(e, t) {
  const n = (yr.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return yr.set(e, n), n.finally(() => {
    yr.get(e) === n && yr.delete(e);
  }).catch(() => {
  }), n;
}
let Qn = null;
function ts() {
  if (Qn) return Qn;
  const e = ns();
  return Qn = e, e.finally(() => {
    Qn === e && (Qn = null);
  }).catch(() => {
  }), e;
}
async function ns() {
  var b;
  const e = await Z("/api/auth/me"), t = String(e.user.id), n = `cove-data-quality-v2:${t}`, i = Cn(e.permissions, "savedfilters.read"), o = i && Cn(e.permissions, "savedfilters.write"), s = i ? (await Cr(Oo)).filter((y) => y.name === "Data Quality configuration").sort((y, S) => y.id - S.id) : [];
  if (s.length > 1) {
    const y = (S) => {
      const { revision: q, ...m } = Dn(S.uiOptions);
      return JSON.stringify(m);
    };
    if (s.some((S) => y(S) !== y(s[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (o)
      for (const S of s.slice(1))
        await Z(`/api/savedfilters/${S.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${S.id}` })
        });
    s.splice(1);
  }
  let a = s.length ? Dn(s[0].uiOptions) : Za();
  const p = localStorage.getItem(`${n}:migrated`) === "true", l = localStorage.getItem(n), d = localStorage.getItem(`${n}:local-only`) === "true";
  !s.length && l && (a = Dn(l));
  let g = !s.length;
  if (s.length && d && l) {
    const y = Dn(l);
    if (y.reviews.some((q) => {
      const m = a.reviews.find((R) => R.id === q.id);
      return m && JSON.stringify(m) !== JSON.stringify(q);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const S = [
      .../* @__PURE__ */ new Set([...a.deletedIds, ...y.deletedIds])
    ];
    a = {
      ...a,
      reviews: ti(a.reviews, y.reviews).filter(
        (q) => !S.includes(q.id)
      ),
      deletedIds: S,
      importedIds: [
        .../* @__PURE__ */ new Set([...a.importedIds, ...y.importedIds])
      ]
    }, g = !0;
  }
  if (!p) {
    const y = JSON.stringify(a), S = es(t);
    if (s.length && S.reviews.some((E) => {
      const L = a.reviews.find((B) => B.id === E.id);
      return L && JSON.stringify(L) !== JSON.stringify(E);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const q = i ? (await Cr(Xa)).flatMap(
      (E) => or(E.uiOptions ?? "[]")
    ) : [], m = S.known.filter(
      (E) => !S.reviews.some((L) => L.id === E)
    ), R = /* @__PURE__ */ new Set([...a.deletedIds, ...m]);
    a = {
      ...a,
      reviews: ti(
        S.reviews,
        a.reviews,
        q.filter(
          (E) => !S.known.includes(E.id) && !a.importedIds.includes(E.id)
        )
      ).filter((E) => !R.has(E.id)),
      deletedIds: [...R],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...a.importedIds,
          ...S.known,
          ...q.map((E) => E.id)
        ])
      ]
    }, g || (g = JSON.stringify(a) !== y);
  }
  const h = {
    userId: t,
    recordId: (b = s[0]) == null ? void 0 : b.id,
    config: a,
    readable: i,
    writable: o,
    durable: o
  };
  if (ar.set(n, h), g && o) {
    const y = a;
    s.length && (h.config = Dn(s[0].uiOptions)), await Po(n, y), a = h.config;
  } else s.length || (localStorage.setItem(n, JSON.stringify(a)), !i && (!p || d) && localStorage.setItem(`${n}:local-only`, "true"));
  if (!i) localStorage.setItem(`${n}:migrated`, "true");
  else if (o)
    try {
      localStorage.setItem(`${n}:migrated`, "true");
    } catch {
    }
  return {
    reviews: a.reviews,
    storageKey: n,
    canWrite: Cn(e.permissions, "videos.write"),
    canWriteVideos: Cn(e.permissions, "videos.write"),
    canWriteAudios: Cn(e.permissions, "audios.write"),
    canWriteTags: Cn(e.permissions, "tags.write"),
    canReadTagGroups: Cn(e.permissions, "taggroups.read"),
    canConfigure: !i || o,
    storageNotice: i ? o ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Po(e, t) {
  const n = ar.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await Mo(n), n.recordId != null) {
      const s = await Z(
        `/api/savedfilters/${n.recordId}`
      );
      if (Dn(s.uiOptions).revision !== n.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const o = await Z(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Oo,
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
function rs(e, t) {
  return or(JSON.stringify(t)), $o(e, async () => {
    const n = ar.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const i = n.config.reviews.filter((o) => !t.some((s) => s.id === o.id)).map((o) => o.id);
    await Po(e, {
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
async function is(e, t) {
  const n = ar.get(e);
  if (!n) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), o = i ? Wi(i) : null;
  if (!n.readable) return o;
  const s = (await Cr(ni)).find(
    (p) => p.name === t
  ), a = s ? Wi(s.uiOptions) : null;
  return o && (!a || o.updatedAt > a.updatedAt) ? o : a;
}
function os(e, t, n) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(n));
  } catch {
  }
  return $o(i, async () => {
    const o = ar.get(e);
    if (!(o != null && o.writable)) return;
    await Mo(o);
    const s = (await Cr(ni)).find(
      (a) => a.name === t
    );
    await Z(
      s ? `/api/savedfilters/${s.id}` : "/api/savedfilters",
      {
        method: s ? "PUT" : "POST",
        body: JSON.stringify({
          mode: ni,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function un(e) {
  return e === "audio" ? "audios" : "videos";
}
const as = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function bt(e) {
  return as[e];
}
const Ar = "confirmed_absent_tags", Ni = "Confirmed absent tags", xr = "confirmed_absent_occurrence_tags", Fo = {
  key: Ar,
  label: Ni,
  type: "tag",
  subject: "tag assessments"
}, Ei = {
  key: xr,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, ss = {
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
function Ht(e) {
  return Array.isArray(e) ? e.map(Ht) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? ss[n] ?? n : t === "key" && typeof n == "string" && [
        Ar,
        xr
      ].includes(n.toLowerCase()) ? n.toLowerCase() : Ht(n)
    ])
  ) : e;
}
async function xo(e, t, n) {
  const i = new Headers(t.headers);
  !(t.body instanceof FormData) && !i.has("Content-Type") && i.set("Content-Type", "application/json");
  const o = await Ka(e, { ...t, headers: i });
  if (o.status === 404 && n === "null") return null;
  if (!o.ok) {
    let a = o.statusText || `Request failed (${o.status}).`;
    try {
      const p = await o.json();
      a = p.message || p.detail || p.error || a;
    } catch {
    }
    throw new Error(a);
  }
  if (o.status === 204 || o.status === 205) return;
  const s = await o.text();
  return s ? JSON.parse(s) : void 0;
}
async function Z(e, t = {}) {
  return await xo(e, t, "fail");
}
function cs(e, t = {}) {
  return xo(e, t, "null");
}
const ls = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let ds = 0;
function ii(e, t) {
  return Z(
    `/api/${un(e)}/${t}?dqRead=${ls}-${++ds}`,
    { cache: "no-store" }
  );
}
function Lo(e, t) {
  const n = { ...e.view.objectFilter }, i = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    Ht({
      findFilter: Xe(t, he(e)),
      objectFilter: n,
      filterExpression: i
    })
  );
}
async function Xn(e, t, n) {
  return Z(
    `/api/${un(he(e))}/find`,
    { method: "POST", signal: n, body: Lo(e, t) }
  );
}
async function us(e, t, n) {
  return (await Z(
    `/api/${un(he(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: Lo(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function Qi(e, t, n) {
  const i = { ...e.view.objectFilter };
  return delete i._filterExpression, Z("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      Ht({
        findFilter: Xe(t),
        objectFilter: i
      })
    )
  });
}
function fs(e) {
  return Z("/api/taggroups", { signal: e });
}
function oi(e, t, n = 1280) {
  return `/api/${un(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function ai(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function Hi(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function ps(e) {
  return `/api/stream/video/${e}/preview`;
}
function hs(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function ms(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Lr(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const i of e) {
    await Z(`/api/tags/${i}`, { signal: t }), n.add(i);
    for (let o = 1; ; o++) {
      const s = await Z("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Ht({
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
async function qi(e, t) {
  const n = Fr(e);
  return (await Promise.all(
    e.steps.map(
      async (o) => o.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await Lr(o.tagIds, t)).filter(
          (s) => !n.has(s)
        )
      } : o
    )
  )).filter((o) => o.tagIds.length > 0);
}
function gs(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function Ci(e, t) {
  const i = (await Z("/api/custom-fields")).find(
    (s) => s.key.toLowerCase() === e.key
  );
  if (!i)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const o = gs(e, i);
  return o ? { kind: "incompatible", message: o } : i.entityTypes.includes(t) ? { kind: "ready", definition: i, message: "" } : {
    kind: "missing",
    message: `Add ${bt(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: i
  };
}
async function Do(e, t) {
  const n = await Ci(e, t);
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
function _o(e = "video") {
  return Ci(Fo, e);
}
function bs(e = "video") {
  return Do(Fo, e);
}
function jo(e = "video") {
  return Ci(Ei, e);
}
function ys(e = "video") {
  return Do(Ei, e);
}
function kr(e) {
  return [...new Set(e)];
}
function Uo(e, t) {
  const n = e.customFields ?? {}, i = Object.keys(n).find(
    (s) => s.toLowerCase() === xr
  ), o = i === void 0 ? [] : n[i];
  return kr(
    (Array.isArray(o) ? o : []).filter(
      (s) => typeof s == "string" && /^[1-9]\d*:[1-9]\d*$/.test(s)
    ).map((s) => s.split(":").map(Number)).filter(([s]) => s === t).map(([, s]) => s)
  );
}
async function ws(e) {
  let t;
  try {
    t = await jo(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${Ei.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function vs(e, t, n, i, o, s) {
  await Z(`/api/${un(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: kr(o).map((a) => `${i}:${a}`)
      },
      customFieldMode: s
    })
  });
}
function Ss(e, t, n) {
  const i = [...e.tagIds], o = (s) => {
    if (n === null)
      throw new Error(
        `The ${Ni} custom field is not available.`
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
async function Ko(e, t, n) {
  if (!kn(t) || n.length === 0 || n.some((l) => !Number.isSafeInteger(l) || l <= 0))
    throw new Error(
      `Choose ${bt(e).many} and configure a valid action first.`
    );
  let i = null;
  if (dn(t)) {
    let l;
    try {
      l = await _o(e);
    } catch (d) {
      throw new Error(
        `Could not verify the ${Ni} custom field. ${d instanceof Error ? d.message : "Request failed."}`
      );
    }
    if (l.kind !== "ready") throw new Error(l.message);
    i = l.definition.key;
  }
  const o = kr(n), s = (await qi(t)).map((l) => ({
    mode: l.mode,
    tagIds: kr(l.tagIds)
  })), p = [
    ...s.filter((l) => !Qt(l.mode)),
    ...s.filter((l) => Qt(l.mode))
  ].map(
    (l) => Ss(l, o, i)
  );
  for (let l = 0; l < p.length; l++)
    try {
      await Z(`/api/${un(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(p[l])
      });
    } catch (d) {
      throw new Error(
        `Step ${l + 1} failed; ${l} earlier step(s) completed. Refresh and check the selected ${bt(e).many} before retrying. ${d instanceof Error ? d.message : "Request failed."}`
      );
    }
}
async function Ns(e, t) {
  if (!kn(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await Z("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
function Yi({
  review: e,
  onChange: t,
  choices: n = !1
}) {
  const i = e.occurrence, o = bt(he(e)).queue, s = (a) => t({ ...e, occurrence: { ...i, ...a } });
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
          children: Pr.map((a) => /* @__PURE__ */ r("option", { value: a, children: $r[a] }, a))
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
      Un(i.condition) && /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
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
function Es({
  review: e,
  onChange: t
}) {
  const n = bt(he(e)).many;
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
const Xi = 1e3;
async function qs(e, t, n) {
  const i = await Z(
    `/api/tags/${t}`,
    { signal: n }
  ), o = /* @__PURE__ */ new Map();
  for (let l = 1; ; l++) {
    const d = await Z(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          Ht({
            findFilter: {
              page: l,
              perPage: Xi,
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
    for (const g of d.items) o.set(g.id, g);
    if (l * Xi >= d.totalCount) break;
    if (!d.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const s = [...o.values()], a = he(e), p = de(e) ? await As(
    a,
    s.map((l) => l.id),
    n
  ) : s.map((l) => (a === "audio" ? l.audioCount : l.videoCount) ?? 0);
  return {
    parent: { id: t, name: i.name },
    children: s.map((l, d) => ({ id: l.id, name: l.name, uses: p[d] })).sort(
      (l, d) => d.uses - l.uses || l.name.localeCompare(d.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      })
    )
  };
}
function Cs(e) {
  return JSON.stringify(
    Ht({
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
async function As(e, t, n) {
  const i = new Array(t.length).fill(0), o = new AbortController(), s = () => o.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && s(), n == null || n.addEventListener("abort", s, { once: !0 });
  let a = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; a < t.length && !o.signal.aborted; ) {
            const p = a++;
            i[p] = (await Z(
              `/api/${un(e)}/aggregate`,
              {
                method: "POST",
                signal: o.signal,
                body: Cs(t[p])
              }
            )).count;
          }
        } catch (p) {
          throw o.abort(), p;
        }
      })
    );
  } finally {
    n == null || n.removeEventListener("abort", s);
  }
  return o.signal.throwIfAborted(), i;
}
function ks(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((i) => t.has(i.id) ? !1 : (t.add(i.id), !0))
  }));
}
function Ts(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const i of n.children)
      t.set(i.id, [...t.get(i.id) ?? [], n.parent.id]);
  return t;
}
function Rs(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const i of Fr(n))
      t.set(i, [...t.get(i) ?? [], n]);
  return t;
}
function Is(e, t) {
  return {
    id: crypto.randomUUID(),
    label: e.name,
    steps: [
      { mode: "ADD", tagIds: [e.id] },
      ...t.length ? [{ mode: "REMOVE_TREE", tagIds: t }] : []
    ]
  };
}
const Os = (e) => e instanceof Error ? e.message : "Request failed.";
function Ms({
  id: e,
  review: t,
  disabled: n,
  onAdd: i,
  onCancel: o
}) {
  const [s, a] = N([]), [p, l] = N({}), [d, g] = N({}), [h, b] = N({}), y = P(/* @__PURE__ */ new Map());
  z(
    () => () => {
      for (const F of y.current.values()) F.abort();
    },
    []
  );
  const S = bt(he(t)), q = de(t), m = q ? "performer" : S.one;
  function R(F) {
    var C;
    (C = y.current.get(F)) == null || C.abort();
    const J = new AbortController();
    y.current.set(F, J), l((X) => ({ ...X, [F]: { status: "loading" } })), qs(t, F, J.signal).then(
      (X) => {
        J.signal.aborted || l((re) => ({
          ...re,
          [F]: { status: "ready", group: X }
        }));
      },
      (X) => {
        J.signal.aborted || l((re) => ({
          ...re,
          [F]: { status: "failed", message: Os(X) }
        }));
      }
    );
  }
  function E(F) {
    var Ce;
    const J = s.filter((ie) => !F.includes(ie));
    for (const ie of J)
      (Ce = y.current.get(ie)) == null || Ce.abort(), y.current.delete(ie);
    const C = (ie) => {
      const Ne = p[ie];
      return (Ne == null ? void 0 : Ne.status) === "ready" ? Ne.group.children.map((Dt) => Dt.id) : [];
    }, X = new Set(F.flatMap(C)), re = J.flatMap(C).filter((ie) => !X.has(ie));
    g(
      (ie) => Object.fromEntries(
        Object.entries(ie).filter(([Ne]) => !re.includes(Number(Ne)))
      )
    ), b(
      (ie) => Object.fromEntries(
        Object.entries(ie).filter(([Ne]) => F.includes(Number(Ne)))
      )
    ), l(
      (ie) => Object.fromEntries(
        Object.entries(ie).filter(([Ne]) => F.includes(Number(Ne)))
      )
    ), a(F);
    for (const ie of F) s.includes(ie) || R(ie);
  }
  const L = s.flatMap((F) => {
    const J = p[F];
    return (J == null ? void 0 : J.status) === "ready" ? [J.group] : [];
  }), B = L.length === s.length, ne = s.some(
    (F) => {
      var J;
      return (((J = p[F]) == null ? void 0 : J.status) ?? "loading") === "loading";
    }
  ), M = new Map(
    ks(L).map((F) => [F.parent.id, F])
  ), $ = Ts(L), x = new Map(L.map((F) => [F.parent.id, F.parent.name])), j = Rs(t.actions), O = (F) => d[F] ?? !j.has(F), _ = B ? [...M.values()].flatMap(
    (F) => F.children.filter((J) => O(J.id))
  ) : [], oe = (F, J) => g((C) => ({
    ...C,
    ...Object.fromEntries(F.children.map((X) => [X.id, J]))
  }));
  return /* @__PURE__ */ c("fieldset", { id: e, className: "dq-actions-from-tags", children: [
    /* @__PURE__ */ r("legend", { children: "Add actions from parent tags" }),
    /* @__PURE__ */ c("p", { className: "dq-editor-note", children: [
      "Each ticked child tag becomes an action that adds it, most used",
      " ",
      q ? "on performers " : "",
      "first. Tags an action already adds start unticked. The new actions go at the end, ready to reorder and edit."
    ] }),
    /* @__PURE__ */ r(
      Lt,
      {
        entityType: "tag",
        values: s,
        onChange: E,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    s.map((F) => {
      const J = p[F];
      if (!J || J.status === "loading")
        return /* @__PURE__ */ r("p", { className: "dq-editor-note", children: "Loading child tags…" }, F);
      if (J.status === "failed")
        return /* @__PURE__ */ c("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ c("span", { children: [
            "Child tags could not be loaded. ",
            J.message
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: n,
              onClick: () => R(F),
              children: "Retry"
            }
          )
        ] }, F);
      const C = M.get(F);
      if (!C) return null;
      const X = C.parent.name;
      return /* @__PURE__ */ c("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ r("legend", { children: X }),
        J.group.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-editor-note", children: "This tag has no child tags." }) : /* @__PURE__ */ c(se, { children: [
          /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: h[F] ?? !1,
                disabled: n,
                onChange: (re) => b((Ce) => ({
                  ...Ce,
                  [F]: re.target.checked
                }))
              }
            ),
            "Only one per ",
            m,
            ": each action removes every other tag in the ",
            X,
            " tree"
          ] }),
          C.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-editor-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ c(se, { children: [
            /* @__PURE__ */ c("div", { className: "dq-row", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${X}`,
                  onClick: () => oe(C, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${X}`,
                  onClick: () => oe(C, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ r("div", { className: "dq-child-tags", children: C.children.map((re) => {
              const Ce = j.get(re.id) ?? [], ie = ($.get(re.id) ?? []).filter((Ne) => Ne !== F).map((Ne) => `“${x.get(Ne)}”`);
              return /* @__PURE__ */ c("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "checkbox",
                    checked: O(re.id),
                    disabled: n,
                    onChange: (Ne) => g((Dt) => ({
                      ...Dt,
                      [re.id]: Ne.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ c("span", { children: [
                  re.name,
                  " ",
                  /* @__PURE__ */ c("small", { children: [
                    re.uses.toLocaleString(),
                    " ",
                    re.uses === 1 ? S.one : S.many
                  ] }),
                  ie.length > 0 && /* @__PURE__ */ c("small", { children: [
                    " · Also under ",
                    ie.join(", ")
                  ] }),
                  Ce.length > 0 && /* @__PURE__ */ c("small", { children: [
                    " ",
                    "· Already in “",
                    Ce[0].label || "New action",
                    "”",
                    Ce.length > 1 ? ` and ${Ce.length - 1} more` : ""
                  ] })
                ] })
              ] }, re.id);
            }) })
          ] })
        ] })
      ] }, F);
    }),
    /* @__PURE__ */ c("div", { className: "dq-row", children: [
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: n || !_.length,
          onClick: () => i(
            _.map(
              (F) => Is(
                F,
                ($.get(F.id) ?? []).filter(
                  (J) => h[J]
                )
              )
            )
          ),
          children: _.length ? `Add ${_.length} action${_.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: o, children: "Cancel" }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-sr-only", children: ne ? "Loading child tags…" : "" })
    ] })
  ] });
}
const Bo = "-", $s = "Ctrl+a", Ps = "Ctrl/⌘A";
function wr(e) {
  return (t) => {
    t != null && t.repeat || e();
  };
}
function Ai({
  surface: e,
  enabled: t,
  actionCount: n,
  onAction: i,
  onFind: o,
  onSelectAll: s
}) {
  const a = P({ onAction: i, onFind: o, onSelectAll: s });
  jn(() => {
    a.current = { onAction: i, onFind: o, onSelectAll: s };
  });
  const p = Math.max(0, Math.min(n, tr.length)), l = !!o && n > 0, d = e === "local" && !!s, g = We(() => {
    const h = [];
    return d && h.push({
      keys: $s,
      surface: "local",
      action: wr(() => {
        var b, y;
        return (y = (b = a.current).onSelectAll) == null ? void 0 : y.call(b);
      })
    }), l && h.push({
      keys: Bo,
      surface: e,
      action: wr(() => {
        var b, y;
        return (y = (b = a.current).onFind) == null ? void 0 : y.call(b);
      })
    }), tr.slice(0, p).forEach(
      (b, y) => h.push(
        {
          keys: b,
          surface: e,
          action: wr(() => a.current.onAction(y, !1))
        },
        {
          keys: `Shift+${b}`,
          surface: e,
          action: wr(() => a.current.onAction(y, !0))
        }
      )
    ), h;
  }, [e, p, l, d]);
  wa(g, t);
}
const Fs = {
  action: (e) => tr[e] ?? "",
  find: Bo,
  selectAll: Ps
};
function Bn() {
  return Fs;
}
const xs = 600 * 1e3, si = /* @__PURE__ */ new Map(), ln = /* @__PURE__ */ new Map();
function Go(e) {
  const t = si.get(e);
  if (t) {
    if (Date.now() - t.at > xs) {
      si.delete(e);
      return;
    }
    return t.name;
  }
}
function Ls(e) {
  const t = ln.get(e);
  if (t) return t;
  const n = new AbortController(), i = {
    controller: n,
    waiters: 0,
    promise: Z(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (o) => {
        var a;
        const s = ((a = o == null ? void 0 : o.name) == null ? void 0 : a.trim()) || null;
        return ln.get(e) === i && ln.delete(e), s && si.set(e, { name: s, at: Date.now() }), s;
      },
      () => (ln.get(e) === i && ln.delete(e), null)
    )
  };
  return ln.set(e, i), i;
}
function Zi() {
  return new DOMException("The tag name request was aborted.", "AbortError");
}
function Gr(e) {
  const t = {};
  for (const n of e) {
    const i = Go(n);
    i !== void 0 && (t[n] = i);
  }
  return t;
}
function Ds(e, t) {
  if (t != null && t.aborted) return Promise.reject(Zi());
  const n = {}, i = [];
  for (const o of new Set(e)) {
    const s = Go(o);
    if (s !== void 0) n[o] = s;
    else {
      const a = Ls(o);
      a.waiters += 1, i.push({ id: o, entry: a });
    }
  }
  return i.length ? new Promise((o, s) => {
    let a = !1;
    const p = () => {
      for (const { id: d, entry: g } of i)
        g.waiters -= 1, g.waiters === 0 && ln.get(d) === g && (ln.delete(d), g.controller.abort());
    }, l = () => {
      a || (a = !0, p(), s(Zi()));
    };
    t == null || t.addEventListener("abort", l, { once: !0 }), Promise.all(
      i.map(
        ({ id: d, entry: g }) => g.promise.then((h) => [d, h])
      )
    ).then((d) => {
      if (!a) {
        a = !0, t == null || t.removeEventListener("abort", l), p();
        for (const [g, h] of d) n[g] = h;
        o(n);
      }
    });
  }) : Promise.resolve(n);
}
function sr(e) {
  const t = [...new Set(e)].sort((o, s) => o - s).join(","), [n, i] = N(() => ({
    key: t,
    names: Gr(Vr(t))
  }));
  return z(() => {
    const o = Vr(t), s = Gr(o);
    if (i({ key: t, names: s }), o.every((p) => p in s)) return;
    const a = new AbortController();
    return Ds(o, a.signal).then(
      (p) => i({ key: t, names: p }),
      () => {
      }
    ), () => a.abort();
  }, [t]), n.key === t ? n.names : Gr(Vr(t));
}
function Vr(e) {
  return e ? e.split(",").map(Number) : [];
}
function _s(e, t, n = !1) {
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
function ki(e, t, n = [], i) {
  if ("effect" in e) {
    const a = e.effect;
    if (a.mode === "SKIP") return [{ text: "Skip", tone: "neutral" }];
    if (a.mode === "CLEAR_TAG_GROUP")
      return [{ text: "Set Ungrouped", tone: "neutral" }];
    const p = n.find((l) => l.id === a.tagGroupId);
    return [
      {
        text: p ? `Assign ${p.name}` : "Unavailable tag group",
        tone: "neutral"
      }
    ];
  }
  if (!e.steps.length) return [{ text: "Skip", tone: "neutral" }];
  const o = Fr(e), s = (a) => o.has(a) || [...o].some((p) => {
    var l;
    return (l = i == null ? void 0 : i.get(a)) == null ? void 0 : l.includes(p);
  });
  return e.steps.flatMap(
    (a) => a.tagIds.map(
      (p) => _s(
        a.mode,
        t[p] === void 0 ? "…" : t[p] ?? "Unavailable tag",
        a.mode === "REMOVE_TREE" && s(p)
      )
    )
  );
}
function js(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function Ti({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: i,
  canStay: o = !0,
  onApply: s,
  onClose: a
}) {
  const [p, l] = N(""), [d, g] = N(0), h = P(null), b = P(null), y = P(null), S = P(null), q = P(null), m = ir(), R = sr(We(() => js(e), [e])), E = Bn(), L = We(() => {
    const x = p.trim().toLocaleLowerCase();
    return e.map((j, O) => ({ action: j, index: O, key: E.action(O) })).filter((j) => !x || j.action.label.toLocaleLowerCase().includes(x));
  }, [e, E, p]), B = L.length ? Math.min(d, L.length - 1) : -1, ne = (x) => `${m}-option-${x}`;
  jn(() => {
    var x, j, O;
    return S.current = document.activeElement, q.current = ((j = (x = y.current) == null ? void 0 : x.parentElement) == null ? void 0 : j.closest('[role="dialog"]')) ?? null, (O = h.current) == null || O.focus({ preventScroll: !0 }), () => {
      var oe;
      const _ = S.current;
      _ instanceof HTMLElement && _.isConnected && _.focus({ preventScroll: !0 }), document.activeElement !== _ && ((oe = q.current) != null && oe.isConnected) && q.current.focus({ preventScroll: !0 });
    };
  }, []), z(() => {
    var x, j, O;
    B < 0 || (O = (j = (x = b.current) == null ? void 0 : x.querySelector(`[id="${ne(L[B].index)}"]`)) == null ? void 0 : j.scrollIntoView) == null || O.call(j, { block: "nearest" });
  }, [B, L]);
  function M(x, j) {
    !x || i != null && i(x.action) || s(x.action, o && j);
  }
  function $(x) {
    var j;
    if (x.stopPropagation(), x.key === "Escape")
      x.preventDefault(), a();
    else if (x.key === "Enter")
      x.preventDefault(), x.repeat || M(L[B], x.shiftKey);
    else if (x.key === "ArrowDown" || x.key === "ArrowUp") {
      if (x.preventDefault(), !L.length) return;
      const O = x.key === "ArrowDown" ? 1 : -1;
      g((B + O + L.length) % L.length);
    } else x.key === "Tab" && (x.preventDefault(), (j = h.current) == null || j.focus());
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
        onKeyDown: $,
        onMouseDown: (x) => {
          x.target !== h.current && x.preventDefault();
        },
        children: [
          /* @__PURE__ */ c("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ r(yi, { "aria-hidden": "true" }),
            /* @__PURE__ */ r(
              "input",
              {
                ref: h,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${m}-list`,
                "aria-activedescendant": B >= 0 ? ne(L[B].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: p,
                onChange: (x) => {
                  l(x.target.value), g(0);
                }
              }
            ),
            /* @__PURE__ */ r("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          L.length ? /* @__PURE__ */ r(
            "ul",
            {
              ref: b,
              id: `${m}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: L.map((x, j) => /* @__PURE__ */ r("li", { role: "none", children: /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: ne(x.index),
                  tabIndex: -1,
                  "aria-selected": j === B,
                  disabled: (i == null ? void 0 : i(x.action)) ?? !1,
                  onClick: (O) => M(x, O.shiftKey),
                  children: [
                    x.key ? /* @__PURE__ */ r("kbd", { children: x.key }) : /* @__PURE__ */ r("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ r("span", { className: "dq-find-label", children: x.action.label }),
                    /* @__PURE__ */ r("span", { className: "dq-find-effect", children: ki(x.action, R, t, n).map(
                      (O, _) => /* @__PURE__ */ r("span", { "data-effect-tone": O.tone, children: O.text }, _)
                    ) })
                  ]
                }
              ) }, x.action.id))
            }
          ) : /* @__PURE__ */ c("p", { className: "dq-find-empty", role: "status", children: [
            "No action matches “",
            p.trim(),
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
function Vo({
  onClick: e,
  disabled: t,
  className: n = "dq-button"
}) {
  const i = Bn().find;
  return /* @__PURE__ */ c(
    "button",
    {
      type: "button",
      className: `${n} dq-find-button`,
      "aria-keyshortcuts": i,
      disabled: t,
      onClick: e,
      children: [
        /* @__PURE__ */ r(yi, { "aria-hidden": "true" }),
        "Find action",
        /* @__PURE__ */ r("kbd", { "aria-hidden": "true", children: i })
      ]
    }
  );
}
function Tr(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Ri(e) {
  return String(e.type).toLowerCase() === "tag";
}
function Ii(e) {
  return !!String(e ?? "").trim();
}
function Oi(e) {
  return [
    ...new Set(
      Tr(e.customFieldCriteria).filter(Ri).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !Ii(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function Mi(e, t) {
  const n = Tr(e.customFieldCriteria);
  if (!n.length) return e;
  let i = !1;
  const o = n.map((s) => {
    if (!Ri(s)) return s;
    const a = { ...s };
    for (const [p, l] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const d = t[String(s[p] ?? "")];
      d && !Ii(s[l]) && (a[l] = d, i = !0);
    }
    return a;
  });
  return i ? { ...e, customFieldCriteria: o } : e;
}
function Jo(e, t, n) {
  const i = Tr(e.customFieldCriteria);
  if (!i.length) return e;
  const o = Tr(n.customFieldCriteria), s = (l, d) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (g) => (l[g] ?? void 0) === (d[g] ?? void 0)
  );
  let a = !1;
  const p = i.map((l) => {
    if (!Ri(l)) return l;
    const d = o.find((h) => s(h, l));
    if (!d) return l;
    const g = { ...l };
    for (const [h, b] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const y = t[String(l[h] ?? "")];
      y && l[b] === y && !Ii(d[b]) && (delete g[b], a = !0);
    }
    return g;
  });
  return a ? { ...e, customFieldCriteria: p } : e;
}
async function Us(e, t, n) {
  if (!kn(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const i = he(e), o = n.steps.some((p) => Qt(p.mode)) ? await ws(i) : "", s = await qi(n);
  let a = t.applications;
  for (const p of [
    ...s.filter((l) => !Qt(l.mode)),
    ...s.filter((l) => Qt(l.mode))
  ]) {
    const l = (d) => vs(
      o,
      i,
      t.media.id,
      t.performer.id,
      p.tagIds,
      d
    );
    (p.mode === "MARK_PRESENT" || p.mode === "CLEAR_ABSENCE") && await l("REMOVE"), p.mode !== "CLEAR_ABSENCE" && (a = await Ho(
      {
        ...e,
        occurrence: {
          ...e.occurrence,
          tagIds: p.tagIds,
          multiple: !0
        }
      },
      t,
      ["ADD", "MARK_PRESENT"].includes(p.mode) ? p.tagIds : []
    )), p.mode === "MARK_ABSENT" && await l("ADD");
  }
  return a;
}
async function $i(e, t) {
  const n = e.occurrence;
  if (Si(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const i = /* @__PURE__ */ new Set(), { _filterExpression: o, ...s } = n.performerFilter;
  for (let a = 1; ; a++) {
    const p = await Z("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Ht({
          findFilter: { page: a, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: s,
          filterExpression: o
        })
      )
    });
    if (p.items.forEach((l) => i.add(l.id)), a * 1e3 >= p.totalCount) return [...i];
    if (!p.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function zo(e) {
  return Un(e.condition) && e.hideConfirmedAbsent !== !1;
}
function Pi(e, t) {
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
  }, a = zo(o) && (t == null ? void 0 : t.length) === 1 && o.conditionTagIds.length === 1 ? `${t[0]}:${o.conditionTagIds[0]}` : null;
  return {
    ...e,
    entityType: he(e),
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
                      key: xr,
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
async function Fi(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => Lr([n], t))
  );
}
function Wo(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function Ks(e, t, n = e.conditionTagIds.map((i) => [i])) {
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
function Bs(e, t, n, i, o) {
  if (!zo(e)) return !1;
  const s = Uo(t, n);
  return e.conditionTagIds.every(
    (a, p) => s.includes(a) || o[p].some((l) => i.includes(l))
  );
}
async function Qo(e, t, n, i) {
  if ((t == null ? void 0 : t.length) === 0 || Wo(e.occurrence))
    return { items: [], totalCount: 0 };
  const o = he(e), s = await Xn(
    Pi(e, t),
    { ...e.view.filter, page: n },
    i
  ), a = t === null ? null : new Set(t), p = e.occurrence, l = s.items.length ? await Fi(p, i) : [], d = new Array(s.items.length);
  let g = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, s.items.length) }, async () => {
      for (; g < s.items.length; ) {
        const h = g++, b = s.items[h], y = await Z(
          `/api/tagapplications?hostType=${o}&hostId=${b.id}&contextType=performer`,
          { signal: i }
        );
        d[h] = b.performers.filter((S) => a === null || a.has(S.id)).flatMap((S) => {
          const q = y.filter(
            (R) => R.hostType === o && R.hostId === b.id && R.contextType === "performer" && R.contextId === S.id
          ), m = q.map((R) => R.tag.id);
          return Ks(e.occurrence, m, l) && !Bs(p, b, S.id, m, l) ? [
            {
              key: `${b.id}:${S.id}`,
              media: b,
              performer: S,
              applications: q
            }
          ] : [];
        });
      }
    })
  ), { items: d.flat(), totalCount: s.totalCount };
}
async function Ho(e, t, n) {
  const i = new Set(e.occurrence.tagIds);
  if (n.some((d) => !i.has(d)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const o = he(e), s = await ii(o, t.media.id);
  if (!s.performers.some(
    (d) => d.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${o}. Refresh the queue.`
    );
  const a = `/api/tagapplications?hostType=${o}&hostId=${s.id}&contextType=performer&contextId=${t.performer.id}`, p = (await Z(a)).filter(
    (d) => d.hostType === o && d.hostId === s.id && d.contextType === "performer" && d.contextId === t.performer.id
  ), l = new Set(n);
  try {
    for (const d of l)
      p.some((g) => g.tag.id === d) || await Z("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: o,
          hostId: s.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: d,
          sourceKey: "user"
        })
      });
    for (const d of p)
      i.has(d.tag.id) && !l.has(d.tag.id) && await Z(`/api/tagapplications/${d.id}`, {
        method: "DELETE"
      });
    return await Z(a);
  } catch (d) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${d instanceof Error ? d.message : "Request failed."}`
    );
  }
}
function Kn(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function Gs(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function kt(e, t, n = !0) {
  var p;
  if (t.occurrence) {
    const l = n ? Uo(
      await ii(e, t.media.id),
      t.occurrence.performer.id
    ) : [], d = (await Z(Gs(e, t))).filter(
      (g) => g.hostType === e && g.hostId === t.media.id && g.contextType === "performer" && g.contextId === t.occurrence.performer.id
    );
    return {
      ids: [...new Set(d.map((g) => g.tag.id))],
      names: [...new Set(d.map((g) => g.tag.name))],
      absent: l,
      applications: d
    };
  }
  const i = await ii(e, t.media.id), o = (i.tags ?? []).filter(
    (l) => l.canRemove !== !1 || l.isDerived !== !0
  ), s = Object.keys(i.customFields ?? {}).find(
    (l) => l.toLowerCase() === Ar
  ) ?? Ar, a = ((p = i.customFields) == null ? void 0 : p[s]) ?? [];
  if (!Array.isArray(a) || a.some((l) => !Number.isSafeInteger(l)))
    throw new Error(
      `Confirmed absent tags are invalid. Inspect the ${e} before editing.`
    );
  return { ids: o.map((l) => l.id), names: o.map((l) => l.name), absent: a };
}
async function xi(e, t, n) {
  if (t.occurrence && de(e))
    await Ho(
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
        `/api/${un(he(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: i, tagIds: o })
        }
      );
}
async function Vs(e, t, n) {
  t.occurrence && de(e) ? await Us(e, t.occurrence, n) : await Ko(he(e), n, [t.media.id]);
}
function ci(e, t, n, i) {
  const o = (s) => s.filter((a) => i.includes(a));
  return {
    item: e,
    before: t,
    after: n,
    tags: Kn(o(t.ids), o(n.ids)),
    absence: Kn(o(t.absent), o(n.absent))
  };
}
function Js(e, t) {
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
const li = (e) => e instanceof Error ? e.message : "Request failed.", eo = (e) => [...e].sort((t, n) => t - n), nr = (e, t) => JSON.stringify(eo(e)) === JSON.stringify(eo(t)), di = (e) => !!(e.tags.added.length || e.tags.removed.length);
function Rr(e, t, n, i) {
  const o = new Set(e), s = new Set(e);
  for (const g of t.steps)
    for (const h of g.tagIds)
      g.mode === "ADD" ? s.add(h) : s.delete(h);
  const a = e.some((g) => !s.has(g));
  if (a && !i)
    return { desired: [...e], conflict: a, skipped: !0, kept: [], replaced: [] };
  const p = new Set(
    t.steps.filter((g) => g.mode === "ADD").flatMap((g) => g.tagIds)
  ), l = [], d = [];
  for (const g of n) {
    const h = g.filter((y) => s.has(y) && !o.has(y)), b = g.filter(
      (y) => s.has(y) && o.has(y) && !p.has(y)
    );
    !h.length || !b.length || (i ? (b.forEach((y) => s.delete(y)), d.push(...b)) : (h.forEach((y) => s.delete(y)), l.push({ tagIds: h, existing: b })));
  }
  return { desired: [...s], conflict: a, skipped: !1, kept: l, replaced: d };
}
function zs(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function Ws(e, t, n, i) {
  for (const [o, s] of n.entries()) {
    const a = t.filter(
      (d) => d.steps.some(
        (g) => g.mode === "ADD" && g.tagIds.some((h) => s.includes(h))
      )
    );
    if (a.length < 2) continue;
    const p = e.occurrence.conditionTagIds[o];
    let l = `tag ${p}`;
    try {
      l = (await Z(`/api/tags/${p}`, { signal: i })).name;
    } catch {
      i.throwIfAborted();
    }
    throw new Error(
      `${a.map((d) => d.label).join(" and ")} answer the same condition tag, ${l}. Choose one of them.`
    );
  }
}
async function Qs(e, t, n, i = () => {
}) {
  if (!t.length || t.some(
    (b) => !kn(b, e.entityType) || !b.steps.length || b.steps.some(
      (y) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(y.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const o = structuredClone(e), s = structuredClone(t), a = Un(o.occurrence.condition) && o.occurrence.includeSubtags !== !1 ? await Fi(o.occurrence, n) : [];
  await Ws(o, s, a, n);
  const p = await Promise.all(
    s.map(async (b) => ({
      ...b,
      steps: await qi(b, n)
    }))
  ), l = structuredClone(zs(p));
  n.throwIfAborted();
  const d = [
    .../* @__PURE__ */ new Set([
      ...l.steps.flatMap((b) => b.tagIds),
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
  const g = await $i(o, n), h = /* @__PURE__ */ new Map();
  for (let b = 1; ; b++) {
    n.throwIfAborted();
    const y = await Qo(o, g, b, n);
    for (const S of y.items) {
      const q = {
        ids: [...new Set(S.applications.map((R) => R.tag.id))],
        names: S.applications.map((R) => R.tag.name),
        absent: [],
        applications: S.applications
      }, m = Rr(q.ids, l, a, !0);
      h.set(S.key, {
        item: { key: S.key, media: S.media, occurrence: S },
        before: q,
        expected: q,
        conflict: m.conflict,
        status: nr(q.ids, m.desired) ? "unchanged" : "pending"
      });
    }
    if (i(h.size), b * 250 >= y.totalCount) break;
    if (b > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return n.throwIfAborted(), {
    review: o,
    actions: s,
    action: l,
    categories: a,
    touched: d,
    entries: [...h.values()]
  };
}
function Hs(e, t, n) {
  const i = (s) => s.ids.filter((a) => n.includes(a));
  if (!nr(i(e), i(t))) return !1;
  const o = (s) => (s.applications ?? []).filter((a) => n.includes(a.tag.id)).map((a) => a.id);
  return nr(o(e), o(t));
}
async function Yo(e, t, n, i) {
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
async function Ys(e, t, n, i, o = !1) {
  const s = e.entries.filter(
    (a) => o ? a.status === "failed" : a.status === "pending"
  );
  await Yo(
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
      let p;
      try {
        if (p = await kt(he(e.review), a.item, !1), !Hs(a.expected, p, e.touched)) {
          a.status = "skipped", a.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (y) {
        a.status = "failed", a.error = li(y);
        return;
      }
      const l = Rr(
        a.before.ids,
        e.action,
        e.categories,
        t
      ), d = [
        ...p.ids.filter((y) => !e.touched.includes(y)),
        ...l.desired.filter((y) => e.touched.includes(y))
      ], g = Kn(p.ids, d);
      if (!g.added.length && !g.removed.length) {
        const y = !a.operation && l.kept.length > 0;
        a.status = a.operation ? "changed" : y ? "skipped" : "unchanged", a.error = y ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let h;
      try {
        await xi(e.review, a.item, g);
      } catch (y) {
        h = y;
      }
      let b = !1;
      try {
        const y = await kt(he(e.review), a.item, !1);
        b = !0, a.expected = y;
        const S = ci(
          a.item,
          a.before,
          y,
          e.touched
        );
        if (a.operation = di(S) ? S : void 0, h) throw h;
        if (!nr(
          y.ids.filter((q) => e.touched.includes(q)),
          d.filter((q) => e.touched.includes(q))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        a.status = a.operation ? "changed" : "unchanged", a.error = void 0;
      } catch (y) {
        if (a.status = "failed", a.error = li(y), !b)
          try {
            const S = await kt(he(e.review), a.item, !1);
            a.expected = S;
            const q = ci(
              a.item,
              a.before,
              S,
              e.touched
            );
            a.operation = di(q) ? q : void 0;
          } catch {
            a.unverified = !0;
          }
      }
    },
    i
  );
}
async function Xs(e, t, n) {
  await Yo(
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
        const p = await kt(he(e.review), i.item, !1);
        Js(o, p), a = !0, await xi(e.review, i.item, {
          added: o.tags.removed,
          removed: o.tags.added
        });
        const l = await kt(he(e.review), i.item, !1);
        if (!nr(
          l.ids.filter((d) => s.includes(d)),
          i.before.ids.filter((d) => s.includes(d))
        ))
          throw new Error("Undo did not restore all affected tags.");
        i.operation = void 0, i.expected = l, i.status = "unchanged", i.error = void 0;
      } catch (p) {
        if (i.error = `Undo stopped: ${li(p)}`, i.status = "failed", a)
          try {
            const l = await kt(he(e.review), i.item, !1), d = ci(
              i.item,
              i.before,
              l,
              s
            );
            i.operation = di(d) ? d : void 0, i.expected = l;
          } catch {
            i.unverified = !0;
          }
      }
    },
    n
  );
}
async function Zs(e, t, n) {
  const i = he(e), o = e.occurrence, [s, a] = await Promise.all([
    Z(
      `/api/tagapplications?hostType=${i}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    Fi(o, n)
  ]), p = s.filter(
    (S) => S.hostType === i && S.contextType === "performer" && S.contextId === t
  ), l = await Promise.all(
    a.map(async (S, q) => {
      const m = o.conditionTagIds[q];
      return (await Z(`/api/tags/${m}`, { signal: n })).name;
    })
  ), d = new Set(a.flat()), g = new Set(
    [
      ...e.actions.flatMap((S) => S.steps).filter((S) => S.mode === "ADD" || S.mode === "MARK_PRESENT").flatMap((S) => S.tagIds),
      ...o.tagIds
    ].filter((S) => !d.has(S))
  ), h = (S) => {
    const q = /* @__PURE__ */ new Map();
    for (const m of p) {
      if (!S.has(m.tag.id)) continue;
      const R = q.get(m.tag.id) ?? {
        name: m.tag.name,
        hosts: /* @__PURE__ */ new Set()
      };
      R.hosts.add(m.hostId), q.set(m.tag.id, R);
    }
    return [...q].map(([m, R]) => ({ id: m, name: R.name, count: R.hosts.size })).sort((m, R) => R.count - m.count || m.name.localeCompare(R.name));
  }, b = a.map((S, q) => ({
    id: o.conditionTagIds[q],
    name: l[q],
    tags: h(new Set(S))
  }));
  g.size && b.push({
    id: null,
    name: a.length ? "Other review tags" : "Review tags",
    tags: h(g)
  });
  const y = /* @__PURE__ */ new Set([...d, ...g]);
  return {
    answered: new Set(
      p.filter((S) => y.has(S.tag.id)).map((S) => S.hostId)
    ).size,
    groups: b
  };
}
function Xo({
  review: e,
  performerId: t,
  revision: n = 0
}) {
  const [i, o] = N(null), [s, a] = N(""), p = bt(he(e)), l = e.occurrence, d = JSON.stringify([
    e.entityType,
    t,
    l.condition,
    l.conditionTagIds,
    l.includeSubtags,
    l.tagIds,
    e.actions.map((h) => h.steps)
  ]);
  z(() => {
    const h = new AbortController();
    return o(null), a(""), Zs(e, t, h.signal).then((b) => {
      h.signal.aborted || o(b);
    }).catch((b) => {
      h.signal.aborted || a(b instanceof Error ? b.message : "Request failed.");
    }), () => h.abort();
  }, [d, n]);
  const g = (h) => `${h.toLocaleString()} ${h === 1 ? p.one : p.many}`;
  return /* @__PURE__ */ c("section", { className: "dq-panel-section dq-performer-answers", "aria-label": "Existing answers", children: [
    /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Existing answers" }),
      i && /* @__PURE__ */ r("span", { children: i.answered ? `${g(i.answered)} answered` : "none answered yet" })
    ] }),
    s ? /* @__PURE__ */ c("p", { role: "alert", children: [
      "Could not load existing answers. ",
      s
    ] }) : i ? i.groups.filter((h) => h.id !== null || h.tags.length).map((h) => /* @__PURE__ */ c("div", { className: "dq-answer-group", children: [
      /* @__PURE__ */ c("div", { className: "dq-answer-category", children: [
        /* @__PURE__ */ r("span", { children: h.name }),
        h.id !== null && h.tags.length > 1 && /* @__PURE__ */ r(
          "span",
          {
            className: "dq-badge dq-badge-warning",
            title: "This performer has different answers in this category.",
            children: "Mixed"
          }
        )
      ] }),
      h.tags.length ? /* @__PURE__ */ r("ul", { className: "dq-chips", "aria-label": h.name, children: h.tags.map((b) => /* @__PURE__ */ c("li", { className: "dq-chip", children: [
        b.name,
        /* @__PURE__ */ r("span", { className: "dq-chip-count", "aria-hidden": "true", children: b.count.toLocaleString() }),
        /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
          ", ",
          g(b.count)
        ] })
      ] }, b.id)) }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" })
    ] }, h.id ?? "other")) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading existing answers…" })
  ] });
}
async function to(e, t, n) {
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
function ec(e, t) {
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
function tc({
  review: e,
  disabled: t,
  hidden: n = !1,
  performerFlags: i = [],
  onOpen: o,
  onClose: s,
  onWrite: a
}) {
  const [p, l] = N(!1), [d, g] = N(null), [h, b] = N([]), [y, S] = N(!1), [q, m] = N(!1), [R, E] = N(""), [L, B] = N(""), [ne, M] = N({}), [$, x] = N(!1), [j, O] = N(!1), _ = $ && d ? d.review : e, oe = he(_), F = bt(oe), J = F.queue, C = oe === "audio" ? "Audio" : "Scene", [X, re] = N([]), [Ce, ie] = N(!1), [, Ne] = N(0), [Dt, _t] = N(0), jt = P(null), Ut = P(null), be = P(!1), _e = P(null), Ee = P(!1), Ze = P(0), ye = P(!1), et = P({ onClose: s, onWrite: a });
  et.current = { onClose: s, onWrite: a }, z(() => {
    var k;
    p && ((k = jt.current) == null || k.showModal());
  }, [p]), z(() => {
    if (!p || _.occurrence.targetMode !== "selected") return;
    const k = new AbortController();
    return re([]), to(
      _.occurrence.performerIds,
      "performers",
      k.signal
    ).then((Q) => {
      k.signal.aborted || re(Q.map(([, ke]) => ke));
    }).catch(() => {
    }), () => k.abort();
  }, [
    p,
    _.occurrence.targetMode,
    JSON.stringify(_.occurrence.performerIds)
  ]), z(
    () => () => {
      var k;
      be.current = !0, (k = _e.current) == null || k.abort();
    },
    []
  ), z(() => {
    if (!q) return;
    const k = (Q) => {
      Q.preventDefault(), Q.returnValue = "";
    };
    return window.addEventListener("beforeunload", k), () => window.removeEventListener("beforeunload", k);
  }, [q]);
  function Qe() {
    g(null), x(!1), O(!1), S(!1), b([]), B(""), E(""), ie(!1);
  }
  function Ae() {
    ye.current || (l(!1), et.current.onClose(Ee.current), Ee.current = !1, Qe(), requestAnimationFrame(() => {
      var k;
      return (k = Ut.current) == null ? void 0 : k.focus();
    }));
  }
  const ce = $ && d ? d.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((k) => k.steps.length && !dn(k))
  );
  async function ae() {
    const k = ce.filter((Q) => h.includes(Q.id));
    if (!(!k.length || ye.current)) {
      ye.current = !0, m(!0), E(""), B("Loading all matching occurrences…"), g(null), x(!1), O(!1), ie(!1), _e.current = new AbortController();
      try {
        await ec(Ze.current, _e.current.signal);
        const Q = await Qs(
          e,
          k,
          _e.current.signal,
          (Pe) => B(`Loaded ${Pe.toLocaleString()} matching occurrences…`)
        ), ke = /* @__PURE__ */ new Map();
        for (const Pe of Q.entries)
          for (const ue of Pe.before.applications ?? [])
            ke.set(ue.tag.id, ue.tag.name);
        const tt = await to(
          [
            .../* @__PURE__ */ new Set([
              ...Q.actions.flatMap(
                (Pe) => Pe.steps.flatMap((ue) => ue.tagIds)
              ),
              ...Q.review.occurrence.conditionTagIds,
              ...Oi(Q.review.view.objectFilter)
            ])
          ].filter((Pe) => !ke.has(Pe)),
          "tags",
          _e.current.signal
        );
        _e.current.signal.throwIfAborted(), M({ ...Object.fromEntries(ke), ...Object.fromEntries(tt) }), g(Q), B("Preview ready. No tags have been changed.");
      } catch (Q) {
        E(
          _e.current.signal.aborted ? "Preview cancelled. No tags were changed." : String(Q instanceof Error ? Q.message : Q)
        ), B("");
      } finally {
        ye.current = !1, m(!1), _e.current = null;
      }
    }
  }
  async function T(k) {
    if (!d || ye.current) return;
    ye.current = !0, be.current = !1, Ee.current = !0, et.current.onWrite(), m(!0), x(!0), E(""), k === "undo" && O(!0), B(k === "undo" ? "Undoing batch…" : "Applying batch…");
    const Q = () => Ne((ke) => ke + 1);
    try {
      k === "undo" ? await Xs(d, () => be.current, Q) : await Ys(
        d,
        y,
        () => be.current,
        Q,
        k === "retry"
      ), B(
        be.current ? "Stopped after in-flight operations settled. Completed changes are retained." : k === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (ke) {
      E(ke instanceof Error ? ke.message : String(ke));
    } finally {
      Ze.current = Date.now(), ye.current = !1, m(!1), _t((ke) => ke + 1), Q();
    }
  }
  const G = (d == null ? void 0 : d.entries) ?? [], je = We(
    () => new Map(
      ((d == null ? void 0 : d.entries) ?? []).map((k) => [
        k.item.key,
        Rr(k.before.ids, d.action, d.categories, y)
      ])
    ),
    [d, y]
  ), ve = (k) => je.get(k.item.key), W = (k) => Kn(k.before.ids, ve(k).desired), Tt = (k) => {
    const Q = W(k);
    return k.status === "pending" && (Q.added.length > 0 || Q.removed.length > 0);
  }, fn = (k) => {
    const Q = ve(k), ke = Q.skipped ? Kn(
      k.before.ids,
      Rr(k.before.ids, d.action, d.categories, !0).desired
    ) : W(k);
    return [
      Q.skipped ? "Skipped unless conflicting answers are replaced. " : "",
      `Add: ${Ue(ke.added)}; Remove: ${Ue(ke.removed)}`,
      ...Q.kept.map(
        (tt) => `; Keeps ${Ue(tt.existing)} instead of ${Ue(tt.tagIds)}`
      )
    ].join("");
  }, yt = G.filter((k) => k.conflict), ut = G.filter(
    (k) => ve(k).kept.length || ve(k).replaced.length
  ), Ge = (k) => G.filter((Q) => Q.status === k).length, $e = G.some((k) => k.operation), Ue = (k) => k.map((Q) => ne[Q] ?? `Tag ${Q}`).join(", ") || "None", He = G.filter((k) => k.item.media.date).sort((k, Q) => k.item.media.date.localeCompare(Q.item.media.date)), Kt = (k, Q) => /* @__PURE__ */ r(
    "a",
    {
      href: `/${oe}/${k.item.media.id}`,
      target: "_blank",
      rel: "noreferrer",
      "aria-label": `${Q} ${F.one}, ${k.item.media.date}`,
      title: k.item.media.title || C,
      children: k.item.media.date
    }
  ), wt = _.occurrence.targetMode === "selected" && _.occurrence.performerIds.length === 1, Rt = Un(_.occurrence.condition) && _.occurrence.includeSubtags !== !1 && _.occurrence.conditionTagIds.length > 0;
  return /* @__PURE__ */ c(se, { children: [
    /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        hidden: n,
        ref: Ut,
        title: "Apply answers to all matching occurrences",
        disabled: t || !ce.length,
        onClick: () => {
          Qe(), o(), l(!0);
        },
        children: [
          /* @__PURE__ */ r(Ta, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    p && /* @__PURE__ */ c(
      "dialog",
      {
        ref: jt,
        className: "dq-batch-dialog",
        "aria-labelledby": "dq-batch-title",
        "aria-modal": "true",
        onCancel: (k) => {
          k.preventDefault(), Ae();
        },
        children: [
          /* @__PURE__ */ r("h2", { id: "dq-batch-title", children: "Batch occurrence approval" }),
          /* @__PURE__ */ r("p", { children: "Apply one or more answers across all matching pages. Only targeted performer occurrences change." }),
          /* @__PURE__ */ r("p", { children: "Keep this page open while running. Results and undo last until you close this dialog or start a new batch." }),
          /* @__PURE__ */ c("fieldset", { disabled: q || $, children: [
            /* @__PURE__ */ r("legend", { children: "Batch scope and answers" }),
            /* @__PURE__ */ r("p", { children: "Uses your current filters. To include every existing appearance, remove filters that exclude already answered occurrences." }),
            /* @__PURE__ */ c("p", { children: [
              "Performer scope:",
              " ",
              Si(_.occurrence) ? "All performers" : _.occurrence.targetMode === "selected" ? X.join(", ") || `${_.occurrence.performerIds.length} selected performer(s)` : "Matching performer criteria",
              ". Occurrence condition:",
              " ",
              $r[_.occurrence.condition],
              "."
            ] }),
            i.length > 0 && /* @__PURE__ */ c("p", { className: "dq-batch-flag", children: [
              /* @__PURE__ */ c("strong", { children: [
                "Flagged: ",
                i.join(", "),
                "."
              ] }),
              " Check the earliest and latest ",
              F.many,
              " before applying, or narrow the batch with a date filter."
            ] }),
            Un(_.occurrence.condition) && _.occurrence.hideConfirmedAbsent !== !1 && /* @__PURE__ */ r("p", { children: _.occurrence.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged." }),
            _.occurrence.conditionTagIds.length > 0 && d && /* @__PURE__ */ c("p", { children: [
              "Condition tags:",
              " ",
              Ue(_.occurrence.conditionTagIds),
              _.occurrence.includeSubtags === !1 ? " (exact tags only)" : " (including subtags)",
              "."
            ] }),
            /* @__PURE__ */ c("p", { children: [
              "Search: ",
              String(_.view.filter.q || "Any"),
              ".",
              " ",
              Object.keys(_.view.objectFilter).length === 0 && `${J[0].toUpperCase()}${J.slice(1)} filters: None.`
            ] }),
            /* @__PURE__ */ r(
              "fieldset",
              {
                className: "dq-batch-filter-summary",
                disabled: !0,
                "aria-label": `Batch ${J} filters`,
                children: /* @__PURE__ */ r(
                  er,
                  {
                    filter: _.view.filter,
                    objectFilter: Mi(
                      _.view.objectFilter,
                      ne
                    ),
                    criteriaDefinitions: oe === "audio" ? mi : Ir,
                    customFieldEntityType: oe,
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
            _.occurrence.targetMode === "filter" && /* @__PURE__ */ r(
              "fieldset",
              {
                className: "dq-batch-filter-summary",
                disabled: !0,
                "aria-label": "Batch performer criteria",
                children: /* @__PURE__ */ r(
                  er,
                  {
                    filter: {},
                    objectFilter: _.occurrence.performerFilter,
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
            wt && /* @__PURE__ */ r(
              Xo,
              {
                review: _,
                performerId: _.occurrence.performerIds[0],
                revision: Dt
              }
            ),
            !ce.length && /* @__PURE__ */ r("p", { children: "Configure an occurrence tag action in this review before starting a batch." }),
            /* @__PURE__ */ c("fieldset", { className: "dq-batch-answers", children: [
              /* @__PURE__ */ r("legend", { children: "Answers" }),
              ce.map((k) => /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "checkbox",
                    checked: $ || h.includes(k.id),
                    onChange: (Q) => {
                      b(
                        Q.target.checked ? [...h, k.id] : h.filter((ke) => ke !== k.id)
                      ), g(null), B(""), E("");
                    }
                  }
                ),
                k.label
              ] }, k.id))
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: !h.length,
                onClick: () => void ae(),
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
                  onChange: (k) => S(k.target.value === "replace"),
                  children: [
                    /* @__PURE__ */ r("option", { value: "skip", children: "Skip conflicts" }),
                    /* @__PURE__ */ r("option", { value: "replace", children: "Replace conflicting answers" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ c("p", { children: [
              "Conflicts are existing tags an answer removes. Configure opposite answers as removals.",
              Rt && " Each condition tag with its subtags is a category: an answer is added only where its category is still empty, and a different existing answer is kept unless conflicting answers are replaced."
            ] })
          ] }),
          /* @__PURE__ */ c("div", { "aria-live": "polite", children: [
            L && /* @__PURE__ */ r("p", { role: "status", children: L }),
            R && /* @__PURE__ */ r("p", { role: "alert", children: R }),
            d && /* @__PURE__ */ c(se, { children: [
              /* @__PURE__ */ r("p", { children: /* @__PURE__ */ c("strong", { children: [
                G.length.toLocaleString(),
                " occurrences in",
                " ",
                new Set(
                  G.map((k) => k.item.media.id)
                ).size.toLocaleString(),
                " ",
                J,
                "s"
              ] }) }),
              $ ? /* @__PURE__ */ c("p", { children: [
                Ge("changed"),
                " changed; ",
                Ge("unchanged"),
                " unchanged;",
                " ",
                Ge("skipped"),
                " skipped; ",
                Ge("failed"),
                " failed;",
                " ",
                Ge("pending"),
                " remaining."
              ] }) : /* @__PURE__ */ c("p", { children: [
                G.filter(Tt).length.toLocaleString(),
                " to change; ",
                Ge("unchanged").toLocaleString(),
                " already correct; ",
                yt.length.toLocaleString(),
                " conflicts (",
                y ? "will replace" : "will skip",
                ").",
                ut.length > 0 && ` ${ut.length.toLocaleString()} already have a different answer in a category (${y ? "will replace" : "kept"}).`
              ] }),
              G.length > 0 && /* @__PURE__ */ c("p", { children: [
                "Dates:",
                " ",
                He.length ? /* @__PURE__ */ c(se, { children: [
                  Kt(He[0], "Earliest"),
                  He.length > 1 && /* @__PURE__ */ c(se, { children: [
                    " to ",
                    Kt(He[He.length - 1], "Latest")
                  ] })
                ] }) : "none",
                He.length < G.length && `; ${(G.length - He.length).toLocaleString()} without a date`,
                "."
              ] })
            ] })
          ] }),
          d && /* @__PURE__ */ c(se, { children: [
            !$ && /* @__PURE__ */ c("p", { children: [
              "Planned additions:",
              " ",
              Ue([
                ...new Set(G.flatMap((k) => W(k).added))
              ]),
              ". Planned removals:",
              " ",
              Ue([
                ...new Set(G.flatMap((k) => W(k).removed))
              ]),
              "."
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => ie(!Ce),
                children: Ce ? "Hide occurrence details" : "Inspect occurrences and conflicts"
              }
            ),
            Ce && /* @__PURE__ */ r("div", { className: "dq-batch-items", children: /* @__PURE__ */ c("table", { children: [
              /* @__PURE__ */ r("thead", { children: /* @__PURE__ */ c("tr", { children: [
                /* @__PURE__ */ r("th", { children: "Occurrence" }),
                /* @__PURE__ */ r("th", { children: "Changes / result" })
              ] }) }),
              /* @__PURE__ */ r("tbody", { children: G.map((k) => {
                var Q;
                return /* @__PURE__ */ c("tr", { children: [
                  /* @__PURE__ */ r("td", { children: /* @__PURE__ */ c(
                    "a",
                    {
                      href: `/${oe}/${k.item.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      children: [
                        (Q = k.item.occurrence) == null ? void 0 : Q.performer.name,
                        " —",
                        " ",
                        k.item.media.title || C
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ c("td", { children: [
                    k.conflict && /* @__PURE__ */ r("strong", { children: "Conflict. " }),
                    $ ? `${k.status}. ${k.error ?? ""}` : fn(k)
                  ] })
                ] }, k.item.key);
              }) })
            ] }) }),
            /* @__PURE__ */ c("div", { className: "dq-row", children: [
              !j && /* @__PURE__ */ c(se, { children: [
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    className: "dq-button primary",
                    disabled: q || !Ge("pending"),
                    onClick: () => void T("apply"),
                    children: $ ? "Continue remaining" : "Apply batch"
                  }
                ),
                $ && Ge("failed") > 0 && /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: q,
                    onClick: () => void T("retry"),
                    children: "Retry failed occurrences"
                  }
                )
              ] }),
              $e && /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  disabled: q,
                  onClick: () => void T("undo"),
                  children: "Undo batch"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ c("div", { className: "dq-row", children: [
            q && /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => {
                  var k;
                  be.current = !0, (k = _e.current) == null || k.abort(), B("Stopping after in-flight operations settle…");
                },
                children: [
                  "Cancel ",
                  _e.current ? "preview" : "run"
                ]
              }
            ),
            $ && /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: q,
                onClick: Qe,
                children: "New batch"
              }
            ),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: q,
                onClick: Ae,
                children: "Close"
              }
            )
          ] })
        ]
      }
    )
  ] });
}
function nc(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const i of n.steps)
        i.mode === "REMOVE_TREE" && i.tagIds.forEach((o) => t.add(o));
  return [...t];
}
function Zo(e, t, n) {
  const i = Fr(e), o = [], s = [];
  for (const b of e.steps) {
    if (b.mode !== "REMOVE_TREE") {
      s.push(b);
      continue;
    }
    const y = b.tagIds.flatMap((S) => {
      const q = n.get(S);
      return q || o.push(S), q ?? [S];
    });
    s.push({ mode: "REMOVE", tagIds: y.filter((S) => !i.has(S)) });
  }
  const a = [
    ...s.filter((b) => !Qt(b.mode)),
    ...s.filter((b) => Qt(b.mode))
  ], p = new Set(t.ids), l = new Set(t.absent);
  for (const b of a)
    for (const y of b.tagIds)
      switch (b.mode) {
        case "ADD":
          p.add(y);
          break;
        case "REMOVE":
        case "REMOVE_TREE":
          p.delete(y);
          break;
        case "MARK_PRESENT":
          p.add(y), l.delete(y);
          break;
        case "MARK_ABSENT":
          p.delete(y), l.add(y);
          break;
        case "CLEAR_ABSENCE":
          l.delete(y);
          break;
      }
  const d = new Set(t.ids), g = new Set(t.absent), h = [...new Set(e.steps.flatMap((b) => b.tagIds))];
  return {
    added: h.filter((b) => p.has(b) && !d.has(b)),
    removed: [...d].filter((b) => !p.has(b)),
    markedAbsent: h.filter((b) => l.has(b) && !g.has(b)),
    absenceCleared: [...g].filter((b) => !l.has(b)),
    unresolvedTrees: [...new Set(o)]
  };
}
function rc(e) {
  if (e.applications) {
    const t = /* @__PURE__ */ new Map();
    for (const n of e.applications)
      t.has(n.tag.id) || t.set(n.tag.id, n.tag.name);
    return [...t].map(([n, i]) => ({ id: n, name: i }));
  }
  return e.ids.map((t, n) => ({ id: t, name: e.names[n] ?? "" }));
}
function ic(e) {
  const t = nc(e).sort((a, p) => a - p).join(","), [n, i] = N(() => /* @__PURE__ */ new Map()), o = P(/* @__PURE__ */ new Set()), s = P(!0);
  return z(() => (s.current = !0, () => {
    s.current = !1;
  }), []), z(() => {
    const a = t ? t.split(",").map(Number) : [];
    for (const p of a)
      o.current.has(p) || (o.current.add(p), Lr([p]).then(
        (l) => {
          s.current && i((d) => new Map(d).set(p, l));
        },
        () => {
          o.current.delete(p);
        }
      ));
  }, [t]), n;
}
function oc() {
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
function ea(e) {
  return ya(e.subscribe, e.get, e.get);
}
const no = [
  { indent: 0, slots: Jr(0, 11), fixed: [] },
  { indent: 1, slots: Jr(11, 22), fixed: [] },
  { indent: 2, slots: Jr(22, 27), fixed: ["n", "m", ",", "."] }
];
function Jr(e, t) {
  return Array.from({ length: t - e }, (n, i) => e + i);
}
function ro(e, t) {
  return e === "g" ? "Go to…" : e === "f" ? t === "video" ? "Fullscreen · filters" : "Filters" : t === "video" && e === "k" ? "Play / pause" : t === "video" && e === "m" ? "Mute" : "";
}
function An({ binding: e }) {
  return /* @__PURE__ */ r("kbd", { className: Array.from(e).length === 1 ? "dq-key dq-key-letter" : "dq-key", children: e });
}
function io(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function ac({
  actions: e,
  mediaKind: t,
  isDisabled: n,
  busy: i,
  tags: o,
  trees: s,
  preview: a,
  onApply: p,
  onFind: l,
  findDisabled: d
}) {
  const g = Bn(), h = ir(), b = sr(
    We(() => e.flatMap((E) => E.steps.flatMap((L) => L.tagIds)), [e])
  ), y = no.filter((E) => E.slots.some((L) => L < e.length)), S = y.length === no.length, q = Math.max(0, e.length - tr.length), m = (E) => ({
    onMouseEnter: () => a.set(E),
    onMouseLeave: () => a.clear(E),
    onFocus: () => a.set(E),
    onBlur: (L) => {
      L.currentTarget.contains(L.relatedTarget) || a.clear(E);
    }
  }), R = (E) => {
    const L = e[E], B = g.action(E);
    if (!L) {
      const $ = ro(B, t);
      return /* @__PURE__ */ c(
        "div",
        {
          className: `dq-pad-slot dq-pad-free${$ ? " dq-pad-reserved" : ""}`,
          "aria-hidden": "true",
          children: [
            /* @__PURE__ */ r(An, { binding: B }),
            $ && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: $ })
          ]
        },
        E
      );
    }
    const ne = n(L), M = `${h}-effect-${E}`;
    return /* @__PURE__ */ c("div", { className: "dq-pad-slot", ...m(L), children: [
      /* @__PURE__ */ r("span", { id: M, className: "dq-sr-only", children: ki(L, b, [], s).map(($) => $.text).join(", ") }),
      /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: L.label,
          "aria-keyshortcuts": B,
          "aria-describedby": M,
          disabled: ne,
          onClick: ($) => p(L, $.shiftKey),
          children: [
            /* @__PURE__ */ r(An, { binding: B }),
            " ",
            /* @__PURE__ */ r("span", { className: "dq-pad-label", children: L.label }),
            io(L) && " ",
            io(L) && /* @__PURE__ */ c("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(Xr, { "aria-hidden": "true" }),
              "absent"
            ] })
          ]
        }
      ),
      L.steps.length > 0 && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-pad-pin",
          "aria-label": `Apply and stay: ${L.label}`,
          title: "Apply and stay (Shift)",
          disabled: ne,
          onClick: () => p(L, !0),
          children: /* @__PURE__ */ r(Ra, { "aria-hidden": "true" })
        }
      )
    ] }, E);
  };
  return /* @__PURE__ */ c("section", { className: "dq-pad", "aria-label": "Actions", "aria-busy": i || void 0, children: [
    /* @__PURE__ */ c("div", { className: "dq-pad-header", children: [
      /* @__PURE__ */ r(
        sc,
        {
          actions: e,
          names: b,
          tags: o,
          trees: s,
          preview: a,
          extra: q,
          findKey: g.find
        }
      ),
      /* @__PURE__ */ c("span", { className: "dq-pad-hint", children: [
        /* @__PURE__ */ r("kbd", { className: "dq-key", children: "Shift" }),
        /* @__PURE__ */ r("span", { children: "+ key applies and stays" })
      ] }),
      !S && /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-pad-find-button",
          "aria-label": "Find action",
          "aria-keyshortcuts": g.find,
          disabled: d,
          onClick: l,
          children: [
            /* @__PURE__ */ r(An, { binding: g.find }),
            /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "Find action" })
          ]
        }
      )
    ] }),
    y.map((E) => /* @__PURE__ */ c("div", { className: "dq-pad-row", "data-indent": E.indent, children: [
      E.slots.map(R),
      E.fixed.map((L) => {
        const B = ro(L, t);
        return /* @__PURE__ */ c(
          "div",
          {
            className: `dq-pad-slot dq-pad-free dq-pad-fixed${B ? " dq-pad-reserved" : ""}`,
            "aria-hidden": "true",
            children: [
              /* @__PURE__ */ r(An, { binding: L }),
              B && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: B })
            ]
          },
          L
        );
      }),
      E.fixed.length > 0 && /* @__PURE__ */ r("div", { className: "dq-pad-slot", children: /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-pad-tile dq-pad-find",
          "aria-label": q ? `Find action, ${q} more` : "Find action",
          "aria-keyshortcuts": g.find,
          disabled: d,
          onClick: l,
          children: [
            /* @__PURE__ */ r(An, { binding: g.find }),
            /* @__PURE__ */ c("span", { className: "dq-pad-label", children: [
              /* @__PURE__ */ r(yi, { "aria-hidden": "true" }),
              q ? `${q} more` : "Find action"
            ] })
          ]
        }
      ) })
    ] }, E.indent))
  ] });
}
function sc({
  actions: e,
  names: t,
  tags: n,
  trees: i,
  preview: o,
  extra: s,
  findKey: a
}) {
  const p = Bn(), l = ea(o), d = l ? e.indexOf(l) : -1;
  if (!l || d < 0)
    return /* @__PURE__ */ c("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      s > 0 && /* @__PURE__ */ c(se, { children: [
        ` · ${tr.length} on keys, ${s} more under `,
        /* @__PURE__ */ r(An, { binding: a })
      ] })
    ] });
  const g = p.action(d), h = n && l.steps.length ? Zo(l, n, i) : null, b = h && !h.unresolvedTrees.length && ![h.added, h.removed, h.markedAbsent, h.absenceCleared].some(
    (y) => y.length
  );
  return /* @__PURE__ */ c("p", { className: "dq-pad-effect", children: [
    g && /* @__PURE__ */ r(An, { binding: g }),
    /* @__PURE__ */ r("strong", { children: l.label }),
    ki(l, t, [], i).map((y, S) => /* @__PURE__ */ r("span", { "data-effect-tone": y.tone, children: y.text }, S)),
    b && /* @__PURE__ */ r("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
const ta = "data-quality.description-collapsed.v1";
function cc() {
  try {
    return localStorage.getItem(ta) === "true";
  } catch {
    return !1;
  }
}
function lc({
  details: e,
  label: t
}) {
  const [n, i] = N(cc), o = cn(() => {
    i((s) => {
      const a = !s;
      try {
        localStorage.setItem(ta, String(a));
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
    !n && (e != null && e.trim() ? /* @__PURE__ */ r(va, { className: "dq-description-body", children: e }) : /* @__PURE__ */ r("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
function Hn({
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
function dc({
  ranking: e,
  busy: t,
  error: n,
  focus: i,
  disabled: o,
  labels: s,
  onFocus: a,
  onMore: p,
  onRefresh: l
}) {
  var h;
  const d = e ? e.ranked.slice(0, e.limit) : [], g = !!e && (e.ranked.length > e.limit || (((h = e.candidates[e.cursor]) == null ? void 0 : h.total) ?? 0) > 0);
  return /* @__PURE__ */ c("div", { className: "dq-performer-ranking", children: [
    /* @__PURE__ */ c("div", { className: "dq-performer-ranking-status", children: [
      n ? /* @__PURE__ */ c("p", { role: "alert", children: [
        "Could not rank performers. ",
        n
      ] }) : t ? /* @__PURE__ */ c("p", { role: "status", children: [
        "Counting matching ",
        s.many,
        " per performer…"
      ] }) : e ? /* @__PURE__ */ r("p", { children: d.length ? `Most matching ${s.queue}s first` : `No performer has matching ${s.many}.` }) : null,
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "Refresh counts",
          title: "Refresh counts",
          disabled: t || o,
          onClick: l,
          children: /* @__PURE__ */ r(Ia, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-queue-list", children: d.map((b) => {
      const y = `${b.count.toLocaleString()} matching ${b.count === 1 ? s.one : s.many}`, S = b.flags.length ? `Flagged: ${b.flags.join(", ")}` : "";
      return /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${b.name}, ${y}${S ? `. ${S}` : ""}`,
          title: S || void 0,
          "aria-current": i === b.id ? "true" : void 0,
          disabled: o,
          onClick: () => a(b.id),
          children: [
            /* @__PURE__ */ r(Hn, { performer: b }),
            /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: b.name }),
            S && /* @__PURE__ */ r(Zr, { className: "dq-flag-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ r("span", { className: "dq-ranked-count", "aria-hidden": "true", children: b.count.toLocaleString() })
          ]
        },
        b.id
      );
    }) }),
    g && !t && !n && /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button dq-ranking-more",
        disabled: o,
        onClick: p,
        children: "Show more performers"
      }
    )
  ] });
}
const na = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
};
function Li({ entityType: e }) {
  const t = na[e];
  return e === "tag" ? /* @__PURE__ */ r(Oa, { role: "img", "aria-label": t }) : Yn(e) === "audio" ? /* @__PURE__ */ r(So, { role: "img", "aria-label": t }) : /* @__PURE__ */ r(Er, { role: "img", "aria-label": t });
}
function uc({
  name: e,
  description: t,
  entityType: n,
  onBack: i,
  backDisabled: o,
  onEdit: s,
  editDisabled: a,
  toolbar: p,
  trailing: l,
  chipsStart: d,
  chipsEnd: g
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
          children: /* @__PURE__ */ r(Or, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-type", title: na[n], children: /* @__PURE__ */ r(Li, { entityType: n }) }),
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
          children: /* @__PURE__ */ r(Mr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    p,
    /* @__PURE__ */ r("div", { className: "dq-review-header-trail", children: l }),
    /* @__PURE__ */ r("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    d,
    g && /* @__PURE__ */ r("div", { className: "dq-review-chips-end", children: g })
  ] });
}
function fc({
  page: e,
  pages: t,
  onPage: n
}) {
  const [i, o] = N(!1), [s, a] = N(""), p = P(null), l = P(null);
  z(() => {
    var h;
    i && ((h = p.current) == null || h.select());
  }, [i]);
  const d = (h) => {
    o(!1), h && requestAnimationFrame(() => {
      var b;
      return (b = l.current) == null ? void 0 : b.focus();
    });
  }, g = () => {
    const h = Math.round(Number(s));
    d(!0), Number.isFinite(h) && h >= 1 && h !== e && n(Math.min(t, h));
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
        children: /* @__PURE__ */ r(Or, { "aria-hidden": "true" })
      }
    ),
    i ? /* @__PURE__ */ r(
      "input",
      {
        ref: p,
        type: "number",
        className: "dq-pager-input",
        "aria-label": `Go to page, 1 to ${t}`,
        min: 1,
        max: t,
        value: s,
        onChange: (h) => a(h.target.value),
        onKeyDown: (h) => {
          h.key === "Enter" ? (h.preventDefault(), g()) : h.key === "Escape" && (h.preventDefault(), h.stopPropagation(), d(!0));
        },
        onBlur: () => d(!1)
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
        children: /* @__PURE__ */ r(wi, { "aria-hidden": "true" })
      }
    )
  ] });
}
function pc({
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
          /* @__PURE__ */ r(Ma, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ r($a, { "aria-hidden": "true" }),
          "Grid"
        ]
      }
    )
  ] });
}
function hc({
  items: e,
  disabled: t
}) {
  const [n, i] = N(!1), o = P(null), s = P(null), a = ir();
  z(() => {
    var d, g;
    n && ((g = (d = s.current) == null ? void 0 : d.querySelector('[role="menuitem"]:not(:disabled)')) == null || g.focus());
  }, [n]), z(() => {
    t && i(!1);
  }, [t]);
  const p = (d = !0) => {
    var g;
    i(!1), d && ((g = o.current) == null || g.focus());
  };
  return /* @__PURE__ */ c("div", { className: "dq-menu", onKeyDown: (d) => {
    var b, y;
    if (!n) return;
    const g = [
      ...((b = s.current) == null ? void 0 : b.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], h = g.indexOf(document.activeElement);
    if (d.key === "Escape")
      d.preventDefault(), d.stopPropagation(), p();
    else if (d.key === "Tab")
      p(!1);
    else if (d.key === "ArrowDown" || d.key === "ArrowUp") {
      if (d.preventDefault(), !g.length) return;
      const S = d.key === "ArrowDown" ? 1 : -1;
      g[(h + S + g.length) % g.length].focus();
    } else (d.key === "Home" || d.key === "End") && (d.preventDefault(), (y = g.at(d.key === "Home" ? 0 : -1)) == null || y.focus());
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
        onClick: () => i((d) => !d),
        children: /* @__PURE__ */ r(Pa, { "aria-hidden": "true" })
      }
    ),
    n && /* @__PURE__ */ c(se, { children: [
      /* @__PURE__ */ r("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => p(!1) }),
      /* @__PURE__ */ r(
        "div",
        {
          ref: s,
          id: a,
          role: "menu",
          "aria-label": "More review options",
          className: "dq-menu-list",
          children: e.map((d) => /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              role: "menuitem",
              disabled: d.disabled,
              onClick: () => {
                p(), d.onSelect();
              },
              children: d.label
            },
            d.label
          ))
        }
      )
    ] })
  ] });
}
const mc = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], gc = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function bc(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), i = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), o = t.bottom + 8;
  return { top: o, left: i, width: n, maxHeight: Math.max(160, window.innerHeight - o - 16) };
}
function vr(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function yc(e, t) {
  const n = Si(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", i = e.conditionTagIds.map(
    (s) => t[s] === void 0 ? "…" : t[s] ?? "Unavailable tag"
  ), o = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${vr(i, "or")}`,
    includesAll: `has ${vr(i, "and")}`,
    excludes: `has none of ${vr(i, "or")}`,
    excludesAll: `missing ${vr(i, "or")}`
  };
  return `${n} · ${o[e.condition]}`;
}
function wc({
  scope: e,
  disabled: t,
  onChange: n,
  onEditCriteria: i
}) {
  const [o, s] = N(!1), [a, p] = N(null), l = P(null), d = P(null), g = ir(), h = sr(e.conditionTagIds), b = yc(e, h);
  jn(() => {
    if (!o || !l.current) return;
    const m = () => l.current && p(bc(l.current));
    return m(), window.addEventListener("resize", m), () => window.removeEventListener("resize", m);
  }, [o]), z(() => {
    var R, E;
    if (!o) return;
    const m = (R = d.current) == null ? void 0 : R.querySelector('[aria-pressed="true"]');
    m && !m.disabled ? m.focus() : (E = d.current) == null || E.focus();
  }, [o]);
  const y = () => {
    s(!1), requestAnimationFrame(() => {
      var m;
      return (m = l.current) == null ? void 0 : m.focus();
    });
  }, S = (m) => {
    if (!(m.target instanceof Element && m.target.closest('[role="dialog"]') !== d.current || m.defaultPrevented)) {
      if (m.key === "Escape")
        m.preventDefault(), y();
      else if (m.key === "Tab" && d.current) {
        const E = [...d.current.querySelectorAll(gc)].filter((M) => M.closest('[role="dialog"]') === d.current).sort(
          (M, $) => M.compareDocumentPosition($) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!E.length) return;
        const L = E[0], B = E[E.length - 1], ne = document.activeElement;
        m.shiftKey && (ne === L || ne === d.current) ? (m.preventDefault(), B.focus()) : !m.shiftKey && ne === B && (m.preventDefault(), L.focus());
      }
    }
  }, q = !["any", "isNull"].includes(e.condition);
  return /* @__PURE__ */ c("div", { className: "dq-scope", children: [
    /* @__PURE__ */ c(
      "button",
      {
        ref: l,
        type: "button",
        className: "dq-header-button dq-scope-button",
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        "aria-controls": o ? g : void 0,
        title: b,
        onClick: () => o ? y() : s(!0),
        children: [
          /* @__PURE__ */ r(Fa, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-summary", children: b }),
          /* @__PURE__ */ r(xa, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ c(se, { children: [
      /* @__PURE__ */ r("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: y }),
      /* @__PURE__ */ c(
        "div",
        {
          ref: d,
          id: g,
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
          onKeyDown: S,
          children: [
            /* @__PURE__ */ c("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Performers to review" }),
              /* @__PURE__ */ r("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: mc.map(({ mode: m, label: R }) => /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === m,
                  onClick: () => e.targetMode !== m && n({ targetMode: m }),
                  children: R
                },
                m
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ r(
                Lt,
                {
                  entityType: "performer",
                  values: e.performerIds,
                  onChange: (m) => n({ performerIds: m }),
                  placeholder: "All performers...",
                  allowCreate: !1
                }
              ),
              e.targetMode === "filter" && /* @__PURE__ */ c("div", { className: "dq-scope-criteria", children: [
                /* @__PURE__ */ r("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ r(
                  er,
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
                    onObjectFilterChange: (m) => n({ performerFilter: m })
                  }
                ) }),
                /* @__PURE__ */ c("button", { type: "button", className: "dq-button", onClick: i, children: [
                  /* @__PURE__ */ r(Mr, { "aria-hidden": "true" }),
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
                  onChange: (m) => n({ condition: m.target.value }),
                  children: Pr.map((m) => /* @__PURE__ */ r("option", { value: m, children: $r[m] }, m))
                }
              ),
              q && /* @__PURE__ */ c(se, { children: [
                /* @__PURE__ */ r(
                  Lt,
                  {
                    entityType: "tag",
                    values: e.conditionTagIds,
                    onChange: (m) => n({ conditionTagIds: m }),
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
                        onChange: (m) => n({ includeSubtags: m.target.checked })
                      }
                    ),
                    "Include subtags"
                  ] }),
                  Un(e.condition) && /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ r(
                      "input",
                      {
                        type: "checkbox",
                        checked: e.hideConfirmedAbsent ?? !0,
                        onChange: (m) => n({ hideConfirmedAbsent: m.target.checked })
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
function Nr(e) {
  const {
    page: t,
    perPage: n,
    sort: i,
    direction: o,
    sorts: s,
    seed: a,
    ...p
  } = e.view.filter;
  return JSON.stringify([
    e.entityType,
    p,
    e.view.objectFilter,
    e.view.searchMode,
    e.occurrence
  ]);
}
function vc(e) {
  const t = e.occurrence;
  return JSON.stringify([
    he(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {},
    t.flagPerformerTagIds ?? []
  ]);
}
async function Sc(e, t) {
  const n = he(e) === "audio", i = new Set(e.occurrence.flagPerformerTagIds ?? []), o = (p) => ({
    id: p.id,
    name: p.name,
    total: (n ? p.audioCount : p.videoCount) ?? 0,
    flags: (p.tags ?? []).filter((l) => i.has(l.id)).map((l) => l.name)
  }), s = e.occurrence, a = [];
  if (s.targetMode === "selected" && s.performerIds.length > 0)
    for (const p of s.performerIds) {
      const l = await cs(
        `/api/performers/${p}`,
        { signal: t }
      );
      l && a.push(o(l));
    }
  else {
    const { _filterExpression: p, ...l } = s.targetMode === "filter" ? s.performerFilter : {};
    for (let d = 1; ; d++) {
      const g = await Z(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            Ht({
              findFilter: {
                page: d,
                perPage: 1e3,
                sort: n ? "audio_count" : "video_count",
                direction: "desc"
              },
              objectFilter: l,
              filterExpression: p
            })
          )
        }
      );
      if (a.push(...g.items.map(o)), d * 1e3 >= g.totalCount || !g.items.length) break;
    }
  }
  return a.sort((p, l) => l.total - p.total || p.id - l.id);
}
function ra(e, t, n) {
  const i = Pi(e, [t]);
  return us(i, i.view.filter, n);
}
function ia(e, t) {
  const n = e.findIndex(
    (i) => i.count < t.count || i.count === t.count && i.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function ui(e, t, n, i) {
  if (t >= e.length) return !0;
  const o = e[t].total;
  return o <= 0 ? !0 : n.length >= i && o < n[i - 1].count;
}
async function Nc(e, t, n, i, o = {}) {
  const s = Nr(e), a = vc(e), p = Wo(e.occurrence), l = (t == null ? void 0 : t.signature) === s && !t.partial ? t : {
    signature: s,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: p ? "" : a,
    candidates: p ? [] : (t == null ? void 0 : t.candidatesKey) === a ? t.candidates : await Sc(e, i),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: d } = l, g = [...l.ranked];
  let h = l.cursor, b = !1;
  const y = (S) => ({
    ...l,
    cursor: h,
    ranked: [...g],
    limit: n,
    complete: !S && ui(d, h, g, n),
    ...S ? { partial: S } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: o.concurrency ?? 6 }, async () => {
        var S;
        for (; !b && !ui(d, h, g, n); ) {
          i.throwIfAborted();
          const q = d[h++], m = await ra(e, q.id, i);
          m > 0 && ia(g, { ...q, count: m }), (S = o.onProgress) == null || S.call(o, y(!0));
        }
      })
    );
  } catch (S) {
    throw b = !0, S;
  }
  return i.throwIfAborted(), y(!1);
}
function Ec(e, t, n) {
  const i = e.candidates.findIndex((s) => s.id === t);
  if (e.partial || i < 0 || i >= e.cursor) return e;
  const o = e.ranked.filter((s) => s.id !== t);
  return n > 0 && ia(o, { ...e.candidates[i], count: n }), {
    ...e,
    ranked: o,
    complete: ui(e.candidates, e.cursor, o, e.limit)
  };
}
function rr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((a, p) => rr(a, t[p]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, i = t, o = Object.keys(n).sort(), s = Object.keys(i).sort();
  return o.length === s.length && o.every(
    (a, p) => a === s[p] && rr(n[a], i[a])
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
  "performer",
  "startFrom"
], qc = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function _n(e) {
  const t = de(e) ? e.occurrence : void 0;
  return {
    filter: Xe({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, he(e)),
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
function oo(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function fi(e, t) {
  let n;
  if (de(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!Dr.some((p) => p !== "performer" && t.has(p))) {
    const p = _n(e);
    return {
      query: n ? { ...p, performerFocus: n } : p,
      startAtEnd: p.startFrom === "end"
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
    const p = t.get("sorts").split(",").map((l) => {
      const d = l.lastIndexOf(":");
      return { key: l.slice(0, d), direction: l.slice(d + 1) };
    });
    if (p.some((l) => !l.key || !["asc", "desc"].includes(l.direction)))
      throw new Error("Invalid review URL sort.");
    o.sorts = p, o.sort = p[0].key, o.direction = p[0].direction;
  }
  let s;
  if (de(e) && (s = {
    ...qc,
    ...oo(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(s.targetMode) || !Pr.includes(s.condition) || !Array.isArray(s.performerIds) || !Array.isArray(s.conditionTagIds) || typeof s.includeSubtags != "boolean" || typeof s.hideConfirmedAbsent != "boolean" || [...s.performerIds, ...s.conditionTagIds].some(
    (p) => !Number.isSafeInteger(p) || p <= 0
  ) || !s.performerFilter || typeof s.performerFilter != "object" || Array.isArray(s.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const a = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Xe(o, he(e)),
      objectFilter: oo(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: a,
      performerScope: s,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && a === "end"
  };
}
function Zn(e, t) {
  const n = new URLSearchParams(window.location.search);
  Dr.forEach((i) => n.delete(i)), n.set("review", e);
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
function Ft(e, t) {
  const n = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return de(e) ? {
    ...e,
    view: n,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: n };
}
function ao(e, t) {
  return !t || !de(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function zr(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const i of e)
    n.set(i.media.id, [...n.get(i.media.id) ?? [], i]);
  return [...n.values()].reverse().flat();
}
const gt = (e) => e instanceof Error ? e.message : "Request failed.", Wr = 50, so = '[role="dialog"]:not(.dq-scope-popover), dialog[open]';
function Cc(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? Na(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? bo(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function Ac({ media: e, kind: t }) {
  const [n, i] = N(!1);
  return /* @__PURE__ */ r("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ r(So, {}) : /* @__PURE__ */ r(Er, {}) : /* @__PURE__ */ r(
    "img",
    {
      src: oi(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => i(!0)
    }
  ) });
}
function kc({
  tags: e,
  preview: t,
  showPreview: n,
  trees: i,
  actionTagIds: o,
  label: s
}) {
  const a = ea(t), p = n ? a : null, l = e == null ? void 0 : e.absent, d = sr(
    We(() => [...o, ...l ?? []], [o, l])
  ), g = (E) => d[E] === void 0 ? "…" : d[E] ?? "Unavailable tag", h = p && e ? Zo(p, e, i) : null, b = e ? rc(e) : [], y = new Set(b.map((E) => E.id)), S = new Set(h == null ? void 0 : h.removed), q = new Set(h == null ? void 0 : h.markedAbsent), m = new Set(h == null ? void 0 : h.absenceCleared), R = /* @__PURE__ */ c("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ r(Xr, { "aria-hidden": "true" }),
    "absent"
  ] });
  return /* @__PURE__ */ c("section", { className: "dq-panel-section", "aria-label": s, children: [
    /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ c(se, { children: [
      b.length || h != null && h.added.length || h != null && h.markedAbsent.length ? /* @__PURE__ */ c("ul", { className: "dq-chips", "aria-label": "Current tags", children: [
        b.map(
          (E) => S.has(E.id) ? /* @__PURE__ */ c("li", { className: "dq-chip dq-chip-removed", children: [
            /* @__PURE__ */ r("del", { children: E.name }),
            q.has(E.id) && R
          ] }, E.id) : /* @__PURE__ */ r("li", { className: "dq-chip", children: E.name }, E.id)
        ),
        h == null ? void 0 : h.added.map((E) => /* @__PURE__ */ r("li", { className: "dq-chip dq-chip-added", children: /* @__PURE__ */ c("ins", { children: [
          "+ ",
          g(E)
        ] }) }, `added-${E}`)),
        h == null ? void 0 : h.markedAbsent.filter((E) => !y.has(E)).map((E) => /* @__PURE__ */ c("li", { className: "dq-chip dq-chip-absent-new", children: [
          /* @__PURE__ */ r("ins", { children: g(E) }),
          R
        ] }, `absent-${E}`))
      ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" }),
      e.absent.length > 0 && /* @__PURE__ */ c(se, { children: [
        /* @__PURE__ */ r("h4", { className: "dq-subheading", children: "Confirmed absent" }),
        /* @__PURE__ */ r("ul", { className: "dq-chips", "aria-label": "Confirmed absent tags", children: e.absent.map((E) => /* @__PURE__ */ c(
          "li",
          {
            className: `dq-chip dq-chip-absent${m.has(E) ? " dq-chip-removed" : ""}`,
            children: [
              /* @__PURE__ */ r(Xr, { "aria-hidden": "true" }),
              m.has(E) ? /* @__PURE__ */ r("del", { children: g(E) }) : g(E)
            ]
          },
          E
        )) })
      ] })
    ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading…" })
  ] });
}
function Tc({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: i,
  onSaveDefaults: o,
  editRequest: s = 0,
  renderRuleEditor: a,
  pageControls: p
}) {
  var fr;
  const l = he(e), d = bt(l), g = l === "audio" ? "Audio" : "Scene", h = (f) => {
    var w;
    return f.title || ((w = f.files[0]) == null ? void 0 : w.basename) || g;
  }, b = (f) => `${f.occurrence ? `${f.occurrence.performer.name} — ` : ""}${h(f.media)}`, y = P(null), S = P("");
  if (!y.current)
    try {
      y.current = fi(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (f) {
      S.current = gt(f), y.current = { query: _n(e), startAtEnd: !1 };
    }
  const [q, m] = N(null), R = P(null), E = P(null), L = P(null), [B, ne] = N(!!S.current), M = P(0), [$, x] = N(y.current.query), j = P($);
  j.current = $;
  const [O, _] = N(0), oe = P(y.current.startAtEnd), [F, J] = N([]), [C, X] = N(null), re = P(null), [Ce, ie] = N(null), [Ne, Dt] = N(0), _t = We(() => {
    if (!C) return null;
    const f = F.findIndex((w) => w.key === C.key);
    return f < 0 ? null : F.slice(f + 1).find((w) => w.media.id !== C.media.id) ?? null;
  }, [C, F]), [jt, Ut] = N(0), [be, _e] = N(!1), [Ee, Ze] = N(!1), ye = P(!1), et = P(!0), Qe = P(null);
  z(() => (et.current = !0, () => {
    et.current = !1;
  }), []);
  const [Ae, ce] = N(S.current), [ae, T] = N(""), [G, je] = N(null), [ve, W] = N(!1), [Tt, fn] = N([]), yt = P([]), ut = P(null), Ge = P(null), $e = P(null);
  z(() => {
    var f, w;
    ve && ((w = (f = $e.current) == null ? void 0 : f.querySelector("input")) == null || w.focus());
  }, [ve]);
  const [Ue, He] = N(!1), [Kt, wt] = N(!1);
  z(() => {
    if (be || Ue || !Ge.current) return;
    const f = requestAnimationFrame(() => {
      if (document.querySelector(so)) return;
      const w = Ge.current;
      Ge.current = null;
      const I = document.activeElement;
      I && I !== document.body || w != null && w.isConnected && !w.disabled && w.focus();
    });
    return () => cancelAnimationFrame(f);
  }, [be, Ue, O]);
  const [Rt, k] = N([]), [Q, ke] = N({}), tt = P(null), Pe = P(0), [ue, Tn] = N({});
  z(() => {
    let f = !0;
    return Promise.all(
      Oi($.objectFilter).map(
        async (w) => [
          String(w),
          (await Z(`/api/tags/${w}`)).name
        ]
      )
    ).then((w) => {
      f && Tn(Object.fromEntries(w));
    }).catch(() => {
    }), () => {
      f = !1;
    };
  }, [$.objectFilter]);
  const _r = We(
    () => Mi($.objectFilter, ue),
    [ue, $.objectFilter]
  ), Yt = P(0), Ke = P(e);
  Ke.current = e;
  const ft = q ?? e, te = We(
    () => Ft(ft, $),
    [ft, $]
  ), nt = We(
    () => ao(te, $.performerFocus),
    [te, $.performerFocus]
  ), Ye = P(nt);
  Ye.current = nt;
  const pn = P(te);
  pn.current = te;
  const [Bt, Rn] = N("items"), [ot, jr] = N(null), xe = P(null), at = P("");
  function vt(f) {
    const w = typeof f == "function" ? f(xe.current) : f;
    xe.current = w, jr(w);
  }
  const [It, Xt] = N(!1), [Ie, Ve] = N(null), me = P(null), qe = de(te) ? Nr(te) : "", [Zt, st] = N(0), [hn, en] = N(null);
  z(() => () => {
    var f;
    return (f = me.current) == null ? void 0 : f.controller.abort();
  }, []), z(() => {
    const f = me.current;
    !f || f.signature === qe || (f.controller.abort(), me.current = null, Xt(!1));
  }, [qe]), z(() => {
    var I;
    const f = xe.current;
    if (Bt !== "performers" || !qe || ((I = me.current) == null ? void 0 : I.signature) === qe || at.current === qe || (f == null ? void 0 : f.signature) === qe && f.complete)
      return;
    const w = (f == null ? void 0 : f.signature) === qe ? f : null;
    nn(f, (w == null ? void 0 : w.limit) ?? Wr);
  }, [Bt, qe, ot, Ie, It]);
  const pt = $.performerFocus, Ot = JSON.stringify(
    de(te) ? te.occurrence.flagPerformerTagIds ?? [] : []
  );
  z(() => {
    if (!pt) {
      en(null);
      return;
    }
    let f = !0;
    const w = new Set(JSON.parse(Ot));
    return Z(
      `/api/performers/${pt}`
    ).then((I) => {
      f && en({
        id: pt,
        name: I.name,
        flags: (I.tags ?? []).filter((K) => w.has(K.id)).map((K) => K.name)
      });
    }).catch(() => {
    }), () => {
      f = !1;
    };
  }, [pt, Ot]);
  const Gn = $.startFrom !== (e.view.startFrom ?? "end") || !rr(
    JSON.parse(Pt(Ft(e, $))),
    JSON.parse(Pt(Ft(e, _n(e))))
  ), rt = Ee || be || ve, Gt = Number($.filter.page);
  function Le(f, w = !1) {
    ye.current || (S.current = "", oe.current = w, j.current = f, x(f), Ut(0), _e(!0), w || Zn(e.id, f), _((I) => I + 1));
  }
  function mn() {
    if (ye.current = !1, Ze(!1), et.current && Qe.current) {
      const f = Qe.current;
      Qe.current = null, Le(f.query, f.startAtEnd);
    }
  }
  z(() => {
    const f = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const w = fi(
            Ke.current,
            new URLSearchParams(window.location.search)
          );
          ye.current ? Qe.current = w : Le(w.query, w.startAtEnd);
        } catch (w) {
          ce(gt(w));
        }
    };
    return window.addEventListener("popstate", f), () => window.removeEventListener("popstate", f);
  }, [e.id]), z(() => (i(Ee || be || ve || !!q), () => i(!1)), [Ee, be, ve, !!q, i]);
  async function le(f, w, I) {
    if (de(f)) {
      const H = await Qo(
        f,
        tt.current,
        w,
        I
      );
      return {
        items: H.items.map((V) => ({
          key: V.key,
          media: V.media,
          occurrence: V
        })),
        totalCount: H.totalCount
      };
    }
    const K = await Xn(
      f,
      { ...f.view.filter, page: w },
      I
    );
    return {
      items: K.items.map((H) => ({ key: String(H.id), media: H })),
      totalCount: K.totalCount
    };
  }
  function tn(f, w, I, K = !1, H = !1) {
    if (!et.current || Qe.current) return;
    ne(!0), J(
      H ? f.items : zr(f.items, j.current.startFrom === "end")
    ), Ut(f.totalCount), St(I, K);
    const V = {
      ...j.current,
      filter: { ...j.current.filter, page: w }
    };
    j.current = V, x(V), Zn(e.id, V);
  }
  function St(f, w = !1) {
    (f == null ? void 0 : f.key) !== (C == null ? void 0 : C.key) && (re.current = null), (f == null ? void 0 : f.media.id) !== (C == null ? void 0 : C.media.id) && ie(w && f ? f.media.id : null), X(f);
  }
  z(() => {
    if (S.current) return;
    const f = new AbortController();
    L.current = f;
    const w = ++Yt.current;
    return _e(!0), ce(""), T(""), re.current = null, ie(null), X(null), J([]), W(!1), (async () => {
      const I = ao(
        Ft(Ke.current, j.current),
        j.current.performerFocus
      );
      tt.current = de(I) ? await $i(I, f.signal) : null;
      let K = Number(I.view.filter.page), H = await le(I, K, f.signal);
      const V = Math.max(
        1,
        Math.ceil(H.totalCount / Number(I.view.filter.perPage))
      );
      (oe.current || K > V) && (K = V, H = await le(I, K, f.signal)), oe.current = !1;
      const pe = I.view.startFrom === "end" ? -1 : 1;
      for (; de(I) && !H.items.length && K + pe >= 1 && K + pe <= V && !f.signal.aborted; )
        K += pe, H = await le(I, K, f.signal);
      if (w !== Yt.current || f.signal.aborted) return;
      const Je = zr(H.items, I.view.startFrom === "end");
      tn(H, K, Je[0] ?? null);
    })().catch((I) => {
      !f.signal.aborted && w === Yt.current && ce(gt(I));
    }).finally(() => {
      !f.signal.aborted && w === Yt.current && (ne(!0), _e(!1));
    }), () => {
      f.abort(), Yt.current++;
    };
  }, [O, e.id]), z(() => {
    if (je(null), !C) return;
    let f = !0;
    return kt(l, C).then((w) => {
      f && (je(w), k(
        de(e) ? w.ids.filter((I) => e.occurrence.tagIds.includes(I)) : []
      ));
    }).catch((w) => {
      f && ce(`Could not load current tags. ${gt(w)}`);
    }), () => {
      f = !1;
    };
  }, [C]), z(() => {
    if (!de(e) || e.actions.length)
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
      f && ke(Object.fromEntries(w));
    }).catch((w) => {
      f && ce(gt(w));
    }), () => {
      f = !1;
    };
  }, [e]);
  async function cr(f = !1, w = !1, I = !1) {
    var zt;
    if (!C) return;
    const K = F.findIndex((ge) => ge.key === C.key), H = $.startFrom === "end" ? -1 : 1, V = ((zt = re.current) == null ? void 0 : zt.key) === C.key ? re.current : { key: C.key, page: Gt, before: F.slice(0, K + 1).map((ge) => ge.key), after: F.slice(K + 1).map((ge) => ge.key) }, pe = new Set(V.after), Je = new Set(V.before), Nt = F.find((ge) => {
      var Et;
      return pe.has(ge.key) || (H === 1 || Gt < V.page) && ((Et = re.current) == null ? void 0 : Et.key) === C.key && !Je.has(ge.key);
    });
    if (!f && Nt) {
      St(Nt, I);
      return;
    }
    const ze = f ? Je : new Set(F.map((ge) => ge.key)), ct = 1100 - (Date.now() - Pe.current);
    ct > 0 && await new Promise((ge) => window.setTimeout(ge, ct));
    let Be = H === -1 && !f ? Math.max(1, Gt - 1) : Gt;
    for (; et.current && !Qe.current; ) {
      let ge = await le(nt, Be);
      const Et = Math.max(
        1,
        Math.ceil(ge.totalCount / Number($.filter.perPage))
      );
      Be > Et && (Be = Et, ge = await le(nt, Be));
      const an = zr(ge.items, H === -1), pr = new Map(an.map((it) => [it.key, it])), Fn = f ? V.after.flatMap((it) => {
        const mr = pr.get(it);
        return mr ? [mr] : [];
      }) : [], hr = new Set(Fn.map((it) => it.key)), sn = f ? {
        ...ge,
        items: [
          ...Fn,
          ...an.filter(
            (it) => it.key !== C.key && !hr.has(it.key)
          )
        ]
      } : ge;
      if (w) {
        re.current = V, tn(sn, Be, C, !1, f);
        return;
      }
      const Wn = H === -1 && Gt === 1 && !f ? void 0 : sn.items.find(
        (it) => !ze.has(it.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(f && H === -1 && Be === V.page) || pe.has(it.key))
      );
      if (Wn || (H === -1 ? Be <= 1 : Be >= Et)) {
        tn(
          sn,
          Be,
          Wn ?? null,
          I,
          f
        ), Wn || T(
          ge.totalCount ? `Reached the end in this direction. Matching items remain available from the ${d.queue} pages.` : `No matching ${d.many}.`
        );
        return;
      }
      Be += H;
    }
  }
  async function ht(f, w = !1, I = !1, K = !1) {
    if (q || !C || ye.current || be || ve && !I)
      return;
    const H = I || K || !!(f != null && f.steps.length), V = H && !w;
    if (H && (!t || !G) || f && dn(f) && !n) return;
    ye.current = !0, Ze(!0), ce(""), T("");
    const pe = F.findIndex((ze) => ze.key === C.key), Je = H && !w && pe >= 0 ? F[pe + 1] ?? null : null;
    Je && (J(
      (ze) => ze.filter((ct) => ct.key !== C.key)
    ), St(Je, !0));
    let Nt = !1;
    try {
      if (H) {
        const ze = await kt(l, C);
        if (f)
          await Vs(nt, C, f);
        else {
          const Be = K && de(e) ? e.occurrence.tagIds.filter((Et) => ze.ids.includes(Et)) : yt.current, ge = Kn(Be, K ? Rt : Tt);
          await xi(nt, C, ge);
        }
        Pe.current = Date.now();
        const ct = await kt(l, C);
        Je || je(ct), Nt = !0, W(!1), T("Tags saved."), C.occurrence && (Jn(C.occurrence.performer.id), st((Be) => Be + 1));
      }
      if (!et.current || Qe.current) return;
      H ? await cr(!0, w, V) : w || await cr(), w && I && requestAnimationFrame(() => {
        var ze;
        return (ze = ut.current) == null ? void 0 : ze.focus();
      });
    } catch (ze) {
      if (ce(
        Nt ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${gt(ze)}` : H ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${gt(ze)}` : `Could not advance. ${gt(ze)}`
      ), H && !Nt) {
        Je && (J(F), ie(null), Dt((ct) => ct + 1), X(C)), Pe.current = Date.now();
        try {
          je(await kt(l, C));
        } catch {
          je(null), ce(
            (ct) => `${ct} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      mn();
    }
  }
  const In = !ve && !q && !Ue && !Kt && (C != null || be || Ee);
  Ai({
    surface: "local",
    enabled: In,
    actionCount: e.actions.length,
    onAction: (f, w) => {
      const I = e.actions[f];
      I && ht(I, w);
    },
    onFind: () => wt(!0)
  });
  const Mt = (f) => Ee || be || !G || !!q || !t && f.steps.length > 0 || !n && dn(f);
  function On() {
    !o || q || ye.current || ve || (E.current = document.activeElement, R.current = {
      error: Ae,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(j.current),
      items: F,
      current: C,
      total: jt,
      targets: tt.current,
      stayedCursor: re.current
    }, m(structuredClone(Ft(e, j.current))), T(""), ce(""));
  }
  z(() => {
    s && s !== M.current && B && !be && (M.current = s, On());
  }, [s, be, B]);
  function Vt() {
    m(null), requestAnimationFrame(() => {
      var f;
      return (f = E.current) == null ? void 0 : f.focus();
    });
  }
  function Se() {
    var w;
    const f = R.current;
    !f || Ee || ((w = L.current) == null || w.abort(), Yt.current++, j.current = f.query, x(f.query), J(f.items), X(f.current), Ut(f.total), tt.current = f.targets, re.current = f.stayedCursor, _e(!1), ce(f.error), T(""), window.history.replaceState(window.history.state, "", f.url), Vt());
  }
  async function Vn() {
    if (!q || !o || ye.current) return;
    const f = Ft(
      { ...q, name: q.name.trim() },
      j.current
    ), w = qr(f);
    if (w) {
      ce(w);
      return;
    }
    ye.current = !0, Ze(!0), ce("");
    try {
      if (await o(f) === !1) throw new Error("Could not save review.");
      Vt(), T("Review saved.");
    } catch (I) {
      ce(
        "Could not save review. Your edits are still open. " + gt(I)
      );
    } finally {
      mn();
    }
  }
  async function lr() {
    if (!o || ye.current) return;
    const f = Ft(e, {
      ...j.current,
      filter: { ...j.current.filter, page: 1 }
    });
    ye.current = !0, Ze(!0), ce("");
    try {
      if (await o(f) === !1) throw new Error("Could not save review.");
      T("Queue saved to this review.");
    } catch (w) {
      ce("Could not save queue. " + gt(w));
    } finally {
      mn();
    }
  }
  const De = $.performerScope, gn = (f) => {
    const { performerFocus: w, ...I } = j.current, K = w && !("targetMode" in f || "performerIds" in f || "performerFilter" in f);
    Le({
      ...I,
      ...K ? { performerFocus: w } : {},
      filter: { ...I.filter, page: 1 },
      performerScope: { ...De, ...f }
    });
  };
  async function nn(f, w) {
    var H;
    const I = pn.current;
    if (!de(I)) return;
    (H = me.current) == null || H.controller.abort();
    const K = {
      signature: Nr(I),
      controller: new AbortController()
    };
    me.current = K, at.current = "", Xt(!0), Ve(null);
    try {
      const V = await Nc(I, f, w, K.controller.signal, {
        onProgress: (pe) => {
          me.current === K && vt(pe);
        }
      });
      me.current === K && vt(V);
    } catch (V) {
      me.current === K && !K.controller.signal.aborted && (at.current = K.signature, Ve({ signature: K.signature, message: gt(V) }));
    } finally {
      me.current === K && (me.current = null, Xt(!1));
    }
  }
  function bn() {
    var f;
    (f = me.current) == null || f.controller.abort(), me.current = null, Xt(!1), vt((w) => w && { ...w, partial: !0, complete: !1 });
  }
  async function Jn(f) {
    var H;
    const w = pn.current;
    if (!de(w)) return;
    if (me.current) {
      bn();
      return;
    }
    const I = Nr(w);
    if (((H = xe.current) == null ? void 0 : H.signature) !== I || xe.current.partial) return;
    const K = 1100 - (Date.now() - Pe.current);
    K > 0 && await new Promise((V) => window.setTimeout(V, K));
    try {
      const V = await ra(w, f);
      if (me.current) {
        bn();
        return;
      }
      vt(
        (pe) => (pe == null ? void 0 : pe.signature) === I ? Ec(pe, f, V) : pe
      );
    } catch {
      vt(
        (V) => (V == null ? void 0 : V.signature) === I ? { ...V, partial: !0, complete: !1 } : V
      );
    }
  }
  const yn = $.performerFocus ? ot == null ? void 0 : ot.candidates.find((f) => f.id === $.performerFocus) : void 0, Oe = (hn == null ? void 0 : hn.id) === $.performerFocus ? hn : yn ?? null;
  function Mn(f) {
    if (ye.current) return;
    const w = {
      ...j.current,
      performerFocus: f,
      filter: { ...j.current.filter, page: 1 }
    };
    Le(w, w.startFrom === "end"), Rn("items");
  }
  function wn() {
    const { performerFocus: f, ...w } = j.current;
    Le(
      { ...w, filter: { ...w.filter, page: 1 } },
      w.startFrom === "end"
    );
  }
  const vn = P(null);
  vn.current ?? (vn.current = oc());
  const dr = vn.current, rn = ic(ft.actions), $t = We(
    () => ft.actions.flatMap((f) => f.steps.flatMap((w) => w.tagIds)),
    [ft.actions]
  ), Sn = P(null);
  z(() => {
    const f = Sn.current, w = f == null ? void 0 : f.querySelector('[aria-current="true"]');
    if (!f || !w) return;
    const I = f.getBoundingClientRect(), K = w.getBoundingClientRect();
    K.top < I.top ? f.scrollTop -= I.top - K.top : K.bottom > I.bottom && (f.scrollTop += K.bottom - I.bottom);
  }, [C == null ? void 0 : C.key, Bt]);
  const Nn = P(null), on = P(null);
  z(() => {
    var I, K;
    const f = on.current;
    if (!f) return;
    on.current = null;
    const w = [...((I = Nn.current) == null ? void 0 : I.querySelectorAll(".dq-partner")) ?? []];
    (K = w.find((H) => H.dataset.partnerKey === f) ?? w[0]) == null || K.focus();
  }, [C == null ? void 0 : C.key]);
  const En = Ee || be || ve || !!q, $n = Ee || be || C != null && !G, Ur = Math.max(1, Number($.filter.perPage) || 1), ur = P(1);
  be || (ur.current = Math.max(1, Math.ceil(jt / Ur)));
  const zn = ur.current, Pn = De && C ? F.filter(
    (f) => f.media.id === C.media.id && f.key !== C.key
  ) : [], qn = C != null && C.occurrence && C.occurrence.performer.id === $.performerFocus ? (Oe == null ? void 0 : Oe.flags) ?? [] : C != null && C.occurrence ? ((fr = ot == null ? void 0 : ot.candidates.find((f) => f.id === C.occurrence.performer.id)) == null ? void 0 : fr.flags) ?? [] : [], Jt = (f) => {
    var w;
    return f.title || ((w = f.files[0]) == null ? void 0 : w.basename) || `${l === "audio" ? "Audio" : "Video"} ${f.id}`;
  }, fe = C ? Cc(C.media, l) : "";
  return /* @__PURE__ */ c(
    "section",
    {
      className: `dq-review-workspace${l === "audio" ? " dq-audio" : ""}${q ? " dq-editing-rule" : ""}`,
      "aria-label": De ? l === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : l === "audio" ? "Audio review" : "Video review",
      onClickCapture: (f) => {
        var K;
        const w = f.target instanceof Element ? f.target.closest("button") : null, I = (w == null ? void 0 : w.getAttribute("aria-label")) ?? ((K = w == null ? void 0 : w.textContent) == null ? void 0 : K.trim()) ?? "";
        w && !w.closest(so) && /^(Filters|Edit filter:|Edit criteria)/.test(I) && (Ge.current = w);
      },
      children: [
        /* @__PURE__ */ r(
          uc,
          {
            name: e.name,
            description: e.description,
            entityType: Me(e),
            onBack: p == null ? void 0 : p.onBack,
            backDisabled: En,
            onEdit: On,
            editDisabled: En || !o,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ c("fieldset", { className: "dq-review-toolbar", disabled: Ee || ve, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: l === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ r(
                  er,
                  {
                    filter: $.filter,
                    objectFilter: _r,
                    criteriaDefinitions: l === "audio" ? mi : Ir,
                    customFieldEntityType: l,
                    totalCount: jt,
                    sortOptions: l === "audio" ? mo : bi,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(
                      fc,
                      {
                        page: Math.min(Math.max(1, Gt || 1), zn),
                        pages: zn,
                        onPage: (f) => Le({
                          ...j.current,
                          filter: Xe(
                            { ...j.current.filter, page: f },
                            l
                          )
                        })
                      }
                    ),
                    onFilterChange: (f) => {
                      (f.sort !== j.current.filter.sort || f.direction !== j.current.filter.direction) && (f = { ...f, sorts: void 0 }), Le({
                        ...j.current,
                        filter: Xe(f, l)
                      });
                    },
                    onObjectFilterChange: (f) => {
                      Le({
                        ...j.current,
                        objectFilter: Jo(
                          f,
                          ue,
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
              De && /* @__PURE__ */ r(
                wc,
                {
                  scope: De,
                  disabled: Ee || ve,
                  onChange: gn,
                  onEditCriteria: () => He(!0)
                }
              ),
              de(nt) && t && /* @__PURE__ */ r(
                tc,
                {
                  review: nt,
                  hidden: !!q,
                  disabled: rt || !!q,
                  performerFlags: $.performerFocus ? Oe == null ? void 0 : Oe.flags : void 0,
                  onOpen: () => {
                    ye.current = !0, Ze(!0);
                  },
                  onWrite: () => {
                    Pe.current = Date.now();
                  },
                  onClose: (f) => {
                    if (f) {
                      Pe.current = Date.now();
                      const w = j.current.performerFocus;
                      w ? Jn(w) : bn(), st((I) => I + 1), new Promise((I) => window.setTimeout(I, 1100)).then(() => {
                        mn(), et.current && _((I) => I + 1);
                      });
                    } else mn();
                  }
                }
              ),
              (p == null ? void 0 : p.onGrid) && /* @__PURE__ */ r(
                pc,
                {
                  mode: "single",
                  disabled: En,
                  onChange: () => {
                    var f;
                    return (f = p.onGrid) == null ? void 0 : f.call(p);
                  }
                }
              ),
              (p == null ? void 0 : p.onManage) && /* @__PURE__ */ r(
                hc,
                {
                  disabled: En,
                  items: [
                    {
                      label: "Manage reviews",
                      disabled: p.manageDisabled,
                      onSelect: () => {
                        var f;
                        return (f = p.onManage) == null ? void 0 : f.call(p);
                      }
                    }
                  ]
                }
              )
            ] }),
            chipsStart: $.performerFocus ? /* @__PURE__ */ c("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ r(
                Hn,
                {
                  performer: {
                    id: $.performerFocus,
                    name: (Oe == null ? void 0 : Oe.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ c("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ r("strong", { children: (Oe == null ? void 0 : Oe.name) ?? `performer ${$.performerFocus}` })
              ] }),
              Oe != null && Oe.flags.length ? /* @__PURE__ */ c(
                "span",
                {
                  className: "dq-focus-flag",
                  title: `Flagged: ${Oe.flags.join(", ")}`,
                  children: [
                    /* @__PURE__ */ r(Zr, { "aria-hidden": "true" }),
                    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
                      "Flagged: ",
                      Oe.flags.join(", ")
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
                  onClick: wn,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            chipsEnd: !q && Gn ? /* @__PURE__ */ c(se, { children: [
              /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Queue differs from the saved review" }),
              /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: "dq-text-button",
                  title: "Save the current queue criteria to this review",
                  disabled: rt || !o,
                  onClick: () => void lr(),
                  children: [
                    /* @__PURE__ */ r(No, { "aria-hidden": "true" }),
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
                    const f = _n(e);
                    Le(f, f.startFrom === "end");
                  },
                  children: [
                    /* @__PURE__ */ r(Eo, { "aria-hidden": "true" }),
                    "Reset"
                  ]
                }
              )
            ] }) : void 0
          }
        ),
        p == null ? void 0 : p.notices,
        /* @__PURE__ */ c("div", { className: "dq-review-main", children: [
          q && /* @__PURE__ */ c("section", { className: "dq-rule-editor", "aria-label": "Edit review rule", children: [
            /* @__PURE__ */ r("h2", { children: "Edit review" }),
            /* @__PURE__ */ r("p", { children: "Preview matching scenes below. Save review keeps all rule changes; Cancel restores your previous view." }),
            /* @__PURE__ */ c("fieldset", { disabled: Ee, children: [
              a == null ? void 0 : a(
                Ft(q, $),
                m,
                Ee
              ),
              /* @__PURE__ */ c("label", { children: [
                "Review direction",
                /* @__PURE__ */ c(
                  "select",
                  {
                    "aria-label": "Review direction",
                    value: $.startFrom,
                    onChange: (f) => Le({
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
                  disabled: Ee || be,
                  onClick: () => void Vn(),
                  children: "Save review"
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  className: "dq-button",
                  type: "button",
                  disabled: Ee,
                  onClick: Se,
                  children: "Cancel"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ c("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ c("div", { className: "dq-review-stage", children: [
              C ? /* @__PURE__ */ c(se, { children: [
                /* @__PURE__ */ c("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ r("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ c(
                    "a",
                    {
                      href: `/${l}/${C.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${d.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ r("span", { children: Jt(C.media) }),
                        /* @__PURE__ */ r(qo, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  fe && /* @__PURE__ */ r("span", { className: "dq-stage-meta", children: fe })
                ] }),
                /* @__PURE__ */ c("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ r("div", { className: "dq-player-frame", children: [C, _t].filter(Boolean).map((f) => {
                    var K, H, V, pe, Je;
                    const w = f, I = w.key === C.key;
                    return /* @__PURE__ */ r(
                      "div",
                      {
                        className: I ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": I ? void 0 : !0,
                        inert: I ? void 0 : !0,
                        children: l === "audio" ? /* @__PURE__ */ r(
                          Sa,
                          {
                            streamUrl: ai("audio", w.media.id),
                            format: ((K = w.media.files[0]) == null ? void 0 : K.format) ?? "",
                            title: h(w.media),
                            coverUrl: I ? oi("audio", w.media) : void 0,
                            duration: ((H = w.media.files[0]) == null ? void 0 : H.duration) ?? 0,
                            autostart: I && Ce === w.media.id
                          }
                        ) : /* @__PURE__ */ r(
                          go,
                          {
                            videoId: w.media.id,
                            streamUrl: ai("video", w.media.id),
                            posterUrl: I ? oi("video", w.media) : void 0,
                            duration: ((V = w.media.files[0]) == null ? void 0 : V.duration) ?? 0,
                            format: (pe = w.media.files[0]) == null ? void 0 : pe.format,
                            audioCodec: (Je = w.media.files[0]) == null ? void 0 : Je.audioCodec,
                            extensionSurface: I ? "quick-view" : void 0,
                            autostart: I && Ce === w.media.id,
                            keyboardShortcutsEnabled: I,
                            showAbLoop: I,
                            clip: w.media.parentVideoId != null ? {
                              start: w.media.clipStartSec ?? 0,
                              end: w.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${w.media.id}:${Ne}`
                    );
                  }) }),
                  l === "audio" && /* @__PURE__ */ r(
                    lc,
                    {
                      details: C.media.details,
                      label: d.one
                    },
                    C.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ r("p", { role: "status", className: "dq-stage-status", children: be ? "Loading review…" : jt ? "Reached the end in this direction." : `No matching ${d.many}.` }),
              ft.actions.length > 0 ? /* @__PURE__ */ r(
                ac,
                {
                  actions: ft.actions,
                  mediaKind: l,
                  isDisabled: (f) => ve || Mt(f),
                  busy: $n,
                  tags: G,
                  trees: rn,
                  preview: dr,
                  onApply: (f, w) => void ht(f, w),
                  onFind: () => wt(!0),
                  findDisabled: ve || !!q
                }
              ) : de(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ c(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || Ee || ve || !G || !!q || !C,
                  children: [
                    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((f) => /* @__PURE__ */ c("label", { children: [
                      /* @__PURE__ */ r(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: Rt.includes(f),
                          onChange: (w) => k(
                            e.occurrence.multiple ? w.target.checked ? [...Rt, f] : Rt.filter((I) => I !== f) : [f]
                          )
                        }
                      ),
                      Q[f] ?? "Loading tag…"
                    ] }, f)),
                    /* @__PURE__ */ c("div", { className: "dq-row", children: [
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => k([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void ht(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void ht(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ c("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ c("div", { className: "dq-panel-body", ref: Nn, children: [
                C && /* @__PURE__ */ c(se, { children: [
                  /* @__PURE__ */ c("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ c("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: C.occurrence ? C.occurrence.performer.name : `this ${d.one}` })
                    ] }),
                    /* @__PURE__ */ c("div", { className: "dq-reviewing-who", children: [
                      C.occurrence && /* @__PURE__ */ r(Hn, { performer: C.occurrence.performer }),
                      /* @__PURE__ */ c("div", { children: [
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: C.occurrence ? C.occurrence.performer.name : `This ${d.one}` }),
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-note", children: De ? `Tags apply to this performer in this ${d.queue}` : `Tags apply to the whole ${d.one}` })
                      ] })
                    ] }),
                    qn.length > 0 && /* @__PURE__ */ c("p", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
                      /* @__PURE__ */ r(Zr, { "aria-hidden": "true" }),
                      "Flagged: ",
                      qn.join(", ")
                    ] })
                  ] }),
                  Pn.length > 0 && /* @__PURE__ */ c(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${d.queue}`,
                      children: [
                        /* @__PURE__ */ c("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          d.queue
                        ] }),
                        /* @__PURE__ */ r("div", { className: "dq-partners", children: Pn.map((f) => {
                          var w, I, K;
                          return /* @__PURE__ */ c(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (w = f.occurrence) == null ? void 0 : w.performer.name,
                              "aria-label": (I = f.occurrence) == null ? void 0 : I.performer.name,
                              "data-partner-key": f.key,
                              disabled: rt,
                              onClick: () => {
                                on.current = C.key, St(f), ce("");
                              },
                              children: [
                                f.occurrence && /* @__PURE__ */ r(Hn, { performer: f.occurrence.performer }),
                                /* @__PURE__ */ r("span", { children: (K = f.occurrence) == null ? void 0 : K.performer.name })
                              ]
                            },
                            f.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ r(
                    kc,
                    {
                      tags: G,
                      preview: dr,
                      showPreview: !ve,
                      trees: rn,
                      actionTagIds: $t,
                      label: `Current ${De ? "occurrence" : d.one} tags`
                    }
                  ),
                  ve && /* @__PURE__ */ c(
                    "fieldset",
                    {
                      ref: $e,
                      disabled: Ee,
                      className: "dq-panel-section dq-tag-editor",
                      children: [
                        /* @__PURE__ */ c("legend", { className: "dq-eyebrow", children: [
                          "Edit ",
                          De ? "occurrence" : d.one,
                          " tags"
                        ] }),
                        /* @__PURE__ */ r(
                          Lt,
                          {
                            entityType: "tag",
                            values: Tt,
                            onChange: fn,
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
                              disabled: !G,
                              onClick: () => void ht(void 0, !0, !0),
                              children: "Save"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              disabled: !G,
                              onClick: () => void ht(void 0, !1, !0),
                              children: "Save & next"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              onClick: () => {
                                W(!1), requestAnimationFrame(() => {
                                  var f;
                                  return (f = ut.current) == null ? void 0 : f.focus();
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
                de(te) && $.performerFocus && /* @__PURE__ */ r(
                  Xo,
                  {
                    review: te,
                    performerId: $.performerFocus,
                    revision: Zt
                  }
                )
              ] }),
              /* @__PURE__ */ c("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ c("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  Ae && /* @__PURE__ */ c("p", { role: "alert", children: [
                    Ae,
                    " ",
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        disabled: Ee,
                        onClick: () => {
                          C ? kt(l, C).then(je).catch((f) => ce(gt(f))) : Le(j.current);
                        },
                        children: C ? "Reload tags" : "Retry queue"
                      }
                    )
                  ] }),
                  ae && /* @__PURE__ */ r("p", { role: "status", children: ae })
                ] }),
                !t && /* @__PURE__ */ r("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                C && /* @__PURE__ */ c("div", { className: "dq-panel-actions", "aria-busy": $n || void 0, children: [
                  /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      ref: ut,
                      className: "dq-button",
                      disabled: rt || !!q || !t || !G,
                      onClick: () => {
                        yt.current = [...G.ids], fn([...G.ids]), W(!0);
                      },
                      children: [
                        /* @__PURE__ */ r(La, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: rt || !!q,
                      onClick: () => void ht(),
                      children: [
                        /* @__PURE__ */ r(Da, { "aria-hidden": "true" }),
                        "Skip",
                        De ? " performer" : ` ${d.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              De && /* @__PURE__ */ c(
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
                        "aria-pressed": Bt === "items",
                        onClick: () => Rn("items"),
                        children: l === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": Bt === "performers",
                        onClick: () => Rn("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              De && Bt === "performers" ? /* @__PURE__ */ r(
                dc,
                {
                  ranking: (ot == null ? void 0 : ot.signature) === qe ? ot : null,
                  busy: It,
                  error: (Ie == null ? void 0 : Ie.signature) === qe ? Ie.message : "",
                  focus: $.performerFocus,
                  disabled: rt,
                  labels: d,
                  onFocus: Mn,
                  onMore: () => {
                    const f = xe.current;
                    f && nn(f, f.limit + Wr);
                  },
                  onRefresh: () => {
                    vt(null), nn(null, Wr);
                  }
                }
              ) : /* @__PURE__ */ r("div", { className: "dq-queue-list", ref: Sn, children: F.map((f) => {
                var I;
                const w = (C == null ? void 0 : C.key) === f.key;
                return /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: b(f),
                    "aria-label": b(f),
                    "aria-current": w ? "true" : void 0,
                    disabled: rt,
                    onClick: () => {
                      St(f), ce(""), T("");
                    },
                    children: [
                      /* @__PURE__ */ r(Ac, { media: f.media, kind: l }),
                      /* @__PURE__ */ c("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: h(f.media) }),
                        /* @__PURE__ */ c("span", { className: "dq-queue-row-meta", children: [
                          f.occurrence && /* @__PURE__ */ c(se, { children: [
                            /* @__PURE__ */ r(Hn, { performer: f.occurrence.performer }),
                            /* @__PURE__ */ r("span", { className: "dq-queue-row-performer", children: f.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ r("span", { className: "dq-queue-row-detail", children: [
                            f.media.date,
                            f.occurrence ? "" : (I = f.media.files[0]) != null && I.duration ? bo(f.media.files[0].duration) : ""
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
        De && /* @__PURE__ */ r(
          yo,
          {
            open: Ue,
            onClose: () => He(!1),
            criteria: gi,
            activeFilter: De.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (f) => {
              He(!1), gn({ performerFilter: f });
            }
          }
        ),
        Kt && /* @__PURE__ */ r(
          Ti,
          {
            actions: e.actions,
            trees: rn,
            isDisabled: (f) => Mt(f),
            onApply: (f, w) => {
              wt(!1), ht(f, w);
            },
            onClose: () => wt(!1)
          }
        )
      ]
    }
  );
}
function Rc(e) {
  var p, l, d;
  const [t, n] = N({}), [i, o] = N(""), s = (((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.annotations) ?? []).includes("tags") ? ((l = e == null ? void 0 : e.presentation) == null ? void 0 : l.annotationParents) ?? [] : [], a = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...s,
      ...((d = e == null ? void 0 : e.presentation) == null ? void 0 : d.binParents) ?? []
    ])
  ]);
  return z(() => {
    let g = !0;
    return n({}), o(""), Promise.all(
      JSON.parse(a).map(
        async (h) => [h, await Lr([h])]
      )
    ).then((h) => {
      g && n(Object.fromEntries(h));
    }).catch(() => {
      g && o(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      g = !1;
    };
  }, [a]), { ids: t, error: i };
}
function Ic(e, t, n) {
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
        (p) => {
          var l;
          return p !== a.id && ((l = n[p]) == null ? void 0 : l.includes(a.id));
        }
      )
    ) : []
  };
}
function Oc({
  videos: e,
  review: t,
  trees: n,
  disabled: i,
  onChoose: o
}) {
  var p, l, d;
  const s = new Set(
    (((p = t.presentation) == null ? void 0 : p.binParents) ?? []).flatMap(
      (g) => (n[g] ?? []).filter((h) => h !== g)
    )
  ), a = /* @__PURE__ */ new Map();
  for (const g of e)
    for (const h of g.tags ?? [])
      if (s.has(h.id)) {
        const b = a.get(h.id) ?? { name: h.name, count: 0 };
        b.count++, a.set(h.id, b);
      }
  return (d = (l = t.presentation) == null ? void 0 : l.binParents) != null && d.length ? /* @__PURE__ */ c("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ r("span", { children: "Tags on this page:" }),
    [...a].sort((g, h) => g[1].name.localeCompare(h[1].name)).map(([g, h]) => /* @__PURE__ */ c(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: i,
        onClick: () => o(g),
        children: [
          h.name,
          " (",
          h.count,
          ")"
        ]
      },
      g
    )),
    !a.size && /* @__PURE__ */ r("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function Mc(e, t) {
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
function co({
  draft: e,
  onChange: t,
  presentation: n = !0,
  queue: i = !0
}) {
  const [o, s] = N(!1), a = Me(e) === "tag" ? "tag" : he(e), p = a === "tag" ? "tags" : `${a}s`, l = Ea(
    a === "tag" ? void 0 : a,
    e.view.objectFilter
  ), d = e.view.filter, g = a === "tag" ? wo : a === "audio" ? mo : bi, h = a === "tag" ? vo : a === "audio" ? mi : Ir, b = (m) => t({
    ...e,
    view: { ...e.view, filter: { ...d, ...m } }
  }), y = a === "video" ? e.presentation ?? {} : {}, S = a !== "audio", q = (m) => t({ ...e, presentation: { ...y, ...m } });
  return /* @__PURE__ */ c(se, { children: [
    i && /* @__PURE__ */ c("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ r("legend", { children: "Queue" }),
      /* @__PURE__ */ c("label", { children: [
        "Search",
        /* @__PURE__ */ r(
          "input",
          {
            value: String(d.q ?? ""),
            onChange: (m) => b({ q: m.target.value })
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
              value: String(d.sort ?? "date"),
              onChange: (m) => b({ sort: m.target.value, sorts: void 0 }),
              children: [
                !g.some((m) => m.value === d.sort) && d.sort != null && /* @__PURE__ */ r("option", { value: String(d.sort), children: String(d.sort) }),
                g.map((m) => /* @__PURE__ */ r("option", { value: m.value, children: m.label }, m.value))
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
              value: String(d.direction ?? "desc"),
              onChange: (m) => b({ direction: m.target.value }),
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
              value: Number(d.perPage) || 40,
              onChange: (m) => b({
                perPage: Math.max(
                  1,
                  Math.min(1e3, Number(m.target.value) || 40)
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
              onChange: (m) => t({
                ...e,
                view: {
                  ...e.view,
                  startFrom: m.target.value
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
        p,
        " enter the queue."
      ] }),
      o && /* @__PURE__ */ r("div", { onKeyDown: (m) => m.stopPropagation(), children: /* @__PURE__ */ r(
        yo,
        {
          open: !0,
          onClose: () => s(!1),
          criteria: h,
          activeFilter: e.view.objectFilter,
          customSections: l ? [l] : void 0,
          supportsFilterExpressions: a !== "tag",
          subjectLabel: p,
          onApply: (m) => {
            t({ ...e, view: { ...e.view, objectFilter: m } }), s(!1);
          }
        }
      ) })
    ] }),
    n && /* @__PURE__ */ c(se, { children: [
      /* @__PURE__ */ r("h3", { children: "Appearance" }),
      /* @__PURE__ */ c("p", { className: "dq-editor-note", children: [
        "Choose how ",
        a === "tag" ? "tags" : `${p} and tags`,
        " appear while reviewing."
      ] }),
      /* @__PURE__ */ c("div", { className: "dq-field-grid", children: [
        To(e) && /* @__PURE__ */ c("label", { children: [
          "Preferred review layout",
          /* @__PURE__ */ c(
            "select",
            {
              value: e.view.reviewMode ?? "single",
              onChange: (m) => t({ ...e, view: { ...e.view, reviewMode: m.target.value } }),
              children: [
                /* @__PURE__ */ r("option", { value: "single", children: "Single video" }),
                /* @__PURE__ */ r("option", { value: "multiple", children: "Multiple videos" })
              ]
            }
          )
        ] }),
        !de(e) && S && /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: e.view.selectAllOnLoad ?? !1,
              onChange: (m) => t({ ...e, view: { ...e.view, selectAllOnLoad: m.target.checked ? !0 : void 0 } })
            }
          ),
          "Select all ",
          p,
          " on page load",
          a === "video" && /* @__PURE__ */ r("small", { children: " (multiple-videos layout)" })
        ] }),
        S && /* @__PURE__ */ c("label", { children: [
          "Preferred view",
          /* @__PURE__ */ r(
            "select",
            {
              value: a === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid",
              onChange: (m) => t({
                ...e,
                view: {
                  ...e.view,
                  displayMode: m.target.value
                }
              }),
              children: (a === "tag" ? ["grid", "list"] : ["grid", "wall"]).map((m) => /* @__PURE__ */ r("option", { children: m }, m))
            }
          )
        ] })
      ] }),
      a === "video" && /* @__PURE__ */ c(se, { children: [
        /* @__PURE__ */ r("h4", { children: "Card annotations" }),
        /* @__PURE__ */ r("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((m) => {
          const R = y.annotations ?? [];
          return /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: R.includes(m),
                onChange: (E) => q({
                  annotations: E.target.checked ? [...R, m] : R.filter((L) => L !== m)
                })
              }
            ),
            m
          ] }, m);
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
              onChange: (m) => q({ annotationParents: m }),
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
            onChange: (m) => q({ binParents: m }),
            allowCreate: !1
          }
        )
      ] })
    ] })
  ] });
}
const Qr = 180;
function lo(e) {
  return Me(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function uo(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Hr() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function fo(e) {
  const t = new URLSearchParams(window.location.search);
  Dr.forEach((i) => t.delete(i)), e ? t.set("review", e) : t.delete("review");
  const n = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${n ? `?${n}` : ""}`
  );
}
function $c(e) {
  return Xe({ ...e, page: 1 });
}
function oa(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function xt(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const aa = "data-quality.workspace-layout.v1", Di = 240, pi = 192, hi = 560;
function sa(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(hi, Math.max(pi, e)) : Di;
}
function Pc() {
  try {
    const e = JSON.parse(
      localStorage.getItem(aa) ?? "null"
    );
    return sa(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return Di;
  }
}
function Fc(e) {
  try {
    localStorage.setItem(
      aa,
      JSON.stringify({ sidebarWidth: e })
    );
  } catch {
  }
}
function ca(e) {
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
function la(e, t) {
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
function xc(e, t) {
  return e.mode === "REMOVE" ? `Remove ${t}` : e.mode === "REMOVE_TREE" ? `Remove ${t} tree` : la(e, t);
}
function Lc({
  onNavigate: e
}) {
  const [t, n] = N([]), [i] = N(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [o, s] = N(""), [a, p] = N(!0), [l, d] = N(""), [g, h] = N(!1), [b, y] = N(!1), [S, q] = N(!1), [m, R] = N(!1), [E, L] = N([]), [B, ne] = N(""), [M, $] = N(!0), [x, j] = N(""), [O, _] = N(""), [oe, F] = N(!1), [J, C] = N(!1), [X, re] = N(Hr), [Ce, ie] = N({}), [Ne, Dt] = N("name"), [_t, jt] = N("asc"), Ut = P(null), be = P(!1), [_e, Ee] = N(0), [Ze, ye] = N(!1), [et, Qe] = N(!1), [Ae, ce] = N(
    null
  ), ae = t.find((u) => u.id === X) ?? null, T = We(
    () => (Ae == null ? void 0 : Ae.id) === X && ae ? { ...ae, view: {
      ...ae.view,
      filter: Ae.view.filter,
      objectFilter: Ae.view.objectFilter,
      searchMode: Ae.view.searchMode,
      startFrom: Ae.view.startFrom
    } } : ae,
    [Ae, X, ae]
  ), G = T ? Me(T) : "video", je = Yn(G), ve = T ? de(T) : !1, W = G === "video" ? T : null, Tt = ve && !!(T != null && T.actions.some(dn)), fn = !!W || G === "audio" || Tt, [yt, ut] = N(null), Ge = (yt == null ? void 0 : yt.id) === (T == null ? void 0 : T.id) ? yt == null ? void 0 : yt.mode : (T == null ? void 0 : T.view.reviewMode) ?? "single", $e = ve || G === "audio" || G === "video" && Ge === "single", [Ue, He] = N(0), Kt = P(-1), wt = P(!1);
  z(() => {
    const u = () => {
      if (!$e && St.current) {
        wt.current = !0;
        return;
      }
      re(Hr()), $e || He((v) => v + 1);
    };
    return window.addEventListener("popstate", u), () => window.removeEventListener("popstate", u);
  }, [$e]);
  const Rt = je === "audio" ? b : g, k = G === "tag" ? "Tag" : je === "audio" ? "Audio" : "Video", Q = G === "tag" ? S : Rt, ke = We(() => {
    const u = _t === "asc" ? 1 : -1;
    return [...t].sort((v, A) => {
      if (Ne === "count") {
        const D = Ce[v.id], Y = Ce[A.id], U = typeof D == "number", ee = typeof Y == "number";
        if (U !== ee) return U ? -1 : 1;
        if (U && ee && D !== Y)
          return (D - Y) * u;
      }
      return v.name.localeCompare(A.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * u;
    });
  }, [_t, Ne, Ce, t]), tt = P(
    null
  ), Pe = Rc(W), [ue, Tn] = N({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [_r, Yt] = N({
    page: 1,
    perPage: 40
  }), [Ke, ft] = N({ items: [], totalCount: 0 }), [te, nt] = N(!1), [Ye, pn] = N(""), [Bt, Rn] = N(!1), [ot, jr] = N(!1), [xe, at] = N(() => /* @__PURE__ */ new Set()), vt = P(xe);
  vt.current = xe;
  const It = P(/* @__PURE__ */ new Map()), Xt = (T == null ? void 0 : T.view.selectAllOnLoad) === !0, [Ie, Ve] = N(null), me = P(Ie);
  me.current = Ie;
  const [qe, Zt] = N(!1), st = P(qe);
  st.current = qe;
  const hn = P(null), [en, pt] = N(!1), [Ot, Gn] = N("grid"), [rt, Gt] = N(Qr), [Le, mn] = N(Pc), [le, tn] = N(!1), St = P(!1), [cr, ht] = N(""), [In, Mt] = N(""), [On, Vt] = N(""), [Se, Vn] = N(null), [lr, De] = N(""), [gn, nn] = N(!1), [bn, Jn] = N({}), yn = P(/* @__PURE__ */ new Map()), Oe = P(null), Mn = P(null), wn = !!T && $e, [vn, dr] = N({ top: 0, bottom: 0 });
  jn(() => {
    if (!wn) return;
    const u = () => {
      const A = Mn.current;
      if (!A) return;
      const D = Math.round(A.getBoundingClientRect().top + window.scrollY), Y = A.closest("main"), U = Y ? Math.round(parseFloat(getComputedStyle(Y).paddingBottom) || 0) : 0;
      dr(
        (ee) => ee.top === D && ee.bottom === U ? ee : { top: D, bottom: U }
      );
    };
    u();
    const v = typeof ResizeObserver > "u" ? null : new ResizeObserver(u);
    return v == null || v.observe(document.body), window.addEventListener("resize", u), () => {
      v == null || v.disconnect(), window.removeEventListener("resize", u);
    };
  }, [wn]);
  const rn = P(null), $t = P(0), Sn = P(0), Nn = P(null), on = P(null), En = sr(
    We(
      () => (W == null ? void 0 : W.actions.flatMap(
        (u) => u.steps.flatMap((v) => v.tagIds)
      )) ?? [],
      [W == null ? void 0 : W.actions]
    )
  );
  function $n(u) {
    const v = sa(u);
    mn(v), Fc(v);
  }
  function Ur(u) {
    const v = u.shiftKey ? 40 : 16;
    let A = null;
    u.key === "ArrowLeft" && (A = Le + v), u.key === "ArrowRight" && (A = Le - v), u.key === "Home" && (A = pi), u.key === "End" && (A = hi), A !== null && (u.preventDefault(), u.stopPropagation(), $n(A));
  }
  z(() => {
    if (!In) return;
    const u = window.setTimeout(() => Mt(""), 4e3);
    return () => window.clearTimeout(u);
  }, [In]), z(() => {
    const u = W ? Oi(W.view.objectFilter) : [];
    if (Jn({}), !u.length) return;
    const v = new AbortController();
    let A = !0;
    return Promise.all(
      u.map(async (D) => {
        var Y;
        try {
          const U = await Z(`/api/tags/${D}`, {
            signal: v.signal
          });
          return (Y = U.name) != null && Y.trim() ? [String(D), U.name] : null;
        } catch {
          return null;
        }
      })
    ).then((D) => {
      A && Jn(
        Object.fromEntries(D.filter((Y) => Y !== null))
      );
    }), () => {
      A = !1, v.abort();
    };
  }, [W == null ? void 0 : W.id, W == null ? void 0 : W.view.objectFilter]);
  const ur = We(
    () => W ? Mi(
      W.view.objectFilter,
      bn
    ) : (T == null ? void 0 : T.view.objectFilter) ?? {},
    [bn, T, W]
  ), zn = cn(async () => {
    p(!0), d("");
    try {
      const u = await ts();
      n(u.reviews), s(u.storageKey), h(u.canWriteVideos ?? u.canWrite), y(u.canWriteAudios ?? !1), q(u.canWriteTags ?? !1), R(u.canReadTagGroups ?? !1), $(u.canConfigure ?? !0), j(u.storageNotice ?? ""), X && !u.reviews.some((v) => v.id === X) && (re(""), fo(""));
    } catch (u) {
      d(
        u instanceof Error ? u.message : "Could not load reviews."
      );
    } finally {
      p(!1);
    }
  }, [X]);
  z(() => {
    if (!m) {
      L([]), ne("");
      return;
    }
    const u = new AbortController();
    return ne(""), fs(u.signal).then(L).catch((v) => {
      u.signal.aborted || ne(
        v instanceof Error ? v.message : "Could not load tag groups."
      );
    }), () => u.abort();
  }, [m]), z(() => {
    zn();
  }, []), z(() => {
    if (X || t.length === 0) return;
    const u = new AbortController();
    ie({});
    for (const v of t)
      (de(v) ? $i(v, u.signal).then((D) => (D == null ? void 0 : D.length) === 0 ? { items: [], totalCount: 0 } : Xn(Pi(v, D), { ...v.view.filter, page: 1, perPage: 1 }, u.signal)) : Me(v) === "tag" ? Qi(
        v,
        Xe({ ...v.view.filter, page: 1, perPage: 1 }),
        u.signal
      ) : Xn(
        v,
        Xe({ ...v.view.filter, page: 1, perPage: 1 }),
        u.signal
      )).then((D) => {
        u.signal.aborted || ie((Y) => ({
          ...Y,
          [v.id]: D.totalCount
        }));
      }).catch(() => {
        u.signal.aborted || ie((D) => ({ ...D, [v.id]: null }));
      });
    return () => u.abort();
  }, [X, t]), jn(() => {
    var u;
    X || a || !be.current || (be.current = !1, (u = Ut.current) == null || u.focus());
  }, [X, a]);
  const Pn = P(0), qn = cn(async () => {
    const u = ++Pn.current;
    Vn(null), De("");
    try {
      const v = await (Tt ? jo(je) : _o(je));
      u === Pn.current && Vn(v);
    } catch (v) {
      if (u !== Pn.current) return;
      Vn(null), De(
        "Tag assessment setup could not be checked. " + (v instanceof Error ? v.message : "Request failed.")
      );
    }
  }, [Tt, je]);
  z(() => {
    qn();
  }, [qn]);
  const Jt = cn(
    async (u, v, A = !1, D = !1) => {
      var lt, we;
      const Y = ++$t.current;
      (lt = Nn.current) == null || lt.abort();
      const U = new AbortController();
      Nn.current = U, v = Xe(v);
      const ee = Number(v.page);
      A && (v = { ...v, page: 1 }), Tn(v), jr(A), nt(!0), pn("");
      try {
        const Te = (Wt) => Me(u) === "tag" ? Qi(
          u,
          Wt,
          U.signal
        ) : Xn(
          u,
          Wt,
          U.signal
        );
        let Fe = await Te(v);
        const qt = Math.max(
          1,
          Math.ceil(Fe.totalCount / Number(v.perPage))
        ), xn = A ? qt : Math.min(ee, qt);
        return Number(v.page) !== xn && (v = { ...v, page: xn }, Fe = await Te(v)), Y === $t.current && (((we = on.current) == null ? void 0 : we.page) !== xn && (on.current = {
          page: xn,
          ids: new Set(Fe.items.map((Wt) => Wt.id))
        }), ft(Fe), D && pe(
          () => new Set(Fe.items.map((Wt) => Wt.id))
        ), Tn(v), Yt(v)), Fe;
      } catch (Te) {
        throw Y === $t.current && pn(
          Te instanceof Error ? Te.message : "Could not load the review queue."
        ), Te;
      } finally {
        Y === $t.current && nt(!1);
      }
    },
    []
  );
  z(() => {
    var v;
    if (Sn.current += 1, Kt.current = -1, $t.current += 1, (v = Nn.current) == null || v.abort(), C(!1), _(""), F(!1), at(/* @__PURE__ */ new Set()), It.current.clear(), Ve(null), Zt(!1), tn(!1), St.current = !1, ht(""), Mt(""), Vt(""), ft({ items: [], totalCount: 0 }), on.current = null, Rn(!1), !T || $e) {
      nt(!1);
      return;
    }
    let u = !0;
    return nt(!0), (async () => {
      let A = ae ?? T;
      ce(null);
      let D = null;
      const Y = new URLSearchParams(window.location.search);
      if (Me(T) === "video" && Dr.some((we) => Y.has(we)))
        try {
          const we = A;
          D = fi(we, Y);
          const Te = Ft(we, D.query);
          (D.query.startFrom !== (we.view.startFrom ?? "end") || !rr(
            JSON.parse(Pt(Te)),
            JSON.parse(Pt(Ft(we, _n(we))))
          )) && (A = Te, ce(A));
        } catch (we) {
          Rn(!0), pn(we instanceof Error ? we.message : "Could not read review URL."), nt(!1);
          return;
        }
      let U = null;
      try {
        U = await is(o, T.id);
      } catch (we) {
        u && (F(!0), _(
          we instanceof Error ? we.message : "Could not load progress."
        ));
      }
      if (!u) return;
      const ee = (U == null ? void 0 : U.signature) === Pt(A) ? U : null, lt = D ? D.query.filter : ee ? Xe(ee.filter) : $c(A.view.filter);
      Tn(lt), Gn(
        ee ? uo(ee.displayMode, Me(T)) : lo(T)
      ), Gt(
        ee ? ee.cardSize ?? Qr : Qr
      );
      try {
        const we = await Jt(
          A,
          lt,
          D ? D.startAtEnd : !ee && A.view.startFrom !== "beginning",
          A.view.selectAllOnLoad === !0
        );
        if (!u) return;
        const Te = Gi(
          we.items.map((Fe) => Fe.id),
          (ee == null ? void 0 : ee.focusedId) ?? null,
          (ee == null ? void 0 : ee.index) ?? 0
        );
        Ve(Te), V(Te);
      } catch {
      }
      u && (Kt.current = Ue, C(!0));
    })(), () => {
      var A;
      u = !1, Sn.current++, $t.current++, (A = Nn.current) == null || A.abort();
    };
  }, [T == null ? void 0 : T.id, $e, Ue]), z(() => {
    !W || $e || !J || te || Ye || le || wt.current || Kt.current !== Ue || Zn(W.id, {
      filter: ue,
      objectFilter: W.view.objectFilter,
      searchMode: W.view.searchMode,
      startFrom: W.view.startFrom ?? "end"
    });
  }, [W, $e, J, te, Ye, ue, le, Ue]);
  const fe = We(
    () => Ke.items.map((u) => u.id),
    [Ke.items]
  );
  z(() => {
    if (!J || !T || !o || te || Ye || le || (Ae == null ? void 0 : Ae.id) === T.id || oe)
      return;
    const u = {
      version: 1,
      signature: Pt(T),
      filter: ue,
      focusedId: Ie,
      index: Math.max(0, fe.indexOf(Ie ?? -1)),
      displayMode: Ot,
      cardSize: rt,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        o + ":progress:" + T.id,
        JSON.stringify(u)
      );
    } catch {
    }
    if (O) return;
    let v = !0;
    const A = window.setTimeout(() => {
      os(o, T.id, u).catch((D) => {
        v && _(
          "Progress is kept in this browser, but account sync failed. " + (D instanceof Error ? D.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      v = !1, window.clearTimeout(A);
    };
  }, [
    J,
    o,
    T,
    te,
    Ye,
    le,
    ue,
    Ie,
    fe,
    Ot,
    rt,
    Ae,
    O,
    oe
  ]);
  const fr = Ke.items.find((u) => u.id === Ie) ?? null, f = G === "video" ? fr : null;
  qe && f && (hn.current = f);
  const w = f ?? (qe ? hn.current : null), I = Vi(xe, Ie), K = fe.length > 0 && fe.every((u) => xe.has(u)), H = xe.size > 0 ? `${xe.size} selected ${G}${xe.size === 1 ? "" : "s"}` : Ie == null ? `no ${G}` : `focused ${G}`, V = cn((u, v = !0) => {
    u != null && window.requestAnimationFrame(() => {
      if (Qa(document.activeElement)) return;
      const A = yn.current.get(u);
      A == null || A.focus({ preventScroll: !0 }), v && (A == null || A.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  z(() => {
    J && !st.current && V(me.current);
  }, [J, V]), z(() => {
    te || !fe.length || (me.current == null || !fe.includes(me.current)) && (Ve(fe[0]), st.current || V(fe[0]));
  }, [V, fe, te]);
  const pe = cn(
    (u) => {
      at((v) => {
        const A = u(v);
        for (const D of /* @__PURE__ */ new Set([...v, ...A]))
          v.has(D) !== A.has(D) && It.current.set(
            D,
            (It.current.get(D) ?? 0) + 1
          );
        return A;
      });
    },
    []
  ), Je = cn(
    (u) => {
      if (!fe.length) return;
      const v = Math.max(
        0,
        fe.indexOf(me.current ?? fe[0])
      ), A = fe[Math.max(0, Math.min(fe.length - 1, v + u))];
      Ve(A), st.current || V(A);
    },
    [V, fe]
  ), Nt = cn(
    async (u) => {
      const v = "steps" in u ? u.steps.length > 0 : u.effect.mode !== "SKIP", A = "effect" in u && u.effect.mode === "SET_TAG_GROUP" ? u.effect.tagGroupId : null, D = A != null && (!m || !E.some((Re) => Re.id === A)), Y = "effect" in u && v && !m, U = Vi(
        vt.current,
        me.current
      );
      if (!T || St.current || te || Ye) return;
      const ee = v && !Q ? `${k} write permission is required to apply ${u.label}.` : Y || D ? `${u.label} needs a tag group that is unavailable.` : dn(u) && (Se == null ? void 0 : Se.kind) !== "ready" ? `Set up tag assessments before applying ${u.label}.` : U.length ? "" : `Select or focus a ${G} before applying ${u.label}.`;
      if (ee) {
        Vt(ee);
        return;
      }
      const lt = ++Sn.current, we = T.id, Te = [...fe], Fe = Ke, qt = me.current, xn = new Set(vt.current), Wt = new Map(
        U.map((Re) => [Re, It.current.get(Re) ?? 0])
      ), Ln = () => lt === Sn.current && T.id === we;
      St.current = !0, tn(!0), ht(
        vt.current.size ? `${U.length} selected ${G}s` : `the focused ${G}`
      ), Mt(""), Vt("");
      const ji = Fe.items.filter(
        (Re) => !U.includes(Re.id)
      ), ha = ji.map((Re) => Re.id), Ui = Ji(
        Te,
        ha,
        qt,
        U.includes(qt ?? -1)
      );
      ft({
        items: ji,
        totalCount: Fe.totalCount
      }), at((Re) => {
        const dt = new Set(Re);
        for (const Ct of U) dt.delete(Ct);
        return dt;
      }), Ve(Ui), st.current || V(Ui);
      let Kr = !1;
      try {
        if ("effect" in u ? await Ns(u, U) : await Ko(je, u, U), Kr = !0, !Ln()) return;
        at((Re) => {
          const dt = new Set(Re);
          for (const Ct of U)
            (It.current.get(Ct) ?? 0) === Wt.get(Ct) && dt.delete(Ct);
          return dt;
        }), Mt(
          `${u.label}: ${U.length} ${G}${U.length === 1 ? "" : "s"} ${v ? "updated" : "skipped"}.`
        );
      } catch (Re) {
        if (!Ln()) return;
        ft(Fe), at((dt) => {
          const Ct = new Set(dt);
          for (const mt of U)
            xn.has(mt) && (It.current.get(mt) ?? 0) === Wt.get(mt) && Ct.add(mt);
          return Ct;
        }), Ve(qt), st.current || V(qt), Vt(
          Re instanceof Error ? Re.message : "Action failed."
        );
      }
      try {
        if (await ms(u), !Ln()) return;
        const Re = new Set(U), dt = Xt && Te.length > 0 && Te.every((At) => Re.has(At)), Ct = await Jt(T, ue, !1, dt);
        if (!Ln()) return;
        let mt = Ct.items.map((At) => At.id);
        const gr = on.current, ma = (gr == null ? void 0 : gr.page) === Number(ue.page) && mt.some((At) => gr.ids.has(At)), ga = (T.view.startFrom ?? "end") !== "beginning";
        if (Ct.totalCount > 0 && Number(ue.page) > 1 && (!mt.length || ga && !ma)) {
          const At = Math.max(1, Number(ue.page) - 1), br = { ...ue, page: At };
          Tn(br), mt = (await Jt(
            T,
            br,
            !1,
            dt
          )).items.map((Br) => Br.id), at(
            (Br) => new Set([...Br].filter((ba) => mt.includes(ba)))
          );
          const Bi = mt.at(-1) ?? null;
          Ve(Bi), st.current || V(Bi);
        } else {
          at(
            (br) => new Set([...br].filter((Ki) => mt.includes(Ki)))
          );
          const At = Ji(
            Te,
            mt,
            qt,
            Kr && U.includes(qt ?? -1)
          );
          Ve(At), st.current && At == null && Zt(!1), st.current || V(At);
        }
      } catch (Re) {
        Ln() && Vt(
          (dt) => `${dt ? `${dt} ` : ""}${Kr ? "The action completed, but " : ""}the queue could not be refreshed. ${Re instanceof Error ? Re.message : "Refresh failed."}`
        );
      } finally {
        Ln() && (St.current = !1, tn(!1), ht(""), wt.current && (wt.current = !1, re(Hr()), He((Re) => Re + 1)));
      }
    },
    [
      Q,
      m,
      E,
      G,
      Se,
      Jt,
      ue,
      V,
      fe,
      Ke,
      te,
      Ye,
      T
    ]
  );
  function ze() {
    var A;
    if (Ot === "list") return 1;
    const u = (A = Oe.current) == null ? void 0 : A.firstElementChild, v = u ? getComputedStyle(u).gridTemplateColumns : "";
    return Math.max(1, v.split(" ").filter(Boolean).length);
  }
  const ct = P(() => {
  });
  ct.current = (u) => {
    var U;
    if ($e || u.defaultPrevented || u.repeat || u.ctrlKey || u.altKey || u.metaKey || Ze) return;
    const v = u.target, A = v instanceof Node && ((U = Mn.current) == null ? void 0 : U.contains(v)) === !0, D = v === document.body || v === document.documentElement;
    if (!A && !D) return;
    if (en) {
      u.key === "Escape" && (xt(u), pt(!1));
      return;
    }
    if (qe && u.key === "Escape") {
      xt(u), Zt(!1), V(me.current);
      return;
    }
    if (!Wa(v)) return;
    const Y = za(v);
    if (u.key === "Escape") {
      xt(u), pe(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!qe && u.key === " " && Y) {
      xt(u), Ie != null && pe((ee) => Sr(ee, Ie));
      return;
    }
    if (!(le || te) && !qe && u.key === "Enter" && Ie != null && Y) {
      xt(u), G === "tag" ? window.open(`/tag/${Ie}`, "_blank", "noopener,noreferrer") : Zt(!0);
      return;
    }
  }, z(() => {
    const u = (v) => ct.current(v);
    return document.addEventListener("keydown", u), () => document.removeEventListener("keydown", u);
  }, []);
  const Be = P(
    () => {
    }
  );
  Be.current = (u) => {
    var U;
    if ($e || Ze || qe || en || le || te || !fe.length || u.defaultPrevented || u.repeat || u.ctrlKey || u.altKey || u.metaKey)
      return;
    const v = u.target, A = v instanceof Node && ((U = Mn.current) == null ? void 0 : U.contains(v)) === !0, D = v === document.body || v === document.documentElement;
    if (!A && !D || !u.key.startsWith("Arrow") || !Ha(v)) return;
    const Y = Ya(u.key, ze());
    Y && (u.preventDefault(), A ? u.stopImmediatePropagation() : u.stopPropagation(), Je(Y));
  }, z(() => {
    const u = (v) => Be.current(v);
    return document.addEventListener("keydown", u), () => document.removeEventListener("keydown", u);
  }, []);
  const zt = le || te && !J, ge = Bn();
  Ai({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!T && !$e && !Ze && !qe && !en && !Ye && (Ke.items.length > 0 || te || le),
    actionCount: (T == null ? void 0 : T.actions.length) ?? 0,
    onAction: (u) => {
      const v = T == null ? void 0 : T.actions[u];
      v && Nt(v);
    },
    onFind: () => pt(!0),
    onSelectAll: () => pe((u) => zi(u, fe))
  }), z(() => pt(!1), [$e, qe, T == null ? void 0 : T.id]);
  function Et(u) {
    const v = "steps" in u ? u.steps.length > 0 : u.effect.mode !== "SKIP", A = "effect" in u && u.effect.mode === "SET_TAG_GROUP" ? u.effect.tagGroupId : null, D = A != null && !E.some((Y) => Y.id === A);
    return le || te || !!Ye || v && !Q || "effect" in u && v && (!m || D) || dn(u) && (Se == null ? void 0 : Se.kind) !== "ready" || !I.length;
  }
  function an(u) {
    ut(null), Ee(0), re(u), fo(u);
  }
  function pr() {
    be.current = !0, ie({}), an("");
  }
  async function Fn(u) {
    if (!o) return !1;
    const v = u.map(_c);
    try {
      await rs(o, v);
    } catch (D) {
      throw D;
    }
    n(v), X && !v.some((D) => D.id === X) && an("");
    const A = v.find((D) => D.id === X);
    return A && ut(null), A && ae && JSON.stringify(A) !== JSON.stringify(ae) && (A.view.displayMode !== ae.view.displayMode && Gn(lo(A)), Pt(A) !== Pt(ae) && (ce(null), Me(A) === "video" && Zn(A.id, {
      filter: Xe(A.view.filter),
      objectFilter: A.view.objectFilter,
      searchMode: A.view.searchMode,
      startFrom: A.view.startFrom ?? "end"
    }), $e || sn(
      A,
      Xe({ ...A.view.filter, page: ue.page })
    ))), !0;
  }
  if (a)
    return /* @__PURE__ */ r(po, { label: "Loading reviews…" });
  if (l)
    return /* @__PURE__ */ c(se, { children: [
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          onClick: () => void Wc().catch(
            (u) => d(
              "Could not export browser reviews. " + (u instanceof Error ? u.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ r(
        ho,
        {
          message: l,
          onRetry: () => void zn()
        }
      )
    ] });
  const hr = /* @__PURE__ */ c(se, { children: [
    x && /* @__PURE__ */ r("p", { className: "dq-status", children: x }),
    fn && (Se == null ? void 0 : Se.kind) === "missing" && /* @__PURE__ */ c("div", { role: "status", className: "dq-status", children: [
      Se.message,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: gn,
          onClick: () => {
            nn(!0), De(""), (Tt ? ys(je) : bs(je)).then(qn).catch(
              (u) => De(
                `Could not create the ${Tt ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (u instanceof Error ? u.message : "Request failed.")
              )
            ).finally(() => nn(!1));
          },
          children: gn ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    fn && ((Se == null ? void 0 : Se.kind) === "incompatible" || lr) && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(ei, {}),
      lr || (Se == null ? void 0 : Se.message),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: gn,
          onClick: () => {
            nn(!0), qn().finally(
              () => nn(!1)
            );
          },
          children: gn ? "Checking…" : "Check again"
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
            const u = localStorage.getItem("page-videos") ?? "[]", v = URL.createObjectURL(
              new Blob([u], { type: "application/json" })
            ), A = document.createElement("a");
            A.href = v, A.download = "data-quality-unassigned-legacy-reviews.json", A.click(), URL.revokeObjectURL(v);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    O && /* @__PURE__ */ c("p", { role: "alert", children: [
      O,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: () => {
            _(""), F(!1);
          },
          children: oe ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] })
  ] });
  return /* @__PURE__ */ c(
    "div",
    {
      ref: Mn,
      className: `data-quality-page${wn ? " dq-page-fit" : ""}`,
      style: wn ? {
        "--dq-fit-top": `${vn.top}px`,
        "--dq-fit-bottom": `${vn.bottom}px`
      } : void 0,
      children: [
        wn && T ? /* @__PURE__ */ r(
          Tc,
          {
            review: T,
            canWrite: ve ? S : Rt,
            canAssess: (Se == null ? void 0 : Se.kind) === "ready" && Rt,
            onBusy: tn,
            editRequest: _e,
            renderRuleEditor: (u, v, A) => /* @__PURE__ */ r(da, { workspace: !0, draft: u, entityTypeLocked: !0, tagGroups: E, saving: A, setDraft: (D) => v(D), onSave: () => {
            }, onCancel: () => {
            } }),
            onSaveDefaults: M ? (u) => Fn(t.map((v) => v.id === u.id ? u : v)) : void 0,
            pageControls: {
              onBack: pr,
              onManage: () => {
                Qe(!1), ye(!0);
              },
              manageDisabled: !M,
              onGrid: W ? () => ut({ id: W.id, mode: "multiple" }) : void 0,
              notices: hr
            }
          },
          T.id
        ) : /* @__PURE__ */ c(se, { children: [
          /* @__PURE__ */ c("header", { className: "data-quality-header", children: [
            T && /* @__PURE__ */ r(
              "button",
              {
                className: "dq-header-action",
                type: "button",
                "aria-label": "All reviews",
                title: "All reviews",
                disabled: le,
                onClick: pr,
                children: /* @__PURE__ */ r(Or, {})
              }
            ),
            /* @__PURE__ */ c("div", { className: "dq-header-copy", children: [
              /* @__PURE__ */ r("h1", { children: (T == null ? void 0 : T.name) ?? "Data Quality" }),
              (T == null ? void 0 : T.description) && /* @__PURE__ */ r("p", { className: "dq-header-description", children: T.description })
            ] }),
            T && ae && /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-header-action",
                "aria-label": "Edit review",
                title: "Edit review",
                disabled: le || te || !M,
                onClick: () => {
                  Qe(!0), ye(!0);
                },
                children: /* @__PURE__ */ r(Mr, {})
              }
            ),
            /* @__PURE__ */ r(
              "button",
              {
                className: "dq-header-action",
                type: "button",
                "aria-label": "Manage reviews",
                title: "Manage reviews",
                disabled: le || te || !M,
                onClick: () => {
                  Qe(!1), ye(!0);
                },
                children: /* @__PURE__ */ r(_a, {})
              }
            )
          ] }),
          hr,
          W && /* @__PURE__ */ c("label", { className: "dq-layout-control", children: [
            "Review layout",
            /* @__PURE__ */ c(
              "select",
              {
                "aria-label": "Review layout",
                value: Ge,
                disabled: le || te || Ze,
                onChange: (u) => ut({ id: W.id, mode: u.target.value }),
                children: [
                  /* @__PURE__ */ r("option", { value: "single", children: "Single video" }),
                  /* @__PURE__ */ r("option", { value: "multiple", children: "Multiple videos" })
                ]
              }
            )
          ] }),
          T && ae && /* @__PURE__ */ c("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
            /* @__PURE__ */ r(
              "div",
              {
                className: `dq-native-toolbar-host${zt ? " dq-native-toolbar-disabled" : ""}`,
                "aria-disabled": zt || void 0,
                inert: zt ? !0 : void 0,
                children: /* @__PURE__ */ r(
                  er,
                  {
                    filter: Ye ? _r : ue,
                    onFilterChange: Wn,
                    totalCount: Ke.totalCount,
                    sortOptions: G === "tag" ? wo : bi,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: Ot,
                    onDisplayModeChange: (u) => Gn(uo(u, G)),
                    availableDisplayModes: G === "tag" ? ["grid", "list"] : ["grid", "wall"],
                    zoomLevel: (rt - 225) / 50,
                    onZoomChange: (u) => Gt(Math.round(225 + u * 50)),
                    cardSizeEntityType: G === "tag" ? "tags" : "videos",
                    criteriaDefinitions: G === "tag" ? vo : Ir,
                    customFieldEntityType: G === "video" ? "video" : void 0,
                    objectFilter: ur,
                    onObjectFilterChange: (u) => {
                      zt || (tt.current = G === "video" ? Jo(
                        u,
                        bn,
                        T.view.objectFilter
                      ) : u);
                    },
                    showPagingControls: !1
                  }
                )
              }
            ),
            (Ae == null ? void 0 : Ae.id) === X && /* @__PURE__ */ c("div", { className: "dq-review-defaults", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  "aria-label": "Save changes to review filters",
                  title: "Save changes to review filters",
                  disabled: le || te || !M,
                  onClick: mr,
                  children: /* @__PURE__ */ r(No, {})
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  "aria-label": "Reset to default review filters",
                  title: "Reset to default review filters",
                  disabled: le || te,
                  onClick: it,
                  children: /* @__PURE__ */ r(Eo, {})
                }
              )
            ] })
          ] }),
          T ? /* @__PURE__ */ c(se, { children: [
            W && Pe.error && /* @__PURE__ */ r("p", { role: "alert", children: Pe.error }),
            W && /* @__PURE__ */ r(
              Oc,
              {
                videos: Ke.items,
                review: W,
                trees: Pe.ids,
                disabled: le || te,
                onChoose: (u) => {
                  const v = Mc(W, u);
                  ce(v), sn(v, { ...ue, page: 1 });
                }
              }
            ),
            On && !qe && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ r(ei, {}),
              On
            ] }),
            In && /* @__PURE__ */ r("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: In }),
            _i("top"),
            /* @__PURE__ */ c(
              "div",
              {
                className: "dq-workspace",
                style: {
                  "--dq-sidebar-width": `${Le}px`
                },
                children: [
                  /* @__PURE__ */ c("main", { children: [
                    te && !Ke.items.length && /* @__PURE__ */ r(po, { label: "Loading review queue…" }),
                    Ye && !te && /* @__PURE__ */ r(
                      ho,
                      {
                        message: Ye,
                        retryLabel: Bt ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (Bt && ae && Me(ae) === "video") {
                            const u = _n(ae);
                            Zn(ae.id, { ...u, filter: { ...u.filter, page: void 0 } }), He((v) => v + 1);
                            return;
                          }
                          Jt(
                            T,
                            ue,
                            ot,
                            Xt
                          ).catch(() => {
                          });
                        }
                      }
                    ),
                    !le && !te && !Ye && !Ke.items.length && /* @__PURE__ */ c("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ r(Er, {}),
                      /* @__PURE__ */ c("p", { children: [
                        "No ",
                        G,
                        "s match this review."
                      ] })
                    ] }),
                    !!Ke.items.length && /* @__PURE__ */ r("div", { ref: Oe, children: /* @__PURE__ */ r(
                      "div",
                      {
                        className: Ot === "list" ? "dq-tag-list" : "dq-grid",
                        style: {
                          "--dq-card-width": `${rt}px`
                        },
                        children: Ke.items.map(pa)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ r(
                    "div",
                    {
                      className: "dq-workspace-separator",
                      role: "separator",
                      tabIndex: 0,
                      "aria-label": "Resize review sidebar",
                      "aria-orientation": "vertical",
                      "aria-valuemin": pi,
                      "aria-valuemax": hi,
                      "aria-valuenow": Le,
                      "aria-valuetext": `${Le} pixels wide`,
                      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                      onPointerDown: (u) => {
                        rn.current = {
                          pointerId: u.pointerId,
                          startX: u.clientX,
                          startWidth: Le
                        }, u.currentTarget.setPointerCapture(u.pointerId);
                      },
                      onPointerMove: (u) => {
                        const v = rn.current;
                        (v == null ? void 0 : v.pointerId) === u.pointerId && u.currentTarget.hasPointerCapture(u.pointerId) && $n(
                          v.startWidth + v.startX - u.clientX
                        );
                      },
                      onPointerUp: () => {
                        rn.current = null;
                      },
                      onPointerCancel: () => {
                        rn.current = null;
                      },
                      onKeyDown: Ur,
                      onDoubleClick: () => $n(Di),
                      children: /* @__PURE__ */ r("span", {})
                    }
                  ),
                  /* @__PURE__ */ c("aside", { className: "dq-actions", children: [
                    /* @__PURE__ */ c(
                      "button",
                      {
                        type: "button",
                        className: "dq-selection-toggle",
                        "aria-keyshortcuts": "Control+A Meta+A",
                        disabled: !fe.length,
                        onClick: () => pe(
                          (u) => zi(u, fe)
                        ),
                        children: [
                          K ? "Clear selection" : "Select all on page",
                          /* @__PURE__ */ r("kbd", { "aria-hidden": "true", children: ge.selectAll })
                        ]
                      }
                    ),
                    /* @__PURE__ */ r("strong", { children: xe.size > 0 ? H : Ie == null ? "Nothing to apply to" : `Applies to the ${H}` }),
                    T.actions.map((u, v) => {
                      const A = "effect" in u && u.effect.mode === "SET_TAG_GROUP" ? u.effect.tagGroupId : null, D = A != null ? E.find((Y) => Y.id === A) : void 0;
                      return /* @__PURE__ */ c(
                        "button",
                        {
                          type: "button",
                          disabled: Et(u),
                          onClick: () => void Nt(u),
                          children: [
                            /* @__PURE__ */ c("span", { className: "dq-action-copy", children: [
                              /* @__PURE__ */ r("span", { className: "dq-action-label", children: u.label }),
                              "effect" in u ? /* @__PURE__ */ r("small", { children: u.effect.mode === "SKIP" ? "Skip" : u.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : D ? `Assign ${D.name}` : "Unavailable tag group" }) : u.steps.length ? /* @__PURE__ */ r("span", { className: "dq-action-steps", children: u.steps.flatMap(
                                (Y, U) => Y.tagIds.map((ee, lt) => {
                                  const we = En[ee] === void 0 ? "Tag" : En[ee] ?? "Unavailable tag", Te = la(Y, we), Fe = xc(Y, we);
                                  return /* @__PURE__ */ r(
                                    "span",
                                    {
                                      className: "dq-step-summary",
                                      "data-step-tone": ca(Y.mode),
                                      "aria-label": Fe,
                                      title: `Step ${U + 1}: ${Fe}`,
                                      children: Te
                                    },
                                    `${U}-${ee}-${lt}`
                                  );
                                })
                              ) }) : /* @__PURE__ */ r("small", { children: "Skip" })
                            ] }),
                            ge.action(v) && /* @__PURE__ */ r("kbd", { children: ge.action(v) })
                          ]
                        },
                        u.id
                      );
                    }),
                    !T.actions.length && /* @__PURE__ */ r("p", { children: "This review has no actions." }),
                    T.actions.length > 0 && /* @__PURE__ */ r(Vo, { onClick: () => pt(!0) }),
                    !Q && /* @__PURE__ */ c("p", { children: [
                      k,
                      " write permission is required to apply actions."
                    ] }),
                    G === "tag" && B && /* @__PURE__ */ c("p", { children: [
                      "Tag groups are unavailable. ",
                      B
                    ] }),
                    le && /* @__PURE__ */ c("p", { role: "status", children: [
                      /* @__PURE__ */ r(Co, { className: "dq-spin" }),
                      " Applying action to",
                      " ",
                      cr,
                      "…"
                    ] }),
                    /* @__PURE__ */ r("p", { className: "dq-shortcuts", children: [
                      "←→↑↓ move",
                      "space select",
                      `enter ${G === "tag" ? "open" : "preview"}`,
                      "action keys apply",
                      `${ge.find} find action`,
                      `${ge.selectAll} toggle shown`,
                      "Esc clear"
                    ].join(" · ") })
                  ] })
                ]
              }
            ),
            _i("bottom")
          ] }) : t.length ? /* @__PURE__ */ c(
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
                      (u) => Ce[u.id] !== void 0
                    ) ? t.some((u) => Ce[u.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
                  ] }),
                  /* @__PURE__ */ c("div", { className: "dq-review-browser-sort", children: [
                    /* @__PURE__ */ c("label", { children: [
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                      /* @__PURE__ */ c(
                        "select",
                        {
                          "aria-label": "Sort reviews by",
                          value: Ne,
                          onChange: (u) => Dt(
                            u.target.value
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
                          (u) => u === "asc" ? "desc" : "asc"
                        ),
                        children: /* @__PURE__ */ r(
                          wi,
                          {
                            className: _t === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                          }
                        )
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ r("div", { className: "dq-review-browser-list", children: ke.map((u) => {
                  const v = Ce[u.id], A = Me(u), D = A === "tag" ? "tag" : de(u) ? bt(Yn(A)).queue : bt(Yn(A)).one;
                  return /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      disabled: le,
                      onClick: () => an(u.id),
                      children: [
                        /* @__PURE__ */ c("span", { className: "dq-review-browser-summary", children: [
                          /* @__PURE__ */ c("span", { className: "dq-review-title", children: [
                            /* @__PURE__ */ r(Li, { entityType: A }),
                            /* @__PURE__ */ r("strong", { children: u.name })
                          ] }),
                          /* @__PURE__ */ r(
                            "span",
                            {
                              className: "dq-review-count",
                              "aria-label": v === void 0 ? `Counting matching ${D}s` : v === null ? `Matching ${D} count unavailable` : `${v.toLocaleString()} matching ${v === 1 ? D : `${D}s`}`,
                              children: v === void 0 ? "…" : v === null ? "—" : v.toLocaleString()
                            }
                          )
                        ] }),
                        u.description && /* @__PURE__ */ r("span", { className: "dq-review-rule-name", children: u.description })
                      ]
                    },
                    u.id
                  );
                }) })
              ]
            }
          ) : /* @__PURE__ */ c("div", { className: "dq-empty", children: [
            /* @__PURE__ */ r(Er, {}),
            /* @__PURE__ */ r("p", { children: "No saved reviews are available in this browser." })
          ] })
        ] }),
        qe && w && W && /* @__PURE__ */ r(
          Bc,
          {
            video: w,
            review: W,
            targetLabel: H,
            pending: le,
            refreshing: te || !!Ye,
            error: On,
            canWrite: g,
            assessmentReady: (Se == null ? void 0 : Se.kind) === "ready",
            selected: xe.has(w.id),
            hasPrevious: fe.indexOf(w.id) > 0,
            hasNext: fe.indexOf(w.id) >= 0 && fe.indexOf(w.id) < fe.length - 1,
            onToggleSelected: () => pe((u) => Sr(u, w.id)),
            onPrevious: () => Je(-1),
            onNext: () => Je(1),
            onClose: () => {
              Zt(!1), V(me.current);
            },
            onAction: Nt,
            findOpen: en,
            onFindOpenChange: pt
          }
        ),
        en && T && !$e && !qe && /* @__PURE__ */ r(
          Ti,
          {
            actions: T.actions,
            tagGroups: E,
            isDisabled: Et,
            canStay: !1,
            onApply: (u) => {
              pt(!1), Nt(u);
            },
            onClose: () => pt(!1)
          }
        ),
        Ze && /* @__PURE__ */ r(
          Gc,
          {
            reviews: t,
            activeReview: ae,
            tagGroups: E,
            initialEdit: et,
            onSave: Fn,
            onChoose: an,
            onEditWorkspace: (u) => {
              u !== X && an(u), ut({ id: u, mode: "single" }), Ee((v) => v + 1), ye(!1);
            },
            onClose: () => {
              ye(!1), et && V(me.current, !1);
            }
          }
        )
      ]
    }
  );
  async function sn(u, v, A = !1) {
    const D = me.current, Y = Math.max(0, fe.indexOf(D ?? -1));
    try {
      const U = Jt(
        u,
        v,
        A,
        u.view.selectAllOnLoad === !0
      ), ee = $t.current, lt = await U;
      if (ee !== $t.current) return;
      const we = lt.items.map((Fe) => Fe.id);
      at(
        (Fe) => new Set([...Fe].filter((qt) => we.includes(qt)))
      );
      const Te = Gi(we, D, Y);
      Ve(Te), st.current || V(Te, !1);
    } catch {
    }
  }
  function Wn(u) {
    const v = tt.current;
    if (tt.current = null, zt || !T || !ae) return;
    const A = v ?? T.view.objectFilter, D = rr(
      A,
      ae.view.objectFilter
    ) ? ae.view.objectFilter : A, Y = Xe({ ...u, page: 1 }), U = {
      ...T,
      view: {
        ...T.view,
        filter: Y,
        objectFilter: D
      }
    }, ee = Pt(U) !== Pt(ae), lt = ee ? U : ae;
    ce(ee ? U : null), Mt(ee ? "" : "Review queue defaults restored."), sn(lt, Y, !0);
  }
  function it() {
    if (le || te || !ae) return;
    tt.current = null;
    const u = Xe({
      ...ae.view.filter,
      page: 1
    });
    ce(null), Mt("Review queue defaults restored."), sn(
      ae,
      u,
      ae.view.startFrom !== "beginning"
    );
  }
  function mr() {
    le || te || !T || !ae || !M || Fn(
      t.map(
        (u) => u.id === X ? {
          ...u,
          view: {
            ...T.view,
            filter: { ...ue, page: 1 }
          }
        } : u
      )
    ).then(() => {
      ce(null), Mt("Queue saved to this review.");
    }).catch(
      (u) => Vt(
        u instanceof Error ? u.message : "Could not save queue."
      )
    );
  }
  function fa() {
    at(/* @__PURE__ */ new Set()), It.current.clear(), Ve(null);
  }
  function _i(u) {
    return T ? /* @__PURE__ */ r(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: le || te,
        "aria-label": `Review queue pagination ${u}`,
        children: /* @__PURE__ */ r(
          qa,
          {
            filter: {
              ...ue,
              page: Number(ue.page) || 1,
              perPage: Number(ue.perPage) || 40
            },
            totalCount: Ke.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${u}`,
            onFilterChange: (v) => {
              le || te || v.page === Number(ue.page) || Dc(
                { ...ue, page: v.page },
                T,
                (A, D) => Jt(A, D, !1, Xt),
                fa
              );
            }
          }
        )
      }
    ) : null;
  }
  function pa(u) {
    var A, D, Y;
    if (G === "tag") {
      const U = u;
      return /* @__PURE__ */ r(
        jc,
        {
          tag: U,
          displayMode: Ot === "list" ? "list" : "grid",
          focused: U.id === Ie,
          selected: xe.has(U.id),
          setRef: (ee) => {
            ee ? yn.current.set(U.id, ee) : yn.current.delete(U.id);
          },
          onFocus: () => Ve(U.id),
          onToggle: () => {
            pe((ee) => Sr(ee, U.id)), V(U.id, !1);
          },
          onOpen: () => window.open(`/tag/${U.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        U.id
      );
    }
    const v = u;
    return /* @__PURE__ */ r(
      Uc,
      {
        video: Ic(v, W, Pe.ids),
        showTagBins: ((D = (A = W == null ? void 0 : W.presentation) == null ? void 0 : A.annotations) == null ? void 0 : D.includes("tags")) && !!((Y = W.presentation.annotationParents) != null && Y.length),
        displayMode: Ot,
        focused: v.id === Ie,
        selected: xe.has(v.id),
        setRef: (U) => {
          U ? yn.current.set(v.id, U) : yn.current.delete(v.id);
        },
        onFocus: () => Ve(v.id),
        onToggle: () => pe((U) => Sr(U, v.id)),
        onPreview: () => {
          Ve(v.id), Zt(!0);
        },
        onNavigate: e
      },
      v.id
    );
  }
}
function Dc(e, t, n, i) {
  i(), n(t, e).catch(() => {
  });
}
function Sr(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function _c(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function jc({
  tag: e,
  displayMode: t,
  focused: n,
  selected: i,
  setRef: o,
  onFocus: s,
  onToggle: a,
  onOpen: p,
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
      onClick: (d) => {
        s(), d.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${n ? "focused" : ""} ${i ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ r(
        Aa,
        {
          tag: e,
          selected: i,
          onSelect: a,
          onClick: p,
          onNavigate: l
        }
      ) : /* @__PURE__ */ c("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            "aria-label": i ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": i,
            onClick: (d) => {
              d.stopPropagation(), a();
            },
            children: i ? "✓" : ""
          }
        ),
        /* @__PURE__ */ r("button", { type: "button", className: "dq-tag-list-name", onClick: p, children: e.name }),
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
function Uc({
  video: e,
  showTagBins: t,
  displayMode: n,
  focused: i,
  selected: o,
  setRef: s,
  onFocus: a,
  onToggle: p,
  onPreview: l,
  onNavigate: d
}) {
  var q, m;
  const g = oa(e), h = P(null), b = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, y = !!(b.date || b.studioName), S = !!(b.performers.length || b.tags.length);
  return jn(() => {
    const R = h.current;
    if (!R) return;
    const E = R.querySelector(
      `a[href="/video/${e.id}"]`
    ), L = R.querySelector(".card-title"), B = `dq-card-title-${e.id}`;
    L && (L.id = B), E && (E.target = "_blank", E.rel = "noreferrer", E.removeAttribute("aria-label"), E.setAttribute("aria-labelledby", B), E.classList.add("dq-card-link"));
    const ne = R.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    ne && ne.setAttribute(
      "aria-label",
      o ? `Deselect ${g}` : `Select ${g}`
    );
    const M = R.querySelector(
      'button[title="Quick View"]'
    );
    M && M.setAttribute("aria-label", `Preview ${g}`);
  }), /* @__PURE__ */ c(
    "article",
    {
      ref: (R) => {
        h.current = R, s(R);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${g}${o ? ", selected" : ""}`,
      onFocus: a,
      onClick: (R) => {
        a(), R.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${y ? "has-card-metadata" : "no-card-metadata"} ${S ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ r(
          ka,
          {
            video: b,
            selected: o,
            onSelect: p,
            onNavigate: d,
            onQuickView: l,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ c("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (q = e.tags) == null ? void 0 : q.map((R) => /* @__PURE__ */ r("span", { children: R.name }, R.id)),
          !((m = e.tags) != null && m.length) && /* @__PURE__ */ r("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ r(Kc, { video: e })
      ]
    }
  );
}
function Kc({ video: e }) {
  const t = P(null), n = P(null), [i, o] = N(!1), [s, a] = N(!1), [p, l] = N(!1);
  return z(() => {
    const d = t.current;
    if (!d || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      o(!0), a(!0);
      return;
    }
    const g = new IntersectionObserver(
      ([b]) => o(b.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), h = new IntersectionObserver(
      ([b]) => a(b.isIntersecting && b.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return g.observe(d), h.observe(d), () => {
      g.disconnect(), h.disconnect();
    };
  }, [e.id, e.files.length]), z(() => {
    if (!i) {
      l(!1);
      return;
    }
    const d = new AbortController();
    return Z(hs(e.id), {
      signal: d.signal
    }).then((g) => {
      d.signal.aborted || l(g.available === !0);
    }).catch(() => {
      d.signal.aborted || l(!1);
    }), () => d.abort();
  }, [i, e.id]), z(() => {
    const d = n.current;
    d && (s ? Promise.resolve(d.play()).catch(() => {
    }) : d.pause());
  }, [p, s]), /* @__PURE__ */ r("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: p && /* @__PURE__ */ r(
    "video",
    {
      ref: n,
      src: ps(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Bc({
  video: e,
  review: t,
  targetLabel: n,
  pending: i,
  refreshing: o,
  error: s,
  canWrite: a,
  assessmentReady: p,
  selected: l,
  hasPrevious: d,
  hasNext: g,
  onToggleSelected: h,
  onPrevious: b,
  onNext: y,
  onClose: S,
  onAction: q,
  findOpen: m,
  onFindOpenChange: R
}) {
  const E = P(null), L = P(null), B = e.files[0], ne = oa(e), M = Bn(), $ = (O) => i || o || "steps" in O && O.steps.length > 0 && !a || dn(O) && !p;
  Ai({
    surface: "overlay",
    enabled: !m,
    actionCount: t.actions.length,
    onAction: (O) => {
      const _ = t.actions[O];
      _ && q(_);
    },
    onFind: () => R(!0)
  }), z(() => {
    var _;
    const O = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (_ = E.current) == null || _.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = O;
    };
  }, []);
  function x(O) {
    var F, J, C;
    if (O.key !== "Tab") return;
    const _ = [
      ...((F = E.current) == null ? void 0 : F.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((X) => X.offsetParent !== null);
    if (!_.length) {
      O.preventDefault(), (J = E.current) == null || J.focus();
      return;
    }
    const oe = _.indexOf(
      document.activeElement
    );
    O.shiftKey && oe <= 0 ? (O.preventDefault(), (C = _.at(-1)) == null || C.focus()) : !O.shiftKey && oe === _.length - 1 && (O.preventDefault(), _[0].focus());
  }
  function j(O) {
    if (m || O.defaultPrevented || O.ctrlKey || O.metaKey || O.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const _ = O.key === "ArrowLeft" || O.key === "ArrowRight";
    if (O.altKey && !_) return;
    const oe = L.current, F = O.currentTarget.querySelector("video");
    if (O.key === "Enter" || O.key === "Escape")
      O.repeat || S();
    else if (O.key === " " && oe)
      O.repeat || oe.toggle();
    else if (_ && oe)
      oe.seekBy(
        (O.key === "ArrowLeft" ? -1 : 1) * (O.shiftKey ? 5 : O.altKey ? 10 : 60)
      );
    else if ((O.key === "," || O.key === ".") && oe) {
      const J = [B == null ? void 0 : B.duration, F == null ? void 0 : F.duration].find(
        (X) => X != null && Number.isFinite(X) && X > 0
      ) ?? 0, C = e.parentVideoId != null ? (e.clipEndSec ?? J) - (e.clipStartSec ?? 0) : J;
      Number.isFinite(C) && C > 0 && oe.seekBy((O.key === "," ? -1 : 1) * C * 0.1);
    } else if (O.key.toLowerCase() === "n" || O.key.toLowerCase() === "m")
      !O.repeat && !i && !o && (O.key.toLowerCase() === "n" && d && b(), O.key.toLowerCase() === "m" && g && y());
    else if (O.key === "ArrowUp" && F)
      F.volume = Math.min(1, F.volume + 0.1);
    else if (O.key === "ArrowDown" && F)
      F.volume = Math.max(0, F.volume - 0.1);
    else return;
    xt(O);
  }
  return /* @__PURE__ */ c(
    "div",
    {
      ref: E,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${ne}`,
      className: "dq-preview",
      onKeyDown: x,
      onKeyDownCapture: j,
      onMouseDown: (O) => {
        O.target === O.currentTarget && S();
      },
      children: [
        /* @__PURE__ */ c("div", { className: "dq-preview-shell", children: [
          /* @__PURE__ */ c("header", { "data-review-player-controls": !0, children: [
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                "aria-label": "Previous review video",
                disabled: !d || i || o,
                onClick: b,
                children: /* @__PURE__ */ r(Or, {})
              }
            ),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                "aria-label": "Next review video",
                disabled: !g || i || o,
                onClick: y,
                children: /* @__PURE__ */ r(wi, {})
              }
            ),
            /* @__PURE__ */ c("div", { children: [
              /* @__PURE__ */ r("h2", { children: ne }),
              /* @__PURE__ */ c("p", { children: [
                "Actions target ",
                n,
                "."
              ] })
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: h,
                disabled: o,
                children: l ? "Selected" : "Select"
              }
            ),
            /* @__PURE__ */ r(
              "a",
              {
                href: `/video/${e.id}`,
                target: "_blank",
                rel: "noreferrer",
                className: "dq-details-link",
                "aria-label": `Open ${ne} details in new tab`,
                title: "Open video details in new tab",
                children: /* @__PURE__ */ r(qo, {})
              }
            ),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: S,
                "aria-label": "Close review preview",
                children: /* @__PURE__ */ r(Ao, {})
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: B ? /* @__PURE__ */ r(
            go,
            {
              autostart: !0,
              streamUrl: ai("video", e.id),
              posterUrl: Hi(e),
              format: B.format,
              audioCodec: B.audioCodec,
              duration: B.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onPlaybackControlRegister: (O) => (L.current = O, () => {
                L.current === O && (L.current = null);
              }),
              videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
              clip: e.parentVideoId != null ? {
                start: e.clipStartSec ?? 0,
                end: e.clipEndSec,
                loop: !1
              } : void 0
            }
          ) : /* @__PURE__ */ r("img", { src: Hi(e), alt: "" }) }),
          s && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: s }),
          /* @__PURE__ */ c("p", { className: "dq-editor-note", children: [
            "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · action keys apply · ",
            M.find,
            " find action · Enter/Esc close"
          ] }),
          /* @__PURE__ */ c("footer", { "data-review-player-controls": !0, children: [
            t.actions.length > 0 && /* @__PURE__ */ r(Vo, { onClick: () => R(!0) }),
            t.actions.map((O, _) => /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                disabled: $(O),
                onClick: () => void q(O),
                children: [
                  M.action(_) && /* @__PURE__ */ r("kbd", { children: M.action(_) }),
                  O.label
                ]
              },
              O.id
            ))
          ] })
        ] }),
        m && /* @__PURE__ */ r(
          Ti,
          {
            actions: t.actions,
            isDisabled: $,
            canStay: !1,
            onApply: (O) => {
              R(!1), q(O);
            },
            onClose: () => R(!1)
          }
        )
      ]
    }
  );
}
function Gc({
  reviews: e,
  activeReview: t,
  tagGroups: n,
  initialEdit: i = !1,
  onEditWorkspace: o,
  onSave: s,
  onChoose: a,
  onClose: p
}) {
  const [l, d] = N(
    () => i && t ? structuredClone(t) : null
  ), [g, h] = N(""), [b, y] = N(!1), [S, q] = N(
    i && t != null
  ), m = P(null);
  z(() => {
    var x, j;
    const M = document.activeElement, $ = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (j = (x = m.current) == null ? void 0 : x.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || j.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = $, M == null || M.focus({ preventScroll: !0 });
    };
  }, []);
  function R(M) {
    var j, O, _;
    if (M.defaultPrevented) {
      M.stopPropagation();
      return;
    }
    if (M.key === "Escape") {
      xt(M), b || p();
      return;
    }
    if (M.key !== "Tab") {
      M.stopPropagation();
      return;
    }
    const $ = [
      ...((j = m.current) == null ? void 0 : j.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((oe) => oe.offsetParent !== null);
    if (!$.length) {
      xt(M), (O = m.current) == null || O.focus();
      return;
    }
    const x = $.indexOf(
      document.activeElement
    );
    M.shiftKey && x <= 0 ? (xt(M), (_ = $.at(-1)) == null || _.focus()) : !M.shiftKey && x === $.length - 1 ? (xt(M), $[0].focus()) : M.stopPropagation();
  }
  function E(M, $ = !!M) {
    q($), d(
      M ? structuredClone(M) : {
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
    ), h("");
  }
  async function L() {
    if (b) return;
    if (!l || qr(l)) {
      h(l ? qr(l) : "Choose a review.");
      return;
    }
    const M = { ...l, name: l.name.trim() }, $ = e.some((x) => x.id === M.id) ? e.map((x) => x.id === M.id ? M : x) : [...e, M];
    y(!0), h("");
    try {
      if (!await s($)) throw new Error("Could not save reviews.");
      !e.some((x) => x.id === M.id) && M.entityType !== "tag" ? o(M.id) : (a(M.id), p());
    } catch (x) {
      h(
        "Could not save reviews. Your edits are still open. " + (x instanceof Error ? x.message : "Retry saving.")
      );
    } finally {
      y(!1);
    }
  }
  async function B(M) {
    if (!b) {
      y(!0), h("");
      try {
        if (!await s(M)) throw new Error("Could not save reviews.");
      } catch ($) {
        h(
          $ instanceof Error ? $.message : "Could not save reviews."
        );
      } finally {
        y(!1);
      }
    }
  }
  async function ne(M) {
    var x;
    if (b) return;
    const $ = (x = M.target.files) == null ? void 0 : x[0];
    if (M.target.value = "", !!$) {
      if ($.size > 2e6) {
        h("Review files must be smaller than 2 MB.");
        return;
      }
      y(!0), h("");
      try {
        const j = or(await $.text());
        if (!await s(ti(e, j)))
          throw new Error("Could not save reviews.");
      } catch (j) {
        h(
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
      ref: m,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: R,
      children: /* @__PURE__ */ c("div", { className: "dq-manager", children: [
        /* @__PURE__ */ c("header", { children: [
          /* @__PURE__ */ c("div", { children: [
            /* @__PURE__ */ r("h2", { children: l ? e.some((M) => M.id === l.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ r("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: b,
              onClick: p,
              children: /* @__PURE__ */ r(Ao, {})
            }
          )
        ] }),
        g && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: g }),
        /* @__PURE__ */ r("fieldset", { disabled: b, className: "dq-manager-content", children: l ? /* @__PURE__ */ r(
          da,
          {
            setup: l.entityType !== "tag" && !e.some((M) => M.id === l.id),
            draft: l,
            entityTypeLocked: S,
            tagGroups: n,
            saving: b,
            setDraft: d,
            onSave: () => void L(),
            onCancel: p
          }
        ) : /* @__PURE__ */ c(se, { children: [
          /* @__PURE__ */ c("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: () => {
              const M = URL.createObjectURL(new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })), $ = document.createElement("a");
              $.href = M, $.download = "data-quality-reviews.json", $.click(), URL.revokeObjectURL(M);
            }, children: "Export reviews" }),
            /* @__PURE__ */ c(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => E(),
                children: [
                  /* @__PURE__ */ r(ja, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ c("label", { className: "dq-button", children: [
              /* @__PURE__ */ r(Ua, {}),
              " Import reviews",
              /* @__PURE__ */ r(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: ne
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-review-list", children: e.map((M) => /* @__PURE__ */ c("article", { children: [
            /* @__PURE__ */ c("div", { children: [
              /* @__PURE__ */ c("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ r(Li, { entityType: Me(M) }),
                /* @__PURE__ */ r("strong", { children: M.name })
              ] }),
              /* @__PURE__ */ r("p", { children: M.description || "No description" })
            ] }),
            /* @__PURE__ */ c("button", { type: "button", onClick: () => M.entityType === "tag" || Me(M) === "video" && M.view.reviewMode === "multiple" ? E(M) : o(M.id), children: [
              /* @__PURE__ */ r(Mr, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: () => E({
                  ...structuredClone(M),
                  id: crypto.randomUUID(),
                  name: `${M.name} copy`
                }, !0),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${M.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${M.name}”?`) && B(
                    e.filter(($) => $.id !== M.id)
                  );
                },
                children: /* @__PURE__ */ r(ko, {})
              }
            )
          ] }, M.id)) })
        ] }) })
      ] })
    }
  );
}
function da({
  workspace: e = !1,
  setup: t = !1,
  draft: n,
  entityTypeLocked: i,
  tagGroups: o,
  saving: s = !1,
  setDraft: a,
  onSave: p,
  onCancel: l
}) {
  const [d, g] = N("Review"), h = Me(n), b = de(n), y = (m) => {
    if (!(i || m === h)) {
      if (m === "performerOccurrence" || m === "audioPerformerOccurrence") {
        a({
          id: n.id,
          entityType: m,
          name: n.name,
          description: n.description,
          view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "end" },
          actions: [],
          occurrence: { targetMode: "all", performerIds: [], performerFilter: {}, condition: "any", conditionTagIds: [], tagIds: [], multiple: !0 }
        });
        return;
      }
      if (m === "audio") {
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
        m === "tag" ? {
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
  }, S = P(/* @__PURE__ */ new WeakMap()), q = (m) => {
    let R = S.current.get(m);
    return R || (R = crypto.randomUUID(), S.current.set(m, R)), R;
  };
  return /* @__PURE__ */ c("div", { className: "dq-editor", children: [
    /* @__PURE__ */ r("div", { className: "dq-editor-nav", children: /* @__PURE__ */ r(
      Ca,
      {
        tabs: (t ? ["Review"] : e ? ["Review", ...h === "video" ? ["Appearance"] : [], "Actions", ...b ? ["Tag choices"] : []] : b ? ["Review", "Queue", "Actions", ...n.occurrence.tagIds.length ? ["Tag choices"] : []] : h === "audio" ? ["Review", "Queue", "Actions"] : ["Review", "Queue", "Appearance", "Actions"]).map((m) => ({
          key: m,
          label: m,
          count: m === "Actions" ? n.actions.length : void 0,
          disabled: s
        })),
        activeTab: d,
        onTabChange: g
      }
    ) }),
    /* @__PURE__ */ c("div", { className: "dq-editor-body", children: [
      /* @__PURE__ */ c("section", { hidden: d !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ r("h3", { children: "Review details" }),
        /* @__PURE__ */ r("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ c("label", { children: [
          "Entity type",
          /* @__PURE__ */ c(
            "select",
            {
              "aria-label": "Entity type",
              value: h,
              disabled: i,
              onChange: (m) => y(m.target.value),
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
              onChange: (m) => a({ ...n, name: m.target.value })
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
              onChange: (m) => a({ ...n, description: m.target.value })
            }
          )
        ] }),
        b && !t && /* @__PURE__ */ r(
          Es,
          {
            review: n,
            onChange: a
          }
        )
      ] }),
      !e && !t && /* @__PURE__ */ c("section", { hidden: d !== "Queue", className: "dq-editor-section", children: [
        /* @__PURE__ */ r(co, { draft: n, onChange: a, presentation: !1 }),
        b && /* @__PURE__ */ r(Yi, { review: n, onChange: a })
      ] }),
      !t && b && /* @__PURE__ */ r("section", { hidden: d !== "Tag choices", className: "dq-editor-section", children: /* @__PURE__ */ r(Yi, { review: n, onChange: a, choices: !0 }) }),
      !t && h !== "audio" && !b && (!e || h === "video") && /* @__PURE__ */ r("section", { hidden: d !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ r(co, { draft: n, onChange: a, queue: !1 }) }),
      !t && /* @__PURE__ */ r("section", { hidden: d !== "Actions", className: "dq-editor-section", children: h === "tag" ? /* @__PURE__ */ r(
        Jc,
        {
          draft: n,
          saving: s,
          tagGroups: o,
          setDraft: a
        }
      ) : /* @__PURE__ */ r(
        Vc,
        {
          draft: n,
          saving: s,
          stepKey: q,
          rememberStepKey: (m, R) => S.current.set(m, q(R)),
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
            const m = URL.createObjectURL(
              new Blob([JSON.stringify([n], null, 2)], {
                type: "application/json"
              })
            ), R = document.createElement("a");
            R.href = m, R.download = "data-quality-review.json", R.click(), URL.revokeObjectURL(m);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ r("button", { className: "dq-button", type: "button", onClick: l, children: "Cancel" }),
      /* @__PURE__ */ r("button", { className: "dq-button primary", type: "button", onClick: p, children: t ? "Create & configure" : "Save review" })
    ] })
  ] });
}
function ua({
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
function Vc({
  draft: e,
  saving: t,
  stepKey: n,
  rememberStepKey: i,
  setDraft: o
}) {
  const [s, a] = N(!1), [p, l] = N(null), d = P(null), g = ir(), h = () => {
    a(!1), requestAnimationFrame(() => {
      var y;
      return (y = d.current) == null ? void 0 : y.focus();
    });
  }, b = (y, S) => o({
    ...e,
    actions: e.actions.map(
      (q, m) => m === y ? S : q
    )
  });
  return /* @__PURE__ */ c(se, { children: [
    /* @__PURE__ */ r("h3", { children: "Actions" }),
    de(e) && /* @__PURE__ */ c("p", { children: [
      "Actions apply only to the active performer in this ",
      bt(he(e)).one,
      ". Set performer matching in the review filters below. Save review keeps those criteria with this rule."
    ] }),
    /* @__PURE__ */ r("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails. Removing tags and descendants never removes a tag the same action adds." }),
    /* @__PURE__ */ r("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ r(
      Yr,
      {
        items: e.actions,
        getKey: (y) => y.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (y) => o({ ...e, actions: y }),
        renderItem: (y, { index: S, dragHandleProps: q, isOver: m }) => /* @__PURE__ */ c(
          "fieldset",
          {
            className: m ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ c("legend", { children: [
                "Action ",
                S + 1
              ] }),
              /* @__PURE__ */ c("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    ...q,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${S + 1}`,
                    children: /* @__PURE__ */ r(vi, {})
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
                        ...e.actions.slice(0, S + 1),
                        {
                          ...structuredClone(y),
                          id: crypto.randomUUID(),
                          label: y.label + " copy"
                        },
                        ...e.actions.slice(S + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ r(
                ua,
                {
                  action: y,
                  onChange: (R) => b(S, R)
                }
              ),
              /* @__PURE__ */ r(
                Yr,
                {
                  items: y.steps,
                  getKey: n,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (R) => b(S, { ...y, steps: R }),
                  renderItem: (R, E) => /* @__PURE__ */ r(
                    zc,
                    {
                      dragHandleProps: E.dragHandleProps,
                      saving: t,
                      isOver: E.isOver,
                      step: R,
                      index: E.index,
                      onChange: (L) => {
                        i(L, R), b(S, {
                          ...y,
                          steps: y.steps.map(
                            (B, ne) => ne === E.index ? L : B
                          )
                        });
                      },
                      onRemove: () => b(S, {
                        ...y,
                        steps: y.steps.filter(
                          (L, B) => B !== E.index
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
                    onClick: () => b(S, {
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
                        (R, E) => E !== S
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
          ref: d,
          className: "dq-button",
          type: "button",
          "aria-expanded": s,
          "aria-controls": s ? g : void 0,
          disabled: t,
          onClick: () => {
            l(null), a(!s);
          },
          children: "Add actions from parent tags…"
        }
      ),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-editor-note", children: (p == null ? void 0 : p.actions) === e.actions ? `Added ${p.count} action${p.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    s && /* @__PURE__ */ r(
      Ms,
      {
        id: g,
        review: e,
        disabled: t,
        onAdd: (y) => {
          const S = [...e.actions, ...y];
          o({ ...e, actions: S }), l({ actions: S, count: y.length }), h();
        },
        onCancel: h
      }
    )
  ] });
}
function Jc({
  draft: e,
  saving: t,
  tagGroups: n,
  setDraft: i
}) {
  const o = (s, a) => i({
    ...e,
    actions: e.actions.map(
      (p, l) => l === s ? a : p
    )
  });
  return /* @__PURE__ */ c(se, { children: [
    /* @__PURE__ */ r("h3", { children: "Actions" }),
    /* @__PURE__ */ r("p", { children: "Each action assigns one tag group, clears the group, or skips." }),
    /* @__PURE__ */ r("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ r(
      Yr,
      {
        items: e.actions,
        getKey: (s) => s.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (s) => i({ ...e, actions: s }),
        renderItem: (s, { index: a, dragHandleProps: p, isOver: l }) => /* @__PURE__ */ c(
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
                    ...p,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${a + 1}`,
                    children: /* @__PURE__ */ r(vi, {})
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
                ua,
                {
                  action: s,
                  onChange: (d) => o(a, d)
                }
              ),
              /* @__PURE__ */ c("label", { children: [
                "Action effect",
                /* @__PURE__ */ c(
                  "select",
                  {
                    "aria-label": "Tag group action",
                    value: s.effect.mode === "SET_TAG_GROUP" ? `group:${s.effect.tagGroupId}` : s.effect.mode,
                    onChange: (d) => {
                      const g = d.target.value;
                      o(a, {
                        ...s,
                        effect: g === "SKIP" ? { mode: "SKIP" } : g === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : {
                          mode: "SET_TAG_GROUP",
                          tagGroupId: Number(g.slice(6))
                        }
                      });
                    },
                    children: [
                      /* @__PURE__ */ r("option", { value: "SKIP", children: "Skip" }),
                      /* @__PURE__ */ r("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
                      s.effect.mode === "SET_TAG_GROUP" && !n.some(
                        (d) => d.id === s.effect.tagGroupId
                      ) && /* @__PURE__ */ r(
                        "option",
                        {
                          value: `group:${s.effect.tagGroupId}`,
                          disabled: !0,
                          children: "Unavailable tag group"
                        }
                      ),
                      n.map((d) => /* @__PURE__ */ r("option", { value: `group:${d.id}`, children: d.name }, d.id))
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
                      (d, g) => g !== a
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
function zc({
  step: e,
  index: t,
  dragHandleProps: n,
  saving: i,
  isOver: o,
  onChange: s,
  onRemove: a
}) {
  const p = ca(e.mode);
  return /* @__PURE__ */ c(
    "div",
    {
      className: o ? "dq-action-step dq-drag-over" : "dq-action-step",
      "data-step-tone": p,
      children: [
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            ...n,
            disabled: i,
            className: "dq-drag-handle",
            "aria-label": `Reorder step ${t + 1}`,
            children: /* @__PURE__ */ r(vi, {})
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
        /* @__PURE__ */ r("button", { type: "button", "aria-label": "Remove step", onClick: a, children: /* @__PURE__ */ r(ko, {}) })
      ]
    }
  );
}
async function Wc() {
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
function po({ label: e }) {
  return /* @__PURE__ */ c("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ r(Co, { className: "dq-spin" }),
    e
  ] });
}
function ho({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ c("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ r(ei, {}),
    /* @__PURE__ */ r("p", { children: e }),
    /* @__PURE__ */ r("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const el = { components: { DataQualityPage: Lc } };
export {
  Lc as DataQualityPage,
  el as default,
  rr as objectFiltersEqual
};
