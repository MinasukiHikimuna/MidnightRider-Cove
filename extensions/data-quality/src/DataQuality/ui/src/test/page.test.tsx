import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DataQualityPage, objectFiltersEqual } from "../index";
import { StaleReviewsError } from "../storage";
import { presentedVideo } from "../TagPresentation";
import { testVideoControls } from "@cove/runtime/components";
import {
  activeTestKeys,
  reportTestVideoTime,
  testFilterControls,
  testGlobalShortcuts,
  testKeyboardConflicts,
} from "./runtime-components";
import { setViewportWidth } from "./viewport";
import type { Review } from "../model";

const { account, api, review } = vi.hoisted(() => ({
  // The account's reviews as the page's saves leave them (see applySave).
  account: {
    loaded: [] as Review[],
    lastSaved: null as Review[] | null,
    written: [] as Array<Review[] | undefined>,
  },
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

const LIST_ORDER_KEY = "data-quality.reviews-sort.v1";

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
  // The list the page loads is the account's until the page saves a change to it.
  loadReviews: (...args: unknown[]) =>
    api.loadReviews(...args).then((result: { reviews?: Review[] } | undefined) => {
      account.loaded = result?.reviews ?? [];
      return result;
    }),
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
  vi.useRealTimers();
  window.history.replaceState(null, "", "/data-quality?review=review");
  localStorage.removeItem("data-quality.workspace-layout.v1");
  // The list's sort is remembered per browser; each test starts from the default order.
  localStorage.removeItem(LIST_ORDER_KEY);
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
  account.loaded = [];
  account.lastSaved = null;
  account.written = [];
  api.saveReviews.mockReset().mockImplementation(saveToTestAccount);
  api.resolveTagTree.mockReset().mockResolvedValue([]);
  api.getConfirmedAbsentTagsFieldStatus.mockReset().mockResolvedValue({
    kind: "ready",
    definition: {},
    message: "",
  });
  api.createConfirmedAbsentTagsField.mockReset().mockResolvedValue(undefined);
  api.request.mockReset().mockResolvedValue({ available: true });
  api.readVideo.mockReset().mockImplementation(async id => video(id));
  // jsdom has no modal dialogs: New review and the discard confirmation open as open dialogs.
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
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

/**
 * The page hands saveReviews a change which, as in storage.ts, applies to the list saved last (at
 * first, the list the page loaded); a change that keeps the list saves nothing. What each call
 * saved is kept by call.
 */
function applySave(change: (current: Review[]) => Review[], call: number): Review[] {
  const current = account.lastSaved ?? account.loaded;
  const next = change(current);
  if (next !== current) {
    account.lastSaved = next;
    account.written[call] = next;
  }
  return next;
}
async function saveToTestAccount(_key: string, change: (current: Review[]) => Review[]) {
  return applySave(change, api.saveReviews.mock.calls.length - 1);
}

/** Holds the next save until the returned function lets it write, as a slow account would. */
function holdNextSave(): () => void {
  let write!: () => void;
  api.saveReviews.mockImplementationOnce(
    (_key: string, change: (current: Review[]) => Review[]) => {
      const call = api.saveReviews.mock.calls.length - 1;
      return new Promise((resolve) => (write = () => resolve(applySave(change, call))));
    },
  );
  return () => write();
}

/**
 * The reviews that save call `call` (from 0) wrote, or the last save wrote. Loosely typed, as the
 * mock's calls were: tests read the fields of whichever kind of review they saved.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function savedList(call?: number): any[] {
  const list = call === undefined ? account.lastSaved : account.written[call];
  if (!list) throw new Error(`Save ${call ?? "(last)"} wrote nothing.`);
  return list;
}

/** In an open review (single-item workspace or grid), chooses an item of the header's More menu. */
async function chooseFromMore(item: string) {
  const more = screen.getByRole("button", { name: "More review options" });
  await waitFor(() => expect(more).toBeEnabled());
  // A click focuses the button in the browser; whatever the item opens hands focus back to it.
  more.focus();
  fireEvent.click(more);
  fireEvent.click(screen.getByRole("menuitem", { name: item }));
}

/** On the reviews list, chooses an item of a review's row menu. */
function chooseFromRow(name: string, item: string) {
  const menu = screen.getByRole("button", { name: `Actions for ${name}` });
  menu.focus();
  fireEvent.click(menu);
  fireEvent.click(screen.getByRole("menuitem", { name: item }));
}

/** The reviews list's rows, in order, by review name. */
function listedReviews() {
  return within(screen.getByRole("region", { name: "Reviews" }))
    .getAllByRole("row")
    .slice(1)
    .map((row) => row.querySelector(".dq-reviews-name")?.textContent);
}

/** What the page's live region says about the last import or deletion. */
function announced() {
  return document.querySelector(".data-quality-page > [aria-live='polite']")?.textContent ?? "";
}

/**
 * Starts the test at the URL in a history entry of its own, with nothing ahead of it (an earlier
 * test may have gone back), and says how many entries history holds then.
 */
function freshHistory(url: string) {
  window.history.pushState(null, "", url);
  return window.history.length;
}

/** The browser's Back (or Forward) button: resolves once the page has handled the navigation. */
async function goBack(delta = -1) {
  const landed = new Promise((resolve) => window.addEventListener("popstate", resolve, { once: true }));
  await act(async () => {
    window.history.go(delta);
    await landed;
  });
}

/** Browser navigation (Back or Forward) to another URL of the page. */
async function navigateTo(url: string) {
  await act(async () => {
    window.history.pushState(null, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
}

/** Captures what the page downloads: each file's name and parsed contents. */
function captureDownloads() {
  const files: Array<{ name: string; blob: Blob }> = [];
  let pending: Blob | null = null;
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: (blob: Blob) => {
      pending = blob;
      return "blob:download";
    },
  });
  Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    if (pending) files.push({ name: this.download, blob: pending });
    pending = null;
  });
  return {
    files,
    async contents(index: number) {
      return JSON.parse(await files[index].blob.text());
    },
  };
}

/** A review file chosen in Import's file picker. */
function chooseImportFile(contents: string, name = "reviews.json") {
  const file = new File([contents], name, { type: "application/json" });
  fireEvent.change(document.querySelector("input[type=file]")!, { target: { files: [file] } });
  return file;
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
  it("lists the reviews in a table with each kind's icon and name", async () => {
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
    fireEvent.click(screen.getByRole("button", { name: "All reviews" }));

    const table = within(screen.getByRole("region", { name: "Reviews" })).getByRole("table");
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((cell) => cell.textContent),
    ).toEqual(["Review", "Type", "Matching", "Actions"]);
    const [videoRow, tagRow] = within(table).getAllByRole("row").slice(1);
    expect(within(videoRow).getByRole("img", { name: "Video review" })).toBeInTheDocument();
    expect(within(videoRow).getByRole("cell", { name: "Videos" })).toBeInTheDocument();
    expect(within(tagRow).getByRole("img", { name: "Tag review" })).toBeInTheDocument();
    expect(within(tagRow).getByRole("cell", { name: "Tags" })).toBeInTheDocument();
    // The name, with its description under it, opens the review; its link keeps the review's URL.
    const link = within(tagRow).getByRole("link", { name: /Review tags/ });
    expect(link).toHaveTextContent("Classify tags");
    expect(link).toHaveAttribute("href", "?review=tags");
    expect(within(tagRow).getByRole("button", { name: "Actions for Review tags" })).toHaveAttribute(
      "aria-haspopup",
      "menu",
    );
    // No manager is left: the page header holds the list's own actions.
    expect(screen.queryByRole("button", { name: "Manage reviews" })).not.toBeInTheDocument();
    for (const name of ["Import", "Export all", "New review"])
      expect(screen.getByRole("button", { name })).toBeEnabled();
    expect(screen.getByText("2 reviews · saved to your account")).toBeInTheDocument();
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
    fireEvent.click(await screen.findByRole("button", { name: "New review" }));
    // New reviews ask only for their kind, name and description first.
    const dialog = screen.getByRole("dialog", { name: "New review" });
    expect(within(dialog).getByLabelText("Review name")).toHaveFocus();
    expect(screen.queryByRole("tab", { name: "Actions" })).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Entity type"), {
      target: { value: "tag" },
    });
    fireEvent.change(screen.getByLabelText("Review name"), {
      target: { value: "Group tags" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create & configure" }));
    await waitFor(() => expect(api.saveReviews).toHaveBeenCalled());
    const created = savedList(0)[0];
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
    expect(screen.queryByRole("dialog", { name: "New review" })).not.toBeInTheDocument();
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
    // Duplicate saves the copy at once and opens it in its drawer, of the same kind.
    await chooseFromMore("Duplicate");
    const drawer = await screen.findByRole("dialog", { name: "Edit review" });
    expect(within(drawer).getByLabelText("Entity type")).toBeDisabled();
    expect(within(drawer).getByLabelText("Entity type")).toHaveValue("tag");
    expect(within(drawer).getByLabelText("Review name")).toHaveValue("Review tags copy");
    expect(savedList(0)[1]).toEqual({
      ...tagReview,
      id: expect.any(String),
      name: "Review tags copy",
    });
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

  it("places the review's own management in the header's More menu", async () => {
    render(<DataQualityPage onNavigate={vi.fn()} />);

    await screen.findByRole("heading", { name: "Reviewing this video" });
    const heading = screen.getByRole("heading", { name: review.name });
    const more = screen.getByRole("button", { name: "More review options" });

    expect(heading.closest("header")).toContainElement(more);
    expect(more).toContainHTML("svg");
    expect(more).toHaveTextContent("");
    await waitFor(() => expect(more).toBeEnabled());
    fireEvent.click(more);
    const menu = screen.getByRole("menu", { name: "More review options" });
    expect(within(menu).getAllByRole("menuitem").map((item) => item.textContent)).toEqual([
      "Edit review",
      "Duplicate",
      "Export",
      "Delete…",
      "All reviews",
    ]);
    expect(within(menu).getAllByRole("separator")).toHaveLength(2);
    // Edit review opens the drawer, as the header's Edit review button does.
    fireEvent.click(within(menu).getByRole("menuitem", { name: "Edit review" }));
    expect(await screen.findByRole("dialog", { name: "Edit review" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    // All reviews returns to the list, whose heading takes focus.
    await chooseFromMore("All reviews");
    await waitFor(() => expect(screen.getByRole("heading", { name: "Data Quality" })).toHaveFocus());
    expect(window.location.search).toBe("");
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
    // Each review counts on its own, and says what it counts.
    expect(
      await within(browser).findByRole("cell", { name: "2 matching videos" }),
    ).toBeInTheDocument();
    expect(
      await within(browser).findByRole("cell", { name: "17 matching videos" }),
    ).toBeInTheDocument();
    expect(within(browser).getByRole("status")).toHaveTextContent(
      "Review counts loaded.",
    );
    expect(api.findMedia).toHaveBeenCalledWith(
      review,
      expect.objectContaining({ page: 1, perPage: 1 }),
      expect.anything(),
    );

    expect(listedReviews()).toEqual(["Other", "Review"]);
    const header = (name: string) => within(browser).getByRole("columnheader", { name });
    expect(header("Review")).toHaveAttribute("aria-sort", "ascending");
    expect(header("Matching")).not.toHaveAttribute("aria-sort");
    // The direction button names the order in effect.
    fireEvent.click(within(browser).getByRole("button", { name: "Sort direction: ascending" }));
    expect(listedReviews()).toEqual(["Review", "Other"]);
    expect(header("Review")).toHaveAttribute("aria-sort", "descending");
    fireEvent.click(within(browser).getByRole("button", { name: "Sort direction: descending" }));
    fireEvent.change(within(browser).getByLabelText("Sort by"), {
      target: { value: "count" },
    });
    expect(within(browser).getByLabelText("Sort by")).toHaveDisplayValue("Matching items");
    expect(header("Matching")).toHaveAttribute("aria-sort", "ascending");
    expect(header("Review")).not.toHaveAttribute("aria-sort");
    expect(listedReviews()).toEqual(["Review", "Other"]);
    fireEvent.click(within(browser).getByRole("button", { name: "Sort direction: ascending" }));
    expect(listedReviews()).toEqual(["Other", "Review"]);

    fireEvent.click(within(browser).getByRole("link", { name: /Other/ }));
    expect(
      await screen.findByRole("heading", { name: "Other" }),
    ).toBeInTheDocument();
    expect(window.location.search).toContain("review=other");

    await waitFor(() => expect(screen.getByRole("button", { name: "All reviews" })).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "All reviews" }));
    const heading = await screen.findByRole("heading", { name: "Data Quality" });
    await waitFor(() => expect(heading).toHaveFocus());
    // The sort order stays, and every review counts again.
    expect(listedReviews()).toEqual(["Other", "Review"]);
    expect(within(screen.getByRole("region", { name: "Reviews" })).getByLabelText("Sort by")).toHaveValue("count");
    await waitFor(() =>
      expect(
        api.findMedia.mock.calls.filter(([, filter]) => Number(filter.perPage) === 1),
      ).toHaveLength(4),
    );
  });

  it("opens a review from its name only on a plain click, leaving modified clicks to the browser", async () => {
    window.history.replaceState(null, "", "/data-quality");
    // Whether the page kept each click from the browser (which would follow the link).
    const handledByPage: boolean[] = [];
    const record = (event: MouseEvent) => {
      handledByPage.push(event.defaultPrevented);
      event.preventDefault();
    };
    document.addEventListener("click", record);
    render(<DataQualityPage onNavigate={vi.fn()} />);
    const link = await screen.findByRole("link", { name: /Review/ });
    // A Ctrl or Shift click opens the review's URL in a new tab or window, as for any link.
    fireEvent.click(link, { ctrlKey: true });
    fireEvent.click(link, { shiftKey: true });
    expect(handledByPage).toEqual([false, false]);
    expect(screen.getByRole("heading", { name: "Data Quality" })).toBeInTheDocument();
    fireEvent.click(link);
    expect(handledByPage).toEqual([false, false, true]);
    expect(await screen.findByRole("heading", { name: "Reviewing this video" })).toBeInTheDocument();
    document.removeEventListener("click", record);
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
  window.history.replaceState(null, "", "/data-quality");
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("region", { name: "Reviews" });
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
  expect(screen.getByRole("button", { name: "Import" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Actions for Review" }));
  for (const item of ["Edit", "Duplicate", "Delete…"])
    expect(screen.getByRole("menuitem", { name: item })).toBeDisabled();
  expect(screen.getByRole("menuitem", { name: "Export" })).toBeEnabled();
  await act(async () => finish("[]"));
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "New review" })).toBeEnabled(),
  );
  expect(announced()).toBe("Nothing to import: the file holds no reviews.");
  expect(api.saveReviews).not.toHaveBeenCalled();
});

it("imports the reviews a file adds, keeps the ones already listed, and says so", async () => {
  window.history.replaceState(null, "", "/data-quality");
  const added = { ...review, id: "added", name: "Added review", description: "" };
  // The listed review's count fails at first.
  api.findMedia.mockRejectedValueOnce(new Error("Offline"));
  render(<DataQualityPage onNavigate={vi.fn()} />);
  expect(
    await screen.findByRole("cell", { name: "Matching video count unavailable" }),
  ).toBeInTheDocument();
  chooseImportFile(JSON.stringify([{ ...review, name: "Changed elsewhere" }, added]));
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalledTimes(1));
  // The listed review keeps its own version; the new one is added after it.
  expect(savedList(0)).toEqual([review, added]);
  await waitFor(() =>
    expect(announced()).toBe("Imported 1 review. 1 review already in the list stays as it is."),
  );
  expect(screen.getByText(announced(), { selector: ".dq-status" })).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  expect(listedReviews()).toEqual(["Added review", "Review"]);
  // The added review is counted, and so is the one whose count failed; counted ones keep theirs.
  await waitFor(() =>
    expect(api.findMedia.mock.calls.map(([target]) => target.id)).toEqual([
      "review",
      "review",
      "added",
    ]),
  );
  expect(await screen.findAllByRole("cell", { name: "2 matching videos" })).toHaveLength(2);
  // The same file again adds nothing and saves nothing (its change keeps the saved list).
  chooseImportFile(JSON.stringify([added]));
  await waitFor(() =>
    expect(announced()).toBe("Nothing imported: the reviews in this file are already in the list."),
  );
  expect(account.written.filter(Boolean)).toHaveLength(1);
  expect(api.findMedia).toHaveBeenCalledTimes(3);
});

it("refuses a file that is not a review file, or too large, without changing anything", async () => {
  window.history.replaceState(null, "", "/data-quality");
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("region", { name: "Reviews" });
  chooseImportFile("not json", "notes.json");
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Could not import “notes.json”. It is not a JSON file.",
  );
  chooseImportFile(JSON.stringify([{ id: "broken", name: "Broken" }]), "broken.json");
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not import “broken.json”. It does not hold valid Data Quality reviews.",
    ),
  );
  const large = new File(["[]"], "large.json", { type: "application/json" });
  Object.defineProperty(large, "size", { value: 2_000_001 });
  fireEvent.change(document.querySelector("input[type=file]")!, { target: { files: [large] } });
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent("Review files must be smaller than 2 MB."),
  );
  expect(api.saveReviews).not.toHaveBeenCalled();
  expect(listedReviews()).toEqual(["Review"]);
});

