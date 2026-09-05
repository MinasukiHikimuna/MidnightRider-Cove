# Segment Studio migration plan

## Purpose

Port the useful review workflow from the frozen standalone Marker Studio into an
independently packaged Cove extension. Cove is the source of truth for videos,
tags, and segments. Legacy synchronization, cached Stash entities, credentials,
and Main Stash access are outside the product and migration path.

## User guide

Segment Studio has two top-level tabs:

- **Videos** is the place to choose work. Search, sorting, paging, segment-count
  filters, and—when Full mode is enabled—review-status filters help narrow the
  library to the next video that needs attention.
- **Segments** is the inventory of segment records that already exist. In Full
  mode, native Cove segments and unpublished Segment Studio segments appear in
  one list with their publication and review state. Rejected extension-owned
  records remain available here for restoration or permanent deletion rather
  than requiring a separate recycling-bin destination.

Opening a video or segment enters the editor. The editor is intentionally not a
tab: it is a focused workspace that uses the available viewport for the player,
swimlanes, marker rail, timing controls, tags, review controls, and performer
slots available in the selected mode. It does not repeat the Videos/Segments tab
bar or reserve a separate `Back to ...` row. A compact **Videos** exit action is
part of the editor header alongside the other editor controls.

The mode selector lives in Segment Studio Settings and is stored per Cove user
in the database, so the selected workflow follows that account across browsers.
Changing it affects presentation and workflow only; it does not migrate or
rewrite segment rows:

- **Basic** treats Segment Studio as a native-segment editor. Users choose a
  video, adjust native segment timing and tags, and move unwanted native
  segments into extension-owned rejected records that can later be restored.
- **Full** adds the review workflow over the union of published native segments
  and unpublished extension-owned segments. Native segments are already
  approved/published even when extension metadata such as performer slots is
  incomplete. Approving an unpublished segment marks the extension-owned draft
  ready. **Complete review** publishes the currently approved drafts as native
  Cove segments while leaving unreviewed and rejected items extension-owned.
  Completion may publish an approved subset and can be repeated later.

## Current implementation status

Segment Studio 0.7 is implemented as a MidnightRider full extension.

- `/segment-studio` is the **Videos** page with text search,
  canonical tag filtering, segment-presence and review-state filters, stable
  sorting and paging, and card/list display modes.
- `/segment-studio/segments` is the **Segments** page. It presents the segment
  inventory while keeping the native/extension residence detail subordinate to
  the user's workflow.
- `/segment-studio/<video-id>` is a dedicated editor route that supports deep
  links, reload, back/forward navigation, and guarded asynchronous route changes.
- In Full mode that editor loads native segments and extension-owned drafts into
  the same marker rail and timeline. Draft review, timing, tag, split, duplicate,
  and performer-slot edits remain extension-owned until completion publishes an
  approved draft.
- The Videos and Segments tabs are absent from that editor route. The compact
  exit action lives in the editor header, and large viewports dedicate the
  remaining page height to the editing workspace.
- The editor opens immediately. There is no start/resume/create-workspace gate.
- Ordinary canonical Cove `tag` segments are loaded directly. Videos without tag
  segments show an empty editor rather than creating extension rows.
- Marker selection, mouse and keyboard navigation, imperative player seeking,
  playback time updates, review counts/filters, and Cove's shared VideoPlayer are
  retained.
- The editor uses a timeline-primary, bounded review layout adapted from the
  frozen Marker Studio interaction model. On sufficiently large viewports, a
  keyboard- and pointer-resizable player/timeline split gives the swimlanes 45%
  of the media area by default while preserving minimum usable heights for both.
  Short and narrow layouts, plus editor error/conflict states, use normal page
  flow with a 20rem timeline so minimum player and timeline sizes never overlap
  the direct-edit controls.
