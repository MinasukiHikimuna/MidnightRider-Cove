import { fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { beforeEach, expect, it, vi } from "vitest";
import { draftSignature, EditorDrawer } from "../EditorDrawer";
import type {
  AudioReview,
  OccurrenceReview,
  Review,
  TagReview,
  VideoReview,
} from "../model";

const api = vi.hoisted(() => ({ request: vi.fn() }));
vi.mock("../api", async (original) => ({
  ...(await original<typeof import("../api")>()),
  request: api.request,
}));

beforeEach(() => {
  api.request.mockImplementation(async (path: string) => {
    const id = Number(path.split("/").at(-1));
    return { id, name: `Tag ${id}` };
  });
  Object.defineProperty(window, "requestAnimationFrame", {
    configurable: true,
    value: (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    },
  });
});

const video: VideoReview = {
  id: "video",
  name: "Video review",
  description: "",
  view: {
    filter: { page: 3, perPage: 40 },
    objectFilter: {},
    displayMode: "grid",
    searchMode: "text",
    startFrom: "end",
  },
  actions: [
    { id: "kept", label: "Kept", steps: [{ mode: "ADD", tagIds: [11] }] },
    {
      id: "swapped",
      label: "Swapped",
      steps: [
        { mode: "ADD", tagIds: [12] },
        { mode: "REMOVE_TREE", tagIds: [10] },
      ],
    },
    { id: "absent", label: "Absent", steps: [{ mode: "MARK_ABSENT", tagIds: [13] }] },
  ],
};
const audio: AudioReview = { ...video, id: "audio", entityType: "audio" };
const occurrence: OccurrenceReview = {
  ...video,
  id: "occurrence",
  entityType: "performerOccurrence",
  occurrence: {
    targetMode: "all",
    performerIds: [],
    performerFilter: {},
    condition: "any",
    conditionTagIds: [],
    tagIds: [],
    multiple: true,
  },
};
const tagReview: TagReview = {
  id: "tags",
  entityType: "tag",
  name: "Tag review",
  description: "",
  view: { filter: {}, objectFilter: {}, displayMode: "grid", searchMode: "text" },
  actions: [
    { id: "group", label: "Group", effect: { mode: "SET_TAG_GROUP", tagGroupId: 8 } },
    { id: "gone", label: "Gone", effect: { mode: "SET_TAG_GROUP", tagGroupId: 99 } },
  ],
};

/** The draft the drawer last reported. */
let latest: Review;

function open(
  initial: Review,
  handlers: { onSave?(): void; onCancel?(): void; onDirectionChange?(value: string): void } = {},
) {
  const onSave = vi.fn(handlers.onSave);
  const onCancel = vi.fn(handlers.onCancel);
  const onDirectionChange = vi.fn(handlers.onDirectionChange);
  function Harness() {
    const [draft, setDraft] = useState(initial);
    const [baseline] = useState(() => draftSignature(initial));
    latest = draft;
    return (
      <EditorDrawer
        draft={draft}
        onChange={setDraft}
        direction={draft.view.startFrom ?? "end"}
        onDirectionChange={(startFrom) => {
          onDirectionChange(startFrom);
          setDraft({ ...draft, view: { ...draft.view, startFrom } } as Review);
        }}
        tagGroups={[{ id: 8, name: "Classification", sortOrder: 1, tagCount: 0 }]}
        trees={new Map()}
        saving={false}
        error=""
        dirty={draftSignature(draft) !== baseline}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
  }
  render(<Harness />);
  const drawer = screen.getByRole("dialog", { name: "Edit review" });
  const tab = (name: string) => fireEvent.click(within(drawer).getByRole("tab", { name }));
  return { drawer, tab, onSave, onCancel, onDirectionChange };
}

it("compares drafts as Save would store them, whatever the key order, undefined fields or page", () => {
  const moved = {
    actions: video.actions,
    view: { ...video.view, filter: { perPage: 40, page: 9 }, selectAllOnLoad: undefined },
    description: "",
    name: "Video review",
    id: "video",
  } as VideoReview;
  expect(draftSignature(moved)).toBe(draftSignature(video));
  expect(draftSignature({ ...video, name: "Renamed" })).not.toBe(draftSignature(video));
});

it("shows the tabs that apply to each kind of review", () => {
  const tabs = (review: Review) => {
    const { unmount } = render(
      <EditorDrawer
        draft={review}
        onChange={vi.fn()}
        direction="end"
        onDirectionChange={vi.fn()}
        tagGroups={[]}
        trees={new Map()}
        saving={false}
        error=""
        dirty={false}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    const names = screen.getAllByRole("tab").map((tab) => tab.textContent);
    unmount();
    return names;
  };
  expect(tabs(video)).toEqual(["Review", "Appearance", "Actions"]);
  expect(tabs(tagReview)).toEqual(["Review", "Appearance", "Actions"]);
  // Audio and occurrence reviews show one item at a time: nothing to arrange.
  expect(tabs(audio)).toEqual(["Review", "Actions"]);
  expect(tabs(occurrence)).toEqual(["Review", "Actions"]);
  // Legacy occurrence reviews keep their tag choices.
  expect(tabs({ ...occurrence, occurrence: { ...occurrence.occurrence, tagIds: [31] } })).toEqual(
    ["Review", "Actions", "Tag choices"],
  );
});

it("edits the name, description and direction in the Review tab and says the draft is unsaved", () => {
  const { drawer, onDirectionChange } = open(video);
  const name = within(drawer).getByRole("textbox", { name: "Review name" });
  expect(name).toHaveFocus();
  expect(within(drawer).getByLabelText("Entity type")).toBeDisabled();
  expect(within(drawer).queryByText("Unsaved changes")).not.toBeInTheDocument();
  fireEvent.change(name, { target: { value: "Renamed review" } });
  expect(within(drawer).getByRole("heading", { name: "Renamed review" })).toBeInTheDocument();
  expect(within(drawer).getByText("Unsaved changes")).toBeInTheDocument();
  fireEvent.change(within(drawer).getByLabelText("Description"), {
    target: { value: "What to check" },
  });
  fireEvent.change(within(drawer).getByLabelText("Review direction"), {
    target: { value: "beginning" },
  });
  expect(onDirectionChange).toHaveBeenCalledWith("beginning");
  expect(latest).toMatchObject({
    name: "Renamed review",
    description: "What to check",
    view: { startFrom: "beginning" },
  });
  // Performer flags belong to occurrence reviews.
  expect(within(drawer).queryByPlaceholderText("Search performer flag tags...")).toBeNull();
});

it("exports the draft as a review file", () => {
  const create = vi.fn((_blob: Blob) => "blob:draft");
  Object.defineProperty(URL, "createObjectURL", { configurable: true, value: create });
  Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
  const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
  const { drawer } = open(video);
  fireEvent.click(within(drawer).getByRole("button", { name: "Export draft" }));
  expect(click).toHaveBeenCalled();
  expect(create.mock.calls[0][0].type).toBe("application/json");
});

it("offers performer flags in an occurrence review's Review tab", () => {
  const { drawer } = open(occurrence);
  fireEvent.change(within(drawer).getByPlaceholderText("Search performer flag tags..."), {
    target: { value: "7" },
  });
  expect((latest as OccurrenceReview).occurrence.flagPerformerTagIds).toEqual([7]);
});

it("sets a video review's default layout, grid settings and queue tag bins", () => {
  const { drawer, tab } = open(video);
  tab("Appearance");
  expect(within(drawer).getByRole("radio", { name: "Single video" })).toBeChecked();
  fireEvent.click(within(drawer).getByRole("radio", { name: "Grid" }));
  expect(latest.view.reviewMode).toBe("multiple");
  fireEvent.click(within(drawer).getByRole("button", { name: "Wall" }));
  expect(latest.view.displayMode).toBe("wall");
  expect(within(drawer).getByRole("button", { name: "Wall" })).toHaveAttribute("aria-pressed", "true");
  const selectAll = within(drawer).getByRole("checkbox", { name: "Select every card when a page opens" });
  fireEvent.click(selectAll);
  expect(latest.view.selectAllOnLoad).toBe(true);
  fireEvent.click(selectAll);
  expect(latest.view.selectAllOnLoad).toBeUndefined();
  // Tags on cards only matters once cards show tags.
  expect(within(drawer).queryByRole("textbox", { name: "Add a parent tag for card tags" })).toBeNull();
  fireEvent.click(within(drawer).getByRole("checkbox", { name: "Date" }));
  fireEvent.click(within(drawer).getByRole("checkbox", { name: "Tags" }));
  fireEvent.change(within(drawer).getByRole("textbox", { name: "Add a parent tag for card tags" }), {
    target: { value: "5" },
  });
  fireEvent.change(within(drawer).getByRole("textbox", { name: "Add a parent tag for queue bins" }), {
    target: { value: "6,7" },
  });
  expect((latest as VideoReview).presentation).toEqual({
    annotations: ["date", "tags"],
    annotationParents: [5],
    binParents: [6, 7],
  });
});

it("offers a tag review its card view and select all, and nothing video-only", () => {
  const { drawer, tab } = open(tagReview);
  tab("Appearance");
  expect(within(drawer).queryByRole("radio")).toBeNull();
  expect(within(drawer).queryByRole("checkbox", { name: "Tags" })).toBeNull();
  fireEvent.click(within(drawer).getByRole("button", { name: "List" }));
  expect(latest.view.displayMode).toBe("list");
  fireEvent.click(within(drawer).getByRole("checkbox", { name: "Select every card when a page opens" }));
  expect(latest.view.selectAllOnLoad).toBe(true);
});

it("lists the actions as compact rows with their keys and effects, one open at a time", async () => {
  const { drawer, tab } = open(video);
  tab("Actions");
  const row = (name: string) =>
    within(drawer).getByRole("button", { name: new RegExp(`^(Expand|Collapse) ${name}$`) })
      .closest<HTMLElement>(".dq-action-row")!;
  expect(within(row("Kept")).getByText("q")).toBeInTheDocument();
  expect(within(row("Swapped")).getByText("w")).toBeInTheDocument();
  expect(await within(row("Kept")).findByText("+ Tag 11")).toBeInTheDocument();
  expect(await within(row("Swapped")).findByText("− Tag 10 tree")).toBeInTheDocument();
  expect(await within(row("Absent")).findByText("Mark Tag 13 absent")).toBeInTheDocument();
  expect(within(drawer).queryByRole("textbox", { name: "Button label" })).toBeNull();
  const expandKept = within(drawer).getByRole("button", { name: "Expand Kept" });
  fireEvent.click(expandKept);
  expect(within(drawer).getByRole("button", { name: "Collapse Kept" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  expect(within(drawer).getByRole("textbox", { name: "Button label" })).toHaveValue("Kept");
  // Opening another action closes the first.
  fireEvent.click(within(drawer).getByRole("button", { name: "Expand Swapped" }));
  expect(within(drawer).getAllByRole("textbox", { name: "Button label" })).toHaveLength(1);
  expect(within(drawer).getByRole("textbox", { name: "Button label" })).toHaveValue("Swapped");
  // A click on the name opens or closes a row too.
  fireEvent.click(within(row("Absent")).getByText("Absent"));
  expect(within(drawer).getByRole("textbox", { name: "Button label" })).toHaveValue("Absent");
});

it("edits an open action's label and ordered steps", () => {
  const { drawer, tab } = open(video);
  tab("Actions");
  fireEvent.click(within(drawer).getByRole("button", { name: "Expand Swapped" }));
  fireEvent.change(within(drawer).getByRole("textbox", { name: "Button label" }), {
    target: { value: "Swap" },
  });
  expect(within(drawer).getByRole("button", { name: "Collapse Swap" })).toBeInTheDocument();
  fireEvent.change(within(drawer).getByLabelText("Step 2 operation"), {
    target: { value: "REMOVE" },
  });
  fireEvent.keyDown(within(drawer).getByRole("button", { name: "Reorder step 1" }), {
    key: "ArrowDown",
    altKey: true,
  });
  expect(latest.actions[1]).toMatchObject({
    label: "Swap",
    steps: [
      { mode: "REMOVE", tagIds: [10] },
      { mode: "ADD", tagIds: [12] },
    ],
  });
  fireEvent.click(within(drawer).getByRole("button", { name: "Remove step 1" }));
  // A new step starts as Add tags, with focus in its tag field.
  fireEvent.click(within(drawer).getByRole("button", { name: "Add step" }));
  const tags = within(drawer).getByRole("textbox", { name: "Add a tag to step 2" });
  expect(tags).toHaveFocus();
  expect(within(drawer).getByLabelText("Step 2 operation")).toHaveValue("ADD");
  // Until it has a tag, the row says what is missing.
  expect(within(drawer).getByText("A step has no tags")).toBeInTheDocument();
  fireEvent.change(tags, { target: { value: "14" } });
  expect(within(drawer).queryByText("A step has no tags")).toBeNull();
  expect(latest.actions[1]).toMatchObject({
    steps: [
      { mode: "ADD", tagIds: [12] },
      { mode: "ADD", tagIds: [14] },
    ],
  });
});

it("adds, duplicates, deletes and reorders actions", () => {
  const { drawer, tab } = open(video);
  tab("Actions");
  fireEvent.click(within(drawer).getByRole("button", { name: "Add action" }));
  const label = within(drawer).getByRole("textbox", { name: "Button label" });
  expect(label).toHaveFocus();
  expect(within(drawer).getByText("Needs a label")).toBeInTheDocument();
  fireEvent.change(label, { target: { value: "Fresh" } });
  expect(latest.actions.at(-1)).toMatchObject({ label: "Fresh", steps: [] });
  fireEvent.click(within(drawer).getByRole("button", { name: "Duplicate Kept" }));
  expect(within(drawer).getByRole("textbox", { name: "Button label" })).toHaveValue("Kept copy");
  expect(latest.actions.map((action) => action.label)).toEqual([
    "Kept",
    "Kept copy",
    "Swapped",
    "Absent",
    "Fresh",
  ]);
  expect(latest.actions[1].id).not.toBe("kept");
  fireEvent.keyDown(within(drawer).getByRole("button", { name: "Reorder Kept" }), {
    key: "ArrowDown",
    altKey: true,
  });
  expect(latest.actions.map((action) => action.label).slice(0, 2)).toEqual(["Kept copy", "Kept"]);
  fireEvent.click(within(drawer).getByRole("button", { name: "Delete Swapped" }));
  expect(latest.actions.map((action) => action.label)).toEqual([
    "Kept copy",
    "Kept",
    "Absent",
    "Fresh",
  ]);
  // Focus moves to the row that took the deleted one's place.
  expect(within(drawer).getByRole("button", { name: "Expand Absent" })).toHaveFocus();
});

it("narrows the rows with Find an action, reorders only the full list and clears with Esc", () => {
  const { drawer, tab, onCancel } = open(video);
  tab("Actions");
  const find = within(drawer).getByRole("searchbox", { name: "Find an action" });
  fireEvent.change(find, { target: { value: "sw" } });
  expect(within(drawer).getByRole("button", { name: "Expand Swapped" })).toBeInTheDocument();
  expect(within(drawer).queryByRole("button", { name: "Expand Kept" })).toBeNull();
  expect(within(drawer).getByRole("button", { name: "Reorder Swapped" })).toBeDisabled();
  fireEvent.change(find, { target: { value: "nothing like it" } });
  expect(within(drawer).getByText("No action matches “nothing like it”.")).toBeInTheDocument();
  // Esc empties the filter first; the drawer stays open.
  fireEvent.keyDown(find, { key: "Escape" });
  expect(find).toHaveValue("");
  expect(onCancel).not.toHaveBeenCalled();
  expect(within(drawer).getByRole("button", { name: "Reorder Kept" })).toBeEnabled();
});

it("refuses an incomplete draft and shows where it is incomplete", () => {
  const { drawer, tab, onSave } = open(video);
  const name = within(drawer).getByRole("textbox", { name: "Review name" });
  fireEvent.change(name, { target: { value: " " } });
  tab("Actions");
  fireEvent.click(within(drawer).getByRole("button", { name: "Save review" }));
  expect(onSave).not.toHaveBeenCalled();
  expect(within(drawer).getByRole("alert")).toHaveTextContent(
    "Name the review and complete every action step before saving.",
  );
  expect(within(drawer).getByRole("tab", { name: "Review" })).toHaveAttribute("aria-selected", "true");
  expect(name).toHaveFocus();
  // The message goes once the draft changes.
  fireEvent.change(name, { target: { value: "Video review" } });
  expect(within(drawer).queryByRole("alert")).toBeNull();
  tab("Actions");
  fireEvent.click(within(drawer).getByRole("button", { name: "Add action" }));
  fireEvent.click(within(drawer).getByRole("button", { name: "Collapse New action" }));
  tab("Review");
  fireEvent.click(within(drawer).getByRole("button", { name: "Save review" }));
  expect(onSave).not.toHaveBeenCalled();
  expect(within(drawer).getByRole("tab", { name: "Actions" })).toHaveAttribute("aria-selected", "true");
  expect(within(drawer).getByRole("textbox", { name: "Button label" })).toHaveFocus();
  fireEvent.change(within(drawer).getByRole("textbox", { name: "Button label" }), {
    target: { value: "Skip it" },
  });
  fireEvent.click(within(drawer).getByRole("button", { name: "Save review" }));
  expect(onSave).toHaveBeenCalledTimes(1);
});

it("closes with Esc only while nothing has changed, and with Close or Cancel always", () => {
  const { drawer, onCancel } = open(video);
  fireEvent.keyDown(drawer, { key: "Escape" });
  expect(onCancel).toHaveBeenCalledTimes(1);
  fireEvent.change(within(drawer).getByLabelText("Description"), { target: { value: "Changed" } });
  fireEvent.keyDown(within(drawer).getByLabelText("Description"), { key: "Escape" });
  expect(onCancel).toHaveBeenCalledTimes(1);
  fireEvent.click(within(drawer).getByRole("button", { name: "Close editor" }));
  fireEvent.click(within(drawer).getByRole("button", { name: "Cancel" }));
  expect(onCancel).toHaveBeenCalledTimes(3);
});

it("edits a tag review's action effects, naming a group that is no longer there", async () => {
  const { drawer, tab } = open(tagReview);
  tab("Actions");
  expect(within(drawer).getByText("Assign Classification")).toBeInTheDocument();
  expect(within(drawer).getByText("Unavailable tag group")).toBeInTheDocument();
  // Tag reviews have no parent tags to build actions from.
  expect(within(drawer).queryByRole("button", { name: "Add from parent tags…" })).toBeNull();
  fireEvent.click(within(drawer).getByRole("button", { name: "Expand Gone" }));
  const effect = within(drawer).getByLabelText("Tag group action");
  expect(effect).toHaveValue("group:99");
  expect(within(effect).getByRole("option", { name: "Unavailable tag group" })).toBeDisabled();
  fireEvent.change(effect, { target: { value: "CLEAR_TAG_GROUP" } });
  expect(latest.actions[1]).toMatchObject({ effect: { mode: "CLEAR_TAG_GROUP" } });
  fireEvent.click(within(drawer).getByRole("button", { name: "Add action" }));
  expect(latest.actions.at(-1)).toMatchObject({ label: "", effect: { mode: "SKIP" } });
});

it("keeps a legacy review's Tag choices tab while its choices are edited", () => {
  const { drawer, tab } = open({
    ...occurrence,
    occurrence: { ...occurrence.occurrence, tagIds: [31] },
  });
  tab("Tag choices");
  fireEvent.change(within(drawer).getByPlaceholderText("Search review tag choices..."), {
    target: { value: "" },
  });
  expect((latest as OccurrenceReview).occurrence.tagIds).toEqual([]);
  expect(within(drawer).getByRole("tab", { name: "Tag choices" })).toBeInTheDocument();
});

it("closes Add from parent tags with Esc before Esc can close the drawer", () => {
  const { drawer, tab, onCancel } = open(video);
  tab("Actions");
  const toggle = within(drawer).getByRole("button", { name: "Add from parent tags…" });
  fireEvent.click(toggle);
  const panel = within(drawer).getByRole("group", { name: "Add actions from parent tags" });
  fireEvent.keyDown(within(panel).getByPlaceholderText("Search parent tags..."), { key: "Escape" });
  expect(within(drawer).queryByRole("group", { name: "Add actions from parent tags" })).toBeNull();
  expect(onCancel).not.toHaveBeenCalled();
  expect(toggle).toHaveFocus();
  // With the panel closed and nothing changed, Esc closes the drawer.
  fireEvent.keyDown(toggle, { key: "Escape" });
  expect(onCancel).toHaveBeenCalledTimes(1);
});

it("shows an incomplete action that Find an action hides when Save is refused", () => {
  const { drawer, tab, onSave } = open(video);
  tab("Actions");
  fireEvent.click(within(drawer).getByRole("button", { name: "Add action" }));
  const find = within(drawer).getByRole("searchbox", { name: "Find an action" });
  fireEvent.change(find, { target: { value: "kept" } });
  expect(within(drawer).queryByRole("textbox", { name: "Button label" })).toBeNull();
  fireEvent.click(within(drawer).getByRole("button", { name: "Save review" }));
  expect(onSave).not.toHaveBeenCalled();
  expect(find).toHaveValue("");
  expect(within(drawer).getByRole("textbox", { name: "Button label" })).toHaveValue("");
  expect(within(drawer).getByRole("textbox", { name: "Button label" })).toHaveFocus();
});
