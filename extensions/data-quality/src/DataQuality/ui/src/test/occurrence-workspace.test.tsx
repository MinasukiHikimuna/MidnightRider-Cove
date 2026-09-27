import {
  act,
  configure,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { testFilterControls } from "./runtime-components";
import { ReviewWorkspace, orderedItems } from "../ReviewWorkspace";
import type { OccurrenceReview, VideoReview } from "../model";
import type { ReviewItem, TagState } from "../reviewTags";
import { rankingSignature, type PerformerRanking } from "../performerRanking";
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
  mediaCoverUrl: () => "/cover",
  mediaStreamUrl: () => "/stream",
}));
vi.mock("../occurrences", async (original) => ({
  ...(await original<typeof import("../occurrences")>()),
  resolvePerformers: api.resolvePerformers,
  loadOccurrencePage: api.loadOccurrencePage,
}));
const panels = vi.hoisted(() => ({
  extendRanking: vi.fn(),
  countPerformer: vi.fn(),
  loadPerformerAnswers: vi.fn(),
}));
vi.mock("../performerRanking", async (original) => ({
  ...(await original<typeof import("../performerRanking")>()),
  extendRanking: panels.extendRanking,
  countPerformer: panels.countPerformer,
}));
vi.mock("../performerAnswers", async (original) => ({
  ...(await original<typeof import("../performerAnswers")>()),
  loadPerformerAnswers: panels.loadPerformerAnswers,
}));
vi.mock("../reviewTags", async (original) => ({
  ...(await original<typeof import("../reviewTags")>()),
  readTags: api.readTags,
  editTags: api.editTags,
  applyTags: api.applyTags,
}));
const review: OccurrenceReview = {
  id: "r",
  name: "Review",
  description: "",
  entityType: "performerOccurrence",
  actions: [
    {
      id: "tag",
      label: "Observation",
      steps: [{ mode: "ADD", tagIds: [21, 22] }],
    },
  ],
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
  updatedAt: "",
  performers: [
    { id: 11, name: "First performer" },
    { id: 12, name: "Second performer" },
  ],
};
const first = {
  key: "1:11",
  media: video,
  performer: video.performers[0],
  applications: [],
};
const second = {
  key: "1:12",
  media: video,
  performer: video.performers[1],
  applications: [],
};
const third = {
  ...first,
  key: "2:11",
  media: { ...video, id: 2, title: "Next scene" },
};
let state: TagState;
beforeEach(() => {
  vi.resetAllMocks();
  window.history.replaceState(null, "", "/data-quality?review=r");
  state = { ids: [], names: [], absent: [] };
  api.readTags.mockImplementation(async () => structuredClone(state));
  api.applyTags.mockImplementation(async () => {
    state = { ids: [21, 22], names: ["One", "Two"], absent: [] };
  });
  api.editTags.mockImplementation(async (_review, _item, delta) => {
    state.ids = [
      ...state.ids.filter((id) => !delta.removed.includes(id)),
      ...delta.added,
    ];
  });
  api.resolvePerformers.mockResolvedValue(null);
  api.loadOccurrencePage.mockResolvedValue({
    items: [first, second],
    totalCount: 1,
  });
  api.findMedia.mockResolvedValue({
    items: [video, third.media],
    totalCount: 2,
  });
  api.request.mockResolvedValue({ name: "Choice" });
  panels.loadPerformerAnswers.mockResolvedValue({ answered: 0, groups: [] });
});
function open(
  rule: OccurrenceReview | VideoReview = review,
  canWrite = true,
  onSaveDefaults = vi.fn().mockResolvedValue(undefined),
  editRequest = 0,
) {
  return render(
    <ReviewWorkspace
      review={rule}
      canWrite={canWrite}
      onBusy={() => {}}
      onSaveDefaults={onSaveDefaults}
      editRequest={editRequest}
    />,
  );
}
async function ready() {
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Edit tags" })).toBeEnabled(),
  );
}
it("preloads the next distinct video in a reusable player", async () => {
  api.loadOccurrencePage.mockResolvedValue({
    items: [first, second, third],
    totalCount: 3,
  });
  open();
  await ready();

  const preload = document.querySelector(".dq-review-video-preload");
  expect(preload).toHaveAttribute("aria-hidden", "true");
  expect(preload).toHaveAttribute("inert");
  expect(preload?.querySelector('[data-testid="video-player-preload"]')).toHaveAttribute(
    "data-video-id",
    "2",
  );
  expect(preload?.querySelector('[data-testid="video-player-preload"]')).toHaveAttribute(
    "data-keyboard-shortcuts-enabled",
    "false",
  );
});
it("renders Apply and stay as an accessible icon button", async () => {
  open();
  await ready();

  const stay = screen.getByRole("button", { name: "Apply & stay: Observation" });
  expect(stay).toHaveAttribute("title", "Apply & stay: Observation");
  expect(stay.querySelector("svg")).not.toBeNull();
  expect(stay).toHaveTextContent("");
});
it("ignores legacy progress and uses saved performer targeting", async () => {
  localStorage.setItem(
    "progress:r",
    JSON.stringify({ outcomes: { "1:11": "reviewed" }, page: 10 }),
  );
  open({
    ...review,
    occurrence: {
      ...review.occurrence,
      targetMode: "filter",
      performerFilter: { gender: "FEMALE" },
    },
  });
  await ready();
  expect(api.resolvePerformers).toHaveBeenCalledWith(
    expect.objectContaining({
      occurrence: expect.objectContaining({
        targetMode: "filter",
        performerFilter: { gender: "FEMALE" },
      }),
    }),
    expect.anything(),
  );
  expect(
    screen.getByRole("heading", { name: "Reviewing First performer" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByText(/unresolved|Cannot determine|Reviewed/),
  ).not.toBeInTheDocument();
});
it("applies multiple observations and advances to the partner without remounting the player", async () => {
  open();
  await ready();
  const player = screen.getByTestId("video-player");
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  expect(api.applyTags).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({ occurrence: first }),
    review.actions[0],
  );
  expect(screen.getByTestId("video-player")).toBe(player);
  expect(
    screen.queryByRole("button", { name: "Undo latest tag operation" }),
  ).not.toBeInTheDocument();
});
it.each(["shift-click", "stay button", "shift shortcut"])(
  "supports %s without advancing",
  async (alternative) => {
    open();
    await ready();
    if (alternative === "shift-click")
      fireEvent.click(screen.getByRole("button", { name: "q Observation" }), {
        shiftKey: true,
      });
    else if (alternative === "stay button")
      fireEvent.click(
        screen.getByRole("button", { name: "Apply & stay: Observation" }),
      );
    else
      fireEvent.keyDown(document.body, {
        key: "Q",
        code: "KeyQ",
        shiftKey: true,
      });
    await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Edit tags" })).toBeEnabled(),
    );
    expect(
      screen.getByRole("heading", { name: "Reviewing First performer" }),
    ).toBeInTheDocument();
  },
);
it("does not execute shortcuts while typing or editing, including browser modifiers", async () => {
  open();
  await ready();
  for (const modifier of ["ctrlKey", "altKey", "metaKey"])
    fireEvent.keyDown(document.body, { key: "q", [modifier]: true });
  fireEvent.click(screen.getByRole("button", { name: "Edit tags" }));
  fireEvent.keyDown(
    screen.getByPlaceholderText("Choose tags for this item..."),
    { key: "q" },
  );
  fireEvent.keyDown(document.body, { key: "q" });
  expect(api.applyTags).not.toHaveBeenCalled();
});
it.each(["Save", "Save & next", "Cancel"])(
  "keeps arbitrary edits local until %s",
  async (button) => {
    state = { ids: [30], names: ["Existing"], absent: [] };
    open();
    await ready();
    fireEvent.click(screen.getByRole("button", { name: "Edit tags" }));
    fireEvent.change(
      screen.getByPlaceholderText("Choose tags for this item..."),
      { target: { value: "40,41" } },
    );
    expect(api.editTags).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: button }));
    if (button === "Cancel") expect(api.editTags).not.toHaveBeenCalled();
    else
      await waitFor(() =>
        expect(api.editTags).toHaveBeenCalledWith(
          expect.anything(),
          expect.anything(),
          { added: [40, 41], removed: [30] },
        ),
      );
    await screen.findByRole("heading", {
      name:
        button === "Save & next"
          ? "Reviewing Second performer"
          : "Reviewing First performer",
    });
  },
);
it("retains editor inputs on partial failure and refreshes actual tags", async () => {
  api.editTags.mockImplementation(async () => {
    state = { ids: [40], names: ["Saved part"], absent: [] };
    throw new Error("Denied");
  });
  open();
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "Edit tags" }));
  fireEvent.change(
    screen.getByPlaceholderText("Choose tags for this item..."),
    { target: { value: "40,41" } },
  );
  fireEvent.click(screen.getByRole("button", { name: "Save & next" }));
  await screen.findByRole("alert");
  expect(
    screen.getByPlaceholderText("Choose tags for this item..."),
  ).toHaveValue("40,41");
  expect(
    screen.getByRole("heading", { name: "Reviewing First performer" }),
  ).toBeInTheDocument();
  await screen.findByText("Current occurrence tags: Saved part");
});
it("Skip only moves the stable cursor and reloading makes items available again", async () => {
  const view = open();
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "Skip performer" }));
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  fireEvent.click(screen.getByRole("button", { name: "Skip performer" }));
  await waitFor(() =>
    expect(
      screen.queryByRole("heading", { name: /Reviewing/ }),
    ).not.toBeInTheDocument(),
  );
  expect(api.applyTags).not.toHaveBeenCalled();
  expect(api.editTags).not.toHaveBeenCalled();
  view.unmount();
  open();
  await screen.findByRole("heading", { name: "Reviewing First performer" });
});
it("reconciles page contraction and does not loop back to still matching loaded items", async () => {
  api.loadOccurrencePage
    .mockResolvedValueOnce({ items: [first], totalCount: 3 })
    .mockResolvedValue({ items: [first, third], totalCount: 2 });
  open();
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "Skip performer" }));
  await screen.findByRole("link", { name: "Next scene" });
  expect(api.loadOccurrencePage.mock.calls.map((call) => call[2])).toEqual([
    1, 1,
  ]);
});
it("keeps the current item when queue refresh fails after a confirmed save", async () => {
  api.loadOccurrencePage
    .mockResolvedValueOnce({ items: [first], totalCount: 1 })
    .mockRejectedValue(new Error("Queue unavailable"));
  open();
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));
  await screen.findByText(
    /Tags saved, but the queue could not advance/,
    {},
    { timeout: 3000 },
  );
  expect(
    screen.getByRole("heading", { name: "Reviewing First performer" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Undo latest tag operation" }),
  ).not.toBeInTheDocument();
});
it("honors an explicit page over end-start and clamps shrinking results", async () => {
  window.history.replaceState(
    null,
    "",
    "/data-quality?review=r&page=4&perPage=2&startFrom=end",
  );
  api.loadOccurrencePage.mockResolvedValue({ items: [first], totalCount: 2 });
  open();
  await ready();
  expect(api.loadOccurrencePage.mock.calls.map((call) => call[2])).toEqual([
    4, 1,
  ]);
  expect(new URLSearchParams(window.location.search).get("page")).toBe("1");
});
it("orders scenes backwards while keeping partners together", () => {
  const items = [first, second, third].map((occurrence) => ({
    key: occurrence.key,
    media: occurrence.media,
    occurrence,
  }));
  expect(orderedItems(items, true).map((item) => item.key)).toEqual([
    "2:11",
    "1:11",
    "1:12",
  ]);
});
it("lets users toggle subtags and save the choice as review defaults", async () => {
  const save = vi.fn().mockResolvedValue(true);
  open({ ...review, occurrence: { ...review.occurrence, condition: "includes", conditionTagIds: [21] } }, true, save);
  await ready();
  expect(screen.queryByRole("button", { name: "Save changes to review filters" })).not.toBeInTheDocument();
  expect(screen.getByRole("checkbox", { name: "Include subtags" })).toBeChecked();
  fireEvent.click(screen.getByRole("checkbox", { name: "Include subtags" }));
  await waitFor(() => expect(api.loadOccurrencePage).toHaveBeenLastCalledWith(
    expect.objectContaining({ occurrence: expect.objectContaining({ includeSubtags: false }) }),
    null, 1, expect.anything(),
  ));
  expect(JSON.parse(new URLSearchParams(window.location.search).get("performerScope")!).includeSubtags).toBe(false);
  fireEvent.click(screen.getByRole("button", { name: "Save changes to review filters" }));
  await waitFor(() => expect(save).toHaveBeenCalledWith(
    expect.objectContaining({ occurrence: expect.objectContaining({ includeSubtags: false }) }),
  ));
  expect(screen.queryByRole("region", { name: "Edit review rule" })).not.toBeInTheDocument();
});

