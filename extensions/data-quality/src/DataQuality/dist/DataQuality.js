import { jsxs as l, Fragment as pe, jsx as n } from "react/jsx-runtime";
import { useRef as M, useLayoutEffect as ir, useMemo as Pe, useState as q, useEffect as Q, useId as Lt, useSyncExternalStore as $a, useCallback as rr } from "react";
import { useKeySequence as Zo, EntityReferenceMultiSelector as ar, SortableList as Ma, EntityDetailTabs as es, TagBadge as ts, DetailListToolbar as hn, AUDIO_CRITERIA as xa, VIDEO_CRITERIA as Ei, PERFORMER_CRITERIA as Ci, NarrativeText as rs, AUDIO_SORT_OPTIONS as ns, VIDEO_SORT_OPTIONS as Fa, AudioPlayer as is, VideoPlayer as Pa, formatDuration as La, FilterDialog as as, getResolutionLabel as os, TAG_CRITERIA as ss, TAG_SORT_OPTIONS as cs, TagTile as ls, VideoCard as ds } from "@cove/runtime/components";
import { Search as Jn, Pencil as yn, Ban as di, Pin as us, Plus as Ai, GripVertical as Da, AlertTriangle as Wr, Copy as fs, Trash2 as _a, ChevronDown as ja, X as zn, Tags as ps, Headphones as Ua, Film as jn, ChevronLeft as ki, RectangleHorizontal as ms, LayoutGrid as Ti, MoreHorizontal as hs, ChevronRight as Ri, Layers as gs, RefreshCw as bs, Flag as ui, Users as ws, Save as Ga, RotateCcw as Ba, ExternalLink as Ka, Tag as ys, SkipForward as vs, Check as Va, Settings as Ns, Loader2 as qs, Upload as Ss, List as Es, Grid3X3 as Cs } from "@cove/runtime/lucide-react";
import { extensionFetch as As } from "@cove/runtime/api";
const Ii = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, Oi = Object.keys(
  Ii
);
function gn(e) {
  return e === "excludes" || e === "excludesAll";
}
function $i(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
const ks = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function we(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function fn(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function qe(e) {
  return fn(Fe(e));
}
function Ts(e) {
  return Fe(e) === "video";
}
function Fe(e) {
  return e.entityType ?? "video";
}
const Yr = [
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
function vn(e) {
  return we(e) && !Ja(e.occurrence) ? "Complete the optional occurrence condition before saving." : !Ts(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : Fe(e) !== "tag" && e.actions.some(
    (t) => Mi(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => or(t, Fe(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const Rs = {
  video: 1e3,
  audio: 250
};
function it(e, t = "video") {
  const r = (i, a) => Number.isFinite(Number(i)) && Number(i) > 0 ? Math.floor(Number(i)) : a;
  return {
    ...e,
    page: Math.max(1, r(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(Rs[t], r(e.perPage, 40))
    )
  };
}
function aa(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function It(e) {
  const { page: t, ...r } = e.view.filter, i = [
    r,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    we(e) ? [e.entityType, ...i, e.occurrence] : Fe(e) === "video" ? i : [Fe(e), ...i]
  );
}
function or(e, t) {
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
    ].includes(i.mode) && i.tagIds.length > 0 && i.tagIds.every((a) => Number.isSafeInteger(a) && a > 0)
  ) && !Mi(e) : !1;
}
function Is(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function nr(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function Qn(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function wr(e) {
  return "steps" in e ? e.steps.some((t) => nr(t.mode)) : !1;
}
function Mi(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e.steps)
    if (nr(r.mode))
      for (const i of r.tagIds) {
        const a = t.get(i);
        if (a && a !== r.mode) return !0;
        t.set(i, r.mode);
      }
  return !1;
}
function Nn(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && (r.entityType === void 0 || ks.includes(r.entityType)) && (!Is(r.entityType) || Ja(r.occurrence)) && r.view && typeof r.view == "object" && (r.entityType === "tag" ? ["grid", "list"].includes(r.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      r.view.displayMode
    )) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && (r.view.reviewMode === void 0 || ["single", "multiple"].includes(r.view.reviewMode)) && (r.view.reviewMode !== "multiple" || (r.entityType ?? "video") === "video") && (r.view.selectAllOnLoad === void 0 || typeof r.view.selectAllOnLoad == "boolean") && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && Os(
      r.presentation,
      (r.entityType ?? "video") !== "video"
    ) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && (r.entityType === "tag" ? "effect" in i && !("steps" in i) && or(i, "tag") : "steps" in i && !("effect" in i) && Array.isArray(i.steps) && i.steps.every(
        (a) => a && Array.isArray(a.tagIds)
      ) && or(i, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => vn(r)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function Os(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const r = e;
  return (r.cardSize === void 0 || r.cardSize === null || Number.isFinite(r.cardSize) && r.cardSize >= 115 && r.cardSize <= 380) && (!t || r.annotations === void 0 && r.annotationParents === void 0 && r.binParents === void 0) && (r.annotations === void 0 || Array.isArray(r.annotations) && r.annotations.every(
    (i) => ["date", "studio", "performers", "tags"].includes(i)
  )) && [r.annotationParents, r.binParents].every(
    (i) => i === void 0 || Array.isArray(i) && i.every((a) => Number.isSafeInteger(a) && a > 0)
  );
}
function fi(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const a of i)
      r.has(a.id) || (r.add(a.id), t.push(a));
  return t;
}
function Ja(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, r = (i) => Array.isArray(i) && i.every((a) => Number.isSafeInteger(a) && a > 0) && new Set(i).size === i.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && r(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && Oi.includes(t.condition) && r(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.flagPerformerTagIds === void 0 || r(t.flagPerformerTagIds)) && r(t.tagIds) && typeof t.multiple == "boolean";
}
function oa(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function sa(e, t, r, i) {
  if (t.length === 0) return null;
  if (r == null) return t[0];
  if (!i && t.includes(r)) return r;
  const a = Math.max(0, e.indexOf(r));
  if (i) {
    for (const o of e.slice(a + 1))
      if (t.includes(o)) return o;
    if (t.includes(r)) {
      for (const o of e.slice(0, a).reverse())
        if (t.includes(o)) return o;
      return r;
    }
  }
  return t[Math.min(a, t.length - 1)];
}
function $s(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((a) => r.has(a));
  for (const a of t)
    i ? r.delete(a) : r.add(a);
  return r;
}
function Ms(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function xs(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function Fs(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function Ps(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function Ls(e, t) {
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
const za = "ext:com.midnightrider.data-quality:configuration", Ds = "ext:cove-data-quality:video-reviews", pi = "ext:com.midnightrider.data-quality:progress", qn = /* @__PURE__ */ new Map(), xn = /* @__PURE__ */ new Map(), $r = (e, t) => e.includes("*") || e.includes(t), Un = (e) => ee(`/api/savedfilters?mode=${encodeURIComponent(e)}`), _s = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function mi(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Qr(e) {
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
    reviews: Nn(JSON.stringify(t.reviews)),
    deletedIds: mi(t.deletedIds),
    importedIds: mi(t.importedIds)
  };
}
function js(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const a of t) {
    const o = localStorage.getItem(a);
    if (o !== null) {
      const s = Nn(o);
      r ?? (r = s), s.forEach((d) => i.add(d.id));
    }
    mi(
      JSON.parse(localStorage.getItem(`${a}:account-imports`) ?? "[]")
    ).forEach((s) => i.add(s));
  }
  return {
    reviews: r ?? [],
    known: [...i],
    present: r !== void 0
  };
}
async function Qa(e) {
  const t = await ee("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Wa(e, t) {
  const r = (xn.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return xn.set(e, r), r.finally(() => {
    xn.get(e) === r && xn.delete(e);
  }).catch(() => {
  }), r;
}
let dn = null;
function Us() {
  if (dn) return dn;
  const e = Gs();
  return dn = e, e.finally(() => {
    dn === e && (dn = null);
  }).catch(() => {
  }), e;
}
async function Gs() {
  var h;
  const e = await ee("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = $r(e.permissions, "savedfilters.read"), a = i && $r(e.permissions, "savedfilters.write"), o = i ? (await Un(za)).filter((y) => y.name === "Data Quality configuration").sort((y, b) => y.id - b.id) : [];
  if (o.length > 1) {
    const y = (b) => {
      const { revision: N, ...O } = Qr(b.uiOptions);
      return JSON.stringify(O);
    };
    if (o.some((b) => y(b) !== y(o[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (a)
      for (const b of o.slice(1))
        await ee(`/api/savedfilters/${b.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${b.id}` })
        });
    o.splice(1);
  }
  let s = o.length ? Qr(o[0].uiOptions) : _s();
  const d = localStorage.getItem(`${r}:migrated`) === "true", c = localStorage.getItem(r), f = localStorage.getItem(`${r}:local-only`) === "true";
  !o.length && c && (s = Qr(c));
  let m = !o.length;
  if (o.length && f && c) {
    const y = Qr(c);
    if (y.reviews.some((N) => {
      const O = s.reviews.find((A) => A.id === N.id);
      return O && JSON.stringify(O) !== JSON.stringify(N);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const b = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...y.deletedIds])
    ];
    s = {
      ...s,
      reviews: fi(s.reviews, y.reviews).filter(
        (N) => !b.includes(N.id)
      ),
      deletedIds: b,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...y.importedIds])
      ]
    }, m = !0;
  }
  if (!d) {
    const y = JSON.stringify(s), b = js(t);
    if (o.length && b.reviews.some((S) => {
      const E = s.reviews.find((L) => L.id === S.id);
      return E && JSON.stringify(E) !== JSON.stringify(S);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const N = i ? (await Un(Ds)).flatMap(
      (S) => Nn(S.uiOptions ?? "[]")
    ) : [], O = b.known.filter(
      (S) => !b.reviews.some((E) => E.id === S)
    ), A = /* @__PURE__ */ new Set([...s.deletedIds, ...O]);
    s = {
      ...s,
      reviews: fi(
        b.reviews,
        s.reviews,
        N.filter(
          (S) => !b.known.includes(S.id) && !s.importedIds.includes(S.id)
        )
      ).filter((S) => !A.has(S.id)),
      deletedIds: [...A],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...b.known,
          ...N.map((S) => S.id)
        ])
      ]
    }, m || (m = JSON.stringify(s) !== y);
  }
  const g = {
    userId: t,
    recordId: (h = o[0]) == null ? void 0 : h.id,
    config: s,
    readable: i,
    writable: a,
    durable: a
  };
  if (qn.set(r, g), m && a) {
    const y = s;
    o.length && (g.config = Qr(o[0].uiOptions)), await Ha(r, y), s = g.config;
  } else o.length || (localStorage.setItem(r, JSON.stringify(s)), !i && (!d || f) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (a)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: s.reviews,
    storageKey: r,
    canWrite: $r(e.permissions, "videos.write"),
    canWriteVideos: $r(e.permissions, "videos.write"),
    canWriteAudios: $r(e.permissions, "audios.write"),
    canWriteTags: $r(e.permissions, "tags.write"),
    canReadTagGroups: $r(e.permissions, "taggroups.read"),
    canConfigure: !i || a,
    storageNotice: i ? a ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Ha(e, t) {
  const r = qn.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await Qa(r), r.recordId != null) {
      const o = await ee(
        `/api/savedfilters/${r.recordId}`
      );
      if (Qr(o.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const a = await ee(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: za,
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
function Bs(e, t) {
  return Nn(JSON.stringify(t)), Wa(e, async () => {
    const r = qn.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((a) => !t.some((o) => o.id === a.id)).map((a) => a.id);
    await Ha(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((a) => !t.some((o) => o.id === a))
    });
  });
}
function ca(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([r, i]) => /^[1-9]\d*:[1-9]\d*$/.test(r) && ["reviewed", "cannotDetermine"].includes(String(i)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Ks(e, t) {
  const r = qn.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), a = i ? ca(i) : null;
  if (!r.readable) return a;
  const o = (await Un(pi)).find(
    (d) => d.name === t
  ), s = o ? ca(o.uiOptions) : null;
  return a && (!s || a.updatedAt > s.updatedAt) ? a : s;
}
function Vs(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return Wa(i, async () => {
    const a = qn.get(e);
    if (!(a != null && a.writable)) return;
    await Qa(a);
    const o = (await Un(pi)).find(
      (s) => s.name === t
    );
    await ee(
      o ? `/api/savedfilters/${o.id}` : "/api/savedfilters",
      {
        method: o ? "PUT" : "POST",
        body: JSON.stringify({
          mode: pi,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
function yr(e) {
  return e === "audio" ? "audios" : "videos";
}
const Js = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function Dt(e) {
  return Js[e];
}
const Gn = "confirmed_absent_tags", xi = "Confirmed absent tags", Wn = "confirmed_absent_occurrence_tags", Ya = {
  key: Gn,
  label: xi,
  type: "tag",
  subject: "tag assessments"
}, Fi = {
  key: Wn,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, zs = {
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
function sr(e) {
  return Array.isArray(e) ? e.map(sr) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? zs[r] ?? r : t === "key" && typeof r == "string" && [
        Gn,
        Wn
      ].includes(r.toLowerCase()) ? r.toLowerCase() : sr(r)
    ])
  ) : e;
}
async function Xa(e, t, r) {
  const i = new Headers(t.headers);
  !(t.body instanceof FormData) && !i.has("Content-Type") && i.set("Content-Type", "application/json");
  const a = await As(e, { ...t, headers: i });
  if (a.status === 404 && r === "null") return null;
  if (!a.ok) {
    let s = a.statusText || `Request failed (${a.status}).`;
    try {
      const d = await a.json();
      s = d.message || d.detail || d.error || s;
    } catch {
    }
    throw new Error(s);
  }
  if (a.status === 204 || a.status === 205) return;
  const o = await a.text();
  return o ? JSON.parse(o) : void 0;
}
async function ee(e, t = {}) {
  return await Xa(e, t, "fail");
}
function Qs(e, t = {}) {
  return Xa(e, t, "null");
}
const Ws = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Hs = 0;
function hi(e, t) {
  return ee(
    `/api/${yr(e)}/${t}?dqRead=${Ws}-${++Hs}`,
    { cache: "no-store" }
  );
}
function Za(e, t) {
  const r = { ...e.view.objectFilter }, i = r._filterExpression;
  if (delete r._filterExpression, delete r.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    sr({
      findFilter: it(t, qe(e)),
      objectFilter: r,
      filterExpression: i
    })
  );
}
async function pn(e, t, r) {
  return ee(
    `/api/${yr(qe(e))}/find`,
    { method: "POST", signal: r, body: Za(e, t) }
  );
}
async function Ys(e, t, r) {
  return (await ee(
    `/api/${yr(qe(e))}/aggregate`,
    {
      method: "POST",
      signal: r,
      body: Za(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function la(e, t, r) {
  const i = { ...e.view.objectFilter };
  return delete i._filterExpression, ee("/api/tags/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      sr({
        findFilter: it(t),
        objectFilter: i
      })
    )
  });
}
function Xs(e) {
  return ee("/api/taggroups", { signal: e });
}
function gi(e, t, r = 1280) {
  return `/api/${yr(e)}/${t.id}/image?max=${r}&v=${encodeURIComponent(t.updatedAt)}`;
}
function bi(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function da(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Zs(e) {
  return `/api/stream/video/${e}/preview`;
}
function ec(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function tc(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Hn(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const i of e) {
    await ee(`/api/tags/${i}`, { signal: t }), r.add(i);
    for (let a = 1; ; a++) {
      const o = await ee("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          sr({
            findFilter: { page: a, perPage: 1e3, sort: "id", direction: "asc" },
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
      for (const s of o.items) r.add(s.id);
      if (a * 1e3 >= o.totalCount) break;
      if (!o.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...r];
}
async function Pi(e, t) {
  const r = Qn(e);
  return (await Promise.all(
    e.steps.map(
      async (a) => a.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await Hn(a.tagIds, t)).filter(
          (o) => !r.has(o)
        )
      } : a
    )
  )).filter((a) => a.tagIds.length > 0);
}
function rc(e, t) {
  const r = [];
  return t.type !== e.type && r.push(`type "${e.type}"`), t.isMultiValue || r.push("multiple values enabled"), t.filterable || r.push("filtering enabled"), r.length ? `The ${e.key} custom field is incompatible. It must have ${r.join(", ")}.` : "";
}
async function Li(e, t) {
  const i = (await ee("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === e.key
  );
  if (!i)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const a = rc(e, i);
  return a ? { kind: "incompatible", message: a } : i.entityTypes.includes(t) ? { kind: "ready", definition: i, message: "" } : {
    kind: "missing",
    message: `Add ${Dt(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: i
  };
}
async function eo(e, t) {
  const r = await Li(e, t);
  if (r.kind !== "ready") {
    if (r.kind === "incompatible") throw new Error(r.message);
    if (r.definition) {
      await ee(`/api/custom-fields/${r.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...r.definition.entityTypes, t])]
        })
      });
      return;
    }
    await ee("/api/custom-fields", {
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
function to(e = "video") {
  return Li(Ya, e);
}
function nc(e = "video") {
  return eo(Ya, e);
}
function ro(e = "video") {
  return Li(Fi, e);
}
function ic(e = "video") {
  return eo(Fi, e);
}
function Bn(e) {
  return [...new Set(e)];
}
function no(e, t) {
  const r = e.customFields ?? {}, i = Object.keys(r).find(
    (o) => o.toLowerCase() === Wn
  ), a = i === void 0 ? [] : r[i];
  return Bn(
    (Array.isArray(a) ? a : []).filter(
      (o) => typeof o == "string" && /^[1-9]\d*:[1-9]\d*$/.test(o)
    ).map((o) => o.split(":").map(Number)).filter(([o]) => o === t).map(([, o]) => o)
  );
}
async function ac(e) {
  let t;
  try {
    t = await ro(e);
  } catch (r) {
    throw new Error(
      `Could not verify the ${Fi.label} custom field. ${r instanceof Error ? r.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function oc(e, t, r, i, a, o) {
  await ee(`/api/${yr(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [r],
      customFields: {
        [e]: Bn(a).map((s) => `${i}:${s}`)
      },
      customFieldMode: o
    })
  });
}
function sc(e, t, r) {
  const i = [...e.tagIds], a = (o) => {
    if (r === null)
      throw new Error(
        `The ${xi} custom field is not available.`
      );
    return { customFields: { [r]: i }, customFieldMode: o };
  };
  switch (e.mode) {
    case "ADD":
      return { ids: t, tagIds: i, tagMode: "ADD" };
    case "REMOVE":
    case "REMOVE_TREE":
      return { ids: t, tagIds: i, tagMode: "REMOVE" };
    case "MARK_PRESENT":
      return { ids: t, tagIds: i, tagMode: "ADD", ...a("REMOVE") };
    case "MARK_ABSENT":
      return { ids: t, tagIds: i, tagMode: "REMOVE", ...a("ADD") };
    case "CLEAR_ABSENCE":
      return { ids: t, ...a("REMOVE") };
  }
}
async function io(e, t, r) {
  if (!or(t) || r.length === 0 || r.some((c) => !Number.isSafeInteger(c) || c <= 0))
    throw new Error(
      `Choose ${Dt(e).many} and configure a valid action first.`
    );
  let i = null;
  if (wr(t)) {
    let c;
    try {
      c = await to(e);
    } catch (f) {
      throw new Error(
        `Could not verify the ${xi} custom field. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
    if (c.kind !== "ready") throw new Error(c.message);
    i = c.definition.key;
  }
  const a = Bn(r), o = (await Pi(t)).map((c) => ({
    mode: c.mode,
    tagIds: Bn(c.tagIds)
  })), d = [
    ...o.filter((c) => !nr(c.mode)),
    ...o.filter((c) => nr(c.mode))
  ].map(
    (c) => sc(c, a, i)
  );
  for (let c = 0; c < d.length; c++)
    try {
      await ee(`/api/${yr(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(d[c])
      });
    } catch (f) {
      throw new Error(
        `Step ${c + 1} failed; ${c} earlier step(s) completed. Refresh and check the selected ${Dt(e).many} before retrying. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
}
async function cc(e, t) {
  if (!or(e, "tag") || t.length === 0 || t.some((r) => !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await ee("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const ao = "-", lc = "Ctrl+a", dc = "Ctrl/⌘A";
function Fn(e) {
  return (t) => {
    t != null && t.repeat || e();
  };
}
function Di({
  surface: e,
  enabled: t,
  actionCount: r,
  onAction: i,
  onFind: a,
  onSelectAll: o
}) {
  const s = M({ onAction: i, onFind: a, onSelectAll: o });
  ir(() => {
    s.current = { onAction: i, onFind: a, onSelectAll: o };
  });
  const d = Math.max(0, Math.min(r, Yr.length)), c = !!a && r > 0, f = e === "local" && !!o, m = Pe(() => {
    const g = [];
    return f && g.push({
      keys: lc,
      surface: "local",
      action: Fn(() => {
        var h, y;
        return (y = (h = s.current).onSelectAll) == null ? void 0 : y.call(h);
      })
    }), c && g.push({
      keys: ao,
      surface: e,
      action: Fn(() => {
        var h, y;
        return (y = (h = s.current).onFind) == null ? void 0 : y.call(h);
      })
    }), Yr.slice(0, d).forEach(
      (h, y) => g.push(
        {
          keys: h,
          surface: e,
          action: Fn(() => s.current.onAction(y, !1))
        },
        {
          keys: `Shift+${h}`,
          surface: e,
          action: Fn(() => s.current.onAction(y, !0))
        }
      )
    ), g;
  }, [e, d, c, f]);
  Zo(m, t);
}
const uc = {
  action: (e) => Yr[e] ?? "",
  find: ao,
  selectAll: dc
};
function Fr() {
  return uc;
}
const fc = 600 * 1e3, _i = /* @__PURE__ */ new Map(), oo = /* @__PURE__ */ new Map(), br = /* @__PURE__ */ new Map();
function so(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = oo.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function co(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && oo.set(e.tagGroupId, e.tagGroupSortOrder), _i.set(e.id, { tag: e, at: Date.now() });
}
function lo(e) {
  const t = _i.get(e);
  if (!(!t || Date.now() - t.at > fc))
    return so(t.tag);
}
function uo(e) {
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
function wi(e) {
  var t;
  for (const r of e) {
    const i = (t = r.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(r.id) && i && co(uo({ ...r, name: i }));
  }
}
function pc(e) {
  const t = br.get(e);
  if (t) return t;
  const r = new AbortController(), i = {
    controller: r,
    waiters: 0,
    promise: ee(`/api/tags/${e}`, {
      signal: r.signal
    }).then(
      (a) => {
        var m, g;
        const o = ((m = a == null ? void 0 : a.name) == null ? void 0 : m.trim()) || null;
        if (br.get(e) === i && br.delete(e), !o) return null;
        const s = uo({ ...a, id: e, name: o }), d = (g = _i.get(e)) == null ? void 0 : g.tag, c = (d == null ? void 0 : d.tagGroupId) === s.tagGroupId, f = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (c ? d == null ? void 0 : d.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (d == null ? void 0 : d.hasImage),
          imagePath: s.imagePath ?? (d == null ? void 0 : d.imagePath)
        };
        return co(f), so(f);
      },
      () => (br.get(e) === i && br.delete(e), null)
    )
  };
  return br.set(e, i), i;
}
function ua() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function ni(e) {
  const t = {};
  for (const r of e) {
    const i = lo(r);
    i !== void 0 && (t[r] = i);
  }
  return t;
}
function mc(e, t) {
  if (t != null && t.aborted) return Promise.reject(ua());
  const r = {}, i = [];
  for (const a of new Set(e)) {
    const o = lo(a);
    if (o !== void 0) r[a] = o;
    else {
      const s = pc(a);
      s.waiters += 1, i.push({ id: a, entry: s });
    }
  }
  return i.length ? new Promise((a, o) => {
    let s = !1;
    const d = () => {
      for (const { id: f, entry: m } of i)
        m.waiters -= 1, m.waiters === 0 && br.get(f) === m && (br.delete(f), m.controller.abort());
    }, c = () => {
      s || (s = !0, d(), o(ua()));
    };
    t == null || t.addEventListener("abort", c, { once: !0 }), Promise.all(
      i.map(
        ({ id: f, entry: m }) => m.promise.then((g) => [f, g])
      )
    ).then((f) => {
      if (!s) {
        s = !0, t == null || t.removeEventListener("abort", c), d();
        for (const [m, g] of f) r[m] = g;
        a(r);
      }
    });
  }) : Promise.resolve(r);
}
function hc(e) {
  const t = {};
  for (const [r, i] of Object.entries(e)) t[Number(r)] = (i == null ? void 0 : i.name) ?? null;
  return t;
}
function fo(e) {
  const t = [...new Set(e)].sort((a, o) => a - o).join(","), [r, i] = q(() => ({
    key: t,
    tags: ni(ii(t))
  }));
  return Q(() => {
    const a = ii(t), o = ni(a);
    if (i({ key: t, tags: o }), a.every((d) => d in o)) return;
    const s = new AbortController();
    return mc(a, s.signal).then(
      (d) => i({ key: t, tags: d }),
      () => {
      }
    ), () => s.abort();
  }, [t]), r.key === t ? r.tags : ni(ii(t));
}
function en(e) {
  const t = fo(e);
  return Pe(() => hc(t), [t]);
}
function ii(e) {
  return e ? e.split(",").map(Number) : [];
}
function gc(e, t, r = !1) {
  switch (e) {
    case "ADD":
      return { text: `+ ${t}`, tone: "add" };
    case "REMOVE":
      return { text: `− ${t}`, tone: "remove" };
    case "REMOVE_TREE":
      return { text: r ? `− rest of ${t}` : `− ${t} tree`, tone: "remove" };
    case "MARK_PRESENT":
      return { text: `Mark ${t} present`, tone: "assess" };
    case "MARK_ABSENT":
      return { text: `Mark ${t} absent`, tone: "assess" };
    case "CLEAR_ABSENCE":
      return { text: `Clear ${t} absence`, tone: "neutral" };
  }
}
function tn(e, t, r = [], i) {
  if ("effect" in e) {
    const s = e.effect;
    if (s.mode === "SKIP") return [{ text: "Skip", tone: "neutral" }];
    if (s.mode === "CLEAR_TAG_GROUP")
      return [{ text: "Set Ungrouped", tone: "neutral" }];
    const d = r.find((c) => c.id === s.tagGroupId);
    return [
      {
        text: d ? `Assign ${d.name}` : "Unavailable tag group",
        tone: "neutral"
      }
    ];
  }
  if (!e.steps.length) return [{ text: "Skip", tone: "neutral" }];
  const a = Qn(e), o = (s) => a.has(s) || [...a].some((d) => {
    var c;
    return (c = i == null ? void 0 : i.get(s)) == null ? void 0 : c.includes(d);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (d) => gc(
        s.mode,
        t[d] === void 0 ? "…" : t[d] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && o(d)
      )
    )
  );
}
function ji(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((r) => r.tagIds) : []
  );
}
function Ui({
  actions: e,
  tagGroups: t,
  trees: r,
  isDisabled: i,
  canStay: a = !0,
  onApply: o,
  onClose: s
}) {
  const [d, c] = q(""), [f, m] = q(0), g = M(null), h = M(null), y = M(null), b = M(null), N = M(null), O = Lt(), A = en(Pe(() => ji(e), [e])), S = Fr(), E = Pe(() => {
    const D = d.trim().toLocaleLowerCase();
    return e.map((te, G) => ({ action: te, index: G, key: S.action(G) })).filter((te) => !D || te.action.label.toLocaleLowerCase().includes(D));
  }, [e, S, d]), L = E.length ? Math.min(f, E.length - 1) : -1, P = (D) => `${O}-option-${D}`;
  ir(() => {
    var D, te, G;
    return b.current = document.activeElement, N.current = ((te = (D = y.current) == null ? void 0 : D.parentElement) == null ? void 0 : te.closest('[role="dialog"]')) ?? null, (G = g.current) == null || G.focus({ preventScroll: !0 }), () => {
      var C;
      const oe = b.current;
      oe instanceof HTMLElement && oe.isConnected && oe.focus({ preventScroll: !0 }), document.activeElement !== oe && ((C = N.current) != null && C.isConnected) && N.current.focus({ preventScroll: !0 });
    };
  }, []), Q(() => {
    var D, te, G;
    L < 0 || (G = (te = (D = h.current) == null ? void 0 : D.querySelector(`[id="${P(E[L].index)}"]`)) == null ? void 0 : te.scrollIntoView) == null || G.call(te, { block: "nearest" });
  }, [L, E]);
  function H(D, te) {
    !D || i != null && i(D.action) || o(D.action, a && te);
  }
  function W(D) {
    var te;
    if (D.stopPropagation(), D.key === "Escape")
      D.preventDefault(), s();
    else if (D.key === "Enter")
      D.preventDefault(), D.repeat || H(E[L], D.shiftKey);
    else if (D.key === "ArrowDown" || D.key === "ArrowUp") {
      if (D.preventDefault(), !E.length) return;
      const G = D.key === "ArrowDown" ? 1 : -1;
      m((L + G + E.length) % E.length);
    } else D.key === "Tab" && (D.preventDefault(), (te = g.current) == null || te.focus());
  }
  return /* @__PURE__ */ l(pe, { children: [
    /* @__PURE__ */ n("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: s }),
    /* @__PURE__ */ l(
      "div",
      {
        ref: y,
        role: "dialog",
        "aria-label": "Find an action",
        className: "dq-find-action",
        onKeyDown: W,
        onMouseDown: (D) => {
          D.target !== g.current && D.preventDefault();
        },
        children: [
          /* @__PURE__ */ l("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ n(Jn, { "aria-hidden": "true" }),
            /* @__PURE__ */ n(
              "input",
              {
                ref: g,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${O}-list`,
                "aria-activedescendant": L >= 0 ? P(E[L].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: d,
                onChange: (D) => {
                  c(D.target.value), m(0);
                }
              }
            ),
            /* @__PURE__ */ n("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          E.length ? /* @__PURE__ */ n(
            "ul",
            {
              ref: h,
              id: `${O}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: E.map((D, te) => /* @__PURE__ */ n("li", { role: "none", children: /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: P(D.index),
                  tabIndex: -1,
                  "aria-selected": te === L,
                  disabled: (i == null ? void 0 : i(D.action)) ?? !1,
                  onClick: (G) => H(D, G.shiftKey),
                  children: [
                    D.key ? /* @__PURE__ */ n("kbd", { children: D.key }) : /* @__PURE__ */ n("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ n("span", { className: "dq-find-label", children: D.action.label }),
                    /* @__PURE__ */ n("span", { className: "dq-find-effect", children: tn(D.action, A, t, r).map(
                      (G, oe) => /* @__PURE__ */ n("span", { "data-effect-tone": G.tone, children: G.text }, oe)
                    ) })
                  ]
                }
              ) }, D.action.id))
            }
          ) : /* @__PURE__ */ l("p", { className: "dq-find-empty", role: "status", children: [
            "No action matches “",
            d.trim(),
            "”."
          ] }),
          /* @__PURE__ */ l("p", { className: "dq-find-hints", "aria-hidden": "true", children: [
            /* @__PURE__ */ l("span", { children: [
              /* @__PURE__ */ n("kbd", { children: "Enter" }),
              " applies"
            ] }),
            a && /* @__PURE__ */ l("span", { children: [
              /* @__PURE__ */ n("kbd", { children: "Shift" }),
              /* @__PURE__ */ n("kbd", { children: "Enter" }),
              " applies and stays"
            ] }),
            /* @__PURE__ */ l("span", { children: [
              /* @__PURE__ */ n("kbd", { children: "↑" }),
              /* @__PURE__ */ n("kbd", { children: "↓" }),
              " choose"
            ] })
          ] })
        ]
      }
    )
  ] });
}
const Pn = (e) => e >= "0" && e <= "9";
function fa(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function pa(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let r = 0, i = 0;
  for (; r < e.length && i < t.length; ) {
    if (Pn(e[r]) && Pn(t[i])) {
      const d = r, c = i;
      for (; r < e.length && Pn(e[r]); ) r++;
      for (; i < t.length && Pn(t[i]); ) i++;
      const f = e.slice(d, r).replace(/^0+/, ""), m = t.slice(c, i).replace(/^0+/, "");
      if (f.length !== m.length) return f.length < m.length ? -1 : 1;
      if (f !== m) return f < m ? -1 : 1;
      continue;
    }
    const o = fa(e[r]), s = fa(t[i]);
    if (o !== s) return o < s ? -1 : 1;
    r++, i++;
  }
  const a = e.length - r - (t.length - i);
  return a !== 0 ? a < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function po(e, t) {
  const r = (a) => a.tagGroupId != null ? 0 : 1, i = (a) => a.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return r(e) - r(t) || Math.sign(i(e) - i(t)) || pa(e.tagGroupName, t.tagGroupName) || pa(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function mo(e) {
  return [...e].sort(po);
}
function bc(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e)
    if ("steps" in r)
      for (const i of r.steps)
        i.mode === "REMOVE_TREE" && i.tagIds.forEach((a) => t.add(a));
  return [...t];
}
function ho(e, t, r) {
  const i = Qn(e), a = [], o = [];
  for (const h of e.steps) {
    if (h.mode !== "REMOVE_TREE") {
      o.push(h);
      continue;
    }
    const y = h.tagIds.flatMap((b) => {
      const N = r.get(b);
      return N || a.push(b), N ?? [b];
    });
    o.push({ mode: "REMOVE", tagIds: y.filter((b) => !i.has(b)) });
  }
  const s = [
    ...o.filter((h) => !nr(h.mode)),
    ...o.filter((h) => nr(h.mode))
  ], d = new Set(t.ids), c = new Set(t.absent);
  for (const h of s)
    for (const y of h.tagIds)
      switch (h.mode) {
        case "ADD":
          d.add(y);
          break;
        case "REMOVE":
        case "REMOVE_TREE":
          d.delete(y);
          break;
        case "MARK_PRESENT":
          d.add(y), c.delete(y);
          break;
        case "MARK_ABSENT":
          d.delete(y), c.add(y);
          break;
        case "CLEAR_ABSENCE":
          c.delete(y);
          break;
      }
  const f = new Set(t.ids), m = new Set(t.absent), g = [...new Set(e.steps.flatMap((h) => h.tagIds))];
  return {
    added: g.filter((h) => d.has(h) && !f.has(h)),
    removed: [...f].filter((h) => !d.has(h)),
    markedAbsent: g.filter((h) => c.has(h) && !m.has(h)),
    absenceCleared: [...m].filter((h) => !c.has(h)),
    unresolvedTrees: [...new Set(a)]
  };
}
function wc(e) {
  let t;
  if (e.applications) {
    const r = /* @__PURE__ */ new Map();
    for (const i of e.applications)
      r.has(i.tag.id) || r.set(i.tag.id, i.tag);
    t = [...r.values()];
  } else
    t = e.tags ?? e.ids.map((r, i) => ({ id: r, name: e.names[i] ?? "" }));
  return mo(t);
}
function go(e) {
  const t = bc(e).sort((s, d) => s - d).join(","), [r, i] = q(() => /* @__PURE__ */ new Map()), a = M(/* @__PURE__ */ new Set()), o = M(!0);
  return Q(() => (o.current = !0, () => {
    o.current = !1;
  }), []), Q(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const d of s)
      a.current.has(d) || (a.current.add(d), Hn([d]).then(
        (c) => {
          o.current && i((f) => new Map(f).set(d, c));
        },
        () => {
          a.current.delete(d);
        }
      ));
  }, [t]), r;
}
function bo() {
  let e = null;
  const t = /* @__PURE__ */ new Set(), r = (i) => {
    i !== e && (e = i, t.forEach((a) => a()));
  };
  return {
    get: () => e,
    set: r,
    clear: (i) => {
      e === i && r(null);
    },
    subscribe: (i) => (t.add(i), () => t.delete(i))
  };
}
function Gi(e) {
  return $a(e.subscribe, e.get, e.get);
}
const ma = [
  { indent: 0, slots: ai(0, 11), fixed: [] },
  { indent: 1, slots: ai(11, 22), fixed: [] },
  { indent: 2, slots: ai(22, 27), fixed: ["n", "m", ",", "."] }
];
function ai(e, t) {
  return Array.from({ length: t - e }, (r, i) => e + i);
}
function ha(e, t) {
  return e === "g" ? "Go to…" : e === "f" ? t === "video" ? "Fullscreen · filters" : "Filters" : t === "video" && e === "k" ? "Play / pause" : t === "video" && e === "m" ? "Mute" : "";
}
function at({ binding: e, hidden: t }) {
  return /* @__PURE__ */ n(
    "kbd",
    {
      className: Array.from(e).length === 1 ? "dq-key dq-key-letter" : "dq-key",
      "aria-hidden": t || void 0,
      children: e
    }
  );
}
function ga(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function yc({
  actions: e,
  mediaKind: t,
  isDisabled: r,
  busy: i,
  tags: a,
  trees: o,
  preview: s,
  onApply: d,
  onFind: c,
  findDisabled: f,
  paused: m = !1
}) {
  const g = Fr(), h = Lt(), y = en(
    Pe(() => e.flatMap((E) => E.steps.flatMap((L) => L.tagIds)), [e])
  ), b = ma.filter((E) => E.slots.some((L) => L < e.length)), N = b.length === ma.length, O = Math.max(0, e.length - Yr.length), A = (E) => ({
    onMouseEnter: () => s.set(E),
    onMouseLeave: () => s.clear(E),
    onFocus: () => s.set(E),
    onBlur: (L) => {
      L.currentTarget.contains(L.relatedTarget) || s.clear(E);
    }
  }), S = (E) => {
    const L = e[E], P = g.action(E);
    if (!L) {
      const D = ha(P, t);
      return /* @__PURE__ */ l(
        "div",
        {
          className: `dq-pad-slot dq-pad-free${D ? " dq-pad-reserved" : ""}`,
          "aria-hidden": "true",
          children: [
            /* @__PURE__ */ n(at, { binding: P }),
            D && /* @__PURE__ */ n("span", { className: "dq-pad-label", children: D })
          ]
        },
        E
      );
    }
    const H = r(L), W = `${h}-effect-${E}`;
    return /* @__PURE__ */ l("div", { className: "dq-pad-slot", ...m ? {} : A(L), children: [
      /* @__PURE__ */ n("span", { id: W, className: "dq-sr-only", children: tn(L, y, [], o).map((D) => D.text).join(", ") }),
      /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: L.label,
          "aria-keyshortcuts": P,
          "aria-describedby": W,
          disabled: H,
          onClick: (D) => d(L, D.shiftKey),
          children: [
            /* @__PURE__ */ n(at, { binding: P }),
            " ",
            /* @__PURE__ */ n("span", { className: "dq-pad-label", children: L.label }),
            ga(L) && " ",
            ga(L) && /* @__PURE__ */ l("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ n(di, { "aria-hidden": "true" }),
              "absent"
            ] })
          ]
        }
      ),
      L.steps.length > 0 && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-pad-pin",
          "aria-label": `Apply and stay: ${L.label}`,
          title: "Apply and stay (Shift)",
          disabled: H,
          onClick: () => d(L, !0),
          children: /* @__PURE__ */ n(us, { "aria-hidden": "true" })
        }
      )
    ] }, E);
  };
  return /* @__PURE__ */ l(
    "section",
    {
      className: `dq-pad${m ? " dq-pad-paused" : ""}`,
      "aria-label": m ? "Actions, paused while editing" : "Actions",
      "aria-busy": i || void 0,
      children: [
        /* @__PURE__ */ l("div", { className: "dq-pad-header", children: [
          m ? /* @__PURE__ */ l("p", { className: "dq-pad-paused-note", children: [
            /* @__PURE__ */ n(yn, { "aria-hidden": "true" }),
            "Actions are paused while you edit the review"
          ] }) : /* @__PURE__ */ l(pe, { children: [
            /* @__PURE__ */ n(
              vc,
              {
                actions: e,
                names: y,
                tags: a,
                trees: o,
                preview: s,
                extra: O,
                findKey: g.find
              }
            ),
            /* @__PURE__ */ l("span", { className: "dq-pad-hint", children: [
              /* @__PURE__ */ n("kbd", { className: "dq-key", children: "Shift" }),
              /* @__PURE__ */ n("span", { children: "+ key applies and stays" })
            ] })
          ] }),
          !N && /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              className: "dq-pad-find-button",
              "aria-label": "Find action",
              "aria-keyshortcuts": g.find,
              disabled: f,
              onClick: c,
              children: [
                /* @__PURE__ */ n(at, { binding: g.find }),
                /* @__PURE__ */ n("span", { "aria-hidden": "true", children: "Find action" })
              ]
            }
          )
        ] }),
        b.map((E) => /* @__PURE__ */ l("div", { className: "dq-pad-row", "data-indent": E.indent, children: [
          E.slots.map(S),
          E.fixed.map((L) => {
            const P = ha(L, t);
            return /* @__PURE__ */ l(
              "div",
              {
                className: `dq-pad-slot dq-pad-free dq-pad-fixed${P ? " dq-pad-reserved" : ""}`,
                "aria-hidden": "true",
                children: [
                  /* @__PURE__ */ n(at, { binding: L }),
                  P && /* @__PURE__ */ n("span", { className: "dq-pad-label", children: P })
                ]
              },
              L
            );
          }),
          E.fixed.length > 0 && /* @__PURE__ */ n("div", { className: "dq-pad-slot", children: /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": O ? `Find action, ${O} more` : "Find action",
              "aria-keyshortcuts": g.find,
              disabled: f,
              onClick: c,
              children: [
                /* @__PURE__ */ n(at, { binding: g.find }),
                /* @__PURE__ */ l("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ n(Jn, { "aria-hidden": "true" }),
                  O ? `${O} more` : "Find action"
                ] })
              ]
            }
          ) })
        ] }, E.indent))
      ]
    }
  );
}
function vc({
  actions: e,
  names: t,
  tags: r,
  trees: i,
  preview: a,
  extra: o,
  findKey: s
}) {
  const d = Fr(), c = Gi(a), f = c ? e.indexOf(c) : -1;
  if (!c || f < 0)
    return /* @__PURE__ */ l("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      o > 0 && /* @__PURE__ */ l(pe, { children: [
        ` · ${Yr.length} on keys, ${o} more under `,
        /* @__PURE__ */ n(at, { binding: s })
      ] })
    ] });
  const m = d.action(f), g = r && c.steps.length ? ho(c, r, i) : null, h = g && !g.unresolvedTrees.length && ![g.added, g.removed, g.markedAbsent, g.absenceCleared].some(
    (y) => y.length
  );
  return /* @__PURE__ */ l("p", { className: "dq-pad-effect", children: [
    m && /* @__PURE__ */ n(at, { binding: m }),
    /* @__PURE__ */ n("strong", { children: c.label }),
    tn(c, t, [], i).map((y, b) => /* @__PURE__ */ n("span", { "data-effect-tone": y.tone, children: y.text }, b)),
    h && /* @__PURE__ */ n("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function wo({
  actions: e,
  tagGroups: t,
  trees: r,
  isDisabled: i,
  busy: a,
  onApply: o,
  onFind: s,
  summary: d,
  hints: c,
  notices: f,
  status: m,
  className: g = "",
  paused: h = !1
}) {
  const y = Fr(), b = Lt(), N = en(Pe(() => ji(e), [e])), [O] = q(() => bo()), A = M(null), S = Nc(A, e), E = e.slice(0, Yr.length), L = e.length - E.length, P = (W) => tn(W, N, t, r).map((D) => D.text).join(", "), H = (W) => ({
    onMouseEnter: () => O.set(W),
    onMouseLeave: () => O.clear(W),
    onFocus: () => O.set(W),
    onBlur: (D) => {
      D.currentTarget.contains(D.relatedTarget) || O.clear(W);
    }
  });
  return /* @__PURE__ */ l(
    "section",
    {
      ref: A,
      className: `dq-action-bar${S ? " dq-bar-stacked" : ""}${a ? " dq-bar-busy" : ""}${h ? " dq-bar-paused" : ""}${g ? ` ${g}` : ""}`,
      "aria-label": "Actions",
      children: [
        /* @__PURE__ */ n("div", { className: "dq-bar-summary", children: d }),
        /* @__PURE__ */ n("span", { className: "dq-bar-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ l("div", { className: "dq-bar-tiles", "aria-busy": a || void 0, children: [
          E.map((W, D) => {
            const te = y.action(D);
            return /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: "dq-bar-tile",
                title: W.label,
                "aria-keyshortcuts": te || void 0,
                "aria-describedby": `${b}-effect-${D}`,
                disabled: h || i(W),
                onClick: () => o(W),
                ...h ? {} : H(W),
                children: [
                  te && /* @__PURE__ */ n(at, { binding: te }),
                  " ",
                  /* @__PURE__ */ n("span", { className: "dq-bar-label", children: W.label })
                ]
              },
              W.id
            );
          }),
          e.length > 0 ? /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              className: "dq-bar-tile dq-bar-find",
              "aria-label": L > 0 ? `Find action, ${L} more` : "Find action",
              "aria-keyshortcuts": y.find,
              disabled: h,
              onClick: s,
              children: [
                /* @__PURE__ */ n(at, { binding: y.find, hidden: !0 }),
                /* @__PURE__ */ n(Jn, { "aria-hidden": "true" }),
                /* @__PURE__ */ n("span", { className: "dq-bar-label", children: L > 0 ? `${L} more` : "Find action" })
              ]
            }
          ) : /* @__PURE__ */ n("p", { className: "dq-bar-empty", children: "This review has no actions." })
        ] }),
        c && /* @__PURE__ */ n("p", { className: "dq-bar-hints", children: c }),
        h ? /* @__PURE__ */ l("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ n(yn, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ n(qc, { actions: E, preview: O, names: N, tagGroups: t, trees: r }),
        f && /* @__PURE__ */ n("div", { className: "dq-bar-notices", children: f }),
        /* @__PURE__ */ n("div", { hidden: !0, children: E.map((W, D) => /* @__PURE__ */ n("span", { id: `${b}-effect-${D}`, children: P(W) }, W.id)) }),
        /* @__PURE__ */ n("span", { className: "dq-sr-only", role: "status", children: m })
      ]
    }
  );
}
function Nc(e, t) {
  const [r, i] = q(!1);
  return ir(() => {
    var f;
    const a = e.current;
    if (!a || typeof ResizeObserver > "u") return;
    const o = a.querySelector(".dq-bar-summary"), s = () => {
      const m = getComputedStyle(a), g = parseFloat(m.columnGap) || 0, h = a.clientWidth - (parseFloat(m.paddingLeft) || 0) - (parseFloat(m.paddingRight) || 0), y = [...a.querySelectorAll(".dq-bar-tiles > *")].map(
        (S) => S.offsetWidth
      ), b = parseFloat(getComputedStyle(a.querySelector(".dq-bar-tiles")).columnGap) || 0, N = a.querySelector(".dq-bar-hints"), O = ((o == null ? void 0 : o.offsetWidth) ?? 0) + (N ? N.offsetWidth + g : 0) + 1 + // the divider
      2 * g, A = (S) => {
        let E = 1, L = 0;
        for (const P of y)
          L > 0 && L + b + P > S ? (E += 1, L = P) : L += (L > 0 ? b : 0) + P;
        return E;
      };
      i(1 + A(h) < A(h - O));
    }, d = new ResizeObserver(s);
    d.observe(a);
    for (const m of a.querySelectorAll(".dq-bar-summary, .dq-bar-tiles, .dq-bar-hints"))
      d.observe(m);
    s();
    let c = !0;
    return (f = document.fonts) == null || f.ready.then(() => {
      c && s();
    }), () => {
      c = !1, d.disconnect();
    };
  }, [e, t]), r;
}
function qc({
  actions: e,
  preview: t,
  names: r,
  tagGroups: i,
  trees: a
}) {
  const o = Fr(), s = Gi(t), d = s ? e.indexOf(s) : -1;
  if (!s || d < 0) return null;
  const c = o.action(d);
  return /* @__PURE__ */ l("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    c && /* @__PURE__ */ n(at, { binding: c }),
    /* @__PURE__ */ n("strong", { children: s.label }),
    tn(s, r, i, a).map((f, m) => /* @__PURE__ */ n("span", { "data-effect-tone": f.tone, children: f.text }, m))
  ] });
}
const ba = 1e3;
async function Sc(e, t, r) {
  const i = await ee(
    `/api/tags/${t}`,
    { signal: r }
  ), a = /* @__PURE__ */ new Map();
  for (let c = 1; ; c++) {
    const f = await ee(
      "/api/tags/find",
      {
        method: "POST",
        signal: r,
        body: JSON.stringify(
          sr({
            findFilter: {
              page: c,
              perPage: ba,
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
    for (const m of f.items) a.set(m.id, m);
    if (c * ba >= f.totalCount) break;
    if (!f.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const o = [...a.values()], s = qe(e), d = we(e) ? await Cc(
    s,
    o.map((c) => c.id),
    r
  ) : o.map((c) => (s === "audio" ? c.audioCount : c.videoCount) ?? 0);
  return {
    parent: { id: t, name: i.name },
    children: o.map((c, f) => ({ id: c.id, name: c.name, uses: d[f] })).sort(
      (c, f) => f.uses - c.uses || c.name.localeCompare(f.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      })
    )
  };
}
function Ec(e) {
  return JSON.stringify(
    sr({
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
async function Cc(e, t, r) {
  const i = new Array(t.length).fill(0), a = new AbortController(), o = () => a.abort(r == null ? void 0 : r.reason);
  r != null && r.aborted && o(), r == null || r.addEventListener("abort", o, { once: !0 });
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; s < t.length && !a.signal.aborted; ) {
            const d = s++;
            i[d] = (await ee(
              `/api/${yr(e)}/aggregate`,
              {
                method: "POST",
                signal: a.signal,
                body: Ec(t[d])
              }
            )).count;
          }
        } catch (d) {
          throw a.abort(), d;
        }
      })
    );
  } finally {
    r == null || r.removeEventListener("abort", o);
  }
  return a.signal.throwIfAborted(), i;
}
function Ac(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((r) => ({
    ...r,
    children: r.children.filter((i) => t.has(i.id) ? !1 : (t.add(i.id), !0))
  }));
}
function kc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    for (const i of r.children)
      t.set(i.id, [...t.get(i.id) ?? [], r.parent.id]);
  return t;
}
function Tc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    for (const i of Qn(r))
      t.set(i, [...t.get(i) ?? [], r]);
  return t;
}
function Rc(e, t) {
  return {
    id: crypto.randomUUID(),
    label: e.name,
    steps: [
      { mode: "ADD", tagIds: [e.id] },
      ...t.length ? [{ mode: "REMOVE_TREE", tagIds: t }] : []
    ]
  };
}
const Ic = (e) => e instanceof Error ? e.message : "Request failed.";
function Oc({
  id: e,
  review: t,
  disabled: r,
  onAdd: i,
  onCancel: a
}) {
  const [o, s] = q([]), [d, c] = q({}), [f, m] = q({}), [g, h] = q({}), y = M(/* @__PURE__ */ new Map());
  Q(
    () => () => {
      for (const I of y.current.values()) I.abort();
    },
    []
  );
  const b = Dt(qe(t)), N = we(t), O = N ? "performer" : b.one;
  function A(I) {
    var Z;
    (Z = y.current.get(I)) == null || Z.abort();
    const x = new AbortController();
    y.current.set(I, x), c((ae) => ({ ...ae, [I]: { status: "loading" } })), Sc(t, I, x.signal).then(
      (ae) => {
        x.signal.aborted || c((le) => ({
          ...le,
          [I]: { status: "ready", group: ae }
        }));
      },
      (ae) => {
        x.signal.aborted || c((le) => ({
          ...le,
          [I]: { status: "failed", message: Ic(ae) }
        }));
      }
    );
  }
  function S(I) {
    var J;
    const x = o.filter((de) => !I.includes(de));
    for (const de of x)
      (J = y.current.get(de)) == null || J.abort(), y.current.delete(de);
    const Z = (de) => {
      const R = d[de];
      return (R == null ? void 0 : R.status) === "ready" ? R.group.children.map((_) => _.id) : [];
    }, ae = new Set(I.flatMap(Z)), le = x.flatMap(Z).filter((de) => !ae.has(de));
    m(
      (de) => Object.fromEntries(
        Object.entries(de).filter(([R]) => !le.includes(Number(R)))
      )
    ), h(
      (de) => Object.fromEntries(
        Object.entries(de).filter(([R]) => I.includes(Number(R)))
      )
    ), c(
      (de) => Object.fromEntries(
        Object.entries(de).filter(([R]) => I.includes(Number(R)))
      )
    ), s(I);
    for (const de of I) o.includes(de) || A(de);
  }
  const E = o.flatMap((I) => {
    const x = d[I];
    return (x == null ? void 0 : x.status) === "ready" ? [x.group] : [];
  }), L = E.length === o.length, P = o.some(
    (I) => {
      var x;
      return (((x = d[I]) == null ? void 0 : x.status) ?? "loading") === "loading";
    }
  ), H = new Map(
    Ac(E).map((I) => [I.parent.id, I])
  ), W = kc(E), D = new Map(E.map((I) => [I.parent.id, I.parent.name])), te = Tc(t.actions), G = (I) => f[I] ?? !te.has(I), oe = L ? [...H.values()].flatMap(
    (I) => I.children.filter((x) => G(x.id))
  ) : [], C = (I, x) => m((Z) => ({
    ...Z,
    ...Object.fromEntries(I.children.map((ae) => [ae.id, x]))
  }));
  return /* @__PURE__ */ l("fieldset", { id: e, className: "dq-actions-from-tags", children: [
    /* @__PURE__ */ n("legend", { children: "Add actions from parent tags" }),
    /* @__PURE__ */ l("p", { className: "dq-drawer-note", children: [
      "Each ticked child tag becomes an action that adds it, most used",
      " ",
      N ? "on performers " : "",
      "first. Tags an action already adds start unticked. The new actions go at the end, ready to reorder and edit."
    ] }),
    /* @__PURE__ */ n(
      ar,
      {
        entityType: "tag",
        values: o,
        onChange: S,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: r
      }
    ),
    o.map((I) => {
      const x = d[I];
      if (!x || x.status === "loading")
        return /* @__PURE__ */ n("p", { className: "dq-drawer-note", children: "Loading child tags…" }, I);
      if (x.status === "failed")
        return /* @__PURE__ */ l("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ l("span", { children: [
            "Child tags could not be loaded. ",
            x.message
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: r,
              onClick: () => A(I),
              children: "Retry"
            }
          )
        ] }, I);
      const Z = H.get(I);
      if (!Z) return null;
      const ae = Z.parent.name;
      return /* @__PURE__ */ l("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ n("legend", { children: ae }),
        x.group.children.length === 0 ? /* @__PURE__ */ n("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ l(pe, { children: [
          /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ n(
              "input",
              {
                type: "checkbox",
                checked: g[I] ?? !1,
                disabled: r,
                onChange: (le) => h((J) => ({
                  ...J,
                  [I]: le.target.checked
                }))
              }
            ),
            "Only one per ",
            O,
            ": each action removes every other tag in the ",
            ae,
            " tree"
          ] }),
          Z.children.length === 0 ? /* @__PURE__ */ n("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ l(pe, { children: [
            /* @__PURE__ */ l("div", { className: "dq-row", children: [
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  disabled: r,
                  "aria-label": `Select all child tags of ${ae}`,
                  onClick: () => C(Z, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  disabled: r,
                  "aria-label": `Select none of the child tags of ${ae}`,
                  onClick: () => C(Z, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ n("div", { className: "dq-child-tags", children: Z.children.map((le) => {
              const J = te.get(le.id) ?? [], de = (W.get(le.id) ?? []).filter((R) => R !== I).map((R) => `“${D.get(R)}”`);
              return /* @__PURE__ */ l("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ n(
                  "input",
                  {
                    type: "checkbox",
                    checked: G(le.id),
                    disabled: r,
                    onChange: (R) => m((_) => ({
                      ..._,
                      [le.id]: R.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ l("span", { children: [
                  le.name,
                  " ",
                  /* @__PURE__ */ l("small", { children: [
                    le.uses.toLocaleString(),
                    " ",
                    le.uses === 1 ? b.one : b.many
                  ] }),
                  de.length > 0 && /* @__PURE__ */ l("small", { children: [
                    " · Also under ",
                    de.join(", ")
                  ] }),
                  J.length > 0 && /* @__PURE__ */ l("small", { children: [
                    " ",
                    "· Already in “",
                    J[0].label || "New action",
                    "”",
                    J.length > 1 ? ` and ${J.length - 1} more` : ""
                  ] })
                ] })
              ] }, le.id);
            }) })
          ] })
        ] })
      ] }, I);
    }),
    /* @__PURE__ */ l("div", { className: "dq-row", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: r || !oe.length,
          onClick: () => i(
            oe.map(
              (I) => Rc(
                I,
                (W.get(I.id) ?? []).filter(
                  (x) => g[x]
                )
              )
            )
          ),
          children: oe.length ? `Add ${oe.length} action${oe.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ n("button", { type: "button", className: "dq-button", onClick: a, children: "Cancel" }),
      /* @__PURE__ */ n("span", { role: "status", className: "dq-sr-only", children: P ? "Loading child tags…" : "" })
    ] })
  ] });
}
const $c = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function Mc(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function xc(e, t) {
  if (or(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((r) => !r.tagIds.length)) return "A step has no tags";
    if (Mi(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function yo(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function Fc(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function Pc({
  review: e,
  onChange: t,
  tagGroups: r,
  trees: i,
  saving: a,
  expandedId: o,
  onExpand: s,
  reveal: d
}) {
  const c = Fe(e), f = c !== "tag", m = e.actions, g = Fr(), h = en(Pe(() => ji(m), [m])), [y, b] = q(""), [N, O] = q(!1), [A, S] = q(
    null
  ), E = Lt(), L = `${E}-from-tags`, P = M(null), H = M(null), W = M(null), D = M(null), te = M(/* @__PURE__ */ new WeakMap()), G = (_) => {
    let re = te.current.get(_);
    return re || (re = crypto.randomUUID(), te.current.set(_, re)), re;
  }, oe = y.trim().toLocaleLowerCase(), C = oe ? m.filter((_) => _.label.toLocaleLowerCase().includes(oe)) : m, I = (_) => t({ ...e, actions: _ }), x = (_, re) => I(m.map((Ie, me) => me === _ ? re : Ie));
  function Z(_) {
    var re;
    return [...((re = W.current) == null ? void 0 : re.querySelectorAll("[data-action-id]")) ?? []].find(
      (Ie) => Ie.dataset.actionId === _
    );
  }
  function ae(_, re) {
    const Ie = Z(_), me = Ie == null ? void 0 : Ie.querySelector(
      re === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return me == null || me.focus(), !!me;
  }
  ir(() => {
    var re;
    const _ = D.current;
    _ && (D.current = null, (_ === "add" || !ae(_.id, _.part)) && ((re = H.current) == null || re.focus()));
  }), Q(() => {
    !d || !o || (C.some((_) => _.id === o) ? ae(o, "label") : (b(""), D.current = { id: o, part: "label" }));
  }, [d]);
  function le() {
    const _ = Fc(c);
    b(""), I([...m, _]), s(_.id), D.current = { id: _.id, part: "label" };
  }
  function J(_) {
    const re = m[_], Ie = {
      ...structuredClone(re),
      id: crypto.randomUUID(),
      label: `${re.label} copy`
    };
    I([...m.slice(0, _ + 1), Ie, ...m.slice(_ + 1)]), s(Ie.id), D.current = { id: Ie.id, part: "label" };
  }
  function de(_) {
    const re = m[_], Ie = C.indexOf(re), me = C[Ie + 1] ?? C[Ie - 1];
    I(m.filter((Be, Xe) => Xe !== _)), o === re.id && s(null), D.current = me ? { id: me.id, part: "toggle" } : "add";
  }
  function R() {
    O(!1), requestAnimationFrame(() => {
      var _;
      return (_ = P.current) == null ? void 0 : _.focus();
    });
  }
  return /* @__PURE__ */ l("div", { className: "dq-actions-editor", children: [
    /* @__PURE__ */ l("div", { className: "dq-actions-head", children: [
      /* @__PURE__ */ l("div", { className: "dq-actions-toolbar", children: [
        /* @__PURE__ */ l(
          "button",
          {
            ref: H,
            type: "button",
            className: "dq-header-button",
            onClick: le,
            children: [
              /* @__PURE__ */ n(Ai, { "aria-hidden": "true" }),
              "Add action"
            ]
          }
        ),
        f && /* @__PURE__ */ n(
          "button",
          {
            ref: P,
            type: "button",
            className: "dq-header-button",
            "aria-expanded": N,
            "aria-controls": N ? L : void 0,
            onClick: () => {
              S(null), O(!N);
            },
            children: "Add from parent tags…"
          }
        ),
        /* @__PURE__ */ l("label", { className: "dq-actions-filter", children: [
          /* @__PURE__ */ n(Jn, { "aria-hidden": "true" }),
          /* @__PURE__ */ n(
            "input",
            {
              type: "search",
              "aria-label": "Find an action",
              placeholder: "Find an action…",
              autoComplete: "off",
              spellCheck: !1,
              value: y,
              onChange: (_) => b(_.target.value),
              onKeyDown: (_) => {
                _.key === "Escape" && y && (_.preventDefault(), _.stopPropagation(), b(""));
              }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ n("p", { className: "dq-actions-hint", children: "Letters follow this order. Drag a handle, or press Alt + ↑ / ↓, to reorder." }),
      /* @__PURE__ */ n("span", { role: "status", className: "dq-actions-status", children: (A == null ? void 0 : A.actions) === m ? `Added ${A.count} action${A.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    f && N && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here.
    /* @__PURE__ */ n(
      "div",
      {
        onKeyDown: (_) => {
          _.key !== "Escape" || _.defaultPrevented || (_.preventDefault(), _.stopPropagation(), R());
        },
        children: /* @__PURE__ */ n(
          Oc,
          {
            id: L,
            review: e,
            disabled: a,
            onAdd: (_) => {
              const re = [...m, ..._];
              I(re), S({ actions: re, count: _.length }), R();
            },
            onCancel: R
          }
        )
      }
    ),
    /* @__PURE__ */ n("div", { ref: W, children: C.length > 0 && /* @__PURE__ */ n(
      Ma,
      {
        items: C,
        getKey: (_) => _.id,
        disabled: a || !!oe,
        className: "dq-action-list",
        onReorder: (_) => I(_),
        renderItem: (_, { dragHandleProps: re, isOver: Ie }) => {
          const me = m.indexOf(_), Be = o === _.id;
          return /* @__PURE__ */ n(
            Lc,
            {
              action: _,
              entityType: c,
              binding: g.action(me),
              effect: tn(_, h, r, i),
              open: Be,
              detailId: `${E}-detail-${_.id}`,
              dragHandleProps: re,
              isOver: Ie,
              reorderDisabled: a || !!oe,
              onToggle: () => s(Be ? null : _.id),
              onDuplicate: () => J(me),
              onDelete: () => de(me),
              children: "steps" in _ ? /* @__PURE__ */ n(
                Dc,
                {
                  action: _,
                  saving: a,
                  stepKey: G,
                  rememberStepKey: (Xe, _t) => te.current.set(Xe, G(_t)),
                  onChange: (Xe) => x(me, Xe)
                }
              ) : /* @__PURE__ */ n(
                jc,
                {
                  action: _,
                  tagGroups: r,
                  onChange: (Xe) => x(me, Xe)
                }
              )
            }
          );
        }
      }
    ) }),
    m.length ? !C.length && /* @__PURE__ */ l("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      y.trim(),
      "”."
    ] }) : /* @__PURE__ */ n("p", { className: "dq-actions-empty", children: f ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function Lc({
  action: e,
  entityType: t,
  binding: r,
  effect: i,
  open: a,
  detailId: o,
  dragHandleProps: s,
  isOver: d,
  reorderDisabled: c,
  onToggle: f,
  onDuplicate: m,
  onDelete: g,
  children: h
}) {
  const y = e.label.trim() || "New action", b = xc(e, t);
  return /* @__PURE__ */ l(
    "div",
    {
      className: `dq-action-row${a ? " dq-action-row-open" : ""}${d ? " dq-drag-over" : ""}`,
      "data-action-id": e.id,
      children: [
        /* @__PURE__ */ l("div", { className: "dq-action-row-head", children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              ...s,
              style: yo(s.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${y}`,
              title: c ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: c,
              children: /* @__PURE__ */ n(Da, { "aria-hidden": "true" })
            }
          ),
          r ? /* @__PURE__ */ n(at, { binding: r }) : /* @__PURE__ */ n("span", { className: "dq-key dq-key-none", title: "Reached with Find action", children: "·" }),
          /* @__PURE__ */ l("div", { className: "dq-action-row-summary", onClick: f, children: [
            /* @__PURE__ */ n("span", { className: "dq-action-row-label", title: y, children: y }),
            !a && /* @__PURE__ */ n("span", { className: "dq-action-row-effect", children: i.map((N, O) => /* @__PURE__ */ n("span", { "data-effect-tone": N.tone, children: N.text }, O)) }),
            b && /* @__PURE__ */ l("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ n(Wr, { "aria-hidden": "true" }),
              b
            ] })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Duplicate ${y}`,
              title: "Duplicate",
              onClick: m,
              children: /* @__PURE__ */ n(fs, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Delete ${y}`,
              title: "Delete",
              onClick: g,
              children: /* @__PURE__ */ n(_a, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small dq-action-toggle",
              "aria-label": `${a ? "Collapse" : "Expand"} ${y}`,
              "aria-expanded": a,
              "aria-controls": a ? o : void 0,
              onClick: f,
              children: /* @__PURE__ */ n(ja, { "aria-hidden": "true" })
            }
          )
        ] }),
        a && /* @__PURE__ */ n("div", { id: o, className: "dq-action-detail", children: h })
      ]
    }
  );
}
function vo({
  action: e,
  onChange: t
}) {
  return /* @__PURE__ */ l("label", { className: "dq-action-field", children: [
    /* @__PURE__ */ n("span", { className: "dq-action-field-name", children: "Button label" }),
    /* @__PURE__ */ n(
      "input",
      {
        className: "dq-input dq-action-label-input",
        value: e.label,
        onChange: (r) => t(r.target.value)
      }
    )
  ] });
}
function Dc({
  action: e,
  saving: t,
  stepKey: r,
  rememberStepKey: i,
  onChange: a
}) {
  const o = Lt(), s = M(null), d = M(null);
  ir(() => {
    var m, g;
    const f = d.current;
    f != null && (d.current = null, (g = (m = s.current) == null ? void 0 : m.querySelector(`[data-step-index="${f}"] input`)) == null || g.focus());
  });
  const c = (f) => a({ ...e, steps: f });
  return /* @__PURE__ */ l(pe, { children: [
    /* @__PURE__ */ n(vo, { action: e, onChange: (f) => a({ ...e, label: f }) }),
    /* @__PURE__ */ l("div", { className: "dq-action-field dq-action-field-top", role: "group", "aria-labelledby": o, children: [
      /* @__PURE__ */ n("span", { className: "dq-action-field-name", id: o, children: "Steps" }),
      /* @__PURE__ */ l("div", { className: "dq-steps", ref: s, children: [
        e.steps.length > 0 ? /* @__PURE__ */ n(
          Ma,
          {
            items: e.steps,
            getKey: r,
            disabled: t,
            className: "dq-step-list",
            onReorder: c,
            renderItem: (f, { index: m, dragHandleProps: g, isOver: h }) => /* @__PURE__ */ n(
              _c,
              {
                step: f,
                index: m,
                dragHandleProps: g,
                isOver: h,
                saving: t,
                onChange: (y) => {
                  i(y, f), c(e.steps.map((b, N) => N === m ? y : b));
                },
                onRemove: () => c(e.steps.filter((y, b) => b !== m))
              }
            )
          }
        ) : /* @__PURE__ */ n("p", { className: "dq-drawer-note", children: "No steps: the action skips the item." }),
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "dq-add-step",
            onClick: () => {
              d.current = e.steps.length, c([...e.steps, { mode: "ADD", tagIds: [] }]);
            },
            children: [
              /* @__PURE__ */ n(Ai, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ n("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function _c({
  step: e,
  index: t,
  dragHandleProps: r,
  isOver: i,
  saving: a,
  onChange: o,
  onRemove: s
}) {
  const d = t + 1;
  return /* @__PURE__ */ l(
    "div",
    {
      className: `dq-step${i ? " dq-drag-over" : ""}`,
      "data-step-tone": Mc(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            ...r,
            style: yo(r.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${d}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: a,
            children: [
              /* @__PURE__ */ n(Da, { "aria-hidden": "true" }),
              /* @__PURE__ */ n("span", { "aria-hidden": "true", children: d })
            ]
          }
        ),
        /* @__PURE__ */ n(
          "select",
          {
            className: "dq-select dq-step-mode",
            "aria-label": `Step ${d} operation`,
            value: e.mode,
            onChange: (c) => o({ ...e, mode: c.target.value }),
            children: $c.map(({ mode: c, label: f }) => /* @__PURE__ */ n("option", { value: c, children: f }, c))
          }
        ),
        /* @__PURE__ */ n(
          ar,
          {
            entityType: "tag",
            values: e.tagIds,
            onChange: (c) => o({ ...e, tagIds: c }),
            placeholder: "Add tag…",
            inputAriaLabel: `Add a tag to step ${d}`,
            containerClassName: "dq-chip-input dq-step-tags",
            inputClassName: "dq-chip-input-field",
            allowCreate: !1,
            disabled: a
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-icon-button dq-icon-button-small",
            "aria-label": `Remove step ${d}`,
            title: "Remove step",
            onClick: s,
            children: /* @__PURE__ */ n(zn, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function jc({
  action: e,
  tagGroups: t,
  onChange: r
}) {
  const i = e.effect, a = i.mode === "SET_TAG_GROUP" ? `group:${i.tagGroupId}` : i.mode, o = i.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === i.tagGroupId);
  return /* @__PURE__ */ l(pe, { children: [
    /* @__PURE__ */ n(vo, { action: e, onChange: (s) => r({ ...e, label: s }) }),
    /* @__PURE__ */ l("label", { className: "dq-action-field", children: [
      /* @__PURE__ */ n("span", { className: "dq-action-field-name", children: "Effect" }),
      /* @__PURE__ */ l(
        "select",
        {
          className: "dq-select",
          "aria-label": "Tag group action",
          value: a,
          onChange: (s) => {
            const d = s.target.value;
            r({
              ...e,
              effect: d === "SKIP" ? { mode: "SKIP" } : d === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : { mode: "SET_TAG_GROUP", tagGroupId: Number(d.slice(6)) }
            });
          },
          children: [
            /* @__PURE__ */ n("option", { value: "SKIP", children: "Skip" }),
            /* @__PURE__ */ n("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
            o && /* @__PURE__ */ n("option", { value: a, disabled: !0, children: "Unavailable tag group" }),
            t.map((s) => /* @__PURE__ */ n("option", { value: `group:${s.id}`, children: s.name }, s.id))
          ]
        }
      )
    ] })
  ] });
}
function Uc({
  review: e,
  onChange: t
}) {
  const r = e.occurrence, i = Dt(qe(e)).queue, a = (o) => t({ ...e, occurrence: { ...r, ...o } });
  return /* @__PURE__ */ l("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ n("legend", { children: "Tag choices" }),
    /* @__PURE__ */ l("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      i,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ n(
      ar,
      {
        entityType: "tag",
        values: r.tagIds,
        onChange: (o) => a({ tagIds: o }),
        placeholder: "Search review tag choices...",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
      /* @__PURE__ */ n(
        "input",
        {
          type: "checkbox",
          checked: r.multiple,
          onChange: (o) => a({ multiple: o.target.checked })
        }
      ),
      "Allow multiple tags, for example when something changes part-way through the ",
      i
    ] }),
    /* @__PURE__ */ n("p", { children: "Save & next performer applies the selected tags and advances. Save choices stays on the performer. Skip only moves the cursor; eligibility comes from the filters." })
  ] });
}
function Gc({
  review: e,
  onChange: t
}) {
  const r = Dt(qe(e)).many;
  return /* @__PURE__ */ l("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ n("legend", { children: "Performer flags" }),
    /* @__PURE__ */ l("p", { children: [
      "Flag performers whose profile has any of these tags in the performer list and batches, for example a tag noting that something changed during their career. Check a flagged performer’s earliest and latest ",
      r,
      " ",
      "before applying one batch to all of them."
    ] }),
    /* @__PURE__ */ n(
      ar,
      {
        entityType: "tag",
        values: e.occurrence.flagPerformerTagIds ?? [],
        onChange: (i) => {
          const { flagPerformerTagIds: a, ...o } = e.occurrence;
          t({
            ...e,
            occurrence: i.length ? { ...o, flagPerformerTagIds: i } : o
          });
        },
        placeholder: "Search performer flag tags...",
        allowCreate: !1
      }
    )
  ] });
}
function bn(e) {
  const { page: t, ...r } = e.view.filter;
  return JSON.stringify(
    { ...e, view: { ...e.view, filter: r } },
    (i, a) => a && typeof a == "object" && !Array.isArray(a) ? Object.fromEntries(
      Object.keys(a).sort().map((o) => [o, a[o]])
    ) : a
  );
}
function No(e) {
  const t = URL.createObjectURL(
    new Blob([JSON.stringify([e], null, 2)], { type: "application/json" })
  ), r = document.createElement("a");
  r.href = t, r.download = "data-quality-review.json", r.click(), URL.revokeObjectURL(t);
}
function qo({
  review: e,
  onChange: t,
  entityTypeLocked: r,
  onEntityTypeChange: i,
  nameRef: a,
  autoFocus: o = !1
}) {
  return /* @__PURE__ */ l(pe, { children: [
    /* @__PURE__ */ l("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ n("span", { children: "Entity type" }),
      /* @__PURE__ */ l(
        "select",
        {
          className: "dq-select",
          "aria-label": "Entity type",
          value: Fe(e),
          disabled: r,
          onChange: (s) => i == null ? void 0 : i(s.target.value),
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
    /* @__PURE__ */ l("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ n("span", { children: "Review name" }),
      /* @__PURE__ */ n(
        "input",
        {
          ref: a,
          className: "dq-input",
          "aria-label": "Review name",
          autoFocus: o,
          value: e.name,
          onChange: (s) => t({ ...e, name: s.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ l("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ n("span", { children: "Description" }),
      /* @__PURE__ */ n(
        "textarea",
        {
          className: "dq-input",
          "aria-label": "Description",
          rows: 3,
          value: e.description,
          onChange: (s) => t({ ...e, description: s.target.value })
        }
      )
    ] })
  ] });
}
function Bc(e, t) {
  const r = Fe(e), i = ["Review"];
  return (r === "video" || r === "tag") && i.push("Appearance"), i.push("Actions"), t && i.push("Tag choices"), i;
}
function So({
  draft: e,
  onChange: t,
  direction: r,
  onDirectionChange: i,
  tagGroups: a,
  trees: o,
  saving: s,
  saveDisabled: d = !1,
  error: c,
  dirty: f,
  notices: m,
  onSave: g,
  onCancel: h,
  drawerRef: y
}) {
  const [b, N] = q("Review"), [O] = q(
    () => we(e) && e.occurrence.tagIds.length > 0
  ), [A, S] = q(""), [E, L] = q(null), [P, H] = q(0), W = M(null), D = Bc(e, O), te = Fe(e), G = Pe(() => bn(e), [e]);
  Q(() => S(""), [G]);
  function oe() {
    const I = { ...e, name: e.name.trim() }, x = vn(I);
    if (!x) {
      S(""), g();
      return;
    }
    if (S(x), !I.name) {
      N("Review"), requestAnimationFrame(() => {
        var ae;
        return (ae = W.current) == null ? void 0 : ae.focus();
      });
      return;
    }
    const Z = e.actions.find(
      (ae) => !or(ae, te)
    );
    Z && (N("Actions"), L(Z.id), H((ae) => ae + 1));
  }
  const C = A || c;
  return /* @__PURE__ */ l(
    "aside",
    {
      ref: y,
      className: "dq-drawer",
      role: "dialog",
      "aria-label": "Edit review",
      tabIndex: -1,
      onKeyDown: (I) => {
        I.key !== "Escape" || I.defaultPrevented || f || s || (I.preventDefault(), I.stopPropagation(), h());
      },
      children: [
        /* @__PURE__ */ l("header", { className: "dq-drawer-header", children: [
          /* @__PURE__ */ l("div", { className: "dq-drawer-title", children: [
            /* @__PURE__ */ n("span", { className: "dq-eyebrow", children: "Edit review" }),
            /* @__PURE__ */ n("h2", { children: e.name.trim() || "Untitled review" })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-icon-button",
              "aria-label": "Close editor",
              title: "Close without saving",
              disabled: s,
              onClick: h,
              children: /* @__PURE__ */ n(zn, { "aria-hidden": "true" })
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ n(
          es,
          {
            tabs: D.map((I) => ({
              key: I,
              label: I,
              count: I === "Actions" ? e.actions.length : void 0
            })),
            activeTab: b,
            onTabChange: (I) => N(I)
          }
        ) }),
        /* @__PURE__ */ n("div", { className: "dq-drawer-body", children: /* @__PURE__ */ l("fieldset", { className: "dq-drawer-fields", disabled: s, children: [
          /* @__PURE__ */ n("legend", { className: "dq-sr-only", children: "Review settings" }),
          /* @__PURE__ */ l("div", { className: "dq-drawer-panel", role: "tabpanel", hidden: b !== "Review", "aria-label": "Review", children: [
            /* @__PURE__ */ n(
              qo,
              {
                review: e,
                onChange: t,
                entityTypeLocked: !0,
                nameRef: W,
                autoFocus: !0
              }
            ),
            /* @__PURE__ */ l("label", { className: "dq-drawer-field", children: [
              /* @__PURE__ */ n("span", { children: "Review direction" }),
              /* @__PURE__ */ l(
                "select",
                {
                  className: "dq-select",
                  "aria-label": "Review direction",
                  value: r,
                  onChange: (I) => i(I.target.value),
                  children: [
                    /* @__PURE__ */ n("option", { value: "end", children: "Start from the end" }),
                    /* @__PURE__ */ n("option", { value: "beginning", children: "Start from the beginning" })
                  ]
                }
              ),
              /* @__PURE__ */ n("small", { className: "dq-drawer-note", children: "From the end, the queue opens on its last page and works towards the first." })
            ] }),
            we(e) && /* @__PURE__ */ n(Gc, { review: e, onChange: t }),
            /* @__PURE__ */ n("div", { children: /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-text-button",
                onClick: () => No(e),
                children: "Export draft"
              }
            ) })
          ] }),
          D.includes("Appearance") && /* @__PURE__ */ n(
            "div",
            {
              className: "dq-drawer-panel",
              role: "tabpanel",
              hidden: b !== "Appearance",
              "aria-label": "Appearance",
              children: /* @__PURE__ */ n(Kc, { review: e, onChange: t })
            }
          ),
          /* @__PURE__ */ n(
            "div",
            {
              className: "dq-drawer-panel dq-actions-panel",
              role: "tabpanel",
              hidden: b !== "Actions",
              "aria-label": "Actions",
              children: /* @__PURE__ */ n(
                Pc,
                {
                  review: e,
                  onChange: t,
                  tagGroups: a,
                  trees: o,
                  saving: s,
                  expandedId: E,
                  onExpand: L,
                  reveal: P
                }
              )
            }
          ),
          O && we(e) && /* @__PURE__ */ n(
            "div",
            {
              className: "dq-drawer-panel",
              role: "tabpanel",
              hidden: b !== "Tag choices",
              "aria-label": "Tag choices",
              children: /* @__PURE__ */ n(Uc, { review: e, onChange: t })
            }
          )
        ] }) }),
        (C || m) && /* @__PURE__ */ l("div", { className: "dq-drawer-notices", children: [
          m,
          C && /* @__PURE__ */ l("p", { role: "alert", className: "dq-alert", children: [
            /* @__PURE__ */ n(Wr, { "aria-hidden": "true" }),
            C
          ] })
        ] }),
        /* @__PURE__ */ l("footer", { className: "dq-drawer-footer", children: [
          /* @__PURE__ */ n("p", { className: "dq-drawer-dirty", children: f ? "Unsaved changes" : "" }),
          /* @__PURE__ */ n("button", { type: "button", className: "dq-button", disabled: s, onClick: h, children: "Cancel" }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button primary",
              "aria-busy": s || void 0,
              "aria-disabled": s || void 0,
              disabled: !s && d,
              onClick: () => {
                s || oe();
              },
              children: "Save review"
            }
          )
        ] })
      ]
    }
  );
}
function Kc({
  review: e,
  onChange: t
}) {
  const r = Lt(), i = e.view, a = (m) => t({ ...e, view: { ...i, ...m } }), o = /* @__PURE__ */ l("label", { className: "dq-checkbox dq-setting-indent", children: [
    /* @__PURE__ */ n(
      "input",
      {
        type: "checkbox",
        checked: i.selectAllOnLoad ?? !1,
        onChange: (m) => a({ selectAllOnLoad: m.target.checked ? !0 : void 0 })
      }
    ),
    "Select every card when a page opens"
  ] });
  if (Fe(e) === "tag")
    return /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${r}-cards`, children: [
      /* @__PURE__ */ n("h3", { className: "dq-eyebrow", id: `${r}-cards`, children: "Cards" }),
      /* @__PURE__ */ n(
        wa,
        {
          label: "View",
          value: i.displayMode === "list" ? "list" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "list", label: "List" }
          ],
          onChange: (m) => a({ displayMode: m })
        }
      ),
      o,
      /* @__PURE__ */ n("p", { className: "dq-drawer-note", children: "The review opens with these. The Cards / List switch in the header changes only the current visit." })
    ] });
  const s = e.presentation ?? {}, d = (m) => t({ ...e, presentation: { ...s, ...m } }), c = s.annotations ?? [], f = i.reviewMode ?? "single";
  return /* @__PURE__ */ l(pe, { children: [
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${r}-layout`, children: [
      /* @__PURE__ */ n("h3", { className: "dq-eyebrow", id: `${r}-layout`, children: "Layout" }),
      /* @__PURE__ */ l("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${r}-layout`, children: [
        /* @__PURE__ */ n(
          ya,
          {
            name: `${r}-layout-choice`,
            checked: f === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ n(Vc, {}),
            onChoose: () => a({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ n(
          ya,
          {
            name: `${r}-layout-choice`,
            checked: f === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ n(Jc, {}),
            onChoose: () => a({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ n("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${r}-grid`, children: [
      /* @__PURE__ */ n("h3", { className: "dq-eyebrow", id: `${r}-grid`, children: "Grid" }),
      /* @__PURE__ */ n(
        wa,
        {
          label: "Cards",
          value: i.displayMode === "wall" ? "wall" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "wall", label: "Wall" }
          ],
          onChange: (m) => a({ displayMode: m })
        }
      ),
      o,
      /* @__PURE__ */ l("div", { className: "dq-setting-row", role: "group", "aria-labelledby": `${r}-details`, children: [
        /* @__PURE__ */ n("span", { className: "dq-setting-name", id: `${r}-details`, children: "Card details" }),
        /* @__PURE__ */ n("div", { className: "dq-setting-options", children: [
          ["date", "Date"],
          ["studio", "Studio"],
          ["performers", "Performers"],
          ["tags", "Tags"]
        ].map(([m, g]) => /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ n(
            "input",
            {
              type: "checkbox",
              checked: c.includes(m),
              onChange: (h) => d({
                annotations: h.target.checked ? [...c, m] : c.filter((y) => y !== m)
              })
            }
          ),
          g
        ] }, m)) })
      ] }),
      c.includes("tags") && /* @__PURE__ */ l("div", { className: "dq-setting-row dq-setting-row-top", children: [
        /* @__PURE__ */ n("span", { className: "dq-setting-name", children: "Tags on cards" }),
        /* @__PURE__ */ l("div", { className: "dq-setting-value", children: [
          /* @__PURE__ */ n(
            ar,
            {
              entityType: "tag",
              values: s.annotationParents ?? [],
              onChange: (m) => d({ annotationParents: m }),
              placeholder: "Add a parent tag…",
              inputAriaLabel: "Add a parent tag for card tags",
              containerClassName: "dq-chip-input",
              inputClassName: "dq-chip-input-field",
              allowCreate: !1
            }
          ),
          /* @__PURE__ */ n("p", { className: "dq-drawer-note", children: "Cards show only the tags under these parents, whatever the queue filters." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${r}-bins`, children: [
      /* @__PURE__ */ n("h3", { className: "dq-eyebrow", id: `${r}-bins`, children: "Queue tag bins" }),
      /* @__PURE__ */ n(
        ar,
        {
          entityType: "tag",
          values: s.binParents ?? [],
          onChange: (m) => d({ binParents: m }),
          placeholder: "Add a parent tag…",
          inputAriaLabel: "Add a parent tag for queue bins",
          containerClassName: "dq-chip-input",
          inputClassName: "dq-chip-input-field",
          allowCreate: !1
        }
      ),
      /* @__PURE__ */ n("p", { className: "dq-drawer-note", children: "In the grid, tags under these parents become one-click filters in the filter row, counted on the loaded page." })
    ] })
  ] });
}
function wa({
  label: e,
  value: t,
  options: r,
  onChange: i
}) {
  const a = Lt();
  return /* @__PURE__ */ l("div", { className: "dq-setting-row", children: [
    /* @__PURE__ */ n("span", { className: "dq-setting-name", id: a, children: e }),
    /* @__PURE__ */ n("div", { className: "dq-segmented", role: "group", "aria-labelledby": a, children: r.map((o) => /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        "aria-pressed": t === o.value,
        onClick: () => t !== o.value && i(o.value),
        children: o.label
      },
      o.value
    )) })
  ] });
}
function ya({
  name: e,
  checked: t,
  title: r,
  text: i,
  picture: a,
  onChoose: o
}) {
  const s = Lt(), d = Lt();
  return /* @__PURE__ */ l("label", { className: "dq-layout-card", children: [
    a,
    /* @__PURE__ */ l("span", { className: "dq-layout-card-name", children: [
      /* @__PURE__ */ n(
        "input",
        {
          type: "radio",
          name: e,
          checked: t,
          "aria-labelledby": s,
          "aria-describedby": d,
          onChange: o
        }
      ),
      /* @__PURE__ */ n("span", { id: s, children: r })
    ] }),
    /* @__PURE__ */ n("span", { className: "dq-layout-card-text", id: d, children: i })
  ] });
}
function Vc() {
  return /* @__PURE__ */ l("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ n("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ n("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ n("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ n("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ n("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ n("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function Jc() {
  const e = /* @__PURE__ */ new Set(["80,8", "152,8", "8,44", "224,44"]);
  return /* @__PURE__ */ l("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ n("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 44].flatMap(
      (t) => [8, 80, 152, 224].map((r) => /* @__PURE__ */ n(
        "rect",
        {
          className: e.has(`${r},${t}`) ? "dq-picture-selected" : "dq-picture-strong",
          x: r,
          y: t,
          width: "66",
          height: "30",
          rx: "3"
        },
        `${r},${t}`
      ))
    ),
    /* @__PURE__ */ n("rect", { className: "dq-picture-key", x: "8", y: "80", width: "282", height: "10", rx: "3" })
  ] });
}
const Eo = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
};
function Bi({ entityType: e }) {
  const t = Eo[e];
  return e === "tag" ? /* @__PURE__ */ n(ps, { role: "img", "aria-label": t }) : fn(e) === "audio" ? /* @__PURE__ */ n(Ua, { role: "img", "aria-label": t }) : /* @__PURE__ */ n(jn, { role: "img", "aria-label": t });
}
function Co({
  name: e,
  description: t,
  entityType: r,
  onBack: i,
  backDisabled: a,
  onEdit: o,
  editDisabled: s,
  editing: d = !1,
  toolbar: c,
  trailing: f,
  chipsStart: m,
  chipsAfter: g,
  chipsEnd: h
}) {
  return /* @__PURE__ */ l("header", { className: "dq-review-header", children: [
    /* @__PURE__ */ l("div", { className: "dq-review-header-lead", children: [
      i && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: a,
          onClick: i,
          children: /* @__PURE__ */ n(ki, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ n("span", { className: "dq-review-type", title: Eo[r], children: /* @__PURE__ */ n(Bi, { entityType: r }) }),
      /* @__PURE__ */ n("h1", { title: t || e, children: e }),
      t && /* @__PURE__ */ n("p", { className: "dq-sr-only", children: t }),
      o && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-icon-button dq-icon-button-small",
          "aria-label": "Edit review",
          title: "Edit review",
          "aria-haspopup": "dialog",
          "aria-expanded": d,
          disabled: s,
          onClick: o,
          children: /* @__PURE__ */ n(yn, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ n("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    c,
    /* @__PURE__ */ n("div", { className: "dq-review-header-trail", children: f }),
    /* @__PURE__ */ n("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    m,
    g && /* @__PURE__ */ n("div", { className: "dq-review-chips-after", children: g }),
    h && /* @__PURE__ */ n("div", { className: "dq-review-chips-end", children: h })
  ] });
}
function Ao({
  page: e,
  pages: t,
  onPage: r
}) {
  const [i, a] = q(!1), [o, s] = q(""), d = M(null), c = M(null);
  Q(() => {
    var g;
    i && ((g = d.current) == null || g.select());
  }, [i]);
  const f = (g) => {
    a(!1), g && requestAnimationFrame(() => {
      var h;
      return (h = c.current) == null ? void 0 : h.focus();
    });
  }, m = () => {
    const g = Math.round(Number(o));
    f(!0), Number.isFinite(g) && g >= 1 && g !== e && r(Math.min(t, g));
  };
  return /* @__PURE__ */ l("span", { className: "dq-pager", children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "dq-icon-button",
        "aria-label": "Previous page",
        title: "Previous page",
        disabled: e <= 1,
        onClick: () => r(e - 1),
        children: /* @__PURE__ */ n(ki, { "aria-hidden": "true" })
      }
    ),
    i ? /* @__PURE__ */ n(
      "input",
      {
        ref: d,
        type: "number",
        className: "dq-pager-input",
        "aria-label": `Go to page, 1 to ${t}`,
        min: 1,
        max: t,
        value: o,
        onChange: (g) => s(g.target.value),
        onKeyDown: (g) => {
          g.key === "Enter" ? (g.preventDefault(), m()) : g.key === "Escape" && (g.preventDefault(), g.stopPropagation(), f(!0));
        },
        onBlur: () => f(!1)
      }
    ) : /* @__PURE__ */ l(
      "button",
      {
        ref: c,
        type: "button",
        className: "dq-pager-page",
        "aria-label": `Page ${e} of ${t}. Go to page`,
        title: "Go to page",
        disabled: t <= 1,
        onClick: () => {
          s(String(e)), a(!0);
        },
        children: [
          e,
          " / ",
          t
        ]
      }
    ),
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "dq-icon-button",
        "aria-label": "Next page",
        title: "Next page",
        disabled: e >= t,
        onClick: () => r(e + 1),
        children: /* @__PURE__ */ n(Ri, { "aria-hidden": "true" })
      }
    )
  ] });
}
function ko({
  mode: e,
  disabled: t,
  onChange: r
}) {
  return /* @__PURE__ */ l("div", { className: "dq-segmented", role: "group", "aria-label": "Review layout", children: [
    /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        "aria-pressed": e === "single",
        disabled: t,
        onClick: () => e !== "single" && r("single"),
        children: [
          /* @__PURE__ */ n(ms, { "aria-hidden": "true" }),
          "Single"
        ]
      }
    ),
    /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        "aria-pressed": e === "multiple",
        disabled: t,
        onClick: () => e !== "multiple" && r("multiple"),
        children: [
          /* @__PURE__ */ n(Ti, { "aria-hidden": "true" }),
          "Grid"
        ]
      }
    )
  ] });
}
function zc({
  options: e,
  value: t,
  disabled: r,
  onChange: i
}) {
  return /* @__PURE__ */ n("div", { className: "dq-segmented dq-segmented-icons", role: "group", "aria-label": "Card view", children: e.map((a) => /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      "aria-label": a.label,
      title: a.label,
      "aria-pressed": t === a.value,
      disabled: r,
      onClick: () => t !== a.value && i(a.value),
      children: a.icon
    },
    a.value
  )) });
}
function To({
  items: e,
  disabled: t
}) {
  const [r, i] = q(!1), a = M(null), o = M(null), s = Lt();
  Q(() => {
    var f, m;
    r && ((m = (f = o.current) == null ? void 0 : f.querySelector('[role="menuitem"]:not(:disabled)')) == null || m.focus());
  }, [r]), Q(() => {
    t && i(!1);
  }, [t]);
  const d = (f = !0) => {
    var m;
    i(!1), f && ((m = a.current) == null || m.focus());
  };
  return /* @__PURE__ */ l("div", { className: "dq-menu", onKeyDown: (f) => {
    var h, y;
    if (!r) return;
    const m = [
      ...((h = o.current) == null ? void 0 : h.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], g = m.indexOf(document.activeElement);
    if (f.key === "Escape")
      f.preventDefault(), f.stopPropagation(), d();
    else if (f.key === "Tab")
      d(!1);
    else if (f.key === "ArrowDown" || f.key === "ArrowUp") {
      if (f.preventDefault(), !m.length) return;
      const b = f.key === "ArrowDown" ? 1 : -1;
      m[(g + b + m.length) % m.length].focus();
    } else (f.key === "Home" || f.key === "End") && (f.preventDefault(), (y = m.at(f.key === "Home" ? 0 : -1)) == null || y.focus());
  }, children: [
    /* @__PURE__ */ n(
      "button",
      {
        ref: a,
        type: "button",
        className: "dq-icon-button",
        "aria-label": "More review options",
        title: "More review options",
        "aria-haspopup": "menu",
        "aria-expanded": r,
        "aria-controls": r ? s : void 0,
        disabled: t,
        onClick: () => i((f) => !f),
        children: /* @__PURE__ */ n(hs, { "aria-hidden": "true" })
      }
    ),
    r && /* @__PURE__ */ l(pe, { children: [
      /* @__PURE__ */ n("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => d(!1) }),
      /* @__PURE__ */ n(
        "div",
        {
          ref: o,
          id: s,
          role: "menu",
          "aria-label": "More review options",
          className: "dq-menu-list",
          children: e.map((f) => /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              role: "menuitem",
              disabled: f.disabled,
              onClick: () => {
                d(), f.onSelect();
              },
              children: f.label
            },
            f.label
          ))
        }
      )
    ] })
  ] });
}
function Kn(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Ki(e) {
  return String(e.type).toLowerCase() === "tag";
}
function Vi(e) {
  return !!String(e ?? "").trim();
}
function Ji(e) {
  return [
    ...new Set(
      Kn(e.customFieldCriteria).filter(Ki).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !Vi(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function zi(e, t) {
  const r = Kn(e.customFieldCriteria);
  if (!r.length) return e;
  let i = !1;
  const a = r.map((o) => {
    if (!Ki(o)) return o;
    const s = { ...o };
    for (const [d, c] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const f = t[String(o[d] ?? "")];
      f && !Vi(o[c]) && (s[c] = f, i = !0);
    }
    return s;
  });
  return i ? { ...e, customFieldCriteria: a } : e;
}
function Ro(e, t, r) {
  const i = Kn(e.customFieldCriteria);
  if (!i.length) return e;
  const a = Kn(r.customFieldCriteria), o = (c, f) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (m) => (c[m] ?? void 0) === (f[m] ?? void 0)
  );
  let s = !1;
  const d = i.map((c) => {
    if (!Ki(c)) return c;
    const f = a.find((g) => o(g, c));
    if (!f) return c;
    const m = { ...c };
    for (const [g, h] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const y = t[String(c[g] ?? "")];
      y && c[h] === y && !Vi(f[h]) && (delete m[h], s = !0);
    }
    return m;
  });
  return s ? { ...e, customFieldCriteria: d } : e;
}
async function Qc(e, t, r) {
  if (!or(r))
    throw new Error("Configure an occurrence tag action first.");
  if (!r.steps.length) return t.applications;
  const i = qe(e), a = r.steps.some((d) => nr(d.mode)) ? await ac(i) : "", o = await Pi(r);
  let s = t.applications;
  for (const d of [
    ...o.filter((c) => !nr(c.mode)),
    ...o.filter((c) => nr(c.mode))
  ]) {
    const c = (f) => oc(
      a,
      i,
      t.media.id,
      t.performer.id,
      d.tagIds,
      f
    );
    (d.mode === "MARK_PRESENT" || d.mode === "CLEAR_ABSENCE") && await c("REMOVE"), d.mode !== "CLEAR_ABSENCE" && (s = await Mo(
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
    )), d.mode === "MARK_ABSENT" && await c("ADD");
  }
  return s;
}
async function Qi(e, t) {
  const r = e.occurrence;
  if ($i(r)) return null;
  if (r.targetMode === "selected") return r.performerIds;
  const i = /* @__PURE__ */ new Set(), { _filterExpression: a, ...o } = r.performerFilter;
  for (let s = 1; ; s++) {
    const d = await ee("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        sr({
          findFilter: { page: s, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: o,
          filterExpression: a
        })
      )
    });
    if (d.items.forEach((c) => i.add(c.id)), s * 1e3 >= d.totalCount) return [...i];
    if (!d.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function Io(e) {
  return gn(e.condition) && e.hideConfirmedAbsent !== !1;
}
function Wi(e, t) {
  const { _filterExpression: r, ...i } = e.view.objectFilter, a = e.occurrence, o = {
    mode: "atLeastOne",
    conditionOperator: "and",
    ...t === null ? {} : {
      performerIdsCriterion: { modifier: "includes", value: t }
    },
    ...a.condition === "any" ? {} : {
      performerOccurrenceTagsCriterion: {
        modifier: a.condition,
        value: a.conditionTagIds,
        depth: a.includeSubtags === !1 ? 0 : -1
      }
    }
  }, s = Io(a) && (t == null ? void 0 : t.length) === 1 && a.conditionTagIds.length === 1 ? `${t[0]}:${a.conditionTagIds[0]}` : null;
  return {
    ...e,
    entityType: qe(e),
    actions: [],
    view: {
      ...e.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...r ? [{ group: r }] : [],
            { filter: i },
            { filter: { performerFilterCriterion: o } },
            ...s ? [
              {
                filter: {
                  customFieldCriteria: [
                    {
                      key: Wn,
                      type: "text",
                      modifier: "notEquals",
                      value: s
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
async function Hi(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((r) => [r]) : Promise.all(
    e.conditionTagIds.map((r) => Hn([r], t))
  );
}
function Oo(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function Wc(e, t, r = e.conditionTagIds.map((i) => [i])) {
  const i = new Set(t), a = (o) => o.some((s) => i.has(s));
  switch (e.condition) {
    case "any":
      return !0;
    case "isNull":
      return i.size === 0;
    case "includes":
      return r.some(a);
    case "includesAll":
      return r.every(a);
    case "excludes":
      return !r.some(a);
    case "excludesAll":
      return !r.every(a);
  }
}
function Hc(e, t, r, i, a) {
  if (!Io(e)) return !1;
  const o = no(t, r);
  return e.conditionTagIds.every(
    (s, d) => o.includes(s) || a[d].some((c) => i.includes(c))
  );
}
async function $o(e, t, r, i) {
  if ((t == null ? void 0 : t.length) === 0 || Oo(e.occurrence))
    return { items: [], totalCount: 0 };
  const a = qe(e), o = await pn(
    Wi(e, t),
    { ...e.view.filter, page: r },
    i
  ), s = t === null ? null : new Set(t), d = e.occurrence, c = o.items.length ? await Hi(d, i) : [], f = new Array(o.items.length);
  let m = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, o.items.length) }, async () => {
      for (; m < o.items.length; ) {
        const g = m++, h = o.items[g], y = await ee(
          `/api/tagapplications?hostType=${a}&hostId=${h.id}&contextType=performer`,
          { signal: i }
        );
        f[g] = h.performers.filter((b) => s === null || s.has(b.id)).flatMap((b) => {
          const N = y.filter(
            (A) => A.hostType === a && A.hostId === h.id && A.contextType === "performer" && A.contextId === b.id
          ), O = N.map((A) => A.tag.id);
          return Wc(e.occurrence, O, c) && !Hc(d, h, b.id, O, c) ? [
            {
              key: `${h.id}:${b.id}`,
              media: h,
              performer: b,
              applications: N
            }
          ] : [];
        });
      }
    })
  ), { items: f.flat(), totalCount: o.totalCount };
}
async function Mo(e, t, r) {
  const i = new Set(e.occurrence.tagIds);
  if (r.some((f) => !i.has(f)) || !e.occurrence.multiple && r.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const a = qe(e), o = await hi(a, t.media.id);
  if (!o.performers.some(
    (f) => f.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${a}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${a}&hostId=${o.id}&contextType=performer&contextId=${t.performer.id}`, d = (await ee(s)).filter(
    (f) => f.hostType === a && f.hostId === o.id && f.contextType === "performer" && f.contextId === t.performer.id
  ), c = new Set(r);
  try {
    for (const f of c)
      d.some((m) => m.tag.id === f) || await ee("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: a,
          hostId: o.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: f,
          sourceKey: "user"
        })
      });
    for (const f of d)
      i.has(f.tag.id) && !c.has(f.tag.id) && await ee(`/api/tagapplications/${f.id}`, {
        method: "DELETE"
      });
    return await ee(s);
  } catch (f) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${f instanceof Error ? f.message : "Request failed."}`
    );
  }
}
function Xr(e, t) {
  return {
    added: t.filter((r) => !e.includes(r)),
    removed: e.filter((r) => !t.includes(r))
  };
}
function Yc(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function Pt(e, t, r = !0) {
  var d;
  if (t.occurrence) {
    const c = r ? no(
      await hi(e, t.media.id),
      t.occurrence.performer.id
    ) : [], f = (await ee(Yc(e, t))).filter(
      (m) => m.hostType === e && m.hostId === t.media.id && m.contextType === "performer" && m.contextId === t.occurrence.performer.id
    );
    return wi(f.map((m) => m.tag)), {
      ids: [...new Set(f.map((m) => m.tag.id))],
      names: [...new Set(f.map((m) => m.tag.name))],
      absent: c,
      applications: f
    };
  }
  const i = await hi(e, t.media.id), a = (i.tags ?? []).filter(
    (c) => c.canRemove !== !1 || c.isDerived !== !0
  );
  wi(a);
  const o = Object.keys(i.customFields ?? {}).find(
    (c) => c.toLowerCase() === Gn
  ) ?? Gn, s = ((d = i.customFields) == null ? void 0 : d[o]) ?? [];
  if (!Array.isArray(s) || s.some((c) => !Number.isSafeInteger(c)))
    throw new Error(
      `Confirmed absent tags are invalid. Inspect the ${e} before editing.`
    );
  return {
    ids: a.map((c) => c.id),
    names: a.map((c) => c.name),
    absent: s,
    tags: a
  };
}
async function Yi(e, t, r) {
  if (t.occurrence && we(e))
    await Mo(
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
    for (const [i, a] of [
      ["ADD", r.added],
      ["REMOVE", r.removed]
    ])
      a.length && await ee(
        `/api/${yr(qe(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: i, tagIds: a })
        }
      );
}
async function Xc(e, t, r) {
  t.occurrence && we(e) ? await Qc(e, t.occurrence, r) : await io(qe(e), r, [t.media.id]);
}
function yi(e, t, r, i) {
  const a = (o) => o.filter((s) => i.includes(s));
  return {
    item: e,
    before: t,
    after: r,
    tags: Xr(a(t.ids), a(r.ids)),
    absence: Xr(a(t.absent), a(r.absent))
  };
}
function Zc(e, t) {
  var r;
  for (const [i, a] of [
    [e.tags, t.ids],
    [e.absence, t.absent]
  ])
    if (i.added.some((o) => !a.includes(o)) || i.removed.some((o) => a.includes(o)))
      throw new Error(
        "Undo conflict: affected tags changed since this operation. Inspect the item; no undo changes were made."
      );
  if (t.applications)
    for (const i of e.tags.added) {
      const a = (r = e.after.applications) == null ? void 0 : r.filter((s) => s.tag.id === i).map((s) => s.id).sort(), o = t.applications.filter((s) => s.tag.id === i).map((s) => s.id).sort();
      if (JSON.stringify(a) !== JSON.stringify(o))
        throw new Error(
          "Undo conflict: an affected occurrence application changed. No undo changes were made."
        );
    }
}
const vi = (e) => e instanceof Error ? e.message : "Request failed.", va = (e) => [...e].sort((t, r) => t - r), wn = (e, t) => JSON.stringify(va(e)) === JSON.stringify(va(t)), Ni = (e) => !!(e.tags.added.length || e.tags.removed.length);
function Vn(e, t, r, i) {
  const a = new Set(e), o = new Set(e);
  for (const m of t.steps)
    for (const g of m.tagIds)
      m.mode === "ADD" ? o.add(g) : o.delete(g);
  const s = e.some((m) => !o.has(m));
  if (s && !i)
    return { desired: [...e], conflict: s, skipped: !0, kept: [], replaced: [] };
  const d = new Set(
    t.steps.filter((m) => m.mode === "ADD").flatMap((m) => m.tagIds)
  ), c = [], f = [];
  for (const m of r) {
    const g = m.filter((y) => o.has(y) && !a.has(y)), h = m.filter(
      (y) => o.has(y) && a.has(y) && !d.has(y)
    );
    !g.length || !h.length || (i ? (h.forEach((y) => o.delete(y)), f.push(...h)) : (g.forEach((y) => o.delete(y)), c.push({ tagIds: g, existing: h })));
  }
  return { desired: [...o], conflict: s, skipped: !1, kept: c, replaced: f };
}
function el(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function tl(e, t, r, i) {
  for (const [a, o] of r.entries()) {
    const s = t.filter(
      (f) => f.steps.some(
        (m) => m.mode === "ADD" && m.tagIds.some((g) => o.includes(g))
      )
    );
    if (s.length < 2) continue;
    const d = e.occurrence.conditionTagIds[a];
    let c = `tag ${d}`;
    try {
      c = (await ee(`/api/tags/${d}`, { signal: i })).name;
    } catch {
      i.throwIfAborted();
    }
    throw new Error(
      `${s.map((f) => f.label).join(" and ")} answer the same condition tag, ${c}. Choose one of them.`
    );
  }
}
async function rl(e, t, r, i = () => {
}) {
  if (!t.length || t.some(
    (h) => !or(h, e.entityType) || !h.steps.length || h.steps.some(
      (y) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(y.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const a = structuredClone(e), o = structuredClone(t), s = gn(a.occurrence.condition) && a.occurrence.includeSubtags !== !1 ? await Hi(a.occurrence, r) : [];
  await tl(a, o, s, r);
  const d = await Promise.all(
    o.map(async (h) => ({
      ...h,
      steps: await Pi(h, r)
    }))
  ), c = structuredClone(el(d));
  r.throwIfAborted();
  const f = [
    .../* @__PURE__ */ new Set([
      ...c.steps.flatMap((h) => h.tagIds),
      ...s.flat()
    ])
  ];
  a.view.filter = {
    ...a.view.filter,
    page: 1,
    perPage: 250,
    sort: "id",
    direction: "asc",
    sorts: void 0
  };
  const m = await Qi(a, r), g = /* @__PURE__ */ new Map();
  for (let h = 1; ; h++) {
    r.throwIfAborted();
    const y = await $o(a, m, h, r);
    for (const b of y.items) {
      const N = {
        ids: [...new Set(b.applications.map((A) => A.tag.id))],
        names: b.applications.map((A) => A.tag.name),
        absent: [],
        applications: b.applications
      }, O = Vn(N.ids, c, s, !0);
      g.set(b.key, {
        item: { key: b.key, media: b.media, occurrence: b },
        before: N,
        expected: N,
        conflict: O.conflict,
        status: wn(N.ids, O.desired) ? "unchanged" : "pending"
      });
    }
    if (i(g.size), h * 250 >= y.totalCount) break;
    if (h > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return r.throwIfAborted(), {
    review: a,
    actions: o,
    action: c,
    categories: s,
    touched: f,
    entries: [...g.values()]
  };
}
function nl(e, t, r) {
  const i = (o) => o.ids.filter((s) => r.includes(s));
  if (!wn(i(e), i(t))) return !1;
  const a = (o) => (o.applications ?? []).filter((s) => r.includes(s.tag.id)).map((s) => s.id);
  return wn(a(e), a(t));
}
async function xo(e, t, r, i) {
  let a = 0;
  await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; !t() && a < e.length; ) {
        const o = e[a++];
        await r(o), i();
      }
    })
  );
}
async function il(e, t, r, i, a = !1) {
  const o = e.entries.filter(
    (s) => a ? s.status === "failed" : s.status === "pending"
  );
  await xo(
    o,
    r,
    async (s) => {
      if (s.conflict && !t) {
        s.status = "skipped", s.error = "Conflicting answer skipped.";
        return;
      }
      if (s.unverified) {
        s.error = "The previous write could not be verified. Inspect this occurrence and create a fresh preview before further changes.";
        return;
      }
      let d;
      try {
        if (d = await Pt(qe(e.review), s.item, !1), !nl(s.expected, d, e.touched)) {
          s.status = "skipped", s.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (y) {
        s.status = "failed", s.error = vi(y);
        return;
      }
      const c = Vn(
        s.before.ids,
        e.action,
        e.categories,
        t
      ), f = [
        ...d.ids.filter((y) => !e.touched.includes(y)),
        ...c.desired.filter((y) => e.touched.includes(y))
      ], m = Xr(d.ids, f);
      if (!m.added.length && !m.removed.length) {
        const y = !s.operation && c.kept.length > 0;
        s.status = s.operation ? "changed" : y ? "skipped" : "unchanged", s.error = y ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let g;
      try {
        await Yi(e.review, s.item, m);
      } catch (y) {
        g = y;
      }
      let h = !1;
      try {
        const y = await Pt(qe(e.review), s.item, !1);
        h = !0, s.expected = y;
        const b = yi(
          s.item,
          s.before,
          y,
          e.touched
        );
        if (s.operation = Ni(b) ? b : void 0, g) throw g;
        if (!wn(
          y.ids.filter((N) => e.touched.includes(N)),
          f.filter((N) => e.touched.includes(N))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        s.status = s.operation ? "changed" : "unchanged", s.error = void 0;
      } catch (y) {
        if (s.status = "failed", s.error = vi(y), !h)
          try {
            const b = await Pt(qe(e.review), s.item, !1);
            s.expected = b;
            const N = yi(
              s.item,
              s.before,
              b,
              e.touched
            );
            s.operation = Ni(N) ? N : void 0;
          } catch {
            s.unverified = !0;
          }
      }
    },
    i
  );
}
async function al(e, t, r) {
  await xo(
    e.entries.filter((i) => i.operation),
    t,
    async (i) => {
      const a = i.operation;
      if (i.unverified) {
        i.error = "Undo unavailable: the previous write could not be verified. Inspect this occurrence.";
        return;
      }
      const o = [...a.tags.added, ...a.tags.removed];
      let s = !1;
      try {
        const d = await Pt(qe(e.review), i.item, !1);
        Zc(a, d), s = !0, await Yi(e.review, i.item, {
          added: a.tags.removed,
          removed: a.tags.added
        });
        const c = await Pt(qe(e.review), i.item, !1);
        if (!wn(
          c.ids.filter((f) => o.includes(f)),
          i.before.ids.filter((f) => o.includes(f))
        ))
          throw new Error("Undo did not restore all affected tags.");
        i.operation = void 0, i.expected = c, i.status = "unchanged", i.error = void 0;
      } catch (d) {
        if (i.error = `Undo stopped: ${vi(d)}`, i.status = "failed", s)
          try {
            const c = await Pt(qe(e.review), i.item, !1), f = yi(
              i.item,
              i.before,
              c,
              o
            );
            i.operation = Ni(f) ? f : void 0, i.expected = c;
          } catch {
            i.unverified = !0;
          }
      }
    },
    r
  );
}
async function ol(e, t, r) {
  const i = qe(e), a = e.occurrence, [o, s] = await Promise.all([
    ee(
      `/api/tagapplications?hostType=${i}&contextType=performer&contextId=${t}`,
      { signal: r }
    ),
    Hi(a, r)
  ]), d = o.filter(
    (b) => b.hostType === i && b.contextType === "performer" && b.contextId === t
  );
  wi(d.map((b) => b.tag));
  const c = await Promise.all(
    s.map(async (b, N) => {
      const O = a.conditionTagIds[N];
      return (await ee(`/api/tags/${O}`, { signal: r })).name;
    })
  ), f = new Set(s.flat()), m = new Set(
    [
      ...e.actions.flatMap((b) => b.steps).filter((b) => b.mode === "ADD" || b.mode === "MARK_PRESENT").flatMap((b) => b.tagIds),
      ...a.tagIds
    ].filter((b) => !f.has(b))
  ), g = (b) => {
    const N = /* @__PURE__ */ new Map();
    for (const O of d) {
      if (!b.has(O.tag.id)) continue;
      const A = N.get(O.tag.id) ?? {
        tag: O.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      A.hosts.add(O.hostId), N.set(O.tag.id, A);
    }
    return [...N.values()].map((O) => ({ ...O.tag, count: O.hosts.size })).sort((O, A) => A.count - O.count || po(O, A));
  }, h = s.map((b, N) => ({
    id: a.conditionTagIds[N],
    name: c[N],
    tags: g(new Set(b))
  }));
  m.size && h.push({
    id: null,
    name: s.length ? "Other review tags" : "Review tags",
    tags: g(m)
  });
  const y = /* @__PURE__ */ new Set([...f, ...m]);
  return {
    answered: new Set(
      d.filter((b) => y.has(b.tag.id)).map((b) => b.hostId)
    ).size,
    groups: h
  };
}
function Mr({ tag: e, name: t }) {
  return /* @__PURE__ */ n(ts, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: e ?? void 0 });
}
function Fo({
  review: e,
  performerId: t,
  revision: r = 0
}) {
  const [i, a] = q(null), [o, s] = q(""), d = Dt(qe(e)), c = e.occurrence, f = JSON.stringify([
    e.entityType,
    t,
    c.condition,
    c.conditionTagIds,
    c.includeSubtags,
    c.tagIds,
    e.actions.map((g) => g.steps)
  ]);
  Q(() => {
    const g = new AbortController();
    return a(null), s(""), ol(e, t, g.signal).then((h) => {
      g.signal.aborted || a(h);
    }).catch((h) => {
      g.signal.aborted || s(h instanceof Error ? h.message : "Request failed.");
    }), () => g.abort();
  }, [f, r]);
  const m = (g) => `${g.toLocaleString()} ${g === 1 ? d.one : d.many}`;
  return /* @__PURE__ */ l("section", { className: "dq-panel-section dq-performer-answers", "aria-label": "Existing answers", children: [
    /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ n("h3", { className: "dq-eyebrow", children: "Existing answers" }),
      i && /* @__PURE__ */ n("span", { children: i.answered ? `${m(i.answered)} answered` : "none answered yet" })
    ] }),
    o ? /* @__PURE__ */ l("p", { role: "alert", children: [
      "Could not load existing answers. ",
      o
    ] }) : i ? i.groups.filter((g) => g.id !== null || g.tags.length).map((g) => /* @__PURE__ */ l("div", { className: "dq-answer-group", children: [
      /* @__PURE__ */ l("div", { className: "dq-answer-category", children: [
        /* @__PURE__ */ n("span", { children: g.name }),
        g.id !== null && g.tags.length > 1 && /* @__PURE__ */ n(
          "span",
          {
            className: "dq-badge dq-badge-warning",
            title: "This performer has different answers in this category.",
            children: "Mixed"
          }
        )
      ] }),
      g.tags.length ? /* @__PURE__ */ n("ul", { className: "dq-tags", "aria-label": g.name, children: g.tags.map((h) => /* @__PURE__ */ l("li", { className: "dq-tag", children: [
        /* @__PURE__ */ n(Mr, { tag: h }),
        /* @__PURE__ */ n("span", { className: "dq-chip-count", "aria-hidden": "true", children: h.count.toLocaleString() }),
        /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
          ", ",
          m(h.count)
        ] })
      ] }, h.id)) }) : /* @__PURE__ */ n("p", { className: "dq-muted", children: "None" })
    ] }, g.id ?? "other")) : /* @__PURE__ */ n("p", { className: "dq-muted", children: "Loading existing answers…" })
  ] });
}
async function Na(e, t, r) {
  const i = new Array(e.length);
  let a = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; a < e.length; ) {
        r.throwIfAborted();
        const o = a++, s = e[o];
        try {
          i[o] = [
            s,
            (await ee(`/api/${t}/${s}`, {
              signal: r
            })).name
          ];
        } catch {
          r.throwIfAborted(), i[o] = [
            s,
            `${t === "tags" ? "Tag" : "Performer"} ${s}`
          ];
        }
      }
    })
  ), i;
}
function sl(e, t) {
  const r = 1100 - (Date.now() - e);
  return r <= 0 ? Promise.resolve() : new Promise((i, a) => {
    const o = window.setTimeout(i, r);
    t.addEventListener(
      "abort",
      () => {
        window.clearTimeout(o), a(t.reason);
      },
      { once: !0 }
    );
  });
}
function cl({
  review: e,
  disabled: t,
  performerFlags: r = [],
  onOpen: i,
  onClose: a,
  onWrite: o
}) {
  const [s, d] = q(!1), [c, f] = q(null), [m, g] = q([]), [h, y] = q(!1), [b, N] = q(!1), [O, A] = q(""), [S, E] = q(""), [L, P] = q({}), [H, W] = q(!1), [D, te] = q(!1), G = H && c ? c.review : e, oe = qe(G), C = Dt(oe), I = C.queue, x = oe === "audio" ? "Audio" : "Scene", [Z, ae] = q([]), [le, J] = q(!1), [, de] = q(0), [R, _] = q(0), re = M(null), Ie = M(null), me = M(!1), Be = M(null), Xe = M(!1), _t = M(0), Ze = M(!1), dt = M({ onClose: a, onWrite: o });
  dt.current = { onClose: a, onWrite: o }, Q(() => {
    var k;
    s && ((k = re.current) == null || k.showModal());
  }, [s]), Q(() => {
    if (!s || G.occurrence.targetMode !== "selected") return;
    const k = new AbortController();
    return ae([]), Na(
      G.occurrence.performerIds,
      "performers",
      k.signal
    ).then((z) => {
      k.signal.aborted || ae(z.map(([, Ee]) => Ee));
    }).catch(() => {
    }), () => k.abort();
  }, [
    s,
    G.occurrence.targetMode,
    JSON.stringify(G.occurrence.performerIds)
  ]), Q(
    () => () => {
      var k;
      me.current = !0, (k = Be.current) == null || k.abort();
    },
    []
  ), Q(() => {
    if (!b) return;
    const k = (z) => {
      z.preventDefault(), z.returnValue = "";
    };
    return window.addEventListener("beforeunload", k), () => window.removeEventListener("beforeunload", k);
  }, [b]);
  function Ae() {
    f(null), W(!1), te(!1), y(!1), g([]), E(""), A(""), J(!1);
  }
  function ut() {
    Ze.current || (d(!1), dt.current.onClose(Xe.current), Xe.current = !1, Ae(), requestAnimationFrame(() => {
      var k;
      return (k = Ie.current) == null ? void 0 : k.focus();
    }));
  }
  const V = H && c ? c.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((k) => k.steps.length && !wr(k))
  );
  async function et() {
    const k = V.filter((z) => m.includes(z.id));
    if (!(!k.length || Ze.current)) {
      Ze.current = !0, N(!0), A(""), E("Loading all matching occurrences…"), f(null), W(!1), te(!1), J(!1), Be.current = new AbortController();
      try {
        await sl(_t.current, Be.current.signal);
        const z = await rl(
          e,
          k,
          Be.current.signal,
          (Qe) => E(`Loaded ${Qe.toLocaleString()} matching occurrences…`)
        ), Ee = /* @__PURE__ */ new Map();
        for (const Qe of z.entries)
          for (const mt of Qe.before.applications ?? [])
            Ee.set(mt.tag.id, mt.tag.name);
        const pt = await Na(
          [
            .../* @__PURE__ */ new Set([
              ...z.actions.flatMap(
                (Qe) => Qe.steps.flatMap((mt) => mt.tagIds)
              ),
              ...z.review.occurrence.conditionTagIds,
              ...Ji(z.review.view.objectFilter)
            ])
          ].filter((Qe) => !Ee.has(Qe)),
          "tags",
          Be.current.signal
        );
        Be.current.signal.throwIfAborted(), P({ ...Object.fromEntries(Ee), ...Object.fromEntries(pt) }), f(z), E("Preview ready. No tags have been changed.");
      } catch (z) {
        A(
          Be.current.signal.aborted ? "Preview cancelled. No tags were changed." : String(z instanceof Error ? z.message : z)
        ), E("");
      } finally {
        Ze.current = !1, N(!1), Be.current = null;
      }
    }
  }
  async function De(k) {
    if (!c || Ze.current) return;
    Ze.current = !0, me.current = !1, Xe.current = !0, dt.current.onWrite(), N(!0), W(!0), A(""), k === "undo" && te(!0), E(k === "undo" ? "Undoing batch…" : "Applying batch…");
    const z = () => de((Ee) => Ee + 1);
    try {
      k === "undo" ? await al(c, () => me.current, z) : await il(
        c,
        h,
        () => me.current,
        z,
        k === "retry"
      ), E(
        me.current ? "Stopped after in-flight operations settled. Completed changes are retained." : k === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (Ee) {
      A(Ee instanceof Error ? Ee.message : String(Ee));
    } finally {
      _t.current = Date.now(), Ze.current = !1, N(!1), _((Ee) => Ee + 1), z();
    }
  }
  const Se = (c == null ? void 0 : c.entries) ?? [], vt = Pe(
    () => new Map(
      ((c == null ? void 0 : c.entries) ?? []).map((k) => [
        k.item.key,
        Vn(k.before.ids, c.action, c.categories, h)
      ])
    ),
    [c, h]
  ), ke = (k) => vt.get(k.item.key), be = (k) => Xr(k.before.ids, ke(k).desired), se = (k) => {
    const z = be(k);
    return k.status === "pending" && (z.added.length > 0 || z.removed.length > 0);
  }, $ = (k) => {
    const z = ke(k), Ee = z.skipped ? Xr(
      k.before.ids,
      Vn(k.before.ids, c.action, c.categories, !0).desired
    ) : be(k);
    return [
      z.skipped ? "Skipped unless conflicting answers are replaced. " : "",
      `Add: ${tt(Ee.added)}; Remove: ${tt(Ee.removed)}`,
      ...z.kept.map(
        (pt) => `; Keeps ${tt(pt.existing)} instead of ${tt(pt.tagIds)}`
      )
    ].join("");
  }, ue = Se.filter((k) => k.conflict), Ke = Se.filter(
    (k) => ke(k).kept.length || ke(k).replaced.length
  ), ye = (k) => Se.filter((z) => z.status === k).length, X = Se.some((k) => k.operation), tt = (k) => k.map((z) => L[z] ?? `Tag ${z}`).join(", ") || "None", ft = Se.filter((k) => k.item.media.date).sort((k, z) => k.item.media.date.localeCompare(z.item.media.date)), Nt = (k, z) => /* @__PURE__ */ n(
    "a",
    {
      href: `/${oe}/${k.item.media.id}`,
      target: "_blank",
      rel: "noreferrer",
      "aria-label": `${z} ${C.one}, ${k.item.media.date}`,
      title: k.item.media.title || x,
      children: k.item.media.date
    }
  ), jt = G.occurrence.targetMode === "selected" && G.occurrence.performerIds.length === 1, cr = gn(G.occurrence.condition) && G.occurrence.includeSubtags !== !1 && G.occurrence.conditionTagIds.length > 0;
  return /* @__PURE__ */ l(pe, { children: [
    /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: Ie,
        title: "Apply answers to all matching occurrences",
        disabled: t || !V.length,
        onClick: () => {
          Ae(), i(), d(!0);
        },
        children: [
          /* @__PURE__ */ n(gs, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    s && /* @__PURE__ */ l(
      "dialog",
      {
        ref: re,
        className: "dq-batch-dialog",
        "aria-labelledby": "dq-batch-title",
        "aria-modal": "true",
        onCancel: (k) => {
          k.preventDefault(), ut();
        },
        children: [
          /* @__PURE__ */ n("h2", { id: "dq-batch-title", children: "Batch occurrence approval" }),
          /* @__PURE__ */ n("p", { children: "Apply one or more answers across all matching pages. Only targeted performer occurrences change." }),
          /* @__PURE__ */ n("p", { children: "Keep this page open while running. Results and undo last until you close this dialog or start a new batch." }),
          /* @__PURE__ */ l("fieldset", { disabled: b || H, children: [
            /* @__PURE__ */ n("legend", { children: "Batch scope and answers" }),
            /* @__PURE__ */ n("p", { children: "Uses your current filters. To include every existing appearance, remove filters that exclude already answered occurrences." }),
            /* @__PURE__ */ l("p", { children: [
              "Performer scope:",
              " ",
              $i(G.occurrence) ? "All performers" : G.occurrence.targetMode === "selected" ? Z.join(", ") || `${G.occurrence.performerIds.length} selected performer(s)` : "Matching performer criteria",
              ". Occurrence condition:",
              " ",
              Ii[G.occurrence.condition],
              "."
            ] }),
            r.length > 0 && /* @__PURE__ */ l("p", { className: "dq-batch-flag", children: [
              /* @__PURE__ */ l("strong", { children: [
                "Flagged: ",
                r.join(", "),
                "."
              ] }),
              " Check the earliest and latest ",
              C.many,
              " before applying, or narrow the batch with a date filter."
            ] }),
            gn(G.occurrence.condition) && G.occurrence.hideConfirmedAbsent !== !1 && /* @__PURE__ */ n("p", { children: G.occurrence.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged." }),
            G.occurrence.conditionTagIds.length > 0 && c && /* @__PURE__ */ l("p", { children: [
              "Condition tags:",
              " ",
              tt(G.occurrence.conditionTagIds),
              G.occurrence.includeSubtags === !1 ? " (exact tags only)" : " (including subtags)",
              "."
            ] }),
            /* @__PURE__ */ l("p", { children: [
              "Search: ",
              String(G.view.filter.q || "Any"),
              ".",
              " ",
              Object.keys(G.view.objectFilter).length === 0 && `${I[0].toUpperCase()}${I.slice(1)} filters: None.`
            ] }),
            /* @__PURE__ */ n(
              "fieldset",
              {
                className: "dq-batch-filter-summary",
                disabled: !0,
                "aria-label": `Batch ${I} filters`,
                children: /* @__PURE__ */ n(
                  hn,
                  {
                    filter: G.view.filter,
                    objectFilter: zi(
                      G.view.objectFilter,
                      L
                    ),
                    criteriaDefinitions: oe === "audio" ? xa : Ei,
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
            G.occurrence.targetMode === "filter" && /* @__PURE__ */ n(
              "fieldset",
              {
                className: "dq-batch-filter-summary",
                disabled: !0,
                "aria-label": "Batch performer criteria",
                children: /* @__PURE__ */ n(
                  hn,
                  {
                    filter: {},
                    objectFilter: G.occurrence.performerFilter,
                    criteriaDefinitions: Ci,
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
            jt && /* @__PURE__ */ n(
              Fo,
              {
                review: G,
                performerId: G.occurrence.performerIds[0],
                revision: R
              }
            ),
            !V.length && /* @__PURE__ */ n("p", { children: "Configure an occurrence tag action in this review before starting a batch." }),
            /* @__PURE__ */ l("fieldset", { className: "dq-batch-answers", children: [
              /* @__PURE__ */ n("legend", { children: "Answers" }),
              V.map((k) => /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
                /* @__PURE__ */ n(
                  "input",
                  {
                    type: "checkbox",
                    checked: H || m.includes(k.id),
                    onChange: (z) => {
                      g(
                        z.target.checked ? [...m, k.id] : m.filter((Ee) => Ee !== k.id)
                      ), f(null), E(""), A("");
                    }
                  }
                ),
                k.label
              ] }, k.id))
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: !m.length,
                onClick: () => void et(),
                children: "Preview all matches"
              }
            ),
            /* @__PURE__ */ l("label", { children: [
              "Conflicting answers",
              " ",
              /* @__PURE__ */ l(
                "select",
                {
                  "aria-label": "Conflicting answers",
                  value: h ? "replace" : "skip",
                  onChange: (k) => y(k.target.value === "replace"),
                  children: [
                    /* @__PURE__ */ n("option", { value: "skip", children: "Skip conflicts" }),
                    /* @__PURE__ */ n("option", { value: "replace", children: "Replace conflicting answers" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ l("p", { children: [
              "Conflicts are existing tags an answer removes. Configure opposite answers as removals.",
              cr && " Each condition tag with its subtags is a category: an answer is added only where its category is still empty, and a different existing answer is kept unless conflicting answers are replaced."
            ] })
          ] }),
          /* @__PURE__ */ l("div", { "aria-live": "polite", children: [
            S && /* @__PURE__ */ n("p", { role: "status", children: S }),
            O && /* @__PURE__ */ n("p", { role: "alert", children: O }),
            c && /* @__PURE__ */ l(pe, { children: [
              /* @__PURE__ */ n("p", { children: /* @__PURE__ */ l("strong", { children: [
                Se.length.toLocaleString(),
                " occurrences in",
                " ",
                new Set(
                  Se.map((k) => k.item.media.id)
                ).size.toLocaleString(),
                " ",
                I,
                "s"
              ] }) }),
              H ? /* @__PURE__ */ l("p", { children: [
                ye("changed"),
                " changed; ",
                ye("unchanged"),
                " unchanged;",
                " ",
                ye("skipped"),
                " skipped; ",
                ye("failed"),
                " failed;",
                " ",
                ye("pending"),
                " remaining."
              ] }) : /* @__PURE__ */ l("p", { children: [
                Se.filter(se).length.toLocaleString(),
                " to change; ",
                ye("unchanged").toLocaleString(),
                " already correct; ",
                ue.length.toLocaleString(),
                " conflicts (",
                h ? "will replace" : "will skip",
                ").",
                Ke.length > 0 && ` ${Ke.length.toLocaleString()} already have a different answer in a category (${h ? "will replace" : "kept"}).`
              ] }),
              Se.length > 0 && /* @__PURE__ */ l("p", { children: [
                "Dates:",
                " ",
                ft.length ? /* @__PURE__ */ l(pe, { children: [
                  Nt(ft[0], "Earliest"),
                  ft.length > 1 && /* @__PURE__ */ l(pe, { children: [
                    " to ",
                    Nt(ft[ft.length - 1], "Latest")
                  ] })
                ] }) : "none",
                ft.length < Se.length && `; ${(Se.length - ft.length).toLocaleString()} without a date`,
                "."
              ] })
            ] })
          ] }),
          c && /* @__PURE__ */ l(pe, { children: [
            !H && /* @__PURE__ */ l("p", { children: [
              "Planned additions:",
              " ",
              tt([
                ...new Set(Se.flatMap((k) => be(k).added))
              ]),
              ". Planned removals:",
              " ",
              tt([
                ...new Set(Se.flatMap((k) => be(k).removed))
              ]),
              "."
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => J(!le),
                children: le ? "Hide occurrence details" : "Inspect occurrences and conflicts"
              }
            ),
            le && /* @__PURE__ */ n("div", { className: "dq-batch-items", children: /* @__PURE__ */ l("table", { children: [
              /* @__PURE__ */ n("thead", { children: /* @__PURE__ */ l("tr", { children: [
                /* @__PURE__ */ n("th", { children: "Occurrence" }),
                /* @__PURE__ */ n("th", { children: "Changes / result" })
              ] }) }),
              /* @__PURE__ */ n("tbody", { children: Se.map((k) => {
                var z;
                return /* @__PURE__ */ l("tr", { children: [
                  /* @__PURE__ */ n("td", { children: /* @__PURE__ */ l(
                    "a",
                    {
                      href: `/${oe}/${k.item.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      children: [
                        (z = k.item.occurrence) == null ? void 0 : z.performer.name,
                        " —",
                        " ",
                        k.item.media.title || x
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ l("td", { children: [
                    k.conflict && /* @__PURE__ */ n("strong", { children: "Conflict. " }),
                    H ? `${k.status}. ${k.error ?? ""}` : $(k)
                  ] })
                ] }, k.item.key);
              }) })
            ] }) }),
            /* @__PURE__ */ l("div", { className: "dq-row", children: [
              !D && /* @__PURE__ */ l(pe, { children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button primary",
                    disabled: b || !ye("pending"),
                    onClick: () => void De("apply"),
                    children: H ? "Continue remaining" : "Apply batch"
                  }
                ),
                H && ye("failed") > 0 && /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: b,
                    onClick: () => void De("retry"),
                    children: "Retry failed occurrences"
                  }
                )
              ] }),
              X && /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  disabled: b,
                  onClick: () => void De("undo"),
                  children: "Undo batch"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ l("div", { className: "dq-row", children: [
            b && /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => {
                  var k;
                  me.current = !0, (k = Be.current) == null || k.abort(), E("Stopping after in-flight operations settle…");
                },
                children: [
                  "Cancel ",
                  Be.current ? "preview" : "run"
                ]
              }
            ),
            H && /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: b,
                onClick: Ae,
                children: "New batch"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: b,
                onClick: ut,
                children: "Close"
              }
            )
          ] })
        ]
      }
    )
  ] });
}
const Po = "data-quality.description-collapsed.v1";
function ll() {
  try {
    return localStorage.getItem(Po) === "true";
  } catch {
    return !1;
  }
}
function dl({
  details: e,
  label: t
}) {
  const [r, i] = q(ll), a = rr(() => {
    i((o) => {
      const s = !o;
      try {
        localStorage.setItem(Po, String(s));
      } catch {
      }
      return s;
    });
  }, []);
  return /* @__PURE__ */ l("section", { className: "dq-media-description", "aria-label": `${t} description`, children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "dq-button dq-description-toggle",
        "aria-expanded": !r,
        onClick: a,
        children: "Description"
      }
    ),
    !r && (e != null && e.trim() ? /* @__PURE__ */ n(rs, { className: "dq-description-body", children: e }) : /* @__PURE__ */ n("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
function un({
  performer: e
}) {
  return /* @__PURE__ */ l("span", { className: "dq-performer-avatar", "aria-hidden": "true", children: [
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
function ul({
  ranking: e,
  busy: t,
  error: r,
  focus: i,
  disabled: a,
  labels: o,
  onFocus: s,
  onMore: d,
  onRefresh: c
}) {
  var g;
  const f = e ? e.ranked.slice(0, e.limit) : [], m = !!e && (e.ranked.length > e.limit || (((g = e.candidates[e.cursor]) == null ? void 0 : g.total) ?? 0) > 0);
  return /* @__PURE__ */ l("div", { className: "dq-performer-ranking", children: [
    /* @__PURE__ */ l("div", { className: "dq-performer-ranking-status", children: [
      r ? /* @__PURE__ */ l("p", { role: "alert", children: [
        "Could not rank performers. ",
        r
      ] }) : t ? /* @__PURE__ */ l("p", { role: "status", children: [
        "Counting matching ",
        o.many,
        " per performer…"
      ] }) : e ? /* @__PURE__ */ n("p", { children: f.length ? `Most matching ${o.queue}s first` : `No performer has matching ${o.many}.` }) : null,
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "Refresh counts",
          title: "Refresh counts",
          disabled: t || a,
          onClick: c,
          children: /* @__PURE__ */ n(bs, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ n("div", { className: "dq-queue-list", children: f.map((h) => {
      const y = `${h.count.toLocaleString()} matching ${h.count === 1 ? o.one : o.many}`, b = h.flags.length ? `Flagged: ${h.flags.join(", ")}` : "";
      return /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${h.name}, ${y}${b ? `. ${b}` : ""}`,
          title: b || void 0,
          "aria-current": i === h.id ? "true" : void 0,
          disabled: a,
          onClick: () => s(h.id),
          children: [
            /* @__PURE__ */ n(un, { performer: h }),
            /* @__PURE__ */ n("span", { className: "dq-queue-row-title", children: h.name }),
            b && /* @__PURE__ */ n(ui, { className: "dq-flag-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ n("span", { className: "dq-ranked-count", "aria-hidden": "true", children: h.count.toLocaleString() })
          ]
        },
        h.id
      );
    }) }),
    m && !t && !r && /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "dq-button dq-ranking-more",
        disabled: a,
        onClick: d,
        children: "Show more performers"
      }
    )
  ] });
}
const fl = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], pl = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function ml(e) {
  const t = e.getBoundingClientRect(), r = Math.min(600, window.innerWidth - 32), i = Math.min(Math.max(16, t.right - r), window.innerWidth - r - 16), a = t.bottom + 8;
  return { top: a, left: i, width: r, maxHeight: Math.max(160, window.innerHeight - a - 16) };
}
function Ln(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function hl(e, t) {
  const r = $i(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", i = e.conditionTagIds.map(
    (o) => t[o] === void 0 ? "…" : t[o] ?? "Unavailable tag"
  ), a = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${Ln(i, "or")}`,
    includesAll: `has ${Ln(i, "and")}`,
    excludes: `has none of ${Ln(i, "or")}`,
    excludesAll: `missing ${Ln(i, "or")}`
  };
  return `${r} · ${a[e.condition]}`;
}
function gl({
  scope: e,
  disabled: t,
  editing: r = !1,
  onChange: i,
  onEditCriteria: a
}) {
  const [o, s] = q(!1), [d, c] = q(null), f = M(null), m = M(null), g = Lt(), h = en(e.conditionTagIds), y = hl(e, h);
  ir(() => {
    if (!o || !f.current) return;
    const A = () => f.current && c(ml(f.current));
    return A(), window.addEventListener("resize", A), () => window.removeEventListener("resize", A);
  }, [o]), Q(() => {
    var S, E;
    if (!o) return;
    const A = (S = m.current) == null ? void 0 : S.querySelector('[aria-pressed="true"]');
    A && !A.disabled ? A.focus() : (E = m.current) == null || E.focus();
  }, [o]);
  const b = () => {
    s(!1), requestAnimationFrame(() => {
      var A;
      return (A = f.current) == null ? void 0 : A.focus();
    });
  }, N = (A) => {
    if (!(A.target instanceof Element && A.target.closest('[role="dialog"]') !== m.current || A.defaultPrevented)) {
      if (A.key === "Escape")
        A.preventDefault(), b();
      else if (A.key === "Tab" && m.current) {
        const E = [...m.current.querySelectorAll(pl)].filter((W) => W.closest('[role="dialog"]') === m.current).sort(
          (W, D) => W.compareDocumentPosition(D) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!E.length) return;
        const L = E[0], P = E[E.length - 1], H = document.activeElement;
        A.shiftKey && (H === L || H === m.current) ? (A.preventDefault(), P.focus()) : !A.shiftKey && H === P && (A.preventDefault(), L.focus());
      }
    }
  }, O = !["any", "isNull"].includes(e.condition);
  return /* @__PURE__ */ l("div", { className: "dq-scope", children: [
    /* @__PURE__ */ l(
      "button",
      {
        ref: f,
        type: "button",
        className: "dq-header-button dq-scope-button",
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        "aria-controls": o ? g : void 0,
        title: y,
        onClick: () => o ? b() : s(!0),
        children: [
          /* @__PURE__ */ n(ws, { "aria-hidden": "true" }),
          /* @__PURE__ */ n("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ n("span", { className: "dq-scope-summary", children: y }),
          /* @__PURE__ */ n(ja, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ l(pe, { children: [
      /* @__PURE__ */ n("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: b }),
      /* @__PURE__ */ l(
        "div",
        {
          ref: m,
          id: g,
          role: "dialog",
          "aria-label": "Queue scope",
          className: "dq-scope-popover",
          tabIndex: -1,
          style: d ? {
            top: d.top,
            left: d.left,
            width: d.width,
            maxHeight: d.maxHeight
          } : void 0,
          onKeyDown: N,
          children: [
            /* @__PURE__ */ l("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ n("legend", { className: "dq-eyebrow", children: "Performers to review" }),
              /* @__PURE__ */ n("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: fl.map(({ mode: A, label: S }) => /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === A,
                  onClick: () => e.targetMode !== A && i({ targetMode: A }),
                  children: S
                },
                A
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ n(
                ar,
                {
                  entityType: "performer",
                  values: e.performerIds,
                  onChange: (A) => i({ performerIds: A }),
                  placeholder: "All performers...",
                  allowCreate: !1
                }
              ),
              e.targetMode === "filter" && /* @__PURE__ */ l("div", { className: "dq-scope-criteria", children: [
                /* @__PURE__ */ n("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ n(
                  hn,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: Ci,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (A) => i({ performerFilter: A })
                  }
                ) }),
                /* @__PURE__ */ l("button", { type: "button", className: "dq-button", onClick: a, children: [
                  /* @__PURE__ */ n(yn, { "aria-hidden": "true" }),
                  "Edit criteria"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ l("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ n("legend", { className: "dq-eyebrow", children: "Occurrence tags" }),
              /* @__PURE__ */ n(
                "select",
                {
                  className: "dq-select",
                  "aria-label": "Occurrence condition",
                  value: e.condition,
                  onChange: (A) => i({ condition: A.target.value }),
                  children: Oi.map((A) => /* @__PURE__ */ n("option", { value: A, children: Ii[A] }, A))
                }
              ),
              O && /* @__PURE__ */ l(pe, { children: [
                /* @__PURE__ */ n(
                  ar,
                  {
                    entityType: "tag",
                    values: e.conditionTagIds,
                    onChange: (A) => i({ conditionTagIds: A }),
                    placeholder: "Add a condition tag…",
                    allowCreate: !1
                  }
                ),
                /* @__PURE__ */ l("div", { className: "dq-scope-options", children: [
                  /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ n(
                      "input",
                      {
                        type: "checkbox",
                        checked: e.includeSubtags ?? !0,
                        onChange: (A) => i({ includeSubtags: A.target.checked })
                      }
                    ),
                    "Include subtags"
                  ] }),
                  gn(e.condition) && /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ n(
                      "input",
                      {
                        type: "checkbox",
                        checked: e.hideConfirmedAbsent ?? !0,
                        onChange: (A) => i({ hideConfirmedAbsent: A.target.checked })
                      }
                    ),
                    "Hide occurrences confirmed absent"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ l("div", { className: "dq-scope-footer", children: [
              /* @__PURE__ */ n("p", { children: r ? "Applies to this queue at once, and Save review keeps it." : "Applies to this queue at once. Save it to the review from the filter row." }),
              /* @__PURE__ */ n("button", { type: "button", className: "dq-button", onClick: b, children: "Done" })
            ] })
          ]
        }
      )
    ] })
  ] });
}
function _n(e) {
  const {
    page: t,
    perPage: r,
    sort: i,
    direction: a,
    sorts: o,
    seed: s,
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
function bl(e) {
  const t = e.occurrence;
  return JSON.stringify([
    qe(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {},
    t.flagPerformerTagIds ?? []
  ]);
}
async function wl(e, t) {
  const r = qe(e) === "audio", i = new Set(e.occurrence.flagPerformerTagIds ?? []), a = (d) => ({
    id: d.id,
    name: d.name,
    total: (r ? d.audioCount : d.videoCount) ?? 0,
    flags: (d.tags ?? []).filter((c) => i.has(c.id)).map((c) => c.name)
  }), o = e.occurrence, s = [];
  if (o.targetMode === "selected" && o.performerIds.length > 0)
    for (const d of o.performerIds) {
      const c = await Qs(
        `/api/performers/${d}`,
        { signal: t }
      );
      c && s.push(a(c));
    }
  else {
    const { _filterExpression: d, ...c } = o.targetMode === "filter" ? o.performerFilter : {};
    for (let f = 1; ; f++) {
      const m = await ee(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            sr({
              findFilter: {
                page: f,
                perPage: 1e3,
                sort: r ? "audio_count" : "video_count",
                direction: "desc"
              },
              objectFilter: c,
              filterExpression: d
            })
          )
        }
      );
      if (s.push(...m.items.map(a)), f * 1e3 >= m.totalCount || !m.items.length) break;
    }
  }
  return s.sort((d, c) => c.total - d.total || d.id - c.id);
}
function Lo(e, t, r) {
  const i = Wi(e, [t]);
  return Ys(i, i.view.filter, r);
}
function Do(e, t) {
  const r = e.findIndex(
    (i) => i.count < t.count || i.count === t.count && i.name.localeCompare(t.name) > 0
  );
  e.splice(r < 0 ? e.length : r, 0, t);
}
function qi(e, t, r, i) {
  if (t >= e.length) return !0;
  const a = e[t].total;
  return a <= 0 ? !0 : r.length >= i && a < r[i - 1].count;
}
async function yl(e, t, r, i, a = {}) {
  const o = _n(e), s = bl(e), d = Oo(e.occurrence), c = (t == null ? void 0 : t.signature) === o && !t.partial ? t : {
    signature: o,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: d ? "" : s,
    candidates: d ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await wl(e, i),
    cursor: 0,
    ranked: [],
    limit: r,
    complete: !1
  }, { candidates: f } = c, m = [...c.ranked];
  let g = c.cursor, h = !1;
  const y = (b) => ({
    ...c,
    cursor: g,
    ranked: [...m],
    limit: r,
    complete: !b && qi(f, g, m, r),
    ...b ? { partial: b } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: a.concurrency ?? 6 }, async () => {
        var b;
        for (; !h && !qi(f, g, m, r); ) {
          i.throwIfAborted();
          const N = f[g++], O = await Lo(e, N.id, i);
          O > 0 && Do(m, { ...N, count: O }), (b = a.onProgress) == null || b.call(a, y(!0));
        }
      })
    );
  } catch (b) {
    throw h = !0, b;
  }
  return i.throwIfAborted(), y(!1);
}
function vl(e, t, r) {
  const i = e.candidates.findIndex((o) => o.id === t);
  if (e.partial || i < 0 || i >= e.cursor) return e;
  const a = e.ranked.filter((o) => o.id !== t);
  return r > 0 && Do(a, { ...e.candidates[i], count: r }), {
    ...e,
    ranked: a,
    complete: qi(e.candidates, e.cursor, a, e.limit)
  };
}
function Zr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, d) => Zr(s, t[d]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, i = t, a = Object.keys(r).sort(), o = Object.keys(i).sort();
  return a.length === o.length && a.every(
    (s, d) => s === o[d] && Zr(r[s], i[s])
  );
}
const Yn = [
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
], Nl = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function Hr(e) {
  const t = we(e) ? e.occurrence : void 0;
  return {
    filter: it({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, qe(e)),
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
function qa(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function Si(e, t) {
  let r;
  if (we(e) && t.has("performer") && (r = Number(t.get("performer")), !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!Yn.some((d) => d !== "performer" && t.has(d))) {
    const d = Hr(e);
    return {
      query: r ? { ...d, performerFocus: r } : d,
      startAtEnd: d.startFrom === "end"
    };
  }
  const a = {
    q: t.get("q") ?? "",
    page: Number(t.get("page") ?? 1),
    perPage: Number(t.get("perPage") ?? 40),
    sort: t.get("sort") ?? "date",
    direction: t.get("direction") === "asc" ? "asc" : "desc"
  };
  if (t.has("seed") && (a.seed = Number(t.get("seed"))), t.get("sorts")) {
    const d = t.get("sorts").split(",").map((c) => {
      const f = c.lastIndexOf(":");
      return { key: c.slice(0, f), direction: c.slice(f + 1) };
    });
    if (d.some((c) => !c.key || !["asc", "desc"].includes(c.direction)))
      throw new Error("Invalid review URL sort.");
    a.sorts = d, a.sort = d[0].key, a.direction = d[0].direction;
  }
  let o;
  if (we(e) && (o = {
    ...Nl,
    ...qa(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(o.targetMode) || !Oi.includes(o.condition) || !Array.isArray(o.performerIds) || !Array.isArray(o.conditionTagIds) || typeof o.includeSubtags != "boolean" || typeof o.hideConfirmedAbsent != "boolean" || [...o.performerIds, ...o.conditionTagIds].some(
    (d) => !Number.isSafeInteger(d) || d <= 0
  ) || !o.performerFilter || typeof o.performerFilter != "object" || Array.isArray(o.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: it(a, qe(e)),
      objectFilter: qa(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: o,
      ...r ? { performerFocus: r } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
function mn(e, t) {
  const r = new URLSearchParams(window.location.search);
  Yn.forEach((i) => r.delete(i)), r.set("review", e);
  for (const i of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[i] !== void 0 && r.set(i, String(t.filter[i]));
  Array.isArray(t.filter.sorts) && r.set(
    "sorts",
    t.filter.sorts.map((i) => `${i.key}:${i.direction}`).join(",")
  ), r.set("filters", JSON.stringify(t.objectFilter)), r.set("searchMode", t.searchMode), r.set("startFrom", t.startFrom), t.performerScope && r.set("performerScope", JSON.stringify(t.performerScope)), t.performerFocus && r.set("performer", String(t.performerFocus)), window.history.replaceState(
    null,
    "",
    `${window.location.pathname}?${r}${window.location.hash}`
  );
}
function Qt(e, t) {
  const r = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return we(e) ? {
    ...e,
    view: r,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: r };
}
function Sa(e, t) {
  return !t || !we(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function oi(e, t) {
  if (!t) return e;
  const r = /* @__PURE__ */ new Map();
  for (const i of e)
    r.set(i.media.id, [...r.get(i.media.id) ?? [], i]);
  return [...r.values()].reverse().flat();
}
const Rt = (e) => e instanceof Error ? e.message : "Request failed.", si = 50, ql = [], Ea = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function Sl(e, t) {
  const r = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? os(r == null ? void 0 : r.width, r == null ? void 0 : r.height) : "",
    r != null && r.duration ? La(r.duration) : ""
  ].filter(Boolean).join(" · ");
}
function El({ media: e, kind: t }) {
  const [r, i] = q(!1);
  return /* @__PURE__ */ n("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: r ? t === "audio" ? /* @__PURE__ */ n(Ua, {}) : /* @__PURE__ */ n(jn, {}) : /* @__PURE__ */ n(
    "img",
    {
      src: gi(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => i(!0)
    }
  ) });
}
function Cl({
  tags: e,
  preview: t,
  showPreview: r,
  trees: i,
  actionTagIds: a,
  label: o
}) {
  const s = Gi(t), d = r ? s : null, c = e == null ? void 0 : e.absent, f = fo(
    Pe(() => [...a, ...c ?? []], [a, c])
  ), m = (P) => f[P] ?? { id: P, name: f[P] === void 0 ? "…" : "Unavailable tag" }, g = (P) => mo(P.map(m)), h = d && e ? ho(d, e, i) : null, y = e ? wc(e) : [], b = new Set(y.map((P) => P.id)), N = new Set(h == null ? void 0 : h.removed), O = new Set(h == null ? void 0 : h.markedAbsent), A = new Set(h == null ? void 0 : h.absenceCleared), S = /* @__PURE__ */ l("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ n(di, { "aria-hidden": "true" }),
    "absent"
  ] }), E = g((h == null ? void 0 : h.added) ?? []), L = g(((h == null ? void 0 : h.markedAbsent) ?? []).filter((P) => !b.has(P)));
  return /* @__PURE__ */ l("section", { className: "dq-panel-section", "aria-label": o, children: [
    /* @__PURE__ */ n("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ l(pe, { children: [
      y.length || E.length || L.length ? /* @__PURE__ */ l("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        y.map(
          (P) => N.has(P.id) ? /* @__PURE__ */ l("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ l("del", { children: [
              "− ",
              /* @__PURE__ */ n(Mr, { tag: P })
            ] }),
            O.has(P.id) && S
          ] }, P.id) : /* @__PURE__ */ n("li", { className: "dq-tag", children: /* @__PURE__ */ n(Mr, { tag: P }) }, P.id)
        ),
        E.map((P) => /* @__PURE__ */ n("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ l("ins", { children: [
          "+ ",
          /* @__PURE__ */ n(Mr, { tag: P })
        ] }) }, `added-${P.id}`)),
        L.map((P) => /* @__PURE__ */ l("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ n("ins", { children: /* @__PURE__ */ n(Mr, { tag: P }) }),
          S
        ] }, `absent-${P.id}`))
      ] }) : /* @__PURE__ */ n("p", { className: "dq-muted", children: "None" }),
      e.absent.length > 0 && /* @__PURE__ */ l(pe, { children: [
        /* @__PURE__ */ n("h4", { className: "dq-subheading", children: "Confirmed absent" }),
        /* @__PURE__ */ n("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: g(e.absent).map((P) => /* @__PURE__ */ l(
          "li",
          {
            className: `dq-tag dq-tag-absent${A.has(P.id) ? " dq-tag-removed" : ""}`,
            children: [
              /* @__PURE__ */ n(di, { "aria-hidden": "true" }),
              A.has(P.id) ? /* @__PURE__ */ l("del", { children: [
                "− ",
                /* @__PURE__ */ n(Mr, { tag: P })
              ] }) : /* @__PURE__ */ n(Mr, { tag: P })
            ]
          },
          P.id
        )) })
      ] })
    ] }) : /* @__PURE__ */ n("p", { className: "dq-muted", children: "Loading…" })
  ] });
}
function Al({
  review: e,
  canWrite: t,
  canAssess: r = !0,
  onBusy: i,
  onSaveDefaults: a,
  editRequest: o = 0,
  onEditRequestHandled: s,
  pageControls: d
}) {
  var Rn;
  const c = qe(e), f = Dt(c), m = c === "audio" ? "Audio" : "Scene", g = (u) => {
    var w;
    return u.title || ((w = u.files[0]) == null ? void 0 : w.basename) || m;
  }, h = (u) => `${u.occurrence ? `${u.occurrence.performer.name} — ` : ""}${g(u.media)}`, y = M(null), b = M("");
  if (!y.current)
    try {
      y.current = Si(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (u) {
      b.current = Rt(u), y.current = { query: Hr(e), startAtEnd: !1 };
    }
  const [N, O] = q(null), [A, S] = q(""), [E, L] = q(""), P = M(null), H = M(null), W = M(null), D = M(null), [te, G] = q(!!b.current), oe = M(0), [C, I] = q(y.current.query), x = M(C);
  x.current = C;
  const [Z, ae] = q(0), le = M(y.current.startAtEnd), [J, de] = q([]), [R, _] = q(null), re = M(null), [Ie, me] = q(null), [Be, Xe] = q(0), _t = Pe(() => {
    if (!R) return null;
    const u = J.findIndex((w) => w.key === R.key);
    return u < 0 ? null : J.slice(u + 1).find((w) => w.media.id !== R.media.id) ?? null;
  }, [R, J]), [Ze, dt] = q(0), [Ae, ut] = q(!1), [V, et] = q(!1), De = M(!1), Se = M(!0), vt = M(null);
  Q(() => (Se.current = !0, () => {
    Se.current = !1;
  }), []);
  const [ke, be] = q(b.current), [se, $] = q(""), [ue, Ke] = q(null), [ye, X] = q(!1), [tt, ft] = q([]), Nt = M([]), jt = M(null), cr = M(null), k = M(null);
  Q(() => {
    var u, w;
    ye && ((w = (u = k.current) == null ? void 0 : u.querySelector("input")) == null || w.focus());
  }, [ye]);
  const [z, Ee] = q(!1), [pt, Qe] = q(!1);
  Q(() => {
    if (Ae || z || !cr.current) return;
    const u = requestAnimationFrame(() => {
      if (document.querySelector(Ea)) return;
      const w = cr.current;
      cr.current = null;
      const F = document.activeElement;
      F && F !== document.body || w != null && w.isConnected && !w.disabled && w.focus();
    });
    return () => cancelAnimationFrame(u);
  }, [Ae, z, Z]);
  const [mt, Pr] = q([]), [Lr, Xn] = q({}), Ut = M(null), Ot = M(0), [Ne, vr] = q({});
  Q(() => {
    let u = !0;
    return Promise.all(
      Ji(C.objectFilter).map(
        async (w) => [
          String(w),
          (await ee(`/api/tags/${w}`)).name
        ]
      )
    ).then((w) => {
      u && vr(Object.fromEntries(w));
    }).catch(() => {
    }), () => {
      u = !1;
    };
  }, [C.objectFilter]);
  const Sn = Pe(
    () => zi(C.objectFilter, Ne),
    [Ne, C.objectFilter]
  ), Ht = M(0), Ve = M(e);
  Ve.current = e;
  const ot = N ?? e, qt = Pe(
    () => Qt(ot, C),
    [ot, C]
  ), Gt = Pe(
    () => Sa(qt, C.performerFocus),
    [qt, C.performerFocus]
  ), he = M(Gt);
  he.current = Gt;
  const Bt = M(qt);
  Bt.current = qt;
  const [Oe, lr] = q("items"), [We, En] = q(null), Yt = M(null), Dr = M("");
  function Ue(u) {
    const w = typeof u == "function" ? u(Yt.current) : u;
    Yt.current = w, En(w);
  }
  const [St, Xt] = q(!1), [ht, _r] = q(null), ge = M(null), Te = we(qt) ? _n(qt) : "", [gt, rt] = q(0), [Et, bt] = q(null);
  Q(() => () => {
    var u;
    return (u = ge.current) == null ? void 0 : u.controller.abort();
  }, []), Q(() => {
    const u = ge.current;
    !u || u.signature === Te || (u.controller.abort(), ge.current = null, Xt(!1));
  }, [Te]), Q(() => {
    var F;
    const u = Yt.current;
    if (Oe !== "performers" || !Te || ((F = ge.current) == null ? void 0 : F.signature) === Te || Dr.current === Te || (u == null ? void 0 : u.signature) === Te && u.complete)
      return;
    const w = (u == null ? void 0 : u.signature) === Te ? u : null;
    pr(u, (w == null ? void 0 : w.limit) ?? si);
  }, [Oe, Te, We, ht, St]);
  const Nr = C.performerFocus, dr = JSON.stringify(
    we(qt) ? qt.occurrence.flagPerformerTagIds ?? [] : []
  );
  Q(() => {
    if (!Nr) {
      bt(null);
      return;
    }
    let u = !0;
    const w = new Set(JSON.parse(dr));
    return ee(
      `/api/performers/${Nr}`
    ).then((F) => {
      u && bt({
        id: Nr,
        name: F.name,
        flags: (F.tags ?? []).filter((B) => w.has(B.id)).map((B) => B.name)
      });
    }).catch(() => {
    }), () => {
      u = !1;
    };
  }, [Nr, dr]);
  const Kt = C.startFrom !== (e.view.startFrom ?? "end") || !Zr(
    JSON.parse(It(Qt(e, C))),
    JSON.parse(It(Qt(e, Hr(e))))
  ), Je = V || Ae || ye, Vt = Number(C.filter.page);
  function nt(u, w = !1) {
    De.current || (b.current = "", le.current = w, x.current = u, I(u), dt(0), ut(!0), w || mn(e.id, u), ae((F) => F + 1));
  }
  function ur() {
    if (De.current = !1, et(!1), Se.current && vt.current) {
      const u = vt.current;
      vt.current = null, nt(u.query, u.startAtEnd);
    }
  }
  Q(() => {
    const u = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const w = Si(
            Ve.current,
            new URLSearchParams(window.location.search)
          );
          De.current ? vt.current = w : nt(w.query, w.startAtEnd);
        } catch (w) {
          be(Rt(w));
        }
    };
    return window.addEventListener("popstate", u), () => window.removeEventListener("popstate", u);
  }, [e.id]), Q(() => (i(V || Ae || ye || !!N), () => i(!1)), [V, Ae, ye, !!N, i]);
  async function fe(u, w, F) {
    if (we(u)) {
      const K = await $o(
        u,
        Ut.current,
        w,
        F
      );
      return {
        items: K.items.map((Y) => ({
          key: Y.key,
          media: Y.media,
          occurrence: Y
        })),
        totalCount: K.totalCount
      };
    }
    const B = await pn(
      u,
      { ...u.view.filter, page: w },
      F
    );
    return {
      items: B.items.map((K) => ({ key: String(K.id), media: K })),
      totalCount: B.totalCount
    };
  }
  function fr(u, w, F, B = !1, K = !1) {
    if (!Se.current || vt.current) return;
    G(!0), de(
      K ? u.items : oi(u.items, x.current.startFrom === "end")
    ), dt(u.totalCount), Ct(F, B);
    const Y = {
      ...x.current,
      filter: { ...x.current.filter, page: w }
    };
    x.current = Y, I(Y), mn(e.id, Y);
  }
  function Ct(u, w = !1) {
    (u == null ? void 0 : u.key) !== (R == null ? void 0 : R.key) && (re.current = null), (u == null ? void 0 : u.media.id) !== (R == null ? void 0 : R.media.id) && me(w && u ? u.media.id : null), _(u);
  }
  Q(() => {
    if (b.current) return;
    const u = new AbortController();
    D.current = u;
    const w = ++Ht.current;
    return ut(!0), be(""), $(""), re.current = null, me(null), _(null), de([]), X(!1), (async () => {
      const F = Sa(
        Qt(Ve.current, x.current),
        x.current.performerFocus
      );
      Ut.current = we(F) ? await Qi(F, u.signal) : null;
      let B = Number(F.view.filter.page), K = await fe(F, B, u.signal);
      const Y = Math.max(
        1,
        Math.ceil(K.totalCount / Number(F.view.filter.perPage))
      );
      (le.current || B > Y) && (B = Y, K = await fe(F, B, u.signal)), le.current = !1;
      const $e = F.view.startFrom === "end" ? -1 : 1;
      for (; we(F) && !K.items.length && B + $e >= 1 && B + $e <= Y && !u.signal.aborted; )
        B += $e, K = await fe(F, B, u.signal);
      if (w !== Ht.current || u.signal.aborted) return;
      const He = oi(K.items, F.view.startFrom === "end");
      fr(K, B, He[0] ?? null);
    })().catch((F) => {
      !u.signal.aborted && w === Ht.current && be(Rt(F));
    }).finally(() => {
      !u.signal.aborted && w === Ht.current && (G(!0), ut(!1));
    }), () => {
      u.abort(), Ht.current++;
    };
  }, [Z, e.id]), Q(() => {
    if (Ke(null), !R) return;
    let u = !0;
    return Pt(c, R).then((w) => {
      u && (Ke(w), Pr(
        we(e) ? w.ids.filter((F) => e.occurrence.tagIds.includes(F)) : []
      ));
    }).catch((w) => {
      u && be(`Could not load current tags. ${Rt(w)}`);
    }), () => {
      u = !1;
    };
  }, [R]), Q(() => {
    if (!we(e) || e.actions.length)
      return;
    let u = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (w) => [
          w,
          (await ee(`/api/tags/${w}`)).name
        ]
      )
    ).then((w) => {
      u && Xn(Object.fromEntries(w));
    }).catch((w) => {
      u && be(Rt(w));
    }), () => {
      u = !1;
    };
  }, [e]);
  async function Cn(u = !1, w = !1, F = !1) {
    var Rr;
    if (!R) return;
    const B = J.findIndex((Me) => Me.key === R.key), K = C.startFrom === "end" ? -1 : 1, Y = ((Rr = re.current) == null ? void 0 : Rr.key) === R.key ? re.current : { key: R.key, page: Vt, before: J.slice(0, B + 1).map((Me) => Me.key), after: J.slice(B + 1).map((Me) => Me.key) }, $e = new Set(Y.after), He = new Set(Y.before), gr = J.find((Me) => {
      var Mt;
      return $e.has(Me.key) || (K === 1 || Vt < Y.page) && ((Mt = re.current) == null ? void 0 : Mt.key) === R.key && !He.has(Me.key);
    });
    if (!u && gr) {
      Ct(gr, F);
      return;
    }
    const Ye = u ? He : new Set(J.map((Me) => Me.key)), wt = 1100 - (Date.now() - Ot.current);
    wt > 0 && await new Promise((Me) => window.setTimeout(Me, wt));
    let Ge = K === -1 && !u ? Math.max(1, Vt - 1) : Vt;
    for (; Se.current && !vt.current; ) {
      let Me = await fe(Gt, Ge);
      const Mt = Math.max(
        1,
        Math.ceil(Me.totalCount / Number(C.filter.perPage))
      );
      Ge > Mt && (Ge = Mt, Me = await fe(Gt, Ge));
      const Ir = oi(Me.items, K === -1), In = new Map(Ir.map((ct) => [ct.key, ct])), Or = u ? Y.after.flatMap((ct) => {
        const On = In.get(ct);
        return On ? [On] : [];
      }) : [], cn = new Set(Or.map((ct) => ct.key)), er = u ? {
        ...Me,
        items: [
          ...Or,
          ...Ir.filter(
            (ct) => ct.key !== R.key && !cn.has(ct.key)
          )
        ]
      } : Me;
      if (w) {
        re.current = Y, fr(er, Ge, R, !1, u);
        return;
      }
      const ln = K === -1 && Vt === 1 && !u ? void 0 : er.items.find(
        (ct) => !Ye.has(ct.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(u && K === -1 && Ge === Y.page) || $e.has(ct.key))
      );
      if (ln || (K === -1 ? Ge <= 1 : Ge >= Mt)) {
        fr(
          er,
          Ge,
          ln ?? null,
          F,
          u
        ), ln || $(
          Me.totalCount ? `Reached the end in this direction. Matching items remain available from the ${f.queue} pages.` : `No matching ${f.many}.`
        );
        return;
      }
      Ge += K;
    }
  }
  async function At(u, w = !1, F = !1, B = !1) {
    if (N || !R || De.current || Ae || ye && !F)
      return;
    const K = F || B || !!(u != null && u.steps.length), Y = K && !w;
    if (K && (!t || !ue) || u && wr(u) && !r) return;
    De.current = !0, et(!0), be(""), $("");
    const $e = J.findIndex((Ye) => Ye.key === R.key), He = K && !w && $e >= 0 ? J[$e + 1] ?? null : null;
    He && (de(
      (Ye) => Ye.filter((wt) => wt.key !== R.key)
    ), Ct(He, !0));
    let gr = !1;
    try {
      if (K) {
        const Ye = await Pt(c, R);
        if (u)
          await Xc(Gt, R, u);
        else {
          const Ge = B && we(e) ? e.occurrence.tagIds.filter((Mt) => Ye.ids.includes(Mt)) : Nt.current, Me = Xr(Ge, B ? mt : tt);
          await Yi(Gt, R, Me);
        }
        Ot.current = Date.now();
        const wt = await Pt(c, R);
        He || Ke(wt), gr = !0, X(!1), $("Tags saved."), R.occurrence && (nn(R.occurrence.performer.id), rt((Ge) => Ge + 1));
      }
      if (!Se.current || vt.current) return;
      K ? await Cn(!0, w, Y) : w || await Cn(), w && F && requestAnimationFrame(() => {
        var Ye;
        return (Ye = jt.current) == null ? void 0 : Ye.focus();
      });
    } catch (Ye) {
      if (be(
        gr ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${Rt(Ye)}` : K ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${Rt(Ye)}` : `Could not advance. ${Rt(Ye)}`
      ), K && !gr) {
        He && (de(J), me(null), Xe((wt) => wt + 1), _(R)), Ot.current = Date.now();
        try {
          Ke(await Pt(c, R));
        } catch {
          Ke(null), be(
            (wt) => `${wt} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      ur();
    }
  }
  const qr = !ye && !N && !z && !pt && (R != null || Ae || V);
  Di({
    surface: "local",
    enabled: qr,
    actionCount: e.actions.length,
    onAction: (u, w) => {
      const F = e.actions[u];
      F && At(F, w);
    },
    onFind: () => Qe(!0)
  });
  const kt = (u) => V || Ae || !ue || !!N || !t && u.steps.length > 0 || !r && wr(u);
  function jr() {
    if (!a || N || De.current || ye) return;
    W.current = document.activeElement, H.current = {
      error: ke,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(x.current),
      items: J,
      current: R,
      total: Ze,
      targets: Ut.current,
      stayedCursor: re.current
    };
    const u = structuredClone(Qt(e, x.current));
    O(u), L(bn(u)), S(""), $(""), be("");
  }
  Q(() => {
    if (!o) {
      oe.current = 0;
      return;
    }
    o !== oe.current && te && !Ae && (oe.current = o, jr(), s == null || s());
  }, [o, Ae, te]);
  function Jt() {
    O(null), S(""), requestAnimationFrame(() => {
      const u = W.current;
      u != null && u.isConnected && u !== document.body && u.focus();
    });
  }
  function Re() {
    var w;
    const u = H.current;
    !u || V || ((w = D.current) == null || w.abort(), Ht.current++, x.current = u.query, I(u.query), de(u.items), _(u.current), dt(u.total), Ut.current = u.targets, re.current = u.stayedCursor, ut(!1), be(u.error), $(""), window.history.replaceState(window.history.state, "", u.url), Jt());
  }
  async function rn() {
    if (!N || !a || De.current) return;
    const u = Qt(
      { ...N, name: N.name.trim() },
      x.current
    ), w = vn(u);
    if (w) {
      S(w);
      return;
    }
    De.current = !0, et(!0), S("");
    try {
      if (await a(u) === !1) throw new Error("Could not save review.");
      Jt(), $("Review saved.");
    } catch (F) {
      S(
        "Could not save review. Your edits are still open. " + Rt(F)
      );
    } finally {
      ur();
    }
  }
  async function An() {
    if (!a || De.current) return;
    const u = Qt(e, {
      ...x.current,
      filter: { ...x.current.filter, page: 1 }
    });
    De.current = !0, et(!0), be("");
    try {
      if (await a(u) === !1) throw new Error("Could not save review.");
      $("Queue saved to this review.");
    } catch (w) {
      be("Could not save queue. " + Rt(w));
    } finally {
      ur();
    }
  }
  const ze = C.performerScope, Sr = (u) => {
    const { performerFocus: w, ...F } = x.current, B = w && !("targetMode" in u || "performerIds" in u || "performerFilter" in u);
    nt({
      ...F,
      ...B ? { performerFocus: w } : {},
      filter: { ...F.filter, page: 1 },
      performerScope: { ...ze, ...u }
    });
  };
  async function pr(u, w) {
    var K;
    const F = Bt.current;
    if (!we(F)) return;
    (K = ge.current) == null || K.controller.abort();
    const B = {
      signature: _n(F),
      controller: new AbortController()
    };
    ge.current = B, Dr.current = "", Xt(!0), _r(null);
    try {
      const Y = await yl(F, u, w, B.controller.signal, {
        onProgress: ($e) => {
          ge.current === B && Ue($e);
        }
      });
      ge.current === B && Ue(Y);
    } catch (Y) {
      ge.current === B && !B.controller.signal.aborted && (Dr.current = B.signature, _r({ signature: B.signature, message: Rt(Y) }));
    } finally {
      ge.current === B && (ge.current = null, Xt(!1));
    }
  }
  function Er() {
    var u;
    (u = ge.current) == null || u.controller.abort(), ge.current = null, Xt(!1), Ue((w) => w && { ...w, partial: !0, complete: !1 });
  }
  async function nn(u) {
    var K;
    const w = Bt.current;
    if (!we(w)) return;
    if (ge.current) {
      Er();
      return;
    }
    const F = _n(w);
    if (((K = Yt.current) == null ? void 0 : K.signature) !== F || Yt.current.partial) return;
    const B = 1100 - (Date.now() - Ot.current);
    B > 0 && await new Promise((Y) => window.setTimeout(Y, B));
    try {
      const Y = await Lo(w, u);
      if (ge.current) {
        Er();
        return;
      }
      Ue(
        ($e) => ($e == null ? void 0 : $e.signature) === F ? vl($e, u, Y) : $e
      );
    } catch {
      Ue(
        (Y) => (Y == null ? void 0 : Y.signature) === F ? { ...Y, partial: !0, complete: !1 } : Y
      );
    }
  }
  const Cr = C.performerFocus ? We == null ? void 0 : We.candidates.find((u) => u.id === C.performerFocus) : void 0, je = (Et == null ? void 0 : Et.id) === C.performerFocus ? Et : Cr ?? null;
  function Ur(u) {
    if (De.current) return;
    const w = {
      ...x.current,
      performerFocus: u,
      filter: { ...x.current.filter, page: 1 }
    };
    nt(w, w.startFrom === "end"), lr("items");
  }
  function Ar() {
    const { performerFocus: u, ...w } = x.current;
    nt(
      { ...w, filter: { ...w.filter, page: 1 } },
      w.startFrom === "end"
    );
  }
  const Gr = M(null);
  Gr.current ?? (Gr.current = bo());
  const an = Gr.current, Br = go(ot.actions), Zn = Pe(
    () => ot.actions.flatMap((u) => u.steps.flatMap((w) => w.tagIds)),
    [ot.actions]
  ), kn = M(null);
  Q(() => {
    const u = kn.current, w = u == null ? void 0 : u.querySelector('[aria-current="true"]');
    if (!u || !w) return;
    const F = u.getBoundingClientRect(), B = w.getBoundingClientRect();
    B.top < F.top ? u.scrollTop -= F.top - B.top : B.bottom > F.bottom && (u.scrollTop += B.bottom - F.bottom);
  }, [R == null ? void 0 : R.key, Oe]);
  const Kr = M(null), on = M(null);
  Q(() => {
    var F, B;
    const u = on.current;
    if (!u) return;
    on.current = null;
    const w = [...((F = Kr.current) == null ? void 0 : F.querySelectorAll(".dq-partner")) ?? []];
    (B = w.find((K) => K.dataset.partnerKey === u) ?? w[0]) == null || B.focus();
  }, [R == null ? void 0 : R.key]);
  const st = V || Ae || ye || !!N, zt = Pe(
    () => N ? Qt(N, C) : null,
    [N, C]
  ), kr = Pe(
    () => zt != null && bn(zt) !== E,
    [zt, E]
  );
  function mr() {
    R ? Pt(c, R).then(Ke).catch((u) => be(Rt(u))) : nt(x.current);
  }
  const hr = ke ? /* @__PURE__ */ l("p", { role: "alert", children: [
    ke,
    " ",
    /* @__PURE__ */ n("button", { type: "button", disabled: V, onClick: mr, children: R ? "Reload tags" : "Retry queue" })
  ] }) : null, $t = V || Ae || R != null && !ue, ei = Math.max(1, Number(C.filter.perPage) || 1), Tn = M(1);
  Ae || (Tn.current = Math.max(1, Math.ceil(Ze / ei)));
  const sn = Tn.current, Vr = ze && R ? J.filter(
    (u) => u.media.id === R.media.id && u.key !== R.key
  ) : [], Tr = R != null && R.occurrence && R.occurrence.performer.id === C.performerFocus ? (je == null ? void 0 : je.flags) ?? [] : R != null && R.occurrence ? ((Rn = We == null ? void 0 : We.candidates.find((u) => u.id === R.occurrence.performer.id)) == null ? void 0 : Rn.flags) ?? [] : [], Zt = (u) => {
    var w;
    return u.title || ((w = u.files[0]) == null ? void 0 : w.basename) || `${c === "audio" ? "Audio" : "Video"} ${u.id}`;
  }, ve = R ? Sl(R.media, c) : "";
  return /* @__PURE__ */ l(
    "section",
    {
      className: `dq-review-workspace${c === "audio" ? " dq-audio" : ""}`,
      "aria-label": ze ? c === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : c === "audio" ? "Audio review" : "Video review",
      onClickCapture: (u) => {
        var B;
        const w = u.target instanceof Element ? u.target.closest("button") : null, F = (w == null ? void 0 : w.getAttribute("aria-label")) ?? ((B = w == null ? void 0 : w.textContent) == null ? void 0 : B.trim()) ?? "";
        w && !w.closest(Ea) && /^(Filters|Edit filter:|Edit criteria)/.test(F) && (cr.current = w);
      },
      children: [
        /* @__PURE__ */ n(
          Co,
          {
            name: e.name,
            description: e.description,
            entityType: Fe(e),
            onBack: d == null ? void 0 : d.onBack,
            backDisabled: st,
            onEdit: N ? () => {
              var u;
              return (u = P.current) == null ? void 0 : u.focus();
            } : jr,
            editDisabled: !N && (st || !a),
            editing: !!N,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ l("fieldset", { className: "dq-review-toolbar", disabled: V || ye, children: [
                /* @__PURE__ */ n("legend", { className: "dq-sr-only", children: c === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ n(
                  hn,
                  {
                    filter: C.filter,
                    objectFilter: Sn,
                    criteriaDefinitions: c === "audio" ? xa : Ei,
                    customFieldEntityType: c,
                    totalCount: Ze,
                    sortOptions: c === "audio" ? ns : Fa,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ n(
                      Ao,
                      {
                        page: Math.min(Math.max(1, Vt || 1), sn),
                        pages: sn,
                        onPage: (u) => nt({
                          ...x.current,
                          filter: it(
                            { ...x.current.filter, page: u },
                            c
                          )
                        })
                      }
                    ),
                    onFilterChange: (u) => {
                      (u.sort !== x.current.filter.sort || u.direction !== x.current.filter.direction) && (u = { ...u, sorts: void 0 }), nt({
                        ...x.current,
                        filter: it(u, c)
                      });
                    },
                    onObjectFilterChange: (u) => {
                      nt({
                        ...x.current,
                        objectFilter: Ro(
                          u,
                          Ne,
                          x.current.objectFilter
                        ),
                        filter: { ...x.current.filter, page: 1 }
                      });
                    }
                  }
                )
              ] })
            ),
            trailing: /* @__PURE__ */ l(pe, { children: [
              ze && /* @__PURE__ */ n(
                gl,
                {
                  scope: ze,
                  disabled: V || ye,
                  editing: !!N,
                  onChange: Sr,
                  onEditCriteria: () => Ee(!0)
                }
              ),
              we(Gt) && t && /* @__PURE__ */ n(
                cl,
                {
                  review: Gt,
                  disabled: Je || !!N,
                  performerFlags: C.performerFocus ? je == null ? void 0 : je.flags : void 0,
                  onOpen: () => {
                    De.current = !0, et(!0);
                  },
                  onWrite: () => {
                    Ot.current = Date.now();
                  },
                  onClose: (u) => {
                    if (u) {
                      Ot.current = Date.now();
                      const w = x.current.performerFocus;
                      w ? nn(w) : Er(), rt((F) => F + 1), new Promise((F) => window.setTimeout(F, 1100)).then(() => {
                        ur(), Se.current && ae((F) => F + 1);
                      });
                    } else ur();
                  }
                }
              ),
              (d == null ? void 0 : d.onGrid) && /* @__PURE__ */ n(
                ko,
                {
                  mode: "single",
                  disabled: st,
                  onChange: () => {
                    var u;
                    return (u = d.onGrid) == null ? void 0 : u.call(d);
                  }
                }
              ),
              (d == null ? void 0 : d.onManage) && /* @__PURE__ */ n(
                To,
                {
                  disabled: st,
                  items: [
                    {
                      label: "Manage reviews",
                      disabled: d.manageDisabled,
                      onSelect: () => {
                        var u;
                        return (u = d.onManage) == null ? void 0 : u.call(d);
                      }
                    }
                  ]
                }
              )
            ] }),
            chipsStart: C.performerFocus ? /* @__PURE__ */ l("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ n(
                un,
                {
                  performer: {
                    id: C.performerFocus,
                    name: (je == null ? void 0 : je.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ l("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ n("strong", { children: (je == null ? void 0 : je.name) ?? `performer ${C.performerFocus}` })
              ] }),
              je != null && je.flags.length ? /* @__PURE__ */ l(
                "span",
                {
                  className: "dq-focus-flag",
                  title: `Flagged: ${je.flags.join(", ")}`,
                  children: [
                    /* @__PURE__ */ n(ui, { "aria-hidden": "true" }),
                    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
                      "Flagged: ",
                      je.flags.join(", ")
                    ] })
                  ]
                }
              ) : null,
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: Je,
                  onClick: Ar,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            chipsEnd: N ? /* @__PURE__ */ n("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : Kt ? /* @__PURE__ */ l(pe, { children: [
              /* @__PURE__ */ n("span", { className: "dq-defaults-note", children: "Queue differs from the saved review" }),
              /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  className: "dq-text-button",
                  title: "Save the current queue criteria to this review",
                  disabled: Je || !a,
                  onClick: () => void An(),
                  children: [
                    /* @__PURE__ */ n(Ga, { "aria-hidden": "true" }),
                    "Save to review"
                  ]
                }
              ),
              /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  className: "dq-text-button",
                  title: "Reset the queue to the review's saved criteria",
                  disabled: Je,
                  onClick: () => {
                    const u = Hr(e);
                    nt(u, u.startFrom === "end");
                  },
                  children: [
                    /* @__PURE__ */ n(Ba, { "aria-hidden": "true" }),
                    "Reset"
                  ]
                }
              )
            ] }) : void 0
          }
        ),
        d == null ? void 0 : d.notices,
        /* @__PURE__ */ l("div", { className: "dq-review-area", children: [
          N && zt && /* @__PURE__ */ n(
            So,
            {
              drawerRef: P,
              draft: zt,
              onChange: (u) => O(u),
              direction: C.startFrom,
              onDirectionChange: (u) => nt({ ...x.current, startFrom: u }),
              tagGroups: ql,
              trees: Br,
              saving: V,
              saveDisabled: Ae,
              error: A,
              dirty: kr,
              notices: hr && /* @__PURE__ */ n("div", { className: "dq-review-feedback", children: hr }),
              onSave: () => void rn(),
              onCancel: Re
            }
          ),
          /* @__PURE__ */ n("div", { className: "dq-review-main", children: /* @__PURE__ */ l("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ l("div", { className: "dq-review-stage", children: [
              R ? /* @__PURE__ */ l(pe, { children: [
                /* @__PURE__ */ l("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ n("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ l(
                    "a",
                    {
                      href: `/${c}/${R.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${f.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ n("span", { children: Zt(R.media) }),
                        /* @__PURE__ */ n(Ka, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  ve && /* @__PURE__ */ n("span", { className: "dq-stage-meta", children: ve })
                ] }),
                /* @__PURE__ */ l("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ n("div", { className: "dq-player-frame", children: [R, _t].filter(Boolean).map((u) => {
                    var B, K, Y, $e, He;
                    const w = u, F = w.key === R.key;
                    return /* @__PURE__ */ n(
                      "div",
                      {
                        className: F ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": F ? void 0 : !0,
                        inert: F ? void 0 : !0,
                        children: c === "audio" ? /* @__PURE__ */ n(
                          is,
                          {
                            streamUrl: bi("audio", w.media.id),
                            format: ((B = w.media.files[0]) == null ? void 0 : B.format) ?? "",
                            title: g(w.media),
                            coverUrl: F ? gi("audio", w.media) : void 0,
                            duration: ((K = w.media.files[0]) == null ? void 0 : K.duration) ?? 0,
                            autostart: F && Ie === w.media.id
                          }
                        ) : /* @__PURE__ */ n(
                          Pa,
                          {
                            videoId: w.media.id,
                            streamUrl: bi("video", w.media.id),
                            posterUrl: F ? gi("video", w.media) : void 0,
                            duration: ((Y = w.media.files[0]) == null ? void 0 : Y.duration) ?? 0,
                            format: ($e = w.media.files[0]) == null ? void 0 : $e.format,
                            audioCodec: (He = w.media.files[0]) == null ? void 0 : He.audioCodec,
                            extensionSurface: F ? "quick-view" : void 0,
                            autostart: F && Ie === w.media.id,
                            keyboardShortcutsEnabled: F,
                            showAbLoop: F,
                            clip: w.media.parentVideoId != null ? {
                              start: w.media.clipStartSec ?? 0,
                              end: w.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${w.media.id}:${Be}`
                    );
                  }) }),
                  c === "audio" && /* @__PURE__ */ n(
                    dl,
                    {
                      details: R.media.details,
                      label: f.one
                    },
                    R.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ n("p", { role: "status", className: "dq-stage-status", children: Ae ? "Loading review…" : Ze ? "Reached the end in this direction." : `No matching ${f.many}.` }),
              ot.actions.length > 0 ? /* @__PURE__ */ n(
                yc,
                {
                  actions: ot.actions,
                  mediaKind: c,
                  isDisabled: (u) => ye || kt(u),
                  busy: $t,
                  tags: ue,
                  trees: Br,
                  preview: an,
                  onApply: (u, w) => void At(u, w),
                  onFind: () => Qe(!0),
                  findDisabled: ye || !!N,
                  paused: !!N
                }
              ) : we(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ l(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || V || ye || !ue || !!N || !R,
                  children: [
                    /* @__PURE__ */ n("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((u) => /* @__PURE__ */ l("label", { children: [
                      /* @__PURE__ */ n(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: mt.includes(u),
                          onChange: (w) => Pr(
                            e.occurrence.multiple ? w.target.checked ? [...mt, u] : mt.filter((F) => F !== u) : [u]
                          )
                        }
                      ),
                      Lr[u] ?? "Loading tag…"
                    ] }, u)),
                    /* @__PURE__ */ l("div", { className: "dq-row", children: [
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => Pr([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void At(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void At(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ l("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ l("div", { className: "dq-panel-body", ref: Kr, children: [
                R && /* @__PURE__ */ l(pe, { children: [
                  /* @__PURE__ */ l("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ l("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ n("span", { className: "dq-sr-only", children: R.occurrence ? R.occurrence.performer.name : `this ${f.one}` })
                    ] }),
                    /* @__PURE__ */ l("div", { className: "dq-reviewing-who", children: [
                      R.occurrence && /* @__PURE__ */ n(un, { performer: R.occurrence.performer }),
                      /* @__PURE__ */ l("div", { children: [
                        /* @__PURE__ */ n("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: R.occurrence ? R.occurrence.performer.name : `This ${f.one}` }),
                        /* @__PURE__ */ n("p", { className: "dq-reviewing-note", children: ze ? `Tags apply to this performer in this ${f.queue}` : `Tags apply to the whole ${f.one}` })
                      ] })
                    ] }),
                    Tr.length > 0 && /* @__PURE__ */ l("p", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
                      /* @__PURE__ */ n(ui, { "aria-hidden": "true" }),
                      "Flagged: ",
                      Tr.join(", ")
                    ] })
                  ] }),
                  Vr.length > 0 && /* @__PURE__ */ l(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${f.queue}`,
                      children: [
                        /* @__PURE__ */ l("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          f.queue
                        ] }),
                        /* @__PURE__ */ n("div", { className: "dq-partners", children: Vr.map((u) => {
                          var w, F, B;
                          return /* @__PURE__ */ l(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (w = u.occurrence) == null ? void 0 : w.performer.name,
                              "aria-label": (F = u.occurrence) == null ? void 0 : F.performer.name,
                              "data-partner-key": u.key,
                              disabled: Je,
                              onClick: () => {
                                on.current = R.key, Ct(u), be("");
                              },
                              children: [
                                u.occurrence && /* @__PURE__ */ n(un, { performer: u.occurrence.performer }),
                                /* @__PURE__ */ n("span", { children: (B = u.occurrence) == null ? void 0 : B.performer.name })
                              ]
                            },
                            u.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ n(
                    Cl,
                    {
                      tags: ue,
                      preview: an,
                      showPreview: !ye,
                      trees: Br,
                      actionTagIds: Zn,
                      label: `Current ${ze ? "occurrence" : f.one} tags`
                    }
                  ),
                  ye && /* @__PURE__ */ l(
                    "fieldset",
                    {
                      ref: k,
                      disabled: V,
                      className: "dq-panel-section dq-tag-editor",
                      children: [
                        /* @__PURE__ */ l("legend", { className: "dq-eyebrow", children: [
                          "Edit ",
                          ze ? "occurrence" : f.one,
                          " tags"
                        ] }),
                        /* @__PURE__ */ n(
                          ar,
                          {
                            entityType: "tag",
                            values: tt,
                            onChange: ft,
                            placeholder: "Choose tags for this item...",
                            allowCreate: !1
                          }
                        ),
                        /* @__PURE__ */ l("div", { className: "dq-row", children: [
                          /* @__PURE__ */ n(
                            "button",
                            {
                              type: "button",
                              className: "dq-button primary",
                              disabled: !ue,
                              onClick: () => void At(void 0, !0, !0),
                              children: "Save"
                            }
                          ),
                          /* @__PURE__ */ n(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              disabled: !ue,
                              onClick: () => void At(void 0, !1, !0),
                              children: "Save & next"
                            }
                          ),
                          /* @__PURE__ */ n(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              onClick: () => {
                                X(!1), requestAnimationFrame(() => {
                                  var u;
                                  return (u = jt.current) == null ? void 0 : u.focus();
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
                we(qt) && C.performerFocus && /* @__PURE__ */ n(
                  Fo,
                  {
                    review: qt,
                    performerId: C.performerFocus,
                    revision: gt
                  }
                )
              ] }),
              /* @__PURE__ */ l("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ l("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !N && hr,
                  se && /* @__PURE__ */ n("p", { role: "status", children: se })
                ] }),
                !t && /* @__PURE__ */ n("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                R && /* @__PURE__ */ l("div", { className: "dq-panel-actions", "aria-busy": $t || void 0, children: [
                  /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      ref: jt,
                      className: "dq-button",
                      disabled: Je || !!N || !t || !ue,
                      onClick: () => {
                        Nt.current = [...ue.ids], ft([...ue.ids]), X(!0);
                      },
                      children: [
                        /* @__PURE__ */ n(ys, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: Je || !!N,
                      onClick: () => void At(),
                      children: [
                        /* @__PURE__ */ n(vs, { "aria-hidden": "true" }),
                        "Skip",
                        ze ? " performer" : ` ${f.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ l("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              ze && /* @__PURE__ */ l(
                "div",
                {
                  className: "dq-segmented dq-segmented-fill",
                  role: "group",
                  "aria-label": "Queue view",
                  children: [
                    /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": Oe === "items",
                        onClick: () => lr("items"),
                        children: c === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": Oe === "performers",
                        onClick: () => lr("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              ze && Oe === "performers" ? /* @__PURE__ */ n(
                ul,
                {
                  ranking: (We == null ? void 0 : We.signature) === Te ? We : null,
                  busy: St,
                  error: (ht == null ? void 0 : ht.signature) === Te ? ht.message : "",
                  focus: C.performerFocus,
                  disabled: Je,
                  labels: f,
                  onFocus: Ur,
                  onMore: () => {
                    const u = Yt.current;
                    u && pr(u, u.limit + si);
                  },
                  onRefresh: () => {
                    Ue(null), pr(null, si);
                  }
                }
              ) : /* @__PURE__ */ n("div", { className: "dq-queue-list", ref: kn, children: J.map((u) => {
                var F;
                const w = (R == null ? void 0 : R.key) === u.key;
                return /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: h(u),
                    "aria-label": h(u),
                    "aria-current": w ? "true" : void 0,
                    disabled: Je,
                    onClick: () => {
                      Ct(u), be(""), $("");
                    },
                    children: [
                      /* @__PURE__ */ n(El, { media: u.media, kind: c }),
                      /* @__PURE__ */ l("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ n("span", { className: "dq-queue-row-title", children: g(u.media) }),
                        /* @__PURE__ */ l("span", { className: "dq-queue-row-meta", children: [
                          u.occurrence && /* @__PURE__ */ l(pe, { children: [
                            /* @__PURE__ */ n(un, { performer: u.occurrence.performer }),
                            /* @__PURE__ */ n("span", { className: "dq-queue-row-performer", children: u.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ n("span", { className: "dq-queue-row-detail", children: [
                            u.media.date,
                            u.occurrence ? "" : (F = u.media.files[0]) != null && F.duration ? La(u.media.files[0].duration) : ""
                          ].filter(Boolean).join(" · ") })
                        ] })
                      ] })
                    ]
                  },
                  u.key
                );
              }) })
            ] })
          ] }) })
        ] }),
        ze && /* @__PURE__ */ n(
          as,
          {
            open: z,
            onClose: () => Ee(!1),
            criteria: Ci,
            activeFilter: ze.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (u) => {
              Ee(!1), Sr({ performerFilter: u });
            }
          }
        ),
        pt && /* @__PURE__ */ n(
          Ui,
          {
            actions: e.actions,
            trees: Br,
            isDisabled: (u) => kt(u),
            onApply: (u, w) => {
              Qe(!1), At(u, w);
            },
            onClose: () => Qe(!1)
          }
        )
      ]
    }
  );
}
function kl(e) {
  var d, c, f;
  const [t, r] = q({}), [i, a] = q(""), o = (((d = e == null ? void 0 : e.presentation) == null ? void 0 : d.annotations) ?? []).includes("tags") ? ((c = e == null ? void 0 : e.presentation) == null ? void 0 : c.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...o,
      ...((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.binParents) ?? []
    ])
  ]);
  return Q(() => {
    let m = !0;
    return r({}), a(""), Promise.all(
      JSON.parse(s).map(
        async (g) => [g, await Hn([g])]
      )
    ).then((g) => {
      m && r(Object.fromEntries(g));
    }).catch(() => {
      m && a(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      m = !1;
    };
  }, [s]), { ids: t, error: i };
}
function Tl(e, t, r) {
  const i = t == null ? void 0 : t.presentation, a = (i == null ? void 0 : i.annotations) ?? [], o = (i == null ? void 0 : i.annotationParents) ?? [];
  return {
    ...e,
    details: void 0,
    organized: !1,
    groups: [],
    galleries: [],
    date: a.includes("date") ? e.date : void 0,
    studioId: a.includes("studio") ? e.studioId : void 0,
    studioName: a.includes("studio") ? e.studioName : void 0,
    performers: a.includes("performers") ? e.performers : [],
    tags: a.includes("tags") && o.length > 0 ? (e.tags ?? []).filter(
      (s) => o.some(
        (d) => {
          var c;
          return d !== s.id && ((c = r[d]) == null ? void 0 : c.includes(s.id));
        }
      )
    ) : []
  };
}
function Rl({
  videos: e,
  review: t,
  savedObjectFilter: r,
  trees: i,
  disabled: a,
  onToggle: o
}) {
  var b;
  const s = ((b = t.presentation) == null ? void 0 : b.binParents) ?? [], d = new Set(
    s.flatMap((N) => (i[N] ?? []).filter((O) => O !== N))
  ), c = s.every((N) => i[N]), f = _o(t.view.objectFilter, r).bins.filter(
    (N) => !c || d.has(N)
  ), m = /* @__PURE__ */ new Map();
  for (const N of e)
    for (const O of N.tags ?? [])
      if (d.has(O.id)) {
        const A = m.get(O.id) ?? { name: O.name, count: 0 };
        A.count++, m.set(O.id, A);
      }
  const g = f.filter((N) => !m.has(N)), h = en(g);
  for (const N of g)
    m.set(N, {
      name: h[N] === void 0 ? "…" : h[N] ?? "Unavailable tag",
      count: 0
    });
  if (!s.length) return null;
  const y = [...m].sort((N, O) => N[1].name.localeCompare(O[1].name));
  return /* @__PURE__ */ l("div", { className: "dq-bins", role: "group", "aria-label": "Tag bins on this page", children: [
    /* @__PURE__ */ n("span", { className: "dq-bins-label", "aria-hidden": "true", children: "On this page" }),
    y.map(([N, O]) => {
      const A = f.includes(N);
      return /* @__PURE__ */ l(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": A,
          title: A ? `Show every video again, not only ${O.name}` : `Show only videos tagged ${O.name}`,
          disabled: a,
          onClick: () => o(N),
          children: [
            A && /* @__PURE__ */ n(Va, { "aria-hidden": "true" }),
            O.name,
            " ",
            /* @__PURE__ */ n("span", { className: "dq-bin-count", children: O.count })
          ]
        },
        N
      );
    }),
    !y.length && /* @__PURE__ */ n("span", { className: "dq-bins-empty", children: "No matching tag bins on this page." })
  ] });
}
function xr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Il(e) {
  if (!xr(e) || Object.keys(e).length !== 1 || !xr(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !xr(t.tagsCriterion)) return null;
  const { value: r, modifier: i, depth: a, ...o } = t.tagsCriterion;
  return Array.isArray(r) && r.length === 1 && typeof r[0] == "number" && i === "INCLUDES" && a === 0 && !Object.keys(o).length ? r[0] : null;
}
function _o(e, t) {
  let r = e;
  const i = [];
  for (; ; ) {
    if (t && Zr(r, t)) {
      r = t;
      break;
    }
    const a = Object.keys(r);
    if (a.length !== 1 || a[0] !== "_filterExpression") break;
    const o = r._filterExpression;
    if (!xr(o) || o.operator !== "AND" || !Array.isArray(o.children))
      break;
    const s = o.children, d = Il(s.at(-1));
    if (d == null || s.length > 3) break;
    let c = {}, f = null, m = !0;
    for (const [g, h] of s.slice(0, -1).entries())
      !xr(h) || Object.keys(h).length !== 1 ? m = !1 : g === 0 && xr(h.filter) && Object.keys(h.filter).length ? c = h.filter : !f && xr(h.group) ? f = h.group : m = !1;
    if (!m) break;
    i.unshift(d), r = f ? { ...c, _filterExpression: f } : c;
  }
  return { base: r, bins: i };
}
function Ol(e, t, r) {
  const { base: i, bins: a } = _o(e.view.objectFilter, r);
  return (a.includes(t) ? a.filter((s) => s !== t) : [...a, t]).reduce($l, { ...e, view: { ...e.view, objectFilter: i } });
}
function $l(e, t) {
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
function Ca(e, t, r) {
  return {
    ...e,
    view: {
      ...e.view,
      filter: { ...r, page: 1 },
      objectFilter: t.view.objectFilter,
      searchMode: t.view.searchMode
    }
  };
}
const ci = 180;
function Aa(e) {
  return Fe(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function ka(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function li() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Ta(e) {
  const t = new URLSearchParams(window.location.search);
  Yn.forEach((i) => t.delete(i)), e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function Ml(e) {
  return it({ ...e, page: 1 });
}
function jo(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Wt(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const xl = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ n(Ti, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ n(Cs, { "aria-hidden": "true" }) }
], Fl = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ n(Ti, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ n(Es, { "aria-hidden": "true" }) }
], Pl = [], Uo = "(min-width: 900px)";
function Ll(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(Uo);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function Dl() {
  return typeof window.matchMedia == "function" && window.matchMedia(Uo).matches;
}
function _l({
  onNavigate: e
}) {
  const [t, r] = q([]), [i] = q(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [a, o] = q(""), [s, d] = q(!0), [c, f] = q(""), [m, g] = q(!1), [h, y] = q(!1), [b, N] = q(!1), [O, A] = q(!1), [S, E] = q([]), [L, P] = q(""), [H, W] = q(!0), [D, te] = q(""), [G, oe] = q(""), [C, I] = q(!1), [x, Z] = q(!1), [ae, le] = q(""), [J, de] = q(li), [R, _] = q({}), [re, Ie] = q("name"), [me, Be] = q("asc"), Xe = M(null), _t = M(!1), [Ze, dt] = q(0), [Ae, ut] = q(!1), [V, et] = q(null), De = M(null), Se = M(null), vt = M(null), [ke, be] = q(
    null
  ), se = t.find((p) => p.id === J) ?? null, $ = Pe(
    () => (ke == null ? void 0 : ke.id) === J && se ? { ...se, view: {
      ...se.view,
      filter: ke.view.filter,
      objectFilter: ke.view.objectFilter,
      searchMode: ke.view.searchMode,
      startFrom: ke.view.startFrom
    } } : se,
    [ke, J, se]
  ), ue = $ ? Fe($) : "video", Ke = fn(ue), ye = $ ? we($) : !1, X = ue === "video" ? $ : null, tt = ye && !!($ != null && $.actions.some(wr)), ft = !!X || ue === "audio" || tt, [Nt, jt] = q(null), cr = (Nt == null ? void 0 : Nt.id) === ($ == null ? void 0 : $.id) ? Nt == null ? void 0 : Nt.mode : ($ == null ? void 0 : $.view.reviewMode) ?? "single", k = ye || ue === "audio" || ue === "video" && cr === "single", [z, Ee] = q(0), pt = M(-1), Qe = M(!1);
  Q(() => {
    const p = () => {
      if (!k && Ct.current) {
        Qe.current = !0;
        return;
      }
      pt.current = -1, de(li()), k || Ee((v) => v + 1);
    };
    return window.addEventListener("popstate", p), () => window.removeEventListener("popstate", p);
  }, [k]);
  const mt = Ke === "audio" ? h : m, Pr = ue === "tag" ? "Tag" : Ke === "audio" ? "Audio" : "Video", Lr = ue === "tag" ? b : mt, Xn = Pe(() => {
    const p = me === "asc" ? 1 : -1;
    return [...t].sort((v, T) => {
      if (re === "count") {
        const j = R[v.id], ne = R[T.id], U = typeof j == "number", ie = typeof ne == "number";
        if (U !== ie) return U ? -1 : 1;
        if (U && ie && j !== ne)
          return (j - ne) * p;
      }
      return v.name.localeCompare(T.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * p;
    });
  }, [me, re, R, t]), Ut = M(
    null
  ), Ot = kl(X), [Ne, vr] = q({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Sn, Ht] = q({
    page: 1,
    perPage: 40
  }), [Ve, ot] = q({ items: [], totalCount: 0 }), [qt, Gt] = q(J);
  qt !== J && (Gt(J), ot({ items: [], totalCount: 0 }), Z(!1));
  const [he, Bt] = q(!1), [Oe, lr] = q(""), [We, En] = q(!1), [Yt, Dr] = q(!1), [Ue, St] = q(() => /* @__PURE__ */ new Set()), Xt = M(Ue);
  Xt.current = Ue;
  const ht = M(/* @__PURE__ */ new Map()), _r = ($ == null ? void 0 : $.view.selectAllOnLoad) === !0, [ge, Te] = q(null), gt = M(ge);
  gt.current = ge;
  const [rt, Et] = q(!1), bt = M(rt);
  bt.current = rt;
  const Nr = M(null), [dr, Kt] = q(!1), [Je, Vt] = q("grid"), [nt, ur] = q(ci), [fe, fr] = q(!1), Ct = M(!1), [Cn, At] = q(""), [qr, kt] = q(""), [jr, Jt] = q(""), [Re, rn] = q(null), [An, ze] = q(""), [Sr, pr] = q(!1), [Er, nn] = q({}), Cr = M(/* @__PURE__ */ new Map()), je = M(null), Ur = M(null), Ar = !!$, Gr = $a(Ll, Dl, () => !1) && Ar, [an, Br] = q({ top: 0, bottom: 0 });
  ir(() => {
    if (!Ar) return;
    const p = () => {
      const T = Ur.current;
      if (!T) return;
      const j = Math.round(T.getBoundingClientRect().top + window.scrollY), ne = T.closest("main"), U = ne ? Math.round(parseFloat(getComputedStyle(ne).paddingBottom) || 0) : 0;
      Br(
        (ie) => ie.top === j && ie.bottom === U ? ie : { top: j, bottom: U }
      );
    };
    p();
    const v = typeof ResizeObserver > "u" ? null : new ResizeObserver(p);
    return v == null || v.observe(document.body), window.addEventListener("resize", p), () => {
      v == null || v.disconnect(), window.removeEventListener("resize", p);
    };
  }, [Ar]);
  const [Zn, kn] = q(0), Kr = M(null), on = rr((p) => {
    var T;
    if ((T = Kr.current) == null || T.disconnect(), Kr.current = null, !p || typeof ResizeObserver > "u") return;
    const v = new ResizeObserver(
      () => kn(Math.round(p.getBoundingClientRect().height))
    );
    v.observe(p), Kr.current = v;
  }, []), st = M(0), zt = M(0), kr = M(null), mr = M(null), hr = go(
    $ && !k ? V ? [...$.actions, ...V.draft.actions] : $.actions : Pl
  ), $t = Pe(
    () => V && $ ? Ca(V.draft, $, Ne) : null,
    [V, $, Ne]
  ), ei = Pe(
    () => $t != null && bn($t) !== (V == null ? void 0 : V.baseline),
    [$t, V == null ? void 0 : V.baseline]
  );
  Q(() => {
    if (!qr) return;
    const p = window.setTimeout(() => kt(""), 4e3);
    return () => window.clearTimeout(p);
  }, [qr]), Q(() => {
    const p = X ? Ji(X.view.objectFilter) : [];
    if (nn({}), !p.length) return;
    const v = new AbortController();
    let T = !0;
    return Promise.all(
      p.map(async (j) => {
        var ne;
        try {
          const U = await ee(`/api/tags/${j}`, {
            signal: v.signal
          });
          return (ne = U.name) != null && ne.trim() ? [String(j), U.name] : null;
        } catch {
          return null;
        }
      })
    ).then((j) => {
      T && nn(
        Object.fromEntries(j.filter((ne) => ne !== null))
      );
    }), () => {
      T = !1, v.abort();
    };
  }, [X == null ? void 0 : X.id, X == null ? void 0 : X.view.objectFilter]);
  const Tn = Pe(
    () => X ? zi(
      X.view.objectFilter,
      Er
    ) : ($ == null ? void 0 : $.view.objectFilter) ?? {},
    [Er, $, X]
  ), sn = rr(async () => {
    d(!0), f("");
    try {
      const p = await Us();
      r(p.reviews), o(p.storageKey), g(p.canWriteVideos ?? p.canWrite), y(p.canWriteAudios ?? !1), N(p.canWriteTags ?? !1), A(p.canReadTagGroups ?? !1), W(p.canConfigure ?? !0), te(p.storageNotice ?? ""), J && !p.reviews.some((v) => v.id === J) && (de(""), Ta(""));
    } catch (p) {
      f(
        p instanceof Error ? p.message : "Could not load reviews."
      );
    } finally {
      d(!1);
    }
  }, [J]);
  Q(() => {
    if (!O) {
      E([]), P("");
      return;
    }
    const p = new AbortController();
    return P(""), Xs(p.signal).then(E).catch((v) => {
      p.signal.aborted || P(
        v instanceof Error ? v.message : "Could not load tag groups."
      );
    }), () => p.abort();
  }, [O]), Q(() => {
    sn();
  }, []), Q(() => {
    if (J || t.length === 0) return;
    const p = new AbortController();
    _({});
    for (const v of t)
      (we(v) ? Qi(v, p.signal).then((j) => (j == null ? void 0 : j.length) === 0 ? { items: [], totalCount: 0 } : pn(Wi(v, j), { ...v.view.filter, page: 1, perPage: 1 }, p.signal)) : Fe(v) === "tag" ? la(
        v,
        it({ ...v.view.filter, page: 1, perPage: 1 }),
        p.signal
      ) : pn(
        v,
        it({ ...v.view.filter, page: 1, perPage: 1 }),
        p.signal
      )).then((j) => {
        p.signal.aborted || _((ne) => ({
          ...ne,
          [v.id]: j.totalCount
        }));
      }).catch(() => {
        p.signal.aborted || _((j) => ({ ...j, [v.id]: null }));
      });
    return () => p.abort();
  }, [J, t]), ir(() => {
    var p;
    J || s || !_t.current || (_t.current = !1, (p = Xe.current) == null || p.focus());
  }, [J, s]);
  const Vr = M(0), Tr = rr(async () => {
    const p = ++Vr.current;
    rn(null), ze("");
    try {
      const v = await (tt ? ro(Ke) : to(Ke));
      p === Vr.current && rn(v);
    } catch (v) {
      if (p !== Vr.current) return;
      rn(null), ze(
        "Tag assessment setup could not be checked. " + (v instanceof Error ? v.message : "Request failed.")
      );
    }
  }, [tt, Ke]);
  Q(() => {
    Tr();
  }, [Tr]);
  const Zt = rr(
    async (p, v, T = !1, j = !1) => {
      var lt, Ce;
      const ne = ++st.current;
      (lt = kr.current) == null || lt.abort();
      const U = new AbortController();
      kr.current = U, v = it(v);
      const ie = Number(v.page);
      T && (v = { ...v, page: 1 }), vr(v), Dr(T), Bt(!0), lr("");
      try {
        const xe = (tr) => Fe(p) === "tag" ? la(
          p,
          tr,
          U.signal
        ) : pn(
          p,
          tr,
          U.signal
        );
        let ce = await xe(v);
        const _e = Math.max(
          1,
          Math.ceil(ce.totalCount / Number(v.perPage))
        ), Jr = T ? _e : Math.min(ie, _e);
        return Number(v.page) !== Jr && (v = { ...v, page: Jr }, ce = await xe(v)), ne === st.current && (((Ce = mr.current) == null ? void 0 : Ce.page) !== Jr && (mr.current = {
          page: Jr,
          ids: new Set(ce.items.map((tr) => tr.id))
        }), ot(ce), j && Y(
          () => new Set(ce.items.map((tr) => tr.id))
        ), vr(v), Ht(v)), ce;
      } catch (xe) {
        throw ne === st.current && lr(
          xe instanceof Error ? xe.message : "Could not load the review queue."
        ), xe;
      } finally {
        ne === st.current && Bt(!1);
      }
    },
    []
  );
  Q(() => {
    var v;
    if (zt.current += 1, pt.current = -1, st.current += 1, (v = kr.current) == null || v.abort(), et(null), De.current = null, Z(!1), le(""), oe(""), I(!1), St(/* @__PURE__ */ new Set()), ht.current.clear(), Te(null), Et(!1), fr(!1), Ct.current = !1, At(""), kt(""), Jt(""), ot({ items: [], totalCount: 0 }), mr.current = null, En(!1), !$ || k) {
      Bt(!1);
      return;
    }
    let p = !0;
    return Bt(!0), (async () => {
      let T = se ?? $;
      be(null);
      let j = null;
      const ne = new URLSearchParams(window.location.search);
      if (Fe($) === "video" && Yn.some((Ce) => ne.has(Ce)))
        try {
          const Ce = T;
          j = Si(Ce, ne);
          const xe = Qt(Ce, j.query);
          (j.query.startFrom !== (Ce.view.startFrom ?? "end") || !Zr(
            JSON.parse(It(xe)),
            JSON.parse(It(Qt(Ce, Hr(Ce))))
          )) && (T = xe, be(T));
        } catch (Ce) {
          En(!0), lr(Ce instanceof Error ? Ce.message : "Could not read review URL."), Bt(!1);
          return;
        }
      let U = null;
      try {
        U = await Ks(a, $.id);
      } catch (Ce) {
        p && (I(!0), oe(
          Ce instanceof Error ? Ce.message : "Could not load progress."
        ));
      }
      if (!p) return;
      const ie = (U == null ? void 0 : U.signature) === It(T) ? U : null, lt = j ? j.query.filter : ie ? it(ie.filter) : Ml(T.view.filter);
      vr(lt), Vt(
        ie ? ka(ie.displayMode, Fe($)) : Aa($)
      ), ur(
        ie ? ie.cardSize ?? ci : ci
      );
      try {
        const Ce = await Zt(
          T,
          lt,
          j ? j.startAtEnd : !ie && T.view.startFrom !== "beginning",
          T.view.selectAllOnLoad === !0
        );
        if (!p) return;
        const xe = aa(
          Ce.items.map((ce) => ce.id),
          (ie == null ? void 0 : ie.focusedId) ?? null,
          (ie == null ? void 0 : ie.index) ?? 0
        );
        Te(xe), K(xe);
      } catch {
      }
      p && (pt.current = z, Z(!0), le(`${$.id}:${z}`));
    })(), () => {
      var T;
      p = !1, zt.current++, st.current++, (T = kr.current) == null || T.abort();
    };
  }, [$ == null ? void 0 : $.id, k, z]), Q(() => {
    if (!(!Ze || k || !$)) {
      if (We) {
        dt(0);
        return;
      }
      fe || V || ae !== `${$.id}:${z}` || (dt(0), Xi());
    }
  }, [Ze, k, $ == null ? void 0 : $.id, ae, fe, z, We]), Q(() => {
    !X || k || !x || he || Oe || fe || Qe.current || pt.current !== z || mn(X.id, {
      filter: Ne,
      objectFilter: X.view.objectFilter,
      searchMode: X.view.searchMode,
      startFrom: X.view.startFrom ?? "end"
    });
  }, [X, k, x, he, Oe, Ne, fe, z]);
  const ve = Pe(
    () => Ve.items.map((p) => p.id),
    [Ve.items]
  );
  Q(() => {
    if (!x || !$ || !a || he || Oe || fe || (ke == null ? void 0 : ke.id) === $.id || C || pt.current !== z)
      return;
    const p = {
      version: 1,
      signature: It($),
      filter: Ne,
      focusedId: ge,
      index: Math.max(0, ve.indexOf(ge ?? -1)),
      displayMode: Je,
      cardSize: nt,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        a + ":progress:" + $.id,
        JSON.stringify(p)
      );
    } catch {
    }
    if (G) return;
    let v = !0;
    const T = window.setTimeout(() => {
      Vs(a, $.id, p).catch((j) => {
        v && oe(
          "Progress is kept in this browser, but account sync failed. " + (j instanceof Error ? j.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      v = !1, window.clearTimeout(T);
    };
  }, [
    x,
    a,
    $,
    he,
    Oe,
    fe,
    Ne,
    ge,
    ve,
    Je,
    nt,
    ke,
    G,
    C,
    z
  ]);
  const Rn = Ve.items.find((p) => p.id === ge) ?? null, u = ue === "video" ? Rn : null;
  rt && u && (Nr.current = u);
  const w = u ?? (rt ? Nr.current : null), F = oa(Ue, ge), B = ve.length > 0 && ve.every((p) => Ue.has(p)), K = rr((p, v = !0) => {
    p != null && window.requestAnimationFrame(() => {
      var j;
      if (Fs(document.activeElement) || (j = document.activeElement) != null && j.closest(".dq-drawer"))
        return;
      const T = Cr.current.get(p);
      T == null || T.focus({ preventScroll: !0 }), v && (T == null || T.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  Q(() => {
    x && !bt.current && K(gt.current);
  }, [x, K]), Q(() => {
    he || !ve.length || (gt.current == null || !ve.includes(gt.current)) && (Te(ve[0]), bt.current || K(ve[0]));
  }, [K, ve, he]);
  const Y = rr(
    (p) => {
      St((v) => {
        const T = p(v);
        for (const j of /* @__PURE__ */ new Set([...v, ...T]))
          v.has(j) !== T.has(j) && ht.current.set(
            j,
            (ht.current.get(j) ?? 0) + 1
          );
        return T;
      });
    },
    []
  ), $e = rr(
    (p) => {
      if (!ve.length) return;
      const v = Math.max(
        0,
        ve.indexOf(gt.current ?? ve[0])
      ), T = ve[Math.max(0, Math.min(ve.length - 1, v + p))];
      Te(T), bt.current || K(T);
    },
    [K, ve]
  ), He = rr(
    async (p) => {
      const v = "steps" in p ? p.steps.length > 0 : p.effect.mode !== "SKIP", T = "effect" in p && p.effect.mode === "SET_TAG_GROUP" ? p.effect.tagGroupId : null, j = T != null && (!O || !S.some((Le) => Le.id === T)), ne = "effect" in p && v && !O, U = oa(
        Xt.current,
        gt.current
      );
      if (!$ || Ct.current || he || Oe) return;
      const ie = v && !Lr ? `${Pr} write permission is required to apply ${p.label}.` : ne || j ? `${p.label} needs a tag group that is unavailable.` : wr(p) && (Re == null ? void 0 : Re.kind) !== "ready" ? `Set up tag assessments before applying ${p.label}.` : U.length ? "" : `Select or focus a ${ue} before applying ${p.label}.`;
      if (ie) {
        Jt(ie);
        return;
      }
      const lt = ++zt.current, Ce = $.id, xe = [...ve], ce = Ve, _e = gt.current, Jr = new Set(Xt.current), tr = new Map(
        U.map((Le) => [Le, ht.current.get(Le) ?? 0])
      ), zr = () => lt === zt.current && $.id === Ce;
      Ct.current = !0, fr(!0), At(
        Xt.current.size ? `${U.length} selected ${ue}s` : `the focused ${ue}`
      ), kt(""), Jt("");
      const ta = ce.items.filter(
        (Le) => !U.includes(Le.id)
      ), Wo = ta.map((Le) => Le.id), ra = sa(
        xe,
        Wo,
        _e,
        U.includes(_e ?? -1)
      );
      ot({
        items: ta,
        totalCount: ce.totalCount
      }), St((Le) => {
        const yt = new Set(Le);
        for (const xt of U) yt.delete(xt);
        return yt;
      }), Te(ra), bt.current || K(ra);
      let ti = !1;
      try {
        if ("effect" in p ? await cc(p, U) : await io(Ke, p, U), ti = !0, !zr()) return;
        St((Le) => {
          const yt = new Set(Le);
          for (const xt of U)
            (ht.current.get(xt) ?? 0) === tr.get(xt) && yt.delete(xt);
          return yt;
        }), kt(
          `${p.label}: ${U.length} ${ue}${U.length === 1 ? "" : "s"} ${v ? "updated" : "skipped"}.`
        );
      } catch (Le) {
        if (!zr()) return;
        ot(ce), St((yt) => {
          const xt = new Set(yt);
          for (const Tt of U)
            Jr.has(Tt) && (ht.current.get(Tt) ?? 0) === tr.get(Tt) && xt.add(Tt);
          return xt;
        }), Te(_e), bt.current || K(_e), Jt(
          Le instanceof Error ? Le.message : "Action failed."
        );
      }
      try {
        if (await tc(p), !zr()) return;
        const Le = new Set(U), yt = _r && xe.length > 0 && xe.every((Ft) => Le.has(Ft)), xt = await Zt($, Ne, !1, yt);
        if (!zr()) return;
        let Tt = xt.items.map((Ft) => Ft.id);
        const $n = mr.current, Ho = ($n == null ? void 0 : $n.page) === Number(Ne.page) && Tt.some((Ft) => $n.ids.has(Ft)), Yo = ($.view.startFrom ?? "end") !== "beginning";
        if (xt.totalCount > 0 && Number(Ne.page) > 1 && (!Tt.length || Yo && !Ho)) {
          const Ft = Math.max(1, Number(Ne.page) - 1), Mn = { ...Ne, page: Ft };
          vr(Mn), Tt = (await Zt(
            $,
            Mn,
            !1,
            yt
          )).items.map((ri) => ri.id), St(
            (ri) => new Set([...ri].filter((Xo) => Tt.includes(Xo)))
          );
          const ia = Tt.at(-1) ?? null;
          Te(ia), bt.current || K(ia);
        } else {
          St(
            (Mn) => new Set([...Mn].filter((na) => Tt.includes(na)))
          );
          const Ft = sa(
            xe,
            Tt,
            _e,
            ti && U.includes(_e ?? -1)
          );
          Te(Ft), bt.current && Ft == null && Et(!1), bt.current || K(Ft);
        }
      } catch (Le) {
        zr() && Jt(
          (yt) => `${yt ? `${yt} ` : ""}${ti ? "The action completed, but " : ""}the queue could not be refreshed. ${Le instanceof Error ? Le.message : "Refresh failed."}`
        );
      } finally {
        zr() && (Ct.current = !1, fr(!1), At(""), Qe.current && (Qe.current = !1, de(li()), Ee((Le) => Le + 1)));
      }
    },
    [
      Lr,
      O,
      S,
      ue,
      Re,
      Zt,
      Ne,
      K,
      ve,
      Ve,
      he,
      Oe,
      $
    ]
  );
  function gr() {
    var T;
    if (Je === "list") return 1;
    const p = (T = je.current) == null ? void 0 : T.firstElementChild, v = p ? getComputedStyle(p).gridTemplateColumns : "";
    return Math.max(1, v.split(" ").filter(Boolean).length);
  }
  const Ye = M(() => {
  });
  Ye.current = (p) => {
    var U;
    if (k || p.defaultPrevented || p.repeat || p.ctrlKey || p.altKey || p.metaKey || Ae) return;
    const v = p.target, T = v instanceof Node && ((U = Ur.current) == null ? void 0 : U.contains(v)) === !0, j = v === document.body || v === document.documentElement;
    if (!T && !j) return;
    if (dr) {
      p.key === "Escape" && (Wt(p), Kt(!1));
      return;
    }
    if (rt && p.key === "Escape") {
      Wt(p), Et(!1), K(gt.current);
      return;
    }
    if (!xs(v)) return;
    const ne = Ms(v);
    if (p.key === "Escape") {
      Wt(p), Y(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!rt && p.key === " " && ne) {
      Wt(p), ge != null && Y((ie) => Dn(ie, ge));
      return;
    }
    if (!(fe || he) && !rt && p.key === "Enter" && ge != null && ne) {
      if (ue !== "tag" && V) return;
      Wt(p), ue === "tag" ? window.open(`/tag/${ge}`, "_blank", "noopener,noreferrer") : Et(!0);
      return;
    }
  }, Q(() => {
    const p = (v) => Ye.current(v);
    return document.addEventListener("keydown", p), () => document.removeEventListener("keydown", p);
  }, []);
  const wt = M(
    () => {
    }
  );
  wt.current = (p) => {
    var U;
    if (k || Ae || rt || dr || fe || he || !ve.length || p.defaultPrevented || p.repeat || p.ctrlKey || p.altKey || p.metaKey)
      return;
    const v = p.target, T = v instanceof Node && ((U = Ur.current) == null ? void 0 : U.contains(v)) === !0, j = v === document.body || v === document.documentElement;
    if (!T && !j || !p.key.startsWith("Arrow") || !Ps(v)) return;
    const ne = Ls(p.key, gr());
    ne && (p.preventDefault(), T ? p.stopImmediatePropagation() : p.stopPropagation(), $e(ne));
  }, Q(() => {
    const p = (v) => wt.current(v);
    return document.addEventListener("keydown", p), () => document.removeEventListener("keydown", p);
  }, []);
  const Ge = (V == null ? void 0 : V.saving) === !0, Rr = fe || he && !x || Ge, Me = Fr();
  Di({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!$ && !k && !Ae && !V && !rt && !dr && !Oe && (Ve.items.length > 0 || he || fe),
    actionCount: ($ == null ? void 0 : $.actions.length) ?? 0,
    onAction: (p) => {
      const v = $ == null ? void 0 : $.actions[p];
      v && He(v);
    },
    onFind: () => Kt(!0),
    onSelectAll: () => Y((p) => $s(p, ve))
  }), Q(() => Kt(!1), [k, rt, $ == null ? void 0 : $.id]);
  function Mt(p) {
    const v = "steps" in p ? p.steps.length > 0 : p.effect.mode !== "SKIP", T = "effect" in p && p.effect.mode === "SET_TAG_GROUP" ? p.effect.tagGroupId : null, j = T != null && !S.some((ne) => ne.id === T);
    return fe || he || !!Oe || v && !Lr || "effect" in p && v && (!O || j) || wr(p) && (Re == null ? void 0 : Re.kind) !== "ready" || !F.length;
  }
  function Ir(p) {
    jt(null), dt(0), de(p), Ta(p);
  }
  function In() {
    _t.current = !0, _({}), Ir("");
  }
  async function Or(p) {
    if (!a) return !1;
    const v = p.map(Ul);
    try {
      await Bs(a, v);
    } catch (j) {
      throw j;
    }
    r(v), J && !v.some((j) => j.id === J) && Ir("");
    const T = v.find((j) => j.id === J);
    return T && jt(null), T && se && JSON.stringify(T) !== JSON.stringify(se) && (T.view.displayMode !== se.view.displayMode && Vt(Aa(T)), It(T) !== It(se) && (be(null), Fe(T) === "video" && mn(T.id, {
      filter: it(T.view.filter),
      objectFilter: T.view.objectFilter,
      searchMode: T.view.searchMode,
      startFrom: T.view.startFrom ?? "end"
    }), k || er(
      T,
      it({ ...T.view.filter, page: Ne.page })
    ))), !0;
  }
  if (s)
    return /* @__PURE__ */ n(Ia, { label: "Loading reviews…" });
  if (c)
    return /* @__PURE__ */ l(pe, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void zl().catch(
            (p) => f(
              "Could not export browser reviews. " + (p instanceof Error ? p.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        Oa,
        {
          message: c,
          onRetry: () => void sn()
        }
      )
    ] });
  const cn = /* @__PURE__ */ l(pe, { children: [
    D && /* @__PURE__ */ n("p", { className: "dq-status", children: D }),
    ft && (Re == null ? void 0 : Re.kind) === "missing" && /* @__PURE__ */ l("div", { role: "status", className: "dq-status", children: [
      Re.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: Sr,
          onClick: () => {
            pr(!0), ze(""), (tt ? ic(Ke) : nc(Ke)).then(Tr).catch(
              (p) => ze(
                `Could not create the ${tt ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (p instanceof Error ? p.message : "Request failed.")
              )
            ).finally(() => pr(!1));
          },
          children: Sr ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    ft && ((Re == null ? void 0 : Re.kind) === "incompatible" || An) && /* @__PURE__ */ l("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(Wr, {}),
      An || (Re == null ? void 0 : Re.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: Sr,
          onClick: () => {
            pr(!0), Tr().finally(
              () => pr(!1)
            );
          },
          children: Sr ? "Checking…" : "Check again"
        }
      )
    ] }),
    i && /* @__PURE__ */ l("details", { children: [
      /* @__PURE__ */ n("summary", { children: "Unassigned legacy browser reviews" }),
      /* @__PURE__ */ n("p", { children: "These old reviews have no account owner. They have not been copied into this account. Export them for recovery, then import the reviews only into the intended account. The original data and deletion history stay in this browser." }),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const p = localStorage.getItem("page-videos") ?? "[]", v = URL.createObjectURL(
              new Blob([p], { type: "application/json" })
            ), T = document.createElement("a");
            T.href = v, T.download = "data-quality-unassigned-legacy-reviews.json", T.click(), URL.revokeObjectURL(v);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    G && /* @__PURE__ */ l("p", { role: "alert", children: [
      G,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            oe(""), I(!1);
          },
          children: C ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] })
  ] });
  return /* @__PURE__ */ l(
    "div",
    {
      ref: Ur,
      className: `data-quality-page${Ar ? " dq-page-fit" : ""}`,
      style: Ar ? {
        "--dq-fit-top": `${an.top}px`,
        "--dq-fit-bottom": `${an.bottom}px`
      } : void 0,
      children: [
        $ && k ? /* @__PURE__ */ n(
          Al,
          {
            review: $,
            canWrite: ye ? b : mt,
            canAssess: (Re == null ? void 0 : Re.kind) === "ready" && mt,
            onBusy: fr,
            editRequest: Ze,
            onEditRequestHandled: () => dt(0),
            onSaveDefaults: H ? (p) => Or(t.map((v) => v.id === p.id ? p : v)) : void 0,
            pageControls: {
              onBack: In,
              onManage: () => ut(!0),
              manageDisabled: !H,
              onGrid: X ? () => jt({ id: X.id, mode: "multiple" }) : void 0,
              notices: cn
            }
          },
          $.id
        ) : $ ? zo($) : /* @__PURE__ */ l(pe, { children: [
          /* @__PURE__ */ l("header", { className: "data-quality-header", children: [
            /* @__PURE__ */ n("div", { className: "dq-header-copy", children: /* @__PURE__ */ n("h1", { children: "Data Quality" }) }),
            /* @__PURE__ */ n(
              "button",
              {
                className: "dq-header-action",
                type: "button",
                "aria-label": "Manage reviews",
                title: "Manage reviews",
                disabled: !H,
                onClick: () => ut(!0),
                children: /* @__PURE__ */ n(Ns, {})
              }
            )
          ] }),
          cn,
          t.length ? /* @__PURE__ */ l(
            "section",
            {
              className: "dq-review-browser",
              "aria-labelledby": "dq-reviews-title",
              children: [
                /* @__PURE__ */ l("div", { className: "dq-review-browser-heading", children: [
                  /* @__PURE__ */ l("div", { children: [
                    /* @__PURE__ */ n(
                      "h2",
                      {
                        id: "dq-reviews-title",
                        ref: Xe,
                        tabIndex: -1,
                        children: "Reviews"
                      }
                    ),
                    /* @__PURE__ */ n("p", { children: "Choose a review to open its queue." }),
                    /* @__PURE__ */ n("span", { className: "dq-sr-only", role: "status", children: t.every(
                      (p) => R[p.id] !== void 0
                    ) ? t.some((p) => R[p.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
                  ] }),
                  /* @__PURE__ */ l("div", { className: "dq-review-browser-sort", children: [
                    /* @__PURE__ */ l("label", { children: [
                      /* @__PURE__ */ n("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                      /* @__PURE__ */ l(
                        "select",
                        {
                          "aria-label": "Sort reviews by",
                          value: re,
                          onChange: (p) => Ie(
                            p.target.value
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
                        "aria-label": me === "asc" ? "Ascending" : "Descending",
                        title: me === "asc" ? "Ascending" : "Descending",
                        onClick: () => Be(
                          (p) => p === "asc" ? "desc" : "asc"
                        ),
                        children: /* @__PURE__ */ n(
                          Ri,
                          {
                            className: me === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                          }
                        )
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: Xn.map((p) => {
                  const v = R[p.id], T = Fe(p), j = T === "tag" ? "tag" : we(p) ? Dt(fn(T)).queue : Dt(fn(T)).one;
                  return /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      disabled: fe,
                      onClick: () => Ir(p.id),
                      children: [
                        /* @__PURE__ */ l("span", { className: "dq-review-browser-summary", children: [
                          /* @__PURE__ */ l("span", { className: "dq-review-title", children: [
                            /* @__PURE__ */ n(Bi, { entityType: T }),
                            /* @__PURE__ */ n("strong", { children: p.name })
                          ] }),
                          /* @__PURE__ */ n(
                            "span",
                            {
                              className: "dq-review-count",
                              "aria-label": v === void 0 ? `Counting matching ${j}s` : v === null ? `Matching ${j} count unavailable` : `${v.toLocaleString()} matching ${v === 1 ? j : `${j}s`}`,
                              children: v === void 0 ? "…" : v === null ? "—" : v.toLocaleString()
                            }
                          )
                        ] }),
                        p.description && /* @__PURE__ */ n("span", { className: "dq-review-rule-name", children: p.description })
                      ]
                    },
                    p.id
                  );
                }) })
              ]
            }
          ) : /* @__PURE__ */ l("div", { className: "dq-empty", children: [
            /* @__PURE__ */ n(jn, {}),
            /* @__PURE__ */ n("p", { children: "No saved reviews are available in this browser." })
          ] })
        ] }),
        rt && w && X && /* @__PURE__ */ n(
          Vl,
          {
            video: w,
            review: X,
            selectedCount: Ue.size,
            pending: fe,
            refreshing: he || !!Oe,
            error: jr,
            canWrite: m,
            assessmentReady: (Re == null ? void 0 : Re.kind) === "ready",
            trees: hr,
            selected: Ue.has(w.id),
            hasPrevious: ve.indexOf(w.id) > 0,
            hasNext: ve.indexOf(w.id) >= 0 && ve.indexOf(w.id) < ve.length - 1,
            onToggleSelected: () => Y((p) => Dn(p, w.id)),
            onPrevious: () => $e(-1),
            onNext: () => $e(1),
            onClose: () => {
              Et(!1), K(gt.current);
            },
            onAction: He,
            findOpen: dr,
            onFindOpenChange: Kt
          }
        ),
        dr && $ && !k && !rt && /* @__PURE__ */ n(
          Ui,
          {
            actions: $.actions,
            tagGroups: S,
            trees: hr,
            isDisabled: Mt,
            canStay: !1,
            onApply: (p) => {
              Kt(!1), He(p);
            },
            onClose: () => Kt(!1)
          }
        ),
        Ae && /* @__PURE__ */ n(
          Jl,
          {
            reviews: t,
            onSave: Or,
            onEdit: (p) => {
              p !== J && Ir(p), dt((v) => v + 1), ut(!1);
            },
            onClose: () => ut(!1)
          }
        )
      ]
    }
  );
  async function er(p, v, T = !1) {
    const j = gt.current, ne = Math.max(0, ve.indexOf(j ?? -1));
    try {
      const U = Zt(
        p,
        v,
        T,
        p.view.selectAllOnLoad === !0
      ), ie = st.current, lt = await U;
      if (ie !== st.current) return;
      const Ce = lt.items.map((ce) => ce.id);
      St(
        (ce) => new Set([...ce].filter((_e) => Ce.includes(_e)))
      );
      const xe = aa(Ce, j, ne);
      Te(xe), bt.current || K(xe, !1);
    } catch {
    }
  }
  function ln(p) {
    const v = Ut.current;
    if (Ut.current = null, Rr || !$ || !se) return;
    const T = v ?? $.view.objectFilter, j = Zr(
      T,
      se.view.objectFilter
    ) ? se.view.objectFilter : T, ne = it({ ...p, page: 1 }), U = {
      ...$,
      view: {
        ...$.view,
        filter: ne,
        objectFilter: j
      }
    }, ie = It(U) !== It(se), lt = ie ? U : se;
    be(ie ? U : null), kt(ie ? "" : "Review queue defaults restored."), er(lt, ne, !0);
  }
  function ct() {
    if (fe || he || !se) return;
    Ut.current = null;
    const p = it({
      ...se.view.filter,
      page: 1
    });
    be(null), kt("Review queue defaults restored."), er(
      se,
      p,
      se.view.startFrom !== "beginning"
    );
  }
  function On() {
    fe || he || !$ || !se || !H || Or(
      t.map(
        (p) => p.id === J ? {
          ...p,
          view: {
            ...$.view,
            filter: { ...Ne, page: 1 }
          }
        } : p
      )
    ).then(() => {
      be(null), kt("Queue saved to this review.");
    }).catch(
      (p) => Jt(
        p instanceof Error ? p.message : "Could not save queue."
      )
    );
  }
  function Xi() {
    if (!$ || !se || Ct.current || V) return;
    Se.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, De.current = {
      temporaryReview: ke,
      filter: Ne,
      loadedFilter: Sn,
      queue: Ve,
      queueError: Oe,
      retryFromEnd: Yt,
      selectedIds: new Set(Ue),
      focusedId: ge,
      pageCursor: mr.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const p = structuredClone({
      ...se,
      view: { ...se.view, startFrom: $.view.startFrom ?? "end" }
    });
    Kt(!1), Et(!1), kt(""), Jt(""), et({
      draft: p,
      baseline: bn(Ca(p, $, Ne)),
      saving: !1,
      error: ""
    });
  }
  function Zi() {
    et(null), De.current = null;
    const p = Se.current;
    Se.current = null, requestAnimationFrame(() => {
      (p == null ? void 0 : p.isConnected) && p !== document.body && !(p instanceof HTMLButtonElement && p.disabled) ? p.focus({ preventScroll: !0 }) : K(gt.current, !1);
    });
  }
  function Go() {
    var v;
    if (!V || V.saving) return;
    const p = De.current;
    p && (st.current += 1, (v = kr.current) == null || v.abort(), Ut.current = null, Bt(!1), be(p.temporaryReview), vr(p.filter), Ht(p.loadedFilter), ot(p.queue), lr(p.queueError), Dr(p.retryFromEnd), Y(() => p.selectedIds), Te(p.focusedId), mr.current = p.pageCursor, window.history.replaceState(window.history.state, "", p.url)), Zi();
  }
  async function Bo() {
    if (!V || V.saving || !$t) return;
    const p = { ...$t, name: $t.name.trim() }, v = vn(p);
    if (v) {
      et((T) => T && { ...T, error: v });
      return;
    }
    et((T) => T && { ...T, saving: !0, error: "" });
    try {
      if (!await Or(t.map((T) => T.id === p.id ? p : T)))
        throw new Error("Could not save reviews.");
      be(null), kt("Review saved."), Zi();
    } catch (T) {
      et(
        (j) => j && {
          ...j,
          saving: !1,
          error: "Could not save review. Your edits are still open. " + (T instanceof Error ? T.message : "Retry saving.")
        }
      );
    }
  }
  function ea() {
    $ && Zt($, Ne, Yt, _r).catch(() => {
    });
  }
  function Ko() {
    St(/* @__PURE__ */ new Set()), ht.current.clear(), Te(null);
  }
  function Vo(p) {
    !$ || fe || Ge || p === Number(Ne.page) || jl(
      { ...Ne, page: p },
      $,
      (v, T) => Zt(v, T, !1, _r),
      Ko
    );
  }
  function Jo(p) {
    if (!X || !se || fe || he || Ge) return;
    const v = Ol(X, p, se.view.objectFilter), T = It(v) !== It(se);
    be(T ? v : null), T ? er(v, { ...Ne, page: 1 }) : er(
      se,
      { ...Ne, page: 1 },
      se.view.startFrom !== "beginning"
    );
  }
  function zo(p) {
    var Ce, xe;
    const v = ue === "tag", T = v ? "tag" : "video", j = Math.max(1, Number(Ne.perPage) || 40), ne = Math.max(1, Math.ceil(Ve.totalCount / j)), U = Math.min(Math.max(1, Number(Ne.page) || 1), ne), ie = [
      Lr ? "" : `${Pr} write permission is required to apply actions.`,
      v && L ? `Tag groups are unavailable. ${L}` : ""
    ].filter(Boolean), lt = !!jr && !rt;
    return /* @__PURE__ */ l(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": v ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ n(
            Co,
            {
              name: p.name,
              description: p.description,
              entityType: ue,
              onBack: In,
              backDisabled: fe || !!V,
              onEdit: V ? () => {
                var ce;
                return (ce = vt.current) == null ? void 0 : ce.focus();
              } : Xi,
              editDisabled: !V && (fe || he || We || !H),
              editing: !!V,
              toolbar: /* @__PURE__ */ l("fieldset", { className: "dq-review-toolbar", disabled: Rr, children: [
                /* @__PURE__ */ n("legend", { className: "dq-sr-only", children: v ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ n(
                  hn,
                  {
                    filter: Oe ? Sn : Ne,
                    onFilterChange: ln,
                    totalCount: Ve.totalCount,
                    sortOptions: v ? cs : Fa,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: Je,
                    zoomLevel: (nt - 225) / 50,
                    onZoomChange: (ce) => ur(Math.round(225 + ce * 50)),
                    cardSizeEntityType: v ? "tags" : "videos",
                    criteriaDefinitions: v ? ss : Ei,
                    customFieldEntityType: ue === "video" ? "video" : void 0,
                    objectFilter: Tn,
                    onObjectFilterChange: (ce) => {
                      Rr || (Ut.current = ue === "video" ? Ro(
                        ce,
                        Er,
                        p.view.objectFilter
                      ) : ce);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ n(Ao, { page: U, pages: ne, onPage: Vo })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ l(pe, { children: [
                X && /* @__PURE__ */ n(
                  ko,
                  {
                    mode: "multiple",
                    disabled: fe || he || Ae || !!V,
                    onChange: () => jt({ id: X.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ n(
                  zc,
                  {
                    options: v ? Fl : xl,
                    value: Je,
                    onChange: (ce) => Vt(ka(ce, ue))
                  }
                ),
                /* @__PURE__ */ n(
                  To,
                  {
                    disabled: fe || !!V,
                    items: [
                      {
                        label: "Manage reviews",
                        disabled: he || !H,
                        onSelect: () => ut(!0)
                      }
                    ]
                  }
                )
              ] }),
              chipsAfter: (xe = (Ce = X == null ? void 0 : X.presentation) == null ? void 0 : Ce.binParents) != null && xe.length ? /* @__PURE__ */ n(
                Rl,
                {
                  videos: Ve.items,
                  review: X,
                  savedObjectFilter: (se ?? X).view.objectFilter,
                  trees: Ot.ids,
                  disabled: fe || he || Ge,
                  onToggle: Jo
                }
              ) : void 0,
              chipsEnd: V ? /* @__PURE__ */ n("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : (ke == null ? void 0 : ke.id) === J ? /* @__PURE__ */ l(pe, { children: [
                /* @__PURE__ */ n("span", { className: "dq-defaults-note", children: "Queue differs from the saved review" }),
                /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "dq-text-button",
                    title: "Save the current queue criteria to this review",
                    disabled: fe || he || !H,
                    onClick: On,
                    children: [
                      /* @__PURE__ */ n(Ga, { "aria-hidden": "true" }),
                      "Save to review"
                    ]
                  }
                ),
                /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "dq-text-button",
                    title: "Reset the queue to the review's saved criteria",
                    disabled: fe || he,
                    onClick: ct,
                    children: [
                      /* @__PURE__ */ n(Ba, { "aria-hidden": "true" }),
                      "Reset"
                    ]
                  }
                )
              ] }) : void 0
            }
          ),
          cn,
          X && Ot.error && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: Ot.error }),
          /* @__PURE__ */ l("div", { className: "dq-review-area", children: [
            V && $t && /* @__PURE__ */ n(
              So,
              {
                drawerRef: vt,
                draft: $t,
                onChange: (ce) => et((_e) => _e && { ..._e, draft: ce }),
                direction: V.draft.view.startFrom ?? "end",
                onDirectionChange: (ce) => et(
                  (_e) => _e && {
                    ..._e,
                    draft: { ..._e.draft, view: { ..._e.draft.view, startFrom: ce } }
                  }
                ),
                tagGroups: S,
                trees: hr,
                saving: V.saving,
                saveDisabled: he || !!Oe,
                error: V.error,
                dirty: ei,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  Oe && !he ? /* @__PURE__ */ l("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ n(Wr, { "aria-hidden": "true" }),
                    /* @__PURE__ */ l("span", { children: [
                      "The queue could not load: ",
                      Oe,
                      " ",
                      /* @__PURE__ */ n("button", { type: "button", className: "dq-link-button", onClick: ea, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void Bo(),
                onCancel: Go
              }
            ),
            /* @__PURE__ */ l(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${Zn}px` },
                children: [
                  /* @__PURE__ */ l("div", { className: "dq-grid-content", children: [
                    he && !Ve.items.length && /* @__PURE__ */ n(Ia, { label: "Loading review queue…" }),
                    Oe && !he && /* @__PURE__ */ n(
                      Oa,
                      {
                        message: Oe,
                        retryLabel: We ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (We && se && Fe(se) === "video") {
                            const ce = Hr(se);
                            mn(se.id, { ...ce, filter: { ...ce.filter, page: void 0 } }), Ee((_e) => _e + 1);
                            return;
                          }
                          ea();
                        }
                      }
                    ),
                    !fe && !he && !Oe && !Ve.items.length && /* @__PURE__ */ l("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ n(jn, {}),
                      /* @__PURE__ */ l("p", { children: [
                        "No ",
                        T,
                        "s match this review."
                      ] })
                    ] }),
                    !!Ve.items.length && /* @__PURE__ */ n("div", { ref: je, children: /* @__PURE__ */ n(
                      "div",
                      {
                        className: Je === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${nt}px` },
                        children: Ve.items.map(Qo)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ n("div", { className: "dq-bar-dock", ref: on, children: /* @__PURE__ */ n(
                    wo,
                    {
                      actions: V ? V.draft.actions : p.actions,
                      tagGroups: S,
                      trees: hr,
                      isDisabled: Mt,
                      paused: !!V,
                      busy: fe || he,
                      onApply: (ce) => void He(ce),
                      onFind: () => Kt(!0),
                      status: fe ? `Applying action to ${Cn}…` : "",
                      summary: /* @__PURE__ */ l(pe, { children: [
                        /* @__PURE__ */ n("p", { className: "dq-bar-target", children: Ue.size ? `${Ue.size} selected` : ge == null ? "Nothing to apply to" : `Applies to the focused ${T}` }),
                        /* @__PURE__ */ l(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !ve.length || B,
                            onClick: () => Y((ce) => /* @__PURE__ */ new Set([...ce, ...ve])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ n(at, { binding: Me.selectAll, hidden: !0 })
                            ]
                          }
                        ),
                        /* @__PURE__ */ l(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Escape",
                            disabled: !Ue.size,
                            onClick: () => Y(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ n(at, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: ie.length ? ie.join(" ") : v ? "Arrows move · Space selects · Enter opens" : V ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews",
                      notices: lt || qr ? /* @__PURE__ */ l(pe, { children: [
                        lt && /* @__PURE__ */ l("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ n(Wr, { "aria-hidden": "true" }),
                          jr
                        ] }),
                        qr && /* @__PURE__ */ n("p", { role: "status", className: "dq-status", children: qr })
                      ] }) : void 0
                    }
                  ) })
                ]
              }
            )
          ] })
        ]
      }
    );
  }
  function Qo(p) {
    var T, j, ne;
    if (ue === "tag") {
      const U = p;
      return /* @__PURE__ */ n(
        Gl,
        {
          tag: U,
          displayMode: Je === "list" ? "list" : "grid",
          focused: U.id === ge,
          selected: Ue.has(U.id),
          setRef: (ie) => {
            ie ? Cr.current.set(U.id, ie) : Cr.current.delete(U.id);
          },
          onFocus: () => Te(U.id),
          onToggle: () => {
            Y((ie) => Dn(ie, U.id)), K(U.id, !1);
          },
          onOpen: () => window.open(`/tag/${U.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        U.id
      );
    }
    const v = p;
    return /* @__PURE__ */ n(
      Bl,
      {
        video: Tl(v, X, Ot.ids),
        showTagBins: ((j = (T = X == null ? void 0 : X.presentation) == null ? void 0 : T.annotations) == null ? void 0 : j.includes("tags")) && !!((ne = X.presentation.annotationParents) != null && ne.length),
        displayMode: Je,
        cardsScroll: Gr,
        focused: v.id === ge,
        selected: Ue.has(v.id),
        setRef: (U) => {
          U ? Cr.current.set(v.id, U) : Cr.current.delete(v.id);
        },
        onFocus: () => Te(v.id),
        onToggle: () => Y((U) => Dn(U, v.id)),
        onPreview: () => {
          V || (Te(v.id), Et(!0));
        },
        onNavigate: e
      },
      v.id
    );
  }
}
function jl(e, t, r, i) {
  i(), r(t, e).catch(() => {
  });
}
function Dn(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function Ul(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Gl({
  tag: e,
  displayMode: t,
  focused: r,
  selected: i,
  setRef: a,
  onFocus: o,
  onToggle: s,
  onOpen: d,
  onNavigate: c
}) {
  return /* @__PURE__ */ n(
    "article",
    {
      ref: a,
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${e.name}${i ? ", selected" : ""}`,
      onFocus: o,
      onClick: (f) => {
        o(), f.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ n(
        ls,
        {
          tag: e,
          selected: i,
          onSelect: s,
          onClick: d,
          onNavigate: c
        }
      ) : /* @__PURE__ */ l("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            "aria-label": i ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": i,
            onClick: (f) => {
              f.stopPropagation(), s();
            },
            children: i ? "✓" : ""
          }
        ),
        /* @__PURE__ */ n("button", { type: "button", className: "dq-tag-list-name", onClick: d, children: e.name }),
        /* @__PURE__ */ n("span", { children: e.tagGroupName || "Ungrouped" }),
        /* @__PURE__ */ n("span", { children: e.description || "" }),
        /* @__PURE__ */ l("span", { children: [
          e.videoCount ?? 0,
          " videos"
        ] })
      ] })
    }
  );
}
function Bl({
  video: e,
  showTagBins: t,
  displayMode: r,
  cardsScroll: i,
  focused: a,
  selected: o,
  setRef: s,
  onFocus: d,
  onToggle: c,
  onPreview: f,
  onNavigate: m
}) {
  var O, A;
  const g = jo(e), h = M(null), y = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, b = !!(y.date || y.studioName), N = !!(y.performers.length || y.tags.length);
  return ir(() => {
    const S = h.current;
    if (!S) return;
    const E = S.querySelector(
      `a[href="/video/${e.id}"]`
    ), L = S.querySelector(".card-title"), P = `dq-card-title-${e.id}`;
    L && (L.id = P), E && (E.target = "_blank", E.rel = "noreferrer", E.removeAttribute("aria-label"), E.setAttribute("aria-labelledby", P), E.classList.add("dq-card-link"));
    const H = S.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    H && H.setAttribute(
      "aria-label",
      o ? `Deselect ${g}` : `Select ${g}`
    );
    const W = S.querySelector(
      'button[title="Quick View"]'
    );
    W && W.setAttribute("aria-label", `Preview ${g}`);
  }), /* @__PURE__ */ l(
    "article",
    {
      ref: (S) => {
        h.current = S, s(S);
      },
      tabIndex: 0,
      "aria-current": a ? "true" : void 0,
      "aria-label": `${g}${o ? ", selected" : ""}`,
      onFocus: d,
      onClick: (S) => {
        d(), S.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${r} ${b ? "has-card-metadata" : "no-card-metadata"} ${N ? "has-card-footer" : "no-card-footer"} ${a ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          ds,
          {
            video: y,
            selected: o,
            onSelect: c,
            onNavigate: m,
            onQuickView: f,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ l("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (O = e.tags) == null ? void 0 : O.map((S) => /* @__PURE__ */ n("span", { children: S.name }, S.id)),
          !((A = e.tags) != null && A.length) && /* @__PURE__ */ n("small", { children: "No matching tags" })
        ] }),
        r === "wall" && /* @__PURE__ */ n(Kl, { video: e, cardsScroll: i })
      ]
    }
  );
}
function Kl({ video: e, cardsScroll: t }) {
  const r = M(null), i = M(null), [a, o] = q(!1), [s, d] = q(!1), [c, f] = q(!1);
  return Q(() => {
    const m = r.current;
    if (!m || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      o(!0), d(!0);
      return;
    }
    const g = t ? m.closest(".dq-grid-stage") : null, h = new IntersectionObserver(
      ([b]) => o(b.isIntersecting),
      { root: g, rootMargin: "320px 0px", threshold: 0 }
    ), y = new IntersectionObserver(
      ([b]) => d(b.isIntersecting && b.intersectionRatio >= 0.6),
      { root: g, threshold: [0, 0.6, 1] }
    );
    return h.observe(m), y.observe(m), () => {
      h.disconnect(), y.disconnect();
    };
  }, [e.id, e.files.length, t]), Q(() => {
    if (!a) {
      f(!1);
      return;
    }
    const m = new AbortController();
    return ee(ec(e.id), {
      signal: m.signal
    }).then((g) => {
      m.signal.aborted || f(g.available === !0);
    }).catch(() => {
      m.signal.aborted || f(!1);
    }), () => m.abort();
  }, [a, e.id]), Q(() => {
    const m = i.current;
    m && (s ? Promise.resolve(m.play()).catch(() => {
    }) : m.pause());
  }, [c, s]), /* @__PURE__ */ n("div", { ref: r, className: "dq-wall-autoplay", "aria-hidden": "true", children: c && /* @__PURE__ */ n(
    "video",
    {
      ref: i,
      src: Zs(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Vl({
  video: e,
  review: t,
  selectedCount: r,
  pending: i,
  refreshing: a,
  error: o,
  canWrite: s,
  assessmentReady: d,
  trees: c,
  selected: f,
  hasPrevious: m,
  hasNext: g,
  onToggleSelected: h,
  onPrevious: y,
  onNext: b,
  onClose: N,
  onAction: O,
  findOpen: A,
  onFindOpenChange: S
}) {
  const E = M(null), L = M(null), P = e.files[0], H = jo(e), W = (C) => i || a || "steps" in C && C.steps.length > 0 && !s || wr(C) && !d;
  Di({
    surface: "overlay",
    enabled: !A,
    actionCount: t.actions.length,
    onAction: (C) => {
      const I = t.actions[C];
      I && O(I);
    },
    onFind: () => S(!0)
  }), Q(() => {
    var I;
    const C = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (I = E.current) == null || I.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = C;
    };
  }, []);
  function D(C) {
    var Z, ae, le;
    if (C.key !== "Tab") return;
    const I = [
      ...((Z = E.current) == null ? void 0 : Z.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((J) => J.offsetParent !== null);
    if (!I.length) {
      C.preventDefault(), (ae = E.current) == null || ae.focus();
      return;
    }
    const x = I.indexOf(
      document.activeElement
    );
    C.shiftKey && x <= 0 ? (C.preventDefault(), (le = I.at(-1)) == null || le.focus()) : !C.shiftKey && x === I.length - 1 && (C.preventDefault(), I[0].focus());
  }
  function te(C) {
    if (A || C.defaultPrevented || C.ctrlKey || C.metaKey || C.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const I = C.key === "ArrowLeft" || C.key === "ArrowRight";
    if (C.altKey && !I) return;
    const x = L.current, Z = C.currentTarget.querySelector("video");
    if (C.key === "Enter" || C.key === "Escape")
      C.repeat || N();
    else if (C.key === " " && x)
      C.repeat || x.toggle();
    else if (I && x)
      x.seekBy(
        (C.key === "ArrowLeft" ? -1 : 1) * (C.shiftKey ? 5 : C.altKey ? 10 : 60)
      );
    else if ((C.key === "," || C.key === ".") && x) {
      const ae = [P == null ? void 0 : P.duration, Z == null ? void 0 : Z.duration].find(
        (J) => J != null && Number.isFinite(J) && J > 0
      ) ?? 0, le = e.parentVideoId != null ? (e.clipEndSec ?? ae) - (e.clipStartSec ?? 0) : ae;
      Number.isFinite(le) && le > 0 && x.seekBy((C.key === "," ? -1 : 1) * le * 0.1);
    } else if (C.key.toLowerCase() === "n" || C.key.toLowerCase() === "m")
      !C.repeat && !i && !a && (C.key.toLowerCase() === "n" && m && y(), C.key.toLowerCase() === "m" && g && b());
    else if (C.key === "ArrowUp" && Z)
      Z.volume = Math.min(1, Z.volume + 0.1);
    else if (C.key === "ArrowDown" && Z)
      Z.volume = Math.max(0, Z.volume - 0.1);
    else return;
    Wt(C);
  }
  function G(C) {
    const I = E.current, x = C.target instanceof Element ? C.target.closest("button, a[href]") : null;
    !I || !x || !I.contains(x) || x.closest(".dq-player, .dq-find-action") || C.detail === 0 || I.focus({ preventScroll: !0 });
  }
  Q(() => {
    if (A) return;
    let C = 0;
    const I = requestAnimationFrame(() => {
      C = requestAnimationFrame(() => {
        var Z;
        const x = document.activeElement;
        (Z = E.current) != null && Z.isConnected && (!x || x === document.body || x === document.documentElement) && E.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(I), cancelAnimationFrame(C);
    };
  }, [A, i, a, g, m, e.id]);
  const oe = r ? `the ${r} selected video${r === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ l(
    "div",
    {
      ref: E,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${H}`,
      className: "dq-preview",
      onKeyDown: D,
      onKeyDownCapture: te,
      onMouseDown: (C) => {
        C.target === C.currentTarget && N();
      },
      onClick: G,
      children: [
        /* @__PURE__ */ l("div", { className: "dq-preview-shell", children: [
          /* @__PURE__ */ l("header", { className: "dq-preview-header", children: [
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: "dq-preview-button",
                "aria-label": "Previous video",
                "aria-keyshortcuts": "n",
                title: "Previous video",
                disabled: !m || i || a,
                onClick: y,
                children: [
                  /* @__PURE__ */ n(ki, { "aria-hidden": "true" }),
                  /* @__PURE__ */ n(at, { binding: "n", hidden: !0 })
                ]
              }
            ),
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: "dq-preview-button",
                "aria-label": "Next video",
                "aria-keyshortcuts": "m",
                title: "Next video",
                disabled: !g || i || a,
                onClick: b,
                children: [
                  /* @__PURE__ */ n(at, { binding: "m", hidden: !0 }),
                  /* @__PURE__ */ n(Ri, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ l("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ n("h2", { children: H }),
              /* @__PURE__ */ l("p", { children: [
                "Actions apply to ",
                oe
              ] })
            ] }),
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: "dq-preview-button dq-preview-select",
                "aria-pressed": f,
                disabled: a,
                onClick: h,
                children: [
                  /* @__PURE__ */ n("span", { className: "dq-preview-check", "aria-hidden": "true", children: f && /* @__PURE__ */ n(Va, {}) }),
                  "Selected"
                ]
              }
            ),
            /* @__PURE__ */ n(
              "a",
              {
                href: `/video/${e.id}`,
                target: "_blank",
                rel: "noreferrer",
                className: "dq-preview-button dq-preview-icon",
                "aria-label": `Open ${H} in a new tab`,
                title: "Open video in a new tab",
                children: /* @__PURE__ */ n(Ka, { "aria-hidden": "true" })
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-preview-button dq-preview-icon",
                "aria-label": "Close preview",
                "aria-keyshortcuts": "Escape",
                title: "Close preview",
                onClick: N,
                children: /* @__PURE__ */ n(zn, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ n("div", { className: "dq-preview-video", children: P ? /* @__PURE__ */ n(
            Pa,
            {
              autostart: !0,
              streamUrl: bi("video", e.id),
              posterUrl: da(e),
              format: P.format,
              audioCodec: P.audioCodec,
              duration: P.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onPlaybackControlRegister: (C) => (L.current = C, () => {
                L.current === C && (L.current = null);
              }),
              clip: e.parentVideoId != null ? {
                start: e.clipStartSec ?? 0,
                end: e.clipEndSec,
                loop: !1
              } : void 0
            }
          ) : /* @__PURE__ */ n("img", { src: da(e), alt: "" }) }) }),
          o && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert dq-preview-alert", children: o }),
          /* @__PURE__ */ l("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ n("span", { children: "Space play / pause" }),
            /* @__PURE__ */ n("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ n("span", { children: ", . ±10 %" }),
            /* @__PURE__ */ n("span", { children: "↑ ↓ volume" }),
            /* @__PURE__ */ n("span", { children: "N M previous / next" }),
            /* @__PURE__ */ n("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ n(
            wo,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: c,
              isDisabled: W,
              busy: i || a,
              onApply: (C) => void O(C),
              onFind: () => S(!0),
              status: i ? `Applying action to ${oe}…` : "",
              summary: /* @__PURE__ */ n("p", { className: "dq-bar-target", children: r ? `${r} selected` : "This video" })
            }
          )
        ] }),
        A && /* @__PURE__ */ n(
          Ui,
          {
            actions: t.actions,
            trees: c,
            isDisabled: W,
            canStay: !1,
            onApply: (C) => {
              S(!1), O(C);
            },
            onClose: () => S(!1)
          }
        )
      ]
    }
  );
}
function Ra(e, { id: t, name: r, description: i }) {
  const a = { id: t, name: r, description: i }, o = (s, d = {}) => ({
    filter: { page: 1, perPage: 40, ...s },
    objectFilter: {},
    displayMode: "grid",
    searchMode: "text",
    ...d
  });
  switch (e) {
    case "tag":
      return {
        ...a,
        entityType: "tag",
        view: {
          ...o({ sort: "name", direction: "asc" }, { startFrom: "beginning" }),
          objectFilter: { tagGroupsCriterion: { value: [], modifier: "IS_NULL" } }
        },
        actions: []
      };
    case "audio":
      return {
        ...a,
        entityType: "audio",
        view: o({ sort: "date", direction: "desc" }, { startFrom: "end", reviewMode: "single" }),
        actions: []
      };
    case "performerOccurrence":
    case "audioPerformerOccurrence":
      return {
        ...a,
        entityType: e,
        view: o({ sort: "date", direction: "desc" }, { startFrom: "end" }),
        actions: [],
        occurrence: {
          targetMode: "all",
          performerIds: [],
          performerFilter: {},
          condition: "any",
          conditionTagIds: [],
          tagIds: [],
          multiple: !0
        }
      };
    default:
      return {
        ...a,
        entityType: "video",
        view: o({ sort: "date", direction: "desc" }, { startFrom: "end" }),
        actions: []
      };
  }
}
function Jl({
  reviews: e,
  onEdit: t,
  onSave: r,
  onClose: i
}) {
  const [a, o] = q(null), [s, d] = q(""), [c, f] = q(!1), [m, g] = q(!1), h = M(null);
  Q(() => {
    var L, P;
    const S = document.activeElement, E = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (P = (L = h.current) == null ? void 0 : L.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || P.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = E, S == null || S.focus({ preventScroll: !0 });
    };
  }, []);
  function y(S) {
    var P, H, W;
    if (S.defaultPrevented) {
      S.stopPropagation();
      return;
    }
    if (S.key === "Escape") {
      Wt(S), c || i();
      return;
    }
    if (S.key !== "Tab") {
      S.stopPropagation();
      return;
    }
    const E = [
      ...((P = h.current) == null ? void 0 : P.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((D) => D.offsetParent !== null);
    if (!E.length) {
      Wt(S), (H = h.current) == null || H.focus();
      return;
    }
    const L = E.indexOf(
      document.activeElement
    );
    S.shiftKey && L <= 0 ? (Wt(S), (W = E.at(-1)) == null || W.focus()) : !S.shiftKey && L === E.length - 1 ? (Wt(S), E[0].focus()) : S.stopPropagation();
  }
  function b(S) {
    g(!!S), o(
      S ? structuredClone(S) : Ra("video", { id: crypto.randomUUID(), name: "", description: "" })
    ), d("");
  }
  async function N() {
    if (c || !a) return;
    const S = vn(a);
    if (S) {
      d(S);
      return;
    }
    const E = { ...a, name: a.name.trim() };
    f(!0), d("");
    try {
      if (!await r([...e, E])) throw new Error("Could not save reviews.");
      t(E.id);
    } catch (L) {
      d(
        "Could not save reviews. Your edits are still open. " + (L instanceof Error ? L.message : "Retry saving.")
      );
    } finally {
      f(!1);
    }
  }
  async function O(S) {
    if (!c) {
      f(!0), d("");
      try {
        if (!await r(S)) throw new Error("Could not save reviews.");
      } catch (E) {
        d(
          E instanceof Error ? E.message : "Could not save reviews."
        );
      } finally {
        f(!1);
      }
    }
  }
  async function A(S) {
    var L;
    if (c) return;
    const E = (L = S.target.files) == null ? void 0 : L[0];
    if (S.target.value = "", !!E) {
      if (E.size > 2e6) {
        d("Review files must be smaller than 2 MB.");
        return;
      }
      f(!0), d("");
      try {
        const P = Nn(await E.text());
        if (!await r(fi(e, P)))
          throw new Error("Could not save reviews.");
      } catch (P) {
        d(
          P instanceof Error ? P.message : "Could not import reviews."
        );
      } finally {
        f(!1);
      }
    }
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: h,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: y,
      children: /* @__PURE__ */ l("div", { className: "dq-manager", children: [
        /* @__PURE__ */ l("header", { children: [
          /* @__PURE__ */ l("div", { children: [
            /* @__PURE__ */ n("h2", { children: a ? "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: a ? "Name the review, then configure its queue and actions." : "Edit opens a review with its editor beside the queue." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: c,
              onClick: i,
              children: /* @__PURE__ */ n(zn, {})
            }
          )
        ] }),
        s && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: s }),
        /* @__PURE__ */ n("fieldset", { disabled: c, className: "dq-manager-content", children: a ? /* @__PURE__ */ l("div", { className: "dq-new-review", children: [
          /* @__PURE__ */ n("div", { className: "dq-new-review-fields", children: /* @__PURE__ */ n(
            qo,
            {
              review: a,
              onChange: o,
              entityTypeLocked: m,
              onEntityTypeChange: (S) => {
                !m && S !== Fe(a) && o(Ra(S, a));
              },
              autoFocus: !0
            }
          ) }),
          /* @__PURE__ */ l("div", { className: "dq-new-review-footer", children: [
            /* @__PURE__ */ n(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => No(a),
                children: "Export draft"
              }
            ),
            /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: i, children: "Cancel" }),
            /* @__PURE__ */ n(
              "button",
              {
                className: "dq-button primary",
                type: "button",
                onClick: () => void N(),
                children: "Create & configure"
              }
            )
          ] })
        ] }) : /* @__PURE__ */ l(pe, { children: [
          /* @__PURE__ */ l("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ n("button", { type: "button", className: "dq-button", onClick: () => {
              const S = URL.createObjectURL(new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })), E = document.createElement("a");
              E.href = S, E.download = "data-quality-reviews.json", E.click(), URL.revokeObjectURL(S);
            }, children: "Export reviews" }),
            /* @__PURE__ */ l(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => b(),
                children: [
                  /* @__PURE__ */ n(Ai, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ l("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(Ss, {}),
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
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((S) => /* @__PURE__ */ l("article", { children: [
            /* @__PURE__ */ l("div", { children: [
              /* @__PURE__ */ l("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ n(Bi, { entityType: Fe(S) }),
                /* @__PURE__ */ n("strong", { children: S.name })
              ] }),
              /* @__PURE__ */ n("p", { children: S.description || "No description" })
            ] }),
            /* @__PURE__ */ l("button", { type: "button", onClick: () => t(S.id), children: [
              /* @__PURE__ */ n(yn, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => b({
                  ...structuredClone(S),
                  id: crypto.randomUUID(),
                  name: `${S.name} copy`
                }),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${S.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${S.name}”?`) && O(
                    e.filter((E) => E.id !== S.id)
                  );
                },
                children: /* @__PURE__ */ n(_a, {})
              }
            )
          ] }, S.id)) })
        ] }) })
      ] })
    }
  );
}
async function zl() {
  const e = await ee("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let i = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const s = JSON.parse(r);
      Array.isArray(s.reviews) && (i = JSON.stringify(s.reviews, null, 2));
    } catch {
    }
  const a = URL.createObjectURL(
    new Blob([i], { type: "application/json" })
  ), o = document.createElement("a");
  o.href = a, o.download = "data-quality-browser-recovery.json", o.click(), URL.revokeObjectURL(a);
}
function Ia({ label: e }) {
  return /* @__PURE__ */ l("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(qs, { className: "dq-spin" }),
    e
  ] });
}
function Oa({
  message: e,
  onRetry: t,
  retryLabel: r = "Retry"
}) {
  return /* @__PURE__ */ l("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(Wr, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: r })
  ] });
}
const Zl = { components: { DataQualityPage: _l } };
export {
  _l as DataQualityPage,
  Zl as default,
  Zr as objectFiltersEqual
};
