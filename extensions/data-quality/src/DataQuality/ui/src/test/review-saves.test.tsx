import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { extensionFetch } from "@cove/runtime/api";
import { DataQualityPage } from "../index";
import type { Review } from "../model";

/**
 * Saves that overlap, through the real storage module (storage.ts) and a stand-in for Cove's
 * saved-filter API that can hold a configuration write: a duplicate and a Save to review both
 * land, whichever starts first, in the card grid and in the single-item workspace.
 */

const { api } = vi.hoisted(() => ({
  api: {
    loadProgress: vi.fn(),
    saveProgress: vi.fn(),
    findMedia: vi.fn(),
    findTags: vi.fn(),
    listTagGroups: vi.fn(),
    runReviewAction: vi.fn(),
    runTagReviewAction: vi.fn(),
    settleReviewWrites: vi.fn(),
    getConfirmedAbsentTagsFieldStatus: vi.fn(),
    createConfirmedAbsentTagsField: vi.fn(),
    resolveTagTree: vi.fn(),
  },
}));

// Reviews load and save for real; only the media side is a stand-in.
vi.mock("../api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../api")>()),
  ...api,
  videoCoverUrl: (video: { id: number }) => `/cover-${video.id}.jpg`,
  videoPreviewStatusUrl: (id: number) => `/preview-${id}/status`,
  videoPreviewUrl: (id: number) => `/preview-${id}.mp4`,
  videoScreenshotUrl: (video: { id: number }) => `/shot-${video.id}.jpg`,
  videoStreamUrl: (id: number) => `/stream-${id}.mp4`,
}));

const CONFIG_SCOPE = "ext:com.midnightrider.data-quality:configuration";

function video(id: number) {
  return {
    id,
    title: `Video ${id}`,
    details: "",
    date: "2026-01-01",
    studioId: null,
    organized: true,
    urls: [],
    tags: [],
    performers: [],
    groups: [],
    galleries: [],
    files: [{ id, basename: `${id}.mp4`, duration: 60, width: 1920, height: 1080 }],
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  };
}

function reviewFor(reviewMode: "single" | "multiple"): Review {
  return {
    id: "review",
    name: "Review",
    description: "Queue",
    view: {
      filter: { page: 1, perPage: 24 },
      objectFilter: {},
      displayMode: "grid",
      searchMode: "text",
      startFrom: "beginning",
      reviewMode,
    },
    actions: [{ id: "apply", label: "Apply", steps: [{ mode: "ADD", tagIds: [3] }] }],
  };
}

let record: { id: number; mode: string; name: string; uiOptions: string };
/** Configuration writes waiting for a test to let them through or refuse them, in order. */
let holds: Array<Promise<string | null>>;
let waiting: number;

/** The configuration the stand-in API holds now. */
function account(): { reviews: Review[]; deletedIds: string[] } {
  return JSON.parse(record.uiOptions);
}

/** Holds the next configuration write (holds made together apply to writes in turn). */
function holdWrite() {
  let decide!: (failure: string | null) => void;
  holds.push(new Promise<string | null>((resolve) => (decide = resolve)));
  return { release: () => decide(null), fail: (message: string) => decide(message) };
}

