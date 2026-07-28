from __future__ import annotations

import hashlib
import json
import time
from pathlib import Path
from uuid import UUID

from .errors import ServiceError
from .models import AnalyzeVideoRequest
from .proxy_cache import write_json_atomic


class IdempotencyStore:
    def __init__(self, cache_root: Path, ttl_seconds: int = 86_400) -> None:
        self.root = cache_root / "idempotency"
        self.ttl_seconds = ttl_seconds

    def fingerprint(self, request: AnalyzeVideoRequest) -> str:
        payload = request.model_dump(mode="json")
        encoded = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()
        return f"sha256:{hashlib.sha256(encoded).hexdigest()}"

    def replay(self, request: AnalyzeVideoRequest) -> dict[str, object] | None:
        path = self._path(request.requestId)
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            return None
        if time.time() - float(payload.get("completedAt", 0)) > self.ttl_seconds:
            path.unlink(missing_ok=True)
            return None
        if payload.get("requestFingerprint") != self.fingerprint(request):
            raise ServiceError(
                "invalid_request",
                "Request ID conflict",
                409,
                "The requestId was already used with different request parameters.",
            )
        response = payload.get("response")
        return response if isinstance(response, dict) else None

    def store(self, request: AnalyzeVideoRequest, response: dict[str, object]) -> None:
        self.root.mkdir(parents=True, exist_ok=True)
        write_json_atomic(
            self._path(request.requestId),
            {
                "requestFingerprint": self.fingerprint(request),
                "completedAt": time.time(),
                "response": response,
            },
        )

    def _path(self, request_id: UUID) -> Path:
        return self.root / f"{request_id}.json"
