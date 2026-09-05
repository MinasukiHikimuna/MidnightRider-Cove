# Segment Studio Basic and Full Mode Rearchitecture Plan

Status: proposed architecture and implementation plan. Product decisions marked
**Settled** are requirements. Items marked **Open** must be decided before
implementation reaches the affected phase.

## Outcome

Segment Studio has two deliberately different products sharing neutral editor
infrastructure:

- **Basic** is a native-segment editor. Every visible and editable segment is a
  native Cove segment. Create, duplicate, split, merge, retag, timing edits,
  multi-select retag, and recycle-bin actions use native-only implementations.
  Basic has no review lifecycle and must not receive or infer review state.
- **Full** is the extension workflow. It can combine native segments with
  extension-owned segments and expose review, derivation, lineage, performer
  slots, and other expanded workflow metadata.

The selected mode must determine the route set, data projection, commands,
settings, shortcuts, background effects, and API authorization. Components
must render an explicit mode-specific state; they must not infer mode or
operation eligibility from incidental segment fields such as `published`,
`reviewState`, or whether an extension item ID happens to be present.

This is not only a visibility change. Basic and Full have separate application
controllers and command contracts over shared timeline, player, layout, and
selection primitives.

## Settled product contract

### Capability matrix

The following matrix is the initial source of truth. “Separate” means the
capability exists in both modes but is implemented by a mode-specific command
handler and DTO rather than a shared handler with conditionals.

| Surface or operation | Basic | Full | Contract |
| --- | --- | --- | --- |
| Videos navigation | yes | yes | Mode-specific discovery projection |
| Segments inventory tab and route | no | yes | Direct Basic URL redirects before fetching |
| General settings | yes | yes | Mode-aware copy and transition controls |
| Shortcut settings | yes | yes | Show only commands effective in the mode |
| Assign, move, or unassign an editor tag in Cove tag groups | yes | yes | Shared inline action; group administration remains in Cove |
| Performer slots settings | no | yes | No Basic route, panel, or request |
| Derivation settings | no | yes | No Basic route, panel, or request |
| Read native segments | yes | yes | Separate DTO projections |
| Create a segment | native | workflow | Separate implementations |
| Duplicate a segment | native | workflow | Separate implementations |
| Split a segment | native | workflow | Separate implementations |
| Merge segments | native | workflow | Separate implementations and eligibility |
| Retag / edit start and end | native | workflow | Separate implementations |
| Multi-select retag | native | workflow | Separate implementations |
| Review state, counts, and actions | no | yes | Absent from Basic API and state |
| Extension-owned segments | no | yes | Preserved but hidden in Basic |
| Source, confidence, detailed provenance | read-only | yes | No lineage or workflow action in Basic |
| Lineage and derivation metadata/actions | no | yes | Full only |
| Performer slot assignment | no | yes | Full only |
| Full Scan | native-output | workflow-output | Separate persistence implementations |
| Shot-boundary tools and data | no | yes | No Basic controls, projection, or requests |
| Undo | native operations | workflow | Separate operation receipts and inverse commands |
| Editor filters | native facets | workflow facets | Separate filter state and dialogs |
| Basic recycle bin: move, view, restore, empty | yes | no | Must be empty before entering Full |
| Full rejection/deletion workflow | no | yes | Distinct from the Basic recycle bin |
| Segment groups in the editor | yes | yes | Always derived from current tag IDs |

The word “native” is a hard storage and command boundary in Basic. A Basic
command must never silently create an extension-owned draft, convert a native
segment to an owned item, or attach a review state.

Full is a superset of the useful editing domain, but it is not a literal
superset of Basic UI. The Basic recycle-bin surface is intentionally absent
from Full; the transition precondition guarantees there are no hidden Basic
bin entries after a successful Basic-to-Full switch.

### Basic editor behavior

Basic supports:

- playback, seeking, timeline navigation, selection, quick search, zoom, and
  responsive layout;
- native create, duplicate, split, merge, retag, start/end editing, and
  multi-select retag;
- native-only move to recycle bin, recycle-bin list, restore, and permanent
  empty;
