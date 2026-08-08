import { jsxs as n, jsx as t } from "react/jsx-runtime";
import { useState as m, useEffect as j } from "react";
const E = "/api/plugins/com.midnightrider.auth-middleware", O = {
  covePublicUrl: "",
  allowInsecureDevelopmentIssuer: !1,
  oidcProviders: [],
  trustedHeaderEnabled: !1,
  trustedHeaderProviderId: "",
  trustedHeaderLabel: "Trusted reverse proxy",
  trustedHeaderSubjectName: "X-Authentik-Uid",
  trustedHeaderDisplayName: "X-Authentik-Username",
  trustedProxyCidrs: []
};
async function U(a, o = {}) {
  const r = await fetch(`${E}${a}`, {
    ...o,
    headers: { "Content-Type": "application/json", ...o.headers }
  });
  if (!r.ok) {
    const i = await r.json().catch(() => null), g = (i != null && i.errors ? Object.values(i.errors).flat().filter((w) => typeof w == "string").join(" ") : "") || (typeof (i == null ? void 0 : i.message) == "string" ? i.message : `Request failed (${r.status}).`);
    throw new Error(g);
  }
  return r.status === 204 ? void 0 : r.json();
}
let C = U;
const S = {
  getSettings: () => C("/settings"),
  saveSettings: (a) => C("/settings", {
    method: "PUT",
    body: JSON.stringify(a)
  }),
  testOidc: (a) => C(`/oidc/${encodeURIComponent(a)}/test`, { method: "POST" })
};
function x(a) {
  return a.split(/[\s,]+/).map((o) => o.trim()).filter(Boolean);
}
let A = 1;
function P(a) {
  return {
    ...a,
    draftKey: a.id || `new-${A++}`,
    scopesText: a.scopes.join(" ")
  };
}
function $() {
  return P({
    id: "",
    enabled: !1,
    buttonLabel: "Sign in with OpenID Connect",
    issuer: "",
    clientId: "",
    clientSecretConfigured: !1,
    displayClaim: "preferred_username",
    scopes: ["openid", "profile", "email"]
  });
}
function R() {
  const [a, o] = m(O), [r, i] = m([]), [f, g] = m({}), [w, v] = m(/* @__PURE__ */ new Set()), [k, I] = m(""), [p, y] = m(!0), [H, c] = m("Loading authentication settings…"), N = (e) => {
    o(e), i(e.oidcProviders.map(P)), I(e.trustedProxyCidrs.join(`
`));
  };
  j(() => {
    let e = !0;
    return S.getSettings().then((l) => {
      e && (N(l), c(""));
    }).catch((l) => {
      e && c(l instanceof Error ? l.message : "Could not load authentication settings.");
    }).finally(() => {
      e && y(!1);
    }), () => {
      e = !1;
    };
  }, []);
  const h = (e, l) => o((s) => ({ ...s, [e]: l })), b = (e, l, s) => i((u) => u.map((d) => d.draftKey === e ? { ...d, [l]: s } : d)), D = () => ({
    covePublicUrl: a.covePublicUrl,
    allowInsecureDevelopmentIssuer: a.allowInsecureDevelopmentIssuer,
    oidcProviders: r.map((e) => ({
      ...e.id ? { id: e.id } : {},
      enabled: e.enabled,
      buttonLabel: e.buttonLabel,
      issuer: e.issuer,
      clientId: e.clientId,
      ...f[e.draftKey] ? { clientSecret: f[e.draftKey] } : {},
      clearClientSecret: w.has(e.draftKey),
      displayClaim: e.displayClaim,
      scopes: x(e.scopesText)
    })),
    trustedHeaderEnabled: a.trustedHeaderEnabled,
    trustedHeaderProviderId: a.trustedHeaderProviderId,
    trustedHeaderLabel: a.trustedHeaderLabel,
    trustedHeaderSubjectName: a.trustedHeaderSubjectName,
    trustedHeaderDisplayName: a.trustedHeaderDisplayName,
    trustedProxyCidrs: x(k)
  }), K = async () => {
    y(!0), c("Saving authentication settings…");
    try {
      const e = await S.saveSettings(D());
      N(e), g({}), v(/* @__PURE__ */ new Set()), c("Settings saved. Existing identities remain linked by immutable provider authority and subject.");
    } catch (e) {
      c(e instanceof Error ? e.message : "Could not save authentication settings.");
    } finally {
      y(!1);
    }
  }, T = async (e) => {
    if (e.id) {
      y(!0), c(`Checking ${e.buttonLabel} discovery and signing keys…`);
      try {
        await S.testOidc(e.id), c(`${e.buttonLabel} discovery and signing keys are reachable.`);
      } catch (l) {
        c(l instanceof Error ? l.message : "OIDC discovery failed.");
      } finally {
        y(!1);
      }
    }
  }, L = (e) => {
    i((l) => l.filter((s) => s.draftKey !== e.draftKey)), c(e.id ? "Save to delete this provider. Deletion is blocked while any Cove user remains linked; disable it first if needed." : "Unsaved provider removed.");
  };
  return /* @__PURE__ */ n("section", { className: "authmw-settings", "aria-labelledby": "authmw-title", children: [
    /* @__PURE__ */ n("header", { children: [
      /* @__PURE__ */ t("h3", { id: "authmw-title", children: "Authentication middleware" }),
      /* @__PURE__ */ t("p", { children: "Link each external identity explicitly to a Cove user. Provider names and email claims are display-only; authentication uses the provider authority and its exact stable subject." })
    ] }),
    /* @__PURE__ */ n("fieldset", { disabled: p, children: [
      /* @__PURE__ */ t("legend", { children: "Shared OpenID Connect settings" }),
      /* @__PURE__ */ t("div", { className: "authmw-grid", children: /* @__PURE__ */ n("label", { children: [
        "Cove public URL",
        /* @__PURE__ */ t(
          "input",
          {
            type: "url",
            placeholder: "https://cove.example",
            value: a.covePublicUrl,
            onChange: (e) => h("covePublicUrl", e.target.value)
          }
        )
      ] }) }),
      /* @__PURE__ */ n("label", { className: "authmw-check authmw-warning", children: [
        /* @__PURE__ */ t(
          "input",
          {
            type: "checkbox",
            checked: a.allowInsecureDevelopmentIssuer,
            onChange: (e) => h("allowInsecureDevelopmentIssuer", e.target.checked)
          }
        ),
        "Allow HTTP issuers and a Cove HTTP URL for isolated development only"
      ] }),
      /* @__PURE__ */ n("p", { className: "authmw-help", children: [
        "Callback for every provider: ",
        /* @__PURE__ */ t("code", { children: "/api/plugins/com.midnightrider.auth-middleware/oidc/callback" })
      ] })
    ] }),
    /* @__PURE__ */ n("div", { className: "authmw-provider-heading", children: [
      /* @__PURE__ */ t("h4", { children: "OpenID Connect providers" }),
      /* @__PURE__ */ t("button", { type: "button", onClick: () => i((e) => [...e, $()]), disabled: p, children: "Add provider" })
    ] }),
    r.length === 0 ? /* @__PURE__ */ t("p", { className: "authmw-help", children: "No OIDC providers are configured." }) : null,
    r.map((e, l) => /* @__PURE__ */ n("fieldset", { disabled: p, children: [
      /* @__PURE__ */ t("legend", { children: e.buttonLabel || `OIDC provider ${l + 1}` }),
      /* @__PURE__ */ n("label", { className: "authmw-check", children: [
        /* @__PURE__ */ t(
          "input",
          {
            type: "checkbox",
            checked: e.enabled,
            onChange: (s) => b(e.draftKey, "enabled", s.target.checked)
          }
        ),
        "Enable this provider for login and account linking"
      ] }),
      /* @__PURE__ */ n("div", { className: "authmw-grid", children: [
        /* @__PURE__ */ n("label", { children: [
          "Login button label",
          /* @__PURE__ */ t("input", { value: e.buttonLabel, onChange: (s) => b(e.draftKey, "buttonLabel", s.target.value) })
        ] }),
        /* @__PURE__ */ n("label", { children: [
          "Issuer ",
          e.id ? /* @__PURE__ */ t("span", { className: "authmw-muted", children: "(immutable)" }) : null,
          /* @__PURE__ */ t(
            "input",
            {
              type: "url",
              placeholder: "https://identity.example/application/o/cove/",
              value: e.issuer,
              readOnly: !!e.id,
              onChange: (s) => b(e.draftKey, "issuer", s.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ n("label", { children: [
          "Client ID",
          /* @__PURE__ */ t("input", { value: e.clientId, onChange: (s) => b(e.draftKey, "clientId", s.target.value) })
        ] }),
        /* @__PURE__ */ n("label", { children: [
          "Client secret",
          /* @__PURE__ */ t(
            "input",
            {
              type: "password",
              autoComplete: "new-password",
              value: f[e.draftKey] ?? "",
              placeholder: e.clientSecretConfigured ? "Configured; leave blank to keep" : "Required when enabled",
              onChange: (s) => {
                g((u) => ({ ...u, [e.draftKey]: s.target.value })), s.target.value && v((u) => {
                  const d = new Set(u);
                  return d.delete(e.draftKey), d;
                });
              }
            }
          )
        ] }),
        /* @__PURE__ */ n("label", { children: [
          "Display claim",
          /* @__PURE__ */ t("input", { value: e.displayClaim, onChange: (s) => b(e.draftKey, "displayClaim", s.target.value) })
        ] }),
        /* @__PURE__ */ n("label", { className: "authmw-wide", children: [
          "Scopes",
          /* @__PURE__ */ t("input", { value: e.scopesText, onChange: (s) => b(e.draftKey, "scopesText", s.target.value) })
        ] })
      ] }),
      e.clientSecretConfigured ? /* @__PURE__ */ n("label", { className: "authmw-check", children: [
        /* @__PURE__ */ t(
          "input",
          {
            type: "checkbox",
            checked: w.has(e.draftKey),
            onChange: (s) => {
              v((u) => {
                const d = new Set(u);
                return s.target.checked ? d.add(e.draftKey) : d.delete(e.draftKey), d;
              }), s.target.checked && g((u) => ({ ...u, [e.draftKey]: "" }));
            }
          }
        ),
        "Clear this provider's stored client secret when saving"
      ] }) : null,
      /* @__PURE__ */ n("div", { className: "authmw-actions", children: [
        /* @__PURE__ */ t("button", { type: "button", onClick: () => void T(e), disabled: !e.id || !e.clientSecretConfigured, children: "Test saved provider" }),
        /* @__PURE__ */ t("button", { type: "button", className: "authmw-danger", onClick: () => L(e), children: "Delete provider" })
      ] })
    ] }, e.draftKey)),
    /* @__PURE__ */ n("fieldset", { disabled: p, children: [
      /* @__PURE__ */ t("legend", { children: "Trusted reverse-proxy identity" }),
      /* @__PURE__ */ n("label", { className: "authmw-check", children: [
        /* @__PURE__ */ t(
          "input",
          {
            type: "checkbox",
            checked: a.trustedHeaderEnabled,
            onChange: (e) => h("trustedHeaderEnabled", e.target.checked)
          }
        ),
        "Enable trusted-header authentication and account linking"
      ] }),
      /* @__PURE__ */ n("div", { className: "authmw-grid", children: [
        /* @__PURE__ */ n("label", { children: [
          "Provider label",
          /* @__PURE__ */ t("input", { value: a.trustedHeaderLabel, onChange: (e) => h("trustedHeaderLabel", e.target.value) })
        ] }),
        /* @__PURE__ */ n("label", { children: [
          "Authority ID ",
          a.trustedHeaderProviderId ? /* @__PURE__ */ t("span", { className: "authmw-muted", children: "(disable and unlink to replace)" }) : null,
          /* @__PURE__ */ t(
            "input",
            {
              value: a.trustedHeaderProviderId,
              readOnly: a.trustedHeaderEnabled,
              placeholder: "Generated when first enabled",
              onChange: (e) => h("trustedHeaderProviderId", e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ n("label", { children: [
          "Stable subject header",
          /* @__PURE__ */ t("input", { value: a.trustedHeaderSubjectName, onChange: (e) => h("trustedHeaderSubjectName", e.target.value) })
        ] }),
        /* @__PURE__ */ n("label", { children: [
          "Optional display-name header",
          /* @__PURE__ */ t("input", { value: a.trustedHeaderDisplayName, onChange: (e) => h("trustedHeaderDisplayName", e.target.value) })
        ] }),
        /* @__PURE__ */ n("label", { className: "authmw-wide", children: [
          "Trusted direct-proxy IPs or CIDRs",
          /* @__PURE__ */ t(
            "textarea",
            {
              rows: 4,
              placeholder: `192.0.2.10/32
2001:db8::10/128`,
              value: k,
              onChange: (e) => I(e.target.value)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ t("p", { className: "authmw-help authmw-warning", children: "The subject header must be stable and unique within this authority. The proxy must remove client-supplied identity headers, and only its direct peer address may be trusted." })
    ] }),
    /* @__PURE__ */ t("div", { className: "authmw-actions", children: /* @__PURE__ */ t("button", { type: "button", onClick: () => void K(), disabled: p, children: "Save settings" }) }),
    /* @__PURE__ */ t("p", { className: "authmw-status", role: "status", "aria-live": "polite", children: H })
  ] });
}
const M = {
  components: { AuthMiddlewareSettings: R }
};
export {
  R as AuthMiddlewareSettings,
  M as default
};
