from __future__ import annotations

import hashlib
import json
import re
import time
import unicodedata
from dataclasses import dataclass
from typing import Any

import httpx

from .errors import ServiceError
from .models import AiOptions


CATALOG_FIELDS = {
    "configName", "name", "identifier", "version", "categories", "type",
    "capabilities", "supportedScopes", "active", "loaded", "info", "imageSize",
    "artifactAvailable", "incompatible", "incompatibilityReason",
}


class AiClient:
    def __init__(self, base_url: str, timeout_seconds: float, cache_seconds: int) -> None:
        timeout = None if timeout_seconds == 0 else timeout_seconds
        self.client = httpx.AsyncClient(base_url=base_url, timeout=timeout)
        self.cache_seconds = cache_seconds
        self._catalog: list[dict[str, Any]] | None = None
        self._catalog_time = 0.0

    async def close(self) -> None:
        await self.client.aclose()

    async def catalog(self) -> list[dict[str, Any]]:
        now = time.monotonic()
        if self._catalog is not None and now - self._catalog_time < self.cache_seconds:
            return self._catalog
        try:
            response = await self.client.get("/v4/models/catalog")
            response.raise_for_status()
            payload = response.json()
            raw_models = unwrap_catalog(payload)
            models = [sanitize_model(model) for model in raw_models if isinstance(model, dict)]
        except httpx.HTTPStatusError as error:
            raise ServiceError(
                "ai_catalog_failed",
                "AI catalog failed",
                502,
                "The AI model catalog could not be retrieved.",
                retryable=True,
                upstream_http_status=error.response.status_code,
                upstream_error_code=sanitized_upstream_error_code(error.response),
            ) from error
        except (httpx.HTTPError, ValueError, TypeError) as error:
            raise ServiceError(
                "ai_catalog_failed",
                "AI catalog failed",
                502,
                "The AI model catalog could not be retrieved.",
                retryable=True,
            ) from error
        self._catalog = models
        self._catalog_time = now
        return models

    async def analyze(self, payload: dict[str, Any]) -> dict[str, Any]:
        try:
            response = await self.client.post("/v4/analyze/video", json=payload)
            response.raise_for_status()
            parsed = response.json()
            result = parsed.get("result", parsed) if isinstance(parsed, dict) else None
            if not isinstance(result, dict):
                raise ValueError("result is not an object")
            return result
        except httpx.TimeoutException as error:
            raise ServiceError(
                "ai_server_unavailable", "AI server unavailable", 502,
                "The AI analysis service could not complete the request.", True,
            ) from error
        except httpx.HTTPStatusError as error:
            raise ServiceError(
                "ai_analysis_failed", "AI analysis failed", 502,
                "The AI analysis service rejected or failed the request.", True,
                upstream_http_status=error.response.status_code,
                upstream_error_code=sanitized_upstream_error_code(error.response),
            ) from error
        except httpx.HTTPError as error:
            raise ServiceError(
                "ai_analysis_failed", "AI analysis failed", 502,
                "The AI analysis service rejected or failed the request.", True,
            ) from error
        except (ValueError, TypeError) as error:
            raise ServiceError(
                "ai_analysis_failed", "AI analysis failed", 502,
                "The AI analysis service returned an invalid response.",
            ) from error


SAFE_UPSTREAM_CODE = re.compile(r"^[A-Za-z0-9_.-]{1,64}$")


def sanitized_upstream_error_code(response: httpx.Response) -> str | None:
    try:
        payload = response.json()
    except ValueError:
        return None
    if not isinstance(payload, dict):
        return None
    value: object = payload.get("code")
    if value is None and isinstance(payload.get("error"), dict):
        value = payload["error"].get("code")
    if isinstance(value, str) and SAFE_UPSTREAM_CODE.fullmatch(value):
        return value
    return None


