"""Stable-item replacement engine for ``segment-studio-marker-migration.py``.

The public command-line entry point remains the hyphenated script.  This module
contains only target planning/application so the immutable Marker Studio source
extractor can remain shared with the legacy importer.
"""

from __future__ import annotations

import copy
import hashlib
import json
import re
import uuid
from collections import Counter
from datetime import datetime, timezone
from typing import Any


SOURCE_KIND = "stash-marker-studio"
SOURCE_SCHEMA_VERSION = 3
TARGET_SCHEMA_VERSION = 2
MANIFEST_SCHEMA_VERSION = 2
PLANNER_VERSION = "segment-studio-marker-replacement-v3"
SOURCE_KEY = "ext:segment-studio:stash-marker-studio"
IMPORT_ADVISORY_LOCK_ID = 0x5345474D41524B
HEX_SHA256 = re.compile(r"[0-9a-f]{64}")
STATUS_RESIDENCE = {
    "confirmed": ("native", None),
    "unprocessed": ("extension", "unreviewed"),
    "rejected": ("extension", "rejected"),
}
LINEAGE_SOURCE_KEYS = {
    "Marker Source: Manual": "user",
    "Marker Source: Skier AI": "stash-marker-studio:skier-ai",
    "Marker Source: TPDB": "tpdb",
}
ITEM_SOURCE_KEYS = {
    "user": "segment-studio/user",
    "stash-marker-studio:skier-ai": "stash-marker-studio:skier-ai",
    "tpdb": "tpdb",
}
LINEAGE_DERIVED_LABEL = "Marker Source: Derived"


class ValidationError(RuntimeError):
    pass


def canonical_bytes(value: Any) -> bytes:
    return json.dumps(
        value, ensure_ascii=False, allow_nan=False, sort_keys=True, separators=(",", ":")
    ).encode("utf-8")


def promoted_item_source_key(
    marker: dict[str, Any], tag_name_by_id: dict[int, str]
) -> str:
    labels = {
        tag_name_by_id.get(int(tag_id))
        for tag_id in marker.get("secondaryTagLocalIds", [])
        if str(tag_name_by_id.get(int(tag_id), "")).startswith("Marker Source:")
    }
    origins = {
        LINEAGE_SOURCE_KEYS[label]
        for label in labels
        if label in LINEAGE_SOURCE_KEYS
    }
    unknown = {
        label for label in labels
        if label not in LINEAGE_SOURCE_KEYS and label != LINEAGE_DERIVED_LABEL
    }
    if len(origins) != 1 or unknown:
        return SOURCE_KEY
    return ITEM_SOURCE_KEYS[next(iter(origins))]


def sha256_json(value: Any) -> str:
    return hashlib.sha256(canonical_bytes(value)).hexdigest()


def require_hash(value: Any, field: str) -> str:
    if not isinstance(value, str) or HEX_SHA256.fullmatch(value) is None:
        raise ValidationError(f"{field} must be a lowercase SHA-256 value.")
    return value


def normalized_marker(row: dict[str, Any]) -> dict[str, Any]:
    result = copy.deepcopy(row)
    result["secondaryTagLocalIds"] = sorted(result.get("secondaryTagLocalIds", []))
    result["slotAssignments"] = sorted(
        result.get("slotAssignments", []),
        key=lambda item: canonical_bytes(item),
    )
    provenance = result.get("provenance", {})
    for key in ("workflowTags", "derivations", "analysis"):
        if isinstance(provenance.get(key), list):
            provenance[key] = sorted(provenance[key], key=canonical_bytes)
    return result


def canonical_timestamp(value: Any) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValidationError("Shot boundary timestamps are required.")
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as error:
        raise ValidationError("A shot boundary timestamp is invalid.") from error
    if parsed.tzinfo is None:
        raise ValidationError("Shot boundary timestamps must include an offset.")
    return parsed.astimezone(timezone.utc).isoformat(
        timespec="microseconds"
    ).replace("+00:00", "Z")


def normalized_shot_boundary(row: dict[str, Any]) -> dict[str, Any]:
    metadata = copy.deepcopy(row.get("metadata"))
    if (
        isinstance(metadata, dict)
        and "legacyMarkerStudioId" in metadata
        and "legacyStashMarkerStudioShotBoundaryId" not in metadata
    ):
        metadata["legacyStashMarkerStudioShotBoundaryId"] = metadata.pop(
            "legacyMarkerStudioId"
        )
    return {
        "videoId": row["videoId"],
        "startMs": row["startMs"],
        "endMs": row["endMs"],
        "source": row["source"],
        "metadata": metadata,
        "createdAt": canonical_timestamp(row.get("createdAt")),
        "updatedAt": canonical_timestamp(row.get("updatedAt")),
    }


def shot_boundary_state_fingerprint(rows: list[dict[str, Any]]) -> str:
    return sha256_json(sorted(
        (normalized_shot_boundary(row) for row in rows),
        key=lambda row: (row["videoId"], row["startMs"]),
    ))


def planned_shot_boundary_target(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "videoId": row["videoId"],
        "startMs": row["startMs"],
        "endMs": row["endMs"],
        "source": row["source"],
        "metadata": {
            "legacyStashMarkerStudioShotBoundaryId": row["sourceBoundaryId"],
            "legacyStashSceneId": row["legacySceneId"],
            "legacyMetadata": copy.deepcopy(row.get("metadata")),
        },
        "createdAt": row["createdAt"],
        "updatedAt": row["updatedAt"],
    }


def normalized_source(source: dict[str, Any]) -> dict[str, Any]:
    result = copy.deepcopy(source)
    for field in ("scenes", "tags", "performers"):
        result[field] = sorted(result.get(field, []), key=lambda row: row["localId"])
    result["markers"] = sorted(
        (normalized_marker(row) for row in result.get("markers", [])),
        key=lambda row: row["localId"],
    )
    result["shotBoundaries"] = sorted(
        copy.deepcopy(result.get("shotBoundaries", [])),
        key=lambda row: (row["sceneLocalId"], row["startMs"], row["localId"]),
    )
    result["slotDefinitionSets"] = sorted(
        result.get("slotDefinitionSets", []), key=lambda row: row["id"]
    )
    result["slotDefinitions"] = sorted(
        result.get("slotDefinitions", []), key=lambda row: row["id"]
    )
    for row in result["slotDefinitions"]:
        row["genderHints"] = sorted(row.get("genderHints", []))
    result["derivedMarkerRules"] = sorted(
        copy.deepcopy(result.get("derivedMarkerRules", [])),
        key=lambda row: row.get("id", ""),
    )
    for row in result["derivedMarkerRules"]:
        row["slotMappings"] = sorted(row.get("slotMappings", []), key=canonical_bytes)
    return result


def source_fingerprint(source: dict[str, Any]) -> str:
    return sha256_json({"plannerVersion": PLANNER_VERSION, "source": normalized_source(source)})


def normalized_target(target: dict[str, Any]) -> dict[str, Any]:
    result = copy.deepcopy(target)
    for field in ("videoIds", "tagIds", "performerIds"):
        result[field] = sorted(result.get(field, []))
    for field in ("slotDefinitionSets", "slotDefinitions", "slotGenderHints"):
        result[field] = sorted(result.get(field, []), key=canonical_bytes)
    result["shotBoundaries"] = sorted(
        (normalized_shot_boundary(row) for row in result.get("shotBoundaries", [])),
        key=lambda row: (row["videoId"], row["startMs"]),
    )
    result["priorRuns"] = sorted(result.get("priorRuns", []), key=canonical_bytes)
    return result


def normalized_manifest(manifest: dict[str, Any]) -> dict[str, Any]:
    result = copy.deepcopy(manifest)
    result["entityMappings"] = sorted(
        result.get("entityMappings", []),
        key=lambda row: (row["entityKind"], row["sourceLocalId"]),
    )
    lineage = result.get("lineage")
    if isinstance(lineage, dict):
        lineage["exclusions"] = sorted(
            lineage.get("exclusions", []), key=canonical_bytes
        )
    return result


