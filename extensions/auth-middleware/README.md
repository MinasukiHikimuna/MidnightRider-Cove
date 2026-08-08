# Authentication Middleware

A Cove extension for external authentication while Cove remains the owner of users, roles,
permissions, account status, sessions, and audit events.

It supports:

- Multiple OpenID Connect Authorization Code providers with PKCE.
- A trusted reverse-proxy identity using a stable subject header from an explicitly trusted direct
  peer.
- Multiple external identities linked to the same Cove user, including identities from different
  providers.
- Explicit self-service linking and unlinking in **Settings > My settings > Account**.
- Local passwords for every Cove user, with external providers available only as additional sign-in
  methods.

External identities never match Cove users by username or email. OIDC identity is the exact,
case-sensitive pair of issuer and `sub`; trusted-header identity is a configured authority ID and
the exact stable-subject header. Names and email claims are display metadata only. One external
identity cannot be linked to two Cove users, and no provider auto-provisions Cove accounts or maps
provider groups to Cove roles.

## Fresh and existing Cove installations

Cove's built-in first-run owner setup must be completed before extensions can be installed. After
installing and configuring this extension, the owner signs in with the local recovery password,
links an external identity from Account settings, signs out, and tests external login. The Owner
account retains its local password.

Normal users follow the same transition: create or invite the Cove user, sign in locally once, and
explicitly link one or more external identities. Every user retains the local password created during
account creation or invite redemption. SSO is an optional alternative and never replaces local
login.

To replace Authentik or any other identity provider, add the new provider alongside the old one,
link the new identity to each Cove user, verify login, then disable and remove the old provider.
Provider issuers are immutable. A configured trusted-header authority can be replaced only after it
is disabled and all of its links are removed. An OIDC provider with existing links cannot be
deleted. Test the replacement before disabling the old provider; local passwords remain available
throughout the migration.

Disabling or uninstalling this extension removes its login choices but does not delete Cove-owned
identity links. Users continue to sign in with their local passwords, and reinstalling the same
extension with the same provider authority can use the retained links again.

The OIDC flow validates browser binding, single-use state, nonce, exact issuer, audience, authorized
party, signature, token lifetime, and PKCE. Provider authorization codes, tokens, client secrets,
and raw callback queries are not logged. Login tickets and in-progress login/link flows are bounded,
short-lived, process-local state, so a multi-instance Cove deployment needs sticky routing for the
start, callback, and redemption sequence.

See [the host-side Authentik setup and test guide](docs/authentik-host-setup.md) for deployment,
configuration, migration, and verification steps.

Package from the MidnightRider-Cove repository with:

```bash
package-midnight-rider-extension \
  --repository "$COVE_MIDNIGHT_RIDER_WORKSPACE" \
  --extension com.midnightrider.auth-middleware \
  --configuration Debug
```

The extension is licensed under the GNU Affero General Public License v3.0 or later.
