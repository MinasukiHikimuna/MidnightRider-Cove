import {
  act,
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DataQualityPage, objectFiltersEqual } from "../index";
import { presentedVideo } from "../TagPresentation";
import { testVideoControls } from "@cove/runtime/components";
import { testFilterControls } from "./runtime-components";

const { api, review } = vi.hoisted(() => ({
  api: {
    loadReviews: vi.fn(),
    loadProgress: vi.fn(),
    saveProgress: vi.fn(),
    findVideos: vi.fn(),
    runReviewAction: vi.fn(),
    settleReviewWrites: vi.fn().mockResolvedValue(undefined),
    getConfirmedAbsentTagsFieldStatus: vi.fn(),
    createConfirmedAbsentTagsField: vi.fn(),
    saveReviews: vi.fn(),
    resolveTagTree: vi.fn(),
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

it("compares equivalent object filters independently of key order", () => {
  expect(
    objectFiltersEqual(
      {
        titleCriterion: { modifier: "INCLUDES", value: "review default" },
        tagCriterion: { excluded: [3, 4], included: [1, 2] },
      },
      {
        tagCriterion: { included: [1, 2], excluded: [3, 4] },
        titleCriterion: { value: "review default", modifier: "INCLUDES" },
      },
    ),
  ).toBe(true);
  expect(objectFiltersEqual({ tags: [1, 2] }, { tags: [2, 1] })).toBe(false);
});

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
    details: `Details ${id}`,
    date: "2026-01-01",
    studioId: 20,
    studioName: "Studio 1",
    organized: true,
    urls: [],
    tags: [{ id: 30, name: "Tag 1" }],
    performers: [
      { id: 10, name: "Performer 1", imagePath: "/performer-1.jpg" },
    ],
    groups: [],
    galleries: [],
    files: [
      { id, basename: `${id}.mp4`, duration: 60, width: 1920, height: 1080 },
    ],
    createdAt: "2026-01-01",
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
  api.resolveTagTree.mockReset().mockResolvedValue([]);
  api.getConfirmedAbsentTagsFieldStatus.mockReset().mockResolvedValue({
    kind: "ready",
    definition: {},
    message: "",
  });
  api.createConfirmedAbsentTagsField.mockReset().mockResolvedValue(undefined);
  api.request.mockReset().mockResolvedValue({ available: true });
  testFilterControls.result = { organized: true };
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
  it("offers explicit setup when the absence field is missing", async () => {
    api.getConfirmedAbsentTagsFieldStatus
      .mockResolvedValueOnce({
        kind: "missing",
        message: "Create the Confirmed absent tags custom field.",
      })
      .mockResolvedValueOnce({ kind: "ready", definition: {}, message: "" });
    render(<DataQualityPage onNavigate={vi.fn()} />);
    const setup = await screen.findByRole("button", {
      name: "Set up tag assessments",
    });
    fireEvent.click(setup);
    await waitFor(() =>
      expect(api.createConfirmedAbsentTagsField).toHaveBeenCalledTimes(1),
    );
    await waitFor(() => expect(setup).not.toBeInTheDocument());
  });

  it("rechecks tag assessment setup after a transient failure", async () => {
    api.getConfirmedAbsentTagsFieldStatus
      .mockRejectedValueOnce(new Error("Temporarily unavailable"))
      .mockResolvedValueOnce({ kind: "ready", definition: {}, message: "" });
    render(<DataQualityPage onNavigate={vi.fn()} />);

    const retry = await screen.findByRole("button", { name: "Check again" });
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Temporarily unavailable",
    );
    fireEvent.click(retry);

    await waitFor(() =>
      expect(screen.queryByRole("alert")).not.toBeInTheDocument(),
    );
    expect(api.getConfirmedAbsentTagsFieldStatus).toHaveBeenCalledTimes(2);
  });

  it("does not run an unavailable assessment through its shortcut", async () => {
    api.loadReviews.mockResolvedValue({
      reviews: [
        {
          ...review,
          actions: [
            {
              id: "assess",
              label: "Assess",
              steps: [{ mode: "MARK_ABSENT" as const, tagIds: [3] }],
            },
          ],
        },
      ],
      storageKey: "reviews",
      canWrite: true,
    });
    api.getConfirmedAbsentTagsFieldStatus.mockResolvedValue({
      kind: "missing",
      message: "Setup required",
    });
    render(<DataQualityPage onNavigate={vi.fn()} />);

    const first = await screen.findByRole("article", { name: "Video 1" });
    fireEvent.keyDown(first, { key: "1" });

    expect(api.runReviewAction).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: /Assess.*1 step\(s\)/ }),
    ).toBeDisabled();
  });

  it("does not reserve a notice row for healthy account storage", async () => {
    const { container } = render(<DataQualityPage onNavigate={vi.fn()} />);

    await screen.findByRole("article", { name: "Video 1" });
    expect(
      container.querySelector(".data-quality-page > .dq-status"),
    ).not.toBeInTheDocument();
  });

  it("keeps actionable storage notices visible", async () => {
    api.loadReviews.mockResolvedValue({
      reviews: [review],
      storageKey: "reviews",
      canWrite: true,
      storageNotice: "Reviews and progress are saved only in this browser.",
    });
    render(<DataQualityPage onNavigate={vi.fn()} />);

    expect(
      await screen.findByText(
        "Reviews and progress are saved only in this browser.",
      ),
    ).toHaveClass("dq-status");
  });

  it("places review management beside the title as an icon", async () => {
    render(<DataQualityPage onNavigate={vi.fn()} />);

    await screen.findByRole("article", { name: "Video 1" });
    const heading = screen.getByRole("heading", { name: "Data Quality" });
    const manage = screen.getByRole("button", { name: "Manage reviews" });

    expect(heading.parentElement).toContainElement(manage);
    expect(manage).toContainHTML("svg");
    expect(manage).toHaveTextContent("");
    expect(
      screen.queryByText(
        "A focused queue for previewing videos and applying saved review actions.",
      ),
    ).not.toBeInTheDocument();
  });

  it("starts the video toolbar with a compact review selector and edit icon", async () => {
    render(<DataQualityPage onNavigate={vi.fn()} />);

    await screen.findByRole("article", { name: "Video 1" });
    const select = screen.getByLabelText("Review");
    const toolbar = select.closest(".dq-queue-toolbar");
    const edit = screen.getByRole("button", { name: "Edit review" });

    expect(toolbar).not.toBeNull();
    expect(toolbar?.firstElementChild).toContainElement(select);
    expect(select).toHaveDisplayValue(review.name);
    expect(screen.getByRole("option", { name: "Choose a review…" })).toHaveValue(
      "",
    );
    expect(toolbar).toHaveStyle(
      `--dq-review-select-width: ${Math.min(32, Math.max(12, review.name.length + 3))}ch`,
    );
    expect(edit).toContainHTML("svg");
    expect(edit).toHaveTextContent("");
    expect(
      screen.queryByRole("heading", { name: review.name }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(review.description)).toBeInTheDocument();
  });

  it("shows the visible video range and total in the toolbar", async () => {
    api.findVideos.mockResolvedValue({
      items: [video(1), video(2)],
      totalCount: 182,
    });
    render(<DataQualityPage onNavigate={vi.fn()} />);

    const count = await screen.findByText("1–24 of 182");
    expect(count).toBeInTheDocument();
    expect(screen.queryByText("182 matching")).not.toBeInTheDocument();
    expect(
      within(screen.getByRole("toolbar", { name: "Video list controls" })).getByText(
        "1–24 of 182",
      ),
    ).toBe(count);
  });

  it("shows an empty range for a review without videos", async () => {
    api.findVideos.mockResolvedValue({ items: [], totalCount: 0 });
    render(<DataQualityPage onNavigate={vi.fn()} />);

    expect(await screen.findByText("0 items")).toBeInTheDocument();
  });

  it("opens video details in a new tab directly from cards and previews", async () => {
    const onNavigate = vi.fn();
    render(<DataQualityPage onNavigate={onNavigate} />);

    const card = await screen.findByRole("article", { name: "Video 1" });
    const cardLink = within(card).getByRole("link", {
      name: "Video 1",
    });
    expect(cardLink).toHaveAttribute("href", "/video/1");
    expect(cardLink).toHaveAttribute("target", "_blank");
    expect(cardLink).toHaveAttribute("rel", "noreferrer");
    expect(cardLink).toHaveClass("dq-card-link", "absolute", "inset-0");
    expect(cardLink.closest(".video-card")).toBe(
      card.querySelector(".video-card"),
    );
    expect(cardLink).toHaveAttribute("aria-labelledby", "dq-card-title-1");
    expect(card.querySelector(".card-title")).toHaveAttribute(
      "id",
      "dq-card-title-1",
    );
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    fireEvent.click(cardLink);
    expect(open).toHaveBeenCalledWith(
      "/video/1",
      "_blank",
      "noopener,noreferrer",
    );

    fireEvent.keyDown(card, { key: "Enter" });
    const preview = await screen.findByRole("dialog", {
      name: "Review preview: Video 1",
    });
    const previewLink = within(preview).getByRole("link", {
      name: "Open Video 1 details in new tab",
    });
    expect(previewLink).toHaveAttribute("href", "/video/1");
    expect(previewLink).toHaveAttribute("target", "_blank");
    expect(previewLink).toHaveAttribute("rel", "noreferrer");
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it("loads card covers lazily and replaces failed covers", async () => {
    render(<DataQualityPage onNavigate={vi.fn()} />);

    const card = await screen.findByRole("article", { name: "Video 1" });
    const cover = card.querySelector<HTMLImageElement>(
      ".video-card-preview-image",
    );
    expect(cover).toHaveAttribute("loading", "lazy");
    fireEvent.error(cover!);
    expect(card.querySelector(".video-card-preview-image")).toBeNull();
    expect(card.querySelector(".video-card-cover-fallback")).not.toBeNull();
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
    const gridCard = await screen.findByRole("article", { name: "Video 1" });
    expect(gridCard.querySelector(".video-card")).toHaveClass(
      "video-card",
      "rounded",
      "border",
      "bg-card",
    );
    expect(gridCard.querySelector(".video-card-preview")).toHaveClass(
      "video-card-preview",
      "card-media",
      "relative",
      "aspect-video",
      "overflow-hidden",
      "bg-black",
    );
    expect(gridCard.querySelector(".card-body")).toHaveClass(
      "card-body",
      "border-t",
      "border-border/50",
    );
    expect(gridCard.querySelector(".card-title")).toHaveClass(
      "card-title",
      "font-semibold",
      "line-clamp-2",
    );
    expect(
      within(gridCard).queryByRole("link", { name: "Performer 1" }),
    ).not.toBeInTheDocument();
    expect(within(gridCard).queryByTitle("Tags")).not.toBeInTheDocument();
    expect(gridCard.querySelector(".card-body")).not.toHaveTextContent(
      "Details 1",
    );
    expect(gridCard.querySelector(".card-body")).not.toHaveTextContent(
      "2026-01-01",
    );
    expect(gridCard.querySelector(".card-body")).not.toHaveTextContent(
      "Studio 1",
    );
    expect(gridCard).toHaveClass("no-card-metadata", "no-card-footer");
    expect(
      getComputedStyle(
        gridCard.querySelector(
          ".card-body > div:first-child > div, .card-body > .card-title + div",
        )!,
      ).display,
    ).toBe("none");
    expect(
      getComputedStyle(gridCard.querySelector(".card-popovers")!).display,
    ).toBe("none");
    const viewGroup = screen.getByRole("group", { name: "Review view" });
    for (const mode of ["Grid", "Wall"])
      expect(screen.getByRole("button", { name: mode })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "List" }),
    ).not.toBeInTheDocument();
    expect(viewGroup).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Auto fit" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: "Card size: 180px" }),
    ).toBeInTheDocument();
    expect(document.querySelector(".dq-grid")).toHaveStyle({
      "--dq-card-width": "180px",
    });
    fireEvent.click(screen.getByRole("button", { name: "Wall" }));
    expect(screen.getByRole("button", { name: "Wall" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await waitFor(() =>
      expect(document.querySelectorAll("video")).toHaveLength(2),
    );
    await waitFor(() =>
      expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2),
    );
    for (const card of screen.getAllByRole("article")) {
      expect(card.querySelector(".dq-wall-autoplay")).not.toBeNull();
      expect(card.querySelector(".dq-wall-autoplay video")).toHaveClass(
        "dq-wall-preview-video",
      );
      expect(
        getComputedStyle(card.querySelector(".dq-wall-autoplay video")!)
          .opacity,
      ).toBe("1");
      expect(card.querySelector(".card-body .card-title")).not.toBeNull();
    }
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

  it("shows configured descendant tags through the native card", async () => {
    api.resolveTagTree.mockResolvedValueOnce([100, 30]);
    api.findVideos.mockResolvedValueOnce({
      items: [
        {
          ...video(1),
          groups: [{ id: 40, name: "Group 1" }],
          galleries: [{ id: 50, title: "Gallery 1" }],
        },
      ],
      totalCount: 1,
    });
    api.loadReviews.mockResolvedValueOnce({
      reviews: [
        {
          ...review,
          presentation: {
            annotations: ["tags"],
            annotationParents: [100],
          },
        },
      ],
      storageKey: "reviews",
      canWrite: true,
    });
    render(<DataQualityPage onNavigate={vi.fn()} />);

    const card = await screen.findByRole("article", { name: "Video 1" });
    expect(card.querySelector(".card-body")).not.toHaveTextContent("Details 1");
    expect(within(card).getByTitle("Tags")).toHaveTextContent("1");
    expect(within(card).queryByTitle("Performers")).not.toBeInTheDocument();
    expect(within(card).queryByTitle("Groups")).not.toBeInTheDocument();
    expect(within(card).queryByTitle("Galleries")).not.toBeInTheDocument();
    expect(within(card).queryByTitle("Organized")).not.toBeInTheDocument();
    expect(card.querySelector(".card-body")).not.toHaveTextContent("Studio 1");
    expect(card).toHaveClass("no-card-metadata", "has-card-footer");
  });

  it("does not show configured tag annotations without a parent", async () => {
    api.loadReviews.mockResolvedValueOnce({
      reviews: [
        {
          ...review,
          presentation: { annotations: ["tags"] },
        },
      ],
      storageKey: "reviews",
      canWrite: true,
    });
    render(<DataQualityPage onNavigate={vi.fn()} />);

    const card = await screen.findByRole("article", { name: "Video 1" });
    expect(within(card).queryByTitle("Tags")).not.toBeInTheDocument();
  });

  it("excludes a configured annotation parent while showing its descendants", () => {
    expect(
      presentedVideo(
        {
          ...video(1),
          tags: [
            { id: 100, name: "Parent" },
            { id: 30, name: "Child" },
          ],
        },
        {
          ...review,
          presentation: {
            annotations: ["tags"],
            annotationParents: [100],
          },
        },
        { 100: [100, 30] },
      ),
    ).toMatchObject({ tags: [{ id: 30, name: "Child" }] });
  });

  it("shows performer annotations only when explicitly configured", async () => {
    api.loadReviews.mockResolvedValueOnce({
      reviews: [
        {
          ...review,
          presentation: { annotations: ["performers"] },
        },
      ],
      storageKey: "reviews",
      canWrite: true,
    });
    render(<DataQualityPage onNavigate={vi.fn()} />);

    const card = await screen.findByRole("article", { name: "Video 1" });
    expect(
      within(card).getByRole("link", { name: "Performer 1" }),
    ).toHaveAttribute("href", "/performer/10");
    expect(card.querySelector(".card-body")).not.toHaveTextContent(
      "2026-01-01",
    );
    expect(within(card).queryByTitle("Tags")).not.toBeInTheDocument();
  });

  it("shows date and studio only when explicitly configured", async () => {
    api.loadReviews.mockResolvedValueOnce({
      reviews: [
        {
          ...review,
          presentation: { annotations: ["date", "studio"] },
        },
      ],
      storageKey: "reviews",
      canWrite: true,
    });
    render(<DataQualityPage onNavigate={vi.fn()} />);

    const card = await screen.findByRole("article", { name: "Video 1" });
    expect(card.querySelector(".card-body")).toHaveTextContent("2026-01-01");
    expect(card.querySelector(".card-body")).toHaveTextContent("Studio 1");
    expect(within(card).queryByTitle("Performers")).not.toBeInTheDocument();
    expect(within(card).queryByTitle("Tags")).not.toBeInTheDocument();
  });

  it("omits native metadata when every annotation is disabled", async () => {
    api.loadReviews.mockResolvedValueOnce({
      reviews: [
        {
          ...review,
          presentation: { annotations: [] },
        },
      ],
      storageKey: "reviews",
      canWrite: true,
    });
    render(<DataQualityPage onNavigate={vi.fn()} />);

    const card = await screen.findByRole("article", { name: "Video 1" });
    expect(card.querySelector(".card-body")).not.toHaveTextContent("Details 1");
    expect(within(card).queryByTitle("Performers")).not.toBeInTheDocument();
    expect(within(card).queryByTitle("Tags")).not.toBeInTheDocument();
    expect(card).toHaveClass("no-card-metadata", "no-card-footer");
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
  expect(
    screen.getByRole("article", { name: "Video 2, selected" }),
  ).toHaveClass("focused", "selected");
  expect(
    getComputedStyle(
      screen
        .getByRole("article", { name: "Video 2, selected" })
        .querySelector(".video-card")!,
    ).outlineStyle,
  ).toBe("solid");
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
it("uses the native video toolbar and resets all queue values to review defaults", async () => {
  const configuredReview = {
    ...review,
    view: {
      ...review.view,
      filter: { page: 1, perPage: 24, sort: "date", direction: "desc" },
      objectFilter: {
        titleCriterion: { value: "review default", modifier: "INCLUDES" },
      },
    },
  };
  api.loadReviews.mockResolvedValueOnce({
    reviews: [configuredReview],
    storageKey: "reviews",
    canWrite: true,
  });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });

  const nativeToolbar = screen.getByRole("toolbar", {
    name: "Video list controls",
  });
  expect(nativeToolbar).toBeInTheDocument();
  expect(screen.getByLabelText("Search list")).toHaveValue("");
  expect(within(nativeToolbar).getAllByRole("combobox")[0]).toHaveValue("date");
  expect(screen.getByLabelText("Items per page")).toHaveValue("24");
  expect(screen.getByRole("button", { name: "Filters, 1 active" })).toBeInTheDocument();
  expect(screen.getByRole("region", { name: "Applied filters" })).toHaveTextContent(
    "titleCriterion",
  );

  fireEvent.change(screen.getByLabelText("Search list"), {
    target: { value: "session search" },
  });
  await waitFor(() =>
    expect(api.findVideos).toHaveBeenLastCalledWith(
      expect.objectContaining({
        view: expect.objectContaining({
          objectFilter: configuredReview.view.objectFilter,
        }),
      }),
      expect.objectContaining({ page: 1, q: "session search" }),
      expect.anything(),
    ),
  );

  fireEvent.click(screen.getByRole("button", { name: "Filters, 1 active" }));
  fireEvent.click(screen.getByRole("button", { name: "Apply filters" }));
  await waitFor(() =>
    expect(api.findVideos).toHaveBeenLastCalledWith(
      expect.objectContaining({
        view: expect.objectContaining({ objectFilter: { organized: true } }),
      }),
      expect.objectContaining({ page: 1, q: "session search" }),
      expect.anything(),
    ),
  );
  expect(api.saveReviews).not.toHaveBeenCalled();
  expect(
    screen.getByRole("button", { name: "Reset to review defaults" }),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Reset to review defaults" }));
  await waitFor(() =>
    expect(api.findVideos).toHaveBeenLastCalledWith(
      configuredReview,
      configuredReview.view.filter,
      expect.anything(),
    ),
  );
  expect(screen.getByLabelText("Search list")).toHaveValue("");
  expect(screen.getByRole("status")).toHaveTextContent(
    "Review queue defaults restored.",
  );
  expect(screen.queryByText("Temporary queue")).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Reset to review defaults" }),
  ).not.toBeInTheDocument();
});

it("changes sort and page size directly from the native toolbar", async () => {
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });

  fireEvent.click(screen.getByRole("button", { name: "Descending" }));
  await waitFor(() =>
    expect(api.findVideos).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ direction: "asc", page: 1 }),
      expect.anything(),
    ),
  );
  fireEvent.change(screen.getByLabelText("Items per page"), {
    target: { value: "1000" },
  });
  await waitFor(() =>
    expect(api.findVideos).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ perPage: 1000, page: 1 }),
      expect.anything(),
    ),
  );
  fireEvent.click(screen.getByRole("button", { name: "Save queue to review" }));
  await waitFor(() =>
    expect(api.saveReviews).toHaveBeenCalledWith(
      "reviews",
      expect.arrayContaining([
        expect.objectContaining({
          view: expect.objectContaining({
            filter: expect.objectContaining({
              direction: "asc",
              perPage: 1000,
              page: 1,
            }),
          }),
        }),
      ]),
    ),
  );
  expect(screen.queryByText("Adjust queue")).not.toBeInTheDocument();
});

