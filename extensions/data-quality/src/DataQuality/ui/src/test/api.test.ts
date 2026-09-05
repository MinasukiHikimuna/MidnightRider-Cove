import { beforeEach, describe, expect, it, vi } from "vitest";
import { extensionFetch } from "@cove/runtime/api";
import { findVideos, loadReviews, runReviewAction } from "../api";

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