def validate_source(source: dict[str, Any]) -> None:
    if source.get("schemaVersion") != SOURCE_SCHEMA_VERSION or source.get("sourceKind") != SOURCE_KIND:
        raise ValidationError("Unsupported Marker Studio source document.")
    if not isinstance(source.get("sourceInstanceId"), str) or not source["sourceInstanceId"]:
        raise ValidationError("sourceInstanceId is required.")
    snapshots = source.get("snapshots")
    if not isinstance(snapshots, dict):
        raise ValidationError("Source snapshot hashes are required.")
    require_hash(snapshots.get("markerStudioSha256"), "markerStudioSha256")
    require_hash(snapshots.get("stashSqliteSha256"), "stashSqliteSha256")
    entity_ids: dict[str, set[int]] = {}
    for field in ("scenes", "tags", "performers"):
        rows = source.get(field)
        if not isinstance(rows, list) or any(not isinstance(row, dict) for row in rows):
            raise ValidationError(f"{field} must be an object list.")
        ids = [row.get("localId") for row in rows]
        if any(not isinstance(value, int) or value <= 0 for value in ids) or len(ids) != len(set(ids)):
            raise ValidationError(f"{field} identities are invalid or duplicated.")
        entity_ids[field] = set(ids)
    definition_sets = source.get("slotDefinitionSets", [])
    definitions = source.get("slotDefinitions", [])
    markers = source.get("markers", [])
    shot_boundaries = source.get("shotBoundaries", [])
    if any(not isinstance(values, list) for values in (
        definition_sets, definitions, markers, shot_boundaries
    )):
        raise ValidationError("Source marker and slot collections must be lists.")
    if any(not isinstance(row, dict) for row in [
        *definition_sets, *definitions, *markers, *shot_boundaries
    ]):
        raise ValidationError("Source marker and slot collections must contain objects.")
    set_id_values = [row.get("id") for row in definition_sets]
    definition_id_values = [row.get("id") for row in definitions]
    set_ids = set(set_id_values)
    definition_ids = set(definition_id_values)
    if (
        None in set_ids or None in definition_ids
        or len(set_ids) != len(set_id_values)
        or len(definition_ids) != len(definition_id_values)
    ):
        raise ValidationError("Source slot identities are invalid or duplicated.")
    definition_orders: set[tuple[str, int]] = set()
    for row in definition_sets:
        if row.get("sourceTagLocalId") not in entity_ids["tags"]:
            raise ValidationError("A slot definition set references an unknown tag.")
        if not isinstance(row.get("allowSamePerformerInMultipleSlots"), bool):
            raise ValidationError("A slot definition set has an invalid performer reuse policy.")
    for row in definitions:
        if row.get("slotDefinitionSetId") not in set_ids:
            raise ValidationError("A slot definition references an unknown set.")
        order = row.get("sortOrder")
        order_key = (row["slotDefinitionSetId"], order)
        if not isinstance(order, int) or order < 0 or order_key in definition_orders:
            raise ValidationError("A slot definition has an invalid or duplicate order.")
        definition_orders.add(order_key)
        hints = row.get("genderHints")
        allowed_hints = {"MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"}
        if (
            not isinstance(hints, list)
            or len(hints) != len(set(hints))
            or any(hint not in allowed_hints for hint in hints)
        ):
            raise ValidationError("A slot definition has invalid gender hints.")
    marker_ids: set[int] = set()
    external_ids: set[int] = set()
    for marker in markers:
        marker_id = marker.get("localId")
        if not isinstance(marker_id, int) or marker_id <= 0 or marker_id in marker_ids:
            raise ValidationError("Marker identities are invalid or duplicated.")
        marker_ids.add(marker_id)
        external_id = marker.get("externalMarkerId")
        if external_id is not None:
            if not isinstance(external_id, int) or external_id <= 0 or external_id in external_ids:
                raise ValidationError("External marker identities are invalid or duplicated.")
            external_ids.add(external_id)
        if marker.get("sceneLocalId") not in entity_ids["scenes"]:
            raise ValidationError("A marker references an unknown scene.")
        if marker.get("primaryTagLocalId") not in entity_ids["tags"]:
            raise ValidationError("A marker references an unknown primary tag.")
        if marker.get("status") not in STATUS_RESIDENCE:
            raise ValidationError("A marker has an unsupported review state.")
        start = marker.get("startMs")
        end = marker.get("endMs")
        if not isinstance(start, int) or start < 0 or (end is not None and (not isinstance(end, int) or end < start)):
            raise ValidationError("A marker has invalid timing.")
        if not isinstance(marker.get("provenance"), dict):
            raise ValidationError("Marker provenance must be an object.")
        secondary = marker.get("secondaryTagLocalIds")
        slots = marker.get("slotAssignments")
        if (
            not isinstance(secondary, list)
            or any(not isinstance(value, int) for value in secondary)
            or len(secondary) != len(set(secondary))
        ):
            raise ValidationError("Marker secondary tags are invalid or duplicated.")
        if not isinstance(slots, list) or any(not isinstance(slot, dict) for slot in slots):
            raise ValidationError("Marker slot assignments must be an object list.")
        assigned_definitions: set[str] = set()
        for slot in slots:
            if slot.get("slotDefinitionId") not in definition_ids:
                raise ValidationError("A marker references an unknown slot definition.")
            if slot["slotDefinitionId"] in assigned_definitions:
                raise ValidationError("A marker contains duplicate slot assignments.")
            assigned_definitions.add(slot["slotDefinitionId"])
            performer = slot.get("performerLocalId")
            if performer is not None and performer not in entity_ids["performers"]:
                raise ValidationError("A marker references an unknown performer.")
    shot_boundary_ids: set[str] = set()
    shot_boundary_positions: set[tuple[int, int]] = set()
    for boundary in shot_boundaries:
        identity = boundary.get("localId")
        scene_id = boundary.get("sceneLocalId")
        start_ms = boundary.get("startMs")
        end_ms = boundary.get("endMs")
        if (
            not isinstance(identity, str) or not identity
            or identity in shot_boundary_ids
        ):
            raise ValidationError("Shot boundary identities are invalid or duplicated.")
        shot_boundary_ids.add(identity)
        if scene_id not in entity_ids["scenes"]:
            raise ValidationError("A shot boundary references an unknown scene.")
        if (
            not isinstance(start_ms, int) or start_ms < 0
            or not isinstance(end_ms, int) or end_ms <= start_ms
        ):
            raise ValidationError("A shot boundary has invalid timing.")
        position = (scene_id, start_ms)
        if position in shot_boundary_positions:
            raise ValidationError("Shot boundary positions are duplicated.")
        shot_boundary_positions.add(position)
        if boundary.get("source") not in {"manual", "pyscenedetect", "omnishotcut"}:
            raise ValidationError("A shot boundary has an unsupported source.")
        if boundary.get("metadata") is not None and not isinstance(boundary["metadata"], dict):
            raise ValidationError("Shot boundary metadata must be an object or null.")
        canonical_timestamp(boundary.get("createdAt"))
        canonical_timestamp(boundary.get("updatedAt"))
    rule_ids: set[str] = set()
    for rule in source.get("derivedMarkerRules", []):
        rule_id = rule.get("id")
        if not isinstance(rule_id, str) or not rule_id or rule_id in rule_ids:
            raise ValidationError("Derived marker rule identities are invalid or duplicated.")
        rule_ids.add(rule_id)
        if rule.get("relationshipType") != "implies":
            raise ValidationError(
                "Derived marker rules must use the executable implies relationship."
            )
        source_tag = rule.get("sourceTagLocalId")
        derived_tag = rule.get("derivedTagLocalId")
        if (
            source_tag not in entity_ids["tags"]
            or derived_tag not in entity_ids["tags"]
            or source_tag == derived_tag
        ):
            raise ValidationError("A derived marker rule has invalid tag endpoints.")
        mappings = rule.get("slotMappings", [])
        if not isinstance(mappings, list) or any(
            not isinstance(mapping, dict)
            or mapping.get("sourceSlotDefinitionId") not in definition_ids
            or mapping.get("derivedSlotDefinitionId") not in definition_ids
            for mapping in mappings
        ):
            raise ValidationError("A derived marker rule has invalid slot mappings.")


def validate_target(target: dict[str, Any]) -> None:
    if target.get("schemaVersion") != TARGET_SCHEMA_VERSION:
        raise ValidationError("The target is not Segment Studio's stable-item schema.")
    for field in ("videoIds", "tagIds", "performerIds"):
        values = target.get(field)
        if not isinstance(values, list) or len(values) != len(set(values)):
            raise ValidationError(f"Target {field} are invalid.")
    if target.get("receiptIntegrity", {}).get("orphanReceiptCount", 0) != 0:
        raise ValidationError("Target marker replacement receipts are corrupt.")
    if target.get("receiptIntegrity", {}).get("orphanProvenanceCount", 0) != 0:
        raise ValidationError("Target marker replacement provenance is corrupt.")
    shot_boundaries = target.get("shotBoundaries", [])
    if not isinstance(shot_boundaries, list) or any(
        not isinstance(row, dict) for row in shot_boundaries
    ):
        raise ValidationError("Target shot boundaries must be an object list.")
    positions: set[tuple[int, int]] = set()
    for boundary in shot_boundaries:
        position = (boundary.get("videoId"), boundary.get("startMs"))
        if (
            position[0] not in set(target["videoIds"])
            or not isinstance(position[1], int) or position[1] < 0
            or not isinstance(boundary.get("endMs"), int)
            or boundary["endMs"] <= position[1]
            or boundary.get("source") not in {"manual", "pyscenedetect", "omnishotcut"}
            or position in positions
        ):
            raise ValidationError("Target shot boundaries are invalid or duplicated.")
        canonical_timestamp(boundary.get("createdAt"))
        canonical_timestamp(boundary.get("updatedAt"))
        positions.add(position)


def validate_manifest(
    source: dict[str, Any], target: dict[str, Any], manifest: dict[str, Any]
) -> dict[tuple[str, int], int]:
    if manifest.get("schemaVersion") != MANIFEST_SCHEMA_VERSION:
        raise ValidationError("Unsupported reviewed manifest schema version.")
    if manifest.get("sourceFingerprint") != source_fingerprint(source):
        raise ValidationError("The reviewed manifest does not match the source snapshot.")
    if manifest.get("reviewedTargetFingerprint") != target_fingerprint(target):
        raise ValidationError("The reviewed manifest does not match the target snapshot.")
    mappings: dict[tuple[str, int], int] = {}
    canonical = {
        "scene": set(target["videoIds"]),
        "tag": set(target["tagIds"]),
        "performer": set(target["performerIds"]),
    }
    source_rows = {
        "scene": {row["localId"]: row for row in source["scenes"]},
        "tag": {row["localId"]: row for row in source["tags"]},
        "performer": {row["localId"]: row for row in source["performers"]},
    }
    for row in manifest.get("entityMappings", []):
        kind = row.get("entityKind")
        local_id = row.get("sourceLocalId")
        canonical_id = row.get("canonicalId")
        if kind not in canonical or local_id not in source_rows[kind]:
            raise ValidationError("The reviewed manifest contains an unknown source entity.")
        if canonical_id not in canonical[kind]:
            raise ValidationError("The reviewed manifest contains a missing Cove entity.")
        key = (kind, local_id)
        if key in mappings:
            raise ValidationError("The reviewed manifest contains duplicate mappings.")
        mappings[key] = canonical_id
    required: set[tuple[str, int]] = set()
    for marker in source["markers"]:
        required.add(("scene", marker["sceneLocalId"]))
        required.add(("tag", marker["primaryTagLocalId"]))
        required.update(("tag", value) for value in marker.get("secondaryTagLocalIds", []))
        required.update(
            ("performer", slot["performerLocalId"])
            for slot in marker.get("slotAssignments", [])
            if slot.get("performerLocalId") is not None
        )
    required.update(
        ("scene", boundary["sceneLocalId"])
        for boundary in source.get("shotBoundaries", [])
    )
    required.update(
        ("tag", row["sourceTagLocalId"]) for row in source.get("slotDefinitionSets", [])
    )
    for rule in source.get("derivedMarkerRules", []):
        required.add(("tag", rule["sourceTagLocalId"]))
        required.add(("tag", rule["derivedTagLocalId"]))
    missing = required - set(mappings)
    if missing:
        raise ValidationError(f"The reviewed manifest is missing {len(missing)} required entity mappings.")
    return mappings


def target_fingerprint(target: dict[str, Any]) -> str:
    return sha256_json({"schemaVersion": TARGET_SCHEMA_VERSION, "target": normalized_target(target)})


class ReplacementPlan:
    def __init__(self) -> None:
        self.result: dict[str, Any] = {}
        self.items: list[dict[str, Any]] = []
        self.slots: list[dict[str, Any]] = []
        self.definition_sets: list[dict[str, Any]] = []
        self.definitions: list[dict[str, Any]] = []
        self.gender_hints: list[dict[str, Any]] = []
        self.shot_boundaries: list[dict[str, Any]] = []
        self.lineage_activities: list[dict[str, Any]] = []
        self.lineage_rules: list[dict[str, Any]] = []
        self.lineage_assertions: list[dict[str, Any]] = []
        self.lineage_edges: list[dict[str, Any]] = []
        self.lineage_discrepancies: list[dict[str, Any]] = []
        self.lineage_report: dict[str, Any] = {}


def _lineage_uuid(kind: str, *values: Any) -> str:
    return str(uuid.uuid5(
        uuid.NAMESPACE_URL,
        ":".join([PLANNER_VERSION, kind, *(str(value) for value in values)]),
    ))


def _lineage_cycle(edges: list[tuple[int, int]], marker_ids: set[int]) -> bool:
    outgoing: dict[int, list[int]] = {identity: [] for identity in marker_ids}
    indegree = {identity: 0 for identity in marker_ids}
    for source, derived in edges:
        outgoing[source].append(derived)
        indegree[derived] += 1
    queue = sorted(identity for identity, degree in indegree.items() if degree == 0)
    visited = 0
    while queue:
        current = queue.pop()
        visited += 1
        for derived in outgoing[current]:
            indegree[derived] -= 1
            if indegree[derived] == 0:
                queue.append(derived)
    return visited != len(marker_ids)


def _lineage_component_sizes(
    edges: list[tuple[int, int]], marker_ids: set[int]
) -> list[int]:
    neighbors = {identity: set() for identity in marker_ids}
    for source, derived in edges:
        neighbors[source].add(derived)
        neighbors[derived].add(source)
    remaining = set(marker_ids)
    sizes = []
    while remaining:
        pending = [remaining.pop()]
        size = 0
        while pending:
            current = pending.pop()
            size += 1
            for neighbor in neighbors[current]:
                if neighbor in remaining:
                    remaining.remove(neighbor)
                    pending.append(neighbor)
        sizes.append(size)
    return sorted(sizes, reverse=True)


