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
  dailyKey,
  deterministicShuffle,
  formatDuration,
  isoDate,
  readSettings,
  selectMemories,
  stableSeed,
  yearRail,
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

test("selected memories are listed newest first with the sample's first pick featured", () => {
  const found = [2025, 2023, 2019, 2014, 2009].map((year) => ({ year }));
  const seed = 42;
  const { memories, featuredYear } = selectMemories(found, 3, seed);
  assert.equal(memories.length, 3);
  assert.deepEqual(memories.map((memory) => memory.year), [...memories.map((memory) => memory.year)].sort((a, b) => b - a));
  assert.equal(featuredYear, deterministicShuffle(found, seed)[0].year);
  assert.deepEqual(selectMemories([], 3, seed), { memories: [], featuredYear: null });
});

test("the year rail covers every searched year oldest first and marks the selection", () => {
  const rail = yearRail(new Date(2026, 8, 27), 5, [{ year: 2025 }, { year: 2023 }], 2023);
  assert.deepEqual(rail, [
    { year: 2021, state: "empty" },
    { year: 2022, state: "empty" },
    { year: 2023, state: "selected" },
    { year: 2024, state: "empty" },
    { year: 2025, state: "shown" },
  ]);
});

test("durations use clock notation", () => {
  assert.equal(formatDuration(65), "1:05");
  assert.equal(formatDuration(3725), "1:02:05");
  assert.equal(formatDuration(undefined), "0:00");
});
