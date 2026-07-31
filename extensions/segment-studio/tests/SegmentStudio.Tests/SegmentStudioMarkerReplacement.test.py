import copy
import importlib.util
import os
import pathlib
import sys
import unittest
import uuid


SCRIPT = pathlib.Path(__file__).parents[2] / "scripts" / "segment_studio_marker_replacement.py"
SPEC = importlib.util.spec_from_file_location("segment_studio_marker_replacement", SCRIPT)
MIGRATION = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MIGRATION)

sys.path.insert(0, str(SCRIPT.parent))
LEGACY_SCRIPT = SCRIPT.parent / "segment-studio-marker-migration.py"
LEGACY_SPEC = importlib.util.spec_from_file_location("segment_studio_marker_cli", LEGACY_SCRIPT)
LEGACY = importlib.util.module_from_spec(LEGACY_SPEC)
assert LEGACY_SPEC.loader is not None
LEGACY_SPEC.loader.exec_module(LEGACY)


SET_ID = "019c0000-0000-7000-8000-000000000099"
SLOT_ID = "019c0000-0000-7000-8000-000000000010"


def source_document():
    return {
        "schemaVersion": 3,
        "sourceKind": "stash-marker-studio",
        "sourceInstanceId": "test-source",
        "snapshots": {
            "markerStudioSha256": "1" * 64,
            "stashSqliteSha256": "2" * 64,
        },
        "scenes": [{"localId": 10, "evidence": {"remoteIds": []}}],
        "tags": [
            {"localId": 20, "name": "Primary", "evidence": {"remoteIds": []}},
            {"localId": 21, "name": "Secondary", "evidence": {"remoteIds": []}},
        ],
        "performers": [{"localId": 30, "name": "Performer", "evidence": {"remoteIds": []}}],
        "slotDefinitionSets": [{
            "id": SET_ID,
            "sourceTagLocalId": 20,
            "allowSamePerformerInMultipleSlots": False,
        }],
        "slotDefinitions": [{
            "id": SLOT_ID,
            "slotDefinitionSetId": SET_ID,
            "label": "First",
            "sortOrder": 0,
            "genderHints": ["FEMALE"],
        }],
        "shotBoundaries": [{
            "localId": "0199e1e6-f656-7265-bd6a-0e4634ae13ed",
            "sceneLocalId": 10,
            "startMs": 0,
            "endMs": 9593,
            "source": "pyscenedetect",
            "metadata": None,
            "createdAt": "2025-10-14T08:47:14.001Z",
            "updatedAt": "2025-10-14T08:47:14.001Z",
        }],
        "markers": [
            marker(1, "confirmed", external_id=None),
            marker(2, "unprocessed", external_id=None),
            marker(3, "rejected", external_id=9003, performer=None),
        ],
    }


def marker(local_id, status, *, external_id, secondary=None, performer=30):
    return {
        "localId": local_id,
        "externalMarkerId": external_id,
        "sceneLocalId": 10,
        "primaryTagLocalId": 20,
        "startMs": local_id * 1000,
        "endMs": local_id * 1000 + 500,
        "status": status,
        "secondaryTagLocalIds": secondary if secondary is not None else [21],
        "slotAssignments": [{"slotDefinitionId": SLOT_ID, "performerLocalId": performer}],
        "provenance": {
            "workflowTags": ["status"],
            "derivations": [{"sourceMarkerId": 99, "ruleId": "rule", "depth": 1}],
            "analysis": [{"source": "model", "confidence": 0.75}],
        },
    }


def target_document():
    return {
        "schemaVersion": 2,
        "videoIds": [100],
        "tagIds": [200, 201],
        "performerIds": [300],
        "slotDefinitionSets": [],
        "slotDefinitions": [],
        "slotGenderHints": [],
        "segmentCount": 7,
        "stableItemCount": 5,
        "workspaceCount": 2,
        "shotBoundaryCount": 0,
        "shotBoundaries": [],
        "receiptIntegrity": {"orphanReceiptCount": 0, "orphanProvenanceCount": 0},
        "priorRuns": [],
    }


