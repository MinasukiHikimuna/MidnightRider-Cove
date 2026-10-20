import { beforeEach, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { extensionFetch } from "@cove/runtime/api";
import { recordChange, setHistoryScope } from "../history";
import { RecentChanges } from "../RecentChanges";

const fetch = vi.mocked(extensionFetch);
let tags: number[];
const response = (body: unknown) => Promise.resolve(new Response(JSON.stringify(body)));

beforeEach(() => {
  fetch.mockReset();
  localStorage.clear();
  setHistoryScope("dialog-test");
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  tags = [5, 7];
  fetch.mockImplementation((path, init) => {
    const url = new URL(String(path), "http://test");
    if (url.pathname === "/api/videos/bulk") {
      const body = JSON.parse(String(init!.body));
      tags =
        body.tagMode === "REMOVE"
          ? tags.filter((id) => !body.tagIds.includes(id))
          : [...new Set([...tags, ...body.tagIds])];
      return response({});
    }
    if (url.pathname === "/api/videos/1")
      return response({
        id: 1,
        title: "Scene",
        files: [],
        performers: [],
        tags: tags.map((id) => ({ id, name: `Tag ${id}` })),
        customFields: {},
      });
    if (url.pathname.startsWith("/api/tags/"))
      return response({ id: Number(url.pathname.split("/").pop()), name: "Loaded" });
    throw new Error(`Unexpected request ${path}`);
  });
  recordChange({
    id: "one",
    at: Date.UTC(2026, 9, 20, 8),
    label: "Facial",
    reviewName: "Finishers",
    kind: "video",
    items: [
      {
        mediaId: 1,
        title: "Scene",
        tags: { added: [7], removed: [] },
        absence: { added: [], removed: [] },
        names: { 7: "Facial" },
      },
    ],
  });
});

it("lists a recorded change with its item, undoes it and keeps focus in the dialog", async () => {
  const onUndone = vi.fn();
  const onClose = vi.fn();
  render(<RecentChanges onClose={onClose} onUndone={onUndone} />);
  const dialog = screen.getByRole("dialog", { name: "Recent changes" });
  const record = within(dialog).getByRole("region", { name: "Facial" });
  expect(record).toHaveTextContent("Finishers");
  expect(within(record).getByRole("link", { name: "Scene" })).toHaveAttribute("href", "/video/1");
  expect(record).toHaveTextContent("+ Facial");

  fireEvent.click(within(record).getByRole("button", { name: "Undo" }));

  await waitFor(() => expect(onUndone).toHaveBeenCalled());
  expect(tags).toEqual([5]);
  expect(await within(record).findAllByText("Undone")).not.toHaveLength(0);
  expect(within(record).getByRole("button", { name: "Undo" })).toBeDisabled();
  await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));

  fireEvent(dialog, new Event("cancel", { cancelable: true }));
  expect(onClose).toHaveBeenCalled();
});

it("asks before clearing the history, and clearing undoes nothing", () => {
  render(<RecentChanges onClose={() => {}} onUndone={() => {}} />);
  fireEvent.click(screen.getByRole("button", { name: "Clear history…" }));
  fireEvent.click(screen.getByRole("button", { name: "Keep it" }));
  expect(screen.getByRole("region", { name: "Facial" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Clear history…" }));
  fireEvent.click(screen.getByRole("button", { name: "Clear history" }));
  expect(screen.getByText("No changes recorded yet.")).toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled();
});
