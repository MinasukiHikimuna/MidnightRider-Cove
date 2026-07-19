# Animated Tag Previews

Animated Tag Previews is a separately packaged Cove extension that turns a short crop from an existing
video, or a custom VP9 WebM, into optional animated media for a tag. It uses Cove's entity-media,
entity-cover-editor, and player-tool extension contracts; it does not replace the video player, tag
card, tag page, or normal tag image.

## Requirements and setup

- A development build of Cove containing the extension media runtime. The temporary manifest minimum
  is 1.0.0, but the first release remains blocked until this is replaced by the actual Cove release
  containing the entity-media, player-tool, minimal-API
  authorization, and MIME-preserving blob contracts introduced with this extension work.
- An FFmpeg build with the `libvpx-vp9` encoder.
- A compatible FFprobe executable.
- Readable source video files and enough temporary and blob-storage space for an encode.

Cove normally discovers or manages FFmpeg and FFprobe. If discovery fails, configure the paths in
Cove's media settings, restart Cove if requested, and check the extension health endpoint before
starting a job. The extension never accepts an executable or filter string from the browser.

Install the released zip through Cove's Extensions settings; this is the preferred path. For manual
development installs, place the unpacked package at
`<Cove data>/extensions/animated-tag-previews` and keep `extension.json` at that package root. Do not
confuse this native extension directory with the legacy plugin directories configured through
`Cove.Configuration.ExtensionPaths` (default `<data>/plugins`). Enable the extension and refresh its
health status. Its in-app manual topic appears under Help.

## Using the editor

Open an ordinary video detail page and choose the Animated Tag Preview player action. Position and
resize the crop, adjust the start time, then choose a tag you can edit. The server checks read
access to the source video and write access to the target tag before resolving a physical source path.
Encoding runs as a cancellable Cove background job.

The default recipe is a muted, five-second 4:3 WebM at 720 pixels wide and 24 frames per second, encoded
with `libvpx-vp9`. The initial limits are 10 seconds, 720 pixels, 300–2,500 Kbit/s, and a 120-second
encoding timeout. Cards and heroes are enabled initially; hover restarts playback but does not unmute
it. These settings are extension-owned JSON stored through `IExtensionStore`, not Cove configuration
or manifest values. The extension constructs its FFmpeg argument list from validated numeric input
and does not invoke a shell. The current implementation uses Cove's exclusive job queue for
CPU-intensive encoding. Extension settings can instead generate square or 16:9 previews, choose
whether card media inherits Cove's image fit or uses cover/contain explicitly, and make animated
cards in the top-level Tags grid match the configured preview aspect ratio.

To supply a finished animation instead, open a tag, choose **Change cover**, and use **Upload WebM**
in the Animated preview section. The upload is published immediately and stored byte-for-byte without
re-encoding. It must contain exactly one VP9 video stream with no audio or attachments, use even
dimensions within the configured maximum width, remain within the configured duration limit, and
have a frame rate from 1 through 60 frames per second. The upload limit is 100 MiB. Replacing or
deleting a custom upload uses the same controls in that section; the ordinary static cover remains
independent and continues to act as its poster and fallback.

On supported tag cards and heroes, the regular tag image remains the poster and fallback. Animated
media is lazy-loaded, paused outside the viewport or while the document is hidden, and replaced by the
static image when playback fails. Cove's reduced-motion preference always uses static media by default.

## Storage, privacy, and security

Generated and uploaded WebM bytes are stored through Cove's disk-backed blob service. The extension
database store contains only a tag-to-blob reference, a content version, settings, and compact origin
metadata. Generated recipes may contain Cove video and file IDs, crop coordinates, timing, encoder
settings, and creation time. Upload metadata contains dimensions, duration, frame rate, and creation
time. Neither form contains media bytes, base64 video, original filenames, byte counts, or physical
source paths.

Temporary output is written under Cove-managed temporary/cache storage and deleted after success,
failure, cancellation, or timeout. Generated media is never written into this installed extension
directory. Do not add Cove's extension directory to a media library path.

Preview generation and deletion require the normal Cove permissions and entity access. Streaming a
preview requires read access to its tag. Share links and content rules are evaluated by Cove before
the extension endpoint executes. The extension makes no network requests and declares no scraper or
downloader runtime permission.

## Disable, upgrade, uninstall, and cleanup

- **Disable:** removes the extension UI and restores native tag media. Blob mappings and generated
  media remain available for a later re-enable.
- **Upgrade:** replaces only package code and static assets. Cove blob storage and extension-store
  metadata remain outside the install directory and survive the upgrade.
- **Uninstall:** preserves generated previews by default. This prevents an accidental uninstall from
  destroying user-created media, but the media is not served while the extension is absent.
- **Explicit deletion:** select a tag in the player editor and use **Delete preview** before uninstalling
  to remove its mapping, recipe, and current blob.
- **Orphan cleanup:** use the settings UI dry run to identify owned blobs no longer referenced by a
  live tag. The UI displays the dry-run IDs, and the authorized `dryRun=false` request must include
  that dry run's `expectedVersion`; Cove rejects deletion if the orphan set changed meanwhile. Never
  delete files directly from Cove blob storage.

## Troubleshooting

**Health reports FFmpeg or FFprobe missing.** Verify the paths in Cove settings and that the Cove
process can execute both files. When FFmpeg is available but VP9 is not, install a build containing
`libvpx-vp9`; hardware-only VP9 encoders do not satisfy the initial extension requirement.

**The player action is absent.** Confirm the extension is enabled, extension UI troubleshooting mode
is off, and the page uses a supported video-detail player surface. Reload the extension manifest after
an install or upgrade.

**A preview does not animate.** Reduced-motion mode intentionally stays static. Otherwise check that
the selected surface is enabled, scroll the media near the viewport, and inspect the extension health
and browser media error. The normal image should remain visible throughout.

**Generation is rejected.** Confirm read access to the video, write access to the tag, valid source
media, and crop/time values within the video bounds. Authorization deliberately runs before source
path lookup, so a restricted request does not disclose whether a physical file exists.

**A custom WebM is rejected.** Confirm it uses the WebM container with one VP9 video stream, no audio
or attachments, even dimensions within the configured maximum, a duration within the configured
limit, and a frame rate from 1 through 60 frames per second. Uploading requires write access to the
tag and is limited to 100 MiB.

**A job fails or times out.** Check free space in Cove's cache and blob locations, then inspect the
bounded job error. Full FFmpeg stderr is intentionally not retained. Cancellation and timeout kill the
process tree and delete the temporary output.

## Building a package

Run from the repository root:

```bash
extensions/animated-tag-previews/scripts/package.sh --configuration Release
```

The script restores the locked frontend dependencies, runs backend and frontend tests, builds both
halves, validates the package, and writes:

```text
extensions/animated-tag-previews/artifacts/
  animated-tag-previews/
  animated-tag-previews-<version>.zip
```

Use `--skip-tests` only after the same revision has already passed its test suites. Use
`--skip-dependency-install` only when `npm ci` has already completed for the UI package. Build output
is disposable; user-generated previews are never inputs to or outputs from this packaging process.

The extension frontend targets Cove frontend runtime `v1`. The current `extension.json` schema does
not have a minimum-frontend-runtime field: Cove publishes its runtime version in the aggregated UI
manifest, but the bundle loader does not currently negotiate or reject a minimum runtime. Frontend
runtime compatibility is therefore documented here rather than machine-enforced, while
`minCoveVersion` protects the backend ABI.

Animated Tag Previews is distributed under the GNU Affero General Public License, version 3. The
packaging script includes the repository `LICENSE` in every installable artifact.
