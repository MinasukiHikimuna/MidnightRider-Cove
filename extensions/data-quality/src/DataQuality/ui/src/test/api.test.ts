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

  it("applies mixed assessments in one update while preserving unrelated metadata", async () => {
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
      .mockImplementationOnce(() =>
        response({
          id: 4,
          tags: [{ id: 1 }, { id: 2 }, { id: 7 }],
          customFields: {
            confirmed_absent_tags: [3, 4, 4],
            unrelated: { nested: true },
          },
        }),
      )
      .mockImplementationOnce(() => response({ id: 4 }));

    await runReviewAction(
      {
        id: "a",
        label: "Assess",
        steps: [
          { mode: "REMOVE", tagIds: [2] },
          { mode: "ADD", tagIds: [8] },
          { mode: "MARK_PRESENT", tagIds: [3] },
          { mode: "MARK_ABSENT", tagIds: [1, 6] },
          { mode: "CLEAR_ABSENCE", tagIds: [4] },
        ],
      },
      [4, 4],
    );

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/videos/4",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({
          tagIds: [7, 8, 3],
          customFields: {
            confirmed_absent_tags: [1, 6],
            unrelated: { nested: true },
          },
        }),
      }),
    );
  });

  it("preserves unrelated direct tags without promoting derived tags", async () => {
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
      .mockImplementationOnce(() =>
        response({
          id: 4,
          tags: [
            { id: 1, canRemove: true, isDerived: false },
            { id: 2, canRemove: false, isDerived: true },
            { id: 3, canRemove: false, isDerived: true },
            { id: 5, canRemove: false, isDerived: false },
          ],
          customFields: { unrelated: "kept" },
        }),
      )
      .mockImplementationOnce(() => response({ id: 4 }));

    await runReviewAction(
      {
        id: "a",
        label: "Exact assessment",
        steps: [
          { mode: "MARK_PRESENT", tagIds: [2] },
          { mode: "MARK_ABSENT", tagIds: [4] },
        ],
      },
      [4],
    );

    expect(JSON.parse(String(fetchMock.mock.calls[2][1]?.body))).toEqual({
      tagIds: [1, 5, 2],
      customFields: {
        unrelated: "kept",
        confirmed_absent_tags: [4],
      },
    });
  });

  it("changes only exact assessed IDs without inferring related tags", async () => {
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
      .mockImplementationOnce(() =>
        response({
          id: 4,
          tags: [
            { id: 10, canRemove: true },
            { id: 11, canRemove: true },
          ],
          customFields: { confirmed_absent_tags: [20, 21] },
        }),
      )
      .mockImplementationOnce(() => response({ id: 4 }));

    await runReviewAction(
      {
        id: "a",
        label: "Exact assessment",
        steps: [
          { mode: "MARK_ABSENT", tagIds: [10] },
          { mode: "CLEAR_ABSENCE", tagIds: [20] },
        ],
      },
      [4],
    );

    expect(JSON.parse(String(fetchMock.mock.calls[2][1]?.body))).toEqual({
      tagIds: [11],
      customFields: { confirmed_absent_tags: [21, 10] },
    });
  });

  it("skips unchanged assessment videos and clears absence without adding a tag", async () => {
    const definition = {
      key: "confirmed_absent_tags",
      type: "tag",
      entityTypes: ["video"],
      filterable: true,
      isMultiValue: true,
    };
    fetchMock
      .mockImplementationOnce(() => response([definition]))
      .mockImplementationOnce(() =>
        response({ id: 4, tags: [{ id: 2 }], customFields: {} }),
      );
    await runReviewAction(
      {
        id: "a",
        label: "Already clear",
        steps: [{ mode: "CLEAR_ABSENCE", tagIds: [9] }],
      },
      [4],
    );
    expect(fetchMock).toHaveBeenCalledTimes(2);

    fetchMock
      .mockReset()
      .mockImplementationOnce(() => response([definition]))
      .mockImplementationOnce(() =>
        response({
          id: 4,
          tags: [{ id: 2 }],
          customFields: { confirmed_absent_tags: [9], other: "kept" },
        }),
      )
      .mockImplementationOnce(() => response({ id: 4 }));
    await runReviewAction(
      {
        id: "a",
        label: "Clear",
        steps: [{ mode: "CLEAR_ABSENCE", tagIds: [9] }],
      },
      [4],
    );
    expect(JSON.parse(String(fetchMock.mock.calls[2][1]?.body))).toEqual({
      tagIds: [2],
      customFields: { confirmed_absent_tags: [], other: "kept" },
    });
  });

  it("stops an assessment batch after the affected video fails", async () => {
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
      .mockImplementationOnce(() =>
        response({ id: 4, tags: [], customFields: {} }),
      )
      .mockImplementationOnce(() => response({ id: 4 }))
      .mockImplementationOnce(() =>
        response({ id: 5, tags: [], customFields: {} }),
      )
      .mockImplementationOnce(() => response({ message: "Denied" }, false));
    await expect(
      runReviewAction(
        {
          id: "a",
          label: "Absent",
          steps: [{ mode: "MARK_ABSENT", tagIds: [1] }],
        },
        [4, 5, 6],
      ),
    ).rejects.toThrow(/1 video.*completed.*video 5/i);
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it("resolves every tree removal before fetching or writing assessment targets", async () => {
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
      .mockImplementationOnce(() =>
        response({ id: 4, tags: [{ id: 11 }, { id: 12 }], customFields: {} }),
      )
      .mockImplementationOnce(() => response({ id: 4 }));
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
      "/api/videos/4",
      "/api/videos/4",
    ]);
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
