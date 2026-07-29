# MidnightRider Cove Extensions

Independent Cove extensions maintained in one repository. Each extension owns
its source, tests, build contracts, solution, package validation, and release
descriptor under `extensions/<extension-id>/`.

| Extension | Package directory | Release tag |
| --- | --- | --- |
| Hash The Cove | `extensions/hash-the-cove` | `com.midnightrider.hash-the-cove/v<version>` |
| Complete the Cove | `extensions/complete-the-cove` | `com.midnightrider.complete-the-cove/v<version>` |
| Animated Tag Previews | `extensions/animated-tag-previews` | `com.midnightrider.animated-tag-previews/v<version>` |

The root workflow reads each package's `release.json`, then restores, tests,
packages, and releases only the extension selected by the pushed tag. Existing
release URLs remain stable because they are determined by the repository, tag,
and asset name rather than this source layout.
