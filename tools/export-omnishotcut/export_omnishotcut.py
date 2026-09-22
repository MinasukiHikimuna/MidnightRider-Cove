"""Convert the OmniShotCut checkpoint into a shot-boundary artifact.

Run once, by hand. The output is what `media_ai_model_server` loads:

    models/omnishotcut_shot_boundaries.pt2
    models/omnishotcut_shot_boundaries.labels.json

The AI server contains no OmniShotCut code. It runs a generic `shot_boundary`
artifact whose contract is documented in that repo's
`docs/asset-scope-models.md`; this script is what makes OmniShotCut satisfy it.

Only the per-window forward pass is exported. Windowing, the greedy query walk,
context pruning, cross-window merging and boundary normalization all live in the
server as model-independent code, so the exported graph stays dense and
fixed-shape — which is what makes it exportable at all.

Usage:
    uv run --with torch --with torchvision export_omnishotcut.py \
        --checkpoint /path/to/OmniShotCut_ckpt.pth \
        --out-dir ./out

The upstream source is cloned at a pinned revision into a temporary directory
and used only during conversion.
"""

import argparse
import hashlib
import json
import os
import subprocess
import sys
import tempfile
import types
import warnings
from pathlib import Path

warnings.filterwarnings("ignore")

UPSTREAM_URL = "https://github.com/UVA-Computer-Vision-Lab/OmniShotCut"
UPSTREAM_REVISION = "338c0e70a053fabc4d95a87e7b897c28aed65648"
CHECKPOINT_SHA256 = "5948ea78e00626c0e6c5e742e64873ef872cf4a5071d2a0841aed51c3e686cfa"
ARTIFACT_STEM = "omnishotcut_shot_boundaries"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with open(path, "rb") as handle:
        for chunk in iter(lambda: handle.read(1 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()


def clone_upstream(target: Path, revision: str) -> Path:
    repo = target / "omnishotcut"
    subprocess.run(["git", "clone", "--quiet", UPSTREAM_URL, str(repo)], check=True)
    subprocess.run(["git", "-C", str(repo), "checkout", "--quiet", revision], check=True)
    return repo


def build_model(repo: Path, checkpoint: Path):
    import torch
    import torchvision

    # torchvision >= 0.15 removed the `pretrained=` kwarg that upstream's
    # backbone passes. The ImageNet initialisation is redundant anyway:
    # load_state_dict(strict=True) below overwrites every backbone parameter,
    # so skipping it also avoids downloading the ResNet-18 weights.
    original_resnet18 = torchvision.models.resnet18

    def resnet18_without_pretrained(*args, **kwargs):
        kwargs.pop("pretrained", None)
        kwargs.setdefault("weights", None)
        return original_resnet18(*args, **kwargs)

    torchvision.models.resnet18 = resnet18_without_pretrained

    # `datasets/__init__.py` imports the training dataloader (ffmpeg-python,
    # imageio, ...). architecture/model.py only needs datasets.utils, which
    # depends on nothing but util.misc. Registering an empty package module
    # with __path__ lets the submodule resolve without running __init__.
    sys.path.insert(0, str(repo))
    datasets_stub = types.ModuleType("datasets")
    datasets_stub.__path__ = [str(repo / "datasets")]
    sys.modules["datasets"] = datasets_stub

    from architecture.backbone import build_backbone
    from architecture.model import OmniShotCut
    from architecture.transformer import build_transformer
    from config.label_correspondence import (
        inter_int2string,
        intra_int2string,
        unique_inter_label_mapping,
        unique_intra_label_mapping,
    )

    # torch >= 2.6 defaults torch.load to weights_only=True; the checkpoint
    # stores an argparse.Namespace. Allowlisting exactly that class is tighter
    # than disabling the check wholesale.
    import argparse as argparse_module
    torch.serialization.add_safe_globals([argparse_module.Namespace])
    state = torch.load(str(checkpoint), map_location="cpu", weights_only=False)
    if "args" not in state or "model" not in state:
        raise SystemExit("Checkpoint must contain 'args' and 'model' keys")

    args = state["args"]
    model = OmniShotCut(
        build_backbone(args),
        build_transformer(args),
        num_intra_relation_classes=args.num_intra_relation_classes,
        num_inter_relation_classes=args.num_inter_relation_classes,
        num_frames=args.max_process_window_length,
        num_queries=args.num_queries,
        aux_loss=args.aux_loss,
    )
    model.load_state_dict(state["model"], strict=True)
    model.eval()

    labels = {
        "window_frames": int(args.max_process_window_length),
        "frame_height": int(args.process_height),
        "frame_width": int(args.process_width),
        "num_queries": int(args.num_queries),
        "intra": {str(k): str(v) for k, v in intra_int2string.items()},
        "inter": {str(k): str(v) for k, v in inter_int2string.items()},
        "intra_name_to_index": {str(k): int(v) for k, v in unique_intra_label_mapping.items()},
        "inter_name_to_index": {str(k): int(v) for k, v in unique_inter_label_mapping.items()},
        "source": {"repository": UPSTREAM_URL, "revision": UPSTREAM_REVISION},
    }
    return model, args, labels


def make_wrapper(model, repo: Path):
    import torch
    from torch import nn

    sys.path.insert(0, str(repo))
    from util.misc import NestedTensor

    class ShotBoundaryArtifact(nn.Module):
        """Adapts OmniShotCut's forward to the server's artifact contract.

        Upstream builds a NestedTensor via a python loop that pads a list of
        differently-sized frames. Every frame in a clip is the same size, so the
        resulting mask is all-False and the loop is pure overhead — and it is
        also what would otherwise make the graph un-exportable. Building the
        NestedTensor directly is numerically identical (asserted below).
        """

        def __init__(self, inner):
            super().__init__()
            self.inner = inner

        def forward(self, clip):
            batch, frames, channels, height, width = clip.shape
            flat = clip.reshape(batch * frames, channels, height, width)
            mask = torch.zeros((batch * frames, height, width), dtype=torch.bool, device=clip.device)
            out = self.inner(NestedTensor(flat, mask))
            return out["pred_shot_logits"], out["intra_clip_logits"], out["inter_clip_logits"]

    return ShotBoundaryArtifact(model).eval()


def main():
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--checkpoint", required=True, type=Path,
                        help="Path to OmniShotCut_ckpt.pth")
    parser.add_argument("--out-dir", default=Path("./out"), type=Path)
    parser.add_argument("--revision", default=UPSTREAM_REVISION)
    parser.add_argument("--repo", type=Path, default=None,
                        help="Use an existing upstream checkout instead of cloning")
    parser.add_argument("--skip-checksum", action="store_true")
    parser.add_argument("--torchscript", action="store_true",
                        help="Emit a .pt via torch.jit.trace instead of a .pt2")
    options = parser.parse_args()

    import torch

    if not options.checkpoint.is_file():
        raise SystemExit(f"Checkpoint not found: {options.checkpoint}")
    if not options.skip_checksum:
        digest = sha256(options.checkpoint)
        if digest != CHECKPOINT_SHA256:
            raise SystemExit(
                f"Checkpoint sha256 mismatch:\n  expected {CHECKPOINT_SHA256}\n  got      {digest}\n"
                f"Pass --skip-checksum to convert a different checkpoint."
            )
        print(f"checkpoint sha256 verified: {digest}")

    options.out_dir.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        repo = options.repo or clone_upstream(Path(tmp), options.revision)
        print(f"upstream: {repo} @ {options.revision}")

        model, args, labels = build_model(repo, options.checkpoint)
        window = labels["window_frames"]
        height, width = labels["frame_height"], labels["frame_width"]
        print(f"model built: window={window} clip={width}x{height} queries={labels['num_queries']}")

        wrapper = make_wrapper(model, repo)
        example = torch.randn(1, window, 3, height, width)

        with torch.inference_mode():
            reference = wrapper(example)
            upstream = model(example)
        for name, got, expected in (
            ("pred_shot_logits", reference[0], upstream["pred_shot_logits"]),
            ("intra_clip_logits", reference[1], upstream["intra_clip_logits"]),
            ("inter_clip_logits", reference[2], upstream["inter_clip_logits"]),
        ):
            delta = (got - expected).abs().max().item()
            if delta > 1e-5:
                raise SystemExit(f"Wrapper diverged from upstream forward on {name}: {delta}")
        print("wrapper matches upstream forward exactly")

        if options.torchscript:
            artifact = options.out_dir / f"{ARTIFACT_STEM}.pt"
            traced = torch.jit.trace(wrapper, (example,), strict=False)
            torch.jit.save(traced, str(artifact))
            reloaded = torch.jit.load(str(artifact))
        else:
            artifact = options.out_dir / f"{ARTIFACT_STEM}.pt2"
            exported = torch.export.export(wrapper, (example,), strict=False)
            torch.export.save(exported, str(artifact))
            reloaded = torch.export.load(str(artifact)).module()

        with torch.inference_mode():
            roundtrip = reloaded(example)
        for index, name in enumerate(("pred_shot_logits", "intra_clip_logits", "inter_clip_logits")):
            delta = (reference[index] - roundtrip[index]).abs().max().item()
            if delta > 1e-5:
                raise SystemExit(f"Artifact diverged after reload on {name}: {delta}")

        sidecar = options.out_dir / f"{ARTIFACT_STEM}.labels.json"
        with open(sidecar, "w", encoding="utf-8") as handle:
            json.dump(labels, handle, indent=2)

    print(f"\nwrote {artifact} ({artifact.stat().st_size / 1e6:.1f} MB)")
    print(f"wrote {sidecar}")
    print(f"\nCopy both into the AI server's ./models/ directory, then add a")
    print(f"config/models/{ARTIFACT_STEM}.yaml (see docs/asset-scope-models.md).")


if __name__ == "__main__":
    main()
