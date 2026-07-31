from __future__ import annotations

import asyncio
import json
from pathlib import Path
from typing import Any
from uuid import UUID

import httpx

from segment_studio_analysis.ai import AiClient
from segment_studio_analysis.config import Settings
from segment_studio_analysis.errors import ServiceError
from segment_studio_analysis.main import create_app
from segment_studio_analysis.models import AnalyzeVideoRequest
from segment_studio_analysis.proxy_cache import ProxyInfo, ProxySet
from segment_studio_analysis.service import AnalysisService
from segment_studio_analysis.source import SourceInfo


class FakeAiClient:
    def __init__(self) -> None:
        self.analyze_calls = 0

    async def catalog(self) -> list[dict[str, Any]]:
        return [{
            "configName": "test-model",
            "name": "test",
            "identifier": 1,
            "version": "1",
            "categories": ["test"],
            "capabilities": ["tagging"],
            "supportedScopes": ["frame"],
            "active": True,
            "loaded": True,
            "artifactAvailable": True,
            "incompatible": False,
        }]

    async def analyze(self, payload: dict[str, Any]) -> dict[str, Any]:
        self.analyze_calls += 1
        assert payload["path"] == "/shared/proxies/key/ai-proxy.mp4"
        return {
            "frame_interval_seconds": 2.0,
            "frames": [{
                "frame_index": 0,
                "time_seconds": 0,
                "analysis": {
                    "capabilities": {
                        "tagging": {"test-model": [["example", 0.9]]}
                    }
                },
            }],
        }

    async def close(self) -> None:
        pass


class FakeAdapter:
    def load(self) -> None:
        pass

    def analyze(self, path: Path, mode: str, context: int) -> dict[str, Any]:
        return {
            "fps": 25.0,
            "frame_count": 250,
            "ranges": [[0, 124], [125, 249]],
            "intra_labels": ["General", "General"],
            "inter_labels": ["New_Start", "New_Start"],
        }


class BlockingAiClient(FakeAiClient):
    def __init__(self) -> None:
        super().__init__()
        self.started = asyncio.Event()
        self.release = asyncio.Event()

    async def analyze(self, payload: dict[str, Any]) -> dict[str, Any]:
        self.started.set()
        await self.release.wait()
        return await super().analyze(payload)


class FailingAiClient(FakeAiClient):
    async def analyze(self, payload: dict[str, Any]) -> dict[str, Any]:
        raise ServiceError(
            "ai_analysis_failed",
            "AI analysis failed",
            502,
            "sensitive upstream response must not be returned",
            retryable=True,
            upstream_http_status=503,
            upstream_error_code="MODEL_BUSY",
        )


class FakeProxyCache:
    def __init__(self, root: Path) -> None:
        self.root = root

    def ensure(self, *_: object, **__: object) -> ProxySet:
        directory = self.root / "key"
        directory.mkdir(parents=True, exist_ok=True)
        ai = directory / "ai-proxy.mp4"
        osc = directory / "omnishotcut-proxy.mp4"
        ai.write_bytes(b"ai")
        osc.write_bytes(b"osc")
        return ProxySet(
            "key",
            ProxyInfo(ai, 512, 288, 0.5, False, 2),
            ProxyInfo(osc, 128, 96, 25, False, 3),
        )

    def terminate(self) -> None:
        pass


def settings(tmp_path: Path) -> Settings:
    media = tmp_path / "media"
    media.mkdir()
    return Settings(
        media_roots=(media,),
        proxy_cache_root=tmp_path / "shared" / "proxies",
        model_cache_root=tmp_path / "models",
        ai_server_base_url="http://ai",
        ai_path_from=tmp_path / "shared",
        ai_path_to=Path("/shared"),
        ai_timeout_seconds=1,
        ai_catalog_cache_seconds=60,
        max_queue_length=4,
        cache_max_age_days=30,
        cache_max_bytes=100000,
        log_level="INFO",
        omnishotcut_mode="clean_shot",
        omnishotcut_repo=tmp_path / "repo",
        omnishotcut_checkpoint=tmp_path / "model",
        omnishotcut_revision="revision",
        omnishotcut_checkpoint_url="https://example.invalid/model",
        omnishotcut_checkpoint_sha256="0" * 64,
        omnishotcut_backbone=tmp_path / "models" / "torch" / "backbone.pth",
        omnishotcut_backbone_url="https://example.invalid/backbone",
        omnishotcut_backbone_sha256="1" * 64,
        load_model=False,
    )