- Canonical tag identity defines each swimlane, overlapping same-tag segments
  receive separate tracks, and lane summaries show live review counts. The
  timeline provides click-to-seek, one continuous playhead across its axis,
  group headers, and lane body, zoom/fit/center controls, within/across-lane arrow
  navigation, and playhead-relative bracket navigation. Its time axis remains
  visible during vertical scrolling, and selection reveals the relevant lane
  without changing the horizontal timeline position.
- Cove's tag settings manage native **tag groups**. Segment Studio has no
  Organization settings tab. Group order uses Cove's group order, while tags
  within each group use `SortName` when set and otherwise name. The video editor
  can assign, move, or unassign a tag through the native group catalog.
- Configured tag groups determine the leading swimlane sections. Tags not
  assigned to a tag group remain visible in a `SortName`-or-name ordered
  `Ungrouped` section. A canonical tag belongs to at most one tag group.
- Cove's normal global sidebar remains present. The state-colored marker rail is
  available beside the primary pane but can be collapsed; its visibility and the
  timeline split are remembered in browser-local storage. Marker creation, splitting,
  duplication, deletion, and legacy marker-conversion controls are not part of
  this direct-canonical slice.
- Approve, reject, unreview, start-time edits, and end-time edits save immediately
  to the canonical segment.
- Each mutation requires `segments.write` on the owning video and respects Cove's
  video visibility query filter.
- Every mutation supplies the segment's expected `UpdatedAt`. The relational
  update includes that timestamp in its write predicate, so a concurrent change
  returns HTTP 409 without being overwritten.
- Recent successful edits are recorded in bounded browser-local storage. Undo is
  another concurrency-checked canonical mutation and refuses to overwrite a
  segment changed since the recorded edit.
- Keyboard shortcuts are owned by the mounted editor surface and ignore editable
  controls, overlays, modified keys, and the discovery page.
- Discovery aggregates canonical segments through an indexed read-only view and
  does not perform per-video queries or any writes.
- The extension records manual field provenance and publishes a cache-only host
  event after a successful external mutation. Cove consumes that signal without
  forwarding a misleading video lifecycle event to other extensions.

The installed historical 0.3/0.4 workspace tables remain in the database as
inert upgrade history. They are no longer mapped by the active model, queried by
the API, or exposed in the UI. Keeping them for now makes the architectural trial
reversible and avoids destructive data loss.

## Architectural decisions

### Distribution and host contract

- Segment Studio remains independently distributed from MidnightRider.
- Cove contains no Segment Studio routes, entities, payload rules, or workflow.
- Cove changes are limited to generic extension/runtime support. The current
  additions are parameterized full-page extension routes, authenticated extension
  API fetch, and event-driven cross-request segment-span cache invalidation.
- Segment Studio 0.6 requires Cove 1.0.1 because authenticated extension API fetch
  was added after the 1.0.0 runtime was released.
- The frozen standalone application and database are read-only reference fixtures,
  not runtime dependencies.

### Canonical editing

The canonical Cove segment is now the editing aggregate. There is no active
extension-owned workspace, marker copy, revision, completion, or materialization
step.

- Listing, searching, filtering, card rendering, and editor loading are read-only.
- Only an explicit review or timing action mutates a segment.
- Segment Studio edits only ordinary video tag segments and never creates a row
  merely by opening a route.
- Tag identity, kind, source key, source run, confidence, and producer-owned
  payload data remain unchanged.
- Timing and the namespaced review state are the only current mutable values.
- The host's segment field-provenance service records the direct user mutation.

### Segment groups

Segment Studio uses Cove's native tag groups as its editor presentation groups,
with Cove's tag settings as the administration surface. Native group order
controls section order. Native tag `SortName`, falling back to name when unset,
controls lane order in grouped and ungrouped sections. The video editor may
assign, move, or unassign a tag through an existing group. Extension-owned operation
receipts let a database retry recognize an already committed inline assignment
without replaying it over a newer change. The explicit operator migration script
for the earlier extension-owned model preserves existing native assignments and
migrates every eligible ungrouped legacy tag.

