# OmniShotCut → shot-boundary artifact

Segment Studio gets shot boundaries from the AI server that already runs the
tagging and face models, through Cove's native **Run AI** dialog. The AI server
has no OmniShotCut code in it: it runs a generic `shot_boundary` artifact whose
contract is documented in the server's `docs/asset-scope-models.md`.

This script converts the published OmniShotCut checkpoint into such an
artifact. Run it once; the output is two files you copy to the server.

It replaces the `services/segment-studio-analysis` container, which used to
clone OmniShotCut at build time, keep a 50 GiB proxy cache, and hand file paths
to the AI server across a shared mount.

## Usage

```fish
uv run --with torch==2.12.0 --with torchvision==0.27.0 \
    export_omnishotcut.py \
    --checkpoint /path/to/OmniShotCut_ckpt.pth \
    --out-dir ./out
```

Upstream is cloned at a pinned revision into a temporary directory and used
only during conversion. Pass `--repo` to reuse an existing checkout, or
`--torchscript` to emit a `.pt` via `torch.jit.trace` instead of a `.pt2`.

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
own forward, and the reloaded artifact against the wrapper — and refuses to
write anything if either diverges.

## Verified behaviour

Against upstream's own `single_video_inference` on its published demo clips,
the server-side port reproduces `clean_shot` output **exactly** (identical
frame ranges and transition labels). In `default` mode the frame ranges and
shot-type labels are also identical; a single transition label on a 2-frame
`Padding` shot can differ, because in-process decoding is not bit-identical to
piping through the `ffmpeg` binary. `clean_shot` drops `Padding` shots, so that
difference cannot reach Segment Studio.

## Licensing

Nothing from the OmniShotCut repository is vendored into either this repository
or the AI server — the clone is temporary and only its weights, reshaped, end up
in the artifact. Publishing the converted artifact would redistribute the model
weights, so check the terms on the `uva-cv-lab/OmniShotCut` model card before
sharing it; local use is unaffected.
