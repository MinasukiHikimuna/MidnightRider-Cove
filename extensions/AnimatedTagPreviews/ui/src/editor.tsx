import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type PointerEvent as ReactPointerEvent } from "react";
import type { MediaPlayerExtensionContext } from "@cove/runtime/components";
import { EntityReferenceSelector } from "@cove/runtime/components";
import { clampTiming, cropRectFromRecipe, moveCropByPixels, normalizeCrop, resizeCropByPixels, type CropRecipe } from "./cropGeometry";
import { DEFAULT_SETTINGS, previewApi, type JobStatus, type PreviewHealth, type PreviewSource } from "./api";
import { closeEditor, getEditorSnapshot, openEditor, subscribeEditor } from "./editorStore";
import { getPreviewCacheSnapshot, invalidatePreviewIndex, loadPreviewCache, subscribePreviewCache } from "./indexCache";
import { DecodedFramePreview, previewFrameTimestamps } from "./framePreview";

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
  return <button type="button" className="atp-action" onClick={(event) => openEditor(context.hostId, event.currentTarget)}>Animated preview</button>;
}

export function AnimatedPreviewPlayerOverlay(context: MediaPlayerExtensionContext) {
  const request = useSyncExternalStore(subscribeEditor, getEditorSnapshot, getEditorSnapshot);
  if (context.surface !== "detail" || request?.hostId !== context.hostId) return null;
  return <PreviewEditor key={request.sequence} context={context} />;
}

