import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DecodedFramePreview } from "../framePreview";

const crop = { anchorX: 0.5, anchorY: 0.5, zoom: 1 };

function prepareVideo(video: HTMLVideoElement) {
  Object.defineProperties(video, {
    duration: { configurable: true, value: 30 },
    videoWidth: { configurable: true, value: 1920 },
    videoHeight: { configurable: true, value: 1080 },
  });
}

function decodeFrame(video: HTMLVideoElement) {
  fireEvent.loadedData(video);
  fireEvent.seeked(video);
}

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({ drawImage: vi.fn() } as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL");
});

describe("decoded frame preview", () => {
  it("uses a loading placeholder instead of an image without a decoded source", () => {
    render(<DecodedFramePreview
      mediaUrl="/video.mp4"
      seconds={1}
      crop={crop}
      aspectRatio="16:9"
      alt="Preview frame"
    />);

    expect(screen.queryByRole("img", { name: "Preview frame" })).not.toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Loading Preview frame" })).toBeInTheDocument();
  });

  it("keeps the decoded frame visible until a seek replacement is ready", () => {
    const view = render(<DecodedFramePreview mediaUrl="/video.mp4" seconds={1} crop={crop} aspectRatio="16:9" alt="Preview frame" />);
    const video = view.container.querySelector("video")!;
    prepareVideo(video);
    decodeFrame(video);

    const preview = screen.getByRole("img", { name: "Preview frame" });
    expect(preview.tagName).toBe("CANVAS");

    view.rerender(<DecodedFramePreview mediaUrl="/video.mp4" seconds={2} crop={crop} aspectRatio="16:9" alt="Preview frame" />);

    expect(screen.getByRole("img", { name: "Preview frame" })).toBe(preview);
    expect(screen.getByRole("status", { name: "Updating Preview frame" })).toBeInTheDocument();

    fireEvent.seeked(video);
    expect(screen.getByRole("img", { name: "Preview frame" })).toBe(preview);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("draws decoded frames directly without encoding data URLs", () => {
    const view = render(<DecodedFramePreview mediaUrl="/video.mp4" seconds={1} crop={crop} aspectRatio="16:9" alt="Preview frame" />);
    const video = view.container.querySelector("video")!;
    prepareVideo(video);
    decodeFrame(video);

    expect(screen.getByRole("img", { name: "Preview frame" }).tagName).toBe("CANVAS");
    expect(HTMLCanvasElement.prototype.toDataURL).not.toHaveBeenCalled();
  });

  it("ignores a decoded-frame callback from an older seek", () => {
    const callbacks: VideoFrameRequestCallback[] = [];
    const view = render(<DecodedFramePreview mediaUrl="/video.mp4" seconds={1} crop={crop} aspectRatio="16:9" alt="Preview frame" />);
    const video = view.container.querySelector("video")!;
    prepareVideo(video);
    video.requestVideoFrameCallback = vi.fn((callback: VideoFrameRequestCallback) => {
      callbacks.push(callback);
      return callbacks.length;
    });
    video.cancelVideoFrameCallback = vi.fn();
    decodeFrame(video);

    view.rerender(<DecodedFramePreview mediaUrl="/video.mp4" seconds={2} crop={crop} aspectRatio="16:9" alt="Preview frame" />);
    fireEvent.seeked(video);
    expect(callbacks).toHaveLength(2);

    act(() => callbacks[0](0, {} as VideoFrameCallbackMetadata));
    expect(screen.queryByRole("img", { name: "Preview frame" })).not.toBeInTheDocument();

    act(() => callbacks[1](0, {} as VideoFrameCallbackMetadata));
    expect(screen.getByRole("img", { name: "Preview frame" }).tagName).toBe("CANVAS");
  });

  it("retargets an in-flight seek when only metadata remains ready", () => {
    const view = render(<DecodedFramePreview mediaUrl="/video.mp4" seconds={10} crop={crop} aspectRatio="16:9" alt="Preview frame" />);
    const video = view.container.querySelector("video")!;
    Object.defineProperties(video, {
      duration: { configurable: true, value: 30 },
      readyState: { configurable: true, value: HTMLMediaElement.HAVE_METADATA },
      seeking: { configurable: true, value: true },
    });
    video.currentTime = 10;

    view.rerender(<DecodedFramePreview mediaUrl="/video.mp4" seconds={9} crop={crop} aspectRatio="16:9" alt="Preview frame" />);
    expect(video.currentTime).toBe(9);

    view.rerender(<DecodedFramePreview mediaUrl="/video.mp4" seconds={8} crop={crop} aspectRatio="16:9" alt="Preview frame" />);
    expect(video.currentTime).toBe(8);
  });

  it("retains the last decoded frame when the replacement cannot be captured", () => {
    const view = render(<DecodedFramePreview mediaUrl="/video.mp4" seconds={1} crop={crop} aspectRatio="16:9" alt="Preview frame" />);
    const video = view.container.querySelector("video")!;
    prepareVideo(video);
    decodeFrame(video);
    const preview = screen.getByRole("img", { name: "Preview frame" });

    view.rerender(<DecodedFramePreview mediaUrl="/video.mp4" seconds={2} crop={crop} aspectRatio="16:9" alt="Preview frame" />);
    const visibleDraw = vi.fn(() => { throw new Error("visible canvas must not be cleared"); });
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockImplementation(function (this: HTMLCanvasElement) {
      return { drawImage: this === preview ? visibleDraw : () => { throw new Error("source draw failed"); } } as unknown as CanvasRenderingContext2D;
    });
    fireEvent.seeked(video);

    expect(screen.getByRole("img", { name: "Preview frame" })).toBe(preview);
    expect(visibleDraw).not.toHaveBeenCalled();
    expect(screen.getByRole("status", { name: "Could not update Preview frame" })).toBeInTheDocument();
  });
});
