# Segment Provenance and Derivation Plan

## Status

Design proposal only. This document defines the intended architecture, migration,
implementation slices, and acceptance criteria. It does not authorize
implementation by itself.

This plan is intentionally independent of how future Cove AI results enter
Segment Studio. AI Tagging may continue to publish native Cove segments while
this work is implemented. Redirecting new AI results into unpublished Segment
Studio drafts is a separate project.

## Decision summary

Segment Studio will treat provenance and derivation as related but distinct
concepts:

- A **provenance assertion** records where a segment came from, which activity
  produced or imported it, and any available model and confidence evidence.
- A **derivation edge** records that one normal segment was derived from another
  normal segment by a particular version of a rule.
- A derived segment remains a first-class segment. It can be reviewed, published,
  displayed, filtered, and otherwise used like any other segment.
- A segment is derived when it has at least one live incoming derivation edge.
  `derived` is not a source, segment kind, review state, or publication state.
- The tag of a derived segment is determined by its derivation rule and cannot be
  changed through Segment Studio.
- Segment Studio deletion treats a complete connected lineage component as an
  atomic unit. Depending on the user's setting, deletion is blocked, confirmed
  for the whole component, or applied to the whole component.
- A root tag change is not a deletion. Segment Studio applies the root edit and
  atomically removes any descendants that are no longer valid. Automatic
  generation of newly applicable descendants is deferred.
- Segment Studio detects lineage changes made outside the extension and exposes
  them as integrity issues requiring repair.
- Stash Marker Studio marker IDs exist only in temporary migration receipts and
  are deleted after sign-off. Runtime provenance and derivation never depend on
  those IDs.
- Cove AI provenance retains the native source key, run key, logical model key,
  resolved model identity and version, confidence, and source-specific evidence
  when those values exist.

## Goals

1. Preserve the source labels currently represented by Stash Marker Studio tags.
2. Preserve the complete Stash Marker Studio derivation graph and rule metadata.
3. Represent current and future Cove AI provenance without fabricating missing
   legacy run, model, or confidence information.
4. Allow sources to be registered ad hoc through stable namespaced text keys.
5. Keep provenance stable while a Segment Studio item moves between native and
   extension-owned representations.
6. Make lineage invariants enforceable through Segment Studio services.
7. Detect and repair tag changes, deletions, and rule drift that occur outside
   Segment Studio.
8. Make destructive lineage operations previewable, permission-aware,
   concurrency-safe, idempotent, and transactional.

## Non-goals

- Redirect Cove AI output into unpublished Segment Studio drafts.
- Change Cove AI model selection, inference, or segment generation.
- Add derivation semantics to Cove core.
- Preserve Stash Marker Studio marker IDs as permanent segment metadata.
- Automatically generate new derivation branches after a root tag change in the
  first version.
- Treat manual edits to every canonical segment field as segment-origin
  provenance. Cove field provenance remains responsible for field-level changes.
- Allow derivation across different videos in the first version.
- Infer missing legacy model names, run identifiers, timestamps, or confidence.

## Verified source data

The migration snapshot currently contains 10,727 Stash Marker Studio markers
with the following `Marker Source:` tags:

| Source tag | Marker count |
|---|---:|
| `Marker Source: Manual` | 5,884 |
| `Marker Source: Skier AI` | 4,718 |
| `Marker Source: Derived` | 3,526 |
| `Marker Source: TPDB` | 125 |

The observed source-tag combinations are:

| Combination | Marker count |
|---|---:|
| Manual | 4,040 |
| Skier AI | 3,142 |
| Derived + Manual | 1,844 |
| Derived + Skier AI | 1,576 |
| Derived + TPDB | 106 |
| TPDB | 19 |

Every observed `Derived` source tag is accompanied by a non-derived source tag.
`Derived` therefore describes lineage rather than origin and must not become a
source catalog entry.

The Stash Marker Studio `marker_derivations` table contains:

- 5,984 derivation edges;
- 3,326 distinct source markers;
- 3,741 distinct derived markers; and
- `source_marker_id`, `derived_marker_id`, `rule_id`, `depth`, and `created_at`
  values.

The difference between markers carrying the `Derived` tag and distinct markers
appearing as derivation targets must be reported and preserved during planning.
Migration must not assume a one-to-one relationship between a `Derived` tag and
an edge target.

The existing Cove sample confirms that native AI tagging segments currently
contain:

- `SourceKey`, for example `ext:ai.tagging`;
- `SourceRunId`, matching `ai_runs.RunKey`;
- `Confidence`;
- a payload `modelKey`, such as `actions` or `bodyparts`; and
- additional evidence such as `observationCount`.

The corresponding `ai_runs.Models` JSON contains the concrete model identifier,
name, version, categories, and supported scopes needed to enrich the logical
model key.

## Terminology

### Segment Studio item

The stable Segment Studio metadata anchor defined by the editor and review modes
architecture. It may refer to a native Cove segment or contain an unpublished
extension-owned representation.

### Lineage node

A durable identity used only by provenance and derivation. A live lineage node
points to one Segment Studio item. If that item disappears outside Segment
Studio, the node temporarily remains as a missing endpoint so integrity repair
can identify the affected component.

Lineage nodes do not replace Segment Studio item IDs. They are created lazily
only for items that need provenance or derivation data.

### Source

A stable producer or upstream origin identified by a namespaced text key. Source
keys are open-ended data, not a closed enum.

### Activity

An import, migration, AI analysis, or other producing operation. Activities
carry run-level context shared by multiple provenance assertions.

### Provenance assertion

An immutable statement connecting a lineage node to a source and optional
activity/model evidence.

### Derivation rule

A versioned definition that maps a source tag to a derived tag. A rule may carry
additional extension-owned configuration in JSON.

### Derivation edge

A directed edge from a source lineage node to a derived lineage node, recording
the rule and the tag values observed when the edge was created.

### Lineage component

The complete weakly connected component obtained by traversing both incoming and
outgoing derivation edges. With branching or multiple parents, a component may
contain more than one root, branch, or path.

### Lineage orphan

A live node in a lineage component that contains a missing endpoint. Normal
Segment Studio operations must never create orphans. They can result from legacy
data, external API changes, an extension being disabled during a mutation,
manual database changes, or a historical failure.

## Core invariants

1. Every live lineage node points to exactly one Segment Studio item.
2. A Segment Studio item has at most one live lineage node.
3. A derivation edge connects two different nodes.
4. Source and derived nodes belong to the same video.
5. The derivation graph is acyclic.
6. Duplicate edges for the same source, derived node, rule, and rule version are
   prohibited.
7. Every live edge records the source and derived tag IDs observed when it was
   created or last reconciled.
8. A live derived node's current tag equals the expected output tag of every
   applicable incoming edge.
9. Segment Studio does not allow a tag change for a node with a live incoming
   edge.
10. A provenance assertion never changes its historical source, activity,
    model, or confidence fields in place. Corrections append a replacement
    assertion and retire the incorrect assertion through an auditable operation.
