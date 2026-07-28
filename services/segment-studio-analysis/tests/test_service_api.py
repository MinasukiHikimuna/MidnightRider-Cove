from __future__ import annotations

import json
from pathlib import Path
from typing import Any
from uuid import UUID

import httpx

from segment_studio_analysis.ai import AiClient
from segment_studio_analysis.config import Settings
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
        token="t" * 32,
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


async def test_health_auth_validation_and_combined_golden(
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

    monkeypatch.setattr("segment_studio_analysis.service.run_in_thread", run_inline)
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
            assert (await client.post("/v1/analyze-video", json=request)).status_code == 401
            response = await client.post(
                "/v1/analyze-video",
                json=request,
                headers={"Authorization": f"Bearer {configured.token}"},
            )
            assert response.status_code == 200, response.text
            payload = response.json()
            assert payload["schemaVersion"] == "1"
            assert payload["source"]["fingerprint"] == "sha256:source"
            assert payload["ai"]["segments"][0]["tagName"] == "example"
            assert payload["omnishotcut"]["boundaries"][0]["startSeconds"] == 0
            assert payload["omnishotcut"]["boundaries"][-1]["endSeconds"] == 10
            assert "sourcePath" not in json.dumps(payload)

            replay = await client.post(
                "/v1/analyze-video",
                json=request,
                headers={"Authorization": f"Bearer {configured.token}"},
            )
            assert replay.json() == payload
            assert fake_ai.analyze_calls == 1

            conflicting = {**request, "analyses": ["aiTagging"]}
            conflict = await client.post(
                "/v1/analyze-video",
                json=conflicting,
                headers={"Authorization": f"Bearer {configured.token}"},
            )
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
                headers={"Authorization": f"Bearer {configured.token}"},
            )
    assert response.status_code == 400
    assert response.json()["code"] == "invalid_request"
