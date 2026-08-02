from __future__ import annotations

import httpx

from segment_studio_analysis.ai import (
    analyze_request,
    normalize_segments,
    parse_predictions,
    sanitize_model,
    sanitized_upstream_error_code,
    select_models,
)
from segment_studio_analysis.models import AiOptions


def catalog() -> list[dict[str, object]]:
    return [
        {
            "configName": "z-loaded",
            "name": "z",
            "capabilities": ["tagging"],
            "supportedScopes": ["frame"],
            "categories": ["action"],
            "active": False,
            "loaded": True,
            "artifactAvailable": True,
            "incompatible": False,
        },
        {
            "configName": "a-active",
            "name": "a",
            "capabilities": ["tagging"],
            "supportedScopes": ["frame"],
            "categories": ["appearance"],
            "active": True,
            "loaded": True,
            "artifactAvailable": True,
            "incompatible": False,
        },
        {
            "configName": "bad",
            "capabilities": ["detection"],
            "artifactAvailable": True,
        },
    ]


def test_catalog_sanitization_and_deterministic_selection() -> None:
    sanitized = sanitize_model(
        {
            "config_name": "model",
            "supported_scopes": ["frame"],
            "artifact_path": "/secret/model.pt",
            "incompatibility_reason": "",
        }
    )
    assert sanitized == {
        "configName": "model",
        "supportedScopes": ["frame"],
        "incompatibilityReason": "",
    }
    selected = select_models(catalog(), [], AiOptions())
    assert [model["configName"] for model in selected] == ["a-active", "z-loaded"]


def test_upstream_error_code_is_strictly_allowlisted() -> None:
    safe = httpx.Response(503, json={"error": {"code": "MODEL_BUSY"}})
    unsafe = httpx.Response(503, json={"code": "/media/private/video.mp4"})
    assert sanitized_upstream_error_code(safe) == "MODEL_BUSY"
    assert sanitized_upstream_error_code(unsafe) is None


def test_exact_v4_request_shape() -> None:
    options = AiOptions(
        frameIntervalSeconds=1.25,
        threshold=0.7,
        categoriesToSkip=["skip"],
        pipelineName="video",
    )
    assert analyze_request("/cache/proxy.mp4", catalog()[:1], options) == {
        "path": "/cache/proxy.mp4",
        "pipeline_name": "video",
        "frame_interval": 1.25,
        "threshold": 0.7,
        "return_confidence": True,
        "vr_video": False,
        "categories_to_skip": ["skip"],
        "want": [
            {
                "capability": "tagging",
                "scope": "frame",
                "models": ["z-loaded"],
            }
        ],
        "load_policy": "load_if_cheap",
    }


def test_prediction_shapes() -> None:
    assert parse_predictions("tag") == [("tag", None)]
    assert parse_predictions(["tag", 0.9]) == [("tag", 0.9)]
    assert parse_predictions({"class_name": "tag", "probability": 0.8}) == [
        ("tag", 0.8)
    ]
    assert parse_predictions(
        [["one", 0.7], {"label": "two", "score": 0.6}, "three"]
    ) == [("one", 0.7), ("two", 0.6), ("three", None)]


def test_contiguous_segments_filter_confidence_and_stable_keys() -> None:
    result = {
        "frame_interval_seconds": 2.0,
        "frames": [
            {
                "frame_index": 0,
                "time_seconds": 0.0,
                "analysis": {
                    "capabilities": {
                        "tagging": {
                            "model": [
                                ["keep", 0.7],
                                ["low", 0.1],
                            ]
                        }
                    }
                },
            },
            {
                "frame_index": 1,
                "time_seconds": 2.0,
                "analysis": {
                    "capabilities": {
                        "tagging": {"model": [{"tag": "keep", "confidence": 0.9}]}
                    }
                },
            },
            {
                "frame_index": 2,
                "time_seconds": 4.0,
                "analysis": {"capabilities": {"tagging": {}}},
            },
        ],
    }
    options = AiOptions(candidateConfidenceFloor=0.35)
    first = normalize_segments(result, "sha256:source", 10.0, options)
    second = normalize_segments(result, "sha256:source", 10.0, options)
    assert first == second
    assert len(first) == 1
    assert first[0]["startSeconds"] == 0
    assert first[0]["endSeconds"] == 4
    assert first[0]["confidence"] == 0.9
    assert first[0]["observationCount"] == 2
    assert first[0]["candidateKey"].startswith("sha256:")
