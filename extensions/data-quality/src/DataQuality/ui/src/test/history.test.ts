import { beforeEach, expect, it, vi } from "vitest";
import { extensionFetch } from "@cove/runtime/api";
import {
  changedItem,
  HISTORY_LIMIT,
  loadHistory,
  recordChange,
  setHistoryScope,
  undoRecord,
  type ChangeRecord,
} from "../history";
import { readTags, type ReviewItem } from "../reviewTags";
import type { OccurrenceApplication } from "../occurrences";

const fetch = vi.mocked(extensionFetch);
interface Video {
  id: number;
  title: string;
  files: [];
  performers: { id: number; name: string }[];
  tags: { id: number; name: string }[];
  customFields: Record<string, unknown[]>;
}
let videos: Video[];
let apps: OccurrenceApplication[];
let nextApp: number;
let writes: string[];
let failWrite: ((path: string, body: any) => boolean) | null;
const tag = (id: number) => ({ id, name: `Tag ${id}` });
const video = (id: number) => videos.find((item) => item.id === id)!;
const tagIds = (id: number) => video(id).tags.map((item) => item.id).sort();
const occurrenceIds = (id: number, performer = 11) =>
  apps
    .filter((a) => a.hostId === id && a.contextId === performer)
    .map((a) => a.tag.id)
    .sort();
const response = (body: unknown, status = 200) =>
  Promise.resolve(new Response(JSON.stringify(body), { status }));
const field = (key: string, type: string) => ({
  id: key.length,
  key,
  type,
  isMultiValue: true,
  filterable: true,
  entityTypes: ["video"],
});

beforeEach(() => {
  localStorage.clear();
  setHistoryScope("history-test");
  fetch.mockReset();
  nextApp = 100;
  writes = [];
  failWrite = null;
  videos = [1, 2].map((id) => ({
    id,
    title: `Scene ${id}`,
    files: [],
    performers: [{ id: 11, name: "Performer" }],
    tags: [tag(5)],
    customFields: {},
  }));
  apps = [];
  fetch.mockImplementation((path, init) => {
    const url = new URL(String(path), "http://test");
    const body = init?.body ? JSON.parse(String(init.body)) : {};
    const method = init?.method ?? "GET";
    if (method !== "GET") {
      writes.push(`${method} ${url.pathname}`);
      if (failWrite?.(url.pathname, body)) return response({ message: "Write failed" }, 500);
    }
    if (url.pathname === "/api/custom-fields")
      return response([
        field("confirmed_absent_tags", "tag"),
        field("confirmed_absent_occurrence_tags", "text"),
      ]);
    if (url.pathname === "/api/videos/bulk") {
      for (const id of body.ids) {
        const item = video(id);
        if (body.tagMode === "ADD")
          for (const tagId of body.tagIds)
            if (!item.tags.some((t) => t.id === tagId)) item.tags.push(tag(tagId));
        if (body.tagMode === "REMOVE")
          item.tags = item.tags.filter((t) => !body.tagIds.includes(t.id));
        for (const [key, values] of Object.entries(body.customFields ?? {}) as [string, unknown[]][]) {
          const current = item.customFields[key] ?? [];
          item.customFields[key] =
            body.customFieldMode === "ADD"
              ? [...new Set([...current, ...values])]
              : current.filter((value) => !values.includes(value));
        }
      }
      return response({});
    }
    if (url.pathname.startsWith("/api/videos/"))
      return response(structuredClone(video(Number(url.pathname.split("/").pop()))));
    if (url.pathname === "/api/tagapplications" && method === "POST") {
      apps.push({
        id: nextApp++,
        hostType: "video",
        hostId: body.hostId,
        contextType: "performer",
        contextId: body.contextId,
        tag: tag(body.tagId),
      });
      return response({});
    }
    if (url.pathname.startsWith("/api/tagapplications/") && method === "DELETE") {
      apps = apps.filter((a) => a.id !== Number(url.pathname.split("/").pop()));
      return response({});
    }
    if (url.pathname === "/api/tagapplications")
      return response(
        apps.filter(
          (a) =>
            a.hostId === Number(url.searchParams.get("hostId")) &&
            a.contextId === Number(url.searchParams.get("contextId")),
        ),
      );
    throw new Error(`Unexpected request ${method} ${path}`);
  });
});

