import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

// ui.mjs imports Cove's runtime modules, which exist only inside the host, so load it with those imports stubbed.
const bundle = await readFile(new URL("../src/SixDegrees/assets/ui.mjs", import.meta.url), "utf8");
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
  PRESETS,
  badgeText,
  clampSelection,
  connectionQuery,
  countLabel,
  degreeLabel,
  emptyCopy,
  endpointLabels,
  footerText,
  isoDate,
  initialRequest,
  pairRequest,
  pathPerformers,
  performerSummary,
  presetFor,
  railGeometry,
  randomSeed,
  readSettings,
} = await import(`data:text/javascript,${encodeURIComponent(testable)}`);

const chain = {
  start: { id: 1, name: "Alpha", videoCount: 4 },
  end: { id: 3, name: "Charlie", videoCount: 1 },
  steps: [
    { from: { id: 1, name: "Alpha" }, video: { id: 10, title: "First", date: "1994-01-01" }, to: { id: 2, name: "Bravo", videoCount: 31 } },
    { from: { id: 2, name: "Bravo" }, video: { id: 11, title: "Second", date: null }, to: { id: 3, name: "Charlie", videoCount: 1 } },
  ],
};

test("settings fall back to a random pair within six degrees with group videos allowed", () => {
  assert.deepEqual(readSettings(undefined), { mode: "random", startPerformerId: null, endPerformerId: null, maxDegrees: 6, duosOnly: false });
  assert.deepEqual(readSettings({ mode: "selected", startPerformerId: "4", endPerformerId: 9, maxDegrees: 12, duosOnly: true }),
    { mode: "selected", startPerformerId: 4, endPerformerId: 9, maxDegrees: 6, duosOnly: true });
  assert.deepEqual(readSettings({ mode: "other", startPerformerId: -1, endPerformerId: 1.5, maxDegrees: 0, duosOnly: "yes" }),
    { mode: "random", startPerformerId: null, endPerformerId: null, maxDegrees: 1, duosOnly: false });
  for (const { key } of PRESETS) assert.equal(readSettings({ mode: key }).mode, key);
});

test("every preset has a title, a short label, and a description", () => {
  assert.deepEqual(PRESETS.map((preset) => preset.key), ["random", "longest", "years", "hub"]);
  for (const preset of PRESETS) assert.ok(preset.title && preset.short && preset.description);
  assert.equal(presetFor("hub").title, "Your Johnny Sins");
  assert.equal(presetFor("unknown").key, "random");
});

test("only two different performers start a search", () => {
  assert.deepEqual(pairRequest(1, 2), { kind: "pair", startId: 1, endId: 2 });
  assert.deepEqual(pairRequest(1, 1), { kind: "idle", startId: 1, endId: 1 });
  assert.deepEqual(pairRequest(null, 2), { kind: "idle", startId: null, endId: 2 });
  assert.deepEqual(initialRequest(readSettings({})), { kind: "preset", preset: "random" });
  assert.deepEqual(initialRequest(readSettings({ mode: "years" })), { kind: "preset", preset: "years" });
  assert.deepEqual(initialRequest(readSettings({ mode: "selected", startPerformerId: 5 })), { kind: "idle", startId: 5, endId: null });
});

test("connection queries send a pair or a preset with its seed, never both", () => {
  const endpoint = "/api/plugins/com.midnightrider.six-degrees/performer-connections";
  assert.equal(connectionQuery({ kind: "pair", startId: 3, endId: 8 }, 4, 99), `${endpoint}?maxDegrees=4&startPerformerId=3&endPerformerId=8`);
  assert.equal(connectionQuery({ kind: "preset", preset: "longest" }, 6, 99), `${endpoint}?maxDegrees=6&preset=longest&seed=99`);
  assert.equal(connectionQuery({ kind: "pair", startId: 3, endId: 8 }, 4, 99, true), `${endpoint}?maxDegrees=4&startPerformerId=3&endPerformerId=8&duosOnly=true`);
});

test("each preset labels its chain in the badge and on the endpoints", () => {
  const base = { chain, maxDegrees: 6, performerCount: 1, videoCount: 1 };
  assert.equal(badgeText({ ...base, preset: "random" }), "2 degrees");
  assert.equal(badgeText({ ...base, preset: "longest" }), "2 degrees · longest");
  assert.equal(badgeText({ ...base, preset: "years", startFirstYear: 1981, endLastYear: 2025 }), "1981 → 2025");
  assert.equal(badgeText({ ...base, preset: null, duosOnly: true }), "2 degrees · duos");
  assert.deepEqual(endpointLabels({ preset: "years", startFirstYear: 1981, endLastYear: 2025 }), { start: "From", end: "To" });
  assert.deepEqual(endpointLabels({ preset: "hub" }), { start: "From", end: "Your Johnny Sins" });
  assert.deepEqual(endpointLabels(null), { start: "From", end: "To" });
});

