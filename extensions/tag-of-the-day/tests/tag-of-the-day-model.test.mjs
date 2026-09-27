import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

// ui.mjs imports Cove's runtime modules, which exist only inside the host, so load it with those imports stubbed.
const bundle = await readFile(new URL("../src/TagOfTheDay/assets/ui.mjs", import.meta.url), "utf8");
const runtimeImports = [
  ['import React from "@cove/runtime/react";', "const React = { createElement() {} };"],
  ['import { extensionFetch } from "@cove/runtime/api";', "const extensionFetch = null;"],
  ['import * as runtimeComponents from "@cove/runtime/components";', "const runtimeComponents = {};"],
];
let testable = bundle;
for (const [statement, stub] of runtimeImports) {
  assert.ok(testable.includes(statement), `ui.mjs should import ${statement}`);
  testable = testable.replace(statement, stub);
}
const {
  DEFAULT_MEDIA_ASPECT_RATIO,
  MOMENT_SOURCES,
  aspectRatioValue,
  cardAspectRatio,
  clamp,
  countLabel,
  dailyKey,
  deterministicShuffle,
  findFeaturedTag,
  loadTagOfTheDay,
  formatDuration,
  momentLength,
  momentsHeading,
  parseAspectRatio,
  pickMoments,
  randomRevision,
  readSettings,
  shuffleStorageKey,
  storedRevision,
  stableSeed,
  tagFacts,
} = await import(`data:text/javascript,${encodeURIComponent(testable)}`);

test("settings fall back to defaults and clamp to their supported ranges", () => {
  assert.deepEqual(readSettings(undefined), { minimumVideos: 3, momentCount: 4, momentSource: "prefer" });
  assert.deepEqual(readSettings({ minimumVideos: 0, momentCount: 40, momentSource: "only" }), { minimumVideos: 1, momentCount: 8, momentSource: "only" });
  assert.deepEqual(readSettings({ minimumVideos: "12", momentCount: "nope", momentSource: "sometimes" }), { minimumVideos: 12, momentCount: 4, momentSource: "prefer" });
  assert.equal(readSettings({ momentCount: 0 }).momentCount, 0);
  assert.equal(clamp(2.6, 1, 12, 6), 3);
  assert.deepEqual(MOMENT_SOURCES.map((option) => option.value), ["any", "prefer", "only"]);
});

test("the media frame defaults to the tag card's 16:9 and follows a declared shape", () => {
  assert.equal(DEFAULT_MEDIA_ASPECT_RATIO, "16 / 9");
  assert.equal(parseAspectRatio("4:3"), "4 / 3");
  assert.equal(parseAspectRatio(" 1 / 1 "), "1 / 1");
  assert.equal(parseAspectRatio("16:9"), "16 / 9");
  assert.equal(parseAspectRatio("2.39:1"), "2.39 / 1");
  for (const invalid of [undefined, "", "square", "4:0", "0:3", "-4:3", "4:3:2", "4x3"]) {
    assert.equal(parseAspectRatio(invalid), null, `${invalid} is not a shape`);
  }
  assert.equal(aspectRatioValue("16 / 9"), 16 / 9);
  assert.equal(aspectRatioValue("1 / 1"), 1);
});

test("the frame takes a declared shape only when tag cards take it too", () => {
  assert.equal(cardAspectRatio("4:3", "totd-media__content atp-media atp-aspect-4-3"), "4 / 3");
  assert.equal(cardAspectRatio("1:1", "atp-aspect-1-1 atp-media"), "1 / 1");
  assert.equal(cardAspectRatio("4:3", "totd-media__content atp-media"), null, "without card matching, cards stay 16:9");
  assert.equal(cardAspectRatio("4:3", null), null);
  assert.equal(cardAspectRatio("4:3", "my-atp-aspect-4-3"), null);
  assert.equal(cardAspectRatio("wide", "atp-aspect-4-3"), null);
});

