import { jsxs as n, jsx as a } from "react/jsx-runtime";
import { useState as d, useEffect as D } from "react";
const O = "/api/plugins/com.midnightrider.auth-middleware", y = {
  oidcEnabled: !1,
  oidcButtonLabel: "Sign in with OpenID Connect",
  oidcIssuer: "",
  oidcClientId: "",
  oidcClientSecretConfigured: !1,
  covePublicUrl: "",
  usernameClaim: "preferred_username",
  scopes: ["openid", "profile", "email"],
  allowInsecureDevelopmentIssuer: !1,
  trustedHeaderEnabled: !1,
  trustedHeaderName: "X-Authentik-Username",
  trustedProxyCidrs: []
};
async function P(t, r = {}) {
  const i = await fetch(`${O}${t}`, {
    ...r,
    headers: { "Content-Type": "application/json", ...r.headers }
  });
  if (!i.ok) {
    const s = await i.json().catch(() => null), u = (s != null && s.errors ? Object.values(s.errors).flat().filter((p) => typeof p == "string").join(" ") : "") || (typeof (s == null ? void 0 : s.message) == "string" ? s.message : `Request failed (${i.status}).`);
    throw new Error(u);
  }
  return i.status === 204 ? void 0 : i.json();
}
let b = P;
const f = {
  getSettings: () => b("/settings"),
  saveSettings: (t) => b("/settings", {
    method: "PUT",
    body: JSON.stringify(t)
  }),
  testOidc: () => b("/oidc/test", { method: "POST" })
};
function I(t) {
  return t.split(/[\s,]+/).map((r) => r.trim()).filter(Boolean);
}
function T() {
  const [t, r] = d(y), [i, s] = d(""), [m, u] = d(!1), [p, C] = d(y.scopes.join(" ")), [w, v] = d(""), [g, h] = d(!0), [k, c] = d("Loading authentication settings…");
  D(() => {
    let e = !0;
    return f.getSettings().then((o) => {
      e && (r(o), C(o.scopes.join(" ")), v(o.trustedProxyCidrs.join(`
`)), c(""));
    }).catch((o) => {
      e && c(o instanceof Error ? o.message : "Could not load authentication settings.");
    }).finally(() => {
      e && h(!1);
    }), () => {
      e = !1;
    };
  }, []);
  const l = (e, o) => r((N) => ({ ...N, [e]: o })), S = () => ({
    oidcEnabled: t.oidcEnabled,
    oidcButtonLabel: t.oidcButtonLabel,
    oidcIssuer: t.oidcIssuer,
    oidcClientId: t.oidcClientId,
    ...i ? { oidcClientSecret: i } : {},
    clearOidcClientSecret: m,
    covePublicUrl: t.covePublicUrl,
    usernameClaim: t.usernameClaim,
    scopes: I(p),
    allowInsecureDevelopmentIssuer: t.allowInsecureDevelopmentIssuer,
    trustedHeaderEnabled: t.trustedHeaderEnabled,
    trustedHeaderName: t.trustedHeaderName,
    trustedProxyCidrs: I(w)
  }), x = async () => {
    h(!0), c("Saving authentication settings…");
    try {
      const e = await f.saveSettings(S());
      r(e), C(e.scopes.join(" ")), v(e.trustedProxyCidrs.join(`
`)), s(""), u(!1), c("Settings saved. Reload the sign-in page to verify the available login methods.");
    } catch (e) {
      c(e instanceof Error ? e.message : "Could not save authentication settings.");
    } finally {
      h(!1);
    }
  }, E = async () => {
    h(!0), c("Checking OIDC discovery and signing keys…");
    try {
      await f.testOidc(), c("OIDC discovery and signing keys are reachable.");
    } catch (e) {
      c(e instanceof Error ? e.message : "OIDC discovery failed.");
    } finally {
      h(!1);
    }
  };
  return /* @__PURE__ */ n("section", { className: "authmw-settings", "aria-labelledby": "authmw-title", children: [
    /* @__PURE__ */ n("header", { children: [
      /* @__PURE__ */ a("h3", { id: "authmw-title", children: "Authentication middleware" }),
      /* @__PURE__ */ a("p", { children: "External identities must match an existing active Cove username. Cove keeps ownership of account status, roles, permissions, sessions, and audit events." })
    ] }),
    /* @__PURE__ */ n("fieldset", { disabled: g, children: [
      /* @__PURE__ */ a("legend", { children: "OpenID Connect" }),
      /* @__PURE__ */ n("label", { className: "authmw-check", children: [
        /* @__PURE__ */ a(
          "input",
          {
            type: "checkbox",
            checked: t.oidcEnabled,
            onChange: (e) => l("oidcEnabled", e.target.checked)
          }
        ),
        "Enable OpenID Connect login"
      ] }),
      /* @__PURE__ */ n("div", { className: "authmw-grid", children: [
        /* @__PURE__ */ n("label", { children: [
          "Login button label",
          /* @__PURE__ */ a("input", { value: t.oidcButtonLabel, onChange: (e) => l("oidcButtonLabel", e.target.value) })
        ] }),
        /* @__PURE__ */ n("label", { children: [
          "Issuer",
          /* @__PURE__ */ a(
            "input",
            {
              type: "url",
              placeholder: "https://identity.example/application/o/cove/",
              value: t.oidcIssuer,
              onChange: (e) => l("oidcIssuer", e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ n("label", { children: [
          "Client ID",
          /* @__PURE__ */ a("input", { value: t.oidcClientId, onChange: (e) => l("oidcClientId", e.target.value) })
        ] }),
        /* @__PURE__ */ n("label", { children: [
          "Client secret",
          /* @__PURE__ */ a(
            "input",
            {
              type: "password",
              autoComplete: "new-password",
              value: i,
              placeholder: t.oidcClientSecretConfigured ? "Configured; leave blank to keep" : "Required when OIDC is enabled",
              onChange: (e) => {
                s(e.target.value), e.target.value && u(!1);
              }
            }
          )
        ] }),
        /* @__PURE__ */ n("label", { children: [
          "Cove public URL",
          /* @__PURE__ */ a(
            "input",
            {
              type: "url",
              placeholder: "https://cove.example",
              value: t.covePublicUrl,
              onChange: (e) => l("covePublicUrl", e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ n("label", { children: [
          "Username claim",
          /* @__PURE__ */ a("input", { value: t.usernameClaim, onChange: (e) => l("usernameClaim", e.target.value) })
        ] }),
        /* @__PURE__ */ n("label", { className: "authmw-wide", children: [
          "Scopes",
          /* @__PURE__ */ a("input", { value: p, onChange: (e) => C(e.target.value) })
        ] })
      ] }),
      t.oidcClientSecretConfigured ? /* @__PURE__ */ n("label", { className: "authmw-check", children: [
        /* @__PURE__ */ a(
          "input",
          {
            type: "checkbox",
            checked: m,
            onChange: (e) => {
              u(e.target.checked), e.target.checked && s("");
            }
          }
        ),
        "Clear the stored client secret when saving"
      ] }) : null,
      /* @__PURE__ */ n("label", { className: "authmw-check authmw-warning", children: [
        /* @__PURE__ */ a(
          "input",
          {
            type: "checkbox",
            checked: t.allowInsecureDevelopmentIssuer,
            onChange: (e) => l("allowInsecureDevelopmentIssuer", e.target.checked)
          }
        ),
        "Allow an HTTP issuer and Cove URL for isolated development only"
      ] }),
      /* @__PURE__ */ n("p", { className: "authmw-help", children: [
        "Callback: ",
        /* @__PURE__ */ a("code", { children: "/api/plugins/com.midnightrider.auth-middleware/oidc/callback" })
      ] })
    ] }),
    /* @__PURE__ */ n("fieldset", { disabled: g, children: [
      /* @__PURE__ */ a("legend", { children: "Trusted reverse-proxy header" }),
      /* @__PURE__ */ n("label", { className: "authmw-check", children: [
        /* @__PURE__ */ a(
          "input",
          {
            type: "checkbox",
            checked: t.trustedHeaderEnabled,
            onChange: (e) => l("trustedHeaderEnabled", e.target.checked)
          }
        ),
        "Enable trusted-header authentication"
      ] }),
      /* @__PURE__ */ n("div", { className: "authmw-grid", children: [
        /* @__PURE__ */ n("label", { children: [
          "Username header",
          /* @__PURE__ */ a("input", { value: t.trustedHeaderName, onChange: (e) => l("trustedHeaderName", e.target.value) })
        ] }),
        /* @__PURE__ */ n("label", { className: "authmw-wide", children: [
          "Trusted direct-proxy IPs or CIDRs",
          /* @__PURE__ */ a(
            "textarea",
            {
              rows: 4,
              placeholder: `192.0.2.10/32
2001:db8::10/128`,
              value: w,
              onChange: (e) => v(e.target.value)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ a("p", { className: "authmw-help authmw-warning", children: "Trust the narrowest direct peer range. The extension deliberately ignores forwarded-address headers when deciding whether the identity header is trusted." })
    ] }),
    /* @__PURE__ */ n("div", { className: "authmw-actions", children: [
      /* @__PURE__ */ a("button", { type: "button", onClick: () => void x(), disabled: g, children: "Save settings" }),
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          onClick: () => void E(),
          disabled: g || !t.oidcClientSecretConfigured,
          children: "Test saved OIDC configuration"
        }
      )
    ] }),
    /* @__PURE__ */ a("p", { className: "authmw-status", role: "status", "aria-live": "polite", children: k })
  ] });
}
const H = {
  components: { AuthMiddlewareSettings: T }
};
export {
  T as AuthMiddlewareSettings,
  H as default
};
