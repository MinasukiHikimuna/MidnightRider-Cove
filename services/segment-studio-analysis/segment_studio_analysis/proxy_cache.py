from __future__ import annotations

import fcntl
import hashlib
import json
import os
import signal
import shutil
import subprocess
import time
from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path
from typing import Iterator
from uuid import uuid4

from .errors import ServiceError
from .source import SourceInfo, positive_float, positive_int, positive_rate


SETTINGS_VERSION = "analysis-proxies-v1"
FFMPEG_BEHAVIOR_VERSION = "one-decode-v1"
AI_WIDTH = 512
AI_FPS = 0.5
OSC_WIDTH = 128
OSC_HEIGHT = 96


@dataclass(frozen=True)
class ProxyInfo:
    path: Path
    width: int
    height: int
    fps: float
    cache_hit: bool
    size_bytes: int

    def public(self) -> dict[str, object]:
        return {
            "width": self.width,
            "height": self.height,
            "fps": self.fps,
            "cacheHit": self.cache_hit,
            "sizeBytes": self.size_bytes,
        }


@dataclass(frozen=True)
class ProxySet:
    cache_key: str
    ai: ProxyInfo | None
    omnishotcut: ProxyInfo | None

    def public(self) -> dict[str, object]:
        result: dict[str, object] = {
            "cacheKey": self.cache_key,
            "settingsVersion": SETTINGS_VERSION,
        }
        if self.ai:
            result["ai"] = self.ai.public()
        if self.omnishotcut:
            result["omnishotcut"] = self.omnishotcut.public()
        return result


def cache_key(source: SourceInfo) -> str:
    payload = {
        "sourceFingerprint": source.fingerprint,
        "proxySettingsVersion": SETTINGS_VERSION,
        "ffmpegBehaviorVersion": FFMPEG_BEHAVIOR_VERSION,
        "ai": {"width": AI_WIDTH, "fps": AI_FPS, "heightPolicy": "preserve-even"},
        "omnishotcut": {
            "width": OSC_WIDTH,
            "height": OSC_HEIGHT,
            "fpsPolicy": "source",
        },
    }
    encoded = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()
    return hashlib.sha256(encoded).hexdigest()


def cache_directory(root: Path, key: str) -> Path:
    return root / key[:2] / key[2:]