11. Missing legacy facts remain null.
12. `Derived` is computed from incoming edges and is never persisted as a source
    key or review state.
13. A normal Segment Studio deletion never leaves part of a lineage component
    behind.
14. A normal Segment Studio mutation either commits all canonical, provenance,
    derivation, and cleanup-outbox changes or commits none of them.
15. A normal permanent deletion removes the deleted component's lineage nodes,
    provenance assertions, and edges. Missing lineage nodes survive only when an
    external mutation makes repair necessary.

## Data model

The tables below are extension-owned. Names are illustrative but should be used
consistently unless implementation reveals a concrete naming conflict.

### Source catalog

Reuse and complete the existing `segment_studio_sources` table:

```text
segment_studio_sources
  id                         bigint primary key
  key                        text not null
  display_name               text not null
  category                   varchar null
  provider                   varchar null
  default_model_identifier   varchar null
  description                text null
  metadata                   jsonb not null default '{}'
  created_at                 timestamptz not null
  updated_at                 timestamptz not null
```

Required constraints and indexes:

- unique index on `key`;
- check that `key = lower(trim(key))` and `key <> ''`;
- optional index on `category`;
- keys are compared ordinally and stored lowercase.

The API accepts new source keys without a database migration. Registration uses
an idempotent upsert. Existing display metadata may be updated, but the key is
immutable once referenced.

Initial source rows:

| Key | Display name | Category | Provider |
|---|---|---|---|
| `user` | User | manual | Cove |
| `stash-marker-studio:manual` | Stash Marker Studio Manual | manual | Stash Marker Studio |
| `stash-marker-studio:skier-ai` | Skier AI via Stash Marker Studio | ai | Stash Marker Studio |
| `tpdb` | The Porn Database | external | TPDB |
| `ext:ai.tagging` | Cove AI Tagging | ai | Cove |

The migration may register additional source keys encountered in source data,
but it must report them before applying.

### Activities

Add:

```text
segment_studio_provenance_activities
  id                         uuid primary key
  key                        text not null
  kind                       varchar not null
  source_id                  bigint not null
  external_run_id            text null
  status                     varchar null
  started_at                 timestamptz null
  completed_at               timestamptz null
  request                    jsonb null
  models                     jsonb null
  summary                    jsonb null
  metadata                   jsonb not null default '{}'
  created_at                 timestamptz not null
  updated_at                 timestamptz not null
```

Initial `kind` values:

- `ai-analysis`;
- `migration`;
- `import`;
- `manual`.

`kind` is a controlled extension value. `key` and source keys remain open-ended.

Required constraints and indexes:

- unique index on `key`;
- foreign key from `source_id` to `segment_studio_sources` with delete restrict;
- index on `(source_id, external_run_id)`;
- index on `kind`;
- unique partial index on `(source_id, external_run_id)` where
  `external_run_id is not null`.

Example activity keys:

```text
ai-run:<cove-run-key>
sms-migration:<source-instance-fingerprint>:<plan-fingerprint>
```

For Cove AI, the activity snapshots relevant run data from `ai_runs`. It does
not require `ai_runs` to be retained forever and therefore does not use a
cascading foreign key. `external_run_id` stores `ai_runs.RunKey`.

### Lineage nodes

Add:

```text
segment_studio_lineage_nodes
  id                         uuid primary key
  item_id                    bigint null
  state                      varchar not null
  last_known_video_id        integer not null
  last_known_tag_id          integer null
  last_known_start_sec       double precision null
  last_known_end_sec         double precision null
  missing_since              timestamptz null
  created_at                 timestamptz not null
  updated_at                 timestamptz not null
```

`state` values:

- `live`;
- `missing`.

Required constraints and indexes:

- unique partial index on `item_id` when non-null;
- foreign key from `item_id` to `segment_studio_items` with delete restrict;
- last-known video and tag IDs are deliberately scalar snapshots without foreign
  keys, so deletion of the referenced canonical data cannot erase or block
  integrity evidence;
- check that `live` requires `item_id` and no `missing_since`;
- check that `missing` requires null `item_id` and a `missing_since`;
- indexes on `state`, `last_known_video_id`, and `last_known_tag_id`.

The service updates the last-known canonical snapshot whenever it validates a
live node. A `BEFORE DELETE` database trigger on `segment_studio_items` clears
the related node's `item_id`, sets its state to `missing`, and records
`missing_since` in the same transaction. Clearing the reference allows the item
deletion to satisfy the restrictive foreign key. This is a detection mechanism,
not normal soft deletion. Segment Studio's own full-component deletion removes
the lineage nodes before deleting their items, after capturing its operation
receipt, so the trigger has no node to preserve.

### Provenance assertions

Replace the unused workspace-marker-bound
`segment_studio_marker_provenance` table with:

```text
segment_studio_segment_provenance
  id                         bigint primary key
  lineage_node_id            uuid not null
  source_id                  bigint not null
  relation                   varchar not null
  activity_id                uuid null
  model_key                  text null
  model_identifier           text null
  model_version              text null
  confidence                 real null
  recorded_at                timestamptz null
  metadata                   jsonb not null default '{}'
  superseded_at              timestamptz null
  created_at                 timestamptz not null
  updated_at                 timestamptz not null
```

`relation` values:

- `origin`: the source directly produced the segment;
- `inherited`: the source was carried through a derivation edge from an
  ancestor.

Required constraints and indexes:

- foreign key from `lineage_node_id` to lineage nodes with delete cascade;
- foreign key from `source_id` to sources with delete restrict;
- nullable foreign key from `activity_id` to activities with delete restrict;
- confidence check between `0` and `1`;
- relation check;
- indexes on lineage node, source, activity, model identifier, and recorded
  time;
- a partial unique index using `NULLS NOT DISTINCT` over lineage node, source,
  relation, activity, model key, model identifier, and model version where
  `superseded_at is null`.

`metadata` stores source-specific evidence only. Examples include:

```json
{
  "observationCount": 4,
  "sourceLabel": "Marker Source: Skier AI"
}
```

Legacy marker IDs do not belong in this table.

### Derivation rules

Add:

```text
segment_studio_derivation_rules
  id                         uuid primary key
  key                        text not null
  version                    text not null
  source_tag_id              integer not null
  derived_tag_id             integer not null
  enabled                    boolean not null
  metadata                   jsonb not null default '{}'
  created_at                 timestamptz not null
  updated_at                 timestamptz not null
```

Required constraints and indexes:

- foreign keys to tags with delete restrict;
- unique index on `(key, version, source_tag_id, derived_tag_id)`;
- indexes on source tag, derived tag, and enabled state;
- check that source and derived tags differ.

The rule version must be immutable. Changing rule behavior creates a new version.
Legacy edges whose rules cannot be reconstructed still retain their original
`rule_id` and tag snapshots. They use a disabled placeholder rule with metadata
explaining that executable rule configuration is unavailable.

### Derivation edges

Add:

