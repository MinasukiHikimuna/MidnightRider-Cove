# Segment Studio-Owned Audio Segments Plan

## Status

Planned for Segment Studio 1.1. This plan intentionally does not require Cove
to add native audio-segment CRUD, library, grouping, or playback support.

## Decision summary

Segment Studio will prove audio-segment behavior using extension-owned data:

- an audio segment's durable identity is a `SegmentStudioItem.Id`;
- its host is a Cove `Audio` entity, while its timing, tag, and lifecycle live
  in Segment Studio;
- Segment Studio owns discovery, editing, deep links, inventory, and clipped
  playback for those items;
- Segment Studio does not create a Cove `Segment` row for audio in the initial
  release;
- native Cove publication is a later, explicit storage transition if Cove
  gains complete audio-segment support.

This keeps audio useful even while Cove's segment APIs and segment library are
video-oriented. It also creates a working reference implementation from which
the required native contracts can be designed.

## Release boundary

Segment Studio 1.0 remains video-only. No pre-1.0 schema or behavior change is
required for this plan.

Segment Studio 1.1 should target a focused audio editor:

- audio discovery;
- audio playback and seeking;
- a time-based editor and tag lanes;
- create, update, duplicate, split, merge, trash, restore, and purge;
- an extension-owned audio-segment inventory;
- stable links that open and play an item in Segment Studio.

The first audio release does not include shot boundaries, frame stepping,
screenshots, visual AI analysis, image-based incorrect examples, or visual
training exports.

## Product and ownership model

Three concepts must remain independent:

1. **Media host** identifies what is being annotated: video or audio.
2. **Storage owner** identifies where the segment representation lives: Cove
   or Segment Studio.
3. **Feature profile** identifies which workflows are enabled: Basic, Full,
   and host-specific capabilities.

An extension-owned item is not automatically a draft and does not
automatically participate in review, lineage, analysis, or performer-slot
workflows. In particular, audio in 1.1 is extension-owned because Cove lacks
the required host support, not because the audio item is awaiting approval.

The server and UI should use an explicit host reference:

```text
MediaHostRef
  Kind: video | audio
  Id: int
```

No contract may represent a host using an unqualified integer. A video and an
audio entity may have the same numeric ID.

### Initial capability behavior

| Capability | Video Basic | Video Full | Audio 1.1 |
| --- | --- | --- | --- |
| Host playback | Cove video player | Cove video player | Segment Studio audio player |
| Segment storage | Cove native | Cove native and Segment Studio-owned | Segment Studio-owned |
| Tag and timing edits | yes | yes | yes |
| Structural edits | restricted by Basic profile | yes | yes |
| Trash and restore | native workflow | owned/native workflow | owned workflow |
| Review and provenance | no | yes | deferred |
| Performer slots | no | yes | deferred |
| Shot and frame features | no | yes | never for audio |
| Visual analysis | Cove native action | Segment Studio analysis | never for audio |

For 1.1, audio should expose the same focused capability set regardless of
whether the installation's requested mode is Basic or Full. Full-only audio
features can be added individually later. The effective capability set must be
computed from both the requested mode and the media kind; mode alone is not
sufficient.

## Persistence design

### Segment Studio item representation

Extend `SegmentStudioItem` so an owned representation can reference exactly
one supported host:

```text
NativeSegmentId  nullable
VideoId          nullable
AudioId          nullable
StartSec         nullable
EndSec           nullable
TagId            nullable
LifecycleState   active | trashed
Revision
```

An extension-owned audio segment has:

```text
NativeSegmentId = null
AudioId         = <audio ID>
VideoId         = null
StartSec        = required
EndSec          = required
TagId           = required
```

Using separate nullable host foreign keys in storage is preferable to an
unconstrained polymorphic `host_type`/`host_id` pair for the first migration.
It preserves referential integrity, allows audio deletion to cascade, and
fits the existing `VideoId` schema. Domain and API code should still expose
only `MediaHostRef`, so adding another host later does not spread nullable-ID
branching throughout the application.

The representation constraint must enforce one of:

- a native Cove segment anchor; or
- a complete owned video representation; or
- a complete owned audio representation.

Add an index suitable for editor loading and interval ordering:

```text
(audio_id, lifecycle_state, start_sec, end_sec, id)
```

Existing rows are unchanged. The migration only adds nullable audio and
lifecycle columns, constraints, and indexes, then backfills the lifecycle of
existing live items.

### Stable identity

Every extension API and UI state must call the stable key `itemId`. It must
not call it `segmentId`, because that currently implies a Cove `Segment.Id`.
Responses may include:

