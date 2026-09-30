import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { draftSignature, EditorDrawer } from "../EditorDrawer";
import { groupOptions } from "../GroupField";
import type { MediaReviewAction, Review, VideoReview } from "../model";
// The field's own styles: the list's placement and the phone-sized rows (jsdom applies them,
// without layout).
import "../styles.css";

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
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
});

const review: VideoReview = {
  id: "video",
  name: "Video review",
  description: "",
  view: {
    filter: { page: 1, perPage: 40 },
    objectFilter: {},
    displayMode: "grid",
    searchMode: "text",
    startFrom: "end",
  },
  actions: [
    { id: "first", label: "First", group: "Shape", steps: [{ mode: "ADD", tagIds: [11] }] },
    { id: "second", label: "Second", group: "Colour", steps: [{ mode: "ADD", tagIds: [12] }] },
    { id: "third", label: "Third", group: "shape", steps: [{ mode: "ADD", tagIds: [13] }] },
    { id: "loose", label: "Loose", steps: [{ mode: "ADD", tagIds: [14] }] },
    { id: "own", label: "Own", group: "Width", steps: [{ mode: "ADD", tagIds: [15] }] },
  ],
};

/** The draft the drawer last reported. */
let latest: Review;
const groupOf = (id: string) =>
  (latest.actions as MediaReviewAction[]).find((action) => action.id === id)?.group;

/** Opens the drawer on the review's Actions tab with one action expanded. */
function openAction(label: string, initial: Review = review) {
  const onCancel = vi.fn();
  function Harness() {
    const [draft, setDraft] = useState(initial);
    const [baseline] = useState(() => draftSignature(initial));
    latest = draft;
    return (
      <EditorDrawer
        draft={draft}
        onChange={setDraft}
        direction="end"
        onDirectionChange={() => {}}
        tagGroups={[]}
        trees={new Map()}
        saving={false}
        error=""
        dirty={draftSignature(draft) !== baseline}
        onSave={() => {}}
        onCancel={onCancel}
      />
    );
  }
  render(<Harness />);
  const drawer = screen.getByRole("dialog", { name: "Edit review" });
  fireEvent.click(within(drawer).getByRole("tab", { name: "Actions" }));
  fireEvent.click(within(drawer).getByRole("button", { name: `Expand ${label}` }));
  const field = within(drawer).getByRole("combobox", { name: "Group" });
  const chevron = within(drawer).getByRole("button", { name: "Show groups" });
  return { drawer, field, chevron, onCancel };
}

const listbox = () => screen.getByRole("listbox", { name: "Groups" });
const optionNames = () =>
  within(listbox())
    .getAllByRole("option")
    .map((option) => option.textContent);
const selectedNames = () =>
  within(listbox())
    .getAllByRole("option", { selected: true })
    .map((option) => option.textContent);
const activeOption = (field: HTMLElement) => {
  const id = field.getAttribute("aria-activedescendant");
  return id ? document.getElementById(id)?.textContent : undefined;
};

describe("groupOptions", () => {
  const all = ["Shape", "Colour", "Width"];
  const others = ["Shape", "Colour"];

  it("lists No group and every group while nothing is typed, the action's own marked selected", () => {
    expect(groupOptions(all, others, "Width", null)).toEqual([
      { kind: "none", name: "", selected: false },
      { kind: "group", name: "Shape", selected: false },
      { kind: "group", name: "Colour", selected: false },
      { kind: "group", name: "Width", selected: true },
    ]);
    // Names match trimmed and ignoring case; an empty or blank group is No group.
    expect(groupOptions(all, others, "  shape ", null).filter((option) => option.selected)).toEqual([
      { kind: "group", name: "Shape", selected: true },
    ]);
    expect(groupOptions(all, others, "  ", null).filter((option) => option.selected)).toEqual([
      { kind: "none", name: "", selected: true },
    ]);
  });

  it("filters the other actions' groups by the typed text and offers a new group for a name none of them has", () => {
    // Part of a name, in any case and with spaces around it: the matching groups, then the text
    // itself as a new group, which is now the action's group.
    expect(groupOptions(all, others, " o ", " o ")).toEqual([
      { kind: "none", name: "", selected: false },
      { kind: "group", name: "Colour", selected: false },
      { kind: "new", name: "o", selected: true },
    ]);
    // A name another action has is that group, selected, and not new.
    expect(groupOptions(all, others, "COLOUR", "COLOUR")).toEqual([
      { kind: "none", name: "", selected: false },
      { kind: "group", name: "Colour", selected: true },
    ]);
    // The action's own group, which no other action names, is listed as the new group it is.
    expect(groupOptions(all, others, "Width", "Width")).toEqual([
      { kind: "none", name: "", selected: false },
      { kind: "new", name: "Width", selected: true },
    ]);
    // Nothing typed (all of it deleted): every other group, and No group selected.
    expect(groupOptions(all, others, "", "")).toEqual([
      { kind: "none", name: "", selected: true },
      { kind: "group", name: "Shape", selected: false },
      { kind: "group", name: "Colour", selected: false },
    ]);
  });
});