async def test_health_and_combined_golden(
    tmp_path: Path, monkeypatch
) -> None:
    configured = settings(tmp_path)
    video = configured.media_roots[0] / "source.mp4"
    video.write_bytes(b"video")
    fake_ai = FakeAiClient()
    service = AnalysisService(
        configured,
        ai_client=fake_ai,  # type: ignore[arg-type]
        adapter=FakeAdapter(),  # type: ignore[arg-type]
        proxy_cache=FakeProxyCache(configured.proxy_cache_root),  # type: ignore[arg-type]
    )
    service.model_loaded = True
    monkeypatch.setattr(
        "segment_studio_analysis.service.probe_source",
        lambda _: SourceInfo(
            "sha256:source", 5, 1, 10.0, 25.0, 1920, 1080, 250
        ),
    )

    async def run_inline(function, *args, **kwargs):
        return function(*args, **kwargs)

    async def all_ready(_: AnalysisService) -> dict[str, dict[str, object]]:
        return {
            name: {"ok": True}
            for name in (
                "ffmpeg",
                "ffprobe",
                "cuda",
                "omnishotcut",
                "proxyCache",
                "aiServer",
            )
        }

    monkeypatch.setattr("segment_studio_analysis.service.run_in_thread", run_inline)
    monkeypatch.setattr("segment_studio_analysis.main.readiness_checks", all_ready)
    app = create_app(configured, service)
    request = {
        "schemaVersion": "1",
        "requestId": "00000000-0000-4000-8000-000000000001",
        "sourcePath": str(video),
        "analyses": ["aiTagging", "omnishotcut"],
        "proxy": {"enabled": True},
    }
    async with app.router.lifespan_context(app):
        async with httpx.AsyncClient(
            transport=httpx.ASGITransport(app=app), base_url="http://test"
        ) as client:
            assert (await client.get("/healthz")).json() == {
                "ok": True,
                "serviceVersion": "0.1.0",
                "schemaVersion": "1",
            }
            ready = await client.get("/readyz")
            assert ready.status_code == 200
            assert ready.json()["ok"] is True
            catalog = await client.get("/v1/ai/catalog")
            assert catalog.status_code == 200
            assert catalog.json()[0]["configName"] == "test-model"
            response = await client.post("/v1/analyze-video", json=request)
            assert response.status_code == 202, response.text
            accepted = response.json()
            assert accepted["requestId"] == request["requestId"]
            assert accepted["phase"] == "queued"
            assert response.headers["location"] == (
                f"/v1/analysis-runs/{accepted['runId']}"
            )
            assert response.headers["cache-control"] == "no-store"
            assert "completedUnits" not in accepted
            run_task = service.runs[accepted["runId"]].task
            assert run_task is not None
            await run_task
            status_response = await client.get(response.headers["location"])
            assert status_response.status_code == 200
            assert status_response.headers["cache-control"] == "no-store"
            status_payload = status_response.json()
            assert status_payload["phase"] == "completed"
            await asyncio.sleep(0.001)
            assert (
                await client.get(response.headers["location"])
            ).json()["elapsedSeconds"] == status_payload["elapsedSeconds"]
            payload = status_payload["result"]
            assert payload["schemaVersion"] == "1"
            assert payload["source"]["fingerprint"] == "sha256:source"
            assert payload["ai"]["segments"][0]["tagName"] == "example"
            assert payload["omnishotcut"]["boundaries"][0]["startSeconds"] == 0
            assert payload["omnishotcut"]["boundaries"][-1]["endSeconds"] == 10
            assert "sourcePath" not in json.dumps(payload)

            replay = await client.post("/v1/analyze-video", json=request)
            assert replay.status_code == 202
            assert replay.json()["phase"] == "completed"
            assert replay.json()["result"] == payload
            assert fake_ai.analyze_calls == 1

            conflicting = {**request, "analyses": ["aiTagging"]}
            conflict = await client.post("/v1/analyze-video", json=conflicting)
            assert conflict.status_code == 409
            assert conflict.json()["code"] == "invalid_request"