const mediaItem = (id: number): ReviewItem => ({
  key: String(id),
  media: video(id) as unknown as ReviewItem["media"],
});
const occurrenceItem = (id: number): ReviewItem => {
  const media = video(id) as unknown as ReviewItem["media"];
  return {
    key: `${id}:11`,
    media,
    occurrence: { key: `${id}:11`, media, performer: media.performers[0], applications: [] },
  };
};
/** Records what a change does to the items, as the review surfaces do around their writes. */
async function recorded(items: ReviewItem[], change: () => void, id = "change") {
  const before = await Promise.all(items.map((item) => readTags("video", item)));
  change();
  const after = await Promise.all(items.map((item) => readTags("video", item)));
  recordChange({
    id,
    at: Date.now(),
    label: "Action",
    reviewName: "Review",
    kind: "video",
    items: items.map((item, index) =>
      changedItem(item, item.media.title ?? "", before[index], after[index]),
    ),
  });
  writes = [];
}

it("undoes a bulk change on every video, restoring only what it changed", async () => {
  await recorded([mediaItem(1), mediaItem(2)], () => {
    for (const item of videos) {
      item.tags = [tag(7), ...(item.id === 1 ? [] : [tag(5)])];
      item.customFields.confirmed_absent_tags = [5];
    }
  });
  // An unrelated edit made since is kept.
  video(1).tags.push(tag(9));
  expect(loadHistory()[0].items.map((item) => item.tags)).toEqual([
    { added: [7], removed: [5] },
    { added: [7], removed: [] },
  ]);

  expect(await undoRecord("change")).toEqual({ undone: 2, failed: 0 });

  expect(tagIds(1)).toEqual([5, 9]);
  expect(tagIds(2)).toEqual([5]);
  expect(video(1).customFields.confirmed_absent_tags).toEqual([]);
  expect(loadHistory()[0].items.every((item) => item.undone)).toBe(true);
});

it("undoes occurrence tags and leaves other performers and sources alone", async () => {
  await recorded([occurrenceItem(1)], () => {
    apps.push({
      id: nextApp++,
      hostType: "video",
      hostId: 1,
      contextType: "performer",
      contextId: 11,
      tag: tag(21),
    });
  });
  apps.push({
    id: nextApp++,
    hostType: "video",
    hostId: 1,
    contextType: "performer",
    contextId: 12,
    tag: tag(21),
  });

  await undoRecord("change");

  expect(occurrenceIds(1)).toEqual([]);
  expect(occurrenceIds(1, 12)).toEqual([21]);
});

it("counts an item already as before as undone, and keeps edits to untouched tags", async () => {
  await recorded([mediaItem(1), mediaItem(2)], () => {
    for (const item of videos) item.tags.push(tag(7));
  });
  // Video 1 loses a tag the change did not touch; video 2 is as before for tag 7 already.
  video(1).tags = video(1).tags.filter((t) => t.id !== 5);
  video(2).tags = [tag(5), tag(8)];

  expect(await undoRecord("change")).toEqual({ undone: 2, failed: 0 });

  expect(tagIds(1)).toEqual([]);
  expect(tagIds(2)).toEqual([5, 8]);
  expect(writes).toEqual(["POST /api/videos/bulk"]);
});

it("undoes what a video still shows of a change partly put back by hand", async () => {
  await recorded([mediaItem(1)], () => {
    video(1).tags = [tag(7), tag(8)];
  });
  // Tag 8 was taken off again by hand; tags 7 and 5 are still as the change left them.
  video(1).tags = [tag(7)];

  expect(await undoRecord("change")).toEqual({ undone: 1, failed: 0 });

  expect(tagIds(1)).toEqual([5]);
  expect(writes).toEqual(["POST /api/videos/bulk", "POST /api/videos/bulk"]);
  expect(loadHistory()[0].items[0]).toMatchObject({
    tags: { added: [7, 8], removed: [5] },
    undone: true,
  });
});

it("leaves a change that changed nothing out of the history", async () => {
  await recorded([mediaItem(1)], () => {});
  expect(loadHistory()).toEqual([]);
});

it("reports an occurrence conflict when the added application was replaced", async () => {
  await recorded([occurrenceItem(1)], () => {
    apps.push({
      id: nextApp++,
      hostType: "video",
      hostId: 1,
      contextType: "performer",
      contextId: 11,
      tag: tag(21),
    });
  });
  apps = [{ ...apps[0], id: nextApp++ }];

  expect(await undoRecord("change")).toEqual({ undone: 0, failed: 1 });

  expect(writes).toEqual([]);
  expect(occurrenceIds(1)).toEqual([21]);
  expect(loadHistory()[0].items[0]).toMatchObject({
    undone: false,
    error: expect.stringContaining("Undo conflict"),
  });
});

it("keeps what a partly failed undo left, so undoing again finishes it", async () => {
  await recorded([mediaItem(1)], () => {
    video(1).tags = [tag(7)];
  });
  failWrite = (_, body) => body.tagMode === "ADD";

  expect(await undoRecord("change")).toEqual({ undone: 0, failed: 1 });
  expect(tagIds(1)).toEqual([]);
  expect(loadHistory()[0].items[0]).toMatchObject({
    tags: { added: [], removed: [5] },
    error: "Write failed",
  });

  failWrite = null;
  expect(await undoRecord("change")).toEqual({ undone: 1, failed: 0 });
  expect(tagIds(1)).toEqual([5]);
});

