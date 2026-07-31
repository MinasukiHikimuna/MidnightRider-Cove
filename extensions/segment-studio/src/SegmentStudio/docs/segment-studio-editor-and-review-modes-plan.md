# Segment Studio Editor and Review Modes Plan

## Status

Design proposal only. This document defines the intended architecture and phased
implementation; it does not authorize implementation by itself.

The user-visible contract is documented first in
[Segment Studio](segment-studio-user-guide.md). That guide is written as shipped
functionality and is the acceptance narrative for the implementation slices
below. Keep it synchronized whenever a slice changes user-visible behavior.

## Summary

Segment Studio will expose two UI modes over one shared data model:

- **Editor mode** edits native Cove segments directly. It supports timing and tag
  changes, deletion into an extension-owned recycling view, restoration, purge,
  and optional rejected-example export. It has no review states, progress, slot
  editing, completion, or publishing workflow.
- **Review mode** presents the union of native and extension-owned segments.
  Native segments are already published and therefore implicitly approved.
  Extension-owned segments are unpublished drafts and may be unreviewed,
  approved, or rejected. Approval accepts a draft for publication; completing
  the review materializes approved drafts as native segments.

Changing modes is presentation-only. The preference is stored as a UI setting
and must not convert segments, change review states, or otherwise mutate segment
data. Extension-owned records hidden by Editor mode remain intact and reappear
when Review mode is selected.

A logical segment has exactly one active canonical representation at a time:
either a row in Cove's native `segments` table or canonical fields owned by
Segment Studio. It is never simultaneously native and extension-owned.

## Core Semantics and Data Model

### Publication and review

- Publication and review disposition are separate axes. Native presence means
  **published** and is presented as implicitly approved, but no native review
  state is stored.
- Extension ownership means **unpublished draft**. Extension-owned segments
  carry `unreviewed`, `approved`, or `rejected`; `approved` means ready to publish
  when the review completes, not already native.
- Approval does not assert that optional extension metadata, such as performer
  slots, is complete.
- Review disposition and metadata completeness are independent. Required slot
  validation may warn or block review completion without changing approval.
- Existing native segments are accepted as published. Users who want to review
  them must invoke the explicit reset operation described below.

### Stable Segment Studio identity

Introduce a stable extension-owned Segment Studio item that acts as a metadata
anchor and, when unpublished, stores the segment's canonical representation.
Conceptually it contains:

```text
SegmentStudioItem
  Id
  NativeSegmentId?               Non-null means Native; null means ExtensionOwned
  ReviewState?                   Required only for ExtensionOwned
  HostType / HostId?             Canonical fields, present only when ExtensionOwned
  StartSec / EndSec?
  TagId / Kind / RefId?
  Payload / SourceKey / SourceRunId?
  Confidence / Title / ColorHint?
  ExtensionImageBlobId?
  Revision
  CreatedAt / UpdatedAt
```

The representation is derived from `NativeSegmentId`, not stored as a separate
discriminator that could drift. A versioned database constraint and service
validation enforce exactly one representation:

- a native-backed item has one unique `NativeSegmentId`, no active extension
  canonical fields, and no stored review state;
- an extension-owned item has no `NativeSegmentId`, requires video, tag, timing,
  kind, source, and representation-version fields, and has `unreviewed`,
  `approved`, or `rejected` state;
- a native segment with no Segment Studio metadata need not have an item until
  it gains extension metadata or crosses the ownership boundary.

The item is not a shadow copy of a native segment. While native-backed, Cove is
the sole authority for canonical fields. Performer slots, derivations, workflow
history, and other extension mechanics reference the stable item ID rather than
a native segment ID, so they survive ownership transitions.

The unique native foreign key cascades deletion of the item and its slots when a
native segment is deleted outside Segment Studio. Such deletion is permanent.
Segment Studio conversions first populate the owned fields and clear the native
foreign key in their transaction before deleting the tracked native entity, so
the cascade does not destroy metadata being transferred.

### Images and blobs

An extension-owned segment owns its image blob reference. Ownership transitions
transfer the reference rather than maintaining two copies:

- native to extension-owned: persist the extension item and its blob reference,
  clear the native reference, then delete the native segment;
- extension-owned to native: create the native segment with the blob reference,
  clear the extension reference, then retire the extension representation;
- permanent purge: commit deletion of the extension item together with a durable
  blob-cleanup outbox entry, then delete the physical blob idempotently.

Ownership transitions reuse the same blob ID and atomically move only its
database reference. They must not call Cove's current segment-delete endpoint,
which deletes the blob before the segment row. The extension transition removes
the tracked native entity through its own transaction so Cove's normal
engagement cleanup still runs. Purge and cascade deletion use the durable outbox;
an already-missing blob is an idempotent cleanup success, while a storage failure
leaves a retryable job rather than a live item with a missing image.

Because Cove may delete a video without loading extension rows, the extension
migration installs a PostgreSQL `BEFORE DELETE` trigger on Segment Studio items.
Whenever an extension-owned item with a blob is deleted directly or by video
cascade, the trigger inserts that blob ID into the cleanup outbox. Native-backed
items have no extension blob reference, and ownership transitions clear the
extension reference before retiring owned fields, so the trigger cannot delete a
blob transferred to a native segment.

