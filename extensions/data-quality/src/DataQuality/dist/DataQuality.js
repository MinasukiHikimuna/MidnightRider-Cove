import { jsxs as l, Fragment as ue, jsx as r } from "react/jsx-runtime";
import { useState as C, useRef as $, useEffect as H, useLayoutEffect as Zt, useMemo as ve, useCallback as mn, useSyncExternalStore as wi, useId as Nt, Fragment as yi, createContext as Yc, useContext as Xc } from "react";
import { useKeySequence as Zc, EntityReferenceMultiSelector as Rn, SortableList as Yo, EntityDetailTabs as el, TagBadge as tl, DetailListToolbar as Gr, PERFORMER_CRITERIA as vi, AUDIO_CRITERIA as Xo, VIDEO_CRITERIA as Ni, NarrativeText as nl, AUDIO_SORT_OPTIONS as rl, VIDEO_SORT_OPTIONS as Zo, AudioPlayer as al, VideoPlayer as es, formatDuration as ts, FilterDialog as il, getResolutionLabel as ol, ConfirmDialog as sl, TAG_CRITERIA as cl, TAG_SORT_OPTIONS as ll, TagTile as dl, VideoCard as ul } from "@cove/runtime/components";
import { Search as zr, Check as Ca, Pencil as kr, Ban as wa, Pin as qi, Plus as Si, GripVertical as ns, AlertTriangle as An, Copy as rs, Trash2 as as, ChevronDown as is, X as Qr, Mic as fl, Users as os, Tag as ss, Headphones as cs, Film as Aa, ChevronLeft as Wr, RectangleHorizontal as pl, LayoutGrid as Ei, MoreHorizontal as hl, ChevronRight as ls, Layers as po, Undo2 as ml, Flag as ya, RefreshCw as gl, Save as ds, RotateCcw as us, ExternalLink as fs, SkipForward as bl, Upload as wl, Download as ps, ArrowUp as yl, ArrowDown as vl, Loader2 as Nl, List as ql, Grid3X3 as Sl } from "@cove/runtime/lucide-react";
import { extensionFetch as El } from "@cove/runtime/api";
const ki = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, Ci = Object.keys(
  ki
);
function Kr(e) {
  return e === "excludes" || e === "excludesAll";
}
function Ai(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
const hs = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function Te(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function Ti(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function Pe(e) {
  return Ti(_e(e));
}
function kl(e) {
  return _e(e) === "video";
}
function _e(e) {
  return e.entityType ?? "video";
}
const Jn = [
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
], Br = [
  Jn.slice(0, 11),
  Jn.slice(11, 22),
  Jn.slice(22)
], zn = "none";
function sr(e) {
  return typeof e == "string" && Jn.includes(e);
}
function Ri(e) {
  const t = e.shortcut;
  return sr(t) || t === zn ? t : "auto";
}
function ms(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), i = [];
  e.forEach((s, c) => {
    const d = Ri(s);
    if (d !== zn) {
      if (d !== "auto") {
        if (!n.has(d)) {
          n.set(d, c), t[c] = d;
          return;
        }
        a.add(c);
      }
      i.push(c);
    }
  });
  const o = Jn.filter((s) => !n.has(s));
  return i.forEach((s, c) => {
    const d = o[c];
    d !== void 0 && (t[s] = d, n.set(d, s));
  }), { keys: t, actionOn: n, duplicatePins: a };
}
function Cl(e, t, n) {
  const { keys: a, actionOn: i } = ms(e), o = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (sr(n)) {
    const c = i.get(n), d = a[t];
    c !== void 0 && c !== t && o.set(c, d && e[t].shortcut === d ? d : void 0);
  }
  const s = new Set([...o.values()].filter(sr));
  return e.map((c, d) => {
    const h = o.has(d) ? o.get(d) : sr(c.shortcut) && s.has(c.shortcut) ? void 0 : c.shortcut;
    if (h === c.shortcut) return c;
    const { shortcut: u, ...g } = c;
    return h === void 0 ? g : { ...g, shortcut: h };
  });
}
function Vr(e) {
  return Te(e) && !gs(e.occurrence) ? "Complete the optional occurrence condition before saving." : !kl(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : _e(e) !== "tag" && e.actions.some(
    (t) => $i(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => $n(t, _e(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const Al = {
  video: 1e3,
  audio: 250
};
function Lt(e, t = "video") {
  const n = (a, i) => Number.isFinite(Number(a)) && Number(a) > 0 ? Math.floor(Number(a)) : i;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(Al[t], n(e.perPage, 40))
    )
  };
}
function ho(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function Vn(e) {
  const { page: t, ...n } = e.view.filter, a = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    Te(e) ? [e.entityType, ...a, e.occurrence] : _e(e) === "video" ? a : [_e(e), ...a]
  );
}
function $n(e, t) {
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
  ) && !$i(e) : !1;
}
function Tl(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function Tn(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function Ar(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function ei(e) {
  return "steps" in e && e.steps.length > 0;
}
function Qn(e) {
  return "steps" in e ? e.steps.some((t) => Tn(t.mode)) : !1;
}
function $i(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (Tn(n.mode))
      for (const a of n.tagIds) {
        const i = t.get(a);
        if (i && i !== n.mode) return !0;
        t.set(a, n.mode);
      }
  return !1;
}
function Hr(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || hs.includes(n.entityType)) && (!Tl(n.entityType) || gs(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && Rl(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (a) => typeof a == "string"
    )) && // Answer groups belong to actions that write tags; tag reviews have neither.
    (n.stayUntilGroupsAnswered === void 0 || typeof n.stayUntilGroupsAnswered == "boolean" && n.entityType !== "tag") && Array.isArray(n.actions) && n.actions.every(
      (a) => typeof (a == null ? void 0 : a.id) == "string" && typeof a.label == "string" && (a.shortcut === void 0 || typeof a.shortcut == "string") && (n.entityType === "tag" ? "effect" in a && !("steps" in a) && !("group" in a) && $n(a, "tag") : "steps" in a && !("effect" in a) && Array.isArray(a.steps) && a.steps.every(
        (i) => i && Array.isArray(i.tagIds)
      ) && (a.group === void 0 || typeof a.group == "string") && $n(a, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => Vr(n)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((n) => n.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function Rl(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= 115 && n.cardSize <= 380) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (a) => ["date", "studio", "performers", "tags"].includes(a)
  )) && [n.annotationParents, n.binParents].every(
    (a) => a === void 0 || Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0)
  );
}
function ti(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const a of e)
    for (const i of a)
      n.has(i.id) || (n.add(i.id), t.push(i));
  return t;
}
function $l(e, t) {
  const n = (c) => c.trim().toLocaleLowerCase(), a = new Set(t.map((c) => n(c.name))), i = e.trim(), o = i.replace(/ copy(?: \d+)?$/i, ""), s = `${o !== i && a.has(n(o)) ? o : i} copy`;
  for (let c = 1; ; c++) {
    const d = c === 1 ? s : `${s} ${c}`;
    if (!a.has(n(d))) return d;
  }
}
function Il(e, t, n) {
  return { ...structuredClone(e), id: n, name: $l(e.name, t) };
}
function gs(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (a) => Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0) && new Set(a).size === a.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && Ci.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function mo(e, t) {
  return e.size > 0 ? [...e].sort((n, a) => n - a) : t == null ? [] : [t];
}
function go(e, t, n, a) {
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
function Ol(e, t) {
  const n = new Set(e), a = t.length > 0 && t.every((i) => n.has(i));
  for (const i of t)
    a ? n.delete(i) : n.add(i);
  return n;
}
function Ml(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function Fl(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function Pl(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function xl(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function Ll(e, t) {
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
const bs = "ext:com.midnightrider.data-quality:configuration", Dl = "ext:cove-data-quality:video-reviews", ni = "ext:com.midnightrider.data-quality:progress";
class ws extends Error {
}
const Yr = /* @__PURE__ */ new Map(), ua = /* @__PURE__ */ new Map(), ir = (e, t) => e.includes("*") || e.includes(t), va = (e) => le(`/api/savedfilters?mode=${encodeURIComponent(e)}`), _l = () => ({
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
function Nr(e) {
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
    reviews: Hr(JSON.stringify(t.reviews)),
    deletedIds: ri(t.deletedIds),
    importedIds: ri(t.importedIds)
  };
}
function jl(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const a = /* @__PURE__ */ new Set();
  for (const i of t) {
    const o = localStorage.getItem(i);
    if (o !== null) {
      const s = Hr(o);
      n ?? (n = s), s.forEach((c) => a.add(c.id));
    }
    ri(
      JSON.parse(localStorage.getItem(`${i}:account-imports`) ?? "[]")
    ).forEach((s) => a.add(s));
  }
  return {
    reviews: n ?? [],
    known: [...a],
    present: n !== void 0
  };
}
async function ys(e) {
  const t = await le("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Ii(e, t) {
  const n = (ua.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return ua.set(e, n), n.finally(() => {
    ua.get(e) === n && ua.delete(e);
  }).catch(() => {
  }), n;
}
let Lr = null;
function Ul() {
  if (Lr) return Lr;
  const e = Gl();
  return Lr = e, e.finally(() => {
    Lr === e && (Lr = null);
  }).catch(() => {
  }), e;
}
async function Gl() {
  const e = await le("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return Ii(t, () => Kl(e, t));
}
async function Kl(e, t) {
  var m;
  const n = String(e.user.id), a = ir(e.permissions, "savedfilters.read"), i = a && ir(e.permissions, "savedfilters.write"), o = a ? (await va(bs)).filter((N) => N.name === "Data Quality configuration").sort((N, y) => N.id - y.id) : [];
  if (o.length > 1) {
    const N = (y) => {
      const { revision: q, ...E } = Nr(y.uiOptions);
      return JSON.stringify(E);
    };
    if (o.some((y) => N(y) !== N(o[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (i)
      for (const y of o.slice(1))
        await le(`/api/savedfilters/${y.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${y.id}` })
        });
    o.splice(1);
  }
  let s = o.length ? Nr(o[0].uiOptions) : _l();
  const c = localStorage.getItem(`${t}:migrated`) === "true", d = localStorage.getItem(t), h = localStorage.getItem(`${t}:local-only`) === "true";
  !o.length && d && (s = Nr(d));
  let u = !o.length;
  if (o.length && h && d) {
    const N = Nr(d);
    if (N.reviews.some((q) => {
      const E = s.reviews.find((w) => w.id === q.id);
      return E && JSON.stringify(E) !== JSON.stringify(q);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const y = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...N.deletedIds])
    ];
    s = {
      ...s,
      reviews: ti(s.reviews, N.reviews).filter(
        (q) => !y.includes(q.id)
      ),
      deletedIds: y,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...N.importedIds])
      ]
    }, u = !0;
  }
  if (!c) {
    const N = JSON.stringify(s), y = jl(n);
    if (o.length && y.reviews.some((I) => {
      const F = s.reviews.find((G) => G.id === I.id);
      return F && JSON.stringify(F) !== JSON.stringify(I);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const q = a ? (await va(Dl)).flatMap(
      (I) => Hr(I.uiOptions ?? "[]")
    ) : [], E = y.known.filter(
      (I) => !y.reviews.some((F) => F.id === I)
    ), w = /* @__PURE__ */ new Set([...s.deletedIds, ...E]);
    s = {
      ...s,
      reviews: ti(
        y.reviews,
        s.reviews,
        q.filter(
          (I) => !y.known.includes(I.id) && !s.importedIds.includes(I.id)
        )
      ).filter((I) => !w.has(I.id)),
      deletedIds: [...w],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...y.known,
          ...q.map((I) => I.id)
        ])
      ]
    }, u || (u = JSON.stringify(s) !== N);
  }
  const g = {
    userId: n,
    recordId: (m = o[0]) == null ? void 0 : m.id,
    config: s,
    readable: a,
    writable: i,
    durable: i
  };
  if (Yr.set(t, g), u && i) {
    const N = s;
    o.length && (g.config = Nr(o[0].uiOptions)), await vs(t, N), s = g.config;
  } else o.length || (localStorage.setItem(t, JSON.stringify(s)), !a && (!c || h) && localStorage.setItem(`${t}:local-only`, "true"));
  if (!a) localStorage.setItem(`${t}:migrated`, "true");
  else if (i)
    try {
      localStorage.setItem(`${t}:migrated`, "true");
    } catch {
    }
  return {
    reviews: s.reviews,
    storageKey: t,
    canWrite: ir(e.permissions, "videos.write"),
    canWriteVideos: ir(e.permissions, "videos.write"),
    canWriteAudios: ir(e.permissions, "audios.write"),
    canWriteTags: ir(e.permissions, "tags.write"),
    canReadTagGroups: ir(e.permissions, "taggroups.read"),
    canConfigure: !a || i,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: a ? i ? "account" : "readOnly" : "browser",
    storageNotice: a ? i ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function vs(e, t) {
  const n = Yr.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const a = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await ys(n), n.recordId != null) {
      const o = await le(
        `/api/savedfilters/${n.recordId}`
      );
      if (Nr(o.uiOptions).revision !== n.config.revision)
        throw new ws(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const i = await le(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: bs,
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
function Bl(e, t) {
  return Ii(e, async () => {
    const n = Yr.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const a = n.config.reviews, i = t(a);
    if (i === a) return a;
    Hr(JSON.stringify(i));
    const o = a.filter((s) => !i.some((c) => c.id === s.id)).map((s) => s.id);
    return await vs(e, {
      ...n.config,
      reviews: i,
      deletedIds: [
        .../* @__PURE__ */ new Set([...n.config.deletedIds, ...o])
      ].filter((s) => !i.some((c) => c.id === s))
    }), i;
  });
}
function bo(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, a]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(a)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Vl(e, t) {
  const n = Yr.get(e);
  if (!n) return null;
  const a = localStorage.getItem(`${e}:progress:${t}`), i = a ? bo(a) : null;
  if (!n.readable) return i;
  const o = (await va(ni)).find(
    (c) => c.name === t
  ), s = o ? bo(o.uiOptions) : null;
  return i && (!s || i.updatedAt > s.updatedAt) ? i : s;
}
function Jl(e, t, n) {
  const a = `${e}:progress:${t}`;
  try {
    localStorage.setItem(a, JSON.stringify(n));
  } catch {
  }
  return Ii(a, async () => {
    const i = Yr.get(e);
    if (!(i != null && i.writable)) return;
    await ys(i);
    const o = (await va(ni)).find(
      (s) => s.name === t
    );
    await le(
      o ? `/api/savedfilters/${o.id}` : "/api/savedfilters",
      {
        method: o ? "PUT" : "POST",
        body: JSON.stringify({
          mode: ni,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function Wn(e) {
  return e === "audio" ? "audios" : "videos";
}
const zl = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function bn(e) {
  return zl[e];
}
const Na = "confirmed_absent_tags", Oi = "Confirmed absent tags", Ta = "confirmed_absent_occurrence_tags", Ns = {
  key: Na,
  label: Oi,
  type: "tag",
  subject: "tag assessments"
}, Mi = {
  key: Ta,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, Ql = {
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
function In(e) {
  return Array.isArray(e) ? e.map(In) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? Ql[n] ?? n : t === "key" && typeof n == "string" && [
        Na,
        Ta
      ].includes(n.toLowerCase()) ? n.toLowerCase() : In(n)
    ])
  ) : e;
}
async function qs(e, t, n) {
  const a = new Headers(t.headers);
  !(t.body instanceof FormData) && !a.has("Content-Type") && a.set("Content-Type", "application/json");
  const i = await El(e, { ...t, headers: a });
  if (i.status === 404 && n === "null") return null;
  if (!i.ok) {
    let s = i.statusText || `Request failed (${i.status}).`;
    try {
      const c = await i.json();
      s = c.message || c.detail || c.error || s;
    } catch {
    }
    throw new Error(s);
  }
  if (i.status === 204 || i.status === 205) return;
  const o = await i.text();
  return o ? JSON.parse(o) : void 0;
}
async function le(e, t = {}) {
  return await qs(e, t, "fail");
}
function Wl(e, t = {}) {
  return qs(e, t, "null");
}
const Hl = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Yl = 0;
function ai(e, t) {
  return le(
    `/api/${Wn(e)}/${t}?dqRead=${Hl}-${++Yl}`,
    { cache: "no-store" }
  );
}
function Ss(e, t) {
  const n = { ...e.view.objectFilter }, a = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    In({
      findFilter: Lt(t, Pe(e)),
      objectFilter: n,
      filterExpression: a
    })
  );
}
async function jr(e, t, n) {
  return le(
    `/api/${Wn(Pe(e))}/find`,
    { method: "POST", signal: n, body: Ss(e, t) }
  );
}
async function Xl(e, t, n) {
  return (await le(
    `/api/${Wn(Pe(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: Ss(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function wo(e, t, n) {
  const a = { ...e.view.objectFilter };
  return delete a._filterExpression, le("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      In({
        findFilter: Lt(t),
        objectFilter: a
      })
    )
  });
}
function Zl(e) {
  return le("/api/taggroups", { signal: e });
}
function ii(e, t, n = 1280) {
  return `/api/${Wn(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function oi(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function yo(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function ed(e) {
  return `/api/stream/video/${e}/preview`;
}
function td(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function nd(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Ra(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e) {
    await le(`/api/tags/${a}`, { signal: t }), n.add(a);
    for (let i = 1; ; i++) {
      const o = await le("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          In({
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
async function Fi(e, t) {
  const n = Ar(e);
  return (await Promise.all(
    e.steps.map(
      async (i) => i.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await Ra(i.tagIds, t)).filter(
          (o) => !n.has(o)
        )
      } : i
    )
  )).filter((i) => i.tagIds.length > 0);
}
function rd(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function Pi(e, t) {
  const a = (await le("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === e.key
  );
  if (!a)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const i = rd(e, a);
  return i ? { kind: "incompatible", message: i } : a.entityTypes.includes(t) ? { kind: "ready", definition: a, message: "" } : {
    kind: "missing",
    message: `Add ${bn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: a
  };
}
async function Es(e, t) {
  const n = await Pi(e, t);
  if (n.kind !== "ready") {
    if (n.kind === "incompatible") throw new Error(n.message);
    if (n.definition) {
      await le(`/api/custom-fields/${n.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...n.definition.entityTypes, t])]
        })
      });
      return;
    }
    await le("/api/custom-fields", {
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
function ks(e = "video") {
  return Pi(Ns, e);
}
function ad(e = "video") {
  return Es(Ns, e);
}
function Cs(e = "video") {
  return Pi(Mi, e);
}
function id(e = "video") {
  return Es(Mi, e);
}
function qa(e) {
  return [...new Set(e)];
}
function As(e, t) {
  const n = e.customFields ?? {}, a = Object.keys(n).find(
    (o) => o.toLowerCase() === Ta
  ), i = a === void 0 ? [] : n[a];
  return qa(
    (Array.isArray(i) ? i : []).filter(
      (o) => typeof o == "string" && /^[1-9]\d*:[1-9]\d*$/.test(o)
    ).map((o) => o.split(":").map(Number)).filter(([o]) => o === t).map(([, o]) => o)
  );
}
async function od(e) {
  let t;
  try {
    t = await Cs(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${Mi.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function sd(e, t, n, a, i, o) {
  await le(`/api/${Wn(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: qa(i).map((s) => `${a}:${s}`)
      },
      customFieldMode: o
    })
  });
}
function cd(e, t, n) {
  const a = [...e.tagIds], i = (o) => {
    if (n === null)
      throw new Error(
        `The ${Oi} custom field is not available.`
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
async function Ts(e, t, n) {
  if (!$n(t) || n.length === 0 || n.some((d) => !Number.isSafeInteger(d) || d <= 0))
    throw new Error(
      `Choose ${bn(e).many} and configure a valid action first.`
    );
  let a = null;
  if (Qn(t)) {
    let d;
    try {
      d = await ks(e);
    } catch (h) {
      throw new Error(
        `Could not verify the ${Oi} custom field. ${h instanceof Error ? h.message : "Request failed."}`
      );
    }
    if (d.kind !== "ready") throw new Error(d.message);
    a = d.definition.key;
  }
  const i = qa(n), o = (await Fi(t)).map((d) => ({
    mode: d.mode,
    tagIds: qa(d.tagIds)
  })), c = [
    ...o.filter((d) => !Tn(d.mode)),
    ...o.filter((d) => Tn(d.mode))
  ].map(
    (d) => cd(d, i, a)
  );
  for (let d = 0; d < c.length; d++)
    try {
      await le(`/api/${Wn(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(c[d])
      });
    } catch (h) {
      throw new Error(
        `Step ${d + 1} failed; ${d} earlier step(s) completed. Refresh and check the selected ${bn(e).many} before retrying. ${h instanceof Error ? h.message : "Request failed."}`
      );
    }
}
async function ld(e, t) {
  if (!$n(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await le("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const fa = (e) => e >= "0" && e <= "9";
function vo(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function No(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let n = 0, a = 0;
  for (; n < e.length && a < t.length; ) {
    if (fa(e[n]) && fa(t[a])) {
      const c = n, d = a;
      for (; n < e.length && fa(e[n]); ) n++;
      for (; a < t.length && fa(t[a]); ) a++;
      const h = e.slice(c, n).replace(/^0+/, ""), u = t.slice(d, a).replace(/^0+/, "");
      if (h.length !== u.length) return h.length < u.length ? -1 : 1;
      if (h !== u) return h < u ? -1 : 1;
      continue;
    }
    const o = vo(e[n]), s = vo(t[a]);
    if (o !== s) return o < s ? -1 : 1;
    n++, a++;
  }
  const i = e.length - n - (t.length - a);
  return i !== 0 ? i < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function Rs(e, t) {
  const n = (i) => i.tagGroupId != null ? 0 : 1, a = (i) => i.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(a(e) - a(t)) || No(e.tagGroupName, t.tagGroupName) || No(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function cr(e) {
  return [...e].sort(Rs);
}
function dd(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const a of n.steps)
        a.mode === "REMOVE_TREE" && a.tagIds.forEach((i) => t.add(i));
  return [...t];
}
function xi(e, t, n) {
  const a = Ar(e), i = [], o = [];
  for (const m of e.steps) {
    if (m.mode !== "REMOVE_TREE") {
      o.push(m);
      continue;
    }
    const N = m.tagIds.flatMap((y) => {
      const q = n.get(y);
      return q || i.push(y), q ?? [y];
    });
    o.push({ mode: "REMOVE", tagIds: N.filter((y) => !a.has(y)) });
  }
  const s = [
    ...o.filter((m) => !Tn(m.mode)),
    ...o.filter((m) => Tn(m.mode))
  ], c = new Set(t.ids), d = new Set(t.absent);
  for (const m of s)
    for (const N of m.tagIds)
      switch (m.mode) {
        case "ADD":
          c.add(N);
          break;
        case "REMOVE":
        case "REMOVE_TREE":
          c.delete(N);
          break;
        case "MARK_PRESENT":
          c.add(N), d.delete(N);
          break;
        case "MARK_ABSENT":
          c.delete(N), d.add(N);
          break;
        case "CLEAR_ABSENCE":
          d.delete(N);
          break;
      }
  const h = new Set(t.ids), u = new Set(t.absent), g = [...new Set(e.steps.flatMap((m) => m.tagIds))];
  return {
    added: g.filter((m) => c.has(m) && !h.has(m)),
    removed: [...h].filter((m) => !c.has(m)),
    markedAbsent: g.filter((m) => d.has(m) && !u.has(m)),
    absenceCleared: [...u].filter((m) => !d.has(m)),
    unresolvedTrees: [...new Set(i)]
  };
}
function ud(e) {
  let t;
  if (e.applications) {
    const n = /* @__PURE__ */ new Map();
    for (const a of e.applications)
      n.has(a.tag.id) || n.set(a.tag.id, a.tag);
    t = [...n.values()];
  } else
    t = e.tags ?? e.ids.map((n, a) => ({ id: n, name: e.names[a] ?? "" }));
  return cr(t);
}
function $s(e) {
  const t = dd(e).sort((s, c) => s - c).join(","), [n, a] = C(() => /* @__PURE__ */ new Map()), i = $(/* @__PURE__ */ new Set()), o = $(!0);
  return H(() => (o.current = !0, () => {
    o.current = !1;
  }), []), H(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const c of s)
      i.current.has(c) || (i.current.add(c), Ra([c]).then(
        (d) => {
          o.current && a((h) => new Map(h).set(c, d));
        },
        () => {
          i.current.delete(c);
        }
      ));
  }, [t]), n;
}
function dr(e) {
  return (e ?? "").trim().toLocaleLowerCase();
}
function Xr(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n, a) => {
    const i = dr(n.group);
    if (!i) return;
    const o = t.get(i);
    o ? o.actions.push(a) : t.set(i, { key: i, name: n.group.trim(), actions: [a] });
  }), [...t.values()];
}
function qo(e) {
  return e.stayUntilGroupsAnswered === !0 && e.actions.some((t) => dr(t.group) !== "");
}
function Is(e) {
  return new Set(
    e.applications ? e.applications.map((t) => t.tag.id) : e.ids
  );
}
function Os(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "MARK_ABSENT").flatMap((t) => t.tagIds)
  );
}
function Ms(e) {
  return Ar(e).size > 0 || Os(e).size > 0;
}
function fd(e) {
  return Xr(e).filter(
    (t) => !t.actions.some((n) => Ms(e[n]))
  );
}
function si(e, t) {
  const n = Is(t), a = new Set(t.absent);
  return Xr(e).map((i) => {
    const o = [], s = [];
    for (const c of i.actions) {
      const d = [...Ar(e[c])], h = [...Os(e[c])], u = [
        ...d.map((g) => n.has(g)),
        ...h.map((g) => a.has(g))
      ];
      u.some(Boolean) && (s.push(c), u.every(Boolean) && o.push(c));
    }
    return { ...i, answers: o.length ? o : s };
  });
}
function ci(e) {
  return e.filter((t) => t.answers.length === 0);
}
function pd(e, t, n) {
  const a = { ids: [...Is(t)], absent: t.absent }, i = xi(e, a, n), o = new Set(i.removed), s = new Set(i.absenceCleared);
  return {
    ids: [...a.ids.filter((c) => !o.has(c)), ...i.added],
    absent: [...a.absent.filter((c) => !s.has(c)), ...i.markedAbsent]
  };
}
const li = "-", So = "Ctrl+a", hd = "Ctrl/⌘A", md = ["f", "g", "k"], Va = "Shift+";
function Tr(e) {
  return ve(() => ms(e), [e]);
}
function Li({
  surface: e,
  enabled: t,
  actions: n,
  onAction: a,
  onFind: i,
  onSelectAll: o
}) {
  const s = Tr(n), c = $({ keyMap: s, onAction: a, onFind: i, onSelectAll: o });
  Zt(() => {
    c.current = { keyMap: s, onAction: a, onFind: i, onSelectAll: o };
  });
  const d = !!i && n.length > 0, h = e === "local" && !!o, u = Jn.filter(
    (m) => s.actionOn.has(m) || e === "local" && md.includes(m)
  ).join(" "), g = ve(() => {
    const m = (q) => {
      var w, I;
      const E = c.current;
      if (q === So) (w = E.onSelectAll) == null || w.call(E);
      else if (q === li) (I = E.onFind) == null || I.call(E);
      else {
        const F = q.startsWith(Va), G = E.keyMap.actionOn.get(
          F ? q.slice(Va.length) : q
        );
        G !== void 0 && E.onAction(G, F);
      }
    }, N = (q, E = e) => ({
      keys: q,
      surface: E,
      action: (w) => {
        w != null && w.repeat || m((w == null ? void 0 : w.sequence) ?? q);
      }
    }), y = [];
    h && y.push(N(So, "local")), d && y.push(N(li));
    for (const q of u ? u.split(" ") : [])
      y.push(N(q), N(`${Va}${q}`));
    return y;
  }, [e, u, d, h]);
  Zc(g, t);
}
const gd = {
  find: li,
  selectAll: hd
};
function Di() {
  return gd;
}
const bd = 600 * 1e3, _i = /* @__PURE__ */ new Map(), Fs = /* @__PURE__ */ new Map(), Bn = /* @__PURE__ */ new Map();
function Ps(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = Fs.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function xs(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && Fs.set(e.tagGroupId, e.tagGroupSortOrder), _i.set(e.id, { tag: e, at: Date.now() });
}
function Ls(e) {
  const t = _i.get(e);
  if (!(!t || Date.now() - t.at > bd))
    return Ps(t.tag);
}
function Ds(e) {
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
function di(e) {
  var t;
  for (const n of e) {
    const a = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && a && xs(Ds({ ...n, name: a }));
  }
}
function wd(e) {
  const t = Bn.get(e);
  if (t) return t;
  const n = new AbortController(), a = {
    controller: n,
    waiters: 0,
    promise: le(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (i) => {
        var u, g;
        const o = ((u = i == null ? void 0 : i.name) == null ? void 0 : u.trim()) || null;
        if (Bn.get(e) === a && Bn.delete(e), !o) return null;
        const s = Ds({ ...i, id: e, name: o }), c = (g = _i.get(e)) == null ? void 0 : g.tag, d = (c == null ? void 0 : c.tagGroupId) === s.tagGroupId, h = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (d ? c == null ? void 0 : c.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (c == null ? void 0 : c.hasImage),
          imagePath: s.imagePath ?? (c == null ? void 0 : c.imagePath)
        };
        return xs(h), Ps(h);
      },
      () => (Bn.get(e) === a && Bn.delete(e), null)
    )
  };
  return Bn.set(e, a), a;
}
function Eo() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function Ja(e) {
  const t = {};
  for (const n of e) {
    const a = Ls(n);
    a !== void 0 && (t[n] = a);
  }
  return t;
}
function yd(e, t) {
  if (t != null && t.aborted) return Promise.reject(Eo());
  const n = {}, a = [];
  for (const i of new Set(e)) {
    const o = Ls(i);
    if (o !== void 0) n[i] = o;
    else {
      const s = wd(i);
      s.waiters += 1, a.push({ id: i, entry: s });
    }
  }
  return a.length ? new Promise((i, o) => {
    let s = !1;
    const c = () => {
      for (const { id: h, entry: u } of a)
        u.waiters -= 1, u.waiters === 0 && Bn.get(h) === u && (Bn.delete(h), u.controller.abort());
    }, d = () => {
      s || (s = !0, c(), o(Eo()));
    };
    t == null || t.addEventListener("abort", d, { once: !0 }), Promise.all(
      a.map(
        ({ id: h, entry: u }) => u.promise.then((g) => [h, g])
      )
    ).then((h) => {
      if (!s) {
        s = !0, t == null || t.removeEventListener("abort", d), c();
        for (const [u, g] of h) n[u] = g;
        i(n);
      }
    });
  }) : Promise.resolve(n);
}
function _s(e) {
  const t = {};
  for (const [n, a] of Object.entries(e)) t[Number(n)] = (a == null ? void 0 : a.name) ?? null;
  return t;
}
function ji(e) {
  const t = [...new Set(e)].sort((i, o) => i - o).join(","), [n, a] = C(() => ({
    key: t,
    tags: Ja(za(t))
  }));
  return H(() => {
    const i = za(t), o = Ja(i);
    if (a({ key: t, tags: o }), i.every((c) => c in o)) return;
    const s = new AbortController();
    return yd(i, s.signal).then(
      (c) => a({ key: t, tags: c }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : Ja(za(t));
}
function Rr(e) {
  const t = ji(e);
  return ve(() => _s(t), [t]);
}
function za(e) {
  return e ? e.split(",").map(Number) : [];
}
const vd = "(max-width: 760px)";
function Nd(e) {
  const [t] = C(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = mn(
    (a) => (t == null || t.addEventListener("change", a), () => t == null ? void 0 : t.removeEventListener("change", a)),
    [t]
  );
  return wi(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function Zr() {
  return Nd(vd);
}
function qd(e, t, n = !1) {
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
function pr(e, t, n = [], a) {
  if ("effect" in e) {
    const s = e.effect;
    if (s.mode === "SKIP") return [{ text: "Skip", tone: "neutral" }];
    if (s.mode === "CLEAR_TAG_GROUP")
      return [{ text: "Set Ungrouped", tone: "neutral" }];
    const c = n.find((d) => d.id === s.tagGroupId);
    return [
      {
        text: c ? `Assign ${c.name}` : "Unavailable tag group",
        tone: "neutral"
      }
    ];
  }
  if (!e.steps.length) return [{ text: "Skip", tone: "neutral" }];
  const i = Ar(e), o = (s) => i.has(s) || [...i].some((c) => {
    var d;
    return (d = a == null ? void 0 : a.get(s)) == null ? void 0 : d.includes(c);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (c) => qd(
        s.mode,
        t[c] === void 0 ? "…" : t[c] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && o(c)
      )
    )
  );
}
function $a(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function Ui({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  canStay: i = !0,
  tapStays: o = !1,
  onApply: s,
  onClose: c
}) {
  const d = Zr(), [h, u] = C(""), [g, m] = C(0), N = $(null), y = $(null), q = $(null), E = $(null), w = $(null), I = $(/* @__PURE__ */ new Set()), F = Nt(), G = Rr(ve(() => $a(e), [e])), K = Tr(e), _ = ve(() => {
    const D = h.trim().toLocaleLowerCase(), B = (v) => v ? Jn.indexOf(v) : Jn.length;
    return e.map((v, T) => ({ action: v, index: T, key: K.keys[T] })).sort((v, T) => B(v.key) - B(T.key)).filter((v) => !D || v.action.label.toLocaleLowerCase().includes(D));
  }, [e, K, h]), Z = _.length ? Math.min(g, _.length - 1) : -1, te = (D) => `${F}-option-${D}`;
  Zt(() => {
    var D, B, v;
    return E.current = document.activeElement, w.current = ((B = (D = q.current) == null ? void 0 : D.parentElement) == null ? void 0 : B.closest('[role="dialog"]')) ?? null, (v = N.current) == null || v.focus({ preventScroll: !0 }), () => {
      var J;
      const T = E.current;
      T instanceof HTMLElement && T.isConnected && T.focus({ preventScroll: !0 }), document.activeElement !== T && ((J = w.current) != null && J.isConnected) && w.current.focus({ preventScroll: !0 });
    };
  }, []), H(() => {
    var D, B, v;
    Z < 0 || (v = (B = (D = y.current) == null ? void 0 : D.querySelector(`[id="${te(_[Z].index)}"]`)) == null ? void 0 : B.scrollIntoView) == null || v.call(B, { block: "nearest" });
  }, [Z, _]);
  function ne(D, B) {
    !D || a != null && a(D.action) || s(D.action, i && B);
  }
  function ie(D) {
    var v;
    D.stopPropagation();
    const B = D.code || D.key;
    if (D.repeat && !I.current.has(B)) {
      D.preventDefault();
      return;
    }
    if (D.repeat || I.current.add(B), D.key === "Escape")
      D.preventDefault(), c();
    else if (D.key === "Enter")
      D.preventDefault(), D.repeat || ne(_[Z], D.shiftKey);
    else if (D.key === "ArrowDown" || D.key === "ArrowUp") {
      if (D.preventDefault(), !_.length) return;
      const T = D.key === "ArrowDown" ? 1 : -1;
      m((Z + T + _.length) % _.length);
    } else D.key === "Tab" && (D.preventDefault(), (v = N.current) == null || v.focus());
  }
  return /* @__PURE__ */ l(ue, { children: [
    /* @__PURE__ */ r("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: c }),
    /* @__PURE__ */ l(
      "div",
      {
        ref: q,
        role: "dialog",
        "aria-label": "Find an action",
        className: `dq-find-action${d ? " dq-find-mobile" : ""}`,
        onKeyDown: ie,
        onMouseDown: (D) => {
          D.target !== N.current && D.preventDefault();
        },
        children: [
          /* @__PURE__ */ l("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ r(zr, { "aria-hidden": "true" }),
            /* @__PURE__ */ r(
              "input",
              {
                ref: N,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${F}-list`,
                "aria-activedescendant": Z >= 0 ? te(_[Z].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: h,
                onChange: (D) => {
                  u(D.target.value), m(0);
                }
              }
            ),
            !d && /* @__PURE__ */ r("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          _.length ? /* @__PURE__ */ r(
            "ul",
            {
              ref: y,
              id: `${F}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: _.map((D, B) => /* @__PURE__ */ r("li", { role: "none", children: /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: te(D.index),
                  tabIndex: -1,
                  "aria-selected": B === Z,
                  disabled: (a == null ? void 0 : a(D.action)) ?? !1,
                  onClick: (v) => ne(D, v.shiftKey || o && ei(D.action)),
                  children: [
                    d ? null : D.key ? /* @__PURE__ */ r("kbd", { children: D.key }) : /* @__PURE__ */ r("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ r("span", { className: "dq-find-label", children: D.action.label }),
                    /* @__PURE__ */ r("span", { className: "dq-find-effect", children: pr(D.action, G, t, n).map(
                      (v, T) => /* @__PURE__ */ r("span", { "data-effect-tone": v.tone, children: v.text }, T)
                    ) })
                  ]
                }
              ) }, D.action.id))
            }
          ) : /* @__PURE__ */ l("p", { className: "dq-find-empty", role: "status", children: [
            "No action matches “",
            h.trim(),
            "”."
          ] }),
          !d && /* @__PURE__ */ l("p", { className: "dq-find-hints", "aria-hidden": "true", children: [
            /* @__PURE__ */ l("span", { children: [
              /* @__PURE__ */ r("kbd", { children: "Enter" }),
              " applies"
            ] }),
            i && /* @__PURE__ */ l("span", { children: [
              /* @__PURE__ */ r("kbd", { children: "Shift" }),
              /* @__PURE__ */ r("kbd", { children: "Enter" }),
              " applies and stays"
            ] }),
            /* @__PURE__ */ l("span", { children: [
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
function js() {
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
function Gi(e) {
  return wi(e.subscribe, e.get, e.get);
}
function Us(e, t) {
  const n = $(t);
  Zt(() => {
    n.current !== t && (n.current = t, e.set(null));
  }, [e, t]);
}
function Gs(e, t) {
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
const ko = Br.map((e, t) => ({
  indent: t,
  keys: e,
  fixed: t === 2 ? ["n", "m", ",", "."] : []
}));
function Sd(e, t) {
  return t === "video" && e === "m" ? "Mute" : "";
}
function at({ binding: e, hidden: t }) {
  return /* @__PURE__ */ r(
    "kbd",
    {
      className: Array.from(e).length === 1 ? "dq-key dq-key-letter" : "dq-key",
      "aria-hidden": t || void 0,
      children: e
    }
  );
}
function pa(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function Ks(e) {
  return Br.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
    (t) => t.length > 0
  );
}
function Bs({
  groups: e,
  renderAction: t,
  find: n
}) {
  const a = e.length ? e : [[]];
  return /* @__PURE__ */ r(ue, { children: a.map((i, o) => /* @__PURE__ */ l("div", { className: "dq-mobile-group", children: [
    i.map(t),
    o === a.length - 1 && n
  ] }, o)) });
}
function Vs({
  extra: e,
  findKey: t,
  disabled: n,
  onFind: a
}) {
  return /* @__PURE__ */ l(
    "button",
    {
      type: "button",
      className: "dq-mobile-tile dq-mobile-find",
      "aria-label": e > 0 ? `Find, ${e} more` : "Find",
      "aria-keyshortcuts": t,
      disabled: n,
      onClick: a,
      children: [
        /* @__PURE__ */ l("span", { className: "dq-mobile-find-name", children: [
          /* @__PURE__ */ r(zr, { "aria-hidden": "true" }),
          "Find"
        ] }),
        e > 0 && /* @__PURE__ */ l("span", { className: "dq-mobile-more", children: [
          e,
          " more"
        ] })
      ]
    }
  );
}
function Ed({
  groups: e,
  statuses: t,
  actions: n
}) {
  return /* @__PURE__ */ r(
    "ul",
    {
      className: "dq-group-checklist",
      "aria-label": "Answer groups",
      title: "A plain action moves on once every group has an answer",
      children: (t ?? e).map((a) => {
        const i = t ? a.answers : null, o = i ? i.length ? "answered" : "open" : "unknown", s = i == null ? void 0 : i.map((c) => n[c].label).join(", ");
        return /* @__PURE__ */ l(
          "li",
          {
            className: "dq-group",
            "data-state": o,
            title: o === "answered" ? `${a.name}: ${s}` : o === "open" ? `${a.name}: not answered yet` : a.name,
            children: [
              /* @__PURE__ */ r("span", { className: "dq-group-name", children: a.name }),
              o === "answered" && /* @__PURE__ */ l(ue, { children: [
                /* @__PURE__ */ r(Ca, { "aria-hidden": "true" }),
                /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", answered:" }),
                " ",
                /* @__PURE__ */ r("span", { className: "dq-group-answer", children: s })
              ] }),
              o === "open" && /* @__PURE__ */ l(ue, { children: [
                /* @__PURE__ */ r("span", { className: "dq-group-ring", "aria-hidden": "true" }),
                /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", not answered yet" })
              ] })
            ]
          },
          a.key
        );
      })
    }
  );
}
function kd({ checked: e, onChange: t }) {
  return /* @__PURE__ */ l(
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
function Cd({
  actions: e,
  mediaKind: t,
  isDisabled: n,
  busy: a,
  tags: i,
  trees: o,
  preview: s,
  onApply: c,
  onFind: d,
  findDisabled: h,
  paused: u = !1,
  waitForGroups: g = !1,
  stayOnTap: m = !1,
  onStayOnTapChange: N
}) {
  const y = Di(), q = Tr(e), E = Zr();
  Us(s, E);
  const w = Nt(), I = Rr(
    ve(() => e.flatMap((P) => P.steps.flatMap((Q) => Q.tagIds)), [e])
  ), F = ko.filter((P) => P.keys.some((Q) => q.actionOn.has(Q))), G = F.includes(ko[2]), K = e.length - q.actionOn.size, _ = ve(
    () => g && !u ? Xr(e) : [],
    [g, u, e]
  ), Z = ve(
    () => _.length && i ? si(e, i) : null,
    [_, e, i]
  ), te = new Map(
    ci(Z ?? []).flatMap(
      (P) => P.actions.filter((Q) => Ms(e[Q])).map((Q) => [Q, P.name])
    )
  ), ne = _.length > 0 && /* @__PURE__ */ r(Ed, { groups: _, statuses: Z, actions: e }), ie = (P) => {
    const Q = pr(e[P], I, [], o).map((j) => j.text).join(", "), z = te.get(P);
    return z === void 0 ? Q : `${Q}. ${z}: not answered yet`;
  }, D = (P) => ({
    onMouseEnter: () => s.set(P),
    onMouseLeave: () => s.clear(P),
    onFocus: () => s.set(P),
    onBlur: (Q) => {
      Q.currentTarget.contains(Q.relatedTarget) || s.clear(P);
    }
  }), B = (P) => {
    const Q = q.actionOn.get(P), z = Q === void 0 ? void 0 : e[Q];
    if (!z)
      return /* @__PURE__ */ r(
        "div",
        {
          className: "dq-pad-slot dq-pad-free",
          "aria-hidden": "true",
          title: "No action on this key: it does nothing here",
          children: /* @__PURE__ */ r(at, { binding: P })
        },
        P
      );
    const j = n(z), A = `${w}-effect-${P}`;
    return /* @__PURE__ */ l("div", { className: "dq-pad-slot", ...u ? {} : D(z), children: [
      /* @__PURE__ */ r("span", { id: A, className: "dq-sr-only", children: ie(Q) }),
      /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: z.label,
          "aria-keyshortcuts": P,
          "aria-describedby": A,
          "data-group-open": te.has(Q) || void 0,
          disabled: j,
          onClick: (Fe) => c(z, Fe.shiftKey),
          children: [
            /* @__PURE__ */ r(at, { binding: P }),
            " ",
            /* @__PURE__ */ r("span", { className: "dq-pad-label", children: z.label }),
            pa(z) && " ",
            pa(z) && /* @__PURE__ */ l("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(wa, { "aria-hidden": "true" }),
              "absent"
            ] })
          ]
        }
      ),
      ei(z) && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-pad-pin",
          "aria-label": `Apply and stay: ${z.label}`,
          title: "Apply and stay (Shift)",
          disabled: j,
          onClick: () => c(z, !0),
          children: /* @__PURE__ */ r(qi, { "aria-hidden": "true" })
        }
      )
    ] }, P);
  }, v = /* @__PURE__ */ l("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ r(kr, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (E) {
    const P = Ks(q), Q = (z) => {
      const j = e[z], A = q.keys[z];
      return /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: j.label,
          "aria-keyshortcuts": A,
          "aria-describedby": `${w}-effect-${A}`,
          "data-group-open": te.has(z) || void 0,
          disabled: n(j),
          onClick: (Fe) => {
            s.clear(j), c(j, Fe.shiftKey || m && ei(j));
          },
          ...u ? {} : Gs(s, j),
          children: [
            /* @__PURE__ */ r("span", { className: "dq-mobile-label", children: j.label }),
            pa(j) && " ",
            pa(j) && /* @__PURE__ */ l("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(wa, { "aria-hidden": "true" }),
              "absent"
            ] })
          ]
        },
        A
      );
    };
    return /* @__PURE__ */ l(
      "section",
      {
        className: `dq-pad dq-pad-mobile${u ? " dq-pad-paused" : ""}`,
        "aria-label": u ? "Actions, paused while editing" : "Actions",
        "aria-busy": a || void 0,
        children: [
          /* @__PURE__ */ l("div", { className: "dq-pad-header", children: [
            u ? v : /* @__PURE__ */ r(
              Co,
              {
                actions: e,
                keyMap: q,
                names: I,
                tags: i,
                trees: o,
                preview: s,
                findKey: y.find,
                mobile: !0
              }
            ),
            N && /* @__PURE__ */ r(kd, { checked: m, onChange: N })
          ] }),
          ne,
          /* @__PURE__ */ r("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ r(
            Bs,
            {
              groups: P,
              renderAction: Q,
              find: /* @__PURE__ */ r(
                Vs,
                {
                  extra: K,
                  findKey: y.find,
                  disabled: h,
                  onFind: d
                }
              )
            }
          ) }),
          /* @__PURE__ */ r("div", { hidden: !0, children: P.flat().map((z) => /* @__PURE__ */ r("span", { id: `${w}-effect-${q.keys[z]}`, children: ie(z) }, z)) })
        ]
      }
    );
  }
  const T = /* @__PURE__ */ l("span", { className: "dq-pad-hint", children: [
    /* @__PURE__ */ r("kbd", { className: "dq-key", children: "Shift" }),
    /* @__PURE__ */ r("span", { children: "+ key applies and stays" })
  ] }), J = !G && /* @__PURE__ */ l(
    "button",
    {
      type: "button",
      className: "dq-pad-find-button",
      "aria-label": K ? `Find action, ${K} more` : "Find action",
      "aria-keyshortcuts": y.find,
      disabled: h,
      onClick: d,
      children: [
        /* @__PURE__ */ r(at, { binding: y.find }),
        /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "Find action" })
      ]
    }
  );
  return /* @__PURE__ */ l(
    "section",
    {
      className: `dq-pad${u ? " dq-pad-paused" : ""}`,
      "aria-label": u ? "Actions, paused while editing" : "Actions",
      "aria-busy": a || void 0,
      children: [
        /* @__PURE__ */ l("div", { className: `dq-pad-header${ne ? " dq-pad-header-groups" : ""}`, children: [
          u ? v : /* @__PURE__ */ r(
            Co,
            {
              actions: e,
              keyMap: q,
              names: I,
              tags: i,
              trees: o,
              preview: s,
              findKey: y.find
            }
          ),
          ne ? (
            // The checklist, then the hint and Find action, on the header's second line, under the
            // effect line: the pad keeps its height as answers of any length come in.
            /* @__PURE__ */ l("div", { className: "dq-pad-header-end", children: [
              ne,
              T,
              J
            ] })
          ) : /* @__PURE__ */ l(ue, { children: [
            !u && T,
            J
          ] })
        ] }),
        F.map((P) => /* @__PURE__ */ l("div", { className: "dq-pad-row", "data-indent": P.indent, children: [
          P.keys.map(B),
          P.fixed.map((Q) => {
            const z = Sd(Q, t);
            return /* @__PURE__ */ l(
              "div",
              {
                className: `dq-pad-slot dq-pad-free dq-pad-fixed${z ? " dq-pad-reserved" : ""}`,
                "aria-hidden": "true",
                children: [
                  /* @__PURE__ */ r(at, { binding: Q }),
                  z && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: z })
                ]
              },
              Q
            );
          }),
          P.fixed.length > 0 && /* @__PURE__ */ r("div", { className: "dq-pad-slot", children: /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": K ? `Find action, ${K} more` : "Find action",
              "aria-keyshortcuts": y.find,
              disabled: h,
              onClick: d,
              children: [
                /* @__PURE__ */ r(at, { binding: y.find }),
                /* @__PURE__ */ l("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ r(zr, { "aria-hidden": "true" }),
                  K ? `${K} more` : "Find action"
                ] })
              ]
            }
          ) })
        ] }, P.indent))
      ]
    }
  );
}
function Co({
  actions: e,
  keyMap: t,
  names: n,
  tags: a,
  trees: i,
  preview: o,
  findKey: s,
  mobile: c = !1
}) {
  const d = Gi(o), h = d ? e.indexOf(d) : -1;
  if (!d || h < 0) {
    const N = t.actionOn.size;
    return /* @__PURE__ */ l("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      !c && N < e.length && /* @__PURE__ */ l(ue, { children: [
        ` · ${N} on keys, ${e.length - N} more under `,
        /* @__PURE__ */ r(at, { binding: s })
      ] })
    ] });
  }
  const u = t.keys[h], g = a && d.steps.length ? xi(d, a, i) : null, m = g && !g.unresolvedTrees.length && ![g.added, g.removed, g.markedAbsent, g.absenceCleared].some(
    (N) => N.length
  );
  return /* @__PURE__ */ l("p", { className: "dq-pad-effect", children: [
    u && !c && /* @__PURE__ */ r(at, { binding: u }),
    /* @__PURE__ */ r("strong", { children: d.label }),
    pr(d, n, [], i).map((N, y) => /* @__PURE__ */ r("span", { "data-effect-tone": N.tone, children: N.text }, y)),
    m && /* @__PURE__ */ r("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function Js({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  busy: i,
  onApply: o,
  onFind: s,
  summary: c,
  hints: d,
  keyHints: h,
  notices: u,
  status: g,
  className: m = "",
  paused: N = !1
}) {
  const y = Di(), q = Tr(e), E = Zr(), w = Nt(), I = Rr(ve(() => $a(e), [e])), [F] = C(() => js());
  Us(F, E);
  const G = $(null), K = Ad(G, e, !E), _ = Ks(q);
  !_.length && e.length && _.push([]);
  const Z = _.flat(), te = e.length - Z.length, ne = (v) => pr(v, I, t, n).map((T) => T.text).join(", "), ie = (v) => ({
    onMouseEnter: () => F.set(v),
    onMouseLeave: () => F.clear(v),
    onFocus: () => F.set(v),
    onBlur: (T) => {
      T.currentTarget.contains(T.relatedTarget) || F.clear(v);
    }
  }), D = d ?? (E ? void 0 : h), B = (v) => {
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
          F.clear(T), o(T);
        },
        ...N ? {} : Gs(F, T),
        children: /* @__PURE__ */ r("span", { className: "dq-mobile-label", children: T.label })
      },
      T.id
    );
  };
  return /* @__PURE__ */ l(
    "section",
    {
      ref: G,
      className: `dq-action-bar${E ? " dq-bar-mobile" : K ? " dq-bar-stacked" : ""}${i ? " dq-bar-busy" : ""}${N ? " dq-bar-paused" : ""}${m ? ` ${m}` : ""}`,
      "aria-label": "Actions",
      children: [
        /* @__PURE__ */ r("div", { className: "dq-bar-summary", children: c }),
        /* @__PURE__ */ r("span", { className: "dq-bar-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ l(
          "div",
          {
            className: `dq-bar-tiles${E ? " dq-mobile-actions" : ""}`,
            "aria-busy": i || void 0,
            children: [
              E && e.length > 0 && /* @__PURE__ */ r(
                Bs,
                {
                  groups: _,
                  renderAction: B,
                  find: /* @__PURE__ */ r(
                    Vs,
                    {
                      extra: te,
                      findKey: y.find,
                      disabled: N,
                      onFind: s
                    }
                  )
                }
              ),
              !E && _.map((v, T) => /* @__PURE__ */ l("div", { className: "dq-bar-line", children: [
                v.map((J) => {
                  const P = e[J], Q = q.keys[J];
                  return /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: P.label,
                      "aria-keyshortcuts": Q || void 0,
                      "aria-describedby": `${w}-effect-${J}`,
                      disabled: N || a(P),
                      onClick: () => o(P),
                      ...N ? {} : ie(P),
                      children: [
                        Q && /* @__PURE__ */ r(at, { binding: Q }),
                        " ",
                        /* @__PURE__ */ r("span", { className: "dq-bar-label", children: P.label })
                      ]
                    },
                    P.id
                  );
                }),
                T === _.length - 1 && /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "dq-bar-tile dq-bar-find",
                    "aria-label": te > 0 ? `Find action, ${te} more` : "Find action",
                    "aria-keyshortcuts": y.find,
                    disabled: N,
                    onClick: s,
                    children: [
                      /* @__PURE__ */ r(at, { binding: y.find, hidden: !0 }),
                      /* @__PURE__ */ r(zr, { "aria-hidden": "true" }),
                      /* @__PURE__ */ r("span", { className: "dq-bar-label", children: te > 0 ? `${te} more` : "Find action" })
                    ]
                  }
                )
              ] }, T)),
              !e.length && /* @__PURE__ */ r("p", { className: "dq-bar-empty", children: "This review has no actions." })
            ]
          }
        ),
        D && /* @__PURE__ */ r("p", { className: "dq-bar-hints", children: D }),
        N ? /* @__PURE__ */ l("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ r(kr, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ r(
          Td,
          {
            actions: e,
            keyMap: q,
            preview: F,
            names: I,
            tagGroups: t,
            trees: n,
            showKey: !E
          }
        ),
        u && /* @__PURE__ */ r("div", { className: "dq-bar-notices", children: u }),
        /* @__PURE__ */ r("div", { hidden: !0, children: Z.map((v) => /* @__PURE__ */ r("span", { id: `${w}-effect-${v}`, children: ne(e[v]) }, e[v].id)) }),
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: g })
      ]
    }
  );
}
function Ad(e, t, n) {
  const [a, i] = C(!1);
  return Zt(() => {
    var u;
    const o = e.current;
    if (!o || !n || typeof ResizeObserver > "u") return;
    const s = o.querySelector(".dq-bar-summary"), c = () => {
      const g = getComputedStyle(o), m = parseFloat(g.columnGap) || 0, N = o.clientWidth - (parseFloat(g.paddingLeft) || 0) - (parseFloat(g.paddingRight) || 0), y = [...o.querySelectorAll(".dq-bar-line")].map(
        (Z) => [...Z.children].map((te) => te.offsetWidth)
      ), q = o.querySelector(".dq-bar-line"), E = q && parseFloat(getComputedStyle(q).columnGap) || 0, w = o.querySelector(".dq-bar-hints"), I = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (w ? w.offsetWidth + m : 0) + 1 + // the divider
      2 * m, F = (Z) => y.map((te) => {
        let ne = 1, ie = 0;
        for (const D of te)
          ie > 0 && ie + E + D > Z ? (ne += 1, ie = D) : ie += (ie > 0 ? E : 0) + D;
        return ne;
      }), G = (Z) => Math.max(1, Z.reduce((te, ne) => te + ne, 0)), K = F(N), _ = G(F(N - I));
      i(
        1 + G(K) < _ || 1 + G(K) === _ && K.every((Z) => Z === 1)
      );
    }, d = new ResizeObserver(c);
    d.observe(o);
    for (const g of o.querySelectorAll(".dq-bar-summary, .dq-bar-tiles, .dq-bar-hints"))
      d.observe(g);
    c();
    let h = !0;
    return (u = document.fonts) == null || u.ready.then(() => {
      h && c();
    }), () => {
      h = !1, d.disconnect();
    };
  }, [e, t, n]), a;
}
function Td({
  actions: e,
  keyMap: t,
  preview: n,
  names: a,
  tagGroups: i,
  trees: o,
  showKey: s
}) {
  const c = Gi(n), d = c ? e.indexOf(c) : -1;
  if (!c || d < 0) return null;
  const h = t.keys[d];
  return /* @__PURE__ */ l("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    h && s && /* @__PURE__ */ r(at, { binding: h }),
    /* @__PURE__ */ r("strong", { children: c.label }),
    pr(c, a, i, o).map((u, g) => /* @__PURE__ */ r("span", { "data-effect-tone": u.tone, children: u.text }, g))
  ] });
}
const Ao = 1e3;
async function Rd(e, t, n) {
  const a = await le(
    `/api/tags/${t}`,
    { signal: n }
  ), i = /* @__PURE__ */ new Map();
  for (let d = 1; ; d++) {
    const h = await le(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          In({
            findFilter: {
              page: d,
              perPage: Ao,
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
    for (const u of h.items) i.set(u.id, u);
    if (d * Ao >= h.totalCount) break;
    if (!h.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const o = [...i.values()], s = Pe(e), c = Te(e) ? await Id(
    s,
    o.map((d) => d.id),
    n
  ) : o.map((d) => (s === "audio" ? d.audioCount : d.videoCount) ?? 0);
  return {
    parent: { id: t, name: a.name },
    children: o.map((d, h) => ({ id: d.id, name: d.name, uses: c[h] })).sort(
      (d, h) => h.uses - d.uses || d.name.localeCompare(h.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      })
    )
  };
}
function $d(e) {
  return JSON.stringify(
    In({
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
async function Id(e, t, n) {
  const a = new Array(t.length).fill(0), i = new AbortController(), o = () => i.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && o(), n == null || n.addEventListener("abort", o, { once: !0 });
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; s < t.length && !i.signal.aborted; ) {
            const c = s++;
            a[c] = (await le(
              `/api/${Wn(e)}/aggregate`,
              {
                method: "POST",
                signal: i.signal,
                body: $d(t[c])
              }
            )).count;
          }
        } catch (c) {
          throw i.abort(), c;
        }
      })
    );
  } finally {
    n == null || n.removeEventListener("abort", o);
  }
  return i.signal.throwIfAborted(), a;
}
function Od(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((a) => t.has(a.id) ? !1 : (t.add(a.id), !0))
  }));
}
function Md(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of n.children)
      t.set(a.id, [...t.get(a.id) ?? [], n.parent.id]);
  return t;
}
function Fd(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of Ar(n))
      t.set(a, [...t.get(a) ?? [], n]);
  return t;
}
function Pd(e, t, n) {
  return {
    id: crypto.randomUUID(),
    label: e.name,
    steps: [
      { mode: "ADD", tagIds: [e.id] },
      ...t.length ? [{ mode: "REMOVE_TREE", tagIds: t }] : []
    ],
    ...n != null && n.trim() ? { group: n.trim() } : {}
  };
}
function xd(e, t) {
  var a;
  const n = dr(e);
  return ((a = Xr(t).find((i) => i.key === n)) == null ? void 0 : a.name) ?? e.trim();
}
const Ld = (e) => e instanceof Error ? e.message : "Request failed.";
function Dd({
  id: e,
  review: t,
  disabled: n,
  onAdd: a,
  onCancel: i
}) {
  const [o, s] = C([]), [c, d] = C({}), [h, u] = C({}), [g, m] = C({}), N = $(/* @__PURE__ */ new Map());
  H(
    () => () => {
      for (const v of N.current.values()) v.abort();
    },
    []
  );
  const y = bn(Pe(t)), q = Te(t), E = q ? "performer" : y.one;
  function w(v) {
    var J;
    (J = N.current.get(v)) == null || J.abort();
    const T = new AbortController();
    N.current.set(v, T), d((P) => ({ ...P, [v]: { status: "loading" } })), Rd(t, v, T.signal).then(
      (P) => {
        T.signal.aborted || d((Q) => ({
          ...Q,
          [v]: { status: "ready", group: P }
        }));
      },
      (P) => {
        T.signal.aborted || d((Q) => ({
          ...Q,
          [v]: { status: "failed", message: Ld(P) }
        }));
      }
    );
  }
  function I(v) {
    var z;
    const T = o.filter((j) => !v.includes(j));
    for (const j of T)
      (z = N.current.get(j)) == null || z.abort(), N.current.delete(j);
    const J = (j) => {
      const A = c[j];
      return (A == null ? void 0 : A.status) === "ready" ? A.group.children.map((Fe) => Fe.id) : [];
    }, P = new Set(v.flatMap(J)), Q = T.flatMap(J).filter((j) => !P.has(j));
    u(
      (j) => Object.fromEntries(
        Object.entries(j).filter(([A]) => !Q.includes(Number(A)))
      )
    ), m(
      (j) => Object.fromEntries(
        Object.entries(j).filter(([A]) => v.includes(Number(A)))
      )
    ), d(
      (j) => Object.fromEntries(
        Object.entries(j).filter(([A]) => v.includes(Number(A)))
      )
    ), s(v);
    for (const j of v) o.includes(j) || w(j);
  }
  const F = o.flatMap((v) => {
    const T = c[v];
    return (T == null ? void 0 : T.status) === "ready" ? [T.group] : [];
  }), G = F.length === o.length, K = o.some(
    (v) => {
      var T;
      return (((T = c[v]) == null ? void 0 : T.status) ?? "loading") === "loading";
    }
  ), _ = new Map(
    Od(F).map((v) => [v.parent.id, v])
  ), Z = Md(F), te = new Map(F.map((v) => [v.parent.id, v.parent.name])), ne = Fd(t.actions), ie = (v) => h[v] ?? !ne.has(v), D = G ? [..._.values()].flatMap((v) => {
    const T = xd(v.parent.name, t.actions);
    return v.children.filter((J) => ie(J.id)).map((J) => ({ child: J, answerGroup: T }));
  }) : [], B = (v, T) => u((J) => ({
    ...J,
    ...Object.fromEntries(v.children.map((P) => [P.id, T]))
  }));
  return /* @__PURE__ */ l("fieldset", { id: e, className: "dq-actions-from-tags", children: [
    /* @__PURE__ */ r("legend", { children: "Add actions from parent tags" }),
    /* @__PURE__ */ l("p", { className: "dq-drawer-note", children: [
      "Each ticked child tag becomes an action that adds it, most used",
      " ",
      q ? "on performers " : "",
      "first, in a group named after its parent. Tags an action already adds start unticked. The new actions go at the end, ready to reorder and edit."
    ] }),
    /* @__PURE__ */ r(
      Rn,
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
      const T = c[v];
      if (!T || T.status === "loading")
        return /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Loading child tags…" }, v);
      if (T.status === "failed")
        return /* @__PURE__ */ l("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ l("span", { children: [
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
      const J = _.get(v);
      if (!J) return null;
      const P = J.parent.name;
      return /* @__PURE__ */ l("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ r("legend", { children: P }),
        T.group.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ l(ue, { children: [
          /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: g[v] ?? !1,
                disabled: n,
                onChange: (Q) => m((z) => ({
                  ...z,
                  [v]: Q.target.checked
                }))
              }
            ),
            "Only one per ",
            E,
            ": each action removes every other tag in the ",
            P,
            " tree"
          ] }),
          J.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ l(ue, { children: [
            /* @__PURE__ */ l("div", { className: "dq-row", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${P}`,
                  onClick: () => B(J, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${P}`,
                  onClick: () => B(J, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ r("div", { className: "dq-child-tags", children: J.children.map((Q) => {
              const z = ne.get(Q.id) ?? [], j = (Z.get(Q.id) ?? []).filter((A) => A !== v).map((A) => `“${te.get(A)}”`);
              return /* @__PURE__ */ l("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "checkbox",
                    checked: ie(Q.id),
                    disabled: n,
                    onChange: (A) => u((Fe) => ({
                      ...Fe,
                      [Q.id]: A.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ l("span", { children: [
                  Q.name,
                  " ",
                  /* @__PURE__ */ l("small", { children: [
                    Q.uses.toLocaleString(),
                    " ",
                    Q.uses === 1 ? y.one : y.many
                  ] }),
                  j.length > 0 && /* @__PURE__ */ l("small", { children: [
                    " · Also under ",
                    j.join(", ")
                  ] }),
                  z.length > 0 && /* @__PURE__ */ l("small", { children: [
                    " ",
                    "· Already in “",
                    z[0].label || "New action",
                    "”",
                    z.length > 1 ? ` and ${z.length - 1} more` : ""
                  ] })
                ] })
              ] }, Q.id);
            }) })
          ] })
        ] })
      ] }, v);
    }),
    /* @__PURE__ */ l("div", { className: "dq-row", children: [
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: n || !D.length,
          onClick: () => a(
            D.map(
              ({ child: v, answerGroup: T }) => Pd(
                v,
                (Z.get(v.id) ?? []).filter(
                  (J) => g[J]
                ),
                T
              )
            )
          ),
          children: D.length ? `Add ${D.length} action${D.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: i, children: "Cancel" }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-sr-only", children: K ? "Loading child tags…" : "" })
    ] })
  ] });
}
const _d = ["n", "m"], Kn = [
  ...Br,
  ["auto", zn]
];
function Sa(e) {
  return e.toLocaleUpperCase();
}
function zs(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : Ri(e[n]);
}
function jd({
  actions: e,
  index: t,
  keyMap: n,
  name: a,
  onChoose: i
}) {
  const [o, s] = C(!1), c = $(null), d = n.keys[t], h = zs(e, n, t), u = sr(h), g = n.duplicatePins.has(t) ? ` (${Sa(e[t].shortcut ?? "")} is pinned twice)` : "", m = d ? `${Sa(d)}, ${u ? "pinned" : "Auto"}${g}` : h === zn ? "no key, Find action only" : `no key: Auto found no free key${g}`, N = () => {
    var y;
    s(!1), (y = c.current) == null || y.focus();
  };
  return /* @__PURE__ */ l(ue, { children: [
    /* @__PURE__ */ l(
      "button",
      {
        ref: c,
        type: "button",
        className: "dq-key-button",
        "aria-label": `Key for ${a}: ${m}`,
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        title: "Choose the key",
        onClick: () => s(!o),
        children: [
          d ? /* @__PURE__ */ r(at, { binding: d }) : /* @__PURE__ */ r("span", { className: "dq-key dq-key-none", children: "·" }),
          u && /* @__PURE__ */ r(qi, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ r(
      Ud,
      {
        actions: e,
        index: t,
        keyMap: n,
        name: a,
        onChoose: (y) => {
          i(y), N();
        },
        onClose: N
      }
    )
  ] });
}
function Ud({
  actions: e,
  index: t,
  keyMap: n,
  name: a,
  onChoose: i,
  onClose: o
}) {
  const s = $(null), c = n.keys[t], d = zs(e, n, t), [h, u] = C(c || "q"), g = (q) => {
    var E;
    return ((E = s.current) == null ? void 0 : E.querySelector(`[data-choice="${q}"]`)) ?? null;
  };
  Zt(() => {
    var q, E, w;
    (q = g(c || d)) == null || q.focus(), (w = (E = s.current) == null ? void 0 : E.scrollIntoView) == null || w.call(E, { block: "nearest" });
  }, []);
  function m(q) {
    var E;
    sr(q) && u(q), (E = g(q)) == null || E.focus();
  }
  function N(q) {
    var _, Z, te;
    if (q.key === "Escape") {
      q.preventDefault(), q.stopPropagation(), o();
      return;
    }
    if (q.key === "Tab") {
      const ne = [...((_ = s.current) == null ? void 0 : _.querySelectorAll("button[tabindex='0']")) ?? []], ie = ne.indexOf(document.activeElement);
      q.preventDefault(), (Z = ne[(ie + (q.shiftKey ? -1 : 1) + ne.length) % ne.length]) == null || Z.focus();
      return;
    }
    const E = (te = q.target.dataset) == null ? void 0 : te.choice, w = E ? Kn.findIndex((ne) => ne.includes(E)) : -1;
    if (!E || w < 0) return;
    const I = Kn[w].indexOf(E), F = (ne) => ne == null ? void 0 : ne[Math.min(I, ne.length - 1)], G = {
      ArrowLeft: Kn[w][I - 1],
      ArrowRight: Kn[w][I + 1],
      ArrowUp: F(Kn[w - 1]),
      ArrowDown: F(Kn[w + 1]),
      Home: Kn[w][0],
      End: Kn[w].at(-1)
    };
    if (!Object.hasOwn(G, q.key)) return;
    q.preventDefault();
    const K = G[q.key];
    K && m(K);
  }
  const y = (q) => {
    const E = sr(q) ? n.actionOn.get(q) : void 0;
    return E === void 0 ? null : {
      own: E === t,
      label: e[E].label.trim() || "New action",
      pinned: Ri(e[E]) === q
    };
  };
  return /* @__PURE__ */ l(ue, { children: [
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
    /* @__PURE__ */ l(
      "div",
      {
        ref: s,
        role: "dialog",
        "aria-label": `Key for ${a}`,
        className: "dq-key-picker",
        onKeyDown: N,
        onMouseDown: (q) => q.preventDefault(),
        children: [
          /* @__PURE__ */ l("p", { className: "dq-key-picker-title", children: [
            "Key for ",
            /* @__PURE__ */ r("strong", { children: a })
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: Br.map((q, E) => /* @__PURE__ */ l("div", { className: "dq-key-picker-row", "data-indent": E, children: [
            q.map((w) => {
              const I = y(w), F = I ? `${I.own ? "this action" : I.label}, ${I.pinned ? "pinned" : "Auto"}` : "free";
              return /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  className: `dq-key-choice${I ? "" : " dq-key-choice-free"}${I != null && I.own ? " dq-key-choice-own" : ""}`,
                  "data-choice": w,
                  tabIndex: w === h ? 0 : -1,
                  "aria-label": `${Sa(w)}: ${F}`,
                  "aria-pressed": !!(I != null && I.own && I.pinned),
                  title: I ? `${I.label} (${I.pinned ? "pinned" : "Auto"})` : void 0,
                  onFocus: () => u(w),
                  onClick: () => i(w),
                  children: [
                    /* @__PURE__ */ l("span", { className: "dq-key-choice-head", children: [
                      /* @__PURE__ */ r(at, { binding: w }),
                      (I == null ? void 0 : I.pinned) && /* @__PURE__ */ r(qi, { "aria-hidden": "true" })
                    ] }),
                    I && /* @__PURE__ */ r("span", { className: "dq-key-choice-label", children: I.label })
                  ]
                },
                w
              );
            }),
            E === Br.length - 1 && _d.map((w) => (
              // Unavailable, yet not disabled: a browser gives a disabled button no press for
              // the panel to keep, and moves focus out of the picker. This one chooses nothing
              // and is never focused (the arrow keys and Tab pass it by).
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-key-choice dq-key-choice-free",
                  "aria-label": `${Sa(w)}: not available, it steps through the grid preview`,
                  title: "Steps through the grid preview",
                  "aria-disabled": "true",
                  tabIndex: -1,
                  children: /* @__PURE__ */ r("span", { className: "dq-key-choice-head", children: /* @__PURE__ */ r(at, { binding: w }) })
                },
                w
              )
            ))
          ] }, E)) }),
          /* @__PURE__ */ l("div", { className: "dq-key-picker-choices", children: [
            /* @__PURE__ */ l(
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
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: "dq-key-picker-choice",
                "data-choice": zn,
                tabIndex: 0,
                "aria-pressed": d === zn,
                onClick: () => i(zn),
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
const Gd = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function Kd(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function Bd(e, t) {
  if ($n(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if ($i(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function Qs(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function Vd(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function Jd({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: a,
  saving: i,
  expandedId: o,
  onExpand: s,
  reveal: c
}) {
  const d = _e(e), h = d !== "tag", u = e.actions, g = Tr(u), m = Rr(ve(() => $a(u), [u])), N = ve(
    () => h ? Xr(u).map((U) => U.name) : [],
    [h, u]
  ), y = h && e.stayUntilGroupsAnswered === !0, q = ve(
    () => new Set(
      y ? fd(u).map((U) => U.key) : []
    ),
    [y, u]
  ), [E, w] = C(""), [I, F] = C(!1), [G, K] = C(
    null
  ), _ = Nt(), Z = `${_}-from-tags`, te = $(null), ne = $(null), ie = $(null), D = $(null), B = $(/* @__PURE__ */ new WeakMap()), v = (U) => {
    let Ne = B.current.get(U);
    return Ne || (Ne = crypto.randomUUID(), B.current.set(U, Ne)), Ne;
  }, T = E.trim().toLocaleLowerCase(), J = T ? u.filter((U) => U.label.toLocaleLowerCase().includes(T)) : u, P = (U) => t({ ...e, actions: U }), Q = (U, Ne) => P(u.map((Ke, Se) => Se === U ? Ne : Ke));
  function z(U) {
    var Ne;
    return [...((Ne = ie.current) == null ? void 0 : Ne.querySelectorAll("[data-action-id]")) ?? []].find(
      (Ke) => Ke.dataset.actionId === U
    );
  }
  function j(U, Ne) {
    const Ke = z(U), Se = Ke == null ? void 0 : Ke.querySelector(
      Ne === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return Se == null || Se.focus(), !!Se;
  }
  Zt(() => {
    var Ne;
    const U = D.current;
    U && (D.current = null, (U === "add" || !j(U.id, U.part)) && ((Ne = ne.current) == null || Ne.focus()));
  }), H(() => {
    !c || !o || (J.some((U) => U.id === o) ? j(o, "label") : (w(""), D.current = { id: o, part: "label" }));
  }, [c]);
  function A() {
    const U = Vd(d);
    w(""), P([...u, U]), s(U.id), D.current = { id: U.id, part: "label" };
  }
  function Fe(U) {
    const Ne = u[U], { shortcut: Ke, ...Se } = structuredClone(Ne), Qe = {
      ...Se,
      ...Ke === zn ? { shortcut: Ke } : {},
      id: crypto.randomUUID(),
      label: `${Ne.label} copy`
    };
    P([...u.slice(0, U + 1), Qe, ...u.slice(U + 1)]), s(Qe.id), D.current = { id: Qe.id, part: "label" };
  }
  function we(U) {
    const Ne = u[U], Ke = J.indexOf(Ne), Se = J[Ke + 1] ?? J[Ke - 1];
    P(u.filter((Qe, Ee) => Ee !== U)), o === Ne.id && s(null), D.current = Se ? { id: Se.id, part: "toggle" } : "add";
  }
  function tt() {
    F(!1), requestAnimationFrame(() => {
      var U;
      return (U = te.current) == null ? void 0 : U.focus();
    });
  }
  return /* @__PURE__ */ l("div", { className: "dq-actions-editor", children: [
    /* @__PURE__ */ l("div", { className: "dq-actions-head", children: [
      /* @__PURE__ */ l("div", { className: "dq-actions-toolbar", children: [
        /* @__PURE__ */ l(
          "button",
          {
            ref: ne,
            type: "button",
            className: "dq-header-button",
            onClick: A,
            children: [
              /* @__PURE__ */ r(Si, { "aria-hidden": "true" }),
              "Add action"
            ]
          }
        ),
        h && /* @__PURE__ */ r(
          "button",
          {
            ref: te,
            type: "button",
            className: "dq-header-button",
            "aria-expanded": I,
            "aria-controls": I ? Z : void 0,
            onClick: () => {
              K(null), F(!I);
            },
            children: "Add from parent tags…"
          }
        ),
        /* @__PURE__ */ l("label", { className: "dq-actions-filter", children: [
          /* @__PURE__ */ r(zr, { "aria-hidden": "true" }),
          /* @__PURE__ */ r(
            "input",
            {
              type: "search",
              "aria-label": "Find an action",
              placeholder: "Find an action…",
              autoComplete: "off",
              spellCheck: !1,
              value: E,
              onChange: (U) => w(U.target.value),
              onKeyDown: (U) => {
                U.key === "Escape" && E && (U.preventDefault(), U.stopPropagation(), w(""));
              }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-actions-hint", children: "Choose a key on its key cap; Auto takes the next free key in this order. Drag a handle, or press Alt + ↑ / ↓, to reorder." }),
      h && /* @__PURE__ */ l("div", { className: "dq-actions-groups", children: [
        /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: y,
              "aria-describedby": `${_}-groups-note`,
              onChange: (U) => t({
                ...e,
                stayUntilGroupsAnswered: U.target.checked ? !0 : void 0
              })
            }
          ),
          "Stay until every group is answered"
        ] }),
        /* @__PURE__ */ r("p", { className: "dq-actions-hint", id: `${_}-groups-note`, children: y && !N.length ? "No action has a group yet: give the actions of each question the same group." : "Single-item view: a plain action moves on once every group has an answer." })
      ] }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-actions-status", children: (G == null ? void 0 : G.actions) === u ? `Added ${G.count} action${G.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    h && I && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here.
    /* @__PURE__ */ r(
      "div",
      {
        onKeyDown: (U) => {
          U.key !== "Escape" || U.defaultPrevented || (U.preventDefault(), U.stopPropagation(), tt());
        },
        children: /* @__PURE__ */ r(
          Dd,
          {
            id: Z,
            review: e,
            disabled: i,
            onAdd: (U) => {
              const Ne = [...u, ...U];
              P(Ne), K({ actions: Ne, count: U.length }), tt();
            },
            onCancel: tt
          }
        )
      }
    ),
    /* @__PURE__ */ r("div", { ref: ie, children: J.length > 0 && /* @__PURE__ */ r(
      Yo,
      {
        items: J,
        getKey: (U) => U.id,
        disabled: i || !!T,
        className: "dq-action-list",
        onReorder: (U) => P(U),
        renderItem: (U, { dragHandleProps: Ne, isOver: Ke }) => {
          const Se = u.indexOf(U), Qe = o === U.id;
          return /* @__PURE__ */ r(
            zd,
            {
              action: U,
              entityType: d,
              keyButton: /* @__PURE__ */ r(
                jd,
                {
                  actions: u,
                  index: Se,
                  keyMap: g,
                  name: U.label.trim() || "New action",
                  onChoose: (Ee) => P(Cl(u, Se, Ee))
                }
              ),
              takenPin: g.duplicatePins.has(Se) ? U.shortcut : void 0,
              groupUnanswerable: "steps" in U && q.has(dr(U.group)),
              effect: pr(U, m, n, a),
              open: Qe,
              detailId: `${_}-detail-${U.id}`,
              dragHandleProps: Ne,
              isOver: Ke,
              reorderDisabled: i || !!T,
              onToggle: () => s(Qe ? null : U.id),
              onDuplicate: () => Fe(Se),
              onDelete: () => we(Se),
              children: "steps" in U ? /* @__PURE__ */ r(
                Hd,
                {
                  action: U,
                  groupNames: N,
                  saving: i,
                  stepKey: v,
                  rememberStepKey: (Ee, Be) => B.current.set(Ee, v(Be)),
                  onChange: (Ee) => Q(Se, Ee)
                }
              ) : /* @__PURE__ */ r(
                Xd,
                {
                  action: U,
                  tagGroups: n,
                  onChange: (Ee) => Q(Se, Ee)
                }
              )
            }
          );
        }
      }
    ) }),
    u.length ? !J.length && /* @__PURE__ */ l("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      E.trim(),
      "”."
    ] }) : /* @__PURE__ */ r("p", { className: "dq-actions-empty", children: h ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function zd({
  action: e,
  entityType: t,
  keyButton: n,
  takenPin: a,
  groupUnanswerable: i = !1,
  effect: o,
  open: s,
  detailId: c,
  dragHandleProps: d,
  isOver: h,
  reorderDisabled: u,
  onToggle: g,
  onDuplicate: m,
  onDelete: N,
  children: y
}) {
  const q = e.label.trim() || "New action", E = Bd(e, t), w = "steps" in e && dr(e.group) ? e.group.trim() : "";
  return /* @__PURE__ */ l(
    "div",
    {
      className: `dq-action-row${s ? " dq-action-row-open" : ""}${h ? " dq-drag-over" : ""}`,
      "data-action-id": e.id,
      children: [
        /* @__PURE__ */ l("div", { className: "dq-action-row-head", children: [
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              ...d,
              style: Qs(d.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${q}`,
              title: u ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: u,
              children: /* @__PURE__ */ r(ns, { "aria-hidden": "true" })
            }
          ),
          n,
          /* @__PURE__ */ l("div", { className: "dq-action-row-summary", onClick: g, children: [
            /* @__PURE__ */ r("span", { className: "dq-action-row-label", title: q, children: q }),
            w && /* @__PURE__ */ l("span", { className: "dq-action-row-group", title: `Group: ${w}`, children: [
              /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Group: " }),
              w
            ] }),
            !s && /* @__PURE__ */ r("span", { className: "dq-action-row-effect", children: o.map((I, F) => /* @__PURE__ */ r("span", { "data-effect-tone": I.tone, children: I.text }, F)) }),
            E && /* @__PURE__ */ l("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ r(An, { "aria-hidden": "true" }),
              E
            ] }),
            a && /* @__PURE__ */ l(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${a.toLocaleUpperCase()} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ r(An, { "aria-hidden": "true" }),
                  `${a.toLocaleUpperCase()} is pinned twice`
                ]
              }
            ),
            i && /* @__PURE__ */ l(
              "span",
              {
                className: "dq-action-problem",
                title: "No action in this group adds a tag or marks one absent, so the group is never answered and items wait there until skipped.",
                children: [
                  /* @__PURE__ */ r(An, { "aria-hidden": "true" }),
                  `${w} can't be answered`
                ]
              }
            )
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Duplicate ${q}`,
              title: "Duplicate",
              onClick: m,
              children: /* @__PURE__ */ r(rs, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Delete ${q}`,
              title: "Delete",
              onClick: N,
              children: /* @__PURE__ */ r(as, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small dq-action-toggle",
              "aria-label": `${s ? "Collapse" : "Expand"} ${q}`,
              "aria-expanded": s,
              "aria-controls": s ? c : void 0,
              onClick: g,
              children: /* @__PURE__ */ r(is, { "aria-hidden": "true" })
            }
          )
        ] }),
        s && /* @__PURE__ */ r("div", { id: c, className: "dq-action-detail", children: y })
      ]
    }
  );
}
function Ws({
  action: e,
  onChange: t
}) {
  return /* @__PURE__ */ l("label", { className: "dq-action-field", children: [
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
function Qd(e) {
  const { group: t, ...n } = e;
  return n;
}
function Wd({
  action: e,
  groupNames: t,
  onChange: n
}) {
  const a = Nt(), i = dr(e.group), o = (s) => n(s ? { ...e, group: s } : Qd(e));
  return /* @__PURE__ */ l("label", { className: "dq-action-field", children: [
    /* @__PURE__ */ r("span", { className: "dq-action-field-name", children: "Group" }),
    /* @__PURE__ */ r(
      "input",
      {
        className: "dq-input dq-action-group-input",
        list: a,
        placeholder: "No group",
        autoComplete: "off",
        spellCheck: !1,
        value: e.group ?? "",
        onChange: (s) => o(s.target.value),
        onBlur: (s) => {
          const c = s.target.value.trim();
          c !== s.target.value && o(c);
        }
      }
    ),
    /* @__PURE__ */ r("datalist", { id: a, children: t.filter((s) => dr(s) !== i).map((s) => /* @__PURE__ */ r("option", { value: s }, s)) })
  ] });
}
function Hd({
  action: e,
  groupNames: t,
  saving: n,
  stepKey: a,
  rememberStepKey: i,
  onChange: o
}) {
  const s = Nt(), c = $(null), d = $(null);
  Zt(() => {
    var g, m;
    const u = d.current;
    u != null && (d.current = null, (m = (g = c.current) == null ? void 0 : g.querySelector(`[data-step-index="${u}"] input`)) == null || m.focus());
  });
  const h = (u) => o({ ...e, steps: u });
  return /* @__PURE__ */ l(ue, { children: [
    /* @__PURE__ */ r(Ws, { action: e, onChange: (u) => o({ ...e, label: u }) }),
    /* @__PURE__ */ r(Wd, { action: e, groupNames: t, onChange: o }),
    /* @__PURE__ */ l("div", { className: "dq-action-field dq-action-field-top", role: "group", "aria-labelledby": s, children: [
      /* @__PURE__ */ r("span", { className: "dq-action-field-name", id: s, children: "Steps" }),
      /* @__PURE__ */ l("div", { className: "dq-steps", ref: c, children: [
        e.steps.length > 0 ? /* @__PURE__ */ r(
          Yo,
          {
            items: e.steps,
            getKey: a,
            disabled: n,
            className: "dq-step-list",
            onReorder: h,
            renderItem: (u, { index: g, dragHandleProps: m, isOver: N }) => /* @__PURE__ */ r(
              Yd,
              {
                step: u,
                index: g,
                dragHandleProps: m,
                isOver: N,
                saving: n,
                onChange: (y) => {
                  i(y, u), h(e.steps.map((q, E) => E === g ? y : q));
                },
                onRemove: () => h(e.steps.filter((y, q) => q !== g))
              }
            )
          }
        ) : /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "No steps: the action skips the item." }),
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "dq-add-step",
            onClick: () => {
              d.current = e.steps.length, h([...e.steps, { mode: "ADD", tagIds: [] }]);
            },
            children: [
              /* @__PURE__ */ r(Si, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function Yd({
  step: e,
  index: t,
  dragHandleProps: n,
  isOver: a,
  saving: i,
  onChange: o,
  onRemove: s
}) {
  const c = t + 1;
  return /* @__PURE__ */ l(
    "div",
    {
      className: `dq-step${a ? " dq-drag-over" : ""}`,
      "data-step-tone": Kd(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            ...n,
            style: Qs(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${c}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: i,
            children: [
              /* @__PURE__ */ r(ns, { "aria-hidden": "true" }),
              /* @__PURE__ */ r("span", { "aria-hidden": "true", children: c })
            ]
          }
        ),
        /* @__PURE__ */ r(
          "select",
          {
            className: "dq-select dq-step-mode",
            "aria-label": `Step ${c} operation`,
            value: e.mode,
            onChange: (d) => o({ ...e, mode: d.target.value }),
            children: Gd.map(({ mode: d, label: h }) => /* @__PURE__ */ r("option", { value: d, children: h }, d))
          }
        ),
        /* @__PURE__ */ r(
          Rn,
          {
            entityType: "tag",
            values: e.tagIds,
            onChange: (d) => o({ ...e, tagIds: d }),
            placeholder: "Add tag…",
            inputAriaLabel: `Add a tag to step ${c}`,
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
            "aria-label": `Remove step ${c}`,
            title: "Remove step",
            onClick: s,
            children: /* @__PURE__ */ r(Qr, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function Xd({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const a = e.effect, i = a.mode === "SET_TAG_GROUP" ? `group:${a.tagGroupId}` : a.mode, o = a.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === a.tagGroupId);
  return /* @__PURE__ */ l(ue, { children: [
    /* @__PURE__ */ r(Ws, { action: e, onChange: (s) => n({ ...e, label: s }) }),
    /* @__PURE__ */ l("label", { className: "dq-action-field", children: [
      /* @__PURE__ */ r("span", { className: "dq-action-field-name", children: "Effect" }),
      /* @__PURE__ */ l(
        "select",
        {
          className: "dq-select",
          "aria-label": "Tag group action",
          value: i,
          onChange: (s) => {
            const c = s.target.value;
            n({
              ...e,
              effect: c === "SKIP" ? { mode: "SKIP" } : c === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : { mode: "SET_TAG_GROUP", tagGroupId: Number(c.slice(6)) }
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
function Zd({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, a = bn(Pe(e)).queue, i = (o) => t({ ...e, occurrence: { ...n, ...o } });
  return /* @__PURE__ */ l("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
    /* @__PURE__ */ l("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      a,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ r(
      Rn,
      {
        entityType: "tag",
        values: n.tagIds,
        onChange: (o) => i({ tagIds: o }),
        placeholder: "Search review tag choices...",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
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
function eu({
  review: e,
  onChange: t
}) {
  const n = bn(Pe(e)).many;
  return /* @__PURE__ */ l("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ r("legend", { children: "Performer flags" }),
    /* @__PURE__ */ l("p", { children: [
      "Flag performers whose profile has any of these tags in the performer list and batches, for example a tag noting that something changed during their career. Check a flagged performer’s earliest and latest ",
      n,
      " ",
      "before applying one batch to all of them."
    ] }),
    /* @__PURE__ */ r(
      Rn,
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
const Hs = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, Ys = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, tu = {
  video: Aa,
  audio: cs,
  tag: ss,
  performerOccurrence: os,
  audioPerformerOccurrence: fl
};
function Xs({ entityType: e }) {
  const t = tu[e];
  return /* @__PURE__ */ r(t, { role: "img", "aria-label": Hs[e] });
}
const nu = 2e6;
function Zs(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), a = document.createElement("a");
  a.href = n, a.download = t, a.click(), URL.revokeObjectURL(n);
}
function ru(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function Ki(e) {
  Zs([e], ru(e));
}
async function au(e) {
  if (e.size > nu) throw new Error("Review files must be smaller than 2 MB.");
  const t = await e.text();
  try {
    return Hr(t);
  } catch (n) {
    throw new Error(
      n instanceof SyntaxError ? "It is not a JSON file." : "It does not hold valid Data Quality reviews."
    );
  }
}
function Er(e) {
  const { page: t, ...n } = e.view.filter;
  return JSON.stringify(
    { ...e, view: { ...e.view, filter: n } },
    (a, i) => i && typeof i == "object" && !Array.isArray(i) ? Object.fromEntries(
      Object.keys(i).sort().map((o) => [o, i[o]])
    ) : i
  );
}
function ec({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: a,
  nameRef: i,
  autoFocus: o = !1
}) {
  return /* @__PURE__ */ l(ue, { children: [
    /* @__PURE__ */ l("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ r("span", { children: "Entity type" }),
      /* @__PURE__ */ r(
        "select",
        {
          className: "dq-select",
          "aria-label": "Entity type",
          value: _e(e),
          disabled: n,
          onChange: (s) => a == null ? void 0 : a(s.target.value),
          children: hs.map((s) => /* @__PURE__ */ r("option", { value: s, children: Ys[s] }, s))
        }
      )
    ] }),
    /* @__PURE__ */ l("label", { className: "dq-drawer-field", children: [
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
    /* @__PURE__ */ l("label", { className: "dq-drawer-field", children: [
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
function iu(e, t) {
  const n = _e(e), a = ["Review"];
  return (n === "video" || n === "tag") && a.push("Appearance"), a.push("Actions"), t && a.push("Tag choices"), a;
}
function ou({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = $(null), a = $(null), i = Nt(), o = Nt();
  return H(() => {
    var s;
    n.current && !n.current.open && n.current.showModal(), (s = a.current) == null || s.focus();
  }, []), /* @__PURE__ */ l(
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
        /* @__PURE__ */ l("div", { className: "dq-confirm-dialog-actions", children: [
          /* @__PURE__ */ r("button", { ref: a, type: "button", className: "dq-button", onClick: e, children: "Keep editing" }),
          /* @__PURE__ */ r("button", { type: "button", className: "dq-button dq-button-danger", onClick: t, children: "Discard" })
        ] })
      ]
    }
  );
}
function tc({
  draft: e,
  onChange: t,
  direction: n,
  onDirectionChange: a,
  tagGroups: i,
  trees: o,
  saving: s,
  saveDisabled: c = !1,
  error: d,
  dirty: h,
  criteriaChanged: u = !1,
  notices: g,
  onSave: m,
  onCancel: N,
  drawerRef: y
}) {
  const [q, E] = C("Review"), [w] = C(
    () => Te(e) && e.occurrence.tagIds.length > 0
  ), [I, F] = C(""), [G, K] = C(null), [_, Z] = C(0), [te, ne] = C(!1), ie = $(null), D = $(null), B = $(null), v = iu(e, w), T = _e(e), J = ve(() => Er(e), [e]);
  H(() => F(""), [J]), H(() => {
    var Fe, we;
    if (te) return;
    const j = ie.current;
    if (ie.current = null, !j) return;
    (we = j.isConnected && !!((Fe = B.current) != null && Fe.contains(j)) && !(j instanceof HTMLButtonElement && j.disabled) ? j : B.current) == null || we.focus({ preventScroll: !0 });
  }, [te]);
  function P() {
    if (!(s || te)) {
      if (!h) {
        N();
        return;
      }
      ie.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, ne(!0);
    }
  }
  function Q() {
    const j = { ...e, name: e.name.trim() }, A = Vr(j);
    if (!A) {
      F(""), m();
      return;
    }
    if (F(A), !j.name) {
      E("Review"), requestAnimationFrame(() => {
        var we;
        return (we = D.current) == null ? void 0 : we.focus();
      });
      return;
    }
    const Fe = e.actions.find(
      (we) => !$n(we, T)
    );
    Fe && (E("Actions"), K(Fe.id), Z((we) => we + 1));
  }
  const z = I || d;
  return /* @__PURE__ */ l(ue, { children: [
    /* @__PURE__ */ l(
      "aside",
      {
        ref: (j) => {
          B.current = j, y && (y.current = j);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (j) => {
          j.key !== "Escape" || j.defaultPrevented || s || (j.preventDefault(), j.stopPropagation(), P());
        },
        children: [
          /* @__PURE__ */ l("header", { className: "dq-drawer-header", children: [
            /* @__PURE__ */ l("div", { className: "dq-drawer-title", children: [
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
                onClick: P,
                children: /* @__PURE__ */ r(Qr, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ r(
            el,
            {
              tabs: v.map((j) => ({
                key: j,
                label: j,
                count: j === "Actions" ? e.actions.length : void 0
              })),
              activeTab: q,
              onTabChange: (j) => E(j)
            }
          ) }),
          /* @__PURE__ */ r("div", { className: "dq-drawer-body", children: /* @__PURE__ */ l("fieldset", { className: "dq-drawer-fields", disabled: s, children: [
            /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review settings" }),
            /* @__PURE__ */ l(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: q !== "Review",
                "aria-label": "Review",
                children: [
                  /* @__PURE__ */ r(
                    ec,
                    {
                      review: e,
                      onChange: t,
                      entityTypeLocked: !0,
                      nameRef: D,
                      autoFocus: !0
                    }
                  ),
                  /* @__PURE__ */ l("label", { className: "dq-drawer-field", children: [
                    /* @__PURE__ */ r("span", { children: "Review direction" }),
                    /* @__PURE__ */ l(
                      "select",
                      {
                        className: "dq-select",
                        "aria-label": "Review direction",
                        value: n,
                        onChange: (j) => a(j.target.value),
                        children: [
                          /* @__PURE__ */ r("option", { value: "end", children: "Start from the end" }),
                          /* @__PURE__ */ r("option", { value: "beginning", children: "Start from the beginning" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ r("small", { className: "dq-drawer-note", children: "From the end, the queue opens on its last page and works towards the first." })
                  ] }),
                  Te(e) && /* @__PURE__ */ r(eu, { review: e, onChange: t }),
                  /* @__PURE__ */ r("div", { children: /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => Ki(e),
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
                children: /* @__PURE__ */ r(su, { review: e, onChange: t })
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
                  Jd,
                  {
                    review: e,
                    onChange: t,
                    tagGroups: i,
                    trees: o,
                    saving: s,
                    expandedId: G,
                    onExpand: K,
                    reveal: _
                  }
                )
              }
            ),
            w && Te(e) && /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: q !== "Tag choices",
                "aria-label": "Tag choices",
                children: /* @__PURE__ */ r(Zd, { review: e, onChange: t })
              }
            )
          ] }) }),
          (z || g) && /* @__PURE__ */ l("div", { className: "dq-drawer-notices", children: [
            g,
            z && /* @__PURE__ */ l("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ r(An, { "aria-hidden": "true" }),
              z
            ] })
          ] }),
          /* @__PURE__ */ l("footer", { className: "dq-drawer-footer", children: [
            /* @__PURE__ */ r("p", { className: "dq-drawer-dirty", children: h ? u ? "Unsaved changes, including the queue's criteria" : "Unsaved changes" : "" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: s, onClick: P, children: "Cancel" }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-button primary",
                "aria-busy": s || void 0,
                "aria-disabled": s || void 0,
                disabled: !s && c,
                onClick: () => {
                  s || Q();
                },
                children: "Save review"
              }
            )
          ] })
        ]
      }
    ),
    te && /* @__PURE__ */ r(
      ou,
      {
        onKeepEditing: () => ne(!1),
        onDiscard: () => {
          ie.current = null, ne(!1), N();
        }
      }
    )
  ] });
}
function su({
  review: e,
  onChange: t
}) {
  const n = Nt(), a = e.view, i = (u) => t({ ...e, view: { ...a, ...u } }), o = /* @__PURE__ */ l("label", { className: "dq-checkbox dq-setting-indent", children: [
    /* @__PURE__ */ r(
      "input",
      {
        type: "checkbox",
        checked: a.selectAllOnLoad ?? !1,
        onChange: (u) => i({ selectAllOnLoad: u.target.checked ? !0 : void 0 })
      }
    ),
    "Select every card when a page opens"
  ] });
  if (_e(e) === "tag")
    return /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-cards`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-cards`, children: "Cards" }),
      /* @__PURE__ */ r(
        To,
        {
          label: "View",
          value: a.displayMode === "list" ? "list" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "list", label: "List" }
          ],
          onChange: (u) => i({ displayMode: u })
        }
      ),
      o,
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "The review opens with these. The Cards / List switch in the header changes only the current visit." })
    ] });
  const s = e.presentation ?? {}, c = (u) => t({ ...e, presentation: { ...s, ...u } }), d = s.annotations ?? [], h = a.reviewMode ?? "single";
  return /* @__PURE__ */ l(ue, { children: [
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ l("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ r(
          Ro,
          {
            name: `${n}-layout-choice`,
            checked: h === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ r(cu, {}),
            onChoose: () => i({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ r(
          Ro,
          {
            name: `${n}-layout-choice`,
            checked: h === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ r(lu, {}),
            onChoose: () => i({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ r(
        To,
        {
          label: "Cards",
          value: a.displayMode === "wall" ? "wall" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "wall", label: "Wall" }
          ],
          onChange: (u) => i({ displayMode: u })
        }
      ),
      o,
      /* @__PURE__ */ l("div", { className: "dq-setting-row", role: "group", "aria-labelledby": `${n}-details`, children: [
        /* @__PURE__ */ r("span", { className: "dq-setting-name", id: `${n}-details`, children: "Card details" }),
        /* @__PURE__ */ r("div", { className: "dq-setting-options", children: [
          ["date", "Date"],
          ["studio", "Studio"],
          ["performers", "Performers"],
          ["tags", "Tags"]
        ].map(([u, g]) => /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: d.includes(u),
              onChange: (m) => c({
                annotations: m.target.checked ? [...d, u] : d.filter((N) => N !== u)
              })
            }
          ),
          g
        ] }, u)) })
      ] }),
      d.includes("tags") && /* @__PURE__ */ l("div", { className: "dq-setting-row dq-setting-row-top", children: [
        /* @__PURE__ */ r("span", { className: "dq-setting-name", children: "Tags on cards" }),
        /* @__PURE__ */ l("div", { className: "dq-setting-value", children: [
          /* @__PURE__ */ r(
            Rn,
            {
              entityType: "tag",
              values: s.annotationParents ?? [],
              onChange: (u) => c({ annotationParents: u }),
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
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-bins`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-bins`, children: "Queue tag bins" }),
      /* @__PURE__ */ r(
        Rn,
        {
          entityType: "tag",
          values: s.binParents ?? [],
          onChange: (u) => c({ binParents: u }),
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
function To({
  label: e,
  value: t,
  options: n,
  onChange: a
}) {
  const i = Nt();
  return /* @__PURE__ */ l("div", { className: "dq-setting-row", children: [
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
function Ro({
  name: e,
  checked: t,
  title: n,
  text: a,
  picture: i,
  onChoose: o
}) {
  const s = Nt(), c = Nt();
  return /* @__PURE__ */ l("label", { className: "dq-layout-card", children: [
    i,
    /* @__PURE__ */ l("span", { className: "dq-layout-card-name", children: [
      /* @__PURE__ */ r(
        "input",
        {
          type: "radio",
          name: e,
          checked: t,
          "aria-labelledby": s,
          "aria-describedby": c,
          onChange: o
        }
      ),
      /* @__PURE__ */ r("span", { id: s, children: n })
    ] }),
    /* @__PURE__ */ r("span", { className: "dq-layout-card-text", id: c, children: a })
  ] });
}
function cu() {
  return /* @__PURE__ */ l("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ r("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function lu() {
  const e = /* @__PURE__ */ new Set(["80,8", "152,8", "8,44", "224,44"]);
  return /* @__PURE__ */ l("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
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
function nc({
  name: e,
  description: t,
  entityType: n,
  onBack: a,
  backDisabled: i,
  onEdit: o,
  editDisabled: s,
  editing: c = !1,
  toolbar: d,
  trailing: h,
  chipsStart: u,
  chipsAfter: g,
  chipsEnd: m
}) {
  return /* @__PURE__ */ l("header", { className: "dq-review-header", children: [
    /* @__PURE__ */ l("div", { className: "dq-review-header-lead", children: [
      a && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: i,
          onClick: a,
          children: /* @__PURE__ */ r(Wr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-type", title: Hs[n], children: /* @__PURE__ */ r(Xs, { entityType: n }) }),
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
          "aria-expanded": c,
          disabled: s,
          onClick: o,
          children: /* @__PURE__ */ r(kr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    d,
    /* @__PURE__ */ r("div", { className: "dq-review-header-trail", children: h }),
    /* @__PURE__ */ r("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    u,
    g && /* @__PURE__ */ r("div", { className: "dq-review-chips-after", children: g }),
    m && /* @__PURE__ */ r("div", { className: "dq-review-chips-end", children: m })
  ] });
}
function rc({
  page: e,
  pages: t,
  onPage: n
}) {
  const [a, i] = C(!1), [o, s] = C(""), c = $(null), d = $(null);
  H(() => {
    var g;
    a && ((g = c.current) == null || g.select());
  }, [a]);
  const h = (g) => {
    i(!1), g && requestAnimationFrame(() => {
      var m;
      return (m = d.current) == null ? void 0 : m.focus();
    });
  }, u = () => {
    const g = Math.round(Number(o));
    h(!0), Number.isFinite(g) && g >= 1 && g !== e && n(Math.min(t, g));
  };
  return /* @__PURE__ */ l("span", { className: "dq-pager", children: [
    /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-icon-button",
        "aria-label": "Previous page",
        title: "Previous page",
        disabled: e <= 1,
        onClick: () => n(e - 1),
        children: /* @__PURE__ */ r(Wr, { "aria-hidden": "true" })
      }
    ),
    a ? /* @__PURE__ */ r(
      "input",
      {
        ref: c,
        type: "number",
        className: "dq-pager-input",
        "aria-label": `Go to page, 1 to ${t}`,
        min: 1,
        max: t,
        value: o,
        onChange: (g) => s(g.target.value),
        onKeyDown: (g) => {
          g.key === "Enter" ? (g.preventDefault(), u()) : g.key === "Escape" && (g.preventDefault(), g.stopPropagation(), h(!0));
        },
        onBlur: () => h(!1)
      }
    ) : /* @__PURE__ */ l(
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
        children: /* @__PURE__ */ r(ls, { "aria-hidden": "true" })
      }
    )
  ] });
}
function ac({
  mode: e,
  disabled: t,
  onChange: n
}) {
  return /* @__PURE__ */ l("div", { className: "dq-segmented", role: "group", "aria-label": "Review layout", children: [
    /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        "aria-pressed": e === "single",
        disabled: t,
        onClick: () => e !== "single" && n("single"),
        children: [
          /* @__PURE__ */ r(pl, { "aria-hidden": "true" }),
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
        onClick: () => e !== "multiple" && n("multiple"),
        children: [
          /* @__PURE__ */ r(Ei, { "aria-hidden": "true" }),
          "Grid"
        ]
      }
    )
  ] });
}
function du({
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
function Bi({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [a, i] = C(!1), [o, s] = C(!1), c = $(null), d = $(null), h = Nt();
  Zt(() => {
    if (!a || !d.current || !c.current) return;
    const m = c.current.getBoundingClientRect(), N = d.current.offsetHeight + 12, y = window.innerHeight - m.bottom;
    s(y < N && m.top > y);
  }, [a]), H(() => {
    var m, N;
    a && ((N = (m = d.current) == null ? void 0 : m.querySelector('[role="menuitem"]:not(:disabled)')) == null || N.focus({ preventScroll: !0 }));
  }, [a]), H(() => {
    t && i(!1);
  }, [t]);
  const u = (m = !0) => {
    var N;
    i(!1), m && ((N = c.current) == null || N.focus());
  };
  return /* @__PURE__ */ l("div", { className: `dq-menu${a ? " dq-menu-open" : ""}`, onKeyDown: (m) => {
    var q, E;
    if (!a) return;
    const N = [
      ...((q = d.current) == null ? void 0 : q.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], y = N.indexOf(document.activeElement);
    if (m.key === "Escape")
      m.preventDefault(), m.stopPropagation(), u();
    else if (m.key === "Tab")
      u(!1);
    else if (m.key === "ArrowDown" || m.key === "ArrowUp") {
      if (m.preventDefault(), !N.length) return;
      const w = m.key === "ArrowDown" ? 1 : -1;
      N[(y + w + N.length) % N.length].focus();
    } else (m.key === "Home" || m.key === "End") && (m.preventDefault(), (E = N.at(m.key === "Home" ? 0 : -1)) == null || E.focus());
  }, children: [
    /* @__PURE__ */ r(
      "button",
      {
        ref: c,
        type: "button",
        className: "dq-icon-button",
        "aria-label": n,
        title: n,
        "aria-haspopup": "menu",
        "aria-expanded": a,
        "aria-controls": a ? h : void 0,
        disabled: t,
        onClick: () => i((m) => !m),
        children: /* @__PURE__ */ r(hl, { "aria-hidden": "true" })
      }
    ),
    a && /* @__PURE__ */ l(ue, { children: [
      /* @__PURE__ */ r("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => u(!1) }),
      /* @__PURE__ */ r(
        "div",
        {
          ref: d,
          id: h,
          role: "menu",
          "aria-label": n,
          className: `dq-menu-list${o ? " dq-menu-list-up" : ""}`,
          children: e.map((m) => /* @__PURE__ */ l(yi, { children: [
            m.separated && /* @__PURE__ */ r("div", { role: "separator", className: "dq-menu-separator" }),
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                role: "menuitem",
                className: m.danger ? "dq-menu-danger" : void 0,
                disabled: m.disabled,
                onClick: () => {
                  u(), m.onSelect();
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
function Ea(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Vi(e) {
  return String(e.type).toLowerCase() === "tag";
}
function Ji(e) {
  return !!String(e ?? "").trim();
}
function zi(e) {
  return [
    ...new Set(
      Ea(e.customFieldCriteria).filter(Vi).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !Ji(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function Qi(e, t) {
  const n = Ea(e.customFieldCriteria);
  if (!n.length) return e;
  let a = !1;
  const i = n.map((o) => {
    if (!Vi(o)) return o;
    const s = { ...o };
    for (const [c, d] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const h = t[String(o[c] ?? "")];
      h && !Ji(o[d]) && (s[d] = h, a = !0);
    }
    return s;
  });
  return a ? { ...e, customFieldCriteria: i } : e;
}
function ic(e, t, n) {
  const a = Ea(e.customFieldCriteria);
  if (!a.length) return e;
  const i = Ea(n.customFieldCriteria), o = (d, h) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (u) => (d[u] ?? void 0) === (h[u] ?? void 0)
  );
  let s = !1;
  const c = a.map((d) => {
    if (!Vi(d)) return d;
    const h = i.find((g) => o(g, d));
    if (!h) return d;
    const u = { ...d };
    for (const [g, m] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const N = t[String(d[g] ?? "")];
      N && d[m] === N && !Ji(h[m]) && (delete u[m], s = !0);
    }
    return u;
  });
  return s ? { ...e, customFieldCriteria: c } : e;
}
async function uu(e, t, n) {
  if (!$n(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const a = Pe(e), i = n.steps.some((c) => Tn(c.mode)) ? await od(a) : "", o = await Fi(n);
  let s = t.applications;
  for (const c of [
    ...o.filter((d) => !Tn(d.mode)),
    ...o.filter((d) => Tn(d.mode))
  ]) {
    const d = (h) => sd(
      i,
      a,
      t.media.id,
      t.performer.id,
      c.tagIds,
      h
    );
    (c.mode === "MARK_PRESENT" || c.mode === "CLEAR_ABSENCE") && await d("REMOVE"), c.mode !== "CLEAR_ABSENCE" && (s = await lc(
      {
        ...e,
        occurrence: {
          ...e.occurrence,
          tagIds: c.tagIds,
          multiple: !0
        }
      },
      t,
      ["ADD", "MARK_PRESENT"].includes(c.mode) ? c.tagIds : []
    )), c.mode === "MARK_ABSENT" && await d("ADD");
  }
  return s;
}
async function Wi(e, t) {
  const n = e.occurrence;
  if (Ai(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const a = /* @__PURE__ */ new Set(), { _filterExpression: i, ...o } = n.performerFilter;
  for (let s = 1; ; s++) {
    const c = await le("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        In({
          findFilter: { page: s, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: o,
          filterExpression: i
        })
      )
    });
    if (c.items.forEach((d) => a.add(d.id)), s * 1e3 >= c.totalCount) return [...a];
    if (!c.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function oc(e) {
  return Kr(e.condition) && e.hideConfirmedAbsent !== !1;
}
function Hi(e, t) {
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
  }, s = oc(i) && (t == null ? void 0 : t.length) === 1 && i.conditionTagIds.length === 1 ? `${t[0]}:${i.conditionTagIds[0]}` : null;
  return {
    ...e,
    entityType: Pe(e),
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
                      key: Ta,
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
async function Yi(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => Ra([n], t))
  );
}
function sc(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function fu(e, t, n = e.conditionTagIds.map((a) => [a])) {
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
function pu(e, t, n, a, i) {
  if (!oc(e)) return !1;
  const o = As(t, n);
  return e.conditionTagIds.every(
    (s, c) => o.includes(s) || i[c].some((d) => a.includes(d))
  );
}
async function cc(e, t, n, a) {
  if ((t == null ? void 0 : t.length) === 0 || sc(e.occurrence))
    return { items: [], totalCount: 0 };
  const i = Pe(e), o = await jr(
    Hi(e, t),
    { ...e.view.filter, page: n },
    a
  ), s = t === null ? null : new Set(t), c = e.occurrence, d = o.items.length ? await Yi(c, a) : [], h = new Array(o.items.length);
  let u = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, o.items.length) }, async () => {
      for (; u < o.items.length; ) {
        const g = u++, m = o.items[g], N = await le(
          `/api/tagapplications?hostType=${i}&hostId=${m.id}&contextType=performer`,
          { signal: a }
        );
        h[g] = m.performers.filter((y) => s === null || s.has(y.id)).flatMap((y) => {
          const q = N.filter(
            (w) => w.hostType === i && w.hostId === m.id && w.contextType === "performer" && w.contextId === y.id
          ), E = q.map((w) => w.tag.id);
          return fu(e.occurrence, E, d) && !pu(c, m, y.id, E, d) ? [
            {
              key: `${m.id}:${y.id}`,
              media: m,
              performer: y,
              applications: q
            }
          ] : [];
        });
      }
    })
  ), { items: h.flat(), totalCount: o.totalCount };
}
async function lc(e, t, n) {
  const a = new Set(e.occurrence.tagIds);
  if (n.some((h) => !a.has(h)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const i = Pe(e), o = await ai(i, t.media.id);
  if (!o.performers.some(
    (h) => h.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${i}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${i}&hostId=${o.id}&contextType=performer&contextId=${t.performer.id}`, c = (await le(s)).filter(
    (h) => h.hostType === i && h.hostId === o.id && h.contextType === "performer" && h.contextId === t.performer.id
  ), d = new Set(n);
  try {
    for (const h of d)
      c.some((u) => u.tag.id === h) || await le("/api/tagapplications", {
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
    for (const h of c)
      a.has(h.tag.id) && !d.has(h.tag.id) && await le(`/api/tagapplications/${h.id}`, {
        method: "DELETE"
      });
    return await le(s);
  } catch (h) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${h instanceof Error ? h.message : "Request failed."}`
    );
  }
}
function Cr(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function hu(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function ln(e, t, n = !0) {
  var c;
  if (t.occurrence) {
    const d = n ? As(
      await ai(e, t.media.id),
      t.occurrence.performer.id
    ) : [], h = (await le(hu(e, t))).filter(
      (u) => u.hostType === e && u.hostId === t.media.id && u.contextType === "performer" && u.contextId === t.occurrence.performer.id
    );
    return di(h.map((u) => u.tag)), {
      ids: [...new Set(h.map((u) => u.tag.id))],
      names: [...new Set(h.map((u) => u.tag.name))],
      absent: d,
      applications: h
    };
  }
  const a = await ai(e, t.media.id), i = (a.tags ?? []).filter(
    (d) => d.canRemove !== !1 || d.isDerived !== !0
  );
  di(i);
  const o = Object.keys(a.customFields ?? {}).find(
    (d) => d.toLowerCase() === Na
  ) ?? Na, s = ((c = a.customFields) == null ? void 0 : c[o]) ?? [];
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
async function Xi(e, t, n) {
  if (t.occurrence && Te(e))
    await lc(
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
      i.length && await le(
        `/api/${Wn(Pe(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: a, tagIds: i })
        }
      );
}
async function mu(e, t, n) {
  t.occurrence && Te(e) ? await uu(e, t.occurrence, n) : await Ts(Pe(e), n, [t.media.id]);
}
function ui(e, t, n, a) {
  const i = (o) => o.filter((s) => a.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: Cr(i(t.ids), i(n.ids)),
    absence: Cr(i(t.absent), i(n.absent))
  };
}
function gu(e, t) {
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
class dc extends Error {
}
const fi = (e) => e instanceof Error ? e.message : "Request failed.", $o = (e) => [...e].sort((t, n) => t - n), Jr = (e, t) => JSON.stringify($o(e)) === JSON.stringify($o(t)), pi = (e) => !!(e.tags.added.length || e.tags.removed.length);
function ka(e, t, n, a) {
  const i = new Set(e), o = new Set(e);
  for (const u of t.steps)
    for (const g of u.tagIds)
      u.mode === "ADD" ? o.add(g) : o.delete(g);
  const s = e.some((u) => !o.has(u));
  if (s && !a)
    return { desired: [...e], conflict: s, skipped: !0, kept: [], replaced: [] };
  const c = new Set(
    t.steps.filter((u) => u.mode === "ADD").flatMap((u) => u.tagIds)
  ), d = [], h = [];
  for (const u of n) {
    const g = u.filter((N) => o.has(N) && !i.has(N)), m = u.filter(
      (N) => o.has(N) && i.has(N) && !c.has(N)
    );
    !g.length || !m.length || (a ? (m.forEach((N) => o.delete(N)), h.push(...m)) : (g.forEach((N) => o.delete(N)), d.push({ tagIds: g, existing: m })));
  }
  return { desired: [...o], conflict: s, skipped: !1, kept: d, replaced: h };
}
function bu(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function wu(e, t, n, a) {
  for (const [i, o] of n.entries()) {
    const s = t.filter(
      (h) => h.steps.some(
        (u) => u.mode === "ADD" && u.tagIds.some((g) => o.includes(g))
      )
    );
    if (s.length < 2) continue;
    const c = e.occurrence.conditionTagIds[i];
    let d = `tag ${c}`;
    try {
      d = (await le(`/api/tags/${c}`, { signal: a })).name;
    } catch {
      a.throwIfAborted();
    }
    throw new dc(
      `${s.map((h) => h.label).join(" and ")} answer the same condition tag, ${d}. Choose one of them.`
    );
  }
}
async function yu(e, t, n, a = () => {
}) {
  if (!t.length || t.some(
    (m) => !$n(m, e.entityType) || !m.steps.length || m.steps.some(
      (N) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(N.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), o = structuredClone(t), s = Kr(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await Yi(i.occurrence, n) : [];
  await wu(i, o, s, n);
  const c = await Promise.all(
    o.map(async (m) => ({
      ...m,
      steps: await Fi(m, n)
    }))
  ), d = structuredClone(bu(c));
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
  const u = await Wi(i, n), g = /* @__PURE__ */ new Map();
  for (let m = 1; ; m++) {
    n.throwIfAborted();
    const N = await cc(i, u, m, n);
    for (const y of N.items) {
      const q = {
        ids: [...new Set(y.applications.map((w) => w.tag.id))],
        names: y.applications.map((w) => w.tag.name),
        absent: [],
        applications: y.applications
      }, E = ka(q.ids, d, s, !0);
      g.set(y.key, {
        item: { key: y.key, media: y.media, occurrence: y },
        before: q,
        expected: q,
        conflict: E.conflict,
        status: Jr(q.ids, E.desired) ? "unchanged" : "pending"
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
    touched: h,
    entries: [...g.values()]
  };
}
function vu(e, t, n) {
  const a = (o) => o.ids.filter((s) => n.includes(s));
  if (!Jr(a(e), a(t))) return !1;
  const i = (o) => (o.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return Jr(i(e), i(t));
}
async function uc(e, t, n, a) {
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
function fc(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function pc(e) {
  return e.entries.filter((t) => t.operation);
}
async function Nu(e, t, n, a, i = !1) {
  await uc(
    fc(e, i),
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
        if (s = await ln(Pe(e.review), o.item, !1), !vu(o.expected, s, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (m) {
        o.status = "failed", o.error = fi(m);
        return;
      }
      const c = ka(
        o.before.ids,
        e.action,
        e.categories,
        t
      ), d = [
        ...s.ids.filter((m) => !e.touched.includes(m)),
        ...c.desired.filter((m) => e.touched.includes(m))
      ], h = Cr(s.ids, d);
      if (!h.added.length && !h.removed.length) {
        const m = !o.operation && c.kept.length > 0;
        o.status = o.operation ? "changed" : m ? "skipped" : "unchanged", o.error = m ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let u;
      try {
        await Xi(e.review, o.item, h);
      } catch (m) {
        u = m;
      }
      let g = !1;
      try {
        const m = await ln(Pe(e.review), o.item, !1);
        g = !0, o.expected = m;
        const N = ui(
          o.item,
          o.before,
          m,
          e.touched
        );
        if (o.operation = pi(N) ? N : void 0, u) throw u;
        if (!Jr(
          m.ids.filter((y) => e.touched.includes(y)),
          d.filter((y) => e.touched.includes(y))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (m) {
        if (o.status = "failed", o.error = fi(m), !g)
          try {
            const N = await ln(Pe(e.review), o.item, !1);
            o.expected = N;
            const y = ui(
              o.item,
              o.before,
              N,
              e.touched
            );
            o.operation = pi(y) ? y : void 0;
          } catch {
            o.unverified = !0;
          }
      }
    },
    a
  );
}
async function qu(e, t, n) {
  await uc(
    pc(e),
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
        const c = await ln(Pe(e.review), a.item, !1);
        gu(i, c), s = !0, await Xi(e.review, a.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const d = await ln(Pe(e.review), a.item, !1);
        if (!Jr(
          d.ids.filter((h) => o.includes(h)),
          a.before.ids.filter((h) => o.includes(h))
        ))
          throw new Error("Undo did not restore all affected tags.");
        a.operation = void 0, a.expected = d, a.status = "unchanged", a.error = void 0;
      } catch (c) {
        if (a.error = `Undo stopped: ${fi(c)}`, a.status = "failed", s)
          try {
            const d = await ln(Pe(e.review), a.item, !1), h = ui(
              a.item,
              a.before,
              d,
              o
            );
            a.operation = pi(h) ? h : void 0, a.expected = d;
          } catch {
            a.unverified = !0;
          }
      }
    },
    n
  );
}
async function Su(e, t, n) {
  const a = Pe(e), i = e.occurrence, [o, s] = await Promise.all([
    le(
      `/api/tagapplications?hostType=${a}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    Yi(i, n)
  ]), c = o.filter(
    (y) => y.hostType === a && y.contextType === "performer" && y.contextId === t
  );
  di(c.map((y) => y.tag));
  const d = await Promise.all(
    s.map(async (y, q) => {
      const E = i.conditionTagIds[q];
      return (await le(`/api/tags/${E}`, { signal: n })).name;
    })
  ), h = new Set(s.flat()), u = new Set(
    [
      ...e.actions.flatMap((y) => y.steps).filter((y) => y.mode === "ADD" || y.mode === "MARK_PRESENT").flatMap((y) => y.tagIds),
      ...i.tagIds
    ].filter((y) => !h.has(y))
  ), g = (y) => {
    const q = /* @__PURE__ */ new Map();
    for (const E of c) {
      if (!y.has(E.tag.id)) continue;
      const w = q.get(E.tag.id) ?? {
        tag: E.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      w.hosts.add(E.hostId), q.set(E.tag.id, w);
    }
    return [...q.values()].map((E) => ({ ...E.tag, count: E.hosts.size })).sort((E, w) => w.count - E.count || Rs(E, w));
  }, m = s.map((y, q) => ({
    id: i.conditionTagIds[q],
    name: d[q],
    tags: g(new Set(y))
  }));
  u.size && m.push({
    id: null,
    name: s.length ? "Other review tags" : "Review tags",
    tags: g(u)
  });
  const N = /* @__PURE__ */ new Set([...h, ...u]);
  return {
    answered: new Set(
      c.filter((y) => N.has(y.tag.id)).map((y) => y.hostId)
    ).size,
    groups: m
  };
}
const hc = Yc(!1);
function Eu({ children: e }) {
  return /* @__PURE__ */ r(hc.Provider, { value: !0, children: e });
}
function Xt({ tag: e, name: t }) {
  const n = Xc(hc), a = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ r(tl, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: a ?? void 0 });
}
const Io = { summary: null, error: "" };
function mc(e, t, n = 0) {
  const [a, i] = C(Io), o = e.occurrence, s = JSON.stringify([
    e.entityType,
    t,
    o.condition,
    o.conditionTagIds,
    o.includeSubtags,
    o.tagIds,
    e.actions.map((c) => c.steps)
  ]);
  return H(() => {
    if (i(Io), t === null) return;
    const c = new AbortController();
    return Su(e, t, c.signal).then((d) => {
      c.signal.aborted || i({ summary: d, error: "" });
    }).catch((d) => {
      c.signal.aborted || i({
        summary: null,
        error: d instanceof Error ? d.message : "Request failed."
      });
    }), () => c.abort();
  }, [s, n]), a;
}
function ku({
  review: e,
  performerId: t,
  revision: n = 0
}) {
  const a = mc(e, t, n);
  return /* @__PURE__ */ r(hi, { ...a, mediaKind: Pe(e) });
}
function hi({
  summary: e,
  error: t,
  mediaKind: n,
  className: a = ""
}) {
  const i = bn(n), o = (s) => `${s.toLocaleString()} ${s === 1 ? i.one : i.many}`;
  return /* @__PURE__ */ l(
    "section",
    {
      className: `dq-panel-section dq-performer-answers ${a}`.trim(),
      "aria-label": "Existing answers",
      children: [
        /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Existing answers" }),
          e && /* @__PURE__ */ r("span", { children: e.answered ? `${o(e.answered)} answered` : "none answered yet" })
        ] }),
        t ? /* @__PURE__ */ l("p", { role: "alert", children: [
          "Could not load existing answers. ",
          t
        ] }) : e ? e.groups.filter((s) => s.id !== null || s.tags.length).map((s) => /* @__PURE__ */ l("div", { className: "dq-answer-group", children: [
          /* @__PURE__ */ l("div", { className: "dq-answer-category", children: [
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
          s.tags.length ? /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": s.name, children: s.tags.map((c) => /* @__PURE__ */ l("li", { className: "dq-tag", children: [
            /* @__PURE__ */ r(Xt, { tag: c }),
            /* @__PURE__ */ r("span", { className: "dq-chip-count", "aria-hidden": "true", children: c.count.toLocaleString() }),
            /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
              ", ",
              o(c.count)
            ] })
          ] }, c.id)) }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" })
        ] }, s.id ?? "other")) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading existing answers…" })
      ]
    }
  );
}
function Sr({
  performer: e
}) {
  return /* @__PURE__ */ l("span", { className: "dq-performer-avatar", "aria-hidden": "true", children: [
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
const Oo = 5;
function Cu(e, t) {
  return Promise.all(
    e.map(async (n) => {
      try {
        return (await le(`/api/performers/${n}`, { signal: t })).name;
      } catch {
        return t.throwIfAborted(), `Performer ${n}`;
      }
    })
  );
}
function Au(e, t) {
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
const Mo = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), mi = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], Fo = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], Tu = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, Qa = 250;
function _r(e, t) {
  var a, i;
  const n = e.item.media;
  return n.title || ((i = (a = n.files) == null ? void 0 : a[0]) == null ? void 0 : i.basename) || (t === "audio" ? "Audio" : "Scene");
}
function Ru({ step: e }) {
  const t = mi.findIndex((n) => n.id === e);
  return /* @__PURE__ */ r("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: mi.map((n, a) => {
    const i = a < t ? "done" : a === t ? "current" : "next";
    return /* @__PURE__ */ l("li", { "data-state": i, "aria-current": i === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: i === "done" ? /* @__PURE__ */ r(Ca, {}) : a + 1 }),
      n.label,
      i === "done" && /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function Po({ parts: e, id: t }) {
  return /* @__PURE__ */ r("span", { className: "dq-batch-effect", id: t, children: e.map((n, a) => /* @__PURE__ */ l(yi, { children: [
    a > 0 && " ",
    /* @__PURE__ */ r("span", { "data-effect-tone": n.tone, children: n.text })
  ] }, a)) });
}
function Dr({
  value: e,
  label: t,
  detail: n,
  tone: a,
  pressed: i,
  onToggle: o
}) {
  return /* @__PURE__ */ l(
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
        n && /* @__PURE__ */ l(ue, { children: [
          " ",
          /* @__PURE__ */ r("span", { className: "dq-batch-stat-detail", children: n })
        ] })
      ]
    }
  );
}
function xo({
  added: e,
  removed: t,
  tag: n,
  label: a
}) {
  return /* @__PURE__ */ l("ul", { className: "dq-tags", "aria-label": a, children: [
    cr(e.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ l("ins", { children: [
      "+ ",
      /* @__PURE__ */ r(Xt, { tag: i })
    ] }) }, `added-${i.id}`)),
    cr(t.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ l("del", { children: [
      "− ",
      /* @__PURE__ */ r(Xt, { tag: i })
    ] }) }, `removed-${i.id}`))
  ] });
}
function Lo({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: a,
  describe: i
}) {
  return /* @__PURE__ */ l("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: e }),
      t.length > Qa && /* @__PURE__ */ l("span", { children: [
        "First ",
        Qa.toLocaleString(),
        " of ",
        t.length.toLocaleString()
      ] })
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-batch-list-scroll", children: /* @__PURE__ */ l("table", { children: [
      /* @__PURE__ */ r("thead", { children: /* @__PURE__ */ l("tr", { children: [
        /* @__PURE__ */ r("th", { scope: "col", children: "Occurrence" }),
        /* @__PURE__ */ r("th", { scope: "col", children: "Date" }),
        /* @__PURE__ */ r("th", { scope: "col", children: a })
      ] }) }),
      /* @__PURE__ */ r("tbody", { children: t.slice(0, Qa).map((o) => {
        var s;
        return /* @__PURE__ */ l("tr", { children: [
          /* @__PURE__ */ r("td", { children: /* @__PURE__ */ l(
            "a",
            {
              href: `/${n}/${o.item.media.id}`,
              target: "_blank",
              rel: "noreferrer",
              children: [
                (s = o.item.occurrence) == null ? void 0 : s.performer.name,
                " — ",
                _r(o, n)
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
function $u(e) {
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
      const s = `${o.status}\0${o.error}`, c = n.get(s) ?? { status: o.status, error: o.error, count: 0 };
      c.count += 1, n.set(s, c);
    }
  return { counts: t, reasons: [...n.values()], recorded: a, retryable: i };
}
function Iu({
  review: e,
  disabled: t,
  performerFlags: n = [],
  trees: a,
  onOpen: i,
  onClose: o,
  onWrite: s
}) {
  const [c, d] = C(!1), [h, u] = C("answers"), [g, m] = C(null), [N, y] = C({}), [q, E] = C([]), [w, I] = C(!1), [F, G] = C(!1), [K, _] = C(""), [Z, te] = C(!1), [ne, ie] = C(""), [D, B] = C(null), [v, T] = C(null), [J, P] = C([]), [Q, z] = C(0), j = $(null), A = $(null), Fe = $(null), we = $(!1), tt = $(!1), U = $(null), Ne = $(!1), Ke = $(0), Se = $(!1), Qe = $({ onClose: o, onWrite: s });
  Qe.current = { onClose: o, onWrite: s };
  const Ee = Nt(), Be = h === "run", en = (D == null ? void 0 : D.kind) === "undo", Re = Be && g ? g.review : e, wn = Tr(Re.actions), de = Re.occurrence, Ve = Pe(Re), qt = bn(Ve), dn = qt.queue, Oe = Be && g ? g.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((k) => k.steps.length && !Qn(k))
  ), it = Oe.filter((k) => q.includes(k.id)), ke = de.targetMode === "selected" && de.performerIds.length === 1, ot = mc(
    Re,
    c && ke ? de.performerIds[0] : null,
    Q
  ), Dt = zi(Re.view.objectFilter), $e = ji(
    c ? [...$a(Oe), ...de.conditionTagIds, ...Dt] : []
  ), yn = ve(() => _s($e), [$e]), st = (k) => N[k] ?? $e[k] ?? { id: k, name: `Tag ${k}` }, It = JSON.stringify(
    Object.fromEntries(
      Dt.flatMap((k) => {
        var ae;
        const M = (ae = $e[k]) == null ? void 0 : ae.name;
        return M ? [[String(k), M]] : [];
      })
    )
  ), dt = ve(
    () => Qi(Re.view.objectFilter, JSON.parse(It)),
    [Re.view.objectFilter, It]
  );
  H(() => {
    var k, M, ae;
    c && ((k = j.current) == null || k.showModal(), (ae = (M = j.current) == null ? void 0 : M.querySelector(".dq-batch-answer input")) == null || ae.focus());
  }, [c]), H(() => {
    if (!c) return;
    const k = requestAnimationFrame(() => {
      var Ce;
      const M = j.current, ae = document.activeElement;
      if (!M || ae && ae !== document.body && M.contains(ae)) return;
      (Ce = (h === "answers" ? M.querySelector(".dq-batch-answer input:checked") ?? M.querySelector(".dq-batch-answer input") : M.querySelector("[data-batch-focus]")) ?? A.current) == null || Ce.focus();
    });
    return () => cancelAnimationFrame(k);
  }, [c, h, F, g]), H(() => {
    if (c || t || !we.current) return;
    const k = requestAnimationFrame(() => {
      const M = Fe.current;
      if (!we.current || !M || M.disabled) return;
      we.current = !1;
      const ae = document.activeElement;
      (!ae || ae === document.body) && M.focus();
    });
    return () => cancelAnimationFrame(k);
  }, [c, t]), H(() => {
    if (!c || de.targetMode !== "selected") return;
    const k = new AbortController();
    return P([]), Cu(de.performerIds.slice(0, Oo), k.signal).then((M) => {
      k.signal.aborted || P(M);
    }).catch(() => {
    }), () => k.abort();
  }, [c, de.targetMode, JSON.stringify(de.performerIds)]), H(
    () => () => {
      var k;
      tt.current = !0, (k = U.current) == null || k.abort();
    },
    []
  ), H(() => {
    if (!F) return;
    const k = (M) => {
      M.preventDefault(), M.returnValue = "";
    };
    return window.addEventListener("beforeunload", k), () => window.removeEventListener("beforeunload", k);
  }, [F]);
  function _t() {
    u("answers"), m(null), y({}), B(null), I(!1), E([]), ie(""), _(""), te(!1), T(null);
  }
  function bt() {
    Se.current || (d(!1), Qe.current.onClose(Ne.current), Ne.current = !1, _t(), we.current = !0);
  }
  function Hn(k, M) {
    E(
      (ae) => M ? [...ae, k] : ae.filter((X) => X !== k)
    ), m(null), y({}), ie(""), _(""), te(!1), T(null);
  }
  function kt() {
    u("answers"), T(null), ie("");
  }
  function vn() {
    u("preview"), g || me();
  }
  function jt() {
    var k;
    tt.current = !0, (k = U.current) == null || k.abort(), ie("Stopping after in-flight operations settle…");
  }
  function Ot(k) {
    T(
      (M) => (M == null ? void 0 : M.group) === k.group && M.reason === k.reason ? null : k
    );
  }
  const un = (k, M) => (v == null ? void 0 : v.group) === k && v.reason === M;
  async function me() {
    if (!it.length || Se.current) return;
    Se.current = !0, G(!0), _(""), te(!1), ie("Loading all matching occurrences…"), m(null), y({}), T(null);
    const k = new AbortController();
    U.current = k;
    try {
      await Au(Ke.current, k.signal);
      const M = await yu(
        e,
        it,
        k.signal,
        (X) => ie(`Loaded ${X.toLocaleString()} matching occurrences…`)
      );
      k.signal.throwIfAborted();
      const ae = {};
      for (const X of M.entries)
        for (const Ce of X.before.applications ?? [])
          ae[Ce.tag.id] = Ce.tag;
      y(ae), m(M), ie("Preview ready. No tags have been changed.");
    } catch (M) {
      _(
        k.signal.aborted ? "Preview cancelled. No tags were changed." : M instanceof Error ? M.message : String(M)
      ), te(!k.signal.aborted && M instanceof dc), ie("");
    } finally {
      Se.current = !1, G(!1), U.current = null;
    }
  }
  async function St(k) {
    if (!g || Se.current) return;
    const M = (k === "undo" ? pc(g) : fc(g, k === "retry")).length;
    Se.current = !0, tt.current = !1, Ne.current = !0, Qe.current.onWrite(), G(!0), u("run"), _(""), B({ kind: k, total: M, done: 0, stopped: !1 }), ie(
      k === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const ae = () => B((Ce) => Ce && { ...Ce, done: Ce.done + 1 });
    let X = !1;
    try {
      k === "undo" ? await qu(g, () => tt.current, ae) : await Nu(g, w, () => tt.current, ae, k === "retry"), ie(
        tt.current ? "Stopped after in-flight operations settled. Completed changes are retained." : k === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (Ce) {
      X = !0, ie(""), _(Ce instanceof Error ? Ce.message : String(Ce));
    } finally {
      Ke.current = Date.now(), Se.current = !1;
      const Ce = tt.current || X;
      B((be) => be && { ...be, stopped: Ce }), G(!1), z((be) => be + 1);
    }
  }
  const nt = (g == null ? void 0 : g.entries) ?? [], On = ve(
    () => new Map(
      ((g == null ? void 0 : g.entries) ?? []).map((k) => [
        k.item.key,
        ka(k.before.ids, g.action, g.categories, w)
      ])
    ),
    [g, w]
  ), Ut = (k) => On.get(k.item.key), je = (k) => Cr(k.before.ids, Ut(k).desired), Ct = (k) => {
    const M = je(k);
    return k.status === "pending" && (M.added.length > 0 || M.removed.length > 0);
  }, re = (k) => k.conflict || Ut(k).kept.length > 0 || Ut(k).replaced.length > 0, O = ve(() => {
    const k = (g == null ? void 0 : g.entries) ?? [];
    return {
      willChange: k.filter(Ct).length,
      correct: k.filter((M) => M.status === "unchanged").length,
      different: k.filter(re).length,
      hosts: new Set(k.map((M) => M.item.media.id)).size,
      added: [...new Set(k.flatMap((M) => je(M).added))],
      removed: [...new Set(k.flatMap((M) => je(M).removed))]
    };
  }, [On]), ye = ve(
    () => ((g == null ? void 0 : g.entries) ?? []).filter((k) => k.item.media.date).sort((k, M) => k.item.media.date.localeCompare(M.item.media.date)),
    [g]
  ), ut = Be ? $u(nt) : null, Mn = (k) => wn.keys[Re.actions.findIndex((M) => M.id === k)] ?? "", ce = (k) => pr(k, yn, [], a), At = Kr(de.condition) && de.includeSubtags !== !1 && de.conditionTagIds.length > 0, Ye = ye[0], xe = ye.length > 1 ? ye[ye.length - 1] : void 0, Xe = (k) => `/${Ve}/${k.item.media.id}`, Gt = ke ? J[0] : void 0, Ze = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: Ct },
    correct: { title: "Occurrences already correct", test: (k) => k.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: re }
  };
  function wt() {
    const k = Tu[de.condition], M = !!k && de.conditionTagIds.length > 0, ae = de.performerIds.slice(0, Oo), X = String(Re.view.filter.q ?? "").trim(), Ce = de.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ l("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      Ai(de) ? /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "All performers" }) : de.targetMode === "selected" ? /* @__PURE__ */ l(ue, { children: [
        ae.map((be, Le) => /* @__PURE__ */ l("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ r(Sr, { performer: { id: be, name: J[Le] ?? "" } }),
          J[Le] ?? "…"
        ] }, be)),
        de.performerIds.length > ae.length && /* @__PURE__ */ l("span", { className: "dq-batch-chip", children: [
          (de.performerIds.length - ae.length).toLocaleString(),
          " more performers"
        ] })
      ] }) : /* @__PURE__ */ l(ue, { children: [
        /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "Performer criteria" }),
        /* @__PURE__ */ r(
          "fieldset",
          {
            className: "dq-batch-filter-summary",
            disabled: !0,
            "aria-label": "Batch performer criteria",
            children: /* @__PURE__ */ r(
              Gr,
              {
                filter: {},
                objectFilter: de.performerFilter,
                criteriaDefinitions: vi,
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
      /* @__PURE__ */ l("span", { className: "dq-batch-chip", children: [
        M ? k : ki[de.condition],
        M && /* @__PURE__ */ r("span", { className: "dq-batch-chip-tags", children: cr(de.conditionTagIds.map(st)).map((be) => /* @__PURE__ */ r(Xt, { tag: be }, be.id)) })
      ] }),
      M && /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: de.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      Kr(de.condition) && de.hideConfirmedAbsent !== !1 && /* @__PURE__ */ l("span", { className: "dq-batch-chip", title: Ce, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
          ": ",
          Ce
        ] })
      ] }),
      X && /* @__PURE__ */ l("span", { className: "dq-batch-chip", children: [
        "Search “",
        X,
        "”"
      ] }),
      Object.keys(Re.view.objectFilter).length > 0 && /* @__PURE__ */ r(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${dn} filters`,
          children: /* @__PURE__ */ r(
            Gr,
            {
              filter: Re.view.filter,
              objectFilter: dt,
              criteriaDefinitions: Ve === "audio" ? Xo : Ni,
              customFieldEntityType: Ve,
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
  function Mt(k) {
    return n.length ? /* @__PURE__ */ l("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ r(ya, { "aria-hidden": "true" }),
      /* @__PURE__ */ l("div", { children: [
        /* @__PURE__ */ l("p", { children: [
          /* @__PURE__ */ r("strong", { children: Gt || "This performer" }),
          " is flagged:",
          " ",
          /* @__PURE__ */ r("strong", { children: n.join(", ") }),
          ". Check the earliest and latest",
          " ",
          qt.many,
          " before applying, or narrow the batch with a date filter."
        ] }),
        k && Ye && /* @__PURE__ */ l("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ l("a", { href: Xe(Ye), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            _r(Ye, Ve),
            " · ",
            Ye.item.media.date
          ] }),
          xe && /* @__PURE__ */ l("a", { href: Xe(xe), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            _r(xe, Ve),
            " · ",
            xe.item.media.date
          ] })
        ] })
      ] })
    ] }) : null;
  }
  function tn() {
    return /* @__PURE__ */ l(ue, { children: [
      wt(),
      Mt(!1),
      /* @__PURE__ */ l("div", { className: `dq-batch-pick${ke ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ l("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ r("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ r("div", { className: "dq-batch-answers", children: Oe.map((k, M) => {
            const ae = Mn(k.id);
            return /* @__PURE__ */ l("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ r(
                "input",
                {
                  type: "checkbox",
                  checked: q.includes(k.id),
                  "aria-labelledby": `${Ee}-answer-${M}`,
                  "aria-describedby": `${Ee}-effect-${M}`,
                  onChange: (X) => Hn(k.id, X.target.checked)
                }
              ),
              /* @__PURE__ */ r("span", { className: "dq-batch-answer-key", children: ae && /* @__PURE__ */ r(at, { binding: ae, hidden: !0 }) }),
              /* @__PURE__ */ l("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ r(
                  "span",
                  {
                    id: `${Ee}-answer-${M}`,
                    className: "dq-batch-answer-label",
                    title: k.label,
                    children: k.label
                  }
                ),
                /* @__PURE__ */ r(Po, { id: `${Ee}-effect-${M}`, parts: ce(k) })
              ] })
            ] }, k.id);
          }) })
        ] }),
        ke && /* @__PURE__ */ r(hi, { ...ot, mediaKind: Ve, className: "dq-batch-card" })
      ] })
    ] });
  }
  function ct(k) {
    const M = O, ae = v && Mo.has(v.group) ? v.group : null, X = ae ? nt.filter(Ze[ae].test) : [], Ce = (be) => {
      const Le = Ut(be), Ue = Le.skipped ? Cr(
        be.before.ids,
        ka(be.before.ids, k.action, k.categories, !0).desired
      ) : je(be), Tt = !Ue.added.length && !Ue.removed.length;
      return /* @__PURE__ */ l("div", { className: "dq-batch-plan", children: [
        Le.skipped && /* @__PURE__ */ r("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        Tt ? !Le.kept.length && /* @__PURE__ */ r("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ r(xo, { added: Ue.added, removed: Ue.removed, tag: st }),
        Le.kept.map((qe, nn) => /* @__PURE__ */ l("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          cr(qe.existing.map(st)).map((fe) => /* @__PURE__ */ r(Xt, { tag: fe }, fe.id)),
          " ",
          "instead of",
          " ",
          cr(qe.tagIds.map(st)).map((fe) => /* @__PURE__ */ r(Xt, { tag: fe }, fe.id))
        ] }, nn))
      ] });
    };
    return /* @__PURE__ */ l(ue, { children: [
      /* @__PURE__ */ l("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ l("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ r(
            Dr,
            {
              value: nt.length,
              label: nt.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${M.hosts.toLocaleString()} ${M.hosts === 1 ? dn : `${dn}s`}`,
              pressed: un("matching"),
              onToggle: () => Ot({ group: "matching" })
            }
          ),
          /* @__PURE__ */ r(
            Dr,
            {
              value: M.willChange,
              label: "will change",
              tone: "add",
              pressed: un("change"),
              onToggle: () => Ot({ group: "change" })
            }
          ),
          /* @__PURE__ */ r(
            Dr,
            {
              value: M.correct,
              label: "already correct, no write",
              pressed: un("correct"),
              onToggle: () => Ot({ group: "correct" })
            }
          ),
          /* @__PURE__ */ r(
            Dr,
            {
              value: M.different,
              label: w ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: un("different"),
              onToggle: () => Ot({ group: "different" })
            }
          )
        ] }),
        X.length > 0 ? /* @__PURE__ */ r(
          Lo,
          {
            title: Ze[ae].title,
            entries: X,
            mediaKind: Ve,
            resultHeading: "Planned change",
            describe: Ce
          }
        ) : nt.length > 0 && /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        nt.length > 0 && /* @__PURE__ */ l("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ r("span", { children: Ye ? `Dates ${Ye.item.media.date}${xe ? ` to ${xe.item.media.date}` : ""}` : "No dates" }),
          Ye && /* @__PURE__ */ r(
            "a",
            {
              href: Xe(Ye),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${qt.one}, ${Ye.item.media.date}`,
              title: _r(Ye, Ve),
              children: "Open earliest"
            }
          ),
          xe && /* @__PURE__ */ r(
            "a",
            {
              href: Xe(xe),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${qt.one}, ${xe.item.media.date}`,
              title: _r(xe, Ve),
              children: "Open latest"
            }
          ),
          ye.length < nt.length && /* @__PURE__ */ l("span", { children: [
            (nt.length - ye.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (M.added.length > 0 || M.removed.length > 0) && /* @__PURE__ */ l("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ r("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ r(
            xo,
            {
              added: M.added,
              removed: M.removed,
              tag: st,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      M.different > 0 && /* @__PURE__ */ l("div", { className: "dq-batch-choice", children: [
        /* @__PURE__ */ r("span", { id: `${Ee}-choice`, className: "dq-batch-choice-label", children: "Occurrences with a different answer" }),
        /* @__PURE__ */ l(
          "div",
          {
            className: "dq-segmented dq-segmented-fill",
            role: "group",
            "aria-labelledby": `${Ee}-choice`,
            children: [
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": !w, onClick: () => I(!1), children: "Keep their answer" }),
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": w, onClick: () => I(!0), children: "Replace it" })
            ]
          }
        ),
        /* @__PURE__ */ l("p", { className: "dq-muted", children: [
          "A different answer is a tag the chosen answers would remove",
          At ? ", or another answer already in a condition category (each condition tag with its subtags); keeping it still fills the empty categories" : "",
          ". Configure opposite answers as removals."
        ] })
      ] })
    ] });
  }
  function hr() {
    return /* @__PURE__ */ l(ue, { children: [
      wt(),
      Mt(!0),
      /* @__PURE__ */ l("div", { className: `dq-batch-cards${ke ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ l("section", { className: "dq-batch-card", "aria-labelledby": `${Ee}-chosen`, children: [
          /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ r("h3", { id: `${Ee}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", disabled: F, onClick: kt, children: "Change" })
          ] }),
          /* @__PURE__ */ r("ul", { className: "dq-batch-chosen", children: it.map((k) => {
            const M = Mn(k.id);
            return /* @__PURE__ */ l("li", { children: [
              /* @__PURE__ */ l("span", { className: "dq-batch-chosen-chip", children: [
                M && /* @__PURE__ */ r(at, { binding: M, hidden: !0 }),
                k.label
              ] }),
              /* @__PURE__ */ r(Po, { parts: ce(k) })
            ] }, k.id);
          }) })
        ] }),
        ke && /* @__PURE__ */ r(hi, { ...ot, mediaKind: Ve, className: "dq-batch-card" })
      ] }),
      F ? /* @__PURE__ */ r("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ r("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ r("span", {}) }) }) : g && ct(g)
    ] });
  }
  function Kt(k) {
    const M = D ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, ae = M.kind === "apply" ? nt.length - k.counts.pending : M.done, X = M.kind === "apply" ? nt.length : M.total, Ce = F ? M.kind === "undo" ? "Undoing batch…" : M.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : M.kind === "undo" ? M.stopped ? "Undo stopped" : "Undo finished" : M.stopped ? "Stopped" : "Finished", be = X ? Math.round(ae / X * 100) : 100, Le = v && !Mo.has(v.group) ? v.group : null, Ue = (qe) => Fo.find((nn) => nn.status === qe).label, Tt = Le ? nt.filter(
      (qe) => qe.status === Le && (!v.reason || qe.error === v.reason)
    ) : [];
    return /* @__PURE__ */ l(ue, { children: [
      /* @__PURE__ */ l("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ r("h3", { tabIndex: -1, "data-batch-focus": "", children: Ce }),
          /* @__PURE__ */ l("span", { children: [
            ae.toLocaleString(),
            " of ",
            X.toLocaleString(),
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
            "aria-valuemax": X,
            "aria-valuenow": ae,
            children: /* @__PURE__ */ r("span", { style: { width: `${be}%` } })
          }
        ),
        !F && M.kind === "undo" && /* @__PURE__ */ l("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (M.total - k.recorded).toLocaleString(),
          " of",
          " ",
          M.total.toLocaleString(),
          " ",
          M.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ l("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ r("div", { className: "dq-batch-stats", "data-count": "5", children: Fo.map((qe) => /* @__PURE__ */ r(
          Dr,
          {
            value: k.counts[qe.status],
            label: qe.label,
            tone: qe.tone,
            pressed: un(qe.status),
            onToggle: () => Ot({ group: qe.status })
          },
          qe.status
        )) }),
        k.reasons.length > 0 && /* @__PURE__ */ r("ul", { className: "dq-batch-reasons", children: k.reasons.map((qe) => {
          const nn = un(qe.status, qe.error);
          return /* @__PURE__ */ l("li", { children: [
            /* @__PURE__ */ l("span", { children: [
              qe.count.toLocaleString(),
              " ",
              qe.status,
              ": ",
              qe.error
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-link-button",
                "aria-expanded": nn,
                onClick: () => Ot({ group: qe.status, reason: qe.error }),
                children: nn ? "Hide them" : "Show them"
              }
            )
          ] }, `${qe.status}-${qe.error}`);
        }) }),
        Tt.length > 0 ? /* @__PURE__ */ r(
          Lo,
          {
            title: v.reason ? `${Ue(Le)}: ${v.reason}` : `${Ue(Le)} occurrences`,
            entries: Tt,
            mediaKind: Ve,
            resultHeading: "Result",
            describe: (qe) => qe.error ?? Ue(qe.status)
          }
        ) : /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." })
      ] }),
      k.recorded > 0 && /* @__PURE__ */ l("div", { className: "dq-batch-undo", children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: F,
            onClick: () => void St("undo"),
            children: [
              /* @__PURE__ */ r(ml, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ l("p", { children: [
          en ? M.stopped || F ? `${k.recorded.toLocaleString()} ${k.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${k.recorded.toLocaleString()} ${k.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${k.recorded === 1 ? "this change" : `these ${k.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          "It lasts until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function Fn() {
    return h === "answers" ? /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !it.length,
        onClick: vn,
        children: "Preview all matches"
      },
      "preview"
    ) : h === "preview" ? F ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: jt, children: "Cancel preview" }, "cancel-preview") : g ? /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !O.willChange,
        onClick: () => void St("apply"),
        children: [
          "Apply to ",
          O.willChange.toLocaleString(),
          " ",
          O.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : Z ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button primary", onClick: kt, children: "Change answers" }, "change-answers") : /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void me(),
        children: "Preview again"
      },
      "again"
    ) : F ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: jt, children: en ? "Cancel undo" : "Cancel run" }, "cancel-run") : en || !ut ? null : /* @__PURE__ */ l(yi, { children: [
      ut.retryable && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: () => void St("retry"), children: "Retry failed" }),
      ut.counts.pending > 0 && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          onClick: () => void St("apply"),
          children: "Continue"
        }
      )
    ] }, "after-run");
  }
  return /* @__PURE__ */ l(Eu, { children: [
    /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: Fe,
        title: "Apply answers to all matching occurrences",
        disabled: t || !Oe.length,
        onClick: () => {
          _t(), i(), d(!0);
        },
        children: [
          /* @__PURE__ */ r(po, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    c && /* @__PURE__ */ l(
      "dialog",
      {
        ref: j,
        className: "dq-batch-dialog",
        "aria-labelledby": `${Ee}-title`,
        "aria-modal": "true",
        onCancel: (k) => {
          k.preventDefault(), bt();
        },
        onClose: () => {
          var k;
          Se.current ? (k = j.current) == null || k.showModal() : bt();
        },
        children: [
          /* @__PURE__ */ l("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ r(po, { "aria-hidden": "true" }),
            /* @__PURE__ */ r("h2", { id: `${Ee}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: F,
                onClick: bt,
                children: /* @__PURE__ */ r(Qr, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r(Ru, { step: h }),
          /* @__PURE__ */ l(
            "div",
            {
              className: "dq-batch-body",
              ref: A,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": h === "preview" ? "" : void 0,
              "aria-label": `${mi.find((k) => k.id === h).label} step`,
              children: [
                /* @__PURE__ */ l("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  ne && /* @__PURE__ */ r("p", { role: "status", children: ne }),
                  K && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: K })
                ] }),
                h === "answers" ? tn() : h === "preview" ? hr() : Kt(ut)
              ]
            }
          ),
          /* @__PURE__ */ l("div", { className: "dq-batch-footer", children: [
            h === "preview" && /* @__PURE__ */ l("button", { type: "button", className: "dq-button", disabled: F, onClick: kt, children: [
              /* @__PURE__ */ r(Wr, { "aria-hidden": "true" }),
              "Back"
            ] }),
            h === "run" && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: F, onClick: _t, children: "New batch" }),
            /* @__PURE__ */ r("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: F, onClick: bt, children: "Close" }),
            Fn()
          ] })
        ]
      }
    )
  ] });
}
const gc = "data-quality.description-collapsed.v1";
function Ou() {
  try {
    return localStorage.getItem(gc) === "true";
  } catch {
    return !1;
  }
}
function Mu({
  details: e,
  label: t
}) {
  const [n, a] = C(Ou), i = mn(() => {
    a((o) => {
      const s = !o;
      try {
        localStorage.setItem(gc, String(s));
      } catch {
      }
      return s;
    });
  }, []);
  return /* @__PURE__ */ l("section", { className: "dq-media-description", "aria-label": `${t} description`, children: [
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
    !n && (e != null && e.trim() ? /* @__PURE__ */ r(nl, { className: "dq-description-body", children: e }) : /* @__PURE__ */ r("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
function Fu({
  ranking: e,
  busy: t,
  error: n,
  focus: a,
  disabled: i,
  labels: o,
  onFocus: s,
  onMore: c,
  onRefresh: d
}) {
  var g;
  const h = e ? e.ranked.slice(0, e.limit) : [], u = !!e && (e.ranked.length > e.limit || (((g = e.candidates[e.cursor]) == null ? void 0 : g.total) ?? 0) > 0);
  return /* @__PURE__ */ l("div", { className: "dq-performer-ranking", children: [
    /* @__PURE__ */ l("div", { className: "dq-performer-ranking-status", children: [
      n ? /* @__PURE__ */ l("p", { role: "alert", children: [
        "Could not rank performers. ",
        n
      ] }) : t ? /* @__PURE__ */ l("p", { role: "status", children: [
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
          children: /* @__PURE__ */ r(gl, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-queue-list", children: h.map((m) => {
      const N = `${m.count.toLocaleString()} matching ${m.count === 1 ? o.one : o.many}`, y = m.flags.length ? `Flagged: ${m.flags.join(", ")}` : "";
      return /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${m.name}, ${N}${y ? `. ${y}` : ""}`,
          title: y || void 0,
          "aria-current": a === m.id ? "true" : void 0,
          disabled: i,
          onClick: () => s(m.id),
          children: [
            /* @__PURE__ */ r(Sr, { performer: m }),
            /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: m.name }),
            y && /* @__PURE__ */ r(ya, { className: "dq-flag-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ r("span", { className: "dq-ranked-count", "aria-hidden": "true", children: m.count.toLocaleString() })
          ]
        },
        m.id
      );
    }) }),
    u && !t && !n && /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button dq-ranking-more",
        disabled: i,
        onClick: c,
        children: "Show more performers"
      }
    )
  ] });
}
const Pu = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], xu = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function Lu(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), a = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), i = t.bottom + 8;
  return { top: i, left: a, width: n, maxHeight: Math.max(160, window.innerHeight - i - 16) };
}
function ha(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function Du(e, t) {
  const n = Ai(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", a = e.conditionTagIds.map(
    (o) => t[o] === void 0 ? "…" : t[o] ?? "Unavailable tag"
  ), i = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${ha(a, "or")}`,
    includesAll: `has ${ha(a, "and")}`,
    excludes: `has none of ${ha(a, "or")}`,
    excludesAll: `missing ${ha(a, "or")}`
  };
  return `${n} · ${i[e.condition]}`;
}
function _u({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: a,
  onEditCriteria: i
}) {
  const [o, s] = C(!1), [c, d] = C(null), h = $(null), u = $(null), g = Nt(), m = Rr(e.conditionTagIds), N = Du(e, m);
  Zt(() => {
    if (!o || !h.current) return;
    const w = () => h.current && d(Lu(h.current));
    return w(), window.addEventListener("resize", w), () => window.removeEventListener("resize", w);
  }, [o]), H(() => {
    var I, F;
    if (!o) return;
    const w = (I = u.current) == null ? void 0 : I.querySelector('[aria-pressed="true"]');
    w && !w.disabled ? w.focus() : (F = u.current) == null || F.focus();
  }, [o]);
  const y = () => {
    s(!1), requestAnimationFrame(() => {
      var w;
      return (w = h.current) == null ? void 0 : w.focus();
    });
  }, q = (w) => {
    if (!(w.target instanceof Element && w.target.closest('[role="dialog"]') !== u.current || w.defaultPrevented)) {
      if (w.key === "Escape")
        w.preventDefault(), y();
      else if (w.key === "Tab" && u.current) {
        const F = [...u.current.querySelectorAll(xu)].filter((Z) => Z.closest('[role="dialog"]') === u.current).sort(
          (Z, te) => Z.compareDocumentPosition(te) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!F.length) return;
        const G = F[0], K = F[F.length - 1], _ = document.activeElement;
        w.shiftKey && (_ === G || _ === u.current) ? (w.preventDefault(), K.focus()) : !w.shiftKey && _ === K && (w.preventDefault(), G.focus());
      }
    }
  }, E = !["any", "isNull"].includes(e.condition);
  return /* @__PURE__ */ l("div", { className: "dq-scope", children: [
    /* @__PURE__ */ l(
      "button",
      {
        ref: h,
        type: "button",
        className: "dq-header-button dq-scope-button",
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        "aria-controls": o ? g : void 0,
        title: N,
        onClick: () => o ? y() : s(!0),
        children: [
          /* @__PURE__ */ r(os, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-summary", children: N }),
          /* @__PURE__ */ r(is, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ l(ue, { children: [
      /* @__PURE__ */ r("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: y }),
      /* @__PURE__ */ l(
        "div",
        {
          ref: u,
          id: g,
          role: "dialog",
          "aria-label": "Queue scope",
          className: "dq-scope-popover",
          tabIndex: -1,
          style: c ? {
            top: c.top,
            left: c.left,
            width: c.width,
            maxHeight: c.maxHeight
          } : void 0,
          onKeyDown: q,
          children: [
            /* @__PURE__ */ l("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Performers to review" }),
              /* @__PURE__ */ r("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: Pu.map(({ mode: w, label: I }) => /* @__PURE__ */ r(
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
                Rn,
                {
                  entityType: "performer",
                  values: e.performerIds,
                  onChange: (w) => a({ performerIds: w }),
                  placeholder: "All performers...",
                  allowCreate: !1
                }
              ),
              e.targetMode === "filter" && /* @__PURE__ */ l("div", { className: "dq-scope-criteria", children: [
                /* @__PURE__ */ r("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ r(
                  Gr,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: vi,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (w) => a({ performerFilter: w })
                  }
                ) }),
                /* @__PURE__ */ l("button", { type: "button", className: "dq-button", onClick: i, children: [
                  /* @__PURE__ */ r(kr, { "aria-hidden": "true" }),
                  "Edit criteria"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ l("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Occurrence tags" }),
              /* @__PURE__ */ r(
                "select",
                {
                  className: "dq-select",
                  "aria-label": "Occurrence condition",
                  value: e.condition,
                  onChange: (w) => a({ condition: w.target.value }),
                  children: Ci.map((w) => /* @__PURE__ */ r("option", { value: w, children: ki[w] }, w))
                }
              ),
              E && /* @__PURE__ */ l(ue, { children: [
                /* @__PURE__ */ r(
                  Rn,
                  {
                    entityType: "tag",
                    values: e.conditionTagIds,
                    onChange: (w) => a({ conditionTagIds: w }),
                    placeholder: "Add a condition tag…",
                    allowCreate: !1
                  }
                ),
                /* @__PURE__ */ l("div", { className: "dq-scope-options", children: [
                  /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
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
                  Kr(e.condition) && /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
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
            /* @__PURE__ */ l("div", { className: "dq-scope-footer", children: [
              /* @__PURE__ */ r("p", { children: n ? "Applies to this queue at once, and Save review keeps it." : "Applies to this queue at once. Save it to the review from the filter row." }),
              /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: y, children: "Done" })
            ] })
          ]
        }
      )
    ] })
  ] });
}
function ba(e) {
  const {
    page: t,
    perPage: n,
    sort: a,
    direction: i,
    sorts: o,
    seed: s,
    ...c
  } = e.view.filter;
  return JSON.stringify([
    e.entityType,
    c,
    e.view.objectFilter,
    e.view.searchMode,
    e.occurrence
  ]);
}
function ju(e) {
  const t = e.occurrence;
  return JSON.stringify([
    Pe(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {},
    t.flagPerformerTagIds ?? []
  ]);
}
async function Uu(e, t) {
  const n = Pe(e) === "audio", a = new Set(e.occurrence.flagPerformerTagIds ?? []), i = (c) => ({
    id: c.id,
    name: c.name,
    total: (n ? c.audioCount : c.videoCount) ?? 0,
    flags: (c.tags ?? []).filter((d) => a.has(d.id)).map((d) => d.name)
  }), o = e.occurrence, s = [];
  if (o.targetMode === "selected" && o.performerIds.length > 0)
    for (const c of o.performerIds) {
      const d = await Wl(
        `/api/performers/${c}`,
        { signal: t }
      );
      d && s.push(i(d));
    }
  else {
    const { _filterExpression: c, ...d } = o.targetMode === "filter" ? o.performerFilter : {};
    for (let h = 1; ; h++) {
      const u = await le(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            In({
              findFilter: {
                page: h,
                perPage: 1e3,
                sort: n ? "audio_count" : "video_count",
                direction: "desc"
              },
              objectFilter: d,
              filterExpression: c
            })
          )
        }
      );
      if (s.push(...u.items.map(i)), h * 1e3 >= u.totalCount || !u.items.length) break;
    }
  }
  return s.sort((c, d) => d.total - c.total || c.id - d.id);
}
function bc(e, t, n) {
  const a = Hi(e, [t]);
  return Xl(a, a.view.filter, n);
}
function wc(e, t) {
  const n = e.findIndex(
    (a) => a.count < t.count || a.count === t.count && a.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function gi(e, t, n, a) {
  if (t >= e.length) return !0;
  const i = e[t].total;
  return i <= 0 ? !0 : n.length >= a && i < n[a - 1].count;
}
async function Gu(e, t, n, a, i = {}) {
  const o = ba(e), s = ju(e), c = sc(e.occurrence), d = (t == null ? void 0 : t.signature) === o && !t.partial ? t : {
    signature: o,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: c ? "" : s,
    candidates: c ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await Uu(e, a),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: h } = d, u = [...d.ranked];
  let g = d.cursor, m = !1;
  const N = (y) => ({
    ...d,
    cursor: g,
    ranked: [...u],
    limit: n,
    complete: !y && gi(h, g, u, n),
    ...y ? { partial: y } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: i.concurrency ?? 6 }, async () => {
        var y;
        for (; !m && !gi(h, g, u, n); ) {
          a.throwIfAborted();
          const q = h[g++], E = await bc(e, q.id, a);
          E > 0 && wc(u, { ...q, count: E }), (y = i.onProgress) == null || y.call(i, N(!0));
        }
      })
    );
  } catch (y) {
    throw m = !0, y;
  }
  return a.throwIfAborted(), N(!1);
}
function Ku(e, t, n) {
  const a = e.candidates.findIndex((o) => o.id === t);
  if (e.partial || a < 0 || a >= e.cursor) return e;
  const i = e.ranked.filter((o) => o.id !== t);
  return n > 0 && wc(i, { ...e.candidates[a], count: n }), {
    ...e,
    ranked: i,
    complete: gi(e.candidates, e.cursor, i, e.limit)
  };
}
function ur(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, c) => ur(s, t[c]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, a = t, i = Object.keys(n).sort(), o = Object.keys(a).sort();
  return i.length === o.length && i.every(
    (s, c) => s === o[c] && ur(n[s], a[s])
  );
}
function Bu(e) {
  var c, d, h;
  const [t, n] = C({}), [a, i] = C(""), o = (((c = e == null ? void 0 : e.presentation) == null ? void 0 : c.annotations) ?? []).includes("tags") ? ((d = e == null ? void 0 : e.presentation) == null ? void 0 : d.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...o,
      ...((h = e == null ? void 0 : e.presentation) == null ? void 0 : h.binParents) ?? []
    ])
  ]);
  return H(() => {
    let u = !0;
    return n({}), i(""), Promise.all(
      JSON.parse(s).map(
        async (g) => [g, await Ra([g])]
      )
    ).then((g) => {
      u && n(Object.fromEntries(g));
    }).catch(() => {
      u && i(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      u = !1;
    };
  }, [s]), { ids: t, error: a };
}
function Vu(e, t, n) {
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
        (c) => {
          var d;
          return c !== s.id && ((d = n[c]) == null ? void 0 : d.includes(s.id));
        }
      )
    ) : []
  };
}
function Ju({
  videos: e,
  review: t,
  savedObjectFilter: n,
  trees: a,
  disabled: i,
  onToggle: o
}) {
  var y;
  const s = ((y = t.presentation) == null ? void 0 : y.binParents) ?? [], c = new Set(
    s.flatMap((q) => (a[q] ?? []).filter((E) => E !== q))
  ), d = s.every((q) => a[q]), h = ea(t.view.objectFilter, n).bins.filter(
    (q) => !d || c.has(q)
  ), u = /* @__PURE__ */ new Map();
  for (const q of e)
    for (const E of q.tags ?? [])
      if (c.has(E.id)) {
        const w = u.get(E.id) ?? { name: E.name, count: 0 };
        w.count++, u.set(E.id, w);
      }
  const g = h.filter((q) => !u.has(q)), m = Rr(g);
  for (const q of g)
    u.set(q, {
      name: m[q] === void 0 ? "…" : m[q] ?? "Unavailable tag",
      count: 0
    });
  if (!s.length) return null;
  const N = [...u].sort((q, E) => q[1].name.localeCompare(E[1].name));
  return /* @__PURE__ */ l("div", { className: "dq-bins", role: "group", "aria-label": "Tag bins on this page", children: [
    /* @__PURE__ */ r("span", { className: "dq-bins-label", "aria-hidden": "true", children: "On this page" }),
    N.map(([q, E]) => {
      const w = h.includes(q);
      return /* @__PURE__ */ l(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": w,
          title: w ? `Show every video again, not only ${E.name}` : `Show only videos tagged ${E.name}`,
          disabled: i,
          onClick: () => o(q),
          children: [
            w && /* @__PURE__ */ r(Ca, { "aria-hidden": "true" }),
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
function or(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function zu(e) {
  if (!or(e) || Object.keys(e).length !== 1 || !or(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !or(t.tagsCriterion)) return null;
  const { value: n, modifier: a, depth: i, ...o } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && a === "INCLUDES" && i === 0 && !Object.keys(o).length ? n[0] : null;
}
function ea(e, t) {
  let n = e;
  const a = [];
  for (; ; ) {
    if (t && ur(n, t)) {
      n = t;
      break;
    }
    const i = Object.keys(n);
    if (i.length !== 1 || i[0] !== "_filterExpression") break;
    const o = n._filterExpression;
    if (!or(o) || o.operator !== "AND" || !Array.isArray(o.children))
      break;
    const s = o.children, c = zu(s.at(-1));
    if (c == null || s.length > 3) break;
    let d = {}, h = null, u = !0;
    for (const [g, m] of s.slice(0, -1).entries())
      !or(m) || Object.keys(m).length !== 1 ? u = !1 : g === 0 && or(m.filter) && Object.keys(m.filter).length ? d = m.filter : !h && or(m.group) ? h = m.group : u = !1;
    if (!u) break;
    a.unshift(c), n = h ? { ...d, _filterExpression: h } : d;
  }
  return { base: n, bins: a };
}
function Qu(e, t, n) {
  const { base: a, bins: i } = ea(e.view.objectFilter, n);
  return (i.includes(t) ? i.filter((s) => s !== t) : [...i, t]).reduce(Wu, { ...e, view: { ...e.view, objectFilter: a } });
}
function Wu(e, t) {
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
const Ia = [
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
], Hu = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function fr(e) {
  const t = Te(e) ? e.occurrence : void 0;
  return {
    filter: Lt({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, Pe(e)),
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
function Do(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function bi(e, t) {
  let n;
  if (Te(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!Ia.some((c) => c !== "performer" && t.has(c))) {
    const c = fr(e);
    return {
      query: n ? { ...c, performerFocus: n } : c,
      startAtEnd: c.startFrom === "end"
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
    const c = t.get("sorts").split(",").map((d) => {
      const h = d.lastIndexOf(":");
      return { key: d.slice(0, h), direction: d.slice(h + 1) };
    });
    if (c.some((d) => !d.key || !["asc", "desc"].includes(d.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = c, i.sort = c[0].key, i.direction = c[0].direction;
  }
  let o;
  if (Te(e) && (o = {
    ...Hu,
    ...Do(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(o.targetMode) || !Ci.includes(o.condition) || !Array.isArray(o.performerIds) || !Array.isArray(o.conditionTagIds) || typeof o.includeSubtags != "boolean" || typeof o.hideConfirmedAbsent != "boolean" || [...o.performerIds, ...o.conditionTagIds].some(
    (c) => !Number.isSafeInteger(c) || c <= 0
  ) || !o.performerFilter || typeof o.performerFilter != "object" || Array.isArray(o.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Lt(i, Pe(e)),
      objectFilter: Do(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: o,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
const _o = { dataQualityOpenedFromList: !0 };
function yc() {
  const e = window.history.state;
  return !!e && typeof e == "object" && e.dataQualityOpenedFromList === !0;
}
function vc(e, { openingFromList: t = !1 } = {}) {
  t ? window.history.pushState({ ..._o }, "", e) : window.history.replaceState(yc() ? { ..._o } : null, "", e);
}
function Ur(e, t) {
  const n = new URLSearchParams(window.location.search);
  Ia.forEach((a) => n.delete(a)), n.set("review", e);
  for (const a of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[a] !== void 0 && n.set(a, String(t.filter[a]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((a) => `${a.key}:${a.direction}`).join(",")
  ), n.set("filters", JSON.stringify(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", JSON.stringify(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), vc(`${window.location.pathname}?${n}${window.location.hash}`);
}
function gn(e, t) {
  const n = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return Te(e) ? {
    ...e,
    view: n,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: n };
}
function lr(e) {
  const t = e;
  return gn(t, fr(t));
}
function jo(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !ur(
    JSON.parse(Vn(gn(e, t))),
    JSON.parse(Vn(gn(e, fr(e))))
  );
}
function Nc(e, t) {
  if (_e(e) !== "video") return e;
  const { base: n, bins: a } = ea(e.view.objectFilter, t.view.objectFilter);
  return a.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function ma(e, t) {
  if (_e(e) !== "video") return t;
  const { base: n, bins: a } = ea(t.objectFilter, e.view.objectFilter);
  return a.length ? { ...t, objectFilter: n } : t;
}
function Uo(e, t) {
  return !t || !Te(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function Wa(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const a of e)
    n.set(a.media.id, [...n.get(a.media.id) ?? [], a]);
  return [...n.values()].reverse().flat();
}
const Yt = (e) => e instanceof Error ? e.message : "Request failed.", Ha = 50, Yu = [], Go = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function Xu(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? ol(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? ts(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function Zu({ media: e, kind: t }) {
  const [n, a] = C(!1);
  return /* @__PURE__ */ r("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ r(cs, {}) : /* @__PURE__ */ r(Aa, {}) : /* @__PURE__ */ r(
    "img",
    {
      src: ii(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => a(!0)
    }
  ) });
}
function ef({
  tags: e,
  preview: t,
  showPreview: n,
  trees: a,
  actionTagIds: i,
  label: o
}) {
  const s = Gi(t), c = n ? s : null, d = e == null ? void 0 : e.absent, h = ji(
    ve(() => [...i, ...d ?? []], [i, d])
  ), u = (K) => h[K] ?? { id: K, name: h[K] === void 0 ? "…" : "Unavailable tag" }, g = (K) => cr(K.map(u)), m = c && e ? xi(c, e, a) : null, N = e ? ud(e) : [], y = new Set(N.map((K) => K.id)), q = new Set(m == null ? void 0 : m.removed), E = new Set(m == null ? void 0 : m.markedAbsent), w = new Set(m == null ? void 0 : m.absenceCleared), I = /* @__PURE__ */ l("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ r(wa, { "aria-hidden": "true" }),
    "absent"
  ] }), F = g((m == null ? void 0 : m.added) ?? []), G = g(((m == null ? void 0 : m.markedAbsent) ?? []).filter((K) => !y.has(K)));
  return /* @__PURE__ */ l("section", { className: "dq-panel-section", "aria-label": o, children: [
    /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ l(ue, { children: [
      N.length || F.length || G.length ? /* @__PURE__ */ l("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        N.map(
          (K) => q.has(K.id) ? /* @__PURE__ */ l("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ l("del", { children: [
              "− ",
              /* @__PURE__ */ r(Xt, { tag: K })
            ] }),
            E.has(K.id) && I
          ] }, K.id) : /* @__PURE__ */ r("li", { className: "dq-tag", children: /* @__PURE__ */ r(Xt, { tag: K }) }, K.id)
        ),
        F.map((K) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ l("ins", { children: [
          "+ ",
          /* @__PURE__ */ r(Xt, { tag: K })
        ] }) }, `added-${K.id}`)),
        G.map((K) => /* @__PURE__ */ l("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ r("ins", { children: /* @__PURE__ */ r(Xt, { tag: K }) }),
          I
        ] }, `absent-${K.id}`))
      ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" }),
      e.absent.length > 0 && /* @__PURE__ */ l(ue, { children: [
        /* @__PURE__ */ r("h4", { className: "dq-subheading", children: "Confirmed absent" }),
        /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: g(e.absent).map((K) => /* @__PURE__ */ l(
          "li",
          {
            className: `dq-tag dq-tag-absent${w.has(K.id) ? " dq-tag-removed" : ""}`,
            children: [
              /* @__PURE__ */ r(wa, { "aria-hidden": "true" }),
              w.has(K.id) ? /* @__PURE__ */ l("del", { children: [
                "− ",
                /* @__PURE__ */ r(Xt, { tag: K })
              ] }) : /* @__PURE__ */ r(Xt, { tag: K })
            ]
          },
          K.id
        )) })
      ] })
    ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading…" })
  ] });
}
function tf({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: a,
  onSaveDefaults: i,
  editRequest: o = 0,
  onEditRequestHandled: s,
  pageControls: c,
  stayOnTap: d,
  onStayOnTapChange: h
}) {
  var aa;
  const u = Pe(e), g = bn(u), m = u === "audio" ? "Audio" : "Scene", N = (p) => {
    var S;
    return p.title || ((S = p.files[0]) == null ? void 0 : S.basename) || m;
  }, y = (p) => `${p.occurrence ? `${p.occurrence.performer.name} — ` : ""}${N(p.media)}`, q = $(null), E = $("");
  if (!q.current)
    try {
      q.current = bi(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (p) {
      E.current = Yt(p), q.current = { query: fr(e), startAtEnd: !1 };
    }
  const [w, I] = C(null), [F, G] = C(""), K = $(null), _ = $(null), Z = $(null), te = $(null), [ne, ie] = C(!!E.current), D = $(0), [B, v] = C(q.current.query), T = $(B);
  T.current = B;
  const [J, P] = C(0), Q = $(q.current.startAtEnd), [z, j] = C([]), [A, Fe] = C(null), we = $(null), [tt, U] = C(null), [Ne, Ke] = C(0), Se = ve(() => {
    if (!A) return null;
    const p = z.findIndex((S) => S.key === A.key);
    return p < 0 ? null : z.slice(p + 1).find((S) => S.media.id !== A.media.id) ?? null;
  }, [A, z]), [Qe, Ee] = C(0), [Be, en] = C(!1), [Re, wn] = C(!1), de = $(!1), Ve = $(!0), qt = $(null);
  H(() => (Ve.current = !0, () => {
    Ve.current = !1;
  }), []);
  const [dn, Oe] = C(E.current), [it, ke] = C(""), [ot, Dt] = C(null), [$e, yn] = C(!1), [st, It] = C([]), dt = $([]), _t = $(null), bt = $(null), Hn = $(null);
  H(() => {
    var p, S;
    $e && ((S = (p = Hn.current) == null ? void 0 : p.querySelector("input")) == null || S.focus());
  }, [$e]);
  const [kt, vn] = C(!1), [jt, Ot] = C(!1), un = Zr(), [me, St] = C(!1), nt = d ?? me, On = h ?? St;
  H(() => {
    if (Be || kt || !bt.current) return;
    const p = requestAnimationFrame(() => {
      if (document.querySelector(Go)) return;
      const S = bt.current;
      bt.current = null;
      const x = document.activeElement;
      x && x !== document.body || S != null && S.isConnected && !S.disabled && S.focus();
    });
    return () => cancelAnimationFrame(p);
  }, [Be, kt, J]);
  const [Ut, je] = C([]), [Ct, re] = C({}), O = $(null), ye = $(0), [ut, Mn] = C({});
  H(() => {
    let p = !0;
    return Promise.all(
      zi(B.objectFilter).map(
        async (S) => [
          String(S),
          (await le(`/api/tags/${S}`)).name
        ]
      )
    ).then((S) => {
      p && Mn(Object.fromEntries(S));
    }).catch(() => {
    }), () => {
      p = !1;
    };
  }, [B.objectFilter]);
  const ce = ve(
    () => Qi(B.objectFilter, ut),
    [ut, B.objectFilter]
  ), At = $(0), Ye = $(e);
  Ye.current = e;
  const xe = w ?? e, Xe = ve(
    () => gn(xe, B),
    [xe, B]
  ), Gt = ve(
    () => Uo(Xe, B.performerFocus),
    [Xe, B.performerFocus]
  ), Ze = $(Gt);
  Ze.current = Gt;
  const wt = $(Xe);
  wt.current = Xe;
  const [Mt, tn] = C("items"), [ct, hr] = C(null), Kt = $(null), Fn = $("");
  function k(p) {
    const S = typeof p == "function" ? p(Kt.current) : p;
    Kt.current = S, hr(S);
  }
  const [M, ae] = C(!1), [X, Ce] = C(null), be = $(null), Le = Te(Xe) ? ba(Xe) : "", [Ue, Tt] = C(0), [qe, nn] = C(null);
  H(() => () => {
    var p;
    return (p = be.current) == null ? void 0 : p.controller.abort();
  }, []), H(() => {
    const p = be.current;
    !p || p.signature === Le || (p.controller.abort(), be.current = null, ae(!1));
  }, [Le]), H(() => {
    var x;
    const p = Kt.current;
    if (Mt !== "performers" || !Le || ((x = be.current) == null ? void 0 : x.signature) === Le || Fn.current === Le || (p == null ? void 0 : p.signature) === Le && p.complete)
      return;
    const S = (p == null ? void 0 : p.signature) === Le ? p : null;
    Jt(p, (S == null ? void 0 : S.limit) ?? Ha);
  }, [Mt, Le, ct, X, M]);
  const fe = B.performerFocus, Nn = JSON.stringify(
    Te(Xe) ? Xe.occurrence.flagPerformerTagIds ?? [] : []
  );
  H(() => {
    if (!fe) {
      nn(null);
      return;
    }
    let p = !0;
    const S = new Set(JSON.parse(Nn));
    return le(
      `/api/performers/${fe}`
    ).then((x) => {
      p && nn({
        id: fe,
        name: x.name,
        flags: (x.tags ?? []).filter((Y) => S.has(Y.id)).map((Y) => Y.name)
      });
    }).catch(() => {
    }), () => {
      p = !1;
    };
  }, [fe, Nn]);
  const We = jo(e, B), Yn = jo(e, ma(e, B)), yt = Re || Be || $e, qn = Number(B.filter.page);
  function Rt(p, S = !1) {
    de.current || (E.current = "", Q.current = S, T.current = p, v(p), Ee(0), en(!0), S || Ur(e.id, p), P((x) => x + 1));
  }
  function Pn() {
    if (de.current = !1, wn(!1), Ve.current && qt.current) {
      const p = qt.current;
      qt.current = null, Rt(p.query, p.startAtEnd);
    }
  }
  H(() => {
    const p = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const S = bi(
            Ye.current,
            new URLSearchParams(window.location.search)
          );
          de.current ? qt.current = S : Rt(S.query, S.startAtEnd);
        } catch (S) {
          Oe(Yt(S));
        }
    };
    return window.addEventListener("popstate", p), () => window.removeEventListener("popstate", p);
  }, [e.id]), H(() => (a(Re || Be || $e || !!w), () => a(!1)), [Re, Be, $e, !!w, a]);
  async function lt(p, S, x) {
    if (Te(p)) {
      const oe = await cc(
        p,
        O.current,
        S,
        x
      );
      return {
        items: oe.items.map((pe) => ({
          key: pe.key,
          media: pe.media,
          occurrence: pe
        })),
        totalCount: oe.totalCount
      };
    }
    const Y = await jr(
      p,
      { ...p.view.filter, page: S },
      x
    );
    return {
      items: Y.items.map((oe) => ({ key: String(oe.id), media: oe })),
      totalCount: Y.totalCount
    };
  }
  function Ft(p, S, x, Y = !1, oe = !1) {
    if (!Ve.current || qt.current) return;
    ie(!0), j(
      oe ? p.items : Wa(p.items, T.current.startFrom === "end")
    ), Ee(p.totalCount), fn(x, Y);
    const pe = {
      ...T.current,
      filter: { ...T.current.filter, page: S }
    };
    T.current = pe, v(pe), Ur(e.id, pe);
  }
  function fn(p, S = !1) {
    (p == null ? void 0 : p.key) !== (A == null ? void 0 : A.key) && (we.current = null), (p == null ? void 0 : p.media.id) !== (A == null ? void 0 : A.media.id) && U(S && p ? p.media.id : null), Fe(p);
  }
  H(() => {
    if (E.current) return;
    const p = new AbortController();
    te.current = p;
    const S = ++At.current;
    return en(!0), Oe(""), ke(""), we.current = null, U(null), Fe(null), j([]), yn(!1), (async () => {
      const x = Uo(
        gn(Ye.current, T.current),
        T.current.performerFocus
      );
      O.current = Te(x) ? await Wi(x, p.signal) : null;
      let Y = Number(x.view.filter.page), oe = await lt(x, Y, p.signal);
      const pe = Math.max(
        1,
        Math.ceil(oe.totalCount / Number(x.view.filter.perPage))
      );
      (Q.current || Y > pe) && (Y = pe, oe = await lt(x, Y, p.signal)), Q.current = !1;
      const Ae = x.view.startFrom === "end" ? -1 : 1;
      for (; Te(x) && !oe.items.length && Y + Ae >= 1 && Y + Ae <= pe && !p.signal.aborted; )
        Y += Ae, oe = await lt(x, Y, p.signal);
      if (S !== At.current || p.signal.aborted) return;
      const ht = Wa(oe.items, x.view.startFrom === "end");
      Ft(oe, Y, ht[0] ?? null);
    })().catch((x) => {
      !p.signal.aborted && S === At.current && Oe(Yt(x));
    }).finally(() => {
      !p.signal.aborted && S === At.current && (ie(!0), en(!1));
    }), () => {
      p.abort(), At.current++;
    };
  }, [J, e.id]), H(() => {
    if (Dt(null), !A) return;
    let p = !0;
    return ln(u, A).then((S) => {
      p && (Dt(S), je(
        Te(e) ? S.ids.filter((x) => e.occurrence.tagIds.includes(x)) : []
      ));
    }).catch((S) => {
      p && Oe(`Could not load current tags. ${Yt(S)}`);
    }), () => {
      p = !1;
    };
  }, [A]), H(() => {
    if (!Te(e) || e.actions.length)
      return;
    let p = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (S) => [
          S,
          (await le(`/api/tags/${S}`)).name
        ]
      )
    ).then((S) => {
      p && re(Object.fromEntries(S));
    }).catch((S) => {
      p && Oe(Yt(S));
    }), () => {
      p = !1;
    };
  }, [e]);
  async function pn(p = !1, S = !1, x = !1) {
    var $t;
    if (!A) return;
    const Y = z.findIndex((Ge) => Ge.key === A.key), oe = B.startFrom === "end" ? -1 : 1, pe = (($t = we.current) == null ? void 0 : $t.key) === A.key ? we.current : { key: A.key, page: qn, before: z.slice(0, Y + 1).map((Ge) => Ge.key), after: z.slice(Y + 1).map((Ge) => Ge.key) }, Ae = new Set(pe.after), ht = new Set(pe.before), Wt = z.find((Ge) => {
      var an;
      return Ae.has(Ge.key) || (oe === 1 || qn < pe.page) && ((an = we.current) == null ? void 0 : an.key) === A.key && !ht.has(Ge.key);
    });
    if (!p && Wt) {
      fn(Wt, x);
      return;
    }
    const Pt = p ? ht : new Set(z.map((Ge) => Ge.key)), et = 1100 - (Date.now() - ye.current);
    et > 0 && await new Promise((Ge) => window.setTimeout(Ge, et));
    let Me = oe === -1 && !p ? Math.max(1, qn - 1) : qn;
    for (; Ve.current && !qt.current; ) {
      let Ge = await lt(Gt, Me);
      const an = Math.max(
        1,
        Math.ceil(Ge.totalCount / Number(B.filter.perPage))
      );
      Me > an && (Me = an, Ge = await lt(Gt, Me));
      const wr = Wa(Ge.items, oe === -1), Oa = new Map(wr.map((he) => [he.key, he])), Fr = p ? pe.after.flatMap((he) => {
        const ia = Oa.get(he);
        return ia ? [ia] : [];
      }) : [], Pr = new Set(Fr.map((he) => he.key)), Un = p ? {
        ...Ge,
        items: [
          ...Fr,
          ...wr.filter(
            (he) => he.key !== A.key && !Pr.has(he.key)
          )
        ]
      } : Ge;
      if (S) {
        we.current = pe, Ft(Un, Me, A, !1, p);
        return;
      }
      const on = oe === -1 && qn === 1 && !p ? void 0 : Un.items.find(
        (he) => !Pt.has(he.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(p && oe === -1 && Me === pe.page) || Ae.has(he.key))
      );
      if (on || (oe === -1 ? Me <= 1 : Me >= an)) {
        Ft(
          Un,
          Me,
          on ?? null,
          x,
          p
        ), on || ke(
          Ge.totalCount ? `Reached the end in this direction. Matching items remain available from the ${g.queue} pages.` : `No matching ${g.many}.`
        );
        return;
      }
      Me += oe;
    }
  }
  async function Bt(p, S = !1, x = !1, Y = !1) {
    if (w || !A || de.current || Be || $e && !x)
      return;
    const oe = x || Y || !!(p != null && p.steps.length);
    if (oe && (!t || !ot) || p && Qn(p) && !n) return;
    const pe = !S && !x && !Y && oe && p !== void 0 && ot !== null && qo(e) && ci(si(e.actions, pd(p, ot, xn))).length > 0;
    de.current = !0, wn(!0), Oe(""), ke("");
    const Ae = z.findIndex((et) => et.key === A.key), ht = oe && !S && !pe && Ae >= 0 ? z[Ae + 1] ?? null : null;
    ht && (j(
      (et) => et.filter((Me) => Me.key !== A.key)
    ), fn(ht, !0));
    let Wt = !1, Pt = [];
    try {
      if (oe) {
        const et = await ln(u, A);
        if (p)
          await mu(Gt, A, p);
        else {
          const $t = Y && Te(e) ? e.occurrence.tagIds.filter((wr) => et.ids.includes(wr)) : dt.current, an = Cr($t, Y ? Ut : st);
          await Xi(Gt, A, an);
        }
        ye.current = Date.now();
        const Me = await ln(u, A);
        ht || Dt(Me), Wt = !0, yn(!1), pe && (Pt = ci(si(e.actions, Me))), ke(
          Pt.length ? `Tags saved. Staying until answered: ${Pt.map(($t) => $t.name).join(", ")}.` : "Tags saved."
        ), A.occurrence && (Zn(A.occurrence.performer.id), Tt(($t) => $t + 1));
      }
      if (!Ve.current || qt.current) return;
      oe ? Pt.length || await pn(!0, S, !S) : S || await pn(), S && x && requestAnimationFrame(() => {
        var et;
        return (et = _t.current) == null ? void 0 : et.focus();
      });
    } catch (et) {
      if (Oe(
        Wt ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${Yt(et)}` : oe ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${Yt(et)}` : `Could not advance. ${Yt(et)}`
      ), oe && !Wt) {
        ht && (j(z), U(null), Ke((Me) => Me + 1), Fe(A)), ye.current = Date.now();
        try {
          Dt(await ln(u, A));
        } catch {
          Dt(null), Oe(
            (Me) => `${Me} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      Pn();
    }
  }
  const ft = !$e && !w && !kt && !jt && (A != null || Be || Re);
  Li({
    surface: "local",
    enabled: ft,
    actions: e.actions,
    onAction: (p, S) => {
      const x = e.actions[p];
      x && Bt(x, S);
    },
    onFind: () => Ot(!0)
  });
  const pt = (p) => Re || Be || !ot || !!w || !t && p.steps.length > 0 || !n && Qn(p);
  function Et() {
    !i || w || de.current || $e || (Z.current = document.activeElement, _.current = {
      error: dn,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(T.current),
      items: z,
      current: A,
      total: Qe,
      targets: O.current,
      stayedCursor: we.current
    }, I(structuredClone(e)), G(""), ke(""), Oe(""));
  }
  H(() => {
    if (!o) {
      D.current = 0;
      return;
    }
    o !== D.current && ne && !Be && (D.current = o, Et(), s == null || s());
  }, [o, Be, ne]);
  function vt() {
    I(null), G(""), requestAnimationFrame(() => {
      const p = Z.current;
      p != null && p.isConnected && p !== document.body && p.focus();
    });
  }
  function Sn() {
    var S;
    const p = _.current;
    !p || Re || ((S = te.current) == null || S.abort(), At.current++, T.current = p.query, v(p.query), j(p.items), Fe(p.current), Ee(p.total), O.current = p.targets, we.current = p.stayedCursor, en(!1), Oe(p.error), ke(""), window.history.replaceState(window.history.state, "", p.url), vt());
  }
  async function Vt() {
    if (!w || !i || de.current) return;
    const p = gn(
      { ...w, name: w.name.trim() },
      ma(Ye.current, T.current)
    ), S = Vr(p);
    if (S) {
      G(S);
      return;
    }
    de.current = !0, wn(!0), G("");
    try {
      if (await i(p) === !1) throw new Error("Could not save review.");
      vt(), ke("Review saved.");
    } catch (x) {
      G(
        "Could not save review. Your edits are still open. " + Yt(x)
      );
    } finally {
      Pn();
    }
  }
  async function ta() {
    if (!i || de.current) return;
    const p = ma(Ye.current, T.current), S = gn(Ye.current, {
      ...p,
      filter: { ...p.filter, page: 1 }
    });
    de.current = !0, wn(!0), Oe("");
    try {
      if (await i(S) === !1) throw new Error("Could not save review.");
      ke("Queue saved to this review.");
    } catch (x) {
      Oe("Could not save queue. " + Yt(x));
    } finally {
      Pn();
    }
  }
  const rt = B.performerScope, rn = (p) => {
    const { performerFocus: S, ...x } = T.current, Y = S && !("targetMode" in p || "performerIds" in p || "performerFilter" in p);
    Rt({
      ...x,
      ...Y ? { performerFocus: S } : {},
      filter: { ...x.filter, page: 1 },
      performerScope: { ...rt, ...p }
    });
  };
  async function Jt(p, S) {
    var oe;
    const x = wt.current;
    if (!Te(x)) return;
    (oe = be.current) == null || oe.controller.abort();
    const Y = {
      signature: ba(x),
      controller: new AbortController()
    };
    be.current = Y, Fn.current = "", ae(!0), Ce(null);
    try {
      const pe = await Gu(x, p, S, Y.controller.signal, {
        onProgress: (Ae) => {
          be.current === Y && k(Ae);
        }
      });
      be.current === Y && k(pe);
    } catch (pe) {
      be.current === Y && !Y.controller.signal.aborted && (Fn.current = Y.signature, Ce({ signature: Y.signature, message: Yt(pe) }));
    } finally {
      be.current === Y && (be.current = null, ae(!1));
    }
  }
  function Xn() {
    var p;
    (p = be.current) == null || p.controller.abort(), be.current = null, ae(!1), k((S) => S && { ...S, partial: !0, complete: !1 });
  }
  async function Zn(p) {
    var oe;
    const S = wt.current;
    if (!Te(S)) return;
    if (be.current) {
      Xn();
      return;
    }
    const x = ba(S);
    if (((oe = Kt.current) == null ? void 0 : oe.signature) !== x || Kt.current.partial) return;
    const Y = 1100 - (Date.now() - ye.current);
    Y > 0 && await new Promise((pe) => window.setTimeout(pe, Y));
    try {
      const pe = await bc(S, p);
      if (be.current) {
        Xn();
        return;
      }
      k(
        (Ae) => (Ae == null ? void 0 : Ae.signature) === x ? Ku(Ae, p, pe) : Ae
      );
    } catch {
      k(
        (pe) => (pe == null ? void 0 : pe.signature) === x ? { ...pe, partial: !0, complete: !1 } : pe
      );
    }
  }
  const na = B.performerFocus ? ct == null ? void 0 : ct.candidates.find((p) => p.id === B.performerFocus) : void 0, se = (qe == null ? void 0 : qe.id) === B.performerFocus ? qe : na ?? null;
  function mr(p) {
    if (de.current) return;
    const S = {
      ...T.current,
      performerFocus: p,
      filter: { ...T.current.filter, page: 1 }
    };
    Rt(S, S.startFrom === "end"), tn("items");
  }
  function En() {
    const { performerFocus: p, ...S } = T.current;
    Rt(
      { ...S, filter: { ...S.filter, page: 1 } },
      S.startFrom === "end"
    );
  }
  const er = $(null);
  er.current ?? (er.current = js());
  const kn = er.current, xn = $s(xe.actions), $r = ve(
    () => xe.actions.flatMap((p) => p.steps.flatMap((S) => S.tagIds)),
    [xe.actions]
  ), Ln = $(null);
  H(() => {
    const p = Ln.current, S = p == null ? void 0 : p.querySelector('[aria-current="true"]');
    if (!p || !S) return;
    const x = p.getBoundingClientRect(), Y = S.getBoundingClientRect();
    Y.top < x.top ? p.scrollTop -= x.top - Y.top : Y.bottom > x.bottom && (p.scrollTop += Y.bottom - x.bottom);
  }, [A == null ? void 0 : A.key, Mt]);
  const zt = $(null), tr = $(null);
  H(() => {
    var x, Y;
    const p = tr.current;
    if (!p) return;
    tr.current = null;
    const S = [...((x = zt.current) == null ? void 0 : x.querySelectorAll(".dq-partner")) ?? []];
    (Y = S.find((oe) => oe.dataset.partnerKey === p) ?? S[0]) == null || Y.focus();
  }, [A == null ? void 0 : A.key]);
  const Qt = Re || Be || $e || !!w, Ie = ve(
    () => w ? gn(w, ma(e, B)) : null,
    [w, e, B]
  ), Ir = ve(
    () => Ie != null && Er(lr(Ie)) !== Er(lr(e)),
    [Ie, e]
  );
  function ra() {
    A ? ln(u, A).then(Dt).catch((p) => Oe(Yt(p))) : Rt(T.current);
  }
  const Dn = dn ? /* @__PURE__ */ l("p", { role: "alert", children: [
    dn,
    " ",
    /* @__PURE__ */ r("button", { type: "button", disabled: Re, onClick: ra, children: A ? "Reload tags" : "Retry queue" })
  ] }) : null, nr = Re || Be || A != null && !ot, gr = Math.max(1, Number(B.filter.perPage) || 1), br = $(1);
  Be || (br.current = Math.max(1, Math.ceil(Qe / gr)));
  const Or = br.current, _n = rt && A ? z.filter(
    (p) => p.media.id === A.media.id && p.key !== A.key
  ) : [], Mr = A != null && A.occurrence && A.occurrence.performer.id === B.performerFocus ? (se == null ? void 0 : se.flags) ?? [] : A != null && A.occurrence ? ((aa = ct == null ? void 0 : ct.candidates.find((p) => p.id === A.occurrence.performer.id)) == null ? void 0 : aa.flags) ?? [] : [], rr = (p) => {
    var S;
    return p.title || ((S = p.files[0]) == null ? void 0 : S.basename) || `${u === "audio" ? "Audio" : "Video"} ${p.id}`;
  }, jn = A ? Xu(A.media, u) : "";
  return /* @__PURE__ */ l(
    "section",
    {
      className: `dq-review-workspace${u === "audio" ? " dq-audio" : ""}`,
      "aria-label": rt ? u === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : u === "audio" ? "Audio review" : "Video review",
      onClickCapture: (p) => {
        var Y;
        const S = p.target instanceof Element ? p.target.closest("button") : null, x = (S == null ? void 0 : S.getAttribute("aria-label")) ?? ((Y = S == null ? void 0 : S.textContent) == null ? void 0 : Y.trim()) ?? "";
        S && !S.closest(Go) && /^(Filters|Edit filter:|Edit criteria)/.test(x) && (bt.current = S);
      },
      children: [
        /* @__PURE__ */ r(
          nc,
          {
            name: e.name,
            description: e.description,
            entityType: _e(e),
            onBack: c == null ? void 0 : c.onBack,
            backDisabled: Qt || !!(c != null && c.busy),
            onEdit: w ? () => {
              var p;
              return (p = K.current) == null ? void 0 : p.focus();
            } : Et,
            editDisabled: !w && (Qt || !i || !!(c != null && c.busy)),
            editing: !!w,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ l("fieldset", { className: "dq-review-toolbar", disabled: Re || $e, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: u === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ r(
                  Gr,
                  {
                    filter: B.filter,
                    objectFilter: ce,
                    criteriaDefinitions: u === "audio" ? Xo : Ni,
                    customFieldEntityType: u,
                    totalCount: Qe,
                    sortOptions: u === "audio" ? rl : Zo,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(
                      rc,
                      {
                        page: Math.min(Math.max(1, qn || 1), Or),
                        pages: Or,
                        onPage: (p) => Rt({
                          ...T.current,
                          filter: Lt(
                            { ...T.current.filter, page: p },
                            u
                          )
                        })
                      }
                    ),
                    onFilterChange: (p) => {
                      (p.sort !== T.current.filter.sort || p.direction !== T.current.filter.direction) && (p = { ...p, sorts: void 0 }), Rt({
                        ...T.current,
                        filter: Lt(p, u)
                      });
                    },
                    onObjectFilterChange: (p) => {
                      Rt({
                        ...T.current,
                        objectFilter: ic(
                          p,
                          ut,
                          T.current.objectFilter
                        ),
                        filter: { ...T.current.filter, page: 1 }
                      });
                    }
                  }
                )
              ] })
            ),
            trailing: /* @__PURE__ */ l(ue, { children: [
              rt && /* @__PURE__ */ r(
                _u,
                {
                  scope: rt,
                  disabled: Re || $e,
                  editing: !!w,
                  onChange: rn,
                  onEditCriteria: () => vn(!0)
                }
              ),
              Te(Gt) && t && /* @__PURE__ */ r(
                Iu,
                {
                  review: Gt,
                  disabled: yt || !!w,
                  performerFlags: B.performerFocus ? se == null ? void 0 : se.flags : void 0,
                  trees: xn,
                  onOpen: () => {
                    de.current = !0, wn(!0);
                  },
                  onWrite: () => {
                    ye.current = Date.now();
                  },
                  onClose: (p) => {
                    if (p) {
                      ye.current = Date.now();
                      const S = T.current.performerFocus;
                      S ? Zn(S) : Xn(), Tt((x) => x + 1), new Promise((x) => window.setTimeout(x, 1100)).then(() => {
                        Pn(), Ve.current && (E.current || en(!0), P((x) => x + 1));
                      });
                    } else Pn();
                  }
                }
              ),
              (c == null ? void 0 : c.onGrid) && /* @__PURE__ */ r(
                ac,
                {
                  mode: "single",
                  disabled: Qt || !!c.busy,
                  onChange: () => {
                    var p;
                    return (p = c.onGrid) == null ? void 0 : p.call(c);
                  }
                }
              ),
              (c == null ? void 0 : c.moreItems) && /* @__PURE__ */ r(
                Bi,
                {
                  disabled: Qt,
                  items: c.moreItems({
                    onSelect: Et,
                    disabled: !i
                  })
                }
              )
            ] }),
            chipsStart: B.performerFocus ? /* @__PURE__ */ l("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ r(
                Sr,
                {
                  performer: {
                    id: B.performerFocus,
                    name: (se == null ? void 0 : se.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ l("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ r("strong", { children: (se == null ? void 0 : se.name) ?? `performer ${B.performerFocus}` })
              ] }),
              se != null && se.flags.length ? /* @__PURE__ */ l(
                "span",
                {
                  className: "dq-focus-flag",
                  title: `Flagged: ${se.flags.join(", ")}`,
                  children: [
                    /* @__PURE__ */ r(ya, { "aria-hidden": "true" }),
                    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
                      "Flagged: ",
                      se.flags.join(", ")
                    ] })
                  ]
                }
              ) : null,
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: yt,
                  onClick: En,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            chipsEnd: w ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : We ? /* @__PURE__ */ l(ue, { children: [
              /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Queue differs from the saved review" }),
              Yn && /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  className: "dq-text-button",
                  title: "Save the current queue criteria to this review",
                  disabled: yt || !i,
                  onClick: () => void ta(),
                  children: [
                    /* @__PURE__ */ r(ds, { "aria-hidden": "true" }),
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
                  disabled: yt,
                  onClick: () => {
                    const p = fr(e);
                    Rt(p, p.startFrom === "end");
                  },
                  children: [
                    /* @__PURE__ */ r(us, { "aria-hidden": "true" }),
                    "Reset"
                  ]
                }
              )
            ] }) : void 0
          }
        ),
        c == null ? void 0 : c.notices,
        /* @__PURE__ */ l("div", { className: "dq-review-area", children: [
          w && Ie && /* @__PURE__ */ r(
            tc,
            {
              drawerRef: K,
              draft: Ie,
              onChange: (p) => I(p),
              direction: B.startFrom,
              onDirectionChange: (p) => Rt({ ...T.current, startFrom: p }),
              tagGroups: Yu,
              trees: xn,
              saving: Re,
              saveDisabled: Be,
              error: F,
              dirty: Ir,
              criteriaChanged: Yn,
              notices: Dn && /* @__PURE__ */ r("div", { className: "dq-review-feedback", children: Dn }),
              onSave: () => void Vt(),
              onCancel: Sn
            }
          ),
          /* @__PURE__ */ r("div", { className: "dq-review-main", children: /* @__PURE__ */ l("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ l("div", { className: "dq-review-stage", children: [
              A ? /* @__PURE__ */ l(ue, { children: [
                /* @__PURE__ */ l("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ r("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ l(
                    "a",
                    {
                      href: `/${u}/${A.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${g.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ r("span", { children: rr(A.media) }),
                        /* @__PURE__ */ r(fs, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  jn && /* @__PURE__ */ r("span", { className: "dq-stage-meta", children: jn })
                ] }),
                /* @__PURE__ */ l("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ r("div", { className: "dq-player-frame", children: [A, Se].filter(Boolean).map((p) => {
                    var Y, oe, pe, Ae, ht;
                    const S = p, x = S.key === A.key;
                    return /* @__PURE__ */ r(
                      "div",
                      {
                        className: x ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": x ? void 0 : !0,
                        inert: x ? void 0 : !0,
                        children: u === "audio" ? /* @__PURE__ */ r(
                          al,
                          {
                            streamUrl: oi("audio", S.media.id),
                            format: ((Y = S.media.files[0]) == null ? void 0 : Y.format) ?? "",
                            title: N(S.media),
                            coverUrl: x ? ii("audio", S.media) : void 0,
                            duration: ((oe = S.media.files[0]) == null ? void 0 : oe.duration) ?? 0,
                            autostart: x && tt === S.media.id
                          }
                        ) : /* @__PURE__ */ r(
                          es,
                          {
                            videoId: S.media.id,
                            streamUrl: oi("video", S.media.id),
                            posterUrl: x ? ii("video", S.media) : void 0,
                            duration: ((pe = S.media.files[0]) == null ? void 0 : pe.duration) ?? 0,
                            format: (Ae = S.media.files[0]) == null ? void 0 : Ae.format,
                            audioCodec: (ht = S.media.files[0]) == null ? void 0 : ht.audioCodec,
                            extensionSurface: x ? "quick-view" : void 0,
                            autostart: x && tt === S.media.id,
                            keyboardShortcutsEnabled: x,
                            showAbLoop: x,
                            clip: S.media.parentVideoId != null ? {
                              start: S.media.clipStartSec ?? 0,
                              end: S.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${S.media.id}:${Ne}`
                    );
                  }) }),
                  u === "audio" && /* @__PURE__ */ r(
                    Mu,
                    {
                      details: A.media.details,
                      label: g.one
                    },
                    A.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ r("p", { role: "status", className: "dq-stage-status", children: Be ? "Loading review…" : Qe ? "Reached the end in this direction." : `No matching ${g.many}.` }),
              xe.actions.length > 0 ? /* @__PURE__ */ r(
                Cd,
                {
                  actions: xe.actions,
                  mediaKind: u,
                  isDisabled: (p) => $e || pt(p),
                  busy: nr,
                  tags: ot,
                  trees: xn,
                  preview: kn,
                  onApply: (p, S) => void Bt(p, S),
                  onFind: () => Ot(!0),
                  findDisabled: $e || !!w,
                  paused: !!w,
                  waitForGroups: qo(xe),
                  stayOnTap: nt,
                  onStayOnTapChange: On
                }
              ) : Te(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ l(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || Re || $e || !ot || !!w || !A,
                  children: [
                    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((p) => /* @__PURE__ */ l("label", { children: [
                      /* @__PURE__ */ r(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: Ut.includes(p),
                          onChange: (S) => je(
                            e.occurrence.multiple ? S.target.checked ? [...Ut, p] : Ut.filter((x) => x !== p) : [p]
                          )
                        }
                      ),
                      Ct[p] ?? "Loading tag…"
                    ] }, p)),
                    /* @__PURE__ */ l("div", { className: "dq-row", children: [
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => je([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void Bt(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void Bt(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ l("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ l("div", { className: "dq-panel-body", ref: zt, children: [
                A && /* @__PURE__ */ l(ue, { children: [
                  /* @__PURE__ */ l("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ l("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: A.occurrence ? A.occurrence.performer.name : `this ${g.one}` })
                    ] }),
                    /* @__PURE__ */ l("div", { className: "dq-reviewing-who", children: [
                      A.occurrence && /* @__PURE__ */ r(Sr, { performer: A.occurrence.performer }),
                      /* @__PURE__ */ l("div", { children: [
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: A.occurrence ? A.occurrence.performer.name : `This ${g.one}` }),
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-note", children: rt ? `Tags apply to this performer in this ${g.queue}` : `Tags apply to the whole ${g.one}` })
                      ] })
                    ] }),
                    Mr.length > 0 && /* @__PURE__ */ l("p", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
                      /* @__PURE__ */ r(ya, { "aria-hidden": "true" }),
                      "Flagged: ",
                      Mr.join(", ")
                    ] })
                  ] }),
                  _n.length > 0 && /* @__PURE__ */ l(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${g.queue}`,
                      children: [
                        /* @__PURE__ */ l("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          g.queue
                        ] }),
                        /* @__PURE__ */ r("div", { className: "dq-partners", children: _n.map((p) => {
                          var S, x, Y;
                          return /* @__PURE__ */ l(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (S = p.occurrence) == null ? void 0 : S.performer.name,
                              "aria-label": (x = p.occurrence) == null ? void 0 : x.performer.name,
                              "data-partner-key": p.key,
                              disabled: yt,
                              onClick: () => {
                                tr.current = A.key, fn(p), Oe("");
                              },
                              children: [
                                p.occurrence && /* @__PURE__ */ r(Sr, { performer: p.occurrence.performer }),
                                /* @__PURE__ */ r("span", { children: (Y = p.occurrence) == null ? void 0 : Y.performer.name })
                              ]
                            },
                            p.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ r(
                    ef,
                    {
                      tags: ot,
                      preview: kn,
                      showPreview: !$e,
                      trees: xn,
                      actionTagIds: $r,
                      label: `Current ${rt ? "occurrence" : g.one} tags`
                    }
                  ),
                  $e && /* @__PURE__ */ l(
                    "fieldset",
                    {
                      ref: Hn,
                      disabled: Re,
                      className: "dq-panel-section dq-tag-editor",
                      children: [
                        /* @__PURE__ */ l("legend", { className: "dq-eyebrow", children: [
                          "Edit ",
                          rt ? "occurrence" : g.one,
                          " tags"
                        ] }),
                        /* @__PURE__ */ r(
                          Rn,
                          {
                            entityType: "tag",
                            values: st,
                            onChange: It,
                            placeholder: "Choose tags for this item...",
                            allowCreate: !1
                          }
                        ),
                        /* @__PURE__ */ l("div", { className: "dq-row", children: [
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button primary",
                              disabled: !ot,
                              onClick: () => void Bt(void 0, !0, !0),
                              children: "Save"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              disabled: !ot,
                              onClick: () => void Bt(void 0, !1, !0),
                              children: "Save & next"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              onClick: () => {
                                yn(!1), requestAnimationFrame(() => {
                                  var p;
                                  return (p = _t.current) == null ? void 0 : p.focus();
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
                Te(Xe) && B.performerFocus && /* @__PURE__ */ r(
                  ku,
                  {
                    review: Xe,
                    performerId: B.performerFocus,
                    revision: Ue
                  }
                )
              ] }),
              /* @__PURE__ */ l("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ l("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !w && Dn,
                  it && /* @__PURE__ */ r("p", { role: "status", children: it })
                ] }),
                !t && /* @__PURE__ */ r("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                A && /* @__PURE__ */ l("div", { className: "dq-panel-actions", "aria-busy": nr || void 0, children: [
                  /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      ref: _t,
                      className: "dq-button",
                      disabled: yt || !!w || !t || !ot,
                      onClick: () => {
                        dt.current = [...ot.ids], It([...ot.ids]), yn(!0);
                      },
                      children: [
                        /* @__PURE__ */ r(ss, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: yt || !!w,
                      onClick: () => void Bt(),
                      children: [
                        /* @__PURE__ */ r(bl, { "aria-hidden": "true" }),
                        "Skip",
                        rt ? " performer" : ` ${g.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ l("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              rt && /* @__PURE__ */ l(
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
                        onClick: () => tn("items"),
                        children: u === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": Mt === "performers",
                        onClick: () => tn("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              rt && Mt === "performers" ? /* @__PURE__ */ r(
                Fu,
                {
                  ranking: (ct == null ? void 0 : ct.signature) === Le ? ct : null,
                  busy: M,
                  error: (X == null ? void 0 : X.signature) === Le ? X.message : "",
                  focus: B.performerFocus,
                  disabled: yt,
                  labels: g,
                  onFocus: mr,
                  onMore: () => {
                    const p = Kt.current;
                    p && Jt(p, p.limit + Ha);
                  },
                  onRefresh: () => {
                    k(null), Jt(null, Ha);
                  }
                }
              ) : /* @__PURE__ */ r("div", { className: "dq-queue-list", ref: Ln, children: z.map((p) => {
                var x;
                const S = (A == null ? void 0 : A.key) === p.key;
                return /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: y(p),
                    "aria-label": y(p),
                    "aria-current": S ? "true" : void 0,
                    disabled: yt,
                    onClick: () => {
                      fn(p), Oe(""), ke("");
                    },
                    children: [
                      /* @__PURE__ */ r(Zu, { media: p.media, kind: u }),
                      /* @__PURE__ */ l("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: N(p.media) }),
                        /* @__PURE__ */ l("span", { className: "dq-queue-row-meta", children: [
                          p.occurrence && /* @__PURE__ */ l(ue, { children: [
                            /* @__PURE__ */ r(Sr, { performer: p.occurrence.performer }),
                            /* @__PURE__ */ r("span", { className: "dq-queue-row-performer", children: p.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ r("span", { className: "dq-queue-row-detail", children: [
                            p.media.date,
                            p.occurrence ? "" : (x = p.media.files[0]) != null && x.duration ? ts(p.media.files[0].duration) : ""
                          ].filter(Boolean).join(" · ") })
                        ] })
                      ] })
                    ]
                  },
                  p.key
                );
              }) })
            ] })
          ] }) })
        ] }),
        rt && /* @__PURE__ */ r(
          il,
          {
            open: kt,
            onClose: () => vn(!1),
            criteria: vi,
            activeFilter: rt.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (p) => {
              vn(!1), rn({ performerFilter: p });
            }
          }
        ),
        jt && /* @__PURE__ */ r(
          Ui,
          {
            actions: e.actions,
            trees: xn,
            isDisabled: (p) => pt(p),
            tapStays: un && nt,
            onApply: (p, S) => {
              Ot(!1), Bt(p, S);
            },
            onClose: () => Ot(!1)
          }
        )
      ]
    }
  );
}
const qc = "data-quality.reviews-sort.v1", nf = { sort: "name", direction: "asc" };
function rf() {
  try {
    const e = JSON.parse(localStorage.getItem(qc) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return nf;
}
function af(e) {
  try {
    localStorage.setItem(
      qc,
      JSON.stringify({ sort: e.sort, direction: e.direction })
    );
  } catch {
  }
}
function Sc(e, t, n, a) {
  const i = a === "asc" ? 1 : -1;
  return [...e].sort((o, s) => {
    if (n === "count") {
      const c = t[o.id], d = t[s.id], h = typeof c == "number", u = typeof d == "number";
      if (h !== u) return h ? -1 : 1;
      if (h && u && c !== d)
        return (c - d) * i;
    }
    return o.name.localeCompare(s.name, void 0, { numeric: !0, sensitivity: "base" }) * i;
  });
}
function Ya(e, t) {
  const n = _e(e), a = bn(Ti(n)), i = n === "tag" ? "tag" : Te(e) ? a.queue : a.one;
  return t === 1 ? i : `${i}s`;
}
function of({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ l(ue, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      Ya(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ l(ue, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      "Matching ",
      Ya(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ l(ue, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      Ya(e, t)
    ] })
  ] });
}
function sf({
  reviews: e,
  counts: t,
  sort: n,
  direction: a,
  onSortChange: i,
  onDirectionChange: o,
  storage: s,
  canConfigure: c,
  busy: d,
  headingRef: h,
  notices: u,
  onOpen: g,
  onNew: m,
  onImport: N,
  onExportAll: y,
  rowMenuItems: q
}) {
  const E = $(null), w = ve(
    () => Sc(e, t, n, a),
    [e, t, n, a]
  ), I = e.every((G) => t[G.id] !== void 0), F = a === "asc" ? "ascending" : "descending";
  return /* @__PURE__ */ l("div", { className: "dq-reviews-page", children: [
    /* @__PURE__ */ l("header", { className: "dq-reviews-header", children: [
      /* @__PURE__ */ r("h1", { ref: h, tabIndex: -1, children: "Data Quality" }),
      /* @__PURE__ */ l("div", { className: "dq-reviews-header-actions", children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "dq-header-button",
            title: "Add the reviews in a review file",
            disabled: !c || d,
            onClick: () => {
              var G;
              return (G = E.current) == null ? void 0 : G.click();
            },
            children: [
              /* @__PURE__ */ r(wl, { "aria-hidden": "true" }),
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
            onChange: (G) => {
              var _;
              const K = (_ = G.target.files) == null ? void 0 : _[0];
              G.target.value = "", K && N(K);
            }
          }
        ),
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "dq-header-button",
            title: "Download every review as one review file",
            disabled: !e.length,
            onClick: y,
            children: [
              /* @__PURE__ */ r(ps, { "aria-hidden": "true" }),
              "Export all"
            ]
          }
        ),
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "dq-header-button dq-header-button-primary",
            disabled: !c || d,
            onClick: m,
            children: [
              /* @__PURE__ */ r(Si, { "aria-hidden": "true" }),
              "New review"
            ]
          }
        )
      ] })
    ] }),
    u,
    e.length ? /* @__PURE__ */ l("section", { className: "dq-reviews", "aria-label": "Reviews", children: [
      /* @__PURE__ */ l("div", { className: "dq-reviews-bar", children: [
        /* @__PURE__ */ l("p", { className: "dq-reviews-summary", children: [
          e.length === 1 ? "1 review" : `${e.length.toLocaleString()} reviews`,
          " ·",
          " ",
          s
        ] }),
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: I ? e.some((G) => t[G.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
        /* @__PURE__ */ l("div", { className: "dq-reviews-sort", children: [
          /* @__PURE__ */ l("label", { children: [
            /* @__PURE__ */ r("span", { children: "Sort by" }),
            /* @__PURE__ */ l(
              "select",
              {
                className: "dq-select",
                value: n,
                onChange: (G) => i(G.target.value),
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
              "aria-label": `Sort direction: ${F}`,
              title: `Sort direction: ${F}`,
              onClick: () => o(a === "asc" ? "desc" : "asc"),
              children: a === "asc" ? /* @__PURE__ */ r(yl, { "aria-hidden": "true" }) : /* @__PURE__ */ r(vl, { "aria-hidden": "true" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ l("table", { className: "dq-reviews-table", children: [
        /* @__PURE__ */ r("thead", { children: /* @__PURE__ */ l("tr", { children: [
          /* @__PURE__ */ r("th", { scope: "col", "aria-sort": n === "name" ? F : void 0, children: "Review" }),
          /* @__PURE__ */ r("th", { scope: "col", className: "dq-reviews-type", children: "Type" }),
          /* @__PURE__ */ r(
            "th",
            {
              scope: "col",
              className: "dq-reviews-count",
              "aria-sort": n === "count" ? F : void 0,
              children: "Matching"
            }
          ),
          /* @__PURE__ */ r("th", { scope: "col", className: "dq-reviews-actions", children: /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Actions" }) })
        ] }) }),
        /* @__PURE__ */ r("tbody", { children: w.map((G) => {
          const K = _e(G);
          return /* @__PURE__ */ l("tr", { children: [
            /* @__PURE__ */ r("td", { children: /* @__PURE__ */ l(
              "a",
              {
                className: "dq-reviews-link",
                href: `?review=${encodeURIComponent(G.id)}`,
                "data-review-id": G.id,
                onClick: (_) => {
                  _.button !== 0 || _.metaKey || _.ctrlKey || _.shiftKey || _.altKey || (_.preventDefault(), g(G.id));
                },
                children: [
                  /* @__PURE__ */ r("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ r(Xs, { entityType: K }) }),
                  /* @__PURE__ */ l("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ r("span", { className: "dq-reviews-name", children: G.name }),
                    G.description && /* @__PURE__ */ r("span", { className: "dq-reviews-description", title: G.description, children: G.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-type", children: Ys[K] }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-count", children: /* @__PURE__ */ r(of, { review: G, count: t[G.id] }) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ r(Bi, { label: `Actions for ${G.name}`, items: q(G) }) })
          ] }, G.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ l("div", { className: "dq-empty", children: [
      /* @__PURE__ */ r(Aa, { "aria-hidden": "true" }),
      /* @__PURE__ */ r("p", { children: "No reviews yet." }),
      /* @__PURE__ */ r("p", { children: c ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function Ec(e, { id: t, name: n, description: a }) {
  const i = { id: t, name: n, description: a }, o = (s, c = {}) => ({
    filter: { page: 1, perPage: 40, ...s },
    objectFilter: {},
    displayMode: "grid",
    searchMode: "text",
    ...c
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
function cf({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: a
}) {
  const { review: i, saving: o, error: s } = e, c = $(null), d = $(null), h = $(o);
  h.current = o;
  const u = $(null), g = Nt();
  H(() => {
    var y;
    return u.current ?? (u.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), c.current && !c.current.open && c.current.showModal(), (y = d.current) == null || y.focus(), () => {
      var q;
      (q = u.current) != null && q.isConnected && u.current.focus({ preventScroll: !0 });
    };
  }, []);
  const m = $(o);
  H(() => {
    var E, w;
    const y = document.activeElement, q = !y || y === document.body || !((E = c.current) != null && E.contains(y));
    s && (!i.name.trim() || m.current && !o && q) && ((w = d.current) == null || w.focus()), m.current = o;
  }, [s, o]);
  const N = () => {
    h.current || a();
  };
  return /* @__PURE__ */ r(
    "dialog",
    {
      ref: c,
      className: "dq-form-dialog",
      "aria-labelledby": g,
      "aria-modal": "true",
      onCancel: (y) => {
        y.preventDefault(), N();
      },
      onClose: () => {
        var y;
        h.current ? (y = c.current) == null || y.showModal() : a();
      },
      children: /* @__PURE__ */ l(
        "form",
        {
          onSubmit: (y) => {
            y.preventDefault(), h.current || n();
          },
          children: [
            /* @__PURE__ */ l("header", { className: "dq-form-dialog-header", children: [
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
                  children: /* @__PURE__ */ r(Qr, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ l("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ r("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              s && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: s }),
              /* @__PURE__ */ l("fieldset", { className: "dq-form-dialog-fields", disabled: o, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ r(
                  ec,
                  {
                    review: i,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (y) => {
                      y !== _e(i) && t(Ec(y, i));
                    },
                    nameRef: d
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ l("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ r("button", { type: "button", className: "dq-text-button", onClick: () => Ki(i), children: "Export draft" }),
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
const lf = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function df(e, t, n, a) {
  return Nc(
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
function Ko(e, t) {
  return _e(t) === "video" && ea(t.view.objectFilter, e.view.objectFilter).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function Bo(e, t) {
  return ur(
    JSON.parse(Vn(lr(e))),
    JSON.parse(Vn(lr(t)))
  );
}
const Xa = 180;
function Vo(e) {
  return _e(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function Jo(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function zo() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Za(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  Ia.forEach((i) => n.delete(i)), e ? n.set("review", e) : n.delete("review");
  const a = n.toString();
  vc(`${window.location.pathname}${a ? `?${a}` : ""}`, { openingFromList: t });
}
function uf(e) {
  return Lt({ ...e, page: 1 });
}
function kc(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function qr(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const ff = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(Ei, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ r(Sl, { "aria-hidden": "true" }) }
], pf = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(Ei, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ r(ql, { "aria-hidden": "true" }) }
], Qo = [], Cc = "(min-width: 900px)";
function hf(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(Cc);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function mf() {
  return typeof window.matchMedia == "function" && window.matchMedia(Cc).matches;
}
function gf({
  onNavigate: e
}) {
  const [t, n] = C([]), [a] = C(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [i, o] = C(""), [s, c] = C(!0), [d, h] = C(""), [u, g] = C(!1), [m, N] = C(!1), [y, q] = C(!1), [E, w] = C(!1), [I, F] = C([]), [G, K] = C(""), [_, Z] = C(!0), [te, ne] = C("account"), [ie, D] = C(""), [B, v] = C(""), [T, J] = C(!1), [P, Q] = C(!1), [z, j] = C(""), [A, Fe] = C(zo), we = $(A);
  we.current = A;
  const [tt, U] = C({}), Ne = $(tt);
  Ne.current = tt;
  const Ke = $(t);
  Ke.current = t;
  const Se = $(s);
  Se.current = s;
  const Qe = $(!1), Ee = $(!0);
  H(() => (Ee.current = !0, () => {
    Ee.current = !1;
  }), []);
  const [Be, en] = C(!A);
  Be !== !A && (en(!A), A || U({}));
  const [Re, wn] = C(rf), { sort: de, direction: Ve } = Re, qt = (f) => {
    const b = { ...Re, ...f };
    wn(b), af(b);
  }, dn = $(null), Oe = $(null), [it, ke] = C(null), [ot, Dt] = C(!1), [$e, yn] = C(!1), [st, It] = C(null), [dt, _t] = C(null), bt = !!st || !!dt, Hn = $(bt);
  Hn.current = bt;
  const kt = ot || !!dt || $e, [vn, jt] = C(0), [Ot, un] = C(!1), [me, St] = C(null), nt = $(null), On = $(null), Ut = $(null), [je, Ct] = C(
    null
  ), re = t.find((f) => f.id === A) ?? null, O = ve(
    () => (je == null ? void 0 : je.id) === A && re ? { ...re, view: {
      ...re.view,
      filter: je.view.filter,
      objectFilter: je.view.objectFilter,
      searchMode: je.view.searchMode,
      startFrom: je.view.startFrom
    } } : re,
    [je, A, re]
  ), ye = O ? _e(O) : "video", ut = Ti(ye), Mn = O ? Te(O) : !1, ce = ye === "video" ? O : null, At = Mn && !!(O != null && O.actions.some(Qn)), Ye = !!ce || ye === "audio" || At, [xe, Xe] = C(null), Gt = (xe == null ? void 0 : xe.id) === (O == null ? void 0 : O.id) ? xe == null ? void 0 : xe.mode : (O == null ? void 0 : O.view.reviewMode) ?? "single", Ze = Mn || ye === "audio" || ye === "video" && Gt === "single", [wt, Mt] = C(0), tn = $(-1), ct = $(!1), hr = $(Ze);
  hr.current = Ze, H(() => {
    const f = () => {
      const b = hr.current;
      if (!b && kn.current) {
        ct.current = !0;
        return;
      }
      tn.current = -1, ro(), b || Mt((R) => R + 1);
    };
    return window.addEventListener("popstate", f), () => window.removeEventListener("popstate", f);
  }, []);
  const Kt = ut === "audio" ? m : u, Fn = ye === "tag" ? "Tag" : ut === "audio" ? "Audio" : "Video", k = ye === "tag" ? y : Kt, M = $(
    null
  ), ae = Bu(ce), [X, Ce] = C({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [be, Le] = C({
    page: 1,
    perPage: 40
  }), [Ue, Tt] = C({ items: [], totalCount: 0 }), [qe, nn] = C(A);
  qe !== A && (nn(A), Tt({ items: [], totalCount: 0 }), Q(!1));
  const [fe, Nn] = C(!1), [We, Yn] = C(""), [yt, qn] = C(!1), [Rt, Pn] = C(!1), [lt, Ft] = C(() => /* @__PURE__ */ new Set()), fn = $(lt);
  fn.current = lt;
  const pn = $(/* @__PURE__ */ new Map()), Bt = (O == null ? void 0 : O.view.selectAllOnLoad) === !0, [ft, pt] = C(null), Et = $(ft);
  Et.current = ft;
  const [vt, Sn] = C(!1), Vt = $(vt);
  Vt.current = vt;
  const ta = $(null), [rt, rn] = C(!1), [Jt, Xn] = C("grid"), [Zn, na] = C(Xa), [se, mr] = C(!1), [En, er] = C(!1), kn = $(!1), [xn, $r] = C(""), [Ln, zt] = C(""), [tr, Qt] = C(""), [Ie, Ir] = C(null), [ra, Dn] = C(""), [nr, gr] = C(!1), [br, Or] = C({}), _n = $(/* @__PURE__ */ new Map()), Mr = $(null), rr = $(null), jn = !!O, aa = wi(hf, mf, () => !1) && jn, [p, S] = C({ top: 0, bottom: 0 });
  Zt(() => {
    if (!jn) return;
    const f = () => {
      const R = rr.current;
      if (!R) return;
      const L = Math.round(R.getBoundingClientRect().top + window.scrollY), W = R.closest("main"), V = W ? Math.round(parseFloat(getComputedStyle(W).paddingBottom) || 0) : 0;
      S(
        (ee) => ee.top === L && ee.bottom === V ? ee : { top: L, bottom: V }
      );
    };
    f();
    const b = typeof ResizeObserver > "u" ? null : new ResizeObserver(f);
    return b == null || b.observe(document.body), window.addEventListener("resize", f), () => {
      b == null || b.disconnect(), window.removeEventListener("resize", f);
    };
  }, [jn]);
  const [x, Y] = C(0), oe = $(null), pe = mn((f) => {
    var R;
    if ((R = oe.current) == null || R.disconnect(), oe.current = null, !f || typeof ResizeObserver > "u") return;
    const b = new ResizeObserver(
      () => Y(Math.round(f.getBoundingClientRect().height))
    );
    b.observe(f), oe.current = b;
  }, []), Ae = $(0), ht = $(0), Wt = $(null), Pt = $(null), et = $s(
    O && !Ze ? me ? [...O.actions, ...me.draft.actions] : O.actions : Qo
  ), Me = ve(
    () => me && O && re ? df(me.draft, O, X, re) : null,
    [me, O, X, re]
  ), $t = ve(
    () => O && re ? Nc(
      { ...re, view: { ...O.view, filter: { ...X, page: 1 } } },
      re
    ) : null,
    [O, re, X]
  ), Ge = ve(
    () => re ? Er(lr(re)) : "",
    [re]
  ), an = ve(
    () => $t != null && Er(lr($t)) !== Ge,
    [$t, Ge]
  ), wr = ve(
    () => Me != null && Er(lr(Me)) !== Ge,
    [Me, Ge]
  );
  H(() => {
    if (!Ln) return;
    const f = window.setTimeout(() => zt(""), 4e3);
    return () => window.clearTimeout(f);
  }, [Ln]), H(() => {
    if (!it || it.alert) return;
    const f = window.setTimeout(() => ke(null), 6e3);
    return () => window.clearTimeout(f);
  }, [it]), H(() => {
    const f = ce ? zi(ce.view.objectFilter) : [];
    if (Or({}), !f.length) return;
    const b = new AbortController();
    let R = !0;
    return Promise.all(
      f.map(async (L) => {
        var W;
        try {
          const V = await le(`/api/tags/${L}`, {
            signal: b.signal
          });
          return (W = V.name) != null && W.trim() ? [String(L), V.name] : null;
        } catch {
          return null;
        }
      })
    ).then((L) => {
      R && Or(
        Object.fromEntries(L.filter((W) => W !== null))
      );
    }), () => {
      R = !1, b.abort();
    };
  }, [ce == null ? void 0 : ce.id, ce == null ? void 0 : ce.view.objectFilter]);
  const Oa = ve(
    () => ce ? Qi(
      ce.view.objectFilter,
      br
    ) : (O == null ? void 0 : O.view.objectFilter) ?? {},
    [br, O, ce]
  ), Fr = mn(async () => {
    c(!0), h("");
    try {
      const f = await Ul();
      n(f.reviews), o(f.storageKey), g(f.canWriteVideos ?? f.canWrite), N(f.canWriteAudios ?? !1), q(f.canWriteTags ?? !1), w(f.canReadTagGroups ?? !1), Z(f.canConfigure ?? !0), ne(f.storage ?? "account"), D(f.storageNotice ?? ""), A && !f.reviews.some((b) => b.id === A) && (Fe(""), Za(""));
    } catch (f) {
      h(
        f instanceof Error ? f.message : "Could not load reviews."
      );
    } finally {
      c(!1);
    }
  }, [A]);
  H(() => {
    if (!E) {
      F([]), K("");
      return;
    }
    const f = new AbortController();
    return K(""), Zl(f.signal).then(F).catch((b) => {
      f.signal.aborted || K(
        b instanceof Error ? b.message : "Could not load tag groups."
      );
    }), () => f.abort();
  }, [E]), H(() => {
    Fr();
  }, []), H(() => {
    if (A || t.length === 0) return;
    const f = new AbortController();
    for (const b of t) {
      if (typeof Ne.current[b.id] == "number") continue;
      (Te(b) ? Wi(b, f.signal).then((L) => (L == null ? void 0 : L.length) === 0 ? { items: [], totalCount: 0 } : jr(Hi(b, L), { ...b.view.filter, page: 1, perPage: 1 }, f.signal)) : _e(b) === "tag" ? wo(
        b,
        Lt({ ...b.view.filter, page: 1, perPage: 1 }),
        f.signal
      ) : jr(
        b,
        Lt({ ...b.view.filter, page: 1, perPage: 1 }),
        f.signal
      )).then((L) => {
        f.signal.aborted || U((W) => ({
          ...W,
          [b.id]: L.totalCount
        }));
      }).catch(() => {
        f.signal.aborted || U((L) => ({ ...L, [b.id]: null }));
      });
    }
    return () => f.abort();
  }, [A, t]), Zt(() => {
    var R, L;
    const f = Oe.current;
    if (A || s || !f) return;
    Oe.current = null, (L = (f === "heading" ? null : [...((R = rr.current) == null ? void 0 : R.querySelectorAll("[data-review-id]")) ?? []].find(
      (W) => W.dataset.reviewId === f.reviewId
    )) ?? dn.current) == null || L.focus();
  }, [A, s, dt, t]);
  const Pr = $(0), Un = mn(async () => {
    const f = ++Pr.current;
    Ir(null), Dn("");
    try {
      const b = await (At ? Cs(ut) : ks(ut));
      f === Pr.current && Ir(b);
    } catch (b) {
      if (f !== Pr.current) return;
      Ir(null), Dn(
        "Tag assessment setup could not be checked. " + (b instanceof Error ? b.message : "Request failed.")
      );
    }
  }, [At, ut]);
  H(() => {
    Un();
  }, [Un]);
  const on = mn(
    async (f, b, R = !1, L = !1) => {
      var gt, De;
      const W = ++Ae.current;
      (gt = Wt.current) == null || gt.abort();
      const V = new AbortController();
      Wt.current = V, b = Lt(b);
      const ee = Number(b.page);
      R && (b = { ...b, page: 1 }), Ce(b), Pn(R), Nn(!0), Yn("");
      try {
        const Je = (Cn) => _e(f) === "tag" ? wo(
          f,
          Cn,
          V.signal
        ) : jr(
          f,
          Cn,
          V.signal
        );
        let ge = await Je(b);
        const He = Math.max(
          1,
          Math.ceil(ge.totalCount / Number(b.perPage))
        ), yr = R ? He : Math.min(ee, He);
        return Number(b.page) !== yr && (b = { ...b, page: yr }, ge = await Je(b)), W === Ae.current && (((De = Pt.current) == null ? void 0 : De.page) !== yr && (Pt.current = {
          page: yr,
          ids: new Set(ge.items.map((Cn) => Cn.id))
        }), Tt(ge), L && hn(
          () => new Set(ge.items.map((Cn) => Cn.id))
        ), Ce(b), Le(b)), ge;
      } catch (Je) {
        throw W === Ae.current && Yn(
          Je instanceof Error ? Je.message : "Could not load the review queue."
        ), Je;
      } finally {
        W === Ae.current && Nn(!1);
      }
    },
    []
  );
  H(() => {
    var b;
    if (ht.current += 1, tn.current = -1, Ae.current += 1, (b = Wt.current) == null || b.abort(), St(null), nt.current = null, Q(!1), j(""), v(""), J(!1), Ft(/* @__PURE__ */ new Set()), pn.current.clear(), pt(null), Sn(!1), mr(!1), kn.current = !1, $r(""), zt(""), Qt(""), Tt({ items: [], totalCount: 0 }), Pt.current = null, qn(!1), !O || Ze) {
      Nn(!1), Ct(null);
      return;
    }
    let f = !0;
    return Nn(!0), (async () => {
      let R = re ?? O;
      Ct(null);
      let L = null;
      const W = new URLSearchParams(window.location.search);
      if (_e(O) === "video" && Ia.some((De) => W.has(De)))
        try {
          const De = R;
          L = bi(De, W);
          const Je = gn(De, L.query);
          (L.query.startFrom !== (De.view.startFrom ?? "end") || !ur(
            JSON.parse(Vn(Je)),
            JSON.parse(Vn(gn(De, fr(De))))
          )) && (R = Je, Ct(R));
        } catch (De) {
          qn(!0), Yn(De instanceof Error ? De.message : "Could not read review URL."), Nn(!1);
          return;
        }
      let V = null;
      try {
        V = await Vl(i, O.id);
      } catch (De) {
        f && (J(!0), v(
          De instanceof Error ? De.message : "Could not load progress."
        ));
      }
      if (!f) return;
      const ee = (V == null ? void 0 : V.signature) === Vn(R) ? V : null, gt = L ? L.query.filter : ee ? Lt(ee.filter) : uf(R.view.filter);
      Ce(gt), Xn(
        ee ? Jo(ee.displayMode, _e(O)) : Vo(O)
      ), na(
        ee ? ee.cardSize ?? Xa : Xa
      );
      try {
        const De = await on(
          R,
          gt,
          L ? L.startAtEnd : !ee && R.view.startFrom !== "beginning",
          R.view.selectAllOnLoad === !0
        );
        if (!f) return;
        const Je = ho(
          De.items.map((ge) => ge.id),
          (ee == null ? void 0 : ee.focusedId) ?? null,
          (ee == null ? void 0 : ee.index) ?? 0
        );
        pt(Je), mt(Je);
      } catch {
      }
      f && (tn.current = wt, Q(!0), j(`${O.id}:${wt}`));
    })(), () => {
      var R;
      f = !1, ht.current++, Ae.current++, (R = Wt.current) == null || R.abort();
    };
  }, [O == null ? void 0 : O.id, Ze, wt]), H(() => {
    if (!(!vn || Ze || !O)) {
      if (yt) {
        jt(0);
        return;
      }
      se || me || En || z !== `${O.id}:${wt}` || (jt(0), Ga());
    }
  }, [
    vn,
    Ze,
    O == null ? void 0 : O.id,
    z,
    se,
    En,
    wt,
    yt
  ]), H(() => {
    !ce || Ze || !P || fe || We || se || ct.current || tn.current !== wt || Ur(ce.id, {
      filter: X,
      objectFilter: ce.view.objectFilter,
      searchMode: ce.view.searchMode,
      startFrom: ce.view.startFrom ?? "end"
    });
  }, [ce, Ze, P, fe, We, X, se, wt]);
  const he = ve(
    () => Ue.items.map((f) => f.id),
    [Ue.items]
  );
  H(() => {
    if (!P || !O || !i || fe || We || se || (je == null ? void 0 : je.id) === O.id || T || tn.current !== wt)
      return;
    const f = {
      version: 1,
      signature: Vn(O),
      filter: X,
      focusedId: ft,
      index: Math.max(0, he.indexOf(ft ?? -1)),
      displayMode: Jt,
      cardSize: Zn,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        i + ":progress:" + O.id,
        JSON.stringify(f)
      );
    } catch {
    }
    if (B) return;
    let b = !0;
    const R = window.setTimeout(() => {
      Jl(i, O.id, f).catch((L) => {
        b && v(
          "Progress is kept in this browser, but account sync failed. " + (L instanceof Error ? L.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      b = !1, window.clearTimeout(R);
    };
  }, [
    P,
    i,
    O,
    fe,
    We,
    se,
    X,
    ft,
    he,
    Jt,
    Zn,
    je,
    B,
    T,
    wt
  ]);
  const ia = Ue.items.find((f) => f.id === ft) ?? null, Ma = ye === "video" ? ia : null;
  vt && Ma && (ta.current = Ma);
  const ar = Ma ?? (vt ? ta.current : null), Ac = mo(lt, ft), Tc = he.length > 0 && he.every((f) => lt.has(f)), mt = mn((f, b = !0) => {
    f != null && window.requestAnimationFrame(() => {
      var L;
      if (Hn.current || Pl(document.activeElement) || (L = document.activeElement) != null && L.closest(".dq-drawer"))
        return;
      const R = _n.current.get(f);
      R == null || R.focus({ preventScroll: !0 }), b && (R == null || R.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  H(() => {
    P && !Vt.current && mt(Et.current);
  }, [P, mt]), H(() => {
    fe || !he.length || (Et.current == null || !he.includes(Et.current)) && (pt(he[0]), Vt.current || mt(he[0]));
  }, [mt, he, fe]);
  const hn = mn(
    (f) => {
      Ft((b) => {
        const R = f(b);
        for (const L of /* @__PURE__ */ new Set([...b, ...R]))
          b.has(L) !== R.has(L) && pn.current.set(
            L,
            (pn.current.get(L) ?? 0) + 1
          );
        return R;
      });
    },
    []
  ), Fa = mn(
    (f) => {
      if (!he.length) return;
      const b = Math.max(
        0,
        he.indexOf(Et.current ?? he[0])
      ), R = he[Math.max(0, Math.min(he.length - 1, b + f))];
      pt(R), Vt.current || mt(R);
    },
    [mt, he]
  ), oa = mn(
    async (f) => {
      const b = "steps" in f ? f.steps.length > 0 : f.effect.mode !== "SKIP", R = "effect" in f && f.effect.mode === "SET_TAG_GROUP" ? f.effect.tagGroupId : null, L = R != null && (!E || !I.some((ze) => ze.id === R)), W = "effect" in f && b && !E, V = mo(
        fn.current,
        Et.current
      );
      if (!O || kn.current || fe || We) return;
      const ee = b && !k ? `${Fn} write permission is required to apply ${f.label}.` : W || L ? `${f.label} needs a tag group that is unavailable.` : Qn(f) && (Ie == null ? void 0 : Ie.kind) !== "ready" ? `Set up tag assessments before applying ${f.label}.` : V.length ? "" : `Select or focus a ${ye} before applying ${f.label}.`;
      if (ee) {
        Qt(ee);
        return;
      }
      const gt = ++ht.current, De = O.id, Je = [...he], ge = Ue, He = Et.current, yr = new Set(fn.current), Cn = new Map(
        V.map((ze) => [ze, pn.current.get(ze) ?? 0])
      ), vr = () => gt === ht.current && O.id === De;
      kn.current = !0, mr(!0), $r(
        fn.current.size ? `${V.length} selected ${ye}s` : `the focused ${ye}`
      ), zt(""), Qt("");
      const co = ge.items.filter(
        (ze) => !V.includes(ze.id)
      ), zc = co.map((ze) => ze.id), lo = go(
        Je,
        zc,
        He,
        V.includes(He ?? -1)
      );
      Tt({
        items: co,
        totalCount: ge.totalCount
      }), Ft((ze) => {
        const xt = new Set(ze);
        for (const sn of V) xt.delete(sn);
        return xt;
      }), pt(lo), Vt.current || mt(lo);
      let Ka = !1;
      try {
        if ("effect" in f ? await ld(f, V) : await Ts(ut, f, V), Ka = !0, !vr()) return;
        Ft((ze) => {
          const xt = new Set(ze);
          for (const sn of V)
            (pn.current.get(sn) ?? 0) === Cn.get(sn) && xt.delete(sn);
          return xt;
        }), zt(
          `${f.label}: ${V.length} ${ye}${V.length === 1 ? "" : "s"} ${b ? "updated" : "skipped"}.`
        );
      } catch (ze) {
        if (!vr()) return;
        Tt(ge), Ft((xt) => {
          const sn = new Set(xt);
          for (const Ht of V)
            yr.has(Ht) && (pn.current.get(Ht) ?? 0) === Cn.get(Ht) && sn.add(Ht);
          return sn;
        }), pt(He), Vt.current || mt(He), Qt(
          ze instanceof Error ? ze.message : "Action failed."
        );
      }
      try {
        if (await nd(f), !vr()) return;
        const ze = new Set(V), xt = Bt && Je.length > 0 && Je.every((cn) => ze.has(cn)), sn = await on(O, X, !1, xt);
        if (!vr()) return;
        let Ht = sn.items.map((cn) => cn.id);
        const la = Pt.current, Qc = (la == null ? void 0 : la.page) === Number(X.page) && Ht.some((cn) => la.ids.has(cn)), Wc = (O.view.startFrom ?? "end") !== "beginning";
        if (sn.totalCount > 0 && Number(X.page) > 1 && (!Ht.length || Wc && !Qc)) {
          const cn = Math.max(1, Number(X.page) - 1), da = { ...X, page: cn };
          Ce(da), Ht = (await on(
            O,
            da,
            !1,
            xt
          )).items.map((Ba) => Ba.id), Ft(
            (Ba) => new Set([...Ba].filter((Hc) => Ht.includes(Hc)))
          );
          const fo = Ht.at(-1) ?? null;
          pt(fo), Vt.current || mt(fo);
        } else {
          Ft(
            (da) => new Set([...da].filter((uo) => Ht.includes(uo)))
          );
          const cn = go(
            Je,
            Ht,
            He,
            Ka && V.includes(He ?? -1)
          );
          pt(cn), Vt.current && cn == null && Sn(!1), Vt.current || mt(cn);
        }
      } catch (ze) {
        vr() && Qt(
          (xt) => `${xt ? `${xt} ` : ""}${Ka ? "The action completed, but " : ""}the queue could not be refreshed. ${ze instanceof Error ? ze.message : "Refresh failed."}`
        );
      } finally {
        vr() && (kn.current = !1, mr(!1), $r(""), ct.current && (ct.current = !1, ro(), Mt((ze) => ze + 1)));
      }
    },
    [
      k,
      E,
      I,
      ye,
      Ie,
      on,
      X,
      mt,
      he,
      Ue,
      fe,
      We,
      O
    ]
  );
  function Rc() {
    var R;
    if (Jt === "list") return 1;
    const f = (R = Mr.current) == null ? void 0 : R.firstElementChild, b = f ? getComputedStyle(f).gridTemplateColumns : "";
    return Math.max(1, b.split(" ").filter(Boolean).length);
  }
  const Zi = $(() => {
  });
  Zi.current = (f) => {
    var V;
    if (Ze || f.defaultPrevented || f.repeat || f.ctrlKey || f.altKey || f.metaKey || bt) return;
    const b = f.target, R = b instanceof Node && ((V = rr.current) == null ? void 0 : V.contains(b)) === !0, L = b === document.body || b === document.documentElement;
    if (!R && !L) return;
    if (rt) {
      f.key === "Escape" && (qr(f), rn(!1));
      return;
    }
    if (vt && f.key === "Escape") {
      qr(f), Sn(!1), mt(Et.current);
      return;
    }
    if (!Fl(b)) return;
    const W = Ml(b);
    if (f.key === "Escape") {
      qr(f), hn(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!vt && f.key === " " && W) {
      qr(f), ft != null && hn((ee) => ga(ee, ft));
      return;
    }
    if (!(se || fe) && !vt && f.key === "Enter" && ft != null && W) {
      if (ye !== "tag" && me) return;
      qr(f), ye === "tag" ? window.open(`/tag/${ft}`, "_blank", "noopener,noreferrer") : Sn(!0);
      return;
    }
  }, H(() => {
    const f = (b) => Zi.current(b);
    return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
  }, []);
  const eo = $(
    () => {
    }
  );
  eo.current = (f) => {
    var V;
    if (Ze || bt || vt || rt || se || fe || !he.length || f.defaultPrevented || f.repeat || f.ctrlKey || f.altKey || f.metaKey)
      return;
    const b = f.target, R = b instanceof Node && ((V = rr.current) == null ? void 0 : V.contains(b)) === !0, L = b === document.body || b === document.documentElement;
    if (!R && !L || !f.key.startsWith("Arrow") || !xl(b)) return;
    const W = Ll(f.key, Rc());
    W && (f.preventDefault(), R ? f.stopImmediatePropagation() : f.stopPropagation(), Fa(W));
  }, H(() => {
    const f = (b) => eo.current(b);
    return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
  }, []);
  const Gn = (me == null ? void 0 : me.saving) === !0 || En, Pa = se || fe && !P || Gn, $c = Di();
  Li({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!O && !Ze && !bt && !me && !vt && !rt && !We && (Ue.items.length > 0 || fe || se),
    actions: (O == null ? void 0 : O.actions) ?? Qo,
    onAction: (f) => {
      const b = O == null ? void 0 : O.actions[f];
      b && oa(b);
    },
    onFind: () => rn(!0),
    onSelectAll: () => hn((f) => Ol(f, he))
  }), H(() => rn(!1), [Ze, vt, O == null ? void 0 : O.id]);
  function to(f) {
    const b = "steps" in f ? f.steps.length > 0 : f.effect.mode !== "SKIP", R = "effect" in f && f.effect.mode === "SET_TAG_GROUP" ? f.effect.tagGroupId : null, L = R != null && !I.some((W) => W.id === R);
    return se || fe || !!We || b && !k || "effect" in f && b && (!E || L) || Qn(f) && (Ie == null ? void 0 : Ie.kind) !== "ready" || !Ac.length;
  }
  function xa(f) {
    Xe(null), jt(0), ke(null), Fe(f), Za(f, !!f && !O);
  }
  function no() {
    Qe.current || (yc() ? (Qe.current = !0, window.history.back()) : xa(""));
  }
  function ro() {
    const f = Qe.current;
    Qe.current = !1;
    let b = zo();
    b && !Se.current && !Ke.current.some((L) => L.id === b) && (b = "", Za(""));
    const R = we.current;
    b !== R && (jt(0), f || ke(null), !b && R && (Oe.current ?? (Oe.current = { reviewId: R }))), Fe(b);
  }
  function La() {
    Oe.current = "heading", ke(null), no();
  }
  function Da(f) {
    f !== A && xa(f), jt((b) => b + 1);
  }
  function Ic() {
    ke(null), It({
      review: Ec("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function Oc(f) {
    if (kt || !_) return;
    ke(null);
    const b = crypto.randomUUID();
    let R;
    const L = A;
    yn(!0);
    try {
      if (!await xr((V) => (R = Il(
        V.find((ee) => ee.id === f.id) ?? f,
        V,
        b
      ), [...V, R]))) throw new Error("Could not save reviews.");
      if (!Ee.current) return;
      we.current !== L ? ke({ text: `Saved the copy “${R.name}”.`, alert: !1 }) : Da(R.id);
    } catch (W) {
      ke({
        text: `“${f.name}” was not duplicated. ${sa(W)}`,
        alert: !0
      });
    } finally {
      yn(!1);
    }
  }
  async function Mc() {
    if (!st || st.saving) return;
    const f = { ...st.review, name: st.review.name.trim() }, b = Vr(f);
    if (b) {
      It({ ...st, error: b });
      return;
    }
    It({ ...st, saving: !0, error: "" });
    try {
      if (!await xr((R) => [...R, f]))
        throw new Error("Could not save reviews.");
      if (!Ee.current) return;
      It(null), Da(f.id);
    } catch (R) {
      It(
        (L) => L && {
          ...L,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + (R instanceof Error ? R.message : "Retry saving.")
        }
      );
    }
  }
  async function Fc() {
    if (!dt || dt.pending) return;
    const f = dt.review, b = Sc(t, tt, de, Ve).map((W) => W.id), R = b.filter((W) => W !== f.id), L = R[Math.min(b.indexOf(f.id), R.length - 1)];
    _t({ review: f, pending: !0 });
    try {
      if (!await xr((W) => W.filter((V) => V.id !== f.id)))
        throw new Error("Could not save reviews.");
      Oe.current = f.id !== A && L ? { reviewId: L } : "heading", ke({ text: `Deleted “${f.name}”.`, alert: !1 });
    } catch (W) {
      ke({ text: `“${f.name}” was not deleted. ${sa(W)}`, alert: !0 });
    } finally {
      _t(null);
    }
  }
  async function Pc(f) {
    if (!(kt || !_)) {
      ke(null), Dt(!0);
      try {
        const b = await au(f);
        let R = 0;
        if (b.length && !await xr((W) => {
          const V = ti(W, b);
          return R = V.length - W.length, R ? V : W;
        }))
          throw new Error("Could not save reviews.");
        const L = b.length - R;
        ke({
          alert: !1,
          text: b.length ? R ? `Imported ${R === 1 ? "1 review" : `${R} reviews`}.` + (L === 1 ? " 1 review already in the list stays as it is." : L ? ` ${L} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (b) {
        ke({ alert: !0, text: `Could not import “${f.name}”. ${sa(b)}` });
      } finally {
        Dt(!1);
      }
    }
  }
  function sa(f) {
    return f instanceof ws ? "Reviews changed in another browser. Reload the page to get them, then try again." : f instanceof Error ? f.message : "Try again.";
  }
  function ao(f) {
    const b = !_ || kt;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ r(rs, { "aria-hidden": "true" }),
        disabled: b,
        onSelect: () => void Oc(f)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ r(ps, { "aria-hidden": "true" }),
        onSelect: () => Ki(f)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ r(as, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: b,
        onSelect: () => {
          ke(null), _t({ review: f, pending: !1 });
        }
      }
    ];
  }
  function io(f, b) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ r(kr, { "aria-hidden": "true" }),
        ...b,
        disabled: b.disabled || $e
      },
      ...ao(f),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ r(Wr, { "aria-hidden": "true" }),
        separated: !0,
        disabled: $e,
        onSelect: La
      }
    ];
  }
  async function xr(f) {
    if (!i) return !1;
    let b = [];
    const R = await Bl(i, (ee) => {
      b = ee;
      const gt = f(ee);
      return gt === ee ? ee : gt.map(yf);
    });
    if (n(R), !Ee.current) return !0;
    const L = we.current;
    L && !R.some((ee) => ee.id === L) && no();
    const W = b.find((ee) => ee.id === L), V = R.find((ee) => ee.id === L);
    return V && W && ((V.view.reviewMode ?? "single") !== (W.view.reviewMode ?? "single") && Xe(null), V.view.displayMode !== W.view.displayMode && Xn(Vo(V))), !0;
  }
  function _a(f) {
    return xr((b) => wf(b, f));
  }
  function xc(f) {
    return _a(f).catch((b) => {
      throw we.current !== f.id && ja(f, b), b;
    });
  }
  function ja(f, b) {
    var L;
    if (!Ee.current) return;
    const R = ((L = Ke.current.find((W) => W.id === f.id)) == null ? void 0 : L.name) ?? f.name;
    ke({ text: `“${R}” was not saved. ${sa(b)}`, alert: !0 });
  }
  if (s)
    return /* @__PURE__ */ r(Wo, { label: "Loading reviews…" });
  if (d)
    return /* @__PURE__ */ l(ue, { children: [
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          onClick: () => void Ef().catch(
            (f) => h(
              "Could not export browser reviews. " + (f instanceof Error ? f.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ r(
        Ho,
        {
          message: d,
          onRetry: () => void Fr()
        }
      )
    ] });
  const Ua = /* @__PURE__ */ l(ue, { children: [
    ie && /* @__PURE__ */ r("p", { className: "dq-status", children: ie }),
    Ye && (Ie == null ? void 0 : Ie.kind) === "missing" && /* @__PURE__ */ l("div", { role: "status", className: "dq-status", children: [
      Ie.message,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: nr,
          onClick: () => {
            gr(!0), Dn(""), (At ? id(ut) : ad(ut)).then(Un).catch(
              (f) => Dn(
                `Could not create the ${At ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (f instanceof Error ? f.message : "Request failed.")
              )
            ).finally(() => gr(!1));
          },
          children: nr ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    Ye && ((Ie == null ? void 0 : Ie.kind) === "incompatible" || ra) && /* @__PURE__ */ l("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(An, {}),
      ra || (Ie == null ? void 0 : Ie.message),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: nr,
          onClick: () => {
            gr(!0), Un().finally(
              () => gr(!1)
            );
          },
          children: nr ? "Checking…" : "Check again"
        }
      )
    ] }),
    a && /* @__PURE__ */ l("details", { children: [
      /* @__PURE__ */ r("summary", { children: "Unassigned legacy browser reviews" }),
      /* @__PURE__ */ r("p", { children: "These old reviews have no account owner. They have not been copied into this account. Export them for recovery, then import the reviews only into the intended account. The original data and deletion history stay in this browser." }),
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const f = localStorage.getItem("page-videos") ?? "[]", b = URL.createObjectURL(
              new Blob([f], { type: "application/json" })
            ), R = document.createElement("a");
            R.href = b, R.download = "data-quality-unassigned-legacy-reviews.json", R.click(), URL.revokeObjectURL(b);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    B && /* @__PURE__ */ l("p", { role: "alert", children: [
      B,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: () => {
            v(""), J(!1);
          },
          children: T ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    it && (it.alert ? /* @__PURE__ */ l("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(An, { "aria-hidden": "true" }),
      it.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ r("p", { className: "dq-status", "aria-hidden": "true", children: it.text })
    ))
  ] });
  return /* @__PURE__ */ l(
    "div",
    {
      ref: rr,
      className: `data-quality-page${jn ? " dq-page-fit" : ""}`,
      style: jn ? {
        "--dq-fit-top": `${p.top}px`,
        "--dq-fit-bottom": `${p.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ r("p", { className: "dq-sr-only", "aria-live": "polite", children: it && !it.alert ? it.text : "" }),
        O && Ze ? /* @__PURE__ */ r(
          tf,
          {
            review: re ?? O,
            canWrite: Mn ? y : Kt,
            canAssess: (Ie == null ? void 0 : Ie.kind) === "ready" && Kt,
            onBusy: mr,
            editRequest: vn,
            onEditRequestHandled: () => jt(0),
            onSaveDefaults: _ ? xc : void 0,
            pageControls: {
              onBack: La,
              moreItems: (f) => io(re ?? O, f),
              onGrid: ce ? () => Xe({ id: ce.id, mode: "multiple" }) : void 0,
              notices: Ua,
              busy: $e
            },
            stayOnTap: Ot,
            onStayOnTapChange: un
          },
          O.id
        ) : O ? Vc(O) : /* @__PURE__ */ r(
          sf,
          {
            reviews: t,
            counts: tt,
            sort: de,
            direction: Ve,
            onSortChange: (f) => qt({ sort: f }),
            onDirectionChange: (f) => qt({ direction: f }),
            storage: lf[te],
            canConfigure: _,
            busy: kt,
            headingRef: dn,
            notices: Ua,
            onOpen: xa,
            onNew: () => Ic(),
            onImport: (f) => void Pc(f),
            onExportAll: () => Zs(t, "data-quality-reviews.json"),
            rowMenuItems: (f) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ r(kr, { "aria-hidden": "true" }),
                disabled: !_ || kt,
                onSelect: () => Da(f.id)
              },
              ...ao(f)
            ]
          }
        ),
        vt && ar && ce && /* @__PURE__ */ r(
          Sf,
          {
            video: ar,
            review: ce,
            selectedCount: lt.size,
            pending: se,
            refreshing: fe || !!We,
            error: tr,
            canWrite: u,
            assessmentReady: (Ie == null ? void 0 : Ie.kind) === "ready",
            trees: et,
            selected: lt.has(ar.id),
            hasPrevious: he.indexOf(ar.id) > 0,
            hasNext: he.indexOf(ar.id) >= 0 && he.indexOf(ar.id) < he.length - 1,
            onToggleSelected: () => hn((f) => ga(f, ar.id)),
            onPrevious: () => Fa(-1),
            onNext: () => Fa(1),
            onClose: () => {
              Sn(!1), mt(Et.current);
            },
            onAction: oa,
            findOpen: rt,
            onFindOpenChange: rn
          }
        ),
        rt && O && !Ze && !vt && /* @__PURE__ */ r(
          Ui,
          {
            actions: O.actions,
            tagGroups: I,
            trees: et,
            isDisabled: to,
            canStay: !1,
            onApply: (f) => {
              rn(!1), oa(f);
            },
            onClose: () => rn(!1)
          }
        ),
        st && /* @__PURE__ */ r(
          cf,
          {
            draft: st,
            onChange: (f) => It((b) => b && { ...b, review: f, error: "" }),
            onCreate: () => void Mc(),
            onCancel: () => It(null)
          }
        ),
        /* @__PURE__ */ r(
          sl,
          {
            open: !!dt,
            title: "Delete review?",
            message: dt ? `“${dt.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (dt == null ? void 0 : dt.pending) ?? !1,
            onConfirm: () => void Fc(),
            onCancel: () => _t((f) => f != null && f.pending ? f : null)
          }
        )
      ]
    }
  );
  async function ca(f, b, R = !1) {
    const L = Et.current, W = Math.max(0, he.indexOf(L ?? -1));
    try {
      const V = on(
        f,
        b,
        R,
        f.view.selectAllOnLoad === !0
      ), ee = Ae.current, gt = await V;
      if (ee !== Ae.current) return;
      const De = gt.items.map((ge) => ge.id);
      Ft(
        (ge) => new Set([...ge].filter((He) => De.includes(He)))
      );
      const Je = ho(De, L, W);
      pt(Je), Vt.current || mt(Je, !1);
    } catch {
    }
  }
  function Lc(f) {
    const b = M.current;
    if (M.current = null, Pa || !O || !re) return;
    const R = b ?? O.view.objectFilter, L = ur(
      R,
      re.view.objectFilter
    ) ? re.view.objectFilter : R, W = Lt({ ...f, page: 1 }), V = {
      ...O,
      view: {
        ...O.view,
        filter: W,
        objectFilter: L
      }
    }, ee = !Bo(V, re), gt = ee ? V : re;
    Ct(ee ? V : null), zt(ee ? "" : "Review queue defaults restored."), ca(gt, W, !0);
  }
  function Dc() {
    if (se || fe || Gn || !re) return;
    M.current = null;
    const f = Lt({
      ...re.view.filter,
      page: 1
    });
    Ct(null), zt("Review queue defaults restored."), ca(
      re,
      f,
      re.view.startFrom !== "beginning"
    );
  }
  function _c() {
    if (se || fe || We || Gn || !O || !$t || !_)
      return;
    const f = O, b = $t;
    er(!0), _a(b).then((R) => {
      !R || we.current !== b.id || (Ct(Ko(b, f)), zt("Queue saved to this review."));
    }).catch((R) => {
      we.current !== b.id ? ja(b, R) : Qt(R instanceof Error ? R.message : "Could not save queue.");
    }).finally(() => er(!1));
  }
  function Ga() {
    if (!O || !re || kn.current || me || En) return;
    On.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, nt.current = {
      temporaryReview: je,
      filter: X,
      loadedFilter: be,
      queue: Ue,
      queueError: We,
      retryFromEnd: Rt,
      selectedIds: new Set(lt),
      focusedId: ft,
      pageCursor: Pt.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const f = structuredClone({
      ...re,
      view: { ...re.view, startFrom: O.view.startFrom ?? "end" }
    });
    rn(!1), Sn(!1), zt(""), Qt(""), St({ draft: f, saving: !1, error: "" });
  }
  function oo() {
    St(null), nt.current = null;
    const f = On.current;
    On.current = null, requestAnimationFrame(() => {
      (f == null ? void 0 : f.isConnected) && f !== document.body && !(f instanceof HTMLButtonElement && f.disabled) ? f.focus({ preventScroll: !0 }) : mt(Et.current, !1);
    });
  }
  function jc() {
    var b;
    if (!me || me.saving) return;
    const f = nt.current;
    f && (Ae.current += 1, (b = Wt.current) == null || b.abort(), M.current = null, Nn(!1), Ct(f.temporaryReview), Ce(f.filter), Le(f.loadedFilter), Tt(f.queue), Yn(f.queueError), Pn(f.retryFromEnd), hn(() => f.selectedIds), pt(f.focusedId), Pt.current = f.pageCursor, window.history.replaceState(window.history.state, "", f.url)), oo();
  }
  async function Uc() {
    if (!me || me.saving || !Me || !O) return;
    const f = O, b = { ...Me, name: Me.name.trim() }, R = Vr(b);
    if (R) {
      St((L) => L && { ...L, error: R });
      return;
    }
    St((L) => L && { ...L, saving: !0, error: "" });
    try {
      if (!await _a(b)) throw new Error("Could not save reviews.");
      if (!Ee.current || we.current !== b.id) return;
      Ct(Ko(b, f)), _e(b) === "video" && Ur(b.id, {
        filter: X,
        objectFilter: f.view.objectFilter,
        searchMode: b.view.searchMode,
        startFrom: b.view.startFrom ?? "end"
      }), zt("Review saved."), oo();
    } catch (L) {
      if (we.current !== b.id) {
        ja(b, L);
        return;
      }
      St(
        (W) => W && {
          ...W,
          saving: !1,
          error: "Could not save review. Your edits are still open. " + (L instanceof Error ? L.message : "Retry saving.")
        }
      );
    }
  }
  function so() {
    O && on(O, X, Rt, Bt).catch(() => {
    });
  }
  function Gc() {
    Ft(/* @__PURE__ */ new Set()), pn.current.clear(), pt(null);
  }
  function Kc(f) {
    !O || se || Gn || f === Number(X.page) || bf(
      { ...X, page: f },
      O,
      (b, R) => on(b, R, !1, Bt),
      Gc
    );
  }
  function Bc(f) {
    if (!ce || !re || se || fe || Gn) return;
    const b = Qu(ce, f, re.view.objectFilter), R = !Bo(b, re);
    Ct(R ? b : null), R ? ca(b, { ...X, page: 1 }) : ca(
      re,
      { ...X, page: 1 },
      re.view.startFrom !== "beginning"
    );
  }
  function Vc(f) {
    var De, Je;
    const b = ye === "tag", R = b ? "tag" : "video", L = Math.max(1, Number(X.perPage) || 40), W = Math.max(1, Math.ceil(Ue.totalCount / L)), V = Math.min(Math.max(1, Number(X.page) || 1), W), ee = [
      k ? "" : `${Fn} write permission is required to apply actions.`,
      b && G ? `Tag groups are unavailable. ${G}` : ""
    ].filter(Boolean), gt = !!tr && !vt;
    return /* @__PURE__ */ l(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": b ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ r(
            nc,
            {
              name: f.name,
              description: f.description,
              entityType: ye,
              onBack: La,
              backDisabled: se || !!me || $e,
              onEdit: me ? () => {
                var ge;
                return (ge = Ut.current) == null ? void 0 : ge.focus();
              } : Ga,
              editDisabled: !me && (se || fe || yt || En || $e || !_),
              editing: !!me,
              toolbar: /* @__PURE__ */ l("fieldset", { className: "dq-review-toolbar", disabled: Pa, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: b ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ r(
                  Gr,
                  {
                    filter: We ? be : X,
                    onFilterChange: Lc,
                    totalCount: Ue.totalCount,
                    sortOptions: b ? ll : Zo,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: Jt,
                    zoomLevel: (Zn - 225) / 50,
                    onZoomChange: (ge) => na(Math.round(225 + ge * 50)),
                    cardSizeEntityType: b ? "tags" : "videos",
                    criteriaDefinitions: b ? cl : Ni,
                    customFieldEntityType: ye === "video" ? "video" : void 0,
                    objectFilter: Oa,
                    onObjectFilterChange: (ge) => {
                      Pa || (M.current = ye === "video" ? ic(
                        ge,
                        br,
                        f.view.objectFilter
                      ) : ge);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(rc, { page: V, pages: W, onPage: Kc })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ l(ue, { children: [
                ce && /* @__PURE__ */ r(
                  ac,
                  {
                    mode: "multiple",
                    disabled: se || fe || bt || !!me || En || $e,
                    onChange: () => Xe({ id: ce.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ r(
                  du,
                  {
                    options: b ? pf : ff,
                    value: Jt,
                    onChange: (ge) => Xn(Jo(ge, ye))
                  }
                ),
                /* @__PURE__ */ r(
                  Bi,
                  {
                    disabled: se || !!me,
                    items: io(re ?? f, {
                      onSelect: Ga,
                      disabled: fe || yt || En || !_
                    })
                  }
                )
              ] }),
              chipsAfter: (Je = (De = ce == null ? void 0 : ce.presentation) == null ? void 0 : De.binParents) != null && Je.length ? /* @__PURE__ */ r(
                Ju,
                {
                  videos: Ue.items,
                  review: ce,
                  savedObjectFilter: (re ?? ce).view.objectFilter,
                  trees: ae.ids,
                  disabled: se || fe || Gn,
                  onToggle: Bc
                }
              ) : void 0,
              chipsEnd: me ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : (je == null ? void 0 : je.id) === A ? /* @__PURE__ */ l(ue, { children: [
                /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Queue differs from the saved review" }),
                an && /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "dq-text-button",
                    title: "Save the current queue criteria to this review",
                    disabled: se || fe || !!We || Gn || !_,
                    onClick: _c,
                    children: [
                      /* @__PURE__ */ r(ds, { "aria-hidden": "true" }),
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
                    disabled: se || fe || Gn,
                    onClick: Dc,
                    children: [
                      /* @__PURE__ */ r(us, { "aria-hidden": "true" }),
                      "Reset"
                    ]
                  }
                )
              ] }) : void 0
            }
          ),
          Ua,
          ce && ae.error && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: ae.error }),
          /* @__PURE__ */ l("div", { className: "dq-review-area", children: [
            me && Me && /* @__PURE__ */ r(
              tc,
              {
                drawerRef: Ut,
                draft: Me,
                onChange: (ge) => St((He) => He && { ...He, draft: ge }),
                direction: me.draft.view.startFrom ?? "end",
                onDirectionChange: (ge) => St(
                  (He) => He && {
                    ...He,
                    draft: { ...He.draft, view: { ...He.draft.view, startFrom: ge } }
                  }
                ),
                tagGroups: I,
                trees: et,
                saving: me.saving,
                saveDisabled: fe || !!We,
                error: me.error,
                dirty: wr,
                criteriaChanged: an,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  We && !fe ? /* @__PURE__ */ l("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ r(An, { "aria-hidden": "true" }),
                    /* @__PURE__ */ l("span", { children: [
                      "The queue could not load: ",
                      We,
                      " ",
                      /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", onClick: so, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void Uc(),
                onCancel: jc
              }
            ),
            /* @__PURE__ */ l(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${x}px` },
                children: [
                  /* @__PURE__ */ l("div", { className: "dq-grid-content", children: [
                    fe && !Ue.items.length && /* @__PURE__ */ r(Wo, { label: "Loading review queue…" }),
                    We && !fe && /* @__PURE__ */ r(
                      Ho,
                      {
                        message: We,
                        retryLabel: yt ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (yt && re && _e(re) === "video") {
                            const ge = fr(re);
                            Ur(re.id, { ...ge, filter: { ...ge.filter, page: void 0 } }), Mt((He) => He + 1);
                            return;
                          }
                          so();
                        }
                      }
                    ),
                    !se && !fe && !We && !Ue.items.length && /* @__PURE__ */ l("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ r(Aa, {}),
                      /* @__PURE__ */ l("p", { children: [
                        "No ",
                        R,
                        "s match this review."
                      ] })
                    ] }),
                    !!Ue.items.length && /* @__PURE__ */ r("div", { ref: Mr, children: /* @__PURE__ */ r(
                      "div",
                      {
                        className: Jt === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${Zn}px` },
                        children: Ue.items.map(Jc)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ r("div", { className: "dq-bar-dock", ref: pe, children: /* @__PURE__ */ r(
                    Js,
                    {
                      actions: me ? me.draft.actions : f.actions,
                      tagGroups: I,
                      trees: et,
                      isDisabled: to,
                      paused: !!me,
                      busy: se || fe,
                      onApply: (ge) => void oa(ge),
                      onFind: () => rn(!0),
                      status: se ? `Applying action to ${xn}…` : "",
                      summary: /* @__PURE__ */ l(ue, { children: [
                        /* @__PURE__ */ r("p", { className: "dq-bar-target", children: lt.size ? `${lt.size} selected` : ft == null ? "Nothing to apply to" : `Applies to the focused ${R}` }),
                        /* @__PURE__ */ l(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !he.length || Tc,
                            onClick: () => hn((ge) => /* @__PURE__ */ new Set([...ge, ...he])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ r(at, { binding: $c.selectAll, hidden: !0 })
                            ]
                          }
                        ),
                        /* @__PURE__ */ l(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Escape",
                            disabled: !lt.size,
                            onClick: () => hn(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ r(at, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: ee.length ? ee.join(" ") : void 0,
                      keyHints: b ? "Arrows move · Space selects · Enter opens" : me ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews",
                      notices: gt || Ln ? /* @__PURE__ */ l(ue, { children: [
                        gt && /* @__PURE__ */ l("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ r(An, { "aria-hidden": "true" }),
                          tr
                        ] }),
                        Ln && /* @__PURE__ */ r("p", { role: "status", className: "dq-status", children: Ln })
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
  function Jc(f) {
    var R, L, W;
    if (ye === "tag") {
      const V = f;
      return /* @__PURE__ */ r(
        vf,
        {
          tag: V,
          displayMode: Jt === "list" ? "list" : "grid",
          focused: V.id === ft,
          selected: lt.has(V.id),
          setRef: (ee) => {
            ee ? _n.current.set(V.id, ee) : _n.current.delete(V.id);
          },
          onFocus: () => pt(V.id),
          onToggle: () => {
            hn((ee) => ga(ee, V.id)), mt(V.id, !1);
          },
          onOpen: () => window.open(`/tag/${V.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        V.id
      );
    }
    const b = f;
    return /* @__PURE__ */ r(
      Nf,
      {
        video: Vu(b, ce, ae.ids),
        showTagBins: ((L = (R = ce == null ? void 0 : ce.presentation) == null ? void 0 : R.annotations) == null ? void 0 : L.includes("tags")) && !!((W = ce.presentation.annotationParents) != null && W.length),
        displayMode: Jt,
        cardsScroll: aa,
        focused: b.id === ft,
        selected: lt.has(b.id),
        setRef: (V) => {
          V ? _n.current.set(b.id, V) : _n.current.delete(b.id);
        },
        onFocus: () => pt(b.id),
        onToggle: () => hn((V) => ga(V, b.id)),
        onPreview: () => {
          me || (pt(b.id), Sn(!0));
        },
        onNavigate: e
      },
      b.id
    );
  }
}
function bf(e, t, n, a) {
  a(), n(t, e).catch(() => {
  });
}
function ga(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function wf(e, t) {
  if (!e.some((n) => n.id === t.id)) throw new Error("This review was deleted.");
  return e.map((n) => n.id === t.id ? t : n);
}
function yf(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function vf({
  tag: e,
  displayMode: t,
  focused: n,
  selected: a,
  setRef: i,
  onFocus: o,
  onToggle: s,
  onOpen: c,
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
        dl,
        {
          tag: e,
          selected: a,
          onSelect: s,
          onClick: c,
          onNavigate: d
        }
      ) : /* @__PURE__ */ l("div", { className: "dq-tag-list-row", children: [
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
        /* @__PURE__ */ r("button", { type: "button", className: "dq-tag-list-name", onClick: c, children: e.name }),
        /* @__PURE__ */ r("span", { children: e.tagGroupName || "Ungrouped" }),
        /* @__PURE__ */ r("span", { children: e.description || "" }),
        /* @__PURE__ */ l("span", { children: [
          e.videoCount ?? 0,
          " videos"
        ] })
      ] })
    }
  );
}
function Nf({
  video: e,
  showTagBins: t,
  displayMode: n,
  cardsScroll: a,
  focused: i,
  selected: o,
  setRef: s,
  onFocus: c,
  onToggle: d,
  onPreview: h,
  onNavigate: u
}) {
  var E, w;
  const g = kc(e), m = $(null), N = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, y = !!(N.date || N.studioName), q = !!(N.performers.length || N.tags.length);
  return Zt(() => {
    const I = m.current;
    if (!I) return;
    const F = I.querySelector(
      `a[href="/video/${e.id}"]`
    ), G = I.querySelector(".card-title"), K = `dq-card-title-${e.id}`;
    G && (G.id = K), F && (F.target = "_blank", F.rel = "noreferrer", F.removeAttribute("aria-label"), F.setAttribute("aria-labelledby", K), F.classList.add("dq-card-link"));
    const _ = I.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    _ && _.setAttribute(
      "aria-label",
      o ? `Deselect ${g}` : `Select ${g}`
    );
    const Z = I.querySelector(
      'button[title="Quick View"]'
    );
    Z && Z.setAttribute("aria-label", `Preview ${g}`);
  }), /* @__PURE__ */ l(
    "article",
    {
      ref: (I) => {
        m.current = I, s(I);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${g}${o ? ", selected" : ""}`,
      onFocus: c,
      onClick: (I) => {
        c(), I.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${y ? "has-card-metadata" : "no-card-metadata"} ${q ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ r(
          ul,
          {
            video: N,
            selected: o,
            onSelect: d,
            onNavigate: u,
            onQuickView: h,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ l("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (E = e.tags) == null ? void 0 : E.map((I) => /* @__PURE__ */ r("span", { children: I.name }, I.id)),
          !((w = e.tags) != null && w.length) && /* @__PURE__ */ r("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ r(qf, { video: e, cardsScroll: a })
      ]
    }
  );
}
function qf({ video: e, cardsScroll: t }) {
  const n = $(null), a = $(null), [i, o] = C(!1), [s, c] = C(!1), [d, h] = C(!1);
  return H(() => {
    const u = n.current;
    if (!u || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      o(!0), c(!0);
      return;
    }
    const g = t ? u.closest(".dq-grid-stage") : null, m = new IntersectionObserver(
      ([y]) => o(y.isIntersecting),
      { root: g, rootMargin: "320px 0px", threshold: 0 }
    ), N = new IntersectionObserver(
      ([y]) => c(y.isIntersecting && y.intersectionRatio >= 0.6),
      { root: g, threshold: [0, 0.6, 1] }
    );
    return m.observe(u), N.observe(u), () => {
      m.disconnect(), N.disconnect();
    };
  }, [e.id, e.files.length, t]), H(() => {
    if (!i) {
      h(!1);
      return;
    }
    const u = new AbortController();
    return le(td(e.id), {
      signal: u.signal
    }).then((g) => {
      u.signal.aborted || h(g.available === !0);
    }).catch(() => {
      u.signal.aborted || h(!1);
    }), () => u.abort();
  }, [i, e.id]), H(() => {
    const u = a.current;
    u && (s ? Promise.resolve(u.play()).catch(() => {
    }) : u.pause());
  }, [d, s]), /* @__PURE__ */ r("div", { ref: n, className: "dq-wall-autoplay", "aria-hidden": "true", children: d && /* @__PURE__ */ r(
    "video",
    {
      ref: a,
      src: ed(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Sf({
  video: e,
  review: t,
  selectedCount: n,
  pending: a,
  refreshing: i,
  error: o,
  canWrite: s,
  assessmentReady: c,
  trees: d,
  selected: h,
  hasPrevious: u,
  hasNext: g,
  onToggleSelected: m,
  onPrevious: N,
  onNext: y,
  onClose: q,
  onAction: E,
  findOpen: w,
  onFindOpenChange: I
}) {
  const F = $(null), G = Zr(), K = $(null), _ = e.files[0], Z = kc(e), te = (v) => a || i || "steps" in v && v.steps.length > 0 && !s || Qn(v) && !c;
  Li({
    surface: "overlay",
    enabled: !w,
    actions: t.actions,
    onAction: (v) => {
      const T = t.actions[v];
      T && E(T);
    },
    onFind: () => I(!0)
  }), H(() => {
    var T;
    const v = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (T = F.current) == null || T.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = v;
    };
  }, []);
  function ne(v) {
    var P, Q, z;
    if (v.key !== "Tab") return;
    const T = [
      ...((P = F.current) == null ? void 0 : P.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((j) => j.offsetParent !== null);
    if (!T.length) {
      v.preventDefault(), (Q = F.current) == null || Q.focus();
      return;
    }
    const J = T.indexOf(
      document.activeElement
    );
    v.shiftKey && J <= 0 ? (v.preventDefault(), (z = T.at(-1)) == null || z.focus()) : !v.shiftKey && J === T.length - 1 && (v.preventDefault(), T[0].focus());
  }
  function ie(v) {
    if (w || v.defaultPrevented || v.ctrlKey || v.metaKey || v.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const T = v.key === "ArrowLeft" || v.key === "ArrowRight";
    if (v.altKey && !T) return;
    const J = K.current, P = v.currentTarget.querySelector("video");
    if (v.key === "Enter" || v.key === "Escape")
      v.repeat || q();
    else if (v.key === " " && J)
      v.repeat || J.toggle();
    else if (T && J)
      J.seekBy(
        (v.key === "ArrowLeft" ? -1 : 1) * (v.shiftKey ? 5 : v.altKey ? 10 : 60)
      );
    else if ((v.key === "," || v.key === ".") && J) {
      const Q = [_ == null ? void 0 : _.duration, P == null ? void 0 : P.duration].find(
        (j) => j != null && Number.isFinite(j) && j > 0
      ) ?? 0, z = e.parentVideoId != null ? (e.clipEndSec ?? Q) - (e.clipStartSec ?? 0) : Q;
      Number.isFinite(z) && z > 0 && J.seekBy((v.key === "," ? -1 : 1) * z * 0.1);
    } else if (v.key.toLowerCase() === "n" || v.key.toLowerCase() === "m")
      !v.repeat && !a && !i && (v.key.toLowerCase() === "n" && u && N(), v.key.toLowerCase() === "m" && g && y());
    else if (v.key === "ArrowUp" && P)
      P.volume = Math.min(1, P.volume + 0.1);
    else if (v.key === "ArrowDown" && P)
      P.volume = Math.max(0, P.volume - 0.1);
    else return;
    qr(v);
  }
  function D(v) {
    const T = F.current, J = v.target instanceof Element ? v.target.closest("button, a[href]") : null;
    !T || !J || !T.contains(J) || J.closest(".dq-player, .dq-find-action") || v.detail === 0 || T.focus({ preventScroll: !0 });
  }
  H(() => {
    if (w) return;
    let v = 0;
    const T = requestAnimationFrame(() => {
      v = requestAnimationFrame(() => {
        var P;
        const J = document.activeElement;
        (P = F.current) != null && P.isConnected && (!J || J === document.body || J === document.documentElement) && F.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(T), cancelAnimationFrame(v);
    };
  }, [w, a, i, g, u, e.id, G]);
  const B = n ? `the ${n} selected video${n === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ l(
    "div",
    {
      ref: F,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${Z}`,
      className: `dq-preview${G ? " dq-preview-mobile" : ""}`,
      onKeyDown: ne,
      onKeyDownCapture: ie,
      onMouseDown: (v) => {
        v.target === v.currentTarget && q();
      },
      onClick: D,
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
                disabled: !u || a || i,
                onClick: N,
                children: [
                  /* @__PURE__ */ r(Wr, { "aria-hidden": "true" }),
                  !G && /* @__PURE__ */ r(at, { binding: "n", hidden: !0 })
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
                disabled: !g || a || i,
                onClick: y,
                children: [
                  !G && /* @__PURE__ */ r(at, { binding: "m", hidden: !0 }),
                  /* @__PURE__ */ r(ls, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ l("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ r("h2", { children: Z }),
              /* @__PURE__ */ l("p", { children: [
                "Actions apply to ",
                B
              ] })
            ] }),
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: "dq-preview-button dq-preview-select",
                "aria-pressed": h,
                disabled: i,
                onClick: m,
                children: [
                  /* @__PURE__ */ r("span", { className: "dq-preview-check", "aria-hidden": "true", children: h && /* @__PURE__ */ r(Ca, {}) }),
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
                "aria-label": `Open ${Z} in a new tab`,
                title: "Open video in a new tab",
                children: /* @__PURE__ */ r(fs, { "aria-hidden": "true" })
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
                children: /* @__PURE__ */ r(Qr, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ r("div", { className: "dq-preview-video", children: _ ? /* @__PURE__ */ r(
            es,
            {
              autostart: !0,
              streamUrl: oi("video", e.id),
              posterUrl: yo(e),
              format: _.format,
              audioCodec: _.audioCodec,
              duration: _.duration ?? 0,
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
          ) : /* @__PURE__ */ r("img", { src: yo(e), alt: "" }) }) }),
          o && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert dq-preview-alert", children: o }),
          !G && /* @__PURE__ */ l("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ r("span", { children: "Space play / pause" }),
            /* @__PURE__ */ r("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ r("span", { children: ", . ±10 %" }),
            /* @__PURE__ */ r("span", { children: "↑ ↓ volume" }),
            /* @__PURE__ */ r("span", { children: "N M previous / next" }),
            /* @__PURE__ */ r("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ r(
            Js,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: d,
              isDisabled: te,
              busy: a || i,
              onApply: (v) => void E(v),
              onFind: () => I(!0),
              status: a ? `Applying action to ${B}…` : "",
              summary: /* @__PURE__ */ r("p", { className: "dq-bar-target", children: n ? `${n} selected` : "This video" })
            }
          )
        ] }),
        w && /* @__PURE__ */ r(
          Ui,
          {
            actions: t.actions,
            trees: d,
            isDisabled: te,
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
async function Ef() {
  const e = await le("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
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
function Wo({ label: e }) {
  return /* @__PURE__ */ l("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ r(Nl, { className: "dq-spin" }),
    e
  ] });
}
function Ho({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ l("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ r(An, {}),
    /* @__PURE__ */ r("p", { children: e }),
    /* @__PURE__ */ r("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const $f = { components: { DataQualityPage: gf } };
export {
  gf as DataQualityPage,
  $f as default,
  ur as objectFiltersEqual
};
