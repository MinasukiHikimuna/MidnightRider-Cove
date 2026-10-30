import assert from "node:assert/strict";
import test from "node:test";
import {
  bestFloor,
  evaluate,
  f1,
  floorsFrom,
  frameInterval,
  modelsByCategory,
  parseArgs,
  predictedSpans,
  render,
  rowsQuery,
  score,
  union,
} from "../../scripts/ai-tagging-comparison-report.mjs";

const run = (overrides = {}) => ({
  videoId: 7,
  aiRunId: "run-1",
  threshold: 0.2,
  interval: 2,
  duration: 100,
  models: [{ configName: "actions_30", name: "actions_30", version: null, categories: ["actions"] }],
  journalModels: [{ config_name: "actions_30", name: "actions_30", version: 3.0, categories: ["actions"] }],
  payload: { tags: { actions: {} } },
  published: [],
  ...overrides,
});

const everyFrame = (from, to, step = 2) => Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, index) => [from + index * step, 0.5]);

test("comparison report: spans use the interval frames were sampled at, not the recorded one", () => {
  // The AI server records 0.5 s when the request names no interval while sampling 2 s apart.
  const row = run({ interval: 0.5, payload: { tags: { actions: { Kissing: [[10, 0.9], [12, 0.9]] } } }, published: [{ tag: "Kissing", start: 10, end: 14, source: "segment-studio/user" }] });
  assert.equal(frameInterval(row), 2);
  const pair = evaluate([row]).pairs[0];
  assert.deepEqual([pair.byFloor.get(0.2).predictedSeconds, pair.byFloor.get(0.2).keptSeconds], [4, 4]);
});

test("comparison report: a row with a single frame time uses its recorded interval, then 0.5", () => {
  assert.equal(frameInterval(run({ interval: 2, payload: { tags: { actions: { Kissing: [[10, 0.9]], Dancing: [[10, 0.4]] } } } })), 2);
  assert.equal(frameInterval(run({ interval: null, payload: { tags: { actions: { Kissing: [[10, 0.9]] } } } })), 0.5);
  assert.equal(frameInterval(run({ interval: 0.5, payload: null })), 0.5);
});

test("comparison report: the interval is measured over every tag, so a tag missing for a while does not widen it", () => {
  // On its own, Kissing is 8 s apart.
  const row = run({ interval: 0.5, payload: { tags: { actions: { Kissing: [[0, 0.9], [8, 0.9]], Dancing: [[2, 0.9], [4, 0.9], [6, 0.9]] } } } });
  assert.equal(frameInterval(row), 2);
  assert.deepEqual(predictedSpans(row.payload.tags.actions.Kissing, 0.2, frameInterval(row), 100), [[0, 2], [8, 10]]);
});

test("comparison report: predictions merge into spans the way review candidates are built", () => {
  const points = [[0, 0.9], [2, 0.3], [4, 0.8], [10, 0.5], [12, null]];
  // At 0.2 the first three frames are consecutive; a gap of more than one interval splits.
  assert.deepEqual(predictedSpans(points, 0.2, 2, 100), [[0, 6], [10, 14]]);
  // At 0.35 the 0.3 frame drops and splits the first span; an unscored frame stays at every floor.
  assert.deepEqual(predictedSpans(points, 0.35, 2, 100), [[0, 2], [4, 6], [10, 14]]);
  assert.deepEqual(predictedSpans(points, 0.95, 2, 100), [[12, 14]]);
  // A span stops at the end of the video.
  assert.deepEqual(predictedSpans([[99, 0.9]], 0.2, 2, 100), [[99, 100]]);
});

test("comparison report: kept, missed, extra and boundary shift are measured by time overlap", () => {
  const result = score([[10, 20], [40, 50]], [[12, 22], [60, 64]]);
  assert.equal(result.publishedSeconds, 20);
  assert.equal(result.predictedSeconds, 14);
  assert.equal(result.keptSeconds, 8);
  assert.equal(result.missedSeconds, 12);
  assert.equal(result.extraSeconds, 6);
  assert.equal(result.matchedSegments, 1);
  assert.equal(result.missedSegments, 1);
  assert.equal(result.extraSpans, 1);
  assert.deepEqual(result.startShifts, [2]);
  assert.deepEqual(result.endShifts, [2]);
  assert.equal(f1(result), 16 / 34);
  assert.deepEqual(union([[5, 8], [0, 3], [2, 4]]), [[0, 4], [5, 8]]);
});

test("comparison report: the best floor maximises overlap and prefers the higher floor on a tie", () => {
  const best = bestFloor(new Map([
    [0.2, score([[0, 10]], [[0, 20]])],
    [0.5, score([[0, 10]], [[0, 10]])],
    [0.6, score([[0, 10]], [[0, 10]])],
    [0.9, score([[0, 10]], [[0, 2]])],
  ]));
  assert.equal(best.floor, 0.6);
  assert.equal(bestFloor(new Map([[0.2, score([[0, 10]], [])], [0.5, score([[0, 10]], [])]])).floor, null);
  assert.deepEqual(floorsFrom(0.2).slice(0, 4), [0.2, 0.25, 0.3, 0.35]);
  assert.deepEqual(floorsFrom(0.3).slice(0, 2), [0.3, 0.35]);
});