## User Workflows

### Editor mode

The main editor queries and edits native segments only. It supports:

- direct timing and tag edits using native permissions and optimistic
  concurrency;
- **Move to bin**, which converts a native segment into an extension-owned
  segment with `rejected` state;
- a recycling-bin view, implemented as a query for rejected extension-owned
  segments rather than as a separate table;
- **Restore**, which materializes the item as a new native segment and removes it
  from the recycling-bin result;
- permanent purge and optional training-data export.

Editor mode deliberately omits approve, reject, and unreview controls; review
counts and filters; performer slots; review completion; and extension-owned
working segments. A video cannot be "review complete" in this mode.

Restoration recreates segment content and Segment Studio-owned metadata with a
new native ID. It does not restore bookmarks, ratings, playback history, static
group membership, field-provenance rows keyed to the old ID, deep links, or data
owned by other extensions. Confirmation and help text must state this. A small
operation receipt may retain the original and replacement IDs for retries and
diagnostics, but the rejected extension representation need not remain in the
bin after a successful restore.

Restore changes the same stable item from extension-owned to native-backed; it
does not delete the metadata anchor when slots or history remain. "Removed from
the bin" means the item now points at its new native segment and no longer has
owned canonical fields. Metadata-free anchors may be pruned only by a separate,
explicit retention policy.

Training export first captures an immutable, versioned export payload and a
durable job-owned reference to any required blob. Restore may proceed after that
capture succeeds. Purge blocks while capture is pending or requires explicit
cancellation; physical blob cleanup waits until neither a segment nor an export
job owns the blob.

### Review mode

The editor presents one union:

- every eligible native segment, interpreted as approved/published;
- every eligible extension-owned segment with its stored review state.

Native segments can receive extension-owned slot data without moving out of the
native table. Missing slot information does not make them unreviewed. Review
filters map all native segments to `approved`; `unreviewed` and `rejected`
contain extension-owned items, and `approved` also contains approved unpublished
drafts. The UI distinguishes **Approved draft** from **Published** where storage
state matters.

For an extension-owned draft, approving, rejecting, and unreviewing change only
its disposition. Approving a native item is a no-op because it is already
published. Rejecting a native item performs native-to-extension conversion with
`rejected`; unreviewing a native item performs the same conversion with
`unreviewed` and is the single-item form of reset. Both destructive transitions
show the native-ID relationship warning.

Changing approval-relevant canonical fields on an approved draft—including
timing, tag/kind, payload, source identity, and review-significant presentation
fields—atomically returns it to `unreviewed`. Slot assignments and other
metadata-completeness edits do not reset approval. A frozen completion plan
conflicts rather than publishing a draft changed after approval.

Completing a review:

- is initially scoped to one video and rejects completion when any eligible
  extension item for that video remains unreviewed;
- validates required metadata separately and reports blocking versus advisory
  completeness issues for both native and extension-owned items;
- freezes the set of approved drafts, materializes each as native, and leaves
  rejected items extension-owned;
- captures the video candidate-set revision, all relevant item revisions, and
  the slot-definition revision in a durable completion plan;
- records completion only after every frozen approved draft has been published;
  partial batches remain resumable and never claim that the review completed;
- advances its expected state through per-item receipts as its own items are
  materialized, using the stable item ID across the residence/native-ID change;
- becomes stale when an external change affects a frozen, unapplied item or adds
  or removes an in-scope logical item, rather than silently publishing a
  different set. Items already published by the plan are never rolled back; a
  replacement plan adopts their published state.

After completion, the video returns to `NeedsReview` when an eligible logical
item is added or removed; an eligible segment's canonical fields or disposition
change; required slot assignments change; or relevant slot definitions change.
Invalidation does not dematerialize or unpublish any native segment; it only
retires the completion receipt and requires a new review summary.

Undoing rejection in Review mode returns the extension item to `unreviewed`.
Restoring from the Editor-mode bin instead materializes it as native. This is an
intentional UI-mode difference over the same stored rejected item.

### Ownership transitions

Permissions are action-specific and always include video visibility: native and
extension-owned edits, draft disposition changes, completion publication, and
Editor restoration require segment write; native rejection/unreview, Move to
bin, reset, and permanent purge require segment delete. Preview and bulk result
counts include authorized videos only. Mutation endpoints enforce these rules
independently of the selected UI mode.

Each transition follows the same durable pattern:

1. Validate authorization, references, field invariants, and expected revision.
2. Lock or conditionally update the source item.
3. Create the destination representation and transfer the image reference.
4. Move or retain extension metadata through the stable item ID.
5. Remove the source representation only after the destination is durable.
6. Commit a required idempotent operation receipt with the transition result in
   the same database transaction.
7. Invalidate affected video spans and refresh union counts.

