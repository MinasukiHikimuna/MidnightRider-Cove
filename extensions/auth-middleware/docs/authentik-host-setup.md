# Host-side Authentik setup for Cove authentication development

This guide prepares Authentik outside the Cove devbox and then moves existing Cove users to explicit
external-identity links. The devbox does not provide a container engine, so Authentik and an optional
forward-auth proxy must run on the host or another machine reachable by both the browser and Cove.

OIDC is the recommended first path. Trusted-header authentication is optional and requires a reverse
proxy whose direct connection to Cove can be narrowly trusted.

Keep hostnames, account names, client credentials, passwords, and generated deployment files in
ignored host-side state. Never paste them into issues, pull requests, screenshots, or tracked files.

## Identity and recovery model

Cove does not look up a user by an Authentik username or email:

| Method | Stable identity key | Display-only value |
| --- | --- | --- |
| OIDC | Extension ID + exact issuer + exact `sub` | Configured claim, normally `preferred_username` |
| Trusted header | Extension ID + configured authority ID + exact subject header | Optional display-name header |

The link points to an existing Cove user. That user keeps the same roles, permissions, history,
account status, and Cove sessions. One external identity can belong to only one Cove user, while one
Cove user can link any number of identities from one or more providers.

For a fresh Cove installation:

1. Complete Cove's native Owner setup. Extensions cannot be installed before this step.
2. Keep the Owner's local password. Every Cove user retains a local password.
3. Install and configure this extension.
4. While still signed in locally, link the Owner's Authentik identity from **Settings > My settings >
   Account**.
5. Sign out and verify Authentik login.

Invited users create a Cove password while redeeming the invite, then link Authentik after their first
local sign-in. External providers are additional sign-in methods, never replacements for the local
password. Users can unlink identities, and administrators can disable providers or the extension,
without removing local access.

Keep local passwords in recoverable storage. During an Authentik or network outage, every user can
use Cove's local sign-in; an administrator can issue a password-reset invite when needed.

## Values to choose

Use placeholders while following this guide:

| Placeholder | Meaning |
| --- | --- |
| `<AUTHENTIK_PUBLIC_URL>` | Browser-visible Authentik origin, without a trailing slash |
| `<COVE_PUBLIC_URL>` | Browser-visible Cove origin, without a trailing slash |
| `<COVE_UPSTREAM_URL>` | Cove address reached by an optional host reverse proxy |
| `<COVE_PROXY_PUBLIC_URL>` | Browser-visible Cove origin used for forward-auth testing |
| `<AUTHENTIK_INTERNAL_URL>` | Authentik/outpost address reached by the reverse proxy |

The OIDC issuer hostname must be reachable from both the browser and the Cove backend. Do not use
`localhost` for a host-side Authentik issuer: inside the devbox, `localhost` refers to the devbox.

```text
OIDC:
browser ───────> Cove public URL
   └───────────> Authentik public URL <──────── Cove backend

Forward auth:
browser ───────> trusted reverse proxy ───────> Cove
                         └──────────────> Authentik outpost
```

## 1. Start or verify Authentik on the host

If a pinned Authentik deployment is already healthy, keep it and proceed to the next section. Useful
host-side checks are:

```bash
docker compose ps
docker compose logs --tail=200 server worker
```

For a new development deployment, start from Authentik's official Compose file rather than writing a
stack from scratch:

```bash
mkdir cove-authentik
cd cove-authentik

curl --fail --location --output compose.yml \
  https://docs.goauthentik.io/compose.yml

umask 077
printf 'PG_PASS=%s\n' "$(openssl rand -base64 36 | tr -d '\n')" > .env
printf 'AUTHENTIK_SECRET_KEY=%s\n' \
  "$(openssl rand -base64 60 | tr -d '\n')" >> .env
chmod 600 .env

docker compose config --quiet
docker compose pull
docker compose up -d
docker compose ps
```

Pin the resulting image version; do not use `latest`. Authentik's official file mounts the Docker
socket into the worker for managed outposts. Remove that mount if only OIDC or a manually managed
outpost is needed. Do not mount host timezone files into Authentik containers; Authentik's internal
services expect UTC.

Official references:

