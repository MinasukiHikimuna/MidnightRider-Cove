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
configure({ asyncUtilTimeout: 3000 });
const api = vi.hoisted(() => ({
  findVideos: vi.fn(),
  request: vi.fn(),
  resolvePerformers: vi.fn(),
  loadOccurrencePage: vi.fn(),
  readTags: vi.fn(),
  editTags: vi.fn(),
  applyTags: vi.fn(),
}));
vi.mock("../api", async (original) => ({
  ...(await original<typeof import("../api")>()),
  findVideos: api.findVideos,
  request: api.request,
  videoCoverUrl: () => "/cover",
  videoStreamUrl: () => "/stream",
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
  video,
  performer: video.performers[0],
  applications: [],
};
const second = {
  key: "1:12",
  video,
  performer: video.performers[1],
  applications: [],
};
const third = {
  ...first,
  key: "2:11",
  video: { ...video, id: 2, title: "Next scene" },
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
  api.findVideos.mockResolvedValue({
    items: [video, third.video],
    totalCount: 2,
  });
  api.request.mockResolvedValue({ name: "Choice" });
});
function open(
  rule: OccurrenceReview | VideoReview = review,
  canWrite = true,
  onSaveDefaults = vi.fn().mockResolvedValue(undefined),
) {
  return render(
    <ReviewWorkspace
      review={rule}
      canWrite={canWrite}
      onBusy={() => {}}
      onSaveDefaults={onSaveDefaults}
    />,
  );
}
async function ready() {
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Edit tags" })).toBeEnabled(),
  );
}
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
  fireEvent.click(screen.getByRole("button", { name: "1 Observation" }));
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
      fireEvent.click(screen.getByRole("button", { name: "1 Observation" }), {
        shiftKey: true,
      });
    else if (alternative === "stay button")
      fireEvent.click(
        screen.getByRole("button", { name: "Apply & stay: Observation" }),
      );
    else
      fireEvent.keyDown(document.body, {
        key: "!",
        code: "Digit1",
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
    fireEvent.keyDown(document.body, { key: "1", [modifier]: true });
  fireEvent.click(screen.getByRole("button", { name: "Edit tags" }));
  fireEvent.keyDown(
    screen.getByPlaceholderText("Choose tags for this item..."),
    { key: "1" },
  );
  fireEvent.keyDown(document.body, { key: "1" });
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
  fireEvent.click(screen.getByRole("button", { name: "1 Observation" }));
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
    video: occurrence.video,
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
  expect(screen.getByRole("checkbox", { name: "Include subtags" })).toBeChecked();
  fireEvent.click(screen.getByRole("checkbox", { name: "Include subtags" }));
  await waitFor(() => expect(api.loadOccurrencePage).toHaveBeenLastCalledWith(
    expect.objectContaining({ occurrence: expect.objectContaining({ includeSubtags: false }) }),
    null, 1, expect.anything(),
  ));
  expect(JSON.parse(new URLSearchParams(window.location.search).get("performerScope")!).includeSubtags).toBe(false);
  fireEvent.click(screen.getByRole("button", { name: "Save as review defaults" }));
  fireEvent.click(screen.getByRole("button", { name: "Save review" }));
  await waitFor(() => expect(save).toHaveBeenCalledWith(
    expect.objectContaining({ occurrence: expect.objectContaining({ includeSubtags: false }) }),
  ));
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
  fireEvent.click(
    screen.getByRole("button", { name: "Save as review defaults" }),
  );
  expect(save).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Save review" }));
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
    screen.getByRole("button", { name: "Reset to review defaults" }),
  );
  await waitFor(() =>
    expect(new URLSearchParams(window.location.search).get("q")).toBe(""),
  );
});
it("gives video reviews the same Save and default advancement behavior", async () => {
  const rule: VideoReview = { ...review, entityType: "video" };
  open(rule);
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "1 Observation" }));
  await screen.findByRole("link", { name: "Next scene" });
  expect(api.applyTags).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({ key: "1", video }),
    rule.actions[0],
  );
});
it("blocks duplicate submissions and keeps Skip available without write permission", async () => {
  open(review, false);
  await screen.findByRole("heading", { name: "Reviewing First performer" });
  expect(screen.getByRole("button", { name: "1 Observation" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Skip performer" }));
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  expect(api.applyTags).not.toHaveBeenCalled();
});
it("preserves legacy choices and clip boundaries", async () => {
  api.loadOccurrencePage.mockResolvedValue({
    items: [
      {
        ...first,
        video: { ...video, parentVideoId: 3, clipStartSec: 30, clipEndSec: 60 },
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
                video: { ...video, id: 3, title: "Last scene" },
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
              video: { ...video, id: 3, title: "Last scene" },
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
  const action = screen.getByRole("button", { name: "1 Observation" });
  fireEvent.click(action);
  fireEvent.click(action);
  fireEvent.keyDown(document.body, { key: "1" });
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
it("clears custom-field criteria explicitly while preserving them on unrelated dialog edits", async () => {
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
  fireEvent.click(screen.getByRole("button", { name: "Filters, 1 active" }));
  fireEvent.click(screen.getByRole("button", { name: "Apply filters" }));
  await ready();
  expect(
    JSON.parse(new URLSearchParams(window.location.search).get("filters")!)
      .customFieldCriteria,
  ).toEqual(customFieldCriteria);
  fireEvent.click(screen.getByRole("button", { name: /Filters, .*active/ }));
  fireEvent.click(screen.getByRole("button", { name: "Clear all" }));
  fireEvent.click(screen.getByRole("button", { name: "Apply filters" }));
  await ready();
  expect(new URLSearchParams(window.location.search).get("filters")).toBe("{}");
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
  fireEvent.click(screen.getByRole("button", { name: "1 Observation" }));
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
  fireEvent.click(screen.getByRole("button", { name: "1 Observation" }));
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
  const save = vi.fn(); open(review, true, save); await ready();
  fireEvent.click(screen.getByRole("button", { name: /^Second performer$/ }));
  const before = window.location.search;
  fireEvent.click(screen.getByRole("button", { name: "Save as review defaults" }));
  fireEvent.change(screen.getByRole("combobox", { name: "Performers to review" }), { target: { value: "filter" } });
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), { target: { value: "draft search" } });
  await waitFor(() => expect(screen.getByRole("button", { name: "Save review" })).toBeEnabled());
  fireEvent.keyDown(document.body, { key: "1", code: "Digit1" });
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
  open(review, true, save); await ready();
  fireEvent.click(screen.getByRole("button", { name: "Save as review defaults" }));
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

it("has no batch or undo controls before or after saving", async () => {
  open(); await ready();
  expect(screen.queryByRole("button", { name: "Apply to all matching occurrences" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Apply & stay: Observation" }));
  await waitFor(() => expect(api.applyTags).toHaveBeenCalled());
  await ready();
  expect(screen.queryByRole("button", { name: /Undo/ })).not.toBeInTheDocument();
});

it("refreshes the queue after each save and removes a scene only after its last matching performer", async () => {
  api.loadOccurrencePage.mockResolvedValueOnce({ items: [first, second, third], totalCount: 2 });
  api.loadOccurrencePage.mockResolvedValueOnce({ items: [second, third], totalCount: 2 });
  api.loadOccurrencePage.mockResolvedValue({ items: [third], totalCount: 1 });
  open(); await ready();
  const queue = within(screen.getByRole("complementary", { name: "Review queue" }));
  const player = screen.getByTestId("video-player");
  fireEvent.click(screen.getByRole("button", { name: "1 Observation" }));
  await waitFor(() => expect(queue.queryByRole("button", { name: "First performer — First scene" })).not.toBeInTheDocument(), { timeout: 3000 });
  expect(queue.getByRole("button", { name: "Second performer — First scene" })).toBeInTheDocument();
  expect(screen.getByTestId("video-player")).toBe(player);
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "1 Observation" }));
  await screen.findByRole("link", { name: "Next scene" }, { timeout: 3000 });
  expect(queue.queryByRole("button", { name: /First scene/ })).not.toBeInTheDocument();
});

it.each([true, false])("continues playback after applying and advancing only if playing (%s)", async playing => {
  api.loadOccurrencePage.mockResolvedValueOnce({ items: [first, third], totalCount: 2 });
  api.loadOccurrencePage.mockResolvedValue({ items: [third], totalCount: 1 });
  open(); await ready();
  expect(screen.getByTestId("video-player")).toHaveAttribute("data-autostart", "false");
  fireEvent.click(screen.getByRole("button", { name: "Play review video" }));
  if (!playing) fireEvent.click(screen.getByRole("button", { name: "Pause review video" }));
  fireEvent.click(screen.getByRole("button", { name: "1 Observation" }));
  await screen.findByRole("link", { name: "Next scene" }, { timeout: 3000 });
  expect(screen.getByTestId("video-player")).toHaveAttribute("data-autostart", String(playing));
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
  const traversed = { ...third, key: "3:11", video: { ...video, id: 3, title: "Already traversed" } };
  api.loadOccurrencePage.mockImplementation(async (_rule, _targets, page) => ({
    items: page === 1 ? [first] : [third, partner], totalCount: 3,
  }));
  window.history.replaceState(null, "", "/data-quality?review=r&page=2&perPage=1&startFrom=end");
  open(); await ready();
  api.loadOccurrencePage.mockImplementation(async (_rule, _targets, page) => ({
    items: page === 1 ? [first] : [partner], totalCount: 3,
  }));
  fireEvent.click(screen.getByRole("button", { name: "1 Observation" }));
  await screen.findByRole("heading", { name: "Reviewing Second performer" });
  await ready();
  api.loadOccurrencePage.mockImplementation(async (_rule, _targets, page) => ({
    items: page === 1 ? [first] : [traversed], totalCount: 2,
  }));
  fireEvent.click(screen.getByRole("button", { name: "1 Observation" }));
  await screen.findByRole("link", { name: "First scene" });
  expect(screen.queryByRole("link", { name: "Already traversed" })).not.toBeInTheDocument();
});

it("does not carry autoplay into a manually selected video", async () => {
  api.loadOccurrencePage.mockResolvedValueOnce({ items: [first, third], totalCount: 2 });
  api.loadOccurrencePage.mockResolvedValue({ items: [first, third], totalCount: 2 });
  open(); await ready();
  fireEvent.click(screen.getByRole("button", { name: "Play review video" }));
  fireEvent.click(screen.getByRole("button", { name: "1 Observation" }));
  await screen.findByRole("link", { name: "Next scene" });
  await ready();
  expect(screen.getByTestId("video-player")).toHaveAttribute("data-autostart", "true");
  fireEvent.click(screen.getByRole("button", { name: "First performer — First scene" }));
  await screen.findByRole("link", { name: "First scene" });
  expect(screen.getByTestId("video-player")).toHaveAttribute("data-autostart", "false");
});


it("does not revisit a reverse-page refill after Apply & stay removes the active occurrence", async () => {
  const traversed = { ...third, key: "3:11", video: { ...video, id: 3, title: "Already traversed" } };
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
  fireEvent.click(screen.getByRole("button", { name: "1 Observation" }));
  await screen.findByRole("link", { name: "Next scene" });
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "Pause review video" }));
  fireEvent.click(screen.getByRole("button", { name: "Reset to review defaults" }));
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
  open(); await ready();
  fireEvent.click(screen.getByRole("button", { name: "Skip performer" }));
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "Apply & stay: Observation" }));
  await waitFor(() => expect(api.applyTags).toHaveBeenCalled());
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "Save as review defaults" }));
  const loads = api.loadOccurrencePage.mock.calls.length;
  fireEvent.change(screen.getByRole("textbox", { name: "Search list" }), { target: { value: "draft" } });
  await waitFor(() => expect(api.loadOccurrencePage.mock.calls.length).toBeGreaterThan(loads));
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "Skip performer" }));
  await screen.findByRole("link", { name: "Next scene" });
});

it("forgets playing state when manual query navigation remounts a paused player", async () => {
  api.loadOccurrencePage.mockResolvedValue({ items: [first, third], totalCount: 2 });
  open(); await ready();
  fireEvent.click(screen.getByRole("button", { name: "Play review video" }));
  fireEvent.click(screen.getByRole("button", { name: "Reset to review defaults" }));
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "1 Observation" }));
  await screen.findByRole("link", { name: "Next scene" });
  expect(screen.getByTestId("video-player")).toHaveAttribute("data-autostart", "false");
});


it("forgets earlier playback after manually visiting another scene and returning", async () => {
  api.loadOccurrencePage.mockResolvedValue({ items: [first, third], totalCount: 2 });
  open(); await ready();
  fireEvent.click(screen.getByRole("button", { name: "Play review video" }));
  fireEvent.click(screen.getByRole("button", { name: "First performer — Next scene" }));
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "First performer — First scene" }));
  await ready();
  fireEvent.click(screen.getByRole("button", { name: "1 Observation" }));
  await screen.findByRole("link", { name: "Next scene" });
  expect(screen.getByTestId("video-player")).toHaveAttribute("data-autostart", "false");
});