// A stand-in for Cove's tag search over `tags`, in the seeded order, recording each request.
function fakeApi(tags, { totalCount = tags.length, videos = [], segments = [] } = {}) {
  const calls = [];
  return {
    calls,
    find: async (entity, findFilter) => {
      calls.push({ entity, ...findFilter });
      if (entity === "videos") return { items: videos.slice(0, findFilter.perPage), totalCount: videos.length };
      const start = (findFilter.page - 1) * findFilter.perPage;
      return { items: tags.slice(start, start + findFilter.perPage), totalCount };
    },
    requestJson: async (path) => {
      calls.push({ path });
      return segments;
    },
  };
}

const tagWith = (id, segmentCount = 0) => ({ id, name: `Tag ${id}`, segmentCount, videoCount: 10 });

test("the featured tag is the first in the seeded order", async () => {
  const api = fakeApi([tagWith(1), tagWith(2, 5)]);
  assert.deepEqual(await findFeaturedTag(api, { minimumVideos: 3, requireMoments: false, seed: 9 }), { tag: tagWith(1), capped: false });
  assert.deepEqual(api.calls, [{ entity: "tags", page: 1, perPage: 1, sort: "random", direction: "asc", seed: 9 }]);
  assert.deepEqual(await findFeaturedTag(fakeApi([]), { minimumVideos: 3, requireMoments: false, seed: 9 }), { tag: null, capped: false });
});

test("requiring moments walks the seeded order until a tag has some", async () => {
  const tags = [...Array.from({ length: 130 }, (_, index) => tagWith(index + 1)), tagWith(999, 3)];
  const api = fakeApi(tags);
  assert.equal((await findFeaturedTag(api, { minimumVideos: 3, requireMoments: true, seed: 1 })).tag.id, 999);
  assert.deepEqual(api.calls.map((call) => call.page), [1, 2, 3]);
});

test("the moment scan stops at the end of the tags and says when it hit its limit", async () => {
  const short = fakeApi(Array.from({ length: 70 }, (_, index) => tagWith(index + 1)));
  assert.deepEqual(await findFeaturedTag(short, { minimumVideos: 3, requireMoments: true, seed: 1 }), { tag: null, capped: false });
  assert.equal(short.calls.length, 2, "a short page ends the scan");

  const exact = fakeApi(Array.from({ length: 120 }, (_, index) => tagWith(index + 1)));
  assert.deepEqual(await findFeaturedTag(exact, { minimumVideos: 3, requireMoments: true, seed: 1 }), { tag: null, capped: false });
  assert.equal(exact.calls.length, 2, "reaching totalCount ends the scan without an empty extra page");

  const many = fakeApi(Array.from({ length: 5000 }, (_, index) => tagWith(index + 1)), { totalCount: undefined });
  assert.deepEqual(await findFeaturedTag(many, { minimumVideos: 3, requireMoments: true, seed: 1 }), { tag: null, capped: true });
  assert.equal(many.calls.length, 20, "the scan stops at 20 pages even without a total");
});

test("tagged videos are fetched only when the moments need them", async () => {
  const request = { day: "2026-09-27", instanceId: "one", minimumVideos: 3, momentCount: 2, revision: 0 };
  const segments = [segment(1, 100), segment(2, 200), segment(3, 300)];
  const videos = [video(400), video(500)];
  const fetchedVideos = async (momentSource, tag = tagWith(7, 3), found = segments) => {
    const api = fakeApi([tag], { segments: found, videos });
    const result = await loadTagOfTheDay(api, { ...request, momentSource });
    return { videos: api.calls.some((call) => call.entity === "videos"), segments: api.calls.some((call) => call.path), result };
  };
  assert.equal((await fetchedVideos("prefer")).videos, false, "enough moments");
  assert.equal((await fetchedVideos("prefer", tagWith(7, 1), segments.slice(0, 1))).videos, true, "too few moments");
  assert.equal((await fetchedVideos("any")).videos, true);
  assert.equal((await fetchedVideos("only")).videos, false);
  const noSegments = await fetchedVideos("prefer", tagWith(7, 0), []);
  assert.equal(noSegments.segments, false, "a tag without segments is not asked for them");
  assert.deepEqual(noSegments.result.moments.map((moment) => moment.kind), ["video", "video"]);
  assert.deepEqual(await loadTagOfTheDay(fakeApi([]), { ...request, momentSource: "prefer" }), { tag: null, moments: [], capped: false });
});