- [Docker Compose installation](https://docs.goauthentik.io/install-config/install/docker-compose/)
- [Automated installation and hashed bootstrap passwords](https://docs.goauthentik.io/install-config/automated-install/)
- [Release notes](https://docs.goauthentik.io/releases/)

## 2. Verify public discovery reachability

Put Authentik behind HTTPS at `<AUTHENTIK_PUBLIC_URL>` with a certificate trusted by both the browser
and devbox. Before configuring Cove, confirm:

1. The browser can open `<AUTHENTIK_PUBLIC_URL>`.
2. Authentik can redirect the browser to `<COVE_PUBLIC_URL>`.
3. The Cove backend can resolve and fetch `<AUTHENTIK_PUBLIC_URL>`.

Do not use different frontend and backend issuer URLs. The discovery issuer and token `iss` must
exactly match the issuer saved in the extension, including its trailing-slash form.

After the provider exists, this must return an OIDC discovery document:

```bash
curl --fail --show-error \
  '<AUTHENTIK_PUBLIC_URL>/application/o/cove-dev/.well-known/openid-configuration'
```

The extension has an explicit HTTP development override. Leave it disabled for HTTPS and every
non-development deployment. Trust a private CA in the devbox rather than disabling TLS validation.

## 3. Create the Authentik OIDC application and provider

In Authentik's Admin interface:

1. Go to **Applications > Applications**, select **New Provider**, and create an application/provider
   pair.
2. Use an environment-specific application slug such as `cove-dev`.
3. Select **OAuth2/OIDC**.
4. Select the authorization-code flow and a **Confidential** client.
5. Add exactly this **Strict** redirect URI:

   ```text
   <COVE_PUBLIC_URL>/api/plugins/com.midnightrider.auth-middleware/oidc/callback
   ```

6. Select an asymmetric signing key so Cove can validate ID tokens with the JWKS document.
7. Keep the default per-provider issuer mode.
8. Include `openid`, `profile`, and `email` scope mappings. `offline_access` is unnecessary because
   the extension does not keep Authentik refresh tokens.
9. Record the client ID and client secret in ignored host-side secret storage.

The default issuer and discovery URL for the example slug are:

```text
<AUTHENTIK_PUBLIC_URL>/application/o/cove-dev/
<AUTHENTIK_PUBLIC_URL>/application/o/cove-dev/.well-known/openid-configuration
```

Authentik can configure different `sub` modes. Cove treats whatever Authentik signs as `sub` as an
opaque, case-sensitive identifier; changing Authentik's subject mode later makes it a different
external identity and requires an explicit new link.

Official references:

- [Create an OAuth2/OIDC provider](https://docs.goauthentik.io/add-secure-apps/providers/oauth2/create-oauth2-provider)
- [OAuth2/OIDC provider, issuer, and subject modes](https://docs.goauthentik.io/add-secure-apps/providers/oauth2/)

## 4. Configure the Cove extension

Install and enable `com.midnightrider.auth-middleware`. In **Settings > External authentication**:

1. Set the shared Cove public URL to `<COVE_PUBLIC_URL>`.
2. Select **Add provider**.
3. Enter:

   | Setting | Value |
   | --- | --- |
   | Enabled | On |
   | Login button label | `Sign in with Authentik` or another useful label |
   | Issuer | `<AUTHENTIK_PUBLIC_URL>/application/o/cove-dev/` |
   | Client ID | The Authentik provider client ID |
   | Client secret | The Authentik provider client secret |
   | Display claim | `preferred_username` |
   | Scopes | `openid profile email` |

4. Save. Cove generates the provider's internal route ID; the issuer becomes immutable.
5. Run **Test saved provider**. Discovery and signing-key retrieval must pass.

The client secret is write-only. Leaving it blank keeps the saved secret; clearing it requires the
explicit clear checkbox. Public settings and namespaced secrets are stored separately by the
extension and never returned together by its settings API.

The routes for a generated provider ID are:

```text
/api/plugins/com.midnightrider.auth-middleware/oidc/<provider-id>/start
/api/plugins/com.midnightrider.auth-middleware/oidc/<provider-id>/link/start
/api/plugins/com.midnightrider.auth-middleware/oidc/callback
```

## 5. Link existing Cove users

Do not try external login first; an unlinked subject is intentionally rejected even when its Authentik
username happens to equal a Cove username.

For the Owner and each normal Cove user:

1. Sign in through Cove's local login or an already-linked provider.
2. Open **Settings > My settings > Account**.
3. Select **Link Sign in with Authentik**.
4. Authenticate at Authentik. Link flows request account selection to reduce accidental linking of a
   currently active Authentik session.
5. Back in Cove, inspect the provider and display label, then select **Confirm link**. The provider
   callback only prepares a candidate; it cannot persist a link without this same-user confirmation.
6. Sign out and verify external login.

Use a dedicated non-owner user for the first test. Also keep an Authentik user unlinked for the
negative case. Verify both local-password login and at least one full external login for the linked
user.

## 6. Verify OIDC behavior

Run this matrix from the exact `<COVE_PUBLIC_URL>` origin; the browser-binding cookie is intentionally
origin-scoped.

| Case | Expected result |
| --- | --- |
| Linked active user | Cove signs in as the linked user with unchanged Cove roles and grants |
| Unlinked Authentik subject | Generic guidance to sign in locally and link; no user or Cove session is created |
| Subject linked to another Cove user | Linking is rejected; the existing link is unchanged |
| Inactive or locked Cove user | External login is rejected |
| Legacy Cove user without a password | External login is rejected until an administrator issues a password invite |
| Changed display username/email, same issuer and `sub` | Same Cove user; only display metadata changes on a confirmed relink |
| Same `sub`, different issuer | Different external identity; explicit link required |
| Same issuer, case- or whitespace-different `sub` | Different external identity; no normalization or fallback matching |
| Callback opened in another browser | Rejected before exchanging the authorization code; original browser can continue |
| Login ticket redeemed twice | Second redemption is rejected |
| Query-carried Cove ticket | Rejected; Cove accepts the one-time ticket only from the URL fragment |

Also verify:

1. The login page offers every enabled OIDC provider plus Cove's local login.
2. Authorization requests use code flow, PKCE S256, fresh state, fresh nonce, and (for linking)
   account selection.
3. Relative pre-login destinations are restored; absolute/external return URLs are rejected.
4. The callback fragment is scrubbed from browser history after Cove consumes it.
5. Cove's audit log contains generic external login/link events without subjects, tokens, codes, or
   secrets.
6. Client secrets, authorization codes, ID tokens, passwords, browser-binding cookies, and link codes
   do not appear in Cove, proxy, or Authentik logs.

Login/link flows and one-time tickets are process-local. If Cove runs multiple backend instances, use
sticky routing for the start, callback, and redemption sequence until a shared ephemeral store is
implemented.

## 7. Multiple providers and provider replacement

Add each OIDC provider separately. A single Cove user can link Authentik, a second OIDC provider, and
a trusted-header identity at the same time. Login through any linked identity resolves the same Cove
user and does not duplicate roles or history.

To replace Authentik or change an issuer/subject mode:

1. Keep the old provider enabled.
2. Add the replacement as a new provider. Issuers cannot be edited in place because they are part of
   identity.
3. Ask every user to link and test the replacement.
4. Disable the old provider. Existing links remain recorded but cannot authenticate while disabled.
5. Users or an administrator unlink the old identities.
6. Delete the old provider only after its link count is zero. Cove blocks earlier deletion.

Disabling or uninstalling the extension does not delete Cove-owned identity links. Reinstalling the
same extension and exact provider authority can use those links again. Every user retains a local
password throughout provider migration, so disabling a provider or the extension removes only that
alternative sign-in method. Verify the replacement before retiring the old provider so users get the
intended SSO experience.

## 8. Optional trusted-header / forward-auth setup

Do this only after OIDC works. Authentik's proxy outpost emits both a display username and
`X-authentik-uid`, which Authentik documents as a hashed user identifier. Configure Cove to use the UID
as the stable subject and the username only as a display label.

### Authentik configuration

1. Create an application with a **Proxy Provider**.
2. Choose **Forward auth (single application)**.
3. Set its external host to `<COVE_PROXY_PUBLIC_URL>`.
4. Assign it to the embedded or manually managed proxy outpost.

Official references:

- [Proxy provider and upstream headers](https://docs.goauthentik.io/add-secure-apps/providers/proxy/)
- [Forward auth](https://docs.goauthentik.io/add-secure-apps/providers/proxy/forward_auth/)

### Reverse-proxy configuration

This minimal Caddy shape follows Authentik's forward-auth pattern. Replace every placeholder:

```caddyfile
<COVE_PROXY_PUBLIC_HOST> {
    route {
        # Never let browser-supplied identity headers survive.
        request_header -X-Authentik-Uid
        request_header -X-Authentik-Username

        reverse_proxy /outpost.goauthentik.io/* <AUTHENTIK_INTERNAL_URL>

        forward_auth <AUTHENTIK_INTERNAL_URL> {
            uri /outpost.goauthentik.io/auth/caddy
            copy_headers X-Authentik-Uid X-Authentik-Username
        }

        reverse_proxy <COVE_UPSTREAM_URL>
    }
}
```

If Caddy runs in Docker, `127.0.0.1` refers to the Caddy container. Use an explicit shared network or
host-gateway route. Keep Cove's direct upstream private.

Configure the extension:

| Setting | Value |
| --- | --- |
| Trusted-header enabled | On |
| Provider label | `Authentik forward auth` |
| Authority ID | Let Cove generate it on first enable; disable and unlink every account before replacing it |
| Stable subject header | `X-Authentik-Uid` |
| Display-name header | `X-Authentik-Username` |
| Trusted proxies | The narrowest direct Caddy peer `/32` or `/128` |

Do not trust all private ranges to make the test pass. Cove intentionally ignores forwarded-address
headers when deciding whether the identity headers are trusted. Every ingress on the path must strip
client-supplied identity headers.

Trusted-header authentication is transparent, so it is not shown as a separate login button. It is
shown as a link action in Account settings. While locally signed in through the proxy, select that
link action and explicitly confirm the identity.

The trusted-header identity is authoritative on every request. If the proxy changes from one linked
subject to another, Cove switches to the newly asserted Cove user instead of retaining a stale local
cookie. An unlinked, inactive, or locked asserted subject fails closed. Explicit share links retain
their restricted share scope, and a same-user API token retains its token scope.

Verify:

1. A linked user through the trusted proxy resolves to the expected Cove account.
2. A direct request to Cove with forged UID and username headers remains anonymous.
3. A request through the proxy without a valid Authentik session is rejected before Cove.
4. Missing, duplicated, malformed, or comma-joined stable-subject headers fail closed.
5. Changing only `X-authentik-username` does not change the linked identity.

## Legacy settings migration

An older extension version stored one OIDC provider and authenticated by a username claim. On first
load, the new version migrates that OIDC configuration into one named provider and moves its secret to
a namespaced secret key. No external links are inferred from usernames; every Cove user must complete
the explicit link flow.

Legacy trusted-header mode is migrated disabled because its old header was documented as a username,
not a stable subject. Review the proxy, configure `X-authentik-uid` (or another authority-owned stable
identifier), and explicitly re-enable it.

## Operations and troubleshooting

```bash
docker compose ps
docker compose logs --tail=200 server worker
docker compose down       # keeps the database unless volumes are explicitly removed
docker compose up --detach
```

| Symptom | Check |
| --- | --- |
| OIDC discovery fails | Issuer DNS and TLS must work inside the devbox; discovery issuer must match exactly |
| Authentik reports invalid redirect URI | Match Cove origin, scheme, port, callback path, and slash behavior exactly |
| OIDC succeeds but Cove reports unlinked identity | Sign in locally and complete Account settings link/confirmation; username matching is intentionally absent |
| Link opens the wrong Authentik account | Sign out at Authentik and retry; link requests include account selection but provider policy still applies |
| Provider cannot be deleted | Disable it, unlink all associated Cove identities, then delete it |
| User record reports `password required` | Issue a password invite; external login is rejected until redemption |
| Every external provider is unavailable | Users sign in with their Cove passwords |
| Forward auth loops | Check proxy external host and direct routing of `/outpost.goauthentik.io/*` |
| Forward auth reaches Cove anonymously | Verify both copied headers and the exact direct-peer CIDR Cove observes |

Before sharing diagnostics, remove hostnames, IPs, usernames, client IDs, issuer paths, authorization
codes, cookies, tokens, link codes, and library-specific details. Rotate any credential exposed in a
terminal or tool transcript.