it("gives single-video reviews the same compact save and reset controls", async () => {
  const rule: VideoReview = { ...review, entityType: "video" };
  const save = vi.fn().mockResolvedValue(true);
  open(rule, true, save);
  await ready();
  expect(screen.queryByRole("button", { name: "Save changes to review filters" })).not.toBeInTheDocument();

  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), {
    target: { value: "temporary" },
  });

  fireEvent.click(await screen.findByRole("button", { name: "Save changes to review filters" }));
  await waitFor(() => expect(save).toHaveBeenCalledWith(
    expect.objectContaining({
      entityType: "video",
      view: expect.objectContaining({
        filter: expect.objectContaining({ q: "temporary", page: 1 }),
      }),
    }),
  ));
  expect(screen.queryByRole("region", { name: "Edit review rule" })).not.toBeInTheDocument();
});

it("keeps changed queue criteria available when a compact save fails", async () => {
  const rule: VideoReview = { ...review, entityType: "video" };
  const save = vi.fn()
    .mockRejectedValueOnce(new Error("Temporary failure"))
    .mockResolvedValueOnce(true);
  open(rule, true, save);
  await ready();

  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), {
    target: { value: "temporary" },
  });
  fireEvent.click(await screen.findByRole("button", { name: "Save changes to review filters" }));

  expect(await screen.findByText("Could not save queue. Temporary failure")).toBeInTheDocument();
  expect(screen.getByRole("textbox", { name: "Search list" })).toHaveValue("temporary");
  expect(screen.getByRole("button", { name: "Save changes to review filters" })).toBeEnabled();
  expect(screen.getByRole("button", { name: "Reset to default review filters" })).toBeEnabled();

  fireEvent.click(screen.getByRole("button", { name: "Save changes to review filters" }));
  await waitFor(() => expect(save).toHaveBeenCalledTimes(2));
  expect(await screen.findByText("Queue saved to this review.")).toBeInTheDocument();
});

it("shows compact controls when only the review direction differs", async () => {
  const params = new URLSearchParams({
    review: review.id,
    q: "",
    page: "1",
    perPage: "2",
    sort: "date",
    direction: "desc",
    filters: "{}",
    searchMode: "text",
    startFrom: "end",
    performerScope: JSON.stringify({
      targetMode: "all",
      performerIds: [],
      performerFilter: {},
      condition: "any",
      conditionTagIds: [],
      includeSubtags: true,
    }),
  });
  window.history.replaceState(null, "", `/data-quality?${params}`);

  open();
  await ready();

  expect(screen.getByRole("button", { name: "Save changes to review filters" })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "Reset to default review filters" }));
  await waitFor(() => expect(new URLSearchParams(window.location.search).get("startFrom")).toBe("beginning"));
  expect(screen.queryByRole("button", { name: "Save changes to review filters" })).not.toBeInTheDocument();
});

