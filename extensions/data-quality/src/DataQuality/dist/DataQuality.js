import { jsxs as u, Fragment as he, jsx as a } from "react/jsx-runtime";
import { useState as T, useRef as $, useEffect as ee, useLayoutEffect as Ct, useMemo as we, useCallback as In, useSyncExternalStore as Wi, useId as rt, createContext as Ml, useContext as Fl, Fragment as Yi } from "react";
import { useKeySequence as xl, EntityReferenceMultiSelector as or, SortableList as Is, TagBadge as Pl, EntityReferenceSelector as jo, EntityDetailTabs as Ll, FilterDialog as $s, VIDEO_CRITERIA as ti, DetailListToolbar as pa, PERFORMER_CRITERIA as Xi, AUDIO_CRITERIA as Rs, NarrativeText as Dl, AUDIO_SORT_OPTIONS as _l, VIDEO_SORT_OPTIONS as Os, AudioPlayer as jl, VideoPlayer as Ms, formatDuration as Fs, getResolutionLabel as Ul, ConfirmDialog as Bl, TAG_CRITERIA as Kl, TAG_SORT_OPTIONS as Gl, TagTile as Vl, VideoCard as zl } from "@cove/runtime/components";
import { Search as ya, Flag as jn, Check as Qr, Pencil as Jr, Ban as Ha, ChevronDown as Zi, Plus as wa, Pin as xs, GripVertical as Ps, AlertTriangle as Dn, Copy as Ls, Trash2 as ni, X as va, Mic as Jl, Users as Ds, Tag as _s, Headphones as js, Film as ri, ChevronLeft as Na, MoreHorizontal as Hl, RectangleHorizontal as Ql, LayoutGrid as eo, ChevronRight as Us, Save as Wl, RotateCcw as Yl, Layers as Uo, Undo2 as Xl, RefreshCw as Zl, ExternalLink as Bs, SkipForward as ed, Upload as td, Download as Ks, ArrowUp as nd, ArrowDown as rd, Loader2 as ad, List as id, Grid3X3 as od } from "@cove/runtime/lucide-react";
import { extensionFetch as sd } from "@cove/runtime/api";
import { createPortal as cd } from "react-dom";
const to = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, no = Object.keys(
  to
);
function ha(e) {
  return e === "excludes" || e === "excludesAll";
}
function ro(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
function Gs(e) {
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
const Vs = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function Ce(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function ao(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function De(e) {
  return ao(Le(e));
}
function dd(e) {
  return Le(e) === "video";
}
function Le(e) {
  return e.entityType ?? "video";
}
const rr = [
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
], ai = [
  rr.slice(0, 11),
  rr.slice(11, 22),
  rr.slice(22)
];
function ua(e) {
  return e === "," ? "Comma" : e === "." ? "Period" : void 0;
}
function ma(e) {
  return ua(e) ?? e.toLocaleUpperCase();
}
const ar = "none";
function Ar(e) {
  return typeof e == "string" && rr.includes(e);
}
function io(e) {
  const t = e.shortcut;
  return Ar(t) || t === ar ? t : "auto";
}
function zs(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), i = [];
  e.forEach((s, c) => {
    const d = io(s);
    if (d !== ar) {
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
  const o = rr.filter((s) => !n.has(s));
  return i.forEach((s, c) => {
    const d = o[c];
    d !== void 0 && (t[s] = d, n.set(d, s));
  }), { keys: t, actionOn: n, duplicatePins: r };
}
function ud(e, t, n) {
  const { keys: r, actionOn: i } = zs(e), o = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (Ar(n)) {
    const c = i.get(n), d = r[t];
    c !== void 0 && c !== t && o.set(c, d && e[t].shortcut === d ? d : void 0);
  }
  const s = new Set([...o.values()].filter(Ar));
  return e.map((c, d) => {
    const f = o.has(d) ? o.get(d) : Ar(c.shortcut) && s.has(c.shortcut) ? void 0 : c.shortcut;
    if (f === c.shortcut) return c;
    const { shortcut: l, ...m } = c;
    return f === void 0 ? m : { ...m, shortcut: f };
  });
}
function ga(e) {
  var n;
  return Ce(e) && !Hs(e.occurrence) ? "Complete the optional occurrence condition before saving." : !dd(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : Le(e) !== "tag" && e.actions.some(
    (r) => oo(r)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((r) => Un(r, Le(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((r) => r.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : (((n = e.presentation) == null ? void 0 : n.filterBins) ?? []).some((r) => !r.label.trim() || !Object.keys(r.filter).length) ? "Name every filter bin and give it a filter before saving." : "";
}
const fd = {
  video: 1e3,
  audio: 250
};
function Wt(e, t = "video") {
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
function Bo(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function nr(e) {
  const { page: t, ...n } = e.view.filter, r = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    Ce(e) ? [e.entityType, ...r, e.occurrence] : Le(e) === "video" ? r : [Le(e), ...r]
  );
}
function Un(e, t) {
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
  ) && !oo(e) : !1;
}
function pd(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function _n(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function cr(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function Js(e) {
  return "steps" in e && e.steps.length > 0;
}
function ir(e) {
  return "steps" in e ? e.steps.some((t) => _n(t.mode)) : !1;
}
function oo(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (_n(n.mode))
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
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || Vs.includes(n.entityType)) && (!pd(n.entityType) || Hs(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && hd(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (r) => typeof r == "string"
    )) && // Answer groups belong to actions that write tags; tag reviews have neither.
    (n.stayUntilGroupsAnswered === void 0 || typeof n.stayUntilGroupsAnswered == "boolean" && n.entityType !== "tag") && Array.isArray(n.actions) && n.actions.every(
      (r) => typeof (r == null ? void 0 : r.id) == "string" && typeof r.label == "string" && (r.shortcut === void 0 || typeof r.shortcut == "string") && (n.entityType === "tag" ? "effect" in r && !("steps" in r) && !("group" in r) && Un(r, "tag") : "steps" in r && !("effect" in r) && Array.isArray(r.steps) && r.steps.every(
        (i) => i && Array.isArray(i.tagIds)
      ) && (r.group === void 0 || typeof r.group == "string") && Un(r, "video"))
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
function Ii(...e) {
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
function Hs(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (r) => Array.isArray(r) && r.every((i) => Number.isSafeInteger(i) && i > 0) && new Set(r).size === r.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && no.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.performerFlags === void 0 || bd(t.performerFlags)) && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
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
function Ko(e, t) {
  return e.size > 0 ? [...e].sort((n, r) => n - r) : t == null ? [] : [t];
}
function Go(e, t, n, r) {
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
function ln(e) {
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
const Qs = "ext:com.midnightrider.data-quality:configuration", kd = "ext:cove-data-quality:video-reviews", $i = "ext:com.midnightrider.data-quality:progress";
class Ws extends Error {
}
const Sa = /* @__PURE__ */ new Map(), _a = /* @__PURE__ */ new Map(), Sr = (e, t) => e.includes("*") || e.includes(t), Qa = (e) => ge(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Ed = () => ({
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
async function Ys(e) {
  const t = await ge("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function so(e, t) {
  const n = (_a.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return _a.set(e, n), n.finally(() => {
    _a.get(e) === n && _a.delete(e);
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
  const e = await ge("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return so(t, () => Id(e, t));
}
async function Id(e, t) {
  var h;
  const n = String(e.user.id), r = Sr(e.permissions, "savedfilters.read"), i = r && Sr(e.permissions, "savedfilters.write"), o = r ? (await Qa(Qs)).filter((g) => g.name === "Data Quality configuration").sort((g, y) => g.id - y.id) : [];
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
        await ge(`/api/savedfilters/${y.id}`, {
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
      reviews: Ii(s.reviews, g.reviews).filter(
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
    const N = r ? (await Qa(kd)).flatMap(
      (E) => qa(E.uiOptions ?? "[]")
    ) : [], v = y.known.filter(
      (E) => !y.reviews.some((O) => O.id === E)
    ), w = /* @__PURE__ */ new Set([...s.deletedIds, ...v]);
    s = {
      ...s,
      reviews: Ii(
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
  const m = {
    userId: n,
    recordId: (h = o[0]) == null ? void 0 : h.id,
    config: s,
    readable: r,
    writable: i,
    durable: i
  };
  if (Sa.set(t, m), l && i) {
    const g = s;
    o.length && (m.config = Ur(o[0].uiOptions)), await Xs(t, g), s = m.config;
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
    canWrite: Sr(e.permissions, "videos.write"),
    canWriteVideos: Sr(e.permissions, "videos.write"),
    canWriteAudios: Sr(e.permissions, "audios.write"),
    canWriteTags: Sr(e.permissions, "tags.write"),
    canReadTagGroups: Sr(e.permissions, "taggroups.read"),
    canConfigure: !r || i,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: r ? i ? "account" : "readOnly" : "browser",
    storageNotice: r ? i ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Xs(e, t) {
  const n = Sa.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const r = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await Ys(n), n.recordId != null) {
      const o = await ge(
        `/api/savedfilters/${n.recordId}`
      );
      if (Ur(o.uiOptions).revision !== n.config.revision)
        throw new Ws(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const i = await ge(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Qs,
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
function $d(e, t) {
  return so(e, async () => {
    const n = Sa.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const r = n.config.reviews, i = t(r);
    if (i === r) return r;
    qa(JSON.stringify(i));
    const o = r.filter((s) => !i.some((c) => c.id === s.id)).map((s) => s.id);
    return await Xs(e, {
      ...n.config,
      reviews: i,
      deletedIds: [
        .../* @__PURE__ */ new Set([...n.config.deletedIds, ...o])
      ].filter((s) => !i.some((c) => c.id === s))
    }), i;
  });
}
function Vo(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, r]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(r)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Rd(e, t) {
  const n = Sa.get(e);
  if (!n) return null;
  const r = localStorage.getItem(`${e}:progress:${t}`), i = r ? Vo(r) : null;
  if (!n.readable) return i;
  const o = (await Qa($i)).find(
    (c) => c.name === t
  ), s = o ? Vo(o.uiOptions) : null;
  return i && (!s || i.updatedAt > s.updatedAt) ? i : s;
}
function Od(e, t, n) {
  const r = `${e}:progress:${t}`;
  try {
    localStorage.setItem(r, JSON.stringify(n));
  } catch {
  }
  return so(r, async () => {
    const i = Sa.get(e);
    if (!(i != null && i.writable)) return;
    await Ys(i);
    const o = (await Qa($i)).find(
      (s) => s.name === t
    );
    await ge(
      o ? `/api/savedfilters/${o.id}` : "/api/savedfilters",
      {
        method: o ? "PUT" : "POST",
        body: JSON.stringify({
          mode: $i,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function lr(e) {
  return e === "audio" ? "audios" : "videos";
}
const Md = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function Kn(e) {
  return Md[e];
}
const Wa = "confirmed_absent_tags", co = "Confirmed absent tags", ii = "confirmed_absent_occurrence_tags", Zs = {
  key: Wa,
  label: co,
  type: "tag",
  subject: "tag assessments"
}, lo = {
  key: ii,
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
function Bn(e) {
  return Array.isArray(e) ? e.map(Bn) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? Fd[n] ?? n : t === "key" && typeof n == "string" && [
        Wa,
        ii
      ].includes(n.toLowerCase()) ? n.toLowerCase() : Bn(n)
    ])
  ) : e;
}
async function ec(e, t, n) {
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
async function ge(e, t = {}) {
  return await ec(e, t, "fail");
}
function xd(e, t = {}) {
  return ec(e, t, "null");
}
const Pd = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Ld = 0;
function Ya(e, t) {
  return ge(
    `/api/${lr(e)}/${t}?dqRead=${Pd}-${++Ld}`,
    { cache: "no-store" }
  );
}
function tc(e, t) {
  const n = { ...e.view.objectFilter }, r = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    Bn({
      findFilter: Wt(t, De(e)),
      objectFilter: n,
      filterExpression: r
    })
  );
}
async function Kr(e, t, n) {
  return ge(
    `/api/${lr(De(e))}/find`,
    { method: "POST", signal: n, body: tc(e, t) }
  );
}
async function nc(e, t, n) {
  return (await ge(
    `/api/${lr(De(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: tc(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function bi(e, t, n) {
  const r = { ...e.view.objectFilter };
  return delete r._filterExpression, ge("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      Bn({
        findFilter: Wt(t),
        objectFilter: r
      })
    )
  });
}
function Dd(e) {
  return ge("/api/taggroups", { signal: e });
}
function Oi(e, t, n = 1280) {
  return `/api/${lr(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function Mi(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function zo(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function _d(e) {
  return `/api/stream/video/${e}/preview`;
}
function jd(e) {
  return `/api/stream/video/${e}/preview/status`;
}
async function oi(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) {
    await ge(`/api/tags/${r}`, { signal: t }), n.add(r);
    for (let i = 1; ; i++) {
      const o = await ge("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Bn({
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
async function uo(e, t) {
  const n = cr(e);
  return (await Promise.all(
    e.steps.map(
      async (i) => i.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await oi(i.tagIds, t)).filter(
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
async function fo(e, t) {
  const r = (await ge("/api/custom-fields")).find(
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
    message: `Add ${Kn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: r
  };
}
async function rc(e, t) {
  const n = await fo(e, t);
  if (n.kind !== "ready") {
    if (n.kind === "incompatible") throw new Error(n.message);
    if (n.definition) {
      await ge(`/api/custom-fields/${n.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...n.definition.entityTypes, t])]
        })
      });
      return;
    }
    await ge("/api/custom-fields", {
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
function ac(e = "video") {
  return fo(Zs, e);
}
function Bd(e = "video") {
  return rc(Zs, e);
}
function ic(e = "video") {
  return fo(lo, e);
}
function Kd(e = "video") {
  return rc(lo, e);
}
function Xa(e) {
  return [...new Set(e)];
}
function oc(e, t) {
  const n = e.customFields ?? {}, r = Object.keys(n).find(
    (o) => o.toLowerCase() === ii
  ), i = r === void 0 ? [] : n[r];
  return Xa(
    (Array.isArray(i) ? i : []).filter(
      (o) => typeof o == "string" && /^[1-9]\d*:[1-9]\d*$/.test(o)
    ).map((o) => o.split(":").map(Number)).filter(([o]) => o === t).map(([, o]) => o)
  );
}
async function Gd(e) {
  let t;
  try {
    t = await ic(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${lo.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function Vd(e, t, n, r, i, o) {
  await ge(`/api/${lr(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: Xa(i).map((s) => `${r}:${s}`)
      },
      customFieldMode: o
    })
  });
}
function zd(e, t, n) {
  const r = [...e.tagIds], i = (o) => {
    if (n === null)
      throw new Error(
        `The ${co} custom field is not available.`
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
async function sc(e, t, n) {
  if (!Un(t) || n.length === 0 || n.some((d) => !Number.isSafeInteger(d) || d <= 0))
    throw new Error(
      `Choose ${Kn(e).many} and configure a valid action first.`
    );
  let r = null;
  if (ir(t)) {
    let d;
    try {
      d = await ac(e);
    } catch (f) {
      throw new Error(
        `Could not verify the ${co} custom field. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
    if (d.kind !== "ready") throw new Error(d.message);
    r = d.definition.key;
  }
  const i = Xa(n), o = (await uo(t)).map((d) => ({
    mode: d.mode,
    tagIds: Xa(d.tagIds)
  })), c = [
    ...o.filter((d) => !_n(d.mode)),
    ...o.filter((d) => _n(d.mode))
  ].map(
    (d) => zd(d, i, r)
  );
  for (let d = 0; d < c.length; d++)
    try {
      await ge(`/api/${lr(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(c[d])
      });
    } catch (f) {
      throw new Error(
        // Cove applies a bulk step whole or not at all, so only earlier steps can have been saved.
        `${d ? `${d} of ${c.length} steps were saved before step ${d + 1} failed.` : "Nothing was saved."} ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
}
async function Jd(e, t) {
  if (!Un(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await ge("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const ja = (e) => e >= "0" && e <= "9";
function Jo(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function Ho(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let n = 0, r = 0;
  for (; n < e.length && r < t.length; ) {
    if (ja(e[n]) && ja(t[r])) {
      const c = n, d = r;
      for (; n < e.length && ja(e[n]); ) n++;
      for (; r < t.length && ja(t[r]); ) r++;
      const f = e.slice(c, n).replace(/^0+/, ""), l = t.slice(d, r).replace(/^0+/, "");
      if (f.length !== l.length) return f.length < l.length ? -1 : 1;
      if (f !== l) return f < l ? -1 : 1;
      continue;
    }
    const o = Jo(e[n]), s = Jo(t[r]);
    if (o !== s) return o < s ? -1 : 1;
    n++, r++;
  }
  const i = e.length - n - (t.length - r);
  return i !== 0 ? i < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function cc(e, t) {
  const n = (i) => i.tagGroupId != null ? 0 : 1, r = (i) => i.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(r(e) - r(t)) || Ho(e.tagGroupName, t.tagGroupName) || Ho(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function Cr(e) {
  return [...e].sort(cc);
}
const Fi = /* @__PURE__ */ new Map();
function Hd(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const r of n.steps)
        r.mode === "REMOVE_TREE" && r.tagIds.forEach((i) => t.add(i));
  return [...t];
}
function po(e, t, n) {
  const r = cr(e), i = [], o = [];
  for (const h of e.steps) {
    if (h.mode !== "REMOVE_TREE") {
      o.push(h);
      continue;
    }
    const g = h.tagIds.flatMap((y) => {
      const N = n.get(y);
      return N || i.push(y), N ?? [y];
    });
    o.push({ mode: "REMOVE", tagIds: g.filter((y) => !r.has(y)) });
  }
  const s = [
    ...o.filter((h) => !_n(h.mode)),
    ...o.filter((h) => _n(h.mode))
  ], c = new Set(t.ids), d = new Set(t.absent);
  for (const h of s)
    for (const g of h.tagIds)
      switch (h.mode) {
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
  const f = new Set(t.ids), l = new Set(t.absent), m = [...new Set(e.steps.flatMap((h) => h.tagIds))];
  return {
    added: m.filter((h) => c.has(h) && !f.has(h)),
    removed: [...f].filter((h) => !c.has(h)),
    markedAbsent: m.filter((h) => d.has(h) && !l.has(h)),
    absenceCleared: [...l].filter((h) => !d.has(h)),
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
  return Cr(t);
}
function lc(e) {
  return dc(Hd(e));
}
function dc(e) {
  const t = [...new Set(e)].sort((s, c) => s - c).join(","), [n, r] = T(() => /* @__PURE__ */ new Map()), i = $(/* @__PURE__ */ new Set()), o = $(!0);
  return ee(() => (o.current = !0, () => {
    o.current = !1;
  }), []), ee(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const c of s)
      i.current.has(c) || (i.current.add(c), oi([c]).then(
        (d) => {
          o.current && r((f) => new Map(f).set(c, d));
        },
        () => {
          i.current.delete(c);
        }
      ));
  }, [t]), n;
}
function Nt(e) {
  return (e ?? "").trim().toLocaleLowerCase();
}
function Ir(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n, r) => {
    const i = Nt(n.group);
    if (!i) return;
    const o = t.get(i);
    o ? o.actions.push(r) : t.set(i, { key: i, name: n.group.trim(), actions: [r] });
  }), [...t.values()];
}
function Qo(e) {
  return e.stayUntilGroupsAnswered === !0 && e.actions.some((t) => Nt(t.group) !== "");
}
function uc(e) {
  return new Set(
    e.applications ? e.applications.map((t) => t.tag.id) : e.ids
  );
}
function fc(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "MARK_ABSENT").flatMap((t) => t.tagIds)
  );
}
function pc(e) {
  return cr(e).size > 0 || fc(e).size > 0;
}
function Wd(e) {
  return Ir(e).filter(
    (t) => !t.actions.some((n) => pc(e[n]))
  );
}
function xi(e, t) {
  const n = uc(t), r = new Set(t.absent);
  return Ir(e).map((i) => {
    const o = [], s = [];
    for (const c of i.actions) {
      const d = [...cr(e[c])], f = [...fc(e[c])], l = [
        ...d.map((m) => n.has(m)),
        ...f.map((m) => r.has(m))
      ];
      l.some(Boolean) && (s.push(c), l.every(Boolean) && o.push(c));
    }
    return { ...i, answers: o.length ? o : s };
  });
}
function Pi(e) {
  return e.filter((t) => t.answers.length === 0);
}
function Yd(e, t, n) {
  const r = { ids: [...uc(t)], absent: t.absent }, i = po(e, r, n), o = new Set(i.removed), s = new Set(i.absenceCleared);
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
function kr(e, t) {
  const n = new Set(Xd(e));
  return t.filter((r) => n.has(r.id));
}
function Wo(e, t, n) {
  const r = /* @__PURE__ */ new Map(), i = (s, c) => {
    const d = r.get(s) ?? c();
    return r.set(s, d), d;
  };
  for (const s of kr(e, t))
    for (const c of e) {
      if (c.tagId !== s.id) continue;
      const d = c.categoryTagId === void 0 ? i(Gr, () => ({
        key: Gr,
        name: "",
        tagIds: null,
        flags: [],
        mixed: []
      })) : i(`tag:${c.categoryTagId}`, () => {
        const { name: f, tagIds: l, resolved: m } = n(c.categoryTagId);
        return {
          key: `tag:${c.categoryTagId}`,
          name: f,
          tagIds: l,
          flags: [],
          mixed: [],
          ...m ? {} : { unresolved: !0 }
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
function Li(e, t, n) {
  return e !== n.key && e.startsWith("tag:") && n.members.every((r) => t.includes(r));
}
function ho(e) {
  const t = e.flatMap((i) => i.mixed), n = (i, o) => t.some(
    (s, c) => Li(s.key, s.members, i) && !(c > o && Li(i.key, i.members, s))
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
    (n) => n.key === e.key || Li(n.key, n.tagIds ?? [], e)
  );
}
function hc(...e) {
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
function mc(e, t, n) {
  if (t.tagIds === null) return !0;
  const r = tu(e, n);
  return t.tagIds.some((i) => r.has(i));
}
function nu(e, t, n) {
  return t.filter(
    (r) => r.tagIds === null || r.unresolved && e.length > 0 || e.some((i) => mc(i, r, n))
  );
}
function ru(e, t, n) {
  return t.filter((r) => r.tagIds !== null && mc(e, r, n));
}
function au(e) {
  return `Mixed: ${e.map((t) => `${t.name} ${t.count.toLocaleString()}`).join(" · ")}`;
}
function mo(e) {
  return [
    ...e.flags.length ? [`Flagged: ${e.flags.join(", ")}`] : [],
    ...e.mixed.length ? [au(e.mixed)] : []
  ];
}
function iu(e) {
  const t = mo(e).join("; ");
  return e.tagIds === null ? t : `${e.name} (${t})`;
}
function ou(e, t, n) {
  const r = kr(e, t).map((i) => {
    const o = e.filter((c) => c.tagId === i.id);
    if (o.every((c) => c.categoryTagId === void 0)) return i.name;
    const s = o.map(
      (c) => c.categoryTagId === void 0 ? "whole review" : n(c.categoryTagId)
    );
    return `${i.name} (affects ${[...new Set(s)].join(", ")})`;
  });
  return r.length ? `Flagged: ${r.join(", ")}` : "";
}
const Di = "-", Yo = "Ctrl+a", su = "Ctrl/⌘A", cu = ["f", "g", "k", "n", "m", ",", "."], yi = "Shift+", gc = {
  ",": [";", "<"],
  ".": [":", ">"]
}, lu = new Set(Object.values(gc).flat()), Xo = { Comma: ",", Period: "." };
function du(e) {
  const t = typeof window > "u" ? void 0 : window.event;
  if (!(!(t instanceof KeyboardEvent) || t.type !== "keydown" || e && t.target !== e.target || !t.shiftKey))
    return Object.hasOwn(Xo, t.code) ? Xo[t.code] : void 0;
}
function Wr(e) {
  return we(() => zs(e), [e]);
}
function go({
  surface: e,
  enabled: t,
  actions: n,
  onAction: r,
  onFind: i,
  onSelectAll: o
}) {
  const s = Wr(n), c = $({ keyMap: s, onAction: r, onFind: i, onSelectAll: o });
  Ct(() => {
    c.current = { keyMap: s, onAction: r, onFind: i, onSelectAll: o };
  });
  const d = !!i && n.length > 0, f = e === "local" && !!o, l = rr.filter(
    (h) => s.actionOn.has(h) || cu.includes(h)
  ).join(" "), m = we(() => {
    const h = (N, v) => {
      var E, O;
      const w = c.current;
      if (N === Yo) (E = w.onSelectAll) == null || E.call(w);
      else if (N === Di) (O = w.onFind) == null || O.call(w);
      else {
        const F = lu.has(N), B = F || N.startsWith(yi), C = F ? du(v) : B ? N.slice(yi.length) : N, L = C === void 0 ? void 0 : w.keyMap.actionOn.get(C);
        L !== void 0 && w.onAction(L, B);
      }
    }, g = (N, v = e) => ({
      keys: N,
      surface: v,
      action: (w) => {
        w != null && w.repeat || h((w == null ? void 0 : w.sequence) ?? N, w);
      }
    }), y = [];
    f && y.push(g(Yo, "local")), d && y.push(g(Di));
    for (const N of l ? l.split(" ") : []) {
      const v = gc[N];
      y.push(g(N), ...(v ?? [`${yi}${N}`]).map((w) => g(w)));
    }
    return y;
  }, [e, l, d, f]);
  xl(m, t);
}
const uu = {
  find: Di,
  selectAll: su
};
function bo() {
  return uu;
}
const fu = 600 * 1e3, yo = /* @__PURE__ */ new Map(), bc = /* @__PURE__ */ new Map(), tr = /* @__PURE__ */ new Map();
function yc(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = bc.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function wc(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && bc.set(e.tagGroupId, e.tagGroupSortOrder), yo.set(e.id, { tag: e, at: Date.now() });
}
function vc(e) {
  const t = yo.get(e);
  if (!(!t || Date.now() - t.at > fu))
    return yc(t.tag);
}
function Nc(e) {
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
function _i(e) {
  var t;
  for (const n of e) {
    const r = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && r && wc(Nc({ ...n, name: r }));
  }
}
function pu(e) {
  const t = tr.get(e);
  if (t) return t;
  const n = new AbortController(), r = {
    controller: n,
    waiters: 0,
    promise: ge(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (i) => {
        var l, m;
        const o = ((l = i == null ? void 0 : i.name) == null ? void 0 : l.trim()) || null;
        if (tr.get(e) === r && tr.delete(e), !o) return null;
        const s = Nc({ ...i, id: e, name: o }), c = (m = yo.get(e)) == null ? void 0 : m.tag, d = (c == null ? void 0 : c.tagGroupId) === s.tagGroupId, f = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (d ? c == null ? void 0 : c.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (c == null ? void 0 : c.hasImage),
          imagePath: s.imagePath ?? (c == null ? void 0 : c.imagePath)
        };
        return wc(f), yc(f);
      },
      () => (tr.get(e) === r && tr.delete(e), null)
    )
  };
  return tr.set(e, r), r;
}
function Zo() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function wi(e) {
  const t = {};
  for (const n of e) {
    const r = vc(n);
    r !== void 0 && (t[n] = r);
  }
  return t;
}
function hu(e, t) {
  if (t != null && t.aborted) return Promise.reject(Zo());
  const n = {}, r = [];
  for (const i of new Set(e)) {
    const o = vc(i);
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
        l.waiters -= 1, l.waiters === 0 && tr.get(f) === l && (tr.delete(f), l.controller.abort());
    }, d = () => {
      s || (s = !0, c(), o(Zo()));
    };
    t == null || t.addEventListener("abort", d, { once: !0 }), Promise.all(
      r.map(
        ({ id: f, entry: l }) => l.promise.then((m) => [f, m])
      )
    ).then((f) => {
      if (!s) {
        s = !0, t == null || t.removeEventListener("abort", d), c();
        for (const [l, m] of f) n[l] = m;
        i(n);
      }
    });
  }) : Promise.resolve(n);
}
function qc(e) {
  const t = {};
  for (const [n, r] of Object.entries(e)) t[Number(n)] = (r == null ? void 0 : r.name) ?? null;
  return t;
}
function ka(e) {
  const t = [...new Set(e)].sort((i, o) => i - o).join(","), [n, r] = T(() => ({
    key: t,
    tags: wi(vi(t))
  }));
  return ee(() => {
    const i = vi(t), o = wi(i);
    if (r({ key: t, tags: o }), i.every((c) => c in o)) return;
    const s = new AbortController();
    return hu(i, s.signal).then(
      (c) => r({ key: t, tags: c }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : wi(vi(t));
}
function Yr(e) {
  const t = ka(e);
  return we(() => qc(t), [t]);
}
function vi(e) {
  return e ? e.split(",").map(Number) : [];
}
const mu = "(max-width: 760px)";
function Sc(e) {
  const [t] = T(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = In(
    (r) => (t == null || t.addEventListener("change", r), () => t == null ? void 0 : t.removeEventListener("change", r)),
    [t]
  );
  return Wi(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function Ea() {
  return Sc(mu);
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
  const i = cr(e), o = (s) => i.has(s) || [...i].some((c) => {
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
function si(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function wo({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: r,
  canStay: i = !0,
  tapStays: o = !1,
  onApply: s,
  onClose: c
}) {
  const d = Ea(), [f, l] = T(""), [m, h] = T(0), g = $(null), y = $(null), N = $(null), v = $(null), w = $(null), E = $(/* @__PURE__ */ new Set()), O = rt(), F = Yr(we(() => si(e), [e])), B = Wr(e), C = we(() => {
    const _ = f.trim().toLocaleLowerCase(), V = (M) => M ? rr.indexOf(M) : rr.length;
    return e.map((M, D) => ({ action: M, index: D, key: B.keys[D] })).sort((M, D) => V(M.key) - V(D.key)).filter((M) => !_ || M.action.label.toLocaleLowerCase().includes(_));
  }, [e, B, f]), L = C.length ? Math.min(m, C.length - 1) : -1, x = (_) => `${O}-option-${_}`;
  Ct(() => {
    var _, V, M;
    return v.current = document.activeElement, w.current = ((V = (_ = N.current) == null ? void 0 : _.parentElement) == null ? void 0 : V.closest('[role="dialog"]')) ?? null, (M = g.current) == null || M.focus({ preventScroll: !0 }), () => {
      var P;
      const D = v.current;
      D instanceof HTMLElement && D.isConnected && D.focus({ preventScroll: !0 }), document.activeElement !== D && ((P = w.current) != null && P.isConnected) && w.current.focus({ preventScroll: !0 });
    };
  }, []), ee(() => {
    var _, V, M;
    L < 0 || (M = (V = (_ = y.current) == null ? void 0 : _.querySelector(`[id="${x(C[L].index)}"]`)) == null ? void 0 : V.scrollIntoView) == null || M.call(V, { block: "nearest" });
  }, [L, C]);
  function re(_, V) {
    !_ || r != null && r(_.action) || s(_.action, i && V);
  }
  function Q(_) {
    var M;
    _.stopPropagation();
    const V = _.code || _.key;
    if (_.repeat || E.current.add(V), !ln(_)) {
      if (_.repeat && !E.current.has(V)) {
        _.preventDefault();
        return;
      }
      if (_.key === "Escape")
        _.preventDefault(), _.repeat || c();
      else if (_.key === "Enter")
        _.preventDefault(), _.repeat || re(C[L], _.shiftKey);
      else if (_.key === "ArrowDown" || _.key === "ArrowUp") {
        if (_.preventDefault(), !C.length) return;
        const D = _.key === "ArrowDown" ? 1 : -1;
        h((L + D + C.length) % C.length);
      } else _.key === "Tab" && (_.preventDefault(), (M = g.current) == null || M.focus());
    }
  }
  return /* @__PURE__ */ u(he, { children: [
    /* @__PURE__ */ a("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: c }),
    /* @__PURE__ */ u(
      "div",
      {
        ref: N,
        role: "dialog",
        "aria-label": "Find an action",
        className: `dq-find-action${d ? " dq-find-mobile" : ""}`,
        onKeyDown: Q,
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
                  l(_.target.value), h(0);
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
                  onClick: (M) => re(_, M.shiftKey || o && Js(_.action)),
                  children: [
                    d ? null : _.key ? /* @__PURE__ */ u(he, { children: [
                      /* @__PURE__ */ a("kbd", { "aria-hidden": ua(_.key) ? !0 : void 0, children: _.key }),
                      ua(_.key) && /* @__PURE__ */ u(he, { children: [
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
function kc() {
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
function vo(e) {
  return Wi(e.subscribe, e.get, e.get);
}
function Ec(e, t) {
  const n = $(t);
  Ct(() => {
    n.current !== t && (n.current = t, e.set(null));
  }, [e, t]);
}
function Ac(e, t) {
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
const bu = [], ji = ai.map(
  (e, t) => ({ indent: t, keys: e })
), es = ji.length - 1;
function qt({ binding: e, hidden: t }) {
  const n = t ? void 0 : ua(e), r = /* @__PURE__ */ a(
    "kbd",
    {
      className: Array.from(e).length === 1 ? "dq-key dq-key-letter" : "dq-key",
      "aria-hidden": t || n ? !0 : void 0,
      children: e
    }
  );
  return n ? /* @__PURE__ */ u(he, { children: [
    r,
    /* @__PURE__ */ a("span", { className: "dq-sr-only", children: n })
  ] }) : r;
}
function Ua(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function Cc(e) {
  return ai.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
    (t) => t.length > 0
  );
}
function Tc({
  groups: e,
  renderAction: t,
  find: n
}) {
  const r = e.length ? e : [[]];
  return /* @__PURE__ */ a(he, { children: r.map((i, o) => /* @__PURE__ */ u("div", { className: "dq-mobile-group", children: [
    i.map(t),
    o === r.length - 1 && n
  ] }, o)) });
}
function Ic({
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
                /* @__PURE__ */ a(jn, { "aria-hidden": "true" }),
                /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
                  ", needs attention: ",
                  d
                ] })
              ] }),
              s === "answered" && /* @__PURE__ */ u(he, { children: [
                /* @__PURE__ */ a(Qr, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", answered:" }),
                " ",
                /* @__PURE__ */ a("span", { className: "dq-group-answer", children: c })
              ] }),
              s === "open" && /* @__PURE__ */ u(he, { children: [
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
  attention: m = bu,
  stayOnTap: h = !1,
  onStayOnTapChange: g
}) {
  const y = bo(), N = Wr(e), v = Ea();
  Ec(o, v);
  const w = rt(), E = Yr(
    we(() => e.flatMap((S) => S.steps.flatMap((ce) => ce.tagIds)), [e])
  ), O = ji.filter((S) => S.keys.some((ce) => N.actionOn.has(ce))), F = O.includes(ji[es]), B = e.length - N.actionOn.size, C = we(
    () => l && !f ? Ir(e) : [],
    [l, f, e]
  ), L = we(
    () => C.length && r ? xi(e, r) : null,
    [C, e, r]
  ), x = new Map(
    Pi(L ?? []).flatMap(
      (S) => S.actions.filter((ce) => pc(e[ce])).map((ce) => [ce, S.name])
    )
  ), re = we(
    () => e.map((S) => f ? [] : ru(S, m, i)),
    [e, m, i, f]
  ), Q = (S) => S.map(iu).join("; "), _ = re.map(Q), V = C.length > 0 && /* @__PURE__ */ a(
    yu,
    {
      groups: C,
      statuses: L,
      actions: e,
      attentionOf: (S) => Q([
        ...new Map(
          S.actions.flatMap((ce) => re[ce]).map((ce) => [ce.key, ce])
        ).values()
      ])
    }
  ), M = (S) => {
    const ce = Rr(e[S], E, [], i).map((le) => le.text).join(", "), A = x.get(S), Z = _[S];
    return [
      ce,
      A === void 0 ? "" : `${A}: not answered yet`,
      Z ? `Needs attention: ${Z}` : ""
    ].filter(Boolean).join(". ");
  }, D = (S) => _[S] ? (
    // The tile's description says it; the mark is for the eye, with the reasons on hover.
    /* @__PURE__ */ a(
      "span",
      {
        className: "dq-pad-flag",
        "aria-hidden": "true",
        title: `Needs attention: ${_[S]}`,
        children: /* @__PURE__ */ a(jn, {})
      }
    )
  ) : null, P = (S) => ({
    onMouseEnter: () => o.set(S),
    onMouseLeave: () => o.clear(S),
    onFocus: () => o.set(S),
    onBlur: () => o.clear(S)
  }), X = (S) => {
    const ce = N.actionOn.get(S), A = ce === void 0 ? void 0 : e[ce];
    if (!A)
      return /* @__PURE__ */ a(
        "div",
        {
          className: "dq-pad-slot dq-pad-free",
          "aria-hidden": "true",
          title: "No action on this key: it does nothing here",
          children: /* @__PURE__ */ a(qt, { binding: S, hidden: !0 })
        },
        S
      );
    const Z = t(A), le = `${w}-effect-${S}`;
    return /* @__PURE__ */ u("div", { className: "dq-pad-slot", ...f ? {} : P(A), children: [
      /* @__PURE__ */ a("span", { id: le, className: "dq-sr-only", children: M(ce) }),
      /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: A.label,
          "aria-keyshortcuts": S,
          "aria-describedby": le,
          "data-group-open": x.has(ce) || void 0,
          "data-attention": _[ce] ? !0 : void 0,
          disabled: Z,
          onClick: (fe) => s(A, fe.shiftKey),
          children: [
            /* @__PURE__ */ a(qt, { binding: S }),
            " ",
            /* @__PURE__ */ a("span", { className: "dq-pad-label", children: A.label }),
            Ua(A) && " ",
            Ua(A) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(Ha, { "aria-hidden": "true" }),
              "absent"
            ] }),
            D(ce)
          ]
        }
      )
    ] }, S);
  }, Y = /* @__PURE__ */ u("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ a(Jr, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (v) {
    const S = Cc(N), ce = (A) => {
      const Z = e[A], le = N.keys[A];
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: Z.label,
          "aria-keyshortcuts": le,
          "aria-describedby": `${w}-effect-${le}`,
          "data-group-open": x.has(A) || void 0,
          "data-attention": _[A] ? !0 : void 0,
          disabled: t(Z),
          onClick: (fe) => {
            o.clear(Z), s(Z, fe.shiftKey || h && Js(Z));
          },
          ...f ? {} : Ac(o, Z),
          children: [
            /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: Z.label }),
            Ua(Z) && " ",
            Ua(Z) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(Ha, { "aria-hidden": "true" }),
              "absent"
            ] }),
            D(A)
          ]
        },
        le
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
            f ? Y : /* @__PURE__ */ a(
              ts,
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
            g && /* @__PURE__ */ a(wu, { checked: h, onChange: g })
          ] }),
          V,
          /* @__PURE__ */ a("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ a(
            Tc,
            {
              groups: S,
              renderAction: ce,
              find: /* @__PURE__ */ a(
                Ic,
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
  ] }), W = !F && /* @__PURE__ */ u(
    "button",
    {
      type: "button",
      className: "dq-pad-find-button",
      "aria-label": B ? `Find action, ${B} more` : "Find action",
      "aria-keyshortcuts": y.find,
      disabled: d,
      onClick: c,
      children: [
        /* @__PURE__ */ a(qt, { binding: y.find }),
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
          f ? Y : /* @__PURE__ */ a(
            ts,
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
              W
            ] })
          ) : /* @__PURE__ */ u(he, { children: [
            !f && oe,
            W
          ] })
        ] }),
        O.map((S) => /* @__PURE__ */ u("div", { className: "dq-pad-row", "data-indent": S.indent, children: [
          S.keys.map(X),
          S.indent === es && /* @__PURE__ */ a("div", { className: "dq-pad-slot", children: /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": B ? `Find action, ${B} more` : "Find action",
              "aria-keyshortcuts": y.find,
              disabled: d,
              onClick: c,
              children: [
                /* @__PURE__ */ a(qt, { binding: y.find }),
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
function ts({
  actions: e,
  keyMap: t,
  names: n,
  tags: r,
  trees: i,
  preview: o,
  findKey: s,
  mobile: c = !1
}) {
  const d = vo(o), f = d ? e.indexOf(d) : -1;
  if (!d || f < 0) {
    const g = t.actionOn.size;
    return /* @__PURE__ */ u("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      !c && g < e.length && /* @__PURE__ */ u(he, { children: [
        ` · ${g} on keys, ${e.length - g} more under `,
        /* @__PURE__ */ a(qt, { binding: s })
      ] })
    ] });
  }
  const l = t.keys[f], m = r && d.steps.length ? po(d, r, i) : null, h = m && !m.unresolvedTrees.length && ![m.added, m.removed, m.markedAbsent, m.absenceCleared].some(
    (g) => g.length
  );
  return /* @__PURE__ */ u("p", { className: "dq-pad-effect", children: [
    l && !c && /* @__PURE__ */ a(qt, { binding: l }),
    /* @__PURE__ */ a("strong", { children: d.label }),
    Rr(d, n, [], i).map((g, y) => /* @__PURE__ */ a("span", { "data-effect-tone": g.tone, children: g.text }, y)),
    h && /* @__PURE__ */ a("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function $c({
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
  status: m,
  className: h = "",
  paused: g = !1
}) {
  const y = bo(), N = Wr(e), v = Ea(), w = rt(), E = Yr(we(() => si(e), [e])), [O] = T(() => kc());
  Ec(O, v);
  const F = $(null), B = Nu(F, e, !v), C = Cc(N);
  !C.length && e.length && C.push([]);
  const L = C.flat(), x = e.length - L.length, re = (M) => Rr(M, E, t, n).map((D) => D.text).join(", "), Q = (M) => ({
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
        ...g ? {} : Ac(O, D),
        children: /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: D.label })
      },
      D.id
    );
  };
  return /* @__PURE__ */ u(
    "section",
    {
      ref: F,
      className: `dq-action-bar${v ? " dq-bar-mobile" : B ? " dq-bar-stacked" : ""}${i ? " dq-bar-busy" : ""}${g ? " dq-bar-paused" : ""}${h ? ` ${h}` : ""}`,
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
                Tc,
                {
                  groups: C,
                  renderAction: V,
                  find: /* @__PURE__ */ a(
                    Ic,
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
                  const X = e[P], Y = N.keys[P];
                  return /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: X.label,
                      "aria-keyshortcuts": Y || void 0,
                      "aria-describedby": `${w}-effect-${P}`,
                      disabled: g || r(X),
                      onClick: () => o(X),
                      ...g ? {} : Q(X),
                      children: [
                        Y && /* @__PURE__ */ a(qt, { binding: Y }),
                        " ",
                        /* @__PURE__ */ a("span", { className: "dq-bar-label", children: X.label })
                      ]
                    },
                    X.id
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
                      /* @__PURE__ */ a(qt, { binding: y.find, hidden: !0 }),
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
        /* @__PURE__ */ a("div", { hidden: !0, children: L.map((M) => /* @__PURE__ */ a("span", { id: `${w}-effect-${M}`, children: re(e[M]) }, e[M].id)) }),
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: m })
      ]
    }
  );
}
function Nu(e, t, n) {
  const [r, i] = T(!1);
  return Ct(() => {
    var l;
    const o = e.current;
    if (!o || !n || typeof ResizeObserver > "u") return;
    const s = o.querySelector(".dq-bar-summary"), c = () => {
      const m = getComputedStyle(o), h = parseFloat(m.columnGap) || 0, g = o.clientWidth - (parseFloat(m.paddingLeft) || 0) - (parseFloat(m.paddingRight) || 0), y = [...o.querySelectorAll(".dq-bar-line")].map(
        (L) => [...L.children].map((x) => x.offsetWidth)
      ), N = o.querySelector(".dq-bar-line"), v = N && parseFloat(getComputedStyle(N).columnGap) || 0, w = o.querySelector(".dq-bar-hints"), E = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (w ? w.offsetWidth + h : 0) + 1 + // the divider
      2 * h, O = (L) => y.map((x) => {
        let re = 1, Q = 0;
        for (const _ of x)
          Q > 0 && Q + v + _ > L ? (re += 1, Q = _) : Q += (Q > 0 ? v : 0) + _;
        return re;
      }), F = (L) => Math.max(1, L.reduce((x, re) => x + re, 0)), B = O(g), C = F(O(g - E));
      i(
        1 + F(B) < C || 1 + F(B) === C && B.every((L) => L === 1)
      );
    }, d = new ResizeObserver(c);
    d.observe(o);
    for (const m of o.querySelectorAll(".dq-bar-summary, .dq-bar-tiles, .dq-bar-hints"))
      d.observe(m);
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
  const c = vo(n), d = c ? e.indexOf(c) : -1;
  if (!c || d < 0) return null;
  const f = t.keys[d];
  return /* @__PURE__ */ u("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    f && s && /* @__PURE__ */ a(qt, { binding: f }),
    /* @__PURE__ */ a("strong", { children: c.label }),
    Rr(c, r, i, o).map((l, m) => /* @__PURE__ */ a("span", { "data-effect-tone": l.tone, children: l.text }, m))
  ] });
}
const ns = 1e3;
async function Su(e, t, n) {
  const r = await ge(
    `/api/tags/${t}`,
    { signal: n }
  ), i = /* @__PURE__ */ new Map();
  for (let d = 1; ; d++) {
    const f = await ge(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          Bn({
            findFilter: {
              page: d,
              perPage: ns,
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
    if (d * ns >= f.totalCount) break;
    if (!f.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const o = [...i.values()], s = De(e), c = Ce(e) ? await Eu(
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
    Bn({
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
            r[c] = (await ge(
              `/api/${lr(e)}/aggregate`,
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
    for (const r of cr(n))
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
function $u(e, t) {
  var r;
  const n = Nt(e);
  return ((r = Ir(t).find((i) => i.key === n)) == null ? void 0 : r.name) ?? e.trim();
}
const Ru = (e) => e instanceof Error ? e.message : "Request failed.";
function Ou({
  id: e,
  review: t,
  disabled: n,
  onAdd: r,
  onCancel: i
}) {
  const [o, s] = T([]), [c, d] = T({}), [f, l] = T({}), [m, h] = T({}), g = $(/* @__PURE__ */ new Map());
  ee(
    () => () => {
      for (const M of g.current.values()) M.abort();
    },
    []
  );
  const y = Kn(De(t)), N = Ce(t), v = N ? "performer" : y.one;
  function w(M) {
    var P;
    (P = g.current.get(M)) == null || P.abort();
    const D = new AbortController();
    g.current.set(M, D), d((X) => ({ ...X, [M]: { status: "loading" } })), Su(t, M, D.signal).then(
      (X) => {
        D.signal.aborted || d((Y) => ({
          ...Y,
          [M]: { status: "ready", group: X }
        }));
      },
      (X) => {
        D.signal.aborted || d((Y) => ({
          ...Y,
          [M]: { status: "failed", message: Ru(X) }
        }));
      }
    );
  }
  function E(M) {
    var oe;
    const D = o.filter((W) => !M.includes(W));
    for (const W of D)
      (oe = g.current.get(W)) == null || oe.abort(), g.current.delete(W);
    const P = (W) => {
      const S = c[W];
      return (S == null ? void 0 : S.status) === "ready" ? S.group.children.map((ce) => ce.id) : [];
    }, X = new Set(M.flatMap(P)), Y = D.flatMap(P).filter((W) => !X.has(W));
    l(
      (W) => Object.fromEntries(
        Object.entries(W).filter(([S]) => !Y.includes(Number(S)))
      )
    ), h(
      (W) => Object.fromEntries(
        Object.entries(W).filter(([S]) => M.includes(Number(S)))
      )
    ), d(
      (W) => Object.fromEntries(
        Object.entries(W).filter(([S]) => M.includes(Number(S)))
      )
    ), s(M);
    for (const W of M) o.includes(W) || w(W);
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
  ), L = Cu(O), x = new Map(O.map((M) => [M.parent.id, M.parent.name])), re = Tu(t.actions), Q = (M) => f[M] ?? !re.has(M), _ = F ? [...C.values()].flatMap((M) => {
    const D = $u(M.parent.name, t.actions);
    return M.children.filter((P) => Q(P.id)).map((P) => ({ child: P, answerGroup: D }));
  }) : [], V = (M, D) => l((P) => ({
    ...P,
    ...Object.fromEntries(M.children.map((X) => [X.id, D]))
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
      or,
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
      const X = P.parent.name;
      return /* @__PURE__ */ u("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ a("legend", { children: X }),
        D.group.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ u(he, { children: [
          /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ a(
              "input",
              {
                type: "checkbox",
                checked: m[M] ?? !1,
                disabled: n,
                onChange: (Y) => h((oe) => ({
                  ...oe,
                  [M]: Y.target.checked
                }))
              }
            ),
            "Only one per ",
            v,
            ": each action removes every other tag in the ",
            X,
            " tree"
          ] }),
          P.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ u(he, { children: [
            /* @__PURE__ */ u("div", { className: "dq-row", children: [
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${X}`,
                  onClick: () => V(P, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${X}`,
                  onClick: () => V(P, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ a("div", { className: "dq-child-tags", children: P.children.map((Y) => {
              const oe = re.get(Y.id) ?? [], W = (L.get(Y.id) ?? []).filter((S) => S !== M).map((S) => `“${x.get(S)}”`);
              return /* @__PURE__ */ u("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ a(
                  "input",
                  {
                    type: "checkbox",
                    checked: Q(Y.id),
                    disabled: n,
                    onChange: (S) => l((ce) => ({
                      ...ce,
                      [Y.id]: S.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ u("span", { children: [
                  Y.name,
                  " ",
                  /* @__PURE__ */ u("small", { children: [
                    Y.uses.toLocaleString(),
                    " ",
                    Y.uses === 1 ? y.one : y.many
                  ] }),
                  W.length > 0 && /* @__PURE__ */ u("small", { children: [
                    " · Also under ",
                    W.join(", ")
                  ] }),
                  oe.length > 0 && /* @__PURE__ */ u("small", { children: [
                    " ",
                    "· Already in “",
                    oe[0].label || "New action",
                    "”",
                    oe.length > 1 ? ` and ${oe.length - 1} more` : ""
                  ] })
                ] })
              ] }, Y.id);
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
                  (P) => m[P]
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
  const i = Nt(n), o = [{ kind: "none", name: "", selected: !i }];
  if (r === null) {
    for (const c of e)
      o.push({ kind: "group", name: c, selected: Nt(c) === i });
    return o;
  }
  const s = Nt(r);
  for (const c of t)
    Nt(c).includes(s) && o.push({ kind: "group", name: c, selected: Nt(c) === i });
  return s && !t.some((c) => Nt(c) === s) && o.push({ kind: "new", name: r.trim(), selected: s === i }), o;
}
function Fu(e) {
  return e.kind === "group" ? `group:${Nt(e.name)}` : e.kind;
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
]), Lu = /* @__PURE__ */ new Set(["Escape", "Enter", "Tab", "ArrowUp", "ArrowDown"]), Ba = 4, rs = 240;
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
  const o = rt(), s = rt(), c = rt(), d = $(null), f = $(null), l = $(null), m = $(null), h = $(null), g = $([]), y = $(!1), N = $(!1), [v, w] = T(!1), [E, O] = T(null), [F, B] = T(null), [C, L] = T(!1), x = e.group ?? "", re = we(
    () => Mu(t, n, x, E),
    [t, n, x, E]
  ), Q = re.map(Fu), _ = F === null ? -1 : Q.indexOf(F), V = (A) => `${s}-option-${A}`, M = (A) => i(A ? { ...e, group: A } : xu(e)), D = () => {
    var Z;
    const A = ((Z = l.current) == null ? void 0 : Z.value) ?? x;
    A.trim() !== A && M(A.trim());
  };
  function P(A) {
    O(null), B(A), w(!0);
  }
  const X = (A) => {
    var Z, le;
    return A instanceof Node && (((Z = d.current) == null ? void 0 : Z.contains(A)) || ((le = m.current) == null ? void 0 : le.contains(A))) === !0;
  };
  function Y() {
    var A, Z;
    (A = m.current) != null && A.contains(document.activeElement) && ((Z = h.current) == null || Z.focus({ preventScroll: !0 })), w(!1), O(null), B(null), L(!1);
  }
  function oe(A) {
    A.kind === "group" && A.selected && E === null || M(A.kind === "none" ? "" : A.name), Y();
  }
  function W() {
    const A = f.current, Z = m.current;
    if (!A || !Z) return;
    const le = A.getBoundingClientRect(), fe = window.visualViewport, G = (fe == null ? void 0 : fe.offsetTop) ?? 0, Ee = (fe ? fe.offsetTop + fe.height : window.innerHeight) - le.bottom - Ba, qe = le.top - G - Ba, be = Math.min(Z.scrollHeight, rs), Je = Ee < be && qe > Ee;
    Z.style.left = `${le.left}px`, Z.style.width = `${le.width}px`, Z.style.top = `${Je ? le.top - Ba : le.bottom + Ba}px`, Z.style.transform = Je ? "translateY(-100%)" : "", Z.style.maxHeight = `${Math.max(0, Math.min(rs, Je ? qe : Ee))}px`, _u(A, Z, le, g.current) || Y();
  }
  Ct(() => {
    var A;
    v && (f.current && (g.current = Du(f.current)), N.current && ((A = m.current) == null || A.focus({ preventScroll: !0 }), L(!0)), N.current = !1);
  }, [v]), Ct(() => {
    v && W();
  }), ee(() => {
    if (!v) return;
    const A = () => W(), Z = (G) => {
      X(G.target) || Y();
    }, le = [...g.current, window], fe = window.visualViewport;
    for (const G of le) G.addEventListener("scroll", A);
    return window.addEventListener("resize", A), fe == null || fe.addEventListener("resize", A), fe == null || fe.addEventListener("scroll", A), document.addEventListener("pointerdown", Z), () => {
      for (const G of le) G.removeEventListener("scroll", A);
      window.removeEventListener("resize", A), fe == null || fe.removeEventListener("resize", A), fe == null || fe.removeEventListener("scroll", A), document.removeEventListener("pointerdown", Z);
    };
  }, [v]), ee(() => {
    var A, Z, le;
    _ >= 0 && ((le = (Z = (A = m.current) == null ? void 0 : A.children[_]) == null ? void 0 : Z.scrollIntoView) == null || le.call(Z, { block: "nearest" }));
  }, [_]);
  function S(A) {
    if (ln(A)) return;
    const Z = A.key === "ArrowDown" || A.key === "ArrowUp";
    if (Z && !v) {
      if (A.altKey && A.key === "ArrowUp") return;
      A.preventDefault(), P(A.altKey ? null : Nt(x) ? `group:${Nt(x)}` : "none");
      return;
    }
    if (v)
      if (Z) {
        if (A.preventDefault(), A.altKey) {
          A.key === "ArrowUp" && Y();
          return;
        }
        const le = A.key === "ArrowDown" ? 1 : -1, fe = E !== null && Nt(E) && Q.length > 1 ? 1 : 0, G = _ < 0 ? le > 0 ? fe : Q.length - 1 : (_ + le + Q.length) % Q.length;
        B(Q[G]);
      } else A.key === "Enter" && (A.preventDefault(), _ >= 0 ? oe(re[_]) : (D(), Y()));
  }
  function ce(A) {
    var le;
    if (A.key === "Tab") {
      Y(), A.shiftKey && ((le = l.current) == null || le.focus());
      return;
    }
    if (A.key === "Dead" || A.key === "Process" || ln(A) && !Lu.has(A.key) || A.key === "Backspace" || A.key === "Delete" || [...A.key].length === 1 && !A.metaKey && (!A.ctrlKey || A.altKey)) {
      const fe = l.current;
      fe && (fe.focus(), fe.setSelectionRange(fe.value.length, fe.value.length));
      return;
    }
    !Pu.has(A.key) && !ln(A) && L(!1), S(A);
  }
  return /* @__PURE__ */ u(
    "div",
    {
      onKeyDown: (A) => {
        !v || A.key !== "Escape" || ln(A) || (A.preventDefault(), A.stopPropagation(), Y());
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
                  Y(), D();
                }
              }
            ),
            /* @__PURE__ */ a(
              "button",
              {
                ref: h,
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
                  var le;
                  const A = y.current;
                  y.current = !1;
                  const Z = document.activeElement === l.current;
                  v ? Y() : (N.current = A && !Z, P(null)), (!A || Z) && ((le = l.current) == null || le.focus());
                },
                children: /* @__PURE__ */ a(Zi, { "aria-hidden": "true" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ a("p", { className: "dq-actions-hint dq-action-field-help", id: c, children: r ? "A group is one question with one answer per item; when a chosen performer's items hold two different answers of a group, Existing answers marks it Mixed." : "A group is one question with one answer per item." }),
        v && cd(
          /* @__PURE__ */ a(
            "ul",
            {
              ref: m,
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
                X(A.relatedTarget) || Y();
              },
              children: re.map((A, Z) => /* @__PURE__ */ u(
                "li",
                {
                  id: V(Z),
                  role: "option",
                  "aria-selected": A.selected,
                  className: "dq-combobox-option",
                  "data-kind": A.kind,
                  "data-active": Z === _ || void 0,
                  onMouseMove: () => {
                    Z !== _ && B(Q[Z]);
                  },
                  onClick: () => oe(A),
                  children: [
                    A.kind === "new" && /* @__PURE__ */ a(wa, { "aria-hidden": "true" }),
                    /* @__PURE__ */ a("span", { className: "dq-combobox-option-name", children: A.kind === "none" ? "No group" : A.kind === "new" ? `New group “${A.name}”` : A.name }),
                    A.selected && /* @__PURE__ */ a(Qr, { className: "dq-combobox-check", "aria-hidden": "true" })
                  ]
                },
                Q[Z]
              ))
            }
          ),
          document.body
        )
      ]
    }
  );
}
const er = [
  ...ai,
  ["auto", ar]
];
function Rc(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : io(e[n]);
}
function Uu({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: i
}) {
  const [o, s] = T(!1), c = $(null), d = n.keys[t], f = Rc(e, n, t), l = Ar(f), m = n.duplicatePins.has(t) ? ` (${ma(e[t].shortcut ?? "")} is pinned twice)` : "", h = d ? `${ma(d)}, ${l ? "pinned" : "Auto"}${m}` : f === ar ? "no key, Find action only" : `no key: Auto found no free key${m}`, g = () => {
    var y;
    s(!1), (y = c.current) == null || y.focus();
  };
  return /* @__PURE__ */ u(he, { children: [
    /* @__PURE__ */ u(
      "button",
      {
        ref: c,
        type: "button",
        className: "dq-key-button",
        "aria-label": `Key for ${r}: ${h}`,
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        title: "Choose the key",
        onClick: () => s(!o),
        children: [
          d ? /* @__PURE__ */ a(qt, { binding: d }) : /* @__PURE__ */ a("span", { className: "dq-key dq-key-none", children: "·" }),
          l && /* @__PURE__ */ a(xs, { "aria-hidden": "true" })
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
  const s = $(null), c = n.keys[t], d = Rc(e, n, t), [f, l] = T(c || "q"), m = (N) => {
    var v;
    return ((v = s.current) == null ? void 0 : v.querySelector(`[data-choice="${N}"]`)) ?? null;
  };
  Ct(() => {
    var N, v, w;
    (N = m(c || d)) == null || N.focus(), (w = (v = s.current) == null ? void 0 : v.scrollIntoView) == null || w.call(v, { block: "nearest" });
  }, []);
  function h(N) {
    var v;
    Ar(N) && l(N), (v = m(N)) == null || v.focus();
  }
  function g(N) {
    var C, L, x;
    if (N.key === "Escape") {
      N.preventDefault(), N.stopPropagation(), o();
      return;
    }
    if (N.key === "Tab") {
      const re = [...((C = s.current) == null ? void 0 : C.querySelectorAll("button[tabindex='0']")) ?? []], Q = re.indexOf(document.activeElement);
      N.preventDefault(), (L = re[(Q + (N.shiftKey ? -1 : 1) + re.length) % re.length]) == null || L.focus();
      return;
    }
    const v = (x = N.target.dataset) == null ? void 0 : x.choice, w = v ? er.findIndex((re) => re.includes(v)) : -1;
    if (!v || w < 0) return;
    const E = er[w].indexOf(v), O = (re) => re == null ? void 0 : re[Math.min(E, re.length - 1)], F = {
      ArrowLeft: er[w][E - 1],
      ArrowRight: er[w][E + 1],
      ArrowUp: O(er[w - 1]),
      ArrowDown: O(er[w + 1]),
      Home: er[w][0],
      End: er[w].at(-1)
    };
    if (!Object.hasOwn(F, N.key)) return;
    N.preventDefault();
    const B = F[N.key];
    B && h(B);
  }
  const y = (N) => {
    const v = Ar(N) ? n.actionOn.get(N) : void 0;
    return v === void 0 ? null : {
      own: v === t,
      label: e[v].label.trim() || "New action",
      pinned: io(e[v]) === N
    };
  };
  return /* @__PURE__ */ u(he, { children: [
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
          /* @__PURE__ */ a("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: ai.map((N, v) => /* @__PURE__ */ a("div", { className: "dq-key-picker-row", "data-indent": v, children: N.map((w) => {
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
                    /* @__PURE__ */ a(qt, { binding: w }),
                    (E == null ? void 0 : E.pinned) && /* @__PURE__ */ a(xs, { "aria-hidden": "true" })
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
                "data-choice": ar,
                tabIndex: 0,
                "aria-pressed": d === ar,
                onClick: () => i(ar),
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
  if (Un(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (oo(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function Oc(e) {
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
  const d = Le(e), f = d !== "tag", l = e.actions, m = Wr(l), h = Yr(we(() => si(l), [l])), g = we(
    () => f ? Ir(l).map((G) => G.name) : [],
    [f, l]
  ), y = l.findIndex((G) => G.id === o), N = we(
    () => f && y >= 0 ? Ir(
      l.filter((G, me) => me !== y)
    ).map((G) => G.name) : [],
    [f, l, y]
  ), v = f && e.stayUntilGroupsAnswered === !0, w = we(
    () => new Set(
      v ? Wd(l).map((G) => G.key) : []
    ),
    [v, l]
  ), [E, O] = T(""), [F, B] = T(!1), [C, L] = T(
    null
  ), x = rt(), re = `${x}-from-tags`, Q = $(null), _ = $(null), V = $(null), M = $(null), D = $(/* @__PURE__ */ new WeakMap()), P = (G) => {
    let me = D.current.get(G);
    return me || (me = crypto.randomUUID(), D.current.set(G, me)), me;
  }, X = E.trim().toLocaleLowerCase(), Y = X ? l.filter((G) => G.label.toLocaleLowerCase().includes(X)) : l, oe = (G) => t({ ...e, actions: G }), W = (G, me) => oe(l.map((Ee, qe) => qe === G ? me : Ee));
  function S(G) {
    var me;
    return [...((me = V.current) == null ? void 0 : me.querySelectorAll("[data-action-id]")) ?? []].find(
      (Ee) => Ee.dataset.actionId === G
    );
  }
  function ce(G, me) {
    const Ee = S(G), qe = Ee == null ? void 0 : Ee.querySelector(
      me === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return qe == null || qe.focus(), !!qe;
  }
  Ct(() => {
    var me;
    const G = M.current;
    G && (M.current = null, (G === "add" || !ce(G.id, G.part)) && ((me = _.current) == null || me.focus()));
  }), ee(() => {
    !c || !o || (Y.some((G) => G.id === o) ? ce(o, "label") : (O(""), M.current = { id: o, part: "label" }));
  }, [c]);
  function A() {
    const G = zu(d);
    O(""), oe([...l, G]), s(G.id), M.current = { id: G.id, part: "label" };
  }
  function Z(G) {
    const me = l[G], { shortcut: Ee, ...qe } = structuredClone(me), be = {
      ...qe,
      ...Ee === ar ? { shortcut: Ee } : {},
      id: crypto.randomUUID(),
      label: `${me.label} copy`
    };
    oe([...l.slice(0, G + 1), be, ...l.slice(G + 1)]), s(be.id), M.current = { id: be.id, part: "label" };
  }
  function le(G) {
    const me = l[G], Ee = Y.indexOf(me), qe = Y[Ee + 1] ?? Y[Ee - 1];
    oe(l.filter((be, Je) => Je !== G)), o === me.id && s(null), M.current = qe ? { id: qe.id, part: "toggle" } : "add";
  }
  function fe() {
    B(!1), requestAnimationFrame(() => {
      var G;
      return (G = Q.current) == null ? void 0 : G.focus();
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
            ref: Q,
            type: "button",
            className: "dq-header-button",
            "aria-expanded": F,
            "aria-controls": F ? re : void 0,
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
                G.key === "Escape" && E && !ln(G) && (G.preventDefault(), G.stopPropagation(), O(""));
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
          G.key !== "Escape" || G.defaultPrevented || ln(G) || (G.preventDefault(), G.stopPropagation(), fe());
        },
        children: /* @__PURE__ */ a(
          Ou,
          {
            id: re,
            review: e,
            disabled: i,
            onAdd: (G) => {
              const me = [...l, ...G];
              oe(me), L({ actions: me, count: G.length }), fe();
            },
            onCancel: fe
          }
        )
      }
    ),
    /* @__PURE__ */ a("div", { ref: V, children: Y.length > 0 && /* @__PURE__ */ a(
      Is,
      {
        items: Y,
        getKey: (G) => G.id,
        disabled: i || !!X,
        className: "dq-action-list",
        onReorder: (G) => oe(G),
        renderItem: (G, { dragHandleProps: me, isOver: Ee }) => {
          const qe = l.indexOf(G), be = o === G.id;
          return /* @__PURE__ */ a(
            Hu,
            {
              action: G,
              entityType: d,
              keyButton: /* @__PURE__ */ a(
                Uu,
                {
                  actions: l,
                  index: qe,
                  keyMap: m,
                  name: G.label.trim() || "New action",
                  onChoose: (Je) => oe(ud(l, qe, Je))
                }
              ),
              takenPin: m.duplicatePins.has(qe) ? G.shortcut : void 0,
              groupUnanswerable: "steps" in G && w.has(Nt(G.group)),
              effect: Rr(G, h, n, r),
              open: be,
              detailId: `${x}-detail-${G.id}`,
              dragHandleProps: me,
              isOver: Ee,
              reorderDisabled: i || !!X,
              onToggle: () => s(be ? null : G.id),
              onDuplicate: () => Z(qe),
              onDelete: () => le(qe),
              children: "steps" in G ? /* @__PURE__ */ a(
                Qu,
                {
                  action: G,
                  groupNames: g,
                  otherGroupNames: N,
                  occurrence: Ce(e),
                  saving: i,
                  stepKey: P,
                  rememberStepKey: (Je, ue) => D.current.set(Je, P(ue)),
                  onChange: (Je) => W(qe, Je)
                }
              ) : /* @__PURE__ */ a(
                Yu,
                {
                  action: G,
                  tagGroups: n,
                  onChange: (Je) => W(qe, Je)
                }
              )
            }
          );
        }
      }
    ) }),
    l.length ? !Y.length && /* @__PURE__ */ u("p", { className: "dq-actions-empty", role: "status", children: [
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
  onToggle: m,
  onDuplicate: h,
  onDelete: g,
  children: y
}) {
  const N = e.label.trim() || "New action", v = Vu(e, t), w = "steps" in e && Nt(e.group) ? e.group.trim() : "";
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
              style: Oc(d.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${N}`,
              title: l ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: l,
              children: /* @__PURE__ */ a(Ps, { "aria-hidden": "true" })
            }
          ),
          n,
          /* @__PURE__ */ u("div", { className: "dq-action-row-summary", onClick: m, children: [
            /* @__PURE__ */ a("span", { className: "dq-action-row-label", title: N, children: N }),
            w && /* @__PURE__ */ u("span", { className: "dq-action-row-group", title: `Group: ${w}`, children: [
              /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Group: " }),
              w
            ] }),
            !s && /* @__PURE__ */ a("span", { className: "dq-action-row-effect", children: o.map((E, O) => /* @__PURE__ */ a("span", { "data-effect-tone": E.tone, children: E.text }, O)) }),
            v && /* @__PURE__ */ u("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
              v
            ] }),
            r && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${ma(r)} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
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
                  /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
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
              onClick: h,
              children: /* @__PURE__ */ a(Ls, { "aria-hidden": "true" })
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
              children: /* @__PURE__ */ a(ni, { "aria-hidden": "true" })
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
              onClick: m,
              children: /* @__PURE__ */ a(Zi, { "aria-hidden": "true" })
            }
          )
        ] }),
        s && /* @__PURE__ */ a("div", { id: c, className: "dq-action-detail", children: y })
      ]
    }
  );
}
function Mc({
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
  const d = rt(), f = $(null), l = $(null);
  Ct(() => {
    var g, y;
    const h = l.current;
    h != null && (l.current = null, (y = (g = f.current) == null ? void 0 : g.querySelector(`[data-step-index="${h}"] input`)) == null || y.focus());
  });
  const m = (h) => c({ ...e, steps: h });
  return /* @__PURE__ */ u(he, { children: [
    /* @__PURE__ */ a(Mc, { action: e, onChange: (h) => c({ ...e, label: h }) }),
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
          Is,
          {
            items: e.steps,
            getKey: o,
            disabled: i,
            className: "dq-step-list",
            onReorder: m,
            renderItem: (h, { index: g, dragHandleProps: y, isOver: N }) => /* @__PURE__ */ a(
              Wu,
              {
                step: h,
                index: g,
                dragHandleProps: y,
                isOver: N,
                saving: i,
                onChange: (v) => {
                  s(v, h), m(e.steps.map((w, E) => E === g ? v : w));
                },
                onRemove: () => m(e.steps.filter((v, w) => w !== g))
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
              l.current = e.steps.length, m([...e.steps, { mode: "ADD", tagIds: [] }]);
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
            style: Oc(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${c}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: i,
            children: [
              /* @__PURE__ */ a(Ps, { "aria-hidden": "true" }),
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
          or,
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
  return /* @__PURE__ */ u(he, { children: [
    /* @__PURE__ */ a(Mc, { action: e, onChange: (s) => n({ ...e, label: s }) }),
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
const Fc = Ml(!1);
function Xu({ children: e }) {
  return /* @__PURE__ */ a(Fc.Provider, { value: !0, children: e });
}
function Yt({ tag: e, name: t }) {
  const n = Fl(Fc), r = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ a(Pl, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: r ?? void 0 });
}
function Zu({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, r = Kn(De(e)).queue, i = (o) => t({ ...e, occurrence: { ...n, ...o } });
  return /* @__PURE__ */ u("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
    /* @__PURE__ */ u("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      r,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ a(
      or,
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
  const n = Kn(De(e)).many, r = e.occurrence, i = Gs(r), o = ["any", "isNull"].includes(r.condition) ? [] : r.conditionTagIds, s = ka([
    ...i.flatMap((l) => [l.tagId, ...l.categoryTagId ? [l.categoryTagId] : []]),
    ...o
  ]), c = (l) => {
    var m;
    return ((m = s[l]) == null ? void 0 : m.name) ?? (s[l] === null ? `Unavailable tag ${l}` : `Tag ${l}`);
  }, d = (l) => t({ ...e, occurrence: ld(r, l) }), f = (l, m) => d(
    i.map(
      (h, g) => g !== l ? h : m === void 0 ? { tagId: h.tagId } : { tagId: h.tagId, categoryTagId: m }
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
    i.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-flag-pairs", "aria-label": "Performer flags", children: i.map((l, m) => {
      const h = c(l.tagId), g = i.filter(
        (v, w) => w !== m && v.tagId === l.tagId
      ), y = (v) => g.some((w) => w.categoryTagId === v), N = `${l.tagId}#${i.slice(0, m).filter((v) => v.tagId === l.tagId).length}`;
      return /* @__PURE__ */ u("li", { className: "dq-flag-pair", children: [
        /* @__PURE__ */ u("span", { className: "dq-flag-pair-tag", children: [
          /* @__PURE__ */ a(jn, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(Yt, { tag: s[l.tagId], name: h })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-flag-pair-affects", children: [
          /* @__PURE__ */ a("span", { className: "dq-flag-pair-label", "aria-hidden": "true", children: "Affects" }),
          /* @__PURE__ */ a(
            jo,
            {
              entityType: "tag",
              value: l.categoryTagId,
              onChange: (v) => f(m, v),
              placeholder: "Whole review",
              allowCreate: !1,
              selectedDisplay: "input",
              inputClassName: "dq-input",
              inputAriaLabel: `Affects, ${h}`,
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
            "aria-label": `Remove flag ${h}`,
            title: "Remove flag",
            onClick: () => d(i.filter((v, w) => w !== m)),
            children: /* @__PURE__ */ a(ni, { "aria-hidden": "true" })
          }
        ),
        o.length > 0 && /* @__PURE__ */ u(
          "div",
          {
            className: "dq-flag-suggestions",
            role: "group",
            "aria-label": `Suggested categories for ${h}`,
            children: [
              /* @__PURE__ */ a("span", { "aria-hidden": "true", children: "Condition categories" }),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-flag-suggestion",
                  "aria-pressed": l.categoryTagId === void 0,
                  disabled: y(void 0),
                  onClick: () => f(m, void 0),
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
                  onClick: () => f(m, v),
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
      jo,
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
const xc = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, Pc = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, tf = {
  video: ri,
  audio: js,
  tag: _s,
  performerOccurrence: Ds,
  audioPerformerOccurrence: Jl
};
function Lc({ entityType: e }) {
  const t = tf[e];
  return /* @__PURE__ */ a(t, { role: "img", "aria-label": xc[e] });
}
const nf = 2e6;
function Dc(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), r = document.createElement("a");
  r.href = n, r.download = t, r.click(), URL.revokeObjectURL(n);
}
function rf(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function No(e) {
  Dc([e], rf(e));
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
function _c({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: r,
  nameRef: i,
  autoFocus: o = !1
}) {
  return /* @__PURE__ */ u(he, { children: [
    /* @__PURE__ */ u("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ a("span", { children: "Entity type" }),
      /* @__PURE__ */ a(
        "select",
        {
          className: "dq-select",
          "aria-label": "Entity type",
          value: Le(e),
          disabled: n,
          onChange: (s) => r == null ? void 0 : r(s.target.value),
          children: Vs.map((s) => /* @__PURE__ */ a("option", { value: s, children: Pc[s] }, s))
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
  const n = Le(e), r = ["Review"];
  return (n === "video" || n === "tag") && r.push("Appearance"), r.push("Actions"), t && r.push("Tag choices"), r;
}
function sf({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = $(null), r = $(null), i = rt(), o = rt();
  return ee(() => {
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
function jc({
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
  notices: m,
  onSave: h,
  onCancel: g,
  drawerRef: y
}) {
  const [N, v] = T("Review"), [w] = T(
    () => Ce(e) && e.occurrence.tagIds.length > 0
  ), [E, O] = T(""), [F, B] = T(null), [C, L] = T(0), [x, re] = T(!1), Q = $(null), _ = $(null), V = $(null), M = of(e, w), D = Le(e), P = we(() => zr(e), [e]);
  ee(() => O(""), [P]), ee(() => {
    var ce, A;
    if (x) return;
    const W = Q.current;
    if (Q.current = null, !W) return;
    (A = W.isConnected && !!((ce = V.current) != null && ce.contains(W)) && !(W instanceof HTMLButtonElement && W.disabled) ? W : V.current) == null || A.focus({ preventScroll: !0 });
  }, [x]);
  function X() {
    if (!(s || x)) {
      if (!f) {
        g();
        return;
      }
      Q.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, re(!0);
    }
  }
  function Y() {
    const W = { ...e, name: e.name.trim() }, S = ga(W);
    if (!S) {
      O(""), h();
      return;
    }
    if (O(S), !W.name) {
      v("Review"), requestAnimationFrame(() => {
        var A;
        return (A = _.current) == null ? void 0 : A.focus();
      });
      return;
    }
    const ce = e.actions.find(
      (A) => !Un(A, D)
    );
    ce && (v("Actions"), B(ce.id), L((A) => A + 1));
  }
  const oe = E || d;
  return /* @__PURE__ */ u(he, { children: [
    /* @__PURE__ */ u(
      "aside",
      {
        ref: (W) => {
          V.current = W, y && (y.current = W);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (W) => {
          W.key !== "Escape" || W.defaultPrevented || s || ln(W) || (W.preventDefault(), W.stopPropagation(), X());
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
                onClick: X,
                children: /* @__PURE__ */ a(va, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ a(
            Ll,
            {
              tabs: M.map((W) => ({
                key: W,
                label: W,
                count: W === "Actions" ? e.actions.length : void 0
              })),
              activeTab: N,
              onTabChange: (W) => v(W)
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
                    _c,
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
                        onChange: (W) => r(W.target.value),
                        children: [
                          /* @__PURE__ */ a("option", { value: "end", children: "Start from the end" }),
                          /* @__PURE__ */ a("option", { value: "beginning", children: "Start from the beginning" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ a("small", { className: "dq-drawer-note", children: "From the end, the queue opens on its last page and works towards the first." })
                  ] }),
                  Ce(e) && /* @__PURE__ */ a(ef, { review: e, onChange: t }),
                  /* @__PURE__ */ a("div", { children: /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => No(e),
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
            w && Ce(e) && /* @__PURE__ */ a(
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
          (oe || m) && /* @__PURE__ */ u("div", { className: "dq-drawer-notices", children: [
            m,
            oe && /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
              oe
            ] })
          ] }),
          /* @__PURE__ */ u("footer", { className: "dq-drawer-footer", children: [
            /* @__PURE__ */ a("p", { className: "dq-drawer-dirty", children: f ? l ? "Unsaved changes, including the queue's criteria" : "Unsaved changes" : "" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: s, onClick: X, children: "Cancel" }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-button primary",
                "aria-busy": s || void 0,
                "aria-disabled": s || void 0,
                disabled: !s && c,
                onClick: () => {
                  s || Y();
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
        onKeepEditing: () => re(!1),
        onDiscard: () => {
          Q.current = null, re(!1), g();
        }
      }
    )
  ] });
}
function cf({
  review: e,
  onChange: t
}) {
  const n = rt(), r = e.view, i = (l) => t({ ...e, view: { ...r, ...l } }), o = /* @__PURE__ */ u("label", { className: "dq-checkbox dq-setting-indent", children: [
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
  if (Le(e) === "tag")
    return /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-cards`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-cards`, children: "Cards" }),
      /* @__PURE__ */ a(
        as,
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
  return /* @__PURE__ */ u(he, { children: [
    /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ u("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ a(
          is,
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
          is,
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
        as,
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
        ].map(([l, m]) => /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ a(
            "input",
            {
              type: "checkbox",
              checked: d.includes(l),
              onChange: (h) => c({
                annotations: h.target.checked ? [...d, l] : d.filter((g) => g !== l)
              })
            }
          ),
          m
        ] }, l)) })
      ] }),
      d.includes("tags") && /* @__PURE__ */ u("div", { className: "dq-setting-row dq-setting-row-top", children: [
        /* @__PURE__ */ a("span", { className: "dq-setting-name", children: "Tags on cards" }),
        /* @__PURE__ */ u("div", { className: "dq-setting-value", children: [
          /* @__PURE__ */ a(
            or,
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
        or,
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
  const n = rt(), [r, i] = T(null), o = e.find((c) => c.key === r), s = (c, d) => t(
    e.map((f) => {
      var m;
      if (f.key !== c) return f;
      const l = { ...f, ...d };
      return (m = l.group) != null && m.trim() || delete l.group, l;
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
            onChange: (m) => s(c.key, { label: m.target.value })
          }
        ),
        /* @__PURE__ */ a(
          "input",
          {
            className: "dq-input",
            "aria-label": `Pick-one group of ${f}`,
            placeholder: "Group (optional)",
            value: c.group ?? "",
            onChange: (m) => s(c.key, { group: m.target.value })
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
            onClick: () => t(e.filter((m) => m.key !== c.key)),
            children: /* @__PURE__ */ a(ni, { "aria-hidden": "true" })
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
          c.key !== "Escape" || ln(c) || (c.stopPropagation(), !c.defaultPrevented && (c.preventDefault(), i(null)));
        },
        children: /* @__PURE__ */ a(
          $s,
          {
            open: !0,
            onClose: () => i(null),
            criteria: ti,
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
function as({
  label: e,
  value: t,
  options: n,
  onChange: r
}) {
  const i = rt();
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
function is({
  name: e,
  checked: t,
  title: n,
  text: r,
  picture: i,
  onChoose: o
}) {
  const s = rt(), c = rt();
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
const Ui = "The queue differs from the saved review.";
function Uc({
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
  queueChange: m,
  queueDiffers: h,
  chipsStart: g,
  chipsAfter: y,
  chipsEnd: N
}) {
  const v = $(null);
  gf(v);
  const w = bf(v), [E, O] = T({ differs: h, text: "" });
  return E.differs !== h && O({
    differs: h,
    text: h ? E.differs === !1 ? Ui : E.text : ""
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
      /* @__PURE__ */ a("span", { className: "dq-review-type", title: xc[n], children: /* @__PURE__ */ a(Lc, { entityType: n }) }),
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
      m && /* @__PURE__ */ a(ff, { change: m, onPress: w }),
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
  const n = rt(), r = rt(), i = `${Ui} Save these filters to the review.`, o = e.onSave ? `${Ui} Go back to the review's saved filters.` : "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.";
  return /* @__PURE__ */ u(he, { children: [
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
function za(e) {
  const t = e.querySelector(".dq-review-header-lead"), n = e.querySelector(".dq-review-header-trail");
  if (!t || !n) return !0;
  const r = t.getBoundingClientRect();
  return !r.height || n.getBoundingClientRect().top < r.bottom;
}
function os(e, t) {
  const n = e.querySelector(".dq-review-header-lead h1"), r = () => {
    e.removeAttribute("data-compact"), n == null || n.style.removeProperty("max-width");
  };
  if (r(), !t) return !0;
  const i = pf.filter(
    (o) => e.querySelector(hf[o])
  );
  for (let o = 1; o <= i.length && !za(e); o++) {
    if (e.dataset.compact = i.slice(0, o).join(" "), i[o - 1] !== "name" || !n) continue;
    const s = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let c = n.getBoundingClientRect().width;
    for (; !za(e) && c > 6 * s; )
      c = Math.max(6 * s, c - s), n.style.maxWidth = `${c}px`;
  }
  return za(e) ? !0 : (r(), !1);
}
function gf(e) {
  const t = Sc(mf), [n, r] = T(0), i = $(!1);
  Ct(() => {
    e.current && (i.current = !os(e.current, t));
  }, [e, t, n]), Ct(() => {
    const o = e.current;
    o && t && !i.current && !za(o) && (i.current = !os(o, t));
  }), ee(() => {
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
  const t = $(!1);
  return ee(() => {
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
function Bc({
  page: e,
  pages: t,
  onPage: n
}) {
  const [r, i] = T(!1), [o, s] = T(""), c = $(null), d = $(null);
  ee(() => {
    var m;
    r && ((m = c.current) == null || m.select());
  }, [r]);
  const f = (m) => {
    i(!1), m && requestAnimationFrame(() => {
      var h;
      return (h = d.current) == null ? void 0 : h.focus();
    });
  }, l = () => {
    const m = Math.round(Number(o));
    f(!0), Number.isFinite(m) && m >= 1 && m !== e && n(Math.min(t, m));
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
        onChange: (m) => s(m.target.value),
        onKeyDown: (m) => {
          ln(m) || (m.key === "Enter" ? (m.preventDefault(), l()) : m.key === "Escape" && (m.preventDefault(), m.stopPropagation(), f(!0)));
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
        children: /* @__PURE__ */ a(Us, { "aria-hidden": "true" })
      }
    )
  ] });
}
function Kc({
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
          /* @__PURE__ */ a(eo, { "aria-hidden": "true" }),
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
function qo({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [r, i] = T(!1), [o, s] = T(!1), c = $(null), d = $(null), f = rt();
  Ct(() => {
    if (!r || !d.current || !c.current) return;
    const h = c.current.getBoundingClientRect(), g = d.current.offsetHeight + 12, y = window.innerHeight - h.bottom;
    s(y < g && h.top > y);
  }, [r]), ee(() => {
    var h, g;
    r && ((g = (h = d.current) == null ? void 0 : h.querySelector('[role="menuitem"]:not(:disabled)')) == null || g.focus({ preventScroll: !0 }));
  }, [r]), ee(() => {
    t && i(!1);
  }, [t]);
  const l = (h = !0) => {
    var g;
    i(!1), h && ((g = c.current) == null || g.focus());
  };
  return /* @__PURE__ */ u("div", { className: `dq-menu${r ? " dq-menu-open" : ""}`, onKeyDown: (h) => {
    var N, v;
    if (!r) return;
    const g = [
      ...((N = d.current) == null ? void 0 : N.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], y = g.indexOf(document.activeElement);
    if (h.key === "Escape")
      h.preventDefault(), h.stopPropagation(), l();
    else if (h.key === "Tab")
      l(!1);
    else if (h.key === "ArrowDown" || h.key === "ArrowUp") {
      if (h.preventDefault(), !g.length) return;
      const w = h.key === "ArrowDown" ? 1 : -1;
      g[(y + w + g.length) % g.length].focus();
    } else (h.key === "Home" || h.key === "End") && (h.preventDefault(), (v = g.at(h.key === "Home" ? 0 : -1)) == null || v.focus());
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
        onClick: () => i((h) => !h),
        children: /* @__PURE__ */ a(Hl, { "aria-hidden": "true" })
      }
    ),
    r && /* @__PURE__ */ u(he, { children: [
      /* @__PURE__ */ a("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => l(!1) }),
      /* @__PURE__ */ a(
        "div",
        {
          ref: d,
          id: f,
          role: "menu",
          "aria-label": n,
          className: `dq-menu-list${o ? " dq-menu-list-up" : ""}`,
          children: e.map((h) => /* @__PURE__ */ u(Yi, { children: [
            h.separated && /* @__PURE__ */ a("div", { role: "separator", className: "dq-menu-separator" }),
            /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                role: "menuitem",
                className: h.danger ? "dq-menu-danger" : void 0,
                disabled: h.disabled,
                onClick: () => {
                  l(), h.onSelect();
                },
                children: [
                  h.icon,
                  h.label
                ]
              }
            )
          ] }, h.label))
        }
      )
    ] })
  ] });
}
function Za(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function So(e) {
  return String(e.type).toLowerCase() === "tag";
}
function ko(e) {
  return !!String(e ?? "").trim();
}
function Eo(e) {
  return [
    ...new Set(
      Za(e.customFieldCriteria).filter(So).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !ko(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function Ao(e, t) {
  const n = Za(e.customFieldCriteria);
  if (!n.length) return e;
  let r = !1;
  const i = n.map((o) => {
    if (!So(o)) return o;
    const s = { ...o };
    for (const [c, d] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const f = t[String(o[c] ?? "")];
      f && !ko(o[d]) && (s[d] = f, r = !0);
    }
    return s;
  });
  return r ? { ...e, customFieldCriteria: i } : e;
}
function Gc(e, t, n) {
  const r = Za(e.customFieldCriteria);
  if (!r.length) return e;
  const i = Za(n.customFieldCriteria), o = (d, f) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (l) => (d[l] ?? void 0) === (f[l] ?? void 0)
  );
  let s = !1;
  const c = r.map((d) => {
    if (!So(d)) return d;
    const f = i.find((m) => o(m, d));
    if (!f) return d;
    const l = { ...d };
    for (const [m, h] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const g = t[String(d[m] ?? "")];
      g && d[h] === g && !ko(f[h]) && (delete l[h], s = !0);
    }
    return l;
  });
  return s ? { ...e, customFieldCriteria: c } : e;
}
async function wf(e, t, n) {
  if (!Un(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const r = De(e), i = n.steps.some((c) => _n(c.mode)) ? await Gd(r) : "", o = await uo(n);
  let s = t.applications;
  for (const c of [
    ...o.filter((d) => !_n(d.mode)),
    ...o.filter((d) => _n(d.mode))
  ]) {
    const d = (f) => Vd(
      i,
      r,
      t.media.id,
      t.performer.id,
      c.tagIds,
      f
    );
    (c.mode === "MARK_PRESENT" || c.mode === "CLEAR_ABSENCE") && await d("REMOVE"), c.mode !== "CLEAR_ABSENCE" && (s = await Hc(
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
async function Co(e, t) {
  const n = e.occurrence;
  if (ro(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const r = /* @__PURE__ */ new Set(), { _filterExpression: i, ...o } = n.performerFilter;
  for (let s = 1; ; s++) {
    const c = await ge("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Bn({
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
function Vc(e) {
  return ha(e.condition) && e.hideConfirmedAbsent !== !1;
}
function To(e, t) {
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
  }, s = Vc(i) && (t == null ? void 0 : t.length) === 1 && i.conditionTagIds.length === 1 ? `${t[0]}:${i.conditionTagIds[0]}` : null;
  return {
    ...e,
    entityType: De(e),
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
                      key: ii,
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
async function Io(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => oi([n], t))
  );
}
function zc(e) {
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
  if (!Vc(e)) return !1;
  const o = oc(t, n);
  return e.conditionTagIds.every(
    (s, c) => o.includes(s) || i[c].some((d) => r.includes(d))
  );
}
async function Jc(e, t, n, r) {
  if ((t == null ? void 0 : t.length) === 0 || zc(e.occurrence))
    return { items: [], totalCount: 0 };
  const i = De(e), o = await Kr(
    To(e, t),
    { ...e.view.filter, page: n },
    r
  ), s = t === null ? null : new Set(t), c = e.occurrence, d = o.items.length ? await Io(c, r) : [], f = new Array(o.items.length);
  let l = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, o.items.length) }, async () => {
      for (; l < o.items.length; ) {
        const m = l++, h = o.items[m], g = await ge(
          `/api/tagapplications?hostType=${i}&hostId=${h.id}&contextType=performer`,
          { signal: r }
        );
        f[m] = h.performers.filter((y) => s === null || s.has(y.id)).flatMap((y) => {
          const N = g.filter(
            (w) => w.hostType === i && w.hostId === h.id && w.contextType === "performer" && w.contextId === y.id
          ), v = N.map((w) => w.tag.id);
          return vf(e.occurrence, v, d) && !Nf(c, h, y.id, v, d) ? [
            {
              key: `${h.id}:${y.id}`,
              media: h,
              performer: y,
              applications: N
            }
          ] : [];
        });
      }
    })
  ), { items: f.flat(), totalCount: o.totalCount };
}
async function Hc(e, t, n) {
  const r = new Set(e.occurrence.tagIds);
  if (n.some((f) => !r.has(f)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const i = De(e), o = await Ya(i, t.media.id);
  if (!o.performers.some(
    (f) => f.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${i}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${i}&hostId=${o.id}&contextType=performer&contextId=${t.performer.id}`, c = (await ge(s)).filter(
    (f) => f.hostType === i && f.hostId === o.id && f.contextType === "performer" && f.contextId === t.performer.id
  ), d = new Set(n);
  try {
    for (const f of d)
      c.some((l) => l.tag.id === f) || await ge("/api/tagapplications", {
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
      r.has(f.tag.id) && !d.has(f.tag.id) && await ge(`/api/tagapplications/${f.id}`, {
        method: "DELETE"
      });
    return await ge(s);
  } catch (f) {
    throw new Error(
      `Some tag changes may have been saved. ${f instanceof Error ? f.message : "Request failed."}`
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
async function Nn(e, t, n = !0) {
  var c;
  if (t.occurrence) {
    const d = n ? oc(
      await Ya(e, t.media.id),
      t.occurrence.performer.id
    ) : [], f = (await ge(qf(e, t))).filter(
      (l) => l.hostType === e && l.hostId === t.media.id && l.contextType === "performer" && l.contextId === t.occurrence.performer.id
    );
    return _i(f.map((l) => l.tag)), {
      ids: [...new Set(f.map((l) => l.tag.id))],
      names: [...new Set(f.map((l) => l.tag.name))],
      absent: d,
      applications: f
    };
  }
  const r = await Ya(e, t.media.id), i = (r.tags ?? []).filter(
    (d) => d.canRemove !== !1 || d.isDerived !== !0
  );
  _i(i);
  const o = Object.keys(r.customFields ?? {}).find(
    (d) => d.toLowerCase() === Wa
  ) ?? Wa, s = ((c = r.customFields) == null ? void 0 : c[o]) ?? [];
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
async function $o(e, t, n) {
  if (t.occurrence && Ce(e))
    await Hc(
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
      i.length && await ge(
        `/api/${lr(De(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: r, tagIds: i })
        }
      );
}
async function Sf(e, t, n) {
  t.occurrence && Ce(e) ? await wf(e, t.occurrence, n) : await sc(De(e), n, [t.media.id]);
}
function Bi(e, t, n, r) {
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
class Qc extends Error {
}
const Ki = (e) => e instanceof Error ? e.message : "Request failed.", ss = (e) => [...e].sort((t, n) => t - n), ba = (e, t) => JSON.stringify(ss(e)) === JSON.stringify(ss(t)), Gi = (e) => !!(e.tags.added.length || e.tags.removed.length);
function ei(e, t, n, r) {
  const i = new Set(e), o = new Set(e);
  for (const l of t.steps)
    for (const m of l.tagIds)
      l.mode === "ADD" ? o.add(m) : o.delete(m);
  const s = e.some((l) => !o.has(l));
  if (s && !r)
    return { desired: [...e], conflict: s, skipped: !0, kept: [], replaced: [] };
  const c = new Set(
    t.steps.filter((l) => l.mode === "ADD").flatMap((l) => l.tagIds)
  ), d = [], f = [];
  for (const l of n) {
    const m = l.filter((g) => o.has(g) && !i.has(g)), h = l.filter(
      (g) => o.has(g) && i.has(g) && !c.has(g)
    );
    !m.length || !h.length || (r ? (h.forEach((g) => o.delete(g)), f.push(...h)) : (m.forEach((g) => o.delete(g)), d.push({ tagIds: m, existing: h })));
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
        (l) => l.mode === "ADD" && l.tagIds.some((m) => o.includes(m))
      )
    );
    if (s.length < 2) continue;
    const c = e.occurrence.conditionTagIds[i];
    let d = `tag ${c}`;
    try {
      d = (await ge(`/api/tags/${c}`, { signal: r })).name;
    } catch {
      r.throwIfAborted();
    }
    throw new Qc(
      `${s.map((f) => f.label).join(" and ")} answer the same condition tag, ${d}. Choose one of them.`
    );
  }
}
async function Cf(e, t, n, r = () => {
}) {
  if (!t.length || t.some(
    (h) => !Un(h, e.entityType) || !h.steps.length || h.steps.some(
      (g) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(g.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), o = structuredClone(t), s = ha(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await Io(i.occurrence, n) : [];
  await Af(i, o, s, n);
  const c = await Promise.all(
    o.map(async (h) => ({
      ...h,
      steps: await uo(h, n)
    }))
  ), d = structuredClone(Ef(c));
  n.throwIfAborted();
  const f = [
    .../* @__PURE__ */ new Set([
      ...d.steps.flatMap((h) => h.tagIds),
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
  const l = await Co(i, n), m = /* @__PURE__ */ new Map();
  for (let h = 1; ; h++) {
    n.throwIfAborted();
    const g = await Jc(i, l, h, n);
    for (const y of g.items) {
      const N = {
        ids: [...new Set(y.applications.map((w) => w.tag.id))],
        names: y.applications.map((w) => w.tag.name),
        absent: [],
        applications: y.applications
      }, v = ei(N.ids, d, s, !0);
      m.set(y.key, {
        item: { key: y.key, media: y.media, occurrence: y },
        before: N,
        expected: N,
        conflict: v.conflict,
        status: ba(N.ids, v.desired) ? "unchanged" : "pending"
      });
    }
    if (r(m.size), h * 250 >= g.totalCount) break;
    if (h > 1e5)
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
    entries: [...m.values()]
  };
}
function Tf(e, t, n) {
  const r = (o) => o.ids.filter((s) => n.includes(s));
  if (!ba(r(e), r(t))) return !1;
  const i = (o) => (o.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return ba(i(e), i(t));
}
async function Wc(e, t, n, r) {
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
function Yc(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function Xc(e) {
  return e.entries.filter((t) => t.operation);
}
async function If(e, t, n, r, i = !1) {
  await Wc(
    Yc(e, i),
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
        if (s = await Nn(De(e.review), o.item, !1), !Tf(o.expected, s, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (h) {
        o.status = "failed", o.error = Ki(h);
        return;
      }
      const c = ei(
        o.before.ids,
        e.action,
        e.categories,
        t
      ), d = [
        ...s.ids.filter((h) => !e.touched.includes(h)),
        ...c.desired.filter((h) => e.touched.includes(h))
      ], f = Hr(s.ids, d);
      if (!f.added.length && !f.removed.length) {
        const h = !o.operation && c.kept.length > 0;
        o.status = o.operation ? "changed" : h ? "skipped" : "unchanged", o.error = h ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let l;
      try {
        await $o(e.review, o.item, f);
      } catch (h) {
        l = h;
      }
      let m = !1;
      try {
        const h = await Nn(De(e.review), o.item, !1);
        m = !0, o.expected = h;
        const g = Bi(
          o.item,
          o.before,
          h,
          e.touched
        );
        if (o.operation = Gi(g) ? g : void 0, l) throw l;
        if (!ba(
          h.ids.filter((y) => e.touched.includes(y)),
          d.filter((y) => e.touched.includes(y))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (h) {
        if (o.status = "failed", o.error = Ki(h), !m)
          try {
            const g = await Nn(De(e.review), o.item, !1);
            o.expected = g;
            const y = Bi(
              o.item,
              o.before,
              g,
              e.touched
            );
            o.operation = Gi(y) ? y : void 0;
          } catch {
            o.unverified = !0;
          }
      }
    },
    r
  );
}
async function $f(e, t, n) {
  await Wc(
    Xc(e),
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
        const c = await Nn(De(e.review), r.item, !1);
        kf(i, c), s = !0, await $o(e.review, r.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const d = await Nn(De(e.review), r.item, !1);
        if (!ba(
          d.ids.filter((f) => o.includes(f)),
          r.before.ids.filter((f) => o.includes(f))
        ))
          throw new Error("Undo did not restore all affected tags.");
        r.operation = void 0, r.expected = d, r.status = "unchanged", r.error = void 0;
      } catch (c) {
        if (r.error = `Undo stopped: ${Ki(c)}`, r.status = "failed", s)
          try {
            const d = await Nn(De(e.review), r.item, !1), f = Bi(
              r.item,
              r.before,
              d,
              o
            );
            r.operation = Gi(f) ? f : void 0, r.expected = d;
          } catch {
            r.unverified = !0;
          }
      }
    },
    n
  );
}
const Zc = (e, t) => t.count - e.count || cc(e, t);
async function Rf(e, t, n) {
  const r = De(e), i = e.occurrence, [o, s] = await Promise.all([
    ge(
      `/api/tagapplications?hostType=${r}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    Io(i, n)
  ]), c = o.filter(
    (y) => y.hostType === r && y.contextType === "performer" && y.contextId === t
  );
  _i(c.map((y) => y.tag));
  const d = await Promise.all(
    s.map(async (y, N) => {
      const v = i.conditionTagIds[N];
      return (await ge(`/api/tags/${v}`, { signal: n })).name;
    })
  ), f = new Set(s.flat()), l = new Set(
    [
      ...e.actions.flatMap((y) => y.steps).filter((y) => y.mode === "ADD" || y.mode === "MARK_PRESENT").flatMap((y) => y.tagIds),
      ...i.tagIds
    ].filter((y) => !f.has(y))
  ), m = (y) => {
    const N = /* @__PURE__ */ new Map();
    for (const v of c) {
      if (!y.has(v.tag.id)) continue;
      const w = N.get(v.tag.id) ?? {
        tag: v.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      w.hosts.add(v.hostId), N.set(v.tag.id, w);
    }
    return [...N.values()].map((v) => ({ ...v.tag, count: v.hosts.size })).sort(Zc);
  }, h = s.map((y, N) => ({
    id: i.conditionTagIds[N],
    name: d[N],
    members: y,
    tags: m(new Set(y))
  }));
  l.size && h.push({
    id: null,
    name: s.length ? "Other review tags" : "Review tags",
    members: [...l],
    tags: m(l)
  });
  const g = /* @__PURE__ */ new Set([...f, ...l]);
  return {
    answered: new Set(
      c.filter((y) => g.has(y.tag.id)).map((y) => y.hostId)
    ).size,
    groups: h
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
    (s) => [...cr(s)].some((c) => i.has(c)) && s.steps.some(
      (c) => c.mode === "REMOVE_TREE" && c.tagIds.some(o)
    )
  );
}
function Ro(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const g of e.groups) for (const y of g.tags) r.set(y.id, y);
  const i = (g) => g.flatMap((y) => r.get(y) ?? []).sort(Zc), o = (g) => g.members ?? g.tags.map((y) => y.id), s = Ir(t).flatMap((g) => {
    const y = [
      ...new Set(g.actions.flatMap((N) => [...cr(t[N])]))
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
  const m = e.groups.find((g) => g.id === null), h = (m == null ? void 0 : m.tags.filter((g) => !l.has(g.id))) ?? [];
  return m && h.length && d.push({
    key: "other",
    kind: "other",
    name: d.length ? "Other review tags" : "Review tags",
    members: o(m).filter((g) => !l.has(g)),
    tags: h,
    mixed: []
  }), d;
}
const Ni = { summary: null, error: "" };
function el(e, t, n = 0) {
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
    value: Ni
  });
  return ee(() => {
    if (s((d) => d.key === i ? d : { key: i, value: Ni }), e === null || t === null) return;
    const c = new AbortController();
    return Rf(e, t, c.signal).then((d) => {
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
  }, [i, n]), o.key === i ? o.value : Ni;
}
function Mf(e, t) {
  const n = (f) => {
    var l;
    return ((l = f.tagIds) == null ? void 0 : l.every((m) => e.members.includes(m))) ?? !1;
  }, r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  for (const f of e.mixed) {
    const l = eu(f, t).filter((h) => h.key !== e.key), m = f.key === e.key ? [] : l.filter(n);
    m.length ? m.forEach((h) => r.add(h.name)) : l.forEach((h) => i.add(h.name));
  }
  const o = Nt(e.name), s = [...r].filter((f) => Nt(f) !== o), c = s.length < r.size, d = i.size ? ` (${c ? "partly " : ""}listed under ${[...i].join(", ")})` : "";
  return { names: s, here: c || i.size > 0, note: d };
}
function Ff(e, { names: t, here: n, note: r }) {
  const i = `this ${e.kind === "group" ? "group" : "category"}${r}`;
  return `This performer has different answers in ${t.length ? n ? `${i} and in ${t.join(", ")}` : t.join(", ") : i}.`;
}
function Vi({
  summary: e,
  error: t,
  mediaKind: n,
  actions: r = [],
  trees: i = Fi,
  flags: o = [],
  className: s = ""
}) {
  const c = Kn(n), d = (h) => `${h.toLocaleString()} ${h === 1 ? c.one : c.many}`, f = e ? Ro(e, r, i) : [], l = ho(f), m = (h) => [
    ...new Set(
      o.filter((g) => {
        var y;
        return (y = g.tagIds) == null ? void 0 : y.some((N) => h.includes(N));
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
        ] }) : e ? f.map((h) => {
          const g = h.kind === "other" ? [] : m(h.members), y = Mf(h, l), N = y.note ? /* @__PURE__ */ a("span", { className: "dq-sr-only", children: y.note }) : null;
          return /* @__PURE__ */ u("div", { className: "dq-answer-group", children: [
            /* @__PURE__ */ u("div", { className: "dq-answer-category", children: [
              /* @__PURE__ */ a("span", { children: h.name }),
              h.mixed.length > 0 && /* @__PURE__ */ u(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-mixed",
                  title: Ff(h, y),
                  children: [
                    /* @__PURE__ */ a(jn, { "aria-hidden": "true" }),
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
                    /* @__PURE__ */ a(jn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { className: "dq-answer-flag-names", children: [
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Flagged: " }),
                      g.join(", ")
                    ] })
                  ]
                }
              )
            ] }),
            h.tags.length ? /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": h.name, children: h.tags.map((v) => /* @__PURE__ */ u("li", { className: "dq-tag", children: [
              /* @__PURE__ */ a(Yt, { tag: v }),
              /* @__PURE__ */ a("span", { className: "dq-chip-count", "aria-hidden": "true", children: v.count.toLocaleString() }),
              /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
                ", ",
                d(v.count)
              ] })
            ] }, v.id)) }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "None" })
          ] }, h.key);
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
const cs = 5;
function xf(e, t) {
  return Promise.all(
    e.map(async (n) => {
      try {
        return (await ge(`/api/performers/${n}`, { signal: t })).name;
      } catch {
        return t.throwIfAborted(), `Performer ${n}`;
      }
    })
  );
}
const ls = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), zi = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], ds = [
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
}, qi = 250;
function da(e, t) {
  var r, i;
  const n = e.item.media;
  return n.title || ((i = (r = n.files) == null ? void 0 : r[0]) == null ? void 0 : i.basename) || (t === "audio" ? "Audio" : "Scene");
}
function Lf({ step: e }) {
  const t = zi.findIndex((n) => n.id === e);
  return /* @__PURE__ */ a("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: zi.map((n, r) => {
    const i = r < t ? "done" : r === t ? "current" : "next";
    return /* @__PURE__ */ u("li", { "data-state": i, "aria-current": i === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: i === "done" ? /* @__PURE__ */ a(Qr, {}) : r + 1 }),
      n.label,
      i === "done" && /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function us({ parts: e, id: t }) {
  return /* @__PURE__ */ a("span", { className: "dq-batch-effect", id: t, children: e.map((n, r) => /* @__PURE__ */ u(Yi, { children: [
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
        n && /* @__PURE__ */ u(he, { children: [
          " ",
          /* @__PURE__ */ a("span", { className: "dq-batch-stat-detail", children: n })
        ] })
      ]
    }
  );
}
function fs({
  added: e,
  removed: t,
  tag: n,
  label: r
}) {
  return /* @__PURE__ */ u("ul", { className: "dq-tags", "aria-label": r, children: [
    Cr(e.map(n)).map((i) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
      "+ ",
      /* @__PURE__ */ a(Yt, { tag: i })
    ] }) }, `added-${i.id}`)),
    Cr(t.map(n)).map((i) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ u("del", { children: [
      "− ",
      /* @__PURE__ */ a(Yt, { tag: i })
    ] }) }, `removed-${i.id}`))
  ] });
}
function ps({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: r,
  describe: i
}) {
  return /* @__PURE__ */ u("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: e }),
      t.length > qi && /* @__PURE__ */ u("span", { children: [
        "First ",
        qi.toLocaleString(),
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
      /* @__PURE__ */ a("tbody", { children: t.slice(0, qi).map((o) => {
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
  const [s, c] = T(!1), [d, f] = T("answers"), [l, m] = T(null), [h, g] = T({}), [y, N] = T([]), [v, w] = T(!1), [E, O] = T(!1), [F, B] = T(""), [C, L] = T(!1), [x, re] = T(""), [Q, _] = T(null), [V, M] = T(null), [D, P] = T([]), [X, Y] = T(0), oe = $(null), W = $(null), S = $(null), ce = $(!1), A = $(!1), Z = $(null), le = $(!1), fe = $(!1), G = $({ onClose: o });
  G.current = { onClose: o };
  const me = rt(), Ee = d === "run", qe = (Q == null ? void 0 : Q.kind) === "undo", be = Ee && l ? l.review : e, Je = Wr(be.actions), ue = be.occurrence, at = De(be), Ye = Kn(at), Rt = Ye.queue, Xt = Ee && l ? l.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((I) => I.steps.length && !ir(I))
  ), Ut = Xt.filter((I) => y.includes(I.id)), tt = ue.targetMode === "selected" && ue.performerIds.length === 1, Ue = el(
    be,
    s && tt ? ue.performerIds[0] : null,
    X
  ), Be = Eo(be.view.objectFilter), He = ka(
    s ? [...si(Xt), ...ue.conditionTagIds, ...Be] : []
  ), dr = we(() => qc(He), [He]), Qe = (I) => h[I] ?? He[I] ?? { id: I, name: `Tag ${I}` }, Ke = JSON.stringify(
    Object.fromEntries(
      Be.flatMap((I) => {
        var J;
        const K = (J = He[I]) == null ? void 0 : J.name;
        return K ? [[String(I), K]] : [];
      })
    )
  ), ut = we(
    () => Ao(be.view.objectFilter, JSON.parse(Ke)),
    [be.view.objectFilter, Ke]
  );
  ee(() => {
    var I, K, J;
    s && ((I = oe.current) == null || I.showModal(), (J = (K = oe.current) == null ? void 0 : K.querySelector(".dq-batch-answer input")) == null || J.focus());
  }, [s]), ee(() => {
    if (!s) return;
    const I = requestAnimationFrame(() => {
      var ke;
      const K = oe.current, J = document.activeElement;
      if (!K || J && J !== document.body && K.contains(J)) return;
      (ke = (d === "answers" ? K.querySelector(".dq-batch-answer input:checked") ?? K.querySelector(".dq-batch-answer input") : K.querySelector("[data-batch-focus]")) ?? W.current) == null || ke.focus();
    });
    return () => cancelAnimationFrame(I);
  }, [s, d, E, l]), ee(() => {
    if (s || t || !ce.current) return;
    const I = requestAnimationFrame(() => {
      const K = S.current;
      if (!ce.current || !K || K.disabled) return;
      ce.current = !1;
      const J = document.activeElement;
      (!J || J === document.body) && K.focus();
    });
    return () => cancelAnimationFrame(I);
  }, [s, t]), ee(() => {
    if (!s || ue.targetMode !== "selected") return;
    const I = new AbortController();
    return P([]), xf(ue.performerIds.slice(0, cs), I.signal).then((K) => {
      I.signal.aborted || P(K);
    }).catch(() => {
    }), () => I.abort();
  }, [s, ue.targetMode, JSON.stringify(ue.performerIds)]), ee(
    () => () => {
      var I;
      A.current = !0, (I = Z.current) == null || I.abort();
    },
    []
  ), ee(() => {
    if (!E) return;
    const I = (K) => {
      K.preventDefault(), K.returnValue = "";
    };
    return window.addEventListener("beforeunload", I), () => window.removeEventListener("beforeunload", I);
  }, [E]);
  function Oe() {
    f("answers"), m(null), g({}), _(null), w(!1), N([]), re(""), B(""), L(!1), M(null);
  }
  function Xe() {
    fe.current || (c(!1), G.current.onClose(le.current), le.current = !1, Oe(), ce.current = !0);
  }
  function Rn(I, K) {
    N(
      (J) => K ? [...J, I] : J.filter((Se) => Se !== I)
    ), m(null), g({}), re(""), B(""), L(!1), M(null);
  }
  function Bt() {
    f("answers"), M(null), re("");
  }
  function On() {
    f("preview"), l || Gn();
  }
  function Zt() {
    var I;
    A.current = !0, (I = Z.current) == null || I.abort(), re("Stopping after in-flight operations settle…");
  }
  function Tt(I) {
    M(
      (K) => (K == null ? void 0 : K.group) === I.group && K.reason === I.reason ? null : I
    );
  }
  const gt = (I, K) => (V == null ? void 0 : V.group) === I && V.reason === K;
  async function Gn() {
    if (!Ut.length || fe.current) return;
    fe.current = !0, O(!0), B(""), L(!1), re("Loading all matching occurrences…"), m(null), g({}), M(null);
    const I = new AbortController();
    Z.current = I;
    try {
      const K = await Cf(
        e,
        Ut,
        I.signal,
        (Se) => re(`Loaded ${Se.toLocaleString()} matching occurrences…`)
      );
      I.signal.throwIfAborted();
      const J = {};
      for (const Se of K.entries)
        for (const ke of Se.before.applications ?? [])
          J[ke.tag.id] = ke.tag;
      g(J), m(K), re("Preview ready. No tags have been changed.");
    } catch (K) {
      B(
        I.signal.aborted ? "Preview cancelled. No tags were changed." : K instanceof Error ? K.message : String(K)
      ), L(!I.signal.aborted && K instanceof Qc), re("");
    } finally {
      fe.current = !1, O(!1), Z.current = null;
    }
  }
  async function dn(I) {
    if (!l || fe.current) return;
    const K = (I === "undo" ? Xc(l) : Yc(l, I === "retry")).length;
    fe.current = !0, A.current = !1, le.current = !0, O(!0), f("run"), B(""), _({ kind: I, total: K, done: 0, stopped: !1 }), re(
      I === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const J = () => _((ke) => ke && { ...ke, done: ke.done + 1 });
    let Se = !1;
    try {
      I === "undo" ? await $f(l, () => A.current, J) : await If(l, v, () => A.current, J, I === "retry"), re(
        A.current ? "Stopped after in-flight operations settled. Completed changes are retained." : I === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (ke) {
      Se = !0, re(""), B(ke instanceof Error ? ke.message : String(ke));
    } finally {
      fe.current = !1;
      const ke = A.current || Se;
      _((Re) => Re && { ...Re, stopped: ke }), O(!1), Y((Re) => Re + 1);
    }
  }
  const pe = (l == null ? void 0 : l.entries) ?? [], Ot = we(
    () => new Map(
      ((l == null ? void 0 : l.entries) ?? []).map((I) => [
        I.item.key,
        ei(I.before.ids, l.action, l.categories, v)
      ])
    ),
    [l, v]
  ), Mt = (I) => Ot.get(I.item.key), qn = (I) => Hr(I.before.ids, Mt(I).desired), ur = (I) => {
    const K = qn(I);
    return I.status === "pending" && (K.added.length > 0 || K.removed.length > 0);
  }, Ge = (I) => I.conflict || Mt(I).kept.length > 0 || Mt(I).replaced.length > 0, bt = we(() => {
    const I = (l == null ? void 0 : l.entries) ?? [];
    return {
      willChange: I.filter(ur).length,
      correct: I.filter((K) => K.status === "unchanged").length,
      different: I.filter(Ge).length,
      hosts: new Set(I.map((K) => K.item.media.id)).size,
      added: [...new Set(I.flatMap((K) => qn(K).added))],
      removed: [...new Set(I.flatMap((K) => qn(K).removed))]
    };
  }, [Ot]), de = we(
    () => ((l == null ? void 0 : l.entries) ?? []).filter((I) => I.item.media.date).sort((I, K) => I.item.media.date.localeCompare(K.item.media.date)),
    [l]
  ), j = Ee ? Df(pe) : null, $e = (I) => Je.keys[be.actions.findIndex((K) => K.id === I)] ?? "", Ft = (I) => Rr(I, dr, [], r), fr = ha(ue.condition) && ue.includeSubtags !== !1 && ue.conditionTagIds.length > 0, ae = de[0], it = de.length > 1 ? de[de.length - 1] : void 0, Mn = (I) => `/${at}/${I.item.media.id}`, Sn = tt ? D[0] : void 0, Kt = we(
    () => n ? hc(
      n,
      Ue.summary ? ho(
        Ro(Ue.summary, be.actions, r ?? Fi)
      ) : []
    ) : [],
    [n, Ue.summary, be.actions, r]
  ), en = nu(Ut, Kt, r ?? Fi), Me = n ?? [], Ve = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: ur },
    correct: { title: "Occurrences already correct", test: (I) => I.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: Ge }
  };
  function It() {
    const I = Pf[ue.condition], K = !!I && ue.conditionTagIds.length > 0, J = ue.performerIds.slice(0, cs), Se = String(be.view.filter.q ?? "").trim(), ke = ue.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ u("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      ro(ue) ? /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "All performers" }) : ue.targetMode === "selected" ? /* @__PURE__ */ u(he, { children: [
        J.map((Re, Ne) => /* @__PURE__ */ u("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ a(Vr, { performer: { id: Re, name: D[Ne] ?? "" } }),
          D[Ne] ?? "…"
        ] }, Re)),
        ue.performerIds.length > J.length && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
          (ue.performerIds.length - J.length).toLocaleString(),
          " more performers"
        ] })
      ] }) : /* @__PURE__ */ u(he, { children: [
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
                objectFilter: ue.performerFilter,
                criteriaDefinitions: Xi,
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
        K ? I : to[ue.condition],
        K && /* @__PURE__ */ a("span", { className: "dq-batch-chip-tags", children: Cr(ue.conditionTagIds.map(Qe)).map((Re) => /* @__PURE__ */ a(Yt, { tag: Re }, Re.id)) })
      ] }),
      K && /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: ue.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      ha(ue.condition) && ue.hideConfirmedAbsent !== !1 && /* @__PURE__ */ u("span", { className: "dq-batch-chip", title: ke, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
          ": ",
          ke
        ] })
      ] }),
      Se && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
        "Search “",
        Se,
        "”"
      ] }),
      Object.keys(be.view.objectFilter).length > 0 && /* @__PURE__ */ a(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${Rt} filters`,
          children: /* @__PURE__ */ a(
            pa,
            {
              filter: be.view.filter,
              objectFilter: ut,
              criteriaDefinitions: at === "audio" ? Rs : ti,
              customFieldEntityType: at,
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
  function un(I, K, J = !0) {
    if (!I.length) return null;
    const Se = /* @__PURE__ */ a("strong", { children: Sn || "This performer" }), ke = J ? `Check the earliest and latest ${Ye.many} before applying, or narrow the batch with a date filter.` : "", Re = I.every((Ne) => Ne.tagIds === null && !Ne.mixed.length);
    return /* @__PURE__ */ u("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ a(jn, { "aria-hidden": "true" }),
      /* @__PURE__ */ u("div", { children: [
        Re ? /* @__PURE__ */ u("p", { children: [
          Se,
          " is flagged: ",
          /* @__PURE__ */ a("strong", { children: I.flatMap((Ne) => Ne.flags).join(", ") }),
          ".",
          " ",
          ke
        ] }) : /* @__PURE__ */ u(he, { children: [
          /* @__PURE__ */ u("p", { children: [
            Se,
            " needs attention where the chosen answers apply.",
            ke && ` ${ke}`
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-attention", "aria-label": "Needs attention", children: I.map((Ne) => /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ a("strong", { children: Ne.tagIds === null ? "Whole review" : Ne.name }),
            ":",
            " ",
            mo(Ne).join("; ")
          ] }, Ne.key)) })
        ] }),
        K && ae && /* @__PURE__ */ u("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ u("a", { href: Mn(ae), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            da(ae, at),
            " · ",
            ae.item.media.date
          ] }),
          it && /* @__PURE__ */ u("a", { href: Mn(it), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            da(it, at),
            " · ",
            it.item.media.date
          ] })
        ] })
      ] })
    ] });
  }
  function kn() {
    const I = en.filter((J) => J.tagIds === null), K = en.filter((J) => J.tagIds !== null);
    return /* @__PURE__ */ u(he, { children: [
      It(),
      un(I, !1),
      /* @__PURE__ */ u("div", { className: `dq-batch-pick${tt ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ u("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ a("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ a("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ a("div", { className: "dq-batch-answers", children: Xt.map((J, Se) => {
            const ke = $e(J.id);
            return /* @__PURE__ */ u("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ a(
                "input",
                {
                  type: "checkbox",
                  checked: y.includes(J.id),
                  "aria-labelledby": `${me}-answer-${Se}`,
                  "aria-describedby": `${me}-effect-${Se}`,
                  onChange: (Re) => Rn(J.id, Re.target.checked)
                }
              ),
              /* @__PURE__ */ a("span", { className: "dq-batch-answer-key", children: ke && /* @__PURE__ */ a(qt, { binding: ke, hidden: !0 }) }),
              /* @__PURE__ */ u("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ a(
                  "span",
                  {
                    id: `${me}-answer-${Se}`,
                    className: "dq-batch-answer-label",
                    title: J.label,
                    children: J.label
                  }
                ),
                /* @__PURE__ */ a(us, { id: `${me}-effect-${Se}`, parts: Ft(J) })
              ] })
            ] }, J.id);
          }) })
        ] }),
        tt && /* @__PURE__ */ u("div", { className: "dq-batch-side", children: [
          /* @__PURE__ */ a("div", { className: "dq-batch-attention-live", "aria-live": "polite", children: un(K, !1, I.length === 0) }),
          /* @__PURE__ */ a(
            Vi,
            {
              ...Ue,
              mediaKind: at,
              actions: be.actions,
              trees: r,
              flags: Me,
              className: "dq-batch-card"
            }
          )
        ] })
      ] })
    ] });
  }
  function fn(I) {
    const K = bt, J = V && ls.has(V.group) ? V.group : null, Se = J ? pe.filter(Ve[J].test) : [], ke = (Re) => {
      const Ne = Mt(Re), Ae = Ne.skipped ? Hr(
        Re.before.ids,
        ei(Re.before.ids, I.action, I.categories, !0).desired
      ) : qn(Re), yt = !Ae.added.length && !Ae.removed.length;
      return /* @__PURE__ */ u("div", { className: "dq-batch-plan", children: [
        Ne.skipped && /* @__PURE__ */ a("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        yt ? !Ne.kept.length && /* @__PURE__ */ a("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ a(fs, { added: Ae.added, removed: Ae.removed, tag: Qe }),
        Ne.kept.map((Te, ve) => /* @__PURE__ */ u("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          Cr(Te.existing.map(Qe)).map((nt) => /* @__PURE__ */ a(Yt, { tag: nt }, nt.id)),
          " ",
          "instead of",
          " ",
          Cr(Te.tagIds.map(Qe)).map((nt) => /* @__PURE__ */ a(Yt, { tag: nt }, nt.id))
        ] }, ve))
      ] });
    };
    return /* @__PURE__ */ u(he, { children: [
      /* @__PURE__ */ u("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ u("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ a(
            la,
            {
              value: pe.length,
              label: pe.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${K.hosts.toLocaleString()} ${K.hosts === 1 ? Rt : `${Rt}s`}`,
              pressed: gt("matching"),
              onToggle: () => Tt({ group: "matching" })
            }
          ),
          /* @__PURE__ */ a(
            la,
            {
              value: K.willChange,
              label: "will change",
              tone: "add",
              pressed: gt("change"),
              onToggle: () => Tt({ group: "change" })
            }
          ),
          /* @__PURE__ */ a(
            la,
            {
              value: K.correct,
              label: "already correct, no write",
              pressed: gt("correct"),
              onToggle: () => Tt({ group: "correct" })
            }
          ),
          /* @__PURE__ */ a(
            la,
            {
              value: K.different,
              label: v ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: gt("different"),
              onToggle: () => Tt({ group: "different" })
            }
          )
        ] }),
        Se.length > 0 ? /* @__PURE__ */ a(
          ps,
          {
            title: Ve[J].title,
            entries: Se,
            mediaKind: at,
            resultHeading: "Planned change",
            describe: ke
          }
        ) : pe.length > 0 && /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        pe.length > 0 && /* @__PURE__ */ u("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ a("span", { children: ae ? `Dates ${ae.item.media.date}${it ? ` to ${it.item.media.date}` : ""}` : "No dates" }),
          ae && /* @__PURE__ */ a(
            "a",
            {
              href: Mn(ae),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${Ye.one}, ${ae.item.media.date}`,
              title: da(ae, at),
              children: "Open earliest"
            }
          ),
          it && /* @__PURE__ */ a(
            "a",
            {
              href: Mn(it),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${Ye.one}, ${it.item.media.date}`,
              title: da(it, at),
              children: "Open latest"
            }
          ),
          de.length < pe.length && /* @__PURE__ */ u("span", { children: [
            (pe.length - de.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (K.added.length > 0 || K.removed.length > 0) && /* @__PURE__ */ u("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ a("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ a(
            fs,
            {
              added: K.added,
              removed: K.removed,
              tag: Qe,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      K.different > 0 && /* @__PURE__ */ u("div", { className: "dq-batch-choice", children: [
        /* @__PURE__ */ a("span", { id: `${me}-choice`, className: "dq-batch-choice-label", children: "Occurrences with a different answer" }),
        /* @__PURE__ */ u(
          "div",
          {
            className: "dq-segmented dq-segmented-fill",
            role: "group",
            "aria-labelledby": `${me}-choice`,
            children: [
              /* @__PURE__ */ a("button", { type: "button", "aria-pressed": !v, onClick: () => w(!1), children: "Keep their answer" }),
              /* @__PURE__ */ a("button", { type: "button", "aria-pressed": v, onClick: () => w(!0), children: "Replace it" })
            ]
          }
        ),
        /* @__PURE__ */ u("p", { className: "dq-muted", children: [
          "A different answer is a tag the chosen answers would remove",
          fr ? ", or another answer already in a condition category (each condition tag with its subtags); keeping it still fills the empty categories" : "",
          ". Configure opposite answers as removals."
        ] })
      ] })
    ] });
  }
  function Fn() {
    return /* @__PURE__ */ u(he, { children: [
      It(),
      un(en, !0),
      /* @__PURE__ */ u("div", { className: `dq-batch-cards${tt ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ u("section", { className: "dq-batch-card", "aria-labelledby": `${me}-chosen`, children: [
          /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ a("h3", { id: `${me}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", disabled: E, onClick: Bt, children: "Change" })
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-chosen", children: Ut.map((I) => {
            const K = $e(I.id);
            return /* @__PURE__ */ u("li", { children: [
              /* @__PURE__ */ u("span", { className: "dq-batch-chosen-chip", children: [
                K && /* @__PURE__ */ a(qt, { binding: K, hidden: !0 }),
                I.label
              ] }),
              /* @__PURE__ */ a(us, { parts: Ft(I) })
            ] }, I.id);
          }) })
        ] }),
        tt && /* @__PURE__ */ a(
          Vi,
          {
            ...Ue,
            mediaKind: at,
            actions: be.actions,
            trees: r,
            flags: Me,
            className: "dq-batch-card"
          }
        )
      ] }),
      E ? /* @__PURE__ */ a("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ a("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ a("span", {}) }) }) : l && fn(l)
    ] });
  }
  function St(I) {
    const K = Q ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, J = K.kind === "apply" ? pe.length - I.counts.pending : K.done, Se = K.kind === "apply" ? pe.length : K.total, ke = E ? K.kind === "undo" ? "Undoing batch…" : K.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : K.kind === "undo" ? K.stopped ? "Undo stopped" : "Undo finished" : K.stopped ? "Stopped" : "Finished", Re = Se ? Math.round(J / Se * 100) : 100, Ne = V && !ls.has(V.group) ? V.group : null, Ae = (Te) => ds.find((ve) => ve.status === Te).label, yt = Ne ? pe.filter(
      (Te) => Te.status === Ne && (!V.reason || Te.error === V.reason)
    ) : [];
    return /* @__PURE__ */ u(he, { children: [
      /* @__PURE__ */ u("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ a("h3", { tabIndex: -1, "data-batch-focus": "", children: ke }),
          /* @__PURE__ */ u("span", { children: [
            J.toLocaleString(),
            " of ",
            Se.toLocaleString(),
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
            "aria-valuemax": Se,
            "aria-valuenow": J,
            children: /* @__PURE__ */ a("span", { style: { width: `${Re}%` } })
          }
        ),
        !E && K.kind === "undo" && /* @__PURE__ */ u("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (K.total - I.recorded).toLocaleString(),
          " of",
          " ",
          K.total.toLocaleString(),
          " ",
          K.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ u("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ a("div", { className: "dq-batch-stats", "data-count": "5", children: ds.map((Te) => /* @__PURE__ */ a(
          la,
          {
            value: I.counts[Te.status],
            label: Te.label,
            tone: Te.tone,
            pressed: gt(Te.status),
            onToggle: () => Tt({ group: Te.status })
          },
          Te.status
        )) }),
        I.reasons.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-batch-reasons", children: I.reasons.map((Te) => {
          const ve = gt(Te.status, Te.error);
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
                "aria-expanded": ve,
                onClick: () => Tt({ group: Te.status, reason: Te.error }),
                children: ve ? "Hide them" : "Show them"
              }
            )
          ] }, `${Te.status}-${Te.error}`);
        }) }),
        yt.length > 0 ? /* @__PURE__ */ a(
          ps,
          {
            title: V.reason ? `${Ae(Ne)}: ${V.reason}` : `${Ae(Ne)} occurrences`,
            entries: yt,
            mediaKind: at,
            resultHeading: "Result",
            describe: (Te) => Te.error ?? Ae(Te.status)
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
            onClick: () => void dn("undo"),
            children: [
              /* @__PURE__ */ a(Xl, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ u("p", { children: [
          qe ? K.stopped || E ? `${I.recorded.toLocaleString()} ${I.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${I.recorded.toLocaleString()} ${I.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${I.recorded === 1 ? "this change" : `these ${I.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          "It lasts until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function Vn() {
    return d === "answers" ? /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !Ut.length,
        onClick: On,
        children: "Preview all matches"
      },
      "preview"
    ) : d === "preview" ? E ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: Zt, children: "Cancel preview" }, "cancel-preview") : l ? /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !bt.willChange,
        onClick: () => void dn("apply"),
        children: [
          "Apply to ",
          bt.willChange.toLocaleString(),
          " ",
          bt.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : C ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button primary", onClick: Bt, children: "Change answers" }, "change-answers") : /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void Gn(),
        children: "Preview again"
      },
      "again"
    ) : E ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: Zt, children: qe ? "Cancel undo" : "Cancel run" }, "cancel-run") : qe || !j ? null : /* @__PURE__ */ u(Yi, { children: [
      j.retryable && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: () => void dn("retry"), children: "Retry failed" }),
      j.counts.pending > 0 && /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          onClick: () => void dn("apply"),
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
        disabled: t || !Xt.length,
        onClick: () => {
          Oe(), i(), c(!0);
        },
        children: [
          /* @__PURE__ */ a(Uo, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    s && /* @__PURE__ */ u(
      "dialog",
      {
        ref: oe,
        className: "dq-batch-dialog",
        "aria-labelledby": `${me}-title`,
        "aria-modal": "true",
        onCancel: (I) => {
          I.preventDefault(), Xe();
        },
        onClose: () => {
          var I;
          fe.current ? (I = oe.current) == null || I.showModal() : Xe();
        },
        children: [
          /* @__PURE__ */ u("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ a(Uo, { "aria-hidden": "true" }),
            /* @__PURE__ */ a("h2", { id: `${me}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: E,
                onClick: Xe,
                children: /* @__PURE__ */ a(va, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a(Lf, { step: d }),
          /* @__PURE__ */ u(
            "div",
            {
              className: "dq-batch-body",
              ref: W,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": d === "preview" ? "" : void 0,
              "aria-label": `${zi.find((I) => I.id === d).label} step`,
              children: [
                /* @__PURE__ */ u("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  x && /* @__PURE__ */ a("p", { role: "status", children: x }),
                  F && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: F })
                ] }),
                d === "answers" ? kn() : d === "preview" ? Fn() : St(j)
              ]
            }
          ),
          /* @__PURE__ */ u("div", { className: "dq-batch-footer", children: [
            d === "preview" && /* @__PURE__ */ u("button", { type: "button", className: "dq-button", disabled: E, onClick: Bt, children: [
              /* @__PURE__ */ a(Na, { "aria-hidden": "true" }),
              "Back"
            ] }),
            d === "run" && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: E, onClick: Oe, children: "New batch" }),
            /* @__PURE__ */ a("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: E, onClick: Xe, children: "Close" }),
            Vn()
          ] })
        ]
      }
    )
  ] });
}
const tl = "data-quality.description-collapsed.v1";
function jf() {
  try {
    return localStorage.getItem(tl) === "true";
  } catch {
    return !1;
  }
}
function Uf({
  details: e,
  label: t
}) {
  const [n, r] = T(jf), i = In(() => {
    r((o) => {
      const s = !o;
      try {
        localStorage.setItem(tl, String(s));
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
  var h;
  const l = e ? e.ranked.slice(0, e.limit) : [], m = !!e && (e.ranked.length > e.limit || (((h = e.candidates[e.cursor]) == null ? void 0 : h.total) ?? 0) > 0);
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
            N && /* @__PURE__ */ a(jn, { className: "dq-flag-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ a("span", { className: "dq-ranked-count", "aria-hidden": "true", children: g.count.toLocaleString() })
          ]
        },
        g.id
      );
    }) }),
    m && !t && !n && /* @__PURE__ */ a(
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
function Ka(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function Jf(e, t) {
  const n = ro(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", r = e.conditionTagIds.map(
    (o) => t[o] === void 0 ? "…" : t[o] ?? "Unavailable tag"
  ), i = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${Ka(r, "or")}`,
    includesAll: `has ${Ka(r, "and")}`,
    excludes: `has none of ${Ka(r, "or")}`,
    excludesAll: `missing ${Ka(r, "or")}`
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
  const [o, s] = T(!1), [c, d] = T(null), f = $(null), l = $(null), m = rt(), h = Yr(e.conditionTagIds), g = Jf(e, h);
  Ct(() => {
    const w = f.current;
    if (!o || !w) return;
    const E = () => d(zf(w));
    E(), window.addEventListener("resize", E);
    const O = typeof ResizeObserver > "u" ? null : new ResizeObserver(E), F = [w, w.closest(".dq-review-header-trail"), w.closest("header")];
    for (const B of F) B && (O == null || O.observe(B));
    return () => {
      window.removeEventListener("resize", E), O == null || O.disconnect();
    };
  }, [o]), ee(() => {
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
    if (!(w.target instanceof Element && w.target.closest('[role="dialog"]') !== l.current || w.defaultPrevented || ln(w))) {
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
        "aria-controls": o ? m : void 0,
        title: g,
        onClick: () => o ? y() : s(!0),
        children: [
          /* @__PURE__ */ a(Ds, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-summary", children: g }),
          /* @__PURE__ */ a(Zi, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ u(he, { children: [
      /* @__PURE__ */ a("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: y }),
      /* @__PURE__ */ u(
        "div",
        {
          ref: l,
          id: m,
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
                or,
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
                    criteriaDefinitions: Xi,
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
                  children: no.map((w) => /* @__PURE__ */ a("option", { value: w, children: to[w] }, w))
                }
              ),
              v && /* @__PURE__ */ u(he, { children: [
                /* @__PURE__ */ a(
                  or,
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
function Ja(e) {
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
    De(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {}
  ]);
}
async function Wf(e, t) {
  const n = De(e) === "audio", r = (s) => ({
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
      const f = await ge(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            Bn({
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
function nl(e, t, n) {
  const r = To(e, [t]);
  return nc(r, r.view.filter, n);
}
function rl(e, t) {
  const n = e.findIndex(
    (r) => r.count < t.count || r.count === t.count && r.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function Ji(e, t, n, r) {
  if (t >= e.length) return !0;
  const i = e[t].total;
  return i <= 0 ? !0 : n.length >= r && i < n[r - 1].count;
}
async function Yf(e, t, n, r, i = {}) {
  const o = Ja(e), s = Qf(e), c = zc(e.occurrence), d = (t == null ? void 0 : t.signature) === o && !t.partial ? t : {
    signature: o,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: c ? "" : s,
    candidates: c ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await Wf(e, r),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: f } = d, l = [...d.ranked];
  let m = d.cursor, h = !1;
  const g = (y) => ({
    ...d,
    cursor: m,
    ranked: [...l],
    limit: n,
    complete: !y && Ji(f, m, l, n),
    ...y ? { partial: y } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: i.concurrency ?? 6 }, async () => {
        var y;
        for (; !h && !Ji(f, m, l, n); ) {
          r.throwIfAborted();
          const N = f[m++], v = await nl(e, N.id, r);
          v > 0 && rl(l, { ...N, count: v }), (y = i.onProgress) == null || y.call(i, g(!0));
        }
      })
    );
  } catch (y) {
    throw h = !0, y;
  }
  return r.throwIfAborted(), g(!1);
}
function Xf(e, t, n) {
  const r = e.candidates.findIndex((o) => o.id === t);
  if (e.partial || r < 0 || r >= e.cursor) return e;
  const i = e.ranked.filter((o) => o.id !== t);
  return n > 0 && rl(i, { ...e.candidates[r], count: n }), {
    ...e,
    ranked: i,
    complete: Ji(e.candidates, e.cursor, i, e.limit)
  };
}
const Hi = /* @__PURE__ */ new Map();
function Zf(e) {
  return Array.isArray(e) ? e.flatMap(
    (t) => t && Number.isSafeInteger(t.id) && typeof t.name == "string" ? [{ id: t.id, name: t.name }] : []
  ) : [];
}
function al(e, t) {
  const n = Zf(t);
  return Hi.set(e, n), n;
}
function ep(e) {
  const [t, n] = T(null);
  if (ee(() => {
    if (e === null || Hi.has(e)) return;
    const r = new AbortController();
    return ge(`/api/performers/${e}`, { signal: r.signal }).then(
      (i) => {
        const o = al(e, i == null ? void 0 : i.tags);
        r.signal.aborted || n({ id: e, tags: o });
      },
      () => {
      }
    ), () => r.abort();
  }, [e]), e !== null)
    return Hi.get(e) ?? ((t == null ? void 0 : t.id) === e ? t.tags : void 0);
}
var Si = { exports: {} }, hs;
function tp() {
  return hs || (hs = 1, (function(e) {
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
          for (var f = c.compress(d), l = new Uint8Array(f.length * 2), m = 0, h = f.length; m < h; m++) {
            var g = f.charCodeAt(m);
            l[m * 2] = g >>> 8, l[m * 2 + 1] = g % 256;
          }
          return l;
        },
        //decompress from uint8array (UCS-2 big endian format)
        decompressFromUint8Array: function(d) {
          if (d == null)
            return c.decompress(d);
          for (var f = new Array(d.length / 2), l = 0, m = f.length; l < m; l++)
            f[l] = d[l * 2] * 256 + d[l * 2 + 1];
          var h = [];
          return f.forEach(function(g) {
            h.push(n(g));
          }), c.decompress(h.join(""));
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
          var m, h, g = {}, y = {}, N = "", v = "", w = "", E = 2, O = 3, F = 2, B = [], C = 0, L = 0, x;
          for (x = 0; x < d.length; x += 1)
            if (N = d.charAt(x), Object.prototype.hasOwnProperty.call(g, N) || (g[N] = O++, y[N] = !0), v = w + N, Object.prototype.hasOwnProperty.call(g, v))
              w = v;
            else {
              if (Object.prototype.hasOwnProperty.call(y, w)) {
                if (w.charCodeAt(0) < 256) {
                  for (m = 0; m < F; m++)
                    C = C << 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++;
                  for (h = w.charCodeAt(0), m = 0; m < 8; m++)
                    C = C << 1 | h & 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, h = h >> 1;
                } else {
                  for (h = 1, m = 0; m < F; m++)
                    C = C << 1 | h, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, h = 0;
                  for (h = w.charCodeAt(0), m = 0; m < 16; m++)
                    C = C << 1 | h & 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, h = h >> 1;
                }
                E--, E == 0 && (E = Math.pow(2, F), F++), delete y[w];
              } else
                for (h = g[w], m = 0; m < F; m++)
                  C = C << 1 | h & 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, h = h >> 1;
              E--, E == 0 && (E = Math.pow(2, F), F++), g[v] = O++, w = String(N);
            }
          if (w !== "") {
            if (Object.prototype.hasOwnProperty.call(y, w)) {
              if (w.charCodeAt(0) < 256) {
                for (m = 0; m < F; m++)
                  C = C << 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++;
                for (h = w.charCodeAt(0), m = 0; m < 8; m++)
                  C = C << 1 | h & 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, h = h >> 1;
              } else {
                for (h = 1, m = 0; m < F; m++)
                  C = C << 1 | h, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, h = 0;
                for (h = w.charCodeAt(0), m = 0; m < 16; m++)
                  C = C << 1 | h & 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, h = h >> 1;
              }
              E--, E == 0 && (E = Math.pow(2, F), F++), delete y[w];
            } else
              for (h = g[w], m = 0; m < F; m++)
                C = C << 1 | h & 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, h = h >> 1;
            E--, E == 0 && (E = Math.pow(2, F), F++);
          }
          for (h = 2, m = 0; m < F; m++)
            C = C << 1 | h & 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, h = h >> 1;
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
          var m = [], h = 4, g = 4, y = 3, N = "", v = [], w, E, O, F, B, C, L, x = { val: l(0), position: f, index: 1 };
          for (w = 0; w < 3; w += 1)
            m[w] = w;
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
          for (m[3] = L, E = L, v.push(L); ; ) {
            if (x.index > d)
              return "";
            for (O = 0, B = Math.pow(2, y), C = 1; C != B; )
              F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
            switch (L = O) {
              case 0:
                for (O = 0, B = Math.pow(2, 8), C = 1; C != B; )
                  F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
                m[g++] = n(O), L = g - 1, h--;
                break;
              case 1:
                for (O = 0, B = Math.pow(2, 16), C = 1; C != B; )
                  F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
                m[g++] = n(O), L = g - 1, h--;
                break;
              case 2:
                return v.join("");
            }
            if (h == 0 && (h = Math.pow(2, y), y++), m[L])
              N = m[L];
            else if (L === g)
              N = E + E.charAt(0);
            else
              return null;
            v.push(N), m[g++] = E + N.charAt(0), h--, E = N, h == 0 && (h = Math.pow(2, y), y++);
          }
        }
      };
      return c;
    })();
    e != null ? e.exports = t : typeof angular < "u" && angular != null && angular.module("LZString", []).factory("LZString", function() {
      return t;
    });
  })(Si)), Si.exports;
}
var il = tp();
function sr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, c) => sr(s, t[c]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, r = t, i = Object.keys(n).sort(), o = Object.keys(r).sort();
  return i.length === o.length && i.every(
    (s, c) => s === o[c] && sr(n[s], r[s])
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
  return ee(() => {
    let l = !0;
    return n({}), i(""), Promise.all(
      JSON.parse(s).map(
        async (m) => [m, await oi([m])]
      )
    ).then((m) => {
      l && n(Object.fromEntries(m));
    }).catch(() => {
      l && i(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      l = !1;
    };
  }, [s]), { ids: t, error: r };
}
function ol(e, t, n) {
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
  const r = ol(e, t, n), i = t == null ? void 0 : t.presentation, o = (i == null ? void 0 : i.annotations) ?? [];
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
  ), d = s.every((v) => r[v]), f = Or(
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
  const m = f.filter((v) => !l.has(v)), h = Yr(m);
  for (const v of m)
    l.set(v, {
      name: h[v] === void 0 ? "…" : h[v] ?? "Unavailable tag",
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
  var m, h;
  const c = ((m = e.presentation) == null ? void 0 : m.filterBins) ?? [], d = Or(e.view.objectFilter, t, c).bins, f = op(e, t, n, o);
  if (!c.length) return null;
  const l = /* @__PURE__ */ new Map();
  for (const g of c) {
    const y = ((h = g.group) == null ? void 0 : h.trim()) ?? "";
    l.set(y, [...l.get(y) ?? [], g]);
  }
  return /* @__PURE__ */ a(he, { children: [...l].map(([g, y]) => /* @__PURE__ */ u(
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
  ]), f = $(null);
  return ee(() => {
    var y, N;
    if (r || f.current === d) return;
    f.current = d, o({});
    let m = 0;
    const h = new AbortController(), g = Or(
      e.view.objectFilter,
      t,
      (y = e.presentation) == null ? void 0 : y.filterBins
    ).bins;
    for (const v of ((N = e.presentation) == null ? void 0 : N.filterBins) ?? [])
      g.includes(v.key) || (m++, nc(cl(e, v.key, t), n, h.signal).then((w) => {
        h.signal.aborted || o((E) => ({ ...E, [v.key]: w }));
      }).catch(() => {
      }).finally(() => {
        h.signal.aborted || m--;
      }));
    return () => {
      m > 0 && (f.current = null), h.abort();
    };
  }, [d, r]), i;
}
function Er(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function sp(e) {
  if (!Er(e) || Object.keys(e).length !== 1 || !Er(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !Er(t.tagsCriterion)) return null;
  const { value: n, modifier: r, depth: i, ...o } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && r === "INCLUDES" && i === 0 && !Object.keys(o).length ? n[0] : null;
}
function sl(e) {
  const { _filterExpression: t, ...n } = e;
  return t ? Object.keys(n).length ? {
    group: { operator: "AND", children: [{ filter: n }, { group: t }] }
  } : { group: t } : { filter: n };
}
function cp(e, t) {
  const n = t.find(
    (r) => sr(e, sl(r.filter))
  );
  return n ? n.key : sp(e);
}
function Or(e, t, n = []) {
  let r = e;
  const i = [];
  for (; ; ) {
    if (t && sr(r, t)) {
      r = t;
      break;
    }
    const o = Object.keys(r);
    if (o.length !== 1 || o[0] !== "_filterExpression") break;
    const s = r._filterExpression;
    if (!Er(s) || s.operator !== "AND" || !Array.isArray(s.children))
      break;
    const c = s.children, d = cp(c.at(-1), n);
    if (d == null || c.length > 3) break;
    let f = {}, l = null, m = !0;
    for (const [h, g] of c.slice(0, -1).entries())
      !Er(g) || Object.keys(g).length !== 1 ? m = !1 : h === 0 && Er(g.filter) && Object.keys(g.filter).length ? f = g.filter : !l && Er(g.group) ? l = g.group : m = !1;
    if (!m) break;
    i.unshift(d), r = l ? { ...f, _filterExpression: l } : f;
  }
  return { base: r, bins: i };
}
function cl(e, t, n) {
  var f;
  const r = ((f = e.presentation) == null ? void 0 : f.filterBins) ?? [], { base: i, bins: o } = Or(e.view.objectFilter, n, r), s = (l) => {
    var m, h;
    return ((h = (m = r.find((g) => g.key === l)) == null ? void 0 : m.group) == null ? void 0 : h.trim()) || null;
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
    n = sl(c.filter);
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
const ci = [
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
function $r(e) {
  const t = Ce(e) ? e.occurrence : void 0;
  return {
    filter: Wt({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, De(e)),
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
function ms(e) {
  return il.compressToEncodedURIComponent(JSON.stringify(e));
}
function gs(e) {
  if (!e) return {};
  const t = e.startsWith("{") ? e : il.decompressFromEncodedURIComponent(e), n = t ? JSON.parse(t) : null;
  if (!n || typeof n != "object" || Array.isArray(n))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return n;
}
function Qi(e, t) {
  let n;
  if (Ce(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!ci.some((c) => c !== "performer" && t.has(c))) {
    const c = $r(e);
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
  if (Ce(e) && (o = {
    ...dp,
    ...gs(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(o.targetMode) || !no.includes(o.condition) || !Array.isArray(o.performerIds) || !Array.isArray(o.conditionTagIds) || typeof o.includeSubtags != "boolean" || typeof o.hideConfirmedAbsent != "boolean" || [...o.performerIds, ...o.conditionTagIds].some(
    (c) => !Number.isSafeInteger(c) || c <= 0
  ) || !o.performerFilter || typeof o.performerFilter != "object" || Array.isArray(o.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Wt(i, De(e)),
      objectFilter: gs(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: o,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
const bs = { dataQualityOpenedFromList: !0 };
function ll() {
  const e = window.history.state;
  return !!e && typeof e == "object" && e.dataQualityOpenedFromList === !0;
}
function dl(e, { openingFromList: t = !1 } = {}) {
  t ? window.history.pushState({ ...bs }, "", e) : window.history.replaceState(ll() ? { ...bs } : null, "", e);
}
function fa(e, t) {
  const n = new URLSearchParams(window.location.search);
  ci.forEach((r) => n.delete(r)), n.set("review", e);
  for (const r of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[r] !== void 0 && n.set(r, String(t.filter[r]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((r) => `${r.key}:${r.direction}`).join(",")
  ), n.set("filters", ms(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", ms(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), dl(`${window.location.pathname}?${n}${window.location.hash}`);
}
function $n(e, t) {
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
function Tr(e) {
  const t = e;
  return $n(t, $r(t));
}
function ys(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !sr(
    JSON.parse(nr($n(e, t))),
    JSON.parse(nr($n(e, $r(e))))
  );
}
function Oo(...e) {
  return e.flatMap(
    (t) => {
      var n;
      return Le(t) === "video" ? ((n = t.presentation) == null ? void 0 : n.filterBins) ?? [] : [];
    }
  );
}
function ul(e, t) {
  if (Le(e) !== "video") return e;
  const { base: n, bins: r } = Or(
    e.view.objectFilter,
    t.view.objectFilter,
    Oo(e, t)
  );
  return r.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function Ga(e, t) {
  if (Le(e) !== "video") return t;
  const { base: n, bins: r } = Or(
    t.objectFilter,
    e.view.objectFilter,
    Oo(e)
  );
  return r.length ? { ...t, objectFilter: n } : t;
}
function ws(e, t) {
  return !t || !Ce(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function ki(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const r of e)
    n.set(r.media.id, [...n.get(r.media.id) ?? [], r]);
  return [...n.values()].reverse().flat();
}
const Qt = (e) => e instanceof Error ? e.message : "Request failed.", up = (e) => /[.!?]$/.test(e.trim()) ? e.trim() : `${e.trim()}.`, Ei = 50, fp = [], vs = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function pp(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? Ul(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? Fs(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function hp({ media: e, kind: t }) {
  const [n, r] = T(!1);
  return /* @__PURE__ */ a("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ a(js, {}) : /* @__PURE__ */ a(ri, {}) : /* @__PURE__ */ a(
    "img",
    {
      src: Oi(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => r(!0)
    }
  ) });
}
function mp({
  tags: e,
  preview: t,
  editor: n,
  tagsChangedSinceEditing: r = !1,
  trees: i,
  actionTagIds: o,
  label: s
}) {
  const c = !!n && !r, d = vo(t), f = n ? null : d, l = e == null ? void 0 : e.absent, m = ka(
    we(() => [...o, ...l ?? []], [o, l])
  ), h = (Q) => m[Q] ?? { id: Q, name: m[Q] === void 0 ? "…" : "Unavailable tag" }, g = (Q) => Cr(Q.map(h)), y = f && e ? po(f, e, i) : null, N = e ? Qd(e) : [], v = new Set(N.map((Q) => Q.id)), w = new Set(y == null ? void 0 : y.removed), E = new Set(y == null ? void 0 : y.markedAbsent), O = new Set(y == null ? void 0 : y.absenceCleared), F = /* @__PURE__ */ u("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ a(Ha, { "aria-hidden": "true" }),
    "absent"
  ] }), B = g((y == null ? void 0 : y.added) ?? []), C = g(((y == null ? void 0 : y.markedAbsent) ?? []).filter((Q) => !v.has(Q))), L = c ? "h3" : "h4", x = !!(e != null && e.absent.length) && /* @__PURE__ */ u(he, { children: [
    /* @__PURE__ */ a(L, { className: "dq-subheading", children: "Confirmed absent" }),
    /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: g(e.absent).map((Q) => /* @__PURE__ */ u(
      "li",
      {
        className: `dq-tag dq-tag-absent${O.has(Q.id) ? " dq-tag-removed" : ""}`,
        children: [
          /* @__PURE__ */ a(Ha, { "aria-hidden": "true" }),
          O.has(Q.id) ? /* @__PURE__ */ u("del", { children: [
            "− ",
            /* @__PURE__ */ a(Yt, { tag: Q })
          ] }) : /* @__PURE__ */ a(Yt, { tag: Q })
        ]
      },
      Q.id
    )) })
  ] }), re = /* @__PURE__ */ u("section", { className: "dq-panel-section", "aria-label": s, children: [
    /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ u(he, { children: [
      N.length || B.length || C.length ? /* @__PURE__ */ u("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        N.map(
          (Q) => w.has(Q.id) ? /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ u("del", { children: [
              "− ",
              /* @__PURE__ */ a(Yt, { tag: Q })
            ] }),
            E.has(Q.id) && F
          ] }, Q.id) : /* @__PURE__ */ a("li", { className: "dq-tag", children: /* @__PURE__ */ a(Yt, { tag: Q }) }, Q.id)
        ),
        B.map((Q) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
          "+ ",
          /* @__PURE__ */ a(Yt, { tag: Q })
        ] }) }, `added-${Q.id}`)),
        C.map((Q) => /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ a("ins", { children: /* @__PURE__ */ a(Yt, { tag: Q }) }),
          F
        ] }, `absent-${Q.id}`))
      ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "None" }),
      x
    ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "Loading…" })
  ] });
  return /* @__PURE__ */ u(he, { children: [
    !c && re,
    n,
    c && x && /* @__PURE__ */ a("section", { className: "dq-panel-section", "aria-label": "Confirmed absent", children: x })
  ] });
}
function gp({ entries: e }) {
  return /* @__PURE__ */ a("ul", { className: "dq-attention", "aria-label": "Needs attention", children: e.map((t) => /* @__PURE__ */ u("li", { className: "dq-attention-item", children: [
    t.tagIds !== null && /* @__PURE__ */ a("span", { className: "dq-attention-category", children: t.name }),
    mo(t).map((n) => /* @__PURE__ */ u("span", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
      /* @__PURE__ */ a(jn, { "aria-hidden": "true" }),
      n
    ] }, n))
  ] }, t.key)) });
}
function bp({
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
  var _r;
  const l = De(e), m = Kn(l), h = l === "audio" ? "Audio" : "Scene", g = (p) => {
    var k;
    return p.title || ((k = p.files[0]) == null ? void 0 : k.basename) || h;
  }, y = (p) => `${p.occurrence ? `${p.occurrence.performer.name} — ` : ""}${g(p.media)}`, N = $(null), v = $("");
  if (!N.current)
    try {
      N.current = Qi(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (p) {
      v.current = Qt(p), N.current = { query: $r(e), startAtEnd: !1 };
    }
  const [w, E] = T(null), [O, F] = T(""), B = $(null), C = $(null), L = $(null), x = $(null), [re, Q] = T(!!v.current), _ = $(0), [V, M] = T(N.current.query), D = $(V);
  D.current = V;
  const [P, X] = T(0), Y = $(N.current.startAtEnd), [oe, W] = T([]), [S, ce] = T(null), A = $(null), [Z, le] = T(null), [fe, G] = T(0), me = we(() => {
    var H;
    if (!S) return null;
    const p = oe.findIndex((se) => se.key === S.key), k = ((H = A.current) == null ? void 0 : H.key) === S.key ? A.current : null;
    return (p >= 0 ? oe.slice(p + 1) : k ? oe.filter((se) => !k.before.includes(se.key)) : []).find((se) => se.media.id !== S.media.id) ?? null;
  }, [S, oe]), [Ee, qe] = T(0), [be, Je] = T(!1), [ue, at] = T(!1), Ye = $(!1), Rt = $(0), Xt = $(!1), Ut = $(null), tt = $(!0), Ue = $(null);
  ee(() => (tt.current = !0, () => {
    tt.current = !1;
  }), []);
  const [Be, He] = T(v.current), [dr, Qe] = T(""), [Ke, ut] = T(null), [Oe, Xe] = T(!1), [Rn, Bt] = T([]), On = $([]), Zt = $(null), Tt = $(null), gt = $(null);
  ee(() => {
    var p, k;
    Oe && ((k = (p = gt.current) == null ? void 0 : p.querySelector("input")) == null || k.focus());
  }, [Oe]);
  const Gn = $(null);
  ee(() => {
    if (ue) return;
    const p = Gn.current;
    Gn.current = null;
    const k = document.activeElement;
    p != null && p.isConnected && (!k || k === document.body) && p.focus();
  }, [ue]);
  const [dn, pe] = T(!1), [Ot, Mt] = T(!1), qn = Ea(), [ur, Ge] = T(!1), bt = d ?? ur, de = f ?? Ge;
  ee(() => {
    if (be || dn || !Tt.current) return;
    const p = requestAnimationFrame(() => {
      if (document.querySelector(vs)) return;
      const k = Tt.current;
      Tt.current = null;
      const U = document.activeElement;
      U && U !== document.body || k != null && k.isConnected && !k.disabled && k.focus();
    });
    return () => cancelAnimationFrame(p);
  }, [be, dn, P]);
  const [j, $e] = T([]), [Ft, fr] = T({}), ae = $(null), [it, Mn] = T({});
  ee(() => {
    let p = !0;
    return Promise.all(
      Eo(V.objectFilter).map(
        async (k) => [
          String(k),
          (await ge(`/api/tags/${k}`)).name
        ]
      )
    ).then((k) => {
      p && Mn(Object.fromEntries(k));
    }).catch(() => {
    }), () => {
      p = !1;
    };
  }, [V.objectFilter]);
  const Sn = we(
    () => Ao(V.objectFilter, it),
    [it, V.objectFilter]
  ), Kt = $(0), en = $(e);
  en.current = e;
  const Me = w ?? e, Ve = we(
    () => $n(Me, V),
    [Me, V]
  ), It = we(
    () => ws(Ve, V.performerFocus),
    [Ve, V.performerFocus]
  ), un = $(It);
  un.current = It;
  const kn = $(Ve);
  kn.current = Ve;
  const [fn, Fn] = T("items"), [St, Vn] = T(null), I = $(null), K = $("");
  function J(p) {
    const k = typeof p == "function" ? p(I.current) : p;
    I.current = k, Vn(k);
  }
  const [Se, ke] = T(!1), [Re, Ne] = T(null), Ae = $(null), yt = Ce(Ve) ? Ja(Ve) : "", [Te, ve] = T(0), [nt, We] = T(null);
  ee(() => () => {
    var p;
    return (p = Ae.current) == null ? void 0 : p.controller.abort();
  }, []), ee(() => {
    const p = Ae.current;
    !p || p.signature === yt || (p.controller.abort(), Ae.current = null, ke(!1));
  }, [yt]), ee(() => {
    var U;
    const p = I.current;
    if (fn !== "performers" || !yt || ((U = Ae.current) == null ? void 0 : U.signature) === yt || K.current === yt || (p == null ? void 0 : p.signature) === yt && p.complete)
      return;
    const k = (p == null ? void 0 : p.signature) === yt ? p : null;
    Gt(p, (k == null ? void 0 : k.limit) ?? Ei);
  }, [fn, yt, St, Re, Se]);
  const pn = V.performerFocus;
  ee(() => {
    if (!pn) {
      We(null);
      return;
    }
    let p = !0;
    return ge(`/api/performers/${pn}`).then((k) => {
      const U = al(pn, k.tags);
      p && We({ id: pn, name: k.name, tags: U });
    }).catch(() => {
    }), () => {
      p = !1;
    };
  }, [pn]);
  const xn = JSON.stringify(
    Ce(Ve) ? Gs(Ve.occurrence) : []
  ), xt = we(() => JSON.parse(xn), [xn]), Xr = we(() => Zd(xt), [xt]), Zr = dc(Xr), $t = ka(Xr), tn = (p) => {
    var k;
    return ((k = $t[p]) == null ? void 0 : k.name) ?? ($t[p] === null ? "Unavailable tag" : "…");
  }, pr = (p) => ({
    name: tn(p),
    tagIds: Zr.get(p) ?? [p],
    resolved: Zr.has(p)
  }), hn = el(
    Ce(Ve) ? Ve : null,
    pn ?? null,
    Te
  ), Mr = ys(e, V), ft = ys(e, Ga(e, V)), ze = ue || be || Oe, pt = Number(V.filter.page);
  function _e(p, k = !1) {
    Ye.current || (Rt.current++, v.current = "", Y.current = k, D.current = p, M(p), qe(0), Je(!0), k || fa(e.id, p), X((U) => U + 1));
  }
  function Pt() {
    if (Ye.current = !1, at(!1), tt.current && Ue.current) {
      const p = Ue.current;
      Ue.current = null, _e(p.query, p.startAtEnd);
    }
  }
  ee(() => {
    const p = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const k = Qi(
            en.current,
            new URLSearchParams(window.location.search)
          );
          Ye.current ? Ue.current = k : _e(k.query, k.startAtEnd);
        } catch (k) {
          He(Qt(k));
        }
    };
    return window.addEventListener("popstate", p), () => window.removeEventListener("popstate", p);
  }, [e.id]), ee(() => (r(ue || be || Oe || !!w), () => r(!1)), [ue, be, Oe, !!w, r]);
  async function kt(p, k, U) {
    if (Ce(p)) {
      const se = await Jc(
        p,
        ae.current,
        k,
        U
      );
      return {
        items: se.items.map((ye) => ({
          key: ye.key,
          media: ye.media,
          occurrence: ye
        })),
        totalCount: se.totalCount
      };
    }
    const H = await Kr(
      p,
      { ...p.view.filter, page: k },
      U
    );
    return {
      items: H.items.map((se) => ({ key: String(se.id), media: se })),
      totalCount: H.totalCount
    };
  }
  function Fr(p, k, U, H = !1, se = !1) {
    if (!tt.current || Ue.current) return;
    Q(!0), W(
      se ? p.items : ki(p.items, D.current.startFrom === "end")
    ), qe(p.totalCount), mn(U, H);
    const ye = {
      ...D.current,
      filter: { ...D.current.filter, page: k }
    };
    D.current = ye, M(ye), fa(e.id, ye);
  }
  function mn(p, k = !1) {
    Rt.current++, (p == null ? void 0 : p.key) !== (S == null ? void 0 : S.key) && (A.current = null), (p == null ? void 0 : p.media.id) !== (S == null ? void 0 : S.media.id) && le(k && p ? p.media.id : null), ce(p);
  }
  ee(() => {
    if (v.current) return;
    const p = new AbortController();
    x.current = p;
    const k = ++Kt.current;
    return Je(!0), He(""), Qe(""), A.current = null, le(null), ce(null), W([]), Xe(!1), (async () => {
      const U = ws(
        $n(en.current, D.current),
        D.current.performerFocus
      );
      ae.current = Ce(U) ? await Co(U, p.signal) : null;
      let H = Number(U.view.filter.page), se = await kt(U, H, p.signal);
      const ye = Math.max(
        1,
        Math.ceil(se.totalCount / Number(U.view.filter.perPage))
      );
      (Y.current || H > ye) && (H = ye, se = await kt(U, H, p.signal)), Y.current = !1;
      const Ze = U.view.startFrom === "end" ? -1 : 1;
      for (; Ce(U) && !se.items.length && H + Ze >= 1 && H + Ze <= ye && !p.signal.aborted; )
        H += Ze, se = await kt(U, H, p.signal);
      if (k !== Kt.current || p.signal.aborted) return;
      const Dt = ki(se.items, U.view.startFrom === "end");
      Fr(se, H, Dt[0] ?? null);
    })().catch((U) => {
      !p.signal.aborted && k === Kt.current && He(Qt(U));
    }).finally(() => {
      !p.signal.aborted && k === Kt.current && (Q(!0), Je(!1));
    }), () => {
      p.abort(), Kt.current++;
    };
  }, [P, e.id]);
  const gn = $(null);
  ee(() => {
    if ((S == null ? void 0 : S.key) !== gn.current && ut(null), gn.current = (S == null ? void 0 : S.key) ?? null, !S) return;
    let p = !0;
    return Nn(l, S).then((k) => {
      p && (ut(k), $e(
        Ce(e) ? k.ids.filter((U) => e.occurrence.tagIds.includes(U)) : []
      ));
    }).catch((k) => {
      p && He(`Could not load current tags. ${Qt(k)}`);
    }), () => {
      p = !1;
    };
  }, [S]), ee(() => {
    if (!Ce(e) || e.actions.length)
      return;
    let p = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (k) => [
          k,
          (await ge(`/api/tags/${k}`)).name
        ]
      )
    ).then((k) => {
      p && fr(Object.fromEntries(k));
    }).catch((k) => {
      p && He(Qt(k));
    }), () => {
      p = !1;
    };
  }, [e]);
  function bn(p, k = A.current) {
    const U = oe.findIndex((vt) => vt.key === p.key), H = V.startFrom === "end" ? -1 : 1, se = (k == null ? void 0 : k.key) === p.key, ye = se ? k : { key: p.key, page: pt, before: oe.slice(0, U + 1).map((vt) => vt.key), after: oe.slice(U + 1).map((vt) => vt.key) }, Ze = new Set(ye.after), Dt = new Set(ye.before), an = oe.find((vt) => Ze.has(vt.key) || (H === 1 || pt < ye.page) && se && !Dt.has(vt.key));
    return { direction: H, cursor: ye, remainingKeys: Ze, visitedKeys: Dt, nextLoaded: an };
  }
  async function hr(p = !1, k = !1, U = !1, H = () => !0, se = A.current) {
    if (!S) return;
    const { direction: ye, cursor: Ze, remainingKeys: Dt, visitedKeys: an, nextLoaded: vt } = bn(S, se);
    if (!p && vt) {
      mn(vt, U);
      return;
    }
    const Et = p ? an : new Set(oe.map((zt) => zt.key));
    let ct = ye === -1 && !p ? Math.max(1, pt - 1) : pt;
    for (; tt.current && !Ue.current; ) {
      let zt = await kt(It, ct);
      const ot = Math.max(
        1,
        Math.ceil(zt.totalCount / Number(V.filter.perPage))
      );
      ct > ot && (ct = ot, zt = await kt(It, ct));
      const mt = ki(zt.items, ye === -1), Tn = new Map(mt.map((_t) => [_t.key, _t])), jr = p ? Ze.after.flatMap((_t) => {
        const xa = Tn.get(_t);
        return xa ? [xa] : [];
      }) : [], Nr = new Set(jr.map((_t) => _t.key)), Ln = p ? {
        ...zt,
        items: [
          ...jr,
          ...mt.filter(
            (_t) => _t.key !== S.key && !Nr.has(_t.key)
          )
        ]
      } : { ...zt, items: mt };
      if (!H()) return;
      if (k) {
        A.current = Ze, Fr(Ln, ct, S, !1, !0);
        return;
      }
      const oa = ye === -1 && pt === 1 && !p ? void 0 : Ln.items.find(
        (_t) => !Et.has(_t.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(p && ye === -1 && ct === Ze.page) || Dt.has(_t.key))
      );
      if (oa || (ye === -1 ? ct <= 1 : ct >= ot)) {
        Fr(
          Ln,
          ct,
          oa ?? null,
          U,
          !0
        ), oa || Qe(
          zt.totalCount ? `Reached the end in this direction. Matching items remain available from the ${m.queue} pages.` : `No matching ${m.many}.`
        );
        return;
      }
      ct += ye;
    }
  }
  async function Lt(p, k = !1, U = !1, H = !1) {
    var zt;
    if (Xt.current && p && S && !U && !H && !w && !Oe) {
      Ut.current = { action: p, stay: k, key: S.key };
      return;
    }
    if (w || !S || Ye.current || be || Oe && !U)
      return;
    const se = U || H || !!(p != null && p.steps.length);
    if (se && (!t || !Ke) || p && ir(p) && !n) return;
    const ye = !k && !U && !H && se && p !== void 0 && Ke !== null && Qo(e) && Pi(xi(e.actions, Yd(p, Ke, yn))).length > 0, Ze = U && ((zt = gt.current) != null && zt.contains(document.activeElement)) ? document.activeElement : null;
    Ye.current = !0, at(!0), He(""), Qe(""), Xt.current = !0;
    const Dt = A.current, an = se && !k && !ye ? bn(S).nextLoaded ?? null : null;
    an && (W(
      (ot) => ot.filter((mt) => mt.key !== S.key)
    ), mn(an, !0));
    let vt = !1, Et = !1, ct = [];
    try {
      if (se) {
        const ot = await Nn(l, S);
        if (p)
          await Sf(It, S, p);
        else {
          const Tn = H && Ce(e) ? e.occurrence.tagIds.filter((Ln) => ot.ids.includes(Ln)) : On.current, Nr = Hr(Tn, H ? j : Rn);
          await $o(It, S, Nr);
        }
        const mt = await Nn(l, S);
        an || ut(mt), Et = !0, Xe(!1), ye && (ct = Pi(xi(e.actions, mt))), Qe(
          ct.length ? `Tags saved. Staying until answered: ${ct.map((Tn) => Tn.name).join(", ")}.` : "Tags saved."
        ), S.occurrence && (An(S.occurrence.performer.id), ve((Tn) => Tn + 1));
      }
      if (!tt.current || Ue.current) return;
      if (se)
        if (an) {
          const ot = Rt.current;
          vt = !0, Xt.current = !1, Pt(), hr(!0, !1, !0, () => Rt.current === ot && !Ye.current, Dt).catch((mt) => {
            Rt.current === ot && He(`Tags saved, but the queue could not refresh. Retry navigation with Skip. ${Qt(mt)}`);
          });
        } else ct.length || await hr(!0, k, !k);
      else k || await hr();
      k && U && requestAnimationFrame(() => {
        var ot;
        return (ot = Zt.current) == null ? void 0 : ot.focus();
      });
    } catch (ot) {
      if (He(
        Et ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${Qt(ot)}` : se ? `Saving stopped. ${up(Qt(ot))}${U || H ? " Your choices are kept." : ""} Check the current tags before retrying.` : `Could not advance. ${Qt(ot)}`
      ), se && !Et) {
        Gn.current = Ze, an && (W(oe), le(null), G((mt) => mt + 1), ce(S), A.current = Dt);
        try {
          ut(await Nn(l, S));
        } catch {
          ut(null), He(
            (mt) => `${mt} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      vt || (Xt.current = !1, Pt());
    }
  }
  ee(() => {
    const p = Ut.current;
    if (!(!p || ue || Ye.current)) {
      if ((S == null ? void 0 : S.key) !== p.key || Be) {
        Ut.current = null;
        return;
      }
      Ke && (Ut.current = null, Lt(p.action, p.stay));
    }
  }, [ue, Ke, S, Be]);
  const Aa = !Oe && !w && !dn && !Ot && (S != null || be || ue);
  go({
    surface: "local",
    enabled: Aa,
    actions: e.actions,
    onAction: (p, k) => {
      const U = e.actions[p];
      U && Lt(U, k);
    },
    onFind: () => Mt(!0)
  });
  const Ie = (p) => ue || be || !Ke || !!w || !t && p.steps.length > 0 || !n && ir(p);
  function zn() {
    !i || w || Ye.current || Oe || (L.current = document.activeElement, C.current = {
      error: Be,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(D.current),
      items: oe,
      current: S,
      total: Ee,
      targets: ae.current,
      stayedCursor: A.current
    }, Rt.current++, E(structuredClone(e)), F(""), Qe(""), He(""));
  }
  ee(() => {
    if (!o) {
      _.current = 0;
      return;
    }
    o !== _.current && re && !be && (_.current = o, zn(), s == null || s());
  }, [o, be, re]);
  function En() {
    E(null), F(""), requestAnimationFrame(() => {
      const p = L.current;
      p != null && p.isConnected && p !== document.body && p.focus();
    });
  }
  function Ca() {
    var k;
    const p = C.current;
    !p || ue || ((k = x.current) == null || k.abort(), Kt.current++, D.current = p.query, M(p.query), W(p.items), ce(p.current), qe(p.total), ae.current = p.targets, A.current = p.stayedCursor, Je(!1), He(p.error), Qe(""), window.history.replaceState(window.history.state, "", p.url), En());
  }
  async function Jn() {
    if (!w || !i || Ye.current) return;
    const p = $n(
      { ...w, name: w.name.trim() },
      Ga(en.current, D.current)
    ), k = ga(p);
    if (k) {
      F(k);
      return;
    }
    Ye.current = !0, at(!0), F("");
    try {
      if (await i(p) === !1) throw new Error("Could not save review.");
      En(), Qe("Review saved.");
    } catch (U) {
      F(
        "Could not save review. Your edits are still open. " + Qt(U)
      );
    } finally {
      Pt();
    }
  }
  async function li() {
    if (!i || Ye.current) return;
    const p = Ga(en.current, D.current), k = $n(en.current, {
      ...p,
      filter: { ...p.filter, page: 1 }
    });
    Ye.current = !0, at(!0), He("");
    try {
      if (await i(k) === !1) throw new Error("Could not save review.");
      Qe("Queue saved to this review.");
    } catch (U) {
      He("Could not save queue. " + Qt(U));
    } finally {
      Pt();
    }
  }
  const wt = V.performerScope, Hn = (p) => {
    const { performerFocus: k, ...U } = D.current, H = k && !("targetMode" in p || "performerIds" in p || "performerFilter" in p);
    _e(
      {
        ...U,
        ...H ? { performerFocus: k } : {},
        filter: { ...U.filter, page: 1 },
        performerScope: { ...wt, ...p }
      },
      U.startFrom === "end"
    );
  };
  async function Gt(p, k) {
    var se;
    const U = kn.current;
    if (!Ce(U)) return;
    (se = Ae.current) == null || se.controller.abort();
    const H = {
      signature: Ja(U),
      controller: new AbortController()
    };
    Ae.current = H, K.current = "", ke(!0), Ne(null);
    try {
      const ye = await Yf(U, p, k, H.controller.signal, {
        onProgress: (Ze) => {
          Ae.current === H && J(Ze);
        }
      });
      Ae.current === H && J(ye);
    } catch (ye) {
      Ae.current === H && !H.controller.signal.aborted && (K.current = H.signature, Ne({ signature: H.signature, message: Qt(ye) }));
    } finally {
      Ae.current === H && (Ae.current = null, ke(!1));
    }
  }
  function mr() {
    var p;
    (p = Ae.current) == null || p.controller.abort(), Ae.current = null, ke(!1), J((k) => k && { ...k, partial: !0, complete: !1 });
  }
  async function An(p) {
    var H;
    const k = kn.current;
    if (!Ce(k)) return;
    if (Ae.current) {
      mr();
      return;
    }
    const U = Ja(k);
    if (!(((H = I.current) == null ? void 0 : H.signature) !== U || I.current.partial))
      try {
        const se = await nl(k, p);
        if (Ae.current) {
          mr();
          return;
        }
        J(
          (ye) => (ye == null ? void 0 : ye.signature) === U ? Xf(ye, p, se) : ye
        );
      } catch {
        J(
          (se) => (se == null ? void 0 : se.signature) === U ? { ...se, partial: !0, complete: !1 } : se
        );
      }
  }
  const Pe = V.performerFocus ? St == null ? void 0 : St.candidates.find((p) => p.id === V.performerFocus) : void 0, ht = nt && nt.id === V.performerFocus ? { ...nt, flags: kr(xt, nt.tags) } : Pe ? { ...Pe, flags: kr(xt, Pe.tags) } : null, Ta = (p) => {
    if ((nt == null ? void 0 : nt.id) === p)
      return kr(xt, nt.tags);
    const k = St == null ? void 0 : St.candidates.find((U) => U.id === p);
    return k ? kr(xt, k.tags) : void 0;
  }, nn = ((_r = S == null ? void 0 : S.occurrence) == null ? void 0 : _r.performer.id) ?? null, gr = nn === null ? void 0 : Ta(nn), br = ep(
    xt.length > 0 && nn !== null && nn !== V.performerFocus && gr === void 0 ? nn : null
  ), ea = gr ?? (br ? kr(xt, br) : []), yn = lc(Me.actions), yr = hn.summary && V.performerFocus ? ho(Ro(hn.summary, Me.actions, yn)) : [], ta = Wo(xt, (ht == null ? void 0 : ht.flags) ?? [], pr), Qn = hc(
    Wo(xt, ea, pr),
    nn !== null && nn === V.performerFocus ? yr : []
  ), wr = JSON.stringify(Qn), na = we(() => Qn, [wr]), Ia = JSON.stringify(ta), $a = we(() => ta, [Ia]), ra = (p) => ou(xt, p, tn);
  function di(p) {
    if (Ye.current) return;
    const k = {
      ...D.current,
      performerFocus: p,
      filter: { ...D.current.filter, page: 1 }
    };
    _e(k, k.startFrom === "end"), Fn("items");
  }
  function aa() {
    const { performerFocus: p, ...k } = D.current;
    _e(
      { ...k, filter: { ...k.filter, page: 1 } },
      k.startFrom === "end"
    );
  }
  const xr = $(null);
  xr.current ?? (xr.current = kc());
  const rn = xr.current, Pr = we(
    () => Me.actions.flatMap((p) => p.steps.flatMap((k) => k.tagIds)),
    [Me.actions]
  ), Wn = $(null);
  ee(() => {
    const p = Wn.current, k = p == null ? void 0 : p.querySelector('[aria-current="true"]');
    if (!p || !k) return;
    const U = p.getBoundingClientRect(), H = k.getBoundingClientRect();
    H.top < U.top ? p.scrollTop -= U.top - H.top : H.bottom > U.bottom && (p.scrollTop += H.bottom - U.bottom);
  }, [S == null ? void 0 : S.key, fn]);
  const Pn = $(null), Yn = $(null);
  ee(() => {
    var U, H;
    const p = Yn.current;
    if (!p) return;
    Yn.current = null;
    const k = [...((U = Pn.current) == null ? void 0 : U.querySelectorAll(".dq-partner")) ?? []];
    (H = k.find((se) => se.dataset.partnerKey === p) ?? k[0]) == null || H.focus();
  }, [S == null ? void 0 : S.key]);
  const Vt = ue || be || Oe || !!w, wn = we(
    () => w ? $n(w, Ga(e, V)) : null,
    [w, e, V]
  ), Lr = we(
    () => wn != null && zr(Tr(wn)) !== zr(Tr(e)),
    [wn, e]
  );
  function Ra() {
    S ? Nn(l, S).then(ut).catch((p) => He(Qt(p))) : _e(D.current);
  }
  const ia = Be ? /* @__PURE__ */ u("p", { role: "alert", children: [
    Be,
    " ",
    /* @__PURE__ */ a("button", { type: "button", disabled: ue, onClick: Ra, children: S ? "Reload tags" : "Retry queue" })
  ] }) : null, Oa = ue || be || S != null && !Ke, Ma = Math.max(1, Number(V.filter.perPage) || 1), Dr = $(1);
  be || (Dr.current = Math.max(1, Math.ceil(Ee / Ma)));
  const vr = Dr.current, Cn = wt && S ? oe.filter(
    (p) => p.media.id === S.media.id && p.key !== S.key
  ) : [], xe = (p) => {
    var k;
    return p.title || ((k = p.files[0]) == null ? void 0 : k.basename) || `${l === "audio" ? "Audio" : "Video"} ${p.id}`;
  }, Fa = S ? pp(S.media, l) : "";
  return /* @__PURE__ */ u(
    "section",
    {
      className: `dq-review-workspace${l === "audio" ? " dq-audio" : ""}`,
      "aria-label": wt ? l === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : l === "audio" ? "Audio review" : "Video review",
      onClickCapture: (p) => {
        var H;
        const k = p.target instanceof Element ? p.target.closest("button") : null, U = (k == null ? void 0 : k.getAttribute("aria-label")) ?? ((H = k == null ? void 0 : k.textContent) == null ? void 0 : H.trim()) ?? "";
        k && !k.closest(vs) && /^(Filters|Edit filter:|Edit criteria)/.test(U) && (Tt.current = k);
      },
      children: [
        /* @__PURE__ */ a(
          Uc,
          {
            name: e.name,
            description: e.description,
            entityType: Le(e),
            onBack: c == null ? void 0 : c.onBack,
            backDisabled: Vt || !!(c != null && c.busy),
            onEdit: w ? () => {
              var p;
              return (p = B.current) == null ? void 0 : p.focus();
            } : zn,
            editDisabled: !w && (Vt || !i || !!(c != null && c.busy)),
            editing: !!w,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: ue || Oe, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: l === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ a(
                  pa,
                  {
                    filter: V.filter,
                    objectFilter: Sn,
                    criteriaDefinitions: l === "audio" ? Rs : ti,
                    customFieldEntityType: l,
                    supportsFilterExpressions: !0,
                    totalCount: Ee,
                    sortOptions: l === "audio" ? _l : Os,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(
                      Bc,
                      {
                        page: Math.min(Math.max(1, pt || 1), vr),
                        pages: vr,
                        onPage: (p) => _e({
                          ...D.current,
                          filter: Wt(
                            { ...D.current.filter, page: p },
                            l
                          )
                        })
                      }
                    ),
                    onFilterChange: (p) => {
                      (p.sort !== D.current.filter.sort || p.direction !== D.current.filter.direction) && (p = { ...p, sorts: void 0 }), _e(
                        {
                          ...D.current,
                          filter: Wt(p, l)
                        },
                        D.current.startFrom === "end"
                      );
                    },
                    onObjectFilterChange: (p) => {
                      _e(
                        {
                          ...D.current,
                          objectFilter: Gc(
                            p,
                            it,
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
            trailing: /* @__PURE__ */ u(he, { children: [
              wt && /* @__PURE__ */ a(
                Hf,
                {
                  scope: wt,
                  disabled: ue || Oe,
                  editing: !!w,
                  onChange: Hn,
                  onEditCriteria: () => pe(!0)
                }
              ),
              (c == null ? void 0 : c.onGrid) && /* @__PURE__ */ a(
                Kc,
                {
                  mode: "single",
                  disabled: Vt || !!c.busy,
                  onChange: () => {
                    var p;
                    return (p = c.onGrid) == null ? void 0 : p.call(c);
                  }
                }
              )
            ] }),
            trailingEnd: /* @__PURE__ */ u(he, { children: [
              Ce(It) && t && /* @__PURE__ */ a(
                _f,
                {
                  review: It,
                  disabled: ze || !!w,
                  performerAttention: V.performerFocus ? $a : void 0,
                  trees: yn,
                  onOpen: () => {
                    Ye.current = !0, at(!0);
                  },
                  onClose: (p) => {
                    if (p) {
                      const k = D.current.performerFocus;
                      k ? An(k) : mr(), ve((U) => U + 1), Pt(), v.current || Je(!0), X((U) => U + 1);
                    } else Pt();
                  }
                }
              ),
              (c == null ? void 0 : c.moreItems) && /* @__PURE__ */ a(
                qo,
                {
                  disabled: Vt,
                  items: c.moreItems({
                    onSelect: zn,
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
                    name: (ht == null ? void 0 : ht.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ u("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ a("strong", { children: (ht == null ? void 0 : ht.name) ?? `performer ${V.performerFocus}` })
              ] }),
              ht != null && ht.flags.length ? /* @__PURE__ */ u("span", { className: "dq-focus-flag", title: ra(ht.flags), children: [
                /* @__PURE__ */ a(jn, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ra(ht.flags) })
              ] }) : null,
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: ze,
                  onClick: aa,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            queueDiffers: Mr,
            queueChange: !w && Mr ? {
              // Tag bins alone leave nothing to save: a review never keeps them.
              onSave: ft ? () => void li() : void 0,
              saveDisabled: ze || !i,
              onReset: () => {
                const p = $r(e);
                _e(p, p.startFrom === "end");
              },
              resetDisabled: ze
            } : void 0,
            chipsEnd: w ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
          }
        ),
        c == null ? void 0 : c.notices,
        /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
          w && wn && /* @__PURE__ */ a(
            jc,
            {
              drawerRef: B,
              draft: wn,
              onChange: (p) => E(p),
              direction: V.startFrom,
              onDirectionChange: (p) => _e({ ...D.current, startFrom: p }),
              tagGroups: fp,
              trees: yn,
              saving: ue,
              saveDisabled: be,
              error: O,
              dirty: Lr,
              criteriaChanged: ft,
              notices: ia && /* @__PURE__ */ a("div", { className: "dq-review-feedback", children: ia }),
              onSave: () => void Jn(),
              onCancel: Ca
            }
          ),
          /* @__PURE__ */ a("div", { className: "dq-review-main", children: /* @__PURE__ */ u("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ u("div", { className: "dq-review-stage", children: [
              S ? /* @__PURE__ */ u(he, { children: [
                /* @__PURE__ */ u("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ a("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ u(
                    "a",
                    {
                      href: `/${l}/${S.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${m.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ a("span", { children: xe(S.media) }),
                        /* @__PURE__ */ a(Bs, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  Fa && /* @__PURE__ */ a("span", { className: "dq-stage-meta", children: Fa })
                ] }),
                /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ a("div", { className: "dq-player-frame", children: [S, me].filter(Boolean).map((p) => {
                    var H, se, ye, Ze, Dt;
                    const k = p, U = k.key === S.key;
                    return /* @__PURE__ */ a(
                      "div",
                      {
                        className: U ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": U ? void 0 : !0,
                        inert: U ? void 0 : !0,
                        children: l === "audio" ? /* @__PURE__ */ a(
                          jl,
                          {
                            streamUrl: Mi("audio", k.media.id),
                            format: ((H = k.media.files[0]) == null ? void 0 : H.format) ?? "",
                            title: g(k.media),
                            coverUrl: U ? Oi("audio", k.media) : void 0,
                            duration: ((se = k.media.files[0]) == null ? void 0 : se.duration) ?? 0,
                            autostart: U && Z === k.media.id
                          }
                        ) : /* @__PURE__ */ a(
                          Ms,
                          {
                            videoId: k.media.id,
                            streamUrl: Mi("video", k.media.id),
                            posterUrl: U ? Oi("video", k.media) : void 0,
                            duration: ((ye = k.media.files[0]) == null ? void 0 : ye.duration) ?? 0,
                            format: (Ze = k.media.files[0]) == null ? void 0 : Ze.format,
                            audioCodec: (Dt = k.media.files[0]) == null ? void 0 : Dt.audioCodec,
                            extensionSurface: U ? "quick-view" : void 0,
                            autostart: U && Z === k.media.id,
                            keyboardShortcutsEnabled: U,
                            showAbLoop: U,
                            clip: k.media.parentVideoId != null ? {
                              start: k.media.clipStartSec ?? 0,
                              end: k.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${k.media.id}:${fe}`
                    );
                  }) }),
                  l === "audio" && /* @__PURE__ */ a(
                    Uf,
                    {
                      details: S.media.details,
                      label: m.one
                    },
                    S.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ a("p", { role: "status", className: "dq-stage-status", children: be ? "Loading review…" : Ee ? "Reached the end in this direction." : `No matching ${m.many}.` }),
              Me.actions.length > 0 ? /* @__PURE__ */ a(
                vu,
                {
                  actions: Me.actions,
                  isDisabled: (p) => Oe || Ie(p),
                  busy: Oa,
                  tags: Ke,
                  trees: yn,
                  preview: rn,
                  onApply: (p, k) => void Lt(p, k),
                  onFind: () => Mt(!0),
                  findDisabled: Oe || !!w,
                  paused: !!w,
                  waitForGroups: Qo(Me),
                  attention: na,
                  stayOnTap: bt,
                  onStayOnTapChange: de
                }
              ) : Ce(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || ue || Oe || !Ke || !!w || !S,
                  children: [
                    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((p) => /* @__PURE__ */ u("label", { children: [
                      /* @__PURE__ */ a(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: j.includes(p),
                          onChange: (k) => $e(
                            e.occurrence.multiple ? k.target.checked ? [...j, p] : j.filter((U) => U !== p) : [p]
                          )
                        }
                      ),
                      Ft[p] ?? "Loading tag…"
                    ] }, p)),
                    /* @__PURE__ */ u("div", { className: "dq-row", children: [
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => $e([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void Lt(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void Lt(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ u("div", { className: "dq-panel-body", ref: Pn, children: [
                S && /* @__PURE__ */ u(he, { children: [
                  /* @__PURE__ */ u("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ u("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: S.occurrence ? S.occurrence.performer.name : `this ${m.one}` })
                    ] }),
                    /* @__PURE__ */ u("div", { className: "dq-reviewing-who", children: [
                      S.occurrence && /* @__PURE__ */ a(Vr, { performer: S.occurrence.performer }),
                      /* @__PURE__ */ u("div", { children: [
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: S.occurrence ? S.occurrence.performer.name : `This ${m.one}` }),
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-note", children: wt ? `Tags apply to this performer in this ${m.queue}` : `Tags apply to the whole ${m.one}` })
                      ] })
                    ] }),
                    na.length > 0 && /* @__PURE__ */ a(gp, { entries: na })
                  ] }),
                  Cn.length > 0 && /* @__PURE__ */ u(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${m.queue}`,
                      children: [
                        /* @__PURE__ */ u("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          m.queue
                        ] }),
                        /* @__PURE__ */ a("div", { className: "dq-partners", children: Cn.map((p) => {
                          var k, U, H;
                          return /* @__PURE__ */ u(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (k = p.occurrence) == null ? void 0 : k.performer.name,
                              "aria-label": (U = p.occurrence) == null ? void 0 : U.performer.name,
                              "data-partner-key": p.key,
                              disabled: ze,
                              onClick: () => {
                                Yn.current = S.key, mn(p), He("");
                              },
                              children: [
                                p.occurrence && /* @__PURE__ */ a(Vr, { performer: p.occurrence.performer }),
                                /* @__PURE__ */ a("span", { children: (H = p.occurrence) == null ? void 0 : H.performer.name })
                              ]
                            },
                            p.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ a(
                    mp,
                    {
                      tags: Ke,
                      preview: rn,
                      trees: yn,
                      actionTagIds: Pr,
                      label: `Current ${wt ? "occurrence" : m.one} tags`,
                      tagsChangedSinceEditing: Oe && !ue && (!Ke || Ke.ids.length !== On.current.length || Ke.ids.some((p) => !On.current.includes(p))),
                      editor: Oe && /* @__PURE__ */ u(
                        "fieldset",
                        {
                          ref: gt,
                          disabled: ue,
                          className: "dq-panel-section dq-tag-editor",
                          children: [
                            /* @__PURE__ */ u("legend", { className: "dq-eyebrow", children: [
                              "Edit ",
                              wt ? "occurrence" : m.one,
                              " tags"
                            ] }),
                            /* @__PURE__ */ a(
                              or,
                              {
                                entityType: "tag",
                                values: Rn,
                                onChange: Bt,
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
                                  disabled: !Ke,
                                  onClick: () => void Lt(void 0, !0, !0),
                                  children: "Save"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  disabled: !Ke,
                                  onClick: () => void Lt(void 0, !1, !0),
                                  children: "Save & next"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  onClick: () => {
                                    Xe(!1), requestAnimationFrame(() => {
                                      var p;
                                      return (p = Zt.current) == null ? void 0 : p.focus();
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
                Ce(Ve) && V.performerFocus && /* @__PURE__ */ a(
                  Vi,
                  {
                    ...hn,
                    mediaKind: l,
                    actions: Me.actions,
                    trees: yn,
                    flags: $a
                  }
                )
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !w && ia,
                  dr && /* @__PURE__ */ a("p", { role: "status", children: dr })
                ] }),
                !t && /* @__PURE__ */ a("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                S && /* @__PURE__ */ u("div", { className: "dq-panel-actions", "aria-busy": Oa || void 0, children: [
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      ref: Zt,
                      className: "dq-button",
                      disabled: ze || !!w || !t || !Ke,
                      onClick: () => {
                        Rt.current++, On.current = [...Ke.ids], Bt([...Ke.ids]), Xe(!0);
                      },
                      children: [
                        /* @__PURE__ */ a(_s, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: ze || !!w,
                      onClick: () => void Lt(),
                      children: [
                        /* @__PURE__ */ a(ed, { "aria-hidden": "true" }),
                        "Skip",
                        wt ? " performer" : ` ${m.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              wt && /* @__PURE__ */ u(
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
                        "aria-pressed": fn === "items",
                        onClick: () => Fn("items"),
                        children: l === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": fn === "performers",
                        onClick: () => Fn("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              wt && fn === "performers" ? /* @__PURE__ */ a(
                Kf,
                {
                  ranking: (St == null ? void 0 : St.signature) === yt ? St : null,
                  busy: Se,
                  error: (Re == null ? void 0 : Re.signature) === yt ? Re.message : "",
                  focus: V.performerFocus,
                  disabled: ze,
                  labels: m,
                  flagLabel: ra,
                  onFocus: di,
                  onMore: () => {
                    const p = I.current;
                    p && Gt(p, p.limit + Ei);
                  },
                  onRefresh: () => {
                    J(null), Gt(null, Ei);
                  }
                }
              ) : /* @__PURE__ */ a("div", { className: "dq-queue-list", ref: Wn, children: oe.map((p) => {
                var U;
                const k = (S == null ? void 0 : S.key) === p.key;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: y(p),
                    "aria-label": y(p),
                    "aria-current": k ? "true" : void 0,
                    disabled: ze,
                    onClick: () => {
                      mn(p), He(""), Qe("");
                    },
                    children: [
                      /* @__PURE__ */ a(hp, { media: p.media, kind: l }),
                      /* @__PURE__ */ u("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: g(p.media) }),
                        /* @__PURE__ */ u("span", { className: "dq-queue-row-meta", children: [
                          p.occurrence && /* @__PURE__ */ u(he, { children: [
                            /* @__PURE__ */ a(Vr, { performer: p.occurrence.performer }),
                            /* @__PURE__ */ a("span", { className: "dq-queue-row-performer", children: p.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ a("span", { className: "dq-queue-row-detail", children: [
                            p.media.date,
                            p.occurrence ? "" : (U = p.media.files[0]) != null && U.duration ? Fs(p.media.files[0].duration) : ""
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
        wt && /* @__PURE__ */ a(
          $s,
          {
            open: dn,
            onClose: () => pe(!1),
            criteria: Xi,
            activeFilter: wt.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (p) => {
              pe(!1), Hn({ performerFilter: p });
            }
          }
        ),
        Ot && /* @__PURE__ */ a(
          wo,
          {
            actions: e.actions,
            trees: yn,
            isDisabled: (p) => Ie(p),
            tapStays: qn && bt,
            onApply: (p, k) => {
              Mt(!1), Lt(p, k);
            },
            onClose: () => Mt(!1)
          }
        )
      ]
    }
  );
}
const fl = "data-quality.reviews-sort.v1", yp = { sort: "name", direction: "asc" };
function wp() {
  try {
    const e = JSON.parse(localStorage.getItem(fl) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return yp;
}
function vp(e) {
  try {
    localStorage.setItem(
      fl,
      JSON.stringify({ sort: e.sort, direction: e.direction })
    );
  } catch {
  }
}
function pl(e, t, n, r) {
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
function Ai(e, t) {
  const n = Le(e), r = Kn(ao(n)), i = n === "tag" ? "tag" : Ce(e) ? r.queue : r.one;
  return t === 1 ? i : `${i}s`;
}
function Np({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ u(he, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      Ai(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ u(he, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Matching ",
      Ai(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ u(he, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      Ai(e, t)
    ] })
  ] });
}
function qp({
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
  onOpen: m,
  onNew: h,
  onImport: g,
  onExportAll: y,
  rowMenuItems: N
}) {
  const v = $(null), w = we(
    () => pl(e, t, n, r),
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
              /* @__PURE__ */ a(Ks, { "aria-hidden": "true" }),
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
            onClick: h,
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
          const B = Le(F);
          return /* @__PURE__ */ u("tr", { children: [
            /* @__PURE__ */ a("td", { children: /* @__PURE__ */ u(
              "a",
              {
                className: "dq-reviews-link",
                href: `?review=${encodeURIComponent(F.id)}`,
                "data-review-id": F.id,
                onClick: (C) => {
                  C.button !== 0 || C.metaKey || C.ctrlKey || C.shiftKey || C.altKey || (C.preventDefault(), m(F.id));
                },
                children: [
                  /* @__PURE__ */ a("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ a(Lc, { entityType: B }) }),
                  /* @__PURE__ */ u("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ a("span", { className: "dq-reviews-name", children: F.name }),
                    F.description && /* @__PURE__ */ a("span", { className: "dq-reviews-description", title: F.description, children: F.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-type", children: Pc[B] }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-count", children: /* @__PURE__ */ a(Np, { review: F, count: t[F.id] }) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ a(qo, { label: `Actions for ${F.name}`, items: N(F) }) })
          ] }, F.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ u("div", { className: "dq-empty", children: [
      /* @__PURE__ */ a(ri, { "aria-hidden": "true" }),
      /* @__PURE__ */ a("p", { children: "No reviews yet." }),
      /* @__PURE__ */ a("p", { children: c ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function hl(e, { id: t, name: n, description: r }) {
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
function Sp({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: r
}) {
  const { review: i, saving: o, error: s } = e, c = $(null), d = $(null), f = $(o);
  f.current = o;
  const l = $(null), m = rt();
  ee(() => {
    var y;
    return l.current ?? (l.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), c.current && !c.current.open && c.current.showModal(), (y = d.current) == null || y.focus(), () => {
      var N;
      (N = l.current) != null && N.isConnected && l.current.focus({ preventScroll: !0 });
    };
  }, []);
  const h = $(o);
  ee(() => {
    var v, w;
    const y = document.activeElement, N = !y || y === document.body || !((v = c.current) != null && v.contains(y));
    s && (!i.name.trim() || h.current && !o && N) && ((w = d.current) == null || w.focus()), h.current = o;
  }, [s, o]);
  const g = () => {
    f.current || r();
  };
  return /* @__PURE__ */ a(
    "dialog",
    {
      ref: c,
      className: "dq-form-dialog",
      "aria-labelledby": m,
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
              /* @__PURE__ */ a("h2", { id: m, children: "New review" }),
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
                  _c,
                  {
                    review: i,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (y) => {
                      y !== Le(i) && t(hl(y, i));
                    },
                    nameRef: d
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ u("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ a("button", { type: "button", className: "dq-text-button", onClick: () => No(i), children: "Export draft" }),
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
const kp = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function Ep(e, t, n, r) {
  return ul(
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
function Ns(e, t) {
  return Le(t) === "video" && Or(t.view.objectFilter, e.view.objectFilter, Oo(t, e)).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function qs(e, t) {
  return sr(
    JSON.parse(nr(Tr(e))),
    JSON.parse(nr(Tr(t)))
  );
}
const Ci = 180;
function Ss(e) {
  return Le(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function ks(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Es() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Ti(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  ci.forEach((i) => n.delete(i)), e ? n.set("review", e) : n.delete("review");
  const r = n.toString();
  dl(`${window.location.pathname}${r ? `?${r}` : ""}`, { openingFromList: t });
}
function Ap(e) {
  return Wt({ ...e, page: 1 });
}
function ml(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Br(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Cp = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(eo, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ a(od, { "aria-hidden": "true" }) }
], Tp = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(eo, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ a(id, { "aria-hidden": "true" }) }
], As = [], gl = "(min-width: 900px)";
function Ip(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(gl);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function $p() {
  return typeof window.matchMedia == "function" && window.matchMedia(gl).matches;
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
  }), [i, o] = T(""), [s, c] = T(!0), [d, f] = T(""), [l, m] = T(!1), [h, g] = T(!1), [y, N] = T(!1), [v, w] = T(!1), [E, O] = T([]), [F, B] = T(""), [C, L] = T(!0), [x, re] = T("account"), [Q, _] = T(""), [V, M] = T(""), [D, P] = T(!1), [X, Y] = T(!1), [oe, W] = T(""), [S, ce] = T(Es), A = $(S);
  A.current = S;
  const [Z, le] = T({}), fe = $(Z);
  fe.current = Z;
  const G = $(t);
  G.current = t;
  const me = $(s);
  me.current = s;
  const Ee = $(!1), qe = $(!0);
  ee(() => (qe.current = !0, () => {
    qe.current = !1;
  }), []);
  const [be, Je] = T(!S);
  be !== !S && (Je(!S), S || le({}));
  const [ue, at] = T(wp), { sort: Ye, direction: Rt } = ue, Xt = (b) => {
    const q = { ...ue, ...b };
    at(q), vp(q);
  }, Ut = $(null), tt = $(null), [Ue, Be] = T(null), [He, dr] = T(!1), [Qe, Ke] = T(!1), [ut, Oe] = T(null), [Xe, Rn] = T(null), Bt = !!ut || !!Xe, On = $(Bt);
  On.current = Bt;
  const Zt = He || !!Xe || Qe, [Tt, gt] = T(0), [Gn, dn] = T(!1), [pe, Ot] = T(null), Mt = $(null), qn = $(null), ur = $(null), [Ge, bt] = T(
    null
  ), de = t.find((b) => b.id === S) ?? null, j = we(
    () => (Ge == null ? void 0 : Ge.id) === S && de ? { ...de, view: {
      ...de.view,
      filter: Ge.view.filter,
      objectFilter: Ge.view.objectFilter,
      searchMode: Ge.view.searchMode,
      startFrom: Ge.view.startFrom
    } } : de,
    [Ge, S, de]
  ), $e = j ? Le(j) : "video", Ft = ao($e), fr = j ? Ce(j) : !1, ae = $e === "video" ? j : null, it = fr && !!(j != null && j.actions.some(ir)), Mn = !!ae || $e === "audio" || it, [Sn, Kt] = T(null), en = (Sn == null ? void 0 : Sn.id) === (j == null ? void 0 : j.id) ? Sn == null ? void 0 : Sn.mode : (j == null ? void 0 : j.view.reviewMode) ?? "single", Me = fr || $e === "audio" || $e === "video" && en === "single", [Ve, It] = T(0), un = $(-1), kn = $(!1), fn = $(Me);
  fn.current = Me, ee(() => {
    const b = () => {
      const q = fn.current;
      if (!q && Jn.current) {
        kn.current = !0;
        return;
      }
      un.current = -1, jr(), q || It((R) => R + 1);
    };
    return window.addEventListener("popstate", b), () => window.removeEventListener("popstate", b);
  }, []);
  const Fn = Ft === "audio" ? h : l, St = $e === "tag" ? "Tag" : Ft === "audio" ? "Audio" : "Video", Vn = $e === "tag" ? y : Fn, I = $(
    null
  ), K = np(ae), [J, Se] = T({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [ke, Re] = T({
    page: 1,
    perPage: 40
  }), [Ne, Ae] = T({ items: [], totalCount: 0 }), [yt, Te] = T(S);
  yt !== S && (Te(S), Ae({ items: [], totalCount: 0 }), Y(!1));
  const [ve, nt] = T(!1), [We, pn] = T(""), [xn, xt] = T(!1), [Xr, Zr] = T(!1), [$t, tn] = T(() => /* @__PURE__ */ new Set()), pr = $($t);
  pr.current = $t;
  const hn = $(/* @__PURE__ */ new Map()), Mr = (j == null ? void 0 : j.view.selectAllOnLoad) === !0, [ft, ze] = T(null), pt = $(ft);
  pt.current = ft;
  const [_e, Pt] = T(!1), kt = $(_e);
  kt.current = _e;
  const Fr = $(null), [mn, gn] = T(!1), [bn, hr] = T("grid"), [Lt, Aa] = T(Ci), [Ie, zn] = T(!1), [En, Ca] = T(!1), Jn = $(!1), [li, wt] = T(""), [Hn, Gt] = T(""), [mr, An] = T(""), [Pe, ht] = T(null), [Ta, nn] = T(""), [gr, br] = T(!1), [ea, yn] = T({}), yr = $(/* @__PURE__ */ new Map()), ta = $(null), Qn = $(null), wr = !!j, na = Wi(Ip, $p, () => !1) && wr, [Ia, $a] = T({ top: 0, bottom: 0 });
  Ct(() => {
    if (!wr) return;
    const b = () => {
      const R = Qn.current;
      if (!R) return;
      const z = Math.round(R.getBoundingClientRect().top + window.scrollY), te = R.closest("main"), ie = te ? Math.round(parseFloat(getComputedStyle(te).paddingBottom) || 0) : 0;
      $a(
        (ne) => ne.top === z && ne.bottom === ie ? ne : { top: z, bottom: ie }
      );
    };
    b();
    const q = typeof ResizeObserver > "u" ? null : new ResizeObserver(b);
    return q == null || q.observe(document.body), window.addEventListener("resize", b), () => {
      q == null || q.disconnect(), window.removeEventListener("resize", b);
    };
  }, [wr]);
  const [ra, di] = T(0), aa = $(null), xr = In((b) => {
    var R;
    if ((R = aa.current) == null || R.disconnect(), aa.current = null, !b || typeof ResizeObserver > "u") return;
    const q = new ResizeObserver(
      () => di(Math.round(b.getBoundingClientRect().height))
    );
    q.observe(b), aa.current = q;
  }, []), rn = $(0), Pr = $(0), Wn = $(null), Pn = $(null), Yn = lc(
    j && !Me ? pe ? [...j.actions, ...pe.draft.actions] : j.actions : As
  ), Vt = we(
    () => pe && j && de ? Ep(pe.draft, j, J, de) : null,
    [pe, j, J, de]
  ), wn = we(
    () => j && de ? ul(
      { ...de, view: { ...j.view, filter: { ...J, page: 1 } } },
      de
    ) : null,
    [j, de, J]
  ), Lr = we(
    () => de ? zr(Tr(de)) : "",
    [de]
  ), Ra = we(
    () => wn != null && zr(Tr(wn)) !== Lr,
    [wn, Lr]
  ), ia = we(
    () => Vt != null && zr(Tr(Vt)) !== Lr,
    [Vt, Lr]
  );
  ee(() => {
    if (!Hn) return;
    const b = window.setTimeout(() => Gt(""), 4e3);
    return () => window.clearTimeout(b);
  }, [Hn]), ee(() => {
    if (!Ue || Ue.alert) return;
    const b = window.setTimeout(() => Be(null), 6e3);
    return () => window.clearTimeout(b);
  }, [Ue]), ee(() => {
    const b = ae ? Eo(ae.view.objectFilter) : [];
    if (yn({}), !b.length) return;
    const q = new AbortController();
    let R = !0;
    return Promise.all(
      b.map(async (z) => {
        var te;
        try {
          const ie = await ge(`/api/tags/${z}`, {
            signal: q.signal
          });
          return (te = ie.name) != null && te.trim() ? [String(z), ie.name] : null;
        } catch {
          return null;
        }
      })
    ).then((z) => {
      R && yn(
        Object.fromEntries(z.filter((te) => te !== null))
      );
    }), () => {
      R = !1, q.abort();
    };
  }, [ae == null ? void 0 : ae.id, ae == null ? void 0 : ae.view.objectFilter]);
  const Oa = we(
    () => ae ? Ao(
      ae.view.objectFilter,
      ea
    ) : (j == null ? void 0 : j.view.objectFilter) ?? {},
    [ea, j, ae]
  ), Ma = In(async () => {
    c(!0), f("");
    try {
      const b = await Cd();
      n(b.reviews), o(b.storageKey), m(b.canWriteVideos ?? b.canWrite), g(b.canWriteAudios ?? !1), N(b.canWriteTags ?? !1), w(b.canReadTagGroups ?? !1), L(b.canConfigure ?? !0), re(b.storage ?? "account"), _(b.storageNotice ?? ""), S && !b.reviews.some((q) => q.id === S) && (ce(""), Ti(""));
    } catch (b) {
      f(
        b instanceof Error ? b.message : "Could not load reviews."
      );
    } finally {
      c(!1);
    }
  }, [S]);
  ee(() => {
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
  }, [v]), ee(() => {
    Ma();
  }, []), ee(() => {
    if (S || t.length === 0) return;
    const b = new AbortController();
    for (const q of t) {
      if (typeof fe.current[q.id] == "number") continue;
      (Ce(q) ? Co(q, b.signal).then((z) => (z == null ? void 0 : z.length) === 0 ? { items: [], totalCount: 0 } : Kr(To(q, z), { ...q.view.filter, page: 1, perPage: 1 }, b.signal)) : Le(q) === "tag" ? bi(
        q,
        Wt({ ...q.view.filter, page: 1, perPage: 1 }),
        b.signal
      ) : Kr(
        q,
        Wt({ ...q.view.filter, page: 1, perPage: 1 }),
        b.signal
      )).then((z) => {
        b.signal.aborted || le((te) => ({
          ...te,
          [q.id]: z.totalCount
        }));
      }).catch(() => {
        b.signal.aborted || le((z) => ({ ...z, [q.id]: null }));
      });
    }
    return () => b.abort();
  }, [S, t]), Ct(() => {
    var R, z;
    const b = tt.current;
    if (S || s || !b) return;
    tt.current = null, (z = (b === "heading" ? null : [...((R = Qn.current) == null ? void 0 : R.querySelectorAll("[data-review-id]")) ?? []].find(
      (te) => te.dataset.reviewId === b.reviewId
    )) ?? Ut.current) == null || z.focus();
  }, [S, s, Xe, t]);
  const Dr = $(0), vr = In(async () => {
    const b = ++Dr.current;
    ht(null), nn("");
    try {
      const q = await (it ? ic(Ft) : ac(Ft));
      b === Dr.current && ht(q);
    } catch (q) {
      if (b !== Dr.current) return;
      ht(null), nn(
        "Tag assessment setup could not be checked. " + (q instanceof Error ? q.message : "Request failed.")
      );
    }
  }, [it, Ft]);
  ee(() => {
    vr();
  }, [vr]);
  const Cn = In(
    async (b, q, R = !1, z = !1) => {
      var lt, je;
      const te = ++rn.current;
      (lt = Wn.current) == null || lt.abort();
      const ie = new AbortController();
      Wn.current = ie, q = Wt(q);
      const ne = Number(q.page);
      R && (q = { ...q, page: 1 }), Se(q), Zr(R), nt(!0), pn("");
      try {
        const st = (Fe) => Le(b) === "tag" ? bi(
          b,
          Fe,
          ie.signal
        ) : Kr(
          b,
          Fe,
          ie.signal
        );
        let dt = await st(q);
        const Jt = Math.max(
          1,
          Math.ceil(dt.totalCount / Number(q.perPage))
        ), At = R ? Jt : Math.min(ne, Jt);
        return Number(q.page) !== At && (q = { ...q, page: At }, dt = await st(q)), te === rn.current && (((je = Pn.current) == null ? void 0 : je.page) !== At && (Pn.current = {
          page: At,
          ids: new Set(dt.items.map((Fe) => Fe.id))
        }), Ae(dt), z && se(
          () => new Set(dt.items.map((Fe) => Fe.id))
        ), Se(q), Re(q)), dt;
      } catch (st) {
        throw te === rn.current && pn(
          st instanceof Error ? st.message : "Could not load the review queue."
        ), st;
      } finally {
        te === rn.current && nt(!1);
      }
    },
    []
  );
  ee(() => {
    var q;
    if (Pr.current += 1, un.current = -1, rn.current += 1, (q = Wn.current) == null || q.abort(), Ot(null), Mt.current = null, Y(!1), W(""), M(""), P(!1), tn(/* @__PURE__ */ new Set()), hn.current.clear(), ze(null), Pt(!1), zn(!1), Jn.current = !1, wt(""), Gt(""), An(""), Ae({ items: [], totalCount: 0 }), Pn.current = null, xt(!1), !j || Me) {
      nt(!1), bt(null);
      return;
    }
    let b = !0;
    return nt(!0), (async () => {
      let R = de ?? j;
      bt(null);
      let z = null;
      const te = new URLSearchParams(window.location.search);
      if (Le(j) === "video" && ci.some((je) => te.has(je)))
        try {
          const je = R;
          z = Qi(je, te);
          const st = $n(je, z.query);
          (z.query.startFrom !== (je.view.startFrom ?? "end") || !sr(
            JSON.parse(nr(st)),
            JSON.parse(nr($n(je, $r(je))))
          )) && (R = st, bt(R));
        } catch (je) {
          xt(!0), pn(je instanceof Error ? je.message : "Could not read review URL."), nt(!1);
          return;
        }
      let ie = null;
      try {
        ie = await Rd(i, j.id);
      } catch (je) {
        b && (P(!0), M(
          je instanceof Error ? je.message : "Could not load progress."
        ));
      }
      if (!b) return;
      const ne = (ie == null ? void 0 : ie.signature) === nr(R) ? ie : null, lt = z ? z.query.filter : ne ? Wt(ne.filter) : Ap(R.view.filter);
      Se(lt), hr(
        ne ? ks(ne.displayMode, Le(j)) : Ss(j)
      ), Aa(
        ne ? ne.cardSize ?? Ci : Ci
      );
      try {
        const je = await Cn(
          R,
          lt,
          z ? z.startAtEnd : !ne && R.view.startFrom !== "beginning",
          R.view.selectAllOnLoad === !0
        );
        if (!b) return;
        const st = Bo(
          je.items.map((dt) => dt.id),
          (ne == null ? void 0 : ne.focusedId) ?? null,
          (ne == null ? void 0 : ne.index) ?? 0
        );
        ze(st), H(st);
      } catch {
      }
      b && (un.current = Ve, Y(!0), W(`${j.id}:${Ve}`));
    })(), () => {
      var R;
      b = !1, Pr.current++, rn.current++, (R = Wn.current) == null || R.abort();
    };
  }, [j == null ? void 0 : j.id, Me, Ve]), ee(() => {
    if (!(!Tt || Me || !j)) {
      if (xn) {
        gt(0);
        return;
      }
      Ie || pe || En || oe !== `${j.id}:${Ve}` || (gt(0), hi());
    }
  }, [
    Tt,
    Me,
    j == null ? void 0 : j.id,
    oe,
    Ie,
    En,
    Ve,
    xn
  ]), ee(() => {
    !ae || Me || !X || ve || We || Ie || kn.current || un.current !== Ve || fa(ae.id, {
      filter: J,
      objectFilter: ae.view.objectFilter,
      searchMode: ae.view.searchMode,
      startFrom: ae.view.startFrom ?? "end"
    });
  }, [ae, Me, X, ve, We, J, Ie, Ve]);
  const xe = we(
    () => Ne.items.map((b) => b.id),
    [Ne.items]
  );
  ee(() => {
    if (!X || !j || !i || ve || We || Ie || (Ge == null ? void 0 : Ge.id) === j.id || D || un.current !== Ve)
      return;
    const b = {
      version: 1,
      signature: nr(j),
      filter: J,
      focusedId: ft,
      index: Math.max(0, xe.indexOf(ft ?? -1)),
      displayMode: bn,
      cardSize: Lt,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        i + ":progress:" + j.id,
        JSON.stringify(b)
      );
    } catch {
    }
    if (V) return;
    let q = !0;
    const R = window.setTimeout(() => {
      Od(i, j.id, b).catch((z) => {
        q && M(
          "Progress is kept in this browser, but account sync failed. " + (z instanceof Error ? z.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      q = !1, window.clearTimeout(R);
    };
  }, [
    X,
    i,
    j,
    ve,
    We,
    Ie,
    J,
    ft,
    xe,
    bn,
    Lt,
    Ge,
    V,
    D,
    Ve
  ]);
  const Fa = Ne.items.find((b) => b.id === ft) ?? null, _r = $e === "video" ? Fa : null;
  _e && _r && (Fr.current = _r);
  const p = _r ?? (_e ? Fr.current : null), k = Ko($t, ft), U = xe.length > 0 && xe.every((b) => $t.has(b)), H = In((b, q = !0) => {
    b != null && window.requestAnimationFrame(() => {
      var z;
      if (On.current || Nd(document.activeElement) || // The drawer's Group list hangs on the page, outside the drawer.
      (z = document.activeElement) != null && z.closest(".dq-drawer, .dq-combobox-list"))
        return;
      const R = yr.current.get(b);
      R == null || R.focus({ preventScroll: !0 }), q && (R == null || R.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  ee(() => {
    X && !kt.current && H(pt.current);
  }, [X, H]), ee(() => {
    ve || !xe.length || (pt.current == null || !xe.includes(pt.current)) && (ze(xe[0]), kt.current || H(xe[0]));
  }, [H, xe, ve]);
  const se = In(
    (b) => {
      tn((q) => {
        const R = b(q);
        for (const z of /* @__PURE__ */ new Set([...q, ...R]))
          q.has(z) !== R.has(z) && hn.current.set(
            z,
            (hn.current.get(z) ?? 0) + 1
          );
        return R;
      });
    },
    []
  ), ye = In(
    (b) => {
      if (!xe.length) return;
      const q = Math.max(
        0,
        xe.indexOf(pt.current ?? xe[0])
      ), R = xe[Math.max(0, Math.min(xe.length - 1, q + b))];
      ze(R), kt.current || H(R);
    },
    [H, xe]
  ), Ze = In(
    async (b, q = !1) => {
      const R = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", z = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, te = z != null && (!v || !E.some((et) => et.id === z)), ie = "effect" in b && R && !v, ne = Ko(
        pr.current,
        pt.current
      );
      if (!j || Jn.current || ve || We) return;
      const lt = R && !Vn ? `${St} write permission is required to apply ${b.label}.` : ie || te ? `${b.label} needs a tag group that is unavailable.` : ir(b) && (Pe == null ? void 0 : Pe.kind) !== "ready" ? `Set up tag assessments before applying ${b.label}.` : ne.length ? "" : `Select or focus a ${$e} before applying ${b.label}.`;
      if (lt) {
        An(lt);
        return;
      }
      const je = ++Pr.current, st = j.id, dt = [...xe], Jt = Ne, At = pt.current, Fe = new Set(pr.current), on = new Map(
        ne.map((et) => [et, hn.current.get(et) ?? 0])
      ), qr = () => je === Pr.current && j.id === st;
      Jn.current = !0, zn(!0), wt(
        pr.current.size ? `${ne.length} selected ${$e}s` : `the focused ${$e}`
      ), Gt(""), An("");
      const Do = Jt.items.filter(
        (et) => !ne.includes(et.id)
      ), Il = Do.map((et) => et.id), _o = Go(
        dt,
        Il,
        At,
        ne.includes(At ?? -1)
      );
      q || (Ae({
        items: Do,
        totalCount: Jt.totalCount
      }), tn((et) => {
        const Ht = new Set(et);
        for (const vn of ne) Ht.delete(vn);
        return Ht;
      }), ze(_o), kt.current || H(_o));
      let mi = !1;
      try {
        if ("effect" in b ? await Jd(b, ne) : await sc(Ft, b, ne), mi = !0, !qr()) return;
        q || tn((et) => {
          const Ht = new Set(et);
          for (const vn of ne)
            (hn.current.get(vn) ?? 0) === on.get(vn) && Ht.delete(vn);
          return Ht;
        }), Gt(
          `${b.label}: ${ne.length} ${$e}${ne.length === 1 ? "" : "s"} ${R ? "updated" : "skipped"}${q ? ", kept in place" : ""}.`
        );
      } catch (et) {
        if (!qr()) return;
        Ae(Jt), tn((Ht) => {
          const vn = new Set(Ht);
          for (const sn of ne)
            Fe.has(sn) && (hn.current.get(sn) ?? 0) === on.get(sn) && vn.add(sn);
          return vn;
        }), ze(At), kt.current || H(At), An(
          et instanceof Error ? et.message : "Action failed."
        );
      }
      try {
        if (!qr()) return;
        if (q) {
          const jt = $e === "tag" ? await bi(j, J) : await Kr(j, J), Xn = new Map(
            jt.items.map((cn) => [cn.id, cn])
          );
          if ($e !== "tag" && await Promise.all(
            ne.filter((cn) => !Xn.has(cn)).map(async (cn) => {
              const Zn = await Ya(Ft, cn).catch(() => null);
              Zn && Xn.set(cn, Zn);
            })
          ), !qr()) return;
          Ae((cn) => ({
            items: cn.items.map((Zn) => Xn.get(Zn.id) ?? Zn),
            totalCount: jt.totalCount
          }));
          return;
        }
        const et = new Set(ne), Ht = Mr && dt.length > 0 && dt.every((jt) => et.has(jt)), vn = await Cn(j, J, !1, Ht);
        if (!qr()) return;
        let sn = vn.items.map((jt) => jt.id);
        const Da = Pn.current, $l = (Da == null ? void 0 : Da.page) === Number(J.page) && sn.some((jt) => Da.ids.has(jt)), Rl = (j.view.startFrom ?? "end") !== "beginning";
        if (vn.totalCount > 0 && Number(J.page) > 1 && (!sn.length || Rl && !$l)) {
          const jt = Math.max(1, Number(J.page) - 1), Xn = { ...J, page: jt };
          Se(Xn), sn = (await Cn(
            j,
            Xn,
            !1,
            Ht
          )).items.map((gi) => gi.id), tn(
            (gi) => new Set([...gi].filter((Ol) => sn.includes(Ol)))
          );
          const Zn = sn.at(-1) ?? null;
          ze(Zn), kt.current || H(Zn);
        } else {
          tn(
            (Xn) => new Set([...Xn].filter((cn) => sn.includes(cn)))
          );
          const jt = Go(
            dt,
            sn,
            At,
            mi && ne.includes(At ?? -1)
          );
          ze(jt), kt.current && jt == null && Pt(!1), kt.current || H(jt);
        }
      } catch (et) {
        qr() && An(
          (Ht) => `${Ht ? `${Ht} ` : ""}${mi ? "The action completed, but " : ""}the queue could not be refreshed. ${et instanceof Error ? et.message : "Refresh failed."}`
        );
      } finally {
        qr() && (Jn.current = !1, zn(!1), wt(""), kn.current && (kn.current = !1, jr(), It((et) => et + 1)));
      }
    },
    [
      Vn,
      v,
      E,
      $e,
      Pe,
      Cn,
      J,
      H,
      xe,
      Ne,
      ve,
      We,
      j
    ]
  );
  function Dt() {
    var R;
    if (bn === "list") return 1;
    const b = (R = ta.current) == null ? void 0 : R.firstElementChild, q = b ? getComputedStyle(b).gridTemplateColumns : "";
    return Math.max(1, q.split(" ").filter(Boolean).length);
  }
  const an = $(() => {
  });
  an.current = (b) => {
    var ie;
    if (Me || b.defaultPrevented || b.repeat || ln(b) || b.ctrlKey || b.altKey || b.metaKey || Bt) return;
    const q = b.target, R = q instanceof Node && ((ie = Qn.current) == null ? void 0 : ie.contains(q)) === !0, z = q === document.body || q === document.documentElement;
    if (!R && !z) return;
    if (mn) {
      b.key === "Escape" && (Br(b), gn(!1));
      return;
    }
    if (_e && b.key === "Escape") {
      Br(b), Pt(!1), H(pt.current);
      return;
    }
    if (!vd(q)) return;
    const te = wd(q);
    if (b.key === "Escape") {
      Br(b), se(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!_e && b.key === " " && te) {
      Br(b), ft != null && se((ne) => Va(ne, ft));
      return;
    }
    if (!(Ie || ve) && !_e && b.key === "Enter" && ft != null && te) {
      if ($e !== "tag" && pe) return;
      Br(b), $e === "tag" ? window.open(`/tag/${ft}`, "_blank", "noopener,noreferrer") : Pt(!0);
      return;
    }
  }, ee(() => {
    const b = (q) => an.current(q);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []);
  const vt = $(
    () => {
    }
  );
  vt.current = (b) => {
    var ie;
    if (Me || Bt || _e || mn || Ie || ve || !xe.length || b.defaultPrevented || b.repeat || b.ctrlKey || b.altKey || b.metaKey)
      return;
    const q = b.target, R = q instanceof Node && ((ie = Qn.current) == null ? void 0 : ie.contains(q)) === !0, z = q === document.body || q === document.documentElement;
    if (!R && !z || !b.key.startsWith("Arrow") || !qd(q)) return;
    const te = Sd(b.key, Dt());
    te && (b.preventDefault(), R ? b.stopImmediatePropagation() : b.stopPropagation(), ye(te));
  }, ee(() => {
    const b = (q) => vt.current(q);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []);
  const Et = (pe == null ? void 0 : pe.saving) === !0 || En, ct = Ie || ve && !X || Et, zt = bo();
  go({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!j && !Me && !Bt && !pe && !_e && !mn && !We && (Ne.items.length > 0 || ve || Ie),
    actions: (j == null ? void 0 : j.actions) ?? As,
    onAction: (b, q) => {
      const R = j == null ? void 0 : j.actions[b];
      R && Ze(R, q);
    },
    onFind: () => gn(!0),
    onSelectAll: () => se((b) => yd(b, xe))
  }), ee(() => gn(!1), [Me, _e, j == null ? void 0 : j.id]);
  function ot(b) {
    const q = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", R = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, z = R != null && !E.some((te) => te.id === R);
    return Ie || ve || !!We || q && !Vn || "effect" in b && q && (!v || z) || ir(b) && (Pe == null ? void 0 : Pe.kind) !== "ready" || !k.length;
  }
  function mt(b) {
    Kt(null), gt(0), Be(null), ce(b), Ti(b, !!b && !j);
  }
  function Tn() {
    Ee.current || (ll() ? (Ee.current = !0, window.history.back()) : mt(""));
  }
  function jr() {
    const b = Ee.current;
    Ee.current = !1;
    let q = Es();
    q && !me.current && !G.current.some((z) => z.id === q) && (q = "", Ti(""));
    const R = A.current;
    q !== R && (gt(0), b || Be(null), !q && R && (tt.current ?? (tt.current = { reviewId: R }))), ce(q);
  }
  function Nr() {
    tt.current = "heading", Be(null), Tn();
  }
  function Ln(b) {
    b !== S && mt(b), gt((q) => q + 1);
  }
  function oa() {
    Be(null), Oe({
      review: hl("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function _t(b) {
    if (Zt || !C) return;
    Be(null);
    const q = crypto.randomUUID();
    let R;
    const z = S;
    Ke(!0);
    try {
      if (!await sa((ie) => (R = gd(
        ie.find((ne) => ne.id === b.id) ?? b,
        ie,
        q
      ), [...ie, R]))) throw new Error("Could not save reviews.");
      if (!qe.current) return;
      A.current !== z ? Be({ text: `Saved the copy “${R.name}”.`, alert: !1 }) : Ln(R.id);
    } catch (te) {
      Be({
        text: `“${b.name}” was not duplicated. ${Pa(te)}`,
        alert: !0
      });
    } finally {
      Ke(!1);
    }
  }
  async function xa() {
    if (!ut || ut.saving) return;
    const b = { ...ut.review, name: ut.review.name.trim() }, q = ga(b);
    if (q) {
      Oe({ ...ut, error: q });
      return;
    }
    Oe({ ...ut, saving: !0, error: "" });
    try {
      if (!await sa((R) => [...R, b]))
        throw new Error("Could not save reviews.");
      if (!qe.current) return;
      Oe(null), Ln(b.id);
    } catch (R) {
      Oe(
        (z) => z && {
          ...z,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + (R instanceof Error ? R.message : "Retry saving.")
        }
      );
    }
  }
  async function bl() {
    if (!Xe || Xe.pending) return;
    const b = Xe.review, q = pl(t, Z, Ye, Rt).map((te) => te.id), R = q.filter((te) => te !== b.id), z = R[Math.min(q.indexOf(b.id), R.length - 1)];
    Rn({ review: b, pending: !0 });
    try {
      if (!await sa((te) => te.filter((ie) => ie.id !== b.id)))
        throw new Error("Could not save reviews.");
      tt.current = b.id !== S && z ? { reviewId: z } : "heading", Be({ text: `Deleted “${b.name}”.`, alert: !1 });
    } catch (te) {
      Be({ text: `“${b.name}” was not deleted. ${Pa(te)}`, alert: !0 });
    } finally {
      Rn(null);
    }
  }
  async function yl(b) {
    if (!(Zt || !C)) {
      Be(null), dr(!0);
      try {
        const q = await af(b);
        let R = 0;
        if (q.length && !await sa((te) => {
          const ie = Ii(te, q);
          return R = ie.length - te.length, R ? ie : te;
        }))
          throw new Error("Could not save reviews.");
        const z = q.length - R;
        Be({
          alert: !1,
          text: q.length ? R ? `Imported ${R === 1 ? "1 review" : `${R} reviews`}.` + (z === 1 ? " 1 review already in the list stays as it is." : z ? ` ${z} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (q) {
        Be({ alert: !0, text: `Could not import “${b.name}”. ${Pa(q)}` });
      } finally {
        dr(!1);
      }
    }
  }
  function Pa(b) {
    return b instanceof Ws ? "Reviews changed in another browser. Reload the page to get them, then try again." : b instanceof Error ? b.message : "Try again.";
  }
  function Mo(b) {
    const q = !C || Zt;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ a(Ls, { "aria-hidden": "true" }),
        disabled: q,
        onSelect: () => void _t(b)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ a(Ks, { "aria-hidden": "true" }),
        onSelect: () => No(b)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ a(ni, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: q,
        onSelect: () => {
          Be(null), Rn({ review: b, pending: !1 });
        }
      }
    ];
  }
  function Fo(b, q) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ a(Jr, { "aria-hidden": "true" }),
        ...q,
        disabled: q.disabled || Qe
      },
      ...Mo(b),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ a(Na, { "aria-hidden": "true" }),
        separated: !0,
        disabled: Qe,
        onSelect: Nr
      }
    ];
  }
  async function sa(b) {
    if (!i) return !1;
    let q = [];
    const R = await $d(i, (ne) => {
      q = ne;
      const lt = b(ne);
      return lt === ne ? ne : lt.map(Fp);
    });
    if (n(R), !qe.current) return !0;
    const z = A.current;
    z && !R.some((ne) => ne.id === z) && Tn();
    const te = q.find((ne) => ne.id === z), ie = R.find((ne) => ne.id === z);
    return ie && te && ((ie.view.reviewMode ?? "single") !== (te.view.reviewMode ?? "single") && Kt(null), ie.view.displayMode !== te.view.displayMode && hr(Ss(ie))), !0;
  }
  function ui(b) {
    return sa((q) => Mp(q, b));
  }
  function wl(b) {
    return ui(b).catch((q) => {
      throw A.current !== b.id && fi(b, q), q;
    });
  }
  function fi(b, q) {
    var z;
    if (!qe.current) return;
    const R = ((z = G.current.find((te) => te.id === b.id)) == null ? void 0 : z.name) ?? b.name;
    Be({ text: `“${R}” was not saved. ${Pa(q)}`, alert: !0 });
  }
  if (s)
    return /* @__PURE__ */ a(Cs, { label: "Loading reviews…" });
  if (d)
    return /* @__PURE__ */ u(he, { children: [
      /* @__PURE__ */ a(
        "button",
        {
          className: "dq-button",
          onClick: () => void _p().catch(
            (b) => f(
              "Could not export browser reviews. " + (b instanceof Error ? b.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ a(
        Ts,
        {
          message: d,
          onRetry: () => void Ma()
        }
      )
    ] });
  const pi = /* @__PURE__ */ u(he, { children: [
    Q && /* @__PURE__ */ a("p", { className: "dq-status", children: Q }),
    Mn && (Pe == null ? void 0 : Pe.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      Pe.message,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: gr,
          onClick: () => {
            br(!0), nn(""), (it ? Kd(Ft) : Bd(Ft)).then(vr).catch(
              (b) => nn(
                `Could not create the ${it ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (b instanceof Error ? b.message : "Request failed.")
              )
            ).finally(() => br(!1));
          },
          children: gr ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    Mn && ((Pe == null ? void 0 : Pe.kind) === "incompatible" || Ta) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(Dn, {}),
      Ta || (Pe == null ? void 0 : Pe.message),
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: gr,
          onClick: () => {
            br(!0), vr().finally(
              () => br(!1)
            );
          },
          children: gr ? "Checking…" : "Check again"
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
            ), R = document.createElement("a");
            R.href = q, R.download = "data-quality-unassigned-legacy-reviews.json", R.click(), URL.revokeObjectURL(q);
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
    Ue && (Ue.alert ? /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
      Ue.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ a("p", { className: "dq-status", "aria-hidden": "true", children: Ue.text })
    ))
  ] });
  return /* @__PURE__ */ u(
    "div",
    {
      ref: Qn,
      className: `data-quality-page${wr ? " dq-page-fit" : ""}`,
      style: wr ? {
        "--dq-fit-top": `${Ia.top}px`,
        "--dq-fit-bottom": `${Ia.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: Ue && !Ue.alert ? Ue.text : "" }),
        j && Me ? /* @__PURE__ */ a(
          bp,
          {
            review: de ?? j,
            canWrite: fr ? y : Fn,
            canAssess: (Pe == null ? void 0 : Pe.kind) === "ready" && Fn,
            onBusy: zn,
            editRequest: Tt,
            onEditRequestHandled: () => gt(0),
            onSaveDefaults: C ? wl : void 0,
            pageControls: {
              onBack: Nr,
              moreItems: (b) => Fo(de ?? j, b),
              onGrid: ae ? () => Kt({ id: ae.id, mode: "multiple" }) : void 0,
              notices: pi,
              busy: Qe
            },
            stayOnTap: Gn,
            onStayOnTapChange: dn
          },
          j.id
        ) : j ? Cl(j) : /* @__PURE__ */ a(
          qp,
          {
            reviews: t,
            counts: Z,
            sort: Ye,
            direction: Rt,
            onSortChange: (b) => Xt({ sort: b }),
            onDirectionChange: (b) => Xt({ direction: b }),
            storage: kp[x],
            canConfigure: C,
            busy: Zt,
            headingRef: Ut,
            notices: pi,
            onOpen: mt,
            onNew: () => oa(),
            onImport: (b) => void yl(b),
            onExportAll: () => Dc(t, "data-quality-reviews.json"),
            rowMenuItems: (b) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ a(Jr, { "aria-hidden": "true" }),
                disabled: !C || Zt,
                onSelect: () => Ln(b.id)
              },
              ...Mo(b)
            ]
          }
        ),
        _e && p && ae && /* @__PURE__ */ a(
          Dp,
          {
            video: p,
            review: ae,
            details: rp(p, ae, K.ids),
            selectedCount: $t.size,
            pending: Ie,
            refreshing: ve || !!We,
            error: mr,
            canWrite: l,
            assessmentReady: (Pe == null ? void 0 : Pe.kind) === "ready",
            trees: Yn,
            selected: $t.has(p.id),
            hasPrevious: xe.indexOf(p.id) > 0,
            hasNext: xe.indexOf(p.id) >= 0 && xe.indexOf(p.id) < xe.length - 1,
            onToggleSelected: () => se((b) => Va(b, p.id)),
            onPrevious: () => ye(-1),
            onNext: () => ye(1),
            onClose: () => {
              Pt(!1), H(pt.current);
            },
            onAction: Ze,
            findOpen: mn,
            onFindOpenChange: gn
          }
        ),
        mn && j && !Me && !_e && /* @__PURE__ */ a(
          wo,
          {
            actions: j.actions,
            tagGroups: E,
            trees: Yn,
            isDisabled: ot,
            onApply: (b, q) => {
              gn(!1), Ze(b, q);
            },
            onClose: () => gn(!1)
          }
        ),
        ut && /* @__PURE__ */ a(
          Sp,
          {
            draft: ut,
            onChange: (b) => Oe((q) => q && { ...q, review: b, error: "" }),
            onCreate: () => void xa(),
            onCancel: () => Oe(null)
          }
        ),
        /* @__PURE__ */ a(
          Bl,
          {
            open: !!Xe,
            title: "Delete review?",
            message: Xe ? `“${Xe.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (Xe == null ? void 0 : Xe.pending) ?? !1,
            onConfirm: () => void bl(),
            onCancel: () => Rn((b) => b != null && b.pending ? b : null)
          }
        )
      ]
    }
  );
  async function La(b, q, R = !1, z = !0) {
    const te = pt.current, ie = Math.max(0, xe.indexOf(te ?? -1));
    try {
      const ne = Cn(
        b,
        q,
        R,
        b.view.selectAllOnLoad === !0
      ), lt = rn.current, je = await ne;
      if (lt !== rn.current) return;
      const st = je.items.map((Jt) => Jt.id);
      tn(
        (Jt) => new Set([...Jt].filter((At) => st.includes(At)))
      );
      const dt = Bo(st, te, ie);
      ze(dt), z && !kt.current && H(dt, !1);
    } catch {
    }
  }
  function vl(b) {
    const q = I.current;
    if (I.current = null, ct || !j || !de) return;
    const R = q ?? j.view.objectFilter, z = sr(
      R,
      de.view.objectFilter
    ) ? de.view.objectFilter : R, te = Wt({ ...b, page: 1 }), ie = {
      ...j,
      view: {
        ...j.view,
        filter: te,
        objectFilter: z
      }
    }, ne = !qs(ie, de), lt = ne ? ie : de;
    bt(ne ? ie : null), Gt(ne ? "" : "Review queue defaults restored."), La(lt, te, lt.view.startFrom !== "beginning");
  }
  function Nl() {
    if (Ie || ve || Et || !de) return;
    I.current = null;
    const b = Wt({
      ...de.view.filter,
      page: 1
    });
    bt(null), Gt("Review queue defaults restored."), La(
      de,
      b,
      de.view.startFrom !== "beginning",
      !1
    );
  }
  function ql() {
    if (Ie || ve || We || Et || !j || !wn || !C)
      return;
    const b = j, q = wn;
    Ca(!0), ui(q).then((R) => {
      !R || A.current !== q.id || (bt(Ns(q, b)), Gt("Queue saved to this review."));
    }).catch((R) => {
      A.current !== q.id ? fi(q, R) : An(R instanceof Error ? R.message : "Could not save queue.");
    }).finally(() => Ca(!1));
  }
  function hi() {
    if (!j || !de || Jn.current || pe || En) return;
    qn.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, Mt.current = {
      temporaryReview: Ge,
      filter: J,
      loadedFilter: ke,
      queue: Ne,
      queueError: We,
      retryFromEnd: Xr,
      selectedIds: new Set($t),
      focusedId: ft,
      pageCursor: Pn.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const b = structuredClone({
      ...de,
      view: { ...de.view, startFrom: j.view.startFrom ?? "end" }
    });
    gn(!1), Pt(!1), Gt(""), An(""), Ot({ draft: b, saving: !1, error: "" });
  }
  function xo() {
    Ot(null), Mt.current = null;
    const b = qn.current;
    qn.current = null, requestAnimationFrame(() => {
      (b == null ? void 0 : b.isConnected) && b !== document.body && !(b instanceof HTMLButtonElement && b.disabled) ? b.focus({ preventScroll: !0 }) : H(pt.current, !1);
    });
  }
  function Sl() {
    var q;
    if (!pe || pe.saving) return;
    const b = Mt.current;
    b && (rn.current += 1, (q = Wn.current) == null || q.abort(), I.current = null, nt(!1), bt(b.temporaryReview), Se(b.filter), Re(b.loadedFilter), Ae(b.queue), pn(b.queueError), Zr(b.retryFromEnd), se(() => b.selectedIds), ze(b.focusedId), Pn.current = b.pageCursor, window.history.replaceState(window.history.state, "", b.url)), xo();
  }
  async function kl() {
    if (!pe || pe.saving || !Vt || !j) return;
    const b = j, q = { ...Vt, name: Vt.name.trim() }, R = ga(q);
    if (R) {
      Ot((z) => z && { ...z, error: R });
      return;
    }
    Ot((z) => z && { ...z, saving: !0, error: "" });
    try {
      if (!await ui(q)) throw new Error("Could not save reviews.");
      if (!qe.current || A.current !== q.id) return;
      bt(Ns(q, b)), Le(q) === "video" && fa(q.id, {
        filter: J,
        objectFilter: b.view.objectFilter,
        searchMode: q.view.searchMode,
        startFrom: q.view.startFrom ?? "end"
      }), Gt("Review saved."), xo();
    } catch (z) {
      if (A.current !== q.id) {
        fi(q, z);
        return;
      }
      Ot(
        (te) => te && {
          ...te,
          saving: !1,
          error: "Could not save review. Your edits are still open. " + (z instanceof Error ? z.message : "Retry saving.")
        }
      );
    }
  }
  function Po() {
    j && Cn(j, J, Xr, Mr).catch(() => {
    });
  }
  function El() {
    tn(/* @__PURE__ */ new Set()), hn.current.clear(), ze(null);
  }
  function Al(b) {
    !j || Ie || Et || b === Number(J.page) || Op(
      { ...J, page: b },
      j,
      (q, R) => Cn(q, R, !1, Mr),
      El
    );
  }
  function Lo(b) {
    if (!ae || !de || Ie || ve || Et) return;
    const q = cl(ae, b, de.view.objectFilter), R = !qs(q, de);
    bt(R ? q : null), R ? La(q, { ...J, page: 1 }) : La(
      de,
      { ...J, page: 1 },
      de.view.startFrom !== "beginning"
    );
  }
  function Cl(b) {
    var je, st, dt, Jt, At;
    const q = $e === "tag", R = q ? "tag" : "video", z = Math.max(1, Number(J.perPage) || 40), te = Math.max(1, Math.ceil(Ne.totalCount / z)), ie = Math.min(Math.max(1, Number(J.page) || 1), te), ne = [
      Vn ? "" : `${St} write permission is required to apply actions.`,
      q && F ? `Tag groups are unavailable. ${F}` : ""
    ].filter(Boolean), lt = !!mr && !_e;
    return /* @__PURE__ */ u(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": q ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ a(
            Uc,
            {
              name: b.name,
              description: b.description,
              entityType: $e,
              onBack: Nr,
              backDisabled: Ie || !!pe || Qe,
              onEdit: pe ? () => {
                var Fe;
                return (Fe = ur.current) == null ? void 0 : Fe.focus();
              } : hi,
              editDisabled: !pe && (Ie || ve || xn || En || Qe || !C),
              editing: !!pe,
              toolbar: /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: ct, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: q ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ a(
                  pa,
                  {
                    filter: We ? ke : J,
                    onFilterChange: vl,
                    totalCount: Ne.totalCount,
                    sortOptions: q ? Gl : Os,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: bn,
                    zoomLevel: (Lt - 225) / 50,
                    onZoomChange: (Fe) => Aa(Math.round(225 + Fe * 50)),
                    cardSizeEntityType: q ? "tags" : "videos",
                    criteriaDefinitions: q ? Kl : ti,
                    customFieldEntityType: $e === "video" ? "video" : void 0,
                    supportsFilterExpressions: !q,
                    objectFilter: Oa,
                    onObjectFilterChange: (Fe) => {
                      ct || (I.current = $e === "video" ? Gc(
                        Fe,
                        ea,
                        b.view.objectFilter
                      ) : Fe);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(Bc, { page: ie, pages: te, onPage: Al })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ u(he, { children: [
                ae && /* @__PURE__ */ a(
                  Kc,
                  {
                    mode: "multiple",
                    disabled: Ie || ve || Bt || !!pe || En || Qe,
                    onChange: () => Kt({ id: ae.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ a(
                  yf,
                  {
                    options: q ? Tp : Cp,
                    value: bn,
                    onChange: (Fe) => hr(ks(Fe, $e))
                  }
                )
              ] }),
              trailingEnd: /* @__PURE__ */ a(
                qo,
                {
                  disabled: Ie || !!pe,
                  items: Fo(de ?? b, {
                    onSelect: hi,
                    disabled: ve || xn || En || !C
                  })
                }
              ),
              queueDiffers: X ? (Ge == null ? void 0 : Ge.id) === S : void 0,
              queueChange: !pe && (Ge == null ? void 0 : Ge.id) === S ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: Ra ? ql : void 0,
                saveDisabled: Ie || ve || !!We || Et || !C,
                onReset: Nl,
                resetDisabled: Ie || ve || Et
              } : void 0,
              chipsAfter: (st = (je = ae == null ? void 0 : ae.presentation) == null ? void 0 : je.binParents) != null && st.length || (Jt = (dt = ae == null ? void 0 : ae.presentation) == null ? void 0 : dt.filterBins) != null && Jt.length ? /* @__PURE__ */ u(he, { children: [
                !!((At = ae.presentation.binParents) != null && At.length) && /* @__PURE__ */ a(
                  ap,
                  {
                    videos: Ne.items,
                    review: ae,
                    savedObjectFilter: (de ?? ae).view.objectFilter,
                    trees: K.ids,
                    disabled: Ie || ve || Et,
                    onToggle: Lo
                  }
                ),
                /* @__PURE__ */ a(
                  ip,
                  {
                    review: ae,
                    savedObjectFilter: (de ?? ae).view.objectFilter,
                    queueFilter: J,
                    queueCount: ve || We ? null : Ne.totalCount,
                    disabled: Ie || ve || Et,
                    countsPaused: Ie || ve || Et || !X,
                    onToggle: Lo
                  }
                )
              ] }) : void 0,
              chipsEnd: pe ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
            }
          ),
          pi,
          ae && K.error && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: K.error }),
          /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
            pe && Vt && /* @__PURE__ */ a(
              jc,
              {
                drawerRef: ur,
                draft: Vt,
                onChange: (Fe) => Ot((on) => on && { ...on, draft: Fe }),
                direction: pe.draft.view.startFrom ?? "end",
                onDirectionChange: (Fe) => Ot(
                  (on) => on && {
                    ...on,
                    draft: { ...on.draft, view: { ...on.draft.view, startFrom: Fe } }
                  }
                ),
                tagGroups: E,
                trees: Yn,
                saving: pe.saving,
                saveDisabled: ve || !!We,
                error: pe.error,
                dirty: ia,
                criteriaChanged: Ra,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  We && !ve ? /* @__PURE__ */ u("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { children: [
                      "The queue could not load: ",
                      We,
                      " ",
                      /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", onClick: Po, children: "Retry" })
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
                style: { "--dq-dock-height": `${ra}px` },
                children: [
                  /* @__PURE__ */ u("div", { className: "dq-grid-content", children: [
                    ve && !Ne.items.length && /* @__PURE__ */ a(Cs, { label: "Loading review queue…" }),
                    We && !ve && /* @__PURE__ */ a(
                      Ts,
                      {
                        message: We,
                        retryLabel: xn ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (xn && de && Le(de) === "video") {
                            const Fe = $r(de);
                            fa(de.id, { ...Fe, filter: { ...Fe.filter, page: void 0 } }), It((on) => on + 1);
                            return;
                          }
                          Po();
                        }
                      }
                    ),
                    !Ie && !ve && !We && !Ne.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ a(ri, {}),
                      /* @__PURE__ */ u("p", { children: [
                        "No ",
                        R,
                        "s match this review."
                      ] })
                    ] }),
                    !!Ne.items.length && /* @__PURE__ */ a("div", { ref: ta, children: /* @__PURE__ */ a(
                      "div",
                      {
                        className: bn === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${Lt}px` },
                        children: Ne.items.map(Tl)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ a("div", { className: "dq-bar-dock", ref: xr, children: /* @__PURE__ */ a(
                    $c,
                    {
                      actions: pe ? pe.draft.actions : b.actions,
                      tagGroups: E,
                      trees: Yn,
                      isDisabled: ot,
                      paused: !!pe,
                      busy: Ie || ve,
                      onApply: (Fe) => void Ze(Fe),
                      onFind: () => gn(!0),
                      status: Ie ? `Applying action to ${li}…` : "",
                      summary: /* @__PURE__ */ u(he, { children: [
                        /* @__PURE__ */ a("p", { className: "dq-bar-target", children: $t.size ? `${$t.size} selected` : ft == null ? "Nothing to apply to" : `Applies to the focused ${R}` }),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !xe.length || U,
                            onClick: () => se((Fe) => /* @__PURE__ */ new Set([...Fe, ...xe])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ a(qt, { binding: zt.selectAll, hidden: !0 })
                            ]
                          }
                        ),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Escape",
                            disabled: !$t.size,
                            onClick: () => se(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ a(qt, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: ne.length ? ne.join(" ") : void 0,
                      keyHints: q ? "Arrows move · Space selects · Enter opens" : pe ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews · Shift + key stays",
                      notices: lt || Hn ? /* @__PURE__ */ u(he, { children: [
                        lt && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
                          mr
                        ] }),
                        Hn && /* @__PURE__ */ a("p", { role: "status", className: "dq-status", children: Hn })
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
    var R, z, te;
    if ($e === "tag") {
      const ie = b;
      return /* @__PURE__ */ a(
        xp,
        {
          tag: ie,
          displayMode: bn === "list" ? "list" : "grid",
          focused: ie.id === ft,
          selected: $t.has(ie.id),
          setRef: (ne) => {
            ne ? yr.current.set(ie.id, ne) : yr.current.delete(ie.id);
          },
          onFocus: () => ze(ie.id),
          onToggle: () => {
            se((ne) => Va(ne, ie.id)), H(ie.id, !1);
          },
          onOpen: () => window.open(`/tag/${ie.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        ie.id
      );
    }
    const q = b;
    return /* @__PURE__ */ a(
      Pp,
      {
        video: ol(q, ae, K.ids),
        showTagBins: ((z = (R = ae == null ? void 0 : ae.presentation) == null ? void 0 : R.annotations) == null ? void 0 : z.includes("tags")) && !!((te = ae.presentation.annotationParents) != null && te.length),
        displayMode: bn,
        cardsScroll: na,
        focused: q.id === ft,
        selected: $t.has(q.id),
        setRef: (ie) => {
          ie ? yr.current.set(q.id, ie) : yr.current.delete(q.id);
        },
        onFocus: () => ze(q.id),
        onToggle: () => se((ie) => Va(ie, q.id)),
        onPreview: () => {
          pe || (ze(q.id), Pt(!0));
        },
        onNavigate: e
      },
      q.id
    );
  }
}
function Op(e, t, n, r) {
  r(), n(t, e).catch(() => {
  });
}
function Va(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function Mp(e, t) {
  if (!e.some((n) => n.id === t.id)) throw new Error("This review was deleted.");
  return e.map((n) => n.id === t.id ? t : n);
}
function Fp(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function xp({
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
function Pp({
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
  const m = ml(e), h = $(null), g = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, y = !!(g.date || g.studioName), N = !!(g.performers.length || g.tags.length);
  return Ct(() => {
    const E = h.current;
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
      o ? `Deselect ${m}` : `Select ${m}`
    );
    const L = E.querySelector(
      'button[title="Quick View"]'
    );
    L && L.setAttribute("aria-label", `Preview ${m}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (E) => {
        h.current = E, s(E);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${m}${o ? ", selected" : ""}`,
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
        n === "wall" && /* @__PURE__ */ a(Lp, { video: e, cardsScroll: r })
      ]
    }
  );
}
function Lp({ video: e, cardsScroll: t }) {
  const n = $(null), r = $(null), [i, o] = T(!1), [s, c] = T(!1), [d, f] = T(!1);
  return ee(() => {
    const l = n.current;
    if (!l || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      o(!0), c(!0);
      return;
    }
    const m = t ? l.closest(".dq-grid-stage") : null, h = new IntersectionObserver(
      ([y]) => o(y.isIntersecting),
      { root: m, rootMargin: "320px 0px", threshold: 0 }
    ), g = new IntersectionObserver(
      ([y]) => c(y.isIntersecting && y.intersectionRatio >= 0.6),
      { root: m, threshold: [0, 0.6, 1] }
    );
    return h.observe(l), g.observe(l), () => {
      h.disconnect(), g.disconnect();
    };
  }, [e.id, e.files.length, t]), ee(() => {
    if (!i) {
      f(!1);
      return;
    }
    const l = new AbortController();
    return ge(jd(e.id), {
      signal: l.signal
    }).then((m) => {
      l.signal.aborted || f(m.available === !0);
    }).catch(() => {
      l.signal.aborted || f(!1);
    }), () => l.abort();
  }, [i, e.id]), ee(() => {
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
function Dp({
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
  hasPrevious: m,
  hasNext: h,
  onToggleSelected: g,
  onPrevious: y,
  onNext: N,
  onClose: v,
  onAction: w,
  findOpen: E,
  onFindOpenChange: O
}) {
  const F = $(null), B = Ea(), C = $(null), L = $(null), x = e.files[0], re = ml(e), Q = (P) => i || o || "steps" in P && P.steps.length > 0 && !c || ir(P) && !d;
  go({
    surface: "overlay",
    enabled: !E,
    actions: t.actions,
    onAction: (P, X) => {
      const Y = t.actions[P];
      Y && w(Y, X);
    },
    onFind: () => O(!0)
  }), ee(() => {
    var X;
    const P = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (X = F.current) == null || X.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = P;
    };
  }, []);
  function _(P) {
    var oe, W, S;
    if (P.key !== "Tab") return;
    const X = [
      ...((oe = F.current) == null ? void 0 : oe.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ce) => ce.offsetParent !== null);
    if (!X.length) {
      P.preventDefault(), (W = F.current) == null || W.focus();
      return;
    }
    const Y = X.indexOf(
      document.activeElement
    );
    P.shiftKey && Y <= 0 ? (P.preventDefault(), (S = X.at(-1)) == null || S.focus()) : !P.shiftKey && Y === X.length - 1 && (P.preventDefault(), X[0].focus());
  }
  function V(P) {
    if (E || P.defaultPrevented || P.ctrlKey || P.metaKey || P.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const X = P.key === "ArrowLeft" || P.key === "ArrowRight";
    if (P.altKey && !X) return;
    const Y = C.current, oe = P.currentTarget.querySelector("video");
    if (P.key === "Enter" || P.key === "Escape")
      P.repeat || v();
    else if (P.key === " " && Y)
      P.repeat || Y.toggle();
    else if (X && Y)
      Y.seekBy(
        (P.key === "ArrowLeft" ? -1 : 1) * (P.shiftKey ? 5 : P.altKey ? 10 : 60)
      );
    else if (/^[0-9]$/.test(P.key) && Y) {
      const W = L.current;
      if (!P.repeat && (W == null ? void 0 : W.videoId) === e.id) {
        const S = [x == null ? void 0 : x.duration, oe == null ? void 0 : oe.duration].find(
          (le) => le != null && Number.isFinite(le) && le > 0
        ) ?? 0, ce = e.parentVideoId != null, A = ce ? e.clipStartSec ?? 0 : 0, Z = (ce ? e.clipEndSec ?? S : S) - A;
        Number.isFinite(Z) && Z > 0 && Number.isFinite(W.time) && Y.seekBy(A + Z * Number(P.key) / 10 - W.time);
      }
    } else if (P.key === "ArrowUp" || P.key === "ArrowDown")
      !P.repeat && !i && !o && (P.key === "ArrowUp" && m && y(), P.key === "ArrowDown" && h && N());
    else return;
    Br(P);
  }
  function M(P) {
    const X = F.current, Y = P.target instanceof Element ? P.target.closest("button, a[href]") : null;
    !X || !Y || !X.contains(Y) || Y.closest(".dq-player, .dq-find-action") || P.detail === 0 || X.focus({ preventScroll: !0 });
  }
  ee(() => {
    if (E) return;
    let P = 0;
    const X = requestAnimationFrame(() => {
      P = requestAnimationFrame(() => {
        var oe;
        const Y = document.activeElement;
        (oe = F.current) != null && oe.isConnected && (!Y || Y === document.body || Y === document.documentElement) && F.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(X), cancelAnimationFrame(P);
    };
  }, [E, i, o, h, m, e.id, B]);
  const D = r ? `the ${r} selected video${r === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ u(
    "div",
    {
      ref: F,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${re}`,
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
                disabled: !m || i || o,
                onClick: y,
                children: [
                  /* @__PURE__ */ a(Na, { "aria-hidden": "true" }),
                  !B && /* @__PURE__ */ a(qt, { binding: "↑", hidden: !0 })
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
                disabled: !h || i || o,
                onClick: N,
                children: [
                  !B && /* @__PURE__ */ a(qt, { binding: "↓", hidden: !0 }),
                  /* @__PURE__ */ a(Us, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ u("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ a("h2", { children: re }),
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
                "aria-label": `Open ${re} in a new tab`,
                title: "Open video in a new tab",
                children: /* @__PURE__ */ a(Bs, { "aria-hidden": "true" })
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
            Ms,
            {
              autostart: !0,
              streamUrl: Mi("video", e.id),
              posterUrl: zo(e),
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
          ) : /* @__PURE__ */ a("img", { src: zo(e), alt: "" }) }) }),
          s && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert dq-preview-alert", children: s }),
          !B && /* @__PURE__ */ u("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ a("span", { children: "Space play / pause" }),
            /* @__PURE__ */ a("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ a("span", { children: "0–9 jump to 0–90 %" }),
            /* @__PURE__ */ a("span", { children: "↑ ↓ previous / next" }),
            /* @__PURE__ */ a("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ a(
            $c,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: f,
              isDisabled: Q,
              busy: i || o,
              onApply: (P) => void w(P),
              onFind: () => O(!0),
              status: i ? `Applying action to ${D}…` : "",
              summary: /* @__PURE__ */ a("p", { className: "dq-bar-target", children: r ? `${r} selected` : "This video" })
            }
          )
        ] }),
        E && /* @__PURE__ */ a(
          wo,
          {
            actions: t.actions,
            trees: f,
            isDisabled: Q,
            onApply: (P, X) => {
              O(!1), w(P, X);
            },
            onClose: () => O(!1)
          }
        )
      ]
    }
  );
}
async function _p() {
  const e = await ge("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
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
function Cs({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ a(ad, { className: "dq-spin" }),
    e
  ] });
}
function Ts({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ a(Dn, {}),
    /* @__PURE__ */ a("p", { children: e }),
    /* @__PURE__ */ a("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const zp = { components: { DataQualityPage: Rp } };
export {
  Rp as DataQualityPage,
  zp as default,
  sr as objectFiltersEqual
};
