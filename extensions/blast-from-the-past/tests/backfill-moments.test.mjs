import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  BackfillError,
  PAUSE_BEFORE_LIKE_MS,
  chooseTargets,
  clock,
  parseSeconds,
  planSessions,
  restoreLastConsumed,
  viewings,
} from "../scripts/backfill-moments.mjs";

// ui.mjs imports Cove's runtime modules, which exist only inside the host, so load it with those imports stubbed.
let bundle = await readFile(new URL("../src/BlastFromThePast/assets/ui.mjs", import.meta.url), "utf8");
bundle = bundle
  .replace('import React from "@cove/runtime/react";', "const React = { createElement() {} };")
  .replace('import { extensionFetch } from "@cove/runtime/api";', "const extensionFetch = null;");
const { collectMoments } = await import(`data:text/javascript,${encodeURIComponent(bundle)}`);

const base = Date.UTC(2025, 0, 1, 20, 0, 0);
const at = (seconds) => base + seconds * 1000;
const like = (seconds, extra = {}) => ({ ms: at(seconds), real: false, backfilledAt: null, ...extra });
const now = at(86_400 * 30);

// The history API shape the widget reads, built from planned sessions.
function history(sessions, likeTimes) {
  const iso = (ms) => new Date(ms).toISOString();
  return {
    likeHistory: likeTimes.map(iso),
    sessions: sessions.map((session) => ({
      startedAt: iso(session.startedAtMs),
      lastSeenAt: iso(session.endedAtMs),
      endedAt: iso(session.endedAtMs),
      mediaDurationSec: 3000,
      lastPositionSec: session.lastPositionSec,
      intervals: session.runs.map((run) => ({ startSec: run.startSec, endSec: run.endSec, recordedAt: iso(run.recordedAt) })),
    })),
    events: sessions.flatMap((session) => session.events
      .filter((event) => event.kind !== "like")
      .map((event) => ({ kind: event.kind, at: iso(event.at), meta: { ...event.meta, playbackRate: 1 } }))),
  };
}

const widgetPositions = (sessions, likeTimes) =>
  collectMoments({ id: 1 }, history(sessions, likeTimes))
    .map((moment) => [moment.likeAt, moment.positionSec, moment.precision])
    .sort((left, right) => left[0] - right[0]);

test("timestamps accept seconds, m:ss and h:mm:ss", () => {
  assert.equal(parseSeconds("75"), 75);
  assert.equal(parseSeconds("12:30"), 750);
  assert.equal(parseSeconds("1:02:03"), 3723);
  assert.equal(parseSeconds("2.5"), 2.5);
  for (const bad of ["", "1:2:3:4", "-5", "1m"]) assert.throws(() => parseSeconds(bad), BackfillError);
  assert.equal(clock(3723), "1:02:03");
  assert.equal(clock(75), "1:15");
});

test("likes within five minutes of each other are one viewing", () => {
  const groups = viewings([like(0), like(200), like(500), like(1000)]);
  assert.deepEqual(groups.map((group) => group.length), [3, 1]);
});

test("clip starts fill the most recent likes without history, oldest first", () => {
  const likes = [like(0), like(-86_400 * 200, { real: true }), like(86_400), like(86_400 * 2)].sort((a, b) => a.ms - b.ms);
  const moments = chooseTargets({ likes, positions: [100, 200], now });
  assert.deepEqual(moments.map((moment) => [moment.ms, moment.positionSec, moment.create]), [
    [at(86_400), 100, false],
    [at(86_400 * 2), 200, false],
  ]);
});

test("more clip starts than likes without history is refused", () => {
  assert.throws(() => chooseTargets({ likes: [like(0)], positions: [100, 200], now }), /1 like without history but 2 clip starts/);
});

test("new likes are created only with --new, the last one a minute ago", () => {
  assert.throws(() => chooseTargets({ likes: [like(0, { real: true })], positions: [100], now }), /already has history; pass --new/);
  assert.throws(() => chooseTargets({ likes: [], positions: [100], now }), /no likes; pass --new/);
  const moments = chooseTargets({ likes: [like(0, { real: true })], positions: [100, 200], allowNew: true, now });
  assert.deepEqual(moments.map((moment) => [moment.ms, moment.create]), [
    [now - 90_000, true],
    [now - 60_000, true],
  ]);
});

