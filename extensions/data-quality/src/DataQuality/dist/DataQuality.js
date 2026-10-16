import { jsxs as u, Fragment as be, jsx as a } from "react/jsx-runtime";
import { useState as T, useRef as R, useEffect as Z, useLayoutEffect as kt, useMemo as Ne, useCallback as wn, useSyncExternalStore as Qi, useId as it, createContext as Ml, useContext as Fl, Fragment as Wi } from "react";
import { useKeySequence as xl, EntityReferenceMultiSelector as nr, SortableList as Ts, TagBadge as Pl, EntityReferenceSelector as _o, EntityDetailTabs as Ll, FilterDialog as Is, VIDEO_CRITERIA as Xa, DetailListToolbar as pa, PERFORMER_CRITERIA as Yi, AUDIO_CRITERIA as Rs, NarrativeText as Dl, AUDIO_SORT_OPTIONS as _l, VIDEO_SORT_OPTIONS as $s, AudioPlayer as jl, VideoPlayer as Os, formatDuration as Ms, getResolutionLabel as Ul, ConfirmDialog as Bl, TAG_CRITERIA as Kl, TAG_SORT_OPTIONS as Gl, TagTile as Vl, VideoCard as zl } from "@cove/runtime/components";
import { Search as ya, Flag as Fn, Check as Qr, Pencil as Jr, Ban as Va, ChevronDown as Xi, Plus as wa, Pin as Fs, GripVertical as xs, AlertTriangle as On, Copy as Ps, Trash2 as Za, X as va, Mic as Jl, Users as Ls, Tag as Ds, Headphones as _s, Film as ei, ChevronLeft as Na, MoreHorizontal as Hl, RectangleHorizontal as Ql, LayoutGrid as Zi, ChevronRight as js, Save as Wl, RotateCcw as Yl, Layers as jo, Undo2 as Xl, RefreshCw as Zl, ExternalLink as Us, SkipForward as ed, Upload as td, Download as Bs, ArrowUp as nd, ArrowDown as rd, Loader2 as ad, List as id, Grid3X3 as od } from "@cove/runtime/lucide-react";
import { extensionFetch as sd } from "@cove/runtime/api";
import { createPortal as cd } from "react-dom";
const eo = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, to = Object.keys(
  eo
);
function ha(e) {
  return e === "excludes" || e === "excludesAll";
}
function no(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
function Ks(e) {
  const t = [...e.performerFlags ?? []];
  for (const n of e.flagPerformerTagIds ?? [])
    t.some((r) => r.tagId === n && r.categoryTagId === void 0) || t.push({ tagId: n });
  return t;
}
function ld(e, t) {
  const { performerFlags: n, flagPerformerTagIds: r, ...i } = e, o = [];
  for (const s of t)
    o.some(
      (c) => c.tagId === s.tagId && c.categoryTagId === s.categoryTagId
    ) || o.push(
      s.categoryTagId === void 0 ? { tagId: s.tagId } : { tagId: s.tagId, categoryTagId: s.categoryTagId }
    );
  return o.length ? { ...i, performerFlags: o } : i;
}
const Gs = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function Re(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function ro(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function je(e) {
  return ro(_e(e));
}
function dd(e) {
  return _e(e) === "video";
}
function _e(e) {
  return e.entityType ?? "video";
}
const Zn = [
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
  "b",
  "n",
  "m",
  ",",
  "."
], ti = [
  Zn.slice(0, 11),
  Zn.slice(11, 22),
  Zn.slice(22)
];
function ua(e) {
  return e === "," ? "Comma" : e === "." ? "Period" : void 0;
}
function ma(e) {
  return ua(e) ?? e.toLocaleUpperCase();
}
const er = "none";
function Er(e) {
  return typeof e == "string" && Zn.includes(e);
}
function ao(e) {
  const t = e.shortcut;
  return Er(t) || t === er ? t : "auto";
}
function Vs(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), i = [];
  e.forEach((s, c) => {
    const d = ao(s);
    if (d !== er) {
      if (d !== "auto") {
        if (!n.has(d)) {
          n.set(d, c), t[c] = d;
          return;
        }
        r.add(c);
      }
      i.push(c);
    }
  });
  const o = Zn.filter((s) => !n.has(s));
  return i.forEach((s, c) => {
    const d = o[c];
    d !== void 0 && (t[s] = d, n.set(d, s));
  }), { keys: t, actionOn: n, duplicatePins: r };
}
function ud(e, t, n) {
  const { keys: r, actionOn: i } = Vs(e), o = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (Er(n)) {
    const c = i.get(n), d = r[t];
    c !== void 0 && c !== t && o.set(c, d && e[t].shortcut === d ? d : void 0);
  }
  const s = new Set([...o.values()].filter(Er));
  return e.map((c, d) => {
    const f = o.has(d) ? o.get(d) : Er(c.shortcut) && s.has(c.shortcut) ? void 0 : c.shortcut;
    if (f === c.shortcut) return c;
    const { shortcut: l, ...h } = c;
    return f === void 0 ? h : { ...h, shortcut: f };
  });
}
function ga(e) {
  var n;
  return Re(e) && !Js(e.occurrence) ? "Complete the optional occurrence condition before saving." : !dd(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : _e(e) !== "tag" && e.actions.some(
    (r) => io(r)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((r) => xn(r, _e(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((r) => r.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : (((n = e.presentation) == null ? void 0 : n.filterBins) ?? []).some((r) => !r.label.trim() || !Object.keys(r.filter).length) ? "Name every filter bin and give it a filter before saving." : "";
}
const fd = {
  video: 1e3,
  audio: 250
};
function Ht(e, t = "video") {
  const n = (r, i) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : i;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(fd[t], n(e.perPage, 40))
    )
  };
}
function Uo(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function Xn(e) {
  const { page: t, ...n } = e.view.filter, r = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    Re(e) ? [e.entityType, ...r, e.occurrence] : _e(e) === "video" ? r : [_e(e), ...r]
  );
}
function xn(e, t) {
  const n = t ?? ("effect" in e ? "tag" : "video");
  return e.label.trim() ? n === "tag" ? !("effect" in e) || "steps" in e || !e.effect || typeof e.effect != "object" ? !1 : ["SET_TAG_GROUP", "CLEAR_TAG_GROUP", "SKIP"].includes(
    e.effect.mode
  ) && (e.effect.mode !== "SET_TAG_GROUP" || Number.isSafeInteger(e.effect.tagGroupId) && e.effect.tagGroupId > 0) : !("steps" in e) || "effect" in e ? !1 : e.steps.every(
    (r) => [
      "ADD",
      "REMOVE",
      "REMOVE_TREE",
      "MARK_PRESENT",
      "MARK_ABSENT",
      "CLEAR_ABSENCE"
    ].includes(r.mode) && r.tagIds.length > 0 && r.tagIds.every((i) => Number.isSafeInteger(i) && i > 0)
  ) && !io(e) : !1;
}
function pd(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function Mn(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function ar(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function zs(e) {
  return "steps" in e && e.steps.length > 0;
}
function tr(e) {
  return "steps" in e ? e.steps.some((t) => Mn(t.mode)) : !1;
}
function io(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (Mn(n.mode))
      for (const r of n.tagIds) {
        const i = t.get(r);
        if (i && i !== n.mode) return !0;
        t.set(r, n.mode);
      }
  return !1;
}
function qa(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || Gs.includes(n.entityType)) && (!pd(n.entityType) || Js(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && hd(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (r) => typeof r == "string"
    )) && // Answer groups belong to actions that write tags; tag reviews have neither.
    (n.stayUntilGroupsAnswered === void 0 || typeof n.stayUntilGroupsAnswered == "boolean" && n.entityType !== "tag") && Array.isArray(n.actions) && n.actions.every(
      (r) => typeof (r == null ? void 0 : r.id) == "string" && typeof r.label == "string" && (r.shortcut === void 0 || typeof r.shortcut == "string") && (n.entityType === "tag" ? "effect" in r && !("steps" in r) && !("group" in r) && xn(r, "tag") : "steps" in r && !("effect" in r) && Array.isArray(r.steps) && r.steps.every(
        (i) => i && Array.isArray(i.tagIds)
      ) && (r.group === void 0 || typeof r.group == "string") && xn(r, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => ga(n)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((n) => n.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function hd(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= 115 && n.cardSize <= 380) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0 && n.filterBins === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (r) => ["date", "studio", "performers", "tags"].includes(r)
  )) && [n.annotationParents, n.binParents].every(
    (r) => r === void 0 || Array.isArray(r) && r.every((i) => Number.isSafeInteger(i) && i > 0)
  ) && (n.filterBins === void 0 || Array.isArray(n.filterBins) && n.filterBins.every(
    (r) => !!r && typeof r == "object" && typeof r.key == "string" && !!r.key && typeof r.label == "string" && (r.group === void 0 || typeof r.group == "string") && !!r.filter && typeof r.filter == "object" && !Array.isArray(r.filter)
  ) && new Set(n.filterBins.map((r) => r.key)).size === n.filterBins.length);
}
function Ti(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e)
    for (const i of r)
      n.has(i.id) || (n.add(i.id), t.push(i));
  return t;
}
function md(e, t) {
  const n = (c) => c.trim().toLocaleLowerCase(), r = new Set(t.map((c) => n(c.name))), i = e.trim(), o = i.replace(/ copy(?: \d+)?$/i, ""), s = `${o !== i && r.has(n(o)) ? o : i} copy`;
  for (let c = 1; ; c++) {
    const d = c === 1 ? s : `${s} ${c}`;
    if (!r.has(n(d))) return d;
  }
}
function gd(e, t, n) {
  return { ...structuredClone(e), id: n, name: md(e.name, t) };
}
function Js(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (r) => Array.isArray(r) && r.every((i) => Number.isSafeInteger(i) && i > 0) && new Set(r).size === r.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && to.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.performerFlags === void 0 || bd(t.performerFlags)) && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function bd(e) {
  if (!Array.isArray(e)) return !1;
  const t = (r) => Number.isSafeInteger(r) && r > 0, n = /* @__PURE__ */ new Set();
  return e.every((r) => {
    if (!r || typeof r != "object" || Array.isArray(r)) return !1;
    const { tagId: i, categoryTagId: o } = r;
    if (!t(i) || o !== void 0 && !t(o))
      return !1;
    const s = `${i}:${o ?? ""}`;
    return n.has(s) ? !1 : (n.add(s), !0);
  });
}
function Bo(e, t) {
  return e.size > 0 ? [...e].sort((n, r) => n - r) : t == null ? [] : [t];
}
function Ko(e, t, n, r) {
  if (t.length === 0) return null;
  if (n == null) return t[0];
  if (!r && t.includes(n)) return n;
  const i = Math.max(0, e.indexOf(n));
  if (r) {
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
function yd(e, t) {
  const n = new Set(e), r = t.length > 0 && t.every((i) => n.has(i));
  for (const i of t)
    r ? n.delete(i) : n.add(i);
  return n;
}
function wd(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function an(e) {
  const t = "nativeEvent" in e ? e.nativeEvent : e;
  return t.isComposing || t.keyCode === 229;
}
function vd(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function Nd(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function qd(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function Sd(e, t) {
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
const Hs = "ext:com.midnightrider.data-quality:configuration", kd = "ext:cove-data-quality:video-reviews", Ii = "ext:com.midnightrider.data-quality:progress";
class Qs extends Error {
}
const Sa = /* @__PURE__ */ new Map(), Pa = /* @__PURE__ */ new Map(), qr = (e, t) => e.includes("*") || e.includes(t), za = (e) => we(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Ed = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Ri(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Ur(e) {
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
    reviews: qa(JSON.stringify(t.reviews)),
    deletedIds: Ri(t.deletedIds),
    importedIds: Ri(t.importedIds)
  };
}
function Ad(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const r = /* @__PURE__ */ new Set();
  for (const i of t) {
    const o = localStorage.getItem(i);
    if (o !== null) {
      const s = qa(o);
      n ?? (n = s), s.forEach((c) => r.add(c.id));
    }
    Ri(
      JSON.parse(localStorage.getItem(`${i}:account-imports`) ?? "[]")
    ).forEach((s) => r.add(s));
  }
  return {
    reviews: n ?? [],
    known: [...r],
    present: n !== void 0
  };
}
async function Ws(e) {
  const t = await we("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function oo(e, t) {
  const n = (Pa.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Pa.set(e, n), n.finally(() => {
    Pa.get(e) === n && Pa.delete(e);
  }).catch(() => {
  }), n;
}
let ca = null;
function Cd() {
  if (ca) return ca;
  const e = Td();
  return ca = e, e.finally(() => {
    ca === e && (ca = null);
  }).catch(() => {
  }), e;
}
async function Td() {
  const e = await we("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return oo(t, () => Id(e, t));
}
async function Id(e, t) {
  var p;
  const n = String(e.user.id), r = qr(e.permissions, "savedfilters.read"), i = r && qr(e.permissions, "savedfilters.write"), o = r ? (await za(Hs)).filter((g) => g.name === "Data Quality configuration").sort((g, y) => g.id - y.id) : [];
  if (o.length > 1) {
    const g = (y) => {
      const { revision: N, ...v } = Ur(y.uiOptions);
      return JSON.stringify(v);
    };
    if (o.some((y) => g(y) !== g(o[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (i)
      for (const y of o.slice(1))
        await we(`/api/savedfilters/${y.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${y.id}` })
        });
    o.splice(1);
  }
  let s = o.length ? Ur(o[0].uiOptions) : Ed();
  const c = localStorage.getItem(`${t}:migrated`) === "true", d = localStorage.getItem(t), f = localStorage.getItem(`${t}:local-only`) === "true";
  !o.length && d && (s = Ur(d));
  let l = !o.length;
  if (o.length && f && d) {
    const g = Ur(d);
    if (g.reviews.some((N) => {
      const v = s.reviews.find((w) => w.id === N.id);
      return v && JSON.stringify(v) !== JSON.stringify(N);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const y = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...g.deletedIds])
    ];
    s = {
      ...s,
      reviews: Ti(s.reviews, g.reviews).filter(
        (N) => !y.includes(N.id)
      ),
      deletedIds: y,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...g.importedIds])
      ]
    }, l = !0;
  }
  if (!c) {
    const g = JSON.stringify(s), y = Ad(n);
    if (o.length && y.reviews.some((E) => {
      const O = s.reviews.find((F) => F.id === E.id);
      return O && JSON.stringify(O) !== JSON.stringify(E);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const N = r ? (await za(kd)).flatMap(
      (E) => qa(E.uiOptions ?? "[]")
    ) : [], v = y.known.filter(
      (E) => !y.reviews.some((O) => O.id === E)
    ), w = /* @__PURE__ */ new Set([...s.deletedIds, ...v]);
    s = {
      ...s,
      reviews: Ti(
        y.reviews,
        s.reviews,
        N.filter(
          (E) => !y.known.includes(E.id) && !s.importedIds.includes(E.id)
        )
      ).filter((E) => !w.has(E.id)),
      deletedIds: [...w],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...y.known,
          ...N.map((E) => E.id)
        ])
      ]
    }, l || (l = JSON.stringify(s) !== g);
  }
  const h = {
    userId: n,
    recordId: (p = o[0]) == null ? void 0 : p.id,
    config: s,
    readable: r,
    writable: i,
    durable: i
  };
  if (Sa.set(t, h), l && i) {
    const g = s;
    o.length && (h.config = Ur(o[0].uiOptions)), await Ys(t, g), s = h.config;
  } else o.length || (localStorage.setItem(t, JSON.stringify(s)), !r && (!c || f) && localStorage.setItem(`${t}:local-only`, "true"));
  if (!r) localStorage.setItem(`${t}:migrated`, "true");
  else if (i)
    try {
      localStorage.setItem(`${t}:migrated`, "true");
    } catch {
    }
  return {
    reviews: s.reviews,
    storageKey: t,
    canWrite: qr(e.permissions, "videos.write"),
    canWriteVideos: qr(e.permissions, "videos.write"),
    canWriteAudios: qr(e.permissions, "audios.write"),
    canWriteTags: qr(e.permissions, "tags.write"),
    canReadTagGroups: qr(e.permissions, "taggroups.read"),
    canConfigure: !r || i,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: r ? i ? "account" : "readOnly" : "browser",
    storageNotice: r ? i ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Ys(e, t) {
  const n = Sa.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const r = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await Ws(n), n.recordId != null) {
      const o = await we(
        `/api/savedfilters/${n.recordId}`
      );
      if (Ur(o.uiOptions).revision !== n.config.revision)
        throw new Qs(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const i = await we(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Hs,
          name: "Data Quality configuration",
          uiOptions: JSON.stringify(r)
        })
      }
    );
    n.recordId = i.id;
  } else
    localStorage.setItem(e, JSON.stringify(r)), localStorage.setItem(`${e}:local-only`, "true");
  if (n.config = r, n.durable)
    try {
      localStorage.setItem(e, JSON.stringify(r)), localStorage.setItem(`${e}:migrated`, "true"), localStorage.removeItem(`${e}:local-only`);
    } catch {
    }
}
function Rd(e, t) {
  return oo(e, async () => {
    const n = Sa.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const r = n.config.reviews, i = t(r);
    if (i === r) return r;
    qa(JSON.stringify(i));
    const o = r.filter((s) => !i.some((c) => c.id === s.id)).map((s) => s.id);
    return await Ys(e, {
      ...n.config,
      reviews: i,
      deletedIds: [
        .../* @__PURE__ */ new Set([...n.config.deletedIds, ...o])
      ].filter((s) => !i.some((c) => c.id === s))
    }), i;
  });
}
function Go(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, r]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(r)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function $d(e, t) {
  const n = Sa.get(e);
  if (!n) return null;
  const r = localStorage.getItem(`${e}:progress:${t}`), i = r ? Go(r) : null;
  if (!n.readable) return i;
  const o = (await za(Ii)).find(
    (c) => c.name === t
  ), s = o ? Go(o.uiOptions) : null;
  return i && (!s || i.updatedAt > s.updatedAt) ? i : s;
}
function Od(e, t, n) {
  const r = `${e}:progress:${t}`;
  try {
    localStorage.setItem(r, JSON.stringify(n));
  } catch {
  }
  return oo(r, async () => {
    const i = Sa.get(e);
    if (!(i != null && i.writable)) return;
    await Ws(i);
    const o = (await za(Ii)).find(
      (s) => s.name === t
    );
    await we(
      o ? `/api/savedfilters/${o.id}` : "/api/savedfilters",
      {
        method: o ? "PUT" : "POST",
        body: JSON.stringify({
          mode: Ii,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function ir(e) {
  return e === "audio" ? "audios" : "videos";
}
const Md = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function Nn(e) {
  return Md[e];
}
const Ja = "confirmed_absent_tags", so = "Confirmed absent tags", ni = "confirmed_absent_occurrence_tags", Xs = {
  key: Ja,
  label: so,
  type: "tag",
  subject: "tag assessments"
}, co = {
  key: ni,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, Fd = {
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
function Pn(e) {
  return Array.isArray(e) ? e.map(Pn) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? Fd[n] ?? n : t === "key" && typeof n == "string" && [
        Ja,
        ni
      ].includes(n.toLowerCase()) ? n.toLowerCase() : Pn(n)
    ])
  ) : e;
}
async function Zs(e, t, n) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await sd(e, { ...t, headers: r });
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
async function we(e, t = {}) {
  return await Zs(e, t, "fail");
}
function xd(e, t = {}) {
  return Zs(e, t, "null");
}
const Pd = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Ld = 0;
function Ha(e, t) {
  return we(
    `/api/${ir(e)}/${t}?dqRead=${Pd}-${++Ld}`,
    { cache: "no-store" }
  );
}
function ec(e, t) {
  const n = { ...e.view.objectFilter }, r = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    Pn({
      findFilter: Ht(t, je(e)),
      objectFilter: n,
      filterExpression: r
    })
  );
}
async function Kr(e, t, n) {
  return we(
    `/api/${ir(je(e))}/find`,
    { method: "POST", signal: n, body: ec(e, t) }
  );
}
async function tc(e, t, n) {
  return (await we(
    `/api/${ir(je(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: ec(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function gi(e, t, n) {
  const r = { ...e.view.objectFilter };
  return delete r._filterExpression, we("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      Pn({
        findFilter: Ht(t),
        objectFilter: r
      })
    )
  });
}
function Dd(e) {
  return we("/api/taggroups", { signal: e });
}
function $i(e, t, n = 1280) {
  return `/api/${ir(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function Oi(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function Vo(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function _d(e) {
  return `/api/stream/video/${e}/preview`;
}
function jd(e) {
  return `/api/stream/video/${e}/preview/status`;
}
async function ri(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) {
    await we(`/api/tags/${r}`, { signal: t }), n.add(r);
    for (let i = 1; ; i++) {
      const o = await we("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Pn({
            findFilter: { page: i, perPage: 1e3, sort: "id", direction: "asc" },
            objectFilter: {
              parentsCriterion: {
                value: [r],
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
async function lo(e, t) {
  const n = ar(e);
  return (await Promise.all(
    e.steps.map(
      async (i) => i.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await ri(i.tagIds, t)).filter(
          (o) => !n.has(o)
        )
      } : i
    )
  )).filter((i) => i.tagIds.length > 0);
}
function Ud(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function uo(e, t) {
  const r = (await we("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === e.key
  );
  if (!r)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const i = Ud(e, r);
  return i ? { kind: "incompatible", message: i } : r.entityTypes.includes(t) ? { kind: "ready", definition: r, message: "" } : {
    kind: "missing",
    message: `Add ${Nn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: r
  };
}
async function nc(e, t) {
  const n = await uo(e, t);
  if (n.kind !== "ready") {
    if (n.kind === "incompatible") throw new Error(n.message);
    if (n.definition) {
      await we(`/api/custom-fields/${n.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...n.definition.entityTypes, t])]
        })
      });
      return;
    }
    await we("/api/custom-fields", {
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
function rc(e = "video") {
  return uo(Xs, e);
}
function Bd(e = "video") {
  return nc(Xs, e);
}
function ac(e = "video") {
  return uo(co, e);
}
function Kd(e = "video") {
  return nc(co, e);
}
function Qa(e) {
  return [...new Set(e)];
}
function ic(e, t) {
  const n = e.customFields ?? {}, r = Object.keys(n).find(
    (o) => o.toLowerCase() === ni
  ), i = r === void 0 ? [] : n[r];
  return Qa(
    (Array.isArray(i) ? i : []).filter(
      (o) => typeof o == "string" && /^[1-9]\d*:[1-9]\d*$/.test(o)
    ).map((o) => o.split(":").map(Number)).filter(([o]) => o === t).map(([, o]) => o)
  );
}
async function Gd(e) {
  let t;
  try {
    t = await ac(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${co.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function Vd(e, t, n, r, i, o) {
  await we(`/api/${ir(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: Qa(i).map((s) => `${r}:${s}`)
      },
      customFieldMode: o
    })
  });
}
function zd(e, t, n) {
  const r = [...e.tagIds], i = (o) => {
    if (n === null)
      throw new Error(
        `The ${so} custom field is not available.`
      );
    return { customFields: { [n]: r }, customFieldMode: o };
  };
  switch (e.mode) {
    case "ADD":
      return { ids: t, tagIds: r, tagMode: "ADD" };
    case "REMOVE":
    case "REMOVE_TREE":
      return { ids: t, tagIds: r, tagMode: "REMOVE" };
    case "MARK_PRESENT":
      return { ids: t, tagIds: r, tagMode: "ADD", ...i("REMOVE") };
    case "MARK_ABSENT":
      return { ids: t, tagIds: r, tagMode: "REMOVE", ...i("ADD") };
    case "CLEAR_ABSENCE":
      return { ids: t, ...i("REMOVE") };
  }
}
async function oc(e, t, n) {
  if (!xn(t) || n.length === 0 || n.some((d) => !Number.isSafeInteger(d) || d <= 0))
    throw new Error(
      `Choose ${Nn(e).many} and configure a valid action first.`
    );
  let r = null;
  if (tr(t)) {
    let d;
    try {
      d = await rc(e);
    } catch (f) {
      throw new Error(
        `Could not verify the ${so} custom field. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
    if (d.kind !== "ready") throw new Error(d.message);
    r = d.definition.key;
  }
  const i = Qa(n), o = (await lo(t)).map((d) => ({
    mode: d.mode,
    tagIds: Qa(d.tagIds)
  })), c = [
    ...o.filter((d) => !Mn(d.mode)),
    ...o.filter((d) => Mn(d.mode))
  ].map(
    (d) => zd(d, i, r)
  );
  for (let d = 0; d < c.length; d++)
    try {
      await we(`/api/${ir(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(c[d])
      });
    } catch (f) {
      throw new Error(
        `Step ${d + 1} failed; ${d} earlier step(s) completed. Refresh and check the selected ${Nn(e).many} before retrying. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
}
async function Jd(e, t) {
  if (!xn(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await we("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const La = (e) => e >= "0" && e <= "9";
function zo(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function Jo(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let n = 0, r = 0;
  for (; n < e.length && r < t.length; ) {
    if (La(e[n]) && La(t[r])) {
      const c = n, d = r;
      for (; n < e.length && La(e[n]); ) n++;
      for (; r < t.length && La(t[r]); ) r++;
      const f = e.slice(c, n).replace(/^0+/, ""), l = t.slice(d, r).replace(/^0+/, "");
      if (f.length !== l.length) return f.length < l.length ? -1 : 1;
      if (f !== l) return f < l ? -1 : 1;
      continue;
    }
    const o = zo(e[n]), s = zo(t[r]);
    if (o !== s) return o < s ? -1 : 1;
    n++, r++;
  }
  const i = e.length - n - (t.length - r);
  return i !== 0 ? i < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function sc(e, t) {
  const n = (i) => i.tagGroupId != null ? 0 : 1, r = (i) => i.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(r(e) - r(t)) || Jo(e.tagGroupName, t.tagGroupName) || Jo(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function Ar(e) {
  return [...e].sort(sc);
}
const Mi = /* @__PURE__ */ new Map();
function Hd(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const r of n.steps)
        r.mode === "REMOVE_TREE" && r.tagIds.forEach((i) => t.add(i));
  return [...t];
}
function fo(e, t, n) {
  const r = ar(e), i = [], o = [];
  for (const p of e.steps) {
    if (p.mode !== "REMOVE_TREE") {
      o.push(p);
      continue;
    }
    const g = p.tagIds.flatMap((y) => {
      const N = n.get(y);
      return N || i.push(y), N ?? [y];
    });
    o.push({ mode: "REMOVE", tagIds: g.filter((y) => !r.has(y)) });
  }
  const s = [
    ...o.filter((p) => !Mn(p.mode)),
    ...o.filter((p) => Mn(p.mode))
  ], c = new Set(t.ids), d = new Set(t.absent);
  for (const p of s)
    for (const g of p.tagIds)
      switch (p.mode) {
        case "ADD":
          c.add(g);
          break;
        case "REMOVE":
        case "REMOVE_TREE":
          c.delete(g);
          break;
        case "MARK_PRESENT":
          c.add(g), d.delete(g);
          break;
        case "MARK_ABSENT":
          c.delete(g), d.add(g);
          break;
        case "CLEAR_ABSENCE":
          d.delete(g);
          break;
      }
  const f = new Set(t.ids), l = new Set(t.absent), h = [...new Set(e.steps.flatMap((p) => p.tagIds))];
  return {
    added: h.filter((p) => c.has(p) && !f.has(p)),
    removed: [...f].filter((p) => !c.has(p)),
    markedAbsent: h.filter((p) => d.has(p) && !l.has(p)),
    absenceCleared: [...l].filter((p) => !d.has(p)),
    unresolvedTrees: [...new Set(i)]
  };
}
function Qd(e) {
  let t;
  if (e.applications) {
    const n = /* @__PURE__ */ new Map();
    for (const r of e.applications)
      n.has(r.tag.id) || n.set(r.tag.id, r.tag);
    t = [...n.values()];
  } else
    t = e.tags ?? e.ids.map((n, r) => ({ id: n, name: e.names[r] ?? "" }));
  return Ar(t);
}
function cc(e) {
  return lc(Hd(e));
}
function lc(e) {
  const t = [...new Set(e)].sort((s, c) => s - c).join(","), [n, r] = T(() => /* @__PURE__ */ new Map()), i = R(/* @__PURE__ */ new Set()), o = R(!0);
  return Z(() => (o.current = !0, () => {
    o.current = !1;
  }), []), Z(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const c of s)
      i.current.has(c) || (i.current.add(c), ri([c]).then(
        (d) => {
          o.current && r((f) => new Map(f).set(c, d));
        },
        () => {
          i.current.delete(c);
        }
      ));
  }, [t]), n;
}
function bt(e) {
  return (e ?? "").trim().toLocaleLowerCase();
}
function Tr(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n, r) => {
    const i = bt(n.group);
    if (!i) return;
    const o = t.get(i);
    o ? o.actions.push(r) : t.set(i, { key: i, name: n.group.trim(), actions: [r] });
  }), [...t.values()];
}
function Ho(e) {
  return e.stayUntilGroupsAnswered === !0 && e.actions.some((t) => bt(t.group) !== "");
}
function dc(e) {
  return new Set(
    e.applications ? e.applications.map((t) => t.tag.id) : e.ids
  );
}
function uc(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "MARK_ABSENT").flatMap((t) => t.tagIds)
  );
}
function fc(e) {
  return ar(e).size > 0 || uc(e).size > 0;
}
function Wd(e) {
  return Tr(e).filter(
    (t) => !t.actions.some((n) => fc(e[n]))
  );
}
function Fi(e, t) {
  const n = dc(t), r = new Set(t.absent);
  return Tr(e).map((i) => {
    const o = [], s = [];
    for (const c of i.actions) {
      const d = [...ar(e[c])], f = [...uc(e[c])], l = [
        ...d.map((h) => n.has(h)),
        ...f.map((h) => r.has(h))
      ];
      l.some(Boolean) && (s.push(c), l.every(Boolean) && o.push(c));
    }
    return { ...i, answers: o.length ? o : s };
  });
}
function xi(e) {
  return e.filter((t) => t.answers.length === 0);
}
function Yd(e, t, n) {
  const r = { ids: [...dc(t)], absent: t.absent }, i = fo(e, r, n), o = new Set(i.removed), s = new Set(i.absenceCleared);
  return {
    ids: [...r.ids.filter((c) => !o.has(c)), ...i.added],
    absent: [...r.absent.filter((c) => !s.has(c)), ...i.markedAbsent]
  };
}
const Gr = "review";
function Xd(e) {
  return [...new Set(e.map((t) => t.tagId))];
}
function Zd(e) {
  return [
    ...new Set(e.flatMap((t) => t.categoryTagId === void 0 ? [] : [t.categoryTagId]))
  ];
}
function Sr(e, t) {
  const n = new Set(Xd(e));
  return t.filter((r) => n.has(r.id));
}
function Qo(e, t, n) {
  const r = /* @__PURE__ */ new Map(), i = (s, c) => {
    const d = r.get(s) ?? c();
    return r.set(s, d), d;
  };
  for (const s of Sr(e, t))
    for (const c of e) {
      if (c.tagId !== s.id) continue;
      const d = c.categoryTagId === void 0 ? i(Gr, () => ({
        key: Gr,
        name: "",
        tagIds: null,
        flags: [],
        mixed: []
      })) : i(`tag:${c.categoryTagId}`, () => {
        const { name: f, tagIds: l, resolved: h } = n(c.categoryTagId);
        return {
          key: `tag:${c.categoryTagId}`,
          name: f,
          tagIds: l,
          flags: [],
          mixed: [],
          ...h ? {} : { unresolved: !0 }
        };
      });
      d.flags.includes(s.name) || d.flags.push(s.name);
    }
  const o = [...r.values()];
  return [
    ...o.filter((s) => s.key === Gr),
    ...o.filter((s) => s.key !== Gr)
  ];
}
function Pi(e, t, n) {
  return e !== n.key && e.startsWith("tag:") && n.members.every((r) => t.includes(r));
}
function po(e) {
  const t = e.flatMap((i) => i.mixed), n = (i, o) => t.some(
    (s, c) => Pi(s.key, s.members, i) && !(c > o && Pi(i.key, i.members, s))
  ), r = /* @__PURE__ */ new Map();
  return t.forEach((i, o) => {
    !r.has(i.key) && !n(i, o) && r.set(i.key, {
      key: i.key,
      name: i.name,
      tagIds: i.members,
      flags: [],
      mixed: i.tags
    });
  }), [...r.values()];
}
function eu(e, t) {
  return t.filter(
    (n) => n.key === e.key || Pi(n.key, n.tagIds ?? [], e)
  );
}
function pc(...e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e.flat()) {
    const i = t.get(r.key);
    if (!i) {
      t.set(r.key, { ...r, flags: [...r.flags] });
      continue;
    }
    for (const o of r.flags) i.flags.includes(o) || i.flags.push(o);
    i.mixed.length || (i.mixed = r.mixed), i.unresolved && !r.unresolved && delete i.unresolved, i.tagIds !== null && r.tagIds !== null && (i.tagIds = [.../* @__PURE__ */ new Set([...i.tagIds, ...r.tagIds])]);
  }
  const n = [...t.values()];
  return [
    ...n.filter((r) => r.key === Gr),
    ...n.filter((r) => r.key !== Gr)
  ];
}
function tu(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e.steps)
    if (r.mode !== "CLEAR_ABSENCE")
      for (const i of r.tagIds)
        for (const o of r.mode === "REMOVE_TREE" ? t.get(i) ?? [i] : [i])
          n.add(o);
  return n;
}
function hc(e, t, n) {
  if (t.tagIds === null) return !0;
  const r = tu(e, n);
  return t.tagIds.some((i) => r.has(i));
}
function nu(e, t, n) {
  return t.filter(
    (r) => r.tagIds === null || r.unresolved && e.length > 0 || e.some((i) => hc(i, r, n))
  );
}
function ru(e, t, n) {
  return t.filter((r) => r.tagIds !== null && hc(e, r, n));
}
function au(e) {
  return `Mixed: ${e.map((t) => `${t.name} ${t.count.toLocaleString()}`).join(" · ")}`;
}
function ho(e) {
  return [
    ...e.flags.length ? [`Flagged: ${e.flags.join(", ")}`] : [],
    ...e.mixed.length ? [au(e.mixed)] : []
  ];
}
function iu(e) {
  const t = ho(e).join("; ");
  return e.tagIds === null ? t : `${e.name} (${t})`;
}
function ou(e, t, n) {
  const r = Sr(e, t).map((i) => {
    const o = e.filter((c) => c.tagId === i.id);
    if (o.every((c) => c.categoryTagId === void 0)) return i.name;
    const s = o.map(
      (c) => c.categoryTagId === void 0 ? "whole review" : n(c.categoryTagId)
    );
    return `${i.name} (affects ${[...new Set(s)].join(", ")})`;
  });
  return r.length ? `Flagged: ${r.join(", ")}` : "";
}
const Li = "-", Wo = "Ctrl+a", su = "Ctrl/⌘A", cu = ["f", "g", "k", "n", "m", ",", "."], bi = "Shift+", mc = {
  ",": [";", "<"],
  ".": [":", ">"]
}, lu = new Set(Object.values(mc).flat()), Yo = { Comma: ",", Period: "." };
function du(e) {
  const t = typeof window > "u" ? void 0 : window.event;
  if (!(!(t instanceof KeyboardEvent) || t.type !== "keydown" || e && t.target !== e.target || !t.shiftKey))
    return Object.hasOwn(Yo, t.code) ? Yo[t.code] : void 0;
}
function Wr(e) {
  return Ne(() => Vs(e), [e]);
}
function mo({
  surface: e,
  enabled: t,
  actions: n,
  onAction: r,
  onFind: i,
  onSelectAll: o
}) {
  const s = Wr(n), c = R({ keyMap: s, onAction: r, onFind: i, onSelectAll: o });
  kt(() => {
    c.current = { keyMap: s, onAction: r, onFind: i, onSelectAll: o };
  });
  const d = !!i && n.length > 0, f = e === "local" && !!o, l = Zn.filter(
    (p) => s.actionOn.has(p) || cu.includes(p)
  ).join(" "), h = Ne(() => {
    const p = (N, v) => {
      var E, O;
      const w = c.current;
      if (N === Wo) (E = w.onSelectAll) == null || E.call(w);
      else if (N === Li) (O = w.onFind) == null || O.call(w);
      else {
        const F = lu.has(N), B = F || N.startsWith(bi), C = F ? du(v) : B ? N.slice(bi.length) : N, L = C === void 0 ? void 0 : w.keyMap.actionOn.get(C);
        L !== void 0 && w.onAction(L, B);
      }
    }, g = (N, v = e) => ({
      keys: N,
      surface: v,
      action: (w) => {
        w != null && w.repeat || p((w == null ? void 0 : w.sequence) ?? N, w);
      }
    }), y = [];
    f && y.push(g(Wo, "local")), d && y.push(g(Li));
    for (const N of l ? l.split(" ") : []) {
      const v = mc[N];
      y.push(g(N), ...(v ?? [`${bi}${N}`]).map((w) => g(w)));
    }
    return y;
  }, [e, l, d, f]);
  xl(h, t);
}
const uu = {
  find: Li,
  selectAll: su
};
function go() {
  return uu;
}
const fu = 600 * 1e3, bo = /* @__PURE__ */ new Map(), gc = /* @__PURE__ */ new Map(), Yn = /* @__PURE__ */ new Map();
function bc(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = gc.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function yc(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && gc.set(e.tagGroupId, e.tagGroupSortOrder), bo.set(e.id, { tag: e, at: Date.now() });
}
function wc(e) {
  const t = bo.get(e);
  if (!(!t || Date.now() - t.at > fu))
    return bc(t.tag);
}
function vc(e) {
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
function Di(e) {
  var t;
  for (const n of e) {
    const r = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && r && yc(vc({ ...n, name: r }));
  }
}
function pu(e) {
  const t = Yn.get(e);
  if (t) return t;
  const n = new AbortController(), r = {
    controller: n,
    waiters: 0,
    promise: we(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (i) => {
        var l, h;
        const o = ((l = i == null ? void 0 : i.name) == null ? void 0 : l.trim()) || null;
        if (Yn.get(e) === r && Yn.delete(e), !o) return null;
        const s = vc({ ...i, id: e, name: o }), c = (h = bo.get(e)) == null ? void 0 : h.tag, d = (c == null ? void 0 : c.tagGroupId) === s.tagGroupId, f = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (d ? c == null ? void 0 : c.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (c == null ? void 0 : c.hasImage),
          imagePath: s.imagePath ?? (c == null ? void 0 : c.imagePath)
        };
        return yc(f), bc(f);
      },
      () => (Yn.get(e) === r && Yn.delete(e), null)
    )
  };
  return Yn.set(e, r), r;
}
function Xo() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function yi(e) {
  const t = {};
  for (const n of e) {
    const r = wc(n);
    r !== void 0 && (t[n] = r);
  }
  return t;
}
function hu(e, t) {
  if (t != null && t.aborted) return Promise.reject(Xo());
  const n = {}, r = [];
  for (const i of new Set(e)) {
    const o = wc(i);
    if (o !== void 0) n[i] = o;
    else {
      const s = pu(i);
      s.waiters += 1, r.push({ id: i, entry: s });
    }
  }
  return r.length ? new Promise((i, o) => {
    let s = !1;
    const c = () => {
      for (const { id: f, entry: l } of r)
        l.waiters -= 1, l.waiters === 0 && Yn.get(f) === l && (Yn.delete(f), l.controller.abort());
    }, d = () => {
      s || (s = !0, c(), o(Xo()));
    };
    t == null || t.addEventListener("abort", d, { once: !0 }), Promise.all(
      r.map(
        ({ id: f, entry: l }) => l.promise.then((h) => [f, h])
      )
    ).then((f) => {
      if (!s) {
        s = !0, t == null || t.removeEventListener("abort", d), c();
        for (const [l, h] of f) n[l] = h;
        i(n);
      }
    });
  }) : Promise.resolve(n);
}
function Nc(e) {
  const t = {};
  for (const [n, r] of Object.entries(e)) t[Number(n)] = (r == null ? void 0 : r.name) ?? null;
  return t;
}
function ka(e) {
  const t = [...new Set(e)].sort((i, o) => i - o).join(","), [n, r] = T(() => ({
    key: t,
    tags: yi(wi(t))
  }));
  return Z(() => {
    const i = wi(t), o = yi(i);
    if (r({ key: t, tags: o }), i.every((c) => c in o)) return;
    const s = new AbortController();
    return hu(i, s.signal).then(
      (c) => r({ key: t, tags: c }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : yi(wi(t));
}
function Yr(e) {
  const t = ka(e);
  return Ne(() => Nc(t), [t]);
}
function wi(e) {
  return e ? e.split(",").map(Number) : [];
}
const mu = "(max-width: 760px)";
function qc(e) {
  const [t] = T(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = wn(
    (r) => (t == null || t.addEventListener("change", r), () => t == null ? void 0 : t.removeEventListener("change", r)),
    [t]
  );
  return Qi(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function Ea() {
  return qc(mu);
}
function gu(e, t, n = !1) {
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
function Rr(e, t, n = [], r) {
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
  const i = ar(e), o = (s) => i.has(s) || [...i].some((c) => {
    var d;
    return (d = r == null ? void 0 : r.get(s)) == null ? void 0 : d.includes(c);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (c) => gu(
        s.mode,
        t[c] === void 0 ? "…" : t[c] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && o(c)
      )
    )
  );
}
function ai(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function yo({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: r,
  canStay: i = !0,
  tapStays: o = !1,
  onApply: s,
  onClose: c
}) {
  const d = Ea(), [f, l] = T(""), [h, p] = T(0), g = R(null), y = R(null), N = R(null), v = R(null), w = R(null), E = R(/* @__PURE__ */ new Set()), O = it(), F = Yr(Ne(() => ai(e), [e])), B = Wr(e), C = Ne(() => {
    const _ = f.trim().toLocaleLowerCase(), V = (M) => M ? Zn.indexOf(M) : Zn.length;
    return e.map((M, D) => ({ action: M, index: D, key: B.keys[D] })).sort((M, D) => V(M.key) - V(D.key)).filter((M) => !_ || M.action.label.toLocaleLowerCase().includes(_));
  }, [e, B, f]), L = C.length ? Math.min(h, C.length - 1) : -1, x = (_) => `${O}-option-${_}`;
  kt(() => {
    var _, V, M;
    return v.current = document.activeElement, w.current = ((V = (_ = N.current) == null ? void 0 : _.parentElement) == null ? void 0 : V.closest('[role="dialog"]')) ?? null, (M = g.current) == null || M.focus({ preventScroll: !0 }), () => {
      var P;
      const D = v.current;
      D instanceof HTMLElement && D.isConnected && D.focus({ preventScroll: !0 }), document.activeElement !== D && ((P = w.current) != null && P.isConnected) && w.current.focus({ preventScroll: !0 });
    };
  }, []), Z(() => {
    var _, V, M;
    L < 0 || (M = (V = (_ = y.current) == null ? void 0 : _.querySelector(`[id="${x(C[L].index)}"]`)) == null ? void 0 : V.scrollIntoView) == null || M.call(V, { block: "nearest" });
  }, [L, C]);
  function ae(_, V) {
    !_ || r != null && r(_.action) || s(_.action, i && V);
  }
  function H(_) {
    var M;
    _.stopPropagation();
    const V = _.code || _.key;
    if (_.repeat || E.current.add(V), !an(_)) {
      if (_.repeat && !E.current.has(V)) {
        _.preventDefault();
        return;
      }
      if (_.key === "Escape")
        _.preventDefault(), _.repeat || c();
      else if (_.key === "Enter")
        _.preventDefault(), _.repeat || ae(C[L], _.shiftKey);
      else if (_.key === "ArrowDown" || _.key === "ArrowUp") {
        if (_.preventDefault(), !C.length) return;
        const D = _.key === "ArrowDown" ? 1 : -1;
        p((L + D + C.length) % C.length);
      } else _.key === "Tab" && (_.preventDefault(), (M = g.current) == null || M.focus());
    }
  }
  return /* @__PURE__ */ u(be, { children: [
    /* @__PURE__ */ a("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: c }),
    /* @__PURE__ */ u(
      "div",
      {
        ref: N,
        role: "dialog",
        "aria-label": "Find an action",
        className: `dq-find-action${d ? " dq-find-mobile" : ""}`,
        onKeyDown: H,
        onMouseDown: (_) => {
          _.target !== g.current && _.preventDefault();
        },
        children: [
          /* @__PURE__ */ u("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ a(ya, { "aria-hidden": "true" }),
            /* @__PURE__ */ a(
              "input",
              {
                ref: g,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${O}-list`,
                "aria-activedescendant": L >= 0 ? x(C[L].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: f,
                onChange: (_) => {
                  l(_.target.value), p(0);
                }
              }
            ),
            !d && /* @__PURE__ */ a("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          C.length ? /* @__PURE__ */ a(
            "ul",
            {
              ref: y,
              id: `${O}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: C.map((_, V) => /* @__PURE__ */ a("li", { role: "none", children: /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: x(_.index),
                  tabIndex: -1,
                  "aria-selected": V === L,
                  disabled: (r == null ? void 0 : r(_.action)) ?? !1,
                  onClick: (M) => ae(_, M.shiftKey || o && zs(_.action)),
                  children: [
                    d ? null : _.key ? /* @__PURE__ */ u(be, { children: [
                      /* @__PURE__ */ a("kbd", { "aria-hidden": ua(_.key) ? !0 : void 0, children: _.key }),
                      ua(_.key) && /* @__PURE__ */ u(be, { children: [
                        /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ua(_.key) }),
                        " "
                      ] })
                    ] }) : /* @__PURE__ */ a("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ a("span", { className: "dq-find-label", children: _.action.label }),
                    /* @__PURE__ */ a("span", { className: "dq-find-effect", children: Rr(_.action, F, t, n).map(
                      (M, D) => /* @__PURE__ */ a("span", { "data-effect-tone": M.tone, children: M.text }, D)
                    ) })
                  ]
                }
              ) }, _.action.id))
            }
          ) : /* @__PURE__ */ u("p", { className: "dq-find-empty", role: "status", children: [
            "No action matches “",
            f.trim(),
            "”."
          ] }),
          !d && /* @__PURE__ */ u("p", { className: "dq-find-hints", "aria-hidden": "true", children: [
            /* @__PURE__ */ u("span", { children: [
              /* @__PURE__ */ a("kbd", { children: "Enter" }),
              " applies"
            ] }),
            i && /* @__PURE__ */ u("span", { children: [
              /* @__PURE__ */ a("kbd", { children: "Shift" }),
              /* @__PURE__ */ a("kbd", { children: "Enter" }),
              " applies and stays"
            ] }),
            /* @__PURE__ */ u("span", { children: [
              /* @__PURE__ */ a("kbd", { children: "↑" }),
              /* @__PURE__ */ a("kbd", { children: "↓" }),
              " choose"
            ] })
          ] })
        ]
      }
    )
  ] });
}
function Sc() {
  let e = null;
  const t = /* @__PURE__ */ new Set(), n = (r) => {
    r !== e && (e = r, t.forEach((i) => i()));
  };
  return {
    get: () => e,
    set: n,
    clear: (r) => {
      e === r && n(null);
    },
    subscribe: (r) => (t.add(r), () => t.delete(r))
  };
}
function wo(e) {
  return Qi(e.subscribe, e.get, e.get);
}
function kc(e, t) {
  const n = R(t);
  kt(() => {
    n.current !== t && (n.current = t, e.set(null));
  }, [e, t]);
}
function Ec(e, t) {
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
const bu = [], _i = ti.map(
  (e, t) => ({ indent: t, keys: e })
), Zo = _i.length - 1;
function yt({ binding: e, hidden: t }) {
  const n = t ? void 0 : ua(e), r = /* @__PURE__ */ a(
    "kbd",
    {
      className: Array.from(e).length === 1 ? "dq-key dq-key-letter" : "dq-key",
      "aria-hidden": t || n ? !0 : void 0,
      children: e
    }
  );
  return n ? /* @__PURE__ */ u(be, { children: [
    r,
    /* @__PURE__ */ a("span", { className: "dq-sr-only", children: n })
  ] }) : r;
}
function Da(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function Ac(e) {
  return ti.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
    (t) => t.length > 0
  );
}
function Cc({
  groups: e,
  renderAction: t,
  find: n
}) {
  const r = e.length ? e : [[]];
  return /* @__PURE__ */ a(be, { children: r.map((i, o) => /* @__PURE__ */ u("div", { className: "dq-mobile-group", children: [
    i.map(t),
    o === r.length - 1 && n
  ] }, o)) });
}
function Tc({
  extra: e,
  findKey: t,
  disabled: n,
  onFind: r
}) {
  return /* @__PURE__ */ u(
    "button",
    {
      type: "button",
      className: "dq-mobile-tile dq-mobile-find",
      "aria-label": e > 0 ? `Find, ${e} more` : "Find",
      "aria-keyshortcuts": t,
      disabled: n,
      onClick: r,
      children: [
        /* @__PURE__ */ u("span", { className: "dq-mobile-find-name", children: [
          /* @__PURE__ */ a(ya, { "aria-hidden": "true" }),
          "Find"
        ] }),
        e > 0 && /* @__PURE__ */ u("span", { className: "dq-mobile-more", children: [
          e,
          " more"
        ] })
      ]
    }
  );
}
function yu({
  groups: e,
  statuses: t,
  actions: n,
  attentionOf: r
}) {
  return /* @__PURE__ */ a(
    "ul",
    {
      className: "dq-group-checklist",
      "aria-label": "Answer groups",
      title: "A plain action moves on once every group has an answer",
      children: (t ?? e).map((i) => {
        const o = t ? i.answers : null, s = o ? o.length ? "answered" : "open" : "unknown", c = o == null ? void 0 : o.map((l) => n[l].label).join(", "), d = r(i), f = s === "answered" ? `${i.name}: ${c}` : s === "open" ? `${i.name}: not answered yet` : i.name;
        return /* @__PURE__ */ u(
          "li",
          {
            className: "dq-group",
            "data-state": s,
            "data-attention": d ? !0 : void 0,
            title: d ? `${f}. Needs attention: ${d}` : f,
            children: [
              /* @__PURE__ */ a("span", { className: "dq-group-name", children: i.name }),
              d && /* @__PURE__ */ u("span", { className: "dq-group-flag", children: [
                /* @__PURE__ */ a(Fn, { "aria-hidden": "true" }),
                /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
                  ", needs attention: ",
                  d
                ] })
              ] }),
              s === "answered" && /* @__PURE__ */ u(be, { children: [
                /* @__PURE__ */ a(Qr, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", answered:" }),
                " ",
                /* @__PURE__ */ a("span", { className: "dq-group-answer", children: c })
              ] }),
              s === "open" && /* @__PURE__ */ u(be, { children: [
                /* @__PURE__ */ a("span", { className: "dq-group-ring", "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", not answered yet" })
              ] })
            ]
          },
          i.key
        );
      })
    }
  );
}
function wu({ checked: e, onChange: t }) {
  return /* @__PURE__ */ u(
    "button",
    {
      type: "button",
      role: "switch",
      "aria-checked": e,
      className: "dq-stay-switch",
      onClick: () => t(!e),
      children: [
        /* @__PURE__ */ a("span", { className: "dq-stay-track", "aria-hidden": "true" }),
        "Stay on this item"
      ]
    }
  );
}
function vu({
  actions: e,
  isDisabled: t,
  busy: n,
  tags: r,
  trees: i,
  preview: o,
  onApply: s,
  onFind: c,
  findDisabled: d,
  paused: f = !1,
  waitForGroups: l = !1,
  attention: h = bu,
  stayOnTap: p = !1,
  onStayOnTapChange: g
}) {
  const y = go(), N = Wr(e), v = Ea();
  kc(o, v);
  const w = it(), E = Yr(
    Ne(() => e.flatMap((S) => S.steps.flatMap((ce) => ce.tagIds)), [e])
  ), O = _i.filter((S) => S.keys.some((ce) => N.actionOn.has(ce))), F = O.includes(_i[Zo]), B = e.length - N.actionOn.size, C = Ne(
    () => l && !f ? Tr(e) : [],
    [l, f, e]
  ), L = Ne(
    () => C.length && r ? Fi(e, r) : null,
    [C, e, r]
  ), x = new Map(
    xi(L ?? []).flatMap(
      (S) => S.actions.filter((ce) => fc(e[ce])).map((ce) => [ce, S.name])
    )
  ), ae = Ne(
    () => e.map((S) => f ? [] : ru(S, h, i)),
    [e, h, i, f]
  ), H = (S) => S.map(iu).join("; "), _ = ae.map(H), V = C.length > 0 && /* @__PURE__ */ a(
    yu,
    {
      groups: C,
      statuses: L,
      actions: e,
      attentionOf: (S) => H([
        ...new Map(
          S.actions.flatMap((ce) => ae[ce]).map((ce) => [ce.key, ce])
        ).values()
      ])
    }
  ), M = (S) => {
    const ce = Rr(e[S], E, [], i).map((ue) => ue.text).join(", "), A = x.get(S), X = _[S];
    return [
      ce,
      A === void 0 ? "" : `${A}: not answered yet`,
      X ? `Needs attention: ${X}` : ""
    ].filter(Boolean).join(". ");
  }, D = (S) => _[S] ? (
    // The tile's description says it; the mark is for the eye, with the reasons on hover.
    /* @__PURE__ */ a(
      "span",
      {
        className: "dq-pad-flag",
        "aria-hidden": "true",
        title: `Needs attention: ${_[S]}`,
        children: /* @__PURE__ */ a(Fn, {})
      }
    )
  ) : null, P = (S) => ({
    onMouseEnter: () => o.set(S),
    onMouseLeave: () => o.clear(S),
    onFocus: () => o.set(S),
    onBlur: () => o.clear(S)
  }), Y = (S) => {
    const ce = N.actionOn.get(S), A = ce === void 0 ? void 0 : e[ce];
    if (!A)
      return /* @__PURE__ */ a(
        "div",
        {
          className: "dq-pad-slot dq-pad-free",
          "aria-hidden": "true",
          title: "No action on this key: it does nothing here",
          children: /* @__PURE__ */ a(yt, { binding: S, hidden: !0 })
        },
        S
      );
    const X = t(A), ue = `${w}-effect-${S}`;
    return /* @__PURE__ */ u("div", { className: "dq-pad-slot", ...f ? {} : P(A), children: [
      /* @__PURE__ */ a("span", { id: ue, className: "dq-sr-only", children: M(ce) }),
      /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: A.label,
          "aria-keyshortcuts": S,
          "aria-describedby": ue,
          "data-group-open": x.has(ce) || void 0,
          "data-attention": _[ce] ? !0 : void 0,
          disabled: X,
          onClick: (pe) => s(A, pe.shiftKey),
          children: [
            /* @__PURE__ */ a(yt, { binding: S }),
            " ",
            /* @__PURE__ */ a("span", { className: "dq-pad-label", children: A.label }),
            Da(A) && " ",
            Da(A) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(Va, { "aria-hidden": "true" }),
              "absent"
            ] }),
            D(ce)
          ]
        }
      )
    ] }, S);
  }, W = /* @__PURE__ */ u("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ a(Jr, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (v) {
    const S = Ac(N), ce = (A) => {
      const X = e[A], ue = N.keys[A];
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: X.label,
          "aria-keyshortcuts": ue,
          "aria-describedby": `${w}-effect-${ue}`,
          "data-group-open": x.has(A) || void 0,
          "data-attention": _[A] ? !0 : void 0,
          disabled: t(X),
          onClick: (pe) => {
            o.clear(X), s(X, pe.shiftKey || p && zs(X));
          },
          ...f ? {} : Ec(o, X),
          children: [
            /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: X.label }),
            Da(X) && " ",
            Da(X) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(Va, { "aria-hidden": "true" }),
              "absent"
            ] }),
            D(A)
          ]
        },
        ue
      );
    };
    return /* @__PURE__ */ u(
      "section",
      {
        className: `dq-pad dq-pad-mobile${f ? " dq-pad-paused" : ""}`,
        "aria-label": f ? "Actions, paused while editing" : "Actions",
        "aria-busy": n || void 0,
        children: [
          /* @__PURE__ */ u("div", { className: "dq-pad-header", children: [
            f ? W : /* @__PURE__ */ a(
              es,
              {
                actions: e,
                keyMap: N,
                names: E,
                tags: r,
                trees: i,
                preview: o,
                findKey: y.find,
                mobile: !0
              }
            ),
            g && /* @__PURE__ */ a(wu, { checked: p, onChange: g })
          ] }),
          V,
          /* @__PURE__ */ a("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ a(
            Cc,
            {
              groups: S,
              renderAction: ce,
              find: /* @__PURE__ */ a(
                Tc,
                {
                  extra: B,
                  findKey: y.find,
                  disabled: d,
                  onFind: c
                }
              )
            }
          ) }),
          /* @__PURE__ */ a("div", { hidden: !0, children: S.flat().map((A) => /* @__PURE__ */ a("span", { id: `${w}-effect-${N.keys[A]}`, children: M(A) }, A)) })
        ]
      }
    );
  }
  const oe = /* @__PURE__ */ u("span", { className: "dq-pad-hint", children: [
    /* @__PURE__ */ a("kbd", { className: "dq-key", children: "Shift" }),
    /* @__PURE__ */ a("span", { children: "+ key or Shift-click applies and stays" })
  ] }), Q = !F && /* @__PURE__ */ u(
    "button",
    {
      type: "button",
      className: "dq-pad-find-button",
      "aria-label": B ? `Find action, ${B} more` : "Find action",
      "aria-keyshortcuts": y.find,
      disabled: d,
      onClick: c,
      children: [
        /* @__PURE__ */ a(yt, { binding: y.find }),
        /* @__PURE__ */ a("span", { "aria-hidden": "true", children: "Find action" })
      ]
    }
  );
  return /* @__PURE__ */ u(
    "section",
    {
      className: `dq-pad${f ? " dq-pad-paused" : ""}`,
      "aria-label": f ? "Actions, paused while editing" : "Actions",
      "aria-busy": n || void 0,
      children: [
        /* @__PURE__ */ u("div", { className: `dq-pad-header${V ? " dq-pad-header-groups" : ""}`, children: [
          f ? W : /* @__PURE__ */ a(
            es,
            {
              actions: e,
              keyMap: N,
              names: E,
              tags: r,
              trees: i,
              preview: o,
              findKey: y.find
            }
          ),
          V ? (
            // The checklist, then the hint and Find action, on the header's second line, under the
            // effect line: the pad keeps its height as answers of any length come in.
            /* @__PURE__ */ u("div", { className: "dq-pad-header-end", children: [
              V,
              oe,
              Q
            ] })
          ) : /* @__PURE__ */ u(be, { children: [
            !f && oe,
            Q
          ] })
        ] }),
        O.map((S) => /* @__PURE__ */ u("div", { className: "dq-pad-row", "data-indent": S.indent, children: [
          S.keys.map(Y),
          S.indent === Zo && /* @__PURE__ */ a("div", { className: "dq-pad-slot", children: /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": B ? `Find action, ${B} more` : "Find action",
              "aria-keyshortcuts": y.find,
              disabled: d,
              onClick: c,
              children: [
                /* @__PURE__ */ a(yt, { binding: y.find }),
                /* @__PURE__ */ u("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ a(ya, { "aria-hidden": "true" }),
                  B ? `${B} more` : "Find action"
                ] })
              ]
            }
          ) })
        ] }, S.indent))
      ]
    }
  );
}
function es({
  actions: e,
  keyMap: t,
  names: n,
  tags: r,
  trees: i,
  preview: o,
  findKey: s,
  mobile: c = !1
}) {
  const d = wo(o), f = d ? e.indexOf(d) : -1;
  if (!d || f < 0) {
    const g = t.actionOn.size;
    return /* @__PURE__ */ u("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      !c && g < e.length && /* @__PURE__ */ u(be, { children: [
        ` · ${g} on keys, ${e.length - g} more under `,
        /* @__PURE__ */ a(yt, { binding: s })
      ] })
    ] });
  }
  const l = t.keys[f], h = r && d.steps.length ? fo(d, r, i) : null, p = h && !h.unresolvedTrees.length && ![h.added, h.removed, h.markedAbsent, h.absenceCleared].some(
    (g) => g.length
  );
  return /* @__PURE__ */ u("p", { className: "dq-pad-effect", children: [
    l && !c && /* @__PURE__ */ a(yt, { binding: l }),
    /* @__PURE__ */ a("strong", { children: d.label }),
    Rr(d, n, [], i).map((g, y) => /* @__PURE__ */ a("span", { "data-effect-tone": g.tone, children: g.text }, y)),
    p && /* @__PURE__ */ a("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function Ic({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: r,
  busy: i,
  onApply: o,
  onFind: s,
  summary: c,
  hints: d,
  keyHints: f,
  notices: l,
  status: h,
  className: p = "",
  paused: g = !1
}) {
  const y = go(), N = Wr(e), v = Ea(), w = it(), E = Yr(Ne(() => ai(e), [e])), [O] = T(() => Sc());
  kc(O, v);
  const F = R(null), B = Nu(F, e, !v), C = Ac(N);
  !C.length && e.length && C.push([]);
  const L = C.flat(), x = e.length - L.length, ae = (M) => Rr(M, E, t, n).map((D) => D.text).join(", "), H = (M) => ({
    onMouseEnter: () => O.set(M),
    onMouseLeave: () => O.clear(M),
    onFocus: () => O.set(M),
    onBlur: (D) => {
      D.currentTarget.contains(D.relatedTarget) || O.clear(M);
    }
  }), _ = d ?? (v ? void 0 : f), V = (M) => {
    const D = e[M];
    return /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-mobile-tile",
        title: D.label,
        "aria-keyshortcuts": N.keys[M] || void 0,
        "aria-describedby": `${w}-effect-${M}`,
        disabled: g || r(D),
        onClick: () => {
          O.clear(D), o(D);
        },
        ...g ? {} : Ec(O, D),
        children: /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: D.label })
      },
      D.id
    );
  };
  return /* @__PURE__ */ u(
    "section",
    {
      ref: F,
      className: `dq-action-bar${v ? " dq-bar-mobile" : B ? " dq-bar-stacked" : ""}${i ? " dq-bar-busy" : ""}${g ? " dq-bar-paused" : ""}${p ? ` ${p}` : ""}`,
      "aria-label": "Actions",
      children: [
        /* @__PURE__ */ a("div", { className: "dq-bar-summary", children: c }),
        /* @__PURE__ */ a("span", { className: "dq-bar-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ u(
          "div",
          {
            className: `dq-bar-tiles${v ? " dq-mobile-actions" : ""}`,
            "aria-busy": i || void 0,
            children: [
              v && e.length > 0 && /* @__PURE__ */ a(
                Cc,
                {
                  groups: C,
                  renderAction: V,
                  find: /* @__PURE__ */ a(
                    Tc,
                    {
                      extra: x,
                      findKey: y.find,
                      disabled: g,
                      onFind: s
                    }
                  )
                }
              ),
              !v && C.map((M, D) => /* @__PURE__ */ u("div", { className: "dq-bar-line", children: [
                M.map((P) => {
                  const Y = e[P], W = N.keys[P];
                  return /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: Y.label,
                      "aria-keyshortcuts": W || void 0,
                      "aria-describedby": `${w}-effect-${P}`,
                      disabled: g || r(Y),
                      onClick: () => o(Y),
                      ...g ? {} : H(Y),
                      children: [
                        W && /* @__PURE__ */ a(yt, { binding: W }),
                        " ",
                        /* @__PURE__ */ a("span", { className: "dq-bar-label", children: Y.label })
                      ]
                    },
                    Y.id
                  );
                }),
                D === C.length - 1 && /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-bar-tile dq-bar-find",
                    "aria-label": x > 0 ? `Find action, ${x} more` : "Find action",
                    "aria-keyshortcuts": y.find,
                    disabled: g,
                    onClick: s,
                    children: [
                      /* @__PURE__ */ a(yt, { binding: y.find, hidden: !0 }),
                      /* @__PURE__ */ a(ya, { "aria-hidden": "true" }),
                      /* @__PURE__ */ a("span", { className: "dq-bar-label", children: x > 0 ? `${x} more` : "Find action" })
                    ]
                  }
                )
              ] }, D)),
              !e.length && /* @__PURE__ */ a("p", { className: "dq-bar-empty", children: "This review has no actions." })
            ]
          }
        ),
        _ && /* @__PURE__ */ a("p", { className: "dq-bar-hints", children: _ }),
        g ? /* @__PURE__ */ u("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ a(Jr, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ a(
          qu,
          {
            actions: e,
            keyMap: N,
            preview: O,
            names: E,
            tagGroups: t,
            trees: n,
            showKey: !v
          }
        ),
        l && /* @__PURE__ */ a("div", { className: "dq-bar-notices", children: l }),
        /* @__PURE__ */ a("div", { hidden: !0, children: L.map((M) => /* @__PURE__ */ a("span", { id: `${w}-effect-${M}`, children: ae(e[M]) }, e[M].id)) }),
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: h })
      ]
    }
  );
}
function Nu(e, t, n) {
  const [r, i] = T(!1);
  return kt(() => {
    var l;
    const o = e.current;
    if (!o || !n || typeof ResizeObserver > "u") return;
    const s = o.querySelector(".dq-bar-summary"), c = () => {
      const h = getComputedStyle(o), p = parseFloat(h.columnGap) || 0, g = o.clientWidth - (parseFloat(h.paddingLeft) || 0) - (parseFloat(h.paddingRight) || 0), y = [...o.querySelectorAll(".dq-bar-line")].map(
        (L) => [...L.children].map((x) => x.offsetWidth)
      ), N = o.querySelector(".dq-bar-line"), v = N && parseFloat(getComputedStyle(N).columnGap) || 0, w = o.querySelector(".dq-bar-hints"), E = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (w ? w.offsetWidth + p : 0) + 1 + // the divider
      2 * p, O = (L) => y.map((x) => {
        let ae = 1, H = 0;
        for (const _ of x)
          H > 0 && H + v + _ > L ? (ae += 1, H = _) : H += (H > 0 ? v : 0) + _;
        return ae;
      }), F = (L) => Math.max(1, L.reduce((x, ae) => x + ae, 0)), B = O(g), C = F(O(g - E));
      i(
        1 + F(B) < C || 1 + F(B) === C && B.every((L) => L === 1)
      );
    }, d = new ResizeObserver(c);
    d.observe(o);
    for (const h of o.querySelectorAll(".dq-bar-summary, .dq-bar-tiles, .dq-bar-hints"))
      d.observe(h);
    c();
    let f = !0;
    return (l = document.fonts) == null || l.ready.then(() => {
      f && c();
    }), () => {
      f = !1, d.disconnect();
    };
  }, [e, t, n]), r;
}
function qu({
  actions: e,
  keyMap: t,
  preview: n,
  names: r,
  tagGroups: i,
  trees: o,
  showKey: s
}) {
  const c = wo(n), d = c ? e.indexOf(c) : -1;
  if (!c || d < 0) return null;
  const f = t.keys[d];
  return /* @__PURE__ */ u("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    f && s && /* @__PURE__ */ a(yt, { binding: f }),
    /* @__PURE__ */ a("strong", { children: c.label }),
    Rr(c, r, i, o).map((l, h) => /* @__PURE__ */ a("span", { "data-effect-tone": l.tone, children: l.text }, h))
  ] });
}
const ts = 1e3;
async function Su(e, t, n) {
  const r = await we(
    `/api/tags/${t}`,
    { signal: n }
  ), i = /* @__PURE__ */ new Map();
  for (let d = 1; ; d++) {
    const f = await we(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          Pn({
            findFilter: {
              page: d,
              perPage: ts,
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
    for (const l of f.items) i.set(l.id, l);
    if (d * ts >= f.totalCount) break;
    if (!f.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const o = [...i.values()], s = je(e), c = Re(e) ? await Eu(
    s,
    o.map((d) => d.id),
    n
  ) : o.map((d) => (s === "audio" ? d.audioCount : d.videoCount) ?? 0);
  return {
    parent: { id: t, name: r.name },
    children: o.map((d, f) => ({ id: d.id, name: d.name, uses: c[f] })).sort(
      (d, f) => f.uses - d.uses || d.name.localeCompare(f.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      })
    )
  };
}
function ku(e) {
  return JSON.stringify(
    Pn({
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
async function Eu(e, t, n) {
  const r = new Array(t.length).fill(0), i = new AbortController(), o = () => i.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && o(), n == null || n.addEventListener("abort", o, { once: !0 });
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; s < t.length && !i.signal.aborted; ) {
            const c = s++;
            r[c] = (await we(
              `/api/${ir(e)}/aggregate`,
              {
                method: "POST",
                signal: i.signal,
                body: ku(t[c])
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
  return i.signal.throwIfAborted(), r;
}
function Au(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((r) => t.has(r.id) ? !1 : (t.add(r.id), !0))
  }));
}
function Cu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of n.children)
      t.set(r.id, [...t.get(r.id) ?? [], n.parent.id]);
  return t;
}
function Tu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of ar(n))
      t.set(r, [...t.get(r) ?? [], n]);
  return t;
}
function Iu(e, t, n) {
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
function Ru(e, t) {
  var r;
  const n = bt(e);
  return ((r = Tr(t).find((i) => i.key === n)) == null ? void 0 : r.name) ?? e.trim();
}
const $u = (e) => e instanceof Error ? e.message : "Request failed.";
function Ou({
  id: e,
  review: t,
  disabled: n,
  onAdd: r,
  onCancel: i
}) {
  const [o, s] = T([]), [c, d] = T({}), [f, l] = T({}), [h, p] = T({}), g = R(/* @__PURE__ */ new Map());
  Z(
    () => () => {
      for (const M of g.current.values()) M.abort();
    },
    []
  );
  const y = Nn(je(t)), N = Re(t), v = N ? "performer" : y.one;
  function w(M) {
    var P;
    (P = g.current.get(M)) == null || P.abort();
    const D = new AbortController();
    g.current.set(M, D), d((Y) => ({ ...Y, [M]: { status: "loading" } })), Su(t, M, D.signal).then(
      (Y) => {
        D.signal.aborted || d((W) => ({
          ...W,
          [M]: { status: "ready", group: Y }
        }));
      },
      (Y) => {
        D.signal.aborted || d((W) => ({
          ...W,
          [M]: { status: "failed", message: $u(Y) }
        }));
      }
    );
  }
  function E(M) {
    var oe;
    const D = o.filter((Q) => !M.includes(Q));
    for (const Q of D)
      (oe = g.current.get(Q)) == null || oe.abort(), g.current.delete(Q);
    const P = (Q) => {
      const S = c[Q];
      return (S == null ? void 0 : S.status) === "ready" ? S.group.children.map((ce) => ce.id) : [];
    }, Y = new Set(M.flatMap(P)), W = D.flatMap(P).filter((Q) => !Y.has(Q));
    l(
      (Q) => Object.fromEntries(
        Object.entries(Q).filter(([S]) => !W.includes(Number(S)))
      )
    ), p(
      (Q) => Object.fromEntries(
        Object.entries(Q).filter(([S]) => M.includes(Number(S)))
      )
    ), d(
      (Q) => Object.fromEntries(
        Object.entries(Q).filter(([S]) => M.includes(Number(S)))
      )
    ), s(M);
    for (const Q of M) o.includes(Q) || w(Q);
  }
  const O = o.flatMap((M) => {
    const D = c[M];
    return (D == null ? void 0 : D.status) === "ready" ? [D.group] : [];
  }), F = O.length === o.length, B = o.some(
    (M) => {
      var D;
      return (((D = c[M]) == null ? void 0 : D.status) ?? "loading") === "loading";
    }
  ), C = new Map(
    Au(O).map((M) => [M.parent.id, M])
  ), L = Cu(O), x = new Map(O.map((M) => [M.parent.id, M.parent.name])), ae = Tu(t.actions), H = (M) => f[M] ?? !ae.has(M), _ = F ? [...C.values()].flatMap((M) => {
    const D = Ru(M.parent.name, t.actions);
    return M.children.filter((P) => H(P.id)).map((P) => ({ child: P, answerGroup: D }));
  }) : [], V = (M, D) => l((P) => ({
    ...P,
    ...Object.fromEntries(M.children.map((Y) => [Y.id, D]))
  }));
  return /* @__PURE__ */ u("fieldset", { id: e, className: "dq-actions-from-tags", children: [
    /* @__PURE__ */ a("legend", { children: "Add actions from parent tags" }),
    /* @__PURE__ */ u("p", { className: "dq-drawer-note", children: [
      "Each ticked child tag becomes an action that adds it, most used",
      " ",
      N ? "on performers " : "",
      "first, in a group named after its parent. Tags an action already adds start unticked. The new actions go at the end, ready to reorder and edit."
    ] }),
    /* @__PURE__ */ a(
      nr,
      {
        entityType: "tag",
        values: o,
        onChange: E,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    o.map((M) => {
      const D = c[M];
      if (!D || D.status === "loading")
        return /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Loading child tags…" }, M);
      if (D.status === "failed")
        return /* @__PURE__ */ u("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ u("span", { children: [
            "Child tags could not be loaded. ",
            D.message
          ] }),
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: n,
              onClick: () => w(M),
              children: "Retry"
            }
          )
        ] }, M);
      const P = C.get(M);
      if (!P) return null;
      const Y = P.parent.name;
      return /* @__PURE__ */ u("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ a("legend", { children: Y }),
        D.group.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ u(be, { children: [
          /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ a(
              "input",
              {
                type: "checkbox",
                checked: h[M] ?? !1,
                disabled: n,
                onChange: (W) => p((oe) => ({
                  ...oe,
                  [M]: W.target.checked
                }))
              }
            ),
            "Only one per ",
            v,
            ": each action removes every other tag in the ",
            Y,
            " tree"
          ] }),
          P.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ u(be, { children: [
            /* @__PURE__ */ u("div", { className: "dq-row", children: [
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${Y}`,
                  onClick: () => V(P, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${Y}`,
                  onClick: () => V(P, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ a("div", { className: "dq-child-tags", children: P.children.map((W) => {
              const oe = ae.get(W.id) ?? [], Q = (L.get(W.id) ?? []).filter((S) => S !== M).map((S) => `“${x.get(S)}”`);
              return /* @__PURE__ */ u("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ a(
                  "input",
                  {
                    type: "checkbox",
                    checked: H(W.id),
                    disabled: n,
                    onChange: (S) => l((ce) => ({
                      ...ce,
                      [W.id]: S.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ u("span", { children: [
                  W.name,
                  " ",
                  /* @__PURE__ */ u("small", { children: [
                    W.uses.toLocaleString(),
                    " ",
                    W.uses === 1 ? y.one : y.many
                  ] }),
                  Q.length > 0 && /* @__PURE__ */ u("small", { children: [
                    " · Also under ",
                    Q.join(", ")
                  ] }),
                  oe.length > 0 && /* @__PURE__ */ u("small", { children: [
                    " ",
                    "· Already in “",
                    oe[0].label || "New action",
                    "”",
                    oe.length > 1 ? ` and ${oe.length - 1} more` : ""
                  ] })
                ] })
              ] }, W.id);
            }) })
          ] })
        ] })
      ] }, M);
    }),
    /* @__PURE__ */ u("div", { className: "dq-row", children: [
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: n || !_.length,
          onClick: () => r(
            _.map(
              ({ child: M, answerGroup: D }) => Iu(
                M,
                (L.get(M.id) ?? []).filter(
                  (P) => h[P]
                ),
                D
              )
            )
          ),
          children: _.length ? `Add ${_.length} action${_.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: i, children: "Cancel" }),
      /* @__PURE__ */ a("span", { role: "status", className: "dq-sr-only", children: B ? "Loading child tags…" : "" })
    ] })
  ] });
}
function Mu(e, t, n, r) {
  const i = bt(n), o = [{ kind: "none", name: "", selected: !i }];
  if (r === null) {
    for (const c of e)
      o.push({ kind: "group", name: c, selected: bt(c) === i });
    return o;
  }
  const s = bt(r);
  for (const c of t)
    bt(c).includes(s) && o.push({ kind: "group", name: c, selected: bt(c) === i });
  return s && !t.some((c) => bt(c) === s) && o.push({ kind: "new", name: r.trim(), selected: s === i }), o;
}
function Fu(e) {
  return e.kind === "group" ? `group:${bt(e.name)}` : e.kind;
}
function xu(e) {
  const { group: t, ...n } = e;
  return n;
}
const Pu = /* @__PURE__ */ new Set([
  "Shift",
  "Control",
  "Alt",
  "AltGraph",
  "Meta",
  "OS",
  "Super",
  "Hyper",
  "Fn",
  "FnLock",
  "Symbol",
  "SymbolLock",
  "CapsLock",
  "NumLock",
  "ScrollLock"
]), Lu = /* @__PURE__ */ new Set(["Escape", "Enter", "Tab", "ArrowUp", "ArrowDown"]), _a = 4, ns = 240;
function Du(e) {
  const t = [];
  for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) {
    const r = getComputedStyle(n);
    (r.overflowX !== "visible" || r.overflowY !== "visible") && t.push(n);
  }
  return t;
}
function _u(e, t, n, r) {
  for (const o of r) {
    const s = o.getBoundingClientRect();
    if (n.bottom < s.top || n.top > s.bottom || n.right < s.left || n.left > s.right)
      return !1;
  }
  if (typeof document.elementFromPoint != "function") return !0;
  const i = document.elementFromPoint(n.left + n.width / 2, n.top + n.height / 2);
  return !i || e.contains(i) || t.contains(i);
}
function ju({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: r,
  onChange: i
}) {
  const o = it(), s = it(), c = it(), d = R(null), f = R(null), l = R(null), h = R(null), p = R(null), g = R([]), y = R(!1), N = R(!1), [v, w] = T(!1), [E, O] = T(null), [F, B] = T(null), [C, L] = T(!1), x = e.group ?? "", ae = Ne(
    () => Mu(t, n, x, E),
    [t, n, x, E]
  ), H = ae.map(Fu), _ = F === null ? -1 : H.indexOf(F), V = (A) => `${s}-option-${A}`, M = (A) => i(A ? { ...e, group: A } : xu(e)), D = () => {
    var X;
    const A = ((X = l.current) == null ? void 0 : X.value) ?? x;
    A.trim() !== A && M(A.trim());
  };
  function P(A) {
    O(null), B(A), w(!0);
  }
  const Y = (A) => {
    var X, ue;
    return A instanceof Node && (((X = d.current) == null ? void 0 : X.contains(A)) || ((ue = h.current) == null ? void 0 : ue.contains(A))) === !0;
  };
  function W() {
    var A, X;
    (A = h.current) != null && A.contains(document.activeElement) && ((X = p.current) == null || X.focus({ preventScroll: !0 })), w(!1), O(null), B(null), L(!1);
  }
  function oe(A) {
    A.kind === "group" && A.selected && E === null || M(A.kind === "none" ? "" : A.name), W();
  }
  function Q() {
    const A = f.current, X = h.current;
    if (!A || !X) return;
    const ue = A.getBoundingClientRect(), pe = window.visualViewport, G = (pe == null ? void 0 : pe.offsetTop) ?? 0, Ce = (pe ? pe.offsetTop + pe.height : window.innerHeight) - ue.bottom - _a, Se = ue.top - G - _a, ve = Math.min(X.scrollHeight, ns), Je = Ce < ve && Se > Ce;
    X.style.left = `${ue.left}px`, X.style.width = `${ue.width}px`, X.style.top = `${Je ? ue.top - _a : ue.bottom + _a}px`, X.style.transform = Je ? "translateY(-100%)" : "", X.style.maxHeight = `${Math.max(0, Math.min(ns, Je ? Se : Ce))}px`, _u(A, X, ue, g.current) || W();
  }
  kt(() => {
    var A;
    v && (f.current && (g.current = Du(f.current)), N.current && ((A = h.current) == null || A.focus({ preventScroll: !0 }), L(!0)), N.current = !1);
  }, [v]), kt(() => {
    v && Q();
  }), Z(() => {
    if (!v) return;
    const A = () => Q(), X = (G) => {
      Y(G.target) || W();
    }, ue = [...g.current, window], pe = window.visualViewport;
    for (const G of ue) G.addEventListener("scroll", A);
    return window.addEventListener("resize", A), pe == null || pe.addEventListener("resize", A), pe == null || pe.addEventListener("scroll", A), document.addEventListener("pointerdown", X), () => {
      for (const G of ue) G.removeEventListener("scroll", A);
      window.removeEventListener("resize", A), pe == null || pe.removeEventListener("resize", A), pe == null || pe.removeEventListener("scroll", A), document.removeEventListener("pointerdown", X);
    };
  }, [v]), Z(() => {
    var A, X, ue;
    _ >= 0 && ((ue = (X = (A = h.current) == null ? void 0 : A.children[_]) == null ? void 0 : X.scrollIntoView) == null || ue.call(X, { block: "nearest" }));
  }, [_]);
  function S(A) {
    if (an(A)) return;
    const X = A.key === "ArrowDown" || A.key === "ArrowUp";
    if (X && !v) {
      if (A.altKey && A.key === "ArrowUp") return;
      A.preventDefault(), P(A.altKey ? null : bt(x) ? `group:${bt(x)}` : "none");
      return;
    }
    if (v)
      if (X) {
        if (A.preventDefault(), A.altKey) {
          A.key === "ArrowUp" && W();
          return;
        }
        const ue = A.key === "ArrowDown" ? 1 : -1, pe = E !== null && bt(E) && H.length > 1 ? 1 : 0, G = _ < 0 ? ue > 0 ? pe : H.length - 1 : (_ + ue + H.length) % H.length;
        B(H[G]);
      } else A.key === "Enter" && (A.preventDefault(), _ >= 0 ? oe(ae[_]) : (D(), W()));
  }
  function ce(A) {
    var ue;
    if (A.key === "Tab") {
      W(), A.shiftKey && ((ue = l.current) == null || ue.focus());
      return;
    }
    if (A.key === "Dead" || A.key === "Process" || an(A) && !Lu.has(A.key) || A.key === "Backspace" || A.key === "Delete" || [...A.key].length === 1 && !A.metaKey && (!A.ctrlKey || A.altKey)) {
      const pe = l.current;
      pe && (pe.focus(), pe.setSelectionRange(pe.value.length, pe.value.length));
      return;
    }
    !Pu.has(A.key) && !an(A) && L(!1), S(A);
  }
  return /* @__PURE__ */ u(
    "div",
    {
      onKeyDown: (A) => {
        !v || A.key !== "Escape" || an(A) || (A.preventDefault(), A.stopPropagation(), W());
      },
      children: [
        /* @__PURE__ */ u("div", { ref: d, className: "dq-action-field", children: [
          /* @__PURE__ */ a(
            "label",
            {
              className: "dq-action-field-name",
              htmlFor: o,
              onMouseDown: (A) => {
                v && A.preventDefault();
              },
              children: "Group"
            }
          ),
          /* @__PURE__ */ u("div", { ref: f, className: "dq-combobox", children: [
            /* @__PURE__ */ a(
              "input",
              {
                ref: l,
                id: o,
                className: "dq-input dq-action-group-input",
                role: "combobox",
                "aria-expanded": v,
                "aria-controls": v ? s : void 0,
                "aria-autocomplete": "list",
                "aria-activedescendant": v && _ >= 0 ? V(_) : void 0,
                "aria-describedby": c,
                placeholder: "No group",
                autoComplete: "off",
                spellCheck: !1,
                value: x,
                onChange: (A) => {
                  M(A.target.value), O(A.target.value), B(null), w(!0);
                },
                onClick: () => {
                  v || P(null);
                },
                onKeyDown: S,
                onBlur: () => {
                  W(), D();
                }
              }
            ),
            /* @__PURE__ */ a(
              "button",
              {
                ref: p,
                type: "button",
                className: "dq-combobox-toggle",
                tabIndex: -1,
                "aria-label": "Show groups",
                "aria-expanded": v,
                "aria-controls": v ? s : void 0,
                onPointerDown: (A) => {
                  y.current = A.pointerType === "touch";
                },
                onMouseDown: (A) => A.preventDefault(),
                onClick: () => {
                  var ue;
                  const A = y.current;
                  y.current = !1;
                  const X = document.activeElement === l.current;
                  v ? W() : (N.current = A && !X, P(null)), (!A || X) && ((ue = l.current) == null || ue.focus());
                },
                children: /* @__PURE__ */ a(Xi, { "aria-hidden": "true" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ a("p", { className: "dq-actions-hint dq-action-field-help", id: c, children: r ? "A group is one question with one answer per item; when a chosen performer's items hold two different answers of a group, Existing answers marks it Mixed." : "A group is one question with one answer per item." }),
        v && cd(
          /* @__PURE__ */ a(
            "ul",
            {
              ref: h,
              id: s,
              role: "listbox",
              "aria-label": "Groups",
              className: "dq-combobox-list",
              tabIndex: -1,
              "aria-activedescendant": _ >= 0 ? V(_) : void 0,
              "data-tap-focus": C || void 0,
              onMouseDown: (A) => A.preventDefault(),
              onKeyDown: ce,
              onBlur: (A) => {
                Y(A.relatedTarget) || W();
              },
              children: ae.map((A, X) => /* @__PURE__ */ u(
                "li",
                {
                  id: V(X),
                  role: "option",
                  "aria-selected": A.selected,
                  className: "dq-combobox-option",
                  "data-kind": A.kind,
                  "data-active": X === _ || void 0,
                  onMouseMove: () => {
                    X !== _ && B(H[X]);
                  },
                  onClick: () => oe(A),
                  children: [
                    A.kind === "new" && /* @__PURE__ */ a(wa, { "aria-hidden": "true" }),
                    /* @__PURE__ */ a("span", { className: "dq-combobox-option-name", children: A.kind === "none" ? "No group" : A.kind === "new" ? `New group “${A.name}”` : A.name }),
                    A.selected && /* @__PURE__ */ a(Qr, { className: "dq-combobox-check", "aria-hidden": "true" })
                  ]
                },
                H[X]
              ))
            }
          ),
          document.body
        )
      ]
    }
  );
}
const Wn = [
  ...ti,
  ["auto", er]
];
function Rc(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : ao(e[n]);
}
function Uu({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: i
}) {
  const [o, s] = T(!1), c = R(null), d = n.keys[t], f = Rc(e, n, t), l = Er(f), h = n.duplicatePins.has(t) ? ` (${ma(e[t].shortcut ?? "")} is pinned twice)` : "", p = d ? `${ma(d)}, ${l ? "pinned" : "Auto"}${h}` : f === er ? "no key, Find action only" : `no key: Auto found no free key${h}`, g = () => {
    var y;
    s(!1), (y = c.current) == null || y.focus();
  };
  return /* @__PURE__ */ u(be, { children: [
    /* @__PURE__ */ u(
      "button",
      {
        ref: c,
        type: "button",
        className: "dq-key-button",
        "aria-label": `Key for ${r}: ${p}`,
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        title: "Choose the key",
        onClick: () => s(!o),
        children: [
          d ? /* @__PURE__ */ a(yt, { binding: d }) : /* @__PURE__ */ a("span", { className: "dq-key dq-key-none", children: "·" }),
          l && /* @__PURE__ */ a(Fs, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ a(
      Bu,
      {
        actions: e,
        index: t,
        keyMap: n,
        name: r,
        onChoose: (y) => {
          i(y), g();
        },
        onClose: g
      }
    )
  ] });
}
function Bu({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: i,
  onClose: o
}) {
  const s = R(null), c = n.keys[t], d = Rc(e, n, t), [f, l] = T(c || "q"), h = (N) => {
    var v;
    return ((v = s.current) == null ? void 0 : v.querySelector(`[data-choice="${N}"]`)) ?? null;
  };
  kt(() => {
    var N, v, w;
    (N = h(c || d)) == null || N.focus(), (w = (v = s.current) == null ? void 0 : v.scrollIntoView) == null || w.call(v, { block: "nearest" });
  }, []);
  function p(N) {
    var v;
    Er(N) && l(N), (v = h(N)) == null || v.focus();
  }
  function g(N) {
    var C, L, x;
    if (N.key === "Escape") {
      N.preventDefault(), N.stopPropagation(), o();
      return;
    }
    if (N.key === "Tab") {
      const ae = [...((C = s.current) == null ? void 0 : C.querySelectorAll("button[tabindex='0']")) ?? []], H = ae.indexOf(document.activeElement);
      N.preventDefault(), (L = ae[(H + (N.shiftKey ? -1 : 1) + ae.length) % ae.length]) == null || L.focus();
      return;
    }
    const v = (x = N.target.dataset) == null ? void 0 : x.choice, w = v ? Wn.findIndex((ae) => ae.includes(v)) : -1;
    if (!v || w < 0) return;
    const E = Wn[w].indexOf(v), O = (ae) => ae == null ? void 0 : ae[Math.min(E, ae.length - 1)], F = {
      ArrowLeft: Wn[w][E - 1],
      ArrowRight: Wn[w][E + 1],
      ArrowUp: O(Wn[w - 1]),
      ArrowDown: O(Wn[w + 1]),
      Home: Wn[w][0],
      End: Wn[w].at(-1)
    };
    if (!Object.hasOwn(F, N.key)) return;
    N.preventDefault();
    const B = F[N.key];
    B && p(B);
  }
  const y = (N) => {
    const v = Er(N) ? n.actionOn.get(N) : void 0;
    return v === void 0 ? null : {
      own: v === t,
      label: e[v].label.trim() || "New action",
      pinned: ao(e[v]) === N
    };
  };
  return /* @__PURE__ */ u(be, { children: [
    /* @__PURE__ */ a(
      "div",
      {
        className: "dq-key-picker-backdrop",
        "aria-hidden": "true",
        onMouseDown: (N) => {
          N.preventDefault(), o();
        }
      }
    ),
    /* @__PURE__ */ u(
      "div",
      {
        ref: s,
        role: "dialog",
        "aria-label": `Key for ${r}`,
        className: "dq-key-picker",
        onKeyDown: g,
        onMouseDown: (N) => N.preventDefault(),
        children: [
          /* @__PURE__ */ u("p", { className: "dq-key-picker-title", children: [
            "Key for ",
            /* @__PURE__ */ a("strong", { children: r })
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: ti.map((N, v) => /* @__PURE__ */ a("div", { className: "dq-key-picker-row", "data-indent": v, children: N.map((w) => {
            const E = y(w), O = E ? `${E.own ? "this action" : E.label}, ${E.pinned ? "pinned" : "Auto"}` : "free";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: `dq-key-choice${E ? "" : " dq-key-choice-free"}${E != null && E.own ? " dq-key-choice-own" : ""}`,
                "data-choice": w,
                tabIndex: w === f ? 0 : -1,
                "aria-label": `${ma(w)}: ${O}`,
                "aria-pressed": !!(E != null && E.own && E.pinned),
                title: E ? `${E.label} (${E.pinned ? "pinned" : "Auto"})` : void 0,
                onFocus: () => l(w),
                onClick: () => i(w),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-key-choice-head", children: [
                    /* @__PURE__ */ a(yt, { binding: w }),
                    (E == null ? void 0 : E.pinned) && /* @__PURE__ */ a(Fs, { "aria-hidden": "true" })
                  ] }),
                  E && /* @__PURE__ */ a("span", { className: "dq-key-choice-label", children: E.label })
                ]
              },
              w
            );
          }) }, v)) }),
          /* @__PURE__ */ u("div", { className: "dq-key-picker-choices", children: [
            /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: "dq-key-picker-choice",
                "data-choice": "auto",
                tabIndex: 0,
                "aria-pressed": d === "auto",
                onClick: () => i("auto"),
                children: [
                  /* @__PURE__ */ a("strong", { children: "Auto" }),
                  /* @__PURE__ */ a("span", { children: "the next free key" })
                ]
              }
            ),
            /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: "dq-key-picker-choice",
                "data-choice": er,
                tabIndex: 0,
                "aria-pressed": d === er,
                onClick: () => i(er),
                children: [
                  /* @__PURE__ */ a("strong", { children: "No key" }),
                  /* @__PURE__ */ a("span", { children: "Find action only" })
                ]
              }
            ),
            /* @__PURE__ */ a("p", { className: "dq-key-picker-hint", children: "The action on the key you choose takes this one's pinned key, or Auto." })
          ] })
        ]
      }
    )
  ] });
}
const Ku = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function Gu(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function Vu(e, t) {
  if (xn(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (io(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function $c(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function zu(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function Ju({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: r,
  saving: i,
  expandedId: o,
  onExpand: s,
  reveal: c
}) {
  const d = _e(e), f = d !== "tag", l = e.actions, h = Wr(l), p = Yr(Ne(() => ai(l), [l])), g = Ne(
    () => f ? Tr(l).map((G) => G.name) : [],
    [f, l]
  ), y = l.findIndex((G) => G.id === o), N = Ne(
    () => f && y >= 0 ? Tr(
      l.filter((G, ye) => ye !== y)
    ).map((G) => G.name) : [],
    [f, l, y]
  ), v = f && e.stayUntilGroupsAnswered === !0, w = Ne(
    () => new Set(
      v ? Wd(l).map((G) => G.key) : []
    ),
    [v, l]
  ), [E, O] = T(""), [F, B] = T(!1), [C, L] = T(
    null
  ), x = it(), ae = `${x}-from-tags`, H = R(null), _ = R(null), V = R(null), M = R(null), D = R(/* @__PURE__ */ new WeakMap()), P = (G) => {
    let ye = D.current.get(G);
    return ye || (ye = crypto.randomUUID(), D.current.set(G, ye)), ye;
  }, Y = E.trim().toLocaleLowerCase(), W = Y ? l.filter((G) => G.label.toLocaleLowerCase().includes(Y)) : l, oe = (G) => t({ ...e, actions: G }), Q = (G, ye) => oe(l.map((Ce, Se) => Se === G ? ye : Ce));
  function S(G) {
    var ye;
    return [...((ye = V.current) == null ? void 0 : ye.querySelectorAll("[data-action-id]")) ?? []].find(
      (Ce) => Ce.dataset.actionId === G
    );
  }
  function ce(G, ye) {
    const Ce = S(G), Se = Ce == null ? void 0 : Ce.querySelector(
      ye === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return Se == null || Se.focus(), !!Se;
  }
  kt(() => {
    var ye;
    const G = M.current;
    G && (M.current = null, (G === "add" || !ce(G.id, G.part)) && ((ye = _.current) == null || ye.focus()));
  }), Z(() => {
    !c || !o || (W.some((G) => G.id === o) ? ce(o, "label") : (O(""), M.current = { id: o, part: "label" }));
  }, [c]);
  function A() {
    const G = zu(d);
    O(""), oe([...l, G]), s(G.id), M.current = { id: G.id, part: "label" };
  }
  function X(G) {
    const ye = l[G], { shortcut: Ce, ...Se } = structuredClone(ye), ve = {
      ...Se,
      ...Ce === er ? { shortcut: Ce } : {},
      id: crypto.randomUUID(),
      label: `${ye.label} copy`
    };
    oe([...l.slice(0, G + 1), ve, ...l.slice(G + 1)]), s(ve.id), M.current = { id: ve.id, part: "label" };
  }
  function ue(G) {
    const ye = l[G], Ce = W.indexOf(ye), Se = W[Ce + 1] ?? W[Ce - 1];
    oe(l.filter((ve, Je) => Je !== G)), o === ye.id && s(null), M.current = Se ? { id: Se.id, part: "toggle" } : "add";
  }
  function pe() {
    B(!1), requestAnimationFrame(() => {
      var G;
      return (G = H.current) == null ? void 0 : G.focus();
    });
  }
  return /* @__PURE__ */ u("div", { className: "dq-actions-editor", children: [
    /* @__PURE__ */ u("div", { className: "dq-actions-head", children: [
      /* @__PURE__ */ u("div", { className: "dq-actions-toolbar", children: [
        /* @__PURE__ */ u(
          "button",
          {
            ref: _,
            type: "button",
            className: "dq-header-button",
            onClick: A,
            children: [
              /* @__PURE__ */ a(wa, { "aria-hidden": "true" }),
              "Add action"
            ]
          }
        ),
        f && /* @__PURE__ */ a(
          "button",
          {
            ref: H,
            type: "button",
            className: "dq-header-button",
            "aria-expanded": F,
            "aria-controls": F ? ae : void 0,
            onClick: () => {
              L(null), B(!F);
            },
            children: "Add from parent tags…"
          }
        ),
        /* @__PURE__ */ u("label", { className: "dq-actions-filter", children: [
          /* @__PURE__ */ a(ya, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(
            "input",
            {
              type: "search",
              "aria-label": "Find an action",
              placeholder: "Find an action…",
              autoComplete: "off",
              spellCheck: !1,
              value: E,
              onChange: (G) => O(G.target.value),
              onKeyDown: (G) => {
                G.key === "Escape" && E && !an(G) && (G.preventDefault(), G.stopPropagation(), O(""));
              }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ a("p", { className: "dq-actions-hint", children: "Choose a key on its key cap; Auto takes the next free key in this order. Drag a handle, or press Alt + ↑ / ↓, to reorder." }),
      f && /* @__PURE__ */ u("div", { className: "dq-actions-groups", children: [
        /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ a(
            "input",
            {
              type: "checkbox",
              checked: v,
              "aria-describedby": `${x}-groups-note`,
              onChange: (G) => t({
                ...e,
                stayUntilGroupsAnswered: G.target.checked ? !0 : void 0
              })
            }
          ),
          "Stay until every group is answered"
        ] }),
        /* @__PURE__ */ a("p", { className: "dq-actions-hint", id: `${x}-groups-note`, children: v && !g.length ? "No action has a group yet: give the actions of each question the same group." : "Single-item view: a plain action moves on once every group has an answer." })
      ] }),
      /* @__PURE__ */ a("span", { role: "status", className: "dq-actions-status", children: (C == null ? void 0 : C.actions) === l ? `Added ${C.count} action${C.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    f && F && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here. An Esc that cancels a composition belongs to the input method.
    /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (G) => {
          G.key !== "Escape" || G.defaultPrevented || an(G) || (G.preventDefault(), G.stopPropagation(), pe());
        },
        children: /* @__PURE__ */ a(
          Ou,
          {
            id: ae,
            review: e,
            disabled: i,
            onAdd: (G) => {
              const ye = [...l, ...G];
              oe(ye), L({ actions: ye, count: G.length }), pe();
            },
            onCancel: pe
          }
        )
      }
    ),
    /* @__PURE__ */ a("div", { ref: V, children: W.length > 0 && /* @__PURE__ */ a(
      Ts,
      {
        items: W,
        getKey: (G) => G.id,
        disabled: i || !!Y,
        className: "dq-action-list",
        onReorder: (G) => oe(G),
        renderItem: (G, { dragHandleProps: ye, isOver: Ce }) => {
          const Se = l.indexOf(G), ve = o === G.id;
          return /* @__PURE__ */ a(
            Hu,
            {
              action: G,
              entityType: d,
              keyButton: /* @__PURE__ */ a(
                Uu,
                {
                  actions: l,
                  index: Se,
                  keyMap: h,
                  name: G.label.trim() || "New action",
                  onChoose: (Je) => oe(ud(l, Se, Je))
                }
              ),
              takenPin: h.duplicatePins.has(Se) ? G.shortcut : void 0,
              groupUnanswerable: "steps" in G && w.has(bt(G.group)),
              effect: Rr(G, p, n, r),
              open: ve,
              detailId: `${x}-detail-${G.id}`,
              dragHandleProps: ye,
              isOver: Ce,
              reorderDisabled: i || !!Y,
              onToggle: () => s(ve ? null : G.id),
              onDuplicate: () => X(Se),
              onDelete: () => ue(Se),
              children: "steps" in G ? /* @__PURE__ */ a(
                Qu,
                {
                  action: G,
                  groupNames: g,
                  otherGroupNames: N,
                  occurrence: Re(e),
                  saving: i,
                  stepKey: P,
                  rememberStepKey: (Je, he) => D.current.set(Je, P(he)),
                  onChange: (Je) => Q(Se, Je)
                }
              ) : /* @__PURE__ */ a(
                Yu,
                {
                  action: G,
                  tagGroups: n,
                  onChange: (Je) => Q(Se, Je)
                }
              )
            }
          );
        }
      }
    ) }),
    l.length ? !W.length && /* @__PURE__ */ u("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      E.trim(),
      "”."
    ] }) : /* @__PURE__ */ a("p", { className: "dq-actions-empty", children: f ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function Hu({
  action: e,
  entityType: t,
  keyButton: n,
  takenPin: r,
  groupUnanswerable: i = !1,
  effect: o,
  open: s,
  detailId: c,
  dragHandleProps: d,
  isOver: f,
  reorderDisabled: l,
  onToggle: h,
  onDuplicate: p,
  onDelete: g,
  children: y
}) {
  const N = e.label.trim() || "New action", v = Vu(e, t), w = "steps" in e && bt(e.group) ? e.group.trim() : "";
  return /* @__PURE__ */ u(
    "div",
    {
      className: `dq-action-row${s ? " dq-action-row-open" : ""}${f ? " dq-drag-over" : ""}`,
      "data-action-id": e.id,
      children: [
        /* @__PURE__ */ u("div", { className: "dq-action-row-head", children: [
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              ...d,
              style: $c(d.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${N}`,
              title: l ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: l,
              children: /* @__PURE__ */ a(xs, { "aria-hidden": "true" })
            }
          ),
          n,
          /* @__PURE__ */ u("div", { className: "dq-action-row-summary", onClick: h, children: [
            /* @__PURE__ */ a("span", { className: "dq-action-row-label", title: N, children: N }),
            w && /* @__PURE__ */ u("span", { className: "dq-action-row-group", title: `Group: ${w}`, children: [
              /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Group: " }),
              w
            ] }),
            !s && /* @__PURE__ */ a("span", { className: "dq-action-row-effect", children: o.map((E, O) => /* @__PURE__ */ a("span", { "data-effect-tone": E.tone, children: E.text }, O)) }),
            v && /* @__PURE__ */ u("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ a(On, { "aria-hidden": "true" }),
              v
            ] }),
            r && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${ma(r)} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ a(On, { "aria-hidden": "true" }),
                  `${ma(r)} is pinned twice`
                ]
              }
            ),
            i && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: "No action in this group adds a tag or marks one absent, so the group is never answered and items wait there until skipped.",
                children: [
                  /* @__PURE__ */ a(On, { "aria-hidden": "true" }),
                  `${w} can't be answered`
                ]
              }
            )
          ] }),
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Duplicate ${N}`,
              title: "Duplicate",
              onClick: p,
              children: /* @__PURE__ */ a(Ps, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Delete ${N}`,
              title: "Delete",
              onClick: g,
              children: /* @__PURE__ */ a(Za, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small dq-action-toggle",
              "aria-label": `${s ? "Collapse" : "Expand"} ${N}`,
              "aria-expanded": s,
              "aria-controls": s ? c : void 0,
              onClick: h,
              children: /* @__PURE__ */ a(Xi, { "aria-hidden": "true" })
            }
          )
        ] }),
        s && /* @__PURE__ */ a("div", { id: c, className: "dq-action-detail", children: y })
      ]
    }
  );
}
function Oc({
  action: e,
  onChange: t
}) {
  return /* @__PURE__ */ u("label", { className: "dq-action-field", children: [
    /* @__PURE__ */ a("span", { className: "dq-action-field-name", children: "Button label" }),
    /* @__PURE__ */ a(
      "input",
      {
        className: "dq-input dq-action-label-input",
        value: e.label,
        onChange: (n) => t(n.target.value)
      }
    )
  ] });
}
function Qu({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: r,
  saving: i,
  stepKey: o,
  rememberStepKey: s,
  onChange: c
}) {
  const d = it(), f = R(null), l = R(null);
  kt(() => {
    var g, y;
    const p = l.current;
    p != null && (l.current = null, (y = (g = f.current) == null ? void 0 : g.querySelector(`[data-step-index="${p}"] input`)) == null || y.focus());
  });
  const h = (p) => c({ ...e, steps: p });
  return /* @__PURE__ */ u(be, { children: [
    /* @__PURE__ */ a(Oc, { action: e, onChange: (p) => c({ ...e, label: p }) }),
    /* @__PURE__ */ a(
      ju,
      {
        action: e,
        groupNames: t,
        otherGroupNames: n,
        occurrence: r,
        onChange: c
      }
    ),
    /* @__PURE__ */ u("div", { className: "dq-action-field dq-action-field-top", role: "group", "aria-labelledby": d, children: [
      /* @__PURE__ */ a("span", { className: "dq-action-field-name", id: d, children: "Steps" }),
      /* @__PURE__ */ u("div", { className: "dq-steps", ref: f, children: [
        e.steps.length > 0 ? /* @__PURE__ */ a(
          Ts,
          {
            items: e.steps,
            getKey: o,
            disabled: i,
            className: "dq-step-list",
            onReorder: h,
            renderItem: (p, { index: g, dragHandleProps: y, isOver: N }) => /* @__PURE__ */ a(
              Wu,
              {
                step: p,
                index: g,
                dragHandleProps: y,
                isOver: N,
                saving: i,
                onChange: (v) => {
                  s(v, p), h(e.steps.map((w, E) => E === g ? v : w));
                },
                onRemove: () => h(e.steps.filter((v, w) => w !== g))
              }
            )
          }
        ) : /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "No steps: the action skips the item." }),
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            className: "dq-add-step",
            onClick: () => {
              l.current = e.steps.length, h([...e.steps, { mode: "ADD", tagIds: [] }]);
            },
            children: [
              /* @__PURE__ */ a(wa, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function Wu({
  step: e,
  index: t,
  dragHandleProps: n,
  isOver: r,
  saving: i,
  onChange: o,
  onRemove: s
}) {
  const c = t + 1;
  return /* @__PURE__ */ u(
    "div",
    {
      className: `dq-step${r ? " dq-drag-over" : ""}`,
      "data-step-tone": Gu(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            ...n,
            style: $c(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${c}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: i,
            children: [
              /* @__PURE__ */ a(xs, { "aria-hidden": "true" }),
              /* @__PURE__ */ a("span", { "aria-hidden": "true", children: c })
            ]
          }
        ),
        /* @__PURE__ */ a(
          "select",
          {
            className: "dq-select dq-step-mode",
            "aria-label": `Step ${c} operation`,
            value: e.mode,
            onChange: (d) => o({ ...e, mode: d.target.value }),
            children: Ku.map(({ mode: d, label: f }) => /* @__PURE__ */ a("option", { value: d, children: f }, d))
          }
        ),
        /* @__PURE__ */ a(
          nr,
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
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "dq-icon-button dq-icon-button-small",
            "aria-label": `Remove step ${c}`,
            title: "Remove step",
            onClick: s,
            children: /* @__PURE__ */ a(va, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function Yu({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const r = e.effect, i = r.mode === "SET_TAG_GROUP" ? `group:${r.tagGroupId}` : r.mode, o = r.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === r.tagGroupId);
  return /* @__PURE__ */ u(be, { children: [
    /* @__PURE__ */ a(Oc, { action: e, onChange: (s) => n({ ...e, label: s }) }),
    /* @__PURE__ */ u("label", { className: "dq-action-field", children: [
      /* @__PURE__ */ a("span", { className: "dq-action-field-name", children: "Effect" }),
      /* @__PURE__ */ u(
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
            /* @__PURE__ */ a("option", { value: "SKIP", children: "Skip" }),
            /* @__PURE__ */ a("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
            o && /* @__PURE__ */ a("option", { value: i, disabled: !0, children: "Unavailable tag group" }),
            t.map((s) => /* @__PURE__ */ a("option", { value: `group:${s.id}`, children: s.name }, s.id))
          ]
        }
      )
    ] })
  ] });
}
const Mc = Ml(!1);
function Xu({ children: e }) {
  return /* @__PURE__ */ a(Mc.Provider, { value: !0, children: e });
}
function Qt({ tag: e, name: t }) {
  const n = Fl(Mc), r = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ a(Pl, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: r ?? void 0 });
}
function Zu({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, r = Nn(je(e)).queue, i = (o) => t({ ...e, occurrence: { ...n, ...o } });
  return /* @__PURE__ */ u("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
    /* @__PURE__ */ u("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      r,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ a(
      nr,
      {
        entityType: "tag",
        values: n.tagIds,
        onChange: (o) => i({ tagIds: o }),
        placeholder: "Search review tag choices...",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
      /* @__PURE__ */ a(
        "input",
        {
          type: "checkbox",
          checked: n.multiple,
          onChange: (o) => i({ multiple: o.target.checked })
        }
      ),
      "Allow multiple tags, for example when something changes part-way through the ",
      r
    ] }),
    /* @__PURE__ */ a("p", { children: "Save & next performer applies the selected tags and advances. Save choices stays on the performer. Skip only moves the cursor; eligibility comes from the filters." })
  ] });
}
function ef({
  review: e,
  onChange: t
}) {
  const n = Nn(je(e)).many, r = e.occurrence, i = Ks(r), o = ["any", "isNull"].includes(r.condition) ? [] : r.conditionTagIds, s = ka([
    ...i.flatMap((l) => [l.tagId, ...l.categoryTagId ? [l.categoryTagId] : []]),
    ...o
  ]), c = (l) => {
    var h;
    return ((h = s[l]) == null ? void 0 : h.name) ?? (s[l] === null ? `Unavailable tag ${l}` : `Tag ${l}`);
  }, d = (l) => t({ ...e, occurrence: ld(r, l) }), f = (l, h) => d(
    i.map(
      (p, g) => g !== l ? p : h === void 0 ? { tagId: p.tagId } : { tagId: p.tagId, categoryTagId: h }
    )
  );
  return /* @__PURE__ */ u("fieldset", { className: "dq-settings-group dq-flag-settings", children: [
    /* @__PURE__ */ a("legend", { children: "Performer flags" }),
    /* @__PURE__ */ u("p", { children: [
      "Flag performers whose profile has one of these tags, for example a tag noting that something changed during their career. ",
      /* @__PURE__ */ a("strong", { children: "Affects" }),
      " names the category the flag is about, that tag and everything under it: the flag then asks for attention only where an answer changes that category. Leave it empty for the whole review. Check a flagged performer’s earliest and latest ",
      n,
      " before applying one batch to all of them."
    ] }),
    i.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-flag-pairs", "aria-label": "Performer flags", children: i.map((l, h) => {
      const p = c(l.tagId), g = i.filter(
        (v, w) => w !== h && v.tagId === l.tagId
      ), y = (v) => g.some((w) => w.categoryTagId === v), N = `${l.tagId}#${i.slice(0, h).filter((v) => v.tagId === l.tagId).length}`;
      return /* @__PURE__ */ u("li", { className: "dq-flag-pair", children: [
        /* @__PURE__ */ u("span", { className: "dq-flag-pair-tag", children: [
          /* @__PURE__ */ a(Fn, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(Qt, { tag: s[l.tagId], name: p })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-flag-pair-affects", children: [
          /* @__PURE__ */ a("span", { className: "dq-flag-pair-label", "aria-hidden": "true", children: "Affects" }),
          /* @__PURE__ */ a(
            _o,
            {
              entityType: "tag",
              value: l.categoryTagId,
              onChange: (v) => f(h, v),
              placeholder: "Whole review",
              allowCreate: !1,
              selectedDisplay: "input",
              inputClassName: "dq-input",
              inputAriaLabel: `Affects, ${p}`,
              excludeIds: g.flatMap(
                (v) => v.categoryTagId === void 0 ? [] : [v.categoryTagId]
              )
            }
          )
        ] }),
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "dq-icon-button",
            "aria-label": `Remove flag ${p}`,
            title: "Remove flag",
            onClick: () => d(i.filter((v, w) => w !== h)),
            children: /* @__PURE__ */ a(Za, { "aria-hidden": "true" })
          }
        ),
        o.length > 0 && /* @__PURE__ */ u(
          "div",
          {
            className: "dq-flag-suggestions",
            role: "group",
            "aria-label": `Suggested categories for ${p}`,
            children: [
              /* @__PURE__ */ a("span", { "aria-hidden": "true", children: "Condition categories" }),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-flag-suggestion",
                  "aria-pressed": l.categoryTagId === void 0,
                  disabled: y(void 0),
                  onClick: () => f(h, void 0),
                  children: "Whole review"
                }
              ),
              o.map((v) => /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-flag-suggestion",
                  "aria-pressed": l.categoryTagId === v,
                  disabled: y(v),
                  onClick: () => f(h, v),
                  children: c(v)
                },
                v
              ))
            ]
          }
        )
      ] }, N);
    }) }),
    /* @__PURE__ */ a(
      _o,
      {
        entityType: "tag",
        value: void 0,
        onChange: (l) => {
          l !== void 0 && d([...i, { tagId: l }]);
        },
        placeholder: "Search performer flag tags...",
        allowCreate: !1,
        inputClassName: "dq-input",
        inputAriaLabel: "Add a performer flag",
        excludeIds: i.flatMap((l) => l.categoryTagId === void 0 ? [l.tagId] : [])
      }
    )
  ] });
}
const Fc = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, xc = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, tf = {
  video: ei,
  audio: _s,
  tag: Ds,
  performerOccurrence: Ls,
  audioPerformerOccurrence: Jl
};
function Pc({ entityType: e }) {
  const t = tf[e];
  return /* @__PURE__ */ a(t, { role: "img", "aria-label": Fc[e] });
}
const nf = 2e6;
function Lc(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), r = document.createElement("a");
  r.href = n, r.download = t, r.click(), URL.revokeObjectURL(n);
}
function rf(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function vo(e) {
  Lc([e], rf(e));
}
async function af(e) {
  if (e.size > nf) throw new Error("Review files must be smaller than 2 MB.");
  const t = await e.text();
  try {
    return qa(t);
  } catch (n) {
    throw new Error(
      n instanceof SyntaxError ? "It is not a JSON file." : "It does not hold valid Data Quality reviews."
    );
  }
}
function zr(e) {
  const { page: t, ...n } = e.view.filter;
  return JSON.stringify(
    { ...e, view: { ...e.view, filter: n } },
    (r, i) => i && typeof i == "object" && !Array.isArray(i) ? Object.fromEntries(
      Object.keys(i).sort().map((o) => [o, i[o]])
    ) : i
  );
}
function Dc({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: r,
  nameRef: i,
  autoFocus: o = !1
}) {
  return /* @__PURE__ */ u(be, { children: [
    /* @__PURE__ */ u("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ a("span", { children: "Entity type" }),
      /* @__PURE__ */ a(
        "select",
        {
          className: "dq-select",
          "aria-label": "Entity type",
          value: _e(e),
          disabled: n,
          onChange: (s) => r == null ? void 0 : r(s.target.value),
          children: Gs.map((s) => /* @__PURE__ */ a("option", { value: s, children: xc[s] }, s))
        }
      )
    ] }),
    /* @__PURE__ */ u("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ a("span", { children: "Review name" }),
      /* @__PURE__ */ a(
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
    /* @__PURE__ */ u("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ a("span", { children: "Description" }),
      /* @__PURE__ */ a(
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
function of(e, t) {
  const n = _e(e), r = ["Review"];
  return (n === "video" || n === "tag") && r.push("Appearance"), r.push("Actions"), t && r.push("Tag choices"), r;
}
function sf({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = R(null), r = R(null), i = it(), o = it();
  return Z(() => {
    var s;
    n.current && !n.current.open && n.current.showModal(), (s = r.current) == null || s.focus();
  }, []), /* @__PURE__ */ u(
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
        /* @__PURE__ */ a("h2", { id: i, children: "Discard unsaved changes?" }),
        /* @__PURE__ */ a("p", { id: o, children: "Closing the editor leaves the review as it was last saved." }),
        /* @__PURE__ */ u("div", { className: "dq-confirm-dialog-actions", children: [
          /* @__PURE__ */ a("button", { ref: r, type: "button", className: "dq-button", onClick: e, children: "Keep editing" }),
          /* @__PURE__ */ a("button", { type: "button", className: "dq-button dq-button-danger", onClick: t, children: "Discard" })
        ] })
      ]
    }
  );
}
function _c({
  draft: e,
  onChange: t,
  direction: n,
  onDirectionChange: r,
  tagGroups: i,
  trees: o,
  saving: s,
  saveDisabled: c = !1,
  error: d,
  dirty: f,
  criteriaChanged: l = !1,
  notices: h,
  onSave: p,
  onCancel: g,
  drawerRef: y
}) {
  const [N, v] = T("Review"), [w] = T(
    () => Re(e) && e.occurrence.tagIds.length > 0
  ), [E, O] = T(""), [F, B] = T(null), [C, L] = T(0), [x, ae] = T(!1), H = R(null), _ = R(null), V = R(null), M = of(e, w), D = _e(e), P = Ne(() => zr(e), [e]);
  Z(() => O(""), [P]), Z(() => {
    var ce, A;
    if (x) return;
    const Q = H.current;
    if (H.current = null, !Q) return;
    (A = Q.isConnected && !!((ce = V.current) != null && ce.contains(Q)) && !(Q instanceof HTMLButtonElement && Q.disabled) ? Q : V.current) == null || A.focus({ preventScroll: !0 });
  }, [x]);
  function Y() {
    if (!(s || x)) {
      if (!f) {
        g();
        return;
      }
      H.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, ae(!0);
    }
  }
  function W() {
    const Q = { ...e, name: e.name.trim() }, S = ga(Q);
    if (!S) {
      O(""), p();
      return;
    }
    if (O(S), !Q.name) {
      v("Review"), requestAnimationFrame(() => {
        var A;
        return (A = _.current) == null ? void 0 : A.focus();
      });
      return;
    }
    const ce = e.actions.find(
      (A) => !xn(A, D)
    );
    ce && (v("Actions"), B(ce.id), L((A) => A + 1));
  }
  const oe = E || d;
  return /* @__PURE__ */ u(be, { children: [
    /* @__PURE__ */ u(
      "aside",
      {
        ref: (Q) => {
          V.current = Q, y && (y.current = Q);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (Q) => {
          Q.key !== "Escape" || Q.defaultPrevented || s || an(Q) || (Q.preventDefault(), Q.stopPropagation(), Y());
        },
        children: [
          /* @__PURE__ */ u("header", { className: "dq-drawer-header", children: [
            /* @__PURE__ */ u("div", { className: "dq-drawer-title", children: [
              /* @__PURE__ */ a("span", { className: "dq-eyebrow", children: "Edit review" }),
              /* @__PURE__ */ a("h2", { children: e.name.trim() || "Untitled review" })
            ] }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-icon-button",
                "aria-label": "Close editor",
                title: "Close without saving",
                disabled: s,
                onClick: Y,
                children: /* @__PURE__ */ a(va, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ a(
            Ll,
            {
              tabs: M.map((Q) => ({
                key: Q,
                label: Q,
                count: Q === "Actions" ? e.actions.length : void 0
              })),
              activeTab: N,
              onTabChange: (Q) => v(Q)
            }
          ) }),
          /* @__PURE__ */ a("div", { className: "dq-drawer-body", children: /* @__PURE__ */ u("fieldset", { className: "dq-drawer-fields", disabled: s, children: [
            /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: "Review settings" }),
            /* @__PURE__ */ u(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Review",
                "aria-label": "Review",
                children: [
                  /* @__PURE__ */ a(
                    Dc,
                    {
                      review: e,
                      onChange: t,
                      entityTypeLocked: !0,
                      nameRef: _,
                      autoFocus: !0
                    }
                  ),
                  /* @__PURE__ */ u("label", { className: "dq-drawer-field", children: [
                    /* @__PURE__ */ a("span", { children: "Review direction" }),
                    /* @__PURE__ */ u(
                      "select",
                      {
                        className: "dq-select",
                        "aria-label": "Review direction",
                        value: n,
                        onChange: (Q) => r(Q.target.value),
                        children: [
                          /* @__PURE__ */ a("option", { value: "end", children: "Start from the end" }),
                          /* @__PURE__ */ a("option", { value: "beginning", children: "Start from the beginning" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ a("small", { className: "dq-drawer-note", children: "From the end, the queue opens on its last page and works towards the first." })
                  ] }),
                  Re(e) && /* @__PURE__ */ a(ef, { review: e, onChange: t }),
                  /* @__PURE__ */ a("div", { children: /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => vo(e),
                      children: "Export draft"
                    }
                  ) })
                ]
              }
            ),
            M.includes("Appearance") && /* @__PURE__ */ a(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Appearance",
                "aria-label": "Appearance",
                children: /* @__PURE__ */ a(cf, { review: e, onChange: t })
              }
            ),
            /* @__PURE__ */ a(
              "div",
              {
                className: "dq-drawer-panel dq-actions-panel",
                role: "tabpanel",
                hidden: N !== "Actions",
                "aria-label": "Actions",
                children: /* @__PURE__ */ a(
                  Ju,
                  {
                    review: e,
                    onChange: t,
                    tagGroups: i,
                    trees: o,
                    saving: s,
                    expandedId: F,
                    onExpand: B,
                    reveal: C
                  }
                )
              }
            ),
            w && Re(e) && /* @__PURE__ */ a(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Tag choices",
                "aria-label": "Tag choices",
                children: /* @__PURE__ */ a(Zu, { review: e, onChange: t })
              }
            )
          ] }) }),
          (oe || h) && /* @__PURE__ */ u("div", { className: "dq-drawer-notices", children: [
            h,
            oe && /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ a(On, { "aria-hidden": "true" }),
              oe
            ] })
          ] }),
          /* @__PURE__ */ u("footer", { className: "dq-drawer-footer", children: [
            /* @__PURE__ */ a("p", { className: "dq-drawer-dirty", children: f ? l ? "Unsaved changes, including the queue's criteria" : "Unsaved changes" : "" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: s, onClick: Y, children: "Cancel" }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-button primary",
                "aria-busy": s || void 0,
                "aria-disabled": s || void 0,
                disabled: !s && c,
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
    x && /* @__PURE__ */ a(
      sf,
      {
        onKeepEditing: () => ae(!1),
        onDiscard: () => {
          H.current = null, ae(!1), g();
        }
      }
    )
  ] });
}
function cf({
  review: e,
  onChange: t
}) {
  const n = it(), r = e.view, i = (l) => t({ ...e, view: { ...r, ...l } }), o = /* @__PURE__ */ u("label", { className: "dq-checkbox dq-setting-indent", children: [
    /* @__PURE__ */ a(
      "input",
      {
        type: "checkbox",
        checked: r.selectAllOnLoad ?? !1,
        onChange: (l) => i({ selectAllOnLoad: l.target.checked ? !0 : void 0 })
      }
    ),
    "Select every card when a page opens"
  ] });
  if (_e(e) === "tag")
    return /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-cards`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-cards`, children: "Cards" }),
      /* @__PURE__ */ a(
        rs,
        {
          label: "View",
          value: r.displayMode === "list" ? "list" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "list", label: "List" }
          ],
          onChange: (l) => i({ displayMode: l })
        }
      ),
      o,
      /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "The review opens with these. The Cards / List switch in the header changes only the current visit." })
    ] });
  const s = e.presentation ?? {}, c = (l) => t({ ...e, presentation: { ...s, ...l } }), d = s.annotations ?? [], f = r.reviewMode ?? "single";
  return /* @__PURE__ */ u(be, { children: [
    /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ u("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ a(
          as,
          {
            name: `${n}-layout-choice`,
            checked: f === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ a(df, {}),
            onChoose: () => i({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ a(
          as,
          {
            name: `${n}-layout-choice`,
            checked: f === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ a(uf, {}),
            onChoose: () => i({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ a(
        rs,
        {
          label: "Cards",
          value: r.displayMode === "wall" ? "wall" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "wall", label: "Wall" }
          ],
          onChange: (l) => i({ displayMode: l })
        }
      ),
      o,
      /* @__PURE__ */ u("div", { className: "dq-setting-row", role: "group", "aria-labelledby": `${n}-details`, children: [
        /* @__PURE__ */ a("span", { className: "dq-setting-name", id: `${n}-details`, children: "Card details" }),
        /* @__PURE__ */ a("div", { className: "dq-setting-options", children: [
          ["date", "Date"],
          ["studio", "Studio"],
          ["performers", "Performers"],
          ["tags", "Tags"]
        ].map(([l, h]) => /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ a(
            "input",
            {
              type: "checkbox",
              checked: d.includes(l),
              onChange: (p) => c({
                annotations: p.target.checked ? [...d, l] : d.filter((g) => g !== l)
              })
            }
          ),
          h
        ] }, l)) })
      ] }),
      d.includes("tags") && /* @__PURE__ */ u("div", { className: "dq-setting-row dq-setting-row-top", children: [
        /* @__PURE__ */ a("span", { className: "dq-setting-name", children: "Tags on cards" }),
        /* @__PURE__ */ u("div", { className: "dq-setting-value", children: [
          /* @__PURE__ */ a(
            nr,
            {
              entityType: "tag",
              values: s.annotationParents ?? [],
              onChange: (l) => c({ annotationParents: l }),
              placeholder: "Add a parent tag…",
              inputAriaLabel: "Add a parent tag for card tags",
              containerClassName: "dq-chip-input",
              inputClassName: "dq-chip-input-field",
              allowCreate: !1
            }
          ),
          /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Cards show only the tags under these parents, whatever the queue filters." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-bins`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-bins`, children: "Queue tag bins" }),
      /* @__PURE__ */ a(
        nr,
        {
          entityType: "tag",
          values: s.binParents ?? [],
          onChange: (l) => c({ binParents: l }),
          placeholder: "Add a parent tag…",
          inputAriaLabel: "Add a parent tag for queue bins",
          containerClassName: "dq-chip-input",
          inputClassName: "dq-chip-input-field",
          allowCreate: !1
        }
      ),
      /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "In the grid, tags under these parents become one-click filters in the filter row, counted on the loaded page." })
    ] }),
    /* @__PURE__ */ a(
      lf,
      {
        bins: s.filterBins ?? [],
        onChange: (l) => c({ filterBins: l.length ? l : void 0 })
      }
    )
  ] });
}
function lf({
  bins: e,
  onChange: t
}) {
  const n = it(), [r, i] = T(null), o = e.find((c) => c.key === r), s = (c, d) => t(
    e.map((f) => {
      var h;
      if (f.key !== c) return f;
      const l = { ...f, ...d };
      return (h = l.group) != null && h.trim() || delete l.group, l;
    })
  );
  return /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-title`, children: [
    /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-title`, children: "Queue filter bins" }),
    e.map((c, d) => {
      const f = c.label.trim() || `Filter bin ${d + 1}`, l = Object.keys(c.filter).length;
      return /* @__PURE__ */ u("div", { className: "dq-filter-bin", role: "group", "aria-label": f, children: [
        /* @__PURE__ */ a(
          "input",
          {
            className: "dq-input",
            "aria-label": `Name of ${f}`,
            placeholder: "Bin name",
            value: c.label,
            onChange: (h) => s(c.key, { label: h.target.value })
          }
        ),
        /* @__PURE__ */ a(
          "input",
          {
            className: "dq-input",
            "aria-label": `Pick-one group of ${f}`,
            placeholder: "Group (optional)",
            value: c.group ?? "",
            onChange: (h) => s(c.key, { group: h.target.value })
          }
        ),
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": `Edit filter of ${f}`,
            onClick: () => i(c.key),
            children: l ? "Edit filter…" : "Set filter…"
          }
        ),
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "dq-icon-button dq-icon-button-small",
            "aria-label": `Delete ${f}`,
            title: "Delete",
            onClick: () => t(e.filter((h) => h.key !== c.key)),
            children: /* @__PURE__ */ a(Za, { "aria-hidden": "true" })
          }
        )
      ] }, c.key);
    }),
    /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-button",
        onClick: () => {
          const c = crypto.randomUUID();
          t([...e, { key: c, label: "", filter: {} }]), i(c);
        },
        children: [
          /* @__PURE__ */ a(wa, { "aria-hidden": "true" }),
          "Add filter bin"
        ]
      }
    ),
    /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "In the grid, each bin becomes a one-click filter after the tag bins, counted over the whole queue. Bins with the same group are pick-one: pressing one lifts the other." }),
    o && /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (c) => {
          c.key !== "Escape" || an(c) || (c.stopPropagation(), !c.defaultPrevented && (c.preventDefault(), i(null)));
        },
        children: /* @__PURE__ */ a(
          Is,
          {
            open: !0,
            onClose: () => i(null),
            criteria: Xa,
            activeFilter: o.filter,
            supportsFilterExpressions: !0,
            subjectLabel: o.label.trim() ? `videos in ${o.label.trim()}` : "videos in this bin",
            onApply: (c) => {
              i(null), s(o.key, { filter: c });
            }
          }
        )
      }
    )
  ] });
}
function rs({
  label: e,
  value: t,
  options: n,
  onChange: r
}) {
  const i = it();
  return /* @__PURE__ */ u("div", { className: "dq-setting-row", children: [
    /* @__PURE__ */ a("span", { className: "dq-setting-name", id: i, children: e }),
    /* @__PURE__ */ a("div", { className: "dq-segmented", role: "group", "aria-labelledby": i, children: n.map((o) => /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        "aria-pressed": t === o.value,
        onClick: () => t !== o.value && r(o.value),
        children: o.label
      },
      o.value
    )) })
  ] });
}
function as({
  name: e,
  checked: t,
  title: n,
  text: r,
  picture: i,
  onChoose: o
}) {
  const s = it(), c = it();
  return /* @__PURE__ */ u("label", { className: "dq-layout-card", children: [
    i,
    /* @__PURE__ */ u("span", { className: "dq-layout-card-name", children: [
      /* @__PURE__ */ a(
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
      /* @__PURE__ */ a("span", { id: s, children: n })
    ] }),
    /* @__PURE__ */ a("span", { className: "dq-layout-card-text", id: c, children: r })
  ] });
}
function df() {
  return /* @__PURE__ */ u("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ a("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function uf() {
  const e = /* @__PURE__ */ new Set(["80,8", "152,8", "8,44", "224,44"]);
  return /* @__PURE__ */ u("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ a("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 44].flatMap(
      (t) => [8, 80, 152, 224].map((n) => /* @__PURE__ */ a(
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
    /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: "8", y: "80", width: "282", height: "10", rx: "3" })
  ] });
}
const ji = "The queue differs from the saved review.";
function jc({
  name: e,
  description: t,
  entityType: n,
  onBack: r,
  backDisabled: i,
  onEdit: o,
  editDisabled: s,
  editing: c = !1,
  toolbar: d,
  trailing: f,
  trailingEnd: l,
  queueChange: h,
  queueDiffers: p,
  chipsStart: g,
  chipsAfter: y,
  chipsEnd: N
}) {
  const v = R(null);
  gf(v);
  const w = bf(v), [E, O] = T({ differs: p, text: "" });
  return E.differs !== p && O({
    differs: p,
    text: p ? E.differs === !1 ? ji : E.text : ""
  }), /* @__PURE__ */ u("header", { ref: v, className: "dq-review-header", children: [
    /* @__PURE__ */ u("div", { className: "dq-review-header-lead", children: [
      r && /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: i,
          onClick: r,
          children: /* @__PURE__ */ a(Na, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-type", title: Fc[n], children: /* @__PURE__ */ a(Pc, { entityType: n }) }),
      /* @__PURE__ */ a("h1", { title: t || e, children: e }),
      t && /* @__PURE__ */ a("p", { className: "dq-sr-only", children: t }),
      o && /* @__PURE__ */ a(
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
          children: /* @__PURE__ */ a(Jr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    d,
    /* @__PURE__ */ u("div", { className: "dq-review-header-trail", children: [
      f,
      h && /* @__PURE__ */ a(ff, { change: h, onPress: w }),
      l
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    g,
    y && /* @__PURE__ */ a("div", { className: "dq-review-chips-after", children: y }),
    N && /* @__PURE__ */ a("div", { className: "dq-review-chips-end", children: N }),
    /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: E.text })
  ] });
}
function ff({
  change: e,
  onPress: t
}) {
  const n = it(), r = it(), i = `${ji} Save these filters to the review.`, o = e.onSave ? `${ji} Go back to the review's saved filters.` : "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.";
  return /* @__PURE__ */ u(be, { children: [
    e.onSave && /* @__PURE__ */ u(
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
          /* @__PURE__ */ a(Wl, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-queue-label", children: "Save to review" }),
          /* @__PURE__ */ a("span", { id: n, hidden: !0, children: i })
        ]
      }
    ),
    /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-header-button dq-queue-button",
        title: o,
        "aria-describedby": r,
        disabled: e.resetDisabled,
        onClick: () => {
          t(), e.onReset();
        },
        children: [
          /* @__PURE__ */ a(Yl, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-queue-label", children: "Reset" }),
          /* @__PURE__ */ a("span", { id: r, hidden: !0, children: o })
        ]
      }
    )
  ] });
}
const pf = ["queue", "summary", "name", "layout", "range"], hf = {
  queue: ".dq-queue-button",
  summary: ".dq-scope-summary",
  name: ".dq-review-header-lead h1",
  layout: ".dq-layout-switch",
  range: ".dq-review-toolbar > div:first-of-type > div:first-child > span:first-child"
}, mf = "(min-width: 1400px)";
function Ka(e) {
  const t = e.querySelector(".dq-review-header-lead"), n = e.querySelector(".dq-review-header-trail");
  if (!t || !n) return !0;
  const r = t.getBoundingClientRect();
  return !r.height || n.getBoundingClientRect().top < r.bottom;
}
function is(e, t) {
  const n = e.querySelector(".dq-review-header-lead h1"), r = () => {
    e.removeAttribute("data-compact"), n == null || n.style.removeProperty("max-width");
  };
  if (r(), !t) return !0;
  const i = pf.filter(
    (o) => e.querySelector(hf[o])
  );
  for (let o = 1; o <= i.length && !Ka(e); o++) {
    if (e.dataset.compact = i.slice(0, o).join(" "), i[o - 1] !== "name" || !n) continue;
    const s = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let c = n.getBoundingClientRect().width;
    for (; !Ka(e) && c > 6 * s; )
      c = Math.max(6 * s, c - s), n.style.maxWidth = `${c}px`;
  }
  return Ka(e) ? !0 : (r(), !1);
}
function gf(e) {
  const t = qc(mf), [n, r] = T(0), i = R(!1);
  kt(() => {
    e.current && (i.current = !is(e.current, t));
  }, [e, t, n]), kt(() => {
    const o = e.current;
    o && t && !i.current && !Ka(o) && (i.current = !is(o, t));
  }), Z(() => {
    const o = e.current;
    if (!o || !t || typeof ResizeObserver > "u") return;
    const s = new ResizeObserver(() => r((c) => c + 1));
    s.observe(o);
    for (const c of o.querySelectorAll(".dq-review-header-lead, .dq-review-header-trail"))
      s.observe(c);
    return () => s.disconnect();
  }, [e, t]);
}
function bf(e) {
  const t = R(!1);
  return Z(() => {
    const n = e.current;
    if (!t.current || !n) return;
    const r = document.activeElement, i = (r == null ? void 0 : r.closest(".dq-queue-button")) ?? null;
    if (r && r !== document.body && !i) {
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
function Uc({
  page: e,
  pages: t,
  onPage: n
}) {
  const [r, i] = T(!1), [o, s] = T(""), c = R(null), d = R(null);
  Z(() => {
    var h;
    r && ((h = c.current) == null || h.select());
  }, [r]);
  const f = (h) => {
    i(!1), h && requestAnimationFrame(() => {
      var p;
      return (p = d.current) == null ? void 0 : p.focus();
    });
  }, l = () => {
    const h = Math.round(Number(o));
    f(!0), Number.isFinite(h) && h >= 1 && h !== e && n(Math.min(t, h));
  };
  return /* @__PURE__ */ u("span", { className: "dq-pager", children: [
    /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-icon-button",
        "aria-label": "Previous page",
        title: "Previous page",
        disabled: e <= 1,
        onClick: () => n(e - 1),
        children: /* @__PURE__ */ a(Na, { "aria-hidden": "true" })
      }
    ),
    r ? /* @__PURE__ */ a(
      "input",
      {
        ref: c,
        type: "number",
        className: "dq-pager-input",
        "aria-label": `Go to page, 1 to ${t}`,
        min: 1,
        max: t,
        value: o,
        onChange: (h) => s(h.target.value),
        onKeyDown: (h) => {
          an(h) || (h.key === "Enter" ? (h.preventDefault(), l()) : h.key === "Escape" && (h.preventDefault(), h.stopPropagation(), f(!0)));
        },
        onBlur: () => f(!1)
      }
    ) : /* @__PURE__ */ u(
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
    /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-icon-button",
        "aria-label": "Next page",
        title: "Next page",
        disabled: e >= t,
        onClick: () => n(e + 1),
        children: /* @__PURE__ */ a(js, { "aria-hidden": "true" })
      }
    )
  ] });
}
function Bc({
  mode: e,
  disabled: t,
  onChange: n
}) {
  return /* @__PURE__ */ u("div", { className: "dq-segmented dq-layout-switch", role: "group", "aria-label": "Review layout", children: [
    /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        title: "One item at a time",
        "aria-pressed": e === "single",
        disabled: t,
        onClick: () => e !== "single" && n("single"),
        children: [
          /* @__PURE__ */ a(Ql, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-layout-label", children: "Single" })
        ]
      }
    ),
    /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        title: "Cards in a grid",
        "aria-pressed": e === "multiple",
        disabled: t,
        onClick: () => e !== "multiple" && n("multiple"),
        children: [
          /* @__PURE__ */ a(Zi, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-layout-label", children: "Grid" })
        ]
      }
    )
  ] });
}
function yf({
  options: e,
  value: t,
  disabled: n,
  onChange: r
}) {
  return /* @__PURE__ */ a("div", { className: "dq-segmented dq-segmented-icons", role: "group", "aria-label": "Card view", children: e.map((i) => /* @__PURE__ */ a(
    "button",
    {
      type: "button",
      "aria-label": i.label,
      title: i.label,
      "aria-pressed": t === i.value,
      disabled: n,
      onClick: () => t !== i.value && r(i.value),
      children: i.icon
    },
    i.value
  )) });
}
function No({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [r, i] = T(!1), [o, s] = T(!1), c = R(null), d = R(null), f = it();
  kt(() => {
    if (!r || !d.current || !c.current) return;
    const p = c.current.getBoundingClientRect(), g = d.current.offsetHeight + 12, y = window.innerHeight - p.bottom;
    s(y < g && p.top > y);
  }, [r]), Z(() => {
    var p, g;
    r && ((g = (p = d.current) == null ? void 0 : p.querySelector('[role="menuitem"]:not(:disabled)')) == null || g.focus({ preventScroll: !0 }));
  }, [r]), Z(() => {
    t && i(!1);
  }, [t]);
  const l = (p = !0) => {
    var g;
    i(!1), p && ((g = c.current) == null || g.focus());
  };
  return /* @__PURE__ */ u("div", { className: `dq-menu${r ? " dq-menu-open" : ""}`, onKeyDown: (p) => {
    var N, v;
    if (!r) return;
    const g = [
      ...((N = d.current) == null ? void 0 : N.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], y = g.indexOf(document.activeElement);
    if (p.key === "Escape")
      p.preventDefault(), p.stopPropagation(), l();
    else if (p.key === "Tab")
      l(!1);
    else if (p.key === "ArrowDown" || p.key === "ArrowUp") {
      if (p.preventDefault(), !g.length) return;
      const w = p.key === "ArrowDown" ? 1 : -1;
      g[(y + w + g.length) % g.length].focus();
    } else (p.key === "Home" || p.key === "End") && (p.preventDefault(), (v = g.at(p.key === "Home" ? 0 : -1)) == null || v.focus());
  }, children: [
    /* @__PURE__ */ a(
      "button",
      {
        ref: c,
        type: "button",
        className: "dq-icon-button",
        "aria-label": n,
        title: n,
        "aria-haspopup": "menu",
        "aria-expanded": r,
        "aria-controls": r ? f : void 0,
        disabled: t,
        onClick: () => i((p) => !p),
        children: /* @__PURE__ */ a(Hl, { "aria-hidden": "true" })
      }
    ),
    r && /* @__PURE__ */ u(be, { children: [
      /* @__PURE__ */ a("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => l(!1) }),
      /* @__PURE__ */ a(
        "div",
        {
          ref: d,
          id: f,
          role: "menu",
          "aria-label": n,
          className: `dq-menu-list${o ? " dq-menu-list-up" : ""}`,
          children: e.map((p) => /* @__PURE__ */ u(Wi, { children: [
            p.separated && /* @__PURE__ */ a("div", { role: "separator", className: "dq-menu-separator" }),
            /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                role: "menuitem",
                className: p.danger ? "dq-menu-danger" : void 0,
                disabled: p.disabled,
                onClick: () => {
                  l(), p.onSelect();
                },
                children: [
                  p.icon,
                  p.label
                ]
              }
            )
          ] }, p.label))
        }
      )
    ] })
  ] });
}
function Wa(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function qo(e) {
  return String(e.type).toLowerCase() === "tag";
}
function So(e) {
  return !!String(e ?? "").trim();
}
function ko(e) {
  return [
    ...new Set(
      Wa(e.customFieldCriteria).filter(qo).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !So(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function Eo(e, t) {
  const n = Wa(e.customFieldCriteria);
  if (!n.length) return e;
  let r = !1;
  const i = n.map((o) => {
    if (!qo(o)) return o;
    const s = { ...o };
    for (const [c, d] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const f = t[String(o[c] ?? "")];
      f && !So(o[d]) && (s[d] = f, r = !0);
    }
    return s;
  });
  return r ? { ...e, customFieldCriteria: i } : e;
}
function Kc(e, t, n) {
  const r = Wa(e.customFieldCriteria);
  if (!r.length) return e;
  const i = Wa(n.customFieldCriteria), o = (d, f) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (l) => (d[l] ?? void 0) === (f[l] ?? void 0)
  );
  let s = !1;
  const c = r.map((d) => {
    if (!qo(d)) return d;
    const f = i.find((h) => o(h, d));
    if (!f) return d;
    const l = { ...d };
    for (const [h, p] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const g = t[String(d[h] ?? "")];
      g && d[p] === g && !So(f[p]) && (delete l[p], s = !0);
    }
    return l;
  });
  return s ? { ...e, customFieldCriteria: c } : e;
}
async function wf(e, t, n) {
  if (!xn(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const r = je(e), i = n.steps.some((c) => Mn(c.mode)) ? await Gd(r) : "", o = await lo(n);
  let s = t.applications;
  for (const c of [
    ...o.filter((d) => !Mn(d.mode)),
    ...o.filter((d) => Mn(d.mode))
  ]) {
    const d = (f) => Vd(
      i,
      r,
      t.media.id,
      t.performer.id,
      c.tagIds,
      f
    );
    (c.mode === "MARK_PRESENT" || c.mode === "CLEAR_ABSENCE") && await d("REMOVE"), c.mode !== "CLEAR_ABSENCE" && (s = await Jc(
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
async function Ao(e, t) {
  const n = e.occurrence;
  if (no(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const r = /* @__PURE__ */ new Set(), { _filterExpression: i, ...o } = n.performerFilter;
  for (let s = 1; ; s++) {
    const c = await we("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Pn({
          findFilter: { page: s, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: o,
          filterExpression: i
        })
      )
    });
    if (c.items.forEach((d) => r.add(d.id)), s * 1e3 >= c.totalCount) return [...r];
    if (!c.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function Gc(e) {
  return ha(e.condition) && e.hideConfirmedAbsent !== !1;
}
function Co(e, t) {
  const { _filterExpression: n, ...r } = e.view.objectFilter, i = e.occurrence, o = {
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
  }, s = Gc(i) && (t == null ? void 0 : t.length) === 1 && i.conditionTagIds.length === 1 ? `${t[0]}:${i.conditionTagIds[0]}` : null;
  return {
    ...e,
    entityType: je(e),
    actions: [],
    view: {
      ...e.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...n ? [{ group: n }] : [],
            { filter: r },
            { filter: { performerFilterCriterion: o } },
            ...s ? [
              {
                filter: {
                  customFieldCriteria: [
                    {
                      key: ni,
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
async function To(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => ri([n], t))
  );
}
function Vc(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function vf(e, t, n = e.conditionTagIds.map((r) => [r])) {
  const r = new Set(t), i = (o) => o.some((s) => r.has(s));
  switch (e.condition) {
    case "any":
      return !0;
    case "isNull":
      return r.size === 0;
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
function Nf(e, t, n, r, i) {
  if (!Gc(e)) return !1;
  const o = ic(t, n);
  return e.conditionTagIds.every(
    (s, c) => o.includes(s) || i[c].some((d) => r.includes(d))
  );
}
async function zc(e, t, n, r) {
  if ((t == null ? void 0 : t.length) === 0 || Vc(e.occurrence))
    return { items: [], totalCount: 0 };
  const i = je(e), o = await Kr(
    Co(e, t),
    { ...e.view.filter, page: n },
    r
  ), s = t === null ? null : new Set(t), c = e.occurrence, d = o.items.length ? await To(c, r) : [], f = new Array(o.items.length);
  let l = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, o.items.length) }, async () => {
      for (; l < o.items.length; ) {
        const h = l++, p = o.items[h], g = await we(
          `/api/tagapplications?hostType=${i}&hostId=${p.id}&contextType=performer`,
          { signal: r }
        );
        f[h] = p.performers.filter((y) => s === null || s.has(y.id)).flatMap((y) => {
          const N = g.filter(
            (w) => w.hostType === i && w.hostId === p.id && w.contextType === "performer" && w.contextId === y.id
          ), v = N.map((w) => w.tag.id);
          return vf(e.occurrence, v, d) && !Nf(c, p, y.id, v, d) ? [
            {
              key: `${p.id}:${y.id}`,
              media: p,
              performer: y,
              applications: N
            }
          ] : [];
        });
      }
    })
  ), { items: f.flat(), totalCount: o.totalCount };
}
async function Jc(e, t, n) {
  const r = new Set(e.occurrence.tagIds);
  if (n.some((f) => !r.has(f)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const i = je(e), o = await Ha(i, t.media.id);
  if (!o.performers.some(
    (f) => f.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${i}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${i}&hostId=${o.id}&contextType=performer&contextId=${t.performer.id}`, c = (await we(s)).filter(
    (f) => f.hostType === i && f.hostId === o.id && f.contextType === "performer" && f.contextId === t.performer.id
  ), d = new Set(n);
  try {
    for (const f of d)
      c.some((l) => l.tag.id === f) || await we("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: i,
          hostId: o.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: f,
          sourceKey: "user"
        })
      });
    for (const f of c)
      r.has(f.tag.id) && !d.has(f.tag.id) && await we(`/api/tagapplications/${f.id}`, {
        method: "DELETE"
      });
    return await we(s);
  } catch (f) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${f instanceof Error ? f.message : "Request failed."}`
    );
  }
}
function Hr(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function qf(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function fn(e, t, n = !0) {
  var c;
  if (t.occurrence) {
    const d = n ? ic(
      await Ha(e, t.media.id),
      t.occurrence.performer.id
    ) : [], f = (await we(qf(e, t))).filter(
      (l) => l.hostType === e && l.hostId === t.media.id && l.contextType === "performer" && l.contextId === t.occurrence.performer.id
    );
    return Di(f.map((l) => l.tag)), {
      ids: [...new Set(f.map((l) => l.tag.id))],
      names: [...new Set(f.map((l) => l.tag.name))],
      absent: d,
      applications: f
    };
  }
  const r = await Ha(e, t.media.id), i = (r.tags ?? []).filter(
    (d) => d.canRemove !== !1 || d.isDerived !== !0
  );
  Di(i);
  const o = Object.keys(r.customFields ?? {}).find(
    (d) => d.toLowerCase() === Ja
  ) ?? Ja, s = ((c = r.customFields) == null ? void 0 : c[o]) ?? [];
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
async function Io(e, t, n) {
  if (t.occurrence && Re(e))
    await Jc(
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
    for (const [r, i] of [
      ["ADD", n.added],
      ["REMOVE", n.removed]
    ])
      i.length && await we(
        `/api/${ir(je(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: r, tagIds: i })
        }
      );
}
async function Sf(e, t, n) {
  t.occurrence && Re(e) ? await wf(e, t.occurrence, n) : await oc(je(e), n, [t.media.id]);
}
function Ui(e, t, n, r) {
  const i = (o) => o.filter((s) => r.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: Hr(i(t.ids), i(n.ids)),
    absence: Hr(i(t.absent), i(n.absent))
  };
}
function kf(e, t) {
  var n;
  for (const [r, i] of [
    [e.tags, t.ids],
    [e.absence, t.absent]
  ])
    if (r.added.some((o) => !i.includes(o)) || r.removed.some((o) => i.includes(o)))
      throw new Error(
        "Undo conflict: affected tags changed since this operation. Inspect the item; no undo changes were made."
      );
  if (t.applications)
    for (const r of e.tags.added) {
      const i = (n = e.after.applications) == null ? void 0 : n.filter((s) => s.tag.id === r).map((s) => s.id).sort(), o = t.applications.filter((s) => s.tag.id === r).map((s) => s.id).sort();
      if (JSON.stringify(i) !== JSON.stringify(o))
        throw new Error(
          "Undo conflict: an affected occurrence application changed. No undo changes were made."
        );
    }
}
class Hc extends Error {
}
const Bi = (e) => e instanceof Error ? e.message : "Request failed.", os = (e) => [...e].sort((t, n) => t - n), ba = (e, t) => JSON.stringify(os(e)) === JSON.stringify(os(t)), Ki = (e) => !!(e.tags.added.length || e.tags.removed.length);
function Ya(e, t, n, r) {
  const i = new Set(e), o = new Set(e);
  for (const l of t.steps)
    for (const h of l.tagIds)
      l.mode === "ADD" ? o.add(h) : o.delete(h);
  const s = e.some((l) => !o.has(l));
  if (s && !r)
    return { desired: [...e], conflict: s, skipped: !0, kept: [], replaced: [] };
  const c = new Set(
    t.steps.filter((l) => l.mode === "ADD").flatMap((l) => l.tagIds)
  ), d = [], f = [];
  for (const l of n) {
    const h = l.filter((g) => o.has(g) && !i.has(g)), p = l.filter(
      (g) => o.has(g) && i.has(g) && !c.has(g)
    );
    !h.length || !p.length || (r ? (p.forEach((g) => o.delete(g)), f.push(...p)) : (h.forEach((g) => o.delete(g)), d.push({ tagIds: h, existing: p })));
  }
  return { desired: [...o], conflict: s, skipped: !1, kept: d, replaced: f };
}
function Ef(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function Af(e, t, n, r) {
  for (const [i, o] of n.entries()) {
    const s = t.filter(
      (f) => f.steps.some(
        (l) => l.mode === "ADD" && l.tagIds.some((h) => o.includes(h))
      )
    );
    if (s.length < 2) continue;
    const c = e.occurrence.conditionTagIds[i];
    let d = `tag ${c}`;
    try {
      d = (await we(`/api/tags/${c}`, { signal: r })).name;
    } catch {
      r.throwIfAborted();
    }
    throw new Hc(
      `${s.map((f) => f.label).join(" and ")} answer the same condition tag, ${d}. Choose one of them.`
    );
  }
}
async function Cf(e, t, n, r = () => {
}) {
  if (!t.length || t.some(
    (p) => !xn(p, e.entityType) || !p.steps.length || p.steps.some(
      (g) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(g.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), o = structuredClone(t), s = ha(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await To(i.occurrence, n) : [];
  await Af(i, o, s, n);
  const c = await Promise.all(
    o.map(async (p) => ({
      ...p,
      steps: await lo(p, n)
    }))
  ), d = structuredClone(Ef(c));
  n.throwIfAborted();
  const f = [
    .../* @__PURE__ */ new Set([
      ...d.steps.flatMap((p) => p.tagIds),
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
  const l = await Ao(i, n), h = /* @__PURE__ */ new Map();
  for (let p = 1; ; p++) {
    n.throwIfAborted();
    const g = await zc(i, l, p, n);
    for (const y of g.items) {
      const N = {
        ids: [...new Set(y.applications.map((w) => w.tag.id))],
        names: y.applications.map((w) => w.tag.name),
        absent: [],
        applications: y.applications
      }, v = Ya(N.ids, d, s, !0);
      h.set(y.key, {
        item: { key: y.key, media: y.media, occurrence: y },
        before: N,
        expected: N,
        conflict: v.conflict,
        status: ba(N.ids, v.desired) ? "unchanged" : "pending"
      });
    }
    if (r(h.size), p * 250 >= g.totalCount) break;
    if (p > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return n.throwIfAborted(), {
    review: i,
    actions: o,
    action: d,
    categories: s,
    touched: f,
    entries: [...h.values()]
  };
}
function Tf(e, t, n) {
  const r = (o) => o.ids.filter((s) => n.includes(s));
  if (!ba(r(e), r(t))) return !1;
  const i = (o) => (o.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return ba(i(e), i(t));
}
async function Qc(e, t, n, r) {
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; !t() && i < e.length; ) {
        const o = e[i++];
        await n(o), r();
      }
    })
  );
}
function Wc(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function Yc(e) {
  return e.entries.filter((t) => t.operation);
}
async function If(e, t, n, r, i = !1) {
  await Qc(
    Wc(e, i),
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
        if (s = await fn(je(e.review), o.item, !1), !Tf(o.expected, s, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (p) {
        o.status = "failed", o.error = Bi(p);
        return;
      }
      const c = Ya(
        o.before.ids,
        e.action,
        e.categories,
        t
      ), d = [
        ...s.ids.filter((p) => !e.touched.includes(p)),
        ...c.desired.filter((p) => e.touched.includes(p))
      ], f = Hr(s.ids, d);
      if (!f.added.length && !f.removed.length) {
        const p = !o.operation && c.kept.length > 0;
        o.status = o.operation ? "changed" : p ? "skipped" : "unchanged", o.error = p ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let l;
      try {
        await Io(e.review, o.item, f);
      } catch (p) {
        l = p;
      }
      let h = !1;
      try {
        const p = await fn(je(e.review), o.item, !1);
        h = !0, o.expected = p;
        const g = Ui(
          o.item,
          o.before,
          p,
          e.touched
        );
        if (o.operation = Ki(g) ? g : void 0, l) throw l;
        if (!ba(
          p.ids.filter((y) => e.touched.includes(y)),
          d.filter((y) => e.touched.includes(y))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (p) {
        if (o.status = "failed", o.error = Bi(p), !h)
          try {
            const g = await fn(je(e.review), o.item, !1);
            o.expected = g;
            const y = Ui(
              o.item,
              o.before,
              g,
              e.touched
            );
            o.operation = Ki(y) ? y : void 0;
          } catch {
            o.unverified = !0;
          }
      }
    },
    r
  );
}
async function Rf(e, t, n) {
  await Qc(
    Yc(e),
    t,
    async (r) => {
      const i = r.operation;
      if (r.unverified) {
        r.error = "Undo unavailable: the previous write could not be verified. Inspect this occurrence.";
        return;
      }
      const o = [...i.tags.added, ...i.tags.removed];
      let s = !1;
      try {
        const c = await fn(je(e.review), r.item, !1);
        kf(i, c), s = !0, await Io(e.review, r.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const d = await fn(je(e.review), r.item, !1);
        if (!ba(
          d.ids.filter((f) => o.includes(f)),
          r.before.ids.filter((f) => o.includes(f))
        ))
          throw new Error("Undo did not restore all affected tags.");
        r.operation = void 0, r.expected = d, r.status = "unchanged", r.error = void 0;
      } catch (c) {
        if (r.error = `Undo stopped: ${Bi(c)}`, r.status = "failed", s)
          try {
            const d = await fn(je(e.review), r.item, !1), f = Ui(
              r.item,
              r.before,
              d,
              o
            );
            r.operation = Ki(f) ? f : void 0, r.expected = d;
          } catch {
            r.unverified = !0;
          }
      }
    },
    n
  );
}
const Xc = (e, t) => t.count - e.count || sc(e, t);
async function $f(e, t, n) {
  const r = je(e), i = e.occurrence, [o, s] = await Promise.all([
    we(
      `/api/tagapplications?hostType=${r}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    To(i, n)
  ]), c = o.filter(
    (y) => y.hostType === r && y.contextType === "performer" && y.contextId === t
  );
  Di(c.map((y) => y.tag));
  const d = await Promise.all(
    s.map(async (y, N) => {
      const v = i.conditionTagIds[N];
      return (await we(`/api/tags/${v}`, { signal: n })).name;
    })
  ), f = new Set(s.flat()), l = new Set(
    [
      ...e.actions.flatMap((y) => y.steps).filter((y) => y.mode === "ADD" || y.mode === "MARK_PRESENT").flatMap((y) => y.tagIds),
      ...i.tagIds
    ].filter((y) => !f.has(y))
  ), h = (y) => {
    const N = /* @__PURE__ */ new Map();
    for (const v of c) {
      if (!y.has(v.tag.id)) continue;
      const w = N.get(v.tag.id) ?? {
        tag: v.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      w.hosts.add(v.hostId), N.set(v.tag.id, w);
    }
    return [...N.values()].map((v) => ({ ...v.tag, count: v.hosts.size })).sort(Xc);
  }, p = s.map((y, N) => ({
    id: i.conditionTagIds[N],
    name: d[N],
    members: y,
    tags: h(new Set(y))
  }));
  l.size && p.push({
    id: null,
    name: s.length ? "Other review tags" : "Review tags",
    members: [...l],
    tags: h(l)
  });
  const g = /* @__PURE__ */ new Set([...f, ...l]);
  return {
    answered: new Set(
      c.filter((y) => g.has(y.tag.id)).map((y) => y.hostId)
    ).size,
    groups: p
  };
}
function Of(e, t, n, r) {
  const i = /* @__PURE__ */ new Set([e, ...t]), o = (s) => {
    if (s === e) return !0;
    const c = r.get(s);
    if (!c) return !1;
    const d = new Set(c);
    return [...i].every((f) => d.has(f));
  };
  return n.some(
    (s) => [...ar(s)].some((c) => i.has(c)) && s.steps.some(
      (c) => c.mode === "REMOVE_TREE" && c.tagIds.some(o)
    )
  );
}
function Ro(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const g of e.groups) for (const y of g.tags) r.set(y.id, y);
  const i = (g) => g.flatMap((y) => r.get(y) ?? []).sort(Xc), o = (g) => g.members ?? g.tags.map((y) => y.id), s = Tr(t).flatMap((g) => {
    const y = [
      ...new Set(g.actions.flatMap((N) => [...ar(t[N])]))
    ];
    return y.length ? [{ ...g, answers: y, tags: i(y) }] : [];
  }), c = (g) => g.tags.length > 1 ? [g] : [], d = e.groups.filter((g) => g.id !== null).map((g) => {
    const y = `tag:${g.id}`, N = o(g), v = new Set(N);
    return {
      key: y,
      kind: "condition",
      name: g.name,
      members: N,
      tags: g.tags,
      mixed: Of(g.id, N, t, n) ? c({ key: y, name: g.name, members: N, tags: g.tags }) : (
        // A category that holds several answers is mixed where a group inside it is.
        s.filter((w) => w.answers.every((E) => v.has(E))).flatMap(
          (w) => c({
            key: `group:${w.key}`,
            name: w.name,
            members: w.answers,
            tags: w.tags
          })
        )
      )
    };
  }), f = d.map((g) => new Set(g.members)), l = /* @__PURE__ */ new Set();
  for (const g of s) {
    if (f.some((N) => g.answers.every((v) => N.has(v)))) continue;
    g.answers.forEach((N) => l.add(N));
    const y = `group:${g.key}`;
    d.push({
      key: y,
      kind: "group",
      name: g.name,
      members: g.answers,
      tags: g.tags,
      // An answer group is one question: it takes one answer.
      mixed: c({ key: y, name: g.name, members: g.answers, tags: g.tags })
    });
  }
  const h = e.groups.find((g) => g.id === null), p = (h == null ? void 0 : h.tags.filter((g) => !l.has(g.id))) ?? [];
  return h && p.length && d.push({
    key: "other",
    kind: "other",
    name: d.length ? "Other review tags" : "Review tags",
    members: o(h).filter((g) => !l.has(g)),
    tags: p,
    mixed: []
  }), d;
}
const vi = { summary: null, error: "" };
function Zc(e, t, n = 0) {
  const r = e == null ? void 0 : e.occurrence, i = JSON.stringify([
    e == null ? void 0 : e.entityType,
    t,
    r == null ? void 0 : r.condition,
    r == null ? void 0 : r.conditionTagIds,
    r == null ? void 0 : r.includeSubtags,
    r == null ? void 0 : r.tagIds,
    e == null ? void 0 : e.actions.map((c) => c.steps)
  ]), [o, s] = T({
    key: i,
    value: vi
  });
  return Z(() => {
    if (s((d) => d.key === i ? d : { key: i, value: vi }), e === null || t === null) return;
    const c = new AbortController();
    return $f(e, t, c.signal).then((d) => {
      c.signal.aborted || s({ key: i, value: { summary: d, error: "" } });
    }).catch((d) => {
      c.signal.aborted || s((f) => ({
        key: i,
        value: {
          summary: f.key === i ? f.value.summary : null,
          error: d instanceof Error ? d.message : "Request failed."
        }
      }));
    }), () => c.abort();
  }, [i, n]), o.key === i ? o.value : vi;
}
function Mf(e, t) {
  const n = (f) => {
    var l;
    return ((l = f.tagIds) == null ? void 0 : l.every((h) => e.members.includes(h))) ?? !1;
  }, r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  for (const f of e.mixed) {
    const l = eu(f, t).filter((p) => p.key !== e.key), h = f.key === e.key ? [] : l.filter(n);
    h.length ? h.forEach((p) => r.add(p.name)) : l.forEach((p) => i.add(p.name));
  }
  const o = bt(e.name), s = [...r].filter((f) => bt(f) !== o), c = s.length < r.size, d = i.size ? ` (${c ? "partly " : ""}listed under ${[...i].join(", ")})` : "";
  return { names: s, here: c || i.size > 0, note: d };
}
function Ff(e, { names: t, here: n, note: r }) {
  const i = `this ${e.kind === "group" ? "group" : "category"}${r}`;
  return `This performer has different answers in ${t.length ? n ? `${i} and in ${t.join(", ")}` : t.join(", ") : i}.`;
}
function Gi({
  summary: e,
  error: t,
  mediaKind: n,
  actions: r = [],
  trees: i = Mi,
  flags: o = [],
  className: s = ""
}) {
  const c = Nn(n), d = (p) => `${p.toLocaleString()} ${p === 1 ? c.one : c.many}`, f = e ? Ro(e, r, i) : [], l = po(f), h = (p) => [
    ...new Set(
      o.filter((g) => {
        var y;
        return (y = g.tagIds) == null ? void 0 : y.some((N) => p.includes(N));
      }).flatMap((g) => g.flags)
    )
  ];
  return /* @__PURE__ */ u(
    "section",
    {
      className: `dq-panel-section dq-performer-answers ${s}`.trim(),
      "aria-label": "Existing answers",
      children: [
        /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: "Existing answers" }),
          e && /* @__PURE__ */ a("span", { children: e.answered ? `${d(e.answered)} answered` : "none answered yet" })
        ] }),
        t ? /* @__PURE__ */ u("p", { role: "alert", children: [
          "Could not load existing answers. ",
          t
        ] }) : e ? f.map((p) => {
          const g = p.kind === "other" ? [] : h(p.members), y = Mf(p, l), N = y.note ? /* @__PURE__ */ a("span", { className: "dq-sr-only", children: y.note }) : null;
          return /* @__PURE__ */ u("div", { className: "dq-answer-group", children: [
            /* @__PURE__ */ u("div", { className: "dq-answer-category", children: [
              /* @__PURE__ */ a("span", { children: p.name }),
              p.mixed.length > 0 && /* @__PURE__ */ u(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-mixed",
                  title: Ff(p, y),
                  children: [
                    /* @__PURE__ */ a(Fn, { "aria-hidden": "true" }),
                    "Mixed",
                    y.names.length > 0 ? /* @__PURE__ */ u("span", { className: "dq-answer-mixed-names", children: [
                      y.here && " here",
                      N,
                      ` ${y.here ? "and in" : "in"} ${y.names.join(", ")}`
                    ] }) : N
                  ]
                }
              ),
              g.length > 0 && /* @__PURE__ */ u(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-flag",
                  title: `Flagged: ${g.join(", ")}`,
                  children: [
                    /* @__PURE__ */ a(Fn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { className: "dq-answer-flag-names", children: [
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Flagged: " }),
                      g.join(", ")
                    ] })
                  ]
                }
              )
            ] }),
            p.tags.length ? /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": p.name, children: p.tags.map((v) => /* @__PURE__ */ u("li", { className: "dq-tag", children: [
              /* @__PURE__ */ a(Qt, { tag: v }),
              /* @__PURE__ */ a("span", { className: "dq-chip-count", "aria-hidden": "true", children: v.count.toLocaleString() }),
              /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
                ", ",
                d(v.count)
              ] })
            ] }, v.id)) }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "None" })
          ] }, p.key);
        }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "Loading existing answers…" })
      ]
    }
  );
}
function Vr({
  performer: e
}) {
  return /* @__PURE__ */ u("span", { className: "dq-performer-avatar", "aria-hidden": "true", children: [
    /* @__PURE__ */ a("span", { children: e.name.trim().split(/\s+/).slice(0, 2).map((t) => t[0]).join("").toUpperCase() || "?" }),
    /* @__PURE__ */ a(
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
const ss = 5;
function xf(e, t) {
  return Promise.all(
    e.map(async (n) => {
      try {
        return (await we(`/api/performers/${n}`, { signal: t })).name;
      } catch {
        return t.throwIfAborted(), `Performer ${n}`;
      }
    })
  );
}
const cs = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), Vi = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], ls = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], Pf = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, Ni = 250;
function da(e, t) {
  var r, i;
  const n = e.item.media;
  return n.title || ((i = (r = n.files) == null ? void 0 : r[0]) == null ? void 0 : i.basename) || (t === "audio" ? "Audio" : "Scene");
}
function Lf({ step: e }) {
  const t = Vi.findIndex((n) => n.id === e);
  return /* @__PURE__ */ a("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: Vi.map((n, r) => {
    const i = r < t ? "done" : r === t ? "current" : "next";
    return /* @__PURE__ */ u("li", { "data-state": i, "aria-current": i === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: i === "done" ? /* @__PURE__ */ a(Qr, {}) : r + 1 }),
      n.label,
      i === "done" && /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function ds({ parts: e, id: t }) {
  return /* @__PURE__ */ a("span", { className: "dq-batch-effect", id: t, children: e.map((n, r) => /* @__PURE__ */ u(Wi, { children: [
    r > 0 && " ",
    /* @__PURE__ */ a("span", { "data-effect-tone": n.tone, children: n.text })
  ] }, r)) });
}
function la({
  value: e,
  label: t,
  detail: n,
  tone: r,
  pressed: i,
  onToggle: o
}) {
  return /* @__PURE__ */ u(
    "button",
    {
      type: "button",
      className: "dq-batch-stat",
      "data-tone": e ? r : void 0,
      "aria-pressed": i && e > 0,
      disabled: !e,
      onClick: o,
      children: [
        /* @__PURE__ */ a("span", { className: "dq-batch-stat-value", children: e.toLocaleString() }),
        " ",
        /* @__PURE__ */ a("span", { className: "dq-batch-stat-label", children: t }),
        n && /* @__PURE__ */ u(be, { children: [
          " ",
          /* @__PURE__ */ a("span", { className: "dq-batch-stat-detail", children: n })
        ] })
      ]
    }
  );
}
function us({
  added: e,
  removed: t,
  tag: n,
  label: r
}) {
  return /* @__PURE__ */ u("ul", { className: "dq-tags", "aria-label": r, children: [
    Ar(e.map(n)).map((i) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
      "+ ",
      /* @__PURE__ */ a(Qt, { tag: i })
    ] }) }, `added-${i.id}`)),
    Ar(t.map(n)).map((i) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ u("del", { children: [
      "− ",
      /* @__PURE__ */ a(Qt, { tag: i })
    ] }) }, `removed-${i.id}`))
  ] });
}
function fs({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: r,
  describe: i
}) {
  return /* @__PURE__ */ u("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: e }),
      t.length > Ni && /* @__PURE__ */ u("span", { children: [
        "First ",
        Ni.toLocaleString(),
        " of ",
        t.length.toLocaleString()
      ] })
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-batch-list-scroll", children: /* @__PURE__ */ u("table", { children: [
      /* @__PURE__ */ a("thead", { children: /* @__PURE__ */ u("tr", { children: [
        /* @__PURE__ */ a("th", { scope: "col", children: "Occurrence" }),
        /* @__PURE__ */ a("th", { scope: "col", children: "Date" }),
        /* @__PURE__ */ a("th", { scope: "col", children: r })
      ] }) }),
      /* @__PURE__ */ a("tbody", { children: t.slice(0, Ni).map((o) => {
        var s;
        return /* @__PURE__ */ u("tr", { children: [
          /* @__PURE__ */ a("td", { children: /* @__PURE__ */ u(
            "a",
            {
              href: `/${n}/${o.item.media.id}`,
              target: "_blank",
              rel: "noreferrer",
              children: [
                (s = o.item.occurrence) == null ? void 0 : s.performer.name,
                " — ",
                da(o, n)
              ]
            }
          ) }),
          /* @__PURE__ */ a("td", { className: "dq-batch-list-date", children: o.item.media.date ?? "" }),
          /* @__PURE__ */ a("td", { children: i(o) })
        ] }, o.item.key);
      }) })
    ] }) })
  ] });
}
function Df(e) {
  const t = {
    pending: 0,
    changed: 0,
    unchanged: 0,
    skipped: 0,
    failed: 0
  }, n = /* @__PURE__ */ new Map();
  let r = 0, i = !1;
  for (const o of e)
    if (t[o.status] += 1, o.operation && (r += 1), o.status === "failed" && !o.unverified && (i = !0), (o.status === "skipped" || o.status === "failed") && o.error) {
      const s = `${o.status}\0${o.error}`, c = n.get(s) ?? { status: o.status, error: o.error, count: 0 };
      c.count += 1, n.set(s, c);
    }
  return { counts: t, reasons: [...n.values()], recorded: r, retryable: i };
}
function _f({
  review: e,
  disabled: t,
  performerAttention: n,
  trees: r,
  onOpen: i,
  onClose: o
}) {
  const [s, c] = T(!1), [d, f] = T("answers"), [l, h] = T(null), [p, g] = T({}), [y, N] = T([]), [v, w] = T(!1), [E, O] = T(!1), [F, B] = T(""), [C, L] = T(!1), [x, ae] = T(""), [H, _] = T(null), [V, M] = T(null), [D, P] = T([]), [Y, W] = T(0), oe = R(null), Q = R(null), S = R(null), ce = R(!1), A = R(!1), X = R(null), ue = R(!1), pe = R(!1), G = R({ onClose: o });
  G.current = { onClose: o };
  const ye = it(), Ce = d === "run", Se = (H == null ? void 0 : H.kind) === "undo", ve = Ce && l ? l.review : e, Je = Wr(ve.actions), he = ve.occurrence, ot = je(ve), Xe = Nn(ot), Rt = Xe.queue, Wt = Ce && l ? l.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((I) => I.steps.length && !tr(I))
  ), Pt = Wt.filter((I) => y.includes(I.id)), nt = he.targetMode === "selected" && he.performerIds.length === 1, Ge = Zc(
    ve,
    s && nt ? he.performerIds[0] : null,
    Y
  ), Ve = ko(ve.view.objectFilter), He = ka(
    s ? [...ai(Wt), ...he.conditionTagIds, ...Ve] : []
  ), or = Ne(() => Nc(He), [He]), Qe = (I) => p[I] ?? He[I] ?? { id: I, name: `Tag ${I}` }, ze = JSON.stringify(
    Object.fromEntries(
      Ve.flatMap((I) => {
        var J;
        const j = (J = He[I]) == null ? void 0 : J.name;
        return j ? [[String(I), j]] : [];
      })
    )
  ), ft = Ne(
    () => Eo(ve.view.objectFilter, JSON.parse(ze)),
    [ve.view.objectFilter, ze]
  );
  Z(() => {
    var I, j, J;
    s && ((I = oe.current) == null || I.showModal(), (J = (j = oe.current) == null ? void 0 : j.querySelector(".dq-batch-answer input")) == null || J.focus());
  }, [s]), Z(() => {
    if (!s) return;
    const I = requestAnimationFrame(() => {
      var ke;
      const j = oe.current, J = document.activeElement;
      if (!j || J && J !== document.body && j.contains(J)) return;
      (ke = (d === "answers" ? j.querySelector(".dq-batch-answer input:checked") ?? j.querySelector(".dq-batch-answer input") : j.querySelector("[data-batch-focus]")) ?? Q.current) == null || ke.focus();
    });
    return () => cancelAnimationFrame(I);
  }, [s, d, E, l]), Z(() => {
    if (s || t || !ce.current) return;
    const I = requestAnimationFrame(() => {
      const j = S.current;
      if (!ce.current || !j || j.disabled) return;
      ce.current = !1;
      const J = document.activeElement;
      (!J || J === document.body) && j.focus();
    });
    return () => cancelAnimationFrame(I);
  }, [s, t]), Z(() => {
    if (!s || he.targetMode !== "selected") return;
    const I = new AbortController();
    return P([]), xf(he.performerIds.slice(0, ss), I.signal).then((j) => {
      I.signal.aborted || P(j);
    }).catch(() => {
    }), () => I.abort();
  }, [s, he.targetMode, JSON.stringify(he.performerIds)]), Z(
    () => () => {
      var I;
      A.current = !0, (I = X.current) == null || I.abort();
    },
    []
  ), Z(() => {
    if (!E) return;
    const I = (j) => {
      j.preventDefault(), j.returnValue = "";
    };
    return window.addEventListener("beforeunload", I), () => window.removeEventListener("beforeunload", I);
  }, [E]);
  function Oe() {
    f("answers"), h(null), g({}), _(null), w(!1), N([]), ae(""), B(""), L(!1), M(null);
  }
  function Ze() {
    pe.current || (c(!1), G.current.onClose(ue.current), ue.current = !1, Oe(), ce.current = !0);
  }
  function qn(I, j) {
    N(
      (J) => j ? [...J, I] : J.filter((qe) => qe !== I)
    ), h(null), g({}), ae(""), B(""), L(!1), M(null);
  }
  function Lt() {
    f("answers"), M(null), ae("");
  }
  function Sn() {
    f("preview"), l || kn();
  }
  function Yt() {
    var I;
    A.current = !0, (I = X.current) == null || I.abort(), ae("Stopping after in-flight operations settle…");
  }
  function Et(I) {
    M(
      (j) => (j == null ? void 0 : j.group) === I.group && j.reason === I.reason ? null : I
    );
  }
  const wt = (I, j) => (V == null ? void 0 : V.group) === I && V.reason === j;
  async function kn() {
    if (!Pt.length || pe.current) return;
    pe.current = !0, O(!0), B(""), L(!1), ae("Loading all matching occurrences…"), h(null), g({}), M(null);
    const I = new AbortController();
    X.current = I;
    try {
      const j = await Cf(
        e,
        Pt,
        I.signal,
        (qe) => ae(`Loaded ${qe.toLocaleString()} matching occurrences…`)
      );
      I.signal.throwIfAborted();
      const J = {};
      for (const qe of j.entries)
        for (const ke of qe.before.applications ?? [])
          J[ke.tag.id] = ke.tag;
      g(J), h(j), ae("Preview ready. No tags have been changed.");
    } catch (j) {
      B(
        I.signal.aborted ? "Preview cancelled. No tags were changed." : j instanceof Error ? j.message : String(j)
      ), L(!I.signal.aborted && j instanceof Hc), ae("");
    } finally {
      pe.current = !1, O(!1), X.current = null;
    }
  }
  async function pn(I) {
    if (!l || pe.current) return;
    const j = (I === "undo" ? Yc(l) : Wc(l, I === "retry")).length;
    pe.current = !0, A.current = !1, ue.current = !0, O(!0), f("run"), B(""), _({ kind: I, total: j, done: 0, stopped: !1 }), ae(
      I === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const J = () => _((ke) => ke && { ...ke, done: ke.done + 1 });
    let qe = !1;
    try {
      I === "undo" ? await Rf(l, () => A.current, J) : await If(l, v, () => A.current, J, I === "retry"), ae(
        A.current ? "Stopped after in-flight operations settled. Completed changes are retained." : I === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (ke) {
      qe = !0, ae(""), B(ke instanceof Error ? ke.message : String(ke));
    } finally {
      pe.current = !1;
      const ke = A.current || qe;
      _((Pe) => Pe && { ...Pe, stopped: ke }), O(!1), W((Pe) => Pe + 1);
    }
  }
  const me = (l == null ? void 0 : l.entries) ?? [], vt = Ne(
    () => new Map(
      ((l == null ? void 0 : l.entries) ?? []).map((I) => [
        I.item.key,
        Ya(I.before.ids, l.action, l.categories, v)
      ])
    ),
    [l, v]
  ), on = (I) => vt.get(I.item.key), hn = (I) => Hr(I.before.ids, on(I).desired), sr = (I) => {
    const j = hn(I);
    return I.status === "pending" && (j.added.length > 0 || j.removed.length > 0);
  }, Ue = (I) => I.conflict || on(I).kept.length > 0 || on(I).replaced.length > 0, Nt = Ne(() => {
    const I = (l == null ? void 0 : l.entries) ?? [];
    return {
      willChange: I.filter(sr).length,
      correct: I.filter((j) => j.status === "unchanged").length,
      different: I.filter(Ue).length,
      hosts: new Set(I.map((j) => j.item.media.id)).size,
      added: [...new Set(I.flatMap((j) => hn(j).added))],
      removed: [...new Set(I.flatMap((j) => hn(j).removed))]
    };
  }, [vt]), le = Ne(
    () => ((l == null ? void 0 : l.entries) ?? []).filter((I) => I.item.media.date).sort((I, j) => I.item.media.date.localeCompare(j.item.media.date)),
    [l]
  ), U = Ce ? Df(me) : null, xe = (I) => Je.keys[ve.actions.findIndex((j) => j.id === I)] ?? "", $t = (I) => Rr(I, or, [], r), mn = ha(he.condition) && he.includeSubtags !== !1 && he.conditionTagIds.length > 0, se = le[0], pt = le.length > 1 ? le[le.length - 1] : void 0, En = (I) => `/${ot}/${I.item.media.id}`, At = nt ? D[0] : void 0, Dt = Ne(
    () => n ? pc(
      n,
      Ge.summary ? po(
        Ro(Ge.summary, ve.actions, r ?? Mi)
      ) : []
    ) : [],
    [n, Ge.summary, ve.actions, r]
  ), qt = nu(Pt, Dt, r ?? Mi), $e = n ?? [], rt = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: sr },
    correct: { title: "Occurrences already correct", test: (I) => I.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: Ue }
  };
  function Ln() {
    const I = Pf[he.condition], j = !!I && he.conditionTagIds.length > 0, J = he.performerIds.slice(0, ss), qe = String(ve.view.filter.q ?? "").trim(), ke = he.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ u("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      no(he) ? /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "All performers" }) : he.targetMode === "selected" ? /* @__PURE__ */ u(be, { children: [
        J.map((Pe, de) => /* @__PURE__ */ u("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ a(Vr, { performer: { id: Pe, name: D[de] ?? "" } }),
          D[de] ?? "…"
        ] }, Pe)),
        he.performerIds.length > J.length && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
          (he.performerIds.length - J.length).toLocaleString(),
          " more performers"
        ] })
      ] }) : /* @__PURE__ */ u(be, { children: [
        /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "Performer criteria" }),
        /* @__PURE__ */ a(
          "fieldset",
          {
            className: "dq-batch-filter-summary",
            disabled: !0,
            "aria-label": "Batch performer criteria",
            children: /* @__PURE__ */ a(
              pa,
              {
                filter: {},
                objectFilter: he.performerFilter,
                criteriaDefinitions: Yi,
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
      /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
        j ? I : eo[he.condition],
        j && /* @__PURE__ */ a("span", { className: "dq-batch-chip-tags", children: Ar(he.conditionTagIds.map(Qe)).map((Pe) => /* @__PURE__ */ a(Qt, { tag: Pe }, Pe.id)) })
      ] }),
      j && /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: he.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      ha(he.condition) && he.hideConfirmedAbsent !== !1 && /* @__PURE__ */ u("span", { className: "dq-batch-chip", title: ke, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
          ": ",
          ke
        ] })
      ] }),
      qe && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
        "Search “",
        qe,
        "”"
      ] }),
      Object.keys(ve.view.objectFilter).length > 0 && /* @__PURE__ */ a(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${Rt} filters`,
          children: /* @__PURE__ */ a(
            pa,
            {
              filter: ve.view.filter,
              objectFilter: ft,
              criteriaDefinitions: ot === "audio" ? Rs : Xa,
              customFieldEntityType: ot,
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
  function _t(I, j, J = !0) {
    if (!I.length) return null;
    const qe = /* @__PURE__ */ a("strong", { children: At || "This performer" }), ke = J ? `Check the earliest and latest ${Xe.many} before applying, or narrow the batch with a date filter.` : "", Pe = I.every((de) => de.tagIds === null && !de.mixed.length);
    return /* @__PURE__ */ u("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ a(Fn, { "aria-hidden": "true" }),
      /* @__PURE__ */ u("div", { children: [
        Pe ? /* @__PURE__ */ u("p", { children: [
          qe,
          " is flagged: ",
          /* @__PURE__ */ a("strong", { children: I.flatMap((de) => de.flags).join(", ") }),
          ".",
          " ",
          ke
        ] }) : /* @__PURE__ */ u(be, { children: [
          /* @__PURE__ */ u("p", { children: [
            qe,
            " needs attention where the chosen answers apply.",
            ke && ` ${ke}`
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-attention", "aria-label": "Needs attention", children: I.map((de) => /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ a("strong", { children: de.tagIds === null ? "Whole review" : de.name }),
            ":",
            " ",
            ho(de).join("; ")
          ] }, de.key)) })
        ] }),
        j && se && /* @__PURE__ */ u("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ u("a", { href: En(se), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            da(se, ot),
            " · ",
            se.item.media.date
          ] }),
          pt && /* @__PURE__ */ u("a", { href: En(pt), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            da(pt, ot),
            " · ",
            pt.item.media.date
          ] })
        ] })
      ] })
    ] });
  }
  function jt() {
    const I = qt.filter((J) => J.tagIds === null), j = qt.filter((J) => J.tagIds !== null);
    return /* @__PURE__ */ u(be, { children: [
      Ln(),
      _t(I, !1),
      /* @__PURE__ */ u("div", { className: `dq-batch-pick${nt ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ u("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ a("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ a("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ a("div", { className: "dq-batch-answers", children: Wt.map((J, qe) => {
            const ke = xe(J.id);
            return /* @__PURE__ */ u("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ a(
                "input",
                {
                  type: "checkbox",
                  checked: y.includes(J.id),
                  "aria-labelledby": `${ye}-answer-${qe}`,
                  "aria-describedby": `${ye}-effect-${qe}`,
                  onChange: (Pe) => qn(J.id, Pe.target.checked)
                }
              ),
              /* @__PURE__ */ a("span", { className: "dq-batch-answer-key", children: ke && /* @__PURE__ */ a(yt, { binding: ke, hidden: !0 }) }),
              /* @__PURE__ */ u("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ a(
                  "span",
                  {
                    id: `${ye}-answer-${qe}`,
                    className: "dq-batch-answer-label",
                    title: J.label,
                    children: J.label
                  }
                ),
                /* @__PURE__ */ a(ds, { id: `${ye}-effect-${qe}`, parts: $t(J) })
              ] })
            ] }, J.id);
          }) })
        ] }),
        nt && /* @__PURE__ */ u("div", { className: "dq-batch-side", children: [
          /* @__PURE__ */ a("div", { className: "dq-batch-attention-live", "aria-live": "polite", children: _t(j, !1, I.length === 0) }),
          /* @__PURE__ */ a(
            Gi,
            {
              ...Ge,
              mediaKind: ot,
              actions: ve.actions,
              trees: r,
              flags: $e,
              className: "dq-batch-card"
            }
          )
        ] })
      ] })
    ] });
  }
  function Dn(I) {
    const j = Nt, J = V && cs.has(V.group) ? V.group : null, qe = J ? me.filter(rt[J].test) : [], ke = (Pe) => {
      const de = on(Pe), Le = de.skipped ? Hr(
        Pe.before.ids,
        Ya(Pe.before.ids, I.action, I.categories, !0).desired
      ) : hn(Pe), _n = !Le.added.length && !Le.removed.length;
      return /* @__PURE__ */ u("div", { className: "dq-batch-plan", children: [
        de.skipped && /* @__PURE__ */ a("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        _n ? !de.kept.length && /* @__PURE__ */ a("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ a(us, { added: Le.added, removed: Le.removed, tag: Qe }),
        de.kept.map((Te, ge) => /* @__PURE__ */ u("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          Ar(Te.existing.map(Qe)).map((Ct) => /* @__PURE__ */ a(Qt, { tag: Ct }, Ct.id)),
          " ",
          "instead of",
          " ",
          Ar(Te.tagIds.map(Qe)).map((Ct) => /* @__PURE__ */ a(Qt, { tag: Ct }, Ct.id))
        ] }, ge))
      ] });
    };
    return /* @__PURE__ */ u(be, { children: [
      /* @__PURE__ */ u("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ u("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ a(
            la,
            {
              value: me.length,
              label: me.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${j.hosts.toLocaleString()} ${j.hosts === 1 ? Rt : `${Rt}s`}`,
              pressed: wt("matching"),
              onToggle: () => Et({ group: "matching" })
            }
          ),
          /* @__PURE__ */ a(
            la,
            {
              value: j.willChange,
              label: "will change",
              tone: "add",
              pressed: wt("change"),
              onToggle: () => Et({ group: "change" })
            }
          ),
          /* @__PURE__ */ a(
            la,
            {
              value: j.correct,
              label: "already correct, no write",
              pressed: wt("correct"),
              onToggle: () => Et({ group: "correct" })
            }
          ),
          /* @__PURE__ */ a(
            la,
            {
              value: j.different,
              label: v ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: wt("different"),
              onToggle: () => Et({ group: "different" })
            }
          )
        ] }),
        qe.length > 0 ? /* @__PURE__ */ a(
          fs,
          {
            title: rt[J].title,
            entries: qe,
            mediaKind: ot,
            resultHeading: "Planned change",
            describe: ke
          }
        ) : me.length > 0 && /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        me.length > 0 && /* @__PURE__ */ u("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ a("span", { children: se ? `Dates ${se.item.media.date}${pt ? ` to ${pt.item.media.date}` : ""}` : "No dates" }),
          se && /* @__PURE__ */ a(
            "a",
            {
              href: En(se),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${Xe.one}, ${se.item.media.date}`,
              title: da(se, ot),
              children: "Open earliest"
            }
          ),
          pt && /* @__PURE__ */ a(
            "a",
            {
              href: En(pt),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${Xe.one}, ${pt.item.media.date}`,
              title: da(pt, ot),
              children: "Open latest"
            }
          ),
          le.length < me.length && /* @__PURE__ */ u("span", { children: [
            (me.length - le.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (j.added.length > 0 || j.removed.length > 0) && /* @__PURE__ */ u("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ a("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ a(
            us,
            {
              added: j.added,
              removed: j.removed,
              tag: Qe,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      j.different > 0 && /* @__PURE__ */ u("div", { className: "dq-batch-choice", children: [
        /* @__PURE__ */ a("span", { id: `${ye}-choice`, className: "dq-batch-choice-label", children: "Occurrences with a different answer" }),
        /* @__PURE__ */ u(
          "div",
          {
            className: "dq-segmented dq-segmented-fill",
            role: "group",
            "aria-labelledby": `${ye}-choice`,
            children: [
              /* @__PURE__ */ a("button", { type: "button", "aria-pressed": !v, onClick: () => w(!1), children: "Keep their answer" }),
              /* @__PURE__ */ a("button", { type: "button", "aria-pressed": v, onClick: () => w(!0), children: "Replace it" })
            ]
          }
        ),
        /* @__PURE__ */ u("p", { className: "dq-muted", children: [
          "A different answer is a tag the chosen answers would remove",
          mn ? ", or another answer already in a condition category (each condition tag with its subtags); keeping it still fills the empty categories" : "",
          ". Configure opposite answers as removals."
        ] })
      ] })
    ] });
  }
  function gt() {
    return /* @__PURE__ */ u(be, { children: [
      Ln(),
      _t(qt, !0),
      /* @__PURE__ */ u("div", { className: `dq-batch-cards${nt ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ u("section", { className: "dq-batch-card", "aria-labelledby": `${ye}-chosen`, children: [
          /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ a("h3", { id: `${ye}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", disabled: E, onClick: Lt, children: "Change" })
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-chosen", children: Pt.map((I) => {
            const j = xe(I.id);
            return /* @__PURE__ */ u("li", { children: [
              /* @__PURE__ */ u("span", { className: "dq-batch-chosen-chip", children: [
                j && /* @__PURE__ */ a(yt, { binding: j, hidden: !0 }),
                I.label
              ] }),
              /* @__PURE__ */ a(ds, { parts: $t(I) })
            ] }, I.id);
          }) })
        ] }),
        nt && /* @__PURE__ */ a(
          Gi,
          {
            ...Ge,
            mediaKind: ot,
            actions: ve.actions,
            trees: r,
            flags: $e,
            className: "dq-batch-card"
          }
        )
      ] }),
      E ? /* @__PURE__ */ a("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ a("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ a("span", {}) }) }) : l && Dn(l)
    ] });
  }
  function Or(I) {
    const j = H ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, J = j.kind === "apply" ? me.length - I.counts.pending : j.done, qe = j.kind === "apply" ? me.length : j.total, ke = E ? j.kind === "undo" ? "Undoing batch…" : j.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : j.kind === "undo" ? j.stopped ? "Undo stopped" : "Undo finished" : j.stopped ? "Stopped" : "Finished", Pe = qe ? Math.round(J / qe * 100) : 100, de = V && !cs.has(V.group) ? V.group : null, Le = (Te) => ls.find((ge) => ge.status === Te).label, _n = de ? me.filter(
      (Te) => Te.status === de && (!V.reason || Te.error === V.reason)
    ) : [];
    return /* @__PURE__ */ u(be, { children: [
      /* @__PURE__ */ u("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ a("h3", { tabIndex: -1, "data-batch-focus": "", children: ke }),
          /* @__PURE__ */ u("span", { children: [
            J.toLocaleString(),
            " of ",
            qe.toLocaleString(),
            " processed"
          ] })
        ] }),
        /* @__PURE__ */ a(
          "span",
          {
            className: "dq-batch-bar",
            role: "progressbar",
            "aria-label": "Batch progress",
            "aria-valuemin": 0,
            "aria-valuemax": qe,
            "aria-valuenow": J,
            children: /* @__PURE__ */ a("span", { style: { width: `${Pe}%` } })
          }
        ),
        !E && j.kind === "undo" && /* @__PURE__ */ u("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (j.total - I.recorded).toLocaleString(),
          " of",
          " ",
          j.total.toLocaleString(),
          " ",
          j.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ u("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ a("div", { className: "dq-batch-stats", "data-count": "5", children: ls.map((Te) => /* @__PURE__ */ a(
          la,
          {
            value: I.counts[Te.status],
            label: Te.label,
            tone: Te.tone,
            pressed: wt(Te.status),
            onToggle: () => Et({ group: Te.status })
          },
          Te.status
        )) }),
        I.reasons.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-batch-reasons", children: I.reasons.map((Te) => {
          const ge = wt(Te.status, Te.error);
          return /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ u("span", { children: [
              Te.count.toLocaleString(),
              " ",
              Te.status,
              ": ",
              Te.error
            ] }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-link-button",
                "aria-expanded": ge,
                onClick: () => Et({ group: Te.status, reason: Te.error }),
                children: ge ? "Hide them" : "Show them"
              }
            )
          ] }, `${Te.status}-${Te.error}`);
        }) }),
        _n.length > 0 ? /* @__PURE__ */ a(
          fs,
          {
            title: V.reason ? `${Le(de)}: ${V.reason}` : `${Le(de)} occurrences`,
            entries: _n,
            mediaKind: ot,
            resultHeading: "Result",
            describe: (Te) => Te.error ?? Le(Te.status)
          }
        ) : /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." })
      ] }),
      I.recorded > 0 && /* @__PURE__ */ u("div", { className: "dq-batch-undo", children: [
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: E,
            onClick: () => void pn("undo"),
            children: [
              /* @__PURE__ */ a(Xl, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ u("p", { children: [
          Se ? j.stopped || E ? `${I.recorded.toLocaleString()} ${I.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${I.recorded.toLocaleString()} ${I.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${I.recorded === 1 ? "this change" : `these ${I.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          "It lasts until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function Ut() {
    return d === "answers" ? /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !Pt.length,
        onClick: Sn,
        children: "Preview all matches"
      },
      "preview"
    ) : d === "preview" ? E ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: Yt, children: "Cancel preview" }, "cancel-preview") : l ? /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !Nt.willChange,
        onClick: () => void pn("apply"),
        children: [
          "Apply to ",
          Nt.willChange.toLocaleString(),
          " ",
          Nt.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : C ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button primary", onClick: Lt, children: "Change answers" }, "change-answers") : /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void kn(),
        children: "Preview again"
      },
      "again"
    ) : E ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: Yt, children: Se ? "Cancel undo" : "Cancel run" }, "cancel-run") : Se || !U ? null : /* @__PURE__ */ u(Wi, { children: [
      U.retryable && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: () => void pn("retry"), children: "Retry failed" }),
      U.counts.pending > 0 && /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          onClick: () => void pn("apply"),
          children: "Continue"
        }
      )
    ] }, "after-run");
  }
  return /* @__PURE__ */ u(Xu, { children: [
    /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: S,
        title: "Apply answers to all matching occurrences",
        disabled: t || !Wt.length,
        onClick: () => {
          Oe(), i(), c(!0);
        },
        children: [
          /* @__PURE__ */ a(jo, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    s && /* @__PURE__ */ u(
      "dialog",
      {
        ref: oe,
        className: "dq-batch-dialog",
        "aria-labelledby": `${ye}-title`,
        "aria-modal": "true",
        onCancel: (I) => {
          I.preventDefault(), Ze();
        },
        onClose: () => {
          var I;
          pe.current ? (I = oe.current) == null || I.showModal() : Ze();
        },
        children: [
          /* @__PURE__ */ u("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ a(jo, { "aria-hidden": "true" }),
            /* @__PURE__ */ a("h2", { id: `${ye}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: E,
                onClick: Ze,
                children: /* @__PURE__ */ a(va, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a(Lf, { step: d }),
          /* @__PURE__ */ u(
            "div",
            {
              className: "dq-batch-body",
              ref: Q,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": d === "preview" ? "" : void 0,
              "aria-label": `${Vi.find((I) => I.id === d).label} step`,
              children: [
                /* @__PURE__ */ u("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  x && /* @__PURE__ */ a("p", { role: "status", children: x }),
                  F && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: F })
                ] }),
                d === "answers" ? jt() : d === "preview" ? gt() : Or(U)
              ]
            }
          ),
          /* @__PURE__ */ u("div", { className: "dq-batch-footer", children: [
            d === "preview" && /* @__PURE__ */ u("button", { type: "button", className: "dq-button", disabled: E, onClick: Lt, children: [
              /* @__PURE__ */ a(Na, { "aria-hidden": "true" }),
              "Back"
            ] }),
            d === "run" && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: E, onClick: Oe, children: "New batch" }),
            /* @__PURE__ */ a("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: E, onClick: Ze, children: "Close" }),
            Ut()
          ] })
        ]
      }
    )
  ] });
}
const el = "data-quality.description-collapsed.v1";
function jf() {
  try {
    return localStorage.getItem(el) === "true";
  } catch {
    return !1;
  }
}
function Uf({
  details: e,
  label: t
}) {
  const [n, r] = T(jf), i = wn(() => {
    r((o) => {
      const s = !o;
      try {
        localStorage.setItem(el, String(s));
      } catch {
      }
      return s;
    });
  }, []);
  return /* @__PURE__ */ u("section", { className: "dq-media-description", "aria-label": `${t} description`, children: [
    /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button dq-description-toggle",
        "aria-expanded": !n,
        onClick: i,
        children: "Description"
      }
    ),
    !n && (e != null && e.trim() ? /* @__PURE__ */ a(Dl, { className: "dq-description-body", children: e }) : /* @__PURE__ */ a("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
const Bf = (e) => "";
function Kf({
  ranking: e,
  busy: t,
  error: n,
  focus: r,
  disabled: i,
  labels: o,
  flagLabel: s = Bf,
  onFocus: c,
  onMore: d,
  onRefresh: f
}) {
  var p;
  const l = e ? e.ranked.slice(0, e.limit) : [], h = !!e && (e.ranked.length > e.limit || (((p = e.candidates[e.cursor]) == null ? void 0 : p.total) ?? 0) > 0);
  return /* @__PURE__ */ u("div", { className: "dq-performer-ranking", children: [
    /* @__PURE__ */ u("div", { className: "dq-performer-ranking-status", children: [
      n ? /* @__PURE__ */ u("p", { role: "alert", children: [
        "Could not rank performers. ",
        n
      ] }) : t ? /* @__PURE__ */ u("p", { role: "status", children: [
        "Counting matching ",
        o.many,
        " per performer…"
      ] }) : e ? /* @__PURE__ */ a("p", { children: l.length ? `Most matching ${o.queue}s first` : `No performer has matching ${o.many}.` }) : null,
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "Refresh counts",
          title: "Refresh counts",
          disabled: t || i,
          onClick: f,
          children: /* @__PURE__ */ a(Zl, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-queue-list", children: l.map((g) => {
      const y = `${g.count.toLocaleString()} matching ${g.count === 1 ? o.one : o.many}`, N = s(g.tags);
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${g.name}, ${y}${N ? `. ${N}` : ""}`,
          title: N || void 0,
          "aria-current": r === g.id ? "true" : void 0,
          disabled: i,
          onClick: () => c(g.id),
          children: [
            /* @__PURE__ */ a(Vr, { performer: g }),
            /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: g.name }),
            N && /* @__PURE__ */ a(Fn, { className: "dq-flag-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ a("span", { className: "dq-ranked-count", "aria-hidden": "true", children: g.count.toLocaleString() })
          ]
        },
        g.id
      );
    }) }),
    h && !t && !n && /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button dq-ranking-more",
        disabled: i,
        onClick: d,
        children: "Show more performers"
      }
    )
  ] });
}
const Gf = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], Vf = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function zf(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), r = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), i = t.bottom + 8;
  return { top: i, left: r, width: n, maxHeight: Math.max(160, window.innerHeight - i - 16) };
}
function ja(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function Jf(e, t) {
  const n = no(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", r = e.conditionTagIds.map(
    (o) => t[o] === void 0 ? "…" : t[o] ?? "Unavailable tag"
  ), i = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${ja(r, "or")}`,
    includesAll: `has ${ja(r, "and")}`,
    excludes: `has none of ${ja(r, "or")}`,
    excludesAll: `missing ${ja(r, "or")}`
  };
  return `${n} · ${i[e.condition]}`;
}
function Hf({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: r,
  onEditCriteria: i
}) {
  const [o, s] = T(!1), [c, d] = T(null), f = R(null), l = R(null), h = it(), p = Yr(e.conditionTagIds), g = Jf(e, p);
  kt(() => {
    const w = f.current;
    if (!o || !w) return;
    const E = () => d(zf(w));
    E(), window.addEventListener("resize", E);
    const O = typeof ResizeObserver > "u" ? null : new ResizeObserver(E), F = [w, w.closest(".dq-review-header-trail"), w.closest("header")];
    for (const B of F) B && (O == null || O.observe(B));
    return () => {
      window.removeEventListener("resize", E), O == null || O.disconnect();
    };
  }, [o]), Z(() => {
    var E, O;
    if (!o) return;
    const w = (E = l.current) == null ? void 0 : E.querySelector('[aria-pressed="true"]');
    w && !w.disabled ? w.focus() : (O = l.current) == null || O.focus();
  }, [o]);
  const y = () => {
    s(!1), requestAnimationFrame(() => {
      var w;
      return (w = f.current) == null ? void 0 : w.focus();
    });
  }, N = (w) => {
    if (!(w.target instanceof Element && w.target.closest('[role="dialog"]') !== l.current || w.defaultPrevented || an(w))) {
      if (w.key === "Escape")
        w.preventDefault(), y();
      else if (w.key === "Tab" && l.current) {
        const O = [...l.current.querySelectorAll(Vf)].filter((L) => L.closest('[role="dialog"]') === l.current).sort(
          (L, x) => L.compareDocumentPosition(x) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!O.length) return;
        const F = O[0], B = O[O.length - 1], C = document.activeElement;
        w.shiftKey && (C === F || C === l.current) ? (w.preventDefault(), B.focus()) : !w.shiftKey && C === B && (w.preventDefault(), F.focus());
      }
    }
  }, v = !["any", "isNull"].includes(e.condition);
  return /* @__PURE__ */ u("div", { className: "dq-scope", children: [
    /* @__PURE__ */ u(
      "button",
      {
        ref: f,
        type: "button",
        className: "dq-header-button dq-scope-button",
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        "aria-controls": o ? h : void 0,
        title: g,
        onClick: () => o ? y() : s(!0),
        children: [
          /* @__PURE__ */ a(Ls, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-summary", children: g }),
          /* @__PURE__ */ a(Xi, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ u(be, { children: [
      /* @__PURE__ */ a("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: y }),
      /* @__PURE__ */ u(
        "div",
        {
          ref: l,
          id: h,
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
            /* @__PURE__ */ u("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ a("legend", { className: "dq-eyebrow", children: "Performers to review" }),
              /* @__PURE__ */ a("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: Gf.map(({ mode: w, label: E }) => /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === w,
                  onClick: () => e.targetMode !== w && r({ targetMode: w }),
                  children: E
                },
                w
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ a(
                nr,
                {
                  entityType: "performer",
                  values: e.performerIds,
                  onChange: (w) => r({ performerIds: w }),
                  placeholder: "All performers...",
                  allowCreate: !1
                }
              ),
              e.targetMode === "filter" && /* @__PURE__ */ u("div", { className: "dq-scope-criteria", children: [
                /* @__PURE__ */ a("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ a(
                  pa,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: Yi,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (w) => r({ performerFilter: w })
                  }
                ) }),
                /* @__PURE__ */ u("button", { type: "button", className: "dq-button", onClick: i, children: [
                  /* @__PURE__ */ a(Jr, { "aria-hidden": "true" }),
                  "Edit criteria"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ u("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ a("legend", { className: "dq-eyebrow", children: "Occurrence tags" }),
              /* @__PURE__ */ a(
                "select",
                {
                  className: "dq-select",
                  "aria-label": "Occurrence condition",
                  value: e.condition,
                  onChange: (w) => r({ condition: w.target.value }),
                  children: to.map((w) => /* @__PURE__ */ a("option", { value: w, children: eo[w] }, w))
                }
              ),
              v && /* @__PURE__ */ u(be, { children: [
                /* @__PURE__ */ a(
                  nr,
                  {
                    entityType: "tag",
                    values: e.conditionTagIds,
                    onChange: (w) => r({ conditionTagIds: w }),
                    placeholder: "Add a condition tag…",
                    allowCreate: !1
                  }
                ),
                /* @__PURE__ */ u("div", { className: "dq-scope-options", children: [
                  /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ a(
                      "input",
                      {
                        type: "checkbox",
                        checked: e.includeSubtags ?? !0,
                        onChange: (w) => r({ includeSubtags: w.target.checked })
                      }
                    ),
                    "Include subtags"
                  ] }),
                  ha(e.condition) && /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ a(
                      "input",
                      {
                        type: "checkbox",
                        checked: e.hideConfirmedAbsent ?? !0,
                        onChange: (w) => r({ hideConfirmedAbsent: w.target.checked })
                      }
                    ),
                    "Hide occurrences confirmed absent"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-scope-footer", children: [
              /* @__PURE__ */ a("p", { children: n ? "Applies to this queue at once, and Save review keeps it." : "Applies to this queue at once; Save to review in the header keeps it." }),
              /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: y, children: "Done" })
            ] })
          ]
        }
      )
    ] })
  ] });
}
function Ga(e) {
  const {
    page: t,
    perPage: n,
    sort: r,
    direction: i,
    sorts: o,
    seed: s,
    ...c
  } = e.view.filter, {
    performerFlags: d,
    flagPerformerTagIds: f,
    ...l
  } = e.occurrence;
  return JSON.stringify([
    e.entityType,
    c,
    e.view.objectFilter,
    e.view.searchMode,
    l
  ]);
}
function Qf(e) {
  const t = e.occurrence;
  return JSON.stringify([
    je(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {}
  ]);
}
async function Wf(e, t) {
  const n = je(e) === "audio", r = (s) => ({
    id: s.id,
    name: s.name,
    total: (n ? s.audioCount : s.videoCount) ?? 0,
    tags: (s.tags ?? []).map((c) => ({ id: c.id, name: c.name }))
  }), i = e.occurrence, o = [];
  if (i.targetMode === "selected" && i.performerIds.length > 0)
    for (const s of i.performerIds) {
      const c = await xd(
        `/api/performers/${s}`,
        { signal: t }
      );
      c && o.push(r(c));
    }
  else {
    const { _filterExpression: s, ...c } = i.targetMode === "filter" ? i.performerFilter : {};
    for (let d = 1; ; d++) {
      const f = await we(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            Pn({
              findFilter: {
                page: d,
                perPage: 1e3,
                sort: n ? "audio_count" : "video_count",
                direction: "desc"
              },
              objectFilter: c,
              filterExpression: s
            })
          )
        }
      );
      if (o.push(...f.items.map(r)), d * 1e3 >= f.totalCount || !f.items.length) break;
    }
  }
  return o.sort((s, c) => c.total - s.total || s.id - c.id);
}
function tl(e, t, n) {
  const r = Co(e, [t]);
  return tc(r, r.view.filter, n);
}
function nl(e, t) {
  const n = e.findIndex(
    (r) => r.count < t.count || r.count === t.count && r.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function zi(e, t, n, r) {
  if (t >= e.length) return !0;
  const i = e[t].total;
  return i <= 0 ? !0 : n.length >= r && i < n[r - 1].count;
}
async function Yf(e, t, n, r, i = {}) {
  const o = Ga(e), s = Qf(e), c = Vc(e.occurrence), d = (t == null ? void 0 : t.signature) === o && !t.partial ? t : {
    signature: o,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: c ? "" : s,
    candidates: c ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await Wf(e, r),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: f } = d, l = [...d.ranked];
  let h = d.cursor, p = !1;
  const g = (y) => ({
    ...d,
    cursor: h,
    ranked: [...l],
    limit: n,
    complete: !y && zi(f, h, l, n),
    ...y ? { partial: y } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: i.concurrency ?? 6 }, async () => {
        var y;
        for (; !p && !zi(f, h, l, n); ) {
          r.throwIfAborted();
          const N = f[h++], v = await tl(e, N.id, r);
          v > 0 && nl(l, { ...N, count: v }), (y = i.onProgress) == null || y.call(i, g(!0));
        }
      })
    );
  } catch (y) {
    throw p = !0, y;
  }
  return r.throwIfAborted(), g(!1);
}
function Xf(e, t, n) {
  const r = e.candidates.findIndex((o) => o.id === t);
  if (e.partial || r < 0 || r >= e.cursor) return e;
  const i = e.ranked.filter((o) => o.id !== t);
  return n > 0 && nl(i, { ...e.candidates[r], count: n }), {
    ...e,
    ranked: i,
    complete: zi(e.candidates, e.cursor, i, e.limit)
  };
}
const Ji = /* @__PURE__ */ new Map();
function Zf(e) {
  return Array.isArray(e) ? e.flatMap(
    (t) => t && Number.isSafeInteger(t.id) && typeof t.name == "string" ? [{ id: t.id, name: t.name }] : []
  ) : [];
}
function rl(e, t) {
  const n = Zf(t);
  return Ji.set(e, n), n;
}
function ep(e) {
  const [t, n] = T(null);
  if (Z(() => {
    if (e === null || Ji.has(e)) return;
    const r = new AbortController();
    return we(`/api/performers/${e}`, { signal: r.signal }).then(
      (i) => {
        const o = rl(e, i == null ? void 0 : i.tags);
        r.signal.aborted || n({ id: e, tags: o });
      },
      () => {
      }
    ), () => r.abort();
  }, [e]), e !== null)
    return Ji.get(e) ?? ((t == null ? void 0 : t.id) === e ? t.tags : void 0);
}
var qi = { exports: {} }, ps;
function tp() {
  return ps || (ps = 1, (function(e) {
    var t = (function() {
      var n = String.fromCharCode, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", o = {};
      function s(d, f) {
        if (!o[d]) {
          o[d] = {};
          for (var l = 0; l < d.length; l++)
            o[d][d.charAt(l)] = l;
        }
        return o[d][f];
      }
      var c = {
        compressToBase64: function(d) {
          if (d == null) return "";
          var f = c._compress(d, 6, function(l) {
            return r.charAt(l);
          });
          switch (f.length % 4) {
            // To produce valid Base64
            default:
            // When could this happen ?
            case 0:
              return f;
            case 1:
              return f + "===";
            case 2:
              return f + "==";
            case 3:
              return f + "=";
          }
        },
        decompressFromBase64: function(d) {
          return d == null ? "" : d == "" ? null : c._decompress(d.length, 32, function(f) {
            return s(r, d.charAt(f));
          });
        },
        compressToUTF16: function(d) {
          return d == null ? "" : c._compress(d, 15, function(f) {
            return n(f + 32);
          }) + " ";
        },
        decompressFromUTF16: function(d) {
          return d == null ? "" : d == "" ? null : c._decompress(d.length, 16384, function(f) {
            return d.charCodeAt(f) - 32;
          });
        },
        //compress into uint8array (UCS-2 big endian format)
        compressToUint8Array: function(d) {
          for (var f = c.compress(d), l = new Uint8Array(f.length * 2), h = 0, p = f.length; h < p; h++) {
            var g = f.charCodeAt(h);
            l[h * 2] = g >>> 8, l[h * 2 + 1] = g % 256;
          }
          return l;
        },
        //decompress from uint8array (UCS-2 big endian format)
        decompressFromUint8Array: function(d) {
          if (d == null)
            return c.decompress(d);
          for (var f = new Array(d.length / 2), l = 0, h = f.length; l < h; l++)
            f[l] = d[l * 2] * 256 + d[l * 2 + 1];
          var p = [];
          return f.forEach(function(g) {
            p.push(n(g));
          }), c.decompress(p.join(""));
        },
        //compress into a string that is already URI encoded
        compressToEncodedURIComponent: function(d) {
          return d == null ? "" : c._compress(d, 6, function(f) {
            return i.charAt(f);
          });
        },
        //decompress from an output of compressToEncodedURIComponent
        decompressFromEncodedURIComponent: function(d) {
          return d == null ? "" : d == "" ? null : (d = d.replace(/ /g, "+"), c._decompress(d.length, 32, function(f) {
            return s(i, d.charAt(f));
          }));
        },
        compress: function(d) {
          return c._compress(d, 16, function(f) {
            return n(f);
          });
        },
        _compress: function(d, f, l) {
          if (d == null) return "";
          var h, p, g = {}, y = {}, N = "", v = "", w = "", E = 2, O = 3, F = 2, B = [], C = 0, L = 0, x;
          for (x = 0; x < d.length; x += 1)
            if (N = d.charAt(x), Object.prototype.hasOwnProperty.call(g, N) || (g[N] = O++, y[N] = !0), v = w + N, Object.prototype.hasOwnProperty.call(g, v))
              w = v;
            else {
              if (Object.prototype.hasOwnProperty.call(y, w)) {
                if (w.charCodeAt(0) < 256) {
                  for (h = 0; h < F; h++)
                    C = C << 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++;
                  for (p = w.charCodeAt(0), h = 0; h < 8; h++)
                    C = C << 1 | p & 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, p = p >> 1;
                } else {
                  for (p = 1, h = 0; h < F; h++)
                    C = C << 1 | p, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, p = 0;
                  for (p = w.charCodeAt(0), h = 0; h < 16; h++)
                    C = C << 1 | p & 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, p = p >> 1;
                }
                E--, E == 0 && (E = Math.pow(2, F), F++), delete y[w];
              } else
                for (p = g[w], h = 0; h < F; h++)
                  C = C << 1 | p & 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, p = p >> 1;
              E--, E == 0 && (E = Math.pow(2, F), F++), g[v] = O++, w = String(N);
            }
          if (w !== "") {
            if (Object.prototype.hasOwnProperty.call(y, w)) {
              if (w.charCodeAt(0) < 256) {
                for (h = 0; h < F; h++)
                  C = C << 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++;
                for (p = w.charCodeAt(0), h = 0; h < 8; h++)
                  C = C << 1 | p & 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, p = p >> 1;
              } else {
                for (p = 1, h = 0; h < F; h++)
                  C = C << 1 | p, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, p = 0;
                for (p = w.charCodeAt(0), h = 0; h < 16; h++)
                  C = C << 1 | p & 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, p = p >> 1;
              }
              E--, E == 0 && (E = Math.pow(2, F), F++), delete y[w];
            } else
              for (p = g[w], h = 0; h < F; h++)
                C = C << 1 | p & 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, p = p >> 1;
            E--, E == 0 && (E = Math.pow(2, F), F++);
          }
          for (p = 2, h = 0; h < F; h++)
            C = C << 1 | p & 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, p = p >> 1;
          for (; ; )
            if (C = C << 1, L == f - 1) {
              B.push(l(C));
              break;
            } else L++;
          return B.join("");
        },
        decompress: function(d) {
          return d == null ? "" : d == "" ? null : c._decompress(d.length, 32768, function(f) {
            return d.charCodeAt(f);
          });
        },
        _decompress: function(d, f, l) {
          var h = [], p = 4, g = 4, y = 3, N = "", v = [], w, E, O, F, B, C, L, x = { val: l(0), position: f, index: 1 };
          for (w = 0; w < 3; w += 1)
            h[w] = w;
          for (O = 0, B = Math.pow(2, 2), C = 1; C != B; )
            F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
          switch (O) {
            case 0:
              for (O = 0, B = Math.pow(2, 8), C = 1; C != B; )
                F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
              L = n(O);
              break;
            case 1:
              for (O = 0, B = Math.pow(2, 16), C = 1; C != B; )
                F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
              L = n(O);
              break;
            case 2:
              return "";
          }
          for (h[3] = L, E = L, v.push(L); ; ) {
            if (x.index > d)
              return "";
            for (O = 0, B = Math.pow(2, y), C = 1; C != B; )
              F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
            switch (L = O) {
              case 0:
                for (O = 0, B = Math.pow(2, 8), C = 1; C != B; )
                  F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
                h[g++] = n(O), L = g - 1, p--;
                break;
              case 1:
                for (O = 0, B = Math.pow(2, 16), C = 1; C != B; )
                  F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
                h[g++] = n(O), L = g - 1, p--;
                break;
              case 2:
                return v.join("");
            }
            if (p == 0 && (p = Math.pow(2, y), y++), h[L])
              N = h[L];
            else if (L === g)
              N = E + E.charAt(0);
            else
              return null;
            v.push(N), h[g++] = E + N.charAt(0), p--, E = N, p == 0 && (p = Math.pow(2, y), y++);
          }
        }
      };
      return c;
    })();
    e != null ? e.exports = t : typeof angular < "u" && angular != null && angular.module("LZString", []).factory("LZString", function() {
      return t;
    });
  })(qi)), qi.exports;
}
var al = tp();
function rr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, c) => rr(s, t[c]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, r = t, i = Object.keys(n).sort(), o = Object.keys(r).sort();
  return i.length === o.length && i.every(
    (s, c) => s === o[c] && rr(n[s], r[s])
  );
}
function np(e) {
  var c, d, f;
  const [t, n] = T({}), [r, i] = T(""), o = (((c = e == null ? void 0 : e.presentation) == null ? void 0 : c.annotations) ?? []).includes("tags") ? ((d = e == null ? void 0 : e.presentation) == null ? void 0 : d.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...o,
      ...((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.binParents) ?? []
    ])
  ]);
  return Z(() => {
    let l = !0;
    return n({}), i(""), Promise.all(
      JSON.parse(s).map(
        async (h) => [h, await ri([h])]
      )
    ).then((h) => {
      l && n(Object.fromEntries(h));
    }).catch(() => {
      l && i(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      l = !1;
    };
  }, [s]), { ids: t, error: r };
}
function il(e, t, n) {
  const r = t == null ? void 0 : t.presentation, i = (r == null ? void 0 : r.annotations) ?? [], o = (r == null ? void 0 : r.annotationParents) ?? [];
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
function rp(e, t, n) {
  var s;
  const r = il(e, t, n), i = t == null ? void 0 : t.presentation, o = (i == null ? void 0 : i.annotations) ?? [];
  return {
    performers: o.includes("performers") ? (r.performers ?? []).map((c) => c.name) : [],
    tags: o.includes("tags") && ((s = i == null ? void 0 : i.annotationParents) != null && s.length) ? r.tags ?? [] : null
  };
}
function ap({
  videos: e,
  review: t,
  savedObjectFilter: n,
  trees: r,
  disabled: i,
  onToggle: o
}) {
  var y, N;
  const s = ((y = t.presentation) == null ? void 0 : y.binParents) ?? [], c = new Set(
    s.flatMap((v) => (r[v] ?? []).filter((w) => w !== v))
  ), d = s.every((v) => r[v]), f = $r(
    t.view.objectFilter,
    n,
    (N = t.presentation) == null ? void 0 : N.filterBins
  ).bins.filter(
    (v) => typeof v == "number" && (!d || c.has(v))
  ), l = /* @__PURE__ */ new Map();
  for (const v of e)
    for (const w of v.tags ?? [])
      if (c.has(w.id)) {
        const E = l.get(w.id) ?? { name: w.name, count: 0 };
        E.count++, l.set(w.id, E);
      }
  const h = f.filter((v) => !l.has(v)), p = Yr(h);
  for (const v of h)
    l.set(v, {
      name: p[v] === void 0 ? "…" : p[v] ?? "Unavailable tag",
      count: 0
    });
  if (!s.length) return null;
  const g = [...l].sort((v, w) => v[1].name.localeCompare(w[1].name));
  return /* @__PURE__ */ u("div", { className: "dq-bins", role: "group", "aria-label": "Tag bins on this page", children: [
    /* @__PURE__ */ a("span", { className: "dq-bins-label", "aria-hidden": "true", children: "On this page" }),
    g.map(([v, w]) => {
      const E = f.includes(v);
      return /* @__PURE__ */ u(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": E,
          title: E ? `Show every video again, not only ${w.name}` : `Show only videos tagged ${w.name}`,
          disabled: i,
          onClick: () => o(v),
          children: [
            E && /* @__PURE__ */ a(Qr, { "aria-hidden": "true" }),
            w.name,
            " ",
            /* @__PURE__ */ a("span", { className: "dq-bin-count", children: w.count })
          ]
        },
        v
      );
    }),
    !g.length && /* @__PURE__ */ a("span", { className: "dq-bins-empty", children: "No matching tag bins on this page." })
  ] });
}
function ip({
  review: e,
  savedObjectFilter: t,
  queueFilter: n,
  queueCount: r,
  disabled: i,
  countsPaused: o,
  onToggle: s
}) {
  var h, p;
  const c = ((h = e.presentation) == null ? void 0 : h.filterBins) ?? [], d = $r(e.view.objectFilter, t, c).bins, f = op(e, t, n, o);
  if (!c.length) return null;
  const l = /* @__PURE__ */ new Map();
  for (const g of c) {
    const y = ((p = g.group) == null ? void 0 : p.trim()) ?? "";
    l.set(y, [...l.get(y) ?? [], g]);
  }
  return /* @__PURE__ */ a(be, { children: [...l].map(([g, y]) => /* @__PURE__ */ u(
    "div",
    {
      className: "dq-bins",
      role: "group",
      "aria-label": g ? `${g} bins` : "Filter bins",
      children: [
        g && /* @__PURE__ */ a("span", { className: "dq-bins-label", "aria-hidden": "true", children: g }),
        y.map((N) => {
          const v = d.includes(N.key), w = v ? r : f[N.key];
          return /* @__PURE__ */ u(
            "button",
            {
              className: "dq-bin",
              type: "button",
              "aria-pressed": v,
              title: v ? `Show every video again, not only ${N.label}` : `Show only videos matching ${N.label}`,
              disabled: i,
              onClick: () => s(N.key),
              children: [
                v && /* @__PURE__ */ a(Qr, { "aria-hidden": "true" }),
                N.label,
                " ",
                /* @__PURE__ */ a("span", { className: "dq-bin-count", children: w ?? "…" })
              ]
            },
            N.key
          );
        })
      ]
    },
    g
  )) });
}
function op(e, t, n, r) {
  var l;
  const [i, o] = T({}), { page: s, ...c } = n, d = JSON.stringify([
    e.view.objectFilter,
    e.view.searchMode,
    ((l = e.presentation) == null ? void 0 : l.filterBins) ?? [],
    t,
    c
  ]), f = R(null);
  return Z(() => {
    var y, N;
    if (r || f.current === d) return;
    f.current = d, o({});
    let h = 0;
    const p = new AbortController(), g = $r(
      e.view.objectFilter,
      t,
      (y = e.presentation) == null ? void 0 : y.filterBins
    ).bins;
    for (const v of ((N = e.presentation) == null ? void 0 : N.filterBins) ?? [])
      g.includes(v.key) || (h++, tc(sl(e, v.key, t), n, p.signal).then((w) => {
        p.signal.aborted || o((E) => ({ ...E, [v.key]: w }));
      }).catch(() => {
      }).finally(() => {
        p.signal.aborted || h--;
      }));
    return () => {
      h > 0 && (f.current = null), p.abort();
    };
  }, [d, r]), i;
}
function kr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function sp(e) {
  if (!kr(e) || Object.keys(e).length !== 1 || !kr(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !kr(t.tagsCriterion)) return null;
  const { value: n, modifier: r, depth: i, ...o } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && r === "INCLUDES" && i === 0 && !Object.keys(o).length ? n[0] : null;
}
function ol(e) {
  const { _filterExpression: t, ...n } = e;
  return t ? Object.keys(n).length ? {
    group: { operator: "AND", children: [{ filter: n }, { group: t }] }
  } : { group: t } : { filter: n };
}
function cp(e, t) {
  const n = t.find(
    (r) => rr(e, ol(r.filter))
  );
  return n ? n.key : sp(e);
}
function $r(e, t, n = []) {
  let r = e;
  const i = [];
  for (; ; ) {
    if (t && rr(r, t)) {
      r = t;
      break;
    }
    const o = Object.keys(r);
    if (o.length !== 1 || o[0] !== "_filterExpression") break;
    const s = r._filterExpression;
    if (!kr(s) || s.operator !== "AND" || !Array.isArray(s.children))
      break;
    const c = s.children, d = cp(c.at(-1), n);
    if (d == null || c.length > 3) break;
    let f = {}, l = null, h = !0;
    for (const [p, g] of c.slice(0, -1).entries())
      !kr(g) || Object.keys(g).length !== 1 ? h = !1 : p === 0 && kr(g.filter) && Object.keys(g.filter).length ? f = g.filter : !l && kr(g.group) ? l = g.group : h = !1;
    if (!h) break;
    i.unshift(d), r = l ? { ...f, _filterExpression: l } : f;
  }
  return { base: r, bins: i };
}
function sl(e, t, n) {
  var f;
  const r = ((f = e.presentation) == null ? void 0 : f.filterBins) ?? [], { base: i, bins: o } = $r(e.view.objectFilter, n, r), s = (l) => {
    var h, p;
    return ((p = (h = r.find((g) => g.key === l)) == null ? void 0 : h.group) == null ? void 0 : p.trim()) || null;
  }, c = s(t);
  return (o.includes(t) ? o.filter((l) => l !== t) : [...o.filter((l) => !c || s(l) !== c), t]).reduce(lp, { ...e, view: { ...e.view, objectFilter: i } });
}
function lp(e, t) {
  var o, s;
  let n;
  if (typeof t == "number")
    n = { filter: { tagsCriterion: { value: [t], modifier: "INCLUDES", depth: 0 } } };
  else {
    const c = (s = (o = e.presentation) == null ? void 0 : o.filterBins) == null ? void 0 : s.find((d) => d.key === t);
    if (!c || !Object.keys(c.filter).length) return e;
    n = ol(c.filter);
  }
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
            n
          ]
        }
      }
    }
  };
}
const ii = [
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
], dp = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function Ir(e) {
  const t = Re(e) ? e.occurrence : void 0;
  return {
    filter: Ht({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, je(e)),
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
function hs(e) {
  return al.compressToEncodedURIComponent(JSON.stringify(e));
}
function ms(e) {
  if (!e) return {};
  const t = e.startsWith("{") ? e : al.decompressFromEncodedURIComponent(e), n = t ? JSON.parse(t) : null;
  if (!n || typeof n != "object" || Array.isArray(n))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return n;
}
function Hi(e, t) {
  let n;
  if (Re(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!ii.some((c) => c !== "performer" && t.has(c))) {
    const c = Ir(e);
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
      const f = d.lastIndexOf(":");
      return { key: d.slice(0, f), direction: d.slice(f + 1) };
    });
    if (c.some((d) => !d.key || !["asc", "desc"].includes(d.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = c, i.sort = c[0].key, i.direction = c[0].direction;
  }
  let o;
  if (Re(e) && (o = {
    ...dp,
    ...ms(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(o.targetMode) || !to.includes(o.condition) || !Array.isArray(o.performerIds) || !Array.isArray(o.conditionTagIds) || typeof o.includeSubtags != "boolean" || typeof o.hideConfirmedAbsent != "boolean" || [...o.performerIds, ...o.conditionTagIds].some(
    (c) => !Number.isSafeInteger(c) || c <= 0
  ) || !o.performerFilter || typeof o.performerFilter != "object" || Array.isArray(o.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Ht(i, je(e)),
      objectFilter: ms(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: o,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
const gs = { dataQualityOpenedFromList: !0 };
function cl() {
  const e = window.history.state;
  return !!e && typeof e == "object" && e.dataQualityOpenedFromList === !0;
}
function ll(e, { openingFromList: t = !1 } = {}) {
  t ? window.history.pushState({ ...gs }, "", e) : window.history.replaceState(cl() ? { ...gs } : null, "", e);
}
function fa(e, t) {
  const n = new URLSearchParams(window.location.search);
  ii.forEach((r) => n.delete(r)), n.set("review", e);
  for (const r of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[r] !== void 0 && n.set(r, String(t.filter[r]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((r) => `${r.key}:${r.direction}`).join(",")
  ), n.set("filters", hs(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", hs(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), ll(`${window.location.pathname}?${n}${window.location.hash}`);
}
function vn(e, t) {
  const n = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return Re(e) ? {
    ...e,
    view: n,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: n };
}
function Cr(e) {
  const t = e;
  return vn(t, Ir(t));
}
function bs(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !rr(
    JSON.parse(Xn(vn(e, t))),
    JSON.parse(Xn(vn(e, Ir(e))))
  );
}
function $o(...e) {
  return e.flatMap(
    (t) => {
      var n;
      return _e(t) === "video" ? ((n = t.presentation) == null ? void 0 : n.filterBins) ?? [] : [];
    }
  );
}
function dl(e, t) {
  if (_e(e) !== "video") return e;
  const { base: n, bins: r } = $r(
    e.view.objectFilter,
    t.view.objectFilter,
    $o(e, t)
  );
  return r.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function Ua(e, t) {
  if (_e(e) !== "video") return t;
  const { base: n, bins: r } = $r(
    t.objectFilter,
    e.view.objectFilter,
    $o(e)
  );
  return r.length ? { ...t, objectFilter: n } : t;
}
function ys(e, t) {
  return !t || !Re(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function Si(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const r of e)
    n.set(r.media.id, [...n.get(r.media.id) ?? [], r]);
  return [...n.values()].reverse().flat();
}
const Jt = (e) => e instanceof Error ? e.message : "Request failed.", ki = 50, up = [], ws = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function fp(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? Ul(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? Ms(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function pp({ media: e, kind: t }) {
  const [n, r] = T(!1);
  return /* @__PURE__ */ a("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ a(_s, {}) : /* @__PURE__ */ a(ei, {}) : /* @__PURE__ */ a(
    "img",
    {
      src: $i(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => r(!0)
    }
  ) });
}
function hp({
  tags: e,
  preview: t,
  editor: n,
  tagsChangedSinceEditing: r = !1,
  trees: i,
  actionTagIds: o,
  label: s
}) {
  const c = !!n && !r, d = wo(t), f = n ? null : d, l = e == null ? void 0 : e.absent, h = ka(
    Ne(() => [...o, ...l ?? []], [o, l])
  ), p = (H) => h[H] ?? { id: H, name: h[H] === void 0 ? "…" : "Unavailable tag" }, g = (H) => Ar(H.map(p)), y = f && e ? fo(f, e, i) : null, N = e ? Qd(e) : [], v = new Set(N.map((H) => H.id)), w = new Set(y == null ? void 0 : y.removed), E = new Set(y == null ? void 0 : y.markedAbsent), O = new Set(y == null ? void 0 : y.absenceCleared), F = /* @__PURE__ */ u("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ a(Va, { "aria-hidden": "true" }),
    "absent"
  ] }), B = g((y == null ? void 0 : y.added) ?? []), C = g(((y == null ? void 0 : y.markedAbsent) ?? []).filter((H) => !v.has(H))), L = c ? "h3" : "h4", x = !!(e != null && e.absent.length) && /* @__PURE__ */ u(be, { children: [
    /* @__PURE__ */ a(L, { className: "dq-subheading", children: "Confirmed absent" }),
    /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: g(e.absent).map((H) => /* @__PURE__ */ u(
      "li",
      {
        className: `dq-tag dq-tag-absent${O.has(H.id) ? " dq-tag-removed" : ""}`,
        children: [
          /* @__PURE__ */ a(Va, { "aria-hidden": "true" }),
          O.has(H.id) ? /* @__PURE__ */ u("del", { children: [
            "− ",
            /* @__PURE__ */ a(Qt, { tag: H })
          ] }) : /* @__PURE__ */ a(Qt, { tag: H })
        ]
      },
      H.id
    )) })
  ] }), ae = /* @__PURE__ */ u("section", { className: "dq-panel-section", "aria-label": s, children: [
    /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ u(be, { children: [
      N.length || B.length || C.length ? /* @__PURE__ */ u("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        N.map(
          (H) => w.has(H.id) ? /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ u("del", { children: [
              "− ",
              /* @__PURE__ */ a(Qt, { tag: H })
            ] }),
            E.has(H.id) && F
          ] }, H.id) : /* @__PURE__ */ a("li", { className: "dq-tag", children: /* @__PURE__ */ a(Qt, { tag: H }) }, H.id)
        ),
        B.map((H) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
          "+ ",
          /* @__PURE__ */ a(Qt, { tag: H })
        ] }) }, `added-${H.id}`)),
        C.map((H) => /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ a("ins", { children: /* @__PURE__ */ a(Qt, { tag: H }) }),
          F
        ] }, `absent-${H.id}`))
      ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "None" }),
      x
    ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "Loading…" })
  ] });
  return /* @__PURE__ */ u(be, { children: [
    !c && ae,
    n,
    c && x && /* @__PURE__ */ a("section", { className: "dq-panel-section", "aria-label": "Confirmed absent", children: x })
  ] });
}
function mp({ entries: e }) {
  return /* @__PURE__ */ a("ul", { className: "dq-attention", "aria-label": "Needs attention", children: e.map((t) => /* @__PURE__ */ u("li", { className: "dq-attention-item", children: [
    t.tagIds !== null && /* @__PURE__ */ a("span", { className: "dq-attention-category", children: t.name }),
    ho(t).map((n) => /* @__PURE__ */ u("span", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
      /* @__PURE__ */ a(Fn, { "aria-hidden": "true" }),
      n
    ] }, n))
  ] }, t.key)) });
}
function gp({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: r,
  onSaveDefaults: i,
  editRequest: o = 0,
  onEditRequestHandled: s,
  pageControls: c,
  stayOnTap: d,
  onStayOnTapChange: f
}) {
  var Ra;
  const l = je(e), h = Nn(l), p = l === "audio" ? "Audio" : "Scene", g = (m) => {
    var k;
    return m.title || ((k = m.files[0]) == null ? void 0 : k.basename) || p;
  }, y = (m) => `${m.occurrence ? `${m.occurrence.performer.name} — ` : ""}${g(m.media)}`, N = R(null), v = R("");
  if (!N.current)
    try {
      N.current = Hi(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (m) {
      v.current = Jt(m), N.current = { query: Ir(e), startAtEnd: !1 };
    }
  const [w, E] = T(null), [O, F] = T(""), B = R(null), C = R(null), L = R(null), x = R(null), [ae, H] = T(!!v.current), _ = R(0), [V, M] = T(N.current.query), D = R(V);
  D.current = V;
  const [P, Y] = T(0), W = R(N.current.startAtEnd), [oe, Q] = T([]), [S, ce] = T(null), A = R(null), [X, ue] = T(null), [pe, G] = T(0), ye = Ne(() => {
    var re;
    if (!S) return null;
    const m = oe.findIndex((ee) => ee.key === S.key), k = ((re = A.current) == null ? void 0 : re.key) === S.key ? A.current : null;
    return (m >= 0 ? oe.slice(m + 1) : k ? oe.filter((ee) => !k.before.includes(ee.key)) : []).find((ee) => ee.media.id !== S.media.id) ?? null;
  }, [S, oe]), [Ce, Se] = T(0), [ve, Je] = T(!1), [he, ot] = T(!1), Xe = R(!1), Rt = R(0), Wt = R(!1), Pt = R(null), nt = R(!0), Ge = R(null);
  Z(() => (nt.current = !0, () => {
    nt.current = !1;
  }), []);
  const [Ve, He] = T(v.current), [or, Qe] = T(""), [ze, ft] = T(null), [Oe, Ze] = T(!1), [qn, Lt] = T([]), Sn = R([]), Yt = R(null), Et = R(null), wt = R(null);
  Z(() => {
    var m, k;
    Oe && ((k = (m = wt.current) == null ? void 0 : m.querySelector("input")) == null || k.focus());
  }, [Oe]);
  const [kn, pn] = T(!1), [me, vt] = T(!1), on = Ea(), [hn, sr] = T(!1), Ue = d ?? hn, Nt = f ?? sr;
  Z(() => {
    if (ve || kn || !Et.current) return;
    const m = requestAnimationFrame(() => {
      if (document.querySelector(ws)) return;
      const k = Et.current;
      Et.current = null;
      const K = document.activeElement;
      K && K !== document.body || k != null && k.isConnected && !k.disabled && k.focus();
    });
    return () => cancelAnimationFrame(m);
  }, [ve, kn, P]);
  const [le, U] = T([]), [xe, $t] = T({}), mn = R(null), [se, pt] = T({});
  Z(() => {
    let m = !0;
    return Promise.all(
      ko(V.objectFilter).map(
        async (k) => [
          String(k),
          (await we(`/api/tags/${k}`)).name
        ]
      )
    ).then((k) => {
      m && pt(Object.fromEntries(k));
    }).catch(() => {
    }), () => {
      m = !1;
    };
  }, [V.objectFilter]);
  const En = Ne(
    () => Eo(V.objectFilter, se),
    [se, V.objectFilter]
  ), At = R(0), Dt = R(e);
  Dt.current = e;
  const qt = w ?? e, $e = Ne(
    () => vn(qt, V),
    [qt, V]
  ), rt = Ne(
    () => ys($e, V.performerFocus),
    [$e, V.performerFocus]
  ), Ln = R(rt);
  Ln.current = rt;
  const _t = R($e);
  _t.current = $e;
  const [jt, Dn] = T("items"), [gt, Or] = T(null), Ut = R(null), I = R("");
  function j(m) {
    const k = typeof m == "function" ? m(Ut.current) : m;
    Ut.current = k, Or(k);
  }
  const [J, qe] = T(!1), [ke, Pe] = T(null), de = R(null), Le = Re($e) ? Ga($e) : "", [_n, Te] = T(0), [ge, Ct] = T(null);
  Z(() => () => {
    var m;
    return (m = de.current) == null ? void 0 : m.controller.abort();
  }, []), Z(() => {
    const m = de.current;
    !m || m.signature === Le || (m.controller.abort(), de.current = null, qe(!1));
  }, [Le]), Z(() => {
    var K;
    const m = Ut.current;
    if (jt !== "performers" || !Le || ((K = de.current) == null ? void 0 : K.signature) === Le || I.current === Le || (m == null ? void 0 : m.signature) === Le && m.complete)
      return;
    const k = (m == null ? void 0 : m.signature) === Le ? m : null;
    Cn(m, (k == null ? void 0 : k.limit) ?? ki);
  }, [jt, Le, gt, ke, J]);
  const De = V.performerFocus;
  Z(() => {
    if (!De) {
      Ct(null);
      return;
    }
    let m = !0;
    return we(`/api/performers/${De}`).then((k) => {
      const K = rl(De, k.tags);
      m && Ct({ id: De, name: k.name, tags: K });
    }).catch(() => {
    }), () => {
      m = !1;
    };
  }, [De]);
  const cr = JSON.stringify(
    Re($e) ? Ks($e.occurrence) : []
  ), ht = Ne(() => JSON.parse(cr), [cr]), Xr = Ne(() => Zd(ht), [ht]), Zr = lc(Xr), ea = ka(Xr), Tt = (m) => {
    var k;
    return ((k = ea[m]) == null ? void 0 : k.name) ?? (ea[m] === null ? "Unavailable tag" : "…");
  }, Xt = (m) => ({
    name: Tt(m),
    tagIds: Zr.get(m) ?? [m],
    resolved: Zr.has(m)
  }), jn = Zc(
    Re($e) ? $e : null,
    De ?? null,
    _n
  ), gn = bs(e, V), Mr = bs(e, Ua(e, V)), Be = he || ve || Oe, at = Number(V.filter.page);
  function We(m, k = !1) {
    Xe.current || (Rt.current++, v.current = "", W.current = k, D.current = m, M(m), Se(0), Je(!0), k || fa(e.id, m), Y((K) => K + 1));
  }
  function st() {
    if (Xe.current = !1, ot(!1), nt.current && Ge.current) {
      const m = Ge.current;
      Ge.current = null, We(m.query, m.startAtEnd);
    }
  }
  Z(() => {
    const m = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const k = Hi(
            Dt.current,
            new URLSearchParams(window.location.search)
          );
          Xe.current ? Ge.current = k : We(k.query, k.startAtEnd);
        } catch (k) {
          He(Jt(k));
        }
    };
    return window.addEventListener("popstate", m), () => window.removeEventListener("popstate", m);
  }, [e.id]), Z(() => (r(he || ve || Oe || !!w), () => r(!1)), [he, ve, Oe, !!w, r]);
  async function Bt(m, k, K) {
    if (Re(m)) {
      const ee = await zc(
        m,
        mn.current,
        k,
        K
      );
      return {
        items: ee.items.map((fe) => ({
          key: fe.key,
          media: fe.media,
          occurrence: fe
        })),
        totalCount: ee.totalCount
      };
    }
    const re = await Kr(
      m,
      { ...m.view.filter, page: k },
      K
    );
    return {
      items: re.items.map((ee) => ({ key: String(ee.id), media: ee })),
      totalCount: re.totalCount
    };
  }
  function Ot(m, k, K, re = !1, ee = !1) {
    if (!nt.current || Ge.current) return;
    H(!0), Q(
      ee ? m.items : Si(m.items, D.current.startFrom === "end")
    ), Se(m.totalCount), Un(K, re);
    const fe = {
      ...D.current,
      filter: { ...D.current.filter, page: k }
    };
    D.current = fe, M(fe), fa(e.id, fe);
  }
  function Un(m, k = !1) {
    Rt.current++, (m == null ? void 0 : m.key) !== (S == null ? void 0 : S.key) && (A.current = null), (m == null ? void 0 : m.media.id) !== (S == null ? void 0 : S.media.id) && ue(k && m ? m.media.id : null), ce(m);
  }
  Z(() => {
    if (v.current) return;
    const m = new AbortController();
    x.current = m;
    const k = ++At.current;
    return Je(!0), He(""), Qe(""), A.current = null, ue(null), ce(null), Q([]), Ze(!1), (async () => {
      const K = ys(
        vn(Dt.current, D.current),
        D.current.performerFocus
      );
      mn.current = Re(K) ? await Ao(K, m.signal) : null;
      let re = Number(K.view.filter.page), ee = await Bt(K, re, m.signal);
      const fe = Math.max(
        1,
        Math.ceil(ee.totalCount / Number(K.view.filter.perPage))
      );
      (W.current || re > fe) && (re = fe, ee = await Bt(K, re, m.signal)), W.current = !1;
      const et = K.view.startFrom === "end" ? -1 : 1;
      for (; Re(K) && !ee.items.length && re + et >= 1 && re + et <= fe && !m.signal.aborted; )
        re += et, ee = await Bt(K, re, m.signal);
      if (k !== At.current || m.signal.aborted) return;
      const ct = Si(ee.items, K.view.startFrom === "end");
      Ot(ee, re, ct[0] ?? null);
    })().catch((K) => {
      !m.signal.aborted && k === At.current && He(Jt(K));
    }).finally(() => {
      !m.signal.aborted && k === At.current && (H(!0), Je(!1));
    }), () => {
      m.abort(), At.current++;
    };
  }, [P, e.id]);
  const Bn = R(null);
  Z(() => {
    if ((S == null ? void 0 : S.key) !== Bn.current && ft(null), Bn.current = (S == null ? void 0 : S.key) ?? null, !S) return;
    let m = !0;
    return fn(l, S).then((k) => {
      m && (ft(k), U(
        Re(e) ? k.ids.filter((K) => e.occurrence.tagIds.includes(K)) : []
      ));
    }).catch((k) => {
      m && He(`Could not load current tags. ${Jt(k)}`);
    }), () => {
      m = !1;
    };
  }, [S]), Z(() => {
    if (!Re(e) || e.actions.length)
      return;
    let m = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (k) => [
          k,
          (await we(`/api/tags/${k}`)).name
        ]
      )
    ).then((k) => {
      m && $t(Object.fromEntries(k));
    }).catch((k) => {
      m && He(Jt(k));
    }), () => {
      m = !1;
    };
  }, [e]);
  function sn(m, k = A.current) {
    const K = oe.findIndex((mt) => mt.key === m.key), re = V.startFrom === "end" ? -1 : 1, ee = (k == null ? void 0 : k.key) === m.key, fe = ee ? k : { key: m.key, page: at, before: oe.slice(0, K + 1).map((mt) => mt.key), after: oe.slice(K + 1).map((mt) => mt.key) }, et = new Set(fe.after), ct = new Set(fe.before), Jn = oe.find((mt) => et.has(mt.key) || (re === 1 || at < fe.page) && ee && !ct.has(mt.key));
    return { direction: re, cursor: fe, remainingKeys: et, visitedKeys: ct, nextLoaded: Jn };
  }
  async function Zt(m = !1, k = !1, K = !1, re = () => !0, ee = A.current) {
    if (!S) return;
    const { direction: fe, cursor: et, remainingKeys: ct, visitedKeys: Jn, nextLoaded: mt } = sn(S, ee);
    if (!m && mt) {
      Un(mt, K);
      return;
    }
    const $n = m ? Jn : new Set(oe.map((Ye) => Ye.key));
    let Ae = fe === -1 && !m ? Math.max(1, at - 1) : at;
    for (; nt.current && !Ge.current; ) {
      let Ye = await Bt(rt, Ae);
      const dn = Math.max(
        1,
        Math.ceil(Ye.totalCount / Number(V.filter.perPage))
      );
      Ae > dn && (Ae = dn, Ye = await Bt(rt, Ae));
      const gr = Si(Ye.items, fe === -1), br = new Map(gr.map((Ft) => [Ft.key, Ft])), yr = m ? et.after.flatMap((Ft) => {
        const Oa = br.get(Ft);
        return Oa ? [Oa] : [];
      }) : [], $a = new Set(yr.map((Ft) => Ft.key)), wr = m ? {
        ...Ye,
        items: [
          ...yr,
          ...gr.filter(
            (Ft) => Ft.key !== S.key && !$a.has(Ft.key)
          )
        ]
      } : { ...Ye, items: gr };
      if (!re()) return;
      if (k) {
        A.current = et, Ot(wr, Ae, S, !1, !0);
        return;
      }
      const vr = fe === -1 && at === 1 && !m ? void 0 : wr.items.find(
        (Ft) => !$n.has(Ft.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(m && fe === -1 && Ae === et.page) || ct.has(Ft.key))
      );
      if (vr || (fe === -1 ? Ae <= 1 : Ae >= dn)) {
        Ot(
          wr,
          Ae,
          vr ?? null,
          K,
          !0
        ), vr || Qe(
          Ye.totalCount ? `Reached the end in this direction. Matching items remain available from the ${h.queue} pages.` : `No matching ${h.many}.`
        );
        return;
      }
      Ae += fe;
    }
  }
  async function Kt(m, k = !1, K = !1, re = !1) {
    if (Wt.current && m && S && !K && !re && !w && !Oe) {
      Pt.current = { action: m, stay: k, key: S.key };
      return;
    }
    if (w || !S || Xe.current || ve || Oe && !K)
      return;
    const ee = K || re || !!(m != null && m.steps.length);
    if (ee && (!t || !ze) || m && tr(m) && !n) return;
    const fe = !k && !K && !re && ee && m !== void 0 && ze !== null && Ho(e) && xi(Fi(e.actions, Yd(m, ze, en))).length > 0;
    Xe.current = !0, ot(!0), He(""), Qe(""), Wt.current = !0;
    const et = A.current, ct = ee && !k && !fe ? sn(S).nextLoaded ?? null : null;
    ct && (Q(
      (Ae) => Ae.filter((Ye) => Ye.key !== S.key)
    ), Un(ct, !0));
    let Jn = !1, mt = !1, $n = [];
    try {
      if (ee) {
        const Ae = await fn(l, S);
        if (m)
          await Sf(rt, S, m);
        else {
          const dn = re && Re(e) ? e.occurrence.tagIds.filter((yr) => Ae.ids.includes(yr)) : Sn.current, br = Hr(dn, re ? le : qn);
          await Io(rt, S, br);
        }
        const Ye = await fn(l, S);
        ct || ft(Ye), mt = !0, Ze(!1), fe && ($n = xi(Fi(e.actions, Ye))), Qe(
          $n.length ? `Tags saved. Staying until answered: ${$n.map((dn) => dn.name).join(", ")}.` : "Tags saved."
        ), S.occurrence && (Pr(S.occurrence.performer.id), Te((dn) => dn + 1));
      }
      if (!nt.current || Ge.current) return;
      if (ee)
        if (ct) {
          const Ae = Rt.current;
          Jn = !0, Wt.current = !1, st(), Zt(!0, !1, !0, () => Rt.current === Ae && !Xe.current, et).catch((Ye) => {
            Rt.current === Ae && He(`Tags saved, but the queue could not refresh. Retry navigation with Skip. ${Jt(Ye)}`);
          });
        } else $n.length || await Zt(!0, k, !k);
      else k || await Zt();
      k && K && requestAnimationFrame(() => {
        var Ae;
        return (Ae = Yt.current) == null ? void 0 : Ae.focus();
      });
    } catch (Ae) {
      if (He(
        mt ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${Jt(Ae)}` : ee ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${Jt(Ae)}` : `Could not advance. ${Jt(Ae)}`
      ), ee && !mt) {
        ct && (Q(oe), ue(null), G((Ye) => Ye + 1), ce(S), A.current = et);
        try {
          ft(await fn(l, S));
        } catch {
          ft(null), He(
            (Ye) => `${Ye} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      Jn || (Wt.current = !1, st());
    }
  }
  Z(() => {
    const m = Pt.current;
    if (!(!m || he || Xe.current)) {
      if ((S == null ? void 0 : S.key) !== m.key || Ve) {
        Pt.current = null;
        return;
      }
      ze && (Pt.current = null, Kt(m.action, m.stay));
    }
  }, [he, ze, S, Ve]);
  const Fr = !Oe && !w && !kn && !me && (S != null || ve || he);
  mo({
    surface: "local",
    enabled: Fr,
    actions: e.actions,
    onAction: (m, k) => {
      const K = e.actions[m];
      K && Kt(K, k);
    },
    onFind: () => vt(!0)
  });
  const ta = (m) => he || ve || !ze || !!w || !t && m.steps.length > 0 || !n && tr(m);
  function Ie() {
    !i || w || Xe.current || Oe || (L.current = document.activeElement, C.current = {
      error: Ve,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(D.current),
      items: oe,
      current: S,
      total: Ce,
      targets: mn.current,
      stayedCursor: A.current
    }, Rt.current++, E(structuredClone(e)), F(""), Qe(""), He(""));
  }
  Z(() => {
    if (!o) {
      _.current = 0;
      return;
    }
    o !== _.current && ae && !ve && (_.current = o, Ie(), s == null || s());
  }, [o, ve, ae]);
  function lr() {
    E(null), F(""), requestAnimationFrame(() => {
      const m = L.current;
      m != null && m.isConnected && m !== document.body && m.focus();
    });
  }
  function An() {
    var k;
    const m = C.current;
    !m || he || ((k = x.current) == null || k.abort(), At.current++, D.current = m.query, M(m.query), Q(m.items), ce(m.current), Se(m.total), mn.current = m.targets, A.current = m.stayedCursor, Je(!1), He(m.error), Qe(""), window.history.replaceState(window.history.state, "", m.url), lr());
  }
  async function Aa() {
    if (!w || !i || Xe.current) return;
    const m = vn(
      { ...w, name: w.name.trim() },
      Ua(Dt.current, D.current)
    ), k = ga(m);
    if (k) {
      F(k);
      return;
    }
    Xe.current = !0, ot(!0), F("");
    try {
      if (await i(m) === !1) throw new Error("Could not save review.");
      lr(), Qe("Review saved.");
    } catch (K) {
      F(
        "Could not save review. Your edits are still open. " + Jt(K)
      );
    } finally {
      st();
    }
  }
  async function Kn() {
    if (!i || Xe.current) return;
    const m = Ua(Dt.current, D.current), k = vn(Dt.current, {
      ...m,
      filter: { ...m.filter, page: 1 }
    });
    Xe.current = !0, ot(!0), He("");
    try {
      if (await i(k) === !1) throw new Error("Could not save review.");
      Qe("Queue saved to this review.");
    } catch (K) {
      He("Could not save queue. " + Jt(K));
    } finally {
      st();
    }
  }
  const It = V.performerScope, xr = (m) => {
    const { performerFocus: k, ...K } = D.current, re = k && !("targetMode" in m || "performerIds" in m || "performerFilter" in m);
    We(
      {
        ...K,
        ...re ? { performerFocus: k } : {},
        filter: { ...K.filter, page: 1 },
        performerScope: { ...It, ...m }
      },
      K.startFrom === "end"
    );
  };
  async function Cn(m, k) {
    var ee;
    const K = _t.current;
    if (!Re(K)) return;
    (ee = de.current) == null || ee.controller.abort();
    const re = {
      signature: Ga(K),
      controller: new AbortController()
    };
    de.current = re, I.current = "", qe(!0), Pe(null);
    try {
      const fe = await Yf(K, m, k, re.controller.signal, {
        onProgress: (et) => {
          de.current === re && j(et);
        }
      });
      de.current === re && j(fe);
    } catch (fe) {
      de.current === re && !re.controller.signal.aborted && (I.current = re.signature, Pe({ signature: re.signature, message: Jt(fe) }));
    } finally {
      de.current === re && (de.current = null, qe(!1));
    }
  }
  function Gt() {
    var m;
    (m = de.current) == null || m.controller.abort(), de.current = null, qe(!1), j((k) => k && { ...k, partial: !0, complete: !1 });
  }
  async function Pr(m) {
    var re;
    const k = _t.current;
    if (!Re(k)) return;
    if (de.current) {
      Gt();
      return;
    }
    const K = Ga(k);
    if (!(((re = Ut.current) == null ? void 0 : re.signature) !== K || Ut.current.partial))
      try {
        const ee = await tl(k, m);
        if (de.current) {
          Gt();
          return;
        }
        j(
          (fe) => (fe == null ? void 0 : fe.signature) === K ? Xf(fe, m, ee) : fe
        );
      } catch {
        j(
          (ee) => (ee == null ? void 0 : ee.signature) === K ? { ...ee, partial: !0, complete: !1 } : ee
        );
      }
  }
  const cn = V.performerFocus ? gt == null ? void 0 : gt.candidates.find((m) => m.id === V.performerFocus) : void 0, Ee = ge && ge.id === V.performerFocus ? { ...ge, flags: Sr(ht, ge.tags) } : cn ? { ...cn, flags: Sr(ht, cn.tags) } : null, na = (m) => {
    if ((ge == null ? void 0 : ge.id) === m)
      return Sr(ht, ge.tags);
    const k = gt == null ? void 0 : gt.candidates.find((K) => K.id === m);
    return k ? Sr(ht, k.tags) : void 0;
  }, bn = ((Ra = S == null ? void 0 : S.occurrence) == null ? void 0 : Ra.performer.id) ?? null, dr = bn === null ? void 0 : na(bn), ur = ep(
    ht.length > 0 && bn !== null && bn !== V.performerFocus && dr === void 0 ? bn : null
  ), Lr = dr ?? (ur ? Sr(ht, ur) : []), en = cc(qt.actions), Ca = jn.summary && V.performerFocus ? po(Ro(jn.summary, qt.actions, en)) : [], Gn = Qo(ht, (Ee == null ? void 0 : Ee.flags) ?? [], Xt), ra = pc(
    Qo(ht, Lr, Xt),
    bn !== null && bn === V.performerFocus ? Ca : []
  ), fr = JSON.stringify(ra), Tn = Ne(() => ra, [fr]), oi = JSON.stringify(Gn), aa = Ne(() => Gn, [oi]), ia = (m) => ou(ht, m, Tt);
  function si(m) {
    if (Xe.current) return;
    const k = {
      ...D.current,
      performerFocus: m,
      filter: { ...D.current.filter, page: 1 }
    };
    We(k, k.startFrom === "end"), Dn("items");
  }
  function ci() {
    const { performerFocus: m, ...k } = D.current;
    We(
      { ...k, filter: { ...k.filter, page: 1 } },
      k.startFrom === "end"
    );
  }
  const Vn = R(null);
  Vn.current ?? (Vn.current = Sc());
  const Ta = Vn.current, ln = Ne(
    () => qt.actions.flatMap((m) => m.steps.flatMap((k) => k.tagIds)),
    [qt.actions]
  ), pr = R(null);
  Z(() => {
    const m = pr.current, k = m == null ? void 0 : m.querySelector('[aria-current="true"]');
    if (!m || !k) return;
    const K = m.getBoundingClientRect(), re = k.getBoundingClientRect();
    re.top < K.top ? m.scrollTop -= K.top - re.top : re.bottom > K.bottom && (m.scrollTop += re.bottom - K.bottom);
  }, [S == null ? void 0 : S.key, jt]);
  const zn = R(null), yn = R(null);
  Z(() => {
    var K, re;
    const m = yn.current;
    if (!m) return;
    yn.current = null;
    const k = [...((K = zn.current) == null ? void 0 : K.querySelectorAll(".dq-partner")) ?? []];
    (re = k.find((ee) => ee.dataset.partnerKey === m) ?? k[0]) == null || re.focus();
  }, [S == null ? void 0 : S.key]);
  const In = he || ve || Oe || !!w, Mt = Ne(
    () => w ? vn(w, Ua(e, V)) : null,
    [w, e, V]
  ), hr = Ne(
    () => Mt != null && zr(Cr(Mt)) !== zr(Cr(e)),
    [Mt, e]
  );
  function Dr() {
    S ? fn(l, S).then(ft).catch((m) => He(Jt(m))) : We(D.current);
  }
  const _r = Ve ? /* @__PURE__ */ u("p", { role: "alert", children: [
    Ve,
    " ",
    /* @__PURE__ */ a("button", { type: "button", disabled: he, onClick: Dr, children: S ? "Reload tags" : "Retry queue" })
  ] }) : null, Ia = he || ve || S != null && !ze, li = Math.max(1, Number(V.filter.perPage) || 1), oa = R(1);
  ve || (oa.current = Math.max(1, Math.ceil(Ce / li)));
  const jr = oa.current, mr = It && S ? oe.filter(
    (m) => m.media.id === S.media.id && m.key !== S.key
  ) : [], Rn = (m) => {
    var k;
    return m.title || ((k = m.files[0]) == null ? void 0 : k.basename) || `${l === "audio" ? "Audio" : "Video"} ${m.id}`;
  }, Me = S ? fp(S.media, l) : "";
  return /* @__PURE__ */ u(
    "section",
    {
      className: `dq-review-workspace${l === "audio" ? " dq-audio" : ""}`,
      "aria-label": It ? l === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : l === "audio" ? "Audio review" : "Video review",
      onClickCapture: (m) => {
        var re;
        const k = m.target instanceof Element ? m.target.closest("button") : null, K = (k == null ? void 0 : k.getAttribute("aria-label")) ?? ((re = k == null ? void 0 : k.textContent) == null ? void 0 : re.trim()) ?? "";
        k && !k.closest(ws) && /^(Filters|Edit filter:|Edit criteria)/.test(K) && (Et.current = k);
      },
      children: [
        /* @__PURE__ */ a(
          jc,
          {
            name: e.name,
            description: e.description,
            entityType: _e(e),
            onBack: c == null ? void 0 : c.onBack,
            backDisabled: In || !!(c != null && c.busy),
            onEdit: w ? () => {
              var m;
              return (m = B.current) == null ? void 0 : m.focus();
            } : Ie,
            editDisabled: !w && (In || !i || !!(c != null && c.busy)),
            editing: !!w,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: he || Oe, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: l === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ a(
                  pa,
                  {
                    filter: V.filter,
                    objectFilter: En,
                    criteriaDefinitions: l === "audio" ? Rs : Xa,
                    customFieldEntityType: l,
                    supportsFilterExpressions: !0,
                    totalCount: Ce,
                    sortOptions: l === "audio" ? _l : $s,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(
                      Uc,
                      {
                        page: Math.min(Math.max(1, at || 1), jr),
                        pages: jr,
                        onPage: (m) => We({
                          ...D.current,
                          filter: Ht(
                            { ...D.current.filter, page: m },
                            l
                          )
                        })
                      }
                    ),
                    onFilterChange: (m) => {
                      (m.sort !== D.current.filter.sort || m.direction !== D.current.filter.direction) && (m = { ...m, sorts: void 0 }), We(
                        {
                          ...D.current,
                          filter: Ht(m, l)
                        },
                        D.current.startFrom === "end"
                      );
                    },
                    onObjectFilterChange: (m) => {
                      We(
                        {
                          ...D.current,
                          objectFilter: Kc(
                            m,
                            se,
                            D.current.objectFilter
                          ),
                          filter: { ...D.current.filter, page: 1 }
                        },
                        D.current.startFrom === "end"
                      );
                    }
                  }
                )
              ] })
            ),
            trailing: /* @__PURE__ */ u(be, { children: [
              It && /* @__PURE__ */ a(
                Hf,
                {
                  scope: It,
                  disabled: he || Oe,
                  editing: !!w,
                  onChange: xr,
                  onEditCriteria: () => pn(!0)
                }
              ),
              (c == null ? void 0 : c.onGrid) && /* @__PURE__ */ a(
                Bc,
                {
                  mode: "single",
                  disabled: In || !!c.busy,
                  onChange: () => {
                    var m;
                    return (m = c.onGrid) == null ? void 0 : m.call(c);
                  }
                }
              )
            ] }),
            trailingEnd: /* @__PURE__ */ u(be, { children: [
              Re(rt) && t && /* @__PURE__ */ a(
                _f,
                {
                  review: rt,
                  disabled: Be || !!w,
                  performerAttention: V.performerFocus ? aa : void 0,
                  trees: en,
                  onOpen: () => {
                    Xe.current = !0, ot(!0);
                  },
                  onClose: (m) => {
                    if (m) {
                      const k = D.current.performerFocus;
                      k ? Pr(k) : Gt(), Te((K) => K + 1), st(), v.current || Je(!0), Y((K) => K + 1);
                    } else st();
                  }
                }
              ),
              (c == null ? void 0 : c.moreItems) && /* @__PURE__ */ a(
                No,
                {
                  disabled: In,
                  items: c.moreItems({
                    onSelect: Ie,
                    disabled: !i
                  })
                }
              )
            ] }),
            chipsStart: V.performerFocus ? /* @__PURE__ */ u("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ a(
                Vr,
                {
                  performer: {
                    id: V.performerFocus,
                    name: (Ee == null ? void 0 : Ee.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ u("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ a("strong", { children: (Ee == null ? void 0 : Ee.name) ?? `performer ${V.performerFocus}` })
              ] }),
              Ee != null && Ee.flags.length ? /* @__PURE__ */ u("span", { className: "dq-focus-flag", title: ia(Ee.flags), children: [
                /* @__PURE__ */ a(Fn, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ia(Ee.flags) })
              ] }) : null,
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: Be,
                  onClick: ci,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            queueDiffers: gn,
            queueChange: !w && gn ? {
              // Tag bins alone leave nothing to save: a review never keeps them.
              onSave: Mr ? () => void Kn() : void 0,
              saveDisabled: Be || !i,
              onReset: () => {
                const m = Ir(e);
                We(m, m.startFrom === "end");
              },
              resetDisabled: Be
            } : void 0,
            chipsEnd: w ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
          }
        ),
        c == null ? void 0 : c.notices,
        /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
          w && Mt && /* @__PURE__ */ a(
            _c,
            {
              drawerRef: B,
              draft: Mt,
              onChange: (m) => E(m),
              direction: V.startFrom,
              onDirectionChange: (m) => We({ ...D.current, startFrom: m }),
              tagGroups: up,
              trees: en,
              saving: he,
              saveDisabled: ve,
              error: O,
              dirty: hr,
              criteriaChanged: Mr,
              notices: _r && /* @__PURE__ */ a("div", { className: "dq-review-feedback", children: _r }),
              onSave: () => void Aa(),
              onCancel: An
            }
          ),
          /* @__PURE__ */ a("div", { className: "dq-review-main", children: /* @__PURE__ */ u("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ u("div", { className: "dq-review-stage", children: [
              S ? /* @__PURE__ */ u(be, { children: [
                /* @__PURE__ */ u("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ a("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ u(
                    "a",
                    {
                      href: `/${l}/${S.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${h.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ a("span", { children: Rn(S.media) }),
                        /* @__PURE__ */ a(Us, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  Me && /* @__PURE__ */ a("span", { className: "dq-stage-meta", children: Me })
                ] }),
                /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ a("div", { className: "dq-player-frame", children: [S, ye].filter(Boolean).map((m) => {
                    var re, ee, fe, et, ct;
                    const k = m, K = k.key === S.key;
                    return /* @__PURE__ */ a(
                      "div",
                      {
                        className: K ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": K ? void 0 : !0,
                        inert: K ? void 0 : !0,
                        children: l === "audio" ? /* @__PURE__ */ a(
                          jl,
                          {
                            streamUrl: Oi("audio", k.media.id),
                            format: ((re = k.media.files[0]) == null ? void 0 : re.format) ?? "",
                            title: g(k.media),
                            coverUrl: K ? $i("audio", k.media) : void 0,
                            duration: ((ee = k.media.files[0]) == null ? void 0 : ee.duration) ?? 0,
                            autostart: K && X === k.media.id
                          }
                        ) : /* @__PURE__ */ a(
                          Os,
                          {
                            videoId: k.media.id,
                            streamUrl: Oi("video", k.media.id),
                            posterUrl: K ? $i("video", k.media) : void 0,
                            duration: ((fe = k.media.files[0]) == null ? void 0 : fe.duration) ?? 0,
                            format: (et = k.media.files[0]) == null ? void 0 : et.format,
                            audioCodec: (ct = k.media.files[0]) == null ? void 0 : ct.audioCodec,
                            extensionSurface: K ? "quick-view" : void 0,
                            autostart: K && X === k.media.id,
                            keyboardShortcutsEnabled: K,
                            showAbLoop: K,
                            clip: k.media.parentVideoId != null ? {
                              start: k.media.clipStartSec ?? 0,
                              end: k.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${k.media.id}:${pe}`
                    );
                  }) }),
                  l === "audio" && /* @__PURE__ */ a(
                    Uf,
                    {
                      details: S.media.details,
                      label: h.one
                    },
                    S.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ a("p", { role: "status", className: "dq-stage-status", children: ve ? "Loading review…" : Ce ? "Reached the end in this direction." : `No matching ${h.many}.` }),
              qt.actions.length > 0 ? /* @__PURE__ */ a(
                vu,
                {
                  actions: qt.actions,
                  isDisabled: (m) => Oe || ta(m),
                  busy: Ia,
                  tags: ze,
                  trees: en,
                  preview: Ta,
                  onApply: (m, k) => void Kt(m, k),
                  onFind: () => vt(!0),
                  findDisabled: Oe || !!w,
                  paused: !!w,
                  waitForGroups: Ho(qt),
                  attention: Tn,
                  stayOnTap: Ue,
                  onStayOnTapChange: Nt
                }
              ) : Re(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || he || Oe || !ze || !!w || !S,
                  children: [
                    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((m) => /* @__PURE__ */ u("label", { children: [
                      /* @__PURE__ */ a(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: le.includes(m),
                          onChange: (k) => U(
                            e.occurrence.multiple ? k.target.checked ? [...le, m] : le.filter((K) => K !== m) : [m]
                          )
                        }
                      ),
                      xe[m] ?? "Loading tag…"
                    ] }, m)),
                    /* @__PURE__ */ u("div", { className: "dq-row", children: [
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => U([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void Kt(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void Kt(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ u("div", { className: "dq-panel-body", ref: zn, children: [
                S && /* @__PURE__ */ u(be, { children: [
                  /* @__PURE__ */ u("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ u("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: S.occurrence ? S.occurrence.performer.name : `this ${h.one}` })
                    ] }),
                    /* @__PURE__ */ u("div", { className: "dq-reviewing-who", children: [
                      S.occurrence && /* @__PURE__ */ a(Vr, { performer: S.occurrence.performer }),
                      /* @__PURE__ */ u("div", { children: [
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: S.occurrence ? S.occurrence.performer.name : `This ${h.one}` }),
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-note", children: It ? `Tags apply to this performer in this ${h.queue}` : `Tags apply to the whole ${h.one}` })
                      ] })
                    ] }),
                    Tn.length > 0 && /* @__PURE__ */ a(mp, { entries: Tn })
                  ] }),
                  mr.length > 0 && /* @__PURE__ */ u(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${h.queue}`,
                      children: [
                        /* @__PURE__ */ u("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          h.queue
                        ] }),
                        /* @__PURE__ */ a("div", { className: "dq-partners", children: mr.map((m) => {
                          var k, K, re;
                          return /* @__PURE__ */ u(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (k = m.occurrence) == null ? void 0 : k.performer.name,
                              "aria-label": (K = m.occurrence) == null ? void 0 : K.performer.name,
                              "data-partner-key": m.key,
                              disabled: Be,
                              onClick: () => {
                                yn.current = S.key, Un(m), He("");
                              },
                              children: [
                                m.occurrence && /* @__PURE__ */ a(Vr, { performer: m.occurrence.performer }),
                                /* @__PURE__ */ a("span", { children: (re = m.occurrence) == null ? void 0 : re.performer.name })
                              ]
                            },
                            m.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ a(
                    hp,
                    {
                      tags: ze,
                      preview: Ta,
                      trees: en,
                      actionTagIds: ln,
                      label: `Current ${It ? "occurrence" : h.one} tags`,
                      tagsChangedSinceEditing: Oe && !he && (!ze || ze.ids.length !== Sn.current.length || ze.ids.some((m) => !Sn.current.includes(m))),
                      editor: Oe && /* @__PURE__ */ u(
                        "fieldset",
                        {
                          ref: wt,
                          disabled: he,
                          className: "dq-panel-section dq-tag-editor",
                          children: [
                            /* @__PURE__ */ u("legend", { className: "dq-eyebrow", children: [
                              "Edit ",
                              It ? "occurrence" : h.one,
                              " tags"
                            ] }),
                            /* @__PURE__ */ a(
                              nr,
                              {
                                entityType: "tag",
                                values: qn,
                                onChange: Lt,
                                placeholder: "Choose tags for this item...",
                                allowCreate: !1
                              }
                            ),
                            /* @__PURE__ */ u("div", { className: "dq-row", children: [
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button primary",
                                  disabled: !ze,
                                  onClick: () => void Kt(void 0, !0, !0),
                                  children: "Save"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  disabled: !ze,
                                  onClick: () => void Kt(void 0, !1, !0),
                                  children: "Save & next"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  onClick: () => {
                                    Ze(!1), requestAnimationFrame(() => {
                                      var m;
                                      return (m = Yt.current) == null ? void 0 : m.focus();
                                    });
                                  },
                                  children: "Cancel"
                                }
                              )
                            ] })
                          ]
                        }
                      )
                    }
                  )
                ] }),
                Re($e) && V.performerFocus && /* @__PURE__ */ a(
                  Gi,
                  {
                    ...jn,
                    mediaKind: l,
                    actions: qt.actions,
                    trees: en,
                    flags: aa
                  }
                )
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !w && _r,
                  or && /* @__PURE__ */ a("p", { role: "status", children: or })
                ] }),
                !t && /* @__PURE__ */ a("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                S && /* @__PURE__ */ u("div", { className: "dq-panel-actions", "aria-busy": Ia || void 0, children: [
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      ref: Yt,
                      className: "dq-button",
                      disabled: Be || !!w || !t || !ze,
                      onClick: () => {
                        Rt.current++, Sn.current = [...ze.ids], Lt([...ze.ids]), Ze(!0);
                      },
                      children: [
                        /* @__PURE__ */ a(Ds, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: Be || !!w,
                      onClick: () => void Kt(),
                      children: [
                        /* @__PURE__ */ a(ed, { "aria-hidden": "true" }),
                        "Skip",
                        It ? " performer" : ` ${h.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              It && /* @__PURE__ */ u(
                "div",
                {
                  className: "dq-segmented dq-segmented-fill",
                  role: "group",
                  "aria-label": "Queue view",
                  children: [
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": jt === "items",
                        onClick: () => Dn("items"),
                        children: l === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": jt === "performers",
                        onClick: () => Dn("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              It && jt === "performers" ? /* @__PURE__ */ a(
                Kf,
                {
                  ranking: (gt == null ? void 0 : gt.signature) === Le ? gt : null,
                  busy: J,
                  error: (ke == null ? void 0 : ke.signature) === Le ? ke.message : "",
                  focus: V.performerFocus,
                  disabled: Be,
                  labels: h,
                  flagLabel: ia,
                  onFocus: si,
                  onMore: () => {
                    const m = Ut.current;
                    m && Cn(m, m.limit + ki);
                  },
                  onRefresh: () => {
                    j(null), Cn(null, ki);
                  }
                }
              ) : /* @__PURE__ */ a("div", { className: "dq-queue-list", ref: pr, children: oe.map((m) => {
                var K;
                const k = (S == null ? void 0 : S.key) === m.key;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: y(m),
                    "aria-label": y(m),
                    "aria-current": k ? "true" : void 0,
                    disabled: Be,
                    onClick: () => {
                      Un(m), He(""), Qe("");
                    },
                    children: [
                      /* @__PURE__ */ a(pp, { media: m.media, kind: l }),
                      /* @__PURE__ */ u("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: g(m.media) }),
                        /* @__PURE__ */ u("span", { className: "dq-queue-row-meta", children: [
                          m.occurrence && /* @__PURE__ */ u(be, { children: [
                            /* @__PURE__ */ a(Vr, { performer: m.occurrence.performer }),
                            /* @__PURE__ */ a("span", { className: "dq-queue-row-performer", children: m.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ a("span", { className: "dq-queue-row-detail", children: [
                            m.media.date,
                            m.occurrence ? "" : (K = m.media.files[0]) != null && K.duration ? Ms(m.media.files[0].duration) : ""
                          ].filter(Boolean).join(" · ") })
                        ] })
                      ] })
                    ]
                  },
                  m.key
                );
              }) })
            ] })
          ] }) })
        ] }),
        It && /* @__PURE__ */ a(
          Is,
          {
            open: kn,
            onClose: () => pn(!1),
            criteria: Yi,
            activeFilter: It.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (m) => {
              pn(!1), xr({ performerFilter: m });
            }
          }
        ),
        me && /* @__PURE__ */ a(
          yo,
          {
            actions: e.actions,
            trees: en,
            isDisabled: (m) => ta(m),
            tapStays: on && Ue,
            onApply: (m, k) => {
              vt(!1), Kt(m, k);
            },
            onClose: () => vt(!1)
          }
        )
      ]
    }
  );
}
const ul = "data-quality.reviews-sort.v1", bp = { sort: "name", direction: "asc" };
function yp() {
  try {
    const e = JSON.parse(localStorage.getItem(ul) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return bp;
}
function wp(e) {
  try {
    localStorage.setItem(
      ul,
      JSON.stringify({ sort: e.sort, direction: e.direction })
    );
  } catch {
  }
}
function fl(e, t, n, r) {
  const i = r === "asc" ? 1 : -1;
  return [...e].sort((o, s) => {
    if (n === "count") {
      const c = t[o.id], d = t[s.id], f = typeof c == "number", l = typeof d == "number";
      if (f !== l) return f ? -1 : 1;
      if (f && l && c !== d)
        return (c - d) * i;
    }
    return o.name.localeCompare(s.name, void 0, { numeric: !0, sensitivity: "base" }) * i;
  });
}
function Ei(e, t) {
  const n = _e(e), r = Nn(ro(n)), i = n === "tag" ? "tag" : Re(e) ? r.queue : r.one;
  return t === 1 ? i : `${i}s`;
}
function vp({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ u(be, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      Ei(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ u(be, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Matching ",
      Ei(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ u(be, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      Ei(e, t)
    ] })
  ] });
}
function Np({
  reviews: e,
  counts: t,
  sort: n,
  direction: r,
  onSortChange: i,
  onDirectionChange: o,
  storage: s,
  canConfigure: c,
  busy: d,
  headingRef: f,
  notices: l,
  onOpen: h,
  onNew: p,
  onImport: g,
  onExportAll: y,
  rowMenuItems: N
}) {
  const v = R(null), w = Ne(
    () => fl(e, t, n, r),
    [e, t, n, r]
  ), E = e.every((F) => t[F.id] !== void 0), O = r === "asc" ? "ascending" : "descending";
  return /* @__PURE__ */ u("div", { className: "dq-reviews-page", children: [
    /* @__PURE__ */ u("header", { className: "dq-reviews-header", children: [
      /* @__PURE__ */ a("h1", { ref: f, tabIndex: -1, children: "Data Quality" }),
      /* @__PURE__ */ u("div", { className: "dq-reviews-header-actions", children: [
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            className: "dq-header-button",
            title: "Add the reviews in a review file",
            disabled: !c || d,
            onClick: () => {
              var F;
              return (F = v.current) == null ? void 0 : F.click();
            },
            children: [
              /* @__PURE__ */ a(td, { "aria-hidden": "true" }),
              "Import"
            ]
          }
        ),
        /* @__PURE__ */ a(
          "input",
          {
            ref: v,
            type: "file",
            accept: "application/json,.json",
            hidden: !0,
            tabIndex: -1,
            onChange: (F) => {
              var C;
              const B = (C = F.target.files) == null ? void 0 : C[0];
              F.target.value = "", B && g(B);
            }
          }
        ),
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            className: "dq-header-button",
            title: "Download every review as one review file",
            disabled: !e.length,
            onClick: y,
            children: [
              /* @__PURE__ */ a(Bs, { "aria-hidden": "true" }),
              "Export all"
            ]
          }
        ),
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            className: "dq-header-button dq-header-button-primary",
            disabled: !c || d,
            onClick: p,
            children: [
              /* @__PURE__ */ a(wa, { "aria-hidden": "true" }),
              "New review"
            ]
          }
        )
      ] })
    ] }),
    l,
    e.length ? /* @__PURE__ */ u("section", { className: "dq-reviews", "aria-label": "Reviews", children: [
      /* @__PURE__ */ u("div", { className: "dq-reviews-bar", children: [
        /* @__PURE__ */ u("p", { className: "dq-reviews-summary", children: [
          e.length === 1 ? "1 review" : `${e.length.toLocaleString()} reviews`,
          " ·",
          " ",
          s
        ] }),
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: E ? e.some((F) => t[F.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
        /* @__PURE__ */ u("div", { className: "dq-reviews-sort", children: [
          /* @__PURE__ */ u("label", { children: [
            /* @__PURE__ */ a("span", { children: "Sort by" }),
            /* @__PURE__ */ u(
              "select",
              {
                className: "dq-select",
                value: n,
                onChange: (F) => i(F.target.value),
                children: [
                  /* @__PURE__ */ a("option", { value: "name", children: "Name" }),
                  /* @__PURE__ */ a("option", { value: "count", children: "Matching items" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-reviews-direction",
              "aria-label": `Sort direction: ${O}`,
              title: `Sort direction: ${O}`,
              onClick: () => o(r === "asc" ? "desc" : "asc"),
              children: r === "asc" ? /* @__PURE__ */ a(nd, { "aria-hidden": "true" }) : /* @__PURE__ */ a(rd, { "aria-hidden": "true" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ u("table", { className: "dq-reviews-table", children: [
        /* @__PURE__ */ a("thead", { children: /* @__PURE__ */ u("tr", { children: [
          /* @__PURE__ */ a("th", { scope: "col", "aria-sort": n === "name" ? O : void 0, children: "Review" }),
          /* @__PURE__ */ a("th", { scope: "col", className: "dq-reviews-type", children: "Type" }),
          /* @__PURE__ */ a(
            "th",
            {
              scope: "col",
              className: "dq-reviews-count",
              "aria-sort": n === "count" ? O : void 0,
              children: "Matching"
            }
          ),
          /* @__PURE__ */ a("th", { scope: "col", className: "dq-reviews-actions", children: /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Actions" }) })
        ] }) }),
        /* @__PURE__ */ a("tbody", { children: w.map((F) => {
          const B = _e(F);
          return /* @__PURE__ */ u("tr", { children: [
            /* @__PURE__ */ a("td", { children: /* @__PURE__ */ u(
              "a",
              {
                className: "dq-reviews-link",
                href: `?review=${encodeURIComponent(F.id)}`,
                "data-review-id": F.id,
                onClick: (C) => {
                  C.button !== 0 || C.metaKey || C.ctrlKey || C.shiftKey || C.altKey || (C.preventDefault(), h(F.id));
                },
                children: [
                  /* @__PURE__ */ a("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ a(Pc, { entityType: B }) }),
                  /* @__PURE__ */ u("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ a("span", { className: "dq-reviews-name", children: F.name }),
                    F.description && /* @__PURE__ */ a("span", { className: "dq-reviews-description", title: F.description, children: F.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-type", children: xc[B] }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-count", children: /* @__PURE__ */ a(vp, { review: F, count: t[F.id] }) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ a(No, { label: `Actions for ${F.name}`, items: N(F) }) })
          ] }, F.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ u("div", { className: "dq-empty", children: [
      /* @__PURE__ */ a(ei, { "aria-hidden": "true" }),
      /* @__PURE__ */ a("p", { children: "No reviews yet." }),
      /* @__PURE__ */ a("p", { children: c ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function pl(e, { id: t, name: n, description: r }) {
  const i = { id: t, name: n, description: r }, o = (s, c = {}) => ({
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
function qp({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: r
}) {
  const { review: i, saving: o, error: s } = e, c = R(null), d = R(null), f = R(o);
  f.current = o;
  const l = R(null), h = it();
  Z(() => {
    var y;
    return l.current ?? (l.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), c.current && !c.current.open && c.current.showModal(), (y = d.current) == null || y.focus(), () => {
      var N;
      (N = l.current) != null && N.isConnected && l.current.focus({ preventScroll: !0 });
    };
  }, []);
  const p = R(o);
  Z(() => {
    var v, w;
    const y = document.activeElement, N = !y || y === document.body || !((v = c.current) != null && v.contains(y));
    s && (!i.name.trim() || p.current && !o && N) && ((w = d.current) == null || w.focus()), p.current = o;
  }, [s, o]);
  const g = () => {
    f.current || r();
  };
  return /* @__PURE__ */ a(
    "dialog",
    {
      ref: c,
      className: "dq-form-dialog",
      "aria-labelledby": h,
      "aria-modal": "true",
      onCancel: (y) => {
        y.preventDefault(), g();
      },
      onClose: () => {
        var y;
        f.current ? (y = c.current) == null || y.showModal() : r();
      },
      children: /* @__PURE__ */ u(
        "form",
        {
          onSubmit: (y) => {
            y.preventDefault(), f.current || n();
          },
          children: [
            /* @__PURE__ */ u("header", { className: "dq-form-dialog-header", children: [
              /* @__PURE__ */ a("h2", { id: h, children: "New review" }),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-icon-button",
                  "aria-label": "Close dialog",
                  title: "Close",
                  disabled: o,
                  onClick: g,
                  children: /* @__PURE__ */ a(va, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ a("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              s && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: s }),
              /* @__PURE__ */ u("fieldset", { className: "dq-form-dialog-fields", disabled: o, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ a(
                  Dc,
                  {
                    review: i,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (y) => {
                      y !== _e(i) && t(pl(y, i));
                    },
                    nameRef: d
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ u("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ a("button", { type: "button", className: "dq-text-button", onClick: () => vo(i), children: "Export draft" }),
              /* @__PURE__ */ a("span", { className: "dq-form-dialog-space" }),
              /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: o, onClick: g, children: "Cancel" }),
              /* @__PURE__ */ a("button", { type: "submit", className: "dq-button primary", "aria-disabled": o || void 0, children: o ? "Creating…" : "Create & configure" })
            ] })
          ]
        }
      )
    }
  );
}
const Sp = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function kp(e, t, n, r) {
  return dl(
    {
      ...e,
      view: {
        ...e.view,
        filter: { ...n, page: 1 },
        objectFilter: t.view.objectFilter,
        searchMode: t.view.searchMode
      }
    },
    r
  );
}
function vs(e, t) {
  return _e(t) === "video" && $r(t.view.objectFilter, e.view.objectFilter, $o(t, e)).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function Ns(e, t) {
  return rr(
    JSON.parse(Xn(Cr(e))),
    JSON.parse(Xn(Cr(t)))
  );
}
const Ai = 180;
function qs(e) {
  return _e(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function Ss(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function ks() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Ci(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  ii.forEach((i) => n.delete(i)), e ? n.set("review", e) : n.delete("review");
  const r = n.toString();
  ll(`${window.location.pathname}${r ? `?${r}` : ""}`, { openingFromList: t });
}
function Ep(e) {
  return Ht({ ...e, page: 1 });
}
function hl(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Br(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Ap = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(Zi, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ a(od, { "aria-hidden": "true" }) }
], Cp = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(Zi, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ a(id, { "aria-hidden": "true" }) }
], Es = [], ml = "(min-width: 900px)";
function Tp(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(ml);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function Ip() {
  return typeof window.matchMedia == "function" && window.matchMedia(ml).matches;
}
function Rp({
  onNavigate: e
}) {
  const [t, n] = T([]), [r] = T(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [i, o] = T(""), [s, c] = T(!0), [d, f] = T(""), [l, h] = T(!1), [p, g] = T(!1), [y, N] = T(!1), [v, w] = T(!1), [E, O] = T([]), [F, B] = T(""), [C, L] = T(!0), [x, ae] = T("account"), [H, _] = T(""), [V, M] = T(""), [D, P] = T(!1), [Y, W] = T(!1), [oe, Q] = T(""), [S, ce] = T(ks), A = R(S);
  A.current = S;
  const [X, ue] = T({}), pe = R(X);
  pe.current = X;
  const G = R(t);
  G.current = t;
  const ye = R(s);
  ye.current = s;
  const Ce = R(!1), Se = R(!0);
  Z(() => (Se.current = !0, () => {
    Se.current = !1;
  }), []);
  const [ve, Je] = T(!S);
  ve !== !S && (Je(!S), S || ue({}));
  const [he, ot] = T(yp), { sort: Xe, direction: Rt } = he, Wt = (b) => {
    const q = { ...he, ...b };
    ot(q), wp(q);
  }, Pt = R(null), nt = R(null), [Ge, Ve] = T(null), [He, or] = T(!1), [Qe, ze] = T(!1), [ft, Oe] = T(null), [Ze, qn] = T(null), Lt = !!ft || !!Ze, Sn = R(Lt);
  Sn.current = Lt;
  const Yt = He || !!Ze || Qe, [Et, wt] = T(0), [kn, pn] = T(!1), [me, vt] = T(null), on = R(null), hn = R(null), sr = R(null), [Ue, Nt] = T(
    null
  ), le = t.find((b) => b.id === S) ?? null, U = Ne(
    () => (Ue == null ? void 0 : Ue.id) === S && le ? { ...le, view: {
      ...le.view,
      filter: Ue.view.filter,
      objectFilter: Ue.view.objectFilter,
      searchMode: Ue.view.searchMode,
      startFrom: Ue.view.startFrom
    } } : le,
    [Ue, S, le]
  ), xe = U ? _e(U) : "video", $t = ro(xe), mn = U ? Re(U) : !1, se = xe === "video" ? U : null, pt = mn && !!(U != null && U.actions.some(tr)), En = !!se || xe === "audio" || pt, [At, Dt] = T(null), qt = (At == null ? void 0 : At.id) === (U == null ? void 0 : U.id) ? At == null ? void 0 : At.mode : (U == null ? void 0 : U.view.reviewMode) ?? "single", $e = mn || xe === "audio" || xe === "video" && qt === "single", [rt, Ln] = T(0), _t = R(-1), jt = R(!1), Dn = R($e);
  Dn.current = $e, Z(() => {
    const b = () => {
      const q = Dn.current;
      if (!q && Kn.current) {
        jt.current = !0;
        return;
      }
      _t.current = -1, $a(), q || Ln(($) => $ + 1);
    };
    return window.addEventListener("popstate", b), () => window.removeEventListener("popstate", b);
  }, []);
  const gt = $t === "audio" ? p : l, Or = xe === "tag" ? "Tag" : $t === "audio" ? "Audio" : "Video", Ut = xe === "tag" ? y : gt, I = R(
    null
  ), j = np(se), [J, qe] = T({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [ke, Pe] = T({
    page: 1,
    perPage: 40
  }), [de, Le] = T({ items: [], totalCount: 0 }), [_n, Te] = T(S);
  _n !== S && (Te(S), Le({ items: [], totalCount: 0 }), W(!1));
  const [ge, Ct] = T(!1), [De, cr] = T(""), [ht, Xr] = T(!1), [Zr, ea] = T(!1), [Tt, Xt] = T(() => /* @__PURE__ */ new Set()), jn = R(Tt);
  jn.current = Tt;
  const gn = R(/* @__PURE__ */ new Map()), Mr = (U == null ? void 0 : U.view.selectAllOnLoad) === !0, [Be, at] = T(null), We = R(Be);
  We.current = Be;
  const [st, Bt] = T(!1), Ot = R(st);
  Ot.current = st;
  const Un = R(null), [Bn, sn] = T(!1), [Zt, Kt] = T("grid"), [Fr, ta] = T(Ai), [Ie, lr] = T(!1), [An, Aa] = T(!1), Kn = R(!1), [It, xr] = T(""), [Cn, Gt] = T(""), [Pr, cn] = T(""), [Ee, na] = T(null), [bn, dr] = T(""), [ur, Lr] = T(!1), [en, Ca] = T({}), Gn = R(/* @__PURE__ */ new Map()), ra = R(null), fr = R(null), Tn = !!U, oi = Qi(Tp, Ip, () => !1) && Tn, [aa, ia] = T({ top: 0, bottom: 0 });
  kt(() => {
    if (!Tn) return;
    const b = () => {
      const $ = fr.current;
      if (!$) return;
      const z = Math.round($.getBoundingClientRect().top + window.scrollY), te = $.closest("main"), ie = te ? Math.round(parseFloat(getComputedStyle(te).paddingBottom) || 0) : 0;
      ia(
        (ne) => ne.top === z && ne.bottom === ie ? ne : { top: z, bottom: ie }
      );
    };
    b();
    const q = typeof ResizeObserver > "u" ? null : new ResizeObserver(b);
    return q == null || q.observe(document.body), window.addEventListener("resize", b), () => {
      q == null || q.disconnect(), window.removeEventListener("resize", b);
    };
  }, [Tn]);
  const [si, ci] = T(0), Vn = R(null), Ta = wn((b) => {
    var $;
    if (($ = Vn.current) == null || $.disconnect(), Vn.current = null, !b || typeof ResizeObserver > "u") return;
    const q = new ResizeObserver(
      () => ci(Math.round(b.getBoundingClientRect().height))
    );
    q.observe(b), Vn.current = q;
  }, []), ln = R(0), pr = R(0), zn = R(null), yn = R(null), In = cc(
    U && !$e ? me ? [...U.actions, ...me.draft.actions] : U.actions : Es
  ), Mt = Ne(
    () => me && U && le ? kp(me.draft, U, J, le) : null,
    [me, U, J, le]
  ), hr = Ne(
    () => U && le ? dl(
      { ...le, view: { ...U.view, filter: { ...J, page: 1 } } },
      le
    ) : null,
    [U, le, J]
  ), Dr = Ne(
    () => le ? zr(Cr(le)) : "",
    [le]
  ), _r = Ne(
    () => hr != null && zr(Cr(hr)) !== Dr,
    [hr, Dr]
  ), Ia = Ne(
    () => Mt != null && zr(Cr(Mt)) !== Dr,
    [Mt, Dr]
  );
  Z(() => {
    if (!Cn) return;
    const b = window.setTimeout(() => Gt(""), 4e3);
    return () => window.clearTimeout(b);
  }, [Cn]), Z(() => {
    if (!Ge || Ge.alert) return;
    const b = window.setTimeout(() => Ve(null), 6e3);
    return () => window.clearTimeout(b);
  }, [Ge]), Z(() => {
    const b = se ? ko(se.view.objectFilter) : [];
    if (Ca({}), !b.length) return;
    const q = new AbortController();
    let $ = !0;
    return Promise.all(
      b.map(async (z) => {
        var te;
        try {
          const ie = await we(`/api/tags/${z}`, {
            signal: q.signal
          });
          return (te = ie.name) != null && te.trim() ? [String(z), ie.name] : null;
        } catch {
          return null;
        }
      })
    ).then((z) => {
      $ && Ca(
        Object.fromEntries(z.filter((te) => te !== null))
      );
    }), () => {
      $ = !1, q.abort();
    };
  }, [se == null ? void 0 : se.id, se == null ? void 0 : se.view.objectFilter]);
  const li = Ne(
    () => se ? Eo(
      se.view.objectFilter,
      en
    ) : (U == null ? void 0 : U.view.objectFilter) ?? {},
    [en, U, se]
  ), oa = wn(async () => {
    c(!0), f("");
    try {
      const b = await Cd();
      n(b.reviews), o(b.storageKey), h(b.canWriteVideos ?? b.canWrite), g(b.canWriteAudios ?? !1), N(b.canWriteTags ?? !1), w(b.canReadTagGroups ?? !1), L(b.canConfigure ?? !0), ae(b.storage ?? "account"), _(b.storageNotice ?? ""), S && !b.reviews.some((q) => q.id === S) && (ce(""), Ci(""));
    } catch (b) {
      f(
        b instanceof Error ? b.message : "Could not load reviews."
      );
    } finally {
      c(!1);
    }
  }, [S]);
  Z(() => {
    if (!v) {
      O([]), B("");
      return;
    }
    const b = new AbortController();
    return B(""), Dd(b.signal).then(O).catch((q) => {
      b.signal.aborted || B(
        q instanceof Error ? q.message : "Could not load tag groups."
      );
    }), () => b.abort();
  }, [v]), Z(() => {
    oa();
  }, []), Z(() => {
    if (S || t.length === 0) return;
    const b = new AbortController();
    for (const q of t) {
      if (typeof pe.current[q.id] == "number") continue;
      (Re(q) ? Ao(q, b.signal).then((z) => (z == null ? void 0 : z.length) === 0 ? { items: [], totalCount: 0 } : Kr(Co(q, z), { ...q.view.filter, page: 1, perPage: 1 }, b.signal)) : _e(q) === "tag" ? gi(
        q,
        Ht({ ...q.view.filter, page: 1, perPage: 1 }),
        b.signal
      ) : Kr(
        q,
        Ht({ ...q.view.filter, page: 1, perPage: 1 }),
        b.signal
      )).then((z) => {
        b.signal.aborted || ue((te) => ({
          ...te,
          [q.id]: z.totalCount
        }));
      }).catch(() => {
        b.signal.aborted || ue((z) => ({ ...z, [q.id]: null }));
      });
    }
    return () => b.abort();
  }, [S, t]), kt(() => {
    var $, z;
    const b = nt.current;
    if (S || s || !b) return;
    nt.current = null, (z = (b === "heading" ? null : [...(($ = fr.current) == null ? void 0 : $.querySelectorAll("[data-review-id]")) ?? []].find(
      (te) => te.dataset.reviewId === b.reviewId
    )) ?? Pt.current) == null || z.focus();
  }, [S, s, Ze, t]);
  const jr = R(0), mr = wn(async () => {
    const b = ++jr.current;
    na(null), dr("");
    try {
      const q = await (pt ? ac($t) : rc($t));
      b === jr.current && na(q);
    } catch (q) {
      if (b !== jr.current) return;
      na(null), dr(
        "Tag assessment setup could not be checked. " + (q instanceof Error ? q.message : "Request failed.")
      );
    }
  }, [pt, $t]);
  Z(() => {
    mr();
  }, [mr]);
  const Rn = wn(
    async (b, q, $ = !1, z = !1) => {
      var dt, Ke;
      const te = ++ln.current;
      (dt = zn.current) == null || dt.abort();
      const ie = new AbortController();
      zn.current = ie, q = Ht(q);
      const ne = Number(q.page);
      $ && (q = { ...q, page: 1 }), qe(q), ea($), Ct(!0), cr("");
      try {
        const lt = (Fe) => _e(b) === "tag" ? gi(
          b,
          Fe,
          ie.signal
        ) : Kr(
          b,
          Fe,
          ie.signal
        );
        let ut = await lt(q);
        const Vt = Math.max(
          1,
          Math.ceil(ut.totalCount / Number(q.perPage))
        ), St = $ ? Vt : Math.min(ne, Vt);
        return Number(q.page) !== St && (q = { ...q, page: St }, ut = await lt(q)), te === ln.current && (((Ke = yn.current) == null ? void 0 : Ke.page) !== St && (yn.current = {
          page: St,
          ids: new Set(ut.items.map((Fe) => Fe.id))
        }), Le(ut), z && fe(
          () => new Set(ut.items.map((Fe) => Fe.id))
        ), qe(q), Pe(q)), ut;
      } catch (lt) {
        throw te === ln.current && cr(
          lt instanceof Error ? lt.message : "Could not load the review queue."
        ), lt;
      } finally {
        te === ln.current && Ct(!1);
      }
    },
    []
  );
  Z(() => {
    var q;
    if (pr.current += 1, _t.current = -1, ln.current += 1, (q = zn.current) == null || q.abort(), vt(null), on.current = null, W(!1), Q(""), M(""), P(!1), Xt(/* @__PURE__ */ new Set()), gn.current.clear(), at(null), Bt(!1), lr(!1), Kn.current = !1, xr(""), Gt(""), cn(""), Le({ items: [], totalCount: 0 }), yn.current = null, Xr(!1), !U || $e) {
      Ct(!1), Nt(null);
      return;
    }
    let b = !0;
    return Ct(!0), (async () => {
      let $ = le ?? U;
      Nt(null);
      let z = null;
      const te = new URLSearchParams(window.location.search);
      if (_e(U) === "video" && ii.some((Ke) => te.has(Ke)))
        try {
          const Ke = $;
          z = Hi(Ke, te);
          const lt = vn(Ke, z.query);
          (z.query.startFrom !== (Ke.view.startFrom ?? "end") || !rr(
            JSON.parse(Xn(lt)),
            JSON.parse(Xn(vn(Ke, Ir(Ke))))
          )) && ($ = lt, Nt($));
        } catch (Ke) {
          Xr(!0), cr(Ke instanceof Error ? Ke.message : "Could not read review URL."), Ct(!1);
          return;
        }
      let ie = null;
      try {
        ie = await $d(i, U.id);
      } catch (Ke) {
        b && (P(!0), M(
          Ke instanceof Error ? Ke.message : "Could not load progress."
        ));
      }
      if (!b) return;
      const ne = (ie == null ? void 0 : ie.signature) === Xn($) ? ie : null, dt = z ? z.query.filter : ne ? Ht(ne.filter) : Ep($.view.filter);
      qe(dt), Kt(
        ne ? Ss(ne.displayMode, _e(U)) : qs(U)
      ), ta(
        ne ? ne.cardSize ?? Ai : Ai
      );
      try {
        const Ke = await Rn(
          $,
          dt,
          z ? z.startAtEnd : !ne && $.view.startFrom !== "beginning",
          $.view.selectAllOnLoad === !0
        );
        if (!b) return;
        const lt = Uo(
          Ke.items.map((ut) => ut.id),
          (ne == null ? void 0 : ne.focusedId) ?? null,
          (ne == null ? void 0 : ne.index) ?? 0
        );
        at(lt), ee(lt);
      } catch {
      }
      b && (_t.current = rt, W(!0), Q(`${U.id}:${rt}`));
    })(), () => {
      var $;
      b = !1, pr.current++, ln.current++, ($ = zn.current) == null || $.abort();
    };
  }, [U == null ? void 0 : U.id, $e, rt]), Z(() => {
    if (!(!Et || $e || !U)) {
      if (ht) {
        wt(0);
        return;
      }
      Ie || me || An || oe !== `${U.id}:${rt}` || (wt(0), pi());
    }
  }, [
    Et,
    $e,
    U == null ? void 0 : U.id,
    oe,
    Ie,
    An,
    rt,
    ht
  ]), Z(() => {
    !se || $e || !Y || ge || De || Ie || jt.current || _t.current !== rt || fa(se.id, {
      filter: J,
      objectFilter: se.view.objectFilter,
      searchMode: se.view.searchMode,
      startFrom: se.view.startFrom ?? "end"
    });
  }, [se, $e, Y, ge, De, J, Ie, rt]);
  const Me = Ne(
    () => de.items.map((b) => b.id),
    [de.items]
  );
  Z(() => {
    if (!Y || !U || !i || ge || De || Ie || (Ue == null ? void 0 : Ue.id) === U.id || D || _t.current !== rt)
      return;
    const b = {
      version: 1,
      signature: Xn(U),
      filter: J,
      focusedId: Be,
      index: Math.max(0, Me.indexOf(Be ?? -1)),
      displayMode: Zt,
      cardSize: Fr,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        i + ":progress:" + U.id,
        JSON.stringify(b)
      );
    } catch {
    }
    if (V) return;
    let q = !0;
    const $ = window.setTimeout(() => {
      Od(i, U.id, b).catch((z) => {
        q && M(
          "Progress is kept in this browser, but account sync failed. " + (z instanceof Error ? z.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      q = !1, window.clearTimeout($);
    };
  }, [
    Y,
    i,
    U,
    ge,
    De,
    Ie,
    J,
    Be,
    Me,
    Zt,
    Fr,
    Ue,
    V,
    D,
    rt
  ]);
  const Ra = de.items.find((b) => b.id === Be) ?? null, m = xe === "video" ? Ra : null;
  st && m && (Un.current = m);
  const k = m ?? (st ? Un.current : null), K = Bo(Tt, Be), re = Me.length > 0 && Me.every((b) => Tt.has(b)), ee = wn((b, q = !0) => {
    b != null && window.requestAnimationFrame(() => {
      var z;
      if (Sn.current || Nd(document.activeElement) || // The drawer's Group list hangs on the page, outside the drawer.
      (z = document.activeElement) != null && z.closest(".dq-drawer, .dq-combobox-list"))
        return;
      const $ = Gn.current.get(b);
      $ == null || $.focus({ preventScroll: !0 }), q && ($ == null || $.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  Z(() => {
    Y && !Ot.current && ee(We.current);
  }, [Y, ee]), Z(() => {
    ge || !Me.length || (We.current == null || !Me.includes(We.current)) && (at(Me[0]), Ot.current || ee(Me[0]));
  }, [ee, Me, ge]);
  const fe = wn(
    (b) => {
      Xt((q) => {
        const $ = b(q);
        for (const z of /* @__PURE__ */ new Set([...q, ...$]))
          q.has(z) !== $.has(z) && gn.current.set(
            z,
            (gn.current.get(z) ?? 0) + 1
          );
        return $;
      });
    },
    []
  ), et = wn(
    (b) => {
      if (!Me.length) return;
      const q = Math.max(
        0,
        Me.indexOf(We.current ?? Me[0])
      ), $ = Me[Math.max(0, Math.min(Me.length - 1, q + b))];
      at($), Ot.current || ee($);
    },
    [ee, Me]
  ), ct = wn(
    async (b, q = !1) => {
      const $ = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", z = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, te = z != null && (!v || !E.some((tt) => tt.id === z)), ie = "effect" in b && $ && !v, ne = Bo(
        jn.current,
        We.current
      );
      if (!U || Kn.current || ge || De) return;
      const dt = $ && !Ut ? `${Or} write permission is required to apply ${b.label}.` : ie || te ? `${b.label} needs a tag group that is unavailable.` : tr(b) && (Ee == null ? void 0 : Ee.kind) !== "ready" ? `Set up tag assessments before applying ${b.label}.` : ne.length ? "" : `Select or focus a ${xe} before applying ${b.label}.`;
      if (dt) {
        cn(dt);
        return;
      }
      const Ke = ++pr.current, lt = U.id, ut = [...Me], Vt = de, St = We.current, Fe = new Set(jn.current), tn = new Map(
        ne.map((tt) => [tt, gn.current.get(tt) ?? 0])
      ), Nr = () => Ke === pr.current && U.id === lt;
      Kn.current = !0, lr(!0), xr(
        jn.current.size ? `${ne.length} selected ${xe}s` : `the focused ${xe}`
      ), Gt(""), cn("");
      const Lo = Vt.items.filter(
        (tt) => !ne.includes(tt.id)
      ), Il = Lo.map((tt) => tt.id), Do = Ko(
        ut,
        Il,
        St,
        ne.includes(St ?? -1)
      );
      q || (Le({
        items: Lo,
        totalCount: Vt.totalCount
      }), Xt((tt) => {
        const zt = new Set(tt);
        for (const un of ne) zt.delete(un);
        return zt;
      }), at(Do), Ot.current || ee(Do));
      let hi = !1;
      try {
        if ("effect" in b ? await Jd(b, ne) : await oc($t, b, ne), hi = !0, !Nr()) return;
        q || Xt((tt) => {
          const zt = new Set(tt);
          for (const un of ne)
            (gn.current.get(un) ?? 0) === tn.get(un) && zt.delete(un);
          return zt;
        }), Gt(
          `${b.label}: ${ne.length} ${xe}${ne.length === 1 ? "" : "s"} ${$ ? "updated" : "skipped"}${q ? ", kept in place" : ""}.`
        );
      } catch (tt) {
        if (!Nr()) return;
        Le(Vt), Xt((zt) => {
          const un = new Set(zt);
          for (const nn of ne)
            Fe.has(nn) && (gn.current.get(nn) ?? 0) === tn.get(nn) && un.add(nn);
          return un;
        }), at(St), Ot.current || ee(St), cn(
          tt instanceof Error ? tt.message : "Action failed."
        );
      }
      try {
        if (!Nr()) return;
        if (q) {
          const xt = xe === "tag" ? await gi(U, J) : await Kr(U, J), Hn = new Map(
            xt.items.map((rn) => [rn.id, rn])
          );
          if (xe !== "tag" && await Promise.all(
            ne.filter((rn) => !Hn.has(rn)).map(async (rn) => {
              const Qn = await Ha($t, rn).catch(() => null);
              Qn && Hn.set(rn, Qn);
            })
          ), !Nr()) return;
          Le((rn) => ({
            items: rn.items.map((Qn) => Hn.get(Qn.id) ?? Qn),
            totalCount: xt.totalCount
          }));
          return;
        }
        const tt = new Set(ne), zt = Mr && ut.length > 0 && ut.every((xt) => tt.has(xt)), un = await Rn(U, J, !1, zt);
        if (!Nr()) return;
        let nn = un.items.map((xt) => xt.id);
        const xa = yn.current, Rl = (xa == null ? void 0 : xa.page) === Number(J.page) && nn.some((xt) => xa.ids.has(xt)), $l = (U.view.startFrom ?? "end") !== "beginning";
        if (un.totalCount > 0 && Number(J.page) > 1 && (!nn.length || $l && !Rl)) {
          const xt = Math.max(1, Number(J.page) - 1), Hn = { ...J, page: xt };
          qe(Hn), nn = (await Rn(
            U,
            Hn,
            !1,
            zt
          )).items.map((mi) => mi.id), Xt(
            (mi) => new Set([...mi].filter((Ol) => nn.includes(Ol)))
          );
          const Qn = nn.at(-1) ?? null;
          at(Qn), Ot.current || ee(Qn);
        } else {
          Xt(
            (Hn) => new Set([...Hn].filter((rn) => nn.includes(rn)))
          );
          const xt = Ko(
            ut,
            nn,
            St,
            hi && ne.includes(St ?? -1)
          );
          at(xt), Ot.current && xt == null && Bt(!1), Ot.current || ee(xt);
        }
      } catch (tt) {
        Nr() && cn(
          (zt) => `${zt ? `${zt} ` : ""}${hi ? "The action completed, but " : ""}the queue could not be refreshed. ${tt instanceof Error ? tt.message : "Refresh failed."}`
        );
      } finally {
        Nr() && (Kn.current = !1, lr(!1), xr(""), jt.current && (jt.current = !1, $a(), Ln((tt) => tt + 1)));
      }
    },
    [
      Ut,
      v,
      E,
      xe,
      Ee,
      Rn,
      J,
      ee,
      Me,
      de,
      ge,
      De,
      U
    ]
  );
  function Jn() {
    var $;
    if (Zt === "list") return 1;
    const b = ($ = ra.current) == null ? void 0 : $.firstElementChild, q = b ? getComputedStyle(b).gridTemplateColumns : "";
    return Math.max(1, q.split(" ").filter(Boolean).length);
  }
  const mt = R(() => {
  });
  mt.current = (b) => {
    var ie;
    if ($e || b.defaultPrevented || b.repeat || an(b) || b.ctrlKey || b.altKey || b.metaKey || Lt) return;
    const q = b.target, $ = q instanceof Node && ((ie = fr.current) == null ? void 0 : ie.contains(q)) === !0, z = q === document.body || q === document.documentElement;
    if (!$ && !z) return;
    if (Bn) {
      b.key === "Escape" && (Br(b), sn(!1));
      return;
    }
    if (st && b.key === "Escape") {
      Br(b), Bt(!1), ee(We.current);
      return;
    }
    if (!vd(q)) return;
    const te = wd(q);
    if (b.key === "Escape") {
      Br(b), fe(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!st && b.key === " " && te) {
      Br(b), Be != null && fe((ne) => Ba(ne, Be));
      return;
    }
    if (!(Ie || ge) && !st && b.key === "Enter" && Be != null && te) {
      if (xe !== "tag" && me) return;
      Br(b), xe === "tag" ? window.open(`/tag/${Be}`, "_blank", "noopener,noreferrer") : Bt(!0);
      return;
    }
  }, Z(() => {
    const b = (q) => mt.current(q);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []);
  const $n = R(
    () => {
    }
  );
  $n.current = (b) => {
    var ie;
    if ($e || Lt || st || Bn || Ie || ge || !Me.length || b.defaultPrevented || b.repeat || b.ctrlKey || b.altKey || b.metaKey)
      return;
    const q = b.target, $ = q instanceof Node && ((ie = fr.current) == null ? void 0 : ie.contains(q)) === !0, z = q === document.body || q === document.documentElement;
    if (!$ && !z || !b.key.startsWith("Arrow") || !qd(q)) return;
    const te = Sd(b.key, Jn());
    te && (b.preventDefault(), $ ? b.stopImmediatePropagation() : b.stopPropagation(), et(te));
  }, Z(() => {
    const b = (q) => $n.current(q);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []);
  const Ae = (me == null ? void 0 : me.saving) === !0 || An, Ye = Ie || ge && !Y || Ae, dn = go();
  mo({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!U && !$e && !Lt && !me && !st && !Bn && !De && (de.items.length > 0 || ge || Ie),
    actions: (U == null ? void 0 : U.actions) ?? Es,
    onAction: (b, q) => {
      const $ = U == null ? void 0 : U.actions[b];
      $ && ct($, q);
    },
    onFind: () => sn(!0),
    onSelectAll: () => fe((b) => yd(b, Me))
  }), Z(() => sn(!1), [$e, st, U == null ? void 0 : U.id]);
  function gr(b) {
    const q = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", $ = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, z = $ != null && !E.some((te) => te.id === $);
    return Ie || ge || !!De || q && !Ut || "effect" in b && q && (!v || z) || tr(b) && (Ee == null ? void 0 : Ee.kind) !== "ready" || !K.length;
  }
  function br(b) {
    Dt(null), wt(0), Ve(null), ce(b), Ci(b, !!b && !U);
  }
  function yr() {
    Ce.current || (cl() ? (Ce.current = !0, window.history.back()) : br(""));
  }
  function $a() {
    const b = Ce.current;
    Ce.current = !1;
    let q = ks();
    q && !ye.current && !G.current.some((z) => z.id === q) && (q = "", Ci(""));
    const $ = A.current;
    q !== $ && (wt(0), b || Ve(null), !q && $ && (nt.current ?? (nt.current = { reviewId: $ }))), ce(q);
  }
  function wr() {
    nt.current = "heading", Ve(null), yr();
  }
  function vr(b) {
    b !== S && br(b), wt((q) => q + 1);
  }
  function Ft() {
    Ve(null), Oe({
      review: pl("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function Oa(b) {
    if (Yt || !C) return;
    Ve(null);
    const q = crypto.randomUUID();
    let $;
    const z = S;
    ze(!0);
    try {
      if (!await sa((ie) => ($ = gd(
        ie.find((ne) => ne.id === b.id) ?? b,
        ie,
        q
      ), [...ie, $]))) throw new Error("Could not save reviews.");
      if (!Se.current) return;
      A.current !== z ? Ve({ text: `Saved the copy “${$.name}”.`, alert: !1 }) : vr($.id);
    } catch (te) {
      Ve({
        text: `“${b.name}” was not duplicated. ${Ma(te)}`,
        alert: !0
      });
    } finally {
      ze(!1);
    }
  }
  async function gl() {
    if (!ft || ft.saving) return;
    const b = { ...ft.review, name: ft.review.name.trim() }, q = ga(b);
    if (q) {
      Oe({ ...ft, error: q });
      return;
    }
    Oe({ ...ft, saving: !0, error: "" });
    try {
      if (!await sa(($) => [...$, b]))
        throw new Error("Could not save reviews.");
      if (!Se.current) return;
      Oe(null), vr(b.id);
    } catch ($) {
      Oe(
        (z) => z && {
          ...z,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + ($ instanceof Error ? $.message : "Retry saving.")
        }
      );
    }
  }
  async function bl() {
    if (!Ze || Ze.pending) return;
    const b = Ze.review, q = fl(t, X, Xe, Rt).map((te) => te.id), $ = q.filter((te) => te !== b.id), z = $[Math.min(q.indexOf(b.id), $.length - 1)];
    qn({ review: b, pending: !0 });
    try {
      if (!await sa((te) => te.filter((ie) => ie.id !== b.id)))
        throw new Error("Could not save reviews.");
      nt.current = b.id !== S && z ? { reviewId: z } : "heading", Ve({ text: `Deleted “${b.name}”.`, alert: !1 });
    } catch (te) {
      Ve({ text: `“${b.name}” was not deleted. ${Ma(te)}`, alert: !0 });
    } finally {
      qn(null);
    }
  }
  async function yl(b) {
    if (!(Yt || !C)) {
      Ve(null), or(!0);
      try {
        const q = await af(b);
        let $ = 0;
        if (q.length && !await sa((te) => {
          const ie = Ti(te, q);
          return $ = ie.length - te.length, $ ? ie : te;
        }))
          throw new Error("Could not save reviews.");
        const z = q.length - $;
        Ve({
          alert: !1,
          text: q.length ? $ ? `Imported ${$ === 1 ? "1 review" : `${$} reviews`}.` + (z === 1 ? " 1 review already in the list stays as it is." : z ? ` ${z} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (q) {
        Ve({ alert: !0, text: `Could not import “${b.name}”. ${Ma(q)}` });
      } finally {
        or(!1);
      }
    }
  }
  function Ma(b) {
    return b instanceof Qs ? "Reviews changed in another browser. Reload the page to get them, then try again." : b instanceof Error ? b.message : "Try again.";
  }
  function Oo(b) {
    const q = !C || Yt;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ a(Ps, { "aria-hidden": "true" }),
        disabled: q,
        onSelect: () => void Oa(b)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ a(Bs, { "aria-hidden": "true" }),
        onSelect: () => vo(b)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ a(Za, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: q,
        onSelect: () => {
          Ve(null), qn({ review: b, pending: !1 });
        }
      }
    ];
  }
  function Mo(b, q) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ a(Jr, { "aria-hidden": "true" }),
        ...q,
        disabled: q.disabled || Qe
      },
      ...Oo(b),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ a(Na, { "aria-hidden": "true" }),
        separated: !0,
        disabled: Qe,
        onSelect: wr
      }
    ];
  }
  async function sa(b) {
    if (!i) return !1;
    let q = [];
    const $ = await Rd(i, (ne) => {
      q = ne;
      const dt = b(ne);
      return dt === ne ? ne : dt.map(Mp);
    });
    if (n($), !Se.current) return !0;
    const z = A.current;
    z && !$.some((ne) => ne.id === z) && yr();
    const te = q.find((ne) => ne.id === z), ie = $.find((ne) => ne.id === z);
    return ie && te && ((ie.view.reviewMode ?? "single") !== (te.view.reviewMode ?? "single") && Dt(null), ie.view.displayMode !== te.view.displayMode && Kt(qs(ie))), !0;
  }
  function di(b) {
    return sa((q) => Op(q, b));
  }
  function wl(b) {
    return di(b).catch((q) => {
      throw A.current !== b.id && ui(b, q), q;
    });
  }
  function ui(b, q) {
    var z;
    if (!Se.current) return;
    const $ = ((z = G.current.find((te) => te.id === b.id)) == null ? void 0 : z.name) ?? b.name;
    Ve({ text: `“${$}” was not saved. ${Ma(q)}`, alert: !0 });
  }
  if (s)
    return /* @__PURE__ */ a(As, { label: "Loading reviews…" });
  if (d)
    return /* @__PURE__ */ u(be, { children: [
      /* @__PURE__ */ a(
        "button",
        {
          className: "dq-button",
          onClick: () => void Dp().catch(
            (b) => f(
              "Could not export browser reviews. " + (b instanceof Error ? b.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ a(
        Cs,
        {
          message: d,
          onRetry: () => void oa()
        }
      )
    ] });
  const fi = /* @__PURE__ */ u(be, { children: [
    H && /* @__PURE__ */ a("p", { className: "dq-status", children: H }),
    En && (Ee == null ? void 0 : Ee.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      Ee.message,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: ur,
          onClick: () => {
            Lr(!0), dr(""), (pt ? Kd($t) : Bd($t)).then(mr).catch(
              (b) => dr(
                `Could not create the ${pt ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (b instanceof Error ? b.message : "Request failed.")
              )
            ).finally(() => Lr(!1));
          },
          children: ur ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    En && ((Ee == null ? void 0 : Ee.kind) === "incompatible" || bn) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(On, {}),
      bn || (Ee == null ? void 0 : Ee.message),
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: ur,
          onClick: () => {
            Lr(!0), mr().finally(
              () => Lr(!1)
            );
          },
          children: ur ? "Checking…" : "Check again"
        }
      )
    ] }),
    r && /* @__PURE__ */ u("details", { children: [
      /* @__PURE__ */ a("summary", { children: "Unassigned legacy browser reviews" }),
      /* @__PURE__ */ a("p", { children: "These old reviews have no account owner. They have not been copied into this account. Export them for recovery, then import the reviews only into the intended account. The original data and deletion history stay in this browser." }),
      /* @__PURE__ */ a(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const b = localStorage.getItem("page-videos") ?? "[]", q = URL.createObjectURL(
              new Blob([b], { type: "application/json" })
            ), $ = document.createElement("a");
            $.href = q, $.download = "data-quality-unassigned-legacy-reviews.json", $.click(), URL.revokeObjectURL(q);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    V && /* @__PURE__ */ u("p", { role: "alert", children: [
      V,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          onClick: () => {
            M(""), P(!1);
          },
          children: D ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    Ge && (Ge.alert ? /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(On, { "aria-hidden": "true" }),
      Ge.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ a("p", { className: "dq-status", "aria-hidden": "true", children: Ge.text })
    ))
  ] });
  return /* @__PURE__ */ u(
    "div",
    {
      ref: fr,
      className: `data-quality-page${Tn ? " dq-page-fit" : ""}`,
      style: Tn ? {
        "--dq-fit-top": `${aa.top}px`,
        "--dq-fit-bottom": `${aa.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: Ge && !Ge.alert ? Ge.text : "" }),
        U && $e ? /* @__PURE__ */ a(
          gp,
          {
            review: le ?? U,
            canWrite: mn ? y : gt,
            canAssess: (Ee == null ? void 0 : Ee.kind) === "ready" && gt,
            onBusy: lr,
            editRequest: Et,
            onEditRequestHandled: () => wt(0),
            onSaveDefaults: C ? wl : void 0,
            pageControls: {
              onBack: wr,
              moreItems: (b) => Mo(le ?? U, b),
              onGrid: se ? () => Dt({ id: se.id, mode: "multiple" }) : void 0,
              notices: fi,
              busy: Qe
            },
            stayOnTap: kn,
            onStayOnTapChange: pn
          },
          U.id
        ) : U ? Cl(U) : /* @__PURE__ */ a(
          Np,
          {
            reviews: t,
            counts: X,
            sort: Xe,
            direction: Rt,
            onSortChange: (b) => Wt({ sort: b }),
            onDirectionChange: (b) => Wt({ direction: b }),
            storage: Sp[x],
            canConfigure: C,
            busy: Yt,
            headingRef: Pt,
            notices: fi,
            onOpen: br,
            onNew: () => Ft(),
            onImport: (b) => void yl(b),
            onExportAll: () => Lc(t, "data-quality-reviews.json"),
            rowMenuItems: (b) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ a(Jr, { "aria-hidden": "true" }),
                disabled: !C || Yt,
                onSelect: () => vr(b.id)
              },
              ...Oo(b)
            ]
          }
        ),
        st && k && se && /* @__PURE__ */ a(
          Lp,
          {
            video: k,
            review: se,
            details: rp(k, se, j.ids),
            selectedCount: Tt.size,
            pending: Ie,
            refreshing: ge || !!De,
            error: Pr,
            canWrite: l,
            assessmentReady: (Ee == null ? void 0 : Ee.kind) === "ready",
            trees: In,
            selected: Tt.has(k.id),
            hasPrevious: Me.indexOf(k.id) > 0,
            hasNext: Me.indexOf(k.id) >= 0 && Me.indexOf(k.id) < Me.length - 1,
            onToggleSelected: () => fe((b) => Ba(b, k.id)),
            onPrevious: () => et(-1),
            onNext: () => et(1),
            onClose: () => {
              Bt(!1), ee(We.current);
            },
            onAction: ct,
            findOpen: Bn,
            onFindOpenChange: sn
          }
        ),
        Bn && U && !$e && !st && /* @__PURE__ */ a(
          yo,
          {
            actions: U.actions,
            tagGroups: E,
            trees: In,
            isDisabled: gr,
            onApply: (b, q) => {
              sn(!1), ct(b, q);
            },
            onClose: () => sn(!1)
          }
        ),
        ft && /* @__PURE__ */ a(
          qp,
          {
            draft: ft,
            onChange: (b) => Oe((q) => q && { ...q, review: b, error: "" }),
            onCreate: () => void gl(),
            onCancel: () => Oe(null)
          }
        ),
        /* @__PURE__ */ a(
          Bl,
          {
            open: !!Ze,
            title: "Delete review?",
            message: Ze ? `“${Ze.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (Ze == null ? void 0 : Ze.pending) ?? !1,
            onConfirm: () => void bl(),
            onCancel: () => qn((b) => b != null && b.pending ? b : null)
          }
        )
      ]
    }
  );
  async function Fa(b, q, $ = !1, z = !0) {
    const te = We.current, ie = Math.max(0, Me.indexOf(te ?? -1));
    try {
      const ne = Rn(
        b,
        q,
        $,
        b.view.selectAllOnLoad === !0
      ), dt = ln.current, Ke = await ne;
      if (dt !== ln.current) return;
      const lt = Ke.items.map((Vt) => Vt.id);
      Xt(
        (Vt) => new Set([...Vt].filter((St) => lt.includes(St)))
      );
      const ut = Uo(lt, te, ie);
      at(ut), z && !Ot.current && ee(ut, !1);
    } catch {
    }
  }
  function vl(b) {
    const q = I.current;
    if (I.current = null, Ye || !U || !le) return;
    const $ = q ?? U.view.objectFilter, z = rr(
      $,
      le.view.objectFilter
    ) ? le.view.objectFilter : $, te = Ht({ ...b, page: 1 }), ie = {
      ...U,
      view: {
        ...U.view,
        filter: te,
        objectFilter: z
      }
    }, ne = !Ns(ie, le), dt = ne ? ie : le;
    Nt(ne ? ie : null), Gt(ne ? "" : "Review queue defaults restored."), Fa(dt, te, dt.view.startFrom !== "beginning");
  }
  function Nl() {
    if (Ie || ge || Ae || !le) return;
    I.current = null;
    const b = Ht({
      ...le.view.filter,
      page: 1
    });
    Nt(null), Gt("Review queue defaults restored."), Fa(
      le,
      b,
      le.view.startFrom !== "beginning",
      !1
    );
  }
  function ql() {
    if (Ie || ge || De || Ae || !U || !hr || !C)
      return;
    const b = U, q = hr;
    Aa(!0), di(q).then(($) => {
      !$ || A.current !== q.id || (Nt(vs(q, b)), Gt("Queue saved to this review."));
    }).catch(($) => {
      A.current !== q.id ? ui(q, $) : cn($ instanceof Error ? $.message : "Could not save queue.");
    }).finally(() => Aa(!1));
  }
  function pi() {
    if (!U || !le || Kn.current || me || An) return;
    hn.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, on.current = {
      temporaryReview: Ue,
      filter: J,
      loadedFilter: ke,
      queue: de,
      queueError: De,
      retryFromEnd: Zr,
      selectedIds: new Set(Tt),
      focusedId: Be,
      pageCursor: yn.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const b = structuredClone({
      ...le,
      view: { ...le.view, startFrom: U.view.startFrom ?? "end" }
    });
    sn(!1), Bt(!1), Gt(""), cn(""), vt({ draft: b, saving: !1, error: "" });
  }
  function Fo() {
    vt(null), on.current = null;
    const b = hn.current;
    hn.current = null, requestAnimationFrame(() => {
      (b == null ? void 0 : b.isConnected) && b !== document.body && !(b instanceof HTMLButtonElement && b.disabled) ? b.focus({ preventScroll: !0 }) : ee(We.current, !1);
    });
  }
  function Sl() {
    var q;
    if (!me || me.saving) return;
    const b = on.current;
    b && (ln.current += 1, (q = zn.current) == null || q.abort(), I.current = null, Ct(!1), Nt(b.temporaryReview), qe(b.filter), Pe(b.loadedFilter), Le(b.queue), cr(b.queueError), ea(b.retryFromEnd), fe(() => b.selectedIds), at(b.focusedId), yn.current = b.pageCursor, window.history.replaceState(window.history.state, "", b.url)), Fo();
  }
  async function kl() {
    if (!me || me.saving || !Mt || !U) return;
    const b = U, q = { ...Mt, name: Mt.name.trim() }, $ = ga(q);
    if ($) {
      vt((z) => z && { ...z, error: $ });
      return;
    }
    vt((z) => z && { ...z, saving: !0, error: "" });
    try {
      if (!await di(q)) throw new Error("Could not save reviews.");
      if (!Se.current || A.current !== q.id) return;
      Nt(vs(q, b)), _e(q) === "video" && fa(q.id, {
        filter: J,
        objectFilter: b.view.objectFilter,
        searchMode: q.view.searchMode,
        startFrom: q.view.startFrom ?? "end"
      }), Gt("Review saved."), Fo();
    } catch (z) {
      if (A.current !== q.id) {
        ui(q, z);
        return;
      }
      vt(
        (te) => te && {
          ...te,
          saving: !1,
          error: "Could not save review. Your edits are still open. " + (z instanceof Error ? z.message : "Retry saving.")
        }
      );
    }
  }
  function xo() {
    U && Rn(U, J, Zr, Mr).catch(() => {
    });
  }
  function El() {
    Xt(/* @__PURE__ */ new Set()), gn.current.clear(), at(null);
  }
  function Al(b) {
    !U || Ie || Ae || b === Number(J.page) || $p(
      { ...J, page: b },
      U,
      (q, $) => Rn(q, $, !1, Mr),
      El
    );
  }
  function Po(b) {
    if (!se || !le || Ie || ge || Ae) return;
    const q = sl(se, b, le.view.objectFilter), $ = !Ns(q, le);
    Nt($ ? q : null), $ ? Fa(q, { ...J, page: 1 }) : Fa(
      le,
      { ...J, page: 1 },
      le.view.startFrom !== "beginning"
    );
  }
  function Cl(b) {
    var Ke, lt, ut, Vt, St;
    const q = xe === "tag", $ = q ? "tag" : "video", z = Math.max(1, Number(J.perPage) || 40), te = Math.max(1, Math.ceil(de.totalCount / z)), ie = Math.min(Math.max(1, Number(J.page) || 1), te), ne = [
      Ut ? "" : `${Or} write permission is required to apply actions.`,
      q && F ? `Tag groups are unavailable. ${F}` : ""
    ].filter(Boolean), dt = !!Pr && !st;
    return /* @__PURE__ */ u(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": q ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ a(
            jc,
            {
              name: b.name,
              description: b.description,
              entityType: xe,
              onBack: wr,
              backDisabled: Ie || !!me || Qe,
              onEdit: me ? () => {
                var Fe;
                return (Fe = sr.current) == null ? void 0 : Fe.focus();
              } : pi,
              editDisabled: !me && (Ie || ge || ht || An || Qe || !C),
              editing: !!me,
              toolbar: /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: Ye, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: q ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ a(
                  pa,
                  {
                    filter: De ? ke : J,
                    onFilterChange: vl,
                    totalCount: de.totalCount,
                    sortOptions: q ? Gl : $s,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: Zt,
                    zoomLevel: (Fr - 225) / 50,
                    onZoomChange: (Fe) => ta(Math.round(225 + Fe * 50)),
                    cardSizeEntityType: q ? "tags" : "videos",
                    criteriaDefinitions: q ? Kl : Xa,
                    customFieldEntityType: xe === "video" ? "video" : void 0,
                    supportsFilterExpressions: !q,
                    objectFilter: li,
                    onObjectFilterChange: (Fe) => {
                      Ye || (I.current = xe === "video" ? Kc(
                        Fe,
                        en,
                        b.view.objectFilter
                      ) : Fe);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(Uc, { page: ie, pages: te, onPage: Al })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ u(be, { children: [
                se && /* @__PURE__ */ a(
                  Bc,
                  {
                    mode: "multiple",
                    disabled: Ie || ge || Lt || !!me || An || Qe,
                    onChange: () => Dt({ id: se.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ a(
                  yf,
                  {
                    options: q ? Cp : Ap,
                    value: Zt,
                    onChange: (Fe) => Kt(Ss(Fe, xe))
                  }
                )
              ] }),
              trailingEnd: /* @__PURE__ */ a(
                No,
                {
                  disabled: Ie || !!me,
                  items: Mo(le ?? b, {
                    onSelect: pi,
                    disabled: ge || ht || An || !C
                  })
                }
              ),
              queueDiffers: Y ? (Ue == null ? void 0 : Ue.id) === S : void 0,
              queueChange: !me && (Ue == null ? void 0 : Ue.id) === S ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: _r ? ql : void 0,
                saveDisabled: Ie || ge || !!De || Ae || !C,
                onReset: Nl,
                resetDisabled: Ie || ge || Ae
              } : void 0,
              chipsAfter: (lt = (Ke = se == null ? void 0 : se.presentation) == null ? void 0 : Ke.binParents) != null && lt.length || (Vt = (ut = se == null ? void 0 : se.presentation) == null ? void 0 : ut.filterBins) != null && Vt.length ? /* @__PURE__ */ u(be, { children: [
                !!((St = se.presentation.binParents) != null && St.length) && /* @__PURE__ */ a(
                  ap,
                  {
                    videos: de.items,
                    review: se,
                    savedObjectFilter: (le ?? se).view.objectFilter,
                    trees: j.ids,
                    disabled: Ie || ge || Ae,
                    onToggle: Po
                  }
                ),
                /* @__PURE__ */ a(
                  ip,
                  {
                    review: se,
                    savedObjectFilter: (le ?? se).view.objectFilter,
                    queueFilter: J,
                    queueCount: ge || De ? null : de.totalCount,
                    disabled: Ie || ge || Ae,
                    countsPaused: Ie || ge || Ae || !Y,
                    onToggle: Po
                  }
                )
              ] }) : void 0,
              chipsEnd: me ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
            }
          ),
          fi,
          se && j.error && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: j.error }),
          /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
            me && Mt && /* @__PURE__ */ a(
              _c,
              {
                drawerRef: sr,
                draft: Mt,
                onChange: (Fe) => vt((tn) => tn && { ...tn, draft: Fe }),
                direction: me.draft.view.startFrom ?? "end",
                onDirectionChange: (Fe) => vt(
                  (tn) => tn && {
                    ...tn,
                    draft: { ...tn.draft, view: { ...tn.draft.view, startFrom: Fe } }
                  }
                ),
                tagGroups: E,
                trees: In,
                saving: me.saving,
                saveDisabled: ge || !!De,
                error: me.error,
                dirty: Ia,
                criteriaChanged: _r,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  De && !ge ? /* @__PURE__ */ u("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ a(On, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { children: [
                      "The queue could not load: ",
                      De,
                      " ",
                      /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", onClick: xo, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void kl(),
                onCancel: Sl
              }
            ),
            /* @__PURE__ */ u(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${si}px` },
                children: [
                  /* @__PURE__ */ u("div", { className: "dq-grid-content", children: [
                    ge && !de.items.length && /* @__PURE__ */ a(As, { label: "Loading review queue…" }),
                    De && !ge && /* @__PURE__ */ a(
                      Cs,
                      {
                        message: De,
                        retryLabel: ht ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (ht && le && _e(le) === "video") {
                            const Fe = Ir(le);
                            fa(le.id, { ...Fe, filter: { ...Fe.filter, page: void 0 } }), Ln((tn) => tn + 1);
                            return;
                          }
                          xo();
                        }
                      }
                    ),
                    !Ie && !ge && !De && !de.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ a(ei, {}),
                      /* @__PURE__ */ u("p", { children: [
                        "No ",
                        $,
                        "s match this review."
                      ] })
                    ] }),
                    !!de.items.length && /* @__PURE__ */ a("div", { ref: ra, children: /* @__PURE__ */ a(
                      "div",
                      {
                        className: Zt === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${Fr}px` },
                        children: de.items.map(Tl)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ a("div", { className: "dq-bar-dock", ref: Ta, children: /* @__PURE__ */ a(
                    Ic,
                    {
                      actions: me ? me.draft.actions : b.actions,
                      tagGroups: E,
                      trees: In,
                      isDisabled: gr,
                      paused: !!me,
                      busy: Ie || ge,
                      onApply: (Fe) => void ct(Fe),
                      onFind: () => sn(!0),
                      status: Ie ? `Applying action to ${It}…` : "",
                      summary: /* @__PURE__ */ u(be, { children: [
                        /* @__PURE__ */ a("p", { className: "dq-bar-target", children: Tt.size ? `${Tt.size} selected` : Be == null ? "Nothing to apply to" : `Applies to the focused ${$}` }),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !Me.length || re,
                            onClick: () => fe((Fe) => /* @__PURE__ */ new Set([...Fe, ...Me])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ a(yt, { binding: dn.selectAll, hidden: !0 })
                            ]
                          }
                        ),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Escape",
                            disabled: !Tt.size,
                            onClick: () => fe(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ a(yt, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: ne.length ? ne.join(" ") : void 0,
                      keyHints: q ? "Arrows move · Space selects · Enter opens" : me ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews · Shift + key stays",
                      notices: dt || Cn ? /* @__PURE__ */ u(be, { children: [
                        dt && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ a(On, { "aria-hidden": "true" }),
                          Pr
                        ] }),
                        Cn && /* @__PURE__ */ a("p", { role: "status", className: "dq-status", children: Cn })
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
  function Tl(b) {
    var $, z, te;
    if (xe === "tag") {
      const ie = b;
      return /* @__PURE__ */ a(
        Fp,
        {
          tag: ie,
          displayMode: Zt === "list" ? "list" : "grid",
          focused: ie.id === Be,
          selected: Tt.has(ie.id),
          setRef: (ne) => {
            ne ? Gn.current.set(ie.id, ne) : Gn.current.delete(ie.id);
          },
          onFocus: () => at(ie.id),
          onToggle: () => {
            fe((ne) => Ba(ne, ie.id)), ee(ie.id, !1);
          },
          onOpen: () => window.open(`/tag/${ie.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        ie.id
      );
    }
    const q = b;
    return /* @__PURE__ */ a(
      xp,
      {
        video: il(q, se, j.ids),
        showTagBins: ((z = ($ = se == null ? void 0 : se.presentation) == null ? void 0 : $.annotations) == null ? void 0 : z.includes("tags")) && !!((te = se.presentation.annotationParents) != null && te.length),
        displayMode: Zt,
        cardsScroll: oi,
        focused: q.id === Be,
        selected: Tt.has(q.id),
        setRef: (ie) => {
          ie ? Gn.current.set(q.id, ie) : Gn.current.delete(q.id);
        },
        onFocus: () => at(q.id),
        onToggle: () => fe((ie) => Ba(ie, q.id)),
        onPreview: () => {
          me || (at(q.id), Bt(!0));
        },
        onNavigate: e
      },
      q.id
    );
  }
}
function $p(e, t, n, r) {
  r(), n(t, e).catch(() => {
  });
}
function Ba(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function Op(e, t) {
  if (!e.some((n) => n.id === t.id)) throw new Error("This review was deleted.");
  return e.map((n) => n.id === t.id ? t : n);
}
function Mp(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Fp({
  tag: e,
  displayMode: t,
  focused: n,
  selected: r,
  setRef: i,
  onFocus: o,
  onToggle: s,
  onOpen: c,
  onNavigate: d
}) {
  return /* @__PURE__ */ a(
    "article",
    {
      ref: i,
      tabIndex: 0,
      "aria-current": n ? "true" : void 0,
      "aria-label": `${e.name}${r ? ", selected" : ""}`,
      onFocus: o,
      onClick: (f) => {
        o(), f.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${n ? "focused" : ""} ${r ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ a(
        Vl,
        {
          tag: e,
          selected: r,
          onSelect: s,
          onClick: c,
          onNavigate: d
        }
      ) : /* @__PURE__ */ u("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            "aria-label": r ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": r,
            onClick: (f) => {
              f.stopPropagation(), s();
            },
            children: r ? "✓" : ""
          }
        ),
        /* @__PURE__ */ a("button", { type: "button", className: "dq-tag-list-name", onClick: c, children: e.name }),
        /* @__PURE__ */ a("span", { children: e.tagGroupName || "Ungrouped" }),
        /* @__PURE__ */ a("span", { children: e.description || "" }),
        /* @__PURE__ */ u("span", { children: [
          e.videoCount ?? 0,
          " videos"
        ] })
      ] })
    }
  );
}
function xp({
  video: e,
  showTagBins: t,
  displayMode: n,
  cardsScroll: r,
  focused: i,
  selected: o,
  setRef: s,
  onFocus: c,
  onToggle: d,
  onPreview: f,
  onNavigate: l
}) {
  var v, w;
  const h = hl(e), p = R(null), g = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, y = !!(g.date || g.studioName), N = !!(g.performers.length || g.tags.length);
  return kt(() => {
    const E = p.current;
    if (!E) return;
    const O = E.querySelector(
      `a[href="/video/${e.id}"]`
    ), F = E.querySelector(".card-title"), B = `dq-card-title-${e.id}`;
    F && (F.id = B), O && (O.target = "_blank", O.rel = "noreferrer", O.removeAttribute("aria-label"), O.setAttribute("aria-labelledby", B), O.classList.add("dq-card-link"));
    const C = E.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    C && C.setAttribute(
      "aria-label",
      o ? `Deselect ${h}` : `Select ${h}`
    );
    const L = E.querySelector(
      'button[title="Quick View"]'
    );
    L && L.setAttribute("aria-label", `Preview ${h}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (E) => {
        p.current = E, s(E);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${h}${o ? ", selected" : ""}`,
      onFocus: c,
      onClick: (E) => {
        c(), E.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${y ? "has-card-metadata" : "no-card-metadata"} ${N ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ a(
          zl,
          {
            video: g,
            selected: o,
            onSelect: d,
            onNavigate: l,
            onQuickView: f,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ u("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (v = e.tags) == null ? void 0 : v.map((E) => /* @__PURE__ */ a("span", { children: E.name }, E.id)),
          !((w = e.tags) != null && w.length) && /* @__PURE__ */ a("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ a(Pp, { video: e, cardsScroll: r })
      ]
    }
  );
}
function Pp({ video: e, cardsScroll: t }) {
  const n = R(null), r = R(null), [i, o] = T(!1), [s, c] = T(!1), [d, f] = T(!1);
  return Z(() => {
    const l = n.current;
    if (!l || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      o(!0), c(!0);
      return;
    }
    const h = t ? l.closest(".dq-grid-stage") : null, p = new IntersectionObserver(
      ([y]) => o(y.isIntersecting),
      { root: h, rootMargin: "320px 0px", threshold: 0 }
    ), g = new IntersectionObserver(
      ([y]) => c(y.isIntersecting && y.intersectionRatio >= 0.6),
      { root: h, threshold: [0, 0.6, 1] }
    );
    return p.observe(l), g.observe(l), () => {
      p.disconnect(), g.disconnect();
    };
  }, [e.id, e.files.length, t]), Z(() => {
    if (!i) {
      f(!1);
      return;
    }
    const l = new AbortController();
    return we(jd(e.id), {
      signal: l.signal
    }).then((h) => {
      l.signal.aborted || f(h.available === !0);
    }).catch(() => {
      l.signal.aborted || f(!1);
    }), () => l.abort();
  }, [i, e.id]), Z(() => {
    const l = r.current;
    l && (s ? Promise.resolve(l.play()).catch(() => {
    }) : l.pause());
  }, [d, s]), /* @__PURE__ */ a("div", { ref: n, className: "dq-wall-autoplay", "aria-hidden": "true", children: d && /* @__PURE__ */ a(
    "video",
    {
      ref: r,
      src: _d(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Lp({
  video: e,
  review: t,
  details: n,
  selectedCount: r,
  pending: i,
  refreshing: o,
  error: s,
  canWrite: c,
  assessmentReady: d,
  trees: f,
  selected: l,
  hasPrevious: h,
  hasNext: p,
  onToggleSelected: g,
  onPrevious: y,
  onNext: N,
  onClose: v,
  onAction: w,
  findOpen: E,
  onFindOpenChange: O
}) {
  const F = R(null), B = Ea(), C = R(null), L = R(null), x = e.files[0], ae = hl(e), H = (P) => i || o || "steps" in P && P.steps.length > 0 && !c || tr(P) && !d;
  mo({
    surface: "overlay",
    enabled: !E,
    actions: t.actions,
    onAction: (P, Y) => {
      const W = t.actions[P];
      W && w(W, Y);
    },
    onFind: () => O(!0)
  }), Z(() => {
    var Y;
    const P = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (Y = F.current) == null || Y.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = P;
    };
  }, []);
  function _(P) {
    var oe, Q, S;
    if (P.key !== "Tab") return;
    const Y = [
      ...((oe = F.current) == null ? void 0 : oe.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ce) => ce.offsetParent !== null);
    if (!Y.length) {
      P.preventDefault(), (Q = F.current) == null || Q.focus();
      return;
    }
    const W = Y.indexOf(
      document.activeElement
    );
    P.shiftKey && W <= 0 ? (P.preventDefault(), (S = Y.at(-1)) == null || S.focus()) : !P.shiftKey && W === Y.length - 1 && (P.preventDefault(), Y[0].focus());
  }
  function V(P) {
    if (E || P.defaultPrevented || P.ctrlKey || P.metaKey || P.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const Y = P.key === "ArrowLeft" || P.key === "ArrowRight";
    if (P.altKey && !Y) return;
    const W = C.current, oe = P.currentTarget.querySelector("video");
    if (P.key === "Enter" || P.key === "Escape")
      P.repeat || v();
    else if (P.key === " " && W)
      P.repeat || W.toggle();
    else if (Y && W)
      W.seekBy(
        (P.key === "ArrowLeft" ? -1 : 1) * (P.shiftKey ? 5 : P.altKey ? 10 : 60)
      );
    else if (/^[0-9]$/.test(P.key) && W) {
      const Q = L.current;
      if (!P.repeat && (Q == null ? void 0 : Q.videoId) === e.id) {
        const S = [x == null ? void 0 : x.duration, oe == null ? void 0 : oe.duration].find(
          (ue) => ue != null && Number.isFinite(ue) && ue > 0
        ) ?? 0, ce = e.parentVideoId != null, A = ce ? e.clipStartSec ?? 0 : 0, X = (ce ? e.clipEndSec ?? S : S) - A;
        Number.isFinite(X) && X > 0 && Number.isFinite(Q.time) && W.seekBy(A + X * Number(P.key) / 10 - Q.time);
      }
    } else if (P.key === "ArrowUp" || P.key === "ArrowDown")
      !P.repeat && !i && !o && (P.key === "ArrowUp" && h && y(), P.key === "ArrowDown" && p && N());
    else return;
    Br(P);
  }
  function M(P) {
    const Y = F.current, W = P.target instanceof Element ? P.target.closest("button, a[href]") : null;
    !Y || !W || !Y.contains(W) || W.closest(".dq-player, .dq-find-action") || P.detail === 0 || Y.focus({ preventScroll: !0 });
  }
  Z(() => {
    if (E) return;
    let P = 0;
    const Y = requestAnimationFrame(() => {
      P = requestAnimationFrame(() => {
        var oe;
        const W = document.activeElement;
        (oe = F.current) != null && oe.isConnected && (!W || W === document.body || W === document.documentElement) && F.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(Y), cancelAnimationFrame(P);
    };
  }, [E, i, o, p, h, e.id, B]);
  const D = r ? `the ${r} selected video${r === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ u(
    "div",
    {
      ref: F,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${ae}`,
      className: `dq-preview${B ? " dq-preview-mobile" : ""}`,
      onKeyDown: _,
      onKeyDownCapture: V,
      onMouseDown: (P) => {
        P.target === P.currentTarget && v();
      },
      onClick: M,
      children: [
        /* @__PURE__ */ u("div", { className: "dq-preview-shell", children: [
          /* @__PURE__ */ u("header", { className: "dq-preview-header", children: [
            /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: "dq-preview-button",
                "aria-label": "Previous video",
                "aria-keyshortcuts": "ArrowUp",
                title: "Previous video",
                disabled: !h || i || o,
                onClick: y,
                children: [
                  /* @__PURE__ */ a(Na, { "aria-hidden": "true" }),
                  !B && /* @__PURE__ */ a(yt, { binding: "↑", hidden: !0 })
                ]
              }
            ),
            /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: "dq-preview-button",
                "aria-label": "Next video",
                "aria-keyshortcuts": "ArrowDown",
                title: "Next video",
                disabled: !p || i || o,
                onClick: N,
                children: [
                  !B && /* @__PURE__ */ a(yt, { binding: "↓", hidden: !0 }),
                  /* @__PURE__ */ a(js, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ u("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ a("h2", { children: ae }),
              (n.performers.length > 0 || n.tags) && /* @__PURE__ */ u("div", { className: "dq-preview-details", children: [
                n.performers.length > 0 && /* @__PURE__ */ a("span", { className: "dq-preview-performers", children: n.performers.join(", ") }),
                n.tags && (n.tags.length ? /* @__PURE__ */ a("ul", { className: "dq-preview-tags", "aria-label": "Matching tags", children: n.tags.map((P) => /* @__PURE__ */ a("li", { children: P.name }, P.id)) }) : /* @__PURE__ */ a("small", { children: "No matching tags" }))
              ] }),
              /* @__PURE__ */ u("p", { children: [
                "Actions apply to ",
                D
              ] })
            ] }),
            /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: "dq-preview-button dq-preview-select",
                "aria-pressed": l,
                disabled: o,
                onClick: g,
                children: [
                  /* @__PURE__ */ a("span", { className: "dq-preview-check", "aria-hidden": "true", children: l && /* @__PURE__ */ a(Qr, {}) }),
                  "Selected"
                ]
              }
            ),
            /* @__PURE__ */ a(
              "a",
              {
                href: `/video/${e.id}`,
                target: "_blank",
                rel: "noreferrer",
                className: "dq-preview-button dq-preview-icon",
                "aria-label": `Open ${ae} in a new tab`,
                title: "Open video in a new tab",
                children: /* @__PURE__ */ a(Us, { "aria-hidden": "true" })
              }
            ),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-preview-button dq-preview-icon",
                "aria-label": "Close preview",
                "aria-keyshortcuts": "Escape",
                title: "Close preview",
                onClick: v,
                children: /* @__PURE__ */ a(va, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ a("div", { className: "dq-preview-video", children: x ? /* @__PURE__ */ a(
            Os,
            {
              autostart: !0,
              streamUrl: Oi("video", e.id),
              posterUrl: Vo(e),
              format: x.format,
              audioCodec: x.audioCodec,
              duration: x.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onTimeUpdate: (P) => {
                L.current = { videoId: e.id, time: P };
              },
              onPlaybackControlRegister: (P) => (C.current = P, () => {
                C.current === P && (C.current = null);
              }),
              clip: e.parentVideoId != null ? {
                start: e.clipStartSec ?? 0,
                end: e.clipEndSec,
                loop: !1
              } : void 0
            }
          ) : /* @__PURE__ */ a("img", { src: Vo(e), alt: "" }) }) }),
          s && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert dq-preview-alert", children: s }),
          !B && /* @__PURE__ */ u("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ a("span", { children: "Space play / pause" }),
            /* @__PURE__ */ a("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ a("span", { children: "0–9 jump to 0–90 %" }),
            /* @__PURE__ */ a("span", { children: "↑ ↓ previous / next" }),
            /* @__PURE__ */ a("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ a(
            Ic,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: f,
              isDisabled: H,
              busy: i || o,
              onApply: (P) => void w(P),
              onFind: () => O(!0),
              status: i ? `Applying action to ${D}…` : "",
              summary: /* @__PURE__ */ a("p", { className: "dq-bar-target", children: r ? `${r} selected` : "This video" })
            }
          )
        ] }),
        E && /* @__PURE__ */ a(
          yo,
          {
            actions: t.actions,
            trees: f,
            isDisabled: H,
            onApply: (P, Y) => {
              O(!1), w(P, Y);
            },
            onClose: () => O(!1)
          }
        )
      ]
    }
  );
}
async function Dp() {
  const e = await we("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
  let r = n ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (n)
    try {
      const s = JSON.parse(n);
      Array.isArray(s.reviews) && (r = JSON.stringify(s.reviews, null, 2));
    } catch {
    }
  const i = URL.createObjectURL(
    new Blob([r], { type: "application/json" })
  ), o = document.createElement("a");
  o.href = i, o.download = "data-quality-browser-recovery.json", o.click(), URL.revokeObjectURL(i);
}
function As({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ a(ad, { className: "dq-spin" }),
    e
  ] });
}
function Cs({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ a(On, {}),
    /* @__PURE__ */ a("p", { children: e }),
    /* @__PURE__ */ a("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const Vp = { components: { DataQualityPage: Rp } };
export {
  Rp as DataQualityPage,
  Vp as default,
  rr as objectFiltersEqual
};
