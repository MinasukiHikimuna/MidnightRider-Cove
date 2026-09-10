import { beforeEach, expect, it, vi } from "vitest";
import { extensionFetch } from "@cove/runtime/api";
import {
  loadOccurrencePage,
  occurrenceMatches,
  occurrenceSceneReview,
  resolvePerformers,
  saveOccurrenceTags,
  runOccurrenceAction,
  type Occurrence,
} from "../occurrences";
import {
  parseReviews,
  queueSignature,
  reviewValidation,
  type OccurrenceReview,
} from "../model";

export const occurrenceReview: OccurrenceReview = {
  id: "occurrences",
  entityType: "performerOccurrence",
  name: "Hair setup",
  description: "",
  view: {
    filter: { page: 1, perPage: 40 },
    objectFilter: {},
    displayMode: "grid",
    searchMode: "text",
    startFrom: "beginning",
  },
  actions: [],
  occurrence: {
    targetMode: "selected",
    performerIds: [11],
    performerFilter: {},
    condition: "excludes",
    conditionTagIds: [21],
    tagIds: [21, 22],
    multiple: true,
  },
};

it("allows an action-based occurrence rule without target performers or tag choices", () => {
  const rule: OccurrenceReview = {
    ...occurrenceReview,
    actions: [
      {
        id: "down",
        label: "Hair down",
        steps: [{ mode: "ADD", tagIds: [21] }],
      },
    ],
    occurrence: {
      ...occurrenceReview.occurrence,
      targetMode: "all",
      performerIds: [],
      condition: "any",
      conditionTagIds: [],
      tagIds: [],
    },
  };
  expect(reviewValidation(rule)).toBe("");
  expect(parseReviews(JSON.stringify([rule]))).toEqual([rule]);
});
const fetchMock = vi.mocked(extensionFetch);
const video = {
  id: 1,
  title: "Scene",
  performers: [
    { id: 11, name: "First" },
    { id: 12, name: "Second" },
  ],
  files: [],
  updatedAt: "now",
};
const application = (id: number, performer: number, tag: number) => ({
  id,
  hostType: "video",
  hostId: 1,
  contextType: "performer",
  contextId: performer,
  tag: { id: tag, name: `Tag ${tag}` },
});
const occurrence: Occurrence = {
  key: "1:11",
  video,
  performer: video.performers[0],
  applications: [],
};

it("runs ordered actions only on the active occurrence without touching partner or unrelated tags", async () => {
  const apps = [
    application(1, 11, 21),
    application(2, 11, 99),
    application(3, 12, 21),
  ];
  fetchMock.mockImplementation((path) =>
    String(path).split("?")[0] === "/api/videos/1" ? response(video) : response(apps),
  );
  await runOccurrenceAction(occurrenceReview, occurrence, {
    id: "replace",
    label: "Pigtails",
    steps: [
      { mode: "REMOVE", tagIds: [21] },
      { mode: "ADD", tagIds: [22] },
    ],
  });
  const writes = fetchMock.mock.calls.filter(([, options]) =>
    ["POST", "DELETE"].includes(options?.method ?? ""),
  );
  expect(writes).toHaveLength(2);
  expect(writes[0][0]).toBe("/api/tagapplications/1");
  expect(JSON.parse(String(writes[1][1]?.body))).toMatchObject({
    hostId: 1,
    contextId: 11,
    tagId: 22,
  });
});

it("stops ordered occurrence actions at the first failed step", async () => {
  fetchMock.mockImplementation((path, options) =>
    options?.method === "DELETE"
      ? Promise.resolve(new Response("{}", { status: 500 }))
      : String(path).split("?")[0] === "/api/videos/1"
        ? response(video)
        : response([application(1, 11, 21)]),
  );
  await expect(
    runOccurrenceAction(occurrenceReview, occurrence, {
      id: "replace",
      label: "Pigtails",
      steps: [
        { mode: "REMOVE", tagIds: [21] },
        { mode: "ADD", tagIds: [22] },
      ],
    }),
  ).rejects.toThrow("Saving stopped");
  expect(
    fetchMock.mock.calls.some(([, options]) => options?.method === "POST"),
  ).toBe(false);
});

