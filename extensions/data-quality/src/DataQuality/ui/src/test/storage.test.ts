import { beforeEach, describe, expect, it, vi } from "vitest";
import { extensionFetch } from "@cove/runtime/api";
import { loadReviews, saveReviews } from "../api";
import type { Review } from "../model";

const review = {
  id: "existing",
  name: "Edited",
  description: "",
  view: {
    filter: {},
    objectFilter: {},
    displayMode: "grid" as const,
    searchMode: "text",
  },
  actions: [{ id: "keep-action", label: "Skip", steps: [] }],
};
let records: Array<{
  id: number;
  mode: string;
  name: string;
  uiOptions: string;
}>;
let permissions: string[];
// Configuration writes (PUT) wait for this, so a test can hold one while others start.
let gate: Promise<unknown>;
beforeEach(() => {
  localStorage.clear();
  records = [];
  permissions = ["*"];
  gate = Promise.resolve();
  vi.mocked(extensionFetch)
    .mockReset()
    .mockImplementation(async (path, options) => {
      if (path === "/api/auth/me")
        return Response.json({ user: { id: "u" }, permissions });
      if (options?.method === "POST") {
        const record = {
          ...JSON.parse(String(options.body)),
          id: records.length + 1,
        };
        records.push(record);
        return Response.json(record);
      }
      if (options?.method === "PUT") {
        await gate;
        const id = Number(path.split("/").at(-1));
        const index = records.findIndex((r) => r.id === id);
        records[index] = {
          ...records[index],
          ...JSON.parse(String(options.body)),
        };
        return Response.json(records[index]);
      }
      if (path.includes("?mode="))
        return Response.json(
          records.filter(
            (r) => r.mode === decodeURIComponent(path.split("?mode=")[1]),
          ),
        );
      return Response.json(
        records.find((r) => r.id === Number(path.split("/").at(-1))),
      );
    });
});

it("migrates edited reviews to the account and reads them from a clean browser", async () => {
  localStorage.setItem(
    "cove-data-quality-reviews-v1:u",
    JSON.stringify([review]),
  );
  const loaded = await loadReviews();
  expect(loaded.reviews).toEqual([review]);
  expect(loaded.storageNotice).toBe("");
  expect(loaded.storage).toBe("account");
  await saveReviews(loaded.storageKey, () => [{ ...review, name: "Durable" }]);
  localStorage.clear();
  const otherBrowser = await loadReviews();
  expect(otherBrowser.reviews[0]).toMatchObject({
    id: "existing",
    name: "Durable",
    actions: [{ id: "keep-action" }],
  });
});

it("saves and reloads assessment actions and confirmed-absence queue exclusions", async () => {
  const loaded = await loadReviews();
  const assessed = {
    ...review,
    view: {
      ...review.view,
      objectFilter: {
        customFieldCriteria: [
          {
            key: "confirmed_absent_tags",
            type: "tag",
            modifier: "EXCLUDES",
            value: "17",
          },
        ],
      },
    },
    actions: [
      {
        id: "present",
        label: "Present",
        steps: [{ mode: "MARK_PRESENT" as const, tagIds: [17] }],
      },
      {
        id: "absent",
        label: "Not present",
        steps: [{ mode: "MARK_ABSENT" as const, tagIds: [17] }],
      },
    ],
  };
  await saveReviews(loaded.storageKey, () => [assessed]);
  localStorage.clear();
  expect((await loadReviews()).reviews).toEqual([assessed]);
});

it("treats the newest empty browser snapshot as an intentional deletion", async () => {
  localStorage.setItem("cove-data-quality-reviews-v1:u", "[]");
  localStorage.setItem("cove-video-reviews-v1:u", JSON.stringify([review]));
  localStorage.setItem(
    "cove-video-reviews-v1:u:account-imports",
    JSON.stringify([review.id]),
  );
  expect((await loadReviews()).reviews).toEqual([]);
  localStorage.clear();
  expect((await loadReviews()).reviews).toEqual([]);
});

it("does not overwrite a newer remote edit from another browser", async () => {
  localStorage.setItem(
    "cove-data-quality-reviews-v1:u",
    JSON.stringify([review]),
  );
  const loaded = await loadReviews();
  const record = records.find((r) => r.mode.includes("configuration"))!;
  const config = JSON.parse(record.uiOptions);
  config.revision = "other-browser";
  record.uiOptions = JSON.stringify(config);
  await expect(saveReviews(loaded.storageKey, () => [])).rejects.toThrow(
    /another browser/i,
  );
  expect(JSON.parse(record.uiOptions).reviews).toEqual([review]);
});

it("retains local-only operation without saved-filter permissions", async () => {
  permissions = ["videos.read"];
  const loaded = await loadReviews();
  expect(loaded.canWrite).toBe(false);
  expect(loaded.storageNotice).toMatch(/browser/i);
  expect(loaded).toMatchObject({ storage: "browser", canConfigure: true });
  await saveReviews(loaded.storageKey, () => [review]);
  expect((await loadReviews()).reviews).toEqual([review]);
  expect(records).toHaveLength(0);
});