def _build_lineage_plan(
    plan: ReplacementPlan,
    source: dict[str, Any],
    mappings: dict[tuple[str, int], int],
    manifest: dict[str, Any],
    conflicts: Counter[str],
) -> None:
    configuration = manifest.get("lineage")
    if not isinstance(configuration, dict) or configuration.get("enabled") is not True:
        return
    exclusions = configuration.get("exclusions", [])
    if not isinstance(exclusions, list) or any(not isinstance(row, dict) for row in exclusions):
        raise ValidationError("Lineage exclusions must be an object list.")
    marker_by_id = {int(row["localId"]): row for row in source["markers"]}
    tag_name_by_id = {
        int(row["localId"]): row.get("name")
        for row in source["tags"]
    }
    used_exclusions: set[str] = set()
    exclusion_by_key: dict[str, dict[str, Any]] = {}
    for row in exclusions:
        kind = row.get("kind")
        if kind == "marker":
            marker_id = row.get("sourceMarkerId")
            marker = marker_by_id.get(marker_id)
            key = f"marker:{marker_id}"
            if (
                marker is None
                or row.get("sourceMarkerFingerprint") != sha256_json(normalized_marker(marker))
            ):
                raise ValidationError("A reviewed marker exclusion has drifted.")
        elif kind == "edge":
            occurrence = row.get("occurrence")
            if not isinstance(occurrence, int) or occurrence < 0:
                raise ValidationError("A reviewed edge exclusion occurrence is invalid.")
            key = (
                f"edge:{row.get('sourceMarkerId')}:{row.get('derivedMarkerId')}:"
                f"{row.get('ruleId')}:{occurrence}"
            )
            expected = sha256_json({
                "sourceMarkerId": row.get("sourceMarkerId"),
                "derivedMarkerId": row.get("derivedMarkerId"),
                "ruleId": row.get("ruleId"),
                "depth": row.get("depth"),
                "occurrence": occurrence,
            })
            if row.get("edgeFingerprint") != expected:
                raise ValidationError("A reviewed edge exclusion has drifted.")
        else:
            raise ValidationError("A lineage exclusion kind is invalid.")
        if key in exclusion_by_key or not str(row.get("reason", "")).strip():
            raise ValidationError("Lineage exclusions must be unique and include a reason.")
        exclusion_by_key[key] = row

    def discrepancy(code: str, subject: str, *, fatal: bool, **evidence: Any) -> None:
        plan.lineage_discrepancies.append({
            "code": code, "subject": subject, "fatal": fatal, **evidence,
        })
        if fatal:
            conflicts[code] += 1

    legacy_rule_by_id = {
        str(row["id"]): row for row in source.get("derivedMarkerRules", [])
    }
    matching_edge_counts: Counter[str] = Counter()
    for derived in source["markers"]:
        for edge in derived.get("provenance", {}).get("derivations", []):
            rule_id = str(edge.get("ruleId", "")).strip()
            legacy_rule = legacy_rule_by_id.get(rule_id)
            source_marker = marker_by_id.get(edge.get("sourceMarkerId"))
            if (
                legacy_rule is not None
                and source_marker is not None
                and int(source_marker["primaryTagLocalId"])
                    == int(legacy_rule["sourceTagLocalId"])
                and int(derived["primaryTagLocalId"])
                    == int(legacy_rule["derivedTagLocalId"])
            ):
                matching_edge_counts[rule_id] += 1

    candidates_by_relationship: dict[tuple[int, int], list[dict[str, Any]]] = {}
    for legacy_rule in legacy_rule_by_id.values():
        rule_id = str(legacy_rule["id"])
        source_tag = mappings[("tag", int(legacy_rule["sourceTagLocalId"]))]
        derived_tag = mappings[("tag", int(legacy_rule["derivedTagLocalId"]))]
        rule_identity = (rule_id, source_tag, derived_tag)
        rule_metadata = {
            "relationshipType": legacy_rule["relationshipType"],
            "sortOrder": legacy_rule["sortOrder"],
            "slotMappings": legacy_rule.get("slotMappings", []),
        }
        candidates_by_relationship.setdefault((source_tag, derived_tag), []).append({
            "id": _lineage_uuid("rule", source["sourceInstanceId"], *rule_identity),
            "key": f"stash-marker-studio:{rule_id}",
            "version": f"legacy:{sha256_json(rule_metadata)[:16]}",
            "sourceTagId": source_tag,
            "derivedTagId": derived_tag,
            "metadata": rule_metadata,
            "_legacyRuleId": rule_id,
            "_matchingEdgeCount": matching_edge_counts[rule_id],
            "_updatedAt": str(legacy_rule.get("updatedAt") or ""),
            "_createdAt": str(legacy_rule.get("createdAt") or ""),
        })

    selected_rule_by_legacy_id: dict[str, dict[str, Any]] = {}
    discarded_rule_ids: set[str] = set()
    selected_rules: list[dict[str, Any]] = []
    for relationship, candidates in sorted(candidates_by_relationship.items()):
        winner = max(candidates, key=lambda row: (
            row["_matchingEdgeCount"],
            row["_updatedAt"],
            row["_createdAt"],
            row["id"],
        ))
        selected_rule_by_legacy_id[winner["_legacyRuleId"]] = winner
        selected_rules.append(winner)
        for candidate in candidates:
            if candidate is winner:
                continue
            discarded_rule_ids.add(candidate["_legacyRuleId"])
            discrepancy(
                "duplicate-rule-relationship",
                f"rule:{candidate['_legacyRuleId']}",
                fatal=False,
                selectedRuleId=winner["_legacyRuleId"],
                sourceTagId=relationship[0],
                derivedTagId=relationship[1],
            )

    rule_graph = [
        (rule["sourceTagId"], rule["derivedTagId"])
        for rule in selected_rules
    ]
    rule_tags = {tag_id for edge in rule_graph for tag_id in edge}
    if _lineage_cycle(rule_graph, rule_tags):
        discrepancy("rule-cycle", "rule-catalog", fatal=True)

    incoming: Counter[int] = Counter()
    graph: list[tuple[int, int]] = []
    seen: set[tuple[int, int, str]] = set()
    reported_missing_rules: set[tuple[str, int, int]] = set()
    for derived in sorted(source["markers"], key=lambda row: int(row["localId"])):
        derived_id = int(derived["localId"])
        derivations = derived.get("provenance", {}).get("derivations", [])
        if not isinstance(derivations, list):
            raise ValidationError("Marker derivations must be a list.")
        occurrences: Counter[tuple[Any, str]] = Counter()
        for edge in sorted(derivations, key=canonical_bytes):
            source_id = edge.get("sourceMarkerId")
            rule_id = str(edge.get("ruleId", "")).strip()
            occurrence_key = (source_id, rule_id)
            occurrence = occurrences[occurrence_key]
            occurrences[occurrence_key] += 1
            subject = f"edge:{source_id}:{derived_id}:{rule_id}:{occurrence}"
            if subject in exclusion_by_key:
                used_exclusions.add(subject)
                discrepancy("reviewed-edge-exclusion", subject, fatal=False)
                continue
            source_marker = marker_by_id.get(source_id)
            if source_marker is None:
                discrepancy("missing-endpoint", subject, fatal=True)
                continue
            identity = (int(source_id), derived_id, rule_id)
            if identity in seen:
                discrepancy("duplicate-edge", subject, fatal=False)
                continue
            seen.add(identity)
            if int(source_id) == derived_id:
                discrepancy("self-edge", subject, fatal=True)
                continue
            source_video = mappings[("scene", int(source_marker["sceneLocalId"]))]
            derived_video = mappings[("scene", int(derived["sceneLocalId"]))]
            if source_video != derived_video:
                discrepancy("cross-video-edge", subject, fatal=True)
                continue
            source_tag = mappings[("tag", int(source_marker["primaryTagLocalId"]))]
            derived_tag = mappings[("tag", int(derived["primaryTagLocalId"]))]
            if source_tag == derived_tag:
                discrepancy("same-tag-edge", subject, fatal=True)
                continue
            legacy_rule = legacy_rule_by_id.get(rule_id)
            if legacy_rule is None:
                missing_identity = (rule_id, source_tag, derived_tag)
                if missing_identity not in reported_missing_rules:
                    reported_missing_rules.add(missing_identity)
                    discrepancy(
                        "missing-rule",
                        f"rule:{rule_id}:{sha256_json(missing_identity)[:12]}",
                        fatal=False,
                    )
                continue
            if rule_id in discarded_rule_ids:
                discrepancy(
                    "discarded-duplicate-rule-edge",
                    subject,
                    fatal=False,
                )
                continue
            expected_source_tag = mappings[
                ("tag", int(legacy_rule["sourceTagLocalId"]))
            ]
            expected_derived_tag = mappings[
                ("tag", int(legacy_rule["derivedTagLocalId"]))
            ]
            if (
                expected_source_tag != source_tag
                or expected_derived_tag != derived_tag
            ):
                discrepancy("rule-tag-mismatch", subject, fatal=True)
                continue
            rule = selected_rule_by_legacy_id[rule_id]
            incoming[derived_id] += 1
            graph.append((int(source_id), derived_id))
            plan.lineage_edges.append({
                "sourceCreateToken": f'{source["sourceInstanceId"]}:{source_id}',
                "derivedCreateToken": f'{source["sourceInstanceId"]}:{derived_id}',
                "ruleId": rule["id"],
                "ruleVersionAtCreation": rule["version"],
                "sourceTagIdAtCreation": source_tag,
                "derivedTagIdAtCreation": derived_tag,
                "recordedAt": edge.get("createdAt"),
                "metadata": {"legacyDepth": edge.get("depth")},
            })
    if _lineage_cycle(graph, set(marker_by_id)):
        discrepancy("cycle", "graph", fatal=True)

    combinations: Counter[tuple[str, ...]] = Counter()
    excluded_markers: set[int] = set()
    direct_source_by_marker: dict[int, str] = {}
    for marker_id, marker in sorted(marker_by_id.items()):
        subject = f"marker:{marker_id}"
        labels = sorted({
            tag_name_by_id.get(int(tag_id))
            for tag_id in marker.get("secondaryTagLocalIds", [])
            if str(tag_name_by_id.get(int(tag_id), "")).startswith("Marker Source:")
        })
        combinations[tuple(labels)] += 1
        if subject in exclusion_by_key:
            used_exclusions.add(subject)
            excluded_markers.add(marker_id)
            discrepancy("reviewed-marker-exclusion", subject, fatal=False)
            continue
        origins = [LINEAGE_SOURCE_KEYS[label] for label in labels if label in LINEAGE_SOURCE_KEYS]
        unknown = [
            label for label in labels
            if label not in LINEAGE_SOURCE_KEYS and label != LINEAGE_DERIVED_LABEL
        ]
        if unknown:
            discrepancy("unrecognized-source-tag", subject, fatal=True, labels=unknown)
        if not origins:
            discrepancy("missing-source-tag", subject, fatal=True)
            continue
        if len(origins) != 1:
            discrepancy("conflicting-source-tags", subject, fatal=True, sourceKeys=origins)
            continue
        tagged_derived = LINEAGE_DERIVED_LABEL in labels
        if tagged_derived != bool(incoming[marker_id]):
            discrepancy(
                "derived-tag-without-incoming-edge"
                if tagged_derived else "incoming-edge-without-derived-tag",
                subject,
                fatal=False,
            )
        source_key = origins[0]
        direct_source_by_marker[marker_id] = source_key

    propagated_sources = {
        marker_id: ({source_key} if source_key is not None else set())
        for marker_id in marker_by_id
        for source_key in [direct_source_by_marker.get(marker_id)]
    }
    ancestor_sources = {marker_id: set() for marker_id in marker_by_id}
    outgoing: dict[int, list[int]] = {marker_id: [] for marker_id in marker_by_id}
    indegree = {marker_id: 0 for marker_id in marker_by_id}
    for source_id, derived_id in graph:
        outgoing[source_id].append(derived_id)
        indegree[derived_id] += 1
    pending = sorted(
        (marker_id for marker_id, degree in indegree.items() if degree == 0),
        reverse=True,
    )
    while pending:
        source_id = pending.pop()
        for derived_id in outgoing[source_id]:
            propagated_sources[derived_id].update(propagated_sources[source_id])
            ancestor_sources[derived_id].update(ancestor_sources[source_id])
            if source_id in direct_source_by_marker:
                ancestor_sources[derived_id].add(direct_source_by_marker[source_id])
            indegree[derived_id] -= 1
            if indegree[derived_id] == 0:
                pending.append(derived_id)
    for marker_id in sorted(marker_by_id):
        if marker_id in excluded_markers:
            continue
        if (
            incoming[marker_id]
            and marker_id in direct_source_by_marker
            and direct_source_by_marker[marker_id] not in ancestor_sources[marker_id]
        ):
            discrepancy(
                "derived-source-not-in-ancestors",
                f"marker:{marker_id}",
                fatal=False,
                sourceKey=direct_source_by_marker[marker_id],
            )
        for source_key in sorted(propagated_sources[marker_id]):
            source_label = next(
                label for label, key in LINEAGE_SOURCE_KEYS.items() if key == source_key
            )
            plan.lineage_assertions.append({
                "createToken": f'{source["sourceInstanceId"]}:{marker_id}',
                "sourceKey": source_key,
                "relation": "inherited" if incoming[marker_id] else "origin",
                "activityId": _lineage_uuid("activity", source["sourceInstanceId"], source_key),
                "metadata": {"sourceLabel": source_label},
            })

    unused = set(exclusion_by_key) - used_exclusions
    if unused:
        discrepancy("unused-reviewed-exclusion", "manifest", fatal=True, count=len(unused))
    source_keys = sorted({row["sourceKey"] for row in plan.lineage_assertions})
    reviewed_manifest_hash = sha256_json(normalized_manifest(manifest))
    plan.lineage_activities = [{
        "id": _lineage_uuid("activity", source["sourceInstanceId"], source_key),
        "key": (
            f"sms-migration:{source_fingerprint(source)[:12]}:"
            f"{reviewed_manifest_hash[:12]}:"
            f"{source_key}"
        ),
        "kind": "migration",
        "sourceKey": source_key,
        "metadata": {"plannerVersion": PLANNER_VERSION},
    } for source_key in source_keys]
    plan.lineage_rules = sorted(
        ({
            key: value
            for key, value in rule.items()
            if not key.startswith("_")
        } for rule in selected_rules),
        key=lambda row: row["key"],
    )
    plan.lineage_assertions.sort(key=lambda row: (row["createToken"], row["sourceKey"]))
    plan.lineage_edges.sort(key=lambda row: (
        row["sourceCreateToken"], row["derivedCreateToken"], row["ruleId"]
    ))
    plan.lineage_discrepancies.sort(key=lambda row: (row["code"], row["subject"]))
    assertion_counts = Counter(
        (row["sourceKey"], row["relation"]) for row in plan.lineage_assertions
    )
    plan.lineage_report = {
        "enabled": True,
        "sourceCombinations": [
            {"labels": list(labels), "count": count}
            for labels, count in sorted(combinations.items())
        ],
        "assertionCounts": [
            {"sourceKey": key[0], "relation": key[1], "count": count}
            for key, count in sorted(assertion_counts.items())
        ],
        "inputEdgeCount": sum(
            len(row.get("provenance", {}).get("derivations", []))
            for row in source["markers"]
        ),
        "configuredRuleCount": len(legacy_rule_by_id),
        "plannedRuleCount": len(plan.lineage_rules),
        "discardedDuplicateRuleCount": len(discarded_rule_ids),
        "plannedEdgeCount": len(plan.lineage_edges),
        "derivedTagCount": sum(
            LINEAGE_DERIVED_LABEL in labels
            for labels in combinations
            for _ in range(combinations[labels])
        ),
        "incomingTargetCount": len(incoming),
        "derivedTagCountDiscrepancy": (
            sum(
                count
                for labels, count in combinations.items()
                if LINEAGE_DERIVED_LABEL in labels
            )
            - len(incoming)
        ),
        "componentSizes": _lineage_component_sizes(graph, set(marker_by_id)),
        "largestComponentSize": max(
            _lineage_component_sizes(graph, set(marker_by_id)), default=0
        ),
        "reviewedExclusionCount": len(used_exclusions),
        "migrationOnlyRecordCount": len(used_exclusions),
        "discrepancyCounts": dict(sorted(Counter(
            row["code"] for row in plan.lineage_discrepancies
        ).items())),
    }


