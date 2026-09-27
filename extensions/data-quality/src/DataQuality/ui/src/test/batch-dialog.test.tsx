import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { BatchOccurrenceDialog } from "../BatchOccurrenceDialog";
import type { OccurrenceReview } from "../model";
import type { OccurrenceBatch } from "../batchOccurrences";
const mocks = vi.hoisted(() => ({
  preview: vi.fn(),
  run: vi.fn(),
  undo: vi.fn(),
  request: vi.fn(),
}));
vi.mock("../batchOccurrences", async (original) => ({
  ...(await original<typeof import("../batchOccurrences")>()),
  previewOccurrenceBatch: mocks.preview,
  runOccurrenceBatch: mocks.run,
  undoOccurrenceBatch: mocks.undo,
}));
vi.mock("../api", async (original) => ({
  ...(await original<typeof import("../api")>()),
  request: mocks.request,
}));
const review: OccurrenceReview = {
  id: "r",
  name: "Review",
  description: "",
  entityType: "performerOccurrence",
  actions: [
    {
      id: "a",
      label: "Answer",
      steps: [
        { mode: "ADD", tagIds: [21] },
        { mode: "REMOVE", tagIds: [22] },
      ],
    },
  ],
  view: {
    filter: { page: 1, perPage: 40 },
    objectFilter: {},
    displayMode: "grid",
    searchMode: "text",
  },
  occurrence: {
    targetMode: "selected",
    performerIds: [11],
    performerFilter: {},
    condition: "any",
    conditionTagIds: [],
    tagIds: [],
    multiple: true,
  },
};
const video = {
  id: 1,
  title: "Scene",
  date: "2019-05-01",
  files: [],
  updatedAt: "",
  performers: [{ id: 11, name: "Target performer" }],
};
function entry(media: typeof video, ids: number[], conflict: boolean) {
  const state = { ids, names: [], absent: [], applications: [] };
  return {
    item: {
      key: `${media.id}:11`,
      media,
      occurrence: {
        key: `${media.id}:11`,
        media,
        performer: media.performers[0],
        applications: [],
      },
    },
    before: state,
    expected: state,
    conflict,
    status: "pending" as const,
  };
}
let batch: OccurrenceBatch;
beforeEach(() => {
  vi.resetAllMocks();
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  batch = {
    review: structuredClone(review),
    actions: [review.actions[0]],
    action: review.actions[0],
    categories: [],
    touched: [21, 22],
    entries: [entry(video, [22], true)],
  };
  mocks.preview.mockImplementation(async () => batch);
  mocks.request.mockImplementation(async (path: string) =>
    path.startsWith("/api/tagapplications")
      ? []
      : {
          name: path.includes("performers")
            ? "Target performer"
            : path.endsWith("21")
              ? "Answer"
              : "Opposite",
        },
  );
});
function mount(rule: OccurrenceReview = review, performerFlags?: string[]) {
  const onOpen = vi.fn(),
    onClose = vi.fn(),
    onWrite = vi.fn();
  const rendered = render(
    <BatchOccurrenceDialog
      review={rule}
      disabled={false}
      performerFlags={performerFlags}
      onOpen={onOpen}
      onClose={onClose}
      onWrite={onWrite}
    />,
  );
  return { ...rendered, onOpen, onClose, onWrite };
}
const openButton = () =>
  screen.getByRole("button", { name: "Apply to all matching occurrences" });