- Segment-group display and administration;
- read-only source, confidence, and detailed provenance;
- Segment Studio Full Scan with Basic-native output;
- native-operation undo, including undoing Move to recycle bin by restoring the
  native segment;
- native filters for tag, Segment group, provenance source, and confidence.

Basic does not have a review concept. Consequently:

- `reviewState`, `published`, review counts, review filters, review badges,
  approve/reject actions, review completion, and review shortcuts do not exist
  in the Basic DTO or UI state;
- Basic merge eligibility cannot depend on review or ownership fields;
- a Basic selection summary reports selection and native-operation
  eligibility, not unreviewed/approved/rejected counts;
- no Basic background effect fetches review data.

For merge specifically, two or more selected native segments are eligible when
they are in one actual editor swimlane and satisfy the native timing/tag rules.
After a merge and reload, the resulting segment is still native. Selecting the
next valid set in the same lane must offer merge again.

Segment-group membership must be part of the refreshed Basic editor state.
After retag, create, split, duplicate, merge, or restore, the server response
or required reload must include every group referenced by the current segment
tag IDs. The UI must not keep a partial group lookup based only on the tags
that existed when the editor first opened.

Basic filters have their own state model and dialog. They include:

- tag;
- Segment group;
- provenance source;
- confidence range;
- an explicit Include unscored segments control.

Quick search remains available alongside the filter dialog. Basic filters do
not contain approval/review state, performer, slot status, derived visibility,
or any other Full-only facet. Filter counts and navigation are computed from
the Basic native projection only.

Basic Full Scan is an AI invocation capability, not permission to use the Full
segment workflow. Its Basic-specific persistence path writes matching results
as native Cove segments, records the available source/confidence/provenance,
and reloads the Basic projection. It does not create extension-owned review
candidates or request/persist shot boundaries.

Shot-boundary controls, overlays, projection fields, endpoints, and background
requests remain absent from Basic even if an independently selected AI
workflow produces shot-related data elsewhere in Cove.

### Full editor behavior

Full retains the current native-plus-extension workflow, subject to the same
central capability contract. Its segment model is an explicit discriminated
union, not a set of nullable fields:

- native segment;
- extension-owned segment.

Full owns the semantics for review, drafts, cross-residence eligibility,
performer slots, derivation, lineage, and expanded metadata. If Full permits
merge or another operation across segment residences, that is a separately
specified Full rule and must not leak into Basic.

### Navigation and settings

In Basic:

- top-level navigation contains Videos, but not Segments;
- a direct request for the Segments or legacy review route redirects to Videos
  before the Full page mounts or fetches;
- Settings contains General and Shortcuts;
- Performer slots is absent from Settings;
- Derivation is absent;
- the recycle bin is reachable from Basic editor and/or Basic navigation
  affordances.

In Full, the current Segments inventory, Performer slots, and Derivation
surfaces remain available.

## Unclassified-feature gate

No implementation should guess at an unlisted feature. Before Phase 2, audit
every existing route, endpoint, command, shortcut, panel, dialog, filter, and
background request against the matrix above. Any item without an explicit
Basic and Full decision is added to the product-decision log and blocks that
part of the rollout. The initially identified decisions—Full Scan, shots,
undo, filters, and Full-to-Basic warning detail—are settled in this plan.

The audit must also answer these questions for every feature:

1. Is it available in Basic, Full, both, or neither?
2. If both, is its behavior truly identical or does each mode need a separate
   handler?
3. Which DTO fields does it require?
4. Which endpoint and Cove permission authorize it?
5. Which command, shortcut, menu item, and settings control expose it?
6. Which background requests or subscriptions does it start?
7. What happens to its data when the other mode is active?
8. What happens during a mode transition while that feature is open?

## Architecture

### One server-authored feature session

Replace the independent preference, compatibility, query-string, and
component-level mode decisions with one versioned session response:

```json
{
  "schemaVersion": 1,
  "requestedMode": "basic",
  "effectiveMode": "basic",
  "capabilities": [
    "navigation.videos",
    "nativeSegments.read",
    "nativeSegments.create",
    "nativeSegments.merge"
  ]
}
```

The server resolves the current user, stored preference, installation
compatibility, permissions, and effective mode. The client never upgrades
itself to Full with `?workflow=full` or a raw local preference.

