from __future__ import annotations

import json
from pathlib import Path

import pytest

from segment_studio_analysis.config import ConfigurationError, load_settings
from segment_studio_analysis.errors import ServiceError
from segment_studio_analysis.source import resolve_source, source_fingerprint


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
    settings = load_settings(valid_environment(tmp_path))
    assert "token" not in settings.redacted()
    assert "ai-server" not in str(settings.redacted())
    assert settings.map_ai_path(settings.proxy_cache_root / "a.mp4") == Path(
        "/cache/proxies/a.mp4"
    )


@pytest.mark.parametrize(
    ("key", "value"),
    [
        ("SEGMENT_STUDIO_MEDIA_ROOTS", "not-json"),
        ("SEGMENT_STUDIO_PROXY_CACHE_ROOT", "relative"),
        ("SEGMENT_STUDIO_AI_SERVER_BASE_URL", "not-a-url"),
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


def test_source_fingerprint_is_stable_and_changes_with_stat(tmp_path: Path) -> None:
    source = tmp_path / "source.mp4"
    source.write_bytes(b"first")
    first = source_fingerprint(source)
    assert first == source_fingerprint(source)
    source.write_bytes(b"second-version")
    second = source_fingerprint(source)
    assert second[0] != first[0]
    assert second[1] != first[1]
