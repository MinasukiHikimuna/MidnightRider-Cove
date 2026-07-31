# Segment Studio lineage rollout and repair

## Legacy Marker Studio preparation

The offline Marker Studio replacement operator has a distinct
`prepare-lineage` stage. Run it after extracting the immutable Marker Studio
and Stash snapshots and reviewing the initial entity mappings, but before
building the destructive replacement plan.

Preparation reads `scene_markers_tags` from the same hash-bound Stash SQLite
snapshot and recovers `Marker Source:` values that Marker Studio displayed
separately from its own additional-tag records. Source tags are resolved by
their exact names; numeric Stash and Cove tag IDs are never embedded in the
operator. Any newly recovered source tag without an existing mapping requires
an explicit `--map-source-tag` argument.

Inference and exclusions are opt-in:

- `--infer-ai-analysis-source` classifies a marker only when every preserved
  analysis row uses one of the explicitly supplied analysis sources.
- `--infer-confirmed-without-analysis-as-manual` classifies confirmed markers
  with no preserved analysis as manual.
- `--exclude-unclassified-markers` creates fingerprint-bound candidates for
  markers that still have no supported origin source.
- `--exclude-rule-tag-mismatches` creates fingerprint-bound candidates for
  historical derivations whose current tags no longer match their preserved
  rule.

The generated manifest remains a review candidate. Inspect its preparation
report, every inferred classification count, and every exclusion before using
the manifest with `plan`. A later `plan` or `apply` fails closed if the source,
target, mapping, exclusion, or plan fingerprint has drifted.

The replacement plan must preserve the native/owned boundary. Confirmed root
and ordinary source markers may become native Cove segments. Every marker with
a valid incoming derivation must remain an extension-owned Segment Studio item,
even when its legacy status is confirmed. Check `plannedNativeCount` and
`plannedOwnedApprovedCount` in the plan report before applying it. A derived
edge targeting a native item is rejected by both the runtime and database.

## Before rollout

1. Back up Cove and retain the Slice 7 migration plan, reviewed exclusions,
   source fingerprint, target fingerprint, counts, and final proof artifact.
2. Record anonymized production counts for segments, Segment Studio items,
   lineage nodes, provenance assertions, edges, open issues, and AI segments.
3. Install the extension and verify migration `001_initial_schema`
   and its partial indexes completed. The migration uses ordinary transactional
   `CREATE INDEX`; schedule an installation window because PostgreSQL may hold
   table locks while building those indexes.
4. Keep lineage writes paused while importing legacy data. Migration and scan
   receipts remain readable while paused.
5. Run native AI ingestion in 1,000-record pages, then run the lineage scanner
   until it reports `completed`.
6. Compare the Settings telemetry dashboard with the pre-rollout counts and
   review every unresolved enrichment or lineage issue before resuming writes.
7. After UI verification and reviewed sign-off, run `finalize-lineage` with the
   exact applied plan fingerprint. It writes a protected reconciliation report
   before removing temporary legacy-marker receipt tables and columns, then
   proves that no legacy marker identities remain.

Retain the immutable source snapshots, prepared source document, reviewed
manifest, preparation report, plan report, apply report, final reconciliation
report, package version, and operator revision as one private audit bundle.

## Repair operations

Every repair is previewed against a component fingerprint. A changed
fingerprint requires a new preview. `restore-tag` restores rule-required tags;
`recalculate` rebuilds valid paths; `remove` deletes the complete remaining
component subject to mixed video access checks; `ignore` preserves the issue as
audit evidence. Never bypass the preview or typed deletion confirmation.

Scans use a durable cursor and source fingerprint. A source change resets the
cursor rather than completing against mixed input. Re-run a pending scan; do
not delete its receipt.

## Pause and rollback

Pause lineage writes through the authorized maintenance rollout API before
rollback. Pausing blocks new derivations, destructive lineage operations,
repairs, and AI ingestion without deleting operation, migration, or scan
receipts. The rollout controls are intentionally not exposed in the derivation
rule settings view.

Export the maintenance API responses before changing versions:

```bash
curl --fail --show-error --silent \
  --header "Authorization: Bearer <admin-token>" \
  "<cove-url>/api/plugins/segment-studio/maintenance/telemetry"

curl --fail --show-error --silent \
  --header "Authorization: Bearer <admin-token>" \
  "<cove-url>/api/plugins/segment-studio/maintenance/lineage/issues?page=1&perPage=100"
```

Continue issue pages until the returned `page * perPage` reaches `total`.
Retain the database backup, exports, migration proof, and package version
together. Roll back by restoring the database and matching extension package as
one unit; never downgrade only the package after schema migration. Resume
lineage writes only after package/schema compatibility, telemetry counts, and a
completed scan are verified.

## Scale review

The implementation review used a rounded, anonymized snapshot of roughly
12,000 canonical segments, 200,000 Segment Studio items, and 500 native AI
segments. No entity identifiers or library names were retained.

The production queries are bounded by 100 issues per API page, 500 scan nodes
per batch, and 1,000 AI segments per ingestion batch. Graph traversal queries
expand only the current frontier and use source/derived-node indexes. The
rollout migration adds partial indexes for open-issue pagination, active
node/source provenance, and native AI discovery. Capture `EXPLAIN (ANALYZE,
BUFFERS)` with anonymized counts in the deployment record; do not publish
entity IDs or library names.