async function preview(answers = ["Answer"], timeout?: number) {
  fireEvent.click(openButton());
  for (const answer of answers)
    fireEvent.click(screen.getByRole("checkbox", { name: answer }));
  fireEvent.click(screen.getByRole("button", { name: "Preview all matches" }));
  await screen.findByText(
    "Preview ready. No tags have been changed.",
    {},
    timeout ? { timeout } : undefined,
  );
}
it("previews without writes, defaults to skip, and explicitly applies replacements", async () => {
  const callbacks = mount();
  await preview();
  expect(
    screen.getByRole("dialog", { name: "Batch occurrence approval" }),
  ).toHaveAttribute("aria-modal", "true");
  expect(mocks.run).not.toHaveBeenCalled();
  expect(screen.getByLabelText("Conflicting answers")).toHaveValue("skip");
  expect(
    await screen.findByText(/Performer scope: Target performer/),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/0 to change; 0 already correct; 1 conflicts/),
  ).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: "Inspect occurrences and conflicts" }),
  );
  expect(
    screen.getByText(/Skipped unless conflicting answers are replaced\. Add: Answer; Remove: Opposite/),
  ).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Conflicting answers"), {
    target: { value: "replace" },
  });
  expect(
    screen.getByText(/1 to change; 0 already correct; 1 conflicts/),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Target performer — Scene" }),
  ).toHaveAttribute("href", "/video/1");
  fireEvent.click(screen.getByRole("button", { name: "Apply batch" }));
  await waitFor(() =>
    expect(mocks.run).toHaveBeenCalledWith(
      batch,
      true,
      expect.any(Function),
      expect.any(Function),
      false,
    ),
  );
  expect(callbacks.onWrite).toHaveBeenCalledOnce();
});
it("previews several answers together in review order and needs at least one", async () => {
  const rule: OccurrenceReview = {
    ...review,
    actions: [
      review.actions[0],
      { id: "b", label: "Second answer", steps: [{ mode: "ADD", tagIds: [23] }] },
    ],
  };
  mount(rule);
  fireEvent.click(openButton());
  expect(screen.getByRole("button", { name: "Preview all matches" })).toBeDisabled();
  await preview(["Second answer", "Answer"]);
  expect(mocks.preview).toHaveBeenCalledWith(
    rule,
    rule.actions,
    expect.any(AbortSignal),
    expect.any(Function),
  );
});
it("blocks closing during a run, then closing discards the results and their undo", async () => {
  let finish!: () => void;
  mocks.run.mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );
  batch.entries[0].conflict = false;
  const callbacks = mount();
  await preview();
  fireEvent.click(screen.getByRole("button", { name: "Apply batch" }));
  expect(screen.getByRole("button", { name: "Close" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Cancel run" }));
  expect(mocks.run.mock.calls[0][2]()).toBe(true);
  batch.entries[0].status = "changed";
  batch.entries[0].operation = {
    item: batch.entries[0].item,
    before: batch.entries[0].before,
    after: batch.entries[0].before,
    tags: { added: [21], removed: [22] },
    absence: { added: [], removed: [] },
  };
  finish();
  await screen.findByText(/Stopped after in-flight operations settled/);
  expect(screen.getByRole("button", { name: "Undo batch" })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "Close" }));
  expect(callbacks.onClose).toHaveBeenCalledWith(true);
  expect(
    screen.queryByRole("dialog", { name: "Batch occurrence approval" }),
  ).not.toBeInTheDocument();
  fireEvent.click(openButton());
  expect(
    screen.queryByText(/Stopped after in-flight operations settled/),
  ).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Undo batch" })).not.toBeInTheDocument();
  expect(screen.getByRole("checkbox", { name: "Answer" })).not.toBeChecked();
});
it("invalidates an unapplied preview after closing and changing scope", async () => {
  const { rerender, onOpen, onClose, onWrite } = mount();
  await preview();
  fireEvent.click(screen.getByRole("button", { name: "Close" }));
  expect(onClose).toHaveBeenCalledWith(false);
  rerender(
    <BatchOccurrenceDialog
      review={{
        ...review,
        occurrence: { ...review.occurrence, performerIds: [12] },
      }}
      disabled={false}
      onOpen={onOpen}
      onClose={onClose}
      onWrite={onWrite}
    />,
  );
  fireEvent.click(openButton());
  expect(
    screen.queryByRole("button", { name: "Apply batch" }),
  ).not.toBeInTheDocument();
});
it("starts a new batch at once, dropping the results without a confirmation", async () => {
  const { rerender, onOpen, onClose, onWrite } = mount();
  await preview();
  fireEvent.change(screen.getByLabelText("Conflicting answers"), {
    target: { value: "replace" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Apply batch" }));
  await screen.findByText(/Batch finished/);
  const next = {
    ...review,
    actions: [{ ...review.actions[0], id: "new", label: "New answer" }],
    // Specific performers with none picked reviews everyone.
    occurrence: { ...review.occurrence, targetMode: "selected" as const, performerIds: [] },
  };
  rerender(
    <BatchOccurrenceDialog
      review={next}
      disabled={false}
      onOpen={onOpen}
      onClose={onClose}
      onWrite={onWrite}
    />,
  );
  // Completed results keep describing the batch that ran until they are dropped.
  expect(screen.getByText(/Performer scope: Target performer/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "New batch" }));
  expect(
    screen.queryByRole("group", { name: "Discard batch results" }),
  ).not.toBeInTheDocument();
  expect(screen.queryByText(/1 occurrences in 1 scenes/)).not.toBeInTheDocument();
  expect(screen.getByText(/Performer scope: All performers/)).toBeInTheDocument();
  expect(screen.getByLabelText("Conflicting answers")).toHaveValue("skip");
  expect(screen.getByRole("checkbox", { name: "New answer" })).not.toBeChecked();
  fireEvent.click(screen.getByRole("checkbox", { name: "New answer" }));
  fireEvent.click(screen.getByRole("button", { name: "Preview all matches" }));
  // A fresh preview waits out Cove's one-second query cache after the writes.
  await screen.findByText(
    "Preview ready. No tags have been changed.",
    {},
    { timeout: 3000 },
  );
  expect(mocks.preview).toHaveBeenLastCalledWith(
    next,
    next.actions,
    expect.any(AbortSignal),
    expect.any(Function),
  );
  fireEvent.click(screen.getByRole("button", { name: "Close" }));
  expect(onClose).toHaveBeenCalledWith(true);
});

it("bounds tag label reads and cancels in-flight preview labels", async () => {
  batch.actions = [
    { id: "a", label: "Answer", steps: [{ mode: "ADD", tagIds: Array.from({ length: 30 }, (_, i) => i + 100) }] },
  ];
  let active = 0,
    max = 0,
    aborted = 0;
  mocks.request.mockImplementation(
    async (path: string, options: RequestInit) => {
      if (path.includes("performers")) return { name: "Target performer" };
      if (path.startsWith("/api/tagapplications")) return [];
      active++;
      max = Math.max(max, active);
      return new Promise((_, reject) =>
        options.signal!.addEventListener(
          "abort",
          () => {
            active--;
            aborted++;
            reject(new DOMException("Aborted", "AbortError"));
          },
          { once: true },
        ),
      );
    },
  );
  mount();
  fireEvent.click(openButton());
  fireEvent.click(screen.getByRole("checkbox", { name: "Answer" }));
  fireEvent.click(screen.getByRole("button", { name: "Preview all matches" }));
  await waitFor(() => expect(active).toBe(5));
  fireEvent.click(screen.getByRole("button", { name: "Cancel preview" }));
  await screen.findByText("Preview cancelled. No tags were changed.");
  expect(max).toBe(5);
  expect(aborted).toBe(5);
  expect(screen.getByRole("button", { name: "Close" })).toBeEnabled();
  expect(mocks.run).not.toHaveBeenCalled();
});

it("links the earliest and latest dated videos of the batch", async () => {
  batch.entries = [
    entry({ ...video, id: 2, date: "2021-02-03", title: "Late" }, [], false),
    entry(video, [], false),
    entry({ ...video, id: 3, date: undefined as unknown as string }, [], false),
  ];
  mount();
  await preview();
  expect(screen.getByRole("link", { name: "Earliest video, 2019-05-01" })).toHaveAttribute(
    "href",
    "/video/1",
  );
  expect(screen.getByRole("link", { name: "Latest video, 2021-02-03" })).toHaveAttribute(
    "href",
    "/video/2",
  );
  expect(screen.getByText(/1 without a date/)).toBeInTheDocument();
});

it("reports answers kept because their category already holds a different one", async () => {
  batch.action = { id: "a", label: "Answer", steps: [{ mode: "ADD", tagIds: [32] }] };
  batch.actions = [batch.action];
  batch.categories = [[30, 31, 32]];
  batch.touched = [30, 31, 32];
  batch.entries = [entry(video, [31], false)];
  // The occurrence carries its own tag names; only the answer and condition tags are read.
  batch.entries[0].before.applications = [
    { id: 1, hostType: "video", hostId: 1, contextType: "performer", contextId: 11, tag: { id: 31, name: "Small" } },
  ];
  mocks.request.mockImplementation(async (path: string) =>
    path.startsWith("/api/tagapplications")
      ? []
      : { name: path.endsWith("32") ? "Medium" : "Size" },
  );
  const rule: OccurrenceReview = {
    ...review,
    occurrence: { ...review.occurrence, condition: "excludesAll", conditionTagIds: [30] },
  };
  batch.review = structuredClone(rule);
  mount(rule);
  await preview();
  expect(
    screen.getByText(/1 already have a different answer in a category \(kept\)/),
  ).toBeInTheDocument();
  expect(screen.getByText(/0 to change/)).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: "Inspect occurrences and conflicts" }),
  );
  expect(screen.getByText(/Keeps Small instead of Medium/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Conflicting answers"), {
    target: { value: "replace" },
  });
  expect(screen.getByText(/1 to change/)).toBeInTheDocument();
  expect(screen.getByText(/Add: Medium; Remove: Small/)).toBeInTheDocument();
  expect(
    mocks.request.mock.calls.map(([path]) => String(path)).filter((path) => path.startsWith("/api/tags/")),
  ).toEqual(["/api/tags/32", "/api/tags/30"]);
});

