import {
  act,
  configure,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  activeTestKeys,
  testFilterControls,
  testGlobalShortcuts,
  testKeyboardConflicts,
  testPlayerShortcuts,
  testVideoControls,
} from "./runtime-components";
import { setViewportWidth } from "./viewport";
import { ReviewWorkspace, orderedItems } from "../ReviewWorkspace";
import type { MediaReview, MediaReviewAction, OccurrenceReview, VideoReview } from "../model";
import type { ReviewItem, TagState } from "../reviewTags";
import { rankingSignature, type PerformerRanking } from "../performerRanking";
import { clearProfiles } from "../performerProfiles";
configure({ asyncUtilTimeout: 3000 });
const api = vi.hoisted(() => ({
  findMedia: vi.fn(),
  request: vi.fn(),
  resolveTagTree: vi.fn(),
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
  resolveTagTree: api.resolveTagTree,
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
  clearProfiles();
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
  // A tree resolves to its parent alone unless a test says otherwise.
  api.resolveTagTree.mockImplementation(async (ids: number[]) => ids);
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
/** The Scope popover holds the occurrence controls; opening it twice would close it. */
function openScope() {
  if (!screen.queryByRole("dialog", { name: "Queue scope" }))
    fireEvent.click(screen.getByRole("button", { name: /^Scope/ }));
  return within(screen.getByRole("dialog", { name: "Queue scope" }));
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
it("has no Apply and stay button beside its actions: Shift applies and stays", async () => {
  open();
  await ready();
  expect(screen.getByRole("button", { name: "q Observation" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /apply and stay/i })).not.toBeInTheDocument();
  expect(screen.getByRole("region", { name: "Actions" })).toHaveTextContent(
    "Shift+ key or Shift-click applies and stays",
  );
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
it.each(["shift-click", "shift shortcut"])(
  "supports %s without advancing",
  async (alternative) => {
    open();
    await ready();
    if (alternative === "shift-click")
      fireEvent.click(screen.getByRole("button", { name: "q Observation" }), {
        shiftKey: true,
      });
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
  await waitFor(() =>
    expect(screen.getByRole("list", { name: "Current tags" })).toHaveTextContent("Saved part"),
  );
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
  expect(screen.queryByRole("button", { name: "Save to review" })).not.toBeInTheDocument();
  openScope();
  expect(screen.getByRole("checkbox", { name: "Include subtags" })).toBeChecked();
  fireEvent.click(screen.getByRole("checkbox", { name: "Include subtags" }));
  await waitFor(() => expect(api.loadOccurrencePage).toHaveBeenLastCalledWith(
    expect.objectContaining({ occurrence: expect.objectContaining({ includeSubtags: false }) }),
    null, 1, expect.anything(),
  ));
  expect(JSON.parse(new URLSearchParams(window.location.search).get("performerScope")!).includeSubtags).toBe(false);
  fireEvent.click(screen.getByRole("button", { name: "Save to review" }));
  await waitFor(() => expect(save).toHaveBeenCalledWith(
    expect.objectContaining({ occurrence: expect.objectContaining({ includeSubtags: false }) }),
  ));
  expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument();
});

it("gives single-video reviews the same compact save and reset controls", async () => {
  const rule: VideoReview = { ...review, entityType: "video" };
  const save = vi.fn().mockResolvedValue(true);
  open(rule, true, save);
  await ready();
  expect(screen.queryByRole("button", { name: "Save to review" })).not.toBeInTheDocument();

  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), {
    target: { value: "temporary" },
  });

  fireEvent.click(await screen.findByRole("button", { name: "Save to review" }));
  await waitFor(() => expect(save).toHaveBeenCalledWith(
    expect.objectContaining({
      entityType: "video",
      view: expect.objectContaining({
        filter: expect.objectContaining({ q: "temporary", page: 1 }),
      }),
    }),
  ));
  expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument();
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
  fireEvent.click(await screen.findByRole("button", { name: "Save to review" }));

  expect(await screen.findByText("Could not save queue. Temporary failure")).toBeInTheDocument();
  expect(screen.getByRole("textbox", { name: "Search list" })).toHaveValue("temporary");
  expect(screen.getByRole("button", { name: "Save to review" })).toBeEnabled();
  expect(screen.getByRole("button", { name: "Reset" })).toBeEnabled();

  fireEvent.click(screen.getByRole("button", { name: "Save to review" }));
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

  expect(screen.getByRole("button", { name: "Save to review" })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "Reset" }));
  await waitFor(() => expect(new URLSearchParams(window.location.search).get("startFrom")).toBe("beginning"));
  expect(screen.queryByRole("button", { name: "Save to review" })).not.toBeInTheDocument();
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

  expect(screen.queryByRole("button", { name: "Save to review" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
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
  fireEvent.click(screen.getByRole("button", { name: "Save to review" }));
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
    screen.getByRole("button", { name: "Reset" }),
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
it("shows the 27 action keys in order and reaches later actions through Find action", async () => {
  open({
    ...review,
    actions: Array.from({ length: 28 }, (_, index) => ({
      id: `action-${index}`,
      label: `Action ${index + 1}`,
      steps: [],
    })),
  });
  await ready();
  expect(screen.getByRole("button", { name: "p Action 10" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "å Action 11" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "a Action 12" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "f Action 15" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "g Action 16" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "k Action 19" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "ö Action 21" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "b Action 27" }).querySelector("kbd")).not.toBeNull();
  // Action 28 has no key: the pad has no tile for it, and its Find tile counts it.
  expect(screen.queryByRole("button", { name: /Action 28$/ })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Find action, 1 more" })).toBeEnabled();
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
  openScope();
  const trigger = screen.getByRole("button", { name: "Edit criteria" });
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

it("offers the other matching partners and keeps their initials when an image is missing", async () => {
  open(); await ready();
  const player = screen.getByTestId("video-player");
  const partners = within(screen.getByRole("region", { name: "Also in this scene" }));
  expect(partners.queryByRole("button", { name: /^First performer$/ })).not.toBeInTheDocument();
  const second = partners.getByRole("button", { name: /^Second performer$/ });
  expect(second).toHaveAttribute("title", "Second performer");
  const portrait = second.querySelector("img")!;
  fireEvent.error(portrait);
  expect(portrait).toHaveStyle({ display: "none" });
  expect(second).toHaveTextContent("SP");
  fireEvent.click(second);
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  // Switching partners keeps the scene playing in the same player.
  expect(screen.getByTestId("video-player")).toBe(player);
  expect(
    within(screen.getByRole("region", { name: "Also in this scene" })).getByRole("button", {
      name: /^First performer$/,
    }),
  ).toBeInTheDocument();
});

it("pages from the header and lists the queue after the workspace", async () => {
  open(); await ready();
  const queue = screen.getByRole("complementary", { name: "Review queue" });
  expect(queue).not.toHaveTextContent(/matching scenes|Position|Scene page|Toward/);
  expect(within(queue).queryByRole("button", { name: /page/i })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Page 1 of 1. Go to page" })).toBeDisabled();
  // Narrow windows stack the workspace first and the queue below it.
  const title = screen.getByRole("heading", { name: "First scene" });
  expect(queue.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
});

it("moves between queue pages with the header pager and its go-to field", async () => {
  api.loadOccurrencePage.mockImplementation(async (_rule, _targets, page) => ({
    items: [{ ...first, key: `${page}:11`, media: { ...video, id: page, title: `Scene ${page}` } }],
    totalCount: 5,
  }));
  open(); await ready();
  expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Next page" }));
  await screen.findByRole("link", { name: "Scene 2" });
  expect(new URLSearchParams(window.location.search).get("page")).toBe("2");
  fireEvent.click(screen.getByRole("button", { name: "Page 2 of 3. Go to page" }));
  const field = screen.getByRole("spinbutton", { name: "Go to page, 1 to 3" });
  fireEvent.change(field, { target: { value: "3" } });
  fireEvent.keyDown(field, { key: "Enter" });
  await screen.findByRole("link", { name: "Scene 3" });
  expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  // Esc leaves the page as it is.
  fireEvent.click(screen.getByRole("button", { name: "Page 3 of 3. Go to page" }));
  fireEvent.keyDown(screen.getByRole("spinbutton", { name: "Go to page, 1 to 3" }), { key: "Escape" });
  expect(screen.getByRole("button", { name: "Page 3 of 3. Go to page" })).toBeInTheDocument();
});

it("cancels rule criteria without changing saved defaults or the selected partner", async () => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  const save = vi.fn();
  const rendered = open(review, true, save);
  await ready();
  fireEvent.click(screen.getByRole("button", { name: /^Second performer$/ }));
  const before = window.location.search;
  rendered.rerender(<ReviewWorkspace review={review} canWrite onBusy={() => {}} editRequest={1} onSaveDefaults={save} />);
  await screen.findByRole("dialog", { name: "Edit review" });
  fireEvent.click(openScope().getByRole("button", { name: "Matching criteria" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), { target: { value: "draft search" } });
  await waitFor(() => expect(screen.getByRole("button", { name: "Save review" })).toBeEnabled());
  fireEvent.keyDown(document.body, { key: "q", code: "KeyQ" });
  expect(api.applyTags).not.toHaveBeenCalled();
  // With unsaved changes Cancel asks first, as Esc and Close do.
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  fireEvent.click(
    within(screen.getByRole("dialog", { name: "Discard unsaved changes?" })).getByRole("button", {
      name: "Discard",
    }),
  );
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  expect(window.location.search).toBe(before);
  expect(save).not.toHaveBeenCalled();
});

it("keeps a failed rule save open and persists performer scope when retried", async () => {
  const female = { genderCriterion: { value: "Female", modifier: "EQUALS" } };
  testFilterControls.result = female;
  const save = vi.fn().mockRejectedValueOnce(new Error("Denied")).mockResolvedValueOnce(true);
  open(review, true, save, 1);
  await screen.findByRole("dialog", { name: "Edit review" });
  fireEvent.click(openScope().getByRole("button", { name: "Matching criteria" }));
  fireEvent.click(screen.getByRole("button", { name: "Edit criteria" }));
  fireEvent.click(screen.getByRole("button", { name: "Apply filters" }));
  await waitFor(() => expect(screen.getByRole("button", { name: "Save review" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Save review" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Your edits are still open");
  expect(openScope().getByRole("button", { name: "Matching criteria" })).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(screen.getByRole("button", { name: "Save review" }));
  await screen.findByText("Review saved.");
  expect(save).toHaveBeenLastCalledWith(expect.objectContaining({occurrence: expect.objectContaining({targetMode: "filter", performerFilter: female})}));
});

it("waits for the initial queue before opening a requested rule draft", async () => {
  let finish!: (value: {items: (typeof first)[]; totalCount: number}) => void;
  api.loadOccurrencePage.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
  render(<ReviewWorkspace review={review} canWrite onBusy={() => {}} editRequest={1} onSaveDefaults={vi.fn()} />);
  await waitFor(() => expect(api.loadOccurrencePage).toHaveBeenCalled());
  expect(screen.queryByRole("dialog", {name: "Edit review"})).not.toBeInTheDocument();
  await act(async () => finish({items: [first, second], totalCount: 1}));
  await screen.findByRole("dialog", {name: "Edit review"});
  fireEvent.click(screen.getByRole("button", {name: "Cancel"}));
  await screen.findByRole("heading", {name: "Reviewing First performer"});
});

it("allows requested rule editing after an initial queue failure and preserves retry on cancel", async () => {
  api.loadOccurrencePage.mockRejectedValueOnce(new Error("Queue offline"));
  const original = window.location.search;
  render(<ReviewWorkspace review={review} canWrite onBusy={() => {}} editRequest={1} onSaveDefaults={vi.fn()} />);
  await screen.findByRole("dialog", {name: "Edit review"});
  fireEvent.click(screen.getByRole("button", {name: "Cancel"}));
  expect(screen.getByRole("alert")).toHaveTextContent("Queue offline");
  expect(window.location.search).toBe(original);
  fireEvent.click(screen.getByRole("button", {name: "Retry queue"}));
  await screen.findByRole("heading", {name: "Reviewing First performer"});
});

it("drops batch results when the dialog closes and refreshes the queue", async () => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  open(); await ready();
  fireEvent.click(screen.getByRole("button", { name: "Batch…" }));
  fireEvent.click(screen.getByRole("checkbox", { name: "Observation" }));
  fireEvent.click(screen.getByRole("button", { name: "Preview all matches" }));
  await screen.findByText("Preview ready. No tags have been changed.");
  fireEvent.click(screen.getByRole("button", { name: /^Apply to \d+ occurrences?$/ }));
  await screen.findByText(/Batch finished/);
  expect(screen.getByRole("button", { name: "Undo batch" })).toBeEnabled();
  const loads = api.loadOccurrencePage.mock.calls.length;
  fireEvent.click(screen.getByRole("button", { name: "Close" }));
  await waitFor(() => expect(api.loadOccurrencePage.mock.calls.length).toBeGreaterThan(loads), { timeout: 3000 });
  await ready();
  // Focus comes back to Batch… once the refreshed queue lets it be used.
  await waitFor(() => expect(screen.getByRole("button", { name: "Batch…" })).toHaveFocus());
  expect(screen.queryByRole("button", { name: "Batch results / undo" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Batch…" }));
  expect(screen.queryByRole("button", { name: "Undo batch" })).not.toBeInTheDocument();
  expect(screen.getByRole("checkbox", { name: "Observation" })).not.toBeChecked();
});

const ranked = (rule: OccurrenceReview, first = 12): PerformerRanking => ({
  signature: rankingSignature(rule),
  candidatesKey: "",
  candidates: [
    { id: 11, name: "First performer", total: 20, tags: [] },
    { id: 12, name: "Second performer", total: 4, tags: [{ id: 7, name: "Changed" }, { id: 8, name: "Other" }] },
  ],
  cursor: 2,
  ranked: [
    { id: 11, name: "First performer", count: first, total: 20, tags: [] },
    { id: 12, name: "Second performer", count: 3, total: 4, tags: [{ id: 7, name: "Changed" }, { id: 8, name: "Other" }] },
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
      flagPerformerTagIds: [7],
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
  expect(screen.queryByRole("button", { name: "Save to review" })).not.toBeInTheDocument();
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
  fireEvent.change(openScope().getByRole("combobox", { name: "Occurrence condition" }), { target: { value: "isNull" } });
  await waitFor(() => expect(api.resolvePerformers).toHaveBeenLastCalledWith(
    expect.objectContaining({
      occurrence: expect.objectContaining({ condition: "isNull", performerIds: [12] }),
    }),
    expect.anything(),
  ));
  await ready();
  fireEvent.click(openScope().getByRole("button", { name: "Specific performers" }));
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
  const answers = within(await screen.findByRole("region", { name: "Existing answers" }));
  const size = await answers.findByRole("list", { name: "Size" });
  expect(size).toHaveTextContent("Small1, 1 video");
  expect(size).toHaveTextContent("Medium1, 1 video");
  // Nothing says Size takes one answer (no only-one answer, no group): counts, no Mixed.
  expect(answers.queryByText("Mixed")).toBeNull();
  // The item column flags the focused performer too.
  expect(screen.getByRole("complementary", { name: "Current item" })).toHaveTextContent("Flagged: Changed");
  const answerLoads = panels.loadPerformerAnswers.mock.calls.length;
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }));
  await waitFor(() => expect(panels.loadPerformerAnswers.mock.calls.length).toBeGreaterThan(answerLoads), { timeout: 3000 });
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "Batch…" }));
  const dialog = within(screen.getByRole("dialog", { name: "Apply to all matching occurrences" }));
  await waitFor(() =>
    expect(dialog.getByRole("note")).toHaveTextContent("First performer is flagged: Changed."),
  );
  fireEvent.click(screen.getByRole("checkbox", { name: "Observation" }));
  fireEvent.click(screen.getByRole("button", { name: "Preview all matches" }));
  await screen.findByText("Preview ready. No tags have been changed.", {}, { timeout: 3000 });
  expect(api.resolvePerformers).toHaveBeenLastCalledWith(focusedOn(11), expect.any(AbortSignal));
});

describe("category attention", () => {
  const profileReads = (id: number) =>
    api.request.mock.calls.filter(([path]) => path === `/api/performers/${id}`).length;
  const panel = () => within(screen.getByRole("complementary", { name: "Current item" }));
  const attention = () =>
    within(panel().getByRole("list", { name: "Needs attention" }))
      .getAllByRole("listitem")
      .map((item) => item.textContent);
  const flaggedKeys = () =>
    [...document.querySelectorAll<HTMLElement>(".dq-pad-tile[data-attention]")].map(
      (tile) => tile.title,
    );
  // Sizes, one answer each as an answer group, and a colour; a flag tag for colour on the first
  // performer's profile.
  const sized: OccurrenceReview = {
    ...review,
    actions: [
      { id: "small", label: "Small", group: "Size", steps: [{ mode: "ADD", tagIds: [31] }] },
      { id: "medium", label: "Medium", group: "Size", steps: [{ mode: "ADD", tagIds: [32] }] },
      { id: "red", label: "Red", steps: [{ mode: "ADD", tagIds: [41] }] },
    ],
    occurrence: {
      ...review.occurrence,
      condition: "excludesAll",
      conditionTagIds: [30, 40],
      performerFlags: [{ tagId: 7, categoryTagId: 40 }],
    },
  };
  const profiles: Record<string, unknown> = {
    "/api/performers/11": { name: "First performer", tags: [{ id: 7, name: "Colour changed" }] },
    "/api/performers/12": { name: "Second performer", tags: [{ id: 5, name: "Unrelated" }] },
    "/api/tags/40": { id: 40, name: "Colour" },
    "/api/tags/21": { id: 21, name: "One" },
  };
  beforeEach(() => {
    api.request.mockImplementation(async (path: string) => profiles[path] ?? { name: "Choice" });
    api.resolveTagTree.mockImplementation(async ([id]: number[]) => (id === 40 ? [40, 41, 42] : [id]));
  });

  // Size takes one answer either way: through the answer group named after it (as Add from parent
  // tags names it), whose entry is the group's, or through answers made with "Only one per
  // performer", which remove its tree, whose entry is the condition category's.
  const onlyOne = (id: string, label: string, tag: number, tree: number): MediaReviewAction => ({
    id,
    label,
    steps: [
      { mode: "ADD", tagIds: [tag] },
      { mode: "REMOVE_TREE", tagIds: [tree] },
    ],
  });
  const sizedOnlyOne: OccurrenceReview = {
    ...sized,
    actions: [
      onlyOne("small", "Small", 31, 30),
      onlyOne("medium", "Medium", 32, 30),
      sized.actions[2],
    ],
  };

  it.each([
    ["an answer group", sized, "+ Choice"],
    ["answers removing its tree", sizedOnlyOne, "+ Choice, − Choice tree"],
  ])("lists where the focused performer needs attention and marks the keys and answers it concerns (Size taking one answer through %s)", async (_how, reviewed, effect) => {
    HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
    panels.loadPerformerAnswers.mockResolvedValue({
      answered: 3,
      groups: [
        {
          id: 30,
          name: "Size",
          members: [30, 31, 32],
          tags: [{ id: 32, name: "Medium", count: 40 }, { id: 31, name: "Small", count: 12 }],
        },
        { id: 40, name: "Colour", members: [40, 41, 42], tags: [{ id: 41, name: "Red", count: 3 }] },
      ],
    });
    window.history.replaceState(null, "", "/data-quality?review=r&performer=11");
    open(reviewed); await ready();
    await waitFor(() =>
      expect(attention()).toEqual([
        "ColourFlagged: Colour changed",
        "SizeMixed: Medium\u00a040 · Small\u00a012",
      ]),
    );
    // Keys whose actions change a category that needs attention carry a flag.
    expect(flaggedKeys()).toEqual(["Small", "Medium", "Red"]);
    expect(screen.getByRole("button", { name: "q Small" })).toHaveAccessibleDescription(
      `${effect}. Needs attention: Size (Mixed: Medium\u00a040 · Small\u00a012)`,
    );
    // The flag sits on the category it affects among the existing answers, Mixed where they differ.
    const answers = within(screen.getByRole("region", { name: "Existing answers" }));
    expect(answers.getByTitle("Flagged: Colour changed").closest(".dq-answer-group")).toHaveTextContent(
      "Colour",
    );
    const mixed = answers.getByText("Mixed");
    expect(mixed.closest(".dq-answer-group")).toHaveTextContent("Size");
    // A group named after its category is not named again: the badge says Mixed alone.
    expect(mixed).toHaveTextContent(/^Mixed$/);
    expect(mixed).toHaveAttribute("title", "This performer has different answers in this category.");
    // The focus chip names the category the flag affects.
    expect(screen.getByRole("group", { name: "Performer focus" })).toHaveTextContent(
      "Flagged: Colour changed (affects Colour)",
    );
    // One profile read for the focus, none more for the item column.
    expect(profileReads(11)).toBe(1);
    // The batch warns only once a chosen answer changes such a category.
    fireEvent.click(screen.getByRole("button", { name: "Batch…" }));
    const dialog = within(screen.getByRole("dialog", { name: "Apply to all matching occurrences" }));
    await dialog.findByText("3 videos answered");
    expect(dialog.queryByRole("note")).toBeNull();
    fireEvent.click(dialog.getByRole("checkbox", { name: "Red" }));
    expect(dialog.getByRole("note")).toHaveTextContent("Colour: Flagged: Colour changed");
    expect(dialog.getByRole("note")).not.toHaveTextContent("Size");
    fireEvent.click(dialog.getByRole("checkbox", { name: "Small" }));
    expect(dialog.getByRole("note")).toHaveTextContent("Size: Mixed: Medium 40 · Small 12");
  });

  // The focused performer holds two sizes and a colour.
  const twoSizes = {
    answered: 3,
    groups: [
      {
        id: 30,
        name: "Size",
        members: [30, 31, 32],
        tags: [{ id: 32, name: "Medium", count: 40 }, { id: 31, name: "Small", count: 12 }],
      },
      { id: 40, name: "Colour", members: [40, 41, 42], tags: [{ id: 41, name: "Red", count: 3 }] },
    ],
  };

  it("counts a category holding several answers without Mixed, attention, key marks or warnings", async () => {
    HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
    panels.loadPerformerAnswers.mockResolvedValue(twoSizes);
    window.history.replaceState(null, "", "/data-quality?review=r&performer=11");
    // The sizes without their group: nothing says Size takes one answer.
    open({ ...sized, actions: sized.actions.map(({ group: _group, ...action }) => action) });
    await ready();
    const answers = within(await screen.findByRole("region", { name: "Existing answers" }));
    const size = await answers.findByRole("list", { name: "Size" });
    expect(size).toHaveTextContent("Medium40, 40 videos");
    expect(size).toHaveTextContent("Small12, 12 videos");
    expect(answers.queryByText("Mixed")).toBeNull();
    // Only the flag asks for attention, and only the key that touches its category is marked.
    await waitFor(() => expect(attention()).toEqual(["ColourFlagged: Colour changed"]));
    expect(flaggedKeys()).toEqual(["Red"]);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "q Small" })).toHaveAccessibleDescription("+ Choice"),
    );
    // The batch warns about the flag's category alone.
    fireEvent.click(screen.getByRole("button", { name: "Batch…" }));
    const dialog = within(screen.getByRole("dialog", { name: "Apply to all matching occurrences" }));
    await dialog.findByText("3 videos answered");
    fireEvent.click(dialog.getByRole("checkbox", { name: "Small" }));
    expect(dialog.queryByRole("note")).toBeNull();
    expect(dialog.queryByText("Mixed")).toBeNull();
    fireEvent.click(dialog.getByRole("checkbox", { name: "Red" }));
    expect(dialog.getByRole("note")).toHaveTextContent("Colour: Flagged: Colour changed");
    expect(dialog.getByRole("note")).not.toHaveTextContent("Size");
  });

  it("marks a category holding several answers where a group inside it is mixed, and only that group's keys", async () => {
    panels.loadPerformerAnswers.mockResolvedValue({
      answered: 3,
      groups: [
        {
          id: 30,
          name: "Size",
          members: [30, 31, 32, 33],
          tags: [
            { id: 32, name: "Medium", count: 40 },
            { id: 33, name: "Striped", count: 20 },
            { id: 31, name: "Small", count: 12 },
          ],
        },
      ],
    });
    window.history.replaceState(null, "", "/data-quality?review=r&performer=11");
    open({
      ...sized,
      stayUntilGroupsAnswered: true,
      actions: [
        { id: "small", label: "Small", group: "Width", steps: [{ mode: "ADD", tagIds: [31] }] },
        { id: "medium", label: "Medium", group: "Width", steps: [{ mode: "ADD", tagIds: [32] }] },
        // In Size too, but no answer to the width question.
        { id: "striped", label: "Striped", steps: [{ mode: "ADD", tagIds: [33] }] },
      ],
      occurrence: { ...sized.occurrence, conditionTagIds: [30], performerFlags: undefined },
    });
    await ready();
    await waitFor(() => expect(attention()).toEqual(["WidthMixed: Medium\u00a040 · Small\u00a012"]));
    expect(flaggedKeys()).toEqual(["Small", "Medium"]);
    expect(screen.getByRole("button", { name: "e Striped" })).toHaveAccessibleDescription("+ Choice");
    // The row is Size's, its badge naming the group.
    const badge = within(screen.getByRole("region", { name: "Existing answers" })).getByText("Mixed");
    expect(badge.closest(".dq-answer-group")).toHaveTextContent("Size");
    expect(badge).toHaveTextContent(/^Mixed in Width$/);
    // The group's checklist entry carries the flag.
    const groups = within(screen.getByRole("list", { name: "Answer groups" })).getAllByRole(
      "listitem",
    );
    expect(groups.map((item) => item.dataset.attention ?? "")).toEqual(["true"]);
    expect(groups[0]).toHaveTextContent("Width, needs attention: Width (Mixed: Medium 40 · Small 12)");
  });

  it("takes one answer in a category whose answers remove a tree above it, once that tree is known", async () => {
    HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
    panels.loadPerformerAnswers.mockResolvedValue(twoSizes);
    // Tag 3 holds all of Size: its answers came from "Only one per performer" on a tag above it.
    // Its tree is read when the test says so.
    const treeReads: Array<(ids: number[]) => void> = [];
    api.resolveTagTree.mockImplementation(([id]: number[]) =>
      id === 3
        ? new Promise<number[]>((resolve) => treeReads.push(resolve))
        : Promise.resolve(id === 40 ? [40, 41, 42] : [id]),
    );
    window.history.replaceState(null, "", "/data-quality?review=r&performer=11");
    open({
      ...sized,
      actions: [onlyOne("small", "Small", 31, 3), onlyOne("medium", "Medium", 32, 3), sized.actions[2]],
    });
    await ready();
    // Until then Size holds several answers as far as the review knows: counts, nothing mixed.
    const size = await within(
      await screen.findByRole("region", { name: "Existing answers" }),
    ).findByRole("list", { name: "Size" });
    expect(size).toHaveTextContent("Small12, 12 videos");
    await waitFor(() => expect(attention()).toEqual(["ColourFlagged: Colour changed"]));
    expect(flaggedKeys()).toEqual(["Red"]);
    expect(
      within(screen.getByRole("region", { name: "Existing answers" })).queryByText("Mixed"),
    ).toBeNull();
    expect(treeReads.length).toBeGreaterThan(0);
    await act(async () => treeReads.forEach((resolve) => resolve([3, 30, 31, 32])));
    await waitFor(() =>
      expect(attention()).toEqual([
        "ColourFlagged: Colour changed",
        "SizeMixed: Medium\u00a040 · Small\u00a012",
      ]),
    );
    expect(flaggedKeys()).toEqual(["Small", "Medium", "Red"]);
    const answers = within(screen.getByRole("region", { name: "Existing answers" }));
    expect(answers.getByText("Mixed").closest(".dq-answer-group")).toHaveTextContent("Size");
    expect(answers.getByText("Mixed")).toHaveAttribute(
      "title",
      "This performer has different answers in this category.",
    );
    fireEvent.click(screen.getByRole("button", { name: "Batch…" }));
    const dialog = within(screen.getByRole("dialog", { name: "Apply to all matching occurrences" }));
    await dialog.findByText("3 videos answered");
    expect(dialog.queryByRole("note")).toBeNull();
    fireEvent.click(dialog.getByRole("checkbox", { name: "Medium" }));
    expect(dialog.getByRole("note")).toHaveTextContent("Size: Mixed: Medium 40 · Small 12");
    expect(dialog.getByRole("note")).not.toHaveTextContent("Colour");
  });

  it("flags the performer on screen from one profile read each, without mixed answers unfocused", async () => {
    api.loadOccurrencePage.mockResolvedValue({ items: [first, second, third], totalCount: 3 });
    open(sized); await ready();
    await waitFor(() => expect(attention()).toEqual(["ColourFlagged: Colour changed"]));
    expect(flaggedKeys()).toEqual(["Red"]);
    fireEvent.click(screen.getByRole("button", { name: /^Second performer$/ }));
    await screen.findByRole("heading", { name: "Reviewing Second performer" });
    await waitFor(() => expect(profileReads(12)).toBe(1));
    expect(panel().queryByRole("list", { name: "Needs attention" })).toBeNull();
    expect(flaggedKeys()).toEqual([]);
    // The first performer's next item uses the profile read before.
    fireEvent.click(screen.getByRole("button", { name: "First performer — Next scene" }));
    await screen.findByRole("heading", { name: "Reviewing First performer" });
    await waitFor(() => expect(attention()).toEqual(["ColourFlagged: Colour changed"]));
    expect(profileReads(11)).toBe(1);
    expect(profileReads(12)).toBe(1);
    // Mixed answers need a focus: no existing answers are read without one.
    expect(panels.loadPerformerAnswers).not.toHaveBeenCalled();
  });

  it("reads no profile without flags", async () => {
    open({ ...sized, occurrence: { ...sized.occurrence, performerFlags: undefined } }); await ready();
    fireEvent.click(screen.getByRole("button", { name: /^Second performer$/ }));
    await screen.findByRole("heading", { name: "Reviewing Second performer" });
    expect(profileReads(11) + profileReads(12)).toBe(0);
  });

  it("abandons a profile read when another performer is shown first, and reads it again later", async () => {
    const signals: AbortSignal[] = [];
    api.request.mockImplementation((path: string, options?: RequestInit) => {
      if (path === "/api/performers/11") {
        signals.push(options!.signal!);
        return new Promise(() => {});
      }
      return Promise.resolve(profiles[path] ?? { name: "Choice" });
    });
    open(sized); await ready();
    await waitFor(() => expect(signals).toHaveLength(1));
    fireEvent.click(screen.getByRole("button", { name: /^Second performer$/ }));
    await screen.findByRole("heading", { name: "Reviewing Second performer" });
    expect(signals[0].aborted).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: /^First performer$/ }));
    await screen.findByRole("heading", { name: "Reviewing First performer" });
    await waitFor(() => expect(signals).toHaveLength(2));
    expect(signals[1].aborted).toBe(false);
  });

  it("keeps the focused performer's mixed answers while they are read again after a write", async () => {
    panels.loadPerformerAnswers.mockResolvedValueOnce({
      answered: 3,
      groups: [
        {
          id: 30,
          name: "Size",
          members: [30, 31, 32],
          tags: [{ id: 32, name: "Medium", count: 40 }, { id: 31, name: "Small", count: 12 }],
        },
      ],
    });
    // The read after the write never lands.
    panels.loadPerformerAnswers.mockImplementation(() => new Promise(() => {}));
    api.loadOccurrencePage.mockResolvedValue({ items: [first, third], totalCount: 2 });
    window.history.replaceState(null, "", "/data-quality?review=r&performer=11");
    open(sized); await ready();
    await waitFor(() => expect(flaggedKeys()).toEqual(["Small", "Medium", "Red"]));
    fireEvent.click(screen.getByRole("button", { name: "e Red" }));
    await screen.findByRole("heading", { name: "Reviewing First performer" });
    await waitFor(() => expect(panels.loadPerformerAnswers).toHaveBeenCalledTimes(2), { timeout: 3000 });
    await ready();
    expect(screen.getByRole("link", { name: /Next scene/ })).toBeInTheDocument();
    expect(attention()).toEqual([
      "ColourFlagged: Colour changed",
      "SizeMixed: Medium\u00a040 · Small\u00a012",
    ]);
    expect(flaggedKeys()).toEqual(["Small", "Medium", "Red"]);
    expect(within(screen.getByRole("region", { name: "Existing answers" })).getByText("Mixed")).toBeInTheDocument();
  });

  it("keeps the mixed answers read before when reading them again fails, and says so", async () => {
    panels.loadPerformerAnswers.mockResolvedValueOnce({
      answered: 3,
      groups: [
        {
          id: 30,
          name: "Size",
          members: [30, 31, 32],
          tags: [{ id: 32, name: "Medium", count: 40 }, { id: 31, name: "Small", count: 12 }],
        },
      ],
    });
    panels.loadPerformerAnswers.mockRejectedValue(new Error("Answers offline"));
    api.loadOccurrencePage.mockResolvedValue({ items: [first, third], totalCount: 2 });
    window.history.replaceState(null, "", "/data-quality?review=r&performer=11");
    open(sized); await ready();
    await waitFor(() => expect(flaggedKeys()).toEqual(["Small", "Medium", "Red"]));
    fireEvent.click(screen.getByRole("button", { name: "e Red" }));
    expect(
      await within(screen.getByRole("region", { name: "Existing answers" })).findByRole(
        "alert",
        {},
        { timeout: 3000 },
      ),
    ).toHaveTextContent("Could not load existing answers. Answers offline");
    expect(flaggedKeys()).toEqual(["Small", "Medium", "Red"]);
  });

  it("matches flags changed in the editor against the ranking's profiles at once", async () => {
    panels.extendRanking.mockImplementation(async (rule: OccurrenceReview) => ranked(rule));
    open({ ...review, occurrence: { ...review.occurrence, performerFlags: [{ tagId: 7 }] } });
    await ready();
    const queue = within(screen.getByRole("complementary", { name: "Review queue" }));
    fireEvent.click(queue.getByRole("button", { name: "Performers" }));
    await queue.findByRole("button", { name: "Second performer, 3 matching videos. Flagged: Changed" });
    fireEvent.click(queue.getByRole("button", { name: "Scenes" }));
    fireEvent.click(screen.getByRole("button", { name: /^Second performer$/ }));
    await screen.findByRole("heading", { name: "Reviewing Second performer" });
    await waitFor(() => expect(attention()).toEqual(["Flagged: Changed"]));
    // Flag the ranking performer's other profile tag for a category, in the editor's draft.
    fireEvent.click(screen.getByRole("button", { name: "Edit review" }));
    const drawer = within(await screen.findByRole("dialog", { name: "Edit review" }));
    fireEvent.change(drawer.getByRole("textbox", { name: "Add a performer flag" }), {
      target: { value: "8" },
    });
    fireEvent.change(drawer.getAllByRole("textbox", { name: /^Affects,/ })[1], {
      target: { value: "21" },
    });
    await waitFor(() => expect(attention()).toEqual(["Flagged: Changed", "OneFlagged: Other"]));
    // Known from the ranking: no profile read, and nobody counted again.
    expect(profileReads(12)).toBe(0);
    expect(panels.extendRanking).toHaveBeenCalledTimes(1);
  });

  it("names the affected categories in the performer list and reads no profile the ranking has", async () => {
    panels.extendRanking.mockImplementation(async (rule: OccurrenceReview) => ranked(rule));
    open({ ...review, occurrence: { ...review.occurrence, performerFlags: [{ tagId: 7, categoryTagId: 21 }] } });
    await ready();
    const queue = within(screen.getByRole("complementary", { name: "Review queue" }));
    fireEvent.click(queue.getByRole("button", { name: "Performers" }));
    const flagged = await queue.findByRole("button", {
      name: "Second performer, 3 matching videos. Flagged: Changed (affects One)",
    });
    expect(flagged).toHaveAttribute("title", "Flagged: Changed (affects One)");
    // No mixed answers in the list: the list reads no existing answers.
    expect(panels.loadPerformerAnswers).not.toHaveBeenCalled();
    fireEvent.click(queue.getByRole("button", { name: "Scenes" }));
    fireEvent.click(screen.getByRole("button", { name: /^Second performer$/ }));
    await screen.findByRole("heading", { name: "Reviewing Second performer" });
    await waitFor(() => expect(attention()).toEqual(["OneFlagged: Changed"]));
    // The action adds tag 21, which the flag's category holds.
    expect(flaggedKeys()).toEqual(["Observation"]);
    expect(profileReads(12)).toBe(0);
  });
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
    fireEvent.click(screen.getByRole("button", { name: "Batch…" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Observation" }));
    fireEvent.click(screen.getByRole("button", { name: "Preview all matches" }));
    await screen.findByText("Preview ready. No tags have been changed.", {}, { timeout: 3000 });
    fireEvent.click(screen.getByRole("button", { name: /^Apply to \d+ occurrences?$/ }));
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
    candidates: [...ranked(rule).candidates, { id: 13, name: "Third performer", total: 2, tags: [] }],
    limit,
  }));
  open(); await ready();
  const queue = within(screen.getByRole("complementary", { name: "Review queue" }));
  fireEvent.click(queue.getByRole("button", { name: "Performers" }));
  expect(await queue.findByRole("alert")).toHaveTextContent("Could not rank performers. Performers offline");
  fireEvent.click(queue.getByRole("button", { name: "Refresh counts" }));
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
  fireEvent.click(screen.getByRole("button", { name: "Save to review" }));
  await waitFor(() => expect(save).toHaveBeenCalled());
  const saved = save.mock.calls[0][0] as OccurrenceReview;
  expect(saved.occurrence).toMatchObject({ targetMode: "selected", performerIds: [11, 12] });
  expect(JSON.stringify(saved)).not.toContain("performerFocus");
  await ready();
  openScope();
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
  open({ ...review, occurrence: { ...review.occurrence, flagPerformerTagIds: [7] } }); await ready();
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
  fireEvent.change(openScope().getByRole("combobox", { name: "Occurrence condition" }), { target: { value: "isNull" } });
  await waitFor(() => expect(firstSignal.aborted).toBe(true));
  await ready();
  fireEvent.click(queue.getByRole("button", { name: "Performers" }));
  const previous = await queue.findByRole("button", { name: "First performer, 12 matching videos" });
  expect(previous).toBeInTheDocument();
  fireEvent.change(openScope().getByRole("combobox", { name: "Occurrence condition" }), { target: { value: "any" } });
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
    candidates: [...ranked(rule).candidates, { id: 13, name: "Third performer", total: 2, tags: [] }],
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
  expect(screen.getByRole("button", { name: /^Scope/ })).toHaveTextContent("missing Choice or Choice");
  expect(openScope().getByRole("combobox", { name: "Occurrence condition" })).toHaveValue("excludesAll");
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
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }), { shiftKey: true });
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
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }), { shiftKey: true });
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
  await waitFor(() => expect(screen.getByRole("button", { name: "Reset" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Reset" }));
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
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }), { shiftKey: true });
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
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }), { shiftKey: true });
  await waitFor(() => expect(api.applyTags).toHaveBeenCalled());
  await ready();
  expect(new URLSearchParams(window.location.search).get("page")).toBe("1");
  fireEvent.click(screen.getByRole("button", { name: "Skip performer" }));
  await screen.findByRole("link", { name: "First scene" });
});