test("comparison report: only tags published on a video are scored there, unless tags are listed", () => {
  const rows = [run({
    // Frames are 2 s apart, as a run with a dense category shows.
    payload: { tags: { actions: { Kissing: [[10, 0.9], [12, 0.25]], Dancing: [[30, 0.9]] }, scenes: { Indoors: everyFrame(10, 30) } } },
    published: [{ tag: "kissing", start: 10, end: 14, source: "segment-studio/user" }],
  })];

  const scored = evaluate(rows);
  assert.deepEqual(scored.pairs.map(pair => pair.tag), ["kissing"]);
  const pair = scored.pairs[0];
  assert.equal(pair.model, "actions_30 v3");
  assert.equal(pair.byFloor.get(0.2).keptSeconds, 4);
  assert.equal(pair.byFloor.get(0.35).missedSeconds, 2);

  const listed = evaluate(rows, { tags: ["dancing"] });
  assert.deepEqual(listed.pairs.map(pair => [pair.tag, pair.byFloor.get(0.2).extraSeconds]), [["dancing", 2]]);
});

test("comparison report: published segments from excluded sources are ignored", () => {
  const rows = [run({
    payload: { tags: { actions: { Kissing: [[10, 0.9]] } } },
    published: [
      { tag: "Kissing", start: 10, end: 12, source: "segment-studio/user" },
      { tag: "Kissing", start: 50, end: 60, source: "tpdb" },
      { tag: "Spanking", start: 0, end: 5, source: "tpdb" },
    ],
  })];
  const result = evaluate(rows, { excludeSources: ["tpdb"] });
  assert.deepEqual(result.pairs.map(pair => [pair.tag, pair.byFloor.get(0.2).publishedSeconds]), [["Kissing", 2]]);
});

test("comparison report: every number names its models, with versions from AI Core's journal", () => {
  assert.equal(modelsByCategory(run()).get("actions"), "actions_30 v3");
  assert.equal(modelsByCategory(run({ journalModels: null })).get("actions"), "actions_30 (version unknown)");
  const rows = [run({ published: [{ tag: "Kissing", start: 0, end: 4, source: "segment-studio/user" }] })];
  const result = evaluate(rows);
  assert.equal(result.pairs[0].model, "not predicted by actions_30 v3");
  assert.match(render(result, { rowCount: 1 }), /Models: not predicted by actions_30 v3\./);
});

test("comparison report: floors never go below what the runs captured", () => {
  const rows = [run({ threshold: 0.3, published: [{ tag: "Kissing", start: 0, end: 4, source: "segment-studio/user" }] })];
  assert.equal(evaluate(rows).floors[0], 0.3);
  assert.equal(evaluate([run({ threshold: null })]).lowestFloor, 0.2);
  assert.ok(evaluate(rows, { floor: 0.42 }).floors.includes(0.42));
});

test("comparison report: rows from store-only runs are scored like rows from review runs", () => {
  const published = [{ tag: "Kissing", start: 0, end: 4, source: "segment-studio/user" }];
  const payload = { tags: { actions: { Kissing: [[0, 0.4], [2, 0.4]] } } };
  const rows = [
    run({ videoId: 7, analyses: ["aiTaggingStoreOnly"], published, payload }),
    run({ videoId: 8, analyses: ["aiTagging"], published, payload }),
  ];
  const result = evaluate(rows);
  assert.deepEqual([result.storeOnlyRuns, result.reviewRuns], [1, 1]);
  assert.deepEqual(result.pairs.map(pair => [pair.videoId, pair.byFloor.get(0.35).keptSeconds]), [[7, 4], [8, 4]]);
  const text = render(result, { rowCount: 2 });
  assert.match(text, /Runs compared: 2 \(one per video, the most recent stored: 1 store-only, 1 from review tagging\)/);
  assert.match(text, /each tagging model's own default \(0\.5 in production\)\. Stored predictions may come from a lower threshold/);
  // The query reads every raw row and only labels where it came from.
  const sql = rowsQuery({ videoIds: [7], since: null });
  assert.match(sql, /FROM segment_studio_ai_raw_results x\s+WHERE x\.video_id IN \(7\)\s+ORDER BY/);
  assert.match(sql, /'analyses', \(SELECT r\.analyses FROM segment_studio_analysis_runs r WHERE r\.id = l\.run_id\)/);
});

test("comparison report: options are validated", () => {
  assert.deepEqual(parseArgs(["--local", "--video-ids", "3,1", "--tags", " Kissing ,Dancing", "--floor", "0.4"]), {
    container: "cove", local: true, videoIds: [3, 1], since: null, tags: ["kissing", "dancing"], excludeSources: [], floor: 0.4, minFloor: null, json: null, help: false,
  });
  assert.throws(() => parseArgs(["--floor", "1"]), /between 0 and 1/);
  assert.throws(() => parseArgs(["--video-ids", "x"]), /comma-separated IDs/);
  assert.throws(() => parseArgs(["--since", "yesterday"]), /ISO 8601/);
  assert.throws(() => parseArgs(["--container", "cove; rm"]), /Invalid --container/);
});