def manifest_for(source, target):
    result = {
        "schemaVersion": 2,
        "sourceFingerprint": MIGRATION.source_fingerprint(source),
        "reviewedTargetFingerprint": MIGRATION.target_fingerprint(target),
        "entityMappings": [
            {"entityKind": "scene", "sourceLocalId": 10, "canonicalId": 100},
            {"entityKind": "tag", "sourceLocalId": 20, "canonicalId": 200},
            {"entityKind": "tag", "sourceLocalId": 21, "canonicalId": 201},
            {"entityKind": "performer", "sourceLocalId": 30, "canonicalId": 300},
        ],
    }
    return result


class ReplacementPlannerTests(unittest.TestCase):
    def test_receipt_schema_allows_confirmed_derived_markers_to_remain_extension_owned(self):
        schema = MIGRATION.RECEIPT_SCHEMA_SQL

        self.assertIn(
            'DROP CONSTRAINT IF EXISTS '
            '"CK_segment_studio_marker_replacement_receipts_residence"',
            schema,
        )
        self.assertIn(
            "CHECK (native_segment_id IS NULL OR source_status = 'confirmed')",
            schema,
        )
        self.assertNotIn(
            "CHECK ((source_status = 'confirmed') = (native_segment_id IS NOT NULL))",
            schema,
        )

    def test_maps_review_state_to_residence_and_preserves_attached_metadata(self):
        source = source_document()
        target = target_document()
        plan = MIGRATION.build_plan(source, target, manifest_for(source, target))

        self.assertTrue(plan.result["succeeded"])
        self.assertEqual(plan.result["plannedNativeCount"], 1)
        self.assertEqual(plan.result["plannedOwnedUnreviewedCount"], 1)
        self.assertEqual(plan.result["plannedOwnedRejectedCount"], 1)
        self.assertEqual(plan.result["plannedStableItemCount"], 3)
        self.assertEqual(plan.result["plannedSlotAssignmentCount"], 2)
        self.assertEqual(plan.result["preservedEmptySlotCount"], 1)
        self.assertEqual(
            [(row["residence"], row["reviewState"]) for row in plan.items],
            [("native", None), ("extension", "unreviewed"), ("extension", "rejected")],
        )
        self.assertEqual(plan.items[0]["secondaryTagIds"], [201])
        self.assertEqual(plan.items[0]["metadata"]["secondaryTagLocalIds"], [21])
        self.assertEqual(plan.items[0]["metadata"]["provenance"]["derivations"][0]["ruleId"], "rule")
        self.assertEqual(plan.items[0]["metadata"]["provenance"]["analysis"][0]["source"], "model")
        self.assertIsNone(plan.items[2]["metadata"]["slotAssignments"][0]["performerLocalId"])
        self.assertEqual(plan.result["existingSegmentDeleteCount"], 7)
        self.assertEqual(len(plan.definition_sets), 1)
        self.assertEqual(len(plan.definitions), 1)
        self.assertEqual(len(plan.gender_hints), 1)

    def test_plan_is_deterministic_even_when_confirmed_markers_have_no_external_id(self):
        source = source_document()
        source["markers"].append(marker(4, "confirmed", external_id=None))
        target = target_document()
        manifest = manifest_for(source, target)

        first = MIGRATION.build_plan(source, target, manifest)
        second = MIGRATION.build_plan(copy.deepcopy(source), copy.deepcopy(target), copy.deepcopy(manifest))

        self.assertEqual(first.result["planFingerprint"], second.result["planFingerprint"])
        self.assertEqual(len({row["createToken"] for row in first.items}), 4)

    def test_maps_shot_boundaries_to_cove_videos_with_source_metadata(self):
        source = source_document()
        target = target_document()

        plan = MIGRATION.build_plan(source, target, manifest_for(source, target))

        self.assertTrue(plan.result["succeeded"])
        self.assertEqual(plan.result["sourceShotBoundaryCount"], 1)
        self.assertEqual(plan.result["plannedShotBoundaryInsertCount"], 1)
        self.assertEqual(plan.result["plannedShotBoundaryCount"], 1)
        self.assertEqual(
            plan.result["plannedShotBoundaryFingerprint"],
            MIGRATION.shot_boundary_state_fingerprint([
                MIGRATION.planned_shot_boundary_target(plan.shot_boundaries[0])
            ]),
        )
        self.assertEqual(plan.shot_boundaries, [{
            "sourceBoundaryId": "0199e1e6-f656-7265-bd6a-0e4634ae13ed",
            "legacySceneId": 10,
            "videoId": 100,
            "startMs": 0,
            "endMs": 9593,
            "source": "pyscenedetect",
            "metadata": None,
            "createdAt": "2025-10-14T08:47:14.001Z",
            "updatedAt": "2025-10-14T08:47:14.001Z",
        }])

    def test_conflicting_existing_shot_boundary_blocks_replacement(self):
        source = source_document()
        target = target_document()
        target["shotBoundaryCount"] = 1
        target["shotBoundaries"] = [{
            "id": 9,
            "videoId": 100,
            "startMs": 0,
            "endMs": 12000,
            "source": "manual",
            "metadata": None,
            "createdAt": "2025-10-14T08:47:14.001Z",
            "updatedAt": "2025-10-14T08:47:14.001Z",
        }]

        plan = MIGRATION.build_plan(source, target, manifest_for(source, target))

        self.assertFalse(plan.result["succeeded"])
        self.assertEqual(
            plan.result["issues"],
            [{"code": "shot-boundary-conflict", "count": 1, "fatal": True}],
        )

    def test_legacy_shot_boundary_metadata_key_is_accepted_as_equivalent(self):
        source = source_document()
        target = target_document()
        target["shotBoundaryCount"] = 1
        target["shotBoundaries"] = [{
            "id": 9,
            "videoId": 100,
            "startMs": 0,
            "endMs": 9593,
            "source": "pyscenedetect",
            "metadata": {
                "legacyMarkerStudioId": "0199e1e6-f656-7265-bd6a-0e4634ae13ed",
                "legacyStashSceneId": 10,
                "legacyMetadata": None,
            },
            "createdAt": "2025-10-14T08:47:14.001Z",
            "updatedAt": "2025-10-14T08:47:14.001Z",
        }]

        plan = MIGRATION.build_plan(source, target, manifest_for(source, target))

        self.assertTrue(plan.result["succeeded"])
        self.assertEqual(plan.result["plannedShotBoundaryInsertCount"], 0)

    def test_missing_required_mapping_is_fatal_instead_of_skipping_marker(self):
        source = source_document()
        target = target_document()
        manifest = manifest_for(source, target)
        manifest["entityMappings"] = [
            row for row in manifest["entityMappings"]
            if not (row["entityKind"] == "scene" and row["sourceLocalId"] == 10)
        ]

        with self.assertRaisesRegex(MIGRATION.ValidationError, "missing 1 required"):
            MIGRATION.build_plan(source, target, manifest)

    def test_reviewed_target_drift_is_rejected(self):
        source = source_document()
        target = target_document()
        manifest = manifest_for(source, target)
        target["segmentCount"] += 1

        with self.assertRaisesRegex(MIGRATION.ValidationError, "target snapshot"):
            MIGRATION.build_plan(source, target, manifest)

    def test_conflicting_retained_slot_configuration_blocks_replacement(self):
        source = source_document()
        target = target_document()
        target["slotDefinitionSets"] = [{
            "id": SET_ID,
            "tagId": 201,
            "allowSamePerformerInMultipleSlots": False,
        }]
        manifest = manifest_for(source, target)

        plan = MIGRATION.build_plan(source, target, manifest)

        self.assertFalse(plan.result["succeeded"])
        self.assertEqual(
            plan.result["issues"],
            [{"code": "slot-definition-set-conflict", "count": 1, "fatal": True}],
        )


