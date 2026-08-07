from __future__ import annotations

import json
import os
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlparse


class ConfigurationError(ValueError):
    pass


@dataclass(frozen=True)
class Settings:
    media_roots: tuple[Path, ...]
    proxy_cache_root: Path
    model_cache_root: Path
    ai_server_base_url: str
    ai_path_from: Path
    ai_path_to: Path
    ai_timeout_seconds: float
    ai_catalog_cache_seconds: int
    max_queue_length: int
    cache_max_age_days: int
    cache_max_bytes: int
    log_level: str
    omnishotcut_mode: str
    omnishotcut_repo: Path
    omnishotcut_checkpoint: Path
    omnishotcut_revision: str
    omnishotcut_checkpoint_url: str
    omnishotcut_checkpoint_sha256: str
    omnishotcut_backbone: Path
    omnishotcut_backbone_url: str
    omnishotcut_backbone_sha256: str
    load_model: bool = True
    readiness_media_path: Path | None = None
    readiness_media_timeout_seconds: float = 10.0

    def map_ai_path(self, local_path: Path) -> Path:
        canonical = local_path.resolve(strict=False)
        try:
            relative = canonical.relative_to(self.ai_path_from)
        except ValueError as error:
            raise ConfigurationError("AI proxy path is outside the configured mapping") from error
        return self.ai_path_to / relative

    def redacted(self) -> dict[str, object]:
        return {
            "mediaRoots": ["[PATH]" for _ in self.media_roots],
            "proxyCacheRoot": "[PATH]",
            "modelCacheRoot": "[PATH]",
            "aiServerBaseUrl": "[URL]",
            "maxQueueLength": self.max_queue_length,
            "logLevel": self.log_level,
            "readinessMediaPathConfigured": self.readiness_media_path is not None,
        }


