import { jsxs as c, Fragment as me, jsx as r } from "react/jsx-runtime";
import { useRef as $, useLayoutEffect as pn, useMemo as Te, useState as S, useEffect as V, useId as xt, useSyncExternalStore as co, Fragment as ja, useCallback as Nn } from "react";
import { useKeySequence as Js, EntityReferenceMultiSelector as Sn, SortableList as lo, EntityDetailTabs as zs, TagBadge as Ws, DetailListToolbar as qr, PERFORMER_CRITERIA as Ua, AUDIO_CRITERIA as uo, VIDEO_CRITERIA as Ga, NarrativeText as Qs, AUDIO_SORT_OPTIONS as Hs, VIDEO_SORT_OPTIONS as fo, AudioPlayer as Ys, VideoPlayer as ho, formatDuration as po, FilterDialog as Xs, getResolutionLabel as Zs, ConfirmDialog as ec, TAG_CRITERIA as tc, TAG_SORT_OPTIONS as nc, TagTile as rc, VideoCard as ac } from "@cove/runtime/components";
import { Search as ta, Pencil as rr, Ban as Ca, Pin as ic, Plus as Ka, GripVertical as mo, AlertTriangle as Vn, Copy as go, Trash2 as bo, ChevronDown as wo, X as kr, Mic as oc, Users as yo, Tag as vo, Headphones as No, Film as na, ChevronLeft as Tr, RectangleHorizontal as sc, LayoutGrid as Ba, MoreHorizontal as cc, ChevronRight as qo, Layers as Ri, Check as Va, Undo2 as lc, Flag as Qr, RefreshCw as dc, Save as So, RotateCcw as Eo, ExternalLink as Co, SkipForward as uc, Upload as fc, Download as Ao, ArrowUp as hc, ArrowDown as pc, Loader2 as mc, List as gc, Grid3X3 as bc } from "@cove/runtime/lucide-react";
import { extensionFetch as wc } from "@cove/runtime/api";
const Ja = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, za = Object.keys(
  Ja
);
function Sr(e) {
  return e === "excludes" || e === "excludesAll";
}
function Wa(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
const ko = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function ve(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function Qa(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function Re(e) {
  return Qa(Ke(e));
}
function yc(e) {
  return Ke(e) === "video";
}
function Ke(e) {
  return e.entityType ?? "video";
}
const ar = [
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
function Er(e) {
  return ve(e) && !To(e.occurrence) ? "Complete the optional occurrence condition before saving." : !yc(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : Ke(e) !== "tag" && e.actions.some(
    (t) => Ha(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => En(t, Ke(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const vc = {
  video: 1e3,
  audio: 250
};
function Et(e, t = "video") {
  const n = (a, i) => Number.isFinite(Number(a)) && Number(a) > 0 ? Math.floor(Number(a)) : i;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(vc[t], n(e.perPage, 40))
    )
  };
}
function Ii(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function Vt(e) {
  const { page: t, ...n } = e.view.filter, a = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    ve(e) ? [e.entityType, ...a, e.occurrence] : Ke(e) === "video" ? a : [Ke(e), ...a]
  );
}
function En(e, t) {
  const n = t ?? ("effect" in e ? "tag" : "video");
  return e.label.trim() ? n === "tag" ? !("effect" in e) || "steps" in e || !e.effect || typeof e.effect != "object" ? !1 : ["SET_TAG_GROUP", "CLEAR_TAG_GROUP", "SKIP"].includes(
    e.effect.mode
  ) && (e.effect.mode !== "SET_TAG_GROUP" || Number.isSafeInteger(e.effect.tagGroupId) && e.effect.tagGroupId > 0) : !("steps" in e) || "effect" in e ? !1 : e.steps.every(
    (a) => [
      "ADD",
      "REMOVE",
      "REMOVE_TREE",
      "MARK_PRESENT",
      "MARK_ABSENT",
      "CLEAR_ABSENCE"
    ].includes(a.mode) && a.tagIds.length > 0 && a.tagIds.every((i) => Number.isSafeInteger(i) && i > 0)
  ) && !Ha(e) : !1;
}
function Nc(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function qn(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function ra(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function Pn(e) {
  return "steps" in e ? e.steps.some((t) => qn(t.mode)) : !1;
}
function Ha(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (qn(n.mode))
      for (const a of n.tagIds) {
        const i = t.get(a);
        if (i && i !== n.mode) return !0;
        t.set(a, n.mode);
      }
  return !1;
}
function Rr(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || ko.includes(n.entityType)) && (!Nc(n.entityType) || To(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && qc(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (a) => typeof a == "string"
    )) && Array.isArray(n.actions) && n.actions.every(
      (a) => typeof (a == null ? void 0 : a.id) == "string" && typeof a.label == "string" && (a.shortcut === void 0 || typeof a.shortcut == "string") && (n.entityType === "tag" ? "effect" in a && !("steps" in a) && En(a, "tag") : "steps" in a && !("effect" in a) && Array.isArray(a.steps) && a.steps.every(
        (i) => i && Array.isArray(i.tagIds)
      ) && En(a, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => Er(n)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((n) => n.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function qc(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= 115 && n.cardSize <= 380) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (a) => ["date", "studio", "performers", "tags"].includes(a)
  )) && [n.annotationParents, n.binParents].every(
    (a) => a === void 0 || Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0)
  );
}
function Aa(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const a of e)
    for (const i of a)
      n.has(i.id) || (n.add(i.id), t.push(i));
  return t;
}
function To(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (a) => Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0) && new Set(a).size === a.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && za.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function $i(e, t) {
  return e.size > 0 ? [...e].sort((n, a) => n - a) : t == null ? [] : [t];
}
function Oi(e, t, n, a) {
  if (t.length === 0) return null;
  if (n == null) return t[0];
  if (!a && t.includes(n)) return n;
  const i = Math.max(0, e.indexOf(n));
  if (a) {
    for (const o of e.slice(i + 1))
      if (t.includes(o)) return o;
    if (t.includes(n)) {
      for (const o of e.slice(0, i).reverse())
        if (t.includes(o)) return o;
      return n;
    }
  }
  return t[Math.min(i, t.length - 1)];
}
function Sc(e, t) {
  const n = new Set(e), a = t.length > 0 && t.every((i) => n.has(i));
  for (const i of t)
    a ? n.delete(i) : n.add(i);
  return n;
}
function Ec(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function Cc(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function Ac(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function kc(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function Tc(e, t) {
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
const Ro = "ext:com.midnightrider.data-quality:configuration", Rc = "ext:cove-data-quality:video-reviews", ka = "ext:com.midnightrider.data-quality:progress";
class Io extends Error {
}
const Ir = /* @__PURE__ */ new Map(), Kr = /* @__PURE__ */ new Map(), Bn = (e, t) => e.includes("*") || e.includes(t), Hr = (e) => ie(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Ic = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Ta(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Zn(e) {
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
    reviews: Rr(JSON.stringify(t.reviews)),
    deletedIds: Ta(t.deletedIds),
    importedIds: Ta(t.importedIds)
  };
}
function $c(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const a = /* @__PURE__ */ new Set();
  for (const i of t) {
    const o = localStorage.getItem(i);
    if (o !== null) {
      const s = Rr(o);
      n ?? (n = s), s.forEach((l) => a.add(l.id));
    }
    Ta(
      JSON.parse(localStorage.getItem(`${i}:account-imports`) ?? "[]")
    ).forEach((s) => a.add(s));
  }
  return {
    reviews: n ?? [],
    known: [...a],
    present: n !== void 0
  };
}
async function $o(e) {
  const t = await ie("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Oo(e, t) {
  const n = (Kr.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Kr.set(e, n), n.finally(() => {
    Kr.get(e) === n && Kr.delete(e);
  }).catch(() => {
  }), n;
}
let br = null;
function Oc() {
  if (br) return br;
  const e = Mc();
  return br = e, e.finally(() => {
    br === e && (br = null);
  }).catch(() => {
  }), e;
}
async function Mc() {
  var m;
  const e = await ie("/api/auth/me"), t = String(e.user.id), n = `cove-data-quality-v2:${t}`, a = Bn(e.permissions, "savedfilters.read"), i = a && Bn(e.permissions, "savedfilters.write"), o = a ? (await Hr(Ro)).filter((y) => y.name === "Data Quality configuration").sort((y, b) => y.id - b.id) : [];
  if (o.length > 1) {
    const y = (b) => {
      const { revision: N, ...R } = Zn(b.uiOptions);
      return JSON.stringify(R);
    };
    if (o.some((b) => y(b) !== y(o[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (i)
      for (const b of o.slice(1))
        await ie(`/api/savedfilters/${b.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${b.id}` })
        });
    o.splice(1);
  }
  let s = o.length ? Zn(o[0].uiOptions) : Ic();
  const l = localStorage.getItem(`${n}:migrated`) === "true", d = localStorage.getItem(n), h = localStorage.getItem(`${n}:local-only`) === "true";
  !o.length && d && (s = Zn(d));
  let p = !o.length;
  if (o.length && h && d) {
    const y = Zn(d);
    if (y.reviews.some((N) => {
      const R = s.reviews.find((C) => C.id === N.id);
      return R && JSON.stringify(R) !== JSON.stringify(N);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const b = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...y.deletedIds])
    ];
    s = {
      ...s,
      reviews: Aa(s.reviews, y.reviews).filter(
        (N) => !b.includes(N.id)
      ),
      deletedIds: b,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...y.importedIds])
      ]
    }, p = !0;
  }
  if (!l) {
    const y = JSON.stringify(s), b = $c(t);
    if (o.length && b.reviews.some((_) => {
      const T = s.reviews.find((I) => I.id === _.id);
      return T && JSON.stringify(T) !== JSON.stringify(_);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const N = a ? (await Hr(Rc)).flatMap(
      (_) => Rr(_.uiOptions ?? "[]")
    ) : [], R = b.known.filter(
      (_) => !b.reviews.some((T) => T.id === _)
    ), C = /* @__PURE__ */ new Set([...s.deletedIds, ...R]);
    s = {
      ...s,
      reviews: Aa(
        b.reviews,
        s.reviews,
        N.filter(
          (_) => !b.known.includes(_.id) && !s.importedIds.includes(_.id)
        )
      ).filter((_) => !C.has(_.id)),
      deletedIds: [...C],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...b.known,
          ...N.map((_) => _.id)
        ])
      ]
    }, p || (p = JSON.stringify(s) !== y);
  }
  const g = {
    userId: t,
    recordId: (m = o[0]) == null ? void 0 : m.id,
    config: s,
    readable: a,
    writable: i,
    durable: i
  };
  if (Ir.set(n, g), p && i) {
    const y = s;
    o.length && (g.config = Zn(o[0].uiOptions)), await Mo(n, y), s = g.config;
  } else o.length || (localStorage.setItem(n, JSON.stringify(s)), !a && (!l || h) && localStorage.setItem(`${n}:local-only`, "true"));
  if (!a) localStorage.setItem(`${n}:migrated`, "true");
  else if (i)
    try {
      localStorage.setItem(`${n}:migrated`, "true");
    } catch {
    }
  return {
    reviews: s.reviews,
    storageKey: n,
    canWrite: Bn(e.permissions, "videos.write"),
    canWriteVideos: Bn(e.permissions, "videos.write"),
    canWriteAudios: Bn(e.permissions, "audios.write"),
    canWriteTags: Bn(e.permissions, "tags.write"),
    canReadTagGroups: Bn(e.permissions, "taggroups.read"),
    canConfigure: !a || i,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: a ? i ? "account" : "readOnly" : "browser",
    storageNotice: a ? i ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Mo(e, t) {
  const n = Ir.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const a = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await $o(n), n.recordId != null) {
      const o = await ie(
        `/api/savedfilters/${n.recordId}`
      );
      if (Zn(o.uiOptions).revision !== n.config.revision)
        throw new Io(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const i = await ie(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Ro,
          name: "Data Quality configuration",
          uiOptions: JSON.stringify(a)
        })
      }
    );
    n.recordId = i.id;
  } else
    localStorage.setItem(e, JSON.stringify(a)), localStorage.setItem(`${e}:local-only`, "true");
  if (n.config = a, n.durable)
    try {
      localStorage.setItem(e, JSON.stringify(a)), localStorage.setItem(`${e}:migrated`, "true"), localStorage.removeItem(`${e}:local-only`);
    } catch {
    }
}
function Fc(e, t) {
  return Rr(JSON.stringify(t)), Oo(e, async () => {
    const n = Ir.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const a = n.config.reviews.filter((i) => !t.some((o) => o.id === i.id)).map((i) => i.id);
    await Mo(e, {
      ...n.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...n.config.deletedIds, ...a])
      ].filter((i) => !t.some((o) => o.id === i))
    });
  });
}
function Mi(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, a]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(a)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function xc(e, t) {
  const n = Ir.get(e);
  if (!n) return null;
  const a = localStorage.getItem(`${e}:progress:${t}`), i = a ? Mi(a) : null;
  if (!n.readable) return i;
  const o = (await Hr(ka)).find(
    (l) => l.name === t
  ), s = o ? Mi(o.uiOptions) : null;
  return i && (!s || i.updatedAt > s.updatedAt) ? i : s;
}
function Pc(e, t, n) {
  const a = `${e}:progress:${t}`;
  try {
    localStorage.setItem(a, JSON.stringify(n));
  } catch {
  }
  return Oo(a, async () => {
    const i = Ir.get(e);
    if (!(i != null && i.writable)) return;
    await $o(i);
    const o = (await Hr(ka)).find(
      (s) => s.name === t
    );
    await ie(
      o ? `/api/savedfilters/${o.id}` : "/api/savedfilters",
      {
        method: o ? "PUT" : "POST",
        body: JSON.stringify({
          mode: ka,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function Ln(e) {
  return e === "audio" ? "audios" : "videos";
}
const Lc = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function mn(e) {
  return Lc[e];
}
const Yr = "confirmed_absent_tags", Ya = "Confirmed absent tags", aa = "confirmed_absent_occurrence_tags", Fo = {
  key: Yr,
  label: Ya,
  type: "tag",
  subject: "tag assessments"
}, Xa = {
  key: aa,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, Dc = {
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
function Cn(e) {
  return Array.isArray(e) ? e.map(Cn) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? Dc[n] ?? n : t === "key" && typeof n == "string" && [
        Yr,
        aa
      ].includes(n.toLowerCase()) ? n.toLowerCase() : Cn(n)
    ])
  ) : e;
}
async function xo(e, t, n) {
  const a = new Headers(t.headers);
  !(t.body instanceof FormData) && !a.has("Content-Type") && a.set("Content-Type", "application/json");
  const i = await wc(e, { ...t, headers: a });
  if (i.status === 404 && n === "null") return null;
  if (!i.ok) {
    let s = i.statusText || `Request failed (${i.status}).`;
    try {
      const l = await i.json();
      s = l.message || l.detail || l.error || s;
    } catch {
    }
    throw new Error(s);
  }
  if (i.status === 204 || i.status === 205) return;
  const o = await i.text();
  return o ? JSON.parse(o) : void 0;
}
async function ie(e, t = {}) {
  return await xo(e, t, "fail");
}
function _c(e, t = {}) {
  return xo(e, t, "null");
}
const jc = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Uc = 0;
function Ra(e, t) {
  return ie(
    `/api/${Ln(e)}/${t}?dqRead=${jc}-${++Uc}`,
    { cache: "no-store" }
  );
}
function Po(e, t) {
  const n = { ...e.view.objectFilter }, a = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    Cn({
      findFilter: Et(t, Re(e)),
      objectFilter: n,
      filterExpression: a
    })
  );
}
async function vr(e, t, n) {
  return ie(
    `/api/${Ln(Re(e))}/find`,
    { method: "POST", signal: n, body: Po(e, t) }
  );
}
async function Gc(e, t, n) {
  return (await ie(
    `/api/${Ln(Re(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: Po(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function Fi(e, t, n) {
  const a = { ...e.view.objectFilter };
  return delete a._filterExpression, ie("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      Cn({
        findFilter: Et(t),
        objectFilter: a
      })
    )
  });
}
function Kc(e) {
  return ie("/api/taggroups", { signal: e });
}
function Ia(e, t, n = 1280) {
  return `/api/${Ln(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function $a(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function xi(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Bc(e) {
  return `/api/stream/video/${e}/preview`;
}
function Vc(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Jc(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function ia(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e) {
    await ie(`/api/tags/${a}`, { signal: t }), n.add(a);
    for (let i = 1; ; i++) {
      const o = await ie("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Cn({
            findFilter: { page: i, perPage: 1e3, sort: "id", direction: "asc" },
            objectFilter: {
              parentsCriterion: {
                value: [a],
                modifier: "INCLUDES",
                depth: -1
              }
            }
          })
        )
      });
      for (const s of o.items) n.add(s.id);
      if (i * 1e3 >= o.totalCount) break;
      if (!o.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...n];
}
async function Za(e, t) {
  const n = ra(e);
  return (await Promise.all(
    e.steps.map(
      async (i) => i.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await ia(i.tagIds, t)).filter(
          (o) => !n.has(o)
        )
      } : i
    )
  )).filter((i) => i.tagIds.length > 0);
}
function zc(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function ei(e, t) {
  const a = (await ie("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === e.key
  );
  if (!a)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const i = zc(e, a);
  return i ? { kind: "incompatible", message: i } : a.entityTypes.includes(t) ? { kind: "ready", definition: a, message: "" } : {
    kind: "missing",
    message: `Add ${mn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: a
  };
}
async function Lo(e, t) {
  const n = await ei(e, t);
  if (n.kind !== "ready") {
    if (n.kind === "incompatible") throw new Error(n.message);
    if (n.definition) {
      await ie(`/api/custom-fields/${n.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...n.definition.entityTypes, t])]
        })
      });
      return;
    }
    await ie("/api/custom-fields", {
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
function Do(e = "video") {
  return ei(Fo, e);
}
function Wc(e = "video") {
  return Lo(Fo, e);
}
function _o(e = "video") {
  return ei(Xa, e);
}
function Qc(e = "video") {
  return Lo(Xa, e);
}
function Xr(e) {
  return [...new Set(e)];
}
function jo(e, t) {
  const n = e.customFields ?? {}, a = Object.keys(n).find(
    (o) => o.toLowerCase() === aa
  ), i = a === void 0 ? [] : n[a];
  return Xr(
    (Array.isArray(i) ? i : []).filter(
      (o) => typeof o == "string" && /^[1-9]\d*:[1-9]\d*$/.test(o)
    ).map((o) => o.split(":").map(Number)).filter(([o]) => o === t).map(([, o]) => o)
  );
}
async function Hc(e) {
  let t;
  try {
    t = await _o(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${Xa.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function Yc(e, t, n, a, i, o) {
  await ie(`/api/${Ln(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: Xr(i).map((s) => `${a}:${s}`)
      },
      customFieldMode: o
    })
  });
}
function Xc(e, t, n) {
  const a = [...e.tagIds], i = (o) => {
    if (n === null)
      throw new Error(
        `The ${Ya} custom field is not available.`
      );
    return { customFields: { [n]: a }, customFieldMode: o };
  };
  switch (e.mode) {
    case "ADD":
      return { ids: t, tagIds: a, tagMode: "ADD" };
    case "REMOVE":
    case "REMOVE_TREE":
      return { ids: t, tagIds: a, tagMode: "REMOVE" };
    case "MARK_PRESENT":
      return { ids: t, tagIds: a, tagMode: "ADD", ...i("REMOVE") };
    case "MARK_ABSENT":
      return { ids: t, tagIds: a, tagMode: "REMOVE", ...i("ADD") };
    case "CLEAR_ABSENCE":
      return { ids: t, ...i("REMOVE") };
  }
}
async function Uo(e, t, n) {
  if (!En(t) || n.length === 0 || n.some((d) => !Number.isSafeInteger(d) || d <= 0))
    throw new Error(
      `Choose ${mn(e).many} and configure a valid action first.`
    );
  let a = null;
  if (Pn(t)) {
    let d;
    try {
      d = await Do(e);
    } catch (h) {
      throw new Error(
        `Could not verify the ${Ya} custom field. ${h instanceof Error ? h.message : "Request failed."}`
      );
    }
    if (d.kind !== "ready") throw new Error(d.message);
    a = d.definition.key;
  }
  const i = Xr(n), o = (await Za(t)).map((d) => ({
    mode: d.mode,
    tagIds: Xr(d.tagIds)
  })), l = [
    ...o.filter((d) => !qn(d.mode)),
    ...o.filter((d) => qn(d.mode))
  ].map(
    (d) => Xc(d, i, a)
  );
  for (let d = 0; d < l.length; d++)
    try {
      await ie(`/api/${Ln(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(l[d])
      });
    } catch (h) {
      throw new Error(
        `Step ${d + 1} failed; ${d} earlier step(s) completed. Refresh and check the selected ${mn(e).many} before retrying. ${h instanceof Error ? h.message : "Request failed."}`
      );
    }
}
async function Zc(e, t) {
  if (!En(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await ie("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const Go = "-", el = "Ctrl+a", tl = "Ctrl/⌘A";
function Br(e) {
  return (t) => {
    t != null && t.repeat || e();
  };
}
function ti({
  surface: e,
  enabled: t,
  actionCount: n,
  onAction: a,
  onFind: i,
  onSelectAll: o
}) {
  const s = $({ onAction: a, onFind: i, onSelectAll: o });
  pn(() => {
    s.current = { onAction: a, onFind: i, onSelectAll: o };
  });
  const l = Math.max(0, Math.min(n, ar.length)), d = !!i && n > 0, h = e === "local" && !!o, p = Te(() => {
    const g = [];
    return h && g.push({
      keys: el,
      surface: "local",
      action: Br(() => {
        var m, y;
        return (y = (m = s.current).onSelectAll) == null ? void 0 : y.call(m);
      })
    }), d && g.push({
      keys: Go,
      surface: e,
      action: Br(() => {
        var m, y;
        return (y = (m = s.current).onFind) == null ? void 0 : y.call(m);
      })
    }), ar.slice(0, l).forEach(
      (m, y) => g.push(
        {
          keys: m,
          surface: e,
          action: Br(() => s.current.onAction(y, !1))
        },
        {
          keys: `Shift+${m}`,
          surface: e,
          action: Br(() => s.current.onAction(y, !0))
        }
      )
    ), g;
  }, [e, l, d, h]);
  Js(p, t);
}
const nl = {
  action: (e) => ar[e] ?? "",
  find: Go,
  selectAll: tl
};
function Dn() {
  return nl;
}
const rl = 600 * 1e3, ni = /* @__PURE__ */ new Map(), Ko = /* @__PURE__ */ new Map(), xn = /* @__PURE__ */ new Map();
function Bo(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = Ko.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function Vo(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && Ko.set(e.tagGroupId, e.tagGroupSortOrder), ni.set(e.id, { tag: e, at: Date.now() });
}
function Jo(e) {
  const t = ni.get(e);
  if (!(!t || Date.now() - t.at > rl))
    return Bo(t.tag);
}
function zo(e) {
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
function Oa(e) {
  var t;
  for (const n of e) {
    const a = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && a && Vo(zo({ ...n, name: a }));
  }
}
function al(e) {
  const t = xn.get(e);
  if (t) return t;
  const n = new AbortController(), a = {
    controller: n,
    waiters: 0,
    promise: ie(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (i) => {
        var p, g;
        const o = ((p = i == null ? void 0 : i.name) == null ? void 0 : p.trim()) || null;
        if (xn.get(e) === a && xn.delete(e), !o) return null;
        const s = zo({ ...i, id: e, name: o }), l = (g = ni.get(e)) == null ? void 0 : g.tag, d = (l == null ? void 0 : l.tagGroupId) === s.tagGroupId, h = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (d ? l == null ? void 0 : l.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (l == null ? void 0 : l.hasImage),
          imagePath: s.imagePath ?? (l == null ? void 0 : l.imagePath)
        };
        return Vo(h), Bo(h);
      },
      () => (xn.get(e) === a && xn.delete(e), null)
    )
  };
  return xn.set(e, a), a;
}
function Pi() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function ga(e) {
  const t = {};
  for (const n of e) {
    const a = Jo(n);
    a !== void 0 && (t[n] = a);
  }
  return t;
}
function il(e, t) {
  if (t != null && t.aborted) return Promise.reject(Pi());
  const n = {}, a = [];
  for (const i of new Set(e)) {
    const o = Jo(i);
    if (o !== void 0) n[i] = o;
    else {
      const s = al(i);
      s.waiters += 1, a.push({ id: i, entry: s });
    }
  }
  return a.length ? new Promise((i, o) => {
    let s = !1;
    const l = () => {
      for (const { id: h, entry: p } of a)
        p.waiters -= 1, p.waiters === 0 && xn.get(h) === p && (xn.delete(h), p.controller.abort());
    }, d = () => {
      s || (s = !0, l(), o(Pi()));
    };
    t == null || t.addEventListener("abort", d, { once: !0 }), Promise.all(
      a.map(
        ({ id: h, entry: p }) => p.promise.then((g) => [h, g])
      )
    ).then((h) => {
      if (!s) {
        s = !0, t == null || t.removeEventListener("abort", d), l();
        for (const [p, g] of h) n[p] = g;
        i(n);
      }
    });
  }) : Promise.resolve(n);
}
function Wo(e) {
  const t = {};
  for (const [n, a] of Object.entries(e)) t[Number(n)] = (a == null ? void 0 : a.name) ?? null;
  return t;
}
function ri(e) {
  const t = [...new Set(e)].sort((i, o) => i - o).join(","), [n, a] = S(() => ({
    key: t,
    tags: ga(ba(t))
  }));
  return V(() => {
    const i = ba(t), o = ga(i);
    if (a({ key: t, tags: o }), i.every((l) => l in o)) return;
    const s = new AbortController();
    return il(i, s.signal).then(
      (l) => a({ key: t, tags: l }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : ga(ba(t));
}
function sr(e) {
  const t = ri(e);
  return Te(() => Wo(t), [t]);
}
function ba(e) {
  return e ? e.split(",").map(Number) : [];
}
function ol(e, t, n = !1) {
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
function Wn(e, t, n = [], a) {
  if ("effect" in e) {
    const s = e.effect;
    if (s.mode === "SKIP") return [{ text: "Skip", tone: "neutral" }];
    if (s.mode === "CLEAR_TAG_GROUP")
      return [{ text: "Set Ungrouped", tone: "neutral" }];
    const l = n.find((d) => d.id === s.tagGroupId);
    return [
      {
        text: l ? `Assign ${l.name}` : "Unavailable tag group",
        tone: "neutral"
      }
    ];
  }
  if (!e.steps.length) return [{ text: "Skip", tone: "neutral" }];
  const i = ra(e), o = (s) => i.has(s) || [...i].some((l) => {
    var d;
    return (d = a == null ? void 0 : a.get(s)) == null ? void 0 : d.includes(l);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (l) => ol(
        s.mode,
        t[l] === void 0 ? "…" : t[l] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && o(l)
      )
    )
  );
}
function oa(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function ai({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  canStay: i = !0,
  onApply: o,
  onClose: s
}) {
  const [l, d] = S(""), [h, p] = S(0), g = $(null), m = $(null), y = $(null), b = $(null), N = $(null), R = xt(), C = sr(Te(() => oa(e), [e])), _ = Dn(), T = Te(() => {
    const P = l.trim().toLocaleLowerCase();
    return e.map((ne, pe) => ({ action: ne, index: pe, key: _.action(pe) })).filter((ne) => !P || ne.action.label.toLocaleLowerCase().includes(P));
  }, [e, _, l]), I = T.length ? Math.min(h, T.length - 1) : -1, D = (P) => `${R}-option-${P}`;
  pn(() => {
    var P, ne, pe;
    return b.current = document.activeElement, N.current = ((ne = (P = y.current) == null ? void 0 : P.parentElement) == null ? void 0 : ne.closest('[role="dialog"]')) ?? null, (pe = g.current) == null || pe.focus({ preventScroll: !0 }), () => {
      var A;
      const re = b.current;
      re instanceof HTMLElement && re.isConnected && re.focus({ preventScroll: !0 }), document.activeElement !== re && ((A = N.current) != null && A.isConnected) && N.current.focus({ preventScroll: !0 });
    };
  }, []), V(() => {
    var P, ne, pe;
    I < 0 || (pe = (ne = (P = m.current) == null ? void 0 : P.querySelector(`[id="${D(T[I].index)}"]`)) == null ? void 0 : ne.scrollIntoView) == null || pe.call(ne, { block: "nearest" });
  }, [I, T]);
  function J(P, ne) {
    !P || a != null && a(P.action) || o(P.action, i && ne);
  }
  function Q(P) {
    var ne;
    if (P.stopPropagation(), P.key === "Escape")
      P.preventDefault(), s();
    else if (P.key === "Enter")
      P.preventDefault(), P.repeat || J(T[I], P.shiftKey);
    else if (P.key === "ArrowDown" || P.key === "ArrowUp") {
      if (P.preventDefault(), !T.length) return;
      const pe = P.key === "ArrowDown" ? 1 : -1;
      p((I + pe + T.length) % T.length);
    } else P.key === "Tab" && (P.preventDefault(), (ne = g.current) == null || ne.focus());
  }
  return /* @__PURE__ */ c(me, { children: [
    /* @__PURE__ */ r("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: s }),
    /* @__PURE__ */ c(
      "div",
      {
        ref: y,
        role: "dialog",
        "aria-label": "Find an action",
        className: "dq-find-action",
        onKeyDown: Q,
        onMouseDown: (P) => {
          P.target !== g.current && P.preventDefault();
        },
        children: [
          /* @__PURE__ */ c("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ r(ta, { "aria-hidden": "true" }),
            /* @__PURE__ */ r(
              "input",
              {
                ref: g,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${R}-list`,
                "aria-activedescendant": I >= 0 ? D(T[I].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: l,
                onChange: (P) => {
                  d(P.target.value), p(0);
                }
              }
            ),
            /* @__PURE__ */ r("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          T.length ? /* @__PURE__ */ r(
            "ul",
            {
              ref: m,
              id: `${R}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: T.map((P, ne) => /* @__PURE__ */ r("li", { role: "none", children: /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: D(P.index),
                  tabIndex: -1,
                  "aria-selected": ne === I,
                  disabled: (a == null ? void 0 : a(P.action)) ?? !1,
                  onClick: (pe) => J(P, pe.shiftKey),
                  children: [
                    P.key ? /* @__PURE__ */ r("kbd", { children: P.key }) : /* @__PURE__ */ r("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ r("span", { className: "dq-find-label", children: P.action.label }),
                    /* @__PURE__ */ r("span", { className: "dq-find-effect", children: Wn(P.action, C, t, n).map(
                      (pe, re) => /* @__PURE__ */ r("span", { "data-effect-tone": pe.tone, children: pe.text }, re)
                    ) })
                  ]
                }
              ) }, P.action.id))
            }
          ) : /* @__PURE__ */ c("p", { className: "dq-find-empty", role: "status", children: [
            "No action matches “",
            l.trim(),
            "”."
          ] }),
          /* @__PURE__ */ c("p", { className: "dq-find-hints", "aria-hidden": "true", children: [
            /* @__PURE__ */ c("span", { children: [
              /* @__PURE__ */ r("kbd", { children: "Enter" }),
              " applies"
            ] }),
            i && /* @__PURE__ */ c("span", { children: [
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
const Vr = (e) => e >= "0" && e <= "9";
function Li(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function Di(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let n = 0, a = 0;
  for (; n < e.length && a < t.length; ) {
    if (Vr(e[n]) && Vr(t[a])) {
      const l = n, d = a;
      for (; n < e.length && Vr(e[n]); ) n++;
      for (; a < t.length && Vr(t[a]); ) a++;
      const h = e.slice(l, n).replace(/^0+/, ""), p = t.slice(d, a).replace(/^0+/, "");
      if (h.length !== p.length) return h.length < p.length ? -1 : 1;
      if (h !== p) return h < p ? -1 : 1;
      continue;
    }
    const o = Li(e[n]), s = Li(t[a]);
    if (o !== s) return o < s ? -1 : 1;
    n++, a++;
  }
  const i = e.length - n - (t.length - a);
  return i !== 0 ? i < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function Qo(e, t) {
  const n = (i) => i.tagGroupId != null ? 0 : 1, a = (i) => i.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(a(e) - a(t)) || Di(e.tagGroupName, t.tagGroupName) || Di(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function zn(e) {
  return [...e].sort(Qo);
}
function sl(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const a of n.steps)
        a.mode === "REMOVE_TREE" && a.tagIds.forEach((i) => t.add(i));
  return [...t];
}
function Ho(e, t, n) {
  const a = ra(e), i = [], o = [];
  for (const m of e.steps) {
    if (m.mode !== "REMOVE_TREE") {
      o.push(m);
      continue;
    }
    const y = m.tagIds.flatMap((b) => {
      const N = n.get(b);
      return N || i.push(b), N ?? [b];
    });
    o.push({ mode: "REMOVE", tagIds: y.filter((b) => !a.has(b)) });
  }
  const s = [
    ...o.filter((m) => !qn(m.mode)),
    ...o.filter((m) => qn(m.mode))
  ], l = new Set(t.ids), d = new Set(t.absent);
  for (const m of s)
    for (const y of m.tagIds)
      switch (m.mode) {
        case "ADD":
          l.add(y);
          break;
        case "REMOVE":
        case "REMOVE_TREE":
          l.delete(y);
          break;
        case "MARK_PRESENT":
          l.add(y), d.delete(y);
          break;
        case "MARK_ABSENT":
          l.delete(y), d.add(y);
          break;
        case "CLEAR_ABSENCE":
          d.delete(y);
          break;
      }
  const h = new Set(t.ids), p = new Set(t.absent), g = [...new Set(e.steps.flatMap((m) => m.tagIds))];
  return {
    added: g.filter((m) => l.has(m) && !h.has(m)),
    removed: [...h].filter((m) => !l.has(m)),
    markedAbsent: g.filter((m) => d.has(m) && !p.has(m)),
    absenceCleared: [...p].filter((m) => !d.has(m)),
    unresolvedTrees: [...new Set(i)]
  };
}
function cl(e) {
  let t;
  if (e.applications) {
    const n = /* @__PURE__ */ new Map();
    for (const a of e.applications)
      n.has(a.tag.id) || n.set(a.tag.id, a.tag);
    t = [...n.values()];
  } else
    t = e.tags ?? e.ids.map((n, a) => ({ id: n, name: e.names[a] ?? "" }));
  return zn(t);
}
function Yo(e) {
  const t = sl(e).sort((s, l) => s - l).join(","), [n, a] = S(() => /* @__PURE__ */ new Map()), i = $(/* @__PURE__ */ new Set()), o = $(!0);
  return V(() => (o.current = !0, () => {
    o.current = !1;
  }), []), V(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const l of s)
      i.current.has(l) || (i.current.add(l), ia([l]).then(
        (d) => {
          o.current && a((h) => new Map(h).set(l, d));
        },
        () => {
          i.current.delete(l);
        }
      ));
  }, [t]), n;
}
function Xo() {
  let e = null;
  const t = /* @__PURE__ */ new Set(), n = (a) => {
    a !== e && (e = a, t.forEach((i) => i()));
  };
  return {
    get: () => e,
    set: n,
    clear: (a) => {
      e === a && n(null);
    },
    subscribe: (a) => (t.add(a), () => t.delete(a))
  };
}
function ii(e) {
  return co(e.subscribe, e.get, e.get);
}
const _i = [
  { indent: 0, slots: wa(0, 11), fixed: [] },
  { indent: 1, slots: wa(11, 22), fixed: [] },
  { indent: 2, slots: wa(22, 27), fixed: ["n", "m", ",", "."] }
];
function wa(e, t) {
  return Array.from({ length: t - e }, (n, a) => e + a);
}
function ji(e, t) {
  return e === "g" ? "Go to…" : e === "f" ? t === "video" ? "Fullscreen · filters" : "Filters" : t === "video" && e === "k" ? "Play / pause" : t === "video" && e === "m" ? "Mute" : "";
}
function ut({ binding: e, hidden: t }) {
  return /* @__PURE__ */ r(
    "kbd",
    {
      className: Array.from(e).length === 1 ? "dq-key dq-key-letter" : "dq-key",
      "aria-hidden": t || void 0,
      children: e
    }
  );
}
function Ui(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function ll({
  actions: e,
  mediaKind: t,
  isDisabled: n,
  busy: a,
  tags: i,
  trees: o,
  preview: s,
  onApply: l,
  onFind: d,
  findDisabled: h,
  paused: p = !1
}) {
  const g = Dn(), m = xt(), y = sr(
    Te(() => e.flatMap((T) => T.steps.flatMap((I) => I.tagIds)), [e])
  ), b = _i.filter((T) => T.slots.some((I) => I < e.length)), N = b.length === _i.length, R = Math.max(0, e.length - ar.length), C = (T) => ({
    onMouseEnter: () => s.set(T),
    onMouseLeave: () => s.clear(T),
    onFocus: () => s.set(T),
    onBlur: (I) => {
      I.currentTarget.contains(I.relatedTarget) || s.clear(T);
    }
  }), _ = (T) => {
    const I = e[T], D = g.action(T);
    if (!I) {
      const P = ji(D, t);
      return /* @__PURE__ */ c(
        "div",
        {
          className: `dq-pad-slot dq-pad-free${P ? " dq-pad-reserved" : ""}`,
          "aria-hidden": "true",
          children: [
            /* @__PURE__ */ r(ut, { binding: D }),
            P && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: P })
          ]
        },
        T
      );
    }
    const J = n(I), Q = `${m}-effect-${T}`;
    return /* @__PURE__ */ c("div", { className: "dq-pad-slot", ...p ? {} : C(I), children: [
      /* @__PURE__ */ r("span", { id: Q, className: "dq-sr-only", children: Wn(I, y, [], o).map((P) => P.text).join(", ") }),
      /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: I.label,
          "aria-keyshortcuts": D,
          "aria-describedby": Q,
          disabled: J,
          onClick: (P) => l(I, P.shiftKey),
          children: [
            /* @__PURE__ */ r(ut, { binding: D }),
            " ",
            /* @__PURE__ */ r("span", { className: "dq-pad-label", children: I.label }),
            Ui(I) && " ",
            Ui(I) && /* @__PURE__ */ c("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(Ca, { "aria-hidden": "true" }),
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
          disabled: J,
          onClick: () => l(I, !0),
          children: /* @__PURE__ */ r(ic, { "aria-hidden": "true" })
        }
      )
    ] }, T);
  };
  return /* @__PURE__ */ c(
    "section",
    {
      className: `dq-pad${p ? " dq-pad-paused" : ""}`,
      "aria-label": p ? "Actions, paused while editing" : "Actions",
      "aria-busy": a || void 0,
      children: [
        /* @__PURE__ */ c("div", { className: "dq-pad-header", children: [
          p ? /* @__PURE__ */ c("p", { className: "dq-pad-paused-note", children: [
            /* @__PURE__ */ r(rr, { "aria-hidden": "true" }),
            "Actions are paused while you edit the review"
          ] }) : /* @__PURE__ */ c(me, { children: [
            /* @__PURE__ */ r(
              dl,
              {
                actions: e,
                names: y,
                tags: i,
                trees: o,
                preview: s,
                extra: R,
                findKey: g.find
              }
            ),
            /* @__PURE__ */ c("span", { className: "dq-pad-hint", children: [
              /* @__PURE__ */ r("kbd", { className: "dq-key", children: "Shift" }),
              /* @__PURE__ */ r("span", { children: "+ key applies and stays" })
            ] })
          ] }),
          !N && /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "dq-pad-find-button",
              "aria-label": "Find action",
              "aria-keyshortcuts": g.find,
              disabled: h,
              onClick: d,
              children: [
                /* @__PURE__ */ r(ut, { binding: g.find }),
                /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "Find action" })
              ]
            }
          )
        ] }),
        b.map((T) => /* @__PURE__ */ c("div", { className: "dq-pad-row", "data-indent": T.indent, children: [
          T.slots.map(_),
          T.fixed.map((I) => {
            const D = ji(I, t);
            return /* @__PURE__ */ c(
              "div",
              {
                className: `dq-pad-slot dq-pad-free dq-pad-fixed${D ? " dq-pad-reserved" : ""}`,
                "aria-hidden": "true",
                children: [
                  /* @__PURE__ */ r(ut, { binding: I }),
                  D && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: D })
                ]
              },
              I
            );
          }),
          T.fixed.length > 0 && /* @__PURE__ */ r("div", { className: "dq-pad-slot", children: /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": R ? `Find action, ${R} more` : "Find action",
              "aria-keyshortcuts": g.find,
              disabled: h,
              onClick: d,
              children: [
                /* @__PURE__ */ r(ut, { binding: g.find }),
                /* @__PURE__ */ c("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ r(ta, { "aria-hidden": "true" }),
                  R ? `${R} more` : "Find action"
                ] })
              ]
            }
          ) })
        ] }, T.indent))
      ]
    }
  );
}
function dl({
  actions: e,
  names: t,
  tags: n,
  trees: a,
  preview: i,
  extra: o,
  findKey: s
}) {
  const l = Dn(), d = ii(i), h = d ? e.indexOf(d) : -1;
  if (!d || h < 0)
    return /* @__PURE__ */ c("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      o > 0 && /* @__PURE__ */ c(me, { children: [
        ` · ${ar.length} on keys, ${o} more under `,
        /* @__PURE__ */ r(ut, { binding: s })
      ] })
    ] });
  const p = l.action(h), g = n && d.steps.length ? Ho(d, n, a) : null, m = g && !g.unresolvedTrees.length && ![g.added, g.removed, g.markedAbsent, g.absenceCleared].some(
    (y) => y.length
  );
  return /* @__PURE__ */ c("p", { className: "dq-pad-effect", children: [
    p && /* @__PURE__ */ r(ut, { binding: p }),
    /* @__PURE__ */ r("strong", { children: d.label }),
    Wn(d, t, [], a).map((y, b) => /* @__PURE__ */ r("span", { "data-effect-tone": y.tone, children: y.text }, b)),
    m && /* @__PURE__ */ r("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function Zo({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  busy: i,
  onApply: o,
  onFind: s,
  summary: l,
  hints: d,
  notices: h,
  status: p,
  className: g = "",
  paused: m = !1
}) {
  const y = Dn(), b = xt(), N = sr(Te(() => oa(e), [e])), [R] = S(() => Xo()), C = $(null), _ = ul(C, e), T = e.slice(0, ar.length), I = e.length - T.length, D = (Q) => Wn(Q, N, t, n).map((P) => P.text).join(", "), J = (Q) => ({
    onMouseEnter: () => R.set(Q),
    onMouseLeave: () => R.clear(Q),
    onFocus: () => R.set(Q),
    onBlur: (P) => {
      P.currentTarget.contains(P.relatedTarget) || R.clear(Q);
    }
  });
  return /* @__PURE__ */ c(
    "section",
    {
      ref: C,
      className: `dq-action-bar${_ ? " dq-bar-stacked" : ""}${i ? " dq-bar-busy" : ""}${m ? " dq-bar-paused" : ""}${g ? ` ${g}` : ""}`,
      "aria-label": "Actions",
      children: [
        /* @__PURE__ */ r("div", { className: "dq-bar-summary", children: l }),
        /* @__PURE__ */ r("span", { className: "dq-bar-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ c("div", { className: "dq-bar-tiles", "aria-busy": i || void 0, children: [
          T.map((Q, P) => {
            const ne = y.action(P);
            return /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "dq-bar-tile",
                title: Q.label,
                "aria-keyshortcuts": ne || void 0,
                "aria-describedby": `${b}-effect-${P}`,
                disabled: m || a(Q),
                onClick: () => o(Q),
                ...m ? {} : J(Q),
                children: [
                  ne && /* @__PURE__ */ r(ut, { binding: ne }),
                  " ",
                  /* @__PURE__ */ r("span", { className: "dq-bar-label", children: Q.label })
                ]
              },
              Q.id
            );
          }),
          e.length > 0 ? /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "dq-bar-tile dq-bar-find",
              "aria-label": I > 0 ? `Find action, ${I} more` : "Find action",
              "aria-keyshortcuts": y.find,
              disabled: m,
              onClick: s,
              children: [
                /* @__PURE__ */ r(ut, { binding: y.find, hidden: !0 }),
                /* @__PURE__ */ r(ta, { "aria-hidden": "true" }),
                /* @__PURE__ */ r("span", { className: "dq-bar-label", children: I > 0 ? `${I} more` : "Find action" })
              ]
            }
          ) : /* @__PURE__ */ r("p", { className: "dq-bar-empty", children: "This review has no actions." })
        ] }),
        d && /* @__PURE__ */ r("p", { className: "dq-bar-hints", children: d }),
        m ? /* @__PURE__ */ c("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ r(rr, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ r(fl, { actions: T, preview: R, names: N, tagGroups: t, trees: n }),
        h && /* @__PURE__ */ r("div", { className: "dq-bar-notices", children: h }),
        /* @__PURE__ */ r("div", { hidden: !0, children: T.map((Q, P) => /* @__PURE__ */ r("span", { id: `${b}-effect-${P}`, children: D(Q) }, Q.id)) }),
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: p })
      ]
    }
  );
}
function ul(e, t) {
  const [n, a] = S(!1);
  return pn(() => {
    var h;
    const i = e.current;
    if (!i || typeof ResizeObserver > "u") return;
    const o = i.querySelector(".dq-bar-summary"), s = () => {
      const p = getComputedStyle(i), g = parseFloat(p.columnGap) || 0, m = i.clientWidth - (parseFloat(p.paddingLeft) || 0) - (parseFloat(p.paddingRight) || 0), y = [...i.querySelectorAll(".dq-bar-tiles > *")].map(
        (_) => _.offsetWidth
      ), b = parseFloat(getComputedStyle(i.querySelector(".dq-bar-tiles")).columnGap) || 0, N = i.querySelector(".dq-bar-hints"), R = ((o == null ? void 0 : o.offsetWidth) ?? 0) + (N ? N.offsetWidth + g : 0) + 1 + // the divider
      2 * g, C = (_) => {
        let T = 1, I = 0;
        for (const D of y)
          I > 0 && I + b + D > _ ? (T += 1, I = D) : I += (I > 0 ? b : 0) + D;
        return T;
      };
      a(1 + C(m) < C(m - R));
    }, l = new ResizeObserver(s);
    l.observe(i);
    for (const p of i.querySelectorAll(".dq-bar-summary, .dq-bar-tiles, .dq-bar-hints"))
      l.observe(p);
    s();
    let d = !0;
    return (h = document.fonts) == null || h.ready.then(() => {
      d && s();
    }), () => {
      d = !1, l.disconnect();
    };
  }, [e, t]), n;
}
function fl({
  actions: e,
  preview: t,
  names: n,
  tagGroups: a,
  trees: i
}) {
  const o = Dn(), s = ii(t), l = s ? e.indexOf(s) : -1;
  if (!s || l < 0) return null;
  const d = o.action(l);
  return /* @__PURE__ */ c("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    d && /* @__PURE__ */ r(ut, { binding: d }),
    /* @__PURE__ */ r("strong", { children: s.label }),
    Wn(s, n, a, i).map((h, p) => /* @__PURE__ */ r("span", { "data-effect-tone": h.tone, children: h.text }, p))
  ] });
}
const Gi = 1e3;
async function hl(e, t, n) {
  const a = await ie(
    `/api/tags/${t}`,
    { signal: n }
  ), i = /* @__PURE__ */ new Map();
  for (let d = 1; ; d++) {
    const h = await ie(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          Cn({
            findFilter: {
              page: d,
              perPage: Gi,
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
    for (const p of h.items) i.set(p.id, p);
    if (d * Gi >= h.totalCount) break;
    if (!h.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const o = [...i.values()], s = Re(e), l = ve(e) ? await ml(
    s,
    o.map((d) => d.id),
    n
  ) : o.map((d) => (s === "audio" ? d.audioCount : d.videoCount) ?? 0);
  return {
    parent: { id: t, name: a.name },
    children: o.map((d, h) => ({ id: d.id, name: d.name, uses: l[h] })).sort(
      (d, h) => h.uses - d.uses || d.name.localeCompare(h.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      })
    )
  };
}
function pl(e) {
  return JSON.stringify(
    Cn({
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
async function ml(e, t, n) {
  const a = new Array(t.length).fill(0), i = new AbortController(), o = () => i.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && o(), n == null || n.addEventListener("abort", o, { once: !0 });
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; s < t.length && !i.signal.aborted; ) {
            const l = s++;
            a[l] = (await ie(
              `/api/${Ln(e)}/aggregate`,
              {
                method: "POST",
                signal: i.signal,
                body: pl(t[l])
              }
            )).count;
          }
        } catch (l) {
          throw i.abort(), l;
        }
      })
    );
  } finally {
    n == null || n.removeEventListener("abort", o);
  }
  return i.signal.throwIfAborted(), a;
}
function gl(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((a) => t.has(a.id) ? !1 : (t.add(a.id), !0))
  }));
}
function bl(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of n.children)
      t.set(a.id, [...t.get(a.id) ?? [], n.parent.id]);
  return t;
}
function wl(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of ra(n))
      t.set(a, [...t.get(a) ?? [], n]);
  return t;
}
function yl(e, t) {
  return {
    id: crypto.randomUUID(),
    label: e.name,
    steps: [
      { mode: "ADD", tagIds: [e.id] },
      ...t.length ? [{ mode: "REMOVE_TREE", tagIds: t }] : []
    ]
  };
}
const vl = (e) => e instanceof Error ? e.message : "Request failed.";
function Nl({
  id: e,
  review: t,
  disabled: n,
  onAdd: a,
  onCancel: i
}) {
  const [o, s] = S([]), [l, d] = S({}), [h, p] = S({}), [g, m] = S({}), y = $(/* @__PURE__ */ new Map());
  V(
    () => () => {
      for (const O of y.current.values()) O.abort();
    },
    []
  );
  const b = mn(Re(t)), N = ve(t), R = N ? "performer" : b.one;
  function C(O) {
    var ee;
    (ee = y.current.get(O)) == null || ee.abort();
    const L = new AbortController();
    y.current.set(O, L), d((ae) => ({ ...ae, [O]: { status: "loading" } })), hl(t, O, L.signal).then(
      (ae) => {
        L.signal.aborted || d((le) => ({
          ...le,
          [O]: { status: "ready", group: ae }
        }));
      },
      (ae) => {
        L.signal.aborted || d((le) => ({
          ...le,
          [O]: { status: "failed", message: vl(ae) }
        }));
      }
    );
  }
  function _(O) {
    var ue;
    const L = o.filter((ge) => !O.includes(ge));
    for (const ge of L)
      (ue = y.current.get(ge)) == null || ue.abort(), y.current.delete(ge);
    const ee = (ge) => {
      const E = l[ge];
      return (E == null ? void 0 : E.status) === "ready" ? E.group.children.map((j) => j.id) : [];
    }, ae = new Set(O.flatMap(ee)), le = L.flatMap(ee).filter((ge) => !ae.has(ge));
    p(
      (ge) => Object.fromEntries(
        Object.entries(ge).filter(([E]) => !le.includes(Number(E)))
      )
    ), m(
      (ge) => Object.fromEntries(
        Object.entries(ge).filter(([E]) => O.includes(Number(E)))
      )
    ), d(
      (ge) => Object.fromEntries(
        Object.entries(ge).filter(([E]) => O.includes(Number(E)))
      )
    ), s(O);
    for (const ge of O) o.includes(ge) || C(ge);
  }
  const T = o.flatMap((O) => {
    const L = l[O];
    return (L == null ? void 0 : L.status) === "ready" ? [L.group] : [];
  }), I = T.length === o.length, D = o.some(
    (O) => {
      var L;
      return (((L = l[O]) == null ? void 0 : L.status) ?? "loading") === "loading";
    }
  ), J = new Map(
    gl(T).map((O) => [O.parent.id, O])
  ), Q = bl(T), P = new Map(T.map((O) => [O.parent.id, O.parent.name])), ne = wl(t.actions), pe = (O) => h[O] ?? !ne.has(O), re = I ? [...J.values()].flatMap(
    (O) => O.children.filter((L) => pe(L.id))
  ) : [], A = (O, L) => p((ee) => ({
    ...ee,
    ...Object.fromEntries(O.children.map((ae) => [ae.id, L]))
  }));
  return /* @__PURE__ */ c("fieldset", { id: e, className: "dq-actions-from-tags", children: [
    /* @__PURE__ */ r("legend", { children: "Add actions from parent tags" }),
    /* @__PURE__ */ c("p", { className: "dq-drawer-note", children: [
      "Each ticked child tag becomes an action that adds it, most used",
      " ",
      N ? "on performers " : "",
      "first. Tags an action already adds start unticked. The new actions go at the end, ready to reorder and edit."
    ] }),
    /* @__PURE__ */ r(
      Sn,
      {
        entityType: "tag",
        values: o,
        onChange: _,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    o.map((O) => {
      const L = l[O];
      if (!L || L.status === "loading")
        return /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Loading child tags…" }, O);
      if (L.status === "failed")
        return /* @__PURE__ */ c("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ c("span", { children: [
            "Child tags could not be loaded. ",
            L.message
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: n,
              onClick: () => C(O),
              children: "Retry"
            }
          )
        ] }, O);
      const ee = J.get(O);
      if (!ee) return null;
      const ae = ee.parent.name;
      return /* @__PURE__ */ c("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ r("legend", { children: ae }),
        L.group.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ c(me, { children: [
          /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: g[O] ?? !1,
                disabled: n,
                onChange: (le) => m((ue) => ({
                  ...ue,
                  [O]: le.target.checked
                }))
              }
            ),
            "Only one per ",
            R,
            ": each action removes every other tag in the ",
            ae,
            " tree"
          ] }),
          ee.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ c(me, { children: [
            /* @__PURE__ */ c("div", { className: "dq-row", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${ae}`,
                  onClick: () => A(ee, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${ae}`,
                  onClick: () => A(ee, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ r("div", { className: "dq-child-tags", children: ee.children.map((le) => {
              const ue = ne.get(le.id) ?? [], ge = (Q.get(le.id) ?? []).filter((E) => E !== O).map((E) => `“${P.get(E)}”`);
              return /* @__PURE__ */ c("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "checkbox",
                    checked: pe(le.id),
                    disabled: n,
                    onChange: (E) => p((j) => ({
                      ...j,
                      [le.id]: E.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ c("span", { children: [
                  le.name,
                  " ",
                  /* @__PURE__ */ c("small", { children: [
                    le.uses.toLocaleString(),
                    " ",
                    le.uses === 1 ? b.one : b.many
                  ] }),
                  ge.length > 0 && /* @__PURE__ */ c("small", { children: [
                    " · Also under ",
                    ge.join(", ")
                  ] }),
                  ue.length > 0 && /* @__PURE__ */ c("small", { children: [
                    " ",
                    "· Already in “",
                    ue[0].label || "New action",
                    "”",
                    ue.length > 1 ? ` and ${ue.length - 1} more` : ""
                  ] })
                ] })
              ] }, le.id);
            }) })
          ] })
        ] })
      ] }, O);
    }),
    /* @__PURE__ */ c("div", { className: "dq-row", children: [
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: n || !re.length,
          onClick: () => a(
            re.map(
              (O) => yl(
                O,
                (Q.get(O.id) ?? []).filter(
                  (L) => g[L]
                )
              )
            )
          ),
          children: re.length ? `Add ${re.length} action${re.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: i, children: "Cancel" }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-sr-only", children: D ? "Loading child tags…" : "" })
    ] })
  ] });
}
const ql = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function Sl(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function El(e, t) {
  if (En(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (Ha(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function es(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function Cl(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function Al({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: a,
  saving: i,
  expandedId: o,
  onExpand: s,
  reveal: l
}) {
  const d = Ke(e), h = d !== "tag", p = e.actions, g = Dn(), m = sr(Te(() => oa(p), [p])), [y, b] = S(""), [N, R] = S(!1), [C, _] = S(
    null
  ), T = xt(), I = `${T}-from-tags`, D = $(null), J = $(null), Q = $(null), P = $(null), ne = $(/* @__PURE__ */ new WeakMap()), pe = (j) => {
    let te = ne.current.get(j);
    return te || (te = crypto.randomUUID(), ne.current.set(j, te)), te;
  }, re = y.trim().toLocaleLowerCase(), A = re ? p.filter((j) => j.label.toLocaleLowerCase().includes(re)) : p, O = (j) => t({ ...e, actions: j }), L = (j, te) => O(p.map((Ce, Oe) => Oe === j ? te : Ce));
  function ee(j) {
    var te;
    return [...((te = Q.current) == null ? void 0 : te.querySelectorAll("[data-action-id]")) ?? []].find(
      (Ce) => Ce.dataset.actionId === j
    );
  }
  function ae(j, te) {
    const Ce = ee(j), Oe = Ce == null ? void 0 : Ce.querySelector(
      te === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return Oe == null || Oe.focus(), !!Oe;
  }
  pn(() => {
    var te;
    const j = P.current;
    j && (P.current = null, (j === "add" || !ae(j.id, j.part)) && ((te = J.current) == null || te.focus()));
  }), V(() => {
    !l || !o || (A.some((j) => j.id === o) ? ae(o, "label") : (b(""), P.current = { id: o, part: "label" }));
  }, [l]);
  function le() {
    const j = Cl(d);
    b(""), O([...p, j]), s(j.id), P.current = { id: j.id, part: "label" };
  }
  function ue(j) {
    const te = p[j], Ce = {
      ...structuredClone(te),
      id: crypto.randomUUID(),
      label: `${te.label} copy`
    };
    O([...p.slice(0, j + 1), Ce, ...p.slice(j + 1)]), s(Ce.id), P.current = { id: Ce.id, part: "label" };
  }
  function ge(j) {
    const te = p[j], Ce = A.indexOf(te), Oe = A[Ce + 1] ?? A[Ce - 1];
    O(p.filter((ft, vt) => vt !== j)), o === te.id && s(null), P.current = Oe ? { id: Oe.id, part: "toggle" } : "add";
  }
  function E() {
    R(!1), requestAnimationFrame(() => {
      var j;
      return (j = D.current) == null ? void 0 : j.focus();
    });
  }
  return /* @__PURE__ */ c("div", { className: "dq-actions-editor", children: [
    /* @__PURE__ */ c("div", { className: "dq-actions-head", children: [
      /* @__PURE__ */ c("div", { className: "dq-actions-toolbar", children: [
        /* @__PURE__ */ c(
          "button",
          {
            ref: J,
            type: "button",
            className: "dq-header-button",
            onClick: le,
            children: [
              /* @__PURE__ */ r(Ka, { "aria-hidden": "true" }),
              "Add action"
            ]
          }
        ),
        h && /* @__PURE__ */ r(
          "button",
          {
            ref: D,
            type: "button",
            className: "dq-header-button",
            "aria-expanded": N,
            "aria-controls": N ? I : void 0,
            onClick: () => {
              _(null), R(!N);
            },
            children: "Add from parent tags…"
          }
        ),
        /* @__PURE__ */ c("label", { className: "dq-actions-filter", children: [
          /* @__PURE__ */ r(ta, { "aria-hidden": "true" }),
          /* @__PURE__ */ r(
            "input",
            {
              type: "search",
              "aria-label": "Find an action",
              placeholder: "Find an action…",
              autoComplete: "off",
              spellCheck: !1,
              value: y,
              onChange: (j) => b(j.target.value),
              onKeyDown: (j) => {
                j.key === "Escape" && y && (j.preventDefault(), j.stopPropagation(), b(""));
              }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-actions-hint", children: "Letters follow this order. Drag a handle, or press Alt + ↑ / ↓, to reorder." }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-actions-status", children: (C == null ? void 0 : C.actions) === p ? `Added ${C.count} action${C.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    h && N && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here.
    /* @__PURE__ */ r(
      "div",
      {
        onKeyDown: (j) => {
          j.key !== "Escape" || j.defaultPrevented || (j.preventDefault(), j.stopPropagation(), E());
        },
        children: /* @__PURE__ */ r(
          Nl,
          {
            id: I,
            review: e,
            disabled: i,
            onAdd: (j) => {
              const te = [...p, ...j];
              O(te), _({ actions: te, count: j.length }), E();
            },
            onCancel: E
          }
        )
      }
    ),
    /* @__PURE__ */ r("div", { ref: Q, children: A.length > 0 && /* @__PURE__ */ r(
      lo,
      {
        items: A,
        getKey: (j) => j.id,
        disabled: i || !!re,
        className: "dq-action-list",
        onReorder: (j) => O(j),
        renderItem: (j, { dragHandleProps: te, isOver: Ce }) => {
          const Oe = p.indexOf(j), ft = o === j.id;
          return /* @__PURE__ */ r(
            kl,
            {
              action: j,
              entityType: d,
              binding: g.action(Oe),
              effect: Wn(j, m, n, a),
              open: ft,
              detailId: `${T}-detail-${j.id}`,
              dragHandleProps: te,
              isOver: Ce,
              reorderDisabled: i || !!re,
              onToggle: () => s(ft ? null : j.id),
              onDuplicate: () => ue(Oe),
              onDelete: () => ge(Oe),
              children: "steps" in j ? /* @__PURE__ */ r(
                Tl,
                {
                  action: j,
                  saving: i,
                  stepKey: pe,
                  rememberStepKey: (vt, ct) => ne.current.set(vt, pe(ct)),
                  onChange: (vt) => L(Oe, vt)
                }
              ) : /* @__PURE__ */ r(
                Il,
                {
                  action: j,
                  tagGroups: n,
                  onChange: (vt) => L(Oe, vt)
                }
              )
            }
          );
        }
      }
    ) }),
    p.length ? !A.length && /* @__PURE__ */ c("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      y.trim(),
      "”."
    ] }) : /* @__PURE__ */ r("p", { className: "dq-actions-empty", children: h ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function kl({
  action: e,
  entityType: t,
  binding: n,
  effect: a,
  open: i,
  detailId: o,
  dragHandleProps: s,
  isOver: l,
  reorderDisabled: d,
  onToggle: h,
  onDuplicate: p,
  onDelete: g,
  children: m
}) {
  const y = e.label.trim() || "New action", b = El(e, t);
  return /* @__PURE__ */ c(
    "div",
    {
      className: `dq-action-row${i ? " dq-action-row-open" : ""}${l ? " dq-drag-over" : ""}`,
      "data-action-id": e.id,
      children: [
        /* @__PURE__ */ c("div", { className: "dq-action-row-head", children: [
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              ...s,
              style: es(s.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${y}`,
              title: d ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: d,
              children: /* @__PURE__ */ r(mo, { "aria-hidden": "true" })
            }
          ),
          n ? /* @__PURE__ */ r(ut, { binding: n }) : /* @__PURE__ */ r("span", { className: "dq-key dq-key-none", title: "Reached with Find action", children: "·" }),
          /* @__PURE__ */ c("div", { className: "dq-action-row-summary", onClick: h, children: [
            /* @__PURE__ */ r("span", { className: "dq-action-row-label", title: y, children: y }),
            !i && /* @__PURE__ */ r("span", { className: "dq-action-row-effect", children: a.map((N, R) => /* @__PURE__ */ r("span", { "data-effect-tone": N.tone, children: N.text }, R)) }),
            b && /* @__PURE__ */ c("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ r(Vn, { "aria-hidden": "true" }),
              b
            ] })
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Duplicate ${y}`,
              title: "Duplicate",
              onClick: p,
              children: /* @__PURE__ */ r(go, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Delete ${y}`,
              title: "Delete",
              onClick: g,
              children: /* @__PURE__ */ r(bo, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small dq-action-toggle",
              "aria-label": `${i ? "Collapse" : "Expand"} ${y}`,
              "aria-expanded": i,
              "aria-controls": i ? o : void 0,
              onClick: h,
              children: /* @__PURE__ */ r(wo, { "aria-hidden": "true" })
            }
          )
        ] }),
        i && /* @__PURE__ */ r("div", { id: o, className: "dq-action-detail", children: m })
      ]
    }
  );
}
function ts({
  action: e,
  onChange: t
}) {
  return /* @__PURE__ */ c("label", { className: "dq-action-field", children: [
    /* @__PURE__ */ r("span", { className: "dq-action-field-name", children: "Button label" }),
    /* @__PURE__ */ r(
      "input",
      {
        className: "dq-input dq-action-label-input",
        value: e.label,
        onChange: (n) => t(n.target.value)
      }
    )
  ] });
}
function Tl({
  action: e,
  saving: t,
  stepKey: n,
  rememberStepKey: a,
  onChange: i
}) {
  const o = xt(), s = $(null), l = $(null);
  pn(() => {
    var p, g;
    const h = l.current;
    h != null && (l.current = null, (g = (p = s.current) == null ? void 0 : p.querySelector(`[data-step-index="${h}"] input`)) == null || g.focus());
  });
  const d = (h) => i({ ...e, steps: h });
  return /* @__PURE__ */ c(me, { children: [
    /* @__PURE__ */ r(ts, { action: e, onChange: (h) => i({ ...e, label: h }) }),
    /* @__PURE__ */ c("div", { className: "dq-action-field dq-action-field-top", role: "group", "aria-labelledby": o, children: [
      /* @__PURE__ */ r("span", { className: "dq-action-field-name", id: o, children: "Steps" }),
      /* @__PURE__ */ c("div", { className: "dq-steps", ref: s, children: [
        e.steps.length > 0 ? /* @__PURE__ */ r(
          lo,
          {
            items: e.steps,
            getKey: n,
            disabled: t,
            className: "dq-step-list",
            onReorder: d,
            renderItem: (h, { index: p, dragHandleProps: g, isOver: m }) => /* @__PURE__ */ r(
              Rl,
              {
                step: h,
                index: p,
                dragHandleProps: g,
                isOver: m,
                saving: t,
                onChange: (y) => {
                  a(y, h), d(e.steps.map((b, N) => N === p ? y : b));
                },
                onRemove: () => d(e.steps.filter((y, b) => b !== p))
              }
            )
          }
        ) : /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "No steps: the action skips the item." }),
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: "dq-add-step",
            onClick: () => {
              l.current = e.steps.length, d([...e.steps, { mode: "ADD", tagIds: [] }]);
            },
            children: [
              /* @__PURE__ */ r(Ka, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function Rl({
  step: e,
  index: t,
  dragHandleProps: n,
  isOver: a,
  saving: i,
  onChange: o,
  onRemove: s
}) {
  const l = t + 1;
  return /* @__PURE__ */ c(
    "div",
    {
      className: `dq-step${a ? " dq-drag-over" : ""}`,
      "data-step-tone": Sl(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            ...n,
            style: es(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${l}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: i,
            children: [
              /* @__PURE__ */ r(mo, { "aria-hidden": "true" }),
              /* @__PURE__ */ r("span", { "aria-hidden": "true", children: l })
            ]
          }
        ),
        /* @__PURE__ */ r(
          "select",
          {
            className: "dq-select dq-step-mode",
            "aria-label": `Step ${l} operation`,
            value: e.mode,
            onChange: (d) => o({ ...e, mode: d.target.value }),
            children: ql.map(({ mode: d, label: h }) => /* @__PURE__ */ r("option", { value: d, children: h }, d))
          }
        ),
        /* @__PURE__ */ r(
          Sn,
          {
            entityType: "tag",
            values: e.tagIds,
            onChange: (d) => o({ ...e, tagIds: d }),
            placeholder: "Add tag…",
            inputAriaLabel: `Add a tag to step ${l}`,
            containerClassName: "dq-chip-input dq-step-tags",
            inputClassName: "dq-chip-input-field",
            allowCreate: !1,
            disabled: i
          }
        ),
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            className: "dq-icon-button dq-icon-button-small",
            "aria-label": `Remove step ${l}`,
            title: "Remove step",
            onClick: s,
            children: /* @__PURE__ */ r(kr, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function Il({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const a = e.effect, i = a.mode === "SET_TAG_GROUP" ? `group:${a.tagGroupId}` : a.mode, o = a.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === a.tagGroupId);
  return /* @__PURE__ */ c(me, { children: [
    /* @__PURE__ */ r(ts, { action: e, onChange: (s) => n({ ...e, label: s }) }),
    /* @__PURE__ */ c("label", { className: "dq-action-field", children: [
      /* @__PURE__ */ r("span", { className: "dq-action-field-name", children: "Effect" }),
      /* @__PURE__ */ c(
        "select",
        {
          className: "dq-select",
          "aria-label": "Tag group action",
          value: i,
          onChange: (s) => {
            const l = s.target.value;
            n({
              ...e,
              effect: l === "SKIP" ? { mode: "SKIP" } : l === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : { mode: "SET_TAG_GROUP", tagGroupId: Number(l.slice(6)) }
            });
          },
          children: [
            /* @__PURE__ */ r("option", { value: "SKIP", children: "Skip" }),
            /* @__PURE__ */ r("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
            o && /* @__PURE__ */ r("option", { value: i, disabled: !0, children: "Unavailable tag group" }),
            t.map((s) => /* @__PURE__ */ r("option", { value: `group:${s.id}`, children: s.name }, s.id))
          ]
        }
      )
    ] })
  ] });
}
function $l({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, a = mn(Re(e)).queue, i = (o) => t({ ...e, occurrence: { ...n, ...o } });
  return /* @__PURE__ */ c("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
    /* @__PURE__ */ c("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      a,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ r(
      Sn,
      {
        entityType: "tag",
        values: n.tagIds,
        onChange: (o) => i({ tagIds: o }),
        placeholder: "Search review tag choices...",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
      /* @__PURE__ */ r(
        "input",
        {
          type: "checkbox",
          checked: n.multiple,
          onChange: (o) => i({ multiple: o.target.checked })
        }
      ),
      "Allow multiple tags, for example when something changes part-way through the ",
      a
    ] }),
    /* @__PURE__ */ r("p", { children: "Save & next performer applies the selected tags and advances. Save choices stays on the performer. Skip only moves the cursor; eligibility comes from the filters." })
  ] });
}
function Ol({
  review: e,
  onChange: t
}) {
  const n = mn(Re(e)).many;
  return /* @__PURE__ */ c("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ r("legend", { children: "Performer flags" }),
    /* @__PURE__ */ c("p", { children: [
      "Flag performers whose profile has any of these tags in the performer list and batches, for example a tag noting that something changed during their career. Check a flagged performer’s earliest and latest ",
      n,
      " ",
      "before applying one batch to all of them."
    ] }),
    /* @__PURE__ */ r(
      Sn,
      {
        entityType: "tag",
        values: e.occurrence.flagPerformerTagIds ?? [],
        onChange: (a) => {
          const { flagPerformerTagIds: i, ...o } = e.occurrence;
          t({
            ...e,
            occurrence: a.length ? { ...o, flagPerformerTagIds: a } : o
          });
        },
        placeholder: "Search performer flag tags...",
        allowCreate: !1
      }
    )
  ] });
}
const ns = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, rs = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, Ml = {
  video: na,
  audio: No,
  tag: vo,
  performerOccurrence: yo,
  audioPerformerOccurrence: oc
};
function as({ entityType: e }) {
  const t = Ml[e];
  return /* @__PURE__ */ r(t, { role: "img", "aria-label": ns[e] });
}
const Fl = 2e6;
function is(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), a = document.createElement("a");
  a.href = n, a.download = t, a.click(), URL.revokeObjectURL(n);
}
function xl(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function oi(e) {
  is([e], xl(e));
}
async function Pl(e) {
  if (e.size > Fl) throw new Error("Review files must be smaller than 2 MB.");
  const t = await e.text();
  try {
    return Rr(t);
  } catch (n) {
    throw new Error(
      n instanceof SyntaxError ? "It is not a JSON file." : "It does not hold valid Data Quality reviews."
    );
  }
}
function Cr(e) {
  const { page: t, ...n } = e.view.filter;
  return JSON.stringify(
    { ...e, view: { ...e.view, filter: n } },
    (a, i) => i && typeof i == "object" && !Array.isArray(i) ? Object.fromEntries(
      Object.keys(i).sort().map((o) => [o, i[o]])
    ) : i
  );
}
function os({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: a,
  nameRef: i,
  autoFocus: o = !1
}) {
  return /* @__PURE__ */ c(me, { children: [
    /* @__PURE__ */ c("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ r("span", { children: "Entity type" }),
      /* @__PURE__ */ r(
        "select",
        {
          className: "dq-select",
          "aria-label": "Entity type",
          value: Ke(e),
          disabled: n,
          onChange: (s) => a == null ? void 0 : a(s.target.value),
          children: ko.map((s) => /* @__PURE__ */ r("option", { value: s, children: rs[s] }, s))
        }
      )
    ] }),
    /* @__PURE__ */ c("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ r("span", { children: "Review name" }),
      /* @__PURE__ */ r(
        "input",
        {
          ref: i,
          className: "dq-input",
          "aria-label": "Review name",
          autoFocus: o,
          value: e.name,
          onChange: (s) => t({ ...e, name: s.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ c("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ r("span", { children: "Description" }),
      /* @__PURE__ */ r(
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
function Ll(e, t) {
  const n = Ke(e), a = ["Review"];
  return (n === "video" || n === "tag") && a.push("Appearance"), a.push("Actions"), t && a.push("Tag choices"), a;
}
function ss({
  draft: e,
  onChange: t,
  direction: n,
  onDirectionChange: a,
  tagGroups: i,
  trees: o,
  saving: s,
  saveDisabled: l = !1,
  error: d,
  dirty: h,
  notices: p,
  onSave: g,
  onCancel: m,
  drawerRef: y
}) {
  const [b, N] = S("Review"), [R] = S(
    () => ve(e) && e.occurrence.tagIds.length > 0
  ), [C, _] = S(""), [T, I] = S(null), [D, J] = S(0), Q = $(null), P = Ll(e, R), ne = Ke(e), pe = Te(() => Cr(e), [e]);
  V(() => _(""), [pe]);
  function re() {
    const O = { ...e, name: e.name.trim() }, L = Er(O);
    if (!L) {
      _(""), g();
      return;
    }
    if (_(L), !O.name) {
      N("Review"), requestAnimationFrame(() => {
        var ae;
        return (ae = Q.current) == null ? void 0 : ae.focus();
      });
      return;
    }
    const ee = e.actions.find(
      (ae) => !En(ae, ne)
    );
    ee && (N("Actions"), I(ee.id), J((ae) => ae + 1));
  }
  const A = C || d;
  return /* @__PURE__ */ c(
    "aside",
    {
      ref: y,
      className: "dq-drawer",
      role: "dialog",
      "aria-label": "Edit review",
      tabIndex: -1,
      onKeyDown: (O) => {
        O.key !== "Escape" || O.defaultPrevented || h || s || (O.preventDefault(), O.stopPropagation(), m());
      },
      children: [
        /* @__PURE__ */ c("header", { className: "dq-drawer-header", children: [
          /* @__PURE__ */ c("div", { className: "dq-drawer-title", children: [
            /* @__PURE__ */ r("span", { className: "dq-eyebrow", children: "Edit review" }),
            /* @__PURE__ */ r("h2", { children: e.name.trim() || "Untitled review" })
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button",
              "aria-label": "Close editor",
              title: "Close without saving",
              disabled: s,
              onClick: m,
              children: /* @__PURE__ */ r(kr, { "aria-hidden": "true" })
            }
          )
        ] }),
        /* @__PURE__ */ r("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ r(
          zs,
          {
            tabs: P.map((O) => ({
              key: O,
              label: O,
              count: O === "Actions" ? e.actions.length : void 0
            })),
            activeTab: b,
            onTabChange: (O) => N(O)
          }
        ) }),
        /* @__PURE__ */ r("div", { className: "dq-drawer-body", children: /* @__PURE__ */ c("fieldset", { className: "dq-drawer-fields", disabled: s, children: [
          /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review settings" }),
          /* @__PURE__ */ c("div", { className: "dq-drawer-panel", role: "tabpanel", hidden: b !== "Review", "aria-label": "Review", children: [
            /* @__PURE__ */ r(
              os,
              {
                review: e,
                onChange: t,
                entityTypeLocked: !0,
                nameRef: Q,
                autoFocus: !0
              }
            ),
            /* @__PURE__ */ c("label", { className: "dq-drawer-field", children: [
              /* @__PURE__ */ r("span", { children: "Review direction" }),
              /* @__PURE__ */ c(
                "select",
                {
                  className: "dq-select",
                  "aria-label": "Review direction",
                  value: n,
                  onChange: (O) => a(O.target.value),
                  children: [
                    /* @__PURE__ */ r("option", { value: "end", children: "Start from the end" }),
                    /* @__PURE__ */ r("option", { value: "beginning", children: "Start from the beginning" })
                  ]
                }
              ),
              /* @__PURE__ */ r("small", { className: "dq-drawer-note", children: "From the end, the queue opens on its last page and works towards the first." })
            ] }),
            ve(e) && /* @__PURE__ */ r(Ol, { review: e, onChange: t }),
            /* @__PURE__ */ r("div", { children: /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-text-button",
                onClick: () => oi(e),
                children: "Export draft"
              }
            ) })
          ] }),
          P.includes("Appearance") && /* @__PURE__ */ r(
            "div",
            {
              className: "dq-drawer-panel",
              role: "tabpanel",
              hidden: b !== "Appearance",
              "aria-label": "Appearance",
              children: /* @__PURE__ */ r(Dl, { review: e, onChange: t })
            }
          ),
          /* @__PURE__ */ r(
            "div",
            {
              className: "dq-drawer-panel dq-actions-panel",
              role: "tabpanel",
              hidden: b !== "Actions",
              "aria-label": "Actions",
              children: /* @__PURE__ */ r(
                Al,
                {
                  review: e,
                  onChange: t,
                  tagGroups: i,
                  trees: o,
                  saving: s,
                  expandedId: T,
                  onExpand: I,
                  reveal: D
                }
              )
            }
          ),
          R && ve(e) && /* @__PURE__ */ r(
            "div",
            {
              className: "dq-drawer-panel",
              role: "tabpanel",
              hidden: b !== "Tag choices",
              "aria-label": "Tag choices",
              children: /* @__PURE__ */ r($l, { review: e, onChange: t })
            }
          )
        ] }) }),
        (A || p) && /* @__PURE__ */ c("div", { className: "dq-drawer-notices", children: [
          p,
          A && /* @__PURE__ */ c("p", { role: "alert", className: "dq-alert", children: [
            /* @__PURE__ */ r(Vn, { "aria-hidden": "true" }),
            A
          ] })
        ] }),
        /* @__PURE__ */ c("footer", { className: "dq-drawer-footer", children: [
          /* @__PURE__ */ r("p", { className: "dq-drawer-dirty", children: h ? "Unsaved changes" : "" }),
          /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: s, onClick: m, children: "Cancel" }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-button primary",
              "aria-busy": s || void 0,
              "aria-disabled": s || void 0,
              disabled: !s && l,
              onClick: () => {
                s || re();
              },
              children: "Save review"
            }
          )
        ] })
      ]
    }
  );
}
function Dl({
  review: e,
  onChange: t
}) {
  const n = xt(), a = e.view, i = (p) => t({ ...e, view: { ...a, ...p } }), o = /* @__PURE__ */ c("label", { className: "dq-checkbox dq-setting-indent", children: [
    /* @__PURE__ */ r(
      "input",
      {
        type: "checkbox",
        checked: a.selectAllOnLoad ?? !1,
        onChange: (p) => i({ selectAllOnLoad: p.target.checked ? !0 : void 0 })
      }
    ),
    "Select every card when a page opens"
  ] });
  if (Ke(e) === "tag")
    return /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-cards`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-cards`, children: "Cards" }),
      /* @__PURE__ */ r(
        Ki,
        {
          label: "View",
          value: a.displayMode === "list" ? "list" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "list", label: "List" }
          ],
          onChange: (p) => i({ displayMode: p })
        }
      ),
      o,
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "The review opens with these. The Cards / List switch in the header changes only the current visit." })
    ] });
  const s = e.presentation ?? {}, l = (p) => t({ ...e, presentation: { ...s, ...p } }), d = s.annotations ?? [], h = a.reviewMode ?? "single";
  return /* @__PURE__ */ c(me, { children: [
    /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ c("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ r(
          Bi,
          {
            name: `${n}-layout-choice`,
            checked: h === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ r(_l, {}),
            onChoose: () => i({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ r(
          Bi,
          {
            name: `${n}-layout-choice`,
            checked: h === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ r(jl, {}),
            onChoose: () => i({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ r(
        Ki,
        {
          label: "Cards",
          value: a.displayMode === "wall" ? "wall" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "wall", label: "Wall" }
          ],
          onChange: (p) => i({ displayMode: p })
        }
      ),
      o,
      /* @__PURE__ */ c("div", { className: "dq-setting-row", role: "group", "aria-labelledby": `${n}-details`, children: [
        /* @__PURE__ */ r("span", { className: "dq-setting-name", id: `${n}-details`, children: "Card details" }),
        /* @__PURE__ */ r("div", { className: "dq-setting-options", children: [
          ["date", "Date"],
          ["studio", "Studio"],
          ["performers", "Performers"],
          ["tags", "Tags"]
        ].map(([p, g]) => /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: d.includes(p),
              onChange: (m) => l({
                annotations: m.target.checked ? [...d, p] : d.filter((y) => y !== p)
              })
            }
          ),
          g
        ] }, p)) })
      ] }),
      d.includes("tags") && /* @__PURE__ */ c("div", { className: "dq-setting-row dq-setting-row-top", children: [
        /* @__PURE__ */ r("span", { className: "dq-setting-name", children: "Tags on cards" }),
        /* @__PURE__ */ c("div", { className: "dq-setting-value", children: [
          /* @__PURE__ */ r(
            Sn,
            {
              entityType: "tag",
              values: s.annotationParents ?? [],
              onChange: (p) => l({ annotationParents: p }),
              placeholder: "Add a parent tag…",
              inputAriaLabel: "Add a parent tag for card tags",
              containerClassName: "dq-chip-input",
              inputClassName: "dq-chip-input-field",
              allowCreate: !1
            }
          ),
          /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Cards show only the tags under these parents, whatever the queue filters." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-bins`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-bins`, children: "Queue tag bins" }),
      /* @__PURE__ */ r(
        Sn,
        {
          entityType: "tag",
          values: s.binParents ?? [],
          onChange: (p) => l({ binParents: p }),
          placeholder: "Add a parent tag…",
          inputAriaLabel: "Add a parent tag for queue bins",
          containerClassName: "dq-chip-input",
          inputClassName: "dq-chip-input-field",
          allowCreate: !1
        }
      ),
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "In the grid, tags under these parents become one-click filters in the filter row, counted on the loaded page." })
    ] })
  ] });
}
function Ki({
  label: e,
  value: t,
  options: n,
  onChange: a
}) {
  const i = xt();
  return /* @__PURE__ */ c("div", { className: "dq-setting-row", children: [
    /* @__PURE__ */ r("span", { className: "dq-setting-name", id: i, children: e }),
    /* @__PURE__ */ r("div", { className: "dq-segmented", role: "group", "aria-labelledby": i, children: n.map((o) => /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        "aria-pressed": t === o.value,
        onClick: () => t !== o.value && a(o.value),
        children: o.label
      },
      o.value
    )) })
  ] });
}
function Bi({
  name: e,
  checked: t,
  title: n,
  text: a,
  picture: i,
  onChoose: o
}) {
  const s = xt(), l = xt();
  return /* @__PURE__ */ c("label", { className: "dq-layout-card", children: [
    i,
    /* @__PURE__ */ c("span", { className: "dq-layout-card-name", children: [
      /* @__PURE__ */ r(
        "input",
        {
          type: "radio",
          name: e,
          checked: t,
          "aria-labelledby": s,
          "aria-describedby": l,
          onChange: o
        }
      ),
      /* @__PURE__ */ r("span", { id: s, children: n })
    ] }),
    /* @__PURE__ */ r("span", { className: "dq-layout-card-text", id: l, children: a })
  ] });
}
function _l() {
  return /* @__PURE__ */ c("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ r("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function jl() {
  const e = /* @__PURE__ */ new Set(["80,8", "152,8", "8,44", "224,44"]);
  return /* @__PURE__ */ c("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ r("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 44].flatMap(
      (t) => [8, 80, 152, 224].map((n) => /* @__PURE__ */ r(
        "rect",
        {
          className: e.has(`${n},${t}`) ? "dq-picture-selected" : "dq-picture-strong",
          x: n,
          y: t,
          width: "66",
          height: "30",
          rx: "3"
        },
        `${n},${t}`
      ))
    ),
    /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: "8", y: "80", width: "282", height: "10", rx: "3" })
  ] });
}
function cs({
  name: e,
  description: t,
  entityType: n,
  onBack: a,
  backDisabled: i,
  onEdit: o,
  editDisabled: s,
  editing: l = !1,
  toolbar: d,
  trailing: h,
  chipsStart: p,
  chipsAfter: g,
  chipsEnd: m
}) {
  return /* @__PURE__ */ c("header", { className: "dq-review-header", children: [
    /* @__PURE__ */ c("div", { className: "dq-review-header-lead", children: [
      a && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: i,
          onClick: a,
          children: /* @__PURE__ */ r(Tr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-type", title: ns[n], children: /* @__PURE__ */ r(as, { entityType: n }) }),
      /* @__PURE__ */ r("h1", { title: t || e, children: e }),
      t && /* @__PURE__ */ r("p", { className: "dq-sr-only", children: t }),
      o && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-icon-button dq-icon-button-small",
          "aria-label": "Edit review",
          title: "Edit review",
          "aria-haspopup": "dialog",
          "aria-expanded": l,
          disabled: s,
          onClick: o,
          children: /* @__PURE__ */ r(rr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    d,
    /* @__PURE__ */ r("div", { className: "dq-review-header-trail", children: h }),
    /* @__PURE__ */ r("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    p,
    g && /* @__PURE__ */ r("div", { className: "dq-review-chips-after", children: g }),
    m && /* @__PURE__ */ r("div", { className: "dq-review-chips-end", children: m })
  ] });
}
function ls({
  page: e,
  pages: t,
  onPage: n
}) {
  const [a, i] = S(!1), [o, s] = S(""), l = $(null), d = $(null);
  V(() => {
    var g;
    a && ((g = l.current) == null || g.select());
  }, [a]);
  const h = (g) => {
    i(!1), g && requestAnimationFrame(() => {
      var m;
      return (m = d.current) == null ? void 0 : m.focus();
    });
  }, p = () => {
    const g = Math.round(Number(o));
    h(!0), Number.isFinite(g) && g >= 1 && g !== e && n(Math.min(t, g));
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
        children: /* @__PURE__ */ r(Tr, { "aria-hidden": "true" })
      }
    ),
    a ? /* @__PURE__ */ r(
      "input",
      {
        ref: l,
        type: "number",
        className: "dq-pager-input",
        "aria-label": `Go to page, 1 to ${t}`,
        min: 1,
        max: t,
        value: o,
        onChange: (g) => s(g.target.value),
        onKeyDown: (g) => {
          g.key === "Enter" ? (g.preventDefault(), p()) : g.key === "Escape" && (g.preventDefault(), g.stopPropagation(), h(!0));
        },
        onBlur: () => h(!1)
      }
    ) : /* @__PURE__ */ c(
      "button",
      {
        ref: d,
        type: "button",
        className: "dq-pager-page",
        "aria-label": `Page ${e} of ${t}. Go to page`,
        title: "Go to page",
        disabled: t <= 1,
        onClick: () => {
          s(String(e)), i(!0);
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
        children: /* @__PURE__ */ r(qo, { "aria-hidden": "true" })
      }
    )
  ] });
}
function ds({
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
          /* @__PURE__ */ r(sc, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ r(Ba, { "aria-hidden": "true" }),
          "Grid"
        ]
      }
    )
  ] });
}
function Ul({
  options: e,
  value: t,
  disabled: n,
  onChange: a
}) {
  return /* @__PURE__ */ r("div", { className: "dq-segmented dq-segmented-icons", role: "group", "aria-label": "Card view", children: e.map((i) => /* @__PURE__ */ r(
    "button",
    {
      type: "button",
      "aria-label": i.label,
      title: i.label,
      "aria-pressed": t === i.value,
      disabled: n,
      onClick: () => t !== i.value && a(i.value),
      children: i.icon
    },
    i.value
  )) });
}
function si({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [a, i] = S(!1), [o, s] = S(!1), l = $(null), d = $(null), h = xt();
  pn(() => {
    if (!a || !d.current || !l.current) return;
    const m = l.current.getBoundingClientRect(), y = d.current.offsetHeight + 12, b = window.innerHeight - m.bottom;
    s(b < y && m.top > b);
  }, [a]), V(() => {
    var m, y;
    a && ((y = (m = d.current) == null ? void 0 : m.querySelector('[role="menuitem"]:not(:disabled)')) == null || y.focus({ preventScroll: !0 }));
  }, [a]), V(() => {
    t && i(!1);
  }, [t]);
  const p = (m = !0) => {
    var y;
    i(!1), m && ((y = l.current) == null || y.focus());
  };
  return /* @__PURE__ */ c("div", { className: `dq-menu${a ? " dq-menu-open" : ""}`, onKeyDown: (m) => {
    var N, R;
    if (!a) return;
    const y = [
      ...((N = d.current) == null ? void 0 : N.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], b = y.indexOf(document.activeElement);
    if (m.key === "Escape")
      m.preventDefault(), m.stopPropagation(), p();
    else if (m.key === "Tab")
      p(!1);
    else if (m.key === "ArrowDown" || m.key === "ArrowUp") {
      if (m.preventDefault(), !y.length) return;
      const C = m.key === "ArrowDown" ? 1 : -1;
      y[(b + C + y.length) % y.length].focus();
    } else (m.key === "Home" || m.key === "End") && (m.preventDefault(), (R = y.at(m.key === "Home" ? 0 : -1)) == null || R.focus());
  }, children: [
    /* @__PURE__ */ r(
      "button",
      {
        ref: l,
        type: "button",
        className: "dq-icon-button",
        "aria-label": n,
        title: n,
        "aria-haspopup": "menu",
        "aria-expanded": a,
        "aria-controls": a ? h : void 0,
        disabled: t,
        onClick: () => i((m) => !m),
        children: /* @__PURE__ */ r(cc, { "aria-hidden": "true" })
      }
    ),
    a && /* @__PURE__ */ c(me, { children: [
      /* @__PURE__ */ r("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => p(!1) }),
      /* @__PURE__ */ r(
        "div",
        {
          ref: d,
          id: h,
          role: "menu",
          "aria-label": n,
          className: `dq-menu-list${o ? " dq-menu-list-up" : ""}`,
          children: e.map((m) => /* @__PURE__ */ c(ja, { children: [
            m.separated && /* @__PURE__ */ r("div", { role: "separator", className: "dq-menu-separator" }),
            /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                role: "menuitem",
                className: m.danger ? "dq-menu-danger" : void 0,
                disabled: m.disabled,
                onClick: () => {
                  p(), m.onSelect();
                },
                children: [
                  m.icon,
                  m.label
                ]
              }
            )
          ] }, m.label))
        }
      )
    ] })
  ] });
}
function Zr(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function ci(e) {
  return String(e.type).toLowerCase() === "tag";
}
function li(e) {
  return !!String(e ?? "").trim();
}
function di(e) {
  return [
    ...new Set(
      Zr(e.customFieldCriteria).filter(ci).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !li(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function ui(e, t) {
  const n = Zr(e.customFieldCriteria);
  if (!n.length) return e;
  let a = !1;
  const i = n.map((o) => {
    if (!ci(o)) return o;
    const s = { ...o };
    for (const [l, d] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const h = t[String(o[l] ?? "")];
      h && !li(o[d]) && (s[d] = h, a = !0);
    }
    return s;
  });
  return a ? { ...e, customFieldCriteria: i } : e;
}
function us(e, t, n) {
  const a = Zr(e.customFieldCriteria);
  if (!a.length) return e;
  const i = Zr(n.customFieldCriteria), o = (d, h) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (p) => (d[p] ?? void 0) === (h[p] ?? void 0)
  );
  let s = !1;
  const l = a.map((d) => {
    if (!ci(d)) return d;
    const h = i.find((g) => o(g, d));
    if (!h) return d;
    const p = { ...d };
    for (const [g, m] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const y = t[String(d[g] ?? "")];
      y && d[m] === y && !li(h[m]) && (delete p[m], s = !0);
    }
    return p;
  });
  return s ? { ...e, customFieldCriteria: l } : e;
}
async function Gl(e, t, n) {
  if (!En(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const a = Re(e), i = n.steps.some((l) => qn(l.mode)) ? await Hc(a) : "", o = await Za(n);
  let s = t.applications;
  for (const l of [
    ...o.filter((d) => !qn(d.mode)),
    ...o.filter((d) => qn(d.mode))
  ]) {
    const d = (h) => Yc(
      i,
      a,
      t.media.id,
      t.performer.id,
      l.tagIds,
      h
    );
    (l.mode === "MARK_PRESENT" || l.mode === "CLEAR_ABSENCE") && await d("REMOVE"), l.mode !== "CLEAR_ABSENCE" && (s = await ms(
      {
        ...e,
        occurrence: {
          ...e.occurrence,
          tagIds: l.tagIds,
          multiple: !0
        }
      },
      t,
      ["ADD", "MARK_PRESENT"].includes(l.mode) ? l.tagIds : []
    )), l.mode === "MARK_ABSENT" && await d("ADD");
  }
  return s;
}
async function fi(e, t) {
  const n = e.occurrence;
  if (Wa(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const a = /* @__PURE__ */ new Set(), { _filterExpression: i, ...o } = n.performerFilter;
  for (let s = 1; ; s++) {
    const l = await ie("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Cn({
          findFilter: { page: s, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: o,
          filterExpression: i
        })
      )
    });
    if (l.items.forEach((d) => a.add(d.id)), s * 1e3 >= l.totalCount) return [...a];
    if (!l.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function fs(e) {
  return Sr(e.condition) && e.hideConfirmedAbsent !== !1;
}
function hi(e, t) {
  const { _filterExpression: n, ...a } = e.view.objectFilter, i = e.occurrence, o = {
    mode: "atLeastOne",
    conditionOperator: "and",
    ...t === null ? {} : {
      performerIdsCriterion: { modifier: "includes", value: t }
    },
    ...i.condition === "any" ? {} : {
      performerOccurrenceTagsCriterion: {
        modifier: i.condition,
        value: i.conditionTagIds,
        depth: i.includeSubtags === !1 ? 0 : -1
      }
    }
  }, s = fs(i) && (t == null ? void 0 : t.length) === 1 && i.conditionTagIds.length === 1 ? `${t[0]}:${i.conditionTagIds[0]}` : null;
  return {
    ...e,
    entityType: Re(e),
    actions: [],
    view: {
      ...e.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...n ? [{ group: n }] : [],
            { filter: a },
            { filter: { performerFilterCriterion: o } },
            ...s ? [
              {
                filter: {
                  customFieldCriteria: [
                    {
                      key: aa,
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
async function pi(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => ia([n], t))
  );
}
function hs(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function Kl(e, t, n = e.conditionTagIds.map((a) => [a])) {
  const a = new Set(t), i = (o) => o.some((s) => a.has(s));
  switch (e.condition) {
    case "any":
      return !0;
    case "isNull":
      return a.size === 0;
    case "includes":
      return n.some(i);
    case "includesAll":
      return n.every(i);
    case "excludes":
      return !n.some(i);
    case "excludesAll":
      return !n.every(i);
  }
}
function Bl(e, t, n, a, i) {
  if (!fs(e)) return !1;
  const o = jo(t, n);
  return e.conditionTagIds.every(
    (s, l) => o.includes(s) || i[l].some((d) => a.includes(d))
  );
}
async function ps(e, t, n, a) {
  if ((t == null ? void 0 : t.length) === 0 || hs(e.occurrence))
    return { items: [], totalCount: 0 };
  const i = Re(e), o = await vr(
    hi(e, t),
    { ...e.view.filter, page: n },
    a
  ), s = t === null ? null : new Set(t), l = e.occurrence, d = o.items.length ? await pi(l, a) : [], h = new Array(o.items.length);
  let p = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, o.items.length) }, async () => {
      for (; p < o.items.length; ) {
        const g = p++, m = o.items[g], y = await ie(
          `/api/tagapplications?hostType=${i}&hostId=${m.id}&contextType=performer`,
          { signal: a }
        );
        h[g] = m.performers.filter((b) => s === null || s.has(b.id)).flatMap((b) => {
          const N = y.filter(
            (C) => C.hostType === i && C.hostId === m.id && C.contextType === "performer" && C.contextId === b.id
          ), R = N.map((C) => C.tag.id);
          return Kl(e.occurrence, R, d) && !Bl(l, m, b.id, R, d) ? [
            {
              key: `${m.id}:${b.id}`,
              media: m,
              performer: b,
              applications: N
            }
          ] : [];
        });
      }
    })
  ), { items: h.flat(), totalCount: o.totalCount };
}
async function ms(e, t, n) {
  const a = new Set(e.occurrence.tagIds);
  if (n.some((h) => !a.has(h)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const i = Re(e), o = await Ra(i, t.media.id);
  if (!o.performers.some(
    (h) => h.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${i}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${i}&hostId=${o.id}&contextType=performer&contextId=${t.performer.id}`, l = (await ie(s)).filter(
    (h) => h.hostType === i && h.hostId === o.id && h.contextType === "performer" && h.contextId === t.performer.id
  ), d = new Set(n);
  try {
    for (const h of d)
      l.some((p) => p.tag.id === h) || await ie("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: i,
          hostId: o.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: h,
          sourceKey: "user"
        })
      });
    for (const h of l)
      a.has(h.tag.id) && !d.has(h.tag.id) && await ie(`/api/tagapplications/${h.id}`, {
        method: "DELETE"
      });
    return await ie(s);
  } catch (h) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${h instanceof Error ? h.message : "Request failed."}`
    );
  }
}
function ir(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function Vl(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function an(e, t, n = !0) {
  var l;
  if (t.occurrence) {
    const d = n ? jo(
      await Ra(e, t.media.id),
      t.occurrence.performer.id
    ) : [], h = (await ie(Vl(e, t))).filter(
      (p) => p.hostType === e && p.hostId === t.media.id && p.contextType === "performer" && p.contextId === t.occurrence.performer.id
    );
    return Oa(h.map((p) => p.tag)), {
      ids: [...new Set(h.map((p) => p.tag.id))],
      names: [...new Set(h.map((p) => p.tag.name))],
      absent: d,
      applications: h
    };
  }
  const a = await Ra(e, t.media.id), i = (a.tags ?? []).filter(
    (d) => d.canRemove !== !1 || d.isDerived !== !0
  );
  Oa(i);
  const o = Object.keys(a.customFields ?? {}).find(
    (d) => d.toLowerCase() === Yr
  ) ?? Yr, s = ((l = a.customFields) == null ? void 0 : l[o]) ?? [];
  if (!Array.isArray(s) || s.some((d) => !Number.isSafeInteger(d)))
    throw new Error(
      `Confirmed absent tags are invalid. Inspect the ${e} before editing.`
    );
  return {
    ids: i.map((d) => d.id),
    names: i.map((d) => d.name),
    absent: s,
    tags: i
  };
}
async function mi(e, t, n) {
  if (t.occurrence && ve(e))
    await ms(
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
    for (const [a, i] of [
      ["ADD", n.added],
      ["REMOVE", n.removed]
    ])
      i.length && await ie(
        `/api/${Ln(Re(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: a, tagIds: i })
        }
      );
}
async function Jl(e, t, n) {
  t.occurrence && ve(e) ? await Gl(e, t.occurrence, n) : await Uo(Re(e), n, [t.media.id]);
}
function Ma(e, t, n, a) {
  const i = (o) => o.filter((s) => a.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: ir(i(t.ids), i(n.ids)),
    absence: ir(i(t.absent), i(n.absent))
  };
}
function zl(e, t) {
  var n;
  for (const [a, i] of [
    [e.tags, t.ids],
    [e.absence, t.absent]
  ])
    if (a.added.some((o) => !i.includes(o)) || a.removed.some((o) => i.includes(o)))
      throw new Error(
        "Undo conflict: affected tags changed since this operation. Inspect the item; no undo changes were made."
      );
  if (t.applications)
    for (const a of e.tags.added) {
      const i = (n = e.after.applications) == null ? void 0 : n.filter((s) => s.tag.id === a).map((s) => s.id).sort(), o = t.applications.filter((s) => s.tag.id === a).map((s) => s.id).sort();
      if (JSON.stringify(i) !== JSON.stringify(o))
        throw new Error(
          "Undo conflict: an affected occurrence application changed. No undo changes were made."
        );
    }
}
const Fa = (e) => e instanceof Error ? e.message : "Request failed.", Vi = (e) => [...e].sort((t, n) => t - n), Ar = (e, t) => JSON.stringify(Vi(e)) === JSON.stringify(Vi(t)), xa = (e) => !!(e.tags.added.length || e.tags.removed.length);
function ea(e, t, n, a) {
  const i = new Set(e), o = new Set(e);
  for (const p of t.steps)
    for (const g of p.tagIds)
      p.mode === "ADD" ? o.add(g) : o.delete(g);
  const s = e.some((p) => !o.has(p));
  if (s && !a)
    return { desired: [...e], conflict: s, skipped: !0, kept: [], replaced: [] };
  const l = new Set(
    t.steps.filter((p) => p.mode === "ADD").flatMap((p) => p.tagIds)
  ), d = [], h = [];
  for (const p of n) {
    const g = p.filter((y) => o.has(y) && !i.has(y)), m = p.filter(
      (y) => o.has(y) && i.has(y) && !l.has(y)
    );
    !g.length || !m.length || (a ? (m.forEach((y) => o.delete(y)), h.push(...m)) : (g.forEach((y) => o.delete(y)), d.push({ tagIds: g, existing: m })));
  }
  return { desired: [...o], conflict: s, skipped: !1, kept: d, replaced: h };
}
function Wl(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function Ql(e, t, n, a) {
  for (const [i, o] of n.entries()) {
    const s = t.filter(
      (h) => h.steps.some(
        (p) => p.mode === "ADD" && p.tagIds.some((g) => o.includes(g))
      )
    );
    if (s.length < 2) continue;
    const l = e.occurrence.conditionTagIds[i];
    let d = `tag ${l}`;
    try {
      d = (await ie(`/api/tags/${l}`, { signal: a })).name;
    } catch {
      a.throwIfAborted();
    }
    throw new Error(
      `${s.map((h) => h.label).join(" and ")} answer the same condition tag, ${d}. Choose one of them.`
    );
  }
}
async function Hl(e, t, n, a = () => {
}) {
  if (!t.length || t.some(
    (m) => !En(m, e.entityType) || !m.steps.length || m.steps.some(
      (y) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(y.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), o = structuredClone(t), s = Sr(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await pi(i.occurrence, n) : [];
  await Ql(i, o, s, n);
  const l = await Promise.all(
    o.map(async (m) => ({
      ...m,
      steps: await Za(m, n)
    }))
  ), d = structuredClone(Wl(l));
  n.throwIfAborted();
  const h = [
    .../* @__PURE__ */ new Set([
      ...d.steps.flatMap((m) => m.tagIds),
      ...s.flat()
    ])
  ];
  i.view.filter = {
    ...i.view.filter,
    page: 1,
    perPage: 250,
    sort: "id",
    direction: "asc",
    sorts: void 0
  };
  const p = await fi(i, n), g = /* @__PURE__ */ new Map();
  for (let m = 1; ; m++) {
    n.throwIfAborted();
    const y = await ps(i, p, m, n);
    for (const b of y.items) {
      const N = {
        ids: [...new Set(b.applications.map((C) => C.tag.id))],
        names: b.applications.map((C) => C.tag.name),
        absent: [],
        applications: b.applications
      }, R = ea(N.ids, d, s, !0);
      g.set(b.key, {
        item: { key: b.key, media: b.media, occurrence: b },
        before: N,
        expected: N,
        conflict: R.conflict,
        status: Ar(N.ids, R.desired) ? "unchanged" : "pending"
      });
    }
    if (a(g.size), m * 250 >= y.totalCount) break;
    if (m > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return n.throwIfAborted(), {
    review: i,
    actions: o,
    action: d,
    categories: s,
    touched: h,
    entries: [...g.values()]
  };
}
function Yl(e, t, n) {
  const a = (o) => o.ids.filter((s) => n.includes(s));
  if (!Ar(a(e), a(t))) return !1;
  const i = (o) => (o.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return Ar(i(e), i(t));
}
async function gs(e, t, n, a) {
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; !t() && i < e.length; ) {
        const o = e[i++];
        await n(o), a();
      }
    })
  );
}
function bs(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function ws(e) {
  return e.entries.filter((t) => t.operation);
}
async function Xl(e, t, n, a, i = !1) {
  await gs(
    bs(e, i),
    n,
    async (o) => {
      if (o.conflict && !t) {
        o.status = "skipped", o.error = "Conflicting answer skipped.";
        return;
      }
      if (o.unverified) {
        o.error = "The previous write could not be verified. Inspect this occurrence and create a fresh preview before further changes.";
        return;
      }
      let s;
      try {
        if (s = await an(Re(e.review), o.item, !1), !Yl(o.expected, s, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (m) {
        o.status = "failed", o.error = Fa(m);
        return;
      }
      const l = ea(
        o.before.ids,
        e.action,
        e.categories,
        t
      ), d = [
        ...s.ids.filter((m) => !e.touched.includes(m)),
        ...l.desired.filter((m) => e.touched.includes(m))
      ], h = ir(s.ids, d);
      if (!h.added.length && !h.removed.length) {
        const m = !o.operation && l.kept.length > 0;
        o.status = o.operation ? "changed" : m ? "skipped" : "unchanged", o.error = m ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let p;
      try {
        await mi(e.review, o.item, h);
      } catch (m) {
        p = m;
      }
      let g = !1;
      try {
        const m = await an(Re(e.review), o.item, !1);
        g = !0, o.expected = m;
        const y = Ma(
          o.item,
          o.before,
          m,
          e.touched
        );
        if (o.operation = xa(y) ? y : void 0, p) throw p;
        if (!Ar(
          m.ids.filter((b) => e.touched.includes(b)),
          d.filter((b) => e.touched.includes(b))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (m) {
        if (o.status = "failed", o.error = Fa(m), !g)
          try {
            const y = await an(Re(e.review), o.item, !1);
            o.expected = y;
            const b = Ma(
              o.item,
              o.before,
              y,
              e.touched
            );
            o.operation = xa(b) ? b : void 0;
          } catch {
            o.unverified = !0;
          }
      }
    },
    a
  );
}
async function Zl(e, t, n) {
  await gs(
    ws(e),
    t,
    async (a) => {
      const i = a.operation;
      if (a.unverified) {
        a.error = "Undo unavailable: the previous write could not be verified. Inspect this occurrence.";
        return;
      }
      const o = [...i.tags.added, ...i.tags.removed];
      let s = !1;
      try {
        const l = await an(Re(e.review), a.item, !1);
        zl(i, l), s = !0, await mi(e.review, a.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const d = await an(Re(e.review), a.item, !1);
        if (!Ar(
          d.ids.filter((h) => o.includes(h)),
          a.before.ids.filter((h) => o.includes(h))
        ))
          throw new Error("Undo did not restore all affected tags.");
        a.operation = void 0, a.expected = d, a.status = "unchanged", a.error = void 0;
      } catch (l) {
        if (a.error = `Undo stopped: ${Fa(l)}`, a.status = "failed", s)
          try {
            const d = await an(Re(e.review), a.item, !1), h = Ma(
              a.item,
              a.before,
              d,
              o
            );
            a.operation = xa(h) ? h : void 0, a.expected = d;
          } catch {
            a.unverified = !0;
          }
      }
    },
    n
  );
}
async function ed(e, t, n) {
  const a = Re(e), i = e.occurrence, [o, s] = await Promise.all([
    ie(
      `/api/tagapplications?hostType=${a}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    pi(i, n)
  ]), l = o.filter(
    (b) => b.hostType === a && b.contextType === "performer" && b.contextId === t
  );
  Oa(l.map((b) => b.tag));
  const d = await Promise.all(
    s.map(async (b, N) => {
      const R = i.conditionTagIds[N];
      return (await ie(`/api/tags/${R}`, { signal: n })).name;
    })
  ), h = new Set(s.flat()), p = new Set(
    [
      ...e.actions.flatMap((b) => b.steps).filter((b) => b.mode === "ADD" || b.mode === "MARK_PRESENT").flatMap((b) => b.tagIds),
      ...i.tagIds
    ].filter((b) => !h.has(b))
  ), g = (b) => {
    const N = /* @__PURE__ */ new Map();
    for (const R of l) {
      if (!b.has(R.tag.id)) continue;
      const C = N.get(R.tag.id) ?? {
        tag: R.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      C.hosts.add(R.hostId), N.set(R.tag.id, C);
    }
    return [...N.values()].map((R) => ({ ...R.tag, count: R.hosts.size })).sort((R, C) => C.count - R.count || Qo(R, C));
  }, m = s.map((b, N) => ({
    id: i.conditionTagIds[N],
    name: d[N],
    tags: g(new Set(b))
  }));
  p.size && m.push({
    id: null,
    name: s.length ? "Other review tags" : "Review tags",
    tags: g(p)
  });
  const y = /* @__PURE__ */ new Set([...h, ...p]);
  return {
    answered: new Set(
      l.filter((b) => y.has(b.tag.id)).map((b) => b.hostId)
    ).size,
    groups: m
  };
}
function Jt({ tag: e, name: t }) {
  return /* @__PURE__ */ r(Ws, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: e ?? void 0 });
}
const Ji = { summary: null, error: "" };
function ys(e, t, n = 0) {
  const [a, i] = S(Ji), o = e.occurrence, s = JSON.stringify([
    e.entityType,
    t,
    o.condition,
    o.conditionTagIds,
    o.includeSubtags,
    o.tagIds,
    e.actions.map((l) => l.steps)
  ]);
  return V(() => {
    if (i(Ji), t === null) return;
    const l = new AbortController();
    return ed(e, t, l.signal).then((d) => {
      l.signal.aborted || i({ summary: d, error: "" });
    }).catch((d) => {
      l.signal.aborted || i({
        summary: null,
        error: d instanceof Error ? d.message : "Request failed."
      });
    }), () => l.abort();
  }, [s, n]), a;
}
function td({
  review: e,
  performerId: t,
  revision: n = 0
}) {
  const a = ys(e, t, n);
  return /* @__PURE__ */ r(Pa, { ...a, mediaKind: Re(e) });
}
function Pa({
  summary: e,
  error: t,
  mediaKind: n,
  className: a = ""
}) {
  const i = mn(n), o = (s) => `${s.toLocaleString()} ${s === 1 ? i.one : i.many}`;
  return /* @__PURE__ */ c(
    "section",
    {
      className: `dq-panel-section dq-performer-answers ${a}`.trim(),
      "aria-label": "Existing answers",
      children: [
        /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Existing answers" }),
          e && /* @__PURE__ */ r("span", { children: e.answered ? `${o(e.answered)} answered` : "none answered yet" })
        ] }),
        t ? /* @__PURE__ */ c("p", { role: "alert", children: [
          "Could not load existing answers. ",
          t
        ] }) : e ? e.groups.filter((s) => s.id !== null || s.tags.length).map((s) => /* @__PURE__ */ c("div", { className: "dq-answer-group", children: [
          /* @__PURE__ */ c("div", { className: "dq-answer-category", children: [
            /* @__PURE__ */ r("span", { children: s.name }),
            s.id !== null && s.tags.length > 1 && /* @__PURE__ */ r(
              "span",
              {
                className: "dq-badge dq-badge-warning",
                title: "This performer has different answers in this category.",
                children: "Mixed"
              }
            )
          ] }),
          s.tags.length ? /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": s.name, children: s.tags.map((l) => /* @__PURE__ */ c("li", { className: "dq-tag", children: [
            /* @__PURE__ */ r(Jt, { tag: l }),
            /* @__PURE__ */ r("span", { className: "dq-chip-count", "aria-hidden": "true", children: l.count.toLocaleString() }),
            /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
              ", ",
              o(l.count)
            ] })
          ] }, l.id)) }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" })
        ] }, s.id ?? "other")) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading existing answers…" })
      ]
    }
  );
}
function tr({
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
const zi = 5;
function nd(e, t) {
  return Promise.all(
    e.map(async (n) => {
      try {
        return (await ie(`/api/performers/${n}`, { signal: t })).name;
      } catch {
        return t.throwIfAborted(), `Performer ${n}`;
      }
    })
  );
}
function rd(e, t) {
  const n = 1100 - (Date.now() - e);
  return n <= 0 ? Promise.resolve() : new Promise((a, i) => {
    const o = window.setTimeout(a, n);
    t.addEventListener(
      "abort",
      () => {
        window.clearTimeout(o), i(t.reason);
      },
      { once: !0 }
    );
  });
}
const Wi = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), La = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], Qi = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], ad = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, ya = 250;
function yr(e, t) {
  var a, i;
  const n = e.item.media;
  return n.title || ((i = (a = n.files) == null ? void 0 : a[0]) == null ? void 0 : i.basename) || (t === "audio" ? "Audio" : "Scene");
}
function id({ step: e }) {
  const t = La.findIndex((n) => n.id === e);
  return /* @__PURE__ */ r("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: La.map((n, a) => {
    const i = a < t ? "done" : a === t ? "current" : "next";
    return /* @__PURE__ */ c("li", { "data-state": i, "aria-current": i === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: i === "done" ? /* @__PURE__ */ r(Va, {}) : a + 1 }),
      n.label,
      i === "done" && /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function Hi({ parts: e, id: t }) {
  return /* @__PURE__ */ r("span", { className: "dq-batch-effect", id: t, children: e.map((n, a) => /* @__PURE__ */ c(ja, { children: [
    a > 0 && " ",
    /* @__PURE__ */ r("span", { "data-effect-tone": n.tone, children: n.text })
  ] }, a)) });
}
function wr({
  value: e,
  label: t,
  detail: n,
  tone: a,
  pressed: i,
  onToggle: o
}) {
  return /* @__PURE__ */ c(
    "button",
    {
      type: "button",
      className: "dq-batch-stat",
      "data-tone": e ? a : void 0,
      "aria-pressed": i && e > 0,
      disabled: !e,
      onClick: o,
      children: [
        /* @__PURE__ */ r("span", { className: "dq-batch-stat-value", children: e.toLocaleString() }),
        " ",
        /* @__PURE__ */ r("span", { className: "dq-batch-stat-label", children: t }),
        n && /* @__PURE__ */ c(me, { children: [
          " ",
          /* @__PURE__ */ r("span", { className: "dq-batch-stat-detail", children: n })
        ] })
      ]
    }
  );
}
function Yi({
  added: e,
  removed: t,
  tag: n,
  label: a
}) {
  return /* @__PURE__ */ c("ul", { className: "dq-tags", "aria-label": a, children: [
    zn(e.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ c("ins", { children: [
      "+ ",
      /* @__PURE__ */ r(Jt, { tag: i })
    ] }) }, `added-${i.id}`)),
    zn(t.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ c("del", { children: [
      "− ",
      /* @__PURE__ */ r(Jt, { tag: i })
    ] }) }, `removed-${i.id}`))
  ] });
}
function Xi({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: a,
  describe: i
}) {
  return /* @__PURE__ */ c("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: e }),
      t.length > ya && /* @__PURE__ */ c("span", { children: [
        "First ",
        ya.toLocaleString(),
        " of ",
        t.length.toLocaleString()
      ] })
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-batch-list-scroll", children: /* @__PURE__ */ c("table", { children: [
      /* @__PURE__ */ r("thead", { children: /* @__PURE__ */ c("tr", { children: [
        /* @__PURE__ */ r("th", { scope: "col", children: "Occurrence" }),
        /* @__PURE__ */ r("th", { scope: "col", children: "Date" }),
        /* @__PURE__ */ r("th", { scope: "col", children: a })
      ] }) }),
      /* @__PURE__ */ r("tbody", { children: t.slice(0, ya).map((o) => {
        var s;
        return /* @__PURE__ */ c("tr", { children: [
          /* @__PURE__ */ r("td", { children: /* @__PURE__ */ c(
            "a",
            {
              href: `/${n}/${o.item.media.id}`,
              target: "_blank",
              rel: "noreferrer",
              children: [
                (s = o.item.occurrence) == null ? void 0 : s.performer.name,
                " — ",
                yr(o, n)
              ]
            }
          ) }),
          /* @__PURE__ */ r("td", { className: "dq-batch-list-date", children: o.item.media.date ?? "" }),
          /* @__PURE__ */ r("td", { children: i(o) })
        ] }, o.item.key);
      }) })
    ] }) })
  ] });
}
function od(e) {
  const t = {
    pending: 0,
    changed: 0,
    unchanged: 0,
    skipped: 0,
    failed: 0
  }, n = /* @__PURE__ */ new Map();
  let a = 0, i = !1;
  for (const o of e)
    if (t[o.status] += 1, o.operation && (a += 1), o.status === "failed" && !o.unverified && (i = !0), (o.status === "skipped" || o.status === "failed") && o.error) {
      const s = `${o.status}\0${o.error}`, l = n.get(s) ?? { status: o.status, error: o.error, count: 0 };
      l.count += 1, n.set(s, l);
    }
  return { counts: t, reasons: [...n.values()], recorded: a, retryable: i };
}
function sd({
  review: e,
  disabled: t,
  performerFlags: n = [],
  trees: a,
  onOpen: i,
  onClose: o,
  onWrite: s
}) {
  const [l, d] = S(!1), [h, p] = S("answers"), [g, m] = S(null), [y, b] = S({}), [N, R] = S([]), [C, _] = S(!1), [T, I] = S(!1), [D, J] = S(""), [Q, P] = S(""), [ne, pe] = S(null), [re, A] = S(null), [O, L] = S([]), [ee, ae] = S(0), le = $(null), ue = $(null), ge = $(null), E = $(!1), j = $(!1), te = $(null), Ce = $(!1), Oe = $(0), ft = $(!1), vt = $({ onClose: o, onWrite: s });
  vt.current = { onClose: o, onWrite: s };
  const ct = xt(), An = Dn(), on = h === "run", Je = (ne == null ? void 0 : ne.kind) === "undo", Xe = on && g ? g.review : e, H = Xe.occurrence, Ne = Re(Xe), Ae = mn(Ne), It = Ae.queue, Nt = on && g ? g.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((q) => q.steps.length && !Pn(q))
  ), rt = Nt.filter((q) => N.includes(q.id)), ye = H.targetMode === "selected" && H.performerIds.length === 1, at = ys(
    Xe,
    l && ye ? H.performerIds[0] : null,
    ee
  ), lt = di(Xe.view.objectFilter), je = ri(
    l ? [...oa(Nt), ...H.conditionTagIds, ...lt] : []
  ), zt = Te(() => Wo(je), [je]), ke = (q) => y[q] ?? je[q] ?? { id: q, name: `Tag ${q}` }, Wt = JSON.stringify(
    Object.fromEntries(
      lt.flatMap((q) => {
        var U;
        const M = (U = je[q]) == null ? void 0 : U.name;
        return M ? [[String(q), M]] : [];
      })
    )
  ), sn = Te(
    () => ui(Xe.view.objectFilter, JSON.parse(Wt)),
    [Xe.view.objectFilter, Wt]
  );
  V(() => {
    var q, M, U;
    l && ((q = le.current) == null || q.showModal(), (U = (M = le.current) == null ? void 0 : M.querySelector(".dq-batch-answer input")) == null || U.focus());
  }, [l]), V(() => {
    if (!l) return;
    const q = requestAnimationFrame(() => {
      var oe;
      const M = le.current, U = document.activeElement;
      if (!M || U && U !== document.body && M.contains(U)) return;
      (oe = (h === "answers" ? M.querySelector(".dq-batch-answer input:checked") ?? M.querySelector(".dq-batch-answer input") : M.querySelector("[data-batch-focus]")) ?? ue.current) == null || oe.focus();
    });
    return () => cancelAnimationFrame(q);
  }, [l, h, T, g]), V(() => {
    if (l || t || !E.current) return;
    const q = requestAnimationFrame(() => {
      const M = ge.current;
      if (!E.current || !M || M.disabled) return;
      E.current = !1;
      const U = document.activeElement;
      (!U || U === document.body) && M.focus();
    });
    return () => cancelAnimationFrame(q);
  }, [l, t]), V(() => {
    if (!l || H.targetMode !== "selected") return;
    const q = new AbortController();
    return L([]), nd(H.performerIds.slice(0, zi), q.signal).then((M) => {
      q.signal.aborted || L(M);
    }).catch(() => {
    }), () => q.abort();
  }, [l, H.targetMode, JSON.stringify(H.performerIds)]), V(
    () => () => {
      var q;
      j.current = !0, (q = te.current) == null || q.abort();
    },
    []
  ), V(() => {
    if (!T) return;
    const q = (M) => {
      M.preventDefault(), M.returnValue = "";
    };
    return window.addEventListener("beforeunload", q), () => window.removeEventListener("beforeunload", q);
  }, [T]);
  function Y() {
    p("answers"), m(null), b({}), pe(null), _(!1), R([]), P(""), J(""), A(null);
  }
  function ht() {
    ft.current || (d(!1), vt.current.onClose(Ce.current), Ce.current = !1, Y(), E.current = !0);
  }
  function cn(q, M) {
    R(
      (U) => M ? [...U, q] : U.filter((ce) => ce !== q)
    ), m(null), b({}), P(""), J(""), A(null);
  }
  function Qt() {
    p("answers"), A(null), P("");
  }
  function _n() {
    p("preview"), g || x();
  }
  function Pe() {
    var q;
    j.current = !0, (q = te.current) == null || q.abort(), P("Stopping after in-flight operations settle…");
  }
  function He(q) {
    A(
      (M) => (M == null ? void 0 : M.group) === q.group && M.reason === q.reason ? null : q
    );
  }
  const X = (q, M) => (re == null ? void 0 : re.group) === q && re.reason === M;
  async function x() {
    if (!rt.length || ft.current) return;
    ft.current = !0, I(!0), J(""), P("Loading all matching occurrences…"), m(null), b({}), A(null);
    const q = new AbortController();
    te.current = q;
    try {
      await rd(Oe.current, q.signal);
      const M = await Hl(
        e,
        rt,
        q.signal,
        (ce) => P(`Loaded ${ce.toLocaleString()} matching occurrences…`)
      );
      q.signal.throwIfAborted();
      const U = {};
      for (const ce of M.entries)
        for (const oe of ce.before.applications ?? [])
          U[oe.tag.id] = oe.tag;
      b(U), m(M), P("Preview ready. No tags have been changed.");
    } catch (M) {
      J(
        q.signal.aborted ? "Preview cancelled. No tags were changed." : M instanceof Error ? M.message : String(M)
      ), P("");
    } finally {
      ft.current = !1, I(!1), te.current = null;
    }
  }
  async function we(q) {
    if (!g || ft.current) return;
    const M = (q === "undo" ? ws(g) : bs(g, q === "retry")).length;
    ft.current = !0, j.current = !1, Ce.current = !0, vt.current.onWrite(), I(!0), p("run"), J(""), pe({ kind: q, total: M, done: 0, stopped: !1 }), P(
      q === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const U = () => pe((oe) => oe && { ...oe, done: oe.done + 1 });
    let ce = !1;
    try {
      q === "undo" ? await Zl(g, () => j.current, U) : await Xl(g, C, () => j.current, U, q === "retry"), P(
        j.current ? "Stopped after in-flight operations settled. Completed changes are retained." : q === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (oe) {
      ce = !0, P(""), J(oe instanceof Error ? oe.message : String(oe));
    } finally {
      Oe.current = Date.now(), ft.current = !1;
      const oe = j.current || ce;
      pe((Me) => Me && { ...Me, stopped: oe }), I(!1), ae((Me) => Me + 1);
    }
  }
  const Le = (g == null ? void 0 : g.entries) ?? [], kn = Te(
    () => new Map(
      ((g == null ? void 0 : g.entries) ?? []).map((q) => [
        q.item.key,
        ea(q.before.ids, g.action, g.categories, C)
      ])
    ),
    [g, C]
  ), Z = (q) => kn.get(q.item.key), qt = (q) => ir(q.before.ids, Z(q).desired), Pt = (q) => {
    const M = qt(q);
    return q.status === "pending" && (M.added.length > 0 || M.removed.length > 0);
  }, $t = (q) => q.conflict || Z(q).kept.length > 0 || Z(q).replaced.length > 0, Ht = Te(() => {
    const q = (g == null ? void 0 : g.entries) ?? [];
    return {
      willChange: q.filter(Pt).length,
      correct: q.filter((M) => M.status === "unchanged").length,
      different: q.filter($t).length,
      hosts: new Set(q.map((M) => M.item.media.id)).size,
      added: [...new Set(q.flatMap((M) => qt(M).added))],
      removed: [...new Set(q.flatMap((M) => qt(M).removed))]
    };
  }, [kn]), ln = Te(
    () => ((g == null ? void 0 : g.entries) ?? []).filter((q) => q.item.media.date).sort((q, M) => q.item.media.date.localeCompare(M.item.media.date)),
    [g]
  ), qe = on ? od(Le) : null, pt = (q) => An.action(Xe.actions.findIndex((M) => M.id === q)), Ct = (q) => Wn(q, zt, [], a), it = Sr(H.condition) && H.includeSubtags !== !1 && H.conditionTagIds.length > 0, De = ln[0], mt = ln.length > 1 ? ln[ln.length - 1] : void 0, Yt = (q) => `/${Ne}/${q.item.media.id}`, Ot = ye ? O[0] : void 0, Lt = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: Pt },
    correct: { title: "Occurrences already correct", test: (q) => q.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: $t }
  };
  function Ze() {
    const q = ad[H.condition], M = !!q && H.conditionTagIds.length > 0, U = H.performerIds.slice(0, zi), ce = String(Xe.view.filter.q ?? "").trim(), oe = H.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ c("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      Wa(H) ? /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "All performers" }) : H.targetMode === "selected" ? /* @__PURE__ */ c(me, { children: [
        U.map((Me, _e) => /* @__PURE__ */ c("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ r(tr, { performer: { id: Me, name: O[_e] ?? "" } }),
          O[_e] ?? "…"
        ] }, Me)),
        H.performerIds.length > U.length && /* @__PURE__ */ c("span", { className: "dq-batch-chip", children: [
          (H.performerIds.length - U.length).toLocaleString(),
          " more performers"
        ] })
      ] }) : /* @__PURE__ */ c(me, { children: [
        /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "Performer criteria" }),
        /* @__PURE__ */ r(
          "fieldset",
          {
            className: "dq-batch-filter-summary",
            disabled: !0,
            "aria-label": "Batch performer criteria",
            children: /* @__PURE__ */ r(
              qr,
              {
                filter: {},
                objectFilter: H.performerFilter,
                criteriaDefinitions: Ua,
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
        )
      ] }),
      /* @__PURE__ */ c("span", { className: "dq-batch-chip", children: [
        M ? q : Ja[H.condition],
        M && /* @__PURE__ */ r("span", { className: "dq-batch-chip-tags", children: zn(H.conditionTagIds.map(ke)).map((Me) => /* @__PURE__ */ r(Jt, { tag: Me }, Me.id)) })
      ] }),
      M && /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: H.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      Sr(H.condition) && H.hideConfirmedAbsent !== !1 && /* @__PURE__ */ c("span", { className: "dq-batch-chip", title: oe, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
          ": ",
          oe
        ] })
      ] }),
      ce && /* @__PURE__ */ c("span", { className: "dq-batch-chip", children: [
        "Search “",
        ce,
        "”"
      ] }),
      Object.keys(Xe.view.objectFilter).length > 0 && /* @__PURE__ */ r(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${It} filters`,
          children: /* @__PURE__ */ r(
            qr,
            {
              filter: Xe.view.filter,
              objectFilter: sn,
              criteriaDefinitions: Ne === "audio" ? uo : Ga,
              customFieldEntityType: Ne,
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
      )
    ] });
  }
  function Se(q) {
    return n.length ? /* @__PURE__ */ c("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ r(Qr, { "aria-hidden": "true" }),
      /* @__PURE__ */ c("div", { children: [
        /* @__PURE__ */ c("p", { children: [
          /* @__PURE__ */ r("strong", { children: Ot || "This performer" }),
          " is flagged:",
          " ",
          /* @__PURE__ */ r("strong", { children: n.join(", ") }),
          ". Check the earliest and latest",
          " ",
          Ae.many,
          " before applying, or narrow the batch with a date filter."
        ] }),
        q && De && /* @__PURE__ */ c("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ c("a", { href: Yt(De), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            yr(De, Ne),
            " · ",
            De.item.media.date
          ] }),
          mt && /* @__PURE__ */ c("a", { href: Yt(mt), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            yr(mt, Ne),
            " · ",
            mt.item.media.date
          ] })
        ] })
      ] })
    ] }) : null;
  }
  function At() {
    return /* @__PURE__ */ c(me, { children: [
      Ze(),
      Se(!1),
      /* @__PURE__ */ c("div", { className: `dq-batch-pick${ye ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ c("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ r("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ r("div", { className: "dq-batch-answers", children: Nt.map((q, M) => {
            const U = pt(q.id);
            return /* @__PURE__ */ c("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ r(
                "input",
                {
                  type: "checkbox",
                  checked: N.includes(q.id),
                  "aria-labelledby": `${ct}-answer-${M}`,
                  "aria-describedby": `${ct}-effect-${M}`,
                  onChange: (ce) => cn(q.id, ce.target.checked)
                }
              ),
              /* @__PURE__ */ r("span", { className: "dq-batch-answer-key", children: U && /* @__PURE__ */ r(ut, { binding: U, hidden: !0 }) }),
              /* @__PURE__ */ c("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ r(
                  "span",
                  {
                    id: `${ct}-answer-${M}`,
                    className: "dq-batch-answer-label",
                    title: q.label,
                    children: q.label
                  }
                ),
                /* @__PURE__ */ r(Hi, { id: `${ct}-effect-${M}`, parts: Ct(q) })
              ] })
            ] }, q.id);
          }) })
        ] }),
        ye && /* @__PURE__ */ r(Pa, { ...at, mediaKind: Ne, className: "dq-batch-card" })
      ] })
    ] });
  }
  function Tn(q) {
    const M = Ht, U = re && Wi.has(re.group) ? re.group : null, ce = U ? Le.filter(Lt[U].test) : [], oe = (Me) => {
      const _e = Z(Me), kt = _e.skipped ? ir(
        Me.before.ids,
        ea(Me.before.ids, q.action, q.categories, !0).desired
      ) : qt(Me), Dt = !kt.added.length && !kt.removed.length;
      return /* @__PURE__ */ c("div", { className: "dq-batch-plan", children: [
        _e.skipped && /* @__PURE__ */ r("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        Dt ? !_e.kept.length && /* @__PURE__ */ r("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ r(Yi, { added: kt.added, removed: kt.removed, tag: ke }),
        _e.kept.map((be, ze) => /* @__PURE__ */ c("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          zn(be.existing.map(ke)).map((Fe) => /* @__PURE__ */ r(Jt, { tag: Fe }, Fe.id)),
          " ",
          "instead of",
          " ",
          zn(be.tagIds.map(ke)).map((Fe) => /* @__PURE__ */ r(Jt, { tag: Fe }, Fe.id))
        ] }, ze))
      ] });
    };
    return /* @__PURE__ */ c(me, { children: [
      /* @__PURE__ */ c("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ c("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ r(
            wr,
            {
              value: Le.length,
              label: Le.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${M.hosts.toLocaleString()} ${M.hosts === 1 ? It : `${It}s`}`,
              pressed: X("matching"),
              onToggle: () => He({ group: "matching" })
            }
          ),
          /* @__PURE__ */ r(
            wr,
            {
              value: M.willChange,
              label: "will change",
              tone: "add",
              pressed: X("change"),
              onToggle: () => He({ group: "change" })
            }
          ),
          /* @__PURE__ */ r(
            wr,
            {
              value: M.correct,
              label: "already correct, no write",
              pressed: X("correct"),
              onToggle: () => He({ group: "correct" })
            }
          ),
          /* @__PURE__ */ r(
            wr,
            {
              value: M.different,
              label: C ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: X("different"),
              onToggle: () => He({ group: "different" })
            }
          )
        ] }),
        ce.length > 0 ? /* @__PURE__ */ r(
          Xi,
          {
            title: Lt[U].title,
            entries: ce,
            mediaKind: Ne,
            resultHeading: "Planned change",
            describe: oe
          }
        ) : Le.length > 0 && /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        Le.length > 0 && /* @__PURE__ */ c("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ r("span", { children: De ? `Dates ${De.item.media.date}${mt ? ` to ${mt.item.media.date}` : ""}` : "No dates" }),
          De && /* @__PURE__ */ r(
            "a",
            {
              href: Yt(De),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${Ae.one}, ${De.item.media.date}`,
              title: yr(De, Ne),
              children: "Open earliest"
            }
          ),
          mt && /* @__PURE__ */ r(
            "a",
            {
              href: Yt(mt),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${Ae.one}, ${mt.item.media.date}`,
              title: yr(mt, Ne),
              children: "Open latest"
            }
          ),
          ln.length < Le.length && /* @__PURE__ */ c("span", { children: [
            (Le.length - ln.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (M.added.length > 0 || M.removed.length > 0) && /* @__PURE__ */ c("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ r("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ r(
            Yi,
            {
              added: M.added,
              removed: M.removed,
              tag: ke,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      M.different > 0 && /* @__PURE__ */ c("div", { className: "dq-batch-choice", children: [
        /* @__PURE__ */ r("span", { id: `${ct}-choice`, className: "dq-batch-choice-label", children: "Occurrences with a different answer" }),
        /* @__PURE__ */ c(
          "div",
          {
            className: "dq-segmented dq-segmented-fill",
            role: "group",
            "aria-labelledby": `${ct}-choice`,
            children: [
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": !C, onClick: () => _(!1), children: "Keep their answer" }),
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": C, onClick: () => _(!0), children: "Replace it" })
            ]
          }
        ),
        /* @__PURE__ */ c("p", { className: "dq-muted", children: [
          "A different answer is a tag the chosen answers would remove",
          it ? ", or another answer already in a condition category (each condition tag with its subtags); keeping it still fills the empty categories" : "",
          ". Configure opposite answers as removals."
        ] })
      ] })
    ] });
  }
  function Xt() {
    return /* @__PURE__ */ c(me, { children: [
      Ze(),
      Se(!0),
      /* @__PURE__ */ c("div", { className: `dq-batch-cards${ye ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ c("section", { className: "dq-batch-card", "aria-labelledby": `${ct}-chosen`, children: [
          /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ r("h3", { id: `${ct}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", disabled: T, onClick: Qt, children: "Change" })
          ] }),
          /* @__PURE__ */ r("ul", { className: "dq-batch-chosen", children: rt.map((q) => {
            const M = pt(q.id);
            return /* @__PURE__ */ c("li", { children: [
              /* @__PURE__ */ c("span", { className: "dq-batch-chosen-chip", children: [
                M && /* @__PURE__ */ r(ut, { binding: M, hidden: !0 }),
                q.label
              ] }),
              /* @__PURE__ */ r(Hi, { parts: Ct(q) })
            ] }, q.id);
          }) })
        ] }),
        ye && /* @__PURE__ */ r(Pa, { ...at, mediaKind: Ne, className: "dq-batch-card" })
      ] }),
      T ? /* @__PURE__ */ r("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ r("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ r("span", {}) }) }) : g && Tn(g)
    ] });
  }
  function et(q) {
    const M = ne ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, U = M.kind === "apply" ? Le.length - q.counts.pending : M.done, ce = M.kind === "apply" ? Le.length : M.total, oe = T ? M.kind === "undo" ? "Undoing batch…" : M.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : M.kind === "undo" ? M.stopped ? "Undo stopped" : "Undo finished" : M.stopped ? "Stopped" : "Finished", Me = ce ? Math.round(U / ce * 100) : 100, _e = re && !Wi.has(re.group) ? re.group : null, kt = (be) => Qi.find((ze) => ze.status === be).label, Dt = _e ? Le.filter(
      (be) => be.status === _e && (!re.reason || be.error === re.reason)
    ) : [];
    return /* @__PURE__ */ c(me, { children: [
      /* @__PURE__ */ c("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ r("h3", { tabIndex: -1, "data-batch-focus": "", children: oe }),
          /* @__PURE__ */ c("span", { children: [
            U.toLocaleString(),
            " of ",
            ce.toLocaleString(),
            " processed"
          ] })
        ] }),
        /* @__PURE__ */ r(
          "span",
          {
            className: "dq-batch-bar",
            role: "progressbar",
            "aria-label": "Batch progress",
            "aria-valuemin": 0,
            "aria-valuemax": ce,
            "aria-valuenow": U,
            children: /* @__PURE__ */ r("span", { style: { width: `${Me}%` } })
          }
        ),
        !T && M.kind === "undo" && /* @__PURE__ */ c("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (M.total - q.recorded).toLocaleString(),
          " of",
          " ",
          M.total.toLocaleString(),
          " ",
          M.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ c("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ r("div", { className: "dq-batch-stats", "data-count": "5", children: Qi.map((be) => /* @__PURE__ */ r(
          wr,
          {
            value: q.counts[be.status],
            label: be.label,
            tone: be.tone,
            pressed: X(be.status),
            onToggle: () => He({ group: be.status })
          },
          be.status
        )) }),
        q.reasons.length > 0 && /* @__PURE__ */ r("ul", { className: "dq-batch-reasons", children: q.reasons.map((be) => {
          const ze = X(be.status, be.error);
          return /* @__PURE__ */ c("li", { children: [
            /* @__PURE__ */ c("span", { children: [
              be.count.toLocaleString(),
              " ",
              be.status,
              ": ",
              be.error
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-link-button",
                "aria-expanded": ze,
                onClick: () => He({ group: be.status, reason: be.error }),
                children: ze ? "Hide them" : "Show them"
              }
            )
          ] }, `${be.status}-${be.error}`);
        }) }),
        Dt.length > 0 ? /* @__PURE__ */ r(
          Xi,
          {
            title: re.reason ? `${kt(_e)}: ${re.reason}` : `${kt(_e)} occurrences`,
            entries: Dt,
            mediaKind: Ne,
            resultHeading: "Result",
            describe: (be) => be.error ?? kt(be.status)
          }
        ) : /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." })
      ] }),
      q.recorded > 0 && /* @__PURE__ */ c("div", { className: "dq-batch-undo", children: [
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: T,
            onClick: () => void we("undo"),
            children: [
              /* @__PURE__ */ r(lc, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ c("p", { children: [
          Je ? M.stopped || T ? `${q.recorded.toLocaleString()} ${q.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${q.recorded.toLocaleString()} ${q.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${q.recorded === 1 ? "this change" : `these ${q.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          "It lasts until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function Mt() {
    return h === "answers" ? /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !rt.length,
        onClick: _n,
        children: "Preview all matches"
      },
      "preview"
    ) : h === "preview" ? T ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: Pe, children: "Cancel preview" }, "cancel-preview") : g ? /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !Ht.willChange,
        onClick: () => void we("apply"),
        children: [
          "Apply to ",
          Ht.willChange.toLocaleString(),
          " ",
          Ht.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void x(),
        children: "Preview again"
      },
      "again"
    ) : T ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: Pe, children: Je ? "Cancel undo" : "Cancel run" }, "cancel-run") : Je || !qe ? null : /* @__PURE__ */ c(ja, { children: [
      qe.retryable && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: () => void we("retry"), children: "Retry failed" }),
      qe.counts.pending > 0 && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          onClick: () => void we("apply"),
          children: "Continue"
        }
      )
    ] }, "after-run");
  }
  return /* @__PURE__ */ c(me, { children: [
    /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: ge,
        title: "Apply answers to all matching occurrences",
        disabled: t || !Nt.length,
        onClick: () => {
          Y(), i(), d(!0);
        },
        children: [
          /* @__PURE__ */ r(Ri, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    l && /* @__PURE__ */ c(
      "dialog",
      {
        ref: le,
        className: "dq-batch-dialog",
        "aria-labelledby": `${ct}-title`,
        "aria-modal": "true",
        onCancel: (q) => {
          q.preventDefault(), ht();
        },
        onClose: () => {
          var q;
          ft.current ? (q = le.current) == null || q.showModal() : ht();
        },
        children: [
          /* @__PURE__ */ c("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ r(Ri, { "aria-hidden": "true" }),
            /* @__PURE__ */ r("h2", { id: `${ct}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: T,
                onClick: ht,
                children: /* @__PURE__ */ r(kr, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r(id, { step: h }),
          /* @__PURE__ */ c(
            "div",
            {
              className: "dq-batch-body",
              ref: ue,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": h === "preview" ? "" : void 0,
              "aria-label": `${La.find((q) => q.id === h).label} step`,
              children: [
                /* @__PURE__ */ c("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  Q && /* @__PURE__ */ r("p", { role: "status", children: Q }),
                  D && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: D })
                ] }),
                h === "answers" ? At() : h === "preview" ? Xt() : et(qe)
              ]
            }
          ),
          /* @__PURE__ */ c("div", { className: "dq-batch-footer", children: [
            h === "preview" && /* @__PURE__ */ c("button", { type: "button", className: "dq-button", disabled: T, onClick: Qt, children: [
              /* @__PURE__ */ r(Tr, { "aria-hidden": "true" }),
              "Back"
            ] }),
            h === "run" && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: T, onClick: Y, children: "New batch" }),
            /* @__PURE__ */ r("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: T, onClick: ht, children: "Close" }),
            Mt()
          ] })
        ]
      }
    )
  ] });
}
const vs = "data-quality.description-collapsed.v1";
function cd() {
  try {
    return localStorage.getItem(vs) === "true";
  } catch {
    return !1;
  }
}
function ld({
  details: e,
  label: t
}) {
  const [n, a] = S(cd), i = Nn(() => {
    a((o) => {
      const s = !o;
      try {
        localStorage.setItem(vs, String(s));
      } catch {
      }
      return s;
    });
  }, []);
  return /* @__PURE__ */ c("section", { className: "dq-media-description", "aria-label": `${t} description`, children: [
    /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button dq-description-toggle",
        "aria-expanded": !n,
        onClick: i,
        children: "Description"
      }
    ),
    !n && (e != null && e.trim() ? /* @__PURE__ */ r(Qs, { className: "dq-description-body", children: e }) : /* @__PURE__ */ r("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
function dd({
  ranking: e,
  busy: t,
  error: n,
  focus: a,
  disabled: i,
  labels: o,
  onFocus: s,
  onMore: l,
  onRefresh: d
}) {
  var g;
  const h = e ? e.ranked.slice(0, e.limit) : [], p = !!e && (e.ranked.length > e.limit || (((g = e.candidates[e.cursor]) == null ? void 0 : g.total) ?? 0) > 0);
  return /* @__PURE__ */ c("div", { className: "dq-performer-ranking", children: [
    /* @__PURE__ */ c("div", { className: "dq-performer-ranking-status", children: [
      n ? /* @__PURE__ */ c("p", { role: "alert", children: [
        "Could not rank performers. ",
        n
      ] }) : t ? /* @__PURE__ */ c("p", { role: "status", children: [
        "Counting matching ",
        o.many,
        " per performer…"
      ] }) : e ? /* @__PURE__ */ r("p", { children: h.length ? `Most matching ${o.queue}s first` : `No performer has matching ${o.many}.` }) : null,
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "Refresh counts",
          title: "Refresh counts",
          disabled: t || i,
          onClick: d,
          children: /* @__PURE__ */ r(dc, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-queue-list", children: h.map((m) => {
      const y = `${m.count.toLocaleString()} matching ${m.count === 1 ? o.one : o.many}`, b = m.flags.length ? `Flagged: ${m.flags.join(", ")}` : "";
      return /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${m.name}, ${y}${b ? `. ${b}` : ""}`,
          title: b || void 0,
          "aria-current": a === m.id ? "true" : void 0,
          disabled: i,
          onClick: () => s(m.id),
          children: [
            /* @__PURE__ */ r(tr, { performer: m }),
            /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: m.name }),
            b && /* @__PURE__ */ r(Qr, { className: "dq-flag-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ r("span", { className: "dq-ranked-count", "aria-hidden": "true", children: m.count.toLocaleString() })
          ]
        },
        m.id
      );
    }) }),
    p && !t && !n && /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button dq-ranking-more",
        disabled: i,
        onClick: l,
        children: "Show more performers"
      }
    )
  ] });
}
const ud = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], fd = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function hd(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), a = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), i = t.bottom + 8;
  return { top: i, left: a, width: n, maxHeight: Math.max(160, window.innerHeight - i - 16) };
}
function Jr(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function pd(e, t) {
  const n = Wa(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", a = e.conditionTagIds.map(
    (o) => t[o] === void 0 ? "…" : t[o] ?? "Unavailable tag"
  ), i = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${Jr(a, "or")}`,
    includesAll: `has ${Jr(a, "and")}`,
    excludes: `has none of ${Jr(a, "or")}`,
    excludesAll: `missing ${Jr(a, "or")}`
  };
  return `${n} · ${i[e.condition]}`;
}
function md({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: a,
  onEditCriteria: i
}) {
  const [o, s] = S(!1), [l, d] = S(null), h = $(null), p = $(null), g = xt(), m = sr(e.conditionTagIds), y = pd(e, m);
  pn(() => {
    if (!o || !h.current) return;
    const C = () => h.current && d(hd(h.current));
    return C(), window.addEventListener("resize", C), () => window.removeEventListener("resize", C);
  }, [o]), V(() => {
    var _, T;
    if (!o) return;
    const C = (_ = p.current) == null ? void 0 : _.querySelector('[aria-pressed="true"]');
    C && !C.disabled ? C.focus() : (T = p.current) == null || T.focus();
  }, [o]);
  const b = () => {
    s(!1), requestAnimationFrame(() => {
      var C;
      return (C = h.current) == null ? void 0 : C.focus();
    });
  }, N = (C) => {
    if (!(C.target instanceof Element && C.target.closest('[role="dialog"]') !== p.current || C.defaultPrevented)) {
      if (C.key === "Escape")
        C.preventDefault(), b();
      else if (C.key === "Tab" && p.current) {
        const T = [...p.current.querySelectorAll(fd)].filter((Q) => Q.closest('[role="dialog"]') === p.current).sort(
          (Q, P) => Q.compareDocumentPosition(P) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!T.length) return;
        const I = T[0], D = T[T.length - 1], J = document.activeElement;
        C.shiftKey && (J === I || J === p.current) ? (C.preventDefault(), D.focus()) : !C.shiftKey && J === D && (C.preventDefault(), I.focus());
      }
    }
  }, R = !["any", "isNull"].includes(e.condition);
  return /* @__PURE__ */ c("div", { className: "dq-scope", children: [
    /* @__PURE__ */ c(
      "button",
      {
        ref: h,
        type: "button",
        className: "dq-header-button dq-scope-button",
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        "aria-controls": o ? g : void 0,
        title: y,
        onClick: () => o ? b() : s(!0),
        children: [
          /* @__PURE__ */ r(yo, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-summary", children: y }),
          /* @__PURE__ */ r(wo, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ c(me, { children: [
      /* @__PURE__ */ r("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: b }),
      /* @__PURE__ */ c(
        "div",
        {
          ref: p,
          id: g,
          role: "dialog",
          "aria-label": "Queue scope",
          className: "dq-scope-popover",
          tabIndex: -1,
          style: l ? {
            top: l.top,
            left: l.left,
            width: l.width,
            maxHeight: l.maxHeight
          } : void 0,
          onKeyDown: N,
          children: [
            /* @__PURE__ */ c("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Performers to review" }),
              /* @__PURE__ */ r("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: ud.map(({ mode: C, label: _ }) => /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === C,
                  onClick: () => e.targetMode !== C && a({ targetMode: C }),
                  children: _
                },
                C
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ r(
                Sn,
                {
                  entityType: "performer",
                  values: e.performerIds,
                  onChange: (C) => a({ performerIds: C }),
                  placeholder: "All performers...",
                  allowCreate: !1
                }
              ),
              e.targetMode === "filter" && /* @__PURE__ */ c("div", { className: "dq-scope-criteria", children: [
                /* @__PURE__ */ r("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ r(
                  qr,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: Ua,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (C) => a({ performerFilter: C })
                  }
                ) }),
                /* @__PURE__ */ c("button", { type: "button", className: "dq-button", onClick: i, children: [
                  /* @__PURE__ */ r(rr, { "aria-hidden": "true" }),
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
                  onChange: (C) => a({ condition: C.target.value }),
                  children: za.map((C) => /* @__PURE__ */ r("option", { value: C, children: Ja[C] }, C))
                }
              ),
              R && /* @__PURE__ */ c(me, { children: [
                /* @__PURE__ */ r(
                  Sn,
                  {
                    entityType: "tag",
                    values: e.conditionTagIds,
                    onChange: (C) => a({ conditionTagIds: C }),
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
                        onChange: (C) => a({ includeSubtags: C.target.checked })
                      }
                    ),
                    "Include subtags"
                  ] }),
                  Sr(e.condition) && /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ r(
                      "input",
                      {
                        type: "checkbox",
                        checked: e.hideConfirmedAbsent ?? !0,
                        onChange: (C) => a({ hideConfirmedAbsent: C.target.checked })
                      }
                    ),
                    "Hide occurrences confirmed absent"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c("div", { className: "dq-scope-footer", children: [
              /* @__PURE__ */ r("p", { children: n ? "Applies to this queue at once, and Save review keeps it." : "Applies to this queue at once. Save it to the review from the filter row." }),
              /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: b, children: "Done" })
            ] })
          ]
        }
      )
    ] })
  ] });
}
function Wr(e) {
  const {
    page: t,
    perPage: n,
    sort: a,
    direction: i,
    sorts: o,
    seed: s,
    ...l
  } = e.view.filter;
  return JSON.stringify([
    e.entityType,
    l,
    e.view.objectFilter,
    e.view.searchMode,
    e.occurrence
  ]);
}
function gd(e) {
  const t = e.occurrence;
  return JSON.stringify([
    Re(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {},
    t.flagPerformerTagIds ?? []
  ]);
}
async function bd(e, t) {
  const n = Re(e) === "audio", a = new Set(e.occurrence.flagPerformerTagIds ?? []), i = (l) => ({
    id: l.id,
    name: l.name,
    total: (n ? l.audioCount : l.videoCount) ?? 0,
    flags: (l.tags ?? []).filter((d) => a.has(d.id)).map((d) => d.name)
  }), o = e.occurrence, s = [];
  if (o.targetMode === "selected" && o.performerIds.length > 0)
    for (const l of o.performerIds) {
      const d = await _c(
        `/api/performers/${l}`,
        { signal: t }
      );
      d && s.push(i(d));
    }
  else {
    const { _filterExpression: l, ...d } = o.targetMode === "filter" ? o.performerFilter : {};
    for (let h = 1; ; h++) {
      const p = await ie(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            Cn({
              findFilter: {
                page: h,
                perPage: 1e3,
                sort: n ? "audio_count" : "video_count",
                direction: "desc"
              },
              objectFilter: d,
              filterExpression: l
            })
          )
        }
      );
      if (s.push(...p.items.map(i)), h * 1e3 >= p.totalCount || !p.items.length) break;
    }
  }
  return s.sort((l, d) => d.total - l.total || l.id - d.id);
}
function Ns(e, t, n) {
  const a = hi(e, [t]);
  return Gc(a, a.view.filter, n);
}
function qs(e, t) {
  const n = e.findIndex(
    (a) => a.count < t.count || a.count === t.count && a.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function Da(e, t, n, a) {
  if (t >= e.length) return !0;
  const i = e[t].total;
  return i <= 0 ? !0 : n.length >= a && i < n[a - 1].count;
}
async function wd(e, t, n, a, i = {}) {
  const o = Wr(e), s = gd(e), l = hs(e.occurrence), d = (t == null ? void 0 : t.signature) === o && !t.partial ? t : {
    signature: o,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: l ? "" : s,
    candidates: l ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await bd(e, a),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: h } = d, p = [...d.ranked];
  let g = d.cursor, m = !1;
  const y = (b) => ({
    ...d,
    cursor: g,
    ranked: [...p],
    limit: n,
    complete: !b && Da(h, g, p, n),
    ...b ? { partial: b } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: i.concurrency ?? 6 }, async () => {
        var b;
        for (; !m && !Da(h, g, p, n); ) {
          a.throwIfAborted();
          const N = h[g++], R = await Ns(e, N.id, a);
          R > 0 && qs(p, { ...N, count: R }), (b = i.onProgress) == null || b.call(i, y(!0));
        }
      })
    );
  } catch (b) {
    throw m = !0, b;
  }
  return a.throwIfAborted(), y(!1);
}
function yd(e, t, n) {
  const a = e.candidates.findIndex((o) => o.id === t);
  if (e.partial || a < 0 || a >= e.cursor) return e;
  const i = e.ranked.filter((o) => o.id !== t);
  return n > 0 && qs(i, { ...e.candidates[a], count: n }), {
    ...e,
    ranked: i,
    complete: Da(e.candidates, e.cursor, i, e.limit)
  };
}
function or(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, l) => or(s, t[l]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, a = t, i = Object.keys(n).sort(), o = Object.keys(a).sort();
  return i.length === o.length && i.every(
    (s, l) => s === o[l] && or(n[s], a[s])
  );
}
const sa = [
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
], vd = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function nr(e) {
  const t = ve(e) ? e.occurrence : void 0;
  return {
    filter: Et({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, Re(e)),
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
function Zi(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function _a(e, t) {
  let n;
  if (ve(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!sa.some((l) => l !== "performer" && t.has(l))) {
    const l = nr(e);
    return {
      query: n ? { ...l, performerFocus: n } : l,
      startAtEnd: l.startFrom === "end"
    };
  }
  const i = {
    q: t.get("q") ?? "",
    page: Number(t.get("page") ?? 1),
    perPage: Number(t.get("perPage") ?? 40),
    sort: t.get("sort") ?? "date",
    direction: t.get("direction") === "asc" ? "asc" : "desc"
  };
  if (t.has("seed") && (i.seed = Number(t.get("seed"))), t.get("sorts")) {
    const l = t.get("sorts").split(",").map((d) => {
      const h = d.lastIndexOf(":");
      return { key: d.slice(0, h), direction: d.slice(h + 1) };
    });
    if (l.some((d) => !d.key || !["asc", "desc"].includes(d.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = l, i.sort = l[0].key, i.direction = l[0].direction;
  }
  let o;
  if (ve(e) && (o = {
    ...vd,
    ...Zi(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(o.targetMode) || !za.includes(o.condition) || !Array.isArray(o.performerIds) || !Array.isArray(o.conditionTagIds) || typeof o.includeSubtags != "boolean" || typeof o.hideConfirmedAbsent != "boolean" || [...o.performerIds, ...o.conditionTagIds].some(
    (l) => !Number.isSafeInteger(l) || l <= 0
  ) || !o.performerFilter || typeof o.performerFilter != "object" || Array.isArray(o.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Et(i, Re(e)),
      objectFilter: Zi(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: o,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
function Nr(e, t) {
  const n = new URLSearchParams(window.location.search);
  sa.forEach((a) => n.delete(a)), n.set("review", e);
  for (const a of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[a] !== void 0 && n.set(a, String(t.filter[a]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((a) => `${a.key}:${a.direction}`).join(",")
  ), n.set("filters", JSON.stringify(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", JSON.stringify(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), window.history.replaceState(
    null,
    "",
    `${window.location.pathname}?${n}${window.location.hash}`
  );
}
function hn(e, t) {
  const n = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return ve(e) ? {
    ...e,
    view: n,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: n };
}
function eo(e, t) {
  return !t || !ve(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function va(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const a of e)
    n.set(a.media.id, [...n.get(a.media.id) ?? [], a]);
  return [...n.values()].reverse().flat();
}
const Bt = (e) => e instanceof Error ? e.message : "Request failed.", Na = 50, Nd = [], to = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function qd(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? Zs(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? po(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function Sd({ media: e, kind: t }) {
  const [n, a] = S(!1);
  return /* @__PURE__ */ r("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ r(No, {}) : /* @__PURE__ */ r(na, {}) : /* @__PURE__ */ r(
    "img",
    {
      src: Ia(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => a(!0)
    }
  ) });
}
function Ed({
  tags: e,
  preview: t,
  showPreview: n,
  trees: a,
  actionTagIds: i,
  label: o
}) {
  const s = ii(t), l = n ? s : null, d = e == null ? void 0 : e.absent, h = ri(
    Te(() => [...i, ...d ?? []], [i, d])
  ), p = (D) => h[D] ?? { id: D, name: h[D] === void 0 ? "…" : "Unavailable tag" }, g = (D) => zn(D.map(p)), m = l && e ? Ho(l, e, a) : null, y = e ? cl(e) : [], b = new Set(y.map((D) => D.id)), N = new Set(m == null ? void 0 : m.removed), R = new Set(m == null ? void 0 : m.markedAbsent), C = new Set(m == null ? void 0 : m.absenceCleared), _ = /* @__PURE__ */ c("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ r(Ca, { "aria-hidden": "true" }),
    "absent"
  ] }), T = g((m == null ? void 0 : m.added) ?? []), I = g(((m == null ? void 0 : m.markedAbsent) ?? []).filter((D) => !b.has(D)));
  return /* @__PURE__ */ c("section", { className: "dq-panel-section", "aria-label": o, children: [
    /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ c(me, { children: [
      y.length || T.length || I.length ? /* @__PURE__ */ c("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        y.map(
          (D) => N.has(D.id) ? /* @__PURE__ */ c("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ c("del", { children: [
              "− ",
              /* @__PURE__ */ r(Jt, { tag: D })
            ] }),
            R.has(D.id) && _
          ] }, D.id) : /* @__PURE__ */ r("li", { className: "dq-tag", children: /* @__PURE__ */ r(Jt, { tag: D }) }, D.id)
        ),
        T.map((D) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ c("ins", { children: [
          "+ ",
          /* @__PURE__ */ r(Jt, { tag: D })
        ] }) }, `added-${D.id}`)),
        I.map((D) => /* @__PURE__ */ c("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ r("ins", { children: /* @__PURE__ */ r(Jt, { tag: D }) }),
          _
        ] }, `absent-${D.id}`))
      ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" }),
      e.absent.length > 0 && /* @__PURE__ */ c(me, { children: [
        /* @__PURE__ */ r("h4", { className: "dq-subheading", children: "Confirmed absent" }),
        /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: g(e.absent).map((D) => /* @__PURE__ */ c(
          "li",
          {
            className: `dq-tag dq-tag-absent${C.has(D.id) ? " dq-tag-removed" : ""}`,
            children: [
              /* @__PURE__ */ r(Ca, { "aria-hidden": "true" }),
              C.has(D.id) ? /* @__PURE__ */ c("del", { children: [
                "− ",
                /* @__PURE__ */ r(Jt, { tag: D })
              ] }) : /* @__PURE__ */ r(Jt, { tag: D })
            ]
          },
          D.id
        )) })
      ] })
    ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading…" })
  ] });
}
function Cd({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: a,
  onSaveDefaults: i,
  editRequest: o = 0,
  onEditRequestHandled: s,
  pageControls: l
}) {
  var Ut;
  const d = Re(e), h = mn(d), p = d === "audio" ? "Audio" : "Scene", g = (f) => {
    var v;
    return f.title || ((v = f.files[0]) == null ? void 0 : v.basename) || p;
  }, m = (f) => `${f.occurrence ? `${f.occurrence.performer.name} — ` : ""}${g(f.media)}`, y = $(null), b = $("");
  if (!y.current)
    try {
      y.current = _a(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (f) {
      b.current = Bt(f), y.current = { query: nr(e), startAtEnd: !1 };
    }
  const [N, R] = S(null), [C, _] = S(""), [T, I] = S(""), D = $(null), J = $(null), Q = $(null), P = $(null), [ne, pe] = S(!!b.current), re = $(0), [A, O] = S(y.current.query), L = $(A);
  L.current = A;
  const [ee, ae] = S(0), le = $(y.current.startAtEnd), [ue, ge] = S([]), [E, j] = S(null), te = $(null), [Ce, Oe] = S(null), [ft, vt] = S(0), ct = Te(() => {
    if (!E) return null;
    const f = ue.findIndex((v) => v.key === E.key);
    return f < 0 ? null : ue.slice(f + 1).find((v) => v.media.id !== E.media.id) ?? null;
  }, [E, ue]), [An, on] = S(0), [Je, Xe] = S(!1), [H, Ne] = S(!1), Ae = $(!1), It = $(!0), Nt = $(null);
  V(() => (It.current = !0, () => {
    It.current = !1;
  }), []);
  const [rt, ye] = S(b.current), [at, lt] = S(""), [je, zt] = S(null), [ke, Wt] = S(!1), [sn, Y] = S([]), ht = $([]), cn = $(null), Qt = $(null), _n = $(null);
  V(() => {
    var f, v;
    ke && ((v = (f = _n.current) == null ? void 0 : f.querySelector("input")) == null || v.focus());
  }, [ke]);
  const [Pe, He] = S(!1), [X, x] = S(!1);
  V(() => {
    if (Je || Pe || !Qt.current) return;
    const f = requestAnimationFrame(() => {
      if (document.querySelector(to)) return;
      const v = Qt.current;
      Qt.current = null;
      const F = document.activeElement;
      F && F !== document.body || v != null && v.isConnected && !v.disabled && v.focus();
    });
    return () => cancelAnimationFrame(f);
  }, [Je, Pe, ee]);
  const [we, Le] = S([]), [kn, Z] = S({}), qt = $(null), Pt = $(0), [$t, Ht] = S({});
  V(() => {
    let f = !0;
    return Promise.all(
      di(A.objectFilter).map(
        async (v) => [
          String(v),
          (await ie(`/api/tags/${v}`)).name
        ]
      )
    ).then((v) => {
      f && Ht(Object.fromEntries(v));
    }).catch(() => {
    }), () => {
      f = !1;
    };
  }, [A.objectFilter]);
  const ln = Te(
    () => ui(A.objectFilter, $t),
    [$t, A.objectFilter]
  ), qe = $(0), pt = $(e);
  pt.current = e;
  const Ct = N ?? e, it = Te(
    () => hn(Ct, A),
    [Ct, A]
  ), De = Te(
    () => eo(it, A.performerFocus),
    [it, A.performerFocus]
  ), mt = $(De);
  mt.current = De;
  const Yt = $(it);
  Yt.current = it;
  const [Ot, Lt] = S("items"), [Ze, Se] = S(null), At = $(null), Tn = $("");
  function Xt(f) {
    const v = typeof f == "function" ? f(At.current) : f;
    At.current = v, Se(v);
  }
  const [et, Mt] = S(!1), [q, M] = S(null), U = $(null), ce = ve(it) ? Wr(it) : "", [oe, Me] = S(0), [_e, kt] = S(null);
  V(() => () => {
    var f;
    return (f = U.current) == null ? void 0 : f.controller.abort();
  }, []), V(() => {
    const f = U.current;
    !f || f.signature === ce || (f.controller.abort(), U.current = null, Mt(!1));
  }, [ce]), V(() => {
    var F;
    const f = At.current;
    if (Ot !== "performers" || !ce || ((F = U.current) == null ? void 0 : F.signature) === ce || Tn.current === ce || (f == null ? void 0 : f.signature) === ce && f.complete)
      return;
    const v = (f == null ? void 0 : f.signature) === ce ? f : null;
    Rn(f, (v == null ? void 0 : v.limit) ?? Na);
  }, [Ot, ce, Ze, q, et]);
  const Dt = A.performerFocus, be = JSON.stringify(
    ve(it) ? it.occurrence.flagPerformerTagIds ?? [] : []
  );
  V(() => {
    if (!Dt) {
      kt(null);
      return;
    }
    let f = !0;
    const v = new Set(JSON.parse(be));
    return ie(
      `/api/performers/${Dt}`
    ).then((F) => {
      f && kt({
        id: Dt,
        name: F.name,
        flags: (F.tags ?? []).filter((K) => v.has(K.id)).map((K) => K.name)
      });
    }).catch(() => {
    }), () => {
      f = !1;
    };
  }, [Dt, be]);
  const ze = A.startFrom !== (e.view.startFrom ?? "end") || !or(
    JSON.parse(Vt(hn(e, A))),
    JSON.parse(Vt(hn(e, nr(e))))
  ), Fe = H || Je || ke, Zt = Number(A.filter.page);
  function tt(f, v = !1) {
    Ae.current || (b.current = "", le.current = v, L.current = f, O(f), on(0), Xe(!0), v || Nr(e.id, f), ae((F) => F + 1));
  }
  function gn() {
    if (Ae.current = !1, Ne(!1), It.current && Nt.current) {
      const f = Nt.current;
      Nt.current = null, tt(f.query, f.startAtEnd);
    }
  }
  V(() => {
    const f = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const v = _a(
            pt.current,
            new URLSearchParams(window.location.search)
          );
          Ae.current ? Nt.current = v : tt(v.query, v.startAtEnd);
        } catch (v) {
          ye(Bt(v));
        }
    };
    return window.addEventListener("popstate", f), () => window.removeEventListener("popstate", f);
  }, [e.id]), V(() => (a(H || Je || ke || !!N), () => a(!1)), [H, Je, ke, !!N, a]);
  async function We(f, v, F) {
    if (ve(f)) {
      const W = await ps(
        f,
        qt.current,
        v,
        F
      );
      return {
        items: W.items.map((de) => ({
          key: de.key,
          media: de.media,
          occurrence: de
        })),
        totalCount: W.totalCount
      };
    }
    const K = await vr(
      f,
      { ...f.view.filter, page: v },
      F
    );
    return {
      items: K.items.map((W) => ({ key: String(W.id), media: W })),
      totalCount: K.totalCount
    };
  }
  function ot(f, v, F, K = !1, W = !1) {
    if (!It.current || Nt.current) return;
    pe(!0), ge(
      W ? f.items : va(f.items, L.current.startFrom === "end")
    ), on(f.totalCount), dt(F, K);
    const de = {
      ...L.current,
      filter: { ...L.current.filter, page: v }
    };
    L.current = de, O(de), Nr(e.id, de);
  }
  function dt(f, v = !1) {
    (f == null ? void 0 : f.key) !== (E == null ? void 0 : E.key) && (te.current = null), (f == null ? void 0 : f.media.id) !== (E == null ? void 0 : E.media.id) && Oe(v && f ? f.media.id : null), j(f);
  }
  V(() => {
    if (b.current) return;
    const f = new AbortController();
    P.current = f;
    const v = ++qe.current;
    return Xe(!0), ye(""), lt(""), te.current = null, Oe(null), j(null), ge([]), Wt(!1), (async () => {
      const F = eo(
        hn(pt.current, L.current),
        L.current.performerFocus
      );
      qt.current = ve(F) ? await fi(F, f.signal) : null;
      let K = Number(F.view.filter.page), W = await We(F, K, f.signal);
      const de = Math.max(
        1,
        Math.ceil(W.totalCount / Number(F.view.filter.perPage))
      );
      (le.current || K > de) && (K = de, W = await We(F, K, f.signal)), le.current = !1;
      const Be = F.view.startFrom === "end" ? -1 : 1;
      for (; ve(F) && !W.items.length && K + Be >= 1 && K + Be <= de && !f.signal.aborted; )
        K += Be, W = await We(F, K, f.signal);
      if (v !== qe.current || f.signal.aborted) return;
      const St = va(W.items, F.view.startFrom === "end");
      ot(W, K, St[0] ?? null);
    })().catch((F) => {
      !f.signal.aborted && v === qe.current && ye(Bt(F));
    }).finally(() => {
      !f.signal.aborted && v === qe.current && (pe(!0), Xe(!1));
    }), () => {
      f.abort(), qe.current++;
    };
  }, [ee, e.id]), V(() => {
    if (zt(null), !E) return;
    let f = !0;
    return an(d, E).then((v) => {
      f && (zt(v), Le(
        ve(e) ? v.ids.filter((F) => e.occurrence.tagIds.includes(F)) : []
      ));
    }).catch((v) => {
      f && ye(`Could not load current tags. ${Bt(v)}`);
    }), () => {
      f = !1;
    };
  }, [E]), V(() => {
    if (!ve(e) || e.actions.length)
      return;
    let f = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (v) => [
          v,
          (await ie(`/api/tags/${v}`)).name
        ]
      )
    ).then((v) => {
      f && Z(Object.fromEntries(v));
    }).catch((v) => {
      f && ye(Bt(v));
    }), () => {
      f = !1;
    };
  }, [e]);
  async function gt(f = !1, v = !1, F = !1) {
    var pr;
    if (!E) return;
    const K = ue.findIndex((xe) => xe.key === E.key), W = A.startFrom === "end" ? -1 : 1, de = ((pr = te.current) == null ? void 0 : pr.key) === E.key ? te.current : { key: E.key, page: Zt, before: ue.slice(0, K + 1).map((xe) => xe.key), after: ue.slice(K + 1).map((xe) => xe.key) }, Be = new Set(de.after), St = new Set(de.before), fn = ue.find((xe) => {
      var yt;
      return Be.has(xe.key) || (W === 1 || Zt < de.page) && ((yt = te.current) == null ? void 0 : yt.key) === E.key && !St.has(xe.key);
    });
    if (!f && fn) {
      dt(fn, F);
      return;
    }
    const nt = f ? St : new Set(ue.map((xe) => xe.key)), st = 1100 - (Date.now() - Pt.current);
    st > 0 && await new Promise((xe) => window.setTimeout(xe, st));
    let se = W === -1 && !f ? Math.max(1, Zt - 1) : Zt;
    for (; It.current && !Nt.current; ) {
      let xe = await We(De, se);
      const yt = Math.max(
        1,
        Math.ceil(xe.totalCount / Number(A.filter.perPage))
      );
      se > yt && (se = yt, xe = await We(De, se));
      const Dr = va(xe.items, W === -1), la = new Map(Dr.map((Tt) => [Tt.key, Tt])), Ye = f ? de.after.flatMap((Tt) => {
        const mr = la.get(Tt);
        return mr ? [mr] : [];
      }) : [], Gt = new Set(Ye.map((Tt) => Tt.key)), Kn = f ? {
        ...xe,
        items: [
          ...Ye,
          ...Dr.filter(
            (Tt) => Tt.key !== E.key && !Gt.has(Tt.key)
          )
        ]
      } : xe;
      if (v) {
        te.current = de, ot(Kn, se, E, !1, f);
        return;
      }
      const Fn = W === -1 && Zt === 1 && !f ? void 0 : Kn.items.find(
        (Tt) => !nt.has(Tt.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(f && W === -1 && se === de.page) || Be.has(Tt.key))
      );
      if (Fn || (W === -1 ? se <= 1 : se >= yt)) {
        ot(
          Kn,
          se,
          Fn ?? null,
          F,
          f
        ), Fn || lt(
          xe.totalCount ? `Reached the end in this direction. Matching items remain available from the ${h.queue} pages.` : `No matching ${h.many}.`
        );
        return;
      }
      se += W;
    }
  }
  async function bt(f, v = !1, F = !1, K = !1) {
    if (N || !E || Ae.current || Je || ke && !F)
      return;
    const W = F || K || !!(f != null && f.steps.length), de = W && !v;
    if (W && (!t || !je) || f && Pn(f) && !n) return;
    Ae.current = !0, Ne(!0), ye(""), lt("");
    const Be = ue.findIndex((nt) => nt.key === E.key), St = W && !v && Be >= 0 ? ue[Be + 1] ?? null : null;
    St && (ge(
      (nt) => nt.filter((st) => st.key !== E.key)
    ), dt(St, !0));
    let fn = !1;
    try {
      if (W) {
        const nt = await an(d, E);
        if (f)
          await Jl(De, E, f);
        else {
          const se = K && ve(e) ? e.occurrence.tagIds.filter((yt) => nt.ids.includes(yt)) : ht.current, xe = ir(se, K ? we : sn);
          await mi(De, E, xe);
        }
        Pt.current = Date.now();
        const st = await an(d, E);
        St || zt(st), fn = !0, Wt(!1), lt("Tags saved."), E.occurrence && ($r(E.occurrence.performer.id), Me((se) => se + 1));
      }
      if (!It.current || Nt.current) return;
      W ? await gt(!0, v, de) : v || await gt(), v && F && requestAnimationFrame(() => {
        var nt;
        return (nt = cn.current) == null ? void 0 : nt.focus();
      });
    } catch (nt) {
      if (ye(
        fn ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${Bt(nt)}` : W ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${Bt(nt)}` : `Could not advance. ${Bt(nt)}`
      ), W && !fn) {
        St && (ge(ue), Oe(null), vt((st) => st + 1), j(E)), Pt.current = Date.now();
        try {
          zt(await an(d, E));
        } catch {
          zt(null), ye(
            (st) => `${st} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      gn();
    }
  }
  const _t = !ke && !N && !Pe && !X && (E != null || Je || H);
  ti({
    surface: "local",
    enabled: _t,
    actionCount: e.actions.length,
    onAction: (f, v) => {
      const F = e.actions[f];
      F && bt(F, v);
    },
    onFind: () => x(!0)
  });
  const cr = (f) => H || Je || !je || !!N || !t && f.steps.length > 0 || !n && Pn(f);
  function bn() {
    if (!i || N || Ae.current || ke) return;
    Q.current = document.activeElement, J.current = {
      error: rt,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(L.current),
      items: ue,
      current: E,
      total: An,
      targets: qt.current,
      stayedCursor: te.current
    };
    const f = structuredClone(hn(e, L.current));
    R(f), I(Cr(f)), _(""), lt(""), ye("");
  }
  V(() => {
    if (!o) {
      re.current = 0;
      return;
    }
    o !== re.current && ne && !Je && (re.current = o, bn(), s == null || s());
  }, [o, Je, ne]);
  function en() {
    R(null), _(""), requestAnimationFrame(() => {
      const f = Q.current;
      f != null && f.isConnected && f !== document.body && f.focus();
    });
  }
  function dn() {
    var v;
    const f = J.current;
    !f || H || ((v = P.current) == null || v.abort(), qe.current++, L.current = f.query, O(f.query), ge(f.items), j(f.current), on(f.total), qt.current = f.targets, te.current = f.stayedCursor, Xe(!1), ye(f.error), lt(""), window.history.replaceState(window.history.state, "", f.url), en());
  }
  async function lr() {
    if (!N || !i || Ae.current) return;
    const f = hn(
      { ...N, name: N.name.trim() },
      L.current
    ), v = Er(f);
    if (v) {
      _(v);
      return;
    }
    Ae.current = !0, Ne(!0), _("");
    try {
      if (await i(f) === !1) throw new Error("Could not save review.");
      en(), lt("Review saved.");
    } catch (F) {
      _(
        "Could not save review. Your edits are still open. " + Bt(F)
      );
    } finally {
      gn();
    }
  }
  async function Qn() {
    if (!i || Ae.current) return;
    const f = hn(e, {
      ...L.current,
      filter: { ...L.current.filter, page: 1 }
    });
    Ae.current = !0, Ne(!0), ye("");
    try {
      if (await i(f) === !1) throw new Error("Could not save review.");
      lt("Queue saved to this review.");
    } catch (v) {
      ye("Could not save queue. " + Bt(v));
    } finally {
      gn();
    }
  }
  const wt = A.performerScope, Ee = (f) => {
    const { performerFocus: v, ...F } = L.current, K = v && !("targetMode" in f || "performerIds" in f || "performerFilter" in f);
    tt({
      ...F,
      ...K ? { performerFocus: v } : {},
      filter: { ...F.filter, page: 1 },
      performerScope: { ...wt, ...f }
    });
  };
  async function Rn(f, v) {
    var W;
    const F = Yt.current;
    if (!ve(F)) return;
    (W = U.current) == null || W.controller.abort();
    const K = {
      signature: Wr(F),
      controller: new AbortController()
    };
    U.current = K, Tn.current = "", Mt(!0), M(null);
    try {
      const de = await wd(F, f, v, K.controller.signal, {
        onProgress: (Be) => {
          U.current === K && Xt(Be);
        }
      });
      U.current === K && Xt(de);
    } catch (de) {
      U.current === K && !K.controller.signal.aborted && (Tn.current = K.signature, M({ signature: K.signature, message: Bt(de) }));
    } finally {
      U.current === K && (U.current = null, Mt(!1));
    }
  }
  function un() {
    var f;
    (f = U.current) == null || f.controller.abort(), U.current = null, Mt(!1), Xt((v) => v && { ...v, partial: !0, complete: !1 });
  }
  async function $r(f) {
    var W;
    const v = Yt.current;
    if (!ve(v)) return;
    if (U.current) {
      un();
      return;
    }
    const F = Wr(v);
    if (((W = At.current) == null ? void 0 : W.signature) !== F || At.current.partial) return;
    const K = 1100 - (Date.now() - Pt.current);
    K > 0 && await new Promise((de) => window.setTimeout(de, K));
    try {
      const de = await Ns(v, f);
      if (U.current) {
        un();
        return;
      }
      Xt(
        (Be) => (Be == null ? void 0 : Be.signature) === F ? yd(Be, f, de) : Be
      );
    } catch {
      Xt(
        (de) => (de == null ? void 0 : de.signature) === F ? { ...de, partial: !0, complete: !1 } : de
      );
    }
  }
  const dr = A.performerFocus ? Ze == null ? void 0 : Ze.candidates.find((f) => f.id === A.performerFocus) : void 0, Ue = (_e == null ? void 0 : _e.id) === A.performerFocus ? _e : dr ?? null;
  function tn(f) {
    if (Ae.current) return;
    const v = {
      ...L.current,
      performerFocus: f,
      filter: { ...L.current.filter, page: 1 }
    };
    tt(v, v.startFrom === "end"), Lt("items");
  }
  function ur() {
    const { performerFocus: f, ...v } = L.current;
    tt(
      { ...v, filter: { ...v.filter, page: 1 } },
      v.startFrom === "end"
    );
  }
  const jt = $(null);
  jt.current ?? (jt.current = Xo());
  const Ie = jt.current, wn = Yo(Ct.actions), Or = Te(
    () => Ct.actions.flatMap((f) => f.steps.flatMap((v) => v.tagIds)),
    [Ct.actions]
  ), jn = $(null);
  V(() => {
    const f = jn.current, v = f == null ? void 0 : f.querySelector('[aria-current="true"]');
    if (!f || !v) return;
    const F = f.getBoundingClientRect(), K = v.getBoundingClientRect();
    K.top < F.top ? f.scrollTop -= F.top - K.top : K.bottom > F.bottom && (f.scrollTop += K.bottom - F.bottom);
  }, [E == null ? void 0 : E.key, Ot]);
  const Un = $(null), In = $(null);
  V(() => {
    var F, K;
    const f = In.current;
    if (!f) return;
    In.current = null;
    const v = [...((F = Un.current) == null ? void 0 : F.querySelectorAll(".dq-partner")) ?? []];
    (K = v.find((W) => W.dataset.partnerKey === f) ?? v[0]) == null || K.focus();
  }, [E == null ? void 0 : E.key]);
  const $n = H || Je || ke || !!N, On = Te(
    () => N ? hn(N, A) : null,
    [N, A]
  ), Gn = Te(
    () => On != null && Cr(On) !== T,
    [On, T]
  );
  function Mr() {
    E ? an(d, E).then(zt).catch((f) => ye(Bt(f))) : tt(L.current);
  }
  const yn = rt ? /* @__PURE__ */ c("p", { role: "alert", children: [
    rt,
    " ",
    /* @__PURE__ */ r("button", { type: "button", disabled: H, onClick: Mr, children: E ? "Reload tags" : "Retry queue" })
  ] }) : null, Mn = H || Je || E != null && !je, ca = Math.max(1, Number(A.filter.perPage) || 1), fr = $(1);
  Je || (fr.current = Math.max(1, Math.ceil(An / ca)));
  const Fr = fr.current, xr = wt && E ? ue.filter(
    (f) => f.media.id === E.media.id && f.key !== E.key
  ) : [], Pr = E != null && E.occurrence && E.occurrence.performer.id === A.performerFocus ? (Ue == null ? void 0 : Ue.flags) ?? [] : E != null && E.occurrence ? ((Ut = Ze == null ? void 0 : Ze.candidates.find((f) => f.id === E.occurrence.performer.id)) == null ? void 0 : Ut.flags) ?? [] : [], hr = (f) => {
    var v;
    return f.title || ((v = f.files[0]) == null ? void 0 : v.basename) || `${d === "audio" ? "Audio" : "Video"} ${f.id}`;
  }, Lr = E ? qd(E.media, d) : "";
  return /* @__PURE__ */ c(
    "section",
    {
      className: `dq-review-workspace${d === "audio" ? " dq-audio" : ""}`,
      "aria-label": wt ? d === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : d === "audio" ? "Audio review" : "Video review",
      onClickCapture: (f) => {
        var K;
        const v = f.target instanceof Element ? f.target.closest("button") : null, F = (v == null ? void 0 : v.getAttribute("aria-label")) ?? ((K = v == null ? void 0 : v.textContent) == null ? void 0 : K.trim()) ?? "";
        v && !v.closest(to) && /^(Filters|Edit filter:|Edit criteria)/.test(F) && (Qt.current = v);
      },
      children: [
        /* @__PURE__ */ r(
          cs,
          {
            name: e.name,
            description: e.description,
            entityType: Ke(e),
            onBack: l == null ? void 0 : l.onBack,
            backDisabled: $n,
            onEdit: N ? () => {
              var f;
              return (f = D.current) == null ? void 0 : f.focus();
            } : bn,
            editDisabled: !N && ($n || !i),
            editing: !!N,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ c("fieldset", { className: "dq-review-toolbar", disabled: H || ke, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: d === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ r(
                  qr,
                  {
                    filter: A.filter,
                    objectFilter: ln,
                    criteriaDefinitions: d === "audio" ? uo : Ga,
                    customFieldEntityType: d,
                    totalCount: An,
                    sortOptions: d === "audio" ? Hs : fo,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(
                      ls,
                      {
                        page: Math.min(Math.max(1, Zt || 1), Fr),
                        pages: Fr,
                        onPage: (f) => tt({
                          ...L.current,
                          filter: Et(
                            { ...L.current.filter, page: f },
                            d
                          )
                        })
                      }
                    ),
                    onFilterChange: (f) => {
                      (f.sort !== L.current.filter.sort || f.direction !== L.current.filter.direction) && (f = { ...f, sorts: void 0 }), tt({
                        ...L.current,
                        filter: Et(f, d)
                      });
                    },
                    onObjectFilterChange: (f) => {
                      tt({
                        ...L.current,
                        objectFilter: us(
                          f,
                          $t,
                          L.current.objectFilter
                        ),
                        filter: { ...L.current.filter, page: 1 }
                      });
                    }
                  }
                )
              ] })
            ),
            trailing: /* @__PURE__ */ c(me, { children: [
              wt && /* @__PURE__ */ r(
                md,
                {
                  scope: wt,
                  disabled: H || ke,
                  editing: !!N,
                  onChange: Ee,
                  onEditCriteria: () => He(!0)
                }
              ),
              ve(De) && t && /* @__PURE__ */ r(
                sd,
                {
                  review: De,
                  disabled: Fe || !!N,
                  performerFlags: A.performerFocus ? Ue == null ? void 0 : Ue.flags : void 0,
                  trees: wn,
                  onOpen: () => {
                    Ae.current = !0, Ne(!0);
                  },
                  onWrite: () => {
                    Pt.current = Date.now();
                  },
                  onClose: (f) => {
                    if (f) {
                      Pt.current = Date.now();
                      const v = L.current.performerFocus;
                      v ? $r(v) : un(), Me((F) => F + 1), new Promise((F) => window.setTimeout(F, 1100)).then(() => {
                        gn(), It.current && (b.current || Xe(!0), ae((F) => F + 1));
                      });
                    } else gn();
                  }
                }
              ),
              (l == null ? void 0 : l.onGrid) && /* @__PURE__ */ r(
                ds,
                {
                  mode: "single",
                  disabled: $n,
                  onChange: () => {
                    var f;
                    return (f = l.onGrid) == null ? void 0 : f.call(l);
                  }
                }
              ),
              (l == null ? void 0 : l.moreItems) && /* @__PURE__ */ r(
                si,
                {
                  disabled: $n,
                  items: l.moreItems({
                    onSelect: bn,
                    disabled: !i
                  })
                }
              )
            ] }),
            chipsStart: A.performerFocus ? /* @__PURE__ */ c("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ r(
                tr,
                {
                  performer: {
                    id: A.performerFocus,
                    name: (Ue == null ? void 0 : Ue.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ c("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ r("strong", { children: (Ue == null ? void 0 : Ue.name) ?? `performer ${A.performerFocus}` })
              ] }),
              Ue != null && Ue.flags.length ? /* @__PURE__ */ c(
                "span",
                {
                  className: "dq-focus-flag",
                  title: `Flagged: ${Ue.flags.join(", ")}`,
                  children: [
                    /* @__PURE__ */ r(Qr, { "aria-hidden": "true" }),
                    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
                      "Flagged: ",
                      Ue.flags.join(", ")
                    ] })
                  ]
                }
              ) : null,
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: Fe,
                  onClick: ur,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            chipsEnd: N ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : ze ? /* @__PURE__ */ c(me, { children: [
              /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Queue differs from the saved review" }),
              /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: "dq-text-button",
                  title: "Save the current queue criteria to this review",
                  disabled: Fe || !i,
                  onClick: () => void Qn(),
                  children: [
                    /* @__PURE__ */ r(So, { "aria-hidden": "true" }),
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
                  disabled: Fe,
                  onClick: () => {
                    const f = nr(e);
                    tt(f, f.startFrom === "end");
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
        l == null ? void 0 : l.notices,
        /* @__PURE__ */ c("div", { className: "dq-review-area", children: [
          N && On && /* @__PURE__ */ r(
            ss,
            {
              drawerRef: D,
              draft: On,
              onChange: (f) => R(f),
              direction: A.startFrom,
              onDirectionChange: (f) => tt({ ...L.current, startFrom: f }),
              tagGroups: Nd,
              trees: wn,
              saving: H,
              saveDisabled: Je,
              error: C,
              dirty: Gn,
              notices: yn && /* @__PURE__ */ r("div", { className: "dq-review-feedback", children: yn }),
              onSave: () => void lr(),
              onCancel: dn
            }
          ),
          /* @__PURE__ */ r("div", { className: "dq-review-main", children: /* @__PURE__ */ c("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ c("div", { className: "dq-review-stage", children: [
              E ? /* @__PURE__ */ c(me, { children: [
                /* @__PURE__ */ c("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ r("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ c(
                    "a",
                    {
                      href: `/${d}/${E.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${h.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ r("span", { children: hr(E.media) }),
                        /* @__PURE__ */ r(Co, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  Lr && /* @__PURE__ */ r("span", { className: "dq-stage-meta", children: Lr })
                ] }),
                /* @__PURE__ */ c("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ r("div", { className: "dq-player-frame", children: [E, ct].filter(Boolean).map((f) => {
                    var K, W, de, Be, St;
                    const v = f, F = v.key === E.key;
                    return /* @__PURE__ */ r(
                      "div",
                      {
                        className: F ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": F ? void 0 : !0,
                        inert: F ? void 0 : !0,
                        children: d === "audio" ? /* @__PURE__ */ r(
                          Ys,
                          {
                            streamUrl: $a("audio", v.media.id),
                            format: ((K = v.media.files[0]) == null ? void 0 : K.format) ?? "",
                            title: g(v.media),
                            coverUrl: F ? Ia("audio", v.media) : void 0,
                            duration: ((W = v.media.files[0]) == null ? void 0 : W.duration) ?? 0,
                            autostart: F && Ce === v.media.id
                          }
                        ) : /* @__PURE__ */ r(
                          ho,
                          {
                            videoId: v.media.id,
                            streamUrl: $a("video", v.media.id),
                            posterUrl: F ? Ia("video", v.media) : void 0,
                            duration: ((de = v.media.files[0]) == null ? void 0 : de.duration) ?? 0,
                            format: (Be = v.media.files[0]) == null ? void 0 : Be.format,
                            audioCodec: (St = v.media.files[0]) == null ? void 0 : St.audioCodec,
                            extensionSurface: F ? "quick-view" : void 0,
                            autostart: F && Ce === v.media.id,
                            keyboardShortcutsEnabled: F,
                            showAbLoop: F,
                            clip: v.media.parentVideoId != null ? {
                              start: v.media.clipStartSec ?? 0,
                              end: v.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${v.media.id}:${ft}`
                    );
                  }) }),
                  d === "audio" && /* @__PURE__ */ r(
                    ld,
                    {
                      details: E.media.details,
                      label: h.one
                    },
                    E.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ r("p", { role: "status", className: "dq-stage-status", children: Je ? "Loading review…" : An ? "Reached the end in this direction." : `No matching ${h.many}.` }),
              Ct.actions.length > 0 ? /* @__PURE__ */ r(
                ll,
                {
                  actions: Ct.actions,
                  mediaKind: d,
                  isDisabled: (f) => ke || cr(f),
                  busy: Mn,
                  tags: je,
                  trees: wn,
                  preview: Ie,
                  onApply: (f, v) => void bt(f, v),
                  onFind: () => x(!0),
                  findDisabled: ke || !!N,
                  paused: !!N
                }
              ) : ve(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ c(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || H || ke || !je || !!N || !E,
                  children: [
                    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((f) => /* @__PURE__ */ c("label", { children: [
                      /* @__PURE__ */ r(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: we.includes(f),
                          onChange: (v) => Le(
                            e.occurrence.multiple ? v.target.checked ? [...we, f] : we.filter((F) => F !== f) : [f]
                          )
                        }
                      ),
                      kn[f] ?? "Loading tag…"
                    ] }, f)),
                    /* @__PURE__ */ c("div", { className: "dq-row", children: [
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => Le([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void bt(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void bt(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ c("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ c("div", { className: "dq-panel-body", ref: Un, children: [
                E && /* @__PURE__ */ c(me, { children: [
                  /* @__PURE__ */ c("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ c("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: E.occurrence ? E.occurrence.performer.name : `this ${h.one}` })
                    ] }),
                    /* @__PURE__ */ c("div", { className: "dq-reviewing-who", children: [
                      E.occurrence && /* @__PURE__ */ r(tr, { performer: E.occurrence.performer }),
                      /* @__PURE__ */ c("div", { children: [
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: E.occurrence ? E.occurrence.performer.name : `This ${h.one}` }),
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-note", children: wt ? `Tags apply to this performer in this ${h.queue}` : `Tags apply to the whole ${h.one}` })
                      ] })
                    ] }),
                    Pr.length > 0 && /* @__PURE__ */ c("p", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
                      /* @__PURE__ */ r(Qr, { "aria-hidden": "true" }),
                      "Flagged: ",
                      Pr.join(", ")
                    ] })
                  ] }),
                  xr.length > 0 && /* @__PURE__ */ c(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${h.queue}`,
                      children: [
                        /* @__PURE__ */ c("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          h.queue
                        ] }),
                        /* @__PURE__ */ r("div", { className: "dq-partners", children: xr.map((f) => {
                          var v, F, K;
                          return /* @__PURE__ */ c(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (v = f.occurrence) == null ? void 0 : v.performer.name,
                              "aria-label": (F = f.occurrence) == null ? void 0 : F.performer.name,
                              "data-partner-key": f.key,
                              disabled: Fe,
                              onClick: () => {
                                In.current = E.key, dt(f), ye("");
                              },
                              children: [
                                f.occurrence && /* @__PURE__ */ r(tr, { performer: f.occurrence.performer }),
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
                    Ed,
                    {
                      tags: je,
                      preview: Ie,
                      showPreview: !ke,
                      trees: wn,
                      actionTagIds: Or,
                      label: `Current ${wt ? "occurrence" : h.one} tags`
                    }
                  ),
                  ke && /* @__PURE__ */ c(
                    "fieldset",
                    {
                      ref: _n,
                      disabled: H,
                      className: "dq-panel-section dq-tag-editor",
                      children: [
                        /* @__PURE__ */ c("legend", { className: "dq-eyebrow", children: [
                          "Edit ",
                          wt ? "occurrence" : h.one,
                          " tags"
                        ] }),
                        /* @__PURE__ */ r(
                          Sn,
                          {
                            entityType: "tag",
                            values: sn,
                            onChange: Y,
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
                              disabled: !je,
                              onClick: () => void bt(void 0, !0, !0),
                              children: "Save"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              disabled: !je,
                              onClick: () => void bt(void 0, !1, !0),
                              children: "Save & next"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              onClick: () => {
                                Wt(!1), requestAnimationFrame(() => {
                                  var f;
                                  return (f = cn.current) == null ? void 0 : f.focus();
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
                ve(it) && A.performerFocus && /* @__PURE__ */ r(
                  td,
                  {
                    review: it,
                    performerId: A.performerFocus,
                    revision: oe
                  }
                )
              ] }),
              /* @__PURE__ */ c("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ c("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !N && yn,
                  at && /* @__PURE__ */ r("p", { role: "status", children: at })
                ] }),
                !t && /* @__PURE__ */ r("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                E && /* @__PURE__ */ c("div", { className: "dq-panel-actions", "aria-busy": Mn || void 0, children: [
                  /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      ref: cn,
                      className: "dq-button",
                      disabled: Fe || !!N || !t || !je,
                      onClick: () => {
                        ht.current = [...je.ids], Y([...je.ids]), Wt(!0);
                      },
                      children: [
                        /* @__PURE__ */ r(vo, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: Fe || !!N,
                      onClick: () => void bt(),
                      children: [
                        /* @__PURE__ */ r(uc, { "aria-hidden": "true" }),
                        "Skip",
                        wt ? " performer" : ` ${h.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              wt && /* @__PURE__ */ c(
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
                        "aria-pressed": Ot === "items",
                        onClick: () => Lt("items"),
                        children: d === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": Ot === "performers",
                        onClick: () => Lt("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              wt && Ot === "performers" ? /* @__PURE__ */ r(
                dd,
                {
                  ranking: (Ze == null ? void 0 : Ze.signature) === ce ? Ze : null,
                  busy: et,
                  error: (q == null ? void 0 : q.signature) === ce ? q.message : "",
                  focus: A.performerFocus,
                  disabled: Fe,
                  labels: h,
                  onFocus: tn,
                  onMore: () => {
                    const f = At.current;
                    f && Rn(f, f.limit + Na);
                  },
                  onRefresh: () => {
                    Xt(null), Rn(null, Na);
                  }
                }
              ) : /* @__PURE__ */ r("div", { className: "dq-queue-list", ref: jn, children: ue.map((f) => {
                var F;
                const v = (E == null ? void 0 : E.key) === f.key;
                return /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: m(f),
                    "aria-label": m(f),
                    "aria-current": v ? "true" : void 0,
                    disabled: Fe,
                    onClick: () => {
                      dt(f), ye(""), lt("");
                    },
                    children: [
                      /* @__PURE__ */ r(Sd, { media: f.media, kind: d }),
                      /* @__PURE__ */ c("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: g(f.media) }),
                        /* @__PURE__ */ c("span", { className: "dq-queue-row-meta", children: [
                          f.occurrence && /* @__PURE__ */ c(me, { children: [
                            /* @__PURE__ */ r(tr, { performer: f.occurrence.performer }),
                            /* @__PURE__ */ r("span", { className: "dq-queue-row-performer", children: f.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ r("span", { className: "dq-queue-row-detail", children: [
                            f.media.date,
                            f.occurrence ? "" : (F = f.media.files[0]) != null && F.duration ? po(f.media.files[0].duration) : ""
                          ].filter(Boolean).join(" · ") })
                        ] })
                      ] })
                    ]
                  },
                  f.key
                );
              }) })
            ] })
          ] }) })
        ] }),
        wt && /* @__PURE__ */ r(
          Xs,
          {
            open: Pe,
            onClose: () => He(!1),
            criteria: Ua,
            activeFilter: wt.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (f) => {
              He(!1), Ee({ performerFilter: f });
            }
          }
        ),
        X && /* @__PURE__ */ r(
          ai,
          {
            actions: e.actions,
            trees: wn,
            isDisabled: (f) => cr(f),
            onApply: (f, v) => {
              x(!1), bt(f, v);
            },
            onClose: () => x(!1)
          }
        )
      ]
    }
  );
}
function Ss(e, t, n, a) {
  const i = a === "asc" ? 1 : -1;
  return [...e].sort((o, s) => {
    if (n === "count") {
      const l = t[o.id], d = t[s.id], h = typeof l == "number", p = typeof d == "number";
      if (h !== p) return h ? -1 : 1;
      if (h && p && l !== d)
        return (l - d) * i;
    }
    return o.name.localeCompare(s.name, void 0, { numeric: !0, sensitivity: "base" }) * i;
  });
}
function qa(e, t) {
  const n = Ke(e), a = mn(Qa(n)), i = n === "tag" ? "tag" : ve(e) ? a.queue : a.one;
  return t === 1 ? i : `${i}s`;
}
function Ad({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ c(me, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      qa(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ c(me, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
      "Matching ",
      qa(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ c(me, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      qa(e, t)
    ] })
  ] });
}
function kd({
  reviews: e,
  counts: t,
  sort: n,
  direction: a,
  onSortChange: i,
  onDirectionChange: o,
  storage: s,
  canConfigure: l,
  busy: d,
  headingRef: h,
  notices: p,
  onOpen: g,
  onNew: m,
  onImport: y,
  onExportAll: b,
  rowMenuItems: N
}) {
  const R = $(null), C = Te(
    () => Ss(e, t, n, a),
    [e, t, n, a]
  ), _ = e.every((I) => t[I.id] !== void 0), T = a === "asc" ? "ascending" : "descending";
  return /* @__PURE__ */ c("div", { className: "dq-reviews-page", children: [
    /* @__PURE__ */ c("header", { className: "dq-reviews-header", children: [
      /* @__PURE__ */ r("h1", { ref: h, tabIndex: -1, children: "Data Quality" }),
      /* @__PURE__ */ c("div", { className: "dq-reviews-header-actions", children: [
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: "dq-header-button",
            title: "Add the reviews in a review file",
            disabled: !l || d,
            onClick: () => {
              var I;
              return (I = R.current) == null ? void 0 : I.click();
            },
            children: [
              /* @__PURE__ */ r(fc, { "aria-hidden": "true" }),
              "Import"
            ]
          }
        ),
        /* @__PURE__ */ r(
          "input",
          {
            ref: R,
            type: "file",
            accept: "application/json,.json",
            hidden: !0,
            tabIndex: -1,
            onChange: (I) => {
              var J;
              const D = (J = I.target.files) == null ? void 0 : J[0];
              I.target.value = "", D && y(D);
            }
          }
        ),
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: "dq-header-button",
            title: "Download every review as one review file",
            disabled: !e.length,
            onClick: b,
            children: [
              /* @__PURE__ */ r(Ao, { "aria-hidden": "true" }),
              "Export all"
            ]
          }
        ),
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: "dq-header-button dq-header-button-primary",
            disabled: !l || d,
            onClick: m,
            children: [
              /* @__PURE__ */ r(Ka, { "aria-hidden": "true" }),
              "New review"
            ]
          }
        )
      ] })
    ] }),
    p,
    e.length ? /* @__PURE__ */ c("section", { className: "dq-reviews", "aria-label": "Reviews", children: [
      /* @__PURE__ */ c("div", { className: "dq-reviews-bar", children: [
        /* @__PURE__ */ c("p", { className: "dq-reviews-summary", children: [
          e.length === 1 ? "1 review" : `${e.length.toLocaleString()} reviews`,
          " ·",
          " ",
          s
        ] }),
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: _ ? e.some((I) => t[I.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
        /* @__PURE__ */ c("div", { className: "dq-reviews-sort", children: [
          /* @__PURE__ */ c("label", { children: [
            /* @__PURE__ */ r("span", { children: "Sort by" }),
            /* @__PURE__ */ c(
              "select",
              {
                className: "dq-select",
                value: n,
                onChange: (I) => i(I.target.value),
                children: [
                  /* @__PURE__ */ r("option", { value: "name", children: "Name" }),
                  /* @__PURE__ */ r("option", { value: "count", children: "Matching items" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-reviews-direction",
              "aria-label": `Sort direction: ${T}`,
              title: `Sort direction: ${T}`,
              onClick: () => o(a === "asc" ? "desc" : "asc"),
              children: a === "asc" ? /* @__PURE__ */ r(hc, { "aria-hidden": "true" }) : /* @__PURE__ */ r(pc, { "aria-hidden": "true" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ c("table", { className: "dq-reviews-table", children: [
        /* @__PURE__ */ r("thead", { children: /* @__PURE__ */ c("tr", { children: [
          /* @__PURE__ */ r("th", { scope: "col", "aria-sort": n === "name" ? T : void 0, children: "Review" }),
          /* @__PURE__ */ r("th", { scope: "col", className: "dq-reviews-type", children: "Type" }),
          /* @__PURE__ */ r(
            "th",
            {
              scope: "col",
              className: "dq-reviews-count",
              "aria-sort": n === "count" ? T : void 0,
              children: "Matching"
            }
          ),
          /* @__PURE__ */ r("th", { scope: "col", className: "dq-reviews-actions", children: /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Actions" }) })
        ] }) }),
        /* @__PURE__ */ r("tbody", { children: C.map((I) => {
          const D = Ke(I);
          return /* @__PURE__ */ c("tr", { children: [
            /* @__PURE__ */ r("td", { children: /* @__PURE__ */ c(
              "a",
              {
                className: "dq-reviews-link",
                href: `?review=${encodeURIComponent(I.id)}`,
                "data-review-id": I.id,
                onClick: (J) => {
                  J.button !== 0 || J.metaKey || J.ctrlKey || J.shiftKey || J.altKey || (J.preventDefault(), g(I.id));
                },
                children: [
                  /* @__PURE__ */ r("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ r(as, { entityType: D }) }),
                  /* @__PURE__ */ c("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ r("span", { className: "dq-reviews-name", children: I.name }),
                    I.description && /* @__PURE__ */ r("span", { className: "dq-reviews-description", title: I.description, children: I.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-type", children: rs[D] }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-count", children: /* @__PURE__ */ r(Ad, { review: I, count: t[I.id] }) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ r(si, { label: `Actions for ${I.name}`, items: N(I) }) })
          ] }, I.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ c("div", { className: "dq-empty", children: [
      /* @__PURE__ */ r(na, { "aria-hidden": "true" }),
      /* @__PURE__ */ r("p", { children: "No reviews yet." }),
      /* @__PURE__ */ r("p", { children: l ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function Es(e, { id: t, name: n, description: a }) {
  const i = { id: t, name: n, description: a }, o = (s, l = {}) => ({
    filter: { page: 1, perPage: 40, ...s },
    objectFilter: {},
    displayMode: "grid",
    searchMode: "text",
    ...l
  });
  switch (e) {
    case "tag":
      return {
        ...i,
        entityType: "tag",
        view: {
          ...o({ sort: "name", direction: "asc" }, { startFrom: "beginning" }),
          objectFilter: { tagGroupsCriterion: { value: [], modifier: "IS_NULL" } }
        },
        actions: []
      };
    case "audio":
      return {
        ...i,
        entityType: "audio",
        view: o({ sort: "date", direction: "desc" }, { startFrom: "end", reviewMode: "single" }),
        actions: []
      };
    case "performerOccurrence":
    case "audioPerformerOccurrence":
      return {
        ...i,
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
        ...i,
        entityType: "video",
        view: o({ sort: "date", direction: "desc" }, { startFrom: "end" }),
        actions: []
      };
  }
}
function Td({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: a
}) {
  const { review: i, duplicate: o, saving: s, error: l } = e, d = $(null), h = $(null), p = $(s);
  p.current = s;
  const g = $(null), m = xt();
  V(() => {
    var N;
    return g.current ?? (g.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), d.current && !d.current.open && d.current.showModal(), (N = h.current) == null || N.focus(), () => {
      var R;
      (R = g.current) != null && R.isConnected && g.current.focus({ preventScroll: !0 });
    };
  }, []);
  const y = $(s);
  V(() => {
    var C, _;
    const N = document.activeElement, R = !N || N === document.body || !((C = d.current) != null && C.contains(N));
    l && (!i.name.trim() || y.current && !s && R) && ((_ = h.current) == null || _.focus()), y.current = s;
  }, [l, s]);
  const b = () => {
    p.current || a();
  };
  return /* @__PURE__ */ r(
    "dialog",
    {
      ref: d,
      className: "dq-form-dialog",
      "aria-labelledby": m,
      "aria-modal": "true",
      onCancel: (N) => {
        N.preventDefault(), b();
      },
      onClose: () => {
        var N;
        p.current ? (N = d.current) == null || N.showModal() : a();
      },
      children: /* @__PURE__ */ c(
        "form",
        {
          onSubmit: (N) => {
            N.preventDefault(), p.current || n();
          },
          children: [
            /* @__PURE__ */ c("header", { className: "dq-form-dialog-header", children: [
              /* @__PURE__ */ r("h2", { id: m, children: o ? "Duplicate review" : "New review" }),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-icon-button",
                  "aria-label": "Close dialog",
                  title: "Close",
                  disabled: s,
                  onClick: b,
                  children: /* @__PURE__ */ r(kr, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ c("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ r("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              l && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: l }),
              /* @__PURE__ */ c("fieldset", { className: "dq-form-dialog-fields", disabled: s, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ r(
                  os,
                  {
                    review: i,
                    onChange: t,
                    entityTypeLocked: o,
                    onEntityTypeChange: (N) => {
                      !o && N !== Ke(i) && t(Es(N, i));
                    },
                    nameRef: h
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ c("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ r("button", { type: "button", className: "dq-text-button", onClick: () => oi(i), children: "Export draft" }),
              /* @__PURE__ */ r("span", { className: "dq-form-dialog-space" }),
              /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: s, onClick: b, children: "Cancel" }),
              /* @__PURE__ */ r("button", { type: "submit", className: "dq-button primary", "aria-disabled": s || void 0, children: s ? "Creating…" : "Create & configure" })
            ] })
          ]
        }
      )
    }
  );
}
function Rd(e) {
  var l, d, h;
  const [t, n] = S({}), [a, i] = S(""), o = (((l = e == null ? void 0 : e.presentation) == null ? void 0 : l.annotations) ?? []).includes("tags") ? ((d = e == null ? void 0 : e.presentation) == null ? void 0 : d.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...o,
      ...((h = e == null ? void 0 : e.presentation) == null ? void 0 : h.binParents) ?? []
    ])
  ]);
  return V(() => {
    let p = !0;
    return n({}), i(""), Promise.all(
      JSON.parse(s).map(
        async (g) => [g, await ia([g])]
      )
    ).then((g) => {
      p && n(Object.fromEntries(g));
    }).catch(() => {
      p && i(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      p = !1;
    };
  }, [s]), { ids: t, error: a };
}
function Id(e, t, n) {
  const a = t == null ? void 0 : t.presentation, i = (a == null ? void 0 : a.annotations) ?? [], o = (a == null ? void 0 : a.annotationParents) ?? [];
  return {
    ...e,
    details: void 0,
    organized: !1,
    groups: [],
    galleries: [],
    date: i.includes("date") ? e.date : void 0,
    studioId: i.includes("studio") ? e.studioId : void 0,
    studioName: i.includes("studio") ? e.studioName : void 0,
    performers: i.includes("performers") ? e.performers : [],
    tags: i.includes("tags") && o.length > 0 ? (e.tags ?? []).filter(
      (s) => o.some(
        (l) => {
          var d;
          return l !== s.id && ((d = n[l]) == null ? void 0 : d.includes(s.id));
        }
      )
    ) : []
  };
}
function $d({
  videos: e,
  review: t,
  savedObjectFilter: n,
  trees: a,
  disabled: i,
  onToggle: o
}) {
  var b;
  const s = ((b = t.presentation) == null ? void 0 : b.binParents) ?? [], l = new Set(
    s.flatMap((N) => (a[N] ?? []).filter((R) => R !== N))
  ), d = s.every((N) => a[N]), h = Cs(t.view.objectFilter, n).bins.filter(
    (N) => !d || l.has(N)
  ), p = /* @__PURE__ */ new Map();
  for (const N of e)
    for (const R of N.tags ?? [])
      if (l.has(R.id)) {
        const C = p.get(R.id) ?? { name: R.name, count: 0 };
        C.count++, p.set(R.id, C);
      }
  const g = h.filter((N) => !p.has(N)), m = sr(g);
  for (const N of g)
    p.set(N, {
      name: m[N] === void 0 ? "…" : m[N] ?? "Unavailable tag",
      count: 0
    });
  if (!s.length) return null;
  const y = [...p].sort((N, R) => N[1].name.localeCompare(R[1].name));
  return /* @__PURE__ */ c("div", { className: "dq-bins", role: "group", "aria-label": "Tag bins on this page", children: [
    /* @__PURE__ */ r("span", { className: "dq-bins-label", "aria-hidden": "true", children: "On this page" }),
    y.map(([N, R]) => {
      const C = h.includes(N);
      return /* @__PURE__ */ c(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": C,
          title: C ? `Show every video again, not only ${R.name}` : `Show only videos tagged ${R.name}`,
          disabled: i,
          onClick: () => o(N),
          children: [
            C && /* @__PURE__ */ r(Va, { "aria-hidden": "true" }),
            R.name,
            " ",
            /* @__PURE__ */ r("span", { className: "dq-bin-count", children: R.count })
          ]
        },
        N
      );
    }),
    !y.length && /* @__PURE__ */ r("span", { className: "dq-bins-empty", children: "No matching tag bins on this page." })
  ] });
}
function Jn(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Od(e) {
  if (!Jn(e) || Object.keys(e).length !== 1 || !Jn(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !Jn(t.tagsCriterion)) return null;
  const { value: n, modifier: a, depth: i, ...o } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && a === "INCLUDES" && i === 0 && !Object.keys(o).length ? n[0] : null;
}
function Cs(e, t) {
  let n = e;
  const a = [];
  for (; ; ) {
    if (t && or(n, t)) {
      n = t;
      break;
    }
    const i = Object.keys(n);
    if (i.length !== 1 || i[0] !== "_filterExpression") break;
    const o = n._filterExpression;
    if (!Jn(o) || o.operator !== "AND" || !Array.isArray(o.children))
      break;
    const s = o.children, l = Od(s.at(-1));
    if (l == null || s.length > 3) break;
    let d = {}, h = null, p = !0;
    for (const [g, m] of s.slice(0, -1).entries())
      !Jn(m) || Object.keys(m).length !== 1 ? p = !1 : g === 0 && Jn(m.filter) && Object.keys(m.filter).length ? d = m.filter : !h && Jn(m.group) ? h = m.group : p = !1;
    if (!p) break;
    a.unshift(l), n = h ? { ...d, _filterExpression: h } : d;
  }
  return { base: n, bins: a };
}
function Md(e, t, n) {
  const { base: a, bins: i } = Cs(e.view.objectFilter, n);
  return (i.includes(t) ? i.filter((s) => s !== t) : [...i, t]).reduce(Fd, { ...e, view: { ...e.view, objectFilter: a } });
}
function Fd(e, t) {
  const { _filterExpression: n, ...a } = e.view.objectFilter;
  return {
    ...e,
    view: {
      ...e.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...Object.keys(a).length ? [{ filter: a }] : [],
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
const xd = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function no(e, t, n) {
  return {
    ...e,
    view: {
      ...e.view,
      filter: { ...n, page: 1 },
      objectFilter: t.view.objectFilter,
      searchMode: t.view.searchMode
    }
  };
}
const Sa = 180;
function ro(e) {
  return Ke(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function ao(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Ea() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function io(e) {
  const t = new URLSearchParams(window.location.search);
  sa.forEach((a) => t.delete(a)), e ? t.set("review", e) : t.delete("review");
  const n = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${n ? `?${n}` : ""}`
  );
}
function Pd(e) {
  return Et({ ...e, page: 1 });
}
function As(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function er(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Ld = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(Ba, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ r(bc, { "aria-hidden": "true" }) }
], Dd = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(Ba, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ r(gc, { "aria-hidden": "true" }) }
], _d = [], ks = "(min-width: 900px)";
function jd(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(ks);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function Ud() {
  return typeof window.matchMedia == "function" && window.matchMedia(ks).matches;
}
function Gd({
  onNavigate: e
}) {
  const [t, n] = S([]), [a] = S(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [i, o] = S(""), [s, l] = S(!0), [d, h] = S(""), [p, g] = S(!1), [m, y] = S(!1), [b, N] = S(!1), [R, C] = S(!1), [_, T] = S([]), [I, D] = S(""), [J, Q] = S(!0), [P, ne] = S("account"), [pe, re] = S(""), [A, O] = S(""), [L, ee] = S(!1), [ae, le] = S(!1), [ue, ge] = S(""), [E, j] = S(Ea), [te, Ce] = S({}), Oe = $(te);
  Oe.current = te;
  const [ft, vt] = S(!E);
  ft !== !E && (vt(!E), E || Ce({}));
  const [ct, An] = S("name"), [on, Je] = S("asc"), Xe = $(null), H = $(null), [Ne, Ae] = S(null), [It, Nt] = S(!1), [rt, ye] = S(null), [at, lt] = S(null), je = !!rt || !!at, zt = $(je);
  zt.current = je;
  const ke = It || !!at, [Wt, sn] = S(0), [Y, ht] = S(null), cn = $(null), Qt = $(null), _n = $(null), [Pe, He] = S(
    null
  ), X = t.find((u) => u.id === E) ?? null, x = Te(
    () => (Pe == null ? void 0 : Pe.id) === E && X ? { ...X, view: {
      ...X.view,
      filter: Pe.view.filter,
      objectFilter: Pe.view.objectFilter,
      searchMode: Pe.view.searchMode,
      startFrom: Pe.view.startFrom
    } } : X,
    [Pe, E, X]
  ), we = x ? Ke(x) : "video", Le = Qa(we), kn = x ? ve(x) : !1, Z = we === "video" ? x : null, qt = kn && !!(x != null && x.actions.some(Pn)), Pt = !!Z || we === "audio" || qt, [$t, Ht] = S(null), ln = ($t == null ? void 0 : $t.id) === (x == null ? void 0 : x.id) ? $t == null ? void 0 : $t.mode : (x == null ? void 0 : x.view.reviewMode) ?? "single", qe = kn || we === "audio" || we === "video" && ln === "single", [pt, Ct] = S(0), it = $(-1), De = $(!1);
  V(() => {
    const u = () => {
      if (!qe && un.current) {
        De.current = !0;
        return;
      }
      it.current = -1, j(Ea()), qe || Ct((w) => w + 1);
    };
    return window.addEventListener("popstate", u), () => window.removeEventListener("popstate", u);
  }, [qe]);
  const mt = Le === "audio" ? m : p, Yt = we === "tag" ? "Tag" : Le === "audio" ? "Audio" : "Video", Ot = we === "tag" ? b : mt, Lt = $(
    null
  ), Ze = Rd(Z), [Se, At] = S({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Tn, Xt] = S({
    page: 1,
    perPage: 40
  }), [et, Mt] = S({ items: [], totalCount: 0 }), [q, M] = S(E);
  q !== E && (M(E), Mt({ items: [], totalCount: 0 }), le(!1));
  const [U, ce] = S(!1), [oe, Me] = S(""), [_e, kt] = S(!1), [Dt, be] = S(!1), [ze, Fe] = S(() => /* @__PURE__ */ new Set()), Zt = $(ze);
  Zt.current = ze;
  const tt = $(/* @__PURE__ */ new Map()), gn = (x == null ? void 0 : x.view.selectAllOnLoad) === !0, [We, ot] = S(null), dt = $(We);
  dt.current = We;
  const [gt, bt] = S(!1), _t = $(gt);
  _t.current = gt;
  const cr = $(null), [bn, en] = S(!1), [dn, lr] = S("grid"), [Qn, wt] = S(Sa), [Ee, Rn] = S(!1), un = $(!1), [$r, dr] = S(""), [Ue, tn] = S(""), [ur, jt] = S(""), [Ie, wn] = S(null), [Or, jn] = S(""), [Un, In] = S(!1), [$n, On] = S({}), Gn = $(/* @__PURE__ */ new Map()), Mr = $(null), yn = $(null), Mn = !!x, ca = co(jd, Ud, () => !1) && Mn, [fr, Fr] = S({ top: 0, bottom: 0 });
  pn(() => {
    if (!Mn) return;
    const u = () => {
      const k = yn.current;
      if (!k) return;
      const G = Math.round(k.getBoundingClientRect().top + window.scrollY), z = k.closest("main"), B = z ? Math.round(parseFloat(getComputedStyle(z).paddingBottom) || 0) : 0;
      Fr(
        (fe) => fe.top === G && fe.bottom === B ? fe : { top: G, bottom: B }
      );
    };
    u();
    const w = typeof ResizeObserver > "u" ? null : new ResizeObserver(u);
    return w == null || w.observe(document.body), window.addEventListener("resize", u), () => {
      w == null || w.disconnect(), window.removeEventListener("resize", u);
    };
  }, [Mn]);
  const [xr, Pr] = S(0), hr = $(null), Lr = Nn((u) => {
    var k;
    if ((k = hr.current) == null || k.disconnect(), hr.current = null, !u || typeof ResizeObserver > "u") return;
    const w = new ResizeObserver(
      () => Pr(Math.round(u.getBoundingClientRect().height))
    );
    w.observe(u), hr.current = w;
  }, []), Ut = $(0), f = $(0), v = $(null), F = $(null), K = Yo(
    x && !qe ? Y ? [...x.actions, ...Y.draft.actions] : x.actions : _d
  ), W = Te(
    () => Y && x ? no(Y.draft, x, Se) : null,
    [Y, x, Se]
  ), de = Te(
    () => W != null && Cr(W) !== (Y == null ? void 0 : Y.baseline),
    [W, Y == null ? void 0 : Y.baseline]
  );
  V(() => {
    if (!Ue) return;
    const u = window.setTimeout(() => tn(""), 4e3);
    return () => window.clearTimeout(u);
  }, [Ue]), V(() => {
    if (!Ne || Ne.alert) return;
    const u = window.setTimeout(() => Ae(null), 6e3);
    return () => window.clearTimeout(u);
  }, [Ne]), V(() => {
    const u = Z ? di(Z.view.objectFilter) : [];
    if (On({}), !u.length) return;
    const w = new AbortController();
    let k = !0;
    return Promise.all(
      u.map(async (G) => {
        var z;
        try {
          const B = await ie(`/api/tags/${G}`, {
            signal: w.signal
          });
          return (z = B.name) != null && z.trim() ? [String(G), B.name] : null;
        } catch {
          return null;
        }
      })
    ).then((G) => {
      k && On(
        Object.fromEntries(G.filter((z) => z !== null))
      );
    }), () => {
      k = !1, w.abort();
    };
  }, [Z == null ? void 0 : Z.id, Z == null ? void 0 : Z.view.objectFilter]);
  const Be = Te(
    () => Z ? ui(
      Z.view.objectFilter,
      $n
    ) : (x == null ? void 0 : x.view.objectFilter) ?? {},
    [$n, x, Z]
  ), St = Nn(async () => {
    l(!0), h("");
    try {
      const u = await Oc();
      n(u.reviews), o(u.storageKey), g(u.canWriteVideos ?? u.canWrite), y(u.canWriteAudios ?? !1), N(u.canWriteTags ?? !1), C(u.canReadTagGroups ?? !1), Q(u.canConfigure ?? !0), ne(u.storage ?? "account"), re(u.storageNotice ?? ""), E && !u.reviews.some((w) => w.id === E) && (j(""), io(""));
    } catch (u) {
      h(
        u instanceof Error ? u.message : "Could not load reviews."
      );
    } finally {
      l(!1);
    }
  }, [E]);
  V(() => {
    if (!R) {
      T([]), D("");
      return;
    }
    const u = new AbortController();
    return D(""), Kc(u.signal).then(T).catch((w) => {
      u.signal.aborted || D(
        w instanceof Error ? w.message : "Could not load tag groups."
      );
    }), () => u.abort();
  }, [R]), V(() => {
    St();
  }, []), V(() => {
    if (E || t.length === 0) return;
    const u = new AbortController();
    for (const w of t) {
      if (typeof Oe.current[w.id] == "number") continue;
      (ve(w) ? fi(w, u.signal).then((G) => (G == null ? void 0 : G.length) === 0 ? { items: [], totalCount: 0 } : vr(hi(w, G), { ...w.view.filter, page: 1, perPage: 1 }, u.signal)) : Ke(w) === "tag" ? Fi(
        w,
        Et({ ...w.view.filter, page: 1, perPage: 1 }),
        u.signal
      ) : vr(
        w,
        Et({ ...w.view.filter, page: 1, perPage: 1 }),
        u.signal
      )).then((G) => {
        u.signal.aborted || Ce((z) => ({
          ...z,
          [w.id]: G.totalCount
        }));
      }).catch(() => {
        u.signal.aborted || Ce((G) => ({ ...G, [w.id]: null }));
      });
    }
    return () => u.abort();
  }, [E, t]), pn(() => {
    var k, G;
    const u = H.current;
    if (E || s || !u) return;
    H.current = null, (G = (u === "heading" ? null : [...((k = yn.current) == null ? void 0 : k.querySelectorAll("[data-review-id]")) ?? []].find(
      (z) => z.dataset.reviewId === u.reviewId
    )) ?? Xe.current) == null || G.focus();
  }, [E, s, at, t]);
  const fn = $(0), nt = Nn(async () => {
    const u = ++fn.current;
    wn(null), jn("");
    try {
      const w = await (qt ? _o(Le) : Do(Le));
      u === fn.current && wn(w);
    } catch (w) {
      if (u !== fn.current) return;
      wn(null), jn(
        "Tag assessment setup could not be checked. " + (w instanceof Error ? w.message : "Request failed.")
      );
    }
  }, [qt, Le]);
  V(() => {
    nt();
  }, [nt]);
  const st = Nn(
    async (u, w, k = !1, G = !1) => {
      var Rt, $e;
      const z = ++Ut.current;
      (Rt = v.current) == null || Rt.abort();
      const B = new AbortController();
      v.current = B, w = Et(w);
      const fe = Number(w.page);
      k && (w = { ...w, page: 1 }), At(w), be(k), ce(!0), Me("");
      try {
        const Ge = (vn) => Ke(u) === "tag" ? Fi(
          u,
          vn,
          B.signal
        ) : vr(
          u,
          vn,
          B.signal
        );
        let he = await Ge(w);
        const Qe = Math.max(
          1,
          Math.ceil(he.totalCount / Number(w.perPage))
        ), Yn = k ? Qe : Math.min(fe, Qe);
        return Number(w.page) !== Yn && (w = { ...w, page: Yn }, he = await Ge(w)), z === Ut.current && ((($e = F.current) == null ? void 0 : $e.page) !== Yn && (F.current = {
          page: Yn,
          ids: new Set(he.items.map((vn) => vn.id))
        }), Mt(he), G && Gt(
          () => new Set(he.items.map((vn) => vn.id))
        ), At(w), Xt(w)), he;
      } catch (Ge) {
        throw z === Ut.current && Me(
          Ge instanceof Error ? Ge.message : "Could not load the review queue."
        ), Ge;
      } finally {
        z === Ut.current && ce(!1);
      }
    },
    []
  );
  V(() => {
    var w;
    if (f.current += 1, it.current = -1, Ut.current += 1, (w = v.current) == null || w.abort(), ht(null), cn.current = null, le(!1), ge(""), O(""), ee(!1), Fe(/* @__PURE__ */ new Set()), tt.current.clear(), ot(null), bt(!1), Rn(!1), un.current = !1, dr(""), tn(""), jt(""), Mt({ items: [], totalCount: 0 }), F.current = null, kt(!1), !x || qe) {
      ce(!1);
      return;
    }
    let u = !0;
    return ce(!0), (async () => {
      let k = X ?? x;
      He(null);
      let G = null;
      const z = new URLSearchParams(window.location.search);
      if (Ke(x) === "video" && sa.some(($e) => z.has($e)))
        try {
          const $e = k;
          G = _a($e, z);
          const Ge = hn($e, G.query);
          (G.query.startFrom !== ($e.view.startFrom ?? "end") || !or(
            JSON.parse(Vt(Ge)),
            JSON.parse(Vt(hn($e, nr($e))))
          )) && (k = Ge, He(k));
        } catch ($e) {
          kt(!0), Me($e instanceof Error ? $e.message : "Could not read review URL."), ce(!1);
          return;
        }
      let B = null;
      try {
        B = await xc(i, x.id);
      } catch ($e) {
        u && (ee(!0), O(
          $e instanceof Error ? $e.message : "Could not load progress."
        ));
      }
      if (!u) return;
      const fe = (B == null ? void 0 : B.signature) === Vt(k) ? B : null, Rt = G ? G.query.filter : fe ? Et(fe.filter) : Pd(k.view.filter);
      At(Rt), lr(
        fe ? ao(fe.displayMode, Ke(x)) : ro(x)
      ), wt(
        fe ? fe.cardSize ?? Sa : Sa
      );
      try {
        const $e = await st(
          k,
          Rt,
          G ? G.startAtEnd : !fe && k.view.startFrom !== "beginning",
          k.view.selectAllOnLoad === !0
        );
        if (!u) return;
        const Ge = Ii(
          $e.items.map((he) => he.id),
          (fe == null ? void 0 : fe.focusedId) ?? null,
          (fe == null ? void 0 : fe.index) ?? 0
        );
        ot(Ge), Ye(Ge);
      } catch {
      }
      u && (it.current = pt, le(!0), ge(`${x.id}:${pt}`));
    })(), () => {
      var k;
      u = !1, f.current++, Ut.current++, (k = v.current) == null || k.abort();
    };
  }, [x == null ? void 0 : x.id, qe, pt]), V(() => {
    if (!(!Wt || qe || !x)) {
      if (_e) {
        sn(0);
        return;
      }
      Ee || Y || ue !== `${x.id}:${pt}` || (sn(0), ha());
    }
  }, [Wt, qe, x == null ? void 0 : x.id, ue, Ee, pt, _e]), V(() => {
    !Z || qe || !ae || U || oe || Ee || De.current || it.current !== pt || Nr(Z.id, {
      filter: Se,
      objectFilter: Z.view.objectFilter,
      searchMode: Z.view.searchMode,
      startFrom: Z.view.startFrom ?? "end"
    });
  }, [Z, qe, ae, U, oe, Se, Ee, pt]);
  const se = Te(
    () => et.items.map((u) => u.id),
    [et.items]
  );
  V(() => {
    if (!ae || !x || !i || U || oe || Ee || (Pe == null ? void 0 : Pe.id) === x.id || L || it.current !== pt)
      return;
    const u = {
      version: 1,
      signature: Vt(x),
      filter: Se,
      focusedId: We,
      index: Math.max(0, se.indexOf(We ?? -1)),
      displayMode: dn,
      cardSize: Qn,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        i + ":progress:" + x.id,
        JSON.stringify(u)
      );
    } catch {
    }
    if (A) return;
    let w = !0;
    const k = window.setTimeout(() => {
      Pc(i, x.id, u).catch((G) => {
        w && O(
          "Progress is kept in this browser, but account sync failed. " + (G instanceof Error ? G.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      w = !1, window.clearTimeout(k);
    };
  }, [
    ae,
    i,
    x,
    U,
    oe,
    Ee,
    Se,
    We,
    se,
    dn,
    Qn,
    Pe,
    A,
    L,
    pt
  ]);
  const pr = et.items.find((u) => u.id === We) ?? null, xe = we === "video" ? pr : null;
  gt && xe && (cr.current = xe);
  const yt = xe ?? (gt ? cr.current : null), Dr = $i(ze, We), la = se.length > 0 && se.every((u) => ze.has(u)), Ye = Nn((u, w = !0) => {
    u != null && window.requestAnimationFrame(() => {
      var G;
      if (zt.current || Ac(document.activeElement) || (G = document.activeElement) != null && G.closest(".dq-drawer"))
        return;
      const k = Gn.current.get(u);
      k == null || k.focus({ preventScroll: !0 }), w && (k == null || k.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  V(() => {
    ae && !_t.current && Ye(dt.current);
  }, [ae, Ye]), V(() => {
    U || !se.length || (dt.current == null || !se.includes(dt.current)) && (ot(se[0]), _t.current || Ye(se[0]));
  }, [Ye, se, U]);
  const Gt = Nn(
    (u) => {
      Fe((w) => {
        const k = u(w);
        for (const G of /* @__PURE__ */ new Set([...w, ...k]))
          w.has(G) !== k.has(G) && tt.current.set(
            G,
            (tt.current.get(G) ?? 0) + 1
          );
        return k;
      });
    },
    []
  ), Kn = Nn(
    (u) => {
      if (!se.length) return;
      const w = Math.max(
        0,
        se.indexOf(dt.current ?? se[0])
      ), k = se[Math.max(0, Math.min(se.length - 1, w + u))];
      ot(k), _t.current || Ye(k);
    },
    [Ye, se]
  ), Fn = Nn(
    async (u) => {
      const w = "steps" in u ? u.steps.length > 0 : u.effect.mode !== "SKIP", k = "effect" in u && u.effect.mode === "SET_TAG_GROUP" ? u.effect.tagGroupId : null, G = k != null && (!R || !_.some((Ve) => Ve.id === k)), z = "effect" in u && w && !R, B = $i(
        Zt.current,
        dt.current
      );
      if (!x || un.current || U || oe) return;
      const fe = w && !Ot ? `${Yt} write permission is required to apply ${u.label}.` : z || G ? `${u.label} needs a tag group that is unavailable.` : Pn(u) && (Ie == null ? void 0 : Ie.kind) !== "ready" ? `Set up tag assessments before applying ${u.label}.` : B.length ? "" : `Select or focus a ${we} before applying ${u.label}.`;
      if (fe) {
        jt(fe);
        return;
      }
      const Rt = ++f.current, $e = x.id, Ge = [...se], he = et, Qe = dt.current, Yn = new Set(Zt.current), vn = new Map(
        B.map((Ve) => [Ve, tt.current.get(Ve) ?? 0])
      ), Xn = () => Rt === f.current && x.id === $e;
      un.current = !0, Rn(!0), dr(
        Zt.current.size ? `${B.length} selected ${we}s` : `the focused ${we}`
      ), tn(""), jt("");
      const Ci = he.items.filter(
        (Ve) => !B.includes(Ve.id)
      ), Gs = Ci.map((Ve) => Ve.id), Ai = Oi(
        Ge,
        Gs,
        Qe,
        B.includes(Qe ?? -1)
      );
      Mt({
        items: Ci,
        totalCount: he.totalCount
      }), Fe((Ve) => {
        const Ft = new Set(Ve);
        for (const nn of B) Ft.delete(nn);
        return Ft;
      }), ot(Ai), _t.current || Ye(Ai);
      let pa = !1;
      try {
        if ("effect" in u ? await Zc(u, B) : await Uo(Le, u, B), pa = !0, !Xn()) return;
        Fe((Ve) => {
          const Ft = new Set(Ve);
          for (const nn of B)
            (tt.current.get(nn) ?? 0) === vn.get(nn) && Ft.delete(nn);
          return Ft;
        }), tn(
          `${u.label}: ${B.length} ${we}${B.length === 1 ? "" : "s"} ${w ? "updated" : "skipped"}.`
        );
      } catch (Ve) {
        if (!Xn()) return;
        Mt(he), Fe((Ft) => {
          const nn = new Set(Ft);
          for (const Kt of B)
            Yn.has(Kt) && (tt.current.get(Kt) ?? 0) === vn.get(Kt) && nn.add(Kt);
          return nn;
        }), ot(Qe), _t.current || Ye(Qe), jt(
          Ve instanceof Error ? Ve.message : "Action failed."
        );
      }
      try {
        if (await Jc(u), !Xn()) return;
        const Ve = new Set(B), Ft = gn && Ge.length > 0 && Ge.every((rn) => Ve.has(rn)), nn = await st(x, Se, !1, Ft);
        if (!Xn()) return;
        let Kt = nn.items.map((rn) => rn.id);
        const Ur = F.current, Ks = (Ur == null ? void 0 : Ur.page) === Number(Se.page) && Kt.some((rn) => Ur.ids.has(rn)), Bs = (x.view.startFrom ?? "end") !== "beginning";
        if (nn.totalCount > 0 && Number(Se.page) > 1 && (!Kt.length || Bs && !Ks)) {
          const rn = Math.max(1, Number(Se.page) - 1), Gr = { ...Se, page: rn };
          At(Gr), Kt = (await st(
            x,
            Gr,
            !1,
            Ft
          )).items.map((ma) => ma.id), Fe(
            (ma) => new Set([...ma].filter((Vs) => Kt.includes(Vs)))
          );
          const Ti = Kt.at(-1) ?? null;
          ot(Ti), _t.current || Ye(Ti);
        } else {
          Fe(
            (Gr) => new Set([...Gr].filter((ki) => Kt.includes(ki)))
          );
          const rn = Oi(
            Ge,
            Kt,
            Qe,
            pa && B.includes(Qe ?? -1)
          );
          ot(rn), _t.current && rn == null && bt(!1), _t.current || Ye(rn);
        }
      } catch (Ve) {
        Xn() && jt(
          (Ft) => `${Ft ? `${Ft} ` : ""}${pa ? "The action completed, but " : ""}the queue could not be refreshed. ${Ve instanceof Error ? Ve.message : "Refresh failed."}`
        );
      } finally {
        Xn() && (un.current = !1, Rn(!1), dr(""), De.current && (De.current = !1, j(Ea()), Ct((Ve) => Ve + 1)));
      }
    },
    [
      Ot,
      R,
      _,
      we,
      Ie,
      st,
      Se,
      Ye,
      se,
      et,
      U,
      oe,
      x
    ]
  );
  function Tt() {
    var k;
    if (dn === "list") return 1;
    const u = (k = Mr.current) == null ? void 0 : k.firstElementChild, w = u ? getComputedStyle(u).gridTemplateColumns : "";
    return Math.max(1, w.split(" ").filter(Boolean).length);
  }
  const mr = $(() => {
  });
  mr.current = (u) => {
    var B;
    if (qe || u.defaultPrevented || u.repeat || u.ctrlKey || u.altKey || u.metaKey || je) return;
    const w = u.target, k = w instanceof Node && ((B = yn.current) == null ? void 0 : B.contains(w)) === !0, G = w === document.body || w === document.documentElement;
    if (!k && !G) return;
    if (bn) {
      u.key === "Escape" && (er(u), en(!1));
      return;
    }
    if (gt && u.key === "Escape") {
      er(u), bt(!1), Ye(dt.current);
      return;
    }
    if (!Cc(w)) return;
    const z = Ec(w);
    if (u.key === "Escape") {
      er(u), Gt(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!gt && u.key === " " && z) {
      er(u), We != null && Gt((fe) => zr(fe, We));
      return;
    }
    if (!(Ee || U) && !gt && u.key === "Enter" && We != null && z) {
      if (we !== "tag" && Y) return;
      er(u), we === "tag" ? window.open(`/tag/${We}`, "_blank", "noopener,noreferrer") : bt(!0);
      return;
    }
  }, V(() => {
    const u = (w) => mr.current(w);
    return document.addEventListener("keydown", u), () => document.removeEventListener("keydown", u);
  }, []);
  const gi = $(
    () => {
    }
  );
  gi.current = (u) => {
    var B;
    if (qe || je || gt || bn || Ee || U || !se.length || u.defaultPrevented || u.repeat || u.ctrlKey || u.altKey || u.metaKey)
      return;
    const w = u.target, k = w instanceof Node && ((B = yn.current) == null ? void 0 : B.contains(w)) === !0, G = w === document.body || w === document.documentElement;
    if (!k && !G || !u.key.startsWith("Arrow") || !kc(w)) return;
    const z = Tc(u.key, Tt());
    z && (u.preventDefault(), k ? u.stopImmediatePropagation() : u.stopPropagation(), Kn(z));
  }, V(() => {
    const u = (w) => gi.current(w);
    return document.addEventListener("keydown", u), () => document.removeEventListener("keydown", u);
  }, []);
  const _r = (Y == null ? void 0 : Y.saving) === !0, da = Ee || U && !ae || _r, Ts = Dn();
  ti({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!x && !qe && !je && !Y && !gt && !bn && !oe && (et.items.length > 0 || U || Ee),
    actionCount: (x == null ? void 0 : x.actions.length) ?? 0,
    onAction: (u) => {
      const w = x == null ? void 0 : x.actions[u];
      w && Fn(w);
    },
    onFind: () => en(!0),
    onSelectAll: () => Gt((u) => Sc(u, se))
  }), V(() => en(!1), [qe, gt, x == null ? void 0 : x.id]);
  function bi(u) {
    const w = "steps" in u ? u.steps.length > 0 : u.effect.mode !== "SKIP", k = "effect" in u && u.effect.mode === "SET_TAG_GROUP" ? u.effect.tagGroupId : null, G = k != null && !_.some((z) => z.id === k);
    return Ee || U || !!oe || w && !Ot || "effect" in u && w && (!R || G) || Pn(u) && (Ie == null ? void 0 : Ie.kind) !== "ready" || !Dr.length;
  }
  function jr(u) {
    Ht(null), sn(0), Ae(null), j(u), io(u);
  }
  function ua() {
    H.current = "heading", jr("");
  }
  function wi(u) {
    u !== E && jr(u), sn((w) => w + 1);
  }
  function yi(u) {
    Ae(null), ye({
      review: u ? { ...structuredClone(u), id: crypto.randomUUID(), name: `${u.name} copy` } : Es("video", { id: crypto.randomUUID(), name: "", description: "" }),
      duplicate: !!u,
      saving: !1,
      error: ""
    });
  }
  async function Rs() {
    if (!rt || rt.saving) return;
    const u = { ...rt.review, name: rt.review.name.trim() }, w = Er(u);
    if (w) {
      ye({ ...rt, error: w });
      return;
    }
    ye({ ...rt, saving: !0, error: "" });
    try {
      if (!await Hn([...t, u])) throw new Error("Could not save reviews.");
      ye(null), wi(u.id);
    } catch (k) {
      ye(
        (G) => G && {
          ...G,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + (k instanceof Error ? k.message : "Retry saving.")
        }
      );
    }
  }
  async function Is() {
    if (!at || at.pending) return;
    const u = at.review, w = Ss(t, te, ct, on).map((z) => z.id), k = w.filter((z) => z !== u.id), G = k[Math.min(w.indexOf(u.id), k.length - 1)];
    lt({ review: u, pending: !0 });
    try {
      if (!await Hn(t.filter((z) => z.id !== u.id)))
        throw new Error("Could not save reviews.");
      H.current = u.id !== E && G ? { reviewId: G } : "heading", Ae({ text: `Deleted “${u.name}”.`, alert: !1 });
    } catch (z) {
      Ae({ text: `“${u.name}” was not deleted. ${vi(z)}`, alert: !0 });
    } finally {
      lt(null);
    }
  }
  async function $s(u) {
    if (!(ke || !J)) {
      Ae(null), Nt(!0);
      try {
        const w = await Pl(u), k = Aa(t, w), G = k.length - t.length, z = w.length - G;
        if (G && !await Hn(k)) throw new Error("Could not save reviews.");
        Ae({
          alert: !1,
          text: w.length ? G ? `Imported ${G === 1 ? "1 review" : `${G} reviews`}.` + (z === 1 ? " 1 review already in the list stays as it is." : z ? ` ${z} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (w) {
        Ae({ alert: !0, text: `Could not import “${u.name}”. ${vi(w)}` });
      } finally {
        Nt(!1);
      }
    }
  }
  function vi(u) {
    return u instanceof Io ? "Reviews changed in another browser. Reload the page to get them, then try again." : u instanceof Error ? u.message : "Try again.";
  }
  function Ni(u) {
    const w = !J || ke;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ r(go, { "aria-hidden": "true" }),
        disabled: w,
        onSelect: () => yi(u)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ r(Ao, { "aria-hidden": "true" }),
        onSelect: () => oi(u)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ r(bo, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: w,
        onSelect: () => {
          Ae(null), lt({ review: u, pending: !1 });
        }
      }
    ];
  }
  function qi(u, w) {
    return [
      { label: "Edit review", icon: /* @__PURE__ */ r(rr, { "aria-hidden": "true" }), ...w },
      ...Ni(u),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ r(Tr, { "aria-hidden": "true" }),
        separated: !0,
        onSelect: ua
      }
    ];
  }
  async function Hn(u) {
    if (!i) return !1;
    const w = u.map(Bd);
    try {
      await Fc(i, w);
    } catch (G) {
      throw G;
    }
    n(w), E && !w.some((G) => G.id === E) && jr("");
    const k = w.find((G) => G.id === E);
    return k && Ht(null), k && X && JSON.stringify(k) !== JSON.stringify(X) && (k.view.displayMode !== X.view.displayMode && lr(ro(k)), Vt(k) !== Vt(X) && (He(null), Ke(k) === "video" && Nr(k.id, {
      filter: Et(k.view.filter),
      objectFilter: k.view.objectFilter,
      searchMode: k.view.searchMode,
      startFrom: k.view.startFrom ?? "end"
    }), qe || gr(
      k,
      Et({ ...k.view.filter, page: Se.page })
    ))), !0;
  }
  if (s)
    return /* @__PURE__ */ r(oo, { label: "Loading reviews…" });
  if (d)
    return /* @__PURE__ */ c(me, { children: [
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          onClick: () => void Qd().catch(
            (u) => h(
              "Could not export browser reviews. " + (u instanceof Error ? u.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ r(
        so,
        {
          message: d,
          onRetry: () => void St()
        }
      )
    ] });
  const fa = /* @__PURE__ */ c(me, { children: [
    pe && /* @__PURE__ */ r("p", { className: "dq-status", children: pe }),
    Pt && (Ie == null ? void 0 : Ie.kind) === "missing" && /* @__PURE__ */ c("div", { role: "status", className: "dq-status", children: [
      Ie.message,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: Un,
          onClick: () => {
            In(!0), jn(""), (qt ? Qc(Le) : Wc(Le)).then(nt).catch(
              (u) => jn(
                `Could not create the ${qt ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (u instanceof Error ? u.message : "Request failed.")
              )
            ).finally(() => In(!1));
          },
          children: Un ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    Pt && ((Ie == null ? void 0 : Ie.kind) === "incompatible" || Or) && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(Vn, {}),
      Or || (Ie == null ? void 0 : Ie.message),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: Un,
          onClick: () => {
            In(!0), nt().finally(
              () => In(!1)
            );
          },
          children: Un ? "Checking…" : "Check again"
        }
      )
    ] }),
    a && /* @__PURE__ */ c("details", { children: [
      /* @__PURE__ */ r("summary", { children: "Unassigned legacy browser reviews" }),
      /* @__PURE__ */ r("p", { children: "These old reviews have no account owner. They have not been copied into this account. Export them for recovery, then import the reviews only into the intended account. The original data and deletion history stay in this browser." }),
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const u = localStorage.getItem("page-videos") ?? "[]", w = URL.createObjectURL(
              new Blob([u], { type: "application/json" })
            ), k = document.createElement("a");
            k.href = w, k.download = "data-quality-unassigned-legacy-reviews.json", k.click(), URL.revokeObjectURL(w);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    A && /* @__PURE__ */ c("p", { role: "alert", children: [
      A,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: () => {
            O(""), ee(!1);
          },
          children: L ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    Ne && (Ne.alert ? /* @__PURE__ */ c("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(Vn, { "aria-hidden": "true" }),
      Ne.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ r("p", { className: "dq-status", "aria-hidden": "true", children: Ne.text })
    ))
  ] });
  return /* @__PURE__ */ c(
    "div",
    {
      ref: yn,
      className: `data-quality-page${Mn ? " dq-page-fit" : ""}`,
      style: Mn ? {
        "--dq-fit-top": `${fr.top}px`,
        "--dq-fit-bottom": `${fr.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ r("p", { className: "dq-sr-only", "aria-live": "polite", children: Ne && !Ne.alert ? Ne.text : "" }),
        x && qe ? /* @__PURE__ */ r(
          Cd,
          {
            review: x,
            canWrite: kn ? b : mt,
            canAssess: (Ie == null ? void 0 : Ie.kind) === "ready" && mt,
            onBusy: Rn,
            editRequest: Wt,
            onEditRequestHandled: () => sn(0),
            onSaveDefaults: J ? (u) => Hn(t.map((w) => w.id === u.id ? u : w)) : void 0,
            pageControls: {
              onBack: ua,
              moreItems: (u) => qi(X ?? x, u),
              onGrid: Z ? () => Ht({ id: Z.id, mode: "multiple" }) : void 0,
              notices: fa
            }
          },
          x.id
        ) : x ? js(x) : /* @__PURE__ */ r(
          kd,
          {
            reviews: t,
            counts: te,
            sort: ct,
            direction: on,
            onSortChange: An,
            onDirectionChange: Je,
            storage: xd[P],
            canConfigure: J,
            busy: ke,
            headingRef: Xe,
            notices: fa,
            onOpen: jr,
            onNew: () => yi(),
            onImport: (u) => void $s(u),
            onExportAll: () => is(t, "data-quality-reviews.json"),
            rowMenuItems: (u) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ r(rr, { "aria-hidden": "true" }),
                disabled: !J || ke,
                onSelect: () => wi(u.id)
              },
              ...Ni(u)
            ]
          }
        ),
        gt && yt && Z && /* @__PURE__ */ r(
          Wd,
          {
            video: yt,
            review: Z,
            selectedCount: ze.size,
            pending: Ee,
            refreshing: U || !!oe,
            error: ur,
            canWrite: p,
            assessmentReady: (Ie == null ? void 0 : Ie.kind) === "ready",
            trees: K,
            selected: ze.has(yt.id),
            hasPrevious: se.indexOf(yt.id) > 0,
            hasNext: se.indexOf(yt.id) >= 0 && se.indexOf(yt.id) < se.length - 1,
            onToggleSelected: () => Gt((u) => zr(u, yt.id)),
            onPrevious: () => Kn(-1),
            onNext: () => Kn(1),
            onClose: () => {
              bt(!1), Ye(dt.current);
            },
            onAction: Fn,
            findOpen: bn,
            onFindOpenChange: en
          }
        ),
        bn && x && !qe && !gt && /* @__PURE__ */ r(
          ai,
          {
            actions: x.actions,
            tagGroups: _,
            trees: K,
            isDisabled: bi,
            canStay: !1,
            onApply: (u) => {
              en(!1), Fn(u);
            },
            onClose: () => en(!1)
          }
        ),
        rt && /* @__PURE__ */ r(
          Td,
          {
            draft: rt,
            onChange: (u) => ye((w) => w && { ...w, review: u, error: "" }),
            onCreate: () => void Rs(),
            onCancel: () => ye(null)
          }
        ),
        /* @__PURE__ */ r(
          ec,
          {
            open: !!at,
            title: "Delete review?",
            message: at ? `“${at.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (at == null ? void 0 : at.pending) ?? !1,
            onConfirm: () => void Is(),
            onCancel: () => lt((u) => u != null && u.pending ? u : null)
          }
        )
      ]
    }
  );
  async function gr(u, w, k = !1) {
    const G = dt.current, z = Math.max(0, se.indexOf(G ?? -1));
    try {
      const B = st(
        u,
        w,
        k,
        u.view.selectAllOnLoad === !0
      ), fe = Ut.current, Rt = await B;
      if (fe !== Ut.current) return;
      const $e = Rt.items.map((he) => he.id);
      Fe(
        (he) => new Set([...he].filter((Qe) => $e.includes(Qe)))
      );
      const Ge = Ii($e, G, z);
      ot(Ge), _t.current || Ye(Ge, !1);
    } catch {
    }
  }
  function Os(u) {
    const w = Lt.current;
    if (Lt.current = null, da || !x || !X) return;
    const k = w ?? x.view.objectFilter, G = or(
      k,
      X.view.objectFilter
    ) ? X.view.objectFilter : k, z = Et({ ...u, page: 1 }), B = {
      ...x,
      view: {
        ...x.view,
        filter: z,
        objectFilter: G
      }
    }, fe = Vt(B) !== Vt(X), Rt = fe ? B : X;
    He(fe ? B : null), tn(fe ? "" : "Review queue defaults restored."), gr(Rt, z, !0);
  }
  function Ms() {
    if (Ee || U || !X) return;
    Lt.current = null;
    const u = Et({
      ...X.view.filter,
      page: 1
    });
    He(null), tn("Review queue defaults restored."), gr(
      X,
      u,
      X.view.startFrom !== "beginning"
    );
  }
  function Fs() {
    Ee || U || !x || !X || !J || Hn(
      t.map(
        (u) => u.id === E ? {
          ...u,
          view: {
            ...x.view,
            filter: { ...Se, page: 1 }
          }
        } : u
      )
    ).then(() => {
      He(null), tn("Queue saved to this review.");
    }).catch(
      (u) => jt(
        u instanceof Error ? u.message : "Could not save queue."
      )
    );
  }
  function ha() {
    if (!x || !X || un.current || Y) return;
    Qt.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, cn.current = {
      temporaryReview: Pe,
      filter: Se,
      loadedFilter: Tn,
      queue: et,
      queueError: oe,
      retryFromEnd: Dt,
      selectedIds: new Set(ze),
      focusedId: We,
      pageCursor: F.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const u = structuredClone({
      ...X,
      view: { ...X.view, startFrom: x.view.startFrom ?? "end" }
    });
    en(!1), bt(!1), tn(""), jt(""), ht({
      draft: u,
      baseline: Cr(no(u, x, Se)),
      saving: !1,
      error: ""
    });
  }
  function Si() {
    ht(null), cn.current = null;
    const u = Qt.current;
    Qt.current = null, requestAnimationFrame(() => {
      (u == null ? void 0 : u.isConnected) && u !== document.body && !(u instanceof HTMLButtonElement && u.disabled) ? u.focus({ preventScroll: !0 }) : Ye(dt.current, !1);
    });
  }
  function xs() {
    var w;
    if (!Y || Y.saving) return;
    const u = cn.current;
    u && (Ut.current += 1, (w = v.current) == null || w.abort(), Lt.current = null, ce(!1), He(u.temporaryReview), At(u.filter), Xt(u.loadedFilter), Mt(u.queue), Me(u.queueError), be(u.retryFromEnd), Gt(() => u.selectedIds), ot(u.focusedId), F.current = u.pageCursor, window.history.replaceState(window.history.state, "", u.url)), Si();
  }
  async function Ps() {
    if (!Y || Y.saving || !W) return;
    const u = { ...W, name: W.name.trim() }, w = Er(u);
    if (w) {
      ht((k) => k && { ...k, error: w });
      return;
    }
    ht((k) => k && { ...k, saving: !0, error: "" });
    try {
      if (!await Hn(t.map((k) => k.id === u.id ? u : k)))
        throw new Error("Could not save reviews.");
      He(null), tn("Review saved."), Si();
    } catch (k) {
      ht(
        (G) => G && {
          ...G,
          saving: !1,
          error: "Could not save review. Your edits are still open. " + (k instanceof Error ? k.message : "Retry saving.")
        }
      );
    }
  }
  function Ei() {
    x && st(x, Se, Dt, gn).catch(() => {
    });
  }
  function Ls() {
    Fe(/* @__PURE__ */ new Set()), tt.current.clear(), ot(null);
  }
  function Ds(u) {
    !x || Ee || _r || u === Number(Se.page) || Kd(
      { ...Se, page: u },
      x,
      (w, k) => st(w, k, !1, gn),
      Ls
    );
  }
  function _s(u) {
    if (!Z || !X || Ee || U || _r) return;
    const w = Md(Z, u, X.view.objectFilter), k = Vt(w) !== Vt(X);
    He(k ? w : null), k ? gr(w, { ...Se, page: 1 }) : gr(
      X,
      { ...Se, page: 1 },
      X.view.startFrom !== "beginning"
    );
  }
  function js(u) {
    var $e, Ge;
    const w = we === "tag", k = w ? "tag" : "video", G = Math.max(1, Number(Se.perPage) || 40), z = Math.max(1, Math.ceil(et.totalCount / G)), B = Math.min(Math.max(1, Number(Se.page) || 1), z), fe = [
      Ot ? "" : `${Yt} write permission is required to apply actions.`,
      w && I ? `Tag groups are unavailable. ${I}` : ""
    ].filter(Boolean), Rt = !!ur && !gt;
    return /* @__PURE__ */ c(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": w ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ r(
            cs,
            {
              name: u.name,
              description: u.description,
              entityType: we,
              onBack: ua,
              backDisabled: Ee || !!Y,
              onEdit: Y ? () => {
                var he;
                return (he = _n.current) == null ? void 0 : he.focus();
              } : ha,
              editDisabled: !Y && (Ee || U || _e || !J),
              editing: !!Y,
              toolbar: /* @__PURE__ */ c("fieldset", { className: "dq-review-toolbar", disabled: da, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: w ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ r(
                  qr,
                  {
                    filter: oe ? Tn : Se,
                    onFilterChange: Os,
                    totalCount: et.totalCount,
                    sortOptions: w ? nc : fo,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: dn,
                    zoomLevel: (Qn - 225) / 50,
                    onZoomChange: (he) => wt(Math.round(225 + he * 50)),
                    cardSizeEntityType: w ? "tags" : "videos",
                    criteriaDefinitions: w ? tc : Ga,
                    customFieldEntityType: we === "video" ? "video" : void 0,
                    objectFilter: Be,
                    onObjectFilterChange: (he) => {
                      da || (Lt.current = we === "video" ? us(
                        he,
                        $n,
                        u.view.objectFilter
                      ) : he);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(ls, { page: B, pages: z, onPage: Ds })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ c(me, { children: [
                Z && /* @__PURE__ */ r(
                  ds,
                  {
                    mode: "multiple",
                    disabled: Ee || U || je || !!Y,
                    onChange: () => Ht({ id: Z.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ r(
                  Ul,
                  {
                    options: w ? Dd : Ld,
                    value: dn,
                    onChange: (he) => lr(ao(he, we))
                  }
                ),
                /* @__PURE__ */ r(
                  si,
                  {
                    disabled: Ee || !!Y,
                    items: qi(X ?? u, {
                      onSelect: ha,
                      disabled: U || _e || !J
                    })
                  }
                )
              ] }),
              chipsAfter: (Ge = ($e = Z == null ? void 0 : Z.presentation) == null ? void 0 : $e.binParents) != null && Ge.length ? /* @__PURE__ */ r(
                $d,
                {
                  videos: et.items,
                  review: Z,
                  savedObjectFilter: (X ?? Z).view.objectFilter,
                  trees: Ze.ids,
                  disabled: Ee || U || _r,
                  onToggle: _s
                }
              ) : void 0,
              chipsEnd: Y ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : (Pe == null ? void 0 : Pe.id) === E ? /* @__PURE__ */ c(me, { children: [
                /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Queue differs from the saved review" }),
                /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    className: "dq-text-button",
                    title: "Save the current queue criteria to this review",
                    disabled: Ee || U || !J,
                    onClick: Fs,
                    children: [
                      /* @__PURE__ */ r(So, { "aria-hidden": "true" }),
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
                    disabled: Ee || U,
                    onClick: Ms,
                    children: [
                      /* @__PURE__ */ r(Eo, { "aria-hidden": "true" }),
                      "Reset"
                    ]
                  }
                )
              ] }) : void 0
            }
          ),
          fa,
          Z && Ze.error && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: Ze.error }),
          /* @__PURE__ */ c("div", { className: "dq-review-area", children: [
            Y && W && /* @__PURE__ */ r(
              ss,
              {
                drawerRef: _n,
                draft: W,
                onChange: (he) => ht((Qe) => Qe && { ...Qe, draft: he }),
                direction: Y.draft.view.startFrom ?? "end",
                onDirectionChange: (he) => ht(
                  (Qe) => Qe && {
                    ...Qe,
                    draft: { ...Qe.draft, view: { ...Qe.draft.view, startFrom: he } }
                  }
                ),
                tagGroups: _,
                trees: K,
                saving: Y.saving,
                saveDisabled: U || !!oe,
                error: Y.error,
                dirty: de,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  oe && !U ? /* @__PURE__ */ c("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ r(Vn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ c("span", { children: [
                      "The queue could not load: ",
                      oe,
                      " ",
                      /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", onClick: Ei, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void Ps(),
                onCancel: xs
              }
            ),
            /* @__PURE__ */ c(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${xr}px` },
                children: [
                  /* @__PURE__ */ c("div", { className: "dq-grid-content", children: [
                    U && !et.items.length && /* @__PURE__ */ r(oo, { label: "Loading review queue…" }),
                    oe && !U && /* @__PURE__ */ r(
                      so,
                      {
                        message: oe,
                        retryLabel: _e ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (_e && X && Ke(X) === "video") {
                            const he = nr(X);
                            Nr(X.id, { ...he, filter: { ...he.filter, page: void 0 } }), Ct((Qe) => Qe + 1);
                            return;
                          }
                          Ei();
                        }
                      }
                    ),
                    !Ee && !U && !oe && !et.items.length && /* @__PURE__ */ c("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ r(na, {}),
                      /* @__PURE__ */ c("p", { children: [
                        "No ",
                        k,
                        "s match this review."
                      ] })
                    ] }),
                    !!et.items.length && /* @__PURE__ */ r("div", { ref: Mr, children: /* @__PURE__ */ r(
                      "div",
                      {
                        className: dn === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${Qn}px` },
                        children: et.items.map(Us)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ r("div", { className: "dq-bar-dock", ref: Lr, children: /* @__PURE__ */ r(
                    Zo,
                    {
                      actions: Y ? Y.draft.actions : u.actions,
                      tagGroups: _,
                      trees: K,
                      isDisabled: bi,
                      paused: !!Y,
                      busy: Ee || U,
                      onApply: (he) => void Fn(he),
                      onFind: () => en(!0),
                      status: Ee ? `Applying action to ${$r}…` : "",
                      summary: /* @__PURE__ */ c(me, { children: [
                        /* @__PURE__ */ r("p", { className: "dq-bar-target", children: ze.size ? `${ze.size} selected` : We == null ? "Nothing to apply to" : `Applies to the focused ${k}` }),
                        /* @__PURE__ */ c(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !se.length || la,
                            onClick: () => Gt((he) => /* @__PURE__ */ new Set([...he, ...se])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ r(ut, { binding: Ts.selectAll, hidden: !0 })
                            ]
                          }
                        ),
                        /* @__PURE__ */ c(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Escape",
                            disabled: !ze.size,
                            onClick: () => Gt(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ r(ut, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: fe.length ? fe.join(" ") : w ? "Arrows move · Space selects · Enter opens" : Y ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews",
                      notices: Rt || Ue ? /* @__PURE__ */ c(me, { children: [
                        Rt && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ r(Vn, { "aria-hidden": "true" }),
                          ur
                        ] }),
                        Ue && /* @__PURE__ */ r("p", { role: "status", className: "dq-status", children: Ue })
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
  function Us(u) {
    var k, G, z;
    if (we === "tag") {
      const B = u;
      return /* @__PURE__ */ r(
        Vd,
        {
          tag: B,
          displayMode: dn === "list" ? "list" : "grid",
          focused: B.id === We,
          selected: ze.has(B.id),
          setRef: (fe) => {
            fe ? Gn.current.set(B.id, fe) : Gn.current.delete(B.id);
          },
          onFocus: () => ot(B.id),
          onToggle: () => {
            Gt((fe) => zr(fe, B.id)), Ye(B.id, !1);
          },
          onOpen: () => window.open(`/tag/${B.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        B.id
      );
    }
    const w = u;
    return /* @__PURE__ */ r(
      Jd,
      {
        video: Id(w, Z, Ze.ids),
        showTagBins: ((G = (k = Z == null ? void 0 : Z.presentation) == null ? void 0 : k.annotations) == null ? void 0 : G.includes("tags")) && !!((z = Z.presentation.annotationParents) != null && z.length),
        displayMode: dn,
        cardsScroll: ca,
        focused: w.id === We,
        selected: ze.has(w.id),
        setRef: (B) => {
          B ? Gn.current.set(w.id, B) : Gn.current.delete(w.id);
        },
        onFocus: () => ot(w.id),
        onToggle: () => Gt((B) => zr(B, w.id)),
        onPreview: () => {
          Y || (ot(w.id), bt(!0));
        },
        onNavigate: e
      },
      w.id
    );
  }
}
function Kd(e, t, n, a) {
  a(), n(t, e).catch(() => {
  });
}
function zr(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function Bd(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Vd({
  tag: e,
  displayMode: t,
  focused: n,
  selected: a,
  setRef: i,
  onFocus: o,
  onToggle: s,
  onOpen: l,
  onNavigate: d
}) {
  return /* @__PURE__ */ r(
    "article",
    {
      ref: i,
      tabIndex: 0,
      "aria-current": n ? "true" : void 0,
      "aria-label": `${e.name}${a ? ", selected" : ""}`,
      onFocus: o,
      onClick: (h) => {
        o(), h.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${n ? "focused" : ""} ${a ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ r(
        rc,
        {
          tag: e,
          selected: a,
          onSelect: s,
          onClick: l,
          onNavigate: d
        }
      ) : /* @__PURE__ */ c("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            "aria-label": a ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": a,
            onClick: (h) => {
              h.stopPropagation(), s();
            },
            children: a ? "✓" : ""
          }
        ),
        /* @__PURE__ */ r("button", { type: "button", className: "dq-tag-list-name", onClick: l, children: e.name }),
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
function Jd({
  video: e,
  showTagBins: t,
  displayMode: n,
  cardsScroll: a,
  focused: i,
  selected: o,
  setRef: s,
  onFocus: l,
  onToggle: d,
  onPreview: h,
  onNavigate: p
}) {
  var R, C;
  const g = As(e), m = $(null), y = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, b = !!(y.date || y.studioName), N = !!(y.performers.length || y.tags.length);
  return pn(() => {
    const _ = m.current;
    if (!_) return;
    const T = _.querySelector(
      `a[href="/video/${e.id}"]`
    ), I = _.querySelector(".card-title"), D = `dq-card-title-${e.id}`;
    I && (I.id = D), T && (T.target = "_blank", T.rel = "noreferrer", T.removeAttribute("aria-label"), T.setAttribute("aria-labelledby", D), T.classList.add("dq-card-link"));
    const J = _.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    J && J.setAttribute(
      "aria-label",
      o ? `Deselect ${g}` : `Select ${g}`
    );
    const Q = _.querySelector(
      'button[title="Quick View"]'
    );
    Q && Q.setAttribute("aria-label", `Preview ${g}`);
  }), /* @__PURE__ */ c(
    "article",
    {
      ref: (_) => {
        m.current = _, s(_);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${g}${o ? ", selected" : ""}`,
      onFocus: l,
      onClick: (_) => {
        l(), _.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${b ? "has-card-metadata" : "no-card-metadata"} ${N ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ r(
          ac,
          {
            video: y,
            selected: o,
            onSelect: d,
            onNavigate: p,
            onQuickView: h,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ c("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (R = e.tags) == null ? void 0 : R.map((_) => /* @__PURE__ */ r("span", { children: _.name }, _.id)),
          !((C = e.tags) != null && C.length) && /* @__PURE__ */ r("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ r(zd, { video: e, cardsScroll: a })
      ]
    }
  );
}
function zd({ video: e, cardsScroll: t }) {
  const n = $(null), a = $(null), [i, o] = S(!1), [s, l] = S(!1), [d, h] = S(!1);
  return V(() => {
    const p = n.current;
    if (!p || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      o(!0), l(!0);
      return;
    }
    const g = t ? p.closest(".dq-grid-stage") : null, m = new IntersectionObserver(
      ([b]) => o(b.isIntersecting),
      { root: g, rootMargin: "320px 0px", threshold: 0 }
    ), y = new IntersectionObserver(
      ([b]) => l(b.isIntersecting && b.intersectionRatio >= 0.6),
      { root: g, threshold: [0, 0.6, 1] }
    );
    return m.observe(p), y.observe(p), () => {
      m.disconnect(), y.disconnect();
    };
  }, [e.id, e.files.length, t]), V(() => {
    if (!i) {
      h(!1);
      return;
    }
    const p = new AbortController();
    return ie(Vc(e.id), {
      signal: p.signal
    }).then((g) => {
      p.signal.aborted || h(g.available === !0);
    }).catch(() => {
      p.signal.aborted || h(!1);
    }), () => p.abort();
  }, [i, e.id]), V(() => {
    const p = a.current;
    p && (s ? Promise.resolve(p.play()).catch(() => {
    }) : p.pause());
  }, [d, s]), /* @__PURE__ */ r("div", { ref: n, className: "dq-wall-autoplay", "aria-hidden": "true", children: d && /* @__PURE__ */ r(
    "video",
    {
      ref: a,
      src: Bc(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Wd({
  video: e,
  review: t,
  selectedCount: n,
  pending: a,
  refreshing: i,
  error: o,
  canWrite: s,
  assessmentReady: l,
  trees: d,
  selected: h,
  hasPrevious: p,
  hasNext: g,
  onToggleSelected: m,
  onPrevious: y,
  onNext: b,
  onClose: N,
  onAction: R,
  findOpen: C,
  onFindOpenChange: _
}) {
  const T = $(null), I = $(null), D = e.files[0], J = As(e), Q = (A) => a || i || "steps" in A && A.steps.length > 0 && !s || Pn(A) && !l;
  ti({
    surface: "overlay",
    enabled: !C,
    actionCount: t.actions.length,
    onAction: (A) => {
      const O = t.actions[A];
      O && R(O);
    },
    onFind: () => _(!0)
  }), V(() => {
    var O;
    const A = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (O = T.current) == null || O.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = A;
    };
  }, []);
  function P(A) {
    var ee, ae, le;
    if (A.key !== "Tab") return;
    const O = [
      ...((ee = T.current) == null ? void 0 : ee.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ue) => ue.offsetParent !== null);
    if (!O.length) {
      A.preventDefault(), (ae = T.current) == null || ae.focus();
      return;
    }
    const L = O.indexOf(
      document.activeElement
    );
    A.shiftKey && L <= 0 ? (A.preventDefault(), (le = O.at(-1)) == null || le.focus()) : !A.shiftKey && L === O.length - 1 && (A.preventDefault(), O[0].focus());
  }
  function ne(A) {
    if (C || A.defaultPrevented || A.ctrlKey || A.metaKey || A.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const O = A.key === "ArrowLeft" || A.key === "ArrowRight";
    if (A.altKey && !O) return;
    const L = I.current, ee = A.currentTarget.querySelector("video");
    if (A.key === "Enter" || A.key === "Escape")
      A.repeat || N();
    else if (A.key === " " && L)
      A.repeat || L.toggle();
    else if (O && L)
      L.seekBy(
        (A.key === "ArrowLeft" ? -1 : 1) * (A.shiftKey ? 5 : A.altKey ? 10 : 60)
      );
    else if ((A.key === "," || A.key === ".") && L) {
      const ae = [D == null ? void 0 : D.duration, ee == null ? void 0 : ee.duration].find(
        (ue) => ue != null && Number.isFinite(ue) && ue > 0
      ) ?? 0, le = e.parentVideoId != null ? (e.clipEndSec ?? ae) - (e.clipStartSec ?? 0) : ae;
      Number.isFinite(le) && le > 0 && L.seekBy((A.key === "," ? -1 : 1) * le * 0.1);
    } else if (A.key.toLowerCase() === "n" || A.key.toLowerCase() === "m")
      !A.repeat && !a && !i && (A.key.toLowerCase() === "n" && p && y(), A.key.toLowerCase() === "m" && g && b());
    else if (A.key === "ArrowUp" && ee)
      ee.volume = Math.min(1, ee.volume + 0.1);
    else if (A.key === "ArrowDown" && ee)
      ee.volume = Math.max(0, ee.volume - 0.1);
    else return;
    er(A);
  }
  function pe(A) {
    const O = T.current, L = A.target instanceof Element ? A.target.closest("button, a[href]") : null;
    !O || !L || !O.contains(L) || L.closest(".dq-player, .dq-find-action") || A.detail === 0 || O.focus({ preventScroll: !0 });
  }
  V(() => {
    if (C) return;
    let A = 0;
    const O = requestAnimationFrame(() => {
      A = requestAnimationFrame(() => {
        var ee;
        const L = document.activeElement;
        (ee = T.current) != null && ee.isConnected && (!L || L === document.body || L === document.documentElement) && T.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(O), cancelAnimationFrame(A);
    };
  }, [C, a, i, g, p, e.id]);
  const re = n ? `the ${n} selected video${n === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ c(
    "div",
    {
      ref: T,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${J}`,
      className: "dq-preview",
      onKeyDown: P,
      onKeyDownCapture: ne,
      onMouseDown: (A) => {
        A.target === A.currentTarget && N();
      },
      onClick: pe,
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
                disabled: !p || a || i,
                onClick: y,
                children: [
                  /* @__PURE__ */ r(Tr, { "aria-hidden": "true" }),
                  /* @__PURE__ */ r(ut, { binding: "n", hidden: !0 })
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
                disabled: !g || a || i,
                onClick: b,
                children: [
                  /* @__PURE__ */ r(ut, { binding: "m", hidden: !0 }),
                  /* @__PURE__ */ r(qo, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ c("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ r("h2", { children: J }),
              /* @__PURE__ */ c("p", { children: [
                "Actions apply to ",
                re
              ] })
            ] }),
            /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "dq-preview-button dq-preview-select",
                "aria-pressed": h,
                disabled: i,
                onClick: m,
                children: [
                  /* @__PURE__ */ r("span", { className: "dq-preview-check", "aria-hidden": "true", children: h && /* @__PURE__ */ r(Va, {}) }),
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
                "aria-label": `Open ${J} in a new tab`,
                title: "Open video in a new tab",
                children: /* @__PURE__ */ r(Co, { "aria-hidden": "true" })
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
                onClick: N,
                children: /* @__PURE__ */ r(kr, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ r("div", { className: "dq-preview-video", children: D ? /* @__PURE__ */ r(
            ho,
            {
              autostart: !0,
              streamUrl: $a("video", e.id),
              posterUrl: xi(e),
              format: D.format,
              audioCodec: D.audioCodec,
              duration: D.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onPlaybackControlRegister: (A) => (I.current = A, () => {
                I.current === A && (I.current = null);
              }),
              clip: e.parentVideoId != null ? {
                start: e.clipStartSec ?? 0,
                end: e.clipEndSec,
                loop: !1
              } : void 0
            }
          ) : /* @__PURE__ */ r("img", { src: xi(e), alt: "" }) }) }),
          o && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert dq-preview-alert", children: o }),
          /* @__PURE__ */ c("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ r("span", { children: "Space play / pause" }),
            /* @__PURE__ */ r("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ r("span", { children: ", . ±10 %" }),
            /* @__PURE__ */ r("span", { children: "↑ ↓ volume" }),
            /* @__PURE__ */ r("span", { children: "N M previous / next" }),
            /* @__PURE__ */ r("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ r(
            Zo,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: d,
              isDisabled: Q,
              busy: a || i,
              onApply: (A) => void R(A),
              onFind: () => _(!0),
              status: a ? `Applying action to ${re}…` : "",
              summary: /* @__PURE__ */ r("p", { className: "dq-bar-target", children: n ? `${n} selected` : "This video" })
            }
          )
        ] }),
        C && /* @__PURE__ */ r(
          ai,
          {
            actions: t.actions,
            trees: d,
            isDisabled: Q,
            canStay: !1,
            onApply: (A) => {
              _(!1), R(A);
            },
            onClose: () => _(!1)
          }
        )
      ]
    }
  );
}
async function Qd() {
  const e = await ie("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
  let a = n ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (n)
    try {
      const s = JSON.parse(n);
      Array.isArray(s.reviews) && (a = JSON.stringify(s.reviews, null, 2));
    } catch {
    }
  const i = URL.createObjectURL(
    new Blob([a], { type: "application/json" })
  ), o = document.createElement("a");
  o.href = i, o.download = "data-quality-browser-recovery.json", o.click(), URL.revokeObjectURL(i);
}
function oo({ label: e }) {
  return /* @__PURE__ */ c("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ r(mc, { className: "dq-spin" }),
    e
  ] });
}
function so({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ c("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ r(Vn, {}),
    /* @__PURE__ */ r("p", { children: e }),
    /* @__PURE__ */ r("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const tu = { components: { DataQualityPage: Gd } };
export {
  Gd as DataQualityPage,
  tu as default,
  or as objectFiltersEqual
};
