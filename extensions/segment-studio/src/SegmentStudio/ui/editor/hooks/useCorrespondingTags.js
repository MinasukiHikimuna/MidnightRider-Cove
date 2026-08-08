import { useEffect, useState } from "../../shared/runtime.js";
import { completeOperation, operationIdFor, requestJson } from "../../shared/api.js";

const EMPTY_CORRESPONDING_TAGS = Object.freeze({
  sourceTagCount: 0,
  mappedSourceTagCount: 0,
  unreviewedReadyCount: 0,
  approvedReadyCount: 0,
  rows: [],
});

function useCorrespondingTags(videoId, enabled, refreshKey) {
  const [correspondingTags, setCorrespondingTags] = useState(EMPTY_CORRESPONDING_TAGS);
  const [correspondingTagsOpen, setCorrespondingTagsOpen] = useState(false);
  const [correspondingTagsBusy, setCorrespondingTagsBusy] = useState(false);
  const [correspondingTagsError, setCorrespondingTagsError] = useState("");

  async function refreshCorrespondingTags() {
    if (!enabled) {
      setCorrespondingTags(EMPTY_CORRESPONDING_TAGS);
      return EMPTY_CORRESPONDING_TAGS;
    }
    try {
      const summary = await requestJson(`/videos/${videoId}/corresponding-tags`);
      setCorrespondingTags(summary || EMPTY_CORRESPONDING_TAGS);
      setCorrespondingTagsError("");
      return summary;
    } catch (error) {
      setCorrespondingTagsError(error.message || "Unable to load corresponding tags.");
      return null;
    }
  }

  async function saveCorrespondingTagMappings(mappings) {
    setCorrespondingTagsBusy(true);
    setCorrespondingTagsError("");
    try {
      const summary = await requestJson(`/videos/${videoId}/corresponding-tags`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mappings }),
      });
      setCorrespondingTags(summary || EMPTY_CORRESPONDING_TAGS);
      return summary;
    } catch (error) {
      if (error.status === 409 && error.payload?.current)
        setCorrespondingTags(error.payload.current);
      setCorrespondingTagsError(error.message || "Unable to save corresponding tags.");
      return null;
    } finally {
      setCorrespondingTagsBusy(false);
    }
  }

  async function convertCorrespondingTagMappings(reviewStates, expectedHistoryRevision) {
    setCorrespondingTagsBusy(true);
    setCorrespondingTagsError("");
    const mappings = correspondingTags.rows
      .filter((row) => row.correspondingTagId != null)
      .map((row) => ({
        sourceTagId: row.sourceTagId,
        correspondingTagId: row.correspondingTagId,
        expectedUpdatedAt: row.mappingUpdatedAt,
      }))
      .sort((left, right) => left.sourceTagId - right.sourceTagId);
    const mappingKey = mappings.map((mapping) =>
      `${mapping.sourceTagId}:${mapping.correspondingTagId}:${mapping.expectedUpdatedAt}`).join(",");
    const operationKey = `corresponding-tags:${videoId}:${expectedHistoryRevision}:${mappingKey}:${[...reviewStates].sort().join(",")}`;
    try {
      const result = await requestJson(`/videos/${videoId}/corresponding-tags/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: operationIdFor(operationKey),
          mappings,
          reviewStates,
          expectedHistoryRevision,
        }),
      });
      completeOperation(operationKey);
      setCorrespondingTags(result.value || EMPTY_CORRESPONDING_TAGS);
      return result;
    } catch (error) {
      if (error.status === 409 && error.payload?.currentMappings)
        setCorrespondingTags(error.payload.currentMappings);
      setCorrespondingTagsError(error.message || "Unable to convert corresponding tags.");
      throw error;
    } finally {
      setCorrespondingTagsBusy(false);
    }
  }

  useEffect(() => {
    refreshCorrespondingTags();
  }, [videoId, enabled, refreshKey]);

  return {
    correspondingTags,
    correspondingTagsBusy,
    correspondingTagsError,
    correspondingTagsOpen,
    convertCorrespondingTagMappings,
    refreshCorrespondingTags,
    saveCorrespondingTagMappings,
    setCorrespondingTagsOpen,
  };
}

export { EMPTY_CORRESPONDING_TAGS, useCorrespondingTags };
