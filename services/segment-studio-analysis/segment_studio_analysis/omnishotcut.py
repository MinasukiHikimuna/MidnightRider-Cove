from __future__ import annotations

import importlib
import os
import sys
from collections import Counter
from pathlib import Path
from types import ModuleType
from typing import Any

from .errors import ServiceError


class OmniShotCutAdapter:
    def __init__(self, repo: Path, checkpoint: Path, revision: str) -> None:
        self.repo = repo
        self.checkpoint = checkpoint
        self.revision = revision
        self.module: ModuleType | None = None
        self.model: Any = None
        self.model_args: Any = None

    def load(self) -> None:
        if not self.repo.is_dir() or not self.checkpoint.is_file():
            raise FileNotFoundError("OmniShotCut source or checkpoint is unavailable")
        os.environ.setdefault("TORCH_HOME", str(self.checkpoint.parent / "torch"))
        if str(self.repo) not in sys.path:
            sys.path.insert(0, str(self.repo))
        self.module = importlib.import_module("test_code.inference")
        self.model, self.model_args = self.module.load_model(str(self.checkpoint))

    def analyze(self, path: Path, mode: str, num_context_frames: int) -> dict[str, Any]:
        if self.module is None or self.model is None:
            raise ServiceError(
                "model_not_ready", "Model not ready", 503,
                "The OmniShotCut model is not ready.", True,
            )
        try:
            ranges, intra, inter, frames, fps = self.module.single_video_inference(
                str(path), self.model, self.model_args, num_context_frames
            )
            if mode == "clean_shot":
                general = self.module.unique_intra_label_mapping["general"]
                selected = [
                    (frame_range, intra_label, inter_label)
                    for frame_range, intra_label, inter_label in zip(ranges, intra, inter, strict=True)
                    if intra_label == general
                ]
                ranges = [item[0] for item in selected]
                intra = [item[1] for item in selected]
                inter = [item[2] for item in selected]
            intra_names = [self.module.intra_int2string.get(int(x), f"Unknown_{x}") for x in intra]
            inter_names = [self.module.inter_int2string.get(int(x), f"Unknown_{x}") for x in inter]
            return {
                "fps": float(fps),
                "frame_count": len(frames),
                "ranges": [[int(start), int(end)] for start, end in ranges],
                "intra_labels": intra_names,
                "inter_labels": inter_names,
            }
        except ServiceError:
            raise
        except Exception as error:
            raise ServiceError(
                "omnishotcut_failed", "OmniShotCut failed", 500,
                "OmniShotCut could not complete the analysis.", True,
            ) from error


def normalize_boundaries(
    prediction: dict[str, Any], duration: float
) -> tuple[list[dict[str, Any]], dict[str, dict[str, int]]]:
    fps = float(prediction["fps"])
    ranges = prediction.get("ranges", [])
    inter = prediction.get("inter_labels", [])
    raw = []
    for index, frame_range in enumerate(ranges):
        if not isinstance(frame_range, list) or len(frame_range) != 2:
            continue
        start = max(0.0, min(duration, float(frame_range[0]) / fps))
        end = max(0.0, min(duration, (float(frame_range[1]) + 1) / fps))
        if end > start:
            raw.append({
                "start": start,
                "end": end,
                "transition": str(inter[index]) if index < len(inter) else None,
            })
    raw.sort(key=lambda item: (item["start"], item["end"]))

    cuts = {0.0, duration}
    transitions: dict[float, str] = {}
    previous_end = 0.0
    for item in raw:
        start = float(item["start"])
        end = float(item["end"])
        if start <= previous_end:
            cut = (start + previous_end) / 2 if start != previous_end else start
            cuts.add(max(0.0, min(duration, cut)))
        elif start > previous_end:
            cuts.add(previous_end)
            cuts.add(start)
        cuts.add(end)
        previous_end = max(previous_end, end)
        if item["transition"]:
            transitions[end] = str(item["transition"])

    rounded = sorted({round(cut, 3) for cut in cuts if 0 <= cut <= duration})
    rounded[0] = 0.0
    rounded[-1] = round(duration, 3)
    boundaries = []
    for start, end in zip(rounded, rounded[1:], strict=False):
        if end <= start:
            continue
        transition = nearest_transition(end, transitions)
        boundaries.append({
            "startSeconds": start,
            "endSeconds": end,
            "transitionAfter": transition,
        })
    for index in range(1, len(boundaries)):
        boundaries[index]["startSeconds"] = boundaries[index - 1]["endSeconds"]
    counts = {
        "intra": dict(Counter(str(value) for value in prediction.get("intra_labels", []))),
        "inter": dict(Counter(str(value) for value in prediction.get("inter_labels", []))),
    }
    return boundaries, counts


def nearest_transition(end: float, transitions: dict[float, str]) -> str | None:
    if not transitions:
        return None
    cut = min(transitions, key=lambda value: abs(value - end))
    return transitions[cut] if abs(cut - end) <= 0.002 else None