it("skips without API writes and rejects video-level assessment actions", async () => {
  await runOccurrenceAction(occurrenceReview, occurrence, {
    id: "skip",
    label: "Skip",
    steps: [],
  });
  expect(fetchMock).not.toHaveBeenCalled();
  await expect(
    runOccurrenceAction(occurrenceReview, occurrence, {
      id: "absent",
      label: "Absent",
      steps: [{ mode: "MARK_ABSENT", tagIds: [21] }],
    }),
  ).rejects.toThrow("occurrence tag action");
  expect(fetchMock).not.toHaveBeenCalled();
});
const response = (value: unknown) =>
  Promise.resolve(new Response(JSON.stringify(value)));
beforeEach(() => fetchMock.mockReset());

it("round trips occurrence reviews and rejects missing targets and invalid choices", () => {
  expect(parseReviews(JSON.stringify([occurrenceReview]))).toEqual([
    occurrenceReview,
  ]);
  expect(
    reviewValidation({
      ...occurrenceReview,
      occurrence: { ...occurrenceReview.occurrence, performerIds: [] },
    }),
  ).toBeTruthy();
  expect(() =>
    parseReviews(
      JSON.stringify([
        {
          ...occurrenceReview,
          occurrence: { ...occurrenceReview.occurrence, tagIds: [0] },
        },
      ]),
    ),
  ).toThrow();
  expect(() =>
    parseReviews(JSON.stringify([{ ...occurrenceReview, occurrence: null }])),
  ).toThrow();
});
it("changes progress identity when targets or tag choices change", () => {
  expect(queueSignature(occurrenceReview)).not.toBe(
    queueSignature({
      ...occurrenceReview,
      occurrence: { ...occurrenceReview.occurrence, performerIds: [12] },
    }),
  );
  expect(queueSignature(occurrenceReview)).not.toBe(
    queueSignature({
      ...occurrenceReview,
      occurrence: { ...occurrenceReview.occurrence, tagIds: [23] },
    }),
  );
});
it("keeps scene selection separate and binds identity and tag conditions to the same link", () => {
  const scene = occurrenceSceneReview(
    {
      ...occurrenceReview,
      view: {
        ...occurrenceReview.view,
        objectFilter: {
          studioId: 9,
          _filterExpression: {
            operator: "OR",
            children: [{ filter: { organized: true } }],
          },
        },
      },
    },
    [11],
  );
  expect(scene.view.objectFilter).toEqual({
    _filterExpression: {
      operator: "AND",
      children: [
        {
          group: {
            operator: "OR",
            children: [{ filter: { organized: true } }],
          },
        },
        { filter: { studioId: 9 } },
        {
          filter: {
            performerFilterCriterion: {
              mode: "atLeastOne",
              conditionOperator: "and",
              performerIdsCriterion: { modifier: "includes", value: [11] },
              performerOccurrenceTagsCriterion: {
                modifier: "excludes",
                value: [21],
                depth: -1,
              },
            },
          },
        },
      ],
    },
  });
});
it("tests each supported exact occurrence condition", () => {
  const settings = {
    ...occurrenceReview.occurrence,
    conditionTagIds: [21, 22],
  };
  expect(occurrenceMatches({ ...settings, condition: "includes" }, [21])).toBe(
    true,
  );
  expect(
    occurrenceMatches({ ...settings, condition: "includesAll" }, [21]),
  ).toBe(false);
  expect(
    occurrenceMatches({ ...settings, condition: "includesAll" }, [21, 22]),
  ).toBe(true);
  expect(occurrenceMatches({ ...settings, condition: "excludes" }, [23])).toBe(
    true,
  );
  expect(occurrenceMatches({ ...settings, condition: "excludes" }, [21])).toBe(
    false,
  );
  expect(occurrenceMatches({ ...settings, condition: "isNull" }, [])).toBe(
    true,
  );
  expect(occurrenceMatches({ ...settings, condition: "isNull" }, [21])).toBe(
    false,
  );
});
it("does not review scene partners just because their scene matched the target", async () => {
  fetchMock.mockImplementation((path) =>
    path === "/api/videos/find"
      ? response({ items: [video], totalCount: 1 })
      : path === "/api/tags/find"
        ? response({ items: [], totalCount: 0 })
      : response([application(2, 12, 21)]),
  );
  const result = await loadOccurrencePage(occurrenceReview, [11], 1);
  expect(result.items.map((item) => item.key)).toEqual(["1:11"]);
});
it("filters occurrences individually when all performers are targeted", async () => {
  fetchMock.mockImplementation((path) =>
    path === "/api/videos/find"
      ? response({ items: [video], totalCount: 1 })
      : path === "/api/tags/find"
        ? response({ items: [], totalCount: 0 })
      : response([application(1, 11, 21)]),
  );
  expect(
    (await loadOccurrencePage(occurrenceReview, null, 1)).items.map(
      (item) => item.key,
    ),
  ).toEqual(["1:12"]);
});