Every transition, purge, reset batch, and completion receipt is keyed by
operation ID, operation kind, actor, and a request fingerprint and stores any
terminal native/item IDs. Retrying the same request returns the recorded result;
reusing an operation ID with different parameters is a conflict. Source rows are
locked or conditionally updated by revision. Concurrent edits return a conflict
without overwriting newer state. Native deletion uses tracked removal rather
than bulk deletion so Cove cleanup still runs. Video deletion permanently
cascades its owned items and queues their blobs for cleanup. Tag deletion is
restricted until owned items are retagged or purged; missing-image repair leaves
the extension item recoverable.

Transition validation treats a null image as valid. If a non-null blob ID cannot
be read, native-to-extension conversion, reset, legacy normalization,
materialization, and restoration all stop before removing the source and offer a
repair-or-explicitly-discard-image choice. No transition silently preserves a
known-broken non-null reference.

### Explicit reset into review

Mode switching never resets existing data. Review mode instead offers a
separate, deliberately dangerous **Convert published segments to review
candidates** operation. It converts selected native segments into
extension-owned `unreviewed` items using the normal ownership transition.

The operation may be library-wide or support a narrower selection, such as
specific videos or videos containing a selected performer. Further scopes can
be added without changing the conversion model and do not need to be enumerated
in the initial implementation.

Before applying, the extension shows an exact-at-preview-time affected count and
representative summary, explains native-ID relationship loss, and requires
explicit typed confirmation. It freezes the authorized native IDs and their
`UpdatedAt` values into a durable operation plan. Apply never picks up newly
matching rows, skips rows changed or deleted since preview, operates in bounded
resumable batches, and reports converted, changed, failed, and remaining counts.
Re-running the same operation does not duplicate items or reset work already
performed.

Only persisted raw segment kinds Segment Studio can faithfully represent are
eligible. Derived profile spans are never converted.

## Filtering, Metadata, and Host Integration

- Review-mode filters operate over the normalized union and must filter before
  counts and pagination. Editor-mode filters use native segments only, except
  for the separate rejected-items bin query.
- Saved Review-mode filters and hidden UI state are preserved when switching to
  Editor mode; Editor mode neither executes nor deletes them.
- The mode preference is per user/browser and stored with the existing local UI
  preferences; it is not segment data or an authorization boundary. Editor mode
  shows a non-destructive count/notice when unpublished items are hidden so the
  user cannot mistake them for data loss.
- Performer slots and other extension mechanics remain in extension-owned tables
  keyed by stable Segment Studio item ID. Cove's native segment schema remains
  unaware of them.
- Slot definitions are tag-specific. A tag change made through Segment Studio
  atomically remaps assignments whose labels and gender hints are compatible
  and clears assignments that cannot be safely carried into the new slot
  definitions. Gender hints remain advisory for subsequent manual assignment.
  A tag changed externally is detected on read; assignments from the wrong
  definition set are excluded from completeness, filtering, and grouping and
  surfaced for repair.
- Segment Studio owns filtering, exact counts, ordering, and pagination over its
  native/extension union. Generic Cove extension predicates and grouping facets
  described in `extension-owned-segment-semantics-plan.md` apply only to native
  segments and their extension sidecars; unpublished or rejected extension-owned
  items never enter Cove resolved spans before materialization.
- Extension-owned query results must respect the same video visibility and
  segment permissions as their equivalent native segments.
- Rejected items retain enough source identity for diagnostics and export, but
  this plan does not add a global producer-suppression contract. A producer rerun
  may create an implicitly approved native duplicate beside a rejected item.
  Source key, run, reference identity, original native ID, and representation
  schema version are retained so future tombstone matching remains possible;
  automatic cross-system matching is deferred.

Owned-item relationships have explicit deletion behavior: deleting the owning
video cascades the item and uses the database-backed outbox hook to queue its
blob for cleanup; referenced tags and performers use restrictive foreign keys so
they must be retagged, unassigned, or purged before deletion. No path leaves
dangling assignments or silently changes completeness.

## Upgrade and Compatibility

The current Segment Studio release stores review state in the native segment's
`segmentStudio` payload namespace and keys performer slots directly by native
segment ID. Installing the schema must not automatically delete or convert those
native rows. Schema migration only creates the new tables and a compatibility
projection; the existing compatibility UI remains available, while the new mode
UI is gated until an administrator completes the previewed normalization
operation.

Normalization uses the same frozen-plan, confirmation, batching, concurrency,
and receipt machinery as reset:

- create stable items for slot-bearing native segments and repoint assignments
  to the stable item ID before changing their representation;
- keep payload-approved segments native, then remove the obsolete owned review
  marker only after their stable metadata migration is verified;
- convert payload-rejected native segments to rejected extension-owned items
  only after explicit confirmation, preserving canonical fields and image
  references before native deletion;
- treat native segments without a stored decision as published; users who want
  them reviewed invoke reset;
- preserve historical workspace source/result mappings and marker provenance as
  documented archival data; they remain outside the runtime model until a
  separately approved import or cleanup operation.

