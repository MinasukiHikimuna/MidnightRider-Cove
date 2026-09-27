import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

// ui.mjs imports Cove's runtime modules, which exist only inside the host, so load it with those imports stubbed.
const bundle = await readFile(new URL("../src/BlastFromThePast/assets/ui.mjs", import.meta.url), "utf8");
const runtimeImports = [
  ['import React from "@cove/runtime/react";', "const React = { createElement() {} };"],
  ['import { extensionFetch } from "@cove/runtime/api";', "const extensionFetch = null;"],
];
let testable = bundle;
for (const [statement, stub] of runtimeImports) {
  assert.ok(testable.includes(statement), `ui.mjs should import ${statement}`);
  testable = testable.replace(statement, stub);
}
const {
  agoLabel,
  clipSummary,
  clipWindow,
  collectMoments,
  estimateLikePosition,
  findSession,
  formatDuration,
  isInClip,
  parseHistory,
  randomSeed,
  readSettings,
  selectMoments,
  scrubberMarks,
  spanLabel,
} = await import(`data:text/javascript,${encodeURIComponent(testable)}`);

const at = (seconds) => new Date(Date.UTC(2026, 7, 1, 4, 0, 0) + seconds * 1000).toISOString();
const ms = (seconds) => Date.parse(at(seconds));
const session = (overrides = {}) => ({
  sessionId: "s1",
  startedAt: at(0),
  lastSeenAt: at(500),
  endedAt: null,
  state: "active",
  mediaDurationSec: 2000,
  totalWatchedSec: 400,
  lastPositionSec: 880,
  isCompleted: false,
  intervals: [
    { startSec: 600, endSec: 780, recordedAt: at(380) },
    { startSec: 790, endSec: 880, recordedAt: at(500) },
  ],
  ...overrides,
});
const pause = (seconds, positionSec) => ({ kind: "pause", at: at(seconds), meta: { positionSec, playbackRate: 1 } });
const seek = (seconds, fromSec, toSec) => ({ kind: "seek", at: at(seconds), meta: { fromSec, toSec } });
const video = { id: 7, title: "Video", files: [{ duration: 2000 }] };

test("settings fall back to defaults and clamp to their supported ranges", () => {
  assert.deepEqual(readSettings(undefined), { count: 6, leadSeconds: 15, clipSeconds: 30, autoplay: true });
  assert.deepEqual(readSettings({ count: 40, leadSeconds: -5, clipSeconds: 999, autoplay: false }), { count: 12, leadSeconds: 0, clipSeconds: 180, autoplay: false });
  assert.deepEqual(readSettings({ count: "3", leadSeconds: "nope", clipSeconds: "45", autoplay: "yes" }), { count: 3, leadSeconds: 15, clipSeconds: 45, autoplay: true });
});

test("a like is matched to the session that was playing or had just stopped", () => {
  const { sessions } = parseHistory({ sessions: [session(), session({ sessionId: "s2", startedAt: at(4000), lastSeenAt: at(4600) })] });
  assert.equal(findSession(ms(300), sessions), sessions[0]);
  assert.equal(findSession(ms(560), sessions), sessions[0], "a like shortly after the last keepalive still belongs to the session");
  assert.equal(findSession(ms(4100), sessions), sessions[1]);
  assert.equal(findSession(ms(1500), sessions), null, "a like long after every session has none");
});

test("a pause just before the like gives the exact position", () => {
  const { sessions, events } = parseHistory({ sessions: [session()], events: [pause(492, 878.5)] });
  assert.deepEqual(estimateLikePosition(ms(500), sessions[0], events), { positionSec: 878.5, precision: "exact" });
});

test("scrubbing while paused before the like moves the exact position", () => {
  const { sessions, events } = parseHistory({ sessions: [session()], events: [pause(480, 878.5), seek(490, 878.5, 860), seek(491, 860, 860)] });
  assert.deepEqual(estimateLikePosition(ms(500), sessions[0], events), { positionSec: 860, precision: "exact" });
});

test("a pause before playback resumed is not the like position", () => {
  const history = {
    sessions: [session({ intervals: [{ startSec: 600, endSec: 700, recordedAt: at(300) }, { startSec: 700, endSec: 790, recordedAt: at(400) }] })],
    events: [pause(250, 650)],
  };
  const { sessions, events } = parseHistory(history);
  const estimate = estimateLikePosition(ms(300), sessions[0], events);
  assert.equal(estimate.precision, "estimated");
  assert.equal(Math.round(estimate.positionSec), 700, "falls back to the run that was playing at the like");
});

test("a pause shortly after the like is stepped back by the gap", () => {
  const { sessions, events } = parseHistory({ sessions: [session()], events: [pause(506, 880)] });
  const estimate = estimateLikePosition(ms(500), sessions[0], events);
  assert.equal(estimate.precision, "estimated");
  assert.equal(estimate.positionSec, 874);
});

