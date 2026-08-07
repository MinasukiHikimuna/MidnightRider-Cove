from __future__ import annotations

import json
import subprocess
from pathlib import Path

import pytest

from segment_studio_analysis.config import ConfigurationError, load_settings
from segment_studio_analysis.errors import ServiceError
from segment_studio_analysis.source import probe_source, resolve_source, source_fingerprint


def valid_environment(tmp_path: Path) -> dict[str, str]:
    media = tmp_path / "media"
    media.mkdir()
    return {
        "SEGMENT_STUDIO_MEDIA_ROOTS": json.dumps([str(media)]),
        "SEGMENT_STUDIO_PROXY_CACHE_ROOT": str(tmp_path / "cache" / "proxies"),
        "SEGMENT_STUDIO_MODEL_CACHE_ROOT": str(tmp_path / "cache" / "models"),
        "SEGMENT_STUDIO_AI_SERVER_BASE_URL": "http://ai-server:8000",
        "SEGMENT_STUDIO_AI_PATH_FROM": str(tmp_path / "cache"),
        "SEGMENT_STUDIO_AI_PATH_TO": "/cache",
        "SEGMENT_STUDIO_LOAD_MODEL": "false",
    }


def test_load_settings_validates_and_redacts_environment_details(tmp_path: Path) -> None:
    environment = valid_environment(tmp_path)
    media_probe = tmp_path / "media" / "readiness.mp4"
    environment["SEGMENT_STUDIO_READINESS_MEDIA_PATH"] = str(media_probe)
    environment["SEGMENT_STUDIO_READINESS_MEDIA_TIMEOUT_SECONDS"] = "3.5"
    settings = load_settings(environment)
    assert "token" not in settings.redacted()
    assert "ai-server" not in str(settings.redacted())
    assert str(media_probe) not in str(settings.redacted())
    assert settings.redacted()["readinessMediaPathConfigured"] is True
    assert settings.readiness_media_path == media_probe
    assert settings.readiness_media_timeout_seconds == 3.5
    assert settings.map_ai_path(settings.proxy_cache_root / "a.mp4") == Path(
        "/cache/proxies/a.mp4"
    )


@pytest.mark.parametrize(
    ("key", "value"),
    [
        ("SEGMENT_STUDIO_MEDIA_ROOTS", "not-json"),
        ("SEGMENT_STUDIO_PROXY_CACHE_ROOT", "relative"),
        ("SEGMENT_STUDIO_AI_SERVER_BASE_URL", "not-a-url"),
        ("SEGMENT_STUDIO_READINESS_MEDIA_PATH", "relative"),
        ("SEGMENT_STUDIO_READINESS_MEDIA_TIMEOUT_SECONDS", "-1"),
    ],
)
def test_load_settings_rejects_invalid_values(
    tmp_path: Path, key: str, value: str
) -> None:
    environment = valid_environment(tmp_path)
    environment[key] = value
    with pytest.raises(ConfigurationError):
        load_settings(environment)


def test_allowed_root_rejects_symlink_escape(tmp_path: Path) -> None:
    root = tmp_path / "media"
    root.mkdir()
    outside = tmp_path / "private.mp4"
    outside.write_bytes(b"x")
    link = root / "escape.mp4"
    link.symlink_to(outside)
    with pytest.raises(ServiceError) as caught:
        resolve_source(str(link), (root.resolve(),))
    assert caught.value.code == "source_not_allowed"


def test_resolve_source_reports_permission_denied_without_exposing_path(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    root = tmp_path / "media"
    root.mkdir()
    source = root / "private-library-name.mp4"
    canonical_root = root.resolve()
    original_resolve = Path.resolve

    def deny_source(path: Path, strict: bool = False) -> Path:
        if path == source:
            raise PermissionError("private-library-name.mp4")
        return original_resolve(path, strict=strict)

    monkeypatch.setattr(Path, "resolve", deny_source)
    with pytest.raises(ServiceError) as caught:
        resolve_source(str(source), (canonical_root,))

    assert caught.value.code == "source_not_readable"
    assert caught.value.status == 403
    assert "private-library-name.mp4" not in caught.value.detail


def test_probe_source_reports_a_sanitized_timeout(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    source = tmp_path / "private-library-name.mp4"
    source.write_bytes(b"video")

    def time_out(*args: object, **kwargs: object) -> None:
        assert kwargs["timeout"] == 3.5
        raise subprocess.TimeoutExpired(args[0], 3.5)

    monkeypatch.setattr("segment_studio_analysis.source.subprocess.run", time_out)
    with pytest.raises(ServiceError) as caught:
        probe_source(source, timeout_seconds=3.5)

    assert caught.value.code == "probe_timeout"
    assert caught.value.status == 504
    assert caught.value.retryable is True
    assert "private-library-name.mp4" not in caught.value.detail


def test_source_fingerprint_is_stable_and_changes_with_stat(tmp_path: Path) -> None:
    source = tmp_path / "source.mp4"
    source.write_bytes(b"first")
    first = source_fingerprint(source)
    assert first == source_fingerprint(source)
    source.write_bytes(b"second-version")
    second = source_fingerprint(source)
    assert second[0] != first[0]
    assert second[1] != first[1]