it("does not show compact controls for a canonical URL matching the review defaults", async () => {
  const params = new URLSearchParams({
    review: review.id,
    q: "",
    page: "1",
    perPage: "2",
    sort: "date",
    direction: "desc",
    filters: "{}",
    searchMode: "text",
    startFrom: "beginning",
    performerScope: JSON.stringify({
      targetMode: "all",
      performerIds: [],
      performerFilter: {},
      condition: "any",
      conditionTagIds: [],
      includeSubtags: true,
    }),
  });
  window.history.replaceState(null, "", `/data-quality?${params}`);

  open();
  await ready();

  expect(screen.queryByRole("button", { name: "Save changes to review filters" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Reset to default review filters" })).not.toBeInTheDocument();
});

it("keeps saved defaults separate from reset and restores browser URL state", async () => {
  const save = vi.fn().mockResolvedValue(undefined);
  open(review, true, save);
  await ready();
  window.history.pushState(
    null,
    "",
    "/data-quality?review=r&q=temporary&filters={}&page=1&startFrom=beginning",
  );
  window.dispatchEvent(new PopStateEvent("popstate"));
  await waitFor(() =>
    expect(api.loadOccurrencePage).toHaveBeenLastCalledWith(
      expect.objectContaining({
        view: expect.objectContaining({
          filter: expect.objectContaining({ q: "temporary" }),
        }),
      }),
      null,
      1,
      expect.anything(),
    ),
  );
  fireEvent.click(screen.getByRole("button", { name: "Save changes to review filters" }));
  await waitFor(() =>
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({
        view: expect.objectContaining({
          filter: expect.objectContaining({ q: "temporary" }),
        }),
      }),
    ),
  );
  await ready();
  fireEvent.click(
    screen.getByRole("button", { name: "Reset to default review filters" }),
  );
  await waitFor(() =>
    expect(new URLSearchParams(window.location.search).get("q")).toBe(""),
  );
});
it("gives video reviews the same Save and default advancement behavior", async () => {
  const rule: VideoReview = {
    ...review,
    entityType: "video",
    view: { ...review.view, filter: { ...review.view.filter, perPage: 3 } },
  };
  const later = { ...video, id: 3, title: "Later scene" };
  api.findMedia
    .mockResolvedValueOnce({ items: [video, third.media, later], totalCount: 3 })
    .mockResolvedValue({ items: [third.media, later], totalCount: 2 });
  open(rule);
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));
  await screen.findByRole("link", { name: "Next scene" });
  expect(screen.getByRole("button", { name: "Later scene" })).toBeInTheDocument();
  expect(screen.getByTestId("video-player")).toHaveAttribute("data-autostart", "true");
  expect(api.applyTags).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({ key: "1", media: video }),
    rule.actions[0],
  );
});
it("removes the active video and autoplays its successor before the write settles", async () => {
  const rule: VideoReview = {
    ...review,
    entityType: "video",
    view: { ...review.view, filter: { ...review.view.filter, perPage: 3 } },
  };
  const later = { ...video, id: 3, title: "Later scene" };
  let finish!: () => void;
  api.applyTags.mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );
  api.findMedia
    .mockResolvedValueOnce({ items: [video, third.media, later], totalCount: 3 })
    .mockResolvedValue({ items: [later, third.media], totalCount: 2 });
  open(rule);
  await ready();
  const preloadedSuccessor = screen.getByTestId("video-player-preload");

  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));

  expect(screen.getByRole("link", { name: "Next scene" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "First scene" })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Later scene" })).toBeInTheDocument();
  expect(screen.getByTestId("video-player")).toBe(preloadedSuccessor);
  expect(preloadedSuccessor).toHaveAttribute("data-autostart", "true");
  await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(1));
  await act(async () => finish());
  await ready();
  expect(screen.getByRole("link", { name: "Next scene" })).toBeInTheDocument();
});
it("remounts the prepared successor paused when a write fails", async () => {
  const rule: VideoReview = {
    ...review,
    entityType: "video",
    view: { ...review.view, filter: { ...review.view.filter, perPage: 3 } },
  };
  const later = { ...video, id: 3, title: "Later scene" };
  api.findMedia.mockResolvedValue({
    items: [video, third.media, later],
    totalCount: 3,
  });
  api.applyTags.mockRejectedValueOnce(new Error("write failed"));
  open(rule);
  await ready();
  const preparedSuccessor = screen.getByTestId("video-player-preload");

  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));
  expect(screen.getByTestId("video-player")).toBe(preparedSuccessor);

  await screen.findByRole("link", { name: "First scene" });
  const restoredPreload = screen.getByTestId("video-player-preload");
  expect(restoredPreload).not.toBe(preparedSuccessor);
  expect(restoredPreload).toHaveAttribute("data-autostart", "false");
});
it("keeps earlier unprocessed videos after applying a manually selected item", async () => {
  const rule: VideoReview = {
    ...review,
    entityType: "video",
    view: { ...review.view, filter: { ...review.view.filter, perPage: 3 } },
  };
  const later = { ...video, id: 3, title: "Later scene" };
  api.findMedia
    .mockResolvedValueOnce({ items: [video, third.media, later], totalCount: 3 })
    .mockResolvedValue({ items: [later, video], totalCount: 2 });
  open(rule);
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "Next scene" }));
  await screen.findByRole("link", { name: "Next scene" });

  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));

  await screen.findByRole("link", { name: "Later scene" });
  await ready();
  expect(screen.getByRole("button", { name: "First scene" })).toBeInTheDocument();
});
it("blocks duplicate submissions and keeps Skip available without write permission", async () => {
  open(review, false);
  await screen.findByRole("heading", { name: "Reviewing First performer" });
  expect(screen.getByRole("button", { name: "q Observation" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Skip performer" }));
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  expect(api.applyTags).not.toHaveBeenCalled();
});
it("does not render a shortcut badge after the first ten actions", async () => {
  open({
    ...review,
    actions: Array.from({ length: 11 }, (_, index) => ({
      id: `action-${index}`,
      label: `Action ${index + 1}`,
      steps: [],
    })),
  });
  await ready();
  expect(screen.getByRole("button", { name: "p Action 10" }).querySelector("kbd")).not.toBeNull();
  expect(screen.getByRole("button", { name: "Action 11" }).querySelector("kbd")).toBeNull();
});
it("preserves legacy choices and clip boundaries", async () => {
  api.loadOccurrencePage.mockResolvedValue({
    items: [
      {
        ...first,
        media: { ...video, parentVideoId: 3, clipStartSec: 30, clipEndSec: 60 },
      },
      second,
    ],
    totalCount: 1,
  });
  open({ ...review, actions: [] });
  await ready();
  expect(screen.getByTestId("video-player")).toHaveAttribute(
    "data-clip",
    JSON.stringify({ start: 30, end: 60, loop: false }),
  );
  fireEvent.click(screen.getAllByLabelText("Choice")[0]);
  fireEvent.click(
    screen.getByRole("button", { name: "Save & next performer" }),
  );
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  expect(api.editTags).toHaveBeenCalledWith(
    expect.anything(),
    expect.anything(),
    { added: [21], removed: [] },
  );
});
it("does not revisit already traversed scenes when a backward page refills", async () => {
  api.loadOccurrencePage.mockImplementation(async (_rule, _targets, page) => ({
    items:
      page === 1
        ? [first]
        : page === 2
          ? [third]
          : [
              {
                ...third,
                key: "3:11",
                media: { ...video, id: 3, title: "Last scene" },
              },
            ],
    totalCount: 3,
  }));
  open({
    ...review,
    view: { ...review.view, startFrom: "end", filter: { perPage: 1 } },
  });
  await ready();
  await screen.findByRole("link", { name: "Last scene" });
  fireEvent.click(screen.getByRole("button", { name: "Skip performer" }));
  await screen.findByRole("link", { name: "Next scene" });
  // A previous scene can shift into this page after a write; reverse traversal
  // must fetch the preceding page, rather than choosing this refill.
  api.loadOccurrencePage.mockImplementation(async (_rule, _targets, page) => ({
    items:
      page === 1
        ? [first]
        : [
            {
              ...third,
              key: "3:11",
              media: { ...video, id: 3, title: "Last scene" },
            },
          ],
    totalCount: 2,
  }));
  fireEvent.click(screen.getByRole("button", { name: "Skip performer" }));
  await screen.findByRole("link", { name: "First scene" });
});
it("disables duplicate saves while the first write is pending", async () => {
  let finish!: () => void;
  api.applyTags.mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );
  open();
  await ready();
  const action = screen.getByRole("button", { name: "q Observation" });
  fireEvent.click(action);
  fireEvent.click(action);
  fireEvent.keyDown(document.body, { key: "q" });
  await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(1));
  expect(action).toBeDisabled();
  finish();
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
});
it.each(["sort", "direction"])(
  "replaces multicolumn URL sorts when changing %s in the native toolbar",
  async (mode) => {
    window.history.replaceState(
      null,
      "",
      "/data-quality?review=r&sorts=date:asc,id:desc&page=1",
    );
    open();
    await ready();
    if (mode === "direction")
      fireEvent.click(screen.getByRole("button", { name: "Ascending" }));
    else
      fireEvent.change(
        screen
          .getByRole("group", { name: "Scene filters" })
          .querySelector("select")!,
        { target: { value: "title" } },
      );
    await waitFor(() =>
      expect(new URLSearchParams(window.location.search).has("sorts")).toBe(
        false,
      ),
    );
    expect(new URLSearchParams(window.location.search).get(mode)).toBe(
      mode === "sort" ? "title" : "desc",
    );
  },
);
it("does not clamp browser-restored pages against a previous query count", async () => {
  open();
  await ready();
  let finish!: (value: unknown) => void;
  api.loadOccurrencePage.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  await act(async () => {
    window.history.pushState(
      null,
      "",
      "/data-quality?review=r&q=other&page=5&perPage=1",
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  expect(new URLSearchParams(window.location.search).get("page")).toBe("5");
  await act(async () => finish({ items: [third], totalCount: 8 }));
  await ready();
  expect(new URLSearchParams(window.location.search).get("page")).toBe("5");
});
it("hands resolved tag names to the host toolbar and strips them from the applied query", async () => {
  const customFieldCriteria = [
    {
      key: "confirmed_absent_tags",
      type: "tag",
      modifier: "INCLUDES",
      value: "21",
    },
  ];
  open({
    ...review,
    view: { ...review.view, objectFilter: { customFieldCriteria } },
  });
  await ready();
  await waitFor(() => expect(api.request).toHaveBeenCalledWith("/api/tags/21"));
  expect(screen.getByRole("toolbar", { name: "Video list controls" })).toHaveAttribute(
    "data-custom-field-entity-type",
    "video",
  );
  testFilterControls.result = {
    organized: true,
    customFieldCriteria: [{ ...customFieldCriteria[0], displayValue: "Choice" }],
  };
  fireEvent.click(screen.getByRole("button", { name: "Filters, 1 active" }));
  fireEvent.click(screen.getByRole("button", { name: "Apply filters" }));
  await ready();
  expect(
    JSON.parse(new URLSearchParams(window.location.search).get("filters")!),
  ).toEqual({ organized: true, customFieldCriteria });
  fireEvent.click(screen.getByRole("button", { name: "Filters, 2 active" }));
  fireEvent.click(screen.getByRole("button", { name: "Clear all" }));
  fireEvent.click(screen.getByRole("button", { name: "Apply filters" }));
  await ready();
  expect(new URLSearchParams(window.location.search).get("filters")).toBe("{}");
  testFilterControls.result = { organized: true };
});
it("restores browser navigation after a pending write without overwriting its URL", async () => {
  let finish!: () => void;
  api.applyTags.mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );
  open();
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));
  await waitFor(() => expect(api.applyTags).toHaveBeenCalled());
  await act(async () => {
    window.history.pushState(
      null,
      "",
      "/data-quality?review=r&q=restored&page=1",
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
    finish();
  });
  await ready();
  expect(new URLSearchParams(window.location.search).get("q")).toBe("restored");
  expect(api.loadOccurrencePage).toHaveBeenLastCalledWith(
    expect.objectContaining({
      view: expect.objectContaining({
        filter: expect.objectContaining({ q: "restored" }),
      }),
    }),
    null,
    1,
    expect.anything(),
  );
});
it("does not rewrite a destination URL after the workspace unmounts during saving", async () => {
  let finish!: () => void;
  api.applyTags.mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );
  const view = open();
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));
  await waitFor(() => expect(api.applyTags).toHaveBeenCalled());
  view.unmount();
  window.history.pushState(null, "", "/data-quality?review=another");
  await act(async () => finish());
  expect(window.location.search).toBe("?review=another");
});
it.each(["Cancel filters", "Apply filters"])("restores the performer filter opener after %s", async choice => {
  open({ ...review, occurrence: { ...review.occurrence, targetMode: "filter" } });
  await ready();
  const trigger = screen.getByRole("button", { name: "Edit performer criteria" });
  trigger.focus();
  fireEvent.click(trigger);
  fireEvent.click(screen.getByRole("button", { name: choice }));
  await ready();
  await waitFor(() => expect(trigger).toHaveFocus());
});

