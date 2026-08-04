#!/usr/bin/env python3
"""Migrate a private Stash Marker Studio snapshot into Segment Studio.

This external operator extracts immutable source/target documents, validates a
reviewed entity mapping, emits a deterministic replacement plan, and can apply
only that exact plan in one serializable PostgreSQL transaction. It is not
extension runtime code and exposes no Cove endpoint.
"""

from __future__ import annotations

import argparse
import copy
import ctypes
import ctypes.util
import hashlib
import json
import os
import re
import sqlite3
import stat
import subprocess
import sys
import urllib.parse
import uuid
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent))
import segment_studio_marker_replacement as replacement


SOURCE_KIND = "stash-marker-studio"
SOURCE_SCHEMA_VERSION = 3
TARGET_SCHEMA_VERSION = 1
MANIFEST_SCHEMA_VERSION = 1
PLANNER_VERSION = "segment-studio-marker-planner-v2"
SOURCE_KEY = "ext:segment-studio:stash-marker-studio"
IMPORT_ADVISORY_LOCK_ID = 0x5345474D41524B
HEX_SHA256 = re.compile(r"[0-9a-f]{64}")
REVIEW_STATE = {
    "confirmed": "approved",
    "rejected": "rejected",
    "unprocessed": "unreviewed",
}
MARKER_SOURCE_PREFIX = "Marker Source:"
MANUAL_SOURCE_LABEL = "Marker Source: Manual"
SKIER_AI_SOURCE_LABEL = "Marker Source: Skier AI"
ORIGIN_SOURCE_LABELS = frozenset(replacement.LINEAGE_SOURCE_KEYS)


RECEIPT_SCHEMA_SQL = r"""
CREATE TABLE IF NOT EXISTS segment_studio_marker_migration_runs (
    plan_fingerprint CHAR(64) PRIMARY KEY,
    source_instance_id TEXT NOT NULL,
    source_fingerprint CHAR(64) NOT NULL,
    manifest_fingerprint CHAR(64) NOT NULL,
    result JSONB NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CK_segment_studio_marker_migration_runs_hashes"
        CHECK (plan_fingerprint ~ '^[0-9a-f]{64}$'
           AND source_fingerprint ~ '^[0-9a-f]{64}$'
           AND manifest_fingerprint ~ '^[0-9a-f]{64}$')
);

CREATE TABLE IF NOT EXISTS segment_studio_marker_migration_receipts (
    source_instance_id TEXT NOT NULL,
    source_marker_id BIGINT NOT NULL,
    segment_id INTEGER NOT NULL,
    source_marker_fingerprint CHAR(64) NOT NULL,
    target_segment_fingerprint CHAR(64) NOT NULL,
    provenance_fingerprint CHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (source_instance_id, source_marker_id),
    CONSTRAINT "FK_segment_studio_marker_migration_receipts_segments"
        FOREIGN KEY (segment_id) REFERENCES segments ("Id") ON DELETE CASCADE,
    CONSTRAINT "CK_segment_studio_marker_migration_receipts_hashes"
        CHECK (source_marker_fingerprint ~ '^[0-9a-f]{64}$'
           AND target_segment_fingerprint ~ '^[0-9a-f]{64}$'
           AND provenance_fingerprint ~ '^[0-9a-f]{64}$')
);

CREATE INDEX IF NOT EXISTS "IX_segment_studio_marker_migration_receipts_segment"
    ON segment_studio_marker_migration_receipts (segment_id);

CREATE TABLE IF NOT EXISTS segment_studio_marker_migration_baselines (
    source_instance_id TEXT NOT NULL,
    segment_id INTEGER NOT NULL,
    target_segment_fingerprint CHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (source_instance_id, segment_id),
    CONSTRAINT "FK_segment_studio_marker_migration_baselines_segments"
        FOREIGN KEY (segment_id) REFERENCES segments ("Id") ON DELETE CASCADE,
    CONSTRAINT "CK_segment_studio_marker_migration_baselines_hash"
        CHECK (target_segment_fingerprint ~ '^[0-9a-f]{64}$')
);

CREATE TABLE IF NOT EXISTS segment_studio_marker_migration_provenance (
    source_instance_id TEXT NOT NULL,
    source_marker_id BIGINT NOT NULL,
    external_marker_id BIGINT NULL,
    source_status VARCHAR(32) NOT NULL,
    match_kind VARCHAR(32) NOT NULL,
    source_fingerprint CHAR(64) NOT NULL,
    metadata JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (source_instance_id, source_marker_id),
    CONSTRAINT "FK_segment_studio_marker_migration_provenance_receipt"
        FOREIGN KEY (source_instance_id, source_marker_id)
        REFERENCES segment_studio_marker_migration_receipts
            (source_instance_id, source_marker_id) ON DELETE CASCADE,
    CONSTRAINT "CK_segment_studio_marker_migration_provenance_status"
        CHECK (source_status IN ('confirmed', 'rejected', 'unprocessed')),
    CONSTRAINT "CK_segment_studio_marker_migration_provenance_match_kind"
        CHECK (match_kind IN ('ref', 'adoption', 'create')),
    CONSTRAINT "CK_segment_studio_marker_migration_provenance_source_hash"
        CHECK (source_fingerprint ~ '^[0-9a-f]{64}$')
);
"""


SOURCE_EXTRACTION_SQL = r"""
WITH marker_config AS (
    SELECT value
    FROM app_settings
    WHERE key = 'markerConfig'
), workflow_tags AS (
    SELECT workflow.key, workflow.tag_value::integer AS tag_id
    FROM marker_config,
         LATERAL jsonb_each_text(marker_config.value) AS workflow(key, tag_value)
    WHERE workflow.tag_value ~ '^[0-9]+$'
), marker_tag_state AS (
    SELECT
        marker.id AS marker_id,
        bool_or(workflow.key = 'statusConfirmed') AS confirmed,
        bool_or(workflow.key = 'statusRejected') AS rejected,
        COALESCE(jsonb_agg(workflow.key ORDER BY workflow.key)
            FILTER (WHERE workflow.key IS NOT NULL), '[]'::jsonb) AS workflow_tags,
        COALESCE(jsonb_agg(additional.tag_id ORDER BY additional.tag_id)
            FILTER (WHERE additional.tag_id IS NOT NULL AND workflow.key IS NULL), '[]'::jsonb) AS secondary_tags
    FROM markers AS marker
    LEFT JOIN marker_additional_tags AS additional ON additional.marker_id = marker.id
    LEFT JOIN workflow_tags AS workflow ON workflow.tag_id = additional.tag_id
    GROUP BY marker.id
), slots AS (
    SELECT assignment.marker_id,
        jsonb_agg(jsonb_build_object(
            'slotDefinitionId', assignment.slot_definition_id,
            'performerLocalId', assignment.stashapp_performer_id
        ) ORDER BY assignment.slot_definition_id) AS values
    FROM marker_slots AS assignment
    GROUP BY assignment.marker_id
), derivations AS (
    SELECT derivation.derived_marker_id AS marker_id,
        jsonb_agg(jsonb_build_object(
            'sourceMarkerId', derivation.source_marker_id,
            'ruleId', derivation.rule_id,
            'depth', derivation.depth,
            'createdAt', derivation.created_at
        ) ORDER BY derivation.source_marker_id, derivation.rule_id, derivation.depth) AS values
    FROM marker_derivations AS derivation
    GROUP BY derivation.derived_marker_id
), analyses AS (
    SELECT analysis.marker_id,
        jsonb_agg(jsonb_build_object(
            'sceneAnalysisResultId', analysis.scene_analysis_result_id,
            'source', analysis.source,
            'sourceKey', analysis.source_key,
            'category', analysis.category,
            'label', analysis.label,
            'confidence', analysis.confidence
        ) ORDER BY analysis.id) AS values
    FROM marker_analysis_metadata AS analysis
    GROUP BY analysis.marker_id
), extracted_markers AS (
    SELECT
        marker.id AS local_id,
        marker.stashapp_marker_id AS external_marker_id,
        marker.stashapp_scene_id AS scene_local_id,
        marker.primary_tag_id AS primary_tag_local_id,
        round(marker.seconds * 1000)::bigint AS start_ms,
        CASE WHEN marker.end_seconds IS NULL THEN NULL
             ELSE round(marker.end_seconds * 1000)::bigint END AS end_ms,
        CASE WHEN state.confirmed THEN 'confirmed'
             WHEN state.rejected THEN 'rejected'
             ELSE 'unprocessed' END AS status,
        state.confirmed AND state.rejected AS status_conflict,
        state.secondary_tags,
        COALESCE(slots.values, '[]'::jsonb) AS slot_assignments,
        jsonb_build_object(
            'workflowTags', state.workflow_tags,
            'derivations', COALESCE(derivations.values, '[]'::jsonb),
            'analysis', COALESCE(analyses.values, '[]'::jsonb)
        ) AS provenance
    FROM markers AS marker
    JOIN marker_tag_state AS state ON state.marker_id = marker.id
    LEFT JOIN slots ON slots.marker_id = marker.id
    LEFT JOIN derivations ON derivations.marker_id = marker.id
    LEFT JOIN analyses ON analyses.marker_id = marker.id
), selected_scene_ids AS (
    SELECT DISTINCT scene_local_id AS id FROM extracted_markers
    UNION
    SELECT DISTINCT stashapp_scene_id AS id FROM shot_boundaries
), extracted_shot_boundaries AS (
    SELECT DISTINCT ON (boundary.stashapp_scene_id, boundary.start_time)
        boundary.*
    FROM shot_boundaries AS boundary
    ORDER BY
        boundary.stashapp_scene_id,
        boundary.start_time,
        boundary.created_at,
        boundary.id
), shot_boundary_conflicts AS (
    SELECT count(*) AS value
    FROM (
        SELECT boundary.stashapp_scene_id, boundary.start_time
        FROM shot_boundaries AS boundary
        GROUP BY boundary.stashapp_scene_id, boundary.start_time
        HAVING count(DISTINCT (
            boundary.end_time,
            boundary.source,
            boundary.metadata
        )) > 1
    ) AS conflicts
), selected_tag_ids AS (
    SELECT primary_tag_local_id AS id FROM extracted_markers
    UNION
    SELECT DISTINCT jsonb_array_elements_text(secondary_tags)::integer FROM extracted_markers
    UNION
    SELECT stashapp_tag_id FROM slot_definition_sets
    UNION
    SELECT source_tag_id FROM derived_marker_rules
    UNION
    SELECT derived_tag_id FROM derived_marker_rules
), selected_performer_ids AS (
    SELECT DISTINCT assignment.stashapp_performer_id AS id
    FROM marker_slots AS assignment
    WHERE assignment.stashapp_performer_id IS NOT NULL
)
SELECT jsonb_build_object(
    'statusConfigurationValid', COALESCE((SELECT
        count(*) = 1 AND bool_and(
            value ? 'statusConfirmed'
            AND value ? 'statusRejected'
            AND (value ->> 'statusConfirmed') ~ '^[0-9]+$'
            AND (value ->> 'statusRejected') ~ '^[0-9]+$'
            AND value ->> 'statusConfirmed' <> value ->> 'statusRejected')
        FROM marker_config), FALSE),
    'statusConflictCount', (SELECT count(*) FROM extracted_markers WHERE status_conflict),
    'shotBoundaryConflictCount', (SELECT value FROM shot_boundary_conflicts),
    'scenes', COALESCE((SELECT jsonb_agg(jsonb_build_object(
        'localId', selected.id
    ) ORDER BY selected.id) FROM selected_scene_ids AS selected), '[]'::jsonb),
    'shotBoundaries', COALESCE((SELECT jsonb_agg(jsonb_build_object(
        'localId', boundary.id::text,
        'sceneLocalId', boundary.stashapp_scene_id,
        'startMs', round(boundary.start_time * 1000)::bigint,
        'endMs', round(boundary.end_time * 1000)::bigint,
        'source', lower(boundary.source::text),
        'metadata', boundary.metadata,
        'createdAt', boundary.created_at AT TIME ZONE 'UTC',
        'updatedAt', boundary.updated_at AT TIME ZONE 'UTC'
    ) ORDER BY boundary.stashapp_scene_id, boundary.start_time, boundary.id)
        FROM extracted_shot_boundaries AS boundary
        JOIN selected_scene_ids AS selected
          ON selected.id = boundary.stashapp_scene_id), '[]'::jsonb),
    'tags', COALESCE((SELECT jsonb_agg(jsonb_build_object(
        'localId', selected.id, 'name', tag.name
    ) ORDER BY selected.id) FROM selected_tag_ids AS selected
       LEFT JOIN stash_tags AS tag ON tag.id = selected.id), '[]'::jsonb),
    'performers', COALESCE((SELECT jsonb_agg(jsonb_build_object(
        'localId', selected.id, 'name', performer.name
    ) ORDER BY selected.id) FROM selected_performer_ids AS selected
       LEFT JOIN stash_performers AS performer ON performer.id = selected.id), '[]'::jsonb),
    'slotDefinitionSets', COALESCE((SELECT jsonb_agg(jsonb_build_object(
        'id', id, 'sourceTagLocalId', stashapp_tag_id,
        'allowSamePerformerInMultipleSlots', allow_same_performer_in_multiple_slots
    ) ORDER BY id) FROM slot_definition_sets), '[]'::jsonb),
    'slotDefinitions', COALESCE((SELECT jsonb_agg(jsonb_build_object(
        'id', definition.id, 'slotDefinitionSetId', definition.slot_definition_set_id,
        'label', definition.slot_label, 'sortOrder', definition."order",
        'genderHints', COALESCE((SELECT jsonb_agg(hint.gender_hint::text ORDER BY hint.gender_hint::text)
            FROM slot_definition_gender_hints AS hint
            WHERE hint.slot_definition_id = definition.id), '[]'::jsonb)
    ) ORDER BY definition.id) FROM slot_definitions AS definition), '[]'::jsonb),
    'derivedMarkerRules', COALESCE((SELECT jsonb_agg(jsonb_build_object(
        'id', rule.id,
        'sourceTagLocalId', rule.source_tag_id,
        'derivedTagLocalId', rule.derived_tag_id,
        'relationshipType', rule.relationship_type,
        'sortOrder', rule.sort_order,
        'createdAt', rule.created_at,
        'updatedAt', rule.updated_at,
        'slotMappings', COALESCE((SELECT jsonb_agg(jsonb_build_object(
            'id', mapping.id,
            'sourceSlotDefinitionId', mapping.source_slot_definition_id,
            'derivedSlotDefinitionId', mapping.derived_slot_definition_id,
            'sortOrder', mapping.sort_order
        ) ORDER BY mapping.sort_order, mapping.id)
        FROM derived_marker_slot_mappings AS mapping
        WHERE mapping.derived_marker_rule_id = rule.id), '[]'::jsonb)
    ) ORDER BY rule.sort_order, rule.id)
    FROM derived_marker_rules AS rule), '[]'::jsonb),
    'markers', COALESCE((SELECT jsonb_agg(jsonb_build_object(
        'localId', local_id,
        'externalMarkerId', external_marker_id,
        'sceneLocalId', scene_local_id,
        'primaryTagLocalId', primary_tag_local_id,
        'startMs', start_ms,
        'endMs', end_ms,
        'status', status,
        'secondaryTagLocalIds', secondary_tags,
        'slotAssignments', slot_assignments,
        'provenance', provenance
    ) ORDER BY local_id) FROM extracted_markers), '[]'::jsonb)
)::text;
"""