Reading settings or loading an editor performs no writes. Inline assignment uses
Cove's native tag permission and changes exactly one tag
in a database transaction. Tag-group mutations share a PostgreSQL
transaction-scoped advisory lock, re-read their inputs after a rollback retry,
and use the transactionally committed receipt to preserve every successful
mutation across an ambiguous commit acknowledgement.

### Review payload

Absence of an owned review value means `unreviewed`. Reviewed segments use:

```json
{
  "segmentStudio": {
    "schemaVersion": 1,
    "reviewState": "approved"
  }
}
```

`rejected` is the other stored value. Segment Studio merges this object into an
existing JSON object and removes only the owned review value when unreviewing.
Unrelated fields inside and outside `segmentStudio` are preserved. A non-object
producer payload is temporarily wrapped while reviewed and restored exactly when
the segment returns to unreviewed.

### Pre-release workspace conversion

Unpublished workspace builds used a narrow, one-time operator transition:

- approved and rejected decisions linked to canonical source segments are copied
  into the canonical namespaced payload;
- unreviewed workspace snapshots are not applied, so an old projection cannot
  silently replace newer canonical timing;
- the old candidate view/index is replaced by an indexed canonical review view;
- legacy workspace, marker, source, and provenance tables remain inert until
  the installation is rebaselined.

The public 1.0 baseline does not create those legacy tables. Existing dogfood
databases use `scripts/rebaseline-segment-studio-migrations.sql` after any
desired archival export; the script refuses to remove non-empty workspaces.

### Long-term deletion integrity

- Verify and test the complete Segment Studio cleanup path when Cove deletes a
  video. Extension-owned stable items, slots, receipts, operations, and other
  item-attached metadata should be removed transactionally.
- Decide and enforce the matching policy for native video segments. The generic
  `segments` table uses a polymorphic `HostType`/`HostId` reference rather than a
  database foreign key to `videos`, so deleting a video must not leave native
  segments or their Segment Studio metadata orphaned.
- Cover both Cove's single-video and batch-delete paths with database-level
  integration tests before relying on deletion as lifecycle cleanup.

### Deferred rejected workflows

- Completing a review must never delete or otherwise mutate rejected items.
- Add a separate Stash Marker Studio-style rejected deletion action in a later
  slice.
- Add a separate rejected-item export suitable for improving AI training data;
  define its privacy, metadata, and media format before implementation.

### Concurrency and undo

`UpdatedAt` is the segment-level concurrency token for this first direct-editing
slice. Relational writes use a single conditional update. A stale request returns
the latest visible segment with HTTP 409 and the UI reloads the editor.

Browser undo stores at most 50 recent changes across videos. Each entry contains
only the video/segment identity, the prior review/timing values, and the timestamp
produced by the edit. It is intentionally local convenience, not authoritative
history: clearing site data removes it, other browsers do not share it, and any
intervening writer makes the entry stale.

When a successful undo exposes an older local change for the same segment, the
older entry receives the timestamp returned by the undo. This allows a local
change sequence to be unwound in order without weakening stale detection for a
native Cove edit, another tab, or another client.

## User experience and navigation

The primary flow is deliberately simple:

1. Optionally arrange canonical tags at `/segment-studio/settings`; this changes
   Segment Studio presentation only.
2. Use **Videos** to search and filter the review queue, or **Segments** to find
   an existing segment directly.
3. Open a result in the focused editor at `/segment-studio/<video-id>`.
4. Select from the marker rail or canonical-tag swimlanes, navigate with the
   timeline controls or keyboard, and approve, reject, unreview, or edit timing.
5. See the save complete immediately; use recent undo when appropriate.

There is no source-catalog editor, performer-slot UI, derivation editor, timeline
authoring surface, completion preview, publish button, or materialization control
in this slice.

## Validation expectations

- Verify discovery does not change canonical or legacy extension row counts.
- Verify direct links and reloads return the same canonical state.
- Verify review and timing writes preserve tag, kind, producer identity,
  confidence, unrelated payload fields, and non-object payloads.