describe("the group field", () => {
  it("wires the combobox, its chevron and its list for assistive technology", async () => {
    const user = userEvent.setup();
    const { field, chevron } = openAction("Own");
    expect(field).toHaveAttribute("aria-autocomplete", "list");
    expect(field).toHaveAttribute("aria-expanded", "false");
    expect(field).not.toHaveAttribute("aria-controls");
    expect(field).toHaveAccessibleDescription("A group is one question with one answer per item.");
    // The chevron is outside the Tab order; the field itself opens the list from the keyboard.
    expect(chevron).toHaveAttribute("tabindex", "-1");
    expect(chevron).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).toBeNull();
    // No native suggestions any more.
    expect(field).not.toHaveAttribute("list");
    expect(document.querySelector("datalist")).toBeNull();

    await user.click(field);
    expect(field).toHaveAttribute("aria-expanded", "true");
    expect(chevron).toHaveAttribute("aria-expanded", "true");
    expect(field).toHaveAttribute("aria-controls", listbox().id);
    expect(chevron).toHaveAttribute("aria-controls", listbox().id);
    expect(optionNames()).toEqual(["No group", "Shape", "Colour", "Width"]);
    expect(selectedNames()).toEqual(["Width"]);
    // The selected row carries a check; the others none.
    const rows = within(listbox()).getAllByRole("option");
    expect(rows.map((row) => row.querySelector(".dq-combobox-check") !== null)).toEqual([
      false,
      false,
      false,
      true,
    ]);
    expect(rows.map((row) => row.getAttribute("aria-selected"))).toEqual([
      "false",
      "false",
      "false",
      "true",
    ]);
    expect(field).not.toHaveAttribute("aria-activedescendant");
    await user.keyboard("{ArrowDown}");
    expect(activeOption(field)).toBe("No group");
    expect(within(listbox()).getByRole("option", { name: "No group" })).toHaveAttribute(
      "id",
      field.getAttribute("aria-activedescendant"),
    );
  });

  it("lists the groups when the field or the chevron is clicked, and No group clears the group", async () => {
    const user = userEvent.setup();
    const { field, chevron } = openAction("Loose");
    await user.click(chevron);
    expect(field).toHaveFocus();
    // Opened by a click, it has no row chosen yet.
    expect(field).not.toHaveAttribute("aria-activedescendant");
    // An action without a group: No group is selected; the others are as the first action spells them.
    expect(optionNames()).toEqual(["No group", "Shape", "Colour", "Width"]);
    expect(selectedNames()).toEqual(["No group"]);
    await user.click(within(listbox()).getByRole("option", { name: "Colour" }));
    expect(groupOf("loose")).toBe("Colour");
    expect(field).toHaveValue("Colour");
    expect(screen.queryByRole("listbox")).toBeNull();
    // Picking kept focus in the field.
    expect(field).toHaveFocus();
    await user.click(field);
    expect(selectedNames()).toEqual(["Colour"]);
    await user.click(within(listbox()).getByRole("option", { name: "No group" }));
    expect(groupOf("loose")).toBeUndefined();
    expect(latest.actions.find((action) => action.id === "loose")).not.toHaveProperty("group");
    expect(field).toHaveValue("");
    // The chevron closes the list it opened.
    await user.click(chevron);
    expect(listbox()).toBeInTheDocument();
    await user.click(chevron);
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("filters as you type, offers the typed name as a new group, and edits the group as it goes", async () => {
    const user = userEvent.setup();
    const { field } = openAction("Loose");
    await user.click(field);
    await user.keyboard("o");
    // The group changes as it is typed, as before.
    expect(groupOf("loose")).toBe("o");
    expect(optionNames()).toEqual(["No group", "Colour", "New group “o”"]);
    expect(selectedNames()).toEqual(["New group “o”"]);
    await user.clear(field);
    await user.keyboard("sHA");
    // Part of a group's name, in any case: that group, and the text as a new one.
    expect(optionNames()).toEqual(["No group", "Shape", "New group “sHA”"]);
    await user.keyboard("pe");
    // The name another action has: that group, selected, and no new group.
    expect(optionNames()).toEqual(["No group", "Shape"]);
    expect(selectedNames()).toEqual(["Shape"]);
    await user.clear(field);
    await user.keyboard("Depth");
    expect(optionNames()).toEqual(["No group", "New group “Depth”"]);
    await user.click(within(listbox()).getByRole("option", { name: "New group “Depth”" }));
    expect(groupOf("loose")).toBe("Depth");
    expect(screen.queryByRole("listbox")).toBeNull();
    // Opened again without typing, the list has every group, the new one included and selected.
    await user.click(field);
    // In the order of each group's first action: this one comes before the Width action.
    expect(optionNames()).toEqual(["No group", "Shape", "Colour", "Depth", "Width"]);
    expect(selectedNames()).toEqual(["Depth"]);
  });

  it("opens on the action's group with ↓, moves with ↑ and ↓, and picks with Enter, which it claims", async () => {
    const user = userEvent.setup();
    const { field, onCancel } = openAction("Own");
    field.focus();
    await user.keyboard("{ArrowDown}");
    expect(listbox()).toBeInTheDocument();
    expect(activeOption(field)).toBe("Width");
    // Enter right away keeps the group.
    await user.keyboard("{Enter}");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(groupOf("own")).toBe("Width");
    // ↑ opens on it too; the arrows go round.
    await user.keyboard("{ArrowUp}");
    expect(activeOption(field)).toBe("Width");
    await user.keyboard("{ArrowDown}");
    expect(activeOption(field)).toBe("No group");
    await user.keyboard("{ArrowUp}{ArrowUp}");
    expect(activeOption(field)).toBe("Colour");
    const enter = fireEvent.keyDown(field, { key: "Enter" });
    // Claimed, so no form or other listener acts on it.
    expect(enter).toBe(false);
    expect(groupOf("own")).toBe("Colour");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(screen.getByRole("dialog", { name: "Edit review" })).toBeInTheDocument();
    expect(onCancel).not.toHaveBeenCalled();
    // Alt + ↑ on a closed field does nothing.
    await user.keyboard("{Alt>}{ArrowUp}{/Alt}");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("starts ↓ on the first match once something is typed, so ↓ and Enter never clear the group", async () => {
    const user = userEvent.setup();
    const { field } = openAction("Loose");
    await user.click(field);
    await user.keyboard("o");
    expect(optionNames()).toEqual(["No group", "Colour", "New group “o”"]);
    await user.keyboard("{ArrowDown}");
    expect(activeOption(field)).toBe("Colour");
    await user.keyboard("{ArrowDown}");
    expect(activeOption(field)).toBe("New group “o”");
    // No group is still there, going round.
    await user.keyboard("{ArrowDown}");
    expect(activeOption(field)).toBe("No group");
    await user.keyboard("{ArrowUp}{Enter}");
    expect(groupOf("loose")).toBe("o");
    // With nothing typed (all of it deleted), ↓ starts at the top again.
    await user.clear(field);
    await user.keyboard("{ArrowDown}");
    expect(activeOption(field)).toBe("No group");
    // Typing clears the chosen row; ↑ then goes to the last one.
    await user.keyboard("s");
    expect(field).not.toHaveAttribute("aria-activedescendant");
    await user.keyboard("{ArrowUp}");
    expect(activeOption(field)).toBe("New group “s”");
  });

  it("gives the field the picked group's spelling once something was typed", async () => {
    const user = userEvent.setup();
    const { field } = openAction("Loose");
    await user.click(field);
    await user.keyboard("colour");
    expect(selectedNames()).toEqual(["Colour"]);
    await user.keyboard("{ArrowDown}{Enter}");
    expect(groupOf("loose")).toBe("Colour");
    expect(field).toHaveValue("Colour");
    await user.clear(field);
    await user.keyboard("COLOUR");
    await user.click(within(listbox()).getByRole("option", { name: "Colour" }));
    expect(groupOf("loose")).toBe("Colour");
  });

  it("keeps the action's own spelling when its group, spelt otherwise by another action, is picked", async () => {
    const user = userEvent.setup();
    const { field, drawer } = openAction("Third");
    field.focus();
    await user.keyboard("{ArrowDown}");
    // Listed as the first action spells it, and selected.
    expect(activeOption(field)).toBe("Shape");
    expect(selectedNames()).toEqual(["Shape"]);
    await user.keyboard("{Enter}");
    expect(groupOf("third")).toBe("shape");
    await user.click(field);
    await user.click(within(listbox()).getByRole("option", { name: "Shape" }));
    expect(groupOf("third")).toBe("shape");
    expect(within(drawer).queryByText(/Unsaved changes/)).toBeNull();
  });

  it("leaves keys that compose a character to the input method, the drawer's Esc included", async () => {
    const user = userEvent.setup();
    const { field, onCancel } = openAction("Own");
    await user.click(field);
    await user.keyboard("{ArrowDown}");
    expect(activeOption(field)).toBe("No group");
    // The Enter that commits a composition: flagged, or Safari's key code 229.
    fireEvent.keyDown(field, { key: "Enter", isComposing: true });
    fireEvent.keyDown(field, { key: "Enter", keyCode: 229 });
    fireEvent.keyDown(field, { key: "ArrowDown", isComposing: true });
    expect(listbox()).toBeInTheDocument();
    expect(activeOption(field)).toBe("No group");
    expect(groupOf("own")).toBe("Width");
    // The Esc that cancels one neither closes the list nor reaches the drawer's Esc.
    fireEvent.keyDown(field, { key: "Escape", keyCode: 229 });
    fireEvent.keyDown(field, { key: "Escape", isComposing: true });
    expect(listbox()).toBeInTheDocument();
    expect(onCancel).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog", { name: "Discard unsaved changes?" })).toBeNull();
  });

  it("makes the row under the pointer the active one", async () => {
    const user = userEvent.setup();
    const { field } = openAction("Own");
    await user.click(field);
    const row = within(listbox()).getByRole("option", { name: "Colour" });
    fireEvent.mouseMove(row);
    expect(field).toHaveAttribute("aria-activedescendant", row.id);
    expect(row).toHaveAttribute("data-active");
  });

  it("opens with Alt + ↓ without choosing a row, closes with Alt + ↑, and keeps a typed name on Enter", async () => {
    const user = userEvent.setup();
    const { field } = openAction("Loose");
    field.focus();
    await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
    expect(listbox()).toBeInTheDocument();
    expect(field).not.toHaveAttribute("aria-activedescendant");
    await user.keyboard("{Alt>}{ArrowUp}{/Alt}");
    expect(screen.queryByRole("listbox")).toBeNull();
    // Typing opens it; Enter with no row chosen keeps what was typed, trimmed.
    await user.keyboard("  Depth ");
    expect(listbox()).toBeInTheDocument();
    await user.keyboard("{Enter}");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(groupOf("loose")).toBe("Depth");
    expect(field).toHaveFocus();
  });

  it("closes only the list on Esc; the next Esc reaches the drawer", async () => {
    const user = userEvent.setup();
    const { field, onCancel } = openAction("Own");
    await user.click(field);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(field).toHaveAttribute("aria-expanded", "false");
    expect(onCancel).not.toHaveBeenCalled();
    expect(field).toHaveFocus();
    // Nothing changed, so the drawer's own Esc closes it at once.
    await user.keyboard("{Escape}");
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("keeps the typed text when Tab leaves the field, trimmed, and moves on as Tab does", async () => {
    const user = userEvent.setup();
    const { field, drawer } = openAction("Loose");
    await user.click(field);
    await user.keyboard(" Sha");
    expect(listbox()).toBeInTheDocument();
    await user.keyboard("{ArrowDown}");
    expect(activeOption(field)).toBe("Shape");
    await user.tab();
    expect(screen.queryByRole("listbox")).toBeNull();
    // Not the active row: the text as typed, trimmed once the field is left.
    expect(groupOf("loose")).toBe("Sha");
    expect(field).not.toHaveFocus();
    expect(drawer.contains(document.activeElement)).toBe(true);
  });

  it("closes when pressed outside, but not on the field's own name, whose click opens the list", async () => {
    const user = userEvent.setup();
    const { field, drawer } = openAction("Own");
    await user.click(field);
    await user.keyboard("{ArrowDown}");
    // A press on a row leaves focus in the field.
    const row = within(listbox()).getByRole("option", { name: "Shape" });
    expect(fireEvent.mouseDown(row)).toBe(false);
    // The field's name belongs to the field: pressing it keeps the list and its chosen row.
    await user.click(within(drawer).getByText("Group", { selector: "label" }));
    expect(activeOption(field)).toBe("No group");
    await user.click(within(drawer).getByText("Button label"));
    expect(screen.queryByRole("listbox")).toBeNull();
    // Unchanged, as no row was picked.
    expect(groupOf("own")).toBe("Width");
    // A click on the name of a closed field opens it, as a click on the field does.
    await user.click(within(drawer).getByText("Group", { selector: "label" }));
    expect(listbox()).toBeInTheDocument();
  });

  it("opens from a tapped chevron without focusing the field, so no on-screen keyboard appears", () => {
    const { field, chevron } = openAction("Own");
    fireEvent.pointerDown(chevron, { pointerType: "touch" });
    fireEvent.mouseDown(chevron);
    fireEvent.click(chevron);
    expect(listbox()).toBeInTheDocument();
    expect(field).not.toHaveFocus();
    fireEvent.click(within(listbox()).getByRole("option", { name: "Colour" }));
    expect(groupOf("own")).toBe("Colour");
    // Without focus in the field no blur closes the list: a press outside does.
    fireEvent.pointerDown(chevron, { pointerType: "touch" });
    fireEvent.mouseDown(chevron);
    fireEvent.click(chevron);
    expect(listbox()).toBeInTheDocument();
    expect(field).not.toHaveFocus();
    fireEvent.pointerDown(document.body, { pointerType: "touch" });
    expect(screen.queryByRole("listbox")).toBeNull();
    // A mouse press on it focuses the field, and the press itself keeps focus where it is.
    fireEvent.pointerDown(chevron, { pointerType: "mouse" });
    expect(fireEvent.mouseDown(chevron)).toBe(false);
    fireEvent.click(chevron);
    expect(field).toHaveFocus();
  });

  it("closes when focus leaves the field another way", async () => {
    const user = userEvent.setup();
    const { field, drawer } = openAction("Own");
    await user.click(field);
    act(() => within(drawer).getByRole("button", { name: "Close editor" }).focus());
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(field).toHaveAttribute("aria-expanded", "false");
  });
});

describe("the group list's place", () => {
  const rect = (top: number, left: number, width: number, height: number) =>
    ({ top, left, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON() {} }) as DOMRect;
  let fieldRect: DOMRect;
  let listHeight: number;
  let hit: Element | null;

  beforeEach(() => {
    fieldRect = rect(300, 900, 400, 34);
    listHeight = 150;
    hit = null;
    // Every box is the window unless it is the field's; the list is as tall as its rows.
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
      return this.classList.contains("dq-combobox") ? fieldRect : rect(0, 0, 1920, 1080);
    });
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      get(this: HTMLElement) {
        return this.classList.contains("dq-combobox-list") ? listHeight : 0;
      },
    });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 1080 });
  });
  afterEach(() => {
    delete (HTMLElement.prototype as { scrollHeight?: number }).scrollHeight;
    delete (document as { elementFromPoint?: unknown }).elementFromPoint;
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 768 });
  });

  const scrollBody = (drawer: HTMLElement) =>
    fireEvent.scroll(drawer.querySelector(".dq-drawer-body")!);

  it("hangs on the page under the field, as wide as it, outside the drawer that would clip it", async () => {
    const user = userEvent.setup();
    const { drawer, field } = openAction("Own");
    await user.click(field);
    const list = listbox();
    expect(drawer.contains(list)).toBe(false);
    expect(list.parentElement).toBe(document.body);
    expect(getComputedStyle(list).position).toBe("fixed");
    expect(list.style.top).toBe("338px");
    expect(list.style.left).toBe("900px");
    expect(list.style.width).toBe("400px");
    expect(list.style.transform).toBe("");
    expect(list.style.maxHeight).toBe("240px");
  });

  it("follows the field as the drawer's body scrolls, and closes once the field has left the view", async () => {
    const user = userEvent.setup();
    const { drawer, field } = openAction("Own");
    await user.click(field);
    fieldRect = rect(200, 900, 400, 34);
    scrollBody(drawer);
    expect(listbox().style.top).toBe("238px");
    // Under the Actions tab's toolbar, which stays put while the rows scroll: out of view.
    const toolbar = drawer.querySelector(".dq-actions-head")!;
    hit = toolbar;
    document.elementFromPoint = () => hit;
    fieldRect = rect(120, 900, 400, 34);
    scrollBody(drawer);
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(field).toHaveAttribute("aria-expanded", "false");
    // Out of the body's box altogether.
    hit = field;
    fieldRect = rect(300, 900, 400, 34);
    await user.click(field);
    expect(listbox()).toBeInTheDocument();
    const body = drawer.querySelector(".dq-drawer-body")!;
    vi.mocked(Element.prototype.getBoundingClientRect).mockImplementation(function (this: Element) {
      if (this.classList.contains("dq-combobox")) return fieldRect;
      return this === body ? rect(100, 800, 720, 800) : rect(0, 0, 1920, 1080);
    });
    fieldRect = rect(40, 900, 400, 34);
    scrollBody(drawer);
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("never takes its own place before a scroll for something covering the field", async () => {
    const user = userEvent.setup();
    const { drawer, field } = openAction("Own");
    // The list, wherever it is drawn at the moment, covers what lies under it.
    const drawn = () => {
      const list = document.querySelector<HTMLElement>(".dq-combobox-list");
      if (!list) return null;
      const height = Math.min(listHeight, parseFloat(list.style.maxHeight));
      const top = parseFloat(list.style.top) - (list.style.transform ? height : 0);
      return { list, top, bottom: top + height };
    };
    document.elementFromPoint = (_x: number, y: number) => {
      const box = drawn();
      return box && y >= box.top && y <= box.bottom ? box.list : field;
    };
    await user.click(field);
    // One jump down puts the field's centre where the list hung until it moves.
    fieldRect = rect(360, 900, 400, 34);
    scrollBody(drawer);
    expect(listbox().style.top).toBe("398px");
    // The same upwards, for a list above the field.
    await user.keyboard("{Escape}");
    fieldRect = rect(1000, 900, 400, 34);
    await user.click(field);
    expect(listbox().style.transform).toBe("translateY(-100%)");
    fieldRect = rect(900, 900, 400, 34);
    scrollBody(drawer);
    expect(listbox().style.top).toBe("896px");
  });

  it("does not open for a field already scrolled out of the drawer's body", async () => {
    const user = userEvent.setup();
    const { drawer, field } = openAction("Own");
    const body = drawer.querySelector(".dq-drawer-body")!;
    vi.mocked(Element.prototype.getBoundingClientRect).mockImplementation(function (this: Element) {
      if (this.classList.contains("dq-combobox")) return fieldRect;
      return this === body ? rect(100, 800, 720, 800) : rect(0, 0, 1920, 1080);
    });
    // Focus stayed in the field while the wheel scrolled it away; ↓ then shows nothing.
    fieldRect = rect(20, 900, 400, 34);
    field.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(field).toHaveAttribute("aria-expanded", "false");
  });

  it("opens upwards when the room below is short and there is more above", async () => {
    const user = userEvent.setup();
    fieldRect = rect(1000, 900, 400, 34);
    const { field } = openAction("Own");
    await user.click(field);
    const list = listbox();
    expect(list.style.top).toBe("996px");
    expect(list.style.transform).toBe("translateY(-100%)");
    expect(list.style.maxHeight).toBe("240px");
    // A list that fits below stays below, however little room is left under it.
    await user.keyboard("{Escape}");
    listHeight = 36;
    await user.click(field);
    expect(listbox().style.transform).toBe("");
    expect(listbox().style.top).toBe("1038px");
    expect(listbox().style.maxHeight).toBe("42px");
  });
});

