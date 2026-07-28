from __future__ import annotations

from pathlib import Path

import pytest

from segment_studio_analysis.errors import ServiceError
from segment_studio_analysis.model_cache import ensure_checkpoint, sha256
from segment_studio_analysis.models import AnalyzeVideoResponse
from segment_studio_analysis.omnishotcut import normalize_boundaries
from segment_studio_analysis.proxy_cache import cache_key, proxy_commands
from segment_studio_analysis.service import AnalysisGate
from segment_studio_analysis.source import SourceInfo


def source() -> SourceInfo:
    return SourceInfo(
        fingerprint="sha256:source",
        size_bytes=100,
        mtime_ns=200,
        duration_seconds=10.0,
        fps=25.0,
        width=1920,
        height=1080,
        frame_count=250,
    )


def test_cache_key_is_stable_and_settings_sensitive() -> None:
    assert cache_key(source()) == cache_key(source())
    changed = SourceInfo(**{**source().__dict__, "fingerprint": "sha256:changed"})
    assert cache_key(changed) != cache_key(source())


def test_proxy_commands_cover_combined_and_single_output_paths() -> None:
    combined = proxy_commands(
        Path("/media/input.mp4"),
        Path("/cache/ai.mp4"),
        Path("/cache/osc.mp4"),
        source(),
        need_ai=True,
        need_omnishotcut=True,
    )
    assert len(combined) == 2
    assert combined[0].count("-i") == 1
    assert "split=2" in combined[0][combined[0].index("-filter_complex") + 1]
    assert "h264_nvenc" in combined[0]
    assert "libx264" in combined[0]
    ai_only = proxy_commands(
        Path("/media/input.mp4"),
        Path("/cache/ai.mp4"),
        Path("/cache/osc.mp4"),
        source(),
        need_ai=True,
        need_omnishotcut=False,
    )
    assert len(ai_only) == 2
    assert all("/cache/osc.mp4" not in command for command in ai_only)
    osc_only = proxy_commands(
        Path("/media/input.mp4"),
        Path("/cache/ai.mp4"),
        Path("/cache/osc.mp4"),
        source(),
        need_ai=False,
        need_omnishotcut=True,
    )
    assert len(osc_only) == 1
    assert "libx264" in osc_only[0]


def test_inclusive_ranges_form_full_duration_partition() -> None:
    boundaries, counts = normalize_boundaries(
        {
            "fps": 10,
            "frame_count": 100,
            "ranges": [[10, 29], [35, 59], [60, 89]],
            "intra_labels": ["General", "General", "General"],
            "inter_labels": ["Cut_A", "Cut_B", "Cut_C"],
        },
        10.0,
    )
    assert boundaries[0]["startSeconds"] == 0
    assert boundaries[-1]["endSeconds"] == 10.0
    assert all(
        current["endSeconds"] == following["startSeconds"]
        for current, following in zip(boundaries, boundaries[1:], strict=False)
    )
    assert all(item["endSeconds"] > item["startSeconds"] for item in boundaries)
    assert counts["intra"] == {"General": 3}


def test_checkpoint_download_is_checksum_verified_and_reused(tmp_path: Path) -> None:
    source_path = tmp_path / "download.pth"
    source_path.write_bytes(b"checkpoint")
    target = tmp_path / "models" / "checkpoint.pth"
    digest = sha256(source_path)
    ensure_checkpoint(target, source_path.as_uri(), digest)
    assert target.read_bytes() == b"checkpoint"
    source_path.write_bytes(b"changed-upstream")
    ensure_checkpoint(target, source_path.as_uri(), digest)
    assert target.read_bytes() == b"checkpoint"


async def test_zero_length_queue_rejects_waiter() -> None:
    gate = AnalysisGate(0)
    await gate.__aenter__()
    try:
        with pytest.raises(ServiceError) as caught:
            await gate.__aenter__()
        assert caught.value.code == "service_busy"
        assert caught.value.status == 429
    finally:
        await gate.__aexit__()


def test_golden_response_matches_public_response_model() -> None:
    fixture = Path(__file__).parents[1] / "fixtures" / "golden-response.json"
    response = AnalyzeVideoResponse.model_validate_json(fixture.read_text(encoding="utf-8"))
    assert response.schemaVersion == "1"
    assert response.omnishotcut is not None
    assert response.omnishotcut.boundaries[-1].endSeconds == 10
