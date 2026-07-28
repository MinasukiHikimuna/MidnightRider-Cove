# Segment Studio Analysis

`segment-studio-analysis` is the schema-versioned GPU analysis boundary for
Segment Studio. It validates and probes a local video, creates reusable AI and
OmniShotCut proxies, calls the NSFW AI server v4 API, runs one warm in-process
OmniShotCut model, and returns normalized candidates and shot boundaries.

The service does not call Cove or Segment Studio and does not write either
application's database.

## HTTP API

- `GET /healthz` is unauthenticated process liveness.
- `GET /readyz` requires bearer authentication and checks runtime readiness.
- `GET /v1/ai/catalog` returns the sanitized NSFW AI v4 model catalog.
- `POST /v1/analyze-video` performs one synchronous analysis.

All `/v1/*` requests and `/readyz` require:

```text
Authorization: Bearer <SEGMENT_STUDIO_ANALYSIS_TOKEN>
```

The generated contract is in `openapi.json`. Sanitized examples are under
`fixtures/`.

## Local tests

Use the repository's pinned environment:

```fish
set --export UV_CACHE_DIR /tmp/segment-studio-analysis-uv-cache
uv sync --extra test
uv run pytest
```

Generate the OpenAPI document after changing API models:

```fish
uv run python scripts/generate-openapi.py
```

## Container

Build the CUDA image from this directory:

```fish
docker build \
    --tag segment-studio-analysis:0.1.0 \
    .
```

Copy `.env.example` to an ignored `.env`, replace every environment-specific
value, and start the example Compose deployment:

```fish
docker compose \
    --file compose.example.yaml \
    --env-file .env \
    up \
    --detach
```

The first startup downloads the checkpoint pinned in `model-manifest.json`,
verifies its SHA-256 digest, and stores it in the model-cache volume. Liveness
is available during download/model load; authenticated readiness remains
unavailable until CUDA and the warm model are ready.

The upstream NSFW AI v4 server currently has no path-mapping probe endpoint.
`/readyz` therefore reports `aiProxyPathMapping.supported=false`; a first smoke
analysis must establish that both containers see the mapped proxy path.

## Smoke test

Keep the bearer token and media path in ignored/private files or shell
variables. The smoke script embeds neither:

```fish
scripts/smoke-test.fish \
    --base-url http://127.0.0.1:8766 \
    --token-file private/token \
    --source-path "$test_video"
```

Run the identical command again and verify that both proxy objects report
`cacheHit: true`, candidate keys are stable, and the returned OmniShotCut
boundaries are a contiguous full-duration partition.