it("retains the outer filter opener when editing chips inside a dialog", async () => {
  open(); await ready();
  const trigger = screen.getByRole("button", { name: /^Filters$/ });
  trigger.focus(); fireEvent.click(trigger);
  fireEvent.click(screen.getByRole("button", { name: "Edit filter: Nested criterion" }));
  fireEvent.click(screen.getByRole("button", { name: "Apply filters" }));
  await ready();
  await waitFor(() => expect(trigger).toHaveFocus());
});

it("labels portrait controls and preserves selection when an image is missing", async () => {
  open(); await ready();
  const first = screen.getByRole("button", { name: /^First performer$/ });
  expect(first).toHaveAttribute("aria-pressed", "true");
  expect(first).toHaveAttribute("title", "First performer");
  const portrait = first.querySelector("img")!;
  fireEvent.error(portrait);
  expect(portrait).toHaveStyle({ display: "none" });
  expect(first).toHaveTextContent("FP");
  expect(screen.queryByText(/· Active/)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /^Second performer$/ }));
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  expect(first).toHaveAttribute("aria-pressed", "false");
});

it("keeps only native pagination in the queue before the player", async () => {
  open(); await ready();
  const queue = screen.getByRole("complementary", { name: "Review queue" });
  expect(queue).not.toHaveTextContent(/matching scenes|Position|Scene page|Toward/);
  expect(within(queue).queryByRole("button", { name: /scene page|Refresh page/ })).not.toBeInTheDocument();
  const title = screen.getByRole("heading", { name: "First scene" });
  expect(queue.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

it("cancels rule criteria without changing saved defaults or the selected partner", async () => {
  const save = vi.fn();
  const rendered = open(review, true, save);
  await ready();
  fireEvent.click(screen.getByRole("button", { name: /^Second performer$/ }));
  const before = window.location.search;
  rendered.rerender(<ReviewWorkspace review={review} canWrite onBusy={() => {}} editRequest={1} onSaveDefaults={save} />);
  await screen.findByRole("region", { name: "Edit review rule" });
  fireEvent.change(screen.getByRole("combobox", { name: "Performers to review" }), { target: { value: "filter" } });
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), { target: { value: "draft search" } });
  await waitFor(() => expect(screen.getByRole("button", { name: "Save review" })).toBeEnabled());
  fireEvent.keyDown(document.body, { key: "q", code: "KeyQ" });
  expect(api.applyTags).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  expect(window.location.search).toBe(before);
  expect(save).not.toHaveBeenCalled();
});

it("keeps a failed rule save open and persists performer scope when retried", async () => {
  const female = { genderCriterion: { value: "Female", modifier: "EQUALS" } };
  testFilterControls.result = female;
  const save = vi.fn().mockRejectedValueOnce(new Error("Denied")).mockResolvedValueOnce(true);
  open(review, true, save, 1);
  await screen.findByRole("region", { name: "Edit review rule" });
  fireEvent.change(screen.getByRole("combobox", { name: "Performers to review" }), { target: { value: "filter" } });
  fireEvent.click(screen.getByRole("button", { name: "Edit performer criteria" }));
  fireEvent.click(screen.getByRole("button", { name: "Apply filters" }));
  await waitFor(() => expect(screen.getByRole("button", { name: "Save review" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Save review" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Your edits are still open");
  expect(screen.getByRole("combobox", { name: "Performers to review" })).toHaveValue("filter");
  fireEvent.click(screen.getByRole("button", { name: "Save review" }));
  await screen.findByText("Review saved.");
  expect(save).toHaveBeenLastCalledWith(expect.objectContaining({occurrence: expect.objectContaining({targetMode: "filter", performerFilter: female})}));
});

it("waits for the initial queue before opening a requested rule draft", async () => {
  let finish!: (value: {items: (typeof first)[]; totalCount: number}) => void;
  api.loadOccurrencePage.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
  render(<ReviewWorkspace review={review} canWrite onBusy={() => {}} editRequest={1} onSaveDefaults={vi.fn()} />);
  await waitFor(() => expect(api.loadOccurrencePage).toHaveBeenCalled());
  expect(screen.queryByRole("region", {name: "Edit review rule"})).not.toBeInTheDocument();
  await act(async () => finish({items: [first, second], totalCount: 1}));
  await screen.findByRole("region", {name: "Edit review rule"});
  fireEvent.click(screen.getByRole("button", {name: "Cancel"}));
  await screen.findByRole("heading", {name: "Reviewing First performer"});
});

it("allows requested rule editing after an initial queue failure and preserves retry on cancel", async () => {
  api.loadOccurrencePage.mockRejectedValueOnce(new Error("Queue offline"));
  const original = window.location.search;
  render(<ReviewWorkspace review={review} canWrite onBusy={() => {}} editRequest={1} onSaveDefaults={vi.fn()} />);
  await screen.findByRole("region", {name: "Edit review rule"});
  fireEvent.click(screen.getByRole("button", {name: "Cancel"}));
  expect(screen.getByRole("alert")).toHaveTextContent("Queue offline");
  expect(window.location.search).toBe(original);
  fireEvent.click(screen.getByRole("button", {name: "Retry queue"}));
  await screen.findByRole("heading", {name: "Reviewing First performer"});
});

it("drops batch results when the dialog closes and refreshes the queue", async () => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  open(); await ready();
  fireEvent.click(screen.getByRole("button", { name: "Apply to all matching occurrences" }));
  fireEvent.click(screen.getByRole("checkbox", { name: "Observation" }));
  fireEvent.click(screen.getByRole("button", { name: "Preview all matches" }));
  await screen.findByText("Preview ready. No tags have been changed.");
  fireEvent.click(screen.getByRole("button", { name: "Apply batch" }));
  await screen.findByText(/Batch finished/);
  expect(screen.getByRole("button", { name: "Undo batch" })).toBeEnabled();
  const loads = api.loadOccurrencePage.mock.calls.length;
  fireEvent.click(screen.getByRole("button", { name: "Close" }));
  await waitFor(() => expect(api.loadOccurrencePage.mock.calls.length).toBeGreaterThan(loads), { timeout: 3000 });
  await ready();
  expect(screen.queryByRole("button", { name: "Batch results / undo" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Apply to all matching occurrences" }));
  expect(screen.queryByRole("button", { name: "Undo batch" })).not.toBeInTheDocument();
  expect(screen.getByRole("checkbox", { name: "Observation" })).not.toBeChecked();
});

const ranked = (rule: OccurrenceReview, first = 12): PerformerRanking => ({
  signature: rankingSignature(rule),
  candidatesKey: "",
  candidates: [
    { id: 11, name: "First performer", total: 20, flags: [] },
    { id: 12, name: "Second performer", total: 4, flags: ["Changed"] },
  ],
  cursor: 2,
  ranked: [
    { id: 11, name: "First performer", count: first, total: 20, flags: [] },
    { id: 12, name: "Second performer", count: 3, total: 4, flags: ["Changed"] },
  ],
  limit: 50,
  complete: true,
});
const focusedOn = (id: number) =>
  expect.objectContaining({
    occurrence: expect.objectContaining({ targetMode: "selected", performerIds: [id] }),
  });

it("ranks performers beside the queue and focuses the queue on one without saving the focus", async () => {
  const scoped: OccurrenceReview = {
    ...review,
    occurrence: {
      ...review.occurrence,
      targetMode: "filter",
      performerFilter: { gender: "FEMALE" },
      condition: "excludesAll",
      conditionTagIds: [30, 40],
    },
  };
  panels.extendRanking.mockImplementation(async (rule: OccurrenceReview) => ranked(rule));
  open(scoped); await ready();
  const queue = within(screen.getByRole("complementary", { name: "Review queue" }));
  fireEvent.click(queue.getByRole("button", { name: "Performers" }));
  await queue.findByRole("button", { name: "First performer, 12 matching videos" });
  expect(panels.extendRanking).toHaveBeenCalledWith(
    expect.objectContaining({
      occurrence: expect.objectContaining({ targetMode: "filter", condition: "excludesAll" }),
    }),
    null,
    50,
    expect.any(AbortSignal),
    expect.anything(),
  );
  fireEvent.click(queue.getByRole("button", { name: "Second performer, 3 matching videos. Flagged: Changed" }));
  await waitFor(() => expect(api.resolvePerformers).toHaveBeenLastCalledWith(
    expect.objectContaining({
      occurrence: expect.objectContaining({
        targetMode: "selected",
        performerIds: [12],
        condition: "excludesAll",
        performerFilter: { gender: "FEMALE" },
      }),
    }),
    expect.anything(),
  ));
  await ready();
  const params = new URLSearchParams(window.location.search);
  expect(params.get("performer")).toBe("12");
  expect(JSON.parse(params.get("performerScope")!).targetMode).toBe("filter");
  expect(queue.getByRole("button", { name: "Scenes" })).toHaveAttribute("aria-pressed", "true");
  expect(await screen.findByRole("group", { name: "Performer focus" })).toHaveTextContent("Only Choice");
  expect(screen.queryByRole("button", { name: "Save changes to review filters" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Show all performers" }));
  await waitFor(() => expect(new URLSearchParams(window.location.search).has("performer")).toBe(false));
  await waitFor(() => expect(api.resolvePerformers).toHaveBeenLastCalledWith(
    expect.objectContaining({ occurrence: expect.objectContaining({ targetMode: "filter" }) }),
    expect.anything(),
  ));
});

it("keeps a performer focus through condition changes and drops it with a new performer scope", async () => {
  window.history.replaceState(null, "", "/data-quality?review=r&performer=12");
  open(); await ready();
  expect(api.resolvePerformers).toHaveBeenLastCalledWith(focusedOn(12), expect.anything());
  fireEvent.change(screen.getByRole("combobox", { name: "Occurrence tags" }), { target: { value: "isNull" } });
  await waitFor(() => expect(api.resolvePerformers).toHaveBeenLastCalledWith(
    expect.objectContaining({
      occurrence: expect.objectContaining({ condition: "isNull", performerIds: [12] }),
    }),
    expect.anything(),
  ));
  await ready();
  fireEvent.change(screen.getByRole("combobox", { name: "Performers to review" }), { target: { value: "selected" } });
  await waitFor(() => expect(new URLSearchParams(window.location.search).has("performer")).toBe(false));
  expect(screen.queryByRole("group", { name: "Performer focus" })).not.toBeInTheDocument();
});

it("shows the focused performer's existing answers and flags, and batches only that performer", async () => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  panels.loadPerformerAnswers.mockResolvedValue({
    answered: 2,
    groups: [{ id: 30, name: "Size", tags: [{ id: 31, name: "Small", count: 1 }, { id: 32, name: "Medium", count: 1 }] }],
  });
  api.request.mockImplementation(async (path: string) =>
    path === "/api/performers/11"
      ? { name: "First performer", tags: [{ id: 7, name: "Changed" }, { id: 8, name: "Other" }] }
      : { name: "Choice" },
  );
  window.history.replaceState(null, "", "/data-quality?review=r&performer=11");
  open({ ...review, occurrence: { ...review.occurrence, flagPerformerTagIds: [7] } }); await ready();
  const focus = await screen.findByRole("group", { name: "Performer focus" });
  await waitFor(() => expect(focus).toHaveTextContent("Only First performer"));
  expect(focus).toHaveTextContent("Flagged: Changed");
  expect(await screen.findByText(/Size: Small ×1, Medium ×1/)).toBeInTheDocument();
  expect(screen.getByText("Mixed answers")).toBeInTheDocument();
  const answerLoads = panels.loadPerformerAnswers.mock.calls.length;
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));
  await waitFor(() => expect(panels.loadPerformerAnswers.mock.calls.length).toBeGreaterThan(answerLoads), { timeout: 3000 });
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "Apply to all matching occurrences" }));
  expect(screen.getByText(/Flagged: Changed./)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("checkbox", { name: "Observation" }));
  fireEvent.click(screen.getByRole("button", { name: "Preview all matches" }));
  await screen.findByText("Preview ready. No tags have been changed.", {}, { timeout: 3000 });
  expect(api.resolvePerformers).toHaveBeenLastCalledWith(focusedOn(11), expect.any(AbortSignal));
});

it("recounts the saved performer in the ranking instead of ranking again", async () => {
  panels.extendRanking.mockImplementation(async (rule: OccurrenceReview) => ranked(rule));
  panels.countPerformer.mockResolvedValue(11);
  open(); await ready();
  const queue = within(screen.getByRole("complementary", { name: "Review queue" }));
  fireEvent.click(queue.getByRole("button", { name: "Performers" }));
  await queue.findByRole("button", { name: "First performer, 12 matching videos" });
  fireEvent.click(queue.getByRole("button", { name: "Scenes" }));
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));
  await waitFor(() => expect(panels.countPerformer).toHaveBeenCalledWith(expect.anything(), 11), { timeout: 3000 });
  fireEvent.click(queue.getByRole("button", { name: "Performers" }));
  expect(await queue.findByRole("button", { name: "First performer, 11 matching videos" })).toBeInTheDocument();
  expect(panels.extendRanking).toHaveBeenCalledTimes(1);
});

it("restarts the performer ranking when a save interrupts its first run", async () => {
  panels.extendRanking.mockImplementationOnce(
    (_rule: OccurrenceReview, _base: unknown, _limit: number, signal: AbortSignal) =>
      new Promise((_, reject) => signal.addEventListener("abort", () => reject(signal.reason), { once: true })),
  );
  panels.extendRanking.mockImplementation(async (rule: OccurrenceReview) => ranked(rule));
  open(); await ready();
  const queue = within(screen.getByRole("complementary", { name: "Review queue" }));
  fireEvent.click(queue.getByRole("button", { name: "Performers" }));
  await queue.findByRole("status");
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));
  expect(await queue.findByRole("button", { name: "First performer, 12 matching videos" }, { timeout: 3000 })).toBeInTheDocument();
  expect(panels.extendRanking).toHaveBeenCalledTimes(2);
});

