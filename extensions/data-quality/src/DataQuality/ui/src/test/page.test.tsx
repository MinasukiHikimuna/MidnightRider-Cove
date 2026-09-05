import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DataQualityPage } from "../index";
import { testVideoControls } from "@cove/runtime/components";

const { api, review } = vi.hoisted(() => ({
  api: {
    loadReviews: vi.fn(),
    findVideos: vi.fn(),
    runReviewAction: vi.fn(),
    saveReviews: vi.fn(),
    request: vi.fn(),
  },
  review: {
    id: "review",
    name: "Review",
    description: "Queue",
    view: {
      filter: { page: 1, perPage: 24 },
      objectFilter: {},
      displayMode: "grid" as const,
      searchMode: "text",
    },
    actions: [
      {
        id: "apply",
        label: "Apply",
        steps: [{ mode: "ADD" as const, tagIds: [3] }],
      },
    ],
  },
}));

vi.mock("../api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../api")>()),
  ...api,
  videoCoverUrl: (video: { id: number }) => `/cover-${video.id}.jpg`,
  videoPreviewStatusUrl: (id: number) => `/preview-${id}/status`,
  videoPreviewUrl: (id: number) => `/preview-${id}.mp4`,
  videoScreenshotUrl: (video: { id: number }) => `/shot-${video.id}.jpg`,
  videoStreamUrl: (id: number) => `/stream-${id}.mp4`,
}));

function video(id: number) {
  return {
    id,
    title: `Video ${id}`,
    performers: [],
    files: [
      { id, basename: `${id}.mp4`, duration: 60, width: 1920, height: 1080 },
    ],
    updatedAt: "2026-01-01",
  };
}

beforeEach(() => {
  window.history.replaceState(null, "", "/data-quality?review=review");
  api.loadReviews.mockReset().mockResolvedValue({
    reviews: [review],
    storageKey: "reviews",
    canWrite: true,
  });
  api.findVideos
    .mockReset()
    .mockResolvedValue({ items: [video(1), video(2)], totalCount: 2 });
  api.runReviewAction.mockReset().mockResolvedValue(undefined);
  api.saveReviews.mockReset();
  api.request.mockReset().mockResolvedValue({ available: true });
  testVideoControls.toggle.mockReset();
  testVideoControls.seekBy.mockReset();
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(
    () => undefined,
  );
  Object.defineProperty(window, "requestAnimationFrame", {
    configurable: true,
    value: (callback: FrameRequestCallback) => callback(0),
  });
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: vi.fn(),
  });
  Object.defineProperty(HTMLElement.prototype, "offsetParent", {
    configurable: true,
    get() {
      return this.parentElement;
    },
  });
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      root = null;
      rootMargin = "";
      thresholds = [];
      constructor(private callback: IntersectionObserverCallback) {}
      observe(target: Element) {
        this.callback(
          [
            {
              isIntersecting: true,
              intersectionRatio: 1,
              target,
            } as IntersectionObserverEntry,
          ],
          this as unknown as IntersectionObserver,
        );
      }
      disconnect() {}
      unobserve() {}
      takeRecords() {
        return [];
      }
    },
  );
});