Until normalization succeeds, the compatibility adapter preserves the legacy
payload decision rather than silently treating a payload-rejected native segment
as approved. Failed or changed rows remain native, retain their payload, and are
reported for retry. The operation is idempotent and never strips the last usable
decision or deletes a native segment whose fields or blob were not transferred.

## Deliberate Boundaries and Future Path

The initial restore guarantee is content-complete for the native segment and
Segment Studio metadata, not relationship-complete for Cove. Users are expected
to understand that deletion is intentional; documentation and confirmation are
preferred over a generic relationship-restoration apparatus.

To leave a future path open without implementing it now:

- retain the original native ID in transition history;
- version the extension-owned canonical representation and preserve unknown
  payload fields;
- centralize conversion in one service rather than duplicating it across UI
  endpoints;
- allow a future optional, versioned logical relationship snapshot to be added;
- prefer future old-to-new ID remapping over depending on reuse of a deleted
  database identity.

The initial release does not add a Cove-wide recycling bin, generic relational
archive service, native approval fields, global producer tombstones, or automatic
conversion merely because Review mode is selected.

## Implementation Slices

Deliver vertical, reviewable slices in the following order. Incomplete workflows
remain hidden rather than exposing controls backed by only part of a transition.
Each slice begins with focused failing tests and finishes with the relevant user
guide flow working end to end.

### Slice 1: Compatibility-safe segment identity

- Add the constrained stable item, extension-owned canonical fields, generic
  operation receipts, and blob-cleanup outbox/trigger.
- Rekey slot assignments to the stable item while leaving their existing native
  segments authoritative.
- Add the legacy payload compatibility adapter, but perform no destructive data
  normalization and expose no new conversion controls yet.
- Prove the residence XOR constraint, cascade policy, permission boundary, and
  read compatibility with current Segment Studio installations.

### Slice 2: Editor mode and recycling bin

- Add the shared native-to-extension and extension-to-native transition service,
  including tracked native deletion, concurrency, idempotency, blob transfer,
  cache invalidation, and missing-reference recovery.
- Ship Editor mode's direct timing/tag editing, Move to bin, bin list, restore,
  and permanent purge as one complete workflow.
- Add the browser-local mode selector, while keeping Review mode unavailable
  until its union is complete.
- Fresh and already-normalized installations may use the slice; upgraded legacy
  installations remain on the compatibility UI until Slice 7 normalization.
- Verify the guide's edit, delete, restore, conflict, relationship-warning, and
  purge scenarios in the installed UI.

### Slice 3: Review union and draft authoring

- Add extension-owned draft creation, timing/tag editing, splitting, and
  duplication plus the authorized native and extension union query. Splitting
  keeps the original stable item for the first range. Manually created segments,
  both split ranges, and duplicates are approved immediately.
- Implement review-state filtering, exact counts, ordering, pagination, saved
  filter persistence, and the hidden-work notice used by Editor mode.
- Present native segments as published/implicitly approved and drafts as
  unpublished without yet exposing completion.
- Verify that switching modes changes only UI preference and that neither side
  duplicates or hides eligible data unexpectedly.

### Slice 4: Performer slots and completeness

- Expose slot definition and assignment editing through the stable item for both
  native and extension-owned representations.
- Add automatic incompatible-assignment cleanup on tag changes,
  stale-assignment repair, performer/tag deletion constraints, and separate
  blocking/advisory completeness results.
- Add Review-mode slot filters and grouping within Segment Studio's union.
- Extend split and duplicate so compatible slot assignments are copied to each
  new item; retagging retains only assignments compatible with the new slot
  definitions.
- Verify slots survive every ownership transition and never make publication
  state masquerade as metadata completeness.

### Slice 5: Review decisions and completion

- Add draft approve/reject/unreview and native reject/unreview behavior, including
  approval invalidation after review-significant draft edits.
- Add revision-bound per-video completion planning, resumable publication of the
  frozen approved set, per-item receipts, and the defined completed-state
  invalidation triggers.
- Enable Review mode as a complete workflow for fresh/already-normalized
  installations only when these paths are available; legacy upgrades remain on
  the compatibility UI through Slice 7.
- Verify partial failure, lost responses, concurrent edits, retry, and the full
  create-to-publish tutorial.

### Slice 6: Export and destructive lifecycle hardening

- Add immutable training-export capture, job-owned blob references, export retry,
  and restore/purge coordination.
- Add uninstall/disable warnings for unpublished or rejected data and operational
  visibility for failed blob cleanup.
- Verify export-versus-restore/purge races, cascade cleanup, missing blobs, and
  permanent deletion in the installed extension.

### Slice 7: Reset and legacy normalization

- Add frozen preview plans, typed confirmation, bounded resumable batches, and a
  small initial set of reset scopes.
- Reuse that machinery for the explicit legacy normalization gate: verify the
  non-destructive Slice 1 slot rekey and repair only unresolved rows, keep
  accepted native segments published, and convert legacy rejected payload rows
  without automatic deletion during schema migration.
- Verify exact-at-preview counts, changed/deleted skips, cancellation, resume,
  partial normalization, and recovery receipts before retiring compatibility
  behavior.