class ProxyCache:
    def __init__(
        self,
        root: Path,
        *,
        max_age_days: int = 30,
        max_bytes: int = 53_687_091_200,
    ) -> None:
        self.root = root
        self.max_age_seconds = max_age_days * 86_400
        self.max_bytes = max_bytes
        self.active_processes: set[subprocess.Popen[str]] = set()

    def ensure(
        self,
        source_path: Path,
        source: SourceInfo,
        *,
        need_ai: bool,
        need_omnishotcut: bool,
    ) -> ProxySet:
        key = cache_key(source)
        directory = cache_directory(self.root, key)
        directory.mkdir(parents=True, exist_ok=True)
        with file_lock(directory / ".lock"):
            source_metadata = {
                "fingerprint": source.fingerprint,
                "sizeBytes": source.size_bytes,
                "mtimeNs": source.mtime_ns,
            }
            write_json_atomic(directory / "source.json", source_metadata)
            ai = self._cached_proxy(directory, "ai", source) if need_ai else None
            osc = (
                self._cached_proxy(directory, "omnishotcut", source)
                if need_omnishotcut
                else None
            )
            missing_ai = need_ai and ai is None
            missing_osc = need_omnishotcut and osc is None
            if missing_ai or missing_osc:
                generated = self._generate(
                    source_path,
                    source,
                    directory,
                    need_ai=missing_ai,
                    need_omnishotcut=missing_osc,
                )
                ai = generated.ai if missing_ai else ai
                osc = generated.omnishotcut if missing_osc else osc
            os.utime(directory, None)
            result = ProxySet(cache_key=key, ai=ai, omnishotcut=osc)
        self.cleanup(exclude=directory)
        return result

    def _cached_proxy(
        self, directory: Path, name: str, source: SourceInfo
    ) -> ProxyInfo | None:
        media_path = directory / f"{name}-proxy.mp4"
        metadata_path = directory / f"{name}-proxy.json"
        try:
            metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            return None
        if not media_path.is_file() or not metadata_matches(metadata, name, source):
            return None
        try:
            actual = probe_proxy(media_path)
        except ServiceError:
            return None
        if (
            actual["width"] != metadata["width"]
            or actual["height"] != metadata["height"]
            or abs(float(actual["fps"]) - float(metadata["fps"])) > 0.01
        ):
            return None
        return ProxyInfo(
            path=media_path,
            width=int(metadata["width"]),
            height=int(metadata["height"]),
            fps=float(metadata["fps"]),
            cache_hit=True,
            size_bytes=media_path.stat().st_size,
        )

    def _generate(
        self,
        source_path: Path,
        source: SourceInfo,
        directory: Path,
        *,
        need_ai: bool,
        need_omnishotcut: bool,
    ) -> ProxySet:
        unique = uuid4().hex
        ai_temp = directory / f".ai-proxy.{unique}.tmp.mp4"
        osc_temp = directory / f".omnishotcut-proxy.{unique}.tmp.mp4"
        outputs = [path for needed, path in ((need_ai, ai_temp), (need_omnishotcut, osc_temp)) if needed]
        try:
            commands = proxy_commands(
                source_path,
                ai_temp,
                osc_temp,
                source,
                need_ai=need_ai,
                need_omnishotcut=need_omnishotcut,
            )
            try:
                self._run(commands[0])
            except ServiceError:
                if len(commands) == 1:
                    raise
                for path in outputs:
                    path.unlink(missing_ok=True)
                self._run(commands[1])

            validated: list[tuple[Path, str, dict[str, float | int]]] = []
            if need_ai:
                validated.append(
                    (ai_temp, "ai", self._validate_temp(ai_temp, "ai", source))
                )
            if need_omnishotcut:
                validated.append(
                    (
                        osc_temp,
                        "omnishotcut",
                        self._validate_temp(osc_temp, "omnishotcut", source),
                    )
                )
            promoted = {
                name: self._promote(temporary, directory, name, source, actual)
                for temporary, name, actual in validated
            }
            ai_info = promoted.get("ai")
            osc_info = promoted.get("omnishotcut")
            return ProxySet(cache_key=cache_key(source), ai=ai_info, omnishotcut=osc_info)
        except ServiceError:
            raise
        except Exception as error:
            raise ServiceError(
                "proxy_generation_failed",
                "Proxy generation failed",
                500,
                "The analysis proxies could not be prepared.",
                retryable=True,
            ) from error
        finally:
            for path in outputs:
                path.unlink(missing_ok=True)

    def _validate_temp(
        self, temporary: Path, name: str, source: SourceInfo
    ) -> dict[str, float | int]:
        actual = probe_proxy(temporary)
        expected_width = AI_WIDTH if name == "ai" else OSC_WIDTH
        expected_fps = AI_FPS if name == "ai" else source.fps
        if int(actual["width"]) != expected_width:
            raise proxy_failure()
        if name == "omnishotcut" and int(actual["height"]) != OSC_HEIGHT:
            raise proxy_failure()
        if abs(float(actual["fps"]) - expected_fps) > 0.01:
            raise proxy_failure()
        return actual

    def _promote(
        self,
        temporary: Path,
        directory: Path,
        name: str,
        source: SourceInfo,
        actual: dict[str, float | int],
    ) -> ProxyInfo:
        destination = directory / f"{name}-proxy.mp4"
        os.replace(temporary, destination)
        metadata = {
            "sourceFingerprint": source.fingerprint,
            "settingsVersion": SETTINGS_VERSION,
            "ffmpegBehaviorVersion": FFMPEG_BEHAVIOR_VERSION,
            "width": int(actual["width"]),
            "height": int(actual["height"]),
            "fps": float(actual["fps"]),
        }
        write_json_atomic(directory / f"{name}-proxy.json", metadata)
        return ProxyInfo(
            path=destination,
            width=int(actual["width"]),
            height=int(actual["height"]),
            fps=float(actual["fps"]),
            cache_hit=False,
            size_bytes=destination.stat().st_size,
        )

    def _run(self, command: list[str]) -> None:
        try:
            process = subprocess.Popen(
                command,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.PIPE,
                text=True,
                start_new_session=True,
            )
            self.active_processes.add(process)
            _, stderr = process.communicate()
            if process.returncode:
                raise proxy_failure(stderr)
        except FileNotFoundError as error:
            raise proxy_failure() from error
        finally:
            if "process" in locals():
                self.active_processes.discard(process)

    def terminate(self) -> None:
        for process in list(self.active_processes):
            if process.poll() is None:
                os.killpg(process.pid, signal.SIGTERM)

    def cleanup(self, *, exclude: Path | None = None) -> None:
        now = time.time()
        entries: list[tuple[Path, float, int]] = []
        if not self.root.is_dir():
            return
        for prefix in self.root.iterdir():
            if not prefix.is_dir() or len(prefix.name) != 2:
                continue
            for directory in prefix.iterdir():
                if not directory.is_dir() or directory == exclude:
                    continue
                try:
                    stat = directory.stat()
                    size = sum(
                        item.stat().st_size
                        for item in directory.rglob("*")
                        if item.is_file()
                    )
                except OSError:
                    continue
                entries.append((directory, stat.st_atime, size))

        total = sum(size for _, _, size in entries)
        for directory, accessed, size in sorted(entries, key=lambda item: item[1]):
            expired = now - accessed > self.max_age_seconds
            oversized = total > self.max_bytes
            if not expired and not oversized:
                continue
            if remove_if_unlocked(directory):
                total -= size


