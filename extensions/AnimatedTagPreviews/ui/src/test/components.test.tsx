import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MediaPlayerExtensionContext } from "@cove/runtime/components";
import { AnimatedPreviewPlayerAction, AnimatedPreviewPlayerOverlay } from "../editor";
import { AnimatedTagMedia } from "../media";
import { AnimatedPreviewSettings } from "../settings";
import { __resetApiForTests, setApiTransportForTests } from "../api";
import { __resetEditorStoreForTests } from "../editorStore";
import { __resetPreviewCacheForTests, getPreviewCacheSnapshot, invalidatePreviewIndex, loadPreviewCache } from "../indexCache";
import { previewFrameTimestamps } from "../framePreview";

const healthyDependencies = {
  healthy: true,
  ffmpeg: { available: true, compatible: true },
  ffprobe: { available: true, compatible: true },
  vp9Encoder: { available: true, compatible: true },
};

function context(overrides: Partial<MediaPlayerExtensionContext> = {}): MediaPlayerExtensionContext {
  return {
    hostType: "video", hostId: 12, surface: "detail", currentTime: 42.5, duration: 100, playing: false,
    playbackRate: 1,
    intrinsicWidth: 1920, intrinsicHeight: 1080, contentRect: { left: 100, top: 50, width: 800, height: 450 },
    play: vi.fn(async () => {}), pause: vi.fn(), seek: vi.fn(), setPlaybackRate: vi.fn(), acquireInteractionMode: vi.fn(() => vi.fn()), ...overrides,
  };
}

beforeEach(() => {
  __resetEditorStoreForTests();
  __resetPreviewCacheForTests();
  __resetApiForTests();
  setApiTransportForTests(async (path) => path.endsWith("/health") ? healthyDependencies : {});
  vi.mocked(window.matchMedia).mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as MediaQueryList);
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
});

