import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DecodedFramePreview } from "../framePreview";

const crop = { anchorX: 0.5, anchorY: 0.5, zoom: 1 };
let encodedFrame: string;

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
  encodedFrame = "data:image/jpeg;base64,first";
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({ drawImage: vi.fn() } as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockImplementation(() => encodedFrame);
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

    expect(screen.getByRole("img", { name: "Preview frame" })).toHaveAttribute("src", "data:image/jpeg;base64,first");

    view.rerender(<DecodedFramePreview mediaUrl="/video.mp4" seconds={2} crop={crop} aspectRatio="16:9" alt="Preview frame" />);

    expect(screen.getByRole("img", { name: "Preview frame" })).toHaveAttribute("src", "data:image/jpeg;base64,first");
    expect(screen.getByRole("status", { name: "Updating Preview frame" })).toBeInTheDocument();

    encodedFrame = "data:image/jpeg;base64,second";
    fireEvent.seeked(video);
    expect(screen.getByRole("img", { name: "Preview frame" })).toHaveAttribute("src", "data:image/jpeg;base64,second");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
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

    encodedFrame = "data:image/jpeg;base64,current";
    act(() => callbacks[1](0, {} as VideoFrameCallbackMetadata));
    expect(screen.getByRole("img", { name: "Preview frame" })).toHaveAttribute("src", "data:image/jpeg;base64,current");
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

    view.rerender(<DecodedFramePreview mediaUrl="/video.mp4" seconds={2} crop={crop} aspectRatio="16:9" alt="Preview frame" />);
    vi.mocked(HTMLCanvasElement.prototype.toDataURL).mockImplementation(() => { throw new Error("encode failed"); });
    fireEvent.seeked(video);

    expect(screen.getByRole("img", { name: "Preview frame" })).toHaveAttribute("src", "data:image/jpeg;base64,first");
    expect(screen.getByRole("status", { name: "Could not update Preview frame" })).toBeInTheDocument();
  });
});
