from __future__ import annotations

from datetime import datetime
from typing import Any, Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ApiModel(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)


class ProxyOptions(ApiModel):
    enabled: bool = True


class AiOptions(ApiModel):
    models: list[str] = Field(default_factory=list)
    categoriesToSkip: list[str] = Field(default_factory=list)
    frameIntervalSeconds: float = Field(default=2.0, gt=0)
    threshold: float = Field(default=0.5, ge=0, le=1)
    candidateConfidenceFloor: float = Field(default=0.35, ge=0, le=1)
    returnConfidence: bool = True
    vrVideo: bool = False
    loadPolicy: Literal["use_loaded", "load_if_cheap", "load_or_fail"] = "load_if_cheap"
    pipelineName: str | None = None


class OmniShotCutOptions(ApiModel):
    mode: Literal["clean_shot", "default"] = "clean_shot"
    numContextFrames: int = Field(default=0, ge=0)


class AnalyzeVideoRequest(ApiModel):
    schemaVersion: Literal["1"]
    requestId: UUID
    sourcePath: str = Field(min_length=1)
    analyses: list[Literal["aiTagging", "omnishotcut"]]
    proxy: ProxyOptions = Field(default_factory=ProxyOptions)
    ai: AiOptions = Field(default_factory=AiOptions)
    omnishotcut: OmniShotCutOptions = Field(default_factory=OmniShotCutOptions)

    @field_validator("analyses")
    @classmethod
    def validate_analyses(cls, value: list[str]) -> list[str]:
        if not value:
            raise ValueError("at least one analysis is required")
        if len(value) != len(set(value)):
            raise ValueError("analyses must not contain duplicates")
        return value

    @field_validator("proxy")
    @classmethod
    def validate_proxy(cls, value: ProxyOptions) -> ProxyOptions:
        if not value.enabled:
            raise ValueError("proxy.enabled=false is not supported in v1")
        return value


class CatalogModel(ApiModel):
    configName: str | None = None
    name: str | None = None
    identifier: int | None = None
    version: str | float | None = None
    categories: list[str] | None = None
    type: str | None = None
    capabilities: list[str] | None = None
    supportedScopes: list[str] | None = None
    active: bool | None = None
    loaded: bool | None = None
    info: Any | None = None
    imageSize: Any | None = None
    artifactAvailable: bool | None = None
    incompatible: bool | None = None
    incompatibilityReason: str | None = None


class SourceResponse(ApiModel):
    fingerprint: str
    sizeBytes: int
    mtimeNs: int
    durationSeconds: float
    fps: float
    width: int
    height: int
    frameCount: int


class ProxyResponse(ApiModel):
    width: int
    height: int
    fps: float
    cacheHit: bool
    sizeBytes: int


class ProxiesResponse(ApiModel):
    cacheKey: str
    settingsVersion: str
    ai: ProxyResponse | None = None
    omnishotcut: ProxyResponse | None = None


class AiModelResponse(ApiModel):
    configName: str
    name: str | None = None
    identifier: int | None = None
    version: str | float | None = None
    categories: list[str] | None = None


class SegmentResponse(ApiModel):
    candidateKey: str
    kind: Literal["tag"]
    tagName: str
    title: str
    startSeconds: float
    endSeconds: float
    confidence: float | None = None
    modelKey: str
    observationCount: int


class AiAnalysisResponse(ApiModel):
    models: list[AiModelResponse]
    frameIntervalSeconds: float
    segments: list[SegmentResponse]


class BoundaryResponse(ApiModel):
    startSeconds: float
    endSeconds: float
    transitionAfter: str | None = None


class OmniShotCutAnalysisResponse(ApiModel):
    modelRevision: str
    mode: Literal["clean_shot", "default"]
    boundaries: list[BoundaryResponse]
    labelCounts: dict[str, dict[str, int]]


class MetricsResponse(ApiModel):
    probeSeconds: float
    proxySeconds: float
    aiSeconds: float | None = None
    omnishotcutSeconds: float | None = None
    totalSeconds: float


class AnalyzeVideoResponse(ApiModel):
    schemaVersion: Literal["1"]
    requestId: UUID
    runId: UUID
    serviceVersion: str
    status: Literal["completed"]
    source: SourceResponse
    proxies: ProxiesResponse
    ai: AiAnalysisResponse | None = None
    omnishotcut: OmniShotCutAnalysisResponse | None = None
    metrics: MetricsResponse
    warnings: list[str]


AnalysisPhase = Literal[
    "queued",
    "probing",
    "building_proxy",
    "waiting_for_ai",
    "ai_tagging",
    "omnishotcut",
    "finalizing",
    "completed",
    "failed",
]


class AnalysisRunError(ApiModel):
    code: str
    phase: Literal[
        "queued",
        "probing",
        "building_proxy",
        "waiting_for_ai",
        "ai_tagging",
        "omnishotcut",
        "finalizing",
    ]
    retryable: bool
    upstreamHttpStatus: int | None = None
    upstreamErrorCode: str | None = None


class AnalysisRunStatus(ApiModel):
    schemaVersion: Literal["1"]
    requestId: UUID
    runId: UUID
    serviceVersion: str
    phase: AnalysisPhase
    phaseStartedAt: datetime
    elapsedSeconds: float
    completedUnits: int | None = None
    totalUnits: int | None = None
    error: AnalysisRunError | None = None
    result: AnalyzeVideoResponse | None = None
