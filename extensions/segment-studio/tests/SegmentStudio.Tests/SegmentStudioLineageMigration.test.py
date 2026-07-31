import copy
import importlib.util
import os
import pathlib
import re
import sqlite3
import tempfile
import unittest
import uuid
from types import SimpleNamespace
from unittest import mock


SCRIPT = pathlib.Path(__file__).parents[2] / "scripts" / "segment_studio_marker_replacement.py"
REBASELINE_SCRIPT = pathlib.Path(__file__).parents[2] / "scripts" / "rebaseline-segment-studio-migrations.sql"
SPEC = importlib.util.spec_from_file_location("segment_studio_marker_replacement_lineage", SCRIPT)
MIGRATION = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MIGRATION)

REPLACEMENT_TEST_SPEC = importlib.util.spec_from_file_location(
    "segment_studio_marker_replacement_integration",
    pathlib.Path(__file__).with_name("SegmentStudioMarkerReplacement.test.py"),
)
REPLACEMENT_TESTS = importlib.util.module_from_spec(REPLACEMENT_TEST_SPEC)
REPLACEMENT_TEST_SPEC.loader.exec_module(REPLACEMENT_TESTS)


def marker(identity, primary_tag, source_tags, *, derivations=(), scene=10):
    return {
        "localId": identity,
        "externalMarkerId": None,
        "sceneLocalId": scene,
        "primaryTagLocalId": primary_tag,
        "startMs": identity * 1000,
        "endMs": identity * 1000 + 500,
        "status": "confirmed",
        "secondaryTagLocalIds": list(source_tags),
        "slotAssignments": [],
        "provenance": {
            "workflowTags": [],
            "derivations": list(derivations),
            "analysis": [],
        },
    }


def derivation(source, rule="rule-1", depth=1):
    return {"sourceMarkerId": source, "ruleId": rule, "depth": depth}


def fixture(markers):
    tags = [
        {"localId": 20, "name": "Root"},
        {"localId": 21, "name": "Derived A"},
        {"localId": 22, "name": "Derived B"},
        {"localId": 30, "name": "Marker Source: Manual"},
        {"localId": 31, "name": "Marker Source: Skier AI"},
        {"localId": 32, "name": "Marker Source: TPDB"},
        {"localId": 33, "name": "Marker Source: Derived"},
    ]
    source = {
        "schemaVersion": 3,
        "sourceKind": "stash-marker-studio",
        "sourceInstanceId": "anonymized-fixture",
        "snapshots": {
            "markerStudioSha256": "1" * 64,
            "stashSqliteSha256": "2" * 64,
        },
        "scenes": [{"localId": 10}, {"localId": 11}],
        "tags": tags,
        "performers": [],
        "slotDefinitionSets": [],
        "slotDefinitions": [],
        "derivedMarkerRules": [
            {
                "id": "rule-1",
                "sourceTagLocalId": 20,
                "derivedTagLocalId": 21,
                "relationshipType": "implies",
                "sortOrder": 0,
                "createdAt": "2026-01-01T00:00:00Z",
                "updatedAt": "2026-01-01T00:00:00Z",
                "slotMappings": [],
            },
            {
                "id": "rule-2",
                "sourceTagLocalId": 21,
                "derivedTagLocalId": 22,
                "relationshipType": "implies",
                "sortOrder": 1,
                "createdAt": "2026-01-01T00:00:00Z",
                "updatedAt": "2026-01-01T00:00:00Z",
                "slotMappings": [],
            },
        ],
        "shotBoundaries": [],
        "markers": markers,
    }
    target = {
        "schemaVersion": 2,
        "videoIds": [100, 101],
        "tagIds": [200, 201, 202, 300, 301, 302, 303],
        "performerIds": [],
        "slotDefinitionSets": [],
        "slotDefinitions": [],
        "slotGenderHints": [],
        "segmentCount": 0,
        "stableItemCount": 0,
        "workspaceCount": 0,
        "shotBoundaryCount": 0,
        "shotBoundaries": [],
        "receiptIntegrity": {"orphanReceiptCount": 0, "orphanProvenanceCount": 0},
        "priorRuns": [],
    }
    manifest = {
        "schemaVersion": 2,
        "sourceFingerprint": MIGRATION.source_fingerprint(source),
        "reviewedTargetFingerprint": MIGRATION.target_fingerprint(target),
        "entityMappings": [
            {"entityKind": "scene", "sourceLocalId": 10, "canonicalId": 100},
            {"entityKind": "scene", "sourceLocalId": 11, "canonicalId": 101},
            *[
                {"entityKind": "tag", "sourceLocalId": row["localId"], "canonicalId": {
                    20: 200, 21: 201, 22: 202, 30: 300, 31: 301, 32: 302, 33: 303,
                }[row["localId"]]}
                for row in tags
            ],
        ],
        "lineage": {"enabled": True, "exclusions": []},
    }
    return source, target, manifest