beforeEach(() => {
  window.history.replaceState(null, "", "/data-quality?review=review");
  localStorage.clear();
  holds = [];
  waiting = 0;
  record = {
    id: 1,
    mode: CONFIG_SCOPE,
    name: "Data Quality configuration",
    uiOptions: "",
  };
  vi.mocked(extensionFetch)
    .mockReset()
    .mockImplementation(async (path, options) => {
      const route = String(path);
      if (route === "/api/auth/me") return Response.json({ user: { id: "u" }, permissions: ["*"] });
      if (route.startsWith("/api/savedfilters?mode="))
        return Response.json(route.endsWith(encodeURIComponent(CONFIG_SCOPE)) ? [record] : []);
      if (route === `/api/savedfilters/${record.id}`) {
        if (options?.method === "PUT") {
          waiting++;
          const failure = await (holds.shift() ?? null);
          waiting--;
          if (failure) return Response.json({ message: failure }, { status: 500 });
          record = { ...record, ...JSON.parse(String(options.body)) };
        }
        return Response.json(record);
      }
      if (route.startsWith("/api/tags/"))
        return Response.json({ id: Number(route.split("/").at(-1)), name: "Tag" });
      const media = /^\/api\/videos\/(\d+)/.exec(route);
      if (media) return Response.json(video(Number(media[1])));
      return Response.json({ available: true });
    });
  api.findMedia.mockReset().mockResolvedValue({ items: [video(1), video(2)], totalCount: 2 });
  api.findTags.mockReset().mockResolvedValue({ items: [], totalCount: 0 });
  api.listTagGroups.mockReset().mockResolvedValue([]);
  api.runReviewAction.mockReset().mockResolvedValue(undefined);
  api.runTagReviewAction.mockReset().mockResolvedValue(undefined);
  api.loadProgress.mockReset().mockResolvedValue(null);
  api.saveProgress.mockReset().mockResolvedValue(undefined);
  api.settleReviewWrites.mockReset().mockResolvedValue(undefined);
  api.resolveTagTree.mockReset().mockResolvedValue([]);
  api.getConfirmedAbsentTagsFieldStatus
    .mockReset()
    .mockResolvedValue({ kind: "ready", definition: {}, message: "" });
  api.createConfirmedAbsentTagsField.mockReset().mockResolvedValue(undefined);
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
  Object.defineProperty(window, "requestAnimationFrame", {
    configurable: true,
    value: (callback: FrameRequestCallback) => callback(0),
  });
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: vi.fn(),
  });
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
      unobserve() {}
      takeRecords() {
        return [];
      }
    },
  );
});

function seed(...saved: Review[]) {
  record.uiOptions = JSON.stringify({
    version: 2,
    revision: "first",
    reviews: saved,
    deletedIds: [],
    importedIds: [],
  });
}

/** The browser's Back button: resolves once the page has followed it. */
async function goBack() {
  const landed = new Promise((resolve) => window.addEventListener("popstate", resolve, { once: true }));
  await act(async () => {
    window.history.go(-1);
    await landed;
  });
}

/** A grid review of its own, beside the one under test. */
const other = (): Review => ({ ...reviewFor("multiple"), id: "other", name: "Other" });

/** The saved review with the queue's temporary search saved into it. */
const withSearch = (saved: Review, q: string) => ({
  ...saved,
  view: { ...saved.view, filter: expect.objectContaining({ q }) },
});

/** Chooses an item of the open review's More menu. */
async function chooseFromMore(item: string) {
  const more = screen.getByRole("button", { name: "More review options" });
  await waitFor(() => expect(more).toBeEnabled());
  fireEvent.click(more);
  fireEvent.click(screen.getByRole("menuitem", { name: item }));
}

/** A temporary search makes the queue differ from the saved review; Save to review is offered. */
async function searchFor(text: string) {
  const search = screen.getByRole("textbox", { name: "Search list" });
  await waitFor(() => expect(search).toBeEnabled());
  fireEvent.change(search, { target: { value: text } });
  const save = await screen.findByRole("button", { name: "Save to review" });
  await waitFor(() => expect(save).toBeEnabled());
  return save;
}

const copyOf = (saved: Review, q?: string) => ({
  ...saved,
  id: expect.any(String),
  name: "Review copy",
  view: { ...saved.view, filter: q === undefined ? saved.view.filter : expect.objectContaining({ q }) },
});

it("keeps the grid's Save to review when Duplicate starts while it writes, and copies what it saved", async () => {
  const saved = reviewFor("multiple");
  seed(saved);
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  const save = await searchFor("temporary");
  const write = holdWrite();
  fireEvent.click(save);
  await waitFor(() => expect(waiting).toBe(1));
  await chooseFromMore("Duplicate");
  write.release();
  await screen.findByText("Queue saved to this review.");
  // Then the copy, of the review as saved by then, opens in its drawer.
  const drawer = await screen.findByRole("dialog", { name: "Edit review" });
  expect(within(drawer).getByLabelText("Review name")).toHaveValue("Review copy");
  expect(account().reviews).toEqual([
    { ...saved, view: { ...saved.view, filter: expect.objectContaining({ q: "temporary" }) } },
    copyOf(saved, "temporary"),
  ]);
  expect(account().deletedIds).toEqual([]);
});

