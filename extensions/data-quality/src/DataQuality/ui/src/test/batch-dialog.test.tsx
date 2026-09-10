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
let batch: OccurrenceBatch;
beforeEach(() => {
  vi.resetAllMocks();
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  const video = {
    id: 1,
    title: "Scene",
    files: [],
    updatedAt: "",
    performers: [{ id: 11, name: "Target performer" }],
  };
  const state = {
    ids: [22],
    names: ["Opposite"],
    absent: [],
    applications: [],
  };
  batch = {
    review: structuredClone(review),
    action: review.actions[0],
    touched: [21, 22],
    entries: [
      {
        item: {
          key: "1:11",
          video,
          occurrence: {
            key: "1:11",
            video,
            performer: video.performers[0],
            applications: [],
          },
        },
        before: state,
        expected: state,
        desired: [21],
        conflict: true,
        status: "pending",
      },
    ],
  };
  mocks.preview.mockImplementation(async () => batch);
  mocks.request.mockImplementation(async (path: string) => ({
    name: path.includes("performers")
      ? "Target performer"
      : path.endsWith("21")
        ? "Answer"
        : "Opposite",
  }));
});
function mount() {
  const onOpen = vi.fn(),
    onClose = vi.fn(),
    onWrite = vi.fn();
  const rendered = render(
    <BatchOccurrenceDialog
      review={review}
      disabled={false}
      onOpen={onOpen}
      onClose={onClose}
      onWrite={onWrite}
    />,
  );
  return { ...rendered, onOpen, onClose, onWrite };
}
async function preview() {
  fireEvent.click(
    screen.getByRole("button", { name: "Apply to all matching occurrences" }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Preview all matches" }));
  await screen.findByText("Preview ready. No tags have been changed.");
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
  fireEvent.change(screen.getByLabelText("Conflicting answers"), {
    target: { value: "replace" },
  });
  expect(
    screen.getByText(/1 to change; 0 already correct; 1 conflicts/),
  ).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: "Inspect occurrences and conflicts" }),
  );
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
it("blocks closing during a run and requests cancellation without discarding results", async () => {
  let finish!: () => void;
  mocks.run.mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );
  const callbacks = mount();
  await preview();
  fireEvent.click(screen.getByRole("button", { name: "Apply batch" }));
  expect(screen.getByRole("button", { name: "Close" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Cancel run" }));
  expect(mocks.run.mock.calls[0][2]()).toBe(true);
  finish();
  await screen.findByText(/Stopped after in-flight operations settled/);
  fireEvent.click(screen.getByRole("button", { name: "Close" }));
  expect(callbacks.onClose).toHaveBeenCalledWith(true);
  fireEvent.click(screen.getByRole("button", { name: "Batch results / undo" }));
  expect(
    screen.getByText(/Stopped after in-flight operations settled/),
  ).toBeInTheDocument();
});
it("invalidates an unapplied preview after closing and changing scope", async () => {
  const { rerender, onOpen, onClose, onWrite } = mount();
  await preview();
  fireEvent.click(screen.getByRole("button", { name: "Close" }));
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
  fireEvent.click(
    screen.getByRole("button", { name: "Apply to all matching occurrences" }),
  );
  expect(
    screen.queryByRole("button", { name: "Apply batch" }),
  ).not.toBeInTheDocument();
});
it("keeps completed batch scope and requires explicit discard before a new batch", async () => {
  const { rerender, onOpen, onClose, onWrite } = mount();
  await preview();
  fireEvent.click(screen.getByRole("button", { name: "Apply batch" }));
  await screen.findByText(/Batch finished/);
  fireEvent.click(screen.getByRole("button", { name: "Close" }));
  rerender(
    <BatchOccurrenceDialog
      review={{
        ...review,
        occurrence: { ...review.occurrence, targetMode: "all" },
      }}
      disabled={false}
      onOpen={onOpen}
      onClose={onClose}
      onWrite={onWrite}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Batch results / undo" }));
  expect(
    await screen.findByText(/Performer scope: Target performer/),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "New batch" }));
  const confirm = screen.getByRole("group", { name: "Discard batch results" });
  fireEvent.click(
    within(confirm).getByRole("button", {
      name: "Discard results and start new batch",
    }),
  );
  expect(
    screen.queryByText(/1 occurrences in 1 scenes/),
  ).not.toBeInTheDocument();
  expect(
    screen.getByText(/Performer scope: All performers/),
  ).toBeInTheDocument();
});

it("bounds tag label reads and cancels in-flight preview labels", async () => {
  batch.touched = Array.from({ length: 30 }, (_, i) => i + 100);
  let active = 0,
    max = 0,
    aborted = 0;
  mocks.request.mockImplementation(
    async (path: string, options: RequestInit) => {
      if (path.includes("performers")) return { name: "Target performer" };
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
  fireEvent.click(
    screen.getByRole("button", { name: "Apply to all matching occurrences" }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Preview all matches" }));
  await waitFor(() => expect(active).toBe(5));
  fireEvent.click(screen.getByRole("button", { name: "Cancel preview" }));
  await screen.findByText("Preview cancelled. No tags were changed.");
  expect(max).toBe(5);
  expect(aborted).toBe(5);
  expect(screen.getByRole("button", { name: "Close" })).toBeEnabled();
  expect(mocks.run).not.toHaveBeenCalled();
});

it("uses the edited review action and resets conflict policy for a new batch", async () => {
  const { rerender, onOpen, onClose, onWrite } = mount();
  await preview();
  fireEvent.change(screen.getByLabelText("Conflicting answers"), {
    target: { value: "replace" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Apply batch" }));
  await screen.findByText(/Batch finished/);
  fireEvent.click(screen.getByRole("button", { name: "Close" }));
  const next = {
    ...review,
    actions: [{ ...review.actions[0], id: "new", label: "New answer" }],
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
  fireEvent.click(screen.getByRole("button", { name: "Batch results / undo" }));
  fireEvent.click(screen.getByRole("button", { name: "New batch" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Discard results and start new batch" }),
  );
  expect(screen.getByLabelText("Batch answer")).toHaveValue("new");
  expect(screen.getByLabelText("Conflicting answers")).toHaveValue("skip");
  fireEvent.click(screen.getByRole("button", { name: "Preview all matches" }));
  await screen.findByText("Preview ready. No tags have been changed.");
  expect(mocks.preview).toHaveBeenLastCalledWith(
    next,
    next.actions[0],
    expect.any(AbortSignal),
    expect.any(Function),
  );
});

it("shows custom-field names, operators, and resolved tag labels in the batch scope", async () => {
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
    summary.getByRole("button", { name: "Edit filter: Custom Fields" }),
  ).toHaveTextContent(
    "Confirmed absent tags Excludes Answer, Review note Is Null",
  );
});