def load_settings(environ: dict[str, str] | None = None) -> Settings:
    env = os.environ if environ is None else environ

    try:
        media_values = json.loads(required(env, "SEGMENT_STUDIO_MEDIA_ROOTS"))
    except json.JSONDecodeError as error:
        raise ConfigurationError("SEGMENT_STUDIO_MEDIA_ROOTS must be a JSON array") from error
    if not isinstance(media_values, list) or not media_values:
        raise ConfigurationError("SEGMENT_STUDIO_MEDIA_ROOTS must be a non-empty JSON array")
    if not all(isinstance(item, str) for item in media_values):
        raise ConfigurationError("SEGMENT_STUDIO_MEDIA_ROOTS entries must be strings")

    media_roots = tuple(absolute_path(item, "SEGMENT_STUDIO_MEDIA_ROOTS") for item in media_values)
    proxy_root = absolute_path(
        required(env, "SEGMENT_STUDIO_PROXY_CACHE_ROOT"),
        "SEGMENT_STUDIO_PROXY_CACHE_ROOT",
    )
    model_root = absolute_path(
        required(env, "SEGMENT_STUDIO_MODEL_CACHE_ROOT"),
        "SEGMENT_STUDIO_MODEL_CACHE_ROOT",
    )
    ai_path_from = absolute_path(
        env.get("SEGMENT_STUDIO_AI_PATH_FROM", "/cache"),
        "SEGMENT_STUDIO_AI_PATH_FROM",
    )
    ai_path_to = absolute_path(
        env.get("SEGMENT_STUDIO_AI_PATH_TO", "/cache"),
        "SEGMENT_STUDIO_AI_PATH_TO",
    )
    if not is_under(proxy_root, ai_path_from):
        raise ConfigurationError(
            "SEGMENT_STUDIO_PROXY_CACHE_ROOT must be below SEGMENT_STUDIO_AI_PATH_FROM"
        )

    base_url = required(env, "SEGMENT_STUDIO_AI_SERVER_BASE_URL").rstrip("/")
    parsed_url = urlparse(base_url)
    if parsed_url.scheme not in {"http", "https"} or not parsed_url.netloc:
        raise ConfigurationError("SEGMENT_STUDIO_AI_SERVER_BASE_URL must be an HTTP(S) URL")

    mode = env.get("SEGMENT_STUDIO_OMNISHOTCUT_MODE", "clean_shot")
    if mode not in {"clean_shot", "default"}:
        raise ConfigurationError("SEGMENT_STUDIO_OMNISHOTCUT_MODE is invalid")

    checkpoint = absolute_path(
        env.get(
            "SEGMENT_STUDIO_OMNISHOTCUT_CHECKPOINT",
            str(model_root / "OmniShotCut_ckpt.pth"),
        ),
        "SEGMENT_STUDIO_OMNISHOTCUT_CHECKPOINT",
    )
    repo = absolute_path(
        env.get("SEGMENT_STUDIO_OMNISHOTCUT_REPO", "/opt/omnishotcut"),
        "SEGMENT_STUDIO_OMNISHOTCUT_REPO",
    )

    return Settings(
        media_roots=media_roots,
        proxy_cache_root=proxy_root,
        model_cache_root=model_root,
        ai_server_base_url=base_url,
        ai_path_from=ai_path_from,
        ai_path_to=ai_path_to,
        ai_timeout_seconds=number(env, "SEGMENT_STUDIO_AI_TIMEOUT_SECONDS", 0.0, minimum=0),
        ai_catalog_cache_seconds=integer(
            env, "SEGMENT_STUDIO_AI_CATALOG_CACHE_SECONDS", 60, minimum=0
        ),
        max_queue_length=integer(
            env, "SEGMENT_STUDIO_MAX_QUEUE_LENGTH", 4, minimum=0
        ),
        cache_max_age_days=integer(
            env, "SEGMENT_STUDIO_CACHE_MAX_AGE_DAYS", 30, minimum=1
        ),
        cache_max_bytes=integer(
            env, "SEGMENT_STUDIO_CACHE_MAX_BYTES", 53_687_091_200, minimum=1
        ),
        log_level=env.get("SEGMENT_STUDIO_LOG_LEVEL", "INFO").upper(),
        omnishotcut_mode=mode,
        omnishotcut_repo=repo,
        omnishotcut_checkpoint=checkpoint,
        omnishotcut_revision=env.get(
            "SEGMENT_STUDIO_OMNISHOTCUT_REVISION",
            "338c0e70a053fabc4d95a87e7b897c28aed65648",
        ),
        omnishotcut_checkpoint_url=env.get(
            "SEGMENT_STUDIO_OMNISHOTCUT_CHECKPOINT_URL",
            (
                "https://huggingface.co/uva-cv-lab/OmniShotCut/resolve/"
                "7f646c4ff4bb843e18c013481fb5d9ed2b068c6b/OmniShotCut_ckpt.pth"
            ),
        ),
        omnishotcut_checkpoint_sha256=env.get(
            "SEGMENT_STUDIO_OMNISHOTCUT_CHECKPOINT_SHA256",
            "5948ea78e00626c0e6c5e742e64873ef872cf4a5071d2a0841aed51c3e686cfa",
        ).lower(),
        omnishotcut_backbone=absolute_path(
            env.get(
                "SEGMENT_STUDIO_OMNISHOTCUT_BACKBONE",
                str(model_root / "torch" / "hub" / "checkpoints" / "resnet18-f37072fd.pth"),
            ),
            "SEGMENT_STUDIO_OMNISHOTCUT_BACKBONE",
        ),
        omnishotcut_backbone_url=env.get(
            "SEGMENT_STUDIO_OMNISHOTCUT_BACKBONE_URL",
            "https://download.pytorch.org/models/resnet18-f37072fd.pth",
        ),
        omnishotcut_backbone_sha256=env.get(
            "SEGMENT_STUDIO_OMNISHOTCUT_BACKBONE_SHA256",
            "f37072fd47e89c5e827621c5baffa7500819f7896bbacec160b1a16c560e07ec",
        ).lower(),
        load_model=parse_bool(env.get("SEGMENT_STUDIO_LOAD_MODEL", "true")),
        readiness_media_path=optional_absolute_path(
            env.get("SEGMENT_STUDIO_READINESS_MEDIA_PATH"),
            "SEGMENT_STUDIO_READINESS_MEDIA_PATH",
        ),
        readiness_media_timeout_seconds=number(
            env,
            "SEGMENT_STUDIO_READINESS_MEDIA_TIMEOUT_SECONDS",
            10.0,
            minimum=0.1,
        ),
    )


def required(env: dict[str, str] | os._Environ[str], key: str) -> str:
    value = env.get(key, "").strip()
    if not value:
        raise ConfigurationError(f"{key} is required")
    return value


def absolute_path(value: str, key: str) -> Path:
    path = Path(value)
    if not path.is_absolute():
        raise ConfigurationError(f"{key} must be absolute")
    return path.resolve(strict=False)


def optional_absolute_path(value: str | None, key: str) -> Path | None:
    if value is None or not value.strip():
        return None
    path = Path(value.strip())
    if not path.is_absolute():
        raise ConfigurationError(f"{key} must be absolute")
    return path


def is_under(path: Path, root: Path) -> bool:
    try:
        path.relative_to(root)
        return True
    except ValueError:
        return False


def integer(
    env: dict[str, str] | os._Environ[str], key: str, default: int, *, minimum: int
) -> int:
    try:
        value = int(env.get(key, str(default)))
    except ValueError as error:
        raise ConfigurationError(f"{key} must be an integer") from error
    if value < minimum:
        raise ConfigurationError(f"{key} must be at least {minimum}")
    return value


def number(
    env: dict[str, str] | os._Environ[str], key: str, default: float, *, minimum: float
) -> float:
    try:
        value = float(env.get(key, str(default)))
    except ValueError as error:
        raise ConfigurationError(f"{key} must be a number") from error
    if value < minimum:
        raise ConfigurationError(f"{key} must be at least {minimum}")
    return value


def parse_bool(value: str) -> bool:
    normalized = value.strip().lower()
    if normalized in {"1", "true", "yes"}:
        return True
    if normalized in {"0", "false", "no"}:
        return False
    raise ConfigurationError("SEGMENT_STUDIO_LOAD_MODEL must be a boolean")
