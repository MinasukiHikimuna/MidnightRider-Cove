import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { extensionFetch } from "@cove/runtime/api";
import { ActionsFromTags } from "../ActionsFromTags";
import {
  actionsByAddedTag,
  childTagAction,
  distinctChildGroups,
  loadChildTagGroup,
  parentsOfChildren,
} from "../childTagActions";
import type { AudioReview, OccurrenceReview, VideoReview } from "../model";

const fetchMock = vi.mocked(extensionFetch);
const response = (body: unknown, status = 200) =>
  Promise.resolve(new Response(JSON.stringify(body), { status }));

const videoReview: VideoReview = {
  id: "locations",
  name: "Locations",
  description: "",
  view: {
    filter: { page: 1, perPage: 40 },
    objectFilter: {},
    displayMode: "grid",
    searchMode: "text",
  },
  actions: [{ id: "indoors", label: "Indoors", steps: [{ mode: "ADD", tagIds: [2] }] }],
};
const audioReview: AudioReview = { ...videoReview, entityType: "audio" };
const occurrenceReview: OccurrenceReview = {
  ...videoReview,
  entityType: "performerOccurrence",
  actions: [],
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

const tags: Record<number, { name: string; parents: number[]; videoCount: number; audioCount: number; occurrences: number }> = {
  1: { name: "Generic", parents: [], videoCount: 0, audioCount: 0, occurrences: 0 },
  2: { name: "Indoors", parents: [1], videoCount: 4390, audioCount: 1, occurrences: 0 },
  3: { name: "Outdoors", parents: [1, 10, 30], videoCount: 1608, audioCount: 7, occurrences: 0 },
  10: { name: "Specific", parents: [], videoCount: 0, audioCount: 0, occurrences: 0 },
  11: { name: "Kitchen", parents: [10], videoCount: 284, audioCount: 0, occurrences: 0 },
  12: { name: "Bedroom", parents: [10], videoCount: 1107, audioCount: 0, occurrences: 0 },
  13: { name: "Attic", parents: [10], videoCount: 284, audioCount: 0, occurrences: 0 },
  20: { name: "Pubic Hair", parents: [], videoCount: 0, audioCount: 0, occurrences: 0 },
  21: { name: "Hairy", parents: [20], videoCount: 1302, audioCount: 0, occurrences: 3 },
  22: { name: "Trimmed", parents: [20], videoCount: 3342, audioCount: 0, occurrences: 71 },
  23: { name: "Shaved", parents: [20], videoCount: 2, audioCount: 0, occurrences: 109 },
  30: { name: "Open air", parents: [], videoCount: 0, audioCount: 0, occurrences: 0 },
};
let failParent: number | null;

beforeEach(() => {
  failParent = null;
  fetchMock.mockReset().mockImplementation((path, init) => {
    const route = String(path);
    const body = init?.body ? JSON.parse(String(init.body)) : {};
    if (route === "/api/tags/find") {
      const parent = body.objectFilter.parentsCriterion.value[0];
      const items = Object.entries(tags)
        .filter(([, tag]) => tag.parents.includes(parent))
        .map(([id, tag]) => ({ id: Number(id), name: tag.name, videoCount: tag.videoCount, audioCount: tag.audioCount }));
      return response({ items, totalCount: items.length });
    }
    if (route.startsWith("/api/tags/")) {
      const id = Number(route.split("/").pop());
      if (id === failParent) return response({ message: "Tag service down" }, 500);
      return response({ id, name: tags[id].name });
    }
    if (route.endsWith("/aggregate")) {
      const id = body.objectFilter.performerFilterCriterion.performerOccurrenceTagsCriterion.value[0];
      return response({ count: tags[id].occurrences });
    }
    throw new Error(`Unexpected request ${route}`);
  });
});

const names = (group: { children: Array<{ name: string }> }) => group.children.map((child) => child.name);

it("loads a parent's direct children with their video counts, most used first", async () => {
  const group = await loadChildTagGroup(videoReview, 10);
  expect(group.parent).toEqual({ id: 10, name: "Specific" });
  // Ties fall back to the name, so equally used tags keep a stable order.
  expect(group.children).toEqual([
    { id: 3, name: "Outdoors", uses: 1608 },
    { id: 12, name: "Bedroom", uses: 1107 },
    { id: 13, name: "Attic", uses: 284 },
    { id: 11, name: "Kitchen", uses: 284 },
  ]);
  const find = fetchMock.mock.calls.find(([path]) => path === "/api/tags/find")!;
  expect(JSON.parse(String(find[1]?.body)).objectFilter).toEqual({
    parentsCriterion: { value: [10], modifier: "includes" },
  });
  expect(fetchMock.mock.calls.some(([path]) => String(path).endsWith("/aggregate"))).toBe(false);
});

it("orders audio reviews by audio counts", async () => {
  expect(names(await loadChildTagGroup(audioReview, 1))).toEqual(["Outdoors", "Indoors"]);
});

it("orders occurrence reviews by how often performers' appearances carry each tag", async () => {
  const group = await loadChildTagGroup(occurrenceReview, 20);
  // Video tag counts would put Shaved last; appearances put it first.
  expect(group.children).toEqual([
    { id: 23, name: "Shaved", uses: 109 },
    { id: 22, name: "Trimmed", uses: 71 },
    { id: 21, name: "Hairy", uses: 3 },
  ]);
  const counts = fetchMock.mock.calls.filter(([path]) => String(path).endsWith("/aggregate"));
  expect(counts.map(([path]) => path)).toEqual([
    "/api/videos/aggregate",
    "/api/videos/aggregate",
    "/api/videos/aggregate",
  ]);
  expect(JSON.parse(String(counts[0][1]?.body)).objectFilter).toEqual({
    performerFilterCriterion: {
      mode: "atLeastOne",
      conditionOperator: "and",
      performerOccurrenceTagsCriterion: { modifier: "includes", value: [21], depth: 0 },
    },
  });
  fetchMock.mockClear();
  await loadChildTagGroup({ ...occurrenceReview, entityType: "audioPerformerOccurrence" }, 20);
  expect(
    fetchMock.mock.calls.filter(([path]) => path === "/api/audios/aggregate"),
  ).toHaveLength(3);
});

it("pages through parents with more children than one page holds", async () => {
  const many = Array.from({ length: 1001 }, (_, index) => ({ id: 100 + index, name: `Child ${index}`, videoCount: index }));
  fetchMock.mockImplementation((path, init) => {
    if (path !== "/api/tags/find") return response({ id: 1, name: "Big" });
    const { page, perPage } = JSON.parse(String(init?.body)).findFilter;
    return response({ items: many.slice((page - 1) * perPage, page * perPage), totalCount: many.length });
  });
  const group = await loadChildTagGroup(videoReview, 1);
  expect(group.children).toHaveLength(1001);
  expect(group.children[0]).toEqual({ id: 1100, name: "Child 1000", uses: 1000 });
});

it("offers a tag with two chosen parents once, under the first, and remembers both parents", () => {
  const generic = { parent: { id: 1, name: "Generic" }, children: [{ id: 3, name: "Outdoors", uses: 1 }] };
  const specific = { parent: { id: 10, name: "Specific" }, children: [{ id: 3, name: "Outdoors", uses: 1 }, { id: 11, name: "Kitchen", uses: 1 }] };
  expect(distinctChildGroups([generic, specific]).map(names)).toEqual([["Outdoors"], ["Kitchen"]]);
  expect(distinctChildGroups([specific, generic]).map(names)).toEqual([["Outdoors", "Kitchen"], []]);
  expect([...parentsOfChildren([generic, specific])]).toEqual([
    [3, [1, 10]],
    [11, [10]],
  ]);
});

it("keys a group by the requested parent even when the server answers with another id", async () => {
  const original = fetchMock.getMockImplementation()!;
  fetchMock.mockImplementation((path, init) =>
    path === "/api/tags/20" ? response({ id: 99, name: "Pubic Hair" }) : original(path, init),
  );
  expect((await loadChildTagGroup(videoReview, 20)).parent).toEqual({ id: 20, name: "Pubic Hair" });
});

it("stops counting appearances after the first failed count", async () => {
  const many = Array.from({ length: 40 }, (_, index) => ({ id: 100 + index, name: `Child ${index}` }));
  let sent = 0;
  fetchMock.mockImplementation((path, init) => {
    if (path === "/api/tags/find") return response({ items: many, totalCount: many.length });
    if (String(path).endsWith("/aggregate")) {
      // Like fetch, an already aborted request never reaches the server.
      if (init?.signal?.aborted) return Promise.reject(new DOMException("Aborted", "AbortError"));
      sent++;
      return sent === 3 ? response({ message: "Count failed" }, 500) : response({ count: 1 });
    }
    return response({ id: 1, name: "Big" });
  });
  await expect(loadChildTagGroup(occurrenceReview, 1)).rejects.toThrow("Count failed");
  await new Promise((resolve) => setTimeout(resolve, 0));
  // Five counts were running when the third failed; at most one more each could start before
  // the failure was seen, instead of all forty.
  expect(sent).toBeLessThanOrEqual(10);
});

it("treats added and marked-present tags as covered, but not removed or absent ones", () => {
  const actions = [
    { id: "add", label: "Add", steps: [{ mode: "ADD" as const, tagIds: [1, 2] }] },
    { id: "present", label: "Present", steps: [{ mode: "MARK_PRESENT" as const, tagIds: [3] }] },
    { id: "absent", label: "Absent", steps: [{ mode: "MARK_ABSENT" as const, tagIds: [4] }, { mode: "REMOVE" as const, tagIds: [5] }] },
  ];
  const adding = actionsByAddedTag(actions);
  expect([1, 2, 3, 4, 5].map((id) => (adding.get(id) ?? []).map((action) => action.id))).toEqual([
    ["add"], ["add"], ["present"], [], [],
  ]);
});

it("builds an adding action, and an only-one action that also removes the parents' trees", () => {
  const child = { id: 23, name: "Shaved" };
  const plain = childTagAction(child, []);
  const onlyOne = childTagAction(child, [20]);
  expect(childTagAction(child, [20, 30]).steps).toEqual([
    { mode: "ADD", tagIds: [23] },
    { mode: "REMOVE_TREE", tagIds: [20, 30] },
  ]);
  expect(plain).toMatchObject({ label: "Shaved", steps: [{ mode: "ADD", tagIds: [23] }] });
  expect(onlyOne).toMatchObject({
    label: "Shaved",
    steps: [
      { mode: "ADD", tagIds: [23] },
      { mode: "REMOVE_TREE", tagIds: [20] },
    ],
  });
  expect(plain.id).not.toBe(onlyOne.id);
});

it("adds the ticked children of several parents in order, skipping ones an action adds", async () => {
  const onAdd = vi.fn();
  render(<ActionsFromTags review={videoReview} disabled={false} onAdd={onAdd} onCancel={vi.fn()} />);
  fireEvent.change(screen.getByPlaceholderText("Search parent tags..."), { target: { value: "1,10" } });
  const generic = await screen.findByRole("group", { name: "Generic" });
  const specific = await screen.findByRole("group", { name: "Specific" });
  // Indoors already has an action, so it starts unticked; Outdoors is offered under Generic only.
  expect(within(generic).getByRole("checkbox", { name: /Indoors/ })).not.toBeChecked();
  expect(within(generic).getByText(/Already in “Indoors”/)).toBeInTheDocument();
  expect(within(generic).getByRole("checkbox", { name: /Outdoors/ })).toBeChecked();
  expect(within(generic).getByText(/Also under “Specific”/)).toBeInTheDocument();
  expect(within(specific).queryByRole("checkbox", { name: /Outdoors/ })).not.toBeInTheDocument();
  expect(
    within(specific).getAllByRole("checkbox", { name: /videos/ }).map((box) => box.closest("label")!.textContent),
  ).toEqual(["Bedroom 1,107 videos", "Attic 284 videos", "Kitchen 284 videos"]);
  expect(screen.getByRole("button", { name: "Add 4 actions" })).toBeEnabled();

  fireEvent.click(within(specific).getByRole("button", { name: "Select none of the child tags of Specific" }));
  fireEvent.click(within(specific).getByRole("checkbox", { name: /Kitchen/ }));
  fireEvent.click(within(generic).getByRole("checkbox", { name: /Only one per video/ }));
  fireEvent.click(screen.getByRole("button", { name: "Add 2 actions" }));
  expect(onAdd).toHaveBeenCalledTimes(1);
  expect(onAdd.mock.calls[0][0]).toEqual([
    {
      id: expect.any(String),
      label: "Outdoors",
      steps: [
        { mode: "ADD", tagIds: [3] },
        { mode: "REMOVE_TREE", tagIds: [1] },
      ],
    },
    { id: expect.any(String), label: "Kitchen", steps: [{ mode: "ADD", tagIds: [11] }] },
  ]);
});

it("words the only-one choice per performer in occurrence reviews and shows appearance counts", async () => {
  render(<ActionsFromTags review={occurrenceReview} disabled={false} onAdd={vi.fn()} onCancel={vi.fn()} />);
  fireEvent.change(screen.getByPlaceholderText("Search parent tags..."), { target: { value: "20" } });
  const group = await screen.findByRole("group", { name: "Pubic Hair" });
  expect(
    within(group).getByRole("checkbox", { name: "Only one per performer: each action removes every other tag in the Pubic Hair tree" }),
  ).not.toBeChecked();
  expect(within(group).getByRole("checkbox", { name: /Shaved 109 videos/ })).toBeChecked();
  expect(screen.getByText(/most used on performers first/)).toBeInTheDocument();
});

it("reports a parent that failed to load and retries it", async () => {
  failParent = 20;
  render(<ActionsFromTags review={videoReview} disabled={false} onAdd={vi.fn()} onCancel={vi.fn()} />);
  fireEvent.change(screen.getByPlaceholderText("Search parent tags..."), { target: { value: "20" } });
  expect(await screen.findByRole("alert")).toHaveTextContent("Tag service down");
  expect(screen.getByRole("button", { name: "Add actions" })).toBeDisabled();
  failParent = null;
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  await screen.findByRole("group", { name: "Pubic Hair" });
  await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
  expect(screen.getByRole("button", { name: "Add 3 actions" })).toBeEnabled();
});

it("forgets a parent that is removed again and cancels its pending load", async () => {
  const signals: AbortSignal[] = [];
  const original = fetchMock.getMockImplementation()!;
  fetchMock.mockImplementation((path, init) => {
    if (path === "/api/tags/10") signals.push(init!.signal!);
    return original(path, init);
  });
  render(<ActionsFromTags review={videoReview} disabled={false} onAdd={vi.fn()} onCancel={vi.fn()} />);
  const parents = screen.getByPlaceholderText("Search parent tags...");
  fireEvent.change(parents, { target: { value: "10,20" } });
  fireEvent.change(parents, { target: { value: "20" } });
  expect(signals.map((signal) => signal.aborted)).toEqual([true]);
  await screen.findByRole("group", { name: "Pubic Hair" });
  expect(screen.queryByRole("group", { name: "Specific" })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Add 3 actions" })).toBeEnabled();
});

it("removes the tree of every only-one parent a shared child belongs to", async () => {
  const onAdd = vi.fn();
  render(<ActionsFromTags review={videoReview} disabled={false} onAdd={onAdd} onCancel={vi.fn()} />);
  fireEvent.change(screen.getByPlaceholderText("Search parent tags..."), { target: { value: "1,10" } });
  const generic = await screen.findByRole("group", { name: "Generic" });
  const specific = await screen.findByRole("group", { name: "Specific" });
  fireEvent.click(within(specific).getByRole("button", { name: "Select none of the child tags of Specific" }));
  // Outdoors is listed under Generic, but Specific's choice applies to it as well.
  fireEvent.click(within(specific).getByRole("checkbox", { name: /Only one per video/ }));
  fireEvent.click(screen.getByRole("button", { name: "Add 1 action" }));
  expect(onAdd.mock.calls[0][0][0]).toMatchObject({
    label: "Outdoors",
    steps: [
      { mode: "ADD", tagIds: [3] },
      { mode: "REMOVE_TREE", tagIds: [10] },
    ],
  });
  fireEvent.click(within(generic).getByRole("checkbox", { name: /Only one per video/ }));
  fireEvent.click(screen.getByRole("button", { name: "Add 1 action" }));
  expect(onAdd.mock.calls[1][0][0].steps[1]).toEqual({ mode: "REMOVE_TREE", tagIds: [1, 10] });
});

it("waits for every chosen parent before adding, because an earlier one decides where children go", async () => {
  let release!: () => void;
  const original = fetchMock.getMockImplementation()!;
  fetchMock.mockImplementation((path, init) =>
    path === "/api/tags/1"
      ? new Promise<Response>((resolve) => {
          release = () => resolve(new Response(JSON.stringify({ id: 1, name: "Generic" })));
        })
      : original(path, init),
  );
  render(<ActionsFromTags review={videoReview} disabled={false} onAdd={vi.fn()} onCancel={vi.fn()} />);
  fireEvent.change(screen.getByPlaceholderText("Search parent tags..."), { target: { value: "1,10" } });
  await screen.findByRole("group", { name: "Specific" });
  expect(screen.getByRole("status")).toHaveTextContent("Loading child tags…");
  expect(screen.getByRole("button", { name: "Add actions" })).toBeDisabled();
  release();
  await screen.findByRole("group", { name: "Generic" });
  expect(screen.getByRole("status")).toHaveTextContent("");
  // Outdoors moved to Generic, the first parent, and Indoors has an action already.
  expect(screen.getByRole("button", { name: "Add 4 actions" })).toBeEnabled();
});

it("disables every control while the review is saving", async () => {
  const props = { review: videoReview, onAdd: vi.fn(), onCancel: vi.fn() };
  const { rerender } = render(<ActionsFromTags {...props} disabled={false} />);
  fireEvent.change(screen.getByPlaceholderText("Search parent tags..."), { target: { value: "20" } });
  const group = await screen.findByRole("group", { name: "Pubic Hair" });
  rerender(<ActionsFromTags {...props} disabled />);
  expect(screen.getByPlaceholderText("Search parent tags...")).toBeDisabled();
  for (const control of [
    ...within(group).getAllByRole("checkbox"),
    ...within(group).getAllByRole("button"),
  ])
    expect(control).toBeDisabled();
  expect(screen.getByRole("button", { name: "Add 3 actions" })).toBeDisabled();
});

it("offers the only-one choice of a parent whose children are all listed earlier, and forgets it with the parent", async () => {
  const onAdd = vi.fn();
  render(<ActionsFromTags review={videoReview} disabled={false} onAdd={onAdd} onCancel={vi.fn()} />);
  const parents = screen.getByPlaceholderText("Search parent tags...");
  fireEvent.change(parents, { target: { value: "1,30" } });
  const openAir = await screen.findByRole("group", { name: "Open air" });
  expect(within(openAir).getByText("Every child tag is already listed under an earlier parent.")).toBeInTheDocument();
  fireEvent.click(within(openAir).getByRole("checkbox", { name: /Only one per video/ }));
  fireEvent.click(screen.getByRole("button", { name: "Add 1 action" }));
  expect(onAdd.mock.calls[0][0][0]).toMatchObject({
    label: "Outdoors",
    steps: [
      { mode: "ADD", tagIds: [3] },
      { mode: "REMOVE_TREE", tagIds: [30] },
    ],
  });
  fireEvent.change(parents, { target: { value: "1" } });
  fireEvent.change(parents, { target: { value: "1,30" } });
  const again = await screen.findByRole("group", { name: "Open air" });
  expect(within(again).getByRole("checkbox", { name: /Only one per video/ })).not.toBeChecked();
  fireEvent.click(screen.getByRole("button", { name: "Add 1 action" }));
  expect(onAdd.mock.calls[1][0][0].steps).toEqual([{ mode: "ADD", tagIds: [3] }]);
});

it("keeps a child's tick when an earlier parent loads later and takes the child over", async () => {
  let release!: () => void;
  const original = fetchMock.getMockImplementation()!;
  fetchMock.mockImplementation((path, init) =>
    path === "/api/tags/1"
      ? new Promise<Response>((resolve) => {
          release = () => resolve(new Response(JSON.stringify({ id: 1, name: "Generic" })));
        })
      : original(path, init),
  );
  render(<ActionsFromTags review={videoReview} disabled={false} onAdd={vi.fn()} onCancel={vi.fn()} />);
  fireEvent.change(screen.getByPlaceholderText("Search parent tags..."), { target: { value: "1,10" } });
  const specific = await screen.findByRole("group", { name: "Specific" });
  fireEvent.click(within(specific).getByRole("checkbox", { name: /Outdoors/ }));
  release();
  const generic = await screen.findByRole("group", { name: "Generic" });
  expect(within(generic).getByRole("checkbox", { name: /Outdoors/ })).not.toBeChecked();
  // Bedroom, Attic and Kitchen; Indoors has an action and Outdoors stays unticked.
  expect(screen.getByRole("button", { name: "Add 3 actions" })).toBeEnabled();
});

it("keeps adding disabled while one chosen parent failed and another loaded", async () => {
  failParent = 20;
  render(<ActionsFromTags review={videoReview} disabled={false} onAdd={vi.fn()} onCancel={vi.fn()} />);
  fireEvent.change(screen.getByPlaceholderText("Search parent tags..."), { target: { value: "10,20" } });
  await screen.findByRole("group", { name: "Specific" });
  expect(await screen.findByRole("alert")).toHaveTextContent("Tag service down");
  expect(screen.getByRole("button", { name: "Add actions" })).toBeDisabled();
});

it("cancels appearance counts still running when the panel closes", async () => {
  const counts: AbortSignal[] = [];
  const original = fetchMock.getMockImplementation()!;
  fetchMock.mockImplementation((path, init) => {
    if (!String(path).endsWith("/aggregate")) return original(path, init);
    counts.push(init!.signal!);
    return new Promise<Response>(() => {});
  });
  const { unmount } = render(
    <ActionsFromTags review={occurrenceReview} disabled={false} onAdd={vi.fn()} onCancel={vi.fn()} />,
  );
  fireEvent.change(screen.getByPlaceholderText("Search parent tags..."), { target: { value: "20" } });
  await waitFor(() => expect(counts).toHaveLength(3));
  expect(counts.some((signal) => signal.aborted)).toBe(false);
  unmount();
  expect(counts.every((signal) => signal.aborted)).toBe(true);
});