```text
segment_studio_derivation_edges
  id                         bigint primary key
  source_node_id             uuid not null
  derived_node_id            uuid not null
  rule_id                    uuid not null
  source_tag_id_at_creation  integer not null
  derived_tag_id_at_creation integer not null
  activity_id                uuid null
  recorded_at                timestamptz null
  metadata                   jsonb not null default '{}'
  created_at                 timestamptz not null
  updated_at                 timestamptz not null
```

Required constraints and indexes:

- foreign keys from source and derived node IDs to lineage nodes with delete
  cascade;
- foreign key to derivation rules with delete restrict;
- nullable foreign key to activities with delete restrict;
- foreign keys to tag snapshots with delete restrict;
- source node must differ from derived node;
- unique index on `(source_node_id, derived_node_id, rule_id)`;
- indexes on source node, derived node, rule, and activity.

Graph-cycle prevention, same-video enforcement, and rule compatibility require
current segment values and recursive traversal, so they are service invariants
rather than simple database checks.

Legacy `depth` is retained as `metadata.legacyDepth`. Operational depth is
computed from the current graph and is never trusted from imported data.

### Integrity issues

Add:

```text
segment_studio_lineage_issues
  id                         uuid primary key
  issue_fingerprint          text not null
  component_key              text not null
  issue_kind                 varchar not null
  state                      varchar not null
  lineage_node_id            uuid null
  edge_id                    bigint null
  details                    jsonb not null
  first_detected_at          timestamptz not null
  last_detected_at           timestamptz not null
  resolved_at                timestamptz null
  resolution                 jsonb null
```

Initial issue kinds:

- `missing-item`;
- `missing-source`;
- `missing-derived`;
- `derived-tag-mismatch`;
- `source-tag-mismatch`;
- `rule-missing`;
- `rule-version-missing`;
- `rule-no-longer-matches`;
- `cycle`;
- `cross-video-edge`;
- `partial-component-deletion`;
- `provenance-mismatch`.

Initial states:

- `open`;
- `resolved`;
- `ignored`.

`component_key` is a deterministic hash of the sorted lineage node IDs and edge
IDs observed during the scan. It groups issues for one repair preview without
becoming permanent segment identity.

Required constraints and indexes:

- nullable foreign keys from `lineage_node_id` and `edge_id` with delete set
  null, preserving the issue record when its subject is removed;
- checks for the allowed issue kinds and states;
- check that `resolved` requires `resolved_at`;
- unique active issue fingerprint derived from issue kind, component key, node,
  edge, and normalized details;
- indexes on state, issue kind, component key, node, and edge.

Add resumable scan state:

```text
segment_studio_lineage_scan_runs
  id                         uuid primary key
  scope                      varchar not null
  scope_key                  text null
  state                      varchar not null
  cursor                     jsonb null
  source_fingerprint         text null
  counts                     jsonb not null default '{}'
  requested_by_user_id       integer null
  started_at                 timestamptz null
  completed_at               timestamptz null
  last_error                 text null
  created_at                 timestamptz not null
  updated_at                 timestamptz not null
```

Initial scope values are `full`, `video`, and `component`. Initial state values
are `pending`, `running`, `completed`, `failed`, and `cancelled`. Permit only one
active full scan using a partial unique index. Require `scope_key` to be null for
a full scan and present for targeted scans. Cursor updates and issue upserts
commit once per bounded batch so a stopped scan resumes without repeating
completed ranges.

### Deletion confirmation

The pre-release deletion-policy preference is absent from the 1.0 baseline. Segment
deletion always previews its dependency-aware effects and requires UI
confirmation.

## Provenance mapping

### Stash Marker Studio

Migration maps source tags as follows:

| Source data | Source key | Relation |
|---|---|---|
| Manual with no incoming derivation edge | `stash-marker-studio:manual` | `origin` |
| Skier AI with no incoming derivation edge | `stash-marker-studio:skier-ai` | `origin` |
| TPDB with no incoming derivation edge | `tpdb` | `origin` |
| Manual with an incoming derivation edge | `stash-marker-studio:manual` | `inherited` |
| Skier AI with an incoming derivation edge | `stash-marker-studio:skier-ai` | `inherited` |
| TPDB with an incoming derivation edge | `tpdb` | `inherited` |

The migration activity records that the assertions were imported from Stash
Marker Studio. It does not replace the upstream origin source.

The imported derivation graph, not the legacy `Derived` tag, is authoritative
for `origin` versus `inherited`. The tag is validation evidence. A marker tagged
Derived without an incoming edge, or an edge target lacking the Derived tag,
must be reported as a typed migration discrepancy. The migration must not create
an edge merely from the tag or discard a real edge because the tag is absent.

Legacy provenance fields:

| Field | Value |
|---|---|
| Activity | SMS migration activity |
| Model key | null |
| Model identifier | null unless independently verified |
| Model version | null |
| Confidence | null |
| Recorded at | source timestamp when available, otherwise null |
| Metadata | original source label and non-identity migration evidence |

### Cove AI

For a native Cove AI segment:

| Provenance field | Cove input |
|---|---|
| Source | `Segment.SourceKey` |
| Relation | `origin` |
| Activity external run ID | `Segment.SourceRunId` |
| Activity run snapshot | matching `ai_runs` row |
| Model key | `Segment.Payload.modelKey` |
| Model identifier/version | model selected from `ai_runs.Models` for the logical key |
| Confidence | `Segment.Confidence` |
| Recorded at | `Segment.CreatedAt` |
| Metadata | remaining source payload such as observation count |

If a run cannot be found, provenance remains valid with its source and run key.
The integrity scanner reports the missing enrichment but does not fabricate a
model identity.

If a logical model key resolves ambiguously to more than one concrete model, all
candidate evidence is retained in metadata and the assertion remains visibly
ambiguous until repaired.

### Manual Cove segments

Native segments with the default `user` source receive an `origin` assertion
from `user`. No activity or confidence is required.

### Inherited provenance

Active inherited assertions are a materialized projection of the graph. Creating
an edge computes the active origin/inherited assertions reachable from every
parent and appends any missing assertions to the derived node with relation
`inherited`. The copied assertion retains the original source and
activity/model evidence.

After any graph mutation, recompute the desired inherited assertion set in
topological order. Retire an active inherited assertion only when no remaining
incoming path supports the same source and evidence. If one of several
supporting paths disappears, leave the assertion active. Do not store a single
"responsible edge" as authoritative metadata because multi-parent graphs can
provide several equivalent paths.

The SMS import may expose an inherited source label that is not reachable from
the completed graph. Preserve that assertion as imported evidence, mark the
component with `provenance-mismatch`, and require an explicit repair choice
rather than silently rewriting the legacy record. Origin assertions on a
derived node are never removed by edge reconciliation.

## Derivation behavior

### Creating a derived segment

The creation service must:

1. Authorize read and edit access to the source item and create access to the
   target representation.
