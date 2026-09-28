import { useEffect, useRef, useState } from "../../shared/runtime.js";
import { createOperationId, requestJson } from "../../shared/api.js";

// How often an open editor checks for a newly completed analysis run while its
// tab is visible. It also checks when the window regains focus or the tab
// becomes visible again.
const ANALYSIS_RUN_CHECK_INTERVAL_MS = 30000;

function shouldLoadSegmentAnalysis(fullMode) {
  return fullMode === true;
}

function createSegmentAnalysisRequestScope() {
  const controller = new AbortController();
  let active = true;
  return {
    signal: controller.signal,
    isActive: () => active && !controller.signal.aborted,
    dispose: () => {
      active = false;
      controller.abort();
    },
  };
}

// Watches for Segment Studio analysis runs that complete while the editor is
// open and calls onCompletedRun once for each check that finds one. A native AI
// run writes its analysis run once, already completed, so there is no queued or
// running state to wait for: the watch looks for a completed run it has not seen
// before. The first successful check only records the runs that already exist,
// so opening the editor never reloads it, even when that first check has to be
// retried. Checks never overlap and the interval pauses while the tab is hidden.
// A failed check is retried by the next one. A failed reload is not retried: its
// run already counts as seen, and the reload callback reports its own error.
// Returns a function that stops the watch and aborts a check in flight.
function startCompletedRunWatch({
  fetchRuns,
  onCompletedRun,
  windowTarget,
  documentTarget,
  intervalMs = ANALYSIS_RUN_CHECK_INTERVAL_MS,
}) {
  const scope = createSegmentAnalysisRequestScope();
  let seen = null;
  let checking = false;
  let timer = null;

  const isVisible = () => documentTarget.visibilityState !== "hidden";

  async function check() {
    if (checking || !scope.isActive()) return;
    checking = true;
    try {
      const runs = await fetchRuns(scope.signal);
      if (!scope.isActive()) return;
      const completed = (Array.isArray(runs) ? runs : [])
        .filter((run) => run?.status === "completed" && run.id != null)
        .map((run) => String(run.id));
      if (seen === null) {
        seen = new Set(completed);
        return;
      }
      const fresh = completed.filter((id) => !seen.has(id));
      if (fresh.length === 0) return;
      fresh.forEach((id) => seen.add(id));
      await onCompletedRun();
    } catch {
      // The next check retries; a failed reload reports its own error.
    } finally {
      checking = false;
    }
  }

  function schedule() {
    clearTimeout(timer);
    timer = null;
    if (!scope.isActive() || !isVisible()) return;
    timer = setTimeout(async () => {
      timer = null;
      await check();
      schedule();
    }, intervalMs);
  }

  function handleFocus() {
    check();
  }

  function handleVisibilityChange() {
    if (isVisible()) {
      check();
      schedule();
    } else {
      clearTimeout(timer);
      timer = null;
    }
  }

  check();
  schedule();
  windowTarget.addEventListener("focus", handleFocus);
  documentTarget.addEventListener("visibilitychange", handleVisibilityChange);

  return function stop() {
    scope.dispose();
    clearTimeout(timer);
    timer = null;
    windowTarget.removeEventListener("focus", handleFocus);
    documentTarget.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}

function useSegmentAnalysis(
  videoId,
  onReload,
  onAnalysisCompleted,
  fullMode = false,
  acquireSaveLock = () => () => {},
) {
  const [nativeImportState, setNativeImportState] = useState({
    busy: false,
    reviewState: null,
    error: "",
  });
  const analysisCompletedRef = useRef(onAnalysisCompleted);
  useEffect(() => {
    analysisCompletedRef.current = onAnalysisCompleted;
  }, [onAnalysisCompleted]);

  async function importNativeSegments(reviewState) {
    const releaseSaveLock = acquireSaveLock("import", -1);
    if (!releaseSaveLock) {
      setNativeImportState({ busy: false, reviewState: null, error: "Wait for the current save to finish before importing Cove segments." });
      return;
    }
    setNativeImportState({ busy: true, reviewState, error: "" });
    try {
      await requestJson(`/videos/${videoId}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: createOperationId(), reviewState }),
      });
      await onReload();
      setNativeImportState({ busy: false, reviewState: null, error: "" });
    } catch (error) {
      setNativeImportState({
        busy: false,
        reviewState: null,
        error: error.message || "Unable to import Cove segments.",
      });
    } finally {
      releaseSaveLock();
    }
  }

  // Segment Studio's review runs exist only in Full mode, so Basic has nothing
  // to watch for.
  useEffect(() => {
    if (!shouldLoadSegmentAnalysis(fullMode)) return undefined;
    return startCompletedRunWatch({
      fetchRuns: (signal) => requestJson(`/videos/${videoId}/analysis-runs`, { signal }),
      onCompletedRun: () => analysisCompletedRef.current(),
      windowTarget: window,
      documentTarget: document,
    });
  }, [videoId, fullMode]);

  return {
    importNativeSegments,
    nativeImportState,
  };
}

export { ANALYSIS_RUN_CHECK_INTERVAL_MS, createSegmentAnalysisRequestScope, shouldLoadSegmentAnalysis, startCompletedRunWatch, useSegmentAnalysis };