Initially, the persistence adapter may continue accepting the legacy storage
tokens `editor` and `review`, mapping them to public `basic` and `full`.
Unknown schema versions, modes, and capabilities fail closed.

### An executable capability registry

Create one registry with, for every capability:

- stable key;
- Basic availability and implementation ID;
- Full availability and implementation ID;
- required server projection;
- required Cove permissions;
- route and endpoint metadata;
- commands and shortcuts;
- optional settings/navigation surfaces;
- capability dependencies.

Tests validate the registry. UI helpers derive visible routes, settings tabs,
commands, shortcuts, and effects from the returned capability set. Endpoint
metadata uses the same stable keys.

Do not copy the matrix into multiple React components. A component asks the
session whether a capability exists; a controller maps that capability to the
mode-specific implementation.

### Mode-specific state and render flow

The desired flow is:

```text
server feature session
        ↓
BasicEditorController OR FullEditorController
        ↓
BasicEditorState      OR FullEditorState
        ↓
shared presentational timeline/player + mode-owned panels/actions
```

`BasicEditorState` contains only Basic concepts. It does not carry placeholder
review fields with neutral-looking values. `FullEditorState` contains the
Full segment union and workflow state.

Shared code is restricted to neutral primitives:

- player and time conversion;
- timeline geometry and swimlane layout;
- pointer and keyboard event normalization;
- selection IDs and focus;
- reusable visual controls that accept already-computed labels and
  availability.

Shared primitives do not inspect `published`, review state, ownership, or
derivation. The Basic and Full controllers compute operation eligibility and
dispatch their own commands.

### Mode-specific API projections

Define explicit response types rather than one nullable super-DTO.

`BasicSegmentDto` includes only:

- native segment ID;
- tag ID and display data;
- start and end;
- segment-group reference/display data;
- read-only source, confidence, and detailed provenance fields accepted by
  the product decision.

It excludes:

- extension item ID and revision;
- `published`;
- review state and review counts;
- performer slots;
- derivation and lineage;
- feedback and review actions;
- shot fields;
- extension-owned analysis candidates and Full workflow history.

The Basic editor state may separately contain:

- the Segment Studio analysis job ID/status needed to refresh native scan
  results;
- native undo availability and operation labels;
- Basic-native filter state.

These are Basic controller concepts, not nullable fields added to every
segment.

`FullSegmentDto` is a discriminated native/owned union with the workflow fields
needed by Full.

Video discovery follows the same projection split. Basic counts native
segments only and returns no review-shaped totals.

The editor response includes a complete group lookup for all returned tag IDs.
No UI-only patching is allowed to be the source of truth for group membership.

### Mode-specific command ports

Introduce explicit ports such as:

- `IBasicNativeSegmentCommands`;
- `IFullWorkflowSegmentCommands`;
- matching client-side `BasicEditorCommands` and `FullEditorCommands`.

Basic command methods include:

- create native;
- duplicate native;
- split native;
- merge native;
- update native tag/timing;
- bulk retag native;
- move native to Basic recycle bin;
- restore native;
- empty Basic recycle bin;
- undo a reversible native command;
- start a Basic-native Full Scan for the current video.

Full commands retain workflow-aware behavior. They may reuse lower-level
transaction, timing-validation, tag-validation, and authorization utilities,
but not Basic/Full policy decisions.

Every command returns either the authoritative new mode-specific editor state
or a result that mandates one authoritative reload. Optimistic local state is
allowed for responsiveness, but is never the final source of group,
residence, or eligibility truth.

### Endpoint enforcement

Every extension endpoint declares:

- exact Cove permission and entity authorization;
- exact Segment Studio capability;
- accepted mode-specific request and response type.

A route filter resolves the server feature session and returns a stable 409
`feature_not_available_in_mode` before reading or mutating feature data when
the capability is absent. UI hiding is not authorization.

Split mixed endpoints. In particular, a Basic tag/timing request cannot accept
review state, and a Basic structural request cannot select an owned-item path.
Reject unexpected Full-only fields during deserialization or validation.

### Mode-specific Full Scan

