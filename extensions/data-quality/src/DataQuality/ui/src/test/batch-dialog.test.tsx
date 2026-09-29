import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BatchOccurrenceDialog } from "../BatchOccurrenceDialog";
import { ReviewTagBadge, WithoutTagImagePreviews } from "../TagDisplay";
import type { AttentionEntry } from "../attention";
import type { TagTrees } from "../effectPreview";
import type { OccurrenceReview } from "../model";
import {
  ConflictingAnswersError,
  type BatchEntry,
  type OccurrenceBatch,
} from "../batchOccurrences";
const mocks = vi.hoisted(() => ({
  preview: vi.fn(),
  run: vi.fn(),
  undo: vi.fn(),
  request: vi.fn(),
  answers: vi.fn(),
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
vi.mock("../performerAnswers", async (original) => ({
  ...(await original<typeof import("../performerAnswers")>()),
  loadPerformerAnswers: mocks.answers,
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
const TAG_NAMES: Record<string, string> = {
  "21": "Answer",
  "22": "Opposite",
  "23": "Other answer",
};
function entry(media: typeof video, ids: number[], conflict: boolean): BatchEntry {
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
    status: "pending",
  };
}
function recorded(item: BatchEntry) {
  return {
    item: item.item,
    before: item.before,
    after: item.before,
    tags: { added: [21], removed: [22] },
    absence: { added: [], removed: [] },
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
  mocks.answers.mockResolvedValue({ answered: 0, groups: [] });
  mocks.request.mockImplementation(async (path: string) =>
    path.includes("performers")
      ? { name: "Target performer" }
      : { name: TAG_NAMES[path.split("/").pop()!] ?? "Opposite" },
  );
});
/** A flag for the whole review on the focused performer. */
const wholeFlag = (name: string): AttentionEntry => ({
  key: "review",
  name: "",
  tagIds: null,
  flags: [name],
  mixed: [],
});
function mount(
  rule: OccurrenceReview = review,
  performerAttention?: AttentionEntry[],
  trees?: TagTrees,
) {
  const onOpen = vi.fn(),
    onClose = vi.fn(),
    onWrite = vi.fn();
  const rendered = render(
    <BatchOccurrenceDialog
      review={rule}
      disabled={false}
      performerAttention={performerAttention}
      trees={trees}
      onOpen={onOpen}
      onClose={onClose}
      onWrite={onWrite}
    />,
  );
  return { ...rendered, onOpen, onClose, onWrite };
}
const openButton = () => screen.getByRole("button", { name: "Batch…" });
const button = (name: string | RegExp) => screen.getByRole("button", { name });
const checkbox = (name: string) => screen.getByRole("checkbox", { name });
const step = (name: string) =>
  within(screen.getByRole("list", { name: "Steps" })).getByText(name).closest("li");
async function preview(answers = ["Answer"], timeout?: number) {
  fireEvent.click(openButton());
  for (const answer of answers) fireEvent.click(checkbox(answer));
  fireEvent.click(button("Preview all matches"));
  await screen.findByText(
    "Preview ready. No tags have been changed.",
    {},
    timeout ? { timeout } : undefined,
  );
}

it("walks from the answers to a preview without writes, keeps different answers by default, and applies replacements when chosen", async () => {
  const callbacks = mount();
  fireEvent.click(openButton());
  expect(
    screen.getByRole("dialog", { name: "Apply to all matching occurrences" }),
  ).toHaveAttribute("aria-modal", "true");
  expect(step("Answers")).toHaveAttribute("aria-current", "step");
  expect(button("Preview all matches")).toBeDisabled();
  fireEvent.click(checkbox("Answer"));
  fireEvent.click(button("Preview all matches"));
  await screen.findByText("Preview ready. No tags have been changed.");
  expect(step("Preview")).toHaveAttribute("aria-current", "step");
  expect(step("Answers")).toHaveTextContent("Answers, done");
  expect(mocks.run).not.toHaveBeenCalled();
  const scope = within(screen.getByRole("group", { name: "Batch scope" }));
  expect(await scope.findByText("Target performer")).toBeInTheDocument();
  expect(scope.getByText("Any occurrence tags")).toBeInTheDocument();
  expect(button("1 matching occurrence in 1 scene")).toBeInTheDocument();
  expect(button("0 will change")).toBeDisabled();
  expect(button("0 already correct, no write")).toBeDisabled();
  expect(button("Keep their answer")).toHaveAttribute("aria-pressed", "true");
  expect(button(/^Apply to 0 occurrences$/)).toBeDisabled();
  const different = button("1 keep a different answer");
  fireEvent.click(different);
  expect(different).toHaveAttribute("aria-pressed", "true");
  const list = within(screen.getByRole("region", { name: "Occurrences with a different answer" }));
  expect(list.getByRole("link", { name: "Target performer — Scene" })).toHaveAttribute(
    "href",
    "/video/1",
  );
  expect(list.getByText("Keeps its answer unless replaced:")).toBeInTheDocument();
  expect(list.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
    "+ Answer",
    "− Opposite",
  ]);
  fireEvent.click(button("Replace it"));
  expect(button("Replace it")).toHaveAttribute("aria-pressed", "true");
  expect(button("1 will change")).toBeEnabled();
  expect(button("1 replace a different answer")).toBeInTheDocument();
  expect(list.queryByText("Keeps its answer unless replaced:")).not.toBeInTheDocument();
  fireEvent.click(button("Apply to 1 occurrence"));
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
  expect(step("Run")).toHaveAttribute("aria-current", "step");
  expect(await screen.findByText(/Batch finished/)).toBeInTheDocument();
});

it("shows each answer's key as the review places it, pinned, Auto or none", () => {
  mount({
    ...review,
    actions: [
      { ...review.actions[0], shortcut: "k" },
      { id: "b", label: "Second answer", steps: [{ mode: "ADD", tagIds: [23] }] },
      { id: "c", label: "Keyless answer", steps: [{ mode: "ADD", tagIds: [22] }], shortcut: "none" },
    ],
  });
  fireEvent.click(openButton());
  const key = (name: string) => checkbox(name).closest("label")!.querySelector("kbd");
  expect(key("Answer")).toHaveTextContent("k");
  expect(key("Second answer")).toHaveTextContent("q");
  expect(key("Keyless answer")).toBeNull();
});

it("previews several answers together in review order, each with its key and effect, and needs at least one", async () => {
  const rule: OccurrenceReview = {
    ...review,
    actions: [
      review.actions[0],
      // Assessments are answered one occurrence at a time; an action without steps changes nothing.
      { id: "assess", label: "Assessment", steps: [{ mode: "MARK_ABSENT", tagIds: [21] }] },
      { id: "empty", label: "Nothing", steps: [] },
      { id: "b", label: "Second answer", steps: [{ mode: "ADD", tagIds: [23] }] },
    ],
  };
  mount(rule);
  fireEvent.click(openButton());
  const answers = within(screen.getByRole("group", { name: "Answers" }));
  expect(answers.getAllByRole("checkbox")).toHaveLength(2);
  expect(answers.queryByRole("checkbox", { name: "Assessment" })).not.toBeInTheDocument();
  expect(answers.queryByRole("checkbox", { name: "Nothing" })).not.toBeInTheDocument();
  // Keys follow the action's place in the review, not in this list.
  expect(checkbox("Answer").closest("label")!.querySelector("kbd")).toHaveTextContent("q");
  expect(checkbox("Second answer").closest("label")!.querySelector("kbd")).toHaveTextContent("r");
  await waitFor(() =>
    expect(checkbox("Answer")).toHaveAccessibleDescription("+ Answer − Opposite"),
  );
  expect(checkbox("Second answer")).toHaveAccessibleDescription("+ Other answer");
  expect(button("Preview all matches")).toBeDisabled();
  fireEvent.click(checkbox("Second answer"));
  fireEvent.click(checkbox("Answer"));
  fireEvent.click(button("Preview all matches"));
  await screen.findByText("Preview ready. No tags have been changed.");
  expect(mocks.preview).toHaveBeenCalledWith(
    rule,
    [rule.actions[0], rule.actions[3]],
    expect.any(AbortSignal),
    expect.any(Function),
  );
  const chosen = within(screen.getByRole("region", { name: "Answers to apply" }));
  expect(
    chosen.getAllByRole("listitem").map((item) => item.querySelector(".dq-batch-chosen-chip")?.textContent),
  ).toEqual(["qAnswer", "rSecond answer"]);
  // Change goes back to the answers, as they were.
  fireEvent.click(chosen.getByRole("button", { name: "Change" }));
  expect(step("Answers")).toHaveAttribute("aria-current", "step");
  expect(screen.queryByText("Preview ready. No tags have been changed.")).not.toBeInTheDocument();
  expect(checkbox("Answer")).toBeChecked();
  expect(checkbox("Second answer")).toBeChecked();
  // An unchanged choice keeps its preview; a changed one previews again.
  fireEvent.click(button("Preview all matches"));
  expect(mocks.preview).toHaveBeenCalledTimes(1);
  expect(button("Apply to 0 occurrences")).toBeInTheDocument();
  fireEvent.click(button("Back"));
  fireEvent.click(checkbox("Second answer"));
  fireEvent.click(button("Preview all matches"));
  await waitFor(() => expect(mocks.preview).toHaveBeenCalledTimes(2));
  expect(mocks.preview).toHaveBeenLastCalledWith(
    rule,
    [rule.actions[0]],
    expect.any(AbortSignal),
    expect.any(Function),
  );
});

it("keeps the batch control disabled for legacy choice-only reviews and reviews without tag actions", () => {
  const { rerender } = mount({
    ...review,
    actions: [],
    occurrence: { ...review.occurrence, tagIds: [21, 22] },
  });
  expect(openButton()).toBeDisabled();
  rerender(
    <BatchOccurrenceDialog
      review={{
        ...review,
        actions: [{ id: "x", label: "Absent", steps: [{ mode: "MARK_ABSENT", tagIds: [21] }] }],
      }}
      disabled={false}
      onOpen={() => {}}
      onClose={() => {}}
      onWrite={() => {}}
    />,
  );
  expect(openButton()).toBeDisabled();
});

it("blocks closing during a run, then closing discards the results and their undo", async () => {
  let finish!: () => void;
  mocks.run.mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );
  batch.entries = [entry(video, [], false)];
  const callbacks = mount();
  await preview();
  fireEvent.click(button("Apply to 1 occurrence"));
  expect(screen.getByRole("heading", { name: "Applying answers…" })).toBeInTheDocument();
  expect(button("Close")).toBeDisabled();
  expect(button("Close dialog")).toBeDisabled();
  expect(button("New batch")).toBeDisabled();
  fireEvent.click(button("Cancel run"));
  expect(mocks.run.mock.calls[0][2]()).toBe(true);
  batch.entries[0].status = "changed";
  batch.entries[0].operation = recorded(batch.entries[0]);
  finish();
  await screen.findByText(/Stopped after in-flight operations settled/);
  expect(screen.getByRole("heading", { name: "Stopped" })).toBeInTheDocument();
  expect(button("Undo batch")).toBeEnabled();
  fireEvent.click(button("Close"));
  expect(callbacks.onClose).toHaveBeenCalledWith(true);
  expect(
    screen.queryByRole("dialog", { name: "Apply to all matching occurrences" }),
  ).not.toBeInTheDocument();
  fireEvent.click(openButton());
  expect(step("Answers")).toHaveAttribute("aria-current", "step");
  expect(screen.queryByText(/Stopped after in-flight operations settled/)).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Undo batch" })).not.toBeInTheDocument();
  expect(checkbox("Answer")).not.toBeChecked();
});

it("shows progress, continues remaining occurrences, retries only failures with a known outcome, and reports undo conflicts", async () => {
  batch.entries = [
    entry(video, [], false),
    entry({ ...video, id: 2 }, [], false),
    entry({ ...video, id: 3 }, [], false),
    entry({ ...video, id: 4 }, [], false),
  ];
  const [done, failed, unknown, remaining] = batch.entries;
  mocks.run.mockImplementationOnce(
    async (_batch: OccurrenceBatch, _replace: boolean, _cancelled: () => boolean, update: () => void) => {
      done.status = "changed";
      done.operation = recorded(done);
      update();
      failed.status = "failed";
      failed.error = "Request failed.";
      update();
      unknown.status = "failed";
      unknown.error = "The previous write could not be verified.";
      unknown.unverified = true;
      update();
    },
  );
  mount();
  await preview();
  fireEvent.click(button("Apply to 4 occurrences"));
  await screen.findByText(/Batch finished/);
  expect(screen.getByRole("heading", { name: "Finished" })).toBeInTheDocument();
  expect(screen.getByText("3 of 4 processed")).toBeInTheDocument();
  expect(screen.getByRole("progressbar", { name: "Batch progress" })).toHaveAttribute(
    "aria-valuenow",
    "3",
  );
  for (const name of ["1 Changed", "0 Unchanged", "0 Skipped", "2 Failed", "1 Remaining"])
    expect(button(name)).toBeInTheDocument();
  expect(screen.getByText("1 failed: Request failed.")).toBeInTheDocument();
  expect(screen.getByText("1 failed: The previous write could not be verified.")).toBeInTheDocument();
  fireEvent.click(button("2 Failed"));
  const failures = within(screen.getByRole("region", { name: "Failed occurrences" }));
  expect(failures.getAllByRole("link")).toHaveLength(2);
  expect(failures.getByText("Request failed.")).toBeInTheDocument();
  // Retry: only the failure whose outcome is known goes again.
  mocks.run.mockImplementationOnce(
    async (_batch: OccurrenceBatch, _replace: boolean, _cancelled: () => boolean, update: () => void) => {
      failed.status = "changed";
      failed.error = undefined;
      failed.operation = recorded(failed);
      update();
      update();
    },
  );
  fireEvent.click(button("Retry failed"));
  await waitFor(() =>
    expect(mocks.run).toHaveBeenLastCalledWith(
      batch,
      false,
      expect.any(Function),
      expect.any(Function),
      true,
    ),
  );
  await waitFor(() => expect(screen.getByText("2 of 2 processed")).toBeInTheDocument());
  expect(screen.queryByRole("button", { name: "Retry failed" })).not.toBeInTheDocument();
  // Continue: the remaining occurrence.
  mocks.run.mockImplementationOnce(
    async (_batch: OccurrenceBatch, _replace: boolean, _cancelled: () => boolean, update: () => void) => {
      remaining.status = "unchanged";
      update();
    },
  );
  fireEvent.click(button("Continue"));
  // A run counts the whole batch, as the results do.
  await waitFor(() => expect(screen.getByText("4 of 4 processed")).toBeInTheDocument());
  expect(mocks.run).toHaveBeenLastCalledWith(
    batch,
    false,
    expect.any(Function),
    expect.any(Function),
    false,
  );
  expect(screen.queryByRole("button", { name: "Continue" })).not.toBeInTheDocument();
  expect(screen.getByText(/Undo reverses these 2 changes and keeps later edits/)).toBeInTheDocument();
  // Undo: one change is restored, the other conflicts and stays recorded.
  const conflict =
    "Undo stopped: Undo conflict: affected tags changed since this operation. Inspect the item; no undo changes were made.";
  mocks.undo.mockImplementationOnce(
    async (_batch: OccurrenceBatch, _cancelled: () => boolean, update: () => void) => {
      done.status = "unchanged";
      done.operation = undefined;
      update();
      failed.status = "failed";
      failed.error = conflict;
      update();
    },
  );
  fireEvent.click(button("Undo batch"));
  await screen.findByText("Batch undo finished. Inspect any failures below.");
  expect(screen.getByRole("heading", { name: "Undo finished" })).toBeInTheDocument();
  expect(screen.getByText("2 of 2 processed")).toBeInTheDocument();
  expect(screen.getByText(`1 failed: ${conflict}`)).toBeInTheDocument();
  expect(screen.getByText("Restored 1 of 2 changes.")).toBeInTheDocument();
  expect(button("Undo batch")).toBeEnabled();
  expect(
    screen.getByText(/1 change could not be undone; undo again once their conflicts are resolved/),
  ).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Retry failed" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Continue" })).not.toBeInTheDocument();
});

