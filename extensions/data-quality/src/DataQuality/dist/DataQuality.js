import { jsx as t, jsxs as a, Fragment as ue } from "react/jsx-runtime";
import { useState as v, useRef as x, useCallback as ee, useEffect as B, useMemo as st } from "react";
import { VideoPlayer as lt, getResolutionLabel as ct, formatDuration as dt, EntityReferenceMultiSelector as ut } from "@cove/runtime/components";
import { Pencil as Je, Film as je, AlertTriangle as We, Loader2 as Ge, ChevronLeft as ft, ChevronRight as pt, ExternalLink as ht, X as Xe, Plus as mt, Upload as gt, Trash2 as Ye, Check as bt, Play as yt } from "@cove/runtime/lucide-react";
import { extensionFetch as wt } from "@cove/runtime/api";
function Ae(e) {
  return !!e.label.trim() && e.steps.every(
    (n) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(n.mode) && n.tagIds.length > 0 && n.tagIds.every((i) => Number.isSafeInteger(i) && i > 0)
  );
}
function Se(e) {
  if (!e) return [];
  const n = JSON.parse(e);
  if (!Array.isArray(n) || !n.every(
    (i) => i && typeof i == "object" && typeof i.id == "string" && typeof i.name == "string" && typeof i.description == "string" && i.view && typeof i.view == "object" && ["grid", "list", "wall", "tagger"].includes(i.view.displayMode) && typeof i.view.searchMode == "string" && i.view.filter && typeof i.view.filter == "object" && !Array.isArray(i.view.filter) && i.view.objectFilter && typeof i.view.objectFilter == "object" && !Array.isArray(i.view.objectFilter) && (i.importNotes === void 0 || Array.isArray(i.importNotes) && i.importNotes.every(
      (o) => typeof o == "string"
    )) && Array.isArray(i.actions) && i.actions.every(
      (o) => typeof (o == null ? void 0 : o.id) == "string" && typeof o.label == "string" && Array.isArray(o.steps) && o.steps.every((s) => s && Array.isArray(s.tagIds)) && Ae(o)
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  return n;
}
function Re(...e) {
  const n = [], i = /* @__PURE__ */ new Set();
  for (const o of e)
    for (const s of o)
      i.has(s.id) || (i.add(s.id), n.push(s));
  return n;
}
function Ke(e, n) {
  return e.size > 0 ? [...e].sort((i, o) => i - o) : n == null ? [] : [n];
}
function vt(e, n, i, o) {
  if (n.length === 0) return null;
  if (i == null) return n[0];
  if (!o && n.includes(i)) return i;
  const s = Math.max(0, e.indexOf(i));
  if (o) {
    for (const c of e.slice(s + 1))
      if (n.includes(c)) return c;
    if (n.includes(i)) {
      for (const c of e.slice(0, s).reverse())
        if (n.includes(c)) return c;
      return i;
    }
  }
  return n[Math.min(s, n.length - 1)];
}
function Nt(e, n) {
  const i = new Set(e), o = n.length > 0 && n.every((s) => i.has(s));
  for (const s of n)
    o ? i.delete(s) : i.add(s);
  return i;
}
function Ct(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const Et = "ext:cove-data-quality:video-reviews", St = "cove-data-quality-reviews-v1", Rt = {
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
function fe(e) {
  return Array.isArray(e) ? e.map(fe) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([n, i]) => [
      n,
      n === "modifier" && typeof i == "string" ? Rt[i] ?? i : fe(i)
    ])
  ) : e;
}
async function W(e, n = {}) {
  const i = new Headers(n.headers);
  !(n.body instanceof FormData) && !i.has("Content-Type") && i.set("Content-Type", "application/json");
  const o = await wt(e, { ...n, headers: i });
  if (!o.ok) {
    let c = o.statusText || `Request failed (${o.status}).`;
    try {
      const g = await o.json();
      c = g.message || g.detail || c;
    } catch {
    }
    throw new Error(c);
  }
  if (o.status === 204 || o.status === 205) return;
  const s = await o.text();
  return s ? JSON.parse(s) : void 0;
}
async function At() {
  const e = await W(
    "/api/auth/me"
  ), n = `${St}:${e.user.id}`, i = [
    n,
    `cove-video-reviews-v1:${n.split(":").at(-1)}`,
    "page-videos"
  ], o = [], s = /* @__PURE__ */ new Set();
  for (const u of i) {
    const T = localStorage.getItem(u);
    T && o.push(Se(T));
    const P = JSON.parse(
      localStorage.getItem(`${u}:account-imports`) ?? "[]"
    );
    if (!Array.isArray(P) || !P.every((d) => typeof d == "string"))
      throw new Error(
        "Account import history could not be read. Existing browser reviews have been kept."
      );
    for (const d of P) s.add(d);
  }
  const g = (await W(
    `/api/savedfilters?mode=${encodeURIComponent(Et)}`
  )).flatMap(
    (u) => Se(u.uiOptions ?? "[]")
  ), N = Re(...o), h = new Set(N.map((u) => u.id)), b = g.filter(
    (u) => !h.has(u.id) && !s.has(u.id)
  ), y = Re(N, b);
  for (const u of g) s.add(u.id);
  return localStorage.setItem(n, JSON.stringify(y)), localStorage.setItem(
    `${n}:account-imports`,
    JSON.stringify([...s])
  ), {
    reviews: y,
    storageKey: n,
    canWrite: e.permissions.includes("*") || e.permissions.includes("videos.write")
  };
}
function qt(e, n) {
  localStorage.setItem(e, JSON.stringify(n));
}
async function kt(e, n, i) {
  const o = { ...e.view.objectFilter }, s = o._filterExpression;
  if (delete o._filterExpression, delete o.includeCompilationGroups, e.view.searchMode === "visual" && typeof n.q == "string" && n.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return W("/api/videos/find", {
    method: "POST",
    signal: i,
    body: JSON.stringify(
      fe({
        findFilter: n,
        objectFilter: o,
        filterExpression: s
      })
    )
  });
}
function Ze(e) {
  return `/api/videos/${e.id}/image?max=640&v=${encodeURIComponent(e.updatedAt)}`;
}
function xt(e) {
  return `/api/stream/video/${e}`;
}
function Ve(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Pt(e) {
  return `/api/stream/video/${e}/preview`;
}
function Tt(e) {
  return `/api/stream/video/${e}/preview/status`;
}
async function Ot(e) {
  const n = /* @__PURE__ */ new Set();
  for (const i of e) {
    await W(`/api/tags/${i}`), n.add(i);
    for (let o = 1; ; o++) {
      const s = await W("/api/tags/find", {
        method: "POST",
        body: JSON.stringify(
          fe({
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
      for (const c of s.items) n.add(c.id);
      if (o * 1e3 >= s.totalCount) break;
      if (!s.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...n];
}
async function Mt(e, n) {
  if (!Ae(e) || n.length === 0 || n.some((o) => !Number.isSafeInteger(o) || o <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  const i = await Promise.all(
    e.steps.map(async (o) => ({
      mode: o.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: o.mode === "REMOVE_TREE" ? await Ot(o.tagIds) : o.tagIds
    }))
  );
  for (let o = 0; o < i.length; o++)
    try {
      await W("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify({
          ids: [...n],
          tagIds: [...i[o].tagIds],
          tagMode: i[o].mode
        })
      });
    } catch (s) {
      throw new Error(
        `Step ${o + 1} failed; ${o} earlier step(s) completed. Refresh and check the selected videos before retrying. ${s instanceof Error ? s.message : "Request failed."}`
      );
    }
}
function $t(e) {
  return e.view.displayMode === "wall" || e.view.displayMode === "list" ? e.view.displayMode : "grid";
}
function It() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function ze(e) {
  const n = new URLSearchParams(window.location.search);
  e ? n.set("review", e) : n.delete("review");
  const i = n.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${i ? `?${i}` : ""}`
  );
}
function Dt(e) {
  return { ...e, page: 1, perPage: Number(e.perPage) || 40 };
}
function qe(e) {
  var n;
  return e.title || ((n = e.files[0]) == null ? void 0 : n.basename) || `Video ${e.id}`;
}
function M(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
function Lt({
  onNavigate: e
}) {
  const [n, i] = v([]), [o, s] = v(""), [c, g] = v(!0), [N, h] = v(""), [b, y] = v(!1), [u, T] = v(It), [P, d] = v(!1), l = n.find((r) => r.id === u) ?? null, [m, C] = v({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [S, H] = v({ items: [], totalCount: 0 }), [A, f] = v(!1), [E, k] = v(""), [I, L] = v(() => /* @__PURE__ */ new Set()), G = x(I);
  G.current = I;
  const j = x(/* @__PURE__ */ new Map()), [U, K] = v(null), V = x(U);
  V.current = U;
  const [F, X] = v(!1), Y = x(F);
  Y.current = F;
  const ke = x(null), [Z, xe] = v("grid"), [oe, pe] = v(null), [z, he] = v(!1), ae = x(!1), [et, me] = v(""), [Pe, ge] = v(""), [Te, se] = v(""), be = x(/* @__PURE__ */ new Map()), Oe = x(null), le = x(0), ye = x(0), Me = ee(async () => {
    g(!0), h("");
    try {
      const r = await At();
      i(r.reviews), s(r.storageKey), y(r.canWrite), u && !r.reviews.some((p) => p.id === u) && (T(""), ze(""));
    } catch (r) {
      h(
        r instanceof Error ? r.message : "Could not load reviews."
      );
    } finally {
      g(!1);
    }
  }, [u]);
  B(() => {
    Me();
  }, []);
  const J = ee(
    async (r, p) => {
      const w = ++le.current;
      f(!0), k("");
      try {
        const q = await kt(r, p);
        return w === le.current && H(q), q;
      } catch (q) {
        throw w === le.current && k(
          q instanceof Error ? q.message : "Could not load the review queue."
        ), q;
      } finally {
        w === le.current && f(!1);
      }
    },
    []
  );
  B(() => {
    if (ye.current += 1, L(/* @__PURE__ */ new Set()), j.current.clear(), K(null), X(!1), he(!1), ae.current = !1, me(""), ge(""), se(""), H({ items: [], totalCount: 0 }), !l) return;
    const r = Dt(l.view.filter);
    C(r), xe($t(l)), pe(null), J(l, r).catch(() => {
    });
  }, [l == null ? void 0 : l.id]);
  const R = st(
    () => S.items.map((r) => r.id),
    [S.items]
  ), $e = Math.max(
    1,
    Math.ceil(S.totalCount / Math.max(1, Number(m.perPage) || 40))
  ), te = S.items.find((r) => r.id === U) ?? null;
  F && te && (ke.current = te);
  const Q = te ?? (F ? ke.current : null), tt = Ke(I, U), Ie = I.size > 0 ? `${I.size} selected video${I.size === 1 ? "" : "s"}` : U == null ? "no video" : "focused video", _ = ee((r, p = !0) => {
    r != null && window.requestAnimationFrame(() => {
      const w = be.current.get(r);
      w == null || w.focus({ preventScroll: !0 }), p && (w == null || w.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  B(() => {
    A || !R.length || (V.current == null || !R.includes(V.current)) && (K(R[0]), Y.current || _(R[0]));
  }, [_, R, A]);
  const re = ee(
    (r) => {
      L((p) => {
        const w = r(p);
        for (const q of /* @__PURE__ */ new Set([...p, ...w]))
          p.has(q) !== w.has(q) && j.current.set(
            q,
            (j.current.get(q) ?? 0) + 1
          );
        return w;
      });
    },
    []
  ), ce = ee(
    (r) => {
      if (!R.length) return;
      const p = Math.max(
        0,
        R.indexOf(V.current ?? R[0])
      ), w = R[Math.max(0, Math.min(R.length - 1, p + r))];
      K(w), Y.current || _(w);
    },
    [_, R]
  ), we = ee(
    async (r) => {
      const p = Ke(
        G.current,
        V.current
      );
      if (!l || ae.current || A || !b || !p.length)
        return;
      const w = ++ye.current, q = l.id, ne = [...R], Ue = V.current, ot = new Map(
        p.map((O) => [O, j.current.get(O) ?? 0])
      ), ie = () => w === ye.current && l.id === q;
      ae.current = !0, he(!0), me(
        G.current.size ? `${p.length} selected videos` : "the focused video"
      ), ge(""), se("");
      let Ne = !1;
      try {
        if (await Mt(r, p), Ne = !0, !ie()) return;
        L((O) => {
          const $ = new Set(O);
          for (const D of p)
            (j.current.get(D) ?? 0) === ot.get(D) && $.delete(D);
          return $;
        }), ge(
          `${r.label}: ${p.length} video${p.length === 1 ? "" : "s"} ${r.steps.length ? "updated" : "skipped"}.`
        );
      } catch (O) {
        if (!ie()) return;
        se(
          O instanceof Error ? O.message : "Action failed."
        );
      }
      try {
        const O = await J(l, m);
        if (!ie()) return;
        let $ = O.items.map((D) => D.id);
        if (!$.length && O.totalCount > 0 && Number(m.page) > 1) {
          const D = Math.max(1, Number(m.page) - 1), de = { ...m, page: D };
          C(de), $ = (await J(l, de)).items.map((Ce) => Ce.id), L(
            (Ce) => new Set([...Ce].filter((at) => $.includes(at)))
          );
          const _e = $.at(-1) ?? null;
          K(_e), Y.current || _(_e);
        } else {
          L(
            (de) => new Set([...de].filter((Fe) => $.includes(Fe)))
          );
          const D = vt(
            ne,
            $,
            Ue,
            Ne && p.includes(Ue ?? -1)
          );
          K(D), Y.current && D == null && X(!1), Y.current || _(D);
        }
      } catch (O) {
        ie() && se(
          ($) => `${$ ? `${$} ` : ""}${Ne ? "The action completed, but " : ""}the queue could not be refreshed. ${O instanceof Error ? O.message : "Refresh failed."}`
        );
      } finally {
        ie() && (ae.current = !1, he(!1), me(""));
      }
    },
    [b, J, m, _, R, A, l]
  );
  function rt() {
    var w;
    const r = (w = Oe.current) == null ? void 0 : w.firstElementChild, p = r ? getComputedStyle(r).gridTemplateColumns : "";
    return Math.max(1, p.split(" ").filter(Boolean).length);
  }
  function nt(r) {
    if (r.defaultPrevented || r.repeat || r.ctrlKey || r.altKey || r.metaKey)
      return;
    if (F && r.key === "Escape") {
      M(r), X(!1), _(V.current);
      return;
    }
    if (!Ct(r.target)) return;
    if (r.key === "Escape") {
      M(r), re(() => /* @__PURE__ */ new Set());
      return;
    }
    const p = /^[1-9]$/.test(r.key) ? Number(r.key) - 1 : -1;
    if (p >= 0 && (l != null && l.actions[p])) {
      M(r), !z && !A && we(l.actions[p]);
      return;
    }
    if (!F && r.key === " ") {
      M(r), U != null && re((ne) => Ee(ne, U));
      return;
    }
    if (!F && r.key.toLowerCase() === "a") {
      M(r), re(
        (ne) => Nt(ne, R)
      );
      return;
    }
    if (z || A) return;
    if (F) {
      (r.key === "ArrowLeft" || r.key === "ArrowRight") && (M(r), ce(r.key === "ArrowLeft" ? -1 : 1));
      return;
    }
    if (r.key === "Enter" && U != null) {
      M(r), X(!0);
      return;
    }
    const w = rt(), q = r.key === "ArrowLeft" ? -1 : r.key === "ArrowRight" ? 1 : r.key === "ArrowUp" ? -w : r.key === "ArrowDown" ? w : 0;
    q && (M(r), ce(q));
  }
  function ve(r) {
    T(r), ze(r);
  }
  function it(r) {
    if (!o) return !1;
    try {
      qt(o, r);
    } catch {
      return !1;
    }
    return i(r), u && !r.some((p) => p.id === u) && ve(""), !0;
  }
  if (c)
    return /* @__PURE__ */ t(Be, { label: "Loading Data Quality reviews…" });
  if (N)
    return /* @__PURE__ */ t(
      He,
      {
        message: N,
        onRetry: () => void Me()
      }
    );
  return /* @__PURE__ */ a("div", { className: "data-quality-page", onKeyDown: nt, children: [
    /* @__PURE__ */ a("header", { className: "data-quality-header", children: [
      /* @__PURE__ */ a("div", { children: [
        /* @__PURE__ */ t("h1", { children: "Data Quality" }),
        /* @__PURE__ */ t("p", { children: "A focused queue for previewing videos and applying saved review actions." })
      ] }),
      /* @__PURE__ */ a("label", { children: [
        "Review",
        /* @__PURE__ */ a(
          "select",
          {
            value: (l == null ? void 0 : l.id) ?? "",
            disabled: z,
            onChange: (r) => ve(r.target.value),
            children: [
              /* @__PURE__ */ t("option", { value: "", children: "Choose a review…" }),
              n.map((r) => /* @__PURE__ */ t("option", { value: r.id, children: r.name }, r.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ a(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => d(!0),
          children: [
            /* @__PURE__ */ t(Je, {}),
            " Manage reviews"
          ]
        }
      )
    ] }),
    l ? /* @__PURE__ */ a(ue, { children: [
      /* @__PURE__ */ a("section", { className: "dq-toolbar", children: [
        /* @__PURE__ */ a("div", { className: "dq-review-title", children: [
          /* @__PURE__ */ t("h2", { children: l.name }),
          l.description && /* @__PURE__ */ t("p", { children: l.description })
        ] }),
        /* @__PURE__ */ t(
          "div",
          {
            className: "dq-view-switch",
            role: "group",
            "aria-label": "Review view",
            children: ["grid", "list", "wall"].map((r) => /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                "aria-pressed": Z === r,
                onClick: () => xe(r),
                children: r
              },
              r
            ))
          }
        ),
        Z !== "list" && /* @__PURE__ */ a(ue, { children: [
          /* @__PURE__ */ a("label", { className: "dq-card-size", children: [
            "Card width",
            /* @__PURE__ */ t(
              "input",
              {
                "aria-label": "Review card size",
                type: "range",
                min: "115",
                max: "380",
                step: "5",
                value: oe ?? (Z === "wall" ? 130 : 180),
                onChange: (r) => pe(Number(r.target.value))
              }
            )
          ] }),
          /* @__PURE__ */ t(
            "button",
            {
              className: `dq-button ${oe == null ? "active" : ""}`,
              type: "button",
              onClick: () => pe(null),
              children: "Auto fit"
            }
          )
        ] }),
        /* @__PURE__ */ a("span", { children: [
          S.totalCount.toLocaleString(),
          " matching"
        ] }),
        /* @__PURE__ */ t(
          "button",
          {
            className: "dq-button",
            type: "button",
            disabled: Number(m.page) <= 1 || z || A,
            onClick: () => Qe(
              { ...m, page: Number(m.page) - 1 },
              l,
              C,
              J,
              De
            ),
            children: "Prev"
          }
        ),
        /* @__PURE__ */ a("span", { children: [
          Number(m.page) || 1,
          " / ",
          $e
        ] }),
        /* @__PURE__ */ t(
          "button",
          {
            className: "dq-button",
            type: "button",
            disabled: Number(m.page) >= $e || z || A,
            onClick: () => Qe(
              { ...m, page: Number(m.page) + 1 },
              l,
              C,
              J,
              De
            ),
            children: "Next"
          }
        )
      ] }),
      Te && /* @__PURE__ */ a("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ t(We, {}),
        Te
      ] }),
      Pe && /* @__PURE__ */ t("p", { role: "status", className: "dq-status", children: Pe }),
      /* @__PURE__ */ a("div", { className: "dq-workspace", children: [
        /* @__PURE__ */ a("main", { children: [
          A && !S.items.length && /* @__PURE__ */ t(Be, { label: "Loading review queue…" }),
          E && !A && /* @__PURE__ */ t(
            He,
            {
              message: E,
              onRetry: () => void J(l, m).catch(() => {
              })
            }
          ),
          !A && !E && !S.items.length && /* @__PURE__ */ a("div", { className: "dq-empty", children: [
            /* @__PURE__ */ t(je, {}),
            /* @__PURE__ */ t("p", { children: "No videos match this review." })
          ] }),
          !!S.items.length && /* @__PURE__ */ t("div", { ref: Oe, children: Z === "list" ? /* @__PURE__ */ t("div", { className: "dq-list", "data-review-layout": "list", children: S.items.map(Le) }) : /* @__PURE__ */ t(
            "div",
            {
              className: "dq-grid",
              style: {
                "--dq-card-width": oe == null ? Z === "wall" ? "clamp(115px, 10vw, 150px)" : "clamp(145px, 14vw, 180px)" : `${oe}px`
              },
              children: S.items.map(Le)
            }
          ) })
        ] }),
        /* @__PURE__ */ a("aside", { className: "dq-actions", children: [
          /* @__PURE__ */ t("strong", { children: Ie }),
          /* @__PURE__ */ a("p", { children: [
            "Focus: ",
            te ? qe(te) : "none"
          ] }),
          l.actions.map((r, p) => /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              disabled: z || A || !b || !tt.length,
              onClick: () => void we(r),
              children: [
                p < 9 && /* @__PURE__ */ t("kbd", { children: p + 1 }),
                /* @__PURE__ */ t("span", { children: r.label }),
                /* @__PURE__ */ t("small", { children: r.steps.length ? `${r.steps.length} step(s)` : "Skip" })
              ]
            },
            r.id
          )),
          !l.actions.length && /* @__PURE__ */ t("p", { children: "This review has no actions." }),
          !b && /* @__PURE__ */ t("p", { children: "Video write permission is required to apply actions." }),
          z && /* @__PURE__ */ a("p", { role: "status", children: [
            /* @__PURE__ */ t(Ge, { className: "dq-spin" }),
            " Applying action to",
            " ",
            et,
            "…"
          ] }),
          /* @__PURE__ */ t("p", { className: "dq-shortcuts", children: "←→↑↓ move · space select · enter preview · 1–9 apply · A toggle shown · Esc clear" })
        ] })
      ] })
    ] }) : /* @__PURE__ */ a("div", { className: "dq-empty", children: [
      /* @__PURE__ */ t(je, {}),
      /* @__PURE__ */ t("p", { children: n.length ? "Choose a saved review to open its queue." : "No saved reviews are available in this browser." })
    ] }),
    F && Q && l && /* @__PURE__ */ t(
      _t,
      {
        video: Q,
        review: l,
        targetLabel: Ie,
        pending: z,
        refreshing: A,
        canWrite: b,
        selected: I.has(Q.id),
        hasPrevious: R.indexOf(Q.id) > 0,
        hasNext: R.indexOf(Q.id) >= 0 && R.indexOf(Q.id) < R.length - 1,
        onToggleSelected: () => re((r) => Ee(r, Q.id)),
        onPrevious: () => ce(-1),
        onNext: () => ce(1),
        onClose: () => {
          X(!1), _(V.current);
        },
        onAction: we,
        onOpen: () => e({ page: "video", id: Q.id })
      }
    ),
    P && /* @__PURE__ */ t(
      jt,
      {
        reviews: n,
        activeReview: l,
        onSave: it,
        onChoose: ve,
        onClose: () => d(!1)
      }
    )
  ] });
  function De() {
    L(/* @__PURE__ */ new Set()), j.current.clear(), K(null);
  }
  function Le(r) {
    return /* @__PURE__ */ t(
      Ut,
      {
        video: r,
        displayMode: Z,
        focused: r.id === U,
        selected: I.has(r.id),
        setRef: (p) => {
          p ? be.current.set(r.id, p) : be.current.delete(r.id);
        },
        onFocus: () => K(r.id),
        onToggle: () => re((p) => Ee(p, r.id)),
        onPreview: () => {
          K(r.id), X(!0);
        }
      },
      r.id
    );
  }
}
function Qe(e, n, i, o, s) {
  i(e), s(), o(n, e).catch(() => {
  });
}
function Ee(e, n) {
  const i = new Set(e);
  return i.has(n) ? i.delete(n) : i.add(n), i;
}
function Ut({
  video: e,
  displayMode: n,
  focused: i,
  selected: o,
  setRef: s,
  onFocus: c,
  onToggle: g,
  onPreview: N
}) {
  const h = e.files[0], b = qe(e), y = /* @__PURE__ */ a(ue, { children: [
    /* @__PURE__ */ t(
      "button",
      {
        type: "button",
        "aria-label": o ? `Deselect ${b}` : `Select ${b}`,
        onClick: (u) => {
          u.stopPropagation(), g();
        },
        className: `dq-select ${o ? "selected" : ""}`,
        children: o && /* @__PURE__ */ t(bt, {})
      }
    ),
    /* @__PURE__ */ t(
      "button",
      {
        type: "button",
        "aria-label": `Preview ${b}`,
        onClick: (u) => {
          u.stopPropagation(), N();
        },
        className: "dq-preview-button",
        children: /* @__PURE__ */ t(yt, {})
      }
    ),
    /* @__PURE__ */ a("div", { className: "dq-badges", children: [
      h && /* @__PURE__ */ t("span", { children: ct(h.width, h.height) }),
      h != null && h.duration ? /* @__PURE__ */ t("span", { children: dt(h.duration) }) : null
    ] })
  ] });
  return /* @__PURE__ */ a(
    "article",
    {
      ref: s,
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${b}${o ? ", selected" : ""}`,
      onFocus: c,
      onClick: (u) => {
        c(), u.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-card ${n} ${i ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        n === "wall" ? /* @__PURE__ */ a(Ft, { video: e, children: [
          y,
          /* @__PURE__ */ t("p", { className: "dq-wall-title", children: b })
        ] }) : /* @__PURE__ */ a("div", { className: "dq-poster", children: [
          /* @__PURE__ */ t("img", { src: Ze(e), alt: "" }),
          y
        ] }),
        n !== "wall" && /* @__PURE__ */ a("div", { className: "dq-card-copy", children: [
          /* @__PURE__ */ t("strong", { children: b }),
          /* @__PURE__ */ t("small", { children: [
            e.date,
            e.studioName,
            e.performers.map((u) => u.name).join(", ")
          ].filter(Boolean).join(" · ") })
        ] })
      ]
    }
  );
}
function Ft({
  video: e,
  children: n
}) {
  const i = x(null), o = x(null), [s, c] = v(!1), [g, N] = v(!1), [h, b] = v(!1);
  return B(() => {
    const y = i.current;
    if (!y || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      c(!0), N(!0);
      return;
    }
    const u = new IntersectionObserver(
      ([P]) => c(P.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), T = new IntersectionObserver(
      ([P]) => N(P.isIntersecting && P.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return u.observe(y), T.observe(y), () => {
      u.disconnect(), T.disconnect();
    };
  }, [e.id, e.files.length]), B(() => {
    if (!s) {
      b(!1);
      return;
    }
    const y = new AbortController();
    return W(Tt(e.id), {
      signal: y.signal
    }).then((u) => {
      y.signal.aborted || b(u.available === !0);
    }).catch(() => {
      y.signal.aborted || b(!1);
    }), () => y.abort();
  }, [s, e.id]), B(() => {
    const y = o.current;
    y && (g ? Promise.resolve(y.play()).catch(() => {
    }) : y.pause());
  }, [h, g]), /* @__PURE__ */ a("div", { ref: i, className: "dq-wall-media", children: [
    /* @__PURE__ */ t("img", { src: Ze(e), alt: "" }),
    h && /* @__PURE__ */ t(
      "video",
      {
        ref: o,
        src: Pt(e.id),
        muted: !0,
        loop: !0,
        playsInline: !0,
        preload: "metadata"
      }
    ),
    n
  ] });
}
function _t({
  video: e,
  review: n,
  targetLabel: i,
  pending: o,
  refreshing: s,
  canWrite: c,
  selected: g,
  hasPrevious: N,
  hasNext: h,
  onToggleSelected: b,
  onPrevious: y,
  onNext: u,
  onClose: T,
  onAction: P,
  onOpen: d
}) {
  const l = x(null), m = x(null), C = e.files[0], S = qe(e);
  B(() => {
    var E;
    const f = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (E = l.current) == null || E.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = f;
    };
  }, []);
  function H(f) {
    var I, L, G;
    if (f.key !== "Tab") return;
    const E = [
      ...((I = l.current) == null ? void 0 : I.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((j) => j.offsetParent !== null);
    if (!E.length) {
      f.preventDefault(), (L = l.current) == null || L.focus();
      return;
    }
    const k = E.indexOf(
      document.activeElement
    );
    f.shiftKey && k <= 0 ? (f.preventDefault(), (G = E.at(-1)) == null || G.focus()) : !f.shiftKey && k === E.length - 1 && (f.preventDefault(), E[0].focus());
  }
  function A(f) {
    if (f.defaultPrevented || f.ctrlKey || f.altKey || f.metaKey || f.target.closest("button, input, select, textarea"))
      return;
    const E = m.current, k = f.currentTarget.querySelector("video");
    if (f.key === " " && E) E.toggle();
    else if ((f.key === "ArrowLeft" || f.key === "ArrowRight") && E)
      E.seekBy(
        (f.key === "ArrowLeft" ? -1 : 1) * (f.shiftKey ? 10 : 5)
      );
    else if (f.key === "ArrowUp" && k)
      k.volume = Math.min(1, k.volume + 0.1);
    else if (f.key === "ArrowDown" && k)
      k.volume = Math.max(0, k.volume - 0.1);
    else if (f.key.toLowerCase() === "m" && k)
      k.muted = !k.muted;
    else return;
    M(f);
  }
  return /* @__PURE__ */ t(
    "div",
    {
      ref: l,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${S}`,
      className: "dq-preview",
      onKeyDown: H,
      onMouseDown: (f) => {
        f.target === f.currentTarget && T();
      },
      children: /* @__PURE__ */ a("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ a("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ t(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !N || o || s,
              onClick: y,
              children: /* @__PURE__ */ t(ft, {})
            }
          ),
          /* @__PURE__ */ t(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !h || o || s,
              onClick: u,
              children: /* @__PURE__ */ t(pt, {})
            }
          ),
          /* @__PURE__ */ a("div", { children: [
            /* @__PURE__ */ t("h2", { children: S }),
            /* @__PURE__ */ a("p", { children: [
              "Actions target ",
              i,
              "."
            ] })
          ] }),
          /* @__PURE__ */ t(
            "button",
            {
              type: "button",
              onClick: b,
              disabled: s,
              children: g ? "Selected" : "Select"
            }
          ),
          /* @__PURE__ */ t(
            "button",
            {
              type: "button",
              onClick: d,
              "aria-label": "Open video details",
              children: /* @__PURE__ */ t(ht, {})
            }
          ),
          /* @__PURE__ */ t(
            "button",
            {
              type: "button",
              onClick: T,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ t(Xe, {})
            }
          )
        ] }),
        /* @__PURE__ */ t(
          "div",
          {
            className: "dq-player",
            "data-review-player-controls": !0,
            tabIndex: 0,
            onKeyDown: A,
            children: C ? /* @__PURE__ */ t(
              lt,
              {
                streamUrl: xt(e.id),
                posterUrl: Ve(e),
                format: C.format,
                audioCodec: C.audioCodec,
                duration: C.duration ?? 0,
                videoId: e.id,
                showAbLoop: !1,
                extensionSurface: "quick-view",
                onPlaybackControlRegister: (f) => (m.current = f, () => {
                  m.current === f && (m.current = null);
                }),
                videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
                clip: e.parentVideoId != null ? {
                  start: e.clipStartSec ?? 0,
                  end: e.clipEndSec,
                  loop: !1
                } : void 0
              }
            ) : /* @__PURE__ */ t("img", { src: Ve(e), alt: "" })
          }
        ),
        /* @__PURE__ */ t("footer", { "data-review-player-controls": !0, children: n.actions.map((f, E) => /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            disabled: o || s || !c,
            onClick: () => void P(f),
            children: [
              E < 9 && /* @__PURE__ */ t("kbd", { children: E + 1 }),
              f.label
            ]
          },
          f.id
        )) })
      ] })
    }
  );
}
function jt({
  reviews: e,
  activeReview: n,
  onSave: i,
  onChoose: o,
  onClose: s
}) {
  const [c, g] = v(null), [N, h] = v(""), b = x(null);
  B(() => {
    var m, C;
    const d = document.activeElement, l = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (C = (m = b.current) == null ? void 0 : m.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || C.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = l, d == null || d.focus({ preventScroll: !0 });
    };
  }, []);
  function y(d) {
    var C, S, H;
    if (d.defaultPrevented) {
      d.stopPropagation();
      return;
    }
    if (d.key === "Escape") {
      M(d), s();
      return;
    }
    if (d.key !== "Tab") {
      d.stopPropagation();
      return;
    }
    const l = [
      ...((C = b.current) == null ? void 0 : C.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((A) => A.offsetParent !== null);
    if (!l.length) {
      M(d), (S = b.current) == null || S.focus();
      return;
    }
    const m = l.indexOf(
      document.activeElement
    );
    d.shiftKey && m <= 0 ? (M(d), (H = l.at(-1)) == null || H.focus()) : !d.shiftKey && m === l.length - 1 ? (M(d), l[0].focus()) : d.stopPropagation();
  }
  function u(d) {
    g(
      d ? structuredClone(d) : {
        id: crypto.randomUUID(),
        name: "",
        description: "",
        view: structuredClone(
          (n == null ? void 0 : n.view) ?? {
            filter: {
              page: 1,
              perPage: 40,
              sort: "date",
              direction: "desc"
            },
            objectFilter: {},
            displayMode: "grid",
            searchMode: "text"
          }
        ),
        actions: []
      }
    ), h("");
  }
  function T() {
    if (!c || !c.name.trim() || !c.actions.every(Ae)) {
      h("Name the review and complete every action step before saving.");
      return;
    }
    const d = { ...c, name: c.name.trim() }, l = e.some((m) => m.id === d.id) ? e.map((m) => m.id === d.id ? d : m) : [...e, d];
    if (!i(l)) {
      h(
        "Could not save reviews in this browser. Your edits are still open; free browser storage and retry."
      );
      return;
    }
    o(d.id), g(null);
  }
  function P(d) {
    var m;
    const l = (m = d.target.files) == null ? void 0 : m[0];
    if (d.target.value = "", !!l) {
      if (l.size > 2e6) {
        h("Review files must be smaller than 2 MB.");
        return;
      }
      l.text().then((C) => {
        const S = Se(C);
        if (!i(Re(e, S)))
          throw new Error(
            "Could not save reviews in this browser. Free browser storage and retry."
          );
        h("");
      }).catch(
        (C) => h(
          C instanceof Error ? C.message : "Could not import reviews."
        )
      );
    }
  }
  return /* @__PURE__ */ t(
    "div",
    {
      ref: b,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: y,
      children: /* @__PURE__ */ a("div", { className: "dq-manager", children: [
        /* @__PURE__ */ a("header", { children: [
          /* @__PURE__ */ a("div", { children: [
            /* @__PURE__ */ t("h2", { children: "Manage reviews" }),
            /* @__PURE__ */ t("p", { children: "Existing reviews and actions remain editable in this browser." })
          ] }),
          /* @__PURE__ */ t(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              onClick: s,
              children: /* @__PURE__ */ t(Xe, {})
            }
          )
        ] }),
        N && /* @__PURE__ */ t("p", { role: "alert", className: "dq-alert", children: N }),
        c ? /* @__PURE__ */ t(
          Kt,
          {
            draft: c,
            setDraft: g,
            onSave: T,
            onCancel: () => g(null)
          }
        ) : /* @__PURE__ */ a(ue, { children: [
          /* @__PURE__ */ a("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ a(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => u(),
                children: [
                  /* @__PURE__ */ t(mt, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ a("label", { className: "dq-button", children: [
              /* @__PURE__ */ t(gt, {}),
              " Import reviews",
              /* @__PURE__ */ t(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: P
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ t("div", { className: "dq-review-list", children: e.map((d) => /* @__PURE__ */ a("article", { children: [
            /* @__PURE__ */ a("div", { children: [
              /* @__PURE__ */ t("strong", { children: d.name }),
              /* @__PURE__ */ t("p", { children: d.description || "No description" })
            ] }),
            /* @__PURE__ */ a("button", { type: "button", onClick: () => u(d), children: [
              /* @__PURE__ */ t(Je, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                onClick: () => u({
                  ...structuredClone(d),
                  id: crypto.randomUUID(),
                  name: `${d.name} copy`
                }),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${d.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${d.name}”?`) && !i(e.filter((l) => l.id !== d.id)) && h(
                    "Could not save reviews in this browser. The review was not deleted; free browser storage and retry."
                  );
                },
                children: /* @__PURE__ */ t(Ye, {})
              }
            )
          ] }, d.id)) })
        ] })
      ] })
    }
  );
}
function Kt({
  draft: e,
  setDraft: n,
  onSave: i,
  onCancel: o
}) {
  const s = (c, g) => n({
    ...e,
    actions: e.actions.map(
      (N, h) => h === c ? g : N
    )
  });
  return /* @__PURE__ */ a("div", { className: "dq-editor", children: [
    /* @__PURE__ */ a("label", { children: [
      "Review name",
      /* @__PURE__ */ t(
        "input",
        {
          autoFocus: !0,
          value: e.name,
          onChange: (c) => n({ ...e, name: c.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ a("label", { children: [
      "Description",
      /* @__PURE__ */ t(
        "textarea",
        {
          value: e.description,
          onChange: (c) => n({ ...e, description: c.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ t("p", { className: "dq-editor-note", children: "The saved queue keeps its current filters, search, sort, page size, and preferred view." }),
    /* @__PURE__ */ t("h3", { children: "Actions" }),
    e.actions.map((c, g) => /* @__PURE__ */ a("fieldset", { children: [
      /* @__PURE__ */ a("legend", { children: [
        "Action ",
        g + 1
      ] }),
      /* @__PURE__ */ a("label", { children: [
        "Button label",
        /* @__PURE__ */ t(
          "input",
          {
            value: c.label,
            onChange: (N) => s(g, { ...c, label: N.target.value })
          }
        )
      ] }),
      c.steps.map((N, h) => /* @__PURE__ */ t(
        Vt,
        {
          step: N,
          onChange: (b) => s(g, {
            ...c,
            steps: c.steps.map(
              (y, u) => u === h ? b : y
            )
          }),
          onRemove: () => s(g, {
            ...c,
            steps: c.steps.filter(
              (b, y) => y !== h
            )
          })
        },
        h
      )),
      /* @__PURE__ */ a("div", { className: "dq-row", children: [
        /* @__PURE__ */ t(
          "button",
          {
            className: "dq-button",
            type: "button",
            onClick: () => s(g, {
              ...c,
              steps: [...c.steps, { mode: "ADD", tagIds: [] }]
            }),
            children: "Add step"
          }
        ),
        /* @__PURE__ */ t(
          "button",
          {
            className: "dq-button",
            type: "button",
            onClick: () => n({
              ...e,
              actions: e.actions.filter(
                (N, h) => h !== g
              )
            }),
            children: "Remove action"
          }
        )
      ] })
    ] }, c.id)),
    /* @__PURE__ */ t(
      "button",
      {
        className: "dq-button",
        type: "button",
        onClick: () => n({
          ...e,
          actions: [
            ...e.actions,
            { id: crypto.randomUUID(), label: "", steps: [] }
          ]
        }),
        children: "Add action"
      }
    ),
    /* @__PURE__ */ a("div", { className: "dq-editor-footer", children: [
      /* @__PURE__ */ t("button", { className: "dq-button", type: "button", onClick: o, children: "Cancel" }),
      /* @__PURE__ */ t("button", { className: "dq-button primary", type: "button", onClick: i, children: "Save review" })
    ] })
  ] });
}
function Vt({
  step: e,
  onChange: n,
  onRemove: i
}) {
  return /* @__PURE__ */ a("div", { className: "dq-action-step", children: [
    /* @__PURE__ */ a(
      "select",
      {
        "aria-label": "Tag operation",
        value: e.mode,
        onChange: (o) => n({ ...e, mode: o.target.value }),
        children: [
          /* @__PURE__ */ t("option", { value: "ADD", children: "Add tags" }),
          /* @__PURE__ */ t("option", { value: "REMOVE", children: "Remove tags" }),
          /* @__PURE__ */ t("option", { value: "REMOVE_TREE", children: "Remove tags and descendants" })
        ]
      }
    ),
    /* @__PURE__ */ t(
      ut,
      {
        entityType: "tag",
        values: e.tagIds,
        onChange: (o) => n({ ...e, tagIds: o }),
        placeholder: "Choose tags",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ t("button", { type: "button", "aria-label": "Remove step", onClick: i, children: /* @__PURE__ */ t(Ye, {}) })
  ] });
}
function Be({ label: e }) {
  return /* @__PURE__ */ a("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ t(Ge, { className: "dq-spin" }),
    e
  ] });
}
function He({
  message: e,
  onRetry: n
}) {
  return /* @__PURE__ */ a("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ t(We, {}),
    /* @__PURE__ */ t("p", { children: e }),
    /* @__PURE__ */ t("button", { className: "dq-button", type: "button", onClick: n, children: "Retry" })
  ] });
}
const Wt = { components: { DataQualityPage: Lt } };
export {
  Lt as DataQualityPage,
  Wt as default
};