class FakeTarget:
    def __init__(self, target, *, actual=None, fail_write=False):
        self.target = copy.deepcopy(target)
        self.actual = actual
        self.fail_write = fail_write
        self.events = []

    def begin_serializable(self):
        self.events.append("begin")

    def acquire_lock(self):
        self.events.append("lock")

    def ensure_schema(self):
        self.events.append("schema")

    def extract_target(self):
        self.events.append("extract")
        return copy.deepcopy(self.target)

    def write_plan(self, plan, source):
        self.events.append("write")
        if self.fail_write:
            raise MIGRATION.ValidationError("forced write failure")

    def verify(self, plan=None):
        self.events.append("verify")
        if self.actual is not None:
            return self.actual
        if plan is None:
            raise AssertionError("Replay verification requires explicit current counts.")
        return {
            "nativeCount": plan.result["plannedNativeCount"],
            "itemCount": plan.result["plannedStableItemCount"],
            "ownedApprovedCount": plan.result["plannedOwnedApprovedCount"],
            "ownedUnreviewedCount": plan.result["plannedOwnedUnreviewedCount"],
            "ownedRejectedCount": plan.result["plannedOwnedRejectedCount"],
            "slotCount": plan.result["plannedSlotAssignmentCount"],
            "shotBoundaryCount": plan.result["plannedShotBoundaryCount"],
            "shotBoundaryFingerprint": plan.result["plannedShotBoundaryFingerprint"],
            "receiptCount": plan.result["sourceMarkerCount"],
            "normalizationReady": True,
            "stateFingerprint": "a" * 32,
        }

    def record_run(self, plan, result, source):
        self.events.append("record")

    def commit(self):
        self.events.append("commit")

    def rollback(self):
        self.events.append("rollback")


