import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { OccurrenceWorkspace } from "../OccurrenceReview";
import {
  occurrenceAnswerSignature,
  queueSignature,
  type OccurrenceReview,
} from "../model";
import type { Occurrence } from "../occurrences";

const api = vi.hoisted(() => ({
  loadProgress: vi.fn(),
  saveProgress: vi.fn(),
  request: vi.fn(),
  resolvePerformers: vi.fn(),
  loadOccurrencePage: vi.fn(),
  saveOccurrenceTags: vi.fn(),
}));
vi.mock("../api", () => ({
  ...api,
  videoCoverUrl: () => "/cover",
  videoStreamUrl: () => "/stream",
}));
vi.mock("../occurrences", () => api);
const review: OccurrenceReview = {
  id: "hair",
  name: "Hair",
  description: "",
  entityType: "performerOccurrence",
  actions: [],
  view: {
    filter: { page: 1, perPage: 2 },
    objectFilter: {},
    displayMode: "grid",
    searchMode: "text",
    startFrom: "beginning",
  },
  occurrence: {
    targetMode: "all",
    performerIds: [],
    performerFilter: {},
    condition: "any",
    conditionTagIds: [],
    tagIds: [21, 22],
    multiple: true,
  },
};
const video = {
  id: 1,
  title: "First scene",
  files: [],
  updatedAt: "now",
  performers: [
    { id: 11, name: "First performer" },
    { id: 12, name: "Second performer" },
  ],
};
const first: Occurrence = {
  key: "1:11",
  video,
  performer: video.performers[0],
  applications: [],
};
const second: Occurrence = {
  key: "1:12",
  video,
  performer: video.performers[1],
  applications: [],
};
const onBusy = vi.fn();
beforeEach(() => {
  vi.clearAllMocks();
  api.loadProgress.mockResolvedValue(null);
  api.saveProgress.mockResolvedValue(undefined);
  api.resolvePerformers.mockResolvedValue(null);
  api.request.mockImplementation((path: string) =>
    Promise.resolve({ name: path.endsWith("21") ? "Hair down" : "Pigtails" }),
  );
  api.loadOccurrencePage.mockResolvedValue({
    items: [first, second],
    totalCount: 1,
  });
  api.saveOccurrenceTags.mockResolvedValue([]);
});
const open = () =>
  render(
    <OccurrenceWorkspace
      review={review}
      storageKey="account"
      canWrite
      onBusy={onBusy}
    />,
  );

it("saves only the active occurrence, advances to its partner, and preserves the player", async () => {
  open();
  await screen.findByRole("heading", { name: "Reviewing First performer" });
  const player = screen.getByTestId("video-player");
  fireEvent.click(screen.getByLabelText("Hair down"));
  fireEvent.click(screen.getByLabelText("Pigtails"));
  fireEvent.click(
    screen.getByRole("button", { name: "Save & next performer" }),
  );
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  expect(api.saveOccurrenceTags).toHaveBeenCalledWith(review, first, [21, 22]);
  expect(screen.getByTestId("video-player")).toBe(player);
  expect(api.saveProgress).toHaveBeenLastCalledWith(
    "account",
    "hair",
    expect.objectContaining({
      occurrence: {
        answerSignature: occurrenceAnswerSignature(review),
        focusedKey: "1:12",
        outcomes: { "1:11": "reviewed" },
      },
    }),
  );
  expect(screen.getByLabelText("Hair down")).not.toBeChecked();
});
it("skips without completing or writing tags and distinguishes inconclusive outcomes", async () => {
  const view = open();
  await screen.findByRole("heading", { name: "Reviewing First performer" });
  fireEvent.click(screen.getByRole("button", { name: "Skip performer" }));
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  expect(api.saveOccurrenceTags).not.toHaveBeenCalled();
  expect(api.saveProgress).toHaveBeenLastCalledWith(
    "account",
    "hair",
    expect.objectContaining({
      occurrence: {
        answerSignature: occurrenceAnswerSignature(review),
        focusedKey: "1:12",
        outcomes: {},
      },
    }),
  );
  view.unmount();
  open();
  await screen.findByRole("heading", { name: "Reviewing First performer" });
  fireEvent.click(
    screen.getByRole("button", { name: "Cannot determine & next" }),
  );
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  expect(api.saveOccurrenceTags).not.toHaveBeenCalled();
  expect(api.saveProgress).toHaveBeenLastCalledWith(
    "account",
    "hair",
    expect.objectContaining({
      occurrence: {
        answerSignature: occurrenceAnswerSignature(review),
        focusedKey: "1:12",
        outcomes: { "1:11": "cannotDetermine" },
      },
    }),
  );
});
it("keeps focus and choices when a tag save fails", async () => {
  api.saveOccurrenceTags.mockRejectedValueOnce(new Error("Write failed"));
  open();
  await screen.findByRole("heading", { name: "Reviewing First performer" });
  fireEvent.click(screen.getByLabelText("Hair down"));
  fireEvent.click(
    screen.getByRole("button", { name: "Save & next performer" }),
  );
  await screen.findByRole("alert");
  expect(
    screen.getByRole("heading", { name: "Reviewing First performer" }),
  ).toBeInTheDocument();
  expect(screen.getByLabelText("Hair down")).toBeChecked();
  expect(api.saveProgress).not.toHaveBeenCalled();
});