```json
{
  "itemId": 123,
  "nativeSegmentId": null,
  "storageOwner": "segment-studio",
  "host": { "kind": "audio", "id": 45 },
  "startSec": 12.5,
  "endSec": 18.75,
  "tagId": 9,
  "revision": 4
}
```

This preserves an unambiguous namespace and leaves `nativeSegmentId` available
for a later publication transition.

### Timing and file selection

Segments belong to the `Audio` entity, not to an individual `AudioFile`.
Alternate encodings of the same audio therefore share one timeline.

The editor response must identify the server-selected playable file and its
effective duration. Discovery, editor validation, and playback must use the
same selection policy. The implementation must not independently select one
file for metadata and another for streaming.

Mutations must require:

```text
0 <= startSec < endSec <= effectiveDuration
```

The service should reject a mutation when the selected source has changed and
the requested range is no longer valid.

## Extension API

Use media-qualified discovery/editor routes and item-qualified mutation
routes. A possible contract is:

```text
GET    /media/audio
GET    /media/audio/{audioId}/editor
POST   /media/audio/{audioId}/items

PUT    /items/{itemId}/fields
POST   /items/{itemId}/duplicate
POST   /items/{itemId}/split
POST   /items/merge
POST   /items/{itemId}/trash
POST   /items/{itemId}/restore
DELETE /items/{itemId}

GET    /items
GET    /items/{itemId}
GET    /items/{itemId}/playback
```

The exact route prefix may follow the extension's current convention, but
host kind must be present anywhere a host ID is accepted.

The editor projection should return:

- media identity, title, duration, and selected-file metadata;
- an authorized audio stream URL;
- active extension-owned items ordered by time;
- tag and segment-group presentation data;
- a server-authored capability set;
- no video-only shot, frame, screenshot, or analysis payload.

All mutations use optimistic concurrency through `Revision` or an equivalent
expected-version field. Idempotency receipts should be retained for compound
operations such as split and merge.

### Authorization

Every read must verify that the caller can read the parent `Audio` entity.
Every mutation must require the corresponding audio scope plus the existing
segment-writing policy selected for Segment Studio annotations. Authorization
is checked from the stored host reference; callers must not be able to move an
item to a different audio entity by changing a request field.

List endpoints must authorize hosts before returning item metadata. Playback
resolution must perform the same check and must not turn an item ID into an
audio-information oracle.

## Playback owned by Segment Studio

Segment Studio should play an audio segment by streaming the parent audio and
controlling a client-side clip:

1. resolve the item and authorize its audio host;
2. load Cove's existing ranged audio stream;
3. seek to `startSec`;
4. stop or loop at `endSec`;
5. keep the playhead, timeline, selection, and keyboard controls synchronized.

A server-generated clipped media file is not required for 1.1. Range-enabled
streaming and client-side time bounds are sufficient for interactive
playback.

Add a small Segment Studio playback adapter with:

- source loading and cleanup;
- play, pause, seek, and playback-rate control;
- current-time and duration events;
- bounded play and optional loop;
- a registered imperative control used by editor shortcuts;
- clear handling for unsupported browser codecs and failed range requests.

The initial adapter may wrap a native `<audio>` element and the existing Cove
audio stream endpoint. Exporting a richer shared `AudioPlayer` from Cove is a
desirable deduplication later, not a prerequisite for the proof.

Deep links should use the stable item identity, for example:

```text
/segment-studio/audio/{audioId}?item={itemId}
```

Opening the link selects the item, seeks to its start, and makes an explicit
user action start playback. Inventory cards must use this path instead of a
Cove segment-detail route.

## UI plan

Add audio as a first-class Segment Studio surface:

- an Audio discovery tab with title, duration, and local segment count;
- an audio editor route whose host kind cannot be confused with a video ID;
- a playback panel without screenshot or frame controls;
- the existing time ruler, cursor, range selection, tag lanes, and item
  details adapted to a media-neutral editor model;
- a Segment Studio inventory filter for audio and extension-owned storage;
- audio cards using cover art, a waveform if available, or a neutral audio
  treatment instead of generated video screenshots.

A waveform is useful but not required for the first release. The time ruler
and range selection must remain usable without one.

All visual controls are gated by capabilities returned by the server. Avoid
scattered checks such as `if (audio)`; use named capabilities including:

```text
media.audioPlayback
segments.ownedRead
segments.ownedCreate
segments.editTagTiming
segments.structuralEdit
segments.trash
frames.navigate
shots.edit
analysis.visual
examples.image
```

The manifest does not need an audio toolbar action for the first proof.
Segment Studio's own Audio discovery page provides a complete entry path.
When Cove exposes extension actions on Audio detail pages, the manifest can
add the audio target without changing storage or playback semantics.

## Explicit limitations of the extension-first release