class ReplacementApplyTests(unittest.TestCase):
    def test_apply_locks_replans_verifies_and_commits(self):
        source = source_document()
        target = target_document()
        manifest = manifest_for(source, target)
        plan = MIGRATION.build_plan(source, target, manifest)
        adapter = FakeTarget(target)

        result = MIGRATION.apply_reviewed_plan(
            adapter, source, manifest, plan.result["planFingerprint"]
        )

        self.assertTrue(result["succeeded"])
        self.assertEqual(
            adapter.events,
            ["begin", "lock", "schema", "extract", "write", "verify", "record", "commit"],
        )

    def test_write_failure_rolls_back(self):
        source = source_document()
        target = target_document()
        manifest = manifest_for(source, target)
        plan = MIGRATION.build_plan(source, target, manifest)
        adapter = FakeTarget(target, fail_write=True)

        with self.assertRaisesRegex(MIGRATION.ValidationError, "forced write"):
            MIGRATION.apply_reviewed_plan(
                adapter, source, manifest, plan.result["planFingerprint"]
            )

        self.assertEqual(adapter.events[-1], "rollback")

    def test_same_count_wrong_shot_boundary_content_rolls_back(self):
        source = source_document()
        target = target_document()
        manifest = manifest_for(source, target)
        plan = MIGRATION.build_plan(source, target, manifest)
        actual = FakeTarget(target).verify(plan)
        actual["shotBoundaryFingerprint"] = "f" * 64
        adapter = FakeTarget(target, actual=actual)

        with self.assertRaisesRegex(MIGRATION.ValidationError, "post-check"):
            MIGRATION.apply_reviewed_plan(
                adapter, source, manifest, plan.result["planFingerprint"]
            )

        self.assertEqual(adapter.events[-1], "rollback")
        self.assertNotIn("commit", adapter.events)

    def test_shot_boundary_apply_preserves_segment_inventory(self):
        source = source_document()
        initial = target_document()
        manifest = manifest_for(source, initial)
        plan = MIGRATION.build_plan(source, initial, manifest)

        class BoundaryTarget:
            def __init__(self):
                self.value = copy.deepcopy(initial)
                self.events = []

            def begin_serializable(self):
                self.events.append("begin")

            def acquire_lock(self):
                self.events.append("lock")

            def require_stable_schema(self):
                self.events.append("schema")

            def extract_target(self):
                self.events.append("extract")
                return copy.deepcopy(self.value)

            def write_shot_boundaries(self, rows):
                self.events.append("write-boundaries")
                self.value["shotBoundaries"].extend(
                    MIGRATION.planned_shot_boundary_target(row) for row in rows
                )
                self.value["shotBoundaryCount"] = len(self.value["shotBoundaries"])

            def commit(self):
                self.events.append("commit")

            def rollback(self):
                self.events.append("rollback")

        target = BoundaryTarget()
        result = MIGRATION.apply_reviewed_shot_boundary_plan(
            target,
            source,
            manifest,
            plan.result["planFingerprint"],
        )

        self.assertEqual(result["appliedMode"], "shot-boundaries-only")
        self.assertEqual(result["insertedShotBoundaryCount"], 1)
        self.assertEqual(target.value["segmentCount"], initial["segmentCount"])
        self.assertEqual(target.value["stableItemCount"], initial["stableItemCount"])
        self.assertEqual(
            target.events,
            ["begin", "lock", "schema", "extract", "write-boundaries", "extract", "commit"],
        )


