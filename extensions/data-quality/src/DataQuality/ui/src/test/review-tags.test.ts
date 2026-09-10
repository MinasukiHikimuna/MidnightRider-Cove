import { beforeEach, expect, it, vi } from "vitest";
import { extensionFetch } from "@cove/runtime/api";
import {
  checkUndo,
  readTags,
  editTags,
  undoTags,
  undoOperation,
  type ReviewItem,
} from "../reviewTags";
import type { VideoReview } from "../model";
const fetch = vi.mocked(extensionFetch);
const rule: VideoReview = {
  id: "r",
  name: "",
  description: "",
  actions: [],
  view: {
    filter: {},
    objectFilter: {},
    displayMode: "grid",
    searchMode: "text",
  },
};
const video = {
  id: 1,
  performers: [{ id: 11, name: "Performer" }],
  files: [],
  updatedAt: "",
};
const item: ReviewItem = { key: "1", video };
const before = { ids: [3], names: ["Before"], absent: [] };
const after = { ids: [4, 5], names: ["Added", "Added too"], absent: [] };
const respond = (body: unknown) =>
  Promise.resolve(new Response(JSON.stringify(body)));
beforeEach(() => fetch.mockReset());
it("undo removes only its multi-tag operation and preserves unrelated tags", async () => {
  fetch.mockImplementation((_path, init) =>
    respond(
      init?.method
        ? {}
        : { ...video, tags: [{ id: 4 }, { id: 5 }, { id: 99 }] },
    ),
  );
  await undoTags(rule, undoOperation(item, before, after, [3, 4, 5]));
  const writes = fetch.mock.calls
    .filter((call) => call[1]?.method === "POST")
    .map((call) => JSON.parse(String(call[1]?.body)));
  expect(writes).toEqual([
    { ids: [1], tagMode: "ADD", tagIds: [3] },
    { ids: [1], tagMode: "REMOVE", tagIds: [4, 5] },
  ]);
});
it.each([
  { ids: [4], names: [], absent: [] },
  { ids: [3, 4, 5], names: [], absent: [] },
])("rejects a conflicting undo without writing", async (current) => {
  fetch.mockImplementation(() =>
    respond({ ...video, tags: current.ids.map((id) => ({ id })) }),
  );
  await expect(
    undoTags(rule, undoOperation(item, before, after, [3, 4, 5])),
  ).rejects.toThrow("Undo conflict");
  expect(fetch.mock.calls.every((call) => !call[1]?.method)).toBe(true);
});
it("detects an occurrence application deleted and re-created by another writer", () => {
  const application = {
    id: 1,
    hostType: "video",
    hostId: 1,
    contextType: "performer",
    contextId: 11,
    tag: { id: 4, name: "Tag" },
  };
  const state = {
    ids: [4],
    names: ["Tag"],
    absent: [],
    applications: [application],
  };
  const operation = undoOperation(
    item,
    { ...state, ids: [], applications: [] },
    state,
    [4],
  );
  expect(() =>
    checkUndo(operation, {
      ...state,
      applications: [{ ...application, id: 2 }],
    }),
  ).toThrow("Undo conflict");
});
it("preserves occurrence context and unrelated applications during ad hoc editing", async () => {
  const application = {
    id: 50,
    hostType: "video",
    hostId: 1,
    contextType: "performer",
    contextId: 11,
    tag: { id: 3, name: "Remove" },
  };
  const unrelated = { ...application, id: 51, tag: { id: 99, name: "Keep" } };
  fetch.mockImplementation((path) =>
    respond(String(path).split("?")[0] === "/api/videos/1" ? video : [application, unrelated]),
  );
  const occurrence = {
    key: "1:11",
    video,
    performer: video.performers[0],
    applications: [application, unrelated],
  };
  await editTags(
    {
      ...rule,
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
    },
    { ...item, occurrence },
    { added: [4], removed: [3] },
  );
  const post = fetch.mock.calls.find((call) => call[1]?.method === "POST");
  expect(JSON.parse(String(post?.[1]?.body))).toMatchObject({
    hostType: "video",
    hostId: 1,
    contextType: "performer",
    contextId: 11,
    tagId: 4,
  });
  expect(
    fetch.mock.calls
      .filter((call) => call[1]?.method === "DELETE")
      .map((call) => call[0]),
  ).toEqual(["/api/tagapplications/50"]);
});
it("reads and undoes absence changes using the existing mixed-case field key", async () => {
  fetch.mockImplementation((_path, init) =>
    respond(
      init?.method
        ? {}
        : {
            ...video,
            tags: [{ id: 99 }],
            customFields: { Confirmed_Absent_Tags: [4, 98], unrelated: "keep" },
          },
    ),
  );
  const state = await readTags(item);
  expect(state.absent).toEqual([4, 98]);
  const operation = undoOperation(
    item,
    { ids: [4], names: [], absent: [] },
    { ids: [], names: [], absent: [4] },
    [4],
  );
  await undoTags(rule, operation);
  const put = fetch.mock.calls.find((call) => call[1]?.method === "PUT");
  expect(JSON.parse(String(put?.[1]?.body))).toEqual({
    tagIds: [99, 4],
    customFields: { Confirmed_Absent_Tags: [98], unrelated: "keep" },
  });
});

it("uses fresh detail URLs for before/after reads instead of cached tag snapshots", async () => {
  const cache = new Map<string, unknown>();
  let currentIds = [3];
  fetch.mockImplementation((path) => {
    if (!cache.has(String(path))) cache.set(String(path), { ...video, tags: currentIds.map(id => ({ id })) });
    return respond(cache.get(String(path)));
  });
  const before = await readTags(item);
  currentIds = [4];
  const after = await readTags(item);
  expect(before.ids).toEqual([3]);
  expect(after.ids).toEqual([4]);
  expect(fetch.mock.calls[0][0]).not.toBe(fetch.mock.calls[1][0]);
  expect(fetch.mock.calls[0][1]).toMatchObject({ cache: "no-store" });
});

it("supports fresh reads on LAN HTTP where crypto.randomUUID is unavailable", async () => {
  vi.stubGlobal("crypto", {});
  try {
    fetch.mockImplementation(() => respond({ ...video, tags: [] }));
    await readTags(item);
    await readTags(item);
    expect(fetch.mock.calls[0][0]).not.toBe(fetch.mock.calls[1][0]);
  } finally {
    vi.unstubAllGlobals();
  }
});
