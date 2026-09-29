import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

// ui.mjs imports Cove's runtime modules, which exist only inside the host, so load it with those imports stubbed.
const bundle = await readFile(new URL("../src/OnThisDay/assets/ui.mjs", import.meta.url), "utf8");
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
  anniversaryYears,
  clamp,
  countLabel,
  dailyKey,
  deterministicShuffle,
  formatDuration,
  isoDate,
  mosaicCells,
  randomRevision,
  readSettings,
  selectMemories,
  shuffleStorageKey,
  stableSeed,
  storedRevision,
  yearsAgoLabel,
} = await import(`data:text/javascript,${encodeURIComponent(testable)}`);

test("settings fall back to defaults and clamp to their supported ranges", () => {
  assert.deepEqual(readSettings(undefined), { count: 6, historyYears: 20 });
  assert.deepEqual(readSettings({ count: 40, historyYears: 0 }), { count: 12, historyYears: 1 });
  assert.deepEqual(readSettings({ count: "3", historyYears: "nope" }), { count: 3, historyYears: 20 });
  assert.equal(clamp(2.6, 1, 12, 6), 3);
});

test("anniversary years run newest first and skip years without the date", () => {
  assert.deepEqual(anniversaryYears(new Date(2026, 8, 27), 3), [2025, 2024, 2023]);
  assert.deepEqual(anniversaryYears(new Date(2028, 1, 29), 12), [2024, 2020, 2016]);
});

test("dates and labels are local-calendar based", () => {
  const today = new Date(2026, 0, 5);
  assert.equal(dailyKey(today), "2026-01-05");
  assert.equal(isoDate(2019, today), "2019-01-05");
  assert.equal(yearsAgoLabel(2025, today), "1 year ago");
  assert.equal(yearsAgoLabel(2014, today), "12 years ago");
});

test("seeded shuffles are stable per seed and keep every item", () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8];
  const seed = stableSeed("2026-09-27", "instance", 0);
  assert.deepEqual(deterministicShuffle(items, seed), deterministicShuffle(items, seed));
  assert.deepEqual([...deterministicShuffle(items, seed)].sort((a, b) => a - b), items);
  assert.notDeepEqual(deterministicShuffle(items, seed), deterministicShuffle(items, stableSeed("2026-09-27", "instance", 1)));
});

test("every found year is equally likely to be featured", () => {
  // Years arrive newest first, so a biased shuffle keeps featuring the most recent ones.
  for (const size of [3, 5, 10]) {
    const found = Array.from({ length: size }, (_, index) => ({ year: 2025 - index }));
    const draws = 20_000;
    const featured = new Map(found.map(({ year }) => [year, 0]));
    for (let draw = 0; draw < draws; draw += 1) {
      const { featuredYear } = selectMemories(found, 3, stableSeed(`day-${draw}`, "instance", "memories", 0));
      featured.set(featuredYear, featured.get(featuredYear) + 1);
    }
    const expected = draws / size;
    for (const count of featured.values()) assert.ok(Math.abs(count - expected) < expected * 0.25, `${size} years: ${[...featured.values()].join(" ")}`);
  }
});

test("selected memories are listed newest first with the sample's first pick featured", () => {
  const found = [2025, 2023, 2019, 2014, 2009].map((year) => ({ year }));
  const seed = 42;
  const { memories, featuredYear } = selectMemories(found, 3, seed);
  assert.equal(memories.length, 3);
  assert.deepEqual(memories.map((memory) => memory.year), [...memories.map((memory) => memory.year)].sort((a, b) => b - a));
  assert.equal(featuredYear, deterministicShuffle(found, seed)[0].year);
  assert.deepEqual(selectMemories([], 3, seed), { memories: [], featuredYear: null });
});

test("counts read naturally", () => {
  assert.equal(countLabel(1), "1 video");
  assert.equal(countLabel(7), "7 videos");
  assert.equal(countLabel(1200), `${(1200).toLocaleString()} videos`);
});

test("year thumbnails tile up to four stills without leaving a cell empty", () => {
  const covered = (cells) => cells.reduce((sum, cell) => {
    const span = (value) => { const [start, end] = value.split(" / ").map(Number); return end - start; };
    return sum + span(cell.column) * span(cell.row);
  }, 0);
  for (const count of [1, 2, 3, 4, 8]) {
    const cells = mosaicCells(count);
    assert.equal(cells.length, Math.min(4, count));
    assert.equal(covered(cells), 4, `${count} stills should cover the 2×2 grid`);
  }
  assert.equal(mosaicCells(0).length, 1);
});

test("durations use clock notation", () => {
  assert.equal(formatDuration(65), "1:05");
  assert.equal(formatDuration(3725), "1:02:05");
  assert.equal(formatDuration(undefined), "0:00");
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
