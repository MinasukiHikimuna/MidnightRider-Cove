import { jsxs as c, Fragment as de, jsx as r } from "react/jsx-runtime";
import { useState as A, useRef as R, useEffect as J, useLayoutEffect as ln, useMemo as ye, useCallback as mn, useSyncExternalStore as gi, useId as vt, Fragment as bi, createContext as zc, useContext as Qc } from "react";
import { useKeySequence as Wc, EntityReferenceMultiSelector as Tn, SortableList as Qo, EntityDetailTabs as Hc, TagBadge as Yc, DetailListToolbar as Gr, PERFORMER_CRITERIA as wi, AUDIO_CRITERIA as Wo, VIDEO_CRITERIA as yi, NarrativeText as Xc, AUDIO_SORT_OPTIONS as Zc, VIDEO_SORT_OPTIONS as Ho, AudioPlayer as el, VideoPlayer as Yo, formatDuration as Xo, FilterDialog as tl, getResolutionLabel as nl, ConfirmDialog as rl, TAG_CRITERIA as al, TAG_SORT_OPTIONS as il, TagTile as ol, VideoCard as sl } from "@cove/runtime/components";
import { Search as zr, Check as ka, Pencil as Cr, Ban as ba, Pin as vi, Plus as Ni, GripVertical as Zo, AlertTriangle as Cn, Copy as es, Trash2 as ts, ChevronDown as ns, X as Qr, Mic as cl, Users as rs, Tag as as, Headphones as is, Film as Ca, ChevronLeft as Wr, RectangleHorizontal as ll, LayoutGrid as qi, MoreHorizontal as dl, ChevronRight as os, Layers as lo, Undo2 as ul, Flag as wa, RefreshCw as fl, Save as ss, RotateCcw as cs, ExternalLink as ls, SkipForward as pl, Upload as hl, Download as ds, ArrowUp as ml, ArrowDown as gl, Loader2 as bl, List as wl, Grid3X3 as yl } from "@cove/runtime/lucide-react";
import { extensionFetch as vl } from "@cove/runtime/api";
const Si = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, Ei = Object.keys(
  Si
);
function Kr(e) {
  return e === "excludes" || e === "excludesAll";
}
function ki(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
const us = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function Ce(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function Ci(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function Fe(e) {
  return Ci(De(e));
}
function Nl(e) {
  return De(e) === "video";
}
function De(e) {
  return e.entityType ?? "video";
}
const Vn = [
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
  Vn.slice(0, 11),
  Vn.slice(11, 22),
  Vn.slice(22)
], Jn = "none";
function cr(e) {
  return typeof e == "string" && Vn.includes(e);
}
function Ai(e) {
  const t = e.shortcut;
  return cr(t) || t === Jn ? t : "auto";
}
function fs(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), i = [];
  e.forEach((s, l) => {
    const d = Ai(s);
    if (d !== Jn) {
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
  const o = Vn.filter((s) => !n.has(s));
  return i.forEach((s, l) => {
    const d = o[l];
    d !== void 0 && (t[s] = d, n.set(d, s));
  }), { keys: t, actionOn: n, duplicatePins: a };
}
function ql(e, t, n) {
  const { keys: a, actionOn: i } = fs(e), o = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (cr(n)) {
    const l = i.get(n), d = a[t];
    l !== void 0 && l !== t && o.set(l, d && e[t].shortcut === d ? d : void 0);
  }
  const s = new Set([...o.values()].filter(cr));
  return e.map((l, d) => {
    const h = o.has(d) ? o.get(d) : cr(l.shortcut) && s.has(l.shortcut) ? void 0 : l.shortcut;
    if (h === l.shortcut) return l;
    const { shortcut: u, ...g } = l;
    return h === void 0 ? g : { ...g, shortcut: h };
  });
}
function Vr(e) {
  return Ce(e) && !ps(e.occurrence) ? "Complete the optional occurrence condition before saving." : !Nl(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : De(e) !== "tag" && e.actions.some(
    (t) => Ti(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => Rn(t, De(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const Sl = {
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
      Math.min(Sl[t], n(e.perPage, 40))
    )
  };
}
function uo(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function Bn(e) {
  const { page: t, ...n } = e.view.filter, a = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    Ce(e) ? [e.entityType, ...a, e.occurrence] : De(e) === "video" ? a : [De(e), ...a]
  );
}
function Rn(e, t) {
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
  ) && !Ti(e) : !1;
}
function El(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function An(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function Tr(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function Xa(e) {
  return "steps" in e && e.steps.length > 0;
}
function zn(e) {
  return "steps" in e ? e.steps.some((t) => An(t.mode)) : !1;
}
function Ti(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (An(n.mode))
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
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || us.includes(n.entityType)) && (!El(n.entityType) || ps(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && kl(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (a) => typeof a == "string"
    )) && // Answer groups belong to actions that write tags; tag reviews have neither.
    (n.stayUntilGroupsAnswered === void 0 || typeof n.stayUntilGroupsAnswered == "boolean" && n.entityType !== "tag") && Array.isArray(n.actions) && n.actions.every(
      (a) => typeof (a == null ? void 0 : a.id) == "string" && typeof a.label == "string" && (a.shortcut === void 0 || typeof a.shortcut == "string") && (n.entityType === "tag" ? "effect" in a && !("steps" in a) && !("group" in a) && Rn(a, "tag") : "steps" in a && !("effect" in a) && Array.isArray(a.steps) && a.steps.every(
        (i) => i && Array.isArray(i.tagIds)
      ) && (a.group === void 0 || typeof a.group == "string") && Rn(a, "video"))
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
function kl(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= 115 && n.cardSize <= 380) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (a) => ["date", "studio", "performers", "tags"].includes(a)
  )) && [n.annotationParents, n.binParents].every(
    (a) => a === void 0 || Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0)
  );
}
function Za(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const a of e)
    for (const i of a)
      n.has(i.id) || (n.add(i.id), t.push(i));
  return t;
}
function Cl(e, t) {
  const n = new Set(t.map((i) => i.name.trim().toLocaleLowerCase())), a = `${e.trim().replace(/ copy(?: \d+)?$/i, "")} copy`;
  for (let i = 1; ; i++) {
    const o = i === 1 ? a : `${a} ${i}`;
    if (!n.has(o.toLocaleLowerCase())) return o;
  }
}
function Al(e, t, n) {
  return { ...structuredClone(e), id: n, name: Cl(e.name, t) };
}
function ps(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (a) => Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0) && new Set(a).size === a.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && Ei.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function fo(e, t) {
  return e.size > 0 ? [...e].sort((n, a) => n - a) : t == null ? [] : [t];
}
function po(e, t, n, a) {
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
function Tl(e, t) {
  const n = new Set(e), a = t.length > 0 && t.every((i) => n.has(i));
  for (const i of t)
    a ? n.delete(i) : n.add(i);
  return n;
}
function Rl(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function $l(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function Ol(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function Il(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function Ml(e, t) {
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
const hs = "ext:com.midnightrider.data-quality:configuration", Fl = "ext:cove-data-quality:video-reviews", ei = "ext:com.midnightrider.data-quality:progress";
class ms extends Error {
}
const Yr = /* @__PURE__ */ new Map(), da = /* @__PURE__ */ new Map(), or = (e, t) => e.includes("*") || e.includes(t), ya = (e) => ce(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Pl = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function ti(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function qr(e) {
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
    deletedIds: ti(t.deletedIds),
    importedIds: ti(t.importedIds)
  };
}
function xl(e) {
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
      n ?? (n = s), s.forEach((l) => a.add(l.id));
    }
    ti(
      JSON.parse(localStorage.getItem(`${i}:account-imports`) ?? "[]")
    ).forEach((s) => a.add(s));
  }
  return {
    reviews: n ?? [],
    known: [...a],
    present: n !== void 0
  };
}
async function gs(e) {
  const t = await ce("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function bs(e, t) {
  const n = (da.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return da.set(e, n), n.finally(() => {
    da.get(e) === n && da.delete(e);
  }).catch(() => {
  }), n;
}
let Lr = null;
function Ll() {
  if (Lr) return Lr;
  const e = Dl();
  return Lr = e, e.finally(() => {
    Lr === e && (Lr = null);
  }).catch(() => {
  }), e;
}
async function Dl() {
  var m;
  const e = await ce("/api/auth/me"), t = String(e.user.id), n = `cove-data-quality-v2:${t}`, a = or(e.permissions, "savedfilters.read"), i = a && or(e.permissions, "savedfilters.write"), o = a ? (await ya(hs)).filter((N) => N.name === "Data Quality configuration").sort((N, y) => N.id - y.id) : [];
  if (o.length > 1) {
    const N = (y) => {
      const { revision: q, ...k } = qr(y.uiOptions);
      return JSON.stringify(k);
    };
    if (o.some((y) => N(y) !== N(o[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (i)
      for (const y of o.slice(1))
        await ce(`/api/savedfilters/${y.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${y.id}` })
        });
    o.splice(1);
  }
  let s = o.length ? qr(o[0].uiOptions) : Pl();
  const l = localStorage.getItem(`${n}:migrated`) === "true", d = localStorage.getItem(n), h = localStorage.getItem(`${n}:local-only`) === "true";
  !o.length && d && (s = qr(d));
  let u = !o.length;
  if (o.length && h && d) {
    const N = qr(d);
    if (N.reviews.some((q) => {
      const k = s.reviews.find((b) => b.id === q.id);
      return k && JSON.stringify(k) !== JSON.stringify(q);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const y = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...N.deletedIds])
    ];
    s = {
      ...s,
      reviews: Za(s.reviews, N.reviews).filter(
        (q) => !y.includes(q.id)
      ),
      deletedIds: y,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...N.importedIds])
      ]
    }, u = !0;
  }
  if (!l) {
    const N = JSON.stringify(s), y = xl(t);
    if (o.length && y.reviews.some((O) => {
      const F = s.reviews.find((G) => G.id === O.id);
      return F && JSON.stringify(F) !== JSON.stringify(O);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const q = a ? (await ya(Fl)).flatMap(
      (O) => Hr(O.uiOptions ?? "[]")
    ) : [], k = y.known.filter(
      (O) => !y.reviews.some((F) => F.id === O)
    ), b = /* @__PURE__ */ new Set([...s.deletedIds, ...k]);
    s = {
      ...s,
      reviews: Za(
        y.reviews,
        s.reviews,
        q.filter(
          (O) => !y.known.includes(O.id) && !s.importedIds.includes(O.id)
        )
      ).filter((O) => !b.has(O.id)),
      deletedIds: [...b],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...y.known,
          ...q.map((O) => O.id)
        ])
      ]
    }, u || (u = JSON.stringify(s) !== N);
  }
  const g = {
    userId: t,
    recordId: (m = o[0]) == null ? void 0 : m.id,
    config: s,
    readable: a,
    writable: i,
    durable: i
  };
  if (Yr.set(n, g), u && i) {
    const N = s;
    o.length && (g.config = qr(o[0].uiOptions)), await ws(n, N), s = g.config;
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
async function ws(e, t) {
  const n = Yr.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const a = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await gs(n), n.recordId != null) {
      const o = await ce(
        `/api/savedfilters/${n.recordId}`
      );
      if (qr(o.uiOptions).revision !== n.config.revision)
        throw new ms(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const i = await ce(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: hs,
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
function _l(e, t) {
  return Hr(JSON.stringify(t)), bs(e, async () => {
    const n = Yr.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const a = n.config.reviews.filter((i) => !t.some((o) => o.id === i.id)).map((i) => i.id);
    await ws(e, {
      ...n.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...n.config.deletedIds, ...a])
      ].filter((i) => !t.some((o) => o.id === i))
    });
  });
}
function ho(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, a]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(a)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function jl(e, t) {
  const n = Yr.get(e);
  if (!n) return null;
  const a = localStorage.getItem(`${e}:progress:${t}`), i = a ? ho(a) : null;
  if (!n.readable) return i;
  const o = (await ya(ei)).find(
    (l) => l.name === t
  ), s = o ? ho(o.uiOptions) : null;
  return i && (!s || i.updatedAt > s.updatedAt) ? i : s;
}
function Ul(e, t, n) {
  const a = `${e}:progress:${t}`;
  try {
    localStorage.setItem(a, JSON.stringify(n));
  } catch {
  }
  return bs(a, async () => {
    const i = Yr.get(e);
    if (!(i != null && i.writable)) return;
    await gs(i);
    const o = (await ya(ei)).find(
      (s) => s.name === t
    );
    await ce(
      o ? `/api/savedfilters/${o.id}` : "/api/savedfilters",
      {
        method: o ? "PUT" : "POST",
        body: JSON.stringify({
          mode: ei,
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
const Gl = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function bn(e) {
  return Gl[e];
}
const va = "confirmed_absent_tags", Ri = "Confirmed absent tags", Aa = "confirmed_absent_occurrence_tags", ys = {
  key: va,
  label: Ri,
  type: "tag",
  subject: "tag assessments"
}, $i = {
  key: Aa,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, Kl = {
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
      t === "modifier" && typeof n == "string" ? Kl[n] ?? n : t === "key" && typeof n == "string" && [
        va,
        Aa
      ].includes(n.toLowerCase()) ? n.toLowerCase() : $n(n)
    ])
  ) : e;
}
async function vs(e, t, n) {
  const a = new Headers(t.headers);
  !(t.body instanceof FormData) && !a.has("Content-Type") && a.set("Content-Type", "application/json");
  const i = await vl(e, { ...t, headers: a });
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
async function ce(e, t = {}) {
  return await vs(e, t, "fail");
}
function Bl(e, t = {}) {
  return vs(e, t, "null");
}
const Vl = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Jl = 0;
function ni(e, t) {
  return ce(
    `/api/${Qn(e)}/${t}?dqRead=${Vl}-${++Jl}`,
    { cache: "no-store" }
  );
}
function Ns(e, t) {
  const n = { ...e.view.objectFilter }, a = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    $n({
      findFilter: Lt(t, Fe(e)),
      objectFilter: n,
      filterExpression: a
    })
  );
}
async function jr(e, t, n) {
  return ce(
    `/api/${Qn(Fe(e))}/find`,
    { method: "POST", signal: n, body: Ns(e, t) }
  );
}
async function zl(e, t, n) {
  return (await ce(
    `/api/${Qn(Fe(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: Ns(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function mo(e, t, n) {
  const a = { ...e.view.objectFilter };
  return delete a._filterExpression, ce("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      $n({
        findFilter: Lt(t),
        objectFilter: a
      })
    )
  });
}
function Ql(e) {
  return ce("/api/taggroups", { signal: e });
}
function ri(e, t, n = 1280) {
  return `/api/${Qn(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function ai(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function go(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Wl(e) {
  return `/api/stream/video/${e}/preview`;
}
function Hl(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Yl(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Ta(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e) {
    await ce(`/api/tags/${a}`, { signal: t }), n.add(a);
    for (let i = 1; ; i++) {
      const o = await ce("/api/tags/find", {
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
async function Oi(e, t) {
  const n = Tr(e);
  return (await Promise.all(
    e.steps.map(
      async (i) => i.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await Ta(i.tagIds, t)).filter(
          (o) => !n.has(o)
        )
      } : i
    )
  )).filter((i) => i.tagIds.length > 0);
}
function Xl(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function Ii(e, t) {
  const a = (await ce("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === e.key
  );
  if (!a)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const i = Xl(e, a);
  return i ? { kind: "incompatible", message: i } : a.entityTypes.includes(t) ? { kind: "ready", definition: a, message: "" } : {
    kind: "missing",
    message: `Add ${bn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: a
  };
}
async function qs(e, t) {
  const n = await Ii(e, t);
  if (n.kind !== "ready") {
    if (n.kind === "incompatible") throw new Error(n.message);
    if (n.definition) {
      await ce(`/api/custom-fields/${n.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...n.definition.entityTypes, t])]
        })
      });
      return;
    }
    await ce("/api/custom-fields", {
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
function Ss(e = "video") {
  return Ii(ys, e);
}
function Zl(e = "video") {
  return qs(ys, e);
}
function Es(e = "video") {
  return Ii($i, e);
}
function ed(e = "video") {
  return qs($i, e);
}
function Na(e) {
  return [...new Set(e)];
}
function ks(e, t) {
  const n = e.customFields ?? {}, a = Object.keys(n).find(
    (o) => o.toLowerCase() === Aa
  ), i = a === void 0 ? [] : n[a];
  return Na(
    (Array.isArray(i) ? i : []).filter(
      (o) => typeof o == "string" && /^[1-9]\d*:[1-9]\d*$/.test(o)
    ).map((o) => o.split(":").map(Number)).filter(([o]) => o === t).map(([, o]) => o)
  );
}
async function td(e) {
  let t;
  try {
    t = await Es(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${$i.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function nd(e, t, n, a, i, o) {
  await ce(`/api/${Qn(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: Na(i).map((s) => `${a}:${s}`)
      },
      customFieldMode: o
    })
  });
}
function rd(e, t, n) {
  const a = [...e.tagIds], i = (o) => {
    if (n === null)
      throw new Error(
        `The ${Ri} custom field is not available.`
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
async function Cs(e, t, n) {
  if (!Rn(t) || n.length === 0 || n.some((d) => !Number.isSafeInteger(d) || d <= 0))
    throw new Error(
      `Choose ${bn(e).many} and configure a valid action first.`
    );
  let a = null;
  if (zn(t)) {
    let d;
    try {
      d = await Ss(e);
    } catch (h) {
      throw new Error(
        `Could not verify the ${Ri} custom field. ${h instanceof Error ? h.message : "Request failed."}`
      );
    }
    if (d.kind !== "ready") throw new Error(d.message);
    a = d.definition.key;
  }
  const i = Na(n), o = (await Oi(t)).map((d) => ({
    mode: d.mode,
    tagIds: Na(d.tagIds)
  })), l = [
    ...o.filter((d) => !An(d.mode)),
    ...o.filter((d) => An(d.mode))
  ].map(
    (d) => rd(d, i, a)
  );
  for (let d = 0; d < l.length; d++)
    try {
      await ce(`/api/${Qn(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(l[d])
      });
    } catch (h) {
      throw new Error(
        `Step ${d + 1} failed; ${d} earlier step(s) completed. Refresh and check the selected ${bn(e).many} before retrying. ${h instanceof Error ? h.message : "Request failed."}`
      );
    }
}
async function ad(e, t) {
  if (!Rn(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await ce("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const ua = (e) => e >= "0" && e <= "9";
function bo(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function wo(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let n = 0, a = 0;
  for (; n < e.length && a < t.length; ) {
    if (ua(e[n]) && ua(t[a])) {
      const l = n, d = a;
      for (; n < e.length && ua(e[n]); ) n++;
      for (; a < t.length && ua(t[a]); ) a++;
      const h = e.slice(l, n).replace(/^0+/, ""), u = t.slice(d, a).replace(/^0+/, "");
      if (h.length !== u.length) return h.length < u.length ? -1 : 1;
      if (h !== u) return h < u ? -1 : 1;
      continue;
    }
    const o = bo(e[n]), s = bo(t[a]);
    if (o !== s) return o < s ? -1 : 1;
    n++, a++;
  }
  const i = e.length - n - (t.length - a);
  return i !== 0 ? i < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function As(e, t) {
  const n = (i) => i.tagGroupId != null ? 0 : 1, a = (i) => i.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(a(e) - a(t)) || wo(e.tagGroupName, t.tagGroupName) || wo(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function lr(e) {
  return [...e].sort(As);
}
function id(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const a of n.steps)
        a.mode === "REMOVE_TREE" && a.tagIds.forEach((i) => t.add(i));
  return [...t];
}
function Mi(e, t, n) {
  const a = Tr(e), i = [], o = [];
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
    ...o.filter((m) => !An(m.mode)),
    ...o.filter((m) => An(m.mode))
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
  const h = new Set(t.ids), u = new Set(t.absent), g = [...new Set(e.steps.flatMap((m) => m.tagIds))];
  return {
    added: g.filter((m) => l.has(m) && !h.has(m)),
    removed: [...h].filter((m) => !l.has(m)),
    markedAbsent: g.filter((m) => d.has(m) && !u.has(m)),
    absenceCleared: [...u].filter((m) => !d.has(m)),
    unresolvedTrees: [...new Set(i)]
  };
}
function od(e) {
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
function Ts(e) {
  const t = id(e).sort((s, l) => s - l).join(","), [n, a] = A(() => /* @__PURE__ */ new Map()), i = R(/* @__PURE__ */ new Set()), o = R(!0);
  return J(() => (o.current = !0, () => {
    o.current = !1;
  }), []), J(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const l of s)
      i.current.has(l) || (i.current.add(l), Ta([l]).then(
        (d) => {
          o.current && a((h) => new Map(h).set(l, d));
        },
        () => {
          i.current.delete(l);
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
function yo(e) {
  return e.stayUntilGroupsAnswered === !0 && e.actions.some((t) => ur(t.group) !== "");
}
function Rs(e) {
  return new Set(
    e.applications ? e.applications.map((t) => t.tag.id) : e.ids
  );
}
function $s(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "MARK_ABSENT").flatMap((t) => t.tagIds)
  );
}
function Os(e) {
  return Tr(e).size > 0 || $s(e).size > 0;
}
function sd(e) {
  return Xr(e).filter(
    (t) => !t.actions.some((n) => Os(e[n]))
  );
}
function ii(e, t) {
  const n = Rs(t), a = new Set(t.absent);
  return Xr(e).map((i) => {
    const o = [], s = [];
    for (const l of i.actions) {
      const d = [...Tr(e[l])], h = [...$s(e[l])], u = [
        ...d.map((g) => n.has(g)),
        ...h.map((g) => a.has(g))
      ];
      u.some(Boolean) && (s.push(l), u.every(Boolean) && o.push(l));
    }
    return { ...i, answers: o.length ? o : s };
  });
}
function oi(e) {
  return e.filter((t) => t.answers.length === 0);
}
function cd(e, t, n) {
  const a = { ids: [...Rs(t)], absent: t.absent }, i = Mi(e, a, n), o = new Set(i.removed), s = new Set(i.absenceCleared);
  return {
    ids: [...a.ids.filter((l) => !o.has(l)), ...i.added],
    absent: [...a.absent.filter((l) => !s.has(l)), ...i.markedAbsent]
  };
}
const si = "-", vo = "Ctrl+a", ld = "Ctrl/⌘A", dd = ["f", "g", "k"], Ka = "Shift+";
function Rr(e) {
  return ye(() => fs(e), [e]);
}
function Fi({
  surface: e,
  enabled: t,
  actions: n,
  onAction: a,
  onFind: i,
  onSelectAll: o
}) {
  const s = Rr(n), l = R({ keyMap: s, onAction: a, onFind: i, onSelectAll: o });
  ln(() => {
    l.current = { keyMap: s, onAction: a, onFind: i, onSelectAll: o };
  });
  const d = !!i && n.length > 0, h = e === "local" && !!o, u = Vn.filter(
    (m) => s.actionOn.has(m) || e === "local" && dd.includes(m)
  ).join(" "), g = ye(() => {
    const m = (q) => {
      var b, O;
      const k = l.current;
      if (q === vo) (b = k.onSelectAll) == null || b.call(k);
      else if (q === si) (O = k.onFind) == null || O.call(k);
      else {
        const F = q.startsWith(Ka), G = k.keyMap.actionOn.get(
          F ? q.slice(Ka.length) : q
        );
        G !== void 0 && k.onAction(G, F);
      }
    }, N = (q, k = e) => ({
      keys: q,
      surface: k,
      action: (b) => {
        b != null && b.repeat || m((b == null ? void 0 : b.sequence) ?? q);
      }
    }), y = [];
    h && y.push(N(vo, "local")), d && y.push(N(si));
    for (const q of u ? u.split(" ") : [])
      y.push(N(q), N(`${Ka}${q}`));
    return y;
  }, [e, u, d, h]);
  Wc(g, t);
}
const ud = {
  find: si,
  selectAll: ld
};
function Pi() {
  return ud;
}
const fd = 600 * 1e3, xi = /* @__PURE__ */ new Map(), Is = /* @__PURE__ */ new Map(), Kn = /* @__PURE__ */ new Map();
function Ms(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = Is.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function Fs(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && Is.set(e.tagGroupId, e.tagGroupSortOrder), xi.set(e.id, { tag: e, at: Date.now() });
}
function Ps(e) {
  const t = xi.get(e);
  if (!(!t || Date.now() - t.at > fd))
    return Ms(t.tag);
}
function xs(e) {
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
function ci(e) {
  var t;
  for (const n of e) {
    const a = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && a && Fs(xs({ ...n, name: a }));
  }
}
function pd(e) {
  const t = Kn.get(e);
  if (t) return t;
  const n = new AbortController(), a = {
    controller: n,
    waiters: 0,
    promise: ce(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (i) => {
        var u, g;
        const o = ((u = i == null ? void 0 : i.name) == null ? void 0 : u.trim()) || null;
        if (Kn.get(e) === a && Kn.delete(e), !o) return null;
        const s = xs({ ...i, id: e, name: o }), l = (g = xi.get(e)) == null ? void 0 : g.tag, d = (l == null ? void 0 : l.tagGroupId) === s.tagGroupId, h = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (d ? l == null ? void 0 : l.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (l == null ? void 0 : l.hasImage),
          imagePath: s.imagePath ?? (l == null ? void 0 : l.imagePath)
        };
        return Fs(h), Ms(h);
      },
      () => (Kn.get(e) === a && Kn.delete(e), null)
    )
  };
  return Kn.set(e, a), a;
}
function No() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function Ba(e) {
  const t = {};
  for (const n of e) {
    const a = Ps(n);
    a !== void 0 && (t[n] = a);
  }
  return t;
}
function hd(e, t) {
  if (t != null && t.aborted) return Promise.reject(No());
  const n = {}, a = [];
  for (const i of new Set(e)) {
    const o = Ps(i);
    if (o !== void 0) n[i] = o;
    else {
      const s = pd(i);
      s.waiters += 1, a.push({ id: i, entry: s });
    }
  }
  return a.length ? new Promise((i, o) => {
    let s = !1;
    const l = () => {
      for (const { id: h, entry: u } of a)
        u.waiters -= 1, u.waiters === 0 && Kn.get(h) === u && (Kn.delete(h), u.controller.abort());
    }, d = () => {
      s || (s = !0, l(), o(No()));
    };
    t == null || t.addEventListener("abort", d, { once: !0 }), Promise.all(
      a.map(
        ({ id: h, entry: u }) => u.promise.then((g) => [h, g])
      )
    ).then((h) => {
      if (!s) {
        s = !0, t == null || t.removeEventListener("abort", d), l();
        for (const [u, g] of h) n[u] = g;
        i(n);
      }
    });
  }) : Promise.resolve(n);
}
function Ls(e) {
  const t = {};
  for (const [n, a] of Object.entries(e)) t[Number(n)] = (a == null ? void 0 : a.name) ?? null;
  return t;
}
function Li(e) {
  const t = [...new Set(e)].sort((i, o) => i - o).join(","), [n, a] = A(() => ({
    key: t,
    tags: Ba(Va(t))
  }));
  return J(() => {
    const i = Va(t), o = Ba(i);
    if (a({ key: t, tags: o }), i.every((l) => l in o)) return;
    const s = new AbortController();
    return hd(i, s.signal).then(
      (l) => a({ key: t, tags: l }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : Ba(Va(t));
}
function $r(e) {
  const t = Li(e);
  return ye(() => Ls(t), [t]);
}
function Va(e) {
  return e ? e.split(",").map(Number) : [];
}
const md = "(max-width: 760px)";
function gd(e) {
  const [t] = A(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = mn(
    (a) => (t == null || t.addEventListener("change", a), () => t == null ? void 0 : t.removeEventListener("change", a)),
    [t]
  );
  return gi(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function Zr() {
  return gd(md);
}
function bd(e, t, n = !1) {
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
    const l = n.find((d) => d.id === s.tagGroupId);
    return [
      {
        text: l ? `Assign ${l.name}` : "Unavailable tag group",
        tone: "neutral"
      }
    ];
  }
  if (!e.steps.length) return [{ text: "Skip", tone: "neutral" }];
  const i = Tr(e), o = (s) => i.has(s) || [...i].some((l) => {
    var d;
    return (d = a == null ? void 0 : a.get(s)) == null ? void 0 : d.includes(l);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (l) => bd(
        s.mode,
        t[l] === void 0 ? "…" : t[l] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && o(l)
      )
    )
  );
}
function Ra(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function Di({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  canStay: i = !0,
  tapStays: o = !1,
  onApply: s,
  onClose: l
}) {
  const d = Zr(), [h, u] = A(""), [g, m] = A(0), N = R(null), y = R(null), q = R(null), k = R(null), b = R(null), O = R(/* @__PURE__ */ new Set()), F = vt(), G = $r(ye(() => Ra(e), [e])), K = Rr(e), j = ye(() => {
    const _ = h.trim().toLocaleLowerCase(), B = (v) => v ? Vn.indexOf(v) : Vn.length;
    return e.map((v, E) => ({ action: v, index: E, key: K.keys[E] })).sort((v, E) => B(v.key) - B(E.key)).filter((v) => !_ || v.action.label.toLocaleLowerCase().includes(_));
  }, [e, K, h]), X = j.length ? Math.min(g, j.length - 1) : -1, te = (_) => `${F}-option-${_}`;
  ln(() => {
    var _, B, v;
    return k.current = document.activeElement, b.current = ((B = (_ = q.current) == null ? void 0 : _.parentElement) == null ? void 0 : B.closest('[role="dialog"]')) ?? null, (v = N.current) == null || v.focus({ preventScroll: !0 }), () => {
      var L;
      const E = k.current;
      E instanceof HTMLElement && E.isConnected && E.focus({ preventScroll: !0 }), document.activeElement !== E && ((L = b.current) != null && L.isConnected) && b.current.focus({ preventScroll: !0 });
    };
  }, []), J(() => {
    var _, B, v;
    X < 0 || (v = (B = (_ = y.current) == null ? void 0 : _.querySelector(`[id="${te(j[X].index)}"]`)) == null ? void 0 : B.scrollIntoView) == null || v.call(B, { block: "nearest" });
  }, [X, j]);
  function ie(_, B) {
    !_ || a != null && a(_.action) || s(_.action, i && B);
  }
  function re(_) {
    var v;
    _.stopPropagation();
    const B = _.code || _.key;
    if (_.repeat && !O.current.has(B)) {
      _.preventDefault();
      return;
    }
    if (_.repeat || O.current.add(B), _.key === "Escape")
      _.preventDefault(), l();
    else if (_.key === "Enter")
      _.preventDefault(), _.repeat || ie(j[X], _.shiftKey);
    else if (_.key === "ArrowDown" || _.key === "ArrowUp") {
      if (_.preventDefault(), !j.length) return;
      const E = _.key === "ArrowDown" ? 1 : -1;
      m((X + E + j.length) % j.length);
    } else _.key === "Tab" && (_.preventDefault(), (v = N.current) == null || v.focus());
  }
  return /* @__PURE__ */ c(de, { children: [
    /* @__PURE__ */ r("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: l }),
    /* @__PURE__ */ c(
      "div",
      {
        ref: q,
        role: "dialog",
        "aria-label": "Find an action",
        className: `dq-find-action${d ? " dq-find-mobile" : ""}`,
        onKeyDown: re,
        onMouseDown: (_) => {
          _.target !== N.current && _.preventDefault();
        },
        children: [
          /* @__PURE__ */ c("label", { className: "dq-find-search", children: [
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
                "aria-activedescendant": X >= 0 ? te(j[X].index) : void 0,
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
          j.length ? /* @__PURE__ */ r(
            "ul",
            {
              ref: y,
              id: `${F}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: j.map((_, B) => /* @__PURE__ */ r("li", { role: "none", children: /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: te(_.index),
                  tabIndex: -1,
                  "aria-selected": B === X,
                  disabled: (a == null ? void 0 : a(_.action)) ?? !1,
                  onClick: (v) => ie(_, v.shiftKey || o && Xa(_.action)),
                  children: [
                    d ? null : _.key ? /* @__PURE__ */ r("kbd", { children: _.key }) : /* @__PURE__ */ r("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ r("span", { className: "dq-find-label", children: _.action.label }),
                    /* @__PURE__ */ r("span", { className: "dq-find-effect", children: hr(_.action, G, t, n).map(
                      (v, E) => /* @__PURE__ */ r("span", { "data-effect-tone": v.tone, children: v.text }, E)
                    ) })
                  ]
                }
              ) }, _.action.id))
            }
          ) : /* @__PURE__ */ c("p", { className: "dq-find-empty", role: "status", children: [
            "No action matches “",
            h.trim(),
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
function Ds() {
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
function _i(e) {
  return gi(e.subscribe, e.get, e.get);
}
function _s(e, t) {
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
const qo = Br.map((e, t) => ({
  indent: t,
  keys: e,
  fixed: t === 2 ? ["n", "m", ",", "."] : []
}));
function wd(e, t) {
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
function fa(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function js(e) {
  return Br.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
    (t) => t.length > 0
  );
}
function Us({
  groups: e,
  renderAction: t,
  find: n
}) {
  const a = e.length ? e : [[]];
  return /* @__PURE__ */ r(de, { children: a.map((i, o) => /* @__PURE__ */ c("div", { className: "dq-mobile-group", children: [
    i.map(t),
    o === a.length - 1 && n
  ] }, o)) });
}
function Gs({
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
          /* @__PURE__ */ r(zr, { "aria-hidden": "true" }),
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
function yd({
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
        const i = t ? a.answers : null, o = i ? i.length ? "answered" : "open" : "unknown";
        return /* @__PURE__ */ c("li", { className: "dq-group", "data-state": o, children: [
          /* @__PURE__ */ r("span", { className: "dq-group-name", children: a.name }),
          o === "answered" && /* @__PURE__ */ c(de, { children: [
            /* @__PURE__ */ r(ka, { "aria-hidden": "true" }),
            /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", answered:" }),
            " ",
            /* @__PURE__ */ r("span", { className: "dq-group-answer", children: i.map((s) => n[s].label).join(", ") })
          ] }),
          o === "open" && /* @__PURE__ */ c(de, { children: [
            /* @__PURE__ */ r("span", { className: "dq-group-ring", "aria-hidden": "true" }),
            /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", not answered yet" })
          ] })
        ] }, a.key);
      })
    }
  );
}
function vd({ checked: e, onChange: t }) {
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
function Nd({
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
  paused: u = !1,
  waitForGroups: g = !1,
  stayOnTap: m = !1,
  onStayOnTapChange: N
}) {
  const y = Pi(), q = Rr(e), k = Zr(), b = vt(), O = $r(
    ye(() => e.flatMap((E) => E.steps.flatMap((L) => L.tagIds)), [e])
  ), F = qo.filter((E) => E.keys.some((L) => q.actionOn.has(L))), G = F.includes(qo[2]), K = e.length - q.actionOn.size, j = ye(
    () => g && !u ? Xr(e) : [],
    [g, u, e]
  ), X = ye(
    () => j.length && i ? ii(e, i) : null,
    [j, e, i]
  ), te = new Map(
    oi(X ?? []).flatMap(
      (E) => E.actions.filter((L) => Os(e[L])).map((L) => [L, E.name])
    )
  ), ie = j.length > 0 && /* @__PURE__ */ r(yd, { groups: j, statuses: X, actions: e }), re = (E) => {
    const L = hr(e[E], O, [], o).map((W) => W.text).join(", "), D = te.get(E);
    return D === void 0 ? L : `${L}. ${D}: not answered yet`;
  }, _ = (E) => ({
    onMouseEnter: () => s.set(E),
    onMouseLeave: () => s.clear(E),
    onFocus: () => s.set(E),
    onBlur: (L) => {
      L.currentTarget.contains(L.relatedTarget) || s.clear(E);
    }
  }), B = (E) => {
    const L = q.actionOn.get(E), D = L === void 0 ? void 0 : e[L];
    if (!D)
      return /* @__PURE__ */ r(
        "div",
        {
          className: "dq-pad-slot dq-pad-free",
          "aria-hidden": "true",
          title: "No action on this key: it does nothing here",
          children: /* @__PURE__ */ r(at, { binding: E })
        },
        E
      );
    const W = n(D), Z = `${b}-effect-${E}`;
    return /* @__PURE__ */ c("div", { className: "dq-pad-slot", ...u ? {} : _(D), children: [
      /* @__PURE__ */ r("span", { id: Z, className: "dq-sr-only", children: re(L) }),
      /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: D.label,
          "aria-keyshortcuts": E,
          "aria-describedby": Z,
          "data-group-open": te.has(L) || void 0,
          disabled: W,
          onClick: (V) => l(D, V.shiftKey),
          children: [
            /* @__PURE__ */ r(at, { binding: E }),
            " ",
            /* @__PURE__ */ r("span", { className: "dq-pad-label", children: D.label }),
            fa(D) && " ",
            fa(D) && /* @__PURE__ */ c("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(ba, { "aria-hidden": "true" }),
              "absent"
            ] })
          ]
        }
      ),
      Xa(D) && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-pad-pin",
          "aria-label": `Apply and stay: ${D.label}`,
          title: "Apply and stay (Shift)",
          disabled: W,
          onClick: () => l(D, !0),
          children: /* @__PURE__ */ r(vi, { "aria-hidden": "true" })
        }
      )
    ] }, E);
  }, v = /* @__PURE__ */ c("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ r(Cr, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (k) {
    const E = js(q), L = (D) => {
      const W = e[D], Z = q.keys[D];
      return /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: W.label,
          "aria-keyshortcuts": Z,
          "aria-describedby": `${b}-effect-${Z}`,
          "data-group-open": te.has(D) || void 0,
          disabled: n(W),
          onClick: (V) => {
            s.clear(W), l(W, V.shiftKey || m && Xa(W));
          },
          ...u ? {} : _s(s, W),
          children: [
            /* @__PURE__ */ r("span", { className: "dq-mobile-label", children: W.label }),
            fa(W) && " ",
            fa(W) && /* @__PURE__ */ c("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(ba, { "aria-hidden": "true" }),
              "absent"
            ] })
          ]
        },
        Z
      );
    };
    return /* @__PURE__ */ c(
      "section",
      {
        className: `dq-pad dq-pad-mobile${u ? " dq-pad-paused" : ""}`,
        "aria-label": u ? "Actions, paused while editing" : "Actions",
        "aria-busy": a || void 0,
        children: [
          /* @__PURE__ */ c("div", { className: "dq-pad-header", children: [
            u ? v : /* @__PURE__ */ r(
              So,
              {
                actions: e,
                keyMap: q,
                names: O,
                tags: i,
                trees: o,
                preview: s,
                findKey: y.find,
                mobile: !0
              }
            ),
            N && /* @__PURE__ */ r(vd, { checked: m, onChange: N })
          ] }),
          ie,
          /* @__PURE__ */ r("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ r(
            Us,
            {
              groups: E,
              renderAction: L,
              find: /* @__PURE__ */ r(
                Gs,
                {
                  extra: K,
                  findKey: y.find,
                  disabled: h,
                  onFind: d
                }
              )
            }
          ) }),
          /* @__PURE__ */ r("div", { hidden: !0, children: E.flat().map((D) => /* @__PURE__ */ r("span", { id: `${b}-effect-${q.keys[D]}`, children: re(D) }, D)) })
        ]
      }
    );
  }
  return /* @__PURE__ */ c(
    "section",
    {
      className: `dq-pad${u ? " dq-pad-paused" : ""}`,
      "aria-label": u ? "Actions, paused while editing" : "Actions",
      "aria-busy": a || void 0,
      children: [
        /* @__PURE__ */ c("div", { className: "dq-pad-header", children: [
          u ? v : /* @__PURE__ */ c(de, { children: [
            /* @__PURE__ */ r(
              So,
              {
                actions: e,
                keyMap: q,
                names: O,
                tags: i,
                trees: o,
                preview: s,
                findKey: y.find
              }
            ),
            ie,
            /* @__PURE__ */ c("span", { className: "dq-pad-hint", children: [
              /* @__PURE__ */ r("kbd", { className: "dq-key", children: "Shift" }),
              /* @__PURE__ */ r("span", { children: "+ key applies and stays" })
            ] })
          ] }),
          !G && /* @__PURE__ */ c(
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
          )
        ] }),
        F.map((E) => /* @__PURE__ */ c("div", { className: "dq-pad-row", "data-indent": E.indent, children: [
          E.keys.map(B),
          E.fixed.map((L) => {
            const D = wd(L, t);
            return /* @__PURE__ */ c(
              "div",
              {
                className: `dq-pad-slot dq-pad-free dq-pad-fixed${D ? " dq-pad-reserved" : ""}`,
                "aria-hidden": "true",
                children: [
                  /* @__PURE__ */ r(at, { binding: L }),
                  D && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: D })
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
              "aria-label": K ? `Find action, ${K} more` : "Find action",
              "aria-keyshortcuts": y.find,
              disabled: h,
              onClick: d,
              children: [
                /* @__PURE__ */ r(at, { binding: y.find }),
                /* @__PURE__ */ c("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ r(zr, { "aria-hidden": "true" }),
                  K ? `${K} more` : "Find action"
                ] })
              ]
            }
          ) })
        ] }, E.indent))
      ]
    }
  );
}
function So({
  actions: e,
  keyMap: t,
  names: n,
  tags: a,
  trees: i,
  preview: o,
  findKey: s,
  mobile: l = !1
}) {
  const d = _i(o), h = d ? e.indexOf(d) : -1;
  if (!d || h < 0) {
    const N = t.actionOn.size;
    return /* @__PURE__ */ c("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      !l && N < e.length && /* @__PURE__ */ c(de, { children: [
        ` · ${N} on keys, ${e.length - N} more under `,
        /* @__PURE__ */ r(at, { binding: s })
      ] })
    ] });
  }
  const u = t.keys[h], g = a && d.steps.length ? Mi(d, a, i) : null, m = g && !g.unresolvedTrees.length && ![g.added, g.removed, g.markedAbsent, g.absenceCleared].some(
    (N) => N.length
  );
  return /* @__PURE__ */ c("p", { className: "dq-pad-effect", children: [
    u && !l && /* @__PURE__ */ r(at, { binding: u }),
    /* @__PURE__ */ r("strong", { children: d.label }),
    hr(d, n, [], i).map((N, y) => /* @__PURE__ */ r("span", { "data-effect-tone": N.tone, children: N.text }, y)),
    m && /* @__PURE__ */ r("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function Ks({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  busy: i,
  onApply: o,
  onFind: s,
  summary: l,
  hints: d,
  keyHints: h,
  notices: u,
  status: g,
  className: m = "",
  paused: N = !1
}) {
  const y = Pi(), q = Rr(e), k = Zr(), b = vt(), O = $r(ye(() => Ra(e), [e])), [F] = A(() => Ds()), G = R(null), K = qd(G, e, !k), j = js(q);
  !j.length && e.length && j.push([]);
  const X = j.flat(), te = e.length - X.length, ie = (v) => hr(v, O, t, n).map((E) => E.text).join(", "), re = (v) => ({
    onMouseEnter: () => F.set(v),
    onMouseLeave: () => F.clear(v),
    onFocus: () => F.set(v),
    onBlur: (E) => {
      E.currentTarget.contains(E.relatedTarget) || F.clear(v);
    }
  }), _ = d ?? (k ? void 0 : h), B = (v) => {
    const E = e[v];
    return /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-mobile-tile",
        title: E.label,
        "aria-keyshortcuts": q.keys[v] || void 0,
        "aria-describedby": `${b}-effect-${v}`,
        disabled: N || a(E),
        onClick: () => {
          F.clear(E), o(E);
        },
        ...N ? {} : _s(F, E),
        children: /* @__PURE__ */ r("span", { className: "dq-mobile-label", children: E.label })
      },
      E.id
    );
  };
  return /* @__PURE__ */ c(
    "section",
    {
      ref: G,
      className: `dq-action-bar${k ? " dq-bar-mobile" : K ? " dq-bar-stacked" : ""}${i ? " dq-bar-busy" : ""}${N ? " dq-bar-paused" : ""}${m ? ` ${m}` : ""}`,
      "aria-label": "Actions",
      children: [
        /* @__PURE__ */ r("div", { className: "dq-bar-summary", children: l }),
        /* @__PURE__ */ r("span", { className: "dq-bar-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ c(
          "div",
          {
            className: `dq-bar-tiles${k ? " dq-mobile-actions" : ""}`,
            "aria-busy": i || void 0,
            children: [
              k && e.length > 0 && /* @__PURE__ */ r(
                Us,
                {
                  groups: j,
                  renderAction: B,
                  find: /* @__PURE__ */ r(
                    Gs,
                    {
                      extra: te,
                      findKey: y.find,
                      disabled: N,
                      onFind: s
                    }
                  )
                }
              ),
              !k && j.map((v, E) => /* @__PURE__ */ c("div", { className: "dq-bar-line", children: [
                v.map((L) => {
                  const D = e[L], W = q.keys[L];
                  return /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: D.label,
                      "aria-keyshortcuts": W || void 0,
                      "aria-describedby": `${b}-effect-${L}`,
                      disabled: N || a(D),
                      onClick: () => o(D),
                      ...N ? {} : re(D),
                      children: [
                        W && /* @__PURE__ */ r(at, { binding: W }),
                        " ",
                        /* @__PURE__ */ r("span", { className: "dq-bar-label", children: D.label })
                      ]
                    },
                    D.id
                  );
                }),
                E === j.length - 1 && /* @__PURE__ */ c(
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
              ] }, E)),
              !e.length && /* @__PURE__ */ r("p", { className: "dq-bar-empty", children: "This review has no actions." })
            ]
          }
        ),
        _ && /* @__PURE__ */ r("p", { className: "dq-bar-hints", children: _ }),
        N ? /* @__PURE__ */ c("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ r(Cr, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ r(
          Sd,
          {
            actions: e,
            keyMap: q,
            preview: F,
            names: O,
            tagGroups: t,
            trees: n,
            showKey: !k
          }
        ),
        u && /* @__PURE__ */ r("div", { className: "dq-bar-notices", children: u }),
        /* @__PURE__ */ r("div", { hidden: !0, children: X.map((v) => /* @__PURE__ */ r("span", { id: `${b}-effect-${v}`, children: ie(e[v]) }, e[v].id)) }),
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: g })
      ]
    }
  );
}
function qd(e, t, n) {
  const [a, i] = A(!1);
  return ln(() => {
    var u;
    const o = e.current;
    if (!o || !n || typeof ResizeObserver > "u") return;
    const s = o.querySelector(".dq-bar-summary"), l = () => {
      const g = getComputedStyle(o), m = parseFloat(g.columnGap) || 0, N = o.clientWidth - (parseFloat(g.paddingLeft) || 0) - (parseFloat(g.paddingRight) || 0), y = [...o.querySelectorAll(".dq-bar-line")].map(
        (X) => [...X.children].map((te) => te.offsetWidth)
      ), q = o.querySelector(".dq-bar-line"), k = q && parseFloat(getComputedStyle(q).columnGap) || 0, b = o.querySelector(".dq-bar-hints"), O = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (b ? b.offsetWidth + m : 0) + 1 + // the divider
      2 * m, F = (X) => y.map((te) => {
        let ie = 1, re = 0;
        for (const _ of te)
          re > 0 && re + k + _ > X ? (ie += 1, re = _) : re += (re > 0 ? k : 0) + _;
        return ie;
      }), G = (X) => Math.max(1, X.reduce((te, ie) => te + ie, 0)), K = F(N), j = G(F(N - O));
      i(
        1 + G(K) < j || 1 + G(K) === j && K.every((X) => X === 1)
      );
    }, d = new ResizeObserver(l);
    d.observe(o);
    for (const g of o.querySelectorAll(".dq-bar-summary, .dq-bar-tiles, .dq-bar-hints"))
      d.observe(g);
    l();
    let h = !0;
    return (u = document.fonts) == null || u.ready.then(() => {
      h && l();
    }), () => {
      h = !1, d.disconnect();
    };
  }, [e, t, n]), a;
}
function Sd({
  actions: e,
  keyMap: t,
  preview: n,
  names: a,
  tagGroups: i,
  trees: o,
  showKey: s
}) {
  const l = _i(n), d = l ? e.indexOf(l) : -1;
  if (!l || d < 0) return null;
  const h = t.keys[d];
  return /* @__PURE__ */ c("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    h && s && /* @__PURE__ */ r(at, { binding: h }),
    /* @__PURE__ */ r("strong", { children: l.label }),
    hr(l, a, i, o).map((u, g) => /* @__PURE__ */ r("span", { "data-effect-tone": u.tone, children: u.text }, g))
  ] });
}
const Eo = 1e3;
async function Ed(e, t, n) {
  const a = await ce(
    `/api/tags/${t}`,
    { signal: n }
  ), i = /* @__PURE__ */ new Map();
  for (let d = 1; ; d++) {
    const h = await ce(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          $n({
            findFilter: {
              page: d,
              perPage: Eo,
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
    if (d * Eo >= h.totalCount) break;
    if (!h.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const o = [...i.values()], s = Fe(e), l = Ce(e) ? await Cd(
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
function kd(e) {
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
async function Cd(e, t, n) {
  const a = new Array(t.length).fill(0), i = new AbortController(), o = () => i.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && o(), n == null || n.addEventListener("abort", o, { once: !0 });
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; s < t.length && !i.signal.aborted; ) {
            const l = s++;
            a[l] = (await ce(
              `/api/${Qn(e)}/aggregate`,
              {
                method: "POST",
                signal: i.signal,
                body: kd(t[l])
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
function Ad(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((a) => t.has(a.id) ? !1 : (t.add(a.id), !0))
  }));
}
function Td(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of n.children)
      t.set(a.id, [...t.get(a.id) ?? [], n.parent.id]);
  return t;
}
function Rd(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of Tr(n))
      t.set(a, [...t.get(a) ?? [], n]);
  return t;
}
function $d(e, t, n) {
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
function Od(e, t) {
  var a;
  const n = ur(e);
  return ((a = Xr(t).find((i) => i.key === n)) == null ? void 0 : a.name) ?? e.trim();
}
const Id = (e) => e instanceof Error ? e.message : "Request failed.";
function Md({
  id: e,
  review: t,
  disabled: n,
  onAdd: a,
  onCancel: i
}) {
  const [o, s] = A([]), [l, d] = A({}), [h, u] = A({}), [g, m] = A({}), N = R(/* @__PURE__ */ new Map());
  J(
    () => () => {
      for (const v of N.current.values()) v.abort();
    },
    []
  );
  const y = bn(Fe(t)), q = Ce(t), k = q ? "performer" : y.one;
  function b(v) {
    var L;
    (L = N.current.get(v)) == null || L.abort();
    const E = new AbortController();
    N.current.set(v, E), d((D) => ({ ...D, [v]: { status: "loading" } })), Ed(t, v, E.signal).then(
      (D) => {
        E.signal.aborted || d((W) => ({
          ...W,
          [v]: { status: "ready", group: D }
        }));
      },
      (D) => {
        E.signal.aborted || d((W) => ({
          ...W,
          [v]: { status: "failed", message: Id(D) }
        }));
      }
    );
  }
  function O(v) {
    var Z;
    const E = o.filter((V) => !v.includes(V));
    for (const V of E)
      (Z = N.current.get(V)) == null || Z.abort(), N.current.delete(V);
    const L = (V) => {
      const T = l[V];
      return (T == null ? void 0 : T.status) === "ready" ? T.group.children.map((Ge) => Ge.id) : [];
    }, D = new Set(v.flatMap(L)), W = E.flatMap(L).filter((V) => !D.has(V));
    u(
      (V) => Object.fromEntries(
        Object.entries(V).filter(([T]) => !W.includes(Number(T)))
      )
    ), m(
      (V) => Object.fromEntries(
        Object.entries(V).filter(([T]) => v.includes(Number(T)))
      )
    ), d(
      (V) => Object.fromEntries(
        Object.entries(V).filter(([T]) => v.includes(Number(T)))
      )
    ), s(v);
    for (const V of v) o.includes(V) || b(V);
  }
  const F = o.flatMap((v) => {
    const E = l[v];
    return (E == null ? void 0 : E.status) === "ready" ? [E.group] : [];
  }), G = F.length === o.length, K = o.some(
    (v) => {
      var E;
      return (((E = l[v]) == null ? void 0 : E.status) ?? "loading") === "loading";
    }
  ), j = new Map(
    Ad(F).map((v) => [v.parent.id, v])
  ), X = Td(F), te = new Map(F.map((v) => [v.parent.id, v.parent.name])), ie = Rd(t.actions), re = (v) => h[v] ?? !ie.has(v), _ = G ? [...j.values()].flatMap((v) => {
    const E = Od(v.parent.name, t.actions);
    return v.children.filter((L) => re(L.id)).map((L) => ({ child: L, answerGroup: E }));
  }) : [], B = (v, E) => u((L) => ({
    ...L,
    ...Object.fromEntries(v.children.map((D) => [D.id, E]))
  }));
  return /* @__PURE__ */ c("fieldset", { id: e, className: "dq-actions-from-tags", children: [
    /* @__PURE__ */ r("legend", { children: "Add actions from parent tags" }),
    /* @__PURE__ */ c("p", { className: "dq-drawer-note", children: [
      "Each ticked child tag becomes an action that adds it, most used",
      " ",
      q ? "on performers " : "",
      "first, in a group named after its parent. Tags an action already adds start unticked. The new actions go at the end, ready to reorder and edit."
    ] }),
    /* @__PURE__ */ r(
      Tn,
      {
        entityType: "tag",
        values: o,
        onChange: O,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    o.map((v) => {
      const E = l[v];
      if (!E || E.status === "loading")
        return /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Loading child tags…" }, v);
      if (E.status === "failed")
        return /* @__PURE__ */ c("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ c("span", { children: [
            "Child tags could not be loaded. ",
            E.message
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
      const L = j.get(v);
      if (!L) return null;
      const D = L.parent.name;
      return /* @__PURE__ */ c("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ r("legend", { children: D }),
        E.group.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ c(de, { children: [
          /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: g[v] ?? !1,
                disabled: n,
                onChange: (W) => m((Z) => ({
                  ...Z,
                  [v]: W.target.checked
                }))
              }
            ),
            "Only one per ",
            k,
            ": each action removes every other tag in the ",
            D,
            " tree"
          ] }),
          L.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ c(de, { children: [
            /* @__PURE__ */ c("div", { className: "dq-row", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${D}`,
                  onClick: () => B(L, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${D}`,
                  onClick: () => B(L, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ r("div", { className: "dq-child-tags", children: L.children.map((W) => {
              const Z = ie.get(W.id) ?? [], V = (X.get(W.id) ?? []).filter((T) => T !== v).map((T) => `“${te.get(T)}”`);
              return /* @__PURE__ */ c("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "checkbox",
                    checked: re(W.id),
                    disabled: n,
                    onChange: (T) => u((Ge) => ({
                      ...Ge,
                      [W.id]: T.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ c("span", { children: [
                  W.name,
                  " ",
                  /* @__PURE__ */ c("small", { children: [
                    W.uses.toLocaleString(),
                    " ",
                    W.uses === 1 ? y.one : y.many
                  ] }),
                  V.length > 0 && /* @__PURE__ */ c("small", { children: [
                    " · Also under ",
                    V.join(", ")
                  ] }),
                  Z.length > 0 && /* @__PURE__ */ c("small", { children: [
                    " ",
                    "· Already in “",
                    Z[0].label || "New action",
                    "”",
                    Z.length > 1 ? ` and ${Z.length - 1} more` : ""
                  ] })
                ] })
              ] }, W.id);
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
          disabled: n || !_.length,
          onClick: () => a(
            _.map(
              ({ child: v, answerGroup: E }) => $d(
                v,
                (X.get(v.id) ?? []).filter(
                  (L) => g[L]
                ),
                E
              )
            )
          ),
          children: _.length ? `Add ${_.length} action${_.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: i, children: "Cancel" }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-sr-only", children: K ? "Loading child tags…" : "" })
    ] })
  ] });
}
const Fd = ["n", "m"], Gn = [
  ...Br,
  ["auto", Jn]
];
function qa(e) {
  return e.toLocaleUpperCase();
}
function Bs(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : Ai(e[n]);
}
function Pd({
  actions: e,
  index: t,
  keyMap: n,
  name: a,
  onChoose: i
}) {
  const [o, s] = A(!1), l = R(null), d = n.keys[t], h = Bs(e, n, t), u = cr(h), g = n.duplicatePins.has(t) ? ` (${qa(e[t].shortcut ?? "")} is pinned twice)` : "", m = d ? `${qa(d)}, ${u ? "pinned" : "Auto"}${g}` : h === Jn ? "no key, Find action only" : `no key: Auto found no free key${g}`, N = () => {
    var y;
    s(!1), (y = l.current) == null || y.focus();
  };
  return /* @__PURE__ */ c(de, { children: [
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
          d ? /* @__PURE__ */ r(at, { binding: d }) : /* @__PURE__ */ r("span", { className: "dq-key dq-key-none", children: "·" }),
          u && /* @__PURE__ */ r(vi, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ r(
      xd,
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
function xd({
  actions: e,
  index: t,
  keyMap: n,
  name: a,
  onChoose: i,
  onClose: o
}) {
  const s = R(null), l = n.keys[t], d = Bs(e, n, t), [h, u] = A(l || "q"), g = (q) => {
    var k;
    return ((k = s.current) == null ? void 0 : k.querySelector(`[data-choice="${q}"]`)) ?? null;
  };
  ln(() => {
    var q, k, b;
    (q = g(l || d)) == null || q.focus(), (b = (k = s.current) == null ? void 0 : k.scrollIntoView) == null || b.call(k, { block: "nearest" });
  }, []);
  function m(q) {
    var k;
    cr(q) && u(q), (k = g(q)) == null || k.focus();
  }
  function N(q) {
    var j, X, te;
    if (q.key === "Escape") {
      q.preventDefault(), q.stopPropagation(), o();
      return;
    }
    if (q.key === "Tab") {
      const ie = [...((j = s.current) == null ? void 0 : j.querySelectorAll("button[tabindex='0']")) ?? []], re = ie.indexOf(document.activeElement);
      q.preventDefault(), (X = ie[(re + (q.shiftKey ? -1 : 1) + ie.length) % ie.length]) == null || X.focus();
      return;
    }
    const k = (te = q.target.dataset) == null ? void 0 : te.choice, b = k ? Gn.findIndex((ie) => ie.includes(k)) : -1;
    if (!k || b < 0) return;
    const O = Gn[b].indexOf(k), F = (ie) => ie == null ? void 0 : ie[Math.min(O, ie.length - 1)], G = {
      ArrowLeft: Gn[b][O - 1],
      ArrowRight: Gn[b][O + 1],
      ArrowUp: F(Gn[b - 1]),
      ArrowDown: F(Gn[b + 1]),
      Home: Gn[b][0],
      End: Gn[b].at(-1)
    };
    if (!Object.hasOwn(G, q.key)) return;
    q.preventDefault();
    const K = G[q.key];
    K && m(K);
  }
  const y = (q) => {
    const k = cr(q) ? n.actionOn.get(q) : void 0;
    return k === void 0 ? null : {
      own: k === t,
      label: e[k].label.trim() || "New action",
      pinned: Ai(e[k]) === q
    };
  };
  return /* @__PURE__ */ c(de, { children: [
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
          /* @__PURE__ */ r("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: Br.map((q, k) => /* @__PURE__ */ c("div", { className: "dq-key-picker-row", "data-indent": k, children: [
            q.map((b) => {
              const O = y(b), F = O ? `${O.own ? "this action" : O.label}, ${O.pinned ? "pinned" : "Auto"}` : "free";
              return /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: `dq-key-choice${O ? "" : " dq-key-choice-free"}${O != null && O.own ? " dq-key-choice-own" : ""}`,
                  "data-choice": b,
                  tabIndex: b === h ? 0 : -1,
                  "aria-label": `${qa(b)}: ${F}`,
                  "aria-pressed": !!(O != null && O.own && O.pinned),
                  title: O ? `${O.label} (${O.pinned ? "pinned" : "Auto"})` : void 0,
                  onFocus: () => u(b),
                  onClick: () => i(b),
                  children: [
                    /* @__PURE__ */ c("span", { className: "dq-key-choice-head", children: [
                      /* @__PURE__ */ r(at, { binding: b }),
                      (O == null ? void 0 : O.pinned) && /* @__PURE__ */ r(vi, { "aria-hidden": "true" })
                    ] }),
                    O && /* @__PURE__ */ r("span", { className: "dq-key-choice-label", children: O.label })
                  ]
                },
                b
              );
            }),
            k === Br.length - 1 && Fd.map((b) => /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-key-choice dq-key-choice-free",
                "aria-label": `${qa(b)}: not available, it steps through the grid preview`,
                title: "Steps through the grid preview",
                disabled: !0,
                children: /* @__PURE__ */ r("span", { className: "dq-key-choice-head", children: /* @__PURE__ */ r(at, { binding: b }) })
              },
              b
            ))
          ] }, k)) }),
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
                "data-choice": Jn,
                tabIndex: 0,
                "aria-pressed": d === Jn,
                onClick: () => i(Jn),
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
const Ld = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function Dd(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function _d(e, t) {
  if (Rn(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (Ti(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function Vs(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function jd(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function Ud({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: a,
  saving: i,
  expandedId: o,
  onExpand: s,
  reveal: l
}) {
  const d = De(e), h = d !== "tag", u = e.actions, g = Rr(u), m = $r(ye(() => Ra(u), [u])), N = ye(
    () => h ? Xr(u).map((U) => U.name) : [],
    [h, u]
  ), y = h && e.stayUntilGroupsAnswered === !0, q = ye(
    () => new Set(
      y ? sd(u).map((U) => U.key) : []
    ),
    [y, u]
  ), [k, b] = A(""), [O, F] = A(!1), [G, K] = A(
    null
  ), j = vt(), X = `${j}-from-tags`, te = R(null), ie = R(null), re = R(null), _ = R(null), B = R(/* @__PURE__ */ new WeakMap()), v = (U) => {
    let ve = B.current.get(U);
    return ve || (ve = crypto.randomUUID(), B.current.set(U, ve)), ve;
  }, E = k.trim().toLocaleLowerCase(), L = E ? u.filter((U) => U.label.toLocaleLowerCase().includes(E)) : u, D = (U) => t({ ...e, actions: U }), W = (U, ve) => D(u.map((Ke, qe) => qe === U ? ve : Ke));
  function Z(U) {
    var ve;
    return [...((ve = re.current) == null ? void 0 : ve.querySelectorAll("[data-action-id]")) ?? []].find(
      (Ke) => Ke.dataset.actionId === U
    );
  }
  function V(U, ve) {
    const Ke = Z(U), qe = Ke == null ? void 0 : Ke.querySelector(
      ve === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return qe == null || qe.focus(), !!qe;
  }
  ln(() => {
    var ve;
    const U = _.current;
    U && (_.current = null, (U === "add" || !V(U.id, U.part)) && ((ve = ie.current) == null || ve.focus()));
  }), J(() => {
    !l || !o || (L.some((U) => U.id === o) ? V(o, "label") : (b(""), _.current = { id: o, part: "label" }));
  }, [l]);
  function T() {
    const U = jd(d);
    b(""), D([...u, U]), s(U.id), _.current = { id: U.id, part: "label" };
  }
  function Ge(U) {
    const ve = u[U], { shortcut: Ke, ...qe } = structuredClone(ve), Qe = {
      ...qe,
      ...Ke === Jn ? { shortcut: Ke } : {},
      id: crypto.randomUUID(),
      label: `${ve.label} copy`
    };
    D([...u.slice(0, U + 1), Qe, ...u.slice(U + 1)]), s(Qe.id), _.current = { id: Qe.id, part: "label" };
  }
  function Ae(U) {
    const ve = u[U], Ke = L.indexOf(ve), qe = L[Ke + 1] ?? L[Ke - 1];
    D(u.filter((Qe, Te) => Te !== U)), o === ve.id && s(null), _.current = qe ? { id: qe.id, part: "toggle" } : "add";
  }
  function tt() {
    F(!1), requestAnimationFrame(() => {
      var U;
      return (U = te.current) == null ? void 0 : U.focus();
    });
  }
  return /* @__PURE__ */ c("div", { className: "dq-actions-editor", children: [
    /* @__PURE__ */ c("div", { className: "dq-actions-head", children: [
      /* @__PURE__ */ c("div", { className: "dq-actions-toolbar", children: [
        /* @__PURE__ */ c(
          "button",
          {
            ref: ie,
            type: "button",
            className: "dq-header-button",
            onClick: T,
            children: [
              /* @__PURE__ */ r(Ni, { "aria-hidden": "true" }),
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
            "aria-expanded": O,
            "aria-controls": O ? X : void 0,
            onClick: () => {
              K(null), F(!O);
            },
            children: "Add from parent tags…"
          }
        ),
        /* @__PURE__ */ c("label", { className: "dq-actions-filter", children: [
          /* @__PURE__ */ r(zr, { "aria-hidden": "true" }),
          /* @__PURE__ */ r(
            "input",
            {
              type: "search",
              "aria-label": "Find an action",
              placeholder: "Find an action…",
              autoComplete: "off",
              spellCheck: !1,
              value: k,
              onChange: (U) => b(U.target.value),
              onKeyDown: (U) => {
                U.key === "Escape" && k && (U.preventDefault(), U.stopPropagation(), b(""));
              }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-actions-hint", children: "Choose a key on its key cap; Auto takes the next free key in this order. Drag a handle, or press Alt + ↑ / ↓, to reorder." }),
      h && /* @__PURE__ */ c("div", { className: "dq-actions-groups", children: [
        /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: y,
              "aria-describedby": `${j}-groups-note`,
              onChange: (U) => t({
                ...e,
                stayUntilGroupsAnswered: U.target.checked ? !0 : void 0
              })
            }
          ),
          "Stay until every group is answered"
        ] }),
        /* @__PURE__ */ r("p", { className: "dq-actions-hint", id: `${j}-groups-note`, children: y && !N.length ? "No action has a group yet: give the actions of each question the same group." : "Single-item view: a plain action moves on once every group has an answer." })
      ] }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-actions-status", children: (G == null ? void 0 : G.actions) === u ? `Added ${G.count} action${G.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    h && O && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here.
    /* @__PURE__ */ r(
      "div",
      {
        onKeyDown: (U) => {
          U.key !== "Escape" || U.defaultPrevented || (U.preventDefault(), U.stopPropagation(), tt());
        },
        children: /* @__PURE__ */ r(
          Md,
          {
            id: X,
            review: e,
            disabled: i,
            onAdd: (U) => {
              const ve = [...u, ...U];
              D(ve), K({ actions: ve, count: U.length }), tt();
            },
            onCancel: tt
          }
        )
      }
    ),
    /* @__PURE__ */ r("div", { ref: re, children: L.length > 0 && /* @__PURE__ */ r(
      Qo,
      {
        items: L,
        getKey: (U) => U.id,
        disabled: i || !!E,
        className: "dq-action-list",
        onReorder: (U) => D(U),
        renderItem: (U, { dragHandleProps: ve, isOver: Ke }) => {
          const qe = u.indexOf(U), Qe = o === U.id;
          return /* @__PURE__ */ r(
            Gd,
            {
              action: U,
              entityType: d,
              keyButton: /* @__PURE__ */ r(
                Pd,
                {
                  actions: u,
                  index: qe,
                  keyMap: g,
                  name: U.label.trim() || "New action",
                  onChoose: (Te) => D(ql(u, qe, Te))
                }
              ),
              takenPin: g.duplicatePins.has(qe) ? U.shortcut : void 0,
              groupUnanswerable: "steps" in U && q.has(ur(U.group)),
              effect: hr(U, m, n, a),
              open: Qe,
              detailId: `${j}-detail-${U.id}`,
              dragHandleProps: ve,
              isOver: Ke,
              reorderDisabled: i || !!E,
              onToggle: () => s(Qe ? null : U.id),
              onDuplicate: () => Ge(qe),
              onDelete: () => Ae(qe),
              children: "steps" in U ? /* @__PURE__ */ r(
                Vd,
                {
                  action: U,
                  groupNames: N,
                  saving: i,
                  stepKey: v,
                  rememberStepKey: (Te, Be) => B.current.set(Te, v(Be)),
                  onChange: (Te) => W(qe, Te)
                }
              ) : /* @__PURE__ */ r(
                zd,
                {
                  action: U,
                  tagGroups: n,
                  onChange: (Te) => W(qe, Te)
                }
              )
            }
          );
        }
      }
    ) }),
    u.length ? !L.length && /* @__PURE__ */ c("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      k.trim(),
      "”."
    ] }) : /* @__PURE__ */ r("p", { className: "dq-actions-empty", children: h ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function Gd({
  action: e,
  entityType: t,
  keyButton: n,
  takenPin: a,
  groupUnanswerable: i = !1,
  effect: o,
  open: s,
  detailId: l,
  dragHandleProps: d,
  isOver: h,
  reorderDisabled: u,
  onToggle: g,
  onDuplicate: m,
  onDelete: N,
  children: y
}) {
  const q = e.label.trim() || "New action", k = _d(e, t), b = "steps" in e && ur(e.group) ? e.group.trim() : "";
  return /* @__PURE__ */ c(
    "div",
    {
      className: `dq-action-row${s ? " dq-action-row-open" : ""}${h ? " dq-drag-over" : ""}`,
      "data-action-id": e.id,
      children: [
        /* @__PURE__ */ c("div", { className: "dq-action-row-head", children: [
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              ...d,
              style: Vs(d.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${q}`,
              title: u ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: u,
              children: /* @__PURE__ */ r(Zo, { "aria-hidden": "true" })
            }
          ),
          n,
          /* @__PURE__ */ c("div", { className: "dq-action-row-summary", onClick: g, children: [
            /* @__PURE__ */ r("span", { className: "dq-action-row-label", title: q, children: q }),
            b && /* @__PURE__ */ c("span", { className: "dq-action-row-group", title: `Group: ${b}`, children: [
              /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Group: " }),
              b
            ] }),
            !s && /* @__PURE__ */ r("span", { className: "dq-action-row-effect", children: o.map((O, F) => /* @__PURE__ */ r("span", { "data-effect-tone": O.tone, children: O.text }, F)) }),
            k && /* @__PURE__ */ c("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ r(Cn, { "aria-hidden": "true" }),
              k
            ] }),
            a && /* @__PURE__ */ c(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${a.toLocaleUpperCase()} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ r(Cn, { "aria-hidden": "true" }),
                  `${a.toLocaleUpperCase()} is pinned twice`
                ]
              }
            ),
            i && /* @__PURE__ */ c(
              "span",
              {
                className: "dq-action-problem",
                title: "No action in this group adds a tag or marks one absent, so the group is never answered and items wait there until skipped.",
                children: [
                  /* @__PURE__ */ r(Cn, { "aria-hidden": "true" }),
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
              "aria-label": `Duplicate ${q}`,
              title: "Duplicate",
              onClick: m,
              children: /* @__PURE__ */ r(es, { "aria-hidden": "true" })
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
              children: /* @__PURE__ */ r(ts, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small dq-action-toggle",
              "aria-label": `${s ? "Collapse" : "Expand"} ${q}`,
              "aria-expanded": s,
              "aria-controls": s ? l : void 0,
              onClick: g,
              children: /* @__PURE__ */ r(ns, { "aria-hidden": "true" })
            }
          )
        ] }),
        s && /* @__PURE__ */ r("div", { id: l, className: "dq-action-detail", children: y })
      ]
    }
  );
}
function Js({
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
function Kd(e) {
  const { group: t, ...n } = e;
  return n;
}
function Bd({
  action: e,
  groupNames: t,
  onChange: n
}) {
  const a = vt(), i = ur(e.group), o = (s) => n(s ? { ...e, group: s } : Kd(e));
  return /* @__PURE__ */ c("label", { className: "dq-action-field", children: [
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
          const l = s.target.value.trim();
          l !== s.target.value && o(l);
        }
      }
    ),
    /* @__PURE__ */ r("datalist", { id: a, children: t.filter((s) => ur(s) !== i).map((s) => /* @__PURE__ */ r("option", { value: s }, s)) })
  ] });
}
function Vd({
  action: e,
  groupNames: t,
  saving: n,
  stepKey: a,
  rememberStepKey: i,
  onChange: o
}) {
  const s = vt(), l = R(null), d = R(null);
  ln(() => {
    var g, m;
    const u = d.current;
    u != null && (d.current = null, (m = (g = l.current) == null ? void 0 : g.querySelector(`[data-step-index="${u}"] input`)) == null || m.focus());
  });
  const h = (u) => o({ ...e, steps: u });
  return /* @__PURE__ */ c(de, { children: [
    /* @__PURE__ */ r(Js, { action: e, onChange: (u) => o({ ...e, label: u }) }),
    /* @__PURE__ */ r(Bd, { action: e, groupNames: t, onChange: o }),
    /* @__PURE__ */ c("div", { className: "dq-action-field dq-action-field-top", role: "group", "aria-labelledby": s, children: [
      /* @__PURE__ */ r("span", { className: "dq-action-field-name", id: s, children: "Steps" }),
      /* @__PURE__ */ c("div", { className: "dq-steps", ref: l, children: [
        e.steps.length > 0 ? /* @__PURE__ */ r(
          Qo,
          {
            items: e.steps,
            getKey: a,
            disabled: n,
            className: "dq-step-list",
            onReorder: h,
            renderItem: (u, { index: g, dragHandleProps: m, isOver: N }) => /* @__PURE__ */ r(
              Jd,
              {
                step: u,
                index: g,
                dragHandleProps: m,
                isOver: N,
                saving: n,
                onChange: (y) => {
                  i(y, u), h(e.steps.map((q, k) => k === g ? y : q));
                },
                onRemove: () => h(e.steps.filter((y, q) => q !== g))
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
              d.current = e.steps.length, h([...e.steps, { mode: "ADD", tagIds: [] }]);
            },
            children: [
              /* @__PURE__ */ r(Ni, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function Jd({
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
      "data-step-tone": Dd(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            ...n,
            style: Vs(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${l}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: i,
            children: [
              /* @__PURE__ */ r(Zo, { "aria-hidden": "true" }),
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
            children: Ld.map(({ mode: d, label: h }) => /* @__PURE__ */ r("option", { value: d, children: h }, d))
          }
        ),
        /* @__PURE__ */ r(
          Tn,
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
            children: /* @__PURE__ */ r(Qr, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function zd({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const a = e.effect, i = a.mode === "SET_TAG_GROUP" ? `group:${a.tagGroupId}` : a.mode, o = a.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === a.tagGroupId);
  return /* @__PURE__ */ c(de, { children: [
    /* @__PURE__ */ r(Js, { action: e, onChange: (s) => n({ ...e, label: s }) }),
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
function Qd({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, a = bn(Fe(e)).queue, i = (o) => t({ ...e, occurrence: { ...n, ...o } });
  return /* @__PURE__ */ c("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
    /* @__PURE__ */ c("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      a,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ r(
      Tn,
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
function Wd({
  review: e,
  onChange: t
}) {
  const n = bn(Fe(e)).many;
  return /* @__PURE__ */ c("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ r("legend", { children: "Performer flags" }),
    /* @__PURE__ */ c("p", { children: [
      "Flag performers whose profile has any of these tags in the performer list and batches, for example a tag noting that something changed during their career. Check a flagged performer’s earliest and latest ",
      n,
      " ",
      "before applying one batch to all of them."
    ] }),
    /* @__PURE__ */ r(
      Tn,
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
const zs = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, Qs = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, Hd = {
  video: Ca,
  audio: is,
  tag: as,
  performerOccurrence: rs,
  audioPerformerOccurrence: cl
};
function Ws({ entityType: e }) {
  const t = Hd[e];
  return /* @__PURE__ */ r(t, { role: "img", "aria-label": zs[e] });
}
const Yd = 2e6;
function Hs(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), a = document.createElement("a");
  a.href = n, a.download = t, a.click(), URL.revokeObjectURL(n);
}
function Xd(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function ji(e) {
  Hs([e], Xd(e));
}
async function Zd(e) {
  if (e.size > Yd) throw new Error("Review files must be smaller than 2 MB.");
  const t = await e.text();
  try {
    return Hr(t);
  } catch (n) {
    throw new Error(
      n instanceof SyntaxError ? "It is not a JSON file." : "It does not hold valid Data Quality reviews."
    );
  }
}
function kr(e) {
  const { page: t, ...n } = e.view.filter;
  return JSON.stringify(
    { ...e, view: { ...e.view, filter: n } },
    (a, i) => i && typeof i == "object" && !Array.isArray(i) ? Object.fromEntries(
      Object.keys(i).sort().map((o) => [o, i[o]])
    ) : i
  );
}
function Ys({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: a,
  nameRef: i,
  autoFocus: o = !1
}) {
  return /* @__PURE__ */ c(de, { children: [
    /* @__PURE__ */ c("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ r("span", { children: "Entity type" }),
      /* @__PURE__ */ r(
        "select",
        {
          className: "dq-select",
          "aria-label": "Entity type",
          value: De(e),
          disabled: n,
          onChange: (s) => a == null ? void 0 : a(s.target.value),
          children: us.map((s) => /* @__PURE__ */ r("option", { value: s, children: Qs[s] }, s))
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
function eu(e, t) {
  const n = De(e), a = ["Review"];
  return (n === "video" || n === "tag") && a.push("Appearance"), a.push("Actions"), t && a.push("Tag choices"), a;
}
function tu({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = R(null), a = R(null), i = vt(), o = vt();
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
function Xs({
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
  criteriaChanged: u = !1,
  notices: g,
  onSave: m,
  onCancel: N,
  drawerRef: y
}) {
  const [q, k] = A("Review"), [b] = A(
    () => Ce(e) && e.occurrence.tagIds.length > 0
  ), [O, F] = A(""), [G, K] = A(null), [j, X] = A(0), [te, ie] = A(!1), re = R(null), _ = R(null), B = R(null), v = eu(e, b), E = De(e), L = ye(() => kr(e), [e]);
  J(() => F(""), [L]), J(() => {
    var Ge, Ae;
    if (te) return;
    const V = re.current;
    if (re.current = null, !V) return;
    (Ae = V.isConnected && !!((Ge = B.current) != null && Ge.contains(V)) && !(V instanceof HTMLButtonElement && V.disabled) ? V : B.current) == null || Ae.focus({ preventScroll: !0 });
  }, [te]);
  function D() {
    if (!(s || te)) {
      if (!h) {
        N();
        return;
      }
      re.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, ie(!0);
    }
  }
  function W() {
    const V = { ...e, name: e.name.trim() }, T = Vr(V);
    if (!T) {
      F(""), m();
      return;
    }
    if (F(T), !V.name) {
      k("Review"), requestAnimationFrame(() => {
        var Ae;
        return (Ae = _.current) == null ? void 0 : Ae.focus();
      });
      return;
    }
    const Ge = e.actions.find(
      (Ae) => !Rn(Ae, E)
    );
    Ge && (k("Actions"), K(Ge.id), X((Ae) => Ae + 1));
  }
  const Z = O || d;
  return /* @__PURE__ */ c(de, { children: [
    /* @__PURE__ */ c(
      "aside",
      {
        ref: (V) => {
          B.current = V, y && (y.current = V);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (V) => {
          V.key !== "Escape" || V.defaultPrevented || s || (V.preventDefault(), V.stopPropagation(), D());
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
                onClick: D,
                children: /* @__PURE__ */ r(Qr, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ r(
            Hc,
            {
              tabs: v.map((V) => ({
                key: V,
                label: V,
                count: V === "Actions" ? e.actions.length : void 0
              })),
              activeTab: q,
              onTabChange: (V) => k(V)
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
                    Ys,
                    {
                      review: e,
                      onChange: t,
                      entityTypeLocked: !0,
                      nameRef: _,
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
                        onChange: (V) => a(V.target.value),
                        children: [
                          /* @__PURE__ */ r("option", { value: "end", children: "Start from the end" }),
                          /* @__PURE__ */ r("option", { value: "beginning", children: "Start from the beginning" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ r("small", { className: "dq-drawer-note", children: "From the end, the queue opens on its last page and works towards the first." })
                  ] }),
                  Ce(e) && /* @__PURE__ */ r(Wd, { review: e, onChange: t }),
                  /* @__PURE__ */ r("div", { children: /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => ji(e),
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
                children: /* @__PURE__ */ r(nu, { review: e, onChange: t })
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
                  Ud,
                  {
                    review: e,
                    onChange: t,
                    tagGroups: i,
                    trees: o,
                    saving: s,
                    expandedId: G,
                    onExpand: K,
                    reveal: j
                  }
                )
              }
            ),
            b && Ce(e) && /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: q !== "Tag choices",
                "aria-label": "Tag choices",
                children: /* @__PURE__ */ r(Qd, { review: e, onChange: t })
              }
            )
          ] }) }),
          (Z || g) && /* @__PURE__ */ c("div", { className: "dq-drawer-notices", children: [
            g,
            Z && /* @__PURE__ */ c("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ r(Cn, { "aria-hidden": "true" }),
              Z
            ] })
          ] }),
          /* @__PURE__ */ c("footer", { className: "dq-drawer-footer", children: [
            /* @__PURE__ */ r("p", { className: "dq-drawer-dirty", children: h ? u ? "Unsaved changes, including the queue's criteria" : "Unsaved changes" : "" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: s, onClick: D, children: "Cancel" }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-button primary",
                "aria-busy": s || void 0,
                "aria-disabled": s || void 0,
                disabled: !s && l,
                onClick: () => {
                  s || W();
                },
                children: "Save review"
              }
            )
          ] })
        ]
      }
    ),
    te && /* @__PURE__ */ r(
      tu,
      {
        onKeepEditing: () => ie(!1),
        onDiscard: () => {
          re.current = null, ie(!1), N();
        }
      }
    )
  ] });
}
function nu({
  review: e,
  onChange: t
}) {
  const n = vt(), a = e.view, i = (u) => t({ ...e, view: { ...a, ...u } }), o = /* @__PURE__ */ c("label", { className: "dq-checkbox dq-setting-indent", children: [
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
  if (De(e) === "tag")
    return /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-cards`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-cards`, children: "Cards" }),
      /* @__PURE__ */ r(
        ko,
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
  const s = e.presentation ?? {}, l = (u) => t({ ...e, presentation: { ...s, ...u } }), d = s.annotations ?? [], h = a.reviewMode ?? "single";
  return /* @__PURE__ */ c(de, { children: [
    /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ c("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ r(
          Co,
          {
            name: `${n}-layout-choice`,
            checked: h === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ r(ru, {}),
            onChoose: () => i({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ r(
          Co,
          {
            name: `${n}-layout-choice`,
            checked: h === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ r(au, {}),
            onChoose: () => i({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ r(
        ko,
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
      /* @__PURE__ */ c("div", { className: "dq-setting-row", role: "group", "aria-labelledby": `${n}-details`, children: [
        /* @__PURE__ */ r("span", { className: "dq-setting-name", id: `${n}-details`, children: "Card details" }),
        /* @__PURE__ */ r("div", { className: "dq-setting-options", children: [
          ["date", "Date"],
          ["studio", "Studio"],
          ["performers", "Performers"],
          ["tags", "Tags"]
        ].map(([u, g]) => /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: d.includes(u),
              onChange: (m) => l({
                annotations: m.target.checked ? [...d, u] : d.filter((N) => N !== u)
              })
            }
          ),
          g
        ] }, u)) })
      ] }),
      d.includes("tags") && /* @__PURE__ */ c("div", { className: "dq-setting-row dq-setting-row-top", children: [
        /* @__PURE__ */ r("span", { className: "dq-setting-name", children: "Tags on cards" }),
        /* @__PURE__ */ c("div", { className: "dq-setting-value", children: [
          /* @__PURE__ */ r(
            Tn,
            {
              entityType: "tag",
              values: s.annotationParents ?? [],
              onChange: (u) => l({ annotationParents: u }),
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
        Tn,
        {
          entityType: "tag",
          values: s.binParents ?? [],
          onChange: (u) => l({ binParents: u }),
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
function ko({
  label: e,
  value: t,
  options: n,
  onChange: a
}) {
  const i = vt();
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
function Co({
  name: e,
  checked: t,
  title: n,
  text: a,
  picture: i,
  onChoose: o
}) {
  const s = vt(), l = vt();
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
function ru() {
  return /* @__PURE__ */ c("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ r("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function au() {
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
function Zs({
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
  chipsStart: u,
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
          children: /* @__PURE__ */ r(Wr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-type", title: zs[n], children: /* @__PURE__ */ r(Ws, { entityType: n }) }),
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
          children: /* @__PURE__ */ r(Cr, { "aria-hidden": "true" })
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
function ec({
  page: e,
  pages: t,
  onPage: n
}) {
  const [a, i] = A(!1), [o, s] = A(""), l = R(null), d = R(null);
  J(() => {
    var g;
    a && ((g = l.current) == null || g.select());
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
        children: /* @__PURE__ */ r(Wr, { "aria-hidden": "true" })
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
          g.key === "Enter" ? (g.preventDefault(), u()) : g.key === "Escape" && (g.preventDefault(), g.stopPropagation(), h(!0));
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
        children: /* @__PURE__ */ r(os, { "aria-hidden": "true" })
      }
    )
  ] });
}
function tc({
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
          /* @__PURE__ */ r(ll, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ r(qi, { "aria-hidden": "true" }),
          "Grid"
        ]
      }
    )
  ] });
}
function iu({
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
function Ui({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [a, i] = A(!1), [o, s] = A(!1), l = R(null), d = R(null), h = vt();
  ln(() => {
    if (!a || !d.current || !l.current) return;
    const m = l.current.getBoundingClientRect(), N = d.current.offsetHeight + 12, y = window.innerHeight - m.bottom;
    s(y < N && m.top > y);
  }, [a]), J(() => {
    var m, N;
    a && ((N = (m = d.current) == null ? void 0 : m.querySelector('[role="menuitem"]:not(:disabled)')) == null || N.focus({ preventScroll: !0 }));
  }, [a]), J(() => {
    t && i(!1);
  }, [t]);
  const u = (m = !0) => {
    var N;
    i(!1), m && ((N = l.current) == null || N.focus());
  };
  return /* @__PURE__ */ c("div", { className: `dq-menu${a ? " dq-menu-open" : ""}`, onKeyDown: (m) => {
    var q, k;
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
      const b = m.key === "ArrowDown" ? 1 : -1;
      N[(y + b + N.length) % N.length].focus();
    } else (m.key === "Home" || m.key === "End") && (m.preventDefault(), (k = N.at(m.key === "Home" ? 0 : -1)) == null || k.focus());
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
        children: /* @__PURE__ */ r(dl, { "aria-hidden": "true" })
      }
    ),
    a && /* @__PURE__ */ c(de, { children: [
      /* @__PURE__ */ r("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => u(!1) }),
      /* @__PURE__ */ r(
        "div",
        {
          ref: d,
          id: h,
          role: "menu",
          "aria-label": n,
          className: `dq-menu-list${o ? " dq-menu-list-up" : ""}`,
          children: e.map((m) => /* @__PURE__ */ c(bi, { children: [
            m.separated && /* @__PURE__ */ r("div", { role: "separator", className: "dq-menu-separator" }),
            /* @__PURE__ */ c(
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
function Sa(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Gi(e) {
  return String(e.type).toLowerCase() === "tag";
}
function Ki(e) {
  return !!String(e ?? "").trim();
}
function Bi(e) {
  return [
    ...new Set(
      Sa(e.customFieldCriteria).filter(Gi).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !Ki(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function Vi(e, t) {
  const n = Sa(e.customFieldCriteria);
  if (!n.length) return e;
  let a = !1;
  const i = n.map((o) => {
    if (!Gi(o)) return o;
    const s = { ...o };
    for (const [l, d] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const h = t[String(o[l] ?? "")];
      h && !Ki(o[d]) && (s[d] = h, a = !0);
    }
    return s;
  });
  return a ? { ...e, customFieldCriteria: i } : e;
}
function nc(e, t, n) {
  const a = Sa(e.customFieldCriteria);
  if (!a.length) return e;
  const i = Sa(n.customFieldCriteria), o = (d, h) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (u) => (d[u] ?? void 0) === (h[u] ?? void 0)
  );
  let s = !1;
  const l = a.map((d) => {
    if (!Gi(d)) return d;
    const h = i.find((g) => o(g, d));
    if (!h) return d;
    const u = { ...d };
    for (const [g, m] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const N = t[String(d[g] ?? "")];
      N && d[m] === N && !Ki(h[m]) && (delete u[m], s = !0);
    }
    return u;
  });
  return s ? { ...e, customFieldCriteria: l } : e;
}
async function ou(e, t, n) {
  if (!Rn(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const a = Fe(e), i = n.steps.some((l) => An(l.mode)) ? await td(a) : "", o = await Oi(n);
  let s = t.applications;
  for (const l of [
    ...o.filter((d) => !An(d.mode)),
    ...o.filter((d) => An(d.mode))
  ]) {
    const d = (h) => nd(
      i,
      a,
      t.media.id,
      t.performer.id,
      l.tagIds,
      h
    );
    (l.mode === "MARK_PRESENT" || l.mode === "CLEAR_ABSENCE") && await d("REMOVE"), l.mode !== "CLEAR_ABSENCE" && (s = await oc(
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
async function Ji(e, t) {
  const n = e.occurrence;
  if (ki(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const a = /* @__PURE__ */ new Set(), { _filterExpression: i, ...o } = n.performerFilter;
  for (let s = 1; ; s++) {
    const l = await ce("/api/performers/find", {
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
    if (l.items.forEach((d) => a.add(d.id)), s * 1e3 >= l.totalCount) return [...a];
    if (!l.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function rc(e) {
  return Kr(e.condition) && e.hideConfirmedAbsent !== !1;
}
function zi(e, t) {
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
  }, s = rc(i) && (t == null ? void 0 : t.length) === 1 && i.conditionTagIds.length === 1 ? `${t[0]}:${i.conditionTagIds[0]}` : null;
  return {
    ...e,
    entityType: Fe(e),
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
                      key: Aa,
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
async function Qi(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => Ta([n], t))
  );
}
function ac(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function su(e, t, n = e.conditionTagIds.map((a) => [a])) {
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
function cu(e, t, n, a, i) {
  if (!rc(e)) return !1;
  const o = ks(t, n);
  return e.conditionTagIds.every(
    (s, l) => o.includes(s) || i[l].some((d) => a.includes(d))
  );
}
async function ic(e, t, n, a) {
  if ((t == null ? void 0 : t.length) === 0 || ac(e.occurrence))
    return { items: [], totalCount: 0 };
  const i = Fe(e), o = await jr(
    zi(e, t),
    { ...e.view.filter, page: n },
    a
  ), s = t === null ? null : new Set(t), l = e.occurrence, d = o.items.length ? await Qi(l, a) : [], h = new Array(o.items.length);
  let u = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, o.items.length) }, async () => {
      for (; u < o.items.length; ) {
        const g = u++, m = o.items[g], N = await ce(
          `/api/tagapplications?hostType=${i}&hostId=${m.id}&contextType=performer`,
          { signal: a }
        );
        h[g] = m.performers.filter((y) => s === null || s.has(y.id)).flatMap((y) => {
          const q = N.filter(
            (b) => b.hostType === i && b.hostId === m.id && b.contextType === "performer" && b.contextId === y.id
          ), k = q.map((b) => b.tag.id);
          return su(e.occurrence, k, d) && !cu(l, m, y.id, k, d) ? [
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
async function oc(e, t, n) {
  const a = new Set(e.occurrence.tagIds);
  if (n.some((h) => !a.has(h)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const i = Fe(e), o = await ni(i, t.media.id);
  if (!o.performers.some(
    (h) => h.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${i}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${i}&hostId=${o.id}&contextType=performer&contextId=${t.performer.id}`, l = (await ce(s)).filter(
    (h) => h.hostType === i && h.hostId === o.id && h.contextType === "performer" && h.contextId === t.performer.id
  ), d = new Set(n);
  try {
    for (const h of d)
      l.some((u) => u.tag.id === h) || await ce("/api/tagapplications", {
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
      a.has(h.tag.id) && !d.has(h.tag.id) && await ce(`/api/tagapplications/${h.id}`, {
        method: "DELETE"
      });
    return await ce(s);
  } catch (h) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${h instanceof Error ? h.message : "Request failed."}`
    );
  }
}
function Ar(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function lu(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function cn(e, t, n = !0) {
  var l;
  if (t.occurrence) {
    const d = n ? ks(
      await ni(e, t.media.id),
      t.occurrence.performer.id
    ) : [], h = (await ce(lu(e, t))).filter(
      (u) => u.hostType === e && u.hostId === t.media.id && u.contextType === "performer" && u.contextId === t.occurrence.performer.id
    );
    return ci(h.map((u) => u.tag)), {
      ids: [...new Set(h.map((u) => u.tag.id))],
      names: [...new Set(h.map((u) => u.tag.name))],
      absent: d,
      applications: h
    };
  }
  const a = await ni(e, t.media.id), i = (a.tags ?? []).filter(
    (d) => d.canRemove !== !1 || d.isDerived !== !0
  );
  ci(i);
  const o = Object.keys(a.customFields ?? {}).find(
    (d) => d.toLowerCase() === va
  ) ?? va, s = ((l = a.customFields) == null ? void 0 : l[o]) ?? [];
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
async function Wi(e, t, n) {
  if (t.occurrence && Ce(e))
    await oc(
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
      i.length && await ce(
        `/api/${Qn(Fe(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: a, tagIds: i })
        }
      );
}
async function du(e, t, n) {
  t.occurrence && Ce(e) ? await ou(e, t.occurrence, n) : await Cs(Fe(e), n, [t.media.id]);
}
function li(e, t, n, a) {
  const i = (o) => o.filter((s) => a.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: Ar(i(t.ids), i(n.ids)),
    absence: Ar(i(t.absent), i(n.absent))
  };
}
function uu(e, t) {
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
class sc extends Error {
}
const di = (e) => e instanceof Error ? e.message : "Request failed.", Ao = (e) => [...e].sort((t, n) => t - n), Jr = (e, t) => JSON.stringify(Ao(e)) === JSON.stringify(Ao(t)), ui = (e) => !!(e.tags.added.length || e.tags.removed.length);
function Ea(e, t, n, a) {
  const i = new Set(e), o = new Set(e);
  for (const u of t.steps)
    for (const g of u.tagIds)
      u.mode === "ADD" ? o.add(g) : o.delete(g);
  const s = e.some((u) => !o.has(u));
  if (s && !a)
    return { desired: [...e], conflict: s, skipped: !0, kept: [], replaced: [] };
  const l = new Set(
    t.steps.filter((u) => u.mode === "ADD").flatMap((u) => u.tagIds)
  ), d = [], h = [];
  for (const u of n) {
    const g = u.filter((N) => o.has(N) && !i.has(N)), m = u.filter(
      (N) => o.has(N) && i.has(N) && !l.has(N)
    );
    !g.length || !m.length || (a ? (m.forEach((N) => o.delete(N)), h.push(...m)) : (g.forEach((N) => o.delete(N)), d.push({ tagIds: g, existing: m })));
  }
  return { desired: [...o], conflict: s, skipped: !1, kept: d, replaced: h };
}
function fu(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function pu(e, t, n, a) {
  for (const [i, o] of n.entries()) {
    const s = t.filter(
      (h) => h.steps.some(
        (u) => u.mode === "ADD" && u.tagIds.some((g) => o.includes(g))
      )
    );
    if (s.length < 2) continue;
    const l = e.occurrence.conditionTagIds[i];
    let d = `tag ${l}`;
    try {
      d = (await ce(`/api/tags/${l}`, { signal: a })).name;
    } catch {
      a.throwIfAborted();
    }
    throw new sc(
      `${s.map((h) => h.label).join(" and ")} answer the same condition tag, ${d}. Choose one of them.`
    );
  }
}
async function hu(e, t, n, a = () => {
}) {
  if (!t.length || t.some(
    (m) => !Rn(m, e.entityType) || !m.steps.length || m.steps.some(
      (N) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(N.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), o = structuredClone(t), s = Kr(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await Qi(i.occurrence, n) : [];
  await pu(i, o, s, n);
  const l = await Promise.all(
    o.map(async (m) => ({
      ...m,
      steps: await Oi(m, n)
    }))
  ), d = structuredClone(fu(l));
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
  const u = await Ji(i, n), g = /* @__PURE__ */ new Map();
  for (let m = 1; ; m++) {
    n.throwIfAborted();
    const N = await ic(i, u, m, n);
    for (const y of N.items) {
      const q = {
        ids: [...new Set(y.applications.map((b) => b.tag.id))],
        names: y.applications.map((b) => b.tag.name),
        absent: [],
        applications: y.applications
      }, k = Ea(q.ids, d, s, !0);
      g.set(y.key, {
        item: { key: y.key, media: y.media, occurrence: y },
        before: q,
        expected: q,
        conflict: k.conflict,
        status: Jr(q.ids, k.desired) ? "unchanged" : "pending"
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
function mu(e, t, n) {
  const a = (o) => o.ids.filter((s) => n.includes(s));
  if (!Jr(a(e), a(t))) return !1;
  const i = (o) => (o.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return Jr(i(e), i(t));
}
async function cc(e, t, n, a) {
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
function lc(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function dc(e) {
  return e.entries.filter((t) => t.operation);
}
async function gu(e, t, n, a, i = !1) {
  await cc(
    lc(e, i),
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
        if (s = await cn(Fe(e.review), o.item, !1), !mu(o.expected, s, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (m) {
        o.status = "failed", o.error = di(m);
        return;
      }
      const l = Ea(
        o.before.ids,
        e.action,
        e.categories,
        t
      ), d = [
        ...s.ids.filter((m) => !e.touched.includes(m)),
        ...l.desired.filter((m) => e.touched.includes(m))
      ], h = Ar(s.ids, d);
      if (!h.added.length && !h.removed.length) {
        const m = !o.operation && l.kept.length > 0;
        o.status = o.operation ? "changed" : m ? "skipped" : "unchanged", o.error = m ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let u;
      try {
        await Wi(e.review, o.item, h);
      } catch (m) {
        u = m;
      }
      let g = !1;
      try {
        const m = await cn(Fe(e.review), o.item, !1);
        g = !0, o.expected = m;
        const N = li(
          o.item,
          o.before,
          m,
          e.touched
        );
        if (o.operation = ui(N) ? N : void 0, u) throw u;
        if (!Jr(
          m.ids.filter((y) => e.touched.includes(y)),
          d.filter((y) => e.touched.includes(y))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (m) {
        if (o.status = "failed", o.error = di(m), !g)
          try {
            const N = await cn(Fe(e.review), o.item, !1);
            o.expected = N;
            const y = li(
              o.item,
              o.before,
              N,
              e.touched
            );
            o.operation = ui(y) ? y : void 0;
          } catch {
            o.unverified = !0;
          }
      }
    },
    a
  );
}
async function bu(e, t, n) {
  await cc(
    dc(e),
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
        const l = await cn(Fe(e.review), a.item, !1);
        uu(i, l), s = !0, await Wi(e.review, a.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const d = await cn(Fe(e.review), a.item, !1);
        if (!Jr(
          d.ids.filter((h) => o.includes(h)),
          a.before.ids.filter((h) => o.includes(h))
        ))
          throw new Error("Undo did not restore all affected tags.");
        a.operation = void 0, a.expected = d, a.status = "unchanged", a.error = void 0;
      } catch (l) {
        if (a.error = `Undo stopped: ${di(l)}`, a.status = "failed", s)
          try {
            const d = await cn(Fe(e.review), a.item, !1), h = li(
              a.item,
              a.before,
              d,
              o
            );
            a.operation = ui(h) ? h : void 0, a.expected = d;
          } catch {
            a.unverified = !0;
          }
      }
    },
    n
  );
}
async function wu(e, t, n) {
  const a = Fe(e), i = e.occurrence, [o, s] = await Promise.all([
    ce(
      `/api/tagapplications?hostType=${a}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    Qi(i, n)
  ]), l = o.filter(
    (y) => y.hostType === a && y.contextType === "performer" && y.contextId === t
  );
  ci(l.map((y) => y.tag));
  const d = await Promise.all(
    s.map(async (y, q) => {
      const k = i.conditionTagIds[q];
      return (await ce(`/api/tags/${k}`, { signal: n })).name;
    })
  ), h = new Set(s.flat()), u = new Set(
    [
      ...e.actions.flatMap((y) => y.steps).filter((y) => y.mode === "ADD" || y.mode === "MARK_PRESENT").flatMap((y) => y.tagIds),
      ...i.tagIds
    ].filter((y) => !h.has(y))
  ), g = (y) => {
    const q = /* @__PURE__ */ new Map();
    for (const k of l) {
      if (!y.has(k.tag.id)) continue;
      const b = q.get(k.tag.id) ?? {
        tag: k.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      b.hosts.add(k.hostId), q.set(k.tag.id, b);
    }
    return [...q.values()].map((k) => ({ ...k.tag, count: k.hosts.size })).sort((k, b) => b.count - k.count || As(k, b));
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
      l.filter((y) => N.has(y.tag.id)).map((y) => y.hostId)
    ).size,
    groups: m
  };
}
const uc = zc(!1);
function yu({ children: e }) {
  return /* @__PURE__ */ r(uc.Provider, { value: !0, children: e });
}
function Xt({ tag: e, name: t }) {
  const n = Qc(uc), a = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ r(Yc, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: a ?? void 0 });
}
const To = { summary: null, error: "" };
function fc(e, t, n = 0) {
  const [a, i] = A(To), o = e.occurrence, s = JSON.stringify([
    e.entityType,
    t,
    o.condition,
    o.conditionTagIds,
    o.includeSubtags,
    o.tagIds,
    e.actions.map((l) => l.steps)
  ]);
  return J(() => {
    if (i(To), t === null) return;
    const l = new AbortController();
    return wu(e, t, l.signal).then((d) => {
      l.signal.aborted || i({ summary: d, error: "" });
    }).catch((d) => {
      l.signal.aborted || i({
        summary: null,
        error: d instanceof Error ? d.message : "Request failed."
      });
    }), () => l.abort();
  }, [s, n]), a;
}
function vu({
  review: e,
  performerId: t,
  revision: n = 0
}) {
  const a = fc(e, t, n);
  return /* @__PURE__ */ r(fi, { ...a, mediaKind: Fe(e) });
}
function fi({
  summary: e,
  error: t,
  mediaKind: n,
  className: a = ""
}) {
  const i = bn(n), o = (s) => `${s.toLocaleString()} ${s === 1 ? i.one : i.many}`;
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
            /* @__PURE__ */ r(Xt, { tag: l }),
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
function Er({
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
const Ro = 5;
function Nu(e, t) {
  return Promise.all(
    e.map(async (n) => {
      try {
        return (await ce(`/api/performers/${n}`, { signal: t })).name;
      } catch {
        return t.throwIfAborted(), `Performer ${n}`;
      }
    })
  );
}
function qu(e, t) {
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
const $o = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), pi = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], Oo = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], Su = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, Ja = 250;
function _r(e, t) {
  var a, i;
  const n = e.item.media;
  return n.title || ((i = (a = n.files) == null ? void 0 : a[0]) == null ? void 0 : i.basename) || (t === "audio" ? "Audio" : "Scene");
}
function Eu({ step: e }) {
  const t = pi.findIndex((n) => n.id === e);
  return /* @__PURE__ */ r("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: pi.map((n, a) => {
    const i = a < t ? "done" : a === t ? "current" : "next";
    return /* @__PURE__ */ c("li", { "data-state": i, "aria-current": i === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: i === "done" ? /* @__PURE__ */ r(ka, {}) : a + 1 }),
      n.label,
      i === "done" && /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function Io({ parts: e, id: t }) {
  return /* @__PURE__ */ r("span", { className: "dq-batch-effect", id: t, children: e.map((n, a) => /* @__PURE__ */ c(bi, { children: [
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
        n && /* @__PURE__ */ c(de, { children: [
          " ",
          /* @__PURE__ */ r("span", { className: "dq-batch-stat-detail", children: n })
        ] })
      ]
    }
  );
}
function Mo({
  added: e,
  removed: t,
  tag: n,
  label: a
}) {
  return /* @__PURE__ */ c("ul", { className: "dq-tags", "aria-label": a, children: [
    lr(e.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ c("ins", { children: [
      "+ ",
      /* @__PURE__ */ r(Xt, { tag: i })
    ] }) }, `added-${i.id}`)),
    lr(t.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ c("del", { children: [
      "− ",
      /* @__PURE__ */ r(Xt, { tag: i })
    ] }) }, `removed-${i.id}`))
  ] });
}
function Fo({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: a,
  describe: i
}) {
  return /* @__PURE__ */ c("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: e }),
      t.length > Ja && /* @__PURE__ */ c("span", { children: [
        "First ",
        Ja.toLocaleString(),
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
      /* @__PURE__ */ r("tbody", { children: t.slice(0, Ja).map((o) => {
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
function ku(e) {
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
function Cu({
  review: e,
  disabled: t,
  performerFlags: n = [],
  trees: a,
  onOpen: i,
  onClose: o,
  onWrite: s
}) {
  const [l, d] = A(!1), [h, u] = A("answers"), [g, m] = A(null), [N, y] = A({}), [q, k] = A([]), [b, O] = A(!1), [F, G] = A(!1), [K, j] = A(""), [X, te] = A(!1), [ie, re] = A(""), [_, B] = A(null), [v, E] = A(null), [L, D] = A([]), [W, Z] = A(0), V = R(null), T = R(null), Ge = R(null), Ae = R(!1), tt = R(!1), U = R(null), ve = R(!1), Ke = R(0), qe = R(!1), Qe = R({ onClose: o, onWrite: s });
  Qe.current = { onClose: o, onWrite: s };
  const Te = vt(), Be = h === "run", Zt = (_ == null ? void 0 : _.kind) === "undo", Re = Be && g ? g.review : e, wn = Rr(Re.actions), le = Re.occurrence, Ve = Fe(Re), Nt = bn(Ve), dn = Nt.queue, Ie = Be && g ? g.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((C) => C.steps.length && !zn(C))
  ), it = Ie.filter((C) => q.includes(C.id)), Se = le.targetMode === "selected" && le.performerIds.length === 1, ot = fc(
    Re,
    l && Se ? le.performerIds[0] : null,
    W
  ), Dt = Bi(Re.view.objectFilter), $e = Li(
    l ? [...Ra(Ie), ...le.conditionTagIds, ...Dt] : []
  ), yn = ye(() => Ls($e), [$e]), st = (C) => N[C] ?? $e[C] ?? { id: C, name: `Tag ${C}` }, Ot = JSON.stringify(
    Object.fromEntries(
      Dt.flatMap((C) => {
        var ne;
        const M = (ne = $e[C]) == null ? void 0 : ne.name;
        return M ? [[String(C), M]] : [];
      })
    )
  ), dt = ye(
    () => Vi(Re.view.objectFilter, JSON.parse(Ot)),
    [Re.view.objectFilter, Ot]
  );
  J(() => {
    var C, M, ne;
    l && ((C = V.current) == null || C.showModal(), (ne = (M = V.current) == null ? void 0 : M.querySelector(".dq-batch-answer input")) == null || ne.focus());
  }, [l]), J(() => {
    if (!l) return;
    const C = requestAnimationFrame(() => {
      var Ee;
      const M = V.current, ne = document.activeElement;
      if (!M || ne && ne !== document.body && M.contains(ne)) return;
      (Ee = (h === "answers" ? M.querySelector(".dq-batch-answer input:checked") ?? M.querySelector(".dq-batch-answer input") : M.querySelector("[data-batch-focus]")) ?? T.current) == null || Ee.focus();
    });
    return () => cancelAnimationFrame(C);
  }, [l, h, F, g]), J(() => {
    if (l || t || !Ae.current) return;
    const C = requestAnimationFrame(() => {
      const M = Ge.current;
      if (!Ae.current || !M || M.disabled) return;
      Ae.current = !1;
      const ne = document.activeElement;
      (!ne || ne === document.body) && M.focus();
    });
    return () => cancelAnimationFrame(C);
  }, [l, t]), J(() => {
    if (!l || le.targetMode !== "selected") return;
    const C = new AbortController();
    return D([]), Nu(le.performerIds.slice(0, Ro), C.signal).then((M) => {
      C.signal.aborted || D(M);
    }).catch(() => {
    }), () => C.abort();
  }, [l, le.targetMode, JSON.stringify(le.performerIds)]), J(
    () => () => {
      var C;
      tt.current = !0, (C = U.current) == null || C.abort();
    },
    []
  ), J(() => {
    if (!F) return;
    const C = (M) => {
      M.preventDefault(), M.returnValue = "";
    };
    return window.addEventListener("beforeunload", C), () => window.removeEventListener("beforeunload", C);
  }, [F]);
  function _t() {
    u("answers"), m(null), y({}), B(null), O(!1), k([]), re(""), j(""), te(!1), E(null);
  }
  function gt() {
    qe.current || (d(!1), Qe.current.onClose(ve.current), ve.current = !1, _t(), Ae.current = !0);
  }
  function Wn(C, M) {
    k(
      (ne) => M ? [...ne, C] : ne.filter((Y) => Y !== C)
    ), m(null), y({}), re(""), j(""), te(!1), E(null);
  }
  function Et() {
    u("answers"), E(null), re("");
  }
  function vn() {
    u("preview"), g || me();
  }
  function jt() {
    var C;
    tt.current = !0, (C = U.current) == null || C.abort(), re("Stopping after in-flight operations settle…");
  }
  function It(C) {
    E(
      (M) => (M == null ? void 0 : M.group) === C.group && M.reason === C.reason ? null : C
    );
  }
  const un = (C, M) => (v == null ? void 0 : v.group) === C && v.reason === M;
  async function me() {
    if (!it.length || qe.current) return;
    qe.current = !0, G(!0), j(""), te(!1), re("Loading all matching occurrences…"), m(null), y({}), E(null);
    const C = new AbortController();
    U.current = C;
    try {
      await qu(Ke.current, C.signal);
      const M = await hu(
        e,
        it,
        C.signal,
        (Y) => re(`Loaded ${Y.toLocaleString()} matching occurrences…`)
      );
      C.signal.throwIfAborted();
      const ne = {};
      for (const Y of M.entries)
        for (const Ee of Y.before.applications ?? [])
          ne[Ee.tag.id] = Ee.tag;
      y(ne), m(M), re("Preview ready. No tags have been changed.");
    } catch (M) {
      j(
        C.signal.aborted ? "Preview cancelled. No tags were changed." : M instanceof Error ? M.message : String(M)
      ), te(!C.signal.aborted && M instanceof sc), re("");
    } finally {
      qe.current = !1, G(!1), U.current = null;
    }
  }
  async function qt(C) {
    if (!g || qe.current) return;
    const M = (C === "undo" ? dc(g) : lc(g, C === "retry")).length;
    qe.current = !0, tt.current = !1, ve.current = !0, Qe.current.onWrite(), G(!0), u("run"), j(""), B({ kind: C, total: M, done: 0, stopped: !1 }), re(
      C === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const ne = () => B((Ee) => Ee && { ...Ee, done: Ee.done + 1 });
    let Y = !1;
    try {
      C === "undo" ? await bu(g, () => tt.current, ne) : await gu(g, b, () => tt.current, ne, C === "retry"), re(
        tt.current ? "Stopped after in-flight operations settled. Completed changes are retained." : C === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (Ee) {
      Y = !0, re(""), j(Ee instanceof Error ? Ee.message : String(Ee));
    } finally {
      Ke.current = Date.now(), qe.current = !1;
      const Ee = tt.current || Y;
      B((be) => be && { ...be, stopped: Ee }), G(!1), Z((be) => be + 1);
    }
  }
  const nt = (g == null ? void 0 : g.entries) ?? [], On = ye(
    () => new Map(
      ((g == null ? void 0 : g.entries) ?? []).map((C) => [
        C.item.key,
        Ea(C.before.ids, g.action, g.categories, b)
      ])
    ),
    [g, b]
  ), Ut = (C) => On.get(C.item.key), _e = (C) => Ar(C.before.ids, Ut(C).desired), kt = (C) => {
    const M = _e(C);
    return C.status === "pending" && (M.added.length > 0 || M.removed.length > 0);
  }, ee = (C) => C.conflict || Ut(C).kept.length > 0 || Ut(C).replaced.length > 0, I = ye(() => {
    const C = (g == null ? void 0 : g.entries) ?? [];
    return {
      willChange: C.filter(kt).length,
      correct: C.filter((M) => M.status === "unchanged").length,
      different: C.filter(ee).length,
      hosts: new Set(C.map((M) => M.item.media.id)).size,
      added: [...new Set(C.flatMap((M) => _e(M).added))],
      removed: [...new Set(C.flatMap((M) => _e(M).removed))]
    };
  }, [On]), we = ye(
    () => ((g == null ? void 0 : g.entries) ?? []).filter((C) => C.item.media.date).sort((C, M) => C.item.media.date.localeCompare(M.item.media.date)),
    [g]
  ), ut = Be ? ku(nt) : null, In = (C) => wn.keys[Re.actions.findIndex((M) => M.id === C)] ?? "", se = (C) => hr(C, yn, [], a), Ct = Kr(le.condition) && le.includeSubtags !== !1 && le.conditionTagIds.length > 0, Ye = we[0], Pe = we.length > 1 ? we[we.length - 1] : void 0, Xe = (C) => `/${Ve}/${C.item.media.id}`, Gt = Se ? L[0] : void 0, Ze = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: kt },
    correct: { title: "Occurrences already correct", test: (C) => C.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: ee }
  };
  function bt() {
    const C = Su[le.condition], M = !!C && le.conditionTagIds.length > 0, ne = le.performerIds.slice(0, Ro), Y = String(Re.view.filter.q ?? "").trim(), Ee = le.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ c("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      ki(le) ? /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "All performers" }) : le.targetMode === "selected" ? /* @__PURE__ */ c(de, { children: [
        ne.map((be, xe) => /* @__PURE__ */ c("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ r(Er, { performer: { id: be, name: L[xe] ?? "" } }),
          L[xe] ?? "…"
        ] }, be)),
        le.performerIds.length > ne.length && /* @__PURE__ */ c("span", { className: "dq-batch-chip", children: [
          (le.performerIds.length - ne.length).toLocaleString(),
          " more performers"
        ] })
      ] }) : /* @__PURE__ */ c(de, { children: [
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
                objectFilter: le.performerFilter,
                criteriaDefinitions: wi,
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
        M ? C : Si[le.condition],
        M && /* @__PURE__ */ r("span", { className: "dq-batch-chip-tags", children: lr(le.conditionTagIds.map(st)).map((be) => /* @__PURE__ */ r(Xt, { tag: be }, be.id)) })
      ] }),
      M && /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: le.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      Kr(le.condition) && le.hideConfirmedAbsent !== !1 && /* @__PURE__ */ c("span", { className: "dq-batch-chip", title: Ee, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
          ": ",
          Ee
        ] })
      ] }),
      Y && /* @__PURE__ */ c("span", { className: "dq-batch-chip", children: [
        "Search “",
        Y,
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
              criteriaDefinitions: Ve === "audio" ? Wo : yi,
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
  function Mt(C) {
    return n.length ? /* @__PURE__ */ c("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ r(wa, { "aria-hidden": "true" }),
      /* @__PURE__ */ c("div", { children: [
        /* @__PURE__ */ c("p", { children: [
          /* @__PURE__ */ r("strong", { children: Gt || "This performer" }),
          " is flagged:",
          " ",
          /* @__PURE__ */ r("strong", { children: n.join(", ") }),
          ". Check the earliest and latest",
          " ",
          Nt.many,
          " before applying, or narrow the batch with a date filter."
        ] }),
        C && Ye && /* @__PURE__ */ c("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ c("a", { href: Xe(Ye), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            _r(Ye, Ve),
            " · ",
            Ye.item.media.date
          ] }),
          Pe && /* @__PURE__ */ c("a", { href: Xe(Pe), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            _r(Pe, Ve),
            " · ",
            Pe.item.media.date
          ] })
        ] })
      ] })
    ] }) : null;
  }
  function en() {
    return /* @__PURE__ */ c(de, { children: [
      bt(),
      Mt(!1),
      /* @__PURE__ */ c("div", { className: `dq-batch-pick${Se ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ c("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ r("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ r("div", { className: "dq-batch-answers", children: Ie.map((C, M) => {
            const ne = In(C.id);
            return /* @__PURE__ */ c("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ r(
                "input",
                {
                  type: "checkbox",
                  checked: q.includes(C.id),
                  "aria-labelledby": `${Te}-answer-${M}`,
                  "aria-describedby": `${Te}-effect-${M}`,
                  onChange: (Y) => Wn(C.id, Y.target.checked)
                }
              ),
              /* @__PURE__ */ r("span", { className: "dq-batch-answer-key", children: ne && /* @__PURE__ */ r(at, { binding: ne, hidden: !0 }) }),
              /* @__PURE__ */ c("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ r(
                  "span",
                  {
                    id: `${Te}-answer-${M}`,
                    className: "dq-batch-answer-label",
                    title: C.label,
                    children: C.label
                  }
                ),
                /* @__PURE__ */ r(Io, { id: `${Te}-effect-${M}`, parts: se(C) })
              ] })
            ] }, C.id);
          }) })
        ] }),
        Se && /* @__PURE__ */ r(fi, { ...ot, mediaKind: Ve, className: "dq-batch-card" })
      ] })
    ] });
  }
  function ct(C) {
    const M = I, ne = v && $o.has(v.group) ? v.group : null, Y = ne ? nt.filter(Ze[ne].test) : [], Ee = (be) => {
      const xe = Ut(be), je = xe.skipped ? Ar(
        be.before.ids,
        Ea(be.before.ids, C.action, C.categories, !0).desired
      ) : _e(be), At = !je.added.length && !je.removed.length;
      return /* @__PURE__ */ c("div", { className: "dq-batch-plan", children: [
        xe.skipped && /* @__PURE__ */ r("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        At ? !xe.kept.length && /* @__PURE__ */ r("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ r(Mo, { added: je.added, removed: je.removed, tag: st }),
        xe.kept.map((Ne, tn) => /* @__PURE__ */ c("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          lr(Ne.existing.map(st)).map((ue) => /* @__PURE__ */ r(Xt, { tag: ue }, ue.id)),
          " ",
          "instead of",
          " ",
          lr(Ne.tagIds.map(st)).map((ue) => /* @__PURE__ */ r(Xt, { tag: ue }, ue.id))
        ] }, tn))
      ] });
    };
    return /* @__PURE__ */ c(de, { children: [
      /* @__PURE__ */ c("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ c("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ r(
            Dr,
            {
              value: nt.length,
              label: nt.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${M.hosts.toLocaleString()} ${M.hosts === 1 ? dn : `${dn}s`}`,
              pressed: un("matching"),
              onToggle: () => It({ group: "matching" })
            }
          ),
          /* @__PURE__ */ r(
            Dr,
            {
              value: M.willChange,
              label: "will change",
              tone: "add",
              pressed: un("change"),
              onToggle: () => It({ group: "change" })
            }
          ),
          /* @__PURE__ */ r(
            Dr,
            {
              value: M.correct,
              label: "already correct, no write",
              pressed: un("correct"),
              onToggle: () => It({ group: "correct" })
            }
          ),
          /* @__PURE__ */ r(
            Dr,
            {
              value: M.different,
              label: b ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: un("different"),
              onToggle: () => It({ group: "different" })
            }
          )
        ] }),
        Y.length > 0 ? /* @__PURE__ */ r(
          Fo,
          {
            title: Ze[ne].title,
            entries: Y,
            mediaKind: Ve,
            resultHeading: "Planned change",
            describe: Ee
          }
        ) : nt.length > 0 && /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        nt.length > 0 && /* @__PURE__ */ c("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ r("span", { children: Ye ? `Dates ${Ye.item.media.date}${Pe ? ` to ${Pe.item.media.date}` : ""}` : "No dates" }),
          Ye && /* @__PURE__ */ r(
            "a",
            {
              href: Xe(Ye),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${Nt.one}, ${Ye.item.media.date}`,
              title: _r(Ye, Ve),
              children: "Open earliest"
            }
          ),
          Pe && /* @__PURE__ */ r(
            "a",
            {
              href: Xe(Pe),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${Nt.one}, ${Pe.item.media.date}`,
              title: _r(Pe, Ve),
              children: "Open latest"
            }
          ),
          we.length < nt.length && /* @__PURE__ */ c("span", { children: [
            (nt.length - we.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (M.added.length > 0 || M.removed.length > 0) && /* @__PURE__ */ c("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ r("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ r(
            Mo,
            {
              added: M.added,
              removed: M.removed,
              tag: st,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      M.different > 0 && /* @__PURE__ */ c("div", { className: "dq-batch-choice", children: [
        /* @__PURE__ */ r("span", { id: `${Te}-choice`, className: "dq-batch-choice-label", children: "Occurrences with a different answer" }),
        /* @__PURE__ */ c(
          "div",
          {
            className: "dq-segmented dq-segmented-fill",
            role: "group",
            "aria-labelledby": `${Te}-choice`,
            children: [
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": !b, onClick: () => O(!1), children: "Keep their answer" }),
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": b, onClick: () => O(!0), children: "Replace it" })
            ]
          }
        ),
        /* @__PURE__ */ c("p", { className: "dq-muted", children: [
          "A different answer is a tag the chosen answers would remove",
          Ct ? ", or another answer already in a condition category (each condition tag with its subtags); keeping it still fills the empty categories" : "",
          ". Configure opposite answers as removals."
        ] })
      ] })
    ] });
  }
  function mr() {
    return /* @__PURE__ */ c(de, { children: [
      bt(),
      Mt(!0),
      /* @__PURE__ */ c("div", { className: `dq-batch-cards${Se ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ c("section", { className: "dq-batch-card", "aria-labelledby": `${Te}-chosen`, children: [
          /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ r("h3", { id: `${Te}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", disabled: F, onClick: Et, children: "Change" })
          ] }),
          /* @__PURE__ */ r("ul", { className: "dq-batch-chosen", children: it.map((C) => {
            const M = In(C.id);
            return /* @__PURE__ */ c("li", { children: [
              /* @__PURE__ */ c("span", { className: "dq-batch-chosen-chip", children: [
                M && /* @__PURE__ */ r(at, { binding: M, hidden: !0 }),
                C.label
              ] }),
              /* @__PURE__ */ r(Io, { parts: se(C) })
            ] }, C.id);
          }) })
        ] }),
        Se && /* @__PURE__ */ r(fi, { ...ot, mediaKind: Ve, className: "dq-batch-card" })
      ] }),
      F ? /* @__PURE__ */ r("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ r("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ r("span", {}) }) }) : g && ct(g)
    ] });
  }
  function Kt(C) {
    const M = _ ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, ne = M.kind === "apply" ? nt.length - C.counts.pending : M.done, Y = M.kind === "apply" ? nt.length : M.total, Ee = F ? M.kind === "undo" ? "Undoing batch…" : M.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : M.kind === "undo" ? M.stopped ? "Undo stopped" : "Undo finished" : M.stopped ? "Stopped" : "Finished", be = Y ? Math.round(ne / Y * 100) : 100, xe = v && !$o.has(v.group) ? v.group : null, je = (Ne) => Oo.find((tn) => tn.status === Ne).label, At = xe ? nt.filter(
      (Ne) => Ne.status === xe && (!v.reason || Ne.error === v.reason)
    ) : [];
    return /* @__PURE__ */ c(de, { children: [
      /* @__PURE__ */ c("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ r("h3", { tabIndex: -1, "data-batch-focus": "", children: Ee }),
          /* @__PURE__ */ c("span", { children: [
            ne.toLocaleString(),
            " of ",
            Y.toLocaleString(),
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
            "aria-valuemax": Y,
            "aria-valuenow": ne,
            children: /* @__PURE__ */ r("span", { style: { width: `${be}%` } })
          }
        ),
        !F && M.kind === "undo" && /* @__PURE__ */ c("p", { className: "dq-batch-undone", children: [
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
        /* @__PURE__ */ r("div", { className: "dq-batch-stats", "data-count": "5", children: Oo.map((Ne) => /* @__PURE__ */ r(
          Dr,
          {
            value: C.counts[Ne.status],
            label: Ne.label,
            tone: Ne.tone,
            pressed: un(Ne.status),
            onToggle: () => It({ group: Ne.status })
          },
          Ne.status
        )) }),
        C.reasons.length > 0 && /* @__PURE__ */ r("ul", { className: "dq-batch-reasons", children: C.reasons.map((Ne) => {
          const tn = un(Ne.status, Ne.error);
          return /* @__PURE__ */ c("li", { children: [
            /* @__PURE__ */ c("span", { children: [
              Ne.count.toLocaleString(),
              " ",
              Ne.status,
              ": ",
              Ne.error
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-link-button",
                "aria-expanded": tn,
                onClick: () => It({ group: Ne.status, reason: Ne.error }),
                children: tn ? "Hide them" : "Show them"
              }
            )
          ] }, `${Ne.status}-${Ne.error}`);
        }) }),
        At.length > 0 ? /* @__PURE__ */ r(
          Fo,
          {
            title: v.reason ? `${je(xe)}: ${v.reason}` : `${je(xe)} occurrences`,
            entries: At,
            mediaKind: Ve,
            resultHeading: "Result",
            describe: (Ne) => Ne.error ?? je(Ne.status)
          }
        ) : /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." })
      ] }),
      C.recorded > 0 && /* @__PURE__ */ c("div", { className: "dq-batch-undo", children: [
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: F,
            onClick: () => void qt("undo"),
            children: [
              /* @__PURE__ */ r(ul, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ c("p", { children: [
          Zt ? M.stopped || F ? `${C.recorded.toLocaleString()} ${C.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${C.recorded.toLocaleString()} ${C.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${C.recorded === 1 ? "this change" : `these ${C.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          "It lasts until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function Mn() {
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
    ) : h === "preview" ? F ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: jt, children: "Cancel preview" }, "cancel-preview") : g ? /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !I.willChange,
        onClick: () => void qt("apply"),
        children: [
          "Apply to ",
          I.willChange.toLocaleString(),
          " ",
          I.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : X ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button primary", onClick: Et, children: "Change answers" }, "change-answers") : /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void me(),
        children: "Preview again"
      },
      "again"
    ) : F ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: jt, children: Zt ? "Cancel undo" : "Cancel run" }, "cancel-run") : Zt || !ut ? null : /* @__PURE__ */ c(bi, { children: [
      ut.retryable && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: () => void qt("retry"), children: "Retry failed" }),
      ut.counts.pending > 0 && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          onClick: () => void qt("apply"),
          children: "Continue"
        }
      )
    ] }, "after-run");
  }
  return /* @__PURE__ */ c(yu, { children: [
    /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: Ge,
        title: "Apply answers to all matching occurrences",
        disabled: t || !Ie.length,
        onClick: () => {
          _t(), i(), d(!0);
        },
        children: [
          /* @__PURE__ */ r(lo, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    l && /* @__PURE__ */ c(
      "dialog",
      {
        ref: V,
        className: "dq-batch-dialog",
        "aria-labelledby": `${Te}-title`,
        "aria-modal": "true",
        onCancel: (C) => {
          C.preventDefault(), gt();
        },
        onClose: () => {
          var C;
          qe.current ? (C = V.current) == null || C.showModal() : gt();
        },
        children: [
          /* @__PURE__ */ c("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ r(lo, { "aria-hidden": "true" }),
            /* @__PURE__ */ r("h2", { id: `${Te}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: F,
                onClick: gt,
                children: /* @__PURE__ */ r(Qr, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r(Eu, { step: h }),
          /* @__PURE__ */ c(
            "div",
            {
              className: "dq-batch-body",
              ref: T,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": h === "preview" ? "" : void 0,
              "aria-label": `${pi.find((C) => C.id === h).label} step`,
              children: [
                /* @__PURE__ */ c("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  ie && /* @__PURE__ */ r("p", { role: "status", children: ie }),
                  K && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: K })
                ] }),
                h === "answers" ? en() : h === "preview" ? mr() : Kt(ut)
              ]
            }
          ),
          /* @__PURE__ */ c("div", { className: "dq-batch-footer", children: [
            h === "preview" && /* @__PURE__ */ c("button", { type: "button", className: "dq-button", disabled: F, onClick: Et, children: [
              /* @__PURE__ */ r(Wr, { "aria-hidden": "true" }),
              "Back"
            ] }),
            h === "run" && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: F, onClick: _t, children: "New batch" }),
            /* @__PURE__ */ r("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: F, onClick: gt, children: "Close" }),
            Mn()
          ] })
        ]
      }
    )
  ] });
}
const pc = "data-quality.description-collapsed.v1";
function Au() {
  try {
    return localStorage.getItem(pc) === "true";
  } catch {
    return !1;
  }
}
function Tu({
  details: e,
  label: t
}) {
  const [n, a] = A(Au), i = mn(() => {
    a((o) => {
      const s = !o;
      try {
        localStorage.setItem(pc, String(s));
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
    !n && (e != null && e.trim() ? /* @__PURE__ */ r(Xc, { className: "dq-description-body", children: e }) : /* @__PURE__ */ r("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
function Ru({
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
  const h = e ? e.ranked.slice(0, e.limit) : [], u = !!e && (e.ranked.length > e.limit || (((g = e.candidates[e.cursor]) == null ? void 0 : g.total) ?? 0) > 0);
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
          children: /* @__PURE__ */ r(fl, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-queue-list", children: h.map((m) => {
      const N = `${m.count.toLocaleString()} matching ${m.count === 1 ? o.one : o.many}`, y = m.flags.length ? `Flagged: ${m.flags.join(", ")}` : "";
      return /* @__PURE__ */ c(
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
            /* @__PURE__ */ r(Er, { performer: m }),
            /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: m.name }),
            y && /* @__PURE__ */ r(wa, { className: "dq-flag-icon", "aria-hidden": "true" }),
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
        onClick: l,
        children: "Show more performers"
      }
    )
  ] });
}
const $u = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], Ou = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function Iu(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), a = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), i = t.bottom + 8;
  return { top: i, left: a, width: n, maxHeight: Math.max(160, window.innerHeight - i - 16) };
}
function pa(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function Mu(e, t) {
  const n = ki(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", a = e.conditionTagIds.map(
    (o) => t[o] === void 0 ? "…" : t[o] ?? "Unavailable tag"
  ), i = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${pa(a, "or")}`,
    includesAll: `has ${pa(a, "and")}`,
    excludes: `has none of ${pa(a, "or")}`,
    excludesAll: `missing ${pa(a, "or")}`
  };
  return `${n} · ${i[e.condition]}`;
}
function Fu({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: a,
  onEditCriteria: i
}) {
  const [o, s] = A(!1), [l, d] = A(null), h = R(null), u = R(null), g = vt(), m = $r(e.conditionTagIds), N = Mu(e, m);
  ln(() => {
    if (!o || !h.current) return;
    const b = () => h.current && d(Iu(h.current));
    return b(), window.addEventListener("resize", b), () => window.removeEventListener("resize", b);
  }, [o]), J(() => {
    var O, F;
    if (!o) return;
    const b = (O = u.current) == null ? void 0 : O.querySelector('[aria-pressed="true"]');
    b && !b.disabled ? b.focus() : (F = u.current) == null || F.focus();
  }, [o]);
  const y = () => {
    s(!1), requestAnimationFrame(() => {
      var b;
      return (b = h.current) == null ? void 0 : b.focus();
    });
  }, q = (b) => {
    if (!(b.target instanceof Element && b.target.closest('[role="dialog"]') !== u.current || b.defaultPrevented)) {
      if (b.key === "Escape")
        b.preventDefault(), y();
      else if (b.key === "Tab" && u.current) {
        const F = [...u.current.querySelectorAll(Ou)].filter((X) => X.closest('[role="dialog"]') === u.current).sort(
          (X, te) => X.compareDocumentPosition(te) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!F.length) return;
        const G = F[0], K = F[F.length - 1], j = document.activeElement;
        b.shiftKey && (j === G || j === u.current) ? (b.preventDefault(), K.focus()) : !b.shiftKey && j === K && (b.preventDefault(), G.focus());
      }
    }
  }, k = !["any", "isNull"].includes(e.condition);
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
        title: N,
        onClick: () => o ? y() : s(!0),
        children: [
          /* @__PURE__ */ r(rs, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-summary", children: N }),
          /* @__PURE__ */ r(ns, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ c(de, { children: [
      /* @__PURE__ */ r("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: y }),
      /* @__PURE__ */ c(
        "div",
        {
          ref: u,
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
              /* @__PURE__ */ r("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: $u.map(({ mode: b, label: O }) => /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === b,
                  onClick: () => e.targetMode !== b && a({ targetMode: b }),
                  children: O
                },
                b
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ r(
                Tn,
                {
                  entityType: "performer",
                  values: e.performerIds,
                  onChange: (b) => a({ performerIds: b }),
                  placeholder: "All performers...",
                  allowCreate: !1
                }
              ),
              e.targetMode === "filter" && /* @__PURE__ */ c("div", { className: "dq-scope-criteria", children: [
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
                    criteriaDefinitions: wi,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (b) => a({ performerFilter: b })
                  }
                ) }),
                /* @__PURE__ */ c("button", { type: "button", className: "dq-button", onClick: i, children: [
                  /* @__PURE__ */ r(Cr, { "aria-hidden": "true" }),
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
                  onChange: (b) => a({ condition: b.target.value }),
                  children: Ei.map((b) => /* @__PURE__ */ r("option", { value: b, children: Si[b] }, b))
                }
              ),
              k && /* @__PURE__ */ c(de, { children: [
                /* @__PURE__ */ r(
                  Tn,
                  {
                    entityType: "tag",
                    values: e.conditionTagIds,
                    onChange: (b) => a({ conditionTagIds: b }),
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
                        onChange: (b) => a({ includeSubtags: b.target.checked })
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
                        onChange: (b) => a({ hideConfirmedAbsent: b.target.checked })
                      }
                    ),
                    "Hide occurrences confirmed absent"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c("div", { className: "dq-scope-footer", children: [
              /* @__PURE__ */ r("p", { children: n ? "Applies to this queue at once, and Save review keeps it." : "Applies to this queue at once. Save it to the review from the filter row." }),
              /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: y, children: "Done" })
            ] })
          ]
        }
      )
    ] })
  ] });
}
function ga(e) {
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
function Pu(e) {
  const t = e.occurrence;
  return JSON.stringify([
    Fe(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {},
    t.flagPerformerTagIds ?? []
  ]);
}
async function xu(e, t) {
  const n = Fe(e) === "audio", a = new Set(e.occurrence.flagPerformerTagIds ?? []), i = (l) => ({
    id: l.id,
    name: l.name,
    total: (n ? l.audioCount : l.videoCount) ?? 0,
    flags: (l.tags ?? []).filter((d) => a.has(d.id)).map((d) => d.name)
  }), o = e.occurrence, s = [];
  if (o.targetMode === "selected" && o.performerIds.length > 0)
    for (const l of o.performerIds) {
      const d = await Bl(
        `/api/performers/${l}`,
        { signal: t }
      );
      d && s.push(i(d));
    }
  else {
    const { _filterExpression: l, ...d } = o.targetMode === "filter" ? o.performerFilter : {};
    for (let h = 1; ; h++) {
      const u = await ce(
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
              filterExpression: l
            })
          )
        }
      );
      if (s.push(...u.items.map(i)), h * 1e3 >= u.totalCount || !u.items.length) break;
    }
  }
  return s.sort((l, d) => d.total - l.total || l.id - d.id);
}
function hc(e, t, n) {
  const a = zi(e, [t]);
  return zl(a, a.view.filter, n);
}
function mc(e, t) {
  const n = e.findIndex(
    (a) => a.count < t.count || a.count === t.count && a.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function hi(e, t, n, a) {
  if (t >= e.length) return !0;
  const i = e[t].total;
  return i <= 0 ? !0 : n.length >= a && i < n[a - 1].count;
}
async function Lu(e, t, n, a, i = {}) {
  const o = ga(e), s = Pu(e), l = ac(e.occurrence), d = (t == null ? void 0 : t.signature) === o && !t.partial ? t : {
    signature: o,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: l ? "" : s,
    candidates: l ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await xu(e, a),
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
    complete: !y && hi(h, g, u, n),
    ...y ? { partial: y } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: i.concurrency ?? 6 }, async () => {
        var y;
        for (; !m && !hi(h, g, u, n); ) {
          a.throwIfAborted();
          const q = h[g++], k = await hc(e, q.id, a);
          k > 0 && mc(u, { ...q, count: k }), (y = i.onProgress) == null || y.call(i, N(!0));
        }
      })
    );
  } catch (y) {
    throw m = !0, y;
  }
  return a.throwIfAborted(), N(!1);
}
function Du(e, t, n) {
  const a = e.candidates.findIndex((o) => o.id === t);
  if (e.partial || a < 0 || a >= e.cursor) return e;
  const i = e.ranked.filter((o) => o.id !== t);
  return n > 0 && mc(i, { ...e.candidates[a], count: n }), {
    ...e,
    ranked: i,
    complete: hi(e.candidates, e.cursor, i, e.limit)
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
function _u(e) {
  var l, d, h;
  const [t, n] = A({}), [a, i] = A(""), o = (((l = e == null ? void 0 : e.presentation) == null ? void 0 : l.annotations) ?? []).includes("tags") ? ((d = e == null ? void 0 : e.presentation) == null ? void 0 : d.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...o,
      ...((h = e == null ? void 0 : e.presentation) == null ? void 0 : h.binParents) ?? []
    ])
  ]);
  return J(() => {
    let u = !0;
    return n({}), i(""), Promise.all(
      JSON.parse(s).map(
        async (g) => [g, await Ta([g])]
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
function ju(e, t, n) {
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
function Uu({
  videos: e,
  review: t,
  savedObjectFilter: n,
  trees: a,
  disabled: i,
  onToggle: o
}) {
  var y;
  const s = ((y = t.presentation) == null ? void 0 : y.binParents) ?? [], l = new Set(
    s.flatMap((q) => (a[q] ?? []).filter((k) => k !== q))
  ), d = s.every((q) => a[q]), h = ea(t.view.objectFilter, n).bins.filter(
    (q) => !d || l.has(q)
  ), u = /* @__PURE__ */ new Map();
  for (const q of e)
    for (const k of q.tags ?? [])
      if (l.has(k.id)) {
        const b = u.get(k.id) ?? { name: k.name, count: 0 };
        b.count++, u.set(k.id, b);
      }
  const g = h.filter((q) => !u.has(q)), m = $r(g);
  for (const q of g)
    u.set(q, {
      name: m[q] === void 0 ? "…" : m[q] ?? "Unavailable tag",
      count: 0
    });
  if (!s.length) return null;
  const N = [...u].sort((q, k) => q[1].name.localeCompare(k[1].name));
  return /* @__PURE__ */ c("div", { className: "dq-bins", role: "group", "aria-label": "Tag bins on this page", children: [
    /* @__PURE__ */ r("span", { className: "dq-bins-label", "aria-hidden": "true", children: "On this page" }),
    N.map(([q, k]) => {
      const b = h.includes(q);
      return /* @__PURE__ */ c(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": b,
          title: b ? `Show every video again, not only ${k.name}` : `Show only videos tagged ${k.name}`,
          disabled: i,
          onClick: () => o(q),
          children: [
            b && /* @__PURE__ */ r(ka, { "aria-hidden": "true" }),
            k.name,
            " ",
            /* @__PURE__ */ r("span", { className: "dq-bin-count", children: k.count })
          ]
        },
        q
      );
    }),
    !N.length && /* @__PURE__ */ r("span", { className: "dq-bins-empty", children: "No matching tag bins on this page." })
  ] });
}
function sr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Gu(e) {
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
    const s = o.children, l = Gu(s.at(-1));
    if (l == null || s.length > 3) break;
    let d = {}, h = null, u = !0;
    for (const [g, m] of s.slice(0, -1).entries())
      !sr(m) || Object.keys(m).length !== 1 ? u = !1 : g === 0 && sr(m.filter) && Object.keys(m.filter).length ? d = m.filter : !h && sr(m.group) ? h = m.group : u = !1;
    if (!u) break;
    a.unshift(l), n = h ? { ...d, _filterExpression: h } : d;
  }
  return { base: n, bins: a };
}
function Ku(e, t, n) {
  const { base: a, bins: i } = ea(e.view.objectFilter, n);
  return (i.includes(t) ? i.filter((s) => s !== t) : [...i, t]).reduce(Bu, { ...e, view: { ...e.view, objectFilter: a } });
}
function Bu(e, t) {
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
const $a = [
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
], Vu = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function pr(e) {
  const t = Ce(e) ? e.occurrence : void 0;
  return {
    filter: Lt({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, Fe(e)),
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
function Po(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function mi(e, t) {
  let n;
  if (Ce(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!$a.some((l) => l !== "performer" && t.has(l))) {
    const l = pr(e);
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
  if (Ce(e) && (o = {
    ...Vu,
    ...Po(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(o.targetMode) || !Ei.includes(o.condition) || !Array.isArray(o.performerIds) || !Array.isArray(o.conditionTagIds) || typeof o.includeSubtags != "boolean" || typeof o.hideConfirmedAbsent != "boolean" || [...o.performerIds, ...o.conditionTagIds].some(
    (l) => !Number.isSafeInteger(l) || l <= 0
  ) || !o.performerFilter || typeof o.performerFilter != "object" || Array.isArray(o.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Lt(i, Fe(e)),
      objectFilter: Po(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: o,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
const xo = { dataQualityOpenedFromList: !0 };
function gc() {
  const e = window.history.state;
  return !!e && typeof e == "object" && e.dataQualityOpenedFromList === !0;
}
function bc(e, { openingFromList: t = !1 } = {}) {
  t ? window.history.pushState({ ...xo }, "", e) : window.history.replaceState(gc() ? { ...xo } : null, "", e);
}
function Ur(e, t) {
  const n = new URLSearchParams(window.location.search);
  $a.forEach((a) => n.delete(a)), n.set("review", e);
  for (const a of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[a] !== void 0 && n.set(a, String(t.filter[a]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((a) => `${a.key}:${a.direction}`).join(",")
  ), n.set("filters", JSON.stringify(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", JSON.stringify(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), bc(`${window.location.pathname}?${n}${window.location.hash}`);
}
function gn(e, t) {
  const n = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return Ce(e) ? {
    ...e,
    view: n,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: n };
}
function dr(e) {
  const t = e;
  return gn(t, pr(t));
}
function Lo(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !fr(
    JSON.parse(Bn(gn(e, t))),
    JSON.parse(Bn(gn(e, pr(e))))
  );
}
function wc(e, t) {
  if (De(e) !== "video") return e;
  const { base: n, bins: a } = ea(e.view.objectFilter, t.view.objectFilter);
  return a.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function ha(e, t) {
  if (De(e) !== "video") return t;
  const { base: n, bins: a } = ea(t.objectFilter, e.view.objectFilter);
  return a.length ? { ...t, objectFilter: n } : t;
}
function Do(e, t) {
  return !t || !Ce(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function za(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const a of e)
    n.set(a.media.id, [...n.get(a.media.id) ?? [], a]);
  return [...n.values()].reverse().flat();
}
const Yt = (e) => e instanceof Error ? e.message : "Request failed.", Qa = 50, Ju = [], _o = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function zu(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? nl(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? Xo(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function Qu({ media: e, kind: t }) {
  const [n, a] = A(!1);
  return /* @__PURE__ */ r("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ r(is, {}) : /* @__PURE__ */ r(Ca, {}) : /* @__PURE__ */ r(
    "img",
    {
      src: ri(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => a(!0)
    }
  ) });
}
function Wu({
  tags: e,
  preview: t,
  showPreview: n,
  trees: a,
  actionTagIds: i,
  label: o
}) {
  const s = _i(t), l = n ? s : null, d = e == null ? void 0 : e.absent, h = Li(
    ye(() => [...i, ...d ?? []], [i, d])
  ), u = (K) => h[K] ?? { id: K, name: h[K] === void 0 ? "…" : "Unavailable tag" }, g = (K) => lr(K.map(u)), m = l && e ? Mi(l, e, a) : null, N = e ? od(e) : [], y = new Set(N.map((K) => K.id)), q = new Set(m == null ? void 0 : m.removed), k = new Set(m == null ? void 0 : m.markedAbsent), b = new Set(m == null ? void 0 : m.absenceCleared), O = /* @__PURE__ */ c("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ r(ba, { "aria-hidden": "true" }),
    "absent"
  ] }), F = g((m == null ? void 0 : m.added) ?? []), G = g(((m == null ? void 0 : m.markedAbsent) ?? []).filter((K) => !y.has(K)));
  return /* @__PURE__ */ c("section", { className: "dq-panel-section", "aria-label": o, children: [
    /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ c(de, { children: [
      N.length || F.length || G.length ? /* @__PURE__ */ c("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        N.map(
          (K) => q.has(K.id) ? /* @__PURE__ */ c("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ c("del", { children: [
              "− ",
              /* @__PURE__ */ r(Xt, { tag: K })
            ] }),
            k.has(K.id) && O
          ] }, K.id) : /* @__PURE__ */ r("li", { className: "dq-tag", children: /* @__PURE__ */ r(Xt, { tag: K }) }, K.id)
        ),
        F.map((K) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ c("ins", { children: [
          "+ ",
          /* @__PURE__ */ r(Xt, { tag: K })
        ] }) }, `added-${K.id}`)),
        G.map((K) => /* @__PURE__ */ c("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ r("ins", { children: /* @__PURE__ */ r(Xt, { tag: K }) }),
          O
        ] }, `absent-${K.id}`))
      ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" }),
      e.absent.length > 0 && /* @__PURE__ */ c(de, { children: [
        /* @__PURE__ */ r("h4", { className: "dq-subheading", children: "Confirmed absent" }),
        /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: g(e.absent).map((K) => /* @__PURE__ */ c(
          "li",
          {
            className: `dq-tag dq-tag-absent${b.has(K.id) ? " dq-tag-removed" : ""}`,
            children: [
              /* @__PURE__ */ r(ba, { "aria-hidden": "true" }),
              b.has(K.id) ? /* @__PURE__ */ c("del", { children: [
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
function Hu({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: a,
  onSaveDefaults: i,
  editRequest: o = 0,
  onEditRequestHandled: s,
  pageControls: l,
  stayOnTap: d,
  onStayOnTapChange: h
}) {
  var aa;
  const u = Fe(e), g = bn(u), m = u === "audio" ? "Audio" : "Scene", N = (p) => {
    var S;
    return p.title || ((S = p.files[0]) == null ? void 0 : S.basename) || m;
  }, y = (p) => `${p.occurrence ? `${p.occurrence.performer.name} — ` : ""}${N(p.media)}`, q = R(null), k = R("");
  if (!q.current)
    try {
      q.current = mi(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (p) {
      k.current = Yt(p), q.current = { query: pr(e), startAtEnd: !1 };
    }
  const [b, O] = A(null), [F, G] = A(""), K = R(null), j = R(null), X = R(null), te = R(null), [ie, re] = A(!!k.current), _ = R(0), [B, v] = A(q.current.query), E = R(B);
  E.current = B;
  const [L, D] = A(0), W = R(q.current.startAtEnd), [Z, V] = A([]), [T, Ge] = A(null), Ae = R(null), [tt, U] = A(null), [ve, Ke] = A(0), qe = ye(() => {
    if (!T) return null;
    const p = Z.findIndex((S) => S.key === T.key);
    return p < 0 ? null : Z.slice(p + 1).find((S) => S.media.id !== T.media.id) ?? null;
  }, [T, Z]), [Qe, Te] = A(0), [Be, Zt] = A(!1), [Re, wn] = A(!1), le = R(!1), Ve = R(!0), Nt = R(null);
  J(() => (Ve.current = !0, () => {
    Ve.current = !1;
  }), []);
  const [dn, Ie] = A(k.current), [it, Se] = A(""), [ot, Dt] = A(null), [$e, yn] = A(!1), [st, Ot] = A([]), dt = R([]), _t = R(null), gt = R(null), Wn = R(null);
  J(() => {
    var p, S;
    $e && ((S = (p = Wn.current) == null ? void 0 : p.querySelector("input")) == null || S.focus());
  }, [$e]);
  const [Et, vn] = A(!1), [jt, It] = A(!1), un = Zr(), [me, qt] = A(!1), nt = d ?? me, On = h ?? qt;
  J(() => {
    if (Be || Et || !gt.current) return;
    const p = requestAnimationFrame(() => {
      if (document.querySelector(_o)) return;
      const S = gt.current;
      gt.current = null;
      const P = document.activeElement;
      P && P !== document.body || S != null && S.isConnected && !S.disabled && S.focus();
    });
    return () => cancelAnimationFrame(p);
  }, [Be, Et, L]);
  const [Ut, _e] = A([]), [kt, ee] = A({}), I = R(null), we = R(0), [ut, In] = A({});
  J(() => {
    let p = !0;
    return Promise.all(
      Bi(B.objectFilter).map(
        async (S) => [
          String(S),
          (await ce(`/api/tags/${S}`)).name
        ]
      )
    ).then((S) => {
      p && In(Object.fromEntries(S));
    }).catch(() => {
    }), () => {
      p = !1;
    };
  }, [B.objectFilter]);
  const se = ye(
    () => Vi(B.objectFilter, ut),
    [ut, B.objectFilter]
  ), Ct = R(0), Ye = R(e);
  Ye.current = e;
  const Pe = b ?? e, Xe = ye(
    () => gn(Pe, B),
    [Pe, B]
  ), Gt = ye(
    () => Do(Xe, B.performerFocus),
    [Xe, B.performerFocus]
  ), Ze = R(Gt);
  Ze.current = Gt;
  const bt = R(Xe);
  bt.current = Xe;
  const [Mt, en] = A("items"), [ct, mr] = A(null), Kt = R(null), Mn = R("");
  function C(p) {
    const S = typeof p == "function" ? p(Kt.current) : p;
    Kt.current = S, mr(S);
  }
  const [M, ne] = A(!1), [Y, Ee] = A(null), be = R(null), xe = Ce(Xe) ? ga(Xe) : "", [je, At] = A(0), [Ne, tn] = A(null);
  J(() => () => {
    var p;
    return (p = be.current) == null ? void 0 : p.controller.abort();
  }, []), J(() => {
    const p = be.current;
    !p || p.signature === xe || (p.controller.abort(), be.current = null, ne(!1));
  }, [xe]), J(() => {
    var P;
    const p = Kt.current;
    if (Mt !== "performers" || !xe || ((P = be.current) == null ? void 0 : P.signature) === xe || Mn.current === xe || (p == null ? void 0 : p.signature) === xe && p.complete)
      return;
    const S = (p == null ? void 0 : p.signature) === xe ? p : null;
    Jt(p, (S == null ? void 0 : S.limit) ?? Qa);
  }, [Mt, xe, ct, Y, M]);
  const ue = B.performerFocus, Nn = JSON.stringify(
    Ce(Xe) ? Xe.occurrence.flagPerformerTagIds ?? [] : []
  );
  J(() => {
    if (!ue) {
      tn(null);
      return;
    }
    let p = !0;
    const S = new Set(JSON.parse(Nn));
    return ce(
      `/api/performers/${ue}`
    ).then((P) => {
      p && tn({
        id: ue,
        name: P.name,
        flags: (P.tags ?? []).filter((z) => S.has(z.id)).map((z) => z.name)
      });
    }).catch(() => {
    }), () => {
      p = !1;
    };
  }, [ue, Nn]);
  const We = Lo(e, B), Hn = Lo(e, ha(e, B)), wt = Re || Be || $e, qn = Number(B.filter.page);
  function Tt(p, S = !1) {
    le.current || (k.current = "", W.current = S, E.current = p, v(p), Te(0), Zt(!0), S || Ur(e.id, p), D((P) => P + 1));
  }
  function Fn() {
    if (le.current = !1, wn(!1), Ve.current && Nt.current) {
      const p = Nt.current;
      Nt.current = null, Tt(p.query, p.startAtEnd);
    }
  }
  J(() => {
    const p = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const S = mi(
            Ye.current,
            new URLSearchParams(window.location.search)
          );
          le.current ? Nt.current = S : Tt(S.query, S.startAtEnd);
        } catch (S) {
          Ie(Yt(S));
        }
    };
    return window.addEventListener("popstate", p), () => window.removeEventListener("popstate", p);
  }, [e.id]), J(() => (a(Re || Be || $e || !!b), () => a(!1)), [Re, Be, $e, !!b, a]);
  async function lt(p, S, P) {
    if (Ce(p)) {
      const ae = await ic(
        p,
        I.current,
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
    const z = await jr(
      p,
      { ...p.view.filter, page: S },
      P
    );
    return {
      items: z.items.map((ae) => ({ key: String(ae.id), media: ae })),
      totalCount: z.totalCount
    };
  }
  function Ft(p, S, P, z = !1, ae = !1) {
    if (!Ve.current || Nt.current) return;
    re(!0), V(
      ae ? p.items : za(p.items, E.current.startFrom === "end")
    ), Te(p.totalCount), fn(P, z);
    const fe = {
      ...E.current,
      filter: { ...E.current.filter, page: S }
    };
    E.current = fe, v(fe), Ur(e.id, fe);
  }
  function fn(p, S = !1) {
    (p == null ? void 0 : p.key) !== (T == null ? void 0 : T.key) && (Ae.current = null), (p == null ? void 0 : p.media.id) !== (T == null ? void 0 : T.media.id) && U(S && p ? p.media.id : null), Ge(p);
  }
  J(() => {
    if (k.current) return;
    const p = new AbortController();
    te.current = p;
    const S = ++Ct.current;
    return Zt(!0), Ie(""), Se(""), Ae.current = null, U(null), Ge(null), V([]), yn(!1), (async () => {
      const P = Do(
        gn(Ye.current, E.current),
        E.current.performerFocus
      );
      I.current = Ce(P) ? await Ji(P, p.signal) : null;
      let z = Number(P.view.filter.page), ae = await lt(P, z, p.signal);
      const fe = Math.max(
        1,
        Math.ceil(ae.totalCount / Number(P.view.filter.perPage))
      );
      (W.current || z > fe) && (z = fe, ae = await lt(P, z, p.signal)), W.current = !1;
      const ke = P.view.startFrom === "end" ? -1 : 1;
      for (; Ce(P) && !ae.items.length && z + ke >= 1 && z + ke <= fe && !p.signal.aborted; )
        z += ke, ae = await lt(P, z, p.signal);
      if (S !== Ct.current || p.signal.aborted) return;
      const ht = za(ae.items, P.view.startFrom === "end");
      Ft(ae, z, ht[0] ?? null);
    })().catch((P) => {
      !p.signal.aborted && S === Ct.current && Ie(Yt(P));
    }).finally(() => {
      !p.signal.aborted && S === Ct.current && (re(!0), Zt(!1));
    }), () => {
      p.abort(), Ct.current++;
    };
  }, [L, e.id]), J(() => {
    if (Dt(null), !T) return;
    let p = !0;
    return cn(u, T).then((S) => {
      p && (Dt(S), _e(
        Ce(e) ? S.ids.filter((P) => e.occurrence.tagIds.includes(P)) : []
      ));
    }).catch((S) => {
      p && Ie(`Could not load current tags. ${Yt(S)}`);
    }), () => {
      p = !1;
    };
  }, [T]), J(() => {
    if (!Ce(e) || e.actions.length)
      return;
    let p = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (S) => [
          S,
          (await ce(`/api/tags/${S}`)).name
        ]
      )
    ).then((S) => {
      p && ee(Object.fromEntries(S));
    }).catch((S) => {
      p && Ie(Yt(S));
    }), () => {
      p = !1;
    };
  }, [e]);
  async function pn(p = !1, S = !1, P = !1) {
    var Rt;
    if (!T) return;
    const z = Z.findIndex((Ue) => Ue.key === T.key), ae = B.startFrom === "end" ? -1 : 1, fe = ((Rt = Ae.current) == null ? void 0 : Rt.key) === T.key ? Ae.current : { key: T.key, page: qn, before: Z.slice(0, z + 1).map((Ue) => Ue.key), after: Z.slice(z + 1).map((Ue) => Ue.key) }, ke = new Set(fe.after), ht = new Set(fe.before), Wt = Z.find((Ue) => {
      var rn;
      return ke.has(Ue.key) || (ae === 1 || qn < fe.page) && ((rn = Ae.current) == null ? void 0 : rn.key) === T.key && !ht.has(Ue.key);
    });
    if (!p && Wt) {
      fn(Wt, P);
      return;
    }
    const Pt = p ? ht : new Set(Z.map((Ue) => Ue.key)), et = 1100 - (Date.now() - we.current);
    et > 0 && await new Promise((Ue) => window.setTimeout(Ue, et));
    let Me = ae === -1 && !p ? Math.max(1, qn - 1) : qn;
    for (; Ve.current && !Nt.current; ) {
      let Ue = await lt(Gt, Me);
      const rn = Math.max(
        1,
        Math.ceil(Ue.totalCount / Number(B.filter.perPage))
      );
      Me > rn && (Me = rn, Ue = await lt(Gt, Me));
      const yr = za(Ue.items, ae === -1), Oa = new Map(yr.map((pe) => [pe.key, pe])), Pr = p ? fe.after.flatMap((pe) => {
        const ia = Oa.get(pe);
        return ia ? [ia] : [];
      }) : [], xr = new Set(Pr.map((pe) => pe.key)), jn = p ? {
        ...Ue,
        items: [
          ...Pr,
          ...yr.filter(
            (pe) => pe.key !== T.key && !xr.has(pe.key)
          )
        ]
      } : Ue;
      if (S) {
        Ae.current = fe, Ft(jn, Me, T, !1, p);
        return;
      }
      const an = ae === -1 && qn === 1 && !p ? void 0 : jn.items.find(
        (pe) => !Pt.has(pe.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(p && ae === -1 && Me === fe.page) || ke.has(pe.key))
      );
      if (an || (ae === -1 ? Me <= 1 : Me >= rn)) {
        Ft(
          jn,
          Me,
          an ?? null,
          P,
          p
        ), an || Se(
          Ue.totalCount ? `Reached the end in this direction. Matching items remain available from the ${g.queue} pages.` : `No matching ${g.many}.`
        );
        return;
      }
      Me += ae;
    }
  }
  async function Bt(p, S = !1, P = !1, z = !1) {
    if (b || !T || le.current || Be || $e && !P)
      return;
    const ae = P || z || !!(p != null && p.steps.length);
    if (ae && (!t || !ot) || p && zn(p) && !n) return;
    const fe = !S && !P && !z && ae && p !== void 0 && ot !== null && yo(e) && oi(ii(e.actions, cd(p, ot, Pn))).length > 0;
    le.current = !0, wn(!0), Ie(""), Se("");
    const ke = Z.findIndex((et) => et.key === T.key), ht = ae && !S && !fe && ke >= 0 ? Z[ke + 1] ?? null : null;
    ht && (V(
      (et) => et.filter((Me) => Me.key !== T.key)
    ), fn(ht, !0));
    let Wt = !1, Pt = [];
    try {
      if (ae) {
        const et = await cn(u, T);
        if (p)
          await du(Gt, T, p);
        else {
          const Rt = z && Ce(e) ? e.occurrence.tagIds.filter((yr) => et.ids.includes(yr)) : dt.current, rn = Ar(Rt, z ? Ut : st);
          await Wi(Gt, T, rn);
        }
        we.current = Date.now();
        const Me = await cn(u, T);
        ht || Dt(Me), Wt = !0, yn(!1), fe && (Pt = oi(ii(e.actions, Me))), Se(
          Pt.length ? `Tags saved. Staying until answered: ${Pt.map((Rt) => Rt.name).join(", ")}.` : "Tags saved."
        ), T.occurrence && (Xn(T.occurrence.performer.id), At((Rt) => Rt + 1));
      }
      if (!Ve.current || Nt.current) return;
      ae ? Pt.length || await pn(!0, S, !S) : S || await pn(), S && P && requestAnimationFrame(() => {
        var et;
        return (et = _t.current) == null ? void 0 : et.focus();
      });
    } catch (et) {
      if (Ie(
        Wt ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${Yt(et)}` : ae ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${Yt(et)}` : `Could not advance. ${Yt(et)}`
      ), ae && !Wt) {
        ht && (V(Z), U(null), Ke((Me) => Me + 1), Ge(T)), we.current = Date.now();
        try {
          Dt(await cn(u, T));
        } catch {
          Dt(null), Ie(
            (Me) => `${Me} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      Fn();
    }
  }
  const ft = !$e && !b && !Et && !jt && (T != null || Be || Re);
  Fi({
    surface: "local",
    enabled: ft,
    actions: e.actions,
    onAction: (p, S) => {
      const P = e.actions[p];
      P && Bt(P, S);
    },
    onFind: () => It(!0)
  });
  const pt = (p) => Re || Be || !ot || !!b || !t && p.steps.length > 0 || !n && zn(p);
  function St() {
    !i || b || le.current || $e || (X.current = document.activeElement, j.current = {
      error: dn,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(E.current),
      items: Z,
      current: T,
      total: Qe,
      targets: I.current,
      stayedCursor: Ae.current
    }, O(structuredClone(e)), G(""), Se(""), Ie(""));
  }
  J(() => {
    if (!o) {
      _.current = 0;
      return;
    }
    o !== _.current && ie && !Be && (_.current = o, St(), s == null || s());
  }, [o, Be, ie]);
  function yt() {
    O(null), G(""), requestAnimationFrame(() => {
      const p = X.current;
      p != null && p.isConnected && p !== document.body && p.focus();
    });
  }
  function Sn() {
    var S;
    const p = j.current;
    !p || Re || ((S = te.current) == null || S.abort(), Ct.current++, E.current = p.query, v(p.query), V(p.items), Ge(p.current), Te(p.total), I.current = p.targets, Ae.current = p.stayedCursor, Zt(!1), Ie(p.error), Se(""), window.history.replaceState(window.history.state, "", p.url), yt());
  }
  async function Vt() {
    if (!b || !i || le.current) return;
    const p = gn(
      { ...b, name: b.name.trim() },
      ha(Ye.current, E.current)
    ), S = Vr(p);
    if (S) {
      G(S);
      return;
    }
    le.current = !0, wn(!0), G("");
    try {
      if (await i(p) === !1) throw new Error("Could not save review.");
      yt(), Se("Review saved.");
    } catch (P) {
      G(
        "Could not save review. Your edits are still open. " + Yt(P)
      );
    } finally {
      Fn();
    }
  }
  async function ta() {
    if (!i || le.current) return;
    const p = ha(Ye.current, E.current), S = gn(Ye.current, {
      ...p,
      filter: { ...p.filter, page: 1 }
    });
    le.current = !0, wn(!0), Ie("");
    try {
      if (await i(S) === !1) throw new Error("Could not save review.");
      Se("Queue saved to this review.");
    } catch (P) {
      Ie("Could not save queue. " + Yt(P));
    } finally {
      Fn();
    }
  }
  const rt = B.performerScope, nn = (p) => {
    const { performerFocus: S, ...P } = E.current, z = S && !("targetMode" in p || "performerIds" in p || "performerFilter" in p);
    Tt({
      ...P,
      ...z ? { performerFocus: S } : {},
      filter: { ...P.filter, page: 1 },
      performerScope: { ...rt, ...p }
    });
  };
  async function Jt(p, S) {
    var ae;
    const P = bt.current;
    if (!Ce(P)) return;
    (ae = be.current) == null || ae.controller.abort();
    const z = {
      signature: ga(P),
      controller: new AbortController()
    };
    be.current = z, Mn.current = "", ne(!0), Ee(null);
    try {
      const fe = await Lu(P, p, S, z.controller.signal, {
        onProgress: (ke) => {
          be.current === z && C(ke);
        }
      });
      be.current === z && C(fe);
    } catch (fe) {
      be.current === z && !z.controller.signal.aborted && (Mn.current = z.signature, Ee({ signature: z.signature, message: Yt(fe) }));
    } finally {
      be.current === z && (be.current = null, ne(!1));
    }
  }
  function Yn() {
    var p;
    (p = be.current) == null || p.controller.abort(), be.current = null, ne(!1), C((S) => S && { ...S, partial: !0, complete: !1 });
  }
  async function Xn(p) {
    var ae;
    const S = bt.current;
    if (!Ce(S)) return;
    if (be.current) {
      Yn();
      return;
    }
    const P = ga(S);
    if (((ae = Kt.current) == null ? void 0 : ae.signature) !== P || Kt.current.partial) return;
    const z = 1100 - (Date.now() - we.current);
    z > 0 && await new Promise((fe) => window.setTimeout(fe, z));
    try {
      const fe = await hc(S, p);
      if (be.current) {
        Yn();
        return;
      }
      C(
        (ke) => (ke == null ? void 0 : ke.signature) === P ? Du(ke, p, fe) : ke
      );
    } catch {
      C(
        (fe) => (fe == null ? void 0 : fe.signature) === P ? { ...fe, partial: !0, complete: !1 } : fe
      );
    }
  }
  const na = B.performerFocus ? ct == null ? void 0 : ct.candidates.find((p) => p.id === B.performerFocus) : void 0, oe = (Ne == null ? void 0 : Ne.id) === B.performerFocus ? Ne : na ?? null;
  function gr(p) {
    if (le.current) return;
    const S = {
      ...E.current,
      performerFocus: p,
      filter: { ...E.current.filter, page: 1 }
    };
    Tt(S, S.startFrom === "end"), en("items");
  }
  function Zn() {
    const { performerFocus: p, ...S } = E.current;
    Tt(
      { ...S, filter: { ...S.filter, page: 1 } },
      S.startFrom === "end"
    );
  }
  const er = R(null);
  er.current ?? (er.current = Ds());
  const En = er.current, Pn = Ts(Pe.actions), Or = ye(
    () => Pe.actions.flatMap((p) => p.steps.flatMap((S) => S.tagIds)),
    [Pe.actions]
  ), xn = R(null);
  J(() => {
    const p = xn.current, S = p == null ? void 0 : p.querySelector('[aria-current="true"]');
    if (!p || !S) return;
    const P = p.getBoundingClientRect(), z = S.getBoundingClientRect();
    z.top < P.top ? p.scrollTop -= P.top - z.top : z.bottom > P.bottom && (p.scrollTop += z.bottom - P.bottom);
  }, [T == null ? void 0 : T.key, Mt]);
  const zt = R(null), tr = R(null);
  J(() => {
    var P, z;
    const p = tr.current;
    if (!p) return;
    tr.current = null;
    const S = [...((P = zt.current) == null ? void 0 : P.querySelectorAll(".dq-partner")) ?? []];
    (z = S.find((ae) => ae.dataset.partnerKey === p) ?? S[0]) == null || z.focus();
  }, [T == null ? void 0 : T.key]);
  const Qt = Re || Be || $e || !!b, Oe = ye(
    () => b ? gn(b, ha(e, B)) : null,
    [b, e, B]
  ), Ir = ye(
    () => Oe != null && kr(dr(Oe)) !== kr(dr(e)),
    [Oe, e]
  );
  function ra() {
    T ? cn(u, T).then(Dt).catch((p) => Ie(Yt(p))) : Tt(E.current);
  }
  const Ln = dn ? /* @__PURE__ */ c("p", { role: "alert", children: [
    dn,
    " ",
    /* @__PURE__ */ r("button", { type: "button", disabled: Re, onClick: ra, children: T ? "Reload tags" : "Retry queue" })
  ] }) : null, nr = Re || Be || T != null && !ot, br = Math.max(1, Number(B.filter.perPage) || 1), wr = R(1);
  Be || (wr.current = Math.max(1, Math.ceil(Qe / br)));
  const Mr = wr.current, Dn = rt && T ? Z.filter(
    (p) => p.media.id === T.media.id && p.key !== T.key
  ) : [], Fr = T != null && T.occurrence && T.occurrence.performer.id === B.performerFocus ? (oe == null ? void 0 : oe.flags) ?? [] : T != null && T.occurrence ? ((aa = ct == null ? void 0 : ct.candidates.find((p) => p.id === T.occurrence.performer.id)) == null ? void 0 : aa.flags) ?? [] : [], rr = (p) => {
    var S;
    return p.title || ((S = p.files[0]) == null ? void 0 : S.basename) || `${u === "audio" ? "Audio" : "Video"} ${p.id}`;
  }, _n = T ? zu(T.media, u) : "";
  return /* @__PURE__ */ c(
    "section",
    {
      className: `dq-review-workspace${u === "audio" ? " dq-audio" : ""}`,
      "aria-label": rt ? u === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : u === "audio" ? "Audio review" : "Video review",
      onClickCapture: (p) => {
        var z;
        const S = p.target instanceof Element ? p.target.closest("button") : null, P = (S == null ? void 0 : S.getAttribute("aria-label")) ?? ((z = S == null ? void 0 : S.textContent) == null ? void 0 : z.trim()) ?? "";
        S && !S.closest(_o) && /^(Filters|Edit filter:|Edit criteria)/.test(P) && (gt.current = S);
      },
      children: [
        /* @__PURE__ */ r(
          Zs,
          {
            name: e.name,
            description: e.description,
            entityType: De(e),
            onBack: l == null ? void 0 : l.onBack,
            backDisabled: Qt || !!(l != null && l.busy),
            onEdit: b ? () => {
              var p;
              return (p = K.current) == null ? void 0 : p.focus();
            } : St,
            editDisabled: !b && (Qt || !i || !!(l != null && l.busy)),
            editing: !!b,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ c("fieldset", { className: "dq-review-toolbar", disabled: Re || $e, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: u === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ r(
                  Gr,
                  {
                    filter: B.filter,
                    objectFilter: se,
                    criteriaDefinitions: u === "audio" ? Wo : yi,
                    customFieldEntityType: u,
                    totalCount: Qe,
                    sortOptions: u === "audio" ? Zc : Ho,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(
                      ec,
                      {
                        page: Math.min(Math.max(1, qn || 1), Mr),
                        pages: Mr,
                        onPage: (p) => Tt({
                          ...E.current,
                          filter: Lt(
                            { ...E.current.filter, page: p },
                            u
                          )
                        })
                      }
                    ),
                    onFilterChange: (p) => {
                      (p.sort !== E.current.filter.sort || p.direction !== E.current.filter.direction) && (p = { ...p, sorts: void 0 }), Tt({
                        ...E.current,
                        filter: Lt(p, u)
                      });
                    },
                    onObjectFilterChange: (p) => {
                      Tt({
                        ...E.current,
                        objectFilter: nc(
                          p,
                          ut,
                          E.current.objectFilter
                        ),
                        filter: { ...E.current.filter, page: 1 }
                      });
                    }
                  }
                )
              ] })
            ),
            trailing: /* @__PURE__ */ c(de, { children: [
              rt && /* @__PURE__ */ r(
                Fu,
                {
                  scope: rt,
                  disabled: Re || $e,
                  editing: !!b,
                  onChange: nn,
                  onEditCriteria: () => vn(!0)
                }
              ),
              Ce(Gt) && t && /* @__PURE__ */ r(
                Cu,
                {
                  review: Gt,
                  disabled: wt || !!b,
                  performerFlags: B.performerFocus ? oe == null ? void 0 : oe.flags : void 0,
                  trees: Pn,
                  onOpen: () => {
                    le.current = !0, wn(!0);
                  },
                  onWrite: () => {
                    we.current = Date.now();
                  },
                  onClose: (p) => {
                    if (p) {
                      we.current = Date.now();
                      const S = E.current.performerFocus;
                      S ? Xn(S) : Yn(), At((P) => P + 1), new Promise((P) => window.setTimeout(P, 1100)).then(() => {
                        Fn(), Ve.current && (k.current || Zt(!0), D((P) => P + 1));
                      });
                    } else Fn();
                  }
                }
              ),
              (l == null ? void 0 : l.onGrid) && /* @__PURE__ */ r(
                tc,
                {
                  mode: "single",
                  disabled: Qt || !!l.busy,
                  onChange: () => {
                    var p;
                    return (p = l.onGrid) == null ? void 0 : p.call(l);
                  }
                }
              ),
              (l == null ? void 0 : l.moreItems) && /* @__PURE__ */ r(
                Ui,
                {
                  disabled: Qt,
                  items: l.moreItems({
                    onSelect: St,
                    disabled: !i
                  })
                }
              )
            ] }),
            chipsStart: B.performerFocus ? /* @__PURE__ */ c("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ r(
                Er,
                {
                  performer: {
                    id: B.performerFocus,
                    name: (oe == null ? void 0 : oe.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ c("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ r("strong", { children: (oe == null ? void 0 : oe.name) ?? `performer ${B.performerFocus}` })
              ] }),
              oe != null && oe.flags.length ? /* @__PURE__ */ c(
                "span",
                {
                  className: "dq-focus-flag",
                  title: `Flagged: ${oe.flags.join(", ")}`,
                  children: [
                    /* @__PURE__ */ r(wa, { "aria-hidden": "true" }),
                    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
                      "Flagged: ",
                      oe.flags.join(", ")
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
                  onClick: Zn,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            chipsEnd: b ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : We ? /* @__PURE__ */ c(de, { children: [
              /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Queue differs from the saved review" }),
              Hn && /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: "dq-text-button",
                  title: "Save the current queue criteria to this review",
                  disabled: wt || !i,
                  onClick: () => void ta(),
                  children: [
                    /* @__PURE__ */ r(ss, { "aria-hidden": "true" }),
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
                    const p = pr(e);
                    Tt(p, p.startFrom === "end");
                  },
                  children: [
                    /* @__PURE__ */ r(cs, { "aria-hidden": "true" }),
                    "Reset"
                  ]
                }
              )
            ] }) : void 0
          }
        ),
        l == null ? void 0 : l.notices,
        /* @__PURE__ */ c("div", { className: "dq-review-area", children: [
          b && Oe && /* @__PURE__ */ r(
            Xs,
            {
              drawerRef: K,
              draft: Oe,
              onChange: (p) => O(p),
              direction: B.startFrom,
              onDirectionChange: (p) => Tt({ ...E.current, startFrom: p }),
              tagGroups: Ju,
              trees: Pn,
              saving: Re,
              saveDisabled: Be,
              error: F,
              dirty: Ir,
              criteriaChanged: Hn,
              notices: Ln && /* @__PURE__ */ r("div", { className: "dq-review-feedback", children: Ln }),
              onSave: () => void Vt(),
              onCancel: Sn
            }
          ),
          /* @__PURE__ */ r("div", { className: "dq-review-main", children: /* @__PURE__ */ c("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ c("div", { className: "dq-review-stage", children: [
              T ? /* @__PURE__ */ c(de, { children: [
                /* @__PURE__ */ c("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ r("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ c(
                    "a",
                    {
                      href: `/${u}/${T.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${g.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ r("span", { children: rr(T.media) }),
                        /* @__PURE__ */ r(ls, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  _n && /* @__PURE__ */ r("span", { className: "dq-stage-meta", children: _n })
                ] }),
                /* @__PURE__ */ c("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ r("div", { className: "dq-player-frame", children: [T, qe].filter(Boolean).map((p) => {
                    var z, ae, fe, ke, ht;
                    const S = p, P = S.key === T.key;
                    return /* @__PURE__ */ r(
                      "div",
                      {
                        className: P ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": P ? void 0 : !0,
                        inert: P ? void 0 : !0,
                        children: u === "audio" ? /* @__PURE__ */ r(
                          el,
                          {
                            streamUrl: ai("audio", S.media.id),
                            format: ((z = S.media.files[0]) == null ? void 0 : z.format) ?? "",
                            title: N(S.media),
                            coverUrl: P ? ri("audio", S.media) : void 0,
                            duration: ((ae = S.media.files[0]) == null ? void 0 : ae.duration) ?? 0,
                            autostart: P && tt === S.media.id
                          }
                        ) : /* @__PURE__ */ r(
                          Yo,
                          {
                            videoId: S.media.id,
                            streamUrl: ai("video", S.media.id),
                            posterUrl: P ? ri("video", S.media) : void 0,
                            duration: ((fe = S.media.files[0]) == null ? void 0 : fe.duration) ?? 0,
                            format: (ke = S.media.files[0]) == null ? void 0 : ke.format,
                            audioCodec: (ht = S.media.files[0]) == null ? void 0 : ht.audioCodec,
                            extensionSurface: P ? "quick-view" : void 0,
                            autostart: P && tt === S.media.id,
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
                      `${S.media.id}:${ve}`
                    );
                  }) }),
                  u === "audio" && /* @__PURE__ */ r(
                    Tu,
                    {
                      details: T.media.details,
                      label: g.one
                    },
                    T.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ r("p", { role: "status", className: "dq-stage-status", children: Be ? "Loading review…" : Qe ? "Reached the end in this direction." : `No matching ${g.many}.` }),
              Pe.actions.length > 0 ? /* @__PURE__ */ r(
                Nd,
                {
                  actions: Pe.actions,
                  mediaKind: u,
                  isDisabled: (p) => $e || pt(p),
                  busy: nr,
                  tags: ot,
                  trees: Pn,
                  preview: En,
                  onApply: (p, S) => void Bt(p, S),
                  onFind: () => It(!0),
                  findDisabled: $e || !!b,
                  paused: !!b,
                  waitForGroups: yo(Pe),
                  stayOnTap: nt,
                  onStayOnTapChange: On
                }
              ) : Ce(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ c(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || Re || $e || !ot || !!b || !T,
                  children: [
                    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((p) => /* @__PURE__ */ c("label", { children: [
                      /* @__PURE__ */ r(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: Ut.includes(p),
                          onChange: (S) => _e(
                            e.occurrence.multiple ? S.target.checked ? [...Ut, p] : Ut.filter((P) => P !== p) : [p]
                          )
                        }
                      ),
                      kt[p] ?? "Loading tag…"
                    ] }, p)),
                    /* @__PURE__ */ c("div", { className: "dq-row", children: [
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => _e([]),
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
            /* @__PURE__ */ c("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ c("div", { className: "dq-panel-body", ref: zt, children: [
                T && /* @__PURE__ */ c(de, { children: [
                  /* @__PURE__ */ c("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ c("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: T.occurrence ? T.occurrence.performer.name : `this ${g.one}` })
                    ] }),
                    /* @__PURE__ */ c("div", { className: "dq-reviewing-who", children: [
                      T.occurrence && /* @__PURE__ */ r(Er, { performer: T.occurrence.performer }),
                      /* @__PURE__ */ c("div", { children: [
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: T.occurrence ? T.occurrence.performer.name : `This ${g.one}` }),
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-note", children: rt ? `Tags apply to this performer in this ${g.queue}` : `Tags apply to the whole ${g.one}` })
                      ] })
                    ] }),
                    Fr.length > 0 && /* @__PURE__ */ c("p", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
                      /* @__PURE__ */ r(wa, { "aria-hidden": "true" }),
                      "Flagged: ",
                      Fr.join(", ")
                    ] })
                  ] }),
                  Dn.length > 0 && /* @__PURE__ */ c(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${g.queue}`,
                      children: [
                        /* @__PURE__ */ c("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          g.queue
                        ] }),
                        /* @__PURE__ */ r("div", { className: "dq-partners", children: Dn.map((p) => {
                          var S, P, z;
                          return /* @__PURE__ */ c(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (S = p.occurrence) == null ? void 0 : S.performer.name,
                              "aria-label": (P = p.occurrence) == null ? void 0 : P.performer.name,
                              "data-partner-key": p.key,
                              disabled: wt,
                              onClick: () => {
                                tr.current = T.key, fn(p), Ie("");
                              },
                              children: [
                                p.occurrence && /* @__PURE__ */ r(Er, { performer: p.occurrence.performer }),
                                /* @__PURE__ */ r("span", { children: (z = p.occurrence) == null ? void 0 : z.performer.name })
                              ]
                            },
                            p.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ r(
                    Wu,
                    {
                      tags: ot,
                      preview: En,
                      showPreview: !$e,
                      trees: Pn,
                      actionTagIds: Or,
                      label: `Current ${rt ? "occurrence" : g.one} tags`
                    }
                  ),
                  $e && /* @__PURE__ */ c(
                    "fieldset",
                    {
                      ref: Wn,
                      disabled: Re,
                      className: "dq-panel-section dq-tag-editor",
                      children: [
                        /* @__PURE__ */ c("legend", { className: "dq-eyebrow", children: [
                          "Edit ",
                          rt ? "occurrence" : g.one,
                          " tags"
                        ] }),
                        /* @__PURE__ */ r(
                          Tn,
                          {
                            entityType: "tag",
                            values: st,
                            onChange: Ot,
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
                Ce(Xe) && B.performerFocus && /* @__PURE__ */ r(
                  vu,
                  {
                    review: Xe,
                    performerId: B.performerFocus,
                    revision: je
                  }
                )
              ] }),
              /* @__PURE__ */ c("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ c("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !b && Ln,
                  it && /* @__PURE__ */ r("p", { role: "status", children: it })
                ] }),
                !t && /* @__PURE__ */ r("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                T && /* @__PURE__ */ c("div", { className: "dq-panel-actions", "aria-busy": nr || void 0, children: [
                  /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      ref: _t,
                      className: "dq-button",
                      disabled: wt || !!b || !t || !ot,
                      onClick: () => {
                        dt.current = [...ot.ids], Ot([...ot.ids]), yn(!0);
                      },
                      children: [
                        /* @__PURE__ */ r(as, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: wt || !!b,
                      onClick: () => void Bt(),
                      children: [
                        /* @__PURE__ */ r(pl, { "aria-hidden": "true" }),
                        "Skip",
                        rt ? " performer" : ` ${g.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              rt && /* @__PURE__ */ c(
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
                        onClick: () => en("items"),
                        children: u === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": Mt === "performers",
                        onClick: () => en("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              rt && Mt === "performers" ? /* @__PURE__ */ r(
                Ru,
                {
                  ranking: (ct == null ? void 0 : ct.signature) === xe ? ct : null,
                  busy: M,
                  error: (Y == null ? void 0 : Y.signature) === xe ? Y.message : "",
                  focus: B.performerFocus,
                  disabled: wt,
                  labels: g,
                  onFocus: gr,
                  onMore: () => {
                    const p = Kt.current;
                    p && Jt(p, p.limit + Qa);
                  },
                  onRefresh: () => {
                    C(null), Jt(null, Qa);
                  }
                }
              ) : /* @__PURE__ */ r("div", { className: "dq-queue-list", ref: xn, children: Z.map((p) => {
                var P;
                const S = (T == null ? void 0 : T.key) === p.key;
                return /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: y(p),
                    "aria-label": y(p),
                    "aria-current": S ? "true" : void 0,
                    disabled: wt,
                    onClick: () => {
                      fn(p), Ie(""), Se("");
                    },
                    children: [
                      /* @__PURE__ */ r(Qu, { media: p.media, kind: u }),
                      /* @__PURE__ */ c("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: N(p.media) }),
                        /* @__PURE__ */ c("span", { className: "dq-queue-row-meta", children: [
                          p.occurrence && /* @__PURE__ */ c(de, { children: [
                            /* @__PURE__ */ r(Er, { performer: p.occurrence.performer }),
                            /* @__PURE__ */ r("span", { className: "dq-queue-row-performer", children: p.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ r("span", { className: "dq-queue-row-detail", children: [
                            p.media.date,
                            p.occurrence ? "" : (P = p.media.files[0]) != null && P.duration ? Xo(p.media.files[0].duration) : ""
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
          tl,
          {
            open: Et,
            onClose: () => vn(!1),
            criteria: wi,
            activeFilter: rt.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (p) => {
              vn(!1), nn({ performerFilter: p });
            }
          }
        ),
        jt && /* @__PURE__ */ r(
          Di,
          {
            actions: e.actions,
            trees: Pn,
            isDisabled: (p) => pt(p),
            tapStays: un && nt,
            onApply: (p, S) => {
              It(!1), Bt(p, S);
            },
            onClose: () => It(!1)
          }
        )
      ]
    }
  );
}
const yc = "data-quality.reviews-sort.v1", Yu = { sort: "name", direction: "asc" };
function Xu() {
  try {
    const e = JSON.parse(localStorage.getItem(yc) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return Yu;
}
function Zu(e) {
  try {
    localStorage.setItem(
      yc,
      JSON.stringify({ sort: e.sort, direction: e.direction })
    );
  } catch {
  }
}
function vc(e, t, n, a) {
  const i = a === "asc" ? 1 : -1;
  return [...e].sort((o, s) => {
    if (n === "count") {
      const l = t[o.id], d = t[s.id], h = typeof l == "number", u = typeof d == "number";
      if (h !== u) return h ? -1 : 1;
      if (h && u && l !== d)
        return (l - d) * i;
    }
    return o.name.localeCompare(s.name, void 0, { numeric: !0, sensitivity: "base" }) * i;
  });
}
function Wa(e, t) {
  const n = De(e), a = bn(Ci(n)), i = n === "tag" ? "tag" : Ce(e) ? a.queue : a.one;
  return t === 1 ? i : `${i}s`;
}
function ef({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ c(de, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      Wa(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ c(de, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
      "Matching ",
      Wa(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ c(de, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      Wa(e, t)
    ] })
  ] });
}
function tf({
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
  notices: u,
  onOpen: g,
  onNew: m,
  onImport: N,
  onExportAll: y,
  rowMenuItems: q
}) {
  const k = R(null), b = ye(
    () => vc(e, t, n, a),
    [e, t, n, a]
  ), O = e.every((G) => t[G.id] !== void 0), F = a === "asc" ? "ascending" : "descending";
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
              var G;
              return (G = k.current) == null ? void 0 : G.click();
            },
            children: [
              /* @__PURE__ */ r(hl, { "aria-hidden": "true" }),
              "Import"
            ]
          }
        ),
        /* @__PURE__ */ r(
          "input",
          {
            ref: k,
            type: "file",
            accept: "application/json,.json",
            hidden: !0,
            tabIndex: -1,
            onChange: (G) => {
              var j;
              const K = (j = G.target.files) == null ? void 0 : j[0];
              G.target.value = "", K && N(K);
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
            onClick: y,
            children: [
              /* @__PURE__ */ r(ds, { "aria-hidden": "true" }),
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
              /* @__PURE__ */ r(Ni, { "aria-hidden": "true" }),
              "New review"
            ]
          }
        )
      ] })
    ] }),
    u,
    e.length ? /* @__PURE__ */ c("section", { className: "dq-reviews", "aria-label": "Reviews", children: [
      /* @__PURE__ */ c("div", { className: "dq-reviews-bar", children: [
        /* @__PURE__ */ c("p", { className: "dq-reviews-summary", children: [
          e.length === 1 ? "1 review" : `${e.length.toLocaleString()} reviews`,
          " ·",
          " ",
          s
        ] }),
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: O ? e.some((G) => t[G.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
        /* @__PURE__ */ c("div", { className: "dq-reviews-sort", children: [
          /* @__PURE__ */ c("label", { children: [
            /* @__PURE__ */ r("span", { children: "Sort by" }),
            /* @__PURE__ */ c(
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
              children: a === "asc" ? /* @__PURE__ */ r(ml, { "aria-hidden": "true" }) : /* @__PURE__ */ r(gl, { "aria-hidden": "true" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ c("table", { className: "dq-reviews-table", children: [
        /* @__PURE__ */ r("thead", { children: /* @__PURE__ */ c("tr", { children: [
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
        /* @__PURE__ */ r("tbody", { children: b.map((G) => {
          const K = De(G);
          return /* @__PURE__ */ c("tr", { children: [
            /* @__PURE__ */ r("td", { children: /* @__PURE__ */ c(
              "a",
              {
                className: "dq-reviews-link",
                href: `?review=${encodeURIComponent(G.id)}`,
                "data-review-id": G.id,
                onClick: (j) => {
                  j.button !== 0 || j.metaKey || j.ctrlKey || j.shiftKey || j.altKey || (j.preventDefault(), g(G.id));
                },
                children: [
                  /* @__PURE__ */ r("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ r(Ws, { entityType: K }) }),
                  /* @__PURE__ */ c("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ r("span", { className: "dq-reviews-name", children: G.name }),
                    G.description && /* @__PURE__ */ r("span", { className: "dq-reviews-description", title: G.description, children: G.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-type", children: Qs[K] }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-count", children: /* @__PURE__ */ r(ef, { review: G, count: t[G.id] }) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ r(Ui, { label: `Actions for ${G.name}`, items: q(G) }) })
          ] }, G.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ c("div", { className: "dq-empty", children: [
      /* @__PURE__ */ r(Ca, { "aria-hidden": "true" }),
      /* @__PURE__ */ r("p", { children: "No reviews yet." }),
      /* @__PURE__ */ r("p", { children: l ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function Nc(e, { id: t, name: n, description: a }) {
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
function nf({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: a
}) {
  const { review: i, saving: o, error: s } = e, l = R(null), d = R(null), h = R(o);
  h.current = o;
  const u = R(null), g = vt();
  J(() => {
    var y;
    return u.current ?? (u.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), l.current && !l.current.open && l.current.showModal(), (y = d.current) == null || y.focus(), () => {
      var q;
      (q = u.current) != null && q.isConnected && u.current.focus({ preventScroll: !0 });
    };
  }, []);
  const m = R(o);
  J(() => {
    var k, b;
    const y = document.activeElement, q = !y || y === document.body || !((k = l.current) != null && k.contains(y));
    s && (!i.name.trim() || m.current && !o && q) && ((b = d.current) == null || b.focus()), m.current = o;
  }, [s, o]);
  const N = () => {
    h.current || a();
  };
  return /* @__PURE__ */ r(
    "dialog",
    {
      ref: l,
      className: "dq-form-dialog",
      "aria-labelledby": g,
      "aria-modal": "true",
      onCancel: (y) => {
        y.preventDefault(), N();
      },
      onClose: () => {
        var y;
        h.current ? (y = l.current) == null || y.showModal() : a();
      },
      children: /* @__PURE__ */ c(
        "form",
        {
          onSubmit: (y) => {
            y.preventDefault(), h.current || n();
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
                  children: /* @__PURE__ */ r(Qr, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ c("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ r("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              s && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: s }),
              /* @__PURE__ */ c("fieldset", { className: "dq-form-dialog-fields", disabled: o, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ r(
                  Ys,
                  {
                    review: i,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (y) => {
                      y !== De(i) && t(Nc(y, i));
                    },
                    nameRef: d
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ c("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ r("button", { type: "button", className: "dq-text-button", onClick: () => ji(i), children: "Export draft" }),
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
const rf = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function af(e, t, n, a) {
  return wc(
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
function jo(e, t) {
  return De(t) === "video" && ea(t.view.objectFilter, e.view.objectFilter).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function Uo(e, t) {
  return fr(
    JSON.parse(Bn(dr(e))),
    JSON.parse(Bn(dr(t)))
  );
}
const Ha = 180;
function Go(e) {
  return De(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function Ko(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Bo() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Ya(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  $a.forEach((i) => n.delete(i)), e ? n.set("review", e) : n.delete("review");
  const a = n.toString();
  bc(`${window.location.pathname}${a ? `?${a}` : ""}`, { openingFromList: t });
}
function of(e) {
  return Lt({ ...e, page: 1 });
}
function qc(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Sr(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const sf = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(qi, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ r(yl, { "aria-hidden": "true" }) }
], cf = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(qi, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ r(wl, { "aria-hidden": "true" }) }
], Vo = [], Sc = "(min-width: 900px)";
function lf(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(Sc);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function df() {
  return typeof window.matchMedia == "function" && window.matchMedia(Sc).matches;
}
function uf({
  onNavigate: e
}) {
  const [t, n] = A([]), [a] = A(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [i, o] = A(""), [s, l] = A(!0), [d, h] = A(""), [u, g] = A(!1), [m, N] = A(!1), [y, q] = A(!1), [k, b] = A(!1), [O, F] = A([]), [G, K] = A(""), [j, X] = A(!0), [te, ie] = A("account"), [re, _] = A(""), [B, v] = A(""), [E, L] = A(!1), [D, W] = A(!1), [Z, V] = A(""), [T, Ge] = A(Bo), Ae = R(T);
  Ae.current = T;
  const [tt, U] = A({}), ve = R(tt);
  ve.current = tt;
  const Ke = R(t);
  Ke.current = t;
  const qe = R(s);
  qe.current = s;
  const Qe = R(!1), Te = R(!0);
  J(() => (Te.current = !0, () => {
    Te.current = !1;
  }), []);
  const [Be, Zt] = A(!T);
  Be !== !T && (Zt(!T), T || U({}));
  const [Re, wn] = A(Xu), { sort: le, direction: Ve } = Re, Nt = (f) => {
    const w = { ...Re, ...f };
    wn(w), Zu(w);
  }, dn = R(null), Ie = R(null), [it, Se] = A(null), [ot, Dt] = A(!1), [$e, yn] = A(!1), [st, Ot] = A(null), [dt, _t] = A(null), gt = !!st || !!dt, Wn = R(gt);
  Wn.current = gt;
  const Et = ot || !!dt || $e, [vn, jt] = A(0), [It, un] = A(!1), [me, qt] = A(null), nt = R(null), On = R(null), Ut = R(null), [_e, kt] = A(
    null
  ), ee = t.find((f) => f.id === T) ?? null, I = ye(
    () => (_e == null ? void 0 : _e.id) === T && ee ? { ...ee, view: {
      ...ee.view,
      filter: _e.view.filter,
      objectFilter: _e.view.objectFilter,
      searchMode: _e.view.searchMode,
      startFrom: _e.view.startFrom
    } } : ee,
    [_e, T, ee]
  ), we = I ? De(I) : "video", ut = Ci(we), In = I ? Ce(I) : !1, se = we === "video" ? I : null, Ct = In && !!(I != null && I.actions.some(zn)), Ye = !!se || we === "audio" || Ct, [Pe, Xe] = A(null), Gt = (Pe == null ? void 0 : Pe.id) === (I == null ? void 0 : I.id) ? Pe == null ? void 0 : Pe.mode : (I == null ? void 0 : I.view.reviewMode) ?? "single", Ze = In || we === "audio" || we === "video" && Gt === "single", [bt, Mt] = A(0), en = R(-1), ct = R(!1), mr = R(Ze);
  mr.current = Ze, J(() => {
    const f = () => {
      const w = mr.current;
      if (!w && En.current) {
        ct.current = !0;
        return;
      }
      en.current = -1, eo(), w || Mt(($) => $ + 1);
    };
    return window.addEventListener("popstate", f), () => window.removeEventListener("popstate", f);
  }, []);
  const Kt = ut === "audio" ? m : u, Mn = we === "tag" ? "Tag" : ut === "audio" ? "Audio" : "Video", C = we === "tag" ? y : Kt, M = R(
    null
  ), ne = _u(se), [Y, Ee] = A({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [be, xe] = A({
    page: 1,
    perPage: 40
  }), [je, At] = A({ items: [], totalCount: 0 }), [Ne, tn] = A(T);
  Ne !== T && (tn(T), At({ items: [], totalCount: 0 }), W(!1));
  const [ue, Nn] = A(!1), [We, Hn] = A(""), [wt, qn] = A(!1), [Tt, Fn] = A(!1), [lt, Ft] = A(() => /* @__PURE__ */ new Set()), fn = R(lt);
  fn.current = lt;
  const pn = R(/* @__PURE__ */ new Map()), Bt = (I == null ? void 0 : I.view.selectAllOnLoad) === !0, [ft, pt] = A(null), St = R(ft);
  St.current = ft;
  const [yt, Sn] = A(!1), Vt = R(yt);
  Vt.current = yt;
  const ta = R(null), [rt, nn] = A(!1), [Jt, Yn] = A("grid"), [Xn, na] = A(Ha), [oe, gr] = A(!1), [Zn, er] = A(!1), En = R(!1), [Pn, Or] = A(""), [xn, zt] = A(""), [tr, Qt] = A(""), [Oe, Ir] = A(null), [ra, Ln] = A(""), [nr, br] = A(!1), [wr, Mr] = A({}), Dn = R(/* @__PURE__ */ new Map()), Fr = R(null), rr = R(null), _n = !!I, aa = gi(lf, df, () => !1) && _n, [p, S] = A({ top: 0, bottom: 0 });
  ln(() => {
    if (!_n) return;
    const f = () => {
      const $ = rr.current;
      if (!$) return;
      const x = Math.round($.getBoundingClientRect().top + window.scrollY), H = $.closest("main"), Q = H ? Math.round(parseFloat(getComputedStyle(H).paddingBottom) || 0) : 0;
      S(
        (he) => he.top === x && he.bottom === Q ? he : { top: x, bottom: Q }
      );
    };
    f();
    const w = typeof ResizeObserver > "u" ? null : new ResizeObserver(f);
    return w == null || w.observe(document.body), window.addEventListener("resize", f), () => {
      w == null || w.disconnect(), window.removeEventListener("resize", f);
    };
  }, [_n]);
  const [P, z] = A(0), ae = R(null), fe = mn((f) => {
    var $;
    if (($ = ae.current) == null || $.disconnect(), ae.current = null, !f || typeof ResizeObserver > "u") return;
    const w = new ResizeObserver(
      () => z(Math.round(f.getBoundingClientRect().height))
    );
    w.observe(f), ae.current = w;
  }, []), ke = R(0), ht = R(0), Wt = R(null), Pt = R(null), et = Ts(
    I && !Ze ? me ? [...I.actions, ...me.draft.actions] : I.actions : Vo
  ), Me = ye(
    () => me && I && ee ? af(me.draft, I, Y, ee) : null,
    [me, I, Y, ee]
  ), Rt = ye(
    () => I && ee ? wc(
      { ...ee, view: { ...I.view, filter: { ...Y, page: 1 } } },
      ee
    ) : null,
    [I, ee, Y]
  ), Ue = ye(
    () => ee ? kr(dr(ee)) : "",
    [ee]
  ), rn = ye(
    () => Rt != null && kr(dr(Rt)) !== Ue,
    [Rt, Ue]
  ), yr = ye(
    () => Me != null && kr(dr(Me)) !== Ue,
    [Me, Ue]
  );
  J(() => {
    if (!xn) return;
    const f = window.setTimeout(() => zt(""), 4e3);
    return () => window.clearTimeout(f);
  }, [xn]), J(() => {
    if (!it || it.alert) return;
    const f = window.setTimeout(() => Se(null), 6e3);
    return () => window.clearTimeout(f);
  }, [it]), J(() => {
    const f = se ? Bi(se.view.objectFilter) : [];
    if (Mr({}), !f.length) return;
    const w = new AbortController();
    let $ = !0;
    return Promise.all(
      f.map(async (x) => {
        var H;
        try {
          const Q = await ce(`/api/tags/${x}`, {
            signal: w.signal
          });
          return (H = Q.name) != null && H.trim() ? [String(x), Q.name] : null;
        } catch {
          return null;
        }
      })
    ).then((x) => {
      $ && Mr(
        Object.fromEntries(x.filter((H) => H !== null))
      );
    }), () => {
      $ = !1, w.abort();
    };
  }, [se == null ? void 0 : se.id, se == null ? void 0 : se.view.objectFilter]);
  const Oa = ye(
    () => se ? Vi(
      se.view.objectFilter,
      wr
    ) : (I == null ? void 0 : I.view.objectFilter) ?? {},
    [wr, I, se]
  ), Pr = mn(async () => {
    l(!0), h("");
    try {
      const f = await Ll();
      n(f.reviews), o(f.storageKey), g(f.canWriteVideos ?? f.canWrite), N(f.canWriteAudios ?? !1), q(f.canWriteTags ?? !1), b(f.canReadTagGroups ?? !1), X(f.canConfigure ?? !0), ie(f.storage ?? "account"), _(f.storageNotice ?? ""), T && !f.reviews.some((w) => w.id === T) && (Ge(""), Ya(""));
    } catch (f) {
      h(
        f instanceof Error ? f.message : "Could not load reviews."
      );
    } finally {
      l(!1);
    }
  }, [T]);
  J(() => {
    if (!k) {
      F([]), K("");
      return;
    }
    const f = new AbortController();
    return K(""), Ql(f.signal).then(F).catch((w) => {
      f.signal.aborted || K(
        w instanceof Error ? w.message : "Could not load tag groups."
      );
    }), () => f.abort();
  }, [k]), J(() => {
    Pr();
  }, []), J(() => {
    if (T || t.length === 0) return;
    const f = new AbortController();
    for (const w of t) {
      if (typeof ve.current[w.id] == "number") continue;
      (Ce(w) ? Ji(w, f.signal).then((x) => (x == null ? void 0 : x.length) === 0 ? { items: [], totalCount: 0 } : jr(zi(w, x), { ...w.view.filter, page: 1, perPage: 1 }, f.signal)) : De(w) === "tag" ? mo(
        w,
        Lt({ ...w.view.filter, page: 1, perPage: 1 }),
        f.signal
      ) : jr(
        w,
        Lt({ ...w.view.filter, page: 1, perPage: 1 }),
        f.signal
      )).then((x) => {
        f.signal.aborted || U((H) => ({
          ...H,
          [w.id]: x.totalCount
        }));
      }).catch(() => {
        f.signal.aborted || U((x) => ({ ...x, [w.id]: null }));
      });
    }
    return () => f.abort();
  }, [T, t]), ln(() => {
    var $, x;
    const f = Ie.current;
    if (T || s || !f) return;
    Ie.current = null, (x = (f === "heading" ? null : [...(($ = rr.current) == null ? void 0 : $.querySelectorAll("[data-review-id]")) ?? []].find(
      (H) => H.dataset.reviewId === f.reviewId
    )) ?? dn.current) == null || x.focus();
  }, [T, s, dt, t]);
  const xr = R(0), jn = mn(async () => {
    const f = ++xr.current;
    Ir(null), Ln("");
    try {
      const w = await (Ct ? Es(ut) : Ss(ut));
      f === xr.current && Ir(w);
    } catch (w) {
      if (f !== xr.current) return;
      Ir(null), Ln(
        "Tag assessment setup could not be checked. " + (w instanceof Error ? w.message : "Request failed.")
      );
    }
  }, [Ct, ut]);
  J(() => {
    jn();
  }, [jn]);
  const an = mn(
    async (f, w, $ = !1, x = !1) => {
      var $t, Le;
      const H = ++ke.current;
      ($t = Wt.current) == null || $t.abort();
      const Q = new AbortController();
      Wt.current = Q, w = Lt(w);
      const he = Number(w.page);
      $ && (w = { ...w, page: 1 }), Ee(w), Fn($), Nn(!0), Hn("");
      try {
        const Je = (kn) => De(f) === "tag" ? mo(
          f,
          kn,
          Q.signal
        ) : jr(
          f,
          kn,
          Q.signal
        );
        let ge = await Je(w);
        const He = Math.max(
          1,
          Math.ceil(ge.totalCount / Number(w.perPage))
        ), vr = $ ? He : Math.min(he, He);
        return Number(w.page) !== vr && (w = { ...w, page: vr }, ge = await Je(w)), H === ke.current && (((Le = Pt.current) == null ? void 0 : Le.page) !== vr && (Pt.current = {
          page: vr,
          ids: new Set(ge.items.map((kn) => kn.id))
        }), At(ge), x && hn(
          () => new Set(ge.items.map((kn) => kn.id))
        ), Ee(w), xe(w)), ge;
      } catch (Je) {
        throw H === ke.current && Hn(
          Je instanceof Error ? Je.message : "Could not load the review queue."
        ), Je;
      } finally {
        H === ke.current && Nn(!1);
      }
    },
    []
  );
  J(() => {
    var w;
    if (ht.current += 1, en.current = -1, ke.current += 1, (w = Wt.current) == null || w.abort(), qt(null), nt.current = null, W(!1), V(""), v(""), L(!1), Ft(/* @__PURE__ */ new Set()), pn.current.clear(), pt(null), Sn(!1), gr(!1), En.current = !1, Or(""), zt(""), Qt(""), At({ items: [], totalCount: 0 }), Pt.current = null, qn(!1), !I || Ze) {
      Nn(!1), kt(null);
      return;
    }
    let f = !0;
    return Nn(!0), (async () => {
      let $ = ee ?? I;
      kt(null);
      let x = null;
      const H = new URLSearchParams(window.location.search);
      if (De(I) === "video" && $a.some((Le) => H.has(Le)))
        try {
          const Le = $;
          x = mi(Le, H);
          const Je = gn(Le, x.query);
          (x.query.startFrom !== (Le.view.startFrom ?? "end") || !fr(
            JSON.parse(Bn(Je)),
            JSON.parse(Bn(gn(Le, pr(Le))))
          )) && ($ = Je, kt($));
        } catch (Le) {
          qn(!0), Hn(Le instanceof Error ? Le.message : "Could not read review URL."), Nn(!1);
          return;
        }
      let Q = null;
      try {
        Q = await jl(i, I.id);
      } catch (Le) {
        f && (L(!0), v(
          Le instanceof Error ? Le.message : "Could not load progress."
        ));
      }
      if (!f) return;
      const he = (Q == null ? void 0 : Q.signature) === Bn($) ? Q : null, $t = x ? x.query.filter : he ? Lt(he.filter) : of($.view.filter);
      Ee($t), Yn(
        he ? Ko(he.displayMode, De(I)) : Go(I)
      ), na(
        he ? he.cardSize ?? Ha : Ha
      );
      try {
        const Le = await an(
          $,
          $t,
          x ? x.startAtEnd : !he && $.view.startFrom !== "beginning",
          $.view.selectAllOnLoad === !0
        );
        if (!f) return;
        const Je = uo(
          Le.items.map((ge) => ge.id),
          (he == null ? void 0 : he.focusedId) ?? null,
          (he == null ? void 0 : he.index) ?? 0
        );
        pt(Je), mt(Je);
      } catch {
      }
      f && (en.current = bt, W(!0), V(`${I.id}:${bt}`));
    })(), () => {
      var $;
      f = !1, ht.current++, ke.current++, ($ = Wt.current) == null || $.abort();
    };
  }, [I == null ? void 0 : I.id, Ze, bt]), J(() => {
    if (!(!vn || Ze || !I)) {
      if (wt) {
        jt(0);
        return;
      }
      oe || me || Z !== `${I.id}:${bt}` || (jt(0), ja());
    }
  }, [vn, Ze, I == null ? void 0 : I.id, Z, oe, bt, wt]), J(() => {
    !se || Ze || !D || ue || We || oe || ct.current || en.current !== bt || Ur(se.id, {
      filter: Y,
      objectFilter: se.view.objectFilter,
      searchMode: se.view.searchMode,
      startFrom: se.view.startFrom ?? "end"
    });
  }, [se, Ze, D, ue, We, Y, oe, bt]);
  const pe = ye(
    () => je.items.map((f) => f.id),
    [je.items]
  );
  J(() => {
    if (!D || !I || !i || ue || We || oe || (_e == null ? void 0 : _e.id) === I.id || E || en.current !== bt)
      return;
    const f = {
      version: 1,
      signature: Bn(I),
      filter: Y,
      focusedId: ft,
      index: Math.max(0, pe.indexOf(ft ?? -1)),
      displayMode: Jt,
      cardSize: Xn,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        i + ":progress:" + I.id,
        JSON.stringify(f)
      );
    } catch {
    }
    if (B) return;
    let w = !0;
    const $ = window.setTimeout(() => {
      Ul(i, I.id, f).catch((x) => {
        w && v(
          "Progress is kept in this browser, but account sync failed. " + (x instanceof Error ? x.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      w = !1, window.clearTimeout($);
    };
  }, [
    D,
    i,
    I,
    ue,
    We,
    oe,
    Y,
    ft,
    pe,
    Jt,
    Xn,
    _e,
    B,
    E,
    bt
  ]);
  const ia = je.items.find((f) => f.id === ft) ?? null, Ia = we === "video" ? ia : null;
  yt && Ia && (ta.current = Ia);
  const ar = Ia ?? (yt ? ta.current : null), Ec = fo(lt, ft), kc = pe.length > 0 && pe.every((f) => lt.has(f)), mt = mn((f, w = !0) => {
    f != null && window.requestAnimationFrame(() => {
      var x;
      if (Wn.current || Ol(document.activeElement) || (x = document.activeElement) != null && x.closest(".dq-drawer"))
        return;
      const $ = Dn.current.get(f);
      $ == null || $.focus({ preventScroll: !0 }), w && ($ == null || $.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  J(() => {
    D && !Vt.current && mt(St.current);
  }, [D, mt]), J(() => {
    ue || !pe.length || (St.current == null || !pe.includes(St.current)) && (pt(pe[0]), Vt.current || mt(pe[0]));
  }, [mt, pe, ue]);
  const hn = mn(
    (f) => {
      Ft((w) => {
        const $ = f(w);
        for (const x of /* @__PURE__ */ new Set([...w, ...$]))
          w.has(x) !== $.has(x) && pn.current.set(
            x,
            (pn.current.get(x) ?? 0) + 1
          );
        return $;
      });
    },
    []
  ), Ma = mn(
    (f) => {
      if (!pe.length) return;
      const w = Math.max(
        0,
        pe.indexOf(St.current ?? pe[0])
      ), $ = pe[Math.max(0, Math.min(pe.length - 1, w + f))];
      pt($), Vt.current || mt($);
    },
    [mt, pe]
  ), oa = mn(
    async (f) => {
      const w = "steps" in f ? f.steps.length > 0 : f.effect.mode !== "SKIP", $ = "effect" in f && f.effect.mode === "SET_TAG_GROUP" ? f.effect.tagGroupId : null, x = $ != null && (!k || !O.some((ze) => ze.id === $)), H = "effect" in f && w && !k, Q = fo(
        fn.current,
        St.current
      );
      if (!I || En.current || ue || We) return;
      const he = w && !C ? `${Mn} write permission is required to apply ${f.label}.` : H || x ? `${f.label} needs a tag group that is unavailable.` : zn(f) && (Oe == null ? void 0 : Oe.kind) !== "ready" ? `Set up tag assessments before applying ${f.label}.` : Q.length ? "" : `Select or focus a ${we} before applying ${f.label}.`;
      if (he) {
        Qt(he);
        return;
      }
      const $t = ++ht.current, Le = I.id, Je = [...pe], ge = je, He = St.current, vr = new Set(fn.current), kn = new Map(
        Q.map((ze) => [ze, pn.current.get(ze) ?? 0])
      ), Nr = () => $t === ht.current && I.id === Le;
      En.current = !0, gr(!0), Or(
        fn.current.size ? `${Q.length} selected ${we}s` : `the focused ${we}`
      ), zt(""), Qt("");
      const io = ge.items.filter(
        (ze) => !Q.includes(ze.id)
      ), Kc = io.map((ze) => ze.id), oo = po(
        Je,
        Kc,
        He,
        Q.includes(He ?? -1)
      );
      At({
        items: io,
        totalCount: ge.totalCount
      }), Ft((ze) => {
        const xt = new Set(ze);
        for (const on of Q) xt.delete(on);
        return xt;
      }), pt(oo), Vt.current || mt(oo);
      let Ua = !1;
      try {
        if ("effect" in f ? await ad(f, Q) : await Cs(ut, f, Q), Ua = !0, !Nr()) return;
        Ft((ze) => {
          const xt = new Set(ze);
          for (const on of Q)
            (pn.current.get(on) ?? 0) === kn.get(on) && xt.delete(on);
          return xt;
        }), zt(
          `${f.label}: ${Q.length} ${we}${Q.length === 1 ? "" : "s"} ${w ? "updated" : "skipped"}.`
        );
      } catch (ze) {
        if (!Nr()) return;
        At(ge), Ft((xt) => {
          const on = new Set(xt);
          for (const Ht of Q)
            vr.has(Ht) && (pn.current.get(Ht) ?? 0) === kn.get(Ht) && on.add(Ht);
          return on;
        }), pt(He), Vt.current || mt(He), Qt(
          ze instanceof Error ? ze.message : "Action failed."
        );
      }
      try {
        if (await Yl(f), !Nr()) return;
        const ze = new Set(Q), xt = Bt && Je.length > 0 && Je.every((sn) => ze.has(sn)), on = await an(I, Y, !1, xt);
        if (!Nr()) return;
        let Ht = on.items.map((sn) => sn.id);
        const ca = Pt.current, Bc = (ca == null ? void 0 : ca.page) === Number(Y.page) && Ht.some((sn) => ca.ids.has(sn)), Vc = (I.view.startFrom ?? "end") !== "beginning";
        if (on.totalCount > 0 && Number(Y.page) > 1 && (!Ht.length || Vc && !Bc)) {
          const sn = Math.max(1, Number(Y.page) - 1), la = { ...Y, page: sn };
          Ee(la), Ht = (await an(
            I,
            la,
            !1,
            xt
          )).items.map((Ga) => Ga.id), Ft(
            (Ga) => new Set([...Ga].filter((Jc) => Ht.includes(Jc)))
          );
          const co = Ht.at(-1) ?? null;
          pt(co), Vt.current || mt(co);
        } else {
          Ft(
            (la) => new Set([...la].filter((so) => Ht.includes(so)))
          );
          const sn = po(
            Je,
            Ht,
            He,
            Ua && Q.includes(He ?? -1)
          );
          pt(sn), Vt.current && sn == null && Sn(!1), Vt.current || mt(sn);
        }
      } catch (ze) {
        Nr() && Qt(
          (xt) => `${xt ? `${xt} ` : ""}${Ua ? "The action completed, but " : ""}the queue could not be refreshed. ${ze instanceof Error ? ze.message : "Refresh failed."}`
        );
      } finally {
        Nr() && (En.current = !1, gr(!1), Or(""), ct.current && (ct.current = !1, eo(), Mt((ze) => ze + 1)));
      }
    },
    [
      C,
      k,
      O,
      we,
      Oe,
      an,
      Y,
      mt,
      pe,
      je,
      ue,
      We,
      I
    ]
  );
  function Cc() {
    var $;
    if (Jt === "list") return 1;
    const f = ($ = Fr.current) == null ? void 0 : $.firstElementChild, w = f ? getComputedStyle(f).gridTemplateColumns : "";
    return Math.max(1, w.split(" ").filter(Boolean).length);
  }
  const Hi = R(() => {
  });
  Hi.current = (f) => {
    var Q;
    if (Ze || f.defaultPrevented || f.repeat || f.ctrlKey || f.altKey || f.metaKey || gt) return;
    const w = f.target, $ = w instanceof Node && ((Q = rr.current) == null ? void 0 : Q.contains(w)) === !0, x = w === document.body || w === document.documentElement;
    if (!$ && !x) return;
    if (rt) {
      f.key === "Escape" && (Sr(f), nn(!1));
      return;
    }
    if (yt && f.key === "Escape") {
      Sr(f), Sn(!1), mt(St.current);
      return;
    }
    if (!$l(w)) return;
    const H = Rl(w);
    if (f.key === "Escape") {
      Sr(f), hn(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!yt && f.key === " " && H) {
      Sr(f), ft != null && hn((he) => ma(he, ft));
      return;
    }
    if (!(oe || ue) && !yt && f.key === "Enter" && ft != null && H) {
      if (we !== "tag" && me) return;
      Sr(f), we === "tag" ? window.open(`/tag/${ft}`, "_blank", "noopener,noreferrer") : Sn(!0);
      return;
    }
  }, J(() => {
    const f = (w) => Hi.current(w);
    return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
  }, []);
  const Yi = R(
    () => {
    }
  );
  Yi.current = (f) => {
    var Q;
    if (Ze || gt || yt || rt || oe || ue || !pe.length || f.defaultPrevented || f.repeat || f.ctrlKey || f.altKey || f.metaKey)
      return;
    const w = f.target, $ = w instanceof Node && ((Q = rr.current) == null ? void 0 : Q.contains(w)) === !0, x = w === document.body || w === document.documentElement;
    if (!$ && !x || !f.key.startsWith("Arrow") || !Il(w)) return;
    const H = Ml(f.key, Cc());
    H && (f.preventDefault(), $ ? f.stopImmediatePropagation() : f.stopPropagation(), Ma(H));
  }, J(() => {
    const f = (w) => Yi.current(w);
    return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
  }, []);
  const Un = (me == null ? void 0 : me.saving) === !0 || Zn, Fa = oe || ue && !D || Un, Ac = Pi();
  Fi({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!I && !Ze && !gt && !me && !yt && !rt && !We && (je.items.length > 0 || ue || oe),
    actions: (I == null ? void 0 : I.actions) ?? Vo,
    onAction: (f) => {
      const w = I == null ? void 0 : I.actions[f];
      w && oa(w);
    },
    onFind: () => nn(!0),
    onSelectAll: () => hn((f) => Tl(f, pe))
  }), J(() => nn(!1), [Ze, yt, I == null ? void 0 : I.id]);
  function Xi(f) {
    const w = "steps" in f ? f.steps.length > 0 : f.effect.mode !== "SKIP", $ = "effect" in f && f.effect.mode === "SET_TAG_GROUP" ? f.effect.tagGroupId : null, x = $ != null && !O.some((H) => H.id === $);
    return oe || ue || !!We || w && !C || "effect" in f && w && (!k || x) || zn(f) && (Oe == null ? void 0 : Oe.kind) !== "ready" || !Ec.length;
  }
  function Pa(f) {
    Xe(null), jt(0), Se(null), Ge(f), Ya(f, !!f && !I);
  }
  function Zi() {
    Qe.current || (gc() ? (Qe.current = !0, window.history.back()) : Pa(""));
  }
  function eo() {
    const f = Qe.current;
    Qe.current = !1;
    let w = Bo();
    w && !qe.current && !Ke.current.some((x) => x.id === w) && (w = "", Ya(""));
    const $ = Ae.current;
    w !== $ && (jt(0), f || Se(null), !w && $ && (Ie.current ?? (Ie.current = { reviewId: $ }))), Ge(w);
  }
  function xa() {
    Ie.current = "heading", Se(null), Zi();
  }
  function La(f) {
    f !== T && Pa(f), jt((w) => w + 1);
  }
  function Tc() {
    Se(null), Ot({
      review: Nc("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function Rc(f) {
    if (Et || !j) return;
    Se(null);
    const w = Al(f, t, crypto.randomUUID()), $ = T;
    yn(!0);
    try {
      if (!await ir([...t, w])) throw new Error("Could not save reviews.");
      if (!Te.current) return;
      Ae.current !== $ ? Se({ text: `Saved the copy “${w.name}”.`, alert: !1 }) : La(w.id);
    } catch (x) {
      Se({
        text: `“${f.name}” was not duplicated. ${Da(x)}`,
        alert: !0
      });
    } finally {
      yn(!1);
    }
  }
  async function $c() {
    if (!st || st.saving) return;
    const f = { ...st.review, name: st.review.name.trim() }, w = Vr(f);
    if (w) {
      Ot({ ...st, error: w });
      return;
    }
    Ot({ ...st, saving: !0, error: "" });
    try {
      if (!await ir([...t, f])) throw new Error("Could not save reviews.");
      if (!Te.current) return;
      Ot(null), La(f.id);
    } catch ($) {
      Ot(
        (x) => x && {
          ...x,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + ($ instanceof Error ? $.message : "Retry saving.")
        }
      );
    }
  }
  async function Oc() {
    if (!dt || dt.pending) return;
    const f = dt.review, w = vc(t, tt, le, Ve).map((H) => H.id), $ = w.filter((H) => H !== f.id), x = $[Math.min(w.indexOf(f.id), $.length - 1)];
    _t({ review: f, pending: !0 });
    try {
      if (!await ir(t.filter((H) => H.id !== f.id)))
        throw new Error("Could not save reviews.");
      Ie.current = f.id !== T && x ? { reviewId: x } : "heading", Se({ text: `Deleted “${f.name}”.`, alert: !1 });
    } catch (H) {
      Se({ text: `“${f.name}” was not deleted. ${Da(H)}`, alert: !0 });
    } finally {
      _t(null);
    }
  }
  async function Ic(f) {
    if (!(Et || !j)) {
      Se(null), Dt(!0);
      try {
        const w = await Zd(f), $ = Za(t, w), x = $.length - t.length, H = w.length - x;
        if (x && !await ir($)) throw new Error("Could not save reviews.");
        Se({
          alert: !1,
          text: w.length ? x ? `Imported ${x === 1 ? "1 review" : `${x} reviews`}.` + (H === 1 ? " 1 review already in the list stays as it is." : H ? ` ${H} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (w) {
        Se({ alert: !0, text: `Could not import “${f.name}”. ${Da(w)}` });
      } finally {
        Dt(!1);
      }
    }
  }
  function Da(f) {
    return f instanceof ms ? "Reviews changed in another browser. Reload the page to get them, then try again." : f instanceof Error ? f.message : "Try again.";
  }
  function to(f) {
    const w = !j || Et;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ r(es, { "aria-hidden": "true" }),
        disabled: w,
        onSelect: () => void Rc(f)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ r(ds, { "aria-hidden": "true" }),
        onSelect: () => ji(f)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ r(ts, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: w,
        onSelect: () => {
          Se(null), _t({ review: f, pending: !1 });
        }
      }
    ];
  }
  function no(f, w) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ r(Cr, { "aria-hidden": "true" }),
        ...w,
        disabled: w.disabled || $e
      },
      ...to(f),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ r(Wr, { "aria-hidden": "true" }),
        separated: !0,
        disabled: $e,
        onSelect: xa
      }
    ];
  }
  async function ir(f) {
    if (!i) return !1;
    const w = f.map(pf);
    try {
      await _l(i, w);
    } catch (x) {
      throw x;
    }
    n(w), T && !w.some((x) => x.id === T) && Zi();
    const $ = w.find((x) => x.id === T);
    return $ && ee && (($.view.reviewMode ?? "single") !== (ee.view.reviewMode ?? "single") && Xe(null), $.view.displayMode !== ee.view.displayMode && Yn(Go($))), !0;
  }
  if (s)
    return /* @__PURE__ */ r(Jo, { label: "Loading reviews…" });
  if (d)
    return /* @__PURE__ */ c(de, { children: [
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          onClick: () => void wf().catch(
            (f) => h(
              "Could not export browser reviews. " + (f instanceof Error ? f.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ r(
        zo,
        {
          message: d,
          onRetry: () => void Pr()
        }
      )
    ] });
  const _a = /* @__PURE__ */ c(de, { children: [
    re && /* @__PURE__ */ r("p", { className: "dq-status", children: re }),
    Ye && (Oe == null ? void 0 : Oe.kind) === "missing" && /* @__PURE__ */ c("div", { role: "status", className: "dq-status", children: [
      Oe.message,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: nr,
          onClick: () => {
            br(!0), Ln(""), (Ct ? ed(ut) : Zl(ut)).then(jn).catch(
              (f) => Ln(
                `Could not create the ${Ct ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (f instanceof Error ? f.message : "Request failed.")
              )
            ).finally(() => br(!1));
          },
          children: nr ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    Ye && ((Oe == null ? void 0 : Oe.kind) === "incompatible" || ra) && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(Cn, {}),
      ra || (Oe == null ? void 0 : Oe.message),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: nr,
          onClick: () => {
            br(!0), jn().finally(
              () => br(!1)
            );
          },
          children: nr ? "Checking…" : "Check again"
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
            const f = localStorage.getItem("page-videos") ?? "[]", w = URL.createObjectURL(
              new Blob([f], { type: "application/json" })
            ), $ = document.createElement("a");
            $.href = w, $.download = "data-quality-unassigned-legacy-reviews.json", $.click(), URL.revokeObjectURL(w);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    B && /* @__PURE__ */ c("p", { role: "alert", children: [
      B,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: () => {
            v(""), L(!1);
          },
          children: E ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    it && (it.alert ? /* @__PURE__ */ c("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(Cn, { "aria-hidden": "true" }),
      it.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ r("p", { className: "dq-status", "aria-hidden": "true", children: it.text })
    ))
  ] });
  return /* @__PURE__ */ c(
    "div",
    {
      ref: rr,
      className: `data-quality-page${_n ? " dq-page-fit" : ""}`,
      style: _n ? {
        "--dq-fit-top": `${p.top}px`,
        "--dq-fit-bottom": `${p.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ r("p", { className: "dq-sr-only", "aria-live": "polite", children: it && !it.alert ? it.text : "" }),
        I && Ze ? /* @__PURE__ */ r(
          Hu,
          {
            review: ee ?? I,
            canWrite: In ? y : Kt,
            canAssess: (Oe == null ? void 0 : Oe.kind) === "ready" && Kt,
            onBusy: gr,
            editRequest: vn,
            onEditRequestHandled: () => jt(0),
            onSaveDefaults: j ? (f) => ir(t.map((w) => w.id === f.id ? f : w)) : void 0,
            pageControls: {
              onBack: xa,
              moreItems: (f) => no(ee ?? I, f),
              onGrid: se ? () => Xe({ id: se.id, mode: "multiple" }) : void 0,
              notices: _a,
              busy: $e
            },
            stayOnTap: It,
            onStayOnTapChange: un
          },
          I.id
        ) : I ? Uc(I) : /* @__PURE__ */ r(
          tf,
          {
            reviews: t,
            counts: tt,
            sort: le,
            direction: Ve,
            onSortChange: (f) => Nt({ sort: f }),
            onDirectionChange: (f) => Nt({ direction: f }),
            storage: rf[te],
            canConfigure: j,
            busy: Et,
            headingRef: dn,
            notices: _a,
            onOpen: Pa,
            onNew: () => Tc(),
            onImport: (f) => void Ic(f),
            onExportAll: () => Hs(t, "data-quality-reviews.json"),
            rowMenuItems: (f) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ r(Cr, { "aria-hidden": "true" }),
                disabled: !j || Et,
                onSelect: () => La(f.id)
              },
              ...to(f)
            ]
          }
        ),
        yt && ar && se && /* @__PURE__ */ r(
          bf,
          {
            video: ar,
            review: se,
            selectedCount: lt.size,
            pending: oe,
            refreshing: ue || !!We,
            error: tr,
            canWrite: u,
            assessmentReady: (Oe == null ? void 0 : Oe.kind) === "ready",
            trees: et,
            selected: lt.has(ar.id),
            hasPrevious: pe.indexOf(ar.id) > 0,
            hasNext: pe.indexOf(ar.id) >= 0 && pe.indexOf(ar.id) < pe.length - 1,
            onToggleSelected: () => hn((f) => ma(f, ar.id)),
            onPrevious: () => Ma(-1),
            onNext: () => Ma(1),
            onClose: () => {
              Sn(!1), mt(St.current);
            },
            onAction: oa,
            findOpen: rt,
            onFindOpenChange: nn
          }
        ),
        rt && I && !Ze && !yt && /* @__PURE__ */ r(
          Di,
          {
            actions: I.actions,
            tagGroups: O,
            trees: et,
            isDisabled: Xi,
            canStay: !1,
            onApply: (f) => {
              nn(!1), oa(f);
            },
            onClose: () => nn(!1)
          }
        ),
        st && /* @__PURE__ */ r(
          nf,
          {
            draft: st,
            onChange: (f) => Ot((w) => w && { ...w, review: f, error: "" }),
            onCreate: () => void $c(),
            onCancel: () => Ot(null)
          }
        ),
        /* @__PURE__ */ r(
          rl,
          {
            open: !!dt,
            title: "Delete review?",
            message: dt ? `“${dt.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (dt == null ? void 0 : dt.pending) ?? !1,
            onConfirm: () => void Oc(),
            onCancel: () => _t((f) => f != null && f.pending ? f : null)
          }
        )
      ]
    }
  );
  async function sa(f, w, $ = !1) {
    const x = St.current, H = Math.max(0, pe.indexOf(x ?? -1));
    try {
      const Q = an(
        f,
        w,
        $,
        f.view.selectAllOnLoad === !0
      ), he = ke.current, $t = await Q;
      if (he !== ke.current) return;
      const Le = $t.items.map((ge) => ge.id);
      Ft(
        (ge) => new Set([...ge].filter((He) => Le.includes(He)))
      );
      const Je = uo(Le, x, H);
      pt(Je), Vt.current || mt(Je, !1);
    } catch {
    }
  }
  function Mc(f) {
    const w = M.current;
    if (M.current = null, Fa || !I || !ee) return;
    const $ = w ?? I.view.objectFilter, x = fr(
      $,
      ee.view.objectFilter
    ) ? ee.view.objectFilter : $, H = Lt({ ...f, page: 1 }), Q = {
      ...I,
      view: {
        ...I.view,
        filter: H,
        objectFilter: x
      }
    }, he = !Uo(Q, ee), $t = he ? Q : ee;
    kt(he ? Q : null), zt(he ? "" : "Review queue defaults restored."), sa($t, H, !0);
  }
  function Fc() {
    if (oe || ue || Un || !ee) return;
    M.current = null;
    const f = Lt({
      ...ee.view.filter,
      page: 1
    });
    kt(null), zt("Review queue defaults restored."), sa(
      ee,
      f,
      ee.view.startFrom !== "beginning"
    );
  }
  function Pc() {
    if (oe || ue || We || Un || !I || !Rt || !j)
      return;
    const f = I, w = Rt;
    er(!0), ir(
      t.map(($) => $.id === w.id ? w : $)
    ).then(($) => {
      $ && (kt(jo(w, f)), zt("Queue saved to this review."));
    }).catch(
      ($) => Qt(
        $ instanceof Error ? $.message : "Could not save queue."
      )
    ).finally(() => er(!1));
  }
  function ja() {
    if (!I || !ee || En.current || me || Zn) return;
    On.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, nt.current = {
      temporaryReview: _e,
      filter: Y,
      loadedFilter: be,
      queue: je,
      queueError: We,
      retryFromEnd: Tt,
      selectedIds: new Set(lt),
      focusedId: ft,
      pageCursor: Pt.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const f = structuredClone({
      ...ee,
      view: { ...ee.view, startFrom: I.view.startFrom ?? "end" }
    });
    nn(!1), Sn(!1), zt(""), Qt(""), qt({ draft: f, saving: !1, error: "" });
  }
  function ro() {
    qt(null), nt.current = null;
    const f = On.current;
    On.current = null, requestAnimationFrame(() => {
      (f == null ? void 0 : f.isConnected) && f !== document.body && !(f instanceof HTMLButtonElement && f.disabled) ? f.focus({ preventScroll: !0 }) : mt(St.current, !1);
    });
  }
  function xc() {
    var w;
    if (!me || me.saving) return;
    const f = nt.current;
    f && (ke.current += 1, (w = Wt.current) == null || w.abort(), M.current = null, Nn(!1), kt(f.temporaryReview), Ee(f.filter), xe(f.loadedFilter), At(f.queue), Hn(f.queueError), Fn(f.retryFromEnd), hn(() => f.selectedIds), pt(f.focusedId), Pt.current = f.pageCursor, window.history.replaceState(window.history.state, "", f.url)), ro();
  }
  async function Lc() {
    if (!me || me.saving || !Me || !I) return;
    const f = I, w = { ...Me, name: Me.name.trim() }, $ = Vr(w);
    if ($) {
      qt((x) => x && { ...x, error: $ });
      return;
    }
    qt((x) => x && { ...x, saving: !0, error: "" });
    try {
      if (!await ir(t.map((x) => x.id === w.id ? w : x)))
        throw new Error("Could not save reviews.");
      kt(jo(w, f)), De(w) === "video" && Ur(w.id, {
        filter: Y,
        objectFilter: f.view.objectFilter,
        searchMode: w.view.searchMode,
        startFrom: w.view.startFrom ?? "end"
      }), zt("Review saved."), ro();
    } catch (x) {
      qt(
        (H) => H && {
          ...H,
          saving: !1,
          error: "Could not save review. Your edits are still open. " + (x instanceof Error ? x.message : "Retry saving.")
        }
      );
    }
  }
  function ao() {
    I && an(I, Y, Tt, Bt).catch(() => {
    });
  }
  function Dc() {
    Ft(/* @__PURE__ */ new Set()), pn.current.clear(), pt(null);
  }
  function _c(f) {
    !I || oe || Un || f === Number(Y.page) || ff(
      { ...Y, page: f },
      I,
      (w, $) => an(w, $, !1, Bt),
      Dc
    );
  }
  function jc(f) {
    if (!se || !ee || oe || ue || Un) return;
    const w = Ku(se, f, ee.view.objectFilter), $ = !Uo(w, ee);
    kt($ ? w : null), $ ? sa(w, { ...Y, page: 1 }) : sa(
      ee,
      { ...Y, page: 1 },
      ee.view.startFrom !== "beginning"
    );
  }
  function Uc(f) {
    var Le, Je;
    const w = we === "tag", $ = w ? "tag" : "video", x = Math.max(1, Number(Y.perPage) || 40), H = Math.max(1, Math.ceil(je.totalCount / x)), Q = Math.min(Math.max(1, Number(Y.page) || 1), H), he = [
      C ? "" : `${Mn} write permission is required to apply actions.`,
      w && G ? `Tag groups are unavailable. ${G}` : ""
    ].filter(Boolean), $t = !!tr && !yt;
    return /* @__PURE__ */ c(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": w ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ r(
            Zs,
            {
              name: f.name,
              description: f.description,
              entityType: we,
              onBack: xa,
              backDisabled: oe || !!me || $e,
              onEdit: me ? () => {
                var ge;
                return (ge = Ut.current) == null ? void 0 : ge.focus();
              } : ja,
              editDisabled: !me && (oe || ue || wt || Zn || $e || !j),
              editing: !!me,
              toolbar: /* @__PURE__ */ c("fieldset", { className: "dq-review-toolbar", disabled: Fa, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: w ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ r(
                  Gr,
                  {
                    filter: We ? be : Y,
                    onFilterChange: Mc,
                    totalCount: je.totalCount,
                    sortOptions: w ? il : Ho,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: Jt,
                    zoomLevel: (Xn - 225) / 50,
                    onZoomChange: (ge) => na(Math.round(225 + ge * 50)),
                    cardSizeEntityType: w ? "tags" : "videos",
                    criteriaDefinitions: w ? al : yi,
                    customFieldEntityType: we === "video" ? "video" : void 0,
                    objectFilter: Oa,
                    onObjectFilterChange: (ge) => {
                      Fa || (M.current = we === "video" ? nc(
                        ge,
                        wr,
                        f.view.objectFilter
                      ) : ge);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(ec, { page: Q, pages: H, onPage: _c })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ c(de, { children: [
                se && /* @__PURE__ */ r(
                  tc,
                  {
                    mode: "multiple",
                    disabled: oe || ue || gt || !!me || Zn || $e,
                    onChange: () => Xe({ id: se.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ r(
                  iu,
                  {
                    options: w ? cf : sf,
                    value: Jt,
                    onChange: (ge) => Yn(Ko(ge, we))
                  }
                ),
                /* @__PURE__ */ r(
                  Ui,
                  {
                    disabled: oe || !!me,
                    items: no(ee ?? f, {
                      onSelect: ja,
                      disabled: ue || wt || Zn || !j
                    })
                  }
                )
              ] }),
              chipsAfter: (Je = (Le = se == null ? void 0 : se.presentation) == null ? void 0 : Le.binParents) != null && Je.length ? /* @__PURE__ */ r(
                Uu,
                {
                  videos: je.items,
                  review: se,
                  savedObjectFilter: (ee ?? se).view.objectFilter,
                  trees: ne.ids,
                  disabled: oe || ue || Un,
                  onToggle: jc
                }
              ) : void 0,
              chipsEnd: me ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : (_e == null ? void 0 : _e.id) === T ? /* @__PURE__ */ c(de, { children: [
                /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Queue differs from the saved review" }),
                rn && /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    className: "dq-text-button",
                    title: "Save the current queue criteria to this review",
                    disabled: oe || ue || !!We || Un || !j,
                    onClick: Pc,
                    children: [
                      /* @__PURE__ */ r(ss, { "aria-hidden": "true" }),
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
                    disabled: oe || ue || Un,
                    onClick: Fc,
                    children: [
                      /* @__PURE__ */ r(cs, { "aria-hidden": "true" }),
                      "Reset"
                    ]
                  }
                )
              ] }) : void 0
            }
          ),
          _a,
          se && ne.error && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: ne.error }),
          /* @__PURE__ */ c("div", { className: "dq-review-area", children: [
            me && Me && /* @__PURE__ */ r(
              Xs,
              {
                drawerRef: Ut,
                draft: Me,
                onChange: (ge) => qt((He) => He && { ...He, draft: ge }),
                direction: me.draft.view.startFrom ?? "end",
                onDirectionChange: (ge) => qt(
                  (He) => He && {
                    ...He,
                    draft: { ...He.draft, view: { ...He.draft.view, startFrom: ge } }
                  }
                ),
                tagGroups: O,
                trees: et,
                saving: me.saving,
                saveDisabled: ue || !!We,
                error: me.error,
                dirty: yr,
                criteriaChanged: rn,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  We && !ue ? /* @__PURE__ */ c("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ r(Cn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ c("span", { children: [
                      "The queue could not load: ",
                      We,
                      " ",
                      /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", onClick: ao, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void Lc(),
                onCancel: xc
              }
            ),
            /* @__PURE__ */ c(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${P}px` },
                children: [
                  /* @__PURE__ */ c("div", { className: "dq-grid-content", children: [
                    ue && !je.items.length && /* @__PURE__ */ r(Jo, { label: "Loading review queue…" }),
                    We && !ue && /* @__PURE__ */ r(
                      zo,
                      {
                        message: We,
                        retryLabel: wt ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (wt && ee && De(ee) === "video") {
                            const ge = pr(ee);
                            Ur(ee.id, { ...ge, filter: { ...ge.filter, page: void 0 } }), Mt((He) => He + 1);
                            return;
                          }
                          ao();
                        }
                      }
                    ),
                    !oe && !ue && !We && !je.items.length && /* @__PURE__ */ c("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ r(Ca, {}),
                      /* @__PURE__ */ c("p", { children: [
                        "No ",
                        $,
                        "s match this review."
                      ] })
                    ] }),
                    !!je.items.length && /* @__PURE__ */ r("div", { ref: Fr, children: /* @__PURE__ */ r(
                      "div",
                      {
                        className: Jt === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${Xn}px` },
                        children: je.items.map(Gc)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ r("div", { className: "dq-bar-dock", ref: fe, children: /* @__PURE__ */ r(
                    Ks,
                    {
                      actions: me ? me.draft.actions : f.actions,
                      tagGroups: O,
                      trees: et,
                      isDisabled: Xi,
                      paused: !!me,
                      busy: oe || ue,
                      onApply: (ge) => void oa(ge),
                      onFind: () => nn(!0),
                      status: oe ? `Applying action to ${Pn}…` : "",
                      summary: /* @__PURE__ */ c(de, { children: [
                        /* @__PURE__ */ r("p", { className: "dq-bar-target", children: lt.size ? `${lt.size} selected` : ft == null ? "Nothing to apply to" : `Applies to the focused ${$}` }),
                        /* @__PURE__ */ c(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !pe.length || kc,
                            onClick: () => hn((ge) => /* @__PURE__ */ new Set([...ge, ...pe])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ r(at, { binding: Ac.selectAll, hidden: !0 })
                            ]
                          }
                        ),
                        /* @__PURE__ */ c(
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
                      hints: he.length ? he.join(" ") : void 0,
                      keyHints: w ? "Arrows move · Space selects · Enter opens" : me ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews",
                      notices: $t || xn ? /* @__PURE__ */ c(de, { children: [
                        $t && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ r(Cn, { "aria-hidden": "true" }),
                          tr
                        ] }),
                        xn && /* @__PURE__ */ r("p", { role: "status", className: "dq-status", children: xn })
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
  function Gc(f) {
    var $, x, H;
    if (we === "tag") {
      const Q = f;
      return /* @__PURE__ */ r(
        hf,
        {
          tag: Q,
          displayMode: Jt === "list" ? "list" : "grid",
          focused: Q.id === ft,
          selected: lt.has(Q.id),
          setRef: (he) => {
            he ? Dn.current.set(Q.id, he) : Dn.current.delete(Q.id);
          },
          onFocus: () => pt(Q.id),
          onToggle: () => {
            hn((he) => ma(he, Q.id)), mt(Q.id, !1);
          },
          onOpen: () => window.open(`/tag/${Q.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        Q.id
      );
    }
    const w = f;
    return /* @__PURE__ */ r(
      mf,
      {
        video: ju(w, se, ne.ids),
        showTagBins: ((x = ($ = se == null ? void 0 : se.presentation) == null ? void 0 : $.annotations) == null ? void 0 : x.includes("tags")) && !!((H = se.presentation.annotationParents) != null && H.length),
        displayMode: Jt,
        cardsScroll: aa,
        focused: w.id === ft,
        selected: lt.has(w.id),
        setRef: (Q) => {
          Q ? Dn.current.set(w.id, Q) : Dn.current.delete(w.id);
        },
        onFocus: () => pt(w.id),
        onToggle: () => hn((Q) => ma(Q, w.id)),
        onPreview: () => {
          me || (pt(w.id), Sn(!0));
        },
        onNavigate: e
      },
      w.id
    );
  }
}
function ff(e, t, n, a) {
  a(), n(t, e).catch(() => {
  });
}
function ma(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function pf(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function hf({
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
        ol,
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
function mf({
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
  onNavigate: u
}) {
  var k, b;
  const g = qc(e), m = R(null), N = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, y = !!(N.date || N.studioName), q = !!(N.performers.length || N.tags.length);
  return ln(() => {
    const O = m.current;
    if (!O) return;
    const F = O.querySelector(
      `a[href="/video/${e.id}"]`
    ), G = O.querySelector(".card-title"), K = `dq-card-title-${e.id}`;
    G && (G.id = K), F && (F.target = "_blank", F.rel = "noreferrer", F.removeAttribute("aria-label"), F.setAttribute("aria-labelledby", K), F.classList.add("dq-card-link"));
    const j = O.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    j && j.setAttribute(
      "aria-label",
      o ? `Deselect ${g}` : `Select ${g}`
    );
    const X = O.querySelector(
      'button[title="Quick View"]'
    );
    X && X.setAttribute("aria-label", `Preview ${g}`);
  }), /* @__PURE__ */ c(
    "article",
    {
      ref: (O) => {
        m.current = O, s(O);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${g}${o ? ", selected" : ""}`,
      onFocus: l,
      onClick: (O) => {
        l(), O.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${y ? "has-card-metadata" : "no-card-metadata"} ${q ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ r(
          sl,
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
        t && /* @__PURE__ */ c("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (k = e.tags) == null ? void 0 : k.map((O) => /* @__PURE__ */ r("span", { children: O.name }, O.id)),
          !((b = e.tags) != null && b.length) && /* @__PURE__ */ r("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ r(gf, { video: e, cardsScroll: a })
      ]
    }
  );
}
function gf({ video: e, cardsScroll: t }) {
  const n = R(null), a = R(null), [i, o] = A(!1), [s, l] = A(!1), [d, h] = A(!1);
  return J(() => {
    const u = n.current;
    if (!u || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      o(!0), l(!0);
      return;
    }
    const g = t ? u.closest(".dq-grid-stage") : null, m = new IntersectionObserver(
      ([y]) => o(y.isIntersecting),
      { root: g, rootMargin: "320px 0px", threshold: 0 }
    ), N = new IntersectionObserver(
      ([y]) => l(y.isIntersecting && y.intersectionRatio >= 0.6),
      { root: g, threshold: [0, 0.6, 1] }
    );
    return m.observe(u), N.observe(u), () => {
      m.disconnect(), N.disconnect();
    };
  }, [e.id, e.files.length, t]), J(() => {
    if (!i) {
      h(!1);
      return;
    }
    const u = new AbortController();
    return ce(Hl(e.id), {
      signal: u.signal
    }).then((g) => {
      u.signal.aborted || h(g.available === !0);
    }).catch(() => {
      u.signal.aborted || h(!1);
    }), () => u.abort();
  }, [i, e.id]), J(() => {
    const u = a.current;
    u && (s ? Promise.resolve(u.play()).catch(() => {
    }) : u.pause());
  }, [d, s]), /* @__PURE__ */ r("div", { ref: n, className: "dq-wall-autoplay", "aria-hidden": "true", children: d && /* @__PURE__ */ r(
    "video",
    {
      ref: a,
      src: Wl(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function bf({
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
  hasPrevious: u,
  hasNext: g,
  onToggleSelected: m,
  onPrevious: N,
  onNext: y,
  onClose: q,
  onAction: k,
  findOpen: b,
  onFindOpenChange: O
}) {
  const F = R(null), G = Zr(), K = R(null), j = e.files[0], X = qc(e), te = (v) => a || i || "steps" in v && v.steps.length > 0 && !s || zn(v) && !l;
  Fi({
    surface: "overlay",
    enabled: !b,
    actions: t.actions,
    onAction: (v) => {
      const E = t.actions[v];
      E && k(E);
    },
    onFind: () => O(!0)
  }), J(() => {
    var E;
    const v = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (E = F.current) == null || E.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = v;
    };
  }, []);
  function ie(v) {
    var D, W, Z;
    if (v.key !== "Tab") return;
    const E = [
      ...((D = F.current) == null ? void 0 : D.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((V) => V.offsetParent !== null);
    if (!E.length) {
      v.preventDefault(), (W = F.current) == null || W.focus();
      return;
    }
    const L = E.indexOf(
      document.activeElement
    );
    v.shiftKey && L <= 0 ? (v.preventDefault(), (Z = E.at(-1)) == null || Z.focus()) : !v.shiftKey && L === E.length - 1 && (v.preventDefault(), E[0].focus());
  }
  function re(v) {
    if (b || v.defaultPrevented || v.ctrlKey || v.metaKey || v.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const E = v.key === "ArrowLeft" || v.key === "ArrowRight";
    if (v.altKey && !E) return;
    const L = K.current, D = v.currentTarget.querySelector("video");
    if (v.key === "Enter" || v.key === "Escape")
      v.repeat || q();
    else if (v.key === " " && L)
      v.repeat || L.toggle();
    else if (E && L)
      L.seekBy(
        (v.key === "ArrowLeft" ? -1 : 1) * (v.shiftKey ? 5 : v.altKey ? 10 : 60)
      );
    else if ((v.key === "," || v.key === ".") && L) {
      const W = [j == null ? void 0 : j.duration, D == null ? void 0 : D.duration].find(
        (V) => V != null && Number.isFinite(V) && V > 0
      ) ?? 0, Z = e.parentVideoId != null ? (e.clipEndSec ?? W) - (e.clipStartSec ?? 0) : W;
      Number.isFinite(Z) && Z > 0 && L.seekBy((v.key === "," ? -1 : 1) * Z * 0.1);
    } else if (v.key.toLowerCase() === "n" || v.key.toLowerCase() === "m")
      !v.repeat && !a && !i && (v.key.toLowerCase() === "n" && u && N(), v.key.toLowerCase() === "m" && g && y());
    else if (v.key === "ArrowUp" && D)
      D.volume = Math.min(1, D.volume + 0.1);
    else if (v.key === "ArrowDown" && D)
      D.volume = Math.max(0, D.volume - 0.1);
    else return;
    Sr(v);
  }
  function _(v) {
    const E = F.current, L = v.target instanceof Element ? v.target.closest("button, a[href]") : null;
    !E || !L || !E.contains(L) || L.closest(".dq-player, .dq-find-action") || v.detail === 0 || E.focus({ preventScroll: !0 });
  }
  J(() => {
    if (b) return;
    let v = 0;
    const E = requestAnimationFrame(() => {
      v = requestAnimationFrame(() => {
        var D;
        const L = document.activeElement;
        (D = F.current) != null && D.isConnected && (!L || L === document.body || L === document.documentElement) && F.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(E), cancelAnimationFrame(v);
    };
  }, [b, a, i, g, u, e.id, G]);
  const B = n ? `the ${n} selected video${n === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ c(
    "div",
    {
      ref: F,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${X}`,
      className: `dq-preview${G ? " dq-preview-mobile" : ""}`,
      onKeyDown: ie,
      onKeyDownCapture: re,
      onMouseDown: (v) => {
        v.target === v.currentTarget && q();
      },
      onClick: _,
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
                disabled: !u || a || i,
                onClick: N,
                children: [
                  /* @__PURE__ */ r(Wr, { "aria-hidden": "true" }),
                  !G && /* @__PURE__ */ r(at, { binding: "n", hidden: !0 })
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
                onClick: y,
                children: [
                  !G && /* @__PURE__ */ r(at, { binding: "m", hidden: !0 }),
                  /* @__PURE__ */ r(os, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ c("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ r("h2", { children: X }),
              /* @__PURE__ */ c("p", { children: [
                "Actions apply to ",
                B
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
                  /* @__PURE__ */ r("span", { className: "dq-preview-check", "aria-hidden": "true", children: h && /* @__PURE__ */ r(ka, {}) }),
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
                "aria-label": `Open ${X} in a new tab`,
                title: "Open video in a new tab",
                children: /* @__PURE__ */ r(ls, { "aria-hidden": "true" })
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
          /* @__PURE__ */ r("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ r("div", { className: "dq-preview-video", children: j ? /* @__PURE__ */ r(
            Yo,
            {
              autostart: !0,
              streamUrl: ai("video", e.id),
              posterUrl: go(e),
              format: j.format,
              audioCodec: j.audioCodec,
              duration: j.duration ?? 0,
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
          ) : /* @__PURE__ */ r("img", { src: go(e), alt: "" }) }) }),
          o && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert dq-preview-alert", children: o }),
          !G && /* @__PURE__ */ c("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ r("span", { children: "Space play / pause" }),
            /* @__PURE__ */ r("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ r("span", { children: ", . ±10 %" }),
            /* @__PURE__ */ r("span", { children: "↑ ↓ volume" }),
            /* @__PURE__ */ r("span", { children: "N M previous / next" }),
            /* @__PURE__ */ r("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ r(
            Ks,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: d,
              isDisabled: te,
              busy: a || i,
              onApply: (v) => void k(v),
              onFind: () => O(!0),
              status: a ? `Applying action to ${B}…` : "",
              summary: /* @__PURE__ */ r("p", { className: "dq-bar-target", children: n ? `${n} selected` : "This video" })
            }
          )
        ] }),
        b && /* @__PURE__ */ r(
          Di,
          {
            actions: t.actions,
            trees: d,
            isDisabled: te,
            canStay: !1,
            onApply: (v) => {
              O(!1), k(v);
            },
            onClose: () => O(!1)
          }
        )
      ]
    }
  );
}
async function wf() {
  const e = await ce("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
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
function Jo({ label: e }) {
  return /* @__PURE__ */ c("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ r(bl, { className: "dq-spin" }),
    e
  ] });
}
function zo({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ c("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ r(Cn, {}),
    /* @__PURE__ */ r("p", { children: e }),
    /* @__PURE__ */ r("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const Ef = { components: { DataQualityPage: uf } };
export {
  uf as DataQualityPage,
  Ef as default,
  fr as objectFiltersEqual
};