Keep Full Scan owned entirely by Segment Studio for this rearchitecture. Do
not change Cove core/runtime and do not directly import or invoke AI.Core
internals.

Split the current analysis service after the shared model invocation:

- the **Basic scan projector** requests AI tagging only, maps unambiguous tag
  results to Cove tags, and creates or updates native Cove segments through
  the Basic native command/service boundary;
- the **Full scan projector** may retain the current extension-owned
  candidate, review, provenance/lineage, and shot-boundary workflow.

The server feature session—not a request flag—selects the projector. The Basic
request cannot ask for review state, extension-owned candidate output, or
OmniShotCut. Basic scan writes are idempotent by source fingerprint/run and
must not duplicate an equivalent native result on retry.

Basic scan status contains only neutral job state and native result totals:
queued, running, completed, failed, and native segments added/updated/skipped.
It contains no candidate review counts. Completion publishes the ordinary
video/segment invalidation and reloads the authoritative Basic projection.

Keep the existing compact Full Scan control for now. Do not clone AI.Core's
Run AI dialog inside Segment Studio; maintaining two copies would create a
second settings and validation contract.

### Native undo

Basic undo uses server-authored operation receipts and inverse native
commands. It must not reuse a snapshot model containing review state or owned
items.

Reversible Basic commands include:

- create and duplicate;
- split and merge;
- retag, timing edits, and multi-retag;
- Move to recycle bin, whose inverse restores the native segment;
- explicit restore, whose inverse can move the restored segment back to the
  Basic bin while it remains eligible.

Each receipt records affected native IDs, before/after values, revisions, and
the inverse command without serializing Full-only metadata. Undo is
idempotent, permission-checked, and optimistic-concurrency checked. A conflict
does not guess or partially apply an inverse; it reports why the operation can
no longer be undone and reloads authoritative state.

Permanent Empty recycle bin and the confirmed Basic-to-Full cleanup are not
undoable. They expire receipts that depend on purged entries. Full Scan is not
represented as one Segment Studio undo step; its native results can be edited
or moved to the bin through the ordinary Basic commands.

## Mode switching

Mode changes are explicit server-orchestrated transitions, not a preference
write followed by client cleanup.

### Transition preview

Before changing modes, request a preview containing:

- source and target modes;
- blocking preconditions;
- counts of data that will be deleted or hidden;
- Basic recycle-bin fingerprint and count when applicable;
- a short-lived preview token or expected revision.

The modal copy comes from this explicit impact model. The client does not
estimate impact from its currently loaded page.

### Basic to Full

The Basic recycle bin is hidden in Full, so it must be empty before switching.

- If the bin is empty, the transition may proceed.
- If it is non-empty, show a destructive confirmation with the exact eligible
  count: **Empty recycle bin and switch to Full**.
- Cancel leaves the user in Basic and changes nothing.
- Confirm sends an idempotency key, expected fingerprint/preview token, and
  explicit `emptyBasicRecycleBin: true`.
- The server permanently empties the eligible Basic bin and changes the mode
  in one execution-strategy transaction. If cleanup fails, permission changes,
  or the fingerprint is stale, it does not switch modes.
- A conflict reloads the preview and requires renewed confirmation.

There is no path that switches to Full while Basic recycle-bin entries remain.
The confirmation must clearly say that permanent deletion cannot be undone.

### Full to Basic

Full-to-Basic does not delete or rewrite workflow data.

- Preview the library-wide count of extension-owned segments that will become
  hidden.
- When the count is greater than zero, use count-aware singular/plural
  rendering of this copy:

  > You have {count} extension-owned {segment/segments}. Basic mode only shows
  > Cove's native segments. If you proceed, {this segment/these segments} will
  > be hidden.

- Follow it with: “Nothing will be deleted. The hidden segments will reappear
  when you return to Full mode.”
- When the count is zero, omit the segment sentence and confirm only that
  Full-only expanded metadata will be hidden.
- Explain that review, lineage, derivation, performer slots, feedback, and
  other Full-only state remain stored and reappear on return to Full.
- Explicitly note the settled exception: source, confidence, and detailed
  provenance remain read-only in Basic.
- Require acknowledgement before changing the preference.
- On success, cancel Full requests, clear Full-only in-memory state, and
  navigate to the nearest Basic route before rendering.