def build_plan(
    source: dict[str, Any], target: dict[str, Any], manifest: dict[str, Any]
) -> ReplacementPlan:
    validate_source(source)
    validate_target(target)
    mappings = validate_manifest(source, target, manifest)
    source_hash = source_fingerprint(source)
    manifest_hash = sha256_json(normalized_manifest(manifest))
    plan = ReplacementPlan()
    target_sets = {row["id"]: row for row in target.get("slotDefinitionSets", [])}
    target_sets_by_tag = {row["tagId"]: row for row in target.get("slotDefinitionSets", [])}
    target_definitions = {row["id"]: row for row in target.get("slotDefinitions", [])}
    target_definitions_by_order = {
        (row["slotDefinitionSetId"], row["sortOrder"]): row
        for row in target.get("slotDefinitions", [])
    }
    target_hints = {
        (row["slotDefinitionId"], row["genderHint"])
        for row in target.get("slotGenderHints", [])
    }
    conflicts: Counter[str] = Counter()
    existing_shot_boundaries = {
        (row["videoId"], row["startMs"]): row
        for row in target.get("shotBoundaries", [])
    }
    for boundary in source.get("shotBoundaries", []):
        planned = {
            "sourceBoundaryId": boundary["localId"],
            "legacySceneId": boundary["sceneLocalId"],
            "videoId": mappings[("scene", boundary["sceneLocalId"])],
            "startMs": boundary["startMs"],
            "endMs": boundary["endMs"],
            "source": boundary["source"],
            "metadata": boundary.get("metadata"),
            "createdAt": boundary.get("createdAt"),
            "updatedAt": boundary.get("updatedAt"),
        }
        existing = existing_shot_boundaries.get(
            (planned["videoId"], planned["startMs"])
        )
        expected = planned_shot_boundary_target(planned)
        if existing is None:
            plan.shot_boundaries.append(planned)
        elif normalized_shot_boundary(existing) != normalized_shot_boundary(expected):
            conflicts["shot-boundary-conflict"] += 1
    for row in source.get("slotDefinitionSets", []):
        expected = {
            "id": row["id"],
            "tagId": mappings[("tag", row["sourceTagLocalId"])],
            "allowSamePerformerInMultipleSlots": row["allowSamePerformerInMultipleSlots"],
        }
        existing = target_sets.get(row["id"])
        if existing is not None and existing != expected:
            conflicts["slot-definition-set-conflict"] += 1
        elif existing is None and expected["tagId"] in target_sets_by_tag:
            conflicts["slot-definition-set-tag-conflict"] += 1
        elif existing is None:
            plan.definition_sets.append(expected)
    for row in source.get("slotDefinitions", []):
        expected = {
            "id": row["id"],
            "slotDefinitionSetId": row["slotDefinitionSetId"],
            "label": row.get("label"),
            "sortOrder": row["sortOrder"],
        }
        existing = target_definitions.get(row["id"])
        order_key = (row["slotDefinitionSetId"], row["sortOrder"])
        if existing is not None and existing != expected:
            conflicts["slot-definition-conflict"] += 1
        elif existing is None and order_key in target_definitions_by_order:
            conflicts["slot-definition-order-conflict"] += 1
        elif existing is None:
            plan.definitions.append(expected)
            for hint in row.get("genderHints", []):
                plan.gender_hints.append({"slotDefinitionId": row["id"], "genderHint": hint})
        elif {hint for identity, hint in target_hints if identity == row["id"]} != set(row.get("genderHints", [])):
            conflicts["slot-definition-gender-hint-conflict"] += 1
    states: Counter[str] = Counter()
    empty_slots = 0
    source_tag_local_ids = {
        int(row["localId"])
        for row in source["tags"]
        if str(row.get("name", "")).startswith("Marker Source:")
    }
    lineage_enabled = (
        isinstance(manifest.get("lineage"), dict)
        and manifest["lineage"].get("enabled") is True
    )
    tag_name_by_id = {
        int(row["localId"]): str(row.get("name", ""))
        for row in source["tags"]
    }
    for marker in sorted(source["markers"], key=lambda row: row["localId"]):
        residence, review_state = STATUS_RESIDENCE[marker["status"]]
        states[marker["status"]] += 1
        token = f'{source["sourceInstanceId"]}:{marker["localId"]}'
        secondary = sorted({
            mappings[("tag", source_tag)]
            for source_tag in marker.get("secondaryTagLocalIds", [])
            if not lineage_enabled or source_tag not in source_tag_local_ids
        })
        metadata = {
            "externalMarkerId": marker.get("externalMarkerId"),
            "sourceStatus": marker["status"],
            "secondaryTagLocalIds": sorted(marker.get("secondaryTagLocalIds", [])),
            "slotAssignments": sorted(marker.get("slotAssignments", []), key=canonical_bytes),
            "provenance": marker["provenance"],
        }
        plan.items.append({
            "createToken": token,
            "sourceMarkerId": marker["localId"],
            "sourceMarkerFingerprint": sha256_json(normalized_marker(marker)),
            "residence": residence,
            "reviewState": review_state,
            "videoId": mappings[("scene", marker["sceneLocalId"])],
            "tagId": mappings[("tag", marker["primaryTagLocalId"])],
            "startMs": marker["startMs"],
            "endMs": marker.get("endMs"),
            "refId": marker.get("externalMarkerId"),
            "secondaryTagIds": secondary,
            "sourceKey": promoted_item_source_key(marker, tag_name_by_id)
            if lineage_enabled else SOURCE_KEY,
            "sourceRunId": source_hash,
            "metadata": metadata,
        })
        for slot in marker.get("slotAssignments", []):
            performer = slot.get("performerLocalId")
            if performer is None:
                empty_slots += 1
                continue
            plan.slots.append({
                "createToken": token,
                "slotDefinitionId": slot["slotDefinitionId"],
                "performerId": mappings[("performer", performer)],
            })
    _build_lineage_plan(plan, source, mappings, manifest, conflicts)
    derived_tokens = {
        edge["derivedCreateToken"]
        for edge in plan.lineage_edges
    }
    for item in plan.items:
        if item["createToken"] not in derived_tokens:
            continue
        item["residence"] = "extension"
        if item["reviewState"] is None:
            item["reviewState"] = "approved"
    issues = [
        {"code": code, "count": count, "fatal": True}
        for code, count in sorted(conflicts.items())
    ]
    fingerprint_payload = {
        "plannerVersion": PLANNER_VERSION,
        "sourceFingerprint": source_hash,
        "targetFingerprint": target_fingerprint(target),
        "manifestFingerprint": manifest_hash,
        "items": plan.items,
        "slots": plan.slots,
        "definitionSets": plan.definition_sets,
        "definitions": plan.definitions,
        "genderHints": plan.gender_hints,
        "shotBoundaries": plan.shot_boundaries,
        "lineageActivities": plan.lineage_activities,
        "lineageRules": plan.lineage_rules,
        "lineageAssertions": plan.lineage_assertions,
        "lineageEdges": plan.lineage_edges,
        "lineageDiscrepancies": plan.lineage_discrepancies,
        "lineageReport": plan.lineage_report,
        "issues": issues,
    }
    planned_shot_boundary_state = [
        *target.get("shotBoundaries", []),
        *(planned_shot_boundary_target(row) for row in plan.shot_boundaries),
    ]
    plan.result = {
        "succeeded": not conflicts,
        "sourceFingerprint": source_hash,
        "targetFingerprint": target_fingerprint(target),
        "manifestFingerprint": manifest_hash,
        "planFingerprint": sha256_json(fingerprint_payload),
        "sourceMarkerCount": len(plan.items),
        "plannedNativeCount": sum(
            item["residence"] == "native" for item in plan.items
        ),
        "plannedOwnedApprovedCount": sum(
            item["residence"] == "extension" and item["reviewState"] == "approved"
            for item in plan.items
        ),
        "plannedOwnedUnreviewedCount": sum(
            item["residence"] == "extension" and item["reviewState"] == "unreviewed"
            for item in plan.items
        ),
        "plannedOwnedRejectedCount": sum(
            item["residence"] == "extension" and item["reviewState"] == "rejected"
            for item in plan.items
        ),
        "plannedStableItemCount": len(plan.items),
        "plannedSlotAssignmentCount": len(plan.slots),
        "sourceShotBoundaryCount": len(source.get("shotBoundaries", [])),
        "plannedShotBoundaryInsertCount": len(plan.shot_boundaries),
        "plannedShotBoundaryCount": (
            target.get("shotBoundaryCount", len(target.get("shotBoundaries", [])))
            + len(plan.shot_boundaries)
        ),
        "plannedShotBoundaryFingerprint": shot_boundary_state_fingerprint(
            planned_shot_boundary_state
        ),
        "preservedEmptySlotCount": empty_slots,
        "plannedLineageNodeCount": len(plan.items) if plan.lineage_report else 0,
        "plannedProvenanceAssertionCount": len(plan.lineage_assertions),
        "plannedDerivationEdgeCount": len(plan.lineage_edges),
        "lineageReport": plan.lineage_report,
        "lineageDiscrepancies": plan.lineage_discrepancies,
        "existingSegmentDeleteCount": target.get("segmentCount", 0),
        "existingStableItemDeleteCount": target.get("stableItemCount", 0),
        "existingWorkspaceDeleteCount": target.get("workspaceCount", 0),
        "existingLineageStateFingerprint": target.get("lineageStateFingerprint"),
        "existingLineageStateCounts": target.get("lineageStateCounts", {}),
        "issues": issues,
    }
    return plan