async def test_unknown_request_fields_are_rejected(tmp_path: Path) -> None:
    configured = settings(tmp_path)
    service = AnalysisService(
        configured,
        ai_client=FakeAiClient(),  # type: ignore[arg-type]
        adapter=FakeAdapter(),  # type: ignore[arg-type]
        proxy_cache=FakeProxyCache(configured.proxy_cache_root),  # type: ignore[arg-type]
    )
    app = create_app(configured, service)
    async with app.router.lifespan_context(app):
        async with httpx.AsyncClient(
            transport=httpx.ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.post(
                "/v1/analyze-video",
                json={
                    "schemaVersion": "1",
                    "requestId": "00000000-0000-4000-8000-000000000001",
                    "sourcePath": "/media/source.mp4",
                    "analyses": ["aiTagging"],
                    "unknown": True,
                },
            )
    assert response.status_code == 400
    assert response.json()["code"] == "invalid_request"


async def test_status_endpoint_reports_live_phase_and_sanitized_failure(
    tmp_path: Path, monkeypatch, capsys
) -> None:
    configured = settings(tmp_path)
    video = configured.media_roots[0] / "private-library-name.mp4"
    video.write_bytes(b"video")
    blocking_ai = BlockingAiClient()
    service = AnalysisService(
        configured,
        ai_client=blocking_ai,  # type: ignore[arg-type]
        adapter=FakeAdapter(),  # type: ignore[arg-type]
        proxy_cache=FakeProxyCache(configured.proxy_cache_root),  # type: ignore[arg-type]
    )
    monkeypatch.setattr(
        "segment_studio_analysis.service.probe_source",
        lambda _: SourceInfo("sha256:source", 5, 1, 10.0, 25.0, 1920, 1080, 250),
    )

    async def run_inline(function, *args, **kwargs):
        return function(*args, **kwargs)

    monkeypatch.setattr("segment_studio_analysis.service.run_in_thread", run_inline)
    app = create_app(configured, service)
    request = {
        "schemaVersion": "1",
        "requestId": "00000000-0000-4000-8000-000000000010",
        "sourcePath": str(video),
        "analyses": ["aiTagging"],
    }
    async with app.router.lifespan_context(app):
        async with httpx.AsyncClient(
            transport=httpx.ASGITransport(app=app), base_url="http://test"
        ) as client:
            accepted = await client.post("/v1/analyze-video", json=request)
            await blocking_ai.started.wait()
            live = (await client.get(accepted.headers["location"])).json()
            assert live["phase"] == "ai_tagging"
            assert live["requestId"] == request["requestId"]
            assert live["runId"] == accepted.json()["runId"]
            assert live["elapsedSeconds"] >= 0
            assert "completedUnits" not in live
            blocking_ai.release.set()
            assert service.runs[live["runId"]].task is not None
            await service.runs[live["runId"]].task

    failing = AnalysisService(
        configured,
        ai_client=FailingAiClient(),  # type: ignore[arg-type]
        adapter=FakeAdapter(),  # type: ignore[arg-type]
        proxy_cache=FakeProxyCache(configured.proxy_cache_root),  # type: ignore[arg-type]
    )
    failed_request = {**request, "requestId": "00000000-0000-4000-8000-000000000011"}
    failed_app = create_app(configured, failing)
    async with failed_app.router.lifespan_context(failed_app):
        async with httpx.AsyncClient(
            transport=httpx.ASGITransport(app=failed_app), base_url="http://test"
        ) as client:
            accepted = await client.post("/v1/analyze-video", json=failed_request)
            failed_run = failing.runs[accepted.json()["runId"]]
            assert failed_run.task is not None
            await failed_run.task
            terminal = (await client.get(accepted.headers["location"])).json()
            assert terminal["phase"] == "failed"
            assert terminal["error"] == {
                "code": "ai_analysis_failed",
                "phase": "ai_tagging",
                "retryable": True,
                "upstreamHttpStatus": 503,
                "upstreamErrorCode": "MODEL_BUSY",
            }
            assert "sensitive" not in json.dumps(terminal)

            missing = await client.get(
                "/v1/analysis-runs/00000000-0000-4000-8000-000000000099"
            )
            assert missing.status_code == 404
            assert missing.json()["code"] == "run_not_found"
    assert "private-library-name.mp4" not in capsys.readouterr().out


def test_api_contract_has_no_authentication_scheme(tmp_path: Path) -> None:
    document = create_app(settings(tmp_path)).openapi()
    assert "securitySchemes" not in document.get("components", {})
    assert all(
        "security" not in operation
        for path in document["paths"].values()
        for operation in path.values()
    )