it("records a deletion as a tombstone, and lifts it when the review is imported again", async () => {
  const loaded = await loadReviews();
  await saveReviews(loaded.storageKey, () => [review]);
  await saveReviews(loaded.storageKey, () => []);
  const config = () =>
    JSON.parse(records.find((row) => row.mode.includes("configuration"))!.uiOptions);
  expect(config()).toMatchObject({ reviews: [], deletedIds: [review.id] });
  await saveReviews(loaded.storageKey, () => [review]);
  expect(config()).toMatchObject({ reviews: [review], deletedIds: [] });
});

it("reads account reviews read-only without saved-filter write permission", async () => {
  permissions = ["savedfilters.read", "videos.read"];
  records.push({
    id: 1,
    mode: "ext:com.midnightrider.data-quality:configuration",
    name: "Data Quality configuration",
    uiOptions: JSON.stringify({
      version: 2,
      revision: "r",
      reviews: [review],
      deletedIds: [],
      importedIds: [],
    }),
  });
  localStorage.setItem("cove-data-quality-v2:u:migrated", "true");
  const loaded = await loadReviews();
  expect(loaded).toMatchObject({ reviews: [review], storage: "readOnly", canConfigure: false });
  expect(loaded.storageNotice).toMatch(/read-only/i);
  await expect(saveReviews(loaded.storageKey, () => [])).rejects.toThrow(/write permission/i);
  expect(JSON.parse(records[0].uiOptions).reviews).toEqual([review]);
});

it("preserves malformed or future-version data without writing over it", async () => {
  records.push({
    id: 1,
    mode: "ext:com.midnightrider.data-quality:configuration",
    name: "Data Quality configuration",
    uiOptions: JSON.stringify({ version: 99 }),
  });
  await expect(loadReviews()).rejects.toThrow(/version/i);
  expect(records[0].uiOptions).toBe('{"version":99}');
});

it("coalesces simultaneous first loads into one migration", async () => {
  const [first, second] = await Promise.all([loadReviews(), loadReviews()]);
  expect(first.storageKey).toBe(second.storageKey);
  expect(records.filter((r) => r.mode.includes("configuration"))).toHaveLength(
    1,
  );
});

it("archives identical duplicate installation records without deleting them", async () => {
  await loadReviews();
  records.push({ ...records[0], id: 2 });
  await loadReviews();
  expect(records).toHaveLength(2);
  expect(records[1].name).toBe("Data Quality recovery 2");
  expect((await loadReviews()).reviews).toEqual([]);
});

it("keeps stale browser edits and newer account edits intact on migration conflict", async () => {
  const loaded = await loadReviews();
  await saveReviews(loaded.storageKey, () => [
    { ...review, name: "Newer account edit" },
  ]);
  localStorage.clear();
  localStorage.setItem(
    "cove-data-quality-reviews-v1:u",
    JSON.stringify([review]),
  );
  await expect(loadReviews()).rejects.toThrow(
    /Neither version was overwritten/,
  );
  expect(JSON.parse(records[0].uiOptions).reviews[0].name).toBe(
    "Newer account edit",
  );
  expect(
    JSON.parse(localStorage.getItem("cove-data-quality-reviews-v1:u")!)[0].name,
  ).toBe("Edited");
});

it("migrates browser-only reviews when saved-filter permissions are granted", async () => {
  permissions = ["videos.read"];
  const local = await loadReviews();
  await saveReviews(local.storageKey, () => [review]);
  permissions = ["*"];
  const upgraded = await loadReviews();
  expect(upgraded.reviews).toEqual([review]);
  localStorage.clear();
  expect((await loadReviews()).reviews).toEqual([review]);
});
it("preserves legacy action shortcuts without using them", async () => {
  const loaded = await loadReviews();
  const legacy = {
    ...review,
    actions: [
      {
        id: "a",
        label: "Unsafe binding",
        steps: [],
        shortcut: "ArrowRight",
      },
    ],
  };
  await expect(saveReviews(loaded.storageKey, () => [legacy])).resolves.toEqual([legacy]);
  expect(JSON.parse(records[0].uiOptions).reviews).toEqual([legacy]);
});

it("does not change the account revision when a clean browser only reads it", async () => {
  await loadReviews();
  const revision = JSON.parse(records[0].uiOptions).revision;
  localStorage.clear();
  await loadReviews();
  expect(JSON.parse(records[0].uiOptions).revision).toBe(revision);
});

it("adopts untouched browser-only legacy reviews into an existing account after permission upgrade", async () => {
  await loadReviews();
  localStorage.clear();
  localStorage.setItem(
    "cove-data-quality-reviews-v1:u",
    JSON.stringify([review]),
  );
  permissions = ["videos.read"];
  expect((await loadReviews()).reviews).toEqual([review]);
  permissions = ["*"];
  expect((await loadReviews()).reviews).toEqual([review]);
  localStorage.clear();
  expect((await loadReviews()).reviews).toEqual([review]);
});

