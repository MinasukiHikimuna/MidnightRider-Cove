import { extensionFetch } from "./runtime.js";

import { OPERATION_STORAGE_KEY } from "./constants.js";

const API_ROOT = "/api/plugins/segment-studio";

function operationIdFor(key) {
  try {
    const operations = JSON.parse(window.localStorage.getItem(OPERATION_STORAGE_KEY) || "{}");
    if (typeof operations[key] === "string" && operations[key]) return operations[key];
    const operationId = createOperationId();
    operations[key] = operationId;
    window.localStorage.setItem(OPERATION_STORAGE_KEY, JSON.stringify(operations));
    return operationId;
  } catch {
    return createOperationId();
  }
}

function completeOperation(key) {
  try {
    const operations = JSON.parse(window.localStorage.getItem(OPERATION_STORAGE_KEY) || "{}");
    delete operations[key];
    delete operations[`${key}:discardMissingImage`];
    window.localStorage.setItem(OPERATION_STORAGE_KEY, JSON.stringify(operations));
  } catch {
    // Receipts still protect server-side retries when browser storage is unavailable.
  }
}

function operationDiscardsMissingImage(key) {
  try {
    const operations = JSON.parse(window.localStorage.getItem(OPERATION_STORAGE_KEY) || "{}");
    return operations[`${key}:discardMissingImage`] === true;
  } catch {
    return false;
  }
}

function rememberMissingImageDiscard(key) {
  try {
    const operations = JSON.parse(window.localStorage.getItem(OPERATION_STORAGE_KEY) || "{}");
    operations[`${key}:discardMissingImage`] = true;
    window.localStorage.setItem(OPERATION_STORAGE_KEY, JSON.stringify(operations));
  } catch {
    // The current attempt can still proceed without browser storage.
  }
}

export function tryParseJsonResponseText(text) {
  try {
    return { parsed: true, value: JSON.parse(text) };
  } catch {
    return { parsed: false, value: null };
  }
}

function waitForRequestRetry(delayMs, signal) {
  if (signal?.aborted)
    return Promise.reject(new DOMException("The request was aborted.", "AbortError"));
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, delayMs);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("The request was aborted.", "AbortError"));
    }, { once: true });
  });
}

async function requestJson(path, options, attempt = 0) {
  const response = await extensionFetch(`${API_ROOT}${path}`, options);
  if (response.status === 204) return null;
  const text = await response.text();
  const payload = tryParseJsonResponseText(text);
  if (!response.ok) {
    const error = new Error(payload.value?.error || "Unable to load Segment Studio.");
    error.status = response.status;
    error.payload = payload.value;
    throw error;
  }
  if (payload.parsed) return payload.value;
  const method = String(options?.method || "GET").toUpperCase();
  if (method === "GET" && attempt < 2) {
    await waitForRequestRetry(250 * (attempt + 1), options?.signal);
    return requestJson(path, options, attempt + 1);
  }
  const error = new Error("Segment Studio received an unexpected response. Reload and try again.");
  error.status = response.status;
  throw error;
}

async function requestCoveJson(path, options) {
  const response = await extensionFetch(path, options);
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error || "Unable to load Cove data.");
  }
  return response.json();
}

async function requestBlob(path, options) {
  return (await requestDownload(path, options)).blob;
}

async function requestDownload(path, options) {
  const url = String(path).startsWith("/api/")
    ? path
    : `${API_ROOT}${path}`;
  const response = await extensionFetch(url, options);
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await response.blob(),
    fileName: downloadFileNameFromContentDisposition(
      response.headers.get("Content-Disposition")),
  };
}

export function downloadFileNameFromContentDisposition(
  contentDisposition,
  fallback = "segment-studio-ai-feedback.zip",
) {
  const value = String(contentDisposition || "");
  const encoded = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(value)?.[1];
  let candidate = null;
  if (encoded) {
    try {
      candidate = decodeURIComponent(encoded.replace(/^"|"$/g, ""));
    } catch {
      candidate = null;
    }
  }
  if (!candidate) {
    const plain = /filename\s*=\s*(?:"([^"]+)"|([^;]+))/i.exec(value);
    candidate = plain?.[1] || plain?.[2]?.trim() || null;
  }
  const safeName = candidate
    ?.split(/[\\/]/)
    .pop()
    ?.replace(/[\u0000-\u001f\u007f]/g, "")
    .trim();
  return safeName || fallback;
}

