import { beforeEach, expect, it, vi } from "vitest";
import { extensionFetch } from "@cove/runtime/api";
import { loadReviews, saveReviews } from "../api";

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
beforeEach(() => {
  localStorage.clear();
  records = [];
  permissions = ["*"];
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
  await saveReviews(loaded.storageKey, [{ ...review, name: "Durable" }]);
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
  await saveReviews(loaded.storageKey, [assessed]);
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
  await expect(saveReviews(loaded.storageKey, [])).rejects.toThrow(
    /another browser/i,
  );
  expect(JSON.parse(record.uiOptions).reviews).toEqual([review]);
});

it("retains local-only operation without saved-filter permissions", async () => {
  permissions = ["videos.read"];
  const loaded = await loadReviews();
  expect(loaded.canWrite).toBe(false);
  expect(loaded.storageNotice).toMatch(/browser/i);
  await saveReviews(loaded.storageKey, [review]);
  expect((await loadReviews()).reviews).toEqual([review]);
  expect(records).toHaveLength(0);
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
  await saveReviews(loaded.storageKey, [
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
  await saveReviews(local.storageKey, [review]);
  permissions = ["*"];
  const upgraded = await loadReviews();
  expect(upgraded.reviews).toEqual([review]);
  localStorage.clear();
  expect((await loadReviews()).reviews).toEqual([review]);
});
it("does not accept an imported navigation key as an action shortcut", async () => {
  const loaded = await loadReviews();
  expect(() =>
    saveReviews(loaded.storageKey, [
      {
        ...review,
        actions: [
          {
            id: "a",
            label: "Unsafe binding",
            steps: [],
            shortcut: "ArrowRight",
          },
        ],
      },
    ]),
  ).toThrow(/shortcuts/);
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
  await saveReviews(loaded.storageKey, [review]);
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
