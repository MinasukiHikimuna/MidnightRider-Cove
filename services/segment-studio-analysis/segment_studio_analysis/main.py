from __future__ import annotations

import asyncio
import shutil
import subprocess
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any, AsyncIterator
from uuid import UUID

import httpx
from fastapi import FastAPI, Request, Response, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from . import SCHEMA_VERSION, SERVICE_VERSION
from .config import Settings, load_settings
from .errors import ServiceError
from .logging_config import configure_logging
from .models import AnalysisRunStatus, AnalyzeVideoRequest, CatalogModel
from .service import AnalysisService


def create_app(
    settings: Settings | None = None,
    service: AnalysisService | None = None,
) -> FastAPI:
    resolved_settings = settings or load_settings()
    configure_logging(resolved_settings.log_level)

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        resolved_service = service or AnalysisService(resolved_settings)
        app.state.settings = resolved_settings
        app.state.service = resolved_service
        app.state.model_task = asyncio.create_task(resolved_service.load_model())
        yield
        await resolved_service.close()

    app = FastAPI(
        title="Segment Studio Analysis",
        version=SERVICE_VERSION,
        lifespan=lifespan,
    )

    @app.exception_handler(ServiceError)
    async def service_error_handler(_: Request, error: ServiceError) -> JSONResponse:
        return JSONResponse(error.problem(), status_code=error.status)

    @app.exception_handler(RequestValidationError)
    async def validation_error_handler(request: Request, _: RequestValidationError) -> JSONResponse:
        request_id = request.headers.get("x-request-id")
        error = ServiceError(
            "invalid_request", "Invalid request", 400,
            "The request body or parameters are invalid.",
            request_id=request_id,
        )
        return JSONResponse(error.problem(), status_code=400)

    @app.get("/healthz")
    async def healthz() -> dict[str, object]:
        return {
            "ok": True,
            "serviceVersion": SERVICE_VERSION,
            "schemaVersion": SCHEMA_VERSION,
        }

    @app.get("/readyz")
    async def readyz(request: Request) -> JSONResponse:
        state = get_service(request)
        checks = await readiness_checks(state)
        required = ["ffmpeg", "ffprobe", "cuda", "omnishotcut", "proxyCache", "aiServer"]
        ok = all(bool(checks[name].get("ok")) for name in required)
        payload = {
            "ok": ok,
            "serviceVersion": SERVICE_VERSION,
            "schemaVersion": SCHEMA_VERSION,
            "checks": checks,
        }
        return JSONResponse(payload, status_code=200 if ok else 503)

    @app.get(
        "/v1/ai/catalog",
        response_model=list[CatalogModel],
        response_model_exclude_none=True,
    )
    async def ai_catalog(request: Request) -> list[dict[str, Any]]:
        return await get_service(request).ai_client.catalog()

    @app.post(
        "/v1/analyze-video",
        response_model=AnalysisRunStatus,
        response_model_exclude_none=True,
        status_code=status.HTTP_202_ACCEPTED,
        responses={
            status.HTTP_202_ACCEPTED: {
                "headers": {
                    "Location": {
                        "description": "Status resource for the accepted analysis run.",
                        "schema": {"type": "string"},
                    }
                }
            }
        },
    )
    async def analyze_video(
        payload: AnalyzeVideoRequest, request: Request, response: Response
    ) -> dict[str, object]:
        run = await get_service(request).submit(payload)
        response.headers["Location"] = f"/v1/analysis-runs/{run.run_id}"
        response.headers["Cache-Control"] = "no-store"
        return run.public()

    @app.get(
        "/v1/analysis-runs/{run_id}",
        response_model=AnalysisRunStatus,
        response_model_exclude_none=True,
    )
    async def analysis_run(
        run_id: UUID, request: Request, response: Response
    ) -> dict[str, object]:
        response.headers["Cache-Control"] = "no-store"
        return get_service(request).get_run(run_id).public()

    return app


def get_service(request: Request) -> AnalysisService:
    return request.app.state.service


async def readiness_checks(service: AnalysisService) -> dict[str, dict[str, object]]:
    settings = service.settings
    checks: dict[str, dict[str, object]] = {}
    checks["ffmpeg"] = executable_check("ffmpeg")
    checks["ffprobe"] = executable_check("ffprobe")
    checks["cuda"] = cuda_check()
    checks["omnishotcut"] = {
        "ok": service.model_loaded and service.model_error is None,
        "modelLoaded": service.model_loaded,
        "modelRevision": settings.omnishotcut_revision,
    }
    try:
        settings.proxy_cache_root.mkdir(parents=True, exist_ok=True)
        probe = settings.proxy_cache_root / ".readiness-probe"
        probe.touch(exist_ok=False)
        probe.unlink()
        checks["proxyCache"] = {"ok": True, "writable": True}
    except OSError:
        checks["proxyCache"] = {"ok": False, "writable": False}
    try:
        response = await service.ai_client.client.get("/v4/health")
        response.raise_for_status()
        checks["aiServer"] = {"ok": True, "apiVersion": "v4"}
    except httpx.HTTPError:
        checks["aiServer"] = {"ok": False, "apiVersion": "v4"}
    checks["aiProxyPathMapping"] = {
        "ok": False,
        "supported": False,
        "detail": "The AI server does not expose a path-mapping probe endpoint.",
    }
    return checks


def executable_check(name: str) -> dict[str, object]:
    if shutil.which(name) is None:
        return {"ok": False, "version": None}
    try:
        result = subprocess.run(
            [name, "-version"], check=True, capture_output=True, text=True
        )
        version = result.stdout.splitlines()[0][:200]
        return {"ok": True, "version": version}
    except (OSError, subprocess.CalledProcessError):
        return {"ok": False, "version": None}


def cuda_check() -> dict[str, object]:
    try:
        import torch

        count = torch.cuda.device_count()
        return {"ok": torch.cuda.is_available() and count > 0, "deviceCount": count}
    except (ImportError, RuntimeError):
        return {"ok": False, "deviceCount": 0}


def main() -> None:
    import uvicorn

    uvicorn.run(
        "segment_studio_analysis.main:create_app",
        factory=True,
        host="0.0.0.0",
        port=8766,
    )
