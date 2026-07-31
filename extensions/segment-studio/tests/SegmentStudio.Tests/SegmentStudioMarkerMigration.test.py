import importlib.util
import copy
import os
import pathlib
import sqlite3
import tempfile
import unittest


SCRIPT = pathlib.Path(__file__).parents[2] / "scripts" / "segment-studio-marker-migration.py"
SPEC = importlib.util.spec_from_file_location("segment_studio_marker_migration", SCRIPT)
MIGRATION = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MIGRATION)


def stable_item_migration_sql():
    return (SCRIPT.parents[1] / "scripts" /
            "legacy-segment-studio-stable-item-migration.sql").read_text()


def source_document(markers):
    return {
        "schemaVersion": 3,
        "sourceKind": "stash-marker-studio",
        "sourceInstanceId": "019c0000-0000-7000-8000-000000000001",
        "snapshots": {
            "markerStudioSha256": "1" * 64,
            "stashSqliteSha256": "2" * 64,
        },
        "scenes": [
            {"localId": 10, "evidence": {"remoteIds": [{"endpoint": "test", "remoteId": "video-10"}]}},
            {"localId": 11, "evidence": {"remoteIds": []}},
        ],
        "tags": [
            {"localId": 20, "name": "Primary", "evidence": {"remoteIds": []}},
            {"localId": 21, "name": "Secondary", "evidence": {"remoteIds": []}},
        ],
        "performers": [
            {"localId": 30, "name": "Performer", "evidence": {"remoteIds": []}},
        ],
        "slotDefinitionSets": [{
            "id": "019c0000-0000-7000-8000-000000000099",
            "sourceTagLocalId": 20,
            "allowSamePerformerInMultipleSlots": False,
        }],
        "slotDefinitions": [
            {
                "id": identity,
                "slotDefinitionSetId": "019c0000-0000-7000-8000-000000000099",
                "label": None,
                "sortOrder": index,
                "genderHints": [],
            }
            for index, identity in enumerate((
                "019c0000-0000-7000-8000-000000000010",
                "019c0000-0000-7000-8000-000000000011",
            ))
        ],
        "markers": markers,
    }


def marker(local_id, status, *, external_id=None, scene_id=10, start_ms=None, slots=None,
           secondary=None, provenance=None):
    return {
        "localId": local_id,
        "externalMarkerId": external_id,
        "sceneLocalId": scene_id,
        "primaryTagLocalId": 20,
        "startMs": start_ms if start_ms is not None else local_id * 1000,
        "endMs": None,
        "status": status,
        "secondaryTagLocalIds": secondary or [],
        "slotAssignments": slots or [],
        "provenance": provenance or {},
    }


def target_document(segments, *, receipts=None, slots=None, baselines=None, runs=None):
    set_id = "019c0000-0000-7000-8000-000000000099"
    definition_ids = [
        "019c0000-0000-7000-8000-000000000010",
        "019c0000-0000-7000-8000-000000000011",
    ]
    return {
        "schemaVersion": 1,
        "videoIds": [100],
        "tagIds": [200, 201],
        "performerIds": [300, 301],
        "slotDefinitionIds": definition_ids,
        "slotDefinitionSets": [{
            "id": set_id, "tagId": 200,
            "allowSamePerformerInMultipleSlots": False,
        }],
        "slotDefinitions": [
            {"id": identity, "slotDefinitionSetId": set_id, "label": None, "sortOrder": index}
            for index, identity in enumerate(definition_ids)
        ],
        "slotGenderHints": [],
        "segments": segments,
        "receipts": receipts or [],
        "baselineReceipts": baselines or [],
        "migrationRuns": runs or [],
        "receiptIntegrity": {"orphanReceiptCount": 0, "orphanProvenanceCount": 0},
        "segmentSlots": slots or [],
    }


def segment(segment_id, *, ref_id=None, start_ms=1000, review_state="unreviewed",
            secondary=None):
    return {
        "id": segment_id,
        "videoId": 100,
        "tagId": 200,
        "refId": ref_id,
        "startMs": start_ms,
        "endMs": None,
        "reviewState": review_state,
        "secondaryTagIds": secondary or [],
    }


def manifest_for(source, target, *, collisions=None, include_scene=True, include_performer=True,
                 skipped_scenes=None, skipped_tags=None):
    entities = []
    if include_scene:
        entities.append({
            "entityKind": "scene",
            "sourceLocalId": 10,
            "canonicalId": 100,
            "sourceEntityFingerprint": MIGRATION.entity_fingerprint("scene", source["scenes"][0]),
        })
    for local_id, canonical_id in ((20, 200), (21, 201)):
        row = next(row for row in source["tags"] if row["localId"] == local_id)
        entities.append({
            "entityKind": "tag",
            "sourceLocalId": local_id,
            "canonicalId": canonical_id,
            "sourceEntityFingerprint": MIGRATION.entity_fingerprint("tag", row),
        })
    if include_performer:
        for row in source["performers"]:
            entities.append({
                "entityKind": "performer",
                "sourceLocalId": row["localId"],
                "canonicalId": 300 + row["localId"] - 30,
                "sourceEntityFingerprint": MIGRATION.entity_fingerprint("performer", row),
            })
    baseline = [
        {"segmentId": row["id"], "targetSegmentFingerprint": MIGRATION.segment_fingerprint(row)}
        for row in target["segments"]
    ]
    unresolved = []
    for kind, ids, plural in (
        ("scene", skipped_scenes or [], "scenes"),
        ("tag", skipped_tags or [], "tags"),
    ):
        for local_id in ids:
            row = next(row for row in source[plural] if row["localId"] == local_id)
            unresolved.append({
                "entityKind": kind,
                "sourceLocalId": local_id,
                "disposition": "skip",
                "sourceEntityFingerprint": MIGRATION.entity_fingerprint(kind, row),
            })
    result = {
        "schemaVersion": 1,
        "sourceFingerprint": MIGRATION.source_fingerprint(source),
        "baselineSegments": baseline,
        "entityMappings": entities,
        "unresolvedEntities": unresolved,
        "collisionAdoptions": collisions or [],
    }
    result["reviewedTargetFingerprint"] = MIGRATION.reviewed_target_fingerprint(target, baseline)
    return result