it.each([
  ["includes", [21], [31], ["1:11"]],
  ["includes", [21], [21], ["1:11"]],
  ["includesAll", [21, 22], [31], []],
  ["includesAll", [21, 22], [31, 32], ["1:11"]],
  ["includesAll", [21, 22], [33], ["1:11"]],
  ["excludes", [21], [31], ["1:12"]],
  ["isNull", [], [31], ["1:12"]],
  ["any", [], [31], ["1:11", "1:12"]],
] as const)("matches %s against each selected tag's descendants (%j, %j)", async (condition, parents, ownTags, expected) => {
  const signal = new AbortController().signal;
  fetchMock.mockImplementation((path, options) => {
    if (path === "/api/videos/find") return response({ items: [video], totalCount: 1 });
    if (path === "/api/tags/find") {
      const query = JSON.parse(String(options?.body));
      expect(query.objectFilter.parentsCriterion.depth).toBe(-1);
      expect(options?.signal).toBe(signal);
      const root = query.objectFilter.parentsCriterion.value[0];
      return response({ items: (root === 21 ? [31, 33] : [32, 33]).map(id => ({ id })), totalCount: 2 });
    }
    if (String(path).startsWith("/api/tags/")) return response({});
    // The partner has a sibling tag; it must not satisfy either selected subtree.
    return response([
      ...ownTags.map((tag, index) => application(index + 1, 11, tag)),
      ...(condition === "isNull" || condition === "any" ? [] : [application(99, 12, 99)]),
    ]);
  });
  const result = await loadOccurrencePage({
    ...occurrenceReview,
    occurrence: { ...occurrenceReview.occurrence, condition, conditionTagIds: [...parents] },
  }, null, 1, signal);
  expect(result.items.map(item => item.key)).toEqual(expected);
  if (condition === "any" || condition === "isNull")
    expect(fetchMock.mock.calls.some(([path]) => String(path).startsWith("/api/tags/"))).toBe(false);
});

it("fails the queue load when tag hierarchy resolution fails", async () => {
  fetchMock.mockImplementation(path => path === "/api/videos/find"
    ? response({ items: [video], totalCount: 1 })
    : String(path).startsWith("/api/tags/")
      ? Promise.resolve(new Response("{}", { status: 500 }))
      : response([]));
  await expect(loadOccurrencePage(occurrenceReview, null, 1)).rejects.toThrow();
});

it.each(["includes", "includesAll", "excludes"] as const)("keeps %s exact when subtags are disabled", async condition => {
  const rule = { ...occurrenceReview, occurrence: { ...occurrenceReview.occurrence, condition, includeSubtags: false } };
  fetchMock.mockImplementation(path => {
    if (path === "/api/videos/find") return response({ items: [video], totalCount: 1 });
    if (String(path).startsWith("/api/tags/")) throw new Error("Exact matching must not resolve descendants");
    return response([application(1, 11, 31), application(2, 12, 21)]);
  });
  expect((await loadOccurrencePage(rule, null, 1)).items.map(item => item.key))
    .toEqual(condition === "excludes" ? ["1:11"] : ["1:12"]);
  expect(JSON.stringify(occurrenceSceneReview(rule, null).view.objectFilter)).toContain('"depth":0');
});