- Enable Editor and Review modes for upgraded installations only after their
  normalization plan has no unresolved rows.

### Slice 8: Native Cove profile semantics

- Implement the generic native-segment predicates and grouping facets described
  in `extension-owned-segment-semantics-plan.md` without exposing unpublished
  extension items to Cove span resolution.
- Verify native sidecar slot/review semantics in Cove profiles, resolved spans,
  counts, pagination, saved filters, cache keys, and provider-unavailable states.
- Keep this slice independently shippable from Segment Studio's own union and
  review workflow.

## Acceptance Criteria

- Switching Editor and Review modes changes no segment, review, slot, or blob
  data.
- A logical segment never has simultaneous native and extension-owned canonical
  representations, including during retries and recovery.
- Database constraints reject native-backed items with owned canonical/state
  fields and owned items missing their required canonical/state fields.
- Editor mode shows and edits native segments only; its bin is exactly the
  rejected extension-owned set.
- Review mode maps every native segment to approved and preserves explicit state
  for extension-owned segments.
- Approval remains independent from slot completeness.
- Timing and tag edits to native segments do not create or modify review state.
- Native rejection/unreview converts the item to extension-owned rejected or
  unreviewed state; native approval is a no-op. Canonical edits to an approved
  draft return it to unreviewed, while slot-completeness edits do not.
- Segment Studio tag edits clear or explicitly remap incompatible slots;
  externally stale slot assignments are excluded and reported for repair.
- Native-to-extension conversion preserves every supported canonical field,
  unknown payload data, Segment Studio metadata, and the image blob before
  deleting the native row.
- Approving an extension-owned segment retains it as an approved draft;
  restoring or completion materialization creates an equivalent native segment,
  preserves the stable item and Segment Studio metadata, transfers the image,
  and retires the extension-owned canonical representation.
- Lost responses and repeated operation IDs cannot duplicate, delete, or
  rematerialize a segment twice.
- Concurrency conflicts leave the source representation untouched and return the
  current visible revision.
- Restore and reset warnings accurately state that native-ID relationships are
  not preserved.
- Purge commits item deletion and blob-cleanup work before physical deletion;
  retries remove the extension blob without affecting an unrelated native
  segment or leaving a live item with a missing image.
- Direct/core video deletion triggers durable cleanup for extension-owned blobs;
  a missing non-null blob blocks ownership transitions until repaired or
  explicitly discarded.
- Slot assignments survive reset, rejection, restoration, and materialization by
  remaining attached to the stable item ID.
- Completion blocks on unreviewed items, retains rejected items, reports
  metadata-completeness failures separately, materializes the frozen approved
  draft set, and records success only after every item in the revision-bound
  plan is published.
- Completion resumes after partial publication using stable item receipts,
  tolerates its own residence changes, rejects external changes to unapplied
  items, and never rolls back items already published.
- Reset previews match the applied scope, skips changed items, resumes safely,
  and never converts derived spans.
- Legacy approved, rejected, undecided, and slot-bearing native segments are
  normalized without silent data or blob loss.
- Permissions and video visibility are enforced identically for native and
  extension-owned representations.
- Segment Studio union counts, pagination, and saved filters remain correct
  across both representations; Cove predicates, resolved spans, and related
  caches include native-backed items only.
- External native deletion, external tag edits, video/tag/performer deletion,
  missing blobs, and producer-created duplicates follow the documented behavior.
- Failure injection before and after database commit, outbox processing, cache
  invalidation, cancellation, and a lost HTTP response cannot lose or duplicate
  a segment.
- Export capture racing restore or purge retains its immutable payload/blob until
  the export completes or is explicitly cancelled, and retries do not duplicate
  exports.
- Mode switching produces identical segment/item/slot/blob checksums, aside from
  its browser-local preference.

## Assumptions

- Segment Studio initially supports ordinary persisted video tag segments that
  it can round-trip without loss.
- Existing native segments are intentionally treated as accepted/published.
- Native IDs may change across ownership transitions and external ID-based
  relationships are not restored in the initial implementation.
- Mode is a user-interface preference, not an authorization boundary or storage
  setting.
- Extension-owned data and blobs remain available when hidden by Editor mode;
  uninstall and permanent purge require explicit warnings when unpublished or
  rejected items remain.

## Keyboard-first editor parity backlog

Stash Marker Studio is the source of truth for Segment Studio's default key
assignments and shortcut behavior, including toggle behavior and whether an
operation applies to one segment or every matching segment in the current
video. Segment Studio only diverges when Cove cannot support the same operation;
such exceptions must be documented instead of receiving a misleading binding.
The work is intentionally split into independently testable commits. A checked
item means the behavior, tests, installed-extension verification, and user-guide
entry have all landed.

- [x] Move performer-slot assignment into a dialog. Keep slot completeness
  visible on the selected segment and timeline; use gender hints to rank the
  likely assignments when the dialog opens.
- [x] Let pointer selection on the timeline and segment rail seek without
  starting playback. Keep arrow, unreviewed, playhead-relative, and touching-
  playhead keyboard navigation selection-only; `Enter` is the explicit "play
  from selected segment" action.