def unwrap_catalog(payload: object) -> list[object]:
    if isinstance(payload, list):
        return payload
    if not isinstance(payload, dict):
        raise ValueError("catalog is not an object or array")
    value: object = payload.get("result", payload)
    if isinstance(value, dict):
        value = value.get("models", value.get("catalog"))
    if not isinstance(value, list):
        raise ValueError("catalog models are missing")
    return value


def sanitize_model(model: dict[str, Any]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for source_name, value in model.items():
        target = snake_to_camel(source_name)
        if target in CATALOG_FIELDS:
            result[target] = value
    return result


def select_models(
    catalog: list[dict[str, Any]], requested: list[str], options: AiOptions
) -> list[dict[str, Any]]:
    compatible = [model for model in catalog if is_compatible(model)]
    by_name = {
        str(model.get("configName")): model
        for model in catalog
        if model.get("configName") is not None
    }
    if requested:
        selected = []
        for name in requested:
            model = by_name.get(name)
            if model is None or model not in compatible:
                raise ServiceError(
                    "invalid_request", "Invalid request", 400,
                    "A requested AI model is unknown or incompatible with frame tagging.",
                )
            selected.append(model)
        return selected

    skipped = {category.casefold() for category in options.categoriesToSkip}
    selected = [
        model for model in compatible
        if not skipped.intersection(
            str(category).casefold() for category in model.get("categories", [])
        )
        and (options.loadPolicy != "use_loaded" or model.get("loaded") is True)
    ]
    selected.sort(
        key=lambda model: (
            not bool(model.get("active")),
            str(model.get("configName", "")),
        )
    )
    return selected


def is_compatible(model: dict[str, Any]) -> bool:
    capabilities = {
        str(value).casefold() for value in model.get("capabilities", [])
    }
    scopes = {str(value).casefold() for value in model.get("supportedScopes", [])}
    artifact = model.get("artifactAvailable")
    return (
        "tagging" in capabilities
        and (not scopes or "frame" in scopes)
        and model.get("incompatible") is not True
        and artifact is not False
    )


def analyze_request(path: str, models: list[dict[str, Any]], options: AiOptions) -> dict[str, Any]:
    return {
        "path": path,
        "pipeline_name": options.pipelineName,
        "frame_interval": options.frameIntervalSeconds,
        "threshold": options.threshold,
        "return_confidence": options.returnConfidence,
        "vr_video": options.vrVideo,
        "categories_to_skip": options.categoriesToSkip,
        "want": [{
            "capability": "tagging",
            "scope": "frame",
            "models": [str(model["configName"]) for model in models],
        }],
        "load_policy": options.loadPolicy,
    }


def normalize_segments(
    result: dict[str, Any],
    source_fingerprint: str,
    source_duration: float,
    options: AiOptions,
) -> list[dict[str, Any]]:
    frames = result.get("frames", [])
    if not isinstance(frames, list):
        raise ValueError("AI response frames must be an array")
    ordered = sorted(
        (frame for frame in frames if isinstance(frame, dict)),
        key=lambda frame: (
            read_float(frame.get("time_seconds"), 0),
            read_float(frame.get("index", frame.get("frame_index")), 0),
        ),
    )
    response_interval = read_float(
        result.get(
            "frame_interval_seconds",
            result.get("frame_interval", result.get("frameIntervalSeconds")),
        ),
        0,
    )
    span = response_interval or options.frameIntervalSeconds or 0.5
    observations: list[tuple[float, dict[tuple[str, str], float | None]]] = []
    for frame in ordered:
        time_seconds = read_float(frame.get("time_seconds"), 0)
        tagging = (
            frame.get("analysis", {})
            .get("capabilities", {})
            .get("tagging", {})
        )
        current: dict[tuple[str, str], float | None] = {}
        if isinstance(tagging, dict):
            for model_key, predictions in tagging.items():
                for tag, confidence in parse_predictions(predictions):
                    if confidence is not None and confidence < options.candidateConfidenceFloor:
                        continue
                    prediction_key = (str(model_key), normalize_tag(tag))
                    previous = current.get(prediction_key)
                    if confidence is None:
                        current.setdefault(prediction_key, None)
                    elif previous is None:
                        current[prediction_key] = confidence
                    else:
                        current[prediction_key] = max(previous, confidence)
        observations.append((time_seconds, current))

    active: dict[tuple[str, str], dict[str, Any]] = {}
    segments: list[dict[str, Any]] = []
    for time_seconds, current in observations:
        for key in list(active):
            if key not in current:
                segments.append(finish_segment(key, active.pop(key), source_fingerprint, source_duration, span))
        for key, confidence in current.items():
            if key not in active:
                active[key] = {
                    "start": time_seconds, "last": time_seconds,
                    "confidence": confidence, "count": 1,
                }
            else:
                run = active[key]
                run["last"] = time_seconds
                run["count"] += 1
                if confidence is not None:
                    previous = run["confidence"]
                    run["confidence"] = confidence if previous is None else max(previous, confidence)
    for key, run in active.items():
        segments.append(finish_segment(key, run, source_fingerprint, source_duration, span))
    segments = [segment for segment in segments if segment["endSeconds"] > segment["startSeconds"]]
    segments.sort(key=lambda item: (
        item["startSeconds"], item["endSeconds"], normalize_tag(item["tagName"]), item["modelKey"]
    ))
    return segments


def parse_predictions(value: object) -> list[tuple[str, float | None]]:
    if isinstance(value, str):
        return [(value, None)]
    if isinstance(value, dict):
        parsed = parse_prediction(value)
        return [parsed] if parsed else []
    if not isinstance(value, list):
        return []
    if len(value) == 2 and isinstance(value[0], str) and isinstance(value[1], (int, float)):
        return [(value[0], float(value[1]))]
    result = []
    for item in value:
        if isinstance(item, str):
            result.append((item, None))
        elif isinstance(item, list) and len(item) >= 1 and isinstance(item[0], str):
            confidence = float(item[1]) if len(item) > 1 and isinstance(item[1], (int, float)) else None
            result.append((item[0], confidence))
        elif isinstance(item, dict):
            parsed = parse_prediction(item)
            if parsed:
                result.append(parsed)
    return result


def parse_prediction(value: dict[str, Any]) -> tuple[str, float | None] | None:
    label = next(
        (value.get(key) for key in ("tag", "label", "name", "class", "class_name")
         if isinstance(value.get(key), str)),
        None,
    )
    if label is None:
        return None
    confidence = next(
        (float(value[key]) for key in ("confidence", "score", "probability")
         if isinstance(value.get(key), (int, float))),
        None,
    )
    return label, confidence


def finish_segment(
    key: tuple[str, str],
    run: dict[str, Any],
    source_fingerprint: str,
    duration: float,
    span: float,
) -> dict[str, Any]:
    model_key, tag = key
    start = min(duration, max(0.0, float(run["start"])))
    end = min(duration, max(0.0, float(run["last"]) + span))
    start_ms = round(start * 1000)
    end_ms = round(end * 1000)
    digest_input = "\x1f".join(
        ["1", source_fingerprint, model_key, tag, str(start_ms), str(end_ms)]
    )
    return {
        "candidateKey": f"sha256:{hashlib.sha256(digest_input.encode()).hexdigest()}",
        "kind": "tag",
        "tagName": tag,
        "title": tag,
        "startSeconds": start_ms / 1000,
        "endSeconds": end_ms / 1000,
        "confidence": run["confidence"],
        "modelKey": model_key,
        "observationCount": run["count"],
    }


def normalize_tag(value: str) -> str:
    return unicodedata.normalize("NFC", value.strip())


def snake_to_camel(value: str) -> str:
    first, *rest = value.split("_")
    return first + "".join(part.capitalize() for part in rest)


def read_float(value: object, default: float) -> float:
    try:
        return float(value)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return default