it("restores the pinned cursor when cancelling a rule edit after a queue reload", async () => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  api.loadOccurrencePage.mockResolvedValueOnce({ items: [first, second, third], totalCount: 2 });
  api.loadOccurrencePage.mockResolvedValue({ items: [first, third], totalCount: 2 });
  const rendered = open(); await ready();
  fireEvent.click(screen.getByRole("button", { name: "Skip performer" }));
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "q Observation" }), { shiftKey: true });
  await waitFor(() => expect(api.applyTags).toHaveBeenCalled());
  await ready();
  rendered.rerender(<ReviewWorkspace review={review} canWrite onBusy={() => {}} editRequest={1} onSaveDefaults={vi.fn()} />);
  await screen.findByRole("dialog", { name: "Edit review" });
  const loads = api.loadOccurrencePage.mock.calls.length;
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), { target: { value: "draft" } });
  await waitFor(() => expect(api.loadOccurrencePage.mock.calls.length).toBeGreaterThan(loads));
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  fireEvent.click(
    within(screen.getByRole("dialog", { name: "Discard unsaved changes?" })).getByRole("button", {
      name: "Discard",
    }),
  );
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "Skip performer" }));
  await screen.findByRole("link", { name: "Next scene" });
});

it("autoplays after an action even when query navigation remounted a paused player", async () => {
  api.loadOccurrencePage.mockResolvedValue({ items: [first, third], totalCount: 2 });
  open(); await ready();
  fireEvent.click(screen.getByRole("button", { name: "Play review video" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), { target: { value: "temporary" } });
  await waitFor(() => expect(screen.getByRole("button", { name: "Reset" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Reset" }));
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

function numberedActions(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `numbered-${index + 1}`,
    label: `Action ${index + 1}`,
    steps: [{ mode: "ADD" as const, tagIds: [100 + index] }],
  }));
}
const appliedLabel = (call = 0) => api.applyTags.mock.calls[call][2].label;
const findOptions = () =>
  within(screen.getByRole("dialog", { name: "Find an action" })).queryAllByRole("option");

it.each([
  ["q", 1],
  ["å", 11],
  ["a", 12],
  ["f", 15],
  ["g", 16],
  ["k", 19],
  ["ö", 21],
])("applies the action on %s and advances", async (key, number) => {
  open({ ...review, actions: numberedActions(27) });
  await ready();
  fireEvent.keyDown(document.body, { key });
  await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(1));
  expect(appliedLabel()).toBe(`Action ${number}`);
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  // The page's key outranks Cove's own uses of it (Filters, fullscreen, play/pause), without a
  // conflict.
  expect(screen.queryByRole("dialog", { name: "Video filters" })).not.toBeInTheDocument();
  expect(testPlayerShortcuts.fullscreen).not.toHaveBeenCalled();
  expect(testVideoControls.toggle).not.toHaveBeenCalled();
  expect(testKeyboardConflicts).toEqual([]);
});

it.each([
  ["Q", 1],
  ["Å", 11],
  ["A", 12],
  ["F", 15],
  ["G", 16],
  ["K", 19],
  ["Ö", 21],
])("applies the action on Shift+%s and stays", async (key, number) => {
  open({ ...review, actions: numberedActions(27) });
  await ready();
  fireEvent.keyDown(document.body, { key, shiftKey: true });
  await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(1));
  expect(appliedLabel()).toBe(`Action ${number}`);
  await ready();
  expect(screen.getByRole("heading", { name: "Reviewing First performer" })).toBeInTheDocument();
});

it("claims f, g and k while their keys hold no action, so they do nothing", async () => {
  open({ ...review, actions: numberedActions(13) });
  await ready();
  // Nothing in the idle workspace counts as an open dialog, which would pause every key.
  expect(document.querySelector("[role='dialog'], [aria-modal='true']")).toBeNull();
  const active = activeTestKeys();
  for (const key of ["q", "Shift+q", "s", "Shift+s", "-", "f", "Shift+f", "g", "Shift+g", "k", "Shift+k"])
    expect(active).toContain(`local:${key}`);
  // Other empty keys are not registered; Cove binds nothing to them here.
  for (const key of ["d", "h", "b"]) {
    expect(active).not.toContain(`local:${key}`);
    expect(active).not.toContain(`local:Shift+${key}`);
  }
  // Cove's Filters and fullscreen on f, its go-to chords on g and play/pause on k never fire.
  for (const key of ["g", "k", "f", "G", "K", "F"])
    expect(fireEvent.keyDown(document.body, { key, shiftKey: key !== key.toLowerCase() })).toBe(false);
  expect(testVideoControls.toggle).not.toHaveBeenCalled();
  expect(testPlayerShortcuts.fullscreen).not.toHaveBeenCalled();
  expect(testGlobalShortcuts.goTo).not.toHaveBeenCalled();
  expect(testKeyboardConflicts).toEqual([]);
  expect(screen.queryByRole("dialog", { name: "Video filters" })).not.toBeInTheDocument();
  await act(async () => {});
  expect(api.applyTags).not.toHaveBeenCalled();
  // Space and the Filters button keep working.
  fireEvent.keyDown(document.body, { key: " " });
  expect(testVideoControls.toggle).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: "Filters" }));
  expect(await screen.findByRole("dialog", { name: "Video filters" })).toBeInTheDocument();
});