RECEIPT_SCHEMA_SQL = r"""
CREATE TABLE IF NOT EXISTS segment_studio_marker_replacement_runs (
    plan_fingerprint CHAR(64) PRIMARY KEY,
    source_instance_id TEXT NOT NULL,
    source_fingerprint CHAR(64) NOT NULL,
    manifest_fingerprint CHAR(64) NOT NULL,
    result JSONB NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CK_segment_studio_marker_replacement_runs_hashes"
        CHECK (plan_fingerprint ~ '^[0-9a-f]{64}$'
           AND source_fingerprint ~ '^[0-9a-f]{64}$'
           AND manifest_fingerprint ~ '^[0-9a-f]{64}$'),
    CONSTRAINT "CK_segment_studio_marker_replacement_runs_source"
        CHECK (length(btrim(source_instance_id)) > 0),
    CONSTRAINT "CK_segment_studio_marker_replacement_runs_result"
        CHECK (jsonb_typeof(result) = 'object')
);
CREATE TABLE IF NOT EXISTS segment_studio_marker_replacement_receipts (
    source_instance_id TEXT NOT NULL,
    source_marker_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL REFERENCES segment_studio_items(id) ON DELETE CASCADE,
    native_segment_id INTEGER NULL REFERENCES segments("Id") ON DELETE CASCADE,
    source_marker_fingerprint CHAR(64) NOT NULL,
    source_status VARCHAR(32) NOT NULL,
    metadata JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (source_instance_id, source_marker_id),
    UNIQUE (item_id),
    CONSTRAINT "CK_segment_studio_marker_replacement_receipts_source"
        CHECK (length(btrim(source_instance_id)) > 0 AND source_marker_id > 0),
    CONSTRAINT "CK_segment_studio_marker_replacement_receipts_hash"
        CHECK (source_marker_fingerprint ~ '^[0-9a-f]{64}$'),
    CONSTRAINT "CK_segment_studio_marker_replacement_receipts_status"
        CHECK (source_status IN ('confirmed', 'unprocessed', 'rejected')),
    CONSTRAINT "CK_segment_studio_marker_replacement_receipts_residence"
        CHECK (native_segment_id IS NULL OR source_status = 'confirmed'),
    CONSTRAINT "CK_segment_studio_marker_replacement_receipts_metadata"
        CHECK (jsonb_typeof(metadata) = 'object')
);
ALTER TABLE segment_studio_marker_replacement_receipts
    DROP CONSTRAINT IF EXISTS "CK_segment_studio_marker_replacement_receipts_residence";
ALTER TABLE segment_studio_marker_replacement_receipts
    ADD CONSTRAINT "CK_segment_studio_marker_replacement_receipts_residence"
    CHECK (native_segment_id IS NULL OR source_status = 'confirmed');
"""


def target_sql(include_receipts: bool, include_workspaces: bool = True) -> str:
    orphan_receipts = """(SELECT count(*) FROM segment_studio_marker_replacement_receipts r
        LEFT JOIN segment_studio_items i ON i.id = r.item_id WHERE i.id IS NULL)""" if include_receipts else "0"
    prior_runs = """COALESCE((SELECT jsonb_agg(jsonb_build_object(
        'planFingerprint', plan_fingerprint, 'sourceInstanceId', source_instance_id,
        'sourceFingerprint', source_fingerprint, 'manifestFingerprint', manifest_fingerprint,
        'result', result) ORDER BY applied_at)
        FROM segment_studio_marker_replacement_runs), '[]'::jsonb)""" if include_receipts else "'[]'::jsonb"
    workspace_count = (
        "(SELECT count(*) FROM segment_studio_workspaces)"
        if include_workspaces else "0"
    )
    return rf"""
SELECT jsonb_build_object(
    'schemaVersion', {TARGET_SCHEMA_VERSION},
    'videoIds', COALESCE((SELECT jsonb_agg("Id" ORDER BY "Id") FROM videos), '[]'::jsonb),
    'tagIds', COALESCE((SELECT jsonb_agg("Id" ORDER BY "Id") FROM tags), '[]'::jsonb),
    'performerIds', COALESCE((SELECT jsonb_agg("Id" ORDER BY "Id") FROM performers), '[]'::jsonb),
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
    'shotBoundaryCount', (SELECT count(*) FROM segment_studio_shot_boundaries),
    'shotBoundaries', COALESCE((SELECT jsonb_agg(jsonb_build_object(
        'id', id,
        'videoId', video_id,
        'startMs', round(start_sec * 1000)::bigint,
        'endMs', round(end_sec * 1000)::bigint,
        'source', source,
        'metadata', metadata,
        'createdAt', created_at,
        'updatedAt', updated_at
    ) ORDER BY video_id, start_sec, id)
        FROM segment_studio_shot_boundaries), '[]'::jsonb),
    'segmentCount', (SELECT count(*) FROM segments),
    'stableItemCount', (SELECT count(*) FROM segment_studio_items),
    'workspaceCount', {workspace_count},
    'lineageStateFingerprint', md5(jsonb_build_object(
        'sources', COALESCE((SELECT jsonb_agg(to_jsonb(row) ORDER BY id)
            FROM segment_studio_sources row), '[]'::jsonb),
        'activities', COALESCE((SELECT jsonb_agg(to_jsonb(row) ORDER BY id)
            FROM segment_studio_provenance_activities row), '[]'::jsonb),
        'nodes', COALESCE((SELECT jsonb_agg(to_jsonb(row) ORDER BY id)
            FROM segment_studio_lineage_nodes row), '[]'::jsonb),
        'assertions', COALESCE((SELECT jsonb_agg(to_jsonb(row) ORDER BY id)
            FROM segment_studio_segment_provenance row), '[]'::jsonb),
        'rules', COALESCE((SELECT jsonb_agg(to_jsonb(row) ORDER BY id)
            FROM segment_studio_derivation_rules row), '[]'::jsonb),
        'edges', COALESCE((SELECT jsonb_agg(to_jsonb(row) ORDER BY id)
            FROM segment_studio_derivation_edges row), '[]'::jsonb),
        'issues', COALESCE((SELECT jsonb_agg(to_jsonb(row) ORDER BY id)
            FROM segment_studio_lineage_issues row), '[]'::jsonb),
        'scanRuns', COALESCE((SELECT jsonb_agg(to_jsonb(row) ORDER BY id)
            FROM segment_studio_lineage_scan_runs row), '[]'::jsonb),
        'operationReceipts', COALESCE((SELECT jsonb_agg(to_jsonb(row)
            ORDER BY operation_id) FROM segment_studio_segment_operations row),
            '[]'::jsonb)
    )::text),
    'lineageStateCounts', jsonb_build_object(
        'sources', (SELECT count(*) FROM segment_studio_sources),
        'activities', (SELECT count(*) FROM segment_studio_provenance_activities),
        'nodes', (SELECT count(*) FROM segment_studio_lineage_nodes),
        'assertions', (SELECT count(*) FROM segment_studio_segment_provenance),
        'rules', (SELECT count(*) FROM segment_studio_derivation_rules),
        'edges', (SELECT count(*) FROM segment_studio_derivation_edges),
        'issues', (SELECT count(*) FROM segment_studio_lineage_issues),
        'scanRuns', (SELECT count(*) FROM segment_studio_lineage_scan_runs),
        'operationReceipts', (SELECT count(*) FROM segment_studio_segment_operations)
    ),
    'receiptIntegrity', jsonb_build_object(
        'orphanReceiptCount', {orphan_receipts},
        'orphanProvenanceCount', 0),
    'priorRuns', {prior_runs}
)::text;
"""