describe("Data Quality extension page", () => {
  it("navigates, previews, applies, advances, and restores focus", async () => {
    let changed = false;
    api.findVideos.mockImplementation(async () =>
      changed
        ? { items: [video(1)], totalCount: 1 }
        : { items: [video(1), video(2)], totalCount: 2 },
    );
    api.runReviewAction.mockImplementation(async () => {
      changed = true;
    });
    render(<DataQualityPage onNavigate={vi.fn()} />);
    const first = await screen.findByRole("article", { name: "Video 1" });
    await waitFor(() => expect(first).toHaveFocus());
    fireEvent.keyDown(first, { key: "ArrowRight" });
    const second = screen.getByRole("article", { name: "Video 2" });
    expect(second).toHaveFocus();
    fireEvent.keyDown(second, { key: "Enter" });
    const dialog = await screen.findByRole("dialog", {
      name: "Review preview: Video 2",
    });
    const hostKeyHandler = vi.fn();
    window.addEventListener("keydown", hostKeyHandler);
    fireEvent.keyDown(dialog, { key: "1" });
    expect(hostKeyHandler).not.toHaveBeenCalled();
    window.removeEventListener("keydown", hostKeyHandler);
    expect(
      await screen.findByRole("dialog", { name: "Review preview: Video 1" }),
    ).toBeInTheDocument();
    expect(api.runReviewAction).toHaveBeenCalledWith(review.actions[0], [2]);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: /Review preview/ }),
      ).not.toBeInTheDocument(),
    );
    expect(screen.getByRole("article", { name: "Video 1" })).toHaveFocus();
  });

  it("switches to wall previews and keeps the review editor on the extension page", async () => {
    render(<DataQualityPage onNavigate={vi.fn()} />);
    await screen.findByRole("article", { name: "Video 1" });
    fireEvent.click(screen.getByRole("button", { name: "wall" }));
    expect(screen.getByRole("button", { name: "wall" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await waitFor(() =>
      expect(document.querySelectorAll("video")).toHaveLength(2),
    );
    const manage = screen.getByRole("button", { name: /Manage reviews/ });
    manage.focus();
    fireEvent.click(manage);
    const manager = screen.getByRole("dialog", {
      name: "Manage Data Quality reviews",
    });
    expect(manager).toBeInTheDocument();
    const closeManager = screen.getByRole("button", {
      name: /Close review manager/,
    });
    expect(closeManager).toHaveFocus();
    const childKeyHandler = vi.fn();
    closeManager.addEventListener("keydown", childKeyHandler);
    fireEvent.keyDown(closeManager, { key: "ArrowDown" });
    expect(childKeyHandler).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: /Edit/ })).toBeInTheDocument();
    fireEvent.keyDown(manager, { key: "1" });
    expect(api.runReviewAction).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /Edit/ }));
    api.saveReviews.mockImplementationOnce(() => {
      throw new Error("Storage full");
    });
    fireEvent.click(screen.getByRole("button", { name: "Save review" }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not save reviews in this browser",
    );
    expect(manager).toBeInTheDocument();
    fireEvent.keyDown(manager, { key: "Escape" });
    expect(
      screen.queryByRole("dialog", { name: "Manage Data Quality reviews" }),
    ).not.toBeInTheDocument();
    expect(manage).toHaveFocus();
  });

  it("keeps the preview and retry context after an action failure", async () => {
    api.runReviewAction.mockRejectedValueOnce(
      new Error("Step 1 failed; 0 earlier step(s) completed."),
    );
    render(<DataQualityPage onNavigate={vi.fn()} />);
    const first = await screen.findByRole("article", { name: "Video 1" });
    fireEvent.keyDown(first, { key: "Enter" });
    const dialog = await screen.findByRole("dialog", {
      name: "Review preview: Video 1",
    });
    fireEvent.keyDown(dialog, { key: "1" });
    expect(await screen.findByRole("alert")).toHaveTextContent("Step 1 failed");
    expect(
      screen.getByRole("dialog", { name: "Review preview: Video 1" }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen
          .getAllByRole("button", { name: /Apply/ })
          .every((button) => !button.hasAttribute("disabled")),
      ).toBe(true),
    );
  });

  it("drops selected targets that leave the queue after a partial failure", async () => {
    let changed = false;
    api.findVideos.mockImplementation(async () =>
      changed
        ? { items: [video(2)], totalCount: 1 }
        : { items: [video(1), video(2)], totalCount: 2 },
    );
    api.runReviewAction.mockImplementationOnce(async () => {
      changed = true;
      throw new Error("Step 2 failed; 1 earlier step(s) completed.");
    });
    render(<DataQualityPage onNavigate={vi.fn()} />);
    await screen.findByRole("article", { name: "Video 1" });
    fireEvent.click(screen.getByRole("button", { name: "Select Video 1" }));
    fireEvent.click(screen.getByRole("button", { name: "Select Video 2" }));
    fireEvent.keyDown(screen.getByRole("article", { name: /Video 1/ }), {
      key: "1",
    });
    await screen.findByRole("alert");
    await waitFor(() =>
      expect(screen.getByText("1 selected video")).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole("button", { name: /Apply/ }));
    expect(api.runReviewAction).toHaveBeenLastCalledWith(
      review.actions[0],
      [2],
    );
  });

  it("keeps playback shortcuts inside Cove's player scope", async () => {
    render(<DataQualityPage onNavigate={vi.fn()} />);
    const first = await screen.findByRole("article", { name: "Video 1" });
    fireEvent.keyDown(first, { key: "Enter" });
    const playerScope = (await screen.findByTestId("video-player")).closest(
      ".dq-player",
    )!;
    fireEvent.keyDown(playerScope, { key: " " });
    fireEvent.keyDown(playerScope, { key: "ArrowRight" });
    fireEvent.keyDown(playerScope, { key: "ArrowLeft", shiftKey: true });
    expect(testVideoControls.toggle).toHaveBeenCalledOnce();
    expect(testVideoControls.seekBy).toHaveBeenNthCalledWith(1, 5);
    expect(testVideoControls.seekBy).toHaveBeenNthCalledWith(2, -10);
    expect(
      screen.getByRole("dialog", { name: "Review preview: Video 1" }),
    ).toBeInTheDocument();
  });
});
