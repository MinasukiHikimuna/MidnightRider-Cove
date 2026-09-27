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
    uv run --with torch==2.12.0 --with torchvision==0.27.0 export_omnishotcut.py \
        --checkpoint /path/to/OmniShotCut_ckpt.pth \
        --out-dir ./out

Pin the torch version the server runs: `.pt2` archives are version-sensitive.

The upstream source is cloned at a pinned revision into a temporary directory
and used only during conversion. The artifact is written under a temporary
name and moved into place only once it reloads and matches the model, so a
failed or diverged export never leaves an artifact behind.
"""

import argparse
import hashlib
import io
import json
import os
import subprocess
import sys
import tempfile
import types
import warnings
from pathlib import Path

UPSTREAM_URL = "https://github.com/UVA-Computer-Vision-Lab/OmniShotCut"
UPSTREAM_REVISION = "338c0e70a053fabc4d95a87e7b897c28aed65648"
CHECKPOINT_SHA256 = "5948ea78e00626c0e6c5e742e64873ef872cf4a5071d2a0841aed51c3e686cfa"
ARTIFACT_STEM = "omnishotcut_shot_boundaries"


def clone_upstream(target: Path, revision: str) -> Path:
    repo = target / "omnishotcut"
    subprocess.run(["git", "clone", "--quiet", UPSTREAM_URL, str(repo)], check=True)
    subprocess.run(["git", "-C", str(repo), "checkout", "--quiet", revision], check=True)
    return repo


def checkout_revision(repo: Path):
    """The commit a checkout is at, recorded instead of a branch or tag name.

    None when `repo` is not a git checkout.
    """
    result = subprocess.run(["git", "-C", str(repo), "rev-parse", "HEAD"],
                            capture_output=True, text=True)
    return result.stdout.strip() if result.returncode == 0 else None


def build_model(repo: Path, checkpoint: bytes, revision: str):
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

    # The checkpoint is a full pickle rather than a plain state dict (it stores
    # the training arguments next to the weights), so it is loaded with
    # weights_only=False, and unpickling it runs whatever code the file carries.
    # The protection is the SHA-256 check in main(): only the published
    # checkpoint is loaded unless --allow-unverified-checkpoint says otherwise.
    # These are the bytes that check hashed, so the file cannot change between
    # being verified and being loaded.
    state = torch.load(io.BytesIO(checkpoint), map_location="cpu", weights_only=False)
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
        "source": {"repository": UPSTREAM_URL, "revision": revision},
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
    parser.add_argument("--revision", default=None,
                        help="Upstream commit, tag or branch to clone and convert from "
                             f"(default: {UPSTREAM_REVISION}). The sidecar records the "
                             "commit it resolves to. Not used with --repo.")
    parser.add_argument("--repo", type=Path, default=None,
                        help="Use an existing upstream checkout, at whatever commit it is "
                             "checked out, instead of cloning")
    parser.add_argument("--allow-unverified-checkpoint", action="store_true",
                        help="Load a checkpoint whose SHA-256 is not the published one. "
                             "Loading unpickles the file, which runs any code it carries, "
                             "so use this only for a checkpoint you trust.")
    parser.add_argument("--torchscript", action="store_true",
                        help="Emit a .pt via torch.jit.trace instead of a .pt2")
    options = parser.parse_args()
    if options.repo and options.revision:
        parser.error("--revision applies only when cloning upstream; check out that "
                     "revision in the --repo checkout instead")

    import torch

    if not options.checkpoint.is_file():
        raise SystemExit(f"Checkpoint not found: {options.checkpoint}")
    checkpoint = options.checkpoint.read_bytes()
    digest = hashlib.sha256(checkpoint).hexdigest()
    if digest == CHECKPOINT_SHA256:
        print(f"checkpoint sha256 verified: {digest}")
    elif options.allow_unverified_checkpoint:
        print(f"WARNING: loading an unverified checkpoint (sha256 {digest}); "
              f"unpickling it runs any code it contains.")
    else:
        raise SystemExit(
            f"Checkpoint sha256 mismatch:\n  expected {CHECKPOINT_SHA256}\n  got      {digest}\n"
            f"Loading a checkpoint unpickles it, which runs any code it carries. Pass "
            f"--allow-unverified-checkpoint only for a checkpoint you trust."
        )

    options.out_dir.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        repo = options.repo or clone_upstream(Path(tmp), options.revision or UPSTREAM_REVISION)
        revision = checkout_revision(repo)
        if revision is None:
            print(f"WARNING: {repo} is not a git checkout, so the sidecar records the "
                  f"upstream revision as unknown.")
            revision = "unknown"
        print(f"upstream: {repo} @ {revision}")

        model, args, labels = build_model(repo, checkpoint, revision)
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

        suffix = ".pt" if options.torchscript else ".pt2"
        artifact = options.out_dir / f"{ARTIFACT_STEM}{suffix}"
        sidecar = options.out_dir / f"{ARTIFACT_STEM}.labels.json"
        # Written under temporary names in the same directory, then moved into
        # place only once verified, so a diverged or interrupted export never
        # leaves an artifact behind and never replaces a good one.
        pending_artifact = options.out_dir / f".{ARTIFACT_STEM}.partial{suffix}"
        pending_sidecar = options.out_dir / f".{ARTIFACT_STEM}.partial.labels.json"
        try:
            if options.torchscript:
                with warnings.catch_warnings():
                    # Taking a tensor's length or iterating over it while tracing
                    # fixes the graph to the example's shape, and torch warns that a
                    # tensor of another shape would give wrong results. That is
                    # intended: every clip has the model's fixed window and geometry.
                    # Every other tracer warning stays visible.
                    warnings.filterwarnings(
                        "ignore",
                        message=r"(Using len to get tensor shape|Iterating over a tensor) "
                                r"might cause the trace to be incorrect",
                        category=torch.jit.TracerWarning,
                    )
                    traced = torch.jit.trace(wrapper, (example,), strict=False)
                torch.jit.save(traced, str(pending_artifact))
                reloaded = torch.jit.load(str(pending_artifact))
            else:
                exported = torch.export.export(wrapper, (example,), strict=False)
                torch.export.save(exported, str(pending_artifact))
                reloaded = torch.export.load(str(pending_artifact)).module()

            with torch.inference_mode():
                roundtrip = reloaded(example)
            for index, name in enumerate(("pred_shot_logits", "intra_clip_logits", "inter_clip_logits")):
                delta = (reference[index] - roundtrip[index]).abs().max().item()
                if delta > 1e-5:
                    raise SystemExit(f"Artifact diverged after reload on {name}: {delta}")

            with open(pending_sidecar, "w", encoding="utf-8") as handle:
                json.dump(labels, handle, indent=2)
            os.replace(pending_artifact, artifact)
            os.replace(pending_sidecar, sidecar)
        finally:
            pending_artifact.unlink(missing_ok=True)
            pending_sidecar.unlink(missing_ok=True)

    print(f"\nwrote {artifact} ({artifact.stat().st_size / 1e6:.1f} MB)")
    print(f"wrote {sidecar}")
    print(f"\nCopy both into the AI server's ./models/ directory, then add a")
    print(f"config/models/{ARTIFACT_STEM}.yaml (see docs/asset-scope-models.md).")


if __name__ == "__main__":
    main()