- [x] Make segment groups/swimlanes collapsible without changing selection or
  segment data, and retain the collapsed set for the current browser.
- [x] Add a single shortcut registry and in-editor shortcut reference dialog so
  the implemented key map cannot drift from the displayed help.
- [x] Adopt review toggles: `Z` approves an unreviewed/rejected segment and
  returns an already-approved segment to unreviewed; `X` rejects an
  unreviewed/approved segment and returns an already-rejected segment to
  unreviewed. These are Review-mode operations; Editor mode continues to use
  its recycling-bin command explicitly.
- [x] Bind `Shift+X` to confirmation for permanent deletion of all rejected
  segments in the current video, matching Stash Marker Studio's bulk scope.
- [x] Bind `G` to the existing performer-slot assignment dialog in Review mode.
- [x] Bind `B` to collapse or expand the Segment group containing the selected
  segment.
- [x] Revisit Stash Marker Studio's collapsed-group selection trap: after a
  selected marker's group is collapsed, the group cannot currently be selected
  or expanded there. Preserve a keyboard-accessible expansion path and decide
  whether the upstream interaction should also be corrected.
- [x] Rename the editor's "marker rail" to "segment rail" throughout the user
  interface and documentation.
- [x] Organize the segment rail with the same Segment groups, group/tag ordering,
  and group presentation used by the swimlanes instead of showing one flat
  segment list.
- [x] Adopt unreviewed navigation: `N`/`M` within the selected swimlane and
  `Shift+N`/`Shift+M` across swimlanes, with no wraparound. Keep arrow-key
  navigation within/across swimlanes and `Tab`/`Shift+Tab` selection at the
  playhead.
- [x] Adopt timeline navigation: `H` center, `+`/`=` zoom in, `-`/`_` zoom out,
  `0` fit, and platform modifier plus `ArrowUp`/`ArrowDown` resize the swimlane
  area.
- [x] Adopt playback controls: `Space`/`K` toggle playback; `J`/`L` seek by the
  small interval; `Ctrl+Shift+J`/`Ctrl+Shift+L` seek by the long interval; and
  `Enter` plays from the selected segment. Add configurable small, medium, and
  long seek values before exposing currently unbound medium-seek actions.
- [x] Adopt frame stepping: `,`/`.` small, `Shift+,`/`Shift+.` (or `;`/`:`)
  medium, and `Ctrl+Shift+;`/`Ctrl+Shift+:` long. Use the video's frame rate when
  Cove exposes it and a documented 30 fps fallback otherwise; stepping pauses
  playback. Browsers report `Shift+;` as `:`, so `Ctrl+;` is also a functional
  long-backward binding while the Stash-compatible label remains registered.
- [x] Adopt boundary jumps: `I`/`O` selected-segment start/end and
  `Shift+I`/`Shift+O` video start/end.
- [x] Adopt `Y`/`U` previous/next shot navigation using Segment Studio-owned
  shot ranges.
- [x] Adopt timing/tag editing: `Q` opens tag editing, `W`/`E` set start/end to
  the playhead, and `T`/`Shift+T` copy/paste timing with normal validation and
  undo support.
- [x] Adopt regular segment creation and structural editing: `A` creates a
  segment, `D` duplicates it, and `S` splits it at the playhead. Review mode
  creates extension-owned drafts; Editor mode creates native Cove segments. The
  `Shift+D` variant duplicates at the playhead while retaining the source
  duration. Manually created segments and both split ranges start approved.
- [x] Define and implement first-class extension-owned shot ranges, then adopt
  `Shift+A` create boundary, `V` split video-cut range, and `Shift+V` remove a
  boundary and merge the adjacent ranges. Do not emulate these with ordinary
  activity tags because that would make the shortcut appear to work while
  corrupting segment meaning.
- [x] Adopt range merging: `R` selects the merge source and `Shift+R` expands
  the selected target to cover both time ranges, subject to normal timing,
  concurrency, and review-state rules.
- [x] Adopt AI-feedback controls: `C` toggles incorrect-example collection and
  rejection; `Shift+C` opens the collection/export dialog. Reuse Segment
  Studio-owned image blobs and immutable training-export capture rather than
  browser-only marker storage.
- [x] Adopt `Escape` cancellation and `Enter`/`Escape` modal priority for every
  new editor mode/dialog.
- [x] Add browser-local shortcut customization, conflict detection, reset to
  Stash Marker Studio defaults, and import/export after the default map is
  complete.

Segment Studio supplies extension-owned equivalents where Cove has no native
model, including shot ranges and durable incorrect-example collections. The
default key map is now covered; future parity work should start from a fresh
comparison with the current Stash Marker Studio registry.

## Consolidated product backlog

This backlog collects the remaining product work around the editor/review plan.
Items should be promoted into implementation slices, acceptance criteria, and
the user guide when their interaction and storage contracts are settled. The
provenance/derivation and extension-owned segment semantics plans remain the
detailed design sources for their respective work; they should be delivered
through this roadmap rather than treated as independent user experiences.

