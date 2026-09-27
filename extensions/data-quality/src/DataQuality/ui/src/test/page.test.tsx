import {
  act,
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DataQualityPage, objectFiltersEqual } from "../index";
import { presentedVideo } from "../TagPresentation";
import { testVideoControls } from "@cove/runtime/components";
import {
  activeTestKeys,
  testFilterControls,
  testKeyboardConflicts,
} from "./runtime-components";

const { api, review } = vi.hoisted(() => ({
  api: {
    loadReviews: vi.fn(),
    loadProgress: vi.fn(),
    saveProgress: vi.fn(),
    findMedia: vi.fn(),
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
  api.findMedia
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

/** In an open review (single-item workspace or grid), review management sits in the header's More menu. */
async function openManagerFromWorkspace() {
  const more = screen.getByRole("button", { name: "More review options" });
  await waitFor(() => expect(more).toBeEnabled());
  fireEvent.click(more);
  fireEvent.click(screen.getByRole("menuitem", { name: "Manage reviews" }));
}

/** Edit review in the header opens the editor drawer beside the queue. */
async function openEditor() {
  const edit = screen.getByRole("button", { name: "Edit review" });
  await waitFor(() => expect(edit).toBeEnabled());
  // A click focuses the button in the browser; the drawer hands focus back to it when it closes.
  edit.focus();
  fireEvent.click(edit);
  return screen.findByRole("dialog", { name: "Edit review" });
}

/** The header's Single | Grid switch, for this visit. */
async function switchLayout(mode: "Single" | "Grid") {
  const button = within(screen.getByRole("group", { name: "Review layout" })).getByRole(
    "button",
    { name: mode },
  );
  await waitFor(() => expect(button).toBeEnabled());
  fireEvent.click(button);
}

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
    // The action bar names the target and says what each action does.
    const bar = screen.getByRole("region", { name: "Actions" });
    expect(within(bar).getByText("Applies to the focused tag")).toBeInTheDocument();
    expect(within(bar).getByText("Arrows move · Space selects · Enter opens")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "q Classify" })).toHaveAccessibleDescription(
        "Assign Classification",
      ),
    );

    fireEvent.click(screen.getByRole("button", { name: "q Classify" }));
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

  it("creates tag reviews with an ungrouped queue, then configures them in the grid's drawer", async () => {
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
    // New reviews ask only for their kind, name and description first.
    expect(screen.queryByRole("tab", { name: "Actions" })).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Entity type"), {
      target: { value: "tag" },
    });
    fireEvent.change(screen.getByLabelText("Review name"), {
      target: { value: "Group tags" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create & configure" }));
    await waitFor(() => expect(api.saveReviews).toHaveBeenCalled());
    const created = api.saveReviews.mock.calls[0][1][0];
    expect(created).toMatchObject({
      entityType: "tag",
      name: "Group tags",
      actions: [],
      view: {
        filter: { sort: "name", direction: "asc" },
        objectFilter: { tagGroupsCriterion: { value: [], modifier: "IS_NULL" } },
        startFrom: "beginning",
      },
    });
    // The new review opens in the card grid, with its editor drawer.
    const drawer = await screen.findByRole("dialog", { name: "Edit review" });
    expect(api.findTags).toHaveBeenCalledWith(
      expect.objectContaining({ id: created.id }),
      expect.anything(),
      expect.anything(),
    );
    expect(screen.queryByRole("dialog", { name: "Manage Data Quality reviews" })).not.toBeInTheDocument();
    expect(within(drawer).getByLabelText("Entity type")).toBeDisabled();
    fireEvent.click(within(drawer).getByRole("tab", { name: "Actions" }));
    fireEvent.click(within(drawer).getByRole("button", { name: "Add action" }));
    expect(within(drawer).getByLabelText("Tag group action")).toHaveValue("SKIP");
    await within(drawer).findByRole("option", { name: "Classification" });
    fireEvent.change(within(drawer).getByLabelText("Tag group action"), {
      target: { value: "group:8" },
    });
    expect(within(drawer).getByLabelText("Tag group action")).toHaveValue("group:8");
  });
  it("restores tag card focus after mouse selection so action shortcuts work", async () => {
    const tagReview = {
      id: "tags",
      entityType: "tag" as const,
      name: "Group tags",
      description: "Classify tags",
      view: {
        filter: { page: 1, perPage: 40 },
        objectFilter: {},
        displayMode: "list" as const,
        searchMode: "text",
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

    render(<DataQualityPage onNavigate={vi.fn()} />);
    const first = await screen.findByRole("article", { name: "Tag 11" });
    const selection = screen.getByRole("button", { name: "Select Tag 11" });
    selection.focus();
    expect(selection).toHaveFocus();
    fireEvent.click(selection);

    await waitFor(() => expect(first).toHaveFocus());
    fireEvent.keyDown(first, { key: "q" });

    await waitFor(() =>
      expect(api.runTagReviewAction).toHaveBeenCalledWith(
        tagReview.actions[0],
        [11],
      ),
    );
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
    fireEvent.keyDown(first, { key: "q" });
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
  it("keeps arrow keys navigating the grid after focus leaves the cards", async () => {
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

    // Clicking blank page space leaves focus on the body.
    first.blur();
    expect(document.body).toHaveFocus();
    fireEvent.keyDown(document.body, { key: "ArrowDown" });
    await waitFor(() =>
      expect(screen.getByRole("article", { name: "Tag 12" })).toHaveFocus(),
    );

    // Buttons do not use arrow keys, so the grid keeps them.
    const editReview = screen.getByRole("button", { name: "Edit review" });
    editReview.focus();
    fireEvent.keyDown(editReview, { key: "ArrowUp" });
    await waitFor(() =>
      expect(screen.getByRole("article", { name: "Tag 11" })).toHaveFocus(),
    );

    // Text inputs own their arrow keys.
    const search = screen.getByRole("textbox", { name: "Search list" });
    search.focus();
    fireEvent.keyDown(search, { key: "ArrowDown" });
    await act(async () => {});
    expect(search).toHaveFocus();
    expect(first).toHaveAttribute("aria-current", "true");

    // Host chrome outside the page keeps its arrow keys.
    const outside = document.createElement("button");
    outside.textContent = "Outside";
    document.body.appendChild(outside);
    outside.focus();
    fireEvent.keyDown(outside, { key: "ArrowDown" });
    await act(async () => {});
    expect(outside).toHaveFocus();
    expect(first).toHaveAttribute("aria-current", "true");
    outside.remove();
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
    const edit = await screen.findByRole("button", { name: "Edit review" });
    await waitFor(() => expect(edit).toBeEnabled());
    fireEvent.click(edit);
    expect(screen.getByLabelText("Entity type")).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await openManagerFromWorkspace();
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

  it("places review management in the header's More menu", async () => {
    render(<DataQualityPage onNavigate={vi.fn()} />);

    await screen.findByRole("heading", { name: "Reviewing this video" });
    const heading = screen.getByRole("heading", { name: review.name });
    const more = screen.getByRole("button", { name: "More review options" });

    expect(heading.closest("header")).toContainElement(more);
    expect(more).toContainHTML("svg");
    expect(more).toHaveTextContent("");
    await openManagerFromWorkspace();
    expect(
      screen.getByRole("dialog", { name: "Manage Data Quality reviews" }),
    ).toBeInTheDocument();
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
    api.findMedia.mockImplementation(async (target, targetFilter) => ({
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
    expect(api.findMedia).toHaveBeenCalledWith(
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
  await openManagerFromWorkspace();
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

it("duplicates and reorders actions with fixed positional shortcuts", async () => {
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  const drawer = await openEditor();
  fireEvent.click(within(drawer).getByRole("tab", { name: "Actions" }));
  fireEvent.click(within(drawer).getByRole("button", { name: "Duplicate Apply" }));
  // The copy follows its original, open with its label ready to edit.
  expect(within(drawer).getByRole("textbox", { name: "Button label" })).toHaveValue("Apply copy");
  expect(within(drawer).getByRole("textbox", { name: "Button label" })).toHaveFocus();
  fireEvent.keyDown(within(drawer).getByRole("button", { name: "Reorder Apply copy" }), {
    key: "ArrowUp",
    altKey: true,
  });
  fireEvent.click(within(drawer).getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalled());
  const saved = api.saveReviews.mock.calls[0][1][0];
  expect(saved.actions.map((action: { label: string }) => action.label)).toEqual([
    "Apply copy",
    "Apply",
  ]);
  expect(saved.actions[1].id).toBe("apply");
  expect(saved.actions[0].id).not.toBe("apply");
  expect(saved.actions[0].steps).toEqual(review.actions[0].steps);
});
function mockRoomTags() {
  api.request.mockImplementation(async (path: string) => {
    if (path === "/api/tags/find")
      return {
        items: [
          { id: 41, name: "Kitchen", videoCount: 5 },
          { id: 42, name: "Bedroom", videoCount: 9 },
        ],
        totalCount: 2,
      };
    if (path === "/api/tags/40") return { id: 40, name: "Rooms" };
    return { available: true };
  });
}
it("clears the added-actions confirmation once the actions change again", async () => {
  mockRoomTags();
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  const drawer = await openEditor();
  fireEvent.click(within(drawer).getByRole("tab", { name: "Actions" }));
  fireEvent.click(within(drawer).getByRole("button", { name: "Add from parent tags…" }));
  fireEvent.change(within(drawer).getByPlaceholderText("Search parent tags..."), {
    target: { value: "40" },
  });
  await within(drawer).findByRole("group", { name: "Rooms" });
  fireEvent.click(within(drawer).getByRole("button", { name: "Add 2 actions" }));
  expect(within(drawer).getByText("Added 2 actions at the end.")).toBeInTheDocument();
  fireEvent.click(within(drawer).getByRole("button", { name: "Delete Kitchen" }));
  expect(within(drawer).queryByText("Added 2 actions at the end.")).not.toBeInTheDocument();
});
it("clears the confirmation when the generator opens again and points the toggle at it", async () => {
  mockRoomTags();
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  const drawer = await openEditor();
  fireEvent.click(within(drawer).getByRole("tab", { name: "Actions" }));
  const toggle = within(drawer).getByRole("button", { name: "Add from parent tags…" });
  expect(toggle).not.toHaveAttribute("aria-controls");
  fireEvent.click(toggle);
  const panel = within(drawer).getByRole("group", { name: "Add actions from parent tags" });
  expect(toggle).toHaveAttribute("aria-controls", panel.id);
  fireEvent.change(within(drawer).getByPlaceholderText("Search parent tags..."), {
    target: { value: "40" },
  });
  await within(drawer).findByRole("group", { name: "Rooms" });
  fireEvent.click(within(drawer).getByRole("button", { name: "Add 2 actions" }));
  expect(within(drawer).getByText("Added 2 actions at the end.")).toBeInTheDocument();
  fireEvent.click(toggle);
  expect(within(drawer).queryByText("Added 2 actions at the end.")).not.toBeInTheDocument();
});
it("adds actions generated from a parent tag's children after the existing ones", async () => {
  mockRoomTags();
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  const drawer = await openEditor();
  fireEvent.click(within(drawer).getByRole("tab", { name: "Actions" }));
  const open = within(drawer).getByRole("button", { name: "Add from parent tags…" });
  expect(open).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(open);
  expect(open).toHaveAttribute("aria-expanded", "true");
  fireEvent.change(within(drawer).getByPlaceholderText("Search parent tags..."), {
    target: { value: "40" },
  });
  const rooms = await within(drawer).findByRole("group", { name: "Rooms" });
  fireEvent.click(
    within(rooms).getByRole("checkbox", { name: /Only one per video/ }),
  );
  fireEvent.click(within(drawer).getByRole("button", { name: "Add 2 actions" }));
  expect(within(drawer).getByText("Added 2 actions at the end.")).toBeInTheDocument();
  expect(
    within(drawer).queryByRole("group", { name: "Add actions from parent tags" }),
  ).not.toBeInTheDocument();
  // The new actions are compact rows after the existing one, on the next keys.
  expect(within(drawer).getByRole("button", { name: "Expand Bedroom" })).toBeInTheDocument();
  expect(within(drawer).getByRole("tab", { name: "Actions" })).toBeInTheDocument();
  fireEvent.click(within(drawer).getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalled());
  const onlyOne = (id: number) => [
    { mode: "ADD", tagIds: [id] },
    { mode: "REMOVE_TREE", tagIds: [40] },
  ];
  expect(api.saveReviews.mock.calls[0][1][0].actions).toEqual([
    review.actions[0],
    { id: expect.any(String), label: "Bedroom", steps: onlyOne(42) },
    { id: expect.any(String), label: "Kitchen", steps: onlyOne(41) },
  ]);
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
  const drawer = await openEditor();
  fireEvent.click(within(drawer).getByRole("tab", { name: "Actions" }));
  fireEvent.click(within(drawer).getByRole("button", { name: "Expand Apply" }));
  fireEvent.keyDown(within(drawer).getByRole("button", { name: "Reorder step 1" }), {
    key: "ArrowDown",
    altKey: true,
  });
  fireEvent.click(within(drawer).getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalled());
  expect(api.saveReviews.mock.calls[0][1][0].actions[0].steps).toEqual([
    { mode: "REMOVE", tagIds: [4] },
    { mode: "ADD", tagIds: [3] },
  ]);
});

it("edits and saves all tag assessment modes", async () => {
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  const drawer = await openEditor();
  fireEvent.click(within(drawer).getByRole("tab", { name: "Actions" }));
  fireEvent.click(within(drawer).getByRole("button", { name: "Expand Apply" }));
  const operation = within(drawer).getByLabelText("Step 1 operation");
  expect(operation).toHaveTextContent("Mark present");
  expect(operation).toHaveTextContent("Mark absent");
  expect(operation).toHaveTextContent("Clear absence");
  fireEvent.change(operation, { target: { value: "MARK_ABSENT" } });
  fireEvent.click(within(drawer).getByRole("button", { name: "Save review" }));
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
    await openManagerFromWorkspace();
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: /^Edit$/ }));
    await screen.findByRole("dialog", { name: "Edit review" });
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await screen.findByRole("heading", { name: "Reviewing this video" });
    expect(window.location.search).toBe(original);
  }
});

it("creates media review details then configures the rule in the workspace", async () => {
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", {name: "Reviewing this video"});
  await openManagerFromWorkspace();
  fireEvent.click(screen.getByRole("button", {name: "New review"}));
  expect(screen.queryByRole("tab", {name: "Queue"})).not.toBeInTheDocument();
  expect(screen.queryByRole("tab", {name: "Actions"})).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Review name"), {target: {value: "New media review"}});
  fireEvent.click(screen.getByRole("button", {name: "Create & configure"}));
  const drawer = await screen.findByRole("dialog", {name: "Edit review"});
  expect(screen.queryByRole("dialog", {name: "Manage Data Quality reviews"})).not.toBeInTheDocument();
  expect(within(drawer).getByLabelText("Review name")).toHaveValue("New media review");
  expect(within(drawer).getByRole("tab", {name: "Actions"})).toBeInTheDocument();
  fireEvent.click(within(drawer).getByRole("button", {name: "Cancel"}));
  await screen.findByRole("heading", {name: "Reviewing this video"});
  expect(screen.queryByRole("dialog", {name: "Edit review"})).not.toBeInTheDocument();
});

it("restores multi-video cards, selection actions, and the single-video layout switch", async () => {
  api.loadReviews.mockResolvedValueOnce({ reviews: [{ ...review, view: { ...review.view, reviewMode: "multiple" } }], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  const first = await screen.findByRole("article", { name: "Video 1" });
  expect(screen.getByRole("article", { name: "Video 2" })).toBeInTheDocument();
  fireEvent.click(within(first).getByRole("button", { name: "Select Video 1" }));
  fireEvent.click(screen.getByRole("button", { name: "Select Video 2" }));
  fireEvent.keyDown(screen.getByRole("article", { name: "Video 2, selected" }), { key: "q" });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(1));
  expect(api.runReviewAction.mock.calls[0][2]).toEqual([1, 2]);
  // The grid's header switches this visit to the single-item workspace.
  expect(screen.getByRole("button", { name: "Grid" })).toHaveAttribute("aria-pressed", "true");
  await switchLayout("Single");
  await screen.findByRole("heading", { name: "Reviewing this video" });
  // The workspace header switches this visit back to the grid.
  const grid = screen.getByRole("button", { name: "Grid" });
  expect(screen.getByRole("button", { name: "Single" })).toHaveAttribute("aria-pressed", "true");
  await waitFor(() => expect(grid).toBeEnabled());
  fireEvent.click(grid);
  await screen.findByRole("article", { name: "Video 1" });
});

it("shows configured descendant tags on each card independently of the queue filter", async () => {
  const configured = { ...review, view: { ...review.view, reviewMode: "multiple", objectFilter: { tagsCriterion: { value: [999], modifier: "INCLUDES" } } }, presentation: { annotations: ["tags"], annotationParents: [100] } };
  api.loadReviews.mockResolvedValueOnce({ reviews: [configured], storageKey: "reviews", canWrite: true });
  api.resolveTagTree.mockResolvedValue([100, 30]);
  api.findMedia.mockResolvedValue({ items: [{ ...video(1), tags: [{ id: 100, name: "Parent" }, { id: 30, name: "Matching child" }, { id: 999, name: "Filter tag" }] }, { ...video(2), tags: [] }], totalCount: 2 });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  const first = await screen.findByRole("article", { name: "Video 1" });
  const bins = within(first).getByRole("region", { name: "Card tag bins" });
  await within(bins).findByText("Matching child");
  expect(within(bins).queryByText("Parent")).not.toBeInTheDocument();
  expect(within(bins).queryByText("Filter tag")).not.toBeInTheDocument();
  expect(api.resolveTagTree).toHaveBeenCalledWith([100]);
  expect(api.findMedia.mock.calls.at(-1)?.[0].view.objectFilter).toEqual(configured.view.objectFilter);
});

it("saves card parent tags and the preferred multi-video layout from the rule editor", async () => {
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  const drawer = await openEditor();
  fireEvent.click(within(drawer).getByRole("tab", { name: "Appearance" }));
  expect(within(drawer).getByRole("radio", { name: "Single video" })).toBeChecked();
  fireEvent.click(within(drawer).getByRole("radio", { name: "Grid" }));
  // Tags on cards appears once cards show tags.
  expect(within(drawer).queryByRole("textbox", { name: "Add a parent tag for card tags" })).not.toBeInTheDocument();
  fireEvent.click(within(drawer).getByRole("checkbox", { name: "Tags" }));
  fireEvent.change(within(drawer).getByRole("textbox", { name: "Add a parent tag for card tags" }), { target: { value: "100" } });
  fireEvent.click(within(drawer).getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalled());
  const saved = api.saveReviews.mock.calls.at(-1)?.[1][0];
  expect(saved.view.reviewMode).toBe("multiple");
  expect(saved.presentation.annotationParents).toEqual([100]);
  expect(saved.presentation.annotations).toContain("tags");
  expect(saved.view.objectFilter).toEqual({});
  await screen.findByRole("article", { name: "Video 1" });
});

it("preserves temporary queue criteria when switching video layouts", async () => {
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  fireEvent.click(screen.getByRole("button", { name: "Filters" }));
  fireEvent.click(screen.getByRole("button", { name: "Apply filters" }));
  const grid = screen.getByRole("button", { name: "Grid" });
  await waitFor(() => expect(grid).toBeEnabled());
  fireEvent.click(grid);
  await screen.findByRole("article", { name: "Video 1" });
  expect(api.findMedia.mock.calls.at(-1)?.[0].view.objectFilter).toEqual({ organized: true });
  await switchLayout("Single");
  await screen.findByRole("heading", { name: "Reviewing this video" });
  expect(api.findMedia.mock.calls.at(-1)?.[0].view.objectFilter).toEqual({ organized: true });
});

it("edits an existing multi-video rule without losing its card presentation", async () => {
  api.loadReviews.mockResolvedValueOnce({ reviews: [{ ...review, view: { ...review.view, reviewMode: "multiple" }, presentation: { annotations: ["tags"], annotationParents: [100] } }], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  const drawer = await openEditor();
  fireEvent.click(within(drawer).getByRole("tab", { name: "Appearance" }));
  expect(within(drawer).getByRole("radio", { name: "Grid" })).toBeChecked();
  const parents = within(drawer).getByRole("textbox", { name: "Add a parent tag for card tags" });
  expect(parents).toHaveValue("100");
  fireEvent.change(parents, { target: { value: "101" } });
  fireEvent.click(within(drawer).getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(api.saveReviews.mock.calls.at(-1)?.[1][0].presentation.annotationParents).toEqual([101]);
  await screen.findByRole("article", { name: "Video 1" });
});

it("applies saved layout preferences while URL criteria remain active", async () => {
  window.history.replaceState(null, "", "/data-quality?review=review&page=1&perPage=24&filters=%7B%22organized%22%3Atrue%7D");
  api.loadReviews.mockResolvedValueOnce({ reviews: [{ ...review, view: { ...review.view, reviewMode: "multiple" } }], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  expect(screen.getByRole("toolbar", { name: "Video list controls" })).toHaveAttribute("data-custom-field-entity-type", "video");
  const drawer = await openEditor();
  fireEvent.click(within(drawer).getByRole("tab", { name: "Appearance" }));
  fireEvent.click(within(drawer).getByRole("radio", { name: "Single video" }));
  fireEvent.click(within(drawer).getByRole("button", { name: "Save review" }));
  await screen.findByRole("heading", { name: "Reviewing this video" });
  expect(screen.getByRole("button", { name: "Single" })).toHaveAttribute("aria-pressed", "true");
  expect(new URLSearchParams(window.location.search).get("filters")).toBe('{"organized":true}');
});

it("keeps newly saved queue criteria when the editor switches to single video", async () => {
  window.history.replaceState(null, "", "/data-quality?review=review&page=1&perPage=24&filters=%7B%22organized%22%3Afalse%7D");
  api.loadReviews.mockResolvedValueOnce({ reviews: [{ ...review, view: { ...review.view, reviewMode: "multiple" } }], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  const drawer = await openEditor();
  // The header's toolbar stays live beside the drawer: its criteria are the draft's.
  fireEvent.click(screen.getByRole("button", { name: /^Filters/ }));
  fireEvent.click(screen.getByRole("button", { name: "Apply filters" }));
  await waitFor(() => expect(api.findMedia.mock.calls.at(-1)?.[0].view.objectFilter).toEqual({ organized: true }));
  fireEvent.click(within(drawer).getByRole("tab", { name: "Appearance" }));
  fireEvent.click(within(drawer).getByRole("radio", { name: "Single video" }));
  const save = within(drawer).getByRole("button", { name: "Save review" });
  await waitFor(() => expect(save).toBeEnabled());
  fireEvent.click(save);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  expect(api.saveReviews.mock.calls.at(-1)?.[1][0].view.objectFilter).toEqual({ organized: true });
  expect(api.findMedia.mock.calls.at(-1)?.[0].view.objectFilter).toEqual({ organized: true });
  expect(new URLSearchParams(window.location.search).get("filters")).toBe('{"organized":true}');
  expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument();
});

it("restores the saved multiple layout after editing from a temporary single layout", async () => {
  api.loadReviews.mockResolvedValueOnce({ reviews: [{ ...review, view: { ...review.view, reviewMode: "multiple" } }], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  await switchLayout("Single");
  await screen.findByRole("heading", { name: "Reviewing this video" });
  await waitFor(() => expect(screen.getByRole("button", { name: "Edit review" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Edit review" }));
  fireEvent.change(screen.getByLabelText("Description"), { target: { value: "Updated description" } });
  fireEvent.click(screen.getByRole("button", { name: "Save review" }));
  await screen.findByRole("article", { name: "Video 1" });
  expect(screen.getByRole("button", { name: "Grid" })).toHaveAttribute("aria-pressed", "true");
});

it("reloads the multi-video queue when browser navigation changes the same review query", async () => {
  api.loadReviews.mockResolvedValueOnce({ reviews: [{ ...review, view: { ...review.view, reviewMode: "multiple" } }], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  api.findMedia.mockResolvedValue({ items: [video(3)], totalCount: 1 });
  await act(async () => {
    window.history.pushState(null, "", "/data-quality?review=review&page=1&perPage=24&filters=%7B%22organized%22%3Atrue%7D");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await screen.findByRole("article", { name: "Video 3" });
  expect(screen.queryByRole("article", { name: "Video 1" })).not.toBeInTheDocument();
  expect(api.findMedia.mock.calls.at(-1)?.[0].view.objectFilter).toEqual({ organized: true });
});

it("restores saved video criteria on browser navigation to a bare review URL", async () => {
  window.history.replaceState(null, "", "/data-quality?review=review&page=1&perPage=24&filters=%7B%22organized%22%3Atrue%7D");
  api.loadReviews.mockResolvedValueOnce({ reviews: [{ ...review, view: { ...review.view, reviewMode: "multiple" } }], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  await act(async () => {
    window.history.pushState(null, "", "/data-quality?review=review");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await waitFor(() => expect(api.findMedia.mock.calls.at(-1)?.[0].view.objectFilter).toEqual({}));
});

it("persists multi-video preferences after reopening the canonical review URL", async () => {
  window.history.replaceState(null, "", "/data-quality?review=review&q=&page=1&perPage=24&sort=date&direction=desc&filters=%7B%7D&searchMode=text&startFrom=beginning");
  api.loadReviews.mockResolvedValueOnce({ reviews: [{ ...review, view: { ...review.view, reviewMode: "multiple" } }], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  fireEvent.click(screen.getByRole("button", { name: "Wall" }));
  await waitFor(() => expect(api.saveProgress).toHaveBeenCalled(), { timeout: 2000 });
  expect(api.saveProgress.mock.calls.at(-1)?.[2].displayMode).toBe("wall");
});

it("defers browser query changes until a pending multi-video write settles", async () => {
  let finish!: () => void;
  api.runReviewAction.mockImplementationOnce(() => new Promise<void>(resolve => { finish = resolve; }));
  api.loadReviews.mockResolvedValueOnce({ reviews: [{ ...review, view: { ...review.view, reviewMode: "multiple" } }], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  const first = await screen.findByRole("article", { name: "Video 1" });
  fireEvent.keyDown(first, { key: "q" });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(1));
  const before = api.findMedia.mock.calls.length;
  await act(async () => {
    window.history.pushState(null, "", "/data-quality?review=review&page=1&perPage=24&filters=%7B%22organized%22%3Atrue%7D");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  expect(api.findMedia).toHaveBeenCalledTimes(before);
  expect(screen.getByRole("button", { name: "Single" })).toBeDisabled();
  await act(async () => finish());
  await waitFor(() => expect(api.findMedia.mock.calls.at(-1)?.[0].view.objectFilter).toEqual({ organized: true }));
  expect(new URLSearchParams(window.location.search).get("filters")).toBe('{"organized":true}');
});

it("honors URL traversal direction independently of the saved multi-video direction", async () => {
  window.history.replaceState(null, "", "/data-quality?review=review&q=&page=1&perPage=24&sort=date&direction=desc&filters=%7B%7D&searchMode=text&startFrom=end");
  api.loadReviews.mockResolvedValueOnce({ reviews: [{ ...review, view: { ...review.view, reviewMode: "multiple", startFrom: "beginning" } }], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  expect(api.findMedia.mock.calls.at(-1)?.[0].view.startFrom).toBe("end");
  expect(new URLSearchParams(window.location.search).get("startFrom")).toBe("end");
});

it("requires an explicit defaults reset before loading a malformed multi-video query", async () => {
  window.history.replaceState(null, "", "/data-quality?review=review&filters=invalid");
  api.loadReviews.mockResolvedValueOnce({ reviews: [{ ...review, view: { ...review.view, reviewMode: "multiple" } }], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  const error = await screen.findByRole("alert");
  expect(screen.queryByRole("article")).not.toBeInTheDocument();
  expect(api.findMedia).not.toHaveBeenCalled();
  fireEvent.click(within(error).getByRole("button", { name: "Reset to review defaults" }));
  await screen.findByRole("article", { name: "Video 1" });
  expect(new URLSearchParams(window.location.search).get("filters")).toBe("{}");
});

it("resets an invalid URL to the last page when the saved review starts at the end", async () => {
  window.history.replaceState(null, "", "/data-quality?review=review&filters=invalid");
  api.loadReviews.mockResolvedValueOnce({ reviews: [{ ...review, view: { ...review.view, reviewMode: "multiple", startFrom: "end" } }], storageKey: "reviews", canWrite: true });
  api.findMedia.mockResolvedValue({ items: [video(1)], totalCount: 48 });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  const error = await screen.findByRole("alert");
  fireEvent.click(within(error).getByRole("button", { name: "Reset to review defaults" }));
  await screen.findByRole("article", { name: "Video 1" });
  expect(api.findMedia.mock.calls.at(-1)?.[1].page).toBe(2);
  // The URL follows in an effect after the page renders.
  await waitFor(() =>
    expect(new URLSearchParams(window.location.search).get("page")).toBe("2"),
  );
});

it("selects and clears every shown video from the action bar", async () => {
  api.loadReviews.mockResolvedValueOnce({ reviews: [{ ...review, view: { ...review.view, reviewMode: "multiple" } }], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  expect(screen.queryByRole("article", { name: "Video 1, selected" })).not.toBeInTheDocument();
  const bar = within(screen.getByRole("region", { name: "Actions" }));
  expect(bar.getByText("Applies to the focused video")).toBeInTheDocument();
  expect(bar.getByText("Arrows move · Space selects · Enter previews")).toBeInTheDocument();
  const selectAll = bar.getByRole("button", { name: "Select all" });
  const clear = bar.getByRole("button", { name: "Clear" });
  expect(clear).toBeDisabled();
  expect(clear).toHaveAttribute("aria-keyshortcuts", "Escape");
  await waitFor(() => expect(selectAll).toBeEnabled());
  fireEvent.click(selectAll);
  expect(screen.getByRole("article", { name: "Video 1, selected" })).toBeInTheDocument();
  expect(screen.getByRole("article", { name: "Video 2, selected" })).toBeInTheDocument();
  expect(bar.getByText("2 selected")).toBeInTheDocument();
  // Everything on the page is selected already.
  expect(selectAll).toBeDisabled();
  fireEvent.click(clear);
  expect(screen.queryByRole("article", { name: "Video 1, selected" })).not.toBeInTheDocument();
  expect(bar.getByText("Applies to the focused video")).toBeInTheDocument();
  expect(selectAll).toBeEnabled();
  // A card selected by hand is added to, not toggled off, by Select all.
  fireEvent.click(screen.getByRole("button", { name: "Select Video 2" }));
  fireEvent.click(selectAll);
  expect(screen.getByRole("article", { name: "Video 2, selected" })).toBeInTheDocument();
  expect(bar.getByText("2 selected")).toBeInTheDocument();
  // Esc clears the selection from the bar's own controls too.
  fireEvent.keyDown(clear, { key: "Escape" });
  expect(bar.getByText("Applies to the focused video")).toBeInTheDocument();
});

it("selects every video on each page load when the review asks for it", async () => {
  api.loadReviews.mockResolvedValueOnce({ reviews: [{ ...review, view: { ...review.view, reviewMode: "multiple", filter: { page: 1, perPage: 2 }, selectAllOnLoad: true } }], storageKey: "reviews", canWrite: true });
  api.findMedia.mockImplementation(async (_review, filter) =>
    Number(filter.page) === 2
      ? { items: [video(3), video(4)], totalCount: 4 }
      : { items: [video(1), video(2)], totalCount: 4 },
  );
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1, selected" });
  expect(screen.getByRole("article", { name: "Video 2, selected" })).toBeInTheDocument();
  expect(screen.getByText("2 selected")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Clear" })).toBeEnabled();
  // One pager, in the header's toolbar.
  const nextPage = await screen.findByRole("button", { name: "Next page" });
  expect(screen.getByRole("toolbar", { name: "Video list controls" })).toContainElement(nextPage);
  expect(screen.getByRole("button", { name: "Page 1 of 2. Go to page" })).toHaveTextContent("1 / 2");
  await waitFor(() => expect(nextPage).toBeEnabled());
  fireEvent.click(nextPage);
  await screen.findByRole("article", { name: "Video 3, selected" });
  expect(screen.getByRole("article", { name: "Video 4, selected" })).toBeInTheDocument();
  fireEvent.keyDown(screen.getByRole("article", { name: "Video 3, selected" }), { key: "q" });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(1));
  expect(api.runReviewAction.mock.calls[0][2]).toEqual([3, 4]);
});

it("saves the select-all-on-load preference from the rule editor", async () => {
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  const drawer = await openEditor();
  fireEvent.click(within(drawer).getByRole("tab", { name: "Appearance" }));
  const option = within(drawer).getByRole("checkbox", { name: "Select every card when a page opens" });
  expect(option).not.toBeChecked();
  fireEvent.click(option);
  fireEvent.click(within(drawer).getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalled());
  expect(api.saveReviews.mock.calls.at(-1)?.[1][0].view.selectAllOnLoad).toBe(true);
});

it("keeps a hand-trimmed selection trimmed after an action, but reselects after applying to the whole page", async () => {
  api.loadReviews.mockResolvedValueOnce({ reviews: [{ ...review, view: { ...review.view, reviewMode: "multiple", filter: { page: 1, perPage: 2 }, selectAllOnLoad: true } }], storageKey: "reviews", canWrite: true });
  let remaining = [video(1), video(2), video(3), video(4)];
  api.findMedia.mockImplementation(async () => ({ items: remaining.slice(0, 2), totalCount: remaining.length }));
  api.runReviewAction.mockImplementation(async (_kind, _action, ids: number[]) => {
    remaining = remaining.filter((item) => !ids.includes(item.id));
  });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1, selected" });
  // Trim the page to one card, then apply: the refreshed page must not re-expand.
  fireEvent.click(screen.getByRole("button", { name: "Deselect Video 2" }));
  expect(screen.getByRole("article", { name: "Video 2" })).toBeInTheDocument();
  fireEvent.keyDown(screen.getByRole("article", { name: "Video 1, selected" }), { key: "q" });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(1));
  expect(api.runReviewAction.mock.calls[0][2]).toEqual([1]);
  await screen.findByRole("article", { name: "Video 3" });
  expect(screen.getByRole("article", { name: "Video 2" })).toBeInTheDocument();
  expect(screen.queryByRole("article", { name: "Video 2, selected" })).not.toBeInTheDocument();
  expect(screen.queryByRole("article", { name: "Video 3, selected" })).not.toBeInTheDocument();
  // Apply to the whole page: the next page arrives selected like a fresh load.
  await waitFor(() => expect(screen.getByRole("button", { name: "Select all" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Select all" }));
  fireEvent.keyDown(screen.getByRole("article", { name: "Video 2, selected" }), { key: "q" });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(2));
  expect(api.runReviewAction.mock.calls[1][2]).toEqual([2, 3]);
  await screen.findByRole("article", { name: "Video 4, selected" });
});

it("applies action letters from the page body and from the action bar", async () => {
  api.loadReviews.mockResolvedValueOnce({ reviews: [{ ...review, view: { ...review.view, reviewMode: "multiple", selectAllOnLoad: true } }], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  const first = await screen.findByRole("article", { name: "Video 1, selected" });
  await waitFor(() => expect(first).toHaveFocus());
  // Clicking blank page space leaves focus on the body.
  first.blur();
  expect(document.body).toHaveFocus();
  fireEvent.keyDown(document.body, { key: "q" });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(1));
  expect(api.runReviewAction.mock.calls[0][2]).toEqual([1, 2]);
  await screen.findByRole("article", { name: "Video 1, selected" });
  // The bar's Clear keeps focus after a click; letters still reach the review.
  const clear = screen.getByRole("button", { name: "Clear" });
  clear.focus();
  fireEvent.keyDown(clear, { key: "q" });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(2));
  // Clicking an action tile leaves focus on it; the next letter still applies.
  const action = screen.getByRole("button", { name: "q Apply" });
  await waitFor(() => expect(action).toBeEnabled());
  action.focus();
  fireEvent.keyDown(action, { key: "q" });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(3));
  // Text entry inside the page keeps letters for typing.
  const search = screen.getByRole("textbox", { name: "Search list" });
  search.focus();
  fireEvent.keyDown(search, { key: "q" });
  await act(async () => {});
  expect(api.runReviewAction).toHaveBeenCalledTimes(3);
});

it("explains why an action shortcut cannot run instead of ignoring it", async () => {
  api.getConfirmedAbsentTagsFieldStatus.mockResolvedValue({ kind: "missing", definition: {}, message: "Not set up" });
  const assessing = { ...review, view: { ...review.view, reviewMode: "multiple" }, actions: [{ id: "absent", label: "Mark absent", steps: [{ mode: "MARK_ABSENT" as const, tagIds: [3] }] }] };
  api.loadReviews.mockResolvedValueOnce({ reviews: [assessing], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  const first = await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(first).toHaveFocus());
  fireEvent.keyDown(first, { key: "q" });
  await screen.findByText("Set up tag assessments before applying Mark absent.");
  expect(api.runReviewAction).not.toHaveBeenCalled();
});

it("selects every tag on load for tag reviews that ask for it", async () => {
  const tagReview = { id: "tags", entityType: "tag" as const, name: "Review tags", description: "", view: { filter: { page: 1, perPage: 40 }, objectFilter: {}, displayMode: "grid" as const, searchMode: "text", selectAllOnLoad: true }, actions: [{ id: "skip", label: "Skip", effect: { mode: "SKIP" as const } }] };
  window.history.replaceState(null, "", "/data-quality?review=tags");
  api.loadReviews.mockResolvedValueOnce({ reviews: [tagReview], storageKey: "reviews", canWrite: true, canWriteTags: true, canReadTagGroups: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Tag 11, selected" });
  expect(screen.getByRole("article", { name: "Tag 12, selected" })).toBeInTheDocument();
  expect(screen.getByText("2 selected")).toBeInTheDocument();
});

it("keeps walking towards the first page when an earlier page refills from the tail", async () => {
  api.loadReviews.mockResolvedValueOnce({ reviews: [{ ...review, view: { ...review.view, reviewMode: "multiple", filter: { page: 1, perPage: 2 }, startFrom: "end", selectAllOnLoad: true } }], storageKey: "reviews", canWrite: true });
  let remaining = [video(1), video(2), video(3), video(4), video(5), video(6)];
  api.findMedia.mockImplementation(async (_review, filter) => {
    const perPage = Number(filter.perPage);
    const page = Number(filter.page);
    return {
      items: remaining.slice((page - 1) * perPage, page * perPage),
      totalCount: remaining.length,
    };
  });
  api.runReviewAction.mockImplementation(async (_kind, _action, ids: number[]) => {
    remaining = remaining.filter((item) => !ids.includes(item.id));
  });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  // The review starts on the last page and walks towards the first.
  await screen.findByRole("article", { name: "Video 5, selected" });
  // Leave Video 6 behind as the tail, then answer the rest of this page.
  fireEvent.click(screen.getByRole("button", { name: "Deselect Video 6" }));
  fireEvent.keyDown(screen.getByRole("article", { name: "Video 5, selected" }), { key: "q" });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(1));
  expect(api.runReviewAction.mock.calls[0][2]).toEqual([5]);
  // The skipped card is this page's own, so the page keeps it.
  await waitFor(() => expect(screen.queryByRole("article", { name: "Video 5" })).not.toBeInTheDocument());
  expect(screen.getByRole("article", { name: "Video 6" })).toBeInTheDocument();
  // Step a page towards the head by hand, then answer that whole page.
  const previousPage = await screen.findByRole("button", { name: "Previous page" });
  await waitFor(() => expect(previousPage).toBeEnabled());
  fireEvent.click(previousPage);
  await screen.findByRole("article", { name: "Video 3, selected" });
  fireEvent.keyDown(screen.getByRole("article", { name: "Video 3, selected" }), { key: "q" });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(2));
  expect(api.runReviewAction.mock.calls[1][2]).toEqual([3, 4]);
  // Video 6 shifted in from the tail; the queue continues towards the head.
  await screen.findByRole("article", { name: "Video 1, selected" });
  expect(screen.getByRole("article", { name: "Video 2, selected" })).toBeInTheDocument();
  expect(screen.queryByRole("article", { name: /^Video 6/ })).not.toBeInTheDocument();
});

function numberedActions(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `numbered-${index + 1}`,
    label: `Action ${index + 1}`,
    steps: [{ mode: "ADD" as const, tagIds: [100 + index] }],
  }));
}
function openGrid(actions = numberedActions(12)) {
  api.loadReviews.mockResolvedValueOnce({
    reviews: [{ ...review, actions, view: { ...review.view, reviewMode: "multiple" } }],
    storageKey: "reviews",
    canWrite: true,
  });
  render(<DataQualityPage onNavigate={vi.fn()} />);
}
const findOptions = (within_: HTMLElement = document.body) =>
  within(within_).queryAllByRole("option").filter((option) => option.closest(".dq-find-action"));

it("toggles every card with Ctrl+A or ⌘A while a applies action 12", async () => {
  openGrid();
  const first = await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(first).toHaveFocus());
  expect(activeTestKeys()).toContain("local:Ctrl+a");
  fireEvent.keyDown(first, { key: "a", ctrlKey: true });
  expect(screen.getByRole("article", { name: "Video 1, selected" })).toBeInTheDocument();
  expect(screen.getByRole("article", { name: "Video 2, selected" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Select all" })).toHaveAttribute(
    "aria-keyshortcuts",
    "Control+A Meta+A",
  );
  fireEvent.keyDown(document.body, { key: "a", metaKey: true });
  expect(screen.queryByRole("article", { name: /selected/ })).not.toBeInTheDocument();
  // Text entry keeps Ctrl+A for its own text.
  const search = screen.getByRole("textbox", { name: "Search list" });
  search.focus();
  expect(fireEvent.keyDown(search, { key: "a", ctrlKey: true })).toBe(true);
  expect(screen.queryByRole("article", { name: /selected/ })).not.toBeInTheDocument();
  first.focus();
  fireEvent.keyDown(first, { key: "a" });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(1));
  expect(api.runReviewAction.mock.calls[0][1].label).toBe("Action 12");
  expect(api.runReviewAction.mock.calls[0][2]).toEqual([1]);
});

it("finds an action in the grid with - and keeps the selection when Esc closes it", async () => {
  openGrid();
  const first = await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(first).toHaveFocus());
  fireEvent.keyDown(first, { key: "a", ctrlKey: true });
  fireEvent.keyDown(screen.getByRole("article", { name: "Video 1, selected" }), { key: "-" });
  let search = await screen.findByRole("combobox", { name: "Find an action" });
  expect(findOptions()).toHaveLength(12);
  fireEvent.keyDown(search, { key: "Escape" });
  expect(screen.queryByRole("combobox", { name: "Find an action" })).not.toBeInTheDocument();
  expect(screen.getByRole("article", { name: "Video 1, selected" })).toHaveFocus();
  expect(screen.getByRole("article", { name: "Video 2, selected" })).toBeInTheDocument();
  // The sidebar button opens it too.
  fireEvent.click(screen.getByRole("button", { name: /Find action/ }));
  search = await screen.findByRole("combobox", { name: "Find an action" });
  fireEvent.change(search, { target: { value: "action 7" } });
  expect(findOptions()).toHaveLength(1);
  expect(findOptions()[0]).toHaveTextContent("uAction 7");
  fireEvent.keyDown(search, { key: "Enter" });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(1));
  expect(api.runReviewAction.mock.calls[0][1].label).toBe("Action 7");
  expect(api.runReviewAction.mock.calls[0][2]).toEqual([1, 2]);
  expect(screen.queryByRole("combobox", { name: "Find an action" })).not.toBeInTheDocument();
});

it("runs action keys and Find action in the preview, also after clicking its actions", async () => {
  openGrid(numberedActions(2));
  const first = await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(first).toHaveFocus());
  fireEvent.keyDown(first, { key: "Enter" });
  const preview = await screen.findByRole("dialog", { name: "Review preview: Video 1" });
  const active = activeTestKeys();
  expect(active).toContain("overlay:q");
  expect(active).toContain("overlay:Shift+q");
  expect(active).toContain("overlay:-");
  expect(active).not.toContain("local:q");
  expect(active).not.toContain("local:Ctrl+a");
  fireEvent.keyDown(preview, { key: "w" });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(1));
  expect(api.runReviewAction.mock.calls[0][1].label).toBe("Action 2");
  const button = within(preview).getByRole("button", { name: /Action 1/ });
  await waitFor(() => expect(button).toBeEnabled());
  fireEvent.click(button);
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(2));
  await waitFor(() => expect(button).toBeEnabled());
  button.focus();
  fireEvent.keyDown(button, { key: "w" });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(3));
  expect(api.runReviewAction.mock.calls[2][1].label).toBe("Action 2");
  await waitFor(() => expect(button).toBeEnabled());
  fireEvent.keyDown(button, { key: "-" });
  const search = within(preview).getByRole("combobox", { name: "Find an action" });
  expect(findOptions(preview)).toHaveLength(2);
  fireEvent.keyDown(search, { key: "Escape" });
  expect(screen.getByRole("dialog", { name: /Review preview/ })).toBeInTheDocument();
  expect(button).toHaveFocus();
  // Opened with nothing focused, Find action hands focus back to the preview, which needs it
  // for its own playback keys.
  button.blur();
  fireEvent.keyDown(document.body, { key: "-" });
  fireEvent.keyDown(within(preview).getByRole("combobox", { name: "Find an action" }), {
    key: "Escape",
  });
  expect(preview).toHaveFocus();
  fireEvent.keyDown(button, { key: "-" });
  fireEvent.keyDown(within(preview).getByRole("combobox", { name: "Find an action" }), {
    key: "Enter",
  });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(4));
  expect(api.runReviewAction.mock.calls[3][1].label).toBe("Action 1");
  expect(screen.getByRole("dialog", { name: /Review preview/ })).toBeInTheDocument();
});

it("applies a held grid key once, and Shift with a key like the key alone", async () => {
  openGrid(numberedActions(3));
  const first = await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(first).toHaveFocus());
  // Buttons show the fixed keys.
  expect(screen.getByRole("button", { name: /Action 2/ }).querySelector("kbd")).toHaveTextContent("w");
  expect(screen.getByRole("button", { name: /Find action/ }).querySelector("kbd")).toHaveTextContent("-");
  expect(screen.getByRole("button", { name: "Select all" }).querySelector("kbd")).toHaveTextContent(
    "Ctrl/⌘A",
  );
  // Keys go where focus is: the card acted on leaves the grid and focus moves to the next one.
  const press = (init: KeyboardEventInit) =>
    fireEvent.keyDown(document.activeElement ?? document.body, init);
  press({ key: "w" });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(1));
  expect(api.runReviewAction.mock.calls[0][1].label).toBe("Action 2");
  await waitFor(() => expect(screen.getByRole("button", { name: /Action 3/ })).toBeEnabled());
  // Held past the refresh: Cove passes the repeats on, and the page drops them while claiming
  // them, so the browser and Cove do nothing with them either.
  expect(press({ key: "w", repeat: true })).toBe(false);
  press({ key: "w", repeat: true });
  await act(async () => {});
  expect(api.runReviewAction).toHaveBeenCalledTimes(1);
  // The grid always moves on, so Shift with a key applies the action like the key alone.
  press({ key: "E", shiftKey: true });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(2));
  expect(api.runReviewAction.mock.calls[1][1].label).toBe("Action 3");
});

it("gives f to action 15 over Cove's Filters while the review has one", async () => {
  openGrid(numberedActions(15));
  const first = await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(first).toHaveFocus());
  fireEvent.keyDown(first, { key: "f" });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(1));
  expect(api.runReviewAction.mock.calls[0][1].label).toBe("Action 15");
  expect(screen.queryByRole("dialog", { name: "Video filters" })).not.toBeInTheDocument();
  expect(testKeyboardConflicts).toEqual([]);
});

it("keeps the grid's search focused and every letter in it while the queue reloads", async () => {
  openGrid(numberedActions(27));
  const first = await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(first).toHaveFocus());
  // Each letter reloads the queue; the loads stay open until released.
  const loads: Array<() => void> = [];
  api.findMedia.mockImplementation(
    () =>
      new Promise((resolve) =>
        loads.push(() => resolve({ items: [video(3), video(4)], totalCount: 2 })),
      ),
  );
  const user = userEvent.setup();
  const search = screen.getByRole("textbox", { name: "Search list" });
  await user.click(search);
  await user.keyboard("qwf");
  expect(loads.length).toBeGreaterThan(0);
  expect(search.closest("[inert], [aria-disabled='true']")).toBeNull();
  expect(search).toHaveFocus();
  loads.forEach((release) => release());
  // The reload shows its cards, but focus stays in the search.
  await screen.findByRole("article", { name: "Video 3" });
  await act(async () => {});
  expect(search).toHaveFocus();
  // Still typing after the reload: the letters keep going into the search.
  await user.keyboard("gå");
  loads.forEach((release) => release());
  await screen.findByRole("article", { name: "Video 3" });
  await act(async () => {});
  expect(search).toHaveFocus();
  expect(search).toHaveValue("qwfgå");
  expect(api.runReviewAction).not.toHaveBeenCalled();
  expect(screen.queryByRole("dialog", { name: "Video filters" })).not.toBeInTheDocument();
  // The card the keys act on moved to the new queue, ready for when focus leaves the search.
  expect(screen.getByRole("article", { name: "Video 3" })).toHaveAttribute("aria-current", "true");
});

it("lets only the newest search load set the grid's selection and focus", async () => {
  api.loadReviews.mockResolvedValueOnce({
    reviews: [
      {
        ...review,
        actions: numberedActions(3),
        view: { ...review.view, reviewMode: "multiple", selectAllOnLoad: true },
      },
    ],
    storageKey: "reviews",
    canWrite: true,
  });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1, selected" });
  const loads: Array<(ids: number[]) => void> = [];
  api.findMedia.mockImplementation(
    () =>
      new Promise((resolve) =>
        loads.push((ids) =>
          resolve({ items: ids.map((id) => video(id)), totalCount: ids.length }),
        ),
      ),
  );
  const user = userEvent.setup();
  const search = screen.getByRole("textbox", { name: "Search list" });
  await user.click(search);
  await user.keyboard("ab");
  expect(loads).toHaveLength(2);
  // The newest load answers first; the one it superseded answers late, and changes nothing.
  loads[1]([3, 4]);
  await screen.findByRole("article", { name: "Video 3, selected" });
  loads[0]([5, 6]);
  await act(async () => {});
  expect(screen.getByRole("article", { name: "Video 3, selected" })).toHaveAttribute(
    "aria-current",
    "true",
  );
  expect(screen.getByRole("article", { name: "Video 4, selected" })).toBeInTheDocument();
  expect(search).toHaveFocus();
});

it("registers the keys once in the single-item workspace, where the grid's stay released", async () => {
  openGrid(numberedActions(2));
  const first = await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(first).toHaveFocus());
  expect(activeTestKeys()).toContain("local:Ctrl+a");
  // Back in the single-item workspace, only the workspace's keys are registered, each once.
  await switchLayout("Single");
  await screen.findByRole("heading", { name: "Reviewing this video" });
  await waitFor(() => expect(activeTestKeys()).toContain("local:q"));
  const active = activeTestKeys();
  expect(active.filter((key) => key === "local:q")).toHaveLength(1);
  expect(active.filter((key) => key === "local:Shift+q")).toHaveLength(1);
  expect(active.filter((key) => key === "local:-")).toHaveLength(1);
  expect(active).not.toContain("local:Ctrl+a");
});

it("leaves f to Cove's Filters while action 15 does not exist", async () => {
  openGrid(numberedActions(14));
  const first = await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(first).toHaveFocus());
  expect(activeTestKeys()).toContain("local:d");
  expect(activeTestKeys()).not.toContain("local:f");
  fireEvent.keyDown(first, { key: "f" });
  expect(await screen.findByRole("dialog", { name: "Video filters" })).toBeInTheDocument();
  expect(api.runReviewAction).not.toHaveBeenCalled();
});

it("leaves the grid keys to Cove while the queue is empty", async () => {
  api.findMedia.mockResolvedValue({ items: [], totalCount: 0 });
  openGrid(numberedActions(16));
  await screen.findByText("No videos match this review.");
  expect(activeTestKeys().filter((key) => key.startsWith("local:"))).toEqual([]);
});

it("closes Find action with Esc when focus has left its search field", async () => {
  openGrid();
  const first = await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(first).toHaveFocus());
  fireEvent.keyDown(first, { key: "-" });
  await screen.findByRole("combobox", { name: "Find an action" });
  first.focus();
  fireEvent.keyDown(first, { key: "Escape" });
  expect(screen.queryByRole("combobox", { name: "Find an action" })).not.toBeInTheDocument();
  fireEvent.keyDown(first, { key: "Enter" });
  const preview = await screen.findByRole("dialog", { name: /Review preview/ });
  fireEvent.keyDown(preview, { key: "-" });
  within(preview).getByRole("combobox", { name: "Find an action" });
  preview.focus();
  fireEvent.keyDown(preview, { key: "Escape" });
  expect(within(preview).queryByRole("combobox", { name: "Find an action" })).not.toBeInTheDocument();
  expect(screen.getByRole("dialog", { name: /Review preview/ })).toBeInTheDocument();
});

it("fits the single-item workspace to the window, with the page's notices under its header", async () => {
  api.loadReviews.mockResolvedValue({
    reviews: [review],
    storageKey: "reviews",
    canWrite: true,
    storageNotice: "Reviews and progress are saved only in this browser.",
  });
  const { container } = render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  const page = container.querySelector(".data-quality-page")!;
  expect(page).toHaveClass("dq-page-fit");
  expect(page.getAttribute("style")).toMatch(/--dq-fit-top: \d+px; --dq-fit-bottom: \d+px/);
  const header = screen.getByRole("heading", { name: review.name }).closest("header")!;
  const notice = screen.getByText("Reviews and progress are saved only in this browser.");
  expect(header.compareDocumentPosition(notice) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  // The card grid fits the window too: the header and notices on top, then the cards, which
  // scroll on their own, with the action bar docked under them.
  await switchLayout("Grid");
  const card = await screen.findByRole("article", { name: "Video 1" });
  expect(page).toHaveClass("dq-page-fit");
  const grid = container.querySelector(".dq-grid-review")!;
  const gridHeader = within(grid as HTMLElement).getByRole("heading", { name: review.name }).closest("header")!;
  const gridNotice = screen.getByText("Reviews and progress are saved only in this browser.");
  expect(gridHeader.compareDocumentPosition(gridNotice) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  const stage = container.querySelector(".dq-grid-stage")!;
  expect(stage).toContainElement(card);
  expect(stage.lastElementChild).toHaveClass("dq-bar-dock");
  expect(stage.lastElementChild).toContainElement(screen.getByRole("region", { name: "Actions" }));
  // No separate pagination rows or resizable sidebar remain.
  expect(screen.queryByRole("separator")).not.toBeInTheDocument();
  expect(screen.queryByRole("navigation", { name: /pagination/i })).not.toBeInTheDocument();
});

async function openPreview(actions = numberedActions(2)) {
  openGrid(actions);
  const first = await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(first).toHaveFocus());
  fireEvent.keyDown(first, { key: "Enter" });
  return screen.findByRole("dialog", { name: "Review preview: Video 1" });
}

it("shows the preview's steps, selection, hints and action bar", async () => {
  const preview = await openPreview();
  const previous = within(preview).getByRole("button", { name: "Previous video" });
  const next = within(preview).getByRole("button", { name: "Next video" });
  expect(previous).toHaveAttribute("aria-keyshortcuts", "n");
  expect(next).toHaveAttribute("aria-keyshortcuts", "m");
  expect(previous).toBeDisabled();
  expect(next).toBeEnabled();
  expect(within(preview).getByText("Actions apply to this video")).toBeInTheDocument();
  expect(preview).toHaveTextContent("N M previous / next");
  expect(preview).toHaveTextContent("Enter or Esc closes");
  const bar = within(within(preview).getByRole("region", { name: "Actions" }));
  expect(bar.getByText("This video")).toBeInTheDocument();
  expect(bar.getByRole("button", { name: "q Action 1" })).toBeInTheDocument();
  expect(bar.getByRole("button", { name: "Find action" })).toBeInTheDocument();
  // Selecting from the preview retargets the actions.
  const selected = within(preview).getByRole("button", { name: "Selected" });
  expect(selected).toHaveAttribute("aria-pressed", "false");
  fireEvent.click(selected);
  expect(selected).toHaveAttribute("aria-pressed", "true");
  expect(within(preview).getByText("Actions apply to the 1 selected video")).toBeInTheDocument();
  expect(bar.getByText("1 selected")).toBeInTheDocument();
  // m and n step through the page; the header follows.
  fireEvent.keyDown(preview, { key: "m" });
  await screen.findByRole("dialog", { name: "Review preview: Video 2" });
  expect(within(preview).getByRole("button", { name: "Selected" })).toHaveAttribute("aria-pressed", "false");
  fireEvent.keyDown(preview, { key: "n" });
  await screen.findByRole("dialog", { name: "Review preview: Video 1" });
  // Esc closes and hands focus back to the card.
  fireEvent.keyDown(preview, { key: "Escape" });
  expect(screen.queryByRole("dialog", { name: /Review preview/ })).not.toBeInTheDocument();
  await waitFor(() => expect(screen.getByRole("article", { name: "Video 1, selected" })).toHaveFocus());
});

it("keeps focus in the preview after its buttons are clicked, so its own keys keep working", async () => {
  const preview = await openPreview();
  const user = userEvent.setup();
  // A step button: focus returns to the preview, where Space plays and pauses.
  await user.click(within(preview).getByRole("button", { name: "Next video" }));
  await screen.findByRole("dialog", { name: "Review preview: Video 2" });
  expect(preview).toHaveFocus();
  fireEvent.keyDown(document.activeElement!, { key: " " });
  expect(testVideoControls.toggle).toHaveBeenCalledTimes(1);
  fireEvent.keyDown(document.activeElement!, { key: "ArrowRight" });
  expect(testVideoControls.seekBy).toHaveBeenLastCalledWith(60);
  // An action tile, which the running action disables: focus still stays in the preview.
  await user.click(within(preview).getByRole("button", { name: "q Action 1" }));
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(1));
  expect(api.runReviewAction.mock.calls[0][1].label).toBe("Action 1");
  expect(preview).toHaveFocus();
  fireEvent.keyDown(document.activeElement!, { key: "n" });
  await screen.findByRole("dialog", { name: "Review preview: Video 1" });
  // The Selected toggle too.
  await user.click(within(preview).getByRole("button", { name: "Selected" }));
  expect(preview).toHaveFocus();
  fireEvent.keyDown(document.activeElement!, { key: " " });
  expect(testVideoControls.toggle).toHaveBeenCalledTimes(2);
});

it("toggles queue tag bins from the header's chip row", async () => {
  const binned = {
    ...review,
    view: { ...review.view, reviewMode: "multiple" },
    presentation: { binParents: [100] },
  };
  api.loadReviews.mockResolvedValueOnce({ reviews: [binned], storageKey: "reviews", canWrite: true });
  api.resolveTagTree.mockResolvedValue([100, 30, 31]);
  api.findMedia.mockResolvedValue({
    items: [
      { ...video(1), tags: [{ id: 30, name: "Bin A" }, { id: 31, name: "Bin B" }] },
      { ...video(2), tags: [{ id: 30, name: "Bin A" }] },
    ],
    totalCount: 2,
  });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  const bins = await screen.findByRole("group", { name: "Tag bins on this page" });
  expect(bins).toHaveTextContent("On this page");
  expect(bins.closest("header")).toBeInTheDocument();
  const binA = within(bins).getByRole("button", { name: "Bin A 2" });
  expect(within(bins).getByRole("button", { name: "Bin B 1" })).toHaveAttribute("aria-pressed", "false");
  await waitFor(() => expect(binA).toBeEnabled());
  fireEvent.click(binA);
  await waitFor(() =>
    expect(api.findMedia.mock.calls.at(-1)?.[0].view.objectFilter).toEqual({
      _filterExpression: {
        operator: "AND",
        children: [{ filter: { tagsCriterion: { value: [30], modifier: "INCLUDES", depth: 0 } } }],
      },
    }),
  );
  expect(api.findMedia.mock.calls.at(-1)?.[1].page).toBe(1);
  await waitFor(() =>
    expect(within(bins).getByRole("button", { name: "Bin A 2" })).toHaveAttribute("aria-pressed", "true"),
  );
  expect(screen.getByText("Queue differs from the saved review")).toBeInTheDocument();
  // Pressed again, the bin lifts its narrowing and the queue is the saved one again.
  await waitFor(() => expect(within(bins).getByRole("button", { name: "Bin A 2" })).toBeEnabled());
  fireEvent.click(within(bins).getByRole("button", { name: "Bin A 2" }));
  await waitFor(() => expect(api.findMedia.mock.calls.at(-1)?.[0].view.objectFilter).toEqual({}));
  await waitFor(() =>
    expect(within(bins).getByRole("button", { name: "Bin A 2" })).toHaveAttribute("aria-pressed", "false"),
  );
  expect(screen.queryByText("Queue differs from the saved review")).not.toBeInTheDocument();
});

it("switches between Cards and Wall and keeps the host's view buttons out of the toolbar", async () => {
  openGrid();
  const first = await screen.findByRole("article", { name: "Video 1" });
  const view = screen.getByRole("group", { name: "Card view" });
  const cards = within(view).getByRole("button", { name: "Cards" });
  const wall = within(view).getByRole("button", { name: "Wall" });
  expect(cards).toHaveAttribute("aria-pressed", "true");
  expect(first).toHaveClass("grid");
  fireEvent.click(wall);
  expect(wall).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("article", { name: "Video 1" })).toHaveClass("wall");
  // Cove's own Grid/Wall buttons would repeat the header's switch.
  expect(screen.queryByRole("group", { name: "Review view" })).not.toBeInTheDocument();
  // The card size control stays.
  expect(screen.getByRole("slider", { name: /Card size/ })).toBeInTheDocument();
});

it("says in the bar why an action key cannot run", async () => {
  api.getConfirmedAbsentTagsFieldStatus.mockResolvedValue({ kind: "missing", definition: {}, message: "Not set up" });
  const assessing = { ...review, view: { ...review.view, reviewMode: "multiple" }, actions: [{ id: "absent", label: "Mark absent", steps: [{ mode: "MARK_ABSENT" as const, tagIds: [3] }] }] };
  api.loadReviews.mockResolvedValueOnce({ reviews: [assessing], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  const first = await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(first).toHaveFocus());
  fireEvent.keyDown(first, { key: "q" });
  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent("Set up tag assessments before applying Mark absent.");
  expect(screen.getByRole("region", { name: "Actions" })).toContainElement(alert);
  expect(screen.getByRole("button", { name: "q Mark absent" })).toBeDisabled();
});

it("leaves focus on a preview button pressed from the keyboard, and recovers it when a control drops it", async () => {
  const preview = await openPreview();
  const user = userEvent.setup();
  const selected = within(preview).getByRole("button", { name: "Selected" });
  selected.focus();
  await user.keyboard("{Enter}");
  expect(selected).toHaveAttribute("aria-pressed", "true");
  expect(selected).toHaveFocus();
  // Enter again toggles it back rather than closing the preview.
  await user.keyboard("{Enter}");
  expect(selected).toHaveAttribute("aria-pressed", "false");
  expect(screen.getByRole("dialog", { name: /Review preview/ })).toBeInTheDocument();
  // An action tile pressed from the keyboard is disabled while the action runs, and the browser
  // drops focus to the page; once the action is done, the preview has focus again.
  let finish!: () => void;
  api.runReviewAction.mockImplementationOnce(
    () => new Promise<void>((resolve) => (finish = resolve)),
  );
  const tile = within(preview).getByRole("button", { name: "q Action 1" });
  tile.focus();
  await user.keyboard("{Enter}");
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(1));
  expect(tile).toBeDisabled();
  // jsdom neither drops focus from a disabled control nor lets one be blurred; stand in for the
  // browser with an element that takes focus and goes, leaving it on the page.
  const stand = document.body.appendChild(document.createElement("button"));
  stand.focus();
  stand.remove();
  expect(document.body).toHaveFocus();
  await act(async () => finish());
  await waitFor(() => expect(preview).toHaveFocus());
});

it("edits a grid review in a drawer beside the cards, with actions paused, and Cancel restores the queue", async () => {
  openGrid(numberedActions(2));
  const first = await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(first).toHaveFocus());
  expect(activeTestKeys()).toContain("local:q");
  fireEvent.click(screen.getByRole("button", { name: "Select Video 2" }));
  expect(screen.getByRole("article", { name: "Video 2, selected" })).toBeInTheDocument();
  const before = window.location.search;
  const drawer = await openEditor();
  // The drawer, not the manager's dialog, edits the review.
  expect(screen.queryByRole("dialog", { name: "Manage Data Quality reviews" })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Edit review" })).toHaveAttribute("aria-expanded", "true");
  expect(within(drawer).getAllByRole("tab").map((tab) => tab.textContent)).toEqual([
    "Review",
    "Appearance",
    "Actions",
  ]);
  // The review's actions pause: no keys, the bar says so, and Enter previews nothing.
  expect(activeTestKeys()).not.toContain("local:q");
  const bar = screen.getByRole("region", { name: "Actions" });
  expect(within(bar).getByText("Actions are paused while you edit the review")).toBeInTheDocument();
  expect(within(bar).getByRole("button", { name: "q Action 1" })).toBeDisabled();
  fireEvent.keyDown(first, { key: "Enter" });
  fireEvent.click(within(first).getByRole("button", { name: "Preview Video 1" }));
  expect(screen.queryByRole("dialog", { name: /Review preview/ })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "More review options" })).toBeDisabled();
  // The cards stay live: Esc on one clears the selection, and the drawer stays.
  fireEvent.keyDown(screen.getByRole("article", { name: "Video 2, selected" }), { key: "Escape" });
  expect(screen.getByRole("article", { name: "Video 2" })).toBeInTheDocument();
  expect(screen.getByRole("dialog", { name: "Edit review" })).toBeInTheDocument();
  // The header's toolbar stays live as the draft's preview.
  api.findMedia.mockResolvedValue({ items: [video(3)], totalCount: 1 });
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), {
    target: { value: "draft" },
  });
  await screen.findByRole("article", { name: "Video 3" });
  expect(screen.getByText("Previewing the draft")).toBeInTheDocument();
  expect(within(drawer).getByText("Unsaved changes")).toBeInTheDocument();
  fireEvent.click(within(drawer).getByRole("button", { name: "Cancel" }));
  expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument();
  // The queue as it was, with its selection and focused card, and its URL; nothing was saved.
  expect(screen.getByRole("article", { name: "Video 1" })).toHaveAttribute("aria-current", "true");
  expect(screen.getByRole("article", { name: "Video 2, selected" })).toBeInTheDocument();
  expect(screen.queryByRole("article", { name: "Video 3" })).not.toBeInTheDocument();
  expect(screen.getByRole("textbox", { name: "Search list" })).toHaveValue("");
  await waitFor(() => expect(window.location.search).toBe(before));
  expect(api.saveReviews).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Edit review" })).toHaveFocus();
  await waitFor(() => expect(activeTestKeys()).toContain("local:q"));
});

it("saves the grid's draft with the toolbar's criteria, keeping the drawer open when saving fails", async () => {
  api.saveReviews.mockRejectedValueOnce(new Error("Storage offline"));
  openGrid(numberedActions(2));
  await screen.findByRole("article", { name: "Video 1" });
  const drawer = await openEditor();
  fireEvent.change(within(drawer).getByLabelText("Description"), {
    target: { value: "Checked in the grid" },
  });
  fireEvent.change(within(drawer).getByLabelText("Review direction"), {
    target: { value: "end" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), {
    target: { value: "draft" },
  });
  const save = within(drawer).getByRole("button", { name: "Save review" });
  await waitFor(() => expect(save).toBeEnabled());
  fireEvent.click(save);
  expect(await within(drawer).findByRole("alert")).toHaveTextContent(
    "Could not save review. Your edits are still open. Storage offline",
  );
  expect(within(drawer).getByLabelText("Description")).toHaveValue("Checked in the grid");
  fireEvent.click(save);
  await waitFor(() =>
    expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument(),
  );
  expect(api.saveReviews.mock.calls.at(-1)?.[1][0]).toMatchObject({
    description: "Checked in the grid",
    view: { filter: { q: "draft", page: 1 }, reviewMode: "multiple", startFrom: "end" },
  });
  // The saved review holds the queue's criteria now.
  expect(screen.queryByText("Queue differs from the saved review")).not.toBeInTheDocument();
  expect(screen.getByText("Review saved.")).toBeInTheDocument();
});

it("opens a grid review's drawer from Manage reviews, once", async () => {
  const gridReview = {
    ...review,
    id: "grid",
    name: "Grid review",
    view: { ...review.view, reviewMode: "multiple" as const },
  };
  api.loadReviews.mockResolvedValueOnce({
    reviews: [review, gridReview],
    storageKey: "reviews",
    canWrite: true,
  });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  await openManagerFromWorkspace();
  const manager = screen.getByRole("dialog", { name: "Manage Data Quality reviews" });
  const row = within(manager).getByText("Grid review").closest("article")!;
  fireEvent.click(within(row).getByRole("button", { name: "Edit" }));
  // The review opens in its own layout, the card grid, with its drawer.
  const drawer = await screen.findByRole("dialog", { name: "Edit review" });
  expect(screen.getByRole("article", { name: "Video 1" })).toBeInTheDocument();
  expect(within(drawer).getByLabelText("Review name")).toHaveValue("Grid review");
  fireEvent.click(within(drawer).getByRole("button", { name: "Cancel" }));
  // Switching layouts later does not open it again.
  await switchLayout("Single");
  await screen.findByRole("heading", { name: "Reviewing this video" });
  await act(async () => {});
  expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument();
});

it("opens the workspace's drawer from Manage reviews only once, however often its layout changes", async () => {
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  await openManagerFromWorkspace();
  fireEvent.click(
    within(screen.getByRole("dialog", { name: "Manage Data Quality reviews" })).getByRole(
      "button",
      { name: "Edit" },
    ),
  );
  const drawer = await screen.findByRole("dialog", { name: "Edit review" });
  fireEvent.click(within(drawer).getByRole("button", { name: "Cancel" }));
  await switchLayout("Grid");
  await screen.findByRole("article", { name: "Video 1" });
  await switchLayout("Single");
  await screen.findByRole("heading", { name: "Reviewing this video" });
  await act(async () => {});
  expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument();
});

it("opens a video grid review from a tag review's Manage reviews without drawing the tags as videos", async () => {
  const tagReview = {
    id: "tags",
    entityType: "tag" as const,
    name: "Tag review",
    description: "",
    view: {
      filter: { page: 1, perPage: 40 },
      objectFilter: {},
      displayMode: "grid" as const,
      searchMode: "text",
    },
    actions: [{ id: "skip", label: "Skip", effect: { mode: "SKIP" as const } }],
  };
  const gridReview = {
    ...review,
    id: "grid",
    name: "Grid review",
    view: { ...review.view, reviewMode: "multiple" as const },
  };
  window.history.replaceState(null, "", "/data-quality?review=tags");
  api.loadReviews.mockResolvedValueOnce({
    reviews: [tagReview, gridReview],
    storageKey: "reviews",
    canWrite: true,
    canWriteTags: true,
    canReadTagGroups: true,
  });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Tag 11" });
  await openManagerFromWorkspace();
  const manager = screen.getByRole("dialog", { name: "Manage Data Quality reviews" });
  const row = within(manager).getByText("Grid review").closest("article")!;
  fireEvent.click(within(row).getByRole("button", { name: "Edit" }));
  const drawer = await screen.findByRole("dialog", { name: "Edit review" });
  expect(within(drawer).getByLabelText("Review name")).toHaveValue("Grid review");
  expect(screen.getByRole("article", { name: "Video 1" })).toBeInTheDocument();
  expect(screen.queryByRole("article", { name: "Tag 11" })).not.toBeInTheDocument();
});

it("holds the grid's queue controls while the drawer saves, and keeps Save focused", async () => {
  let finish!: () => void;
  api.saveReviews.mockImplementationOnce(() => new Promise<void>((resolve) => (finish = resolve)));
  openGrid(numberedActions(2));
  await screen.findByRole("article", { name: "Video 1" });
  const drawer = await openEditor();
  fireEvent.change(within(drawer).getByLabelText("Description"), { target: { value: "Saving" } });
  const save = within(drawer).getByRole("button", { name: "Save review" });
  save.focus();
  fireEvent.click(save);
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalledTimes(1));
  // The queue being saved stays as it is: no search, page or bin changes meanwhile.
  expect(screen.getByRole("textbox", { name: "Search list" })).toBeDisabled();
  // Save stays focusable (a disabled button would drop focus to the page) and ignores clicks.
  expect(save).not.toBeDisabled();
  expect(save).toHaveAttribute("aria-disabled", "true");
  expect(save).toHaveFocus();
  fireEvent.click(save);
  expect(api.saveReviews).toHaveBeenCalledTimes(1);
  await act(async () => finish());
  await waitFor(() =>
    expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument(),
  );
  expect(screen.getByRole("textbox", { name: "Search list" })).toBeEnabled();
});

it("never saves the last review's queue as the next one's progress when Edit switches reviews", async () => {
  const tagReview = {
    id: "tags",
    entityType: "tag" as const,
    name: "Tag review",
    description: "",
    view: {
      filter: { page: 1, perPage: 40 },
      objectFilter: {},
      displayMode: "grid" as const,
      searchMode: "text",
    },
    actions: [{ id: "skip", label: "Skip", effect: { mode: "SKIP" as const } }],
  };
  const gridReview = {
    ...review,
    id: "grid",
    name: "Grid review",
    view: { ...review.view, filter: { page: 1, perPage: 24 }, reviewMode: "multiple" as const },
  };
  window.history.replaceState(null, "", "/data-quality?review=tags");
  api.loadReviews.mockResolvedValueOnce({
    reviews: [tagReview, gridReview],
    storageKey: "reviews",
    canWrite: true,
    canWriteTags: true,
    canReadTagGroups: true,
  });
  const setItem = vi.spyOn(Storage.prototype, "setItem");
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Tag 11" });
  await openManagerFromWorkspace();
  const manager = screen.getByRole("dialog", { name: "Manage Data Quality reviews" });
  fireEvent.click(
    within(within(manager).getByText("Grid review").closest("article")!).getByRole("button", {
      name: "Edit",
    }),
  );
  await screen.findByRole("dialog", { name: "Edit review" });
  await waitFor(() =>
    expect(setItem.mock.calls.some(([key]) => key === "reviews:progress:grid")).toBe(true),
  );
  const saved = setItem.mock.calls
    .filter(([key]) => key === "reviews:progress:grid")
    .map(([, value]) => JSON.parse(value).filter.perPage);
  expect(saved.every((perPage) => perPage === 24)).toBe(true);
});

it("drops a Manage reviews edit request when the review's URL cannot be read", async () => {
  window.history.replaceState(null, "", "/data-quality?review=review&filters=invalid");
  api.loadReviews.mockResolvedValueOnce({
    reviews: [{ ...review, view: { ...review.view, reviewMode: "multiple" } }],
    storageKey: "reviews",
    canWrite: true,
  });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  const error = await screen.findByRole("alert");
  // The drawer saves the queue's criteria, so the URL must be reset first.
  expect(screen.getByRole("button", { name: "Edit review" })).toBeDisabled();
  await openManagerFromWorkspace();
  fireEvent.click(
    within(screen.getByRole("dialog", { name: "Manage Data Quality reviews" })).getByRole(
      "button",
      { name: "Edit" },
    ),
  );
  await act(async () => {});
  expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument();
  // Nor does it open later, once the queue loads.
  fireEvent.click(within(error).getByRole("button", { name: "Reset to review defaults" }));
  await screen.findByRole("article", { name: "Video 1" });
  await act(async () => {});
  expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument();
});

it("still opens a tag with Enter while its review is edited", async () => {
  const tagReview = {
    id: "tags",
    entityType: "tag" as const,
    name: "Tag review",
    description: "",
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
  const open = vi.spyOn(window, "open").mockImplementation(() => null);
  render(<DataQualityPage onNavigate={vi.fn()} />);
  const first = await screen.findByRole("article", { name: "Tag 11" });
  await openEditor();
  expect(screen.getByRole("region", { name: "Actions" })).toHaveTextContent(
    "Arrows move · Space selects · Enter opens",
  );
  fireEvent.keyDown(first, { key: "Enter" });
  expect(open).toHaveBeenCalledWith("/tag/11", "_blank", "noopener,noreferrer");
});
