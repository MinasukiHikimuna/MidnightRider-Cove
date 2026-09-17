import { beforeEach, describe, expect, it, vi } from "vitest";
import { extensionFetch } from "@cove/runtime/api";
import {
  createConfirmedAbsentTagsField,
  findTags,
  findVideos,
  getConfirmedAbsentTagsFieldStatus,
  loadReviews,
  runReviewAction,
  runTagReviewAction,
} from "../api";

const fetchMock = vi.mocked(extensionFetch);

function response(body: unknown, ok = true) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      status: ok ? 200 : 500,
      statusText: ok ? "OK" : "Failed",
    }),
  );
}

beforeEach(() => {
  fetchMock.mockReset();
  localStorage.clear();
});

describe("Data Quality API adapter", () => {
  it("passes saved filters through the authorized filtered video endpoint", async () => {
    fetchMock.mockImplementation(() => response({ items: [], totalCount: 0 }));
    await findVideos(
      {
        id: "r",
        name: "Review",
        description: "",
        view: {
          filter: { page: 1, perPage: 24 },
          objectFilter: { tagsCriterion: { value: [7], modifier: "INCLUDES" } },
          displayMode: "grid",
          searchMode: "text",
        },
        actions: [],
      },
      { page: 1, perPage: 24 },
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/videos/find",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"modifier":"includes"'),
      }),
    );
  });

  it("queries tag reviews and assigns or clears tag groups in one bulk request", async () => {
    fetchMock.mockImplementation(() => response({ items: [], totalCount: 0 }));
    const review = {
      id: "tags",
      entityType: "tag" as const,
      name: "Group tags",
      description: "",
      view: {
        filter: { page: 1, perPage: 40 },
        objectFilter: {
          tagGroupsCriterion: { value: [], modifier: "IS_NULL" },
        },
        displayMode: "grid" as const,
        searchMode: "text",
      },
      actions: [],
    };
    await findTags(review, review.view.filter);
    expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/tags/find",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"modifier":"isNull"'),
      }),
    );

    await runTagReviewAction(
      {
        id: "assign",
        label: "Assign",
        effect: { mode: "SET_TAG_GROUP", tagGroupId: 8 },
      },
      [4, 5],
    );
    expect(JSON.parse(String(fetchMock.mock.calls.at(-1)?.[1]?.body))).toEqual({
      ids: [4, 5],
      tagGroupId: 8,
    });

    await runTagReviewAction(
      {
        id: "clear",
        label: "Ungrouped",
        effect: { mode: "CLEAR_TAG_GROUP" },
      },
      [4],
    );
    expect(JSON.parse(String(fetchMock.mock.calls.at(-1)?.[1]?.body))).toEqual({
      ids: [4],
      clearFields: ["tagGroupId"],
    });
  });

  it("uses Cove's canonical custom-field key in assessment queue requests", async () => {
    fetchMock.mockImplementation(() => response({ items: [], totalCount: 0 }));
    await findVideos(
      {
        id: "r",
        name: "Review",
        description: "",
        view: {
          filter: { page: 1 },
          objectFilter: {
            customFieldCriteria: [
              {
                key: "confirmed_absent_tags",
                type: "tag",
                modifier: "EXCLUDES",
                value: "7",
              },
            ],
          },
          displayMode: "grid",
          searchMode: "text",
        },
        actions: [],
      },
      { page: 1 },
    );
    expect(String(fetchMock.mock.calls[0][1]?.body)).toContain(
      '"key":"confirmed_absent_tags"',
    );
  });

  it("reports partial failure after a completed action step", async () => {
    fetchMock
      .mockImplementationOnce(() => response({ ids: [4] }))
      .mockImplementationOnce(() => response({ message: "Denied" }, false));
    await expect(
      runReviewAction(
        {
          id: "a",
          label: "Apply",
          steps: [
            { mode: "ADD", tagIds: [1] },
            { mode: "REMOVE", tagIds: [2] },
          ],
        },
        [4],
      ),
    ).rejects.toThrow("1 earlier step(s) completed");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("applies every assessment step as one bulk request without per-video reads", async () => {
    fetchMock
      .mockImplementationOnce(() =>
        response([
          {
            key: "confirmed_absent_tags",
            label: "Confirmed absent tags",
            type: "tag",
            entityTypes: ["video"],
            filterable: true,
            isMultiValue: true,
          },
        ]),
      )
      .mockImplementation(() => response({ updated: 2 }));

    await runReviewAction(
      {
        id: "a",
        label: "Assess",
        steps: [
          { mode: "REMOVE", tagIds: [2] },
          { mode: "ADD", tagIds: [8] },
          { mode: "MARK_PRESENT", tagIds: [3, 3] },
          { mode: "MARK_ABSENT", tagIds: [1, 6] },
          { mode: "CLEAR_ABSENCE", tagIds: [4] },
        ],
      },
      [4, 4, 5],
    );

    expect(fetchMock).toHaveBeenCalledTimes(6);
    expect(fetchMock.mock.calls.map(([path]) => String(path).split("?")[0])).toEqual([
      "/api/custom-fields",
      "/api/videos/bulk",
      "/api/videos/bulk",
      "/api/videos/bulk",
      "/api/videos/bulk",
      "/api/videos/bulk",
    ]);
    const bodies = fetchMock.mock.calls
      .slice(1)
      .map(([, init]) => JSON.parse(String(init?.body)));
    expect(bodies).toEqual([
      { ids: [4, 5], tagIds: [2], tagMode: "REMOVE" },
      { ids: [4, 5], tagIds: [8], tagMode: "ADD" },
      {
        ids: [4, 5],
        tagIds: [3],
        tagMode: "ADD",
        customFields: { confirmed_absent_tags: [3] },
        customFieldMode: "REMOVE",
      },
      {
        ids: [4, 5],
        tagIds: [1, 6],
        tagMode: "REMOVE",
        customFields: { confirmed_absent_tags: [1, 6] },
        customFieldMode: "ADD",
      },
      {
        ids: [4, 5],
        customFields: { confirmed_absent_tags: [4] },
        customFieldMode: "REMOVE",
      },
    ]);
    expect(
      fetchMock.mock.calls.every(([, init]) => (init?.method ?? "GET") !== "PUT"),
    ).toBe(true);
  });

  it("runs legacy steps before assessment steps regardless of declared order", async () => {
    fetchMock
      .mockImplementationOnce(() =>
        response([
          {
            key: "confirmed_absent_tags",
            type: "tag",
            entityTypes: ["video"],
            filterable: true,
            isMultiValue: true,
          },
        ]),
      )
      .mockImplementation(() => response({ updated: 1 }));

    await runReviewAction(
      {
        id: "a",
        label: "Mixed",
        steps: [
          { mode: "MARK_PRESENT", tagIds: [3] },
          { mode: "REMOVE", tagIds: [3] },
        ],
      },
      [4],
    );

    const bodies = fetchMock.mock.calls
      .slice(1)
      .map(([, init]) => JSON.parse(String(init?.body)));
    expect(bodies).toEqual([
      { ids: [4], tagIds: [3], tagMode: "REMOVE" },
      {
        ids: [4],
        tagIds: [3],
        tagMode: "ADD",
        customFields: { confirmed_absent_tags: [3] },
        customFieldMode: "REMOVE",
      },
    ]);
  });

  it("uses the definition's stored key when it differs only by case", async () => {
    fetchMock
      .mockImplementationOnce(() =>
        response([
          {
            key: "Confirmed_Absent_Tags",
            type: "tag",
            entityTypes: ["video"],
            filterable: true,
            isMultiValue: true,
          },
        ]),
      )
      .mockImplementationOnce(() => response({ updated: 1 }));

    await runReviewAction(
      {
        id: "a",
        label: "Absent",
        steps: [{ mode: "MARK_ABSENT", tagIds: [1] }],
      },
      [4],
    );

    expect(JSON.parse(String(fetchMock.mock.calls[1][1]?.body))).toEqual({
      ids: [4],
      tagIds: [1],
      tagMode: "REMOVE",
      customFields: { Confirmed_Absent_Tags: [1] },
      customFieldMode: "ADD",
    });
  });

  it("stops an assessment batch after a failed step and reports completed steps", async () => {
    fetchMock
      .mockImplementationOnce(() =>
        response([
          {
            key: "confirmed_absent_tags",
            type: "tag",
            entityTypes: ["video"],
            filterable: true,
            isMultiValue: true,
          },
        ]),
      )
      .mockImplementationOnce(() => response({ updated: 3 }))
      .mockImplementationOnce(() => response({ error: "Denied" }, false));
    await expect(
      runReviewAction(
        {
          id: "a",
          label: "Absent",
          steps: [
            { mode: "MARK_ABSENT", tagIds: [1] },
            { mode: "CLEAR_ABSENCE", tagIds: [2] },
            { mode: "MARK_PRESENT", tagIds: [3] },
          ],
        },
        [4, 5, 6],
      ),
    ).rejects.toThrow(/step 2 failed; 1 earlier step\(s\) completed/i);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("resolves every tree removal before writing assessment targets", async () => {
    fetchMock
      .mockImplementationOnce(() =>
        response([
          {
            key: "confirmed_absent_tags",
            type: "tag",
            entityTypes: ["video"],
            filterable: true,
            isMultiValue: true,
          },
        ]),
      )
      .mockImplementationOnce(() => response({ id: 10 }))
      .mockImplementationOnce(() => response({ items: [{ id: 11 }], totalCount: 1 }))
      .mockImplementation(() => response({ updated: 1 }));
    await runReviewAction(
      {
        id: "a",
        label: "Resolve first",
        steps: [
          { mode: "REMOVE_TREE", tagIds: [10] },
          { mode: "MARK_ABSENT", tagIds: [12] },
        ],
      },
      [4],
    );
    expect(fetchMock.mock.calls.map(([path]) => String(path).split("?")[0])).toEqual([
      "/api/custom-fields",
      "/api/tags/10",
      "/api/tags/find",
      "/api/videos/bulk",
      "/api/videos/bulk",
    ]);
    expect(JSON.parse(String(fetchMock.mock.calls[3][1]?.body))).toEqual({
      ids: [4],
      tagIds: [10, 11],
      tagMode: "REMOVE",
    });
  });

  it("blocks assessment writes when the definition is missing or cannot be inspected", async () => {
    fetchMock.mockImplementationOnce(() => response([]));
    await expect(
      runReviewAction(
        {
          id: "a",
          label: "Absent",
          steps: [{ mode: "MARK_ABSENT", tagIds: [1] }],
        },
        [4],
      ),
    ).rejects.toThrow(/create.*custom field/i);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    fetchMock
      .mockReset()
      .mockImplementationOnce(() => response({ message: "Forbidden" }, false));
    await expect(
      runReviewAction(
        {
          id: "a",
          label: "Absent",
          steps: [{ mode: "MARK_ABSENT", tagIds: [1] }],
        },
        [4],
      ),
    ).rejects.toThrow(/could not verify.*forbidden/i);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("reports missing and incompatible definitions and creates the expected field", async () => {
    fetchMock.mockImplementationOnce(() => response([]));
    await expect(getConfirmedAbsentTagsFieldStatus()).resolves.toMatchObject({
      kind: "missing",
    });

    fetchMock
      .mockReset()
      .mockImplementationOnce(() =>
        response([
          {
            key: "confirmed_absent_tags",
            type: "tag",
            entityTypes: ["video"],
            filterable: true,
            isMultiValue: true,
          },
        ]),
      );
    await expect(getConfirmedAbsentTagsFieldStatus()).resolves.toMatchObject({
      kind: "ready",
      definition: { key: "confirmed_absent_tags" },
    });

    fetchMock
      .mockReset()
      .mockImplementationOnce(() =>
        response([
          {
            key: "confirmed_absent_tags",
            type: "text",
            entityTypes: ["video"],
            filterable: true,
            isMultiValue: true,
          },
        ]),
      );
    await expect(getConfirmedAbsentTagsFieldStatus()).resolves.toMatchObject({
      kind: "incompatible",
      message: expect.stringMatching(/tag/i),
    });

    fetchMock
      .mockReset()
      .mockImplementationOnce(() => response([]))
      .mockImplementationOnce(() => response({ id: 9 }));
    await createConfirmedAbsentTagsField();
    expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/custom-fields",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          key: "confirmed_absent_tags",
          label: "Confirmed absent tags",
          type: "tag",
          entityTypes: ["video"],
          filterable: true,
          sortable: false,
          isMultiValue: true,
        }),
      }),
    );

    fetchMock
      .mockReset()
      .mockImplementationOnce(() => response([]))
      .mockImplementationOnce(() => response({ message: "Forbidden" }, false));
    await expect(createConfirmedAbsentTagsField()).rejects.toThrow("Forbidden");
  });
});

it("waits out the public filtered-query cache after mutations but not skips", async () => {
  const { settleReviewWrites } = await import("../api");
  vi.useFakeTimers();
  try {
    let settled = false;
    const pending = settleReviewWrites({
      id: "a",
      label: "Apply",
      steps: [{ mode: "ADD", tagIds: [1] }],
    }).then(() => {
      settled = true;
    });
    await vi.advanceTimersByTimeAsync(1000);
    expect(settled).toBe(false);
    await vi.advanceTimersByTimeAsync(100);
    await pending;
    expect(settled).toBe(true);
    await settleReviewWrites({ id: "s", label: "Skip", steps: [] });
    expect(vi.getTimerCount()).toBe(0);
  } finally {
    vi.useRealTimers();
  }
});
