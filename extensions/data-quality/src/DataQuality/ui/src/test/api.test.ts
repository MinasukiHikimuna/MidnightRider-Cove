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

  it("does not restore a deleted account-imported review", async () => {
    const imported = {
      id: "account-review",
      name: "Account review",
      description: "",
      view: {
        filter: { page: 1, perPage: 24 },
        objectFilter: {},
        displayMode: "grid",
        searchMode: "text",
      },
      actions: [],
    };
    fetchMock
      .mockImplementationOnce(() =>
        response({ user: { id: "user" }, permissions: ["*"] }),
      )
      .mockImplementationOnce(() =>
        response([{ uiOptions: JSON.stringify([imported]) }]),
      );
    const first = await loadReviews();
    expect(first.reviews.map((review) => review.id)).toEqual([
      "account-review",
    ]);
    localStorage.setItem(first.storageKey, "[]");

    fetchMock
      .mockImplementationOnce(() =>
        response({ user: { id: "user" }, permissions: ["*"] }),
      )
      .mockImplementationOnce(() =>
        response([{ uiOptions: JSON.stringify([imported]) }]),
      );
    const second = await loadReviews();
    expect(second.reviews).toEqual([]);
  });
});
