from __future__ import annotations

import asyncio
import logging
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import UUID, uuid4

from . import SCHEMA_VERSION, SERVICE_VERSION
from .ai import AiClient, analyze_request, normalize_segments, select_models
from .config import Settings
from .errors import ServiceError
from .idempotency import IdempotencyStore
from .models import AnalysisPhase, AnalyzeVideoRequest
from .model_cache import ensure_checkpoint
from .omnishotcut import OmniShotCutAdapter, normalize_boundaries
from .proxy_cache import ProxyCache
from .source import probe_source, resolve_source


logger = logging.getLogger("segment_studio_analysis")


@dataclass
class AnalysisRun:
    request: AnalyzeVideoRequest
    run_id: str
    request_fingerprint: str
    phase: AnalysisPhase = "queued"
    phase_started_at: datetime = field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    started: float = field(default_factory=time.perf_counter)
    finished: float | None = None
    result: dict[str, object] | None = None
    error: dict[str, object] | None = None
    failure: ServiceError | None = None
    task: asyncio.Task[None] | None = None

    def public(self) -> dict[str, object]:
        status: dict[str, object] = {
            "schemaVersion": SCHEMA_VERSION,
            "requestId": str(self.request.requestId),
            "runId": self.run_id,
            "serviceVersion": SERVICE_VERSION,
            "phase": self.phase,
            "phaseStartedAt": self.phase_started_at,
            "elapsedSeconds": round(
                (self.finished or time.perf_counter()) - self.started, 3
            ),
        }
        if self.error is not None:
            status["error"] = self.error
        if self.result is not None:
            status["result"] = self.result
        return status


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
        self.runs: dict[str, AnalysisRun] = {}
        self.request_runs: dict[str, str] = {}

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
        tasks = [run.task for run in self.runs.values() if run.task and not run.task.done()]
        for task in tasks:
            task.cancel()
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)
        await self.ai_client.close()

    async def submit(self, request: AnalyzeVideoRequest) -> AnalysisRun:
        replay = self.idempotency.replay(request)
        if replay is not None:
            run_id = str(replay["runId"])
            existing = self.runs.get(run_id)
            if existing is not None:
                return existing
            run = AnalysisRun(
                request=request,
                run_id=run_id,
                request_fingerprint=self.idempotency.fingerprint(request),
                phase="completed",
                result=replay,
            )
            run.finished = run.started
            self.runs[run_id] = run
            self.request_runs[str(request.requestId)] = run_id
            return run
        if not self.accepting:
            raise ServiceError(
                "service_busy", "Service busy", 503,
                "The service is shutting down.", True,
            )
        request_id = str(request.requestId)
        fingerprint = self.idempotency.fingerprint(request)
        active_run_id = self.request_runs.get(request_id)
        if active_run_id is not None:
            active = self.runs[active_run_id]
            if active.request_fingerprint != fingerprint:
                raise ServiceError(
                    "invalid_request", "Request ID conflict", 409,
                    "The requestId was already used with different request parameters.",
                    request_id=request_id,
                )
            return active
        run = AnalysisRun(request, str(uuid4()), fingerprint)
        self.runs[run.run_id] = run
        self.request_runs[request_id] = run.run_id
        self._log_transition(run)
        run.task = asyncio.create_task(self._execute(run))
        return run

    def get_run(self, run_id: UUID) -> AnalysisRun:
        run = self.runs.get(str(run_id))
        if run is None:
            raise ServiceError(
                "run_not_found", "Analysis run not found", 404,
                "The requested analysis run does not exist or is no longer available.",
            )
        return run

    async def analyze(self, request: AnalyzeVideoRequest) -> dict[str, object]:
        """Run an analysis to completion for internal backwards compatibility."""
        run = await self.submit(request)
        if run.task is not None:
            await run.task
        if run.result is not None:
            return run.result
        assert run.failure is not None
        raise run.failure

    async def _execute(self, run: AnalysisRun) -> None:
        try:
            async with self.gate:
                self._transition(run, "probing")
                run.result = await self._run(run)
                self.idempotency.store(run.request, run.result)
            self._transition(run, "completed")
        except asyncio.CancelledError:
            self.proxy_cache.terminate()
            self._fail(
                run,
                ServiceError(
                    "request_cancelled", "Request cancelled", 499,
                    "The analysis request was cancelled.", True,
                    request_id=str(run.request.requestId),
                ),
            )
        except ServiceError as error:
            error.request_id = error.request_id or str(run.request.requestId)
            self._fail(run, error)
        except Exception:
            self._fail(
                run,
                ServiceError(
                    "internal_error", "Analysis failed", 500,
                    "The analysis service could not complete the request.", True,
                    request_id=str(run.request.requestId),
                ),
            )

    async def _run(self, run: AnalysisRun) -> dict[str, object]:
        request = run.request
        run_id = run.run_id
        started = run.started
        metrics: dict[str, float] = {}
        warnings: list[str] = []
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

        self._transition(run, "building_proxy")
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
            self._transition(run, "waiting_for_ai")
            catalog = await self.ai_client.catalog()
            selected = select_models(catalog, request.ai.models, request.ai)
            if not selected:
                raise ServiceError(
                    "invalid_request", "Invalid request", 400,
                    "No compatible AI tagging models matched the request.",
                )
            mapped_path = self.settings.map_ai_path(proxies.ai.path)
            self._transition(run, "ai_tagging")
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
                        for key in (
                            "configName", "name", "identifier", "version", "categories"
                        )
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
            self._transition(run, "omnishotcut")
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

        self._transition(run, "finalizing")
        metrics["totalSeconds"] = round(time.perf_counter() - started, 3)
        response["metrics"] = metrics
        response["warnings"] = warnings
        return response

    def _transition(self, run: AnalysisRun, phase: AnalysisPhase) -> None:
        run.phase = phase
        run.phase_started_at = datetime.now(timezone.utc)
        if phase in ("completed", "failed"):
            run.finished = time.perf_counter()
        self._log_transition(run)

    def _fail(self, run: AnalysisRun, error: ServiceError) -> None:
        failed_phase = run.phase
        run.failure = error
        run.error = {
            "code": error.code,
            "phase": failed_phase,
            "retryable": error.retryable,
        }
        if error.upstream_http_status is not None:
            run.error["upstreamHttpStatus"] = error.upstream_http_status
        if error.upstream_error_code is not None:
            run.error["upstreamErrorCode"] = error.upstream_error_code
        run.phase = "failed"
        run.phase_started_at = datetime.now(timezone.utc)
        run.finished = time.perf_counter()
        self._log_transition(run)

    def _log_transition(self, run: AnalysisRun) -> None:
        error = run.error or {}
        logger.log(
            logging.WARNING if run.phase == "failed" else logging.INFO,
            "analysis phase changed",
            extra=log_extra(
                request_id=str(run.request.requestId),
                run_id=run.run_id,
                phase=run.phase,
                phase_started_at=run.phase_started_at,
                elapsed_seconds=(run.finished or time.perf_counter()) - run.started,
                error_code=str(error.get("code", "")),
                failed_phase=str(error.get("phase", "")),
                retryable=error.get("retryable"),
                upstream_http_status=error.get("upstreamHttpStatus"),
                upstream_error_code=str(error.get("upstreamErrorCode", "")),
            ),
        )


def rounded_elapsed(started: float) -> float:
    return round(time.perf_counter() - started, 3)


async def run_in_thread(function, *args, **kwargs):
    return await asyncio.to_thread(lambda: function(*args, **kwargs))


def log_extra(
    *,
    request_id: str,
    run_id: str,
    phase: str,
    phase_started_at: datetime,
    elapsed_seconds: float,
    error_code: str = "",
    failed_phase: str = "",
    retryable: object = None,
    upstream_http_status: object = None,
    upstream_error_code: str = "",
) -> dict[str, object]:
    return {
        "requestId": request_id,
        "runId": run_id,
        "phase": phase,
        "phaseStartedAt": phase_started_at.isoformat(),
        "elapsedSeconds": round(elapsed_seconds, 3),
        "errorCode": error_code,
        "failedPhase": failed_phase,
        "retryable": retryable,
        "upstreamHttpStatus": upstream_http_status,
        "upstreamErrorCode": upstream_error_code,
    }
