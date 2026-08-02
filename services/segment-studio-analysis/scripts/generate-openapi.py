from __future__ import annotations

import json
from pathlib import Path

from segment_studio_analysis.config import load_settings
from segment_studio_analysis.main import create_app


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    private = root / ".openapi-private"
    environment = {
        "SEGMENT_STUDIO_MEDIA_ROOTS": json.dumps([str(private / "media")]),
        "SEGMENT_STUDIO_PROXY_CACHE_ROOT": str(private / "cache" / "proxies"),
        "SEGMENT_STUDIO_MODEL_CACHE_ROOT": str(private / "cache" / "models"),
        "SEGMENT_STUDIO_AI_SERVER_BASE_URL": "http://ai-server.invalid",
        "SEGMENT_STUDIO_AI_PATH_FROM": str(private / "cache"),
        "SEGMENT_STUDIO_AI_PATH_TO": "/cache",
        "SEGMENT_STUDIO_LOAD_MODEL": "false",
    }
    document = create_app(load_settings(environment)).openapi()
    (root / "openapi.json").write_text(
        json.dumps(document, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
