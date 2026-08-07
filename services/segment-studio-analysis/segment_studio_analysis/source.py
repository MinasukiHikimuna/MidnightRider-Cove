from __future__ import annotations

import hashlib
import json
import stat
import subprocess
from dataclasses import asdict, dataclass
from fractions import Fraction
from pathlib import Path

from .config import is_under
from .errors import ServiceError


@dataclass(frozen=True)
class SourceInfo:
    fingerprint: str
    size_bytes: int
    mtime_ns: int
    duration_seconds: float
    fps: float
    width: int
    height: int
    frame_count: int

    def public(self) -> dict[str, object]:
        return {
            "fingerprint": self.fingerprint,
            "sizeBytes": self.size_bytes,
            "mtimeNs": self.mtime_ns,
            "durationSeconds": self.duration_seconds,
            "fps": self.fps,
            "width": self.width,
            "height": self.height,
            "frameCount": self.frame_count,
        }


def resolve_source(source_path: str, allowed_roots: tuple[Path, ...]) -> Path:
    unresolved = Path(source_path)
    try:
        resolved = unresolved.resolve(strict=True)
    except FileNotFoundError as error:
        raise ServiceError(
            "source_not_found",
            "Source not found",
            404,
            "The requested source file does not exist.",
        ) from error
    except PermissionError as error:
        raise source_not_readable() from error
    except OSError as error:
        raise source_unavailable() from error
    try:
        source_stat = resolved.stat()
    except PermissionError as error:
        raise source_not_readable() from error
    except OSError as error:
        raise source_unavailable() from error
    if not stat.S_ISREG(source_stat.st_mode):
        raise ServiceError(
            "source_not_found", "Source not found", 404, "The requested source is not a file."
        )
    if not any(is_under(resolved, root) for root in allowed_roots):
        raise ServiceError(
            "source_not_allowed",
            "Source not allowed",
            403,
            "The requested source is outside the configured media roots.",
        )
    try:
        with resolved.open("rb") as source:
            source.read(1)
    except FileNotFoundError as error:
        raise ServiceError(
            "source_not_found",
            "Source not found",
            404,
            "The requested source file does not exist.",
        ) from error
    except PermissionError as error:
        raise source_not_readable() from error
    except OSError as error:
        raise source_unavailable() from error
    return resolved


def source_not_readable() -> ServiceError:
    return ServiceError(
        "source_not_readable",
        "Source not readable",
        403,
        "The analysis service cannot read the requested source file.",
    )


def source_unavailable() -> ServiceError:
    return ServiceError(
        "source_unavailable",
        "Source unavailable",
        503,
        "The requested source file is temporarily unavailable.",
        retryable=True,
    )


def source_fingerprint(path: Path) -> tuple[str, int, int]:
    stat = path.stat()
    payload = {
        "canonicalPath": str(path.resolve(strict=True)),
        "sizeBytes": stat.st_size,
        "mtimeNs": stat.st_mtime_ns,
    }
    encoded = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}", stat.st_size, stat.st_mtime_ns


def probe_source(path: Path, timeout_seconds: float | None = None) -> SourceInfo:
    command = [
        "ffprobe",
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=width,height,avg_frame_rate,r_frame_rate,nb_frames,duration",
        "-show_entries",
        "format=duration",
        "-of",
        "json",
        str(path),
    ]
    try:
        completed = subprocess.run(
            command,
            check=True,
            capture_output=True,
            text=True,
            timeout=timeout_seconds,
        )
        payload = json.loads(completed.stdout)
        stream = payload["streams"][0]
        duration = positive_float(stream.get("duration")) or positive_float(
            payload.get("format", {}).get("duration")
        )
        fps = positive_rate(stream.get("avg_frame_rate")) or positive_rate(
            stream.get("r_frame_rate")
        )
        width = positive_int(stream.get("width"))
        height = positive_int(stream.get("height"))
        frame_count = positive_int(stream.get("nb_frames"))
        if frame_count is None and duration is not None and fps is not None:
            frame_count = round(duration * fps)
        if None in {duration, fps, width, height, frame_count}:
            raise ValueError("required video metadata is missing")
    except subprocess.TimeoutExpired as error:
        raise ServiceError(
            "probe_timeout",
            "Source probe timed out",
            504,
            "The source video metadata probe exceeded its time limit.",
            retryable=True,
        ) from error
    except (FileNotFoundError, subprocess.CalledProcessError, json.JSONDecodeError, ValueError, IndexError, KeyError) as error:
        raise ServiceError(
            "probe_failed",
            "Source probe failed",
            422,
            "The source video metadata could not be read.",
        ) from error
    try:
        fingerprint, size, mtime_ns = source_fingerprint(path)
    except FileNotFoundError as error:
        raise ServiceError(
            "source_not_found",
            "Source not found",
            404,
            "The requested source file does not exist.",
        ) from error
    except PermissionError as error:
        raise source_not_readable() from error
    except OSError as error:
        raise source_unavailable() from error
    return SourceInfo(
        fingerprint=fingerprint,
        size_bytes=size,
        mtime_ns=mtime_ns,
        duration_seconds=float(duration),
        fps=float(fps),
        width=int(width),
        height=int(height),
        frame_count=int(frame_count),
    )


def positive_rate(value: object) -> float | None:
    if not isinstance(value, str) or value in {"", "0/0"}:
        return None
    try:
        parsed = float(Fraction(value))
    except (ValueError, ZeroDivisionError):
        return None
    return parsed if parsed > 0 else None


def positive_float(value: object) -> float | None:
    try:
        parsed = float(value)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return None
    return parsed if parsed > 0 else None


def positive_int(value: object) -> int | None:
    try:
        parsed = int(value)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return None
    return parsed if parsed > 0 else None