it("reports a run that stops on an unexpected error as stopped, keeping the rest to continue", async () => {
  batch.entries = [entry(video, [], false), entry({ ...video, id: 2 }, [], false)];
  mocks.run.mockImplementationOnce(
    async (_batch: OccurrenceBatch, _replace: boolean, _cancelled: () => boolean, update: () => void) => {
      batch.entries[0].status = "changed";
      batch.entries[0].operation = recorded(batch.entries[0]);
      update();
      throw new Error("Connection lost");
    },
  );
  mount();
  await preview();
  fireEvent.click(button("Apply to 2 occurrences"));
  expect(await screen.findByRole("alert")).toHaveTextContent("Connection lost");
  expect(screen.getByRole("heading", { name: "Stopped" })).toBeInTheDocument();
  expect(screen.getByText("1 of 2 processed")).toBeInTheDocument();
  expect(button("Continue")).toBeEnabled();
  expect(button("Undo batch")).toBeEnabled();
  expect(button("Close")).toBeEnabled();
});

it("invalidates an unapplied preview after closing and changing scope", async () => {
  const { rerender, onOpen, onClose, onWrite } = mount();
  await preview();
  fireEvent.click(button("Close"));
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
  expect(step("Answers")).toHaveAttribute("aria-current", "step");
  expect(screen.queryByRole("button", { name: /^Apply to/ })).not.toBeInTheDocument();
  expect(button("Preview all matches")).toBeDisabled();
});

