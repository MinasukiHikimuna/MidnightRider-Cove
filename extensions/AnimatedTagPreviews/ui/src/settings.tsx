import { useEffect, useState } from "react";
import { DEFAULT_SETTINGS, previewApi, type PreviewHealth, type PreviewSettings } from "./api";
import { updateCachedSettings } from "./indexCache";

export function AnimatedPreviewSettings() {
  const [settings, setSettings] = useState<PreviewSettings>(DEFAULT_SETTINGS);
  const [health, setHealth] = useState<PreviewHealth>();
  const [status, setStatus] = useState("Loading…");
  const [cleanup, setCleanup] = useState<{ count: number; blobIds?: string[]; snapshotVersion: string }>();

  useEffect(() => {
    let active = true;
    Promise.allSettled([previewApi.getSettings(), previewApi.health()]).then(([settingsResult, healthResult]) => {
      if (!active) return;
      if (settingsResult.status === "fulfilled") setSettings(settingsResult.value);
      if (healthResult.status === "fulfilled") setHealth(healthResult.value);
      const reason = settingsResult.status === "rejected" ? settingsResult.reason : healthResult.status === "rejected" ? healthResult.reason : undefined;
      setStatus(reason ? (reason instanceof Error ? reason.message : "Could not complete dependency checks") : "");
    });
    return () => { active = false; };
  }, []);

  const update = <K extends keyof PreviewSettings>(key: K, value: PreviewSettings[K]) => setSettings((current) => ({ ...current, [key]: value }));
  const save = async () => {
    setStatus("Saving…");
    try {
      await previewApi.saveSettings(settings);
      updateCachedSettings(settings);
      setStatus("Settings saved.");
    } catch (reason) { setStatus(reason instanceof Error ? reason.message : "Could not save settings"); }
  };
  const dryRunCleanup = async () => {
    setStatus("Scanning for orphaned previews…");
    try {
      const result = await previewApi.cleanupOrphans(true);
      setCleanup({ count: result.count, blobIds: result.blobIds, snapshotVersion: result.snapshotVersion });
      setStatus("Dry run complete; no files were deleted.");
    }
    catch (reason) { setStatus(reason instanceof Error ? reason.message : "Could not scan orphaned previews"); }
  };
  const deleteOrphans = async () => {
    if (!cleanup?.count || !cleanup.snapshotVersion || !window.confirm(`Permanently delete ${cleanup.count} orphaned preview blob${cleanup.count === 1 ? "" : "s"}? This cannot be undone.`)) return;
    setStatus("Deleting orphaned previews…");
    try {
      const result = await previewApi.cleanupOrphans(false, cleanup.snapshotVersion);
      setCleanup(undefined);
      setStatus(`Deleted ${result.deletedBlobCount} orphaned preview blob${result.deletedBlobCount === 1 ? "" : "s"}.${result.failedBlobIds.length ? ` ${result.failedBlobIds.length} could not be deleted.` : ""}`);
    } catch (reason) { setStatus(reason instanceof Error ? reason.message : "Could not delete orphaned previews"); }
  };

  return (
    <section className="atp-settings" aria-labelledby="atp-settings-title">
      <h3 id="atp-settings-title">Animated tag previews</h3>
      <div className={`atp-health ${health?.healthy ? "is-healthy" : "is-unhealthy"}`}>
        <strong>{health?.healthy ? "Ready" : "Dependency check"}</strong>
        <span>{health ? `FFmpeg ${health.ffmpeg.available && health.ffmpeg.compatible ? "ready" : health.ffmpeg.message ?? "unavailable"}; FFprobe ${health.ffprobe.available && health.ffprobe.compatible ? "ready" : health.ffprobe.message ?? "unavailable"}; VP9 ${health.vp9Encoder.available && health.vp9Encoder.compatible ? "ready" : health.vp9Encoder.message ?? "unavailable"}.` : "Checking FFmpeg, FFprobe, and VP9 support…"}</span>
        {health?.ffmpeg.version ? <code>{health.ffmpeg.version}</code> : null}
      </div>
      <div className="atp-settings-grid">
        <label>Default duration (seconds)<input type="number" min={0.25} max={settings.maximumDurationSeconds} step={0.25} value={settings.defaultDurationSeconds} onChange={(event) => update("defaultDurationSeconds", Number(event.target.value))} /></label>
        <label>Maximum duration (seconds)<input type="number" min={1} max={30} step={0.25} value={settings.maximumDurationSeconds} onChange={(event) => update("maximumDurationSeconds", Number(event.target.value))} /></label>
        <label>Default width<input type="number" min={128} max={settings.maximumWidth} step={16} value={settings.defaultWidth} onChange={(event) => update("defaultWidth", Number(event.target.value))} /></label>
        <label>Maximum width<input type="number" min={128} max={2160} step={16} value={settings.maximumWidth} onChange={(event) => update("maximumWidth", Number(event.target.value))} /></label>
        <label>Frame-rate cap<input type="number" min={1} max={60} step={1} value={settings.frameRate} onChange={(event) => update("frameRate", Number(event.target.value))} /></label>
        <label>Minimum bitrate (Kbps)<input type="number" min={64} max={settings.maximumBitrateKbps} step={16} value={settings.minimumBitrateKbps} onChange={(event) => update("minimumBitrateKbps", Number(event.target.value))} /></label>
        <label>Maximum bitrate (Kbps)<input type="number" min={settings.minimumBitrateKbps} max={20000} step={16} value={settings.maximumBitrateKbps} onChange={(event) => update("maximumBitrateKbps", Number(event.target.value))} /></label>
        <label>Encoding timeout (seconds)<input type="number" min={10} max={900} step={10} value={settings.encodingTimeoutSeconds} onChange={(event) => update("encodingTimeoutSeconds", Number(event.target.value))} /></label>
        <label>Preview aspect ratio<select value={settings.aspectRatio} onChange={(event) => update("aspectRatio", event.target.value as PreviewSettings["aspectRatio"])}><option value="4:3">4:3 (Stash default)</option><option value="16:9">16:9</option><option value="1:1">Square</option></select></label>
        <label>Card fit<select value={settings.cardFit} onChange={(event) => update("cardFit", event.target.value as PreviewSettings["cardFit"])}><option value="inherit">Inherit Cove image fit</option><option value="cover">Cover</option><option value="contain">Contain</option></select></label>
        <label><input type="checkbox" checked={settings.matchCardAspectRatio} onChange={(event) => update("matchCardAspectRatio", event.target.checked)} /> Match top-level Tags card shape to preview</label>
        <label><input type="checkbox" checked={settings.enabledSurfaces.includes("card")} onChange={(event) => update("enabledSurfaces", event.target.checked ? [...new Set([...settings.enabledSurfaces, "card"])] : settings.enabledSurfaces.filter((surface) => surface !== "card"))} /> Show on cards</label>
        <label><input type="checkbox" checked={settings.enabledSurfaces.includes("hero")} onChange={(event) => update("enabledSurfaces", event.target.checked ? [...new Set([...settings.enabledSurfaces, "hero"])] : settings.enabledSurfaces.filter((surface) => surface !== "hero"))} /> Show in detail heroes</label>
        <label><input type="checkbox" checked={settings.hoverRestart} onChange={(event) => update("hoverRestart", event.target.checked)} /> Restart on hover</label>
        <label><input type="checkbox" checked={settings.hoverUnmute} onChange={(event) => update("hoverUnmute", event.target.checked)} /> Unmute on hover</label>
      </div>
      <div className="atp-settings-actions">
        <button type="button" onClick={() => void save()}>Save settings</button>
        <button type="button" onClick={() => void dryRunCleanup()}>Find orphaned previews</button>
        {cleanup?.count ? <button type="button" className="atp-danger" onClick={() => void deleteOrphans()}>Delete orphaned previews</button> : null}
      </div>
      {cleanup ? <>
        <p>{cleanup.count} orphaned preview blob{cleanup.count === 1 ? "" : "s"} found.</p>
        {cleanup.blobIds?.length ? <ul className="atp-orphan-list">{cleanup.blobIds.map((blobId) => <li key={blobId}><code>{blobId}</code></li>)}</ul> : null}
      </> : null}
      <p aria-live="polite">{status}</p>
    </section>
  );
}