const segment = (id, videoId, startSec = 10, endSec = 40) => ({ id, videoId, videoTitle: `Video ${videoId}`, title: `Segment ${id}`, startSec, endSec });
const video = (id, duration = 600) => ({ id, title: `Video ${id}`, files: [{ duration }] });

test("moments spread across videos before repeating one", () => {
  const segments = [segment(1, 100), segment(2, 100), segment(3, 100), segment(4, 200), segment(5, 300)];
  const moments = pickMoments(segments, [], 3, 7);
  assert.equal(moments.length, 3);
  assert.deepEqual(new Set(moments.map((moment) => moment.videoId)), new Set([100, 200, 300]));
  assert.ok(moments.every((moment) => moment.kind === "segment"));

  const all = pickMoments(segments, [], 5, 7);
  assert.deepEqual(new Set(all.slice(0, 3).map((moment) => moment.videoId)), new Set([100, 200, 300]));
  assert.equal(all.length, 5);
});

test("moments are stable per seed", () => {
  const segments = Array.from({ length: 20 }, (_, index) => segment(index + 1, 100 + index));
  assert.deepEqual(pickMoments(segments, [], 4, 11), pickMoments(segments, [], 4, 11));
  assert.notDeepEqual(pickMoments(segments, [], 4, 11), pickMoments(segments, [], 4, stableSeed("other")));
});

test("tagged videos fill in for missing moments without repeating a video", () => {
  const moments = pickMoments([segment(1, 100)], [video(100), video(200), video(300)], 3, 1);
  assert.deepEqual(moments.map((moment) => [moment.kind, moment.videoId]), [["segment", 100], ["video", 200], ["video", 300]]);
  assert.deepEqual(pickMoments([], [video(5)], 0, 1), []);
  assert.equal(pickMoments([], [video(5), video(6)], 4, 1).length, 2);
});

test("only tagged moments are shown when the tag must have them", () => {
  const moments = pickMoments([segment(1, 100), segment(2, 100)], [video(200), video(300)], 4, 1, "only");
  assert.deepEqual(moments.map((moment) => moment.kind), ["segment", "segment"]);
  assert.deepEqual(pickMoments([], [video(200)], 4, 1, "only"), []);
});

test("without a preference, moments and tagged videos are mixed one per video first", () => {
  const segments = [segment(1, 100), segment(2, 100), segment(3, 200)];
  const videos = [video(100), video(300), video(400), video(500)];
  const moments = pickMoments(segments, videos, 4, 3, "any");
  assert.equal(moments.length, 4);
  assert.equal(new Set(moments.map((moment) => moment.videoId)).size, 4);
  assert.deepEqual(moments, pickMoments(segments, videos, 4, 3, "any"));
  const kinds = new Set();
  for (let seed = 1; seed <= 20; seed += 1) {
    for (const moment of pickMoments(segments, videos, 2, seed, "any")) kinds.add(moment.kind);
  }
  assert.deepEqual(kinds, new Set(["segment", "video"]), "either kind can come first");
  assert.equal(pickMoments(segments, [], 3, 3, "any").length, 3, "further moments from a shown video fill in");

  const many = Array.from({ length: 100 }, (_, index) => segment(index + 1, 1000 + index));
  const others = [video(1), video(2), video(3), video(4)];
  let shownVideos = 0;
  for (let seed = 1; seed <= 200; seed += 1) {
    shownVideos += pickMoments(many, others, 4, seed, "any").filter((moment) => moment.kind === "video").length;
  }
  const average = shownVideos / 200;
  assert.ok(average > 1.5 && average < 2.5, `a tag with many moments still shows about half videos, got ${average}`);
});