POSTGRESQL_SCHEMA = """
CREATE TABLE videos ("Id" integer PRIMARY KEY);
CREATE TABLE tags ("Id" integer PRIMARY KEY);
CREATE TABLE performers ("Id" integer PRIMARY KEY);
CREATE TABLE segments (
    "Id" integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "HostType" integer NOT NULL, "HostId" integer NOT NULL,
    "StartSec" double precision NOT NULL, "EndSec" double precision,
    "TagId" integer, "Kind" text, "RefId" bigint, "Payload" jsonb,
    "SourceKey" text NOT NULL, "SourceRunId" text, "Confidence" real,
    "Title" text, "ColorHint" text, "ImageBlobId" text,
    "CreatedAt" timestamptz, "UpdatedAt" timestamptz);
CREATE TABLE segment_studio_items (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    native_segment_id integer UNIQUE REFERENCES segments("Id") ON DELETE CASCADE,
    review_state text, representation_schema_version integer NOT NULL,
    video_id integer, start_sec double precision, end_sec double precision,
    tag_id integer, kind text, ref_id bigint, payload jsonb, source_key text,
    source_run_id text, confidence real, title text, color_hint text,
    extension_image_blob_id text, revision bigint NOT NULL,
    created_at timestamptz, updated_at timestamptz);
CREATE TABLE segment_studio_slot_definition_sets (
    id uuid PRIMARY KEY, tag_id integer UNIQUE,
    allow_same_performer_in_multiple_slots boolean,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE segment_studio_slot_definitions (
    id uuid PRIMARY KEY,
    slot_definition_set_id uuid REFERENCES segment_studio_slot_definition_sets(id),
    label text, sort_order integer, created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(slot_definition_set_id, sort_order));
CREATE TABLE segment_studio_slot_definition_gender_hints (
    slot_definition_id uuid REFERENCES segment_studio_slot_definitions(id),
    gender_hint text, PRIMARY KEY(slot_definition_id, gender_hint));
CREATE TABLE segment_studio_segment_slots (
    item_id bigint REFERENCES segment_studio_items(id) ON DELETE CASCADE,
    slot_definition_id uuid REFERENCES segment_studio_slot_definitions(id),
    performer_id integer, created_at timestamptz,
    PRIMARY KEY(item_id, slot_definition_id));
CREATE TABLE segment_studio_blob_cleanup_outbox (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    blob_id text UNIQUE, status text, attempt_count integer, last_error text,
    created_at timestamptz, updated_at timestamptz);
CREATE TABLE segment_studio_analysis_candidates (id bigint PRIMARY KEY);
CREATE TABLE segment_studio_incorrect_examples (id bigint PRIMARY KEY);
CREATE TABLE segment_studio_workspaces (id bigint PRIMARY KEY);
CREATE TABLE segment_studio_workspace_markers (
    id bigint PRIMARY KEY, legacy_marker_id bigint);
CREATE TABLE segment_studio_sources (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, key text UNIQUE,
    display_name text, category text, provider text, metadata jsonb,
    created_at timestamptz, updated_at timestamptz);
CREATE TABLE segment_studio_provenance_activities (
    id uuid PRIMARY KEY, key text UNIQUE, kind text, source_id bigint
        REFERENCES segment_studio_sources(id), external_run_id text, status text,
    started_at timestamptz, completed_at timestamptz, request jsonb, models jsonb,
    summary jsonb, metadata jsonb, created_at timestamptz, updated_at timestamptz);
CREATE TABLE segment_studio_lineage_nodes (
    id uuid PRIMARY KEY, item_id bigint UNIQUE REFERENCES segment_studio_items(id),
    state text, last_known_video_id integer, last_known_tag_id integer,
    last_known_start_sec double precision, last_known_end_sec double precision,
    missing_since timestamptz, created_at timestamptz, updated_at timestamptz);
CREATE TABLE segment_studio_derivation_rules (
    id uuid PRIMARY KEY, key text, version text, source_tag_id integer,
    derived_tag_id integer, enabled boolean, metadata jsonb,
    created_at timestamptz, updated_at timestamptz);
CREATE TABLE segment_studio_segment_provenance (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    lineage_node_id uuid REFERENCES segment_studio_lineage_nodes(id),
    source_id bigint REFERENCES segment_studio_sources(id), relation text,
    activity_id uuid REFERENCES segment_studio_provenance_activities(id),
    model_key text, model_identifier text, model_version text, confidence real,
    recorded_at timestamptz, metadata jsonb, superseded_at timestamptz,
    created_at timestamptz, updated_at timestamptz);
CREATE TABLE segment_studio_derivation_edges (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    source_node_id uuid REFERENCES segment_studio_lineage_nodes(id),
    derived_node_id uuid REFERENCES segment_studio_lineage_nodes(id),
    rule_id uuid REFERENCES segment_studio_derivation_rules(id),
    rule_version_at_creation text, source_tag_id_at_creation integer,
    derived_tag_id_at_creation integer, activity_id uuid, recorded_at timestamptz,
    metadata jsonb, created_at timestamptz, updated_at timestamptz);
CREATE TABLE segment_studio_lineage_issues (
    id uuid PRIMARY KEY, details jsonb, resolution jsonb);
CREATE TABLE segment_studio_lineage_scan_runs (
    id uuid PRIMARY KEY, cursor jsonb, counts jsonb);
CREATE TABLE segment_studio_segment_operations (
    operation_id uuid PRIMARY KEY, result_payload jsonb);
CREATE TABLE segment_studio_shot_boundaries (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    video_id integer REFERENCES videos("Id") ON DELETE CASCADE,
    start_sec double precision NOT NULL,
    end_sec double precision NOT NULL,
    source text NOT NULL,
    metadata jsonb,
    revision bigint NOT NULL,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL);
CREATE TABLE segment_studio_slot_import_runs (plan_fingerprint text PRIMARY KEY);
CREATE TABLE segment_studio_training_export_frames (id bigint PRIMARY KEY);
CREATE TABLE segment_studio_installation_state (
    id smallint PRIMARY KEY, requires_legacy_normalization boolean,
    updated_at timestamptz);
CREATE TABLE user_entity_affinities ("HostType" integer);
CREATE TABLE user_bookmarks ("HostType" integer);
CREATE TABLE interactions ("HostType" integer);
CREATE TABLE playback_sessions ("HostType" integer);
CREATE TABLE ratings ("HostType" integer);
CREATE TABLE field_provenance ("HostType" integer);
CREATE TABLE tag_applications ("HostType" integer);
CREATE TABLE custom_field_values ("EntityType" text);
CREATE TABLE group_items ("Kind" integer, "HostType" text);
CREATE TABLE extension_migrations (
    extension_id text NOT NULL, migration_name text NOT NULL,
    PRIMARY KEY (extension_id, migration_name));
CREATE UNIQUE INDEX "IX_segment_studio_derivation_rules_relationship"
    ON segment_studio_derivation_rules(source_tag_id, derived_tag_id);
CREATE FUNCTION segment_studio_delete_rule_derivations() RETURNS trigger
LANGUAGE plpgsql AS $$ BEGIN RETURN OLD; END $$;
INSERT INTO videos VALUES (100);
INSERT INTO tags VALUES (200), (201);
INSERT INTO performers VALUES (300);
INSERT INTO segment_studio_installation_state VALUES (1, TRUE, CURRENT_TIMESTAMP);
INSERT INTO segments (
    "HostType", "HostId", "StartSec", "TagId", "Kind", "SourceKey",
    "CreatedAt", "UpdatedAt")
VALUES (1, 100, 9, 200, 'tag', 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO segment_studio_items (
    native_segment_id, representation_schema_version, revision, created_at, updated_at)
VALUES (1, 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
"""