function PreviewEditor({ context }: { context: MediaPlayerExtensionContext }) {
  const [crop, setCrop] = useState<CropRecipe>({ anchorX: 0.5, anchorY: 0.5, zoom: 1 });
  const [startSeconds, setStartSeconds] = useState(context.currentTime);
  const [startTimestamp, setStartTimestamp] = useState(() => formatTimestamp(context.currentTime));
  const cache = useSyncExternalStore(subscribePreviewCache, getPreviewCacheSnapshot, getPreviewCacheSnapshot);
  const [durationSeconds, setDurationSeconds] = useState(DEFAULT_SETTINGS.defaultDurationSeconds);
  const [previewSpeed, setPreviewSpeed] = useState(1);
  const [tagId, setTagId] = useState<number>();
  const [tagLabel, setTagLabel] = useState<string>();
  const [jobId, setJobId] = useState<string>();
  const [job, setJob] = useState<JobStatus>();
  const [pollAttempt, setPollAttempt] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [health, setHealth] = useState<PreviewHealth>();
  const [healthError, setHealthError] = useState<string>();
  const [source, setSource] = useState<PreviewSource>();
  const [error, setError] = useState<string>();
  const dragRef = useRef<{ mode: "move" | "resize"; x: number; y: number } | undefined>(undefined);
  const [panelElement, setPanelElement] = useState<HTMLElement | null>(null);
  const terminalStatusRef = useRef<JobStatus["status"] | undefined>(undefined);
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

  const close = useCallback(() => closeEditor(context.hostId), [context.hostId]);

  useEffect(() => initialContextRef.current.acquireInteractionMode({ hideNativeControls: true, pauseTracking: true, pausePlayback: false }), []);
  useEffect(() => {
    const initial = initialContextRef.current;
    initial.setPlaybackRate?.(1);
    initial.seek(startSeconds);
    void initial.play();
    return () => {
      initial.setPlaybackRate?.(initial.playbackRate ?? 1);
      if (!initiallyPlayingRef.current) initial.pause();
    };
    // Only initialize playback once for this editor session. Timing changes are
    // handled by updateTiming and the loop boundary effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (context.currentTime >= startSeconds + durationSeconds || context.currentTime < startSeconds - 0.1) {
      context.seek(startSeconds);
      void context.play();
    }
  }, [context.currentTime, context.play, context.seek, durationSeconds, startSeconds]);
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
    if (!tagId) { setTagLabel(undefined); return; }
    let active = true;
    setTagLabel(undefined);
    void previewApi.tagLabel(tagId)
      .then((label) => { if (active) setTagLabel(label); })
      .catch(() => { if (active) setTagLabel(`Tag ${tagId}`); });
    return () => { active = false; };
  }, [tagId]);
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
  }, [context.hostId, job?.status, jobId, pollAttempt, tagId]);

  useEffect(() => {
    if (!job || !terminal.has(job.status) || terminalStatusRef.current === job.status) return;
    terminalStatusRef.current = job.status;
    if (job.status === "completed") void invalidatePreviewIndex().catch(() => {});
    else if (job.status === "cancelled") setError("Preview generation cancelled.");
    else setError(job.error ? `Preview generation failed: ${job.error}` : "Preview generation failed.");
  }, [job]);

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
    setError(undefined);
    setJobId(undefined);
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
      setJobId(result.jobId);
    } catch (reason) {
      setJob(undefined);
      setError(reason instanceof Error ? reason.message : "Could not start preview generation");
    }
  };
  const cancel = async () => {
    if (!jobId || !tagId) return;
    try {
      const result = await previewApi.cancel(context.hostId, tagId, jobId);
      if (result.cancelled) setJob({ status: "cancelled" });
      else setError("Preview publication has already started and can no longer be cancelled.");
    }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not cancel preview generation"); }
  };
  const deletePreview = async () => {
    if (!tagId || !hasPreview || !window.confirm("Delete the animated preview for this tag? The static tag image will remain.")) return;
    setDeleting(true);
    setError(undefined);
    try {
      const result = await previewApi.deleteMedia(tagId);
      await invalidatePreviewIndex();
      if (result.deleted) window.alert("Animated tag preview deleted.");
      else setError("This tag no longer has an animated preview.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not delete the animated preview");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="atp-editor" role="dialog" aria-modal="true" aria-label="Animated tag preview editor">
      <div
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
      </div>
      <aside ref={setPanelElement} className="atp-panel">
        <header><strong>Animated tag preview</strong><button type="button" aria-label="Close preview editor" autoFocus onClick={close}>×</button></header>
        <div className="atp-thumbnails">
          <figure style={{ aspectRatio: aspectRatio.replace(":", " / ") }}>{source ? <DecodedFramePreview key={`first-${previewTimes.first}`} mediaUrl={source.mediaUrl} seconds={previewTimes.first} crop={crop} aspectRatio={aspectRatio} alt="First preview frame" /> : null}<figcaption>{formatTime(previewTimes.first)}</figcaption></figure>
          <figure style={{ aspectRatio: aspectRatio.replace(":", " / ") }}>{source ? <DecodedFramePreview key={`last-${previewTimes.last}`} mediaUrl={source.mediaUrl} seconds={previewTimes.last} crop={crop} aspectRatio={aspectRatio} alt="Last preview frame" /> : null}<figcaption>{formatTime(previewTimes.last)}</figcaption></figure>
        </div>
        <div className="atp-time-row" role="group" aria-label="Start time">
          {[-1, -0.1].map((delta) => <button type="button" key={delta} onClick={() => nudgeStartTimestamp(delta)}>{delta}s</button>)}
          <input
            type="text"
            aria-label="Start time (HH:MM:SS)"
            spellCheck={false}
            value={startTimestamp}
            onChange={(event) => setStartTimestamp(event.target.value)}
            onBlur={commitStartTimestamp}
            onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }}
          />
          {[0.1, 1].map((delta) => <button type="button" key={delta} onClick={() => nudgeStartTimestamp(delta)}>+{delta}s</button>)}
        </div>
        <div className="atp-tag-control">
          {tagId ? <div className="atp-selected-tag" aria-label="Selected tag">
            <span>{tagLabel ?? "Loading tag…"}</span>
            <button type="button" disabled={busy} onClick={() => setTagId(undefined)}>Change</button>
          </div> : <EntityReferenceSelector entityType="tag" value={undefined} onChange={setTagId} allowCreate={false} disabled={busy} placeholder="Select a tag" dropdownPortalContainer={panelElement} />}
        </div>
        {job?.status !== "completed" ? <div className="atp-actions">
          <button type="button" disabled={!tagId || busy || !dependenciesReady || !previewReady} onClick={() => void generate()}>{job?.status === "cancelled"
            ? "Generation cancelled"
            : job?.status === "failed"
              ? "Try generation again"
              : jobBusy
                ? `Generating preview${job.progress != null ? ` — ${Math.round(job.progress * 100)}%` : "…"}`
                : "Generate preview"}</button>
          {jobBusy && jobId ? <button type="button" onClick={() => void cancel()}>Cancel generation</button> : null}
          {hasPreview ? <button type="button" className="atp-danger" disabled={busy} onClick={() => void deletePreview()}>Delete preview</button> : null}
        </div> : null}
        <details className="atp-advanced">
          <summary>Advanced settings</summary>
          <label>Duration (seconds)<input type="number" min={0.25} max={Math.max(0.25, context.duration - startSeconds)} step={0.25} value={durationSeconds} onChange={(event) => updateTiming(startSeconds, Number(event.target.value))} /></label>
          <label>Preview speed — {previewSpeed.toFixed(2)}×<input type="range" aria-label="Preview speed" min={0.25} max={1} step={0.05} value={previewSpeed} onChange={(event) => updatePreviewSpeed(Number(event.target.value))} /></label>
        </details>
        <div className="atp-status" aria-live="polite">{error
          ?? healthError
          ?? (health && !health.healthy ? "FFmpeg, FFprobe, and libvpx-vp9 must be ready before generation. Check Animated tag previews settings." : undefined)
          ?? (!health ? "Checking FFmpeg, FFprobe, and VP9 support…" : undefined)
          ?? (job ? `${job.status}${job.progress != null ? ` — ${Math.round(job.progress * 100)}%` : ""}` : "")}</div>
      </aside>
    </div>
  );
}