- Verify a stale timestamp returns 409 and does not mutate the segment.
- Verify permission denial and hidden videos cannot be mutated.
- Verify the derived-span cache is invalidated after successful writes.
- Verify browser-local undo restores the prior values only when its timestamp is
  still current.
- Verify discovery counts/filters update after canonical review changes.
- Verify editable timing controls and overlays do not trigger shortcuts.
- Verify swimlane grouping and overlap tracks are deterministic, timeline marker
  clicks seek precisely, and arrow/bracket/zoom/fit/center shortcuts remain
  scoped to the mounted editor without trapping Tab focus.
- Verify Segment group loading is read-only, group/tag ordering is deterministic,
  cross-group moves are transactional, authorization is enforced, canonical tags
  remain unchanged, and direct settings links survive reload and back/forward.
- Verify the frozen reference and preserved migration artifacts remain unchanged.

## Current validation status

- MidnightRider Debug and Release suites pass with 22 HashTheCove and 34 Segment
  Studio tests in each configuration.
- Twenty-five focused JavaScript tests pass, including route-race guards,
  editor-owned keyboard handling, canonical swimlane grouping and navigation,
  coincident-point overlap tracks, fractional playhead navigation, persistent
  bounded layout state, splitter accessibility, timeline geometry, read-only
  discovery, continuous grouped-lane playhead geometry, chained bounded undo
  behavior, packaged review-state styling, complete accessible names, and
  marker-button focus.
- MidnightRider repository, JavaScript syntax, package, and package-content
  validation pass for Segment Studio 0.6.
- The focused Cove cache-invalidation, registry-replacement, and late-generation
  tests pass, and all 1,051 tests in the ordinary Cove test project pass. The
  separate solution-level performance project cannot run
  because its dedicated benchmark PostgreSQL service is not provisioned in this
  devbox; its failures are connection refusals before any workload executes.
- Installed-browser verification covers discovery filters, card/list selection,
  paging, direct editor links and reload, back/forward navigation, immediate
  review and timing writes, multi-step local undo, a real two-tab HTTP 409
  conflict, and the installed canonical swimlanes with 217 realistic segments.
- Installed swimlane verification covers click-to-seek, 100% fit and horizontal
  zoom, late-playhead centering, lane-aware arrow navigation, playhead-relative
  navigation, synchronized review counts across save/reload/undo, and
  desktop/short-wide layouts without document-width overflow. Native Tab focus
  traversal and the keyboard-operable seek slider are included in the final
  repeat verification. The installed playhead is a single continuous body
  overlay rather than per-lane fragments; its axis and body segments remain
  horizontally aligned at fit and 150% zoom, after horizontal scrolling, and
  while playback advances. At horizontal zoom, the sticky label gutter masks a
  playhead scrolled beneath it instead of allowing the line to paint over labels.
- Installed layout verification covers the 45% default split, pointer and keyboard
  resizing with viewport-aware bounds, double-click reset, persistence across
  reload, a persistent collapsible marker rail, sticky time axis, selected-lane
  reveal without horizontal scroll changes, a fully contained shared VideoPlayer,
  and 20rem page-flow timelines on short and narrow viewports. Exact-breakpoint
  and intercepted-conflict checks confirm page-flow fallback preserves a 12px gap
  above the direct-edit controls.
- Installed Segment group verification covers direct settings navigation and
  reload, create, canonical-tag search, ordered membership insertion and reorder,
  and editor rendering with the configured section first and ungrouped lanes
  after it. A lane click still selected the canonical segment and sought the
  shared player to the exact start time.
- Supporting SQL confirms the Segment group trial created only extension-owned
  group/membership rows; the referenced canonical tags and segments predate the
  trial and retained their prior update timestamps.
- Supporting SQL confirms the exercised canonical segment returned to its
  original timing and unreviewed payload, manual payload provenance was recorded,
  the canonical review view/index exist, and inert legacy table counts did not
  change during discovery or editing.
- The dense-editor xhigh review's runtime-color, responsive-height,
  accessible-name, and marker-focus findings are addressed and verified in the
  installed package. The required repeat review found no actionable issues.

