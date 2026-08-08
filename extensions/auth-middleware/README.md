# Authentication Middleware

A Cove extension that adds two provider-facing authentication modes without
putting provider configuration or protocol behavior into Cove core:

- OpenID Connect Authorization Code login with PKCE.
- A username header accepted only from explicitly trusted direct proxy peers.

Cove remains responsible for matching an existing local username, checking
whether that user is active and unlocked, expanding Cove roles and permissions,
issuing Cove sessions, and writing login audit events. The extension does not
auto-provision users or map identity-provider groups to Cove roles.

The OIDC flow validates browser binding, single-use state, nonce, issuer,
audience, signature, token lifetime, and PKCE. Its callback uses the configured
Cove public origin rather than trusting forwarded host or scheme headers.
Provider authorization codes, tokens, client secrets, and raw callback queries
are never logged.

Trusted-header mode validates the request's direct network peer against the
configured IP/CIDR allowlist before accepting exactly one configured username
header. It rejects ambiguous multi-value headers and never trusts forwarded
address headers to establish the trusted peer.

See [the host-side Authentik development guide](docs/authentik-host-setup.md)
for the supporting service, OIDC provider, optional forward-auth proxy, and
verification setup.

Package from the MidnightRider-Cove repository with:

```bash
package-midnight-rider-extension \
  --repository "$COVE_MIDNIGHT_RIDER_WORKSPACE" \
  --extension com.midnightrider.auth-middleware \
  --configuration Debug
```

The extension is licensed under the GNU Affero General Public License v3.0 or
later.