it("starts a new batch at once, dropping the results without a confirmation", async () => {
  const { rerender, onOpen, onClose, onWrite } = mount();
  await preview();
  fireEvent.click(button("Replace it"));
  fireEvent.click(button("Apply to 1 occurrence"));
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
  expect(step("Run")).toHaveAttribute("aria-current", "step");
  expect(button("1 Remaining")).toBeInTheDocument();
  fireEvent.click(button("New batch"));
  expect(screen.queryByRole("group", { name: "Discard batch results" })).not.toBeInTheDocument();
  expect(step("Answers")).toHaveAttribute("aria-current", "step");
  expect(screen.queryByRole("button", { name: "1 Remaining" })).not.toBeInTheDocument();
  expect(
    within(screen.getByRole("group", { name: "Batch scope" })).getByText("All performers"),
  ).toBeInTheDocument();
  expect(checkbox("New answer")).not.toBeChecked();
  fireEvent.click(checkbox("New answer"));
  fireEvent.click(button("Preview all matches"));
  // A fresh preview waits out Cove's one-second query cache after the writes.
  await screen.findByText("Preview ready. No tags have been changed.", {}, { timeout: 3000 });
  expect(mocks.preview).toHaveBeenLastCalledWith(
    next,
    next.actions,
    expect.any(AbortSignal),
    expect.any(Function),
  );
  // The conflict choice starts over at keeping their answer.
  expect(button("Keep their answer")).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(button("Close"));
  expect(onClose).toHaveBeenCalledWith(true);
});

it("reads only the names of the performers it shows, and cancels the reads on close", async () => {
  const rule: OccurrenceReview = {
    ...review,
    occurrence: {
      ...review.occurrence,
      performerIds: Array.from({ length: 30 }, (_, index) => index + 100),
    },
  };
  let active = 0,
    max = 0,
    aborted = 0;
  mocks.request.mockImplementation(async (path: string, options: RequestInit) => {
    if (!path.startsWith("/api/performers/")) return { name: "Tag" };
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
  });
  const { onClose } = mount(rule);
  fireEvent.click(openButton());
  await waitFor(() => expect(active).toBe(5));
  const scope = within(screen.getByRole("group", { name: "Batch scope" }));
  expect(scope.getByText("25 more performers")).toBeInTheDocument();
  fireEvent.click(button("Close"));
  expect(onClose).toHaveBeenCalledWith(false);
  await waitFor(() => expect(aborted).toBe(5));
  expect(max).toBe(5);
  expect(mocks.preview).not.toHaveBeenCalled();
});

it("cancels a preview in flight and offers to preview again", async () => {
  mocks.preview.mockImplementation(
    (_rule: OccurrenceReview, _actions: unknown, signal: AbortSignal) =>
      new Promise((_, reject) =>
        signal.addEventListener("abort", () => reject(signal.reason), { once: true }),
      ),
  );
  mount();
  fireEvent.click(openButton());
  fireEvent.click(checkbox("Answer"));
  fireEvent.click(button("Preview all matches"));
  expect(await screen.findByText("Loading all matching occurrences…")).toBeInTheDocument();
  expect(button("Close")).toBeDisabled();
  expect(button("Back")).toBeDisabled();
  fireEvent.click(button("Cancel preview"));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Preview cancelled. No tags were changed.",
  );
  expect(button("Close")).toBeEnabled();
  // Only refused answers need changing; a cancelled (or failed) preview can simply run again.
  expect(screen.queryByRole("button", { name: "Change answers" })).not.toBeInTheDocument();
  mocks.preview.mockImplementation(async () => batch);
  fireEvent.click(button("Preview again"));
  await screen.findByText("Preview ready. No tags have been changed.");
  expect(mocks.run).not.toHaveBeenCalled();
});

