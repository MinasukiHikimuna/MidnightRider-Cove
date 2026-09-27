import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { useTagTrees } from "../effectPreview";
import type { MediaReviewAction } from "../model";

const api = vi.hoisted(() => ({ resolveTagTree: vi.fn() }));
vi.mock("../api", async (original) => ({
  ...(await original<typeof import("../api")>()),
  resolveTagTree: api.resolveTagTree,
}));

beforeEach(() => {
  api.resolveTagTree.mockReset();
});

function Trees({ actions }: { actions: MediaReviewAction[] }) {
  const trees = useTagTrees(actions);
  return (
    <output>
      {[...trees]
        .sort(([left], [right]) => left - right)
        .map(([parent, ids]) => `${parent}:${ids.join(",")}`)
        .join(" ")}
    </output>
  );
}

const removing = (...parents: number[]): MediaReviewAction[] =>
  parents.map((parent) => ({
    id: `a${parent}`,
    label: `Action ${parent}`,
    steps: [
      { mode: "ADD", tagIds: [parent + 1] },
      { mode: "REMOVE_TREE", tagIds: [parent] },
    ],
  }));

it("resolves each removal tree once while the view stays mounted", async () => {
  api.resolveTagTree.mockImplementation(async ([parent]: number[]) => [parent, parent + 1]);
  const { rerender } = render(<Trees actions={removing(10, 20)} />);
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("10:10,11 20:20,21"));
  // New action objects naming the same parents, and a shared parent, ask for nothing again.
  rerender(<Trees actions={[...removing(20, 10), ...removing(10)]} />);
  rerender(<Trees actions={removing(10, 20, 30)} />);
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("10:10,11 20:20,21 30:30,31"),
  );
  expect(api.resolveTagTree.mock.calls.map(([parents]) => parents)).toEqual([[10], [20], [30]]);
});

it("asks again for a tree that failed once the actions change", async () => {
  api.resolveTagTree
    .mockRejectedValueOnce(new Error("offline"))
    .mockImplementation(async ([parent]: number[]) => [parent]);
  const { rerender } = render(<Trees actions={removing(10)} />);
  await waitFor(() => expect(api.resolveTagTree).toHaveBeenCalledTimes(1));
  expect(screen.getByRole("status")).toHaveTextContent("");
  rerender(<Trees actions={removing(10, 20)} />);
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("10:10 20:20"));
});
