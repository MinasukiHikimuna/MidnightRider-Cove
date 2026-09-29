import { jsxs as c, Fragment as pe, jsx as r } from "react/jsx-runtime";
import { useRef as R, useLayoutEffect as cn, useMemo as Ce, useState as k, useEffect as J, useCallback as pn, useSyncExternalStore as ui, useId as St, Fragment as fi, createContext as _c, useContext as jc } from "react";
import { useKeySequence as Uc, EntityReferenceMultiSelector as An, SortableList as Ko, EntityDetailTabs as Kc, TagBadge as Gc, DetailListToolbar as _r, PERFORMER_CRITERIA as hi, AUDIO_CRITERIA as Go, VIDEO_CRITERIA as pi, NarrativeText as Bc, AUDIO_SORT_OPTIONS as Vc, VIDEO_SORT_OPTIONS as Bo, AudioPlayer as Jc, VideoPlayer as Vo, formatDuration as Jo, FilterDialog as zc, getResolutionLabel as Qc, ConfirmDialog as Wc, TAG_CRITERIA as Hc, TAG_SORT_OPTIONS as Yc, TagTile as Xc, VideoCard as Zc } from "@cove/runtime/components";
import { Search as Br, Pencil as Er, Ban as pa, Pin as mi, Plus as gi, GripVertical as zo, AlertTriangle as Kn, Copy as Qo, Trash2 as Wo, ChevronDown as Ho, X as Vr, Mic as el, Users as Yo, Tag as Xo, Headphones as Zo, Film as qa, ChevronLeft as Jr, RectangleHorizontal as tl, LayoutGrid as bi, MoreHorizontal as nl, ChevronRight as es, Layers as ao, Check as wi, Undo2 as rl, Flag as ma, RefreshCw as al, Save as ts, RotateCcw as ns, ExternalLink as rs, SkipForward as il, Upload as ol, Download as as, ArrowUp as sl, ArrowDown as cl, Loader2 as ll, List as dl, Grid3X3 as ul } from "@cove/runtime/lucide-react";
import { extensionFetch as fl } from "@cove/runtime/api";
const yi = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, vi = Object.keys(
  yi
);
function jr(e) {
  return e === "excludes" || e === "excludesAll";
}
function Ni(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
const is = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function Ae(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function qi(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function $e(e) {
  return qi(xe(e));
}
function hl(e) {
  return xe(e) === "video";
}
function xe(e) {
  return e.entityType ?? "video";
}
const Bn = [
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
], Ur = [
  Bn.slice(0, 11),
  Bn.slice(11, 22),
  Bn.slice(22)
], Vn = "none";
function lr(e) {
  return typeof e == "string" && Bn.includes(e);
}
function Si(e) {
  const t = e.shortcut;
  return lr(t) || t === Vn ? t : "auto";
}
function os(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), i = [];
  e.forEach((s, l) => {
    const d = Si(s);
    if (d !== Vn) {
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
  const o = Bn.filter((s) => !n.has(s));
  return i.forEach((s, l) => {
    const d = o[l];
    d !== void 0 && (t[s] = d, n.set(d, s));
  }), { keys: t, actionOn: n, duplicatePins: a };
}
function pl(e, t, n) {
  const { keys: a, actionOn: i } = os(e), o = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (lr(n)) {
    const l = i.get(n), d = a[t];
    l !== void 0 && l !== t && o.set(l, d && e[t].shortcut === d ? d : void 0);
  }
  const s = new Set([...o.values()].filter(lr));
  return e.map((l, d) => {
    const p = o.has(d) ? o.get(d) : lr(l.shortcut) && s.has(l.shortcut) ? void 0 : l.shortcut;
    if (p === l.shortcut) return l;
    const { shortcut: f, ...g } = l;
    return p === void 0 ? g : { ...g, shortcut: p };
  });
}
function Kr(e) {
  return Ae(e) && !ss(e.occurrence) ? "Complete the optional occurrence condition before saving." : !hl(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : xe(e) !== "tag" && e.actions.some(
    (t) => Ei(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => Tn(t, xe(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const ml = {
  video: 1e3,
  audio: 250
};
function xt(e, t = "video") {
  const n = (a, i) => Number.isFinite(Number(a)) && Number(a) > 0 ? Math.floor(Number(a)) : i;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(ml[t], n(e.perPage, 40))
    )
  };
}
function io(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function Gn(e) {
  const { page: t, ...n } = e.view.filter, a = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    Ae(e) ? [e.entityType, ...a, e.occurrence] : xe(e) === "video" ? a : [xe(e), ...a]
  );
}
function Tn(e, t) {
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
  ) && !Ei(e) : !1;
}
function gl(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function kn(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function Sa(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function Wa(e) {
  return "steps" in e && e.steps.length > 0;
}
function Jn(e) {
  return "steps" in e ? e.steps.some((t) => kn(t.mode)) : !1;
}
function Ei(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (kn(n.mode))
      for (const a of n.tagIds) {
        const i = t.get(a);
        if (i && i !== n.mode) return !0;
        t.set(a, n.mode);
      }
  return !1;
}
function zr(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || is.includes(n.entityType)) && (!gl(n.entityType) || ss(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && bl(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (a) => typeof a == "string"
    )) && Array.isArray(n.actions) && n.actions.every(
      (a) => typeof (a == null ? void 0 : a.id) == "string" && typeof a.label == "string" && (a.shortcut === void 0 || typeof a.shortcut == "string") && (n.entityType === "tag" ? "effect" in a && !("steps" in a) && Tn(a, "tag") : "steps" in a && !("effect" in a) && Array.isArray(a.steps) && a.steps.every(
        (i) => i && Array.isArray(i.tagIds)
      ) && Tn(a, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => Kr(n)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((n) => n.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function bl(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= 115 && n.cardSize <= 380) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (a) => ["date", "studio", "performers", "tags"].includes(a)
  )) && [n.annotationParents, n.binParents].every(
    (a) => a === void 0 || Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0)
  );
}
function Ha(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const a of e)
    for (const i of a)
      n.has(i.id) || (n.add(i.id), t.push(i));
  return t;
}
function wl(e, t) {
  const n = new Set(t.map((i) => i.name.trim().toLocaleLowerCase())), a = `${e.trim().replace(/ copy(?: \d+)?$/i, "")} copy`;
  for (let i = 1; ; i++) {
    const o = i === 1 ? a : `${a} ${i}`;
    if (!n.has(o.toLocaleLowerCase())) return o;
  }
}
function yl(e, t, n) {
  return { ...structuredClone(e), id: n, name: wl(e.name, t) };
}
function ss(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (a) => Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0) && new Set(a).size === a.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && vi.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function oo(e, t) {
  return e.size > 0 ? [...e].sort((n, a) => n - a) : t == null ? [] : [t];
}
function so(e, t, n, a) {
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
function vl(e, t) {
  const n = new Set(e), a = t.length > 0 && t.every((i) => n.has(i));
  for (const i of t)
    a ? n.delete(i) : n.add(i);
  return n;
}
function Nl(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function ql(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function Sl(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function El(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function Cl(e, t) {
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
const cs = "ext:com.midnightrider.data-quality:configuration", kl = "ext:cove-data-quality:video-reviews", Ya = "ext:com.midnightrider.data-quality:progress";
class ls extends Error {
}
const Qr = /* @__PURE__ */ new Map(), sa = /* @__PURE__ */ new Map(), sr = (e, t) => e.includes("*") || e.includes(t), ga = (e) => se(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Al = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Xa(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function vr(e) {
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
    reviews: zr(JSON.stringify(t.reviews)),
    deletedIds: Xa(t.deletedIds),
    importedIds: Xa(t.importedIds)
  };
}
function Tl(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const a = /* @__PURE__ */ new Set();
  for (const i of t) {
    const o = localStorage.getItem(i);
    if (o !== null) {
      const s = zr(o);
      n ?? (n = s), s.forEach((l) => a.add(l.id));
    }
    Xa(
      JSON.parse(localStorage.getItem(`${i}:account-imports`) ?? "[]")
    ).forEach((s) => a.add(s));
  }
  return {
    reviews: n ?? [],
    known: [...a],
    present: n !== void 0
  };
}
async function ds(e) {
  const t = await se("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function us(e, t) {
  const n = (sa.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return sa.set(e, n), n.finally(() => {
    sa.get(e) === n && sa.delete(e);
  }).catch(() => {
  }), n;
}
let Fr = null;
function Rl() {
  if (Fr) return Fr;
  const e = Ol();
  return Fr = e, e.finally(() => {
    Fr === e && (Fr = null);
  }).catch(() => {
  }), e;
}
async function Ol() {
  var m;
  const e = await se("/api/auth/me"), t = String(e.user.id), n = `cove-data-quality-v2:${t}`, a = sr(e.permissions, "savedfilters.read"), i = a && sr(e.permissions, "savedfilters.write"), o = a ? (await ga(cs)).filter((N) => N.name === "Data Quality configuration").sort((N, b) => N.id - b.id) : [];
  if (o.length > 1) {
    const N = (b) => {
      const { revision: q, ...E } = vr(b.uiOptions);
      return JSON.stringify(E);
    };
    if (o.some((b) => N(b) !== N(o[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (i)
      for (const b of o.slice(1))
        await se(`/api/savedfilters/${b.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${b.id}` })
        });
    o.splice(1);
  }
  let s = o.length ? vr(o[0].uiOptions) : Al();
  const l = localStorage.getItem(`${n}:migrated`) === "true", d = localStorage.getItem(n), p = localStorage.getItem(`${n}:local-only`) === "true";
  !o.length && d && (s = vr(d));
  let f = !o.length;
  if (o.length && p && d) {
    const N = vr(d);
    if (N.reviews.some((q) => {
      const E = s.reviews.find((w) => w.id === q.id);
      return E && JSON.stringify(E) !== JSON.stringify(q);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const b = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...N.deletedIds])
    ];
    s = {
      ...s,
      reviews: Ha(s.reviews, N.reviews).filter(
        (q) => !b.includes(q.id)
      ),
      deletedIds: b,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...N.importedIds])
      ]
    }, f = !0;
  }
  if (!l) {
    const N = JSON.stringify(s), b = Tl(t);
    if (o.length && b.reviews.some((I) => {
      const x = s.reviews.find((_) => _.id === I.id);
      return x && JSON.stringify(x) !== JSON.stringify(I);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const q = a ? (await ga(kl)).flatMap(
      (I) => zr(I.uiOptions ?? "[]")
    ) : [], E = b.known.filter(
      (I) => !b.reviews.some((x) => x.id === I)
    ), w = /* @__PURE__ */ new Set([...s.deletedIds, ...E]);
    s = {
      ...s,
      reviews: Ha(
        b.reviews,
        s.reviews,
        q.filter(
          (I) => !b.known.includes(I.id) && !s.importedIds.includes(I.id)
        )
      ).filter((I) => !w.has(I.id)),
      deletedIds: [...w],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...b.known,
          ...q.map((I) => I.id)
        ])
      ]
    }, f || (f = JSON.stringify(s) !== N);
  }
  const g = {
    userId: t,
    recordId: (m = o[0]) == null ? void 0 : m.id,
    config: s,
    readable: a,
    writable: i,
    durable: i
  };
  if (Qr.set(n, g), f && i) {
    const N = s;
    o.length && (g.config = vr(o[0].uiOptions)), await fs(n, N), s = g.config;
  } else o.length || (localStorage.setItem(n, JSON.stringify(s)), !a && (!l || p) && localStorage.setItem(`${n}:local-only`, "true"));
  if (!a) localStorage.setItem(`${n}:migrated`, "true");
  else if (i)
    try {
      localStorage.setItem(`${n}:migrated`, "true");
    } catch {
    }
  return {
    reviews: s.reviews,
    storageKey: n,
    canWrite: sr(e.permissions, "videos.write"),
    canWriteVideos: sr(e.permissions, "videos.write"),
    canWriteAudios: sr(e.permissions, "audios.write"),
    canWriteTags: sr(e.permissions, "tags.write"),
    canReadTagGroups: sr(e.permissions, "taggroups.read"),
    canConfigure: !a || i,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: a ? i ? "account" : "readOnly" : "browser",
    storageNotice: a ? i ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function fs(e, t) {
  const n = Qr.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const a = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await ds(n), n.recordId != null) {
      const o = await se(
        `/api/savedfilters/${n.recordId}`
      );
      if (vr(o.uiOptions).revision !== n.config.revision)
        throw new ls(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const i = await se(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: cs,
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
function Il(e, t) {
  return zr(JSON.stringify(t)), us(e, async () => {
    const n = Qr.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const a = n.config.reviews.filter((i) => !t.some((o) => o.id === i.id)).map((i) => i.id);
    await fs(e, {
      ...n.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...n.config.deletedIds, ...a])
      ].filter((i) => !t.some((o) => o.id === i))
    });
  });
}
function co(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, a]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(a)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function $l(e, t) {
  const n = Qr.get(e);
  if (!n) return null;
  const a = localStorage.getItem(`${e}:progress:${t}`), i = a ? co(a) : null;
  if (!n.readable) return i;
  const o = (await ga(Ya)).find(
    (l) => l.name === t
  ), s = o ? co(o.uiOptions) : null;
  return i && (!s || i.updatedAt > s.updatedAt) ? i : s;
}
function Ml(e, t, n) {
  const a = `${e}:progress:${t}`;
  try {
    localStorage.setItem(a, JSON.stringify(n));
  } catch {
  }
  return us(a, async () => {
    const i = Qr.get(e);
    if (!(i != null && i.writable)) return;
    await ds(i);
    const o = (await ga(Ya)).find(
      (s) => s.name === t
    );
    await se(
      o ? `/api/savedfilters/${o.id}` : "/api/savedfilters",
      {
        method: o ? "PUT" : "POST",
        body: JSON.stringify({
          mode: Ya,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function Qn(e) {
  return e === "audio" ? "audios" : "videos";
}
const Fl = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function gn(e) {
  return Fl[e];
}
const ba = "confirmed_absent_tags", Ci = "Confirmed absent tags", Ea = "confirmed_absent_occurrence_tags", hs = {
  key: ba,
  label: Ci,
  type: "tag",
  subject: "tag assessments"
}, ki = {
  key: Ea,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, Pl = {
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
function Rn(e) {
  return Array.isArray(e) ? e.map(Rn) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? Pl[n] ?? n : t === "key" && typeof n == "string" && [
        ba,
        Ea
      ].includes(n.toLowerCase()) ? n.toLowerCase() : Rn(n)
    ])
  ) : e;
}
async function ps(e, t, n) {
  const a = new Headers(t.headers);
  !(t.body instanceof FormData) && !a.has("Content-Type") && a.set("Content-Type", "application/json");
  const i = await fl(e, { ...t, headers: a });
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
async function se(e, t = {}) {
  return await ps(e, t, "fail");
}
function xl(e, t = {}) {
  return ps(e, t, "null");
}
const Ll = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Dl = 0;
function Za(e, t) {
  return se(
    `/api/${Qn(e)}/${t}?dqRead=${Ll}-${++Dl}`,
    { cache: "no-store" }
  );
}
function ms(e, t) {
  const n = { ...e.view.objectFilter }, a = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    Rn({
      findFilter: xt(t, $e(e)),
      objectFilter: n,
      filterExpression: a
    })
  );
}
async function Lr(e, t, n) {
  return se(
    `/api/${Qn($e(e))}/find`,
    { method: "POST", signal: n, body: ms(e, t) }
  );
}
async function _l(e, t, n) {
  return (await se(
    `/api/${Qn($e(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: ms(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function lo(e, t, n) {
  const a = { ...e.view.objectFilter };
  return delete a._filterExpression, se("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      Rn({
        findFilter: xt(t),
        objectFilter: a
      })
    )
  });
}
function jl(e) {
  return se("/api/taggroups", { signal: e });
}
function ei(e, t, n = 1280) {
  return `/api/${Qn(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function ti(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function uo(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Ul(e) {
  return `/api/stream/video/${e}/preview`;
}
function Kl(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Gl(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Ca(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e) {
    await se(`/api/tags/${a}`, { signal: t }), n.add(a);
    for (let i = 1; ; i++) {
      const o = await se("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Rn({
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
async function Ai(e, t) {
  const n = Sa(e);
  return (await Promise.all(
    e.steps.map(
      async (i) => i.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await Ca(i.tagIds, t)).filter(
          (o) => !n.has(o)
        )
      } : i
    )
  )).filter((i) => i.tagIds.length > 0);
}
function Bl(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function Ti(e, t) {
  const a = (await se("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === e.key
  );
  if (!a)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const i = Bl(e, a);
  return i ? { kind: "incompatible", message: i } : a.entityTypes.includes(t) ? { kind: "ready", definition: a, message: "" } : {
    kind: "missing",
    message: `Add ${gn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: a
  };
}
async function gs(e, t) {
  const n = await Ti(e, t);
  if (n.kind !== "ready") {
    if (n.kind === "incompatible") throw new Error(n.message);
    if (n.definition) {
      await se(`/api/custom-fields/${n.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...n.definition.entityTypes, t])]
        })
      });
      return;
    }
    await se("/api/custom-fields", {
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
function bs(e = "video") {
  return Ti(hs, e);
}
function Vl(e = "video") {
  return gs(hs, e);
}
function ws(e = "video") {
  return Ti(ki, e);
}
function Jl(e = "video") {
  return gs(ki, e);
}
function wa(e) {
  return [...new Set(e)];
}
function ys(e, t) {
  const n = e.customFields ?? {}, a = Object.keys(n).find(
    (o) => o.toLowerCase() === Ea
  ), i = a === void 0 ? [] : n[a];
  return wa(
    (Array.isArray(i) ? i : []).filter(
      (o) => typeof o == "string" && /^[1-9]\d*:[1-9]\d*$/.test(o)
    ).map((o) => o.split(":").map(Number)).filter(([o]) => o === t).map(([, o]) => o)
  );
}
async function zl(e) {
  let t;
  try {
    t = await ws(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${ki.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function Ql(e, t, n, a, i, o) {
  await se(`/api/${Qn(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: wa(i).map((s) => `${a}:${s}`)
      },
      customFieldMode: o
    })
  });
}
function Wl(e, t, n) {
  const a = [...e.tagIds], i = (o) => {
    if (n === null)
      throw new Error(
        `The ${Ci} custom field is not available.`
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
async function vs(e, t, n) {
  if (!Tn(t) || n.length === 0 || n.some((d) => !Number.isSafeInteger(d) || d <= 0))
    throw new Error(
      `Choose ${gn(e).many} and configure a valid action first.`
    );
  let a = null;
  if (Jn(t)) {
    let d;
    try {
      d = await bs(e);
    } catch (p) {
      throw new Error(
        `Could not verify the ${Ci} custom field. ${p instanceof Error ? p.message : "Request failed."}`
      );
    }
    if (d.kind !== "ready") throw new Error(d.message);
    a = d.definition.key;
  }
  const i = wa(n), o = (await Ai(t)).map((d) => ({
    mode: d.mode,
    tagIds: wa(d.tagIds)
  })), l = [
    ...o.filter((d) => !kn(d.mode)),
    ...o.filter((d) => kn(d.mode))
  ].map(
    (d) => Wl(d, i, a)
  );
  for (let d = 0; d < l.length; d++)
    try {
      await se(`/api/${Qn(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(l[d])
      });
    } catch (p) {
      throw new Error(
        `Step ${d + 1} failed; ${d} earlier step(s) completed. Refresh and check the selected ${gn(e).many} before retrying. ${p instanceof Error ? p.message : "Request failed."}`
      );
    }
}
async function Hl(e, t) {
  if (!Tn(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await se("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const ni = "-", fo = "Ctrl+a", Yl = "Ctrl/⌘A", Xl = ["f", "g", "k"], ja = "Shift+";
function kr(e) {
  return Ce(() => os(e), [e]);
}
function Ri({
  surface: e,
  enabled: t,
  actions: n,
  onAction: a,
  onFind: i,
  onSelectAll: o
}) {
  const s = kr(n), l = R({ keyMap: s, onAction: a, onFind: i, onSelectAll: o });
  cn(() => {
    l.current = { keyMap: s, onAction: a, onFind: i, onSelectAll: o };
  });
  const d = !!i && n.length > 0, p = e === "local" && !!o, f = Bn.filter(
    (m) => s.actionOn.has(m) || e === "local" && Xl.includes(m)
  ).join(" "), g = Ce(() => {
    const m = (q) => {
      var w, I;
      const E = l.current;
      if (q === fo) (w = E.onSelectAll) == null || w.call(E);
      else if (q === ni) (I = E.onFind) == null || I.call(E);
      else {
        const x = q.startsWith(ja), _ = E.keyMap.actionOn.get(
          x ? q.slice(ja.length) : q
        );
        _ !== void 0 && E.onAction(_, x);
      }
    }, N = (q, E = e) => ({
      keys: q,
      surface: E,
      action: (w) => {
        w != null && w.repeat || m((w == null ? void 0 : w.sequence) ?? q);
      }
    }), b = [];
    p && b.push(N(fo, "local")), d && b.push(N(ni));
    for (const q of f ? f.split(" ") : [])
      b.push(N(q), N(`${ja}${q}`));
    return b;
  }, [e, f, d, p]);
  Uc(g, t);
}
const Zl = {
  find: ni,
  selectAll: Yl
};
function Oi() {
  return Zl;
}
const ed = 600 * 1e3, Ii = /* @__PURE__ */ new Map(), Ns = /* @__PURE__ */ new Map(), Un = /* @__PURE__ */ new Map();
function qs(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = Ns.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function Ss(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && Ns.set(e.tagGroupId, e.tagGroupSortOrder), Ii.set(e.id, { tag: e, at: Date.now() });
}
function Es(e) {
  const t = Ii.get(e);
  if (!(!t || Date.now() - t.at > ed))
    return qs(t.tag);
}
function Cs(e) {
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
function ri(e) {
  var t;
  for (const n of e) {
    const a = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && a && Ss(Cs({ ...n, name: a }));
  }
}
function td(e) {
  const t = Un.get(e);
  if (t) return t;
  const n = new AbortController(), a = {
    controller: n,
    waiters: 0,
    promise: se(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (i) => {
        var f, g;
        const o = ((f = i == null ? void 0 : i.name) == null ? void 0 : f.trim()) || null;
        if (Un.get(e) === a && Un.delete(e), !o) return null;
        const s = Cs({ ...i, id: e, name: o }), l = (g = Ii.get(e)) == null ? void 0 : g.tag, d = (l == null ? void 0 : l.tagGroupId) === s.tagGroupId, p = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (d ? l == null ? void 0 : l.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (l == null ? void 0 : l.hasImage),
          imagePath: s.imagePath ?? (l == null ? void 0 : l.imagePath)
        };
        return Ss(p), qs(p);
      },
      () => (Un.get(e) === a && Un.delete(e), null)
    )
  };
  return Un.set(e, a), a;
}
function ho() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function Ua(e) {
  const t = {};
  for (const n of e) {
    const a = Es(n);
    a !== void 0 && (t[n] = a);
  }
  return t;
}
function nd(e, t) {
  if (t != null && t.aborted) return Promise.reject(ho());
  const n = {}, a = [];
  for (const i of new Set(e)) {
    const o = Es(i);
    if (o !== void 0) n[i] = o;
    else {
      const s = td(i);
      s.waiters += 1, a.push({ id: i, entry: s });
    }
  }
  return a.length ? new Promise((i, o) => {
    let s = !1;
    const l = () => {
      for (const { id: p, entry: f } of a)
        f.waiters -= 1, f.waiters === 0 && Un.get(p) === f && (Un.delete(p), f.controller.abort());
    }, d = () => {
      s || (s = !0, l(), o(ho()));
    };
    t == null || t.addEventListener("abort", d, { once: !0 }), Promise.all(
      a.map(
        ({ id: p, entry: f }) => f.promise.then((g) => [p, g])
      )
    ).then((p) => {
      if (!s) {
        s = !0, t == null || t.removeEventListener("abort", d), l();
        for (const [f, g] of p) n[f] = g;
        i(n);
      }
    });
  }) : Promise.resolve(n);
}
function ks(e) {
  const t = {};
  for (const [n, a] of Object.entries(e)) t[Number(n)] = (a == null ? void 0 : a.name) ?? null;
  return t;
}
function $i(e) {
  const t = [...new Set(e)].sort((i, o) => i - o).join(","), [n, a] = k(() => ({
    key: t,
    tags: Ua(Ka(t))
  }));
  return J(() => {
    const i = Ka(t), o = Ua(i);
    if (a({ key: t, tags: o }), i.every((l) => l in o)) return;
    const s = new AbortController();
    return nd(i, s.signal).then(
      (l) => a({ key: t, tags: l }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : Ua(Ka(t));
}
function Ar(e) {
  const t = $i(e);
  return Ce(() => ks(t), [t]);
}
function Ka(e) {
  return e ? e.split(",").map(Number) : [];
}
const rd = "(max-width: 760px)";
function ad(e) {
  const [t] = k(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = pn(
    (a) => (t == null || t.addEventListener("change", a), () => t == null ? void 0 : t.removeEventListener("change", a)),
    [t]
  );
  return ui(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function Wr() {
  return ad(rd);
}
function id(e, t, n = !1) {
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
function zn(e, t, n = [], a) {
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
  const i = Sa(e), o = (s) => i.has(s) || [...i].some((l) => {
    var d;
    return (d = a == null ? void 0 : a.get(s)) == null ? void 0 : d.includes(l);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (l) => id(
        s.mode,
        t[l] === void 0 ? "…" : t[l] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && o(l)
      )
    )
  );
}
function ka(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function Mi({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  canStay: i = !0,
  tapStays: o = !1,
  onApply: s,
  onClose: l
}) {
  const d = Wr(), [p, f] = k(""), [g, m] = k(0), N = R(null), b = R(null), q = R(null), E = R(null), w = R(null), I = R(/* @__PURE__ */ new Set()), x = St(), _ = Ar(Ce(() => ka(e), [e])), K = kr(e), U = Ce(() => {
    const F = p.trim().toLocaleLowerCase(), D = (v) => v ? Bn.indexOf(v) : Bn.length;
    return e.map((v, T) => ({ action: v, index: T, key: K.keys[T] })).sort((v, T) => D(v.key) - D(T.key)).filter((v) => !F || v.action.label.toLocaleLowerCase().includes(F));
  }, [e, K, p]), te = U.length ? Math.min(g, U.length - 1) : -1, G = (F) => `${x}-option-${F}`;
  cn(() => {
    var F, D, v;
    return E.current = document.activeElement, w.current = ((D = (F = q.current) == null ? void 0 : F.parentElement) == null ? void 0 : D.closest('[role="dialog"]')) ?? null, (v = N.current) == null || v.focus({ preventScroll: !0 }), () => {
      var Y;
      const T = E.current;
      T instanceof HTMLElement && T.isConnected && T.focus({ preventScroll: !0 }), document.activeElement !== T && ((Y = w.current) != null && Y.isConnected) && w.current.focus({ preventScroll: !0 });
    };
  }, []), J(() => {
    var F, D, v;
    te < 0 || (v = (D = (F = b.current) == null ? void 0 : F.querySelector(`[id="${G(U[te].index)}"]`)) == null ? void 0 : D.scrollIntoView) == null || v.call(D, { block: "nearest" });
  }, [te, U]);
  function W(F, D) {
    !F || a != null && a(F.action) || s(F.action, i && D);
  }
  function V(F) {
    var v;
    F.stopPropagation();
    const D = F.code || F.key;
    if (F.repeat && !I.current.has(D)) {
      F.preventDefault();
      return;
    }
    if (F.repeat || I.current.add(D), F.key === "Escape")
      F.preventDefault(), l();
    else if (F.key === "Enter")
      F.preventDefault(), F.repeat || W(U[te], F.shiftKey);
    else if (F.key === "ArrowDown" || F.key === "ArrowUp") {
      if (F.preventDefault(), !U.length) return;
      const T = F.key === "ArrowDown" ? 1 : -1;
      m((te + T + U.length) % U.length);
    } else F.key === "Tab" && (F.preventDefault(), (v = N.current) == null || v.focus());
  }
  return /* @__PURE__ */ c(pe, { children: [
    /* @__PURE__ */ r("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: l }),
    /* @__PURE__ */ c(
      "div",
      {
        ref: q,
        role: "dialog",
        "aria-label": "Find an action",
        className: `dq-find-action${d ? " dq-find-mobile" : ""}`,
        onKeyDown: V,
        onMouseDown: (F) => {
          F.target !== N.current && F.preventDefault();
        },
        children: [
          /* @__PURE__ */ c("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ r(Br, { "aria-hidden": "true" }),
            /* @__PURE__ */ r(
              "input",
              {
                ref: N,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${x}-list`,
                "aria-activedescendant": te >= 0 ? G(U[te].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: p,
                onChange: (F) => {
                  f(F.target.value), m(0);
                }
              }
            ),
            !d && /* @__PURE__ */ r("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          U.length ? /* @__PURE__ */ r(
            "ul",
            {
              ref: b,
              id: `${x}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: U.map((F, D) => /* @__PURE__ */ r("li", { role: "none", children: /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: G(F.index),
                  tabIndex: -1,
                  "aria-selected": D === te,
                  disabled: (a == null ? void 0 : a(F.action)) ?? !1,
                  onClick: (v) => W(F, v.shiftKey || o && Wa(F.action)),
                  children: [
                    d ? null : F.key ? /* @__PURE__ */ r("kbd", { children: F.key }) : /* @__PURE__ */ r("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ r("span", { className: "dq-find-label", children: F.action.label }),
                    /* @__PURE__ */ r("span", { className: "dq-find-effect", children: zn(F.action, _, t, n).map(
                      (v, T) => /* @__PURE__ */ r("span", { "data-effect-tone": v.tone, children: v.text }, T)
                    ) })
                  ]
                }
              ) }, F.action.id))
            }
          ) : /* @__PURE__ */ c("p", { className: "dq-find-empty", role: "status", children: [
            "No action matches “",
            p.trim(),
            "”."
          ] }),
          !d && /* @__PURE__ */ c("p", { className: "dq-find-hints", "aria-hidden": "true", children: [
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
const ca = (e) => e >= "0" && e <= "9";
function po(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function mo(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let n = 0, a = 0;
  for (; n < e.length && a < t.length; ) {
    if (ca(e[n]) && ca(t[a])) {
      const l = n, d = a;
      for (; n < e.length && ca(e[n]); ) n++;
      for (; a < t.length && ca(t[a]); ) a++;
      const p = e.slice(l, n).replace(/^0+/, ""), f = t.slice(d, a).replace(/^0+/, "");
      if (p.length !== f.length) return p.length < f.length ? -1 : 1;
      if (p !== f) return p < f ? -1 : 1;
      continue;
    }
    const o = po(e[n]), s = po(t[a]);
    if (o !== s) return o < s ? -1 : 1;
    n++, a++;
  }
  const i = e.length - n - (t.length - a);
  return i !== 0 ? i < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function As(e, t) {
  const n = (i) => i.tagGroupId != null ? 0 : 1, a = (i) => i.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(a(e) - a(t)) || mo(e.tagGroupName, t.tagGroupName) || mo(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function dr(e) {
  return [...e].sort(As);
}
function od(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const a of n.steps)
        a.mode === "REMOVE_TREE" && a.tagIds.forEach((i) => t.add(i));
  return [...t];
}
function Ts(e, t, n) {
  const a = Sa(e), i = [], o = [];
  for (const m of e.steps) {
    if (m.mode !== "REMOVE_TREE") {
      o.push(m);
      continue;
    }
    const N = m.tagIds.flatMap((b) => {
      const q = n.get(b);
      return q || i.push(b), q ?? [b];
    });
    o.push({ mode: "REMOVE", tagIds: N.filter((b) => !a.has(b)) });
  }
  const s = [
    ...o.filter((m) => !kn(m.mode)),
    ...o.filter((m) => kn(m.mode))
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
  const p = new Set(t.ids), f = new Set(t.absent), g = [...new Set(e.steps.flatMap((m) => m.tagIds))];
  return {
    added: g.filter((m) => l.has(m) && !p.has(m)),
    removed: [...p].filter((m) => !l.has(m)),
    markedAbsent: g.filter((m) => d.has(m) && !f.has(m)),
    absenceCleared: [...f].filter((m) => !d.has(m)),
    unresolvedTrees: [...new Set(i)]
  };
}
function sd(e) {
  let t;
  if (e.applications) {
    const n = /* @__PURE__ */ new Map();
    for (const a of e.applications)
      n.has(a.tag.id) || n.set(a.tag.id, a.tag);
    t = [...n.values()];
  } else
    t = e.tags ?? e.ids.map((n, a) => ({ id: n, name: e.names[a] ?? "" }));
  return dr(t);
}
function Rs(e) {
  const t = od(e).sort((s, l) => s - l).join(","), [n, a] = k(() => /* @__PURE__ */ new Map()), i = R(/* @__PURE__ */ new Set()), o = R(!0);
  return J(() => (o.current = !0, () => {
    o.current = !1;
  }), []), J(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const l of s)
      i.current.has(l) || (i.current.add(l), Ca([l]).then(
        (d) => {
          o.current && a((p) => new Map(p).set(l, d));
        },
        () => {
          i.current.delete(l);
        }
      ));
  }, [t]), n;
}
function Os() {
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
function Fi(e) {
  return ui(e.subscribe, e.get, e.get);
}
function Is(e, t) {
  return {
    onPointerEnter: (n) => {
      n.pointerType === "mouse" && e.set(t);
    },
    onPointerLeave: (n) => {
      n.pointerType === "mouse" && e.clear(t);
    },
    onFocus: () => e.set(t),
    onBlur: () => e.clear(t)
  };
}
const go = Ur.map((e, t) => ({
  indent: t,
  keys: e,
  fixed: t === 2 ? ["n", "m", ",", "."] : []
}));
function cd(e, t) {
  return t === "video" && e === "m" ? "Mute" : "";
}
function et({ binding: e, hidden: t }) {
  return /* @__PURE__ */ r(
    "kbd",
    {
      className: Array.from(e).length === 1 ? "dq-key dq-key-letter" : "dq-key",
      "aria-hidden": t || void 0,
      children: e
    }
  );
}
function la(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function $s(e) {
  return Ur.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
    (t) => t.length > 0
  );
}
function Ms({
  groups: e,
  renderAction: t,
  find: n
}) {
  const a = e.length ? e : [[]];
  return /* @__PURE__ */ r(pe, { children: a.map((i, o) => /* @__PURE__ */ c("div", { className: "dq-mobile-group", children: [
    i.map(t),
    o === a.length - 1 && n
  ] }, o)) });
}
function Fs({
  extra: e,
  findKey: t,
  disabled: n,
  onFind: a
}) {
  return /* @__PURE__ */ c(
    "button",
    {
      type: "button",
      className: "dq-mobile-tile dq-mobile-find",
      "aria-label": e > 0 ? `Find, ${e} more` : "Find",
      "aria-keyshortcuts": t,
      disabled: n,
      onClick: a,
      children: [
        /* @__PURE__ */ c("span", { className: "dq-mobile-find-name", children: [
          /* @__PURE__ */ r(Br, { "aria-hidden": "true" }),
          "Find"
        ] }),
        e > 0 && /* @__PURE__ */ c("span", { className: "dq-mobile-more", children: [
          e,
          " more"
        ] })
      ]
    }
  );
}
function ld({ checked: e, onChange: t }) {
  return /* @__PURE__ */ c(
    "button",
    {
      type: "button",
      role: "switch",
      "aria-checked": e,
      className: "dq-stay-switch",
      onClick: () => t(!e),
      children: [
        /* @__PURE__ */ r("span", { className: "dq-stay-track", "aria-hidden": "true" }),
        "Stay on this item"
      ]
    }
  );
}
function dd({
  actions: e,
  mediaKind: t,
  isDisabled: n,
  busy: a,
  tags: i,
  trees: o,
  preview: s,
  onApply: l,
  onFind: d,
  findDisabled: p,
  paused: f = !1,
  stayOnTap: g = !1,
  onStayOnTapChange: m
}) {
  const N = Oi(), b = kr(e), q = Wr(), E = St(), w = Ar(
    Ce(() => e.flatMap((G) => G.steps.flatMap((W) => W.tagIds)), [e])
  ), I = go.filter((G) => G.keys.some((W) => b.actionOn.has(W))), x = I.includes(go[2]), _ = e.length - b.actionOn.size, K = (G) => ({
    onMouseEnter: () => s.set(G),
    onMouseLeave: () => s.clear(G),
    onFocus: () => s.set(G),
    onBlur: (W) => {
      W.currentTarget.contains(W.relatedTarget) || s.clear(G);
    }
  }), U = (G) => {
    const W = b.actionOn.get(G), V = W === void 0 ? void 0 : e[W];
    if (!V)
      return /* @__PURE__ */ r(
        "div",
        {
          className: "dq-pad-slot dq-pad-free",
          "aria-hidden": "true",
          title: "No action on this key: it does nothing here",
          children: /* @__PURE__ */ r(et, { binding: G })
        },
        G
      );
    const F = n(V), D = `${E}-effect-${G}`;
    return /* @__PURE__ */ c("div", { className: "dq-pad-slot", ...f ? {} : K(V), children: [
      /* @__PURE__ */ r("span", { id: D, className: "dq-sr-only", children: zn(V, w, [], o).map((v) => v.text).join(", ") }),
      /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: V.label,
          "aria-keyshortcuts": G,
          "aria-describedby": D,
          disabled: F,
          onClick: (v) => l(V, v.shiftKey),
          children: [
            /* @__PURE__ */ r(et, { binding: G }),
            " ",
            /* @__PURE__ */ r("span", { className: "dq-pad-label", children: V.label }),
            la(V) && " ",
            la(V) && /* @__PURE__ */ c("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(pa, { "aria-hidden": "true" }),
              "absent"
            ] })
          ]
        }
      ),
      Wa(V) && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-pad-pin",
          "aria-label": `Apply and stay: ${V.label}`,
          title: "Apply and stay (Shift)",
          disabled: F,
          onClick: () => l(V, !0),
          children: /* @__PURE__ */ r(mi, { "aria-hidden": "true" })
        }
      )
    ] }, G);
  }, te = /* @__PURE__ */ c("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ r(Er, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (q) {
    const G = $s(b), W = (V) => {
      const F = e[V], D = b.keys[V];
      return /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: F.label,
          "aria-keyshortcuts": D,
          "aria-describedby": `${E}-effect-${D}`,
          disabled: n(F),
          onClick: (v) => {
            s.clear(F), l(F, v.shiftKey || g && Wa(F));
          },
          ...f ? {} : Is(s, F),
          children: [
            /* @__PURE__ */ r("span", { className: "dq-mobile-label", children: F.label }),
            la(F) && " ",
            la(F) && /* @__PURE__ */ c("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(pa, { "aria-hidden": "true" }),
              "absent"
            ] })
          ]
        },
        D
      );
    };
    return /* @__PURE__ */ c(
      "section",
      {
        className: `dq-pad dq-pad-mobile${f ? " dq-pad-paused" : ""}`,
        "aria-label": f ? "Actions, paused while editing" : "Actions",
        "aria-busy": a || void 0,
        children: [
          /* @__PURE__ */ c("div", { className: "dq-pad-header", children: [
            f ? te : /* @__PURE__ */ r(
              bo,
              {
                actions: e,
                keyMap: b,
                names: w,
                tags: i,
                trees: o,
                preview: s,
                findKey: N.find,
                mobile: !0
              }
            ),
            m && /* @__PURE__ */ r(ld, { checked: g, onChange: m })
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ r(
            Ms,
            {
              groups: G,
              renderAction: W,
              find: /* @__PURE__ */ r(
                Fs,
                {
                  extra: _,
                  findKey: N.find,
                  disabled: p,
                  onFind: d
                }
              )
            }
          ) }),
          /* @__PURE__ */ r("div", { hidden: !0, children: G.flat().map((V) => /* @__PURE__ */ r("span", { id: `${E}-effect-${b.keys[V]}`, children: zn(e[V], w, [], o).map((F) => F.text).join(", ") }, V)) })
        ]
      }
    );
  }
  return /* @__PURE__ */ c(
    "section",
    {
      className: `dq-pad${f ? " dq-pad-paused" : ""}`,
      "aria-label": f ? "Actions, paused while editing" : "Actions",
      "aria-busy": a || void 0,
      children: [
        /* @__PURE__ */ c("div", { className: "dq-pad-header", children: [
          f ? te : /* @__PURE__ */ c(pe, { children: [
            /* @__PURE__ */ r(
              bo,
              {
                actions: e,
                keyMap: b,
                names: w,
                tags: i,
                trees: o,
                preview: s,
                findKey: N.find
              }
            ),
            /* @__PURE__ */ c("span", { className: "dq-pad-hint", children: [
              /* @__PURE__ */ r("kbd", { className: "dq-key", children: "Shift" }),
              /* @__PURE__ */ r("span", { children: "+ key applies and stays" })
            ] })
          ] }),
          !x && /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "dq-pad-find-button",
              "aria-label": _ ? `Find action, ${_} more` : "Find action",
              "aria-keyshortcuts": N.find,
              disabled: p,
              onClick: d,
              children: [
                /* @__PURE__ */ r(et, { binding: N.find }),
                /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "Find action" })
              ]
            }
          )
        ] }),
        I.map((G) => /* @__PURE__ */ c("div", { className: "dq-pad-row", "data-indent": G.indent, children: [
          G.keys.map(U),
          G.fixed.map((W) => {
            const V = cd(W, t);
            return /* @__PURE__ */ c(
              "div",
              {
                className: `dq-pad-slot dq-pad-free dq-pad-fixed${V ? " dq-pad-reserved" : ""}`,
                "aria-hidden": "true",
                children: [
                  /* @__PURE__ */ r(et, { binding: W }),
                  V && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: V })
                ]
              },
              W
            );
          }),
          G.fixed.length > 0 && /* @__PURE__ */ r("div", { className: "dq-pad-slot", children: /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": _ ? `Find action, ${_} more` : "Find action",
              "aria-keyshortcuts": N.find,
              disabled: p,
              onClick: d,
              children: [
                /* @__PURE__ */ r(et, { binding: N.find }),
                /* @__PURE__ */ c("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ r(Br, { "aria-hidden": "true" }),
                  _ ? `${_} more` : "Find action"
                ] })
              ]
            }
          ) })
        ] }, G.indent))
      ]
    }
  );
}
function bo({
  actions: e,
  keyMap: t,
  names: n,
  tags: a,
  trees: i,
  preview: o,
  findKey: s,
  mobile: l = !1
}) {
  const d = Fi(o), p = d ? e.indexOf(d) : -1;
  if (!d || p < 0) {
    const N = t.actionOn.size;
    return /* @__PURE__ */ c("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      !l && N < e.length && /* @__PURE__ */ c(pe, { children: [
        ` · ${N} on keys, ${e.length - N} more under `,
        /* @__PURE__ */ r(et, { binding: s })
      ] })
    ] });
  }
  const f = t.keys[p], g = a && d.steps.length ? Ts(d, a, i) : null, m = g && !g.unresolvedTrees.length && ![g.added, g.removed, g.markedAbsent, g.absenceCleared].some(
    (N) => N.length
  );
  return /* @__PURE__ */ c("p", { className: "dq-pad-effect", children: [
    f && !l && /* @__PURE__ */ r(et, { binding: f }),
    /* @__PURE__ */ r("strong", { children: d.label }),
    zn(d, n, [], i).map((N, b) => /* @__PURE__ */ r("span", { "data-effect-tone": N.tone, children: N.text }, b)),
    m && /* @__PURE__ */ r("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function Ps({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  busy: i,
  onApply: o,
  onFind: s,
  summary: l,
  hints: d,
  keyHints: p,
  notices: f,
  status: g,
  className: m = "",
  paused: N = !1
}) {
  const b = Oi(), q = kr(e), E = Wr(), w = St(), I = Ar(Ce(() => ka(e), [e])), [x] = k(() => Os()), _ = R(null), K = ud(_, e, !E), U = $s(q);
  !U.length && e.length && U.push([]);
  const te = U.flat(), G = e.length - te.length, W = (v) => zn(v, I, t, n).map((T) => T.text).join(", "), V = (v) => ({
    onMouseEnter: () => x.set(v),
    onMouseLeave: () => x.clear(v),
    onFocus: () => x.set(v),
    onBlur: (T) => {
      T.currentTarget.contains(T.relatedTarget) || x.clear(v);
    }
  }), F = d ?? (E ? void 0 : p), D = (v) => {
    const T = e[v];
    return /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-mobile-tile",
        title: T.label,
        "aria-keyshortcuts": q.keys[v] || void 0,
        "aria-describedby": `${w}-effect-${v}`,
        disabled: N || a(T),
        onClick: () => {
          x.clear(T), o(T);
        },
        ...N ? {} : Is(x, T),
        children: /* @__PURE__ */ r("span", { className: "dq-mobile-label", children: T.label })
      },
      T.id
    );
  };
  return /* @__PURE__ */ c(
    "section",
    {
      ref: _,
      className: `dq-action-bar${E ? " dq-bar-mobile" : K ? " dq-bar-stacked" : ""}${i ? " dq-bar-busy" : ""}${N ? " dq-bar-paused" : ""}${m ? ` ${m}` : ""}`,
      "aria-label": "Actions",
      children: [
        /* @__PURE__ */ r("div", { className: "dq-bar-summary", children: l }),
        /* @__PURE__ */ r("span", { className: "dq-bar-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ c(
          "div",
          {
            className: `dq-bar-tiles${E ? " dq-mobile-actions" : ""}`,
            "aria-busy": i || void 0,
            children: [
              E && e.length > 0 && /* @__PURE__ */ r(
                Ms,
                {
                  groups: U,
                  renderAction: D,
                  find: /* @__PURE__ */ r(
                    Fs,
                    {
                      extra: G,
                      findKey: b.find,
                      disabled: N,
                      onFind: s
                    }
                  )
                }
              ),
              !E && U.map((v, T) => /* @__PURE__ */ c("div", { className: "dq-bar-line", children: [
                v.map((Y) => {
                  const H = e[Y], de = q.keys[Y];
                  return /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: H.label,
                      "aria-keyshortcuts": de || void 0,
                      "aria-describedby": `${w}-effect-${Y}`,
                      disabled: N || a(H),
                      onClick: () => o(H),
                      ...N ? {} : V(H),
                      children: [
                        de && /* @__PURE__ */ r(et, { binding: de }),
                        " ",
                        /* @__PURE__ */ r("span", { className: "dq-bar-label", children: H.label })
                      ]
                    },
                    H.id
                  );
                }),
                T === U.length - 1 && /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    className: "dq-bar-tile dq-bar-find",
                    "aria-label": G > 0 ? `Find action, ${G} more` : "Find action",
                    "aria-keyshortcuts": b.find,
                    disabled: N,
                    onClick: s,
                    children: [
                      /* @__PURE__ */ r(et, { binding: b.find, hidden: !0 }),
                      /* @__PURE__ */ r(Br, { "aria-hidden": "true" }),
                      /* @__PURE__ */ r("span", { className: "dq-bar-label", children: G > 0 ? `${G} more` : "Find action" })
                    ]
                  }
                )
              ] }, T)),
              !e.length && /* @__PURE__ */ r("p", { className: "dq-bar-empty", children: "This review has no actions." })
            ]
          }
        ),
        F && /* @__PURE__ */ r("p", { className: "dq-bar-hints", children: F }),
        N ? /* @__PURE__ */ c("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ r(Er, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ r(
          fd,
          {
            actions: e,
            keyMap: q,
            preview: x,
            names: I,
            tagGroups: t,
            trees: n,
            showKey: !E
          }
        ),
        f && /* @__PURE__ */ r("div", { className: "dq-bar-notices", children: f }),
        /* @__PURE__ */ r("div", { hidden: !0, children: te.map((v) => /* @__PURE__ */ r("span", { id: `${w}-effect-${v}`, children: W(e[v]) }, e[v].id)) }),
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: g })
      ]
    }
  );
}
function ud(e, t, n) {
  const [a, i] = k(!1);
  return cn(() => {
    var f;
    const o = e.current;
    if (!o || !n || typeof ResizeObserver > "u") return;
    const s = o.querySelector(".dq-bar-summary"), l = () => {
      const g = getComputedStyle(o), m = parseFloat(g.columnGap) || 0, N = o.clientWidth - (parseFloat(g.paddingLeft) || 0) - (parseFloat(g.paddingRight) || 0), b = [...o.querySelectorAll(".dq-bar-line")].map(
        (te) => [...te.children].map((G) => G.offsetWidth)
      ), q = o.querySelector(".dq-bar-line"), E = q && parseFloat(getComputedStyle(q).columnGap) || 0, w = o.querySelector(".dq-bar-hints"), I = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (w ? w.offsetWidth + m : 0) + 1 + // the divider
      2 * m, x = (te) => b.map((G) => {
        let W = 1, V = 0;
        for (const F of G)
          V > 0 && V + E + F > te ? (W += 1, V = F) : V += (V > 0 ? E : 0) + F;
        return W;
      }), _ = (te) => Math.max(1, te.reduce((G, W) => G + W, 0)), K = x(N), U = _(x(N - I));
      i(
        1 + _(K) < U || 1 + _(K) === U && K.every((te) => te === 1)
      );
    }, d = new ResizeObserver(l);
    d.observe(o);
    for (const g of o.querySelectorAll(".dq-bar-summary, .dq-bar-tiles, .dq-bar-hints"))
      d.observe(g);
    l();
    let p = !0;
    return (f = document.fonts) == null || f.ready.then(() => {
      p && l();
    }), () => {
      p = !1, d.disconnect();
    };
  }, [e, t, n]), a;
}
function fd({
  actions: e,
  keyMap: t,
  preview: n,
  names: a,
  tagGroups: i,
  trees: o,
  showKey: s
}) {
  const l = Fi(n), d = l ? e.indexOf(l) : -1;
  if (!l || d < 0) return null;
  const p = t.keys[d];
  return /* @__PURE__ */ c("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    p && s && /* @__PURE__ */ r(et, { binding: p }),
    /* @__PURE__ */ r("strong", { children: l.label }),
    zn(l, a, i, o).map((f, g) => /* @__PURE__ */ r("span", { "data-effect-tone": f.tone, children: f.text }, g))
  ] });
}
const wo = 1e3;
async function hd(e, t, n) {
  const a = await se(
    `/api/tags/${t}`,
    { signal: n }
  ), i = /* @__PURE__ */ new Map();
  for (let d = 1; ; d++) {
    const p = await se(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          Rn({
            findFilter: {
              page: d,
              perPage: wo,
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
    for (const f of p.items) i.set(f.id, f);
    if (d * wo >= p.totalCount) break;
    if (!p.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const o = [...i.values()], s = $e(e), l = Ae(e) ? await md(
    s,
    o.map((d) => d.id),
    n
  ) : o.map((d) => (s === "audio" ? d.audioCount : d.videoCount) ?? 0);
  return {
    parent: { id: t, name: a.name },
    children: o.map((d, p) => ({ id: d.id, name: d.name, uses: l[p] })).sort(
      (d, p) => p.uses - d.uses || d.name.localeCompare(p.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      })
    )
  };
}
function pd(e) {
  return JSON.stringify(
    Rn({
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
async function md(e, t, n) {
  const a = new Array(t.length).fill(0), i = new AbortController(), o = () => i.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && o(), n == null || n.addEventListener("abort", o, { once: !0 });
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; s < t.length && !i.signal.aborted; ) {
            const l = s++;
            a[l] = (await se(
              `/api/${Qn(e)}/aggregate`,
              {
                method: "POST",
                signal: i.signal,
                body: pd(t[l])
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
function gd(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((a) => t.has(a.id) ? !1 : (t.add(a.id), !0))
  }));
}
function bd(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of n.children)
      t.set(a.id, [...t.get(a.id) ?? [], n.parent.id]);
  return t;
}
function wd(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of Sa(n))
      t.set(a, [...t.get(a) ?? [], n]);
  return t;
}
function yd(e, t) {
  return {
    id: crypto.randomUUID(),
    label: e.name,
    steps: [
      { mode: "ADD", tagIds: [e.id] },
      ...t.length ? [{ mode: "REMOVE_TREE", tagIds: t }] : []
    ]
  };
}
const vd = (e) => e instanceof Error ? e.message : "Request failed.";
function Nd({
  id: e,
  review: t,
  disabled: n,
  onAdd: a,
  onCancel: i
}) {
  const [o, s] = k([]), [l, d] = k({}), [p, f] = k({}), [g, m] = k({}), N = R(/* @__PURE__ */ new Map());
  J(
    () => () => {
      for (const v of N.current.values()) v.abort();
    },
    []
  );
  const b = gn($e(t)), q = Ae(t), E = q ? "performer" : b.one;
  function w(v) {
    var Y;
    (Y = N.current.get(v)) == null || Y.abort();
    const T = new AbortController();
    N.current.set(v, T), d((H) => ({ ...H, [v]: { status: "loading" } })), hd(t, v, T.signal).then(
      (H) => {
        T.signal.aborted || d((de) => ({
          ...de,
          [v]: { status: "ready", group: H }
        }));
      },
      (H) => {
        T.signal.aborted || d((de) => ({
          ...de,
          [v]: { status: "failed", message: vd(H) }
        }));
      }
    );
  }
  function I(v) {
    var ce;
    const T = o.filter((B) => !v.includes(B));
    for (const B of T)
      (ce = N.current.get(B)) == null || ce.abort(), N.current.delete(B);
    const Y = (B) => {
      const A = l[B];
      return (A == null ? void 0 : A.status) === "ready" ? A.group.children.map((j) => j.id) : [];
    }, H = new Set(v.flatMap(Y)), de = T.flatMap(Y).filter((B) => !H.has(B));
    f(
      (B) => Object.fromEntries(
        Object.entries(B).filter(([A]) => !de.includes(Number(A)))
      )
    ), m(
      (B) => Object.fromEntries(
        Object.entries(B).filter(([A]) => v.includes(Number(A)))
      )
    ), d(
      (B) => Object.fromEntries(
        Object.entries(B).filter(([A]) => v.includes(Number(A)))
      )
    ), s(v);
    for (const B of v) o.includes(B) || w(B);
  }
  const x = o.flatMap((v) => {
    const T = l[v];
    return (T == null ? void 0 : T.status) === "ready" ? [T.group] : [];
  }), _ = x.length === o.length, K = o.some(
    (v) => {
      var T;
      return (((T = l[v]) == null ? void 0 : T.status) ?? "loading") === "loading";
    }
  ), U = new Map(
    gd(x).map((v) => [v.parent.id, v])
  ), te = bd(x), G = new Map(x.map((v) => [v.parent.id, v.parent.name])), W = wd(t.actions), V = (v) => p[v] ?? !W.has(v), F = _ ? [...U.values()].flatMap(
    (v) => v.children.filter((T) => V(T.id))
  ) : [], D = (v, T) => f((Y) => ({
    ...Y,
    ...Object.fromEntries(v.children.map((H) => [H.id, T]))
  }));
  return /* @__PURE__ */ c("fieldset", { id: e, className: "dq-actions-from-tags", children: [
    /* @__PURE__ */ r("legend", { children: "Add actions from parent tags" }),
    /* @__PURE__ */ c("p", { className: "dq-drawer-note", children: [
      "Each ticked child tag becomes an action that adds it, most used",
      " ",
      q ? "on performers " : "",
      "first. Tags an action already adds start unticked. The new actions go at the end, ready to reorder and edit."
    ] }),
    /* @__PURE__ */ r(
      An,
      {
        entityType: "tag",
        values: o,
        onChange: I,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    o.map((v) => {
      const T = l[v];
      if (!T || T.status === "loading")
        return /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Loading child tags…" }, v);
      if (T.status === "failed")
        return /* @__PURE__ */ c("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ c("span", { children: [
            "Child tags could not be loaded. ",
            T.message
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: n,
              onClick: () => w(v),
              children: "Retry"
            }
          )
        ] }, v);
      const Y = U.get(v);
      if (!Y) return null;
      const H = Y.parent.name;
      return /* @__PURE__ */ c("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ r("legend", { children: H }),
        T.group.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ c(pe, { children: [
          /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: g[v] ?? !1,
                disabled: n,
                onChange: (de) => m((ce) => ({
                  ...ce,
                  [v]: de.target.checked
                }))
              }
            ),
            "Only one per ",
            E,
            ": each action removes every other tag in the ",
            H,
            " tree"
          ] }),
          Y.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ c(pe, { children: [
            /* @__PURE__ */ c("div", { className: "dq-row", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${H}`,
                  onClick: () => D(Y, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${H}`,
                  onClick: () => D(Y, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ r("div", { className: "dq-child-tags", children: Y.children.map((de) => {
              const ce = W.get(de.id) ?? [], B = (te.get(de.id) ?? []).filter((A) => A !== v).map((A) => `“${G.get(A)}”`);
              return /* @__PURE__ */ c("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "checkbox",
                    checked: V(de.id),
                    disabled: n,
                    onChange: (A) => f((j) => ({
                      ...j,
                      [de.id]: A.target.checked
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
                  B.length > 0 && /* @__PURE__ */ c("small", { children: [
                    " · Also under ",
                    B.join(", ")
                  ] }),
                  ce.length > 0 && /* @__PURE__ */ c("small", { children: [
                    " ",
                    "· Already in “",
                    ce[0].label || "New action",
                    "”",
                    ce.length > 1 ? ` and ${ce.length - 1} more` : ""
                  ] })
                ] })
              ] }, de.id);
            }) })
          ] })
        ] })
      ] }, v);
    }),
    /* @__PURE__ */ c("div", { className: "dq-row", children: [
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: n || !F.length,
          onClick: () => a(
            F.map(
              (v) => yd(
                v,
                (te.get(v.id) ?? []).filter(
                  (T) => g[T]
                )
              )
            )
          ),
          children: F.length ? `Add ${F.length} action${F.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: i, children: "Cancel" }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-sr-only", children: K ? "Loading child tags…" : "" })
    ] })
  ] });
}
const qd = ["n", "m"], jn = [
  ...Ur,
  ["auto", Vn]
];
function ya(e) {
  return e.toLocaleUpperCase();
}
function xs(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : Si(e[n]);
}
function Sd({
  actions: e,
  index: t,
  keyMap: n,
  name: a,
  onChoose: i
}) {
  const [o, s] = k(!1), l = R(null), d = n.keys[t], p = xs(e, n, t), f = lr(p), g = n.duplicatePins.has(t) ? ` (${ya(e[t].shortcut ?? "")} is pinned twice)` : "", m = d ? `${ya(d)}, ${f ? "pinned" : "Auto"}${g}` : p === Vn ? "no key, Find action only" : `no key: Auto found no free key${g}`, N = () => {
    var b;
    s(!1), (b = l.current) == null || b.focus();
  };
  return /* @__PURE__ */ c(pe, { children: [
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
          d ? /* @__PURE__ */ r(et, { binding: d }) : /* @__PURE__ */ r("span", { className: "dq-key dq-key-none", children: "·" }),
          f && /* @__PURE__ */ r(mi, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ r(
      Ed,
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
function Ed({
  actions: e,
  index: t,
  keyMap: n,
  name: a,
  onChoose: i,
  onClose: o
}) {
  const s = R(null), l = n.keys[t], d = xs(e, n, t), [p, f] = k(l || "q"), g = (q) => {
    var E;
    return ((E = s.current) == null ? void 0 : E.querySelector(`[data-choice="${q}"]`)) ?? null;
  };
  cn(() => {
    var q, E, w;
    (q = g(l || d)) == null || q.focus(), (w = (E = s.current) == null ? void 0 : E.scrollIntoView) == null || w.call(E, { block: "nearest" });
  }, []);
  function m(q) {
    var E;
    lr(q) && f(q), (E = g(q)) == null || E.focus();
  }
  function N(q) {
    var U, te, G;
    if (q.key === "Escape") {
      q.preventDefault(), q.stopPropagation(), o();
      return;
    }
    if (q.key === "Tab") {
      const W = [...((U = s.current) == null ? void 0 : U.querySelectorAll("button[tabindex='0']")) ?? []], V = W.indexOf(document.activeElement);
      q.preventDefault(), (te = W[(V + (q.shiftKey ? -1 : 1) + W.length) % W.length]) == null || te.focus();
      return;
    }
    const E = (G = q.target.dataset) == null ? void 0 : G.choice, w = E ? jn.findIndex((W) => W.includes(E)) : -1;
    if (!E || w < 0) return;
    const I = jn[w].indexOf(E), x = (W) => W == null ? void 0 : W[Math.min(I, W.length - 1)], _ = {
      ArrowLeft: jn[w][I - 1],
      ArrowRight: jn[w][I + 1],
      ArrowUp: x(jn[w - 1]),
      ArrowDown: x(jn[w + 1]),
      Home: jn[w][0],
      End: jn[w].at(-1)
    };
    if (!Object.hasOwn(_, q.key)) return;
    q.preventDefault();
    const K = _[q.key];
    K && m(K);
  }
  const b = (q) => {
    const E = lr(q) ? n.actionOn.get(q) : void 0;
    return E === void 0 ? null : {
      own: E === t,
      label: e[E].label.trim() || "New action",
      pinned: Si(e[E]) === q
    };
  };
  return /* @__PURE__ */ c(pe, { children: [
    /* @__PURE__ */ r(
      "div",
      {
        className: "dq-key-picker-backdrop",
        "aria-hidden": "true",
        onMouseDown: (q) => {
          q.preventDefault(), o();
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
          /* @__PURE__ */ r("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: Ur.map((q, E) => /* @__PURE__ */ c("div", { className: "dq-key-picker-row", "data-indent": E, children: [
            q.map((w) => {
              const I = b(w), x = I ? `${I.own ? "this action" : I.label}, ${I.pinned ? "pinned" : "Auto"}` : "free";
              return /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: `dq-key-choice${I ? "" : " dq-key-choice-free"}${I != null && I.own ? " dq-key-choice-own" : ""}`,
                  "data-choice": w,
                  tabIndex: w === p ? 0 : -1,
                  "aria-label": `${ya(w)}: ${x}`,
                  "aria-pressed": !!(I != null && I.own && I.pinned),
                  title: I ? `${I.label} (${I.pinned ? "pinned" : "Auto"})` : void 0,
                  onFocus: () => f(w),
                  onClick: () => i(w),
                  children: [
                    /* @__PURE__ */ c("span", { className: "dq-key-choice-head", children: [
                      /* @__PURE__ */ r(et, { binding: w }),
                      (I == null ? void 0 : I.pinned) && /* @__PURE__ */ r(mi, { "aria-hidden": "true" })
                    ] }),
                    I && /* @__PURE__ */ r("span", { className: "dq-key-choice-label", children: I.label })
                  ]
                },
                w
              );
            }),
            E === Ur.length - 1 && qd.map((w) => /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-key-choice dq-key-choice-free",
                "aria-label": `${ya(w)}: not available, it steps through the grid preview`,
                title: "Steps through the grid preview",
                disabled: !0,
                children: /* @__PURE__ */ r("span", { className: "dq-key-choice-head", children: /* @__PURE__ */ r(et, { binding: w }) })
              },
              w
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
                "data-choice": Vn,
                tabIndex: 0,
                "aria-pressed": d === Vn,
                onClick: () => i(Vn),
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
const Cd = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function kd(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function Ad(e, t) {
  if (Tn(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (Ei(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function Ls(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function Td(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function Rd({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: a,
  saving: i,
  expandedId: o,
  onExpand: s,
  reveal: l
}) {
  const d = xe(e), p = d !== "tag", f = e.actions, g = kr(f), m = Ar(Ce(() => ka(f), [f])), [N, b] = k(""), [q, E] = k(!1), [w, I] = k(
    null
  ), x = St(), _ = `${x}-from-tags`, K = R(null), U = R(null), te = R(null), G = R(null), W = R(/* @__PURE__ */ new WeakMap()), V = (j) => {
    let Z = W.current.get(j);
    return Z || (Z = crypto.randomUUID(), W.current.set(j, Z)), Z;
  }, F = N.trim().toLocaleLowerCase(), D = F ? f.filter((j) => j.label.toLocaleLowerCase().includes(F)) : f, v = (j) => t({ ...e, actions: j }), T = (j, Z) => v(f.map((qe, Ne) => Ne === j ? Z : qe));
  function Y(j) {
    var Z;
    return [...((Z = te.current) == null ? void 0 : Z.querySelectorAll("[data-action-id]")) ?? []].find(
      (qe) => qe.dataset.actionId === j
    );
  }
  function H(j, Z) {
    const qe = Y(j), Ne = qe == null ? void 0 : qe.querySelector(
      Z === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return Ne == null || Ne.focus(), !!Ne;
  }
  cn(() => {
    var Z;
    const j = G.current;
    j && (G.current = null, (j === "add" || !H(j.id, j.part)) && ((Z = U.current) == null || Z.focus()));
  }), J(() => {
    !l || !o || (D.some((j) => j.id === o) ? H(o, "label") : (b(""), G.current = { id: o, part: "label" }));
  }, [l]);
  function de() {
    const j = Td(d);
    b(""), v([...f, j]), s(j.id), G.current = { id: j.id, part: "label" };
  }
  function ce(j) {
    const Z = f[j], { shortcut: qe, ...Ne } = structuredClone(Z), ft = {
      ...Ne,
      ...qe === Vn ? { shortcut: qe } : {},
      id: crypto.randomUUID(),
      label: `${Z.label} copy`
    };
    v([...f.slice(0, j + 1), ft, ...f.slice(j + 1)]), s(ft.id), G.current = { id: ft.id, part: "label" };
  }
  function B(j) {
    const Z = f[j], qe = D.indexOf(Z), Ne = D[qe + 1] ?? D[qe - 1];
    v(f.filter((ft, it) => it !== j)), o === Z.id && s(null), G.current = Ne ? { id: Ne.id, part: "toggle" } : "add";
  }
  function A() {
    E(!1), requestAnimationFrame(() => {
      var j;
      return (j = K.current) == null ? void 0 : j.focus();
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
              /* @__PURE__ */ r(gi, { "aria-hidden": "true" }),
              "Add action"
            ]
          }
        ),
        p && /* @__PURE__ */ r(
          "button",
          {
            ref: K,
            type: "button",
            className: "dq-header-button",
            "aria-expanded": q,
            "aria-controls": q ? _ : void 0,
            onClick: () => {
              I(null), E(!q);
            },
            children: "Add from parent tags…"
          }
        ),
        /* @__PURE__ */ c("label", { className: "dq-actions-filter", children: [
          /* @__PURE__ */ r(Br, { "aria-hidden": "true" }),
          /* @__PURE__ */ r(
            "input",
            {
              type: "search",
              "aria-label": "Find an action",
              placeholder: "Find an action…",
              autoComplete: "off",
              spellCheck: !1,
              value: N,
              onChange: (j) => b(j.target.value),
              onKeyDown: (j) => {
                j.key === "Escape" && N && (j.preventDefault(), j.stopPropagation(), b(""));
              }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-actions-hint", children: "Choose a key on its key cap; Auto takes the next free key in this order. Drag a handle, or press Alt + ↑ / ↓, to reorder." }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-actions-status", children: (w == null ? void 0 : w.actions) === f ? `Added ${w.count} action${w.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    p && q && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here.
    /* @__PURE__ */ r(
      "div",
      {
        onKeyDown: (j) => {
          j.key !== "Escape" || j.defaultPrevented || (j.preventDefault(), j.stopPropagation(), A());
        },
        children: /* @__PURE__ */ r(
          Nd,
          {
            id: _,
            review: e,
            disabled: i,
            onAdd: (j) => {
              const Z = [...f, ...j];
              v(Z), I({ actions: Z, count: j.length }), A();
            },
            onCancel: A
          }
        )
      }
    ),
    /* @__PURE__ */ r("div", { ref: te, children: D.length > 0 && /* @__PURE__ */ r(
      Ko,
      {
        items: D,
        getKey: (j) => j.id,
        disabled: i || !!F,
        className: "dq-action-list",
        onReorder: (j) => v(j),
        renderItem: (j, { dragHandleProps: Z, isOver: qe }) => {
          const Ne = f.indexOf(j), ft = o === j.id;
          return /* @__PURE__ */ r(
            Od,
            {
              action: j,
              entityType: d,
              keyButton: /* @__PURE__ */ r(
                Sd,
                {
                  actions: f,
                  index: Ne,
                  keyMap: g,
                  name: j.label.trim() || "New action",
                  onChoose: (it) => v(pl(f, Ne, it))
                }
              ),
              takenPin: g.duplicatePins.has(Ne) ? j.shortcut : void 0,
              effect: zn(j, m, n, a),
              open: ft,
              detailId: `${x}-detail-${j.id}`,
              dragHandleProps: Z,
              isOver: qe,
              reorderDisabled: i || !!F,
              onToggle: () => s(ft ? null : j.id),
              onDuplicate: () => ce(Ne),
              onDelete: () => B(Ne),
              children: "steps" in j ? /* @__PURE__ */ r(
                Id,
                {
                  action: j,
                  saving: i,
                  stepKey: V,
                  rememberStepKey: (it, wt) => W.current.set(it, V(wt)),
                  onChange: (it) => T(Ne, it)
                }
              ) : /* @__PURE__ */ r(
                Md,
                {
                  action: j,
                  tagGroups: n,
                  onChange: (it) => T(Ne, it)
                }
              )
            }
          );
        }
      }
    ) }),
    f.length ? !D.length && /* @__PURE__ */ c("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      N.trim(),
      "”."
    ] }) : /* @__PURE__ */ r("p", { className: "dq-actions-empty", children: p ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function Od({
  action: e,
  entityType: t,
  keyButton: n,
  takenPin: a,
  effect: i,
  open: o,
  detailId: s,
  dragHandleProps: l,
  isOver: d,
  reorderDisabled: p,
  onToggle: f,
  onDuplicate: g,
  onDelete: m,
  children: N
}) {
  const b = e.label.trim() || "New action", q = Ad(e, t);
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
              style: Ls(l.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${b}`,
              title: p ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: p,
              children: /* @__PURE__ */ r(zo, { "aria-hidden": "true" })
            }
          ),
          n,
          /* @__PURE__ */ c("div", { className: "dq-action-row-summary", onClick: f, children: [
            /* @__PURE__ */ r("span", { className: "dq-action-row-label", title: b, children: b }),
            !o && /* @__PURE__ */ r("span", { className: "dq-action-row-effect", children: i.map((E, w) => /* @__PURE__ */ r("span", { "data-effect-tone": E.tone, children: E.text }, w)) }),
            q && /* @__PURE__ */ c("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ r(Kn, { "aria-hidden": "true" }),
              q
            ] }),
            a && /* @__PURE__ */ c(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${a.toLocaleUpperCase()} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ r(Kn, { "aria-hidden": "true" }),
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
              onClick: g,
              children: /* @__PURE__ */ r(Qo, { "aria-hidden": "true" })
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
              children: /* @__PURE__ */ r(Wo, { "aria-hidden": "true" })
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
              onClick: f,
              children: /* @__PURE__ */ r(Ho, { "aria-hidden": "true" })
            }
          )
        ] }),
        o && /* @__PURE__ */ r("div", { id: s, className: "dq-action-detail", children: N })
      ]
    }
  );
}
function Ds({
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
function Id({
  action: e,
  saving: t,
  stepKey: n,
  rememberStepKey: a,
  onChange: i
}) {
  const o = St(), s = R(null), l = R(null);
  cn(() => {
    var f, g;
    const p = l.current;
    p != null && (l.current = null, (g = (f = s.current) == null ? void 0 : f.querySelector(`[data-step-index="${p}"] input`)) == null || g.focus());
  });
  const d = (p) => i({ ...e, steps: p });
  return /* @__PURE__ */ c(pe, { children: [
    /* @__PURE__ */ r(Ds, { action: e, onChange: (p) => i({ ...e, label: p }) }),
    /* @__PURE__ */ c("div", { className: "dq-action-field dq-action-field-top", role: "group", "aria-labelledby": o, children: [
      /* @__PURE__ */ r("span", { className: "dq-action-field-name", id: o, children: "Steps" }),
      /* @__PURE__ */ c("div", { className: "dq-steps", ref: s, children: [
        e.steps.length > 0 ? /* @__PURE__ */ r(
          Ko,
          {
            items: e.steps,
            getKey: n,
            disabled: t,
            className: "dq-step-list",
            onReorder: d,
            renderItem: (p, { index: f, dragHandleProps: g, isOver: m }) => /* @__PURE__ */ r(
              $d,
              {
                step: p,
                index: f,
                dragHandleProps: g,
                isOver: m,
                saving: t,
                onChange: (N) => {
                  a(N, p), d(e.steps.map((b, q) => q === f ? N : b));
                },
                onRemove: () => d(e.steps.filter((N, b) => b !== f))
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
              /* @__PURE__ */ r(gi, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function $d({
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
      "data-step-tone": kd(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            ...n,
            style: Ls(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${l}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: i,
            children: [
              /* @__PURE__ */ r(zo, { "aria-hidden": "true" }),
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
            children: Cd.map(({ mode: d, label: p }) => /* @__PURE__ */ r("option", { value: d, children: p }, d))
          }
        ),
        /* @__PURE__ */ r(
          An,
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
            children: /* @__PURE__ */ r(Vr, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function Md({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const a = e.effect, i = a.mode === "SET_TAG_GROUP" ? `group:${a.tagGroupId}` : a.mode, o = a.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === a.tagGroupId);
  return /* @__PURE__ */ c(pe, { children: [
    /* @__PURE__ */ r(Ds, { action: e, onChange: (s) => n({ ...e, label: s }) }),
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
function Fd({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, a = gn($e(e)).queue, i = (o) => t({ ...e, occurrence: { ...n, ...o } });
  return /* @__PURE__ */ c("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
    /* @__PURE__ */ c("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      a,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ r(
      An,
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
function Pd({
  review: e,
  onChange: t
}) {
  const n = gn($e(e)).many;
  return /* @__PURE__ */ c("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ r("legend", { children: "Performer flags" }),
    /* @__PURE__ */ c("p", { children: [
      "Flag performers whose profile has any of these tags in the performer list and batches, for example a tag noting that something changed during their career. Check a flagged performer’s earliest and latest ",
      n,
      " ",
      "before applying one batch to all of them."
    ] }),
    /* @__PURE__ */ r(
      An,
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
const _s = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, js = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, xd = {
  video: qa,
  audio: Zo,
  tag: Xo,
  performerOccurrence: Yo,
  audioPerformerOccurrence: el
};
function Us({ entityType: e }) {
  const t = xd[e];
  return /* @__PURE__ */ r(t, { role: "img", "aria-label": _s[e] });
}
const Ld = 2e6;
function Ks(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), a = document.createElement("a");
  a.href = n, a.download = t, a.click(), URL.revokeObjectURL(n);
}
function Dd(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function Pi(e) {
  Ks([e], Dd(e));
}
async function _d(e) {
  if (e.size > Ld) throw new Error("Review files must be smaller than 2 MB.");
  const t = await e.text();
  try {
    return zr(t);
  } catch (n) {
    throw new Error(
      n instanceof SyntaxError ? "It is not a JSON file." : "It does not hold valid Data Quality reviews."
    );
  }
}
function Sr(e) {
  const { page: t, ...n } = e.view.filter;
  return JSON.stringify(
    { ...e, view: { ...e.view, filter: n } },
    (a, i) => i && typeof i == "object" && !Array.isArray(i) ? Object.fromEntries(
      Object.keys(i).sort().map((o) => [o, i[o]])
    ) : i
  );
}
function Gs({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: a,
  nameRef: i,
  autoFocus: o = !1
}) {
  return /* @__PURE__ */ c(pe, { children: [
    /* @__PURE__ */ c("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ r("span", { children: "Entity type" }),
      /* @__PURE__ */ r(
        "select",
        {
          className: "dq-select",
          "aria-label": "Entity type",
          value: xe(e),
          disabled: n,
          onChange: (s) => a == null ? void 0 : a(s.target.value),
          children: is.map((s) => /* @__PURE__ */ r("option", { value: s, children: js[s] }, s))
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
function jd(e, t) {
  const n = xe(e), a = ["Review"];
  return (n === "video" || n === "tag") && a.push("Appearance"), a.push("Actions"), t && a.push("Tag choices"), a;
}
function Ud({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = R(null), a = R(null), i = St(), o = St();
  return J(() => {
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
function Bs({
  draft: e,
  onChange: t,
  direction: n,
  onDirectionChange: a,
  tagGroups: i,
  trees: o,
  saving: s,
  saveDisabled: l = !1,
  error: d,
  dirty: p,
  criteriaChanged: f = !1,
  notices: g,
  onSave: m,
  onCancel: N,
  drawerRef: b
}) {
  const [q, E] = k("Review"), [w] = k(
    () => Ae(e) && e.occurrence.tagIds.length > 0
  ), [I, x] = k(""), [_, K] = k(null), [U, te] = k(0), [G, W] = k(!1), V = R(null), F = R(null), D = R(null), v = jd(e, w), T = xe(e), Y = Ce(() => Sr(e), [e]);
  J(() => x(""), [Y]), J(() => {
    var j, Z;
    if (G) return;
    const B = V.current;
    if (V.current = null, !B) return;
    (Z = B.isConnected && !!((j = D.current) != null && j.contains(B)) && !(B instanceof HTMLButtonElement && B.disabled) ? B : D.current) == null || Z.focus({ preventScroll: !0 });
  }, [G]);
  function H() {
    if (!(s || G)) {
      if (!p) {
        N();
        return;
      }
      V.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, W(!0);
    }
  }
  function de() {
    const B = { ...e, name: e.name.trim() }, A = Kr(B);
    if (!A) {
      x(""), m();
      return;
    }
    if (x(A), !B.name) {
      E("Review"), requestAnimationFrame(() => {
        var Z;
        return (Z = F.current) == null ? void 0 : Z.focus();
      });
      return;
    }
    const j = e.actions.find(
      (Z) => !Tn(Z, T)
    );
    j && (E("Actions"), K(j.id), te((Z) => Z + 1));
  }
  const ce = I || d;
  return /* @__PURE__ */ c(pe, { children: [
    /* @__PURE__ */ c(
      "aside",
      {
        ref: (B) => {
          D.current = B, b && (b.current = B);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (B) => {
          B.key !== "Escape" || B.defaultPrevented || s || (B.preventDefault(), B.stopPropagation(), H());
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
                onClick: H,
                children: /* @__PURE__ */ r(Vr, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ r(
            Kc,
            {
              tabs: v.map((B) => ({
                key: B,
                label: B,
                count: B === "Actions" ? e.actions.length : void 0
              })),
              activeTab: q,
              onTabChange: (B) => E(B)
            }
          ) }),
          /* @__PURE__ */ r("div", { className: "dq-drawer-body", children: /* @__PURE__ */ c("fieldset", { className: "dq-drawer-fields", disabled: s, children: [
            /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review settings" }),
            /* @__PURE__ */ c(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: q !== "Review",
                "aria-label": "Review",
                children: [
                  /* @__PURE__ */ r(
                    Gs,
                    {
                      review: e,
                      onChange: t,
                      entityTypeLocked: !0,
                      nameRef: F,
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
                        onChange: (B) => a(B.target.value),
                        children: [
                          /* @__PURE__ */ r("option", { value: "end", children: "Start from the end" }),
                          /* @__PURE__ */ r("option", { value: "beginning", children: "Start from the beginning" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ r("small", { className: "dq-drawer-note", children: "From the end, the queue opens on its last page and works towards the first." })
                  ] }),
                  Ae(e) && /* @__PURE__ */ r(Pd, { review: e, onChange: t }),
                  /* @__PURE__ */ r("div", { children: /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => Pi(e),
                      children: "Export draft"
                    }
                  ) })
                ]
              }
            ),
            v.includes("Appearance") && /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: q !== "Appearance",
                "aria-label": "Appearance",
                children: /* @__PURE__ */ r(Kd, { review: e, onChange: t })
              }
            ),
            /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel dq-actions-panel",
                role: "tabpanel",
                hidden: q !== "Actions",
                "aria-label": "Actions",
                children: /* @__PURE__ */ r(
                  Rd,
                  {
                    review: e,
                    onChange: t,
                    tagGroups: i,
                    trees: o,
                    saving: s,
                    expandedId: _,
                    onExpand: K,
                    reveal: U
                  }
                )
              }
            ),
            w && Ae(e) && /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: q !== "Tag choices",
                "aria-label": "Tag choices",
                children: /* @__PURE__ */ r(Fd, { review: e, onChange: t })
              }
            )
          ] }) }),
          (ce || g) && /* @__PURE__ */ c("div", { className: "dq-drawer-notices", children: [
            g,
            ce && /* @__PURE__ */ c("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ r(Kn, { "aria-hidden": "true" }),
              ce
            ] })
          ] }),
          /* @__PURE__ */ c("footer", { className: "dq-drawer-footer", children: [
            /* @__PURE__ */ r("p", { className: "dq-drawer-dirty", children: p ? f ? "Unsaved changes, including the queue's criteria" : "Unsaved changes" : "" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: s, onClick: H, children: "Cancel" }),
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
    G && /* @__PURE__ */ r(
      Ud,
      {
        onKeepEditing: () => W(!1),
        onDiscard: () => {
          V.current = null, W(!1), N();
        }
      }
    )
  ] });
}
function Kd({
  review: e,
  onChange: t
}) {
  const n = St(), a = e.view, i = (f) => t({ ...e, view: { ...a, ...f } }), o = /* @__PURE__ */ c("label", { className: "dq-checkbox dq-setting-indent", children: [
    /* @__PURE__ */ r(
      "input",
      {
        type: "checkbox",
        checked: a.selectAllOnLoad ?? !1,
        onChange: (f) => i({ selectAllOnLoad: f.target.checked ? !0 : void 0 })
      }
    ),
    "Select every card when a page opens"
  ] });
  if (xe(e) === "tag")
    return /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-cards`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-cards`, children: "Cards" }),
      /* @__PURE__ */ r(
        yo,
        {
          label: "View",
          value: a.displayMode === "list" ? "list" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "list", label: "List" }
          ],
          onChange: (f) => i({ displayMode: f })
        }
      ),
      o,
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "The review opens with these. The Cards / List switch in the header changes only the current visit." })
    ] });
  const s = e.presentation ?? {}, l = (f) => t({ ...e, presentation: { ...s, ...f } }), d = s.annotations ?? [], p = a.reviewMode ?? "single";
  return /* @__PURE__ */ c(pe, { children: [
    /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ c("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ r(
          vo,
          {
            name: `${n}-layout-choice`,
            checked: p === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ r(Gd, {}),
            onChoose: () => i({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ r(
          vo,
          {
            name: `${n}-layout-choice`,
            checked: p === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ r(Bd, {}),
            onChoose: () => i({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ r(
        yo,
        {
          label: "Cards",
          value: a.displayMode === "wall" ? "wall" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "wall", label: "Wall" }
          ],
          onChange: (f) => i({ displayMode: f })
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
        ].map(([f, g]) => /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: d.includes(f),
              onChange: (m) => l({
                annotations: m.target.checked ? [...d, f] : d.filter((N) => N !== f)
              })
            }
          ),
          g
        ] }, f)) })
      ] }),
      d.includes("tags") && /* @__PURE__ */ c("div", { className: "dq-setting-row dq-setting-row-top", children: [
        /* @__PURE__ */ r("span", { className: "dq-setting-name", children: "Tags on cards" }),
        /* @__PURE__ */ c("div", { className: "dq-setting-value", children: [
          /* @__PURE__ */ r(
            An,
            {
              entityType: "tag",
              values: s.annotationParents ?? [],
              onChange: (f) => l({ annotationParents: f }),
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
        An,
        {
          entityType: "tag",
          values: s.binParents ?? [],
          onChange: (f) => l({ binParents: f }),
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
function yo({
  label: e,
  value: t,
  options: n,
  onChange: a
}) {
  const i = St();
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
function vo({
  name: e,
  checked: t,
  title: n,
  text: a,
  picture: i,
  onChoose: o
}) {
  const s = St(), l = St();
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
function Gd() {
  return /* @__PURE__ */ c("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ r("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function Bd() {
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
function Vs({
  name: e,
  description: t,
  entityType: n,
  onBack: a,
  backDisabled: i,
  onEdit: o,
  editDisabled: s,
  editing: l = !1,
  toolbar: d,
  trailing: p,
  chipsStart: f,
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
          children: /* @__PURE__ */ r(Jr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-type", title: _s[n], children: /* @__PURE__ */ r(Us, { entityType: n }) }),
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
          children: /* @__PURE__ */ r(Er, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    d,
    /* @__PURE__ */ r("div", { className: "dq-review-header-trail", children: p }),
    /* @__PURE__ */ r("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    f,
    g && /* @__PURE__ */ r("div", { className: "dq-review-chips-after", children: g }),
    m && /* @__PURE__ */ r("div", { className: "dq-review-chips-end", children: m })
  ] });
}
function Js({
  page: e,
  pages: t,
  onPage: n
}) {
  const [a, i] = k(!1), [o, s] = k(""), l = R(null), d = R(null);
  J(() => {
    var g;
    a && ((g = l.current) == null || g.select());
  }, [a]);
  const p = (g) => {
    i(!1), g && requestAnimationFrame(() => {
      var m;
      return (m = d.current) == null ? void 0 : m.focus();
    });
  }, f = () => {
    const g = Math.round(Number(o));
    p(!0), Number.isFinite(g) && g >= 1 && g !== e && n(Math.min(t, g));
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
        children: /* @__PURE__ */ r(Jr, { "aria-hidden": "true" })
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
          g.key === "Enter" ? (g.preventDefault(), f()) : g.key === "Escape" && (g.preventDefault(), g.stopPropagation(), p(!0));
        },
        onBlur: () => p(!1)
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
        children: /* @__PURE__ */ r(es, { "aria-hidden": "true" })
      }
    )
  ] });
}
function zs({
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
          /* @__PURE__ */ r(tl, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ r(bi, { "aria-hidden": "true" }),
          "Grid"
        ]
      }
    )
  ] });
}
function Vd({
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
function xi({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [a, i] = k(!1), [o, s] = k(!1), l = R(null), d = R(null), p = St();
  cn(() => {
    if (!a || !d.current || !l.current) return;
    const m = l.current.getBoundingClientRect(), N = d.current.offsetHeight + 12, b = window.innerHeight - m.bottom;
    s(b < N && m.top > b);
  }, [a]), J(() => {
    var m, N;
    a && ((N = (m = d.current) == null ? void 0 : m.querySelector('[role="menuitem"]:not(:disabled)')) == null || N.focus({ preventScroll: !0 }));
  }, [a]), J(() => {
    t && i(!1);
  }, [t]);
  const f = (m = !0) => {
    var N;
    i(!1), m && ((N = l.current) == null || N.focus());
  };
  return /* @__PURE__ */ c("div", { className: `dq-menu${a ? " dq-menu-open" : ""}`, onKeyDown: (m) => {
    var q, E;
    if (!a) return;
    const N = [
      ...((q = d.current) == null ? void 0 : q.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], b = N.indexOf(document.activeElement);
    if (m.key === "Escape")
      m.preventDefault(), m.stopPropagation(), f();
    else if (m.key === "Tab")
      f(!1);
    else if (m.key === "ArrowDown" || m.key === "ArrowUp") {
      if (m.preventDefault(), !N.length) return;
      const w = m.key === "ArrowDown" ? 1 : -1;
      N[(b + w + N.length) % N.length].focus();
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
        "aria-controls": a ? p : void 0,
        disabled: t,
        onClick: () => i((m) => !m),
        children: /* @__PURE__ */ r(nl, { "aria-hidden": "true" })
      }
    ),
    a && /* @__PURE__ */ c(pe, { children: [
      /* @__PURE__ */ r("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => f(!1) }),
      /* @__PURE__ */ r(
        "div",
        {
          ref: d,
          id: p,
          role: "menu",
          "aria-label": n,
          className: `dq-menu-list${o ? " dq-menu-list-up" : ""}`,
          children: e.map((m) => /* @__PURE__ */ c(fi, { children: [
            m.separated && /* @__PURE__ */ r("div", { role: "separator", className: "dq-menu-separator" }),
            /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                role: "menuitem",
                className: m.danger ? "dq-menu-danger" : void 0,
                disabled: m.disabled,
                onClick: () => {
                  f(), m.onSelect();
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
function va(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Li(e) {
  return String(e.type).toLowerCase() === "tag";
}
function Di(e) {
  return !!String(e ?? "").trim();
}
function _i(e) {
  return [
    ...new Set(
      va(e.customFieldCriteria).filter(Li).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !Di(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function ji(e, t) {
  const n = va(e.customFieldCriteria);
  if (!n.length) return e;
  let a = !1;
  const i = n.map((o) => {
    if (!Li(o)) return o;
    const s = { ...o };
    for (const [l, d] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const p = t[String(o[l] ?? "")];
      p && !Di(o[d]) && (s[d] = p, a = !0);
    }
    return s;
  });
  return a ? { ...e, customFieldCriteria: i } : e;
}
function Qs(e, t, n) {
  const a = va(e.customFieldCriteria);
  if (!a.length) return e;
  const i = va(n.customFieldCriteria), o = (d, p) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (f) => (d[f] ?? void 0) === (p[f] ?? void 0)
  );
  let s = !1;
  const l = a.map((d) => {
    if (!Li(d)) return d;
    const p = i.find((g) => o(g, d));
    if (!p) return d;
    const f = { ...d };
    for (const [g, m] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const N = t[String(d[g] ?? "")];
      N && d[m] === N && !Di(p[m]) && (delete f[m], s = !0);
    }
    return f;
  });
  return s ? { ...e, customFieldCriteria: l } : e;
}
async function Jd(e, t, n) {
  if (!Tn(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const a = $e(e), i = n.steps.some((l) => kn(l.mode)) ? await zl(a) : "", o = await Ai(n);
  let s = t.applications;
  for (const l of [
    ...o.filter((d) => !kn(d.mode)),
    ...o.filter((d) => kn(d.mode))
  ]) {
    const d = (p) => Ql(
      i,
      a,
      t.media.id,
      t.performer.id,
      l.tagIds,
      p
    );
    (l.mode === "MARK_PRESENT" || l.mode === "CLEAR_ABSENCE") && await d("REMOVE"), l.mode !== "CLEAR_ABSENCE" && (s = await Xs(
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
async function Ui(e, t) {
  const n = e.occurrence;
  if (Ni(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const a = /* @__PURE__ */ new Set(), { _filterExpression: i, ...o } = n.performerFilter;
  for (let s = 1; ; s++) {
    const l = await se("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Rn({
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
function Ws(e) {
  return jr(e.condition) && e.hideConfirmedAbsent !== !1;
}
function Ki(e, t) {
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
  }, s = Ws(i) && (t == null ? void 0 : t.length) === 1 && i.conditionTagIds.length === 1 ? `${t[0]}:${i.conditionTagIds[0]}` : null;
  return {
    ...e,
    entityType: $e(e),
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
                      key: Ea,
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
async function Gi(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => Ca([n], t))
  );
}
function Hs(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function zd(e, t, n = e.conditionTagIds.map((a) => [a])) {
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
function Qd(e, t, n, a, i) {
  if (!Ws(e)) return !1;
  const o = ys(t, n);
  return e.conditionTagIds.every(
    (s, l) => o.includes(s) || i[l].some((d) => a.includes(d))
  );
}
async function Ys(e, t, n, a) {
  if ((t == null ? void 0 : t.length) === 0 || Hs(e.occurrence))
    return { items: [], totalCount: 0 };
  const i = $e(e), o = await Lr(
    Ki(e, t),
    { ...e.view.filter, page: n },
    a
  ), s = t === null ? null : new Set(t), l = e.occurrence, d = o.items.length ? await Gi(l, a) : [], p = new Array(o.items.length);
  let f = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, o.items.length) }, async () => {
      for (; f < o.items.length; ) {
        const g = f++, m = o.items[g], N = await se(
          `/api/tagapplications?hostType=${i}&hostId=${m.id}&contextType=performer`,
          { signal: a }
        );
        p[g] = m.performers.filter((b) => s === null || s.has(b.id)).flatMap((b) => {
          const q = N.filter(
            (w) => w.hostType === i && w.hostId === m.id && w.contextType === "performer" && w.contextId === b.id
          ), E = q.map((w) => w.tag.id);
          return zd(e.occurrence, E, d) && !Qd(l, m, b.id, E, d) ? [
            {
              key: `${m.id}:${b.id}`,
              media: m,
              performer: b,
              applications: q
            }
          ] : [];
        });
      }
    })
  ), { items: p.flat(), totalCount: o.totalCount };
}
async function Xs(e, t, n) {
  const a = new Set(e.occurrence.tagIds);
  if (n.some((p) => !a.has(p)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const i = $e(e), o = await Za(i, t.media.id);
  if (!o.performers.some(
    (p) => p.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${i}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${i}&hostId=${o.id}&contextType=performer&contextId=${t.performer.id}`, l = (await se(s)).filter(
    (p) => p.hostType === i && p.hostId === o.id && p.contextType === "performer" && p.contextId === t.performer.id
  ), d = new Set(n);
  try {
    for (const p of d)
      l.some((f) => f.tag.id === p) || await se("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: i,
          hostId: o.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: p,
          sourceKey: "user"
        })
      });
    for (const p of l)
      a.has(p.tag.id) && !d.has(p.tag.id) && await se(`/api/tagapplications/${p.id}`, {
        method: "DELETE"
      });
    return await se(s);
  } catch (p) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${p instanceof Error ? p.message : "Request failed."}`
    );
  }
}
function Cr(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function Wd(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function sn(e, t, n = !0) {
  var l;
  if (t.occurrence) {
    const d = n ? ys(
      await Za(e, t.media.id),
      t.occurrence.performer.id
    ) : [], p = (await se(Wd(e, t))).filter(
      (f) => f.hostType === e && f.hostId === t.media.id && f.contextType === "performer" && f.contextId === t.occurrence.performer.id
    );
    return ri(p.map((f) => f.tag)), {
      ids: [...new Set(p.map((f) => f.tag.id))],
      names: [...new Set(p.map((f) => f.tag.name))],
      absent: d,
      applications: p
    };
  }
  const a = await Za(e, t.media.id), i = (a.tags ?? []).filter(
    (d) => d.canRemove !== !1 || d.isDerived !== !0
  );
  ri(i);
  const o = Object.keys(a.customFields ?? {}).find(
    (d) => d.toLowerCase() === ba
  ) ?? ba, s = ((l = a.customFields) == null ? void 0 : l[o]) ?? [];
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
async function Bi(e, t, n) {
  if (t.occurrence && Ae(e))
    await Xs(
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
      i.length && await se(
        `/api/${Qn($e(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: a, tagIds: i })
        }
      );
}
async function Hd(e, t, n) {
  t.occurrence && Ae(e) ? await Jd(e, t.occurrence, n) : await vs($e(e), n, [t.media.id]);
}
function ai(e, t, n, a) {
  const i = (o) => o.filter((s) => a.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: Cr(i(t.ids), i(n.ids)),
    absence: Cr(i(t.absent), i(n.absent))
  };
}
function Yd(e, t) {
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
class Zs extends Error {
}
const ii = (e) => e instanceof Error ? e.message : "Request failed.", No = (e) => [...e].sort((t, n) => t - n), Gr = (e, t) => JSON.stringify(No(e)) === JSON.stringify(No(t)), oi = (e) => !!(e.tags.added.length || e.tags.removed.length);
function Na(e, t, n, a) {
  const i = new Set(e), o = new Set(e);
  for (const f of t.steps)
    for (const g of f.tagIds)
      f.mode === "ADD" ? o.add(g) : o.delete(g);
  const s = e.some((f) => !o.has(f));
  if (s && !a)
    return { desired: [...e], conflict: s, skipped: !0, kept: [], replaced: [] };
  const l = new Set(
    t.steps.filter((f) => f.mode === "ADD").flatMap((f) => f.tagIds)
  ), d = [], p = [];
  for (const f of n) {
    const g = f.filter((N) => o.has(N) && !i.has(N)), m = f.filter(
      (N) => o.has(N) && i.has(N) && !l.has(N)
    );
    !g.length || !m.length || (a ? (m.forEach((N) => o.delete(N)), p.push(...m)) : (g.forEach((N) => o.delete(N)), d.push({ tagIds: g, existing: m })));
  }
  return { desired: [...o], conflict: s, skipped: !1, kept: d, replaced: p };
}
function Xd(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function Zd(e, t, n, a) {
  for (const [i, o] of n.entries()) {
    const s = t.filter(
      (p) => p.steps.some(
        (f) => f.mode === "ADD" && f.tagIds.some((g) => o.includes(g))
      )
    );
    if (s.length < 2) continue;
    const l = e.occurrence.conditionTagIds[i];
    let d = `tag ${l}`;
    try {
      d = (await se(`/api/tags/${l}`, { signal: a })).name;
    } catch {
      a.throwIfAborted();
    }
    throw new Zs(
      `${s.map((p) => p.label).join(" and ")} answer the same condition tag, ${d}. Choose one of them.`
    );
  }
}
async function eu(e, t, n, a = () => {
}) {
  if (!t.length || t.some(
    (m) => !Tn(m, e.entityType) || !m.steps.length || m.steps.some(
      (N) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(N.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), o = structuredClone(t), s = jr(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await Gi(i.occurrence, n) : [];
  await Zd(i, o, s, n);
  const l = await Promise.all(
    o.map(async (m) => ({
      ...m,
      steps: await Ai(m, n)
    }))
  ), d = structuredClone(Xd(l));
  n.throwIfAborted();
  const p = [
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
  const f = await Ui(i, n), g = /* @__PURE__ */ new Map();
  for (let m = 1; ; m++) {
    n.throwIfAborted();
    const N = await Ys(i, f, m, n);
    for (const b of N.items) {
      const q = {
        ids: [...new Set(b.applications.map((w) => w.tag.id))],
        names: b.applications.map((w) => w.tag.name),
        absent: [],
        applications: b.applications
      }, E = Na(q.ids, d, s, !0);
      g.set(b.key, {
        item: { key: b.key, media: b.media, occurrence: b },
        before: q,
        expected: q,
        conflict: E.conflict,
        status: Gr(q.ids, E.desired) ? "unchanged" : "pending"
      });
    }
    if (a(g.size), m * 250 >= N.totalCount) break;
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
    touched: p,
    entries: [...g.values()]
  };
}
function tu(e, t, n) {
  const a = (o) => o.ids.filter((s) => n.includes(s));
  if (!Gr(a(e), a(t))) return !1;
  const i = (o) => (o.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return Gr(i(e), i(t));
}
async function ec(e, t, n, a) {
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
function tc(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function nc(e) {
  return e.entries.filter((t) => t.operation);
}
async function nu(e, t, n, a, i = !1) {
  await ec(
    tc(e, i),
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
        if (s = await sn($e(e.review), o.item, !1), !tu(o.expected, s, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (m) {
        o.status = "failed", o.error = ii(m);
        return;
      }
      const l = Na(
        o.before.ids,
        e.action,
        e.categories,
        t
      ), d = [
        ...s.ids.filter((m) => !e.touched.includes(m)),
        ...l.desired.filter((m) => e.touched.includes(m))
      ], p = Cr(s.ids, d);
      if (!p.added.length && !p.removed.length) {
        const m = !o.operation && l.kept.length > 0;
        o.status = o.operation ? "changed" : m ? "skipped" : "unchanged", o.error = m ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let f;
      try {
        await Bi(e.review, o.item, p);
      } catch (m) {
        f = m;
      }
      let g = !1;
      try {
        const m = await sn($e(e.review), o.item, !1);
        g = !0, o.expected = m;
        const N = ai(
          o.item,
          o.before,
          m,
          e.touched
        );
        if (o.operation = oi(N) ? N : void 0, f) throw f;
        if (!Gr(
          m.ids.filter((b) => e.touched.includes(b)),
          d.filter((b) => e.touched.includes(b))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (m) {
        if (o.status = "failed", o.error = ii(m), !g)
          try {
            const N = await sn($e(e.review), o.item, !1);
            o.expected = N;
            const b = ai(
              o.item,
              o.before,
              N,
              e.touched
            );
            o.operation = oi(b) ? b : void 0;
          } catch {
            o.unverified = !0;
          }
      }
    },
    a
  );
}
async function ru(e, t, n) {
  await ec(
    nc(e),
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
        const l = await sn($e(e.review), a.item, !1);
        Yd(i, l), s = !0, await Bi(e.review, a.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const d = await sn($e(e.review), a.item, !1);
        if (!Gr(
          d.ids.filter((p) => o.includes(p)),
          a.before.ids.filter((p) => o.includes(p))
        ))
          throw new Error("Undo did not restore all affected tags.");
        a.operation = void 0, a.expected = d, a.status = "unchanged", a.error = void 0;
      } catch (l) {
        if (a.error = `Undo stopped: ${ii(l)}`, a.status = "failed", s)
          try {
            const d = await sn($e(e.review), a.item, !1), p = ai(
              a.item,
              a.before,
              d,
              o
            );
            a.operation = oi(p) ? p : void 0, a.expected = d;
          } catch {
            a.unverified = !0;
          }
      }
    },
    n
  );
}
async function au(e, t, n) {
  const a = $e(e), i = e.occurrence, [o, s] = await Promise.all([
    se(
      `/api/tagapplications?hostType=${a}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    Gi(i, n)
  ]), l = o.filter(
    (b) => b.hostType === a && b.contextType === "performer" && b.contextId === t
  );
  ri(l.map((b) => b.tag));
  const d = await Promise.all(
    s.map(async (b, q) => {
      const E = i.conditionTagIds[q];
      return (await se(`/api/tags/${E}`, { signal: n })).name;
    })
  ), p = new Set(s.flat()), f = new Set(
    [
      ...e.actions.flatMap((b) => b.steps).filter((b) => b.mode === "ADD" || b.mode === "MARK_PRESENT").flatMap((b) => b.tagIds),
      ...i.tagIds
    ].filter((b) => !p.has(b))
  ), g = (b) => {
    const q = /* @__PURE__ */ new Map();
    for (const E of l) {
      if (!b.has(E.tag.id)) continue;
      const w = q.get(E.tag.id) ?? {
        tag: E.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      w.hosts.add(E.hostId), q.set(E.tag.id, w);
    }
    return [...q.values()].map((E) => ({ ...E.tag, count: E.hosts.size })).sort((E, w) => w.count - E.count || As(E, w));
  }, m = s.map((b, q) => ({
    id: i.conditionTagIds[q],
    name: d[q],
    tags: g(new Set(b))
  }));
  f.size && m.push({
    id: null,
    name: s.length ? "Other review tags" : "Review tags",
    tags: g(f)
  });
  const N = /* @__PURE__ */ new Set([...p, ...f]);
  return {
    answered: new Set(
      l.filter((b) => N.has(b.tag.id)).map((b) => b.hostId)
    ).size,
    groups: m
  };
}
const rc = _c(!1);
function iu({ children: e }) {
  return /* @__PURE__ */ r(rc.Provider, { value: !0, children: e });
}
function Yt({ tag: e, name: t }) {
  const n = jc(rc), a = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ r(Gc, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: a ?? void 0 });
}
const qo = { summary: null, error: "" };
function ac(e, t, n = 0) {
  const [a, i] = k(qo), o = e.occurrence, s = JSON.stringify([
    e.entityType,
    t,
    o.condition,
    o.conditionTagIds,
    o.includeSubtags,
    o.tagIds,
    e.actions.map((l) => l.steps)
  ]);
  return J(() => {
    if (i(qo), t === null) return;
    const l = new AbortController();
    return au(e, t, l.signal).then((d) => {
      l.signal.aborted || i({ summary: d, error: "" });
    }).catch((d) => {
      l.signal.aborted || i({
        summary: null,
        error: d instanceof Error ? d.message : "Request failed."
      });
    }), () => l.abort();
  }, [s, n]), a;
}
function ou({
  review: e,
  performerId: t,
  revision: n = 0
}) {
  const a = ac(e, t, n);
  return /* @__PURE__ */ r(si, { ...a, mediaKind: $e(e) });
}
function si({
  summary: e,
  error: t,
  mediaKind: n,
  className: a = ""
}) {
  const i = gn(n), o = (s) => `${s.toLocaleString()} ${s === 1 ? i.one : i.many}`;
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
            /* @__PURE__ */ r(Yt, { tag: l }),
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
function qr({
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
const So = 5;
function su(e, t) {
  return Promise.all(
    e.map(async (n) => {
      try {
        return (await se(`/api/performers/${n}`, { signal: t })).name;
      } catch {
        return t.throwIfAborted(), `Performer ${n}`;
      }
    })
  );
}
function cu(e, t) {
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
const Eo = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), ci = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], Co = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], lu = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, Ga = 250;
function xr(e, t) {
  var a, i;
  const n = e.item.media;
  return n.title || ((i = (a = n.files) == null ? void 0 : a[0]) == null ? void 0 : i.basename) || (t === "audio" ? "Audio" : "Scene");
}
function du({ step: e }) {
  const t = ci.findIndex((n) => n.id === e);
  return /* @__PURE__ */ r("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: ci.map((n, a) => {
    const i = a < t ? "done" : a === t ? "current" : "next";
    return /* @__PURE__ */ c("li", { "data-state": i, "aria-current": i === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: i === "done" ? /* @__PURE__ */ r(wi, {}) : a + 1 }),
      n.label,
      i === "done" && /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function ko({ parts: e, id: t }) {
  return /* @__PURE__ */ r("span", { className: "dq-batch-effect", id: t, children: e.map((n, a) => /* @__PURE__ */ c(fi, { children: [
    a > 0 && " ",
    /* @__PURE__ */ r("span", { "data-effect-tone": n.tone, children: n.text })
  ] }, a)) });
}
function Pr({
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
        n && /* @__PURE__ */ c(pe, { children: [
          " ",
          /* @__PURE__ */ r("span", { className: "dq-batch-stat-detail", children: n })
        ] })
      ]
    }
  );
}
function Ao({
  added: e,
  removed: t,
  tag: n,
  label: a
}) {
  return /* @__PURE__ */ c("ul", { className: "dq-tags", "aria-label": a, children: [
    dr(e.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ c("ins", { children: [
      "+ ",
      /* @__PURE__ */ r(Yt, { tag: i })
    ] }) }, `added-${i.id}`)),
    dr(t.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ c("del", { children: [
      "− ",
      /* @__PURE__ */ r(Yt, { tag: i })
    ] }) }, `removed-${i.id}`))
  ] });
}
function To({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: a,
  describe: i
}) {
  return /* @__PURE__ */ c("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: e }),
      t.length > Ga && /* @__PURE__ */ c("span", { children: [
        "First ",
        Ga.toLocaleString(),
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
      /* @__PURE__ */ r("tbody", { children: t.slice(0, Ga).map((o) => {
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
                xr(o, n)
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
function uu(e) {
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
function fu({
  review: e,
  disabled: t,
  performerFlags: n = [],
  trees: a,
  onOpen: i,
  onClose: o,
  onWrite: s
}) {
  const [l, d] = k(!1), [p, f] = k("answers"), [g, m] = k(null), [N, b] = k({}), [q, E] = k([]), [w, I] = k(!1), [x, _] = k(!1), [K, U] = k(""), [te, G] = k(!1), [W, V] = k(""), [F, D] = k(null), [v, T] = k(null), [Y, H] = k([]), [de, ce] = k(0), B = R(null), A = R(null), j = R(null), Z = R(!1), qe = R(!1), Ne = R(null), ft = R(!1), it = R(0), wt = R(!1), Ot = R({ onClose: o, onWrite: s });
  Ot.current = { onClose: o, onWrite: s };
  const Ye = St(), Be = p === "run", Xt = (F == null ? void 0 : F.kind) === "undo", Te = Be && g ? g.review : e, bn = kr(Te.actions), le = Te.occurrence, je = $e(Te), yt = gn(je), ln = yt.queue, Ie = Be && g ? g.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((C) => C.steps.length && !Jn(C))
  ), tt = Ie.filter((C) => q.includes(C.id)), Se = le.targetMode === "selected" && le.performerIds.length === 1, ht = ac(
    Te,
    l && Se ? le.performerIds[0] : null,
    de
  ), Lt = _i(Te.view.objectFilter), Re = $i(
    l ? [...ka(Ie), ...le.conditionTagIds, ...Lt] : []
  ), wn = Ce(() => ks(Re), [Re]), nt = (C) => N[C] ?? Re[C] ?? { id: C, name: `Tag ${C}` }, It = JSON.stringify(
    Object.fromEntries(
      Lt.flatMap((C) => {
        var re;
        const M = (re = Re[C]) == null ? void 0 : re.name;
        return M ? [[String(C), M]] : [];
      })
    )
  ), ot = Ce(
    () => ji(Te.view.objectFilter, JSON.parse(It)),
    [Te.view.objectFilter, It]
  );
  J(() => {
    var C, M, re;
    l && ((C = B.current) == null || C.showModal(), (re = (M = B.current) == null ? void 0 : M.querySelector(".dq-batch-answer input")) == null || re.focus());
  }, [l]), J(() => {
    if (!l) return;
    const C = requestAnimationFrame(() => {
      var Ee;
      const M = B.current, re = document.activeElement;
      if (!M || re && re !== document.body && M.contains(re)) return;
      (Ee = (p === "answers" ? M.querySelector(".dq-batch-answer input:checked") ?? M.querySelector(".dq-batch-answer input") : M.querySelector("[data-batch-focus]")) ?? A.current) == null || Ee.focus();
    });
    return () => cancelAnimationFrame(C);
  }, [l, p, x, g]), J(() => {
    if (l || t || !Z.current) return;
    const C = requestAnimationFrame(() => {
      const M = j.current;
      if (!Z.current || !M || M.disabled) return;
      Z.current = !1;
      const re = document.activeElement;
      (!re || re === document.body) && M.focus();
    });
    return () => cancelAnimationFrame(C);
  }, [l, t]), J(() => {
    if (!l || le.targetMode !== "selected") return;
    const C = new AbortController();
    return H([]), su(le.performerIds.slice(0, So), C.signal).then((M) => {
      C.signal.aborted || H(M);
    }).catch(() => {
    }), () => C.abort();
  }, [l, le.targetMode, JSON.stringify(le.performerIds)]), J(
    () => () => {
      var C;
      qe.current = !0, (C = Ne.current) == null || C.abort();
    },
    []
  ), J(() => {
    if (!x) return;
    const C = (M) => {
      M.preventDefault(), M.returnValue = "";
    };
    return window.addEventListener("beforeunload", C), () => window.removeEventListener("beforeunload", C);
  }, [x]);
  function Dt() {
    f("answers"), m(null), b({}), D(null), I(!1), E([]), V(""), U(""), G(!1), T(null);
  }
  function pt() {
    wt.current || (d(!1), Ot.current.onClose(ft.current), ft.current = !1, Dt(), Z.current = !0);
  }
  function Wn(C, M) {
    E(
      (re) => M ? [...re, C] : re.filter((ee) => ee !== C)
    ), m(null), b({}), V(""), U(""), G(!1), T(null);
  }
  function Et() {
    f("answers"), T(null), V("");
  }
  function yn() {
    f("preview"), g || ge();
  }
  function _t() {
    var C;
    qe.current = !0, (C = Ne.current) == null || C.abort(), V("Stopping after in-flight operations settle…");
  }
  function $t(C) {
    T(
      (M) => (M == null ? void 0 : M.group) === C.group && M.reason === C.reason ? null : C
    );
  }
  const dn = (C, M) => (v == null ? void 0 : v.group) === C && v.reason === M;
  async function ge() {
    if (!tt.length || wt.current) return;
    wt.current = !0, _(!0), U(""), G(!1), V("Loading all matching occurrences…"), m(null), b({}), T(null);
    const C = new AbortController();
    Ne.current = C;
    try {
      await cu(it.current, C.signal);
      const M = await eu(
        e,
        tt,
        C.signal,
        (ee) => V(`Loaded ${ee.toLocaleString()} matching occurrences…`)
      );
      C.signal.throwIfAborted();
      const re = {};
      for (const ee of M.entries)
        for (const Ee of ee.before.applications ?? [])
          re[Ee.tag.id] = Ee.tag;
      b(re), m(M), V("Preview ready. No tags have been changed.");
    } catch (M) {
      U(
        C.signal.aborted ? "Preview cancelled. No tags were changed." : M instanceof Error ? M.message : String(M)
      ), G(!C.signal.aborted && M instanceof Zs), V("");
    } finally {
      wt.current = !1, _(!1), Ne.current = null;
    }
  }
  async function vt(C) {
    if (!g || wt.current) return;
    const M = (C === "undo" ? nc(g) : tc(g, C === "retry")).length;
    wt.current = !0, qe.current = !1, ft.current = !0, Ot.current.onWrite(), _(!0), f("run"), U(""), D({ kind: C, total: M, done: 0, stopped: !1 }), V(
      C === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const re = () => D((Ee) => Ee && { ...Ee, done: Ee.done + 1 });
    let ee = !1;
    try {
      C === "undo" ? await ru(g, () => qe.current, re) : await nu(g, w, () => qe.current, re, C === "retry"), V(
        qe.current ? "Stopped after in-flight operations settled. Completed changes are retained." : C === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (Ee) {
      ee = !0, V(""), U(Ee instanceof Error ? Ee.message : String(Ee));
    } finally {
      it.current = Date.now(), wt.current = !1;
      const Ee = qe.current || ee;
      D((we) => we && { ...we, stopped: Ee }), _(!1), ce((we) => we + 1);
    }
  }
  const Xe = (g == null ? void 0 : g.entries) ?? [], On = Ce(
    () => new Map(
      ((g == null ? void 0 : g.entries) ?? []).map((C) => [
        C.item.key,
        Na(C.before.ids, g.action, g.categories, w)
      ])
    ),
    [g, w]
  ), jt = (C) => On.get(C.item.key), Le = (C) => Cr(C.before.ids, jt(C).desired), Ct = (C) => {
    const M = Le(C);
    return C.status === "pending" && (M.added.length > 0 || M.removed.length > 0);
  }, ne = (C) => C.conflict || jt(C).kept.length > 0 || jt(C).replaced.length > 0, $ = Ce(() => {
    const C = (g == null ? void 0 : g.entries) ?? [];
    return {
      willChange: C.filter(Ct).length,
      correct: C.filter((M) => M.status === "unchanged").length,
      different: C.filter(ne).length,
      hosts: new Set(C.map((M) => M.item.media.id)).size,
      added: [...new Set(C.flatMap((M) => Le(M).added))],
      removed: [...new Set(C.flatMap((M) => Le(M).removed))]
    };
  }, [On]), ye = Ce(
    () => ((g == null ? void 0 : g.entries) ?? []).filter((C) => C.item.media.date).sort((C, M) => C.item.media.date.localeCompare(M.item.media.date)),
    [g]
  ), st = Be ? uu(Xe) : null, In = (C) => bn.keys[Te.actions.findIndex((M) => M.id === C)] ?? "", oe = (C) => zn(C, wn, [], a), kt = jr(le.condition) && le.includeSubtags !== !1 && le.conditionTagIds.length > 0, Qe = ye[0], De = ye.length > 1 ? ye[ye.length - 1] : void 0, We = (C) => `/${je}/${C.item.media.id}`, Ut = Se ? Y[0] : void 0, He = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: Ct },
    correct: { title: "Occurrences already correct", test: (C) => C.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: ne }
  };
  function mt() {
    const C = lu[le.condition], M = !!C && le.conditionTagIds.length > 0, re = le.performerIds.slice(0, So), ee = String(Te.view.filter.q ?? "").trim(), Ee = le.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ c("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      Ni(le) ? /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "All performers" }) : le.targetMode === "selected" ? /* @__PURE__ */ c(pe, { children: [
        re.map((we, Me) => /* @__PURE__ */ c("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ r(qr, { performer: { id: we, name: Y[Me] ?? "" } }),
          Y[Me] ?? "…"
        ] }, we)),
        le.performerIds.length > re.length && /* @__PURE__ */ c("span", { className: "dq-batch-chip", children: [
          (le.performerIds.length - re.length).toLocaleString(),
          " more performers"
        ] })
      ] }) : /* @__PURE__ */ c(pe, { children: [
        /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "Performer criteria" }),
        /* @__PURE__ */ r(
          "fieldset",
          {
            className: "dq-batch-filter-summary",
            disabled: !0,
            "aria-label": "Batch performer criteria",
            children: /* @__PURE__ */ r(
              _r,
              {
                filter: {},
                objectFilter: le.performerFilter,
                criteriaDefinitions: hi,
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
        M ? C : yi[le.condition],
        M && /* @__PURE__ */ r("span", { className: "dq-batch-chip-tags", children: dr(le.conditionTagIds.map(nt)).map((we) => /* @__PURE__ */ r(Yt, { tag: we }, we.id)) })
      ] }),
      M && /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: le.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      jr(le.condition) && le.hideConfirmedAbsent !== !1 && /* @__PURE__ */ c("span", { className: "dq-batch-chip", title: Ee, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
          ": ",
          Ee
        ] })
      ] }),
      ee && /* @__PURE__ */ c("span", { className: "dq-batch-chip", children: [
        "Search “",
        ee,
        "”"
      ] }),
      Object.keys(Te.view.objectFilter).length > 0 && /* @__PURE__ */ r(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${ln} filters`,
          children: /* @__PURE__ */ r(
            _r,
            {
              filter: Te.view.filter,
              objectFilter: ot,
              criteriaDefinitions: je === "audio" ? Go : pi,
              customFieldEntityType: je,
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
  function Mt(C) {
    return n.length ? /* @__PURE__ */ c("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ r(ma, { "aria-hidden": "true" }),
      /* @__PURE__ */ c("div", { children: [
        /* @__PURE__ */ c("p", { children: [
          /* @__PURE__ */ r("strong", { children: Ut || "This performer" }),
          " is flagged:",
          " ",
          /* @__PURE__ */ r("strong", { children: n.join(", ") }),
          ". Check the earliest and latest",
          " ",
          yt.many,
          " before applying, or narrow the batch with a date filter."
        ] }),
        C && Qe && /* @__PURE__ */ c("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ c("a", { href: We(Qe), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            xr(Qe, je),
            " · ",
            Qe.item.media.date
          ] }),
          De && /* @__PURE__ */ c("a", { href: We(De), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            xr(De, je),
            " · ",
            De.item.media.date
          ] })
        ] })
      ] })
    ] }) : null;
  }
  function Zt() {
    return /* @__PURE__ */ c(pe, { children: [
      mt(),
      Mt(!1),
      /* @__PURE__ */ c("div", { className: `dq-batch-pick${Se ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ c("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ r("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ r("div", { className: "dq-batch-answers", children: Ie.map((C, M) => {
            const re = In(C.id);
            return /* @__PURE__ */ c("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ r(
                "input",
                {
                  type: "checkbox",
                  checked: q.includes(C.id),
                  "aria-labelledby": `${Ye}-answer-${M}`,
                  "aria-describedby": `${Ye}-effect-${M}`,
                  onChange: (ee) => Wn(C.id, ee.target.checked)
                }
              ),
              /* @__PURE__ */ r("span", { className: "dq-batch-answer-key", children: re && /* @__PURE__ */ r(et, { binding: re, hidden: !0 }) }),
              /* @__PURE__ */ c("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ r(
                  "span",
                  {
                    id: `${Ye}-answer-${M}`,
                    className: "dq-batch-answer-label",
                    title: C.label,
                    children: C.label
                  }
                ),
                /* @__PURE__ */ r(ko, { id: `${Ye}-effect-${M}`, parts: oe(C) })
              ] })
            ] }, C.id);
          }) })
        ] }),
        Se && /* @__PURE__ */ r(si, { ...ht, mediaKind: je, className: "dq-batch-card" })
      ] })
    ] });
  }
  function rt(C) {
    const M = $, re = v && Eo.has(v.group) ? v.group : null, ee = re ? Xe.filter(He[re].test) : [], Ee = (we) => {
      const Me = jt(we), _e = Me.skipped ? Cr(
        we.before.ids,
        Na(we.before.ids, C.action, C.categories, !0).desired
      ) : Le(we), At = !_e.added.length && !_e.removed.length;
      return /* @__PURE__ */ c("div", { className: "dq-batch-plan", children: [
        Me.skipped && /* @__PURE__ */ r("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        At ? !Me.kept.length && /* @__PURE__ */ r("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ r(Ao, { added: _e.added, removed: _e.removed, tag: nt }),
        Me.kept.map((ve, en) => /* @__PURE__ */ c("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          dr(ve.existing.map(nt)).map((ue) => /* @__PURE__ */ r(Yt, { tag: ue }, ue.id)),
          " ",
          "instead of",
          " ",
          dr(ve.tagIds.map(nt)).map((ue) => /* @__PURE__ */ r(Yt, { tag: ue }, ue.id))
        ] }, en))
      ] });
    };
    return /* @__PURE__ */ c(pe, { children: [
      /* @__PURE__ */ c("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ c("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ r(
            Pr,
            {
              value: Xe.length,
              label: Xe.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${M.hosts.toLocaleString()} ${M.hosts === 1 ? ln : `${ln}s`}`,
              pressed: dn("matching"),
              onToggle: () => $t({ group: "matching" })
            }
          ),
          /* @__PURE__ */ r(
            Pr,
            {
              value: M.willChange,
              label: "will change",
              tone: "add",
              pressed: dn("change"),
              onToggle: () => $t({ group: "change" })
            }
          ),
          /* @__PURE__ */ r(
            Pr,
            {
              value: M.correct,
              label: "already correct, no write",
              pressed: dn("correct"),
              onToggle: () => $t({ group: "correct" })
            }
          ),
          /* @__PURE__ */ r(
            Pr,
            {
              value: M.different,
              label: w ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: dn("different"),
              onToggle: () => $t({ group: "different" })
            }
          )
        ] }),
        ee.length > 0 ? /* @__PURE__ */ r(
          To,
          {
            title: He[re].title,
            entries: ee,
            mediaKind: je,
            resultHeading: "Planned change",
            describe: Ee
          }
        ) : Xe.length > 0 && /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        Xe.length > 0 && /* @__PURE__ */ c("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ r("span", { children: Qe ? `Dates ${Qe.item.media.date}${De ? ` to ${De.item.media.date}` : ""}` : "No dates" }),
          Qe && /* @__PURE__ */ r(
            "a",
            {
              href: We(Qe),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${yt.one}, ${Qe.item.media.date}`,
              title: xr(Qe, je),
              children: "Open earliest"
            }
          ),
          De && /* @__PURE__ */ r(
            "a",
            {
              href: We(De),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${yt.one}, ${De.item.media.date}`,
              title: xr(De, je),
              children: "Open latest"
            }
          ),
          ye.length < Xe.length && /* @__PURE__ */ c("span", { children: [
            (Xe.length - ye.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (M.added.length > 0 || M.removed.length > 0) && /* @__PURE__ */ c("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ r("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ r(
            Ao,
            {
              added: M.added,
              removed: M.removed,
              tag: nt,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      M.different > 0 && /* @__PURE__ */ c("div", { className: "dq-batch-choice", children: [
        /* @__PURE__ */ r("span", { id: `${Ye}-choice`, className: "dq-batch-choice-label", children: "Occurrences with a different answer" }),
        /* @__PURE__ */ c(
          "div",
          {
            className: "dq-segmented dq-segmented-fill",
            role: "group",
            "aria-labelledby": `${Ye}-choice`,
            children: [
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": !w, onClick: () => I(!1), children: "Keep their answer" }),
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": w, onClick: () => I(!0), children: "Replace it" })
            ]
          }
        ),
        /* @__PURE__ */ c("p", { className: "dq-muted", children: [
          "A different answer is a tag the chosen answers would remove",
          kt ? ", or another answer already in a condition category (each condition tag with its subtags); keeping it still fills the empty categories" : "",
          ". Configure opposite answers as removals."
        ] })
      ] })
    ] });
  }
  function pr() {
    return /* @__PURE__ */ c(pe, { children: [
      mt(),
      Mt(!0),
      /* @__PURE__ */ c("div", { className: `dq-batch-cards${Se ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ c("section", { className: "dq-batch-card", "aria-labelledby": `${Ye}-chosen`, children: [
          /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ r("h3", { id: `${Ye}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", disabled: x, onClick: Et, children: "Change" })
          ] }),
          /* @__PURE__ */ r("ul", { className: "dq-batch-chosen", children: tt.map((C) => {
            const M = In(C.id);
            return /* @__PURE__ */ c("li", { children: [
              /* @__PURE__ */ c("span", { className: "dq-batch-chosen-chip", children: [
                M && /* @__PURE__ */ r(et, { binding: M, hidden: !0 }),
                C.label
              ] }),
              /* @__PURE__ */ r(ko, { parts: oe(C) })
            ] }, C.id);
          }) })
        ] }),
        Se && /* @__PURE__ */ r(si, { ...ht, mediaKind: je, className: "dq-batch-card" })
      ] }),
      x ? /* @__PURE__ */ r("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ r("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ r("span", {}) }) }) : g && rt(g)
    ] });
  }
  function Kt(C) {
    const M = F ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, re = M.kind === "apply" ? Xe.length - C.counts.pending : M.done, ee = M.kind === "apply" ? Xe.length : M.total, Ee = x ? M.kind === "undo" ? "Undoing batch…" : M.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : M.kind === "undo" ? M.stopped ? "Undo stopped" : "Undo finished" : M.stopped ? "Stopped" : "Finished", we = ee ? Math.round(re / ee * 100) : 100, Me = v && !Eo.has(v.group) ? v.group : null, _e = (ve) => Co.find((en) => en.status === ve).label, At = Me ? Xe.filter(
      (ve) => ve.status === Me && (!v.reason || ve.error === v.reason)
    ) : [];
    return /* @__PURE__ */ c(pe, { children: [
      /* @__PURE__ */ c("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ r("h3", { tabIndex: -1, "data-batch-focus": "", children: Ee }),
          /* @__PURE__ */ c("span", { children: [
            re.toLocaleString(),
            " of ",
            ee.toLocaleString(),
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
            "aria-valuemax": ee,
            "aria-valuenow": re,
            children: /* @__PURE__ */ r("span", { style: { width: `${we}%` } })
          }
        ),
        !x && M.kind === "undo" && /* @__PURE__ */ c("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (M.total - C.recorded).toLocaleString(),
          " of",
          " ",
          M.total.toLocaleString(),
          " ",
          M.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ c("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ r("div", { className: "dq-batch-stats", "data-count": "5", children: Co.map((ve) => /* @__PURE__ */ r(
          Pr,
          {
            value: C.counts[ve.status],
            label: ve.label,
            tone: ve.tone,
            pressed: dn(ve.status),
            onToggle: () => $t({ group: ve.status })
          },
          ve.status
        )) }),
        C.reasons.length > 0 && /* @__PURE__ */ r("ul", { className: "dq-batch-reasons", children: C.reasons.map((ve) => {
          const en = dn(ve.status, ve.error);
          return /* @__PURE__ */ c("li", { children: [
            /* @__PURE__ */ c("span", { children: [
              ve.count.toLocaleString(),
              " ",
              ve.status,
              ": ",
              ve.error
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-link-button",
                "aria-expanded": en,
                onClick: () => $t({ group: ve.status, reason: ve.error }),
                children: en ? "Hide them" : "Show them"
              }
            )
          ] }, `${ve.status}-${ve.error}`);
        }) }),
        At.length > 0 ? /* @__PURE__ */ r(
          To,
          {
            title: v.reason ? `${_e(Me)}: ${v.reason}` : `${_e(Me)} occurrences`,
            entries: At,
            mediaKind: je,
            resultHeading: "Result",
            describe: (ve) => ve.error ?? _e(ve.status)
          }
        ) : /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." })
      ] }),
      C.recorded > 0 && /* @__PURE__ */ c("div", { className: "dq-batch-undo", children: [
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: x,
            onClick: () => void vt("undo"),
            children: [
              /* @__PURE__ */ r(rl, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ c("p", { children: [
          Xt ? M.stopped || x ? `${C.recorded.toLocaleString()} ${C.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${C.recorded.toLocaleString()} ${C.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${C.recorded === 1 ? "this change" : `these ${C.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          "It lasts until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function $n() {
    return p === "answers" ? /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !tt.length,
        onClick: yn,
        children: "Preview all matches"
      },
      "preview"
    ) : p === "preview" ? x ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: _t, children: "Cancel preview" }, "cancel-preview") : g ? /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !$.willChange,
        onClick: () => void vt("apply"),
        children: [
          "Apply to ",
          $.willChange.toLocaleString(),
          " ",
          $.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : te ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button primary", onClick: Et, children: "Change answers" }, "change-answers") : /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void ge(),
        children: "Preview again"
      },
      "again"
    ) : x ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: _t, children: Xt ? "Cancel undo" : "Cancel run" }, "cancel-run") : Xt || !st ? null : /* @__PURE__ */ c(fi, { children: [
      st.retryable && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: () => void vt("retry"), children: "Retry failed" }),
      st.counts.pending > 0 && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          onClick: () => void vt("apply"),
          children: "Continue"
        }
      )
    ] }, "after-run");
  }
  return /* @__PURE__ */ c(iu, { children: [
    /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: j,
        title: "Apply answers to all matching occurrences",
        disabled: t || !Ie.length,
        onClick: () => {
          Dt(), i(), d(!0);
        },
        children: [
          /* @__PURE__ */ r(ao, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    l && /* @__PURE__ */ c(
      "dialog",
      {
        ref: B,
        className: "dq-batch-dialog",
        "aria-labelledby": `${Ye}-title`,
        "aria-modal": "true",
        onCancel: (C) => {
          C.preventDefault(), pt();
        },
        onClose: () => {
          var C;
          wt.current ? (C = B.current) == null || C.showModal() : pt();
        },
        children: [
          /* @__PURE__ */ c("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ r(ao, { "aria-hidden": "true" }),
            /* @__PURE__ */ r("h2", { id: `${Ye}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: x,
                onClick: pt,
                children: /* @__PURE__ */ r(Vr, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r(du, { step: p }),
          /* @__PURE__ */ c(
            "div",
            {
              className: "dq-batch-body",
              ref: A,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": p === "preview" ? "" : void 0,
              "aria-label": `${ci.find((C) => C.id === p).label} step`,
              children: [
                /* @__PURE__ */ c("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  W && /* @__PURE__ */ r("p", { role: "status", children: W }),
                  K && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: K })
                ] }),
                p === "answers" ? Zt() : p === "preview" ? pr() : Kt(st)
              ]
            }
          ),
          /* @__PURE__ */ c("div", { className: "dq-batch-footer", children: [
            p === "preview" && /* @__PURE__ */ c("button", { type: "button", className: "dq-button", disabled: x, onClick: Et, children: [
              /* @__PURE__ */ r(Jr, { "aria-hidden": "true" }),
              "Back"
            ] }),
            p === "run" && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: x, onClick: Dt, children: "New batch" }),
            /* @__PURE__ */ r("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: x, onClick: pt, children: "Close" }),
            $n()
          ] })
        ]
      }
    )
  ] });
}
const ic = "data-quality.description-collapsed.v1";
function hu() {
  try {
    return localStorage.getItem(ic) === "true";
  } catch {
    return !1;
  }
}
function pu({
  details: e,
  label: t
}) {
  const [n, a] = k(hu), i = pn(() => {
    a((o) => {
      const s = !o;
      try {
        localStorage.setItem(ic, String(s));
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
    !n && (e != null && e.trim() ? /* @__PURE__ */ r(Bc, { className: "dq-description-body", children: e }) : /* @__PURE__ */ r("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
function mu({
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
  const p = e ? e.ranked.slice(0, e.limit) : [], f = !!e && (e.ranked.length > e.limit || (((g = e.candidates[e.cursor]) == null ? void 0 : g.total) ?? 0) > 0);
  return /* @__PURE__ */ c("div", { className: "dq-performer-ranking", children: [
    /* @__PURE__ */ c("div", { className: "dq-performer-ranking-status", children: [
      n ? /* @__PURE__ */ c("p", { role: "alert", children: [
        "Could not rank performers. ",
        n
      ] }) : t ? /* @__PURE__ */ c("p", { role: "status", children: [
        "Counting matching ",
        o.many,
        " per performer…"
      ] }) : e ? /* @__PURE__ */ r("p", { children: p.length ? `Most matching ${o.queue}s first` : `No performer has matching ${o.many}.` }) : null,
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "Refresh counts",
          title: "Refresh counts",
          disabled: t || i,
          onClick: d,
          children: /* @__PURE__ */ r(al, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-queue-list", children: p.map((m) => {
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
            /* @__PURE__ */ r(qr, { performer: m }),
            /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: m.name }),
            b && /* @__PURE__ */ r(ma, { className: "dq-flag-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ r("span", { className: "dq-ranked-count", "aria-hidden": "true", children: m.count.toLocaleString() })
          ]
        },
        m.id
      );
    }) }),
    f && !t && !n && /* @__PURE__ */ r(
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
const gu = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], bu = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function wu(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), a = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), i = t.bottom + 8;
  return { top: i, left: a, width: n, maxHeight: Math.max(160, window.innerHeight - i - 16) };
}
function da(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function yu(e, t) {
  const n = Ni(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", a = e.conditionTagIds.map(
    (o) => t[o] === void 0 ? "…" : t[o] ?? "Unavailable tag"
  ), i = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${da(a, "or")}`,
    includesAll: `has ${da(a, "and")}`,
    excludes: `has none of ${da(a, "or")}`,
    excludesAll: `missing ${da(a, "or")}`
  };
  return `${n} · ${i[e.condition]}`;
}
function vu({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: a,
  onEditCriteria: i
}) {
  const [o, s] = k(!1), [l, d] = k(null), p = R(null), f = R(null), g = St(), m = Ar(e.conditionTagIds), N = yu(e, m);
  cn(() => {
    if (!o || !p.current) return;
    const w = () => p.current && d(wu(p.current));
    return w(), window.addEventListener("resize", w), () => window.removeEventListener("resize", w);
  }, [o]), J(() => {
    var I, x;
    if (!o) return;
    const w = (I = f.current) == null ? void 0 : I.querySelector('[aria-pressed="true"]');
    w && !w.disabled ? w.focus() : (x = f.current) == null || x.focus();
  }, [o]);
  const b = () => {
    s(!1), requestAnimationFrame(() => {
      var w;
      return (w = p.current) == null ? void 0 : w.focus();
    });
  }, q = (w) => {
    if (!(w.target instanceof Element && w.target.closest('[role="dialog"]') !== f.current || w.defaultPrevented)) {
      if (w.key === "Escape")
        w.preventDefault(), b();
      else if (w.key === "Tab" && f.current) {
        const x = [...f.current.querySelectorAll(bu)].filter((te) => te.closest('[role="dialog"]') === f.current).sort(
          (te, G) => te.compareDocumentPosition(G) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!x.length) return;
        const _ = x[0], K = x[x.length - 1], U = document.activeElement;
        w.shiftKey && (U === _ || U === f.current) ? (w.preventDefault(), K.focus()) : !w.shiftKey && U === K && (w.preventDefault(), _.focus());
      }
    }
  }, E = !["any", "isNull"].includes(e.condition);
  return /* @__PURE__ */ c("div", { className: "dq-scope", children: [
    /* @__PURE__ */ c(
      "button",
      {
        ref: p,
        type: "button",
        className: "dq-header-button dq-scope-button",
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        "aria-controls": o ? g : void 0,
        title: N,
        onClick: () => o ? b() : s(!0),
        children: [
          /* @__PURE__ */ r(Yo, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-summary", children: N }),
          /* @__PURE__ */ r(Ho, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ c(pe, { children: [
      /* @__PURE__ */ r("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: b }),
      /* @__PURE__ */ c(
        "div",
        {
          ref: f,
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
          onKeyDown: q,
          children: [
            /* @__PURE__ */ c("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Performers to review" }),
              /* @__PURE__ */ r("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: gu.map(({ mode: w, label: I }) => /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === w,
                  onClick: () => e.targetMode !== w && a({ targetMode: w }),
                  children: I
                },
                w
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ r(
                An,
                {
                  entityType: "performer",
                  values: e.performerIds,
                  onChange: (w) => a({ performerIds: w }),
                  placeholder: "All performers...",
                  allowCreate: !1
                }
              ),
              e.targetMode === "filter" && /* @__PURE__ */ c("div", { className: "dq-scope-criteria", children: [
                /* @__PURE__ */ r("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ r(
                  _r,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: hi,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (w) => a({ performerFilter: w })
                  }
                ) }),
                /* @__PURE__ */ c("button", { type: "button", className: "dq-button", onClick: i, children: [
                  /* @__PURE__ */ r(Er, { "aria-hidden": "true" }),
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
                  onChange: (w) => a({ condition: w.target.value }),
                  children: vi.map((w) => /* @__PURE__ */ r("option", { value: w, children: yi[w] }, w))
                }
              ),
              E && /* @__PURE__ */ c(pe, { children: [
                /* @__PURE__ */ r(
                  An,
                  {
                    entityType: "tag",
                    values: e.conditionTagIds,
                    onChange: (w) => a({ conditionTagIds: w }),
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
                        onChange: (w) => a({ includeSubtags: w.target.checked })
                      }
                    ),
                    "Include subtags"
                  ] }),
                  jr(e.condition) && /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ r(
                      "input",
                      {
                        type: "checkbox",
                        checked: e.hideConfirmedAbsent ?? !0,
                        onChange: (w) => a({ hideConfirmedAbsent: w.target.checked })
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
function ha(e) {
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
function Nu(e) {
  const t = e.occurrence;
  return JSON.stringify([
    $e(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {},
    t.flagPerformerTagIds ?? []
  ]);
}
async function qu(e, t) {
  const n = $e(e) === "audio", a = new Set(e.occurrence.flagPerformerTagIds ?? []), i = (l) => ({
    id: l.id,
    name: l.name,
    total: (n ? l.audioCount : l.videoCount) ?? 0,
    flags: (l.tags ?? []).filter((d) => a.has(d.id)).map((d) => d.name)
  }), o = e.occurrence, s = [];
  if (o.targetMode === "selected" && o.performerIds.length > 0)
    for (const l of o.performerIds) {
      const d = await xl(
        `/api/performers/${l}`,
        { signal: t }
      );
      d && s.push(i(d));
    }
  else {
    const { _filterExpression: l, ...d } = o.targetMode === "filter" ? o.performerFilter : {};
    for (let p = 1; ; p++) {
      const f = await se(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            Rn({
              findFilter: {
                page: p,
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
      if (s.push(...f.items.map(i)), p * 1e3 >= f.totalCount || !f.items.length) break;
    }
  }
  return s.sort((l, d) => d.total - l.total || l.id - d.id);
}
function oc(e, t, n) {
  const a = Ki(e, [t]);
  return _l(a, a.view.filter, n);
}
function sc(e, t) {
  const n = e.findIndex(
    (a) => a.count < t.count || a.count === t.count && a.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function li(e, t, n, a) {
  if (t >= e.length) return !0;
  const i = e[t].total;
  return i <= 0 ? !0 : n.length >= a && i < n[a - 1].count;
}
async function Su(e, t, n, a, i = {}) {
  const o = ha(e), s = Nu(e), l = Hs(e.occurrence), d = (t == null ? void 0 : t.signature) === o && !t.partial ? t : {
    signature: o,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: l ? "" : s,
    candidates: l ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await qu(e, a),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: p } = d, f = [...d.ranked];
  let g = d.cursor, m = !1;
  const N = (b) => ({
    ...d,
    cursor: g,
    ranked: [...f],
    limit: n,
    complete: !b && li(p, g, f, n),
    ...b ? { partial: b } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: i.concurrency ?? 6 }, async () => {
        var b;
        for (; !m && !li(p, g, f, n); ) {
          a.throwIfAborted();
          const q = p[g++], E = await oc(e, q.id, a);
          E > 0 && sc(f, { ...q, count: E }), (b = i.onProgress) == null || b.call(i, N(!0));
        }
      })
    );
  } catch (b) {
    throw m = !0, b;
  }
  return a.throwIfAborted(), N(!1);
}
function Eu(e, t, n) {
  const a = e.candidates.findIndex((o) => o.id === t);
  if (e.partial || a < 0 || a >= e.cursor) return e;
  const i = e.ranked.filter((o) => o.id !== t);
  return n > 0 && sc(i, { ...e.candidates[a], count: n }), {
    ...e,
    ranked: i,
    complete: li(e.candidates, e.cursor, i, e.limit)
  };
}
function fr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, l) => fr(s, t[l]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, a = t, i = Object.keys(n).sort(), o = Object.keys(a).sort();
  return i.length === o.length && i.every(
    (s, l) => s === o[l] && fr(n[s], a[s])
  );
}
function Cu(e) {
  var l, d, p;
  const [t, n] = k({}), [a, i] = k(""), o = (((l = e == null ? void 0 : e.presentation) == null ? void 0 : l.annotations) ?? []).includes("tags") ? ((d = e == null ? void 0 : e.presentation) == null ? void 0 : d.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...o,
      ...((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.binParents) ?? []
    ])
  ]);
  return J(() => {
    let f = !0;
    return n({}), i(""), Promise.all(
      JSON.parse(s).map(
        async (g) => [g, await Ca([g])]
      )
    ).then((g) => {
      f && n(Object.fromEntries(g));
    }).catch(() => {
      f && i(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      f = !1;
    };
  }, [s]), { ids: t, error: a };
}
function ku(e, t, n) {
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
function Au({
  videos: e,
  review: t,
  savedObjectFilter: n,
  trees: a,
  disabled: i,
  onToggle: o
}) {
  var b;
  const s = ((b = t.presentation) == null ? void 0 : b.binParents) ?? [], l = new Set(
    s.flatMap((q) => (a[q] ?? []).filter((E) => E !== q))
  ), d = s.every((q) => a[q]), p = Hr(t.view.objectFilter, n).bins.filter(
    (q) => !d || l.has(q)
  ), f = /* @__PURE__ */ new Map();
  for (const q of e)
    for (const E of q.tags ?? [])
      if (l.has(E.id)) {
        const w = f.get(E.id) ?? { name: E.name, count: 0 };
        w.count++, f.set(E.id, w);
      }
  const g = p.filter((q) => !f.has(q)), m = Ar(g);
  for (const q of g)
    f.set(q, {
      name: m[q] === void 0 ? "…" : m[q] ?? "Unavailable tag",
      count: 0
    });
  if (!s.length) return null;
  const N = [...f].sort((q, E) => q[1].name.localeCompare(E[1].name));
  return /* @__PURE__ */ c("div", { className: "dq-bins", role: "group", "aria-label": "Tag bins on this page", children: [
    /* @__PURE__ */ r("span", { className: "dq-bins-label", "aria-hidden": "true", children: "On this page" }),
    N.map(([q, E]) => {
      const w = p.includes(q);
      return /* @__PURE__ */ c(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": w,
          title: w ? `Show every video again, not only ${E.name}` : `Show only videos tagged ${E.name}`,
          disabled: i,
          onClick: () => o(q),
          children: [
            w && /* @__PURE__ */ r(wi, { "aria-hidden": "true" }),
            E.name,
            " ",
            /* @__PURE__ */ r("span", { className: "dq-bin-count", children: E.count })
          ]
        },
        q
      );
    }),
    !N.length && /* @__PURE__ */ r("span", { className: "dq-bins-empty", children: "No matching tag bins on this page." })
  ] });
}
function cr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Tu(e) {
  if (!cr(e) || Object.keys(e).length !== 1 || !cr(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !cr(t.tagsCriterion)) return null;
  const { value: n, modifier: a, depth: i, ...o } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && a === "INCLUDES" && i === 0 && !Object.keys(o).length ? n[0] : null;
}
function Hr(e, t) {
  let n = e;
  const a = [];
  for (; ; ) {
    if (t && fr(n, t)) {
      n = t;
      break;
    }
    const i = Object.keys(n);
    if (i.length !== 1 || i[0] !== "_filterExpression") break;
    const o = n._filterExpression;
    if (!cr(o) || o.operator !== "AND" || !Array.isArray(o.children))
      break;
    const s = o.children, l = Tu(s.at(-1));
    if (l == null || s.length > 3) break;
    let d = {}, p = null, f = !0;
    for (const [g, m] of s.slice(0, -1).entries())
      !cr(m) || Object.keys(m).length !== 1 ? f = !1 : g === 0 && cr(m.filter) && Object.keys(m.filter).length ? d = m.filter : !p && cr(m.group) ? p = m.group : f = !1;
    if (!f) break;
    a.unshift(l), n = p ? { ...d, _filterExpression: p } : d;
  }
  return { base: n, bins: a };
}
function Ru(e, t, n) {
  const { base: a, bins: i } = Hr(e.view.objectFilter, n);
  return (i.includes(t) ? i.filter((s) => s !== t) : [...i, t]).reduce(Ou, { ...e, view: { ...e.view, objectFilter: a } });
}
function Ou(e, t) {
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
const Aa = [
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
], Iu = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function hr(e) {
  const t = Ae(e) ? e.occurrence : void 0;
  return {
    filter: xt({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, $e(e)),
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
function Ro(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function di(e, t) {
  let n;
  if (Ae(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!Aa.some((l) => l !== "performer" && t.has(l))) {
    const l = hr(e);
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
      const p = d.lastIndexOf(":");
      return { key: d.slice(0, p), direction: d.slice(p + 1) };
    });
    if (l.some((d) => !d.key || !["asc", "desc"].includes(d.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = l, i.sort = l[0].key, i.direction = l[0].direction;
  }
  let o;
  if (Ae(e) && (o = {
    ...Iu,
    ...Ro(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(o.targetMode) || !vi.includes(o.condition) || !Array.isArray(o.performerIds) || !Array.isArray(o.conditionTagIds) || typeof o.includeSubtags != "boolean" || typeof o.hideConfirmedAbsent != "boolean" || [...o.performerIds, ...o.conditionTagIds].some(
    (l) => !Number.isSafeInteger(l) || l <= 0
  ) || !o.performerFilter || typeof o.performerFilter != "object" || Array.isArray(o.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: xt(i, $e(e)),
      objectFilter: Ro(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: o,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
const Oo = { dataQualityOpenedFromList: !0 };
function cc() {
  const e = window.history.state;
  return !!e && typeof e == "object" && e.dataQualityOpenedFromList === !0;
}
function lc(e, { openingFromList: t = !1 } = {}) {
  t ? window.history.pushState({ ...Oo }, "", e) : window.history.replaceState(cc() ? { ...Oo } : null, "", e);
}
function Dr(e, t) {
  const n = new URLSearchParams(window.location.search);
  Aa.forEach((a) => n.delete(a)), n.set("review", e);
  for (const a of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[a] !== void 0 && n.set(a, String(t.filter[a]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((a) => `${a.key}:${a.direction}`).join(",")
  ), n.set("filters", JSON.stringify(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", JSON.stringify(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), lc(`${window.location.pathname}?${n}${window.location.hash}`);
}
function mn(e, t) {
  const n = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return Ae(e) ? {
    ...e,
    view: n,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: n };
}
function ur(e) {
  const t = e;
  return mn(t, hr(t));
}
function Io(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !fr(
    JSON.parse(Gn(mn(e, t))),
    JSON.parse(Gn(mn(e, hr(e))))
  );
}
function dc(e, t) {
  if (xe(e) !== "video") return e;
  const { base: n, bins: a } = Hr(e.view.objectFilter, t.view.objectFilter);
  return a.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function ua(e, t) {
  if (xe(e) !== "video") return t;
  const { base: n, bins: a } = Hr(t.objectFilter, e.view.objectFilter);
  return a.length ? { ...t, objectFilter: n } : t;
}
function $o(e, t) {
  return !t || !Ae(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function Ba(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const a of e)
    n.set(a.media.id, [...n.get(a.media.id) ?? [], a]);
  return [...n.values()].reverse().flat();
}
const Ht = (e) => e instanceof Error ? e.message : "Request failed.", Va = 50, $u = [], Mo = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function Mu(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? Qc(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? Jo(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function Fu({ media: e, kind: t }) {
  const [n, a] = k(!1);
  return /* @__PURE__ */ r("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ r(Zo, {}) : /* @__PURE__ */ r(qa, {}) : /* @__PURE__ */ r(
    "img",
    {
      src: ei(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => a(!0)
    }
  ) });
}
function Pu({
  tags: e,
  preview: t,
  showPreview: n,
  trees: a,
  actionTagIds: i,
  label: o
}) {
  const s = Fi(t), l = n ? s : null, d = e == null ? void 0 : e.absent, p = $i(
    Ce(() => [...i, ...d ?? []], [i, d])
  ), f = (K) => p[K] ?? { id: K, name: p[K] === void 0 ? "…" : "Unavailable tag" }, g = (K) => dr(K.map(f)), m = l && e ? Ts(l, e, a) : null, N = e ? sd(e) : [], b = new Set(N.map((K) => K.id)), q = new Set(m == null ? void 0 : m.removed), E = new Set(m == null ? void 0 : m.markedAbsent), w = new Set(m == null ? void 0 : m.absenceCleared), I = /* @__PURE__ */ c("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ r(pa, { "aria-hidden": "true" }),
    "absent"
  ] }), x = g((m == null ? void 0 : m.added) ?? []), _ = g(((m == null ? void 0 : m.markedAbsent) ?? []).filter((K) => !b.has(K)));
  return /* @__PURE__ */ c("section", { className: "dq-panel-section", "aria-label": o, children: [
    /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ c(pe, { children: [
      N.length || x.length || _.length ? /* @__PURE__ */ c("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        N.map(
          (K) => q.has(K.id) ? /* @__PURE__ */ c("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ c("del", { children: [
              "− ",
              /* @__PURE__ */ r(Yt, { tag: K })
            ] }),
            E.has(K.id) && I
          ] }, K.id) : /* @__PURE__ */ r("li", { className: "dq-tag", children: /* @__PURE__ */ r(Yt, { tag: K }) }, K.id)
        ),
        x.map((K) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ c("ins", { children: [
          "+ ",
          /* @__PURE__ */ r(Yt, { tag: K })
        ] }) }, `added-${K.id}`)),
        _.map((K) => /* @__PURE__ */ c("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ r("ins", { children: /* @__PURE__ */ r(Yt, { tag: K }) }),
          I
        ] }, `absent-${K.id}`))
      ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" }),
      e.absent.length > 0 && /* @__PURE__ */ c(pe, { children: [
        /* @__PURE__ */ r("h4", { className: "dq-subheading", children: "Confirmed absent" }),
        /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: g(e.absent).map((K) => /* @__PURE__ */ c(
          "li",
          {
            className: `dq-tag dq-tag-absent${w.has(K.id) ? " dq-tag-removed" : ""}`,
            children: [
              /* @__PURE__ */ r(pa, { "aria-hidden": "true" }),
              w.has(K.id) ? /* @__PURE__ */ c("del", { children: [
                "− ",
                /* @__PURE__ */ r(Yt, { tag: K })
              ] }) : /* @__PURE__ */ r(Yt, { tag: K })
            ]
          },
          K.id
        )) })
      ] })
    ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading…" })
  ] });
}
function xu({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: a,
  onSaveDefaults: i,
  editRequest: o = 0,
  onEditRequestHandled: s,
  pageControls: l,
  stayOnTap: d,
  onStayOnTapChange: p
}) {
  var ea;
  const f = $e(e), g = gn(f), m = f === "audio" ? "Audio" : "Scene", N = (h) => {
    var S;
    return h.title || ((S = h.files[0]) == null ? void 0 : S.basename) || m;
  }, b = (h) => `${h.occurrence ? `${h.occurrence.performer.name} — ` : ""}${N(h.media)}`, q = R(null), E = R("");
  if (!q.current)
    try {
      q.current = di(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (h) {
      E.current = Ht(h), q.current = { query: hr(e), startAtEnd: !1 };
    }
  const [w, I] = k(null), [x, _] = k(""), K = R(null), U = R(null), te = R(null), G = R(null), [W, V] = k(!!E.current), F = R(0), [D, v] = k(q.current.query), T = R(D);
  T.current = D;
  const [Y, H] = k(0), de = R(q.current.startAtEnd), [ce, B] = k([]), [A, j] = k(null), Z = R(null), [qe, Ne] = k(null), [ft, it] = k(0), wt = Ce(() => {
    if (!A) return null;
    const h = ce.findIndex((S) => S.key === A.key);
    return h < 0 ? null : ce.slice(h + 1).find((S) => S.media.id !== A.media.id) ?? null;
  }, [A, ce]), [Ot, Ye] = k(0), [Be, Xt] = k(!1), [Te, bn] = k(!1), le = R(!1), je = R(!0), yt = R(null);
  J(() => (je.current = !0, () => {
    je.current = !1;
  }), []);
  const [ln, Ie] = k(E.current), [tt, Se] = k(""), [ht, Lt] = k(null), [Re, wn] = k(!1), [nt, It] = k([]), ot = R([]), Dt = R(null), pt = R(null), Wn = R(null);
  J(() => {
    var h, S;
    Re && ((S = (h = Wn.current) == null ? void 0 : h.querySelector("input")) == null || S.focus());
  }, [Re]);
  const [Et, yn] = k(!1), [_t, $t] = k(!1), dn = Wr(), [ge, vt] = k(!1), Xe = d ?? ge, On = p ?? vt;
  J(() => {
    if (Be || Et || !pt.current) return;
    const h = requestAnimationFrame(() => {
      if (document.querySelector(Mo)) return;
      const S = pt.current;
      pt.current = null;
      const P = document.activeElement;
      P && P !== document.body || S != null && S.isConnected && !S.disabled && S.focus();
    });
    return () => cancelAnimationFrame(h);
  }, [Be, Et, Y]);
  const [jt, Le] = k([]), [Ct, ne] = k({}), $ = R(null), ye = R(0), [st, In] = k({});
  J(() => {
    let h = !0;
    return Promise.all(
      _i(D.objectFilter).map(
        async (S) => [
          String(S),
          (await se(`/api/tags/${S}`)).name
        ]
      )
    ).then((S) => {
      h && In(Object.fromEntries(S));
    }).catch(() => {
    }), () => {
      h = !1;
    };
  }, [D.objectFilter]);
  const oe = Ce(
    () => ji(D.objectFilter, st),
    [st, D.objectFilter]
  ), kt = R(0), Qe = R(e);
  Qe.current = e;
  const De = w ?? e, We = Ce(
    () => mn(De, D),
    [De, D]
  ), Ut = Ce(
    () => $o(We, D.performerFocus),
    [We, D.performerFocus]
  ), He = R(Ut);
  He.current = Ut;
  const mt = R(We);
  mt.current = We;
  const [Mt, Zt] = k("items"), [rt, pr] = k(null), Kt = R(null), $n = R("");
  function C(h) {
    const S = typeof h == "function" ? h(Kt.current) : h;
    Kt.current = S, pr(S);
  }
  const [M, re] = k(!1), [ee, Ee] = k(null), we = R(null), Me = Ae(We) ? ha(We) : "", [_e, At] = k(0), [ve, en] = k(null);
  J(() => () => {
    var h;
    return (h = we.current) == null ? void 0 : h.controller.abort();
  }, []), J(() => {
    const h = we.current;
    !h || h.signature === Me || (h.controller.abort(), we.current = null, re(!1));
  }, [Me]), J(() => {
    var P;
    const h = Kt.current;
    if (Mt !== "performers" || !Me || ((P = we.current) == null ? void 0 : P.signature) === Me || $n.current === Me || (h == null ? void 0 : h.signature) === Me && h.complete)
      return;
    const S = (h == null ? void 0 : h.signature) === Me ? h : null;
    Vt(h, (S == null ? void 0 : S.limit) ?? Va);
  }, [Mt, Me, rt, ee, M]);
  const ue = D.performerFocus, vn = JSON.stringify(
    Ae(We) ? We.occurrence.flagPerformerTagIds ?? [] : []
  );
  J(() => {
    if (!ue) {
      en(null);
      return;
    }
    let h = !0;
    const S = new Set(JSON.parse(vn));
    return se(
      `/api/performers/${ue}`
    ).then((P) => {
      h && en({
        id: ue,
        name: P.name,
        flags: (P.tags ?? []).filter((Q) => S.has(Q.id)).map((Q) => Q.name)
      });
    }).catch(() => {
    }), () => {
      h = !1;
    };
  }, [ue, vn]);
  const Ve = Io(e, D), Hn = Io(e, ua(e, D)), gt = Te || Be || Re, Nn = Number(D.filter.page);
  function Tt(h, S = !1) {
    le.current || (E.current = "", de.current = S, T.current = h, v(h), Ye(0), Xt(!0), S || Dr(e.id, h), H((P) => P + 1));
  }
  function Mn() {
    if (le.current = !1, bn(!1), je.current && yt.current) {
      const h = yt.current;
      yt.current = null, Tt(h.query, h.startAtEnd);
    }
  }
  J(() => {
    const h = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const S = di(
            Qe.current,
            new URLSearchParams(window.location.search)
          );
          le.current ? yt.current = S : Tt(S.query, S.startAtEnd);
        } catch (S) {
          Ie(Ht(S));
        }
    };
    return window.addEventListener("popstate", h), () => window.removeEventListener("popstate", h);
  }, [e.id]), J(() => (a(Te || Be || Re || !!w), () => a(!1)), [Te, Be, Re, !!w, a]);
  async function at(h, S, P) {
    if (Ae(h)) {
      const ae = await Ys(
        h,
        $.current,
        S,
        P
      );
      return {
        items: ae.items.map((fe) => ({
          key: fe.key,
          media: fe.media,
          occurrence: fe
        })),
        totalCount: ae.totalCount
      };
    }
    const Q = await Lr(
      h,
      { ...h.view.filter, page: S },
      P
    );
    return {
      items: Q.items.map((ae) => ({ key: String(ae.id), media: ae })),
      totalCount: Q.totalCount
    };
  }
  function Ft(h, S, P, Q = !1, ae = !1) {
    if (!je.current || yt.current) return;
    V(!0), B(
      ae ? h.items : Ba(h.items, T.current.startFrom === "end")
    ), Ye(h.totalCount), un(P, Q);
    const fe = {
      ...T.current,
      filter: { ...T.current.filter, page: S }
    };
    T.current = fe, v(fe), Dr(e.id, fe);
  }
  function un(h, S = !1) {
    (h == null ? void 0 : h.key) !== (A == null ? void 0 : A.key) && (Z.current = null), (h == null ? void 0 : h.media.id) !== (A == null ? void 0 : A.media.id) && Ne(S && h ? h.media.id : null), j(h);
  }
  J(() => {
    if (E.current) return;
    const h = new AbortController();
    G.current = h;
    const S = ++kt.current;
    return Xt(!0), Ie(""), Se(""), Z.current = null, Ne(null), j(null), B([]), wn(!1), (async () => {
      const P = $o(
        mn(Qe.current, T.current),
        T.current.performerFocus
      );
      $.current = Ae(P) ? await Ui(P, h.signal) : null;
      let Q = Number(P.view.filter.page), ae = await at(P, Q, h.signal);
      const fe = Math.max(
        1,
        Math.ceil(ae.totalCount / Number(P.view.filter.perPage))
      );
      (de.current || Q > fe) && (Q = fe, ae = await at(P, Q, h.signal)), de.current = !1;
      const ke = P.view.startFrom === "end" ? -1 : 1;
      for (; Ae(P) && !ae.items.length && Q + ke >= 1 && Q + ke <= fe && !h.signal.aborted; )
        Q += ke, ae = await at(P, Q, h.signal);
      if (S !== kt.current || h.signal.aborted) return;
      const dt = Ba(ae.items, P.view.startFrom === "end");
      Ft(ae, Q, dt[0] ?? null);
    })().catch((P) => {
      !h.signal.aborted && S === kt.current && Ie(Ht(P));
    }).finally(() => {
      !h.signal.aborted && S === kt.current && (V(!0), Xt(!1));
    }), () => {
      h.abort(), kt.current++;
    };
  }, [Y, e.id]), J(() => {
    if (Lt(null), !A) return;
    let h = !0;
    return sn(f, A).then((S) => {
      h && (Lt(S), Le(
        Ae(e) ? S.ids.filter((P) => e.occurrence.tagIds.includes(P)) : []
      ));
    }).catch((S) => {
      h && Ie(`Could not load current tags. ${Ht(S)}`);
    }), () => {
      h = !1;
    };
  }, [A]), J(() => {
    if (!Ae(e) || e.actions.length)
      return;
    let h = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (S) => [
          S,
          (await se(`/api/tags/${S}`)).name
        ]
      )
    ).then((S) => {
      h && ne(Object.fromEntries(S));
    }).catch((S) => {
      h && Ie(Ht(S));
    }), () => {
      h = !1;
    };
  }, [e]);
  async function fn(h = !1, S = !1, P = !1) {
    var En;
    if (!A) return;
    const Q = ce.findIndex((Fe) => Fe.key === A.key), ae = D.startFrom === "end" ? -1 : 1, fe = ((En = Z.current) == null ? void 0 : En.key) === A.key ? Z.current : { key: A.key, page: Nn, before: ce.slice(0, Q + 1).map((Fe) => Fe.key), after: ce.slice(Q + 1).map((Fe) => Fe.key) }, ke = new Set(fe.after), dt = new Set(fe.before), Qt = ce.find((Fe) => {
      var nn;
      return ke.has(Fe.key) || (ae === 1 || Nn < fe.page) && ((nn = Z.current) == null ? void 0 : nn.key) === A.key && !dt.has(Fe.key);
    });
    if (!h && Qt) {
      un(Qt, P);
      return;
    }
    const Je = h ? dt : new Set(ce.map((Fe) => Fe.key)), qt = 1100 - (Date.now() - ye.current);
    qt > 0 && await new Promise((Fe) => window.setTimeout(Fe, qt));
    let Ue = ae === -1 && !h ? Math.max(1, Nn - 1) : Nn;
    for (; je.current && !yt.current; ) {
      let Fe = await at(Ut, Ue);
      const nn = Math.max(
        1,
        Math.ceil(Fe.totalCount / Number(D.filter.perPage))
      );
      Ue > nn && (Ue = nn, Fe = await at(Ut, Ue));
      const ta = Ba(Fe.items, ae === -1), Ta = new Map(ta.map((he) => [he.key, he])), $r = h ? fe.after.flatMap((he) => {
        const na = Ta.get(he);
        return na ? [na] : [];
      }) : [], Mr = new Set($r.map((he) => he.key)), Dn = h ? {
        ...Fe,
        items: [
          ...$r,
          ...ta.filter(
            (he) => he.key !== A.key && !Mr.has(he.key)
          )
        ]
      } : Fe;
      if (S) {
        Z.current = fe, Ft(Dn, Ue, A, !1, h);
        return;
      }
      const rn = ae === -1 && Nn === 1 && !h ? void 0 : Dn.items.find(
        (he) => !Je.has(he.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(h && ae === -1 && Ue === fe.page) || ke.has(he.key))
      );
      if (rn || (ae === -1 ? Ue <= 1 : Ue >= nn)) {
        Ft(
          Dn,
          Ue,
          rn ?? null,
          P,
          h
        ), rn || Se(
          Fe.totalCount ? `Reached the end in this direction. Matching items remain available from the ${g.queue} pages.` : `No matching ${g.many}.`
        );
        return;
      }
      Ue += ae;
    }
  }
  async function Gt(h, S = !1, P = !1, Q = !1) {
    if (w || !A || le.current || Be || Re && !P)
      return;
    const ae = P || Q || !!(h != null && h.steps.length), fe = ae && !S;
    if (ae && (!t || !ht) || h && Jn(h) && !n) return;
    le.current = !0, bn(!0), Ie(""), Se("");
    const ke = ce.findIndex((Je) => Je.key === A.key), dt = ae && !S && ke >= 0 ? ce[ke + 1] ?? null : null;
    dt && (B(
      (Je) => Je.filter((qt) => qt.key !== A.key)
    ), un(dt, !0));
    let Qt = !1;
    try {
      if (ae) {
        const Je = await sn(f, A);
        if (h)
          await Hd(Ut, A, h);
        else {
          const Ue = Q && Ae(e) ? e.occurrence.tagIds.filter((nn) => Je.ids.includes(nn)) : ot.current, Fe = Cr(Ue, Q ? jt : nt);
          await Bi(Ut, A, Fe);
        }
        ye.current = Date.now();
        const qt = await sn(f, A);
        dt || Lt(qt), Qt = !0, wn(!1), Se("Tags saved."), A.occurrence && (Xn(A.occurrence.performer.id), At((Ue) => Ue + 1));
      }
      if (!je.current || yt.current) return;
      ae ? await fn(!0, S, fe) : S || await fn(), S && P && requestAnimationFrame(() => {
        var Je;
        return (Je = Dt.current) == null ? void 0 : Je.focus();
      });
    } catch (Je) {
      if (Ie(
        Qt ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${Ht(Je)}` : ae ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${Ht(Je)}` : `Could not advance. ${Ht(Je)}`
      ), ae && !Qt) {
        dt && (B(ce), Ne(null), it((qt) => qt + 1), j(A)), ye.current = Date.now();
        try {
          Lt(await sn(f, A));
        } catch {
          Lt(null), Ie(
            (qt) => `${qt} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      Mn();
    }
  }
  const ct = !Re && !w && !Et && !_t && (A != null || Be || Te);
  Ri({
    surface: "local",
    enabled: ct,
    actions: e.actions,
    onAction: (h, S) => {
      const P = e.actions[h];
      P && Gt(P, S);
    },
    onFind: () => $t(!0)
  });
  const lt = (h) => Te || Be || !ht || !!w || !t && h.steps.length > 0 || !n && Jn(h);
  function Nt() {
    !i || w || le.current || Re || (te.current = document.activeElement, U.current = {
      error: ln,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(T.current),
      items: ce,
      current: A,
      total: Ot,
      targets: $.current,
      stayedCursor: Z.current
    }, I(structuredClone(e)), _(""), Se(""), Ie(""));
  }
  J(() => {
    if (!o) {
      F.current = 0;
      return;
    }
    o !== F.current && W && !Be && (F.current = o, Nt(), s == null || s());
  }, [o, Be, W]);
  function bt() {
    I(null), _(""), requestAnimationFrame(() => {
      const h = te.current;
      h != null && h.isConnected && h !== document.body && h.focus();
    });
  }
  function qn() {
    var S;
    const h = U.current;
    !h || Te || ((S = G.current) == null || S.abort(), kt.current++, T.current = h.query, v(h.query), B(h.items), j(h.current), Ye(h.total), $.current = h.targets, Z.current = h.stayedCursor, Xt(!1), Ie(h.error), Se(""), window.history.replaceState(window.history.state, "", h.url), bt());
  }
  async function Bt() {
    if (!w || !i || le.current) return;
    const h = mn(
      { ...w, name: w.name.trim() },
      ua(Qe.current, T.current)
    ), S = Kr(h);
    if (S) {
      _(S);
      return;
    }
    le.current = !0, bn(!0), _("");
    try {
      if (await i(h) === !1) throw new Error("Could not save review.");
      bt(), Se("Review saved.");
    } catch (P) {
      _(
        "Could not save review. Your edits are still open. " + Ht(P)
      );
    } finally {
      Mn();
    }
  }
  async function Yr() {
    if (!i || le.current) return;
    const h = ua(Qe.current, T.current), S = mn(Qe.current, {
      ...h,
      filter: { ...h.filter, page: 1 }
    });
    le.current = !0, bn(!0), Ie("");
    try {
      if (await i(S) === !1) throw new Error("Could not save review.");
      Se("Queue saved to this review.");
    } catch (P) {
      Ie("Could not save queue. " + Ht(P));
    } finally {
      Mn();
    }
  }
  const Ze = D.performerScope, tn = (h) => {
    const { performerFocus: S, ...P } = T.current, Q = S && !("targetMode" in h || "performerIds" in h || "performerFilter" in h);
    Tt({
      ...P,
      ...Q ? { performerFocus: S } : {},
      filter: { ...P.filter, page: 1 },
      performerScope: { ...Ze, ...h }
    });
  };
  async function Vt(h, S) {
    var ae;
    const P = mt.current;
    if (!Ae(P)) return;
    (ae = we.current) == null || ae.controller.abort();
    const Q = {
      signature: ha(P),
      controller: new AbortController()
    };
    we.current = Q, $n.current = "", re(!0), Ee(null);
    try {
      const fe = await Su(P, h, S, Q.controller.signal, {
        onProgress: (ke) => {
          we.current === Q && C(ke);
        }
      });
      we.current === Q && C(fe);
    } catch (fe) {
      we.current === Q && !Q.controller.signal.aborted && ($n.current = Q.signature, Ee({ signature: Q.signature, message: Ht(fe) }));
    } finally {
      we.current === Q && (we.current = null, re(!1));
    }
  }
  function Yn() {
    var h;
    (h = we.current) == null || h.controller.abort(), we.current = null, re(!1), C((S) => S && { ...S, partial: !0, complete: !1 });
  }
  async function Xn(h) {
    var ae;
    const S = mt.current;
    if (!Ae(S)) return;
    if (we.current) {
      Yn();
      return;
    }
    const P = ha(S);
    if (((ae = Kt.current) == null ? void 0 : ae.signature) !== P || Kt.current.partial) return;
    const Q = 1100 - (Date.now() - ye.current);
    Q > 0 && await new Promise((fe) => window.setTimeout(fe, Q));
    try {
      const fe = await oc(S, h);
      if (we.current) {
        Yn();
        return;
      }
      C(
        (ke) => (ke == null ? void 0 : ke.signature) === P ? Eu(ke, h, fe) : ke
      );
    } catch {
      C(
        (fe) => (fe == null ? void 0 : fe.signature) === P ? { ...fe, partial: !0, complete: !1 } : fe
      );
    }
  }
  const Xr = D.performerFocus ? rt == null ? void 0 : rt.candidates.find((h) => h.id === D.performerFocus) : void 0, ie = (ve == null ? void 0 : ve.id) === D.performerFocus ? ve : Xr ?? null;
  function mr(h) {
    if (le.current) return;
    const S = {
      ...T.current,
      performerFocus: h,
      filter: { ...T.current.filter, page: 1 }
    };
    Tt(S, S.startFrom === "end"), Zt("items");
  }
  function Zn() {
    const { performerFocus: h, ...S } = T.current;
    Tt(
      { ...S, filter: { ...S.filter, page: 1 } },
      S.startFrom === "end"
    );
  }
  const er = R(null);
  er.current ?? (er.current = Os());
  const Sn = er.current, tr = Rs(De.actions), Tr = Ce(
    () => De.actions.flatMap((h) => h.steps.flatMap((S) => S.tagIds)),
    [De.actions]
  ), Fn = R(null);
  J(() => {
    const h = Fn.current, S = h == null ? void 0 : h.querySelector('[aria-current="true"]');
    if (!h || !S) return;
    const P = h.getBoundingClientRect(), Q = S.getBoundingClientRect();
    Q.top < P.top ? h.scrollTop -= P.top - Q.top : Q.bottom > P.bottom && (h.scrollTop += Q.bottom - P.bottom);
  }, [A == null ? void 0 : A.key, Mt]);
  const Jt = R(null), nr = R(null);
  J(() => {
    var P, Q;
    const h = nr.current;
    if (!h) return;
    nr.current = null;
    const S = [...((P = Jt.current) == null ? void 0 : P.querySelectorAll(".dq-partner")) ?? []];
    (Q = S.find((ae) => ae.dataset.partnerKey === h) ?? S[0]) == null || Q.focus();
  }, [A == null ? void 0 : A.key]);
  const zt = Te || Be || Re || !!w, Oe = Ce(
    () => w ? mn(w, ua(e, D)) : null,
    [w, e, D]
  ), Rr = Ce(
    () => Oe != null && Sr(ur(Oe)) !== Sr(ur(e)),
    [Oe, e]
  );
  function Zr() {
    A ? sn(f, A).then(Lt).catch((h) => Ie(Ht(h))) : Tt(T.current);
  }
  const Pn = ln ? /* @__PURE__ */ c("p", { role: "alert", children: [
    ln,
    " ",
    /* @__PURE__ */ r("button", { type: "button", disabled: Te, onClick: Zr, children: A ? "Reload tags" : "Retry queue" })
  ] }) : null, rr = Te || Be || A != null && !ht, gr = Math.max(1, Number(D.filter.perPage) || 1), br = R(1);
  Be || (br.current = Math.max(1, Math.ceil(Ot / gr)));
  const Or = br.current, xn = Ze && A ? ce.filter(
    (h) => h.media.id === A.media.id && h.key !== A.key
  ) : [], Ir = A != null && A.occurrence && A.occurrence.performer.id === D.performerFocus ? (ie == null ? void 0 : ie.flags) ?? [] : A != null && A.occurrence ? ((ea = rt == null ? void 0 : rt.candidates.find((h) => h.id === A.occurrence.performer.id)) == null ? void 0 : ea.flags) ?? [] : [], ar = (h) => {
    var S;
    return h.title || ((S = h.files[0]) == null ? void 0 : S.basename) || `${f === "audio" ? "Audio" : "Video"} ${h.id}`;
  }, Ln = A ? Mu(A.media, f) : "";
  return /* @__PURE__ */ c(
    "section",
    {
      className: `dq-review-workspace${f === "audio" ? " dq-audio" : ""}`,
      "aria-label": Ze ? f === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : f === "audio" ? "Audio review" : "Video review",
      onClickCapture: (h) => {
        var Q;
        const S = h.target instanceof Element ? h.target.closest("button") : null, P = (S == null ? void 0 : S.getAttribute("aria-label")) ?? ((Q = S == null ? void 0 : S.textContent) == null ? void 0 : Q.trim()) ?? "";
        S && !S.closest(Mo) && /^(Filters|Edit filter:|Edit criteria)/.test(P) && (pt.current = S);
      },
      children: [
        /* @__PURE__ */ r(
          Vs,
          {
            name: e.name,
            description: e.description,
            entityType: xe(e),
            onBack: l == null ? void 0 : l.onBack,
            backDisabled: zt || !!(l != null && l.busy),
            onEdit: w ? () => {
              var h;
              return (h = K.current) == null ? void 0 : h.focus();
            } : Nt,
            editDisabled: !w && (zt || !i || !!(l != null && l.busy)),
            editing: !!w,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ c("fieldset", { className: "dq-review-toolbar", disabled: Te || Re, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: f === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ r(
                  _r,
                  {
                    filter: D.filter,
                    objectFilter: oe,
                    criteriaDefinitions: f === "audio" ? Go : pi,
                    customFieldEntityType: f,
                    totalCount: Ot,
                    sortOptions: f === "audio" ? Vc : Bo,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(
                      Js,
                      {
                        page: Math.min(Math.max(1, Nn || 1), Or),
                        pages: Or,
                        onPage: (h) => Tt({
                          ...T.current,
                          filter: xt(
                            { ...T.current.filter, page: h },
                            f
                          )
                        })
                      }
                    ),
                    onFilterChange: (h) => {
                      (h.sort !== T.current.filter.sort || h.direction !== T.current.filter.direction) && (h = { ...h, sorts: void 0 }), Tt({
                        ...T.current,
                        filter: xt(h, f)
                      });
                    },
                    onObjectFilterChange: (h) => {
                      Tt({
                        ...T.current,
                        objectFilter: Qs(
                          h,
                          st,
                          T.current.objectFilter
                        ),
                        filter: { ...T.current.filter, page: 1 }
                      });
                    }
                  }
                )
              ] })
            ),
            trailing: /* @__PURE__ */ c(pe, { children: [
              Ze && /* @__PURE__ */ r(
                vu,
                {
                  scope: Ze,
                  disabled: Te || Re,
                  editing: !!w,
                  onChange: tn,
                  onEditCriteria: () => yn(!0)
                }
              ),
              Ae(Ut) && t && /* @__PURE__ */ r(
                fu,
                {
                  review: Ut,
                  disabled: gt || !!w,
                  performerFlags: D.performerFocus ? ie == null ? void 0 : ie.flags : void 0,
                  trees: tr,
                  onOpen: () => {
                    le.current = !0, bn(!0);
                  },
                  onWrite: () => {
                    ye.current = Date.now();
                  },
                  onClose: (h) => {
                    if (h) {
                      ye.current = Date.now();
                      const S = T.current.performerFocus;
                      S ? Xn(S) : Yn(), At((P) => P + 1), new Promise((P) => window.setTimeout(P, 1100)).then(() => {
                        Mn(), je.current && (E.current || Xt(!0), H((P) => P + 1));
                      });
                    } else Mn();
                  }
                }
              ),
              (l == null ? void 0 : l.onGrid) && /* @__PURE__ */ r(
                zs,
                {
                  mode: "single",
                  disabled: zt || !!l.busy,
                  onChange: () => {
                    var h;
                    return (h = l.onGrid) == null ? void 0 : h.call(l);
                  }
                }
              ),
              (l == null ? void 0 : l.moreItems) && /* @__PURE__ */ r(
                xi,
                {
                  disabled: zt,
                  items: l.moreItems({
                    onSelect: Nt,
                    disabled: !i
                  })
                }
              )
            ] }),
            chipsStart: D.performerFocus ? /* @__PURE__ */ c("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ r(
                qr,
                {
                  performer: {
                    id: D.performerFocus,
                    name: (ie == null ? void 0 : ie.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ c("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ r("strong", { children: (ie == null ? void 0 : ie.name) ?? `performer ${D.performerFocus}` })
              ] }),
              ie != null && ie.flags.length ? /* @__PURE__ */ c(
                "span",
                {
                  className: "dq-focus-flag",
                  title: `Flagged: ${ie.flags.join(", ")}`,
                  children: [
                    /* @__PURE__ */ r(ma, { "aria-hidden": "true" }),
                    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
                      "Flagged: ",
                      ie.flags.join(", ")
                    ] })
                  ]
                }
              ) : null,
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: gt,
                  onClick: Zn,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            chipsEnd: w ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : Ve ? /* @__PURE__ */ c(pe, { children: [
              /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Queue differs from the saved review" }),
              Hn && /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: "dq-text-button",
                  title: "Save the current queue criteria to this review",
                  disabled: gt || !i,
                  onClick: () => void Yr(),
                  children: [
                    /* @__PURE__ */ r(ts, { "aria-hidden": "true" }),
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
                  disabled: gt,
                  onClick: () => {
                    const h = hr(e);
                    Tt(h, h.startFrom === "end");
                  },
                  children: [
                    /* @__PURE__ */ r(ns, { "aria-hidden": "true" }),
                    "Reset"
                  ]
                }
              )
            ] }) : void 0
          }
        ),
        l == null ? void 0 : l.notices,
        /* @__PURE__ */ c("div", { className: "dq-review-area", children: [
          w && Oe && /* @__PURE__ */ r(
            Bs,
            {
              drawerRef: K,
              draft: Oe,
              onChange: (h) => I(h),
              direction: D.startFrom,
              onDirectionChange: (h) => Tt({ ...T.current, startFrom: h }),
              tagGroups: $u,
              trees: tr,
              saving: Te,
              saveDisabled: Be,
              error: x,
              dirty: Rr,
              criteriaChanged: Hn,
              notices: Pn && /* @__PURE__ */ r("div", { className: "dq-review-feedback", children: Pn }),
              onSave: () => void Bt(),
              onCancel: qn
            }
          ),
          /* @__PURE__ */ r("div", { className: "dq-review-main", children: /* @__PURE__ */ c("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ c("div", { className: "dq-review-stage", children: [
              A ? /* @__PURE__ */ c(pe, { children: [
                /* @__PURE__ */ c("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ r("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ c(
                    "a",
                    {
                      href: `/${f}/${A.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${g.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ r("span", { children: ar(A.media) }),
                        /* @__PURE__ */ r(rs, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  Ln && /* @__PURE__ */ r("span", { className: "dq-stage-meta", children: Ln })
                ] }),
                /* @__PURE__ */ c("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ r("div", { className: "dq-player-frame", children: [A, wt].filter(Boolean).map((h) => {
                    var Q, ae, fe, ke, dt;
                    const S = h, P = S.key === A.key;
                    return /* @__PURE__ */ r(
                      "div",
                      {
                        className: P ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": P ? void 0 : !0,
                        inert: P ? void 0 : !0,
                        children: f === "audio" ? /* @__PURE__ */ r(
                          Jc,
                          {
                            streamUrl: ti("audio", S.media.id),
                            format: ((Q = S.media.files[0]) == null ? void 0 : Q.format) ?? "",
                            title: N(S.media),
                            coverUrl: P ? ei("audio", S.media) : void 0,
                            duration: ((ae = S.media.files[0]) == null ? void 0 : ae.duration) ?? 0,
                            autostart: P && qe === S.media.id
                          }
                        ) : /* @__PURE__ */ r(
                          Vo,
                          {
                            videoId: S.media.id,
                            streamUrl: ti("video", S.media.id),
                            posterUrl: P ? ei("video", S.media) : void 0,
                            duration: ((fe = S.media.files[0]) == null ? void 0 : fe.duration) ?? 0,
                            format: (ke = S.media.files[0]) == null ? void 0 : ke.format,
                            audioCodec: (dt = S.media.files[0]) == null ? void 0 : dt.audioCodec,
                            extensionSurface: P ? "quick-view" : void 0,
                            autostart: P && qe === S.media.id,
                            keyboardShortcutsEnabled: P,
                            showAbLoop: P,
                            clip: S.media.parentVideoId != null ? {
                              start: S.media.clipStartSec ?? 0,
                              end: S.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${S.media.id}:${ft}`
                    );
                  }) }),
                  f === "audio" && /* @__PURE__ */ r(
                    pu,
                    {
                      details: A.media.details,
                      label: g.one
                    },
                    A.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ r("p", { role: "status", className: "dq-stage-status", children: Be ? "Loading review…" : Ot ? "Reached the end in this direction." : `No matching ${g.many}.` }),
              De.actions.length > 0 ? /* @__PURE__ */ r(
                dd,
                {
                  actions: De.actions,
                  mediaKind: f,
                  isDisabled: (h) => Re || lt(h),
                  busy: rr,
                  tags: ht,
                  trees: tr,
                  preview: Sn,
                  onApply: (h, S) => void Gt(h, S),
                  onFind: () => $t(!0),
                  findDisabled: Re || !!w,
                  paused: !!w,
                  stayOnTap: Xe,
                  onStayOnTapChange: On
                }
              ) : Ae(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ c(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || Te || Re || !ht || !!w || !A,
                  children: [
                    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((h) => /* @__PURE__ */ c("label", { children: [
                      /* @__PURE__ */ r(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: jt.includes(h),
                          onChange: (S) => Le(
                            e.occurrence.multiple ? S.target.checked ? [...jt, h] : jt.filter((P) => P !== h) : [h]
                          )
                        }
                      ),
                      Ct[h] ?? "Loading tag…"
                    ] }, h)),
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
                          onClick: () => void Gt(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void Gt(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ c("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ c("div", { className: "dq-panel-body", ref: Jt, children: [
                A && /* @__PURE__ */ c(pe, { children: [
                  /* @__PURE__ */ c("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ c("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: A.occurrence ? A.occurrence.performer.name : `this ${g.one}` })
                    ] }),
                    /* @__PURE__ */ c("div", { className: "dq-reviewing-who", children: [
                      A.occurrence && /* @__PURE__ */ r(qr, { performer: A.occurrence.performer }),
                      /* @__PURE__ */ c("div", { children: [
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: A.occurrence ? A.occurrence.performer.name : `This ${g.one}` }),
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-note", children: Ze ? `Tags apply to this performer in this ${g.queue}` : `Tags apply to the whole ${g.one}` })
                      ] })
                    ] }),
                    Ir.length > 0 && /* @__PURE__ */ c("p", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
                      /* @__PURE__ */ r(ma, { "aria-hidden": "true" }),
                      "Flagged: ",
                      Ir.join(", ")
                    ] })
                  ] }),
                  xn.length > 0 && /* @__PURE__ */ c(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${g.queue}`,
                      children: [
                        /* @__PURE__ */ c("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          g.queue
                        ] }),
                        /* @__PURE__ */ r("div", { className: "dq-partners", children: xn.map((h) => {
                          var S, P, Q;
                          return /* @__PURE__ */ c(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (S = h.occurrence) == null ? void 0 : S.performer.name,
                              "aria-label": (P = h.occurrence) == null ? void 0 : P.performer.name,
                              "data-partner-key": h.key,
                              disabled: gt,
                              onClick: () => {
                                nr.current = A.key, un(h), Ie("");
                              },
                              children: [
                                h.occurrence && /* @__PURE__ */ r(qr, { performer: h.occurrence.performer }),
                                /* @__PURE__ */ r("span", { children: (Q = h.occurrence) == null ? void 0 : Q.performer.name })
                              ]
                            },
                            h.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ r(
                    Pu,
                    {
                      tags: ht,
                      preview: Sn,
                      showPreview: !Re,
                      trees: tr,
                      actionTagIds: Tr,
                      label: `Current ${Ze ? "occurrence" : g.one} tags`
                    }
                  ),
                  Re && /* @__PURE__ */ c(
                    "fieldset",
                    {
                      ref: Wn,
                      disabled: Te,
                      className: "dq-panel-section dq-tag-editor",
                      children: [
                        /* @__PURE__ */ c("legend", { className: "dq-eyebrow", children: [
                          "Edit ",
                          Ze ? "occurrence" : g.one,
                          " tags"
                        ] }),
                        /* @__PURE__ */ r(
                          An,
                          {
                            entityType: "tag",
                            values: nt,
                            onChange: It,
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
                              disabled: !ht,
                              onClick: () => void Gt(void 0, !0, !0),
                              children: "Save"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              disabled: !ht,
                              onClick: () => void Gt(void 0, !1, !0),
                              children: "Save & next"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              onClick: () => {
                                wn(!1), requestAnimationFrame(() => {
                                  var h;
                                  return (h = Dt.current) == null ? void 0 : h.focus();
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
                Ae(We) && D.performerFocus && /* @__PURE__ */ r(
                  ou,
                  {
                    review: We,
                    performerId: D.performerFocus,
                    revision: _e
                  }
                )
              ] }),
              /* @__PURE__ */ c("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ c("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !w && Pn,
                  tt && /* @__PURE__ */ r("p", { role: "status", children: tt })
                ] }),
                !t && /* @__PURE__ */ r("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                A && /* @__PURE__ */ c("div", { className: "dq-panel-actions", "aria-busy": rr || void 0, children: [
                  /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      ref: Dt,
                      className: "dq-button",
                      disabled: gt || !!w || !t || !ht,
                      onClick: () => {
                        ot.current = [...ht.ids], It([...ht.ids]), wn(!0);
                      },
                      children: [
                        /* @__PURE__ */ r(Xo, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: gt || !!w,
                      onClick: () => void Gt(),
                      children: [
                        /* @__PURE__ */ r(il, { "aria-hidden": "true" }),
                        "Skip",
                        Ze ? " performer" : ` ${g.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              Ze && /* @__PURE__ */ c(
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
                        "aria-pressed": Mt === "items",
                        onClick: () => Zt("items"),
                        children: f === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": Mt === "performers",
                        onClick: () => Zt("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              Ze && Mt === "performers" ? /* @__PURE__ */ r(
                mu,
                {
                  ranking: (rt == null ? void 0 : rt.signature) === Me ? rt : null,
                  busy: M,
                  error: (ee == null ? void 0 : ee.signature) === Me ? ee.message : "",
                  focus: D.performerFocus,
                  disabled: gt,
                  labels: g,
                  onFocus: mr,
                  onMore: () => {
                    const h = Kt.current;
                    h && Vt(h, h.limit + Va);
                  },
                  onRefresh: () => {
                    C(null), Vt(null, Va);
                  }
                }
              ) : /* @__PURE__ */ r("div", { className: "dq-queue-list", ref: Fn, children: ce.map((h) => {
                var P;
                const S = (A == null ? void 0 : A.key) === h.key;
                return /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: b(h),
                    "aria-label": b(h),
                    "aria-current": S ? "true" : void 0,
                    disabled: gt,
                    onClick: () => {
                      un(h), Ie(""), Se("");
                    },
                    children: [
                      /* @__PURE__ */ r(Fu, { media: h.media, kind: f }),
                      /* @__PURE__ */ c("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: N(h.media) }),
                        /* @__PURE__ */ c("span", { className: "dq-queue-row-meta", children: [
                          h.occurrence && /* @__PURE__ */ c(pe, { children: [
                            /* @__PURE__ */ r(qr, { performer: h.occurrence.performer }),
                            /* @__PURE__ */ r("span", { className: "dq-queue-row-performer", children: h.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ r("span", { className: "dq-queue-row-detail", children: [
                            h.media.date,
                            h.occurrence ? "" : (P = h.media.files[0]) != null && P.duration ? Jo(h.media.files[0].duration) : ""
                          ].filter(Boolean).join(" · ") })
                        ] })
                      ] })
                    ]
                  },
                  h.key
                );
              }) })
            ] })
          ] }) })
        ] }),
        Ze && /* @__PURE__ */ r(
          zc,
          {
            open: Et,
            onClose: () => yn(!1),
            criteria: hi,
            activeFilter: Ze.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (h) => {
              yn(!1), tn({ performerFilter: h });
            }
          }
        ),
        _t && /* @__PURE__ */ r(
          Mi,
          {
            actions: e.actions,
            trees: tr,
            isDisabled: (h) => lt(h),
            tapStays: dn && Xe,
            onApply: (h, S) => {
              $t(!1), Gt(h, S);
            },
            onClose: () => $t(!1)
          }
        )
      ]
    }
  );
}
const uc = "data-quality.reviews-sort.v1", Lu = { sort: "name", direction: "asc" };
function Du() {
  try {
    const e = JSON.parse(localStorage.getItem(uc) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return Lu;
}
function _u(e) {
  try {
    localStorage.setItem(
      uc,
      JSON.stringify({ sort: e.sort, direction: e.direction })
    );
  } catch {
  }
}
function fc(e, t, n, a) {
  const i = a === "asc" ? 1 : -1;
  return [...e].sort((o, s) => {
    if (n === "count") {
      const l = t[o.id], d = t[s.id], p = typeof l == "number", f = typeof d == "number";
      if (p !== f) return p ? -1 : 1;
      if (p && f && l !== d)
        return (l - d) * i;
    }
    return o.name.localeCompare(s.name, void 0, { numeric: !0, sensitivity: "base" }) * i;
  });
}
function Ja(e, t) {
  const n = xe(e), a = gn(qi(n)), i = n === "tag" ? "tag" : Ae(e) ? a.queue : a.one;
  return t === 1 ? i : `${i}s`;
}
function ju({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ c(pe, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      Ja(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ c(pe, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
      "Matching ",
      Ja(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ c(pe, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      Ja(e, t)
    ] })
  ] });
}
function Uu({
  reviews: e,
  counts: t,
  sort: n,
  direction: a,
  onSortChange: i,
  onDirectionChange: o,
  storage: s,
  canConfigure: l,
  busy: d,
  headingRef: p,
  notices: f,
  onOpen: g,
  onNew: m,
  onImport: N,
  onExportAll: b,
  rowMenuItems: q
}) {
  const E = R(null), w = Ce(
    () => fc(e, t, n, a),
    [e, t, n, a]
  ), I = e.every((_) => t[_.id] !== void 0), x = a === "asc" ? "ascending" : "descending";
  return /* @__PURE__ */ c("div", { className: "dq-reviews-page", children: [
    /* @__PURE__ */ c("header", { className: "dq-reviews-header", children: [
      /* @__PURE__ */ r("h1", { ref: p, tabIndex: -1, children: "Data Quality" }),
      /* @__PURE__ */ c("div", { className: "dq-reviews-header-actions", children: [
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: "dq-header-button",
            title: "Add the reviews in a review file",
            disabled: !l || d,
            onClick: () => {
              var _;
              return (_ = E.current) == null ? void 0 : _.click();
            },
            children: [
              /* @__PURE__ */ r(ol, { "aria-hidden": "true" }),
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
            onChange: (_) => {
              var U;
              const K = (U = _.target.files) == null ? void 0 : U[0];
              _.target.value = "", K && N(K);
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
              /* @__PURE__ */ r(as, { "aria-hidden": "true" }),
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
              /* @__PURE__ */ r(gi, { "aria-hidden": "true" }),
              "New review"
            ]
          }
        )
      ] })
    ] }),
    f,
    e.length ? /* @__PURE__ */ c("section", { className: "dq-reviews", "aria-label": "Reviews", children: [
      /* @__PURE__ */ c("div", { className: "dq-reviews-bar", children: [
        /* @__PURE__ */ c("p", { className: "dq-reviews-summary", children: [
          e.length === 1 ? "1 review" : `${e.length.toLocaleString()} reviews`,
          " ·",
          " ",
          s
        ] }),
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: I ? e.some((_) => t[_.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
        /* @__PURE__ */ c("div", { className: "dq-reviews-sort", children: [
          /* @__PURE__ */ c("label", { children: [
            /* @__PURE__ */ r("span", { children: "Sort by" }),
            /* @__PURE__ */ c(
              "select",
              {
                className: "dq-select",
                value: n,
                onChange: (_) => i(_.target.value),
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
              "aria-label": `Sort direction: ${x}`,
              title: `Sort direction: ${x}`,
              onClick: () => o(a === "asc" ? "desc" : "asc"),
              children: a === "asc" ? /* @__PURE__ */ r(sl, { "aria-hidden": "true" }) : /* @__PURE__ */ r(cl, { "aria-hidden": "true" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ c("table", { className: "dq-reviews-table", children: [
        /* @__PURE__ */ r("thead", { children: /* @__PURE__ */ c("tr", { children: [
          /* @__PURE__ */ r("th", { scope: "col", "aria-sort": n === "name" ? x : void 0, children: "Review" }),
          /* @__PURE__ */ r("th", { scope: "col", className: "dq-reviews-type", children: "Type" }),
          /* @__PURE__ */ r(
            "th",
            {
              scope: "col",
              className: "dq-reviews-count",
              "aria-sort": n === "count" ? x : void 0,
              children: "Matching"
            }
          ),
          /* @__PURE__ */ r("th", { scope: "col", className: "dq-reviews-actions", children: /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Actions" }) })
        ] }) }),
        /* @__PURE__ */ r("tbody", { children: w.map((_) => {
          const K = xe(_);
          return /* @__PURE__ */ c("tr", { children: [
            /* @__PURE__ */ r("td", { children: /* @__PURE__ */ c(
              "a",
              {
                className: "dq-reviews-link",
                href: `?review=${encodeURIComponent(_.id)}`,
                "data-review-id": _.id,
                onClick: (U) => {
                  U.button !== 0 || U.metaKey || U.ctrlKey || U.shiftKey || U.altKey || (U.preventDefault(), g(_.id));
                },
                children: [
                  /* @__PURE__ */ r("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ r(Us, { entityType: K }) }),
                  /* @__PURE__ */ c("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ r("span", { className: "dq-reviews-name", children: _.name }),
                    _.description && /* @__PURE__ */ r("span", { className: "dq-reviews-description", title: _.description, children: _.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-type", children: js[K] }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-count", children: /* @__PURE__ */ r(ju, { review: _, count: t[_.id] }) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ r(xi, { label: `Actions for ${_.name}`, items: q(_) }) })
          ] }, _.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ c("div", { className: "dq-empty", children: [
      /* @__PURE__ */ r(qa, { "aria-hidden": "true" }),
      /* @__PURE__ */ r("p", { children: "No reviews yet." }),
      /* @__PURE__ */ r("p", { children: l ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function hc(e, { id: t, name: n, description: a }) {
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
function Ku({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: a
}) {
  const { review: i, saving: o, error: s } = e, l = R(null), d = R(null), p = R(o);
  p.current = o;
  const f = R(null), g = St();
  J(() => {
    var b;
    return f.current ?? (f.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), l.current && !l.current.open && l.current.showModal(), (b = d.current) == null || b.focus(), () => {
      var q;
      (q = f.current) != null && q.isConnected && f.current.focus({ preventScroll: !0 });
    };
  }, []);
  const m = R(o);
  J(() => {
    var E, w;
    const b = document.activeElement, q = !b || b === document.body || !((E = l.current) != null && E.contains(b));
    s && (!i.name.trim() || m.current && !o && q) && ((w = d.current) == null || w.focus()), m.current = o;
  }, [s, o]);
  const N = () => {
    p.current || a();
  };
  return /* @__PURE__ */ r(
    "dialog",
    {
      ref: l,
      className: "dq-form-dialog",
      "aria-labelledby": g,
      "aria-modal": "true",
      onCancel: (b) => {
        b.preventDefault(), N();
      },
      onClose: () => {
        var b;
        p.current ? (b = l.current) == null || b.showModal() : a();
      },
      children: /* @__PURE__ */ c(
        "form",
        {
          onSubmit: (b) => {
            b.preventDefault(), p.current || n();
          },
          children: [
            /* @__PURE__ */ c("header", { className: "dq-form-dialog-header", children: [
              /* @__PURE__ */ r("h2", { id: g, children: "New review" }),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-icon-button",
                  "aria-label": "Close dialog",
                  title: "Close",
                  disabled: o,
                  onClick: N,
                  children: /* @__PURE__ */ r(Vr, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ c("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ r("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              s && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: s }),
              /* @__PURE__ */ c("fieldset", { className: "dq-form-dialog-fields", disabled: o, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ r(
                  Gs,
                  {
                    review: i,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (b) => {
                      b !== xe(i) && t(hc(b, i));
                    },
                    nameRef: d
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ c("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ r("button", { type: "button", className: "dq-text-button", onClick: () => Pi(i), children: "Export draft" }),
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
const Gu = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function Bu(e, t, n, a) {
  return dc(
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
function Fo(e, t) {
  return xe(t) === "video" && Hr(t.view.objectFilter, e.view.objectFilter).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function Po(e, t) {
  return fr(
    JSON.parse(Gn(ur(e))),
    JSON.parse(Gn(ur(t)))
  );
}
const za = 180;
function xo(e) {
  return xe(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function Lo(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Do() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Qa(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  Aa.forEach((i) => n.delete(i)), e ? n.set("review", e) : n.delete("review");
  const a = n.toString();
  lc(`${window.location.pathname}${a ? `?${a}` : ""}`, { openingFromList: t });
}
function Vu(e) {
  return xt({ ...e, page: 1 });
}
function pc(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Nr(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Ju = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(bi, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ r(ul, { "aria-hidden": "true" }) }
], zu = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(bi, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ r(dl, { "aria-hidden": "true" }) }
], _o = [], mc = "(min-width: 900px)";
function Qu(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(mc);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function Wu() {
  return typeof window.matchMedia == "function" && window.matchMedia(mc).matches;
}
function Hu({
  onNavigate: e
}) {
  const [t, n] = k([]), [a] = k(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [i, o] = k(""), [s, l] = k(!0), [d, p] = k(""), [f, g] = k(!1), [m, N] = k(!1), [b, q] = k(!1), [E, w] = k(!1), [I, x] = k([]), [_, K] = k(""), [U, te] = k(!0), [G, W] = k("account"), [V, F] = k(""), [D, v] = k(""), [T, Y] = k(!1), [H, de] = k(!1), [ce, B] = k(""), [A, j] = k(Do), Z = R(A);
  Z.current = A;
  const [qe, Ne] = k({}), ft = R(qe);
  ft.current = qe;
  const it = R(t);
  it.current = t;
  const wt = R(s);
  wt.current = s;
  const Ot = R(!1), Ye = R(!0);
  J(() => (Ye.current = !0, () => {
    Ye.current = !1;
  }), []);
  const [Be, Xt] = k(!A);
  Be !== !A && (Xt(!A), A || Ne({}));
  const [Te, bn] = k(Du), { sort: le, direction: je } = Te, yt = (u) => {
    const y = { ...Te, ...u };
    bn(y), _u(y);
  }, ln = R(null), Ie = R(null), [tt, Se] = k(null), [ht, Lt] = k(!1), [Re, wn] = k(!1), [nt, It] = k(null), [ot, Dt] = k(null), pt = !!nt || !!ot, Wn = R(pt);
  Wn.current = pt;
  const Et = ht || !!ot || Re, [yn, _t] = k(0), [$t, dn] = k(!1), [ge, vt] = k(null), Xe = R(null), On = R(null), jt = R(null), [Le, Ct] = k(
    null
  ), ne = t.find((u) => u.id === A) ?? null, $ = Ce(
    () => (Le == null ? void 0 : Le.id) === A && ne ? { ...ne, view: {
      ...ne.view,
      filter: Le.view.filter,
      objectFilter: Le.view.objectFilter,
      searchMode: Le.view.searchMode,
      startFrom: Le.view.startFrom
    } } : ne,
    [Le, A, ne]
  ), ye = $ ? xe($) : "video", st = qi(ye), In = $ ? Ae($) : !1, oe = ye === "video" ? $ : null, kt = In && !!($ != null && $.actions.some(Jn)), Qe = !!oe || ye === "audio" || kt, [De, We] = k(null), Ut = (De == null ? void 0 : De.id) === ($ == null ? void 0 : $.id) ? De == null ? void 0 : De.mode : ($ == null ? void 0 : $.view.reviewMode) ?? "single", He = In || ye === "audio" || ye === "video" && Ut === "single", [mt, Mt] = k(0), Zt = R(-1), rt = R(!1), pr = R(He);
  pr.current = He, J(() => {
    const u = () => {
      const y = pr.current;
      if (!y && Sn.current) {
        rt.current = !0;
        return;
      }
      Zt.current = -1, Wi(), y || Mt((O) => O + 1);
    };
    return window.addEventListener("popstate", u), () => window.removeEventListener("popstate", u);
  }, []);
  const Kt = st === "audio" ? m : f, $n = ye === "tag" ? "Tag" : st === "audio" ? "Audio" : "Video", C = ye === "tag" ? b : Kt, M = R(
    null
  ), re = Cu(oe), [ee, Ee] = k({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [we, Me] = k({
    page: 1,
    perPage: 40
  }), [_e, At] = k({ items: [], totalCount: 0 }), [ve, en] = k(A);
  ve !== A && (en(A), At({ items: [], totalCount: 0 }), de(!1));
  const [ue, vn] = k(!1), [Ve, Hn] = k(""), [gt, Nn] = k(!1), [Tt, Mn] = k(!1), [at, Ft] = k(() => /* @__PURE__ */ new Set()), un = R(at);
  un.current = at;
  const fn = R(/* @__PURE__ */ new Map()), Gt = ($ == null ? void 0 : $.view.selectAllOnLoad) === !0, [ct, lt] = k(null), Nt = R(ct);
  Nt.current = ct;
  const [bt, qn] = k(!1), Bt = R(bt);
  Bt.current = bt;
  const Yr = R(null), [Ze, tn] = k(!1), [Vt, Yn] = k("grid"), [Xn, Xr] = k(za), [ie, mr] = k(!1), [Zn, er] = k(!1), Sn = R(!1), [tr, Tr] = k(""), [Fn, Jt] = k(""), [nr, zt] = k(""), [Oe, Rr] = k(null), [Zr, Pn] = k(""), [rr, gr] = k(!1), [br, Or] = k({}), xn = R(/* @__PURE__ */ new Map()), Ir = R(null), ar = R(null), Ln = !!$, ea = ui(Qu, Wu, () => !1) && Ln, [h, S] = k({ top: 0, bottom: 0 });
  cn(() => {
    if (!Ln) return;
    const u = () => {
      const O = ar.current;
      if (!O) return;
      const L = Math.round(O.getBoundingClientRect().top + window.scrollY), X = O.closest("main"), z = X ? Math.round(parseFloat(getComputedStyle(X).paddingBottom) || 0) : 0;
      S(
        (me) => me.top === L && me.bottom === z ? me : { top: L, bottom: z }
      );
    };
    u();
    const y = typeof ResizeObserver > "u" ? null : new ResizeObserver(u);
    return y == null || y.observe(document.body), window.addEventListener("resize", u), () => {
      y == null || y.disconnect(), window.removeEventListener("resize", u);
    };
  }, [Ln]);
  const [P, Q] = k(0), ae = R(null), fe = pn((u) => {
    var O;
    if ((O = ae.current) == null || O.disconnect(), ae.current = null, !u || typeof ResizeObserver > "u") return;
    const y = new ResizeObserver(
      () => Q(Math.round(u.getBoundingClientRect().height))
    );
    y.observe(u), ae.current = y;
  }, []), ke = R(0), dt = R(0), Qt = R(null), Je = R(null), qt = Rs(
    $ && !He ? ge ? [...$.actions, ...ge.draft.actions] : $.actions : _o
  ), Ue = Ce(
    () => ge && $ && ne ? Bu(ge.draft, $, ee, ne) : null,
    [ge, $, ee, ne]
  ), En = Ce(
    () => $ && ne ? dc(
      { ...ne, view: { ...$.view, filter: { ...ee, page: 1 } } },
      ne
    ) : null,
    [$, ne, ee]
  ), Fe = Ce(
    () => ne ? Sr(ur(ne)) : "",
    [ne]
  ), nn = Ce(
    () => En != null && Sr(ur(En)) !== Fe,
    [En, Fe]
  ), ta = Ce(
    () => Ue != null && Sr(ur(Ue)) !== Fe,
    [Ue, Fe]
  );
  J(() => {
    if (!Fn) return;
    const u = window.setTimeout(() => Jt(""), 4e3);
    return () => window.clearTimeout(u);
  }, [Fn]), J(() => {
    if (!tt || tt.alert) return;
    const u = window.setTimeout(() => Se(null), 6e3);
    return () => window.clearTimeout(u);
  }, [tt]), J(() => {
    const u = oe ? _i(oe.view.objectFilter) : [];
    if (Or({}), !u.length) return;
    const y = new AbortController();
    let O = !0;
    return Promise.all(
      u.map(async (L) => {
        var X;
        try {
          const z = await se(`/api/tags/${L}`, {
            signal: y.signal
          });
          return (X = z.name) != null && X.trim() ? [String(L), z.name] : null;
        } catch {
          return null;
        }
      })
    ).then((L) => {
      O && Or(
        Object.fromEntries(L.filter((X) => X !== null))
      );
    }), () => {
      O = !1, y.abort();
    };
  }, [oe == null ? void 0 : oe.id, oe == null ? void 0 : oe.view.objectFilter]);
  const Ta = Ce(
    () => oe ? ji(
      oe.view.objectFilter,
      br
    ) : ($ == null ? void 0 : $.view.objectFilter) ?? {},
    [br, $, oe]
  ), $r = pn(async () => {
    l(!0), p("");
    try {
      const u = await Rl();
      n(u.reviews), o(u.storageKey), g(u.canWriteVideos ?? u.canWrite), N(u.canWriteAudios ?? !1), q(u.canWriteTags ?? !1), w(u.canReadTagGroups ?? !1), te(u.canConfigure ?? !0), W(u.storage ?? "account"), F(u.storageNotice ?? ""), A && !u.reviews.some((y) => y.id === A) && (j(""), Qa(""));
    } catch (u) {
      p(
        u instanceof Error ? u.message : "Could not load reviews."
      );
    } finally {
      l(!1);
    }
  }, [A]);
  J(() => {
    if (!E) {
      x([]), K("");
      return;
    }
    const u = new AbortController();
    return K(""), jl(u.signal).then(x).catch((y) => {
      u.signal.aborted || K(
        y instanceof Error ? y.message : "Could not load tag groups."
      );
    }), () => u.abort();
  }, [E]), J(() => {
    $r();
  }, []), J(() => {
    if (A || t.length === 0) return;
    const u = new AbortController();
    for (const y of t) {
      if (typeof ft.current[y.id] == "number") continue;
      (Ae(y) ? Ui(y, u.signal).then((L) => (L == null ? void 0 : L.length) === 0 ? { items: [], totalCount: 0 } : Lr(Ki(y, L), { ...y.view.filter, page: 1, perPage: 1 }, u.signal)) : xe(y) === "tag" ? lo(
        y,
        xt({ ...y.view.filter, page: 1, perPage: 1 }),
        u.signal
      ) : Lr(
        y,
        xt({ ...y.view.filter, page: 1, perPage: 1 }),
        u.signal
      )).then((L) => {
        u.signal.aborted || Ne((X) => ({
          ...X,
          [y.id]: L.totalCount
        }));
      }).catch(() => {
        u.signal.aborted || Ne((L) => ({ ...L, [y.id]: null }));
      });
    }
    return () => u.abort();
  }, [A, t]), cn(() => {
    var O, L;
    const u = Ie.current;
    if (A || s || !u) return;
    Ie.current = null, (L = (u === "heading" ? null : [...((O = ar.current) == null ? void 0 : O.querySelectorAll("[data-review-id]")) ?? []].find(
      (X) => X.dataset.reviewId === u.reviewId
    )) ?? ln.current) == null || L.focus();
  }, [A, s, ot, t]);
  const Mr = R(0), Dn = pn(async () => {
    const u = ++Mr.current;
    Rr(null), Pn("");
    try {
      const y = await (kt ? ws(st) : bs(st));
      u === Mr.current && Rr(y);
    } catch (y) {
      if (u !== Mr.current) return;
      Rr(null), Pn(
        "Tag assessment setup could not be checked. " + (y instanceof Error ? y.message : "Request failed.")
      );
    }
  }, [kt, st]);
  J(() => {
    Dn();
  }, [Dn]);
  const rn = pn(
    async (u, y, O = !1, L = !1) => {
      var Rt, Pe;
      const X = ++ke.current;
      (Rt = Qt.current) == null || Rt.abort();
      const z = new AbortController();
      Qt.current = z, y = xt(y);
      const me = Number(y.page);
      O && (y = { ...y, page: 1 }), Ee(y), Mn(O), vn(!0), Hn("");
      try {
        const Ke = (Cn) => xe(u) === "tag" ? lo(
          u,
          Cn,
          z.signal
        ) : Lr(
          u,
          Cn,
          z.signal
        );
        let be = await Ke(y);
        const ze = Math.max(
          1,
          Math.ceil(be.totalCount / Number(y.perPage))
        ), wr = O ? ze : Math.min(me, ze);
        return Number(y.page) !== wr && (y = { ...y, page: wr }, be = await Ke(y)), X === ke.current && (((Pe = Je.current) == null ? void 0 : Pe.page) !== wr && (Je.current = {
          page: wr,
          ids: new Set(be.items.map((Cn) => Cn.id))
        }), At(be), L && hn(
          () => new Set(be.items.map((Cn) => Cn.id))
        ), Ee(y), Me(y)), be;
      } catch (Ke) {
        throw X === ke.current && Hn(
          Ke instanceof Error ? Ke.message : "Could not load the review queue."
        ), Ke;
      } finally {
        X === ke.current && vn(!1);
      }
    },
    []
  );
  J(() => {
    var y;
    if (dt.current += 1, Zt.current = -1, ke.current += 1, (y = Qt.current) == null || y.abort(), vt(null), Xe.current = null, de(!1), B(""), v(""), Y(!1), Ft(/* @__PURE__ */ new Set()), fn.current.clear(), lt(null), qn(!1), mr(!1), Sn.current = !1, Tr(""), Jt(""), zt(""), At({ items: [], totalCount: 0 }), Je.current = null, Nn(!1), !$ || He) {
      vn(!1), Ct(null);
      return;
    }
    let u = !0;
    return vn(!0), (async () => {
      let O = ne ?? $;
      Ct(null);
      let L = null;
      const X = new URLSearchParams(window.location.search);
      if (xe($) === "video" && Aa.some((Pe) => X.has(Pe)))
        try {
          const Pe = O;
          L = di(Pe, X);
          const Ke = mn(Pe, L.query);
          (L.query.startFrom !== (Pe.view.startFrom ?? "end") || !fr(
            JSON.parse(Gn(Ke)),
            JSON.parse(Gn(mn(Pe, hr(Pe))))
          )) && (O = Ke, Ct(O));
        } catch (Pe) {
          Nn(!0), Hn(Pe instanceof Error ? Pe.message : "Could not read review URL."), vn(!1);
          return;
        }
      let z = null;
      try {
        z = await $l(i, $.id);
      } catch (Pe) {
        u && (Y(!0), v(
          Pe instanceof Error ? Pe.message : "Could not load progress."
        ));
      }
      if (!u) return;
      const me = (z == null ? void 0 : z.signature) === Gn(O) ? z : null, Rt = L ? L.query.filter : me ? xt(me.filter) : Vu(O.view.filter);
      Ee(Rt), Yn(
        me ? Lo(me.displayMode, xe($)) : xo($)
      ), Xr(
        me ? me.cardSize ?? za : za
      );
      try {
        const Pe = await rn(
          O,
          Rt,
          L ? L.startAtEnd : !me && O.view.startFrom !== "beginning",
          O.view.selectAllOnLoad === !0
        );
        if (!u) return;
        const Ke = io(
          Pe.items.map((be) => be.id),
          (me == null ? void 0 : me.focusedId) ?? null,
          (me == null ? void 0 : me.index) ?? 0
        );
        lt(Ke), ut(Ke);
      } catch {
      }
      u && (Zt.current = mt, de(!0), B(`${$.id}:${mt}`));
    })(), () => {
      var O;
      u = !1, dt.current++, ke.current++, (O = Qt.current) == null || O.abort();
    };
  }, [$ == null ? void 0 : $.id, He, mt]), J(() => {
    if (!(!yn || He || !$)) {
      if (gt) {
        _t(0);
        return;
      }
      ie || ge || ce !== `${$.id}:${mt}` || (_t(0), La());
    }
  }, [yn, He, $ == null ? void 0 : $.id, ce, ie, mt, gt]), J(() => {
    !oe || He || !H || ue || Ve || ie || rt.current || Zt.current !== mt || Dr(oe.id, {
      filter: ee,
      objectFilter: oe.view.objectFilter,
      searchMode: oe.view.searchMode,
      startFrom: oe.view.startFrom ?? "end"
    });
  }, [oe, He, H, ue, Ve, ee, ie, mt]);
  const he = Ce(
    () => _e.items.map((u) => u.id),
    [_e.items]
  );
  J(() => {
    if (!H || !$ || !i || ue || Ve || ie || (Le == null ? void 0 : Le.id) === $.id || T || Zt.current !== mt)
      return;
    const u = {
      version: 1,
      signature: Gn($),
      filter: ee,
      focusedId: ct,
      index: Math.max(0, he.indexOf(ct ?? -1)),
      displayMode: Vt,
      cardSize: Xn,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        i + ":progress:" + $.id,
        JSON.stringify(u)
      );
    } catch {
    }
    if (D) return;
    let y = !0;
    const O = window.setTimeout(() => {
      Ml(i, $.id, u).catch((L) => {
        y && v(
          "Progress is kept in this browser, but account sync failed. " + (L instanceof Error ? L.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      y = !1, window.clearTimeout(O);
    };
  }, [
    H,
    i,
    $,
    ue,
    Ve,
    ie,
    ee,
    ct,
    he,
    Vt,
    Xn,
    Le,
    D,
    T,
    mt
  ]);
  const na = _e.items.find((u) => u.id === ct) ?? null, Ra = ye === "video" ? na : null;
  bt && Ra && (Yr.current = Ra);
  const ir = Ra ?? (bt ? Yr.current : null), gc = oo(at, ct), bc = he.length > 0 && he.every((u) => at.has(u)), ut = pn((u, y = !0) => {
    u != null && window.requestAnimationFrame(() => {
      var L;
      if (Wn.current || Sl(document.activeElement) || (L = document.activeElement) != null && L.closest(".dq-drawer"))
        return;
      const O = xn.current.get(u);
      O == null || O.focus({ preventScroll: !0 }), y && (O == null || O.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  J(() => {
    H && !Bt.current && ut(Nt.current);
  }, [H, ut]), J(() => {
    ue || !he.length || (Nt.current == null || !he.includes(Nt.current)) && (lt(he[0]), Bt.current || ut(he[0]));
  }, [ut, he, ue]);
  const hn = pn(
    (u) => {
      Ft((y) => {
        const O = u(y);
        for (const L of /* @__PURE__ */ new Set([...y, ...O]))
          y.has(L) !== O.has(L) && fn.current.set(
            L,
            (fn.current.get(L) ?? 0) + 1
          );
        return O;
      });
    },
    []
  ), Oa = pn(
    (u) => {
      if (!he.length) return;
      const y = Math.max(
        0,
        he.indexOf(Nt.current ?? he[0])
      ), O = he[Math.max(0, Math.min(he.length - 1, y + u))];
      lt(O), Bt.current || ut(O);
    },
    [ut, he]
  ), ra = pn(
    async (u) => {
      const y = "steps" in u ? u.steps.length > 0 : u.effect.mode !== "SKIP", O = "effect" in u && u.effect.mode === "SET_TAG_GROUP" ? u.effect.tagGroupId : null, L = O != null && (!E || !I.some((Ge) => Ge.id === O)), X = "effect" in u && y && !E, z = oo(
        un.current,
        Nt.current
      );
      if (!$ || Sn.current || ue || Ve) return;
      const me = y && !C ? `${$n} write permission is required to apply ${u.label}.` : X || L ? `${u.label} needs a tag group that is unavailable.` : Jn(u) && (Oe == null ? void 0 : Oe.kind) !== "ready" ? `Set up tag assessments before applying ${u.label}.` : z.length ? "" : `Select or focus a ${ye} before applying ${u.label}.`;
      if (me) {
        zt(me);
        return;
      }
      const Rt = ++dt.current, Pe = $.id, Ke = [...he], be = _e, ze = Nt.current, wr = new Set(un.current), Cn = new Map(
        z.map((Ge) => [Ge, fn.current.get(Ge) ?? 0])
      ), yr = () => Rt === dt.current && $.id === Pe;
      Sn.current = !0, mr(!0), Tr(
        un.current.size ? `${z.length} selected ${ye}s` : `the focused ${ye}`
      ), Jt(""), zt("");
      const eo = be.items.filter(
        (Ge) => !z.includes(Ge.id)
      ), Pc = eo.map((Ge) => Ge.id), to = so(
        Ke,
        Pc,
        ze,
        z.includes(ze ?? -1)
      );
      At({
        items: eo,
        totalCount: be.totalCount
      }), Ft((Ge) => {
        const Pt = new Set(Ge);
        for (const an of z) Pt.delete(an);
        return Pt;
      }), lt(to), Bt.current || ut(to);
      let Da = !1;
      try {
        if ("effect" in u ? await Hl(u, z) : await vs(st, u, z), Da = !0, !yr()) return;
        Ft((Ge) => {
          const Pt = new Set(Ge);
          for (const an of z)
            (fn.current.get(an) ?? 0) === Cn.get(an) && Pt.delete(an);
          return Pt;
        }), Jt(
          `${u.label}: ${z.length} ${ye}${z.length === 1 ? "" : "s"} ${y ? "updated" : "skipped"}.`
        );
      } catch (Ge) {
        if (!yr()) return;
        At(be), Ft((Pt) => {
          const an = new Set(Pt);
          for (const Wt of z)
            wr.has(Wt) && (fn.current.get(Wt) ?? 0) === Cn.get(Wt) && an.add(Wt);
          return an;
        }), lt(ze), Bt.current || ut(ze), zt(
          Ge instanceof Error ? Ge.message : "Action failed."
        );
      }
      try {
        if (await Gl(u), !yr()) return;
        const Ge = new Set(z), Pt = Gt && Ke.length > 0 && Ke.every((on) => Ge.has(on)), an = await rn($, ee, !1, Pt);
        if (!yr()) return;
        let Wt = an.items.map((on) => on.id);
        const ia = Je.current, xc = (ia == null ? void 0 : ia.page) === Number(ee.page) && Wt.some((on) => ia.ids.has(on)), Lc = ($.view.startFrom ?? "end") !== "beginning";
        if (an.totalCount > 0 && Number(ee.page) > 1 && (!Wt.length || Lc && !xc)) {
          const on = Math.max(1, Number(ee.page) - 1), oa = { ...ee, page: on };
          Ee(oa), Wt = (await rn(
            $,
            oa,
            !1,
            Pt
          )).items.map((_a) => _a.id), Ft(
            (_a) => new Set([..._a].filter((Dc) => Wt.includes(Dc)))
          );
          const ro = Wt.at(-1) ?? null;
          lt(ro), Bt.current || ut(ro);
        } else {
          Ft(
            (oa) => new Set([...oa].filter((no) => Wt.includes(no)))
          );
          const on = so(
            Ke,
            Wt,
            ze,
            Da && z.includes(ze ?? -1)
          );
          lt(on), Bt.current && on == null && qn(!1), Bt.current || ut(on);
        }
      } catch (Ge) {
        yr() && zt(
          (Pt) => `${Pt ? `${Pt} ` : ""}${Da ? "The action completed, but " : ""}the queue could not be refreshed. ${Ge instanceof Error ? Ge.message : "Refresh failed."}`
        );
      } finally {
        yr() && (Sn.current = !1, mr(!1), Tr(""), rt.current && (rt.current = !1, Wi(), Mt((Ge) => Ge + 1)));
      }
    },
    [
      C,
      E,
      I,
      ye,
      Oe,
      rn,
      ee,
      ut,
      he,
      _e,
      ue,
      Ve,
      $
    ]
  );
  function wc() {
    var O;
    if (Vt === "list") return 1;
    const u = (O = Ir.current) == null ? void 0 : O.firstElementChild, y = u ? getComputedStyle(u).gridTemplateColumns : "";
    return Math.max(1, y.split(" ").filter(Boolean).length);
  }
  const Vi = R(() => {
  });
  Vi.current = (u) => {
    var z;
    if (He || u.defaultPrevented || u.repeat || u.ctrlKey || u.altKey || u.metaKey || pt) return;
    const y = u.target, O = y instanceof Node && ((z = ar.current) == null ? void 0 : z.contains(y)) === !0, L = y === document.body || y === document.documentElement;
    if (!O && !L) return;
    if (Ze) {
      u.key === "Escape" && (Nr(u), tn(!1));
      return;
    }
    if (bt && u.key === "Escape") {
      Nr(u), qn(!1), ut(Nt.current);
      return;
    }
    if (!ql(y)) return;
    const X = Nl(y);
    if (u.key === "Escape") {
      Nr(u), hn(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!bt && u.key === " " && X) {
      Nr(u), ct != null && hn((me) => fa(me, ct));
      return;
    }
    if (!(ie || ue) && !bt && u.key === "Enter" && ct != null && X) {
      if (ye !== "tag" && ge) return;
      Nr(u), ye === "tag" ? window.open(`/tag/${ct}`, "_blank", "noopener,noreferrer") : qn(!0);
      return;
    }
  }, J(() => {
    const u = (y) => Vi.current(y);
    return document.addEventListener("keydown", u), () => document.removeEventListener("keydown", u);
  }, []);
  const Ji = R(
    () => {
    }
  );
  Ji.current = (u) => {
    var z;
    if (He || pt || bt || Ze || ie || ue || !he.length || u.defaultPrevented || u.repeat || u.ctrlKey || u.altKey || u.metaKey)
      return;
    const y = u.target, O = y instanceof Node && ((z = ar.current) == null ? void 0 : z.contains(y)) === !0, L = y === document.body || y === document.documentElement;
    if (!O && !L || !u.key.startsWith("Arrow") || !El(y)) return;
    const X = Cl(u.key, wc());
    X && (u.preventDefault(), O ? u.stopImmediatePropagation() : u.stopPropagation(), Oa(X));
  }, J(() => {
    const u = (y) => Ji.current(y);
    return document.addEventListener("keydown", u), () => document.removeEventListener("keydown", u);
  }, []);
  const _n = (ge == null ? void 0 : ge.saving) === !0 || Zn, Ia = ie || ue && !H || _n, yc = Oi();
  Ri({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!$ && !He && !pt && !ge && !bt && !Ze && !Ve && (_e.items.length > 0 || ue || ie),
    actions: ($ == null ? void 0 : $.actions) ?? _o,
    onAction: (u) => {
      const y = $ == null ? void 0 : $.actions[u];
      y && ra(y);
    },
    onFind: () => tn(!0),
    onSelectAll: () => hn((u) => vl(u, he))
  }), J(() => tn(!1), [He, bt, $ == null ? void 0 : $.id]);
  function zi(u) {
    const y = "steps" in u ? u.steps.length > 0 : u.effect.mode !== "SKIP", O = "effect" in u && u.effect.mode === "SET_TAG_GROUP" ? u.effect.tagGroupId : null, L = O != null && !I.some((X) => X.id === O);
    return ie || ue || !!Ve || y && !C || "effect" in u && y && (!E || L) || Jn(u) && (Oe == null ? void 0 : Oe.kind) !== "ready" || !gc.length;
  }
  function $a(u) {
    We(null), _t(0), Se(null), j(u), Qa(u, !!u && !$);
  }
  function Qi() {
    Ot.current || (cc() ? (Ot.current = !0, window.history.back()) : $a(""));
  }
  function Wi() {
    const u = Ot.current;
    Ot.current = !1;
    let y = Do();
    y && !wt.current && !it.current.some((L) => L.id === y) && (y = "", Qa(""));
    const O = Z.current;
    y !== O && (_t(0), u || Se(null), !y && O && (Ie.current ?? (Ie.current = { reviewId: O }))), j(y);
  }
  function Ma() {
    Ie.current = "heading", Se(null), Qi();
  }
  function Fa(u) {
    u !== A && $a(u), _t((y) => y + 1);
  }
  function vc() {
    Se(null), It({
      review: hc("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function Nc(u) {
    if (Et || !U) return;
    Se(null);
    const y = yl(u, t, crypto.randomUUID()), O = A;
    wn(!0);
    try {
      if (!await or([...t, y])) throw new Error("Could not save reviews.");
      if (!Ye.current) return;
      Z.current !== O ? Se({ text: `Saved the copy “${y.name}”.`, alert: !1 }) : Fa(y.id);
    } catch (L) {
      Se({
        text: `“${u.name}” was not duplicated. ${Pa(L)}`,
        alert: !0
      });
    } finally {
      wn(!1);
    }
  }
  async function qc() {
    if (!nt || nt.saving) return;
    const u = { ...nt.review, name: nt.review.name.trim() }, y = Kr(u);
    if (y) {
      It({ ...nt, error: y });
      return;
    }
    It({ ...nt, saving: !0, error: "" });
    try {
      if (!await or([...t, u])) throw new Error("Could not save reviews.");
      if (!Ye.current) return;
      It(null), Fa(u.id);
    } catch (O) {
      It(
        (L) => L && {
          ...L,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + (O instanceof Error ? O.message : "Retry saving.")
        }
      );
    }
  }
  async function Sc() {
    if (!ot || ot.pending) return;
    const u = ot.review, y = fc(t, qe, le, je).map((X) => X.id), O = y.filter((X) => X !== u.id), L = O[Math.min(y.indexOf(u.id), O.length - 1)];
    Dt({ review: u, pending: !0 });
    try {
      if (!await or(t.filter((X) => X.id !== u.id)))
        throw new Error("Could not save reviews.");
      Ie.current = u.id !== A && L ? { reviewId: L } : "heading", Se({ text: `Deleted “${u.name}”.`, alert: !1 });
    } catch (X) {
      Se({ text: `“${u.name}” was not deleted. ${Pa(X)}`, alert: !0 });
    } finally {
      Dt(null);
    }
  }
  async function Ec(u) {
    if (!(Et || !U)) {
      Se(null), Lt(!0);
      try {
        const y = await _d(u), O = Ha(t, y), L = O.length - t.length, X = y.length - L;
        if (L && !await or(O)) throw new Error("Could not save reviews.");
        Se({
          alert: !1,
          text: y.length ? L ? `Imported ${L === 1 ? "1 review" : `${L} reviews`}.` + (X === 1 ? " 1 review already in the list stays as it is." : X ? ` ${X} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (y) {
        Se({ alert: !0, text: `Could not import “${u.name}”. ${Pa(y)}` });
      } finally {
        Lt(!1);
      }
    }
  }
  function Pa(u) {
    return u instanceof ls ? "Reviews changed in another browser. Reload the page to get them, then try again." : u instanceof Error ? u.message : "Try again.";
  }
  function Hi(u) {
    const y = !U || Et;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ r(Qo, { "aria-hidden": "true" }),
        disabled: y,
        onSelect: () => void Nc(u)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ r(as, { "aria-hidden": "true" }),
        onSelect: () => Pi(u)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ r(Wo, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: y,
        onSelect: () => {
          Se(null), Dt({ review: u, pending: !1 });
        }
      }
    ];
  }
  function Yi(u, y) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ r(Er, { "aria-hidden": "true" }),
        ...y,
        disabled: y.disabled || Re
      },
      ...Hi(u),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ r(Jr, { "aria-hidden": "true" }),
        separated: !0,
        disabled: Re,
        onSelect: Ma
      }
    ];
  }
  async function or(u) {
    if (!i) return !1;
    const y = u.map(Xu);
    try {
      await Il(i, y);
    } catch (L) {
      throw L;
    }
    n(y), A && !y.some((L) => L.id === A) && Qi();
    const O = y.find((L) => L.id === A);
    return O && ne && ((O.view.reviewMode ?? "single") !== (ne.view.reviewMode ?? "single") && We(null), O.view.displayMode !== ne.view.displayMode && Yn(xo(O))), !0;
  }
  if (s)
    return /* @__PURE__ */ r(jo, { label: "Loading reviews…" });
  if (d)
    return /* @__PURE__ */ c(pe, { children: [
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          onClick: () => void rf().catch(
            (u) => p(
              "Could not export browser reviews. " + (u instanceof Error ? u.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ r(
        Uo,
        {
          message: d,
          onRetry: () => void $r()
        }
      )
    ] });
  const xa = /* @__PURE__ */ c(pe, { children: [
    V && /* @__PURE__ */ r("p", { className: "dq-status", children: V }),
    Qe && (Oe == null ? void 0 : Oe.kind) === "missing" && /* @__PURE__ */ c("div", { role: "status", className: "dq-status", children: [
      Oe.message,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: rr,
          onClick: () => {
            gr(!0), Pn(""), (kt ? Jl(st) : Vl(st)).then(Dn).catch(
              (u) => Pn(
                `Could not create the ${kt ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (u instanceof Error ? u.message : "Request failed.")
              )
            ).finally(() => gr(!1));
          },
          children: rr ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    Qe && ((Oe == null ? void 0 : Oe.kind) === "incompatible" || Zr) && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(Kn, {}),
      Zr || (Oe == null ? void 0 : Oe.message),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: rr,
          onClick: () => {
            gr(!0), Dn().finally(
              () => gr(!1)
            );
          },
          children: rr ? "Checking…" : "Check again"
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
            const u = localStorage.getItem("page-videos") ?? "[]", y = URL.createObjectURL(
              new Blob([u], { type: "application/json" })
            ), O = document.createElement("a");
            O.href = y, O.download = "data-quality-unassigned-legacy-reviews.json", O.click(), URL.revokeObjectURL(y);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    D && /* @__PURE__ */ c("p", { role: "alert", children: [
      D,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: () => {
            v(""), Y(!1);
          },
          children: T ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    tt && (tt.alert ? /* @__PURE__ */ c("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(Kn, { "aria-hidden": "true" }),
      tt.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ r("p", { className: "dq-status", "aria-hidden": "true", children: tt.text })
    ))
  ] });
  return /* @__PURE__ */ c(
    "div",
    {
      ref: ar,
      className: `data-quality-page${Ln ? " dq-page-fit" : ""}`,
      style: Ln ? {
        "--dq-fit-top": `${h.top}px`,
        "--dq-fit-bottom": `${h.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ r("p", { className: "dq-sr-only", "aria-live": "polite", children: tt && !tt.alert ? tt.text : "" }),
        $ && He ? /* @__PURE__ */ r(
          xu,
          {
            review: ne ?? $,
            canWrite: In ? b : Kt,
            canAssess: (Oe == null ? void 0 : Oe.kind) === "ready" && Kt,
            onBusy: mr,
            editRequest: yn,
            onEditRequestHandled: () => _t(0),
            onSaveDefaults: U ? (u) => or(t.map((y) => y.id === u.id ? u : y)) : void 0,
            pageControls: {
              onBack: Ma,
              moreItems: (u) => Yi(ne ?? $, u),
              onGrid: oe ? () => We({ id: oe.id, mode: "multiple" }) : void 0,
              notices: xa,
              busy: Re
            },
            stayOnTap: $t,
            onStayOnTapChange: dn
          },
          $.id
        ) : $ ? Mc($) : /* @__PURE__ */ r(
          Uu,
          {
            reviews: t,
            counts: qe,
            sort: le,
            direction: je,
            onSortChange: (u) => yt({ sort: u }),
            onDirectionChange: (u) => yt({ direction: u }),
            storage: Gu[G],
            canConfigure: U,
            busy: Et,
            headingRef: ln,
            notices: xa,
            onOpen: $a,
            onNew: () => vc(),
            onImport: (u) => void Ec(u),
            onExportAll: () => Ks(t, "data-quality-reviews.json"),
            rowMenuItems: (u) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ r(Er, { "aria-hidden": "true" }),
                disabled: !U || Et,
                onSelect: () => Fa(u.id)
              },
              ...Hi(u)
            ]
          }
        ),
        bt && ir && oe && /* @__PURE__ */ r(
          nf,
          {
            video: ir,
            review: oe,
            selectedCount: at.size,
            pending: ie,
            refreshing: ue || !!Ve,
            error: nr,
            canWrite: f,
            assessmentReady: (Oe == null ? void 0 : Oe.kind) === "ready",
            trees: qt,
            selected: at.has(ir.id),
            hasPrevious: he.indexOf(ir.id) > 0,
            hasNext: he.indexOf(ir.id) >= 0 && he.indexOf(ir.id) < he.length - 1,
            onToggleSelected: () => hn((u) => fa(u, ir.id)),
            onPrevious: () => Oa(-1),
            onNext: () => Oa(1),
            onClose: () => {
              qn(!1), ut(Nt.current);
            },
            onAction: ra,
            findOpen: Ze,
            onFindOpenChange: tn
          }
        ),
        Ze && $ && !He && !bt && /* @__PURE__ */ r(
          Mi,
          {
            actions: $.actions,
            tagGroups: I,
            trees: qt,
            isDisabled: zi,
            canStay: !1,
            onApply: (u) => {
              tn(!1), ra(u);
            },
            onClose: () => tn(!1)
          }
        ),
        nt && /* @__PURE__ */ r(
          Ku,
          {
            draft: nt,
            onChange: (u) => It((y) => y && { ...y, review: u, error: "" }),
            onCreate: () => void qc(),
            onCancel: () => It(null)
          }
        ),
        /* @__PURE__ */ r(
          Wc,
          {
            open: !!ot,
            title: "Delete review?",
            message: ot ? `“${ot.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (ot == null ? void 0 : ot.pending) ?? !1,
            onConfirm: () => void Sc(),
            onCancel: () => Dt((u) => u != null && u.pending ? u : null)
          }
        )
      ]
    }
  );
  async function aa(u, y, O = !1) {
    const L = Nt.current, X = Math.max(0, he.indexOf(L ?? -1));
    try {
      const z = rn(
        u,
        y,
        O,
        u.view.selectAllOnLoad === !0
      ), me = ke.current, Rt = await z;
      if (me !== ke.current) return;
      const Pe = Rt.items.map((be) => be.id);
      Ft(
        (be) => new Set([...be].filter((ze) => Pe.includes(ze)))
      );
      const Ke = io(Pe, L, X);
      lt(Ke), Bt.current || ut(Ke, !1);
    } catch {
    }
  }
  function Cc(u) {
    const y = M.current;
    if (M.current = null, Ia || !$ || !ne) return;
    const O = y ?? $.view.objectFilter, L = fr(
      O,
      ne.view.objectFilter
    ) ? ne.view.objectFilter : O, X = xt({ ...u, page: 1 }), z = {
      ...$,
      view: {
        ...$.view,
        filter: X,
        objectFilter: L
      }
    }, me = !Po(z, ne), Rt = me ? z : ne;
    Ct(me ? z : null), Jt(me ? "" : "Review queue defaults restored."), aa(Rt, X, !0);
  }
  function kc() {
    if (ie || ue || _n || !ne) return;
    M.current = null;
    const u = xt({
      ...ne.view.filter,
      page: 1
    });
    Ct(null), Jt("Review queue defaults restored."), aa(
      ne,
      u,
      ne.view.startFrom !== "beginning"
    );
  }
  function Ac() {
    if (ie || ue || Ve || _n || !$ || !En || !U)
      return;
    const u = $, y = En;
    er(!0), or(
      t.map((O) => O.id === y.id ? y : O)
    ).then((O) => {
      O && (Ct(Fo(y, u)), Jt("Queue saved to this review."));
    }).catch(
      (O) => zt(
        O instanceof Error ? O.message : "Could not save queue."
      )
    ).finally(() => er(!1));
  }
  function La() {
    if (!$ || !ne || Sn.current || ge || Zn) return;
    On.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, Xe.current = {
      temporaryReview: Le,
      filter: ee,
      loadedFilter: we,
      queue: _e,
      queueError: Ve,
      retryFromEnd: Tt,
      selectedIds: new Set(at),
      focusedId: ct,
      pageCursor: Je.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const u = structuredClone({
      ...ne,
      view: { ...ne.view, startFrom: $.view.startFrom ?? "end" }
    });
    tn(!1), qn(!1), Jt(""), zt(""), vt({ draft: u, saving: !1, error: "" });
  }
  function Xi() {
    vt(null), Xe.current = null;
    const u = On.current;
    On.current = null, requestAnimationFrame(() => {
      (u == null ? void 0 : u.isConnected) && u !== document.body && !(u instanceof HTMLButtonElement && u.disabled) ? u.focus({ preventScroll: !0 }) : ut(Nt.current, !1);
    });
  }
  function Tc() {
    var y;
    if (!ge || ge.saving) return;
    const u = Xe.current;
    u && (ke.current += 1, (y = Qt.current) == null || y.abort(), M.current = null, vn(!1), Ct(u.temporaryReview), Ee(u.filter), Me(u.loadedFilter), At(u.queue), Hn(u.queueError), Mn(u.retryFromEnd), hn(() => u.selectedIds), lt(u.focusedId), Je.current = u.pageCursor, window.history.replaceState(window.history.state, "", u.url)), Xi();
  }
  async function Rc() {
    if (!ge || ge.saving || !Ue || !$) return;
    const u = $, y = { ...Ue, name: Ue.name.trim() }, O = Kr(y);
    if (O) {
      vt((L) => L && { ...L, error: O });
      return;
    }
    vt((L) => L && { ...L, saving: !0, error: "" });
    try {
      if (!await or(t.map((L) => L.id === y.id ? y : L)))
        throw new Error("Could not save reviews.");
      Ct(Fo(y, u)), xe(y) === "video" && Dr(y.id, {
        filter: ee,
        objectFilter: u.view.objectFilter,
        searchMode: y.view.searchMode,
        startFrom: y.view.startFrom ?? "end"
      }), Jt("Review saved."), Xi();
    } catch (L) {
      vt(
        (X) => X && {
          ...X,
          saving: !1,
          error: "Could not save review. Your edits are still open. " + (L instanceof Error ? L.message : "Retry saving.")
        }
      );
    }
  }
  function Zi() {
    $ && rn($, ee, Tt, Gt).catch(() => {
    });
  }
  function Oc() {
    Ft(/* @__PURE__ */ new Set()), fn.current.clear(), lt(null);
  }
  function Ic(u) {
    !$ || ie || _n || u === Number(ee.page) || Yu(
      { ...ee, page: u },
      $,
      (y, O) => rn(y, O, !1, Gt),
      Oc
    );
  }
  function $c(u) {
    if (!oe || !ne || ie || ue || _n) return;
    const y = Ru(oe, u, ne.view.objectFilter), O = !Po(y, ne);
    Ct(O ? y : null), O ? aa(y, { ...ee, page: 1 }) : aa(
      ne,
      { ...ee, page: 1 },
      ne.view.startFrom !== "beginning"
    );
  }
  function Mc(u) {
    var Pe, Ke;
    const y = ye === "tag", O = y ? "tag" : "video", L = Math.max(1, Number(ee.perPage) || 40), X = Math.max(1, Math.ceil(_e.totalCount / L)), z = Math.min(Math.max(1, Number(ee.page) || 1), X), me = [
      C ? "" : `${$n} write permission is required to apply actions.`,
      y && _ ? `Tag groups are unavailable. ${_}` : ""
    ].filter(Boolean), Rt = !!nr && !bt;
    return /* @__PURE__ */ c(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": y ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ r(
            Vs,
            {
              name: u.name,
              description: u.description,
              entityType: ye,
              onBack: Ma,
              backDisabled: ie || !!ge || Re,
              onEdit: ge ? () => {
                var be;
                return (be = jt.current) == null ? void 0 : be.focus();
              } : La,
              editDisabled: !ge && (ie || ue || gt || Zn || Re || !U),
              editing: !!ge,
              toolbar: /* @__PURE__ */ c("fieldset", { className: "dq-review-toolbar", disabled: Ia, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: y ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ r(
                  _r,
                  {
                    filter: Ve ? we : ee,
                    onFilterChange: Cc,
                    totalCount: _e.totalCount,
                    sortOptions: y ? Yc : Bo,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: Vt,
                    zoomLevel: (Xn - 225) / 50,
                    onZoomChange: (be) => Xr(Math.round(225 + be * 50)),
                    cardSizeEntityType: y ? "tags" : "videos",
                    criteriaDefinitions: y ? Hc : pi,
                    customFieldEntityType: ye === "video" ? "video" : void 0,
                    objectFilter: Ta,
                    onObjectFilterChange: (be) => {
                      Ia || (M.current = ye === "video" ? Qs(
                        be,
                        br,
                        u.view.objectFilter
                      ) : be);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(Js, { page: z, pages: X, onPage: Ic })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ c(pe, { children: [
                oe && /* @__PURE__ */ r(
                  zs,
                  {
                    mode: "multiple",
                    disabled: ie || ue || pt || !!ge || Zn || Re,
                    onChange: () => We({ id: oe.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ r(
                  Vd,
                  {
                    options: y ? zu : Ju,
                    value: Vt,
                    onChange: (be) => Yn(Lo(be, ye))
                  }
                ),
                /* @__PURE__ */ r(
                  xi,
                  {
                    disabled: ie || !!ge,
                    items: Yi(ne ?? u, {
                      onSelect: La,
                      disabled: ue || gt || Zn || !U
                    })
                  }
                )
              ] }),
              chipsAfter: (Ke = (Pe = oe == null ? void 0 : oe.presentation) == null ? void 0 : Pe.binParents) != null && Ke.length ? /* @__PURE__ */ r(
                Au,
                {
                  videos: _e.items,
                  review: oe,
                  savedObjectFilter: (ne ?? oe).view.objectFilter,
                  trees: re.ids,
                  disabled: ie || ue || _n,
                  onToggle: $c
                }
              ) : void 0,
              chipsEnd: ge ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : (Le == null ? void 0 : Le.id) === A ? /* @__PURE__ */ c(pe, { children: [
                /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Queue differs from the saved review" }),
                nn && /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    className: "dq-text-button",
                    title: "Save the current queue criteria to this review",
                    disabled: ie || ue || !!Ve || _n || !U,
                    onClick: Ac,
                    children: [
                      /* @__PURE__ */ r(ts, { "aria-hidden": "true" }),
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
                    disabled: ie || ue || _n,
                    onClick: kc,
                    children: [
                      /* @__PURE__ */ r(ns, { "aria-hidden": "true" }),
                      "Reset"
                    ]
                  }
                )
              ] }) : void 0
            }
          ),
          xa,
          oe && re.error && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: re.error }),
          /* @__PURE__ */ c("div", { className: "dq-review-area", children: [
            ge && Ue && /* @__PURE__ */ r(
              Bs,
              {
                drawerRef: jt,
                draft: Ue,
                onChange: (be) => vt((ze) => ze && { ...ze, draft: be }),
                direction: ge.draft.view.startFrom ?? "end",
                onDirectionChange: (be) => vt(
                  (ze) => ze && {
                    ...ze,
                    draft: { ...ze.draft, view: { ...ze.draft.view, startFrom: be } }
                  }
                ),
                tagGroups: I,
                trees: qt,
                saving: ge.saving,
                saveDisabled: ue || !!Ve,
                error: ge.error,
                dirty: ta,
                criteriaChanged: nn,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  Ve && !ue ? /* @__PURE__ */ c("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ r(Kn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ c("span", { children: [
                      "The queue could not load: ",
                      Ve,
                      " ",
                      /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", onClick: Zi, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void Rc(),
                onCancel: Tc
              }
            ),
            /* @__PURE__ */ c(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${P}px` },
                children: [
                  /* @__PURE__ */ c("div", { className: "dq-grid-content", children: [
                    ue && !_e.items.length && /* @__PURE__ */ r(jo, { label: "Loading review queue…" }),
                    Ve && !ue && /* @__PURE__ */ r(
                      Uo,
                      {
                        message: Ve,
                        retryLabel: gt ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (gt && ne && xe(ne) === "video") {
                            const be = hr(ne);
                            Dr(ne.id, { ...be, filter: { ...be.filter, page: void 0 } }), Mt((ze) => ze + 1);
                            return;
                          }
                          Zi();
                        }
                      }
                    ),
                    !ie && !ue && !Ve && !_e.items.length && /* @__PURE__ */ c("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ r(qa, {}),
                      /* @__PURE__ */ c("p", { children: [
                        "No ",
                        O,
                        "s match this review."
                      ] })
                    ] }),
                    !!_e.items.length && /* @__PURE__ */ r("div", { ref: Ir, children: /* @__PURE__ */ r(
                      "div",
                      {
                        className: Vt === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${Xn}px` },
                        children: _e.items.map(Fc)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ r("div", { className: "dq-bar-dock", ref: fe, children: /* @__PURE__ */ r(
                    Ps,
                    {
                      actions: ge ? ge.draft.actions : u.actions,
                      tagGroups: I,
                      trees: qt,
                      isDisabled: zi,
                      paused: !!ge,
                      busy: ie || ue,
                      onApply: (be) => void ra(be),
                      onFind: () => tn(!0),
                      status: ie ? `Applying action to ${tr}…` : "",
                      summary: /* @__PURE__ */ c(pe, { children: [
                        /* @__PURE__ */ r("p", { className: "dq-bar-target", children: at.size ? `${at.size} selected` : ct == null ? "Nothing to apply to" : `Applies to the focused ${O}` }),
                        /* @__PURE__ */ c(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !he.length || bc,
                            onClick: () => hn((be) => /* @__PURE__ */ new Set([...be, ...he])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ r(et, { binding: yc.selectAll, hidden: !0 })
                            ]
                          }
                        ),
                        /* @__PURE__ */ c(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Escape",
                            disabled: !at.size,
                            onClick: () => hn(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ r(et, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: me.length ? me.join(" ") : void 0,
                      keyHints: y ? "Arrows move · Space selects · Enter opens" : ge ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews",
                      notices: Rt || Fn ? /* @__PURE__ */ c(pe, { children: [
                        Rt && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ r(Kn, { "aria-hidden": "true" }),
                          nr
                        ] }),
                        Fn && /* @__PURE__ */ r("p", { role: "status", className: "dq-status", children: Fn })
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
  function Fc(u) {
    var O, L, X;
    if (ye === "tag") {
      const z = u;
      return /* @__PURE__ */ r(
        Zu,
        {
          tag: z,
          displayMode: Vt === "list" ? "list" : "grid",
          focused: z.id === ct,
          selected: at.has(z.id),
          setRef: (me) => {
            me ? xn.current.set(z.id, me) : xn.current.delete(z.id);
          },
          onFocus: () => lt(z.id),
          onToggle: () => {
            hn((me) => fa(me, z.id)), ut(z.id, !1);
          },
          onOpen: () => window.open(`/tag/${z.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        z.id
      );
    }
    const y = u;
    return /* @__PURE__ */ r(
      ef,
      {
        video: ku(y, oe, re.ids),
        showTagBins: ((L = (O = oe == null ? void 0 : oe.presentation) == null ? void 0 : O.annotations) == null ? void 0 : L.includes("tags")) && !!((X = oe.presentation.annotationParents) != null && X.length),
        displayMode: Vt,
        cardsScroll: ea,
        focused: y.id === ct,
        selected: at.has(y.id),
        setRef: (z) => {
          z ? xn.current.set(y.id, z) : xn.current.delete(y.id);
        },
        onFocus: () => lt(y.id),
        onToggle: () => hn((z) => fa(z, y.id)),
        onPreview: () => {
          ge || (lt(y.id), qn(!0));
        },
        onNavigate: e
      },
      y.id
    );
  }
}
function Yu(e, t, n, a) {
  a(), n(t, e).catch(() => {
  });
}
function fa(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function Xu(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Zu({
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
      onClick: (p) => {
        o(), p.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${n ? "focused" : ""} ${a ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ r(
        Xc,
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
            onClick: (p) => {
              p.stopPropagation(), s();
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
function ef({
  video: e,
  showTagBins: t,
  displayMode: n,
  cardsScroll: a,
  focused: i,
  selected: o,
  setRef: s,
  onFocus: l,
  onToggle: d,
  onPreview: p,
  onNavigate: f
}) {
  var E, w;
  const g = pc(e), m = R(null), N = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, b = !!(N.date || N.studioName), q = !!(N.performers.length || N.tags.length);
  return cn(() => {
    const I = m.current;
    if (!I) return;
    const x = I.querySelector(
      `a[href="/video/${e.id}"]`
    ), _ = I.querySelector(".card-title"), K = `dq-card-title-${e.id}`;
    _ && (_.id = K), x && (x.target = "_blank", x.rel = "noreferrer", x.removeAttribute("aria-label"), x.setAttribute("aria-labelledby", K), x.classList.add("dq-card-link"));
    const U = I.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    U && U.setAttribute(
      "aria-label",
      o ? `Deselect ${g}` : `Select ${g}`
    );
    const te = I.querySelector(
      'button[title="Quick View"]'
    );
    te && te.setAttribute("aria-label", `Preview ${g}`);
  }), /* @__PURE__ */ c(
    "article",
    {
      ref: (I) => {
        m.current = I, s(I);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${g}${o ? ", selected" : ""}`,
      onFocus: l,
      onClick: (I) => {
        l(), I.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${b ? "has-card-metadata" : "no-card-metadata"} ${q ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ r(
          Zc,
          {
            video: N,
            selected: o,
            onSelect: d,
            onNavigate: f,
            onQuickView: p,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ c("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (E = e.tags) == null ? void 0 : E.map((I) => /* @__PURE__ */ r("span", { children: I.name }, I.id)),
          !((w = e.tags) != null && w.length) && /* @__PURE__ */ r("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ r(tf, { video: e, cardsScroll: a })
      ]
    }
  );
}
function tf({ video: e, cardsScroll: t }) {
  const n = R(null), a = R(null), [i, o] = k(!1), [s, l] = k(!1), [d, p] = k(!1);
  return J(() => {
    const f = n.current;
    if (!f || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      o(!0), l(!0);
      return;
    }
    const g = t ? f.closest(".dq-grid-stage") : null, m = new IntersectionObserver(
      ([b]) => o(b.isIntersecting),
      { root: g, rootMargin: "320px 0px", threshold: 0 }
    ), N = new IntersectionObserver(
      ([b]) => l(b.isIntersecting && b.intersectionRatio >= 0.6),
      { root: g, threshold: [0, 0.6, 1] }
    );
    return m.observe(f), N.observe(f), () => {
      m.disconnect(), N.disconnect();
    };
  }, [e.id, e.files.length, t]), J(() => {
    if (!i) {
      p(!1);
      return;
    }
    const f = new AbortController();
    return se(Kl(e.id), {
      signal: f.signal
    }).then((g) => {
      f.signal.aborted || p(g.available === !0);
    }).catch(() => {
      f.signal.aborted || p(!1);
    }), () => f.abort();
  }, [i, e.id]), J(() => {
    const f = a.current;
    f && (s ? Promise.resolve(f.play()).catch(() => {
    }) : f.pause());
  }, [d, s]), /* @__PURE__ */ r("div", { ref: n, className: "dq-wall-autoplay", "aria-hidden": "true", children: d && /* @__PURE__ */ r(
    "video",
    {
      ref: a,
      src: Ul(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function nf({
  video: e,
  review: t,
  selectedCount: n,
  pending: a,
  refreshing: i,
  error: o,
  canWrite: s,
  assessmentReady: l,
  trees: d,
  selected: p,
  hasPrevious: f,
  hasNext: g,
  onToggleSelected: m,
  onPrevious: N,
  onNext: b,
  onClose: q,
  onAction: E,
  findOpen: w,
  onFindOpenChange: I
}) {
  const x = R(null), _ = Wr(), K = R(null), U = e.files[0], te = pc(e), G = (v) => a || i || "steps" in v && v.steps.length > 0 && !s || Jn(v) && !l;
  Ri({
    surface: "overlay",
    enabled: !w,
    actions: t.actions,
    onAction: (v) => {
      const T = t.actions[v];
      T && E(T);
    },
    onFind: () => I(!0)
  }), J(() => {
    var T;
    const v = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (T = x.current) == null || T.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = v;
    };
  }, []);
  function W(v) {
    var H, de, ce;
    if (v.key !== "Tab") return;
    const T = [
      ...((H = x.current) == null ? void 0 : H.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((B) => B.offsetParent !== null);
    if (!T.length) {
      v.preventDefault(), (de = x.current) == null || de.focus();
      return;
    }
    const Y = T.indexOf(
      document.activeElement
    );
    v.shiftKey && Y <= 0 ? (v.preventDefault(), (ce = T.at(-1)) == null || ce.focus()) : !v.shiftKey && Y === T.length - 1 && (v.preventDefault(), T[0].focus());
  }
  function V(v) {
    if (w || v.defaultPrevented || v.ctrlKey || v.metaKey || v.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const T = v.key === "ArrowLeft" || v.key === "ArrowRight";
    if (v.altKey && !T) return;
    const Y = K.current, H = v.currentTarget.querySelector("video");
    if (v.key === "Enter" || v.key === "Escape")
      v.repeat || q();
    else if (v.key === " " && Y)
      v.repeat || Y.toggle();
    else if (T && Y)
      Y.seekBy(
        (v.key === "ArrowLeft" ? -1 : 1) * (v.shiftKey ? 5 : v.altKey ? 10 : 60)
      );
    else if ((v.key === "," || v.key === ".") && Y) {
      const de = [U == null ? void 0 : U.duration, H == null ? void 0 : H.duration].find(
        (B) => B != null && Number.isFinite(B) && B > 0
      ) ?? 0, ce = e.parentVideoId != null ? (e.clipEndSec ?? de) - (e.clipStartSec ?? 0) : de;
      Number.isFinite(ce) && ce > 0 && Y.seekBy((v.key === "," ? -1 : 1) * ce * 0.1);
    } else if (v.key.toLowerCase() === "n" || v.key.toLowerCase() === "m")
      !v.repeat && !a && !i && (v.key.toLowerCase() === "n" && f && N(), v.key.toLowerCase() === "m" && g && b());
    else if (v.key === "ArrowUp" && H)
      H.volume = Math.min(1, H.volume + 0.1);
    else if (v.key === "ArrowDown" && H)
      H.volume = Math.max(0, H.volume - 0.1);
    else return;
    Nr(v);
  }
  function F(v) {
    const T = x.current, Y = v.target instanceof Element ? v.target.closest("button, a[href]") : null;
    !T || !Y || !T.contains(Y) || Y.closest(".dq-player, .dq-find-action") || v.detail === 0 || T.focus({ preventScroll: !0 });
  }
  J(() => {
    if (w) return;
    let v = 0;
    const T = requestAnimationFrame(() => {
      v = requestAnimationFrame(() => {
        var H;
        const Y = document.activeElement;
        (H = x.current) != null && H.isConnected && (!Y || Y === document.body || Y === document.documentElement) && x.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(T), cancelAnimationFrame(v);
    };
  }, [w, a, i, g, f, e.id, _]);
  const D = n ? `the ${n} selected video${n === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ c(
    "div",
    {
      ref: x,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${te}`,
      className: `dq-preview${_ ? " dq-preview-mobile" : ""}`,
      onKeyDown: W,
      onKeyDownCapture: V,
      onMouseDown: (v) => {
        v.target === v.currentTarget && q();
      },
      onClick: F,
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
                disabled: !f || a || i,
                onClick: N,
                children: [
                  /* @__PURE__ */ r(Jr, { "aria-hidden": "true" }),
                  !_ && /* @__PURE__ */ r(et, { binding: "n", hidden: !0 })
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
                  !_ && /* @__PURE__ */ r(et, { binding: "m", hidden: !0 }),
                  /* @__PURE__ */ r(es, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ c("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ r("h2", { children: te }),
              /* @__PURE__ */ c("p", { children: [
                "Actions apply to ",
                D
              ] })
            ] }),
            /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "dq-preview-button dq-preview-select",
                "aria-pressed": p,
                disabled: i,
                onClick: m,
                children: [
                  /* @__PURE__ */ r("span", { className: "dq-preview-check", "aria-hidden": "true", children: p && /* @__PURE__ */ r(wi, {}) }),
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
                "aria-label": `Open ${te} in a new tab`,
                title: "Open video in a new tab",
                children: /* @__PURE__ */ r(rs, { "aria-hidden": "true" })
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
                onClick: q,
                children: /* @__PURE__ */ r(Vr, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ r("div", { className: "dq-preview-video", children: U ? /* @__PURE__ */ r(
            Vo,
            {
              autostart: !0,
              streamUrl: ti("video", e.id),
              posterUrl: uo(e),
              format: U.format,
              audioCodec: U.audioCodec,
              duration: U.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onPlaybackControlRegister: (v) => (K.current = v, () => {
                K.current === v && (K.current = null);
              }),
              clip: e.parentVideoId != null ? {
                start: e.clipStartSec ?? 0,
                end: e.clipEndSec,
                loop: !1
              } : void 0
            }
          ) : /* @__PURE__ */ r("img", { src: uo(e), alt: "" }) }) }),
          o && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert dq-preview-alert", children: o }),
          !_ && /* @__PURE__ */ c("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ r("span", { children: "Space play / pause" }),
            /* @__PURE__ */ r("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ r("span", { children: ", . ±10 %" }),
            /* @__PURE__ */ r("span", { children: "↑ ↓ volume" }),
            /* @__PURE__ */ r("span", { children: "N M previous / next" }),
            /* @__PURE__ */ r("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ r(
            Ps,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: d,
              isDisabled: G,
              busy: a || i,
              onApply: (v) => void E(v),
              onFind: () => I(!0),
              status: a ? `Applying action to ${D}…` : "",
              summary: /* @__PURE__ */ r("p", { className: "dq-bar-target", children: n ? `${n} selected` : "This video" })
            }
          )
        ] }),
        w && /* @__PURE__ */ r(
          Mi,
          {
            actions: t.actions,
            trees: d,
            isDisabled: G,
            canStay: !1,
            onApply: (v) => {
              I(!1), E(v);
            },
            onClose: () => I(!1)
          }
        )
      ]
    }
  );
}
async function rf() {
  const e = await se("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
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
function jo({ label: e }) {
  return /* @__PURE__ */ c("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ r(ll, { className: "dq-spin" }),
    e
  ] });
}
function Uo({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ c("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ r(Kn, {}),
    /* @__PURE__ */ r("p", { children: e }),
    /* @__PURE__ */ r("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const df = { components: { DataQualityPage: Hu } };
export {
  Hu as DataQualityPage,
  df as default,
  fr as objectFiltersEqual
};