it("keeps the grid's duplicate when Save to review starts while it writes, and opens the copy's drawer after both", async () => {
  const saved = reviewFor("multiple");
  seed(saved);
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  const save = await searchFor("temporary");
  const duplicateWrite = holdWrite();
  const saveWrite = holdWrite();
  await chooseFromMore("Duplicate");
  await waitFor(() => expect(waiting).toBe(1));
  fireEvent.click(save);
  duplicateWrite.release();
  // The copy opens while the queue's save still waits its turn: its drawer waits for that save.
  await screen.findByRole("heading", { name: "Review copy" });
  await waitFor(() => expect(waiting).toBe(1));
  await waitFor(() => expect(api.findMedia).toHaveBeenCalledTimes(3));
  expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument();
  saveWrite.release();
  const drawer = await screen.findByRole("dialog", { name: "Edit review" });
  expect(within(drawer).getByLabelText("Review name")).toHaveValue("Review copy");
  // The save was the other review's: the copy's view says nothing about it.
  expect(screen.queryByText("Queue saved to this review.")).not.toBeInTheDocument();
  expect(screen.queryByText("Queue differs from the saved review")).not.toBeInTheDocument();
  expect(account().reviews).toEqual([
    { ...saved, view: { ...saved.view, filter: expect.objectContaining({ q: "temporary" }) } },
    copyOf(saved),
  ]);
  expect(account().deletedIds).toEqual([]);
});

it("keeps the workspace's duplicate when Save to review starts while it writes", async () => {
  const saved = reviewFor("single");
  seed(saved);
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  const save = await searchFor("temporary");
  const duplicateWrite = holdWrite();
  await chooseFromMore("Duplicate");
  await waitFor(() => expect(waiting).toBe(1));
  fireEvent.click(save);
  duplicateWrite.release();
  const drawer = await screen.findByRole("dialog", { name: "Edit review" });
  expect(within(drawer).getByLabelText("Review name")).toHaveValue("Review copy");
  // The save lands after the copy's and keeps it: nothing is recorded as deleted.
  await waitFor(() =>
    expect(account().reviews).toEqual([
      { ...saved, view: { ...saved.view, filter: expect.objectContaining({ q: "temporary" }) } },
      copyOf(saved),
    ]),
  );
  expect(account().deletedIds).toEqual([]);
});

it("says under the header when a save of the review left for its copy failed", async () => {
  const saved = reviewFor("multiple");
  seed(saved);
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  const save = await searchFor("temporary");
  const duplicateWrite = holdWrite();
  const saveWrite = holdWrite();
  await chooseFromMore("Duplicate");
  await waitFor(() => expect(waiting).toBe(1));
  fireEvent.click(save);
  duplicateWrite.release();
  await screen.findByRole("heading", { name: "Review copy" });
  await waitFor(() => expect(waiting).toBe(1));
  saveWrite.fail("Storage offline");
  expect(await screen.findByRole("alert")).toHaveTextContent("“Review” was not saved. Storage offline");
  // The copy still opens in its drawer; the review keeps its saved criteria.
  await screen.findByRole("dialog", { name: "Edit review" });
  expect(account().reviews).toEqual([saved, copyOf(saved)]);
});

it("says under the header when the workspace's save failed after its copy opened", async () => {
  const saved = reviewFor("single");
  seed(saved);
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  const save = await searchFor("temporary");
  const duplicateWrite = holdWrite();
  const saveWrite = holdWrite();
  await chooseFromMore("Duplicate");
  await waitFor(() => expect(waiting).toBe(1));
  fireEvent.click(save);
  duplicateWrite.release();
  await screen.findByRole("dialog", { name: "Edit review" });
  await waitFor(() => expect(waiting).toBe(1));
  saveWrite.fail("Storage offline");
  // The view that asked is gone, so the page says it.
  expect(await screen.findByRole("alert")).toHaveTextContent("“Review” was not saved. Storage offline");
  expect(account().reviews).toEqual([saved, copyOf(saved)]);
});

it("leaves another review's view alone when a Save to review lands after the page moved on", async () => {
  const saved = reviewFor("multiple");
  seed(saved, other());
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  const save = await searchFor("temporary");
  const write = holdWrite();
  fireEvent.click(save);
  await waitFor(() => expect(waiting).toBe(1));
  // The page does not wait for the save: All reviews, then another review.
  fireEvent.click(screen.getByRole("button", { name: "All reviews" }));
  fireEvent.click(await screen.findByRole("link", { name: /Other/ }));
  await screen.findByRole("heading", { name: "Other" });
  await screen.findByRole("article", { name: "Video 1" });
  write.release();
  // Its queue's controls are back once the save has landed, which says nothing here.
  await waitFor(() => expect(screen.getByRole("textbox", { name: "Search list" })).toBeEnabled());
  expect(account().reviews[0]).toEqual(withSearch(saved, "temporary"));
  expect(screen.queryByText("Queue saved to this review.")).not.toBeInTheDocument();
  expect(screen.queryByText("Queue differs from the saved review")).not.toBeInTheDocument();
});