class SegmentStudioLineageMigrationTests(unittest.TestCase):
    def plan(self, markers):
        source, target, manifest = fixture(markers)
        return MIGRATION.build_plan(source, target, manifest), source, target, manifest

    def test_all_observed_source_combinations_map_to_origin_or_inherited(self):
        plan, _, _, _ = self.plan([
            marker(1, 20, [30]),
            marker(2, 20, [31]),
            marker(3, 20, [32]),
            marker(4, 21, [30, 33], derivations=[derivation(1)]),
            marker(5, 21, [31, 33], derivations=[derivation(2)]),
            marker(6, 21, [32, 33], derivations=[derivation(3)]),
        ])
        self.assertTrue(plan.result["succeeded"])
        self.assertEqual(
            [(row["sourceKey"], row["relation"]) for row in plan.lineage_assertions],
            [
                ("user", "origin"),
                ("stash-marker-studio:skier-ai", "origin"),
                ("tpdb", "origin"),
                ("user", "inherited"),
                ("stash-marker-studio:skier-ai", "inherited"),
                ("tpdb", "inherited"),
            ],
        )
        self.assertEqual(
            [row["sourceKey"] for row in plan.items],
            [
                "segment-studio/user",
                "stash-marker-studio:skier-ai",
                "tpdb",
                "segment-studio/user",
                "stash-marker-studio:skier-ai",
                "tpdb",
            ],
        )
        self.assertEqual(len(plan.lineage_edges), 3)
        self.assertTrue(all("sourceMarkerId" not in str(row) for row in plan.lineage_edges))

    def test_ambiguous_or_missing_source_evidence_keeps_the_legacy_import_key(self):
        source, _, _ = fixture([])
        tag_names = {row["localId"]: row["name"] for row in source["tags"]}
        self.assertEqual(
            MIGRATION.promoted_item_source_key(marker(1, 20, [], scene=10), tag_names),
            MIGRATION.SOURCE_KEY,
        )
        self.assertEqual(
            MIGRATION.promoted_item_source_key(marker(2, 20, [30, 32], scene=10), tag_names),
            MIGRATION.SOURCE_KEY,
        )

    def test_source_and_derived_discrepancies_are_typed(self):
        plan, _, _, _ = self.plan([
            marker(1, 20, []),
            marker(2, 20, [30, 32]),
            marker(3, 21, [30, 33]),
            marker(4, 21, [30], derivations=[derivation(1)]),
        ])
        codes = {row["code"] for row in plan.lineage_discrepancies}
        self.assertIn("missing-source-tag", codes)
        self.assertIn("conflicting-source-tags", codes)
        self.assertIn("derived-tag-without-incoming-edge", codes)
        self.assertIn("incoming-edge-without-derived-tag", codes)
        self.assertFalse(plan.result["succeeded"])

    def test_missing_endpoint_duplicate_edge_missing_rule_and_mismatch_are_reported(self):
        plan, _, _, _ = self.plan([
            marker(1, 20, [30], derivations=[derivation(2)]),
            marker(2, 21, [30, 33], derivations=[
                derivation(1), derivation(1), derivation(1, "missing"),
                derivation(99, "missing"),
            ]),
        ])
        codes = {row["code"] for row in plan.lineage_discrepancies}
        self.assertIn("duplicate-edge", codes)
        self.assertIn("missing-endpoint", codes)
        self.assertIn("missing-rule", codes)
        self.assertIn("rule-tag-mismatch", codes)
        self.assertFalse(plan.result["succeeded"])

    def test_multi_parent_and_multi_level_edges_are_preserved(self):
        plan, _, _, _ = self.plan([
            marker(1, 20, [30]),
            marker(2, 20, [31]),
            marker(3, 21, [30, 33], derivations=[derivation(1), derivation(2)]),
            marker(4, 22, [30, 33], derivations=[derivation(3, "rule-2", 2)]),
        ])
        self.assertTrue(plan.result["succeeded"])
        self.assertEqual(len(plan.lineage_edges), 3)
        self.assertEqual(plan.result["lineageReport"]["plannedEdgeCount"], 3)
        self.assertEqual(plan.result["lineageReport"]["derivedTagCount"], 2)
        child_sources = {
            row["sourceKey"]
            for row in plan.lineage_assertions
            if row["createToken"].endswith(":3")
        }
        self.assertEqual(
            child_sources,
            {"user", "stash-marker-studio:skier-ai"},
        )

    def test_self_and_cross_video_edges_are_blocked(self):
        plan, _, _, _ = self.plan([
            marker(1, 20, [30], derivations=[derivation(1)]),
            marker(2, 21, [30, 33], derivations=[derivation(1)], scene=11),
        ])
        codes = {row["code"] for row in plan.lineage_discrepancies}
        self.assertIn("self-edge", codes)
        self.assertIn("cross-video-edge", codes)
        self.assertEqual(plan.lineage_edges, [])
        self.assertFalse(plan.result["succeeded"])

    def test_extracted_rule_metadata_is_preserved_and_mismatch_is_fatal(self):
        plan, source, target, manifest = self.plan([
            marker(1, 20, [30]),
            marker(2, 21, [30, 33], derivations=[derivation(1)]),
        ])
        source["derivedMarkerRules"] = []
        manifest["sourceFingerprint"] = MIGRATION.source_fingerprint(source)
        plan = MIGRATION.build_plan(source, target, manifest)
        self.assertIn(
            "missing-rule", {row["code"] for row in plan.lineage_discrepancies}
        )
        source["derivedMarkerRules"] = [{
            "id": "rule-1",
            "sourceTagLocalId": 20,
            "derivedTagLocalId": 21,
            "relationshipType": "implies",
            "sortOrder": 0,
            "createdAt": "2026-01-01T00:00:00Z",
            "updatedAt": "2026-01-01T00:00:00Z",
            "slotMappings": [],
        }]
        manifest["sourceFingerprint"] = MIGRATION.source_fingerprint(source)
        reconstructed = MIGRATION.build_plan(source, target, manifest)
        self.assertTrue(reconstructed.result["succeeded"])
        self.assertNotIn("enabled", reconstructed.lineage_rules[0])
        self.assertEqual(
            [(row["residence"], row["reviewState"]) for row in reconstructed.items],
            [("native", None), ("extension", "approved")],
        )
        self.assertEqual(reconstructed.result["plannedNativeCount"], 1)
        self.assertEqual(reconstructed.result["plannedOwnedApprovedCount"], 1)
        self.assertNotIn(
            "missing-rule",
            {row["code"] for row in reconstructed.lineage_discrepancies},
        )
        source["derivedMarkerRules"][0]["derivedTagLocalId"] = 22
        manifest["sourceFingerprint"] = MIGRATION.source_fingerprint(source)
        mismatched = MIGRATION.build_plan(source, target, manifest)
        self.assertFalse(mismatched.result["succeeded"])
        self.assertIn(
            "rule-tag-mismatch",
            {row["code"] for row in mismatched.lineage_discrepancies},
        )

    def test_same_tag_edge_is_rejected_before_database_apply(self):
        plan, _, _, _ = self.plan([
            marker(1, 20, [30]),
            marker(2, 20, [30, 33], derivations=[derivation(1)]),
        ])
        self.assertFalse(plan.result["succeeded"])
        self.assertIn(
            "same-tag-edge", {row["code"] for row in plan.lineage_discrepancies}
        )

    def test_derived_source_not_carried_by_an_ancestor_is_reported(self):
        plan, _, _, _ = self.plan([
            marker(1, 20, [31]),
            marker(2, 21, [30, 33], derivations=[derivation(1)]),
        ])
        self.assertTrue(plan.result["succeeded"])
        self.assertIn(
            "derived-source-not-in-ancestors",
            {row["code"] for row in plan.lineage_discrepancies},
        )
        child_sources = {
            row["sourceKey"]
            for row in plan.lineage_assertions
            if row["createToken"].endswith(":2")
        }
        self.assertEqual(
            child_sources,
            {"user", "stash-marker-studio:skier-ai"},
        )

    def test_reviewed_edge_exclusion_omits_the_record_and_is_fingerprint_bound(self):
        plan, source, target, manifest = self.plan([
            marker(1, 20, [30]),
            marker(2, 21, [30, 33], derivations=[derivation(99, "missing")]),
        ])
        self.assertFalse(plan.result["succeeded"])
        exclusion = {
            "kind": "edge",
            "sourceMarkerId": 99,
            "derivedMarkerId": 2,
            "ruleId": "missing",
            "depth": 1,
            "occurrence": 0,
            "reason": "Endpoint excluded by reviewed reconciliation",
        }
        exclusion["edgeFingerprint"] = MIGRATION.sha256_json({
            key: exclusion[key]
            for key in (
                "sourceMarkerId", "derivedMarkerId", "ruleId", "depth", "occurrence"
            )
        })
        manifest["lineage"]["exclusions"] = [exclusion]
        reviewed = MIGRATION.build_plan(source, target, manifest)
        self.assertTrue(reviewed.result["succeeded"])
        self.assertEqual(reviewed.lineage_edges, [])
        changed = copy.deepcopy(manifest)
        changed["lineage"]["exclusions"][0]["depth"] = 2
        with self.assertRaisesRegex(MIGRATION.ValidationError, "drifted"):
            MIGRATION.build_plan(source, target, changed)

    def test_marker_exclusions_cannot_waive_an_invalid_edge(self):
        markers = [
            marker(1, 20, [30], derivations=[derivation(2)]),
            marker(2, 21, [30, 33], derivations=[derivation(1)]),
        ]
        _, source, target, manifest = self.plan(markers)
        manifest["lineage"]["exclusions"] = [{
            "kind": "marker",
            "sourceMarkerId": 1,
            "sourceMarkerFingerprint": MIGRATION.sha256_json(
                MIGRATION.normalized_marker(source["markers"][0])
            ),
            "reason": "Reviewed marker omission",
        }]
        plan = MIGRATION.build_plan(source, target, manifest)
        self.assertFalse(plan.result["succeeded"])
        self.assertIn(
            "rule-tag-mismatch",
            {row["code"] for row in plan.lineage_discrepancies},
        )
        self.assertEqual(len(plan.lineage_edges), 1)

    def test_plan_fingerprint_covers_lineage_and_replay_is_deterministic(self):
        plan, source, target, manifest = self.plan([
            marker(1, 20, [30]),
            marker(2, 21, [30, 33], derivations=[derivation(1)]),
        ])
        replay = MIGRATION.build_plan(
            copy.deepcopy(source), copy.deepcopy(target), copy.deepcopy(manifest)
        )
        self.assertEqual(plan.result["planFingerprint"], replay.result["planFingerprint"])
        changed = copy.deepcopy(source)
        changed["markers"][1]["provenance"]["derivations"][0]["depth"] = 2
        changed_manifest = copy.deepcopy(manifest)
        changed_manifest["sourceFingerprint"] = MIGRATION.source_fingerprint(changed)
        self.assertNotEqual(
            plan.result["planFingerprint"],
            MIGRATION.build_plan(changed, target, changed_manifest).result["planFingerprint"],
        )

    def test_lineage_disabled_preserves_untranslated_source_tags(self):
        _, source, target, manifest = self.plan([marker(1, 20, [30])])
        manifest.pop("lineage")
        legacy = MIGRATION.build_plan(source, target, manifest)
        self.assertEqual(legacy.lineage_assertions, [])
        self.assertIn(300, legacy.items[0]["secondaryTagIds"])

    def test_lineage_preparation_recovers_stash_sources_and_applies_reviewed_policy(self):
        source, _, manifest = fixture([
            marker(1, 20, [], scene=10),
            marker(2, 20, [], scene=10),
            marker(3, 20, [], scene=10),
            marker(4, 20, [], scene=10),
            marker(
                5,
                22,
                [],
                scene=10,
                derivations=[derivation(1)],
            ),
        ])
        source["tags"] = source["tags"][:3]
        source["markers"][0]["externalMarkerId"] = 501
        source["markers"][1]["externalMarkerId"] = 502
        source["markers"][1]["provenance"]["analysis"] = [{
            "source": "nsfw_ai_v3",
        }]
        source["markers"][2]["externalMarkerId"] = 503
        source["markers"][3]["externalMarkerId"] = 504
        source["markers"][3]["status"] = "unprocessed"
        source["markers"][4]["externalMarkerId"] = 505
        source["derivedMarkerRules"] = [{
            "id": "rule-1",
            "sourceTagLocalId": 20,
            "derivedTagLocalId": 21,
            "relationshipType": "implies",
            "sortOrder": 0,
            "createdAt": "2026-01-01T00:00:00Z",
            "updatedAt": "2026-01-01T00:00:00Z",
            "slotMappings": [],
        }]
        manifest["entityMappings"] = [
            row
            for row in manifest["entityMappings"]
            if row["sourceLocalId"] in {10, 11, 20, 21, 22}
        ]
        manifest["sourceFingerprint"] = MIGRATION.source_fingerprint(source)

        with tempfile.TemporaryDirectory() as directory:
            sqlite_path = pathlib.Path(directory) / "stash.sqlite"
            connection = sqlite3.connect(sqlite_path)
            connection.executescript("""
                CREATE TABLE tags (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
                CREATE TABLE scene_markers_tags (
                    scene_marker_id INTEGER NOT NULL,
                    tag_id INTEGER NOT NULL
                );
                CREATE TABLE tag_stash_ids (
                    tag_id INTEGER NOT NULL,
                    endpoint TEXT NOT NULL,
                    stash_id TEXT NOT NULL
                );
                INSERT INTO tags VALUES
                    (8101, 'Marker Source: Manual'),
                    (8202, 'Marker Source: Skier AI'),
                    (8303, 'Marker Source: Derived');
                INSERT INTO scene_markers_tags VALUES
                    (501, 8202),
                    (505, 8101),
                    (505, 8303);
                INSERT INTO tag_stash_ids VALUES
                    (8101, 'stash', 'manual-source'),
                    (8202, 'stash', 'skier-source');
            """)
            connection.commit()
            connection.close()
            sqlite_path.chmod(0o600)
            source["snapshots"]["stashSqliteSha256"] = (
                REPLACEMENT_TESTS.LEGACY.sha256_file(sqlite_path)
            )
            manifest["sourceFingerprint"] = MIGRATION.source_fingerprint(source)

            prepared_source, prepared_manifest, report = (
                REPLACEMENT_TESTS.LEGACY.prepare_lineage_source(
                    source,
                    manifest,
                    sqlite_path,
                    inferred_analysis_sources={"nsfw_ai_v3"},
                    infer_confirmed_without_analysis=True,
                    source_tag_mappings={
                        "Marker Source: Manual": 300,
                        "Marker Source: Skier AI": 301,
                        "Marker Source: Derived": 303,
                    },
                    exclude_unclassified_markers=True,
                    exclude_rule_tag_mismatches=True,
                )
            )
            replay_source, replay_manifest, _ = (
                REPLACEMENT_TESTS.LEGACY.prepare_lineage_source(
                    prepared_source,
                    prepared_manifest,
                    sqlite_path,
                    inferred_analysis_sources={"nsfw_ai_v3"},
                    infer_confirmed_without_analysis=True,
                    source_tag_mappings={
                        "Marker Source: Manual": 300,
                        "Marker Source: Skier AI": 301,
                        "Marker Source: Derived": 303,
                    },
                    exclude_unclassified_markers=True,
                    exclude_rule_tag_mismatches=True,
                )
            )

        tags = {row["name"]: row for row in prepared_source["tags"]}
        self.assertEqual(tags["Marker Source: Manual"]["localId"], 8101)
        self.assertEqual(tags["Marker Source: Skier AI"]["localId"], 8202)
        self.assertEqual(
            tags["Marker Source: Manual"]["evidence"]["remoteIds"],
            [{"endpoint": "stash", "remoteId": "manual-source"}],
        )
        self.assertEqual(
            [row["secondaryTagLocalIds"] for row in prepared_source["markers"]],
            [[8202], [8202], [8101], [], [8101, 8303]],
        )
        self.assertEqual(
            report["classificationCounts"],
            {
                "confirmed-manual-inference": 1,
                "exact-stash-recovery": 2,
                "nsfw-ai-inference": 1,
            },
        )
        self.assertEqual(report["markerExclusionCount"], 1)
        self.assertEqual(report["edgeExclusionCount"], 1)
        mappings = {
            (row["entityKind"], row["sourceLocalId"]): row["canonicalId"]
            for row in prepared_manifest["entityMappings"]
        }
        self.assertEqual(mappings[("tag", 8101)], 300)
        self.assertEqual(mappings[("tag", 8202)], 301)
        self.assertEqual(mappings[("tag", 8303)], 303)
        exclusions = prepared_manifest["lineage"]["exclusions"]
        self.assertEqual(
            [row["kind"] for row in exclusions],
            ["edge", "marker"],
        )
        self.assertEqual(
            prepared_manifest["sourceFingerprint"],
            MIGRATION.source_fingerprint(prepared_source),
        )
        self.assertEqual(replay_source, prepared_source)
        self.assertEqual(replay_manifest, prepared_manifest)

    def test_lineage_preparation_requires_explicit_mapping_for_recovered_source_tag(self):
        source, _, manifest = fixture([marker(1, 20, [])])
        source["tags"] = source["tags"][:3]
        source["markers"][0]["externalMarkerId"] = 501
        manifest["entityMappings"] = [
            row
            for row in manifest["entityMappings"]
            if row["sourceLocalId"] in {10, 11, 20, 21, 22}
        ]
        manifest["sourceFingerprint"] = MIGRATION.source_fingerprint(source)

        with tempfile.TemporaryDirectory() as directory:
            sqlite_path = pathlib.Path(directory) / "stash.sqlite"
            connection = sqlite3.connect(sqlite_path)
            connection.executescript("""
                CREATE TABLE tags (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
                CREATE TABLE scene_markers_tags (
                    scene_marker_id INTEGER NOT NULL,
                    tag_id INTEGER NOT NULL
                );
                CREATE TABLE tag_stash_ids (
                    tag_id INTEGER NOT NULL,
                    endpoint TEXT NOT NULL,
                    stash_id TEXT NOT NULL
                );
                INSERT INTO tags VALUES (9123, 'Marker Source: Skier AI');
                INSERT INTO scene_markers_tags VALUES (501, 9123);
            """)
            connection.commit()
            connection.close()
            sqlite_path.chmod(0o600)
            source["snapshots"]["stashSqliteSha256"] = (
                REPLACEMENT_TESTS.LEGACY.sha256_file(sqlite_path)
            )
            manifest["sourceFingerprint"] = MIGRATION.source_fingerprint(source)

            with self.assertRaisesRegex(
                REPLACEMENT_TESTS.LEGACY.ValidationError,
                "explicit canonical mapping.*Marker Source: Skier AI",
            ):
                REPLACEMENT_TESTS.LEGACY.prepare_lineage_source(
                    source,
                    manifest,
                    sqlite_path,
                    inferred_analysis_sources=set(),
                    infer_confirmed_without_analysis=False,
                    source_tag_mappings={},
                    exclude_unclassified_markers=False,
                    exclude_rule_tag_mismatches=False,
                )

    def test_lineage_preparation_compares_rule_tags_after_canonical_mapping(self):
        mappings = {
            ("tag", local_id): {
                "entityKind": "tag",
                "sourceLocalId": local_id,
                "canonicalId": canonical_id,
            }
            for local_id, canonical_id in (
                (20, 200),
                (21, 201),
                (22, 200),
                (23, 201),
            )
        }
        source_marker = {"primaryTagLocalId": 20}
        derived_marker = {"primaryTagLocalId": 21}
        rule = {"sourceTagLocalId": 22, "derivedTagLocalId": 23}

        self.assertFalse(
            REPLACEMENT_TESTS.LEGACY._rule_tag_mismatch(
                source_marker, derived_marker, rule, mappings
            )
        )
        mappings[("tag", 23)]["canonicalId"] = 202
        self.assertTrue(
            REPLACEMENT_TESTS.LEGACY._rule_tag_mismatch(
                source_marker, derived_marker, rule, mappings
            )
        )
        mappings[("tag", 21)]["canonicalId"] = 200
        self.assertFalse(
            REPLACEMENT_TESTS.LEGACY._rule_tag_mismatch(
                source_marker, derived_marker, rule, mappings
            )
        )

    def test_lineage_preparation_rejects_duplicate_review_inputs(self):
        duplicate_mapping = {
            "entityKind": "tag",
            "sourceLocalId": 20,
            "canonicalId": 200,
        }
        with self.assertRaisesRegex(
            REPLACEMENT_TESTS.LEGACY.ValidationError,
            "duplicate source entity mappings",
        ):
            REPLACEMENT_TESTS.LEGACY._manifest_entity_mappings({
                "entityMappings": [
                    duplicate_mapping,
                    {**duplicate_mapping, "canonicalId": 201},
                ],
            })
        with self.assertRaisesRegex(
            REPLACEMENT_TESTS.LEGACY.ValidationError,
            "entity mapping is invalid",
        ):
            REPLACEMENT_TESTS.LEGACY._manifest_entity_mappings({
                "entityMappings": [
                    {**duplicate_mapping, "canonicalId": "not-an-id"},
                ],
            })

        duplicate_exclusion = {
            "kind": "marker",
            "sourceMarkerId": 1,
            "sourceMarkerFingerprint": "a" * 64,
            "reason": "Reviewed omission",
        }
        with self.assertRaisesRegex(
            REPLACEMENT_TESTS.LEGACY.ValidationError,
            "duplicate lineage exclusions",
        ):
            REPLACEMENT_TESTS.LEGACY._merge_lineage_exclusions(
                [duplicate_exclusion, copy.deepcopy(duplicate_exclusion)],
                [],
            )

    def test_lineage_preparation_removes_partial_output_bundle_after_io_failure(self):
        writer = REPLACEMENT_TESTS.LEGACY.atomic_private_json
        with tempfile.TemporaryDirectory() as directory:
            paths = [
                pathlib.Path(directory) / name
                for name in ("source.json", "manifest.json", "report.json")
            ]

            def fail_second(path, value):
                if path == paths[1]:
                    raise OSError("simulated output failure")
                writer(path, value)

            with (
                mock.patch.object(
                    REPLACEMENT_TESTS.LEGACY,
                    "atomic_private_json",
                    side_effect=fail_second,
                ),
                self.assertRaisesRegex(OSError, "simulated output failure"),
            ):
                REPLACEMENT_TESTS.LEGACY.atomic_private_json_bundle([
                    (paths[0], {"source": True}),
                    (paths[1], {"manifest": True}),
                    (paths[2], {"report": True}),
                ])
            self.assertTrue(all(not path.exists() for path in paths))

    def test_finalize_does_not_delete_when_protected_export_fails(self):
        events = []

        class FakeConnection:
            def __init__(self, _):
                pass

            def __enter__(self):
                return self

            def __exit__(self, *_):
                pass

        class FakeTarget:
            def __init__(self, _):
                pass

            def preview_legacy_identity_finalization(self, _):
                events.append("preview")
                return {"reconciliationFingerprint": "a" * 64}

            def finalize_legacy_identity(self, _):
                events.append("finalize")
                return {"reconciliationFingerprint": "a" * 64}

        arguments = SimpleNamespace(
            command="finalize-lineage",
            confirm_reviewed_sign_off=True,
            expected_plan_fingerprint="b" * 64,
            target_database_url_environment=None,
            report_output="/already-exists.json",
        )
        fake_parser = mock.Mock()
        fake_parser.parse_args.return_value = arguments
        with (
            mock.patch.object(REPLACEMENT_TESTS.LEGACY, "parser", return_value=fake_parser),
            mock.patch.object(
                REPLACEMENT_TESTS.LEGACY, "PostgreSqlConnection", FakeConnection
            ),
            mock.patch.object(
                REPLACEMENT_TESTS.LEGACY.replacement,
                "PostgreSqlReplacementTarget",
                FakeTarget,
            ),
            mock.patch.object(
                REPLACEMENT_TESTS.LEGACY,
                "atomic_private_json",
                side_effect=FileExistsError("protected output exists"),
            ),
        ):
            with self.assertRaises(FileExistsError):
                REPLACEMENT_TESTS.LEGACY.main()
        self.assertEqual(events, ["preview"])

    def test_finalize_replaces_preview_with_final_proof(self):
        events = []

        class FakeConnection:
            def __init__(self, _):
                pass

            def __enter__(self):
                return self

            def __exit__(self, *_):
                pass

        class FakeTarget:
            def __init__(self, _):
                pass

            def preview_legacy_identity_finalization(self, _):
                events.append("preview")
                return {"reconciliationFingerprint": "a" * 64, "cleanupPending": True}

            def finalize_legacy_identity(self, _):
                events.append("finalize")
                return {
                    "reconciliationFingerprint": "a" * 64,
                    "deletedReceiptCount": 2,
                    "legacyIdentityRemainingCount": 0,
                }

        arguments = SimpleNamespace(
            command="finalize-lineage",
            confirm_reviewed_sign_off=True,
            expected_plan_fingerprint="b" * 64,
            target_database_url_environment=None,
            report_output="/protected.json",
        )
        fake_parser = mock.Mock()
        fake_parser.parse_args.return_value = arguments
        with (
            mock.patch.object(REPLACEMENT_TESTS.LEGACY, "parser", return_value=fake_parser),
            mock.patch.object(
                REPLACEMENT_TESTS.LEGACY, "PostgreSqlConnection", FakeConnection
            ),
            mock.patch.object(
                REPLACEMENT_TESTS.LEGACY.replacement,
                "PostgreSqlReplacementTarget",
                FakeTarget,
            ),
            mock.patch.object(
                REPLACEMENT_TESTS.LEGACY,
                "atomic_private_json",
                side_effect=lambda *_: events.append("write-preview"),
            ),
            mock.patch.object(
                REPLACEMENT_TESTS.LEGACY,
                "atomic_replace_private_json",
                side_effect=lambda *_: events.append("write-final"),
            ),
        ):
            self.assertEqual(REPLACEMENT_TESTS.LEGACY.main(), 0)
        self.assertEqual(
            events,
            ["preview", "write-preview", "finalize", "write-final"],
        )

    def test_postgresql_apply_replay_drift_and_finalize_gate(self):
        database_url = os.environ.get("SEGMENT_STUDIO_MIGRATION_TEST_DATABASE_URL")
        if not database_url:
            self.skipTest("SEGMENT_STUDIO_MIGRATION_TEST_DATABASE_URL is not set")
        schema = "segment_studio_lineage_" + uuid.uuid4().hex
        with REPLACEMENT_TESTS.LEGACY.PostgreSqlConnection(database_url) as connection:
            try:
                connection.execute(f'CREATE SCHEMA "{schema}"; SET search_path TO "{schema}";')
                connection.execute(REPLACEMENT_TESTS.POSTGRESQL_SCHEMA)
                connection.execute(
                    "INSERT INTO videos VALUES (101); "
                    "INSERT INTO tags VALUES (202),(300),(301),(302),(303);"
                )
                source, _, manifest = fixture([
                    marker(1, 20, [30]),
                    marker(2, 21, [30, 33], derivations=[derivation(1)]),
                ])
                target = MIGRATION.PostgreSqlReplacementTarget(connection)
                before = target.extract_target()
                manifest["reviewedTargetFingerprint"] = MIGRATION.target_fingerprint(before)
                plan = MIGRATION.build_plan(source, before, manifest)
                applied = MIGRATION.apply_reviewed_plan(
                    target, source, manifest, plan.result["planFingerprint"]
                )
                self.assertEqual(
                    [
                        applied["postCheck"]["lineageNodeCount"],
                        applied["postCheck"]["provenanceAssertionCount"],
                        applied["postCheck"]["derivationEdgeCount"],
                        applied["postCheck"]["invalidLineageEdgeCount"],
                    ],
                    [2, 2, 1, 0],
                )
                connection.execute(
                    "UPDATE segment_studio_provenance_activities "
                    "SET metadata=metadata || '{\"tampered\":true}'::jsonb;"
                )
                with self.assertRaisesRegex(MIGRATION.ValidationError, "safe no-op"):
                    MIGRATION.apply_reviewed_plan(
                        target, source, manifest, plan.result["planFingerprint"]
                    )
                connection.execute(
                    "UPDATE segment_studio_provenance_activities "
                    "SET metadata=metadata - 'tampered';"
                )
                rebaseline_sql = REBASELINE_SCRIPT.read_text(encoding="utf-8")
                receipt_block = re.search(
                    r"expected TEXT\[\] := ARRAY\[(.*?)\n    \];",
                    rebaseline_sql,
                    re.DOTALL,
                )
                self.assertIsNotNone(receipt_block)
                receipt_names = re.findall(r"'([^']+)'", receipt_block.group(1))
                self.assertEqual(len(receipt_names), 36)
                for receipt_name in receipt_names:
                    connection.execute(
                        "INSERT INTO extension_migrations VALUES ('segment-studio', $1);",
                        [receipt_name],
                    )
                connection.execute(
                    rebaseline_sql.replace("\\set ON_ERROR_STOP on\n", "", 1)
                )
                self.assertEqual(
                    connection.execute(
                        "SELECT migration_name FROM extension_migrations "
                        "WHERE extension_id='segment-studio';",
                        tuples=True,
                    ),
                    [["001_initial_schema"]],
                )
                preview = target.preview_legacy_identity_finalization(
                    plan.result["planFingerprint"]
                )
                self.assertEqual(
                    connection.execute(
                        "SELECT count(*) FROM segment_studio_marker_replacement_receipts;",
                        tuples=True,
                    ),
                    [["2"]],
                )
                cleanup = target.finalize_legacy_identity(plan.result["planFingerprint"])
                self.assertEqual(
                    preview["reconciliationFingerprint"],
                    cleanup["reconciliationFingerprint"],
                )
                self.assertEqual(cleanup["legacyIdentityRemainingCount"], 0)
            finally:
                connection.execute("SET search_path TO public;")
                connection.execute(f'DROP SCHEMA IF EXISTS "{schema}" CASCADE;')


if __name__ == "__main__":
    unittest.main()