it("does not treat an unchanged account cache as local edits during a permission downgrade", async () => {
  const loaded = await loadReviews();
  await saveReviews(loaded.storageKey, () => [review]);
  permissions = ["videos.read"];
  await loadReviews();
  const changed = JSON.parse(records[0].uiOptions);
  changed.reviews[0].name = "Remote change";
  changed.revision = "remote-change";
  records[0].uiOptions = JSON.stringify(changed);
  permissions = ["*"];
  expect((await loadReviews()).reviews[0].name).toBe("Remote change");
});

it("never assigns another account's global legacy reviews or deletion history", async () => {
  localStorage.setItem(
    "page-videos",
    JSON.stringify([{ ...review, id: "another-account" }]),
  );
  localStorage.setItem(
    "page-videos:account-imports",
    JSON.stringify([review.id]),
  );
  records.push({
    id: 1,
    mode: "ext:cove-data-quality:video-reviews",
    name: "Account imports",
    uiOptions: JSON.stringify([review]),
  });
  const result = await loadReviews();
  expect(result.reviews).toEqual([review]);
  const config = JSON.parse(
    records.find((row) => row.mode.includes("configuration"))!.uiOptions,
  );
  expect(config.deletedIds).toEqual([]);
  expect(config.importedIds).not.toContain("another-account");
  expect(localStorage.getItem("page-videos")).toContain("another-account");
  expect(localStorage.getItem("page-videos:account-imports")).toContain(
    review.id,
  );
});

describe("saves that overlap", () => {
  const settle = () => new Promise((resolve) => setTimeout(resolve, 0));
  const saved = () =>
    JSON.parse(records.find((row) => row.mode.includes("configuration"))!.uiOptions);
  const copy = { ...review, id: "copy", name: "Edited copy" };
  const renamed = { ...review, name: "Renamed" };
  /** Holds configuration writes until the returned function lets them through. */
  const holdWrites = () => {
    let release!: () => void;
    gate = new Promise<void>((resolve) => (release = resolve));
    return () => release();
  };
  /** A save of one review's new definition, as Save to review and the drawer make it. */
  const rename = (current: Review[]) =>
    current.map((item) => (item.id === review.id ? renamed : item));

  it("lands a save of a review and a duplicate started while it writes", async () => {
    const { storageKey } = await loadReviews();
    await saveReviews(storageKey, () => [review]);
    const release = holdWrites();
    const first = saveReviews(storageKey, rename);
    // The duplicate starts before the save lands, from a list without its change.
    const second = saveReviews(storageKey, (current) => [...current, copy]);
    await settle();
    expect(saved().reviews).toEqual([review]);
    release();
    await expect(first).resolves.toEqual([renamed]);
    await expect(second).resolves.toEqual([renamed, copy]);
    expect(saved()).toMatchObject({ reviews: [renamed, copy], deletedIds: [] });
  });

  it("lands a duplicate and a save of a review started while the duplicate writes", async () => {
    const { storageKey } = await loadReviews();
    await saveReviews(storageKey, () => [review]);
    const release = holdWrites();
    const first = saveReviews(storageKey, (current) => [...current, copy]);
    const second = saveReviews(storageKey, rename);
    await settle();
    release();
    await expect(first).resolves.toEqual([review, copy]);
    // The save keeps the copy it never saw, and records no deletion.
    await expect(second).resolves.toEqual([renamed, copy]);
    expect(saved()).toMatchObject({ reviews: [renamed, copy], deletedIds: [] });
    localStorage.clear();
    expect((await loadReviews()).reviews).toEqual([renamed, copy]);
  });

  it("writes nothing for a change that keeps the list, or one that fails, and runs the next save", async () => {
    const { storageKey } = await loadReviews();
    await saveReviews(storageKey, () => [review]);
    const before = records[0].uiOptions;
    await expect(saveReviews(storageKey, (current) => current)).resolves.toEqual([review]);
    await expect(
      saveReviews(storageKey, () => {
        throw new Error("This review was deleted.");
      }),
    ).rejects.toThrow("This review was deleted.");
    expect(records[0].uiOptions).toBe(before);
    await expect(saveReviews(storageKey, (current) => [...current, copy])).resolves.toEqual([
      review,
      copy,
    ]);
  });

  it("lets a reload wait for a save still writing, which the next save then builds on", async () => {
    const { storageKey } = await loadReviews();
    await saveReviews(storageKey, () => [review]);
    const release = holdWrites();
    const saving = saveReviews(storageKey, rename);
    await settle();
    let reloaded = false;
    const reloading = loadReviews().then((result) => {
      reloaded = true;
      return result;
    });
    await settle();
    expect(reloaded).toBe(false);
    release();
    await saving;
    expect((await reloading).reviews).toEqual([renamed]);
    // Not taken for another browser's change: this browser saved it.
    await expect(saveReviews(storageKey, (current) => [...current, copy])).resolves.toEqual([
      renamed,
      copy,
    ]);
  });
});
