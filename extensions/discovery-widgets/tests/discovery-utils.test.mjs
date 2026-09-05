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

test("connection timelines alternate unique performers with their shared scenes", async () => {
  const bundle = await readFile(new URL("../src/DiscoveryWidgets/assets/ui.mjs", import.meta.url), "utf8");
  const helperSource = bundle.match(/function connectionTimeline\(chain\) \{[\s\S]*?\n\}(?=\n\nfunction snakePosition)/)?.[0];
  assert.ok(helperSource, "connectionTimeline helper should remain independently testable");
  const connectionTimeline = Function(`return (${helperSource})`)();
  const performers = [{ id: 1, name: "One" }, { id: 2, name: "Two" }, { id: 3, name: "Three" }];
  const timeline = connectionTimeline({ steps: [
    { from: performers[0], to: performers[1], video: { id: 11 } },
    { from: performers[1], to: performers[2], video: { id: 12 } },
  ] });

  assert.deepEqual(timeline.map((item) => item.type), ["performer", "scene", "performer", "scene", "performer"]);
  assert.equal(timeline.filter((item) => item.type === "performer").length, 3);
  assert.equal(timeline.filter((item) => item.type === "scene").length, 2);
  assert.deepEqual(timeline.filter((item) => item.type === "performer").map((item) => item.performer.id), [1, 2, 3]);

  const snakeSource = bundle.match(/function snakePosition\(index, itemCount, columns\) \{[\s\S]*?\n\}(?=\n\nfunction snakeColumnCount)/)?.[0];
  assert.ok(snakeSource, "snakePosition helper should remain independently testable");
  const snakePosition = Function(`return (${snakeSource})`)();
  assert.deepEqual(Array.from({ length: 8 }, (_, index) => snakePosition(index, 8, 4)), [
    { row: 1, column: 1, link: "right" },
    { row: 1, column: 2, link: "right" },
    { row: 1, column: 3, link: "right" },
    { row: 1, column: 4, link: "down" },
    { row: 2, column: 4, link: "left" },
    { row: 2, column: 3, link: "left" },
    { row: 2, column: 2, link: "left" },
    { row: 2, column: 1, link: "none" },
  ]);

  const columnSource = bundle.match(/function snakeColumnCount\(width\) \{[\s\S]*?\n\}(?=\n\nfunction useDailyKey)/)?.[0];
  assert.ok(columnSource, "snakeColumnCount helper should remain independently testable");
  const snakeColumnCount = Function(`return (${columnSource})`)();
  assert.equal(snakeColumnCount(640), 1);
  assert.equal(snakeColumnCount(641), 7);
});

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