2. Ensure the source item has a live lineage node.
3. Resolve an enabled rule version matching the source tag.
4. Create the derived segment as an otherwise normal Segment Studio item.
5. Set the derived tag from the rule; callers cannot supply a different tag.
6. Ensure the derived item has a live lineage node.
7. Reject a cross-video edge.
8. Reject a duplicate edge or cycle.
9. Insert the edge with source and derived tag snapshots.
10. Add inherited provenance assertions.
11. Increment affected item/workspace revisions and invalidate relevant caches.
12. Commit all records in one transaction.

### Multiple parents

Multiple incoming edges are allowed when all applicable rules agree on the
derived tag. A new edge that would imply a different tag is rejected.

Deletion and integrity operations traverse the complete connected component, so
multi-parent graphs may have a much larger impact than one visible path.

### Tag editing

The API, not only the UI, enforces tag immutability:

- if the selected node has any live incoming edge, return a typed
  `DERIVED_TAG_IMMUTABLE` conflict;
- include the incoming edge and rule summaries needed by the UI;
- do not silently detach the node from its parents;
- do not offer an override in the first version.

The editor renders the tag field read-only, displays the rule-derived reason, and
offers navigation to the parent segments.

### Root tag changes

A node with outgoing edges and no incoming edge is an editable root. Before
changing its tag, Segment Studio prepares a reconciliation preview over the
complete lineage component.

For the first version:

1. Apply the proposed root tag in memory.
2. Re-evaluate every reachable edge in deterministic topological order.
3. Preserve an edge only when its recorded rule version accepts the current
   source tag and still produces the current derived tag.
4. Mark the first invalid edge on each path for removal.
5. Mark every descendant that is reachable only through invalid edges for
   deletion.
6. Preserve a multi-parent descendant when at least one valid incoming path
   remains and all retained incoming rules agree on its tag.
7. Recompute inherited provenance from the retained graph.
8. Present the affected edges and descendant count when any deletion is needed.
9. Commit the root edit, descendant deletions, edge changes, inherited
   provenance changes, and cleanup-outbox entries atomically.

If all existing edges remain valid, update their source tag snapshots as part of
the same transaction.

The first version does not create new descendants for rules that become
applicable after the tag change. The resulting root may stand alone. A later
regeneration feature may add expected descendants after reconciliation.

An intermediate node has an incoming edge and is therefore tag-locked even when
it also has outgoing edges.

## Deletion behavior

### Resolve the deletion scope

Deleting any live item with lineage first computes the complete weakly connected
component by recursively traversing both incoming and outgoing edges.

The lineage delete preference applies when the component contains at least one
derivation edge. A singleton node carrying only provenance follows the ordinary
single-segment delete flow; its assertions and node are deleted in the same
transaction.

The preview contains:

- selected item;
- all component nodes and edges;
- roots, leaves, and missing endpoints;
- affected video count;
- native versus extension-owned item counts;
- review-state counts;
- published segment count;
- blob cleanup count;
- permission failures;
- integrity warnings; and
- a component revision fingerprint.

The component fingerprint hashes sorted node IDs, edge IDs, item revisions,
native segment update timestamps, and open integrity issue revisions.

### Apply the user policy

`keep`:

- if the selected item has any lineage edge, block deletion;
- explain that lineage components are retained as a unit;
- offer navigation to the component;
- allow deletion only after the user changes the policy or invokes an explicit
  full-component action.

`confirm_remove`:

- show the full preview;
- require confirmation for the entire component;
- execute only if the preview fingerprint still matches.

`remove`:

- skip the ordinary confirmation dialog;
- still perform authorization, revision, integrity, and transaction checks;
- show the removed component count after success.

### Execute deletion

The deletion service must:

1. Resolve the component again inside the transaction.
2. Lock node, edge, item, native segment, and cleanup-outbox rows in stable ID
   order.
3. Compare the current component fingerprint with the requested fingerprint.
4. Authorize deletion of every live item and native segment.
5. Refuse partial execution if any item cannot be deleted.
6. Capture a durable operation receipt without legacy marker IDs.
7. Delete or retire canonical representations using the existing Segment Studio
   blob-cleanup outbox behavior.
8. Delete the component's edges, assertions, nodes, and resolved integrity
   issues.
9. Invalidate segment, video, display-profile, and Segment Studio caches.
10. Commit once.

The operation accepts a caller-supplied UUID idempotency key. Retrying the same
successful operation returns its existing receipt.

Deletion through Segment Studio works in both directions because scope is based
on the whole connected component. Selecting a derived node can therefore delete
its ancestors, siblings, and other descendants.

## External mutation and integrity

### Changes Segment Studio cannot prevent

Cove core APIs, another extension, or manual database operations may:

- change a derived segment's tag;
- change a root tag without reconciling descendants;
- delete a segment or Segment Studio item;
- change or remove a derivation rule;
- create a cross-video or cyclic legacy edge; or
- partially mutate a component.

Segment Studio must detect these conditions rather than pretending the graph is
valid.

### Fast validation

When opening a video or lineage panel, validate only components touched by the
returned items:

- compare live item and node snapshots;
- compare source and derived tags with edge snapshots and rule results;
- check missing endpoints;
- check same-video membership;
- detect cycles in the loaded component; and
- return open issue summaries with the editor payload.

An inconsistent component is visible but clearly marked. Segment Studio blocks:

- publication or review completion involving the component;
- tag editing of its derived members;
- creation of additional derivations from it; and
- ordinary single-item deletion.

### Full scan

Provide a maintenance operation that scans all lineage nodes and edges in
bounded, resumable batches. It records progress, counts, issues, and a source
snapshot fingerprint. Re-running an unchanged scan is idempotent.

The scan must not repair or delete data without a separate authorized action.

### Repair actions

Initial repair actions:

- **Restore expected derived tag:** set an externally changed derived tag back to
  the value required by all valid incoming rules.
- **Recalculate from root:** retain valid edges, delete invalid descendants, and
  recompute inherited provenance using the root-tag reconciliation algorithm.
- **Remove component:** apply the configured keep/confirm/remove deletion policy
  to the remaining connected component.
- **Ignore:** retain an issue for audit but remove it from the active repair
  queue. Ignoring does not make the component publishable.

If a missing endpoint splits the graph, component removal follows all retained
lineage-node connections, including missing nodes, so every known remainder of
the original component is included.

Repairs require a preview fingerprint and execute transactionally.

## API contract

Use the installed Segment Studio route prefix. The initial resource contract is:

```text
GET  /api/plugins/segment-studio/preferences
PUT  /api/plugins/segment-studio/preferences

GET  /api/plugins/segment-studio/sources
POST /api/plugins/segment-studio/sources

GET  /api/plugins/segment-studio/items/{itemId}/provenance
POST /api/plugins/segment-studio/items/{itemId}/provenance

GET  /api/plugins/segment-studio/items/{itemId}/lineage
POST /api/plugins/segment-studio/items/{itemId}/derive

POST /api/plugins/segment-studio/items/{itemId}/tag-change/preview
POST /api/plugins/segment-studio/items/{itemId}/tag-change/execute

POST /api/plugins/segment-studio/items/{itemId}/delete/preview
POST /api/plugins/segment-studio/items/{itemId}/delete/execute

POST /api/plugins/segment-studio/maintenance/lineage/scans
GET  /api/plugins/segment-studio/maintenance/lineage/scans/{scanId}
GET  /api/plugins/segment-studio/maintenance/lineage/issues
POST /api/plugins/segment-studio/maintenance/lineage/issues/{issueId}/repair/preview
POST /api/plugins/segment-studio/maintenance/lineage/issues/{issueId}/repair/execute
```