it("keeps a refused import's reason until the next action, while a result goes after a while", async () => {
  window.history.replaceState(null, "", "/data-quality");
  // Timers that also run on their own, so Testing Library's waits keep working.
  vi.useFakeTimers({ shouldAdvanceTime: true, toFake: ["setTimeout", "clearTimeout"] });
  try {
    api.saveReviews.mockRejectedValueOnce(
      new StaleReviewsError(
        "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving.",
      ),
    );
    render(<DataQualityPage onNavigate={vi.fn()} />);
    await screen.findByRole("region", { name: "Reviews" });
    chooseImportFile(JSON.stringify([{ ...review, id: "added", name: "Added review" }]));
    // The list keeps no draft, so the reason is worded for it.
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not import “reviews.json”. Reviews changed in another browser. Reload the page to get them, then try again.",
    );
    expect(listedReviews()).toEqual(["Review"]);
    await act(async () => {});
    act(() => vi.advanceTimersByTime(10_000));
    expect(screen.getByRole("alert")).toBeInTheDocument();
    chooseImportFile(JSON.stringify([{ ...review, id: "added", name: "Added review" }]));
    await waitFor(() => expect(announced()).toBe("Imported 1 review."));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    // Its effects run first, then the time passes.
    await act(async () => {});
    act(() => vi.advanceTimersByTime(6_000));
    expect(announced()).toBe("");
    expect(screen.queryByText("Imported 1 review.")).not.toBeInTheDocument();
  } finally {
    vi.useRealTimers();
  }
});

it("exports one review, and all of them, as review files Import reads back", async () => {
  window.history.replaceState(null, "", "/data-quality");
  const other = { ...review, id: "other", name: "Other review" };
  api.loadReviews.mockResolvedValue({ reviews: [review, other], storageKey: "reviews", canWrite: true });
  const downloads = captureDownloads();
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("region", { name: "Reviews" });
  chooseFromRow("Other review", "Export");
  fireEvent.click(screen.getByRole("button", { name: "Export all" }));
  expect(downloads.files.map((file) => file.name)).toEqual([
    "data-quality-review-other-review.json",
    "data-quality-reviews.json",
  ]);
  expect(await downloads.contents(0)).toEqual([other]);
  expect(await downloads.contents(1)).toEqual([review, other]);
  // Exporting changes nothing.
  expect(api.saveReviews).not.toHaveBeenCalled();
});