test("six degrees starts each mounted surprise sequence from fresh entropy", async () => {
  const bundle = await readFile(new URL("../src/DiscoveryWidgets/assets/ui.mjs", import.meta.url), "utf8");
  const helperSource = bundle.match(/function randomRevisionStart\(randomValue = Math\.random\(\)\) \{[\s\S]*?\n\}/)?.[0];
  assert.ok(helperSource, "randomRevisionStart helper should remain independently testable");
  const randomRevisionStart = Function(`return (${helperSource})`)();

  assert.equal(randomRevisionStart(0), 0);
  assert.equal(randomRevisionStart(0.5), 0x40000000);
  assert.equal(randomRevisionStart(0.999999999), 0x7ffffffd);
  assert.match(bundle, /const randomRevision = React\.useRef\(null\)/);
  assert.match(bundle, /randomRevision\.current = randomRevisionStart\(\)/);
  assert.match(bundle, /const initialRequest =[\s\S]*?seed: randomSeed\(dailyKey\(\), instanceId, "six-degrees", randomRevision\.current\)/);
  assert.doesNotMatch(bundle, /"six-degrees", 0\)/);
  assert.doesNotMatch(bundle, /const randomRevision = React\.useRef\(0\)/);
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
  assert.equal(manifest.name, "Sample Widgets");
  assert.equal(manifest.entryDll, "DiscoveryWidgets.dll");
  assert.equal(manifest.jsBundle, "assets/ui.mjs");
  assert.equal(manifest.cssBundle, "assets/ui.css");
  assert.doesNotMatch(bundle, /(?:from\s+|import\s*)["']\.\//, "the packaged entry bundle must not depend on omitted relative modules");

  const widgets = [
    ["library-pulse", "LibraryPulseWidget", "LibraryPulseEditor"],
    ["on-this-day", "OnThisDayWidget", "OnThisDayEditor"],
    ["tag-of-the-day", "TagOfTheDayWidget", "TagOfTheDayEditor"],
    ["forgotten-favorites", "ForgottenFavoritesWidget", "ForgottenFavoritesEditor"],
    ["quick-watch", "QuickWatchWidget", "QuickWatchEditor"],
    ["performer-spotlight", "PerformerSpotlightWidget", "PerformerSpotlightEditor"],
    ["continue-a-collection", "ContinueCollectionWidget", "ContinueCollectionEditor"],
    ["curation-queue", "CurationQueueWidget", "CurationQueueEditor"],
    ["group-feed", "GroupFeedWidget", "GroupFeedEditor"],
    ["six-degrees", "SixDegreesWidget", "SixDegreesEditor"],
  ];

  for (const [id, component, editor] of widgets) {
    assert.match(source, new RegExp(`"${id}"`));
    assert.match(source, new RegExp(component));
    assert.match(source, new RegExp(editor));
    assert.match(bundle, new RegExp(component));
    assert.match(bundle, new RegExp(editor));
  }

  assert.equal(source.split("AddDashboardWidget(Widget(").length - 1, 10);
  assert.equal(source.split(".AddDashboardWidget(").length - 1, 10);
  assert.match(source, /DashboardWidgetPresentation\.Canvas/);
  assert.match(bundle, /GroupItemFeed/);
  assert.match(bundle, /EntityReferenceSelector/);
  assert.doesNotMatch(bundle, /h\("label", \{ className: "discovery-group-picker-field"/);
  assert.match(bundle, /h\("div", \{ className: "discovery-group-picker-field" \}/);
  assert.match(source, /Six Degrees of Johnny Sins/);
  assert.match(source, /performer-connections/);
  assert.match(bundle, /performer-connections/);
  assert.match(source, /join video in db\.Set<Video>\(\)/);
  assert.match(source, /join performer in db\.Set<Performer>\(\)/);
  for (const permission of ["VideosRead", "TagsRead", "PerformersRead", "GroupsRead"]) {
    assert.match(source, new RegExp(`Permissions\\.${permission}`));
  }
});

test("six degrees renders native cards in a responsive snake without duplicate performers", async () => {
  const extensionRoot = new URL("../src/DiscoveryWidgets/", import.meta.url);
  const bundle = await readFile(new URL("assets/ui.mjs", extensionRoot), "utf8");
  const styles = await readFile(new URL("assets/ui.css", extensionRoot), "utf8");
  const chainRules = [...styles.matchAll(/\.degrees-chain\s*\{([^{}]*)\}/g)].map((match) => match[1]);
  const chainRule = chainRules[0] ?? "";
  const widgetRule = styles.match(/\.six-degrees\s*\{([^{}]*)\}/)?.[1] ?? "";
  const quickActionsRule = styles.match(/\.degrees-quick-actions\s*\{([^{}]*)\}/)?.[1] ?? "";

  assert.match(bundle, /import \{[^}]*PerformerTile[^}]*VideoTile[^}]*\} from "@cove\/runtime\/components"/s);
  assert.match(bundle, /h\(PerformerTile,/);
  assert.match(bundle, /h\(VideoTile,/);
  assert.doesNotMatch(bundle, /degrees-step-person__portrait/);
  assert.doesNotMatch(bundle, /degrees-scene-bridge__media/);
  assert.doesNotMatch(bundle, /className:\s*"degrees-step__arrow"/);
  assert.doesNotMatch(bundle, /className:\s*"degrees-step__connector"/);
  assert.doesNotMatch(bundle, /className:\s*"degrees-terminal"/);
  assert.match(bundle, /className:\s*"degrees-quick-actions"/);
  assert.doesNotMatch(bundle, /is-presentational/);
  assert.doesNotMatch(bundle, /interactive:\s*isFirst/);
  assert.match(bundle, /return h\("ol", \{[\s\S]*?className: `degrees-chain\$\{columns === 1 \? " is-stacked" : ""\}`/);
  assert.match(bundle, /const timeline = connectionTimeline\(chain\)/);
  assert.match(bundle, /snakePosition\(timelineIndex, timeline\.length, columns\)/);
  assert.match(bundle, /React\.useLayoutEffect/);
  assert.match(bundle, /React\.useState\(\(\) => snakeColumnCount\(globalThis\.innerWidth \|\| 0\)\)/);
  assert.match(bundle, /container\.clientWidth - parseFloat\(styles\.paddingLeft\) - parseFloat\(styles\.paddingRight\)/);
  assert.match(bundle, /observer\.observe\(container\)/);
  assert.match(bundle, /columns === 1 \? " is-stacked" : ""/);
  assert.match(widgetRule, /display:\s*grid/);
  assert.match(widgetRule, /grid-template-columns:\s*minmax/);
  assert.match(chainRule, /display:\s*grid/);
  assert.match(chainRule, /grid-template-columns:\s*repeat\(var\(--degrees-columns\), minmax\(0, 1fr\)\)/);
  assert.match(quickActionsRule, /grid-template-columns:\s*1fr/);
  assert.match(styles, /\.degrees-chain__item\[data-link="right"\]::after/);
  assert.match(styles, /\.degrees-chain__item\[data-link="down"\]::after/);
  assert.match(styles, /@container \(max-width:\s*54rem\)[\s\S]*?\.six-degrees\s*\{[^{}]*grid-template-columns:\s*1fr/s);
  assert.match(styles, /@container \(max-width:\s*48rem\)[\s\S]*?\.six-degrees\s*\{[^{}]*grid-template-columns:\s*1fr/s);
  assert.match(styles, /\.degrees-chain\.is-stacked\s*\{[^{}]*grid-template-columns:\s*1fr/s);
  assert.match(styles, /\.degrees-chain\.is-stacked \.degrees-chain__item\[data-kind="performer"\]\s*\{[^{}]*width:\s*min\(100%, 12rem\)/s);
  assert.doesNotMatch(styles, /\.degrees-step(?:__|\s*\{)/);
  assert.doesNotMatch(styles, /\.degrees-terminal/);
  for (const rule of chainRules) {
    assert.doesNotMatch(rule, /overflow(?:-[xy])?:\s*(?:auto|scroll)/);
    assert.doesNotMatch(rule, /display:\s*flex/);
  }
  assert.match(styles, /\.six-degrees :is\(button, input\):focus-visible/);
  assert.match(styles, /\.six-degrees button\s*\{[^{}]*font-family:\s*inherit/s);
  assert.doesNotMatch(styles, /\.six-degrees button\s*\{[^{}]*\bfont:\s*inherit/s);
  assert.match(styles, /\.degrees-loading span\s*\{\s*animation:\s*none;/);
  assert.match(styles, /\.degrees-surprise,[\s\S]*?\.degrees-find\s*\{\s*transition:\s*none;/);
});
