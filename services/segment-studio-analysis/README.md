# Segment Studio Analysis

`segment-studio-analysis` is the schema-versioned GPU analysis boundary for
Segment Studio. It validates and probes a local video, creates reusable AI and
OmniShotCut proxies, calls the NSFW AI server v4 API, runs one warm in-process
OmniShotCut model, and returns normalized candidates and shot boundaries.

The service does not call Cove or Segment Studio and does not write either
application's database.

## HTTP API

- `GET /healthz` reports process liveness.
- `GET /readyz` checks runtime readiness.
- `GET /v1/ai/catalog` returns the sanitized NSFW AI v4 model catalog.
- `POST /v1/analyze-video` accepts an analysis and returns `202 Accepted` with
  correlated `requestId`/`runId` values and a `Location` header.
- `GET /v1/analysis-runs/{runId}` reports the current phase and returns the
  result or a sanitized terminal failure.

The phases are `queued`, `probing`, `building_proxy`, `waiting_for_ai`,
`ai_tagging`, `omnishotcut`, `finalizing`, and `completed`/`failed`. Status
responses include `phaseStartedAt` and total `elapsedSeconds`. Unit counts are
omitted because the current upstream tools do not expose measurable work-unit
progress; callers must not derive a percentage from phase names.

Terminal failures identify the phase that failed, whether retry is safe, and,
when available, an allowlisted upstream HTTP status and error code. Logs and
status responses exclude source paths, credentials, upstream model payloads,
and video or library names.

The service does not authenticate requests. Restrict access at the network or
reverse-proxy boundary when deploying it outside a trusted network.

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
is available during download/model load; readiness remains unavailable until
CUDA and the warm model are ready.

The upstream NSFW AI v4 server currently has no path-mapping probe endpoint.
`/readyz` therefore reports `aiProxyPathMapping.supported=false`; a first smoke
analysis must establish that both containers see the mapped proxy path.

`SEGMENT_STUDIO_READINESS_MEDIA_PATH` optionally names a small, valid video
inside one of `SEGMENT_STUDIO_MEDIA_ROOTS`. When it is unset, `/readyz` reports:

```json
{"checks":{"mediaProbe":{"ok":true,"configured":false}}}
```

When configured, every readiness request resolves, reads, and FFprobes that
file with the service's runtime identity. A successful check reports
`configured`, `readable`, and `probeable` as `true`. A failed check makes
readiness return HTTP 503 and includes a sanitized `errorCode`, such as
`source_not_readable`, without returning the path or media metadata. Choose a
small file below the same directory-permission boundary as real media so the
probe remains inexpensive while exercising the relevant bind mount. FFprobe is
terminated after `SEGMENT_STUDIO_READINESS_MEDIA_TIMEOUT_SECONDS` (10 seconds
by default); a timeout reports the retryable `probe_timeout` code.

## Connect Cove

Put Cove and this service on the same private Docker network. In Cove, open
**Segment Studio → Settings → General**, enter the URL under **Analysis
service**, and save it. For a Compose service on the shared network, use:

```text
http://segment-studio-analysis:8766
```

The URL is persisted in Segment Studio's extension settings and takes effect
without restarting Cove. Enter a root HTTP(S) origin containing only the
scheme, host, and optional port. No analysis token is required.

Changing this URL controls where the Cove API sends readiness requests and
media paths. Grant the Segment Studio analysis-settings permission only to
administrators trusted to manage host networking, and constrain Cove's egress
at the network layer where required.

Cove sends the stored video file path to the service. Mount the media library
into both containers at the same absolute path and include that path in
`SEGMENT_STUDIO_MEDIA_ROOTS`. For example, if Cove stores paths below
`/media/library`, the analysis container must also see those files below
`/media/library`.

The image runs as `analysis:analysis` by default. Bind-mounted directories must
grant that identity traversal and read access, and the proxy/model caches must
remain writable. When owner-only host permissions require a matching numeric
identity, set `SEGMENT_STUDIO_ANALYSIS_RUNTIME_USER` in the ignored deployment
environment to the matching `<host-uid>:<host-gid>`. Do not replace the
repository default with a machine-specific UID/GID.

Verify connectivity with `GET /healthz`, then verify runtime readiness with
`GET /readyz`. A ready response requires ffmpeg, ffprobe, CUDA, the warm
OmniShotCut model, a writable proxy cache, the NSFW AI v4 server, and a
successful media probe when one is configured. The AI proxy path mapping is
verified by the first smoke scan.

## Smoke test

Keep the media path in an ignored/private shell variable. The smoke script
does not embed it:

```fish
scripts/smoke-test.fish \
    --base-url http://127.0.0.1:8766 \
    --source-path "$test_video"
```

Run the identical command again and verify that both proxy objects report
`cacheHit: true`, candidate keys are stable, and the returned OmniShotCut
boundaries are a contiguous full-duration partition.