class PostgreSqlReplacementTarget:
    def __init__(self, connection: Any):
        self.connection = connection

    def begin_serializable(self) -> None:
        self.connection.execute("BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;")

    def acquire_lock(self) -> None:
        self.connection.execute(f"SELECT pg_advisory_xact_lock({IMPORT_ADVISORY_LOCK_ID});", tuples=True)

    def require_stable_schema(self) -> None:
        missing = self.connection.execute(
            r"""
            WITH required(table_name, column_name) AS (VALUES
                ('segments', 'Id'),
                ('segments', 'ImageBlobId'),
                ('segment_studio_items', 'id'),
                ('segment_studio_items', 'native_segment_id'),
                ('segment_studio_items', 'review_state'),
                ('segment_studio_items', 'payload'),
                ('segment_studio_segment_slots', 'item_id'),
                ('segment_studio_segment_slots', 'slot_definition_id'),
                ('segment_studio_segment_slots', 'performer_id'),
                ('segment_studio_slot_definition_sets', 'id'),
                ('segment_studio_slot_definitions', 'id'),
                ('segment_studio_slot_definition_gender_hints', 'slot_definition_id'),
                ('segment_studio_shot_boundaries', 'id'),
                ('segment_studio_shot_boundaries', 'video_id'),
                ('segment_studio_shot_boundaries', 'start_sec'),
                ('segment_studio_shot_boundaries', 'end_sec'),
                ('segment_studio_shot_boundaries', 'source'),
                ('segment_studio_shot_boundaries', 'metadata'),
                ('segment_studio_shot_boundaries', 'revision'),
                ('segment_studio_shot_boundaries', 'created_at'),
                ('segment_studio_shot_boundaries', 'updated_at'),
                ('segment_studio_installation_state', 'requires_legacy_normalization'),
                ('segment_studio_blob_cleanup_outbox', 'blob_id'),
                ('segment_studio_sources', 'id'),
                ('segment_studio_provenance_activities', 'id'),
                ('segment_studio_lineage_nodes', 'id'),
                ('segment_studio_segment_provenance', 'id'),
                ('segment_studio_derivation_rules', 'id'),
                ('segment_studio_derivation_rules', 'key'),
                ('segment_studio_derivation_rules', 'version'),
                ('segment_studio_derivation_rules', 'source_tag_id'),
                ('segment_studio_derivation_rules', 'derived_tag_id'),
                ('segment_studio_derivation_rules', 'metadata'),
                ('segment_studio_derivation_edges', 'id'),
                ('segment_studio_derivation_edges', 'rule_version_at_creation'),
                ('segment_studio_lineage_issues', 'id'),
                ('segment_studio_lineage_scan_runs', 'id'),
                ('segment_studio_segment_operations', 'operation_id'),
                ('segment_studio_slot_import_runs', 'plan_fingerprint')
            )
            SELECT count(*)
            FROM required
            LEFT JOIN information_schema.columns actual
              ON actual.table_schema=current_schema()
             AND actual.table_name=required.table_name
             AND actual.column_name=required.column_name
            WHERE actual.column_name IS NULL;
            """,
            tuples=True,
        )
        if missing != [["0"]]:
            raise ValidationError("Segment Studio's complete stable-item schema is required.")
        relationship_index = self.connection.execute(
            r"""
            SELECT count(*)
            FROM pg_indexes
            WHERE schemaname=current_schema()
              AND tablename='segment_studio_derivation_rules'
              AND indexname='IX_segment_studio_derivation_rules_relationship'
              AND indexdef LIKE 'CREATE UNIQUE INDEX%';
            """,
            tuples=True,
        )
        if relationship_index != [["1"]]:
            raise ValidationError(
                "Segment Studio's unique derivation relationship schema is required."
            )

    def ensure_schema(self) -> None:
        self.require_stable_schema()
        self.connection.execute(RECEIPT_SCHEMA_SQL)

    def extract_target(self) -> dict[str, Any]:
        self.require_stable_schema()
        receipts = self.connection.execute(
            "SELECT to_regclass('segment_studio_marker_replacement_receipts') IS NOT NULL;",
            tuples=True,
        )
        workspaces = self.connection.execute(
            "SELECT to_regclass('segment_studio_workspaces') IS NOT NULL;",
            tuples=True,
        )
        return self.connection.json_object(target_sql(
            receipts == [["t"]], workspaces == [["t"]]
        ))

    def write_shot_boundaries(self, rows: list[dict[str, Any]]) -> None:
        self.connection.execute(r"""
            WITH rows AS (SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                "sourceBoundaryId" text, "legacySceneId" integer, "videoId" integer,
                "startMs" bigint, "endMs" bigint, source text, metadata jsonb,
                "createdAt" timestamptz, "updatedAt" timestamptz))
            INSERT INTO segment_studio_shot_boundaries
                (video_id, start_sec, end_sec, source, metadata, revision,
                 created_at, updated_at)
            SELECT "videoId", "startMs"/1000.0, "endMs"/1000.0, source,
                jsonb_build_object(
                    'legacyStashMarkerStudioShotBoundaryId', "sourceBoundaryId",
                    'legacyStashSceneId', "legacySceneId",
                    'legacyMetadata', metadata),
                0, COALESCE("createdAt", CURRENT_TIMESTAMP),
                COALESCE("updatedAt", CURRENT_TIMESTAMP)
            FROM rows;
        """, [canonical_bytes(rows).decode()])

    def write_plan(self, plan: ReplacementPlan, source: dict[str, Any]) -> None:
        self.connection.execute(r"""
            INSERT INTO segment_studio_blob_cleanup_outbox
                (blob_id, status, attempt_count, created_at, updated_at)
            SELECT "ImageBlobId", 'pending', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            FROM segments WHERE "ImageBlobId" IS NOT NULL
            ON CONFLICT (blob_id) DO UPDATE SET status='pending', attempt_count=0,
                last_error=NULL, updated_at=CURRENT_TIMESTAMP;

            DELETE FROM user_entity_affinities WHERE "HostType" = 11;
            DELETE FROM user_bookmarks WHERE "HostType" = 11;
            DELETE FROM interactions WHERE "HostType" = 6;
            DELETE FROM playback_sessions WHERE "HostType" = 6;
            DELETE FROM ratings WHERE "HostType" = 4;
            DELETE FROM field_provenance WHERE "HostType" = 11;
            DELETE FROM tag_applications WHERE "HostType" = 11;
            DELETE FROM custom_field_values WHERE lower("EntityType") = 'segment';
            DELETE FROM group_items WHERE "Kind" = 12 OR lower("HostType") = 'segment';

            DELETE FROM segment_studio_lineage_issues;
            DELETE FROM segment_studio_lineage_scan_runs;
            DELETE FROM segment_studio_derivation_edges;
            DELETE FROM segment_studio_segment_provenance;
            DELETE FROM segment_studio_lineage_nodes;
            DELETE FROM segment_studio_provenance_activities;
            DELETE FROM segment_studio_derivation_rules;
            DELETE FROM segment_studio_workspace_markers;
            DELETE FROM segment_studio_workspaces;
            DELETE FROM segment_studio_sources;
            DELETE FROM segment_studio_segment_operations;
            DELETE FROM segment_studio_slot_import_runs;
            DO $cleanup$
            BEGIN
                IF to_regclass('segment_studio_marker_migration_provenance') IS NOT NULL THEN
                    EXECUTE 'DELETE FROM segment_studio_marker_migration_provenance';
                END IF;
                IF to_regclass('segment_studio_marker_migration_receipts') IS NOT NULL THEN
                    EXECUTE 'DELETE FROM segment_studio_marker_migration_receipts';
                END IF;
                IF to_regclass('segment_studio_marker_migration_baselines') IS NOT NULL THEN
                    EXECUTE 'DELETE FROM segment_studio_marker_migration_baselines';
                END IF;
                IF to_regclass('segment_studio_marker_migration_runs') IS NOT NULL THEN
                    EXECUTE 'DELETE FROM segment_studio_marker_migration_runs';
                END IF;
            END
            $cleanup$;
            DELETE FROM segment_studio_marker_replacement_receipts;
            DELETE FROM segment_studio_marker_replacement_runs;
            DELETE FROM segment_studio_incorrect_examples;
            DELETE FROM segment_studio_analysis_candidates;
            DELETE FROM segment_studio_items;
            DELETE FROM segments;

            INSERT INTO segment_studio_sources
                (key, display_name, category, provider, metadata, created_at, updated_at)
            VALUES
                ('user', 'User', 'manual', 'Cove', '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
                ('stash-marker-studio:manual', 'Stash Marker Studio Manual', 'manual',
                    'Stash Marker Studio', '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
                ('stash-marker-studio:skier-ai', 'Skier AI via Stash Marker Studio', 'ai',
                    'Stash Marker Studio', '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
                ('tpdb', 'The Porn Database', 'external', 'TPDB', '{}'::jsonb,
                    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
                ('ext:ai.tagging', 'Cove AI Tagging', 'ai', 'Cove', '{}'::jsonb,
                    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        """)
        self.connection.execute(r"""
            WITH rows AS (SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                id uuid, "tagId" integer, "allowSamePerformerInMultipleSlots" boolean))
            INSERT INTO segment_studio_slot_definition_sets
                (id, tag_id, allow_same_performer_in_multiple_slots)
            SELECT id, "tagId", "allowSamePerformerInMultipleSlots" FROM rows;
        """, [canonical_bytes(plan.definition_sets).decode()])
        self.connection.execute(r"""
            WITH rows AS (SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                id uuid, "slotDefinitionSetId" uuid, label text, "sortOrder" integer))
            INSERT INTO segment_studio_slot_definitions
                (id, slot_definition_set_id, label, sort_order)
            SELECT id, "slotDefinitionSetId", label, "sortOrder" FROM rows;
        """, [canonical_bytes(plan.definitions).decode()])
        self.connection.execute(r"""
            WITH rows AS (SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                "slotDefinitionId" uuid, "genderHint" text))
            INSERT INTO segment_studio_slot_definition_gender_hints
                (slot_definition_id, gender_hint)
            SELECT "slotDefinitionId", "genderHint" FROM rows;
        """, [canonical_bytes(plan.gender_hints).decode()])
        self.write_shot_boundaries(plan.shot_boundaries)
        self.connection.execute(r"""
            CREATE TEMP TABLE segment_studio_replacement_created (
                create_token TEXT PRIMARY KEY, item_id BIGINT NOT NULL,
                native_segment_id INTEGER NULL) ON COMMIT DROP;
        """)

        self.connection.execute(r"""
            WITH rows AS (SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                "createToken" text, "sourceMarkerId" bigint, residence text,
                "reviewState" text, "videoId" integer, "tagId" integer,
                "startMs" bigint, "endMs" bigint, "refId" bigint,
                "secondaryTagIds" jsonb, "sourceKey" text, "sourceRunId" text,
                "sourceMarkerFingerprint" text, metadata jsonb))
            INSERT INTO segment_studio_replacement_created
                (create_token, item_id, native_segment_id)
            SELECT row."createToken",
                nextval(pg_get_serial_sequence('segment_studio_items', 'id')),
                CASE WHEN row.residence='native'
                    THEN nextval(pg_get_serial_sequence('segments', 'Id'))::integer ELSE NULL END
            FROM rows row ORDER BY row."createToken";
        """, [canonical_bytes(plan.items).decode()])
        self.connection.execute(r"""
            WITH rows AS (SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                "createToken" text, residence text, "videoId" integer, "tagId" integer,
                "startMs" bigint, "endMs" bigint, "refId" bigint,
                "secondaryTagIds" jsonb, "sourceKey" text, "sourceRunId" text))
            INSERT INTO segments ("Id", "HostType", "HostId", "StartSec", "EndSec", "TagId",
                "Kind", "RefId", "Payload", "SourceKey", "SourceRunId", "CreatedAt", "UpdatedAt")
            OVERRIDING SYSTEM VALUE
            SELECT created.native_segment_id, 1, row."videoId", row."startMs"/1000.0,
                CASE WHEN row."endMs" IS NULL THEN NULL ELSE row."endMs"/1000.0 END,
                row."tagId", 'tag', row."refId",
                jsonb_build_object('secondaryTagIds', row."secondaryTagIds"),
                row."sourceKey", row."sourceRunId", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            FROM rows row JOIN segment_studio_replacement_created created
              ON created.create_token=row."createToken"
            WHERE row.residence='native';
        """, [canonical_bytes(plan.items).decode()])
        self.connection.execute(r"""
            WITH rows AS (SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                "createToken" text, residence text, "reviewState" text,
                "videoId" integer, "tagId" integer, "startMs" bigint, "endMs" bigint,
                "refId" bigint, "secondaryTagIds" jsonb,
                "sourceKey" text, "sourceRunId" text))
            INSERT INTO segment_studio_items (
                id, native_segment_id, review_state, representation_schema_version,
                video_id, start_sec, end_sec, tag_id, kind, ref_id, payload,
                source_key, source_run_id, revision, created_at, updated_at)
            OVERRIDING SYSTEM VALUE
            SELECT created.item_id, created.native_segment_id,
                CASE WHEN row.residence='extension' THEN row."reviewState" ELSE NULL END,
                1,
                CASE WHEN row.residence='extension' THEN row."videoId" ELSE NULL END,
                CASE WHEN row.residence='extension' THEN row."startMs"/1000.0 ELSE NULL END,
                CASE WHEN row.residence='extension' AND row."endMs" IS NOT NULL
                    THEN row."endMs"/1000.0 ELSE NULL END,
                CASE WHEN row.residence='extension' THEN row."tagId" ELSE NULL END,
                CASE WHEN row.residence='extension' THEN 'tag' ELSE NULL END,
                CASE WHEN row.residence='extension' THEN row."refId" ELSE NULL END,
                CASE WHEN row.residence='extension'
                    THEN jsonb_build_object('secondaryTagIds', row."secondaryTagIds") ELSE NULL END,
                CASE WHEN row.residence='extension' THEN row."sourceKey" ELSE NULL END,
                CASE WHEN row.residence='extension' THEN row."sourceRunId" ELSE NULL END,
                0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            FROM rows row JOIN segment_studio_replacement_created created
              ON created.create_token=row."createToken";
        """, [canonical_bytes(plan.items).decode()])
        self.connection.execute(r"""
            WITH rows AS (SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                "createToken" text, "videoId" integer, "tagId" integer,
                "startMs" bigint, "endMs" bigint))
            INSERT INTO segment_studio_lineage_nodes (
                id, item_id, state, last_known_video_id, last_known_tag_id,
                last_known_start_sec, last_known_end_sec, missing_since,
                created_at, updated_at)
            SELECT gen_random_uuid(), created.item_id, 'live', row."videoId", row."tagId",
                row."startMs"/1000.0,
                CASE WHEN row."endMs" IS NULL THEN NULL ELSE row."endMs"/1000.0 END,
                NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            FROM rows row JOIN segment_studio_replacement_created created
              ON created.create_token=row."createToken";
        """, [canonical_bytes(plan.items if plan.lineage_report else []).decode()])
        self.connection.execute(r"""
            WITH rows AS (SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                id uuid, key text, kind text, "sourceKey" text, metadata jsonb))
            INSERT INTO segment_studio_provenance_activities (
                id, key, kind, source_id, metadata, created_at, updated_at)
            SELECT row.id, row.key, row.kind, source.id, row.metadata,
                CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            FROM rows row JOIN segment_studio_sources source ON source.key=row."sourceKey";
        """, [canonical_bytes(plan.lineage_activities).decode()])
        self.connection.execute(r"""
            WITH rows AS (SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                id uuid, key text, version text, "sourceTagId" integer,
                "derivedTagId" integer, metadata jsonb))
            INSERT INTO segment_studio_derivation_rules (
                id, key, version, source_tag_id, derived_tag_id, metadata,
                created_at, updated_at)
            SELECT id, key, version, "sourceTagId", "derivedTagId",
                metadata, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM rows;
        """, [canonical_bytes(plan.lineage_rules).decode()])
        self.connection.execute(r"""
            WITH rows AS (SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                "createToken" text, "sourceKey" text, relation text,
                "activityId" uuid, metadata jsonb))
            INSERT INTO segment_studio_segment_provenance (
                lineage_node_id, source_id, relation, activity_id, metadata,
                created_at, updated_at)
            SELECT node.id, source.id, row.relation, row."activityId", row.metadata,
                CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            FROM rows row
            JOIN segment_studio_replacement_created created
              ON created.create_token=row."createToken"
            JOIN segment_studio_lineage_nodes node ON node.item_id=created.item_id
            JOIN segment_studio_sources source ON source.key=row."sourceKey";
        """, [canonical_bytes(plan.lineage_assertions).decode()])
        self.connection.execute(r"""
            WITH rows AS (SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                "sourceCreateToken" text, "derivedCreateToken" text, "ruleId" uuid,
                "ruleVersionAtCreation" text, "sourceTagIdAtCreation" integer,
                "derivedTagIdAtCreation" integer, "recordedAt" timestamptz,
                metadata jsonb))
            INSERT INTO segment_studio_derivation_edges (
                source_node_id, derived_node_id, rule_id, rule_version_at_creation,
                source_tag_id_at_creation, derived_tag_id_at_creation, recorded_at, metadata,
                created_at, updated_at)
            SELECT source_node.id, derived_node.id, row."ruleId",
                row."ruleVersionAtCreation", row."sourceTagIdAtCreation",
                row."derivedTagIdAtCreation", row."recordedAt", row.metadata,
                CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            FROM rows row
            JOIN segment_studio_replacement_created source_created
              ON source_created.create_token=row."sourceCreateToken"
            JOIN segment_studio_replacement_created derived_created
              ON derived_created.create_token=row."derivedCreateToken"
            JOIN segment_studio_lineage_nodes source_node
              ON source_node.item_id=source_created.item_id
            JOIN segment_studio_lineage_nodes derived_node
              ON derived_node.item_id=derived_created.item_id;
        """, [canonical_bytes(plan.lineage_edges).decode()])
        self.connection.execute(r"""
            WITH rows AS (SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                "createToken" text, "slotDefinitionId" uuid, "performerId" integer))
            INSERT INTO segment_studio_segment_slots
                (item_id, slot_definition_id, performer_id, created_at)
            SELECT created.item_id, row."slotDefinitionId", row."performerId", CURRENT_TIMESTAMP
            FROM rows row JOIN segment_studio_replacement_created created
              ON created.create_token=row."createToken";
        """, [canonical_bytes(plan.slots).decode()])
        self.connection.execute(r"""
            WITH rows AS (SELECT * FROM jsonb_to_recordset($1::jsonb) AS row(
                "createToken" text, "sourceMarkerId" bigint,
                "sourceMarkerFingerprint" text, "reviewState" text, metadata jsonb))
            INSERT INTO segment_studio_marker_replacement_receipts
                (source_instance_id, source_marker_id, item_id, native_segment_id,
                 source_marker_fingerprint, source_status, metadata)
            SELECT $2, row."sourceMarkerId", created.item_id, created.native_segment_id,
                row."sourceMarkerFingerprint",
                row.metadata ->> 'sourceStatus',
                row.metadata
            FROM rows row JOIN segment_studio_replacement_created created
              ON created.create_token=row."createToken";
        """, [canonical_bytes(plan.items).decode(), source["sourceInstanceId"]])
        self.connection.execute(r"""
            UPDATE segment_studio_installation_state
            SET requires_legacy_normalization=FALSE, updated_at=CURRENT_TIMESTAMP WHERE id=1;
        """)

    def record_run(self, plan: ReplacementPlan, result: dict[str, Any], source: dict[str, Any]) -> None:
        self.connection.execute(r"""
            INSERT INTO segment_studio_marker_replacement_runs
                (plan_fingerprint, source_instance_id, source_fingerprint,
                 manifest_fingerprint, result)
            VALUES ($1, $2, $3, $4, $5::jsonb);
        """, [
            plan.result["planFingerprint"],
            source["sourceInstanceId"],
            plan.result["sourceFingerprint"],
            plan.result["manifestFingerprint"],
            canonical_bytes(result).decode(),
        ])

    def verify(self, plan: ReplacementPlan | None = None) -> dict[str, Any]:
        result = self.connection.json_object(r"""
            SELECT jsonb_build_object(
                'nativeCount', (SELECT count(*) FROM segments),
                'itemCount', (SELECT count(*) FROM segment_studio_items),
                'ownedApprovedCount', (SELECT count(*) FROM segment_studio_items
                    WHERE native_segment_id IS NULL AND review_state='approved'),
                'ownedUnreviewedCount', (SELECT count(*) FROM segment_studio_items
                    WHERE native_segment_id IS NULL AND review_state='unreviewed'),
                'ownedRejectedCount', (SELECT count(*) FROM segment_studio_items
                    WHERE native_segment_id IS NULL AND review_state='rejected'),
                'slotCount', (SELECT count(*) FROM segment_studio_segment_slots),
                'shotBoundaryCount', (SELECT count(*) FROM segment_studio_shot_boundaries),
                'shotBoundaryState', COALESCE((SELECT jsonb_agg(
                    jsonb_build_object(
                        'videoId', video_id,
                        'startMs', round(start_sec * 1000)::bigint,
                        'endMs', round(end_sec * 1000)::bigint,
                        'source', source,
                        'metadata', metadata,
                        'createdAt', created_at,
                        'updatedAt', updated_at)
                    ORDER BY video_id, start_sec, id)
                    FROM segment_studio_shot_boundaries), '[]'::jsonb),
                'receiptCount', (SELECT count(*) FROM segment_studio_marker_replacement_receipts),
                'lineageNodeCount', (SELECT count(*) FROM segment_studio_lineage_nodes),
                'provenanceAssertionCount',
                    (SELECT count(*) FROM segment_studio_segment_provenance),
                'derivationEdgeCount', (SELECT count(*) FROM segment_studio_derivation_edges),
                'invalidLineageEdgeCount', (SELECT count(*)
                    FROM segment_studio_derivation_edges edge
                    JOIN segment_studio_lineage_nodes source_node
                      ON source_node.id=edge.source_node_id
                    JOIN segment_studio_lineage_nodes derived_node
                      ON derived_node.id=edge.derived_node_id
                    JOIN segment_studio_items derived_item
                      ON derived_item.id=derived_node.item_id
                    JOIN segment_studio_derivation_rules rule ON rule.id=edge.rule_id
                    WHERE source_node.last_known_video_id <> derived_node.last_known_video_id
                       OR edge.source_node_id=edge.derived_node_id
                       OR derived_item.native_segment_id IS NOT NULL
                       OR edge.source_tag_id_at_creation <> rule.source_tag_id
                       OR edge.derived_tag_id_at_creation <> rule.derived_tag_id
                       OR edge.rule_version_at_creation <> rule.version),
                'lineageFingerprint', md5(jsonb_build_object(
                    'activities', COALESCE((SELECT jsonb_agg(jsonb_build_object(
                        'key', activity.key, 'kind', activity.kind,
                        'sourceKey', source.key,
                        'externalRunId', activity.external_run_id,
                        'status', activity.status, 'startedAt', activity.started_at,
                        'completedAt', activity.completed_at,
                        'request', activity.request, 'models', activity.models,
                        'summary', activity.summary, 'metadata', activity.metadata)
                        ORDER BY activity.key)
                        FROM segment_studio_provenance_activities activity
                        JOIN segment_studio_sources source ON source.id=activity.source_id),
                        '[]'::jsonb),
                    'nodes', COALESCE((SELECT jsonb_agg(jsonb_build_object(
                        'itemId', item_id, 'state', state,
                        'videoId', last_known_video_id, 'tagId', last_known_tag_id,
                        'startSec', last_known_start_sec, 'endSec', last_known_end_sec)
                        ORDER BY item_id)
                        FROM segment_studio_lineage_nodes), '[]'::jsonb),
                    'assertions', COALESCE((SELECT jsonb_agg(jsonb_build_object(
                        'itemId', node.item_id, 'sourceKey', source.key,
                        'relation', assertion.relation, 'activityKey', activity.key,
                        'modelKey', assertion.model_key,
                        'modelIdentifier', assertion.model_identifier,
                        'modelVersion', assertion.model_version,
                        'confidence', assertion.confidence,
                        'recordedAt', assertion.recorded_at,
                        'metadata', assertion.metadata)
                        ORDER BY node.item_id, source.key, assertion.relation, assertion.id)
                        FROM segment_studio_segment_provenance assertion
                        JOIN segment_studio_lineage_nodes node
                          ON node.id=assertion.lineage_node_id
                        JOIN segment_studio_sources source ON source.id=assertion.source_id
                        LEFT JOIN segment_studio_provenance_activities activity
                          ON activity.id=assertion.activity_id), '[]'::jsonb),
                    'rules', COALESCE((SELECT jsonb_agg(jsonb_build_object(
                        'key', key, 'version', version, 'sourceTagId', source_tag_id,
                        'derivedTagId', derived_tag_id,
                        'metadata', metadata) ORDER BY key, version, source_tag_id, derived_tag_id)
                        FROM segment_studio_derivation_rules), '[]'::jsonb),
                    'edges', COALESCE((SELECT jsonb_agg(jsonb_build_object(
                        'sourceItemId', source_node.item_id,
                        'derivedItemId', derived_node.item_id,
                        'ruleKey', rule.key, 'ruleVersion', edge.rule_version_at_creation,
                        'sourceTagId', edge.source_tag_id_at_creation,
                        'derivedTagId', edge.derived_tag_id_at_creation,
                        'recordedAt', edge.recorded_at, 'metadata', edge.metadata)
                        ORDER BY source_node.item_id, derived_node.item_id, rule.key)
                        FROM segment_studio_derivation_edges edge
                        JOIN segment_studio_lineage_nodes source_node
                          ON source_node.id=edge.source_node_id
                        JOIN segment_studio_lineage_nodes derived_node
                          ON derived_node.id=edge.derived_node_id
                        JOIN segment_studio_derivation_rules rule ON rule.id=edge.rule_id),
                        '[]'::jsonb)
                )::text),
                'normalizationReady', COALESCE((SELECT NOT requires_legacy_normalization
                    FROM segment_studio_installation_state WHERE id=1), FALSE),
                'stateFingerprint', md5(jsonb_build_object(
                    'markers', COALESCE((SELECT jsonb_agg(jsonb_build_object(
                        'sourceInstanceId', receipt.source_instance_id,
                        'sourceMarkerId', receipt.source_marker_id,
                        'sourceMarkerFingerprint', receipt.source_marker_fingerprint,
                        'sourceStatus', receipt.source_status,
                        'metadata', receipt.metadata,
                        'itemId', item.id,
                        'nativeSegmentId', receipt.native_segment_id,
                        'item', jsonb_build_object(
                            'nativeSegmentId', item.native_segment_id,
                            'reviewState', item.review_state,
                            'representationSchemaVersion', item.representation_schema_version,
                            'videoId', item.video_id,
                            'startSec', item.start_sec,
                            'endSec', item.end_sec,
                            'tagId', item.tag_id,
                            'kind', item.kind,
                            'refId', item.ref_id,
                            'payload', item.payload,
                            'sourceKey', item.source_key,
                            'sourceRunId', item.source_run_id,
                            'revision', item.revision),
                        'nativeSegment', CASE WHEN segment."Id" IS NULL THEN NULL
                            ELSE jsonb_build_object(
                                'id', segment."Id",
                                'hostType', segment."HostType",
                                'hostId', segment."HostId",
                                'startSec', segment."StartSec",
                                'endSec', segment."EndSec",
                                'tagId', segment."TagId",
                                'kind', segment."Kind",
                                'refId', segment."RefId",
                                'payload', segment."Payload",
                                'sourceKey', segment."SourceKey",
                                'sourceRunId', segment."SourceRunId") END
                    ) ORDER BY receipt.source_instance_id, receipt.source_marker_id)
                    FROM segment_studio_marker_replacement_receipts receipt
                    JOIN segment_studio_items item ON item.id=receipt.item_id
                    LEFT JOIN segments segment ON segment."Id"=receipt.native_segment_id),
                    '[]'::jsonb),
                    'slots', COALESCE((SELECT jsonb_agg(jsonb_build_object(
                        'sourceMarkerId', receipt.source_marker_id,
                        'slotDefinitionId', slot.slot_definition_id,
                        'performerId', slot.performer_id)
                        ORDER BY receipt.source_instance_id, receipt.source_marker_id,
                            slot.slot_definition_id)
                    FROM segment_studio_segment_slots slot
                    JOIN segment_studio_marker_replacement_receipts receipt
                      ON receipt.item_id=slot.item_id), '[]'::jsonb),
                    'slotDefinitionSets', COALESCE((SELECT jsonb_agg(jsonb_build_object(
                        'id', id,
                        'tagId', tag_id,
                        'allowSamePerformerInMultipleSlots',
                            allow_same_performer_in_multiple_slots)
                        ORDER BY id)
                    FROM segment_studio_slot_definition_sets), '[]'::jsonb),
                    'slotDefinitions', COALESCE((SELECT jsonb_agg(jsonb_build_object(
                        'id', id,
                        'slotDefinitionSetId', slot_definition_set_id,
                        'label', label,
                        'sortOrder', sort_order)
                        ORDER BY id)
                    FROM segment_studio_slot_definitions), '[]'::jsonb),
                    'slotGenderHints', COALESCE((SELECT jsonb_agg(jsonb_build_object(
                        'slotDefinitionId', slot_definition_id,
                        'genderHint', gender_hint)
                        ORDER BY slot_definition_id, gender_hint)
                    FROM segment_studio_slot_definition_gender_hints), '[]'::jsonb),
                    'requiresLegacyNormalization', (SELECT requires_legacy_normalization
                        FROM segment_studio_installation_state WHERE id=1)
                )::text)
            )::text;
        """)
        result["shotBoundaryFingerprint"] = shot_boundary_state_fingerprint(
            result.pop("shotBoundaryState")
        )
        return result

    def commit(self) -> None:
        self.connection.execute("COMMIT;")

    def rollback(self) -> None:
        self.connection.execute("ROLLBACK;")

    def finalize_legacy_identity(
        self, expected_plan_fingerprint: str
    ) -> dict[str, Any]:
        self.begin_serializable()
        try:
            self.acquire_lock()
            reconciliation = self._legacy_identity_reconciliation(
                expected_plan_fingerprint
            )
            receipt_count = reconciliation["receiptCount"]
            self.connection.execute(r"""
                DROP TABLE segment_studio_marker_replacement_receipts;
                DROP TABLE segment_studio_marker_replacement_runs;
                DROP TABLE IF EXISTS segment_studio_marker_migration_provenance;
                DROP TABLE IF EXISTS segment_studio_marker_migration_receipts;
                DROP TABLE IF EXISTS segment_studio_marker_migration_baselines;
                DROP TABLE IF EXISTS segment_studio_marker_migration_runs;
                DROP TABLE IF EXISTS segment_studio_marker_provenance;
                ALTER TABLE IF EXISTS segment_studio_workspace_markers
                    DROP COLUMN IF EXISTS legacy_marker_id;
            """)
            self.connection.execute(r"""
                DO $proof$
                DECLARE
                    candidate record;
                    matched bigint;
                BEGIN
                    FOR candidate IN
                        SELECT table_name, column_name
                        FROM information_schema.columns
                        WHERE table_schema=current_schema()
                          AND table_name LIKE 'segment_studio_%'
                          AND data_type IN ('json', 'jsonb')
                    LOOP
                        EXECUTE format(
                            'SELECT count(*) FROM %I WHERE %I::text ~* $1',
                            candidate.table_name, candidate.column_name)
                        INTO matched
                        USING '"(legacy_?marker_?id|source_?marker_?id|derived_?marker_?id)"';
                        IF matched <> 0 THEN
                            RAISE EXCEPTION 'legacy marker identity remains in %.%',
                                candidate.table_name, candidate.column_name;
                        END IF;
                    END LOOP;
                    SELECT count(*) INTO matched
                    FROM segments
                    WHERE "Payload" -> 'segmentStudio' IS NOT NULL
                      AND ("Payload" -> 'segmentStudio')::text
                        ~* '"(legacy_?marker_?id|source_?marker_?id|derived_?marker_?id)"';
                    IF matched <> 0 THEN
                        RAISE EXCEPTION
                            'legacy marker identity remains in segments segmentStudio payload';
                    END IF;
                END
                $proof$;
            """)
            remaining = self.connection.execute(r"""
                SELECT count(*) FROM information_schema.columns
                WHERE table_schema=current_schema()
                  AND table_name LIKE 'segment_studio_%'
                  AND column_name IN (
                      'legacy_marker_id', 'source_marker_id', 'derived_marker_id');
            """, tuples=True)
            if remaining != [["0"]]:
                raise ValidationError(
                    "Legacy marker identity remains in live Segment Studio data."
                )
            self.commit()
            return {
                **reconciliation,
                "deletedReceiptCount": receipt_count,
                "legacyIdentityRemainingCount": 0,
                "reconciliationFingerprint": sha256_json(reconciliation),
            }
        except BaseException:
            self.rollback()
            raise

    def preview_legacy_identity_finalization(
        self, expected_plan_fingerprint: str
    ) -> dict[str, Any]:
        self.begin_serializable()
        try:
            self.acquire_lock()
            reconciliation = self._legacy_identity_reconciliation(
                expected_plan_fingerprint
            )
            self.commit()
            return {
                **reconciliation,
                "reconciliationFingerprint": sha256_json(reconciliation),
                "cleanupPending": True,
            }
        except BaseException:
            self.rollback()
            raise

    def _legacy_identity_reconciliation(
        self, expected_plan_fingerprint: str
    ) -> dict[str, Any]:
        before = self.verify()
        run_rows = self.connection.execute(r"""
            SELECT COALESCE((SELECT jsonb_build_object(
                'planFingerprint', plan_fingerprint,
                'sourceFingerprint', source_fingerprint,
                'manifestFingerprint', manifest_fingerprint,
                'result', result)
            FROM segment_studio_marker_replacement_runs
            WHERE plan_fingerprint=$1), '{}'::jsonb)::text;
        """, [expected_plan_fingerprint], tuples=True)
        run = json.loads(run_rows[0][0])
        if not run or run.get("result", {}).get("postCheck") != before:
            raise ValidationError(
                "The signed-off replacement run does not match the current target."
            )
        if before.get("invalidLineageEdgeCount") != 0:
            raise ValidationError("Lineage integrity must pass before identity cleanup.")
        return {
            "planFingerprint": expected_plan_fingerprint,
            "sourceFingerprint": run["sourceFingerprint"],
            "manifestFingerprint": run["manifestFingerprint"],
            "lineageNodeCount": before["lineageNodeCount"],
            "provenanceAssertionCount": before["provenanceAssertionCount"],
            "derivationEdgeCount": before["derivationEdgeCount"],
            "stateFingerprint": before["stateFingerprint"],
            "lineageFingerprint": before["lineageFingerprint"],
            "receiptCount": before["receiptCount"],
        }