test("random seeds are fresh positive 31-bit values", () => {
  assert.equal(randomSeed(() => 0), 0);
  assert.equal(randomSeed(() => 0.5), 0x40000000);
  assert.equal(randomSeed(() => 0.9999999999), 0x7fffffff);
  const seeds = new Set(Array.from({ length: 20 }, () => randomSeed()));
  assert.ok(seeds.size > 1);
});

test("a path lists every performer once, start first", () => {
  assert.deepEqual(pathPerformers(chain).map((performer) => performer.id), [1, 2, 3]);
  assert.deepEqual(pathPerformers(null), []);
});

test("the highlighted rail segment joins the two performers of the selected link", () => {
  const geometry = railGeometry(2, 1);
  assert.equal(geometry.segmentWidth, 100 / 3);
  assert.equal(geometry.inset, 100 / 6);
  assert.equal(geometry.segmentLeft, 50);
  assert.equal(railGeometry(2, 9).segmentLeft, railGeometry(2, 1).segmentLeft);
  assert.equal(clampSelection(-1, 3), 0);
  assert.equal(clampSelection(5, 3), 2);
  assert.equal(clampSelection(0, 0), 0);
});

test("labels read naturally", () => {
  assert.equal(degreeLabel(1), "1 degree");
  assert.equal(degreeLabel(4), "4 degrees");
  assert.equal(countLabel(1), "1 video");
  assert.equal(countLabel(undefined), "0 videos");
  assert.equal(isoDate("1994-01-01"), "1994-01-01");
  assert.equal(isoDate(null), "");
  assert.equal(isoDate("1994"), "");
  assert.equal(isoDate("not a date"), "");
});

test("empty states explain why there is no path", () => {
  assert.equal(emptyCopy("noPath", 1, "Alpha", "Charlie").title, "No Connection Within 1 Degree");
  assert.match(emptyCopy("noPath", 6, "Alpha", "Charlie").body, /^Alpha and Charlie /);
  assert.equal(emptyCopy("performerUnavailable", 6).title, "Performer Unavailable");
  assert.equal(emptyCopy("notEnoughConnections", 6).title, "No Connections Yet");
  assert.equal(emptyCopy(undefined, 6).title, "Choose Two Performers");
  assert.equal(emptyCopy("noPath", 6, "Alpha", "Charlie", true).title, "No Duos-Only Chain Within 6 Degrees");
  assert.equal(emptyCopy("notEnoughConnections", 6, null, null, true).title, "No Duos-Only Connections");
  assert.equal(emptyCopy("noYearSpan", 6).title, "No Chain Across the Years");
  assert.equal(emptyCopy("noYearSpan", 3).body, "No performer from your oldest videos connects to one from your newest within 3 degrees.");
});

test("performer search results keep only what the widget shows", () => {
  assert.deepEqual(performerSummary({ id: 7, name: "Delta", disambiguation: "", imagePath: "/p.jpg", videoCount: 12, tags: [] }),
    { id: 7, name: "Delta", disambiguation: null, imageUrl: "/p.jpg", videoCount: 12 });
});

test("the footer says how the pair was chosen and what was searched", () => {
  assert.equal(
    footerText({ chain, preset: "random", maxDegrees: 6, performerCount: 5790, videoCount: 21005 }),
    `Random pair · shortest path within 6 degrees · searched ${(5790).toLocaleString()} performers and ${(21005).toLocaleString()} shared videos`);
  assert.match(footerText({ chain, preset: null, maxDegrees: 3, performerCount: 1, videoCount: 1 }), /^Chosen pair · /);
  assert.match(footerText({ chain, preset: "years", startFirstYear: 1981, endLastYear: 2025, maxDegrees: 6, performerCount: 1, videoCount: 1 }), /^Across the years · 1981 to 2025 · /);
  assert.match(footerText({ chain, preset: "hub", hubAverageDegrees: 3.1, maxDegrees: 6, performerCount: 1, videoCount: 1 }), /^Your Johnny Sins · 3.1 degrees from everyone linked to them on average · shortest path within 6 degrees · /);
  assert.match(footerText({ chain, preset: "longest", duosOnly: true, maxDegrees: 6, performerCount: 1, videoCount: 1 }), /^Longest chain · furthest pair found within 6 degrees · duos only · /);
});
