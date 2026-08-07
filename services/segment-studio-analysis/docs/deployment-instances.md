# Deployment instances

Run development, staging, and production as separate Compose projects from the
same immutable image. Each instance must have its own:

- environment file;
- proxy-cache directory;
- model-cache directory;
- loopback host port;
- external Docker network.

Recommended allocation:

| Instance | Compose project | Host port | Primary network |
| --- | --- | ---: | --- |
| Development | `segment-studio-analysis-dev` | 8766 | development application network |
| Staging | `segment-studio-analysis-staging` | 8767 | staging application network |
| Production | `segment-studio-analysis-production` | 8768 | production application network |

Keep actual values under the ignored `private/` directory:

```text
private/
  dev.env
  staging.env
  production.env
```

The service has no application-level authentication. Keep every instance on
loopback or its private application network; never publish its port directly
to an untrusted network.

Start an instance with an explicit project name and its private environment:

```fish
docker compose \
    --project-name segment-studio-analysis-dev \
    --file compose.example.yaml \
    --env-file private/dev.env \
    up \
    --detach
```

The service is addressable from containers on its primary network as
`http://segment-studio-analysis:8766`. To make the dev instance available to
another already-running Cove devbox, attach it to that devbox's network:

```fish
scripts/attach-network.fish \
    --container segment-studio-analysis-dev-segment-studio-analysis-1 \
    --network application-example-task_default
```

Docker network attachments are lost when the service container is recreated.
Devbox automation should invoke the attachment script after creating a devbox,
or the devbox Compose configuration should declare a shared external analysis
network. Do not attach staging or production to development networks.

In Cove, open **Segment Studio → Settings → General** and set the analysis
service URL to the service name on the same instance network:

```text
http://segment-studio-analysis:8766
```

The extension persists this setting and applies it without a Cove restart. No
shared token is required. The value must be a root HTTP(S) origin with no
credentials, path, query, or fragment. Treat permission to change it as a
host-network administration capability and apply an egress policy to Cove
where the deployment requires a target allowlist.
The analysis container must mount the media library at the same absolute paths
stored by Cove, because Segment Studio sends those paths without rewriting
them.

The image defaults to the unprivileged `analysis:analysis` user. If a host's
bind-mounted media uses owner-only permissions, set the Compose interpolation
variable `SEGMENT_STUDIO_ANALYSIS_RUNTIME_USER` to the matching numeric
`UID:GID` in that instance's ignored environment file. Confirm that the same
identity can write the proxy and model caches. Numeric identities are
host-specific and must not be committed as repository defaults.

For deployments where mount traversal can differ from root-directory access,
set `SEGMENT_STUDIO_READINESS_MEDIA_PATH` to a small valid video beneath the
same permission boundary as the library. The optional `/readyz` `mediaProbe`
check validates path resolution, read access, and FFprobe access without
exposing the configured path. Keep the configured file small; the FFprobe call
uses `SEGMENT_STUDIO_READINESS_MEDIA_TIMEOUT_SECONDS` as a hard subprocess
timeout.

The analysis-to-AI proxy mapping deserves special care. The proxy cache must be
mounted somewhere the NSFW AI server can read. If the containers cannot use the
same absolute path, set `SEGMENT_STUDIO_AI_PATH_FROM` to the analysis-container
mount and `SEGMENT_STUDIO_AI_PATH_TO` to the corresponding AI-server path.