If the user is on Segments, Performer slots, Derivation, or another Full-only
surface, the successful transition lands on Videos. No Full component may
remain mounted during the Basic session.

### Transition API

A focused API can expose:

- `POST /mode-transitions/preview`;
- `POST /mode-transitions` with target mode, preview token, acknowledgement,
  optional bin cleanup instruction, and idempotency key.

The response is the complete new feature session. Replaying a successful
operation returns the same outcome. Audit records describe generic counts and
mode changes without leaking library entity names.

## Recycle-bin contract

The Basic recycle bin is a native-segment safety workflow, not review rejection
under another label.

### Move

- Accept only a native segment ID and optimistic concurrency value.
- Server assigns internal recycle-bin state; the request has no review field.
- Preserve enough native metadata to restore.
- Apply existing entity authorization and delete permission.
- If removing a native source affects extension-owned derived descendants,
  use the existing lineage integrity rules transactionally without exposing
  those descendants in Basic.

### List

Return only Basic-eligible native entries, total count, and a stable
fingerprint. Never reveal hidden Full-owned or review records.

### Restore

Restore through a Basic-native implementation and return/reload a native
segment. Its group lookup and read-only provenance are refreshed with the
editor state.

### Empty

Use an atomic, idempotent bulk operation with expected fingerprint. Re-resolve
permission and eligibility for every entry before mutation. Never partially
empty. The same service is used by the explicit Basic-to-Full transition
transaction.

## UI composition

### Routes

Build the route table after the feature session resolves. A disallowed route
does not mount and then hide itself. Unknown or stale routes resolve to the
nearest allowed route with a concise status message.

### Navigation and Settings

Derive top-level and Settings tabs from capabilities. Basic must not render or
request:

- Segments inventory;
- Performer slots;
- Derivation;
- review settings;
- Full-only maintenance, rollout, telemetry, lineage, or ingestion panels.

Mode switching consumes the transition preview/commit flow above.

### Editor actions and selection details

Each controller supplies a command list with:

- command ID;
- availability and reason;
- shortcut;
- label;
- handler.

Buttons, context menus, keyboard dispatch, help, and selection details consume
that same list. There is no separate merge predicate in each surface.

Basic selection details show selected count, lane/group organization where
useful, and Basic-native actions. They never show `?`, checkmark, or rejection
review counts.

### Basic filters

Render a Basic-specific filter dialog containing Tags, Segment groups,
Provenance source, Confidence, and Include unscored segments. Its Reset action
restores all tags/groups/sources, the full confidence range, and inclusion of
unscored segments.

The dialog copy must make clear that filters affect the rail, swimlanes,
selection, counts, and keyboard navigation. Applying a filter reconciles the
active selection to a visible native segment without broadening the filter
behind the user's back.

### Full Scan and Undo controls

Full Scan appears in the Basic toolbar when Segment Studio analysis is
configured and the user has the required Cove segment/job permissions.
Activating it queues the Basic-native scan implementation. Queued status uses
neutral job/result language rather than Segment Studio's Full
review-candidate model.

Basic exposes Undo with the label of the next inverse operation, for example
“Undo merge” or “Undo move to recycle bin.” Disable it with a reason when the
receipt is stale, unauthorized, permanently expired, or blocked by a
concurrency conflict. The recycle-bin page also offers the ordinary explicit
Restore action independently of editor undo.

### Shortcuts

Store customized bindings independently of mode, but expose and dispatch only
commands in the active controller. Hidden Full bindings remain stored and
return in Full. Basic structural commands and Undo receive Basic-specific
command IDs even if their default keys match Full equivalents.

### Effects and request cancellation

Each controller owns a fixed effect registry. Switching mode unmounts the old
controller, aborts its requests/subscriptions, clears its state, and then
mounts the new controller from the returned session. Basic has no dormant
Full effects that merely discard their results.

## Implementation sequence

Each phase starts with focused failing tests and ends in a shippable state.

### Phase 0: Complete the product inventory

- Export or enumerate every route, endpoint, editor command, shortcut,
  settings panel, filter, detail panel, and background effect.