Mutation requests include:

- an idempotency key;
- expected item revision;
- expected component fingerprint when lineage is affected; and
- the operation-specific payload.

The preference response and update DTO contain only the existing workflow
`mode`. A scan start returns `202 Accepted` and a scan ID. Preview responses
return `200 OK` with a deletion fingerprint. Stale previews and domain
conflicts return `409 Conflict`; missing resources return `404 Not Found`; and
authorization failures return `403 Forbidden`.

Typed conflict codes:

- `DERIVED_TAG_IMMUTABLE`;
- `LINEAGE_COMPONENT_PROTECTED`;
- `LINEAGE_COMPONENT_CHANGED`;
- `LINEAGE_COMPONENT_INCONSISTENT`;
- `LINEAGE_CYCLE`;
- `LINEAGE_CROSS_VIDEO`;
- `LINEAGE_RULE_MISMATCH`;
- `LINEAGE_PERMISSION_DENIED`;
- `PROVENANCE_SOURCE_UNKNOWN`;
- `PROVENANCE_RUN_AMBIGUOUS`.

Read DTOs expose:

- source key and display metadata;
- relation;
- activity kind and external run ID;
- model key, identifier, and version;
- confidence and recorded time;
- derivation parents and children;
- rule key and version;
- derived/read-only status;
- component size and integrity state; and
- source-specific metadata only to callers authorized to see it.

All extension endpoints must explicitly declare Cove permission policies.

## Permissions

Use the existing Segment Studio read/edit/delete permissions where their meaning
already matches the operation. Add dedicated permissions only where the existing
contract is insufficient:

```text
segment-studio.provenance.read
segment-studio.provenance.manage
segment-studio.lineage.manage
segment-studio.lineage.maintenance
```

Principles:

- reading provenance requires access to the underlying segment and provenance
  read permission;
- creating a derivation requires edit access to the source and create/edit access
  to the derived representation;
- full-component deletion requires delete access to every live member;
- maintenance scanning requires maintenance permission;
- repair additionally requires the permissions needed by every resulting
  canonical mutation.

The API returns the blocked members in a redacted aggregate rather than leaking
unauthorized segment details.

## User interface

### Provenance display

The selected-segment panel shows:

- source display name and stable key;
- origin or inherited relation;
- AI run identifier when available;
- logical and concrete model identity;
- model version;
- confidence;
- recorded time; and
- a link to the lineage panel for derived segments.

Unknown values display as unknown, not as inferred placeholders.

### Lineage panel

The panel shows the complete component as an accessible tree or graph summary:

- roots and derived descendants;
- tags and time ranges;
- rule names and versions;
- native/published versus extension-owned state;
- review state;
- missing nodes;
- integrity warnings; and
- component size.

Multiple-parent nodes appear once with all parent relationships represented.

### Tag editor

For a derived segment:

- render tag selection read-only;
- explain which rule determines the tag;
- provide navigation to parents;
- keep ordinary timing, review, publication, and metadata controls available
  unless another invariant blocks them.

For a root with descendants:

- allow tag selection;
- prepare reconciliation before saving;
- show descendant deletions when required;
- execute the edit only after required confirmation.

### Deletion settings

Under Segment Studio settings, expose:

```text
When deleting a segment in a derivation chain
  Keep the complete chain
  Confirm and remove the complete chain
  Remove the complete chain
```

Explain that deleting any member may include ancestors, siblings, and
descendants. `Confirm and remove` is selected by default.

### Integrity maintenance

Provide:

- open issue count;
- scan status and last completed time;
- filters by issue kind, video, source, and rule;
- repair preview;
- restore, recalculate, remove, and ignore actions; and
- exportable machine-readable results.

## Stash Marker Studio migration

### Preconditions

1. Complete the existing marker-to-item replacement mapping.
2. Verify every legacy marker selected for provenance has exactly one replacement
   receipt.
3. Verify every derivation endpoint selected for import resolves through those
   receipts.
4. Freeze and fingerprint source marker, source-tag, derivation, and rule data.
5. Register all planned source and placeholder rule rows.
6. Produce a dry-run report before any mutation.

### Dry-run report

Report:

- source-tag counts and combinations;
- markers lacking a recognized non-derived source;
- markers with conflicting non-derived sources;
- derivation edge count;
- unresolved source and derived endpoints;
- self-edges;
- cycles;
- cross-video edges;
- missing rules;
- rule/tag mismatches;
- duplicate edges;
- provenance assertion counts by source and relation;
- component size distribution;
- largest components; and
- records that would remain migration-only.

Do not apply while unresolved endpoints, cycles, or cross-video edges remain
unless an explicit reviewed exclusion file accounts for every affected record.

### Apply

For each replacement item:

1. Ensure its lineage node.
2. Translate the non-derived source tag into a source assertion.
3. Use `origin` when the marker has no imported incoming derivation edge.
4. Use `inherited` when the marker has an imported incoming derivation edge.
5. Attach the SMS migration activity.
6. Leave unknown model, run, confidence, and timestamps null.

For each legacy derivation:

1. Resolve source and derived replacement items through migration receipts.
2. Resolve or create the versioned rule/placeholder.
3. Validate same-video and acyclic insertion.
4. Insert the edge and tag snapshots.
5. Store legacy depth and source creation time as metadata/evidence.
6. Recompute inherited provenance from the completed graph.

Apply in deterministic, idempotent batches. A repeated apply against unchanged
inputs produces no additional assertions or edges.

### Receipts and legacy IDs

The existing replacement receipt tables may continue to map:

```text
source instance + legacy marker ID -> Segment Studio item
```

until migration reconciliation and human sign-off are complete. This is
temporary migration state, not retained product metadata.

No source marker ID is copied into:

- source catalog rows;
- activities;
- lineage nodes;
- provenance assertions;
- derivation rules; or
- derivation edges.

After sign-off:

1. Export the final aggregate reconciliation report and its fingerprints to the
   protected migration artifacts.
2. Verify provenance, graph, and stable item IDs without consulting the
   marker-ID receipts.
3. Delete live receipt and receipt-provenance rows containing source marker IDs,
   including both marker-migration and marker-replacement mappings.
4. Null or remove `legacy_marker_id` from inactive workspace records under the
   existing compatibility cleanup plan.
5. Prove with a catalog-driven SQL check that no live Segment Studio table has a
   legacy marker-ID column and no extension-owned JSON payload has a legacy
   marker-ID key.

