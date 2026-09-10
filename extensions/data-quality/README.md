# Data Quality

Data Quality adds a dedicated Cove page for saved video, performer occurrence, and tag reviews. Enable it in **Settings → My → Interface → Navigation**.

Video and occurrence reviews put the player, active item, current tags, and configured actions beside an independently scrollable queue. Occurrence actions affect only the active performer in that video. Matching partners are reviewed together; switching partners preserves playback and clip boundaries. Video actions affect the video itself. Existing multi-tag actions, explicit absence tags, and legacy occurrence tag-choice reviews remain supported.

The URL owns the complete effective query: search, scene filters, performer scope and occurrence conditions, sorting, page size, page, and traversal direction. Bare review links load saved defaults and serialize them. Query-bearing links remain independent of subsequent default changes, including explicit empty filters. **Reset to review defaults** replaces the current query; **Save as review defaults** opens the workspace rule editor with the current criteria; **Save review** persists the draft. Opening another review starts with its defaults. New reviews start from the end; existing direction settings and explicit URL pages are honored.

Actions apply and advance by default. When the current video is playing, applying a change and advancing to another video starts playback there too; a paused video stays paused. Shift-click or Shift plus the numbered shortcut applies and stays; each writing action also has **Apply & stay**. **Edit tags** uses Cove's shared tag selector for arbitrary additions and removals. **Save** stays, **Save & next** advances, and **Cancel** discards the local draft. Shortcuts are suspended while typing, editing tags, or using dialogs and player controls.

**Skip** only moves the cursor. Eligibility comes from current filters, without reviewed/inconclusive states or persistent position. Successful tag saves refresh queue membership and counts. Occurrences that no longer match the filters leave the queue; a scene leaves after its last matching performer is tagged. Skipped and still-matching items are available again when their page is revisited. Legacy stored progress is left untouched and ignored for video and occurrence reviews.

Tag-group reviews retain their Grid/List selection and progress workflow. Review definitions use Cove's account-scoped saved-filter API with browser recovery support. See the [user guide](docs/video-data-quality.md), [interaction contract](docs/data-quality-review-interaction.md), and [storage contract](docs/storage-and-verification.md).

Registry publication remains deferred. Visual-similarity search is not available through the public extension API. No new backend endpoint or database migration is required by this workflow.