- Assign Basic/Full availability and an implementation owner.
- Add any newly discovered unclassified feature to the product-decision log
  and resolve it before implementing that surface.
- Reject “same as today” as a specification when current behavior mixes
  native and workflow semantics.

Deliverable: reviewed capability matrix with no unclassified feature.

### Phase 1: Centralize the session and capability registry

- Add semantic `Basic`/`Full` server modes while preserving legacy stored
  tokens through an adapter.
- Implement the versioned feature session and executable capability registry.
- Add endpoint capability metadata and fail-closed filters.
- Collapse UI startup mode/compatibility authority into the session.
- Remove query-string escalation authority.

Keep compatibility response aliases only while known callers migrate.

### Phase 2: Split projections and editor state

- Add `BasicSegmentDto` and the Full discriminated union.
- Extract Basic and Full editor/discovery projections.
- Introduce Basic and Full controllers/stores.
- Restrict shared timeline/player components to neutral inputs.
- Make segment-group lookup complete after every editor load/mutation.
- Prove Basic serialization and state contain no review/owned/lineage fields.

### Phase 3: Implement Basic-native commands

- Add native create, duplicate, split, merge, retag/timing, and multi-retag
  request/service paths.
- Add native operation receipts and inverse commands for Undo.
- Keep shared low-level validation and transaction helpers.
- Make Basic merge eligibility lane/native based and independent of review.
- Return or reload authoritative Basic state after every mutation.
- Add sequential merge, retag-to-new-group, and undo-move-to-bin regressions.

### Phase 4: Isolate Full workflow commands

- Route Full operations through the Full controller and Full services.
- Specify native/owned and cross-residence eligibility explicitly.
- Move review, slot, derivation, lineage, and feedback behavior behind Full
  capabilities.
- Remove raw `compatibilityMode`, `mode === "review"`, and
  `mode === "editor"` branches from feature components.

### Phase 5: Recompose navigation, Settings, details, and shortcuts

- Hide Basic Segments navigation and guard direct routes.
- Build Settings tabs from the registry.
- Remove review-shaped Basic selection details.
- Use one controller command list for actions, menus, keyboard, and help.
- Add the Basic-specific tag/group/source/confidence filters.
- Keep all shot-boundary UI, state, and requests out of Basic.

### Phase 6: Split Full Scan persistence

- Separate shared analysis invocation from Basic and Full result projection.
- Make Basic request AI tagging only and persist unambiguous results as native
  Cove segments.
- Preserve source, confidence, and detailed provenance on Basic-native
  results without creating review or lineage state.
- Make Basic retries idempotent and report neutral added/updated/skipped
  totals.
- Keep extension-owned candidates and shot-boundary projection Full-only.
- Refresh only the native Basic projection when queued work completes.

### Phase 7: Complete the Basic recycle bin

- Implement Basic-scoped move, list, restore, and atomic empty.
- Ensure restored items are native and reload groups/provenance.
- Keep the Basic bin surface absent in Full.
- Integrate Move/Restore with native Undo receipts.
- Add permission, idempotency, concurrency, expiration, and no-partial-delete
  coverage.

### Phase 8: Add guarded mode transitions

- Implement transition preview and idempotent commit.
- Make Basic-to-Full cleanup and mode change atomic.
- Require confirmation that Basic undo history is cleared when entering Full,
  and scrub its server-authored receipt payloads.
- Return the library-wide extension-owned segment count and require the
  count-aware Full-to-Basic acknowledgement.
- Cancel mode-owned UI work and route safely after transition.
- Add accessibility, stale-preview, failure, and retry behavior.

### Phase 9: Remove shims and verify packaged behavior

- Remove temporary response aliases, query parameters, and raw-mode checks.
- Update user documentation and mode/help copy.
- Run focused and full automated suites.
- Package and install the extension through the repository workflow.
- Verify the full live UI/network matrix with generic test data.

## Test plan

### Capability and contract tests

- default/legacy preference normalization and per-user isolation;
- unknown mode/schema/capability fails closed;
- every registered surface has explicit Basic and Full decisions;
- capability dependency validation;
- every endpoint declares exact Cove and feature authorization;
- a Basic request cannot escalate with query parameters or Full-only fields;
- switching modes never rewrites Full-owned data.

