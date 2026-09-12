import { useEffect, useRef, useState } from "../../shared/runtime.js";
import { createOperationId, requestJson } from "../../shared/api.js";

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

function useSegmentAnalysis(
  videoId,
  onReload,
  fullMode = false,
  shotBoundaryCount = 0,
  shotBoundaryRevision = "",
) {
  const [analysisRun, setAnalysisRun] = useState(null);
  const [analysisStatus, setAnalysisStatus] = useState(null);
  const [analysisError, setAnalysisError] = useState("");
  const [nativeImportState, setNativeImportState] = useState({
    busy: false,
    reviewState: null,
    error: "",
  });
  const analysisReloadedRunRef = useRef(null);

  async function importNativeSegments(reviewState) {
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
    }
  }

  async function refreshAnalysisRun(scope) {
    try {
      const runs = await requestJson(`/videos/${videoId}/analysis-runs`, {
        signal: scope.signal,
      });
      if (!scope.isActive()) return null;
      const run = runs?.[0] || null;
      setAnalysisRun(run);
      if (run?.status === "completed" && analysisReloadedRunRef.current !== run.id) {
        analysisReloadedRunRef.current = run.id;
        await onReload();
      }
      if (run?.status === "failed" || run?.status === "cancelled")
        setAnalysisError(run.errorMessage || "Video analysis did not complete.");
      return run;
    } catch (error) {
      if (scope.isActive() && error.name !== "AbortError")
        setAnalysisError(error.message || "Unable to load video analysis status.");
      return null;
    }
  }

  async function startFullAnalysis(analyses = null) {
    setAnalysisError("");
    const requestedAnalyses = analyses || (fullMode
      ? ["aiTagging", "omnishotcut"]
      : ["aiTagging"]);
    const replaceShotBoundaries = requestedAnalyses.includes("omnishotcut")
      && shotBoundaryCount > 0;
    if (replaceShotBoundaries && !window.confirm(
      `Replace ${shotBoundaryCount} existing shot ${shotBoundaryCount === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`,
    )) return;
    try {
      const run = await requestJson(`/videos/${videoId}/analysis-runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyses: requestedAnalyses,
          replaceShotBoundaries,
          expectedShotBoundaryFingerprint: replaceShotBoundaries
            ? shotBoundaryRevision
            : null,
        }),
      });
      setAnalysisRun(run);
    } catch (error) {
      setAnalysisError(error.message || "Unable to start video analysis.");
    }
  }

  useEffect(() => {
    if (!shouldLoadSegmentAnalysis(fullMode)) {
      setAnalysisRun(null);
      setAnalysisStatus(null);
      setAnalysisError("");
      return undefined;
    }
    const scope = createSegmentAnalysisRequestScope();
    refreshAnalysisRun(scope);
    requestJson("/analysis/status", { signal: scope.signal })
      .then((status) => {
        if (!scope.isActive()) return;
        setAnalysisStatus(status);
        if (!status.configured) setAnalysisError("");
      })
      .catch((error) => {
        if (scope.isActive() && error.name !== "AbortError")
          setAnalysisError(error.message || "Unable to check video analysis readiness.");
      });
    return scope.dispose;
  }, [videoId, fullMode]);

  useEffect(() => {
    if (!shouldLoadSegmentAnalysis(fullMode)
      || (analysisRun?.status !== "queued" && analysisRun?.status !== "running")) return undefined;
    const scope = createSegmentAnalysisRequestScope();
    let timer = setTimeout(async function pollAnalysisRun() {
      await refreshAnalysisRun(scope);
      if (scope.isActive()) timer = setTimeout(pollAnalysisRun, 2500);
    }, 2500);
    return () => {
      clearTimeout(timer);
      scope.dispose();
    };
  }, [analysisRun?.id, analysisRun?.status, fullMode]);

  return {
    analysisError,
    analysisRun,
    analysisStatus,
    importNativeSegments,
    nativeImportState,
    startFullAnalysis,
  };
}

export { createSegmentAnalysisRequestScope, shouldLoadSegmentAnalysis, useSegmentAnalysis };