it("waits out Cove's query cache before previewing again after a run, and refreshes existing answers", async () => {
  let ranAt = 0;
  mocks.run.mockImplementation(async () => {
    ranAt = Date.now();
  });
  mount();
  await preview();
  const answerReads = () =>
    mocks.request.mock.calls.filter(([path]) => String(path).startsWith("/api/tagapplications")).length;
  const before = answerReads();
  fireEvent.change(screen.getByLabelText("Conflicting answers"), { target: { value: "replace" } });
  fireEvent.click(screen.getByRole("button", { name: "Apply batch" }));
  await screen.findByText(/Batch finished/);
  await waitFor(() => expect(answerReads()).toBeGreaterThan(before));
  fireEvent.click(screen.getByRole("button", { name: "New batch" }));
  fireEvent.click(screen.getByRole("checkbox", { name: "Answer" }));
  let previewedAt = 0;
  mocks.preview.mockImplementation(async () => {
    previewedAt = Date.now();
    return batch;
  });
  fireEvent.click(screen.getByRole("button", { name: "Preview all matches" }));
  await screen.findByText("Preview ready. No tags have been changed.", {}, { timeout: 3000 });
  // Measured from when the run itself ended, so a slow machine cannot make it pass or fail.
  expect(previewedAt - ranAt).toBeGreaterThanOrEqual(1090);
});