### Projection tests

- Basic editor/discovery returns native segments only;
- Basic DTO JSON contains no `reviewState`, `published`, owned item/revision,
  slot, lineage, derivation, or feedback fields;
- Basic includes the accepted source/confidence/provenance fields;
- Full union behavior remains intact;
- group lookup covers every tag ID returned after load and every mutation;
- Basic does not execute Full-only service queries.

### Basic command tests

- create and duplicate persist native segments;
- split produces valid native segments;
- merge accepts two or more valid native segments in one swimlane;
- merge rejects cross-lane, stale, or invalid timing selections with a
  Basic-specific reason;
- merge one set, reload, select the next valid set, and merge remains offered;
- retag to a tag absent at initial load places the segment in its configured
  group rather than Ungrouped;
- multi-retag, timing updates, and concurrency conflicts preserve native
  residence;
- every reversible Basic command emits a native-only inverse receipt;
- Undo restores the exact prior native state and remains idempotent;
- Undo Move to recycle bin restores the native segment;
- stale or unauthorized Undo applies no partial inverse;
- Empty and Basic-to-Full cleanup expire affected receipts;
- no Basic command creates an owned draft or review metadata.

### UI behavior tests

- Basic tabs contain Videos and omit Segments;
- a direct Basic Segments/review URL redirects before a Full fetch;
- Basic Settings contains General and Shortcuts, but no Performer slots,
  Derivation, or Organization;
- Basic filters contain only tag, Segment group, provenance source,
  confidence, and Include unscored segments;
- Basic filters affect rail, timeline, counts, selection, and keyboard
  navigation consistently;
- Basic selection details contain no review counts or review labels;
- action buttons, menus, shortcuts, and help expose the same active command
  set;
- Basic Full Scan queues only the Basic-native Segment Studio analysis path;
- unavailable analysis configuration or missing segment/job permission
  produces an explicit unavailable state;
- completing a Basic scan creates/updates native segments idempotently and
  refreshes them without creating review state or loading shot boundaries;
- the same scan request in Full retains the separately specified Full
  projection behavior;
- customized hidden shortcuts cannot dispatch;
- mode change aborts old effects and clears old state;
- no Basic network request targets review, slot, derivation, lineage, or other
  rejected capabilities;
- Full restores its current routes, settings, commands, and stored data.

### Recycle-bin and transition tests

- Basic move/list/restore/empty are native-scoped;
- restore returns a native segment and correct group;
- empty is atomic, idempotent, permission-safe, and conflict-safe;
- Basic-to-Full cannot commit with a non-empty bin unless the confirmed atomic
  cleanup succeeds;
- Basic-to-Full requires confirmation that Basic undo history will be cleared,
  including when the bin is already empty;
- Basic-to-Full cleanup removes Basic actions and scrubs receipt payloads into
  non-reusable tombstones;
- stale bin fingerprint causes no deletion and no mode switch;
- cancel causes no mutation;
- Full-to-Basic preview returns the current library-wide extension-owned
  segment count;
- Full-to-Basic renders the count-aware warning, requires explicit
  acknowledgement, and deletes nothing;
- zero, singular, and plural Full-to-Basic warning copy render correctly;
- transition replay returns the original successful result;
- route and session are updated together from the client’s perspective.

### Verification commands

After loading the generated devbox environment from the appropriate checkout:

```bash
dotnet test tests/SegmentStudio.Tests/SegmentStudio.Tests.csproj
node --test tests/SegmentStudio.Tests/SegmentStudioUi.test.mjs
for test_file in tests/SegmentStudio.Tests/*.test.py; do
  python "$test_file"
done
```

Run focused tests during each phase, then all suites. Package/install before
live verification; do not assume workspace files are the extension currently
loaded by Cove.

### Live verification matrix

Use generic test data and keep environment domains, entity IDs, and library
entity names out of publishable artifacts.

1. Basic has no Segments tab and direct Full-only routes redirect without
   Full-only network calls.
2. Basic Settings shows only the settled Basic tabs and panels.
3. Basic native create, duplicate, split, merge, retag, timing, multi-retag,
   bin move, restore, empty, and Undo all work.