test("missing numbers fall back to defaults instead of the minimum", () => {
  assert.deepEqual(readSettings({ minimumVideos: null, momentCount: "" }), { minimumVideos: 3, momentCount: 4, momentSource: "prefer" });
});

test("moment lengths come from the segment or the video", () => {
  assert.equal(momentLength({ kind: "segment", startSec: 10, endSec: 52 }), 42);
  assert.equal(momentLength({ kind: "segment", startSec: 10, endSec: null }), null);
  assert.equal(momentLength({ kind: "segment", startSec: 10, endSec: 10 }), null);
  assert.equal(momentLength({ kind: "video", duration: 90 }), 90);
  assert.equal(momentLength({ kind: "video", duration: 0 }), null);
});

test("facts list only the tag's non-zero usage, each with its tag page tab", () => {
  assert.deepEqual(tagFacts({ videoCount: 12, segmentCount: 0, performerCount: 3 }).map((fact) => [fact.key, fact.value, fact.tab]),
    [["videos", 12, "videos"], ["performers", 3, "performers"]]);
  assert.deepEqual(tagFacts({}), []);
});

test("the moments heading says what the moments are", () => {
  const tag = { videoCount: 128, segmentCount: 342 };
  const segments = pickMoments([segment(1, 1), segment(2, 2)], [], 2, 1);
  const videos = pickMoments([], [video(1), video(2)], 2, 1);
  assert.deepEqual(momentsHeading(segments, tag), { title: "Tagged moments", total: `2 of ${(342).toLocaleString()}` });
  assert.deepEqual(momentsHeading(videos, tag), { title: "Tagged videos", total: `2 of ${(128).toLocaleString()}` });
  assert.deepEqual(momentsHeading([...segments.slice(0, 1), ...videos.slice(1)], tag), { title: "Tagged moments and videos", total: null });
});

test("a shuffle is remembered for its widget and day only", () => {
  const day = "2026-09-27";
  assert.equal(storedRevision(JSON.stringify({ day, revision: 123456 }), day), 123456);
  assert.equal(storedRevision(JSON.stringify({ day: "2026-09-26", revision: 123456 }), day), 0, "a new day starts from its own pick");
  for (const raw of [null, "", "not json", "{}", JSON.stringify({ day, revision: 0 }), JSON.stringify({ day, revision: 1.5 }), JSON.stringify({ day, revision: "7" })]) {
    assert.equal(storedRevision(raw, day), 0, `${raw} is not a stored shuffle`);
  }
  assert.notEqual(shuffleStorageKey("first"), shuffleStorageKey("second"));
});

test("shuffles draw a random, never-zero revision", () => {
  assert.equal(randomRevision(0), 1);
  assert.equal(randomRevision(1 - Number.EPSILON), 0x7ffffffe);
  const seen = new Set(Array.from({ length: 50 }, () => randomRevision()));
  assert.ok(seen.size > 45, "consecutive shuffles do not repeat a fixed sequence");
  assert.ok([...seen].every((revision) => Number.isSafeInteger(revision) && revision > 0));
});

test("dates, shuffles, labels, and durations", () => {
  assert.equal(dailyKey(new Date(2026, 0, 5)), "2026-01-05");
  const items = [1, 2, 3, 4, 5, 6, 7, 8];
  assert.deepEqual([...deterministicShuffle(items, 3)].sort((a, b) => a - b), items);
  assert.equal(countLabel(1, "video", "videos"), "1 video");
  assert.equal(countLabel(1200, "video", "videos"), `${(1200).toLocaleString()} videos`);
  assert.equal(formatDuration(65), "1:05");
  assert.equal(formatDuration(3725), "1:02:05");
});