it("applies the actions pinned to f, g and k, Shift with the key staying", async () => {
  const actions = numberedActions(3).map((action, index) => ({
    ...action,
    shortcut: ["f", "g", "k"][index],
  }));
  open({ ...review, actions });
  await ready();
  fireEvent.keyDown(document.body, { key: "K", shiftKey: true });
  await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(1));
  expect(appliedLabel()).toBe("Action 3");
  await ready();
  expect(screen.getByRole("heading", { name: "Reviewing First performer" })).toBeInTheDocument();
  fireEvent.keyDown(document.body, { key: "g" });
  await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(2));
  expect(appliedLabel(1)).toBe("Action 2");
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  expect(testGlobalShortcuts.goTo).not.toHaveBeenCalled();
  expect(testVideoControls.toggle).not.toHaveBeenCalled();
});

it("applies a held key's action once", async () => {
  api.loadOccurrencePage.mockResolvedValue({ items: [first, second, third], totalCount: 3 });
  open({ ...review, actions: numberedActions(3) });
  await ready();
  fireEvent.keyDown(document.body, { key: "w" });
  await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(1));
  expect(appliedLabel()).toBe("Action 2");
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  await ready();
  // Still held once the next item is ready: Cove passes the repeats on, and the workspace drops
  // them while claiming them, so nothing else acts on them either.
  for (let stroke = 0; stroke < 3; stroke++)
    expect(fireEvent.keyDown(document.body, { key: "w", repeat: true })).toBe(false);
  await act(async () => {});
  expect(api.applyTags).toHaveBeenCalledTimes(1);
  // Held with Shift, one action too, and the item stays.
  fireEvent.keyDown(document.body, { key: "E", shiftKey: true });
  await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(2));
  await ready();
  fireEvent.keyDown(document.body, { key: "E", shiftKey: true, repeat: true });
  await act(async () => {});
  expect(api.applyTags).toHaveBeenCalledTimes(2);
  expect(appliedLabel(1)).toBe("Action 3");
  expect(screen.getByRole("heading", { name: "Reviewing Second performer" })).toBeInTheDocument();
});