def target_extraction_sql(include_receipts: bool) -> str:
    receipts = r"""
        SELECT jsonb_agg(jsonb_build_object(
            'sourceInstanceId', receipt.source_instance_id,
            'sourceMarkerId', receipt.source_marker_id,
            'segmentId', receipt.segment_id,
            'externalMarkerId', provenance.external_marker_id,
            'sourceMarkerFingerprint', receipt.source_marker_fingerprint,
            'targetSegmentFingerprint', receipt.target_segment_fingerprint,
            'provenanceFingerprint', receipt.provenance_fingerprint,
            'sourceFingerprint', provenance.source_fingerprint,
            'sourceStatus', provenance.source_status,
            'matchKind', provenance.match_kind,
            'provenance', provenance.metadata
        ) ORDER BY receipt.source_instance_id, receipt.source_marker_id)
        FROM segment_studio_marker_migration_receipts AS receipt
        JOIN segment_studio_marker_migration_provenance AS provenance
          USING (source_instance_id, source_marker_id)
    """ if include_receipts else "SELECT '[]'::jsonb"
    baselines = r"""
        SELECT jsonb_agg(jsonb_build_object(
            'sourceInstanceId', source_instance_id,
            'segmentId', segment_id,
            'targetSegmentFingerprint', target_segment_fingerprint
        ) ORDER BY source_instance_id, segment_id)
        FROM segment_studio_marker_migration_baselines
    """ if include_receipts else "SELECT '[]'::jsonb"
    runs = r"""
        SELECT jsonb_agg(jsonb_build_object(
            'planFingerprint', plan_fingerprint,
            'sourceInstanceId', source_instance_id,
            'sourceFingerprint', source_fingerprint,
            'manifestFingerprint', manifest_fingerprint,
            'result', result
        ) ORDER BY applied_at, plan_fingerprint)
        FROM segment_studio_marker_migration_runs
    """ if include_receipts else "SELECT '[]'::jsonb"
    receipt_integrity = r"""
        SELECT jsonb_build_object(
            'orphanReceiptCount', count(*) FILTER (WHERE provenance.source_instance_id IS NULL),
            'orphanProvenanceCount', count(*) FILTER (WHERE receipt.source_instance_id IS NULL)
        )
        FROM segment_studio_marker_migration_receipts AS receipt
        FULL OUTER JOIN segment_studio_marker_migration_provenance AS provenance
          USING (source_instance_id, source_marker_id)
    """ if include_receipts else "SELECT jsonb_build_object('orphanReceiptCount', 0, 'orphanProvenanceCount', 0)"
    return rf"""
SELECT jsonb_build_object(
    'schemaVersion', {TARGET_SCHEMA_VERSION},
    'videoIds', COALESCE((SELECT jsonb_agg("Id" ORDER BY "Id") FROM videos), '[]'::jsonb),
    'tagIds', COALESCE((SELECT jsonb_agg("Id" ORDER BY "Id") FROM tags), '[]'::jsonb),
    'performerIds', COALESCE((SELECT jsonb_agg("Id" ORDER BY "Id") FROM performers), '[]'::jsonb),
    'slotDefinitionIds', COALESCE((SELECT jsonb_agg(id ORDER BY id)
        FROM segment_studio_slot_definitions), '[]'::jsonb),
    'slotDefinitionSets', COALESCE((SELECT jsonb_agg(jsonb_build_object(
        'id', id, 'tagId', tag_id,
        'allowSamePerformerInMultipleSlots', allow_same_performer_in_multiple_slots
    ) ORDER BY id) FROM segment_studio_slot_definition_sets), '[]'::jsonb),
    'slotDefinitions', COALESCE((SELECT jsonb_agg(jsonb_build_object(
        'id', id, 'slotDefinitionSetId', slot_definition_set_id,
        'label', label, 'sortOrder', sort_order
    ) ORDER BY id) FROM segment_studio_slot_definitions), '[]'::jsonb),
    'slotGenderHints', COALESCE((SELECT jsonb_agg(jsonb_build_object(
        'slotDefinitionId', slot_definition_id, 'genderHint', gender_hint
    ) ORDER BY slot_definition_id, gender_hint)
        FROM segment_studio_slot_definition_gender_hints), '[]'::jsonb),
    'segments', COALESCE((SELECT jsonb_agg(jsonb_build_object(
        'id', "Id", 'videoId', "HostId", 'tagId', "TagId", 'refId', "RefId",
        'startMs', round("StartSec" * 1000)::bigint,
        'endMs', CASE WHEN "EndSec" IS NULL THEN NULL ELSE round("EndSec" * 1000)::bigint END,
        'reviewState', CASE
            WHEN "Payload" -> 'segmentStudio' ->> 'reviewState' IN ('approved', 'rejected')
                THEN "Payload" -> 'segmentStudio' ->> 'reviewState'
            ELSE 'unreviewed' END,
        'secondaryTagIds', CASE
            WHEN jsonb_typeof("Payload" -> 'secondaryTagIds') = 'array'
                THEN "Payload" -> 'secondaryTagIds'
            ELSE '[]'::jsonb END
    ) ORDER BY "Id") FROM segments
        WHERE "HostType" = 1 AND "Kind" = 'tag' AND "TagId" IS NOT NULL), '[]'::jsonb),
    'receipts', COALESCE(({receipts}), '[]'::jsonb),
    'baselineReceipts', COALESCE(({baselines}), '[]'::jsonb),
    'migrationRuns', COALESCE(({runs}), '[]'::jsonb),
    'receiptIntegrity', ({receipt_integrity}),
    'segmentSlots', COALESCE((SELECT jsonb_agg(jsonb_build_object(
        'segmentId', segment_id, 'slotDefinitionId', slot_definition_id,
        'performerId', performer_id
    ) ORDER BY segment_id, slot_definition_id)
        FROM segment_studio_segment_slots), '[]'::jsonb)
)::text;
"""


class ValidationError(RuntimeError):
    pass


class Plan:
    def __init__(self) -> None:
        self.result: dict[str, Any] = {}
        self.baseline_approvals: list[dict[str, Any]] = []
        self.baseline_receipt_inserts: list[dict[str, Any]] = []
        self.creations: list[dict[str, Any]] = []
        self.adoptions: list[dict[str, Any]] = []
        self.receipt_inserts: list[dict[str, Any]] = []
        self.slot_definition_set_inserts: list[dict[str, Any]] = []
        self.slot_definition_inserts: list[dict[str, Any]] = []
        self.slot_gender_hint_inserts: list[dict[str, Any]] = []
        self.slot_assignments: list[dict[str, Any]] = []
        self.secondary_tag_updates: list[dict[str, Any]] = []


class Issues:
    def __init__(self) -> None:
        self.counts: Counter[tuple[str, bool]] = Counter()

    def add(self, code: str, *, fatal: bool = True, count: int = 1) -> None:
        self.counts[(code, fatal)] += count

    def values(self) -> list[dict[str, Any]]:
        return [
            {"code": code, "count": count, "fatal": fatal}
            for (code, fatal), count in sorted(self.counts.items())
        ]

    def has_fatal(self) -> bool:
        return any(fatal and count for (_, fatal), count in self.counts.items())