test("--like-at picks the like at that time, creates one there, or refuses a covered one", () => {
  const likes = [like(0), like(86_400, { backfilledAt: 300 })];
  assert.deepEqual(chooseTargets({ likes, positions: [50], likeAtMs: at(1), now })[0], { ms: at(0), create: false, positionSec: 50 });
  assert.throws(() => chooseTargets({ likes, positions: [50], likeAtMs: at(3600), now }), /no like at .*; pass --new/);
  assert.deepEqual(chooseTargets({ likes, positions: [50], likeAtMs: at(3600), allowNew: true, now })[0], { ms: at(3600), create: true, positionSec: 50 });
  assert.throws(() => chooseTargets({ likes, positions: [50], likeAtMs: at(86_400), now }), /already has history \(backfilled at 5:00\)/);
  assert.throws(() => chooseTargets({ likes, positions: [50, 60], likeAtMs: at(0), now }), /single clip start/);
  assert.throws(() => chooseTargets({ likes, positions: [50], likeAtMs: now + 1, now }), /in the past/);
});

test("part of one viewing, or a like next to one with history, is refused", () => {
  const oneViewing = [like(0), like(120)];
  assert.throws(() => chooseTargets({ likes: oneViewing, positions: [100], now }), /were one viewing; give clip starts for all 2/);
  assert.throws(() => chooseTargets({ likes: [like(0, { real: true }), like(120)], positions: [100], now }), /same viewing as the like/);
});

test("likes too close together, or at nearly the same position in one viewing, are refused", () => {
  assert.throws(() => planSessions([{ ms: at(0), positionSec: 100 }, { ms: at(10), positionSec: 400 }]), /too close together/);
  assert.throws(() => planSessions([{ ms: at(0), positionSec: 100 }, { ms: at(60), positionSec: 103 }]), /at least 5s apart/);
});

test("a single like plays a minute up to its position and pauses there just before the like", () => {
  const [session] = planSessions([{ ms: at(0), positionSec: 135, create: false }]);
  assert.deepEqual(session.runs, [{ startSec: 75, endSec: 135, recordedAt: at(0) - PAUSE_BEFORE_LIKE_MS }]);
  assert.deepEqual(session.events, [{ kind: "pause", at: at(-8), meta: { positionSec: 135 } }]);
  assert.equal(session.startedAtMs, at(-8 - 60 - 2));
  assert.equal(session.endedAtMs, at(2));
  assert.equal(session.watchedSec, 60);
  assert.deepEqual(widgetPositions([session], [at(0)]), [[at(0), 135, "exact"]]);
});

test("a like near the start plays only from the beginning, and a new like is written with it", () => {
  const [session] = planSessions([{ ms: at(0), positionSec: 20, create: true }]);
  assert.deepEqual(session.runs.map((run) => [run.startSec, run.endSec]), [[0, 20]]);
  assert.deepEqual(session.events.map((event) => event.kind), ["pause", "like"]);
  assert.deepEqual(widgetPositions([session], [at(0)]), [[at(0), 20, "exact"]]);
});

test("likes in one viewing share a session that seeks between them, and the widget places each exactly", () => {
  const moments = [
    { ms: at(0), positionSec: 300, create: false },
    { ms: at(30), positionSec: 750, create: false },
    { ms: at(200), positionSec: 120, create: false },
  ];
  const sessions = planSessions(moments);
  assert.equal(sessions.length, 1);
  assert.deepEqual(sessions[0].events.map((event) => event.kind), ["pause", "seek", "pause", "seek", "pause"]);
  // Only 20s of playback fit between the first two likes.
  assert.deepEqual(sessions[0].runs.map((run) => [run.startSec, run.endSec]), [[240, 300], [730, 750], [60, 120]]);
  assert.deepEqual(widgetPositions(sessions, moments.map((moment) => moment.ms)), [
    [at(0), 300, "exact"],
    [at(30), 750, "exact"],
    [at(200), 120, "exact"],
  ]);
});

test("separate viewings get separate sessions that the widget keeps apart", () => {
  const moments = [
    { ms: at(0), positionSec: 300, create: false },
    { ms: at(86_400), positionSec: 302, create: false },
  ];
  const sessions = planSessions(moments);
  assert.equal(sessions.length, 2);
  assert.deepEqual(widgetPositions(sessions, moments.map((moment) => moment.ms)), [
    [at(0), 300, "exact"],
    [at(86_400), 302, "exact"],
  ]);
});

test("removing restores last played through every backfill that moved it, without looping", () => {
  const iso = (seconds) => new Date(at(seconds)).toISOString();
  const sessions = [
    { endMs: at(100), before: iso(-500) },
    { endMs: at(900), before: iso(100) },
  ];
  assert.equal(restoreLastConsumed(iso(900), sessions), iso(-500));
  assert.equal(restoreLastConsumed(iso(50), sessions), iso(50));
  assert.equal(restoreLastConsumed(iso(100), [{ endMs: at(100), before: null }]), null);
  // A session that recorded its own end as the earlier value, as left behind by an interrupted cleanup.
  assert.equal(restoreLastConsumed(iso(900), [{ endMs: at(900), before: iso(100) }, { endMs: at(100), before: iso(100) }]), iso(100));
});
