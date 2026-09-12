import { shotBoundaryFingerprint } from "../editor/model/shortcuts.js";

const ACTIVE_ANALYSIS_STATUSES = new Set(["queued", "running"]);

async function mapWithConcurrency(items, worker, concurrency = 4) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function runWorker() {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runWorker));
  return results;
}

function failure(videoId, error) {
  return { videoId, error: error?.message || String(error || "Unable to start Full Scan.") };
}

function createBulkAnalysisCoordinator() {
  let activeOperation = null;
  let selectionVersion = 0;
  return {
    begin() {
      if (activeOperation) return null;
      activeOperation = { selectionVersion };
      return activeOperation;
    },
    selectionChanged() { selectionVersion++; },
    ownsCurrentSelection(operation) {
      return activeOperation === operation && operation.selectionVersion === selectionVersion;
    },
    finish(operation) {
      if (activeOperation === operation) activeOperation = null;
    },
  };
}

async function runSelectedDiscoveryAnalysis(videoIds, analyses, request, confirmReplacement) {
  const selectedIds = [...new Set(videoIds.map(Number).filter((id) => Number.isInteger(id) && id > 0))];
  const requestedAnalyses = [...new Set(analyses)].filter((analysis) => ["aiTagging", "omnishotcut"].includes(analysis));
  if (selectedIds.length === 0 || requestedAnalyses.length === 0)
    return { queuedIds: [], failed: [], cancelled: false };

  const includesShotBoundaries = requestedAnalyses.includes("omnishotcut");
  const preflight = await mapWithConcurrency(selectedIds, async (videoId) => {
    try {
      const [runs, editor] = await Promise.all([
        request(`/videos/${videoId}/analysis-runs`),
        includesShotBoundaries ? request(`/videos/${videoId}/editor`) : null,
      ]);
      if ((runs || []).some((run) => ACTIVE_ANALYSIS_STATUSES.has(run?.status)))
        throw new Error("A Full Scan is already queued or running.");
      const shotBoundaries = editor?.shotBoundaries || [];
      return { videoId, shotBoundaries };
    } catch (error) {
      return failure(videoId, error);
    }
  });
  const ready = preflight.filter((item) => !item.error);
  const failed = preflight.filter((item) => item.error);
  const replacementItems = ready.filter((item) => item.shotBoundaries.length > 0);
  const replacementCount = replacementItems.reduce((total, item) => total + item.shotBoundaries.length, 0);
  if (replacementCount > 0 && !confirmReplacement(
    `Replace ${replacementCount} existing shot ${replacementCount === 1 ? "boundary" : "boundaries"} across ${replacementItems.length} selected ${replacementItems.length === 1 ? "video" : "videos"} when these scans succeed? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`,
  )) return { queuedIds: [], failed, cancelled: true };

  const queued = await mapWithConcurrency(ready, async ({ videoId, shotBoundaries }) => {
    const replaceShotBoundaries = includesShotBoundaries && shotBoundaries.length > 0;
    try {
      await request(`/videos/${videoId}/analysis-runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyses: requestedAnalyses,
          replaceShotBoundaries,
          expectedShotBoundaryFingerprint: replaceShotBoundaries
            ? shotBoundaryFingerprint(shotBoundaries)
            : null,
        }),
      });
      return { videoId };
    } catch (error) {
      return failure(videoId, error);
    }
  });
  return {
    queuedIds: queued.filter((item) => !item.error).map((item) => item.videoId),
    failed: [...failed, ...queued.filter((item) => item.error)],
    cancelled: false,
  };
}

export { createBulkAnalysisCoordinator, runSelectedDiscoveryAnalysis };