it("refuses two answers for one category and keeps the refusal in view until the answers change", async () => {
  const rule: OccurrenceReview = {
    ...review,
    actions: [
      review.actions[0],
      { id: "b", label: "Second answer", steps: [{ mode: "ADD", tagIds: [23] }] },
    ],
  };
  const refusal = "Answer and Second answer answer the same condition tag, Size. Choose one of them.";
  mocks.preview.mockRejectedValue(new ConflictingAnswersError(refusal));
  mount(rule);
  fireEvent.click(openButton());
  fireEvent.click(checkbox("Answer"));
  fireEvent.click(checkbox("Second answer"));
  fireEvent.click(button("Preview all matches"));
  expect(await screen.findByRole("alert")).toHaveTextContent(refusal);
  expect(step("Preview")).toHaveAttribute("aria-current", "step");
  expect(screen.queryByRole("button", { name: /^Apply to/ })).not.toBeInTheDocument();
  // Previewing the same answers again cannot help: the primary button goes back to them instead.
  expect(screen.queryByRole("button", { name: "Preview again" })).not.toBeInTheDocument();
  expect(button("Change answers")).toHaveClass("primary");
  fireEvent.click(button("Change answers"));
  expect(step("Answers")).toHaveAttribute("aria-current", "step");
  expect(screen.getByRole("alert")).toHaveTextContent(refusal);
  // The same answers are refused again; the answers card's Change goes back to them as well.
  fireEvent.click(button("Preview all matches"));
  await waitFor(() => expect(mocks.preview).toHaveBeenCalledTimes(2));
  expect(await screen.findByRole("button", { name: "Change answers" })).toBeInTheDocument();
  fireEvent.click(button("Change"));
  expect(step("Answers")).toHaveAttribute("aria-current", "step");
  fireEvent.click(checkbox("Second answer"));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  // Answers that can be previewed leave the refusal's button behind.
  mocks.preview.mockImplementation(async () => batch);
  fireEvent.click(button("Preview all matches"));
  await screen.findByText("Preview ready. No tags have been changed.");
  expect(screen.queryByRole("button", { name: "Change answers" })).not.toBeInTheDocument();
});

it("offers Preview again, not Change answers, when a preview fails for another reason", async () => {
  mocks.preview.mockRejectedValueOnce(new Error("The server did not answer."));
  mount();
  fireEvent.click(openButton());
  fireEvent.click(checkbox("Answer"));
  fireEvent.click(button("Preview all matches"));
  expect(await screen.findByRole("alert")).toHaveTextContent("The server did not answer.");
  expect(screen.queryByRole("button", { name: "Change answers" })).not.toBeInTheDocument();
  fireEvent.click(button("Preview again"));
  await screen.findByText("Preview ready. No tags have been changed.");
});

it("shows the dates of the batch with links to the earliest and latest, and to both from a flag", async () => {
  batch.entries = [
    entry({ ...video, id: 2, date: "2021-02-03", title: "Late" }, [], false),
    entry(video, [], false),
    entry({ ...video, id: 3, date: undefined as unknown as string }, [], false),
  ];
  mount(review, [wholeFlag("Changed")]);
  await preview();
  expect(screen.getByText("Dates 2019-05-01 to 2021-02-03")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Open earliest video, 2019-05-01" })).toHaveAttribute(
    "href",
    "/video/1",
  );
  expect(screen.getByRole("link", { name: "Open latest video, 2021-02-03" })).toHaveAttribute(
    "href",
    "/video/2",
  );
  expect(screen.getByText("1 without a date")).toBeInTheDocument();
  const flag = within(screen.getByRole("note"));
  expect(flag.getByRole("link", { name: "Earliest · Scene · 2019-05-01" })).toHaveAttribute(
    "href",
    "/video/1",
  );
  expect(flag.getByRole("link", { name: "Latest · Late · 2021-02-03" })).toHaveAttribute(
    "href",
    "/video/2",
  );
});

it("warns about a flagged performer while the answers are chosen and shows their existing answers once", async () => {
  mocks.answers.mockResolvedValue({
    answered: 2,
    groups: [
      {
        id: 30,
        name: "Size",
        tags: [
          { id: 31, name: "Small", count: 1 },
          { id: 32, name: "Medium", count: 1 },
        ],
      },
    ],
  });
  mount(review, [wholeFlag("Changed")]);
  fireEvent.click(openButton());
  const flag = screen.getByRole("note");
  await waitFor(() =>
    expect(flag).toHaveTextContent(
      "Target performer is flagged: Changed. Check the earliest and latest videos before applying, or narrow the batch with a date filter.",
    ),
  );
  // Links to the earliest and latest come with the preview.
  expect(within(flag).queryByRole("link")).not.toBeInTheDocument();
  const answers = within(screen.getByRole("region", { name: "Existing answers" }));
  expect(await answers.findByText("2 videos answered")).toBeInTheDocument();
  expect(answers.getByRole("list", { name: "Size" })).toHaveTextContent("Small1, 1 video");
  // Nothing says Size takes one answer: its counts show without Mixed.
  expect(answers.queryByText("Mixed")).toBeNull();
  fireEvent.click(checkbox("Answer"));
  fireEvent.click(button("Preview all matches"));
  await screen.findByText("Preview ready. No tags have been changed.");
  expect(
    within(screen.getByRole("region", { name: "Existing answers" })).getByRole("list", {
      name: "Size",
    }),
  ).toHaveTextContent("Medium1, 1 video");
  expect(mocks.answers).toHaveBeenCalledTimes(1);
});

