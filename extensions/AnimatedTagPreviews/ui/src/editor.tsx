import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type PointerEvent as ReactPointerEvent } from "react";
import type { MediaPlayerExtensionContext } from "@cove/runtime/components";
import { EntityReferenceSelector } from "@cove/runtime/components";
import { clampTiming, cropRectFromRecipe, moveCropByPixels, normalizeCrop, resizeCropByPixels, type CropRecipe } from "./cropGeometry";
import { ApiError, DEFAULT_SETTINGS, previewApi, type JobStatus, type PreviewHealth, type PreviewSource } from "./api";
import { closeEditor, getEditorSnapshot, isEditorCurrent, openEditor, subscribeEditor } from "./editorStore";
import { getPreviewCacheSnapshot, invalidatePreviewIndex, loadPreviewCache, subscribePreviewCache } from "./indexCache";
import { DecodedFramePreview, previewFrameTimestamps } from "./framePreview";
import { cleanupDetachedGeneration } from "./detachedGenerationCleanup";

const pollDelayMs = 750;
const terminal = new Set<JobStatus["status"]>(["completed", "failed", "cancelled"]);
const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
const formatTimestamp = (seconds: number) => {
  const totalMilliseconds = Math.round(seconds * 1000);
  const hours = Math.floor(totalMilliseconds / 3_600_000);
  const minutes = Math.floor((totalMilliseconds % 3_600_000) / 60_000);
  const wholeSeconds = Math.floor((totalMilliseconds % 60_000) / 1000);
  const milliseconds = totalMilliseconds % 1000;
  const fraction = milliseconds ? `.${milliseconds.toString().padStart(3, "0").replace(/0+$/, "")}` : "";
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${wholeSeconds.toString().padStart(2, "0")}${fraction}`;
};
const parseTimestamp = (value: string) => {
  const match = value.trim().match(/^(\d+):([0-5]\d):([0-5]\d(?:\.\d{1,3})?)$/);
  if (!match) return undefined;
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
};

export function AnimatedPreviewPlayerAction(context: MediaPlayerExtensionContext) {
  if (context.surface !== "detail") return null;
  return <button
    type="button"
    className="atp-action"
    aria-label="Animated preview"
    title="Animated preview"
    onClick={(event) => openEditor(context.hostId, event.currentTarget)}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 7h2.1l1.4-2h7l1.4 2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <circle cx="12" cy="12.5" r="4" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="m11 10.25 3.4 2.25-3.4 2.25Z" fill="currentColor" />
    </svg>
  </button>;
}

export function AnimatedPreviewPlayerOverlay(context: MediaPlayerExtensionContext) {
  const request = useSyncExternalStore(subscribeEditor, getEditorSnapshot, getEditorSnapshot);
  if (context.surface !== "detail" || request?.hostId !== context.hostId) return null;
  return <PreviewEditor key={request.sequence} context={context} sequence={request.sequence} />;
}

function PreviewEditor({ context, sequence }: { context: MediaPlayerExtensionContext; sequence: number }) {
  const [crop, setCrop] = useState<CropRecipe>({ anchorX: 0.5, anchorY: 0.5, zoom: 1 });
  const [startSeconds, setStartSeconds] = useState(context.currentTime);
  const [startTimestamp, setStartTimestamp] = useState(() => formatTimestamp(context.currentTime));
  const cache = useSyncExternalStore(subscribePreviewCache, getPreviewCacheSnapshot, getPreviewCacheSnapshot);
  const [durationSeconds, setDurationSeconds] = useState(DEFAULT_SETTINGS.defaultDurationSeconds);
  const [previewSpeed, setPreviewSpeed] = useState(1);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [tagId, setTagId] = useState<number>();
  const [tagLabel, setTagLabel] = useState<string>();
  const [jobId, setJobId] = useState<string>();
  const [job, setJob] = useState<JobStatus>();
  const [candidateId, setCandidateId] = useState<string>();
  const [reviewAction, setReviewAction] = useState<"approve" | "discard">();
  const [closeRequested, setCloseRequested] = useState(false);
  const [closeStatus, setCloseStatus] = useState<string>();
  const [pollAttempt, setPollAttempt] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [health, setHealth] = useState<PreviewHealth>();
  const [healthError, setHealthError] = useState<string>();
  const [source, setSource] = useState<PreviewSource>();
  const [error, setError] = useState<string>();
  const dragRef = useRef<{ mode: "move" | "resize"; x: number; y: number } | undefined>(undefined);
  const [panelElement, setPanelElement] = useState<HTMLElement | null>(null);
  const terminalStatusRef = useRef<JobStatus["status"] | undefined>(undefined);
  const reviewActionRef = useRef(false);
  const closeRequestedRef = useRef(false);
  const closeActionRef = useRef(false);
  const mountedRef = useRef(true);
  const approveButtonRef = useRef<HTMLButtonElement>(null);
  const settingsAppliedRef = useRef(false);
  const initiallyPlayingRef = useRef(context.playing);
  const initialContextRef = useRef(context);
  const aspectRatio = cache.settings?.aspectRatio ?? DEFAULT_SETTINGS.aspectRatio;
  const rect = cropRectFromRecipe(crop, context.contentRect, context.intrinsicWidth, context.intrinsicHeight, aspectRatio);
  const jobBusy = job?.status === "pending" || job?.status === "running";
  const busy = deleting || jobBusy;
  const hasPreview = Boolean(tagId && cache.index?.items.some((item) => item.tagId === tagId));
  const dependenciesReady = health?.healthy === true;
  const previewReady = Boolean(source && cache.settings);
  const previewTimes = previewFrameTimestamps(startSeconds, durationSeconds, cache.settings?.frameRate ?? DEFAULT_SETTINGS.frameRate, previewSpeed);

  const isCurrent = useCallback(() => mountedRef.current && isEditorCurrent(context.hostId, sequence), [context.hostId, sequence]);
  const closeCurrent = useCallback(() => closeEditor(context.hostId, true, sequence), [context.hostId, sequence]);
  const markCloseRequested = useCallback((status: string) => {
    closeRequestedRef.current = true;
    setCloseRequested(true);
    setCloseStatus(status);
    setError(undefined);
  }, []);
  const clearCloseRequested = useCallback(() => {
    closeRequestedRef.current = false;
    setCloseRequested(false);
    setCloseStatus(undefined);
  }, []);

  const discardCandidate = useCallback(async (onSuccess: () => void, onFailure?: () => void) => {
    if (!candidateId || !tagId || reviewActionRef.current) return;
    reviewActionRef.current = true;
    setReviewAction("discard");
    setError(undefined);
    try {
      const result = await previewApi.discardCandidate(context.hostId, tagId, candidateId);
      if (!result.discarded) throw new Error("The generated preview could not be discarded.");
      if (isCurrent()) onSuccess();
    } catch (reason) {
      if (!isCurrent()) return;
      if (reason instanceof ApiError && reason.status === 404) {
        onSuccess();
        return;
      }
      setError(reason instanceof Error ? reason.message : "Could not discard the generated preview");
      onFailure?.();
    } finally {
      if (isCurrent()) {
        reviewActionRef.current = false;
        setReviewAction(undefined);
      }
    }
  }, [candidateId, context.hostId, isCurrent, tagId]);

  const cancelForClose = useCallback(async (currentJobId: string, currentTagId: number) => {
    if (closeActionRef.current) return;
    closeActionRef.current = true;
    if (isCurrent()) setCloseStatus("Cancelling generation before closing…");
    try {
      const result = await previewApi.cancel(context.hostId, currentTagId, currentJobId);
      if (!isCurrent()) return;
      if (result.cancelled) closeCurrent();
      else setCloseStatus("Generation is finishing. Its preview will be discarded before closing.");
    } catch (reason) {
      if (!isCurrent()) return;
      if (reason instanceof ApiError && reason.status === 404) {
        closeCurrent();
        return;
      }
      clearCloseRequested();
      setError(reason instanceof Error ? reason.message : "Could not cancel preview generation before closing");
    } finally {
      if (isCurrent()) closeActionRef.current = false;
    }
  }, [clearCloseRequested, closeCurrent, context.hostId, isCurrent]);

  const close = useCallback(() => {
    if (closeRequestedRef.current || reviewActionRef.current || closeActionRef.current) return;
    if (!candidateId) {
      if (jobBusy) {
        markCloseRequested(jobId ? "Cancelling generation before closing…" : "Waiting for generation to start so it can be cancelled before closing…");
        if (jobId && tagId) void cancelForClose(jobId, tagId);
        return;
      }
      closeCurrent();
      return;
    }
    markCloseRequested("Discarding generated preview before closing…");
    void discardCandidate(closeCurrent, clearCloseRequested);
  }, [cancelForClose, candidateId, clearCloseRequested, closeCurrent, discardCandidate, jobBusy, jobId, markCloseRequested, tagId]);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);
  useEffect(() => initialContextRef.current.acquireInteractionMode({ hideNativeControls: true, pauseTracking: true, pausePlayback: false }), []);
  useEffect(() => {
    const initial = initialContextRef.current;
    initial.setPlaybackRate?.(1);
    initial.seek(startSeconds);
    void initial.play();
    return () => {
      initial.setPlaybackRate?.(initial.playbackRate ?? 1);
      if (initiallyPlayingRef.current) void initial.play();
      else initial.pause();
    };
    // Only initialize playback once for this editor session. Timing changes are
    // handled by updateTiming and the loop boundary effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (candidateId) approveButtonRef.current?.focus();
  }, [candidateId]);
  useEffect(() => {
    if (job?.status === "completed") return;
    if (context.currentTime >= startSeconds + durationSeconds || context.currentTime < startSeconds - 0.1) {
      context.seek(startSeconds);
      void context.play();
    }
  }, [context.currentTime, context.play, context.seek, durationSeconds, job?.status, startSeconds]);
  useEffect(() => { void loadPreviewCache().catch(() => {}); }, []);
  useEffect(() => {
    let active = true;
    void previewApi.health().then((next) => { if (active) setHealth(next); }).catch((reason) => {
      if (active) setHealthError(reason instanceof Error ? reason.message : "Could not check FFmpeg and VP9 support");
    });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    let active = true;
    void previewApi.previewSource(context.hostId)
      .then((next) => { if (active) setSource(next); })
      .catch(() => {});
    return () => { active = false; };
  }, [context.hostId]);
  useEffect(() => {
    if (!cache.settings || settingsAppliedRef.current) return;
    settingsAppliedRef.current = true;
    const next = clampTiming(startSeconds, cache.settings.defaultDurationSeconds, context.duration);
    setStartSeconds(next.startSeconds);
    setStartTimestamp(formatTimestamp(next.startSeconds));
    setDurationSeconds(next.durationSeconds);
  }, [cache.settings, context.duration, startSeconds]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); close(); return; }
      if (!event.key.startsWith("Arrow")) return;
      const target = event.target as HTMLElement | null;
      if (!target?.closest?.(".atp-crop")) return;
      const step = event.shiftKey ? 10 : 2;
      const dx = event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0;
      const dy = event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0;
      if (event.altKey) setCrop((value) => resizeCropByPixels(value, context.contentRect, dx + dy, aspectRatio));
      else setCrop((value) => moveCropByPixels(value, context.contentRect, dx, dy, aspectRatio));
      event.preventDefault();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, context.contentRect]);

  useEffect(() => {
    if (!jobId || !tagId || terminal.has(job?.status ?? "pending")) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const next = await previewApi.job(context.hostId, tagId, jobId);
        if (!cancelled) {
          if (next.status === "completed") {
            context.pause();
            if (next.candidateId) setCandidateId(next.candidateId);
          }
          setError(undefined);
          setJob(next);
          setPollAttempt((attempt) => attempt + 1);
        }
      } catch (reason) {
        if (!cancelled) {
          setError(reason instanceof Error ? reason.message : "Could not read job status");
          setPollAttempt((attempt) => attempt + 1);
        }
      }
    }, pollDelayMs);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [context.hostId, context.pause, job?.status, jobId, pollAttempt, tagId]);

  useEffect(() => {
    if (!job || !terminal.has(job.status) || terminalStatusRef.current === job.status) return;
    terminalStatusRef.current = job.status;
    if (closeRequestedRef.current) {
      if (job.status === "completed" && job.candidateId) setCandidateId(job.candidateId);
      else closeCurrent();
      return;
    }
    if (job.status === "completed") {
      context.pause();
      if (job.candidateId) setCandidateId(job.candidateId);
      else {
        const message = "Preview generation completed without a preview candidate. Try generation again.";
        terminalStatusRef.current = "failed";
        setJob({ ...job, status: "failed", error: message });
        setJobId(undefined);
        setError(message);
        context.setPlaybackRate?.(previewSpeed);
        context.seek(startSeconds);
        void context.play();
      }
    } else if (job.status === "cancelled") setError("Preview generation cancelled.");
    else setError(job.error ? `Preview generation failed: ${job.error}` : "Preview generation failed.");
  }, [closeCurrent, context.pause, context.play, context.seek, context.setPlaybackRate, job, previewSpeed, startSeconds]);

  useEffect(() => {
    if (!closeRequested || !candidateId || reviewActionRef.current) return;
    void discardCandidate(closeCurrent, clearCloseRequested);
  }, [candidateId, clearCloseRequested, closeCurrent, closeRequested, discardCandidate]);

  const updateTiming = (start: number, duration: number) => {
    const next = clampTiming(start, duration, context.duration);
    setStartSeconds(next.startSeconds);
    setStartTimestamp(formatTimestamp(next.startSeconds));
    setDurationSeconds(next.durationSeconds);
    context.seek(next.startSeconds);
    void context.play();
  };
  const commitStartTimestamp = () => {
    const parsed = parseTimestamp(startTimestamp);
    if (parsed == null) {
      setStartTimestamp(formatTimestamp(startSeconds));
      return;
    }
    updateTiming(parsed, durationSeconds);
  };
  const nudgeStartTimestamp = (delta: number) => {
    const parsed = parseTimestamp(startTimestamp);
    updateTiming((parsed ?? startSeconds) + delta, durationSeconds);
  };
  const updatePreviewSpeed = (next: number) => {
    setPreviewSpeed(next);
    context.setPlaybackRate?.(next);
  };
  const beginPointer = (mode: "move" | "resize") => (event: ReactPointerEvent) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { mode, x: event.clientX, y: event.clientY };
  };
  const movePointer = (event: ReactPointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    setCrop((value) => drag.mode === "move" ? moveCropByPixels(value, context.contentRect, dx, dy, aspectRatio) : resizeCropByPixels(value, context.contentRect, Math.max(dx, dy), aspectRatio));
    dragRef.current = { ...drag, x: event.clientX, y: event.clientY };
  };

  const generate = async () => {
    if (!tagId || !source || !cache.settings) return;
    const selectedTagId = tagId;
    setError(undefined);
    setJobId(undefined);
    setCandidateId(undefined);
    setPollAttempt(0);
    terminalStatusRef.current = undefined;
    setJob({ status: "pending", progress: 0 });
    try {
      const result = await previewApi.generate(context.hostId, tagId, {
        sourceFileId: source.fileId,
        startSeconds,
        durationSeconds,
        playbackSpeed: previewSpeed,
        ...normalizeCrop(crop),
      });
      if (!isCurrent()) {
        void cleanupDetachedGeneration({
          videoId: context.hostId,
          tagId: selectedTagId,
          jobId: result.jobId,
          encodingTimeoutSeconds: cache.settings.encodingTimeoutSeconds,
          pollDelayMs,
        });
        return;
      }
      setJobId(result.jobId);
      if (closeRequestedRef.current) void cancelForClose(result.jobId, selectedTagId);
    } catch (reason) {
      if (!isCurrent()) return;
      setJob(undefined);
      if (closeRequestedRef.current) closeCurrent();
      else setError(reason instanceof Error ? reason.message : "Could not start preview generation");
    }
  };
  const cancel = async () => {
    if (!jobId || !tagId) return;
    try {
      const result = await previewApi.cancel(context.hostId, tagId, jobId);
      if (!isCurrent()) return;
      if (result.cancelled) setJob({ status: "cancelled" });
      else setError("Preview publication has already started and can no longer be cancelled.");
    }
    catch (reason) { if (isCurrent()) setError(reason instanceof Error ? reason.message : "Could not cancel preview generation"); }
  };
  const deletePreview = async () => {
    if (!tagId || !hasPreview || !window.confirm("Delete the animated preview for this tag? The static tag image will remain.")) return;
    setDeleting(true);
    setError(undefined);
    try {
      const result = await previewApi.deleteMedia(tagId);
      await invalidatePreviewIndex();
      if (!isCurrent()) return;
      if (result.deleted) window.alert("Animated tag preview deleted.");
      else setError("This tag no longer has an animated preview.");
    } catch (reason) {
      if (isCurrent()) setError(reason instanceof Error ? reason.message : "Could not delete the animated preview");
    } finally {
      if (isCurrent()) setDeleting(false);
    }
  };
  const approveCandidate = async () => {
    if (!candidateId || !tagId || reviewActionRef.current) return;
    reviewActionRef.current = true;
    setReviewAction("approve");
    setError(undefined);
    try {
      await previewApi.approveCandidate(context.hostId, tagId, candidateId);
      try { await invalidatePreviewIndex(); } catch { /* A later cache load retries the invalidated index. */ }
      if (isCurrent()) closeCurrent();
    } catch (reason) {
      if (isCurrent()) setError(reason instanceof Error ? reason.message : "Could not approve the generated preview");
    } finally {
      if (isCurrent()) {
        reviewActionRef.current = false;
        setReviewAction(undefined);
      }
    }
  };
  const resetCandidate = () => {
    void discardCandidate(() => {
      setCandidateId(undefined);
      setJob(undefined);
      setJobId(undefined);
      setPollAttempt(0);
      terminalStatusRef.current = undefined;
      setError(undefined);
      context.setPlaybackRate?.(previewSpeed);
      context.seek(startSeconds);
      void context.play();
    });
  };

  const reviewLabel = tagLabel ?? (tagId ? `Tag ${tagId}` : "Selected tag");

  return (
    <div className="atp-editor" role="dialog" aria-modal="true" aria-label="Animated tag preview editor">
      {!candidateId ? <div
        className="atp-crop"
        role="application"
        aria-label={`${aspectRatio} crop; use arrow keys to move and Alt plus arrow keys to resize`}
        style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
        tabIndex={0}
        onPointerDown={beginPointer("move")}
        onPointerMove={movePointer}
        onPointerUp={() => { dragRef.current = undefined; }}
      >
        <span className="atp-crop-grid" />
        <button type="button" className="atp-resize" aria-label="Resize crop" onPointerDown={(event) => { event.stopPropagation(); beginPointer("resize")(event); }} onPointerMove={movePointer} onPointerUp={() => { dragRef.current = undefined; }} />
      </div> : null}
      <aside ref={setPanelElement} className="atp-panel">
        <header><strong>Animated tag preview</strong><button type="button" className="atp-button atp-close" aria-label="Close preview editor" disabled={Boolean(reviewAction) || closeRequested} autoFocus onClick={close}>×</button></header>
        {candidateId ? <div className="atp-review" role="region" aria-label={`Generated preview ready for ${reviewLabel}`} aria-live="polite">
          <strong className="atp-review-tag">{reviewLabel}</strong>
          <video
            className="atp-review-media"
            src={previewApi.candidateMediaUrl(context.hostId, tagId!, candidateId)}
            aria-label={`Generated preview for ${reviewLabel}`}
            style={{ aspectRatio: aspectRatio.replace(":", " / ") }}
            autoPlay
            loop
            muted
            playsInline
            onError={() => setError("The generated preview could not be loaded. You can Reset and try again.")}
          />
          <div className="atp-review-actions">
            <button ref={approveButtonRef} type="button" className="atp-button atp-primary" disabled={Boolean(reviewAction) || closeRequested} onClick={() => void approveCandidate()}>{reviewAction === "approve" ? "Approving…" : "Approve"}</button>
            <button type="button" className="atp-button" disabled={Boolean(reviewAction) || closeRequested} onClick={resetCandidate}>{reviewAction === "discard" ? "Resetting…" : "Reset"}</button>
          </div>
          {error || closeStatus ? <div className="atp-status" aria-live="polite">{error ?? closeStatus}</div> : null}
        </div> : <><div className="atp-thumbnails">
          <figure style={{ aspectRatio: aspectRatio.replace(":", " / ") }}>{source ? <DecodedFramePreview mediaUrl={source.mediaUrl} seconds={previewTimes.first} crop={crop} aspectRatio={aspectRatio} alt="First preview frame" /> : null}<figcaption>{formatTime(previewTimes.first)}</figcaption></figure>
          <figure style={{ aspectRatio: aspectRatio.replace(":", " / ") }}>{source ? <DecodedFramePreview mediaUrl={source.mediaUrl} seconds={previewTimes.last} crop={crop} aspectRatio={aspectRatio} alt="Last preview frame" /> : null}<figcaption>{formatTime(previewTimes.last)}</figcaption></figure>
        </div>
        <div className="atp-time-row" role="group" aria-label="Start time">
          {[-1, -0.1].map((delta) => <button type="button" className="atp-button" key={delta} onClick={() => nudgeStartTimestamp(delta)}>{delta}s</button>)}
          <input
            type="text"
            aria-label="Start time (HH:MM:SS)"
            spellCheck={false}
            value={startTimestamp}
            onChange={(event) => setStartTimestamp(event.target.value)}
            onBlur={commitStartTimestamp}
            onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }}
          />
          {[0.1, 1].map((delta) => <button type="button" className="atp-button" key={delta} onClick={() => nudgeStartTimestamp(delta)}>+{delta}s</button>)}
        </div>
        <div className="atp-tag-control">
          <EntityReferenceSelector
            entityType="tag"
            value={tagId}
            selectedDisplay="input"
            selectedLabel={tagLabel}
            onChange={(value, option) => {
              setTagId(value);
              setTagLabel(option?.label);
            }}
            allowCreate={false}
            disabled={busy}
            placeholder="Select a tag"
            dropdownPortalContainer={panelElement}
          />
        </div>
        <details className="atp-advanced" open={advancedOpen} onToggle={(event) => setAdvancedOpen(event.currentTarget.open)}>
          <summary>Advanced settings</summary>
          <label>Duration (seconds)<input type="number" min={0.25} max={Math.max(0.25, context.duration - startSeconds)} step={0.25} value={durationSeconds} onChange={(event) => updateTiming(startSeconds, Number(event.target.value))} /></label>
          <label>Preview speed — {previewSpeed.toFixed(2)}×<input type="range" aria-label="Preview speed" min={0.25} max={1} step={0.05} value={previewSpeed} onChange={(event) => updatePreviewSpeed(Number(event.target.value))} /></label>
        </details>
        {job?.status !== "completed" ? <button type="button" className="atp-button atp-primary" disabled={!tagId || busy || !dependenciesReady || !previewReady} onClick={() => void generate()}>{job?.status === "cancelled"
          ? "Generation cancelled"
          : job?.status === "failed"
            ? "Try generation again"
            : jobBusy
              ? `Generating preview${job.progress != null ? ` — ${Math.round(job.progress * 100)}%` : "…"}`
              : "Generate preview"}</button> : null}
        {job?.status !== "completed" && (Boolean(jobBusy && jobId) || hasPreview) ? <div className="atp-actions">
          {jobBusy && jobId ? <button type="button" className="atp-button" disabled={closeRequested} onClick={() => void cancel()}>Cancel generation</button> : null}
          {hasPreview ? <button type="button" className="atp-button atp-danger" disabled={busy} onClick={() => void deletePreview()}>Delete preview</button> : null}
        </div> : null}
        <div className="atp-status" aria-live="polite">{error
          ?? closeStatus
          ?? healthError
          ?? (health && !health.healthy ? "FFmpeg, FFprobe, and libvpx-vp9 must be ready before generation. Check Animated tag previews settings." : undefined)
          ?? (!health ? "Checking FFmpeg, FFprobe, and VP9 support…" : undefined)
          ?? (job ? `${job.status}${job.progress != null ? ` — ${Math.round(job.progress * 100)}%` : ""}` : "")}</div>
        </>}
      </aside>
    </div>
  );
}