it("deletes a review from its row after an in-page confirmation, then focuses the next review", async () => {
  window.history.replaceState(null, "", "/data-quality");
  const reviews = ["Alpha", "Beta", "Gamma"].map((name) => ({
    ...review,
    id: name.toLowerCase(),
    name,
  }));
  api.loadReviews.mockResolvedValue({ reviews, storageKey: "reviews", canWrite: true });
  const confirm = vi.spyOn(window, "confirm");
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("region", { name: "Reviews" });
  chooseFromRow("Beta", "Delete…");
  let dialog = screen.getByRole("dialog", { name: "Delete review?" });
  expect(dialog).toHaveTextContent(
    "“Beta” will be deleted. Export it first to keep a copy you can import again.",
  );
  // Cancel keeps it, and focus goes back to its menu.
  fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Actions for Beta" })).toHaveFocus();
  expect(api.saveReviews).not.toHaveBeenCalled();

  chooseFromRow("Beta", "Delete…");
  dialog = screen.getByRole("dialog", { name: "Delete review?" });
  fireEvent.click(within(dialog).getByRole("button", { name: "Delete review" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(savedList()).toEqual([reviews[0], reviews[2]]);
  expect(listedReviews()).toEqual(["Alpha", "Gamma"]);
  expect(screen.getByRole("link", { name: /Gamma/ })).toHaveFocus();
  expect(announced()).toBe("Deleted “Beta”.");
  // The last one hands focus to the one before it; the browser's confirm is never used.
  chooseFromRow("Gamma", "Delete…");
  fireEvent.click(screen.getByRole("button", { name: "Delete review" }));
  await waitFor(() => expect(screen.getByRole("link", { name: /Alpha/ })).toHaveFocus());
  expect(confirm).not.toHaveBeenCalled();
});

it("says under the header why a deletion failed, and gives focus back to the menu", async () => {
  window.history.replaceState(null, "", "/data-quality");
  let fail!: (error: Error) => void;
  api.saveReviews.mockImplementationOnce(
    () => new Promise<void>((_resolve, reject) => (fail = reject)),
  );
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("region", { name: "Reviews" });
  chooseFromRow("Review", "Delete…");
  fireEvent.click(screen.getByRole("button", { name: "Delete review" }));
  // While it saves, the dialog stays, Esc does not close it, and the list offers no other change.
  expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
  expect(screen.getByRole("dialog", { name: "Delete review?" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Import" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "New review" })).toBeDisabled();
  await act(async () =>
    fail(new Error("Saved filter write permission is required to save account reviews.")),
  );
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByRole("alert")).toHaveTextContent(
    "“Review” was not deleted. Saved filter write permission is required to save account reviews.",
  );
  expect(screen.getByRole("button", { name: "Actions for Review" })).toHaveFocus();
  expect(listedReviews()).toEqual(["Review"]);
  expect(screen.getByRole("button", { name: "Import" })).toBeEnabled();
});

it("says in an open review why deleting it failed, in the list's words", async () => {
  api.saveReviews.mockRejectedValueOnce(
    new StaleReviewsError(
      "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving.",
    ),
  );
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  await chooseFromMore("Delete…");
  fireEvent.click(screen.getByRole("button", { name: "Delete review" }));
  const alert = await screen.findByText(/^“Review” was not deleted\./);
  expect(alert).toHaveAttribute("role", "alert");
  expect(alert).toHaveTextContent(
    "“Review” was not deleted. Reviews changed in another browser. Reload the page to get them, then try again.",
  );
  // It shows under the review's header, which keeps the review open.
  expect(alert.closest(".dq-review-workspace")).not.toBeNull();
  expect(screen.getByRole("heading", { name: "Reviewing this video" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "More review options" })).toHaveFocus();
});

it("deletes the open review from its More menu and returns to the list's heading", async () => {
  const other = { ...review, id: "other", name: "Other review" };
  api.loadReviews.mockResolvedValue({ reviews: [review, other], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  await chooseFromMore("Delete…");
  fireEvent.click(screen.getByRole("button", { name: "Delete review" }));
  const heading = await screen.findByRole("heading", { name: "Data Quality" });
  await waitFor(() => expect(heading).toHaveFocus());
  expect(savedList()).toEqual([other]);
  expect(listedReviews()).toEqual(["Other review"]);
  expect(window.location.search).toBe("");
  expect(announced()).toBe("Deleted “Review”.");
});

it("duplicates a review from its row at once under a free copy name, then opens the copy in its drawer", async () => {
  const entries = freshHistory("/data-quality");
  const earlier = { ...review, id: "earlier-copy", name: "Review copy" };
  api.loadReviews.mockResolvedValue({ reviews: [review, earlier], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("region", { name: "Reviews" });
  chooseFromRow("Review", "Duplicate");
  // No dialog asks for a name first.
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalledTimes(1));
  const [original, kept, copy] = savedList(0);
  expect([original, kept]).toEqual([review, earlier]);
  expect(copy).toEqual({ ...review, id: expect.any(String), name: "Review copy 2" });
  expect(copy.id).not.toBe(review.id);
  // It opens in its drawer, to be renamed there, in a history entry of its own.
  const drawer = await screen.findByRole("dialog", { name: "Edit review" });
  expect(within(drawer).getByLabelText("Review name")).toHaveValue("Review copy 2");
  expect(window.location.search).toContain(`review=${copy.id}`);
  expect(window.history.length).toBe(entries + 1);
});

it("says why a duplicate was not saved, and holds the list's other changes while it saves", async () => {
  window.history.replaceState(null, "", "/data-quality");
  let fail!: (error: Error) => void;
  api.saveReviews.mockImplementationOnce(
    () => new Promise<void>((_resolve, reject) => (fail = reject)),
  );
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("region", { name: "Reviews" });
  chooseFromRow("Review", "Duplicate");
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalledTimes(1));
  expect(screen.getByRole("button", { name: "Import" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "New review" })).toBeDisabled();
  await act(async () =>
    fail(
      new StaleReviewsError(
        "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving.",
      ),
    ),
  );
  expect(screen.getByRole("alert")).toHaveTextContent(
    "“Review” was not duplicated. Reviews changed in another browser. Reload the page to get them, then try again.",
  );
  expect(listedReviews()).toEqual(["Review"]);
  expect(screen.getByRole("button", { name: "Actions for Review" })).toHaveFocus();
  expect(screen.getByRole("button", { name: "Import" })).toBeEnabled();
  expect(window.location.search).toBe("");
});

it("remembers the list's sort in this browser for the next visit", async () => {
  window.history.replaceState(null, "", "/data-quality");
  const reviews = [
    { ...review, id: "a", name: "Alpha" },
    { ...review, id: "b", name: "Beta" },
    { ...review, id: "c", name: "Gamma" },
  ];
  const counts: Record<string, number> = { a: 5, b: 17, c: 2 };
  api.loadReviews.mockResolvedValue({ reviews, storageKey: "reviews", canWrite: true });
  api.findMedia.mockImplementation(async (target) => ({ items: [], totalCount: counts[target.id] }));
  const firstVisit = render(<DataQualityPage onNavigate={vi.fn()} />);
  let list = await screen.findByRole("region", { name: "Reviews" });
  expect(listedReviews()).toEqual(["Alpha", "Beta", "Gamma"]);
  fireEvent.change(within(list).getByLabelText("Sort by"), { target: { value: "count" } });
  fireEvent.click(within(list).getByRole("button", { name: "Sort direction: ascending" }));
  firstVisit.unmount();
  // The next visit (a reload, or back from elsewhere in Cove) sorts the same way.
  render(<DataQualityPage onNavigate={vi.fn()} />);
  list = await screen.findByRole("region", { name: "Reviews" });
  expect(within(list).getByLabelText("Sort by")).toHaveValue("count");
  expect(within(list).getByRole("button", { name: "Sort direction: descending" })).toBeInTheDocument();
  expect(within(list).getByRole("columnheader", { name: "Matching" })).toHaveAttribute(
    "aria-sort",
    "descending",
  );
  await within(list).findByRole("cell", { name: "2 matching videos" });
  await waitFor(() => expect(listedReviews()).toEqual(["Beta", "Alpha", "Gamma"]));
});

it("opens a review from the list in a history entry of its own, so Back returns to its row", async () => {
  const entries = freshHistory("/data-quality");
  const other = { ...review, id: "other", name: "Other" };
  api.loadReviews.mockResolvedValue({ reviews: [review, other], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("region", { name: "Reviews" });
  fireEvent.click(screen.getByRole("link", { name: /Other/ }));
  await screen.findByRole("heading", { name: "Reviewing this video" });
  const shownReview = () => new URLSearchParams(window.location.search).get("review");
  expect(shownReview()).toBe("other");
  expect(window.history.length).toBe(entries + 1);
  // Changes of the review's URL replace its entry.
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), {
    target: { value: "narrower" },
  });
  await waitFor(() => expect(window.location.search).toContain("q=narrower"));
  expect(window.history.length).toBe(entries + 1);
  // Back returns to the list, on the row of the review it came from.
  await goBack();
  expect(window.location.search).toBe("");
  expect(await screen.findByRole("region", { name: "Reviews" })).toBeInTheDocument();
  await waitFor(() => expect(screen.getByRole("link", { name: /Other/ })).toHaveFocus());
  // Edit on a row opens its review the same way.
  chooseFromRow("Review", "Edit");
  expect(await screen.findByRole("dialog", { name: "Edit review" })).toBeInTheDocument();
  expect(shownReview()).toBe("review");
  expect(window.history.length).toBe(entries + 1);
  await goBack();
  await waitFor(() =>
    expect(document.querySelector("[data-review-id='review']")).toHaveFocus(),
  );
  expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument();
});

it("goes back to the list's entry from All reviews or a deletion after opening a review from the list", async () => {
  const entries = freshHistory("/data-quality");
  const other = { ...review, id: "other", name: "Other" };
  api.loadReviews.mockResolvedValue({ reviews: [review, other], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("region", { name: "Reviews" });
  fireEvent.click(screen.getByRole("link", { name: /Other/ }));
  const back = await screen.findByRole("button", { name: "All reviews" });
  await waitFor(() => expect(back).toBeEnabled());
  fireEvent.click(back);
  // As the browser's Back does, rather than leave a second copy of the list behind.
  await waitFor(() => expect(window.location.search).toBe(""));
  const heading = await screen.findByRole("heading", { name: "Data Quality" });
  await waitFor(() => expect(heading).toHaveFocus());
  expect(window.history.length).toBe(entries + 1);
  // The review stays ahead in history: Forward opens it again.
  await goBack(1);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  expect(new URLSearchParams(window.location.search).get("review")).toBe("other");
  // Deleting a review opened from the list goes back the same way.
  await chooseFromMore("Delete…");
  fireEvent.click(screen.getByRole("button", { name: "Delete review" }));
  await waitFor(() => expect(window.location.search).toBe(""));
  await waitFor(() => expect(screen.getByRole("heading", { name: "Data Quality" })).toHaveFocus());
  expect(listedReviews()).toEqual(["Review"]);
  expect(announced()).toBe("Deleted “Other”.");
  expect(window.history.length).toBe(entries + 1);
  // Back in the list's own entry, not the review's entry turned into the list.
  expect(window.history.state).toBeNull();
  // Forward to the deleted review's entry shows the list, under the list's URL.
  await goBack(1);
  expect(window.location.search).toBe("");
  expect(listedReviews()).toEqual(["Review"]);
  expect(announced()).toBe("Deleted “Other”.");
});

it("goes back only once for All reviews pressed twice, and drops a review's notice on the browser's Back", async () => {
  const entries = freshHistory("/data-quality");
  api.loadReviews.mockResolvedValue({ reviews: [review], storageKey: "reviews", canWrite: true });
  api.saveReviews.mockRejectedValueOnce(new Error("Storage offline"));
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("region", { name: "Reviews" });
  fireEvent.click(screen.getByRole("link", { name: /Review/ }));
  await screen.findByRole("heading", { name: "Reviewing this video" });
  // A failed duplicate leaves its reason under the review's header.
  await chooseFromMore("Duplicate");
  expect(await screen.findByText("“Review” was not duplicated. Storage offline")).toHaveAttribute(
    "role",
    "alert",
  );
  await goBack();
  await screen.findByRole("region", { name: "Reviews" });
  expect(screen.queryByText(/was not duplicated/)).not.toBeInTheDocument();
  await goBack(1);
  const back = await screen.findByRole("button", { name: "All reviews" });
  await waitFor(() => expect(back).toBeEnabled());
  const landed = new Promise((resolve) => window.addEventListener("popstate", resolve, { once: true }));
  const goesBack = vi.spyOn(window.history, "back");
  fireEvent.click(back);
  fireEvent.click(back);
  // A second Back before the first lands would leave Data Quality (browsers go back twice).
  expect(goesBack).toHaveBeenCalledTimes(1);
  await act(async () => {
    await landed;
    await new Promise((resolve) => setTimeout(resolve, 50));
  });
  expect(window.location.search).toBe("");
  expect(window.history.length).toBe(entries + 1);
  expect(screen.getByRole("heading", { name: "Data Quality" })).toHaveFocus();
});

it("keeps a review in view while its duplicate saves, and stays where Back went meanwhile", async () => {
  const entries = freshHistory("/data-quality");
  api.loadReviews.mockResolvedValue({ reviews: [review], storageKey: "reviews", canWrite: true });
  let finish!: () => void;
  finish = holdNextSave();
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("region", { name: "Reviews" });
  fireEvent.click(screen.getByRole("link", { name: /Review/ }));
  await screen.findByRole("heading", { name: "Reviewing this video" });
  await chooseFromMore("Duplicate");
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalledTimes(1));
  // The review's own way back and its editor wait for the copy.
  expect(screen.getByRole("button", { name: "All reviews" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Edit review" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "More review options" }));
  expect(screen.getByRole("menuitem", { name: "All reviews" })).toBeDisabled();
  expect(screen.getByRole("menuitem", { name: "Edit review" })).toBeDisabled();
  fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
  // The browser's Back does not wait: the page stays on the list and says what was saved.
  await goBack();
  await screen.findByRole("region", { name: "Reviews" });
  await act(async () => finish());
  await waitFor(() => expect(announced()).toBe("Saved the copy “Review copy”."));
  expect(window.location.search).toBe("");
  expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument();
  expect(listedReviews()).toEqual(["Review", "Review copy"]);
  expect(window.history.length).toBe(entries + 1);
});

it("leaves the URL alone when a duplicate finishes saving after the page is gone", async () => {
  const entries = freshHistory("/data-quality");
  api.loadReviews.mockResolvedValue({ reviews: [review], storageKey: "reviews", canWrite: true });
  let finish!: () => void;
  finish = holdNextSave();
  const page = render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("region", { name: "Reviews" });
  chooseFromRow("Review", "Duplicate");
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalledTimes(1));
  // Cove shows another page meanwhile.
  page.unmount();
  window.history.replaceState(null, "", "/videos");
  await act(async () => finish());
  expect(window.location.pathname + window.location.search).toBe("/videos");
  expect(window.history.length).toBe(entries);
});

it("drops a pending Edit when Back leaves the review before its queue loads", async () => {
  freshHistory("/data-quality");
  api.loadReviews.mockResolvedValue({ reviews: [review], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("region", { name: "Reviews" });
  let load!: (page: { items: unknown[]; totalCount: number }) => void;
  api.findMedia.mockImplementation(
    (_review, filter) =>
      Number(filter.perPage) === 1
        ? Promise.resolve({ items: [], totalCount: 2 })
        : new Promise((resolve) => (load = resolve)),
  );
  chooseFromRow("Review", "Edit");
  await screen.findByRole("heading", { name: "Review" });
  await goBack();
  await screen.findByRole("region", { name: "Reviews" });
  api.findMedia.mockResolvedValue({ items: [video(1), video(2)], totalCount: 2 });
  await act(async () => load({ items: [video(1), video(2)], totalCount: 2 }));
  // Forward opens the review again, without the drawer asked for before.
  await goBack(1);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  await act(async () => new Promise((resolve) => setTimeout(resolve, 50)));
  expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument();
});

it("follows Back and Forward with one listener for the page's lifetime", async () => {
  // Cove's own popstate listener runs first and renders at once, which runs this page's pending
  // effects in the middle of the dispatch: a listener replaced then (as when deleting the open
  // review leaves for the list) would miss that Back.
  const added: unknown[] = [];
  const removed: unknown[] = [];
  const add = window.addEventListener.bind(window);
  const remove = window.removeEventListener.bind(window);
  vi.spyOn(window, "addEventListener").mockImplementation((type, listener, options) => {
    if (type === "popstate") added.push(listener);
    add(type, listener, options);
  });
  vi.spyOn(window, "removeEventListener").mockImplementation((type, listener, options) => {
    if (type === "popstate") removed.push(listener);
    remove(type, listener, options);
  });
  freshHistory("/data-quality");
  const other = { ...review, id: "other", name: "Other" };
  api.loadReviews.mockResolvedValue({ reviews: [review, other], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("region", { name: "Reviews" });
  expect(added).toHaveLength(1);
  const pageListener = added[0];
  fireEvent.click(screen.getByRole("link", { name: /Other/ }));
  await screen.findByRole("heading", { name: "Reviewing this video" });
  await chooseFromMore("Delete…");
  fireEvent.click(screen.getByRole("button", { name: "Delete review" }));
  await waitFor(() => expect(screen.getByRole("heading", { name: "Data Quality" })).toHaveFocus());
  fireEvent.click(screen.getByRole("link", { name: /Review/ }));
  await screen.findByRole("heading", { name: "Reviewing this video" });
  await goBack();
  await screen.findByRole("region", { name: "Reviews" });
  expect(removed).not.toContain(pageListener);
});

it("keeps a new review's draft open, exportable, when it cannot be saved", async () => {
  window.history.replaceState(null, "", "/data-quality");
  api.saveReviews.mockRejectedValueOnce(
    new Error("Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."),
  );
  const downloads = captureDownloads();
  render(<DataQualityPage onNavigate={vi.fn()} />);
  const newReviewButton = await screen.findByRole("button", { name: "New review" });
  newReviewButton.focus();
  fireEvent.click(newReviewButton);
  const dialog = screen.getByRole("dialog", { name: "New review" });
  // Nothing is saved without a name, which then takes focus.
  const create = within(dialog).getByRole("button", { name: "Create & configure" });
  create.focus();
  fireEvent.click(create);
  expect(within(dialog).getByRole("alert")).toHaveTextContent(
    "Name the review and complete every action step before saving.",
  );
  expect(within(dialog).getByLabelText("Review name")).toHaveFocus();
  fireEvent.change(within(dialog).getByLabelText("Review name"), {
    target: { value: "Draft review" },
  });
  expect(within(dialog).queryByRole("alert")).not.toBeInTheDocument();
  // Enter in the form creates the review, as Create & configure does.
  fireEvent.submit(dialog.querySelector("form")!);
  expect(await within(dialog).findByRole("alert")).toHaveTextContent(
    "Could not save reviews. Your edits are still open. Reviews changed in another browser.",
  );
  expect(within(dialog).getByLabelText("Review name")).toHaveValue("Draft review");
  fireEvent.click(within(dialog).getByRole("button", { name: "Export draft" }));
  expect(await downloads.contents(0)).toEqual([
    expect.objectContaining({ name: "Draft review", entityType: "video", actions: [] }),
  ]);
  expect(downloads.files[0].name).toBe("data-quality-review-draft-review.json");
  // Esc closes it, and focus goes back to New review.
  fireEvent(dialog, new Event("cancel", { cancelable: true }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(newReviewButton).toHaveFocus();
  expect(listedReviews()).toEqual(["Review"]);
});

it("keeps configuration read-only without saved filter write permission, and export available", async () => {
  window.history.replaceState(null, "", "/data-quality");
  api.loadReviews.mockResolvedValue({
    reviews: [review],
    storageKey: "reviews",
    canWrite: true,
    canConfigure: false,
    storage: "readOnly",
    storageNotice:
      "Account reviews are read-only. Saved filter write permission is required to save configuration and progress.",
  });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("region", { name: "Reviews" });
  expect(screen.getByText(/Account reviews are read-only/)).toHaveClass("dq-status");
  expect(screen.getByText("1 review · saved to your account, read-only")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "New review" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Import" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Export all" })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "Actions for Review" }));
  for (const item of ["Edit", "Duplicate", "Delete…"])
    expect(screen.getByRole("menuitem", { name: item })).toBeDisabled();
  expect(screen.getByRole("menuitem", { name: "Export" })).toBeEnabled();
  fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
  // The open review offers the same: nothing to change, but export and the way back.
  fireEvent.click(screen.getByRole("link", { name: /Review/ }));
  await screen.findByRole("heading", { name: "Reviewing this video" });
  const more = screen.getByRole("button", { name: "More review options" });
  await waitFor(() => expect(more).toBeEnabled());
  fireEvent.click(more);
  for (const item of ["Edit review", "Duplicate", "Delete…"])
    expect(screen.getByRole("menuitem", { name: item })).toBeDisabled();
  for (const item of ["Export", "All reviews"])
    expect(screen.getByRole("menuitem", { name: item })).toBeEnabled();
});

it("works in this browser only without saved filter read permission, and says so", async () => {
  window.history.replaceState(null, "", "/data-quality");
  api.loadReviews.mockResolvedValue({
    reviews: [review],
    storageKey: "reviews",
    canWrite: true,
    canConfigure: true,
    storage: "browser",
    storageNotice:
      "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage.",
  });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("region", { name: "Reviews" });
  expect(screen.getByText(/saved only in this browser/)).toHaveClass("dq-status");
  expect(screen.getByText("1 review · saved in this browser only")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "New review" })).toBeEnabled();
  expect(screen.getByRole("button", { name: "Import" })).toBeEnabled();
});

it("offers the unassigned legacy reviews for recovery on the list", async () => {
  window.history.replaceState(null, "", "/data-quality");
  localStorage.setItem("page-videos", JSON.stringify([{ ...review, id: "unowned" }]));
  const downloads = captureDownloads();
  try {
    render(<DataQualityPage onNavigate={vi.fn()} />);
    await screen.findByRole("region", { name: "Reviews" });
    fireEvent.click(screen.getByText("Unassigned legacy browser reviews"));
    fireEvent.click(screen.getByRole("button", { name: "Export unassigned reviews" }));
    expect(downloads.files[0].name).toBe("data-quality-unassigned-legacy-reviews.json");
    expect(await downloads.contents(0)).toEqual([{ ...review, id: "unowned" }]);
    expect(localStorage.getItem("page-videos")).toContain("unowned");
  } finally {
    localStorage.removeItem("page-videos");
  }
});

it("shows how to start when there are no reviews", async () => {
  window.history.replaceState(null, "", "/data-quality");
  api.loadReviews.mockResolvedValue({ reviews: [], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  expect(await screen.findByText("No reviews yet.")).toBeInTheDocument();
  expect(screen.getByText("New review creates one; Import adds the reviews in a review file.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Export all" })).toBeDisabled();
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
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
  const saved = savedList(0)[0];
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
  // Each answers the group named after the parent.
  expect(savedList(0)[0].actions).toEqual([
    review.actions[0],
    { id: expect.any(String), label: "Bedroom", steps: onlyOne(42), group: "Rooms" },
    { id: expect.any(String), label: "Kitchen", steps: onlyOne(41), group: "Rooms" },
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
  expect(savedList(0)[0].actions[0].steps).toEqual([
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
  expect(savedList(0)[0].actions[0].steps).toEqual([
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
  expect(savedList(0)[0]).toMatchObject({
    description: "Check metadata",
    view: {
      objectFilter: { organized: true },
      displayMode: "grid",
      startFrom: "end",
    },
  });
});

it("reopens the same media rule from the More menu after cancel without clearing its query", async () => {
  // Frames after the render, as in the browser: the More button is enabled again by then.
  Object.defineProperty(window, "requestAnimationFrame", {
    configurable: true,
    value: (callback: FrameRequestCallback) => window.setTimeout(() => callback(0), 0),
  });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  const original = window.location.search;
  for (let i = 0; i < 2; i++) {
    await chooseFromMore("Edit review");
    await screen.findByRole("dialog", { name: "Edit review" });
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await screen.findByRole("heading", { name: "Reviewing this video" });
    expect(window.location.search).toBe(original);
    // Focus goes back to the More button that opened the drawer.
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "More review options" })).toHaveFocus(),
    );
  }
});

it("creates media review details then configures the rule in the workspace", async () => {
  window.history.replaceState(null, "", "/data-quality");
  render(<DataQualityPage onNavigate={vi.fn()} />);
  fireEvent.click(await screen.findByRole("button", { name: "New review" }));
  expect(screen.queryByRole("tab", {name: "Queue"})).not.toBeInTheDocument();
  expect(screen.queryByRole("tab", {name: "Actions"})).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Review name"), {target: {value: "New media review"}});
  fireEvent.click(screen.getByRole("button", {name: "Create & configure"}));
  const drawer = await screen.findByRole("dialog", {name: "Edit review"});
  expect(screen.queryByRole("dialog", {name: "New review"})).not.toBeInTheDocument();
  // Opened from the list, in a history entry of its own.
  expect(window.history.state).toEqual({ dataQualityOpenedFromList: true });
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
  const saved = savedList()[0];
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
  expect(savedList()[0].presentation.annotationParents).toEqual([101]);
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
  expect(savedList()[0].view.objectFilter).toEqual({ organized: true });
  expect(api.findMedia.mock.calls.at(-1)?.[0].view.objectFilter).toEqual({ organized: true });
  expect(new URLSearchParams(window.location.search).get("filters")).toBe('{"organized":true}');
  expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument();
});

it("keeps a Single visit of a Grid review after saving it, until the saved layout changes", async () => {
  api.loadReviews.mockResolvedValueOnce({ reviews: [{ ...review, view: { ...review.view, reviewMode: "multiple" } }], storageKey: "reviews", canWrite: true });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  await switchLayout("Single");
  await screen.findByRole("heading", { name: "Reviewing this video" });
  let drawer = await openEditor();
  fireEvent.change(within(drawer).getByLabelText("Description"), { target: { value: "Updated description" } });
  fireEvent.click(within(drawer).getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument());
  expect(savedList()[0]).toMatchObject({
    description: "Updated description",
    view: { reviewMode: "multiple" },
  });
  // The visit stays in Single: only a saved change of the layout ends the header's switch.
  expect(screen.getByRole("heading", { name: "Reviewing this video" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Single" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.queryByRole("article", { name: "Video 1" })).not.toBeInTheDocument();
  // Saving Single video as the review's own layout keeps showing it, now as the saved one.
  drawer = await openEditor();
  fireEvent.click(within(drawer).getByRole("tab", { name: "Appearance" }));
  fireEvent.click(within(drawer).getByRole("radio", { name: "Single video" }));
  fireEvent.click(within(drawer).getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(savedList()[0].view.reviewMode).toBe("single"));
  await waitFor(() => expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument());
  expect(screen.getByRole("heading", { name: "Reviewing this video" })).toBeInTheDocument();
  // Grid is a visit again, and saving Grid as the layout keeps the grid.
  await switchLayout("Grid");
  await screen.findByRole("article", { name: "Video 1" });
  drawer = await openEditor();
  fireEvent.click(within(drawer).getByRole("tab", { name: "Appearance" }));
  expect(within(drawer).getByRole("radio", { name: "Single video" })).toBeChecked();
  fireEvent.click(within(drawer).getByRole("radio", { name: "Grid" }));
  fireEvent.click(within(drawer).getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(savedList()[0].view.reviewMode).toBe("multiple"));
  await waitFor(() => expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument());
  expect(screen.getByRole("article", { name: "Video 1" })).toBeInTheDocument();
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
  expect(savedList()[0].view.selectAllOnLoad).toBe(true);
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

it("ignores answer groups in the grid, where an action on the focused card moves on as before", async () => {
  const grouped = {
    ...review,
    stayUntilGroupsAnswered: true,
    view: { ...review.view, reviewMode: "multiple" as const },
    actions: [
      { ...review.actions[0], group: "Kind" },
      { id: "size", label: "Size", group: "Size", steps: [{ mode: "ADD" as const, tagIds: [4] }] },
    ],
  };
  api.loadReviews.mockResolvedValueOnce({ reviews: [grouped], storageKey: "reviews", canWrite: true });
  let remaining = [video(1), video(2), video(3)];
  api.findMedia.mockImplementation(async () => ({ items: remaining, totalCount: remaining.length }));
  api.runReviewAction.mockImplementation(async (_kind, _action, ids: number[]) => {
    remaining = remaining.filter((item) => !ids.includes(item.id));
  });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  const first = await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(first).toHaveFocus());
  expect(screen.queryByRole("list", { name: "Answer groups" })).toBeNull();
  expect(document.querySelector("[data-group-open]")).toBeNull();
  fireEvent.keyDown(first, { key: "q" });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(1));
  expect(api.runReviewAction.mock.calls[0][2]).toEqual([1]);
  await waitFor(() => expect(screen.getByRole("article", { name: "Video 2" })).toHaveFocus());
  expect(screen.queryByRole("article", { name: /^Video 1/ })).toBeNull();
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

it("opens Find action once for a held -, without typing its repeats into the search", async () => {
  openGrid();
  const first = await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(first).toHaveFocus());
  fireEvent.keyDown(first, { key: "-", code: "Slash" });
  const search = await screen.findByRole("combobox", { name: "Find an action" });
  expect(search).toHaveFocus();
  // The held key repeats into the field that now has focus; those keydowns type nothing.
  for (let i = 0; i < 3; i++)
    expect(fireEvent.keyDown(search, { key: "-", code: "Slash", repeat: true })).toBe(false);
  expect(search).toHaveValue("");
  expect(screen.getAllByRole("combobox", { name: "Find an action" })).toHaveLength(1);
  expect(findOptions()).toHaveLength(12);
});

it("puts the preview's keys where the review places its actions, and claims the fixed keys", async () => {
  const actions = numberedActions(2);
  actions[0] = { ...actions[0], shortcut: "k" } as (typeof actions)[number];
  openGrid(actions);
  const first = await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(first).toHaveFocus());
  fireEvent.keyDown(first, { key: "Enter" });
  const preview = await screen.findByRole("dialog", { name: "Review preview: Video 1" });
  // The keys that hold actions, and f, g, k, n, m, comma and period, which it always claims.
  expect(activeTestKeys().filter((key) => key.startsWith("overlay:")).sort()).toEqual(
    [
      "overlay:-",
      "overlay:q",
      "overlay:Shift+q",
      ...["f", "g", "k", "n", "m"].flatMap((key) => [`overlay:${key}`, `overlay:Shift+${key}`]),
      "overlay:,",
      "overlay:;",
      "overlay:<",
      "overlay:.",
      "overlay::",
      "overlay:>",
    ].sort(),
  );
  // An empty n steps nowhere now: it is an action key.
  expect(fireEvent.keyDown(preview, { key: "n" })).toBe(false);
  expect(screen.getByRole("dialog", { name: "Review preview: Video 1" })).toBe(preview);
  expect(api.runReviewAction).not.toHaveBeenCalled();
  const lines = [...preview.querySelectorAll<HTMLElement>(".dq-bar-line")];
  expect(lines.map((line) => [...line.querySelectorAll(".dq-bar-tile:not(.dq-bar-find) kbd")].map((key) => key.textContent))).toEqual([
    ["q"],
    ["k"],
  ]);
  fireEvent.keyDown(preview, { key: "k" });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(1));
  expect(api.runReviewAction.mock.calls[0][1].label).toBe("Action 1");
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

it("claims f, g and k in the grid while they hold no action, so they do nothing", async () => {
  openGrid(numberedActions(14));
  const first = await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(first).toHaveFocus());
  expect(activeTestKeys()).toContain("local:d");
  expect(activeTestKeys()).not.toContain("local:h");
  for (const key of ["f", "g", "k"]) {
    expect(activeTestKeys()).toContain(`local:${key}`);
    expect(activeTestKeys()).toContain(`local:Shift+${key}`);
  }
  // No Filters dialog on f, no go-to chord on g; the stroke is the page's.
  for (const init of [{ key: "f" }, { key: "g" }, { key: "k" }, { key: "G", shiftKey: true }])
    expect(fireEvent.keyDown(first, init)).toBe(false);
  await act(async () => {});
  expect(screen.queryByRole("dialog", { name: "Video filters" })).not.toBeInTheDocument();
  expect(testGlobalShortcuts.goTo).not.toHaveBeenCalled();
  expect(testKeyboardConflicts).toEqual([]);
  expect(api.runReviewAction).not.toHaveBeenCalled();
  // The Filters button still opens them.
  fireEvent.click(screen.getByRole("button", { name: "Filters" }));
  expect(await screen.findByRole("dialog", { name: "Video filters" })).toBeInTheDocument();
});

it("applies the actions pinned to g and k in the grid, whatever their place in the review", async () => {
  const actions = numberedActions(3);
  actions[0] = { ...actions[0], shortcut: "k" } as (typeof actions)[number];
  actions[2] = { ...actions[2], shortcut: "g" } as (typeof actions)[number];
  openGrid(actions);
  const first = await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(first).toHaveFocus());
  // The bar shows the Auto action on q first, then g and k on the second keyboard row.
  const lines = [...document.querySelectorAll<HTMLElement>(".dq-bar-line")];
  expect(lines.map((line) => [...line.querySelectorAll(".dq-bar-tile:not(.dq-bar-find) kbd")].map((key) => key.textContent))).toEqual([
    ["q"],
    ["g", "k"],
  ]);
  fireEvent.keyDown(first, { key: "g" });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(1));
  expect(api.runReviewAction.mock.calls[0][1].label).toBe("Action 3");
  expect(testGlobalShortcuts.goTo).not.toHaveBeenCalled();
  await waitFor(() => expect(screen.getByRole("button", { name: /Action 1/ })).toBeEnabled());
  fireEvent.keyDown(document.activeElement ?? document.body, { key: "k" });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(2));
  expect(api.runReviewAction.mock.calls[1][1].label).toBe("Action 1");
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
  expect(previous).toHaveAttribute("aria-keyshortcuts", "ArrowUp");
  expect(next).toHaveAttribute("aria-keyshortcuts", "ArrowDown");
  expect(previous.querySelector("kbd")).toHaveTextContent("↑");
  expect(next.querySelector("kbd")).toHaveTextContent("↓");
  expect(previous).toBeDisabled();
  expect(next).toBeEnabled();
  expect(within(preview).getByText("Actions apply to this video")).toBeInTheDocument();
  expect(preview).toHaveTextContent("0–9 jump to 0–90 %");
  expect(preview).toHaveTextContent("↑ ↓ previous / next");
  expect(preview).not.toHaveTextContent("volume");
  expect(preview).not.toHaveTextContent("N M");
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
  // ↓ and ↑ step through the page; the header follows.
  fireEvent.keyDown(preview, { key: "ArrowDown" });
  await screen.findByRole("dialog", { name: "Review preview: Video 2" });
  expect(within(preview).getByRole("button", { name: "Selected" })).toHaveAttribute("aria-pressed", "false");
  fireEvent.keyDown(preview, { key: "ArrowUp" });
  await screen.findByRole("dialog", { name: "Review preview: Video 1" });
  // Esc closes and hands focus back to the card.
  fireEvent.keyDown(preview, { key: "Escape" });
  expect(screen.queryByRole("dialog", { name: /Review preview/ })).not.toBeInTheDocument();
  await waitFor(() => expect(screen.getByRole("article", { name: "Video 1, selected" })).toHaveFocus());
});

it("steps through the page with ↑ and ↓ in the preview, within the page, once per press", async () => {
  api.findMedia.mockResolvedValue({ items: [video(1), video(2), video(3)], totalCount: 3 });
  const preview = await openPreview();
  const at = (id: number) => screen.getByRole("dialog", { name: `Review preview: Video ${id}` });
  // Nothing before the first item; the key is still the preview's.
  expect(fireEvent.keyDown(preview, { key: "ArrowUp" })).toBe(false);
  expect(at(1)).toBe(preview);
  fireEvent.keyDown(preview, { key: "ArrowDown" });
  await screen.findByRole("dialog", { name: "Review preview: Video 2" });
  // A held key's repeats step no further.
  fireEvent.keyDown(preview, { key: "ArrowDown", repeat: true });
  fireEvent.keyDown(preview, { key: "ArrowDown", repeat: true });
  expect(at(2)).toBe(preview);
  fireEvent.keyDown(preview, { key: "ArrowDown" });
  await screen.findByRole("dialog", { name: "Review preview: Video 3" });
  // Nothing after the last item on the page.
  fireEvent.keyDown(preview, { key: "ArrowDown" });
  expect(at(3)).toBe(preview);
  // Not while an action runs, wherever the action leaves the preview.
  let finish!: () => void;
  api.runReviewAction.mockImplementationOnce(() => new Promise<void>((resolve) => (finish = resolve)));
  fireEvent.keyDown(preview, { key: "q" });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(1));
  const during = screen.getByRole("dialog", { name: /Review preview/ }).getAttribute("aria-label");
  // The action leaves the preview on an item with one before it; ↑ still waits for the action.
  expect(within(preview).getByRole("button", { name: "Previous video" })).toBeDisabled();
  fireEvent.keyDown(preview, { key: "ArrowUp" });
  expect(screen.getByRole("dialog", { name: /Review preview/ })).toHaveAttribute("aria-label", during);
  await act(async () => finish());
});

it("no longer changes the volume on ↑ and ↓ in the preview", async () => {
  const preview = await openPreview();
  const media = document.createElement("video");
  media.volume = 0.5;
  preview.querySelector(".dq-preview-video")!.append(media);
  fireEvent.keyDown(preview, { key: "ArrowUp" });
  fireEvent.keyDown(preview, { key: "ArrowDown" });
  await screen.findByRole("dialog", { name: "Review preview: Video 2" });
  fireEvent.keyDown(preview, { key: "ArrowDown" });
  expect(media.volume).toBe(0.5);
});

it("jumps to 0 %, 10 %, … 90 % of the video on the digits in the preview", async () => {
  const preview = await openPreview();
  // Nothing before the player has said where it is: a transcoded stream may already have moved.
  fireEvent.keyDown(preview, { key: "5" });
  expect(testVideoControls.seekBy).not.toHaveBeenCalled();
  // The 60-second video, from where the player last said it is.
  act(() => reportTestVideoTime(12));
  fireEvent.keyDown(preview, { key: "5" });
  expect(testVideoControls.seekBy).toHaveBeenLastCalledWith(18);
  fireEvent.keyDown(preview, { key: "0" });
  expect(testVideoControls.seekBy).toHaveBeenLastCalledWith(-12);
  fireEvent.keyDown(preview, { key: "9" });
  expect(testVideoControls.seekBy).toHaveBeenLastCalledWith(42);
  // Not on a held key's repeats, with Alt, nor while Find action is open.
  const calls = vi.mocked(testVideoControls.seekBy).mock.calls.length;
  fireEvent.keyDown(preview, { key: "3", repeat: true });
  fireEvent.keyDown(preview, { key: "3", altKey: true });
  fireEvent.keyDown(preview, { key: "-" });
  const search = within(preview).getByRole("combobox", { name: "Find an action" });
  fireEvent.keyDown(search, { key: "3" });
  expect(testVideoControls.seekBy).toHaveBeenCalledTimes(calls);
  fireEvent.keyDown(search, { key: "Escape" });
  // A position heard for another video counts for nothing on the next one.
  fireEvent.keyDown(preview, { key: "ArrowDown" });
  await screen.findByRole("dialog", { name: "Review preview: Video 2" });
  const before = vi.mocked(testVideoControls.seekBy).mock.calls.length;
  fireEvent.keyDown(preview, { key: "1" });
  expect(testVideoControls.seekBy).toHaveBeenCalledTimes(before);
  act(() => reportTestVideoTime(0));
  fireEvent.keyDown(preview, { key: "1" });
  expect(testVideoControls.seekBy).toHaveBeenLastCalledWith(6);
});

it("jumps within a clip on the digits in the preview", async () => {
  api.findMedia.mockResolvedValue({
    items: [
      { ...video(1), parentVideoId: 9, clipStartSec: 30, clipEndSec: 50 },
      { ...video(2), parentVideoId: 9, clipStartSec: 30, clipEndSec: null },
    ],
    totalCount: 2,
  });
  const preview = await openPreview();
  act(() => reportTestVideoTime(35));
  // 50 % of the 20-second clip from 30 s is 40 s, 5 s on.
  fireEvent.keyDown(preview, { key: "5" });
  expect(testVideoControls.seekBy).toHaveBeenLastCalledWith(5);
  fireEvent.keyDown(preview, { key: "0" });
  expect(testVideoControls.seekBy).toHaveBeenLastCalledWith(-5);
  // A clip without an end runs to the end of its video (60 s): 90 % of 30 s from 30 s is 57 s.
  fireEvent.keyDown(preview, { key: "ArrowDown" });
  await screen.findByRole("dialog", { name: "Review preview: Video 2" });
  act(() => reportTestVideoTime(35));
  fireEvent.keyDown(preview, { key: "9" });
  expect(testVideoControls.seekBy).toHaveBeenLastCalledWith(22);
});

it.each([
  [{ key: "n" }, "Action 28"],
  [{ key: "M", shiftKey: true }, "Action 29"],
  [{ key: ",", code: "Comma" }, "Action 30"],
  [{ key: ";", code: "Comma", shiftKey: true }, "Action 30"],
  [{ key: ".", code: "Period" }, "Action 31"],
  [{ key: ":", code: "Period", shiftKey: true }, "Action 31"],
])("applies the action on %o in the preview", async (init, label) => {
  const preview = await openPreview(numberedActions(31));
  expect(fireEvent.keyDown(preview, init)).toBe(false);
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(1));
  expect(api.runReviewAction.mock.calls[0][1].label).toBe(label);
  expect(testVideoControls.seekBy).not.toHaveBeenCalled();
});

it.each([
  [{ key: "n" }, "Action 28"],
  [{ key: "m" }, "Action 29"],
  [{ key: ",", code: "Comma" }, "Action 30"],
  [{ key: "<", code: "Comma", shiftKey: true }, "Action 30"],
  [{ key: "." , code: "Period" }, "Action 31"],
  [{ key: ">", code: "Period", shiftKey: true }, "Action 31"],
])("applies the action on %o in the grid", async (init, label) => {
  openGrid(numberedActions(31));
  const first = await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(first).toHaveFocus());
  expect(fireEvent.keyDown(first, init)).toBe(false);
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(1));
  expect(api.runReviewAction.mock.calls[0][1].label).toBe(label);
});

it("applies nothing on the Finnish/Swedish < key, in the grid or its preview", async () => {
  const preview = await openPreview(numberedActions(31));
  fireEvent.keyDown(preview, { key: "<", code: "IntlBackslash" });
  fireEvent.keyDown(preview, { key: ">", code: "IntlBackslash", shiftKey: true });
  fireEvent.keyDown(preview, { key: "Escape" });
  const first = await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(first).toHaveFocus());
  fireEvent.keyDown(first, { key: "<", code: "IntlBackslash" });
  fireEvent.keyDown(first, { key: ">", code: "IntlBackslash", shiftKey: true });
  await act(async () => {});
  expect(api.runReviewAction).not.toHaveBeenCalled();
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
  fireEvent.keyDown(document.activeElement!, { key: "ArrowUp" });
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
  expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  // Pressed again, the bin lifts its narrowing and the queue is the saved one again.
  await waitFor(() => expect(within(bins).getByRole("button", { name: "Bin A 2" })).toBeEnabled());
  fireEvent.click(within(bins).getByRole("button", { name: "Bin A 2" }));
  await waitFor(() => expect(api.findMedia.mock.calls.at(-1)?.[0].view.objectFilter).toEqual({}));
  await waitFor(() =>
    expect(within(bins).getByRole("button", { name: "Bin A 2" })).toHaveAttribute("aria-pressed", "false"),
  );
  expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
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
  // An Esc composing a character belongs to the input method and clears nothing.
  fireEvent.keyDown(screen.getByRole("article", { name: "Video 2, selected" }), { key: "Escape", isComposing: true });
  fireEvent.keyDown(screen.getByRole("article", { name: "Video 2, selected" }), { key: "Escape", keyCode: 229 });
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
  expect(within(drawer).getByText("Unsaved changes, including the queue's criteria")).toBeInTheDocument();
  // Cancel asks first, as Esc and Close do; Discard confirms it.
  fireEvent.click(within(drawer).getByRole("button", { name: "Cancel" }));
  expect(screen.getByRole("dialog", { name: "Edit review" })).toBeInTheDocument();
  fireEvent.click(
    within(screen.getByRole("dialog", { name: "Discard unsaved changes?" })).getByRole("button", {
      name: "Discard",
    }),
  );
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

it("leaves focus in the drawer's tapped-open Group list while the grid's queue reloads", async () => {
  // Frames after the render, as in a browser, so the reload's new cards exist when focus is moved.
  Object.defineProperty(window, "requestAnimationFrame", {
    configurable: true,
    value: (callback: FrameRequestCallback) => window.setTimeout(() => callback(0), 0),
  });
  openGrid(numberedActions(2));
  const first = await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(first).toHaveFocus());
  const drawer = await openEditor();
  fireEvent.click(within(drawer).getByRole("tab", { name: "Actions" }));
  fireEvent.click(within(drawer).getByRole("button", { name: "Expand Action 1" }));
  // A tapped chevron gives focus to the list, which hangs on the page outside the drawer.
  const chevron = within(drawer).getByRole("button", { name: "Show groups" });
  fireEvent.pointerDown(chevron, { pointerType: "touch" });
  fireEvent.mouseDown(chevron);
  fireEvent.click(chevron);
  const list = screen.getByRole("listbox", { name: "Groups" });
  expect(list).toHaveFocus();
  expect(drawer.contains(list)).toBe(false);
  // The toolbar reloads the queue as the draft's preview, onto cards the focused one is not among:
  // the first new card becomes the one the keys act on, but focus stays in the open list.
  api.findMedia.mockResolvedValue({ items: [video(3)], totalCount: 1 });
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), {
    target: { value: "draft" },
  });
  const reloaded = await screen.findByRole("article", { name: "Video 3" });
  await waitFor(() => expect(reloaded).toHaveAttribute("aria-current", "true"));
  // A frame after the reload's render, in which the grid would have focused the card.
  await act(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
  expect(screen.getByRole("listbox", { name: "Groups" })).toHaveFocus();
  expect(reloaded).not.toHaveFocus();
});

it("closes the grid's drawer at once without changes, and asks first with them; Discard restores the queue", async () => {
  openGrid(numberedActions(2));
  await screen.findByRole("article", { name: "Video 1" });
  const before = window.location.search;
  let drawer = await openEditor();
  fireEvent.click(within(drawer).getByRole("button", { name: "Close editor" }));
  expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument();
  drawer = await openEditor();
  fireEvent.change(within(drawer).getByLabelText("Description"), { target: { value: "Changed" } });
  api.findMedia.mockResolvedValue({ items: [video(3)], totalCount: 1 });
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), {
    target: { value: "draft" },
  });
  await screen.findByRole("article", { name: "Video 3" });
  fireEvent.click(within(drawer).getByRole("button", { name: "Close editor" }));
  const confirm = screen.getByRole("dialog", { name: "Discard unsaved changes?" });
  // The review's keys stay paused while it asks.
  expect(activeTestKeys()).not.toContain("local:q");
  fireEvent.click(within(confirm).getByRole("button", { name: "Discard" }));
  expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument();
  expect(screen.queryByRole("dialog", { name: "Discard unsaved changes?" })).not.toBeInTheDocument();
  // As Cancel does: the queue as it was, its URL, nothing saved, focus back on Edit review.
  expect(await screen.findByRole("article", { name: "Video 1" })).toBeInTheDocument();
  expect(screen.getByRole("textbox", { name: "Search list" })).toHaveValue("");
  await waitFor(() => expect(window.location.search).toBe(before));
  expect(api.saveReviews).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Edit review" })).toHaveFocus();
  await waitFor(() => expect(activeTestKeys()).toContain("local:q"));
});

it("asks before Esc discards the workspace drawer's changes; Discard keeps the review as saved", async () => {
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  const drawer = await openEditor();
  const name = within(drawer).getByLabelText("Review name");
  fireEvent.change(name, { target: { value: "Renamed" } });
  name.focus();
  // Claimed, so the same Esc cannot also cancel the dialog it opens (Chrome would).
  expect(fireEvent.keyDown(name, { key: "Escape" })).toBe(false);
  let confirm = screen.getByRole("dialog", { name: "Discard unsaved changes?" });
  expect(within(confirm).getByRole("button", { name: "Keep editing" })).toHaveFocus();
  // Esc there keeps editing, back in the field it was pressed in.
  fireEvent(confirm, new Event("cancel", { cancelable: true }));
  expect(screen.queryByRole("dialog", { name: "Discard unsaved changes?" })).not.toBeInTheDocument();
  expect(name).toHaveFocus();
  expect(name).toHaveValue("Renamed");
  fireEvent.keyDown(name, { key: "Escape" });
  confirm = screen.getByRole("dialog", { name: "Discard unsaved changes?" });
  fireEvent.click(within(confirm).getByRole("button", { name: "Discard" }));
  expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument();
  expect(api.saveReviews).not.toHaveBeenCalled();
  expect(screen.getByRole("heading", { name: review.name })).toBeInTheDocument();
  await waitFor(() => expect(screen.getByRole("button", { name: "Edit review" })).toHaveFocus());
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
  expect(savedList()[0]).toMatchObject({
    description: "Checked in the grid",
    view: { filter: { q: "draft", page: 1 }, reviewMode: "multiple", startFrom: "end" },
  });
  // The saved review holds the queue's criteria now.
  expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
  expect(screen.getByText("Review saved.")).toBeInTheDocument();
});

/** A queue filter with the queue tag bin for a tag pressed on the saved (empty) filter. */
function binFilter(tagId: number) {
  return {
    _filterExpression: {
      operator: "AND",
      children: [{ filter: { tagsCriterion: { value: [tagId], modifier: "INCLUDES", depth: 0 } } }],
    },
  };
}
/** A video review with queue tag bins under one parent, in the given layout. */
function binnedReview(reviewMode: "single" | "multiple") {
  api.resolveTagTree.mockResolvedValue([100, 30]);
  api.findMedia.mockResolvedValue({
    items: [{ ...video(1), tags: [{ id: 30, name: "Bin A" }] }, video(2)],
    totalCount: 2,
  });
  api.loadReviews.mockResolvedValueOnce({
    reviews: [{ ...review, view: { ...review.view, reviewMode }, presentation: { binParents: [100] } }],
    storageKey: "reviews",
    canWrite: true,
  });
}
const savedView = (call: number) => savedList(call)[0].view;

it("counts a search made before the grid's drawer opened as unsaved, which Cancel leaves unsaved and Save keeps", async () => {
  openGrid(numberedActions(2));
  await screen.findByRole("article", { name: "Video 1" });
  api.findMedia.mockResolvedValue({ items: [video(3)], totalCount: 1 });
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), {
    target: { value: "temporary" },
  });
  await screen.findByRole("article", { name: "Video 3" });
  expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  let drawer = await openEditor();
  // Measured against the saved review, the queue's search is a change the drawer would save.
  expect(within(drawer).getByText("Unsaved changes, including the queue's criteria")).toBeInTheDocument();
  // So Esc asks before discarding the draft, as for any change, and Keep editing stays.
  fireEvent.keyDown(within(drawer).getByLabelText("Review name"), { key: "Escape" });
  const confirm = screen.getByRole("dialog", { name: "Discard unsaved changes?" });
  fireEvent.click(within(confirm).getByRole("button", { name: "Keep editing" }));
  expect(screen.getByRole("dialog", { name: "Edit review" })).toBeInTheDocument();
  // Cancel asks the same.
  fireEvent.click(within(drawer).getByRole("button", { name: "Cancel" }));
  fireEvent.click(
    within(screen.getByRole("dialog", { name: "Discard unsaved changes?" })).getByRole("button", {
      name: "Discard",
    }),
  );
  // Discarding saves nothing, and the queue keeps its temporary search.
  expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument();
  expect(api.saveReviews).not.toHaveBeenCalled();
  expect(screen.getByRole("textbox", { name: "Search list" })).toHaveValue("temporary");
  expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  // Save keeps what the drawer showed as unsaved.
  drawer = await openEditor();
  fireEvent.click(within(drawer).getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalledTimes(1));
  expect(savedView(0).filter).toMatchObject({ q: "temporary" });
  await waitFor(() =>
    expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument(),
  );
});

it("never saves a queue tag bin, from the grid's drawer or Save to review, and keeps it pressed", async () => {
  binnedReview("multiple");
  render(<DataQualityPage onNavigate={vi.fn()} />);
  const bins = await screen.findByRole("group", { name: "Tag bins on this page" });
  const bin = () => within(bins).getByRole("button", { name: /^Bin A/ });
  await waitFor(() => expect(bin()).toBeEnabled());
  fireEvent.click(bin());
  await waitFor(() => expect(bin()).toHaveAttribute("aria-pressed", "true"));
  // A bin alone leaves nothing to save: Reset lifts it, and Save to review is not offered.
  expect(screen.getByRole("button", { name: "Reset" })).toHaveAccessibleDescription(
    "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.",
  );
  expect(screen.queryByRole("button", { name: "Save to review" })).not.toBeInTheDocument();
  // Nor is it a change in the drawer, whose Save leaves it out.
  const drawer = await openEditor();
  expect(within(drawer).queryByText(/Unsaved changes/)).not.toBeInTheDocument();
  fireEvent.change(within(drawer).getByLabelText("Description"), { target: { value: "Binned" } });
  expect(within(drawer).getByText("Unsaved changes")).toBeInTheDocument();
  fireEvent.click(within(drawer).getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalledTimes(1));
  expect(savedList(0)[0].description).toBe("Binned");
  expect(savedView(0).objectFilter).toEqual({});
  await waitFor(() => expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument());
  // The bin stays pressed on the queue, which still differs by it alone.
  expect(bin()).toHaveAttribute("aria-pressed", "true");
  expect(api.findMedia.mock.calls.at(-1)?.[0].view.objectFilter).toEqual(binFilter(30));
  expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Save to review" })).not.toBeInTheDocument();
  // With a search as well, Save to review saves the search and not the bin.
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), { target: { value: "kept" } });
  const saveToReview = await screen.findByRole("button", { name: "Save to review" });
  await waitFor(() => expect(saveToReview).toBeEnabled());
  fireEvent.click(saveToReview);
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalledTimes(2));
  expect(savedView(1).filter).toMatchObject({ q: "kept" });
  expect(savedView(1).objectFilter).toEqual({});
  await screen.findByText("Queue saved to this review.");
  expect(bin()).toHaveAttribute("aria-pressed", "true");
  expect(screen.queryByRole("button", { name: "Save to review" })).not.toBeInTheDocument();
  // Never saved into the criteria, the bin still lifts from its chip, back to the saved queue.
  await waitFor(() => expect(bin()).toBeEnabled());
  fireEvent.click(bin());
  await waitFor(() => expect(api.findMedia.mock.calls.at(-1)?.[0].view.objectFilter).toEqual({}));
  await waitFor(() => expect(bin()).toHaveAttribute("aria-pressed", "false"));
  expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
  expect(api.saveReviews).toHaveBeenCalledTimes(2);
});

it("holds the grid's queue controls while Save to review saves, which writes once and lands on what it saved", async () => {
  openGrid(numberedActions(2));
  await screen.findByRole("article", { name: "Video 1" });
  const search = screen.getByRole("textbox", { name: "Search list" });
  fireEvent.change(search, { target: { value: "first" } });
  const save = await screen.findByRole("button", { name: "Save to review" });
  await waitFor(() => expect(save).toBeEnabled());
  let finish!: () => void;
  finish = holdNextSave();
  fireEvent.click(save);
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalledTimes(1));
  // Nothing reshapes the queue being saved meanwhile: no search, page, bin or Reset, no second
  // write, no other layout and no drawer.
  expect(search).toBeDisabled();
  const reset = screen.getByRole("button", { name: "Reset" });
  expect(reset).toBeDisabled();
  fireEvent.click(reset);
  expect(screen.getByRole("button", { name: "Save to review" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Save to review" }));
  expect(api.saveReviews).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("button", { name: "Single" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Edit review" })).toBeDisabled();
  await act(async () => finish());
  expect(savedView(0).filter).toMatchObject({ q: "first" });
  await screen.findByText("Queue saved to this review.");
  // The queue is the saved one now, and its controls are back.
  expect(search).toHaveValue("first");
  expect(search).toBeEnabled();
  expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
  expect(api.findMedia.mock.calls.at(-1)?.[1].q).toBe("first");
});

it("puts the grid's Save to review and Reset after Cards/Wall, just before More, and says when the queue starts to differ", async () => {
  openGrid(numberedActions(2));
  await screen.findByRole("article", { name: "Video 1" });
  const header = document.querySelector<HTMLElement>(".dq-grid-review header")!;
  const trail = header.querySelector<HTMLElement>(".dq-review-header-trail")!;
  const live = header.querySelector(":scope > [aria-live='polite']")!;
  expect(within(trail).queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
  expect(live).toBeEmptyDOMElement();
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), { target: { value: "narrow" } });
  const reset = await within(trail).findByRole("button", { name: "Reset" });
  const order = ["Single", "Grid", "Cards", "Wall", "Save to review", "Reset", "More review options"].map(
    (name) => within(trail).getByRole("button", { name }),
  );
  expect(within(trail).getAllByRole("button")).toEqual(order);
  expect(reset).toHaveAttribute(
    "title",
    "The queue differs from the saved review. Go back to the review's saved filters.",
  );
  expect(live).toHaveTextContent("The queue differs from the saved review.");
  // Nothing else is left for a row of its own.
  expect(header.querySelector(".dq-review-chips-end")).toBeNull();
  // The editor drawer previews the draft instead, and its Save review keeps the queue. The queue
  // still differs meanwhile, so closing the drawer has nothing new to announce.
  const drawer = await openEditor();
  expect(within(trail).queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
  expect(within(header).getByText("Previewing the draft")).toBeInTheDocument();
  expect(live).toHaveTextContent("The queue differs from the saved review.");
  fireEvent.click(within(drawer).getByRole("button", { name: "Cancel" }));
  fireEvent.click(
    within(screen.getByRole("dialog", { name: "Discard unsaved changes?" })).getByRole("button", {
      name: "Discard",
    }),
  );
  expect(await within(trail).findByRole("button", { name: "Save to review" })).toBeInTheDocument();
  expect(live).toHaveTextContent("The queue differs from the saved review.");
  // Reset goes back to the saved review, and the buttons leave.
  await waitFor(() => expect(within(trail).getByRole("button", { name: "Reset" })).toBeEnabled());
  fireEvent.click(within(trail).getByRole("button", { name: "Reset" }));
  await screen.findByText("Review queue defaults restored.");
  expect(within(trail).queryByRole("button", { name: "Save to review" })).not.toBeInTheDocument();
  expect(live).toBeEmptyDOMElement();
});

it("hands focus to More after the grid's Save to review and Reset, which the reload leaves there", async () => {
  openGrid(numberedActions(2));
  await screen.findByRole("article", { name: "Video 1" });
  const trail = document.querySelector<HTMLElement>(".dq-grid-review .dq-review-header-trail")!;
  const more = within(trail).getByRole("button", { name: "More review options" });
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), { target: { value: "kept" } });
  const save = await within(trail).findByRole("button", { name: "Save to review" });
  await waitFor(() => expect(save).toBeEnabled());
  save.focus();
  fireEvent.click(save);
  await screen.findByText("Queue saved to this review.");
  expect(within(trail).queryByRole("button", { name: "Save to review" })).not.toBeInTheDocument();
  await waitFor(() => expect(more).toHaveFocus());
  // Reset hands focus to More too, and the reload it starts leaves it there: the new focused
  // card is the one the keys act on.
  const search = screen.getByRole("textbox", { name: "Search list" });
  await waitFor(() => expect(search).toBeEnabled());
  // (Video 1 stays on the page, so its card is there for the reload to focus.)
  api.findMedia.mockResolvedValue({ items: [video(1), video(3)], totalCount: 2 });
  fireEvent.change(search, { target: { value: "again" } });
  await screen.findByRole("article", { name: "Video 3" });
  const reset = within(trail).getByRole("button", { name: "Reset" });
  await waitFor(() => expect(reset).toBeEnabled());
  api.findMedia.mockResolvedValue({ items: [video(1), video(2)], totalCount: 2 });
  reset.focus();
  fireEvent.click(reset);
  await screen.findByText("Review queue defaults restored.");
  await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() =>
    expect(document.querySelector(".dq-review-card.focused")).toHaveAttribute("aria-label", "Video 1"),
  );
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
  });
  expect(more).toHaveFocus();
});

