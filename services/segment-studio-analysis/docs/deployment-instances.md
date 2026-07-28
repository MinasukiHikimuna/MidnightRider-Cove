# Deployment instances

Run development, staging, and production as separate Compose projects from the
same immutable image. Each instance must have its own:

- 32-byte-or-longer bearer token;
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
  dev.token
  staging.env
  staging.token
  production.env
  production.token
```

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

The analysis-to-AI proxy mapping deserves special care. The proxy cache must be
mounted somewhere the NSFW AI server can read. If the containers cannot use the
same absolute path, set `SEGMENT_STUDIO_AI_PATH_FROM` to the analysis-container
mount and `SEGMENT_STUDIO_AI_PATH_TO` to the corresponding AI-server path.