class ReplacementPostgreSqlIntegrationTests(unittest.TestCase):
    def test_atomic_replacement_rollback_apply_and_drift_checked_replay(self):
        admin_url = os.environ.get("SEGMENT_STUDIO_MIGRATION_TEST_DATABASE_URL")
        if not admin_url:
            self.skipTest("SEGMENT_STUDIO_MIGRATION_TEST_DATABASE_URL is not set")
        database_name = "segment_studio_replacement_" + uuid.uuid4().hex
        with LEGACY.PostgreSqlConnection(admin_url) as admin:
            admin.execute(f'CREATE DATABASE "{database_name}";')
        database_url = LEGACY.database_url_with_database(admin_url, database_name)
        try:
            with LEGACY.PostgreSqlConnection(database_url) as connection:
                connection.execute(POSTGRESQL_SCHEMA)
                source = source_document()
                target = MIGRATION.PostgreSqlReplacementTarget(connection)
                before = target.extract_target()
                manifest = manifest_for(source, before)
                plan = MIGRATION.build_plan(source, before, manifest)

                class FailPostCheck(MIGRATION.PostgreSqlReplacementTarget):
                    def verify(self, plan=None):
                        raise MIGRATION.ValidationError("forced post-check failure")

                with self.assertRaisesRegex(MIGRATION.ValidationError, "forced post-check"):
                    MIGRATION.apply_reviewed_plan(
                        FailPostCheck(connection), source, manifest,
                        plan.result["planFingerprint"],
                    )
                self.assertEqual(
                    connection.execute(
                        "SELECT count(*) FROM segments, segment_studio_items;", tuples=True
                    ),
                    [["1"]],
                )

                applied = MIGRATION.apply_reviewed_plan(
                    target, source, manifest, plan.result["planFingerprint"]
                )
                self.assertEqual(applied["postCheck"]["nativeCount"], 1)
                self.assertEqual(applied["postCheck"]["itemCount"], 3)
                self.assertEqual(applied["postCheck"]["receiptCount"], 3)
                self.assertTrue(applied["postCheck"]["normalizationReady"])
                self.assertRegex(applied["postCheck"]["stateFingerprint"], r"^[0-9a-f]{32}$")

                replay = MIGRATION.apply_reviewed_plan(
                    target, source, manifest, plan.result["planFingerprint"]
                )
                self.assertTrue(replay["replayedReviewedPlan"])

                connection.execute("""
                    UPDATE segment_studio_marker_replacement_receipts
                    SET metadata=jsonb_set(metadata, '{provenance,tampered}', 'true')
                    WHERE source_marker_id=1;
                """)
                with self.assertRaisesRegex(MIGRATION.ValidationError, "safe no-op"):
                    MIGRATION.apply_reviewed_plan(
                        target, source, manifest, plan.result["planFingerprint"]
                    )
        finally:
            with LEGACY.PostgreSqlConnection(admin_url) as admin:
                admin.execute(
                    "SELECT pg_terminate_backend(pid) FROM pg_stat_activity "
                    "WHERE datname=$1 AND pid<>pg_backend_pid();",
                    [database_name],
                    tuples=True,
                )
                admin.execute(f'DROP DATABASE IF EXISTS "{database_name}";')
    def test_postcheck_mismatch_rolls_back(self):
        source = source_document()
        target = target_document()
        manifest = manifest_for(source, target)
        plan = MIGRATION.build_plan(source, target, manifest)
        adapter = FakeTarget(target, actual={
            "nativeCount": 0,
            "itemCount": 0,
            "ownedApprovedCount": 0,
            "ownedUnreviewedCount": 0,
            "ownedRejectedCount": 0,
            "slotCount": 0,
            "receiptCount": 0,
            "normalizationReady": False,
            "stateFingerprint": "0" * 32,
        })

        with self.assertRaisesRegex(MIGRATION.ValidationError, "post-check"):
            MIGRATION.apply_reviewed_plan(
                adapter, source, manifest, plan.result["planFingerprint"]
            )
        self.assertEqual(adapter.events[-1], "rollback")

    def test_identical_prior_run_is_a_verified_no_op(self):
        source = source_document()
        target = target_document()
        manifest = manifest_for(source, target)
        plan = MIGRATION.build_plan(source, target, manifest)
        counts = {
            "nativeCount": 1,
            "itemCount": 3,
            "ownedApprovedCount": 0,
            "ownedUnreviewedCount": 1,
            "ownedRejectedCount": 1,
            "slotCount": 2,
            "shotBoundaryCount": plan.result["plannedShotBoundaryCount"],
            "shotBoundaryFingerprint": plan.result["plannedShotBoundaryFingerprint"],
            "receiptCount": 3,
            "normalizationReady": True,
            "stateFingerprint": "a" * 32,
        }
        target["priorRuns"] = [{
            "planFingerprint": plan.result["planFingerprint"],
            "sourceInstanceId": source["sourceInstanceId"],
            "sourceFingerprint": plan.result["sourceFingerprint"],
            "manifestFingerprint": plan.result["manifestFingerprint"],
            "result": {**plan.result, "postCheck": counts},
        }]
        adapter = FakeTarget(target, actual=counts)

        result = MIGRATION.apply_reviewed_plan(
            adapter, source, manifest, plan.result["planFingerprint"]
        )

        self.assertTrue(result["replayedReviewedPlan"])
        self.assertEqual(adapter.events, ["begin", "lock", "schema", "extract", "verify", "commit"])

    def test_prior_run_with_target_drift_is_not_reported_as_success(self):
        source = source_document()
        target = target_document()
        manifest = manifest_for(source, target)
        plan = MIGRATION.build_plan(source, target, manifest)
        expected = {
            "nativeCount": 1,
            "itemCount": 3,
            "ownedApprovedCount": 0,
            "ownedUnreviewedCount": 1,
            "ownedRejectedCount": 1,
            "slotCount": 2,
            "receiptCount": 3,
            "normalizationReady": True,
            "stateFingerprint": "a" * 32,
        }
        target["priorRuns"] = [{
            "planFingerprint": plan.result["planFingerprint"],
            "sourceInstanceId": source["sourceInstanceId"],
            "sourceFingerprint": plan.result["sourceFingerprint"],
            "manifestFingerprint": plan.result["manifestFingerprint"],
            "result": {**plan.result, "postCheck": expected},
        }]
        actual = {**expected, "stateFingerprint": "b" * 32}
        adapter = FakeTarget(target, actual=actual)

        with self.assertRaisesRegex(MIGRATION.ValidationError, "safe no-op"):
            MIGRATION.apply_reviewed_plan(
                adapter, source, manifest, plan.result["planFingerprint"]
            )
        self.assertEqual(adapter.events[-1], "rollback")


if __name__ == "__main__":
    unittest.main()