it("keeps action keys working after clicking a queue item or an action button", async () => {
  api.loadOccurrencePage.mockResolvedValue({ items: [first, second, third], totalCount: 3 });
  open({ ...review, actions: numberedActions(3) });
  await ready();
  const partner = screen.getByRole("button", { name: "Second performer — First scene" });
  fireEvent.click(partner);
  partner.focus();
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  fireEvent.keyDown(partner, { key: "W", shiftKey: true });
  await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(1));
  expect(appliedLabel(0)).toBe("Action 2");
  await ready();
  const button = screen.getByRole("button", { name: "e Action 3" });
  fireEvent.click(button, { shiftKey: true });
  await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(2));
  await ready();
  button.focus();
  expect(button).toHaveFocus();
  fireEvent.keyDown(button, { key: "q" });
  await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(3));
  expect(appliedLabel(2)).toBe("Action 1");
});

it("keeps the search focused and every letter in it while the queue reloads", async () => {
  api.loadOccurrencePage.mockResolvedValue({ items: [first, second, third], totalCount: 3 });
  open({ ...review, actions: numberedActions(27) });
  await ready();
  // A cancelled filter dialog leaves nothing to hand focus back to later.
  fireEvent.click(screen.getByRole("button", { name: "Filters" }));
  fireEvent.click(screen.getByRole("button", { name: "Cancel filters" }));
  // Each letter reloads the queue; the loads stay open until released.
  const loads: Array<() => void> = [];
  api.loadOccurrencePage.mockImplementation(
    () =>
      new Promise((resolve) =>
        loads.push(() => resolve({ items: [first, second, third], totalCount: 3 })),
      ),
  );
  const user = userEvent.setup();
  const search = screen.getByRole("textbox", { name: "Search list" });
  await user.click(search);
  await user.keyboard("qwf");
  expect(loads.length).toBeGreaterThan(0);
  expect(search).toBeEnabled();
  expect(search).toHaveFocus();
  loads.forEach((release) => release());
  await ready();
  // Still typing after the reload: the letters keep going into the search.
  await user.keyboard("gå");
  loads.forEach((release) => release());
  await ready();
  await act(async () => {});
  expect(search).toHaveFocus();
  expect(search).toHaveValue("qwfgå");
  expect(api.applyTags).not.toHaveBeenCalled();
  expect(screen.queryByRole("dialog", { name: "Video filters" })).not.toBeInTheDocument();
});