it("counts again after an unfocused batch and recounts only the focused performer after a focused one", async () => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  panels.extendRanking.mockImplementation(async (rule: OccurrenceReview) => ranked(rule));
  panels.countPerformer.mockResolvedValue(2);
  const batch = async () => {
    fireEvent.click(screen.getByRole("button", { name: "Apply to all matching occurrences" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Observation" }));
    fireEvent.click(screen.getByRole("button", { name: "Preview all matches" }));
    await screen.findByText("Preview ready. No tags have been changed.", {}, { timeout: 3000 });
    fireEvent.click(screen.getByRole("button", { name: "Apply batch" }));
    await screen.findByText(/Batch finished/);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    await ready();
  };
  const rendered = open(); await ready();
  const queue = () => within(screen.getByRole("complementary", { name: "Review queue" }));
  fireEvent.click(queue().getByRole("button", { name: "Performers" }));
  await queue().findByRole("button", { name: "First performer, 12 matching videos" });
  fireEvent.click(queue().getByRole("button", { name: "Scenes" }));
  await batch();
  fireEvent.click(queue().getByRole("button", { name: "Performers" }));
  await waitFor(() => expect(panels.extendRanking).toHaveBeenCalledTimes(2));
  expect(panels.countPerformer).not.toHaveBeenCalled();
  rendered.unmount();
  panels.extendRanking.mockClear();
  window.history.replaceState(null, "", "/data-quality?review=r&performer=11");
  open(); await ready();
  fireEvent.click(queue().getByRole("button", { name: "Performers" }));
  await queue().findByRole("button", { name: "First performer, 12 matching videos" });
  fireEvent.click(queue().getByRole("button", { name: "Scenes" }));
  await batch();
  await waitFor(() => expect(panels.countPerformer).toHaveBeenCalledWith(expect.anything(), 11), { timeout: 3000 });
  fireEvent.click(queue().getByRole("button", { name: "Performers" }));
  expect(await queue().findByRole("button", { name: "First performer, 2 matching videos" })).toBeInTheDocument();
  expect(panels.extendRanking).toHaveBeenCalledTimes(1);
});

it("shows more performers on request and retries a failed ranking with Refresh", async () => {
  panels.extendRanking.mockRejectedValueOnce(new Error("Performers offline"));
  panels.extendRanking.mockImplementation(async (rule: OccurrenceReview, _base: unknown, limit: number) => ({
    ...ranked(rule),
    candidates: [...ranked(rule).candidates, { id: 13, name: "Third performer", total: 2, flags: [] }],
    limit,
  }));
  open(); await ready();
  const queue = within(screen.getByRole("complementary", { name: "Review queue" }));
  fireEvent.click(queue.getByRole("button", { name: "Performers" }));
  expect(await queue.findByRole("alert")).toHaveTextContent("Could not rank performers. Performers offline");
  fireEvent.click(queue.getByRole("button", { name: "Refresh" }));
  await queue.findByRole("button", { name: "First performer, 12 matching videos" });
  fireEvent.click(queue.getByRole("button", { name: "Show more performers" }));
  await waitFor(() => expect(panels.extendRanking).toHaveBeenLastCalledWith(
    expect.anything(),
    expect.objectContaining({ limit: 50 }),
    100,
    expect.any(AbortSignal),
    expect.anything(),
  ));
});

it("drops the focus when the selected performers change and never saves it with the criteria", async () => {
  const save = vi.fn().mockResolvedValue(true);
  const params = new URLSearchParams({
    review: "r",
    performer: "12",
    performerScope: JSON.stringify({
      targetMode: "selected",
      performerIds: [11, 12],
      performerFilter: {},
      condition: "any",
      conditionTagIds: [],
      includeSubtags: true,
      hideConfirmedAbsent: true,
    }),
  });
  window.history.replaceState(null, "", `/data-quality?${params}`);
  open(review, true, save); await ready();
  expect(api.resolvePerformers).toHaveBeenLastCalledWith(focusedOn(12), expect.anything());
  fireEvent.click(screen.getByRole("button", { name: "Save changes to review filters" }));
  await waitFor(() => expect(save).toHaveBeenCalled());
  const saved = save.mock.calls[0][0] as OccurrenceReview;
  expect(saved.occurrence).toMatchObject({ targetMode: "selected", performerIds: [11, 12] });
  expect(JSON.stringify(saved)).not.toContain("performerFocus");
  await ready();
  fireEvent.change(screen.getByPlaceholderText("All performers..."), { target: { value: "11" } });
  await waitFor(() => expect(new URLSearchParams(window.location.search).has("performer")).toBe(false));
  expect(api.resolvePerformers).toHaveBeenLastCalledWith(
    expect.objectContaining({ occurrence: expect.objectContaining({ performerIds: [11] }) }),
    expect.anything(),
  );
});

it("never shows the previous performer while the next focused one loads", async () => {
  panels.extendRanking.mockImplementation(async (rule: OccurrenceReview) => ranked(rule));
  api.request.mockImplementation((path: string) =>
    path === "/api/performers/12" ? new Promise(() => {}) : Promise.resolve({ name: "First performer" }),
  );
  window.history.replaceState(null, "", "/data-quality?review=r&performer=11");
  open(); await ready();
  const focus = await screen.findByRole("group", { name: "Performer focus" });
  await waitFor(() => expect(focus).toHaveTextContent("Only First performer"));
  const queue = within(screen.getByRole("complementary", { name: "Review queue" }));
  fireEvent.click(queue.getByRole("button", { name: "Performers" }));
  fireEvent.click(await queue.findByRole("button", { name: "Second performer, 3 matching videos. Flagged: Changed" }));
  await waitFor(() => expect(screen.getByRole("group", { name: "Performer focus" })).toHaveTextContent("Only Second performer"));
  expect(screen.getByRole("group", { name: "Performer focus" })).toHaveTextContent("Flagged: Changed");
});

it("stops counting for criteria no longer shown and lends the loaded performers to the new count", async () => {
  let firstSignal!: AbortSignal;
  panels.extendRanking.mockImplementationOnce(
    (_rule: OccurrenceReview, _base: unknown, _limit: number, signal: AbortSignal) => {
      firstSignal = signal;
      return new Promise((_, reject) => signal.addEventListener("abort", () => reject(signal.reason), { once: true }));
    },
  );
  panels.extendRanking.mockImplementation(async (rule: OccurrenceReview) => ranked(rule));
  open(); await ready();
  const queue = within(screen.getByRole("complementary", { name: "Review queue" }));
  fireEvent.click(queue.getByRole("button", { name: "Performers" }));
  await waitFor(() => expect(firstSignal).toBeDefined());
  fireEvent.click(queue.getByRole("button", { name: "Scenes" }));
  fireEvent.change(screen.getByRole("combobox", { name: "Occurrence tags" }), { target: { value: "isNull" } });
  await waitFor(() => expect(firstSignal.aborted).toBe(true));
  await ready();
  fireEvent.click(queue.getByRole("button", { name: "Performers" }));
  const previous = await queue.findByRole("button", { name: "First performer, 12 matching videos" });
  expect(previous).toBeInTheDocument();
  fireEvent.change(screen.getByRole("combobox", { name: "Occurrence tags" }), { target: { value: "any" } });
  await waitFor(() => expect(panels.extendRanking).toHaveBeenCalledTimes(3));
  // The ranking counted for the previous condition is handed over, so its performers are reused.
  expect(panels.extendRanking.mock.calls[2][1]).toMatchObject({
    signature: expect.stringContaining('"condition":"isNull"'),
    candidates: expect.arrayContaining([expect.objectContaining({ id: 11 })]),
  });
});

it("discards a recount when a count started meanwhile, then counts again", async () => {
  panels.extendRanking.mockImplementationOnce(async (rule: OccurrenceReview) => ({
    ...ranked(rule),
    candidates: [...ranked(rule).candidates, { id: 13, name: "Third performer", total: 2, flags: [] }],
  }));
  let showMoreSignal!: AbortSignal;
  panels.extendRanking.mockImplementationOnce(
    (_rule: OccurrenceReview, _base: unknown, _limit: number, signal: AbortSignal) => {
      showMoreSignal = signal;
      return new Promise((_, reject) => signal.addEventListener("abort", () => reject(signal.reason), { once: true }));
    },
  );
  panels.extendRanking.mockImplementation(async (rule: OccurrenceReview) => ranked(rule, 7));
  let finishCount!: (count: number) => void;
  panels.countPerformer.mockImplementation(() => new Promise<number>((resolve) => { finishCount = resolve; }));
  open(); await ready();
  const queue = within(screen.getByRole("complementary", { name: "Review queue" }));
  fireEvent.click(queue.getByRole("button", { name: "Performers" }));
  await queue.findByRole("button", { name: "First performer, 12 matching videos" });
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));
  await waitFor(() => expect(panels.countPerformer).toHaveBeenCalled(), { timeout: 3000 });
  fireEvent.click(await queue.findByRole("button", { name: "Show more performers" }));
  await waitFor(() => expect(showMoreSignal).toBeDefined());
  await act(async () => finishCount(5));
  await waitFor(() => expect(showMoreSignal.aborted).toBe(true));
  expect(await queue.findByRole("button", { name: "First performer, 7 matching videos" })).toBeInTheDocument();
  expect(queue.queryByRole("button", { name: "First performer, 5 matching videos" })).not.toBeInTheDocument();
  expect(panels.extendRanking).toHaveBeenCalledTimes(3);
});

