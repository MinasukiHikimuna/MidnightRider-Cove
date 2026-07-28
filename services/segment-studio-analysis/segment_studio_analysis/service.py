from __future__ import annotations

import asyncio
import logging
import time
from pathlib import Path
from typing import Any
from uuid import uuid4

from . import SCHEMA_VERSION, SERVICE_VERSION
from .ai import AiClient, analyze_request, normalize_segments, select_models
from .config import Settings
from .errors import ServiceError
from .idempotency import IdempotencyStore
from .models import AnalyzeVideoRequest
from .model_cache import ensure_checkpoint
from .omnishotcut import OmniShotCutAdapter, normalize_boundaries
from .proxy_cache import ProxyCache
from .source import probe_source, resolve_source


logger = logging.getLogger("segment_studio_analysis")


class AnalysisGate:
    def __init__(self, max_queue_length: int) -> None:
        self.lock = asyncio.Lock()
        self.guard = asyncio.Lock()
        self.waiting = 0
        self.max_queue_length = max_queue_length

    async def __aenter__(self) -> None:
        async with self.guard:
            if self.lock.locked():
                if self.waiting >= self.max_queue_length:
                    raise ServiceError(
                        "service_busy", "Service busy", 429,
                        "The analysis queue is full.", True,
                    )
                self.waiting += 1
                queued = True
            else:
                queued = False
        try:
            await self.lock.acquire()
        finally:
            if queued:
                async with self.guard:
                    self.waiting -= 1

    async def __aexit__(self, *_: object) -> None:
        self.lock.release()