it("never applies an action while typing in the search field", async () => {
  open({ ...review, actions: numberedActions(3) });
  await ready();
  const search = screen.getByRole("textbox", { name: "Search list" });
  search.focus();
  for (const key of ["q", "w", "-"]) fireEvent.keyDown(search, { key });
  await act(async () => {});
  expect(api.applyTags).not.toHaveBeenCalled();
  expect(screen.queryByRole("combobox", { name: "Find an action" })).not.toBeInTheDocument();
});

it("finds any action with -, including those past the 27 keys", async () => {
  open({ ...review, actions: numberedActions(30) });
  await ready();
  const opener = screen.getByRole("button", { name: "Skip performer" });
  opener.focus();
  fireEvent.keyDown(opener, { key: "-" });
  const search = await screen.findByRole("combobox", { name: "Find an action" });
  expect(search).toHaveFocus();
  expect(screen.getByRole("dialog", { name: "Find an action" })).toBeInTheDocument();
  expect(findOptions()).toHaveLength(30);
  // Rows show their key when they have one, and what they change.
  await waitFor(() =>
    expect(findOptions()[10]).toHaveTextContent("åAction 11+ Choice"),
  );
  expect(activeTestKeys()).not.toContain("local:q");
  fireEvent.change(search, { target: { value: "action 29" } });
  const [only] = findOptions();
  expect(findOptions()).toHaveLength(1);
  expect(only).toHaveTextContent("Action 29");
  expect(only.querySelector("kbd")).toBeNull();
  expect(only).toHaveAttribute("aria-selected", "true");
  fireEvent.keyDown(search, { key: "Enter" });
  await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(1));
  expect(appliedLabel()).toBe("Action 29");
  expect(screen.queryByRole("dialog", { name: "Find an action" })).not.toBeInTheDocument();
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
});

it("chooses with the arrow keys, stays with Shift+Enter and closes with Esc", async () => {
  open({ ...review, actions: numberedActions(4) });
  await ready();
  fireEvent.keyDown(document.body, { key: "-" });
  let search = await screen.findByRole("combobox", { name: "Find an action" });
  fireEvent.keyDown(search, { key: "ArrowDown" });
  fireEvent.keyDown(search, { key: "ArrowDown" });
  fireEvent.keyDown(search, { key: "ArrowUp" });
  expect(findOptions()[1]).toHaveAttribute("aria-selected", "true");
  expect(search).toHaveAttribute("aria-activedescendant", findOptions()[1].id);
  fireEvent.keyDown(search, { key: "Enter", shiftKey: true });
  await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(1));
  expect(appliedLabel()).toBe("Action 2");
  await ready();
  expect(screen.getByRole("heading", { name: "Reviewing First performer" })).toBeInTheDocument();

  const opener = screen.getByRole("button", { name: "Edit tags" });
  opener.focus();
  fireEvent.keyDown(opener, { key: "-" });
  search = await screen.findByRole("combobox", { name: "Find an action" });
  fireEvent.change(search, { target: { value: "nothing like this" } });
  expect(findOptions()).toHaveLength(0);
  expect(
    within(screen.getByRole("dialog", { name: "Find an action" })).getByRole("status"),
  ).toHaveTextContent("No action matches");
  fireEvent.keyDown(search, { key: "Enter" });
  fireEvent.keyDown(search, { key: "Escape" });
  expect(screen.queryByRole("dialog", { name: "Find an action" })).not.toBeInTheDocument();
  expect(opener).toHaveFocus();
  expect(api.applyTags).toHaveBeenCalledTimes(1);
  // Keys return to the workspace once Find action closes.
  fireEvent.keyDown(opener, { key: "r" });
  await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(2));
  expect(appliedLabel(1)).toBe("Action 4");
});

it("pauses action keys while tags or the rule are edited", async () => {
  const rendered = open({ ...review, actions: numberedActions(2) });
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "Edit tags" }));
  expect(activeTestKeys()).not.toContain("local:q");
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  await ready();
  expect(activeTestKeys()).toContain("local:q");
  rendered.rerender(
    <ReviewWorkspace review={{ ...review, actions: numberedActions(2) }} canWrite onBusy={() => {}} editRequest={1} onSaveDefaults={vi.fn()} />,
  );
  await screen.findByRole("dialog", { name: "Edit review" });
  expect(activeTestKeys()).not.toContain("local:q");
  expect(activeTestKeys()).not.toContain("local:-");
});

it("keeps the header, Scope and queue live beside the drawer while its actions and Batch pause", async () => {
  api.loadOccurrencePage.mockResolvedValue({ items: [first, second, third], totalCount: 2 });
  const save = vi.fn().mockResolvedValue(true);
  const rule = { ...review, actions: numberedActions(2) };
  const rendered = open(rule, true, save);
  await ready();
  rendered.rerender(
    <ReviewWorkspace review={rule} canWrite onBusy={() => {}} editRequest={1} onSaveDefaults={save} />,
  );
  const drawer = await screen.findByRole("dialog", { name: "Edit review" });
  // Batch… stays in the header, disabled, and the pad says why its tiles wait.
  expect(screen.getByRole("button", { name: "Batch…" })).toBeDisabled();
  const pad = screen.getByRole("region", { name: "Actions, paused while editing" });
  expect(pad).toHaveTextContent("Actions are paused while you edit the review");
  expect(within(pad).getByRole("button", { name: "q Action 1" })).toBeDisabled();
  expect(screen.getByText("Previewing the draft")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Edit review" })).toHaveAttribute("aria-expanded", "true");
  expect(openScope().getByText("Applies to this queue at once, and Save review keeps it.")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Done" }));
  // The queue stays live: it shows another item on request.
  const queue = within(screen.getByRole("complementary", { name: "Review queue" }));
  fireEvent.click(queue.getByRole("button", { name: "First performer — Next scene" }));
  await screen.findByRole("link", { name: "Next scene" });
  // Review direction lives in the Review tab and reshapes the queue at once.
  fireEvent.change(within(drawer).getByLabelText("Review direction"), { target: { value: "end" } });
  await waitFor(() =>
    expect(new URLSearchParams(window.location.search).get("startFrom")).toBe("end"),
  );
  // The direction is the queue's: it shows as a change of the queue's criteria.
  expect(within(drawer).getByText("Unsaved changes, including the queue's criteria")).toBeInTheDocument();
  const saveButton = within(drawer).getByRole("button", { name: "Save review" });
  await waitFor(() => expect(saveButton).toBeEnabled());
  fireEvent.click(saveButton);
  await waitFor(() =>
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({ view: expect.objectContaining({ startFrom: "end" }) }),
    ),
  );
  await waitFor(() =>
    expect(screen.queryByRole("dialog", { name: "Edit review" })).not.toBeInTheDocument(),
  );
  // Closed, the keys and Batch… are back.
  await ready();
  expect(activeTestKeys()).toContain("local:q");
  expect(screen.getByRole("button", { name: "Batch…" })).toBeEnabled();
});

it("previews the draft's keys on the paused pad while the drawer is open", async () => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  const save = vi.fn().mockResolvedValue(true);
  const rule = { ...review, actions: numberedActions(2) };
  const rendered = open(rule, true, save);
  await ready();
  rendered.rerender(
    <ReviewWorkspace review={rule} canWrite onBusy={() => {}} editRequest={1} onSaveDefaults={save} />,
  );
  const drawer = await screen.findByRole("dialog", { name: "Edit review" });
  fireEvent.click(within(drawer).getByRole("tab", { name: "Actions" }));
  fireEvent.click(within(drawer).getByRole("button", { name: /^Key for Action 2: / }));
  fireEvent.click(within(screen.getByRole("dialog", { name: "Key for Action 2" })).getByRole("button", { name: "A: free" }));
  const pad = screen.getByRole("region", { name: "Actions, paused while editing" });
  const rows = [...pad.querySelectorAll<HTMLElement>(".dq-pad-row")];
  expect(rows).toHaveLength(2);
  expect(within(rows[0]).getByRole("button", { name: "q Action 1" })).toBeDisabled();
  expect(within(rows[1]).getByRole("button", { name: "a Action 2" })).toBeDisabled();
  // Cancel drops the draft and its placement, once Discard confirms it.
  fireEvent.click(within(drawer).getByRole("button", { name: "Cancel" }));
  fireEvent.click(
    within(screen.getByRole("dialog", { name: "Discard unsaved changes?" })).getByRole("button", {
      name: "Discard",
    }),
  );
  await ready();
  expect(screen.getByRole("button", { name: "w Action 2" })).toBeEnabled();
  expect(activeTestKeys()).toContain("local:w");
  expect(activeTestKeys()).not.toContain("local:a");
  expect(save).not.toHaveBeenCalled();
});