it("announces nothing when Single or Grid opens on a queue that already differs, only a new difference", async () => {
  const live = () => document.querySelector(".dq-review-header > [aria-live='polite']")!;
  const message = "The queue differs from the saved review.";
  openGrid(numberedActions(2));
  await screen.findByRole("article", { name: "Video 1" });
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), { target: { value: "kept" } });
  await screen.findByRole("button", { name: "Reset" });
  expect(live()).toHaveTextContent(message);
  // The workspace opens knowing its query differs.
  await switchLayout("Single");
  await screen.findByRole("heading", { name: "Reviewing this video" });
  expect(await screen.findByRole("button", { name: "Reset" })).toBeInTheDocument();
  expect(live()).toBeEmptyDOMElement();
  // The grid learns it while reading the URL, which is no change either.
  await switchLayout("Grid");
  await screen.findByRole("article", { name: "Video 1" });
  const reset = await screen.findByRole("button", { name: "Reset" });
  await waitFor(() => expect(reset).toBeEnabled());
  expect(live()).toBeEmptyDOMElement();
  // Back to the saved queue and away from it again: that is announced.
  fireEvent.click(reset);
  await screen.findByText("Review queue defaults restored.");
  const search = screen.getByRole("textbox", { name: "Search list" });
  await waitFor(() => expect(search).toBeEnabled());
  fireEvent.change(search, { target: { value: "again" } });
  await screen.findByRole("button", { name: "Reset" });
  expect(live()).toHaveTextContent(message);
});

