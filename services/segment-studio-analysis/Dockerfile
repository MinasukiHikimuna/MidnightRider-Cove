# syntax=docker/dockerfile:1.7
ARG PYTORCH_IMAGE=pytorch/pytorch:2.5.1-cuda12.4-cudnn9-runtime

FROM alpine/git:2.47.2 AS omnishotcut-source
ARG OMNISHOTCUT_REVISION=338c0e70a053fabc4d95a87e7b897c28aed65648
RUN git clone https://github.com/UVA-Computer-Vision-Lab/OmniShotCut /src/omnishotcut \
    && git -C /src/omnishotcut checkout "${OMNISHOTCUT_REVISION}" \
    && rm -rf /src/omnishotcut/.git /src/omnishotcut/__assets__

FROM ${PYTORCH_IMAGE} AS dependency-builder
ARG UV_VERSION=0.11.30
WORKDIR /build/service
COPY pyproject.toml uv.lock ./
RUN python -m pip install --no-cache-dir "uv==${UV_VERSION}" \
    && uv export --frozen --extra model --no-dev --no-emit-project \
       --format requirements-txt --output-file /build/requirements.txt

FROM ${PYTORCH_IMAGE} AS runtime
ARG SERVICE_VERSION=0.1.0
LABEL org.opencontainers.image.title="segment-studio-analysis" \
      org.opencontainers.image.version="${SERVICE_VERSION}"

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    TORCH_HOME=/cache/models/torch \
    SEGMENT_STUDIO_OMNISHOTCUT_REPO=/opt/omnishotcut \
    SEGMENT_STUDIO_OMNISHOTCUT_CHECKPOINT=/cache/models/OmniShotCut_ckpt.pth

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install --yes --no-install-recommends \
       ca-certificates curl ffmpeg tini \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --gid 10001 analysis \
    && useradd --uid 10001 --gid analysis --create-home --shell /usr/sbin/nologin analysis \
    && mkdir -p /app /cache/proxies /cache/models /opt/omnishotcut \
    && chown -R analysis:analysis /cache

COPY --from=dependency-builder /build/requirements.txt /tmp/requirements.txt
RUN python -m pip install --no-cache-dir --requirement /tmp/requirements.txt \
    && rm /tmp/requirements.txt
COPY --from=omnishotcut-source /src/omnishotcut /opt/omnishotcut
COPY pyproject.toml README.md /app/
COPY segment_studio_analysis /app/segment_studio_analysis
RUN python -m pip install --no-cache-dir --no-deps /app \
    && chmod -R a-w /app /opt/omnishotcut

USER analysis:analysis
WORKDIR /app
EXPOSE 8766
VOLUME ["/cache/proxies", "/cache/models"]
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["python", "-c", "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8766/healthz', timeout=3)"]
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["python", "-m", "uvicorn", "segment_studio_analysis.main:create_app", "--factory", "--host", "0.0.0.0", "--port", "8766"]