it("shows the queue's errors in the drawer while it covers the item column", async () => {
  const rendered = open();
  await ready();
  rendered.rerender(
    <ReviewWorkspace review={review} canWrite onBusy={() => {}} editRequest={1} onSaveDefaults={vi.fn()} />,
  );
  const drawer = await screen.findByRole("dialog", { name: "Edit review" });
  api.loadOccurrencePage.mockRejectedValueOnce(new Error("Queue offline"));
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), {
    target: { value: "draft" },
  });
  expect(await within(drawer).findByRole("alert")).toHaveTextContent("Queue offline");
  expect(screen.getAllByRole("alert")).toHaveLength(1);
  fireEvent.click(within(drawer).getByRole("button", { name: "Retry queue" }));
  await waitFor(() => expect(within(drawer).queryByRole("alert")).not.toBeInTheDocument());
});

it("previews the hovered action on the current tags", async () => {
  state = { ids: [30, 31], names: ["Kept", "Dropped"], absent: [60] };
  api.request.mockImplementation(async (path: string) => ({ name: `Tag ${path.split("/").at(-1)}` }));
  open({
    ...review,
    actions: [
      {
        id: "change",
        label: "Change",
        steps: [
          { mode: "ADD", tagIds: [40] },
          { mode: "REMOVE", tagIds: [31] },
          { mode: "MARK_ABSENT", tagIds: [50] },
          { mode: "CLEAR_ABSENCE", tagIds: [60] },
        ],
      },
    ],
  });
  await ready();
  const tags = () => screen.getByRole("list", { name: "Current tags" });
  // Cove's display order: without groups, by name.
  expect(tags()).toHaveTextContent("DroppedKept");
  const tile = screen.getByRole("button", { name: "q Change absent" });
  fireEvent.mouseEnter(tile.parentElement!);
  await waitFor(() => expect(tags().querySelector("ins")).toHaveTextContent("+ Tag 40"));
  expect(tags().querySelector("del")).toHaveTextContent("− Dropped");
  expect(within(tags()).getByText("Tag 50").closest("li")).toHaveTextContent("Tag 50absent");
  expect(
    screen.getByRole("list", { name: "Confirmed absent tags" }).querySelector("del"),
  ).toHaveTextContent("Tag 60");
  // Every tag, previewed or not, is Cove's badge.
  expect(within(tags()).getByText("Tag 40")).toHaveClass("tag-badge");
  expect(within(tags()).getByText("Dropped")).toHaveClass("tag-badge");
  fireEvent.mouseLeave(tile.parentElement!);
  expect(tags().querySelector("ins, del")).toBeNull();
  expect(tags()).toHaveTextContent("DroppedKept");
});

it("shows the current tags as Cove's badges in Cove's display order", async () => {
  const tag = (id: number, name: string, group?: { id: number; name: string; order?: number }) => ({
    id,
    name,
    color: group ? null : `#00000${id}`,
    tagGroupId: group?.id ?? null,
    tagGroupName: group?.name ?? null,
    tagGroupColor: group ? `#1111${String(group.id).padStart(2, "0")}` : null,
    tagGroupSortOrder: group?.order ?? null,
  });
  const first = { id: 1, name: "B group", order: 1 };
  const unordered = { id: 2, name: "A group" };
  const applications = [
    tag(5, "Loose 10"),
    tag(6, "Loose 9"),
    tag(7, "Zeta", first),
    tag(8, "Alpha", unordered),
    tag(9, "Beta", first),
  ].map((item, index) => ({
    id: 200 + index,
    hostType: "video",
    hostId: 1,
    contextType: "performer",
    contextId: 11,
    tag: item,
  }));
  state = { ids: [5, 6, 7, 8, 9], names: [], absent: [], applications };
  open();
  await ready();
  const badges = within(screen.getByRole("list", { name: "Current tags" })).getAllByText(
    /./,
    { selector: ".tag-badge" },
  );
  // Grouped first, by the group's sort order (none last), then by natural name order.
  expect(badges.map((badge) => badge.textContent)).toEqual([
    "Beta",
    "Zeta",
    "Alpha",
    "Loose 9",
    "Loose 10",
  ]);
  expect(badges[0]).toHaveAttribute("data-group-color", "#111101");
  expect(badges[3]).toHaveAttribute("data-color", "#000006");
  // A review never navigates away from a tag.
  expect(badges.some((badge) => badge.hasAttribute("data-clickable"))).toBe(false);
});

it("summarises the scope on its button and keeps its controls in a popover", async () => {
  open({
    ...review,
    actions: numberedActions(2),
    occurrence: { ...review.occurrence, targetMode: "selected", performerIds: [11, 12], condition: "includes", conditionTagIds: [21] },
  });
  await ready();
  const button = screen.getByRole("button", { name: /^Scope/ });
  expect(button).toHaveTextContent("2 performers · has Choice");
  expect(button).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(button);
  const scope = within(screen.getByRole("dialog", { name: "Queue scope" }));
  expect(button).toHaveAttribute("aria-expanded", "true");
  expect(scope.getByRole("button", { name: "Specific performers" })).toHaveFocus();
  // While it is open, the action keys wait, as behind any dialog.
  fireEvent.keyDown(document.body, { key: "q" });
  await act(async () => {});
  expect(api.applyTags).not.toHaveBeenCalled();
  fireEvent.keyDown(scope.getByRole("combobox", { name: "Occurrence condition" }), { key: "Escape" });
  expect(screen.queryByRole("dialog", { name: "Queue scope" })).not.toBeInTheDocument();
  await waitFor(() => expect(button).toHaveFocus());
  fireEvent.click(button);
  fireEvent.click(screen.getByRole("button", { name: "Done" }));
  expect(screen.queryByRole("dialog", { name: "Queue scope" })).not.toBeInTheDocument();
  fireEvent.keyDown(document.body, { key: "q" });
  await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(1));
});

it("keeps the scope popover open when Esc closes the criteria dialog opened from it", async () => {
  open({ ...review, occurrence: { ...review.occurrence, targetMode: "filter", performerFilter: { gender: "FEMALE" } } });
  await ready();
  openScope();
  // The host's criteria chips open their own dialog inside the popover.
  fireEvent.click(screen.getByRole("button", { name: "Edit filter: gender" }));
  const nested = screen.getByRole("dialog", { name: "Video filters" });
  fireEvent.keyDown(within(nested).getByRole("button", { name: "Cancel filters" }), { key: "Escape" });
  expect(screen.getByRole("dialog", { name: "Queue scope" })).toBeInTheDocument();
});

it("tells video reviews that tags apply to the whole video and offers saving a changed queue", async () => {
  const save = vi.fn().mockResolvedValue(true);
  open({ ...review, entityType: "video" } as VideoReview, true, save);
  await ready();
  expect(screen.getByRole("heading", { name: "Reviewing this video" })).toBeInTheDocument();
  expect(screen.getByText("Tags apply to the whole video")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /^Scope/ })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), { target: { value: "changed" } });
  const header = screen.getByRole("heading", { name: "Review" }).closest("header")!;
  expect(await within(header).findByRole("button", { name: "Save to review" })).toBeInTheDocument();
  expect(within(header).getByRole("button", { name: "Reset" })).toBeInTheDocument();
  expect(within(header).getByText("The queue differs from the saved review.")).toBeInTheDocument();
});

it("puts Save to review and Reset in the header row just before Batch… and More, and says when the queue starts to differ", async () => {
  const save = vi.fn().mockResolvedValue(true);
  render(
    <ReviewWorkspace
      review={review}
      canWrite
      onBusy={() => {}}
      onSaveDefaults={save}
      editRequest={0}
      pageControls={{ onBack: vi.fn(), moreItems: () => [{ label: "Export", onSelect: vi.fn() }] }}
    />,
  );
  await ready();
  const header = screen.getByRole("heading", { name: "Review" }).closest("header")!;
  const trail = header.querySelector<HTMLElement>(".dq-review-header-trail")!;
  const live = header.querySelector(":scope > [aria-live='polite']")!;
  expect(within(trail).queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
  expect(live).toBeEmptyDOMElement();
  // A new scope makes the queue differ: the two buttons join the row, with nothing on a row of
  // their own, and the change is announced.
  const scope = openScope();
  expect(scope.getByText("Applies to this queue at once; Save to review in the header keeps it.")).toBeInTheDocument();
  fireEvent.change(scope.getByRole("combobox", { name: "Occurrence condition" }), {
    target: { value: "isNull" },
  });
  fireEvent.click(scope.getByRole("button", { name: "Done" }));
  const reset = await within(trail).findByRole("button", { name: "Reset" });
  const order = [/^Scope/, "Save to review", "Reset", "Batch…", "More review options"].map((name) =>
    within(trail).getByRole("button", { name }),
  );
  expect(within(trail).getAllByRole("button")).toEqual(order);
  expect(order[1]).toHaveAccessibleDescription(
    "The queue differs from the saved review. Save these filters to the review.",
  );
  expect(live).toHaveTextContent("The queue differs from the saved review.");
  expect(header.querySelector(".dq-review-chips-end")).toBeNull();
  // Reset takes them away again, and the next difference is announced anew. Focus goes to More
  // once the queue has reloaded, not to the page.
  await waitFor(() => expect(reset).toBeEnabled());
  reset.focus();
  fireEvent.click(reset);
  await waitFor(() =>
    expect(within(trail).queryByRole("button", { name: "Reset" })).not.toBeInTheDocument(),
  );
  expect(live).toBeEmptyDOMElement();
  expect(save).not.toHaveBeenCalled();
  const more = within(trail).getByRole("button", { name: "More review options" });
  await waitFor(() => expect(more).toHaveFocus());
});

it("hands focus to More after Save to review, or back to it when the save fails", async () => {
  const workspace = (saved: VideoReview) => (
    <ReviewWorkspace
      review={saved}
      canWrite
      onBusy={() => {}}
      onSaveDefaults={save}
      editRequest={0}
      pageControls={{ onBack: vi.fn(), moreItems: () => [{ label: "Export", onSelect: vi.fn() }] }}
    />
  );
  // As the page does, the view gets the review as saved.
  const save = vi
    .fn<(saved: MediaReview) => Promise<unknown>>()
    .mockRejectedValueOnce(new Error("Storage offline"))
    .mockImplementation(async (saved) => {
      rerender(workspace(saved as VideoReview));
      return true;
    });
  const { rerender } = render(workspace({ ...review, entityType: "video" } as VideoReview));
  await ready();
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), { target: { value: "kept" } });
  const header = screen.getByRole("heading", { name: "Review" }).closest("header")!;
  let button = await within(header).findByRole("button", { name: "Save to review" });
  await waitFor(() => expect(button).toBeEnabled());
  button.focus();
  fireEvent.click(button);
  // The failed save keeps the buttons: focus is back on Save to review for another try.
  expect(await screen.findByText("Could not save queue. Storage offline")).toBeInTheDocument();
  button = within(header).getByRole("button", { name: "Save to review" });
  await waitFor(() => expect(button).toBeEnabled());
  expect(button).toHaveFocus();
  fireEvent.click(button);
  await screen.findByText("Queue saved to this review.");
  expect(within(header).queryByRole("button", { name: "Save to review" })).not.toBeInTheDocument();
  await waitFor(() =>
    expect(within(header).getByRole("button", { name: "More review options" })).toHaveFocus(),
  );
});

it("pauses the pad and its preview while tags are edited by hand", async () => {
  state = { ids: [30], names: ["Kept"], absent: [] };
  open({ ...review, actions: numberedActions(2) });
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "Edit tags" }));
  const tile = screen.getByRole("button", { name: "q Action 1" });
  expect(tile).toBeDisabled();
  expect(screen.getByRole("button", { name: "Find action" })).toBeDisabled();
  fireEvent.mouseEnter(tile.parentElement!);
  expect(screen.getByRole("list", { name: "Current tags" }).querySelector("ins")).toBeNull();
  // The current tags stay in view above the editor.
  expect(screen.getByRole("list", { name: "Current tags" })).toHaveTextContent("Kept");
  expect(screen.getByRole("group", { name: "Edit occurrence tags" })).toBeInTheDocument();
});

