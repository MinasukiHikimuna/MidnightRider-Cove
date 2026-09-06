import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DataQualityPage } from "../index";
import { testVideoControls } from "@cove/runtime/components";

const { api, review } = vi.hoisted(() => ({
  api: {
    loadReviews: vi.fn(),
    loadProgress: vi.fn(),
    saveProgress: vi.fn(),
    findVideos: vi.fn(),
    runReviewAction: vi.fn(),
    settleReviewWrites: vi.fn().mockResolvedValue(undefined),
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
  api.loadProgress.mockReset().mockResolvedValue(null);
  api.saveProgress.mockReset().mockResolvedValue(undefined);
  api.saveReviews.mockReset().mockResolvedValue(undefined);
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
  it("starts the toolbar with the review selector without repeating the review name", async () => {
    render(<DataQualityPage onNavigate={vi.fn()} />);

    await screen.findByRole("article", { name: "Video 1" });
    const select = screen.getByLabelText("Review");
    const toolbar = select.closest(".dq-toolbar");

    expect(toolbar).not.toBeNull();
    expect(toolbar?.firstElementChild).toContainElement(select);
    expect(
      screen.queryByRole("heading", { name: review.name }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(review.description)).toBeInTheDocument();
  });

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
    expect(screen.getByTestId("video-player")).toHaveAttribute(
      "data-autostart",
      "true",
    );
    const hostKeyHandler = vi.fn();
    window.addEventListener("keydown", hostKeyHandler);
    fireEvent.keyDown(dialog, { key: "1" });
    expect(hostKeyHandler).not.toHaveBeenCalled();
    window.removeEventListener("keydown", hostKeyHandler);
    expect(
      await screen.findByRole("dialog", { name: "Review preview: Video 1" }),
    ).toBeInTheDocument();
    expect(api.runReviewAction).toHaveBeenCalledWith(review.actions[0], [2]);
    expect(screen.getByTestId("video-player")).toHaveAttribute(
      "data-autostart",
      "true",
    );
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
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    fireEvent.keyDown(manager, { key: "1" });
    expect(api.runReviewAction).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    api.saveReviews.mockImplementationOnce(() => {
      throw new Error("Storage full");
    });
    fireEvent.click(screen.getByRole("button", { name: "Save review" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not save reviews",
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

  it("supports Culture skimming shortcuts throughout the preview", async () => {
    render(<DataQualityPage onNavigate={vi.fn()} />);
    const first = await screen.findByRole("article", { name: "Video 1" });
    fireEvent.keyDown(first, { key: "Enter" });
    const playerScope = await screen.findByRole("dialog");
    fireEvent.keyDown(playerScope, { key: " " });
    fireEvent.keyDown(playerScope, { key: "ArrowRight" });
    fireEvent.keyDown(playerScope, { key: "ArrowLeft", shiftKey: true });
    expect(testVideoControls.toggle).toHaveBeenCalledOnce();
    fireEvent.keyDown(playerScope, { key: "ArrowRight", altKey: true });
    fireEvent.keyDown(playerScope, { key: "," });
    fireEvent.keyDown(playerScope, { key: "." });
    [60, -5, 10, -6, 6].forEach((seconds, index) => {
      expect(testVideoControls.seekBy).toHaveBeenNthCalledWith(
        index + 1,
        seconds,
      );
    });
    expect(
      screen.getByRole("dialog", { name: "Review preview: Video 1" }),
    ).toBeInTheDocument();
    fireEvent.keyDown(playerScope, { key: "Enter" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(first).toHaveFocus();
  });

  it.each([
    {
      parentVideoId: undefined,
      clipStartSec: undefined,
      clipEndSec: undefined,
      seconds: 6,
    },
    { parentVideoId: 99, clipStartSec: 10, clipEndSec: 30, seconds: 2 },
    { parentVideoId: 99, clipStartSec: 10, clipEndSec: undefined, seconds: 5 },
  ])(
    "uses full source or clip duration for percentage seeking: %j",
    async ({ seconds, ...clip }) => {
      api.findVideos.mockResolvedValue({
        items: [{ ...video(1), ...clip }],
        totalCount: 1,
      });
      render(<DataQualityPage onNavigate={vi.fn()} />);
      fireEvent.keyDown(
        await screen.findByRole("article", { name: "Video 1" }),
        { key: "Enter" },
      );
      const dialog = await screen.findByRole("dialog");
      const media = document.createElement("video");
      Object.defineProperty(media, "duration", { value: 20 });
      dialog.querySelector(".dq-player")!.append(media);
      fireEvent.keyDown(dialog, { key: "." });
      expect(testVideoControls.seekBy).toHaveBeenCalledWith(seconds);
    },
  );

  it("preserves focused controls and navigates preview videos with n/m", async () => {
    render(<DataQualityPage onNavigate={vi.fn()} />);
    fireEvent.keyDown(await screen.findByRole("article", { name: "Video 1" }), {
      key: "Enter",
    });
    const close = await screen.findByRole("button", {
      name: "Close review preview",
    });
    fireEvent.keyDown(close, { key: "Enter" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "m" });
    expect(
      screen.getByRole("dialog", { name: "Review preview: Video 2" }),
    ).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "n" });
    expect(
      screen.getByRole("dialog", { name: "Review preview: Video 1" }),
    ).toBeInTheDocument();
  });
});

it("saves and cancels edits on the focused card without losing explicit selection", async () => {
  render(<DataQualityPage onNavigate={vi.fn()} />);
  const first = await screen.findByRole("article", { name: "Video 1" });
  fireEvent.keyDown(first, { key: "ArrowRight" });
  fireEvent.keyDown(screen.getByRole("article", { name: "Video 2" }), {
    key: " ",
  });
  fireEvent.click(screen.getByRole("button", { name: "Edit review" }));
  fireEvent.change(screen.getByLabelText("Description"), {
    target: { value: "Adjusted" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save review" }));
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
  expect(api.saveReviews).toHaveBeenCalledWith("reviews", [
    expect.objectContaining({ id: "review", description: "Adjusted" }),
  ]);
  expect(
    screen.getByRole("article", { name: "Video 2, selected" }),
  ).toHaveFocus();
  fireEvent.click(screen.getByRole("button", { name: "Edit review" }));
  fireEvent.change(screen.getByLabelText("Description"), {
    target: { value: "Discard" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(api.saveReviews).toHaveBeenCalledTimes(1);
  expect(
    screen.getByRole("article", { name: "Video 2, selected" }),
  ).toHaveFocus();
});
it("applies native filters temporarily and restores the saved query", async () => {
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  fireEvent.click(screen.getByRole("button", { name: "Adjust queue" }));
  fireEvent.click(screen.getByRole("button", { name: "Edit video filters" }));
  fireEvent.click(screen.getByRole("button", { name: "Apply filters" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Apply temporary queue" }),
  );
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
  expect(api.findVideos).toHaveBeenLastCalledWith(
    expect.objectContaining({
      view: expect.objectContaining({ objectFilter: { organized: true } }),
    }),
    expect.anything(),
    expect.anything(),
  );
  expect(api.saveReviews).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Reset to saved queue" }));
  await waitFor(() =>
    expect(api.findVideos).toHaveBeenLastCalledWith(
      review,
      expect.anything(),
      expect.anything(),
    ),
  );
});

it("resumes a changed page at a surviving identity and never restores selection", async () => {
  api.loadProgress.mockResolvedValue({
    signature: JSON.stringify([{ perPage: 24 }, {}, "text"]),
    filter: { page: 2, perPage: 24 },
    focusedId: 2,
    index: 0,
    displayMode: "list",
    cardSize: 260,
  });
  api.findVideos.mockResolvedValue({
    items: [video(1), video(2)],
    totalCount: 48,
  });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await waitFor(() =>
    expect(screen.getByRole("article", { name: "Video 2" })).toHaveFocus(),
  );
  expect(screen.getByRole("button", { name: "list" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(screen.queryByText(/selected video/)).not.toBeInTheDocument();
  expect(api.findVideos).toHaveBeenCalledWith(
    review,
    expect.objectContaining({ page: 2 }),
    expect.anything(),
  );
});
it("clamps a deleted last page in a large queue and keeps the renderer bounded", async () => {
  api.loadProgress.mockResolvedValue({
    signature: JSON.stringify([{ perPage: 24 }, {}, "text"]),
    filter: { page: 10000, perPage: 50000 },
    focusedId: 7,
    index: 98,
    displayMode: "wall",
    cardSize: null,
  });
  api.findVideos
    .mockResolvedValueOnce({ items: [], totalCount: 103 })
    .mockResolvedValue({
      items: [video(101), video(102), video(103)],
      totalCount: 103,
    });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await waitFor(() =>
    expect(screen.getByRole("article", { name: "Video 103" })).toHaveFocus(),
  );
  expect(api.findVideos).toHaveBeenLastCalledWith(
    review,
    expect.objectContaining({ page: 2, perPage: 100 }),
    expect.anything(),
  );
  expect(screen.getAllByRole("article")).toHaveLength(3);
});
it("does not save or enable video actions for a read-only account", async () => {
  api.loadReviews.mockResolvedValue({
    reviews: [review],
    storageKey: "reviews",
    canWrite: false,
    canConfigure: false,
  });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  const card = await screen.findByRole("article", { name: "Video 1" });
  fireEvent.keyDown(card, { key: "1" });
  expect(api.runReviewAction).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Edit review" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Adjust queue" })).toBeEnabled();
});
it("blocks actions on a stale queue after refresh failure and can retry the query", async () => {
  api.findVideos
    .mockResolvedValueOnce({ items: [video(1), video(2)], totalCount: 2 })
    .mockRejectedValueOnce(new Error("Network unavailable"));
  render(<DataQualityPage onNavigate={vi.fn()} />);
  const card = await screen.findByRole("article", { name: "Video 1" });
  fireEvent.keyDown(card, { key: "1" });
  await waitFor(() =>
    expect(screen.getByRole("button", { name: /Apply/ })).toBeDisabled(),
  );
  api.findVideos.mockResolvedValue({ items: [video(2)], totalCount: 1 });
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  await waitFor(() =>
    expect(screen.getByRole("button", { name: /Apply/ })).toBeEnabled(),
  );
});
it("keeps new selections made during an action and clamps keyboard movement", async () => {
  let finish!: () => void;
  api.runReviewAction.mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );
  render(<DataQualityPage onNavigate={vi.fn()} />);
  const first = await screen.findByRole("article", { name: "Video 1" });
  fireEvent.keyDown(first, { key: "ArrowLeft" });
  expect(first).toHaveAttribute("aria-current", "true");
  fireEvent.keyDown(first, { key: "1" });
  fireEvent.click(screen.getByRole("button", { name: "Select Video 2" }));
  finish();
  await waitFor(() =>
    expect(screen.getByRole("button", { name: /Apply/ })).toBeEnabled(),
  );
  expect(
    screen.getByRole("article", { name: "Video 2, selected" }),
  ).toBeInTheDocument();
});

it("clears loading when a pending review is deselected", async () => {
  api.findVideos.mockImplementation(() => new Promise(() => undefined));
  render(<DataQualityPage onNavigate={vi.fn()} />);
  const select = await screen.findByLabelText("Review");
  fireEvent.change(select, { target: { value: "" } });
  expect(select.closest(".dq-toolbar")).not.toBeNull();
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Manage reviews" }),
    ).toBeEnabled(),
  );
});
it("preserves manually selected presentation when only the description changes", async () => {
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  fireEvent.click(screen.getByRole("button", { name: "list" }));
  fireEvent.click(screen.getByRole("button", { name: "Edit review" }));
  fireEvent.change(screen.getByLabelText("Description"), {
    target: { value: "New description" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save review" }));
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
  expect(screen.getByRole("button", { name: "list" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
it("keeps local progress current after remote synchronization fails", async () => {
  api.saveProgress.mockRejectedValue(new Error("Offline"));
  render(<DataQualityPage onNavigate={vi.fn()} />);
  const first = await screen.findByRole("article", { name: "Video 1" });
  await screen.findByText(/account sync failed/);
  fireEvent.keyDown(first, { key: "ArrowRight" });
  await waitFor(() =>
    expect(
      JSON.parse(localStorage.getItem("reviews:progress:review")!).focusedId,
    ).toBe(2),
  );
});

it("exports a corrupt browser payload without modifying it", async () => {
  api.loadReviews.mockRejectedValue(new Error("Invalid configuration"));
  api.request.mockResolvedValue({ user: { id: "u" } });
  localStorage.setItem("cove-data-quality-v2:u", "{broken");
  const create = vi.fn((_blob: Blob) => "blob:recovery");
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: create,
  });
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    value: vi.fn(),
  });
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(
    () => undefined,
  );
  render(<DataQualityPage onNavigate={vi.fn()} />);
  fireEvent.click(
    await screen.findByRole("button", { name: "Export browser reviews" }),
  );
  await waitFor(() => expect(create).toHaveBeenCalled());
  expect(create.mock.calls[0][0].size).toBe(7);
  expect(localStorage.getItem("cove-data-quality-v2:u")).toBe("{broken");
});
it("does not carry an old review synchronization failure into a different review", async () => {
  let fail!: (error: Error) => void;
  api.saveProgress.mockImplementationOnce(
    () =>
      new Promise((_, reject) => {
        fail = reject;
      }),
  );
  api.loadReviews.mockResolvedValue({
    reviews: [review, { ...review, id: "other", name: "Other" }],
    storageKey: "reviews",
    canWrite: true,
  });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await waitFor(() => expect(api.saveProgress).toHaveBeenCalled());
  fireEvent.change(screen.getByLabelText("Review"), {
    target: { value: "other" },
  });
  await waitFor(() =>
    expect(api.findVideos).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: "other" }),
      expect.anything(),
      expect.anything(),
    ),
  );
  await act(async () => fail(new Error("Old review sync failed")));
  expect(screen.queryByText(/Old review sync failed/)).not.toBeInTheDocument();
});
it("disables competing edits while an import file is being read", async () => {
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  fireEvent.click(screen.getByRole("button", { name: "Manage reviews" }));
  let finish!: (value: string) => void;
  const file = new File(["[]"], "reviews.json", { type: "application/json" });
  Object.defineProperty(file, "text", {
    value: () =>
      new Promise<string>((resolve) => {
        finish = resolve;
      }),
  });
  fireEvent.change(document.querySelector("input[type=file]")!, {
    target: { files: [file] },
  });
  expect(screen.getByRole("button", { name: "New review" })).toBeDisabled();
  expect(
    screen.getByRole("button", { name: "Close review manager" }),
  ).toBeDisabled();
  await act(async () => finish("[]"));
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "New review" })).toBeEnabled(),
  );
});

it("duplicates and reorders actions while rejecting conflicting shortcuts", async () => {
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  fireEvent.click(screen.getByRole("button", { name: "Edit review" }));
  fireEvent.click(screen.getByRole("tab", { name: "Actions" }));
  fireEvent.click(screen.getByRole("button", { name: "Duplicate action" }));
  fireEvent.keyDown(screen.getByRole("button", { name: "Reorder action 2" }), {
    key: "ArrowUp",
    altKey: true,
  });
  fireEvent.change(screen.getAllByLabelText("Shortcut")[0], {
    target: { value: "2" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save review" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Assign each shortcut",
  );
  expect(api.saveReviews).not.toHaveBeenCalled();
  fireEvent.change(screen.getAllByLabelText("Shortcut")[0], {
    target: { value: "3" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalled());
  const saved = api.saveReviews.mock.calls[0][1][0];
  expect(saved.actions[1].id).toBe("apply");
  expect(saved.actions[0].id).not.toBe("apply");
  expect(saved.actions[0].shortcut).toBe("3");
  expect(saved.actions[0].steps).toEqual(review.actions[0].steps);
});
it("saves explicitly reordered tag operations", async () => {
  api.loadReviews.mockResolvedValue({
    reviews: [
      {
        ...review,
        actions: [
          {
            ...review.actions[0],
            steps: [
              { mode: "ADD", tagIds: [3] },
              { mode: "REMOVE", tagIds: [4] },
            ],
          },
        ],
      },
    ],
    storageKey: "reviews",
    canWrite: true,
  });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  fireEvent.click(screen.getByRole("button", { name: "Edit review" }));
  fireEvent.click(screen.getByRole("tab", { name: "Actions" }));
  fireEvent.keyDown(screen.getByRole("button", { name: "Reorder step 1" }), {
    key: "ArrowDown",
    altKey: true,
  });
  fireEvent.click(screen.getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalled());
  expect(api.saveReviews.mock.calls[0][1][0].actions[0].steps).toEqual([
    { mode: "REMOVE", tagIds: [4] },
    { mode: "ADD", tagIds: [3] },
  ]);
});

it("keeps edits across review sections and saves the combined draft", async () => {
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  fireEvent.click(screen.getByRole("button", { name: "Edit review" }));
  fireEvent.change(screen.getByLabelText("Description"), {
    target: { value: "Check metadata" },
  });
  fireEvent.click(screen.getByRole("tab", { name: "Queue" }));
  expect(screen.getByLabelText("Description")).not.toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Edit video filters" }));
  fireEvent.click(screen.getByRole("button", { name: "Apply filters" }));
  fireEvent.click(screen.getByRole("tab", { name: "Appearance" }));
  fireEvent.change(screen.getByLabelText("Preferred view"), {
    target: { value: "wall" },
  });
  fireEvent.click(screen.getByRole("tab", { name: "Review" }));
  expect(screen.getByLabelText("Description")).toHaveValue("Check metadata");
  fireEvent.click(screen.getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalled());
  expect(api.saveReviews.mock.calls[0][1][0]).toMatchObject({
    description: "Check metadata",
    view: { objectFilter: { organized: true }, displayMode: "wall" },
  });
});

it("uses shared pagination while clearing selection and blocking navigation during loading", async () => {
  api.findVideos.mockResolvedValue({ items: [video(1), video(2)], totalCount: 240 });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(screen.getAllByRole("button", { name: "Last page" })[0]).toBeEnabled());
  expect(screen.getAllByRole("button", { name: "First page" })).toHaveLength(2);
  expect(screen.getAllByRole("button", { name: "First page" })[0]).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Select Video 1" }));
  expect(screen.getByText("1 selected video")).toBeInTheDocument();
  let resolveQueue!: (value: { items: ReturnType<typeof video>[]; totalCount: number }) => void;
  api.findVideos.mockImplementationOnce(() => new Promise((resolve) => { resolveQueue = resolve; }));
  fireEvent.click(screen.getAllByRole("button", { name: "Last page" })[0]);
  expect(api.findVideos).toHaveBeenLastCalledWith(review, expect.objectContaining({ page: 10 }), expect.anything());
  expect(screen.getAllByRole("button", { name: "First page" })[0]).toBeDisabled();
  expect(screen.getAllByRole("button", { name: "Next page" })[0]).toBeDisabled();
  await act(async () => resolveQueue({ items: [video(3)], totalCount: 240 }));
  await screen.findByRole("article", { name: "Video 3" });
  expect(screen.queryByText("1 selected video")).not.toBeInTheDocument();
  expect(screen.getByText("focused video")).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: "Last page" })[0]).toBeDisabled();
  fireEvent.click(screen.getAllByRole("button", { name: "Previous page" })[1]);
  await waitFor(() => expect(api.findVideos).toHaveBeenLastCalledWith(review, expect.objectContaining({ page: 9 }), expect.anything()));
  await waitFor(() => expect(screen.getAllByRole("button", { name: "First page" })[0]).toBeEnabled());
  fireEvent.click(screen.getAllByRole("button", { name: "First page" })[0]);
  await waitFor(() => expect(api.findVideos).toHaveBeenLastCalledWith(review, expect.objectContaining({ page: 1 }), expect.anything()));
});