it("opens Single video in the saved direction when one grid drawer save changes both", async () => {
  openGrid(numberedActions(2));
  await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() =>
    expect(new URLSearchParams(window.location.search).get("startFrom")).toBe("beginning"),
  );
  const drawer = await openEditor();
  fireEvent.change(within(drawer).getByLabelText("Review direction"), { target: { value: "end" } });
  fireEvent.click(within(drawer).getByRole("tab", { name: "Appearance" }));
  fireEvent.click(within(drawer).getByRole("radio", { name: "Single video" }));
  fireEvent.click(within(drawer).getByRole("button", { name: "Save review" }));
  await screen.findByRole("heading", { name: "Reviewing this video" });
  expect(savedView(0)).toMatchObject({ startFrom: "end", reviewMode: "single" });
  // The workspace's query is the saved one: same direction, so nothing differs.
  expect(new URLSearchParams(window.location.search).get("startFrom")).toBe("end");
  await act(async () => {});
  expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
});

it("calls the grid's queue the saved one again once a cleared search matches it in all but form", async () => {
  // The saved filter has no search at all; the cleared field sends an empty one.
  openGrid(numberedActions(2));
  await screen.findByRole("article", { name: "Video 1" });
  const search = screen.getByRole("textbox", { name: "Search list" });
  fireEvent.change(search, { target: { value: "temporary" } });
  await screen.findByRole("button", { name: "Reset" });
  await waitFor(() => expect(search).toBeEnabled());
  fireEvent.change(search, { target: { value: "" } });
  await screen.findByText("Review queue defaults restored.");
  expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
});