The frozen private source data and reviewed migration artifacts remain the audit
record. Runtime Segment Studio data does not retain the legacy identity.

### Migration acceptance

The migration report must account for:

- all 10,727 source markers;
- all observed source-tag combinations;
- all 5,984 legacy derivation edges or an explicit reviewed exclusion for each
  omitted edge;
- every source and derived endpoint;
- every rule ID;
- all multi-parent and multi-level relationships; and
- the difference between `Derived`-tag counts and edge-target counts.

## Cove AI provenance ingestion

This slice records provenance for native AI segments without changing their
publication or review behavior.

For each eligible native segment:

1. Ensure a native-backed Segment Studio item.
2. Ensure a lineage node.
3. Register or resolve the segment's source key.
4. Resolve or create an activity from its source run ID.
5. Snapshot the matching `ai_runs` request, models, summary, and timestamps.
6. Resolve the payload model key to the best concrete run model.
7. Insert an origin assertion with confidence and remaining evidence.
8. Report missing or ambiguous run/model enrichment.

Ingestion is idempotent and may run:

- on explicit maintenance import;
- lazily when Segment Studio first anchors a native AI segment; and
- incrementally for native segments created after the last import.

This does not convert the native segment into a draft.

## Existing schema transition

The current database contains:

- an empty `segment_studio_sources` table without a unique key index;
- an empty `segment_studio_marker_provenance` table tied to obsolete
  `segment_studio_workspace_markers`;
- inactive workspace tables containing `original`/`derived` role columns; and
- the newer stable `segment_studio_items` representation.

Migration steps:

1. Assert that old source/provenance tables are empty or export their contents
   for an explicit conversion.
2. Add source metadata and uniqueness constraints.
3. Create activities, lineage nodes, segment provenance, rules, edges, issues,
   and user preference fields.
4. Point all new metadata at lineage nodes backed by stable Segment Studio
   items.
5. Stop reading `segment_studio_workspace_markers.role`,
   `legacy_source`, and `legacy_marker_id`.
6. Rename or drop the obsolete marker provenance table only after an empty/data
   conversion guard passes.
7. Leave removal of the broader inactive workspace schema to its existing
   compatibility cleanup plan.

The extension migration framework is forward-only. The unpublished dogfood
database therefore uses a separately reviewed receipt rebaseline after its
workspace conversion is complete. Once lineage data exists, rollback requires
an explicit lineage export and database restore or forward repair because
downgrading to workspace-marker provenance would lose information.

## Service boundaries

Implement narrow services instead of embedding graph logic in controllers:

```text
ISegmentSourceRegistry
ISegmentProvenanceService
IProvenanceActivityService
ILineageNodeService
IDerivationRuleService
IDerivationGraphService
ILineageMutationService
ILineageIntegrityService
ILineageMigrationService
```

Responsibilities:

- source registry normalizes and resolves ad hoc keys;
- provenance service appends and queries assertions;
- activity service captures migration and AI run context;
- node service anchors live items and records missing endpoints;
- rule service resolves immutable rule versions;
- graph service performs traversal, cycle detection, and validation;
- mutation service owns derive, tag reconcile, and component delete
  transactions;
- integrity service scans, previews, and repairs;
- migration service performs idempotent SMS and Cove AI ingestion.

Controllers validate DTO shape and delegate. They must not independently
implement graph traversal or deletion scope.

## Concrete code touchpoints

Implement this work in the editable MidnightRider checkout exposed through
`COVE_MIDNIGHT_RIDER_WORKSPACE`.

| Concern | Existing file to extend or pattern to follow |
| --- | --- |
| Entities, constraints, and EF mappings | `src/SegmentStudio/SegmentStudioModels.cs` |
| Initial schema | `src/SegmentStudio/SegmentStudioBaseline.sql` |
| Migration registration, endpoint registration, and authorization wiring | `src/SegmentStudio/SegmentStudioExtension.cs` |
| Workflow preference persistence | `src/SegmentStudio/SegmentStudioUserPreferenceService.cs` |
| Native segment edits and derived-tag enforcement | `src/SegmentStudio/DirectSegmentReviewService.cs` |
| Draft creation/editing and derived-tag enforcement | `src/SegmentStudio/SegmentStudioDraftService.cs` |
| Native/draft identity transitions | `src/SegmentStudio/SegmentOwnershipTransitionService.cs` |
| Dependency-aware single and bulk deletion | `src/SegmentStudio/SegmentLineageDeletionService.cs` |
| Existing idempotent operation-journal pattern | `src/SegmentStudio/SegmentStudioReviewCompletionService.cs`, `src/SegmentStudio/SegmentStudioDraftService.cs`, and `src/SegmentStudio/SegmentOwnershipTransitionService.cs` |
| UI settings, provenance display, lineage panel, and confirmation flows | `src/SegmentStudio/ui/SegmentStudio.js` |
| Migration extension point | `scripts/segment-studio-marker-migration.py` |
| Server-side tests | `tests/SegmentStudio.Tests/SegmentStudio.Tests.csproj` |
| UI source and behavior tests | `tests/SegmentStudio.Tests/SegmentStudioUi.test.mjs` |

Add the narrow service implementations from the preceding section as separate
files under `src/SegmentStudio`. Do not make the extension endpoint file
the graph domain layer.

At each slice, update `ExtensionTests.cs` to assert the ordered migration name,
important constraints, and endpoint/permission registrations. Extend the
existing migration script instead of creating a second independent SMS import
path. Preserve its current plan/fingerprint/apply discipline and add provenance
and derivation to that same reviewed artifact.

## Concurrency and idempotency

### Component locking

Graph mutations:

1. Resolve the candidate component.
2. Sort node and item IDs.
3. acquire transaction-scoped advisory locks derived from those IDs or lock rows
   with `FOR UPDATE` in that stable order;
4. resolve the component again;
5. compare the preview fingerprint; and
6. mutate only if unchanged.

This prevents two overlapping component operations from partially interleaving.

### Operation receipts

Extend the existing `segment_studio_segment_operations` journal with a nullable
`component_fingerprint` column. Continue to use its existing
`result_payload` JSON for operation-specific results:

```text
operation_id
kind
actor_user_id
request_fingerprint
component_fingerprint
result
created_at
```

Kinds include:

- `derive`;
- `root-tag-reconcile`;
- `delete-component`;
- `repair-derived-tag`;
- `repair-component`;
- `import-provenance`;
- `import-derivations`.

The same operation ID and request fingerprint returns the recorded result.
Reusing an operation ID with a different request fails.

## Audit and observability

Record audit events for:

- source registration;
- manual provenance correction;
- derivation creation;
- blocked derived tag edits;
- root tag reconciliation;
- component deletion preview and execution;
- integrity scan completion;
- repair preview and execution;
- SMS import; and
- Cove AI provenance ingestion.

Metrics:

- provenance assertions by source and relation;
- activities by kind and status;
- live and missing lineage nodes;
- edges and component size distribution;
- derived tag conflicts;
- open integrity issues by kind;
- blocked deletion count;
- component deletion count and size;
- scan duration and rows processed; and
- migration/import unresolved counts.

Logs must use internal IDs and counts appropriate for private diagnostics, but
issue and pull-request material must not include environment domains, explicit
entity IDs, or library entity names.

## Implementation slices

Each slice should be independently reviewable and leave the database in a valid
state.

### Slice execution protocol

For every slice:

1. Start from the current signed MidnightRider branch and preserve unrelated
   user changes.
2. Add a focused failing server or UI test for the next behavior.
3. Implement the smallest complete schema and service change that makes the
   focused test pass while maintaining the invariants in this document.
4. Run the focused tests, then the full Segment Studio server and UI suites.
5. For UI or integration behavior, package and reinstall `segment-studio`, then
   verify the user path with `playwright-cli` before using SQL as supporting
   evidence.
6. Record forward-migration and rollback-rehearsal results, test counts,
   warnings, and any generated or dirtied files.
7. Update this plan if implementation reveals a changed contract; do not let
   code silently diverge from the plan.
8. Before offering a commit, prepare the project handoff and run the required
   high-effort subagent review over the complete diff. Resolve blocking
   findings and rerun affected verification.
9. During development, keep each slice independently reviewable. Before the
   unpublished 1.0 release, those implementation commits may be squashed after
   the migration chain is replaced by its verified baseline. Keep any future
   data-migration apply separate from schema or runtime-service changes.

### Slice 1: Schema and source registry

Deliver:

- source catalog constraints and metadata;
- activities;
- lineage nodes;
- provenance assertions;
- rule and edge tables;
- integrity issues;
- deletion preference;
- operation receipts;
- entity mappings and repositories.

Tests:

- migration from an empty current schema;
- source-key normalization and uniqueness;
- live/missing node constraints;
- assertion confidence and relation constraints;
- edge uniqueness and foreign keys;
- default user preference;
- guarded conversion of old empty provenance tables.

Exit criteria:

- schema migrates forward from both a fresh and current Segment Studio schema;
- repeat extension startup skips already-applied migrations safely;
- the receipt rebaseline is rehearsed against a disposable database copy;
- all constraints fail with typed test evidence;
- no runtime behavior changes.

### Slice 2: Provenance services and read UI

Deliver:

- source registry;
- activity capture;
- assertion append/query;
- provenance DTOs and permissions;
- selected-segment provenance display;
- source/activity/model filters where existing filtering contracts allow them.

Tests:

- ad hoc source registration;
- multiple assertions per segment;
- origin versus inherited display;
- null legacy fields;
- confidence bounds;
- authorization and redaction;
- stable provenance across native/draft representation transitions.

Exit criteria:

- manually seeded SMS-style and Cove-AI-style assertions render correctly;
- representation transitions do not change the lineage node or assertions.

### Slice 3: Derivation graph and creation

Deliver:

- immutable rule registry;
- graph traversal and cycle detection;
- derivation creation;
- inherited provenance propagation;
- derived tag read-only enforcement in API and UI;
- lineage panel.

Tests:

- simple parent/child;
- multi-level chain;
- one parent with multiple children;
- multiple parents with agreeing tags;
- conflicting multi-parent tags;
- duplicate edge;
- self-edge;
- cycle;
- cross-video edge;
- inherited assertion addition/removal;
- direct API attempt to retag a derived segment.

Exit criteria:

- every created edge satisfies all graph invariants;
- derived segments remain normal reviewable/publishable items;
- no Segment Studio route can change a derived tag.

### Slice 4: Root tag reconciliation

Deliver:

- reconciliation preview and fingerprint;
- topological rule validation;
- valid branch preservation;
- invalid descendant deletion;
- inherited provenance recomputation;
- editor confirmation.

Tests:

- root change preserving all descendants;
- root change invalidating one branch;
- root change invalidating all descendants;
- shared child with one remaining valid parent;
- intermediate derived node edit rejection;
- concurrent edit after preview;
- blob cleanup and rollback on failure.

Exit criteria:

- no successful root edit leaves an invalid live edge;
- no newly applicable descendants are created;
- all destructive effects are shown before execution.

### Slice 5: Atomic component deletion

Deliver:

- keep/confirm/remove preference;
- component preview;
- permission aggregation;
- fingerprint and locks;
- idempotent transactional deletion;
- operation receipt;
- settings and confirmation UI.

Tests:

- delete root, leaf, and intermediate node;
- branching and multi-parent components;
- keep policy blocks;
- confirm policy requires a matching preview;
- remove policy skips only UI confirmation;
- permission failure blocks the entire operation;
- concurrent component mutation blocks execution;
- native/draft mixed component;
- blob cleanup failure remains retryable;
- retry with same idempotency key.

Exit criteria:

- deletion from any component member removes all live members or none;
- normal deletion creates no missing nodes or orphan issues.

### Slice 6: External mutation detection and repair

Deliver:

- item-deletion missing-node trigger;
- fast per-video/component validation;
- resumable full scan;
- issue persistence;
- restore-tag, recalculate, remove, and ignore actions;
- maintenance UI and export.

Tests:

- externally changed derived tag;
- externally changed root tag;
- externally deleted parent;
- externally deleted child;
- missing rule version;
- legacy cycle and cross-video edge;
- repeated unchanged scan;
- repair preview invalidated by concurrent change;
- each repair action;
- ignored issues remain publication-blocking.

Exit criteria:

- every supported external inconsistency becomes a typed issue;
- scan performs no mutation;
- repairs are previewed, authorized, idempotent, and transactional.

### Slice 7: Stash Marker Studio provenance migration

Deliver:

- source/tag extraction;
- migration activity;
- provenance planning and apply;
- rule/edge planning and apply;
- dry-run and reconciliation reports;
- reviewed exclusion input;
- idempotent replay.

Tests use anonymized fixtures covering every observed source combination and:

- no source tag;
- conflicting source tags;
- Derived tag without an incoming edge;
- incoming edge without a Derived tag;
- missing endpoint;
- missing rule;
- duplicate edge;
- multi-parent graph;
- multi-level graph;
- cycle;
- derived-tag/count discrepancy;
- replay.

Exit criteria:

- all source markers and derivation edges are accounted for;
- imported graph passes the integrity scanner;
- after the sign-off cleanup gate, no live Segment Studio row or JSON payload
  retains a legacy marker-ID field.

### Slice 8: Native Cove AI provenance

Deliver:

- native AI segment discovery;
- native-backed item/node creation;
- activity snapshot from `ai_runs`;
- logical-to-concrete model resolution;
- incremental and explicit ingestion;
- unresolved enrichment report.

Tests:

- complete AI run;
- missing run;
- missing model key;
- ambiguous model resolution;
- null confidence;
- repeated ingestion;
- AI segment edited after analysis;
- native segment deleted externally.

Exit criteria:

- current AI samples show source, run, model, version, and confidence;
- ingestion does not change publication or review state;
- no AI output is redirected into drafts.

