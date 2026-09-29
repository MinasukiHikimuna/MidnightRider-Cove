import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import {
  LayoutSwitch,
  MoreMenu,
  ReviewHeader,
  ReviewPager,
  type QueueChange,
} from "../ReviewHeader";
import { setViewportWidth } from "./viewport";
// The header's own styles: the chip row's collapse and what gives way (jsdom applies them, without
// layout).
import "../styles.css";

afterEach(() => {
  vi.unstubAllGlobals();
});

it("opens the More menu on its first item, moves with the arrows and closes with Esc or Tab", () => {
  const first = vi.fn();
  render(
    <MoreMenu
      items={[
        { label: "First", onSelect: first },
        { label: "Unavailable", disabled: true, onSelect: vi.fn() },
        { label: "Last", onSelect: vi.fn() },
      ]}
    />,
  );
  const button = screen.getByRole("button", { name: "More review options" });
  expect(button).toHaveAttribute("aria-haspopup", "menu");
  fireEvent.click(button);
  expect(button).toHaveAttribute("aria-expanded", "true");
  const menu = screen.getByRole("menu", { name: "More review options" });
  expect(screen.getByRole("menuitem", { name: "First" })).toHaveFocus();
  // Disabled items are skipped, and the arrows wrap around.
  fireEvent.keyDown(menu, { key: "ArrowDown" });
  expect(screen.getByRole("menuitem", { name: "Last" })).toHaveFocus();
  fireEvent.keyDown(menu, { key: "ArrowDown" });
  expect(screen.getByRole("menuitem", { name: "First" })).toHaveFocus();
  fireEvent.keyDown(menu, { key: "ArrowUp" });
  expect(screen.getByRole("menuitem", { name: "Last" })).toHaveFocus();
  fireEvent.keyDown(menu, { key: "Escape" });
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(button).toHaveFocus();
  fireEvent.click(button);
  fireEvent.keyDown(screen.getByRole("menu"), { key: "Tab" });
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  fireEvent.click(button);
  fireEvent.click(screen.getByRole("menuitem", { name: "First" }));
  expect(first).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
});

it("names a row's menu after its review, groups its items and marks the destructive one", () => {
  const onDelete = vi.fn();
  render(
    <MoreMenu
      label="Actions for Weekly check"
      items={[
        { label: "Edit", icon: <svg data-testid="edit-icon" />, onSelect: vi.fn() },
        { label: "Delete…", danger: true, separated: true, onSelect: onDelete },
      ]}
    />,
  );
  const button = screen.getByRole("button", { name: "Actions for Weekly check" });
  fireEvent.click(button);
  const menu = screen.getByRole("menu", { name: "Actions for Weekly check" });
  const [edit, remove] = within(menu).getAllByRole("menuitem");
  expect(edit).toContainElement(screen.getByTestId("edit-icon"));
  expect(edit).toHaveTextContent("Edit");
  expect(remove).toHaveClass("dq-menu-danger");
  // The divider comes before the item that starts the group, and the arrows pass over it.
  expect(within(menu).getByRole("separator").nextElementSibling).toBe(remove);
  expect(edit).toHaveFocus();
  fireEvent.keyDown(menu, { key: "ArrowDown" });
  expect(remove).toHaveFocus();
  fireEvent.click(remove);
  expect(onDelete).toHaveBeenCalledTimes(1);
  expect(button).toHaveFocus();
});

it("opens the menu upwards when the window has no room for it below the button", () => {
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (
    this: HTMLElement,
  ) {
    return this.getAttribute("role") === "menu" ? 160 : 0;
  });
  // The button's place in the window.
  const rect = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect");
  const at = (top: number) => rect.mockReturnValue({ top, bottom: top + 32 } as DOMRect);
  const items = [{ label: "Export", onSelect: vi.fn() }];
  const { unmount } = render(<MoreMenu label="Near the bottom" items={items} />);
  at(window.innerHeight - 60);
  fireEvent.click(screen.getByRole("button", { name: "Near the bottom" }));
  expect(screen.getByRole("menu")).toHaveClass("dq-menu-list-up");
  unmount();
  at(100);
  render(<MoreMenu label="Near the top" items={items} />);
  fireEvent.click(screen.getByRole("button", { name: "Near the top" }));
  expect(screen.getByRole("menu")).not.toHaveClass("dq-menu-list-up");
});

