import { jsxs as a, jsx as t } from "react/jsx-runtime";
import { useState as g, useEffect as L } from "react";
const j = "/api/plugins/com.midnightrider.external-sign-in", O = {
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
async function U(n, u = {}) {
  const d = await fetch(`${j}${n}`, {
    ...u,
    headers: { "Content-Type": "application/json", ...u.headers }
  });
  if (!d.ok) {
    const i = await d.json().catch(() => null), p = (i != null && i.errors ? Object.values(i.errors).flat().filter((x) => typeof x == "string").join(" ") : "") || (typeof (i == null ? void 0 : i.message) == "string" ? i.message : `Request failed (${d.status}).`);
    throw new Error(p);
  }
  return d.status === 204 ? void 0 : d.json();
}
let C = U;
const S = {
  getSettings: () => C("/settings"),
  saveSettings: (n) => C("/settings", {
    method: "PUT",
    body: JSON.stringify(n)
  }),
  testOidc: (n) => C(`/oidc/${encodeURIComponent(n)}/test`, { method: "POST" })
};
function w(n) {
  return n.split(/[\s,]+/).map((u) => u.trim()).filter(Boolean);
}
let A = 1;
function P(n) {
  return {
    ...n,
    draftKey: n.id || `new-${A++}`,
    scopesText: n.scopes.join(" ")
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
  const [n, u] = g(O), [d, i] = g([]), [f, p] = g({}), [x, v] = g(/* @__PURE__ */ new Set()), [k, I] = g(""), [m, y] = g(!0), [H, c] = g("Loading external sign-in settings…"), N = (e) => {
    u(e), i(e.oidcProviders.map(P)), I(e.trustedProxyCidrs.join(`
`));
  };
  L(() => {
    let e = !0;
    return S.getSettings().then((l) => {
      e && (N(l), c(""));
    }).catch((l) => {
      e && c(l instanceof Error ? l.message : "Could not load external sign-in settings.");
    }).finally(() => {
      e && y(!1);
    }), () => {
      e = !1;
    };
  }, []);
  const h = (e, l) => u((s) => ({ ...s, [e]: l })), b = (e, l, s) => i((o) => o.map((r) => r.draftKey === e ? { ...r, [l]: s } : r)), D = () => ({
    covePublicUrl: n.covePublicUrl,
    allowInsecureDevelopmentIssuer: n.allowInsecureDevelopmentIssuer,
    oidcProviders: d.map((e) => ({
      ...e.id ? { id: e.id } : {},
      enabled: e.enabled,
      buttonLabel: e.buttonLabel,
      issuer: e.issuer,
      clientId: e.clientId,
      ...f[e.draftKey] ? { clientSecret: f[e.draftKey] } : {},
      clearClientSecret: x.has(e.draftKey),
      displayClaim: e.displayClaim,
      scopes: w(e.scopesText)
    })),
    trustedHeaderEnabled: n.trustedHeaderEnabled,
    trustedHeaderProviderId: n.trustedHeaderProviderId,
    trustedHeaderLabel: n.trustedHeaderLabel,
    trustedHeaderSubjectName: n.trustedHeaderSubjectName,
    trustedHeaderDisplayName: n.trustedHeaderDisplayName,
    trustedProxyCidrs: w(k)
  }), K = async () => {
    y(!0), c("Saving external sign-in settings…");
    try {
      const e = await S.saveSettings(D());
      N(e), p({}), v(/* @__PURE__ */ new Set()), c("Settings saved. Existing identities remain linked by immutable provider authority and subject.");
    } catch (e) {
      c(e instanceof Error ? e.message : "Could not save external sign-in settings.");
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
  }, E = (e) => {
    i((l) => l.filter((s) => s.draftKey !== e.draftKey)), c(e.id ? "Save to delete this provider. Deletion is blocked while any Cove user remains linked; disable it first if needed." : "Unsaved provider removed.");
  };
  return /* @__PURE__ */ a("section", { className: "external-sign-in-settings", "aria-labelledby": "external-sign-in-title", children: [
    /* @__PURE__ */ a("header", { children: [
      /* @__PURE__ */ t("h3", { id: "external-sign-in-title", children: "External sign-in" }),
      /* @__PURE__ */ t("p", { children: "Link each external identity explicitly to a Cove user. Provider names and email claims are display-only; authentication uses the provider authority and its exact stable subject." })
    ] }),
    /* @__PURE__ */ a("fieldset", { disabled: m, children: [
      /* @__PURE__ */ t("legend", { children: "Shared OpenID Connect settings" }),
      /* @__PURE__ */ t("div", { className: "external-sign-in-grid", children: /* @__PURE__ */ a("label", { children: [
        "Cove public URL",
        /* @__PURE__ */ t(
          "input",
          {
            type: "url",
            placeholder: "https://cove.example",
            value: n.covePublicUrl,
            onChange: (e) => h("covePublicUrl", e.target.value)
          }
        )
      ] }) }),
      /* @__PURE__ */ a("label", { className: "external-sign-in-check external-sign-in-warning", children: [
        /* @__PURE__ */ t(
          "input",
          {
            type: "checkbox",
            checked: n.allowInsecureDevelopmentIssuer,
            onChange: (e) => h("allowInsecureDevelopmentIssuer", e.target.checked)
          }
        ),
        "Allow HTTP issuers and a Cove HTTP URL for isolated development only"
      ] }),
      /* @__PURE__ */ a("p", { className: "external-sign-in-help", children: [
        "Callback for every provider: ",
        /* @__PURE__ */ t("code", { children: "/api/plugins/com.midnightrider.external-sign-in/oidc/callback" })
      ] })
    ] }),
    /* @__PURE__ */ a("div", { className: "external-sign-in-provider-heading", children: [
      /* @__PURE__ */ t("h4", { children: "OpenID Connect providers" }),
      /* @__PURE__ */ t("button", { type: "button", onClick: () => i((e) => [...e, $()]), disabled: m, children: "Add provider" })
    ] }),
    d.length === 0 ? /* @__PURE__ */ t("p", { className: "external-sign-in-help", children: "No OIDC providers are configured." }) : null,
    d.map((e, l) => /* @__PURE__ */ a("fieldset", { disabled: m, children: [
      /* @__PURE__ */ t("legend", { children: e.buttonLabel || `OIDC provider ${l + 1}` }),
      /* @__PURE__ */ a("label", { className: "external-sign-in-check", children: [
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
      /* @__PURE__ */ a("div", { className: "external-sign-in-grid", children: [
        /* @__PURE__ */ a("label", { children: [
          "Login button label",
          /* @__PURE__ */ t("input", { value: e.buttonLabel, onChange: (s) => b(e.draftKey, "buttonLabel", s.target.value) })
        ] }),
        /* @__PURE__ */ a("label", { children: [
          "Issuer ",
          e.id ? /* @__PURE__ */ t("span", { className: "external-sign-in-muted", children: "(immutable)" }) : null,
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
        /* @__PURE__ */ a("label", { children: [
          "Client ID",
          /* @__PURE__ */ t("input", { value: e.clientId, onChange: (s) => b(e.draftKey, "clientId", s.target.value) })
        ] }),
        /* @__PURE__ */ a("label", { children: [
          "Client secret",
          /* @__PURE__ */ t(
            "input",
            {
              type: "password",
              autoComplete: "new-password",
              value: f[e.draftKey] ?? "",
              placeholder: e.clientSecretConfigured ? "Configured; leave blank to keep" : "Required when enabled",
              onChange: (s) => {
                p((o) => ({ ...o, [e.draftKey]: s.target.value })), s.target.value && v((o) => {
                  const r = new Set(o);
                  return r.delete(e.draftKey), r;
                });
              }
            }
          )
        ] }),
        /* @__PURE__ */ a("label", { children: [
          "Display claim",
          /* @__PURE__ */ t("input", { value: e.displayClaim, onChange: (s) => b(e.draftKey, "displayClaim", s.target.value) })
        ] }),
        /* @__PURE__ */ a("label", { className: "external-sign-in-wide", children: [
          "Scopes",
          /* @__PURE__ */ t("input", { value: e.scopesText, onChange: (s) => b(e.draftKey, "scopesText", s.target.value) })
        ] })
      ] }),
      e.clientSecretConfigured ? /* @__PURE__ */ a("label", { className: "external-sign-in-check", children: [
        /* @__PURE__ */ t(
          "input",
          {
            type: "checkbox",
            checked: x.has(e.draftKey),
            onChange: (s) => {
              v((o) => {
                const r = new Set(o);
                return s.target.checked ? r.add(e.draftKey) : r.delete(e.draftKey), r;
              }), s.target.checked && p((o) => ({ ...o, [e.draftKey]: "" }));
            }
          }
        ),
        "Clear this provider's stored client secret when saving"
      ] }) : null,
      /* @__PURE__ */ a("div", { className: "external-sign-in-actions", children: [
        /* @__PURE__ */ t("button", { type: "button", onClick: () => void T(e), disabled: !e.id || !e.clientSecretConfigured, children: "Test saved provider" }),
        /* @__PURE__ */ t("button", { type: "button", className: "external-sign-in-danger", onClick: () => E(e), children: "Delete provider" })
      ] })
    ] }, e.draftKey)),
    /* @__PURE__ */ a("fieldset", { disabled: m, children: [
      /* @__PURE__ */ t("legend", { children: "Trusted reverse-proxy identity" }),
      /* @__PURE__ */ a("label", { className: "external-sign-in-check", children: [
        /* @__PURE__ */ t(
          "input",
          {
            type: "checkbox",
            checked: n.trustedHeaderEnabled,
            onChange: (e) => h("trustedHeaderEnabled", e.target.checked)
          }
        ),
        "Enable trusted-header authentication and account linking"
      ] }),
      /* @__PURE__ */ a("div", { className: "external-sign-in-grid", children: [
        /* @__PURE__ */ a("label", { children: [
          "Provider label",
          /* @__PURE__ */ t("input", { value: n.trustedHeaderLabel, onChange: (e) => h("trustedHeaderLabel", e.target.value) })
        ] }),
        /* @__PURE__ */ a("label", { children: [
          "Authority ID ",
          n.trustedHeaderProviderId ? /* @__PURE__ */ t("span", { className: "external-sign-in-muted", children: "(disable and unlink to replace)" }) : null,
          /* @__PURE__ */ t(
            "input",
            {
              value: n.trustedHeaderProviderId,
              readOnly: n.trustedHeaderEnabled,
              placeholder: "Generated when first enabled",
              onChange: (e) => h("trustedHeaderProviderId", e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ a("label", { children: [
          "Stable subject header",
          /* @__PURE__ */ t("input", { value: n.trustedHeaderSubjectName, onChange: (e) => h("trustedHeaderSubjectName", e.target.value) })
        ] }),
        /* @__PURE__ */ a("label", { children: [
          "Optional display-name header",
          /* @__PURE__ */ t("input", { value: n.trustedHeaderDisplayName, onChange: (e) => h("trustedHeaderDisplayName", e.target.value) })
        ] }),
        /* @__PURE__ */ a("label", { className: "external-sign-in-wide", children: [
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
      /* @__PURE__ */ t("p", { className: "external-sign-in-help external-sign-in-warning", children: "The subject header must be stable and unique within this authority. The proxy must remove client-supplied identity headers, and only its direct peer address may be trusted." })
    ] }),
    /* @__PURE__ */ t("div", { className: "external-sign-in-actions", children: /* @__PURE__ */ t("button", { type: "button", onClick: () => void K(), disabled: m, children: "Save settings" }) }),
    /* @__PURE__ */ t("p", { className: "external-sign-in-status", role: "status", "aria-live": "polite", children: H })
  ] });
}
const G = {
  components: { ExternalSignInSettings: R }
};
export {
  R as ExternalSignInSettings,
  G as default
};