## Remaining open questions

1. Is `UpdatedAt` sufficiently isolated as a concurrency token, or should Cove
   expose a dedicated segment revision/ETag so unrelated host bookkeeping cannot
   cause benign conflicts?
2. Should rejection remain metadata on a visible canonical segment, or should
   Cove eventually offer a generic reviewed/hidden lifecycle distinct from
   deletion?
3. Is browser-local undo enough after the trial, or should Cove expose generic
   canonical segment audit/revert operations for cross-device recovery?
4. Which producers are permitted to overwrite reviewed timing or review payload,
   and should a generic producer policy protect user-reviewed segments?
5. Should native tag groups gain more editor-specific presentation controls
   after the settings workflow is dogfooded?
6. What conservative retention window should prune committed Segment group
   operation receipts after all realistic database retry windows have elapsed?
7. Do performer slots and derivations still belong in Segment Studio, or should
   they be postponed until a concrete direct-canonical representation is proven?

## Product TODOs

- [x] Make **Shift+,** and **Shift+.** perform the same medium frame stepping as
  Stash Marker Studio. Verify the shortcut against keyboard layouts that report
  either the shifted character (`<`/`>`) or the physical comma/period key, and
  retain the configured medium-frame count.
- [x] Add Stash Marker Studio-style inline canonical-tag configuration from the
  editor swimlane title. Use the same compact gear action in the available space
  to the left of the tag name, and allow editing performer-slot definitions and
  assigning the tag to a Segment group without leaving the editor.
- [x] Investigate and fix **Enter** playback so it reliably seeks to the selected
  segment start and begins playing, regardless of whether playback is currently
  paused or already running.
- [x] Investigate **Tab** navigation between segments near the playhead. Verify
  whether the current proximity window is too narrow and adjust it so nearby
  segments can be cycled predictably without selecting unrelated work.
- [x] Replace the review-state controls in the segment rail with one editor-level
  filter control. Move **Hide derived segments** into it and support filtering by:
  - approval state;
  - performer, after deciding whether the model needs any-slot matching,
    per-slot matching, or both;
  - provenance;
  - AI confidence using a draggable range slider with independently adjustable
    minimum and maximum confidence.
  Keep filter state and counts consistent across the segment rail, swimlanes,
  selection, and keyboard navigation.
- [x] Render the registered provenance/source label consistently so the `tpdb`
  source key appears as **TPDB**, not title-cased as `Tpdb`. The replacement
  migration already registers `tpdb` with provider `TPDB` and display name
  `The Porn Database`; the remaining issue is that compact segment-rail
  provenance currently formats the raw source key without the registered
  display name.
- [x] When duplicating an existing segment, automatically select the newly
  created duplicate so subsequent keyboard editing applies to the new segment.
- [x] Preserve an approved segment's approval state when assigning or changing
  one of its performers.

## Next slice

Dogfood native tag groups in realistic review sessions before expanding their
presentation. The next focused settings/editor slice may refine collapsible
group sections and matching grouped presentation in the marker rail if those
materially improve navigation. The next editing slice may
add playhead-based start/end assignment, small timing
nudges, selected-segment looping, and configurable auto-advance if real review
sessions confirm their value. The playhead continues to use Cove's shared
250-millisecond player-time update cadence; that cadence is acceptable and does
not need a separate smoothing slice. Whether the global Cove sidebar should
remain visible in the focused editor is intentionally deferred until this layout
has been used in longer sessions. In parallel, retain the existing safety and
interoperability work:

1. exercise concurrent native Cove and Segment Studio edits against a dedicated
   segment revision/ETag spike;
2. define producer overwrite behavior for reviewed segments;
3. decide whether generic audit/revert support is warranted beyond local undo;
4. validate rejection visibility across Cove's native segment displays and
   searches;
5. archive or remove the inert workspace schema only after an explicit decision.

Legacy synchronization remains reference-only and must not be ported.