def metadata_matches(metadata: dict[str, object], name: str, source: SourceInfo) -> bool:
    return (
        metadata.get("sourceFingerprint") == source.fingerprint
        and metadata.get("settingsVersion") == SETTINGS_VERSION
        and metadata.get("ffmpegBehaviorVersion") == FFMPEG_BEHAVIOR_VERSION
        and metadata.get("width") == (AI_WIDTH if name == "ai" else OSC_WIDTH)
        and (
            name != "omnishotcut"
            or metadata.get("height") == OSC_HEIGHT
        )
        and abs(
            float(metadata.get("fps", -1))
            - (AI_FPS if name == "ai" else source.fps)
        )
        <= 0.01
    )


def proxy_commands(
    source_path: Path,
    ai_path: Path,
    osc_path: Path,
    source: SourceInfo,
    *,
    need_ai: bool,
    need_omnishotcut: bool,
) -> list[list[str]]:
    if need_ai and need_omnishotcut:
        cuda = base_command(source_path, hardware=True) + [
            "-filter_complex",
            (
                "[0:v]split=2[ai0][osc0];"
                "[ai0]scale_cuda=512:-2,hwdownload,format=nv12,fps=1/2[ai];"
                "[osc0]scale_cuda=128:96,hwdownload,format=yuv420p[osc]"
            ),
            "-map", "[ai]", "-an", "-c:v", "h264_nvenc", "-preset", "p4",
            "-cq", "28", "-movflags", "+faststart", str(ai_path),
            "-map", "[osc]", "-an", "-c:v", "libx264", "-preset", "ultrafast",
            "-crf", "28", "-movflags", "+faststart", str(osc_path),
        ]
        software = base_command(source_path) + [
            "-filter_complex",
            (
                "[0:v]split=2[ai0][osc0];"
                "[ai0]fps=1/2,scale=512:-2[ai];"
                "[osc0]scale=128:96[osc]"
            ),
            "-map", "[ai]", "-an", "-c:v", "libx264", "-preset", "ultrafast",
            "-crf", "28", "-movflags", "+faststart", str(ai_path),
            "-map", "[osc]", "-an", "-c:v", "libx264", "-preset", "ultrafast",
            "-crf", "28", "-movflags", "+faststart", str(osc_path),
        ]
        return [cuda, software]
    if need_ai:
        cuda = base_command(source_path, hardware=True) + [
            "-vf", "scale_cuda=512:-2,hwdownload,format=nv12,fps=1/2",
            "-an", "-c:v", "h264_nvenc", "-preset", "p4", "-cq", "28",
            "-movflags", "+faststart", str(ai_path),
        ]
        software = base_command(source_path) + [
            "-vf", "fps=1/2,scale=512:-2", "-an", "-c:v", "libx264",
            "-preset", "ultrafast", "-crf", "28", "-movflags", "+faststart",
            str(ai_path),
        ]
        return [cuda, software]
    return [
        base_command(source_path) + [
            "-vf", "scale=128:96", "-an", "-c:v", "libx264",
            "-preset", "ultrafast", "-crf", "28", "-movflags", "+faststart",
            str(osc_path),
        ]
    ]