4. Repeated merge works after the first merge/reload.
5. Retagging into a previously unloaded group renders in that group.
6. Basic filters contain and apply only the settled native facets.
7. Basic Full Scan persists and refreshes native results without exposing
   review candidates or shots.
8. Basic displays no review state/count/actions and sends no review fields.
9. Basic displays only the accepted read-only provenance surface.
10. Full retains owned segments, expanded metadata, review, slots, derivation,
    shots, and inventory behavior.
11. Basic-to-Full is blocked until the confirmed atomic bin cleanup succeeds.
12. Full-to-Basic displays the extension-owned segment count and preserves the
    hidden data for return to Full.
13. Users lacking a required Cove permission remain denied even when their
    selected mode contains the feature capability.

## Likely file impact

New focused modules are preferable to adding further branches to the existing
extension and editor files:

- server feature-session/capability registry;
- Basic and Full projection services/DTOs;
- Basic native and Full workflow command services;
- Basic-native and Full-workflow analysis result projectors;
- native undo receipt/inverse-command service;
- mode-transition preview/commit service;
- Basic recycle-bin service if current ownership-transition code cannot
  express the bounded contract cleanly;
- client Basic and Full editor controllers/stores;
- capability, projection, command, transition, and UI behavior tests.

Existing route composition, preferences, editor entry points, navigation,
Settings, shortcuts, and action/detail components will be modified to consume
those modules.

No Segment Studio manifest change is expected. A database migration should be
avoided only if legacy preference tokens and existing operation receipts can
safely support mode transitions and native Undo; decide this from service
tests, not as a preset constraint.

This plan makes no changes to Cove core/runtime. All implementation work is
contained in the Segment Studio extension and its tests.

## Future TODOs outside this rearchitecture

- Revisit opening AI.Core's existing Run AI dialog from Segment Studio after
  Cove exposes a supported public extension-action invocation API.
- At that point, use the public contribution rather than importing AI.Core
  code, reading the private handler registry, calling private endpoints, or
  copying the dialog into Segment Studio.
- Treat the integration as a separate Cove-core-plus-extension change with its
  own compatibility and permission tests. It does not block the mode
  separation described here.

## Rollout and reversibility

- Land the session and capability enforcement before relying on UI hiding.
- Keep old preference tokens readable during a compatibility window.
- Preserve Full-owned data and customized Full preferences while Basic is
  active.
- Roll out mode-specific projections before removing legacy response fields.
- Add telemetry for feature-mode rejections, transition conflicts, and
  projection/command failures without recording entity names.
- If rollback is needed, force the Full profile centrally while retaining
  stored user preferences and data.

The intentionally destructive Basic-to-Full effects are the user-confirmed
emptying of the Basic recycle bin and clearing its bounded Basic undo history.
Live native segments and all Full-owned data remain preserved, and every other
mode-visibility effect is reversible.

## Completion criteria

The rearchitecture is complete only when:

- the feature inventory has no unclassified route, command, shortcut, panel,
  filter, effect, or endpoint;
- one server-authored session is the only mode authority;
- Basic and Full use explicit projections, state, controllers, and command
  implementations;
- shared editor primitives contain no mode, review, residence, or derivation
  policy;
- Basic exposes only native segments and native mutations;
- Basic contains no review fields, counts, labels, filters, shortcuts,
  requests, or eligibility logic;
- Basic has no Segments tab, Performer slots settings, or Derivation tab;
- Basic merge remains available across sequential valid selections;
- group membership remains correct after retag and every structural mutation;
- Basic filters contain only tag, group, source, confidence, and unscored
  controls;
- Basic Full Scan uses the Basic-native Segment Studio projector and exposes
  only native results;
- Basic Undo reverses eligible native operations, including Move to recycle
  bin, without carrying review-shaped snapshots;
- shot-boundary state and tools are absent from Basic;
- Full-only endpoints fail closed in Basic even when called directly;
- Basic recycle-bin cleanup is a hard, atomic prerequisite for entering Full;
- Full-to-Basic confirmation includes the current extension-owned segment
  count and preserves those segments and expanded metadata;
- all settled matrix entries pass automated, packaged, and live verification.