describe("category attention", () => {
  // Round (shape) and Red (colour): the performer is flagged for Shape and may have mixed answers.
  const shaped: OccurrenceReview = {
    ...review,
    actions: [
      { id: "round", label: "Round", steps: [{ mode: "ADD", tagIds: [11] }] },
      { id: "red", label: "Red", steps: [{ mode: "ADD", tagIds: [21] }] },
      { id: "plain", label: "Plain", group: "Finish", steps: [{ mode: "ADD", tagIds: [31] }] },
      { id: "shiny", label: "Shiny", group: "Finish", steps: [{ mode: "ADD", tagIds: [32] }] },
    ],
  };
  const shape: AttentionEntry = {
    key: "tag:10",
    name: "Shape",
    tagIds: [10, 11, 12],
    flags: ["Shape changed"],
    mixed: [],
  };
  const note = () => screen.queryByRole("note");
  beforeEach(() => {
    mocks.answers.mockResolvedValue({
      answered: 3,
      groups: [
        { id: 10, name: "Shape", members: [10, 11, 12], tags: [{ id: 11, name: "Round", count: 2 }] },
        { id: 20, name: "Colour", members: [20, 21, 22], tags: [{ id: 21, name: "Red", count: 2 }] },
        {
          id: null,
          name: "Other review tags",
          members: [31, 32],
          tags: [
            { id: 31, name: "Plain", count: 2 },
            { id: 32, name: "Shiny", count: 1 },
          ],
        },
      ],
    });
  });

  it("warns only once the chosen answers touch a flagged category, and keeps the date links", async () => {
    batch.entries = [
      entry({ ...video, id: 2, date: "2021-02-03", title: "Late" }, [], false),
      entry(video, [], false),
    ];
    mount(shaped, [shape]);
    fireEvent.click(openButton());
    await screen.findByText("3 videos answered");
    expect(note()).toBeNull();
    fireEvent.click(checkbox("Red"));
    expect(note()).toBeNull();
    fireEvent.click(checkbox("Round"));
    expect(note()).toHaveTextContent(
      "Target performer needs attention where the chosen answers apply. Check the earliest and latest videos before applying, or narrow the batch with a date filter.",
    );
    expect(within(note()!).getByRole("list", { name: "Needs attention" })).toHaveTextContent(
      "Shape: Flagged: Shape changed",
    );
    // Beside the answers, not above them, so ticking never moves them; announced politely.
    const answersField = screen.getByRole("group", { name: "Answers" });
    expect(
      answersField.compareDocumentPosition(note()!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(answersField.contains(note())).toBe(false);
    const live = note()!.closest('[aria-live="polite"]')!;
    expect(live).not.toBeNull();
    fireEvent.click(checkbox("Round"));
    expect(note()).toBeNull();
    // The live region stays, empty, for the next warning.
    expect(live).toBeInTheDocument();
    fireEvent.click(checkbox("Round"));
    fireEvent.click(button("Preview all matches"));
    await screen.findByText("Preview ready. No tags have been changed.");
    const links = within(note()!);
    expect(links.getByRole("link", { name: "Earliest · Scene · 2019-05-01" })).toHaveAttribute(
      "href",
      "/video/1",
    );
    expect(links.getByRole("link", { name: "Latest · Late · 2021-02-03" })).toBeInTheDocument();
  });

  it("warns where the focused performer's answers are mixed, an answer group included", async () => {
    mount(shaped, []);
    fireEvent.click(openButton());
    await screen.findByText("3 videos answered");
    fireEvent.click(checkbox("Round"));
    expect(note()).toBeNull();
    fireEvent.click(checkbox("Shiny"));
    expect(within(note()!).getByRole("list", { name: "Needs attention" })).toHaveTextContent(
      "Finish: Mixed: Plain 2 · Shiny 1",
    );
    // The group has a row of its own among the existing answers, with its Mixed badge.
    const answers = within(screen.getByRole("region", { name: "Existing answers" }));
    expect(answers.getByRole("list", { name: "Finish" })).toHaveTextContent("Plain2, 2 videos");
    expect(answers.getAllByText("Mixed")).toHaveLength(1);
    expect(answers.getByText("Mixed")).toHaveTextContent(/^Mixed$/);
    expect(answers.getByText("Mixed")).toHaveAttribute(
      "title",
      "This performer has different answers in this group.",
    );
  });

  it("marks the flagged category among the existing answers", async () => {
    mount(shaped, [shape]);
    fireEvent.click(openButton());
    const answers = within(screen.getByRole("region", { name: "Existing answers" }));
    const flag = await answers.findByTitle("Flagged: Shape changed");
    expect(flag.closest(".dq-answer-group")).toHaveTextContent("Shape");
    expect(flag).toHaveTextContent("Flagged: Shape changed");
    expect(answers.getAllByTitle(/^Flagged/)).toHaveLength(1);
  });

  it("warns about neither flags nor mixed answers without a focused performer", async () => {
    mount(shaped);
    fireEvent.click(openButton());
    await screen.findByText("3 videos answered");
    fireEvent.click(checkbox("Round"));
    fireEvent.click(checkbox("Shiny"));
    expect(note()).toBeNull();
    // The existing answers still show where they differ.
    expect(
      within(screen.getByRole("region", { name: "Existing answers" })).getByText("Mixed"),
    ).toBeInTheDocument();
  });

  it("lists a whole-review flag with the categories once the list is needed", async () => {
    mount(shaped, [wholeFlag("Changed"), shape]);
    fireEvent.click(openButton());
    // Flags for the whole review read as they always have, above the answers from the start.
    await waitFor(() =>
      expect(note()).toHaveTextContent("Target performer is flagged: Changed."),
    );
    fireEvent.click(checkbox("Round"));
    const [top, side] = screen.getAllByRole("note");
    expect(top).toHaveTextContent("Target performer is flagged: Changed.");
    expect(within(side).getByRole("list", { name: "Needs attention" })).toHaveTextContent(
      "Shape: Flagged: Shape changed",
    );
    // What to check is said once, above.
    expect(side).toHaveTextContent("Target performer needs attention where the chosen answers apply.");
    expect(side).not.toHaveTextContent("Check the earliest");
    // The preview's warning holds both, with the earliest and latest items.
    fireEvent.click(button("Preview all matches"));
    await screen.findByText("Preview ready. No tags have been changed.");
    const list = within(note()!).getByRole("list", { name: "Needs attention" });
    expect(within(list).getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "Whole review: Flagged: Changed",
      "Shape: Flagged: Shape changed",
    ]);
  });

  describe("only in categories that take one answer", () => {
    const round = { id: "round", label: "Round", steps: [{ mode: "ADD" as const, tagIds: [11] }] };
    const existing = () => within(screen.getByRole("region", { name: "Existing answers" }));
    beforeEach(() => {
      mocks.answers.mockResolvedValue({
        answered: 4,
        groups: [
          {
            id: 10,
            name: "Shape",
            members: [10, 11, 12, 13],
            tags: [
              { id: 11, name: "Round", count: 2 },
              { id: 13, name: "Striped", count: 2 },
              { id: 12, name: "Square", count: 1 },
            ],
          },
        ],
      });
    });

    it("counts a condition category holding several answers without Mixed or a warning", async () => {
      mount({ ...review, actions: [round] }, []);
      fireEvent.click(openButton());
      await screen.findByText("4 videos answered");
      expect(existing().getByRole("list", { name: "Shape" })).toHaveTextContent("Square1, 1 video");
      expect(existing().queryByText("Mixed")).toBeNull();
      fireEvent.click(checkbox("Round"));
      expect(note()).toBeNull();
    });

    it("warns where an only-one answer covers the category from a tree above it", async () => {
      const onlyOne = {
        ...round,
        steps: [...round.steps, { mode: "REMOVE_TREE" as const, tagIds: [1] }],
      };
      mount({ ...review, actions: [onlyOne] }, [], new Map([[1, [1, 10, 11, 12, 13]]]));
      fireEvent.click(openButton());
      await screen.findByText("4 videos answered");
      expect(existing().getByText("Mixed")).toHaveAttribute(
        "title",
        "This performer has different answers in this category.",
      );
      fireEvent.click(checkbox("Round"));
      expect(within(note()!).getByRole("list", { name: "Needs attention" })).toHaveTextContent(
        "Shape: Mixed: Round 2 · Striped 2 · Square 1",
      );
    });

    it("marks the category where an answer group inside it is mixed, and warns for its answers", async () => {
      mount(
        {
          ...review,
          actions: [
            { ...round, group: "Form" },
            { id: "square", label: "Square", group: "Form", steps: [{ mode: "ADD", tagIds: [12] }] },
            { id: "striped", label: "Striped", steps: [{ mode: "ADD", tagIds: [13] }] },
          ],
        },
        [],
      );
      fireEvent.click(openButton());
      await screen.findByText("4 videos answered");
      // The group shows inside Shape, whose row carries its Mixed badge naming the group, in
      // words that every reader gets, not in the tooltip alone.
      expect(existing().queryByRole("list", { name: "Form" })).toBeNull();
      const mixed = existing().getByText("Mixed");
      expect(mixed.closest(".dq-answer-group")).toHaveTextContent("Shape");
      expect(mixed).toHaveTextContent(/^Mixed in Form$/);
      expect(mixed).toHaveAttribute("title", "This performer has different answers in Form.");
      // Another answer in Shape is not part of the mix.
      fireEvent.click(checkbox("Striped"));
      expect(note()).toBeNull();
      fireEvent.click(checkbox("Square"));
      expect(within(note()!).getByRole("list", { name: "Needs attention" })).toHaveTextContent(
        "Form: Mixed: Round 2 · Square 1",
      );
    });
  });
});

it("waits out Cove's query cache before previewing again after a run, and refreshes existing answers", async () => {
  let ranAt = 0;
  mocks.run.mockImplementation(async () => {
    ranAt = Date.now();
  });
  mount();
  await preview();
  const before = mocks.answers.mock.calls.length;
  fireEvent.click(button("Replace it"));
  fireEvent.click(button("Apply to 1 occurrence"));
  await screen.findByText(/Batch finished/);
  await waitFor(() => expect(mocks.answers.mock.calls.length).toBeGreaterThan(before));
  fireEvent.click(button("New batch"));
  fireEvent.click(checkbox("Answer"));
  let previewedAt = 0;
  mocks.preview.mockImplementation(async () => {
    previewedAt = Date.now();
    return batch;
  });
  fireEvent.click(button("Preview all matches"));
  await screen.findByText("Preview ready. No tags have been changed.", {}, { timeout: 3000 });
  // Measured from when the run itself ended, so a slow machine cannot make it pass or fail.
  expect(previewedAt - ranAt).toBeGreaterThanOrEqual(1090);
});

it("keeps answers that a category already holds, and replaces them when chosen", async () => {
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
    path.includes("performers")
      ? { name: "Target performer" }
      : { name: path.endsWith("32") ? "Medium" : "Size" },
  );
  const rule: OccurrenceReview = {
    ...review,
    actions: [batch.action],
    occurrence: { ...review.occurrence, condition: "excludesAll", conditionTagIds: [30] },
  };
  batch.review = structuredClone(rule);
  mount(rule);
  await preview();
  const scope = within(screen.getByRole("group", { name: "Batch scope" }));
  expect(scope.getByText("Missing any of")).toBeInTheDocument();
  expect(scope.getByText("Size")).toBeInTheDocument();
  expect(scope.getByText("Include subtags")).toBeInTheDocument();
  expect(scope.getByText("Hides confirmed absent")).toBeInTheDocument();
  expect(button("0 will change")).toBeInTheDocument();
  fireEvent.click(button("1 keep a different answer"));
  const list = within(screen.getByRole("region", { name: "Occurrences with a different answer" }));
  expect(list.getByText(/Keeps/).textContent).toBe("Keeps Small instead of Medium");
  expect(screen.getByText(/each condition tag with its subtags/)).toBeInTheDocument();
  fireEvent.click(button("Replace it"));
  expect(button("1 will change")).toBeInTheDocument();
  expect(list.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
    "+ Medium",
    "− Small",
  ]);
  expect(
    within(screen.getByRole("list", { name: "Tag changes" }))
      .getAllByRole("listitem")
      .map((item) => item.textContent),
  ).toEqual(["+ Medium", "− Small"]);
  expect(
    mocks.request.mock.calls
      .map(([path]) => String(path))
      .filter((path) => path.startsWith("/api/tags/"))
      .sort(),
  ).toEqual(["/api/tags/30", "/api/tags/32"]);
});