it("offers no grid Save to review while the queue fails to load, as the drawer's Save waits too", async () => {
  openGrid(numberedActions(2));
  await screen.findByRole("article", { name: "Video 1" });
  api.findMedia.mockRejectedValueOnce(new Error("Queue offline"));
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), {
    target: { value: "failing" },
  });
  await screen.findByText("Queue offline");
  expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  const save = screen.getByRole("button", { name: "Save to review" });
  expect(save).toBeDisabled();
  fireEvent.click(save);
  expect(api.saveReviews).not.toHaveBeenCalled();
  // Reset still restores the saved queue.
  const reset = screen.getByRole("button", { name: "Reset" });
  await waitFor(() => expect(reset).toBeEnabled());
  fireEvent.click(reset);
  await waitFor(() =>
    expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument(),
  );
});

it("counts a search made before the workspace's drawer opened as unsaved, which Cancel leaves unsaved and Save keeps", async () => {
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), {
    target: { value: "temporary" },
  });
  await waitFor(() => expect(api.findMedia.mock.calls.at(-1)?.[1].q).toBe("temporary"));
  await screen.findByRole("button", { name: "Reset" });
  let drawer = await openEditor();
  expect(within(drawer).getByText("Unsaved changes, including the queue's criteria")).toBeInTheDocument();
  // The drawer hides Save to review and Reset, not the difference, which stays announced.
  expect(document.querySelector(".dq-review-header > [aria-live='polite']")).toHaveTextContent(
    "The queue differs from the saved review.",
  );
  fireEvent.keyDown(within(drawer).getByLabelText("Review name"), { key: "Escape" });
  const confirm = screen.getByRole("dialog", { name: "Discard unsaved changes?" });
  fireEvent(confirm, new Event("cancel", { cancelable: true }));
  expect(screen.getByRole("dialog", { name: "Edit review" })).toBeInTheDocument();
  fireEvent.click(within(drawer).getByRole("button", { name: "Cancel" }));
  fireEvent.click(
    within(screen.getByRole("dialog", { name: "Discard unsaved changes?" })).getByRole("button", {
      name: "Discard",
    }),
  );
  expect(api.saveReviews).not.toHaveBeenCalled();
  expect(screen.getByRole("textbox", { name: "Search list" })).toHaveValue("temporary");
  expect(await screen.findByRole("button", { name: "Reset" })).toBeInTheDocument();
  drawer = await openEditor();
  fireEvent.click(within(drawer).getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalledTimes(1));
  expect(savedView(0).filter).toMatchObject({ q: "temporary" });
  await waitFor(() => expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument());
  expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
});

