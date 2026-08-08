# Host-side Authentik setup for Cove authentication development

This guide prepares Authentik outside the Cove devbox for the MidnightRider
authentication extension. The devbox does not contain Docker, Podman, or a
container socket, so Authentik must run on a host that the browser and the Cove
backend can both reach.

OIDC is the recommended first path. It needs only Authentik. Trusted-header
authentication is a second, optional path that also needs a reverse proxy and a
network path whose direct peer Cove can safely identify.

> This guide deliberately keeps hostnames, account names, client credentials,
> and other environment-specific values out of source control. Keep the host
> deployment and its secrets in ignored host-side state.

## Values to choose

Use placeholders while following this guide; do not commit the resulting
values or secrets.

| Placeholder | Meaning |
| --- | --- |
| `<AUTHENTIK_PUBLIC_URL>` | Browser-visible Authentik origin, with no trailing slash |
| `<COVE_PUBLIC_URL>` | Browser-visible Cove origin, with no trailing slash |
| `<COVE_UPSTREAM_URL>` | Cove address reached by an optional host reverse proxy |
| `<COVE_PROXY_PUBLIC_URL>` | Browser-visible Cove origin used for forward-auth testing |
| `<AUTHENTIK_INTERNAL_URL>` | Authentik address reached by the reverse proxy |

The OIDC issuer must use one hostname that is reachable from both the browser
and the Cove backend. Do not configure `localhost` as the issuer when Authentik
runs on the container host: `localhost` inside the devbox refers to the devbox,
not the host.

The intended topology is:

```text
OIDC:
browser ───────> Cove public URL
   └───────────> Authentik public URL <──────── Cove backend

Forward auth:
browser ───────> trusted reverse proxy ───────> Cove
                         └──────────────> Authentik outpost
```

## 1. Start Authentik on the host

Authentik's current Compose installation requires at least 2 CPU cores, 2 GB
of RAM, and Docker Compose v2 or Podman Compose. Run these commands on the host,
not in the Cove devbox:

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

The downloaded file pins the then-current Authentik release. Keep that pin;
do not replace it with `latest`. Re-download the official Compose file when
upgrading. Do not add timezone mounts to the containers because Authentik's
OAuth handling expects its internal services to use UTC.

The official Compose file mounts the Docker socket into the worker so
Authentik can deploy managed outposts. For OIDC alone, or when using only the
embedded outpost, remove the `/var/run/docker.sock:/var/run/docker.sock` mount
from the worker for least privilege. Keep it only if you intentionally want
Authentik to manage separate Docker outpost containers.

Open the host's Authentik URL on port 9000 and complete the initial setup for
the `akadmin` account. Keep the generated `.env`, admin password, and later
OIDC client secret outside source control.

Official references:

- [Docker Compose installation](https://docs.goauthentik.io/install-config/install/docker-compose/)
- [Authentik configuration](https://docs.goauthentik.io/install-config/configuration/)

## 2. Give Authentik a URL both sides can reach

For the cleanest test, put Authentik behind HTTPS at
`<AUTHENTIK_PUBLIC_URL>` using a certificate trusted by both the browser and
the devbox. Confirm all three of these paths before configuring OIDC:

1. The browser can open `<AUTHENTIK_PUBLIC_URL>`.
2. Authentik can redirect a browser to `<COVE_PUBLIC_URL>`.
3. The Cove backend can fetch `<AUTHENTIK_PUBLIC_URL>`.

If public DNS is unavailable, use a stable host DNS name or IP address that is
reachable from both environments. Do not use different browser-facing and
backend-facing issuer URLs: the `iss` value in the token must exactly match the
configured issuer.

For a local-only HTTP experiment, the extension will expose an explicit
**Allow an HTTP issuer and Cove URL for isolated development only** switch.
Leave it off for HTTPS and for every non-development deployment. A private or
self-signed HTTPS certificate must be added to the devbox trust store; do not
solve that case by disabling certificate validation.

From any machine that can reach Authentik, this should eventually return an
OIDC discovery document:

```bash
curl --fail --show-error \
  '<AUTHENTIK_PUBLIC_URL>/application/o/cove-dev/.well-known/openid-configuration'
```

It is normal for that URL to return 404 until the provider in the next section
exists.

## 3. Create the OIDC application and provider

In Authentik's Admin interface:

1. Go to **Applications > Applications** and choose **New Provider**
   (some releases label this **Create with provider**).
2. Give the application a development-only name and use the slug `cove-dev`.
3. Select **OAuth2/OIDC** as the provider type.
4. Use the authorization-code flow and a **Confidential** client.
5. Add exactly this **Strict** redirect URI, replacing the origin placeholder:

   ```text
   <COVE_PUBLIC_URL>/api/plugins/com.midnightrider.auth-middleware/oidc/callback
   ```

6. Select an asymmetric signing key so tokens can be verified through the
   provider's JWKS document.
7. Keep Authentik's default per-provider issuer mode.
8. Include the `openid`, `profile`, and `email` scope mappings. `offline_access`
   is not needed because the Cove extension does not retain Authentik refresh
   tokens.
9. Save the application, then record its client ID and client secret locally.

Use an exact redirect URI rather than a regular expression. Authentik validates
redirect URIs, and its default per-provider issuer for this slug is:

```text
<AUTHENTIK_PUBLIC_URL>/application/o/cove-dev/
```

The discovery URL is:

```text
<AUTHENTIK_PUBLIC_URL>/application/o/cove-dev/.well-known/openid-configuration
```

The extension will use Authorization Code with PKCE, and it will require and
validate `state`, `nonce`, issuer, audience, signature, and token lifetime.

Official references:

- [Create an OAuth2/OIDC provider](https://docs.goauthentik.io/add-secure-apps/providers/oauth2/create-oauth2-provider)
- [OAuth2/OIDC endpoints and issuer modes](https://docs.goauthentik.io/add-secure-apps/providers/oauth2)

## 4. Create a matching test user

Create or select an Authentik user whose `preferred_username` matches an
existing Cove username. Cove's normal username lookup is case-insensitive; no
other alias or email matching is performed. The initial extension deliberately
does not auto-provision accounts or map Authentik groups to Cove roles. Cove
remains the source of truth for account status, roles, and permissions, and it
rejects an unknown, inactive, or locked local user.

Use a dedicated non-owner account for the first positive test. Also prepare an
Authentik user with no matching Cove account for the negative test.

## 5. Configure the installed extension

Install and enable `com.midnightrider.auth-middleware`, then enter these values
in its Cove settings page:

| Extension setting | Value |
| --- | --- |
| OIDC enabled | On |
| Button label | `Sign in with Authentik` |
| Issuer | `<AUTHENTIK_PUBLIC_URL>/application/o/cove-dev/` |
| Client ID | The Authentik provider client ID |
| Client secret | The Authentik provider client secret |
| Cove public URL | `<COVE_PUBLIC_URL>` |
| Username claim | `preferred_username` |
| Scopes | `openid profile email` |
| Allow HTTP for isolated development | Off for HTTPS; on only for an intentional local HTTP test |

The client secret is write-only in the extension UI: leaving the field blank
preserves the stored value. Do not paste it into an issue, pull request, chat,
terminal transcript, or tracked file.

The extension's anonymous routes will be:

```text
/api/plugins/com.midnightrider.auth-middleware/oidc/start
/api/plugins/com.midnightrider.auth-middleware/oidc/callback
```

## 6. Verify OIDC

Once the Cove branch and extension are installed:

1. In the extension settings, save the OIDC configuration and run **Test saved
   OIDC configuration**. Discovery and signing-key retrieval must both pass.
2. Open a private browser window at the exact `<COVE_PUBLIC_URL>/login` origin.
   Do not start at a loopback URL or alternate hostname and return through the
   public callback: the browser-binding cookie is intentionally origin-scoped.
3. Confirm **Sign in with Authentik** appears in addition to Cove's local login.
   The advertised start URL must be a local extension path, not an absolute
   provider URL, and the provider response must be marked `no-store`.
4. Start the flow as the matching non-owner user. Confirm the authorization
   request uses Authorization Code with PKCE S256 and includes fresh `state`
   and `nonce` values. Do not copy those values into a transcript.
5. Approve consent if Authentik prompts for it. Confirm Cove signs in as the
   existing local user, removes the callback fragment from the address bar,
   and restores any relative Cove path requested before login. The one-time
   code belongs in the URL fragment so it never reaches proxy access logs.
6. Confirm the OIDC session resolves to the same Cove user, roles, permissions,
   and read grants as a normal local login. Refresh the session once to verify
   that it uses Cove's ordinary token rotation path.
7. Sign out, then try the Authentik user without a matching Cove account.
   Confirm Cove shows only a generic failure, creates neither a Cove user nor a
   Cove session, and removes the callback error marker from the address bar.
8. Start a login in one private window and try to finish or redeem it in a
   second window. Confirm the second window is rejected and that the original
   window can still redeem the ticket. A second redemption attempt in the
   original window must also be rejected.
9. Sign in once through Cove's original username/password form to confirm the
   local login path remains available.
10. Inspect Cove's audit log for an extension login success and an unknown-user
    failure. Inspect Authentik's recent server and worker logs for unexpected
    errors. Neither log should contain client secrets, passwords, tokens, or
    authorization codes.

Expected pre-install behavior is useful baseline evidence: there is no external
login button, and the planned callback route returns 404.

## 7. Optional: forward-auth / trusted-header test

Do this only after OIDC is working. Forward auth protects the whole application
at the reverse proxy and passes an asserted username to Cove. It is not needed
for the OIDC flow.

### Authentik configuration

1. Create another application with a **Proxy Provider**.
2. Choose **Forward auth (single application)**.
3. Set its external host to `<COVE_PROXY_PUBLIC_URL>`.
4. Assign it to the embedded proxy outpost under **Applications > Outposts**.

Authentik's outpost supplies `X-Authentik-Username`. The Cove extension will
accept that header only when the request's direct network peer matches its
trusted-proxy list.

Official references:

- [Create a proxy provider](https://docs.goauthentik.io/add-secure-apps/providers/proxy/create-proxy-provider/)
- [Forward auth](https://docs.goauthentik.io/add-secure-apps/providers/proxy/forward_auth)
- [Headers emitted by a proxy provider](https://docs.goauthentik.io/add-secure-apps/providers/proxy/)

### Reverse-proxy configuration

The following minimal Caddy shape mirrors Authentik's official template. Run
Caddy on the host or in a separate host-side container. Replace every
angle-bracketed value:

```caddyfile
<COVE_PROXY_PUBLIC_HOST> {
    route {
        # Never allow a browser-supplied identity header to survive.
        request_header -X-Authentik-Username

        # Authentik owns its callback/start paths on the protected Cove host.
        reverse_proxy /outpost.goauthentik.io/* <AUTHENTIK_INTERNAL_URL>

        forward_auth <AUTHENTIK_INTERNAL_URL> {
            uri /outpost.goauthentik.io/auth/caddy
            copy_headers X-Authentik-Username
        }

        reverse_proxy <COVE_UPSTREAM_URL>
    }
}
```

If Caddy itself runs in Docker, its upstream addresses must be reachable from
that container; `127.0.0.1` would refer to Caddy. A dedicated Docker network or
an explicit host-gateway mapping is preferable to guessing addresses.

Configure the extension with:

| Extension setting | Value |
| --- | --- |
| Trusted-header enabled | On |
| Username header | `X-Authentik-Username` |
| Trusted proxies | The narrowest CIDR containing the direct reverse-proxy peer, ideally one `/32` or `/128` |

Do not enter all private address ranges merely to make the test pass. Determine
the address Cove actually sees for the reverse proxy. If another ingress sits
between Caddy and Cove, Cove sees that ingress as its direct peer; the design is
safe only if that entire path strips client-supplied identity headers and the
trusted peer cannot be used by arbitrary clients to inject replacements.

Keep the direct Cove upstream private or otherwise ensure direct requests do
not arrive through a peer that Cove trusts for identity headers. Built-in Cove
bearer/cookie authentication takes precedence over an extension assertion, and
an absent or malformed trusted header does not authenticate a request.

Use a current patched Authentik release for forward auth. In particular,
Authentik documents forward-auth bypass fixes in 2025.10.4/2025.12.4 for Caddy
and Traefik, and 2025.12.5/2026.2.3 for nginx. The official current Compose file
should be newer, but verify the pinned image before exposing the proxy.

Security references:

- [CVE-2026-25748: Caddy/Traefik forward-auth bypass](https://docs.goauthentik.io/security/cves/CVE-2026-25748/)
- [GHSA-5wcc-hf24-rf5h: nginx forward-auth bypass](https://docs.goauthentik.io/security/cves/GHSA-5wcc-hf24-rf5h/)

### Verify forward auth

1. Open `<COVE_PROXY_PUBLIC_URL>` in a private browser window.
2. Confirm Authentik intercepts the request before Cove is shown.
3. Authenticate as the user whose username matches an active Cove account.
4. Confirm Cove resolves that local account and its Cove roles and permissions.
5. Send a request directly to the Cove upstream with a forged
   `X-Authentik-Username` header. Confirm it does not authenticate.
6. Send a request through the proxy without a valid Authentik session. Confirm
   the proxy redirects or rejects it rather than reaching Cove as a user.

## Operations and troubleshooting

Inspect status and recent logs on the host with:

```bash
docker compose ps
docker compose logs --tail=200 server worker
```

Stop the development stack without deleting its database:

```bash
docker compose down
```

Common failures:

| Symptom | Check |
| --- | --- |
| Discovery fetch fails in Cove | The issuer hostname must resolve and its TLS chain must be trusted inside the devbox |
| Authentik reports an invalid redirect URI | Match the exact Cove origin, scheme, port, path, and trailing-slash behavior shown above |
| Token validation reports issuer mismatch | Keep default per-provider issuer mode and include the trailing slash in the configured issuer |
| OIDC succeeds but Cove rejects the user | Match `preferred_username` to an existing active, unlocked Cove username |
| Forward auth loops | Check the provider external host and that `/outpost.goauthentik.io/*` is routed directly to the outpost |
| Forward auth reaches Cove anonymously | Check Caddy's copied-header capitalization and the extension's direct-peer trusted CIDR |

Before sharing logs or screenshots, remove hostnames, IPs, usernames, client
IDs, authorization codes, cookies, tokens, and library-specific details. Never
share the client secret or Authentik `.env`.