### Slice 9: Scale, documentation, and rollout

Deliver:

- query/index review using production-scale anonymized counts;
- full user documentation;
- administrator migration and repair guide;
- feature flag or installation-state gate;
- rollback/export procedure;
- telemetry dashboards.

Tests:

- large component traversal;
- large migration batch;
- scan resume;
- deletion preview response bounds;
- API pagination;
- accessibility and keyboard interaction;
- permissions for mixed-access components.

Exit criteria:

- no unbounded graph or source query;
- migration and scans are resumable;
- destructive behavior is documented and gated;
- rollout can be paused without losing receipts.

## Verification commands

Run extension tests from the editable MidnightRider checkout. Add the named test
classes as their corresponding slices are implemented:

```bash
source gitignored/dev/agent.env
dotnet test "$COVE_MIDNIGHT_RIDER_WORKSPACE/extensions/segment-studio/tests/SegmentStudio.Tests/SegmentStudio.Tests.csproj" \
  --configuration Debug \
  --filter FullyQualifiedName~Provenance
dotnet test "$COVE_MIDNIGHT_RIDER_WORKSPACE/extensions/segment-studio/tests/SegmentStudio.Tests/SegmentStudio.Tests.csproj" \
  --configuration Debug \
  --filter FullyQualifiedName~Derivation
dotnet test "$COVE_MIDNIGHT_RIDER_WORKSPACE/extensions/segment-studio/tests/SegmentStudio.Tests/SegmentStudio.Tests.csproj" \
  --configuration Debug \
  --filter FullyQualifiedName~Lineage
dotnet test "$COVE_SOURCE_ROOT/src/Cove.Tests/Cove.Tests.csproj" \
  --configuration Debug \
  --filter FullyQualifiedName~Segment
```

Run the full extension and UI suites before packaging:

```bash
source gitignored/dev/agent.env
dotnet test "$COVE_MIDNIGHT_RIDER_WORKSPACE/extensions/segment-studio/tests/SegmentStudio.Tests/SegmentStudio.Tests.csproj" \
  --configuration Debug
node --test "$COVE_MIDNIGHT_RIDER_WORKSPACE/extensions/segment-studio/tests/SegmentStudio.Tests/SegmentStudioUi.test.mjs"
```

Build the installable extension only through its repository-owned packager:

```bash
source gitignored/dev/agent.env
package-midnight-rider-extension \
  --repository "$COVE_MIDNIGHT_RIDER_WORKSPACE" \
  --extension segment-studio \
  --configuration Debug
```

Use the stable URL printed by the command in Cove's
**Settings → Extensions → Install from URL** flow. Rebuild and reinstall that
same URL after each code change; never copy build output into the extension
directory.

Live verification must use `playwright-cli` first:

```bash
source gitignored/dev/agent.env
playwright-cli open "$COVE_DEV_APP_URL/segment-studio"
playwright-cli snapshot
```

SQL verification is supporting evidence after the UI path:

```bash
source gitignored/dev/agent.env
cove-psql --no-psqlrc --command "
  SELECT 'sources' AS relation, count(*) FROM segment_studio_sources
  UNION ALL
  SELECT 'activities', count(*) FROM segment_studio_provenance_activities
  UNION ALL
  SELECT 'nodes', count(*) FROM segment_studio_lineage_nodes
  UNION ALL
  SELECT 'assertions', count(*) FROM segment_studio_provenance_assertions
  UNION ALL
  SELECT 'edges', count(*) FROM segment_studio_derivation_edges
  UNION ALL
  SELECT 'open_issues', count(*) FROM segment_studio_lineage_issues
    WHERE status = 'open'
  ORDER BY relation;
"
```

Use a second, scenario-specific query to inspect only the test component and its
assertions after the UI establishes the behavior under test. Do not package or
install unpackaged extension output.

## End-to-end acceptance scenarios

### Legacy manual marker

- Import one manual SMS marker.
- Show source `stash-marker-studio:manual`.
- Show relation `origin`.
- Leave run, model, and confidence unknown.
- Publish and edit ordinary fields normally.

### Legacy derived chain

- Import a multi-level SMS derivation chain.
- Preserve every edge and rule ID.
- Show inherited upstream source on descendants.
- Keep every derived segment publishable.
- Prevent retagging derived members.
- Delete from a leaf and verify the configured policy applies to the whole
  component.

### New Cove AI segment

- Ingest one native Cove AI segment.
- Show `ext:ai.tagging`, run key, logical model key, concrete model/version,
  confidence, and evidence.
- Keep it native and implicitly approved.
- Do not create a draft.

### Root tag reconciliation

- Create a root with several derived branches.
- Change the root tag.
- Preview affected descendants.
- Retain valid branches.
- Remove invalid descendants atomically.
- Verify no invalid edge or unsupported inherited assertion remains.

### External derived tag change

- Change a derived native segment's tag through a non-Segment-Studio path.
- Open Segment Studio and see a blocking integrity issue.
- Preview restoration.
- Restore the rule-required tag.
- Verify the component returns to a valid state.

### External deletion

- Delete one native component member outside Segment Studio.
- Preserve its lineage node as missing.
- Detect all affected remaining members.
- Apply keep, confirm/remove, and remove behavior in separate test cases.
- Verify normal full-component removal leaves no nodes, assertions, edges, or
  issues.

## Final acceptance criteria

The work is complete when:

1. Legacy manual, Skier AI, and TPDB origins are queryable through source
   assertions.
2. `Derived` is represented only by graph edges and computed state.
3. All imported derivation edges resolve to stable non-legacy identities.
4. Cove AI source, run, model, version, confidence, and evidence are preserved
   when available.
5. Unknown legacy values remain null.
6. Derived segments remain normal publishable/reviewable segments.
7. Segment Studio cannot retag a derived segment through UI or API.
8. Root tag changes cannot leave invalid descendants or inherited provenance.
9. Deleting any live component member follows the user's keep, confirm/remove,
   or remove policy over the complete component.
10. Successful normal deletion removes the complete component or nothing.
11. External tag changes and deletions become actionable integrity issues.
12. Integrity scans are read-only, resumable, and idempotent.
13. Repairs and destructive operations require current previews and execute
    transactionally.
14. Source keys can be added ad hoc without a schema migration.
15. Provenance survives native/draft representation transitions.
16. After migration sign-off and cleanup, no live Segment Studio table or JSON
    payload retains a Stash Marker Studio marker-ID field.
17. Migration reports reconcile every expected source marker and derivation
    edge.
18. AI-to-draft routing remains unchanged and explicitly out of scope.

## Deferred enhancements

- Automatically generate newly applicable descendants after a root tag change.
- Rule-authoring UI and rule simulation.
- Cross-video derivation.
- Provenance standards interchange.
- User-visible provenance correction history beyond operation receipts.
- Graph visualization optimized for very large components.
- Automatic background repair policies.
- Cove-core support for extension-owned lineage predicates and grouping facets.