it("never saves a queue tag bin carried into the workspace, from its drawer or Save to review", async () => {
  binnedReview("single");
  window.history.replaceState(
    null,
    "",
    `/data-quality?review=review&page=1&perPage=24&startFrom=beginning&filters=${encodeURIComponent(JSON.stringify(binFilter(30)))}`,
  );
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  expect(api.findMedia.mock.calls.at(-1)?.[0].view.objectFilter).toEqual(binFilter(30));
  // The bin narrows the queue, which Reset would lift, but there is nothing to save.
  expect(await screen.findByRole("button", { name: "Reset" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Save to review" })).not.toBeInTheDocument();
  const drawer = await openEditor();
  expect(within(drawer).queryByText(/Unsaved changes/)).not.toBeInTheDocument();
  fireEvent.change(within(drawer).getByLabelText("Description"), { target: { value: "Binned" } });
  fireEvent.click(within(drawer).getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalledTimes(1));
  expect(savedView(0).objectFilter).toEqual({});
  await waitFor(() => expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument());
  // A search with it: Save to review keeps the search, and the bin still narrows the queue.
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), { target: { value: "kept" } });
  const saveToReview = await screen.findByRole("button", { name: "Save to review" });
  await waitFor(() => expect(saveToReview).toBeEnabled());
  fireEvent.click(saveToReview);
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalledTimes(2));
  expect(savedView(1).filter).toMatchObject({ q: "kept" });
  expect(savedView(1).objectFilter).toEqual({});
  await waitFor(() =>
    expect(screen.queryByRole("button", { name: "Save to review" })).not.toBeInTheDocument(),
  );
  expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  expect(JSON.parse(new URLSearchParams(window.location.search).get("filters")!)).toEqual(binFilter(30));
});

