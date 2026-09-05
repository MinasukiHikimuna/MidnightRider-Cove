import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  anniversaryYears,
  clamp,
  dailyKey,
  deterministicShuffle,
  isEmptyResult,
  randomSeed,
  readBoolean,
  stableSeed,
} from "../src/DiscoveryWidgets/assets/discovery-utils.mjs";

test("daily keys use the supplied local calendar fields", () => {
  assert.equal(dailyKey(new Date(2024, 1, 29, 23, 59)), "2024-02-29");
  assert.equal(dailyKey(new Date(2024, 2, 1, 0, 0)), "2024-03-01");
});

test("stable seeds are deterministic and diversify widget instances", () => {
  assert.equal(stableSeed("2026-08-02", "one", "tag"), stableSeed("2026-08-02", "one", "tag"));
  assert.notEqual(stableSeed("2026-08-02", "one", "tag"), stableSeed("2026-08-02", "two", "tag"));
  assert.ok(stableSeed("anything") >= 0 && stableSeed("anything") <= 0x7fffffff);
});

test("random seeds remain stable until the user requests another selection", () => {
  const initial = randomSeed("2026-08-02", "widget-one", "performer", 0);
  assert.equal(initial, randomSeed("2026-08-02", "widget-one", "performer", 0));
  assert.notEqual(initial, randomSeed("2026-08-02", "widget-one", "performer", 1));
});

test("deterministic shuffle preserves values and order for a seed", () => {
  const original = [1, 2, 3, 4, 5, 6];
  const first = deterministicShuffle(original, 42);
  assert.deepEqual(first, deterministicShuffle(original, 42));
  assert.deepEqual([...first].sort(), original);
  assert.deepEqual(original, [1, 2, 3, 4, 5, 6]);
});

test("anniversary years skip invalid non-leap February dates", () => {
  assert.deepEqual(anniversaryYears(new Date(2024, 1, 29), 5), [2020]);
  assert.deepEqual(anniversaryYears(new Date(2024, 7, 2), 3), [2023, 2022, 2021]);
});

test("configuration primitives clamp invalid values and preserve real booleans", () => {
  assert.equal(clamp(99, 1, 12, 6), 12);
  assert.equal(clamp("bad", 1, 12, 6), 6);
  assert.equal(readBoolean(false, true), false);
  assert.equal(readBoolean("false", true), true);
  assert.equal(isEmptyResult(null), true);
  assert.equal(isEmptyResult([]), true);
  assert.equal(isEmptyResult({ tag: { id: 1 } }), false);
  assert.equal(isEmptyResult([1]), false);
});

test("extension filter payloads use Cove's camel-case enum wire values", async () => {
  const source = await readFile(new URL("../src/DiscoveryWidgets/assets/ui.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(source, /modifier:\s*"[A-Z_]+"/);
  assert.match(source, /modifier:\s*"greaterThan"/);
  assert.match(source, /modifier:\s*"lessThan"/);
  assert.match(source, /modifier:\s*"isNull"/);
});

test("extension declares the complete dashboard widget catalog", async () => {
  const extensionRoot = new URL("../src/DiscoveryWidgets/", import.meta.url);
  const manifest = JSON.parse(await readFile(new URL("extension.json", extensionRoot), "utf8"));
  const source = await readFile(new URL("DiscoveryWidgetsExtension.cs", extensionRoot), "utf8");
  const bundle = await readFile(new URL("assets/ui.mjs", extensionRoot), "utf8");

  assert.equal(manifest.id, "com.midnightrider.discovery-widgets");
  assert.equal(manifest.entryDll, "DiscoveryWidgets.dll");
  assert.equal(manifest.jsBundle, "assets/ui.mjs");
  assert.equal(manifest.cssBundle, "assets/ui.css");

  const widgets = [
    ["on-this-day", "OnThisDayWidget", "OnThisDayEditor"],
    ["tag-of-the-day", "TagOfTheDayWidget", "TagOfTheDayEditor"],
    ["forgotten-favorites", "ForgottenFavoritesWidget", "ForgottenFavoritesEditor"],
    ["quick-watch", "QuickWatchWidget", "QuickWatchEditor"],
    ["performer-spotlight", "PerformerSpotlightWidget", "PerformerSpotlightEditor"],
    ["continue-a-collection", "ContinueCollectionWidget", "ContinueCollectionEditor"],
    ["curation-queue", "CurationQueueWidget", "CurationQueueEditor"],
  ];

  for (const [id, component, editor] of widgets) {
    assert.match(source, new RegExp(`"${id}"`));
    assert.match(source, new RegExp(component));
    assert.match(source, new RegExp(editor));
    assert.match(bundle, new RegExp(component));
    assert.match(bundle, new RegExp(editor));
  }

  assert.equal(source.split("AddDashboardWidget(Widget(").length - 1, 7);
  for (const permission of ["VideosRead", "TagsRead", "PerformersRead", "GroupsRead"]) {
    assert.match(source, new RegExp(`Permissions\\.${permission}`));
  }
});