def base_command(source_path: Path, hardware: bool = False) -> list[str]:
    result = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error"]
    if hardware:
        result += ["-hwaccel", "cuda", "-hwaccel_output_format", "cuda"]
    return result + ["-i", str(source_path)]


def probe_proxy(path: Path) -> dict[str, float | int]:
    try:
        result = subprocess.run(
            [
                "ffprobe", "-v", "error", "-select_streams", "v:0",
                "-show_entries", "stream=width,height,avg_frame_rate",
                "-of", "json", str(path),
            ],
            check=True,
            capture_output=True,
            text=True,
        )
        stream = json.loads(result.stdout)["streams"][0]
        width = positive_int(stream.get("width"))
        height = positive_int(stream.get("height"))
        fps = positive_rate(stream.get("avg_frame_rate"))
        if width is None or height is None or fps is None:
            raise ValueError
        return {"width": width, "height": height, "fps": fps}
    except (FileNotFoundError, subprocess.CalledProcessError, json.JSONDecodeError, KeyError, IndexError, ValueError) as error:
        raise proxy_failure() from error


def proxy_failure(internal_detail: str | None = None) -> ServiceError:
    error = ServiceError(
        "proxy_generation_failed",
        "Proxy generation failed",
        500,
        "The analysis proxies could not be prepared.",
        retryable=True,
    )
    if internal_detail:
        error.__notes__ = [internal_detail[-4000:]]
    return error


@contextmanager
def file_lock(path: Path) -> Iterator[None]:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a+", encoding="utf-8") as handle:
        fcntl.flock(handle, fcntl.LOCK_EX)
        try:
            yield
        finally:
            fcntl.flock(handle, fcntl.LOCK_UN)


def write_json_atomic(path: Path, payload: dict[str, object]) -> None:
    temporary = path.with_name(f".{path.name}.{uuid4().hex}.tmp")
    try:
        temporary.write_text(
            json.dumps(payload, sort_keys=True, separators=(",", ":")) + "\n",
            encoding="utf-8",
        )
        os.replace(temporary, path)
    finally:
        temporary.unlink(missing_ok=True)


def remove_if_unlocked(directory: Path) -> bool:
    lock_path = directory / ".lock"
    try:
        with lock_path.open("a+", encoding="utf-8") as handle:
            try:
                fcntl.flock(handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
            except BlockingIOError:
                return False
            try:
                shutil.rmtree(directory)
                return True
            finally:
                fcntl.flock(handle, fcntl.LOCK_UN)
    except OSError:
        return False