def apply_reviewed_plan(
    target: PostgreSqlReplacementTarget,
    source: dict[str, Any],
    manifest: dict[str, Any],
    expected_plan_fingerprint: str,
) -> dict[str, Any]:
    require_hash(expected_plan_fingerprint, "expectedPlanFingerprint")
    target.begin_serializable()
    try:
        target.acquire_lock()
        target.ensure_schema()
        before = target.extract_target()
        prior = next(
            (row for row in before.get("priorRuns", [])
             if row["planFingerprint"] == expected_plan_fingerprint),
            None,
        )
        if prior is not None:
            if (
                prior["sourceInstanceId"] != source["sourceInstanceId"]
                or prior["sourceFingerprint"] != source_fingerprint(source)
                or prior["manifestFingerprint"] != sha256_json(normalized_manifest(manifest))
                or target.verify() != prior["result"].get("postCheck")
            ):
                raise ValidationError("The prior replacement run no longer matches a safe no-op target.")
            result = dict(prior["result"])
            result["replayedReviewedPlan"] = True
            target.commit()
            return result
        plan = build_plan(source, before, manifest)
        if not plan.result["succeeded"]:
            raise ValidationError("The replacement plan contains fatal issues.")
        if plan.result["planFingerprint"] != expected_plan_fingerprint:
            raise ValidationError("The reviewed plan fingerprint does not match the locked target.")
        target.write_plan(plan, source)
        actual = target.verify(plan)
        expected = {
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
        }
        if plan.lineage_report:
            expected.update({
                "lineageNodeCount": plan.result["plannedLineageNodeCount"],
                "provenanceAssertionCount": plan.result["plannedProvenanceAssertionCount"],
                "derivationEdgeCount": plan.result["plannedDerivationEdgeCount"],
                "invalidLineageEdgeCount": 0,
            })
        if any(actual.get(key) != value for key, value in expected.items()):
            raise ValidationError("The replacement post-check counts do not match the reviewed plan.")
        result = {**plan.result, "postCheck": actual}
        target.record_run(plan, result, source)
        target.commit()
        return result
    except BaseException:
        target.rollback()
        raise


