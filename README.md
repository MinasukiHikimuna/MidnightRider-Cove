# MidnightRider Cove Extensions

Independent Cove extensions maintained in one repository. Each extension owns
its source, tests, build contracts, solution, package validation, and release
descriptor under `extensions/<extension-id>/`.

| Extension | Package directory | Release tag |
| --- | --- | --- |
| Hash The Cove | `extensions/hash-the-cove` | `com.midnightrider.hash-the-cove/v<version>` |
| Complete the Cove | `extensions/complete-the-cove` | `com.midnightrider.complete-the-cove/v<version>` |
| Animated Tag Previews | `extensions/animated-tag-previews` | `com.midnightrider.animated-tag-previews/v<version>` |
| Stash Filter Importer | `extensions/stash-filter-importer` | `com.midnightrider.stash-filter-importer/v<version>` |
| API Fault Simulator | `extensions/api-fault-simulator` | `com.midnightrider.api-fault-simulator/v<version>` |
| External Sign-In | `extensions/external-sign-in` | `com.midnightrider.external-sign-in/v<version>` |
| Segment Studio | `extensions/segment-studio` | `com.midnightrider.segment-studio/v<version>` |
| Sample Widgets | `extensions/discovery-widgets` | `com.midnightrider.discovery-widgets/v<version>` |
| On This Day | `extensions/on-this-day` | `com.midnightrider.on-this-day/v<version>` |
| Six Degrees of Johnny Sins | `extensions/six-degrees` | `com.midnightrider.six-degrees/v<version>` |
| Blast From The Past | `extensions/blast-from-the-past` | `com.midnightrider.blast-from-the-past/v<version>` |

The root workflow reads each package's `release.json`, then restores, tests,
packages, and releases only the extension selected by the pushed tag. Existing
release URLs remain stable because they are determined by the repository, tag,
and asset name rather than this source layout.

## Publish an extension

Write a short, reviewed changelog in a text file, then run:

```fish
python3 scripts/publish-extension.py \
  --extension-id com.midnightrider.on-this-day \
  --changelog-file /tmp/on-this-day-0.2.0.md \
  --dry-run
```

Remove `--dry-run` to publish. Add `--push-main` if local `main` is ahead of
GitHub and you want the command to push it. The command requires a clean `main`
checkout, `git`, `gh` authentication with write access to this repository and
the upstream official registry, and Python 3. It reads the version from the
extension manifest, pushes an annotated tag, waits for the release ZIP, and
opens a registry PR from an upstream branch. For a first release it creates the
registry entry; for later releases it appends a version. Registry CI generates
the checksum, index, and release date. Review and merge the PR after CI passes.

Development setup:

- [Host-side Authentik setup for External Sign-In](extensions/external-sign-in/docs/authentik-host-setup.md)