function formatTime(seconds) {
  if (seconds == null) return "—";
  const sign = seconds < 0 ? "−" : "";
  const absolute = Math.abs(seconds);
  const wholeSeconds = Math.floor(absolute);
  const hours = Math.floor(wholeSeconds / 3600);
  const minutes = Math.floor((wholeSeconds % 3600) / 60);
  const remainder = wholeSeconds % 60;
  const base = hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`
    : `${minutes}:${String(remainder).padStart(2, "0")}`;
  const milliseconds = Math.round((absolute - wholeSeconds) * 1000);
  return `${sign}${milliseconds > 0 ? `${base}.${String(milliseconds).padStart(3, "0")}` : base}`;
}

function createOperationId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function dependencyDeletionAllowed(preview, setMessage) {
  if (preview.permissionFailureCount > 0) {
    setMessage("You do not have permission to delete every affected segment.");
    return false;
  }
  if ((preview.integrityWarnings || []).length > 0) {
    setMessage("Repair the affected derivation data before deleting these segments.");
    return false;
  }
  return true;
}

function confirmDependencyDeletion(preview) {
  const selected = Number(preview.selectedSegmentCount) || 0;
  const dependent = Number(preview.dependentSegmentCount) || 0;
  const total = Number(preview.deletedSegmentCount) || selected + dependent;
  const shared = Number(preview.retainedSharedSegmentCount) || 0;
  const selectedLabel = `${selected} selected segment${selected === 1 ? "" : "s"}`;
  const dependentLabel = dependent > 0
    ? ` and ${dependent} dependent derived segment${dependent === 1 ? "" : "s"}`
    : "";
  const retainedNote = shared > 0
    ? ` ${shared} shared derived segment${shared === 1 ? "" : "s"} will be kept.`
    : "";
  if (!window.confirm(
    `Permanently delete ${selectedLabel}${dependentLabel} (${total} total)?${retainedNote} This cannot be undone.`,
  )) return false;
  return !preview.requiresTypedConfirmation
    || window.prompt('Type "DELETE SEGMENTS" to confirm.') === "DELETE SEGMENTS";
}

export function recyclingBinDeletionSummary(items, totalCount) {
  const binItems = Array.isArray(items) ? items : [];
  const explicitCount = Number(totalCount);
  const segmentCount = Number.isFinite(explicitCount) && explicitCount >= 0
    ? Math.trunc(explicitCount)
    : binItems.length;
  const sceneCount = new Set(binItems
    .map((item) => item?.videoId)
    .filter((videoId) => videoId != null))
    .size;
  return { sceneCount, segmentCount };
}

export function recyclingBinDeletionPrompt(items, totalCount) {
  const { sceneCount, segmentCount } = recyclingBinDeletionSummary(items, totalCount);
  return `Permanently delete ${segmentCount} segment${segmentCount === 1 ? "" : "s"} from ${sceneCount} scene${sceneCount === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}

async function confirmEmptyRecyclingBin(snapshot, onConfirmed) {
  const items = snapshot?.items || [];
  const summary = recyclingBinDeletionSummary(items, snapshot?.totalCount);
  if (summary.segmentCount === 0)
    return { status: "empty", ...summary };
  if (!snapshot?.fingerprint)
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(recyclingBinDeletionPrompt(items, summary.segmentCount)))
    return { status: "canceled", ...summary };
  onConfirmed?.();
  const operationKey = `bin-empty:${snapshot.fingerprint}`;
  const result = await requestJson("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: operationIdFor(operationKey),
      expectedFingerprint: snapshot.fingerprint,
    }),
  });
  completeOperation(operationKey);
  return {
    status: "emptied",
    sceneCount: Array.isArray(result.videoIds) ? result.videoIds.length : summary.sceneCount,
    segmentCount: Number(result.deletedCount) || summary.segmentCount,
  };
}

export { API_ROOT, operationIdFor, completeOperation, operationDiscardsMissingImage, rememberMissingImageDiscard, waitForRequestRetry, requestJson, requestCoveJson, requestBlob, requestDownload, formatTime, createOperationId, dependencyDeletionAllowed, confirmDependencyDeletion, confirmEmptyRecyclingBin };