def canonical_bytes(value: Any) -> bytes:
    return json.dumps(
        value,
        ensure_ascii=False,
        allow_nan=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")


def sha256_json(value: Any) -> str:
    return hashlib.sha256(canonical_bytes(value)).hexdigest()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        while chunk := source.read(1024 * 1024):
            digest.update(chunk)
    return digest.hexdigest()


def validate_private_file(path: Path, label: str) -> None:
    if path.is_symlink() or not path.is_file():
        raise ValidationError(f"{label} must be a regular non-symlink file.")
    if stat.S_IMODE(path.stat().st_mode) != 0o600:
        raise ValidationError(f"{label} permissions must be exactly 0600.")


def validate_source_snapshot_inputs(marker_studio_snapshot: Path, stash_sqlite_path: Path) -> None:
    validate_private_file(marker_studio_snapshot, "Marker Studio snapshot")
    validate_stash_sqlite_snapshot(stash_sqlite_path)


def validate_stash_sqlite_snapshot(stash_sqlite_path: Path) -> None:
    validate_private_file(stash_sqlite_path, "Stash SQLite snapshot")
    sidecars = [
        Path(str(stash_sqlite_path) + suffix)
        for suffix in ("-wal", "-shm")
        if Path(str(stash_sqlite_path) + suffix).exists()
    ]
    if sidecars:
        raise ValidationError("Stash SQLite sidecar files must be checkpointed and removed before extraction.")


def marker_source_snapshot(
    connection: sqlite3.Connection,
    selected_external_marker_ids: set[int],
) -> tuple[dict[int, dict[str, Any]], dict[int, set[int]]]:
    tags: dict[int, dict[str, Any]] = {}
    for tag_id, name in connection.execute(
        "SELECT id, name FROM tags WHERE name LIKE ? ORDER BY id",
        (MARKER_SOURCE_PREFIX + "%",),
    ):
        identity = int(tag_id)
        tags[identity] = {
            "localId": identity,
            "name": str(name),
            "evidence": {"remoteIds": []},
        }

    if tags:
        remotes = sqlite_remote_evidence(
            connection, "tag_stash_ids", "tag_id", set(tags)
        )
        for identity, row in tags.items():
            row["evidence"]["remoteIds"] = remotes.get(identity, [])

    attachments: dict[int, set[int]] = defaultdict(set)
    for external_marker_id, tag_id in connection.execute(
        """
        SELECT marker_tag.scene_marker_id, marker_tag.tag_id
        FROM scene_markers_tags AS marker_tag
        JOIN tags AS tag ON tag.id=marker_tag.tag_id
        WHERE tag.name LIKE ?
        ORDER BY marker_tag.scene_marker_id, marker_tag.tag_id
        """,
        (MARKER_SOURCE_PREFIX + "%",),
    ):
        marker_identity = int(external_marker_id)
        if marker_identity in selected_external_marker_ids:
            attachments[marker_identity].add(int(tag_id))
    return tags, attachments


def _source_tag_by_name(
    snapshot_tags: dict[int, dict[str, Any]], name: str
) -> dict[str, Any]:
    matches = [row for row in snapshot_tags.values() if row["name"] == name]
    if len(matches) != 1:
        raise ValidationError(
            f"Stash must contain exactly one {name} tag for the reviewed policy."
        )
    return matches[0]


def _edge_exclusion(
    source_marker_id: int,
    derived_marker_id: int,
    rule_id: str,
    depth: Any,
    occurrence: int,
) -> dict[str, Any]:
    result = {
        "kind": "edge",
        "sourceMarkerId": source_marker_id,
        "derivedMarkerId": derived_marker_id,
        "ruleId": rule_id,
        "depth": depth,
        "occurrence": occurrence,
        "reason": (
            "Historical derivation no longer matches its configured "
            "source/derived tag pair"
        ),
    }
    result["edgeFingerprint"] = replacement.sha256_json({
        key: result[key]
        for key in (
            "sourceMarkerId",
            "derivedMarkerId",
            "ruleId",
            "depth",
            "occurrence",
        )
    })
    return result


def _lineage_exclusion_key(exclusion: dict[str, Any]) -> tuple[Any, ...]:
    if exclusion.get("kind") == "marker":
        return ("marker", exclusion.get("sourceMarkerId"))
    if exclusion.get("kind") == "edge":
        return (
            "edge",
            exclusion.get("sourceMarkerId"),
            exclusion.get("derivedMarkerId"),
            exclusion.get("ruleId"),
            exclusion.get("occurrence"),
        )
    raise ValidationError("A lineage exclusion kind is invalid.")


def _manifest_entity_mappings(
    manifest: dict[str, Any],
) -> dict[tuple[str, int], dict[str, Any]]:
    result: dict[tuple[str, int], dict[str, Any]] = {}
    rows = manifest.get("entityMappings", [])
    if not isinstance(rows, list) or any(not isinstance(row, dict) for row in rows):
        raise ValidationError("Manifest entity mappings must be an object list.")
    for row in rows:
        kind = row.get("entityKind")
        local_id = row.get("sourceLocalId")
        canonical_id = row.get("canonicalId")
        if (
            kind not in {"scene", "tag", "performer"}
            or not isinstance(local_id, int)
            or isinstance(local_id, bool)
            or local_id <= 0
            or not isinstance(canonical_id, int)
            or isinstance(canonical_id, bool)
            or canonical_id <= 0
        ):
            raise ValidationError("A manifest entity mapping is invalid.")
        key = (kind, local_id)
        if key in result:
            raise ValidationError(
                "The manifest contains duplicate source entity mappings."
            )
        result[key] = copy.deepcopy(row)
    return result


def _rule_tag_mismatch(
    source_marker: dict[str, Any],
    derived_marker: dict[str, Any],
    rule: dict[str, Any],
    mappings: dict[tuple[str, int], dict[str, Any]],
) -> bool:
    def canonical_tag(local_id: Any) -> int:
        mapping = mappings.get(("tag", int(local_id)))
        if mapping is None:
            raise ValidationError(
                "The manifest is missing a tag mapping required for "
                "derivation-rule review."
            )
        return int(mapping["canonicalId"])

    source_tag = canonical_tag(source_marker["primaryTagLocalId"])
    derived_tag = canonical_tag(derived_marker["primaryTagLocalId"])
    if source_tag == derived_tag:
        return False
    return (
        source_tag != canonical_tag(rule["sourceTagLocalId"])
        or derived_tag != canonical_tag(rule["derivedTagLocalId"])
    )


def _merge_lineage_exclusions(
    existing: list[dict[str, Any]],
    generated: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    result: dict[tuple[Any, ...], dict[str, Any]] = {}
    for exclusion in existing:
        key = _lineage_exclusion_key(exclusion)
        if key in result:
            raise ValidationError(
                "The manifest contains duplicate lineage exclusions."
            )
        result[key] = exclusion
    generated_keys: set[tuple[Any, ...]] = set()
    for exclusion in generated:
        key = _lineage_exclusion_key(exclusion)
        if key in generated_keys:
            raise ValidationError(
                "Lineage preparation generated duplicate exclusions."
            )
        generated_keys.add(key)
        prior = result.get(key)
        if prior is not None and prior != exclusion:
            raise ValidationError(
                "A generated lineage exclusion conflicts with an existing exclusion."
            )
        result[key] = exclusion
    return sorted(result.values(), key=replacement.canonical_bytes)


def prepare_lineage_source(
    source: dict[str, Any],
    manifest: dict[str, Any],
    stash_sqlite_path: Path,
    *,
    inferred_analysis_sources: set[str],
    infer_confirmed_without_analysis: bool,
    source_tag_mappings: dict[str, int],
    exclude_unclassified_markers: bool,
    exclude_rule_tag_mismatches: bool,
) -> tuple[dict[str, Any], dict[str, Any], dict[str, Any]]:
    """Recover source tags and emit fingerprint-bound lineage review candidates."""
    replacement.validate_source(source)
    expected_source_fingerprint = replacement.source_fingerprint(source)
    if manifest.get("sourceFingerprint") != expected_source_fingerprint:
        raise ValidationError(
            "The reviewed manifest does not match the input source snapshot."
        )
    if manifest.get("schemaVersion") != replacement.MANIFEST_SCHEMA_VERSION:
        raise ValidationError("Unsupported reviewed manifest schema version.")
    if any(
        not isinstance(value, str) or not value.strip()
        for value in inferred_analysis_sources
    ):
        raise ValidationError("Inferred analysis source names must be non-empty.")
    if any(
        not isinstance(name, str)
        or not name.startswith(MARKER_SOURCE_PREFIX)
        or not isinstance(canonical_id, int)
        or isinstance(canonical_id, bool)
        or canonical_id <= 0
        for name, canonical_id in source_tag_mappings.items()
    ):
        raise ValidationError(
            "Source-tag mappings require Marker Source labels and positive canonical IDs."
        )

    validate_stash_sqlite_snapshot(stash_sqlite_path)
    expected_stash_hash = source.get("snapshots", {}).get("stashSqliteSha256")
    actual_stash_hash = sha256_file(stash_sqlite_path)
    if expected_stash_hash != actual_stash_hash:
        raise ValidationError(
            "The Stash SQLite snapshot does not match the source document."
        )

    prepared_source = copy.deepcopy(source)
    prepared_manifest = copy.deepcopy(manifest)
    markers = prepared_source["markers"]
    external_ids = [
        int(row["externalMarkerId"])
        for row in markers
        if row.get("externalMarkerId") is not None
    ]
    if len(external_ids) != len(set(external_ids)):
        raise ValidationError(
            "Source markers contain duplicate external marker identities."
        )

    sqlite_uri = (
        f"file:{urllib.parse.quote(str(stash_sqlite_path.resolve()))}"
        "?mode=ro&immutable=1"
    )
    connection = sqlite3.connect(sqlite_uri, uri=True)
    try:
        snapshot_tags, exact_attachments = marker_source_snapshot(
            connection, set(external_ids)
        )
    finally:
        connection.close()
    if sha256_file(stash_sqlite_path) != actual_stash_hash:
        raise ValidationError(
            "The Stash SQLite snapshot changed during lineage preparation."
        )

    source_tag_by_id = {
        int(row["localId"]): row
        for row in prepared_source["tags"]
        if str(row.get("name", "")).startswith(MARKER_SOURCE_PREFIX)
    }

    def add_snapshot_tag(identity: int) -> None:
        snapshot_tag = snapshot_tags.get(identity)
        if snapshot_tag is None:
            raise ValidationError(
                "A Stash marker references a missing Marker Source tag."
            )
        existing = next(
            (
                row
                for row in prepared_source["tags"]
                if int(row["localId"]) == identity
            ),
            None,
        )
        if existing is not None and existing.get("name") != snapshot_tag["name"]:
            raise ValidationError(
                "A recovered Marker Source tag conflicts with a source tag identity."
            )
        if existing is None:
            prepared_source["tags"].append(copy.deepcopy(snapshot_tag))
            source_tag_by_id[identity] = prepared_source["tags"][-1]
        elif not isinstance(existing.get("evidence"), dict):
            existing["evidence"] = copy.deepcopy(snapshot_tag["evidence"])
            source_tag_by_id[identity] = existing

    counts: Counter[str] = Counter()
    unresolved_markers: list[dict[str, Any]] = []
    for marker in markers:
        secondary = {
            int(value) for value in marker.get("secondaryTagLocalIds", [])
        }
        external_id = marker.get("externalMarkerId")
        if external_id is not None:
            recovered = exact_attachments.get(int(external_id), set())
            for tag_id in recovered:
                add_snapshot_tag(tag_id)
            if recovered - secondary:
                secondary.update(recovered)
                counts["exact-stash-recovery"] += 1

        labels = {
            str(row.get("name"))
            for tag_id in secondary
            for row in [source_tag_by_id.get(tag_id)]
            if row is not None
        }
        if not (labels & ORIGIN_SOURCE_LABELS):
            analyses = marker.get("provenance", {}).get("analysis", [])
            if (
                not isinstance(analyses, list)
                or any(not isinstance(analysis, dict) for analysis in analyses)
            ):
                raise ValidationError(
                    "Marker analysis provenance must be an object list."
                )
            if (
                analyses
                and inferred_analysis_sources
                and all(
                    analysis.get("source") in inferred_analysis_sources
                    for analysis in analyses
                )
            ):
                skier_tag = _source_tag_by_name(
                    snapshot_tags, SKIER_AI_SOURCE_LABEL
                )
                add_snapshot_tag(int(skier_tag["localId"]))
                secondary.add(int(skier_tag["localId"]))
                counts["nsfw-ai-inference"] += 1
            elif (
                infer_confirmed_without_analysis
                and marker.get("status") == "confirmed"
                and not analyses
            ):
                manual_tag = _source_tag_by_name(
                    snapshot_tags, MANUAL_SOURCE_LABEL
                )
                add_snapshot_tag(int(manual_tag["localId"]))
                secondary.add(int(manual_tag["localId"]))
                counts["confirmed-manual-inference"] += 1

        marker["secondaryTagLocalIds"] = sorted(secondary)
        labels = {
            str(row.get("name"))
            for tag_id in secondary
            for row in [source_tag_by_id.get(tag_id)]
            if row is not None
        }
        if not (labels & ORIGIN_SOURCE_LABELS):
            unresolved_markers.append(marker)

    used_source_tag_ids = {
        int(tag_id)
        for marker in prepared_source["markers"]
        for tag_id in marker.get("secondaryTagLocalIds", [])
        if int(tag_id) in source_tag_by_id
    }
    mappings = _manifest_entity_mappings(prepared_manifest)
    used_mapping_labels: set[str] = set()
    for tag_id in sorted(used_source_tag_ids):
        label = str(source_tag_by_id[tag_id]["name"])
        if label in source_tag_mappings:
            mappings[("tag", tag_id)] = {
                "entityKind": "tag",
                "sourceLocalId": tag_id,
                "canonicalId": source_tag_mappings[label],
            }
            used_mapping_labels.add(label)
        elif ("tag", tag_id) not in mappings:
            raise ValidationError(
                f"An explicit canonical mapping is required for {label}."
            )
    unused_mapping_labels = set(source_tag_mappings) - used_mapping_labels
    if unused_mapping_labels:
        raise ValidationError(
            "Source-tag mappings were supplied for unused labels: "
            + ", ".join(sorted(unused_mapping_labels))
        )

    rule_by_id = {
        str(rule["id"]): rule
        for rule in prepared_source.get("derivedMarkerRules", [])
    }
    marker_by_id = {
        int(marker["localId"]): marker for marker in prepared_source["markers"]
    }
    edge_exclusions: list[dict[str, Any]] = []
    for derived in sorted(
        prepared_source["markers"], key=lambda row: int(row["localId"])
    ):
        occurrences: Counter[tuple[Any, str]] = Counter()
        derivations = sorted(
            derived.get("provenance", {}).get("derivations", []),
            key=replacement.canonical_bytes,
        )
        for edge in derivations:
            source_id = edge.get("sourceMarkerId")
            rule_id = str(edge.get("ruleId", "")).strip()
            occurrence_key = (source_id, rule_id)
            occurrence = occurrences[occurrence_key]
            occurrences[occurrence_key] += 1
            rule = rule_by_id.get(rule_id)
            source_marker = marker_by_id.get(source_id)
            if rule is None or source_marker is None:
                continue
            if not _rule_tag_mismatch(
                source_marker, derived, rule, mappings
            ):
                continue
            edge_exclusions.append(
                _edge_exclusion(
                    int(source_id),
                    int(derived["localId"]),
                    rule_id,
                    edge.get("depth"),
                    occurrence,
                )
            )

    marker_exclusions = [
        {
            "kind": "marker",
            "sourceMarkerId": int(marker["localId"]),
            "sourceMarkerFingerprint": replacement.sha256_json(
                replacement.normalized_marker(marker)
            ),
            "reason": "No source tag or preserved analysis evidence",
        }
        for marker in unresolved_markers
    ]

    existing_lineage = prepared_manifest.get("lineage")
    existing_exclusions = (
        copy.deepcopy(existing_lineage.get("exclusions", []))
        if isinstance(existing_lineage, dict)
        else []
    )
    generated_exclusions = [
        *(edge_exclusions if exclude_rule_tag_mismatches else []),
        *(marker_exclusions if exclude_unclassified_markers else []),
    ]
    merged_exclusions = _merge_lineage_exclusions(
        existing_exclusions, generated_exclusions
    )
    prepared_source = replacement.normalized_source(prepared_source)
    prepared_manifest["sourceFingerprint"] = replacement.source_fingerprint(
        prepared_source
    )
    prepared_manifest["entityMappings"] = sorted(
        mappings.values(),
        key=lambda row: (row["entityKind"], int(row["sourceLocalId"])),
    )
    prepared_manifest["lineage"] = {
        **(existing_lineage if isinstance(existing_lineage, dict) else {}),
        "enabled": True,
        "exclusions": merged_exclusions,
    }
    prepared_manifest = replacement.normalized_manifest(prepared_manifest)
    replacement.validate_source(prepared_source)
    report = {
        "succeeded": True,
        "reviewRequired": True,
        "sourceFingerprint": prepared_manifest["sourceFingerprint"],
        "classificationCounts": dict(sorted(counts.items())),
        "unclassifiedMarkerCount": len(unresolved_markers),
        "ruleTagMismatchCount": len(edge_exclusions),
        "markerExclusionCount": (
            len(marker_exclusions) if exclude_unclassified_markers else 0
        ),
        "edgeExclusionCount": (
            len(edge_exclusions) if exclude_rule_tag_mismatches else 0
        ),
        "policy": {
            "inferredAnalysisSources": sorted(inferred_analysis_sources),
            "inferConfirmedWithoutAnalysis": infer_confirmed_without_analysis,
            "excludeUnclassifiedMarkers": exclude_unclassified_markers,
            "excludeRuleTagMismatches": exclude_rule_tag_mismatches,
        },
    }
    return prepared_source, prepared_manifest, report


def sqlite_remote_evidence(
    connection: sqlite3.Connection,
    table: str,
    owner_column: str,
    selected: set[int],
) -> dict[int, list[dict[str, str]]]:
    result: dict[int, set[tuple[str, str]]] = defaultdict(set)
    for owner, endpoint, remote_id in connection.execute(
        f"SELECT {owner_column}, endpoint, stash_id FROM {table}"
    ):
        owner_id = int(owner)
        if owner_id in selected:
            result[owner_id].add((str(endpoint), str(remote_id)))
    return {
        owner: [
            {"endpoint": endpoint, "remoteId": remote_id}
            for endpoint, remote_id in sorted(values)
        ]
        for owner, values in result.items()
    }


def build_source_document(
    raw: dict[str, Any],
    stash_sqlite_path: Path,
    *,
    source_instance_id: str,
    marker_studio_sha256: str,
    stash_sqlite_sha256: str,
) -> dict[str, Any]:
    """Bind one read-only Marker Studio extraction to one Stash snapshot."""
    require_hash(marker_studio_sha256, "markerStudioSha256")
    require_hash(stash_sqlite_sha256, "stashSqliteSha256")
    if not isinstance(source_instance_id, str) or not source_instance_id.strip():
        raise ValidationError("sourceInstanceId is required.")
    if raw.get("statusConfigurationValid") is not True:
        raise ValidationError("Source review status configuration is missing or invalid.")
    if raw.get("statusConflictCount") != 0:
        raise ValidationError("Source contains markers with conflicting review status tags.")
    if raw.get("shotBoundaryConflictCount", 0) != 0:
        raise ValidationError("Source contains conflicting shot boundaries.")

    selected = {
        plural: {require_int(row.get("localId"), f"{plural}.localId", positive=True) for row in raw.get(plural, [])}
        for plural in ("scenes", "tags", "performers")
    }
    sqlite_uri = f"file:{urllib.parse.quote(str(stash_sqlite_path.resolve()))}?mode=ro&immutable=1"
    connection = sqlite3.connect(sqlite_uri, uri=True)
    try:
        remotes = {
            "scenes": sqlite_remote_evidence(connection, "scene_stash_ids", "scene_id", selected["scenes"]),
            "tags": sqlite_remote_evidence(connection, "tag_stash_ids", "tag_id", selected["tags"]),
            "performers": sqlite_remote_evidence(
                connection, "performer_stash_ids", "performer_id", selected["performers"]
            ),
        }
    finally:
        connection.close()
    if sha256_file(stash_sqlite_path) != stash_sqlite_sha256:
        raise ValidationError("The Stash SQLite snapshot changed during source extraction.")

    result: dict[str, Any] = {
        "schemaVersion": SOURCE_SCHEMA_VERSION,
        "sourceKind": SOURCE_KIND,
        "sourceInstanceId": source_instance_id,
        "snapshots": {
            "markerStudioSha256": marker_studio_sha256,
            "stashSqliteSha256": stash_sqlite_sha256,
        },
    }
    for plural in ("scenes", "tags", "performers"):
        result[plural] = []
        for source_row in raw.get(plural, []):
            row = copy.deepcopy(source_row)
            local_id = int(row["localId"])
            row["evidence"] = {"remoteIds": remotes[plural].get(local_id, [])}
            result[plural].append(row)
    result["markers"] = copy.deepcopy(raw.get("markers", []))
    result["shotBoundaries"] = copy.deepcopy(raw.get("shotBoundaries", []))
    result["slotDefinitionSets"] = copy.deepcopy(raw.get("slotDefinitionSets", []))
    result["slotDefinitions"] = copy.deepcopy(raw.get("slotDefinitions", []))
    result["derivedMarkerRules"] = copy.deepcopy(raw.get("derivedMarkerRules", []))
    validate_source(result)
    return normalized_source(result)


def canonical_sort(values: list[Any]) -> list[Any]:
    return sorted(values, key=canonical_bytes)


def normalized_entity(row: dict[str, Any]) -> dict[str, Any]:
    result = copy.deepcopy(row)
    evidence = result.get("evidence")
    if isinstance(evidence, dict):
        for key, value in evidence.items():
            if isinstance(value, list):
                evidence[key] = canonical_sort(value)
    return result


def normalized_marker(row: dict[str, Any]) -> dict[str, Any]:
    result = copy.deepcopy(row)
    result["secondaryTagLocalIds"] = sorted(result.get("secondaryTagLocalIds", []))
    result["slotAssignments"] = canonical_sort(result.get("slotAssignments", []))
    provenance = result.get("provenance")
    if isinstance(provenance, dict):
        for key in ("workflowTags", "derivations"):
            if isinstance(provenance.get(key), list):
                provenance[key] = canonical_sort(provenance[key])
    return result


def normalized_source(source: dict[str, Any]) -> dict[str, Any]:
    result = copy.deepcopy(source)
    for plural in ("scenes", "tags", "performers"):
        result[plural] = sorted(
            (normalized_entity(row) for row in result.get(plural, [])),
            key=lambda row: row.get("localId", 0),
        )
    result["markers"] = sorted(
        (normalized_marker(row) for row in result.get("markers", [])),
        key=lambda row: row.get("localId", 0),
    )
    result["shotBoundaries"] = sorted(
        result.get("shotBoundaries", []),
        key=lambda row: (
            row.get("sceneLocalId", 0),
            row.get("startMs", 0),
            row.get("localId", ""),
        ),
    )
    result["slotDefinitionSets"] = sorted(
        result.get("slotDefinitionSets", []), key=lambda row: row.get("id", "")
    )
    result["slotDefinitions"] = sorted(
        result.get("slotDefinitions", []), key=lambda row: row.get("id", "")
    )
    for row in result["slotDefinitions"]:
        row["genderHints"] = sorted(row.get("genderHints", []))
    result["derivedMarkerRules"] = sorted(
        result.get("derivedMarkerRules", []), key=lambda row: row.get("id", "")
    )
    for row in result["derivedMarkerRules"]:
        row["slotMappings"] = canonical_sort(row.get("slotMappings", []))
    return result


def normalized_target(target: dict[str, Any]) -> dict[str, Any]:
    result = copy.deepcopy(target)
    result["receiptIntegrity"] = result.get("receiptIntegrity", {
        "orphanReceiptCount": 0, "orphanProvenanceCount": 0,
    })
    for field in ("videoIds", "tagIds", "performerIds", "slotDefinitionIds"):
        result[field] = sorted(result.get(field, []))
    result["slotDefinitionSets"] = sorted(
        result.get("slotDefinitionSets", []), key=lambda row: row.get("id", "")
    )
    result["slotDefinitions"] = sorted(
        result.get("slotDefinitions", []), key=lambda row: row.get("id", "")
    )
    result["slotGenderHints"] = canonical_sort(result.get("slotGenderHints", []))
    result["segments"] = sorted(result.get("segments", []), key=lambda row: row.get("id", 0))
    for row in result["segments"]:
        row["secondaryTagIds"] = sorted(row.get("secondaryTagIds", []))
    result["receipts"] = sorted(
        result.get("receipts", []),
        key=lambda row: (row.get("sourceInstanceId", ""), row.get("sourceMarkerId", 0)),
    )
    result["baselineReceipts"] = sorted(
        result.get("baselineReceipts", []),
        key=lambda row: (row.get("sourceInstanceId", ""), row.get("segmentId", 0)),
    )
    result["migrationRuns"] = sorted(
        result.get("migrationRuns", []),
        key=lambda row: (row.get("sourceInstanceId", ""), row.get("planFingerprint", "")),
    )
    result["segmentSlots"] = sorted(
        result.get("segmentSlots", []),
        key=lambda row: (row.get("segmentId", 0), row.get("slotDefinitionId", "")),
    )
    return result


def normalized_manifest(manifest: dict[str, Any]) -> dict[str, Any]:
    result = copy.deepcopy(manifest)
    result["entityMappings"] = sorted(
        result.get("entityMappings", []),
        key=lambda row: (row.get("entityKind", ""), row.get("sourceLocalId", 0)),
    )
    result["collisionAdoptions"] = sorted(
        result.get("collisionAdoptions", []),
        key=lambda row: row.get("sourceMarkerId", 0),
    )
    result["baselineSegments"] = sorted(
        result.get("baselineSegments", []),
        key=lambda row: row.get("segmentId", 0),
    )
    result["unresolvedEntities"] = sorted(
        result.get("unresolvedEntities", []),
        key=lambda row: (row.get("entityKind", ""), row.get("sourceLocalId", 0)),
    )
    return result


def source_fingerprint(source: dict[str, Any]) -> str:
    return sha256_json({"plannerVersion": PLANNER_VERSION, "source": normalized_source(source)})


def entity_fingerprint(kind: str, row: dict[str, Any]) -> str:
    return sha256_json({"kind": kind, "entity": normalized_entity(row)})


def marker_fingerprint(row: dict[str, Any]) -> str:
    return sha256_json({"sourceKind": SOURCE_KIND, "marker": normalized_marker(row)})


def receipt_provenance_fingerprint(row: dict[str, Any]) -> str:
    return sha256_json({
        "externalMarkerId": row.get("externalMarkerId"),
        "sourceFingerprint": row.get("sourceFingerprint"),
        "sourceStatus": row.get("sourceStatus"),
        "matchKind": row.get("matchKind"),
        "provenance": row.get("provenance"),
    })


def segment_fingerprint(row: dict[str, Any]) -> str:
    identity = {
        "id": row.get("id"),
        "videoId": row.get("videoId"),
        "tagId": row.get("tagId"),
        "refId": row.get("refId"),
        "startMs": row.get("startMs"),
        "endMs": row.get("endMs"),
    }
    return sha256_json({"canonicalSegment": identity})


def reviewed_target_fingerprint(target: dict[str, Any], baseline: list[dict[str, Any]]) -> str:
    return sha256_json({
        "schemaVersion": TARGET_SCHEMA_VERSION,
        "canonicalIds": {
            field: sorted(target.get(field, []))
            for field in ("videoIds", "tagIds", "performerIds")
        },
        "baselineSegments": sorted(baseline, key=lambda row: row.get("segmentId", 0)),
    })


def require_int(value: Any, field: str, *, positive: bool = False) -> int:
    if not isinstance(value, int) or isinstance(value, bool) or (positive and value <= 0):
        raise ValidationError(f"{field} must be an integer" + (" greater than zero." if positive else "."))
    return value


def require_hash(value: Any, field: str) -> str:
    if not isinstance(value, str) or HEX_SHA256.fullmatch(value) is None:
        raise ValidationError(f"{field} must be a lowercase SHA-256 value.")
    return value


def require_list(value: Any, field: str) -> list[Any]:
    if not isinstance(value, list):
        raise ValidationError(f"{field} must be a list.")
    return value


def unique_rows(rows: list[dict[str, Any]], field: str, label: str) -> None:
    values = [row.get(field) for row in rows]
    if len(values) != len(set(values)):
        raise ValidationError(f"Duplicate {label} identity.")


def validate_source(source: dict[str, Any]) -> None:
    if source.get("schemaVersion") != SOURCE_SCHEMA_VERSION:
        raise ValidationError("Unsupported source schema version.")
    if source.get("sourceKind") != SOURCE_KIND:
        raise ValidationError("Unsupported source kind.")
    if not isinstance(source.get("sourceInstanceId"), str) or not source["sourceInstanceId"].strip():
        raise ValidationError("sourceInstanceId is required.")
    snapshots = source.get("snapshots")
    if not isinstance(snapshots, dict):
        raise ValidationError("Source snapshot identities are required.")
    require_hash(snapshots.get("markerStudioSha256"), "markerStudioSha256")
    require_hash(snapshots.get("stashSqliteSha256"), "stashSqliteSha256")

    entities: dict[str, list[dict[str, Any]]] = {}
    for plural in ("scenes", "tags", "performers"):
        rows = require_list(source.get(plural), plural)
        if any(not isinstance(row, dict) for row in rows):
            raise ValidationError(f"{plural} contains a non-object row.")
        unique_rows(rows, "localId", plural)
        for row in rows:
            require_int(row.get("localId"), f"{plural}.localId", positive=True)
            if not isinstance(row.get("evidence"), dict):
                raise ValidationError(f"{plural}.evidence is required.")
        entities[plural] = rows

    scene_ids = {row["localId"] for row in entities["scenes"]}
    tag_ids = {row["localId"] for row in entities["tags"]}
    performer_ids = {row["localId"] for row in entities["performers"]}
    markers = require_list(source.get("markers"), "markers")
    shot_boundaries = require_list(source.get("shotBoundaries", []), "shotBoundaries")
    definition_sets = require_list(source.get("slotDefinitionSets", []), "slotDefinitionSets")
    definitions = require_list(source.get("slotDefinitions", []), "slotDefinitions")
    if any(not isinstance(row, dict) for row in [*definition_sets, *definitions]):
        raise ValidationError("Source slot definitions contain a non-object row.")
    unique_rows(definition_sets, "id", "slot definition set")
    unique_rows(definitions, "id", "slot definition")
    definition_set_ids: set[str] = set()
    definition_ids: set[str] = set()
    definition_orders: set[tuple[str, int]] = set()
    for row in definition_sets:
        identity = row.get("id")
        if not isinstance(identity, str) or not identity:
            raise ValidationError("A slot definition set identity is invalid.")
        if row.get("sourceTagLocalId") not in tag_ids:
            raise ValidationError("A slot definition set references an unknown source tag.")
        if not isinstance(row.get("allowSamePerformerInMultipleSlots"), bool):
            raise ValidationError("A slot definition set reuse policy is invalid.")
        definition_set_ids.add(identity)
    for row in definitions:
        identity = row.get("id")
        set_id = row.get("slotDefinitionSetId")
        if not isinstance(identity, str) or not identity or set_id not in definition_set_ids:
            raise ValidationError("A slot definition references an unknown set.")
        sort_order = require_int(row.get("sortOrder"), "slotDefinition.sortOrder")
        if sort_order < 0 or (set_id, sort_order) in definition_orders:
            raise ValidationError("A slot definition order is invalid or duplicated.")
        definition_orders.add((set_id, sort_order))
        hints = require_list(row.get("genderHints"), "slotDefinition.genderHints")
        if len(hints) != len(set(hints)) or any(
            hint not in {"MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"}
            for hint in hints
        ):
            raise ValidationError("A slot definition gender hint is invalid.")
        definition_ids.add(identity)
    if any(not isinstance(row, dict) for row in markers):
        raise ValidationError("markers contains a non-object row.")
    if any(not isinstance(row, dict) for row in shot_boundaries):
        raise ValidationError("shotBoundaries contains a non-object row.")
    unique_rows(shot_boundaries, "localId", "shot boundary")
    for row in shot_boundaries:
        if not isinstance(row.get("localId"), str) or not row["localId"].strip():
            raise ValidationError("A shot boundary identity is invalid.")
        if row.get("sceneLocalId") not in scene_ids:
            raise ValidationError("A shot boundary references an unknown source scene.")
        start_ms = require_int(row.get("startMs"), "shotBoundary.startMs")
        end_ms = require_int(row.get("endMs"), "shotBoundary.endMs")
        if start_ms < 0 or end_ms <= start_ms:
            raise ValidationError("A shot boundary has invalid timing.")
        if row.get("source") not in {"manual", "pyscenedetect", "omnishotcut"}:
            raise ValidationError("A shot boundary source is unsupported.")
        if row.get("metadata") is not None and not isinstance(row["metadata"], dict):
            raise ValidationError("Shot boundary metadata must be an object or null.")
    unique_rows(markers, "localId", "marker")
    external_ids = [row["externalMarkerId"] for row in markers if row.get("externalMarkerId") is not None]
    if len(external_ids) != len(set(external_ids)):
        raise ValidationError("Duplicate external marker identity.")
    for row in markers:
        require_int(row.get("localId"), "marker.localId", positive=True)
        if row.get("externalMarkerId") is not None:
            require_int(row["externalMarkerId"], "marker.externalMarkerId", positive=True)
        if row.get("sceneLocalId") not in scene_ids:
            raise ValidationError("A marker references an unknown source scene.")
        if row.get("primaryTagLocalId") not in tag_ids:
            raise ValidationError("A marker references an unknown primary tag.")
        start_ms = require_int(row.get("startMs"), "marker.startMs")
        if start_ms < 0:
            raise ValidationError("marker.startMs must not be negative.")
        end_ms = row.get("endMs")
        if end_ms is not None and require_int(end_ms, "marker.endMs") < start_ms:
            raise ValidationError("marker.endMs must be greater than or equal to startMs.")
        if row.get("status") not in REVIEW_STATE:
            raise ValidationError("Marker status is unsupported.")
        secondary = require_list(row.get("secondaryTagLocalIds"), "marker.secondaryTagLocalIds")
        if any(not isinstance(value, int) or isinstance(value, bool) for value in secondary):
            raise ValidationError("A secondary tag identity is invalid.")
        if len(secondary) != len(set(secondary)):
            raise ValidationError("A marker contains duplicate secondary tag identities.")
        slots = require_list(row.get("slotAssignments"), "marker.slotAssignments")
        assignment_definition_ids: list[str] = []
        for slot in slots:
            if not isinstance(slot, dict) or not isinstance(slot.get("slotDefinitionId"), str) or not slot["slotDefinitionId"]:
                raise ValidationError("A marker slot definition identity is invalid.")
            if slot["slotDefinitionId"] not in definition_ids:
                raise ValidationError("A marker slot references an unknown source definition.")
            assignment_definition_ids.append(slot["slotDefinitionId"])
            performer_id = slot.get("performerLocalId")
            if performer_id is not None and performer_id not in performer_ids:
                raise ValidationError("A marker slot references an unknown performer.")
        if len(assignment_definition_ids) != len(set(assignment_definition_ids)):
            raise ValidationError("A marker contains duplicate slot definitions.")
        if not isinstance(row.get("provenance"), dict):
            raise ValidationError("marker.provenance must be an object.")


def validate_target(target: dict[str, Any]) -> None:
    if target.get("schemaVersion") != TARGET_SCHEMA_VERSION:
        raise ValidationError("Unsupported target schema version.")
    receipt_integrity = target.get("receiptIntegrity", {
        "orphanReceiptCount": 0, "orphanProvenanceCount": 0,
    })
    if not isinstance(receipt_integrity, dict) or any(
        require_int(receipt_integrity.get(field), f"receiptIntegrity.{field}") != 0
        for field in ("orphanReceiptCount", "orphanProvenanceCount")
    ):
        raise ValidationError("Target receipt and provenance cardinality is corrupt.")
    canonical_ids: dict[str, set[Any]] = {}
    for field in ("videoIds", "tagIds", "performerIds"):
        values = require_list(target.get(field), field)
        if any(not isinstance(value, int) or isinstance(value, bool) or value <= 0 for value in values):
            raise ValidationError(f"{field} contains an invalid canonical identity.")
        if len(values) != len(set(values)):
            raise ValidationError(f"{field} contains duplicate canonical identities.")
        canonical_ids[field] = set(values)
    definition_ids = require_list(target.get("slotDefinitionIds"), "slotDefinitionIds")
    if any(not isinstance(value, str) or not value for value in definition_ids):
        raise ValidationError("slotDefinitionIds contains an invalid canonical identity.")
    if len(definition_ids) != len(set(definition_ids)):
        raise ValidationError("slotDefinitionIds contains duplicate canonical identities.")
    canonical_ids["slotDefinitionIds"] = set(definition_ids)
    target_sets = require_list(target.get("slotDefinitionSets", []), "slotDefinitionSets")
    target_definitions = require_list(target.get("slotDefinitions", []), "slotDefinitions")
    target_hints = require_list(target.get("slotGenderHints", []), "slotGenderHints")
    if any(not isinstance(row, dict) for row in [*target_sets, *target_definitions, *target_hints]):
        raise ValidationError("Target slot definitions contain a non-object row.")
    set_ids = {row.get("id") for row in target_sets}
    if len(set_ids) != len(target_sets) or any(not isinstance(value, str) or not value for value in set_ids):
        raise ValidationError("Target slot definition set identity is invalid or duplicated.")
    for row in target_sets:
        if row.get("tagId") not in canonical_ids["tagIds"] or not isinstance(
            row.get("allowSamePerformerInMultipleSlots"), bool
        ):
            raise ValidationError("Target slot definition set is invalid.")
    target_definition_ids = {row.get("id") for row in target_definitions}
    if target_definition_ids != canonical_ids["slotDefinitionIds"]:
        raise ValidationError("Target slot definition identities are inconsistent.")
    orders: set[tuple[str, int]] = set()
    for row in target_definitions:
        set_id = row.get("slotDefinitionSetId")
        sort_order = require_int(row.get("sortOrder"), "slotDefinition.sortOrder")
        if set_id not in set_ids or sort_order < 0 or (set_id, sort_order) in orders:
            raise ValidationError("Target slot definition is invalid.")
        orders.add((set_id, sort_order))
    hint_keys: set[tuple[str, str]] = set()
    for row in target_hints:
        key = (row.get("slotDefinitionId"), row.get("genderHint"))
        if key[0] not in target_definition_ids or key[1] not in {
            "MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"
        } or key in hint_keys:
            raise ValidationError("Target slot definition gender hint is invalid.")
        hint_keys.add(key)

    segments = require_list(target.get("segments"), "segments")
    receipts = require_list(target.get("receipts"), "receipts")
    baseline_receipts = require_list(target.get("baselineReceipts", []), "baselineReceipts")
    migration_runs = require_list(target.get("migrationRuns", []), "migrationRuns")
    slots = require_list(target.get("segmentSlots"), "segmentSlots")
    if any(not isinstance(row, dict) for row in [*segments, *receipts, *baseline_receipts, *migration_runs, *slots]):
        raise ValidationError("Target snapshot contains a non-object row.")
    unique_rows(segments, "id", "target segment")
    segment_ids = {require_int(row.get("id"), "segment.id", positive=True) for row in segments}
    for row in segments:
        video_id = require_int(row.get("videoId"), "segment.videoId", positive=True)
        tag_id = require_int(row.get("tagId"), "segment.tagId", positive=True)
        if video_id not in canonical_ids["videoIds"] or tag_id not in canonical_ids["tagIds"]:
            raise ValidationError("A target segment references a missing canonical target.")
        if row.get("refId") is not None:
            require_int(row["refId"], "segment.refId", positive=True)
        start_ms = require_int(row.get("startMs"), "segment.startMs")
        if start_ms < 0:
            raise ValidationError("segment.startMs must not be negative.")
        if row.get("endMs") is not None and require_int(row["endMs"], "segment.endMs") < start_ms:
            raise ValidationError("segment.endMs must be greater than or equal to startMs.")
        if row.get("reviewState") not in {"approved", "rejected", "unreviewed"}:
            raise ValidationError("Target review state is unsupported.")
        secondary = require_list(row.get("secondaryTagIds"), "segment.secondaryTagIds")
        if any(not isinstance(value, int) or isinstance(value, bool) or value not in canonical_ids["tagIds"] for value in secondary):
            raise ValidationError("A target segment secondary tag identity is invalid.")
        if len(secondary) != len(set(secondary)):
            raise ValidationError("A target segment contains duplicate secondary tag identities.")
    receipt_keys = [(row.get("sourceInstanceId"), row.get("sourceMarkerId")) for row in receipts]
    if len(receipt_keys) != len(set(receipt_keys)):
        raise ValidationError("Duplicate target receipt identity.")
    for row in receipts:
        if not isinstance(row.get("sourceInstanceId"), str) or not row["sourceInstanceId"].strip():
            raise ValidationError("receipt.sourceInstanceId is required.")
        require_int(row.get("sourceMarkerId"), "receipt.sourceMarkerId", positive=True)
        if row.get("segmentId") not in segment_ids:
            raise ValidationError("A target receipt references a missing segment.")
        require_hash(row.get("sourceMarkerFingerprint"), "receipt.sourceMarkerFingerprint")
        require_hash(row.get("targetSegmentFingerprint"), "receipt.targetSegmentFingerprint")
        if row.get("provenanceFingerprint") is not None:
            require_hash(row["provenanceFingerprint"], "receipt.provenanceFingerprint")
        if row.get("sourceFingerprint") is not None:
            require_hash(row["sourceFingerprint"], "receipt.sourceFingerprint")
        if row.get("sourceStatus") is not None and row["sourceStatus"] not in REVIEW_STATE:
            raise ValidationError("Target receipt source status is unsupported.")
        if row.get("matchKind") is not None and row["matchKind"] not in {"ref", "adoption", "create"}:
            raise ValidationError("Target receipt match kind is unsupported.")
        if row.get("provenance") is not None and not isinstance(row["provenance"], dict):
            raise ValidationError("Target receipt provenance must be an object.")
    baseline_keys: set[tuple[str, int]] = set()
    for row in baseline_receipts:
        source_instance_id = row.get("sourceInstanceId")
        segment_id = require_int(row.get("segmentId"), "baselineReceipt.segmentId", positive=True)
        if not isinstance(source_instance_id, str) or not source_instance_id.strip():
            raise ValidationError("baselineReceipt.sourceInstanceId is required.")
        if segment_id not in segment_ids:
            raise ValidationError("A target baseline receipt references a missing segment.")
        require_hash(row.get("targetSegmentFingerprint"), "baselineReceipt.targetSegmentFingerprint")
        key = (source_instance_id, segment_id)
        if key in baseline_keys:
            raise ValidationError("Duplicate target baseline receipt identity.")
        baseline_keys.add(key)
    run_keys: set[str] = set()
    for row in migration_runs:
        plan_fingerprint = require_hash(row.get("planFingerprint"), "migrationRun.planFingerprint")
        require_hash(row.get("sourceFingerprint"), "migrationRun.sourceFingerprint")
        require_hash(row.get("manifestFingerprint"), "migrationRun.manifestFingerprint")
        if not isinstance(row.get("sourceInstanceId"), str) or not row["sourceInstanceId"].strip():
            raise ValidationError("migrationRun.sourceInstanceId is required.")
        if not isinstance(row.get("result"), dict):
            raise ValidationError("migrationRun.result must be an object.")
        if plan_fingerprint in run_keys:
            raise ValidationError("Duplicate migration run identity.")
        run_keys.add(plan_fingerprint)
    slot_keys: set[tuple[int, str]] = set()
    for row in slots:
        segment_id = require_int(row.get("segmentId"), "segmentSlot.segmentId", positive=True)
        definition_id = row.get("slotDefinitionId")
        if segment_id not in segment_ids or not isinstance(definition_id, str) or not definition_id:
            raise ValidationError("A target segment slot identity is invalid.")
        if definition_id not in canonical_ids["slotDefinitionIds"]:
            raise ValidationError("A target segment slot references a missing canonical target.")
        key = (segment_id, definition_id)
        if key in slot_keys:
            raise ValidationError("Duplicate target segment slot identity.")
        slot_keys.add(key)
        performer_id = require_int(row.get("performerId"), "segmentSlot.performerId", positive=True)
        if performer_id not in canonical_ids["performerIds"]:
            raise ValidationError("A target segment slot references a missing performer.")


def validate_manifest(
    source: dict[str, Any],
    target: dict[str, Any],
    manifest: dict[str, Any],
) -> tuple[
    dict[tuple[str, int], int],
    dict[int, dict[str, Any]],
    set[tuple[str, int]],
    set[int],
]:
    if manifest.get("schemaVersion") != MANIFEST_SCHEMA_VERSION:
        raise ValidationError("Unsupported manifest schema version.")
    fingerprint = source_fingerprint(source)
    if manifest.get("sourceFingerprint") != fingerprint:
        raise ValidationError("Manifest source fingerprint does not match this source snapshot.")

    source_entities = {
        (kind, int(row["localId"])): row
        for kind, plural in (("scene", "scenes"), ("tag", "tags"), ("performer", "performers"))
        for row in source[plural]
    }
    target_segments = {int(row["id"]): row for row in target["segments"]}
    baseline_ids: set[int] = set()
    baseline = require_list(manifest.get("baselineSegments"), "baselineSegments")
    for row in baseline:
        if not isinstance(row, dict):
            raise ValidationError("Manifest contains a non-object baseline segment.")
        segment_id = require_int(row.get("segmentId"), "baselineSegment.segmentId", positive=True)
        if segment_id in baseline_ids:
            raise ValidationError("Duplicate manifest baseline segment.")
        segment = target_segments.get(segment_id)
        if segment is None or row.get("targetSegmentFingerprint") != segment_fingerprint(segment):
            raise ValidationError("The reviewed target baseline has drifted.")
        baseline_ids.add(segment_id)
    reviewed_fingerprint = reviewed_target_fingerprint(target, baseline)
    if manifest.get("reviewedTargetFingerprint") != reviewed_fingerprint:
        raise ValidationError("Manifest reviewed target fingerprint does not match this target snapshot.")
    source_instance_id = source["sourceInstanceId"]
    source_marker_ids = {int(row["localId"]) for row in source["markers"]}
    if any(
        row.get("sourceInstanceId") != source_instance_id
        or int(row["sourceMarkerId"]) not in source_marker_ids
        for row in target["receipts"]
    ):
        raise ValidationError("A target receipt is outside the current source marker domain.")
    if any(
        row.get("sourceInstanceId") != source_instance_id
        or int(row["segmentId"]) not in baseline_ids
        for row in target.get("baselineReceipts", [])
    ):
        raise ValidationError("A target baseline receipt is outside the reviewed baseline domain.")
    if any(
        row.get("sourceInstanceId") != source_instance_id
        for row in target.get("migrationRuns", [])
    ):
        raise ValidationError("A target migration run is outside the current source domain.")
    receipt_segment_ids = {int(row["segmentId"]) for row in target["receipts"]}
    if set(target_segments) - baseline_ids - receipt_segment_ids:
        raise ValidationError("The reviewed target contains an unreviewed canonical segment addition.")

    unresolved: set[tuple[str, int]] = set()
    for row in require_list(manifest.get("unresolvedEntities"), "unresolvedEntities"):
        if not isinstance(row, dict) or row.get("disposition") != "skip":
            raise ValidationError("Manifest unresolved entity disposition is invalid.")
        key = (row.get("entityKind"), row.get("sourceLocalId"))
        if key not in source_entities:
            raise ValidationError("Manifest unresolved disposition references an unknown source entity.")
        if key in unresolved:
            raise ValidationError("Duplicate manifest unresolved entity disposition.")
        if row.get("sourceEntityFingerprint") != entity_fingerprint(key[0], source_entities[key]):
            raise ValidationError("Manifest unresolved entity evidence has drifted.")
        unresolved.add(key)
    mappings: dict[tuple[str, int], int] = {}
    canonical_targets = {
        "scene": set(target["videoIds"]),
        "tag": set(target["tagIds"]),
        "performer": set(target["performerIds"]),
    }
    for row in require_list(manifest.get("entityMappings"), "entityMappings"):
        if not isinstance(row, dict):
            raise ValidationError("Manifest contains a non-object entity mapping.")
        kind = row.get("entityKind")
        local_id = row.get("sourceLocalId")
        key = (kind, local_id)
        if key not in source_entities:
            raise ValidationError("Manifest entity mapping references an unknown source entity.")
        if key in mappings:
            raise ValidationError("Duplicate manifest entity mapping.")
        canonical_id = require_int(row.get("canonicalId"), "entityMapping.canonicalId", positive=True)
        if canonical_id not in canonical_targets[kind]:
            raise ValidationError("Manifest entity mapping references a missing canonical target.")
        expected = entity_fingerprint(kind, source_entities[key])
        if row.get("sourceEntityFingerprint") != expected:
            raise ValidationError("Manifest entity mapping evidence has drifted.")
        mappings[key] = canonical_id

    markers = {int(row["localId"]): row for row in source["markers"]}
    segments = target_segments
    adoptions: dict[int, dict[str, Any]] = {}
    for row in require_list(manifest.get("collisionAdoptions"), "collisionAdoptions"):
        if not isinstance(row, dict):
            raise ValidationError("Manifest contains a non-object collision adoption.")
        marker_id = row.get("sourceMarkerId")
        segment_id = row.get("canonicalSegmentId")
        if marker_id not in markers or segment_id not in segments:
            raise ValidationError("Manifest collision adoption references an unknown row.")
        if marker_id in adoptions:
            raise ValidationError("Duplicate manifest collision adoption.")
        if row.get("sourceMarkerFingerprint") != marker_fingerprint(markers[marker_id]):
            raise ValidationError("Manifest collision source marker has drifted.")
        if row.get("targetSegmentFingerprint") != segment_fingerprint(segments[segment_id]):
            raise ValidationError("Manifest collision target segment has drifted.")
        adoptions[marker_id] = row
    if set(mappings) & unresolved:
        raise ValidationError("A manifest entity cannot be both mapped and skipped.")
    return mappings, adoptions, unresolved, baseline_ids


def migration_audit(target: dict[str, Any], source_instance_id: str) -> dict[str, Any]:
    receipts = canonical_sort([
        row for row in target.get("receipts", [])
        if row.get("sourceInstanceId") == source_instance_id
    ])
    baselines = canonical_sort([
        row for row in target.get("baselineReceipts", [])
        if row.get("sourceInstanceId") == source_instance_id
    ])
    return {
        "receiptCount": len(receipts),
        "receiptSetFingerprint": sha256_json(receipts),
        "baselineReceiptCount": len(baselines),
        "baselineReceiptSetFingerprint": sha256_json(baselines),
    }


def migration_run_record(
    plan: Plan,
    result: dict[str, Any],
    source_instance_id: str,
    target: dict[str, Any],
) -> dict[str, Any]:
    return {
        "planFingerprint": plan.result["planFingerprint"],
        "sourceInstanceId": source_instance_id,
        "sourceFingerprint": plan.result["sourceFingerprint"],
        "manifestFingerprint": plan.result["manifestFingerprint"],
        "result": {**result, **migration_audit(target, source_instance_id)},
    }


def add_prior_run_issues(
    target: dict[str, Any],
    source_instance_id: str,
    source_hash: str,
    issues: Issues,
) -> None:
    current = migration_audit(target, source_instance_id)
    for run in target.get("migrationRuns", []):
        if run.get("sourceInstanceId") != source_instance_id:
            continue
        result = run.get("result", {})
        if run.get("sourceFingerprint") != source_hash:
            issues.add("prior-run-source-drift")
        if (
            result.get("receiptCount") != current["receiptCount"]
            or result.get("receiptSetFingerprint") != current["receiptSetFingerprint"]
        ):
            issues.add("prior-migration-receipt-set-drift")
        if (
            result.get("baselineReceiptCount") != current["baselineReceiptCount"]
            or result.get("baselineReceiptSetFingerprint") != current["baselineReceiptSetFingerprint"]
        ):
            issues.add("prior-migration-baseline-set-drift")


def build_plan(source: dict[str, Any], target: dict[str, Any], manifest: dict[str, Any]) -> Plan:
    validate_source(source)
    validate_target(target)
    mappings, adoption_manifest, unresolved_manifest, baseline_ids = validate_manifest(source, target, manifest)
    plan = Plan()
    issues = Issues()
    source_instance = source["sourceInstanceId"]
    source_hash = source_fingerprint(source)
    manifest_hash = sha256_json(normalized_manifest(manifest))
    target_hash = sha256_json({"schemaVersion": TARGET_SCHEMA_VERSION, "target": normalized_target(target)})
    add_prior_run_issues(target, source_instance, source_hash, issues)

    segments = {int(row["id"]): row for row in target["segments"]}
    baseline_receipt_index = {
        (row["sourceInstanceId"], int(row["segmentId"])): row
        for row in target.get("baselineReceipts", [])
    }
    ref_index: dict[int, list[dict[str, Any]]] = defaultdict(list)
    tuple_index: dict[tuple[int, int, int, int | None], list[dict[str, Any]]] = defaultdict(list)
    for row in target["segments"]:
        if row.get("refId") is not None:
            ref_index[int(row["refId"])].append(row)
        tuple_index[(int(row["videoId"]), int(row["tagId"]), int(row["startMs"]), row.get("endMs"))].append(row)
        segment_id = int(row["id"])
        if segment_id in baseline_ids:
            baseline_receipt = baseline_receipt_index.get((source_instance, segment_id))
            if baseline_receipt is None:
                plan.baseline_receipt_inserts.append({
                    "sourceInstanceId": source_instance,
                    "segmentId": segment_id,
                    "targetSegmentFingerprint": segment_fingerprint(row),
                })
                if row["reviewState"] != "approved":
                    plan.baseline_approvals.append({"segmentId": segment_id})
            elif baseline_receipt["targetSegmentFingerprint"] != segment_fingerprint(row):
                issues.add("baseline-receipt-target-drift")
    plan.baseline_approvals.sort(key=lambda row: row["segmentId"])
    plan.baseline_receipt_inserts.sort(key=lambda row: row["segmentId"])

    receipt_index = {
        (row["sourceInstanceId"], int(row["sourceMarkerId"])): row
        for row in target["receipts"]
    }
    existing_slots = {
        (int(row["segmentId"]), row["slotDefinitionId"]): int(row["performerId"])
        for row in target["segmentSlots"]
    }
    target_sets = {row["id"]: row for row in target.get("slotDefinitionSets", [])}
    target_sets_by_tag = {int(row["tagId"]): row for row in target.get("slotDefinitionSets", [])}
    target_definitions = {row["id"]: row for row in target.get("slotDefinitions", [])}
    target_definitions_by_order = {
        (row["slotDefinitionSetId"], int(row["sortOrder"])): row
        for row in target.get("slotDefinitions", [])
    }
    target_hints = {
        (row["slotDefinitionId"], row["genderHint"])
        for row in target.get("slotGenderHints", [])
    }
    source_sets = {row["id"]: row for row in source.get("slotDefinitionSets", [])}
    source_definition_primary_tags = {
        definition["id"]: int(source_sets[definition["slotDefinitionSetId"]]["sourceTagLocalId"])
        for definition in source.get("slotDefinitions", [])
        if definition["slotDefinitionSetId"] in source_sets
    }
    for source_set in sorted(source_sets.values(), key=lambda row: row["id"]):
        tag_id = mappings.get(("tag", int(source_set["sourceTagLocalId"])))
        if tag_id is None:
            issues.add("slot-definition-tag-unresolved")
            continue
        expected = {
            "id": source_set["id"],
            "tagId": tag_id,
            "allowSamePerformerInMultipleSlots": source_set["allowSamePerformerInMultipleSlots"],
        }
        existing = target_sets.get(source_set["id"])
        if existing is not None and existing != expected:
            issues.add("slot-definition-set-conflict")
        elif existing is None and tag_id in target_sets_by_tag:
            issues.add("slot-definition-set-tag-conflict")
        elif existing is None:
            plan.slot_definition_set_inserts.append(expected)

    for definition in sorted(source.get("slotDefinitions", []), key=lambda row: row["id"]):
        if definition["slotDefinitionSetId"] not in source_sets:
            issues.add("slot-definition-set-unresolved")
            continue
        expected = {
            "id": definition["id"],
            "slotDefinitionSetId": definition["slotDefinitionSetId"],
            "label": definition.get("label"),
            "sortOrder": int(definition["sortOrder"]),
        }
        existing = target_definitions.get(definition["id"])
        if existing is not None and existing != expected:
            issues.add("slot-definition-conflict")
        elif existing is None and (
            definition["slotDefinitionSetId"], int(definition["sortOrder"])
        ) in target_definitions_by_order:
            issues.add("slot-definition-order-conflict")
        elif existing is None:
            plan.slot_definition_inserts.append(expected)
        expected_hints = set(definition.get("genderHints", []))
        existing_hints = {hint for identity, hint in target_hints if identity == definition["id"]}
        if existing is not None and existing_hints != expected_hints:
            issues.add("slot-definition-gender-hint-conflict")
        elif existing is None:
            for hint in sorted(expected_hints):
                plan.slot_gender_hint_inserts.append({
                    "slotDefinitionId": definition["id"], "genderHint": hint,
                })
    available_definition_ids = set(target["slotDefinitionIds"]) | {
        row["id"] for row in plan.slot_definition_inserts
    }
    marker_match_kind: Counter[str] = Counter()
    created_states: Counter[str] = Counter()
    used_adoptions: set[int] = set()
    skipped_unresolved_video = 0
    stale_secondary = 0
    normalized_empty_slots = 0
    used_unresolved: set[tuple[str, int]] = set()
    source_tag_ids = {int(row["localId"]) for row in source["tags"]}
    secondary_original = {
        int(row["id"]): {int(value) for value in row["secondaryTagIds"]}
        for row in target["segments"]
    }
    secondary_merged = {key: set(value) for key, value in secondary_original.items()}
    planned_slots: dict[tuple[str, int | str, str], int] = {}

    for marker in sorted(source["markers"], key=lambda row: int(row["localId"])):
        marker_id = int(marker["localId"])
        marker_hash = marker_fingerprint(marker)
        receipt = receipt_index.get((source_instance, marker_id))
        segment: dict[str, Any] | None = None
        create_token: str | None = None
        match_kind: str | None = None

        if receipt is not None:
            candidate = segments[int(receipt["segmentId"])]
            if receipt["sourceMarkerFingerprint"] != marker_hash:
                issues.add("receipt-source-drift")
                continue
            if (
                (receipt.get("sourceFingerprint") is not None and receipt["sourceFingerprint"] != source_hash)
                or (receipt.get("sourceStatus") is not None and receipt["sourceStatus"] != marker["status"])
                or ("externalMarkerId" in receipt
                    and receipt.get("externalMarkerId") != marker.get("externalMarkerId"))
                or (receipt.get("provenance") is not None and receipt["provenance"] != marker["provenance"])
                or (receipt.get("provenanceFingerprint") is not None
                    and receipt["provenanceFingerprint"] != receipt_provenance_fingerprint(receipt))
            ):
                issues.add("receipt-provenance-drift")
                continue
            if receipt["targetSegmentFingerprint"] != segment_fingerprint(candidate):
                issues.add("receipt-target-drift")
                continue
            segment = candidate
            match_kind = "receipt"
            adoption = adoption_manifest.get(marker_id)
            if adoption is not None:
                if int(adoption["canonicalSegmentId"]) != int(candidate["id"]):
                    issues.add("receipt-adoption-target-conflict")
                    continue
                used_adoptions.add(marker_id)
        else:
            video_id = mappings.get(("scene", int(marker["sceneLocalId"])))
            tag_id = mappings.get(("tag", int(marker["primaryTagLocalId"])))
            if tag_id is None:
                issues.add("primary-tag-unresolved")
                continue
            ref_matches = (
                ref_index.get(int(marker["externalMarkerId"]), [])
                if marker.get("externalMarkerId") is not None
                else []
            )
            if len(ref_matches) > 1:
                issues.add("segment-ref-ambiguous")
                continue
            if len(ref_matches) == 1:
                if video_id is None:
                    issues.add("segment-ref-context-unresolved")
                    continue
                candidate = ref_matches[0]
                if int(candidate["videoId"]) != video_id or int(candidate["tagId"]) != tag_id:
                    issues.add("segment-ref-context-conflict")
                    continue
                if int(candidate["startMs"]) != int(marker["startMs"]) or candidate.get("endMs") != marker.get("endMs"):
                    issues.add("segment-ref-timing-drift")
                    continue
                segment = candidate
                match_kind = "ref"
            elif video_id is None:
                scene_key = ("scene", int(marker["sceneLocalId"]))
                if scene_key not in unresolved_manifest:
                    issues.add("scene-mapping-missing")
                    continue
                used_unresolved.add(scene_key)
                skipped_unresolved_video += 1
                issues.add("video-reviewed-skip", fatal=False)
                continue
            else:
                tuple_matches = tuple_index.get(
                    (video_id, tag_id, int(marker["startMs"]), marker.get("endMs")),
                    [],
                )
                if len(tuple_matches) > 1:
                    issues.add("segment-tuple-ambiguous")
                    continue
                if len(tuple_matches) == 1:
                    adoption = adoption_manifest.get(marker_id)
                    if adoption is None:
                        issues.add("tuple-adoption-required")
                        continue
                    candidate = tuple_matches[0]
                    if int(adoption["canonicalSegmentId"]) != int(candidate["id"]):
                        issues.add("tuple-adoption-target-conflict")
                        continue
                    used_adoptions.add(marker_id)
                    segment = candidate
                    match_kind = "adoption"
                    plan.adoptions.append({"sourceMarkerId": marker_id, "segmentId": int(segment["id"])})
                else:
                    create_token = f"{source_instance}:{marker_id}"
                    match_kind = "create"

        secondary_tag_ids: list[int] = []
        for source_tag_id in marker["secondaryTagLocalIds"]:
            mapped_tag_id = mappings.get(("tag", int(source_tag_id)))
            if mapped_tag_id is None:
                tag_key = ("tag", int(source_tag_id))
                if int(source_tag_id) not in source_tag_ids:
                    stale_secondary += 1
                    issues.add("stale-secondary-tag-reference", fatal=False)
                elif tag_key in unresolved_manifest:
                    used_unresolved.add(tag_key)
                    issues.add("secondary-tag-reviewed-skip", fatal=False)
                else:
                    issues.add("secondary-tag-unmapped")
            elif mapped_tag_id not in secondary_tag_ids:
                secondary_tag_ids.append(mapped_tag_id)
        secondary_tag_ids.sort()

        if create_token is not None:
            review_state = REVIEW_STATE[marker["status"]]
            creation = {
                "createToken": create_token,
                "videoId": mappings[("scene", int(marker["sceneLocalId"]))],
                "tagId": mappings[("tag", int(marker["primaryTagLocalId"]))],
                "refId": marker.get("externalMarkerId"),
                "startMs": int(marker["startMs"]),
                "endMs": marker.get("endMs"),
                "reviewState": review_state,
                "secondaryTagIds": secondary_tag_ids,
                "sourceKey": SOURCE_KEY,
                "sourceRunId": source_hash,
            }
            plan.creations.append(creation)
            created_states[review_state] += 1
            segment_reference: dict[str, Any] = {"createToken": create_token}
        else:
            assert segment is not None
            segment_reference = {"segmentId": int(segment["id"])}
            secondary_merged[int(segment["id"])].update(secondary_tag_ids)

        marker_match_kind[match_kind or "unknown"] += 1
        if receipt is None:
            receipt_row = {
                "sourceInstanceId": source_instance,
                "sourceMarkerId": marker_id,
                **segment_reference,
                "externalMarkerId": marker.get("externalMarkerId"),
                "sourceMarkerFingerprint": marker_hash,
                "targetSegmentFingerprint": segment_fingerprint(segment) if segment is not None else None,
                "sourceFingerprint": source_hash,
                "sourceStatus": marker["status"],
                "matchKind": match_kind,
                "provenance": marker["provenance"],
            }
            receipt_row["provenanceFingerprint"] = receipt_provenance_fingerprint(receipt_row)
            plan.receipt_inserts.append(receipt_row)

        for slot in marker["slotAssignments"]:
            definition_id = slot["slotDefinitionId"]
            expected_primary_tag = source_definition_primary_tags.get(definition_id)
            if expected_primary_tag is not None and expected_primary_tag != int(marker["primaryTagLocalId"]):
                issues.add("slot-definition-primary-tag-conflict")
                continue
            if definition_id not in available_definition_ids:
                issues.add("slot-definition-unresolved")
                continue
            performer_local_id = slot.get("performerLocalId")
            if performer_local_id is None:
                normalized_empty_slots += 1
                issues.add("empty-slot-normalized", fatal=False)
                continue
            performer_id = mappings.get(("performer", int(performer_local_id)))
            if performer_id is None:
                issues.add("slot-performer-unresolved")
                continue
            if segment is not None:
                existing = existing_slots.get((int(segment["id"]), definition_id))
                if existing is not None and existing != performer_id:
                    issues.add("existing-slot-conflict")
                    continue
                if existing == performer_id:
                    continue
            slot_key = (
                "segment" if segment is not None else "create",
                int(segment["id"]) if segment is not None else create_token or "",
                definition_id,
            )
            planned = planned_slots.get(slot_key)
            if planned is not None and planned != performer_id:
                issues.add("planned-slot-conflict")
                continue
            planned_slots[slot_key] = performer_id

    unused_adoptions = set(adoption_manifest) - used_adoptions
    if unused_adoptions:
        issues.add("unused-collision-adoption", count=len(unused_adoptions))
    unused_unresolved = unresolved_manifest - used_unresolved
    if unused_unresolved:
        issues.add("unused-unresolved-disposition", count=len(unused_unresolved))

    for segment_id, merged in secondary_merged.items():
        if merged != secondary_original[segment_id]:
            plan.secondary_tag_updates.append({"segmentId": segment_id, "secondaryTagIds": sorted(merged)})
    for (kind, identity, definition_id), performer_id in planned_slots.items():
        reference = {"segmentId": identity} if kind == "segment" else {"createToken": identity}
        plan.slot_assignments.append({
            **reference,
            "slotDefinitionId": definition_id,
            "performerId": performer_id,
        })

    plan.creations.sort(key=lambda row: row["createToken"])
    plan.adoptions.sort(key=lambda row: row["sourceMarkerId"])
    plan.receipt_inserts.sort(key=lambda row: (row["sourceInstanceId"], row["sourceMarkerId"]))
    plan.slot_definition_set_inserts.sort(key=lambda row: row["id"])
    plan.slot_definition_inserts.sort(key=lambda row: row["id"])
    plan.slot_gender_hint_inserts.sort(key=lambda row: (row["slotDefinitionId"], row["genderHint"]))
    plan.slot_assignments.sort(key=lambda row: (
        row.get("segmentId", 0), row.get("createToken", ""), row["slotDefinitionId"]
    ))
    plan.secondary_tag_updates.sort(key=lambda row: row["segmentId"])

    issue_values = issues.values()
    fingerprint_payload = {
        "plannerVersion": PLANNER_VERSION,
        "sourceFingerprint": source_hash,
        "targetFingerprint": target_hash,
        "manifestFingerprint": manifest_hash,
        "baselineApprovals": plan.baseline_approvals,
        "baselineReceipts": plan.baseline_receipt_inserts,
        "creations": plan.creations,
        "adoptions": plan.adoptions,
        "receipts": plan.receipt_inserts,
        "slotDefinitionSets": plan.slot_definition_set_inserts,
        "slotDefinitions": plan.slot_definition_inserts,
        "slotGenderHints": plan.slot_gender_hint_inserts,
        "slots": plan.slot_assignments,
        "secondaryTagUpdates": plan.secondary_tag_updates,
        "issues": issue_values,
    }
    existing_final_states: Counter[str] = Counter()
    for row in target["segments"]:
        segment_id = int(row["id"])
        first_baseline_run = (
            segment_id in baseline_ids
            and (source_instance, segment_id) not in baseline_receipt_index
        )
        existing_final_states["approved" if first_baseline_run else row["reviewState"]] += 1
    plan.result = {
        "succeeded": not issues.has_fatal(),
        "sourceFingerprint": source_hash,
        "targetFingerprint": target_hash,
        "manifestFingerprint": manifest_hash,
        "planFingerprint": sha256_json(fingerprint_payload),
        "sourceMarkerCount": len(source["markers"]),
        "existingSegmentCount": len(target["segments"]),
        "baselineApprovalUpdateCount": len(plan.baseline_approvals),
        "pendingBaselineReceiptInsertCount": len(plan.baseline_receipt_inserts),
        "matchedReceiptCount": marker_match_kind["receipt"],
        "matchedRefCount": marker_match_kind["ref"],
        "matchedExistingSegmentCount": marker_match_kind["receipt"] + marker_match_kind["ref"] + marker_match_kind["adoption"],
        "adoptedTupleCount": marker_match_kind["adoption"],
        "newSegmentCount": len(plan.creations),
        "newApprovedCount": created_states["approved"],
        "newRejectedCount": created_states["rejected"],
        "newUnreviewedCount": created_states["unreviewed"],
        "plannedFinalApprovedCount": existing_final_states["approved"] + created_states["approved"],
        "plannedFinalRejectedCount": existing_final_states["rejected"] + created_states["rejected"],
        "plannedFinalUnreviewedCount": existing_final_states["unreviewed"] + created_states["unreviewed"],
        "skippedUnresolvedVideoCount": skipped_unresolved_video,
        "pendingReceiptInsertCount": len(plan.receipt_inserts),
        "pendingSlotDefinitionSetInsertCount": len(plan.slot_definition_set_inserts),
        "pendingSlotDefinitionInsertCount": len(plan.slot_definition_inserts),
        "pendingSlotGenderHintInsertCount": len(plan.slot_gender_hint_inserts),
        "pendingSlotInsertCount": len(plan.slot_assignments),
        "pendingSecondaryTagUpdateCount": len(plan.secondary_tag_updates),
        "staleSecondaryTagReferenceCount": stale_secondary,
        "normalizedEmptySlotCount": normalized_empty_slots,
        "issues": issue_values,
    }
    return plan


def pending_write_count(plan: Plan) -> int:
    return sum(len(rows) for rows in (
        plan.baseline_approvals,
        plan.baseline_receipt_inserts,
        plan.creations,
        plan.receipt_inserts,
        plan.slot_definition_set_inserts,
        plan.slot_definition_inserts,
        plan.slot_gender_hint_inserts,
        plan.slot_assignments,
        plan.secondary_tag_updates,
    ))


def apply_reviewed_plan(
    target: Any,
    source: dict[str, Any],
    manifest: dict[str, Any],
    expected_plan_fingerprint: str,
) -> dict[str, Any]:
    """Apply one exact reviewed plan using a transaction-owning target adapter."""
    require_hash(expected_plan_fingerprint, "expectedPlanFingerprint")
    target.begin_serializable()
    try:
        target.acquire_lock()
        target.ensure_schema()
        before = target.extract_target()
        plan = build_plan(source, before, manifest)
        if not plan.result["succeeded"]:
            raise ValidationError("The migration plan contains fatal issues.")
        prior_run = next((
            run for run in before.get("migrationRuns", [])
            if run.get("planFingerprint") == expected_plan_fingerprint
        ), None)
        if prior_run is not None:
            if (
                prior_run.get("sourceInstanceId") != source["sourceInstanceId"]
                or prior_run.get("sourceFingerprint") != plan.result["sourceFingerprint"]
                or prior_run.get("manifestFingerprint") != plan.result["manifestFingerprint"]
                or pending_write_count(plan) != 0
            ):
                raise ValidationError("The prior migration run no longer matches a safe no-op target.")
            result = dict(prior_run["result"])
            result["replayedReviewedPlan"] = True
            target.commit()
            return result
        if plan.result["planFingerprint"] != expected_plan_fingerprint:
            raise ValidationError("The reviewed plan fingerprint does not match the current target snapshot.")

        target.write_plan(plan, plan.result["sourceFingerprint"], expected_plan_fingerprint)
        after = target.extract_target()
        postcheck = build_plan(source, after, manifest)
        remaining = pending_write_count(postcheck)
        if not postcheck.result["succeeded"] or remaining:
            raise ValidationError("The migration post-check found unapplied or invalid work.")

        result = dict(plan.result)
        result["postCheckPlanFingerprint"] = postcheck.result["planFingerprint"]
        result["postCheckPendingWriteCount"] = remaining
        target.record_run(plan, result, source["sourceInstanceId"])
        target.commit()
        return result
    except BaseException:
        target.rollback()
        raise


class PostgreSqlConnection:
    """Minimal libpq binding that keeps connection secrets out of argv."""

    CONNECTION_OK = 0
    PGRES_COMMAND_OK = 1
    PGRES_TUPLES_OK = 2

    def __init__(self, database_url: str | None):
        library_name = ctypes.util.find_library("pq")
        if not library_name:
            raise ValidationError("libpq is unavailable.")
        self.library = ctypes.CDLL(library_name)
        self.library.PQconnectdb.argtypes = [ctypes.c_char_p]
        self.library.PQconnectdb.restype = ctypes.c_void_p
        self.library.PQstatus.argtypes = [ctypes.c_void_p]
        self.library.PQstatus.restype = ctypes.c_int
        self.library.PQfinish.argtypes = [ctypes.c_void_p]
        self.library.PQexec.argtypes = [ctypes.c_void_p, ctypes.c_char_p]
        self.library.PQexec.restype = ctypes.c_void_p
        self.library.PQexecParams.argtypes = [
            ctypes.c_void_p, ctypes.c_char_p, ctypes.c_int, ctypes.c_void_p,
            ctypes.POINTER(ctypes.c_char_p), ctypes.c_void_p, ctypes.c_void_p, ctypes.c_int,
        ]
        self.library.PQexecParams.restype = ctypes.c_void_p
        self.library.PQresultStatus.argtypes = [ctypes.c_void_p]
        self.library.PQresultStatus.restype = ctypes.c_int
        self.library.PQntuples.argtypes = [ctypes.c_void_p]
        self.library.PQntuples.restype = ctypes.c_int
        self.library.PQnfields.argtypes = [ctypes.c_void_p]
        self.library.PQnfields.restype = ctypes.c_int
        self.library.PQgetvalue.argtypes = [ctypes.c_void_p, ctypes.c_int, ctypes.c_int]
        self.library.PQgetvalue.restype = ctypes.c_char_p
        self.library.PQclear.argtypes = [ctypes.c_void_p]
        self.connection = self.library.PQconnectdb(database_url.encode("utf-8") if database_url else b"")
        if not self.connection or self.library.PQstatus(self.connection) != self.CONNECTION_OK:
            if self.connection:
                self.library.PQfinish(self.connection)
            self.connection = None
            raise ValidationError("The PostgreSQL connection failed; connection details were suppressed.")

    def close(self) -> None:
        if self.connection:
            self.library.PQfinish(self.connection)
            self.connection = None

    def __enter__(self) -> PostgreSqlConnection:
        return self

    def __exit__(self, *_: object) -> None:
        self.close()

    def execute(
        self,
        sql: str,
        parameters: list[str] | None = None,
        *,
        tuples: bool = False,
    ) -> list[list[str]]:
        if not self.connection:
            raise ValidationError("The PostgreSQL connection is closed.")
        if parameters is None:
            result = self.library.PQexec(self.connection, sql.encode("utf-8"))
        else:
            encoded = [value.encode("utf-8") for value in parameters]
            values = (ctypes.c_char_p * len(encoded))(*encoded)
            result = self.library.PQexecParams(
                self.connection, sql.encode("utf-8"), len(encoded), None,
                values, None, None, 0,
            )
        if not result:
            raise ValidationError("A PostgreSQL command failed.")
        try:
            status = self.library.PQresultStatus(result)
            expected = self.PGRES_TUPLES_OK if tuples else self.PGRES_COMMAND_OK
            if status != expected:
                raise ValidationError("A PostgreSQL command failed; private details were suppressed.")
            return [
                [
                    self.library.PQgetvalue(result, row, column).decode("utf-8")
                    for column in range(self.library.PQnfields(result))
                ]
                for row in range(self.library.PQntuples(result))
            ]
        finally:
            self.library.PQclear(result)

    def json_object(self, sql: str) -> dict[str, Any]:
        rows = self.execute(sql, tuples=True)
        if len(rows) != 1 or len(rows[0]) != 1:
            raise ValidationError("A PostgreSQL extraction returned an unexpected result shape.")
        value = json.loads(rows[0][0])
        if not isinstance(value, dict):
            raise ValidationError("A PostgreSQL extraction did not return an object.")
        return value


def database_url_from_environment(name: str | None) -> str | None:
    if name is None:
        return None
    if re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", name) is None:
        raise ValidationError("Database URL environment variable name is invalid.")
    value = os.environ.get(name)
    if not value:
        raise ValidationError(f"Required database URL environment variable is not set: {name}")
    parsed = urllib.parse.urlsplit(value)
    if parsed.scheme not in {"postgres", "postgresql"} or not parsed.hostname:
        raise ValidationError("Database URL environment variable does not contain a PostgreSQL URL.")
    return value


def libpq_environment(database_url: str, database_name: str) -> dict[str, str]:
    parsed = urllib.parse.urlsplit(database_url)
    environment = dict(os.environ)
    environment.update({"PGHOST": parsed.hostname or "", "PGDATABASE": database_name})
    if parsed.port is not None:
        environment["PGPORT"] = str(parsed.port)
    if parsed.username is not None:
        environment["PGUSER"] = urllib.parse.unquote(parsed.username)
    if parsed.password is not None:
        environment["PGPASSWORD"] = urllib.parse.unquote(parsed.password)
    return environment


def database_url_with_database(database_url: str, database_name: str) -> str:
    parsed = urllib.parse.urlsplit(database_url)
    return urllib.parse.urlunsplit(parsed._replace(path="/" + urllib.parse.quote(database_name), query=""))


def extract_source_from_restored_snapshot(database_url: str, snapshot_path: Path) -> dict[str, Any]:
    """Restore and query the exact custom-format dump in an isolated database."""
    validate_private_file(snapshot_path, "Marker Studio snapshot")
    before_hash = sha256_file(snapshot_path)
    database_name = "segment_studio_extract_" + uuid.uuid4().hex
    with PostgreSqlConnection(database_url) as admin:
        admin.execute(f'CREATE DATABASE "{database_name}";')
    try:
        completed = subprocess.run(
            [
                "pg_restore", "--exit-on-error", "--no-owner", "--no-privileges",
                "--dbname", database_name, str(snapshot_path),
            ],
            check=False,
            capture_output=True,
            text=True,
            env=libpq_environment(database_url, database_name),
        )
        if completed.returncode != 0:
            raise ValidationError("Marker Studio snapshot restore failed; private details were suppressed.")
        with PostgreSqlConnection(database_url_with_database(database_url, database_name)) as restored:
            raw = extract_source(restored)
    finally:
        with PostgreSqlConnection(database_url) as admin:
            admin.execute(
                "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid();",
                [database_name],
                tuples=True,
            )
            admin.execute(f'DROP DATABASE IF EXISTS "{database_name}";')
    if sha256_file(snapshot_path) != before_hash:
        raise ValidationError("The Marker Studio snapshot changed during extraction.")
    return raw


def extract_source(connection: PostgreSqlConnection) -> dict[str, Any]:
    connection.execute("BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY;")
    try:
        result = connection.json_object(SOURCE_EXTRACTION_SQL)
        connection.execute("COMMIT;")
        return result
    except BaseException:
        connection.execute("ROLLBACK;")
        raise


class PostgreSqlMigrationTarget:
    def __init__(self, connection: PostgreSqlConnection):
        self.connection = connection

    def begin_serializable(self) -> None:
        self.connection.execute("BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;")

    def acquire_lock(self) -> None:
        self.connection.execute(f"SELECT pg_advisory_xact_lock({IMPORT_ADVISORY_LOCK_ID});", tuples=True)

    def ensure_schema(self) -> None:
        self.connection.execute(RECEIPT_SCHEMA_SQL)

    def require_legacy_slot_schema(self) -> None:
        rows = self.connection.execute(r"""
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_schema = current_schema()
                  AND table_name = 'segment_studio_segment_slots'
                  AND column_name = 'segment_id'
            );
        """, tuples=True)
        if rows != [["t"]]:
            raise ValidationError(
                "The legacy marker migration does not support Segment Studio's stable-item schema; "
                "use the extension's replacement normalization workflow."
            )

    def extract_target(self) -> dict[str, Any]:
        self.require_legacy_slot_schema()
        rows = self.connection.execute(
            "SELECT to_regclass('segment_studio_marker_migration_receipts') IS NOT NULL;",
            tuples=True,
        )
        return self.connection.json_object(target_extraction_sql(rows == [["t"]]))

    def write_plan(self, plan: Plan, source_hash: str, plan_hash: str) -> None:
        self.require_legacy_slot_schema()
        creations = canonical_bytes(plan.creations).decode("utf-8")
        self.connection.execute(r"""
            CREATE TEMP TABLE segment_studio_marker_migration_creations
                (create_token TEXT PRIMARY KEY, segment_id INTEGER NOT NULL) ON COMMIT DROP;
        """)
        self.connection.execute(r"""
            WITH rows AS (
                SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                    "createToken" text, "videoId" integer, "tagId" integer,
                    "refId" bigint, "startMs" bigint, "endMs" bigint,
                    "reviewState" text, "secondaryTagIds" jsonb,
                    "sourceKey" text, "sourceRunId" text
                )
            ), prepared AS (
                SELECT row.*, nextval(pg_get_serial_sequence('segments', 'Id'))::integer AS segment_id
                FROM rows AS row ORDER BY "createToken"
            ), mapped AS (
                INSERT INTO segment_studio_marker_migration_creations (create_token, segment_id)
                SELECT "createToken", segment_id FROM prepared
                RETURNING create_token, segment_id
            )
            INSERT INTO segments
                ("Id", "HostType", "HostId", "StartSec", "EndSec", "TagId", "Kind", "RefId",
                 "Payload", "SourceKey", "SourceRunId", "CreatedAt", "UpdatedAt")
            OVERRIDING SYSTEM VALUE
            SELECT prepared.segment_id, 1, "videoId", "startMs" / 1000.0,
                CASE WHEN "endMs" IS NULL THEN NULL ELSE "endMs" / 1000.0 END,
                "tagId", 'tag', "refId",
                jsonb_build_object(
                    'secondaryTagIds', "secondaryTagIds",
                    'segmentStudio', jsonb_build_object(
                        'schemaVersion', 1, 'reviewState', "reviewState")),
                "sourceKey", "sourceRunId", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            FROM prepared JOIN mapped USING (segment_id);
        """, [creations])

        updates: dict[int, dict[str, Any]] = {}
        for row in plan.baseline_approvals:
            updates.setdefault(int(row["segmentId"]), {"segmentId": int(row["segmentId"])})["approve"] = True
        for row in plan.secondary_tag_updates:
            updates.setdefault(int(row["segmentId"]), {"segmentId": int(row["segmentId"])})[
                "secondaryTagIds"
            ] = row["secondaryTagIds"]
        update_rows = [updates[key] for key in sorted(updates)]
        self.connection.execute(r"""
            WITH rows AS (
                SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                    "segmentId" integer, approve boolean, "secondaryTagIds" jsonb
                )
            ), staged AS (
                SELECT segment.*, row.*,
                    CASE WHEN segment."Payload" IS NULL OR jsonb_typeof(segment."Payload") = 'object'
                        THEN COALESCE(segment."Payload", '{}'::jsonb)
                        ELSE jsonb_build_object('segmentStudioOriginalPayload', segment."Payload") END AS base,
                    CASE WHEN jsonb_typeof(segment."Payload" -> 'segmentStudio') = 'object'
                        THEN segment."Payload" -> 'segmentStudio' ELSE '{}'::jsonb END AS owned
                FROM segments AS segment JOIN rows AS row ON row."segmentId" = segment."Id"
            )
            UPDATE segments AS segment
            SET "Payload" = CASE WHEN staged."secondaryTagIds" IS NULL THEN
                    jsonb_set(staged.base, '{segmentStudio}', staged.owned
                        || jsonb_build_object('schemaVersion', 1)
                        || CASE WHEN staged.approve THEN jsonb_build_object('reviewState', 'approved') ELSE '{}'::jsonb END
                        || CASE WHEN staged."Payload" IS NOT NULL AND jsonb_typeof(staged."Payload") <> 'object'
                            THEN jsonb_build_object('payloadWrapped', true) ELSE '{}'::jsonb END,
                    true)
                ELSE jsonb_set(
                    jsonb_set(staged.base, '{segmentStudio}', staged.owned
                        || jsonb_build_object('schemaVersion', 1)
                        || CASE WHEN staged.approve THEN jsonb_build_object('reviewState', 'approved') ELSE '{}'::jsonb END
                        || CASE WHEN staged."Payload" IS NOT NULL AND jsonb_typeof(staged."Payload") <> 'object'
                            THEN jsonb_build_object('payloadWrapped', true) ELSE '{}'::jsonb END,
                    true),
                    '{secondaryTagIds}', staged."secondaryTagIds", true)
                END,
                "UpdatedAt" = CURRENT_TIMESTAMP
            FROM staged WHERE staged."Id" = segment."Id";
        """, [canonical_bytes(update_rows).decode("utf-8")])

        self.connection.execute(r"""
            WITH rows AS (
                SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                    "sourceInstanceId" text, "segmentId" integer,
                    "targetSegmentFingerprint" text
                )
            )
            INSERT INTO segment_studio_marker_migration_baselines
                (source_instance_id, segment_id, target_segment_fingerprint)
            SELECT "sourceInstanceId", "segmentId", "targetSegmentFingerprint" FROM rows;
        """, [canonical_bytes(plan.baseline_receipt_inserts).decode("utf-8")])

        self.connection.execute(r"""
            WITH rows AS (
                SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                    id uuid, "tagId" integer, "allowSamePerformerInMultipleSlots" boolean
                )
            )
            INSERT INTO segment_studio_slot_definition_sets
                (id, tag_id, allow_same_performer_in_multiple_slots)
            SELECT id, "tagId", "allowSamePerformerInMultipleSlots" FROM rows;
        """, [canonical_bytes(plan.slot_definition_set_inserts).decode("utf-8")])
        self.connection.execute(r"""
            WITH rows AS (
                SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                    id uuid, "slotDefinitionSetId" uuid, label text, "sortOrder" integer
                )
            )
            INSERT INTO segment_studio_slot_definitions
                (id, slot_definition_set_id, label, sort_order)
            SELECT id, "slotDefinitionSetId", label, "sortOrder" FROM rows;
        """, [canonical_bytes(plan.slot_definition_inserts).decode("utf-8")])
        self.connection.execute(r"""
            WITH rows AS (
                SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                    "slotDefinitionId" uuid, "genderHint" text
                )
            )
            INSERT INTO segment_studio_slot_definition_gender_hints
                (slot_definition_id, gender_hint)
            SELECT "slotDefinitionId", "genderHint" FROM rows;
        """, [canonical_bytes(plan.slot_gender_hint_inserts).decode("utf-8")])

        self.connection.execute(r"""
            WITH rows AS (
                SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                    "segmentId" integer, "createToken" text,
                    "slotDefinitionId" uuid, "performerId" integer
                )
            )
            INSERT INTO segment_studio_segment_slots (segment_id, slot_definition_id, performer_id)
            SELECT COALESCE(row."segmentId", mapping.segment_id), row."slotDefinitionId", row."performerId"
            FROM rows AS row LEFT JOIN segment_studio_marker_migration_creations AS mapping
              ON mapping.create_token = row."createToken";
        """, [canonical_bytes(plan.slot_assignments).decode("utf-8")])

        mappings = {
            create_token: int(segment_id)
            for create_token, segment_id in self.connection.execute(
                "SELECT create_token, segment_id FROM segment_studio_marker_migration_creations;",
                tuples=True,
            )
        }
        creation_by_token = {row["createToken"]: row for row in plan.creations}
        receipts: list[dict[str, Any]] = []
        for row in plan.receipt_inserts:
            receipt = dict(row)
            token = receipt.pop("createToken", None)
            segment_id = receipt.get("segmentId")
            if token is not None:
                segment_id = mappings[token]
                creation = creation_by_token[token]
                receipt["targetSegmentFingerprint"] = segment_fingerprint({
                    "id": segment_id,
                    "videoId": creation["videoId"], "tagId": creation["tagId"],
                    "refId": creation["refId"], "startMs": creation["startMs"], "endMs": creation["endMs"],
                })
            receipt["segmentId"] = segment_id
            receipt["sourceFingerprint"] = source_hash
            receipts.append(receipt)
        receipt_json = canonical_bytes(receipts).decode("utf-8")
        self.connection.execute(r"""
            WITH rows AS (
                SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                    "sourceInstanceId" text, "sourceMarkerId" bigint, "segmentId" integer,
                    "sourceMarkerFingerprint" text, "targetSegmentFingerprint" text,
                    "provenanceFingerprint" text
                )
            )
            INSERT INTO segment_studio_marker_migration_receipts
                (source_instance_id, source_marker_id, segment_id,
                 source_marker_fingerprint, target_segment_fingerprint, provenance_fingerprint)
            SELECT "sourceInstanceId", "sourceMarkerId", "segmentId",
                   "sourceMarkerFingerprint", "targetSegmentFingerprint", "provenanceFingerprint" FROM rows;
        """, [receipt_json])
        self.connection.execute(r"""
            WITH rows AS (
                SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                    "sourceInstanceId" text, "sourceMarkerId" bigint, "externalMarkerId" bigint,
                    "sourceStatus" text, "matchKind" text, "sourceFingerprint" text, provenance jsonb
                )
            )
            INSERT INTO segment_studio_marker_migration_provenance
                (source_instance_id, source_marker_id, external_marker_id,
                 source_status, match_kind, source_fingerprint, metadata)
            SELECT "sourceInstanceId", "sourceMarkerId", "externalMarkerId",
                   "sourceStatus", "matchKind", "sourceFingerprint", provenance FROM rows;
        """, [receipt_json])

    def record_run(self, plan: Plan, result: dict[str, Any], source_instance_id: str) -> None:
        record = migration_run_record(plan, result, source_instance_id, self.extract_target())
        self.connection.execute(r"""
            INSERT INTO segment_studio_marker_migration_runs
                (plan_fingerprint, source_instance_id, source_fingerprint, manifest_fingerprint, result)
            VALUES ($1, $2, $3, $4, $5::jsonb);
        """, [
            record["planFingerprint"],
            record["sourceInstanceId"],
            record["sourceFingerprint"],
            record["manifestFingerprint"],
            canonical_bytes(record["result"]).decode("utf-8"),
        ])

    def commit(self) -> None:
        self.connection.execute("COMMIT;")

    def rollback(self) -> None:
        self.connection.execute("ROLLBACK;")


def load_private_json(path: Path, label: str) -> dict[str, Any]:
    mode = stat.S_IMODE(path.stat().st_mode)
    if mode & 0o077:
        raise ValidationError(f"{label} must not be accessible by group or other users.")
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValidationError(f"{label} must contain a JSON object.")
    return value


def atomic_private_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    try:
        with os.fdopen(descriptor, "wb") as destination:
            destination.write(canonical_bytes(value) + b"\n")
    except BaseException:
        try:
            path.unlink()
        except FileNotFoundError:
            pass
        raise
    if stat.S_IMODE(path.stat().st_mode) != 0o600:
        raise ValidationError("Private output permissions are not 0600.")


def atomic_replace_private_json(path: Path, value: Any) -> None:
    temporary = path.with_name(f".{path.name}.{uuid.uuid4().hex}.tmp")
    atomic_private_json(temporary, value)
    try:
        os.replace(temporary, path)
    finally:
        try:
            temporary.unlink()
        except FileNotFoundError:
            pass
    if stat.S_IMODE(path.stat().st_mode) != 0o600:
        raise ValidationError("Private output permissions are not 0600.")


def atomic_private_json_bundle(outputs: list[tuple[Path, Any]]) -> None:
    paths = [path for path, _ in outputs]
    if len(paths) != len(set(paths)):
        raise ValidationError("Private outputs must use distinct paths.")
    if any(path.exists() for path in paths):
        raise ValidationError("Private output refuses to overwrite an existing file.")
    created: list[Path] = []
    try:
        for path, value in outputs:
            atomic_private_json(path, value)
            created.append(path)
    except BaseException:
        for path in reversed(created):
            try:
                path.unlink()
            except FileNotFoundError:
                pass
        raise


def parse_source_tag_mappings(values: list[str]) -> dict[str, int]:
    result: dict[str, int] = {}
    for value in values:
        label, separator, canonical_text = value.rpartition("=")
        label = label.strip()
        canonical_text = canonical_text.strip()
        if (
            not separator
            or not label.startswith(MARKER_SOURCE_PREFIX)
            or not canonical_text.isdigit()
            or int(canonical_text) <= 0
        ):
            raise ValidationError(
                "Source-tag mappings must use 'Marker Source: Label=<canonical-id>'."
            )
        if label in result:
            raise ValidationError(
                f"A duplicate source-tag mapping was supplied for {label}."
            )
        result[label] = int(canonical_text)
    return result


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser(description=__doc__)
    commands = result.add_subparsers(dest="command", required=True)

    extract_source_parser = commands.add_parser("extract-source", help="Create a private source document.")
    extract_source_parser.add_argument("--source-database-url-environment", required=True)
    extract_source_parser.add_argument("--source-instance-id", required=True)
    extract_source_parser.add_argument("--marker-studio-snapshot", required=True)
    extract_source_parser.add_argument("--stash-sqlite", required=True)
    extract_source_parser.add_argument("--output", required=True)

    extract_target_parser = commands.add_parser("extract-target", help="Create a private target document.")
    extract_target_parser.add_argument("--target-database-url-environment")
    extract_target_parser.add_argument("--output", required=True)

    prepare_lineage_parser = commands.add_parser(
        "prepare-lineage",
        help="Recover Marker Source evidence and create review candidates.",
    )
    prepare_lineage_parser.add_argument("--source-document", required=True)
    prepare_lineage_parser.add_argument("--stash-sqlite", required=True)
    prepare_lineage_parser.add_argument("--manifest-input", required=True)
    prepare_lineage_parser.add_argument("--source-output", required=True)
    prepare_lineage_parser.add_argument("--manifest-output", required=True)
    prepare_lineage_parser.add_argument("--report-output", required=True)
    prepare_lineage_parser.add_argument(
        "--infer-ai-analysis-source",
        action="append",
        default=[],
        help="Treat markers whose analyses all use this source as Skier AI.",
    )
    prepare_lineage_parser.add_argument(
        "--infer-confirmed-without-analysis-as-manual",
        action="store_true",
    )
    prepare_lineage_parser.add_argument(
        "--map-source-tag",
        action="append",
        default=[],
        metavar="LABEL=CANONICAL_ID",
    )
    prepare_lineage_parser.add_argument(
        "--exclude-unclassified-markers",
        action="store_true",
    )
    prepare_lineage_parser.add_argument(
        "--exclude-rule-tag-mismatches",
        action="store_true",
    )

    plan_parser = commands.add_parser("plan", help="Build a deterministic dry-run plan.")
    plan_parser.add_argument("--source-document", required=True)
    plan_parser.add_argument("--target-document", required=True)
    plan_parser.add_argument("--reviewed-manifest", required=True)
    plan_parser.add_argument("--report-output")

    apply_parser = commands.add_parser(
        "apply",
        help=(
            "Apply reviewed segment replacement transactionally; "
            "shot boundaries remain deferred."
        ),
    )
    apply_parser.add_argument("--source-document", required=True)
    apply_parser.add_argument("--reviewed-manifest", required=True)
    apply_parser.add_argument("--expected-plan-fingerprint", required=True)
    apply_parser.add_argument("--target-database-url-environment")
    apply_parser.add_argument("--report-output")

    apply_shot_boundaries_parser = commands.add_parser(
        "apply-shot-boundaries",
        help="Apply only missing shot boundaries from one exact reviewed plan.",
    )
    apply_shot_boundaries_parser.add_argument("--source-document", required=True)
    apply_shot_boundaries_parser.add_argument("--reviewed-manifest", required=True)
    apply_shot_boundaries_parser.add_argument("--expected-plan-fingerprint", required=True)
    apply_shot_boundaries_parser.add_argument("--target-database-url-environment")
    apply_shot_boundaries_parser.add_argument("--report-output")

    finalize_parser = commands.add_parser(
        "finalize-lineage",
        help="Export reconciliation and remove temporary legacy marker identities.",
    )
    finalize_parser.add_argument("--expected-plan-fingerprint", required=True)
    finalize_parser.add_argument("--target-database-url-environment")
    finalize_parser.add_argument("--report-output", required=True)
    finalize_parser.add_argument(
        "--confirm-reviewed-sign-off", action="store_true", required=True
    )
    return result


def main() -> int:
    args = parser().parse_args()
    if args.command == "extract-source":
        marker_snapshot = Path(args.marker_studio_snapshot)
        stash_sqlite = Path(args.stash_sqlite)
        validate_source_snapshot_inputs(marker_snapshot, stash_sqlite)
        marker_hash = sha256_file(marker_snapshot)
        stash_hash = sha256_file(stash_sqlite)
        database_url = database_url_from_environment(args.source_database_url_environment)
        assert database_url is not None
        raw = extract_source_from_restored_snapshot(database_url, marker_snapshot)
        if sha256_file(marker_snapshot) != marker_hash or sha256_file(stash_sqlite) != stash_hash:
            raise ValidationError("A source snapshot changed during extraction.")
        document = build_source_document(
            raw,
            stash_sqlite,
            source_instance_id=args.source_instance_id,
            marker_studio_sha256=marker_hash,
            stash_sqlite_sha256=stash_hash,
        )
        atomic_private_json(Path(args.output), document)
        print("result=" + canonical_bytes({
            "succeeded": True,
            "sourceFingerprint": replacement.source_fingerprint(document),
            "sceneCount": len(document["scenes"]),
            "tagCount": len(document["tags"]),
            "performerCount": len(document["performers"]),
            "markerCount": len(document["markers"]),
        }).decode("utf-8"))
        return 0

    if args.command == "extract-target":
        with PostgreSqlConnection(database_url_from_environment(args.target_database_url_environment)) as connection:
            connection.execute("BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY;")
            try:
                adapter = replacement.PostgreSqlReplacementTarget(connection)
                adapter.require_stable_schema()
                target = adapter.extract_target()
                replacement.validate_target(target)
                connection.execute("COMMIT;")
            except BaseException:
                connection.execute("ROLLBACK;")
                raise
        atomic_private_json(Path(args.output), replacement.normalized_target(target))
        print("result=" + canonical_bytes({
            "succeeded": True,
            "targetFingerprint": replacement.target_fingerprint(target),
            "segmentCount": target["segmentCount"],
            "stableItemCount": target["stableItemCount"],
        }).decode("utf-8"))
        return 0

    if args.command == "prepare-lineage":
        source = load_private_json(Path(args.source_document), "Source document")
        manifest = load_private_json(
            Path(args.manifest_input), "Manifest input"
        )
        prepared_source, prepared_manifest, report = prepare_lineage_source(
            source,
            manifest,
            Path(args.stash_sqlite),
            inferred_analysis_sources=set(args.infer_ai_analysis_source),
            infer_confirmed_without_analysis=(
                args.infer_confirmed_without_analysis_as_manual
            ),
            source_tag_mappings=parse_source_tag_mappings(args.map_source_tag),
            exclude_unclassified_markers=args.exclude_unclassified_markers,
            exclude_rule_tag_mismatches=args.exclude_rule_tag_mismatches,
        )
        atomic_private_json_bundle([
            (Path(args.source_output), prepared_source),
            (Path(args.manifest_output), prepared_manifest),
            (Path(args.report_output), report),
        ])
        print("result=" + canonical_bytes(report).decode("utf-8"))
        return 0

    if args.command == "finalize-lineage":
        if not args.confirm_reviewed_sign_off:
            raise ValidationError("Reviewed sign-off confirmation is required.")
        replacement.require_hash(
            args.expected_plan_fingerprint, "expectedPlanFingerprint"
        )
        with PostgreSqlConnection(
            database_url_from_environment(args.target_database_url_environment)
        ) as connection:
            target = replacement.PostgreSqlReplacementTarget(connection)
            protected_report = target.preview_legacy_identity_finalization(
                args.expected_plan_fingerprint
            )
            atomic_private_json(Path(args.report_output), protected_report)
            report = target.finalize_legacy_identity(args.expected_plan_fingerprint)
        if (
            report["reconciliationFingerprint"]
            != protected_report["reconciliationFingerprint"]
        ):
            raise ValidationError("Final reconciliation changed after protected export.")
        atomic_replace_private_json(Path(args.report_output), report)
        print("result=" + canonical_bytes(report).decode("utf-8"))
        return 0

    source = load_private_json(Path(args.source_document), "Source document")
    manifest = load_private_json(Path(args.reviewed_manifest), "Reviewed manifest")
    if args.command == "plan":
        target = load_private_json(Path(args.target_document), "Target document")
        plan = replacement.build_plan(source, target, manifest)
        report = plan.result
    elif args.command == "apply":
        with PostgreSqlConnection(database_url_from_environment(args.target_database_url_environment)) as connection:
            report = replacement.apply_reviewed_plan(
                replacement.PostgreSqlReplacementTarget(connection),
                source,
                manifest,
                args.expected_plan_fingerprint,
            )
    else:
        with PostgreSqlConnection(database_url_from_environment(args.target_database_url_environment)) as connection:
            report = replacement.apply_reviewed_shot_boundary_plan(
                replacement.PostgreSqlReplacementTarget(connection),
                source,
                manifest,
                args.expected_plan_fingerprint,
            )
    if args.report_output:
        atomic_private_json(Path(args.report_output), report)
    print("result=" + canonical_bytes(report).decode("utf-8"))
    return 0 if report["succeeded"] else 1


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ValidationError, replacement.ValidationError, OSError, ValueError, json.JSONDecodeError) as error:
        print(f"error={error}", file=sys.stderr)
        raise SystemExit(2) from None