describe("the group list's styles", () => {
  // jsdom reads media rules but does not apply them: the rules themselves are checked.
  const mediaRules = (condition: string) =>
    [...document.styleSheets]
      .flatMap((sheet) => [...sheet.cssRules])
      .filter(
        (rule) =>
          rule.cssText.startsWith("@media") &&
          (rule as CSSMediaRule).media.mediaText.replace(/\s/g, "") === condition,
      )
      .flatMap((rule) => [...(rule as CSSMediaRule).cssRules] as CSSStyleRule[]);

  it("gives rows at least 40 px in phone-sized windows", () => {
    const heights = mediaRules("(max-width:760px)")
      .filter((rule) => rule.selectorText === ".dq-combobox-option")
      .map((rule) => parseFloat(rule.style.minHeight));
    expect(heights.length).toBeGreaterThan(0);
    expect(Math.max(...heights)).toBeGreaterThanOrEqual(40);
  });

  it("fills the active row with the selection colours in forced colours", () => {
    const active = mediaRules("(forced-colors:active)").find(
      (rule) => rule.selectorText === ".dq-combobox-option[data-active]",
    );
    expect(active?.style.background.toLowerCase()).toBe("highlight");
    expect(active?.style.color.toLowerCase()).toBe("highlighttext");
  });
});