describe("preview editor", () => {
  it("renders an icon-only toolbar action with an accessible tooltip", () => {
    render(<AnimatedPreviewPlayerAction {...context()} />);

    const action = screen.getByRole("button", { name: "Animated preview" });
    expect(action).toHaveAttribute("title", "Animated preview");
    expect(action).toHaveTextContent(/^$/);
    const icon = action.querySelector("svg");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveAttribute("focusable", "false");
  });

  it("previews the decoded first frame and the last encoded output frame", () => {
    expect(previewFrameTimestamps(2.227, 5, 30)).toEqual({ first: 2.227, last: 7.227 - (1 / 30) });
    // The encoder resamples a 60fps source to 24fps, so the last displayed input
    // timestamp follows the output frame schedule rather than the source rate.
    expect(previewFrameTimestamps(2.227, 5, 24).last).toBeCloseTo(7.227 - (1 / 24));
    expect(previewFrameTimestamps(0, 0.01, 24)).toEqual({ first: 0, last: 0 });
  });

  it("posts the canonical selected tag ID and normalized crop", async () => {
    const requests: Array<{ path: string; init?: RequestInit }> = [];
    setApiTransportForTests(async (path, init) => {
      if (path.endsWith("/health")) return healthyDependencies;
      if (path.endsWith("/videos/12/source")) return { fileId: 91 };
      requests.push({ path, init });
      if (path.endsWith("/generate")) return { jobId: "job-1" };
      return { status: "completed", progress: 1 };
    });
    const ctx = context();
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    await userEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    await userEvent.click(screen.getByText("Advanced settings"));
    fireEvent.change(screen.getByRole("slider", { name: "Preview speed" }), { target: { value: "0.5" } });
    fireEvent.change(screen.getByLabelText("Tag ID"), { target: { value: "77" } });
    await userEvent.click(screen.getByRole("button", { name: /generate preview/i }));
    await waitFor(() => expect(requests.some((request) => request.path.endsWith("/generate"))).toBe(true));
    const generate = requests.find((request) => request.path.endsWith("/generate"))!;
    expect(generate.path).toContain("/videos/12/tags/77/generate");
    expect(JSON.parse(String(generate.init?.body))).toEqual({ sourceFileId: 91, startSeconds: 42.5, durationSeconds: 5, playbackSpeed: 0.5, anchorX: 0.5, anchorY: 0.5, zoom: 1 });
  });

  it("replaces the tag selector with the single selected tag", async () => {
    setApiTransportForTests(async (path) => {
      if (path.endsWith("/health")) return healthyDependencies;
      if (path.endsWith("/videos/12/source")) return { fileId: 91 };
      if (path.endsWith("/tags/77")) return { name: "Featured tag" };
      return {};
    });
    const ctx = context();
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    await userEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    fireEvent.change(screen.getByLabelText("Tag ID"), { target: { value: "77" } });

    expect(await screen.findByText("Featured tag")).toBeInTheDocument();
    expect(screen.queryByLabelText("Tag ID")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Change" }));
    expect(screen.getByLabelText("Tag ID")).toBeInTheDocument();
  });

  it("releases the lease, restores focus, and closes on Escape", async () => {
    const release = vi.fn();
    const ctx = context({ acquireInteractionMode: vi.fn(() => release) });
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    const action = screen.getByRole("button", { name: /animated preview/i });
    action.focus();
    await userEvent.click(action);
    expect(ctx.acquireInteractionMode).toHaveBeenCalledWith({ hideNativeControls: true, pauseTracking: true, pausePlayback: false });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(release).toHaveBeenCalledTimes(1);
    expect(ctx.pause).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(action).toHaveFocus());
  });

  it("loops the selected interval in the main video player", async () => {
    const ctx = context({ currentTime: 10, duration: 30 });
    const view = render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    await userEvent.click(screen.getByRole("button", { name: /animated preview/i }));

    expect(ctx.seek).toHaveBeenCalledWith(10);
    expect(ctx.play).toHaveBeenCalled();
    view.rerender(<><AnimatedPreviewPlayerAction {...ctx} currentTime={15} /><AnimatedPreviewPlayerOverlay {...ctx} currentTime={15} /></>);
    expect(ctx.seek).toHaveBeenLastCalledWith(10);
    expect(ctx.play).toHaveBeenCalledTimes(2);
  });

  it("keeps duration and live playback speed in advanced settings below generate", async () => {
    const ctx = context({ playbackRate: 1.5 });
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    await userEvent.click(screen.getByRole("button", { name: /animated preview/i }));

    const options = screen.getByText("Advanced settings").closest("details")!;
    const generate = screen.getByRole("button", { name: "Generate preview" });
    expect(generate.compareDocumentPosition(options) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(options).not.toHaveAttribute("open");
    await userEvent.click(screen.getByText("Advanced settings"));
    expect(options).toHaveAttribute("open");
    expect(screen.getByRole("spinbutton", { name: "Duration (seconds)" })).toBeInTheDocument();
    fireEvent.change(screen.getByRole("slider", { name: "Preview speed" }), { target: { value: "0.5" } });
    expect(screen.getByText("Preview speed — 0.50×")).toBeInTheDocument();
    expect(ctx.setPlaybackRate).toHaveBeenLastCalledWith(0.5);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(ctx.setPlaybackRate).toHaveBeenLastCalledWith(1.5);
  });

  it("does not re-seek for normal player timestamp rounding near the loop start", async () => {
    const ctx = context({ currentTime: 2.227, duration: 30 });
    const view = render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    await userEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    vi.mocked(ctx.seek).mockClear();

    view.rerender(<><AnimatedPreviewPlayerAction {...ctx} currentTime={2.2} /><AnimatedPreviewPlayerOverlay {...ctx} currentTime={2.2} /></>);

    expect(ctx.seek).not.toHaveBeenCalled();
  });

  it("does not churn the interaction lease on live player updates or expose crop form inputs", async () => {
    const release = vi.fn();
    const acquire = vi.fn(() => release);
    const initial = context({ acquireInteractionMode: acquire });
    const view = render(<><AnimatedPreviewPlayerAction {...initial} /><AnimatedPreviewPlayerOverlay {...initial} /></>);
    await userEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    const input = screen.getByRole("textbox", { name: "Start time (HH:MM:SS)" });
    input.focus();
    fireEvent.keyDown(input, { key: "ArrowRight" });
    view.rerender(<><AnimatedPreviewPlayerAction {...initial} currentTime={43} acquireInteractionMode={vi.fn(() => vi.fn())} /><AnimatedPreviewPlayerOverlay {...initial} currentTime={43} acquireInteractionMode={vi.fn(() => vi.fn())} /></>);
    expect(acquire).toHaveBeenCalledTimes(1);
    expect(release).not.toHaveBeenCalled();
    expect(screen.queryByLabelText("Horizontal position")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Zoom")).not.toBeInTheDocument();
    expect(screen.getByRole("application", { name: /4:3 crop/i })).toBeInTheDocument();
  });

  it("seeks the host player when the preview start time changes", async () => {
    const ctx = context();
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    await userEvent.click(screen.getByRole("button", { name: /animated preview/i }));

    await userEvent.click(screen.getByRole("button", { name: "+0.1s" }));

    expect(ctx.seek).toHaveBeenCalledWith(42.6);
  });

  it("keeps decoded preview elements mounted when the start time changes", async () => {
    setApiTransportForTests(async (path) => {
      if (path.endsWith("/health")) return healthyDependencies;
      if (path.endsWith("/videos/12/source")) return { fileId: 91 };
      return {};
    });
    const ctx = context();
    const view = render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    await userEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    await waitFor(() => expect(view.container.querySelectorAll(".atp-thumbnails video")).toHaveLength(2));
    const videos = Array.from(view.container.querySelectorAll(".atp-thumbnails video"));

    await userEvent.click(screen.getByRole("button", { name: "+0.1s" }));

    expect(Array.from(view.container.querySelectorAll(".atp-thumbnails video"))).toEqual(videos);
  });

  it("presents and edits the start time as a compact timestamp between its nudges", async () => {
    const ctx = context();
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    await userEvent.click(screen.getByRole("button", { name: /animated preview/i }));

    const row = screen.getByRole("group", { name: "Start time" });
    const controls = Array.from(row.querySelectorAll("button, input"));
    expect(controls.map((control) => control.getAttribute("aria-label") ?? control.textContent)).toEqual([
      "-1s", "-0.1s", "Start time (HH:MM:SS)", "+0.1s", "+1s",
    ]);

    const input = screen.getByRole("textbox", { name: "Start time (HH:MM:SS)" });
    expect(input).toHaveValue("00:00:42.5");
    await userEvent.clear(input);
    await userEvent.type(input, "00:01:02.25");
    fireEvent.blur(input);

    expect(ctx.seek).toHaveBeenCalledWith(62.25);
    expect(input).toHaveValue("00:01:02.25");
  });

  it("applies a nudge to a newly typed timestamp", async () => {
    const ctx = context();
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    await userEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    const input = screen.getByRole("textbox", { name: "Start time (HH:MM:SS)" });
    await userEvent.clear(input);
    await userEvent.type(input, "00:01:02.25");

    await userEvent.click(screen.getByRole("button", { name: "+0.1s" }));

    expect(ctx.seek).toHaveBeenLastCalledWith(62.35);
    expect(input).toHaveValue("00:01:02.35");
  });

  it("removes generation and deletion actions after completion", async () => {
    vi.useFakeTimers();
    const alert = vi.spyOn(window, "alert").mockImplementation(() => {});
    setApiTransportForTests(async (path) => {
      if (path.endsWith("/health")) return healthyDependencies;
      if (path.endsWith("/generate")) return { jobId: "job-1" };
      if (path.includes("/jobs/job-1")) return { status: "completed", progress: 1 };
      return {};
    });
    const ctx = context();
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    fireEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    await act(async () => { await Promise.resolve(); });
    fireEvent.change(screen.getByLabelText("Tag ID"), { target: { value: "77" } });
    fireEvent.click(screen.getByRole("button", { name: /generate preview/i }));
    await act(async () => { await Promise.resolve(); });
    await act(async () => { vi.advanceTimersByTime(750); await Promise.resolve(); });
    expect(screen.queryByRole("button", { name: "Preview generated" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete preview" })).not.toBeInTheDocument();
    expect(alert).not.toHaveBeenCalled();
    await act(async () => { vi.advanceTimersByTime(2_000); await Promise.resolve(); });
    expect(alert).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("continues polling while consecutive job responses remain running", async () => {
    vi.useFakeTimers();
    const alert = vi.spyOn(window, "alert").mockImplementation(() => {});
    let statusReads = 0;
    setApiTransportForTests(async (path) => {
      if (path.endsWith("/health")) return healthyDependencies;
      if (path.endsWith("/generate")) return { jobId: "job-1" };
      if (path.includes("/jobs/job-1")) {
        statusReads += 1;
        return statusReads < 3
          ? { status: "running", progress: statusReads / 4 }
          : { status: "completed", progress: 1 };
      }
      return {};
    });
    const ctx = context();
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    fireEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    await act(async () => { await Promise.resolve(); });
    fireEvent.change(screen.getByLabelText("Tag ID"), { target: { value: "77" } });
    fireEvent.click(screen.getByRole("button", { name: /generate preview/i }));
    await act(async () => { await Promise.resolve(); });

    for (let poll = 0; poll < 3; poll += 1) {
      await act(async () => { vi.advanceTimersByTime(750); await Promise.resolve(); });
    }

    expect(statusReads).toBe(3);
    expect(screen.queryByRole("button", { name: "Preview generated" })).not.toBeInTheDocument();
    expect(alert).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("deletes an existing preview only after confirmation", async () => {
    const requests: Array<{ path: string; init?: RequestInit }> = [];
    let deleted = false;
    setApiTransportForTests(async (path, init) => {
      if (path.endsWith("/health")) return healthyDependencies;
      requests.push({ path, init });
      if (path.endsWith("/tags")) return { version: deleted ? "2" : "1", items: deleted ? [] : [{ tagId: 77, version: "v1" }] };
      if (path.endsWith("/tags/77/media") && init?.method === "DELETE") {
        deleted = true;
        return { tagId: 77, deleted: true, blobDeleted: true };
      }
      return {};
    });
    await loadPreviewCache();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.spyOn(window, "alert").mockImplementation(() => {});
    const ctx = context();
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    await userEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    fireEvent.change(screen.getByLabelText("Tag ID"), { target: { value: "77" } });

    await userEvent.click(screen.getByRole("button", { name: "Delete preview" }));

    await waitFor(() => expect(requests.some((request) => request.path.endsWith("/tags/77/media") && request.init?.method === "DELETE")).toBe(true));
    await waitFor(() => expect(screen.queryByRole("button", { name: "Delete preview" })).not.toBeInTheDocument());
  });
});

describe("animated tag media", () => {
  it("replaces native media on the core tag hover surface", async () => {
    setApiTransportForTests(async (path) => path.endsWith("/settings") ? {} : { version: "a", items: [{ tagId: 7, version: "v1" }] });
    render(<AnimatedTagMedia entityType="tag" entityId={7} surface="hover" imageUrl="poster.jpg" alt="Tag" fit="cover" renderDefault={() => <img alt="static" />} />);
    expect(await screen.findByLabelText("Animated preview for Tag")).toBeInTheDocument();
  });

  it("keeps the core static hover when the tag has no animated preview", async () => {
    setApiTransportForTests(async (path) => path.endsWith("/settings") ? {} : { version: "a", items: [] });
    render(<AnimatedTagMedia entityType="tag" entityId={7} surface="hover" imageUrl="poster.jpg" alt="Tag" fit="cover" renderDefault={() => <img src="poster.jpg" alt="static" />} />);

    await waitFor(() => expect(getPreviewCacheSnapshot().index?.version).toBe("a"));
    expect(screen.getByRole("img", { name: "static" })).toHaveAttribute("src", "poster.jpg");
    expect(screen.queryByLabelText("Animated preview for Tag")).not.toBeInTheDocument();
  });

  it("applies explicit card fit and the configured aspect class", async () => {
    setApiTransportForTests(async (path) => path.endsWith("/settings")
      ? { cardFit: "contain", aspectRatio: "4:3", matchCardAspectRatio: true }
      : { version: "a", items: [{ tagId: 7, version: "v1" }] });
    render(<AnimatedTagMedia entityType="tag" entityId={7} surface="card" imageUrl="poster.jpg" alt="Tag" fit="cover" renderDefault={() => <img alt="static" />} />);
    const video = await screen.findByLabelText("Animated preview for Tag");
    expect(video).toHaveStyle({ objectFit: "contain" });
    expect(video).toHaveClass("atp-aspect-4-3");
  });

  it("uses the static renderer for reduced motion", async () => {
    vi.mocked(window.matchMedia).mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as MediaQueryList);
    setApiTransportForTests(async () => ({ version: "a", items: [{ tagId: 7, version: "v1" }] }));
    render(<AnimatedTagMedia entityType="tag" entityId={7} surface="card" imageUrl="poster.jpg" alt="Tag" fit="cover" renderDefault={() => <img alt="static" />} />);
    expect(screen.getByAltText("static")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByAltText("static")).toBeInTheDocument());
  });

  it("falls back after WebM playback errors", async () => {
    setApiTransportForTests(async () => ({ version: "a", items: [{ tagId: 7, version: "v1" }] }));
    render(<AnimatedTagMedia entityType="tag" entityId={7} surface="card" imageUrl="poster.jpg" alt="Tag" fit="cover" renderDefault={() => <img alt="static" />} />);
    const video = await screen.findByLabelText("Animated preview for Tag");
    fireEvent.error(video);
    await waitFor(() => expect(screen.getByAltText("static")).toBeInTheDocument());
  });

  it("pauses while offscreen and while the document is hidden", async () => {
    let intersection: IntersectionObserverCallback | undefined;
    vi.stubGlobal("IntersectionObserver", class {
      constructor(callback: IntersectionObserverCallback) { intersection = callback; }
      observe() {}
      disconnect() {}
    });
    setApiTransportForTests(async () => ({ version: "a", items: [{ tagId: 7, version: "v1" }] }));
    render(<AnimatedTagMedia entityType="tag" entityId={7} surface="card" imageUrl="poster.jpg" alt="Tag" fit="cover" renderDefault={() => <img alt="static" />} />);
    const video = await screen.findByLabelText("Animated preview for Tag");
    const pause = vi.spyOn(video as HTMLVideoElement, "pause").mockImplementation(() => {});
    await act(async () => { intersection?.([{ isIntersecting: false, intersectionRatio: 0, target: video } as unknown as IntersectionObserverEntry], {} as IntersectionObserver); });
    await act(async () => {
      Object.defineProperty(document, "hidden", { configurable: true, value: true });
      fireEvent(document, new Event("visibilitychange"));
    });
    await waitFor(() => expect(pause).toHaveBeenCalled());
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
  });
});

describe("preview settings cleanup", () => {
  it("keeps the scan dry and gates destructive cleanup behind confirmation", async () => {
    const requests: string[] = [];
    setApiTransportForTests(async (path) => {
      requests.push(path);
      if (path.endsWith("/health")) return { healthy: true, ffmpeg: { available: true, compatible: true }, ffprobe: { available: true, compatible: true }, vp9Encoder: { available: true, compatible: true } };
      if (path.includes("dryRun=true")) return { count: 2, blobIds: ["a", "b"], deletedBlobCount: 0, failedBlobIds: [], snapshotVersion: "snapshot-1" };
      if (path.includes("dryRun=false")) return { count: 2, blobIds: ["a", "b"], deletedBlobCount: 2, failedBlobIds: [] };
      return {};
    });
    render(<AnimatedPreviewSettings />);
    await userEvent.click(await screen.findByRole("button", { name: "Find orphaned previews" }));
    expect(await screen.findByText("2 orphaned preview blobs found.")).toBeInTheDocument();
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("b")).toBeInTheDocument();
    expect(requests.filter((path) => path.includes("cleanup/orphans"))).toEqual([expect.stringContaining("dryRun=true")]);

    const confirm = vi.spyOn(window, "confirm").mockReturnValueOnce(false).mockReturnValueOnce(true);
    await userEvent.click(screen.getByRole("button", { name: "Delete orphaned previews" }));
    expect(requests.some((path) => path.includes("dryRun=false"))).toBe(false);
    await userEvent.click(screen.getByRole("button", { name: "Delete orphaned previews" }));
    await waitFor(() => expect(requests.some((path) => path.includes("dryRun=false"))).toBe(true));
    expect(requests.find((path) => path.includes("dryRun=false"))).toContain("expectedVersion=snapshot-1");
    expect(confirm).toHaveBeenCalledTimes(2);
    expect(await screen.findByText("Deleted 2 orphaned preview blobs.")).toBeInTheDocument();
    expect(screen.queryByText(/orphaned preview blobs found/)).not.toBeInTheDocument();
  });
});

describe("preview index cache", () => {
  it("deduplicates settled reads and refetches only the invalidated index", async () => {
    let indexReads = 0;
    let settingsReads = 0;
    setApiTransportForTests(async (path) => {
      if (path.endsWith("/tags")) { indexReads += 1; return { version: String(indexReads), items: [] }; }
      if (path.endsWith("/settings")) { settingsReads += 1; return {}; }
      return {};
    });
    await loadPreviewCache();
    await loadPreviewCache();
    expect(indexReads).toBe(1);
    expect(settingsReads).toBe(1);
    await invalidatePreviewIndex();
    expect(indexReads).toBe(2);
    expect(settingsReads).toBe(1);
  });

  it("refreshes the index when another tab broadcasts an invalidation", async () => {
    let indexReads = 0;
    const channels: FakeBroadcastChannel[] = [];
    class FakeBroadcastChannel {
      listeners: Array<() => void> = [];
      posts: unknown[] = [];
      constructor(_name: string) { channels.push(this); }
      addEventListener(_type: string, listener: () => void) { this.listeners.push(listener); }
      postMessage(message: unknown) { this.posts.push(message); }
      close() {}
      receive() { this.listeners.forEach((listener) => listener()); }
    }
    vi.stubGlobal("BroadcastChannel", FakeBroadcastChannel);
    setApiTransportForTests(async (path) => {
      if (path.endsWith("/tags")) { indexReads += 1; return { version: String(indexReads), items: [] }; }
      if (path.endsWith("/settings")) return {};
      return {};
    });

    try {
      await loadPreviewCache();
      channels[0].receive();
      await waitFor(() => expect(indexReads).toBe(2));
      expect(channels[0].posts).toEqual([]);
    } finally {
      __resetPreviewCacheForTests();
      vi.unstubAllGlobals();
    }
  });

  it("does not let a pre-invalidation index request repopulate the cache", async () => {
    let resolveStale!: (value: { version: string; items: never[] }) => void;
    let resolveFresh!: (value: { version: string; items: never[] }) => void;
    const stale = new Promise<{ version: string; items: never[] }>((resolve) => { resolveStale = resolve; });
    const fresh = new Promise<{ version: string; items: never[] }>((resolve) => { resolveFresh = resolve; });
    let indexReads = 0;
    setApiTransportForTests(async (path) => {
      if (path.endsWith("/tags")) return ++indexReads === 1 ? stale : fresh;
      if (path.endsWith("/settings")) return {};
      return {};
    });

    const initialLoad = loadPreviewCache();
    const refresh = invalidatePreviewIndex();
    resolveStale({ version: "stale", items: [] });
    resolveFresh({ version: "fresh", items: [] });
    await Promise.all([initialLoad, refresh]);

    expect(indexReads).toBe(2);
    expect(getPreviewCacheSnapshot().index?.version).toBe("fresh");
  });
});