it("keeps the open scope popover under its button when Save to review and Reset join the row", async () => {
  // jsdom has no layout: the Scope button's right edge is what the popover is placed from, and
  // only observers of an element that changed size hear about it.
  const observers: Array<{ measure: () => void; targets: Element[] }> = [];
  vi.stubGlobal(
    "ResizeObserver",
    class {
      entry: { measure: () => void; targets: Element[] };
      constructor(measure: () => void) {
        this.entry = { measure, targets: [] };
        observers.push(this.entry);
      }
      observe(target: Element) {
        this.entry.targets.push(target);
      }
      disconnect() {
        this.entry.targets = [];
      }
    },
  );
  try {
    let right = 900;
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      const edge = this.classList.contains("dq-scope-button") ? right : 0;
      return { top: 0, bottom: 32, left: edge - 100, right: edge, width: 100, height: 32, x: edge - 100, y: 0 } as DOMRect;
    });
    open();
    await ready();
    const button = screen.getByRole("button", { name: /^Scope/ });
    const trail = button.closest(".dq-review-header-trail")!;
    const scope = openScope();
    const dialog = screen.getByRole("dialog", { name: "Queue scope" });
    // A 600 px panel whose right edge is the button's.
    expect(dialog.style.left).toBe("300px");
    // It watches its button, the header's trail and the header.
    expect(observers.find(({ targets }) => targets.includes(button))?.targets).toEqual(
      expect.arrayContaining([button, trail, button.closest("header")]),
    );
    fireEvent.change(scope.getByRole("combobox", { name: "Occurrence condition" }), {
      target: { value: "isNull" },
    });
    await screen.findByRole("button", { name: "Reset" });
    // The two buttons after it grow the trail and move the button left; the popover follows it.
    right = 700;
    act(() =>
      observers.filter(({ targets }) => targets.includes(trail)).forEach(({ measure }) => measure()),
    );
    expect(dialog.style.left).toBe("100px");
    expect(screen.getByRole("dialog", { name: "Queue scope" })).toBe(dialog);
  } finally {
    vi.unstubAllGlobals();
  }
});

it("closes the scope popover from outside it and keeps Tab inside it", async () => {
  open({ ...review, occurrence: { ...review.occurrence, condition: "includes", conditionTagIds: [21] } });
  await ready();
  const button = screen.getByRole("button", { name: /^Scope/ });
  fireEvent.click(button);
  const dialog = screen.getByRole("dialog", { name: "Queue scope" });
  // Placed in the window from its button, not from the header's edge.
  expect(dialog.style.left).not.toBe("");
  const done = within(dialog).getByRole("button", { name: "Done" });
  done.focus();
  fireEvent.keyDown(done, { key: "Tab" });
  expect(within(dialog).getByRole("button", { name: "All performers" })).toHaveFocus();
  fireEvent.keyDown(within(dialog).getByRole("button", { name: "All performers" }), {
    key: "Tab",
    shiftKey: true,
  });
  expect(done).toHaveFocus();
  // A press anywhere outside closes it.
  fireEvent.mouseDown(document.querySelector(".dq-scope-backdrop")!);
  expect(screen.queryByRole("dialog", { name: "Queue scope" })).not.toBeInTheDocument();
  await waitFor(() => expect(button).toHaveFocus());
});

it("keeps the focused performer's existing answers while their queue is empty", async () => {
  api.loadOccurrencePage.mockResolvedValue({ items: [], totalCount: 0 });
  panels.loadPerformerAnswers.mockResolvedValue({
    answered: 1,
    groups: [{ id: 30, name: "Size", tags: [{ id: 31, name: "Small", count: 1 }] }],
  });
  window.history.replaceState(null, "", "/data-quality?review=r&performer=11");
  open();
  await screen.findByText("No matching videos.");
  const answers = await screen.findByRole("region", { name: "Existing answers" });
  expect(await within(answers).findByRole("list", { name: "Size" })).toHaveTextContent("Small");
});

it("pauses legacy tag choices while tags are edited by hand", async () => {
  open({ ...review, actions: [] });
  await ready();
  expect(screen.getByRole("group", { name: "Tag choices" })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "Edit tags" }));
  expect(screen.getByRole("group", { name: "Tag choices" })).toBeDisabled();
});

it("moves focus to the partner just left after switching partners", async () => {
  open();
  await ready();
  const second = screen.getByRole("button", { name: /^Second performer$/ });
  second.focus();
  fireEvent.click(second);
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  await waitFor(() =>
    expect(screen.getByRole("button", { name: /^First performer$/ })).toHaveFocus(),
  );
});

it("scrolls only the queue list to keep the item on screen in view", async () => {
  api.loadOccurrencePage.mockResolvedValue({ items: [first, second, third], totalCount: 3 });
  const scrollIntoView = vi.fn();
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: scrollIntoView });
  const rect = (top: number, bottom: number) => ({ top, bottom, left: 0, right: 0, width: 0, height: bottom - top, x: 0, y: top, toJSON() {} }) as DOMRect;
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    if (this.classList.contains("dq-queue-list")) return rect(0, 100);
    if (this.getAttribute("aria-current") === "true") return rect(150, 206);
    return rect(0, 0);
  });
  open();
  await ready();
  const list = document.querySelector<HTMLElement>(".dq-review-queue .dq-queue-list")!;
  let scrollTop = 0;
  Object.defineProperty(list, "scrollTop", { configurable: true, get: () => scrollTop, set: (value: number) => { scrollTop = value; } });
  fireEvent.click(screen.getByRole("button", { name: "Skip performer" }));
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  await waitFor(() => expect(scrollTop).toBe(106));
  expect(scrollIntoView).not.toHaveBeenCalled();
});

it("names occurrence tags from their applications", async () => {
  state = {
    ids: [1, 2],
    names: ["Same"],
    absent: [],
    applications: [
      { id: 100, hostType: "video", hostId: 1, contextType: "performer", contextId: 11, tag: { id: 1, name: "Same" } },
      { id: 101, hostType: "video", hostId: 1, contextType: "performer", contextId: 11, tag: { id: 2, name: "Same" } },
    ],
  };
  open();
  await ready();
  const chips = within(screen.getByRole("list", { name: "Current tags" })).getAllByRole("listitem");
  expect(chips.map((chip) => chip.textContent)).toEqual(["Same", "Same"]);
});

it("offers Stay on this item at phone widths: tapped actions, in the pad or in Find, apply and stay, and keys keep their meaning", async () => {
  setViewportWidth(390);
  open({ ...review, actions: numberedActions(3) });
  await ready();
  const pad = screen.getByRole("region", { name: "Actions" });
  expect(pad).toHaveClass("dq-pad-mobile");
  expect(pad.querySelector("kbd")).toBeNull();
  const toggle = within(pad).getByRole("switch", { name: "Stay on this item" });
  expect(toggle).not.toBeChecked();
  fireEvent.click(toggle);
  expect(toggle).toBeChecked();
  // A tapped action applies and stays on the performer.
  fireEvent.click(within(pad).getByRole("button", { name: "Action 1" }));
  await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(1));
  expect(appliedLabel()).toBe("Action 1");
  await ready();
  expect(screen.getByRole("heading", { name: "Reviewing First performer" })).toBeInTheDocument();
  // So does an action tapped in Find, which shows no key caps or key hints here.
  fireEvent.click(within(pad).getByRole("button", { name: "Find" }));
  const find = await screen.findByRole("dialog", { name: "Find an action" });
  expect(find.querySelector("kbd")).toBeNull();
  expect(find).not.toHaveTextContent("applies and stays");
  fireEvent.click(findOptions()[1]);
  await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(2));
  expect(appliedLabel(1)).toBe("Action 2");
  await ready();
  expect(screen.getByRole("heading", { name: "Reviewing First performer" })).toBeInTheDocument();
  // Keys keep their meaning: q applies and moves on.
  fireEvent.keyDown(document.body, { key: "q" });
  await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(3));
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
});

it("keeps Enter in Find and actions without steps moving on while Stay on this item is on", async () => {
  setViewportWidth(390);
  open({ ...review, actions: [...numberedActions(2), { id: "next", label: "Next one", steps: [] }] });
  await ready();
  const pad = screen.getByRole("region", { name: "Actions" });
  fireEvent.click(within(pad).getByRole("switch", { name: "Stay on this item" }));
  // Enter is the keyboard's, and moves on as always.
  fireEvent.click(within(pad).getByRole("button", { name: "Find" }));
  const search = await screen.findByRole("combobox", { name: "Find an action" });
  fireEvent.keyDown(search, { key: "Enter" });
  await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(1));
  expect(appliedLabel()).toBe("Action 1");
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  await ready();
  // An action without steps, tapped in Find, moves on too: staying would do nothing at all.
  fireEvent.click(within(screen.getByRole("region", { name: "Actions" })).getByRole("button", { name: "Find" }));
  await screen.findByRole("dialog", { name: "Find an action" });
  fireEvent.click(findOptions().find((option) => option.textContent?.includes("Next one"))!);
  await waitFor(() => expect(screen.queryByRole("heading", { name: "Reviewing Second performer" })).not.toBeInTheDocument());
  expect(api.applyTags).toHaveBeenCalledTimes(1);
});

it("lets taps in Find move on in wider windows even with Stay on this item left on", async () => {
  setViewportWidth(390);
  open({ ...review, actions: numberedActions(2) });
  await ready();
  fireEvent.click(within(screen.getByRole("region", { name: "Actions" })).getByRole("switch", { name: "Stay on this item" }));
  act(() => setViewportWidth(1024));
  expect(screen.queryByRole("switch", { name: "Stay on this item" })).not.toBeInTheDocument();
  fireEvent.keyDown(document.body, { key: "-" });
  await screen.findByRole("dialog", { name: "Find an action" });
  fireEvent.click(findOptions()[0]);
  await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(1));
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
});

it("moves on after a tapped action while Stay on this item is off, and shows no switch in wider windows", async () => {
  setViewportWidth(390);
  open({ ...review, actions: numberedActions(2) });
  await ready();
  const pad = screen.getByRole("region", { name: "Actions" });
  expect(within(pad).getByRole("switch", { name: "Stay on this item" })).not.toBeChecked();
  fireEvent.click(within(pad).getByRole("button", { name: "Action 2" }));
  await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(1));
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  act(() => setViewportWidth(1024));
  expect(screen.queryByRole("switch", { name: "Stay on this item" })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "q Action 1" })).toBeInTheDocument();
});