### Multi-select

- [x] Support additive segment selection with `Cmd/Ctrl+click` in both the
  swimlane timeline and segment list.
- [x] Support contiguous range selection with `Shift+click` between the active
  segment and another segment in the same swimlane timeline. Allow
  `Cmd/Ctrl+Shift+click` to add that range to the existing selection. Preserve
  earlier selections when `Cmd/Ctrl+click` establishes a new range anchor and
  a later `Shift+click` extends it in the same or another swimlane.
- [x] Summarize multi-selections in the detail pane using the timeline's Segment
  group and performer-sublane hierarchy. Keep selected swimlanes collapsed by
  default with review-state counts, and let choosing an expanded segment return
  to its single-segment editor.
- [x] Add an action to select every segment across all swimlanes.
- [x] Add an action to select every segment in one swimlane. Allow
  `Cmd/Ctrl+click` on additional swimlanes to add or remove their segments so a
  selection can span multiple swimlanes.
- [x] Add bulk approve, reject, and return-to-unreviewed actions with the same
  native-versus-draft semantics, permissions, concurrency checks, and operation
  receipts as the corresponding single-segment actions.
- [x] Add bulk performer-slot assignment only for selections whose segment tags
  expose compatible slot definitions. The preview must identify incompatible
  segments and either exclude them explicitly or block the operation; it must
  never silently apply a performer to a different slot meaning.
- [x] Define selection behavior for collapsed or filtered swimlanes, mode
  changes, video changes, deleted segments, and partially failed bulk actions.

### Undo history

- [x] Replace the single opaque Undo command with a menu that lists the actions
  available to undo in human-readable form, with the most recent action first.
- [x] Let the user choose an entry from the menu and clearly show the dependent
  actions that will also be reversed when undoing an older entry.
- [x] Clear the video's undo history after a review is successfully completed.
  A failed or resumable completion must retain the history until completion is
  recorded.
- [x] Define how undo history interacts with bulk actions, ownership
  transitions, lineage-component operations, concurrency conflicts, and
  permanent operations that cannot be undone.

### Keyboard shortcut discoverability

- [x] Add the missing `1`–`9` bindings to the generated Keyboard shortcuts
  reference. They seek to 10%, 20%, and so on through 90% of the video duration.
- [x] Add registry, handler, and dialog tests proving the displayed bindings and
  actual percentage-seek behavior cannot drift.
- [x] Compact Keyboard bindings settings so each action, its shortcut, and its
  individual Reset control share one row. Remove the nested scrollable
  container and render the complete binding list in the normal settings-page
  flow, relying on whole-page scrolling.
- [x] Keep performer-slot definitions in the in-editor workflow and make
  Organization settings exclusively about Segment groups. Use full-width,
  drag-first group cards for group and tag ordering, with group-local tag
  pickers opened on demand. Do not render a global tag finder or legacy tag
  terminology in Organization.
- [ ] Keep each performer-slot mapping on one row in the derived-rule editor.
  Replace the textual **Remove** action with an accessible trash-icon button.

### Future editor polish

- [x] Auto-assign eligible performer slots when creating a new segment or
  duplicate, and after retagging clears incompatible copied assignments. Fill
  slots only when the video performers and gender hints produce one unique
  assignment; leave ambiguous slots empty.
- [x] When navigating between swimlanes with the Up/Down arrow keys, select
  the segment in the destination swimlane closest to the playhead rather than
  the first segment in swimlane order. Prefer segments containing the
  playhead; if several contain it, select the longest one. Up/Down and Tab
  navigation must consider only segments passing the current filters and
  belonging to expanded segment groups.
- [x] Add a keyboard-opened segment quick search with fuzzy tag matching,
  compact segment-rail-style results, `ArrowUp`/`ArrowDown` navigation, and
  `Enter` selection, opened with `F`. While the Segment Studio editor context
  is active, capture `F` and suppress the video player's existing
  fullscreen shortcut; retain fullscreen behavior outside the editor context.
- [x] After duplicating a segment, select only the newly created duplicate
  instead of leaving both the source segment and duplicate selected.
- [x] Disable duplicate and every other single-segment mutation while multiple
  segments are selected. Keep only explicitly bulk-safe actions available
  until the selection is reduced to one segment.
- [ ] When a newly created or duplicated segment is still in its initial tag
  selection control, pressing Escape should cancel creation by immediately
  deleting that new segment. Escape while retagging an existing segment must
  remain non-destructive.
- [x] Design a stronger visual emphasis for the active segment so it remains
  easy to locate among dense swimlanes and rail results. Preserve distinct
  approval-state, performer-completeness, and multi-selection signals.
- [x] Keep the playhead visible when it reaches the exact end of the video by
  reserving a small right-side margin in the timeline viewport.
- [x] Align boundary jumps with the segment's exact temporal edges. Pressing
  `I` must place the playhead center line exactly on the selected segment's
  start (left temporal edge), not on the outer edge of its selection or
  highlight aura. Keep `O` symmetric at the exact end (right temporal edge),
  and cover both alignments with regression tests that treat decorative
  outlines, glows, and selection effects as visually outside the time geometry.
