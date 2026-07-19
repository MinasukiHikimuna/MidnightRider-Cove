import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StrictMode } from "react";
import type { MediaPlayerExtensionContext } from "@cove/runtime/components";
import { AnimatedPreviewPlayerAction, AnimatedPreviewPlayerOverlay } from "../editor";
import { AnimatedTagMedia } from "../media";
import { AnimatedPreviewSettings } from "../settings";
import { AnimatedTagCoverEditor } from "../coverEditor";
import { ApiError, __resetApiForTests, setApiTransportForTests } from "../api";
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

function selectTag(id = 77) {
  const selector = screen.getByRole("combobox", { name: "Tag ID" });
  fireEvent.change(selector, { target: { value: id === 88 ? "replacement" : "first" } });
  fireEvent.keyDown(selector, { key: "ArrowDown" });
  fireEvent.keyDown(selector, { key: "Enter" });
  return selector;
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
    selectTag();
    await userEvent.click(screen.getByRole("button", { name: /generate preview/i }));
    await waitFor(() => expect(requests.some((request) => request.path.endsWith("/generate"))).toBe(true));
    const generate = requests.find((request) => request.path.endsWith("/generate"))!;
    expect(generate.path).toContain("/videos/12/tags/77/generate");
    expect(JSON.parse(String(generate.init?.body))).toEqual({ sourceFileId: 91, startSeconds: 42.5, durationSeconds: 5, playbackSpeed: 0.5, anchorX: 0.5, anchorY: 0.5, zoom: 1 });
  });

  it("keeps the single tag combobox focused and mounted while replacing or clearing its selection", async () => {
    const ctx = context();
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    await userEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    const selector = screen.getByRole("combobox", { name: "Tag ID" });
    selector.focus();

    selectTag();
    expect(screen.getByRole("combobox", { name: "Tag ID" })).toBe(selector);
    expect(selector).toHaveFocus();
    expect(selector).toHaveAttribute("data-selected-display", "input");
    expect(selector).toHaveValue("Tag 77");

    fireEvent.change(selector, { target: { value: "replacement" } });
    expect(selector).toHaveFocus();
    expect(selector).toHaveValue("replacement");
    expect(screen.getByRole("option", { name: "Tag 88" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear selected tag" })).toBeInTheDocument();

    fireEvent.keyDown(selector, { key: "ArrowDown" });
    fireEvent.keyDown(selector, { key: "Enter" });
    expect(screen.getByRole("combobox", { name: "Tag ID" })).toBe(selector);
    expect(selector).toHaveFocus();
    expect(selector).toHaveValue("Tag 88");

    const clear = screen.getByRole("button", { name: "Clear selected tag" });
    clear.focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("combobox", { name: "Tag ID" })).toBe(selector);
    expect(selector).toHaveFocus();
    expect(selector).toHaveValue("");
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

  it("places the primary generate action immediately below advanced settings", async () => {
    const ctx = context({ playbackRate: 1.5 });
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    await userEvent.click(screen.getByRole("button", { name: /animated preview/i }));

    const options = screen.getByText("Advanced settings").closest("details")!;
    expect(options).not.toHaveAttribute("open");
    const generate = screen.getByRole("button", { name: "Generate preview" });
    expect(options.nextElementSibling).toBe(generate);
    expect(generate).toHaveClass("atp-button", "atp-primary");
    await userEvent.click(screen.getByText("Advanced settings"));
    expect(options).toHaveAttribute("open");
    expect(screen.getByRole("spinbutton", { name: "Duration (seconds)" })).toBeInTheDocument();
    const speed = screen.getByRole("slider", { name: "Preview speed" });
    fireEvent.change(speed, { target: { value: "0.5" } });
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

  it("updates decoded crop previews only after a pointer drag finishes", async () => {
    setApiTransportForTests(async (path) => {
      if (path.endsWith("/health")) return healthyDependencies;
      if (path.endsWith("/videos/12/source")) return { fileId: 91 };
      return {};
    });
    const drawImage = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({ drawImage } as unknown as CanvasRenderingContext2D);
    const view = render(<><AnimatedPreviewPlayerAction {...context()} /><AnimatedPreviewPlayerOverlay {...context()} /></>);
    await userEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    await waitFor(() => expect(view.container.querySelectorAll(".atp-thumbnails video")).toHaveLength(2));
    for (const video of view.container.querySelectorAll(".atp-thumbnails video")) {
      Object.defineProperties(video, {
        duration: { configurable: true, value: 100 },
        readyState: { configurable: true, value: HTMLMediaElement.HAVE_CURRENT_DATA },
        videoWidth: { configurable: true, value: 1920 },
        videoHeight: { configurable: true, value: 1080 },
      });
      fireEvent.loadedData(video);
      fireEvent.seeked(video);
    }
    drawImage.mockClear();

    const cropEditor = screen.getByRole("application", { name: /crop/i });
    Object.defineProperty(cropEditor, "setPointerCapture", { configurable: true, value: vi.fn() });
    fireEvent.pointerDown(cropEditor, { pointerId: 1, clientX: 400, clientY: 200 });
    fireEvent.pointerMove(cropEditor, { pointerId: 1, clientX: 420, clientY: 200 });

    expect(drawImage).not.toHaveBeenCalled();

    fireEvent.pointerUp(cropEditor, { pointerId: 1, clientX: 420, clientY: 200 });
    expect(drawImage.mock.calls.filter(([source]) => source instanceof HTMLVideoElement)).toHaveLength(2);

    drawImage.mockClear();
    fireEvent.pointerDown(cropEditor, { pointerId: 2, clientX: 420, clientY: 200 });
    fireEvent.pointerMove(cropEditor, { pointerId: 2, clientX: 440, clientY: 200 });
    expect(drawImage).not.toHaveBeenCalled();

    fireEvent.pointerCancel(cropEditor, { pointerId: 2, clientX: 440, clientY: 200 });
    expect(drawImage.mock.calls.filter(([source]) => source instanceof HTMLVideoElement)).toHaveLength(2);
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

  it("pauses the host and replaces the crop editor with the generated candidate review", async () => {
    vi.useFakeTimers();
    setApiTransportForTests(async (path) => {
      if (path.endsWith("/health")) return healthyDependencies;
      if (path.endsWith("/generate")) return { jobId: "job-1" };
      if (path.includes("/jobs/job-1")) return { status: "completed", progress: 1, candidateId: "candidate-1" };
      return {};
    });
    const ctx = context();
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    fireEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    await act(async () => { await Promise.resolve(); });
    selectTag();
    fireEvent.click(screen.getByRole("button", { name: /generate preview/i }));
    await act(async () => { await Promise.resolve(); });
    await act(async () => { vi.advanceTimersByTime(750); await Promise.resolve(); });

    expect(ctx.pause).toHaveBeenCalled();
    expect(screen.queryByRole("application", { name: /crop/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("combobox", { name: "Tag ID" })).not.toBeInTheDocument();
    expect(screen.getByText("Tag 77")).toBeInTheDocument();
    const candidate = screen.getByLabelText("Generated preview for Tag 77");
    expect(candidate).toHaveAttribute("src", "/api/extensions/animated-tag-previews/videos/12/tags/77/candidates/candidate-1/media");
    expect(candidate).toHaveAttribute("autoplay");
    expect(candidate).toHaveAttribute("loop");
    expect(candidate).toHaveAttribute("playsinline");
    expect(candidate).toHaveProperty("muted", true);
    expect(screen.getByRole("region", { name: "Generated preview ready for Tag 77" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Approve" })).toHaveFocus();
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete preview" })).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it("waits for a starting generation request, cancels its job, and only then closes", async () => {
    let resolveGenerate!: (value: { jobId: string }) => void;
    const generate = new Promise<{ jobId: string }>((resolve) => { resolveGenerate = resolve; });
    const requests: Array<{ path: string; init?: RequestInit }> = [];
    setApiTransportForTests(async (path, init) => {
      if (path.endsWith("/health")) return healthyDependencies;
      if (path.endsWith("/videos/12/source")) return { fileId: 91 };
      requests.push({ path, init });
      if (path.endsWith("/generate")) return generate;
      if (path.includes("/jobs/job-1") && init?.method === "DELETE") return { jobId: "job-1", cancelled: true };
      return {};
    });
    const ctx = context();
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    fireEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    await act(async () => { await Promise.resolve(); });
    selectTag();
    fireEvent.click(screen.getByRole("button", { name: /generate preview/i }));

    fireEvent.click(screen.getByRole("button", { name: "Close preview editor" }));
    expect(screen.getByRole("dialog", { name: /animated tag preview editor/i })).toBeInTheDocument();
    expect(screen.getByText(/waiting for generation to start/i)).toBeInTheDocument();
    expect(requests.some(({ path, init }) => path.includes("/jobs/job-1") && init?.method === "DELETE")).toBe(false);

    await act(async () => { resolveGenerate({ jobId: "job-1" }); await Promise.resolve(); await Promise.resolve(); });

    expect(requests.some(({ path, init }) => path.includes("/jobs/job-1") && init?.method === "DELETE")).toBe(true);
    expect(screen.queryByRole("dialog", { name: /animated tag preview editor/i })).not.toBeInTheDocument();
  });

  it("keeps polling after cancellation loses the commit race, then discards and closes", async () => {
    vi.useFakeTimers();
    const requests: Array<{ path: string; init?: RequestInit }> = [];
    setApiTransportForTests(async (path, init) => {
      if (path.endsWith("/health")) return healthyDependencies;
      if (path.endsWith("/generate")) return { jobId: "job-1" };
      requests.push({ path, init });
      if (path.includes("/jobs/job-1") && init?.method === "DELETE") return { jobId: "job-1", cancelled: false };
      if (path.includes("/jobs/job-1")) return { status: "completed", progress: 1, candidateId: "candidate-1" };
      if (path.endsWith("/candidates/candidate-1") && init?.method === "DELETE") return { candidateId: "candidate-1", videoId: 12, tagId: 77, discarded: true, blobDeleted: true, blobRetained: false };
      return {};
    });
    const ctx = context();
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    fireEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    await act(async () => { await Promise.resolve(); });
    selectTag();
    fireEvent.click(screen.getByRole("button", { name: /generate preview/i }));
    await act(async () => { await Promise.resolve(); });

    fireEvent.click(screen.getByRole("button", { name: "Close preview editor" }));
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByText(/will be discarded before closing/i)).toBeInTheDocument();
    await act(async () => { vi.advanceTimersByTime(750); await Promise.resolve(); await Promise.resolve(); });

    expect(requests.some(({ path, init }) => path.endsWith("/candidates/candidate-1") && init?.method === "DELETE")).toBe(true);
    expect(screen.queryByRole("dialog", { name: /animated tag preview editor/i })).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it("discards the candidate and restores the exact editor state and loop on Reset", async () => {
    vi.useFakeTimers();
    const requests: Array<{ path: string; init?: RequestInit }> = [];
    setApiTransportForTests(async (path, init) => {
      if (path.endsWith("/health")) return healthyDependencies;
      if (path.endsWith("/videos/12/source")) return { fileId: 91 };
      if (path.endsWith("/generate")) return { jobId: "job-1" };
      if (path.includes("/jobs/job-1")) return { status: "completed", progress: 1, candidateId: "candidate-1" };
      requests.push({ path, init });
      if (init?.method === "DELETE") return { candidateId: "candidate-1", videoId: 12, tagId: 77, discarded: true, blobDeleted: true, blobRetained: false };
      return {};
    });
    const ctx = context();
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    fireEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    await act(async () => { await Promise.resolve(); });
    selectTag();
    fireEvent.click(screen.getByRole("button", { name: "+0.1s" }));
    fireEvent.click(screen.getByText("Advanced settings"));
    fireEvent.change(screen.getByRole("spinbutton", { name: "Duration (seconds)" }), { target: { value: "4.25" } });
    fireEvent.change(screen.getByRole("slider", { name: "Preview speed" }), { target: { value: "0.5" } });
    fireEvent.click(screen.getByRole("button", { name: /generate preview/i }));
    await act(async () => { await Promise.resolve(); });
    await act(async () => { vi.advanceTimersByTime(750); await Promise.resolve(); });

    vi.mocked(ctx.seek).mockClear();
    vi.mocked(ctx.play).mockClear();
    vi.mocked(ctx.setPlaybackRate!).mockClear();
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    await act(async () => { await Promise.resolve(); });

    expect(requests).toContainEqual(expect.objectContaining({
      path: "/extensions/animated-tag-previews/videos/12/tags/77/candidates/candidate-1",
      init: expect.objectContaining({ method: "DELETE" }),
    }));
    expect(screen.getByRole("application", { name: /4:3 crop/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Tag ID" })).toHaveValue("Tag 77");
    expect(screen.getByRole("textbox", { name: "Start time (HH:MM:SS)" })).toHaveValue("00:00:42.6");
    expect(screen.getByText("Advanced settings").closest("details")).toHaveAttribute("open");
    expect(screen.getByRole("spinbutton", { name: "Duration (seconds)" })).toHaveValue(4.25);
    expect(screen.getByRole("slider", { name: "Preview speed" })).toHaveValue("0.5");
    expect(ctx.setPlaybackRate).toHaveBeenCalledWith(0.5);
    expect(ctx.seek).toHaveBeenCalledWith(42.6);
    expect(ctx.play).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("publishes only on Approve, refreshes the index, and closes the editor", async () => {
    vi.useFakeTimers();
    const requests: Array<{ path: string; init?: RequestInit }> = [];
    let indexReads = 0;
    setApiTransportForTests(async (path, init) => {
      requests.push({ path, init });
      if (path.endsWith("/health")) return healthyDependencies;
      if (path.endsWith("/tags")) { indexReads += 1; return { version: String(indexReads), items: [] }; }
      if (path.endsWith("/generate")) return { jobId: "job-1" };
      if (path.includes("/jobs/job-1")) return { status: "completed", progress: 1, candidateId: "candidate-1" };
      if (path.endsWith("/candidates/candidate-1/approve")) return { candidateId: "candidate-1", videoId: 12, tagId: 77, version: "candidate-1", replacedExisting: false, alreadyApproved: false };
      return {};
    });
    const ctx = context({ playing: true });
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    fireEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    await act(async () => { await Promise.resolve(); });
    selectTag();
    fireEvent.click(screen.getByRole("button", { name: /generate preview/i }));
    await act(async () => { await Promise.resolve(); });
    await act(async () => { vi.advanceTimersByTime(750); await Promise.resolve(); });
    vi.mocked(ctx.play).mockClear();
    const readsBeforeApproval = indexReads;

    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });

    expect(requests).toContainEqual(expect.objectContaining({
      path: "/extensions/animated-tag-previews/videos/12/tags/77/candidates/candidate-1/approve",
      init: expect.objectContaining({ method: "POST" }),
    }));
    expect(indexReads).toBe(readsBeforeApproval + 1);
    expect(screen.queryByRole("dialog", { name: /animated tag preview editor/i })).not.toBeInTheDocument();
    expect(requests.some(({ path, init }) => path.endsWith("/candidates/candidate-1") && init?.method === "DELETE")).toBe(false);
    expect(ctx.play).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("keeps the candidate review open when approval fails", async () => {
    vi.useFakeTimers();
    setApiTransportForTests(async (path) => {
      if (path.endsWith("/health")) return healthyDependencies;
      if (path.endsWith("/generate")) return { jobId: "job-1" };
      if (path.includes("/jobs/job-1")) return { status: "completed", progress: 1, candidateId: "candidate-1" };
      if (path.endsWith("/approve")) throw new Error("Approval failed");
      return {};
    });
    const ctx = context();
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    fireEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    await act(async () => { await Promise.resolve(); });
    selectTag();
    fireEvent.click(screen.getByRole("button", { name: /generate preview/i }));
    await act(async () => { await Promise.resolve(); });
    await act(async () => { vi.advanceTimersByTime(750); await Promise.resolve(); });

    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    await act(async () => { await Promise.resolve(); });

    expect(screen.getByLabelText("Generated preview for Tag 77")).toBeInTheDocument();
    expect(screen.getByText("Approval failed")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("closes an approved review even when its best-effort index refresh fails", async () => {
    vi.useFakeTimers();
    const requests: Array<{ path: string; init?: RequestInit }> = [];
    let indexReads = 0;
    setApiTransportForTests(async (path, init) => {
      requests.push({ path, init });
      if (path.endsWith("/health")) return healthyDependencies;
      if (path.endsWith("/tags")) {
        indexReads += 1;
        if (indexReads > 1) throw new Error("Refresh failed");
        return { version: "1", items: [] };
      }
      if (path.endsWith("/generate")) return { jobId: "job-1" };
      if (path.includes("/jobs/job-1")) return { status: "completed", progress: 1, candidateId: "candidate-1" };
      if (path.endsWith("/approve")) return { candidateId: "candidate-1", videoId: 12, tagId: 77, version: "candidate-1", replacedExisting: false, alreadyApproved: false };
      return {};
    });
    const ctx = context();
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    fireEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    await act(async () => { await Promise.resolve(); });
    selectTag();
    fireEvent.click(screen.getByRole("button", { name: /generate preview/i }));
    await act(async () => { await Promise.resolve(); });
    await act(async () => { vi.advanceTimersByTime(750); await Promise.resolve(); });
    vi.mocked(ctx.play).mockClear();

    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });

    expect(screen.queryByRole("dialog", { name: /animated tag preview editor/i })).not.toBeInTheDocument();
    expect(requests.some(({ path, init }) => path.endsWith("/candidates/candidate-1") && init?.method === "DELETE")).toBe(false);
    vi.useRealTimers();
  });

  it("discards before closing review and keeps it open if discard fails", async () => {
    vi.useFakeTimers();
    let discardAttempts = 0;
    const requests: Array<{ path: string; init?: RequestInit }> = [];
    setApiTransportForTests(async (path, init) => {
      if (path.endsWith("/health")) return healthyDependencies;
      if (path.endsWith("/generate")) return { jobId: "job-1" };
      if (path.includes("/jobs/job-1")) return { status: "completed", progress: 1, candidateId: "candidate-1" };
      if (init?.method === "DELETE") {
        requests.push({ path, init });
        discardAttempts += 1;
        if (discardAttempts === 1) throw new Error("Discard failed");
        throw new ApiError(404, "Not Found", path);
      }
      return {};
    });
    const ctx = context({ playing: true });
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    fireEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    await act(async () => { await Promise.resolve(); });
    selectTag();
    fireEvent.click(screen.getByRole("button", { name: /generate preview/i }));
    await act(async () => { await Promise.resolve(); });
    await act(async () => { vi.advanceTimersByTime(750); await Promise.resolve(); });
    vi.mocked(ctx.play).mockClear();

    fireEvent.keyDown(document, { key: "Escape" });
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByRole("dialog", { name: /animated tag preview editor/i })).toBeInTheDocument();
    expect(screen.getByText("Discard failed")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close preview editor" }));
    await act(async () => { await Promise.resolve(); });
    expect(requests).toHaveLength(2);
    expect(screen.queryByRole("dialog", { name: /animated tag preview editor/i })).not.toBeInTheDocument();
    expect(ctx.play).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("does not let a stale approval close a newly opened editor for the same video", async () => {
    vi.useFakeTimers();
    let resolveApproval!: (value: object) => void;
    const approval = new Promise<object>((resolve) => { resolveApproval = resolve; });
    setApiTransportForTests(async (path) => {
      if (path.endsWith("/health")) return healthyDependencies;
      if (path.endsWith("/generate")) return { jobId: "job-1" };
      if (path.includes("/jobs/job-1")) return { status: "completed", progress: 1, candidateId: "candidate-1" };
      if (path.endsWith("/approve")) return approval;
      return {};
    });
    const ctx = context();
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    fireEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    await act(async () => { await Promise.resolve(); });
    selectTag();
    fireEvent.click(screen.getByRole("button", { name: /generate preview/i }));
    await act(async () => { await Promise.resolve(); });
    await act(async () => { vi.advanceTimersByTime(750); await Promise.resolve(); });
    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    await act(async () => { await Promise.resolve(); });

    fireEvent.click(screen.getByRole("button", { name: "Animated preview" }));
    expect(screen.getByRole("dialog", { name: /animated tag preview editor/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Tag ID" })).toBeInTheDocument();

    await act(async () => { resolveApproval({}); await Promise.resolve(); await Promise.resolve(); });

    expect(screen.getByRole("dialog", { name: /animated tag preview editor/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Tag ID" })).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("detaches cleanup when a stale generation cannot be cancelled", async () => {
    vi.useFakeTimers();
    let resolveGenerate!: (value: { jobId: string }) => void;
    const generation = new Promise<{ jobId: string }>((resolve) => { resolveGenerate = resolve; });
    const requests: Array<{ path: string; init?: RequestInit }> = [];
    setApiTransportForTests(async (path, init) => {
      if (path.endsWith("/health")) return healthyDependencies;
      requests.push({ path, init });
      if (path.endsWith("/generate")) return generation;
      if (path.includes("/jobs/job-stale") && init?.method === "DELETE") return { jobId: "job-stale", cancelled: false };
      if (path.includes("/jobs/job-stale")) return { status: "completed", progress: 1, candidateId: "candidate-stale" };
      if (path.endsWith("/candidates/candidate-stale") && init?.method === "DELETE") return { candidateId: "candidate-stale", videoId: 12, tagId: 77, discarded: true, blobDeleted: true, blobRetained: false };
      return {};
    });
    const ctx = context();
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    fireEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    await act(async () => { await Promise.resolve(); });
    selectTag();
    fireEvent.click(screen.getByRole("button", { name: /generate preview/i }));

    fireEvent.click(screen.getByRole("button", { name: "Animated preview" }));
    expect(screen.getByRole("combobox", { name: "Tag ID" })).toBeInTheDocument();
    await act(async () => { resolveGenerate({ jobId: "job-stale" }); await Promise.resolve(); await Promise.resolve(); });
    await act(async () => { vi.advanceTimersByTime(750); await Promise.resolve(); await Promise.resolve(); });

    expect(requests.some(({ path, init }) => path.includes("/jobs/job-stale") && init?.method === "DELETE")).toBe(true);
    expect(requests.some(({ path, init }) => path.endsWith("/candidates/candidate-stale") && init?.method === "DELETE")).toBe(true);
    expect(screen.getByRole("dialog", { name: /animated tag preview editor/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Tag ID" })).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("keeps generation attached through the StrictMode effect lifecycle", async () => {
    vi.useFakeTimers();
    let cancelRequests = 0;
    let jobReads = 0;
    setApiTransportForTests(async (path, init) => {
      if (path.endsWith("/health")) return healthyDependencies;
      if (path.endsWith("/generate")) return { jobId: "job-strict" };
      if (path.includes("/jobs/job-strict") && init?.method === "DELETE") {
        cancelRequests += 1;
        return { jobId: "job-strict", cancelled: true };
      }
      if (path.includes("/jobs/job-strict")) {
        jobReads += 1;
        return { status: "running", progress: 0.5 };
      }
      return {};
    });
    const ctx = context();
    render(<StrictMode><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></StrictMode>);
    fireEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    await act(async () => { await Promise.resolve(); });
    selectTag();
    fireEvent.click(screen.getByRole("button", { name: /generate preview/i }));
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });

    expect(cancelRequests).toBe(0);
    await act(async () => { vi.advanceTimersByTime(750); await Promise.resolve(); });
    expect(jobReads).toBe(1);
    expect(screen.getByRole("dialog", { name: /animated tag preview editor/i })).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("returns to a retryable editor when a completed job omits its candidate", async () => {
    vi.useFakeTimers();
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
    selectTag();
    fireEvent.click(screen.getByRole("button", { name: /generate preview/i }));
    await act(async () => { await Promise.resolve(); });
    vi.mocked(ctx.play).mockClear();
    vi.mocked(ctx.seek).mockClear();
    vi.mocked(ctx.setPlaybackRate!).mockClear();
    await act(async () => { vi.advanceTimersByTime(750); await Promise.resolve(); });

    expect(ctx.pause).toHaveBeenCalled();
    expect(screen.getByText(/completed without a preview candidate/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try generation again" })).toBeEnabled();
    expect(screen.queryByLabelText(/Generated preview/)).not.toBeInTheDocument();
    expect(ctx.setPlaybackRate).toHaveBeenCalledWith(1);
    expect(ctx.seek).toHaveBeenCalledWith(42.5);
    expect(ctx.play).toHaveBeenCalled();
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
          : { status: "completed", progress: 1, candidateId: "candidate-1" };
      }
      return {};
    });
    const ctx = context();
    render(<><AnimatedPreviewPlayerAction {...ctx} /><AnimatedPreviewPlayerOverlay {...ctx} /></>);
    fireEvent.click(screen.getByRole("button", { name: /animated preview/i }));
    await act(async () => { await Promise.resolve(); });
    selectTag();
    fireEvent.click(screen.getByRole("button", { name: /generate preview/i }));
    await act(async () => { await Promise.resolve(); });

    for (let poll = 0; poll < 3; poll += 1) {
      await act(async () => { vi.advanceTimersByTime(750); await Promise.resolve(); });
    }

    expect(statusReads).toBe(3);
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument();
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
    selectTag();

    await userEvent.click(screen.getByRole("button", { name: "Delete preview" }));

    await waitFor(() => expect(requests.some((request) => request.path.endsWith("/tags/77/media") && request.init?.method === "DELETE")).toBe(true));
    await waitFor(() => expect(screen.queryByRole("button", { name: "Delete preview" })).not.toBeInTheDocument());
  });
});

describe("animated tag media", () => {
  it("replaces native media on the core tag hover surface", async () => {
    setApiTransportForTests(async (path) => path.endsWith("/settings")
      ? { aspectRatio: "1:1" }
      : { version: "a", items: [{ tagId: 7, version: "v1" }] });
    render(<AnimatedTagMedia entityType="tag" entityId={7} surface="hover" imageUrl="poster.jpg" alt="Tag" fit="cover" renderDefault={() => <img alt="static" />} />);
    const video = await screen.findByLabelText("Animated preview for Tag");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("data-entity-media-aspect-ratio", "1:1");
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

describe("animated tag cover editor", () => {
  it("renders only for tag cover contexts", () => {
    render(<AnimatedTagCoverEditor entityType="performer" entityId={7} coverKey="primary" currentImageUrl="poster.jpg" canEdit />);
    expect(screen.queryByRole("region", { name: "Animated preview" })).not.toBeInTheDocument();
  });

  it("uploads a multipart WebM and immediately refreshes the published preview", async () => {
    const requests: Array<{ path: string; init?: RequestInit }> = [];
    let uploaded = false;
    setApiTransportForTests(async (path, init) => {
      requests.push({ path, init });
      if (path.endsWith("/tags/7/media") && init?.method === "POST") {
        uploaded = true;
        return { tagId: 7, version: "uploaded-v1", replacedExisting: false };
      }
      if (path.endsWith("/settings")) return {};
      if (path.endsWith("/tags")) return { version: uploaded ? "2" : "1", items: uploaded ? [{ tagId: 7, version: "uploaded-v1" }] : [] };
      return {};
    });
    render(<AnimatedTagCoverEditor entityType="tag" entityId={7} coverKey="primary" currentImageUrl="poster.jpg" canEdit />);

    const file = new File([new Uint8Array([1, 2, 3])], "custom.webm", { type: "video/webm" });
    await userEvent.upload(screen.getByLabelText("Animated preview").querySelector('input[type="file"]') as HTMLInputElement, file);

    await waitFor(() => expect(screen.getByLabelText("Current animated preview")).toBeInTheDocument());
    const upload = requests.find((request) => request.path.endsWith("/tags/7/media") && request.init?.method === "POST");
    expect(upload?.init?.body).toBeInstanceOf(FormData);
    expect(upload?.init?.headers).toBeUndefined();
  });

  it("does not present the static cover as an animated preview when none exists", async () => {
    setApiTransportForTests(async (path) => path.endsWith("/tags") ? { version: "1", items: [] } : {});

    render(<AnimatedTagCoverEditor entityType="tag" entityId={7} coverKey="primary" currentImageUrl="poster.jpg" canEdit />);

    expect(await screen.findByText("Drop a custom WebM here")).toBeInTheDocument();
    expect(screen.queryByAltText("Static tag cover")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Current animated preview")).not.toBeInTheDocument();
  });
});

describe("preview settings cleanup", () => {
  it("offers stale-published-preview-only metadata cleanup without blob deletion copy", async () => {
    const requests: string[] = [];
    setApiTransportForTests(async (path) => {
      requests.push(path);
      if (path.endsWith("/health")) return healthyDependencies;
      if (path.includes("dryRun=true")) return { count: 0, blobIds: [], stalePreviewRecordCount: 1, snapshotVersion: "preview-snapshot" };
      if (path.includes("dryRun=false")) return { count: 0, blobIds: [], deletedBlobCount: 0, failedBlobIds: [], stalePreviewRecordCount: 1 };
      return {};
    });
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<AnimatedPreviewSettings />);

    await userEvent.click(await screen.findByRole("button", { name: "Find orphaned previews" }));
    expect(await screen.findByText("1 stale published preview record found.")).toBeInTheDocument();
    expect(screen.queryByText(/blob.*found/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Remove stale published preview records" }));

    await waitFor(() => expect(requests.some((path) => path.includes("dryRun=false"))).toBe(true));
    expect(requests.find((path) => path.includes("dryRun=false"))).toContain("expectedVersion=preview-snapshot");
    expect(confirm).toHaveBeenCalledWith("Remove 1 stale published preview record?");
    expect(await screen.findByText("Removed 1 stale published preview record.")).toBeInTheDocument();
  });

  it("offers candidate-only cleanup without describing stale metadata as blobs", async () => {
    const requests: string[] = [];
    setApiTransportForTests(async (path) => {
      requests.push(path);
      if (path.endsWith("/health")) return healthyDependencies;
      if (path.includes("dryRun=true")) return { count: 0, blobIds: [], stalePreviewCandidateCount: 1, snapshotVersion: "candidate-snapshot" };
      if (path.includes("dryRun=false")) return { count: 0, blobIds: [], deletedBlobCount: 0, failedBlobIds: [], stalePreviewCandidateCount: 1 };
      return {};
    });
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<AnimatedPreviewSettings />);

    await userEvent.click(await screen.findByRole("button", { name: "Find orphaned previews" }));
    expect(await screen.findByText("1 stale preview candidate record found.")).toBeInTheDocument();
    expect(screen.queryByText(/blob.*found/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Remove stale preview candidate records" }));

    await waitFor(() => expect(requests.some((path) => path.includes("dryRun=false"))).toBe(true));
    expect(requests.find((path) => path.includes("dryRun=false"))).toContain("expectedVersion=candidate-snapshot");
    expect(confirm).toHaveBeenCalledWith("Remove 1 stale preview candidate record?");
    expect(await screen.findByText("Removed 1 stale preview candidate record.")).toBeInTheDocument();
  });

  it("describes mixed blob and metadata cleanup separately", async () => {
    setApiTransportForTests(async (path) => {
      if (path.endsWith("/health")) return healthyDependencies;
      if (path.includes("dryRun=true")) return { count: 1, blobIds: ["orphan"], stalePreviewRecordCount: 1, stalePreviewCandidateCount: 1, expiredApprovalReceiptCount: 1, snapshotVersion: "mixed" };
      if (path.includes("dryRun=false")) return { count: 1, blobIds: ["orphan"], deletedBlobCount: 1, failedBlobIds: [], stalePreviewRecordCount: 1, stalePreviewCandidateCount: 1, expiredApprovalReceiptCount: 1 };
      return {};
    });
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<AnimatedPreviewSettings />);

    await userEvent.click(await screen.findByRole("button", { name: "Find orphaned previews" }));
    expect(await screen.findByText("1 orphaned preview blob found.")).toBeInTheDocument();
    expect(screen.getByText("1 stale published preview record found.")).toBeInTheDocument();
    expect(screen.getByText("1 stale preview candidate record found.")).toBeInTheDocument();
    expect(screen.getByText("1 expired preview approval record found.")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Clean up preview data" }));

    expect(await screen.findByText("Deleted 1 orphaned preview blob. Removed 1 stale published preview record. Removed 1 stale preview candidate record. Removed 1 expired preview approval record.")).toBeInTheDocument();
  });

  it("offers receipt-only cleanup without describing approval metadata as blobs", async () => {
    const requests: string[] = [];
    setApiTransportForTests(async (path) => {
      requests.push(path);
      if (path.endsWith("/health")) return healthyDependencies;
      if (path.includes("dryRun=true")) return { count: 0, blobIds: [], expiredApprovalReceiptCount: 1, snapshotVersion: "receipt-snapshot" };
      if (path.includes("dryRun=false")) return { count: 0, blobIds: [], deletedBlobCount: 0, failedBlobIds: [], expiredApprovalReceiptCount: 1 };
      return {};
    });
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<AnimatedPreviewSettings />);

    await userEvent.click(await screen.findByRole("button", { name: "Find orphaned previews" }));
    expect(await screen.findByText("1 expired preview approval record found.")).toBeInTheDocument();
    expect(screen.queryByText(/blob.*found/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Remove expired approval records" }));

    await waitFor(() => expect(requests.some((path) => path.includes("dryRun=false"))).toBe(true));
    expect(requests.find((path) => path.includes("dryRun=false"))).toContain("expectedVersion=receipt-snapshot");
    expect(confirm).toHaveBeenCalledWith("Remove 1 expired preview approval record?");
    expect(await screen.findByText("Removed 1 expired preview approval record.")).toBeInTheDocument();
  });

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