it("hands custom-field criteria to Cove's own toolbar section with resolved tag labels", async () => {
  const scoped = {
    ...review,
    view: {
      ...review.view,
      filter: { ...review.view.filter, q: "needle" },
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
  mount(scoped);
  fireEvent.click(openButton());
  const scope = within(screen.getByRole("group", { name: "Batch scope" }));
  expect(scope.getByText("Search “needle”")).toBeInTheDocument();
  const summary = within(screen.getByRole("group", { name: "Batch scene filters" }));
  expect(summary.getByRole("toolbar", { name: "Video list controls" })).toHaveAttribute(
    "data-custom-field-entity-type",
    "video",
  );
  expect(mocks.request.mock.calls.map((call) => String(call[0]))).toContain("/api/tags/21");
  await waitFor(() =>
    expect(summary.getByRole("toolbar", { name: "Video list controls" })).toHaveAttribute(
      "data-object-filter",
      expect.stringContaining('"displayValue":"Answer"'),
    ),
  );
});

it("batches audio occurrences with audio labels and links", async () => {
  const rule: OccurrenceReview = { ...review, entityType: "audioPerformerOccurrence" };
  batch.review = structuredClone(rule);
  // Without a title, an item is named by its file, as in the queue.
  batch.entries = [
    entry({ ...video, title: "", files: [{ basename: "take.mp3" }] as never[] }, [], false),
  ];
  mount(rule);
  await preview();
  expect(button("1 matching occurrence in 1 audio")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Open earliest audio, 2019-05-01" })).toHaveAttribute(
    "href",
    "/audio/1",
  );
  fireEvent.click(button("1 will change"));
  expect(
    within(screen.getByRole("region", { name: "Occurrences that will change" })).getByRole("link", {
      name: "Target performer — take.mp3",
    }),
  ).toHaveAttribute("href", "/audio/1");
});

it("lists at most the first 250 occurrences behind a count", async () => {
  batch.entries = Array.from({ length: 300 }, (_, index) =>
    entry({ ...video, id: index + 1 }, [], false),
  );
  mount();
  await preview();
  const matching = button("300 matching occurrences in 300 scenes");
  fireEvent.click(matching);
  const list = within(screen.getByRole("region", { name: "Matching occurrences" }));
  expect(list.getByText("First 250 of 300")).toBeInTheDocument();
  expect(list.getAllByRole("link")).toHaveLength(250);
  fireEvent.click(matching);
  expect(screen.queryByRole("region", { name: "Matching occurrences" })).not.toBeInTheDocument();
});

it("keeps focus inside the dialog as the steps change", async () => {
  batch.entries = [entry(video, [], false)];
  mount();
  fireEvent.click(openButton());
  await waitFor(() => expect(checkbox("Answer")).toHaveFocus());
  fireEvent.click(checkbox("Answer"));
  fireEvent.click(button("Preview all matches"));
  await screen.findByText("Preview ready. No tags have been changed.");
  await waitFor(() => expect(screen.getByRole("group", { name: "Preview step" })).toHaveFocus());
  const apply = button("Apply to 1 occurrence");
  apply.focus();
  fireEvent.click(apply);
  await waitFor(() => expect(screen.getByRole("heading", { name: "Finished" })).toHaveFocus());
  const newBatch = button("New batch");
  newBatch.focus();
  fireEvent.click(newBatch);
  await waitFor(() => expect(checkbox("Answer")).toHaveFocus());
});

type RunMock = (
  batch: OccurrenceBatch,
  replace: boolean,
  cancelled: () => boolean,
  update: () => void,
) => Promise<void>;

it("never turns a focused Cancel preview into Apply when the preview lands", async () => {
  let finish!: (value: OccurrenceBatch) => void;
  mocks.preview.mockImplementation(
    () =>
      new Promise<OccurrenceBatch>((resolve) => {
        finish = resolve;
      }),
  );
  batch.entries = [entry(video, [], false)];
  mount();
  fireEvent.click(openButton());
  fireEvent.click(checkbox("Answer"));
  fireEvent.click(button("Preview all matches"));
  const cancelButton = await screen.findByRole("button", { name: "Cancel preview" });
  await waitFor(() => expect(mocks.preview).toHaveBeenCalled());
  cancelButton.focus();
  act(() => finish(batch));
  const apply = await screen.findByRole("button", { name: "Apply to 1 occurrence" });
  expect(apply).not.toBe(cancelButton);
  expect(apply).not.toHaveFocus();
  await waitFor(() => expect(screen.getByRole("group", { name: "Preview step" })).toHaveFocus());
  expect(mocks.run).not.toHaveBeenCalled();
});

it("lists the occurrences behind one reason, keeping focus on its toggle", async () => {
  batch.entries = [
    entry(video, [], false),
    entry({ ...video, id: 2 }, [], false),
    entry({ ...video, id: 3 }, [], false),
  ];
  const [kept, moved, done] = batch.entries;
  const keptReason = "Kept the existing answer in each category it would fill.";
  mocks.run.mockImplementationOnce((async (_batch, _replace, _cancelled, update) => {
    kept.status = "skipped";
    kept.error = keptReason;
    update();
    moved.status = "skipped";
    moved.error = "Affected tags changed since preview.";
    update();
    done.status = "changed";
    done.operation = recorded(done);
    update();
  }) as RunMock);
  mount();
  await preview();
  fireEvent.click(button("Apply to 3 occurrences"));
  await screen.findByText(/Batch finished/);
  const toggles = screen.getAllByRole("button", { name: "Show them" });
  expect(toggles).toHaveLength(2);
  toggles[0].focus();
  fireEvent.click(toggles[0]);
  expect(toggles[0]).toHaveFocus();
  expect(toggles[0]).toHaveTextContent("Hide them");
  expect(toggles[0]).toHaveAttribute("aria-expanded", "true");
  const list = within(screen.getByRole("region", { name: `Skipped: ${keptReason}` }));
  expect(list.getAllByRole("link")).toHaveLength(1);
  // The count lists every skipped occurrence, whatever the reason.
  fireEvent.click(button("2 Skipped"));
  expect(
    within(screen.getByRole("region", { name: "Skipped occurrences" })).getAllByRole("link"),
  ).toHaveLength(2);
  expect(toggles[0]).toHaveTextContent("Show them");
  fireEvent.click(button("2 Skipped"));
  expect(screen.queryByRole("region", { name: "Skipped occurrences" })).not.toBeInTheDocument();
});

it("drops a list whose count runs out", async () => {
  batch.entries = [entry(video, [], false)];
  const [only] = batch.entries;
  mocks.run.mockImplementationOnce((async (_batch, _replace, _cancelled, update) => {
    only.status = "failed";
    only.error = "Request failed.";
    update();
  }) as RunMock);
  mocks.run.mockImplementationOnce((async (_batch, _replace, _cancelled, update) => {
    only.status = "changed";
    only.error = undefined;
    only.operation = recorded(only);
    update();
  }) as RunMock);
  mount();
  await preview();
  fireEvent.click(button("Apply to 1 occurrence"));
  await screen.findByText(/Batch finished/);
  fireEvent.click(button("1 Failed"));
  expect(screen.getByRole("region", { name: "Failed occurrences" })).toBeInTheDocument();
  fireEvent.click(button("Retry failed"));
  await waitFor(() => expect(button("0 Failed")).toBeDisabled());
  expect(button("0 Failed")).toHaveAttribute("aria-pressed", "false");
  expect(screen.queryByRole("region", { name: "Failed occurrences" })).not.toBeInTheDocument();
  expect(screen.getByText("Select a count to list its occurrences.")).toBeInTheDocument();
});

it("shows a retry's progress while it runs", async () => {
  batch.entries = [entry(video, [], false), entry({ ...video, id: 2 }, [], false)];
  const [first, second] = batch.entries;
  mocks.run.mockImplementationOnce((async (_batch, _replace, _cancelled, update) => {
    for (const item of [first, second]) {
      item.status = "failed";
      item.error = "Request failed.";
      update();
    }
  }) as RunMock);
  let advance!: () => void;
  let finish!: () => void;
  mocks.run.mockImplementationOnce(((_batch, _replace, _cancelled, update) =>
    new Promise<void>((resolve) => {
      advance = () => {
        first.status = "changed";
        first.error = undefined;
        first.operation = recorded(first);
        update();
      };
      finish = () => {
        second.status = "changed";
        second.error = undefined;
        second.operation = recorded(second);
        update();
        resolve();
      };
    })) as RunMock);
  mount();
  await preview();
  fireEvent.click(button("Apply to 2 occurrences"));
  await screen.findByText(/Batch finished/);
  fireEvent.click(button("Retry failed"));
  expect(screen.getByRole("heading", { name: "Retrying failed occurrences…" })).toBeInTheDocument();
  expect(screen.getByText("0 of 2 processed")).toBeInTheDocument();
  expect(button("Close")).toBeDisabled();
  expect(button("Cancel run")).toBeEnabled();
  act(() => advance());
  expect(screen.getByText("1 of 2 processed")).toBeInTheDocument();
  expect(screen.getByRole("progressbar", { name: "Batch progress" })).toHaveAttribute(
    "aria-valuenow",
    "1",
  );
  act(() => finish());
  expect(await screen.findByRole("heading", { name: "Finished" })).toBeInTheDocument();
  expect(screen.getByText("2 of 2 processed")).toBeInTheDocument();
});

it("stops an undo on request and keeps what it did not undo", async () => {
  batch.entries = [entry(video, [], false), entry({ ...video, id: 2 }, [], false)];
  const [first, second] = batch.entries;
  mocks.run.mockImplementationOnce((async (_batch, _replace, _cancelled, update) => {
    for (const item of [first, second]) {
      item.status = "changed";
      item.operation = recorded(item);
      update();
    }
  }) as RunMock);
  let finishUndo!: () => void;
  mocks.undo.mockImplementationOnce(
    (_batch: OccurrenceBatch, _cancelled: () => boolean, update: () => void) =>
      new Promise<void>((resolve) => {
        finishUndo = () => {
          first.status = "unchanged";
          first.operation = undefined;
          update();
          resolve();
        };
      }),
  );
  mount();
  await preview();
  fireEvent.click(button("Apply to 2 occurrences"));
  await screen.findByText(/Batch finished/);
  fireEvent.click(button("Undo batch"));
  expect(screen.getByRole("heading", { name: "Undoing batch…" })).toBeInTheDocument();
  expect(button("Undo batch")).toBeDisabled();
  expect(screen.getByText(/2 changes are still recorded/)).toBeInTheDocument();
  fireEvent.click(button("Cancel undo"));
  expect(mocks.undo.mock.calls[0][1]()).toBe(true);
  act(() => finishUndo());
  await screen.findByText(/Stopped after in-flight operations settled/);
  expect(screen.getByRole("heading", { name: "Undo stopped" })).toBeInTheDocument();
  expect(screen.getByText("Restored 1 of 2 changes.")).toBeInTheDocument();
  expect(screen.getByText(/1 change is still recorded/)).toBeInTheDocument();
  expect(button("Undo batch")).toBeEnabled();
  expect(screen.queryByRole("button", { name: "Continue" })).not.toBeInTheDocument();
});

it("shows performer criteria with Cove's own chips and reads no performer names", () => {
  mount({
    ...review,
    occurrence: {
      ...review.occurrence,
      targetMode: "filter",
      performerIds: [],
      performerFilter: { tags: { value: [5], modifier: "INCLUDES" } },
    },
  });
  fireEvent.click(openButton());
  const scope = within(screen.getByRole("group", { name: "Batch scope" }));
  expect(scope.getByText("Performer criteria")).toBeInTheDocument();
  expect(
    within(scope.getByRole("group", { name: "Batch performer criteria" })).getByRole("toolbar", {
      name: "Video list controls",
    }),
  ).toHaveAttribute("data-object-filter", expect.stringContaining('"modifier":"INCLUDES"'));
  expect(
    mocks.request.mock.calls.some(([path]) => String(path).startsWith("/api/performers/")),
  ).toBe(false);
});

it("holds a running batch against leaving the page and Esc, and stops it when unmounted", async () => {
  let finish!: () => void;
  mocks.run.mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );
  batch.entries = [entry(video, [], false)];
  const { unmount, onClose } = mount();
  await preview();
  const idle = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(idle);
  expect(idle.defaultPrevented).toBe(false);
  fireEvent.click(button("Apply to 1 occurrence"));
  const leave = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(leave);
  expect(leave.defaultPrevented).toBe(true);
  const dialog = screen.getByRole("dialog", { name: "Apply to all matching occurrences" });
  const esc = new Event("cancel", { cancelable: true });
  act(() => {
    dialog.dispatchEvent(esc);
  });
  expect(esc.defaultPrevented).toBe(true);
  expect(dialog).toBeInTheDocument();
  expect(onClose).not.toHaveBeenCalled();
  const cancelled = mocks.run.mock.calls[0][2] as () => boolean;
  expect(cancelled()).toBe(false);
  unmount();
  expect(cancelled()).toBe(true);
  finish();
});

it("aborts a preview in flight when the page goes away", async () => {
  let signal!: AbortSignal;
  mocks.preview.mockImplementation((_rule: OccurrenceReview, _actions: unknown, given: AbortSignal) => {
    signal = given;
    return new Promise(() => {});
  });
  const { unmount } = mount();
  fireEvent.click(openButton());
  fireEvent.click(checkbox("Answer"));
  fireEvent.click(button("Preview all matches"));
  await waitFor(() => expect(mocks.preview).toHaveBeenCalled());
  unmount();
  expect(signal.aborted).toBe(true);
});

it("keeps a running batch in view when the browser closes the dialog, and otherwise finishes closing", async () => {
  let finish!: () => void;
  mocks.run.mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );
  batch.entries = [entry(video, [], false)];
  const showModal = vi.spyOn(HTMLDialogElement.prototype, "showModal");
  const { onClose } = mount();
  await preview();
  fireEvent.click(button("Apply to 1 occurrence"));
  const dialog = screen.getByRole("dialog", { name: "Apply to all matching occurrences" });
  const shown = showModal.mock.calls.length;
  // Chrome closes a modal on a second Esc without a cancel event the page may refuse.
  dialog.removeAttribute("open");
  act(() => {
    dialog.dispatchEvent(new Event("close"));
  });
  expect(showModal).toHaveBeenCalledTimes(shown + 1);
  expect(dialog).toHaveAttribute("open");
  expect(onClose).not.toHaveBeenCalled();
  act(() => finish());
  await screen.findByText(/Batch finished/);
  dialog.removeAttribute("open");
  act(() => {
    dialog.dispatchEvent(new Event("close"));
  });
  expect(onClose).toHaveBeenCalledWith(true);
  expect(
    screen.queryByRole("dialog", { name: "Apply to all matching occurrences" }),
  ).not.toBeInTheDocument();
});