it("stays where Back went when a grid drawer save lands later, keeping that visit's layout and URL", async () => {
  const saved = reviewFor("multiple");
  seed(saved, other());
  window.history.pushState(null, "", "/data-quality");
  render(<DataQualityPage onNavigate={vi.fn()} />);
  fireEvent.click(await screen.findByRole("link", { name: /Review/ }));
  await screen.findByRole("article", { name: "Video 1" });
  const edit = screen.getByRole("button", { name: "Edit review" });
  await waitFor(() => expect(edit).toBeEnabled());
  fireEvent.click(edit);
  const drawer = await screen.findByRole("dialog", { name: "Edit review" });
  // The drawer saves the review as Single video; the write waits.
  fireEvent.click(within(drawer).getByRole("tab", { name: "Appearance" }));
  fireEvent.click(within(drawer).getByRole("radio", { name: "Single video" }));
  const write = holdWrite();
  fireEvent.click(within(drawer).getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(waiting).toBe(1));
  // Back does not wait: the list, then the other review, visited in Single video.
  await goBack();
  fireEvent.click(await screen.findByRole("link", { name: /Other/ }));
  const layout = await screen.findByRole("group", { name: "Review layout" });
  const single = within(layout).getByRole("button", { name: "Single" });
  await waitFor(() => expect(single).toBeEnabled());
  fireEvent.click(single);
  await screen.findByRole("heading", { name: "Reviewing this video" });
  write.release();
  await waitFor(() => expect(account().reviews[0].view.reviewMode).toBe("single"));
  await waitFor(() => expect(waiting).toBe(0));
  await act(async () => {});
  // The other review's visit goes on as it was, under its own URL.
  expect(screen.getByRole("heading", { name: "Reviewing this video" })).toBeInTheDocument();
  expect(new URLSearchParams(window.location.search).get("review")).toBe("other");
  expect(screen.queryByText("Review saved.")).not.toBeInTheDocument();
});

it("says under the header when a grid drawer save failed after Back left the review", async () => {
  seed(reviewFor("multiple"));
  window.history.pushState(null, "", "/data-quality");
  render(<DataQualityPage onNavigate={vi.fn()} />);
  fireEvent.click(await screen.findByRole("link", { name: /Review/ }));
  await screen.findByRole("article", { name: "Video 1" });
  const edit = screen.getByRole("button", { name: "Edit review" });
  await waitFor(() => expect(edit).toBeEnabled());
  fireEvent.click(edit);
  const drawer = await screen.findByRole("dialog", { name: "Edit review" });
  fireEvent.change(within(drawer).getByLabelText("Review name"), { target: { value: "Renamed" } });
  const write = holdWrite();
  fireEvent.click(within(drawer).getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(waiting).toBe(1));
  await goBack();
  await screen.findByRole("region", { name: "Reviews" });
  write.fail("Storage offline");
  // Named as saved: the new name was never saved or shown anywhere.
  expect(await screen.findByRole("alert")).toHaveTextContent("“Review” was not saved. Storage offline");
  expect(window.location.search).toBe("");
});

it("keeps the grid's Save to review when an import starts on the list while it writes", async () => {
  const saved = reviewFor("multiple");
  seed(saved);
  render(<DataQualityPage onNavigate={vi.fn()} />);
  await screen.findByRole("article", { name: "Video 1" });
  const save = await searchFor("temporary");
  const write = holdWrite();
  fireEvent.click(save);
  await waitFor(() => expect(waiting).toBe(1));
  fireEvent.click(screen.getByRole("button", { name: "All reviews" }));
  await screen.findByRole("region", { name: "Reviews" });
  const added = { ...reviewFor("single"), id: "added", name: "Added review" };
  const file = new File([JSON.stringify([added])], "reviews.json", { type: "application/json" });
  fireEvent.change(document.querySelector("input[type=file]")!, { target: { files: [file] } });
  write.release();
  // The import's write came after the save, onto the list the save left.
  await waitFor(() => expect(account().reviews).toEqual([withSearch(saved, "temporary"), added]));
  expect(account().deletedIds).toEqual([]);
});