it("keeps the newest records within the limit, newest first", () => {
  for (let index = 0; index < HISTORY_LIMIT + 5; index++)
    recordChange({
      id: `r${index}`,
      at: index,
      label: "Action",
      reviewName: "Review",
      kind: "video",
      items: [
        {
          mediaId: 1,
          title: "Scene 1",
          tags: { added: [7], removed: [] },
          absence: { added: [], removed: [] },
          names: {},
        },
      ],
    } satisfies ChangeRecord);
  const history = loadHistory();
  expect(history).toHaveLength(HISTORY_LIMIT);
  expect(history[0].id).toBe(`r${HISTORY_LIMIT + 4}`);
});

it("keeps each account's history apart", async () => {
  await recorded([mediaItem(1)], () => video(1).tags.push(tag(7)));
  setHistoryScope("another-account");
  expect(loadHistory()).toEqual([]);
  setHistoryScope("history-test");
  expect(loadHistory()).toHaveLength(1);
});

it("reads past malformed stored history, and recording still works", async () => {
  localStorage.setItem(
    "history-test:history",
    JSON.stringify([null, { id: "old" }, { id: "x", at: 1, kind: "video", items: [{}] }]),
  );
  expect(loadHistory()).toEqual([]);
  await recorded([mediaItem(1)], () => video(1).tags.push(tag(7)));
  expect(loadHistory().map((record) => record.id)).toEqual(["change"]);
  localStorage.setItem("history-test:history", "not json");
  expect(loadHistory()).toEqual([]);
});

it("says when a change is too large to keep, and keeps the history as it was", () => {
  const item = (mediaId: number) => ({
    mediaId,
    title: "x".repeat(200),
    tags: { added: [7], removed: [] },
    absence: { added: [], removed: [] },
    names: {},
  });
  const base = { label: "Action", reviewName: "Review", kind: "video" as const };
  expect(recordChange({ ...base, id: "small", at: 1, items: [item(1)] })).toBe(true);
  const huge = Array.from({ length: 8000 }, (_, index) => item(index + 1));
  expect(recordChange({ ...base, id: "huge", at: 2, items: huge })).toBe(false);
  expect(loadHistory().map((record) => record.id)).toEqual(["small"]);
});

it("says a change cannot be recorded before the account is known", () => {
  setHistoryScope("");
  expect(
    recordChange({
      id: "none",
      at: 1,
      label: "Action",
      reviewName: "Review",
      kind: "video",
      items: [
        {
          mediaId: 1,
          title: "Scene 1",
          tags: { added: [7], removed: [] },
          absence: { added: [], removed: [] },
          names: {},
        },
      ],
    }),
  ).toBe(false);
});

it("counts an undo whose answer was lost after it landed as done", async () => {
  await recorded([mediaItem(1)], () => video(1).tags.push(tag(7)));
  // The write lands, but its answer fails.
  failWrite = (_, body) => {
    video(1).tags = video(1).tags.filter((t) => !body.tagIds?.includes(t.id));
    return true;
  };

  expect(await undoRecord("change")).toEqual({ undone: 1, failed: 0 });
  expect(tagIds(1)).toEqual([5]);
});

it("keeps a record to the tags the write could change", async () => {
  const item = mediaItem(1);
  const before = await readTags("video", item);
  video(1).tags.push(tag(7), tag(8));
  const after = await readTags("video", item);
  // Tag 8 came from elsewhere while the write ran; it is not part of the change.
  expect(changedItem(item, "Scene 1", before, after, [7]).tags).toEqual({
    added: [7],
    removed: [],
  });
});

it("keeps a batch's record past the limit while it is still being written", () => {
  const record = (id: string, at: number): ChangeRecord => ({
    id,
    at,
    label: "Action",
    reviewName: "Review",
    kind: "video",
    items: [
      {
        mediaId: 1,
        title: "Scene 1",
        tags: { added: [7], removed: [] },
        absence: { added: [], removed: [] },
        names: {},
      },
    ],
  });
  // The batch keeps its first time while other changes are recorded after it.
  for (let index = 0; index < HISTORY_LIMIT; index++) recordChange(record(`r${index}`, index + 10));
  expect(recordChange(record("batch", 1))).toBe(true);
  const history = loadHistory();
  expect(history).toHaveLength(HISTORY_LIMIT);
  expect(history.at(-1)!.id).toBe("batch");
});