it("keeps the grid's temporary criteria apart from the saved ones in a Single visit, and stays there after saving", async () => {
  openGrid(numberedActions(2));
  await screen.findByRole("article", { name: "Video 1" });
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), {
    target: { value: "temporary" },
  });
  await screen.findByRole("button", { name: "Reset" });
  await switchLayout("Single");
  await screen.findByRole("heading", { name: "Reviewing this video" });
  // The workspace gets the saved review, and the grid's search as its query.
  await waitFor(() => expect(api.findMedia.mock.calls.at(-1)?.[1].q).toBe("temporary"));
  expect(screen.getByRole("textbox", { name: "Search list" })).toHaveValue("temporary");
  expect(await screen.findByRole("button", { name: "Reset" })).toBeInTheDocument();
  // The drawer counts the search as unsaved; Cancel (after Discard) leaves it so.
  const drawer = await openEditor();
  expect(within(drawer).getByText("Unsaved changes, including the queue's criteria")).toBeInTheDocument();
  fireEvent.click(within(drawer).getByRole("button", { name: "Cancel" }));
  fireEvent.click(
    within(screen.getByRole("dialog", { name: "Discard unsaved changes?" })).getByRole("button", {
      name: "Discard",
    }),
  );
  // Reset goes back to the saved criteria, not to the grid's.
  const reset = await screen.findByRole("button", { name: "Reset" });
  await waitFor(() => expect(reset).toBeEnabled());
  fireEvent.click(reset);
  await waitFor(() => expect(api.findMedia.mock.calls.at(-1)?.[1].q).toBe(""));
  await waitFor(() =>
    expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument(),
  );
  expect(api.saveReviews).not.toHaveBeenCalled();
  // Save to review in the Single visit saves the queue and stays in Single.
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), { target: { value: "kept" } });
  const save = await screen.findByRole("button", { name: "Save to review" });
  await waitFor(() => expect(save).toBeEnabled());
  fireEvent.click(save);
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalledTimes(1));
  expect(savedView(0)).toMatchObject({ filter: { q: "kept" }, reviewMode: "multiple" });
  await screen.findByText("Queue saved to this review.");
  expect(screen.getByRole("heading", { name: "Reviewing this video" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Single" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
  // Back in the grid, a temporary search still shows as one.
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), { target: { value: "again" } });
  await screen.findByRole("button", { name: "Reset" });
  await switchLayout("Grid");
  await screen.findByRole("article", { name: "Video 1" });
  expect(screen.getByRole("textbox", { name: "Search list" })).toHaveValue("again");
  expect(await screen.findByRole("button", { name: "Reset" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Save to review" })).toBeInTheDocument();
});

it("opens a grid review's drawer from Edit in its row menu, once", async () => {
  const gridReview = {
    ...review,
    id: "grid",
    name: "Grid review",
    view: { ...review.view, reviewMode: "multiple" as const },
  };
  window.history.replaceState(null, "", "/data-quality");
  api.loadReviews.mockResolvedValueOnce({
    reviews: [review, gridReview],
    storageKey: "reviews",
    canWrite: true,
  });
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("region", { name: "Reviews" });
  chooseFromRow("Grid review", "Edit");
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

it("opens the workspace's drawer from Edit in its row menu only once, however often its layout changes", async () => {
  window.history.replaceState(null, "", "/data-quality");
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("region", { name: "Reviews" });
  chooseFromRow("Review", "Edit");
  const drawer = await screen.findByRole("dialog", { name: "Edit review" });
  fireEvent.click(within(drawer).getByRole("button", { name: "Cancel" }));
  await switchLayout("Grid");
  await screen.findByRole("article", { name: "Video 1" });
  await switchLayout("Single");
  await screen.findByRole("heading", { name: "Reviewing this video" });
  await act(async () => {});
  expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument();
});

it("opens a video grid review straight from a tag review without drawing the tags as videos", async () => {
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
  // Browser navigation switches reviews without passing through the list.
  await navigateTo("/data-quality?review=grid");
  expect(await screen.findByRole("heading", { name: "Grid review" })).toBeInTheDocument();
  expect(await screen.findByRole("article", { name: "Video 1" })).toBeInTheDocument();
  expect(screen.queryByRole("article", { name: "Tag 11" })).not.toBeInTheDocument();
});

it("holds the grid's queue controls while the drawer saves, and keeps Save focused", async () => {
  let finish!: () => void;
  finish = holdNextSave();
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

it("never saves the last review's queue as the next one's progress when navigation switches reviews", async () => {
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
  await navigateTo("/data-quality?review=grid");
  await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() =>
    expect(setItem.mock.calls.some(([key]) => key === "reviews:progress:grid")).toBe(true),
  );
  const saved = setItem.mock.calls
    .filter(([key]) => key === "reviews:progress:grid")
    .map(([, value]) => JSON.parse(value).filter.perPage);
  expect(saved.every((perPage) => perPage === 24)).toBe(true);
});

it("keeps Edit review, in the header and the More menu, off until an unreadable review URL is reset", async () => {
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
  const more = screen.getByRole("button", { name: "More review options" });
  await waitFor(() => expect(more).toBeEnabled());
  fireEvent.click(more);
  expect(screen.getByRole("menuitem", { name: "Edit review" })).toBeDisabled();
  expect(screen.getByRole("menuitem", { name: "Duplicate" })).toBeEnabled();
  fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
  fireEvent.click(within(error).getByRole("button", { name: "Reset to review defaults" }));
  await screen.findByRole("article", { name: "Video 1" });
  await chooseFromMore("Edit review");
  expect(await screen.findByRole("dialog", { name: "Edit review" })).toBeInTheDocument();
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

it("holds the grid's keys, its own Esc and Enter included, while a confirmation from More is open", async () => {
  openGrid(numberedActions(2));
  const first = await screen.findByRole("article", { name: "Video 1" });
  await waitFor(() => expect(first).toHaveFocus());
  fireEvent.click(screen.getByRole("button", { name: "Select Video 2" }));
  await chooseFromMore("Delete…");
  const dialog = screen.getByRole("dialog", { name: "Delete review?" });
  // Keys pressed with focus on the page itself (it can drop there) reach nothing behind it.
  for (const key of ["q", "Escape", "Enter", "ArrowRight"])
    fireEvent.keyDown(document.body, { key });
  expect(api.runReviewAction).not.toHaveBeenCalled();
  expect(screen.getByRole("article", { name: "Video 2, selected" })).toBeInTheDocument();
  expect(document.querySelector(".dq-preview")).toBeNull();
  expect(first).toHaveAttribute("aria-current", "true");
  fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
  // Closed, the same keys are the grid's again.
  fireEvent.keyDown(document.body, { key: "Escape" });
  expect(screen.queryByRole("article", { name: /selected/ })).not.toBeInTheDocument();
  fireEvent.keyDown(document.body, { key: "q" });
  await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(1));
});

it("never takes focus from the Delete confirmation to a card when the grid finishes loading", async () => {
  let finish!: (page: { items: unknown[]; totalCount: number }) => void;
  api.findMedia.mockImplementationOnce(
    () => new Promise((resolve) => (finish = resolve)),
  );
  openGrid(numberedActions(2));
  // The header, with More, is there while the queue still loads.
  await screen.findByRole("button", { name: "More review options" });
  expect(screen.queryByRole("article")).not.toBeInTheDocument();
  await chooseFromMore("Delete…");
  const cancel = within(screen.getByRole("dialog", { name: "Delete review?" })).getByRole(
    "button",
    { name: "Cancel" },
  );
  expect(cancel).toHaveFocus();
  await act(async () => finish({ items: [video(1), video(2)], totalCount: 2 }));
  expect(await screen.findByRole("article", { name: "Video 1" })).toBeInTheDocument();
  expect(cancel).toHaveFocus();
});

it("duplicates the open review from its More menu at once, opening the copy in its drawer in the same history entry", async () => {
  const entries = freshHistory("/data-quality?review=review");
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  await chooseFromMore("Duplicate");
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalledTimes(1));
  const [original, copy] = savedList(0);
  expect(original).toEqual(review);
  expect(copy).toEqual({ ...review, id: expect.any(String), name: "Review copy" });
  const drawer = await screen.findByRole("dialog", { name: "Edit review" });
  expect(within(drawer).getByLabelText("Review name")).toHaveValue("Review copy");
  expect(window.location.search).toContain(`review=${copy.id}`);
  // Within a review the URL changes in place, whichever review it names.
  expect(window.history.length).toBe(entries);
  // The keys wait while the copy's drawer is open, and come back when it closes.
  expect(activeTestKeys()).not.toContain("local:q");
  fireEvent.click(within(drawer).getByRole("button", { name: "Cancel" }));
  await waitFor(() => expect(activeTestKeys()).toContain("local:q"));
});

it("keeps a saving new review's dialog open on a second Esc, and hands focus back to the name after a failure", async () => {
  window.history.replaceState(null, "", "/data-quality");
  let fail!: (error: Error) => void;
  api.saveReviews.mockImplementationOnce(
    () => new Promise<void>((_resolve, reject) => (fail = reject)),
  );
  const showModal = vi.spyOn(HTMLDialogElement.prototype, "showModal");
  render(<DataQualityPage onNavigate={vi.fn()} />);
  fireEvent.click(await screen.findByRole("button", { name: "New review" }));
  const dialog = screen.getByRole("dialog", { name: "New review" });
  const name = within(dialog).getByLabelText("Review name");
  fireEvent.change(name, { target: { value: "Pending review" } });
  // Enter in the name creates it; the fields wait while it saves.
  fireEvent.submit(dialog.querySelector("form")!);
  await waitFor(() => expect(api.saveReviews).toHaveBeenCalledTimes(1));
  expect(name).toBeDisabled();
  expect(within(dialog).getByRole("button", { name: "Creating…" })).toHaveAttribute(
    "aria-disabled",
    "true",
  );
  // Esc is refused while saving; Chrome then closes a modal on a second Esc without asking.
  fireEvent(dialog, new Event("cancel", { cancelable: true }));
  const shown = showModal.mock.calls.length;
  dialog.removeAttribute("open");
  fireEvent(dialog, new Event("close"));
  expect(showModal).toHaveBeenCalledTimes(shown + 1);
  expect(screen.getByRole("dialog", { name: "New review" })).toBe(dialog);
  // Focus left the disabled name (Chrome drops it to the page); the failure gives it back.
  const elsewhere = document.body.appendChild(document.createElement("button"));
  elsewhere.focus();
  await act(async () => fail(new Error("Saved filter write permission is required to save account reviews.")));
  elsewhere.remove();
  expect(within(dialog).getByRole("alert")).toHaveTextContent(
    "Could not save reviews. Your edits are still open. Saved filter write permission is required",
  );
  expect(name).toBeEnabled();
  expect(name).toHaveFocus();
  expect(name).toHaveValue("Pending review");
});

describe("phone-sized windows", () => {
  it("gives the grid's bar and the preview plain buttons without key caps or key hints", async () => {
    setViewportWidth(390);
    const preview = await openPreview();
    // The grid's bar under the cards.
    const gridBar = document.querySelector<HTMLElement>(".dq-bar-dock .dq-action-bar")!;
    expect(gridBar).toHaveClass("dq-bar-mobile");
    expect(within(gridBar).getByRole("button", { name: "Action 1" })).toBeInTheDocument();
    expect(gridBar.querySelector(".dq-bar-tiles kbd")).toBeNull();
    expect(gridBar).not.toHaveTextContent("Arrows move");
    // The preview: its title on a line of its own, no key caps on its steps, no key hints.
    expect(preview).toHaveClass("dq-preview-mobile");
    const previous = within(preview).getByRole("button", { name: "Previous video" });
    const next = within(preview).getByRole("button", { name: "Next video" });
    expect(previous.querySelector("kbd")).toBeNull();
    expect(next.querySelector("kbd")).toBeNull();
    expect(next).toHaveAttribute("aria-keyshortcuts", "ArrowDown");
    expect(preview).not.toHaveTextContent("↑ ↓ previous / next");
    expect(preview).not.toHaveTextContent("Enter or Esc closes");
    const bar = within(preview).getByRole("region", { name: "Actions" });
    expect(bar).toHaveClass("dq-bar-mobile");
    expect(bar.querySelector(".dq-bar-tiles kbd")).toBeNull();
    expect(within(bar).getByRole("button", { name: "Find" })).toHaveTextContent(/^Find$/);
    // A tap applies the action to this video.
    fireEvent.click(within(bar).getByRole("button", { name: "Action 1" }));
    await waitFor(() => expect(api.runReviewAction).toHaveBeenCalledTimes(1));
    expect(api.runReviewAction.mock.calls[0][1].label).toBe("Action 1");
  });

  it("keeps Stay on this item from view to view until the page reloads, and never stores it", async () => {
    setViewportWidth(390);
    const storedBefore = [Object.keys(localStorage), Object.keys(sessionStorage)];
    openGrid();
    await screen.findByRole("article", { name: "Video 1" });
    await switchLayout("Single");
    await screen.findByRole("heading", { name: "Reviewing this video" });
    const toggle = await screen.findByRole("switch", { name: "Stay on this item" });
    expect(toggle).not.toBeChecked();
    fireEvent.click(toggle);
    expect(toggle).toBeChecked();
    await switchLayout("Grid");
    await screen.findByRole("article", { name: "Video 1" });
    expect(screen.queryByRole("switch", { name: "Stay on this item" })).not.toBeInTheDocument();
    await switchLayout("Single");
    await screen.findByRole("heading", { name: "Reviewing this video" });
    expect(await screen.findByRole("switch", { name: "Stay on this item" })).toBeChecked();
    expect([Object.keys(localStorage), Object.keys(sessionStorage)]).toEqual(storedBefore);
    // A reload starts with it off.
    cleanup();
    openGrid();
    await screen.findByRole("article", { name: "Video 1" });
    await switchLayout("Single");
    await screen.findByRole("heading", { name: "Reviewing this video" });
    expect(await screen.findByRole("switch", { name: "Stay on this item" })).not.toBeChecked();
  });
});
