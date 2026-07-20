const BASE = "/extensions/animated-tag-previews";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: string,
    public readonly path: string,
  ) {
    super(`API ${status} ${path}: ${body}`);
    this.name = "ApiError";
  }
}

async function request(path: string, init: RequestInit = {}): Promise<unknown> {
  const headers = init.body instanceof FormData
    ? init.headers
    : { "Content-Type": "application/json", ...init.headers };
  const response = await fetch(`/api${path}`, {
    ...init,
    headers,
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new ApiError(response.status, body || response.statusText, path);
  }
  if (response.status === 204) return undefined;
  return response.json();
}

export interface PreviewIndexItem { tagId: number; version: string; mediaUrl?: string }
export interface PreviewIndex { version: string; items: PreviewIndexItem[] }
export interface PreviewDetails {
  tagId: number;
  version: string;
  origin: "generated" | "uploaded";
  source?: { videoId: number; startSeconds: number } | null;
  hasCustomImage: boolean;
}
export interface PreviewSettings {
  defaultDurationSeconds: number;
  maximumDurationSeconds: number;
  defaultWidth: number;
  maximumWidth: number;
  frameRate: number;
  minimumBitrateKbps: number;
  maximumBitrateKbps: number;
  encodingTimeoutSeconds: number;
  enabledSurfaces: string[];
  hoverRestart: boolean;
  hoverUnmute: boolean;
  aspectRatio: "1:1" | "4:3" | "16:9";
  cardFit: "inherit" | "cover" | "contain";
  matchCardAspectRatio: boolean;
}
export interface ToolHealth { available: boolean; compatible: boolean; version?: string; message?: string }
export interface PreviewHealth { healthy: boolean; ffmpeg: ToolHealth; ffprobe: ToolHealth; vp9Encoder: ToolHealth }
export interface GeneratePreviewRequest {
  sourceFileId?: number | null;
  startSeconds: number;
  durationSeconds: number;
  anchorX: number;
  anchorY: number;
  zoom: number;
  width?: number | null;
  playbackSpeed?: number;
}
export interface JobStatus { status: "pending" | "running" | "completed" | "failed" | "cancelled"; progress?: number; message?: string; error?: string; candidateId?: string }
export interface PreviewSource { fileId: number; mediaUrl: string }
export interface ApprovePreviewCandidateResponse {
  candidateId: string;
  videoId: number;
  tagId: number;
  version: string;
  replacedExisting: boolean;
  alreadyApproved: boolean;
}
export interface DiscardPreviewCandidateResponse {
  candidateId: string;
  videoId: number;
  tagId: number;
  discarded: boolean;
  blobDeleted: boolean;
  blobRetained: boolean;
}
export interface UploadPreviewResponse { tagId: number; version: string; replacedExisting: boolean }

export const DEFAULT_SETTINGS: PreviewSettings = {
  defaultDurationSeconds: 5,
  maximumDurationSeconds: 10,
  defaultWidth: 720,
  maximumWidth: 720,
  frameRate: 24,
  minimumBitrateKbps: 300,
  maximumBitrateKbps: 2500,
  encodingTimeoutSeconds: 120,
  enabledSurfaces: ["card", "hero"],
  hoverRestart: true,
  hoverUnmute: false,
  aspectRatio: "4:3",
  cardFit: "inherit",
  matchCardAspectRatio: true,
};

type Transport = (path: string, init?: RequestInit) => Promise<unknown>;
let transport: Transport = (path, init) => request(path, init);

function normalizeIndex(value: unknown): PreviewIndex {
  const record = value as { version?: unknown; items?: unknown; tags?: unknown };
  const rawItems = Array.isArray(record?.items) ? record.items : Array.isArray(record?.tags) ? record.tags : [];
  return {
    version: String(record?.version ?? "0"),
    items: rawItems.flatMap((item) => {
      const candidate = item as { tagId?: unknown; id?: unknown; version?: unknown; mediaUrl?: unknown };
      const tagId = Number(candidate.tagId ?? candidate.id);
      return Number.isInteger(tagId) && tagId > 0 ? [{ tagId, version: String(candidate.version ?? record?.version ?? "0"), mediaUrl: typeof candidate.mediaUrl === "string" ? candidate.mediaUrl : undefined }] : [];
    }),
  };
}

export const previewApi = {
  async getIndex() { return normalizeIndex(await transport(`${BASE}/tags`)); },
  previewDetails: (tagId: number, version: string) => transport(`${BASE}/tags/${tagId}/preview?v=${encodeURIComponent(version)}`) as Promise<PreviewDetails>,
  getSettings: async () => ({ ...DEFAULT_SETTINGS, ...await transport(`${BASE}/settings`) as Partial<PreviewSettings> }),
  saveSettings: (settings: PreviewSettings) => transport(`${BASE}/settings`, { method: "PUT", body: JSON.stringify(settings) }).then(() => undefined),
  health: () => transport(`${BASE}/health`) as Promise<PreviewHealth>,
  previewSource: async (videoId: number) => {
    const source = await transport(`${BASE}/videos/${videoId}/source`) as Omit<PreviewSource, "mediaUrl">;
    return { ...source, mediaUrl: `/api${BASE}/videos/${videoId}/source/media?fileId=${encodeURIComponent(source.fileId)}` };
  },
  generate: (videoId: number, tagId: number, payload: GeneratePreviewRequest) => transport(`${BASE}/videos/${videoId}/tags/${tagId}/generate`, { method: "POST", body: JSON.stringify(payload) }) as Promise<{ jobId: string }>,
  job: (videoId: number, tagId: number, jobId: string) => transport(`${BASE}/videos/${videoId}/tags/${tagId}/jobs/${encodeURIComponent(jobId)}`) as Promise<JobStatus>,
  cancel: (videoId: number, tagId: number, jobId: string) => transport(`${BASE}/videos/${videoId}/tags/${tagId}/jobs/${encodeURIComponent(jobId)}`, { method: "DELETE" }) as Promise<{ jobId: string; cancelled: boolean }>,
  candidateMediaUrl: (videoId: number, tagId: number, candidateId: string) => `/api${BASE}/videos/${videoId}/tags/${tagId}/candidates/${encodeURIComponent(candidateId)}/media`,
  approveCandidate: (videoId: number, tagId: number, candidateId: string) => transport(`${BASE}/videos/${videoId}/tags/${tagId}/candidates/${encodeURIComponent(candidateId)}/approve`, { method: "POST" }) as Promise<ApprovePreviewCandidateResponse>,
  discardCandidate: (videoId: number, tagId: number, candidateId: string) => transport(`${BASE}/videos/${videoId}/tags/${tagId}/candidates/${encodeURIComponent(candidateId)}`, { method: "DELETE" }) as Promise<DiscardPreviewCandidateResponse>,
  deleteMedia: (tagId: number) => transport(`${BASE}/tags/${tagId}/media`, { method: "DELETE" }) as Promise<{ tagId: number; deleted: boolean; blobDeleted: boolean }>,
  deleteCustomImage: (tagId: number) => transport(`/tags/${tagId}/image`, { method: "DELETE" }).then(() => undefined),
  uploadCustomImage: (tagId: number, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return transport(`/tags/${tagId}/image`, { method: "POST", body: form }) as Promise<{ blobId: string }>;
  },
  uploadMedia: (tagId: number, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return transport(`${BASE}/tags/${tagId}/media`, { method: "POST", body: form }) as Promise<UploadPreviewResponse>;
  },
  cleanupOrphans: async (dryRun = true, expectedVersion?: string) => {
    const query = new URLSearchParams({ dryRun: String(dryRun) });
    if (expectedVersion) query.set("expectedVersion", expectedVersion);
    const value = await transport(`${BASE}/cleanup/orphans?${query}`, { method: "POST" }) as { count?: unknown; orphanCount?: unknown; blobIds?: unknown; orphans?: unknown; deletedBlobCount?: unknown; failedBlobIds?: unknown; snapshotVersion?: unknown; expiredApprovalReceiptCount?: unknown; stalePreviewCandidateCount?: unknown; stalePreviewRecordCount?: unknown };
    const blobIds = Array.isArray(value?.blobIds)
      ? value.blobIds.map(String)
      : Array.isArray(value?.orphans)
        ? value.orphans.flatMap((orphan) => {
          const blobId = (orphan as { blobId?: unknown })?.blobId;
          return typeof blobId === "string" ? [blobId] : [];
        })
        : undefined;
    return {
      count: Number(value?.count ?? value?.orphanCount ?? blobIds?.length ?? 0),
      blobIds,
      deletedBlobCount: Number(value?.deletedBlobCount ?? 0),
      failedBlobIds: Array.isArray(value?.failedBlobIds) ? value.failedBlobIds.map(String) : [],
      snapshotVersion: String(value?.snapshotVersion ?? ""),
      expiredApprovalReceiptCount: Number(value?.expiredApprovalReceiptCount ?? 0),
      stalePreviewCandidateCount: Number(value?.stalePreviewCandidateCount ?? 0),
      stalePreviewRecordCount: Number(value?.stalePreviewRecordCount ?? 0),
    };
  },
  mediaUrl: (tagId: number, version: string) => `/api${BASE}/tags/${tagId}/media?v=${encodeURIComponent(version)}`,
  frameUrl: (videoId: number, seconds: number) => `/api/stream/video/${videoId}/screenshot?seconds=${encodeURIComponent(seconds.toFixed(3))}`,
};

export function setApiTransportForTests(next: Transport) { transport = next; }
export function __resetApiForTests() { transport = (path, init) => request(path, init); }