def apply_reviewed_shot_boundary_plan(
    target: PostgreSqlReplacementTarget,
    source: dict[str, Any],
    manifest: dict[str, Any],
    expected_plan_fingerprint: str,
) -> dict[str, Any]:
    require_hash(expected_plan_fingerprint, "expectedPlanFingerprint")
    target.begin_serializable()
    try:
        target.acquire_lock()
        target.require_stable_schema()
        before = target.extract_target()
        plan = build_plan(source, before, manifest)
        if not plan.result["succeeded"]:
            raise ValidationError("The replacement plan contains fatal issues.")
        if plan.result["planFingerprint"] != expected_plan_fingerprint:
            raise ValidationError("The reviewed plan fingerprint does not match the locked target.")
        target.write_shot_boundaries(plan.shot_boundaries)
        after = target.extract_target()
        actual_count = len(after.get("shotBoundaries", []))
        actual_fingerprint = shot_boundary_state_fingerprint(
            after.get("shotBoundaries", [])
        )
        if (
            actual_count != plan.result["plannedShotBoundaryCount"]
            or actual_fingerprint != plan.result["plannedShotBoundaryFingerprint"]
            or after["segmentCount"] != before["segmentCount"]
            or after["stableItemCount"] != before["stableItemCount"]
            or after["workspaceCount"] != before["workspaceCount"]
        ):
            raise ValidationError("The shot-boundary backfill post-check does not match the reviewed plan.")
        result = {
            **plan.result,
            "appliedMode": "shot-boundaries-only",
            "insertedShotBoundaryCount": len(plan.shot_boundaries),
            "postCheck": {
                "segmentCount": after["segmentCount"],
                "stableItemCount": after["stableItemCount"],
                "workspaceCount": after["workspaceCount"],
                "shotBoundaryCount": actual_count,
                "shotBoundaryFingerprint": actual_fingerprint,
            },
        }
        target.commit()
        return result
    except BaseException:
        target.rollback()
        raise
