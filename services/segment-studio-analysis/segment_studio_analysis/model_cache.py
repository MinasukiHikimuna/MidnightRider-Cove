from __future__ import annotations

import hashlib
import os
import urllib.request
from pathlib import Path
from uuid import uuid4


def ensure_checkpoint(path: Path, url: str, expected_sha256: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.is_file() and sha256(path) == expected_sha256:
        return
    temporary = path.with_name(f".{path.name}.{uuid4().hex}.tmp")
    try:
        with urllib.request.urlopen(url, timeout=3600) as response:
            with temporary.open("wb") as output:
                while chunk := response.read(1024 * 1024):
                    output.write(chunk)
        if sha256(temporary) != expected_sha256:
            raise ValueError("OmniShotCut checkpoint checksum mismatch")
        os.replace(temporary, path)
    finally:
        temporary.unlink(missing_ok=True)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        while chunk := handle.read(1024 * 1024):
            digest.update(chunk)
    return digest.hexdigest()
