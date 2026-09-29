import { jsxs as l, Fragment as ue, jsx as r } from "react/jsx-runtime";
import { useState as k, useRef as $, useEffect as H, useLayoutEffect as $t, useMemo as ve, useCallback as mn, useSyncExternalStore as vi, useId as dt, Fragment as Ni, createContext as Zc, useContext as el } from "react";
import { useKeySequence as tl, EntityReferenceMultiSelector as Rn, SortableList as es, EntityDetailTabs as nl, TagBadge as rl, DetailListToolbar as Gr, PERFORMER_CRITERIA as qi, AUDIO_CRITERIA as ts, VIDEO_CRITERIA as Si, NarrativeText as al, AUDIO_SORT_OPTIONS as il, VIDEO_SORT_OPTIONS as ns, AudioPlayer as ol, VideoPlayer as rs, formatDuration as as, FilterDialog as sl, getResolutionLabel as cl, ConfirmDialog as ll, TAG_CRITERIA as dl, TAG_SORT_OPTIONS as ul, TagTile as fl, VideoCard as pl } from "@cove/runtime/components";
import { Search as Jr, Check as Aa, Pencil as Cr, Ban as ya, Pin as Ei, Plus as Ci, GripVertical as is, AlertTriangle as An, Copy as os, Trash2 as ss, ChevronDown as cs, X as Qr, Mic as hl, Users as ls, Tag as ds, Headphones as us, Film as Ta, ChevronLeft as Wr, MoreHorizontal as ml, RectangleHorizontal as gl, LayoutGrid as ki, ChevronRight as fs, Save as bl, RotateCcw as wl, Layers as mo, Undo2 as yl, Flag as va, RefreshCw as vl, ExternalLink as ps, SkipForward as Nl, Upload as ql, Download as hs, ArrowUp as Sl, ArrowDown as El, Loader2 as Cl, List as kl, Grid3X3 as Al } from "@cove/runtime/lucide-react";
import { extensionFetch as Tl } from "@cove/runtime/api";
const Ai = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, Ti = Object.keys(
  Ai
);
function Kr(e) {
  return e === "excludes" || e === "excludesAll";
}
function Ri(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
const ms = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function Te(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function Oi(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function xe(e) {
  return Oi(_e(e));
}
function Rl(e) {
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
], Qn = "none";
function cr(e) {
  return typeof e == "string" && Jn.includes(e);
}
function $i(e) {
  const t = e.shortcut;
  return cr(t) || t === Qn ? t : "auto";
}
function gs(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), i = [];
  e.forEach((s, c) => {
    const d = $i(s);
    if (d !== Qn) {
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
function Ol(e, t, n) {
  const { keys: a, actionOn: i } = gs(e), o = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (cr(n)) {
    const c = i.get(n), d = a[t];
    c !== void 0 && c !== t && o.set(c, d && e[t].shortcut === d ? d : void 0);
  }
  const s = new Set([...o.values()].filter(cr));
  return e.map((c, d) => {
    const h = o.has(d) ? o.get(d) : cr(c.shortcut) && s.has(c.shortcut) ? void 0 : c.shortcut;
    if (h === c.shortcut) return c;
    const { shortcut: u, ...g } = c;
    return h === void 0 ? g : { ...g, shortcut: h };
  });
}
function Vr(e) {
  return Te(e) && !bs(e.occurrence) ? "Complete the optional occurrence condition before saving." : !Rl(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : _e(e) !== "tag" && e.actions.some(
    (t) => Ii(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => On(t, _e(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const $l = {
  video: 1e3,
  audio: 250
};
function Dt(e, t = "video") {
  const n = (a, i) => Number.isFinite(Number(a)) && Number(a) > 0 ? Math.floor(Number(a)) : i;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min($l[t], n(e.perPage, 40))
    )
  };
}
function go(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function zn(e) {
  const { page: t, ...n } = e.view.filter, a = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    Te(e) ? [e.entityType, ...a, e.occurrence] : _e(e) === "video" ? a : [_e(e), ...a]
  );
}
function On(e, t) {
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
  ) && !Ii(e) : !1;
}
function Il(e) {
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
function ti(e) {
  return "steps" in e && e.steps.length > 0;
}
function Wn(e) {
  return "steps" in e ? e.steps.some((t) => Tn(t.mode)) : !1;
}
function Ii(e) {
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
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || ms.includes(n.entityType)) && (!Il(n.entityType) || bs(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && Ml(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (a) => typeof a == "string"
    )) && // Answer groups belong to actions that write tags; tag reviews have neither.
    (n.stayUntilGroupsAnswered === void 0 || typeof n.stayUntilGroupsAnswered == "boolean" && n.entityType !== "tag") && Array.isArray(n.actions) && n.actions.every(
      (a) => typeof (a == null ? void 0 : a.id) == "string" && typeof a.label == "string" && (a.shortcut === void 0 || typeof a.shortcut == "string") && (n.entityType === "tag" ? "effect" in a && !("steps" in a) && !("group" in a) && On(a, "tag") : "steps" in a && !("effect" in a) && Array.isArray(a.steps) && a.steps.every(
        (i) => i && Array.isArray(i.tagIds)
      ) && (a.group === void 0 || typeof a.group == "string") && On(a, "video"))
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
function Ml(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= 115 && n.cardSize <= 380) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (a) => ["date", "studio", "performers", "tags"].includes(a)
  )) && [n.annotationParents, n.binParents].every(
    (a) => a === void 0 || Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0)
  );
}
function ni(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const a of e)
    for (const i of a)
      n.has(i.id) || (n.add(i.id), t.push(i));
  return t;
}
function Fl(e, t) {
  const n = (c) => c.trim().toLocaleLowerCase(), a = new Set(t.map((c) => n(c.name))), i = e.trim(), o = i.replace(/ copy(?: \d+)?$/i, ""), s = `${o !== i && a.has(n(o)) ? o : i} copy`;
  for (let c = 1; ; c++) {
    const d = c === 1 ? s : `${s} ${c}`;
    if (!a.has(n(d))) return d;
  }
}
function Pl(e, t, n) {
  return { ...structuredClone(e), id: n, name: Fl(e.name, t) };
}
function bs(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (a) => Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0) && new Set(a).size === a.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && Ti.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function bo(e, t) {
  return e.size > 0 ? [...e].sort((n, a) => n - a) : t == null ? [] : [t];
}
function wo(e, t, n, a) {
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
function xl(e, t) {
  const n = new Set(e), a = t.length > 0 && t.every((i) => n.has(i));
  for (const i of t)
    a ? n.delete(i) : n.add(i);
  return n;
}
function Ll(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function Dl(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function _l(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function jl(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function Ul(e, t) {
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
const ws = "ext:com.midnightrider.data-quality:configuration", Gl = "ext:cove-data-quality:video-reviews", ri = "ext:com.midnightrider.data-quality:progress";
class ys extends Error {
}
const Yr = /* @__PURE__ */ new Map(), ua = /* @__PURE__ */ new Map(), or = (e, t) => e.includes("*") || e.includes(t), Na = (e) => le(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Kl = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function ai(e) {
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
    deletedIds: ai(t.deletedIds),
    importedIds: ai(t.importedIds)
  };
}
function Bl(e) {
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
    ai(
      JSON.parse(localStorage.getItem(`${i}:account-imports`) ?? "[]")
    ).forEach((s) => a.add(s));
  }
  return {
    reviews: n ?? [],
    known: [...a],
    present: n !== void 0
  };
}
async function vs(e) {
  const t = await le("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Mi(e, t) {
  const n = (ua.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return ua.set(e, n), n.finally(() => {
    ua.get(e) === n && ua.delete(e);
  }).catch(() => {
  }), n;
}
let Lr = null;
function Vl() {
  if (Lr) return Lr;
  const e = zl();
  return Lr = e, e.finally(() => {
    Lr === e && (Lr = null);
  }).catch(() => {
  }), e;
}
async function zl() {
  const e = await le("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return Mi(t, () => Jl(e, t));
}
async function Jl(e, t) {
  var m;
  const n = String(e.user.id), a = or(e.permissions, "savedfilters.read"), i = a && or(e.permissions, "savedfilters.write"), o = a ? (await Na(ws)).filter((q) => q.name === "Data Quality configuration").sort((q, y) => q.id - y.id) : [];
  if (o.length > 1) {
    const q = (y) => {
      const { revision: N, ...E } = Nr(y.uiOptions);
      return JSON.stringify(E);
    };
    if (o.some((y) => q(y) !== q(o[0])))
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
  let s = o.length ? Nr(o[0].uiOptions) : Kl();
  const c = localStorage.getItem(`${t}:migrated`) === "true", d = localStorage.getItem(t), h = localStorage.getItem(`${t}:local-only`) === "true";
  !o.length && d && (s = Nr(d));
  let u = !o.length;
  if (o.length && h && d) {
    const q = Nr(d);
    if (q.reviews.some((N) => {
      const E = s.reviews.find((b) => b.id === N.id);
      return E && JSON.stringify(E) !== JSON.stringify(N);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const y = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...q.deletedIds])
    ];
    s = {
      ...s,
      reviews: ni(s.reviews, q.reviews).filter(
        (N) => !y.includes(N.id)
      ),
      deletedIds: y,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...q.importedIds])
      ]
    }, u = !0;
  }
  if (!c) {
    const q = JSON.stringify(s), y = Bl(n);
    if (o.length && y.reviews.some((R) => {
      const I = s.reviews.find((j) => j.id === R.id);
      return I && JSON.stringify(I) !== JSON.stringify(R);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const N = a ? (await Na(Gl)).flatMap(
      (R) => Hr(R.uiOptions ?? "[]")
    ) : [], E = y.known.filter(
      (R) => !y.reviews.some((I) => I.id === R)
    ), b = /* @__PURE__ */ new Set([...s.deletedIds, ...E]);
    s = {
      ...s,
      reviews: ni(
        y.reviews,
        s.reviews,
        N.filter(
          (R) => !y.known.includes(R.id) && !s.importedIds.includes(R.id)
        )
      ).filter((R) => !b.has(R.id)),
      deletedIds: [...b],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...y.known,
          ...N.map((R) => R.id)
        ])
      ]
    }, u || (u = JSON.stringify(s) !== q);
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
    const q = s;
    o.length && (g.config = Nr(o[0].uiOptions)), await Ns(t, q), s = g.config;
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
    canWrite: or(e.permissions, "videos.write"),
    canWriteVideos: or(e.permissions, "videos.write"),
    canWriteAudios: or(e.permissions, "audios.write"),
    canWriteTags: or(e.permissions, "tags.write"),
    canReadTagGroups: or(e.permissions, "taggroups.read"),
    canConfigure: !a || i,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: a ? i ? "account" : "readOnly" : "browser",
    storageNotice: a ? i ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Ns(e, t) {
  const n = Yr.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const a = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await vs(n), n.recordId != null) {
      const o = await le(
        `/api/savedfilters/${n.recordId}`
      );
      if (Nr(o.uiOptions).revision !== n.config.revision)
        throw new ys(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const i = await le(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: ws,
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
function Ql(e, t) {
  return Mi(e, async () => {
    const n = Yr.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const a = n.config.reviews, i = t(a);
    if (i === a) return a;
    Hr(JSON.stringify(i));
    const o = a.filter((s) => !i.some((c) => c.id === s.id)).map((s) => s.id);
    return await Ns(e, {
      ...n.config,
      reviews: i,
      deletedIds: [
        .../* @__PURE__ */ new Set([...n.config.deletedIds, ...o])
      ].filter((s) => !i.some((c) => c.id === s))
    }), i;
  });
}
function yo(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, a]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(a)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Wl(e, t) {
  const n = Yr.get(e);
  if (!n) return null;
  const a = localStorage.getItem(`${e}:progress:${t}`), i = a ? yo(a) : null;
  if (!n.readable) return i;
  const o = (await Na(ri)).find(
    (c) => c.name === t
  ), s = o ? yo(o.uiOptions) : null;
  return i && (!s || i.updatedAt > s.updatedAt) ? i : s;
}
function Hl(e, t, n) {
  const a = `${e}:progress:${t}`;
  try {
    localStorage.setItem(a, JSON.stringify(n));
  } catch {
  }
  return Mi(a, async () => {
    const i = Yr.get(e);
    if (!(i != null && i.writable)) return;
    await vs(i);
    const o = (await Na(ri)).find(
      (s) => s.name === t
    );
    await le(
      o ? `/api/savedfilters/${o.id}` : "/api/savedfilters",
      {
        method: o ? "PUT" : "POST",
        body: JSON.stringify({
          mode: ri,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function Hn(e) {
  return e === "audio" ? "audios" : "videos";
}
const Yl = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function bn(e) {
  return Yl[e];
}
const qa = "confirmed_absent_tags", Fi = "Confirmed absent tags", Ra = "confirmed_absent_occurrence_tags", qs = {
  key: qa,
  label: Fi,
  type: "tag",
  subject: "tag assessments"
}, Pi = {
  key: Ra,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, Xl = {
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
function $n(e) {
  return Array.isArray(e) ? e.map($n) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? Xl[n] ?? n : t === "key" && typeof n == "string" && [
        qa,
        Ra
      ].includes(n.toLowerCase()) ? n.toLowerCase() : $n(n)
    ])
  ) : e;
}
async function Ss(e, t, n) {
  const a = new Headers(t.headers);
  !(t.body instanceof FormData) && !a.has("Content-Type") && a.set("Content-Type", "application/json");
  const i = await Tl(e, { ...t, headers: a });
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
  return await Ss(e, t, "fail");
}
function Zl(e, t = {}) {
  return Ss(e, t, "null");
}
const ed = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let td = 0;
function ii(e, t) {
  return le(
    `/api/${Hn(e)}/${t}?dqRead=${ed}-${++td}`,
    { cache: "no-store" }
  );
}
function Es(e, t) {
  const n = { ...e.view.objectFilter }, a = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    $n({
      findFilter: Dt(t, xe(e)),
      objectFilter: n,
      filterExpression: a
    })
  );
}
async function jr(e, t, n) {
  return le(
    `/api/${Hn(xe(e))}/find`,
    { method: "POST", signal: n, body: Es(e, t) }
  );
}
async function nd(e, t, n) {
  return (await le(
    `/api/${Hn(xe(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: Es(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function vo(e, t, n) {
  const a = { ...e.view.objectFilter };
  return delete a._filterExpression, le("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      $n({
        findFilter: Dt(t),
        objectFilter: a
      })
    )
  });
}
function rd(e) {
  return le("/api/taggroups", { signal: e });
}
function oi(e, t, n = 1280) {
  return `/api/${Hn(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function si(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function No(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function ad(e) {
  return `/api/stream/video/${e}/preview`;
}
function id(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function od(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Oa(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e) {
    await le(`/api/tags/${a}`, { signal: t }), n.add(a);
    for (let i = 1; ; i++) {
      const o = await le("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          $n({
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
async function xi(e, t) {
  const n = Ar(e);
  return (await Promise.all(
    e.steps.map(
      async (i) => i.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await Oa(i.tagIds, t)).filter(
          (o) => !n.has(o)
        )
      } : i
    )
  )).filter((i) => i.tagIds.length > 0);
}
function sd(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function Li(e, t) {
  const a = (await le("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === e.key
  );
  if (!a)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const i = sd(e, a);
  return i ? { kind: "incompatible", message: i } : a.entityTypes.includes(t) ? { kind: "ready", definition: a, message: "" } : {
    kind: "missing",
    message: `Add ${bn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: a
  };
}
async function Cs(e, t) {
  const n = await Li(e, t);
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
  return Li(qs, e);
}
function cd(e = "video") {
  return Cs(qs, e);
}
function As(e = "video") {
  return Li(Pi, e);
}
function ld(e = "video") {
  return Cs(Pi, e);
}
function Sa(e) {
  return [...new Set(e)];
}
function Ts(e, t) {
  const n = e.customFields ?? {}, a = Object.keys(n).find(
    (o) => o.toLowerCase() === Ra
  ), i = a === void 0 ? [] : n[a];
  return Sa(
    (Array.isArray(i) ? i : []).filter(
      (o) => typeof o == "string" && /^[1-9]\d*:[1-9]\d*$/.test(o)
    ).map((o) => o.split(":").map(Number)).filter(([o]) => o === t).map(([, o]) => o)
  );
}
async function dd(e) {
  let t;
  try {
    t = await As(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${Pi.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function ud(e, t, n, a, i, o) {
  await le(`/api/${Hn(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: Sa(i).map((s) => `${a}:${s}`)
      },
      customFieldMode: o
    })
  });
}
function fd(e, t, n) {
  const a = [...e.tagIds], i = (o) => {
    if (n === null)
      throw new Error(
        `The ${Fi} custom field is not available.`
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
async function Rs(e, t, n) {
  if (!On(t) || n.length === 0 || n.some((d) => !Number.isSafeInteger(d) || d <= 0))
    throw new Error(
      `Choose ${bn(e).many} and configure a valid action first.`
    );
  let a = null;
  if (Wn(t)) {
    let d;
    try {
      d = await ks(e);
    } catch (h) {
      throw new Error(
        `Could not verify the ${Fi} custom field. ${h instanceof Error ? h.message : "Request failed."}`
      );
    }
    if (d.kind !== "ready") throw new Error(d.message);
    a = d.definition.key;
  }
  const i = Sa(n), o = (await xi(t)).map((d) => ({
    mode: d.mode,
    tagIds: Sa(d.tagIds)
  })), c = [
    ...o.filter((d) => !Tn(d.mode)),
    ...o.filter((d) => Tn(d.mode))
  ].map(
    (d) => fd(d, i, a)
  );
  for (let d = 0; d < c.length; d++)
    try {
      await le(`/api/${Hn(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(c[d])
      });
    } catch (h) {
      throw new Error(
        `Step ${d + 1} failed; ${d} earlier step(s) completed. Refresh and check the selected ${bn(e).many} before retrying. ${h instanceof Error ? h.message : "Request failed."}`
      );
    }
}
async function pd(e, t) {
  if (!On(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await le("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const fa = (e) => e >= "0" && e <= "9";
function qo(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function So(e, t) {
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
    const o = qo(e[n]), s = qo(t[a]);
    if (o !== s) return o < s ? -1 : 1;
    n++, a++;
  }
  const i = e.length - n - (t.length - a);
  return i !== 0 ? i < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function Os(e, t) {
  const n = (i) => i.tagGroupId != null ? 0 : 1, a = (i) => i.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(a(e) - a(t)) || So(e.tagGroupName, t.tagGroupName) || So(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function lr(e) {
  return [...e].sort(Os);
}
function hd(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const a of n.steps)
        a.mode === "REMOVE_TREE" && a.tagIds.forEach((i) => t.add(i));
  return [...t];
}
function Di(e, t, n) {
  const a = Ar(e), i = [], o = [];
  for (const m of e.steps) {
    if (m.mode !== "REMOVE_TREE") {
      o.push(m);
      continue;
    }
    const q = m.tagIds.flatMap((y) => {
      const N = n.get(y);
      return N || i.push(y), N ?? [y];
    });
    o.push({ mode: "REMOVE", tagIds: q.filter((y) => !a.has(y)) });
  }
  const s = [
    ...o.filter((m) => !Tn(m.mode)),
    ...o.filter((m) => Tn(m.mode))
  ], c = new Set(t.ids), d = new Set(t.absent);
  for (const m of s)
    for (const q of m.tagIds)
      switch (m.mode) {
        case "ADD":
          c.add(q);
          break;
        case "REMOVE":
        case "REMOVE_TREE":
          c.delete(q);
          break;
        case "MARK_PRESENT":
          c.add(q), d.delete(q);
          break;
        case "MARK_ABSENT":
          c.delete(q), d.add(q);
          break;
        case "CLEAR_ABSENCE":
          d.delete(q);
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
function md(e) {
  let t;
  if (e.applications) {
    const n = /* @__PURE__ */ new Map();
    for (const a of e.applications)
      n.has(a.tag.id) || n.set(a.tag.id, a.tag);
    t = [...n.values()];
  } else
    t = e.tags ?? e.ids.map((n, a) => ({ id: n, name: e.names[a] ?? "" }));
  return lr(t);
}
function $s(e) {
  const t = hd(e).sort((s, c) => s - c).join(","), [n, a] = k(() => /* @__PURE__ */ new Map()), i = $(/* @__PURE__ */ new Set()), o = $(!0);
  return H(() => (o.current = !0, () => {
    o.current = !1;
  }), []), H(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const c of s)
      i.current.has(c) || (i.current.add(c), Oa([c]).then(
        (d) => {
          o.current && a((h) => new Map(h).set(c, d));
        },
        () => {
          i.current.delete(c);
        }
      ));
  }, [t]), n;
}
function ur(e) {
  return (e ?? "").trim().toLocaleLowerCase();
}
function Xr(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n, a) => {
    const i = ur(n.group);
    if (!i) return;
    const o = t.get(i);
    o ? o.actions.push(a) : t.set(i, { key: i, name: n.group.trim(), actions: [a] });
  }), [...t.values()];
}
function Eo(e) {
  return e.stayUntilGroupsAnswered === !0 && e.actions.some((t) => ur(t.group) !== "");
}
function Is(e) {
  return new Set(
    e.applications ? e.applications.map((t) => t.tag.id) : e.ids
  );
}
function Ms(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "MARK_ABSENT").flatMap((t) => t.tagIds)
  );
}
function Fs(e) {
  return Ar(e).size > 0 || Ms(e).size > 0;
}
function gd(e) {
  return Xr(e).filter(
    (t) => !t.actions.some((n) => Fs(e[n]))
  );
}
function ci(e, t) {
  const n = Is(t), a = new Set(t.absent);
  return Xr(e).map((i) => {
    const o = [], s = [];
    for (const c of i.actions) {
      const d = [...Ar(e[c])], h = [...Ms(e[c])], u = [
        ...d.map((g) => n.has(g)),
        ...h.map((g) => a.has(g))
      ];
      u.some(Boolean) && (s.push(c), u.every(Boolean) && o.push(c));
    }
    return { ...i, answers: o.length ? o : s };
  });
}
function li(e) {
  return e.filter((t) => t.answers.length === 0);
}
function bd(e, t, n) {
  const a = { ids: [...Is(t)], absent: t.absent }, i = Di(e, a, n), o = new Set(i.removed), s = new Set(i.absenceCleared);
  return {
    ids: [...a.ids.filter((c) => !o.has(c)), ...i.added],
    absent: [...a.absent.filter((c) => !s.has(c)), ...i.markedAbsent]
  };
}
const di = "-", Co = "Ctrl+a", wd = "Ctrl/⌘A", yd = ["f", "g", "k"], za = "Shift+";
function Tr(e) {
  return ve(() => gs(e), [e]);
}
function _i({
  surface: e,
  enabled: t,
  actions: n,
  onAction: a,
  onFind: i,
  onSelectAll: o
}) {
  const s = Tr(n), c = $({ keyMap: s, onAction: a, onFind: i, onSelectAll: o });
  $t(() => {
    c.current = { keyMap: s, onAction: a, onFind: i, onSelectAll: o };
  });
  const d = !!i && n.length > 0, h = e === "local" && !!o, u = Jn.filter(
    (m) => s.actionOn.has(m) || e === "local" && yd.includes(m)
  ).join(" "), g = ve(() => {
    const m = (N) => {
      var b, R;
      const E = c.current;
      if (N === Co) (b = E.onSelectAll) == null || b.call(E);
      else if (N === di) (R = E.onFind) == null || R.call(E);
      else {
        const I = N.startsWith(za), j = E.keyMap.actionOn.get(
          I ? N.slice(za.length) : N
        );
        j !== void 0 && E.onAction(j, I);
      }
    }, q = (N, E = e) => ({
      keys: N,
      surface: E,
      action: (b) => {
        b != null && b.repeat || m((b == null ? void 0 : b.sequence) ?? N);
      }
    }), y = [];
    h && y.push(q(Co, "local")), d && y.push(q(di));
    for (const N of u ? u.split(" ") : [])
      y.push(q(N), q(`${za}${N}`));
    return y;
  }, [e, u, d, h]);
  tl(g, t);
}
const vd = {
  find: di,
  selectAll: wd
};
function ji() {
  return vd;
}
const Nd = 600 * 1e3, Ui = /* @__PURE__ */ new Map(), Ps = /* @__PURE__ */ new Map(), Vn = /* @__PURE__ */ new Map();
function xs(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = Ps.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function Ls(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && Ps.set(e.tagGroupId, e.tagGroupSortOrder), Ui.set(e.id, { tag: e, at: Date.now() });
}
function Ds(e) {
  const t = Ui.get(e);
  if (!(!t || Date.now() - t.at > Nd))
    return xs(t.tag);
}
function _s(e) {
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
function ui(e) {
  var t;
  for (const n of e) {
    const a = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && a && Ls(_s({ ...n, name: a }));
  }
}
function qd(e) {
  const t = Vn.get(e);
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
        if (Vn.get(e) === a && Vn.delete(e), !o) return null;
        const s = _s({ ...i, id: e, name: o }), c = (g = Ui.get(e)) == null ? void 0 : g.tag, d = (c == null ? void 0 : c.tagGroupId) === s.tagGroupId, h = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (d ? c == null ? void 0 : c.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (c == null ? void 0 : c.hasImage),
          imagePath: s.imagePath ?? (c == null ? void 0 : c.imagePath)
        };
        return Ls(h), xs(h);
      },
      () => (Vn.get(e) === a && Vn.delete(e), null)
    )
  };
  return Vn.set(e, a), a;
}
function ko() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function Ja(e) {
  const t = {};
  for (const n of e) {
    const a = Ds(n);
    a !== void 0 && (t[n] = a);
  }
  return t;
}
function Sd(e, t) {
  if (t != null && t.aborted) return Promise.reject(ko());
  const n = {}, a = [];
  for (const i of new Set(e)) {
    const o = Ds(i);
    if (o !== void 0) n[i] = o;
    else {
      const s = qd(i);
      s.waiters += 1, a.push({ id: i, entry: s });
    }
  }
  return a.length ? new Promise((i, o) => {
    let s = !1;
    const c = () => {
      for (const { id: h, entry: u } of a)
        u.waiters -= 1, u.waiters === 0 && Vn.get(h) === u && (Vn.delete(h), u.controller.abort());
    }, d = () => {
      s || (s = !0, c(), o(ko()));
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
function js(e) {
  const t = {};
  for (const [n, a] of Object.entries(e)) t[Number(n)] = (a == null ? void 0 : a.name) ?? null;
  return t;
}
function Gi(e) {
  const t = [...new Set(e)].sort((i, o) => i - o).join(","), [n, a] = k(() => ({
    key: t,
    tags: Ja(Qa(t))
  }));
  return H(() => {
    const i = Qa(t), o = Ja(i);
    if (a({ key: t, tags: o }), i.every((c) => c in o)) return;
    const s = new AbortController();
    return Sd(i, s.signal).then(
      (c) => a({ key: t, tags: c }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : Ja(Qa(t));
}
function Rr(e) {
  const t = Gi(e);
  return ve(() => js(t), [t]);
}
function Qa(e) {
  return e ? e.split(",").map(Number) : [];
}
const Ed = "(max-width: 760px)";
function Us(e) {
  const [t] = k(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = mn(
    (a) => (t == null || t.addEventListener("change", a), () => t == null ? void 0 : t.removeEventListener("change", a)),
    [t]
  );
  return vi(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function Zr() {
  return Us(Ed);
}
function Cd(e, t, n = !1) {
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
function hr(e, t, n = [], a) {
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
      (c) => Cd(
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
function Ki({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  canStay: i = !0,
  tapStays: o = !1,
  onApply: s,
  onClose: c
}) {
  const d = Zr(), [h, u] = k(""), [g, m] = k(0), q = $(null), y = $(null), N = $(null), E = $(null), b = $(null), R = $(/* @__PURE__ */ new Set()), I = dt(), j = Rr(ve(() => $a(e), [e])), D = Tr(e), U = ve(() => {
    const _ = h.trim().toLocaleLowerCase(), B = (v) => v ? Jn.indexOf(v) : Jn.length;
    return e.map((v, T) => ({ action: v, index: T, key: D.keys[T] })).sort((v, T) => B(v.key) - B(T.key)).filter((v) => !_ || v.action.label.toLocaleLowerCase().includes(_));
  }, [e, D, h]), Z = U.length ? Math.min(g, U.length - 1) : -1, te = (_) => `${I}-option-${_}`;
  $t(() => {
    var _, B, v;
    return E.current = document.activeElement, b.current = ((B = (_ = N.current) == null ? void 0 : _.parentElement) == null ? void 0 : B.closest('[role="dialog"]')) ?? null, (v = q.current) == null || v.focus({ preventScroll: !0 }), () => {
      var z;
      const T = E.current;
      T instanceof HTMLElement && T.isConnected && T.focus({ preventScroll: !0 }), document.activeElement !== T && ((z = b.current) != null && z.isConnected) && b.current.focus({ preventScroll: !0 });
    };
  }, []), H(() => {
    var _, B, v;
    Z < 0 || (v = (B = (_ = y.current) == null ? void 0 : _.querySelector(`[id="${te(U[Z].index)}"]`)) == null ? void 0 : B.scrollIntoView) == null || v.call(B, { block: "nearest" });
  }, [Z, U]);
  function ne(_, B) {
    !_ || a != null && a(_.action) || s(_.action, i && B);
  }
  function ie(_) {
    var v;
    _.stopPropagation();
    const B = _.code || _.key;
    if (_.repeat && !R.current.has(B)) {
      _.preventDefault();
      return;
    }
    if (_.repeat || R.current.add(B), _.key === "Escape")
      _.preventDefault(), c();
    else if (_.key === "Enter")
      _.preventDefault(), _.repeat || ne(U[Z], _.shiftKey);
    else if (_.key === "ArrowDown" || _.key === "ArrowUp") {
      if (_.preventDefault(), !U.length) return;
      const T = _.key === "ArrowDown" ? 1 : -1;
      m((Z + T + U.length) % U.length);
    } else _.key === "Tab" && (_.preventDefault(), (v = q.current) == null || v.focus());
  }
  return /* @__PURE__ */ l(ue, { children: [
    /* @__PURE__ */ r("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: c }),
    /* @__PURE__ */ l(
      "div",
      {
        ref: N,
        role: "dialog",
        "aria-label": "Find an action",
        className: `dq-find-action${d ? " dq-find-mobile" : ""}`,
        onKeyDown: ie,
        onMouseDown: (_) => {
          _.target !== q.current && _.preventDefault();
        },
        children: [
          /* @__PURE__ */ l("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ r(Jr, { "aria-hidden": "true" }),
            /* @__PURE__ */ r(
              "input",
              {
                ref: q,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${I}-list`,
                "aria-activedescendant": Z >= 0 ? te(U[Z].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: h,
                onChange: (_) => {
                  u(_.target.value), m(0);
                }
              }
            ),
            !d && /* @__PURE__ */ r("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          U.length ? /* @__PURE__ */ r(
            "ul",
            {
              ref: y,
              id: `${I}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: U.map((_, B) => /* @__PURE__ */ r("li", { role: "none", children: /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: te(_.index),
                  tabIndex: -1,
                  "aria-selected": B === Z,
                  disabled: (a == null ? void 0 : a(_.action)) ?? !1,
                  onClick: (v) => ne(_, v.shiftKey || o && ti(_.action)),
                  children: [
                    d ? null : _.key ? /* @__PURE__ */ r("kbd", { children: _.key }) : /* @__PURE__ */ r("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ r("span", { className: "dq-find-label", children: _.action.label }),
                    /* @__PURE__ */ r("span", { className: "dq-find-effect", children: hr(_.action, j, t, n).map(
                      (v, T) => /* @__PURE__ */ r("span", { "data-effect-tone": v.tone, children: v.text }, T)
                    ) })
                  ]
                }
              ) }, _.action.id))
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
function Gs() {
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
function Bi(e) {
  return vi(e.subscribe, e.get, e.get);
}
function Ks(e, t) {
  const n = $(t);
  $t(() => {
    n.current !== t && (n.current = t, e.set(null));
  }, [e, t]);
}
function Bs(e, t) {
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
const Ao = Br.map((e, t) => ({
  indent: t,
  keys: e,
  fixed: t === 2 ? ["n", "m", ",", "."] : []
}));
function kd(e, t) {
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
function Vs(e) {
  return Br.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
    (t) => t.length > 0
  );
}
function zs({
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
function Js({
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
          /* @__PURE__ */ r(Jr, { "aria-hidden": "true" }),
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
function Ad({
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
                /* @__PURE__ */ r(Aa, { "aria-hidden": "true" }),
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
function Td({ checked: e, onChange: t }) {
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
function Rd({
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
  onStayOnTapChange: q
}) {
  const y = ji(), N = Tr(e), E = Zr();
  Ks(s, E);
  const b = dt(), R = Rr(
    ve(() => e.flatMap((P) => P.steps.flatMap((Q) => Q.tagIds)), [e])
  ), I = Ao.filter((P) => P.keys.some((Q) => N.actionOn.has(Q))), j = I.includes(Ao[2]), D = e.length - N.actionOn.size, U = ve(
    () => g && !u ? Xr(e) : [],
    [g, u, e]
  ), Z = ve(
    () => U.length && i ? ci(e, i) : null,
    [U, e, i]
  ), te = new Map(
    li(Z ?? []).flatMap(
      (P) => P.actions.filter((Q) => Fs(e[Q])).map((Q) => [Q, P.name])
    )
  ), ne = U.length > 0 && /* @__PURE__ */ r(Ad, { groups: U, statuses: Z, actions: e }), ie = (P) => {
    const Q = hr(e[P], R, [], o).map((G) => G.text).join(", "), J = te.get(P);
    return J === void 0 ? Q : `${Q}. ${J}: not answered yet`;
  }, _ = (P) => ({
    onMouseEnter: () => s.set(P),
    onMouseLeave: () => s.clear(P),
    onFocus: () => s.set(P),
    onBlur: (Q) => {
      Q.currentTarget.contains(Q.relatedTarget) || s.clear(P);
    }
  }), B = (P) => {
    const Q = N.actionOn.get(P), J = Q === void 0 ? void 0 : e[Q];
    if (!J)
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
    const G = n(J), A = `${b}-effect-${P}`;
    return /* @__PURE__ */ l("div", { className: "dq-pad-slot", ...u ? {} : _(J), children: [
      /* @__PURE__ */ r("span", { id: A, className: "dq-sr-only", children: ie(Q) }),
      /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: J.label,
          "aria-keyshortcuts": P,
          "aria-describedby": A,
          "data-group-open": te.has(Q) || void 0,
          disabled: G,
          onClick: (Pe) => c(J, Pe.shiftKey),
          children: [
            /* @__PURE__ */ r(at, { binding: P }),
            " ",
            /* @__PURE__ */ r("span", { className: "dq-pad-label", children: J.label }),
            pa(J) && " ",
            pa(J) && /* @__PURE__ */ l("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(ya, { "aria-hidden": "true" }),
              "absent"
            ] })
          ]
        }
      ),
      ti(J) && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-pad-pin",
          "aria-label": `Apply and stay: ${J.label}`,
          title: "Apply and stay (Shift)",
          disabled: G,
          onClick: () => c(J, !0),
          children: /* @__PURE__ */ r(Ei, { "aria-hidden": "true" })
        }
      )
    ] }, P);
  }, v = /* @__PURE__ */ l("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ r(Cr, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (E) {
    const P = Vs(N), Q = (J) => {
      const G = e[J], A = N.keys[J];
      return /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: G.label,
          "aria-keyshortcuts": A,
          "aria-describedby": `${b}-effect-${A}`,
          "data-group-open": te.has(J) || void 0,
          disabled: n(G),
          onClick: (Pe) => {
            s.clear(G), c(G, Pe.shiftKey || m && ti(G));
          },
          ...u ? {} : Bs(s, G),
          children: [
            /* @__PURE__ */ r("span", { className: "dq-mobile-label", children: G.label }),
            pa(G) && " ",
            pa(G) && /* @__PURE__ */ l("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(ya, { "aria-hidden": "true" }),
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
              To,
              {
                actions: e,
                keyMap: N,
                names: R,
                tags: i,
                trees: o,
                preview: s,
                findKey: y.find,
                mobile: !0
              }
            ),
            q && /* @__PURE__ */ r(Td, { checked: m, onChange: q })
          ] }),
          ne,
          /* @__PURE__ */ r("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ r(
            zs,
            {
              groups: P,
              renderAction: Q,
              find: /* @__PURE__ */ r(
                Js,
                {
                  extra: D,
                  findKey: y.find,
                  disabled: h,
                  onFind: d
                }
              )
            }
          ) }),
          /* @__PURE__ */ r("div", { hidden: !0, children: P.flat().map((J) => /* @__PURE__ */ r("span", { id: `${b}-effect-${N.keys[J]}`, children: ie(J) }, J)) })
        ]
      }
    );
  }
  const T = /* @__PURE__ */ l("span", { className: "dq-pad-hint", children: [
    /* @__PURE__ */ r("kbd", { className: "dq-key", children: "Shift" }),
    /* @__PURE__ */ r("span", { children: "+ key applies and stays" })
  ] }), z = !j && /* @__PURE__ */ l(
    "button",
    {
      type: "button",
      className: "dq-pad-find-button",
      "aria-label": D ? `Find action, ${D} more` : "Find action",
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
            To,
            {
              actions: e,
              keyMap: N,
              names: R,
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
              z
            ] })
          ) : /* @__PURE__ */ l(ue, { children: [
            !u && T,
            z
          ] })
        ] }),
        I.map((P) => /* @__PURE__ */ l("div", { className: "dq-pad-row", "data-indent": P.indent, children: [
          P.keys.map(B),
          P.fixed.map((Q) => {
            const J = kd(Q, t);
            return /* @__PURE__ */ l(
              "div",
              {
                className: `dq-pad-slot dq-pad-free dq-pad-fixed${J ? " dq-pad-reserved" : ""}`,
                "aria-hidden": "true",
                children: [
                  /* @__PURE__ */ r(at, { binding: Q }),
                  J && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: J })
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
              "aria-label": D ? `Find action, ${D} more` : "Find action",
              "aria-keyshortcuts": y.find,
              disabled: h,
              onClick: d,
              children: [
                /* @__PURE__ */ r(at, { binding: y.find }),
                /* @__PURE__ */ l("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ r(Jr, { "aria-hidden": "true" }),
                  D ? `${D} more` : "Find action"
                ] })
              ]
            }
          ) })
        ] }, P.indent))
      ]
    }
  );
}
function To({
  actions: e,
  keyMap: t,
  names: n,
  tags: a,
  trees: i,
  preview: o,
  findKey: s,
  mobile: c = !1
}) {
  const d = Bi(o), h = d ? e.indexOf(d) : -1;
  if (!d || h < 0) {
    const q = t.actionOn.size;
    return /* @__PURE__ */ l("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      !c && q < e.length && /* @__PURE__ */ l(ue, { children: [
        ` · ${q} on keys, ${e.length - q} more under `,
        /* @__PURE__ */ r(at, { binding: s })
      ] })
    ] });
  }
  const u = t.keys[h], g = a && d.steps.length ? Di(d, a, i) : null, m = g && !g.unresolvedTrees.length && ![g.added, g.removed, g.markedAbsent, g.absenceCleared].some(
    (q) => q.length
  );
  return /* @__PURE__ */ l("p", { className: "dq-pad-effect", children: [
    u && !c && /* @__PURE__ */ r(at, { binding: u }),
    /* @__PURE__ */ r("strong", { children: d.label }),
    hr(d, n, [], i).map((q, y) => /* @__PURE__ */ r("span", { "data-effect-tone": q.tone, children: q.text }, y)),
    m && /* @__PURE__ */ r("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function Qs({
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
  paused: q = !1
}) {
  const y = ji(), N = Tr(e), E = Zr(), b = dt(), R = Rr(ve(() => $a(e), [e])), [I] = k(() => Gs());
  Ks(I, E);
  const j = $(null), D = Od(j, e, !E), U = Vs(N);
  !U.length && e.length && U.push([]);
  const Z = U.flat(), te = e.length - Z.length, ne = (v) => hr(v, R, t, n).map((T) => T.text).join(", "), ie = (v) => ({
    onMouseEnter: () => I.set(v),
    onMouseLeave: () => I.clear(v),
    onFocus: () => I.set(v),
    onBlur: (T) => {
      T.currentTarget.contains(T.relatedTarget) || I.clear(v);
    }
  }), _ = d ?? (E ? void 0 : h), B = (v) => {
    const T = e[v];
    return /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-mobile-tile",
        title: T.label,
        "aria-keyshortcuts": N.keys[v] || void 0,
        "aria-describedby": `${b}-effect-${v}`,
        disabled: q || a(T),
        onClick: () => {
          I.clear(T), o(T);
        },
        ...q ? {} : Bs(I, T),
        children: /* @__PURE__ */ r("span", { className: "dq-mobile-label", children: T.label })
      },
      T.id
    );
  };
  return /* @__PURE__ */ l(
    "section",
    {
      ref: j,
      className: `dq-action-bar${E ? " dq-bar-mobile" : D ? " dq-bar-stacked" : ""}${i ? " dq-bar-busy" : ""}${q ? " dq-bar-paused" : ""}${m ? ` ${m}` : ""}`,
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
                zs,
                {
                  groups: U,
                  renderAction: B,
                  find: /* @__PURE__ */ r(
                    Js,
                    {
                      extra: te,
                      findKey: y.find,
                      disabled: q,
                      onFind: s
                    }
                  )
                }
              ),
              !E && U.map((v, T) => /* @__PURE__ */ l("div", { className: "dq-bar-line", children: [
                v.map((z) => {
                  const P = e[z], Q = N.keys[z];
                  return /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: P.label,
                      "aria-keyshortcuts": Q || void 0,
                      "aria-describedby": `${b}-effect-${z}`,
                      disabled: q || a(P),
                      onClick: () => o(P),
                      ...q ? {} : ie(P),
                      children: [
                        Q && /* @__PURE__ */ r(at, { binding: Q }),
                        " ",
                        /* @__PURE__ */ r("span", { className: "dq-bar-label", children: P.label })
                      ]
                    },
                    P.id
                  );
                }),
                T === U.length - 1 && /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "dq-bar-tile dq-bar-find",
                    "aria-label": te > 0 ? `Find action, ${te} more` : "Find action",
                    "aria-keyshortcuts": y.find,
                    disabled: q,
                    onClick: s,
                    children: [
                      /* @__PURE__ */ r(at, { binding: y.find, hidden: !0 }),
                      /* @__PURE__ */ r(Jr, { "aria-hidden": "true" }),
                      /* @__PURE__ */ r("span", { className: "dq-bar-label", children: te > 0 ? `${te} more` : "Find action" })
                    ]
                  }
                )
              ] }, T)),
              !e.length && /* @__PURE__ */ r("p", { className: "dq-bar-empty", children: "This review has no actions." })
            ]
          }
        ),
        _ && /* @__PURE__ */ r("p", { className: "dq-bar-hints", children: _ }),
        q ? /* @__PURE__ */ l("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ r(Cr, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ r(
          $d,
          {
            actions: e,
            keyMap: N,
            preview: I,
            names: R,
            tagGroups: t,
            trees: n,
            showKey: !E
          }
        ),
        u && /* @__PURE__ */ r("div", { className: "dq-bar-notices", children: u }),
        /* @__PURE__ */ r("div", { hidden: !0, children: Z.map((v) => /* @__PURE__ */ r("span", { id: `${b}-effect-${v}`, children: ne(e[v]) }, e[v].id)) }),
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: g })
      ]
    }
  );
}
function Od(e, t, n) {
  const [a, i] = k(!1);
  return $t(() => {
    var u;
    const o = e.current;
    if (!o || !n || typeof ResizeObserver > "u") return;
    const s = o.querySelector(".dq-bar-summary"), c = () => {
      const g = getComputedStyle(o), m = parseFloat(g.columnGap) || 0, q = o.clientWidth - (parseFloat(g.paddingLeft) || 0) - (parseFloat(g.paddingRight) || 0), y = [...o.querySelectorAll(".dq-bar-line")].map(
        (Z) => [...Z.children].map((te) => te.offsetWidth)
      ), N = o.querySelector(".dq-bar-line"), E = N && parseFloat(getComputedStyle(N).columnGap) || 0, b = o.querySelector(".dq-bar-hints"), R = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (b ? b.offsetWidth + m : 0) + 1 + // the divider
      2 * m, I = (Z) => y.map((te) => {
        let ne = 1, ie = 0;
        for (const _ of te)
          ie > 0 && ie + E + _ > Z ? (ne += 1, ie = _) : ie += (ie > 0 ? E : 0) + _;
        return ne;
      }), j = (Z) => Math.max(1, Z.reduce((te, ne) => te + ne, 0)), D = I(q), U = j(I(q - R));
      i(
        1 + j(D) < U || 1 + j(D) === U && D.every((Z) => Z === 1)
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
function $d({
  actions: e,
  keyMap: t,
  preview: n,
  names: a,
  tagGroups: i,
  trees: o,
  showKey: s
}) {
  const c = Bi(n), d = c ? e.indexOf(c) : -1;
  if (!c || d < 0) return null;
  const h = t.keys[d];
  return /* @__PURE__ */ l("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    h && s && /* @__PURE__ */ r(at, { binding: h }),
    /* @__PURE__ */ r("strong", { children: c.label }),
    hr(c, a, i, o).map((u, g) => /* @__PURE__ */ r("span", { "data-effect-tone": u.tone, children: u.text }, g))
  ] });
}
const Ro = 1e3;
async function Id(e, t, n) {
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
          $n({
            findFilter: {
              page: d,
              perPage: Ro,
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
    if (d * Ro >= h.totalCount) break;
    if (!h.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const o = [...i.values()], s = xe(e), c = Te(e) ? await Fd(
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
function Md(e) {
  return JSON.stringify(
    $n({
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
async function Fd(e, t, n) {
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
              `/api/${Hn(e)}/aggregate`,
              {
                method: "POST",
                signal: i.signal,
                body: Md(t[c])
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
function Pd(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((a) => t.has(a.id) ? !1 : (t.add(a.id), !0))
  }));
}
function xd(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of n.children)
      t.set(a.id, [...t.get(a.id) ?? [], n.parent.id]);
  return t;
}
function Ld(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of Ar(n))
      t.set(a, [...t.get(a) ?? [], n]);
  return t;
}
function Dd(e, t, n) {
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
function _d(e, t) {
  var a;
  const n = ur(e);
  return ((a = Xr(t).find((i) => i.key === n)) == null ? void 0 : a.name) ?? e.trim();
}
const jd = (e) => e instanceof Error ? e.message : "Request failed.";
function Ud({
  id: e,
  review: t,
  disabled: n,
  onAdd: a,
  onCancel: i
}) {
  const [o, s] = k([]), [c, d] = k({}), [h, u] = k({}), [g, m] = k({}), q = $(/* @__PURE__ */ new Map());
  H(
    () => () => {
      for (const v of q.current.values()) v.abort();
    },
    []
  );
  const y = bn(xe(t)), N = Te(t), E = N ? "performer" : y.one;
  function b(v) {
    var z;
    (z = q.current.get(v)) == null || z.abort();
    const T = new AbortController();
    q.current.set(v, T), d((P) => ({ ...P, [v]: { status: "loading" } })), Id(t, v, T.signal).then(
      (P) => {
        T.signal.aborted || d((Q) => ({
          ...Q,
          [v]: { status: "ready", group: P }
        }));
      },
      (P) => {
        T.signal.aborted || d((Q) => ({
          ...Q,
          [v]: { status: "failed", message: jd(P) }
        }));
      }
    );
  }
  function R(v) {
    var J;
    const T = o.filter((G) => !v.includes(G));
    for (const G of T)
      (J = q.current.get(G)) == null || J.abort(), q.current.delete(G);
    const z = (G) => {
      const A = c[G];
      return (A == null ? void 0 : A.status) === "ready" ? A.group.children.map((Pe) => Pe.id) : [];
    }, P = new Set(v.flatMap(z)), Q = T.flatMap(z).filter((G) => !P.has(G));
    u(
      (G) => Object.fromEntries(
        Object.entries(G).filter(([A]) => !Q.includes(Number(A)))
      )
    ), m(
      (G) => Object.fromEntries(
        Object.entries(G).filter(([A]) => v.includes(Number(A)))
      )
    ), d(
      (G) => Object.fromEntries(
        Object.entries(G).filter(([A]) => v.includes(Number(A)))
      )
    ), s(v);
    for (const G of v) o.includes(G) || b(G);
  }
  const I = o.flatMap((v) => {
    const T = c[v];
    return (T == null ? void 0 : T.status) === "ready" ? [T.group] : [];
  }), j = I.length === o.length, D = o.some(
    (v) => {
      var T;
      return (((T = c[v]) == null ? void 0 : T.status) ?? "loading") === "loading";
    }
  ), U = new Map(
    Pd(I).map((v) => [v.parent.id, v])
  ), Z = xd(I), te = new Map(I.map((v) => [v.parent.id, v.parent.name])), ne = Ld(t.actions), ie = (v) => h[v] ?? !ne.has(v), _ = j ? [...U.values()].flatMap((v) => {
    const T = _d(v.parent.name, t.actions);
    return v.children.filter((z) => ie(z.id)).map((z) => ({ child: z, answerGroup: T }));
  }) : [], B = (v, T) => u((z) => ({
    ...z,
    ...Object.fromEntries(v.children.map((P) => [P.id, T]))
  }));
  return /* @__PURE__ */ l("fieldset", { id: e, className: "dq-actions-from-tags", children: [
    /* @__PURE__ */ r("legend", { children: "Add actions from parent tags" }),
    /* @__PURE__ */ l("p", { className: "dq-drawer-note", children: [
      "Each ticked child tag becomes an action that adds it, most used",
      " ",
      N ? "on performers " : "",
      "first, in a group named after its parent. Tags an action already adds start unticked. The new actions go at the end, ready to reorder and edit."
    ] }),
    /* @__PURE__ */ r(
      Rn,
      {
        entityType: "tag",
        values: o,
        onChange: R,
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
              onClick: () => b(v),
              children: "Retry"
            }
          )
        ] }, v);
      const z = U.get(v);
      if (!z) return null;
      const P = z.parent.name;
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
                onChange: (Q) => m((J) => ({
                  ...J,
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
          z.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ l(ue, { children: [
            /* @__PURE__ */ l("div", { className: "dq-row", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${P}`,
                  onClick: () => B(z, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${P}`,
                  onClick: () => B(z, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ r("div", { className: "dq-child-tags", children: z.children.map((Q) => {
              const J = ne.get(Q.id) ?? [], G = (Z.get(Q.id) ?? []).filter((A) => A !== v).map((A) => `“${te.get(A)}”`);
              return /* @__PURE__ */ l("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "checkbox",
                    checked: ie(Q.id),
                    disabled: n,
                    onChange: (A) => u((Pe) => ({
                      ...Pe,
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
                  G.length > 0 && /* @__PURE__ */ l("small", { children: [
                    " · Also under ",
                    G.join(", ")
                  ] }),
                  J.length > 0 && /* @__PURE__ */ l("small", { children: [
                    " ",
                    "· Already in “",
                    J[0].label || "New action",
                    "”",
                    J.length > 1 ? ` and ${J.length - 1} more` : ""
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
          disabled: n || !_.length,
          onClick: () => a(
            _.map(
              ({ child: v, answerGroup: T }) => Dd(
                v,
                (Z.get(v.id) ?? []).filter(
                  (z) => g[z]
                ),
                T
              )
            )
          ),
          children: _.length ? `Add ${_.length} action${_.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: i, children: "Cancel" }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-sr-only", children: D ? "Loading child tags…" : "" })
    ] })
  ] });
}
const Gd = ["n", "m"], Bn = [
  ...Br,
  ["auto", Qn]
];
function Ea(e) {
  return e.toLocaleUpperCase();
}
function Ws(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : $i(e[n]);
}
function Kd({
  actions: e,
  index: t,
  keyMap: n,
  name: a,
  onChoose: i
}) {
  const [o, s] = k(!1), c = $(null), d = n.keys[t], h = Ws(e, n, t), u = cr(h), g = n.duplicatePins.has(t) ? ` (${Ea(e[t].shortcut ?? "")} is pinned twice)` : "", m = d ? `${Ea(d)}, ${u ? "pinned" : "Auto"}${g}` : h === Qn ? "no key, Find action only" : `no key: Auto found no free key${g}`, q = () => {
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
          u && /* @__PURE__ */ r(Ei, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ r(
      Bd,
      {
        actions: e,
        index: t,
        keyMap: n,
        name: a,
        onChoose: (y) => {
          i(y), q();
        },
        onClose: q
      }
    )
  ] });
}
function Bd({
  actions: e,
  index: t,
  keyMap: n,
  name: a,
  onChoose: i,
  onClose: o
}) {
  const s = $(null), c = n.keys[t], d = Ws(e, n, t), [h, u] = k(c || "q"), g = (N) => {
    var E;
    return ((E = s.current) == null ? void 0 : E.querySelector(`[data-choice="${N}"]`)) ?? null;
  };
  $t(() => {
    var N, E, b;
    (N = g(c || d)) == null || N.focus(), (b = (E = s.current) == null ? void 0 : E.scrollIntoView) == null || b.call(E, { block: "nearest" });
  }, []);
  function m(N) {
    var E;
    cr(N) && u(N), (E = g(N)) == null || E.focus();
  }
  function q(N) {
    var U, Z, te;
    if (N.key === "Escape") {
      N.preventDefault(), N.stopPropagation(), o();
      return;
    }
    if (N.key === "Tab") {
      const ne = [...((U = s.current) == null ? void 0 : U.querySelectorAll("button[tabindex='0']")) ?? []], ie = ne.indexOf(document.activeElement);
      N.preventDefault(), (Z = ne[(ie + (N.shiftKey ? -1 : 1) + ne.length) % ne.length]) == null || Z.focus();
      return;
    }
    const E = (te = N.target.dataset) == null ? void 0 : te.choice, b = E ? Bn.findIndex((ne) => ne.includes(E)) : -1;
    if (!E || b < 0) return;
    const R = Bn[b].indexOf(E), I = (ne) => ne == null ? void 0 : ne[Math.min(R, ne.length - 1)], j = {
      ArrowLeft: Bn[b][R - 1],
      ArrowRight: Bn[b][R + 1],
      ArrowUp: I(Bn[b - 1]),
      ArrowDown: I(Bn[b + 1]),
      Home: Bn[b][0],
      End: Bn[b].at(-1)
    };
    if (!Object.hasOwn(j, N.key)) return;
    N.preventDefault();
    const D = j[N.key];
    D && m(D);
  }
  const y = (N) => {
    const E = cr(N) ? n.actionOn.get(N) : void 0;
    return E === void 0 ? null : {
      own: E === t,
      label: e[E].label.trim() || "New action",
      pinned: $i(e[E]) === N
    };
  };
  return /* @__PURE__ */ l(ue, { children: [
    /* @__PURE__ */ r(
      "div",
      {
        className: "dq-key-picker-backdrop",
        "aria-hidden": "true",
        onMouseDown: (N) => {
          N.preventDefault(), o();
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
        onKeyDown: q,
        onMouseDown: (N) => N.preventDefault(),
        children: [
          /* @__PURE__ */ l("p", { className: "dq-key-picker-title", children: [
            "Key for ",
            /* @__PURE__ */ r("strong", { children: a })
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: Br.map((N, E) => /* @__PURE__ */ l("div", { className: "dq-key-picker-row", "data-indent": E, children: [
            N.map((b) => {
              const R = y(b), I = R ? `${R.own ? "this action" : R.label}, ${R.pinned ? "pinned" : "Auto"}` : "free";
              return /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  className: `dq-key-choice${R ? "" : " dq-key-choice-free"}${R != null && R.own ? " dq-key-choice-own" : ""}`,
                  "data-choice": b,
                  tabIndex: b === h ? 0 : -1,
                  "aria-label": `${Ea(b)}: ${I}`,
                  "aria-pressed": !!(R != null && R.own && R.pinned),
                  title: R ? `${R.label} (${R.pinned ? "pinned" : "Auto"})` : void 0,
                  onFocus: () => u(b),
                  onClick: () => i(b),
                  children: [
                    /* @__PURE__ */ l("span", { className: "dq-key-choice-head", children: [
                      /* @__PURE__ */ r(at, { binding: b }),
                      (R == null ? void 0 : R.pinned) && /* @__PURE__ */ r(Ei, { "aria-hidden": "true" })
                    ] }),
                    R && /* @__PURE__ */ r("span", { className: "dq-key-choice-label", children: R.label })
                  ]
                },
                b
              );
            }),
            E === Br.length - 1 && Gd.map((b) => (
              // Unavailable, yet not disabled: a browser gives a disabled button no press for
              // the panel to keep, and moves focus out of the picker. This one chooses nothing
              // and is never focused (the arrow keys and Tab pass it by).
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-key-choice dq-key-choice-free",
                  "aria-label": `${Ea(b)}: not available, it steps through the grid preview`,
                  title: "Steps through the grid preview",
                  "aria-disabled": "true",
                  tabIndex: -1,
                  children: /* @__PURE__ */ r("span", { className: "dq-key-choice-head", children: /* @__PURE__ */ r(at, { binding: b }) })
                },
                b
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
                "data-choice": Qn,
                tabIndex: 0,
                "aria-pressed": d === Qn,
                onClick: () => i(Qn),
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
const Vd = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function zd(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function Jd(e, t) {
  if (On(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (Ii(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function Hs(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function Qd(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function Wd({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: a,
  saving: i,
  expandedId: o,
  onExpand: s,
  reveal: c
}) {
  const d = _e(e), h = d !== "tag", u = e.actions, g = Tr(u), m = Rr(ve(() => $a(u), [u])), q = ve(
    () => h ? Xr(u).map((K) => K.name) : [],
    [h, u]
  ), y = h && e.stayUntilGroupsAnswered === !0, N = ve(
    () => new Set(
      y ? gd(u).map((K) => K.key) : []
    ),
    [y, u]
  ), [E, b] = k(""), [R, I] = k(!1), [j, D] = k(
    null
  ), U = dt(), Z = `${U}-from-tags`, te = $(null), ne = $(null), ie = $(null), _ = $(null), B = $(/* @__PURE__ */ new WeakMap()), v = (K) => {
    let Ne = B.current.get(K);
    return Ne || (Ne = crypto.randomUUID(), B.current.set(K, Ne)), Ne;
  }, T = E.trim().toLocaleLowerCase(), z = T ? u.filter((K) => K.label.toLocaleLowerCase().includes(T)) : u, P = (K) => t({ ...e, actions: K }), Q = (K, Ne) => P(u.map((Ke, Se) => Se === K ? Ne : Ke));
  function J(K) {
    var Ne;
    return [...((Ne = ie.current) == null ? void 0 : Ne.querySelectorAll("[data-action-id]")) ?? []].find(
      (Ke) => Ke.dataset.actionId === K
    );
  }
  function G(K, Ne) {
    const Ke = J(K), Se = Ke == null ? void 0 : Ke.querySelector(
      Ne === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return Se == null || Se.focus(), !!Se;
  }
  $t(() => {
    var Ne;
    const K = _.current;
    K && (_.current = null, (K === "add" || !G(K.id, K.part)) && ((Ne = ne.current) == null || Ne.focus()));
  }), H(() => {
    !c || !o || (z.some((K) => K.id === o) ? G(o, "label") : (b(""), _.current = { id: o, part: "label" }));
  }, [c]);
  function A() {
    const K = Qd(d);
    b(""), P([...u, K]), s(K.id), _.current = { id: K.id, part: "label" };
  }
  function Pe(K) {
    const Ne = u[K], { shortcut: Ke, ...Se } = structuredClone(Ne), He = {
      ...Se,
      ...Ke === Qn ? { shortcut: Ke } : {},
      id: crypto.randomUUID(),
      label: `${Ne.label} copy`
    };
    P([...u.slice(0, K + 1), He, ...u.slice(K + 1)]), s(He.id), _.current = { id: He.id, part: "label" };
  }
  function we(K) {
    const Ne = u[K], Ke = z.indexOf(Ne), Se = z[Ke + 1] ?? z[Ke - 1];
    P(u.filter((He, Ee) => Ee !== K)), o === Ne.id && s(null), _.current = Se ? { id: Se.id, part: "toggle" } : "add";
  }
  function tt() {
    I(!1), requestAnimationFrame(() => {
      var K;
      return (K = te.current) == null ? void 0 : K.focus();
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
              /* @__PURE__ */ r(Ci, { "aria-hidden": "true" }),
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
            "aria-expanded": R,
            "aria-controls": R ? Z : void 0,
            onClick: () => {
              D(null), I(!R);
            },
            children: "Add from parent tags…"
          }
        ),
        /* @__PURE__ */ l("label", { className: "dq-actions-filter", children: [
          /* @__PURE__ */ r(Jr, { "aria-hidden": "true" }),
          /* @__PURE__ */ r(
            "input",
            {
              type: "search",
              "aria-label": "Find an action",
              placeholder: "Find an action…",
              autoComplete: "off",
              spellCheck: !1,
              value: E,
              onChange: (K) => b(K.target.value),
              onKeyDown: (K) => {
                K.key === "Escape" && E && (K.preventDefault(), K.stopPropagation(), b(""));
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
              "aria-describedby": `${U}-groups-note`,
              onChange: (K) => t({
                ...e,
                stayUntilGroupsAnswered: K.target.checked ? !0 : void 0
              })
            }
          ),
          "Stay until every group is answered"
        ] }),
        /* @__PURE__ */ r("p", { className: "dq-actions-hint", id: `${U}-groups-note`, children: y && !q.length ? "No action has a group yet: give the actions of each question the same group." : "Single-item view: a plain action moves on once every group has an answer." })
      ] }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-actions-status", children: (j == null ? void 0 : j.actions) === u ? `Added ${j.count} action${j.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    h && R && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here.
    /* @__PURE__ */ r(
      "div",
      {
        onKeyDown: (K) => {
          K.key !== "Escape" || K.defaultPrevented || (K.preventDefault(), K.stopPropagation(), tt());
        },
        children: /* @__PURE__ */ r(
          Ud,
          {
            id: Z,
            review: e,
            disabled: i,
            onAdd: (K) => {
              const Ne = [...u, ...K];
              P(Ne), D({ actions: Ne, count: K.length }), tt();
            },
            onCancel: tt
          }
        )
      }
    ),
    /* @__PURE__ */ r("div", { ref: ie, children: z.length > 0 && /* @__PURE__ */ r(
      es,
      {
        items: z,
        getKey: (K) => K.id,
        disabled: i || !!T,
        className: "dq-action-list",
        onReorder: (K) => P(K),
        renderItem: (K, { dragHandleProps: Ne, isOver: Ke }) => {
          const Se = u.indexOf(K), He = o === K.id;
          return /* @__PURE__ */ r(
            Hd,
            {
              action: K,
              entityType: d,
              keyButton: /* @__PURE__ */ r(
                Kd,
                {
                  actions: u,
                  index: Se,
                  keyMap: g,
                  name: K.label.trim() || "New action",
                  onChoose: (Ee) => P(Ol(u, Se, Ee))
                }
              ),
              takenPin: g.duplicatePins.has(Se) ? K.shortcut : void 0,
              groupUnanswerable: "steps" in K && N.has(ur(K.group)),
              effect: hr(K, m, n, a),
              open: He,
              detailId: `${U}-detail-${K.id}`,
              dragHandleProps: Ne,
              isOver: Ke,
              reorderDisabled: i || !!T,
              onToggle: () => s(He ? null : K.id),
              onDuplicate: () => Pe(Se),
              onDelete: () => we(Se),
              children: "steps" in K ? /* @__PURE__ */ r(
                Zd,
                {
                  action: K,
                  groupNames: q,
                  saving: i,
                  stepKey: v,
                  rememberStepKey: (Ee, Be) => B.current.set(Ee, v(Be)),
                  onChange: (Ee) => Q(Se, Ee)
                }
              ) : /* @__PURE__ */ r(
                tu,
                {
                  action: K,
                  tagGroups: n,
                  onChange: (Ee) => Q(Se, Ee)
                }
              )
            }
          );
        }
      }
    ) }),
    u.length ? !z.length && /* @__PURE__ */ l("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      E.trim(),
      "”."
    ] }) : /* @__PURE__ */ r("p", { className: "dq-actions-empty", children: h ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function Hd({
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
  onDelete: q,
  children: y
}) {
  const N = e.label.trim() || "New action", E = Jd(e, t), b = "steps" in e && ur(e.group) ? e.group.trim() : "";
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
              style: Hs(d.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${N}`,
              title: u ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: u,
              children: /* @__PURE__ */ r(is, { "aria-hidden": "true" })
            }
          ),
          n,
          /* @__PURE__ */ l("div", { className: "dq-action-row-summary", onClick: g, children: [
            /* @__PURE__ */ r("span", { className: "dq-action-row-label", title: N, children: N }),
            b && /* @__PURE__ */ l("span", { className: "dq-action-row-group", title: `Group: ${b}`, children: [
              /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Group: " }),
              b
            ] }),
            !s && /* @__PURE__ */ r("span", { className: "dq-action-row-effect", children: o.map((R, I) => /* @__PURE__ */ r("span", { "data-effect-tone": R.tone, children: R.text }, I)) }),
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
                  `${b} can't be answered`
                ]
              }
            )
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Duplicate ${N}`,
              title: "Duplicate",
              onClick: m,
              children: /* @__PURE__ */ r(os, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Delete ${N}`,
              title: "Delete",
              onClick: q,
              children: /* @__PURE__ */ r(ss, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small dq-action-toggle",
              "aria-label": `${s ? "Collapse" : "Expand"} ${N}`,
              "aria-expanded": s,
              "aria-controls": s ? c : void 0,
              onClick: g,
              children: /* @__PURE__ */ r(cs, { "aria-hidden": "true" })
            }
          )
        ] }),
        s && /* @__PURE__ */ r("div", { id: c, className: "dq-action-detail", children: y })
      ]
    }
  );
}
function Ys({
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
function Yd(e) {
  const { group: t, ...n } = e;
  return n;
}
function Xd({
  action: e,
  groupNames: t,
  onChange: n
}) {
  const a = dt(), i = ur(e.group), o = (s) => n(s ? { ...e, group: s } : Yd(e));
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
    /* @__PURE__ */ r("datalist", { id: a, children: t.filter((s) => ur(s) !== i).map((s) => /* @__PURE__ */ r("option", { value: s }, s)) })
  ] });
}
function Zd({
  action: e,
  groupNames: t,
  saving: n,
  stepKey: a,
  rememberStepKey: i,
  onChange: o
}) {
  const s = dt(), c = $(null), d = $(null);
  $t(() => {
    var g, m;
    const u = d.current;
    u != null && (d.current = null, (m = (g = c.current) == null ? void 0 : g.querySelector(`[data-step-index="${u}"] input`)) == null || m.focus());
  });
  const h = (u) => o({ ...e, steps: u });
  return /* @__PURE__ */ l(ue, { children: [
    /* @__PURE__ */ r(Ys, { action: e, onChange: (u) => o({ ...e, label: u }) }),
    /* @__PURE__ */ r(Xd, { action: e, groupNames: t, onChange: o }),
    /* @__PURE__ */ l("div", { className: "dq-action-field dq-action-field-top", role: "group", "aria-labelledby": s, children: [
      /* @__PURE__ */ r("span", { className: "dq-action-field-name", id: s, children: "Steps" }),
      /* @__PURE__ */ l("div", { className: "dq-steps", ref: c, children: [
        e.steps.length > 0 ? /* @__PURE__ */ r(
          es,
          {
            items: e.steps,
            getKey: a,
            disabled: n,
            className: "dq-step-list",
            onReorder: h,
            renderItem: (u, { index: g, dragHandleProps: m, isOver: q }) => /* @__PURE__ */ r(
              eu,
              {
                step: u,
                index: g,
                dragHandleProps: m,
                isOver: q,
                saving: n,
                onChange: (y) => {
                  i(y, u), h(e.steps.map((N, E) => E === g ? y : N));
                },
                onRemove: () => h(e.steps.filter((y, N) => N !== g))
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
              /* @__PURE__ */ r(Ci, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function eu({
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
      "data-step-tone": zd(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            ...n,
            style: Hs(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${c}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: i,
            children: [
              /* @__PURE__ */ r(is, { "aria-hidden": "true" }),
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
            children: Vd.map(({ mode: d, label: h }) => /* @__PURE__ */ r("option", { value: d, children: h }, d))
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
function tu({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const a = e.effect, i = a.mode === "SET_TAG_GROUP" ? `group:${a.tagGroupId}` : a.mode, o = a.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === a.tagGroupId);
  return /* @__PURE__ */ l(ue, { children: [
    /* @__PURE__ */ r(Ys, { action: e, onChange: (s) => n({ ...e, label: s }) }),
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
function nu({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, a = bn(xe(e)).queue, i = (o) => t({ ...e, occurrence: { ...n, ...o } });
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
function ru({
  review: e,
  onChange: t
}) {
  const n = bn(xe(e)).many;
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
const Xs = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, Zs = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, au = {
  video: Ta,
  audio: us,
  tag: ds,
  performerOccurrence: ls,
  audioPerformerOccurrence: hl
};
function ec({ entityType: e }) {
  const t = au[e];
  return /* @__PURE__ */ r(t, { role: "img", "aria-label": Xs[e] });
}
const iu = 2e6;
function tc(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), a = document.createElement("a");
  a.href = n, a.download = t, a.click(), URL.revokeObjectURL(n);
}
function ou(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function Vi(e) {
  tc([e], ou(e));
}
async function su(e) {
  if (e.size > iu) throw new Error("Review files must be smaller than 2 MB.");
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
function nc({
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
          children: ms.map((s) => /* @__PURE__ */ r("option", { value: s, children: Zs[s] }, s))
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
function cu(e, t) {
  const n = _e(e), a = ["Review"];
  return (n === "video" || n === "tag") && a.push("Appearance"), a.push("Actions"), t && a.push("Tag choices"), a;
}
function lu({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = $(null), a = $(null), i = dt(), o = dt();
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
function rc({
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
  onCancel: q,
  drawerRef: y
}) {
  const [N, E] = k("Review"), [b] = k(
    () => Te(e) && e.occurrence.tagIds.length > 0
  ), [R, I] = k(""), [j, D] = k(null), [U, Z] = k(0), [te, ne] = k(!1), ie = $(null), _ = $(null), B = $(null), v = cu(e, b), T = _e(e), z = ve(() => Er(e), [e]);
  H(() => I(""), [z]), H(() => {
    var Pe, we;
    if (te) return;
    const G = ie.current;
    if (ie.current = null, !G) return;
    (we = G.isConnected && !!((Pe = B.current) != null && Pe.contains(G)) && !(G instanceof HTMLButtonElement && G.disabled) ? G : B.current) == null || we.focus({ preventScroll: !0 });
  }, [te]);
  function P() {
    if (!(s || te)) {
      if (!h) {
        q();
        return;
      }
      ie.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, ne(!0);
    }
  }
  function Q() {
    const G = { ...e, name: e.name.trim() }, A = Vr(G);
    if (!A) {
      I(""), m();
      return;
    }
    if (I(A), !G.name) {
      E("Review"), requestAnimationFrame(() => {
        var we;
        return (we = _.current) == null ? void 0 : we.focus();
      });
      return;
    }
    const Pe = e.actions.find(
      (we) => !On(we, T)
    );
    Pe && (E("Actions"), D(Pe.id), Z((we) => we + 1));
  }
  const J = R || d;
  return /* @__PURE__ */ l(ue, { children: [
    /* @__PURE__ */ l(
      "aside",
      {
        ref: (G) => {
          B.current = G, y && (y.current = G);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (G) => {
          G.key !== "Escape" || G.defaultPrevented || s || (G.preventDefault(), G.stopPropagation(), P());
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
            nl,
            {
              tabs: v.map((G) => ({
                key: G,
                label: G,
                count: G === "Actions" ? e.actions.length : void 0
              })),
              activeTab: N,
              onTabChange: (G) => E(G)
            }
          ) }),
          /* @__PURE__ */ r("div", { className: "dq-drawer-body", children: /* @__PURE__ */ l("fieldset", { className: "dq-drawer-fields", disabled: s, children: [
            /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review settings" }),
            /* @__PURE__ */ l(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Review",
                "aria-label": "Review",
                children: [
                  /* @__PURE__ */ r(
                    nc,
                    {
                      review: e,
                      onChange: t,
                      entityTypeLocked: !0,
                      nameRef: _,
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
                        onChange: (G) => a(G.target.value),
                        children: [
                          /* @__PURE__ */ r("option", { value: "end", children: "Start from the end" }),
                          /* @__PURE__ */ r("option", { value: "beginning", children: "Start from the beginning" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ r("small", { className: "dq-drawer-note", children: "From the end, the queue opens on its last page and works towards the first." })
                  ] }),
                  Te(e) && /* @__PURE__ */ r(ru, { review: e, onChange: t }),
                  /* @__PURE__ */ r("div", { children: /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => Vi(e),
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
                hidden: N !== "Appearance",
                "aria-label": "Appearance",
                children: /* @__PURE__ */ r(du, { review: e, onChange: t })
              }
            ),
            /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel dq-actions-panel",
                role: "tabpanel",
                hidden: N !== "Actions",
                "aria-label": "Actions",
                children: /* @__PURE__ */ r(
                  Wd,
                  {
                    review: e,
                    onChange: t,
                    tagGroups: i,
                    trees: o,
                    saving: s,
                    expandedId: j,
                    onExpand: D,
                    reveal: U
                  }
                )
              }
            ),
            b && Te(e) && /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Tag choices",
                "aria-label": "Tag choices",
                children: /* @__PURE__ */ r(nu, { review: e, onChange: t })
              }
            )
          ] }) }),
          (J || g) && /* @__PURE__ */ l("div", { className: "dq-drawer-notices", children: [
            g,
            J && /* @__PURE__ */ l("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ r(An, { "aria-hidden": "true" }),
              J
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
      lu,
      {
        onKeepEditing: () => ne(!1),
        onDiscard: () => {
          ie.current = null, ne(!1), q();
        }
      }
    )
  ] });
}
function du({
  review: e,
  onChange: t
}) {
  const n = dt(), a = e.view, i = (u) => t({ ...e, view: { ...a, ...u } }), o = /* @__PURE__ */ l("label", { className: "dq-checkbox dq-setting-indent", children: [
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
        Oo,
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
          $o,
          {
            name: `${n}-layout-choice`,
            checked: h === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ r(uu, {}),
            onChoose: () => i({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ r(
          $o,
          {
            name: `${n}-layout-choice`,
            checked: h === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ r(fu, {}),
            onChoose: () => i({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ r(
        Oo,
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
                annotations: m.target.checked ? [...d, u] : d.filter((q) => q !== u)
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
function Oo({
  label: e,
  value: t,
  options: n,
  onChange: a
}) {
  const i = dt();
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
function $o({
  name: e,
  checked: t,
  title: n,
  text: a,
  picture: i,
  onChoose: o
}) {
  const s = dt(), c = dt();
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
function uu() {
  return /* @__PURE__ */ l("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ r("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function fu() {
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
const fi = "The queue differs from the saved review.";
function ac({
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
  trailingEnd: u,
  queueChange: g,
  queueDiffers: m,
  chipsStart: q,
  chipsAfter: y,
  chipsEnd: N
}) {
  const E = $(null);
  bu(E);
  const b = wu(E), [R, I] = k({ differs: m, text: "" });
  return R.differs !== m && I({
    differs: m,
    text: m ? R.differs === !1 ? fi : R.text : ""
  }), /* @__PURE__ */ l("header", { ref: E, className: "dq-review-header", children: [
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
      /* @__PURE__ */ r("span", { className: "dq-review-type", title: Xs[n], children: /* @__PURE__ */ r(ec, { entityType: n }) }),
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
          children: /* @__PURE__ */ r(Cr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    d,
    /* @__PURE__ */ l("div", { className: "dq-review-header-trail", children: [
      h,
      g && /* @__PURE__ */ r(pu, { change: g, onPress: b }),
      u
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    q,
    y && /* @__PURE__ */ r("div", { className: "dq-review-chips-after", children: y }),
    N && /* @__PURE__ */ r("div", { className: "dq-review-chips-end", children: N }),
    /* @__PURE__ */ r("p", { className: "dq-sr-only", "aria-live": "polite", children: R.text })
  ] });
}
function pu({
  change: e,
  onPress: t
}) {
  const n = dt(), a = dt(), i = `${fi} Save these filters to the review.`, o = e.onSave ? `${fi} Go back to the review's saved filters.` : "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.";
  return /* @__PURE__ */ l(ue, { children: [
    e.onSave && /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-header-button dq-queue-button",
        title: i,
        "aria-describedby": n,
        disabled: e.saveDisabled,
        onClick: () => {
          var s;
          t(), (s = e.onSave) == null || s.call(e);
        },
        children: [
          /* @__PURE__ */ r(bl, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-queue-label", children: "Save to review" }),
          /* @__PURE__ */ r("span", { id: n, hidden: !0, children: i })
        ]
      }
    ),
    /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-header-button dq-queue-button",
        title: o,
        "aria-describedby": a,
        disabled: e.resetDisabled,
        onClick: () => {
          t(), e.onReset();
        },
        children: [
          /* @__PURE__ */ r(wl, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-queue-label", children: "Reset" }),
          /* @__PURE__ */ r("span", { id: a, hidden: !0, children: o })
        ]
      }
    )
  ] });
}
const hu = ["queue", "summary", "name", "layout", "range"], mu = {
  queue: ".dq-queue-button",
  summary: ".dq-scope-summary",
  name: ".dq-review-header-lead h1",
  layout: ".dq-layout-switch",
  range: ".dq-review-toolbar > div:first-of-type > div:first-child > span:first-child"
}, gu = "(min-width: 1400px)";
function ba(e) {
  const t = e.querySelector(".dq-review-header-lead"), n = e.querySelector(".dq-review-header-trail");
  if (!t || !n) return !0;
  const a = t.getBoundingClientRect();
  return !a.height || n.getBoundingClientRect().top < a.bottom;
}
function Io(e, t) {
  const n = e.querySelector(".dq-review-header-lead h1"), a = () => {
    e.removeAttribute("data-compact"), n == null || n.style.removeProperty("max-width");
  };
  if (a(), !t) return !0;
  const i = hu.filter(
    (o) => e.querySelector(mu[o])
  );
  for (let o = 1; o <= i.length && !ba(e); o++) {
    if (e.dataset.compact = i.slice(0, o).join(" "), i[o - 1] !== "name" || !n) continue;
    const s = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let c = n.getBoundingClientRect().width;
    for (; !ba(e) && c > 6 * s; )
      c = Math.max(6 * s, c - s), n.style.maxWidth = `${c}px`;
  }
  return ba(e) ? !0 : (a(), !1);
}
function bu(e) {
  const t = Us(gu), [n, a] = k(0), i = $(!1);
  $t(() => {
    e.current && (i.current = !Io(e.current, t));
  }, [e, t, n]), $t(() => {
    const o = e.current;
    o && t && !i.current && !ba(o) && (i.current = !Io(o, t));
  }), H(() => {
    const o = e.current;
    if (!o || !t || typeof ResizeObserver > "u") return;
    const s = new ResizeObserver(() => a((c) => c + 1));
    s.observe(o);
    for (const c of o.querySelectorAll(".dq-review-header-lead, .dq-review-header-trail"))
      s.observe(c);
    return () => s.disconnect();
  }, [e, t]);
}
function wu(e) {
  const t = $(!1);
  return H(() => {
    const n = e.current;
    if (!t.current || !n) return;
    const a = document.activeElement, i = (a == null ? void 0 : a.closest(".dq-queue-button")) ?? null;
    if (a && a !== document.body && !i) {
      t.current = !1;
      return;
    }
    if (i && !i.disabled) return;
    const o = n.querySelector(".dq-queue-button") ?? n.querySelector(".dq-review-header-trail .dq-menu > button");
    !o || o.disabled || (t.current = !1, o.focus());
  }), () => {
    t.current = !0;
  };
}
function ic({
  page: e,
  pages: t,
  onPage: n
}) {
  const [a, i] = k(!1), [o, s] = k(""), c = $(null), d = $(null);
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
        children: /* @__PURE__ */ r(fs, { "aria-hidden": "true" })
      }
    )
  ] });
}
function oc({
  mode: e,
  disabled: t,
  onChange: n
}) {
  return /* @__PURE__ */ l("div", { className: "dq-segmented dq-layout-switch", role: "group", "aria-label": "Review layout", children: [
    /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        title: "One item at a time",
        "aria-pressed": e === "single",
        disabled: t,
        onClick: () => e !== "single" && n("single"),
        children: [
          /* @__PURE__ */ r(gl, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-layout-label", children: "Single" })
        ]
      }
    ),
    /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        title: "Cards in a grid",
        "aria-pressed": e === "multiple",
        disabled: t,
        onClick: () => e !== "multiple" && n("multiple"),
        children: [
          /* @__PURE__ */ r(ki, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-layout-label", children: "Grid" })
        ]
      }
    )
  ] });
}
function yu({
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
function zi({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [a, i] = k(!1), [o, s] = k(!1), c = $(null), d = $(null), h = dt();
  $t(() => {
    if (!a || !d.current || !c.current) return;
    const m = c.current.getBoundingClientRect(), q = d.current.offsetHeight + 12, y = window.innerHeight - m.bottom;
    s(y < q && m.top > y);
  }, [a]), H(() => {
    var m, q;
    a && ((q = (m = d.current) == null ? void 0 : m.querySelector('[role="menuitem"]:not(:disabled)')) == null || q.focus({ preventScroll: !0 }));
  }, [a]), H(() => {
    t && i(!1);
  }, [t]);
  const u = (m = !0) => {
    var q;
    i(!1), m && ((q = c.current) == null || q.focus());
  };
  return /* @__PURE__ */ l("div", { className: `dq-menu${a ? " dq-menu-open" : ""}`, onKeyDown: (m) => {
    var N, E;
    if (!a) return;
    const q = [
      ...((N = d.current) == null ? void 0 : N.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], y = q.indexOf(document.activeElement);
    if (m.key === "Escape")
      m.preventDefault(), m.stopPropagation(), u();
    else if (m.key === "Tab")
      u(!1);
    else if (m.key === "ArrowDown" || m.key === "ArrowUp") {
      if (m.preventDefault(), !q.length) return;
      const b = m.key === "ArrowDown" ? 1 : -1;
      q[(y + b + q.length) % q.length].focus();
    } else (m.key === "Home" || m.key === "End") && (m.preventDefault(), (E = q.at(m.key === "Home" ? 0 : -1)) == null || E.focus());
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
        children: /* @__PURE__ */ r(ml, { "aria-hidden": "true" })
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
          children: e.map((m) => /* @__PURE__ */ l(Ni, { children: [
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
function Ca(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Ji(e) {
  return String(e.type).toLowerCase() === "tag";
}
function Qi(e) {
  return !!String(e ?? "").trim();
}
function Wi(e) {
  return [
    ...new Set(
      Ca(e.customFieldCriteria).filter(Ji).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !Qi(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function Hi(e, t) {
  const n = Ca(e.customFieldCriteria);
  if (!n.length) return e;
  let a = !1;
  const i = n.map((o) => {
    if (!Ji(o)) return o;
    const s = { ...o };
    for (const [c, d] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const h = t[String(o[c] ?? "")];
      h && !Qi(o[d]) && (s[d] = h, a = !0);
    }
    return s;
  });
  return a ? { ...e, customFieldCriteria: i } : e;
}
function sc(e, t, n) {
  const a = Ca(e.customFieldCriteria);
  if (!a.length) return e;
  const i = Ca(n.customFieldCriteria), o = (d, h) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (u) => (d[u] ?? void 0) === (h[u] ?? void 0)
  );
  let s = !1;
  const c = a.map((d) => {
    if (!Ji(d)) return d;
    const h = i.find((g) => o(g, d));
    if (!h) return d;
    const u = { ...d };
    for (const [g, m] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const q = t[String(d[g] ?? "")];
      q && d[m] === q && !Qi(h[m]) && (delete u[m], s = !0);
    }
    return u;
  });
  return s ? { ...e, customFieldCriteria: c } : e;
}
async function vu(e, t, n) {
  if (!On(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const a = xe(e), i = n.steps.some((c) => Tn(c.mode)) ? await dd(a) : "", o = await xi(n);
  let s = t.applications;
  for (const c of [
    ...o.filter((d) => !Tn(d.mode)),
    ...o.filter((d) => Tn(d.mode))
  ]) {
    const d = (h) => ud(
      i,
      a,
      t.media.id,
      t.performer.id,
      c.tagIds,
      h
    );
    (c.mode === "MARK_PRESENT" || c.mode === "CLEAR_ABSENCE") && await d("REMOVE"), c.mode !== "CLEAR_ABSENCE" && (s = await uc(
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
async function Yi(e, t) {
  const n = e.occurrence;
  if (Ri(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const a = /* @__PURE__ */ new Set(), { _filterExpression: i, ...o } = n.performerFilter;
  for (let s = 1; ; s++) {
    const c = await le("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        $n({
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
function cc(e) {
  return Kr(e.condition) && e.hideConfirmedAbsent !== !1;
}
function Xi(e, t) {
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
  }, s = cc(i) && (t == null ? void 0 : t.length) === 1 && i.conditionTagIds.length === 1 ? `${t[0]}:${i.conditionTagIds[0]}` : null;
  return {
    ...e,
    entityType: xe(e),
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
                      key: Ra,
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
async function Zi(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => Oa([n], t))
  );
}
function lc(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function Nu(e, t, n = e.conditionTagIds.map((a) => [a])) {
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
function qu(e, t, n, a, i) {
  if (!cc(e)) return !1;
  const o = Ts(t, n);
  return e.conditionTagIds.every(
    (s, c) => o.includes(s) || i[c].some((d) => a.includes(d))
  );
}
async function dc(e, t, n, a) {
  if ((t == null ? void 0 : t.length) === 0 || lc(e.occurrence))
    return { items: [], totalCount: 0 };
  const i = xe(e), o = await jr(
    Xi(e, t),
    { ...e.view.filter, page: n },
    a
  ), s = t === null ? null : new Set(t), c = e.occurrence, d = o.items.length ? await Zi(c, a) : [], h = new Array(o.items.length);
  let u = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, o.items.length) }, async () => {
      for (; u < o.items.length; ) {
        const g = u++, m = o.items[g], q = await le(
          `/api/tagapplications?hostType=${i}&hostId=${m.id}&contextType=performer`,
          { signal: a }
        );
        h[g] = m.performers.filter((y) => s === null || s.has(y.id)).flatMap((y) => {
          const N = q.filter(
            (b) => b.hostType === i && b.hostId === m.id && b.contextType === "performer" && b.contextId === y.id
          ), E = N.map((b) => b.tag.id);
          return Nu(e.occurrence, E, d) && !qu(c, m, y.id, E, d) ? [
            {
              key: `${m.id}:${y.id}`,
              media: m,
              performer: y,
              applications: N
            }
          ] : [];
        });
      }
    })
  ), { items: h.flat(), totalCount: o.totalCount };
}
async function uc(e, t, n) {
  const a = new Set(e.occurrence.tagIds);
  if (n.some((h) => !a.has(h)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const i = xe(e), o = await ii(i, t.media.id);
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
function kr(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function Su(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function ln(e, t, n = !0) {
  var c;
  if (t.occurrence) {
    const d = n ? Ts(
      await ii(e, t.media.id),
      t.occurrence.performer.id
    ) : [], h = (await le(Su(e, t))).filter(
      (u) => u.hostType === e && u.hostId === t.media.id && u.contextType === "performer" && u.contextId === t.occurrence.performer.id
    );
    return ui(h.map((u) => u.tag)), {
      ids: [...new Set(h.map((u) => u.tag.id))],
      names: [...new Set(h.map((u) => u.tag.name))],
      absent: d,
      applications: h
    };
  }
  const a = await ii(e, t.media.id), i = (a.tags ?? []).filter(
    (d) => d.canRemove !== !1 || d.isDerived !== !0
  );
  ui(i);
  const o = Object.keys(a.customFields ?? {}).find(
    (d) => d.toLowerCase() === qa
  ) ?? qa, s = ((c = a.customFields) == null ? void 0 : c[o]) ?? [];
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
async function eo(e, t, n) {
  if (t.occurrence && Te(e))
    await uc(
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
        `/api/${Hn(xe(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: a, tagIds: i })
        }
      );
}
async function Eu(e, t, n) {
  t.occurrence && Te(e) ? await vu(e, t.occurrence, n) : await Rs(xe(e), n, [t.media.id]);
}
function pi(e, t, n, a) {
  const i = (o) => o.filter((s) => a.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: kr(i(t.ids), i(n.ids)),
    absence: kr(i(t.absent), i(n.absent))
  };
}
function Cu(e, t) {
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
class fc extends Error {
}
const hi = (e) => e instanceof Error ? e.message : "Request failed.", Mo = (e) => [...e].sort((t, n) => t - n), zr = (e, t) => JSON.stringify(Mo(e)) === JSON.stringify(Mo(t)), mi = (e) => !!(e.tags.added.length || e.tags.removed.length);
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
    const g = u.filter((q) => o.has(q) && !i.has(q)), m = u.filter(
      (q) => o.has(q) && i.has(q) && !c.has(q)
    );
    !g.length || !m.length || (a ? (m.forEach((q) => o.delete(q)), h.push(...m)) : (g.forEach((q) => o.delete(q)), d.push({ tagIds: g, existing: m })));
  }
  return { desired: [...o], conflict: s, skipped: !1, kept: d, replaced: h };
}
function ku(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function Au(e, t, n, a) {
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
    throw new fc(
      `${s.map((h) => h.label).join(" and ")} answer the same condition tag, ${d}. Choose one of them.`
    );
  }
}
async function Tu(e, t, n, a = () => {
}) {
  if (!t.length || t.some(
    (m) => !On(m, e.entityType) || !m.steps.length || m.steps.some(
      (q) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(q.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), o = structuredClone(t), s = Kr(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await Zi(i.occurrence, n) : [];
  await Au(i, o, s, n);
  const c = await Promise.all(
    o.map(async (m) => ({
      ...m,
      steps: await xi(m, n)
    }))
  ), d = structuredClone(ku(c));
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
  const u = await Yi(i, n), g = /* @__PURE__ */ new Map();
  for (let m = 1; ; m++) {
    n.throwIfAborted();
    const q = await dc(i, u, m, n);
    for (const y of q.items) {
      const N = {
        ids: [...new Set(y.applications.map((b) => b.tag.id))],
        names: y.applications.map((b) => b.tag.name),
        absent: [],
        applications: y.applications
      }, E = ka(N.ids, d, s, !0);
      g.set(y.key, {
        item: { key: y.key, media: y.media, occurrence: y },
        before: N,
        expected: N,
        conflict: E.conflict,
        status: zr(N.ids, E.desired) ? "unchanged" : "pending"
      });
    }
    if (a(g.size), m * 250 >= q.totalCount) break;
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
function Ru(e, t, n) {
  const a = (o) => o.ids.filter((s) => n.includes(s));
  if (!zr(a(e), a(t))) return !1;
  const i = (o) => (o.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return zr(i(e), i(t));
}
async function pc(e, t, n, a) {
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
function hc(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function mc(e) {
  return e.entries.filter((t) => t.operation);
}
async function Ou(e, t, n, a, i = !1) {
  await pc(
    hc(e, i),
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
        if (s = await ln(xe(e.review), o.item, !1), !Ru(o.expected, s, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (m) {
        o.status = "failed", o.error = hi(m);
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
      ], h = kr(s.ids, d);
      if (!h.added.length && !h.removed.length) {
        const m = !o.operation && c.kept.length > 0;
        o.status = o.operation ? "changed" : m ? "skipped" : "unchanged", o.error = m ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let u;
      try {
        await eo(e.review, o.item, h);
      } catch (m) {
        u = m;
      }
      let g = !1;
      try {
        const m = await ln(xe(e.review), o.item, !1);
        g = !0, o.expected = m;
        const q = pi(
          o.item,
          o.before,
          m,
          e.touched
        );
        if (o.operation = mi(q) ? q : void 0, u) throw u;
        if (!zr(
          m.ids.filter((y) => e.touched.includes(y)),
          d.filter((y) => e.touched.includes(y))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (m) {
        if (o.status = "failed", o.error = hi(m), !g)
          try {
            const q = await ln(xe(e.review), o.item, !1);
            o.expected = q;
            const y = pi(
              o.item,
              o.before,
              q,
              e.touched
            );
            o.operation = mi(y) ? y : void 0;
          } catch {
            o.unverified = !0;
          }
      }
    },
    a
  );
}
async function $u(e, t, n) {
  await pc(
    mc(e),
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
        const c = await ln(xe(e.review), a.item, !1);
        Cu(i, c), s = !0, await eo(e.review, a.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const d = await ln(xe(e.review), a.item, !1);
        if (!zr(
          d.ids.filter((h) => o.includes(h)),
          a.before.ids.filter((h) => o.includes(h))
        ))
          throw new Error("Undo did not restore all affected tags.");
        a.operation = void 0, a.expected = d, a.status = "unchanged", a.error = void 0;
      } catch (c) {
        if (a.error = `Undo stopped: ${hi(c)}`, a.status = "failed", s)
          try {
            const d = await ln(xe(e.review), a.item, !1), h = pi(
              a.item,
              a.before,
              d,
              o
            );
            a.operation = mi(h) ? h : void 0, a.expected = d;
          } catch {
            a.unverified = !0;
          }
      }
    },
    n
  );
}
async function Iu(e, t, n) {
  const a = xe(e), i = e.occurrence, [o, s] = await Promise.all([
    le(
      `/api/tagapplications?hostType=${a}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    Zi(i, n)
  ]), c = o.filter(
    (y) => y.hostType === a && y.contextType === "performer" && y.contextId === t
  );
  ui(c.map((y) => y.tag));
  const d = await Promise.all(
    s.map(async (y, N) => {
      const E = i.conditionTagIds[N];
      return (await le(`/api/tags/${E}`, { signal: n })).name;
    })
  ), h = new Set(s.flat()), u = new Set(
    [
      ...e.actions.flatMap((y) => y.steps).filter((y) => y.mode === "ADD" || y.mode === "MARK_PRESENT").flatMap((y) => y.tagIds),
      ...i.tagIds
    ].filter((y) => !h.has(y))
  ), g = (y) => {
    const N = /* @__PURE__ */ new Map();
    for (const E of c) {
      if (!y.has(E.tag.id)) continue;
      const b = N.get(E.tag.id) ?? {
        tag: E.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      b.hosts.add(E.hostId), N.set(E.tag.id, b);
    }
    return [...N.values()].map((E) => ({ ...E.tag, count: E.hosts.size })).sort((E, b) => b.count - E.count || Os(E, b));
  }, m = s.map((y, N) => ({
    id: i.conditionTagIds[N],
    name: d[N],
    tags: g(new Set(y))
  }));
  u.size && m.push({
    id: null,
    name: s.length ? "Other review tags" : "Review tags",
    tags: g(u)
  });
  const q = /* @__PURE__ */ new Set([...h, ...u]);
  return {
    answered: new Set(
      c.filter((y) => q.has(y.tag.id)).map((y) => y.hostId)
    ).size,
    groups: m
  };
}
const gc = Zc(!1);
function Mu({ children: e }) {
  return /* @__PURE__ */ r(gc.Provider, { value: !0, children: e });
}
function Zt({ tag: e, name: t }) {
  const n = el(gc), a = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ r(rl, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: a ?? void 0 });
}
const Fo = { summary: null, error: "" };
function bc(e, t, n = 0) {
  const [a, i] = k(Fo), o = e.occurrence, s = JSON.stringify([
    e.entityType,
    t,
    o.condition,
    o.conditionTagIds,
    o.includeSubtags,
    o.tagIds,
    e.actions.map((c) => c.steps)
  ]);
  return H(() => {
    if (i(Fo), t === null) return;
    const c = new AbortController();
    return Iu(e, t, c.signal).then((d) => {
      c.signal.aborted || i({ summary: d, error: "" });
    }).catch((d) => {
      c.signal.aborted || i({
        summary: null,
        error: d instanceof Error ? d.message : "Request failed."
      });
    }), () => c.abort();
  }, [s, n]), a;
}
function Fu({
  review: e,
  performerId: t,
  revision: n = 0
}) {
  const a = bc(e, t, n);
  return /* @__PURE__ */ r(gi, { ...a, mediaKind: xe(e) });
}
function gi({
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
            /* @__PURE__ */ r(Zt, { tag: c }),
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
const Po = 5;
function Pu(e, t) {
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
function xu(e, t) {
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
const xo = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), bi = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], Lo = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], Lu = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, Wa = 250;
function _r(e, t) {
  var a, i;
  const n = e.item.media;
  return n.title || ((i = (a = n.files) == null ? void 0 : a[0]) == null ? void 0 : i.basename) || (t === "audio" ? "Audio" : "Scene");
}
function Du({ step: e }) {
  const t = bi.findIndex((n) => n.id === e);
  return /* @__PURE__ */ r("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: bi.map((n, a) => {
    const i = a < t ? "done" : a === t ? "current" : "next";
    return /* @__PURE__ */ l("li", { "data-state": i, "aria-current": i === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: i === "done" ? /* @__PURE__ */ r(Aa, {}) : a + 1 }),
      n.label,
      i === "done" && /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function Do({ parts: e, id: t }) {
  return /* @__PURE__ */ r("span", { className: "dq-batch-effect", id: t, children: e.map((n, a) => /* @__PURE__ */ l(Ni, { children: [
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
function _o({
  added: e,
  removed: t,
  tag: n,
  label: a
}) {
  return /* @__PURE__ */ l("ul", { className: "dq-tags", "aria-label": a, children: [
    lr(e.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ l("ins", { children: [
      "+ ",
      /* @__PURE__ */ r(Zt, { tag: i })
    ] }) }, `added-${i.id}`)),
    lr(t.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ l("del", { children: [
      "− ",
      /* @__PURE__ */ r(Zt, { tag: i })
    ] }) }, `removed-${i.id}`))
  ] });
}
function jo({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: a,
  describe: i
}) {
  return /* @__PURE__ */ l("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: e }),
      t.length > Wa && /* @__PURE__ */ l("span", { children: [
        "First ",
        Wa.toLocaleString(),
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
      /* @__PURE__ */ r("tbody", { children: t.slice(0, Wa).map((o) => {
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
function _u(e) {
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
function ju({
  review: e,
  disabled: t,
  performerFlags: n = [],
  trees: a,
  onOpen: i,
  onClose: o,
  onWrite: s
}) {
  const [c, d] = k(!1), [h, u] = k("answers"), [g, m] = k(null), [q, y] = k({}), [N, E] = k([]), [b, R] = k(!1), [I, j] = k(!1), [D, U] = k(""), [Z, te] = k(!1), [ne, ie] = k(""), [_, B] = k(null), [v, T] = k(null), [z, P] = k([]), [Q, J] = k(0), G = $(null), A = $(null), Pe = $(null), we = $(!1), tt = $(!1), K = $(null), Ne = $(!1), Ke = $(0), Se = $(!1), He = $({ onClose: o, onWrite: s });
  He.current = { onClose: o, onWrite: s };
  const Ee = dt(), Be = h === "run", en = (_ == null ? void 0 : _.kind) === "undo", Re = Be && g ? g.review : e, wn = Tr(Re.actions), de = Re.occurrence, Ve = xe(Re), qt = bn(Ve), dn = qt.queue, Ie = Be && g ? g.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((C) => C.steps.length && !Wn(C))
  ), it = Ie.filter((C) => N.includes(C.id)), Ce = de.targetMode === "selected" && de.performerIds.length === 1, ot = bc(
    Re,
    c && Ce ? de.performerIds[0] : null,
    Q
  ), _t = Wi(Re.view.objectFilter), Oe = Gi(
    c ? [...$a(Ie), ...de.conditionTagIds, ..._t] : []
  ), yn = ve(() => js(Oe), [Oe]), st = (C) => q[C] ?? Oe[C] ?? { id: C, name: `Tag ${C}` }, It = JSON.stringify(
    Object.fromEntries(
      _t.flatMap((C) => {
        var ae;
        const F = (ae = Oe[C]) == null ? void 0 : ae.name;
        return F ? [[String(C), F]] : [];
      })
    )
  ), ut = ve(
    () => Hi(Re.view.objectFilter, JSON.parse(It)),
    [Re.view.objectFilter, It]
  );
  H(() => {
    var C, F, ae;
    c && ((C = G.current) == null || C.showModal(), (ae = (F = G.current) == null ? void 0 : F.querySelector(".dq-batch-answer input")) == null || ae.focus());
  }, [c]), H(() => {
    if (!c) return;
    const C = requestAnimationFrame(() => {
      var ke;
      const F = G.current, ae = document.activeElement;
      if (!F || ae && ae !== document.body && F.contains(ae)) return;
      (ke = (h === "answers" ? F.querySelector(".dq-batch-answer input:checked") ?? F.querySelector(".dq-batch-answer input") : F.querySelector("[data-batch-focus]")) ?? A.current) == null || ke.focus();
    });
    return () => cancelAnimationFrame(C);
  }, [c, h, I, g]), H(() => {
    if (c || t || !we.current) return;
    const C = requestAnimationFrame(() => {
      const F = Pe.current;
      if (!we.current || !F || F.disabled) return;
      we.current = !1;
      const ae = document.activeElement;
      (!ae || ae === document.body) && F.focus();
    });
    return () => cancelAnimationFrame(C);
  }, [c, t]), H(() => {
    if (!c || de.targetMode !== "selected") return;
    const C = new AbortController();
    return P([]), Pu(de.performerIds.slice(0, Po), C.signal).then((F) => {
      C.signal.aborted || P(F);
    }).catch(() => {
    }), () => C.abort();
  }, [c, de.targetMode, JSON.stringify(de.performerIds)]), H(
    () => () => {
      var C;
      tt.current = !0, (C = K.current) == null || C.abort();
    },
    []
  ), H(() => {
    if (!I) return;
    const C = (F) => {
      F.preventDefault(), F.returnValue = "";
    };
    return window.addEventListener("beforeunload", C), () => window.removeEventListener("beforeunload", C);
  }, [I]);
  function jt() {
    u("answers"), m(null), y({}), B(null), R(!1), E([]), ie(""), U(""), te(!1), T(null);
  }
  function wt() {
    Se.current || (d(!1), He.current.onClose(Ne.current), Ne.current = !1, jt(), we.current = !0);
  }
  function Yn(C, F) {
    E(
      (ae) => F ? [...ae, C] : ae.filter((X) => X !== C)
    ), m(null), y({}), ie(""), U(""), te(!1), T(null);
  }
  function Ct() {
    u("answers"), T(null), ie("");
  }
  function vn() {
    u("preview"), g || me();
  }
  function Ut() {
    var C;
    tt.current = !0, (C = K.current) == null || C.abort(), ie("Stopping after in-flight operations settle…");
  }
  function Mt(C) {
    T(
      (F) => (F == null ? void 0 : F.group) === C.group && F.reason === C.reason ? null : C
    );
  }
  const un = (C, F) => (v == null ? void 0 : v.group) === C && v.reason === F;
  async function me() {
    if (!it.length || Se.current) return;
    Se.current = !0, j(!0), U(""), te(!1), ie("Loading all matching occurrences…"), m(null), y({}), T(null);
    const C = new AbortController();
    K.current = C;
    try {
      await xu(Ke.current, C.signal);
      const F = await Tu(
        e,
        it,
        C.signal,
        (X) => ie(`Loaded ${X.toLocaleString()} matching occurrences…`)
      );
      C.signal.throwIfAborted();
      const ae = {};
      for (const X of F.entries)
        for (const ke of X.before.applications ?? [])
          ae[ke.tag.id] = ke.tag;
      y(ae), m(F), ie("Preview ready. No tags have been changed.");
    } catch (F) {
      U(
        C.signal.aborted ? "Preview cancelled. No tags were changed." : F instanceof Error ? F.message : String(F)
      ), te(!C.signal.aborted && F instanceof fc), ie("");
    } finally {
      Se.current = !1, j(!1), K.current = null;
    }
  }
  async function St(C) {
    if (!g || Se.current) return;
    const F = (C === "undo" ? mc(g) : hc(g, C === "retry")).length;
    Se.current = !0, tt.current = !1, Ne.current = !0, He.current.onWrite(), j(!0), u("run"), U(""), B({ kind: C, total: F, done: 0, stopped: !1 }), ie(
      C === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const ae = () => B((ke) => ke && { ...ke, done: ke.done + 1 });
    let X = !1;
    try {
      C === "undo" ? await $u(g, () => tt.current, ae) : await Ou(g, b, () => tt.current, ae, C === "retry"), ie(
        tt.current ? "Stopped after in-flight operations settled. Completed changes are retained." : C === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (ke) {
      X = !0, ie(""), U(ke instanceof Error ? ke.message : String(ke));
    } finally {
      Ke.current = Date.now(), Se.current = !1;
      const ke = tt.current || X;
      B((ge) => ge && { ...ge, stopped: ke }), j(!1), J((ge) => ge + 1);
    }
  }
  const nt = (g == null ? void 0 : g.entries) ?? [], In = ve(
    () => new Map(
      ((g == null ? void 0 : g.entries) ?? []).map((C) => [
        C.item.key,
        ka(C.before.ids, g.action, g.categories, b)
      ])
    ),
    [g, b]
  ), Gt = (C) => In.get(C.item.key), Me = (C) => kr(C.before.ids, Gt(C).desired), kt = (C) => {
    const F = Me(C);
    return C.status === "pending" && (F.added.length > 0 || F.removed.length > 0);
  }, re = (C) => C.conflict || Gt(C).kept.length > 0 || Gt(C).replaced.length > 0, M = ve(() => {
    const C = (g == null ? void 0 : g.entries) ?? [];
    return {
      willChange: C.filter(kt).length,
      correct: C.filter((F) => F.status === "unchanged").length,
      different: C.filter(re).length,
      hosts: new Set(C.map((F) => F.item.media.id)).size,
      added: [...new Set(C.flatMap((F) => Me(F).added))],
      removed: [...new Set(C.flatMap((F) => Me(F).removed))]
    };
  }, [In]), ye = ve(
    () => ((g == null ? void 0 : g.entries) ?? []).filter((C) => C.item.media.date).sort((C, F) => C.item.media.date.localeCompare(F.item.media.date)),
    [g]
  ), ft = Be ? _u(nt) : null, Mn = (C) => wn.keys[Re.actions.findIndex((F) => F.id === C)] ?? "", ce = (C) => hr(C, yn, [], a), At = Kr(de.condition) && de.includeSubtags !== !1 && de.conditionTagIds.length > 0, Ye = ye[0], Le = ye.length > 1 ? ye[ye.length - 1] : void 0, Xe = (C) => `/${Ve}/${C.item.media.id}`, Kt = Ce ? z[0] : void 0, Ze = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: kt },
    correct: { title: "Occurrences already correct", test: (C) => C.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: re }
  };
  function yt() {
    const C = Lu[de.condition], F = !!C && de.conditionTagIds.length > 0, ae = de.performerIds.slice(0, Po), X = String(Re.view.filter.q ?? "").trim(), ke = de.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ l("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      Ri(de) ? /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "All performers" }) : de.targetMode === "selected" ? /* @__PURE__ */ l(ue, { children: [
        ae.map((ge, De) => /* @__PURE__ */ l("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ r(Sr, { performer: { id: ge, name: z[De] ?? "" } }),
          z[De] ?? "…"
        ] }, ge)),
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
                criteriaDefinitions: qi,
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
        F ? C : Ai[de.condition],
        F && /* @__PURE__ */ r("span", { className: "dq-batch-chip-tags", children: lr(de.conditionTagIds.map(st)).map((ge) => /* @__PURE__ */ r(Zt, { tag: ge }, ge.id)) })
      ] }),
      F && /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: de.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      Kr(de.condition) && de.hideConfirmedAbsent !== !1 && /* @__PURE__ */ l("span", { className: "dq-batch-chip", title: ke, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
          ": ",
          ke
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
              objectFilter: ut,
              criteriaDefinitions: Ve === "audio" ? ts : Si,
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
  function Ft(C) {
    return n.length ? /* @__PURE__ */ l("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ r(va, { "aria-hidden": "true" }),
      /* @__PURE__ */ l("div", { children: [
        /* @__PURE__ */ l("p", { children: [
          /* @__PURE__ */ r("strong", { children: Kt || "This performer" }),
          " is flagged:",
          " ",
          /* @__PURE__ */ r("strong", { children: n.join(", ") }),
          ". Check the earliest and latest",
          " ",
          qt.many,
          " before applying, or narrow the batch with a date filter."
        ] }),
        C && Ye && /* @__PURE__ */ l("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ l("a", { href: Xe(Ye), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            _r(Ye, Ve),
            " · ",
            Ye.item.media.date
          ] }),
          Le && /* @__PURE__ */ l("a", { href: Xe(Le), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            _r(Le, Ve),
            " · ",
            Le.item.media.date
          ] })
        ] })
      ] })
    ] }) : null;
  }
  function tn() {
    return /* @__PURE__ */ l(ue, { children: [
      yt(),
      Ft(!1),
      /* @__PURE__ */ l("div", { className: `dq-batch-pick${Ce ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ l("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ r("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ r("div", { className: "dq-batch-answers", children: Ie.map((C, F) => {
            const ae = Mn(C.id);
            return /* @__PURE__ */ l("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ r(
                "input",
                {
                  type: "checkbox",
                  checked: N.includes(C.id),
                  "aria-labelledby": `${Ee}-answer-${F}`,
                  "aria-describedby": `${Ee}-effect-${F}`,
                  onChange: (X) => Yn(C.id, X.target.checked)
                }
              ),
              /* @__PURE__ */ r("span", { className: "dq-batch-answer-key", children: ae && /* @__PURE__ */ r(at, { binding: ae, hidden: !0 }) }),
              /* @__PURE__ */ l("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ r(
                  "span",
                  {
                    id: `${Ee}-answer-${F}`,
                    className: "dq-batch-answer-label",
                    title: C.label,
                    children: C.label
                  }
                ),
                /* @__PURE__ */ r(Do, { id: `${Ee}-effect-${F}`, parts: ce(C) })
              ] })
            ] }, C.id);
          }) })
        ] }),
        Ce && /* @__PURE__ */ r(gi, { ...ot, mediaKind: Ve, className: "dq-batch-card" })
      ] })
    ] });
  }
  function ct(C) {
    const F = M, ae = v && xo.has(v.group) ? v.group : null, X = ae ? nt.filter(Ze[ae].test) : [], ke = (ge) => {
      const De = Gt(ge), je = De.skipped ? kr(
        ge.before.ids,
        ka(ge.before.ids, C.action, C.categories, !0).desired
      ) : Me(ge), Tt = !je.added.length && !je.removed.length;
      return /* @__PURE__ */ l("div", { className: "dq-batch-plan", children: [
        De.skipped && /* @__PURE__ */ r("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        Tt ? !De.kept.length && /* @__PURE__ */ r("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ r(_o, { added: je.added, removed: je.removed, tag: st }),
        De.kept.map((qe, nn) => /* @__PURE__ */ l("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          lr(qe.existing.map(st)).map((fe) => /* @__PURE__ */ r(Zt, { tag: fe }, fe.id)),
          " ",
          "instead of",
          " ",
          lr(qe.tagIds.map(st)).map((fe) => /* @__PURE__ */ r(Zt, { tag: fe }, fe.id))
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
              detail: `in ${F.hosts.toLocaleString()} ${F.hosts === 1 ? dn : `${dn}s`}`,
              pressed: un("matching"),
              onToggle: () => Mt({ group: "matching" })
            }
          ),
          /* @__PURE__ */ r(
            Dr,
            {
              value: F.willChange,
              label: "will change",
              tone: "add",
              pressed: un("change"),
              onToggle: () => Mt({ group: "change" })
            }
          ),
          /* @__PURE__ */ r(
            Dr,
            {
              value: F.correct,
              label: "already correct, no write",
              pressed: un("correct"),
              onToggle: () => Mt({ group: "correct" })
            }
          ),
          /* @__PURE__ */ r(
            Dr,
            {
              value: F.different,
              label: b ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: un("different"),
              onToggle: () => Mt({ group: "different" })
            }
          )
        ] }),
        X.length > 0 ? /* @__PURE__ */ r(
          jo,
          {
            title: Ze[ae].title,
            entries: X,
            mediaKind: Ve,
            resultHeading: "Planned change",
            describe: ke
          }
        ) : nt.length > 0 && /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        nt.length > 0 && /* @__PURE__ */ l("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ r("span", { children: Ye ? `Dates ${Ye.item.media.date}${Le ? ` to ${Le.item.media.date}` : ""}` : "No dates" }),
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
          Le && /* @__PURE__ */ r(
            "a",
            {
              href: Xe(Le),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${qt.one}, ${Le.item.media.date}`,
              title: _r(Le, Ve),
              children: "Open latest"
            }
          ),
          ye.length < nt.length && /* @__PURE__ */ l("span", { children: [
            (nt.length - ye.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (F.added.length > 0 || F.removed.length > 0) && /* @__PURE__ */ l("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ r("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ r(
            _o,
            {
              added: F.added,
              removed: F.removed,
              tag: st,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      F.different > 0 && /* @__PURE__ */ l("div", { className: "dq-batch-choice", children: [
        /* @__PURE__ */ r("span", { id: `${Ee}-choice`, className: "dq-batch-choice-label", children: "Occurrences with a different answer" }),
        /* @__PURE__ */ l(
          "div",
          {
            className: "dq-segmented dq-segmented-fill",
            role: "group",
            "aria-labelledby": `${Ee}-choice`,
            children: [
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": !b, onClick: () => R(!1), children: "Keep their answer" }),
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": b, onClick: () => R(!0), children: "Replace it" })
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
  function mr() {
    return /* @__PURE__ */ l(ue, { children: [
      yt(),
      Ft(!0),
      /* @__PURE__ */ l("div", { className: `dq-batch-cards${Ce ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ l("section", { className: "dq-batch-card", "aria-labelledby": `${Ee}-chosen`, children: [
          /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ r("h3", { id: `${Ee}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", disabled: I, onClick: Ct, children: "Change" })
          ] }),
          /* @__PURE__ */ r("ul", { className: "dq-batch-chosen", children: it.map((C) => {
            const F = Mn(C.id);
            return /* @__PURE__ */ l("li", { children: [
              /* @__PURE__ */ l("span", { className: "dq-batch-chosen-chip", children: [
                F && /* @__PURE__ */ r(at, { binding: F, hidden: !0 }),
                C.label
              ] }),
              /* @__PURE__ */ r(Do, { parts: ce(C) })
            ] }, C.id);
          }) })
        ] }),
        Ce && /* @__PURE__ */ r(gi, { ...ot, mediaKind: Ve, className: "dq-batch-card" })
      ] }),
      I ? /* @__PURE__ */ r("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ r("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ r("span", {}) }) }) : g && ct(g)
    ] });
  }
  function Bt(C) {
    const F = _ ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, ae = F.kind === "apply" ? nt.length - C.counts.pending : F.done, X = F.kind === "apply" ? nt.length : F.total, ke = I ? F.kind === "undo" ? "Undoing batch…" : F.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : F.kind === "undo" ? F.stopped ? "Undo stopped" : "Undo finished" : F.stopped ? "Stopped" : "Finished", ge = X ? Math.round(ae / X * 100) : 100, De = v && !xo.has(v.group) ? v.group : null, je = (qe) => Lo.find((nn) => nn.status === qe).label, Tt = De ? nt.filter(
      (qe) => qe.status === De && (!v.reason || qe.error === v.reason)
    ) : [];
    return /* @__PURE__ */ l(ue, { children: [
      /* @__PURE__ */ l("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ r("h3", { tabIndex: -1, "data-batch-focus": "", children: ke }),
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
            children: /* @__PURE__ */ r("span", { style: { width: `${ge}%` } })
          }
        ),
        !I && F.kind === "undo" && /* @__PURE__ */ l("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (F.total - C.recorded).toLocaleString(),
          " of",
          " ",
          F.total.toLocaleString(),
          " ",
          F.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ l("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ r("div", { className: "dq-batch-stats", "data-count": "5", children: Lo.map((qe) => /* @__PURE__ */ r(
          Dr,
          {
            value: C.counts[qe.status],
            label: qe.label,
            tone: qe.tone,
            pressed: un(qe.status),
            onToggle: () => Mt({ group: qe.status })
          },
          qe.status
        )) }),
        C.reasons.length > 0 && /* @__PURE__ */ r("ul", { className: "dq-batch-reasons", children: C.reasons.map((qe) => {
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
                onClick: () => Mt({ group: qe.status, reason: qe.error }),
                children: nn ? "Hide them" : "Show them"
              }
            )
          ] }, `${qe.status}-${qe.error}`);
        }) }),
        Tt.length > 0 ? /* @__PURE__ */ r(
          jo,
          {
            title: v.reason ? `${je(De)}: ${v.reason}` : `${je(De)} occurrences`,
            entries: Tt,
            mediaKind: Ve,
            resultHeading: "Result",
            describe: (qe) => qe.error ?? je(qe.status)
          }
        ) : /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." })
      ] }),
      C.recorded > 0 && /* @__PURE__ */ l("div", { className: "dq-batch-undo", children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: I,
            onClick: () => void St("undo"),
            children: [
              /* @__PURE__ */ r(yl, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ l("p", { children: [
          en ? F.stopped || I ? `${C.recorded.toLocaleString()} ${C.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${C.recorded.toLocaleString()} ${C.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${C.recorded === 1 ? "this change" : `these ${C.recorded.toLocaleString()} changes`} and keeps later edits.`,
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
    ) : h === "preview" ? I ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: Ut, children: "Cancel preview" }, "cancel-preview") : g ? /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !M.willChange,
        onClick: () => void St("apply"),
        children: [
          "Apply to ",
          M.willChange.toLocaleString(),
          " ",
          M.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : Z ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button primary", onClick: Ct, children: "Change answers" }, "change-answers") : /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void me(),
        children: "Preview again"
      },
      "again"
    ) : I ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: Ut, children: en ? "Cancel undo" : "Cancel run" }, "cancel-run") : en || !ft ? null : /* @__PURE__ */ l(Ni, { children: [
      ft.retryable && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: () => void St("retry"), children: "Retry failed" }),
      ft.counts.pending > 0 && /* @__PURE__ */ r(
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
  return /* @__PURE__ */ l(Mu, { children: [
    /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: Pe,
        title: "Apply answers to all matching occurrences",
        disabled: t || !Ie.length,
        onClick: () => {
          jt(), i(), d(!0);
        },
        children: [
          /* @__PURE__ */ r(mo, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    c && /* @__PURE__ */ l(
      "dialog",
      {
        ref: G,
        className: "dq-batch-dialog",
        "aria-labelledby": `${Ee}-title`,
        "aria-modal": "true",
        onCancel: (C) => {
          C.preventDefault(), wt();
        },
        onClose: () => {
          var C;
          Se.current ? (C = G.current) == null || C.showModal() : wt();
        },
        children: [
          /* @__PURE__ */ l("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ r(mo, { "aria-hidden": "true" }),
            /* @__PURE__ */ r("h2", { id: `${Ee}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: I,
                onClick: wt,
                children: /* @__PURE__ */ r(Qr, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r(Du, { step: h }),
          /* @__PURE__ */ l(
            "div",
            {
              className: "dq-batch-body",
              ref: A,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": h === "preview" ? "" : void 0,
              "aria-label": `${bi.find((C) => C.id === h).label} step`,
              children: [
                /* @__PURE__ */ l("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  ne && /* @__PURE__ */ r("p", { role: "status", children: ne }),
                  D && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: D })
                ] }),
                h === "answers" ? tn() : h === "preview" ? mr() : Bt(ft)
              ]
            }
          ),
          /* @__PURE__ */ l("div", { className: "dq-batch-footer", children: [
            h === "preview" && /* @__PURE__ */ l("button", { type: "button", className: "dq-button", disabled: I, onClick: Ct, children: [
              /* @__PURE__ */ r(Wr, { "aria-hidden": "true" }),
              "Back"
            ] }),
            h === "run" && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: I, onClick: jt, children: "New batch" }),
            /* @__PURE__ */ r("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: I, onClick: wt, children: "Close" }),
            Fn()
          ] })
        ]
      }
    )
  ] });
}
const wc = "data-quality.description-collapsed.v1";
function Uu() {
  try {
    return localStorage.getItem(wc) === "true";
  } catch {
    return !1;
  }
}
function Gu({
  details: e,
  label: t
}) {
  const [n, a] = k(Uu), i = mn(() => {
    a((o) => {
      const s = !o;
      try {
        localStorage.setItem(wc, String(s));
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
    !n && (e != null && e.trim() ? /* @__PURE__ */ r(al, { className: "dq-description-body", children: e }) : /* @__PURE__ */ r("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
function Ku({
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
          children: /* @__PURE__ */ r(vl, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-queue-list", children: h.map((m) => {
      const q = `${m.count.toLocaleString()} matching ${m.count === 1 ? o.one : o.many}`, y = m.flags.length ? `Flagged: ${m.flags.join(", ")}` : "";
      return /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${m.name}, ${q}${y ? `. ${y}` : ""}`,
          title: y || void 0,
          "aria-current": a === m.id ? "true" : void 0,
          disabled: i,
          onClick: () => s(m.id),
          children: [
            /* @__PURE__ */ r(Sr, { performer: m }),
            /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: m.name }),
            y && /* @__PURE__ */ r(va, { className: "dq-flag-icon", "aria-hidden": "true" }),
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
const Bu = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], Vu = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function zu(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), a = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), i = t.bottom + 8;
  return { top: i, left: a, width: n, maxHeight: Math.max(160, window.innerHeight - i - 16) };
}
function ha(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function Ju(e, t) {
  const n = Ri(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", a = e.conditionTagIds.map(
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
function Qu({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: a,
  onEditCriteria: i
}) {
  const [o, s] = k(!1), [c, d] = k(null), h = $(null), u = $(null), g = dt(), m = Rr(e.conditionTagIds), q = Ju(e, m);
  $t(() => {
    const b = h.current;
    if (!o || !b) return;
    const R = () => d(zu(b));
    R(), window.addEventListener("resize", R);
    const I = typeof ResizeObserver > "u" ? null : new ResizeObserver(R), j = [b, b.closest(".dq-review-header-trail"), b.closest("header")];
    for (const D of j) D && (I == null || I.observe(D));
    return () => {
      window.removeEventListener("resize", R), I == null || I.disconnect();
    };
  }, [o]), H(() => {
    var R, I;
    if (!o) return;
    const b = (R = u.current) == null ? void 0 : R.querySelector('[aria-pressed="true"]');
    b && !b.disabled ? b.focus() : (I = u.current) == null || I.focus();
  }, [o]);
  const y = () => {
    s(!1), requestAnimationFrame(() => {
      var b;
      return (b = h.current) == null ? void 0 : b.focus();
    });
  }, N = (b) => {
    if (!(b.target instanceof Element && b.target.closest('[role="dialog"]') !== u.current || b.defaultPrevented)) {
      if (b.key === "Escape")
        b.preventDefault(), y();
      else if (b.key === "Tab" && u.current) {
        const I = [...u.current.querySelectorAll(Vu)].filter((Z) => Z.closest('[role="dialog"]') === u.current).sort(
          (Z, te) => Z.compareDocumentPosition(te) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!I.length) return;
        const j = I[0], D = I[I.length - 1], U = document.activeElement;
        b.shiftKey && (U === j || U === u.current) ? (b.preventDefault(), D.focus()) : !b.shiftKey && U === D && (b.preventDefault(), j.focus());
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
        title: q,
        onClick: () => o ? y() : s(!0),
        children: [
          /* @__PURE__ */ r(ls, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-summary", children: q }),
          /* @__PURE__ */ r(cs, { "aria-hidden": "true" })
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
          onKeyDown: N,
          children: [
            /* @__PURE__ */ l("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Performers to review" }),
              /* @__PURE__ */ r("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: Bu.map(({ mode: b, label: R }) => /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === b,
                  onClick: () => e.targetMode !== b && a({ targetMode: b }),
                  children: R
                },
                b
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ r(
                Rn,
                {
                  entityType: "performer",
                  values: e.performerIds,
                  onChange: (b) => a({ performerIds: b }),
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
                    criteriaDefinitions: qi,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (b) => a({ performerFilter: b })
                  }
                ) }),
                /* @__PURE__ */ l("button", { type: "button", className: "dq-button", onClick: i, children: [
                  /* @__PURE__ */ r(Cr, { "aria-hidden": "true" }),
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
                  onChange: (b) => a({ condition: b.target.value }),
                  children: Ti.map((b) => /* @__PURE__ */ r("option", { value: b, children: Ai[b] }, b))
                }
              ),
              E && /* @__PURE__ */ l(ue, { children: [
                /* @__PURE__ */ r(
                  Rn,
                  {
                    entityType: "tag",
                    values: e.conditionTagIds,
                    onChange: (b) => a({ conditionTagIds: b }),
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
                        onChange: (b) => a({ includeSubtags: b.target.checked })
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
                        onChange: (b) => a({ hideConfirmedAbsent: b.target.checked })
                      }
                    ),
                    "Hide occurrences confirmed absent"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ l("div", { className: "dq-scope-footer", children: [
              /* @__PURE__ */ r("p", { children: n ? "Applies to this queue at once, and Save review keeps it." : "Applies to this queue at once; Save to review in the header keeps it." }),
              /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: y, children: "Done" })
            ] })
          ]
        }
      )
    ] })
  ] });
}
function wa(e) {
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
function Wu(e) {
  const t = e.occurrence;
  return JSON.stringify([
    xe(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {},
    t.flagPerformerTagIds ?? []
  ]);
}
async function Hu(e, t) {
  const n = xe(e) === "audio", a = new Set(e.occurrence.flagPerformerTagIds ?? []), i = (c) => ({
    id: c.id,
    name: c.name,
    total: (n ? c.audioCount : c.videoCount) ?? 0,
    flags: (c.tags ?? []).filter((d) => a.has(d.id)).map((d) => d.name)
  }), o = e.occurrence, s = [];
  if (o.targetMode === "selected" && o.performerIds.length > 0)
    for (const c of o.performerIds) {
      const d = await Zl(
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
            $n({
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
function yc(e, t, n) {
  const a = Xi(e, [t]);
  return nd(a, a.view.filter, n);
}
function vc(e, t) {
  const n = e.findIndex(
    (a) => a.count < t.count || a.count === t.count && a.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function wi(e, t, n, a) {
  if (t >= e.length) return !0;
  const i = e[t].total;
  return i <= 0 ? !0 : n.length >= a && i < n[a - 1].count;
}
async function Yu(e, t, n, a, i = {}) {
  const o = wa(e), s = Wu(e), c = lc(e.occurrence), d = (t == null ? void 0 : t.signature) === o && !t.partial ? t : {
    signature: o,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: c ? "" : s,
    candidates: c ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await Hu(e, a),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: h } = d, u = [...d.ranked];
  let g = d.cursor, m = !1;
  const q = (y) => ({
    ...d,
    cursor: g,
    ranked: [...u],
    limit: n,
    complete: !y && wi(h, g, u, n),
    ...y ? { partial: y } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: i.concurrency ?? 6 }, async () => {
        var y;
        for (; !m && !wi(h, g, u, n); ) {
          a.throwIfAborted();
          const N = h[g++], E = await yc(e, N.id, a);
          E > 0 && vc(u, { ...N, count: E }), (y = i.onProgress) == null || y.call(i, q(!0));
        }
      })
    );
  } catch (y) {
    throw m = !0, y;
  }
  return a.throwIfAborted(), q(!1);
}
function Xu(e, t, n) {
  const a = e.candidates.findIndex((o) => o.id === t);
  if (e.partial || a < 0 || a >= e.cursor) return e;
  const i = e.ranked.filter((o) => o.id !== t);
  return n > 0 && vc(i, { ...e.candidates[a], count: n }), {
    ...e,
    ranked: i,
    complete: wi(e.candidates, e.cursor, i, e.limit)
  };
}
function fr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, c) => fr(s, t[c]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, a = t, i = Object.keys(n).sort(), o = Object.keys(a).sort();
  return i.length === o.length && i.every(
    (s, c) => s === o[c] && fr(n[s], a[s])
  );
}
function Zu(e) {
  var c, d, h;
  const [t, n] = k({}), [a, i] = k(""), o = (((c = e == null ? void 0 : e.presentation) == null ? void 0 : c.annotations) ?? []).includes("tags") ? ((d = e == null ? void 0 : e.presentation) == null ? void 0 : d.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...o,
      ...((h = e == null ? void 0 : e.presentation) == null ? void 0 : h.binParents) ?? []
    ])
  ]);
  return H(() => {
    let u = !0;
    return n({}), i(""), Promise.all(
      JSON.parse(s).map(
        async (g) => [g, await Oa([g])]
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
function ef(e, t, n) {
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
function tf({
  videos: e,
  review: t,
  savedObjectFilter: n,
  trees: a,
  disabled: i,
  onToggle: o
}) {
  var y;
  const s = ((y = t.presentation) == null ? void 0 : y.binParents) ?? [], c = new Set(
    s.flatMap((N) => (a[N] ?? []).filter((E) => E !== N))
  ), d = s.every((N) => a[N]), h = ea(t.view.objectFilter, n).bins.filter(
    (N) => !d || c.has(N)
  ), u = /* @__PURE__ */ new Map();
  for (const N of e)
    for (const E of N.tags ?? [])
      if (c.has(E.id)) {
        const b = u.get(E.id) ?? { name: E.name, count: 0 };
        b.count++, u.set(E.id, b);
      }
  const g = h.filter((N) => !u.has(N)), m = Rr(g);
  for (const N of g)
    u.set(N, {
      name: m[N] === void 0 ? "…" : m[N] ?? "Unavailable tag",
      count: 0
    });
  if (!s.length) return null;
  const q = [...u].sort((N, E) => N[1].name.localeCompare(E[1].name));
  return /* @__PURE__ */ l("div", { className: "dq-bins", role: "group", "aria-label": "Tag bins on this page", children: [
    /* @__PURE__ */ r("span", { className: "dq-bins-label", "aria-hidden": "true", children: "On this page" }),
    q.map(([N, E]) => {
      const b = h.includes(N);
      return /* @__PURE__ */ l(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": b,
          title: b ? `Show every video again, not only ${E.name}` : `Show only videos tagged ${E.name}`,
          disabled: i,
          onClick: () => o(N),
          children: [
            b && /* @__PURE__ */ r(Aa, { "aria-hidden": "true" }),
            E.name,
            " ",
            /* @__PURE__ */ r("span", { className: "dq-bin-count", children: E.count })
          ]
        },
        N
      );
    }),
    !q.length && /* @__PURE__ */ r("span", { className: "dq-bins-empty", children: "No matching tag bins on this page." })
  ] });
}
function sr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function nf(e) {
  if (!sr(e) || Object.keys(e).length !== 1 || !sr(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !sr(t.tagsCriterion)) return null;
  const { value: n, modifier: a, depth: i, ...o } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && a === "INCLUDES" && i === 0 && !Object.keys(o).length ? n[0] : null;
}
function ea(e, t) {
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
    if (!sr(o) || o.operator !== "AND" || !Array.isArray(o.children))
      break;
    const s = o.children, c = nf(s.at(-1));
    if (c == null || s.length > 3) break;
    let d = {}, h = null, u = !0;
    for (const [g, m] of s.slice(0, -1).entries())
      !sr(m) || Object.keys(m).length !== 1 ? u = !1 : g === 0 && sr(m.filter) && Object.keys(m.filter).length ? d = m.filter : !h && sr(m.group) ? h = m.group : u = !1;
    if (!u) break;
    a.unshift(c), n = h ? { ...d, _filterExpression: h } : d;
  }
  return { base: n, bins: a };
}
function rf(e, t, n) {
  const { base: a, bins: i } = ea(e.view.objectFilter, n);
  return (i.includes(t) ? i.filter((s) => s !== t) : [...i, t]).reduce(af, { ...e, view: { ...e.view, objectFilter: a } });
}
function af(e, t) {
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
], of = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function pr(e) {
  const t = Te(e) ? e.occurrence : void 0;
  return {
    filter: Dt({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, xe(e)),
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
function Uo(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function yi(e, t) {
  let n;
  if (Te(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!Ia.some((c) => c !== "performer" && t.has(c))) {
    const c = pr(e);
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
    ...of,
    ...Uo(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(o.targetMode) || !Ti.includes(o.condition) || !Array.isArray(o.performerIds) || !Array.isArray(o.conditionTagIds) || typeof o.includeSubtags != "boolean" || typeof o.hideConfirmedAbsent != "boolean" || [...o.performerIds, ...o.conditionTagIds].some(
    (c) => !Number.isSafeInteger(c) || c <= 0
  ) || !o.performerFilter || typeof o.performerFilter != "object" || Array.isArray(o.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Dt(i, xe(e)),
      objectFilter: Uo(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: o,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
const Go = { dataQualityOpenedFromList: !0 };
function Nc() {
  const e = window.history.state;
  return !!e && typeof e == "object" && e.dataQualityOpenedFromList === !0;
}
function qc(e, { openingFromList: t = !1 } = {}) {
  t ? window.history.pushState({ ...Go }, "", e) : window.history.replaceState(Nc() ? { ...Go } : null, "", e);
}
function Ur(e, t) {
  const n = new URLSearchParams(window.location.search);
  Ia.forEach((a) => n.delete(a)), n.set("review", e);
  for (const a of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[a] !== void 0 && n.set(a, String(t.filter[a]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((a) => `${a.key}:${a.direction}`).join(",")
  ), n.set("filters", JSON.stringify(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", JSON.stringify(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), qc(`${window.location.pathname}?${n}${window.location.hash}`);
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
function dr(e) {
  const t = e;
  return gn(t, pr(t));
}
function Ko(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !fr(
    JSON.parse(zn(gn(e, t))),
    JSON.parse(zn(gn(e, pr(e))))
  );
}
function Sc(e, t) {
  if (_e(e) !== "video") return e;
  const { base: n, bins: a } = ea(e.view.objectFilter, t.view.objectFilter);
  return a.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function ma(e, t) {
  if (_e(e) !== "video") return t;
  const { base: n, bins: a } = ea(t.objectFilter, e.view.objectFilter);
  return a.length ? { ...t, objectFilter: n } : t;
}
function Bo(e, t) {
  return !t || !Te(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function Ha(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const a of e)
    n.set(a.media.id, [...n.get(a.media.id) ?? [], a]);
  return [...n.values()].reverse().flat();
}
const Xt = (e) => e instanceof Error ? e.message : "Request failed.", Ya = 50, sf = [], Vo = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function cf(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? cl(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? as(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function lf({ media: e, kind: t }) {
  const [n, a] = k(!1);
  return /* @__PURE__ */ r("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ r(us, {}) : /* @__PURE__ */ r(Ta, {}) : /* @__PURE__ */ r(
    "img",
    {
      src: oi(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => a(!0)
    }
  ) });
}
function df({
  tags: e,
  preview: t,
  showPreview: n,
  trees: a,
  actionTagIds: i,
  label: o
}) {
  const s = Bi(t), c = n ? s : null, d = e == null ? void 0 : e.absent, h = Gi(
    ve(() => [...i, ...d ?? []], [i, d])
  ), u = (D) => h[D] ?? { id: D, name: h[D] === void 0 ? "…" : "Unavailable tag" }, g = (D) => lr(D.map(u)), m = c && e ? Di(c, e, a) : null, q = e ? md(e) : [], y = new Set(q.map((D) => D.id)), N = new Set(m == null ? void 0 : m.removed), E = new Set(m == null ? void 0 : m.markedAbsent), b = new Set(m == null ? void 0 : m.absenceCleared), R = /* @__PURE__ */ l("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ r(ya, { "aria-hidden": "true" }),
    "absent"
  ] }), I = g((m == null ? void 0 : m.added) ?? []), j = g(((m == null ? void 0 : m.markedAbsent) ?? []).filter((D) => !y.has(D)));
  return /* @__PURE__ */ l("section", { className: "dq-panel-section", "aria-label": o, children: [
    /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ l(ue, { children: [
      q.length || I.length || j.length ? /* @__PURE__ */ l("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        q.map(
          (D) => N.has(D.id) ? /* @__PURE__ */ l("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ l("del", { children: [
              "− ",
              /* @__PURE__ */ r(Zt, { tag: D })
            ] }),
            E.has(D.id) && R
          ] }, D.id) : /* @__PURE__ */ r("li", { className: "dq-tag", children: /* @__PURE__ */ r(Zt, { tag: D }) }, D.id)
        ),
        I.map((D) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ l("ins", { children: [
          "+ ",
          /* @__PURE__ */ r(Zt, { tag: D })
        ] }) }, `added-${D.id}`)),
        j.map((D) => /* @__PURE__ */ l("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ r("ins", { children: /* @__PURE__ */ r(Zt, { tag: D }) }),
          R
        ] }, `absent-${D.id}`))
      ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" }),
      e.absent.length > 0 && /* @__PURE__ */ l(ue, { children: [
        /* @__PURE__ */ r("h4", { className: "dq-subheading", children: "Confirmed absent" }),
        /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: g(e.absent).map((D) => /* @__PURE__ */ l(
          "li",
          {
            className: `dq-tag dq-tag-absent${b.has(D.id) ? " dq-tag-removed" : ""}`,
            children: [
              /* @__PURE__ */ r(ya, { "aria-hidden": "true" }),
              b.has(D.id) ? /* @__PURE__ */ l("del", { children: [
                "− ",
                /* @__PURE__ */ r(Zt, { tag: D })
              ] }) : /* @__PURE__ */ r(Zt, { tag: D })
            ]
          },
          D.id
        )) })
      ] })
    ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading…" })
  ] });
}
function uf({
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
  const u = xe(e), g = bn(u), m = u === "audio" ? "Audio" : "Scene", q = (p) => {
    var S;
    return p.title || ((S = p.files[0]) == null ? void 0 : S.basename) || m;
  }, y = (p) => `${p.occurrence ? `${p.occurrence.performer.name} — ` : ""}${q(p.media)}`, N = $(null), E = $("");
  if (!N.current)
    try {
      N.current = yi(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (p) {
      E.current = Xt(p), N.current = { query: pr(e), startAtEnd: !1 };
    }
  const [b, R] = k(null), [I, j] = k(""), D = $(null), U = $(null), Z = $(null), te = $(null), [ne, ie] = k(!!E.current), _ = $(0), [B, v] = k(N.current.query), T = $(B);
  T.current = B;
  const [z, P] = k(0), Q = $(N.current.startAtEnd), [J, G] = k([]), [A, Pe] = k(null), we = $(null), [tt, K] = k(null), [Ne, Ke] = k(0), Se = ve(() => {
    if (!A) return null;
    const p = J.findIndex((S) => S.key === A.key);
    return p < 0 ? null : J.slice(p + 1).find((S) => S.media.id !== A.media.id) ?? null;
  }, [A, J]), [He, Ee] = k(0), [Be, en] = k(!1), [Re, wn] = k(!1), de = $(!1), Ve = $(!0), qt = $(null);
  H(() => (Ve.current = !0, () => {
    Ve.current = !1;
  }), []);
  const [dn, Ie] = k(E.current), [it, Ce] = k(""), [ot, _t] = k(null), [Oe, yn] = k(!1), [st, It] = k([]), ut = $([]), jt = $(null), wt = $(null), Yn = $(null);
  H(() => {
    var p, S;
    Oe && ((S = (p = Yn.current) == null ? void 0 : p.querySelector("input")) == null || S.focus());
  }, [Oe]);
  const [Ct, vn] = k(!1), [Ut, Mt] = k(!1), un = Zr(), [me, St] = k(!1), nt = d ?? me, In = h ?? St;
  H(() => {
    if (Be || Ct || !wt.current) return;
    const p = requestAnimationFrame(() => {
      if (document.querySelector(Vo)) return;
      const S = wt.current;
      wt.current = null;
      const x = document.activeElement;
      x && x !== document.body || S != null && S.isConnected && !S.disabled && S.focus();
    });
    return () => cancelAnimationFrame(p);
  }, [Be, Ct, z]);
  const [Gt, Me] = k([]), [kt, re] = k({}), M = $(null), ye = $(0), [ft, Mn] = k({});
  H(() => {
    let p = !0;
    return Promise.all(
      Wi(B.objectFilter).map(
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
    () => Hi(B.objectFilter, ft),
    [ft, B.objectFilter]
  ), At = $(0), Ye = $(e);
  Ye.current = e;
  const Le = b ?? e, Xe = ve(
    () => gn(Le, B),
    [Le, B]
  ), Kt = ve(
    () => Bo(Xe, B.performerFocus),
    [Xe, B.performerFocus]
  ), Ze = $(Kt);
  Ze.current = Kt;
  const yt = $(Xe);
  yt.current = Xe;
  const [Ft, tn] = k("items"), [ct, mr] = k(null), Bt = $(null), Fn = $("");
  function C(p) {
    const S = typeof p == "function" ? p(Bt.current) : p;
    Bt.current = S, mr(S);
  }
  const [F, ae] = k(!1), [X, ke] = k(null), ge = $(null), De = Te(Xe) ? wa(Xe) : "", [je, Tt] = k(0), [qe, nn] = k(null);
  H(() => () => {
    var p;
    return (p = ge.current) == null ? void 0 : p.controller.abort();
  }, []), H(() => {
    const p = ge.current;
    !p || p.signature === De || (p.controller.abort(), ge.current = null, ae(!1));
  }, [De]), H(() => {
    var x;
    const p = Bt.current;
    if (Ft !== "performers" || !De || ((x = ge.current) == null ? void 0 : x.signature) === De || Fn.current === De || (p == null ? void 0 : p.signature) === De && p.complete)
      return;
    const S = (p == null ? void 0 : p.signature) === De ? p : null;
    Jt(p, (S == null ? void 0 : S.limit) ?? Ya);
  }, [Ft, De, ct, X, F]);
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
  const Qe = Ko(e, B), Xn = Ko(e, ma(e, B)), vt = Re || Be || Oe, qn = Number(B.filter.page);
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
          const S = yi(
            Ye.current,
            new URLSearchParams(window.location.search)
          );
          de.current ? qt.current = S : Rt(S.query, S.startAtEnd);
        } catch (S) {
          Ie(Xt(S));
        }
    };
    return window.addEventListener("popstate", p), () => window.removeEventListener("popstate", p);
  }, [e.id]), H(() => (a(Re || Be || Oe || !!b), () => a(!1)), [Re, Be, Oe, !!b, a]);
  async function lt(p, S, x) {
    if (Te(p)) {
      const oe = await dc(
        p,
        M.current,
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
  function Pt(p, S, x, Y = !1, oe = !1) {
    if (!Ve.current || qt.current) return;
    ie(!0), G(
      oe ? p.items : Ha(p.items, T.current.startFrom === "end")
    ), Ee(p.totalCount), fn(x, Y);
    const pe = {
      ...T.current,
      filter: { ...T.current.filter, page: S }
    };
    T.current = pe, v(pe), Ur(e.id, pe);
  }
  function fn(p, S = !1) {
    (p == null ? void 0 : p.key) !== (A == null ? void 0 : A.key) && (we.current = null), (p == null ? void 0 : p.media.id) !== (A == null ? void 0 : A.media.id) && K(S && p ? p.media.id : null), Pe(p);
  }
  H(() => {
    if (E.current) return;
    const p = new AbortController();
    te.current = p;
    const S = ++At.current;
    return en(!0), Ie(""), Ce(""), we.current = null, K(null), Pe(null), G([]), yn(!1), (async () => {
      const x = Bo(
        gn(Ye.current, T.current),
        T.current.performerFocus
      );
      M.current = Te(x) ? await Yi(x, p.signal) : null;
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
      const mt = Ha(oe.items, x.view.startFrom === "end");
      Pt(oe, Y, mt[0] ?? null);
    })().catch((x) => {
      !p.signal.aborted && S === At.current && Ie(Xt(x));
    }).finally(() => {
      !p.signal.aborted && S === At.current && (ie(!0), en(!1));
    }), () => {
      p.abort(), At.current++;
    };
  }, [z, e.id]), H(() => {
    if (_t(null), !A) return;
    let p = !0;
    return ln(u, A).then((S) => {
      p && (_t(S), Me(
        Te(e) ? S.ids.filter((x) => e.occurrence.tagIds.includes(x)) : []
      ));
    }).catch((S) => {
      p && Ie(`Could not load current tags. ${Xt(S)}`);
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
      p && Ie(Xt(S));
    }), () => {
      p = !1;
    };
  }, [e]);
  async function pn(p = !1, S = !1, x = !1) {
    var Ot;
    if (!A) return;
    const Y = J.findIndex((Ue) => Ue.key === A.key), oe = B.startFrom === "end" ? -1 : 1, pe = ((Ot = we.current) == null ? void 0 : Ot.key) === A.key ? we.current : { key: A.key, page: qn, before: J.slice(0, Y + 1).map((Ue) => Ue.key), after: J.slice(Y + 1).map((Ue) => Ue.key) }, Ae = new Set(pe.after), mt = new Set(pe.before), Ht = J.find((Ue) => {
      var an;
      return Ae.has(Ue.key) || (oe === 1 || qn < pe.page) && ((an = we.current) == null ? void 0 : an.key) === A.key && !mt.has(Ue.key);
    });
    if (!p && Ht) {
      fn(Ht, x);
      return;
    }
    const xt = p ? mt : new Set(J.map((Ue) => Ue.key)), et = 1100 - (Date.now() - ye.current);
    et > 0 && await new Promise((Ue) => window.setTimeout(Ue, et));
    let Fe = oe === -1 && !p ? Math.max(1, qn - 1) : qn;
    for (; Ve.current && !qt.current; ) {
      let Ue = await lt(Kt, Fe);
      const an = Math.max(
        1,
        Math.ceil(Ue.totalCount / Number(B.filter.perPage))
      );
      Fe > an && (Fe = an, Ue = await lt(Kt, Fe));
      const yr = Ha(Ue.items, oe === -1), Ma = new Map(yr.map((he) => [he.key, he])), Fr = p ? pe.after.flatMap((he) => {
        const ia = Ma.get(he);
        return ia ? [ia] : [];
      }) : [], Pr = new Set(Fr.map((he) => he.key)), Un = p ? {
        ...Ue,
        items: [
          ...Fr,
          ...yr.filter(
            (he) => he.key !== A.key && !Pr.has(he.key)
          )
        ]
      } : Ue;
      if (S) {
        we.current = pe, Pt(Un, Fe, A, !1, p);
        return;
      }
      const on = oe === -1 && qn === 1 && !p ? void 0 : Un.items.find(
        (he) => !xt.has(he.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(p && oe === -1 && Fe === pe.page) || Ae.has(he.key))
      );
      if (on || (oe === -1 ? Fe <= 1 : Fe >= an)) {
        Pt(
          Un,
          Fe,
          on ?? null,
          x,
          p
        ), on || Ce(
          Ue.totalCount ? `Reached the end in this direction. Matching items remain available from the ${g.queue} pages.` : `No matching ${g.many}.`
        );
        return;
      }
      Fe += oe;
    }
  }
  async function Vt(p, S = !1, x = !1, Y = !1) {
    if (b || !A || de.current || Be || Oe && !x)
      return;
    const oe = x || Y || !!(p != null && p.steps.length);
    if (oe && (!t || !ot) || p && Wn(p) && !n) return;
    const pe = !S && !x && !Y && oe && p !== void 0 && ot !== null && Eo(e) && li(ci(e.actions, bd(p, ot, xn))).length > 0;
    de.current = !0, wn(!0), Ie(""), Ce("");
    const Ae = J.findIndex((et) => et.key === A.key), mt = oe && !S && !pe && Ae >= 0 ? J[Ae + 1] ?? null : null;
    mt && (G(
      (et) => et.filter((Fe) => Fe.key !== A.key)
    ), fn(mt, !0));
    let Ht = !1, xt = [];
    try {
      if (oe) {
        const et = await ln(u, A);
        if (p)
          await Eu(Kt, A, p);
        else {
          const Ot = Y && Te(e) ? e.occurrence.tagIds.filter((yr) => et.ids.includes(yr)) : ut.current, an = kr(Ot, Y ? Gt : st);
          await eo(Kt, A, an);
        }
        ye.current = Date.now();
        const Fe = await ln(u, A);
        mt || _t(Fe), Ht = !0, yn(!1), pe && (xt = li(ci(e.actions, Fe))), Ce(
          xt.length ? `Tags saved. Staying until answered: ${xt.map((Ot) => Ot.name).join(", ")}.` : "Tags saved."
        ), A.occurrence && (er(A.occurrence.performer.id), Tt((Ot) => Ot + 1));
      }
      if (!Ve.current || qt.current) return;
      oe ? xt.length || await pn(!0, S, !S) : S || await pn(), S && x && requestAnimationFrame(() => {
        var et;
        return (et = jt.current) == null ? void 0 : et.focus();
      });
    } catch (et) {
      if (Ie(
        Ht ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${Xt(et)}` : oe ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${Xt(et)}` : `Could not advance. ${Xt(et)}`
      ), oe && !Ht) {
        mt && (G(J), K(null), Ke((Fe) => Fe + 1), Pe(A)), ye.current = Date.now();
        try {
          _t(await ln(u, A));
        } catch {
          _t(null), Ie(
            (Fe) => `${Fe} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      Pn();
    }
  }
  const pt = !Oe && !b && !Ct && !Ut && (A != null || Be || Re);
  _i({
    surface: "local",
    enabled: pt,
    actions: e.actions,
    onAction: (p, S) => {
      const x = e.actions[p];
      x && Vt(x, S);
    },
    onFind: () => Mt(!0)
  });
  const ht = (p) => Re || Be || !ot || !!b || !t && p.steps.length > 0 || !n && Wn(p);
  function Et() {
    !i || b || de.current || Oe || (Z.current = document.activeElement, U.current = {
      error: dn,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(T.current),
      items: J,
      current: A,
      total: He,
      targets: M.current,
      stayedCursor: we.current
    }, R(structuredClone(e)), j(""), Ce(""), Ie(""));
  }
  H(() => {
    if (!o) {
      _.current = 0;
      return;
    }
    o !== _.current && ne && !Be && (_.current = o, Et(), s == null || s());
  }, [o, Be, ne]);
  function Nt() {
    R(null), j(""), requestAnimationFrame(() => {
      const p = Z.current;
      p != null && p.isConnected && p !== document.body && p.focus();
    });
  }
  function Sn() {
    var S;
    const p = U.current;
    !p || Re || ((S = te.current) == null || S.abort(), At.current++, T.current = p.query, v(p.query), G(p.items), Pe(p.current), Ee(p.total), M.current = p.targets, we.current = p.stayedCursor, en(!1), Ie(p.error), Ce(""), window.history.replaceState(window.history.state, "", p.url), Nt());
  }
  async function zt() {
    if (!b || !i || de.current) return;
    const p = gn(
      { ...b, name: b.name.trim() },
      ma(Ye.current, T.current)
    ), S = Vr(p);
    if (S) {
      j(S);
      return;
    }
    de.current = !0, wn(!0), j("");
    try {
      if (await i(p) === !1) throw new Error("Could not save review.");
      Nt(), Ce("Review saved.");
    } catch (x) {
      j(
        "Could not save review. Your edits are still open. " + Xt(x)
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
    de.current = !0, wn(!0), Ie("");
    try {
      if (await i(S) === !1) throw new Error("Could not save review.");
      Ce("Queue saved to this review.");
    } catch (x) {
      Ie("Could not save queue. " + Xt(x));
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
    const x = yt.current;
    if (!Te(x)) return;
    (oe = ge.current) == null || oe.controller.abort();
    const Y = {
      signature: wa(x),
      controller: new AbortController()
    };
    ge.current = Y, Fn.current = "", ae(!0), ke(null);
    try {
      const pe = await Yu(x, p, S, Y.controller.signal, {
        onProgress: (Ae) => {
          ge.current === Y && C(Ae);
        }
      });
      ge.current === Y && C(pe);
    } catch (pe) {
      ge.current === Y && !Y.controller.signal.aborted && (Fn.current = Y.signature, ke({ signature: Y.signature, message: Xt(pe) }));
    } finally {
      ge.current === Y && (ge.current = null, ae(!1));
    }
  }
  function Zn() {
    var p;
    (p = ge.current) == null || p.controller.abort(), ge.current = null, ae(!1), C((S) => S && { ...S, partial: !0, complete: !1 });
  }
  async function er(p) {
    var oe;
    const S = yt.current;
    if (!Te(S)) return;
    if (ge.current) {
      Zn();
      return;
    }
    const x = wa(S);
    if (((oe = Bt.current) == null ? void 0 : oe.signature) !== x || Bt.current.partial) return;
    const Y = 1100 - (Date.now() - ye.current);
    Y > 0 && await new Promise((pe) => window.setTimeout(pe, Y));
    try {
      const pe = await yc(S, p);
      if (ge.current) {
        Zn();
        return;
      }
      C(
        (Ae) => (Ae == null ? void 0 : Ae.signature) === x ? Xu(Ae, p, pe) : Ae
      );
    } catch {
      C(
        (pe) => (pe == null ? void 0 : pe.signature) === x ? { ...pe, partial: !0, complete: !1 } : pe
      );
    }
  }
  const na = B.performerFocus ? ct == null ? void 0 : ct.candidates.find((p) => p.id === B.performerFocus) : void 0, se = (qe == null ? void 0 : qe.id) === B.performerFocus ? qe : na ?? null;
  function gr(p) {
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
  const tr = $(null);
  tr.current ?? (tr.current = Gs());
  const Cn = tr.current, xn = $s(Le.actions), Or = ve(
    () => Le.actions.flatMap((p) => p.steps.flatMap((S) => S.tagIds)),
    [Le.actions]
  ), Ln = $(null);
  H(() => {
    const p = Ln.current, S = p == null ? void 0 : p.querySelector('[aria-current="true"]');
    if (!p || !S) return;
    const x = p.getBoundingClientRect(), Y = S.getBoundingClientRect();
    Y.top < x.top ? p.scrollTop -= x.top - Y.top : Y.bottom > x.bottom && (p.scrollTop += Y.bottom - x.bottom);
  }, [A == null ? void 0 : A.key, Ft]);
  const Qt = $(null), nr = $(null);
  H(() => {
    var x, Y;
    const p = nr.current;
    if (!p) return;
    nr.current = null;
    const S = [...((x = Qt.current) == null ? void 0 : x.querySelectorAll(".dq-partner")) ?? []];
    (Y = S.find((oe) => oe.dataset.partnerKey === p) ?? S[0]) == null || Y.focus();
  }, [A == null ? void 0 : A.key]);
  const Wt = Re || Be || Oe || !!b, $e = ve(
    () => b ? gn(b, ma(e, B)) : null,
    [b, e, B]
  ), $r = ve(
    () => $e != null && Er(dr($e)) !== Er(dr(e)),
    [$e, e]
  );
  function ra() {
    A ? ln(u, A).then(_t).catch((p) => Ie(Xt(p))) : Rt(T.current);
  }
  const Dn = dn ? /* @__PURE__ */ l("p", { role: "alert", children: [
    dn,
    " ",
    /* @__PURE__ */ r("button", { type: "button", disabled: Re, onClick: ra, children: A ? "Reload tags" : "Retry queue" })
  ] }) : null, rr = Re || Be || A != null && !ot, br = Math.max(1, Number(B.filter.perPage) || 1), wr = $(1);
  Be || (wr.current = Math.max(1, Math.ceil(He / br)));
  const Ir = wr.current, _n = rt && A ? J.filter(
    (p) => p.media.id === A.media.id && p.key !== A.key
  ) : [], Mr = A != null && A.occurrence && A.occurrence.performer.id === B.performerFocus ? (se == null ? void 0 : se.flags) ?? [] : A != null && A.occurrence ? ((aa = ct == null ? void 0 : ct.candidates.find((p) => p.id === A.occurrence.performer.id)) == null ? void 0 : aa.flags) ?? [] : [], ar = (p) => {
    var S;
    return p.title || ((S = p.files[0]) == null ? void 0 : S.basename) || `${u === "audio" ? "Audio" : "Video"} ${p.id}`;
  }, jn = A ? cf(A.media, u) : "";
  return /* @__PURE__ */ l(
    "section",
    {
      className: `dq-review-workspace${u === "audio" ? " dq-audio" : ""}`,
      "aria-label": rt ? u === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : u === "audio" ? "Audio review" : "Video review",
      onClickCapture: (p) => {
        var Y;
        const S = p.target instanceof Element ? p.target.closest("button") : null, x = (S == null ? void 0 : S.getAttribute("aria-label")) ?? ((Y = S == null ? void 0 : S.textContent) == null ? void 0 : Y.trim()) ?? "";
        S && !S.closest(Vo) && /^(Filters|Edit filter:|Edit criteria)/.test(x) && (wt.current = S);
      },
      children: [
        /* @__PURE__ */ r(
          ac,
          {
            name: e.name,
            description: e.description,
            entityType: _e(e),
            onBack: c == null ? void 0 : c.onBack,
            backDisabled: Wt || !!(c != null && c.busy),
            onEdit: b ? () => {
              var p;
              return (p = D.current) == null ? void 0 : p.focus();
            } : Et,
            editDisabled: !b && (Wt || !i || !!(c != null && c.busy)),
            editing: !!b,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ l("fieldset", { className: "dq-review-toolbar", disabled: Re || Oe, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: u === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ r(
                  Gr,
                  {
                    filter: B.filter,
                    objectFilter: ce,
                    criteriaDefinitions: u === "audio" ? ts : Si,
                    customFieldEntityType: u,
                    totalCount: He,
                    sortOptions: u === "audio" ? il : ns,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(
                      ic,
                      {
                        page: Math.min(Math.max(1, qn || 1), Ir),
                        pages: Ir,
                        onPage: (p) => Rt({
                          ...T.current,
                          filter: Dt(
                            { ...T.current.filter, page: p },
                            u
                          )
                        })
                      }
                    ),
                    onFilterChange: (p) => {
                      (p.sort !== T.current.filter.sort || p.direction !== T.current.filter.direction) && (p = { ...p, sorts: void 0 }), Rt({
                        ...T.current,
                        filter: Dt(p, u)
                      });
                    },
                    onObjectFilterChange: (p) => {
                      Rt({
                        ...T.current,
                        objectFilter: sc(
                          p,
                          ft,
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
                Qu,
                {
                  scope: rt,
                  disabled: Re || Oe,
                  editing: !!b,
                  onChange: rn,
                  onEditCriteria: () => vn(!0)
                }
              ),
              (c == null ? void 0 : c.onGrid) && /* @__PURE__ */ r(
                oc,
                {
                  mode: "single",
                  disabled: Wt || !!c.busy,
                  onChange: () => {
                    var p;
                    return (p = c.onGrid) == null ? void 0 : p.call(c);
                  }
                }
              )
            ] }),
            trailingEnd: /* @__PURE__ */ l(ue, { children: [
              Te(Kt) && t && /* @__PURE__ */ r(
                ju,
                {
                  review: Kt,
                  disabled: vt || !!b,
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
                      S ? er(S) : Zn(), Tt((x) => x + 1), new Promise((x) => window.setTimeout(x, 1100)).then(() => {
                        Pn(), Ve.current && (E.current || en(!0), P((x) => x + 1));
                      });
                    } else Pn();
                  }
                }
              ),
              (c == null ? void 0 : c.moreItems) && /* @__PURE__ */ r(
                zi,
                {
                  disabled: Wt,
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
                    /* @__PURE__ */ r(va, { "aria-hidden": "true" }),
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
                  disabled: vt,
                  onClick: En,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            queueDiffers: Qe,
            queueChange: !b && Qe ? {
              // Tag bins alone leave nothing to save: a review never keeps them.
              onSave: Xn ? () => void ta() : void 0,
              saveDisabled: vt || !i,
              onReset: () => {
                const p = pr(e);
                Rt(p, p.startFrom === "end");
              },
              resetDisabled: vt
            } : void 0,
            chipsEnd: b ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
          }
        ),
        c == null ? void 0 : c.notices,
        /* @__PURE__ */ l("div", { className: "dq-review-area", children: [
          b && $e && /* @__PURE__ */ r(
            rc,
            {
              drawerRef: D,
              draft: $e,
              onChange: (p) => R(p),
              direction: B.startFrom,
              onDirectionChange: (p) => Rt({ ...T.current, startFrom: p }),
              tagGroups: sf,
              trees: xn,
              saving: Re,
              saveDisabled: Be,
              error: I,
              dirty: $r,
              criteriaChanged: Xn,
              notices: Dn && /* @__PURE__ */ r("div", { className: "dq-review-feedback", children: Dn }),
              onSave: () => void zt(),
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
                        /* @__PURE__ */ r("span", { children: ar(A.media) }),
                        /* @__PURE__ */ r(ps, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  jn && /* @__PURE__ */ r("span", { className: "dq-stage-meta", children: jn })
                ] }),
                /* @__PURE__ */ l("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ r("div", { className: "dq-player-frame", children: [A, Se].filter(Boolean).map((p) => {
                    var Y, oe, pe, Ae, mt;
                    const S = p, x = S.key === A.key;
                    return /* @__PURE__ */ r(
                      "div",
                      {
                        className: x ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": x ? void 0 : !0,
                        inert: x ? void 0 : !0,
                        children: u === "audio" ? /* @__PURE__ */ r(
                          ol,
                          {
                            streamUrl: si("audio", S.media.id),
                            format: ((Y = S.media.files[0]) == null ? void 0 : Y.format) ?? "",
                            title: q(S.media),
                            coverUrl: x ? oi("audio", S.media) : void 0,
                            duration: ((oe = S.media.files[0]) == null ? void 0 : oe.duration) ?? 0,
                            autostart: x && tt === S.media.id
                          }
                        ) : /* @__PURE__ */ r(
                          rs,
                          {
                            videoId: S.media.id,
                            streamUrl: si("video", S.media.id),
                            posterUrl: x ? oi("video", S.media) : void 0,
                            duration: ((pe = S.media.files[0]) == null ? void 0 : pe.duration) ?? 0,
                            format: (Ae = S.media.files[0]) == null ? void 0 : Ae.format,
                            audioCodec: (mt = S.media.files[0]) == null ? void 0 : mt.audioCodec,
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
                    Gu,
                    {
                      details: A.media.details,
                      label: g.one
                    },
                    A.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ r("p", { role: "status", className: "dq-stage-status", children: Be ? "Loading review…" : He ? "Reached the end in this direction." : `No matching ${g.many}.` }),
              Le.actions.length > 0 ? /* @__PURE__ */ r(
                Rd,
                {
                  actions: Le.actions,
                  mediaKind: u,
                  isDisabled: (p) => Oe || ht(p),
                  busy: rr,
                  tags: ot,
                  trees: xn,
                  preview: Cn,
                  onApply: (p, S) => void Vt(p, S),
                  onFind: () => Mt(!0),
                  findDisabled: Oe || !!b,
                  paused: !!b,
                  waitForGroups: Eo(Le),
                  stayOnTap: nt,
                  onStayOnTapChange: In
                }
              ) : Te(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ l(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || Re || Oe || !ot || !!b || !A,
                  children: [
                    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((p) => /* @__PURE__ */ l("label", { children: [
                      /* @__PURE__ */ r(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: Gt.includes(p),
                          onChange: (S) => Me(
                            e.occurrence.multiple ? S.target.checked ? [...Gt, p] : Gt.filter((x) => x !== p) : [p]
                          )
                        }
                      ),
                      kt[p] ?? "Loading tag…"
                    ] }, p)),
                    /* @__PURE__ */ l("div", { className: "dq-row", children: [
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => Me([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void Vt(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void Vt(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ l("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ l("div", { className: "dq-panel-body", ref: Qt, children: [
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
                      /* @__PURE__ */ r(va, { "aria-hidden": "true" }),
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
                              disabled: vt,
                              onClick: () => {
                                nr.current = A.key, fn(p), Ie("");
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
                    df,
                    {
                      tags: ot,
                      preview: Cn,
                      showPreview: !Oe,
                      trees: xn,
                      actionTagIds: Or,
                      label: `Current ${rt ? "occurrence" : g.one} tags`
                    }
                  ),
                  Oe && /* @__PURE__ */ l(
                    "fieldset",
                    {
                      ref: Yn,
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
                              onClick: () => void Vt(void 0, !0, !0),
                              children: "Save"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              disabled: !ot,
                              onClick: () => void Vt(void 0, !1, !0),
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
                                  return (p = jt.current) == null ? void 0 : p.focus();
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
                  Fu,
                  {
                    review: Xe,
                    performerId: B.performerFocus,
                    revision: je
                  }
                )
              ] }),
              /* @__PURE__ */ l("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ l("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !b && Dn,
                  it && /* @__PURE__ */ r("p", { role: "status", children: it })
                ] }),
                !t && /* @__PURE__ */ r("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                A && /* @__PURE__ */ l("div", { className: "dq-panel-actions", "aria-busy": rr || void 0, children: [
                  /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      ref: jt,
                      className: "dq-button",
                      disabled: vt || !!b || !t || !ot,
                      onClick: () => {
                        ut.current = [...ot.ids], It([...ot.ids]), yn(!0);
                      },
                      children: [
                        /* @__PURE__ */ r(ds, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: vt || !!b,
                      onClick: () => void Vt(),
                      children: [
                        /* @__PURE__ */ r(Nl, { "aria-hidden": "true" }),
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
                        "aria-pressed": Ft === "items",
                        onClick: () => tn("items"),
                        children: u === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": Ft === "performers",
                        onClick: () => tn("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              rt && Ft === "performers" ? /* @__PURE__ */ r(
                Ku,
                {
                  ranking: (ct == null ? void 0 : ct.signature) === De ? ct : null,
                  busy: F,
                  error: (X == null ? void 0 : X.signature) === De ? X.message : "",
                  focus: B.performerFocus,
                  disabled: vt,
                  labels: g,
                  onFocus: gr,
                  onMore: () => {
                    const p = Bt.current;
                    p && Jt(p, p.limit + Ya);
                  },
                  onRefresh: () => {
                    C(null), Jt(null, Ya);
                  }
                }
              ) : /* @__PURE__ */ r("div", { className: "dq-queue-list", ref: Ln, children: J.map((p) => {
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
                    disabled: vt,
                    onClick: () => {
                      fn(p), Ie(""), Ce("");
                    },
                    children: [
                      /* @__PURE__ */ r(lf, { media: p.media, kind: u }),
                      /* @__PURE__ */ l("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: q(p.media) }),
                        /* @__PURE__ */ l("span", { className: "dq-queue-row-meta", children: [
                          p.occurrence && /* @__PURE__ */ l(ue, { children: [
                            /* @__PURE__ */ r(Sr, { performer: p.occurrence.performer }),
                            /* @__PURE__ */ r("span", { className: "dq-queue-row-performer", children: p.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ r("span", { className: "dq-queue-row-detail", children: [
                            p.media.date,
                            p.occurrence ? "" : (x = p.media.files[0]) != null && x.duration ? as(p.media.files[0].duration) : ""
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
          sl,
          {
            open: Ct,
            onClose: () => vn(!1),
            criteria: qi,
            activeFilter: rt.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (p) => {
              vn(!1), rn({ performerFilter: p });
            }
          }
        ),
        Ut && /* @__PURE__ */ r(
          Ki,
          {
            actions: e.actions,
            trees: xn,
            isDisabled: (p) => ht(p),
            tapStays: un && nt,
            onApply: (p, S) => {
              Mt(!1), Vt(p, S);
            },
            onClose: () => Mt(!1)
          }
        )
      ]
    }
  );
}
const Ec = "data-quality.reviews-sort.v1", ff = { sort: "name", direction: "asc" };
function pf() {
  try {
    const e = JSON.parse(localStorage.getItem(Ec) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return ff;
}
function hf(e) {
  try {
    localStorage.setItem(
      Ec,
      JSON.stringify({ sort: e.sort, direction: e.direction })
    );
  } catch {
  }
}
function Cc(e, t, n, a) {
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
function Xa(e, t) {
  const n = _e(e), a = bn(Oi(n)), i = n === "tag" ? "tag" : Te(e) ? a.queue : a.one;
  return t === 1 ? i : `${i}s`;
}
function mf({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ l(ue, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      Xa(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ l(ue, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      "Matching ",
      Xa(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ l(ue, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      Xa(e, t)
    ] })
  ] });
}
function gf({
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
  onImport: q,
  onExportAll: y,
  rowMenuItems: N
}) {
  const E = $(null), b = ve(
    () => Cc(e, t, n, a),
    [e, t, n, a]
  ), R = e.every((j) => t[j.id] !== void 0), I = a === "asc" ? "ascending" : "descending";
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
              var j;
              return (j = E.current) == null ? void 0 : j.click();
            },
            children: [
              /* @__PURE__ */ r(ql, { "aria-hidden": "true" }),
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
            onChange: (j) => {
              var U;
              const D = (U = j.target.files) == null ? void 0 : U[0];
              j.target.value = "", D && q(D);
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
              /* @__PURE__ */ r(hs, { "aria-hidden": "true" }),
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
              /* @__PURE__ */ r(Ci, { "aria-hidden": "true" }),
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
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: R ? e.some((j) => t[j.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
        /* @__PURE__ */ l("div", { className: "dq-reviews-sort", children: [
          /* @__PURE__ */ l("label", { children: [
            /* @__PURE__ */ r("span", { children: "Sort by" }),
            /* @__PURE__ */ l(
              "select",
              {
                className: "dq-select",
                value: n,
                onChange: (j) => i(j.target.value),
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
              "aria-label": `Sort direction: ${I}`,
              title: `Sort direction: ${I}`,
              onClick: () => o(a === "asc" ? "desc" : "asc"),
              children: a === "asc" ? /* @__PURE__ */ r(Sl, { "aria-hidden": "true" }) : /* @__PURE__ */ r(El, { "aria-hidden": "true" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ l("table", { className: "dq-reviews-table", children: [
        /* @__PURE__ */ r("thead", { children: /* @__PURE__ */ l("tr", { children: [
          /* @__PURE__ */ r("th", { scope: "col", "aria-sort": n === "name" ? I : void 0, children: "Review" }),
          /* @__PURE__ */ r("th", { scope: "col", className: "dq-reviews-type", children: "Type" }),
          /* @__PURE__ */ r(
            "th",
            {
              scope: "col",
              className: "dq-reviews-count",
              "aria-sort": n === "count" ? I : void 0,
              children: "Matching"
            }
          ),
          /* @__PURE__ */ r("th", { scope: "col", className: "dq-reviews-actions", children: /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Actions" }) })
        ] }) }),
        /* @__PURE__ */ r("tbody", { children: b.map((j) => {
          const D = _e(j);
          return /* @__PURE__ */ l("tr", { children: [
            /* @__PURE__ */ r("td", { children: /* @__PURE__ */ l(
              "a",
              {
                className: "dq-reviews-link",
                href: `?review=${encodeURIComponent(j.id)}`,
                "data-review-id": j.id,
                onClick: (U) => {
                  U.button !== 0 || U.metaKey || U.ctrlKey || U.shiftKey || U.altKey || (U.preventDefault(), g(j.id));
                },
                children: [
                  /* @__PURE__ */ r("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ r(ec, { entityType: D }) }),
                  /* @__PURE__ */ l("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ r("span", { className: "dq-reviews-name", children: j.name }),
                    j.description && /* @__PURE__ */ r("span", { className: "dq-reviews-description", title: j.description, children: j.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-type", children: Zs[D] }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-count", children: /* @__PURE__ */ r(mf, { review: j, count: t[j.id] }) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ r(zi, { label: `Actions for ${j.name}`, items: N(j) }) })
          ] }, j.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ l("div", { className: "dq-empty", children: [
      /* @__PURE__ */ r(Ta, { "aria-hidden": "true" }),
      /* @__PURE__ */ r("p", { children: "No reviews yet." }),
      /* @__PURE__ */ r("p", { children: c ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function kc(e, { id: t, name: n, description: a }) {
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
function bf({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: a
}) {
  const { review: i, saving: o, error: s } = e, c = $(null), d = $(null), h = $(o);
  h.current = o;
  const u = $(null), g = dt();
  H(() => {
    var y;
    return u.current ?? (u.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), c.current && !c.current.open && c.current.showModal(), (y = d.current) == null || y.focus(), () => {
      var N;
      (N = u.current) != null && N.isConnected && u.current.focus({ preventScroll: !0 });
    };
  }, []);
  const m = $(o);
  H(() => {
    var E, b;
    const y = document.activeElement, N = !y || y === document.body || !((E = c.current) != null && E.contains(y));
    s && (!i.name.trim() || m.current && !o && N) && ((b = d.current) == null || b.focus()), m.current = o;
  }, [s, o]);
  const q = () => {
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
        y.preventDefault(), q();
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
                  onClick: q,
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
                  nc,
                  {
                    review: i,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (y) => {
                      y !== _e(i) && t(kc(y, i));
                    },
                    nameRef: d
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ l("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ r("button", { type: "button", className: "dq-text-button", onClick: () => Vi(i), children: "Export draft" }),
              /* @__PURE__ */ r("span", { className: "dq-form-dialog-space" }),
              /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: o, onClick: q, children: "Cancel" }),
              /* @__PURE__ */ r("button", { type: "submit", className: "dq-button primary", "aria-disabled": o || void 0, children: o ? "Creating…" : "Create & configure" })
            ] })
          ]
        }
      )
    }
  );
}
const wf = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function yf(e, t, n, a) {
  return Sc(
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
function zo(e, t) {
  return _e(t) === "video" && ea(t.view.objectFilter, e.view.objectFilter).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function Jo(e, t) {
  return fr(
    JSON.parse(zn(dr(e))),
    JSON.parse(zn(dr(t)))
  );
}
const Za = 180;
function Qo(e) {
  return _e(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function Wo(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Ho() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function ei(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  Ia.forEach((i) => n.delete(i)), e ? n.set("review", e) : n.delete("review");
  const a = n.toString();
  qc(`${window.location.pathname}${a ? `?${a}` : ""}`, { openingFromList: t });
}
function vf(e) {
  return Dt({ ...e, page: 1 });
}
function Ac(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function qr(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Nf = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(ki, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ r(Al, { "aria-hidden": "true" }) }
], qf = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(ki, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ r(kl, { "aria-hidden": "true" }) }
], Yo = [], Tc = "(min-width: 900px)";
function Sf(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(Tc);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function Ef() {
  return typeof window.matchMedia == "function" && window.matchMedia(Tc).matches;
}
function Cf({
  onNavigate: e
}) {
  const [t, n] = k([]), [a] = k(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [i, o] = k(""), [s, c] = k(!0), [d, h] = k(""), [u, g] = k(!1), [m, q] = k(!1), [y, N] = k(!1), [E, b] = k(!1), [R, I] = k([]), [j, D] = k(""), [U, Z] = k(!0), [te, ne] = k("account"), [ie, _] = k(""), [B, v] = k(""), [T, z] = k(!1), [P, Q] = k(!1), [J, G] = k(""), [A, Pe] = k(Ho), we = $(A);
  we.current = A;
  const [tt, K] = k({}), Ne = $(tt);
  Ne.current = tt;
  const Ke = $(t);
  Ke.current = t;
  const Se = $(s);
  Se.current = s;
  const He = $(!1), Ee = $(!0);
  H(() => (Ee.current = !0, () => {
    Ee.current = !1;
  }), []);
  const [Be, en] = k(!A);
  Be !== !A && (en(!A), A || K({}));
  const [Re, wn] = k(pf), { sort: de, direction: Ve } = Re, qt = (f) => {
    const w = { ...Re, ...f };
    wn(w), hf(w);
  }, dn = $(null), Ie = $(null), [it, Ce] = k(null), [ot, _t] = k(!1), [Oe, yn] = k(!1), [st, It] = k(null), [ut, jt] = k(null), wt = !!st || !!ut, Yn = $(wt);
  Yn.current = wt;
  const Ct = ot || !!ut || Oe, [vn, Ut] = k(0), [Mt, un] = k(!1), [me, St] = k(null), nt = $(null), In = $(null), Gt = $(null), [Me, kt] = k(
    null
  ), re = t.find((f) => f.id === A) ?? null, M = ve(
    () => (Me == null ? void 0 : Me.id) === A && re ? { ...re, view: {
      ...re.view,
      filter: Me.view.filter,
      objectFilter: Me.view.objectFilter,
      searchMode: Me.view.searchMode,
      startFrom: Me.view.startFrom
    } } : re,
    [Me, A, re]
  ), ye = M ? _e(M) : "video", ft = Oi(ye), Mn = M ? Te(M) : !1, ce = ye === "video" ? M : null, At = Mn && !!(M != null && M.actions.some(Wn)), Ye = !!ce || ye === "audio" || At, [Le, Xe] = k(null), Kt = (Le == null ? void 0 : Le.id) === (M == null ? void 0 : M.id) ? Le == null ? void 0 : Le.mode : (M == null ? void 0 : M.view.reviewMode) ?? "single", Ze = Mn || ye === "audio" || ye === "video" && Kt === "single", [yt, Ft] = k(0), tn = $(-1), ct = $(!1), mr = $(Ze);
  mr.current = Ze, H(() => {
    const f = () => {
      const w = mr.current;
      if (!w && Cn.current) {
        ct.current = !0;
        return;
      }
      tn.current = -1, io(), w || Ft((O) => O + 1);
    };
    return window.addEventListener("popstate", f), () => window.removeEventListener("popstate", f);
  }, []);
  const Bt = ft === "audio" ? m : u, Fn = ye === "tag" ? "Tag" : ft === "audio" ? "Audio" : "Video", C = ye === "tag" ? y : Bt, F = $(
    null
  ), ae = Zu(ce), [X, ke] = k({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [ge, De] = k({
    page: 1,
    perPage: 40
  }), [je, Tt] = k({ items: [], totalCount: 0 }), [qe, nn] = k(A);
  qe !== A && (nn(A), Tt({ items: [], totalCount: 0 }), Q(!1));
  const [fe, Nn] = k(!1), [Qe, Xn] = k(""), [vt, qn] = k(!1), [Rt, Pn] = k(!1), [lt, Pt] = k(() => /* @__PURE__ */ new Set()), fn = $(lt);
  fn.current = lt;
  const pn = $(/* @__PURE__ */ new Map()), Vt = (M == null ? void 0 : M.view.selectAllOnLoad) === !0, [pt, ht] = k(null), Et = $(pt);
  Et.current = pt;
  const [Nt, Sn] = k(!1), zt = $(Nt);
  zt.current = Nt;
  const ta = $(null), [rt, rn] = k(!1), [Jt, Zn] = k("grid"), [er, na] = k(Za), [se, gr] = k(!1), [En, tr] = k(!1), Cn = $(!1), [xn, Or] = k(""), [Ln, Qt] = k(""), [nr, Wt] = k(""), [$e, $r] = k(null), [ra, Dn] = k(""), [rr, br] = k(!1), [wr, Ir] = k({}), _n = $(/* @__PURE__ */ new Map()), Mr = $(null), ar = $(null), jn = !!M, aa = vi(Sf, Ef, () => !1) && jn, [p, S] = k({ top: 0, bottom: 0 });
  $t(() => {
    if (!jn) return;
    const f = () => {
      const O = ar.current;
      if (!O) return;
      const L = Math.round(O.getBoundingClientRect().top + window.scrollY), W = O.closest("main"), V = W ? Math.round(parseFloat(getComputedStyle(W).paddingBottom) || 0) : 0;
      S(
        (ee) => ee.top === L && ee.bottom === V ? ee : { top: L, bottom: V }
      );
    };
    f();
    const w = typeof ResizeObserver > "u" ? null : new ResizeObserver(f);
    return w == null || w.observe(document.body), window.addEventListener("resize", f), () => {
      w == null || w.disconnect(), window.removeEventListener("resize", f);
    };
  }, [jn]);
  const [x, Y] = k(0), oe = $(null), pe = mn((f) => {
    var O;
    if ((O = oe.current) == null || O.disconnect(), oe.current = null, !f || typeof ResizeObserver > "u") return;
    const w = new ResizeObserver(
      () => Y(Math.round(f.getBoundingClientRect().height))
    );
    w.observe(f), oe.current = w;
  }, []), Ae = $(0), mt = $(0), Ht = $(null), xt = $(null), et = $s(
    M && !Ze ? me ? [...M.actions, ...me.draft.actions] : M.actions : Yo
  ), Fe = ve(
    () => me && M && re ? yf(me.draft, M, X, re) : null,
    [me, M, X, re]
  ), Ot = ve(
    () => M && re ? Sc(
      { ...re, view: { ...M.view, filter: { ...X, page: 1 } } },
      re
    ) : null,
    [M, re, X]
  ), Ue = ve(
    () => re ? Er(dr(re)) : "",
    [re]
  ), an = ve(
    () => Ot != null && Er(dr(Ot)) !== Ue,
    [Ot, Ue]
  ), yr = ve(
    () => Fe != null && Er(dr(Fe)) !== Ue,
    [Fe, Ue]
  );
  H(() => {
    if (!Ln) return;
    const f = window.setTimeout(() => Qt(""), 4e3);
    return () => window.clearTimeout(f);
  }, [Ln]), H(() => {
    if (!it || it.alert) return;
    const f = window.setTimeout(() => Ce(null), 6e3);
    return () => window.clearTimeout(f);
  }, [it]), H(() => {
    const f = ce ? Wi(ce.view.objectFilter) : [];
    if (Ir({}), !f.length) return;
    const w = new AbortController();
    let O = !0;
    return Promise.all(
      f.map(async (L) => {
        var W;
        try {
          const V = await le(`/api/tags/${L}`, {
            signal: w.signal
          });
          return (W = V.name) != null && W.trim() ? [String(L), V.name] : null;
        } catch {
          return null;
        }
      })
    ).then((L) => {
      O && Ir(
        Object.fromEntries(L.filter((W) => W !== null))
      );
    }), () => {
      O = !1, w.abort();
    };
  }, [ce == null ? void 0 : ce.id, ce == null ? void 0 : ce.view.objectFilter]);
  const Ma = ve(
    () => ce ? Hi(
      ce.view.objectFilter,
      wr
    ) : (M == null ? void 0 : M.view.objectFilter) ?? {},
    [wr, M, ce]
  ), Fr = mn(async () => {
    c(!0), h("");
    try {
      const f = await Vl();
      n(f.reviews), o(f.storageKey), g(f.canWriteVideos ?? f.canWrite), q(f.canWriteAudios ?? !1), N(f.canWriteTags ?? !1), b(f.canReadTagGroups ?? !1), Z(f.canConfigure ?? !0), ne(f.storage ?? "account"), _(f.storageNotice ?? ""), A && !f.reviews.some((w) => w.id === A) && (Pe(""), ei(""));
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
      I([]), D("");
      return;
    }
    const f = new AbortController();
    return D(""), rd(f.signal).then(I).catch((w) => {
      f.signal.aborted || D(
        w instanceof Error ? w.message : "Could not load tag groups."
      );
    }), () => f.abort();
  }, [E]), H(() => {
    Fr();
  }, []), H(() => {
    if (A || t.length === 0) return;
    const f = new AbortController();
    for (const w of t) {
      if (typeof Ne.current[w.id] == "number") continue;
      (Te(w) ? Yi(w, f.signal).then((L) => (L == null ? void 0 : L.length) === 0 ? { items: [], totalCount: 0 } : jr(Xi(w, L), { ...w.view.filter, page: 1, perPage: 1 }, f.signal)) : _e(w) === "tag" ? vo(
        w,
        Dt({ ...w.view.filter, page: 1, perPage: 1 }),
        f.signal
      ) : jr(
        w,
        Dt({ ...w.view.filter, page: 1, perPage: 1 }),
        f.signal
      )).then((L) => {
        f.signal.aborted || K((W) => ({
          ...W,
          [w.id]: L.totalCount
        }));
      }).catch(() => {
        f.signal.aborted || K((L) => ({ ...L, [w.id]: null }));
      });
    }
    return () => f.abort();
  }, [A, t]), $t(() => {
    var O, L;
    const f = Ie.current;
    if (A || s || !f) return;
    Ie.current = null, (L = (f === "heading" ? null : [...((O = ar.current) == null ? void 0 : O.querySelectorAll("[data-review-id]")) ?? []].find(
      (W) => W.dataset.reviewId === f.reviewId
    )) ?? dn.current) == null || L.focus();
  }, [A, s, ut, t]);
  const Pr = $(0), Un = mn(async () => {
    const f = ++Pr.current;
    $r(null), Dn("");
    try {
      const w = await (At ? As(ft) : ks(ft));
      f === Pr.current && $r(w);
    } catch (w) {
      if (f !== Pr.current) return;
      $r(null), Dn(
        "Tag assessment setup could not be checked. " + (w instanceof Error ? w.message : "Request failed.")
      );
    }
  }, [At, ft]);
  H(() => {
    Un();
  }, [Un]);
  const on = mn(
    async (f, w, O = !1, L = !1) => {
      var bt, Ge;
      const W = ++Ae.current;
      (bt = Ht.current) == null || bt.abort();
      const V = new AbortController();
      Ht.current = V, w = Dt(w);
      const ee = Number(w.page);
      O && (w = { ...w, page: 1 }), ke(w), Pn(O), Nn(!0), Xn("");
      try {
        const ze = (kn) => _e(f) === "tag" ? vo(
          f,
          kn,
          V.signal
        ) : jr(
          f,
          kn,
          V.signal
        );
        let be = await ze(w);
        const Je = Math.max(
          1,
          Math.ceil(be.totalCount / Number(w.perPage))
        ), Kn = O ? Je : Math.min(ee, Je);
        return Number(w.page) !== Kn && (w = { ...w, page: Kn }, be = await ze(w)), W === Ae.current && (((Ge = xt.current) == null ? void 0 : Ge.page) !== Kn && (xt.current = {
          page: Kn,
          ids: new Set(be.items.map((kn) => kn.id))
        }), Tt(be), L && hn(
          () => new Set(be.items.map((kn) => kn.id))
        ), ke(w), De(w)), be;
      } catch (ze) {
        throw W === Ae.current && Xn(
          ze instanceof Error ? ze.message : "Could not load the review queue."
        ), ze;
      } finally {
        W === Ae.current && Nn(!1);
      }
    },
    []
  );
  H(() => {
    var w;
    if (mt.current += 1, tn.current = -1, Ae.current += 1, (w = Ht.current) == null || w.abort(), St(null), nt.current = null, Q(!1), G(""), v(""), z(!1), Pt(/* @__PURE__ */ new Set()), pn.current.clear(), ht(null), Sn(!1), gr(!1), Cn.current = !1, Or(""), Qt(""), Wt(""), Tt({ items: [], totalCount: 0 }), xt.current = null, qn(!1), !M || Ze) {
      Nn(!1), kt(null);
      return;
    }
    let f = !0;
    return Nn(!0), (async () => {
      let O = re ?? M;
      kt(null);
      let L = null;
      const W = new URLSearchParams(window.location.search);
      if (_e(M) === "video" && Ia.some((Ge) => W.has(Ge)))
        try {
          const Ge = O;
          L = yi(Ge, W);
          const ze = gn(Ge, L.query);
          (L.query.startFrom !== (Ge.view.startFrom ?? "end") || !fr(
            JSON.parse(zn(ze)),
            JSON.parse(zn(gn(Ge, pr(Ge))))
          )) && (O = ze, kt(O));
        } catch (Ge) {
          qn(!0), Xn(Ge instanceof Error ? Ge.message : "Could not read review URL."), Nn(!1);
          return;
        }
      let V = null;
      try {
        V = await Wl(i, M.id);
      } catch (Ge) {
        f && (z(!0), v(
          Ge instanceof Error ? Ge.message : "Could not load progress."
        ));
      }
      if (!f) return;
      const ee = (V == null ? void 0 : V.signature) === zn(O) ? V : null, bt = L ? L.query.filter : ee ? Dt(ee.filter) : vf(O.view.filter);
      ke(bt), Zn(
        ee ? Wo(ee.displayMode, _e(M)) : Qo(M)
      ), na(
        ee ? ee.cardSize ?? Za : Za
      );
      try {
        const Ge = await on(
          O,
          bt,
          L ? L.startAtEnd : !ee && O.view.startFrom !== "beginning",
          O.view.selectAllOnLoad === !0
        );
        if (!f) return;
        const ze = go(
          Ge.items.map((be) => be.id),
          (ee == null ? void 0 : ee.focusedId) ?? null,
          (ee == null ? void 0 : ee.index) ?? 0
        );
        ht(ze), gt(ze);
      } catch {
      }
      f && (tn.current = yt, Q(!0), G(`${M.id}:${yt}`));
    })(), () => {
      var O;
      f = !1, mt.current++, Ae.current++, (O = Ht.current) == null || O.abort();
    };
  }, [M == null ? void 0 : M.id, Ze, yt]), H(() => {
    if (!(!vn || Ze || !M)) {
      if (vt) {
        Ut(0);
        return;
      }
      se || me || En || J !== `${M.id}:${yt}` || (Ut(0), Ka());
    }
  }, [
    vn,
    Ze,
    M == null ? void 0 : M.id,
    J,
    se,
    En,
    yt,
    vt
  ]), H(() => {
    !ce || Ze || !P || fe || Qe || se || ct.current || tn.current !== yt || Ur(ce.id, {
      filter: X,
      objectFilter: ce.view.objectFilter,
      searchMode: ce.view.searchMode,
      startFrom: ce.view.startFrom ?? "end"
    });
  }, [ce, Ze, P, fe, Qe, X, se, yt]);
  const he = ve(
    () => je.items.map((f) => f.id),
    [je.items]
  );
  H(() => {
    if (!P || !M || !i || fe || Qe || se || (Me == null ? void 0 : Me.id) === M.id || T || tn.current !== yt)
      return;
    const f = {
      version: 1,
      signature: zn(M),
      filter: X,
      focusedId: pt,
      index: Math.max(0, he.indexOf(pt ?? -1)),
      displayMode: Jt,
      cardSize: er,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        i + ":progress:" + M.id,
        JSON.stringify(f)
      );
    } catch {
    }
    if (B) return;
    let w = !0;
    const O = window.setTimeout(() => {
      Hl(i, M.id, f).catch((L) => {
        w && v(
          "Progress is kept in this browser, but account sync failed. " + (L instanceof Error ? L.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      w = !1, window.clearTimeout(O);
    };
  }, [
    P,
    i,
    M,
    fe,
    Qe,
    se,
    X,
    pt,
    he,
    Jt,
    er,
    Me,
    B,
    T,
    yt
  ]);
  const ia = je.items.find((f) => f.id === pt) ?? null, Fa = ye === "video" ? ia : null;
  Nt && Fa && (ta.current = Fa);
  const ir = Fa ?? (Nt ? ta.current : null), Rc = bo(lt, pt), Oc = he.length > 0 && he.every((f) => lt.has(f)), gt = mn((f, w = !0) => {
    f != null && window.requestAnimationFrame(() => {
      var L;
      if (Yn.current || _l(document.activeElement) || (L = document.activeElement) != null && L.closest(".dq-drawer"))
        return;
      const O = _n.current.get(f);
      O == null || O.focus({ preventScroll: !0 }), w && (O == null || O.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  H(() => {
    P && !zt.current && gt(Et.current);
  }, [P, gt]), H(() => {
    fe || !he.length || (Et.current == null || !he.includes(Et.current)) && (ht(he[0]), zt.current || gt(he[0]));
  }, [gt, he, fe]);
  const hn = mn(
    (f) => {
      Pt((w) => {
        const O = f(w);
        for (const L of /* @__PURE__ */ new Set([...w, ...O]))
          w.has(L) !== O.has(L) && pn.current.set(
            L,
            (pn.current.get(L) ?? 0) + 1
          );
        return O;
      });
    },
    []
  ), Pa = mn(
    (f) => {
      if (!he.length) return;
      const w = Math.max(
        0,
        he.indexOf(Et.current ?? he[0])
      ), O = he[Math.max(0, Math.min(he.length - 1, w + f))];
      ht(O), zt.current || gt(O);
    },
    [gt, he]
  ), oa = mn(
    async (f) => {
      const w = "steps" in f ? f.steps.length > 0 : f.effect.mode !== "SKIP", O = "effect" in f && f.effect.mode === "SET_TAG_GROUP" ? f.effect.tagGroupId : null, L = O != null && (!E || !R.some((We) => We.id === O)), W = "effect" in f && w && !E, V = bo(
        fn.current,
        Et.current
      );
      if (!M || Cn.current || fe || Qe) return;
      const ee = w && !C ? `${Fn} write permission is required to apply ${f.label}.` : W || L ? `${f.label} needs a tag group that is unavailable.` : Wn(f) && ($e == null ? void 0 : $e.kind) !== "ready" ? `Set up tag assessments before applying ${f.label}.` : V.length ? "" : `Select or focus a ${ye} before applying ${f.label}.`;
      if (ee) {
        Wt(ee);
        return;
      }
      const bt = ++mt.current, Ge = M.id, ze = [...he], be = je, Je = Et.current, Kn = new Set(fn.current), kn = new Map(
        V.map((We) => [We, pn.current.get(We) ?? 0])
      ), vr = () => bt === mt.current && M.id === Ge;
      Cn.current = !0, gr(!0), Or(
        fn.current.size ? `${V.length} selected ${ye}s` : `the focused ${ye}`
      ), Qt(""), Wt("");
      const uo = be.items.filter(
        (We) => !V.includes(We.id)
      ), Wc = uo.map((We) => We.id), fo = wo(
        ze,
        Wc,
        Je,
        V.includes(Je ?? -1)
      );
      Tt({
        items: uo,
        totalCount: be.totalCount
      }), Pt((We) => {
        const Lt = new Set(We);
        for (const sn of V) Lt.delete(sn);
        return Lt;
      }), ht(fo), zt.current || gt(fo);
      let Ba = !1;
      try {
        if ("effect" in f ? await pd(f, V) : await Rs(ft, f, V), Ba = !0, !vr()) return;
        Pt((We) => {
          const Lt = new Set(We);
          for (const sn of V)
            (pn.current.get(sn) ?? 0) === kn.get(sn) && Lt.delete(sn);
          return Lt;
        }), Qt(
          `${f.label}: ${V.length} ${ye}${V.length === 1 ? "" : "s"} ${w ? "updated" : "skipped"}.`
        );
      } catch (We) {
        if (!vr()) return;
        Tt(be), Pt((Lt) => {
          const sn = new Set(Lt);
          for (const Yt of V)
            Kn.has(Yt) && (pn.current.get(Yt) ?? 0) === kn.get(Yt) && sn.add(Yt);
          return sn;
        }), ht(Je), zt.current || gt(Je), Wt(
          We instanceof Error ? We.message : "Action failed."
        );
      }
      try {
        if (await od(f), !vr()) return;
        const We = new Set(V), Lt = Vt && ze.length > 0 && ze.every((cn) => We.has(cn)), sn = await on(M, X, !1, Lt);
        if (!vr()) return;
        let Yt = sn.items.map((cn) => cn.id);
        const la = xt.current, Hc = (la == null ? void 0 : la.page) === Number(X.page) && Yt.some((cn) => la.ids.has(cn)), Yc = (M.view.startFrom ?? "end") !== "beginning";
        if (sn.totalCount > 0 && Number(X.page) > 1 && (!Yt.length || Yc && !Hc)) {
          const cn = Math.max(1, Number(X.page) - 1), da = { ...X, page: cn };
          ke(da), Yt = (await on(
            M,
            da,
            !1,
            Lt
          )).items.map((Va) => Va.id), Pt(
            (Va) => new Set([...Va].filter((Xc) => Yt.includes(Xc)))
          );
          const ho = Yt.at(-1) ?? null;
          ht(ho), zt.current || gt(ho);
        } else {
          Pt(
            (da) => new Set([...da].filter((po) => Yt.includes(po)))
          );
          const cn = wo(
            ze,
            Yt,
            Je,
            Ba && V.includes(Je ?? -1)
          );
          ht(cn), zt.current && cn == null && Sn(!1), zt.current || gt(cn);
        }
      } catch (We) {
        vr() && Wt(
          (Lt) => `${Lt ? `${Lt} ` : ""}${Ba ? "The action completed, but " : ""}the queue could not be refreshed. ${We instanceof Error ? We.message : "Refresh failed."}`
        );
      } finally {
        vr() && (Cn.current = !1, gr(!1), Or(""), ct.current && (ct.current = !1, io(), Ft((We) => We + 1)));
      }
    },
    [
      C,
      E,
      R,
      ye,
      $e,
      on,
      X,
      gt,
      he,
      je,
      fe,
      Qe,
      M
    ]
  );
  function $c() {
    var O;
    if (Jt === "list") return 1;
    const f = (O = Mr.current) == null ? void 0 : O.firstElementChild, w = f ? getComputedStyle(f).gridTemplateColumns : "";
    return Math.max(1, w.split(" ").filter(Boolean).length);
  }
  const to = $(() => {
  });
  to.current = (f) => {
    var V;
    if (Ze || f.defaultPrevented || f.repeat || f.ctrlKey || f.altKey || f.metaKey || wt) return;
    const w = f.target, O = w instanceof Node && ((V = ar.current) == null ? void 0 : V.contains(w)) === !0, L = w === document.body || w === document.documentElement;
    if (!O && !L) return;
    if (rt) {
      f.key === "Escape" && (qr(f), rn(!1));
      return;
    }
    if (Nt && f.key === "Escape") {
      qr(f), Sn(!1), gt(Et.current);
      return;
    }
    if (!Dl(w)) return;
    const W = Ll(w);
    if (f.key === "Escape") {
      qr(f), hn(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!Nt && f.key === " " && W) {
      qr(f), pt != null && hn((ee) => ga(ee, pt));
      return;
    }
    if (!(se || fe) && !Nt && f.key === "Enter" && pt != null && W) {
      if (ye !== "tag" && me) return;
      qr(f), ye === "tag" ? window.open(`/tag/${pt}`, "_blank", "noopener,noreferrer") : Sn(!0);
      return;
    }
  }, H(() => {
    const f = (w) => to.current(w);
    return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
  }, []);
  const no = $(
    () => {
    }
  );
  no.current = (f) => {
    var V;
    if (Ze || wt || Nt || rt || se || fe || !he.length || f.defaultPrevented || f.repeat || f.ctrlKey || f.altKey || f.metaKey)
      return;
    const w = f.target, O = w instanceof Node && ((V = ar.current) == null ? void 0 : V.contains(w)) === !0, L = w === document.body || w === document.documentElement;
    if (!O && !L || !f.key.startsWith("Arrow") || !jl(w)) return;
    const W = Ul(f.key, $c());
    W && (f.preventDefault(), O ? f.stopImmediatePropagation() : f.stopPropagation(), Pa(W));
  }, H(() => {
    const f = (w) => no.current(w);
    return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
  }, []);
  const Gn = (me == null ? void 0 : me.saving) === !0 || En, xa = se || fe && !P || Gn, Ic = ji();
  _i({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!M && !Ze && !wt && !me && !Nt && !rt && !Qe && (je.items.length > 0 || fe || se),
    actions: (M == null ? void 0 : M.actions) ?? Yo,
    onAction: (f) => {
      const w = M == null ? void 0 : M.actions[f];
      w && oa(w);
    },
    onFind: () => rn(!0),
    onSelectAll: () => hn((f) => xl(f, he))
  }), H(() => rn(!1), [Ze, Nt, M == null ? void 0 : M.id]);
  function ro(f) {
    const w = "steps" in f ? f.steps.length > 0 : f.effect.mode !== "SKIP", O = "effect" in f && f.effect.mode === "SET_TAG_GROUP" ? f.effect.tagGroupId : null, L = O != null && !R.some((W) => W.id === O);
    return se || fe || !!Qe || w && !C || "effect" in f && w && (!E || L) || Wn(f) && ($e == null ? void 0 : $e.kind) !== "ready" || !Rc.length;
  }
  function La(f) {
    Xe(null), Ut(0), Ce(null), Pe(f), ei(f, !!f && !M);
  }
  function ao() {
    He.current || (Nc() ? (He.current = !0, window.history.back()) : La(""));
  }
  function io() {
    const f = He.current;
    He.current = !1;
    let w = Ho();
    w && !Se.current && !Ke.current.some((L) => L.id === w) && (w = "", ei(""));
    const O = we.current;
    w !== O && (Ut(0), f || Ce(null), !w && O && (Ie.current ?? (Ie.current = { reviewId: O }))), Pe(w);
  }
  function Da() {
    Ie.current = "heading", Ce(null), ao();
  }
  function _a(f) {
    f !== A && La(f), Ut((w) => w + 1);
  }
  function Mc() {
    Ce(null), It({
      review: kc("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function Fc(f) {
    if (Ct || !U) return;
    Ce(null);
    const w = crypto.randomUUID();
    let O;
    const L = A;
    yn(!0);
    try {
      if (!await xr((V) => (O = Pl(
        V.find((ee) => ee.id === f.id) ?? f,
        V,
        w
      ), [...V, O]))) throw new Error("Could not save reviews.");
      if (!Ee.current) return;
      we.current !== L ? Ce({ text: `Saved the copy “${O.name}”.`, alert: !1 }) : _a(O.id);
    } catch (W) {
      Ce({
        text: `“${f.name}” was not duplicated. ${sa(W)}`,
        alert: !0
      });
    } finally {
      yn(!1);
    }
  }
  async function Pc() {
    if (!st || st.saving) return;
    const f = { ...st.review, name: st.review.name.trim() }, w = Vr(f);
    if (w) {
      It({ ...st, error: w });
      return;
    }
    It({ ...st, saving: !0, error: "" });
    try {
      if (!await xr((O) => [...O, f]))
        throw new Error("Could not save reviews.");
      if (!Ee.current) return;
      It(null), _a(f.id);
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
  async function xc() {
    if (!ut || ut.pending) return;
    const f = ut.review, w = Cc(t, tt, de, Ve).map((W) => W.id), O = w.filter((W) => W !== f.id), L = O[Math.min(w.indexOf(f.id), O.length - 1)];
    jt({ review: f, pending: !0 });
    try {
      if (!await xr((W) => W.filter((V) => V.id !== f.id)))
        throw new Error("Could not save reviews.");
      Ie.current = f.id !== A && L ? { reviewId: L } : "heading", Ce({ text: `Deleted “${f.name}”.`, alert: !1 });
    } catch (W) {
      Ce({ text: `“${f.name}” was not deleted. ${sa(W)}`, alert: !0 });
    } finally {
      jt(null);
    }
  }
  async function Lc(f) {
    if (!(Ct || !U)) {
      Ce(null), _t(!0);
      try {
        const w = await su(f);
        let O = 0;
        if (w.length && !await xr((W) => {
          const V = ni(W, w);
          return O = V.length - W.length, O ? V : W;
        }))
          throw new Error("Could not save reviews.");
        const L = w.length - O;
        Ce({
          alert: !1,
          text: w.length ? O ? `Imported ${O === 1 ? "1 review" : `${O} reviews`}.` + (L === 1 ? " 1 review already in the list stays as it is." : L ? ` ${L} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (w) {
        Ce({ alert: !0, text: `Could not import “${f.name}”. ${sa(w)}` });
      } finally {
        _t(!1);
      }
    }
  }
  function sa(f) {
    return f instanceof ys ? "Reviews changed in another browser. Reload the page to get them, then try again." : f instanceof Error ? f.message : "Try again.";
  }
  function oo(f) {
    const w = !U || Ct;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ r(os, { "aria-hidden": "true" }),
        disabled: w,
        onSelect: () => void Fc(f)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ r(hs, { "aria-hidden": "true" }),
        onSelect: () => Vi(f)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ r(ss, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: w,
        onSelect: () => {
          Ce(null), jt({ review: f, pending: !1 });
        }
      }
    ];
  }
  function so(f, w) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ r(Cr, { "aria-hidden": "true" }),
        ...w,
        disabled: w.disabled || Oe
      },
      ...oo(f),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ r(Wr, { "aria-hidden": "true" }),
        separated: !0,
        disabled: Oe,
        onSelect: Da
      }
    ];
  }
  async function xr(f) {
    if (!i) return !1;
    let w = [];
    const O = await Ql(i, (ee) => {
      w = ee;
      const bt = f(ee);
      return bt === ee ? ee : bt.map(Tf);
    });
    if (n(O), !Ee.current) return !0;
    const L = we.current;
    L && !O.some((ee) => ee.id === L) && ao();
    const W = w.find((ee) => ee.id === L), V = O.find((ee) => ee.id === L);
    return V && W && ((V.view.reviewMode ?? "single") !== (W.view.reviewMode ?? "single") && Xe(null), V.view.displayMode !== W.view.displayMode && Zn(Qo(V))), !0;
  }
  function ja(f) {
    return xr((w) => Af(w, f));
  }
  function Dc(f) {
    return ja(f).catch((w) => {
      throw we.current !== f.id && Ua(f, w), w;
    });
  }
  function Ua(f, w) {
    var L;
    if (!Ee.current) return;
    const O = ((L = Ke.current.find((W) => W.id === f.id)) == null ? void 0 : L.name) ?? f.name;
    Ce({ text: `“${O}” was not saved. ${sa(w)}`, alert: !0 });
  }
  if (s)
    return /* @__PURE__ */ r(Xo, { label: "Loading reviews…" });
  if (d)
    return /* @__PURE__ */ l(ue, { children: [
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          onClick: () => void Mf().catch(
            (f) => h(
              "Could not export browser reviews. " + (f instanceof Error ? f.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ r(
        Zo,
        {
          message: d,
          onRetry: () => void Fr()
        }
      )
    ] });
  const Ga = /* @__PURE__ */ l(ue, { children: [
    ie && /* @__PURE__ */ r("p", { className: "dq-status", children: ie }),
    Ye && ($e == null ? void 0 : $e.kind) === "missing" && /* @__PURE__ */ l("div", { role: "status", className: "dq-status", children: [
      $e.message,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: rr,
          onClick: () => {
            br(!0), Dn(""), (At ? ld(ft) : cd(ft)).then(Un).catch(
              (f) => Dn(
                `Could not create the ${At ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (f instanceof Error ? f.message : "Request failed.")
              )
            ).finally(() => br(!1));
          },
          children: rr ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    Ye && (($e == null ? void 0 : $e.kind) === "incompatible" || ra) && /* @__PURE__ */ l("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(An, {}),
      ra || ($e == null ? void 0 : $e.message),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: rr,
          onClick: () => {
            br(!0), Un().finally(
              () => br(!1)
            );
          },
          children: rr ? "Checking…" : "Check again"
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
            const f = localStorage.getItem("page-videos") ?? "[]", w = URL.createObjectURL(
              new Blob([f], { type: "application/json" })
            ), O = document.createElement("a");
            O.href = w, O.download = "data-quality-unassigned-legacy-reviews.json", O.click(), URL.revokeObjectURL(w);
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
            v(""), z(!1);
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
      ref: ar,
      className: `data-quality-page${jn ? " dq-page-fit" : ""}`,
      style: jn ? {
        "--dq-fit-top": `${p.top}px`,
        "--dq-fit-bottom": `${p.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ r("p", { className: "dq-sr-only", "aria-live": "polite", children: it && !it.alert ? it.text : "" }),
        M && Ze ? /* @__PURE__ */ r(
          uf,
          {
            review: re ?? M,
            canWrite: Mn ? y : Bt,
            canAssess: ($e == null ? void 0 : $e.kind) === "ready" && Bt,
            onBusy: gr,
            editRequest: vn,
            onEditRequestHandled: () => Ut(0),
            onSaveDefaults: U ? Dc : void 0,
            pageControls: {
              onBack: Da,
              moreItems: (f) => so(re ?? M, f),
              onGrid: ce ? () => Xe({ id: ce.id, mode: "multiple" }) : void 0,
              notices: Ga,
              busy: Oe
            },
            stayOnTap: Mt,
            onStayOnTapChange: un
          },
          M.id
        ) : M ? Jc(M) : /* @__PURE__ */ r(
          gf,
          {
            reviews: t,
            counts: tt,
            sort: de,
            direction: Ve,
            onSortChange: (f) => qt({ sort: f }),
            onDirectionChange: (f) => qt({ direction: f }),
            storage: wf[te],
            canConfigure: U,
            busy: Ct,
            headingRef: dn,
            notices: Ga,
            onOpen: La,
            onNew: () => Mc(),
            onImport: (f) => void Lc(f),
            onExportAll: () => tc(t, "data-quality-reviews.json"),
            rowMenuItems: (f) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ r(Cr, { "aria-hidden": "true" }),
                disabled: !U || Ct,
                onSelect: () => _a(f.id)
              },
              ...oo(f)
            ]
          }
        ),
        Nt && ir && ce && /* @__PURE__ */ r(
          If,
          {
            video: ir,
            review: ce,
            selectedCount: lt.size,
            pending: se,
            refreshing: fe || !!Qe,
            error: nr,
            canWrite: u,
            assessmentReady: ($e == null ? void 0 : $e.kind) === "ready",
            trees: et,
            selected: lt.has(ir.id),
            hasPrevious: he.indexOf(ir.id) > 0,
            hasNext: he.indexOf(ir.id) >= 0 && he.indexOf(ir.id) < he.length - 1,
            onToggleSelected: () => hn((f) => ga(f, ir.id)),
            onPrevious: () => Pa(-1),
            onNext: () => Pa(1),
            onClose: () => {
              Sn(!1), gt(Et.current);
            },
            onAction: oa,
            findOpen: rt,
            onFindOpenChange: rn
          }
        ),
        rt && M && !Ze && !Nt && /* @__PURE__ */ r(
          Ki,
          {
            actions: M.actions,
            tagGroups: R,
            trees: et,
            isDisabled: ro,
            canStay: !1,
            onApply: (f) => {
              rn(!1), oa(f);
            },
            onClose: () => rn(!1)
          }
        ),
        st && /* @__PURE__ */ r(
          bf,
          {
            draft: st,
            onChange: (f) => It((w) => w && { ...w, review: f, error: "" }),
            onCreate: () => void Pc(),
            onCancel: () => It(null)
          }
        ),
        /* @__PURE__ */ r(
          ll,
          {
            open: !!ut,
            title: "Delete review?",
            message: ut ? `“${ut.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (ut == null ? void 0 : ut.pending) ?? !1,
            onConfirm: () => void xc(),
            onCancel: () => jt((f) => f != null && f.pending ? f : null)
          }
        )
      ]
    }
  );
  async function ca(f, w, O = !1, L = !0) {
    const W = Et.current, V = Math.max(0, he.indexOf(W ?? -1));
    try {
      const ee = on(
        f,
        w,
        O,
        f.view.selectAllOnLoad === !0
      ), bt = Ae.current, Ge = await ee;
      if (bt !== Ae.current) return;
      const ze = Ge.items.map((Je) => Je.id);
      Pt(
        (Je) => new Set([...Je].filter((Kn) => ze.includes(Kn)))
      );
      const be = go(ze, W, V);
      ht(be), L && !zt.current && gt(be, !1);
    } catch {
    }
  }
  function _c(f) {
    const w = F.current;
    if (F.current = null, xa || !M || !re) return;
    const O = w ?? M.view.objectFilter, L = fr(
      O,
      re.view.objectFilter
    ) ? re.view.objectFilter : O, W = Dt({ ...f, page: 1 }), V = {
      ...M,
      view: {
        ...M.view,
        filter: W,
        objectFilter: L
      }
    }, ee = !Jo(V, re), bt = ee ? V : re;
    kt(ee ? V : null), Qt(ee ? "" : "Review queue defaults restored."), ca(bt, W, !0);
  }
  function jc() {
    if (se || fe || Gn || !re) return;
    F.current = null;
    const f = Dt({
      ...re.view.filter,
      page: 1
    });
    kt(null), Qt("Review queue defaults restored."), ca(
      re,
      f,
      re.view.startFrom !== "beginning",
      !1
    );
  }
  function Uc() {
    if (se || fe || Qe || Gn || !M || !Ot || !U)
      return;
    const f = M, w = Ot;
    tr(!0), ja(w).then((O) => {
      !O || we.current !== w.id || (kt(zo(w, f)), Qt("Queue saved to this review."));
    }).catch((O) => {
      we.current !== w.id ? Ua(w, O) : Wt(O instanceof Error ? O.message : "Could not save queue.");
    }).finally(() => tr(!1));
  }
  function Ka() {
    if (!M || !re || Cn.current || me || En) return;
    In.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, nt.current = {
      temporaryReview: Me,
      filter: X,
      loadedFilter: ge,
      queue: je,
      queueError: Qe,
      retryFromEnd: Rt,
      selectedIds: new Set(lt),
      focusedId: pt,
      pageCursor: xt.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const f = structuredClone({
      ...re,
      view: { ...re.view, startFrom: M.view.startFrom ?? "end" }
    });
    rn(!1), Sn(!1), Qt(""), Wt(""), St({ draft: f, saving: !1, error: "" });
  }
  function co() {
    St(null), nt.current = null;
    const f = In.current;
    In.current = null, requestAnimationFrame(() => {
      (f == null ? void 0 : f.isConnected) && f !== document.body && !(f instanceof HTMLButtonElement && f.disabled) ? f.focus({ preventScroll: !0 }) : gt(Et.current, !1);
    });
  }
  function Gc() {
    var w;
    if (!me || me.saving) return;
    const f = nt.current;
    f && (Ae.current += 1, (w = Ht.current) == null || w.abort(), F.current = null, Nn(!1), kt(f.temporaryReview), ke(f.filter), De(f.loadedFilter), Tt(f.queue), Xn(f.queueError), Pn(f.retryFromEnd), hn(() => f.selectedIds), ht(f.focusedId), xt.current = f.pageCursor, window.history.replaceState(window.history.state, "", f.url)), co();
  }
  async function Kc() {
    if (!me || me.saving || !Fe || !M) return;
    const f = M, w = { ...Fe, name: Fe.name.trim() }, O = Vr(w);
    if (O) {
      St((L) => L && { ...L, error: O });
      return;
    }
    St((L) => L && { ...L, saving: !0, error: "" });
    try {
      if (!await ja(w)) throw new Error("Could not save reviews.");
      if (!Ee.current || we.current !== w.id) return;
      kt(zo(w, f)), _e(w) === "video" && Ur(w.id, {
        filter: X,
        objectFilter: f.view.objectFilter,
        searchMode: w.view.searchMode,
        startFrom: w.view.startFrom ?? "end"
      }), Qt("Review saved."), co();
    } catch (L) {
      if (we.current !== w.id) {
        Ua(w, L);
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
  function lo() {
    M && on(M, X, Rt, Vt).catch(() => {
    });
  }
  function Bc() {
    Pt(/* @__PURE__ */ new Set()), pn.current.clear(), ht(null);
  }
  function Vc(f) {
    !M || se || Gn || f === Number(X.page) || kf(
      { ...X, page: f },
      M,
      (w, O) => on(w, O, !1, Vt),
      Bc
    );
  }
  function zc(f) {
    if (!ce || !re || se || fe || Gn) return;
    const w = rf(ce, f, re.view.objectFilter), O = !Jo(w, re);
    kt(O ? w : null), O ? ca(w, { ...X, page: 1 }) : ca(
      re,
      { ...X, page: 1 },
      re.view.startFrom !== "beginning"
    );
  }
  function Jc(f) {
    var Ge, ze;
    const w = ye === "tag", O = w ? "tag" : "video", L = Math.max(1, Number(X.perPage) || 40), W = Math.max(1, Math.ceil(je.totalCount / L)), V = Math.min(Math.max(1, Number(X.page) || 1), W), ee = [
      C ? "" : `${Fn} write permission is required to apply actions.`,
      w && j ? `Tag groups are unavailable. ${j}` : ""
    ].filter(Boolean), bt = !!nr && !Nt;
    return /* @__PURE__ */ l(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": w ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ r(
            ac,
            {
              name: f.name,
              description: f.description,
              entityType: ye,
              onBack: Da,
              backDisabled: se || !!me || Oe,
              onEdit: me ? () => {
                var be;
                return (be = Gt.current) == null ? void 0 : be.focus();
              } : Ka,
              editDisabled: !me && (se || fe || vt || En || Oe || !U),
              editing: !!me,
              toolbar: /* @__PURE__ */ l("fieldset", { className: "dq-review-toolbar", disabled: xa, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: w ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ r(
                  Gr,
                  {
                    filter: Qe ? ge : X,
                    onFilterChange: _c,
                    totalCount: je.totalCount,
                    sortOptions: w ? ul : ns,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: Jt,
                    zoomLevel: (er - 225) / 50,
                    onZoomChange: (be) => na(Math.round(225 + be * 50)),
                    cardSizeEntityType: w ? "tags" : "videos",
                    criteriaDefinitions: w ? dl : Si,
                    customFieldEntityType: ye === "video" ? "video" : void 0,
                    objectFilter: Ma,
                    onObjectFilterChange: (be) => {
                      xa || (F.current = ye === "video" ? sc(
                        be,
                        wr,
                        f.view.objectFilter
                      ) : be);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(ic, { page: V, pages: W, onPage: Vc })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ l(ue, { children: [
                ce && /* @__PURE__ */ r(
                  oc,
                  {
                    mode: "multiple",
                    disabled: se || fe || wt || !!me || En || Oe,
                    onChange: () => Xe({ id: ce.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ r(
                  yu,
                  {
                    options: w ? qf : Nf,
                    value: Jt,
                    onChange: (be) => Zn(Wo(be, ye))
                  }
                )
              ] }),
              trailingEnd: /* @__PURE__ */ r(
                zi,
                {
                  disabled: se || !!me,
                  items: so(re ?? f, {
                    onSelect: Ka,
                    disabled: fe || vt || En || !U
                  })
                }
              ),
              queueDiffers: P ? (Me == null ? void 0 : Me.id) === A : void 0,
              queueChange: !me && (Me == null ? void 0 : Me.id) === A ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: an ? Uc : void 0,
                saveDisabled: se || fe || !!Qe || Gn || !U,
                onReset: jc,
                resetDisabled: se || fe || Gn
              } : void 0,
              chipsAfter: (ze = (Ge = ce == null ? void 0 : ce.presentation) == null ? void 0 : Ge.binParents) != null && ze.length ? /* @__PURE__ */ r(
                tf,
                {
                  videos: je.items,
                  review: ce,
                  savedObjectFilter: (re ?? ce).view.objectFilter,
                  trees: ae.ids,
                  disabled: se || fe || Gn,
                  onToggle: zc
                }
              ) : void 0,
              chipsEnd: me ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
            }
          ),
          Ga,
          ce && ae.error && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: ae.error }),
          /* @__PURE__ */ l("div", { className: "dq-review-area", children: [
            me && Fe && /* @__PURE__ */ r(
              rc,
              {
                drawerRef: Gt,
                draft: Fe,
                onChange: (be) => St((Je) => Je && { ...Je, draft: be }),
                direction: me.draft.view.startFrom ?? "end",
                onDirectionChange: (be) => St(
                  (Je) => Je && {
                    ...Je,
                    draft: { ...Je.draft, view: { ...Je.draft.view, startFrom: be } }
                  }
                ),
                tagGroups: R,
                trees: et,
                saving: me.saving,
                saveDisabled: fe || !!Qe,
                error: me.error,
                dirty: yr,
                criteriaChanged: an,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  Qe && !fe ? /* @__PURE__ */ l("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ r(An, { "aria-hidden": "true" }),
                    /* @__PURE__ */ l("span", { children: [
                      "The queue could not load: ",
                      Qe,
                      " ",
                      /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", onClick: lo, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void Kc(),
                onCancel: Gc
              }
            ),
            /* @__PURE__ */ l(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${x}px` },
                children: [
                  /* @__PURE__ */ l("div", { className: "dq-grid-content", children: [
                    fe && !je.items.length && /* @__PURE__ */ r(Xo, { label: "Loading review queue…" }),
                    Qe && !fe && /* @__PURE__ */ r(
                      Zo,
                      {
                        message: Qe,
                        retryLabel: vt ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (vt && re && _e(re) === "video") {
                            const be = pr(re);
                            Ur(re.id, { ...be, filter: { ...be.filter, page: void 0 } }), Ft((Je) => Je + 1);
                            return;
                          }
                          lo();
                        }
                      }
                    ),
                    !se && !fe && !Qe && !je.items.length && /* @__PURE__ */ l("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ r(Ta, {}),
                      /* @__PURE__ */ l("p", { children: [
                        "No ",
                        O,
                        "s match this review."
                      ] })
                    ] }),
                    !!je.items.length && /* @__PURE__ */ r("div", { ref: Mr, children: /* @__PURE__ */ r(
                      "div",
                      {
                        className: Jt === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${er}px` },
                        children: je.items.map(Qc)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ r("div", { className: "dq-bar-dock", ref: pe, children: /* @__PURE__ */ r(
                    Qs,
                    {
                      actions: me ? me.draft.actions : f.actions,
                      tagGroups: R,
                      trees: et,
                      isDisabled: ro,
                      paused: !!me,
                      busy: se || fe,
                      onApply: (be) => void oa(be),
                      onFind: () => rn(!0),
                      status: se ? `Applying action to ${xn}…` : "",
                      summary: /* @__PURE__ */ l(ue, { children: [
                        /* @__PURE__ */ r("p", { className: "dq-bar-target", children: lt.size ? `${lt.size} selected` : pt == null ? "Nothing to apply to" : `Applies to the focused ${O}` }),
                        /* @__PURE__ */ l(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !he.length || Oc,
                            onClick: () => hn((be) => /* @__PURE__ */ new Set([...be, ...he])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ r(at, { binding: Ic.selectAll, hidden: !0 })
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
                      keyHints: w ? "Arrows move · Space selects · Enter opens" : me ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews",
                      notices: bt || Ln ? /* @__PURE__ */ l(ue, { children: [
                        bt && /* @__PURE__ */ l("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ r(An, { "aria-hidden": "true" }),
                          nr
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
  function Qc(f) {
    var O, L, W;
    if (ye === "tag") {
      const V = f;
      return /* @__PURE__ */ r(
        Rf,
        {
          tag: V,
          displayMode: Jt === "list" ? "list" : "grid",
          focused: V.id === pt,
          selected: lt.has(V.id),
          setRef: (ee) => {
            ee ? _n.current.set(V.id, ee) : _n.current.delete(V.id);
          },
          onFocus: () => ht(V.id),
          onToggle: () => {
            hn((ee) => ga(ee, V.id)), gt(V.id, !1);
          },
          onOpen: () => window.open(`/tag/${V.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        V.id
      );
    }
    const w = f;
    return /* @__PURE__ */ r(
      Of,
      {
        video: ef(w, ce, ae.ids),
        showTagBins: ((L = (O = ce == null ? void 0 : ce.presentation) == null ? void 0 : O.annotations) == null ? void 0 : L.includes("tags")) && !!((W = ce.presentation.annotationParents) != null && W.length),
        displayMode: Jt,
        cardsScroll: aa,
        focused: w.id === pt,
        selected: lt.has(w.id),
        setRef: (V) => {
          V ? _n.current.set(w.id, V) : _n.current.delete(w.id);
        },
        onFocus: () => ht(w.id),
        onToggle: () => hn((V) => ga(V, w.id)),
        onPreview: () => {
          me || (ht(w.id), Sn(!0));
        },
        onNavigate: e
      },
      w.id
    );
  }
}
function kf(e, t, n, a) {
  a(), n(t, e).catch(() => {
  });
}
function ga(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function Af(e, t) {
  if (!e.some((n) => n.id === t.id)) throw new Error("This review was deleted.");
  return e.map((n) => n.id === t.id ? t : n);
}
function Tf(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Rf({
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
        fl,
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
function Of({
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
  var E, b;
  const g = Ac(e), m = $(null), q = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, y = !!(q.date || q.studioName), N = !!(q.performers.length || q.tags.length);
  return $t(() => {
    const R = m.current;
    if (!R) return;
    const I = R.querySelector(
      `a[href="/video/${e.id}"]`
    ), j = R.querySelector(".card-title"), D = `dq-card-title-${e.id}`;
    j && (j.id = D), I && (I.target = "_blank", I.rel = "noreferrer", I.removeAttribute("aria-label"), I.setAttribute("aria-labelledby", D), I.classList.add("dq-card-link"));
    const U = R.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    U && U.setAttribute(
      "aria-label",
      o ? `Deselect ${g}` : `Select ${g}`
    );
    const Z = R.querySelector(
      'button[title="Quick View"]'
    );
    Z && Z.setAttribute("aria-label", `Preview ${g}`);
  }), /* @__PURE__ */ l(
    "article",
    {
      ref: (R) => {
        m.current = R, s(R);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${g}${o ? ", selected" : ""}`,
      onFocus: c,
      onClick: (R) => {
        c(), R.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${y ? "has-card-metadata" : "no-card-metadata"} ${N ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ r(
          pl,
          {
            video: q,
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
          (E = e.tags) == null ? void 0 : E.map((R) => /* @__PURE__ */ r("span", { children: R.name }, R.id)),
          !((b = e.tags) != null && b.length) && /* @__PURE__ */ r("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ r($f, { video: e, cardsScroll: a })
      ]
    }
  );
}
function $f({ video: e, cardsScroll: t }) {
  const n = $(null), a = $(null), [i, o] = k(!1), [s, c] = k(!1), [d, h] = k(!1);
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
    ), q = new IntersectionObserver(
      ([y]) => c(y.isIntersecting && y.intersectionRatio >= 0.6),
      { root: g, threshold: [0, 0.6, 1] }
    );
    return m.observe(u), q.observe(u), () => {
      m.disconnect(), q.disconnect();
    };
  }, [e.id, e.files.length, t]), H(() => {
    if (!i) {
      h(!1);
      return;
    }
    const u = new AbortController();
    return le(id(e.id), {
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
      src: ad(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function If({
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
  onPrevious: q,
  onNext: y,
  onClose: N,
  onAction: E,
  findOpen: b,
  onFindOpenChange: R
}) {
  const I = $(null), j = Zr(), D = $(null), U = e.files[0], Z = Ac(e), te = (v) => a || i || "steps" in v && v.steps.length > 0 && !s || Wn(v) && !c;
  _i({
    surface: "overlay",
    enabled: !b,
    actions: t.actions,
    onAction: (v) => {
      const T = t.actions[v];
      T && E(T);
    },
    onFind: () => R(!0)
  }), H(() => {
    var T;
    const v = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (T = I.current) == null || T.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = v;
    };
  }, []);
  function ne(v) {
    var P, Q, J;
    if (v.key !== "Tab") return;
    const T = [
      ...((P = I.current) == null ? void 0 : P.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((G) => G.offsetParent !== null);
    if (!T.length) {
      v.preventDefault(), (Q = I.current) == null || Q.focus();
      return;
    }
    const z = T.indexOf(
      document.activeElement
    );
    v.shiftKey && z <= 0 ? (v.preventDefault(), (J = T.at(-1)) == null || J.focus()) : !v.shiftKey && z === T.length - 1 && (v.preventDefault(), T[0].focus());
  }
  function ie(v) {
    if (b || v.defaultPrevented || v.ctrlKey || v.metaKey || v.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const T = v.key === "ArrowLeft" || v.key === "ArrowRight";
    if (v.altKey && !T) return;
    const z = D.current, P = v.currentTarget.querySelector("video");
    if (v.key === "Enter" || v.key === "Escape")
      v.repeat || N();
    else if (v.key === " " && z)
      v.repeat || z.toggle();
    else if (T && z)
      z.seekBy(
        (v.key === "ArrowLeft" ? -1 : 1) * (v.shiftKey ? 5 : v.altKey ? 10 : 60)
      );
    else if ((v.key === "," || v.key === ".") && z) {
      const Q = [U == null ? void 0 : U.duration, P == null ? void 0 : P.duration].find(
        (G) => G != null && Number.isFinite(G) && G > 0
      ) ?? 0, J = e.parentVideoId != null ? (e.clipEndSec ?? Q) - (e.clipStartSec ?? 0) : Q;
      Number.isFinite(J) && J > 0 && z.seekBy((v.key === "," ? -1 : 1) * J * 0.1);
    } else if (v.key.toLowerCase() === "n" || v.key.toLowerCase() === "m")
      !v.repeat && !a && !i && (v.key.toLowerCase() === "n" && u && q(), v.key.toLowerCase() === "m" && g && y());
    else if (v.key === "ArrowUp" && P)
      P.volume = Math.min(1, P.volume + 0.1);
    else if (v.key === "ArrowDown" && P)
      P.volume = Math.max(0, P.volume - 0.1);
    else return;
    qr(v);
  }
  function _(v) {
    const T = I.current, z = v.target instanceof Element ? v.target.closest("button, a[href]") : null;
    !T || !z || !T.contains(z) || z.closest(".dq-player, .dq-find-action") || v.detail === 0 || T.focus({ preventScroll: !0 });
  }
  H(() => {
    if (b) return;
    let v = 0;
    const T = requestAnimationFrame(() => {
      v = requestAnimationFrame(() => {
        var P;
        const z = document.activeElement;
        (P = I.current) != null && P.isConnected && (!z || z === document.body || z === document.documentElement) && I.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(T), cancelAnimationFrame(v);
    };
  }, [b, a, i, g, u, e.id, j]);
  const B = n ? `the ${n} selected video${n === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ l(
    "div",
    {
      ref: I,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${Z}`,
      className: `dq-preview${j ? " dq-preview-mobile" : ""}`,
      onKeyDown: ne,
      onKeyDownCapture: ie,
      onMouseDown: (v) => {
        v.target === v.currentTarget && N();
      },
      onClick: _,
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
                onClick: q,
                children: [
                  /* @__PURE__ */ r(Wr, { "aria-hidden": "true" }),
                  !j && /* @__PURE__ */ r(at, { binding: "n", hidden: !0 })
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
                  !j && /* @__PURE__ */ r(at, { binding: "m", hidden: !0 }),
                  /* @__PURE__ */ r(fs, { "aria-hidden": "true" })
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
                  /* @__PURE__ */ r("span", { className: "dq-preview-check", "aria-hidden": "true", children: h && /* @__PURE__ */ r(Aa, {}) }),
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
                children: /* @__PURE__ */ r(ps, { "aria-hidden": "true" })
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
                children: /* @__PURE__ */ r(Qr, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ r("div", { className: "dq-preview-video", children: U ? /* @__PURE__ */ r(
            rs,
            {
              autostart: !0,
              streamUrl: si("video", e.id),
              posterUrl: No(e),
              format: U.format,
              audioCodec: U.audioCodec,
              duration: U.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onPlaybackControlRegister: (v) => (D.current = v, () => {
                D.current === v && (D.current = null);
              }),
              clip: e.parentVideoId != null ? {
                start: e.clipStartSec ?? 0,
                end: e.clipEndSec,
                loop: !1
              } : void 0
            }
          ) : /* @__PURE__ */ r("img", { src: No(e), alt: "" }) }) }),
          o && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert dq-preview-alert", children: o }),
          !j && /* @__PURE__ */ l("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ r("span", { children: "Space play / pause" }),
            /* @__PURE__ */ r("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ r("span", { children: ", . ±10 %" }),
            /* @__PURE__ */ r("span", { children: "↑ ↓ volume" }),
            /* @__PURE__ */ r("span", { children: "N M previous / next" }),
            /* @__PURE__ */ r("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ r(
            Qs,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: d,
              isDisabled: te,
              busy: a || i,
              onApply: (v) => void E(v),
              onFind: () => R(!0),
              status: a ? `Applying action to ${B}…` : "",
              summary: /* @__PURE__ */ r("p", { className: "dq-bar-target", children: n ? `${n} selected` : "This video" })
            }
          )
        ] }),
        b && /* @__PURE__ */ r(
          Ki,
          {
            actions: t.actions,
            trees: d,
            isDisabled: te,
            canStay: !1,
            onApply: (v) => {
              R(!1), E(v);
            },
            onClose: () => R(!1)
          }
        )
      ]
    }
  );
}
async function Mf() {
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
function Xo({ label: e }) {
  return /* @__PURE__ */ l("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ r(Cl, { className: "dq-spin" }),
    e
  ] });
}
function Zo({
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
const _f = { components: { DataQualityPage: Cf } };
export {
  Cf as DataQualityPage,
  _f as default,
  fr as objectFiltersEqual
};