describe("answer groups", () => {
  // Two questions, "Kind" (names match ignoring case) and "Size", and an ungrouped note.
  const grouped: OccurrenceReview = {
    ...review,
    stayUntilGroupsAnswered: true,
    actions: [
      { id: "one", label: "Kind one", group: "Kind", steps: [{ mode: "ADD", tagIds: [1] }, { mode: "REMOVE", tagIds: [2] }] },
      { id: "two", label: "Kind two", group: " kind", steps: [{ mode: "ADD", tagIds: [2] }, { mode: "REMOVE", tagIds: [1] }] },
      { id: "small", label: "Small", group: "Size", steps: [{ mode: "ADD", tagIds: [11] }] },
      { id: "none", label: "No size", group: "Size", steps: [{ mode: "MARK_ABSENT", tagIds: [11, 12] }] },
      { id: "note", label: "Note", steps: [{ mode: "ADD", tagIds: [30] }] },
    ],
  };
  /** Runs an action's steps on the shared tag state, as Cove would store them. */
  function applySteps(action: MediaReviewAction) {
    let { ids, absent } = state;
    for (const step of action.steps)
      for (const id of step.tagIds) {
        if (step.mode === "ADD" || step.mode === "MARK_PRESENT") ids = [...ids.filter((tag) => tag !== id), id];
        if (step.mode === "REMOVE" || step.mode === "MARK_ABSENT") ids = ids.filter((tag) => tag !== id);
        if (step.mode === "MARK_ABSENT") absent = [...absent.filter((tag) => tag !== id), id];
        if (step.mode === "MARK_PRESENT" || step.mode === "CLEAR_ABSENCE") absent = absent.filter((tag) => tag !== id);
      }
    state = { ids, names: ids.map((id) => `Tag ${id}`), absent };
  }
  beforeEach(() => {
    api.applyTags.mockImplementation(async (_review, _item, action: MediaReviewAction) => applySteps(action));
  });
  const checklist = () =>
    within(screen.getByRole("list", { name: "Answer groups" }))
      .getAllByRole("listitem")
      .map((item) => item.textContent);
  const highlighted = () =>
    [...document.querySelectorAll(".dq-pad-tile[data-group-open]")].map(
      (tile) => tile.querySelector(".dq-pad-label")?.textContent,
    );
  const onFirst = () =>
    expect(screen.getByRole("heading", { name: "Reviewing First performer" })).toBeInTheDocument();

  it("stays while a group is open, showing which, and moves on to the partner once every group is answered", async () => {
    open(grouped);
    await ready();
    expect(checklist()).toEqual(["Kind, not answered yet", "Size, not answered yet"]);
    expect(highlighted()).toEqual(["Kind one", "Kind two", "Small", "No size"]);
    expect(screen.getByRole("button", { name: "e Small" })).toHaveAccessibleDescription(
      "+ Choice. Size: not answered yet",
    );
    fireEvent.keyDown(document.body, { key: "q" });
    // Nothing moves on at once: the item stays, and a live region says why.
    onFirst();
    const message = await screen.findByText("Tags saved. Staying until answered: Size.");
    expect(message.closest("[aria-live]")).not.toBeNull();
    await ready();
    onFirst();
    expect(checklist()).toEqual(["Kind, answered: Kind one", "Size, not answered yet"]);
    expect(highlighted()).toEqual(["Small", "No size"]);
    fireEvent.keyDown(document.body, { key: "e" });
    await screen.findByRole("heading", { name: "Reviewing Second performer" });
    expect(api.applyTags).toHaveBeenCalledTimes(2);
  });

  it("moves on with Skip while groups are open, and stays with Shift", async () => {
    open(grouped);
    await ready();
    fireEvent.click(screen.getByRole("button", { name: "Skip performer" }));
    await screen.findByRole("heading", { name: "Reviewing Second performer" });
    await ready();
    expect(api.applyTags).not.toHaveBeenCalled();
    fireEvent.keyDown(document.body, { key: "Q", code: "KeyQ", shiftKey: true });
    await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(1));
    await ready();
    // Shift stays as it always does, not for the open size.
    expect(screen.getByText("Tags saved.")).toBeInTheDocument();
    expect(screen.queryByText(/Staying until answered/)).toBeNull();
    // Shift-click stays even once every group is answered.
    fireEvent.click(screen.getByRole("button", { name: "e Small" }), { shiftKey: true });
    await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(2));
    await ready();
    expect(screen.getByRole("heading", { name: "Reviewing Second performer" })).toBeInTheDocument();
    expect(checklist()).toEqual(["Kind, answered: Kind one", "Size, answered: Small"]);
    expect(highlighted()).toEqual([]);
    expect(screen.queryByText(/Staying until answered/)).toBeNull();
  });

  it("applies an ungrouped action and stays while groups are open", async () => {
    open(grouped);
    await ready();
    // Find action's Enter is a plain action too.
    fireEvent.keyDown(document.body, { key: "-" });
    const search = await screen.findByRole("combobox", { name: "Find an action" });
    fireEvent.change(search, { target: { value: "note" } });
    fireEvent.keyDown(search, { key: "Enter" });
    await screen.findByText("Tags saved. Staying until answered: Kind, Size.");
    await ready();
    onFirst();
    expect(appliedLabel()).toBe("Note");
    expect(state.ids).toEqual([30]);
  });

  it("moves on after an ungrouped action once every group is answered", async () => {
    state = { ids: [2], names: ["Tag 2"], absent: [12] };
    open(grouped);
    await ready();
    expect(checklist()).toEqual(["Kind, answered: Kind two", "Size, answered: No size"]);
    expect(highlighted()).toEqual([]);
    fireEvent.keyDown(document.body, { key: "t" });
    await screen.findByRole("heading", { name: "Reviewing Second performer" });
    expect(appliedLabel()).toBe("Note");
  });

  it("counts the answers an item already has and waits only for the others", async () => {
    state = { ids: [2], names: ["Tag 2"], absent: [] };
    open(grouped);
    await ready();
    expect(checklist()).toEqual(["Kind, answered: Kind two", "Size, not answered yet"]);
    expect(highlighted()).toEqual(["Small", "No size"]);
    // Changing the kind's answer leaves the size open.
    fireEvent.keyDown(document.body, { key: "q" });
    await screen.findByText("Tags saved. Staying until answered: Size.");
    await ready();
    onFirst();
    // A recorded absence answers the size: foreseen from the action, the move starts at once,
    // before the write ends.
    let finish!: () => void;
    api.applyTags.mockImplementationOnce(async (_review, _item, action: MediaReviewAction) => {
      await new Promise<void>((resolve) => (finish = resolve));
      applySteps(action);
    });
    fireEvent.keyDown(document.body, { key: "r" });
    expect(screen.getByRole("heading", { name: "Reviewing Second performer" })).toBeInTheDocument();
    await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(2));
    await act(async () => finish());
    await ready();
    expect(screen.getByRole("heading", { name: "Reviewing Second performer" })).toBeInTheDocument();
  });

  it("moves on when the saved tags answer every group after all", async () => {
    api.applyTags.mockImplementationOnce(async (_review, _item, action: MediaReviewAction) => {
      applySteps(action);
      // Someone else answered the size meanwhile.
      state = { ...state, ids: [...state.ids, 11] };
    });
    open(grouped);
    await ready();
    fireEvent.keyDown(document.body, { key: "q" });
    await screen.findByRole("heading", { name: "Reviewing Second performer" });
    expect(screen.queryByText(/Staying until answered/)).toBeNull();
    expect(screen.getByText("Tags saved.")).toBeInTheDocument();
  });

  it("waits with the queue as it is, even for an item that left it, then moves on at once and plays the next video", async () => {
    api.loadOccurrencePage.mockResolvedValueOnce({ items: [first, third], totalCount: 2 });
    // Once answered, the item no longer matches the queue.
    api.loadOccurrencePage.mockResolvedValue({ items: [third], totalCount: 1 });
    open(grouped);
    await ready();
    const loads = api.loadOccurrencePage.mock.calls.length;
    const queue = within(screen.getByRole("complementary", { name: "Review queue" }));
    fireEvent.keyDown(document.body, { key: "q" });
    await screen.findByText("Tags saved. Staying until answered: Size.");
    // Waiting reloads nothing: the item stays marked in the queue, the next video preloaded.
    expect(api.loadOccurrencePage.mock.calls.length).toBe(loads);
    expect(queue.getByRole("button", { name: "First performer — First scene" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByTestId("video-player-preload")).toHaveAttribute("data-video-id", "2");
    // The answer that completes the item, pressed at once, moves on before its write ends and
    // starts the next video; its refresh then settles the queue.
    let finish!: () => void;
    api.applyTags.mockImplementationOnce(async (_review, _item, action: MediaReviewAction) => {
      await new Promise<void>((resolve) => (finish = resolve));
      applySteps(action);
    });
    fireEvent.keyDown(document.body, { key: "e" });
    expect(screen.getByRole("link", { name: "Next scene" })).toBeInTheDocument();
    expect(screen.getByTestId("video-player")).toHaveAttribute("data-autostart", "true");
    await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(2));
    expect(appliedLabel(1)).toBe("Small");
    await act(async () => finish());
    await ready();
    expect(screen.getByRole("link", { name: "Next scene" })).toBeInTheDocument();
    expect(queue.queryByRole("button", { name: /First scene/ })).not.toBeInTheDocument();
  });

  it("keeps Save & next, actions without steps and Stay on this item as they were", async () => {
    const rule: OccurrenceReview = {
      ...grouped,
      actions: [...grouped.actions, { id: "next", label: "Next one", group: "Size", steps: [] }],
    };
    setViewportWidth(390);
    open(rule);
    await ready();
    const pad = () => screen.getByRole("region", { name: "Actions" });
    // A grouped action without steps answers nothing, so it is not marked, and it moves on.
    expect(
      [...pad().querySelectorAll("[data-group-open]")].map(
        (button) => button.querySelector(".dq-mobile-label")?.textContent,
      ),
    ).toEqual(["Kind one", "Kind two", "Small", "No size"]);
    // Stay on this item stays, as it always does, not for the open groups.
    fireEvent.click(within(pad()).getByRole("switch", { name: "Stay on this item" }));
    fireEvent.click(within(pad()).getByRole("button", { name: "Small" }));
    await waitFor(() => expect(api.applyTags).toHaveBeenCalledTimes(1));
    await ready();
    onFirst();
    expect(screen.getByText("Tags saved.")).toBeInTheDocument();
    fireEvent.click(within(pad()).getByRole("switch", { name: "Stay on this item" }));
    fireEvent.click(within(pad()).getByRole("button", { name: "Next one" }));
    await screen.findByRole("heading", { name: "Reviewing Second performer" });
    await ready();
    expect(api.applyTags).toHaveBeenCalledTimes(1);
    // Edit tags' Save & next moves on with the kind still open.
    fireEvent.click(screen.getByRole("button", { name: "Edit tags" }));
    fireEvent.click(screen.getByRole("button", { name: "Save & next" }));
    await waitFor(() => expect(api.editTags).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(screen.queryByRole("heading", { name: "Reviewing Second performer" })).not.toBeInTheDocument(),
    );
    expect(screen.queryByText(/Staying until answered/)).toBeNull();
  });

  it("waits in video reviews too", async () => {
    const rule: VideoReview = {
      ...grouped,
      entityType: "video",
      view: { ...review.view, filter: { ...review.view.filter, perPage: 3 } },
    };
    api.findMedia.mockResolvedValue({ items: [video, third.media], totalCount: 2 });
    open(rule);
    await ready();
    fireEvent.keyDown(document.body, { key: "e" });
    await screen.findByText("Tags saved. Staying until answered: Kind.");
    await ready();
    expect(screen.getByRole("link", { name: "First scene" })).toBeInTheDocument();
    fireEvent.keyDown(document.body, { key: "w" });
    await screen.findByRole("link", { name: "Next scene" });
  });

  it.each([
    ["the setting is off", { ...grouped, stayUntilGroupsAnswered: undefined }],
    ["no action has a group", { ...review, stayUntilGroupsAnswered: true }],
  ])("moves on after every action as before when %s", async (_case, rule) => {
    open(rule);
    await ready();
    expect(screen.queryByRole("list", { name: "Answer groups" })).not.toBeInTheDocument();
    expect(highlighted()).toEqual([]);
    fireEvent.keyDown(document.body, { key: "q" });
    await screen.findByRole("heading", { name: "Reviewing Second performer" });
    expect(api.applyTags).toHaveBeenCalledTimes(1);
  });
});