- [x] When a segment group is collapsed, show aggregate approval-state counts
  for all swimlanes contained by that group.
- [x] Use stronger and weaker saturation in swimlane and segment-group
  approval summaries to indicate whether each approval state is present.
  Keep the numeric counts and accessible labels so color is not the only
  indication.
- [x] When a duplicated segment is reassigned to a tag whose performer-slot
  gender hints are incompatible with the copied performer assignments, clear
  those copied assignments instead of carrying them into the new slot shape.
- [x] Preserve a segment's approval state when splitting it.
- [x] Preserve a segment's approval state when changing its tag.
- [x] Preserve the user's newer segment focus when an approval-state mutation
  finishes. Moving to another segment while approval is saving must not return
  focus to the segment whose approval state changed.
- [x] Do not show the yellow missing-performer-slot border on rejected
  segments. Rejected segments should use only their normal red rejection
  styling because they are already on their way out of the workflow.
- [ ] When rejecting a segment with derived descendants, also reject each
  downstream segment whose materializing source paths are all rejected. Keep a
  downstream segment active when at least one other non-rejected segment still
  materializes it. Make this graph-aware transition atomic so subsequent
  rejected-segment deletion does not fail with a full-component-deletion
  requirement for descendants that should already be rejected.
- [x] Let `Cmd/Ctrl+click` on a swimlane title select every segment in that
  swimlane, and let `Cmd/Ctrl+click` on a segment-group title select every
  segment in that group.
- [x] Remove the **Create approved segment** action from the menu.
- [x] Replace merge confirmation prompts with native Cove dialogs. Let users
  skip future merge confirmations from the dialog, and provide a Segment Studio
  setting that restores the confirmation when needed.
- [x] Style **Auto-assign performers** consistently with the segment rail.
- [x] Keep the **Auto-materialize** dialog within the viewport and make all of
  its controls reachable when its content is taller than the available window.
- [x] After rejecting and deleting segments, select the first unapproved
  segment in the first affected swimlane. If that swimlane has none, continue
  through lower swimlanes until an unapproved segment is found.

### Segment cards and filtering

- [x] Simplify cards on the Segment Studio **Segments** page so they do not
  overemphasize approval state or repeat the time span. Reuse normal segment
  styling where applicable, and match the editor's compact approval-state and
  performer-avatar treatment.
- [x] Use the compact, video-style card interface exclusively for the Segment
  Studio **Segments** page; do not expose the interim dense review list.
- [x] Use Cove's tag autocomplete for the **Tag** filter instead of exposing
  separate activity search and selection controls or referring to tags as
  activities in this interface.
- [x] Support composable tag and performer-slot filtering. Provide both a
  **Performer (any slot)** autocomplete and tag-specific slot filters so users
  can search without knowing a slot's identity or narrow to a particular
  semantic role when needed.
- [x] Make the any-slot performer predicate independent of slot definition and
  visible label. It must match unnamed slots and distinct slots with overlapping
  labels while preserving stable definition-ID semantics for slot-specific
  filters.
- [x] Keep the selected-segment preview compact and centered, allow users to
  close it explicitly, and return keyboard focus to the originating card after
  dismissal.
- [ ] Extend the card data source to preserve native/draft union semantics and
  rejected-item actions without reintroducing the list interface. Preserve exact
  counts, ordering, pagination, saved filters, and authorization.

### Basic mode

- [ ] Implement Basic mode as a stripped-back presentation of the existing
  editor. Basic and Full modes must share the same editor components, state,
  commands, and mutation paths; do not fork or duplicate the editor
  implementation.
- [ ] Define the controls, metadata, filters, and shortcuts hidden by Basic mode
  and how users enter and leave it.
- [ ] In Basic mode, omit Segment Studio's **Segments** tab and its
  extension-owned segment browse view. Users browse segments through Cove's
  native **Segments** view and open the shared Segment Studio editor only when
  they need to edit a video.
- [ ] Keep Basic mode presentation-only: switching it must not mutate segments,
  review state, performer slots, provenance, lineage, or undo history.
- [ ] Ensure every action available in Basic mode retains the same permissions,
  validation, concurrency, and completion semantics as the full interface.

### Companion plan integration

- [x] Deliver provenance display, lineage-aware editing/deletion, derivation
  rules, integrity scanning and repair, legacy provenance/lineage migration, and
  Cove AI provenance ingestion from
  `segment-provenance-and-derivation-plan.md`.
- [x] Deliver Segment Studio-owned performer-slot definitions, assignments,
  editor grouping, and activity/slot filtering in Segment Studio's Segments
  browse view.
- [x] Land Cove's generic executable extension-predicate foundation, including
  provider lifecycle, validation, authorization context, bounded execution, and
  list-filter UI plumbing.
- [x] Sequence the delivered migrations so stable Segment Studio item identity
  precedes performer slots, provenance, derivation, migration receipts, and
  external filtering dependencies.