class MarkerMigrationPlannerTests(unittest.TestCase):
    def test_large_migration_batch_is_deterministic_and_complete(self):
        source = source_document([
            marker(local_id, "unprocessed")
            for local_id in range(1, 2501)
        ])
        target = target_document([])
        manifest = manifest_for(source, target)

        first = MIGRATION.build_plan(source, target, manifest)
        replay = MIGRATION.build_plan(source, target, manifest)

        self.assertTrue(first.result["succeeded"])
        self.assertEqual(2500, first.result["newSegmentCount"])
        self.assertEqual(2500, len(first.creations))
        self.assertEqual(
            first.result["planFingerprint"],
            replay.result["planFingerprint"],
        )

    def test_post_stable_item_schema_is_rejected_with_replacement_guidance(self):
        class PostStableItemConnection:
            def execute(self, _sql, _parameters=None, *, tuples=False):
                self.tuples = tuples
                return [["f"]]

        target = MIGRATION.PostgreSqlMigrationTarget(PostStableItemConnection())

        with self.assertRaisesRegex(
                MIGRATION.ValidationError,
                "legacy marker migration.*stable-item schema.*normalization workflow"):
            target.extract_target()

    def test_baselines_existing_segments_and_maps_new_review_states_deterministically(self):
        source = source_document([
            marker(1, "confirmed", external_id=9001, start_ms=1000),
            marker(2, "confirmed"),
            marker(3, "rejected"),
            marker(4, "unprocessed"),
        ])
        target = target_document([segment(500, ref_id=9001, start_ms=1000)])
        manifest = manifest_for(source, target)

        first = MIGRATION.build_plan(source, target, manifest)
        second = MIGRATION.build_plan(source, target, manifest)

        self.assertTrue(first.result["succeeded"])
        self.assertEqual(first.result["planFingerprint"], second.result["planFingerprint"])
        self.assertEqual(first.baseline_approvals, [{"segmentId": 500}])
        self.assertEqual(
            [row["reviewState"] for row in first.creations],
            ["approved", "rejected", "unreviewed"],
        )
        self.assertEqual(first.result["newSegmentCount"], 3)
        self.assertEqual(first.result["matchedExistingSegmentCount"], 1)

    def test_requires_explicit_hash_bound_adoption_for_a_unique_tuple_collision(self):
        source = source_document([marker(1, "confirmed", start_ms=1000)])
        target = target_document([segment(500, ref_id=777, start_ms=1000, review_state="approved")])
        manifest = manifest_for(source, target)

        blocked = MIGRATION.build_plan(source, target, manifest)

        self.assertFalse(blocked.result["succeeded"])
        self.assertIn("tuple-adoption-required", [issue["code"] for issue in blocked.result["issues"]])

        adoption = {
            "sourceMarkerId": 1,
            "canonicalSegmentId": 500,
            "sourceMarkerFingerprint": MIGRATION.marker_fingerprint(source["markers"][0]),
            "targetSegmentFingerprint": MIGRATION.segment_fingerprint(target["segments"][0]),
        }
        accepted = MIGRATION.build_plan(source, target, manifest_for(source, target, collisions=[adoption]))

        self.assertTrue(accepted.result["succeeded"])
        self.assertEqual(accepted.adoptions, [{"sourceMarkerId": 1, "segmentId": 500}])
        self.assertEqual(accepted.result["adoptedTupleCount"], 1)

    def test_receipt_precedes_ref_matching_and_any_receipt_drift_is_fatal(self):
        source = source_document([marker(1, "unprocessed", external_id=9001, start_ms=1000)])
        target_segment = segment(500, ref_id=9001, start_ms=1000, review_state="approved")
        receipt = {
            "sourceInstanceId": source["sourceInstanceId"],
            "sourceMarkerId": 1,
            "segmentId": 500,
            "sourceMarkerFingerprint": MIGRATION.marker_fingerprint(source["markers"][0]),
            "targetSegmentFingerprint": MIGRATION.segment_fingerprint(target_segment),
        }
        target = target_document([target_segment], receipts=[receipt])

        manifest = manifest_for(source, target)
        accepted = MIGRATION.build_plan(source, target, manifest)
        self.assertTrue(accepted.result["succeeded"])
        self.assertEqual(accepted.result["matchedReceiptCount"], 1)
        self.assertEqual(accepted.result["matchedRefCount"], 0)

        receipt["sourceMarkerFingerprint"] = "f" * 64
        blocked = MIGRATION.build_plan(source, target, manifest)
        self.assertFalse(blocked.result["succeeded"])
        self.assertIn("receipt-source-drift", [issue["code"] for issue in blocked.result["issues"]])

    def test_skips_unresolved_videos_and_plans_slots_content_tags_and_provenance(self):
        provenance = {
            "workflowSource": "manual",
            "derivations": [{"sourceMarkerId": 99, "ruleId": "rule", "depth": 1}],
            "analysisFingerprint": "a" * 64,
        }
        source = source_document([
            marker(1, "unprocessed", scene_id=11),
            marker(
                2,
                "confirmed",
                secondary=[21, 404],
                slots=[
                    {"slotDefinitionId": "019c0000-0000-7000-8000-000000000010", "performerLocalId": 30},
                    {"slotDefinitionId": "019c0000-0000-7000-8000-000000000011", "performerLocalId": None},
                ],
                provenance=provenance,
            ),
        ])
        target = target_document([])
        plan = MIGRATION.build_plan(
            source,
            target,
            manifest_for(source, target, include_scene=True, skipped_scenes=[11]),
        )

        self.assertTrue(plan.result["succeeded"])
        self.assertEqual(plan.result["skippedUnresolvedVideoCount"], 1)
        self.assertEqual(plan.result["pendingSlotInsertCount"], 1)
        self.assertEqual(plan.result["staleSecondaryTagReferenceCount"], 1)
        self.assertEqual(plan.result["normalizedEmptySlotCount"], 1)
        self.assertEqual(plan.creations[0]["secondaryTagIds"], [201])
        self.assertEqual(plan.slot_assignments[0]["performerId"], 300)
        self.assertEqual(plan.receipt_inserts[0]["provenance"], provenance)

    def test_rejects_a_manifest_for_another_source_snapshot(self):
        source = source_document([marker(1, "confirmed")])
        target = target_document([])
        manifest = manifest_for(source, target)
        manifest["sourceFingerprint"] = "0" * 64

        with self.assertRaisesRegex(MIGRATION.ValidationError, "source fingerprint"):
            MIGRATION.build_plan(source, target, manifest)

    def test_rejects_a_mapping_to_a_missing_canonical_target(self):
        source = source_document([marker(1, "confirmed")])
        target = target_document([])
        target["videoIds"] = []

        with self.assertRaisesRegex(MIGRATION.ValidationError, "canonical target"):
            MIGRATION.build_plan(source, target, manifest_for(source, target))

    def test_fingerprints_ignore_non_semantic_document_row_order(self):
        source = source_document([
            marker(1, "confirmed", external_id=9001, start_ms=1000, secondary=[21]),
            marker(2, "rejected", slots=[{
                "slotDefinitionId": "019c0000-0000-7000-8000-000000000010",
                "performerLocalId": 30,
            }]),
        ])
        target = target_document([
            segment(500, ref_id=9001, start_ms=1000),
            segment(501, ref_id=9002, start_ms=9000),
        ])
        manifest = manifest_for(source, target)
        expected = MIGRATION.build_plan(source, target, manifest)

        reordered_source = copy.deepcopy(source)
        for field in ("scenes", "tags", "performers", "markers"):
            reordered_source[field].reverse()
        reordered_target = copy.deepcopy(target)
        for field in ("videoIds", "tagIds", "performerIds", "slotDefinitionIds", "segments"):
            reordered_target[field].reverse()
        reordered_manifest = copy.deepcopy(manifest)
        reordered_manifest["entityMappings"].reverse()

        actual = MIGRATION.build_plan(reordered_source, reordered_target, reordered_manifest)
        self.assertEqual(MIGRATION.source_fingerprint(source), MIGRATION.source_fingerprint(reordered_source))
        self.assertEqual(expected.result["planFingerprint"], actual.result["planFingerprint"])

    def test_does_not_baseline_approve_a_receipt_owned_segment_on_rerun(self):
        source = source_document([marker(1, "unprocessed", start_ms=1000)])
        initial_target = target_document([])
        manifest = manifest_for(source, initial_target)
        imported = segment(500, start_ms=1000, review_state="unreviewed")
        receipt = {
            "sourceInstanceId": source["sourceInstanceId"],
            "sourceMarkerId": 1,
            "segmentId": 500,
            "sourceMarkerFingerprint": MIGRATION.marker_fingerprint(source["markers"][0]),
            "targetSegmentFingerprint": MIGRATION.segment_fingerprint(imported),
        }

        rerun = MIGRATION.build_plan(source, target_document([imported], receipts=[receipt]), manifest)

        self.assertTrue(rerun.result["succeeded"])
        self.assertEqual(rerun.baseline_approvals, [])
        self.assertEqual(rerun.result["plannedFinalUnreviewedCount"], 1)

    def test_coalesces_identical_slot_writes_for_two_adopted_markers(self):
        source = source_document([
            marker(1, "confirmed", start_ms=1000, slots=[{
                "slotDefinitionId": "019c0000-0000-7000-8000-000000000010", "performerLocalId": 30,
            }]),
            marker(2, "confirmed", start_ms=1000, slots=[{
                "slotDefinitionId": "019c0000-0000-7000-8000-000000000010", "performerLocalId": 30,
            }]),
        ])
        target = target_document([segment(500, start_ms=1000, review_state="approved")])
        collisions = [
            {
                "sourceMarkerId": row["localId"],
                "canonicalSegmentId": 500,
                "sourceMarkerFingerprint": MIGRATION.marker_fingerprint(row),
                "targetSegmentFingerprint": MIGRATION.segment_fingerprint(target["segments"][0]),
            }
            for row in source["markers"]
        ]

        plan = MIGRATION.build_plan(source, target, manifest_for(source, target, collisions=collisions))

        self.assertTrue(plan.result["succeeded"])
        self.assertEqual(len(plan.slot_assignments), 1)

    def test_known_unmapped_secondary_tag_requires_an_explicit_skip_disposition(self):
        source = source_document([marker(1, "confirmed", secondary=[21])])
        target = target_document([])
        incomplete = manifest_for(source, target)
        incomplete["entityMappings"] = [
            row for row in incomplete["entityMappings"]
            if not (row["entityKind"] == "tag" and row["sourceLocalId"] == 21)
        ]

        blocked = MIGRATION.build_plan(source, target, incomplete)
        self.assertFalse(blocked.result["succeeded"])
        self.assertIn("secondary-tag-unmapped", [row["code"] for row in blocked.result["issues"]])

        reviewed = manifest_for(source, target, skipped_tags=[21])
        reviewed["entityMappings"] = [
            row for row in reviewed["entityMappings"]
            if not (row["entityKind"] == "tag" and row["sourceLocalId"] == 21)
        ]
        accepted = MIGRATION.build_plan(source, target, reviewed)
        self.assertTrue(accepted.result["succeeded"])

    def test_rejects_conflicting_planned_slot_writes_for_one_segment(self):
        source = source_document([
            marker(1, "confirmed", start_ms=1000, slots=[{
                "slotDefinitionId": "019c0000-0000-7000-8000-000000000010", "performerLocalId": 30,
            }]),
            marker(2, "confirmed", start_ms=1000, slots=[{
                "slotDefinitionId": "019c0000-0000-7000-8000-000000000010", "performerLocalId": 31,
            }]),
        ])
        source["performers"].append({
            "localId": 31,
            "name": "Second performer",
            "evidence": {"remoteIds": []},
        })
        target = target_document([segment(500, start_ms=1000, review_state="approved")])
        collisions = [
            {
                "sourceMarkerId": row["localId"],
                "canonicalSegmentId": 500,
                "sourceMarkerFingerprint": MIGRATION.marker_fingerprint(row),
                "targetSegmentFingerprint": MIGRATION.segment_fingerprint(target["segments"][0]),
            }
            for row in source["markers"]
        ]

        plan = MIGRATION.build_plan(source, target, manifest_for(source, target, collisions=collisions))

        self.assertFalse(plan.result["succeeded"])
        self.assertIn("planned-slot-conflict", [row["code"] for row in plan.result["issues"]])

    def test_rejects_drift_in_the_reviewed_target_baseline(self):
        source = source_document([marker(1, "confirmed", external_id=9001, start_ms=1000)])
        target = target_document([segment(500, ref_id=9001, start_ms=1000)])
        manifest = manifest_for(source, target)
        target["segments"][0]["startMs"] = 2000

        with self.assertRaisesRegex(MIGRATION.ValidationError, "reviewed target"):
            MIGRATION.build_plan(source, target, manifest)

    def test_source_extraction_enriches_real_marker_rows_from_an_immutable_stash_snapshot(self):
        raw = {
            "scenes": [{"localId": 10}],
            "tags": [
                {"localId": 20, "name": "Primary"},
                {"localId": 21, "name": "Secondary"},
            ],
            "performers": [{"localId": 30, "name": "Performer"}],
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
            "markers": [{
                "localId": 1,
                "externalMarkerId": 9001,
                "sceneLocalId": 10,
                "primaryTagLocalId": 20,
                "startMs": 1000,
                "endMs": None,
                "status": "confirmed",
                "secondaryTagLocalIds": [21],
                "slotAssignments": [],
                "provenance": {"workflowTags": ["statusConfirmed"]},
            }],
            "statusConfigurationValid": True,
            "statusConflictCount": 0,
            "shotBoundaryConflictCount": 0,
        }
        with tempfile.TemporaryDirectory() as directory:
            sqlite_path = pathlib.Path(directory) / "stash.sqlite"
            connection = sqlite3.connect(sqlite_path)
            connection.executescript("""
                CREATE TABLE scene_stash_ids (scene_id INTEGER, endpoint TEXT, stash_id TEXT);
                CREATE TABLE tag_stash_ids (tag_id INTEGER, endpoint TEXT, stash_id TEXT);
                CREATE TABLE performer_stash_ids (performer_id INTEGER, endpoint TEXT, stash_id TEXT);
                INSERT INTO scene_stash_ids VALUES (10, 'stash', 'scene-10');
                INSERT INTO tag_stash_ids VALUES (20, 'stash', 'tag-20');
                INSERT INTO performer_stash_ids VALUES (30, 'stash', 'performer-30');
            """)
            connection.commit()
            connection.close()

            document = MIGRATION.build_source_document(
                raw,
                sqlite_path,
                source_instance_id="019c0000-0000-7000-8000-000000000001",
                marker_studio_sha256="1" * 64,
                stash_sqlite_sha256=MIGRATION.sha256_file(sqlite_path),
            )

        self.assertEqual(document["schemaVersion"], 3)
        self.assertEqual(
            document["scenes"][0]["evidence"]["remoteIds"],
            [{"endpoint": "stash", "remoteId": "scene-10"}],
        )
        self.assertEqual(document["markers"][0]["status"], "confirmed")
        self.assertEqual(document["shotBoundaries"], raw["shotBoundaries"])
        self.assertIn(
            "SELECT DISTINCT ON (boundary.stashapp_scene_id, boundary.start_time)",
            MIGRATION.SOURCE_EXTRACTION_SQL,
        )
        self.assertIn(
            "SELECT DISTINCT stashapp_scene_id AS id FROM shot_boundaries",
            MIGRATION.SOURCE_EXTRACTION_SQL,
        )
        self.assertIn(
            "boundary.created_at AT TIME ZONE 'UTC'",
            MIGRATION.SOURCE_EXTRACTION_SQL,
        )
        self.assertIn(
            "boundary.updated_at AT TIME ZONE 'UTC'",
            MIGRATION.SOURCE_EXTRACTION_SQL,
        )
        MIGRATION.validate_source(document)

    def test_source_extraction_fails_closed_on_conflicting_status_tags(self):
        raw = {
            "scenes": [], "tags": [], "performers": [], "markers": [],
            "statusConfigurationValid": True,
            "statusConflictCount": 1,
        }
        with self.assertRaisesRegex(MIGRATION.ValidationError, "conflicting review status"):
            MIGRATION.build_source_document(
                raw,
                pathlib.Path("unused.sqlite"),
                source_instance_id="source",
                marker_studio_sha256="1" * 64,
                stash_sqlite_sha256="2" * 64,
            )

    def test_source_extraction_fails_closed_on_conflicting_shot_boundaries(self):
        raw = {
            "scenes": [], "tags": [], "performers": [], "markers": [],
            "statusConfigurationValid": True,
            "statusConflictCount": 0,
            "shotBoundaryConflictCount": 1,
        }
        with self.assertRaisesRegex(MIGRATION.ValidationError, "conflicting shot boundaries"):
            MIGRATION.build_source_document(
                raw,
                pathlib.Path("unused.sqlite"),
                source_instance_id="source",
                marker_studio_sha256="1" * 64,
                stash_sqlite_sha256="2" * 64,
            )

    def test_receipt_schema_separates_immutable_identity_from_provenance(self):
        schema = MIGRATION.RECEIPT_SCHEMA_SQL

        self.assertIn("segment_studio_marker_migration_receipts", schema)
        self.assertIn("segment_studio_marker_migration_provenance", schema)
        self.assertIn("PRIMARY KEY (source_instance_id, source_marker_id)", schema)
        self.assertIn("source_marker_fingerprint", schema)
        self.assertIn("target_segment_fingerprint", schema)
        self.assertIn("metadata JSONB NOT NULL", schema)
        self.assertIn("ON DELETE CASCADE", schema)

    def test_serializable_apply_rebuilds_exact_plan_and_postchecks_without_rewriting_imported_state(self):
        source = source_document([marker(1, "unprocessed", start_ms=1000)])
        before = target_document([])
        manifest = manifest_for(source, before)
        reviewed = MIGRATION.build_plan(source, before, manifest)
        target = FakeApplyTarget(before)

        result = MIGRATION.apply_reviewed_plan(
            target,
            source,
            manifest,
            reviewed.result["planFingerprint"],
        )

        self.assertEqual(
            target.events,
            ["begin-serializable", "lock", "ensure-schema", "extract", "write", "extract", "record", "commit"],
        )
        self.assertEqual(target.snapshot["segments"][0]["reviewState"], "unreviewed")
        self.assertEqual(result["newSegmentCount"], 1)
        self.assertEqual(result["postCheckPendingWriteCount"], 0)

        rerun = MIGRATION.build_plan(source, target.snapshot, manifest)
        self.assertTrue(rerun.result["succeeded"])
        self.assertEqual(rerun.result["matchedReceiptCount"], 1)
        self.assertEqual(target.snapshot["segments"][0]["reviewState"], "unreviewed")

    def test_apply_rolls_back_before_writes_when_reviewed_plan_fingerprint_is_stale(self):
        source = source_document([marker(1, "confirmed")])
        before = target_document([])
        manifest = manifest_for(source, before)
        target = FakeApplyTarget(before)

        with self.assertRaisesRegex(MIGRATION.ValidationError, "plan fingerprint"):
            MIGRATION.apply_reviewed_plan(target, source, manifest, "f" * 64)

        self.assertEqual(
            target.events,
            ["begin-serializable", "lock", "ensure-schema", "extract", "rollback"],
        )
        self.assertEqual(target.snapshot, before)

    def test_baseline_approval_is_persisted_once_for_matched_and_unmatched_preexisting_segments(self):
        source = source_document([marker(1, "confirmed", external_id=9001, start_ms=1000)])
        before = target_document([
            segment(500, ref_id=9001, start_ms=1000),
            segment(501, ref_id=9002, start_ms=2000),
        ])
        manifest = manifest_for(source, before)
        initial = MIGRATION.build_plan(source, before, manifest)

        self.assertEqual(initial.baseline_approvals, [{"segmentId": 500}, {"segmentId": 501}])
        self.assertEqual(
            initial.baseline_receipt_inserts,
            [
                {"sourceInstanceId": source["sourceInstanceId"], "segmentId": 500,
                 "targetSegmentFingerprint": MIGRATION.segment_fingerprint(before["segments"][0])},
                {"sourceInstanceId": source["sourceInstanceId"], "segmentId": 501,
                 "targetSegmentFingerprint": MIGRATION.segment_fingerprint(before["segments"][1])},
            ],
        )
        target = FakeApplyTarget(before)
        MIGRATION.apply_reviewed_plan(target, source, manifest, initial.result["planFingerprint"])

        target.snapshot["segments"][0]["reviewState"] = "rejected"
        target.snapshot["segments"][1]["reviewState"] = "unreviewed"
        rerun = MIGRATION.build_plan(source, target.snapshot, manifest)

        self.assertTrue(rerun.result["succeeded"])
        self.assertEqual(rerun.baseline_approvals, [])
        self.assertEqual(rerun.baseline_receipt_inserts, [])

    def test_rerun_fails_closed_when_receipt_provenance_is_corrupt_or_deleted(self):
        source = source_document([marker(1, "confirmed", external_id=9001, start_ms=1000)])
        before = target_document([segment(500, ref_id=9001, start_ms=1000, review_state="approved")])
        manifest = manifest_for(source, before)
        initial = MIGRATION.build_plan(source, before, manifest)
        target = FakeApplyTarget(before)
        MIGRATION.apply_reviewed_plan(target, source, manifest, initial.result["planFingerprint"])

        corrupt = copy.deepcopy(target.snapshot)
        corrupt["receipts"][0]["externalMarkerId"] = 9999
        corrupt["receipts"][0]["matchKind"] = "ref"
        corrupt_plan = MIGRATION.build_plan(source, corrupt, manifest)
        self.assertFalse(corrupt_plan.result["succeeded"])
        self.assertIn("receipt-provenance-drift", [row["code"] for row in corrupt_plan.result["issues"]])

        deleted = copy.deepcopy(target.snapshot)
        deleted["receipts"] = []
        deleted_plan = MIGRATION.build_plan(source, deleted, manifest)
        self.assertFalse(deleted_plan.result["succeeded"])
        self.assertIn(
            "prior-migration-receipt-set-drift",
            [row["code"] for row in deleted_plan.result["issues"]],
        )

    def test_rejects_receipt_outside_the_current_source_marker_domain(self):
        source = source_document([marker(1, "confirmed")])
        target_segment = segment(500, start_ms=9000)
        forged = {
            "sourceInstanceId": source["sourceInstanceId"],
            "sourceMarkerId": 999,
            "segmentId": 500,
            "sourceMarkerFingerprint": "1" * 64,
            "targetSegmentFingerprint": MIGRATION.segment_fingerprint(target_segment),
        }
        target = target_document([target_segment], receipts=[forged])
        manifest = manifest_for(source, target)
        manifest["baselineSegments"] = []
        manifest["reviewedTargetFingerprint"] = MIGRATION.reviewed_target_fingerprint(target, [])

        with self.assertRaisesRegex(MIGRATION.ValidationError, "source marker domain"):
            MIGRATION.build_plan(source, target, manifest)

    def test_source_snapshot_inputs_must_be_private_and_sqlite_sidecar_free(self):
        with tempfile.TemporaryDirectory() as directory:
            root = pathlib.Path(directory)
            dump = root / "source.dump"
            sqlite_path = root / "stash.sqlite"
            dump.write_bytes(b"dump")
            sqlite_path.write_bytes(b"sqlite")
            dump.chmod(0o644)
            sqlite_path.chmod(0o600)

            with self.assertRaisesRegex(MIGRATION.ValidationError, "0600"):
                MIGRATION.validate_source_snapshot_inputs(dump, sqlite_path)

            dump.chmod(0o600)
            (root / "stash.sqlite-wal").write_bytes(b"wal")
            with self.assertRaisesRegex(MIGRATION.ValidationError, "sidecar"):
                MIGRATION.validate_source_snapshot_inputs(dump, sqlite_path)

    def test_fresh_target_plans_slot_definition_closure_before_assignments(self):
        slot_id = "019c0000-0000-7000-8000-000000000010"
        set_id = "019c0000-0000-7000-8000-000000000099"
        source = source_document([marker(1, "confirmed", slots=[{
            "slotDefinitionId": slot_id, "performerLocalId": 30,
        }])])
        source["slotDefinitionSets"] = [{
            "id": set_id, "sourceTagLocalId": 20,
            "allowSamePerformerInMultipleSlots": False,
        }]
        source["slotDefinitions"] = [{
            "id": slot_id, "slotDefinitionSetId": set_id,
            "label": "First", "sortOrder": 0, "genderHints": ["FEMALE"],
        }]
        target = target_document([])
        target["slotDefinitionIds"] = []
        target["slotDefinitionSets"] = []
        target["slotDefinitions"] = []
        plan = MIGRATION.build_plan(source, target, manifest_for(source, target))

        self.assertTrue(plan.result["succeeded"])
        self.assertEqual(len(plan.slot_definition_set_inserts), 1)
        self.assertEqual(len(plan.slot_definition_inserts), 1)
        self.assertEqual(len(plan.slot_gender_hint_inserts), 1)
        self.assertEqual(len(plan.slot_assignments), 1)

    def test_slot_definition_planning_rejects_order_hint_and_primary_tag_conflicts(self):
        set_id = "019c0000-0000-7000-8000-000000000099"
        existing_id = "019c0000-0000-7000-8000-000000000010"
        replacement_id = "019c0000-0000-7000-8000-000000000012"
        source = source_document([marker(1, "confirmed")])
        source["slotDefinitionSets"] = [{
            "id": set_id, "sourceTagLocalId": 20,
            "allowSamePerformerInMultipleSlots": False,
        }]
        source["slotDefinitions"] = [{
            "id": replacement_id, "slotDefinitionSetId": set_id,
            "label": None, "sortOrder": 0, "genderHints": [],
        }]
        target = target_document([])
        order_plan = MIGRATION.build_plan(source, target, manifest_for(source, target))
        self.assertFalse(order_plan.result["succeeded"])
        self.assertIn("slot-definition-order-conflict", [row["code"] for row in order_plan.result["issues"]])

        source["slotDefinitions"] = [{
            "id": existing_id, "slotDefinitionSetId": set_id,
            "label": None, "sortOrder": 0, "genderHints": ["FEMALE"],
        }]
        hint_plan = MIGRATION.build_plan(source, target, manifest_for(source, target))
        self.assertFalse(hint_plan.result["succeeded"])
        self.assertIn("slot-definition-gender-hint-conflict", [row["code"] for row in hint_plan.result["issues"]])

        mismatched = source_document([marker(1, "confirmed", slots=[{
            "slotDefinitionId": existing_id, "performerLocalId": 30,
        }])])
        mismatched["slotDefinitionSets"] = [{
            "id": set_id, "sourceTagLocalId": 21,
            "allowSamePerformerInMultipleSlots": False,
        }]
        mismatched["slotDefinitions"] = [{
            "id": existing_id, "slotDefinitionSetId": set_id,
            "label": None, "sortOrder": 0, "genderHints": [],
        }]
        mismatched_plan = MIGRATION.build_plan(
            mismatched, target_document([]), manifest_for(mismatched, target_document([])),
        )
        self.assertFalse(mismatched_plan.result["succeeded"])
        self.assertIn(
            "slot-definition-primary-tag-conflict",
            [row["code"] for row in mismatched_plan.result["issues"]],
        )

        incomplete = source_document([marker(1, "confirmed", slots=[{
            "slotDefinitionId": existing_id, "performerLocalId": 30,
        }])])
        incomplete["slotDefinitionSets"] = []
        incomplete["slotDefinitions"] = []
        with self.assertRaisesRegex(MIGRATION.ValidationError, "unknown source definition"):
            MIGRATION.validate_source(incomplete)

    def test_postgresql_apply_rolls_back_then_commits_and_reruns_noop(self):
        admin_url = os.environ.get("SEGMENT_STUDIO_MIGRATION_TEST_DATABASE_URL")
        if not admin_url:
            self.skipTest("SEGMENT_STUDIO_MIGRATION_TEST_DATABASE_URL is not set")
        database_name = "segment_studio_test_" + MIGRATION.uuid.uuid4().hex
        with MIGRATION.PostgreSqlConnection(admin_url) as admin:
            admin.execute(f'CREATE DATABASE "{database_name}";')
        database_url = MIGRATION.database_url_with_database(admin_url, database_name)
        try:
            with MIGRATION.PostgreSqlConnection(database_url) as connection:
                connection.execute("""
                    CREATE TABLE videos ("Id" integer PRIMARY KEY);
                    CREATE TABLE tags ("Id" integer PRIMARY KEY);
                    CREATE TABLE performers ("Id" integer PRIMARY KEY);
                    CREATE TABLE segments (
                        "Id" integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
                        "HostType" integer NOT NULL, "HostId" integer NOT NULL,
                        "StartSec" double precision NOT NULL, "EndSec" double precision NULL,
                        "TagId" integer NULL, "Kind" text NULL, "RefId" bigint NULL,
                        "Payload" jsonb NULL, "SourceKey" text NOT NULL, "SourceRunId" text NULL,
                        "CreatedAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        "UpdatedAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP);
                    CREATE TABLE segment_studio_slot_definition_sets (
                        id uuid PRIMARY KEY, tag_id integer NOT NULL UNIQUE,
                        allow_same_performer_in_multiple_slots boolean NOT NULL,
                        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP);
                    CREATE TABLE segment_studio_slot_definitions (
                        id uuid PRIMARY KEY, slot_definition_set_id uuid NOT NULL
                            REFERENCES segment_studio_slot_definition_sets(id),
                        label text NULL, sort_order integer NOT NULL,
                        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        UNIQUE(slot_definition_set_id, sort_order));
                    CREATE TABLE segment_studio_slot_definition_gender_hints (
                        slot_definition_id uuid NOT NULL REFERENCES segment_studio_slot_definitions(id),
                        gender_hint varchar(32) NOT NULL,
                        PRIMARY KEY(slot_definition_id, gender_hint));
                    CREATE TABLE segment_studio_segment_slots (
                        segment_id integer NOT NULL REFERENCES segments("Id"),
                        slot_definition_id uuid NOT NULL REFERENCES segment_studio_slot_definitions(id),
                        performer_id integer NOT NULL REFERENCES performers("Id"),
                        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        PRIMARY KEY(segment_id, slot_definition_id));
                    INSERT INTO videos VALUES (100);
                    INSERT INTO tags VALUES (200), (201);
                    INSERT INTO performers VALUES (300), (301);
                    INSERT INTO segments
                        ("Id", "HostType", "HostId", "StartSec", "TagId", "Kind", "RefId",
                         "Payload", "SourceKey") OVERRIDING SYSTEM VALUE
                    VALUES (500, 1, 100, 1.0, 200, 'tag', 9001, '{}', 'user');
                    SELECT setval(pg_get_serial_sequence('segments', 'Id'), 500, true);
                """, tuples=True)
                target_adapter = MIGRATION.PostgreSqlMigrationTarget(connection)
                before = target_adapter.extract_target()
                source = source_document([
                    marker(1, "confirmed", external_id=9001, start_ms=1000, secondary=[21], slots=[{
                        "slotDefinitionId": "019c0000-0000-7000-8000-000000000010",
                        "performerLocalId": 30,
                    }]),
                    marker(2, "rejected", start_ms=2000),
                    marker(3, "unprocessed", start_ms=3000),
                ])
                source["slotDefinitionSets"] = [{
                    "id": "019c0000-0000-7000-8000-000000000099",
                    "sourceTagLocalId": 20,
                    "allowSamePerformerInMultipleSlots": False,
                }]
                source["slotDefinitions"] = [{
                    "id": "019c0000-0000-7000-8000-000000000010",
                    "slotDefinitionSetId": "019c0000-0000-7000-8000-000000000099",
                    "label": "First", "sortOrder": 0, "genderHints": ["FEMALE"],
                }]
                manifest = manifest_for(source, before)
                initial = MIGRATION.build_plan(source, before, manifest)

                class FailAfterWrite(MIGRATION.PostgreSqlMigrationTarget):
                    def __init__(self, wrapped):
                        super().__init__(wrapped)
                        self.extract_count = 0

                    def extract_target(self):
                        self.extract_count += 1
                        if self.extract_count == 2:
                            raise MIGRATION.ValidationError("forced post-write failure")
                        return super().extract_target()

                with self.assertRaisesRegex(MIGRATION.ValidationError, "forced post-write"):
                    MIGRATION.apply_reviewed_plan(
                        FailAfterWrite(connection), source, manifest,
                        initial.result["planFingerprint"],
                    )
                self.assertEqual(connection.execute("SELECT count(*) FROM segments;", tuples=True), [["1"]])
                self.assertEqual(
                    connection.execute(
                        "SELECT to_regclass('segment_studio_marker_migration_receipts') IS NULL;",
                        tuples=True,
                    ),
                    [["t"]],
                )

                applied = MIGRATION.apply_reviewed_plan(
                    target_adapter, source, manifest, initial.result["planFingerprint"],
                )
                self.assertEqual(applied["postCheckPendingWriteCount"], 0)
                after = target_adapter.extract_target()
                self.assertEqual(len(after["segments"]), 3)
                self.assertEqual(len(after["receipts"]), 3)
                self.assertEqual(len(after["baselineReceipts"]), 1)
                self.assertEqual(len(after["migrationRuns"]), 1)
                self.assertEqual(len(after["segmentSlots"]), 1)
                self.assertEqual(
                    next(row for row in after["segments"] if row["id"] == 500)["secondaryTagIds"],
                    [201],
                )
                connection.execute("BEGIN;")
                try:
                    connection.execute("DELETE FROM segment_studio_marker_migration_provenance;")
                    corrupt_target = target_adapter.extract_target()
                    with self.assertRaisesRegex(MIGRATION.ValidationError, "cardinality"):
                        MIGRATION.validate_target(corrupt_target)
                finally:
                    connection.execute("ROLLBACK;")

                connection.execute("""
                    UPDATE segments SET "Payload" = jsonb_set(
                        "Payload", '{segmentStudio,reviewState}', '"rejected"', true)
                    WHERE "SourceKey" = 'ext:segment-studio:stash-marker-studio'
                      AND "Payload" -> 'segmentStudio' ->> 'reviewState' = 'unreviewed';
                """)
                rerun_result = MIGRATION.apply_reviewed_plan(
                    target_adapter, source, manifest, initial.result["planFingerprint"],
                )
                self.assertTrue(rerun_result["replayedReviewedPlan"])
                final = target_adapter.extract_target()
                self.assertEqual(len(final["migrationRuns"]), 1)
                imported_states = [
                    row["reviewState"] for row in final["segments"]
                    if row["id"] != 500
                ]
                self.assertEqual(sorted(imported_states), ["rejected", "rejected"])
        finally:
            with MIGRATION.PostgreSqlConnection(admin_url) as admin:
                admin.execute(
                    "SELECT pg_terminate_backend(pid) FROM pg_stat_activity "
                    "WHERE datname = $1 AND pid <> pg_backend_pid();",
                    [database_name], tuples=True,
                )
                admin.execute(f'DROP DATABASE IF EXISTS "{database_name}";')

    def test_stable_item_migration_preserves_slots_and_enforces_lifecycle_constraints(self):
        admin_url = os.environ.get("SEGMENT_STUDIO_MIGRATION_TEST_DATABASE_URL")
        if not admin_url:
            self.skipTest("SEGMENT_STUDIO_MIGRATION_TEST_DATABASE_URL is not set")
        database_name = "segment_studio_identity_" + MIGRATION.uuid.uuid4().hex
        with MIGRATION.PostgreSqlConnection(admin_url) as admin:
            admin.execute(f'CREATE DATABASE "{database_name}";')
        database_url = MIGRATION.database_url_with_database(admin_url, database_name)
        try:
            with MIGRATION.PostgreSqlConnection(database_url) as connection:
                connection.execute("""
                    CREATE TABLE videos ("Id" integer PRIMARY KEY);
                    CREATE TABLE tags ("Id" integer PRIMARY KEY);
                    CREATE TABLE performers ("Id" integer PRIMARY KEY);
                    CREATE TABLE segments (
                        "Id" integer PRIMARY KEY, "HostType" integer NOT NULL,
                        "HostId" integer NOT NULL, "StartSec" double precision NOT NULL,
                        "EndSec" double precision NULL, "TagId" integer NULL,
                        "Kind" text NULL, "Payload" jsonb NULL);
                    CREATE TABLE segment_studio_slot_definition_sets
                        (id uuid PRIMARY KEY, tag_id integer NOT NULL);
                    CREATE TABLE segment_studio_slot_definitions (
                        id uuid PRIMARY KEY, slot_definition_set_id uuid NOT NULL
                            REFERENCES segment_studio_slot_definition_sets(id));
                    CREATE TABLE segment_studio_segment_slots (
                        segment_id integer NOT NULL,
                        slot_definition_id uuid NOT NULL,
                        performer_id integer NOT NULL,
                        created_at timestamptz NOT NULL,
                        PRIMARY KEY (segment_id, slot_definition_id),
                        CONSTRAINT "FK_segment_studio_segment_slots_segments"
                            FOREIGN KEY (segment_id) REFERENCES segments("Id") ON DELETE CASCADE,
                        CONSTRAINT "FK_segment_studio_segment_slots_definitions"
                            FOREIGN KEY (slot_definition_id)
                            REFERENCES segment_studio_slot_definitions(id) ON DELETE CASCADE,
                        CONSTRAINT "FK_segment_studio_segment_slots_performers"
                            FOREIGN KEY (performer_id) REFERENCES performers("Id") ON DELETE RESTRICT);
                    CREATE INDEX "IX_segment_studio_segment_slots_definition"
                        ON segment_studio_segment_slots (slot_definition_id, segment_id);
                    CREATE INDEX "IX_segment_studio_segment_slots_performer"
                        ON segment_studio_segment_slots (performer_id, segment_id);
                    CREATE INDEX "IX_segment_studio_segment_slots_definition_performer_segment"
                        ON segment_studio_segment_slots
                        (slot_definition_id, performer_id, segment_id);
                    INSERT INTO videos VALUES (100);
                    INSERT INTO tags VALUES (200);
                    INSERT INTO performers VALUES (300), (301);
                    INSERT INTO segments VALUES
                        (500, 1, 100, 1.0, 2.0, 200, 'tag',
                         '{"segmentStudio":{"reviewState":"approved"}}'),
                        (501, 1, 100, 3.0, NULL, 200, 'tag', NULL);
                    INSERT INTO segment_studio_slot_definition_sets VALUES
                        ('019c0000-0000-7000-8000-000000000099', 200);
                    INSERT INTO segment_studio_slot_definitions VALUES
                        ('019c0000-0000-7000-8000-000000000010',
                         '019c0000-0000-7000-8000-000000000099'),
                        ('019c0000-0000-7000-8000-000000000011',
                         '019c0000-0000-7000-8000-000000000099');
                    INSERT INTO segment_studio_segment_slots VALUES
                        (500, '019c0000-0000-7000-8000-000000000010', 300,
                         '2026-07-20T12:00:00Z'),
                        (500, '019c0000-0000-7000-8000-000000000011', 301,
                         '2026-07-20T12:01:00Z');
                """)
                connection.execute(stable_item_migration_sql())

                self.assertEqual(connection.execute("""
                    SELECT count(*), count(DISTINCT item_id),
                           min(created_at)::text, max(created_at)::text
                    FROM segment_studio_segment_slots;
                """, tuples=True), [["2", "1", "2026-07-20 12:00:00+00", "2026-07-20 12:01:00+00"]])
                self.assertEqual(connection.execute("""
                    SELECT count(*), count(native_segment_id),
                           count(*) FILTER (WHERE native_segment_id IS NULL)
                    FROM segment_studio_items;
                """, tuples=True), [["1", "1", "0"]])
                self.assertEqual(connection.execute("""
                    SELECT legacy_review_state FROM segment_studio_item_compatibility
                    WHERE native_segment_id = 500;
                """, tuples=True), [["approved"]])
                with self.assertRaises(MIGRATION.ValidationError):
                    connection.execute("""
                        INSERT INTO segment_studio_items
                            (native_segment_id, review_state, video_id, start_sec,
                             tag_id, kind, source_key)
                        VALUES (501, 'unreviewed', 100, 3.0, 200, 'tag', 'invalid');
                    """)
                connection.execute("""
                    INSERT INTO segment_studio_items
                        (review_state, video_id, start_sec, tag_id, kind, source_key,
                         extension_image_blob_id)
                    VALUES ('rejected', 100, 4.0, 200, 'tag', 'test', 'blob-1');
                    DELETE FROM segment_studio_items WHERE extension_image_blob_id = 'blob-1';
                """)
                self.assertEqual(connection.execute("""
                    SELECT blob_id, status, attempt_count
                    FROM segment_studio_blob_cleanup_outbox;
                """, tuples=True), [["blob-1", "pending", "0"]])
                connection.execute('DELETE FROM segments WHERE "Id" = 500;')
                self.assertEqual(connection.execute(
                    "SELECT count(*) FROM segment_studio_segment_slots;", tuples=True), [["0"]])
                self.assertEqual(connection.execute(
                    "SELECT count(*) FROM segment_studio_items;", tuples=True), [["0"]])
        finally:
            with MIGRATION.PostgreSqlConnection(admin_url) as admin:
                admin.execute(
                    "SELECT pg_terminate_backend(pid) FROM pg_stat_activity "
                    "WHERE datname = $1 AND pid <> pg_backend_pid();",
                    [database_name], tuples=True,
                )
                admin.execute(f'DROP DATABASE IF EXISTS "{database_name}";')


