import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { LayoutSwitch, MoreMenu, ReviewPager } from "../ReviewHeader";

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
