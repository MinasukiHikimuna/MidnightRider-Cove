import { useEffect, useRef, useState } from "../../shared/runtime.js";
import { createOperationId, requestJson } from "../../shared/api.js";

function useSegmentAnalysis(videoId, onReload, fullMode = false) {
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

  async function refreshAnalysisRun() {
    try {
      const runs = await requestJson(`/videos/${videoId}/analysis-runs`);
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
      setAnalysisError(error.message || "Unable to load video analysis status.");
      return null;
    }
  }

  async function startFullAnalysis(analyses = null) {
    setAnalysisError("");
    try {
      const run = await requestJson(`/videos/${videoId}/analysis-runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyses: analyses || (fullMode
            ? ["aiTagging", "omnishotcut"]
            : ["aiTagging"]),
        }),
      });
      setAnalysisRun(run);
    } catch (error) {
      setAnalysisError(error.message || "Unable to start video analysis.");
    }
  }

  useEffect(() => {
    refreshAnalysisRun();
    requestJson("/analysis/status")
      .then((status) => {
        setAnalysisStatus(status);
        if (!status.configured) setAnalysisError("");
      })
      .catch((error) => setAnalysisError(error.message || "Unable to check video analysis readiness."));
  }, [videoId, fullMode]);

  useEffect(() => {
    if (analysisRun?.status !== "queued" && analysisRun?.status !== "running") return undefined;
    const timer = setInterval(refreshAnalysisRun, 2500);
    return () => clearInterval(timer);
  }, [analysisRun?.id, analysisRun?.status]);

  return {
    analysisError,
    analysisRun,
    analysisStatus,
    importNativeSegments,
    nativeImportState,
    startFullAnalysis,
  };
}

export { useSegmentAnalysis };