it("does not retain a temporary queue for reordered equivalent filters", async () => {
  const objectFilter = {
    organized: true,
    titleCriterion: { value: "review default", modifier: "INCLUDES" },
  };
  api.loadReviews.mockResolvedValueOnce({
    reviews: [{ ...review, view: { ...review.view, objectFilter } }],
    storageKey: "reviews",
    canWrite: true,
  });
  testFilterControls.result = {
    titleCriterion: { modifier: "INCLUDES", value: "review default" },
    organized: true,
  };
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  fireEvent.click(screen.getByRole("button", { name: "Filters, 2 active" }));
  fireEvent.click(screen.getByRole("button", { name: "Apply filters" }));
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent(
      "Review queue defaults restored.",
    ),
  );
  expect(screen.queryByText("Temporary queue")).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Reset to review defaults" }),
  ).not.toBeInTheDocument();
});

it("keeps filter controls inert while the queue is loading", async () => {
  const configuredReview = {
    ...review,
    view: { ...review.view, objectFilter: { organized: true } },
  };
  api.loadReviews.mockResolvedValueOnce({
    reviews: [configuredReview],
    storageKey: "reviews",
    canWrite: true,
  });
  api.findVideos.mockResolvedValueOnce({
    items: [video(1), video(2)],
    totalCount: 48,
  });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });

  let resolveQueue!: (value: {
    items: ReturnType<typeof video>[];
    totalCount: number;
  }) => void;
  api.findVideos.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        resolveQueue = resolve;
      }),
  );
  fireEvent.click(screen.getAllByRole("button", { name: "Next page" })[0]);
  const toolbarRegion = screen.getByRole("region", {
    name: "Video queue toolbar",
  });
  expect(toolbarRegion.querySelector("[aria-disabled='true']")).toHaveAttribute(
    "inert",
  );

  await act(async () => resolveQueue({ items: [video(3)], totalCount: 48 }));
  await screen.findByRole("article", { name: "Video 3" });
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
  expect(screen.getByRole("button", { name: "Grid" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(
    screen.queryByRole("button", { name: "List" }),
  ).not.toBeInTheDocument();
  expect(screen.queryByText(/selected video/)).not.toBeInTheDocument();
  expect(api.findVideos).toHaveBeenCalledWith(
    review,
    expect.objectContaining({ page: 2 }),
    expect.anything(),
  );
  expect(screen.getByText("25–48 of 48")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Grid" }));
  expect(
    screen.getByRole("slider", { name: "Card size: 260px" }),
  ).toBeInTheDocument();
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
    expect.objectContaining({ page: 1, perPage: 1000 }),
    expect.anything(),
  );
  expect(screen.getByText("1–103 of 103")).toBeInTheDocument();
  expect(screen.getAllByRole("article")).toHaveLength(3);
  expect(
    screen.getByRole("slider", { name: "Card size: 180px" }),
  ).toBeInTheDocument();
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
  expect(
    screen.getByRole("toolbar", { name: "Video list controls" }),
  ).toBeInTheDocument();
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
  await waitFor(() =>
    expect(screen.getByLabelText("Review").closest(".dq-toolbar")).not.toBeNull(),
  );
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Manage reviews" }),
    ).toBeEnabled(),
  );
});
it("preserves manually selected presentation when only the description changes", async () => {
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  fireEvent.click(screen.getByRole("button", { name: "Wall" }));
  fireEvent.click(screen.getByRole("button", { name: "Edit review" }));
  fireEvent.change(screen.getByLabelText("Description"), {
    target: { value: "New description" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save review" }));
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
  expect(screen.getByRole("button", { name: "Wall" })).toHaveAttribute(
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

it("edits and saves all tag assessment modes", async () => {
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  fireEvent.click(screen.getByRole("button", { name: "Edit review" }));
  fireEvent.click(screen.getByRole("tab", { name: "Actions" }));
  const operation = screen.getByLabelText("Tag operation");
  expect(operation).toHaveTextContent("Mark present");
  expect(operation).toHaveTextContent("Mark absent");
  expect(operation).toHaveTextContent("Clear absence");
  fireEvent.change(operation, { target: { value: "MARK_ABSENT" } });
  fireEvent.click(screen.getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalled());
  expect(api.saveReviews.mock.calls[0][1][0].actions[0].steps).toEqual([
    { mode: "MARK_ABSENT", tagIds: [3] },
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
  for (const annotation of ["date", "studio", "performers", "tags"])
    expect(screen.getByLabelText(annotation)).not.toBeChecked();
  expect(
    screen.queryByPlaceholderText("Search annotation parent tags..."),
  ).not.toBeInTheDocument();
  expect(
    screen.getByPlaceholderText("Search tag-bin parent tags..."),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText("tags"));
  expect(
    screen.getByPlaceholderText("Search annotation parent tags..."),
  ).toBeInTheDocument();
  expect(
    screen.queryByLabelText("Preferred card width"),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("option", { name: "Auto fit" }),
  ).not.toBeInTheDocument();
  const preferredView = screen.getByLabelText("Preferred view");
  expect(
    within(preferredView)
      .getAllByRole("option")
      .map((option) => option.textContent),
  ).toEqual(["grid", "wall"]);
  fireEvent.change(preferredView, {
    target: { value: "wall" },
  });
  fireEvent.click(screen.getByRole("tab", { name: "Review" }));
  expect(screen.getByLabelText("Description")).toHaveValue("Check metadata");
  fireEvent.click(screen.getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalled());
  expect(api.saveReviews.mock.calls[0][1][0]).toMatchObject({
    description: "Check metadata",
    view: { objectFilter: { organized: true }, displayMode: "wall" },
    presentation: { annotations: ["tags"] },
  });
});

it("ignores legacy per-review card width preferences", async () => {
  api.loadReviews.mockResolvedValueOnce({
    reviews: [
      {
        ...review,
        presentation: { cardSize: 380, annotations: [] },
      },
    ],
    storageKey: "reviews",
    canWrite: true,
  });
  render(<DataQualityPage onNavigate={vi.fn()} />);

  await screen.findByRole("article", { name: "Video 1" });
  expect(
    screen.getByRole("slider", { name: "Card size: 180px" }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Edit review" }));
  fireEvent.click(screen.getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalled());
  expect(api.saveReviews.mock.calls[0][1][0].presentation).not.toHaveProperty(
    "cardSize",
  );
});

it("uses shared pagination while clearing selection and blocking navigation during loading", async () => {
  api.findVideos.mockResolvedValue({
    items: [video(1), video(2)],
    totalCount: 240,
  });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() =>
    expect(
      screen.getAllByRole("button", { name: "Last page" })[0],
    ).toBeEnabled(),
  );
  expect(screen.getAllByRole("button", { name: "First page" })).toHaveLength(2);
  expect(
    screen.getAllByRole("button", { name: "First page" })[0],
  ).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Select Video 1" }));
  expect(screen.getByText("1 selected video")).toBeInTheDocument();
  let resolveQueue!: (value: {
    items: ReturnType<typeof video>[];
    totalCount: number;
  }) => void;
  api.findVideos.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        resolveQueue = resolve;
      }),
  );
  fireEvent.click(screen.getAllByRole("button", { name: "Last page" })[0]);
  expect(api.findVideos).toHaveBeenLastCalledWith(
    review,
    expect.objectContaining({ page: 10 }),
    expect.anything(),
  );
  expect(
    screen.getAllByRole("button", { name: "First page" })[0],
  ).toBeDisabled();
  expect(
    screen.getAllByRole("button", { name: "Next page" })[0],
  ).toBeDisabled();
  await act(async () => resolveQueue({ items: [video(3)], totalCount: 240 }));
  await screen.findByRole("article", { name: "Video 3" });
  expect(screen.queryByText("1 selected video")).not.toBeInTheDocument();
  expect(screen.getByText("focused video")).toBeInTheDocument();
  expect(
    screen.getAllByRole("button", { name: "Last page" })[0],
  ).toBeDisabled();
  fireEvent.click(screen.getAllByRole("button", { name: "Previous page" })[1]);
  await waitFor(() =>
    expect(api.findVideos).toHaveBeenLastCalledWith(
      review,
      expect.objectContaining({ page: 9 }),
      expect.anything(),
    ),
  );
  await waitFor(() =>
    expect(
      screen.getAllByRole("button", { name: "First page" })[0],
    ).toBeEnabled(),
  );
  fireEvent.click(screen.getAllByRole("button", { name: "First page" })[0]);
  await waitFor(() =>
    expect(api.findVideos).toHaveBeenLastCalledWith(
      review,
      expect.objectContaining({ page: 1 }),
      expect.anything(),
    ),
  );
});

it("keeps the visible range on the last successfully loaded page", async () => {
  api.findVideos
    .mockResolvedValueOnce({ items: [video(1), video(2)], totalCount: 48 })
    .mockRejectedValueOnce(new Error("Network unavailable"));
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByText("1–24 of 48");

  fireEvent.click(screen.getAllByRole("button", { name: "Next page" })[0]);

  await screen.findByText("Network unavailable");
  expect(screen.getByRole("article", { name: "Video 1" })).toBeInTheDocument();
  expect(screen.getByText("1–24 of 48")).toBeInTheDocument();
  expect(screen.queryByText("25–48 of 48")).not.toBeInTheDocument();
});
