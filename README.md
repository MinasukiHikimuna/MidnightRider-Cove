# MidnightRider Cove Extensions

Native extensions for [Cove](https://github.com/yourcove/cove), maintained by
MidnightRider. This private repository is licensed under AGPL-3.0-only.
The XXH64 implementation is adapted from the BSD-2-Clause-licensed
[xxHash v0.8.3 reference](https://github.com/Cyan4973/xxHash/tree/v0.8.3); its
copyright and license notice are retained in both the source and `LICENSE`.

## Hash The Cove

Hash The Cove calculates lowercase `xxhash` (xxHash64), `sha256`, and `sha1`
whole-file fingerprints for Cove video and gallery files. All algorithms and
both media types are configurable. Hash algorithms are disabled by default and
must be explicitly enabled; video and gallery selection is enabled by default.

Install the extension, configure it on Cove's Extensions settings page, then
run **Hash The Cove** from the extension tasks page. Existing fingerprint types
are matched case-insensitively and left untouched. Each file is streamed once
for every missing enabled algorithm. Missing, unreadable, and files changed
since Cove scanned them are reported as failures without stopping the job.
Cancellation stops the job promptly.

## Complete the Cove

Complete the Cove keeps an extension-owned catalog of metadata-server scenes
that are missing from this Cove library. Track a performer, studio, or tag from
its **Missing Scenes** tab, then refresh that selection or the complete catalog.
The extension matches remote IDs already stored by Cove, records missing-scene
metadata and relationships in its own tables, and stores downloaded covers in
Cove's extension blob store. It does not create Cove videos or copy records to
another Cove or Stash instance.

Metadata sources and credentials come from Cove's configured metadata servers.
Any HTTPS StashBox GraphQL instance can use the generic StashBox client, while
TPDB uses a dedicated REST client. Both normalize their results into the same
catalog model, and unsupported configured providers are ignored.

Complete the Cove settings list the supported metadata servers configured in
Cove. Select one or more instances for tracking and catalog refreshes. Any
HTTPS StashBox GraphQL instance uses the generic StashBox client; TPDB remains
the provider-specific REST integration.

On the missing-scenes catalog, **Refresh** updates all providers enabled in
Complete the Cove settings. The adjacent arrow menu can refresh one enabled
provider at a time. This extension-owned selection does not change how those
metadata providers are configured or used elsewhere in Cove.

The top-level Missing Scenes catalog and the Missing Scenes tabs on tracked
entities store their search and entity filters, sort order, page, and
ignored-scene visibility in the URL. Missing-scene detail links carry that
state and their originating catalog path so returning restores the same view.

The algorithm and media choices are available at **Settings → Extensions →
Hash The Cove**. `xxhash`, `sha256`, and `sha1` are disabled until explicitly
enabled. Video and gallery processing are enabled by default.

Before hashing begins, the task reports the distinct candidate file count and
the number of fingerprints missing for each enabled algorithm. A file missing
more than one enabled fingerprint is counted once in the candidate file total.
Progress messages then report four totals:

- `processed`: file records visited
- `added`: new fingerprints inserted
- `skipped`: files needing no insert
- `failed`: files that could not be safely hashed

## Development

Hash The Cove targets .NET 10 and released Cove 0.9.0 packages. To ensure a
sibling Cove source checkout cannot mask package compatibility, validate and
test with package mode forced:

```bash
node scripts/validate-extension-repo.mjs
dotnet restore HashTheCove.slnx --property:UseLocalCoveSource=false --property:UseLocalCoveCore=false
dotnet test HashTheCove.slnx --configuration Release --no-restore --property:UseLocalCoveSource=false --property:UseLocalCoveCore=false
```

To assemble version 1.0.0 manually, publish the project, place
`HashTheCove.dll`, `extension.json`, `README.md`, and `LICENSE` at the package
root, include `ui/HashTheCove.js`, stamp the manifest version, and run:

```bash
node scripts/validate-extension-package.mjs artifacts/HashTheCove 1.0.0
```

## Publishing

Release tags use the `hash-the-cove/v<version>` form. The manifest version must
match the tag, so version 1.0.0 is published by pushing
`hash-the-cove/v1.0.0`. GitHub Actions validates the repository, restores and
tests against released Cove packages, publishes the extension, validates its
package contents, and creates both a ZIP and SHA-256 checksum. A successful tag
build uploads those files to a GitHub release.