class AnalysisService:
    def __init__(
        self,
        settings: Settings,
        *,
        ai_client: AiClient | None = None,
        adapter: OmniShotCutAdapter | None = None,
        proxy_cache: ProxyCache | None = None,
    ) -> None:
        self.settings = settings
        self.ai_client = ai_client or AiClient(
            settings.ai_server_base_url,
            settings.ai_timeout_seconds,
            settings.ai_catalog_cache_seconds,
        )
        self.adapter = adapter or OmniShotCutAdapter(
            settings.omnishotcut_repo,
            settings.omnishotcut_checkpoint,
            settings.omnishotcut_revision,
        )
        self.proxy_cache = proxy_cache or ProxyCache(
            settings.proxy_cache_root,
            max_age_days=settings.cache_max_age_days,
            max_bytes=settings.cache_max_bytes,
        )
        self.idempotency = IdempotencyStore(settings.proxy_cache_root)
        self.gate = AnalysisGate(settings.max_queue_length)
        self.model_loaded = False
        self.model_loading = False
        self.model_error: str | None = None
        self.accepting = True

    async def load_model(self) -> None:
        if not self.settings.load_model:
            return
        self.model_loading = True
        try:
            await run_in_thread(
                ensure_checkpoint,
                self.settings.omnishotcut_checkpoint,
                self.settings.omnishotcut_checkpoint_url,
                self.settings.omnishotcut_checkpoint_sha256,
            )
            await run_in_thread(
                ensure_checkpoint,
                self.settings.omnishotcut_backbone,
                self.settings.omnishotcut_backbone_url,
                self.settings.omnishotcut_backbone_sha256,
            )
            await run_in_thread(self.adapter.load)
            self.model_loaded = True
        except Exception:
            self.model_error = "OmniShotCut model initialization failed"
        finally:
            self.model_loading = False

    async def close(self) -> None:
        self.accepting = False
        self.proxy_cache.terminate()
        await self.ai_client.close()

    async def analyze(self, request: AnalyzeVideoRequest) -> dict[str, object]:
        replay = self.idempotency.replay(request)
        if replay is not None:
            return replay
        if not self.accepting:
            raise ServiceError(
                "service_busy", "Service busy", 503,
                "The service is shutting down.", True,
            )
        async with self.gate:
            replay = self.idempotency.replay(request)
            if replay is not None:
                return replay
            response = await self._run(request)
            self.idempotency.store(request, response)
            return response

    async def _run(self, request: AnalyzeVideoRequest) -> dict[str, object]:
        run_id = str(uuid4())
        started = time.perf_counter()
        metrics: dict[str, float] = {}
        warnings: list[str] = []
        try:
            phase = time.perf_counter()
            source_path = resolve_source(request.sourcePath, self.settings.media_roots)
            source = await run_in_thread(probe_source, source_path)
            metrics["probeSeconds"] = rounded_elapsed(phase)

            need_ai = "aiTagging" in request.analyses
            need_osc = "omnishotcut" in request.analyses
            if need_osc and not self.model_loaded:
                raise ServiceError(
                    "model_not_ready", "Model not ready", 503,
                    "The OmniShotCut model is not ready.", True,
                )

            phase = time.perf_counter()
            proxies = await run_in_thread(
                self.proxy_cache.ensure,
                source_path,
                source,
                need_ai=need_ai,
                need_omnishotcut=need_osc,
            )
            metrics["proxySeconds"] = rounded_elapsed(phase)

            response: dict[str, object] = {
                "schemaVersion": SCHEMA_VERSION,
                "requestId": str(request.requestId),
                "runId": run_id,
                "serviceVersion": SERVICE_VERSION,
                "status": "completed",
                "source": source.public(),
                "proxies": proxies.public(),
            }

            if need_ai:
                assert proxies.ai is not None
                phase = time.perf_counter()
                catalog = await self.ai_client.catalog()
                selected = select_models(catalog, request.ai.models, request.ai)
                if not selected:
                    raise ServiceError(
                        "invalid_request", "Invalid request", 400,
                        "No compatible AI tagging models matched the request.",
                    )
                mapped_path = self.settings.map_ai_path(proxies.ai.path)
                upstream = await self.ai_client.analyze(
                    analyze_request(str(mapped_path), selected, request.ai)
                )
                try:
                    segments = normalize_segments(
                        upstream,
                        source.fingerprint,
                        source.duration_seconds,
                        request.ai,
                    )
                except (TypeError, ValueError) as error:
                    raise ServiceError(
                        "ai_analysis_failed", "AI analysis failed", 502,
                        "The AI analysis service returned an invalid response.",
                    ) from error
                response["ai"] = {
                    "models": [
                        {
                            key: model[key]
                            for key in ("configName", "name", "identifier", "version", "categories")
                            if key in model
                        }
                        for model in selected
                    ],
                    "frameIntervalSeconds": request.ai.frameIntervalSeconds,
                    "segments": segments,
                }
                metrics["aiSeconds"] = rounded_elapsed(phase)

            if need_osc:
                assert proxies.omnishotcut is not None
                phase = time.perf_counter()
                prediction = await run_in_thread(
                    self.adapter.analyze,
                    proxies.omnishotcut.path,
                    request.omnishotcut.mode,
                    request.omnishotcut.numContextFrames,
                )
                boundaries, label_counts = normalize_boundaries(
                    prediction, source.duration_seconds
                )
                response["omnishotcut"] = {
                    "modelRevision": self.settings.omnishotcut_revision,
                    "mode": request.omnishotcut.mode,
                    "boundaries": boundaries,
                    "labelCounts": label_counts,
                }
                metrics["omnishotcutSeconds"] = rounded_elapsed(phase)

            metrics["totalSeconds"] = round(time.perf_counter() - started, 3)
            response["metrics"] = metrics
            response["warnings"] = warnings
            selected_keys = [
                str(model.get("configName"))
                for model in selected
            ] if need_ai else []
            logger.info(
                "analysis completed",
                extra=log_extra(
                    request_id=str(request.requestId),
                    run_id=run_id,
                    phase="completed",
                    elapsed_seconds=metrics["totalSeconds"],
                    source_fingerprint=source.fingerprint,
                    cache_hits={
                        "ai": proxies.ai.cache_hit if proxies.ai else None,
                        "omnishotcut": (
                            proxies.omnishotcut.cache_hit
                            if proxies.omnishotcut
                            else None
                        ),
                    },
                    selected_models=selected_keys,
                    result_counts={
                        "segments": len(response.get("ai", {}).get("segments", []))
                        if isinstance(response.get("ai"), dict)
                        else 0,
                        "boundaries": len(
                            response.get("omnishotcut", {}).get("boundaries", [])
                        )
                        if isinstance(response.get("omnishotcut"), dict)
                        else 0,
                    },
                ),
            )
            return response
        except asyncio.CancelledError:
            self.proxy_cache.terminate()
            raise ServiceError(
                "request_cancelled", "Request cancelled", 499,
                "The analysis request was cancelled.", True,
                request_id=str(request.requestId),
            )
        except ServiceError as error:
            error.request_id = error.request_id or str(request.requestId)
            logger.warning(
                "analysis failed",
                extra=log_extra(
                    request_id=str(request.requestId),
                    run_id=run_id,
                    phase="failed",
                    elapsed_seconds=time.perf_counter() - started,
                    error_code=error.code,
                ),
            )
            raise


def rounded_elapsed(started: float) -> float:
    return round(time.perf_counter() - started, 3)


async def run_in_thread(function, *args, **kwargs):
    return await asyncio.to_thread(lambda: function(*args, **kwargs))


def log_extra(
    *,
    request_id: str,
    run_id: str,
    phase: str,
    elapsed_seconds: float,
    source_fingerprint: str = "",
    cache_hits: dict[str, object] | None = None,
    selected_models: list[str] | None = None,
    result_counts: dict[str, int] | None = None,
    error_code: str = "",
) -> dict[str, object]:
    return {
        "requestId": request_id,
        "runId": run_id,
        "phase": phase,
        "elapsedMilliseconds": round(elapsed_seconds * 1000),
        "sourceFingerprint": source_fingerprint.removeprefix("sha256:")[:12],
        "cacheHits": cache_hits or {},
        "selectedModels": selected_models or [],
        "resultCounts": result_counts or {},
        "errorCode": error_code,
    }