it("cannot bypass failed target loading with the refresh control", async () => {
  api.resolvePerformers.mockRejectedValueOnce(new Error("Targets unavailable"));
  open();
  await screen.findByRole("alert");
  expect(screen.getByRole("button", { name: "Refresh page" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Refresh page" }));
  expect(api.loadOccurrencePage).not.toHaveBeenCalled();
});
it("resumes each occurrence and review independently", async () => {
  api.loadProgress.mockResolvedValue({
    signature: queueSignature(review),
    filter: { page: 1 },
    occurrence: { focusedKey: "1:12", outcomes: { "1:11": "reviewed" } },
  });
  open();
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  expect(
    screen.getByText(/1 unresolved of 2 performer occurrences/),
  ).toBeInTheDocument();
});
it("does not silently reset unreadable progress", async () => {
  api.loadProgress.mockRejectedValueOnce(new Error("Saved progress invalid"));
  open();
  await screen.findByRole("alert");
  expect(api.loadOccurrencePage).not.toHaveBeenCalled();
  expect(api.saveProgress).not.toHaveBeenCalled();
});
it("re-reads the same scene page after contraction and advances to remaining work", async () => {
  const third = {
    ...first,
    key: "2:11",
    video: { ...video, id: 2, title: "Next scene" },
  };
  api.loadOccurrencePage
    .mockResolvedValueOnce({ items: [first], totalCount: 3 })
    .mockResolvedValue({ items: [third], totalCount: 2 });
  open();
  await screen.findByRole("heading", { name: "Reviewing First performer" });
  fireEvent.click(
    screen.getByRole("button", { name: "Save & next performer" }),
  );
  await waitFor(() => expect(api.loadOccurrencePage).toHaveBeenCalledTimes(2), {
    timeout: 3000,
  });
  expect(api.loadOccurrencePage.mock.calls[1][2]).toBe(1);
  await screen.findByRole("link", { name: "Next scene" });
  expect(api.saveProgress).toHaveBeenLastCalledWith(
    "account",
    "hair",
    expect.objectContaining({
      occurrence: {
        answerSignature: occurrenceAnswerSignature(review),
        focusedKey: "2:11",
        outcomes: { "1:11": "reviewed" },
      },
    }),
  );
});

it("preserves answers when page size or queue ordering changes", async () => {
  api.loadProgress.mockResolvedValue({
    signature: "previous queue ordering",
    filter: { page: 2 },
    occurrence: {
      answerSignature: occurrenceAnswerSignature(review),
      focusedKey: "1:11",
      outcomes: { "1:11": "reviewed" },
    },
  });
  open();
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  expect(
    screen.getByText(/1 unresolved of 2 performer occurrences/),
  ).toBeInTheDocument();
});

it("respects scene clip boundaries in the player", async () => {
  api.loadOccurrencePage.mockResolvedValue({
    items: [
      {
        ...first,
        video: { ...video, parentVideoId: 3, clipStartSec: 30, clipEndSec: 60 },
      },
    ],
    totalCount: 1,
  });
  open();
  expect(await screen.findByTestId("video-player")).toHaveAttribute(
    "data-clip",
    JSON.stringify({ start: 30, end: 60, loop: false }),
  );
});

it.each(["beginning", "end"] as const)("resumes past a completed scene page from the %s", async (startFrom) => {
  const configured = { ...review, view: { ...review.view, startFrom } };
  const initialPage = startFrom === "beginning" ? 1 : 2;
  api.loadProgress.mockResolvedValue({ signature: queueSignature(configured), filter: { page: initialPage }, occurrence: { answerSignature: occurrenceAnswerSignature(configured), focusedKey: null, outcomes: { "1:11": "reviewed" } } });
  api.loadOccurrencePage.mockResolvedValueOnce({ items: [first], totalCount: 3 }).mockResolvedValueOnce({ items: [second], totalCount: 3 });
  render(<OccurrenceWorkspace review={configured} storageKey="account" canWrite onBusy={onBusy} />);
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  expect(api.loadOccurrencePage.mock.calls.map((call) => call[2])).toEqual(startFrom === "beginning" ? [1, 2] : [2, 1]);
});

it("cannot save a stale performer when loading changed targets fails", async () => {
  const view = open();
  await screen.findByRole("heading", { name: "Reviewing First performer" });
  api.resolvePerformers.mockRejectedValueOnce(new Error("Targets unavailable"));
  view.rerender(<OccurrenceWorkspace review={{ ...review, occurrence: { ...review.occurrence, targetMode: "selected", performerIds: [12] } }} storageKey="account" canWrite onBusy={onBusy} />);
  await screen.findByRole("alert");
  expect(screen.queryByRole("button", { name: "Save & next performer" })).not.toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Reviewing First performer" })).not.toBeInTheDocument();
  expect(api.saveOccurrenceTags).not.toHaveBeenCalled();
});