it("counts once even when the run's last partial snapshot renders after the run ends", async () => {
  panels.extendRanking.mockImplementation(
    async (
      rule: OccurrenceReview,
      _base: unknown,
      _limit: number,
      _signal: AbortSignal,
      options: { onProgress?(ranking: PerformerRanking): void },
    ) => {
      const done = ranked(rule);
      for (let step = 0; step < 3; step++) {
        options.onProgress?.({ ...done, partial: true, complete: false });
        // Let a render with the partial snapshot commit before the next count arrives.
        await new Promise((resolve) => setTimeout(resolve, 5));
      }
      options.onProgress?.({ ...done, partial: true, complete: false });
      return done;
    },
  );
  open(); await ready();
  const queue = within(screen.getByRole("complementary", { name: "Review queue" }));
  fireEvent.click(queue.getByRole("button", { name: "Performers" }));
  await queue.findByRole("button", { name: "First performer, 12 matching videos" });
  await new Promise((resolve) => setTimeout(resolve, 200));
  expect(panels.extendRanking).toHaveBeenCalledTimes(1);
});

it("offers the missing-at-least-one condition and its absence hiding in the workspace", async () => {
  open({ ...review, occurrence: { ...review.occurrence, condition: "excludesAll", conditionTagIds: [21, 22] } });
  await ready();
  expect(screen.getByRole("combobox", { name: "Occurrence tags" })).toHaveValue("excludesAll");
  expect(screen.getByRole("checkbox", { name: "Hide occurrences confirmed absent" })).toBeChecked();
});