it("preserves the subtag setting in exported reviews and rejects invalid values", () => {
  const exact = { ...occurrenceReview, occurrence: { ...occurrenceReview.occurrence, includeSubtags: false } };
  expect(parseReviews(JSON.stringify([exact]))).toEqual([exact]);
  expect(queueSignature(exact)).not.toBe(queueSignature(occurrenceReview));
  expect(() => parseReviews(JSON.stringify([{ ...exact, occurrence: { ...exact.occurrence, includeSubtags: "false" } }]))).toThrow();
});
it("returns no scenes without querying when a performer filter resolves to no targets", async () => {
  expect(await loadOccurrencePage(occurrenceReview, [], 1)).toEqual({
    items: [],
    totalCount: 0,
  });
  expect(fetchMock).not.toHaveBeenCalled();
});
it("resolves performer filters through every page", async () => {
  fetchMock
    .mockResolvedValueOnce(
      await response({ items: [{ id: 11 }], totalCount: 1001 }),
    )
    .mockResolvedValueOnce(
      await response({ items: [{ id: 12 }], totalCount: 1001 }),
    );
  expect(
    await resolvePerformers({
      ...occurrenceReview,
      occurrence: {
        ...occurrenceReview.occurrence,
        targetMode: "filter",
        performerFilter: { favorite: true },
      },
    }),
  ).toEqual([11, 12]);
  expect(
    JSON.parse(String(fetchMock.mock.calls[1][1]?.body)).findFilter.page,
  ).toBe(2);
});
it("only edits configured tags on the active performer occurrence", async () => {
  const apps = [
    application(1, 11, 21),
    application(2, 11, 99),
    application(3, 12, 21),
    { ...application(4, 11, 21), contextType: null },
  ];
  fetchMock.mockImplementation((path) =>
    String(path).split("?")[0] === "/api/videos/1" ? response(video) : response(apps),
  );
  await saveOccurrenceTags(occurrenceReview, occurrence, [22]);
  const writes = fetchMock.mock.calls.filter(([, options]) =>
    ["POST", "DELETE"].includes(options?.method ?? ""),
  );
  expect(writes).toHaveLength(2);
  expect(JSON.parse(String(writes[0][1]?.body))).toEqual({
    hostType: "video",
    hostId: 1,
    contextType: "performer",
    contextId: 11,
    tagId: 22,
    sourceKey: "user",
  });
  expect(writes[1][0]).toBe("/api/tagapplications/1");
});
it("does not write after an occurrence was unlinked or with invalid single-choice input", async () => {
  fetchMock.mockImplementation(() => response({ ...video, performers: [] }));
  await expect(
    saveOccurrenceTags(occurrenceReview, occurrence, [22]),
  ).rejects.toThrow("no longer linked");
  await expect(
    saveOccurrenceTags(
      {
        ...occurrenceReview,
        occurrence: { ...occurrenceReview.occurrence, multiple: false },
      },
      occurrence,
      [21, 22],
    ),
  ).rejects.toThrow("configured tags");
  expect(fetchMock.mock.calls.every(([, options]) => !options?.method)).toBe(
    true,
  );
});
it("explains partial failure and can safely retry to finish the desired state", async () => {
  fetchMock.mockImplementation((path, options) =>
    options?.method === "DELETE"
      ? Promise.resolve(new Response("{}", { status: 500 }))
      : String(path).split("?")[0] === "/api/videos/1"
        ? response(video)
        : response([application(1, 11, 21)]),
  );
  await expect(
    saveOccurrenceTags(occurrenceReview, occurrence, [22]),
  ).rejects.toThrow("some tag changes may have been applied");
});

it('treats empty performer criteria as all without enumerating the library', async () => {
  const ids = await resolvePerformers({ ...occurrenceReview, occurrence: { ...occurrenceReview.occurrence, targetMode: 'filter', performerFilter: {} } });
  expect(ids).toBeNull();
  expect(fetchMock).not.toHaveBeenCalled();
});
