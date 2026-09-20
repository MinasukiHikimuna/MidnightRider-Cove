import {
  configure,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { ReviewWorkspace } from "../ReviewWorkspace";
import type { AudioReview, OccurrenceReview } from "../model";
import type { TagState } from "../reviewTags";
configure({ asyncUtilTimeout: 3000 });
const api = vi.hoisted(() => ({
  findMedia: vi.fn(),
  request: vi.fn(),
  resolvePerformers: vi.fn(),
  loadOccurrencePage: vi.fn(),
  readTags: vi.fn(),
  editTags: vi.fn(),
  applyTags: vi.fn(),
}));
vi.mock("../api", async (original) => ({
  ...(await original<typeof import("../api")>()),
  findMedia: api.findMedia,
  request: api.request,
}));
vi.mock("../occurrences", async (original) => ({
  ...(await original<typeof import("../occurrences")>()),
  resolvePerformers: api.resolvePerformers,
  loadOccurrencePage: api.loadOccurrencePage,
}));
vi.mock("../reviewTags", async (original) => ({
  ...(await original<typeof import("../reviewTags")>()),
  readTags: api.readTags,
  editTags: api.editTags,
  applyTags: api.applyTags,
}));

const audio = {
  id: 7,
  title: "First recording",
  details: "A spoken introduction, then the interview.",
  files: [{ id: 1, basename: "first.mp3", format: "mp3", duration: 128 }],
  updatedAt: "2026-01-01T00:00:00Z",
  performers: [
    { id: 11, name: "First performer" },
    { id: 12, name: "Second performer" },
  ],
};
const view = {
  filter: { page: 1, perPage: 2 },
  objectFilter: {},
  displayMode: "grid" as const,
  searchMode: "text",
  startFrom: "beginning" as const,
};
const audioReview: AudioReview = {
  id: "a",
  name: "Audio review",
  description: "",
  entityType: "audio",
  actions: [
    { id: "tag", label: "Observation", steps: [{ mode: "ADD", tagIds: [21] }] },
  ],
  view: { ...view, reviewMode: "single" },
};
const occurrenceReview: OccurrenceReview = {
  id: "ao",
  name: "Audio occurrences",
  description: "",
  entityType: "audioPerformerOccurrence",
  actions: [
    { id: "tag", label: "Observation", steps: [{ mode: "ADD", tagIds: [21] }] },
  ],
  view,
  occurrence: {
    targetMode: "all",
    performerIds: [],
    performerFilter: {},
    condition: "any",
    conditionTagIds: [],
    tagIds: [21],
    multiple: true,
  },
};
const occurrence = {
  key: "7:11",
  media: audio,
  performer: audio.performers[0],
  applications: [],
};
let state: TagState;
beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
  window.history.replaceState(null, "", "/data-quality?review=a");
  state = { ids: [], names: [], absent: [] };
  api.readTags.mockImplementation(async () => structuredClone(state));
  api.applyTags.mockResolvedValue(undefined);
  api.editTags.mockResolvedValue(undefined);
  api.resolvePerformers.mockResolvedValue(null);
  api.findMedia.mockResolvedValue({ items: [audio], totalCount: 1 });
  api.loadOccurrencePage.mockResolvedValue({
    items: [occurrence],
    totalCount: 1,
  });
  api.request.mockResolvedValue({ name: "Choice" });
});
function open(rule: AudioReview | OccurrenceReview = audioReview) {
  return render(
    <ReviewWorkspace
      review={rule}
      canWrite
      onBusy={() => {}}
      onSaveDefaults={vi.fn().mockResolvedValue(undefined)}
    />,
  );
}
async function ready() {
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Edit tags" })).toBeEnabled(),
  );
}

it("plays a single audio through Cove's audio player and links to the audio page", async () => {
  open();
  await ready();
  const player = screen.getByTestId("audio-player");
  expect(player).toHaveAttribute("data-stream-url", "/api/audios/7/stream");
  expect(player).toHaveAttribute("data-title", "First recording");
  expect(player).toHaveAttribute("data-duration", "128");
  expect(screen.queryByTestId("video-player")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "First recording" })).toHaveAttribute(
    "href",
    "/audio/7",
  );
  expect(
    screen.getByRole("heading", { name: "Reviewing this audio" }),
  ).toBeInTheDocument();
});

it("queues audios with audio filters, sorting and custom fields", async () => {
  open();
  await ready();
  const toolbar = screen.getByRole("toolbar", { name: "Video list controls" });
  expect(toolbar).toHaveAttribute("data-custom-field-entity-type", "audio");
  expect(screen.getByRole("group", { name: "Audio filters" })).toBeInTheDocument();
  expect(api.findMedia).toHaveBeenCalledWith(
    expect.objectContaining({ entityType: "audio" }),
    expect.anything(),
    expect.anything(),
  );
});

it("shows the description under the player and remembers a collapse", async () => {
  const { unmount } = open();
  await ready();
  const description = screen.getByRole("region", { name: "audio description" });
  const media = document.querySelector(".dq-review-media");
  // Below the player, not beside it: both live in the media column, description last.
  expect(media).toContainElement(description);
  expect(media?.lastElementChild).toBe(description);
  expect(description).toHaveTextContent(
    "A spoken introduction, then the interview.",
  );
  fireEvent.click(screen.getByRole("button", { name: "Description" }));
  expect(
    screen.queryByText("A spoken introduction, then the interview."),
  ).not.toBeInTheDocument();
  unmount();
  open();
  await ready();
  expect(screen.getByRole("button", { name: "Description" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});

it("states when an audio has no description rather than hiding the panel", async () => {
  api.findMedia.mockResolvedValue({
    items: [{ ...audio, details: "   " }],
    totalCount: 1,
  });
  open();
  await ready();
  expect(screen.getByText("No description.")).toBeInTheDocument();
});

it("reviews performer occurrences on an audio with the description in view", async () => {
  window.history.replaceState(null, "", "/data-quality?review=ao");
  open(occurrenceReview);
  await ready();
  expect(
    screen.getByRole("heading", { name: "Reviewing First performer" }),
  ).toBeInTheDocument();
  expect(screen.getByTestId("audio-player")).toHaveAttribute(
    "data-stream-url",
    "/api/audios/7/stream",
  );
  expect(
    screen.getByRole("region", { name: "audio description" }),
  ).toHaveTextContent("A spoken introduction, then the interview.");
  expect(
    screen.getByText("Tags apply only to this performer in this audio."),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));
  await waitFor(() => expect(api.applyTags).toHaveBeenCalled());
  expect(api.applyTags.mock.calls[0][0].entityType).toBe(
    "audioPerformerOccurrence",
  );
  expect(api.applyTags.mock.calls[0][1].occurrence).toEqual(occurrence);
});
