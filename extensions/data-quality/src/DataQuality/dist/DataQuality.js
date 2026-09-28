import { jsxs as c, Fragment as fe, jsx as r } from "react/jsx-runtime";
import { useRef as T, useLayoutEffect as Zt, useMemo as ye, useState as C, useEffect as W, useId as Ct, useSyncExternalStore as xo, Fragment as ii, createContext as Ic, useContext as Oc, useCallback as Sn } from "react";
import { useKeySequence as $c, EntityReferenceMultiSelector as Cn, SortableList as Po, EntityDetailTabs as Mc, TagBadge as Fc, DetailListToolbar as Ur, PERFORMER_CRITERIA as oi, AUDIO_CRITERIA as Lo, VIDEO_CRITERIA as si, NarrativeText as xc, AUDIO_SORT_OPTIONS as Pc, VIDEO_SORT_OPTIONS as Do, AudioPlayer as Lc, VideoPlayer as _o, formatDuration as jo, FilterDialog as Dc, getResolutionLabel as _c, ConfirmDialog as jc, TAG_CRITERIA as Uc, TAG_SORT_OPTIONS as Kc, TagTile as Gc, VideoCard as Bc } from "@cove/runtime/components";
import { Search as ma, Pencil as qr, Ban as Ga, Pin as ci, Plus as li, GripVertical as Uo, AlertTriangle as Dn, Copy as Ko, Trash2 as Go, ChevronDown as Bo, X as Jr, Mic as Vc, Users as Vo, Tag as Jo, Headphones as zo, Film as ga, ChevronLeft as zr, RectangleHorizontal as Jc, LayoutGrid as di, MoreHorizontal as zc, ChevronRight as Wo, Layers as Yi, Check as ui, Undo2 as Wc, Flag as ca, RefreshCw as Qc, Save as Qo, RotateCcw as Ho, ExternalLink as Yo, SkipForward as Hc, Upload as Yc, Download as Xo, ArrowUp as Xc, ArrowDown as Zc, Loader2 as el, List as tl, Grid3X3 as nl } from "@cove/runtime/lucide-react";
import { extensionFetch as rl } from "@cove/runtime/api";
const fi = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, hi = Object.keys(
  fi
);
function Kr(e) {
  return e === "excludes" || e === "excludesAll";
}
function pi(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
const Zo = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function Se(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function mi(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function Re(e) {
  return mi(Me(e));
}
function al(e) {
  return Me(e) === "video";
}
function Me(e) {
  return e.entityType ?? "video";
}
const jn = [
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
], Gr = [
  jn.slice(0, 11),
  jn.slice(11, 22),
  jn.slice(22)
], Un = "none";
function rr(e) {
  return typeof e == "string" && jn.includes(e);
}
function gi(e) {
  const t = e.shortcut;
  return rr(t) || t === Un ? t : "auto";
}
function es(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), i = [];
  e.forEach((s, l) => {
    const d = gi(s);
    if (d !== Un) {
      if (d !== "auto") {
        if (!n.has(d)) {
          n.set(d, l), t[l] = d;
          return;
        }
        a.add(l);
      }
      i.push(l);
    }
  });
  const o = jn.filter((s) => !n.has(s));
  return i.forEach((s, l) => {
    const d = o[l];
    d !== void 0 && (t[s] = d, n.set(d, s));
  }), { keys: t, actionOn: n, duplicatePins: a };
}
function il(e, t, n) {
  const { keys: a, actionOn: i } = es(e), o = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (rr(n)) {
    const l = i.get(n), d = a[t];
    l !== void 0 && l !== t && o.set(l, d && e[t].shortcut === d ? d : void 0);
  }
  const s = new Set([...o.values()].filter(rr));
  return e.map((l, d) => {
    const h = o.has(d) ? o.get(d) : rr(l.shortcut) && s.has(l.shortcut) ? void 0 : l.shortcut;
    if (h === l.shortcut) return l;
    const { shortcut: p, ...w } = l;
    return h === void 0 ? w : { ...w, shortcut: h };
  });
}
function Br(e) {
  return Se(e) && !ts(e.occurrence) ? "Complete the optional occurrence condition before saving." : !al(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : Me(e) !== "tag" && e.actions.some(
    (t) => bi(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => kn(t, Me(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const ol = {
  video: 1e3,
  audio: 250
};
function Pt(e, t = "video") {
  const n = (a, i) => Number.isFinite(Number(a)) && Number(a) > 0 ? Math.floor(Number(a)) : i;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(ol[t], n(e.perPage, 40))
    )
  };
}
function Xi(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function _n(e) {
  const { page: t, ...n } = e.view.filter, a = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    Se(e) ? [e.entityType, ...a, e.occurrence] : Me(e) === "video" ? a : [Me(e), ...a]
  );
}
function kn(e, t) {
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
  ) && !bi(e) : !1;
}
function sl(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function En(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function ba(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function Kn(e) {
  return "steps" in e ? e.steps.some((t) => En(t.mode)) : !1;
}
function bi(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (En(n.mode))
      for (const a of n.tagIds) {
        const i = t.get(a);
        if (i && i !== n.mode) return !0;
        t.set(a, n.mode);
      }
  return !1;
}
function Wr(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || Zo.includes(n.entityType)) && (!sl(n.entityType) || ts(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && cl(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (a) => typeof a == "string"
    )) && Array.isArray(n.actions) && n.actions.every(
      (a) => typeof (a == null ? void 0 : a.id) == "string" && typeof a.label == "string" && (a.shortcut === void 0 || typeof a.shortcut == "string") && (n.entityType === "tag" ? "effect" in a && !("steps" in a) && kn(a, "tag") : "steps" in a && !("effect" in a) && Array.isArray(a.steps) && a.steps.every(
        (i) => i && Array.isArray(i.tagIds)
      ) && kn(a, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => Br(n)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((n) => n.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function cl(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= 115 && n.cardSize <= 380) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (a) => ["date", "studio", "performers", "tags"].includes(a)
  )) && [n.annotationParents, n.binParents].every(
    (a) => a === void 0 || Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0)
  );
}
function Ba(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const a of e)
    for (const i of a)
      n.has(i.id) || (n.add(i.id), t.push(i));
  return t;
}
function ll(e, t) {
  const n = new Set(t.map((i) => i.name.trim().toLocaleLowerCase())), a = `${e.trim().replace(/ copy(?: \d+)?$/i, "")} copy`;
  for (let i = 1; ; i++) {
    const o = i === 1 ? a : `${a} ${i}`;
    if (!n.has(o.toLocaleLowerCase())) return o;
  }
}
function dl(e, t, n) {
  return { ...structuredClone(e), id: n, name: ll(e.name, t) };
}
function ts(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (a) => Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0) && new Set(a).size === a.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && hi.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function Zi(e, t) {
  return e.size > 0 ? [...e].sort((n, a) => n - a) : t == null ? [] : [t];
}
function eo(e, t, n, a) {
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
function ul(e, t) {
  const n = new Set(e), a = t.length > 0 && t.every((i) => n.has(i));
  for (const i of t)
    a ? n.delete(i) : n.add(i);
  return n;
}
function fl(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function hl(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function pl(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function ml(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function gl(e, t) {
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
const ns = "ext:com.midnightrider.data-quality:configuration", bl = "ext:cove-data-quality:video-reviews", Va = "ext:com.midnightrider.data-quality:progress";
class rs extends Error {
}
const Qr = /* @__PURE__ */ new Map(), na = /* @__PURE__ */ new Map(), tr = (e, t) => e.includes("*") || e.includes(t), la = (e) => oe(`/api/savedfilters?mode=${encodeURIComponent(e)}`), wl = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Ja(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function wr(e) {
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
    reviews: Wr(JSON.stringify(t.reviews)),
    deletedIds: Ja(t.deletedIds),
    importedIds: Ja(t.importedIds)
  };
}
function yl(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const a = /* @__PURE__ */ new Set();
  for (const i of t) {
    const o = localStorage.getItem(i);
    if (o !== null) {
      const s = Wr(o);
      n ?? (n = s), s.forEach((l) => a.add(l.id));
    }
    Ja(
      JSON.parse(localStorage.getItem(`${i}:account-imports`) ?? "[]")
    ).forEach((s) => a.add(s));
  }
  return {
    reviews: n ?? [],
    known: [...a],
    present: n !== void 0
  };
}
async function as(e) {
  const t = await oe("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function is(e, t) {
  const n = (na.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return na.set(e, n), n.finally(() => {
    na.get(e) === n && na.delete(e);
  }).catch(() => {
  }), n;
}
let Pr = null;
function vl() {
  if (Pr) return Pr;
  const e = Nl();
  return Pr = e, e.finally(() => {
    Pr === e && (Pr = null);
  }).catch(() => {
  }), e;
}
async function Nl() {
  var m;
  const e = await oe("/api/auth/me"), t = String(e.user.id), n = `cove-data-quality-v2:${t}`, a = tr(e.permissions, "savedfilters.read"), i = a && tr(e.permissions, "savedfilters.write"), o = a ? (await la(ns)).filter((N) => N.name === "Data Quality configuration").sort((N, b) => N.id - b.id) : [];
  if (o.length > 1) {
    const N = (b) => {
      const { revision: y, ...E } = wr(b.uiOptions);
      return JSON.stringify(E);
    };
    if (o.some((b) => N(b) !== N(o[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (i)
      for (const b of o.slice(1))
        await oe(`/api/savedfilters/${b.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${b.id}` })
        });
    o.splice(1);
  }
  let s = o.length ? wr(o[0].uiOptions) : wl();
  const l = localStorage.getItem(`${n}:migrated`) === "true", d = localStorage.getItem(n), h = localStorage.getItem(`${n}:local-only`) === "true";
  !o.length && d && (s = wr(d));
  let p = !o.length;
  if (o.length && h && d) {
    const N = wr(d);
    if (N.reviews.some((y) => {
      const E = s.reviews.find((v) => v.id === y.id);
      return E && JSON.stringify(E) !== JSON.stringify(y);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const b = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...N.deletedIds])
    ];
    s = {
      ...s,
      reviews: Ba(s.reviews, N.reviews).filter(
        (y) => !b.includes(y.id)
      ),
      deletedIds: b,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...N.importedIds])
      ]
    }, p = !0;
  }
  if (!l) {
    const N = JSON.stringify(s), b = yl(t);
    if (o.length && b.reviews.some((M) => {
      const j = s.reviews.find((I) => I.id === M.id);
      return j && JSON.stringify(j) !== JSON.stringify(M);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const y = a ? (await la(bl)).flatMap(
      (M) => Wr(M.uiOptions ?? "[]")
    ) : [], E = b.known.filter(
      (M) => !b.reviews.some((j) => j.id === M)
    ), v = /* @__PURE__ */ new Set([...s.deletedIds, ...E]);
    s = {
      ...s,
      reviews: Ba(
        b.reviews,
        s.reviews,
        y.filter(
          (M) => !b.known.includes(M.id) && !s.importedIds.includes(M.id)
        )
      ).filter((M) => !v.has(M.id)),
      deletedIds: [...v],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...b.known,
          ...y.map((M) => M.id)
        ])
      ]
    }, p || (p = JSON.stringify(s) !== N);
  }
  const w = {
    userId: t,
    recordId: (m = o[0]) == null ? void 0 : m.id,
    config: s,
    readable: a,
    writable: i,
    durable: i
  };
  if (Qr.set(n, w), p && i) {
    const N = s;
    o.length && (w.config = wr(o[0].uiOptions)), await os(n, N), s = w.config;
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
    canWrite: tr(e.permissions, "videos.write"),
    canWriteVideos: tr(e.permissions, "videos.write"),
    canWriteAudios: tr(e.permissions, "audios.write"),
    canWriteTags: tr(e.permissions, "tags.write"),
    canReadTagGroups: tr(e.permissions, "taggroups.read"),
    canConfigure: !a || i,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: a ? i ? "account" : "readOnly" : "browser",
    storageNotice: a ? i ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function os(e, t) {
  const n = Qr.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const a = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await as(n), n.recordId != null) {
      const o = await oe(
        `/api/savedfilters/${n.recordId}`
      );
      if (wr(o.uiOptions).revision !== n.config.revision)
        throw new rs(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const i = await oe(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: ns,
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
function ql(e, t) {
  return Wr(JSON.stringify(t)), is(e, async () => {
    const n = Qr.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const a = n.config.reviews.filter((i) => !t.some((o) => o.id === i.id)).map((i) => i.id);
    await os(e, {
      ...n.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...n.config.deletedIds, ...a])
      ].filter((i) => !t.some((o) => o.id === i))
    });
  });
}
function to(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, a]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(a)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Sl(e, t) {
  const n = Qr.get(e);
  if (!n) return null;
  const a = localStorage.getItem(`${e}:progress:${t}`), i = a ? to(a) : null;
  if (!n.readable) return i;
  const o = (await la(Va)).find(
    (l) => l.name === t
  ), s = o ? to(o.uiOptions) : null;
  return i && (!s || i.updatedAt > s.updatedAt) ? i : s;
}
function El(e, t, n) {
  const a = `${e}:progress:${t}`;
  try {
    localStorage.setItem(a, JSON.stringify(n));
  } catch {
  }
  return is(a, async () => {
    const i = Qr.get(e);
    if (!(i != null && i.writable)) return;
    await as(i);
    const o = (await la(Va)).find(
      (s) => s.name === t
    );
    await oe(
      o ? `/api/savedfilters/${o.id}` : "/api/savedfilters",
      {
        method: o ? "PUT" : "POST",
        body: JSON.stringify({
          mode: Va,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function Gn(e) {
  return e === "audio" ? "audios" : "videos";
}
const Cl = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function mn(e) {
  return Cl[e];
}
const da = "confirmed_absent_tags", wi = "Confirmed absent tags", wa = "confirmed_absent_occurrence_tags", ss = {
  key: da,
  label: wi,
  type: "tag",
  subject: "tag assessments"
}, yi = {
  key: wa,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, kl = {
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
function An(e) {
  return Array.isArray(e) ? e.map(An) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? kl[n] ?? n : t === "key" && typeof n == "string" && [
        da,
        wa
      ].includes(n.toLowerCase()) ? n.toLowerCase() : An(n)
    ])
  ) : e;
}
async function cs(e, t, n) {
  const a = new Headers(t.headers);
  !(t.body instanceof FormData) && !a.has("Content-Type") && a.set("Content-Type", "application/json");
  const i = await rl(e, { ...t, headers: a });
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
async function oe(e, t = {}) {
  return await cs(e, t, "fail");
}
function Al(e, t = {}) {
  return cs(e, t, "null");
}
const Tl = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Rl = 0;
function za(e, t) {
  return oe(
    `/api/${Gn(e)}/${t}?dqRead=${Tl}-${++Rl}`,
    { cache: "no-store" }
  );
}
function ls(e, t) {
  const n = { ...e.view.objectFilter }, a = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    An({
      findFilter: Pt(t, Re(e)),
      objectFilter: n,
      filterExpression: a
    })
  );
}
async function _r(e, t, n) {
  return oe(
    `/api/${Gn(Re(e))}/find`,
    { method: "POST", signal: n, body: ls(e, t) }
  );
}
async function Il(e, t, n) {
  return (await oe(
    `/api/${Gn(Re(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: ls(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function no(e, t, n) {
  const a = { ...e.view.objectFilter };
  return delete a._filterExpression, oe("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      An({
        findFilter: Pt(t),
        objectFilter: a
      })
    )
  });
}
function Ol(e) {
  return oe("/api/taggroups", { signal: e });
}
function Wa(e, t, n = 1280) {
  return `/api/${Gn(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function Qa(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function ro(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function $l(e) {
  return `/api/stream/video/${e}/preview`;
}
function Ml(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Fl(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function ya(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e) {
    await oe(`/api/tags/${a}`, { signal: t }), n.add(a);
    for (let i = 1; ; i++) {
      const o = await oe("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          An({
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
async function vi(e, t) {
  const n = ba(e);
  return (await Promise.all(
    e.steps.map(
      async (i) => i.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await ya(i.tagIds, t)).filter(
          (o) => !n.has(o)
        )
      } : i
    )
  )).filter((i) => i.tagIds.length > 0);
}
function xl(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function Ni(e, t) {
  const a = (await oe("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === e.key
  );
  if (!a)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const i = xl(e, a);
  return i ? { kind: "incompatible", message: i } : a.entityTypes.includes(t) ? { kind: "ready", definition: a, message: "" } : {
    kind: "missing",
    message: `Add ${mn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: a
  };
}
async function ds(e, t) {
  const n = await Ni(e, t);
  if (n.kind !== "ready") {
    if (n.kind === "incompatible") throw new Error(n.message);
    if (n.definition) {
      await oe(`/api/custom-fields/${n.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...n.definition.entityTypes, t])]
        })
      });
      return;
    }
    await oe("/api/custom-fields", {
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
function us(e = "video") {
  return Ni(ss, e);
}
function Pl(e = "video") {
  return ds(ss, e);
}
function fs(e = "video") {
  return Ni(yi, e);
}
function Ll(e = "video") {
  return ds(yi, e);
}
function ua(e) {
  return [...new Set(e)];
}
function hs(e, t) {
  const n = e.customFields ?? {}, a = Object.keys(n).find(
    (o) => o.toLowerCase() === wa
  ), i = a === void 0 ? [] : n[a];
  return ua(
    (Array.isArray(i) ? i : []).filter(
      (o) => typeof o == "string" && /^[1-9]\d*:[1-9]\d*$/.test(o)
    ).map((o) => o.split(":").map(Number)).filter(([o]) => o === t).map(([, o]) => o)
  );
}
async function Dl(e) {
  let t;
  try {
    t = await fs(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${yi.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function _l(e, t, n, a, i, o) {
  await oe(`/api/${Gn(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: ua(i).map((s) => `${a}:${s}`)
      },
      customFieldMode: o
    })
  });
}
function jl(e, t, n) {
  const a = [...e.tagIds], i = (o) => {
    if (n === null)
      throw new Error(
        `The ${wi} custom field is not available.`
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
async function ps(e, t, n) {
  if (!kn(t) || n.length === 0 || n.some((d) => !Number.isSafeInteger(d) || d <= 0))
    throw new Error(
      `Choose ${mn(e).many} and configure a valid action first.`
    );
  let a = null;
  if (Kn(t)) {
    let d;
    try {
      d = await us(e);
    } catch (h) {
      throw new Error(
        `Could not verify the ${wi} custom field. ${h instanceof Error ? h.message : "Request failed."}`
      );
    }
    if (d.kind !== "ready") throw new Error(d.message);
    a = d.definition.key;
  }
  const i = ua(n), o = (await vi(t)).map((d) => ({
    mode: d.mode,
    tagIds: ua(d.tagIds)
  })), l = [
    ...o.filter((d) => !En(d.mode)),
    ...o.filter((d) => En(d.mode))
  ].map(
    (d) => jl(d, i, a)
  );
  for (let d = 0; d < l.length; d++)
    try {
      await oe(`/api/${Gn(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(l[d])
      });
    } catch (h) {
      throw new Error(
        `Step ${d + 1} failed; ${d} earlier step(s) completed. Refresh and check the selected ${mn(e).many} before retrying. ${h instanceof Error ? h.message : "Request failed."}`
      );
    }
}
async function Ul(e, t) {
  if (!kn(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await oe("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const Ha = "-", ao = "Ctrl+a", Kl = "Ctrl/⌘A", Gl = ["f", "g", "k"], Fa = "Shift+";
function Er(e) {
  return ye(() => es(e), [e]);
}
function qi({
  surface: e,
  enabled: t,
  actions: n,
  onAction: a,
  onFind: i,
  onSelectAll: o
}) {
  const s = Er(n), l = T({ keyMap: s, onAction: a, onFind: i, onSelectAll: o });
  Zt(() => {
    l.current = { keyMap: s, onAction: a, onFind: i, onSelectAll: o };
  });
  const d = !!i && n.length > 0, h = e === "local" && !!o, p = jn.filter(
    (m) => s.actionOn.has(m) || e === "local" && Gl.includes(m)
  ).join(" "), w = ye(() => {
    const m = (y) => {
      var v, M;
      const E = l.current;
      if (y === ao) (v = E.onSelectAll) == null || v.call(E);
      else if (y === Ha) (M = E.onFind) == null || M.call(E);
      else {
        const j = y.startsWith(Fa), I = E.keyMap.actionOn.get(
          j ? y.slice(Fa.length) : y
        );
        I !== void 0 && E.onAction(I, j);
      }
    }, N = (y, E = e) => ({
      keys: y,
      surface: E,
      action: (v) => {
        v != null && v.repeat || m((v == null ? void 0 : v.sequence) ?? y);
      }
    }), b = [];
    h && b.push(N(ao, "local")), d && b.push(N(Ha));
    for (const y of p ? p.split(" ") : [])
      b.push(N(y), N(`${Fa}${y}`));
    return b;
  }, [e, p, d, h]);
  $c(w, t);
}
const Bl = {
  find: Ha,
  selectAll: Kl
};
function Si() {
  return Bl;
}
const Vl = 600 * 1e3, Ei = /* @__PURE__ */ new Map(), ms = /* @__PURE__ */ new Map(), Ln = /* @__PURE__ */ new Map();
function gs(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = ms.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function bs(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && ms.set(e.tagGroupId, e.tagGroupSortOrder), Ei.set(e.id, { tag: e, at: Date.now() });
}
function ws(e) {
  const t = Ei.get(e);
  if (!(!t || Date.now() - t.at > Vl))
    return gs(t.tag);
}
function ys(e) {
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
function Ya(e) {
  var t;
  for (const n of e) {
    const a = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && a && bs(ys({ ...n, name: a }));
  }
}
function Jl(e) {
  const t = Ln.get(e);
  if (t) return t;
  const n = new AbortController(), a = {
    controller: n,
    waiters: 0,
    promise: oe(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (i) => {
        var p, w;
        const o = ((p = i == null ? void 0 : i.name) == null ? void 0 : p.trim()) || null;
        if (Ln.get(e) === a && Ln.delete(e), !o) return null;
        const s = ys({ ...i, id: e, name: o }), l = (w = Ei.get(e)) == null ? void 0 : w.tag, d = (l == null ? void 0 : l.tagGroupId) === s.tagGroupId, h = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (d ? l == null ? void 0 : l.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (l == null ? void 0 : l.hasImage),
          imagePath: s.imagePath ?? (l == null ? void 0 : l.imagePath)
        };
        return bs(h), gs(h);
      },
      () => (Ln.get(e) === a && Ln.delete(e), null)
    )
  };
  return Ln.set(e, a), a;
}
function io() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function xa(e) {
  const t = {};
  for (const n of e) {
    const a = ws(n);
    a !== void 0 && (t[n] = a);
  }
  return t;
}
function zl(e, t) {
  if (t != null && t.aborted) return Promise.reject(io());
  const n = {}, a = [];
  for (const i of new Set(e)) {
    const o = ws(i);
    if (o !== void 0) n[i] = o;
    else {
      const s = Jl(i);
      s.waiters += 1, a.push({ id: i, entry: s });
    }
  }
  return a.length ? new Promise((i, o) => {
    let s = !1;
    const l = () => {
      for (const { id: h, entry: p } of a)
        p.waiters -= 1, p.waiters === 0 && Ln.get(h) === p && (Ln.delete(h), p.controller.abort());
    }, d = () => {
      s || (s = !0, l(), o(io()));
    };
    t == null || t.addEventListener("abort", d, { once: !0 }), Promise.all(
      a.map(
        ({ id: h, entry: p }) => p.promise.then((w) => [h, w])
      )
    ).then((h) => {
      if (!s) {
        s = !0, t == null || t.removeEventListener("abort", d), l();
        for (const [p, w] of h) n[p] = w;
        i(n);
      }
    });
  }) : Promise.resolve(n);
}
function vs(e) {
  const t = {};
  for (const [n, a] of Object.entries(e)) t[Number(n)] = (a == null ? void 0 : a.name) ?? null;
  return t;
}
function Ci(e) {
  const t = [...new Set(e)].sort((i, o) => i - o).join(","), [n, a] = C(() => ({
    key: t,
    tags: xa(Pa(t))
  }));
  return W(() => {
    const i = Pa(t), o = xa(i);
    if (a({ key: t, tags: o }), i.every((l) => l in o)) return;
    const s = new AbortController();
    return zl(i, s.signal).then(
      (l) => a({ key: t, tags: l }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : xa(Pa(t));
}
function Cr(e) {
  const t = Ci(e);
  return ye(() => vs(t), [t]);
}
function Pa(e) {
  return e ? e.split(",").map(Number) : [];
}
function Wl(e, t, n = !1) {
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
function cr(e, t, n = [], a) {
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
  const i = ba(e), o = (s) => i.has(s) || [...i].some((l) => {
    var d;
    return (d = a == null ? void 0 : a.get(s)) == null ? void 0 : d.includes(l);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (l) => Wl(
        s.mode,
        t[l] === void 0 ? "…" : t[l] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && o(l)
      )
    )
  );
}
function va(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function ki({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  canStay: i = !0,
  onApply: o,
  onClose: s
}) {
  const [l, d] = C(""), [h, p] = C(0), w = T(null), m = T(null), N = T(null), b = T(null), y = T(null), E = T(/* @__PURE__ */ new Set()), v = Ct(), M = Cr(ye(() => va(e), [e])), j = Er(e), I = ye(() => {
    const O = l.trim().toLocaleLowerCase(), D = (H) => H ? jn.indexOf(H) : jn.length;
    return e.map((H, k) => ({ action: H, index: k, key: j.keys[k] })).sort((H, k) => D(H.key) - D(k.key)).filter((H) => !O || H.action.label.toLocaleLowerCase().includes(O));
  }, [e, j, l]), P = I.length ? Math.min(h, I.length - 1) : -1, U = (O) => `${v}-option-${O}`;
  Zt(() => {
    var O, D, H;
    return b.current = document.activeElement, y.current = ((D = (O = N.current) == null ? void 0 : O.parentElement) == null ? void 0 : D.closest('[role="dialog"]')) ?? null, (H = w.current) == null || H.focus({ preventScroll: !0 }), () => {
      var $;
      const k = b.current;
      k instanceof HTMLElement && k.isConnected && k.focus({ preventScroll: !0 }), document.activeElement !== k && (($ = y.current) != null && $.isConnected) && y.current.focus({ preventScroll: !0 });
    };
  }, []), W(() => {
    var O, D, H;
    P < 0 || (H = (D = (O = m.current) == null ? void 0 : O.querySelector(`[id="${U(I[P].index)}"]`)) == null ? void 0 : D.scrollIntoView) == null || H.call(D, { block: "nearest" });
  }, [P, I]);
  function ce(O, D) {
    !O || a != null && a(O.action) || o(O.action, i && D);
  }
  function se(O) {
    var H;
    O.stopPropagation();
    const D = O.code || O.key;
    if (O.repeat && !E.current.has(D)) {
      O.preventDefault();
      return;
    }
    if (O.repeat || E.current.add(D), O.key === "Escape")
      O.preventDefault(), s();
    else if (O.key === "Enter")
      O.preventDefault(), O.repeat || ce(I[P], O.shiftKey);
    else if (O.key === "ArrowDown" || O.key === "ArrowUp") {
      if (O.preventDefault(), !I.length) return;
      const k = O.key === "ArrowDown" ? 1 : -1;
      p((P + k + I.length) % I.length);
    } else O.key === "Tab" && (O.preventDefault(), (H = w.current) == null || H.focus());
  }
  return /* @__PURE__ */ c(fe, { children: [
    /* @__PURE__ */ r("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: s }),
    /* @__PURE__ */ c(
      "div",
      {
        ref: N,
        role: "dialog",
        "aria-label": "Find an action",
        className: "dq-find-action",
        onKeyDown: se,
        onMouseDown: (O) => {
          O.target !== w.current && O.preventDefault();
        },
        children: [
          /* @__PURE__ */ c("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ r(ma, { "aria-hidden": "true" }),
            /* @__PURE__ */ r(
              "input",
              {
                ref: w,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${v}-list`,
                "aria-activedescendant": P >= 0 ? U(I[P].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: l,
                onChange: (O) => {
                  d(O.target.value), p(0);
                }
              }
            ),
            /* @__PURE__ */ r("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          I.length ? /* @__PURE__ */ r(
            "ul",
            {
              ref: m,
              id: `${v}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: I.map((O, D) => /* @__PURE__ */ r("li", { role: "none", children: /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: U(O.index),
                  tabIndex: -1,
                  "aria-selected": D === P,
                  disabled: (a == null ? void 0 : a(O.action)) ?? !1,
                  onClick: (H) => ce(O, H.shiftKey),
                  children: [
                    O.key ? /* @__PURE__ */ r("kbd", { children: O.key }) : /* @__PURE__ */ r("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ r("span", { className: "dq-find-label", children: O.action.label }),
                    /* @__PURE__ */ r("span", { className: "dq-find-effect", children: cr(O.action, M, t, n).map(
                      (H, k) => /* @__PURE__ */ r("span", { "data-effect-tone": H.tone, children: H.text }, k)
                    ) })
                  ]
                }
              ) }, O.action.id))
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
const ra = (e) => e >= "0" && e <= "9";
function oo(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function so(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let n = 0, a = 0;
  for (; n < e.length && a < t.length; ) {
    if (ra(e[n]) && ra(t[a])) {
      const l = n, d = a;
      for (; n < e.length && ra(e[n]); ) n++;
      for (; a < t.length && ra(t[a]); ) a++;
      const h = e.slice(l, n).replace(/^0+/, ""), p = t.slice(d, a).replace(/^0+/, "");
      if (h.length !== p.length) return h.length < p.length ? -1 : 1;
      if (h !== p) return h < p ? -1 : 1;
      continue;
    }
    const o = oo(e[n]), s = oo(t[a]);
    if (o !== s) return o < s ? -1 : 1;
    n++, a++;
  }
  const i = e.length - n - (t.length - a);
  return i !== 0 ? i < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function Ns(e, t) {
  const n = (i) => i.tagGroupId != null ? 0 : 1, a = (i) => i.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(a(e) - a(t)) || so(e.tagGroupName, t.tagGroupName) || so(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function ar(e) {
  return [...e].sort(Ns);
}
function Ql(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const a of n.steps)
        a.mode === "REMOVE_TREE" && a.tagIds.forEach((i) => t.add(i));
  return [...t];
}
function qs(e, t, n) {
  const a = ba(e), i = [], o = [];
  for (const m of e.steps) {
    if (m.mode !== "REMOVE_TREE") {
      o.push(m);
      continue;
    }
    const N = m.tagIds.flatMap((b) => {
      const y = n.get(b);
      return y || i.push(b), y ?? [b];
    });
    o.push({ mode: "REMOVE", tagIds: N.filter((b) => !a.has(b)) });
  }
  const s = [
    ...o.filter((m) => !En(m.mode)),
    ...o.filter((m) => En(m.mode))
  ], l = new Set(t.ids), d = new Set(t.absent);
  for (const m of s)
    for (const N of m.tagIds)
      switch (m.mode) {
        case "ADD":
          l.add(N);
          break;
        case "REMOVE":
        case "REMOVE_TREE":
          l.delete(N);
          break;
        case "MARK_PRESENT":
          l.add(N), d.delete(N);
          break;
        case "MARK_ABSENT":
          l.delete(N), d.add(N);
          break;
        case "CLEAR_ABSENCE":
          d.delete(N);
          break;
      }
  const h = new Set(t.ids), p = new Set(t.absent), w = [...new Set(e.steps.flatMap((m) => m.tagIds))];
  return {
    added: w.filter((m) => l.has(m) && !h.has(m)),
    removed: [...h].filter((m) => !l.has(m)),
    markedAbsent: w.filter((m) => d.has(m) && !p.has(m)),
    absenceCleared: [...p].filter((m) => !d.has(m)),
    unresolvedTrees: [...new Set(i)]
  };
}
function Hl(e) {
  let t;
  if (e.applications) {
    const n = /* @__PURE__ */ new Map();
    for (const a of e.applications)
      n.has(a.tag.id) || n.set(a.tag.id, a.tag);
    t = [...n.values()];
  } else
    t = e.tags ?? e.ids.map((n, a) => ({ id: n, name: e.names[a] ?? "" }));
  return ar(t);
}
function Ss(e) {
  const t = Ql(e).sort((s, l) => s - l).join(","), [n, a] = C(() => /* @__PURE__ */ new Map()), i = T(/* @__PURE__ */ new Set()), o = T(!0);
  return W(() => (o.current = !0, () => {
    o.current = !1;
  }), []), W(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const l of s)
      i.current.has(l) || (i.current.add(l), ya([l]).then(
        (d) => {
          o.current && a((h) => new Map(h).set(l, d));
        },
        () => {
          i.current.delete(l);
        }
      ));
  }, [t]), n;
}
function Es() {
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
function Ai(e) {
  return xo(e.subscribe, e.get, e.get);
}
const co = Gr.map((e, t) => ({
  indent: t,
  keys: e,
  fixed: t === 2 ? ["n", "m", ",", "."] : []
}));
function Yl(e, t) {
  return t === "video" && e === "m" ? "Mute" : "";
}
function ot({ binding: e, hidden: t }) {
  return /* @__PURE__ */ r(
    "kbd",
    {
      className: Array.from(e).length === 1 ? "dq-key dq-key-letter" : "dq-key",
      "aria-hidden": t || void 0,
      children: e
    }
  );
}
function lo(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function Xl({
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
  const w = Si(), m = Er(e), N = Ct(), b = Cr(
    ye(() => e.flatMap((I) => I.steps.flatMap((P) => P.tagIds)), [e])
  ), y = co.filter((I) => I.keys.some((P) => m.actionOn.has(P))), E = y.includes(co[2]), v = e.length - m.actionOn.size, M = (I) => ({
    onMouseEnter: () => s.set(I),
    onMouseLeave: () => s.clear(I),
    onFocus: () => s.set(I),
    onBlur: (P) => {
      P.currentTarget.contains(P.relatedTarget) || s.clear(I);
    }
  }), j = (I) => {
    const P = m.actionOn.get(I), U = P === void 0 ? void 0 : e[P];
    if (!U)
      return /* @__PURE__ */ r(
        "div",
        {
          className: "dq-pad-slot dq-pad-free",
          "aria-hidden": "true",
          title: "No action on this key: it does nothing here",
          children: /* @__PURE__ */ r(ot, { binding: I })
        },
        I
      );
    const ce = n(U), se = `${N}-effect-${I}`;
    return /* @__PURE__ */ c("div", { className: "dq-pad-slot", ...p ? {} : M(U), children: [
      /* @__PURE__ */ r("span", { id: se, className: "dq-sr-only", children: cr(U, b, [], o).map((O) => O.text).join(", ") }),
      /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: U.label,
          "aria-keyshortcuts": I,
          "aria-describedby": se,
          disabled: ce,
          onClick: (O) => l(U, O.shiftKey),
          children: [
            /* @__PURE__ */ r(ot, { binding: I }),
            " ",
            /* @__PURE__ */ r("span", { className: "dq-pad-label", children: U.label }),
            lo(U) && " ",
            lo(U) && /* @__PURE__ */ c("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(Ga, { "aria-hidden": "true" }),
              "absent"
            ] })
          ]
        }
      ),
      U.steps.length > 0 && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-pad-pin",
          "aria-label": `Apply and stay: ${U.label}`,
          title: "Apply and stay (Shift)",
          disabled: ce,
          onClick: () => l(U, !0),
          children: /* @__PURE__ */ r(ci, { "aria-hidden": "true" })
        }
      )
    ] }, I);
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
            /* @__PURE__ */ r(qr, { "aria-hidden": "true" }),
            "Actions are paused while you edit the review"
          ] }) : /* @__PURE__ */ c(fe, { children: [
            /* @__PURE__ */ r(
              Zl,
              {
                actions: e,
                keyMap: m,
                names: b,
                tags: i,
                trees: o,
                preview: s,
                findKey: w.find
              }
            ),
            /* @__PURE__ */ c("span", { className: "dq-pad-hint", children: [
              /* @__PURE__ */ r("kbd", { className: "dq-key", children: "Shift" }),
              /* @__PURE__ */ r("span", { children: "+ key applies and stays" })
            ] })
          ] }),
          !E && /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "dq-pad-find-button",
              "aria-label": v ? `Find action, ${v} more` : "Find action",
              "aria-keyshortcuts": w.find,
              disabled: h,
              onClick: d,
              children: [
                /* @__PURE__ */ r(ot, { binding: w.find }),
                /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "Find action" })
              ]
            }
          )
        ] }),
        y.map((I) => /* @__PURE__ */ c("div", { className: "dq-pad-row", "data-indent": I.indent, children: [
          I.keys.map(j),
          I.fixed.map((P) => {
            const U = Yl(P, t);
            return /* @__PURE__ */ c(
              "div",
              {
                className: `dq-pad-slot dq-pad-free dq-pad-fixed${U ? " dq-pad-reserved" : ""}`,
                "aria-hidden": "true",
                children: [
                  /* @__PURE__ */ r(ot, { binding: P }),
                  U && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: U })
                ]
              },
              P
            );
          }),
          I.fixed.length > 0 && /* @__PURE__ */ r("div", { className: "dq-pad-slot", children: /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": v ? `Find action, ${v} more` : "Find action",
              "aria-keyshortcuts": w.find,
              disabled: h,
              onClick: d,
              children: [
                /* @__PURE__ */ r(ot, { binding: w.find }),
                /* @__PURE__ */ c("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ r(ma, { "aria-hidden": "true" }),
                  v ? `${v} more` : "Find action"
                ] })
              ]
            }
          ) })
        ] }, I.indent))
      ]
    }
  );
}
function Zl({
  actions: e,
  keyMap: t,
  names: n,
  tags: a,
  trees: i,
  preview: o,
  findKey: s
}) {
  const l = Ai(o), d = l ? e.indexOf(l) : -1;
  if (!l || d < 0) {
    const m = t.actionOn.size;
    return /* @__PURE__ */ c("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      m < e.length && /* @__PURE__ */ c(fe, { children: [
        ` · ${m} on keys, ${e.length - m} more under `,
        /* @__PURE__ */ r(ot, { binding: s })
      ] })
    ] });
  }
  const h = t.keys[d], p = a && l.steps.length ? qs(l, a, i) : null, w = p && !p.unresolvedTrees.length && ![p.added, p.removed, p.markedAbsent, p.absenceCleared].some(
    (m) => m.length
  );
  return /* @__PURE__ */ c("p", { className: "dq-pad-effect", children: [
    h && /* @__PURE__ */ r(ot, { binding: h }),
    /* @__PURE__ */ r("strong", { children: l.label }),
    cr(l, n, [], i).map((m, N) => /* @__PURE__ */ r("span", { "data-effect-tone": m.tone, children: m.text }, N)),
    w && /* @__PURE__ */ r("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function Cs({
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
  className: w = "",
  paused: m = !1
}) {
  const N = Si(), b = Er(e), y = Ct(), E = Cr(ye(() => va(e), [e])), [v] = C(() => Es()), M = T(null), j = ed(M, e), I = Gr.map(
    (O) => O.flatMap((D) => b.actionOn.get(D) ?? [])
  ).filter((O) => O.length > 0);
  !I.length && e.length && I.push([]);
  const P = I.flat(), U = e.length - P.length, ce = (O) => cr(O, E, t, n).map((D) => D.text).join(", "), se = (O) => ({
    onMouseEnter: () => v.set(O),
    onMouseLeave: () => v.clear(O),
    onFocus: () => v.set(O),
    onBlur: (D) => {
      D.currentTarget.contains(D.relatedTarget) || v.clear(O);
    }
  });
  return /* @__PURE__ */ c(
    "section",
    {
      ref: M,
      className: `dq-action-bar${j ? " dq-bar-stacked" : ""}${i ? " dq-bar-busy" : ""}${m ? " dq-bar-paused" : ""}${w ? ` ${w}` : ""}`,
      "aria-label": "Actions",
      children: [
        /* @__PURE__ */ r("div", { className: "dq-bar-summary", children: l }),
        /* @__PURE__ */ r("span", { className: "dq-bar-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ c("div", { className: "dq-bar-tiles", "aria-busy": i || void 0, children: [
          I.map((O, D) => /* @__PURE__ */ c("div", { className: "dq-bar-line", children: [
            O.map((H) => {
              const k = e[H], $ = b.keys[H];
              return /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: "dq-bar-tile",
                  title: k.label,
                  "aria-keyshortcuts": $ || void 0,
                  "aria-describedby": `${y}-effect-${H}`,
                  disabled: m || a(k),
                  onClick: () => o(k),
                  ...m ? {} : se(k),
                  children: [
                    $ && /* @__PURE__ */ r(ot, { binding: $ }),
                    " ",
                    /* @__PURE__ */ r("span", { className: "dq-bar-label", children: k.label })
                  ]
                },
                k.id
              );
            }),
            D === I.length - 1 && /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "dq-bar-tile dq-bar-find",
                "aria-label": U > 0 ? `Find action, ${U} more` : "Find action",
                "aria-keyshortcuts": N.find,
                disabled: m,
                onClick: s,
                children: [
                  /* @__PURE__ */ r(ot, { binding: N.find, hidden: !0 }),
                  /* @__PURE__ */ r(ma, { "aria-hidden": "true" }),
                  /* @__PURE__ */ r("span", { className: "dq-bar-label", children: U > 0 ? `${U} more` : "Find action" })
                ]
              }
            )
          ] }, D)),
          !e.length && /* @__PURE__ */ r("p", { className: "dq-bar-empty", children: "This review has no actions." })
        ] }),
        d && /* @__PURE__ */ r("p", { className: "dq-bar-hints", children: d }),
        m ? /* @__PURE__ */ c("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ r(qr, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ r(
          td,
          {
            actions: e,
            keyMap: b,
            preview: v,
            names: E,
            tagGroups: t,
            trees: n
          }
        ),
        h && /* @__PURE__ */ r("div", { className: "dq-bar-notices", children: h }),
        /* @__PURE__ */ r("div", { hidden: !0, children: P.map((O) => /* @__PURE__ */ r("span", { id: `${y}-effect-${O}`, children: ce(e[O]) }, e[O].id)) }),
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: p })
      ]
    }
  );
}
function ed(e, t) {
  const [n, a] = C(!1);
  return Zt(() => {
    var h;
    const i = e.current;
    if (!i || typeof ResizeObserver > "u") return;
    const o = i.querySelector(".dq-bar-summary"), s = () => {
      const p = getComputedStyle(i), w = parseFloat(p.columnGap) || 0, m = i.clientWidth - (parseFloat(p.paddingLeft) || 0) - (parseFloat(p.paddingRight) || 0), N = [...i.querySelectorAll(".dq-bar-line")].map(
        (U) => [...U.children].map((ce) => ce.offsetWidth)
      ), b = i.querySelector(".dq-bar-line"), y = b && parseFloat(getComputedStyle(b).columnGap) || 0, E = i.querySelector(".dq-bar-hints"), v = ((o == null ? void 0 : o.offsetWidth) ?? 0) + (E ? E.offsetWidth + w : 0) + 1 + // the divider
      2 * w, M = (U) => N.map((ce) => {
        let se = 1, O = 0;
        for (const D of ce)
          O > 0 && O + y + D > U ? (se += 1, O = D) : O += (O > 0 ? y : 0) + D;
        return se;
      }), j = (U) => Math.max(1, U.reduce((ce, se) => ce + se, 0)), I = M(m), P = j(M(m - v));
      a(
        1 + j(I) < P || 1 + j(I) === P && I.every((U) => U === 1)
      );
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
function td({
  actions: e,
  keyMap: t,
  preview: n,
  names: a,
  tagGroups: i,
  trees: o
}) {
  const s = Ai(n), l = s ? e.indexOf(s) : -1;
  if (!s || l < 0) return null;
  const d = t.keys[l];
  return /* @__PURE__ */ c("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    d && /* @__PURE__ */ r(ot, { binding: d }),
    /* @__PURE__ */ r("strong", { children: s.label }),
    cr(s, a, i, o).map((h, p) => /* @__PURE__ */ r("span", { "data-effect-tone": h.tone, children: h.text }, p))
  ] });
}
const uo = 1e3;
async function nd(e, t, n) {
  const a = await oe(
    `/api/tags/${t}`,
    { signal: n }
  ), i = /* @__PURE__ */ new Map();
  for (let d = 1; ; d++) {
    const h = await oe(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          An({
            findFilter: {
              page: d,
              perPage: uo,
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
    if (d * uo >= h.totalCount) break;
    if (!h.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const o = [...i.values()], s = Re(e), l = Se(e) ? await ad(
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
function rd(e) {
  return JSON.stringify(
    An({
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
async function ad(e, t, n) {
  const a = new Array(t.length).fill(0), i = new AbortController(), o = () => i.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && o(), n == null || n.addEventListener("abort", o, { once: !0 });
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; s < t.length && !i.signal.aborted; ) {
            const l = s++;
            a[l] = (await oe(
              `/api/${Gn(e)}/aggregate`,
              {
                method: "POST",
                signal: i.signal,
                body: rd(t[l])
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
function id(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((a) => t.has(a.id) ? !1 : (t.add(a.id), !0))
  }));
}
function od(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of n.children)
      t.set(a.id, [...t.get(a.id) ?? [], n.parent.id]);
  return t;
}
function sd(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of ba(n))
      t.set(a, [...t.get(a) ?? [], n]);
  return t;
}
function cd(e, t) {
  return {
    id: crypto.randomUUID(),
    label: e.name,
    steps: [
      { mode: "ADD", tagIds: [e.id] },
      ...t.length ? [{ mode: "REMOVE_TREE", tagIds: t }] : []
    ]
  };
}
const ld = (e) => e instanceof Error ? e.message : "Request failed.";
function dd({
  id: e,
  review: t,
  disabled: n,
  onAdd: a,
  onCancel: i
}) {
  const [o, s] = C([]), [l, d] = C({}), [h, p] = C({}), [w, m] = C({}), N = T(/* @__PURE__ */ new Map());
  W(
    () => () => {
      for (const $ of N.current.values()) $.abort();
    },
    []
  );
  const b = mn(Re(t)), y = Se(t), E = y ? "performer" : b.one;
  function v($) {
    var re;
    (re = N.current.get($)) == null || re.abort();
    const B = new AbortController();
    N.current.set($, B), d((X) => ({ ...X, [$]: { status: "loading" } })), nd(t, $, B.signal).then(
      (X) => {
        B.signal.aborted || d((de) => ({
          ...de,
          [$]: { status: "ready", group: X }
        }));
      },
      (X) => {
        B.signal.aborted || d((de) => ({
          ...de,
          [$]: { status: "failed", message: ld(X) }
        }));
      }
    );
  }
  function M($) {
    var F;
    const B = o.filter((z) => !$.includes(z));
    for (const z of B)
      (F = N.current.get(z)) == null || F.abort(), N.current.delete(z);
    const re = (z) => {
      const V = l[z];
      return (V == null ? void 0 : V.status) === "ready" ? V.group.children.map((K) => K.id) : [];
    }, X = new Set($.flatMap(re)), de = B.flatMap(re).filter((z) => !X.has(z));
    p(
      (z) => Object.fromEntries(
        Object.entries(z).filter(([V]) => !de.includes(Number(V)))
      )
    ), m(
      (z) => Object.fromEntries(
        Object.entries(z).filter(([V]) => $.includes(Number(V)))
      )
    ), d(
      (z) => Object.fromEntries(
        Object.entries(z).filter(([V]) => $.includes(Number(V)))
      )
    ), s($);
    for (const z of $) o.includes(z) || v(z);
  }
  const j = o.flatMap(($) => {
    const B = l[$];
    return (B == null ? void 0 : B.status) === "ready" ? [B.group] : [];
  }), I = j.length === o.length, P = o.some(
    ($) => {
      var B;
      return (((B = l[$]) == null ? void 0 : B.status) ?? "loading") === "loading";
    }
  ), U = new Map(
    id(j).map(($) => [$.parent.id, $])
  ), ce = od(j), se = new Map(j.map(($) => [$.parent.id, $.parent.name])), O = sd(t.actions), D = ($) => h[$] ?? !O.has($), H = I ? [...U.values()].flatMap(
    ($) => $.children.filter((B) => D(B.id))
  ) : [], k = ($, B) => p((re) => ({
    ...re,
    ...Object.fromEntries($.children.map((X) => [X.id, B]))
  }));
  return /* @__PURE__ */ c("fieldset", { id: e, className: "dq-actions-from-tags", children: [
    /* @__PURE__ */ r("legend", { children: "Add actions from parent tags" }),
    /* @__PURE__ */ c("p", { className: "dq-drawer-note", children: [
      "Each ticked child tag becomes an action that adds it, most used",
      " ",
      y ? "on performers " : "",
      "first. Tags an action already adds start unticked. The new actions go at the end, ready to reorder and edit."
    ] }),
    /* @__PURE__ */ r(
      Cn,
      {
        entityType: "tag",
        values: o,
        onChange: M,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    o.map(($) => {
      const B = l[$];
      if (!B || B.status === "loading")
        return /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Loading child tags…" }, $);
      if (B.status === "failed")
        return /* @__PURE__ */ c("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ c("span", { children: [
            "Child tags could not be loaded. ",
            B.message
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: n,
              onClick: () => v($),
              children: "Retry"
            }
          )
        ] }, $);
      const re = U.get($);
      if (!re) return null;
      const X = re.parent.name;
      return /* @__PURE__ */ c("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ r("legend", { children: X }),
        B.group.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ c(fe, { children: [
          /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: w[$] ?? !1,
                disabled: n,
                onChange: (de) => m((F) => ({
                  ...F,
                  [$]: de.target.checked
                }))
              }
            ),
            "Only one per ",
            E,
            ": each action removes every other tag in the ",
            X,
            " tree"
          ] }),
          re.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ c(fe, { children: [
            /* @__PURE__ */ c("div", { className: "dq-row", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${X}`,
                  onClick: () => k(re, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${X}`,
                  onClick: () => k(re, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ r("div", { className: "dq-child-tags", children: re.children.map((de) => {
              const F = O.get(de.id) ?? [], z = (ce.get(de.id) ?? []).filter((V) => V !== $).map((V) => `“${se.get(V)}”`);
              return /* @__PURE__ */ c("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "checkbox",
                    checked: D(de.id),
                    disabled: n,
                    onChange: (V) => p((K) => ({
                      ...K,
                      [de.id]: V.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ c("span", { children: [
                  de.name,
                  " ",
                  /* @__PURE__ */ c("small", { children: [
                    de.uses.toLocaleString(),
                    " ",
                    de.uses === 1 ? b.one : b.many
                  ] }),
                  z.length > 0 && /* @__PURE__ */ c("small", { children: [
                    " · Also under ",
                    z.join(", ")
                  ] }),
                  F.length > 0 && /* @__PURE__ */ c("small", { children: [
                    " ",
                    "· Already in “",
                    F[0].label || "New action",
                    "”",
                    F.length > 1 ? ` and ${F.length - 1} more` : ""
                  ] })
                ] })
              ] }, de.id);
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
          disabled: n || !H.length,
          onClick: () => a(
            H.map(
              ($) => cd(
                $,
                (ce.get($.id) ?? []).filter(
                  (B) => w[B]
                )
              )
            )
          ),
          children: H.length ? `Add ${H.length} action${H.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: i, children: "Cancel" }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-sr-only", children: P ? "Loading child tags…" : "" })
    ] })
  ] });
}
const ud = ["n", "m"], Pn = [
  ...Gr,
  ["auto", Un]
];
function fa(e) {
  return e.toLocaleUpperCase();
}
function ks(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : gi(e[n]);
}
function fd({
  actions: e,
  index: t,
  keyMap: n,
  name: a,
  onChoose: i
}) {
  const [o, s] = C(!1), l = T(null), d = n.keys[t], h = ks(e, n, t), p = rr(h), w = n.duplicatePins.has(t) ? ` (${fa(e[t].shortcut ?? "")} is pinned twice)` : "", m = d ? `${fa(d)}, ${p ? "pinned" : "Auto"}${w}` : h === Un ? "no key, Find action only" : `no key: Auto found no free key${w}`, N = () => {
    var b;
    s(!1), (b = l.current) == null || b.focus();
  };
  return /* @__PURE__ */ c(fe, { children: [
    /* @__PURE__ */ c(
      "button",
      {
        ref: l,
        type: "button",
        className: "dq-key-button",
        "aria-label": `Key for ${a}: ${m}`,
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        title: "Choose the key",
        onClick: () => s(!o),
        children: [
          d ? /* @__PURE__ */ r(ot, { binding: d }) : /* @__PURE__ */ r("span", { className: "dq-key dq-key-none", children: "·" }),
          p && /* @__PURE__ */ r(ci, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ r(
      hd,
      {
        actions: e,
        index: t,
        keyMap: n,
        name: a,
        onChoose: (b) => {
          i(b), N();
        },
        onClose: N
      }
    )
  ] });
}
function hd({
  actions: e,
  index: t,
  keyMap: n,
  name: a,
  onChoose: i,
  onClose: o
}) {
  const s = T(null), l = n.keys[t], d = ks(e, n, t), [h, p] = C(l || "q"), w = (y) => {
    var E;
    return ((E = s.current) == null ? void 0 : E.querySelector(`[data-choice="${y}"]`)) ?? null;
  };
  Zt(() => {
    var y, E, v;
    (y = w(l || d)) == null || y.focus(), (v = (E = s.current) == null ? void 0 : E.scrollIntoView) == null || v.call(E, { block: "nearest" });
  }, []);
  function m(y) {
    var E;
    rr(y) && p(y), (E = w(y)) == null || E.focus();
  }
  function N(y) {
    var U, ce, se;
    if (y.key === "Escape") {
      y.preventDefault(), y.stopPropagation(), o();
      return;
    }
    if (y.key === "Tab") {
      const O = [...((U = s.current) == null ? void 0 : U.querySelectorAll("button[tabindex='0']")) ?? []], D = O.indexOf(document.activeElement);
      y.preventDefault(), (ce = O[(D + (y.shiftKey ? -1 : 1) + O.length) % O.length]) == null || ce.focus();
      return;
    }
    const E = (se = y.target.dataset) == null ? void 0 : se.choice, v = E ? Pn.findIndex((O) => O.includes(E)) : -1;
    if (!E || v < 0) return;
    const M = Pn[v].indexOf(E), j = (O) => O == null ? void 0 : O[Math.min(M, O.length - 1)], I = {
      ArrowLeft: Pn[v][M - 1],
      ArrowRight: Pn[v][M + 1],
      ArrowUp: j(Pn[v - 1]),
      ArrowDown: j(Pn[v + 1]),
      Home: Pn[v][0],
      End: Pn[v].at(-1)
    };
    if (!Object.hasOwn(I, y.key)) return;
    y.preventDefault();
    const P = I[y.key];
    P && m(P);
  }
  const b = (y) => {
    const E = rr(y) ? n.actionOn.get(y) : void 0;
    return E === void 0 ? null : {
      own: E === t,
      label: e[E].label.trim() || "New action",
      pinned: gi(e[E]) === y
    };
  };
  return /* @__PURE__ */ c(fe, { children: [
    /* @__PURE__ */ r(
      "div",
      {
        className: "dq-key-picker-backdrop",
        "aria-hidden": "true",
        onMouseDown: (y) => {
          y.preventDefault(), o();
        }
      }
    ),
    /* @__PURE__ */ c(
      "div",
      {
        ref: s,
        role: "dialog",
        "aria-label": `Key for ${a}`,
        className: "dq-key-picker",
        onKeyDown: N,
        children: [
          /* @__PURE__ */ c("p", { className: "dq-key-picker-title", children: [
            "Key for ",
            /* @__PURE__ */ r("strong", { children: a })
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: Gr.map((y, E) => /* @__PURE__ */ c("div", { className: "dq-key-picker-row", "data-indent": E, children: [
            y.map((v) => {
              const M = b(v), j = M ? `${M.own ? "this action" : M.label}, ${M.pinned ? "pinned" : "Auto"}` : "free";
              return /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: `dq-key-choice${M ? "" : " dq-key-choice-free"}${M != null && M.own ? " dq-key-choice-own" : ""}`,
                  "data-choice": v,
                  tabIndex: v === h ? 0 : -1,
                  "aria-label": `${fa(v)}: ${j}`,
                  "aria-pressed": !!(M != null && M.own && M.pinned),
                  title: M ? `${M.label} (${M.pinned ? "pinned" : "Auto"})` : void 0,
                  onFocus: () => p(v),
                  onClick: () => i(v),
                  children: [
                    /* @__PURE__ */ c("span", { className: "dq-key-choice-head", children: [
                      /* @__PURE__ */ r(ot, { binding: v }),
                      (M == null ? void 0 : M.pinned) && /* @__PURE__ */ r(ci, { "aria-hidden": "true" })
                    ] }),
                    M && /* @__PURE__ */ r("span", { className: "dq-key-choice-label", children: M.label })
                  ]
                },
                v
              );
            }),
            E === Gr.length - 1 && ud.map((v) => /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-key-choice dq-key-choice-free",
                "aria-label": `${fa(v)}: not available, it steps through the grid preview`,
                title: "Steps through the grid preview",
                disabled: !0,
                children: /* @__PURE__ */ r("span", { className: "dq-key-choice-head", children: /* @__PURE__ */ r(ot, { binding: v }) })
              },
              v
            ))
          ] }, E)) }),
          /* @__PURE__ */ c("div", { className: "dq-key-picker-choices", children: [
            /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "dq-key-picker-choice",
                "data-choice": "auto",
                tabIndex: 0,
                "aria-pressed": d === "auto",
                onClick: () => i("auto"),
                children: [
                  /* @__PURE__ */ r("strong", { children: "Auto" }),
                  /* @__PURE__ */ r("span", { children: "the next free key" })
                ]
              }
            ),
            /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "dq-key-picker-choice",
                "data-choice": Un,
                tabIndex: 0,
                "aria-pressed": d === Un,
                onClick: () => i(Un),
                children: [
                  /* @__PURE__ */ r("strong", { children: "No key" }),
                  /* @__PURE__ */ r("span", { children: "Find action only" })
                ]
              }
            ),
            /* @__PURE__ */ r("p", { className: "dq-key-picker-hint", children: "The action on the key you choose takes this one's pinned key, or Auto." })
          ] })
        ]
      }
    )
  ] });
}
const pd = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function md(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function gd(e, t) {
  if (kn(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (bi(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function As(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function bd(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function wd({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: a,
  saving: i,
  expandedId: o,
  onExpand: s,
  reveal: l
}) {
  const d = Me(e), h = d !== "tag", p = e.actions, w = Er(p), m = Cr(ye(() => va(p), [p])), [N, b] = C(""), [y, E] = C(!1), [v, M] = C(
    null
  ), j = Ct(), I = `${j}-from-tags`, P = T(null), U = T(null), ce = T(null), se = T(null), O = T(/* @__PURE__ */ new WeakMap()), D = (K) => {
    let te = O.current.get(K);
    return te || (te = crypto.randomUUID(), O.current.set(K, te)), te;
  }, H = N.trim().toLocaleLowerCase(), k = H ? p.filter((K) => K.label.toLocaleLowerCase().includes(H)) : p, $ = (K) => t({ ...e, actions: K }), B = (K, te) => $(p.map((ve, Ne) => Ne === K ? te : ve));
  function re(K) {
    var te;
    return [...((te = ce.current) == null ? void 0 : te.querySelectorAll("[data-action-id]")) ?? []].find(
      (ve) => ve.dataset.actionId === K
    );
  }
  function X(K, te) {
    const ve = re(K), Ne = ve == null ? void 0 : ve.querySelector(
      te === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return Ne == null || Ne.focus(), !!Ne;
  }
  Zt(() => {
    var te;
    const K = se.current;
    K && (se.current = null, (K === "add" || !X(K.id, K.part)) && ((te = U.current) == null || te.focus()));
  }), W(() => {
    !l || !o || (k.some((K) => K.id === o) ? X(o, "label") : (b(""), se.current = { id: o, part: "label" }));
  }, [l]);
  function de() {
    const K = bd(d);
    b(""), $([...p, K]), s(K.id), se.current = { id: K.id, part: "label" };
  }
  function F(K) {
    const te = p[K], { shortcut: ve, ...Ne } = structuredClone(te), mt = {
      ...Ne,
      ...ve === Un ? { shortcut: ve } : {},
      id: crypto.randomUUID(),
      label: `${te.label} copy`
    };
    $([...p.slice(0, K + 1), mt, ...p.slice(K + 1)]), s(mt.id), se.current = { id: mt.id, part: "label" };
  }
  function z(K) {
    const te = p[K], ve = k.indexOf(te), Ne = k[ve + 1] ?? k[ve - 1];
    $(p.filter((mt, tt) => tt !== K)), o === te.id && s(null), se.current = Ne ? { id: Ne.id, part: "toggle" } : "add";
  }
  function V() {
    E(!1), requestAnimationFrame(() => {
      var K;
      return (K = P.current) == null ? void 0 : K.focus();
    });
  }
  return /* @__PURE__ */ c("div", { className: "dq-actions-editor", children: [
    /* @__PURE__ */ c("div", { className: "dq-actions-head", children: [
      /* @__PURE__ */ c("div", { className: "dq-actions-toolbar", children: [
        /* @__PURE__ */ c(
          "button",
          {
            ref: U,
            type: "button",
            className: "dq-header-button",
            onClick: de,
            children: [
              /* @__PURE__ */ r(li, { "aria-hidden": "true" }),
              "Add action"
            ]
          }
        ),
        h && /* @__PURE__ */ r(
          "button",
          {
            ref: P,
            type: "button",
            className: "dq-header-button",
            "aria-expanded": y,
            "aria-controls": y ? I : void 0,
            onClick: () => {
              M(null), E(!y);
            },
            children: "Add from parent tags…"
          }
        ),
        /* @__PURE__ */ c("label", { className: "dq-actions-filter", children: [
          /* @__PURE__ */ r(ma, { "aria-hidden": "true" }),
          /* @__PURE__ */ r(
            "input",
            {
              type: "search",
              "aria-label": "Find an action",
              placeholder: "Find an action…",
              autoComplete: "off",
              spellCheck: !1,
              value: N,
              onChange: (K) => b(K.target.value),
              onKeyDown: (K) => {
                K.key === "Escape" && N && (K.preventDefault(), K.stopPropagation(), b(""));
              }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-actions-hint", children: "Choose a key on its key cap; Auto takes the next free key in this order. Drag a handle, or press Alt + ↑ / ↓, to reorder." }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-actions-status", children: (v == null ? void 0 : v.actions) === p ? `Added ${v.count} action${v.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    h && y && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here.
    /* @__PURE__ */ r(
      "div",
      {
        onKeyDown: (K) => {
          K.key !== "Escape" || K.defaultPrevented || (K.preventDefault(), K.stopPropagation(), V());
        },
        children: /* @__PURE__ */ r(
          dd,
          {
            id: I,
            review: e,
            disabled: i,
            onAdd: (K) => {
              const te = [...p, ...K];
              $(te), M({ actions: te, count: K.length }), V();
            },
            onCancel: V
          }
        )
      }
    ),
    /* @__PURE__ */ r("div", { ref: ce, children: k.length > 0 && /* @__PURE__ */ r(
      Po,
      {
        items: k,
        getKey: (K) => K.id,
        disabled: i || !!H,
        className: "dq-action-list",
        onReorder: (K) => $(K),
        renderItem: (K, { dragHandleProps: te, isOver: ve }) => {
          const Ne = p.indexOf(K), mt = o === K.id;
          return /* @__PURE__ */ r(
            yd,
            {
              action: K,
              entityType: d,
              keyButton: /* @__PURE__ */ r(
                fd,
                {
                  actions: p,
                  index: Ne,
                  keyMap: w,
                  name: K.label.trim() || "New action",
                  onChoose: (tt) => $(il(p, Ne, tt))
                }
              ),
              takenPin: w.duplicatePins.has(Ne) ? K.shortcut : void 0,
              effect: cr(K, m, n, a),
              open: mt,
              detailId: `${j}-detail-${K.id}`,
              dragHandleProps: te,
              isOver: ve,
              reorderDisabled: i || !!H,
              onToggle: () => s(mt ? null : K.id),
              onDuplicate: () => F(Ne),
              onDelete: () => z(Ne),
              children: "steps" in K ? /* @__PURE__ */ r(
                vd,
                {
                  action: K,
                  saving: i,
                  stepKey: D,
                  rememberStepKey: (tt, ut) => O.current.set(tt, D(ut)),
                  onChange: (tt) => B(Ne, tt)
                }
              ) : /* @__PURE__ */ r(
                qd,
                {
                  action: K,
                  tagGroups: n,
                  onChange: (tt) => B(Ne, tt)
                }
              )
            }
          );
        }
      }
    ) }),
    p.length ? !k.length && /* @__PURE__ */ c("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      N.trim(),
      "”."
    ] }) : /* @__PURE__ */ r("p", { className: "dq-actions-empty", children: h ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function yd({
  action: e,
  entityType: t,
  keyButton: n,
  takenPin: a,
  effect: i,
  open: o,
  detailId: s,
  dragHandleProps: l,
  isOver: d,
  reorderDisabled: h,
  onToggle: p,
  onDuplicate: w,
  onDelete: m,
  children: N
}) {
  const b = e.label.trim() || "New action", y = gd(e, t);
  return /* @__PURE__ */ c(
    "div",
    {
      className: `dq-action-row${o ? " dq-action-row-open" : ""}${d ? " dq-drag-over" : ""}`,
      "data-action-id": e.id,
      children: [
        /* @__PURE__ */ c("div", { className: "dq-action-row-head", children: [
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              ...l,
              style: As(l.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${b}`,
              title: h ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: h,
              children: /* @__PURE__ */ r(Uo, { "aria-hidden": "true" })
            }
          ),
          n,
          /* @__PURE__ */ c("div", { className: "dq-action-row-summary", onClick: p, children: [
            /* @__PURE__ */ r("span", { className: "dq-action-row-label", title: b, children: b }),
            !o && /* @__PURE__ */ r("span", { className: "dq-action-row-effect", children: i.map((E, v) => /* @__PURE__ */ r("span", { "data-effect-tone": E.tone, children: E.text }, v)) }),
            y && /* @__PURE__ */ c("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ r(Dn, { "aria-hidden": "true" }),
              y
            ] }),
            a && /* @__PURE__ */ c(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${a.toLocaleUpperCase()} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ r(Dn, { "aria-hidden": "true" }),
                  `${a.toLocaleUpperCase()} is pinned twice`
                ]
              }
            )
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Duplicate ${b}`,
              title: "Duplicate",
              onClick: w,
              children: /* @__PURE__ */ r(Ko, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Delete ${b}`,
              title: "Delete",
              onClick: m,
              children: /* @__PURE__ */ r(Go, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small dq-action-toggle",
              "aria-label": `${o ? "Collapse" : "Expand"} ${b}`,
              "aria-expanded": o,
              "aria-controls": o ? s : void 0,
              onClick: p,
              children: /* @__PURE__ */ r(Bo, { "aria-hidden": "true" })
            }
          )
        ] }),
        o && /* @__PURE__ */ r("div", { id: s, className: "dq-action-detail", children: N })
      ]
    }
  );
}
function Ts({
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
function vd({
  action: e,
  saving: t,
  stepKey: n,
  rememberStepKey: a,
  onChange: i
}) {
  const o = Ct(), s = T(null), l = T(null);
  Zt(() => {
    var p, w;
    const h = l.current;
    h != null && (l.current = null, (w = (p = s.current) == null ? void 0 : p.querySelector(`[data-step-index="${h}"] input`)) == null || w.focus());
  });
  const d = (h) => i({ ...e, steps: h });
  return /* @__PURE__ */ c(fe, { children: [
    /* @__PURE__ */ r(Ts, { action: e, onChange: (h) => i({ ...e, label: h }) }),
    /* @__PURE__ */ c("div", { className: "dq-action-field dq-action-field-top", role: "group", "aria-labelledby": o, children: [
      /* @__PURE__ */ r("span", { className: "dq-action-field-name", id: o, children: "Steps" }),
      /* @__PURE__ */ c("div", { className: "dq-steps", ref: s, children: [
        e.steps.length > 0 ? /* @__PURE__ */ r(
          Po,
          {
            items: e.steps,
            getKey: n,
            disabled: t,
            className: "dq-step-list",
            onReorder: d,
            renderItem: (h, { index: p, dragHandleProps: w, isOver: m }) => /* @__PURE__ */ r(
              Nd,
              {
                step: h,
                index: p,
                dragHandleProps: w,
                isOver: m,
                saving: t,
                onChange: (N) => {
                  a(N, h), d(e.steps.map((b, y) => y === p ? N : b));
                },
                onRemove: () => d(e.steps.filter((N, b) => b !== p))
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
              /* @__PURE__ */ r(li, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function Nd({
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
      "data-step-tone": md(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            ...n,
            style: As(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${l}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: i,
            children: [
              /* @__PURE__ */ r(Uo, { "aria-hidden": "true" }),
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
            children: pd.map(({ mode: d, label: h }) => /* @__PURE__ */ r("option", { value: d, children: h }, d))
          }
        ),
        /* @__PURE__ */ r(
          Cn,
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
            children: /* @__PURE__ */ r(Jr, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function qd({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const a = e.effect, i = a.mode === "SET_TAG_GROUP" ? `group:${a.tagGroupId}` : a.mode, o = a.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === a.tagGroupId);
  return /* @__PURE__ */ c(fe, { children: [
    /* @__PURE__ */ r(Ts, { action: e, onChange: (s) => n({ ...e, label: s }) }),
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
function Sd({
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
      Cn,
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
function Ed({
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
      Cn,
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
const Rs = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, Is = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, Cd = {
  video: ga,
  audio: zo,
  tag: Jo,
  performerOccurrence: Vo,
  audioPerformerOccurrence: Vc
};
function Os({ entityType: e }) {
  const t = Cd[e];
  return /* @__PURE__ */ r(t, { role: "img", "aria-label": Rs[e] });
}
const kd = 2e6;
function $s(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), a = document.createElement("a");
  a.href = n, a.download = t, a.click(), URL.revokeObjectURL(n);
}
function Ad(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function Ti(e) {
  $s([e], Ad(e));
}
async function Td(e) {
  if (e.size > kd) throw new Error("Review files must be smaller than 2 MB.");
  const t = await e.text();
  try {
    return Wr(t);
  } catch (n) {
    throw new Error(
      n instanceof SyntaxError ? "It is not a JSON file." : "It does not hold valid Data Quality reviews."
    );
  }
}
function Nr(e) {
  const { page: t, ...n } = e.view.filter;
  return JSON.stringify(
    { ...e, view: { ...e.view, filter: n } },
    (a, i) => i && typeof i == "object" && !Array.isArray(i) ? Object.fromEntries(
      Object.keys(i).sort().map((o) => [o, i[o]])
    ) : i
  );
}
function Ms({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: a,
  nameRef: i,
  autoFocus: o = !1
}) {
  return /* @__PURE__ */ c(fe, { children: [
    /* @__PURE__ */ c("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ r("span", { children: "Entity type" }),
      /* @__PURE__ */ r(
        "select",
        {
          className: "dq-select",
          "aria-label": "Entity type",
          value: Me(e),
          disabled: n,
          onChange: (s) => a == null ? void 0 : a(s.target.value),
          children: Zo.map((s) => /* @__PURE__ */ r("option", { value: s, children: Is[s] }, s))
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
function Rd(e, t) {
  const n = Me(e), a = ["Review"];
  return (n === "video" || n === "tag") && a.push("Appearance"), a.push("Actions"), t && a.push("Tag choices"), a;
}
function Id({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = T(null), a = T(null), i = Ct(), o = Ct();
  return W(() => {
    var s;
    n.current && !n.current.open && n.current.showModal(), (s = a.current) == null || s.focus();
  }, []), /* @__PURE__ */ c(
    "dialog",
    {
      ref: n,
      className: "dq-confirm-dialog",
      "aria-labelledby": i,
      "aria-describedby": o,
      "aria-modal": "true",
      onCancel: (s) => {
        s.preventDefault(), e();
      },
      onClose: e,
      children: [
        /* @__PURE__ */ r("h2", { id: i, children: "Discard unsaved changes?" }),
        /* @__PURE__ */ r("p", { id: o, children: "Closing the editor leaves the review as it was last saved." }),
        /* @__PURE__ */ c("div", { className: "dq-confirm-dialog-actions", children: [
          /* @__PURE__ */ r("button", { ref: a, type: "button", className: "dq-button", onClick: e, children: "Keep editing" }),
          /* @__PURE__ */ r("button", { type: "button", className: "dq-button dq-button-danger", onClick: t, children: "Discard" })
        ] })
      ]
    }
  );
}
function Fs({
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
  criteriaChanged: p = !1,
  notices: w,
  onSave: m,
  onCancel: N,
  drawerRef: b
}) {
  const [y, E] = C("Review"), [v] = C(
    () => Se(e) && e.occurrence.tagIds.length > 0
  ), [M, j] = C(""), [I, P] = C(null), [U, ce] = C(0), [se, O] = C(!1), D = T(null), H = T(null), k = T(null), $ = Rd(e, v), B = Me(e), re = ye(() => Nr(e), [e]);
  W(() => j(""), [re]), W(() => {
    var K, te;
    if (se) return;
    const z = D.current;
    if (D.current = null, !z) return;
    (te = z.isConnected && !!((K = k.current) != null && K.contains(z)) && !(z instanceof HTMLButtonElement && z.disabled) ? z : k.current) == null || te.focus({ preventScroll: !0 });
  }, [se]);
  function X() {
    if (!(s || se)) {
      if (!h) {
        N();
        return;
      }
      D.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, O(!0);
    }
  }
  function de() {
    const z = { ...e, name: e.name.trim() }, V = Br(z);
    if (!V) {
      j(""), m();
      return;
    }
    if (j(V), !z.name) {
      E("Review"), requestAnimationFrame(() => {
        var te;
        return (te = H.current) == null ? void 0 : te.focus();
      });
      return;
    }
    const K = e.actions.find(
      (te) => !kn(te, B)
    );
    K && (E("Actions"), P(K.id), ce((te) => te + 1));
  }
  const F = M || d;
  return /* @__PURE__ */ c(fe, { children: [
    /* @__PURE__ */ c(
      "aside",
      {
        ref: (z) => {
          k.current = z, b && (b.current = z);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (z) => {
          z.key !== "Escape" || z.defaultPrevented || s || (z.preventDefault(), z.stopPropagation(), X());
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
                onClick: X,
                children: /* @__PURE__ */ r(Jr, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ r(
            Mc,
            {
              tabs: $.map((z) => ({
                key: z,
                label: z,
                count: z === "Actions" ? e.actions.length : void 0
              })),
              activeTab: y,
              onTabChange: (z) => E(z)
            }
          ) }),
          /* @__PURE__ */ r("div", { className: "dq-drawer-body", children: /* @__PURE__ */ c("fieldset", { className: "dq-drawer-fields", disabled: s, children: [
            /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review settings" }),
            /* @__PURE__ */ c(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: y !== "Review",
                "aria-label": "Review",
                children: [
                  /* @__PURE__ */ r(
                    Ms,
                    {
                      review: e,
                      onChange: t,
                      entityTypeLocked: !0,
                      nameRef: H,
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
                        onChange: (z) => a(z.target.value),
                        children: [
                          /* @__PURE__ */ r("option", { value: "end", children: "Start from the end" }),
                          /* @__PURE__ */ r("option", { value: "beginning", children: "Start from the beginning" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ r("small", { className: "dq-drawer-note", children: "From the end, the queue opens on its last page and works towards the first." })
                  ] }),
                  Se(e) && /* @__PURE__ */ r(Ed, { review: e, onChange: t }),
                  /* @__PURE__ */ r("div", { children: /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => Ti(e),
                      children: "Export draft"
                    }
                  ) })
                ]
              }
            ),
            $.includes("Appearance") && /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: y !== "Appearance",
                "aria-label": "Appearance",
                children: /* @__PURE__ */ r(Od, { review: e, onChange: t })
              }
            ),
            /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel dq-actions-panel",
                role: "tabpanel",
                hidden: y !== "Actions",
                "aria-label": "Actions",
                children: /* @__PURE__ */ r(
                  wd,
                  {
                    review: e,
                    onChange: t,
                    tagGroups: i,
                    trees: o,
                    saving: s,
                    expandedId: I,
                    onExpand: P,
                    reveal: U
                  }
                )
              }
            ),
            v && Se(e) && /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: y !== "Tag choices",
                "aria-label": "Tag choices",
                children: /* @__PURE__ */ r(Sd, { review: e, onChange: t })
              }
            )
          ] }) }),
          (F || w) && /* @__PURE__ */ c("div", { className: "dq-drawer-notices", children: [
            w,
            F && /* @__PURE__ */ c("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ r(Dn, { "aria-hidden": "true" }),
              F
            ] })
          ] }),
          /* @__PURE__ */ c("footer", { className: "dq-drawer-footer", children: [
            /* @__PURE__ */ r("p", { className: "dq-drawer-dirty", children: h ? p ? "Unsaved changes, including the queue's criteria" : "Unsaved changes" : "" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: s, onClick: N, children: "Cancel" }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-button primary",
                "aria-busy": s || void 0,
                "aria-disabled": s || void 0,
                disabled: !s && l,
                onClick: () => {
                  s || de();
                },
                children: "Save review"
              }
            )
          ] })
        ]
      }
    ),
    se && /* @__PURE__ */ r(
      Id,
      {
        onKeepEditing: () => O(!1),
        onDiscard: () => {
          D.current = null, O(!1), N();
        }
      }
    )
  ] });
}
function Od({
  review: e,
  onChange: t
}) {
  const n = Ct(), a = e.view, i = (p) => t({ ...e, view: { ...a, ...p } }), o = /* @__PURE__ */ c("label", { className: "dq-checkbox dq-setting-indent", children: [
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
  if (Me(e) === "tag")
    return /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-cards`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-cards`, children: "Cards" }),
      /* @__PURE__ */ r(
        fo,
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
  return /* @__PURE__ */ c(fe, { children: [
    /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ c("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ r(
          ho,
          {
            name: `${n}-layout-choice`,
            checked: h === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ r($d, {}),
            onChoose: () => i({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ r(
          ho,
          {
            name: `${n}-layout-choice`,
            checked: h === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ r(Md, {}),
            onChoose: () => i({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ r(
        fo,
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
        ].map(([p, w]) => /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: d.includes(p),
              onChange: (m) => l({
                annotations: m.target.checked ? [...d, p] : d.filter((N) => N !== p)
              })
            }
          ),
          w
        ] }, p)) })
      ] }),
      d.includes("tags") && /* @__PURE__ */ c("div", { className: "dq-setting-row dq-setting-row-top", children: [
        /* @__PURE__ */ r("span", { className: "dq-setting-name", children: "Tags on cards" }),
        /* @__PURE__ */ c("div", { className: "dq-setting-value", children: [
          /* @__PURE__ */ r(
            Cn,
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
        Cn,
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
function fo({
  label: e,
  value: t,
  options: n,
  onChange: a
}) {
  const i = Ct();
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
function ho({
  name: e,
  checked: t,
  title: n,
  text: a,
  picture: i,
  onChoose: o
}) {
  const s = Ct(), l = Ct();
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
function $d() {
  return /* @__PURE__ */ c("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ r("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function Md() {
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
function xs({
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
  chipsAfter: w,
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
          children: /* @__PURE__ */ r(zr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-type", title: Rs[n], children: /* @__PURE__ */ r(Os, { entityType: n }) }),
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
          children: /* @__PURE__ */ r(qr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    d,
    /* @__PURE__ */ r("div", { className: "dq-review-header-trail", children: h }),
    /* @__PURE__ */ r("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    p,
    w && /* @__PURE__ */ r("div", { className: "dq-review-chips-after", children: w }),
    m && /* @__PURE__ */ r("div", { className: "dq-review-chips-end", children: m })
  ] });
}
function Ps({
  page: e,
  pages: t,
  onPage: n
}) {
  const [a, i] = C(!1), [o, s] = C(""), l = T(null), d = T(null);
  W(() => {
    var w;
    a && ((w = l.current) == null || w.select());
  }, [a]);
  const h = (w) => {
    i(!1), w && requestAnimationFrame(() => {
      var m;
      return (m = d.current) == null ? void 0 : m.focus();
    });
  }, p = () => {
    const w = Math.round(Number(o));
    h(!0), Number.isFinite(w) && w >= 1 && w !== e && n(Math.min(t, w));
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
        children: /* @__PURE__ */ r(zr, { "aria-hidden": "true" })
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
        onChange: (w) => s(w.target.value),
        onKeyDown: (w) => {
          w.key === "Enter" ? (w.preventDefault(), p()) : w.key === "Escape" && (w.preventDefault(), w.stopPropagation(), h(!0));
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
        children: /* @__PURE__ */ r(Wo, { "aria-hidden": "true" })
      }
    )
  ] });
}
function Ls({
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
          /* @__PURE__ */ r(Jc, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ r(di, { "aria-hidden": "true" }),
          "Grid"
        ]
      }
    )
  ] });
}
function Fd({
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
function Ri({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [a, i] = C(!1), [o, s] = C(!1), l = T(null), d = T(null), h = Ct();
  Zt(() => {
    if (!a || !d.current || !l.current) return;
    const m = l.current.getBoundingClientRect(), N = d.current.offsetHeight + 12, b = window.innerHeight - m.bottom;
    s(b < N && m.top > b);
  }, [a]), W(() => {
    var m, N;
    a && ((N = (m = d.current) == null ? void 0 : m.querySelector('[role="menuitem"]:not(:disabled)')) == null || N.focus({ preventScroll: !0 }));
  }, [a]), W(() => {
    t && i(!1);
  }, [t]);
  const p = (m = !0) => {
    var N;
    i(!1), m && ((N = l.current) == null || N.focus());
  };
  return /* @__PURE__ */ c("div", { className: `dq-menu${a ? " dq-menu-open" : ""}`, onKeyDown: (m) => {
    var y, E;
    if (!a) return;
    const N = [
      ...((y = d.current) == null ? void 0 : y.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], b = N.indexOf(document.activeElement);
    if (m.key === "Escape")
      m.preventDefault(), m.stopPropagation(), p();
    else if (m.key === "Tab")
      p(!1);
    else if (m.key === "ArrowDown" || m.key === "ArrowUp") {
      if (m.preventDefault(), !N.length) return;
      const v = m.key === "ArrowDown" ? 1 : -1;
      N[(b + v + N.length) % N.length].focus();
    } else (m.key === "Home" || m.key === "End") && (m.preventDefault(), (E = N.at(m.key === "Home" ? 0 : -1)) == null || E.focus());
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
        children: /* @__PURE__ */ r(zc, { "aria-hidden": "true" })
      }
    ),
    a && /* @__PURE__ */ c(fe, { children: [
      /* @__PURE__ */ r("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => p(!1) }),
      /* @__PURE__ */ r(
        "div",
        {
          ref: d,
          id: h,
          role: "menu",
          "aria-label": n,
          className: `dq-menu-list${o ? " dq-menu-list-up" : ""}`,
          children: e.map((m) => /* @__PURE__ */ c(ii, { children: [
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
function ha(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Ii(e) {
  return String(e.type).toLowerCase() === "tag";
}
function Oi(e) {
  return !!String(e ?? "").trim();
}
function $i(e) {
  return [
    ...new Set(
      ha(e.customFieldCriteria).filter(Ii).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !Oi(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function Mi(e, t) {
  const n = ha(e.customFieldCriteria);
  if (!n.length) return e;
  let a = !1;
  const i = n.map((o) => {
    if (!Ii(o)) return o;
    const s = { ...o };
    for (const [l, d] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const h = t[String(o[l] ?? "")];
      h && !Oi(o[d]) && (s[d] = h, a = !0);
    }
    return s;
  });
  return a ? { ...e, customFieldCriteria: i } : e;
}
function Ds(e, t, n) {
  const a = ha(e.customFieldCriteria);
  if (!a.length) return e;
  const i = ha(n.customFieldCriteria), o = (d, h) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (p) => (d[p] ?? void 0) === (h[p] ?? void 0)
  );
  let s = !1;
  const l = a.map((d) => {
    if (!Ii(d)) return d;
    const h = i.find((w) => o(w, d));
    if (!h) return d;
    const p = { ...d };
    for (const [w, m] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const N = t[String(d[w] ?? "")];
      N && d[m] === N && !Oi(h[m]) && (delete p[m], s = !0);
    }
    return p;
  });
  return s ? { ...e, customFieldCriteria: l } : e;
}
async function xd(e, t, n) {
  if (!kn(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const a = Re(e), i = n.steps.some((l) => En(l.mode)) ? await Dl(a) : "", o = await vi(n);
  let s = t.applications;
  for (const l of [
    ...o.filter((d) => !En(d.mode)),
    ...o.filter((d) => En(d.mode))
  ]) {
    const d = (h) => _l(
      i,
      a,
      t.media.id,
      t.performer.id,
      l.tagIds,
      h
    );
    (l.mode === "MARK_PRESENT" || l.mode === "CLEAR_ABSENCE") && await d("REMOVE"), l.mode !== "CLEAR_ABSENCE" && (s = await Ks(
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
async function Fi(e, t) {
  const n = e.occurrence;
  if (pi(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const a = /* @__PURE__ */ new Set(), { _filterExpression: i, ...o } = n.performerFilter;
  for (let s = 1; ; s++) {
    const l = await oe("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        An({
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
function _s(e) {
  return Kr(e.condition) && e.hideConfirmedAbsent !== !1;
}
function xi(e, t) {
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
  }, s = _s(i) && (t == null ? void 0 : t.length) === 1 && i.conditionTagIds.length === 1 ? `${t[0]}:${i.conditionTagIds[0]}` : null;
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
                      key: wa,
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
async function Pi(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => ya([n], t))
  );
}
function js(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function Pd(e, t, n = e.conditionTagIds.map((a) => [a])) {
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
function Ld(e, t, n, a, i) {
  if (!_s(e)) return !1;
  const o = hs(t, n);
  return e.conditionTagIds.every(
    (s, l) => o.includes(s) || i[l].some((d) => a.includes(d))
  );
}
async function Us(e, t, n, a) {
  if ((t == null ? void 0 : t.length) === 0 || js(e.occurrence))
    return { items: [], totalCount: 0 };
  const i = Re(e), o = await _r(
    xi(e, t),
    { ...e.view.filter, page: n },
    a
  ), s = t === null ? null : new Set(t), l = e.occurrence, d = o.items.length ? await Pi(l, a) : [], h = new Array(o.items.length);
  let p = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, o.items.length) }, async () => {
      for (; p < o.items.length; ) {
        const w = p++, m = o.items[w], N = await oe(
          `/api/tagapplications?hostType=${i}&hostId=${m.id}&contextType=performer`,
          { signal: a }
        );
        h[w] = m.performers.filter((b) => s === null || s.has(b.id)).flatMap((b) => {
          const y = N.filter(
            (v) => v.hostType === i && v.hostId === m.id && v.contextType === "performer" && v.contextId === b.id
          ), E = y.map((v) => v.tag.id);
          return Pd(e.occurrence, E, d) && !Ld(l, m, b.id, E, d) ? [
            {
              key: `${m.id}:${b.id}`,
              media: m,
              performer: b,
              applications: y
            }
          ] : [];
        });
      }
    })
  ), { items: h.flat(), totalCount: o.totalCount };
}
async function Ks(e, t, n) {
  const a = new Set(e.occurrence.tagIds);
  if (n.some((h) => !a.has(h)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const i = Re(e), o = await za(i, t.media.id);
  if (!o.performers.some(
    (h) => h.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${i}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${i}&hostId=${o.id}&contextType=performer&contextId=${t.performer.id}`, l = (await oe(s)).filter(
    (h) => h.hostType === i && h.hostId === o.id && h.contextType === "performer" && h.contextId === t.performer.id
  ), d = new Set(n);
  try {
    for (const h of d)
      l.some((p) => p.tag.id === h) || await oe("/api/tagapplications", {
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
      a.has(h.tag.id) && !d.has(h.tag.id) && await oe(`/api/tagapplications/${h.id}`, {
        method: "DELETE"
      });
    return await oe(s);
  } catch (h) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${h instanceof Error ? h.message : "Request failed."}`
    );
  }
}
function Sr(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function Dd(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function Xt(e, t, n = !0) {
  var l;
  if (t.occurrence) {
    const d = n ? hs(
      await za(e, t.media.id),
      t.occurrence.performer.id
    ) : [], h = (await oe(Dd(e, t))).filter(
      (p) => p.hostType === e && p.hostId === t.media.id && p.contextType === "performer" && p.contextId === t.occurrence.performer.id
    );
    return Ya(h.map((p) => p.tag)), {
      ids: [...new Set(h.map((p) => p.tag.id))],
      names: [...new Set(h.map((p) => p.tag.name))],
      absent: d,
      applications: h
    };
  }
  const a = await za(e, t.media.id), i = (a.tags ?? []).filter(
    (d) => d.canRemove !== !1 || d.isDerived !== !0
  );
  Ya(i);
  const o = Object.keys(a.customFields ?? {}).find(
    (d) => d.toLowerCase() === da
  ) ?? da, s = ((l = a.customFields) == null ? void 0 : l[o]) ?? [];
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
async function Li(e, t, n) {
  if (t.occurrence && Se(e))
    await Ks(
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
      i.length && await oe(
        `/api/${Gn(Re(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: a, tagIds: i })
        }
      );
}
async function _d(e, t, n) {
  t.occurrence && Se(e) ? await xd(e, t.occurrence, n) : await ps(Re(e), n, [t.media.id]);
}
function Xa(e, t, n, a) {
  const i = (o) => o.filter((s) => a.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: Sr(i(t.ids), i(n.ids)),
    absence: Sr(i(t.absent), i(n.absent))
  };
}
function jd(e, t) {
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
class Gs extends Error {
}
const Za = (e) => e instanceof Error ? e.message : "Request failed.", po = (e) => [...e].sort((t, n) => t - n), Vr = (e, t) => JSON.stringify(po(e)) === JSON.stringify(po(t)), ei = (e) => !!(e.tags.added.length || e.tags.removed.length);
function pa(e, t, n, a) {
  const i = new Set(e), o = new Set(e);
  for (const p of t.steps)
    for (const w of p.tagIds)
      p.mode === "ADD" ? o.add(w) : o.delete(w);
  const s = e.some((p) => !o.has(p));
  if (s && !a)
    return { desired: [...e], conflict: s, skipped: !0, kept: [], replaced: [] };
  const l = new Set(
    t.steps.filter((p) => p.mode === "ADD").flatMap((p) => p.tagIds)
  ), d = [], h = [];
  for (const p of n) {
    const w = p.filter((N) => o.has(N) && !i.has(N)), m = p.filter(
      (N) => o.has(N) && i.has(N) && !l.has(N)
    );
    !w.length || !m.length || (a ? (m.forEach((N) => o.delete(N)), h.push(...m)) : (w.forEach((N) => o.delete(N)), d.push({ tagIds: w, existing: m })));
  }
  return { desired: [...o], conflict: s, skipped: !1, kept: d, replaced: h };
}
function Ud(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function Kd(e, t, n, a) {
  for (const [i, o] of n.entries()) {
    const s = t.filter(
      (h) => h.steps.some(
        (p) => p.mode === "ADD" && p.tagIds.some((w) => o.includes(w))
      )
    );
    if (s.length < 2) continue;
    const l = e.occurrence.conditionTagIds[i];
    let d = `tag ${l}`;
    try {
      d = (await oe(`/api/tags/${l}`, { signal: a })).name;
    } catch {
      a.throwIfAborted();
    }
    throw new Gs(
      `${s.map((h) => h.label).join(" and ")} answer the same condition tag, ${d}. Choose one of them.`
    );
  }
}
async function Gd(e, t, n, a = () => {
}) {
  if (!t.length || t.some(
    (m) => !kn(m, e.entityType) || !m.steps.length || m.steps.some(
      (N) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(N.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), o = structuredClone(t), s = Kr(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await Pi(i.occurrence, n) : [];
  await Kd(i, o, s, n);
  const l = await Promise.all(
    o.map(async (m) => ({
      ...m,
      steps: await vi(m, n)
    }))
  ), d = structuredClone(Ud(l));
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
  const p = await Fi(i, n), w = /* @__PURE__ */ new Map();
  for (let m = 1; ; m++) {
    n.throwIfAborted();
    const N = await Us(i, p, m, n);
    for (const b of N.items) {
      const y = {
        ids: [...new Set(b.applications.map((v) => v.tag.id))],
        names: b.applications.map((v) => v.tag.name),
        absent: [],
        applications: b.applications
      }, E = pa(y.ids, d, s, !0);
      w.set(b.key, {
        item: { key: b.key, media: b.media, occurrence: b },
        before: y,
        expected: y,
        conflict: E.conflict,
        status: Vr(y.ids, E.desired) ? "unchanged" : "pending"
      });
    }
    if (a(w.size), m * 250 >= N.totalCount) break;
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
    entries: [...w.values()]
  };
}
function Bd(e, t, n) {
  const a = (o) => o.ids.filter((s) => n.includes(s));
  if (!Vr(a(e), a(t))) return !1;
  const i = (o) => (o.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return Vr(i(e), i(t));
}
async function Bs(e, t, n, a) {
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
function Vs(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function Js(e) {
  return e.entries.filter((t) => t.operation);
}
async function Vd(e, t, n, a, i = !1) {
  await Bs(
    Vs(e, i),
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
        if (s = await Xt(Re(e.review), o.item, !1), !Bd(o.expected, s, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (m) {
        o.status = "failed", o.error = Za(m);
        return;
      }
      const l = pa(
        o.before.ids,
        e.action,
        e.categories,
        t
      ), d = [
        ...s.ids.filter((m) => !e.touched.includes(m)),
        ...l.desired.filter((m) => e.touched.includes(m))
      ], h = Sr(s.ids, d);
      if (!h.added.length && !h.removed.length) {
        const m = !o.operation && l.kept.length > 0;
        o.status = o.operation ? "changed" : m ? "skipped" : "unchanged", o.error = m ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let p;
      try {
        await Li(e.review, o.item, h);
      } catch (m) {
        p = m;
      }
      let w = !1;
      try {
        const m = await Xt(Re(e.review), o.item, !1);
        w = !0, o.expected = m;
        const N = Xa(
          o.item,
          o.before,
          m,
          e.touched
        );
        if (o.operation = ei(N) ? N : void 0, p) throw p;
        if (!Vr(
          m.ids.filter((b) => e.touched.includes(b)),
          d.filter((b) => e.touched.includes(b))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (m) {
        if (o.status = "failed", o.error = Za(m), !w)
          try {
            const N = await Xt(Re(e.review), o.item, !1);
            o.expected = N;
            const b = Xa(
              o.item,
              o.before,
              N,
              e.touched
            );
            o.operation = ei(b) ? b : void 0;
          } catch {
            o.unverified = !0;
          }
      }
    },
    a
  );
}
async function Jd(e, t, n) {
  await Bs(
    Js(e),
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
        const l = await Xt(Re(e.review), a.item, !1);
        jd(i, l), s = !0, await Li(e.review, a.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const d = await Xt(Re(e.review), a.item, !1);
        if (!Vr(
          d.ids.filter((h) => o.includes(h)),
          a.before.ids.filter((h) => o.includes(h))
        ))
          throw new Error("Undo did not restore all affected tags.");
        a.operation = void 0, a.expected = d, a.status = "unchanged", a.error = void 0;
      } catch (l) {
        if (a.error = `Undo stopped: ${Za(l)}`, a.status = "failed", s)
          try {
            const d = await Xt(Re(e.review), a.item, !1), h = Xa(
              a.item,
              a.before,
              d,
              o
            );
            a.operation = ei(h) ? h : void 0, a.expected = d;
          } catch {
            a.unverified = !0;
          }
      }
    },
    n
  );
}
async function zd(e, t, n) {
  const a = Re(e), i = e.occurrence, [o, s] = await Promise.all([
    oe(
      `/api/tagapplications?hostType=${a}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    Pi(i, n)
  ]), l = o.filter(
    (b) => b.hostType === a && b.contextType === "performer" && b.contextId === t
  );
  Ya(l.map((b) => b.tag));
  const d = await Promise.all(
    s.map(async (b, y) => {
      const E = i.conditionTagIds[y];
      return (await oe(`/api/tags/${E}`, { signal: n })).name;
    })
  ), h = new Set(s.flat()), p = new Set(
    [
      ...e.actions.flatMap((b) => b.steps).filter((b) => b.mode === "ADD" || b.mode === "MARK_PRESENT").flatMap((b) => b.tagIds),
      ...i.tagIds
    ].filter((b) => !h.has(b))
  ), w = (b) => {
    const y = /* @__PURE__ */ new Map();
    for (const E of l) {
      if (!b.has(E.tag.id)) continue;
      const v = y.get(E.tag.id) ?? {
        tag: E.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      v.hosts.add(E.hostId), y.set(E.tag.id, v);
    }
    return [...y.values()].map((E) => ({ ...E.tag, count: E.hosts.size })).sort((E, v) => v.count - E.count || Ns(E, v));
  }, m = s.map((b, y) => ({
    id: i.conditionTagIds[y],
    name: d[y],
    tags: w(new Set(b))
  }));
  p.size && m.push({
    id: null,
    name: s.length ? "Other review tags" : "Review tags",
    tags: w(p)
  });
  const N = /* @__PURE__ */ new Set([...h, ...p]);
  return {
    answered: new Set(
      l.filter((b) => N.has(b.tag.id)).map((b) => b.hostId)
    ).size,
    groups: m
  };
}
const zs = Ic(!1);
function Wd({ children: e }) {
  return /* @__PURE__ */ r(zs.Provider, { value: !0, children: e });
}
function Kt({ tag: e, name: t }) {
  const n = Oc(zs), a = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ r(Fc, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: a ?? void 0 });
}
const mo = { summary: null, error: "" };
function Ws(e, t, n = 0) {
  const [a, i] = C(mo), o = e.occurrence, s = JSON.stringify([
    e.entityType,
    t,
    o.condition,
    o.conditionTagIds,
    o.includeSubtags,
    o.tagIds,
    e.actions.map((l) => l.steps)
  ]);
  return W(() => {
    if (i(mo), t === null) return;
    const l = new AbortController();
    return zd(e, t, l.signal).then((d) => {
      l.signal.aborted || i({ summary: d, error: "" });
    }).catch((d) => {
      l.signal.aborted || i({
        summary: null,
        error: d instanceof Error ? d.message : "Request failed."
      });
    }), () => l.abort();
  }, [s, n]), a;
}
function Qd({
  review: e,
  performerId: t,
  revision: n = 0
}) {
  const a = Ws(e, t, n);
  return /* @__PURE__ */ r(ti, { ...a, mediaKind: Re(e) });
}
function ti({
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
            /* @__PURE__ */ r(Kt, { tag: l }),
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
function vr({
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
const go = 5;
function Hd(e, t) {
  return Promise.all(
    e.map(async (n) => {
      try {
        return (await oe(`/api/performers/${n}`, { signal: t })).name;
      } catch {
        return t.throwIfAborted(), `Performer ${n}`;
      }
    })
  );
}
function Yd(e, t) {
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
const bo = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), ni = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], wo = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], Xd = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, La = 250;
function Dr(e, t) {
  var a, i;
  const n = e.item.media;
  return n.title || ((i = (a = n.files) == null ? void 0 : a[0]) == null ? void 0 : i.basename) || (t === "audio" ? "Audio" : "Scene");
}
function Zd({ step: e }) {
  const t = ni.findIndex((n) => n.id === e);
  return /* @__PURE__ */ r("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: ni.map((n, a) => {
    const i = a < t ? "done" : a === t ? "current" : "next";
    return /* @__PURE__ */ c("li", { "data-state": i, "aria-current": i === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: i === "done" ? /* @__PURE__ */ r(ui, {}) : a + 1 }),
      n.label,
      i === "done" && /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function yo({ parts: e, id: t }) {
  return /* @__PURE__ */ r("span", { className: "dq-batch-effect", id: t, children: e.map((n, a) => /* @__PURE__ */ c(ii, { children: [
    a > 0 && " ",
    /* @__PURE__ */ r("span", { "data-effect-tone": n.tone, children: n.text })
  ] }, a)) });
}
function Lr({
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
        n && /* @__PURE__ */ c(fe, { children: [
          " ",
          /* @__PURE__ */ r("span", { className: "dq-batch-stat-detail", children: n })
        ] })
      ]
    }
  );
}
function vo({
  added: e,
  removed: t,
  tag: n,
  label: a
}) {
  return /* @__PURE__ */ c("ul", { className: "dq-tags", "aria-label": a, children: [
    ar(e.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ c("ins", { children: [
      "+ ",
      /* @__PURE__ */ r(Kt, { tag: i })
    ] }) }, `added-${i.id}`)),
    ar(t.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ c("del", { children: [
      "− ",
      /* @__PURE__ */ r(Kt, { tag: i })
    ] }) }, `removed-${i.id}`))
  ] });
}
function No({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: a,
  describe: i
}) {
  return /* @__PURE__ */ c("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: e }),
      t.length > La && /* @__PURE__ */ c("span", { children: [
        "First ",
        La.toLocaleString(),
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
      /* @__PURE__ */ r("tbody", { children: t.slice(0, La).map((o) => {
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
                Dr(o, n)
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
function eu(e) {
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
function tu({
  review: e,
  disabled: t,
  performerFlags: n = [],
  trees: a,
  onOpen: i,
  onClose: o,
  onWrite: s
}) {
  const [l, d] = C(!1), [h, p] = C("answers"), [w, m] = C(null), [N, b] = C({}), [y, E] = C([]), [v, M] = C(!1), [j, I] = C(!1), [P, U] = C(""), [ce, se] = C(!1), [O, D] = C(""), [H, k] = C(null), [$, B] = C(null), [re, X] = C([]), [de, F] = C(0), z = T(null), V = T(null), K = T(null), te = T(!1), ve = T(!1), Ne = T(null), mt = T(!1), tt = T(0), ut = T(!1), Le = T({ onClose: o, onWrite: s });
  Le.current = { onClose: o, onWrite: s };
  const We = Ct(), nt = h === "run", Gt = (H == null ? void 0 : H.kind) === "undo", ke = nt && w ? w.review : e, Bt = Er(ke.actions), pe = ke.occurrence, rt = Re(ke), je = mn(rt), gn = je.queue, Ge = nt && w ? w.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((S) => S.steps.length && !Kn(S))
  ), Ae = Ge.filter((S) => y.includes(S.id)), Ee = pe.targetMode === "selected" && pe.performerIds.length === 1, Qe = Ws(
    ke,
    l && Ee ? pe.performerIds[0] : null,
    de
  ), en = $i(ke.view.objectFilter), Nt = Ci(
    l ? [...va(Ge), ...pe.conditionTagIds, ...en] : []
  ), Bn = ye(() => vs(Nt), [Nt]), st = (S) => N[S] ?? Nt[S] ?? { id: S, name: `Tag ${S}` }, kt = JSON.stringify(
    Object.fromEntries(
      en.flatMap((S) => {
        var ne;
        const A = (ne = Nt[S]) == null ? void 0 : ne.name;
        return A ? [[String(S), A]] : [];
      })
    )
  ), at = ye(
    () => Mi(ke.view.objectFilter, JSON.parse(kt)),
    [ke.view.objectFilter, kt]
  );
  W(() => {
    var S, A, ne;
    l && ((S = z.current) == null || S.showModal(), (ne = (A = z.current) == null ? void 0 : A.querySelector(".dq-batch-answer input")) == null || ne.focus());
  }, [l]), W(() => {
    if (!l) return;
    const S = requestAnimationFrame(() => {
      var qe;
      const A = z.current, ne = document.activeElement;
      if (!A || ne && ne !== document.body && A.contains(ne)) return;
      (qe = (h === "answers" ? A.querySelector(".dq-batch-answer input:checked") ?? A.querySelector(".dq-batch-answer input") : A.querySelector("[data-batch-focus]")) ?? V.current) == null || qe.focus();
    });
    return () => cancelAnimationFrame(S);
  }, [l, h, j, w]), W(() => {
    if (l || t || !te.current) return;
    const S = requestAnimationFrame(() => {
      const A = K.current;
      if (!te.current || !A || A.disabled) return;
      te.current = !1;
      const ne = document.activeElement;
      (!ne || ne === document.body) && A.focus();
    });
    return () => cancelAnimationFrame(S);
  }, [l, t]), W(() => {
    if (!l || pe.targetMode !== "selected") return;
    const S = new AbortController();
    return X([]), Hd(pe.performerIds.slice(0, go), S.signal).then((A) => {
      S.signal.aborted || X(A);
    }).catch(() => {
    }), () => S.abort();
  }, [l, pe.targetMode, JSON.stringify(pe.performerIds)]), W(
    () => () => {
      var S;
      ve.current = !0, (S = Ne.current) == null || S.abort();
    },
    []
  ), W(() => {
    if (!j) return;
    const S = (A) => {
      A.preventDefault(), A.returnValue = "";
    };
    return window.addEventListener("beforeunload", S), () => window.removeEventListener("beforeunload", S);
  }, [j]);
  function Vt() {
    p("answers"), m(null), b({}), k(null), M(!1), E([]), D(""), U(""), se(!1), B(null);
  }
  function gt() {
    ut.current || (d(!1), Le.current.onClose(mt.current), mt.current = !1, Vt(), te.current = !0);
  }
  function Tn(S, A) {
    E(
      (ne) => A ? [...ne, S] : ne.filter((Ce) => Ce !== S)
    ), m(null), b({}), D(""), U(""), se(!1), B(null);
  }
  function Lt() {
    p("answers"), B(null), D("");
  }
  function tn() {
    p("preview"), w || bn();
  }
  function At() {
    var S;
    ve.current = !0, (S = Ne.current) == null || S.abort(), D("Stopping after in-flight operations settle…");
  }
  function ae(S) {
    B(
      (A) => (A == null ? void 0 : A.group) === S.group && A.reason === S.reason ? null : S
    );
  }
  const ft = (S, A) => ($ == null ? void 0 : $.group) === S && $.reason === A;
  async function bn() {
    if (!Ae.length || ut.current) return;
    ut.current = !0, I(!0), U(""), se(!1), D("Loading all matching occurrences…"), m(null), b({}), B(null);
    const S = new AbortController();
    Ne.current = S;
    try {
      await Yd(tt.current, S.signal);
      const A = await Gd(
        e,
        Ae,
        S.signal,
        (Ce) => D(`Loaded ${Ce.toLocaleString()} matching occurrences…`)
      );
      S.signal.throwIfAborted();
      const ne = {};
      for (const Ce of A.entries)
        for (const qe of Ce.before.applications ?? [])
          ne[qe.tag.id] = qe.tag;
      b(ne), m(A), D("Preview ready. No tags have been changed.");
    } catch (A) {
      U(
        S.signal.aborted ? "Preview cancelled. No tags were changed." : A instanceof Error ? A.message : String(A)
      ), se(!S.signal.aborted && A instanceof Gs), D("");
    } finally {
      ut.current = !1, I(!1), Ne.current = null;
    }
  }
  async function Mt(S) {
    if (!w || ut.current) return;
    const A = (S === "undo" ? Js(w) : Vs(w, S === "retry")).length;
    ut.current = !0, ve.current = !1, mt.current = !0, Le.current.onWrite(), I(!0), p("run"), U(""), k({ kind: S, total: A, done: 0, stopped: !1 }), D(
      S === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const ne = () => k((qe) => qe && { ...qe, done: qe.done + 1 });
    let Ce = !1;
    try {
      S === "undo" ? await Jd(w, () => ve.current, ne) : await Vd(w, v, () => ve.current, ne, S === "retry"), D(
        ve.current ? "Stopped after in-flight operations settled. Completed changes are retained." : S === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (qe) {
      Ce = !0, D(""), U(qe instanceof Error ? qe.message : String(qe));
    } finally {
      tt.current = Date.now(), ut.current = !1;
      const qe = ve.current || Ce;
      k((me) => me && { ...me, stopped: qe }), I(!1), F((me) => me + 1);
    }
  }
  const He = (w == null ? void 0 : w.entries) ?? [], Ue = ye(
    () => new Map(
      ((w == null ? void 0 : w.entries) ?? []).map((S) => [
        S.item.key,
        pa(S.before.ids, w.action, w.categories, v)
      ])
    ),
    [w, v]
  ), bt = (S) => Ue.get(S.item.key), ee = (S) => Sr(S.before.ids, bt(S).desired), x = (S) => {
    const A = ee(S);
    return S.status === "pending" && (A.added.length > 0 || A.removed.length > 0);
  }, be = (S) => S.conflict || bt(S).kept.length > 0 || bt(S).replaced.length > 0, Ye = ye(() => {
    const S = (w == null ? void 0 : w.entries) ?? [];
    return {
      willChange: S.filter(x).length,
      correct: S.filter((A) => A.status === "unchanged").length,
      different: S.filter(be).length,
      hosts: new Set(S.map((A) => A.item.media.id)).size,
      added: [...new Set(S.flatMap((A) => ee(A).added))],
      removed: [...new Set(S.flatMap((A) => ee(A).removed))]
    };
  }, [Ue]), Xe = ye(
    () => ((w == null ? void 0 : w.entries) ?? []).filter((S) => S.item.media.date).sort((S, A) => S.item.media.date.localeCompare(A.item.media.date)),
    [w]
  ), Z = nt ? eu(He) : null, nn = (S) => Bt.keys[ke.actions.findIndex((A) => A.id === S)] ?? "", wn = (S) => cr(S, Bn, [], a), qt = Kr(pe.condition) && pe.includeSubtags !== !1 && pe.conditionTagIds.length > 0, it = Xe[0], De = Xe.length > 1 ? Xe[Xe.length - 1] : void 0, Be = (S) => `/${rt}/${S.item.media.id}`, ct = Ee ? re[0] : void 0, rn = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: x },
    correct: { title: "Occurrences already correct", test: (S) => S.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: be }
  };
  function St() {
    const S = Xd[pe.condition], A = !!S && pe.conditionTagIds.length > 0, ne = pe.performerIds.slice(0, go), Ce = String(ke.view.filter.q ?? "").trim(), qe = pe.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ c("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      pi(pe) ? /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "All performers" }) : pe.targetMode === "selected" ? /* @__PURE__ */ c(fe, { children: [
        ne.map((me, Ze) => /* @__PURE__ */ c("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ r(vr, { performer: { id: me, name: re[Ze] ?? "" } }),
          re[Ze] ?? "…"
        ] }, me)),
        pe.performerIds.length > ne.length && /* @__PURE__ */ c("span", { className: "dq-batch-chip", children: [
          (pe.performerIds.length - ne.length).toLocaleString(),
          " more performers"
        ] })
      ] }) : /* @__PURE__ */ c(fe, { children: [
        /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "Performer criteria" }),
        /* @__PURE__ */ r(
          "fieldset",
          {
            className: "dq-batch-filter-summary",
            disabled: !0,
            "aria-label": "Batch performer criteria",
            children: /* @__PURE__ */ r(
              Ur,
              {
                filter: {},
                objectFilter: pe.performerFilter,
                criteriaDefinitions: oi,
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
        A ? S : fi[pe.condition],
        A && /* @__PURE__ */ r("span", { className: "dq-batch-chip-tags", children: ar(pe.conditionTagIds.map(st)).map((me) => /* @__PURE__ */ r(Kt, { tag: me }, me.id)) })
      ] }),
      A && /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: pe.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      Kr(pe.condition) && pe.hideConfirmedAbsent !== !1 && /* @__PURE__ */ c("span", { className: "dq-batch-chip", title: qe, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
          ": ",
          qe
        ] })
      ] }),
      Ce && /* @__PURE__ */ c("span", { className: "dq-batch-chip", children: [
        "Search “",
        Ce,
        "”"
      ] }),
      Object.keys(ke.view.objectFilter).length > 0 && /* @__PURE__ */ r(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${gn} filters`,
          children: /* @__PURE__ */ r(
            Ur,
            {
              filter: ke.view.filter,
              objectFilter: at,
              criteriaDefinitions: rt === "audio" ? Lo : si,
              customFieldEntityType: rt,
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
  function an(S) {
    return n.length ? /* @__PURE__ */ c("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ r(ca, { "aria-hidden": "true" }),
      /* @__PURE__ */ c("div", { children: [
        /* @__PURE__ */ c("p", { children: [
          /* @__PURE__ */ r("strong", { children: ct || "This performer" }),
          " is flagged:",
          " ",
          /* @__PURE__ */ r("strong", { children: n.join(", ") }),
          ". Check the earliest and latest",
          " ",
          je.many,
          " before applying, or narrow the batch with a date filter."
        ] }),
        S && it && /* @__PURE__ */ c("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ c("a", { href: Be(it), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            Dr(it, rt),
            " · ",
            it.item.media.date
          ] }),
          De && /* @__PURE__ */ c("a", { href: Be(De), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            Dr(De, rt),
            " · ",
            De.item.media.date
          ] })
        ] })
      ] })
    ] }) : null;
  }
  function yn() {
    return /* @__PURE__ */ c(fe, { children: [
      St(),
      an(!1),
      /* @__PURE__ */ c("div", { className: `dq-batch-pick${Ee ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ c("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ r("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ r("div", { className: "dq-batch-answers", children: Ge.map((S, A) => {
            const ne = nn(S.id);
            return /* @__PURE__ */ c("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ r(
                "input",
                {
                  type: "checkbox",
                  checked: y.includes(S.id),
                  "aria-labelledby": `${We}-answer-${A}`,
                  "aria-describedby": `${We}-effect-${A}`,
                  onChange: (Ce) => Tn(S.id, Ce.target.checked)
                }
              ),
              /* @__PURE__ */ r("span", { className: "dq-batch-answer-key", children: ne && /* @__PURE__ */ r(ot, { binding: ne, hidden: !0 }) }),
              /* @__PURE__ */ c("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ r(
                  "span",
                  {
                    id: `${We}-answer-${A}`,
                    className: "dq-batch-answer-label",
                    title: S.label,
                    children: S.label
                  }
                ),
                /* @__PURE__ */ r(yo, { id: `${We}-effect-${A}`, parts: wn(S) })
              ] })
            ] }, S.id);
          }) })
        ] }),
        Ee && /* @__PURE__ */ r(ti, { ...Qe, mediaKind: rt, className: "dq-batch-card" })
      ] })
    ] });
  }
  function Jt(S) {
    const A = Ye, ne = $ && bo.has($.group) ? $.group : null, Ce = ne ? He.filter(rn[ne].test) : [], qe = (me) => {
      const Ze = bt(me), Ft = Ze.skipped ? Sr(
        me.before.ids,
        pa(me.before.ids, S.action, S.categories, !0).desired
      ) : ee(me), wt = !Ft.added.length && !Ft.removed.length;
      return /* @__PURE__ */ c("div", { className: "dq-batch-plan", children: [
        Ze.skipped && /* @__PURE__ */ r("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        wt ? !Ze.kept.length && /* @__PURE__ */ r("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ r(vo, { added: Ft.added, removed: Ft.removed, tag: st }),
        Ze.kept.map((G, Fe) => /* @__PURE__ */ c("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          ar(G.existing.map(st)).map((we) => /* @__PURE__ */ r(Kt, { tag: we }, we.id)),
          " ",
          "instead of",
          " ",
          ar(G.tagIds.map(st)).map((we) => /* @__PURE__ */ r(Kt, { tag: we }, we.id))
        ] }, Fe))
      ] });
    };
    return /* @__PURE__ */ c(fe, { children: [
      /* @__PURE__ */ c("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ c("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ r(
            Lr,
            {
              value: He.length,
              label: He.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${A.hosts.toLocaleString()} ${A.hosts === 1 ? gn : `${gn}s`}`,
              pressed: ft("matching"),
              onToggle: () => ae({ group: "matching" })
            }
          ),
          /* @__PURE__ */ r(
            Lr,
            {
              value: A.willChange,
              label: "will change",
              tone: "add",
              pressed: ft("change"),
              onToggle: () => ae({ group: "change" })
            }
          ),
          /* @__PURE__ */ r(
            Lr,
            {
              value: A.correct,
              label: "already correct, no write",
              pressed: ft("correct"),
              onToggle: () => ae({ group: "correct" })
            }
          ),
          /* @__PURE__ */ r(
            Lr,
            {
              value: A.different,
              label: v ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: ft("different"),
              onToggle: () => ae({ group: "different" })
            }
          )
        ] }),
        Ce.length > 0 ? /* @__PURE__ */ r(
          No,
          {
            title: rn[ne].title,
            entries: Ce,
            mediaKind: rt,
            resultHeading: "Planned change",
            describe: qe
          }
        ) : He.length > 0 && /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        He.length > 0 && /* @__PURE__ */ c("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ r("span", { children: it ? `Dates ${it.item.media.date}${De ? ` to ${De.item.media.date}` : ""}` : "No dates" }),
          it && /* @__PURE__ */ r(
            "a",
            {
              href: Be(it),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${je.one}, ${it.item.media.date}`,
              title: Dr(it, rt),
              children: "Open earliest"
            }
          ),
          De && /* @__PURE__ */ r(
            "a",
            {
              href: Be(De),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${je.one}, ${De.item.media.date}`,
              title: Dr(De, rt),
              children: "Open latest"
            }
          ),
          Xe.length < He.length && /* @__PURE__ */ c("span", { children: [
            (He.length - Xe.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (A.added.length > 0 || A.removed.length > 0) && /* @__PURE__ */ c("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ r("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ r(
            vo,
            {
              added: A.added,
              removed: A.removed,
              tag: st,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      A.different > 0 && /* @__PURE__ */ c("div", { className: "dq-batch-choice", children: [
        /* @__PURE__ */ r("span", { id: `${We}-choice`, className: "dq-batch-choice-label", children: "Occurrences with a different answer" }),
        /* @__PURE__ */ c(
          "div",
          {
            className: "dq-segmented dq-segmented-fill",
            role: "group",
            "aria-labelledby": `${We}-choice`,
            children: [
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": !v, onClick: () => M(!1), children: "Keep their answer" }),
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": v, onClick: () => M(!0), children: "Replace it" })
            ]
          }
        ),
        /* @__PURE__ */ c("p", { className: "dq-muted", children: [
          "A different answer is a tag the chosen answers would remove",
          qt ? ", or another answer already in a condition category (each condition tag with its subtags); keeping it still fills the empty categories" : "",
          ". Configure opposite answers as removals."
        ] })
      ] })
    ] });
  }
  function Vn() {
    return /* @__PURE__ */ c(fe, { children: [
      St(),
      an(!0),
      /* @__PURE__ */ c("div", { className: `dq-batch-cards${Ee ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ c("section", { className: "dq-batch-card", "aria-labelledby": `${We}-chosen`, children: [
          /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ r("h3", { id: `${We}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", disabled: j, onClick: Lt, children: "Change" })
          ] }),
          /* @__PURE__ */ r("ul", { className: "dq-batch-chosen", children: Ae.map((S) => {
            const A = nn(S.id);
            return /* @__PURE__ */ c("li", { children: [
              /* @__PURE__ */ c("span", { className: "dq-batch-chosen-chip", children: [
                A && /* @__PURE__ */ r(ot, { binding: A, hidden: !0 }),
                S.label
              ] }),
              /* @__PURE__ */ r(yo, { parts: wn(S) })
            ] }, S.id);
          }) })
        ] }),
        Ee && /* @__PURE__ */ r(ti, { ...Qe, mediaKind: rt, className: "dq-batch-card" })
      ] }),
      j ? /* @__PURE__ */ r("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ r("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ r("span", {}) }) }) : w && Jt(w)
    ] });
  }
  function Ve(S) {
    const A = H ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, ne = A.kind === "apply" ? He.length - S.counts.pending : A.done, Ce = A.kind === "apply" ? He.length : A.total, qe = j ? A.kind === "undo" ? "Undoing batch…" : A.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : A.kind === "undo" ? A.stopped ? "Undo stopped" : "Undo finished" : A.stopped ? "Stopped" : "Finished", me = Ce ? Math.round(ne / Ce * 100) : 100, Ze = $ && !bo.has($.group) ? $.group : null, Ft = (G) => wo.find((Fe) => Fe.status === G).label, wt = Ze ? He.filter(
      (G) => G.status === Ze && (!$.reason || G.error === $.reason)
    ) : [];
    return /* @__PURE__ */ c(fe, { children: [
      /* @__PURE__ */ c("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ r("h3", { tabIndex: -1, "data-batch-focus": "", children: qe }),
          /* @__PURE__ */ c("span", { children: [
            ne.toLocaleString(),
            " of ",
            Ce.toLocaleString(),
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
            "aria-valuemax": Ce,
            "aria-valuenow": ne,
            children: /* @__PURE__ */ r("span", { style: { width: `${me}%` } })
          }
        ),
        !j && A.kind === "undo" && /* @__PURE__ */ c("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (A.total - S.recorded).toLocaleString(),
          " of",
          " ",
          A.total.toLocaleString(),
          " ",
          A.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ c("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ r("div", { className: "dq-batch-stats", "data-count": "5", children: wo.map((G) => /* @__PURE__ */ r(
          Lr,
          {
            value: S.counts[G.status],
            label: G.label,
            tone: G.tone,
            pressed: ft(G.status),
            onToggle: () => ae({ group: G.status })
          },
          G.status
        )) }),
        S.reasons.length > 0 && /* @__PURE__ */ r("ul", { className: "dq-batch-reasons", children: S.reasons.map((G) => {
          const Fe = ft(G.status, G.error);
          return /* @__PURE__ */ c("li", { children: [
            /* @__PURE__ */ c("span", { children: [
              G.count.toLocaleString(),
              " ",
              G.status,
              ": ",
              G.error
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-link-button",
                "aria-expanded": Fe,
                onClick: () => ae({ group: G.status, reason: G.error }),
                children: Fe ? "Hide them" : "Show them"
              }
            )
          ] }, `${G.status}-${G.error}`);
        }) }),
        wt.length > 0 ? /* @__PURE__ */ r(
          No,
          {
            title: $.reason ? `${Ft(Ze)}: ${$.reason}` : `${Ft(Ze)} occurrences`,
            entries: wt,
            mediaKind: rt,
            resultHeading: "Result",
            describe: (G) => G.error ?? Ft(G.status)
          }
        ) : /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." })
      ] }),
      S.recorded > 0 && /* @__PURE__ */ c("div", { className: "dq-batch-undo", children: [
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: j,
            onClick: () => void Mt("undo"),
            children: [
              /* @__PURE__ */ r(Wc, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ c("p", { children: [
          Gt ? A.stopped || j ? `${S.recorded.toLocaleString()} ${S.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${S.recorded.toLocaleString()} ${S.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${S.recorded === 1 ? "this change" : `these ${S.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          "It lasts until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function lt() {
    return h === "answers" ? /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !Ae.length,
        onClick: tn,
        children: "Preview all matches"
      },
      "preview"
    ) : h === "preview" ? j ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: At, children: "Cancel preview" }, "cancel-preview") : w ? /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !Ye.willChange,
        onClick: () => void Mt("apply"),
        children: [
          "Apply to ",
          Ye.willChange.toLocaleString(),
          " ",
          Ye.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : ce ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button primary", onClick: Lt, children: "Change answers" }, "change-answers") : /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void bn(),
        children: "Preview again"
      },
      "again"
    ) : j ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: At, children: Gt ? "Cancel undo" : "Cancel run" }, "cancel-run") : Gt || !Z ? null : /* @__PURE__ */ c(ii, { children: [
      Z.retryable && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: () => void Mt("retry"), children: "Retry failed" }),
      Z.counts.pending > 0 && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          onClick: () => void Mt("apply"),
          children: "Continue"
        }
      )
    ] }, "after-run");
  }
  return /* @__PURE__ */ c(Wd, { children: [
    /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: K,
        title: "Apply answers to all matching occurrences",
        disabled: t || !Ge.length,
        onClick: () => {
          Vt(), i(), d(!0);
        },
        children: [
          /* @__PURE__ */ r(Yi, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    l && /* @__PURE__ */ c(
      "dialog",
      {
        ref: z,
        className: "dq-batch-dialog",
        "aria-labelledby": `${We}-title`,
        "aria-modal": "true",
        onCancel: (S) => {
          S.preventDefault(), gt();
        },
        onClose: () => {
          var S;
          ut.current ? (S = z.current) == null || S.showModal() : gt();
        },
        children: [
          /* @__PURE__ */ c("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ r(Yi, { "aria-hidden": "true" }),
            /* @__PURE__ */ r("h2", { id: `${We}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: j,
                onClick: gt,
                children: /* @__PURE__ */ r(Jr, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r(Zd, { step: h }),
          /* @__PURE__ */ c(
            "div",
            {
              className: "dq-batch-body",
              ref: V,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": h === "preview" ? "" : void 0,
              "aria-label": `${ni.find((S) => S.id === h).label} step`,
              children: [
                /* @__PURE__ */ c("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  O && /* @__PURE__ */ r("p", { role: "status", children: O }),
                  P && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: P })
                ] }),
                h === "answers" ? yn() : h === "preview" ? Vn() : Ve(Z)
              ]
            }
          ),
          /* @__PURE__ */ c("div", { className: "dq-batch-footer", children: [
            h === "preview" && /* @__PURE__ */ c("button", { type: "button", className: "dq-button", disabled: j, onClick: Lt, children: [
              /* @__PURE__ */ r(zr, { "aria-hidden": "true" }),
              "Back"
            ] }),
            h === "run" && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: j, onClick: Vt, children: "New batch" }),
            /* @__PURE__ */ r("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: j, onClick: gt, children: "Close" }),
            lt()
          ] })
        ]
      }
    )
  ] });
}
const Qs = "data-quality.description-collapsed.v1";
function nu() {
  try {
    return localStorage.getItem(Qs) === "true";
  } catch {
    return !1;
  }
}
function ru({
  details: e,
  label: t
}) {
  const [n, a] = C(nu), i = Sn(() => {
    a((o) => {
      const s = !o;
      try {
        localStorage.setItem(Qs, String(s));
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
    !n && (e != null && e.trim() ? /* @__PURE__ */ r(xc, { className: "dq-description-body", children: e }) : /* @__PURE__ */ r("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
function au({
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
  var w;
  const h = e ? e.ranked.slice(0, e.limit) : [], p = !!e && (e.ranked.length > e.limit || (((w = e.candidates[e.cursor]) == null ? void 0 : w.total) ?? 0) > 0);
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
          children: /* @__PURE__ */ r(Qc, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-queue-list", children: h.map((m) => {
      const N = `${m.count.toLocaleString()} matching ${m.count === 1 ? o.one : o.many}`, b = m.flags.length ? `Flagged: ${m.flags.join(", ")}` : "";
      return /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${m.name}, ${N}${b ? `. ${b}` : ""}`,
          title: b || void 0,
          "aria-current": a === m.id ? "true" : void 0,
          disabled: i,
          onClick: () => s(m.id),
          children: [
            /* @__PURE__ */ r(vr, { performer: m }),
            /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: m.name }),
            b && /* @__PURE__ */ r(ca, { className: "dq-flag-icon", "aria-hidden": "true" }),
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
const iu = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], ou = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function su(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), a = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), i = t.bottom + 8;
  return { top: i, left: a, width: n, maxHeight: Math.max(160, window.innerHeight - i - 16) };
}
function aa(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function cu(e, t) {
  const n = pi(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", a = e.conditionTagIds.map(
    (o) => t[o] === void 0 ? "…" : t[o] ?? "Unavailable tag"
  ), i = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${aa(a, "or")}`,
    includesAll: `has ${aa(a, "and")}`,
    excludes: `has none of ${aa(a, "or")}`,
    excludesAll: `missing ${aa(a, "or")}`
  };
  return `${n} · ${i[e.condition]}`;
}
function lu({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: a,
  onEditCriteria: i
}) {
  const [o, s] = C(!1), [l, d] = C(null), h = T(null), p = T(null), w = Ct(), m = Cr(e.conditionTagIds), N = cu(e, m);
  Zt(() => {
    if (!o || !h.current) return;
    const v = () => h.current && d(su(h.current));
    return v(), window.addEventListener("resize", v), () => window.removeEventListener("resize", v);
  }, [o]), W(() => {
    var M, j;
    if (!o) return;
    const v = (M = p.current) == null ? void 0 : M.querySelector('[aria-pressed="true"]');
    v && !v.disabled ? v.focus() : (j = p.current) == null || j.focus();
  }, [o]);
  const b = () => {
    s(!1), requestAnimationFrame(() => {
      var v;
      return (v = h.current) == null ? void 0 : v.focus();
    });
  }, y = (v) => {
    if (!(v.target instanceof Element && v.target.closest('[role="dialog"]') !== p.current || v.defaultPrevented)) {
      if (v.key === "Escape")
        v.preventDefault(), b();
      else if (v.key === "Tab" && p.current) {
        const j = [...p.current.querySelectorAll(ou)].filter((ce) => ce.closest('[role="dialog"]') === p.current).sort(
          (ce, se) => ce.compareDocumentPosition(se) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!j.length) return;
        const I = j[0], P = j[j.length - 1], U = document.activeElement;
        v.shiftKey && (U === I || U === p.current) ? (v.preventDefault(), P.focus()) : !v.shiftKey && U === P && (v.preventDefault(), I.focus());
      }
    }
  }, E = !["any", "isNull"].includes(e.condition);
  return /* @__PURE__ */ c("div", { className: "dq-scope", children: [
    /* @__PURE__ */ c(
      "button",
      {
        ref: h,
        type: "button",
        className: "dq-header-button dq-scope-button",
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        "aria-controls": o ? w : void 0,
        title: N,
        onClick: () => o ? b() : s(!0),
        children: [
          /* @__PURE__ */ r(Vo, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-summary", children: N }),
          /* @__PURE__ */ r(Bo, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ c(fe, { children: [
      /* @__PURE__ */ r("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: b }),
      /* @__PURE__ */ c(
        "div",
        {
          ref: p,
          id: w,
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
          onKeyDown: y,
          children: [
            /* @__PURE__ */ c("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Performers to review" }),
              /* @__PURE__ */ r("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: iu.map(({ mode: v, label: M }) => /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === v,
                  onClick: () => e.targetMode !== v && a({ targetMode: v }),
                  children: M
                },
                v
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ r(
                Cn,
                {
                  entityType: "performer",
                  values: e.performerIds,
                  onChange: (v) => a({ performerIds: v }),
                  placeholder: "All performers...",
                  allowCreate: !1
                }
              ),
              e.targetMode === "filter" && /* @__PURE__ */ c("div", { className: "dq-scope-criteria", children: [
                /* @__PURE__ */ r("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ r(
                  Ur,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: oi,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (v) => a({ performerFilter: v })
                  }
                ) }),
                /* @__PURE__ */ c("button", { type: "button", className: "dq-button", onClick: i, children: [
                  /* @__PURE__ */ r(qr, { "aria-hidden": "true" }),
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
                  onChange: (v) => a({ condition: v.target.value }),
                  children: hi.map((v) => /* @__PURE__ */ r("option", { value: v, children: fi[v] }, v))
                }
              ),
              E && /* @__PURE__ */ c(fe, { children: [
                /* @__PURE__ */ r(
                  Cn,
                  {
                    entityType: "tag",
                    values: e.conditionTagIds,
                    onChange: (v) => a({ conditionTagIds: v }),
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
                        onChange: (v) => a({ includeSubtags: v.target.checked })
                      }
                    ),
                    "Include subtags"
                  ] }),
                  Kr(e.condition) && /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ r(
                      "input",
                      {
                        type: "checkbox",
                        checked: e.hideConfirmedAbsent ?? !0,
                        onChange: (v) => a({ hideConfirmedAbsent: v.target.checked })
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
function sa(e) {
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
function du(e) {
  const t = e.occurrence;
  return JSON.stringify([
    Re(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {},
    t.flagPerformerTagIds ?? []
  ]);
}
async function uu(e, t) {
  const n = Re(e) === "audio", a = new Set(e.occurrence.flagPerformerTagIds ?? []), i = (l) => ({
    id: l.id,
    name: l.name,
    total: (n ? l.audioCount : l.videoCount) ?? 0,
    flags: (l.tags ?? []).filter((d) => a.has(d.id)).map((d) => d.name)
  }), o = e.occurrence, s = [];
  if (o.targetMode === "selected" && o.performerIds.length > 0)
    for (const l of o.performerIds) {
      const d = await Al(
        `/api/performers/${l}`,
        { signal: t }
      );
      d && s.push(i(d));
    }
  else {
    const { _filterExpression: l, ...d } = o.targetMode === "filter" ? o.performerFilter : {};
    for (let h = 1; ; h++) {
      const p = await oe(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            An({
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
function Hs(e, t, n) {
  const a = xi(e, [t]);
  return Il(a, a.view.filter, n);
}
function Ys(e, t) {
  const n = e.findIndex(
    (a) => a.count < t.count || a.count === t.count && a.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function ri(e, t, n, a) {
  if (t >= e.length) return !0;
  const i = e[t].total;
  return i <= 0 ? !0 : n.length >= a && i < n[a - 1].count;
}
async function fu(e, t, n, a, i = {}) {
  const o = sa(e), s = du(e), l = js(e.occurrence), d = (t == null ? void 0 : t.signature) === o && !t.partial ? t : {
    signature: o,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: l ? "" : s,
    candidates: l ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await uu(e, a),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: h } = d, p = [...d.ranked];
  let w = d.cursor, m = !1;
  const N = (b) => ({
    ...d,
    cursor: w,
    ranked: [...p],
    limit: n,
    complete: !b && ri(h, w, p, n),
    ...b ? { partial: b } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: i.concurrency ?? 6 }, async () => {
        var b;
        for (; !m && !ri(h, w, p, n); ) {
          a.throwIfAborted();
          const y = h[w++], E = await Hs(e, y.id, a);
          E > 0 && Ys(p, { ...y, count: E }), (b = i.onProgress) == null || b.call(i, N(!0));
        }
      })
    );
  } catch (b) {
    throw m = !0, b;
  }
  return a.throwIfAborted(), N(!1);
}
function hu(e, t, n) {
  const a = e.candidates.findIndex((o) => o.id === t);
  if (e.partial || a < 0 || a >= e.cursor) return e;
  const i = e.ranked.filter((o) => o.id !== t);
  return n > 0 && Ys(i, { ...e.candidates[a], count: n }), {
    ...e,
    ranked: i,
    complete: ri(e.candidates, e.cursor, i, e.limit)
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
function pu(e) {
  var l, d, h;
  const [t, n] = C({}), [a, i] = C(""), o = (((l = e == null ? void 0 : e.presentation) == null ? void 0 : l.annotations) ?? []).includes("tags") ? ((d = e == null ? void 0 : e.presentation) == null ? void 0 : d.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...o,
      ...((h = e == null ? void 0 : e.presentation) == null ? void 0 : h.binParents) ?? []
    ])
  ]);
  return W(() => {
    let p = !0;
    return n({}), i(""), Promise.all(
      JSON.parse(s).map(
        async (w) => [w, await ya([w])]
      )
    ).then((w) => {
      p && n(Object.fromEntries(w));
    }).catch(() => {
      p && i(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      p = !1;
    };
  }, [s]), { ids: t, error: a };
}
function mu(e, t, n) {
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
function gu({
  videos: e,
  review: t,
  savedObjectFilter: n,
  trees: a,
  disabled: i,
  onToggle: o
}) {
  var b;
  const s = ((b = t.presentation) == null ? void 0 : b.binParents) ?? [], l = new Set(
    s.flatMap((y) => (a[y] ?? []).filter((E) => E !== y))
  ), d = s.every((y) => a[y]), h = Hr(t.view.objectFilter, n).bins.filter(
    (y) => !d || l.has(y)
  ), p = /* @__PURE__ */ new Map();
  for (const y of e)
    for (const E of y.tags ?? [])
      if (l.has(E.id)) {
        const v = p.get(E.id) ?? { name: E.name, count: 0 };
        v.count++, p.set(E.id, v);
      }
  const w = h.filter((y) => !p.has(y)), m = Cr(w);
  for (const y of w)
    p.set(y, {
      name: m[y] === void 0 ? "…" : m[y] ?? "Unavailable tag",
      count: 0
    });
  if (!s.length) return null;
  const N = [...p].sort((y, E) => y[1].name.localeCompare(E[1].name));
  return /* @__PURE__ */ c("div", { className: "dq-bins", role: "group", "aria-label": "Tag bins on this page", children: [
    /* @__PURE__ */ r("span", { className: "dq-bins-label", "aria-hidden": "true", children: "On this page" }),
    N.map(([y, E]) => {
      const v = h.includes(y);
      return /* @__PURE__ */ c(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": v,
          title: v ? `Show every video again, not only ${E.name}` : `Show only videos tagged ${E.name}`,
          disabled: i,
          onClick: () => o(y),
          children: [
            v && /* @__PURE__ */ r(ui, { "aria-hidden": "true" }),
            E.name,
            " ",
            /* @__PURE__ */ r("span", { className: "dq-bin-count", children: E.count })
          ]
        },
        y
      );
    }),
    !N.length && /* @__PURE__ */ r("span", { className: "dq-bins-empty", children: "No matching tag bins on this page." })
  ] });
}
function nr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function bu(e) {
  if (!nr(e) || Object.keys(e).length !== 1 || !nr(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !nr(t.tagsCriterion)) return null;
  const { value: n, modifier: a, depth: i, ...o } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && a === "INCLUDES" && i === 0 && !Object.keys(o).length ? n[0] : null;
}
function Hr(e, t) {
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
    if (!nr(o) || o.operator !== "AND" || !Array.isArray(o.children))
      break;
    const s = o.children, l = bu(s.at(-1));
    if (l == null || s.length > 3) break;
    let d = {}, h = null, p = !0;
    for (const [w, m] of s.slice(0, -1).entries())
      !nr(m) || Object.keys(m).length !== 1 ? p = !1 : w === 0 && nr(m.filter) && Object.keys(m.filter).length ? d = m.filter : !h && nr(m.group) ? h = m.group : p = !1;
    if (!p) break;
    a.unshift(l), n = h ? { ...d, _filterExpression: h } : d;
  }
  return { base: n, bins: a };
}
function wu(e, t, n) {
  const { base: a, bins: i } = Hr(e.view.objectFilter, n);
  return (i.includes(t) ? i.filter((s) => s !== t) : [...i, t]).reduce(yu, { ...e, view: { ...e.view, objectFilter: a } });
}
function yu(e, t) {
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
const Na = [
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
], vu = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function sr(e) {
  const t = Se(e) ? e.occurrence : void 0;
  return {
    filter: Pt({
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
function qo(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function ai(e, t) {
  let n;
  if (Se(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!Na.some((l) => l !== "performer" && t.has(l))) {
    const l = sr(e);
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
  if (Se(e) && (o = {
    ...vu,
    ...qo(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(o.targetMode) || !hi.includes(o.condition) || !Array.isArray(o.performerIds) || !Array.isArray(o.conditionTagIds) || typeof o.includeSubtags != "boolean" || typeof o.hideConfirmedAbsent != "boolean" || [...o.performerIds, ...o.conditionTagIds].some(
    (l) => !Number.isSafeInteger(l) || l <= 0
  ) || !o.performerFilter || typeof o.performerFilter != "object" || Array.isArray(o.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Pt(i, Re(e)),
      objectFilter: qo(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: o,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
const So = { dataQualityOpenedFromList: !0 };
function Xs() {
  const e = window.history.state;
  return !!e && typeof e == "object" && e.dataQualityOpenedFromList === !0;
}
function Zs(e, { openingFromList: t = !1 } = {}) {
  t ? window.history.pushState({ ...So }, "", e) : window.history.replaceState(Xs() ? { ...So } : null, "", e);
}
function jr(e, t) {
  const n = new URLSearchParams(window.location.search);
  Na.forEach((a) => n.delete(a)), n.set("review", e);
  for (const a of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[a] !== void 0 && n.set(a, String(t.filter[a]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((a) => `${a.key}:${a.direction}`).join(",")
  ), n.set("filters", JSON.stringify(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", JSON.stringify(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), Zs(`${window.location.pathname}?${n}${window.location.hash}`);
}
function pn(e, t) {
  const n = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return Se(e) ? {
    ...e,
    view: n,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: n };
}
function ir(e) {
  const t = e;
  return pn(t, sr(t));
}
function Eo(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !or(
    JSON.parse(_n(pn(e, t))),
    JSON.parse(_n(pn(e, sr(e))))
  );
}
function ec(e, t) {
  if (Me(e) !== "video") return e;
  const { base: n, bins: a } = Hr(e.view.objectFilter, t.view.objectFilter);
  return a.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function ia(e, t) {
  if (Me(e) !== "video") return t;
  const { base: n, bins: a } = Hr(t.objectFilter, e.view.objectFilter);
  return a.length ? { ...t, objectFilter: n } : t;
}
function Co(e, t) {
  return !t || !Se(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function Da(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const a of e)
    n.set(a.media.id, [...n.get(a.media.id) ?? [], a]);
  return [...n.values()].reverse().flat();
}
const Ut = (e) => e instanceof Error ? e.message : "Request failed.", _a = 50, Nu = [], ko = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function qu(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? _c(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? jo(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function Su({ media: e, kind: t }) {
  const [n, a] = C(!1);
  return /* @__PURE__ */ r("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ r(zo, {}) : /* @__PURE__ */ r(ga, {}) : /* @__PURE__ */ r(
    "img",
    {
      src: Wa(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => a(!0)
    }
  ) });
}
function Eu({
  tags: e,
  preview: t,
  showPreview: n,
  trees: a,
  actionTagIds: i,
  label: o
}) {
  const s = Ai(t), l = n ? s : null, d = e == null ? void 0 : e.absent, h = Ci(
    ye(() => [...i, ...d ?? []], [i, d])
  ), p = (P) => h[P] ?? { id: P, name: h[P] === void 0 ? "…" : "Unavailable tag" }, w = (P) => ar(P.map(p)), m = l && e ? qs(l, e, a) : null, N = e ? Hl(e) : [], b = new Set(N.map((P) => P.id)), y = new Set(m == null ? void 0 : m.removed), E = new Set(m == null ? void 0 : m.markedAbsent), v = new Set(m == null ? void 0 : m.absenceCleared), M = /* @__PURE__ */ c("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ r(Ga, { "aria-hidden": "true" }),
    "absent"
  ] }), j = w((m == null ? void 0 : m.added) ?? []), I = w(((m == null ? void 0 : m.markedAbsent) ?? []).filter((P) => !b.has(P)));
  return /* @__PURE__ */ c("section", { className: "dq-panel-section", "aria-label": o, children: [
    /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ c(fe, { children: [
      N.length || j.length || I.length ? /* @__PURE__ */ c("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        N.map(
          (P) => y.has(P.id) ? /* @__PURE__ */ c("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ c("del", { children: [
              "− ",
              /* @__PURE__ */ r(Kt, { tag: P })
            ] }),
            E.has(P.id) && M
          ] }, P.id) : /* @__PURE__ */ r("li", { className: "dq-tag", children: /* @__PURE__ */ r(Kt, { tag: P }) }, P.id)
        ),
        j.map((P) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ c("ins", { children: [
          "+ ",
          /* @__PURE__ */ r(Kt, { tag: P })
        ] }) }, `added-${P.id}`)),
        I.map((P) => /* @__PURE__ */ c("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ r("ins", { children: /* @__PURE__ */ r(Kt, { tag: P }) }),
          M
        ] }, `absent-${P.id}`))
      ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" }),
      e.absent.length > 0 && /* @__PURE__ */ c(fe, { children: [
        /* @__PURE__ */ r("h4", { className: "dq-subheading", children: "Confirmed absent" }),
        /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: w(e.absent).map((P) => /* @__PURE__ */ c(
          "li",
          {
            className: `dq-tag dq-tag-absent${v.has(P.id) ? " dq-tag-removed" : ""}`,
            children: [
              /* @__PURE__ */ r(Ga, { "aria-hidden": "true" }),
              v.has(P.id) ? /* @__PURE__ */ c("del", { children: [
                "− ",
                /* @__PURE__ */ r(Kt, { tag: P })
              ] }) : /* @__PURE__ */ r(Kt, { tag: P })
            ]
          },
          P.id
        )) })
      ] })
    ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading…" })
  ] });
}
function Cu({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: a,
  onSaveDefaults: i,
  editRequest: o = 0,
  onEditRequestHandled: s,
  pageControls: l
}) {
  var Mr;
  const d = Re(e), h = mn(d), p = d === "audio" ? "Audio" : "Scene", w = (f) => {
    var q;
    return f.title || ((q = f.files[0]) == null ? void 0 : q.basename) || p;
  }, m = (f) => `${f.occurrence ? `${f.occurrence.performer.name} — ` : ""}${w(f.media)}`, N = T(null), b = T("");
  if (!N.current)
    try {
      N.current = ai(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (f) {
      b.current = Ut(f), N.current = { query: sr(e), startAtEnd: !1 };
    }
  const [y, E] = C(null), [v, M] = C(""), j = T(null), I = T(null), P = T(null), U = T(null), [ce, se] = C(!!b.current), O = T(0), [D, H] = C(N.current.query), k = T(D);
  k.current = D;
  const [$, B] = C(0), re = T(N.current.startAtEnd), [X, de] = C([]), [F, z] = C(null), V = T(null), [K, te] = C(null), [ve, Ne] = C(0), mt = ye(() => {
    if (!F) return null;
    const f = X.findIndex((q) => q.key === F.key);
    return f < 0 ? null : X.slice(f + 1).find((q) => q.media.id !== F.media.id) ?? null;
  }, [F, X]), [tt, ut] = C(0), [Le, We] = C(!1), [nt, Gt] = C(!1), ke = T(!1), Bt = T(!0), pe = T(null);
  W(() => (Bt.current = !0, () => {
    Bt.current = !1;
  }), []);
  const [rt, je] = C(b.current), [gn, Ge] = C(""), [Ae, Ee] = C(null), [Qe, en] = C(!1), [Nt, Bn] = C([]), st = T([]), kt = T(null), at = T(null), Vt = T(null);
  W(() => {
    var f, q;
    Qe && ((q = (f = Vt.current) == null ? void 0 : f.querySelector("input")) == null || q.focus());
  }, [Qe]);
  const [gt, Tn] = C(!1), [Lt, tn] = C(!1);
  W(() => {
    if (Le || gt || !at.current) return;
    const f = requestAnimationFrame(() => {
      if (document.querySelector(ko)) return;
      const q = at.current;
      at.current = null;
      const L = document.activeElement;
      L && L !== document.body || q != null && q.isConnected && !q.disabled && q.focus();
    });
    return () => cancelAnimationFrame(f);
  }, [Le, gt, $]);
  const [At, ae] = C([]), [ft, bn] = C({}), Mt = T(null), He = T(0), [Ue, bt] = C({});
  W(() => {
    let f = !0;
    return Promise.all(
      $i(D.objectFilter).map(
        async (q) => [
          String(q),
          (await oe(`/api/tags/${q}`)).name
        ]
      )
    ).then((q) => {
      f && bt(Object.fromEntries(q));
    }).catch(() => {
    }), () => {
      f = !1;
    };
  }, [D.objectFilter]);
  const ee = ye(
    () => Mi(D.objectFilter, Ue),
    [Ue, D.objectFilter]
  ), x = T(0), be = T(e);
  be.current = e;
  const Ye = y ?? e, Xe = ye(
    () => pn(Ye, D),
    [Ye, D]
  ), Z = ye(
    () => Co(Xe, D.performerFocus),
    [Xe, D.performerFocus]
  ), nn = T(Z);
  nn.current = Z;
  const wn = T(Xe);
  wn.current = Xe;
  const [qt, it] = C("items"), [De, Be] = C(null), ct = T(null), rn = T("");
  function St(f) {
    const q = typeof f == "function" ? f(ct.current) : f;
    ct.current = q, Be(q);
  }
  const [an, yn] = C(!1), [Jt, Vn] = C(null), Ve = T(null), lt = Se(Xe) ? sa(Xe) : "", [S, A] = C(0), [ne, Ce] = C(null);
  W(() => () => {
    var f;
    return (f = Ve.current) == null ? void 0 : f.controller.abort();
  }, []), W(() => {
    const f = Ve.current;
    !f || f.signature === lt || (f.controller.abort(), Ve.current = null, yn(!1));
  }, [lt]), W(() => {
    var L;
    const f = ct.current;
    if (qt !== "performers" || !lt || ((L = Ve.current) == null ? void 0 : L.signature) === lt || rn.current === lt || (f == null ? void 0 : f.signature) === lt && f.complete)
      return;
    const q = (f == null ? void 0 : f.signature) === lt ? f : null;
    Wt(f, (q == null ? void 0 : q.limit) ?? _a);
  }, [qt, lt, De, Jt, an]);
  const qe = D.performerFocus, me = JSON.stringify(
    Se(Xe) ? Xe.occurrence.flagPerformerTagIds ?? [] : []
  );
  W(() => {
    if (!qe) {
      Ce(null);
      return;
    }
    let f = !0;
    const q = new Set(JSON.parse(me));
    return oe(
      `/api/performers/${qe}`
    ).then((L) => {
      f && Ce({
        id: qe,
        name: L.name,
        flags: (L.tags ?? []).filter((J) => q.has(J.id)).map((J) => J.name)
      });
    }).catch(() => {
    }), () => {
      f = !1;
    };
  }, [qe, me]);
  const Ze = Eo(e, D), Ft = Eo(e, ia(e, D)), wt = nt || Le || Qe, G = Number(D.filter.page);
  function Fe(f, q = !1) {
    ke.current || (b.current = "", re.current = q, k.current = f, H(f), ut(0), We(!0), q || jr(e.id, f), B((L) => L + 1));
  }
  function we() {
    if (ke.current = !1, Gt(!1), Bt.current && pe.current) {
      const f = pe.current;
      pe.current = null, Fe(f.query, f.startAtEnd);
    }
  }
  W(() => {
    const f = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const q = ai(
            be.current,
            new URLSearchParams(window.location.search)
          );
          ke.current ? pe.current = q : Fe(q.query, q.startAtEnd);
        } catch (q) {
          je(Ut(q));
        }
    };
    return window.addEventListener("popstate", f), () => window.removeEventListener("popstate", f);
  }, [e.id]), W(() => (a(nt || Le || Qe || !!y), () => a(!1)), [nt, Le, Qe, !!y, a]);
  async function on(f, q, L) {
    if (Se(f)) {
      const ie = await Us(
        f,
        Mt.current,
        q,
        L
      );
      return {
        items: ie.items.map((le) => ({
          key: le.key,
          media: le.media,
          occurrence: le
        })),
        totalCount: ie.totalCount
      };
    }
    const J = await _r(
      f,
      { ...f.view.filter, page: q },
      L
    );
    return {
      items: J.items.map((ie) => ({ key: String(ie.id), media: ie })),
      totalCount: J.totalCount
    };
  }
  function sn(f, q, L, J = !1, ie = !1) {
    if (!Bt.current || pe.current) return;
    se(!0), de(
      ie ? f.items : Da(f.items, k.current.startFrom === "end")
    ), ut(f.totalCount), Rn(L, J);
    const le = {
      ...k.current,
      filter: { ...k.current.filter, page: q }
    };
    k.current = le, H(le), jr(e.id, le);
  }
  function Rn(f, q = !1) {
    (f == null ? void 0 : f.key) !== (F == null ? void 0 : F.key) && (V.current = null), (f == null ? void 0 : f.media.id) !== (F == null ? void 0 : F.media.id) && te(q && f ? f.media.id : null), z(f);
  }
  W(() => {
    if (b.current) return;
    const f = new AbortController();
    U.current = f;
    const q = ++x.current;
    return We(!0), je(""), Ge(""), V.current = null, te(null), z(null), de([]), en(!1), (async () => {
      const L = Co(
        pn(be.current, k.current),
        k.current.performerFocus
      );
      Mt.current = Se(L) ? await Fi(L, f.signal) : null;
      let J = Number(L.view.filter.page), ie = await on(L, J, f.signal);
      const le = Math.max(
        1,
        Math.ceil(ie.totalCount / Number(L.view.filter.perPage))
      );
      (re.current || J > le) && (J = le, ie = await on(L, J, f.signal)), re.current = !1;
      const Je = L.view.startFrom === "end" ? -1 : 1;
      for (; Se(L) && !ie.items.length && J + Je >= 1 && J + Je <= le && !f.signal.aborted; )
        J += Je, ie = await on(L, J, f.signal);
      if (q !== x.current || f.signal.aborted) return;
      const It = Da(ie.items, L.view.startFrom === "end");
      sn(ie, J, It[0] ?? null);
    })().catch((L) => {
      !f.signal.aborted && q === x.current && je(Ut(L));
    }).finally(() => {
      !f.signal.aborted && q === x.current && (se(!0), We(!1));
    }), () => {
      f.abort(), x.current++;
    };
  }, [$, e.id]), W(() => {
    if (Ee(null), !F) return;
    let f = !0;
    return Xt(d, F).then((q) => {
      f && (Ee(q), ae(
        Se(e) ? q.ids.filter((L) => e.occurrence.tagIds.includes(L)) : []
      ));
    }).catch((q) => {
      f && je(`Could not load current tags. ${Ut(q)}`);
    }), () => {
      f = !1;
    };
  }, [F]), W(() => {
    if (!Se(e) || e.actions.length)
      return;
    let f = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (q) => [
          q,
          (await oe(`/api/tags/${q}`)).name
        ]
      )
    ).then((q) => {
      f && bn(Object.fromEntries(q));
    }).catch((q) => {
      f && je(Ut(q));
    }), () => {
      f = !1;
    };
  }, [e]);
  async function kr(f = !1, q = !1, L = !1) {
    var Mn;
    if (!F) return;
    const J = X.findIndex((Te) => Te.key === F.key), ie = D.startFrom === "end" ? -1 : 1, le = ((Mn = V.current) == null ? void 0 : Mn.key) === F.key ? V.current : { key: F.key, page: G, before: X.slice(0, J + 1).map((Te) => Te.key), after: X.slice(J + 1).map((Te) => Te.key) }, Je = new Set(le.after), It = new Set(le.before), $n = X.find((Te) => {
      var Et;
      return Je.has(Te.key) || (ie === 1 || G < le.page) && ((Et = V.current) == null ? void 0 : Et.key) === F.key && !It.has(Te.key);
    });
    if (!f && $n) {
      Rn($n, L);
      return;
    }
    const dt = f ? It : new Set(X.map((Te) => Te.key)), _t = 1100 - (Date.now() - He.current);
    _t > 0 && await new Promise((Te) => window.setTimeout(Te, _t));
    let _e = ie === -1 && !f ? Math.max(1, G - 1) : G;
    for (; Bt.current && !pe.current; ) {
      let Te = await on(Z, _e);
      const Et = Math.max(
        1,
        Math.ceil(Te.totalCount / Number(D.filter.perPage))
      );
      _e > Et && (_e = Et, Te = await on(Z, _e));
      const Yn = Da(Te.items, ie === -1), fn = new Map(Yn.map((Ot) => [Ot.key, Ot])), Fn = f ? le.after.flatMap((Ot) => {
        const xr = fn.get(Ot);
        return xr ? [xr] : [];
      }) : [], pr = new Set(Fn.map((Ot) => Ot.key)), mr = f ? {
        ...Te,
        items: [
          ...Fn,
          ...Yn.filter(
            (Ot) => Ot.key !== F.key && !pr.has(Ot.key)
          )
        ]
      } : Te;
      if (q) {
        V.current = le, sn(mr, _e, F, !1, f);
        return;
      }
      const Fr = ie === -1 && G === 1 && !f ? void 0 : mr.items.find(
        (Ot) => !dt.has(Ot.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(f && ie === -1 && _e === le.page) || Je.has(Ot.key))
      );
      if (Fr || (ie === -1 ? _e <= 1 : _e >= Et)) {
        sn(
          mr,
          _e,
          Fr ?? null,
          L,
          f
        ), Fr || Ge(
          Te.totalCount ? `Reached the end in this direction. Matching items remain available from the ${h.queue} pages.` : `No matching ${h.many}.`
        );
        return;
      }
      _e += ie;
    }
  }
  async function zt(f, q = !1, L = !1, J = !1) {
    if (y || !F || ke.current || Le || Qe && !L)
      return;
    const ie = L || J || !!(f != null && f.steps.length), le = ie && !q;
    if (ie && (!t || !Ae) || f && Kn(f) && !n) return;
    ke.current = !0, Gt(!0), je(""), Ge("");
    const Je = X.findIndex((dt) => dt.key === F.key), It = ie && !q && Je >= 0 ? X[Je + 1] ?? null : null;
    It && (de(
      (dt) => dt.filter((_t) => _t.key !== F.key)
    ), Rn(It, !0));
    let $n = !1;
    try {
      if (ie) {
        const dt = await Xt(d, F);
        if (f)
          await _d(Z, F, f);
        else {
          const _e = J && Se(e) ? e.occurrence.tagIds.filter((Et) => dt.ids.includes(Et)) : st.current, Te = Sr(_e, J ? At : Nt);
          await Li(Z, F, Te);
        }
        He.current = Date.now();
        const _t = await Xt(d, F);
        It || Ee(_t), $n = !0, en(!1), Ge("Tags saved."), F.occurrence && (Tr(F.occurrence.performer.id), A((_e) => _e + 1));
      }
      if (!Bt.current || pe.current) return;
      ie ? await kr(!0, q, le) : q || await kr(), q && L && requestAnimationFrame(() => {
        var dt;
        return (dt = kt.current) == null ? void 0 : dt.focus();
      });
    } catch (dt) {
      if (je(
        $n ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${Ut(dt)}` : ie ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${Ut(dt)}` : `Could not advance. ${Ut(dt)}`
      ), ie && !$n) {
        It && (de(X), te(null), Ne((_t) => _t + 1), z(F)), He.current = Date.now();
        try {
          Ee(await Xt(d, F));
        } catch {
          Ee(null), je(
            (_t) => `${_t} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      we();
    }
  }
  const Tt = !Qe && !y && !gt && !Lt && (F != null || Le || nt);
  qi({
    surface: "local",
    enabled: Tt,
    actions: e.actions,
    onAction: (f, q) => {
      const L = e.actions[f];
      L && zt(L, q);
    },
    onFind: () => tn(!0)
  });
  const Dt = (f) => nt || Le || !Ae || !!y || !t && f.steps.length > 0 || !n && Kn(f);
  function In() {
    !i || y || ke.current || Qe || (P.current = document.activeElement, I.current = {
      error: rt,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(k.current),
      items: X,
      current: F,
      total: tt,
      targets: Mt.current,
      stayedCursor: V.current
    }, E(structuredClone(e)), M(""), Ge(""), je(""));
  }
  W(() => {
    if (!o) {
      O.current = 0;
      return;
    }
    o !== O.current && ce && !Le && (O.current = o, In(), s == null || s());
  }, [o, Le, ce]);
  function cn() {
    E(null), M(""), requestAnimationFrame(() => {
      const f = P.current;
      f != null && f.isConnected && f !== document.body && f.focus();
    });
  }
  function Ar() {
    var q;
    const f = I.current;
    !f || nt || ((q = U.current) == null || q.abort(), x.current++, k.current = f.query, H(f.query), de(f.items), z(f.current), ut(f.total), Mt.current = f.targets, V.current = f.stayedCursor, We(!1), je(f.error), Ge(""), window.history.replaceState(window.history.state, "", f.url), cn());
  }
  async function ht() {
    if (!y || !i || ke.current) return;
    const f = pn(
      { ...y, name: y.name.trim() },
      ia(be.current, k.current)
    ), q = Br(f);
    if (q) {
      M(q);
      return;
    }
    ke.current = !0, Gt(!0), M("");
    try {
      if (await i(f) === !1) throw new Error("Could not save review.");
      cn(), Ge("Review saved.");
    } catch (L) {
      M(
        "Could not save review. Your edits are still open. " + Ut(L)
      );
    } finally {
      we();
    }
  }
  async function yt() {
    if (!i || ke.current) return;
    const f = ia(be.current, k.current), q = pn(be.current, {
      ...f,
      filter: { ...f.filter, page: 1 }
    });
    ke.current = !0, Gt(!0), je("");
    try {
      if (await i(q) === !1) throw new Error("Could not save review.");
      Ge("Queue saved to this review.");
    } catch (L) {
      je("Could not save queue. " + Ut(L));
    } finally {
      we();
    }
  }
  const xe = D.performerScope, vt = (f) => {
    const { performerFocus: q, ...L } = k.current, J = q && !("targetMode" in f || "performerIds" in f || "performerFilter" in f);
    Fe({
      ...L,
      ...J ? { performerFocus: q } : {},
      filter: { ...L.filter, page: 1 },
      performerScope: { ...xe, ...f }
    });
  };
  async function Wt(f, q) {
    var ie;
    const L = wn.current;
    if (!Se(L)) return;
    (ie = Ve.current) == null || ie.controller.abort();
    const J = {
      signature: sa(L),
      controller: new AbortController()
    };
    Ve.current = J, rn.current = "", yn(!0), Vn(null);
    try {
      const le = await fu(L, f, q, J.controller.signal, {
        onProgress: (Je) => {
          Ve.current === J && St(Je);
        }
      });
      Ve.current === J && St(le);
    } catch (le) {
      Ve.current === J && !J.controller.signal.aborted && (rn.current = J.signature, Vn({ signature: J.signature, message: Ut(le) }));
    } finally {
      Ve.current === J && (Ve.current = null, yn(!1));
    }
  }
  function Rt() {
    var f;
    (f = Ve.current) == null || f.controller.abort(), Ve.current = null, yn(!1), St((q) => q && { ...q, partial: !0, complete: !1 });
  }
  async function Tr(f) {
    var ie;
    const q = wn.current;
    if (!Se(q)) return;
    if (Ve.current) {
      Rt();
      return;
    }
    const L = sa(q);
    if (((ie = ct.current) == null ? void 0 : ie.signature) !== L || ct.current.partial) return;
    const J = 1100 - (Date.now() - He.current);
    J > 0 && await new Promise((le) => window.setTimeout(le, J));
    try {
      const le = await Hs(q, f);
      if (Ve.current) {
        Rt();
        return;
      }
      St(
        (Je) => (Je == null ? void 0 : Je.signature) === L ? hu(Je, f, le) : Je
      );
    } catch {
      St(
        (le) => (le == null ? void 0 : le.signature) === L ? { ...le, partial: !0, complete: !1 } : le
      );
    }
  }
  const Jn = D.performerFocus ? De == null ? void 0 : De.candidates.find((f) => f.id === D.performerFocus) : void 0, Ie = (ne == null ? void 0 : ne.id) === D.performerFocus ? ne : Jn ?? null;
  function ln(f) {
    if (ke.current) return;
    const q = {
      ...k.current,
      performerFocus: f,
      filter: { ...k.current.filter, page: 1 }
    };
    Fe(q, q.startFrom === "end"), it("items");
  }
  function Rr() {
    const { performerFocus: f, ...q } = k.current;
    Fe(
      { ...q, filter: { ...q.filter, page: 1 } },
      q.startFrom === "end"
    );
  }
  const vn = T(null);
  vn.current ?? (vn.current = Es());
  const Ir = vn.current, ge = Ss(Ye.actions), lr = ye(
    () => Ye.actions.flatMap((f) => f.steps.flatMap((q) => q.tagIds)),
    [Ye.actions]
  ), On = T(null);
  W(() => {
    const f = On.current, q = f == null ? void 0 : f.querySelector('[aria-current="true"]');
    if (!f || !q) return;
    const L = f.getBoundingClientRect(), J = q.getBoundingClientRect();
    J.top < L.top ? f.scrollTop -= L.top - J.top : J.bottom > L.bottom && (f.scrollTop += J.bottom - L.bottom);
  }, [F == null ? void 0 : F.key, qt]);
  const Or = T(null), dn = T(null);
  W(() => {
    var L, J;
    const f = dn.current;
    if (!f) return;
    dn.current = null;
    const q = [...((L = Or.current) == null ? void 0 : L.querySelectorAll(".dq-partner")) ?? []];
    (J = q.find((ie) => ie.dataset.partnerKey === f) ?? q[0]) == null || J.focus();
  }, [F == null ? void 0 : F.key]);
  const dr = nt || Le || Qe || !!y, Nn = ye(
    () => y ? pn(y, ia(e, D)) : null,
    [y, e, D]
  ), zn = ye(
    () => Nn != null && Nr(ir(Nn)) !== Nr(ir(e)),
    [Nn, e]
  );
  function Qt() {
    F ? Xt(d, F).then(Ee).catch((f) => je(Ut(f))) : Fe(k.current);
  }
  const Wn = rt ? /* @__PURE__ */ c("p", { role: "alert", children: [
    rt,
    " ",
    /* @__PURE__ */ r("button", { type: "button", disabled: nt, onClick: Qt, children: F ? "Reload tags" : "Retry queue" })
  ] }) : null, un = nt || Le || F != null && !Ae, Pe = Math.max(1, Number(D.filter.perPage) || 1), ur = T(1);
  Le || (ur.current = Math.max(1, Math.ceil(tt / Pe)));
  const $r = ur.current, Qn = xe && F ? X.filter(
    (f) => f.media.id === F.media.id && f.key !== F.key
  ) : [], Hn = F != null && F.occurrence && F.occurrence.performer.id === D.performerFocus ? (Ie == null ? void 0 : Ie.flags) ?? [] : F != null && F.occurrence ? ((Mr = De == null ? void 0 : De.candidates.find((f) => f.id === F.occurrence.performer.id)) == null ? void 0 : Mr.flags) ?? [] : [], fr = (f) => {
    var q;
    return f.title || ((q = f.files[0]) == null ? void 0 : q.basename) || `${d === "audio" ? "Audio" : "Video"} ${f.id}`;
  }, hr = F ? qu(F.media, d) : "";
  return /* @__PURE__ */ c(
    "section",
    {
      className: `dq-review-workspace${d === "audio" ? " dq-audio" : ""}`,
      "aria-label": xe ? d === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : d === "audio" ? "Audio review" : "Video review",
      onClickCapture: (f) => {
        var J;
        const q = f.target instanceof Element ? f.target.closest("button") : null, L = (q == null ? void 0 : q.getAttribute("aria-label")) ?? ((J = q == null ? void 0 : q.textContent) == null ? void 0 : J.trim()) ?? "";
        q && !q.closest(ko) && /^(Filters|Edit filter:|Edit criteria)/.test(L) && (at.current = q);
      },
      children: [
        /* @__PURE__ */ r(
          xs,
          {
            name: e.name,
            description: e.description,
            entityType: Me(e),
            onBack: l == null ? void 0 : l.onBack,
            backDisabled: dr || !!(l != null && l.busy),
            onEdit: y ? () => {
              var f;
              return (f = j.current) == null ? void 0 : f.focus();
            } : In,
            editDisabled: !y && (dr || !i || !!(l != null && l.busy)),
            editing: !!y,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ c("fieldset", { className: "dq-review-toolbar", disabled: nt || Qe, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: d === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ r(
                  Ur,
                  {
                    filter: D.filter,
                    objectFilter: ee,
                    criteriaDefinitions: d === "audio" ? Lo : si,
                    customFieldEntityType: d,
                    totalCount: tt,
                    sortOptions: d === "audio" ? Pc : Do,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(
                      Ps,
                      {
                        page: Math.min(Math.max(1, G || 1), $r),
                        pages: $r,
                        onPage: (f) => Fe({
                          ...k.current,
                          filter: Pt(
                            { ...k.current.filter, page: f },
                            d
                          )
                        })
                      }
                    ),
                    onFilterChange: (f) => {
                      (f.sort !== k.current.filter.sort || f.direction !== k.current.filter.direction) && (f = { ...f, sorts: void 0 }), Fe({
                        ...k.current,
                        filter: Pt(f, d)
                      });
                    },
                    onObjectFilterChange: (f) => {
                      Fe({
                        ...k.current,
                        objectFilter: Ds(
                          f,
                          Ue,
                          k.current.objectFilter
                        ),
                        filter: { ...k.current.filter, page: 1 }
                      });
                    }
                  }
                )
              ] })
            ),
            trailing: /* @__PURE__ */ c(fe, { children: [
              xe && /* @__PURE__ */ r(
                lu,
                {
                  scope: xe,
                  disabled: nt || Qe,
                  editing: !!y,
                  onChange: vt,
                  onEditCriteria: () => Tn(!0)
                }
              ),
              Se(Z) && t && /* @__PURE__ */ r(
                tu,
                {
                  review: Z,
                  disabled: wt || !!y,
                  performerFlags: D.performerFocus ? Ie == null ? void 0 : Ie.flags : void 0,
                  trees: ge,
                  onOpen: () => {
                    ke.current = !0, Gt(!0);
                  },
                  onWrite: () => {
                    He.current = Date.now();
                  },
                  onClose: (f) => {
                    if (f) {
                      He.current = Date.now();
                      const q = k.current.performerFocus;
                      q ? Tr(q) : Rt(), A((L) => L + 1), new Promise((L) => window.setTimeout(L, 1100)).then(() => {
                        we(), Bt.current && (b.current || We(!0), B((L) => L + 1));
                      });
                    } else we();
                  }
                }
              ),
              (l == null ? void 0 : l.onGrid) && /* @__PURE__ */ r(
                Ls,
                {
                  mode: "single",
                  disabled: dr || !!l.busy,
                  onChange: () => {
                    var f;
                    return (f = l.onGrid) == null ? void 0 : f.call(l);
                  }
                }
              ),
              (l == null ? void 0 : l.moreItems) && /* @__PURE__ */ r(
                Ri,
                {
                  disabled: dr,
                  items: l.moreItems({
                    onSelect: In,
                    disabled: !i
                  })
                }
              )
            ] }),
            chipsStart: D.performerFocus ? /* @__PURE__ */ c("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ r(
                vr,
                {
                  performer: {
                    id: D.performerFocus,
                    name: (Ie == null ? void 0 : Ie.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ c("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ r("strong", { children: (Ie == null ? void 0 : Ie.name) ?? `performer ${D.performerFocus}` })
              ] }),
              Ie != null && Ie.flags.length ? /* @__PURE__ */ c(
                "span",
                {
                  className: "dq-focus-flag",
                  title: `Flagged: ${Ie.flags.join(", ")}`,
                  children: [
                    /* @__PURE__ */ r(ca, { "aria-hidden": "true" }),
                    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
                      "Flagged: ",
                      Ie.flags.join(", ")
                    ] })
                  ]
                }
              ) : null,
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: wt,
                  onClick: Rr,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            chipsEnd: y ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : Ze ? /* @__PURE__ */ c(fe, { children: [
              /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Queue differs from the saved review" }),
              Ft && /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: "dq-text-button",
                  title: "Save the current queue criteria to this review",
                  disabled: wt || !i,
                  onClick: () => void yt(),
                  children: [
                    /* @__PURE__ */ r(Qo, { "aria-hidden": "true" }),
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
                  disabled: wt,
                  onClick: () => {
                    const f = sr(e);
                    Fe(f, f.startFrom === "end");
                  },
                  children: [
                    /* @__PURE__ */ r(Ho, { "aria-hidden": "true" }),
                    "Reset"
                  ]
                }
              )
            ] }) : void 0
          }
        ),
        l == null ? void 0 : l.notices,
        /* @__PURE__ */ c("div", { className: "dq-review-area", children: [
          y && Nn && /* @__PURE__ */ r(
            Fs,
            {
              drawerRef: j,
              draft: Nn,
              onChange: (f) => E(f),
              direction: D.startFrom,
              onDirectionChange: (f) => Fe({ ...k.current, startFrom: f }),
              tagGroups: Nu,
              trees: ge,
              saving: nt,
              saveDisabled: Le,
              error: v,
              dirty: zn,
              criteriaChanged: Ft,
              notices: Wn && /* @__PURE__ */ r("div", { className: "dq-review-feedback", children: Wn }),
              onSave: () => void ht(),
              onCancel: Ar
            }
          ),
          /* @__PURE__ */ r("div", { className: "dq-review-main", children: /* @__PURE__ */ c("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ c("div", { className: "dq-review-stage", children: [
              F ? /* @__PURE__ */ c(fe, { children: [
                /* @__PURE__ */ c("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ r("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ c(
                    "a",
                    {
                      href: `/${d}/${F.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${h.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ r("span", { children: fr(F.media) }),
                        /* @__PURE__ */ r(Yo, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  hr && /* @__PURE__ */ r("span", { className: "dq-stage-meta", children: hr })
                ] }),
                /* @__PURE__ */ c("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ r("div", { className: "dq-player-frame", children: [F, mt].filter(Boolean).map((f) => {
                    var J, ie, le, Je, It;
                    const q = f, L = q.key === F.key;
                    return /* @__PURE__ */ r(
                      "div",
                      {
                        className: L ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": L ? void 0 : !0,
                        inert: L ? void 0 : !0,
                        children: d === "audio" ? /* @__PURE__ */ r(
                          Lc,
                          {
                            streamUrl: Qa("audio", q.media.id),
                            format: ((J = q.media.files[0]) == null ? void 0 : J.format) ?? "",
                            title: w(q.media),
                            coverUrl: L ? Wa("audio", q.media) : void 0,
                            duration: ((ie = q.media.files[0]) == null ? void 0 : ie.duration) ?? 0,
                            autostart: L && K === q.media.id
                          }
                        ) : /* @__PURE__ */ r(
                          _o,
                          {
                            videoId: q.media.id,
                            streamUrl: Qa("video", q.media.id),
                            posterUrl: L ? Wa("video", q.media) : void 0,
                            duration: ((le = q.media.files[0]) == null ? void 0 : le.duration) ?? 0,
                            format: (Je = q.media.files[0]) == null ? void 0 : Je.format,
                            audioCodec: (It = q.media.files[0]) == null ? void 0 : It.audioCodec,
                            extensionSurface: L ? "quick-view" : void 0,
                            autostart: L && K === q.media.id,
                            keyboardShortcutsEnabled: L,
                            showAbLoop: L,
                            clip: q.media.parentVideoId != null ? {
                              start: q.media.clipStartSec ?? 0,
                              end: q.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${q.media.id}:${ve}`
                    );
                  }) }),
                  d === "audio" && /* @__PURE__ */ r(
                    ru,
                    {
                      details: F.media.details,
                      label: h.one
                    },
                    F.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ r("p", { role: "status", className: "dq-stage-status", children: Le ? "Loading review…" : tt ? "Reached the end in this direction." : `No matching ${h.many}.` }),
              Ye.actions.length > 0 ? /* @__PURE__ */ r(
                Xl,
                {
                  actions: Ye.actions,
                  mediaKind: d,
                  isDisabled: (f) => Qe || Dt(f),
                  busy: un,
                  tags: Ae,
                  trees: ge,
                  preview: Ir,
                  onApply: (f, q) => void zt(f, q),
                  onFind: () => tn(!0),
                  findDisabled: Qe || !!y,
                  paused: !!y
                }
              ) : Se(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ c(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || nt || Qe || !Ae || !!y || !F,
                  children: [
                    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((f) => /* @__PURE__ */ c("label", { children: [
                      /* @__PURE__ */ r(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: At.includes(f),
                          onChange: (q) => ae(
                            e.occurrence.multiple ? q.target.checked ? [...At, f] : At.filter((L) => L !== f) : [f]
                          )
                        }
                      ),
                      ft[f] ?? "Loading tag…"
                    ] }, f)),
                    /* @__PURE__ */ c("div", { className: "dq-row", children: [
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => ae([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void zt(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void zt(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ c("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ c("div", { className: "dq-panel-body", ref: Or, children: [
                F && /* @__PURE__ */ c(fe, { children: [
                  /* @__PURE__ */ c("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ c("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: F.occurrence ? F.occurrence.performer.name : `this ${h.one}` })
                    ] }),
                    /* @__PURE__ */ c("div", { className: "dq-reviewing-who", children: [
                      F.occurrence && /* @__PURE__ */ r(vr, { performer: F.occurrence.performer }),
                      /* @__PURE__ */ c("div", { children: [
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: F.occurrence ? F.occurrence.performer.name : `This ${h.one}` }),
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-note", children: xe ? `Tags apply to this performer in this ${h.queue}` : `Tags apply to the whole ${h.one}` })
                      ] })
                    ] }),
                    Hn.length > 0 && /* @__PURE__ */ c("p", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
                      /* @__PURE__ */ r(ca, { "aria-hidden": "true" }),
                      "Flagged: ",
                      Hn.join(", ")
                    ] })
                  ] }),
                  Qn.length > 0 && /* @__PURE__ */ c(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${h.queue}`,
                      children: [
                        /* @__PURE__ */ c("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          h.queue
                        ] }),
                        /* @__PURE__ */ r("div", { className: "dq-partners", children: Qn.map((f) => {
                          var q, L, J;
                          return /* @__PURE__ */ c(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (q = f.occurrence) == null ? void 0 : q.performer.name,
                              "aria-label": (L = f.occurrence) == null ? void 0 : L.performer.name,
                              "data-partner-key": f.key,
                              disabled: wt,
                              onClick: () => {
                                dn.current = F.key, Rn(f), je("");
                              },
                              children: [
                                f.occurrence && /* @__PURE__ */ r(vr, { performer: f.occurrence.performer }),
                                /* @__PURE__ */ r("span", { children: (J = f.occurrence) == null ? void 0 : J.performer.name })
                              ]
                            },
                            f.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ r(
                    Eu,
                    {
                      tags: Ae,
                      preview: Ir,
                      showPreview: !Qe,
                      trees: ge,
                      actionTagIds: lr,
                      label: `Current ${xe ? "occurrence" : h.one} tags`
                    }
                  ),
                  Qe && /* @__PURE__ */ c(
                    "fieldset",
                    {
                      ref: Vt,
                      disabled: nt,
                      className: "dq-panel-section dq-tag-editor",
                      children: [
                        /* @__PURE__ */ c("legend", { className: "dq-eyebrow", children: [
                          "Edit ",
                          xe ? "occurrence" : h.one,
                          " tags"
                        ] }),
                        /* @__PURE__ */ r(
                          Cn,
                          {
                            entityType: "tag",
                            values: Nt,
                            onChange: Bn,
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
                              disabled: !Ae,
                              onClick: () => void zt(void 0, !0, !0),
                              children: "Save"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              disabled: !Ae,
                              onClick: () => void zt(void 0, !1, !0),
                              children: "Save & next"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              onClick: () => {
                                en(!1), requestAnimationFrame(() => {
                                  var f;
                                  return (f = kt.current) == null ? void 0 : f.focus();
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
                Se(Xe) && D.performerFocus && /* @__PURE__ */ r(
                  Qd,
                  {
                    review: Xe,
                    performerId: D.performerFocus,
                    revision: S
                  }
                )
              ] }),
              /* @__PURE__ */ c("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ c("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !y && Wn,
                  gn && /* @__PURE__ */ r("p", { role: "status", children: gn })
                ] }),
                !t && /* @__PURE__ */ r("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                F && /* @__PURE__ */ c("div", { className: "dq-panel-actions", "aria-busy": un || void 0, children: [
                  /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      ref: kt,
                      className: "dq-button",
                      disabled: wt || !!y || !t || !Ae,
                      onClick: () => {
                        st.current = [...Ae.ids], Bn([...Ae.ids]), en(!0);
                      },
                      children: [
                        /* @__PURE__ */ r(Jo, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: wt || !!y,
                      onClick: () => void zt(),
                      children: [
                        /* @__PURE__ */ r(Hc, { "aria-hidden": "true" }),
                        "Skip",
                        xe ? " performer" : ` ${h.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              xe && /* @__PURE__ */ c(
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
                        "aria-pressed": qt === "items",
                        onClick: () => it("items"),
                        children: d === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": qt === "performers",
                        onClick: () => it("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              xe && qt === "performers" ? /* @__PURE__ */ r(
                au,
                {
                  ranking: (De == null ? void 0 : De.signature) === lt ? De : null,
                  busy: an,
                  error: (Jt == null ? void 0 : Jt.signature) === lt ? Jt.message : "",
                  focus: D.performerFocus,
                  disabled: wt,
                  labels: h,
                  onFocus: ln,
                  onMore: () => {
                    const f = ct.current;
                    f && Wt(f, f.limit + _a);
                  },
                  onRefresh: () => {
                    St(null), Wt(null, _a);
                  }
                }
              ) : /* @__PURE__ */ r("div", { className: "dq-queue-list", ref: On, children: X.map((f) => {
                var L;
                const q = (F == null ? void 0 : F.key) === f.key;
                return /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: m(f),
                    "aria-label": m(f),
                    "aria-current": q ? "true" : void 0,
                    disabled: wt,
                    onClick: () => {
                      Rn(f), je(""), Ge("");
                    },
                    children: [
                      /* @__PURE__ */ r(Su, { media: f.media, kind: d }),
                      /* @__PURE__ */ c("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: w(f.media) }),
                        /* @__PURE__ */ c("span", { className: "dq-queue-row-meta", children: [
                          f.occurrence && /* @__PURE__ */ c(fe, { children: [
                            /* @__PURE__ */ r(vr, { performer: f.occurrence.performer }),
                            /* @__PURE__ */ r("span", { className: "dq-queue-row-performer", children: f.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ r("span", { className: "dq-queue-row-detail", children: [
                            f.media.date,
                            f.occurrence ? "" : (L = f.media.files[0]) != null && L.duration ? jo(f.media.files[0].duration) : ""
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
        xe && /* @__PURE__ */ r(
          Dc,
          {
            open: gt,
            onClose: () => Tn(!1),
            criteria: oi,
            activeFilter: xe.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (f) => {
              Tn(!1), vt({ performerFilter: f });
            }
          }
        ),
        Lt && /* @__PURE__ */ r(
          ki,
          {
            actions: e.actions,
            trees: ge,
            isDisabled: (f) => Dt(f),
            onApply: (f, q) => {
              tn(!1), zt(f, q);
            },
            onClose: () => tn(!1)
          }
        )
      ]
    }
  );
}
const tc = "data-quality.reviews-sort.v1", ku = { sort: "name", direction: "asc" };
function Au() {
  try {
    const e = JSON.parse(localStorage.getItem(tc) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return ku;
}
function Tu(e) {
  try {
    localStorage.setItem(
      tc,
      JSON.stringify({ sort: e.sort, direction: e.direction })
    );
  } catch {
  }
}
function nc(e, t, n, a) {
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
function ja(e, t) {
  const n = Me(e), a = mn(mi(n)), i = n === "tag" ? "tag" : Se(e) ? a.queue : a.one;
  return t === 1 ? i : `${i}s`;
}
function Ru({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ c(fe, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      ja(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ c(fe, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
      "Matching ",
      ja(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ c(fe, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      ja(e, t)
    ] })
  ] });
}
function Iu({
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
  onOpen: w,
  onNew: m,
  onImport: N,
  onExportAll: b,
  rowMenuItems: y
}) {
  const E = T(null), v = ye(
    () => nc(e, t, n, a),
    [e, t, n, a]
  ), M = e.every((I) => t[I.id] !== void 0), j = a === "asc" ? "ascending" : "descending";
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
              return (I = E.current) == null ? void 0 : I.click();
            },
            children: [
              /* @__PURE__ */ r(Yc, { "aria-hidden": "true" }),
              "Import"
            ]
          }
        ),
        /* @__PURE__ */ r(
          "input",
          {
            ref: E,
            type: "file",
            accept: "application/json,.json",
            hidden: !0,
            tabIndex: -1,
            onChange: (I) => {
              var U;
              const P = (U = I.target.files) == null ? void 0 : U[0];
              I.target.value = "", P && N(P);
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
              /* @__PURE__ */ r(Xo, { "aria-hidden": "true" }),
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
              /* @__PURE__ */ r(li, { "aria-hidden": "true" }),
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
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: M ? e.some((I) => t[I.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
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
              "aria-label": `Sort direction: ${j}`,
              title: `Sort direction: ${j}`,
              onClick: () => o(a === "asc" ? "desc" : "asc"),
              children: a === "asc" ? /* @__PURE__ */ r(Xc, { "aria-hidden": "true" }) : /* @__PURE__ */ r(Zc, { "aria-hidden": "true" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ c("table", { className: "dq-reviews-table", children: [
        /* @__PURE__ */ r("thead", { children: /* @__PURE__ */ c("tr", { children: [
          /* @__PURE__ */ r("th", { scope: "col", "aria-sort": n === "name" ? j : void 0, children: "Review" }),
          /* @__PURE__ */ r("th", { scope: "col", className: "dq-reviews-type", children: "Type" }),
          /* @__PURE__ */ r(
            "th",
            {
              scope: "col",
              className: "dq-reviews-count",
              "aria-sort": n === "count" ? j : void 0,
              children: "Matching"
            }
          ),
          /* @__PURE__ */ r("th", { scope: "col", className: "dq-reviews-actions", children: /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Actions" }) })
        ] }) }),
        /* @__PURE__ */ r("tbody", { children: v.map((I) => {
          const P = Me(I);
          return /* @__PURE__ */ c("tr", { children: [
            /* @__PURE__ */ r("td", { children: /* @__PURE__ */ c(
              "a",
              {
                className: "dq-reviews-link",
                href: `?review=${encodeURIComponent(I.id)}`,
                "data-review-id": I.id,
                onClick: (U) => {
                  U.button !== 0 || U.metaKey || U.ctrlKey || U.shiftKey || U.altKey || (U.preventDefault(), w(I.id));
                },
                children: [
                  /* @__PURE__ */ r("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ r(Os, { entityType: P }) }),
                  /* @__PURE__ */ c("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ r("span", { className: "dq-reviews-name", children: I.name }),
                    I.description && /* @__PURE__ */ r("span", { className: "dq-reviews-description", title: I.description, children: I.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-type", children: Is[P] }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-count", children: /* @__PURE__ */ r(Ru, { review: I, count: t[I.id] }) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ r(Ri, { label: `Actions for ${I.name}`, items: y(I) }) })
          ] }, I.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ c("div", { className: "dq-empty", children: [
      /* @__PURE__ */ r(ga, { "aria-hidden": "true" }),
      /* @__PURE__ */ r("p", { children: "No reviews yet." }),
      /* @__PURE__ */ r("p", { children: l ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function rc(e, { id: t, name: n, description: a }) {
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
function Ou({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: a
}) {
  const { review: i, saving: o, error: s } = e, l = T(null), d = T(null), h = T(o);
  h.current = o;
  const p = T(null), w = Ct();
  W(() => {
    var b;
    return p.current ?? (p.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), l.current && !l.current.open && l.current.showModal(), (b = d.current) == null || b.focus(), () => {
      var y;
      (y = p.current) != null && y.isConnected && p.current.focus({ preventScroll: !0 });
    };
  }, []);
  const m = T(o);
  W(() => {
    var E, v;
    const b = document.activeElement, y = !b || b === document.body || !((E = l.current) != null && E.contains(b));
    s && (!i.name.trim() || m.current && !o && y) && ((v = d.current) == null || v.focus()), m.current = o;
  }, [s, o]);
  const N = () => {
    h.current || a();
  };
  return /* @__PURE__ */ r(
    "dialog",
    {
      ref: l,
      className: "dq-form-dialog",
      "aria-labelledby": w,
      "aria-modal": "true",
      onCancel: (b) => {
        b.preventDefault(), N();
      },
      onClose: () => {
        var b;
        h.current ? (b = l.current) == null || b.showModal() : a();
      },
      children: /* @__PURE__ */ c(
        "form",
        {
          onSubmit: (b) => {
            b.preventDefault(), h.current || n();
          },
          children: [
            /* @__PURE__ */ c("header", { className: "dq-form-dialog-header", children: [
              /* @__PURE__ */ r("h2", { id: w, children: "New review" }),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-icon-button",
                  "aria-label": "Close dialog",
                  title: "Close",
                  disabled: o,
                  onClick: N,
                  children: /* @__PURE__ */ r(Jr, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ c("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ r("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              s && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: s }),
              /* @__PURE__ */ c("fieldset", { className: "dq-form-dialog-fields", disabled: o, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ r(
                  Ms,
                  {
                    review: i,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (b) => {
                      b !== Me(i) && t(rc(b, i));
                    },
                    nameRef: d
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ c("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ r("button", { type: "button", className: "dq-text-button", onClick: () => Ti(i), children: "Export draft" }),
              /* @__PURE__ */ r("span", { className: "dq-form-dialog-space" }),
              /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: o, onClick: N, children: "Cancel" }),
              /* @__PURE__ */ r("button", { type: "submit", className: "dq-button primary", "aria-disabled": o || void 0, children: o ? "Creating…" : "Create & configure" })
            ] })
          ]
        }
      )
    }
  );
}
const $u = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function Mu(e, t, n, a) {
  return ec(
    {
      ...e,
      view: {
        ...e.view,
        filter: { ...n, page: 1 },
        objectFilter: t.view.objectFilter,
        searchMode: t.view.searchMode
      }
    },
    a
  );
}
function Ao(e, t) {
  return Me(t) === "video" && Hr(t.view.objectFilter, e.view.objectFilter).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function To(e, t) {
  return or(
    JSON.parse(_n(ir(e))),
    JSON.parse(_n(ir(t)))
  );
}
const Ua = 180;
function Ro(e) {
  return Me(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function Io(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Oo() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Ka(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  Na.forEach((i) => n.delete(i)), e ? n.set("review", e) : n.delete("review");
  const a = n.toString();
  Zs(`${window.location.pathname}${a ? `?${a}` : ""}`, { openingFromList: t });
}
function Fu(e) {
  return Pt({ ...e, page: 1 });
}
function ac(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function yr(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const xu = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(di, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ r(nl, { "aria-hidden": "true" }) }
], Pu = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(di, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ r(tl, { "aria-hidden": "true" }) }
], $o = [], ic = "(min-width: 900px)";
function Lu(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(ic);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function Du() {
  return typeof window.matchMedia == "function" && window.matchMedia(ic).matches;
}
function _u({
  onNavigate: e
}) {
  const [t, n] = C([]), [a] = C(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [i, o] = C(""), [s, l] = C(!0), [d, h] = C(""), [p, w] = C(!1), [m, N] = C(!1), [b, y] = C(!1), [E, v] = C(!1), [M, j] = C([]), [I, P] = C(""), [U, ce] = C(!0), [se, O] = C("account"), [D, H] = C(""), [k, $] = C(""), [B, re] = C(!1), [X, de] = C(!1), [F, z] = C(""), [V, K] = C(Oo), te = T(V);
  te.current = V;
  const [ve, Ne] = C({}), mt = T(ve);
  mt.current = ve;
  const tt = T(t);
  tt.current = t;
  const ut = T(s);
  ut.current = s;
  const Le = T(!1), We = T(!0);
  W(() => (We.current = !0, () => {
    We.current = !1;
  }), []);
  const [nt, Gt] = C(!V);
  nt !== !V && (Gt(!V), V || Ne({}));
  const [ke, Bt] = C(Au), { sort: pe, direction: rt } = ke, je = (u) => {
    const g = { ...ke, ...u };
    Bt(g), Tu(g);
  }, gn = T(null), Ge = T(null), [Ae, Ee] = C(null), [Qe, en] = C(!1), [Nt, Bn] = C(!1), [st, kt] = C(null), [at, Vt] = C(null), gt = !!st || !!at, Tn = T(gt);
  Tn.current = gt;
  const Lt = Qe || !!at || Nt, [tn, At] = C(0), [ae, ft] = C(null), bn = T(null), Mt = T(null), He = T(null), [Ue, bt] = C(
    null
  ), ee = t.find((u) => u.id === V) ?? null, x = ye(
    () => (Ue == null ? void 0 : Ue.id) === V && ee ? { ...ee, view: {
      ...ee.view,
      filter: Ue.view.filter,
      objectFilter: Ue.view.objectFilter,
      searchMode: Ue.view.searchMode,
      startFrom: Ue.view.startFrom
    } } : ee,
    [Ue, V, ee]
  ), be = x ? Me(x) : "video", Ye = mi(be), Xe = x ? Se(x) : !1, Z = be === "video" ? x : null, nn = Xe && !!(x != null && x.actions.some(Kn)), wn = !!Z || be === "audio" || nn, [qt, it] = C(null), De = (qt == null ? void 0 : qt.id) === (x == null ? void 0 : x.id) ? qt == null ? void 0 : qt.mode : (x == null ? void 0 : x.view.reviewMode) ?? "single", Be = Xe || be === "audio" || be === "video" && De === "single", [ct, rn] = C(0), St = T(-1), an = T(!1), yn = T(Be);
  yn.current = Be, W(() => {
    const u = () => {
      const g = yn.current;
      if (!g && dn.current) {
        an.current = !0;
        return;
      }
      St.current = -1, Ki(), g || rn((R) => R + 1);
    };
    return window.addEventListener("popstate", u), () => window.removeEventListener("popstate", u);
  }, []);
  const Jt = Ye === "audio" ? m : p, Vn = be === "tag" ? "Tag" : Ye === "audio" ? "Audio" : "Video", Ve = be === "tag" ? b : Jt, lt = T(
    null
  ), S = pu(Z), [A, ne] = C({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Ce, qe] = C({
    page: 1,
    perPage: 40
  }), [me, Ze] = C({ items: [], totalCount: 0 }), [Ft, wt] = C(V);
  Ft !== V && (wt(V), Ze({ items: [], totalCount: 0 }), de(!1));
  const [G, Fe] = C(!1), [we, on] = C(""), [sn, Rn] = C(!1), [kr, zt] = C(!1), [Tt, Dt] = C(() => /* @__PURE__ */ new Set()), In = T(Tt);
  In.current = Tt;
  const cn = T(/* @__PURE__ */ new Map()), Ar = (x == null ? void 0 : x.view.selectAllOnLoad) === !0, [ht, yt] = C(null), xe = T(ht);
  xe.current = ht;
  const [vt, Wt] = C(!1), Rt = T(vt);
  Rt.current = vt;
  const Tr = T(null), [Jn, Ie] = C(!1), [ln, Rr] = C("grid"), [vn, Ir] = C(Ua), [ge, lr] = C(!1), [On, Or] = C(!1), dn = T(!1), [dr, Nn] = C(""), [zn, Qt] = C(""), [Wn, un] = C(""), [Pe, ur] = C(null), [$r, Qn] = C(""), [Hn, fr] = C(!1), [hr, Mr] = C({}), f = T(/* @__PURE__ */ new Map()), q = T(null), L = T(null), J = !!x, ie = xo(Lu, Du, () => !1) && J, [le, Je] = C({ top: 0, bottom: 0 });
  Zt(() => {
    if (!J) return;
    const u = () => {
      const R = L.current;
      if (!R) return;
      const _ = Math.round(R.getBoundingClientRect().top + window.scrollY), Y = R.closest("main"), Q = Y ? Math.round(parseFloat(getComputedStyle(Y).paddingBottom) || 0) : 0;
      Je(
        (ue) => ue.top === _ && ue.bottom === Q ? ue : { top: _, bottom: Q }
      );
    };
    u();
    const g = typeof ResizeObserver > "u" ? null : new ResizeObserver(u);
    return g == null || g.observe(document.body), window.addEventListener("resize", u), () => {
      g == null || g.disconnect(), window.removeEventListener("resize", u);
    };
  }, [J]);
  const [It, $n] = C(0), dt = T(null), _t = Sn((u) => {
    var R;
    if ((R = dt.current) == null || R.disconnect(), dt.current = null, !u || typeof ResizeObserver > "u") return;
    const g = new ResizeObserver(
      () => $n(Math.round(u.getBoundingClientRect().height))
    );
    g.observe(u), dt.current = g;
  }, []), _e = T(0), Mn = T(0), Te = T(null), Et = T(null), Yn = Ss(
    x && !Be ? ae ? [...x.actions, ...ae.draft.actions] : x.actions : $o
  ), fn = ye(
    () => ae && x && ee ? Mu(ae.draft, x, A, ee) : null,
    [ae, x, A, ee]
  ), Fn = ye(
    () => x && ee ? ec(
      { ...ee, view: { ...x.view, filter: { ...A, page: 1 } } },
      ee
    ) : null,
    [x, ee, A]
  ), pr = ye(
    () => ee ? Nr(ir(ee)) : "",
    [ee]
  ), mr = ye(
    () => Fn != null && Nr(ir(Fn)) !== pr,
    [Fn, pr]
  ), Fr = ye(
    () => fn != null && Nr(ir(fn)) !== pr,
    [fn, pr]
  );
  W(() => {
    if (!zn) return;
    const u = window.setTimeout(() => Qt(""), 4e3);
    return () => window.clearTimeout(u);
  }, [zn]), W(() => {
    if (!Ae || Ae.alert) return;
    const u = window.setTimeout(() => Ee(null), 6e3);
    return () => window.clearTimeout(u);
  }, [Ae]), W(() => {
    const u = Z ? $i(Z.view.objectFilter) : [];
    if (Mr({}), !u.length) return;
    const g = new AbortController();
    let R = !0;
    return Promise.all(
      u.map(async (_) => {
        var Y;
        try {
          const Q = await oe(`/api/tags/${_}`, {
            signal: g.signal
          });
          return (Y = Q.name) != null && Y.trim() ? [String(_), Q.name] : null;
        } catch {
          return null;
        }
      })
    ).then((_) => {
      R && Mr(
        Object.fromEntries(_.filter((Y) => Y !== null))
      );
    }), () => {
      R = !1, g.abort();
    };
  }, [Z == null ? void 0 : Z.id, Z == null ? void 0 : Z.view.objectFilter]);
  const Ot = ye(
    () => Z ? Mi(
      Z.view.objectFilter,
      hr
    ) : (x == null ? void 0 : x.view.objectFilter) ?? {},
    [hr, x, Z]
  ), xr = Sn(async () => {
    l(!0), h("");
    try {
      const u = await vl();
      n(u.reviews), o(u.storageKey), w(u.canWriteVideos ?? u.canWrite), N(u.canWriteAudios ?? !1), y(u.canWriteTags ?? !1), v(u.canReadTagGroups ?? !1), ce(u.canConfigure ?? !0), O(u.storage ?? "account"), H(u.storageNotice ?? ""), V && !u.reviews.some((g) => g.id === V) && (K(""), Ka(""));
    } catch (u) {
      h(
        u instanceof Error ? u.message : "Could not load reviews."
      );
    } finally {
      l(!1);
    }
  }, [V]);
  W(() => {
    if (!E) {
      j([]), P("");
      return;
    }
    const u = new AbortController();
    return P(""), Ol(u.signal).then(j).catch((g) => {
      u.signal.aborted || P(
        g instanceof Error ? g.message : "Could not load tag groups."
      );
    }), () => u.abort();
  }, [E]), W(() => {
    xr();
  }, []), W(() => {
    if (V || t.length === 0) return;
    const u = new AbortController();
    for (const g of t) {
      if (typeof mt.current[g.id] == "number") continue;
      (Se(g) ? Fi(g, u.signal).then((_) => (_ == null ? void 0 : _.length) === 0 ? { items: [], totalCount: 0 } : _r(xi(g, _), { ...g.view.filter, page: 1, perPage: 1 }, u.signal)) : Me(g) === "tag" ? no(
        g,
        Pt({ ...g.view.filter, page: 1, perPage: 1 }),
        u.signal
      ) : _r(
        g,
        Pt({ ...g.view.filter, page: 1, perPage: 1 }),
        u.signal
      )).then((_) => {
        u.signal.aborted || Ne((Y) => ({
          ...Y,
          [g.id]: _.totalCount
        }));
      }).catch(() => {
        u.signal.aborted || Ne((_) => ({ ..._, [g.id]: null }));
      });
    }
    return () => u.abort();
  }, [V, t]), Zt(() => {
    var R, _;
    const u = Ge.current;
    if (V || s || !u) return;
    Ge.current = null, (_ = (u === "heading" ? null : [...((R = L.current) == null ? void 0 : R.querySelectorAll("[data-review-id]")) ?? []].find(
      (Y) => Y.dataset.reviewId === u.reviewId
    )) ?? gn.current) == null || _.focus();
  }, [V, s, at, t]);
  const qa = T(0), Yr = Sn(async () => {
    const u = ++qa.current;
    ur(null), Qn("");
    try {
      const g = await (nn ? fs(Ye) : us(Ye));
      u === qa.current && ur(g);
    } catch (g) {
      if (u !== qa.current) return;
      ur(null), Qn(
        "Tag assessment setup could not be checked. " + (g instanceof Error ? g.message : "Request failed.")
      );
    }
  }, [nn, Ye]);
  W(() => {
    Yr();
  }, [Yr]);
  const Xn = Sn(
    async (u, g, R = !1, _ = !1) => {
      var $t, $e;
      const Y = ++_e.current;
      ($t = Te.current) == null || $t.abort();
      const Q = new AbortController();
      Te.current = Q, g = Pt(g);
      const ue = Number(g.page);
      R && (g = { ...g, page: 1 }), ne(g), zt(R), Fe(!0), on("");
      try {
        const Ke = (qn) => Me(u) === "tag" ? no(
          u,
          qn,
          Q.signal
        ) : _r(
          u,
          qn,
          Q.signal
        );
        let he = await Ke(g);
        const et = Math.max(
          1,
          Math.ceil(he.totalCount / Number(g.perPage))
        ), gr = R ? et : Math.min(ue, et);
        return Number(g.page) !== gr && (g = { ...g, page: gr }, he = await Ke(g)), Y === _e.current && ((($e = Et.current) == null ? void 0 : $e.page) !== gr && (Et.current = {
          page: gr,
          ids: new Set(he.items.map((qn) => qn.id))
        }), Ze(he), _ && hn(
          () => new Set(he.items.map((qn) => qn.id))
        ), ne(g), qe(g)), he;
      } catch (Ke) {
        throw Y === _e.current && on(
          Ke instanceof Error ? Ke.message : "Could not load the review queue."
        ), Ke;
      } finally {
        Y === _e.current && Fe(!1);
      }
    },
    []
  );
  W(() => {
    var g;
    if (Mn.current += 1, St.current = -1, _e.current += 1, (g = Te.current) == null || g.abort(), ft(null), bn.current = null, de(!1), z(""), $(""), re(!1), Dt(/* @__PURE__ */ new Set()), cn.current.clear(), yt(null), Wt(!1), lr(!1), dn.current = !1, Nn(""), Qt(""), un(""), Ze({ items: [], totalCount: 0 }), Et.current = null, Rn(!1), !x || Be) {
      Fe(!1), bt(null);
      return;
    }
    let u = !0;
    return Fe(!0), (async () => {
      let R = ee ?? x;
      bt(null);
      let _ = null;
      const Y = new URLSearchParams(window.location.search);
      if (Me(x) === "video" && Na.some(($e) => Y.has($e)))
        try {
          const $e = R;
          _ = ai($e, Y);
          const Ke = pn($e, _.query);
          (_.query.startFrom !== ($e.view.startFrom ?? "end") || !or(
            JSON.parse(_n(Ke)),
            JSON.parse(_n(pn($e, sr($e))))
          )) && (R = Ke, bt(R));
        } catch ($e) {
          Rn(!0), on($e instanceof Error ? $e.message : "Could not read review URL."), Fe(!1);
          return;
        }
      let Q = null;
      try {
        Q = await Sl(i, x.id);
      } catch ($e) {
        u && (re(!0), $(
          $e instanceof Error ? $e.message : "Could not load progress."
        ));
      }
      if (!u) return;
      const ue = (Q == null ? void 0 : Q.signature) === _n(R) ? Q : null, $t = _ ? _.query.filter : ue ? Pt(ue.filter) : Fu(R.view.filter);
      ne($t), Rr(
        ue ? Io(ue.displayMode, Me(x)) : Ro(x)
      ), Ir(
        ue ? ue.cardSize ?? Ua : Ua
      );
      try {
        const $e = await Xn(
          R,
          $t,
          _ ? _.startAtEnd : !ue && R.view.startFrom !== "beginning",
          R.view.selectAllOnLoad === !0
        );
        if (!u) return;
        const Ke = Xi(
          $e.items.map((he) => he.id),
          (ue == null ? void 0 : ue.focusedId) ?? null,
          (ue == null ? void 0 : ue.index) ?? 0
        );
        yt(Ke), pt(Ke);
      } catch {
      }
      u && (St.current = ct, de(!0), z(`${x.id}:${ct}`));
    })(), () => {
      var R;
      u = !1, Mn.current++, _e.current++, (R = Te.current) == null || R.abort();
    };
  }, [x == null ? void 0 : x.id, Be, ct]), W(() => {
    if (!(!tn || Be || !x)) {
      if (sn) {
        At(0);
        return;
      }
      ge || ae || F !== `${x.id}:${ct}` || (At(0), Oa());
    }
  }, [tn, Be, x == null ? void 0 : x.id, F, ge, ct, sn]), W(() => {
    !Z || Be || !X || G || we || ge || an.current || St.current !== ct || jr(Z.id, {
      filter: A,
      objectFilter: Z.view.objectFilter,
      searchMode: Z.view.searchMode,
      startFrom: Z.view.startFrom ?? "end"
    });
  }, [Z, Be, X, G, we, A, ge, ct]);
  const Oe = ye(
    () => me.items.map((u) => u.id),
    [me.items]
  );
  W(() => {
    if (!X || !x || !i || G || we || ge || (Ue == null ? void 0 : Ue.id) === x.id || B || St.current !== ct)
      return;
    const u = {
      version: 1,
      signature: _n(x),
      filter: A,
      focusedId: ht,
      index: Math.max(0, Oe.indexOf(ht ?? -1)),
      displayMode: ln,
      cardSize: vn,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        i + ":progress:" + x.id,
        JSON.stringify(u)
      );
    } catch {
    }
    if (k) return;
    let g = !0;
    const R = window.setTimeout(() => {
      El(i, x.id, u).catch((_) => {
        g && $(
          "Progress is kept in this browser, but account sync failed. " + (_ instanceof Error ? _.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      g = !1, window.clearTimeout(R);
    };
  }, [
    X,
    i,
    x,
    G,
    we,
    ge,
    A,
    ht,
    Oe,
    ln,
    vn,
    Ue,
    k,
    B,
    ct
  ]);
  const oc = me.items.find((u) => u.id === ht) ?? null, Sa = be === "video" ? oc : null;
  vt && Sa && (Tr.current = Sa);
  const Zn = Sa ?? (vt ? Tr.current : null), sc = Zi(Tt, ht), cc = Oe.length > 0 && Oe.every((u) => Tt.has(u)), pt = Sn((u, g = !0) => {
    u != null && window.requestAnimationFrame(() => {
      var _;
      if (Tn.current || pl(document.activeElement) || (_ = document.activeElement) != null && _.closest(".dq-drawer"))
        return;
      const R = f.current.get(u);
      R == null || R.focus({ preventScroll: !0 }), g && (R == null || R.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  W(() => {
    X && !Rt.current && pt(xe.current);
  }, [X, pt]), W(() => {
    G || !Oe.length || (xe.current == null || !Oe.includes(xe.current)) && (yt(Oe[0]), Rt.current || pt(Oe[0]));
  }, [pt, Oe, G]);
  const hn = Sn(
    (u) => {
      Dt((g) => {
        const R = u(g);
        for (const _ of /* @__PURE__ */ new Set([...g, ...R]))
          g.has(_) !== R.has(_) && cn.current.set(
            _,
            (cn.current.get(_) ?? 0) + 1
          );
        return R;
      });
    },
    []
  ), Ea = Sn(
    (u) => {
      if (!Oe.length) return;
      const g = Math.max(
        0,
        Oe.indexOf(xe.current ?? Oe[0])
      ), R = Oe[Math.max(0, Math.min(Oe.length - 1, g + u))];
      yt(R), Rt.current || pt(R);
    },
    [pt, Oe]
  ), Xr = Sn(
    async (u) => {
      const g = "steps" in u ? u.steps.length > 0 : u.effect.mode !== "SKIP", R = "effect" in u && u.effect.mode === "SET_TAG_GROUP" ? u.effect.tagGroupId : null, _ = R != null && (!E || !M.some((ze) => ze.id === R)), Y = "effect" in u && g && !E, Q = Zi(
        In.current,
        xe.current
      );
      if (!x || dn.current || G || we) return;
      const ue = g && !Ve ? `${Vn} write permission is required to apply ${u.label}.` : Y || _ ? `${u.label} needs a tag group that is unavailable.` : Kn(u) && (Pe == null ? void 0 : Pe.kind) !== "ready" ? `Set up tag assessments before applying ${u.label}.` : Q.length ? "" : `Select or focus a ${be} before applying ${u.label}.`;
      if (ue) {
        un(ue);
        return;
      }
      const $t = ++Mn.current, $e = x.id, Ke = [...Oe], he = me, et = xe.current, gr = new Set(In.current), qn = new Map(
        Q.map((ze) => [ze, cn.current.get(ze) ?? 0])
      ), br = () => $t === Mn.current && x.id === $e;
      dn.current = !0, lr(!0), Nn(
        In.current.size ? `${Q.length} selected ${be}s` : `the focused ${be}`
      ), Qt(""), un("");
      const zi = he.items.filter(
        (ze) => !Q.includes(ze.id)
      ), kc = zi.map((ze) => ze.id), Wi = eo(
        Ke,
        kc,
        et,
        Q.includes(et ?? -1)
      );
      Ze({
        items: zi,
        totalCount: he.totalCount
      }), Dt((ze) => {
        const xt = new Set(ze);
        for (const Ht of Q) xt.delete(Ht);
        return xt;
      }), yt(Wi), Rt.current || pt(Wi);
      let $a = !1;
      try {
        if ("effect" in u ? await Ul(u, Q) : await ps(Ye, u, Q), $a = !0, !br()) return;
        Dt((ze) => {
          const xt = new Set(ze);
          for (const Ht of Q)
            (cn.current.get(Ht) ?? 0) === qn.get(Ht) && xt.delete(Ht);
          return xt;
        }), Qt(
          `${u.label}: ${Q.length} ${be}${Q.length === 1 ? "" : "s"} ${g ? "updated" : "skipped"}.`
        );
      } catch (ze) {
        if (!br()) return;
        Ze(he), Dt((xt) => {
          const Ht = new Set(xt);
          for (const jt of Q)
            gr.has(jt) && (cn.current.get(jt) ?? 0) === qn.get(jt) && Ht.add(jt);
          return Ht;
        }), yt(et), Rt.current || pt(et), un(
          ze instanceof Error ? ze.message : "Action failed."
        );
      }
      try {
        if (await Fl(u), !br()) return;
        const ze = new Set(Q), xt = Ar && Ke.length > 0 && Ke.every((Yt) => ze.has(Yt)), Ht = await Xn(x, A, !1, xt);
        if (!br()) return;
        let jt = Ht.items.map((Yt) => Yt.id);
        const ea = Et.current, Ac = (ea == null ? void 0 : ea.page) === Number(A.page) && jt.some((Yt) => ea.ids.has(Yt)), Tc = (x.view.startFrom ?? "end") !== "beginning";
        if (Ht.totalCount > 0 && Number(A.page) > 1 && (!jt.length || Tc && !Ac)) {
          const Yt = Math.max(1, Number(A.page) - 1), ta = { ...A, page: Yt };
          ne(ta), jt = (await Xn(
            x,
            ta,
            !1,
            xt
          )).items.map((Ma) => Ma.id), Dt(
            (Ma) => new Set([...Ma].filter((Rc) => jt.includes(Rc)))
          );
          const Hi = jt.at(-1) ?? null;
          yt(Hi), Rt.current || pt(Hi);
        } else {
          Dt(
            (ta) => new Set([...ta].filter((Qi) => jt.includes(Qi)))
          );
          const Yt = eo(
            Ke,
            jt,
            et,
            $a && Q.includes(et ?? -1)
          );
          yt(Yt), Rt.current && Yt == null && Wt(!1), Rt.current || pt(Yt);
        }
      } catch (ze) {
        br() && un(
          (xt) => `${xt ? `${xt} ` : ""}${$a ? "The action completed, but " : ""}the queue could not be refreshed. ${ze instanceof Error ? ze.message : "Refresh failed."}`
        );
      } finally {
        br() && (dn.current = !1, lr(!1), Nn(""), an.current && (an.current = !1, Ki(), rn((ze) => ze + 1)));
      }
    },
    [
      Ve,
      E,
      M,
      be,
      Pe,
      Xn,
      A,
      pt,
      Oe,
      me,
      G,
      we,
      x
    ]
  );
  function lc() {
    var R;
    if (ln === "list") return 1;
    const u = (R = q.current) == null ? void 0 : R.firstElementChild, g = u ? getComputedStyle(u).gridTemplateColumns : "";
    return Math.max(1, g.split(" ").filter(Boolean).length);
  }
  const Di = T(() => {
  });
  Di.current = (u) => {
    var Q;
    if (Be || u.defaultPrevented || u.repeat || u.ctrlKey || u.altKey || u.metaKey || gt) return;
    const g = u.target, R = g instanceof Node && ((Q = L.current) == null ? void 0 : Q.contains(g)) === !0, _ = g === document.body || g === document.documentElement;
    if (!R && !_) return;
    if (Jn) {
      u.key === "Escape" && (yr(u), Ie(!1));
      return;
    }
    if (vt && u.key === "Escape") {
      yr(u), Wt(!1), pt(xe.current);
      return;
    }
    if (!hl(g)) return;
    const Y = fl(g);
    if (u.key === "Escape") {
      yr(u), hn(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!vt && u.key === " " && Y) {
      yr(u), ht != null && hn((ue) => oa(ue, ht));
      return;
    }
    if (!(ge || G) && !vt && u.key === "Enter" && ht != null && Y) {
      if (be !== "tag" && ae) return;
      yr(u), be === "tag" ? window.open(`/tag/${ht}`, "_blank", "noopener,noreferrer") : Wt(!0);
      return;
    }
  }, W(() => {
    const u = (g) => Di.current(g);
    return document.addEventListener("keydown", u), () => document.removeEventListener("keydown", u);
  }, []);
  const _i = T(
    () => {
    }
  );
  _i.current = (u) => {
    var Q;
    if (Be || gt || vt || Jn || ge || G || !Oe.length || u.defaultPrevented || u.repeat || u.ctrlKey || u.altKey || u.metaKey)
      return;
    const g = u.target, R = g instanceof Node && ((Q = L.current) == null ? void 0 : Q.contains(g)) === !0, _ = g === document.body || g === document.documentElement;
    if (!R && !_ || !u.key.startsWith("Arrow") || !ml(g)) return;
    const Y = gl(u.key, lc());
    Y && (u.preventDefault(), R ? u.stopImmediatePropagation() : u.stopPropagation(), Ea(Y));
  }, W(() => {
    const u = (g) => _i.current(g);
    return document.addEventListener("keydown", u), () => document.removeEventListener("keydown", u);
  }, []);
  const xn = (ae == null ? void 0 : ae.saving) === !0 || On, Ca = ge || G && !X || xn, dc = Si();
  qi({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!x && !Be && !gt && !ae && !vt && !Jn && !we && (me.items.length > 0 || G || ge),
    actions: (x == null ? void 0 : x.actions) ?? $o,
    onAction: (u) => {
      const g = x == null ? void 0 : x.actions[u];
      g && Xr(g);
    },
    onFind: () => Ie(!0),
    onSelectAll: () => hn((u) => ul(u, Oe))
  }), W(() => Ie(!1), [Be, vt, x == null ? void 0 : x.id]);
  function ji(u) {
    const g = "steps" in u ? u.steps.length > 0 : u.effect.mode !== "SKIP", R = "effect" in u && u.effect.mode === "SET_TAG_GROUP" ? u.effect.tagGroupId : null, _ = R != null && !M.some((Y) => Y.id === R);
    return ge || G || !!we || g && !Ve || "effect" in u && g && (!E || _) || Kn(u) && (Pe == null ? void 0 : Pe.kind) !== "ready" || !sc.length;
  }
  function ka(u) {
    it(null), At(0), Ee(null), K(u), Ka(u, !!u && !x);
  }
  function Ui() {
    Le.current || (Xs() ? (Le.current = !0, window.history.back()) : ka(""));
  }
  function Ki() {
    const u = Le.current;
    Le.current = !1;
    let g = Oo();
    g && !ut.current && !tt.current.some((_) => _.id === g) && (g = "", Ka(""));
    const R = te.current;
    g !== R && (At(0), u || Ee(null), !g && R && (Ge.current ?? (Ge.current = { reviewId: R }))), K(g);
  }
  function Aa() {
    Ge.current = "heading", Ee(null), Ui();
  }
  function Ta(u) {
    u !== V && ka(u), At((g) => g + 1);
  }
  function uc() {
    Ee(null), kt({
      review: rc("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function fc(u) {
    if (Lt || !U) return;
    Ee(null);
    const g = dl(u, t, crypto.randomUUID()), R = V;
    Bn(!0);
    try {
      if (!await er([...t, g])) throw new Error("Could not save reviews.");
      if (!We.current) return;
      te.current !== R ? Ee({ text: `Saved the copy “${g.name}”.`, alert: !1 }) : Ta(g.id);
    } catch (_) {
      Ee({
        text: `“${u.name}” was not duplicated. ${Ra(_)}`,
        alert: !0
      });
    } finally {
      Bn(!1);
    }
  }
  async function hc() {
    if (!st || st.saving) return;
    const u = { ...st.review, name: st.review.name.trim() }, g = Br(u);
    if (g) {
      kt({ ...st, error: g });
      return;
    }
    kt({ ...st, saving: !0, error: "" });
    try {
      if (!await er([...t, u])) throw new Error("Could not save reviews.");
      if (!We.current) return;
      kt(null), Ta(u.id);
    } catch (R) {
      kt(
        (_) => _ && {
          ..._,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + (R instanceof Error ? R.message : "Retry saving.")
        }
      );
    }
  }
  async function pc() {
    if (!at || at.pending) return;
    const u = at.review, g = nc(t, ve, pe, rt).map((Y) => Y.id), R = g.filter((Y) => Y !== u.id), _ = R[Math.min(g.indexOf(u.id), R.length - 1)];
    Vt({ review: u, pending: !0 });
    try {
      if (!await er(t.filter((Y) => Y.id !== u.id)))
        throw new Error("Could not save reviews.");
      Ge.current = u.id !== V && _ ? { reviewId: _ } : "heading", Ee({ text: `Deleted “${u.name}”.`, alert: !1 });
    } catch (Y) {
      Ee({ text: `“${u.name}” was not deleted. ${Ra(Y)}`, alert: !0 });
    } finally {
      Vt(null);
    }
  }
  async function mc(u) {
    if (!(Lt || !U)) {
      Ee(null), en(!0);
      try {
        const g = await Td(u), R = Ba(t, g), _ = R.length - t.length, Y = g.length - _;
        if (_ && !await er(R)) throw new Error("Could not save reviews.");
        Ee({
          alert: !1,
          text: g.length ? _ ? `Imported ${_ === 1 ? "1 review" : `${_} reviews`}.` + (Y === 1 ? " 1 review already in the list stays as it is." : Y ? ` ${Y} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (g) {
        Ee({ alert: !0, text: `Could not import “${u.name}”. ${Ra(g)}` });
      } finally {
        en(!1);
      }
    }
  }
  function Ra(u) {
    return u instanceof rs ? "Reviews changed in another browser. Reload the page to get them, then try again." : u instanceof Error ? u.message : "Try again.";
  }
  function Gi(u) {
    const g = !U || Lt;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ r(Ko, { "aria-hidden": "true" }),
        disabled: g,
        onSelect: () => void fc(u)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ r(Xo, { "aria-hidden": "true" }),
        onSelect: () => Ti(u)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ r(Go, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: g,
        onSelect: () => {
          Ee(null), Vt({ review: u, pending: !1 });
        }
      }
    ];
  }
  function Bi(u, g) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ r(qr, { "aria-hidden": "true" }),
        ...g,
        disabled: g.disabled || Nt
      },
      ...Gi(u),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ r(zr, { "aria-hidden": "true" }),
        separated: !0,
        disabled: Nt,
        onSelect: Aa
      }
    ];
  }
  async function er(u) {
    if (!i) return !1;
    const g = u.map(Uu);
    try {
      await ql(i, g);
    } catch (_) {
      throw _;
    }
    n(g), V && !g.some((_) => _.id === V) && Ui();
    const R = g.find((_) => _.id === V);
    return R && ee && ((R.view.reviewMode ?? "single") !== (ee.view.reviewMode ?? "single") && it(null), R.view.displayMode !== ee.view.displayMode && Rr(Ro(R))), !0;
  }
  if (s)
    return /* @__PURE__ */ r(Mo, { label: "Loading reviews…" });
  if (d)
    return /* @__PURE__ */ c(fe, { children: [
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          onClick: () => void Ju().catch(
            (u) => h(
              "Could not export browser reviews. " + (u instanceof Error ? u.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ r(
        Fo,
        {
          message: d,
          onRetry: () => void xr()
        }
      )
    ] });
  const Ia = /* @__PURE__ */ c(fe, { children: [
    D && /* @__PURE__ */ r("p", { className: "dq-status", children: D }),
    wn && (Pe == null ? void 0 : Pe.kind) === "missing" && /* @__PURE__ */ c("div", { role: "status", className: "dq-status", children: [
      Pe.message,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: Hn,
          onClick: () => {
            fr(!0), Qn(""), (nn ? Ll(Ye) : Pl(Ye)).then(Yr).catch(
              (u) => Qn(
                `Could not create the ${nn ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (u instanceof Error ? u.message : "Request failed.")
              )
            ).finally(() => fr(!1));
          },
          children: Hn ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    wn && ((Pe == null ? void 0 : Pe.kind) === "incompatible" || $r) && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(Dn, {}),
      $r || (Pe == null ? void 0 : Pe.message),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: Hn,
          onClick: () => {
            fr(!0), Yr().finally(
              () => fr(!1)
            );
          },
          children: Hn ? "Checking…" : "Check again"
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
            const u = localStorage.getItem("page-videos") ?? "[]", g = URL.createObjectURL(
              new Blob([u], { type: "application/json" })
            ), R = document.createElement("a");
            R.href = g, R.download = "data-quality-unassigned-legacy-reviews.json", R.click(), URL.revokeObjectURL(g);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    k && /* @__PURE__ */ c("p", { role: "alert", children: [
      k,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: () => {
            $(""), re(!1);
          },
          children: B ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    Ae && (Ae.alert ? /* @__PURE__ */ c("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(Dn, { "aria-hidden": "true" }),
      Ae.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ r("p", { className: "dq-status", "aria-hidden": "true", children: Ae.text })
    ))
  ] });
  return /* @__PURE__ */ c(
    "div",
    {
      ref: L,
      className: `data-quality-page${J ? " dq-page-fit" : ""}`,
      style: J ? {
        "--dq-fit-top": `${le.top}px`,
        "--dq-fit-bottom": `${le.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ r("p", { className: "dq-sr-only", "aria-live": "polite", children: Ae && !Ae.alert ? Ae.text : "" }),
        x && Be ? /* @__PURE__ */ r(
          Cu,
          {
            review: ee ?? x,
            canWrite: Xe ? b : Jt,
            canAssess: (Pe == null ? void 0 : Pe.kind) === "ready" && Jt,
            onBusy: lr,
            editRequest: tn,
            onEditRequestHandled: () => At(0),
            onSaveDefaults: U ? (u) => er(t.map((g) => g.id === u.id ? u : g)) : void 0,
            pageControls: {
              onBack: Aa,
              moreItems: (u) => Bi(ee ?? x, u),
              onGrid: Z ? () => it({ id: Z.id, mode: "multiple" }) : void 0,
              notices: Ia,
              busy: Nt
            }
          },
          x.id
        ) : x ? Ec(x) : /* @__PURE__ */ r(
          Iu,
          {
            reviews: t,
            counts: ve,
            sort: pe,
            direction: rt,
            onSortChange: (u) => je({ sort: u }),
            onDirectionChange: (u) => je({ direction: u }),
            storage: $u[se],
            canConfigure: U,
            busy: Lt,
            headingRef: gn,
            notices: Ia,
            onOpen: ka,
            onNew: () => uc(),
            onImport: (u) => void mc(u),
            onExportAll: () => $s(t, "data-quality-reviews.json"),
            rowMenuItems: (u) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ r(qr, { "aria-hidden": "true" }),
                disabled: !U || Lt,
                onSelect: () => Ta(u.id)
              },
              ...Gi(u)
            ]
          }
        ),
        vt && Zn && Z && /* @__PURE__ */ r(
          Vu,
          {
            video: Zn,
            review: Z,
            selectedCount: Tt.size,
            pending: ge,
            refreshing: G || !!we,
            error: Wn,
            canWrite: p,
            assessmentReady: (Pe == null ? void 0 : Pe.kind) === "ready",
            trees: Yn,
            selected: Tt.has(Zn.id),
            hasPrevious: Oe.indexOf(Zn.id) > 0,
            hasNext: Oe.indexOf(Zn.id) >= 0 && Oe.indexOf(Zn.id) < Oe.length - 1,
            onToggleSelected: () => hn((u) => oa(u, Zn.id)),
            onPrevious: () => Ea(-1),
            onNext: () => Ea(1),
            onClose: () => {
              Wt(!1), pt(xe.current);
            },
            onAction: Xr,
            findOpen: Jn,
            onFindOpenChange: Ie
          }
        ),
        Jn && x && !Be && !vt && /* @__PURE__ */ r(
          ki,
          {
            actions: x.actions,
            tagGroups: M,
            trees: Yn,
            isDisabled: ji,
            canStay: !1,
            onApply: (u) => {
              Ie(!1), Xr(u);
            },
            onClose: () => Ie(!1)
          }
        ),
        st && /* @__PURE__ */ r(
          Ou,
          {
            draft: st,
            onChange: (u) => kt((g) => g && { ...g, review: u, error: "" }),
            onCreate: () => void hc(),
            onCancel: () => kt(null)
          }
        ),
        /* @__PURE__ */ r(
          jc,
          {
            open: !!at,
            title: "Delete review?",
            message: at ? `“${at.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (at == null ? void 0 : at.pending) ?? !1,
            onConfirm: () => void pc(),
            onCancel: () => Vt((u) => u != null && u.pending ? u : null)
          }
        )
      ]
    }
  );
  async function Zr(u, g, R = !1) {
    const _ = xe.current, Y = Math.max(0, Oe.indexOf(_ ?? -1));
    try {
      const Q = Xn(
        u,
        g,
        R,
        u.view.selectAllOnLoad === !0
      ), ue = _e.current, $t = await Q;
      if (ue !== _e.current) return;
      const $e = $t.items.map((he) => he.id);
      Dt(
        (he) => new Set([...he].filter((et) => $e.includes(et)))
      );
      const Ke = Xi($e, _, Y);
      yt(Ke), Rt.current || pt(Ke, !1);
    } catch {
    }
  }
  function gc(u) {
    const g = lt.current;
    if (lt.current = null, Ca || !x || !ee) return;
    const R = g ?? x.view.objectFilter, _ = or(
      R,
      ee.view.objectFilter
    ) ? ee.view.objectFilter : R, Y = Pt({ ...u, page: 1 }), Q = {
      ...x,
      view: {
        ...x.view,
        filter: Y,
        objectFilter: _
      }
    }, ue = !To(Q, ee), $t = ue ? Q : ee;
    bt(ue ? Q : null), Qt(ue ? "" : "Review queue defaults restored."), Zr($t, Y, !0);
  }
  function bc() {
    if (ge || G || xn || !ee) return;
    lt.current = null;
    const u = Pt({
      ...ee.view.filter,
      page: 1
    });
    bt(null), Qt("Review queue defaults restored."), Zr(
      ee,
      u,
      ee.view.startFrom !== "beginning"
    );
  }
  function wc() {
    if (ge || G || we || xn || !x || !Fn || !U)
      return;
    const u = x, g = Fn;
    Or(!0), er(
      t.map((R) => R.id === g.id ? g : R)
    ).then((R) => {
      R && (bt(Ao(g, u)), Qt("Queue saved to this review."));
    }).catch(
      (R) => un(
        R instanceof Error ? R.message : "Could not save queue."
      )
    ).finally(() => Or(!1));
  }
  function Oa() {
    if (!x || !ee || dn.current || ae || On) return;
    Mt.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, bn.current = {
      temporaryReview: Ue,
      filter: A,
      loadedFilter: Ce,
      queue: me,
      queueError: we,
      retryFromEnd: kr,
      selectedIds: new Set(Tt),
      focusedId: ht,
      pageCursor: Et.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const u = structuredClone({
      ...ee,
      view: { ...ee.view, startFrom: x.view.startFrom ?? "end" }
    });
    Ie(!1), Wt(!1), Qt(""), un(""), ft({ draft: u, saving: !1, error: "" });
  }
  function Vi() {
    ft(null), bn.current = null;
    const u = Mt.current;
    Mt.current = null, requestAnimationFrame(() => {
      (u == null ? void 0 : u.isConnected) && u !== document.body && !(u instanceof HTMLButtonElement && u.disabled) ? u.focus({ preventScroll: !0 }) : pt(xe.current, !1);
    });
  }
  function yc() {
    var g;
    if (!ae || ae.saving) return;
    const u = bn.current;
    u && (_e.current += 1, (g = Te.current) == null || g.abort(), lt.current = null, Fe(!1), bt(u.temporaryReview), ne(u.filter), qe(u.loadedFilter), Ze(u.queue), on(u.queueError), zt(u.retryFromEnd), hn(() => u.selectedIds), yt(u.focusedId), Et.current = u.pageCursor, window.history.replaceState(window.history.state, "", u.url)), Vi();
  }
  async function vc() {
    if (!ae || ae.saving || !fn || !x) return;
    const u = x, g = { ...fn, name: fn.name.trim() }, R = Br(g);
    if (R) {
      ft((_) => _ && { ..._, error: R });
      return;
    }
    ft((_) => _ && { ..._, saving: !0, error: "" });
    try {
      if (!await er(t.map((_) => _.id === g.id ? g : _)))
        throw new Error("Could not save reviews.");
      bt(Ao(g, u)), Me(g) === "video" && jr(g.id, {
        filter: A,
        objectFilter: u.view.objectFilter,
        searchMode: g.view.searchMode,
        startFrom: g.view.startFrom ?? "end"
      }), Qt("Review saved."), Vi();
    } catch (_) {
      ft(
        (Y) => Y && {
          ...Y,
          saving: !1,
          error: "Could not save review. Your edits are still open. " + (_ instanceof Error ? _.message : "Retry saving.")
        }
      );
    }
  }
  function Ji() {
    x && Xn(x, A, kr, Ar).catch(() => {
    });
  }
  function Nc() {
    Dt(/* @__PURE__ */ new Set()), cn.current.clear(), yt(null);
  }
  function qc(u) {
    !x || ge || xn || u === Number(A.page) || ju(
      { ...A, page: u },
      x,
      (g, R) => Xn(g, R, !1, Ar),
      Nc
    );
  }
  function Sc(u) {
    if (!Z || !ee || ge || G || xn) return;
    const g = wu(Z, u, ee.view.objectFilter), R = !To(g, ee);
    bt(R ? g : null), R ? Zr(g, { ...A, page: 1 }) : Zr(
      ee,
      { ...A, page: 1 },
      ee.view.startFrom !== "beginning"
    );
  }
  function Ec(u) {
    var $e, Ke;
    const g = be === "tag", R = g ? "tag" : "video", _ = Math.max(1, Number(A.perPage) || 40), Y = Math.max(1, Math.ceil(me.totalCount / _)), Q = Math.min(Math.max(1, Number(A.page) || 1), Y), ue = [
      Ve ? "" : `${Vn} write permission is required to apply actions.`,
      g && I ? `Tag groups are unavailable. ${I}` : ""
    ].filter(Boolean), $t = !!Wn && !vt;
    return /* @__PURE__ */ c(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": g ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ r(
            xs,
            {
              name: u.name,
              description: u.description,
              entityType: be,
              onBack: Aa,
              backDisabled: ge || !!ae || Nt,
              onEdit: ae ? () => {
                var he;
                return (he = He.current) == null ? void 0 : he.focus();
              } : Oa,
              editDisabled: !ae && (ge || G || sn || On || Nt || !U),
              editing: !!ae,
              toolbar: /* @__PURE__ */ c("fieldset", { className: "dq-review-toolbar", disabled: Ca, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: g ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ r(
                  Ur,
                  {
                    filter: we ? Ce : A,
                    onFilterChange: gc,
                    totalCount: me.totalCount,
                    sortOptions: g ? Kc : Do,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: ln,
                    zoomLevel: (vn - 225) / 50,
                    onZoomChange: (he) => Ir(Math.round(225 + he * 50)),
                    cardSizeEntityType: g ? "tags" : "videos",
                    criteriaDefinitions: g ? Uc : si,
                    customFieldEntityType: be === "video" ? "video" : void 0,
                    objectFilter: Ot,
                    onObjectFilterChange: (he) => {
                      Ca || (lt.current = be === "video" ? Ds(
                        he,
                        hr,
                        u.view.objectFilter
                      ) : he);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(Ps, { page: Q, pages: Y, onPage: qc })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ c(fe, { children: [
                Z && /* @__PURE__ */ r(
                  Ls,
                  {
                    mode: "multiple",
                    disabled: ge || G || gt || !!ae || On || Nt,
                    onChange: () => it({ id: Z.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ r(
                  Fd,
                  {
                    options: g ? Pu : xu,
                    value: ln,
                    onChange: (he) => Rr(Io(he, be))
                  }
                ),
                /* @__PURE__ */ r(
                  Ri,
                  {
                    disabled: ge || !!ae,
                    items: Bi(ee ?? u, {
                      onSelect: Oa,
                      disabled: G || sn || On || !U
                    })
                  }
                )
              ] }),
              chipsAfter: (Ke = ($e = Z == null ? void 0 : Z.presentation) == null ? void 0 : $e.binParents) != null && Ke.length ? /* @__PURE__ */ r(
                gu,
                {
                  videos: me.items,
                  review: Z,
                  savedObjectFilter: (ee ?? Z).view.objectFilter,
                  trees: S.ids,
                  disabled: ge || G || xn,
                  onToggle: Sc
                }
              ) : void 0,
              chipsEnd: ae ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : (Ue == null ? void 0 : Ue.id) === V ? /* @__PURE__ */ c(fe, { children: [
                /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Queue differs from the saved review" }),
                mr && /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    className: "dq-text-button",
                    title: "Save the current queue criteria to this review",
                    disabled: ge || G || !!we || xn || !U,
                    onClick: wc,
                    children: [
                      /* @__PURE__ */ r(Qo, { "aria-hidden": "true" }),
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
                    disabled: ge || G || xn,
                    onClick: bc,
                    children: [
                      /* @__PURE__ */ r(Ho, { "aria-hidden": "true" }),
                      "Reset"
                    ]
                  }
                )
              ] }) : void 0
            }
          ),
          Ia,
          Z && S.error && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: S.error }),
          /* @__PURE__ */ c("div", { className: "dq-review-area", children: [
            ae && fn && /* @__PURE__ */ r(
              Fs,
              {
                drawerRef: He,
                draft: fn,
                onChange: (he) => ft((et) => et && { ...et, draft: he }),
                direction: ae.draft.view.startFrom ?? "end",
                onDirectionChange: (he) => ft(
                  (et) => et && {
                    ...et,
                    draft: { ...et.draft, view: { ...et.draft.view, startFrom: he } }
                  }
                ),
                tagGroups: M,
                trees: Yn,
                saving: ae.saving,
                saveDisabled: G || !!we,
                error: ae.error,
                dirty: Fr,
                criteriaChanged: mr,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  we && !G ? /* @__PURE__ */ c("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ r(Dn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ c("span", { children: [
                      "The queue could not load: ",
                      we,
                      " ",
                      /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", onClick: Ji, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void vc(),
                onCancel: yc
              }
            ),
            /* @__PURE__ */ c(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${It}px` },
                children: [
                  /* @__PURE__ */ c("div", { className: "dq-grid-content", children: [
                    G && !me.items.length && /* @__PURE__ */ r(Mo, { label: "Loading review queue…" }),
                    we && !G && /* @__PURE__ */ r(
                      Fo,
                      {
                        message: we,
                        retryLabel: sn ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (sn && ee && Me(ee) === "video") {
                            const he = sr(ee);
                            jr(ee.id, { ...he, filter: { ...he.filter, page: void 0 } }), rn((et) => et + 1);
                            return;
                          }
                          Ji();
                        }
                      }
                    ),
                    !ge && !G && !we && !me.items.length && /* @__PURE__ */ c("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ r(ga, {}),
                      /* @__PURE__ */ c("p", { children: [
                        "No ",
                        R,
                        "s match this review."
                      ] })
                    ] }),
                    !!me.items.length && /* @__PURE__ */ r("div", { ref: q, children: /* @__PURE__ */ r(
                      "div",
                      {
                        className: ln === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${vn}px` },
                        children: me.items.map(Cc)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ r("div", { className: "dq-bar-dock", ref: _t, children: /* @__PURE__ */ r(
                    Cs,
                    {
                      actions: ae ? ae.draft.actions : u.actions,
                      tagGroups: M,
                      trees: Yn,
                      isDisabled: ji,
                      paused: !!ae,
                      busy: ge || G,
                      onApply: (he) => void Xr(he),
                      onFind: () => Ie(!0),
                      status: ge ? `Applying action to ${dr}…` : "",
                      summary: /* @__PURE__ */ c(fe, { children: [
                        /* @__PURE__ */ r("p", { className: "dq-bar-target", children: Tt.size ? `${Tt.size} selected` : ht == null ? "Nothing to apply to" : `Applies to the focused ${R}` }),
                        /* @__PURE__ */ c(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !Oe.length || cc,
                            onClick: () => hn((he) => /* @__PURE__ */ new Set([...he, ...Oe])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ r(ot, { binding: dc.selectAll, hidden: !0 })
                            ]
                          }
                        ),
                        /* @__PURE__ */ c(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Escape",
                            disabled: !Tt.size,
                            onClick: () => hn(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ r(ot, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: ue.length ? ue.join(" ") : g ? "Arrows move · Space selects · Enter opens" : ae ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews",
                      notices: $t || zn ? /* @__PURE__ */ c(fe, { children: [
                        $t && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ r(Dn, { "aria-hidden": "true" }),
                          Wn
                        ] }),
                        zn && /* @__PURE__ */ r("p", { role: "status", className: "dq-status", children: zn })
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
  function Cc(u) {
    var R, _, Y;
    if (be === "tag") {
      const Q = u;
      return /* @__PURE__ */ r(
        Ku,
        {
          tag: Q,
          displayMode: ln === "list" ? "list" : "grid",
          focused: Q.id === ht,
          selected: Tt.has(Q.id),
          setRef: (ue) => {
            ue ? f.current.set(Q.id, ue) : f.current.delete(Q.id);
          },
          onFocus: () => yt(Q.id),
          onToggle: () => {
            hn((ue) => oa(ue, Q.id)), pt(Q.id, !1);
          },
          onOpen: () => window.open(`/tag/${Q.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        Q.id
      );
    }
    const g = u;
    return /* @__PURE__ */ r(
      Gu,
      {
        video: mu(g, Z, S.ids),
        showTagBins: ((_ = (R = Z == null ? void 0 : Z.presentation) == null ? void 0 : R.annotations) == null ? void 0 : _.includes("tags")) && !!((Y = Z.presentation.annotationParents) != null && Y.length),
        displayMode: ln,
        cardsScroll: ie,
        focused: g.id === ht,
        selected: Tt.has(g.id),
        setRef: (Q) => {
          Q ? f.current.set(g.id, Q) : f.current.delete(g.id);
        },
        onFocus: () => yt(g.id),
        onToggle: () => hn((Q) => oa(Q, g.id)),
        onPreview: () => {
          ae || (yt(g.id), Wt(!0));
        },
        onNavigate: e
      },
      g.id
    );
  }
}
function ju(e, t, n, a) {
  a(), n(t, e).catch(() => {
  });
}
function oa(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function Uu(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Ku({
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
        Gc,
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
function Gu({
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
  var E, v;
  const w = ac(e), m = T(null), N = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, b = !!(N.date || N.studioName), y = !!(N.performers.length || N.tags.length);
  return Zt(() => {
    const M = m.current;
    if (!M) return;
    const j = M.querySelector(
      `a[href="/video/${e.id}"]`
    ), I = M.querySelector(".card-title"), P = `dq-card-title-${e.id}`;
    I && (I.id = P), j && (j.target = "_blank", j.rel = "noreferrer", j.removeAttribute("aria-label"), j.setAttribute("aria-labelledby", P), j.classList.add("dq-card-link"));
    const U = M.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    U && U.setAttribute(
      "aria-label",
      o ? `Deselect ${w}` : `Select ${w}`
    );
    const ce = M.querySelector(
      'button[title="Quick View"]'
    );
    ce && ce.setAttribute("aria-label", `Preview ${w}`);
  }), /* @__PURE__ */ c(
    "article",
    {
      ref: (M) => {
        m.current = M, s(M);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${w}${o ? ", selected" : ""}`,
      onFocus: l,
      onClick: (M) => {
        l(), M.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${b ? "has-card-metadata" : "no-card-metadata"} ${y ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ r(
          Bc,
          {
            video: N,
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
          (E = e.tags) == null ? void 0 : E.map((M) => /* @__PURE__ */ r("span", { children: M.name }, M.id)),
          !((v = e.tags) != null && v.length) && /* @__PURE__ */ r("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ r(Bu, { video: e, cardsScroll: a })
      ]
    }
  );
}
function Bu({ video: e, cardsScroll: t }) {
  const n = T(null), a = T(null), [i, o] = C(!1), [s, l] = C(!1), [d, h] = C(!1);
  return W(() => {
    const p = n.current;
    if (!p || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      o(!0), l(!0);
      return;
    }
    const w = t ? p.closest(".dq-grid-stage") : null, m = new IntersectionObserver(
      ([b]) => o(b.isIntersecting),
      { root: w, rootMargin: "320px 0px", threshold: 0 }
    ), N = new IntersectionObserver(
      ([b]) => l(b.isIntersecting && b.intersectionRatio >= 0.6),
      { root: w, threshold: [0, 0.6, 1] }
    );
    return m.observe(p), N.observe(p), () => {
      m.disconnect(), N.disconnect();
    };
  }, [e.id, e.files.length, t]), W(() => {
    if (!i) {
      h(!1);
      return;
    }
    const p = new AbortController();
    return oe(Ml(e.id), {
      signal: p.signal
    }).then((w) => {
      p.signal.aborted || h(w.available === !0);
    }).catch(() => {
      p.signal.aborted || h(!1);
    }), () => p.abort();
  }, [i, e.id]), W(() => {
    const p = a.current;
    p && (s ? Promise.resolve(p.play()).catch(() => {
    }) : p.pause());
  }, [d, s]), /* @__PURE__ */ r("div", { ref: n, className: "dq-wall-autoplay", "aria-hidden": "true", children: d && /* @__PURE__ */ r(
    "video",
    {
      ref: a,
      src: $l(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Vu({
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
  hasNext: w,
  onToggleSelected: m,
  onPrevious: N,
  onNext: b,
  onClose: y,
  onAction: E,
  findOpen: v,
  onFindOpenChange: M
}) {
  const j = T(null), I = T(null), P = e.files[0], U = ac(e), ce = (k) => a || i || "steps" in k && k.steps.length > 0 && !s || Kn(k) && !l;
  qi({
    surface: "overlay",
    enabled: !v,
    actions: t.actions,
    onAction: (k) => {
      const $ = t.actions[k];
      $ && E($);
    },
    onFind: () => M(!0)
  }), W(() => {
    var $;
    const k = document.body.style.overflow;
    return document.body.style.overflow = "hidden", ($ = j.current) == null || $.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = k;
    };
  }, []);
  function se(k) {
    var re, X, de;
    if (k.key !== "Tab") return;
    const $ = [
      ...((re = j.current) == null ? void 0 : re.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((F) => F.offsetParent !== null);
    if (!$.length) {
      k.preventDefault(), (X = j.current) == null || X.focus();
      return;
    }
    const B = $.indexOf(
      document.activeElement
    );
    k.shiftKey && B <= 0 ? (k.preventDefault(), (de = $.at(-1)) == null || de.focus()) : !k.shiftKey && B === $.length - 1 && (k.preventDefault(), $[0].focus());
  }
  function O(k) {
    if (v || k.defaultPrevented || k.ctrlKey || k.metaKey || k.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const $ = k.key === "ArrowLeft" || k.key === "ArrowRight";
    if (k.altKey && !$) return;
    const B = I.current, re = k.currentTarget.querySelector("video");
    if (k.key === "Enter" || k.key === "Escape")
      k.repeat || y();
    else if (k.key === " " && B)
      k.repeat || B.toggle();
    else if ($ && B)
      B.seekBy(
        (k.key === "ArrowLeft" ? -1 : 1) * (k.shiftKey ? 5 : k.altKey ? 10 : 60)
      );
    else if ((k.key === "," || k.key === ".") && B) {
      const X = [P == null ? void 0 : P.duration, re == null ? void 0 : re.duration].find(
        (F) => F != null && Number.isFinite(F) && F > 0
      ) ?? 0, de = e.parentVideoId != null ? (e.clipEndSec ?? X) - (e.clipStartSec ?? 0) : X;
      Number.isFinite(de) && de > 0 && B.seekBy((k.key === "," ? -1 : 1) * de * 0.1);
    } else if (k.key.toLowerCase() === "n" || k.key.toLowerCase() === "m")
      !k.repeat && !a && !i && (k.key.toLowerCase() === "n" && p && N(), k.key.toLowerCase() === "m" && w && b());
    else if (k.key === "ArrowUp" && re)
      re.volume = Math.min(1, re.volume + 0.1);
    else if (k.key === "ArrowDown" && re)
      re.volume = Math.max(0, re.volume - 0.1);
    else return;
    yr(k);
  }
  function D(k) {
    const $ = j.current, B = k.target instanceof Element ? k.target.closest("button, a[href]") : null;
    !$ || !B || !$.contains(B) || B.closest(".dq-player, .dq-find-action") || k.detail === 0 || $.focus({ preventScroll: !0 });
  }
  W(() => {
    if (v) return;
    let k = 0;
    const $ = requestAnimationFrame(() => {
      k = requestAnimationFrame(() => {
        var re;
        const B = document.activeElement;
        (re = j.current) != null && re.isConnected && (!B || B === document.body || B === document.documentElement) && j.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame($), cancelAnimationFrame(k);
    };
  }, [v, a, i, w, p, e.id]);
  const H = n ? `the ${n} selected video${n === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ c(
    "div",
    {
      ref: j,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${U}`,
      className: "dq-preview",
      onKeyDown: se,
      onKeyDownCapture: O,
      onMouseDown: (k) => {
        k.target === k.currentTarget && y();
      },
      onClick: D,
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
                onClick: N,
                children: [
                  /* @__PURE__ */ r(zr, { "aria-hidden": "true" }),
                  /* @__PURE__ */ r(ot, { binding: "n", hidden: !0 })
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
                disabled: !w || a || i,
                onClick: b,
                children: [
                  /* @__PURE__ */ r(ot, { binding: "m", hidden: !0 }),
                  /* @__PURE__ */ r(Wo, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ c("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ r("h2", { children: U }),
              /* @__PURE__ */ c("p", { children: [
                "Actions apply to ",
                H
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
                  /* @__PURE__ */ r("span", { className: "dq-preview-check", "aria-hidden": "true", children: h && /* @__PURE__ */ r(ui, {}) }),
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
                "aria-label": `Open ${U} in a new tab`,
                title: "Open video in a new tab",
                children: /* @__PURE__ */ r(Yo, { "aria-hidden": "true" })
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
                onClick: y,
                children: /* @__PURE__ */ r(Jr, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ r("div", { className: "dq-preview-video", children: P ? /* @__PURE__ */ r(
            _o,
            {
              autostart: !0,
              streamUrl: Qa("video", e.id),
              posterUrl: ro(e),
              format: P.format,
              audioCodec: P.audioCodec,
              duration: P.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onPlaybackControlRegister: (k) => (I.current = k, () => {
                I.current === k && (I.current = null);
              }),
              clip: e.parentVideoId != null ? {
                start: e.clipStartSec ?? 0,
                end: e.clipEndSec,
                loop: !1
              } : void 0
            }
          ) : /* @__PURE__ */ r("img", { src: ro(e), alt: "" }) }) }),
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
            Cs,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: d,
              isDisabled: ce,
              busy: a || i,
              onApply: (k) => void E(k),
              onFind: () => M(!0),
              status: a ? `Applying action to ${H}…` : "",
              summary: /* @__PURE__ */ r("p", { className: "dq-bar-target", children: n ? `${n} selected` : "This video" })
            }
          )
        ] }),
        v && /* @__PURE__ */ r(
          ki,
          {
            actions: t.actions,
            trees: d,
            isDisabled: ce,
            canStay: !1,
            onApply: (k) => {
              M(!1), E(k);
            },
            onClose: () => M(!1)
          }
        )
      ]
    }
  );
}
async function Ju() {
  const e = await oe("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
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
function Mo({ label: e }) {
  return /* @__PURE__ */ c("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ r(el, { className: "dq-spin" }),
    e
  ] });
}
function Fo({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ c("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ r(Dn, {}),
    /* @__PURE__ */ r("p", { children: e }),
    /* @__PURE__ */ r("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const Xu = { components: { DataQualityPage: _u } };
export {
  _u as DataQualityPage,
  Xu as default,
  or as objectFiltersEqual
};
