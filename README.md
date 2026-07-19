# MidnightRider Cove Extensions

<!-- TODO(COVE_MIN_VERSION): Before the first Animated Tag Previews release,
replace its temporary Cove 1.0.0 minimum with the production Cove version that
contains the extension media runtime changes, then remove this comment. -->

Native extensions for [Cove](https://github.com/yourcove/cove), maintained by
MidnightRider. This private repository is licensed under AGPL-3.0-only.
The XXH64 implementation is adapted from the BSD-2-Clause-licensed
[xxHash v0.8.3 reference](https://github.com/Cyan4973/xxHash/tree/v0.8.3); its
copyright and license notice are retained in both the source and `LICENSE`.

## Animated Tag Previews

Animated Tag Previews creates cropped VP9 WebM previews from existing Cove
videos or accepts a custom VP9 WebM from the tag cover editor, then displays it
as optional animated tag media. It includes a player tool for choosing the
time, crop, playback speed, and tag, plus settings for card, hero, hover,
aspect-ratio, and fit behavior. See the extension's `README.md` for security,
storage, and lifecycle details.

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

### Cove devbox workflow

The Cove devbox `extensions` profile mounts this checkout and supplies the active
Cove worktree through `COVE_SOURCE_ROOT`. Inside that devbox, build any cataloged
extension against the current Cove source with:

```bash
cd "$COVE_EXTENSION_WORKSPACE"
node scripts/package-extension.mjs --extension <extension-id> --configuration Debug
```

For example, `--extension hash-the-cove` builds the extension currently present
in this repository. The packager prints its stable development URL in the form:

```text
http://127.0.0.1:4174/<extension-id>-dev.zip
```

Use **Settings → Extensions → Install from URL** to install it. Re-run the package
command and install the same URL again to replace the running extension without
restarting Cove.

## Publishing

Release tags use the `hash-the-cove/v<version>` form. The manifest version must
match the tag, so version 1.0.0 is published by pushing
`hash-the-cove/v1.0.0`. GitHub Actions validates the repository, restores and
tests against released Cove packages, publishes the extension, validates its
package contents, and creates both a ZIP and SHA-256 checksum. A successful tag
build uploads those files to a GitHub release.
