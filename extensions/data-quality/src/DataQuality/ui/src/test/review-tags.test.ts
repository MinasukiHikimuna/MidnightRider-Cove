import { beforeEach, expect, it, vi } from "vitest";
import { extensionFetch } from "@cove/runtime/api";
import {
  checkUndo,
  readTags,
  editTags,
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
const item: ReviewItem = { key: "1", media: video };
const respond = (body: unknown) =>
  Promise.resolve(new Response(JSON.stringify(body)));
beforeEach(() => fetch.mockReset());
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
    media: video,
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
it("uses fresh detail URLs for before/after reads instead of cached tag snapshots", async () => {
  const cache = new Map<string, unknown>();
  let currentIds = [3];
  fetch.mockImplementation((path) => {
    if (!cache.has(String(path))) cache.set(String(path), { ...video, tags: currentIds.map(id => ({ id })) });
    return respond(cache.get(String(path)));
  });
  const before = await readTags("video", item);
  currentIds = [4];
  const after = await readTags("video", item);
  expect(before.ids).toEqual([3]);
  expect(after.ids).toEqual([4]);
  expect(fetch.mock.calls[0][0]).not.toBe(fetch.mock.calls[1][0]);
  expect(fetch.mock.calls[0][1]).toMatchObject({ cache: "no-store" });
});

it("supports fresh reads on LAN HTTP where crypto.randomUUID is unavailable", async () => {
  vi.stubGlobal("crypto", {});
  try {
    fetch.mockImplementation(() => respond({ ...video, tags: [] }));
    await readTags("video", item);
    await readTags("video", item);
    expect(fetch.mock.calls[0][0]).not.toBe(fetch.mock.calls[1][0]);
  } finally {
    vi.unstubAllGlobals();
  }
});