test("without pauses, the run that was playing places the like behind its last save", () => {
  const { sessions, events } = parseHistory({ sessions: [session()] });
  const estimate = estimateLikePosition(ms(480), sessions[0], events);
  assert.deepEqual(estimate, { positionSec: 860, precision: "estimated" });
});

test("a like after playback stopped lands where the last run ended", () => {
  const { sessions, events } = parseHistory({ sessions: [session()] });
  assert.deepEqual(estimateLikePosition(ms(530), sessions[0], events), { positionSec: 880, precision: "estimated" });
});

test("moments skip likes without a session and count repeated likes of one moment once", () => {
  const history = {
    likeHistory: [at(500), at(503), at(-86400 * 400)],
    sessions: [session()],
    events: [pause(492, 878.5)],
  };
  const moments = collectMoments(video, history);
  assert.equal(moments.length, 1);
  assert.equal(moments[0].positionSec, 878.5);
  assert.equal(moments[0].precision, "exact");
  assert.equal(moments[0].durationSec, 2000);
  assert.equal(moments[0].video, video);
  assert.equal("session" in moments[0], false);
});

test("clip windows start before the like and stay inside the video", () => {
  assert.deepEqual(clipWindow(100, 2000, 15, 30), { start: 85, end: 115 });
  assert.deepEqual(clipWindow(5, 2000, 15, 30), { start: 0, end: 30 });
  assert.deepEqual(clipWindow(1995, 2000, 15, 30), { start: 1980, end: 2000 });
  assert.deepEqual(clipWindow(100, 0, 15, 30), { start: 85, end: 115 });
});

test("the scrubber spans the whole video and marks the clip and the like", () => {
  const clip = clipWindow(1443, 1862, 15, 30);
  const marks = scrubberMarks(1443, clip, 1862);
  assert.equal(marks.total, 1862);
  assert.equal(marks.clip.left, Math.round((1428 / 1862) * 10000) / 100);
  assert.ok(marks.like > marks.clip.left && marks.like < marks.clip.left + marks.clip.width);
  assert.equal(scrubberMarks(100, clipWindow(100, 0, 15, 30), 0).total, 115, "an unknown duration still fits the clip");
  assert.ok(scrubberMarks(10, clipWindow(10, 36000, 0, 5), 36000).clip.width >= 0.6, "a short clip in a long video stays visible");
});

test("only positions inside the clip window keep the moment looping", () => {
  const clip = { start: 1428, end: 1458 };
  assert.equal(isInClip(1428, clip), true);
  assert.equal(isInClip(1440, clip), true);
  assert.equal(isInClip(1458, clip), false);
  assert.equal(isInClip(1300, clip), false);
});

test("the settings summary describes where the clip sits around the like", () => {
  assert.equal(clipSummary(15, 30), "Plays from 15s before the like to 15s after it.");
  assert.equal(clipSummary(30, 30), "Plays the 30s leading up to the like.");
  assert.equal(clipSummary(0, 30), "Plays 30s starting at the like.");
  assert.equal(clipSummary(60, 30), "Plays 30s and stops 30s before the like.");
  assert.equal(spanLabel(90), "1 min 30s");
  assert.equal(spanLabel(120), "2 min");
});

test("selections are stable per seed and never exceed the count", () => {
  const pool = Array.from({ length: 10 }, (_, index) => ({ id: index }));
  assert.deepEqual(selectMoments(pool, 4, 42), selectMoments(pool, 4, 42));
  assert.equal(selectMoments(pool, 4, 42).length, 4);
  assert.equal(selectMoments(pool.slice(0, 2), 6, 42).length, 2);
});

test("every load gets its own positive seed", () => {
  const seeds = new Set(Array.from({ length: 20 }, () => randomSeed()));
  assert.ok(seeds.size > 1);
  for (const seed of seeds) assert.ok(Number.isInteger(seed) && seed > 0 && seed <= 0x7fffffff);
});

test("labels read naturally", () => {
  const now = new Date(2026, 8, 27, 12).getTime();
  assert.equal(agoLabel(new Date(2026, 8, 27, 1).getTime(), now), "Today");
  assert.equal(agoLabel(new Date(2026, 8, 26, 23).getTime(), now), "Yesterday");
  assert.equal(agoLabel(new Date(2026, 8, 13).getTime(), now), "2 weeks ago");
  assert.equal(agoLabel(new Date(2026, 6, 20).getTime(), now), "2 months ago");
  assert.equal(agoLabel(new Date(2024, 8, 1).getTime(), now), "2 years ago");
  assert.equal(formatDuration(3725), "1:02:05");
});
