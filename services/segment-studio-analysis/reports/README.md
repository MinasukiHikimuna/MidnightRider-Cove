# Image security reports

The reports in this directory describe the exact local image named in each
report. Regenerate them after every image rebuild:

```fish
docker run --rm \
    --volume /var/run/docker.sock:/var/run/docker.sock \
    anchore/syft:v1.44.0 \
    scan docker:segment-studio-analysis:0.1.0 \
    --output spdx-json

docker run --rm \
    --volume /var/run/docker.sock:/var/run/docker.sock \
    anchore/grype:v0.112.0 \
    docker:segment-studio-analysis:0.1.0 \
    --output table
```

The vulnerability report is a point-in-time result based on Grype's
vulnerability database and should be refreshed before publishing an image.

## Current scan

- Scan date: 2026-07-28
- Image tag: `segment-studio-analysis:0.1.0`
- Local immutable image ID:
  `sha256:559e2af414808293fd9153b790d37803d2130445ae2bb32be945bb730f38caaa`
- SBOM packages: 521
- Findings: 5 critical, 44 high, 960 medium, 128 low, and 17 negligible

The critical findings are in the pinned PyTorch/CUDA base stack: OpenSSL
(`CVE-2025-15467`, `CVE-2026-31789`), PyTorch
(`GHSA-53q9-r3pm-6pq6`), Python (`CVE-2025-4517`), and the imageio ffmpeg
binary (`CVE-2026-40962`). Treat the image as a development build until these
are resolved or explicitly accepted during the production-image refresh.
