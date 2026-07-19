import { ApiError, previewApi } from "./api";

interface DetachedGenerationCleanup {
  videoId: number;
  tagId: number;
  jobId: string;
  encodingTimeoutSeconds: number;
  pollDelayMs: number;
}

const wait = (milliseconds: number) => new Promise<void>((resolve) => globalThis.setTimeout(resolve, milliseconds));
const missing = (reason: unknown) => reason instanceof ApiError && reason.status === 404;

export async function cleanupDetachedGeneration(options: DetachedGenerationCleanup) {
  const { videoId, tagId, jobId, pollDelayMs } = options;
  try {
    if ((await previewApi.cancel(videoId, tagId, jobId)).cancelled) return;
  } catch (reason) {
    if (missing(reason)) return;
    // A lost cancellation response is ambiguous, so continue by observing the job.
  }

  const deadline = Date.now() + Math.max(pollDelayMs, options.encodingTimeoutSeconds * 1000 + pollDelayMs);
  let candidateId: string | undefined;
  const discard = async () => {
    try {
      return (await previewApi.discardCandidate(videoId, tagId, candidateId!)).discarded;
    } catch (reason) {
      return missing(reason);
    }
  };
  while (Date.now() <= deadline) {
    await wait(pollDelayMs);
    if (candidateId) {
      if (await discard()) return;
      continue;
    }

    try {
      const job = await previewApi.job(videoId, tagId, jobId);
      if (job.status === "cancelled" || job.status === "failed") return;
      if (job.status === "completed") {
        if (!job.candidateId) return;
        candidateId = job.candidateId;
        if (await discard()) return;
      }
    } catch (reason) {
      if (missing(reason)) return;
      // Transient polling failures retry until the encoding timeout window closes.
    }
  }
}