it("refreshes the queue after each save and removes a scene only after its last matching performer", async () => {
  api.loadOccurrencePage.mockResolvedValueOnce({ items: [first, second, third], totalCount: 2 });
  api.loadOccurrencePage.mockResolvedValueOnce({ items: [second, third], totalCount: 2 });
  api.loadOccurrencePage.mockResolvedValue({ items: [third], totalCount: 1 });
  open(); await ready();
  const queue = within(screen.getByRole("complementary", { name: "Review queue" }));
  const player = screen.getByTestId("video-player");
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));
  await waitFor(() => expect(queue.queryByRole("button", { name: "First performer — First scene" })).not.toBeInTheDocument(), { timeout: 3000 });
  expect(queue.getByRole("button", { name: "Second performer — First scene" })).toBeInTheDocument();
  expect(screen.getByTestId("video-player")).toBe(player);
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));
  await screen.findByRole("link", { name: "Next scene" }, { timeout: 3000 });
  expect(queue.queryByRole("button", { name: /First scene/ })).not.toBeInTheDocument();
});

it.each([true, false])("autoplays the next video after applying regardless of prior playback (%s)", async playing => {
  api.loadOccurrencePage.mockResolvedValueOnce({ items: [first, third], totalCount: 2 });
  api.loadOccurrencePage.mockResolvedValue({ items: [third], totalCount: 1 });
  open(); await ready();
  expect(screen.getByTestId("video-player")).toHaveAttribute("data-autostart", "false");
  fireEvent.click(screen.getByRole("button", { name: "Play review video" }));
  if (!playing) fireEvent.click(screen.getByRole("button", { name: "Pause review video" }));
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));
  await screen.findByRole("link", { name: "Next scene" }, { timeout: 3000 });
  expect(screen.getByTestId("video-player")).toHaveAttribute("data-autostart", "true");
});