Extension-owned audio segments will not initially:

- appear in Cove's global Segments library;
- participate in Cove display profiles, resolved spans, dynamic groups, or
  group compilation;
- open in Cove's native segment detail page;
- be available when Segment Studio is disabled;
- be consumable by unrelated extensions through the native Segment API.

These limitations must be visible in release notes and UI language. The UI
must not label an item as published to Cove when only Segment Studio can read
it.

Tag IDs remain Cove-owned references. Tag deletion or visibility changes must
be handled explicitly so an extension item cannot silently expose a tag the
caller is not authorized to use.

## Native Cove adoption path

Keep publication as an adapter, not an assumption embedded in the audio
editor:

```text
SegmentStudioItem
  -> optional canonical-segment publisher
  -> Cove Segment
  -> NativeSegmentId anchor retained by Segment Studio
```

If Cove later supports audio segment CRUD, playback, cleanup, and library
presentation, add an explicit, idempotent migration:

1. select eligible active audio items;
2. create `SegmentHostType.Audio` Cove segments;
3. record the resulting `NativeSegmentId` through the existing ownership
   transition machinery;
4. retain Segment Studio metadata and stable item identity;
5. verify counts, timings, tags, authorization, and playback;
6. switch reads item-by-item only after the native row is verified.

Do not delete the Segment Studio item during publication. It remains the
stable anchor for extension metadata and lets the migration be audited or
retried safely.

The extension-first implementation should produce concrete evidence for Cove:

- required CRUD and authorization contracts;
- expected item counts and query patterns;
- duration and multi-file edge cases;
- playback and deep-link behavior;
- deletion and orphan-handling requirements;
- which library, grouping, and cross-extension integrations users actually
  need.

## Implementation slices

### Slice 1: Characterize and separate identities

- Add tests that distinguish `itemId`, `nativeSegmentId`, and media host ID.
- Introduce `MediaHostRef` and media-neutral editor DTOs.
- Move video-specific feature availability behind named capabilities.
- Verify a video and audio with the same numeric ID cannot cross-resolve.

### Slice 2: Owned audio persistence and services

- Add the additive `AudioId` and lifecycle migration.
- Implement audio discovery and editor projections.
- Implement authorized CRUD, optimistic concurrency, trash, and purge.
- Centralize playable-file selection and duration validation.

### Slice 3: Audio player and editor

- Add the bounded audio playback adapter.
- Add media-qualified routing and stable item deep links.
- Adapt the timeline, selection, tag lanes, shortcuts, and details panel.
- Hide every unsupported visual capability from both rendering and shortcut
  dispatch.

### Slice 4: Inventory and lifecycle hardening

- Add audio and storage-owner filters to Segment Studio inventory.
- Add restore and bulk purge behavior.
- Verify audio deletion cascades or is rejected according to the chosen
  lifecycle contract.
- Handle missing tags, missing files, changed duration, and unsupported
  codecs without corrupting item data.

### Slice 5: Dogfood and document native requirements

- Exercise realistic audio libraries and segment counts.
- Record the cross-surface features that are blocked by extension ownership.
- Specify the smallest native Cove audio-segment contract justified by actual
  use.
- Add the optional publication adapter only after that native contract exists.

## Test plan

At minimum, cover:

- audio creation does not insert a Cove `Segment` row;
- audio editor loading and item listing are authorization-scoped;
- create, update, duplicate, split, merge, trash, restore, and purge;
- optimistic-concurrency conflicts;
- invalid, zero-length, negative, and out-of-duration ranges;
- a video and audio sharing the same numeric ID;
- parent-audio deletion and orphan prevention;
- multiple audio files and deterministic source selection;
- audio with and without an embedded video track;
- player seek, bounded stop, loop, rate, and shortcut synchronization;
- item deep links and browser refresh;
- absence of shot, frame, screenshot, and visual-analysis actions;
- Full installations receiving the intended audio capability subset;
- existing video behavior and migrations remaining unchanged.

## Completion criteria

- A user can discover an authorized audio entity, create Segment Studio-owned
  segments, edit their ranges and tags, and play each exact interval.
- Audio item identity is stable and cannot be confused with a Cove segment or
  a video/audio host ID.
- No audio workflow depends on Cove native audio-segment CRUD or presentation.
- No audio item is returned or played without authorization on its parent
  audio entity.
- Parent deletion, tag changes, source-file changes, and extension upgrades
  have explicit, tested outcomes.
- Video-only features are absent because of server-authored capabilities, not
  cosmetic UI checks.
- Existing video workflows remain behaviorally unchanged.
- The storage and ownership transition preserve a safe, idempotent route to
  native Cove audio segments later.