it("hands focus back to Batch… once the workspace enables it again, unless focus moved on", async () => {
  const callbacks = { onOpen: vi.fn(), onClose: vi.fn(), onWrite: vi.fn() };
  const view = (disabled: boolean) => (
    <BatchOccurrenceDialog review={review} disabled={disabled} {...callbacks} />
  );
  const { rerender } = render(view(false));
  fireEvent.click(openButton());
  // The workspace holds its controls while the dialog is open and while it refreshes after.
  rerender(view(true));
  fireEvent.click(button("Close"));
  await act(() => new Promise((resolve) => requestAnimationFrame(resolve)));
  expect(openButton()).not.toHaveFocus();
  rerender(view(false));
  await waitFor(() => expect(openButton()).toHaveFocus());
  // Once the reviewer is elsewhere, closing again leaves focus there.
  fireEvent.click(openButton());
  rerender(view(true));
  fireEvent.click(button("Close"));
  const elsewhere = document.createElement("button");
  document.body.append(elsewhere);
  elsewhere.focus();
  rerender(view(false));
  await act(() => new Promise((resolve) => requestAnimationFrame(resolve)));
  expect(elsewhere).toHaveFocus();
  elsewhere.remove();
});

it("shows its tags without Cove's image preview, which would open unseen under the modal dialog", async () => {
  mount();
  await preview();
  fireEvent.click(button("1 keep a different answer"));
  const list = screen.getByRole("region", { name: "Occurrences with a different answer" });
  const badges = [...list.querySelectorAll(".tag-badge")];
  expect(badges.map((badge) => badge.textContent)).toEqual(["Answer", "Opposite"]);
  for (const badge of badges) expect(badge).not.toHaveAttribute("data-tag-id");
});

it("keeps a badge's colours without its image preview only where asked", () => {
  const tag = { id: 5, name: "Five", color: "#101010", tagGroupColor: "#202020" };
  render(
    <>
      <ReviewTagBadge tag={tag} />
      <WithoutTagImagePreviews>
        <ReviewTagBadge tag={tag} />
      </WithoutTagImagePreviews>
    </>,
  );
  const [plain, inDialog] = screen.getAllByText("Five");
  expect(plain).toHaveAttribute("data-tag-id", "5");
  expect(inDialog).not.toHaveAttribute("data-tag-id");
  expect(inDialog).toHaveAttribute("data-color", "#101010");
  expect(inDialog).toHaveAttribute("data-group-color", "#202020");
});