it("refreshes on Apply & stay without closing or restarting the current video", async () => {
  api.loadOccurrencePage.mockResolvedValueOnce({ items: [first, third], totalCount: 2 });
  api.loadOccurrencePage.mockResolvedValue({ items: [third], totalCount: 1 });
  open(); await ready();
  const player = screen.getByTestId("video-player");
  fireEvent.click(screen.getByRole("button", { name: "Play review video" }));
  fireEvent.click(screen.getByRole("button", { name: "Apply & stay: Observation" }));
  await waitFor(() => expect(api.applyTags).toHaveBeenCalled());
  await ready();
  const queue = within(screen.getByRole("complementary", { name: "Review queue" }));
  expect(queue.queryByRole("button", { name: /First scene/ })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "First scene" })).toBeInTheDocument();
  expect(screen.getByTestId("video-player")).toBe(player);
  fireEvent.click(screen.getByRole("button", { name: "Skip performer" }));
  await screen.findByRole("link", { name: "Next scene" });
  expect(screen.getByTestId("video-player")).toHaveAttribute("data-autostart", "false");
});

it("keeps partners together during a shrinking reverse review and does not revisit refills", async () => {
  const partner = { ...third, key: "2:12", performer: video.performers[1] };
  const traversed = { ...third, key: "3:11", media: { ...video, id: 3, title: "Already traversed" } };
  api.loadOccurrencePage.mockImplementation(async (_rule, _targets, page) => ({
    items: page === 1 ? [first] : [third, partner], totalCount: 3,
  }));
  window.history.replaceState(null, "", "/data-quality?review=r&page=2&perPage=1&startFrom=end");
  open(); await ready();
  api.loadOccurrencePage.mockImplementation(async (_rule, _targets, page) => ({
    items: page === 1 ? [first] : [partner], totalCount: 3,
  }));
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  await ready();
  api.loadOccurrencePage.mockImplementation(async (_rule, _targets, page) => ({
    items: page === 1 ? [first] : [traversed], totalCount: 2,
  }));
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));
  await screen.findByRole("link", { name: "First scene" });
  expect(screen.queryByRole("link", { name: "Already traversed" })).not.toBeInTheDocument();
});

it("does not carry autoplay into a manually selected video", async () => {
  const later = {
    ...first,
    key: "3:11",
    media: { ...video, id: 3, title: "Later scene" },
  };
  const rule: OccurrenceReview = {
    ...review,
    view: { ...review.view, filter: { ...review.view.filter, perPage: 3 } },
  };
  api.loadOccurrencePage.mockResolvedValueOnce({ items: [first, third, later], totalCount: 3 });
  api.loadOccurrencePage.mockResolvedValue({ items: [third, later], totalCount: 2 });
  open(rule); await ready();
  fireEvent.click(screen.getByRole("button", { name: "Play review video" }));
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));
  await screen.findByRole("link", { name: "Next scene" });
  await ready();
  expect(screen.getByTestId("video-player")).toHaveAttribute("data-autostart", "true");
  fireEvent.click(screen.getByRole("button", { name: "First performer — Later scene" }));
  await screen.findByRole("link", { name: "Later scene" });
  expect(screen.getByTestId("video-player")).toHaveAttribute("data-autostart", "false");
});


it("does not revisit a reverse-page refill after Apply & stay removes the active occurrence", async () => {
  const traversed = { ...third, key: "3:11", media: { ...video, id: 3, title: "Already traversed" } };
  api.loadOccurrencePage.mockImplementation(async (_rule, _targets, page) => ({ items: page === 1 ? [first] : [third], totalCount: 3 }));
  window.history.replaceState(null, "", "/data-quality?review=r&page=2&perPage=1&startFrom=end");
  open(); await ready();
  api.loadOccurrencePage.mockImplementation(async (_rule, _targets, page) => ({ items: page === 1 ? [first] : [traversed], totalCount: 2 }));
  fireEvent.click(screen.getByRole("button", { name: "Apply & stay: Observation" }));
  await waitFor(() => expect(api.applyTags).toHaveBeenCalled());
  await ready();
  expect(screen.getByRole("link", { name: "Next scene" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Skip performer" }));
  await screen.findByRole("link", { name: "First scene" });
});

it("does not restart a paused autoplay video when a query reload returns the same scene", async () => {
  api.loadOccurrencePage.mockResolvedValueOnce({ items: [first, third], totalCount: 2 });
  api.loadOccurrencePage.mockResolvedValue({ items: [third], totalCount: 1 });
  open(); await ready();
  fireEvent.click(screen.getByRole("button", { name: "Play review video" }));
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));
  await screen.findByRole("link", { name: "Next scene" });
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "Pause review video" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), { target: { value: "temporary" } });
  await waitFor(() => expect(screen.getByRole("button", { name: "Reset to default review filters" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Reset to default review filters" }));
  await ready();
  expect(screen.getByTestId("video-player")).toHaveAttribute("data-autostart", "false");
});


it("continues past skipped performers after Apply & stay removes a middle row", async () => {
  api.loadOccurrencePage.mockResolvedValueOnce({ items: [first, second, third], totalCount: 2 });
  api.loadOccurrencePage.mockResolvedValue({ items: [first, third], totalCount: 2 });
  open(); await ready();
  fireEvent.click(screen.getByRole("button", { name: "Skip performer" }));
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "Apply & stay: Observation" }));
  await waitFor(() => expect(api.applyTags).toHaveBeenCalled());
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "Skip performer" }));
  await screen.findByRole("link", { name: "Next scene" });
});


it("continues into the preceding page when Apply & stay clamps a removed last scene", async () => {
  api.loadOccurrencePage.mockImplementation(async (_rule, _targets, page) => ({ items: page === 1 ? [first] : [third], totalCount: 2 }));
  window.history.replaceState(null, "", "/data-quality?review=r&page=2&perPage=1&startFrom=end");
  open(); await ready();
  api.loadOccurrencePage.mockImplementation(async (_rule, _targets, page) => ({ items: page === 1 ? [first] : [], totalCount: 1 }));
  fireEvent.click(screen.getByRole("button", { name: "Apply & stay: Observation" }));
  await waitFor(() => expect(api.applyTags).toHaveBeenCalled());
  await ready();
  expect(new URLSearchParams(window.location.search).get("page")).toBe("1");
  fireEvent.click(screen.getByRole("button", { name: "Skip performer" }));
  await screen.findByRole("link", { name: "First scene" });
});


it("restores the pinned cursor when cancelling a rule edit after a queue reload", async () => {
  api.loadOccurrencePage.mockResolvedValueOnce({ items: [first, second, third], totalCount: 2 });
  api.loadOccurrencePage.mockResolvedValue({ items: [first, third], totalCount: 2 });
  const rendered = open(); await ready();
  fireEvent.click(screen.getByRole("button", { name: "Skip performer" }));
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "Apply & stay: Observation" }));
  await waitFor(() => expect(api.applyTags).toHaveBeenCalled());
  await ready();
  rendered.rerender(<ReviewWorkspace review={review} canWrite onBusy={() => {}} editRequest={1} onSaveDefaults={vi.fn()} />);
  await screen.findByRole("region", { name: "Edit review rule" });
  const loads = api.loadOccurrencePage.mock.calls.length;
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), { target: { value: "draft" } });
  await waitFor(() => expect(api.loadOccurrencePage.mock.calls.length).toBeGreaterThan(loads));
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "Skip performer" }));
  await screen.findByRole("link", { name: "Next scene" });
});

it("autoplays after an action even when query navigation remounted a paused player", async () => {
  api.loadOccurrencePage.mockResolvedValue({ items: [first, third], totalCount: 2 });
  open(); await ready();
  fireEvent.click(screen.getByRole("button", { name: "Play review video" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), { target: { value: "temporary" } });
  await waitFor(() => expect(screen.getByRole("button", { name: "Reset to default review filters" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Reset to default review filters" }));
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));
  await screen.findByRole("link", { name: "Next scene" });
  expect(screen.getByTestId("video-player")).toHaveAttribute("data-autostart", "true");
});


it("autoplays after an action even after manually visiting another scene", async () => {
  api.loadOccurrencePage.mockResolvedValue({ items: [first, third], totalCount: 2 });
  open(); await ready();
  fireEvent.click(screen.getByRole("button", { name: "Play review video" }));
  fireEvent.click(screen.getByRole("button", { name: "First performer — Next scene" }));
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "First performer — First scene" }));
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));
  await screen.findByRole("link", { name: "Next scene" });
  expect(screen.getByTestId("video-player")).toHaveAttribute("data-autostart", "true");
});
