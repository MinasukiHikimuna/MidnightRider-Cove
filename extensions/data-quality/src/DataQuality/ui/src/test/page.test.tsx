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
    findTags: vi.fn(),
    listTagGroups: vi.fn(),
    runReviewAction: vi.fn(),
    runTagReviewAction: vi.fn(),
    settleReviewWrites: vi.fn().mockResolvedValue(undefined),
    getConfirmedAbsentTagsFieldStatus: vi.fn(),
    createConfirmedAbsentTagsField: vi.fn(),
    saveReviews: vi.fn(),
    resolveTagTree: vi.fn(),
    request: vi.fn(),
    readVideo: vi.fn(),
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
      startFrom: "beginning" as const,
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

function tag(id: number, groupName?: string) {
  return {
    id,
    name: `Tag ${id}`,
    description: `Description ${id}`,
    favorite: false,
    organized: false,
    aliases: [],
    tagGroupId: groupName ? 8 : null,
    tagGroupName: groupName,
    videoCount: id,
  };
}

beforeEach(() => {
  window.history.replaceState(null, "", "/data-quality?review=review");
  localStorage.removeItem("data-quality.workspace-layout.v1");
  api.loadReviews.mockReset().mockResolvedValue({
    reviews: [review],
    storageKey: "reviews",
    canWrite: true,
  });
  api.findVideos
    .mockReset()
    .mockResolvedValue({ items: [video(1), video(2)], totalCount: 2 });
  api.findTags
    .mockReset()
    .mockResolvedValue({ items: [tag(11), tag(12)], totalCount: 2 });
  api.listTagGroups.mockReset().mockResolvedValue([
    { id: 8, name: "Classification", sortOrder: 10, tagCount: 0 },
  ]);
  api.runReviewAction.mockReset().mockResolvedValue(undefined);
  api.runTagReviewAction.mockReset().mockResolvedValue(undefined);
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
  api.readVideo.mockReset().mockImplementation(async id => video(id));
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
  it("shows entity icons beside review names instead of type badges", async () => {
    const tagReview = {
      id: "tags",
      entityType: "tag" as const,
      name: "Review tags",
      description: "Classify tags",
      view: {
        filter: { page: 1, perPage: 40 },
        objectFilter: {},
        displayMode: "grid" as const,
        searchMode: "text",
      },
      actions: [
        { id: "skip", label: "Skip", effect: { mode: "SKIP" as const } },
      ],
    };
    api.loadReviews.mockResolvedValueOnce({
      reviews: [review, tagReview],
      storageKey: "reviews",
      canWrite: true,
      canWriteVideos: true,
      canWriteTags: true,
      canReadTagGroups: true,
    });

    render(<DataQualityPage onNavigate={vi.fn()} />);
    await screen.findByRole("heading", { name: "Reviewing this video" });
    await waitFor(() => expect(screen.getByRole("button", { name: "All reviews" })).toBeEnabled());
    await waitFor(() => expect(screen.getByRole("button", { name: "All reviews" })).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "All reviews" }));

    const browser = screen.getByRole("region", { name: "Reviews" });
    expect(
      within(browser).getByRole("img", { name: "Video review" }),
    ).toBeInTheDocument();
    expect(
      within(browser).getByRole("img", { name: "Tag review" }),
    ).toBeInTheDocument();
    expect(within(browser).queryByText("Videos")).not.toBeInTheDocument();
    expect(within(browser).queryByText("Tags")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Manage reviews" }));
    const manager = screen.getByRole("dialog", {
      name: "Manage Data Quality reviews",
    });
    expect(
      within(manager).getByRole("img", { name: "Video review" }),
    ).toBeInTheDocument();
    expect(
      within(manager).getByRole("img", { name: "Tag review" }),
    ).toBeInTheDocument();
    expect(within(manager).queryByText("Videos")).not.toBeInTheDocument();
    expect(within(manager).queryByText("Tags")).not.toBeInTheDocument();
  });

  it("runs a tag review with native queue behavior and group actions", async () => {
    const tagReview = {
      id: "tags",
      entityType: "tag" as const,
      name: "Group tags",
      description: "Classify ungrouped tags",
      view: {
        filter: { page: 1, perPage: 40, sort: "name", direction: "asc" },
        objectFilter: {
          tagGroupsCriterion: { value: [], modifier: "IS_NULL" },
        },
        displayMode: "grid" as const,
        searchMode: "text",
        startFrom: "beginning" as const,
      },
      actions: [
        {
          id: "assign",
          label: "Classify",
          effect: { mode: "SET_TAG_GROUP" as const, tagGroupId: 8 },
        },
      ],
    };
    window.history.replaceState(null, "", "/data-quality?review=tags");
    api.loadReviews.mockResolvedValueOnce({
      reviews: [tagReview],
      storageKey: "reviews",
      canWrite: true,
      canWriteVideos: true,
      canWriteTags: true,
      canReadTagGroups: true,
    });
    const open = vi.spyOn(window, "open").mockImplementation(() => null);

    render(<DataQualityPage onNavigate={vi.fn()} />);
    const first = await screen.findByRole("article", { name: "Tag 11" });
    expect(api.findTags).toHaveBeenCalledWith(
      tagReview,
      expect.objectContaining({ page: 1, perPage: 40 }),
      expect.any(AbortSignal),
    );
    expect(screen.getByRole("button", { name: /Classify/ })).toHaveTextContent(
      "Assign Classification",
    );

    fireEvent.click(screen.getByRole("button", { name: /Classify/ }));
    await waitFor(() =>
      expect(api.runTagReviewAction).toHaveBeenCalledWith(
        tagReview.actions[0],
        [11],
      ),
    );

    const next = screen.getByRole("article", { name: "Tag 12" });
    fireEvent.focus(next);
    fireEvent.keyDown(next, { key: "Enter" });
    expect(open).toHaveBeenCalledWith(
      "/tag/12",
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("creates tag reviews with an ungrouped queue and one-effect actions", async () => {
    window.history.replaceState(null, "", "/data-quality");
    api.loadReviews.mockResolvedValueOnce({
      reviews: [],
      storageKey: "reviews",
      canWrite: true,
      canWriteVideos: true,
      canWriteTags: true,
      canReadTagGroups: true,
    });
    render(<DataQualityPage onNavigate={vi.fn()} />);
    fireEvent.click(await screen.findByRole("button", { name: "Manage reviews" }));
    fireEvent.click(screen.getByRole("button", { name: "New review" }));
    fireEvent.change(screen.getByLabelText("Entity type"), {
      target: { value: "tag" },
    });
    fireEvent.click(screen.getByRole("tab", { name: "Queue" }));
    expect(
      screen.getByText((_, element) =>
        Boolean(
          element?.tagName === "P" &&
            element.textContent?.includes("Tag filters configured"),
        ),
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Sort")).toHaveValue("name");
    expect(screen.getByLabelText("Start from")).toHaveValue("beginning");

    fireEvent.click(screen.getByRole("tab", { name: "Actions" }));
    fireEvent.click(screen.getByRole("button", { name: "Add action" }));
    expect(screen.getByLabelText("Tag group action")).toHaveValue("SKIP");
    await screen.findByRole("option", { name: "Classification" });
    fireEvent.change(screen.getByLabelText("Tag group action"), {
      target: { value: "group:8" },
    });
    expect(screen.getByLabelText("Tag group action")).toHaveValue("group:8");
  });
  it("blocks tag-group shortcuts when tag groups cannot be resolved", async () => {
    const tagReview = {
      id: "tags",
      entityType: "tag" as const,
      name: "Group tags",
      description: "Classify tags",
      view: {
        filter: { page: 1, perPage: 40 },
        objectFilter: {},
        displayMode: "grid" as const,
        searchMode: "text",
      },
      actions: [
        {
          id: "clear",
          label: "Ungrouped",
          effect: { mode: "CLEAR_TAG_GROUP" as const },
        },
      ],
    };
    window.history.replaceState(null, "", "/data-quality?review=tags");
    api.loadReviews.mockResolvedValueOnce({
      reviews: [tagReview],
      storageKey: "reviews",
      canWrite: true,
      canWriteVideos: true,
      canWriteTags: true,
      canReadTagGroups: false,
    });

    render(<DataQualityPage onNavigate={vi.fn()} />);
    const first = await screen.findByRole("article", { name: "Tag 11" });
    expect(screen.getByRole("button", { name: /Ungrouped/ })).toBeDisabled();
    fireEvent.keyDown(first, { key: "1" });
    expect(api.runTagReviewAction).not.toHaveBeenCalled();
  });
  it("moves vertically one tag at a time in List view", async () => {
    const tagReview = {
      id: "tags",
      entityType: "tag" as const,
      name: "Review tags",
      description: "List tags",
      view: {
        filter: { page: 1, perPage: 40 },
        objectFilter: {},
        displayMode: "list" as const,
        searchMode: "text",
      },
      actions: [{ id: "skip", label: "Skip", effect: { mode: "SKIP" as const } }],
    };
    window.history.replaceState(null, "", "/data-quality?review=tags");
    api.loadReviews.mockResolvedValueOnce({
      reviews: [tagReview],
      storageKey: "reviews",
      canWrite: true,
      canWriteTags: true,
      canReadTagGroups: true,
    });

    render(<DataQualityPage onNavigate={vi.fn()} />);
    const first = await screen.findByRole("article", { name: "Tag 11" });
    await waitFor(() => expect(first).toHaveFocus());
    fireEvent.keyDown(first, { key: "ArrowDown" });
    await waitFor(() =>
      expect(screen.getByRole("article", { name: "Tag 12" })).toHaveFocus(),
    );
  });
  it("locks the entity type when editing or duplicating a saved review", async () => {
    const tagReview = {
      id: "tags",
      entityType: "tag" as const,
      name: "Review tags",
      description: "Classify tags",
      view: {
        filter: { page: 1, perPage: 40 },
        objectFilter: {},
        displayMode: "grid" as const,
        searchMode: "text",
      },
      actions: [{ id: "skip", label: "Skip", effect: { mode: "SKIP" as const } }],
    };
    window.history.replaceState(null, "", "/data-quality?review=tags");
    api.loadReviews.mockResolvedValueOnce({
      reviews: [tagReview],
      storageKey: "reviews",
      canWrite: true,
      canWriteTags: true,
      canReadTagGroups: true,
    });

    render(<DataQualityPage onNavigate={vi.fn()} />);
    fireEvent.click(await screen.findByRole("button", { name: "Edit review" }));
    expect(screen.getByLabelText("Entity type")).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    fireEvent.click(screen.getByRole("button", { name: "Manage reviews" }));
    const manager = screen.getByRole("dialog", {
      name: "Manage Data Quality reviews",
    });
    fireEvent.click(within(manager).getByRole("button", { name: "Duplicate" }));
    expect(screen.getByLabelText("Entity type")).toBeDisabled();
    expect(screen.getByLabelText("Entity type")).toHaveValue("tag");
  });

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

  it("does not reserve a notice row for healthy account storage", async () => {
    const { container } = render(<DataQualityPage onNavigate={vi.fn()} />);

    await screen.findByRole("heading", { name: "Reviewing this video" });
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

    await screen.findByRole("heading", { name: "Reviewing this video" });
    const heading = screen.getByRole("heading", { name: review.name });
    const manage = screen.getByRole("button", { name: "Manage reviews" });

    expect(heading.closest("header")).toContainElement(manage);
    expect(manage).toContainHTML("svg");
    expect(manage).toHaveTextContent("");
    expect(
      screen.queryByText(
        "A focused queue for previewing videos and applying saved review actions.",
      ),
    ).not.toBeInTheDocument();
  });

  it("puts the active review name and description in the page header", async () => {
    render(<DataQualityPage onNavigate={vi.fn()} />);

    await screen.findByRole("heading", { name: "Reviewing this video" });
    const heading = screen.getByRole("heading", { name: review.name });
    const header = heading.closest("header");
    const edit = screen.getByRole("button", { name: "Edit review" });

    expect(header).toContainElement(screen.getByText(review.description));
    expect(header).toContainElement(
      screen.getByRole("button", { name: "All reviews" }),
    );
    expect(header).toContainElement(edit);
    expect(edit).toContainHTML("svg");
    expect(edit).toHaveTextContent("");
    expect(screen.queryByLabelText("Review")).not.toBeInTheDocument();
    expect(
      screen.getByRole("toolbar", { name: "Video list controls" }),
    ).toBeInTheDocument();
  });

  it("does not render a generic header while a requested review is loading", async () => {
    let finish!: (value: Awaited<ReturnType<typeof api.loadReviews>>) => void;
    api.loadReviews.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    render(<DataQualityPage onNavigate={vi.fn()} />);

    expect(
      screen.queryByRole("heading", { name: "Data Quality" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Loading reviews…")).toBeInTheDocument();

    await act(async () =>
      finish({ reviews: [review], storageKey: "reviews", canWrite: true }),
    );
    expect(
      await screen.findByRole("heading", { name: review.name }),
    ).toBeInTheDocument();
  });

  it("lists available reviews with their matching video counts", async () => {
    window.history.replaceState(null, "", "/data-quality");
    const other = {
      ...review,
      id: "other",
      name: "Other",
      description: "Another queue",
    };
    api.loadReviews.mockResolvedValue({
      reviews: [review, other],
      storageKey: "reviews",
      canWrite: true,
    });
    api.findVideos.mockImplementation(async (target, targetFilter) => ({
      items: Number(targetFilter.perPage) === 1 ? [] : [video(1)],
      totalCount: target.id === review.id ? 2 : 17,
    }));
    render(<DataQualityPage onNavigate={vi.fn()} />);

    const browser = await screen.findByRole("region", { name: "Reviews" });
    expect(await within(browser).findByText("2")).toHaveAccessibleName(
      "2 matching videos",
    );
    expect(await within(browser).findByText("17")).toHaveAccessibleName(
      "17 matching videos",
    );
    expect(within(browser).getByRole("status")).toHaveTextContent(
      "Review counts loaded.",
    );
    expect(api.findVideos).toHaveBeenCalledWith(
      review,
      expect.objectContaining({ page: 1, perPage: 1 }),
      expect.anything(),
    );

    const list = browser.querySelector(".dq-review-browser-list")!;
    expect(list.querySelectorAll("button")[0]).toHaveTextContent("Other");
    fireEvent.click(within(browser).getByRole("button", { name: "Ascending" }));
    expect(list.querySelectorAll("button")[0]).toHaveTextContent("Review");
    fireEvent.click(within(browser).getByRole("button", { name: "Descending" }));
    fireEvent.change(within(browser).getByLabelText("Sort reviews by"), {
      target: { value: "count" },
    });
    expect(list.querySelectorAll("button")[0]).toHaveTextContent("Review");
    fireEvent.click(within(browser).getByRole("button", { name: "Ascending" }));
    expect(list.querySelectorAll("button")[0]).toHaveTextContent("Other");

    fireEvent.click(within(browser).getByRole("button", { name: /Other/ }));
    expect(
      await screen.findByRole("heading", { name: "Other" }),
    ).toBeInTheDocument();

    await waitFor(() => expect(screen.getByRole("button", { name: "All reviews" })).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "All reviews" }));
    const reviewsHeading = await screen.findByRole("heading", {
      name: "Reviews",
    });
    await waitFor(() => expect(reviewsHeading).toHaveFocus());
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
it("disables competing edits while an import file is being read", async () => {
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", { name: "Reviewing this video" });
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
  await screen.findByRole("heading", { name: "Reviewing this video" });
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
  await screen.findByRole("heading", { name: "Reviewing this video" });
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
  await screen.findByRole("heading", { name: "Reviewing this video" });
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
  await screen.findByRole("heading", { name: "Reviewing this video" });
  fireEvent.click(screen.getByRole("button", { name: "Edit review" }));
  fireEvent.change(screen.getByLabelText("Description"), {
    target: { value: "Check metadata" },
  });
  expect(screen.queryByRole("dialog", { name: "Manage Data Quality reviews" })).not.toBeInTheDocument();
  expect(screen.queryByRole("tab", { name: "Queue" })).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Review direction"), { target: { value: "end" } });
  fireEvent.click(screen.getByRole("button", { name: "Filters" }));
  fireEvent.click(screen.getByRole("button", { name: "Apply filters" }));
  await waitFor(() => expect(screen.getByRole("button", { name: "Save review" })).toBeEnabled());
  fireEvent.click(screen.getByRole("tab", { name: "Actions" }));
  fireEvent.click(screen.getByRole("tab", { name: "Review" }));
  expect(screen.getByLabelText("Description")).toHaveValue("Check metadata");
  fireEvent.click(screen.getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalled());
  expect(api.saveReviews.mock.calls[0][1][0]).toMatchObject({
    description: "Check metadata",
    view: {
      objectFilter: { organized: true },
      displayMode: "grid",
      startFrom: "end",
    },
  });
});

it("reopens the same media rule from management after cancel without clearing its query", async () => {
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  const original = window.location.search;
  for (let i = 0; i < 2; i++) {
    fireEvent.click(screen.getByRole("button", { name: "Manage reviews" }));
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: /^Edit$/ }));
    await screen.findByRole("region", { name: "Edit review rule" });
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await screen.findByRole("heading", { name: "Reviewing this video" });
    expect(window.location.search).toBe(original);
  }
});

it("creates media review details then configures the rule in the workspace", async () => {
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", {name: "Reviewing this video"});
  fireEvent.click(screen.getByRole("button", {name: "Manage reviews"}));
  fireEvent.click(screen.getByRole("button", {name: "New review"}));
  expect(screen.queryByRole("tab", {name: "Queue"})).not.toBeInTheDocument();
  expect(screen.queryByRole("tab", {name: "Actions"})).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Review name"), {target: {value: "New media review"}});
  fireEvent.click(screen.getByRole("button", {name: "Create & configure"}));
  await screen.findByRole("region", {name: "Edit review rule"});
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByLabelText("Review name")).toHaveValue("New media review");
  expect(screen.getByRole("tab", {name: "Actions"})).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", {name: "Cancel"}));
  await screen.findByRole("heading", {name: "Reviewing this video"});
});