it("closes the More menu when it becomes unavailable", () => {
  const { rerender } = render(<MoreMenu items={[{ label: "First", onSelect: vi.fn() }]} />);
  fireEvent.click(screen.getByRole("button", { name: "More review options" }));
  expect(screen.getByRole("menu")).toBeInTheDocument();
  rerender(<MoreMenu disabled items={[{ label: "First", onSelect: vi.fn() }]} />);
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
});

it("pages within bounds and ignores go-to entries that are out of range or unchanged", () => {
  const onPage = vi.fn();
  const { rerender } = render(<ReviewPager page={1} pages={4} onPage={onPage} />);
  expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Next page" }));
  expect(onPage).toHaveBeenLastCalledWith(2);
  const go = (value: string) => {
    fireEvent.click(screen.getByRole("button", { name: "Page 1 of 4. Go to page" }));
    const field = screen.getByRole("spinbutton", { name: "Go to page, 1 to 4" });
    fireEvent.change(field, { target: { value } });
    fireEvent.keyDown(field, { key: "Enter" });
  };
  go("9");
  expect(onPage).toHaveBeenLastCalledWith(4);
  onPage.mockClear();
  go("0");
  go("1");
  go("");
  expect(onPage).not.toHaveBeenCalled();
  rerender(<ReviewPager page={1} pages={1} onPage={onPage} />);
  expect(screen.getByRole("button", { name: "Page 1 of 1. Go to page" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
});

it("switches the layout only when another one is chosen", () => {
  const onChange = vi.fn();
  render(<LayoutSwitch mode="single" onChange={onChange} />);
  expect(screen.getByRole("group", { name: "Review layout" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Single" })).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(screen.getByRole("button", { name: "Single" }));
  expect(onChange).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Grid" }));
  expect(onChange).toHaveBeenCalledWith("multiple");
});

it("gives focus back to the More button before running an item", () => {
  let focused: Element | null = null;
  render(
    <MoreMenu items={[{ label: "Open something", onSelect: () => (focused = document.activeElement) }]} />,
  );
  const button = screen.getByRole("button", { name: "More review options" });
  fireEvent.click(button);
  fireEvent.click(screen.getByRole("menuitem", { name: "Open something" }));
  // Whatever the item opens records the More button as the place to return focus to.
  expect(focused).toBe(button);
});

it("closes a More menu without available items from its button", () => {
  render(<MoreMenu items={[{ label: "Unavailable", disabled: true, onSelect: vi.fn() }]} />);
  const button = screen.getByRole("button", { name: "More review options" });
  button.focus();
  fireEvent.click(button);
  expect(screen.getByRole("menu")).toBeInTheDocument();
  expect(button).toHaveFocus();
  fireEvent.keyDown(button, { key: "Escape" });
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(button).toHaveFocus();
});

it("marks Edit review as open while the editor drawer is", () => {
  const onEdit = vi.fn();
  const header = (editing: boolean) => (
    <ReviewHeader
      name="Review"
      entityType="video"
      onEdit={onEdit}
      editing={editing}
      toolbar={null}
      trailing={null}
    />
  );
  const { rerender } = render(header(false));
  const edit = screen.getByRole("button", { name: "Edit review" });
  expect(edit).toHaveAttribute("aria-haspopup", "dialog");
  expect(edit).toHaveAttribute("aria-expanded", "false");
  rerender(header(true));
  expect(edit).toHaveAttribute("aria-expanded", "true");
  fireEvent.click(edit);
  expect(onEdit).toHaveBeenCalledTimes(1);
});

/** A header like an occurrence review's: Scope, then Batch… and More after the queue's buttons. */
function queueHeader(
  queueChange?: QueueChange,
  parts: Partial<Parameters<typeof ReviewHeader>[0]> = {},
) {
  return (
    <ReviewHeader
      name="Review"
      entityType="performerOccurrence"
      toolbar={null}
      trailing={<button type="button">Scope</button>}
      trailingEnd={
        <>
          <button type="button">Batch…</button>
          <MoreMenu items={[]} />
        </>
      }
      queueChange={queueChange}
      queueDiffers={!!queueChange}
      {...parts}
    />
  );
}

it("offers Save to review and Reset just before Batch… and More, explained in their tooltips and descriptions", () => {
  const change = { onSave: vi.fn(), onReset: vi.fn() };
  const { container, rerender } = render(queueHeader());
  const trail = container.querySelector<HTMLElement>(".dq-review-header-trail")!;
  expect(within(trail).queryByRole("button", { name: "Save to review" })).not.toBeInTheDocument();
  expect(within(trail).queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
  rerender(queueHeader(change));
  const order = ["Scope", "Save to review", "Reset", "Batch…", "More review options"].map((name) =>
    within(trail).getByRole("button", { name }),
  );
  expect(within(trail).getAllByRole("button")).toEqual(order);
  const [, save, reset] = order;
  const saveNote = "The queue differs from the saved review. Save these filters to the review.";
  const resetNote = "The queue differs from the saved review. Go back to the review's saved filters.";
  expect(save).toHaveAttribute("title", saveNote);
  expect(save).toHaveAccessibleDescription(saveNote);
  expect(reset).toHaveAttribute("title", resetNote);
  expect(reset).toHaveAccessibleDescription(resetNote);
  // Both in a quiet blue tint (the add colour, never the amber of warnings), which wins over the
  // header buttons' own colours.
  for (const button of [save, reset]) {
    const background = getComputedStyle(button).getPropertyValue("background");
    expect(background).toContain("var(--dq-add)");
    expect(background).not.toMatch(/--dq-(remove|warn)/);
  }
  // No visible note says so any more: only descriptions and the live region do.
  const visible = container.cloneNode(true) as HTMLElement;
  for (const unseen of visible.querySelectorAll("[hidden], .dq-sr-only")) unseen.remove();
  expect(visible).not.toHaveTextContent(/differs from the saved review/i);
  expect(container).toHaveTextContent(/differs from the saved review/i);
  fireEvent.click(save);
  expect(change.onSave).toHaveBeenCalledTimes(1);
  fireEvent.click(reset);
  expect(change.onReset).toHaveBeenCalledTimes(1);
  // They wait while the view is busy.
  rerender(queueHeader({ ...change, saveDisabled: true, resetDisabled: true }));
  expect(within(trail).getByRole("button", { name: "Save to review" })).toBeDisabled();
  expect(within(trail).getByRole("button", { name: "Reset" })).toBeDisabled();
});

it("offers Reset alone, saying why, while only queue tag bins differ", () => {
  render(queueHeader({ onReset: vi.fn() }));
  expect(screen.queryByRole("button", { name: "Save to review" })).not.toBeInTheDocument();
  const reset = screen.getByRole("button", { name: "Reset" });
  const note =
    "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.";
  expect(reset).toHaveAttribute("title", note);
  expect(reset).toHaveAccessibleDescription(note);
});

it("says politely when the queue starts to differ, and again after it stopped, but not when a view opens on it", () => {
  const change = { onSave: vi.fn(), onReset: vi.fn() };
  const message = "The queue differs from the saved review.";
  const { container, rerender, unmount } = render(queueHeader());
  const live = container.querySelector("header > [aria-live='polite']")!;
  expect(live).toBeEmptyDOMElement();
  rerender(queueHeader(change));
  expect(live).toHaveTextContent(message);
  // Still differing (a save running, only bins left) says nothing new.
  rerender(queueHeader({ onReset: change.onReset }));
  expect(live).toHaveTextContent(message);
  // The editor drawer hides the buttons, not the difference: closing it has nothing new to say.
  rerender(queueHeader(undefined, { queueDiffers: true }));
  expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
  expect(live).toHaveTextContent(message);
  rerender(queueHeader(change));
  expect(live).toHaveTextContent(message);
  rerender(queueHeader());
  expect(live).toBeEmptyDOMElement();
  rerender(queueHeader(change));
  expect(live).toHaveTextContent(message);
  unmount();
  // A view that opens knowing its queue differs (the workspace after Grid → Single) has nothing
  // new to say, nor does one that learns it while reading its query (the grid after Single → Grid).
  const reopened = render(queueHeader(change)).container;
  expect(reopened.querySelector("header > [aria-live='polite']")).toBeEmptyDOMElement();
  expect(screen.getByRole("button", { name: "Save to review" })).toBeInTheDocument();
  cleanup();
  const reading = render(queueHeader(undefined, { queueDiffers: undefined }));
  const readingLive = reading.container.querySelector("header > [aria-live='polite']")!;
  reading.rerender(queueHeader(change));
  expect(readingLive).toBeEmptyDOMElement();
  // Once known, a new difference is announced as usual.
  reading.rerender(queueHeader());
  reading.rerender(queueHeader(change));
  expect(readingLive).toHaveTextContent(message);
});

it("gives the chip row no room while it has nothing to show", () => {
  const toolbar = (chips: boolean) => (
    <fieldset className="dq-review-toolbar">
      <div>Controls</div>
      {chips && (
        <div role="region" aria-label="Applied filters">
          Chip
        </div>
      )}
    </fieldset>
  );
  const Nothing = () => null;
  const { container, rerender } = render(queueHeader(undefined, { toolbar: toolbar(false) }));
  const rowBreak = container.querySelector(".dq-review-header-break")!;
  expect(getComputedStyle(rowBreak).display).toBe("none");
  // The queue's buttons join the first row, so they bring no second one.
  rerender(queueHeader({ onReset: vi.fn() }, { toolbar: toolbar(false) }));
  expect(getComputedStyle(rowBreak).display).toBe("none");
  // An empty slot does not either.
  rerender(queueHeader(undefined, { toolbar: toolbar(false), chipsAfter: <Nothing /> }));
  expect(getComputedStyle(rowBreak).display).toBe("none");
  // The host's filter chips, the performer focus, tag bins or the draft note each need the row.
  for (const parts of [
    { toolbar: toolbar(true) },
    { toolbar: toolbar(false), chipsStart: <div className="dq-focus-chip">Only one</div> },
    { toolbar: toolbar(false), chipsAfter: <span>Bins</span> },
    { toolbar: toolbar(false), chipsEnd: <span>Previewing the draft</span> },
  ]) {
    rerender(queueHeader(undefined, parts));
    expect(getComputedStyle(rowBreak).display).not.toBe("none");
  }
});

/**
 * jsdom has no layout: a model of the header's first row. It holds `room.width` px; the parts that
 * can give way take the widths below while present and their step is not taken (the name, what
 * its inline width leaves), and the trail starts on a second row once they do not fit. Returns a
 * way to measure again, as a resize would, and what the observer watches.
 */
function modelledHeader(room: { width: number }) {
  let measure: (() => void) | undefined;
  const observed: Element[] = [];
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        measure = callback;
      }
      observe(target: Element) {
        observed.push(target);
      }
      disconnect() {}
    },
  );
  const parts = [
    ["queue", ".dq-queue-label", 151],
    ["summary", ".dq-scope-summary", 128],
    ["layout", ".dq-layout-label", 76],
    ["range", ".dq-review-toolbar span", 93],
  ] as const;
  const nameWidth = (header: HTMLElement) =>
    parseFloat(header.querySelector("h1")!.style.maxWidth) || 176;
  const rowWidth = (header: HTMLElement) => {
    const taken = header.dataset.compact?.split(" ") ?? [];
    return parts.reduce(
      (sum, [step, selector, width]) =>
        sum + (header.querySelector(selector) && !taken.includes(step) ? width : 0),
      1000 + nameWidth(header),
    );
  };
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    const header = this.closest("header")!;
    const width = this.tagName === "H1" ? nameWidth(header) : 0;
    const top = this.classList.contains("dq-review-header-trail") && rowWidth(header) > room.width ? 48 : 0;
    return { top, bottom: top + 32, height: 32, left: 0, right: width, width, x: 0, y: top } as DOMRect;
  });
  return { measureAgain: () => act(() => measure?.()), observed };
}

it("keeps the header on one row in wide windows, giving way only as far as that needs", () => {
  setViewportWidth(1440);
  // Without the queue's buttons the row takes 1473 px: 1000 fixed, a 176 px name, the summary, the
  // Single/Grid labels and the range text; their labels add 151 px.
  const room = { width: 1500 };
  const { measureAgain, observed } = modelledHeader(room);
  const change = { onSave: vi.fn(), onReset: vi.fn() };
  const parts = {
    toolbar: (
      <fieldset className="dq-review-toolbar">
        <div>
          <div>
            <span>1–40 of 90</span>
          </div>
        </div>
      </fieldset>
    ),
    trailing: (
      <>
        <button type="button">
          Scope <span className="dq-scope-summary">All performers</span>
        </button>
        <LayoutSwitch mode="single" onChange={vi.fn()} />
      </>
    ),
  };
  const { container, rerender } = render(queueHeader(undefined, parts));
  const header = container.querySelector("header")!;
  const name = header.querySelector("h1")!;
  const shown = (selector: string) => getComputedStyle(header.querySelector(selector)!).display !== "none";
  const labelled = (selector: string) => getComputedStyle(header.querySelector(selector)!).position !== "absolute";
  // It watches the header and both its ends for size changes.
  expect(observed).toEqual(
    expect.arrayContaining([
      header,
      header.querySelector(".dq-review-header-lead"),
      header.querySelector(".dq-review-header-trail"),
    ]),
  );
  expect(header).not.toHaveAttribute("data-compact");
  // The queue's buttons join the row, which is fitted again before it is painted, without waiting
  // for the observer: their labels give way first, their names stay.
  rerender(queueHeader(change, parts));
  expect(header).toHaveAttribute("data-compact", "queue");
  expect(labelled(".dq-queue-label")).toBe(false);
  expect(screen.getByRole("button", { name: "Save to review" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  expect(shown(".dq-scope-summary")).toBe(true);
  // Then the Scope summary.
  room.width = 1400;
  rerender(queueHeader({ ...change, saveDisabled: true }, parts));
  expect(header).toHaveAttribute("data-compact", "queue summary");
  expect(shown(".dq-scope-summary")).toBe(false);
  expect(labelled(".dq-layout-label")).toBe(true);
  expect(name.style.maxWidth).toBe("");
  // Less room, measured again: the name, a rem at a time and only as far as needed (1320 px fit
  // once it is 144 px wide).
  room.width = 1320;
  measureAgain();
  expect(header).toHaveAttribute("data-compact", "queue summary name");
  expect(name.style.maxWidth).toBe("144px");
  expect(labelled(".dq-layout-label")).toBe(true);
  // At 6rem it stops, and the Single/Grid labels go, whose titles then say what they show.
  room.width = 1200;
  measureAgain();
  expect(header).toHaveAttribute("data-compact", "queue summary name layout");
  expect(name.style.maxWidth).toBe("96px");
  expect(labelled(".dq-layout-label")).toBe(false);
  expect(screen.getByRole("button", { name: "Single" })).toHaveAttribute("title", "One item at a time");
  expect(shown(".dq-review-toolbar span")).toBe(true);
  // Then the range text.
  room.width = 1100;
  measureAgain();
  expect(header).toHaveAttribute("data-compact", "queue summary name layout range");
  expect(shown(".dq-review-toolbar span")).toBe(false);
  // Without the buttons, measured again (their leaving resizes the trail), the same steps apply,
  // except theirs.
  room.width = 1400;
  rerender(queueHeader(undefined, parts));
  measureAgain();
  expect(header).toHaveAttribute("data-compact", "summary");
  expect(name.style.maxWidth).toBe("");
  // A row that wraps even after every step gets everything back and wraps as narrow windows do.
  room.width = 1000;
  measureAgain();
  expect(header).not.toHaveAttribute("data-compact");
  expect(name.style.maxWidth).toBe("");
  // Nor does a render retry it before a size changes.
  rerender(queueHeader(undefined, { ...parts, name: "Review" }));
  expect(header).not.toHaveAttribute("data-compact");
  // With room again, nothing gives way.
  room.width = 2000;
  measureAgain();
  expect(header).not.toHaveAttribute("data-compact");
  // Narrower windows wrap the header by design.
  room.width = 1400;
  measureAgain();
  expect(header).toHaveAttribute("data-compact", "summary");
  act(() => setViewportWidth(1399));
  expect(header).not.toHaveAttribute("data-compact");
  expect(name.style.maxWidth).toBe("");
});

it("hands focus on to More, or to a queue button still offered, once Save to review or Reset is done", () => {
  const change = { onSave: vi.fn(), onReset: vi.fn() };
  const more = () => screen.getByRole("button", { name: "More review options" });
  const { rerender } = render(queueHeader(change));
  // Reset: the buttons leave at once, and focus goes to More.
  const reset = screen.getByRole("button", { name: "Reset" });
  reset.focus();
  fireEvent.click(reset);
  rerender(queueHeader());
  expect(more()).toHaveFocus();
  // Save to review waits disabled while it saves; the buttons then leave, and focus goes to More.
  rerender(queueHeader(change));
  let save = screen.getByRole("button", { name: "Save to review" });
  save.focus();
  fireEvent.click(save);
  expect(change.onSave).toHaveBeenCalledTimes(1);
  // A render before the save starts changes nothing.
  rerender(queueHeader(change));
  expect(save).toHaveFocus();
  rerender(queueHeader({ ...change, saveDisabled: true, resetDisabled: true }));
  expect(more()).not.toHaveFocus();
  rerender(queueHeader());
  expect(more()).toHaveFocus();
  // A save that fails keeps the buttons: focus returns to Save to review for another try.
  rerender(queueHeader(change));
  save = screen.getByRole("button", { name: "Save to review" });
  save.focus();
  fireEvent.click(save);
  rerender(queueHeader({ ...change, saveDisabled: true, resetDisabled: true }));
  act(() => (document.activeElement as HTMLElement).blur());
  rerender(queueHeader(change));
  expect(screen.getByRole("button", { name: "Save to review" })).toHaveFocus();
  // After a save that tag bins outlive, Reset has taken Save to review's place.
  fireEvent.click(screen.getByRole("button", { name: "Save to review" }));
  rerender(queueHeader({ ...change, saveDisabled: true, resetDisabled: true }));
  rerender(queueHeader({ onReset: change.onReset }));
  expect(screen.getByRole("button", { name: "Reset" })).toHaveFocus();
  // More waits while it is disabled (a queue reloading after Reset).
  const withMore = (disabled: boolean, queueChange?: QueueChange) =>
    queueHeader(queueChange, { trailingEnd: <MoreMenu items={[]} disabled={disabled} /> });
  rerender(withMore(false, { onReset: change.onReset }));
  fireEvent.click(screen.getByRole("button", { name: "Reset" }));
  rerender(withMore(true));
  expect(document.body).toHaveFocus();
  rerender(withMore(false));
  expect(more()).toHaveFocus();
  // Focus the reviewer moved elsewhere meanwhile stays there.
  rerender(withMore(false, { onReset: change.onReset }));
  fireEvent.click(screen.getByRole("button", { name: "Reset" }));
  rerender(withMore(true));
  const name = screen.getByRole("heading", { name: "Review" });
  name.tabIndex = -1;
  name.focus();
  rerender(withMore(false));
  expect(name).toHaveFocus();
});
