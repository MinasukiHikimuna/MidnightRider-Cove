# OmniShotCut → shot-boundary artifact

Shot-boundary detection runs on the AI server that already runs the tagging
and face models. The AI server has no OmniShotCut code in it: it runs a generic
`shot_boundary` artifact whose contract is documented in the server's
`docs/asset-scope-models.md`.

This script converts the published OmniShotCut checkpoint into such an
artifact. Run it once; the output is two files you copy to the server.

The server's generic `shot_boundary` model type loads the artifact and returns
each analysed video's shot boundaries in its analysis response. Storing them is
the client's job: an AI Shots extension that writes them to Cove's own shot
storage is planned, so they are not tied to any one extension.

## Usage

```fish
uv run --with torch==2.12.0 --with torchvision==0.27.0 \
    export_omnishotcut.py \
    --checkpoint /path/to/OmniShotCut_ckpt.pth \
    --out-dir ./out
```

Upstream is cloned at a pinned revision into a temporary directory and used
only during conversion. Pass `--revision` to clone another commit, tag or
branch, `--repo` to use an existing checkout at whatever commit it has checked
out (the two cannot be combined), or `--torchscript` to emit a `.pt` via
`torch.jit.trace` instead of a `.pt2`. Either way the sidecar records the
upstream commit the conversion actually used; if `--repo` is not a git
checkout, the script warns and records the revision as `unknown`.

The checkpoint is a full pickle rather than a plain state dict, so loading it
runs any code it carries. The script therefore only loads the published
checkpoint, identified by its SHA-256, and loads exactly the bytes it hashed.
`--allow-unverified-checkpoint` lifts that check; use it only for a checkpoint
you trust.

Export with the same torch version the server pins (`install/requirements.txt`);
`.pt2` archives are version-sensitive.

Outputs:

| File | Goes to |
|---|---|
| `omnishotcut_shot_boundaries.pt2` | the server's `./models/` |
| `omnishotcut_shot_boundaries.labels.json` | the server's `./models/` |

Then add `config/models/omnishotcut_shot_boundaries.yaml` on the server —
`model-config.example.yaml` here is a working copy of it.

## What gets exported

Only the per-window forward pass:

```
forward(clip: [1, 100, 3, 96, 128]) -> (shot_logits, intra_logits, inter_logits)
```

Windowing, the greedy query walk, context pruning, cross-window merging,
`clean_shot` filtering and boundary normalization are all generic and live in
the server. Keeping them out of the graph is what makes the export clean: the
three heads are dense and fixed-shape, with none of the data-dependent control
flow that usually blocks exporting a DETR-derived model.

The script asserts twice that this is faithful — the wrapper against upstream's
own forward, and the reloaded artifact against the wrapper. The artifact is
written under a temporary name and moved into place only after the reloaded copy
matches, so a diverged or interrupted export leaves nothing behind and never
replaces an artifact an earlier run produced.

## Verified behaviour

Against upstream's own `single_video_inference` on its published demo clips,
the server-side port reproduces upstream's `clean_shot` shot list **exactly**
(identical frame ranges and transition labels). In `default` mode the frame
ranges and shot-type labels are also identical; a single transition label on a
2-frame `Padding` shot can differ, because in-process decoding is not
bit-identical to piping through the `ffmpeg` binary. `clean_shot` leaves
`Padding` shots out of the node's `shots` list, but the `boundaries` partition
keeps every shot, so that one label can still differ there.

## Licensing

Nothing from the OmniShotCut repository is vendored into either this repository
or the AI server — the clone is temporary and only its weights, reshaped, end up
in the artifact. Publishing the converted artifact would redistribute the model
weights, so check the terms on the `uva-cv-lab/OmniShotCut` model card before
sharing it; local use is unaffected.