it("warns about a flagged performer and shows their existing answers", async () => {
  mount(review, ["Changed"]);
  fireEvent.click(openButton());
  expect(screen.getByText(/Flagged: Changed\./)).toBeInTheDocument();
  expect(
    await screen.findByText("None of this performer’s videos is answered yet."),
  ).toBeInTheDocument();
});

it("hands custom-field criteria to Cove's own toolbar section with resolved tag labels", async () => {
  const scoped = {
    ...review,
    view: {
      ...review.view,
      objectFilter: {
        customFieldCriteria: [
          {
            key: "confirmed_absent_tags",
            type: "tag",
            modifier: "EXCLUDES",
            value: 21,
          },
          { key: "review_note", type: "string", modifier: "IS_NULL" },
        ],
      },
    },
  };
  batch.review = structuredClone(scoped);
  render(
    <BatchOccurrenceDialog
      review={scoped}
      disabled={false}
      onOpen={() => {}}
      onClose={() => {}}
      onWrite={() => {}}
    />,
  );
  await preview();
  const summary = within(
    screen.getByRole("group", { name: "Batch scene filters" }),
  );
  expect(
    summary.getByRole("toolbar", { name: "Video list controls" }),
  ).toHaveAttribute("data-custom-field-entity-type", "video");
  expect(mocks.request.mock.calls.map((call) => String(call[0]))).toContain(
    "/api/tags/21",
  );
  expect(summary.getByRole("toolbar", { name: "Video list controls" })).toHaveAttribute(
    "data-object-filter",
    expect.stringContaining('"displayValue":"Answer"'),
  );
});