class FakeApplyTarget:
    def __init__(self, snapshot):
        self.snapshot = copy.deepcopy(snapshot)
        self.events = []

    def begin_serializable(self):
        self.events.append("begin-serializable")

    def acquire_lock(self):
        self.events.append("lock")

    def ensure_schema(self):
        self.events.append("ensure-schema")

    def extract_target(self):
        self.events.append("extract")
        return copy.deepcopy(self.snapshot)

    def write_plan(self, plan, source_fingerprint, plan_fingerprint):
        self.events.append("write")
        next_id = max([row["id"] for row in self.snapshot["segments"]] or [499]) + 1
        token_ids = {}
        for creation in plan.creations:
            segment_id = next_id
            next_id += 1
            token_ids[creation["createToken"]] = segment_id
            self.snapshot["segments"].append(segment(
                segment_id,
                ref_id=creation["refId"],
                start_ms=creation["startMs"],
                review_state=creation["reviewState"],
                secondary=creation["secondaryTagIds"],
            ))
        for update in plan.baseline_approvals:
            next(row for row in self.snapshot["segments"] if row["id"] == update["segmentId"])["reviewState"] = "approved"
        for update in plan.secondary_tag_updates:
            next(row for row in self.snapshot["segments"] if row["id"] == update["segmentId"])["secondaryTagIds"] = update["secondaryTagIds"]
        self.snapshot["baselineReceipts"].extend(copy.deepcopy(plan.baseline_receipt_inserts))
        self.snapshot["slotDefinitionSets"].extend(copy.deepcopy(plan.slot_definition_set_inserts))
        self.snapshot["slotDefinitions"].extend(copy.deepcopy(plan.slot_definition_inserts))
        self.snapshot["slotGenderHints"].extend(copy.deepcopy(plan.slot_gender_hint_inserts))
        self.snapshot["slotDefinitionIds"].extend(row["id"] for row in plan.slot_definition_inserts)
        segment_by_id = {row["id"]: row for row in self.snapshot["segments"]}
        for receipt in plan.receipt_inserts:
            segment_id = receipt.get("segmentId") or token_ids[receipt["createToken"]]
            stored_receipt = {
                "sourceInstanceId": receipt["sourceInstanceId"],
                "sourceMarkerId": receipt["sourceMarkerId"],
                "segmentId": segment_id,
                "externalMarkerId": receipt["externalMarkerId"],
                "sourceMarkerFingerprint": receipt["sourceMarkerFingerprint"],
                "targetSegmentFingerprint": MIGRATION.segment_fingerprint(segment_by_id[segment_id]),
                "sourceFingerprint": source_fingerprint,
                "sourceStatus": receipt["sourceStatus"],
                "matchKind": receipt["matchKind"],
                "provenance": receipt["provenance"],
            }
            stored_receipt["provenanceFingerprint"] = MIGRATION.receipt_provenance_fingerprint(stored_receipt)
            self.snapshot["receipts"].append(stored_receipt)
        for slot in plan.slot_assignments:
            segment_id = slot.get("segmentId") or token_ids[slot["createToken"]]
            self.snapshot["segmentSlots"].append({**slot, "segmentId": segment_id})
            self.snapshot["segmentSlots"][-1].pop("createToken", None)

    def record_run(self, plan, postcheck, source_instance_id):
        self.events.append("record")
        self.snapshot["migrationRuns"].append(MIGRATION.migration_run_record(
            plan,
            postcheck,
            source_instance_id,
            self.snapshot,
        ))

    def commit(self):
        self.events.append("commit")

    def rollback(self):
        self.events.append("rollback")


if __name__ == "__main__":
    unittest.main()
