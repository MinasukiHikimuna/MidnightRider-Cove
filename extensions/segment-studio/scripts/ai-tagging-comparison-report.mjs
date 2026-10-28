#!/usr/bin/env node
// Compares the per-frame AI tag predictions Segment Studio kept (segment_studio_ai_raw_results) with the
// segments published for the same videos, to see which floor per tag best matches what was cleaned up.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import { pathToFileURL } from "node:url";

export const CURRENT_FLOOR = 0.35;
// The analyses entry of a run row written by the store-only claim (SegmentStudioAiContributor.StoreOnlyAnalysis).
export const STORE_ONLY_ANALYSIS = "aiTaggingStoreOnly";
const EPSILON = 1e-9;

const help = `Usage:
  node scripts/ai-tagging-comparison-report.mjs [--container cove | --local] [options]

Scores, per video and tag, the stored AI predictions at a confidence floor against
the published Segment Studio tag segments, by time overlap:
  kept     published time the predictions cover
  missed   published time they do not cover
  extra    predicted time outside every published segment
  shift    how far predicted span edges sit from published segment edges
           (predicted minus published; negative starts early)
Only tags published on a video are scored there, because an uncurated tag's
absence is not a negative; --tags scores the listed tags on every video instead.
Each video uses its most recent stored run, from the store-only capability or
from review tagging alike. Every number names the model versions that produced it.

Published segments were reviewed from drafts of runs that asked for no
threshold, so the AI server applied each tagging model's own default (0.5 in
production). Stored predictions may come from a lower threshold: below the
default, a floor also scores frames that never reached a draft.

--container NAME     Docker container with Cove's PostgreSQL (default: cove)
--local              Use psql from PATH with the PG* environment instead
--video-ids IDS      Only these videos (comma-separated IDs)
--since TIME         Only runs stored at or after TIME (ISO 8601)
--tags LIST          Score these tags (comma-separated names) on every video
--exclude-sources L  Ignore published segments from these source keys
--floor N            Floor for the per-video table (default: each tag's best)
--min-floor N        Lowest floor to try (default: highest stored threshold, at
                     least 0.2)
--json PATH          Also write every number as JSON
--help               Show help
`;

export function parseArgs(args) {
  const options = { container: "cove", local: false, videoIds: null, since: null, tags: null, excludeSources: [], floor: null, minFloor: null, json: null, help: false };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const value = () => {
      const raw = args[++i];
      if (raw === undefined || raw.startsWith("--")) throw new Error(`${arg} requires a value`);
      return raw;
    };
    if (arg === "--help") options.help = true;
    else if (arg === "--local") options.local = true;
    else if (arg === "--container") options.container = value();
    else if (arg === "--video-ids") options.videoIds = parseIds(value());
    else if (arg === "--since") options.since = parseTime(value());
    else if (arg === "--tags") options.tags = parseList(value(), arg).map(normalizeTag);
    else if (arg === "--exclude-sources") options.excludeSources = parseList(value(), arg);
    else if (arg === "--floor") options.floor = parseFloor(value(), arg);
    else if (arg === "--min-floor") options.minFloor = parseFloor(value(), arg);
    else if (arg === "--json") options.json = value();
    else throw new Error(`Unknown option: ${arg}`);
  }
  if (!/^[A-Za-z0-9_.-]+$/.test(options.container)) throw new Error("Invalid --container");
  return options;
}

function parseIds(raw) {
  const ids = [...new Set(raw.split(",").map(id => id.trim()).filter(Boolean).map(Number))];
  if (!ids.length || ids.some(id => !Number.isSafeInteger(id) || id < 1)) throw new Error("--video-ids takes comma-separated IDs");
  return ids;
}

function parseTime(raw) {
  if (!/^\d{4}-\d\d-\d\d([T ][\d:.]+)?(Z|[+-]\d\d:?\d\d)?$/.test(raw) || Number.isNaN(Date.parse(raw))) throw new Error("--since takes an ISO 8601 time");
  return raw;
}

function parseList(raw, option) {
  const items = [...new Set(raw.split(",").map(item => item.trim()).filter(Boolean))];
  if (!items.length) throw new Error(`${option} takes a comma-separated list`);
  return items;
}

function parseFloor(raw, option) {
  const floor = Number(raw);
  if (!/^\d*\.?\d+$/.test(raw) || !(floor > 0 && floor < 1)) throw new Error(`${option} must be a number between 0 and 1`);
  return floor;
}

/** Tag names are compared as Segment Studio matches a model label to a Cove tag: trimmed, case-insensitive. */
export function normalizeTag(name) {
  return String(name).trim().normalize("NFC").toLowerCase();
}

export function floorsFrom(minFloor) {
  const floors = new Set([CURRENT_FLOOR]);
  for (let hundredths = Math.ceil(minFloor * 100 - EPSILON); hundredths <= 95; hundredths += 5) floors.add(hundredths / 100);
  return [...floors].filter(floor => floor >= minFloor - EPSILON).sort((a, b) => a - b);
}

/**
 * Spans a tag's per-frame predictions cover at a floor, built the way Segment Studio builds review candidates:
 * consecutive sampled frames at or above the floor merge, and a span runs one frame interval past its last frame.
 * An unscored prediction is kept at every floor, as candidate building keeps it.
 */
export function predictedSpans(points, floor, interval, duration) {
  const times = points.filter(([, confidence]) => confidence === null || confidence >= floor - EPSILON).map(([time]) => time).sort((a, b) => a - b);
  const spans = [];
  for (const time of times) {
    const last = spans.at(-1);
    if (last && time - last.lastTime <= interval * 1.5 + EPSILON) last.lastTime = time;
    else spans.push({ start: time, lastTime: time });
  }
  const end = duration > 0 ? duration : Infinity;
  return spans.map(span => [Math.min(span.start, end), Math.min(span.lastTime + interval, end)]).filter(([start, stop]) => stop > start);
}

export function union(spans) {
  const sorted = spans.filter(([start, end]) => end > start).map(([start, end]) => [start, end]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const merged = [];
  for (const span of sorted) {
    const last = merged.at(-1);
    if (last && span[0] <= last[1] + EPSILON) last[1] = Math.max(last[1], span[1]);
    else merged.push(span);
  }
  return merged;
}

export function length(spans) {
  return spans.reduce((total, [start, end]) => total + (end - start), 0);
}

/** Overlap between two sets of spans, each already merged by union(). */
export function overlap(left, right) {
  let total = 0;
  for (let i = 0, j = 0; i < left.length && j < right.length;) {
    total += Math.max(0, Math.min(left[i][1], right[j][1]) - Math.max(left[i][0], right[j][0]));
    if (left[i][1] < right[j][1]) i++; else j++;
  }
  return total;
}

/** Scores one tag on one video: published segments against the spans predicted at one floor. */
export function score(published, predicted) {
  const truth = union(published);
  const guess = union(predicted);
  const kept = overlap(truth, guess);
  const startShifts = [];
  const endShifts = [];
  let matchedSegments = 0;
  for (const segment of published) {
    const touching = guess.filter(([start, end]) => end > segment[0] + EPSILON && start < segment[1] - EPSILON);
    if (!touching.length) continue;
    matchedSegments++;
    startShifts.push(touching[0][0] - segment[0]);
    endShifts.push(touching.at(-1)[1] - segment[1]);
  }
  const extraSpans = guess.filter(span => overlap(truth, [span]) <= EPSILON).length;
  return {
    publishedSeconds: length(truth),
    predictedSeconds: length(guess),
    keptSeconds: kept,
    missedSeconds: length(truth) - kept,
    extraSeconds: length(guess) - kept,
    publishedSegments: published.length,
    matchedSegments,
    missedSegments: published.length - matchedSegments,
    predictedSpans: guess.length,
    extraSpans,
    startShifts,
    endShifts,
  };
}

/** Adds scores of the same tag from several videos. */
export function combine(scores) {
  const total = { publishedSeconds: 0, predictedSeconds: 0, keptSeconds: 0, missedSeconds: 0, extraSeconds: 0, publishedSegments: 0, matchedSegments: 0, missedSegments: 0, predictedSpans: 0, extraSpans: 0, startShifts: [], endShifts: [] };
  for (const item of scores) {
    for (const key of Object.keys(total)) {
      if (Array.isArray(total[key])) total[key].push(...item[key]);
      else total[key] += item[key];
    }
  }
  return total;
}

/** Time-overlap F1: how closely the predicted time matches the published time. */
export function f1(item) {
  const denominator = item.publishedSeconds + item.predictedSeconds;
  return denominator > 0 ? (2 * item.keptSeconds) / denominator : 0;
}

/** The floor whose combined score matches the published time best; a tie goes to the higher floor. None when nothing was predicted at any floor. */
export function bestFloor(byFloor) {
  if ([...byFloor.values()].every(item => item.predictedSeconds <= EPSILON)) return { floor: null, score: byFloor.values().next().value };
  let best = null;
  for (const [floor, item] of byFloor) {
    if (!best || f1(item) > f1(best.score) + EPSILON || (Math.abs(f1(item) - f1(best.score)) <= EPSILON && floor > best.floor)) best = { floor, score: item };
  }
  return best;
}

export function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

/**
 * Which model produced each prediction category in a run. AI Core's journal keeps the server's model list with
 * its versions; the copy stored with the raw row is the fallback, since the dispatch drops numeric versions.
 */
export function modelsByCategory(row) {
  const byCategory = new Map();
  const journal = Array.isArray(row.journalModels) ? row.journalModels : [];
  for (const model of Array.isArray(row.models) ? row.models : []) {
    const configName = model.configName ?? model.config_name ?? model.name;
    const recorded = journal.find(candidate => (candidate.config_name ?? candidate.name) === configName);
    const version = model.version ?? recorded?.version ?? null;
    const label = `${model.name || configName}${version === null || version === undefined ? " (version unknown)" : ` v${version}`}`;
    for (const category of model.categories ?? recorded?.categories ?? []) byCategory.set(category, label);
  }
  return byCategory;
}

/** Whether a stored row came from a store-only run rather than review tagging. */
export function isStoreOnly(row) {
  return Array.isArray(row.analyses) && row.analyses.includes(STORE_ONLY_ANALYSIS);
}

/**
 * Scores every stored run row. Each row is one video's most recent capture with its published segments; the
 * result has one entry per (video, tag) holding the score at every floor.
 */
export function evaluate(rows, { tags = null, excludeSources = [], minFloor = null, floor = null } = {}) {
  const thresholds = rows.map(row => row.threshold).filter(value => value !== null && value !== undefined);
  const lowest = minFloor ?? Math.max(0.2, ...thresholds);
  const floors = [...new Set([...floorsFrom(lowest), ...(floor === null ? [] : [floor])])].sort((a, b) => a - b);
  const excluded = new Set(excludeSources);
  const pairs = [];
  for (const row of rows) {
    const interval = row.interval > 0 ? row.interval : 0.5;
    const models = modelsByCategory(row);
    const predicted = new Map();
    for (const [category, byTag] of Object.entries(row.payload?.tags ?? {})) {
      for (const [tag, points] of Object.entries(byTag)) {
        const key = normalizeTag(tag);
        const entry = predicted.get(key) ?? { points: [], models: new Set() };
        entry.points.push(...points);
        entry.models.add(models.get(category) ?? `${category} model (unknown)`);
        predicted.set(key, entry);
      }
    }
    const published = new Map();
    for (const segment of row.published ?? []) {
      if (excluded.has(segment.source)) continue;
      const key = normalizeTag(segment.tag);
      const end = segment.end !== null && segment.end > segment.start ? segment.end : segment.start + interval;
      const list = published.get(key) ?? { name: segment.tag, spans: [] };
      list.spans.push([segment.start, end]);
      published.set(key, list);
    }
    const scored = tags ?? [...published.keys()];
    for (const key of scored) {
      const prediction = predicted.get(key);
      const truth = published.get(key)?.spans ?? [];
      const model = prediction ? [...prediction.models].sort().join(" + ") : `not predicted by ${[...new Set(models.values())].sort().join(" + ") || "any model"}`;
      const byFloor = new Map(floors.map(floor => [floor, score(truth, prediction ? predictedSpans(prediction.points, floor, interval, row.duration) : [])]));
      pairs.push({ videoId: row.videoId, aiRunId: row.aiRunId, threshold: row.threshold ?? null, tag: published.get(key)?.name ?? key, tagKey: key, model, byFloor });
    }
  }

  const groups = new Map();
  for (const pair of pairs) {
    const key = `${pair.tagKey}\u001f${pair.model}`;
    const group = groups.get(key) ?? { tag: pair.tag, model: pair.model, videos: 0, pairs: [] };
    group.videos++;
    group.pairs.push(pair);
    groups.set(key, group);
  }
  const summary = [...groups.values()].map(group => {
    const byFloor = new Map(floors.map(floor => [floor, combine(group.pairs.map(pair => pair.byFloor.get(floor)))]));
    return { tag: group.tag, tagKey: group.pairs[0].tagKey, model: group.model, videos: group.videos, byFloor, best: bestFloor(byFloor) };
  }).sort((a, b) => b.byFloor.get(floors[0]).publishedSeconds - a.byFloor.get(floors[0]).publishedSeconds || a.tag.localeCompare(b.tag));
  const storeOnlyRuns = rows.filter(isStoreOnly).length;
  return { floors, lowestFloor: lowest, thresholds: [...new Set(thresholds)].sort(), unknownThresholdRuns: rows.length - thresholds.length, storeOnlyRuns, reviewRuns: rows.length - storeOnlyRuns, pairs, summary };
}

const seconds = value => (value === null ? "-" : `${value.toFixed(1)}`);
const percent = (part, whole) => (whole > 0 ? `${Math.round((100 * part) / whole)}%` : "-");
const shift = values => (values.length ? `${median(values) >= 0 ? "+" : ""}${median(values).toFixed(1)}` : "-");

function table(headers, rows) {
  const widths = headers.map((header, index) => Math.max(header.length, ...rows.map(row => String(row[index]).length)));
  const line = cells => `| ${cells.map((cell, index) => String(cell).padEnd(widths[index])).join(" | ")} |`;
  return [line(headers), `|${widths.map(width => "-".repeat(width + 2)).join("|")}|`, ...rows.map(line)].join("\n");
}

export function render(result, { rowCount, floor = null } = {}) {
  const out = [];
  const models = [...new Set(result.summary.map(item => item.model))].sort();
  out.push(`# AI tagging comparison`, "");
  out.push(`Runs compared: ${rowCount} (one per video, the most recent stored: ${result.storeOnlyRuns} store-only, ${result.reviewRuns} from review tagging). Tag/video pairs scored: ${result.pairs.length}.`);
  out.push(`Stored thresholds: ${result.thresholds.length ? result.thresholds.join(", ") : "none recorded"}${result.unknownThresholdRuns ? `; ${result.unknownThresholdRuns} run(s) with an unknown threshold, whose low floors may be missing predictions` : ""}. Floors tried: ${result.floors[0]}–${result.floors.at(-1)}.`);
  out.push(`Models: ${models.join("; ") || "none"}.`, "");
  out.push(`Published segments were reviewed from drafts of runs that asked for no threshold, so the AI server applied each tagging model's own default (0.5 in production). Stored predictions may come from a lower threshold: below the default, a floor also scores frames that never reached a draft.`, "");
  out.push(`## Per tag, all videos`, "");
  out.push(table(
    ["Tag", "Model", "Videos", "Published s", `@${CURRENT_FLOOR} kept`, `@${CURRENT_FLOOR} missed s`, `@${CURRENT_FLOOR} extra s`, "Best floor", "Best kept", "Best missed s", "Best extra s", "Start shift", "End shift", "Best F1"],
    result.summary.map(item => {
      const current = item.byFloor.get(CURRENT_FLOOR);
      const best = item.best.score;
      return [item.tag, item.model, item.videos, seconds(current.publishedSeconds), percent(current.keptSeconds, current.publishedSeconds), seconds(current.missedSeconds), seconds(current.extraSeconds), item.best.floor === null ? "-" : item.best.floor.toFixed(2), percent(best.keptSeconds, best.publishedSeconds), seconds(best.missedSeconds), seconds(best.extraSeconds), shift(best.startShifts), shift(best.endShifts), f1(best).toFixed(2)];
    })));
  out.push("", `Shifts are medians in seconds over published segments the predictions touch. Best floor maximises time-overlap F1 summed over the tag's videos.`, "");
  out.push(`## Per video and tag, ${floor === null ? "at each tag's best floor" : `at floor ${floor}`}`, "");
  const bestByTag = new Map(result.summary.map(item => [`${item.tagKey}\u001f${item.model}`, item.best.floor]));
  const rows = [...result.pairs].sort((a, b) => a.videoId - b.videoId || a.tag.localeCompare(b.tag)).map(pair => {
    const chosen = floor ?? bestByTag.get(`${pair.tagKey}\u001f${pair.model}`) ?? result.floors[0];
    const item = pair.byFloor.get(chosen);
    return [pair.videoId, pair.tag, pair.model, chosen.toFixed(2), seconds(item.publishedSeconds), seconds(item.keptSeconds), seconds(item.missedSeconds), seconds(item.extraSeconds), `${item.matchedSegments}/${item.publishedSegments}`, item.extraSpans, shift(item.startShifts), shift(item.endShifts)];
  });
  out.push(table(["Video", "Tag", "Model", "Floor", "Published s", "Kept s", "Missed s", "Extra s", "Segments hit", "Extra spans", "Start shift", "End shift"], rows));
  return out.join("\n");
}

/** Every stored raw row, whichever claim wrote it, newest per video. */
export function rowsQuery(options) {
  const where = [
    options.videoIds ? `x.video_id IN (${options.videoIds.join(",")})` : null,
    options.since ? `x.created_at >= '${options.since}'::timestamptz` : null,
  ].filter(Boolean);
  return `
    WITH latest AS (
      SELECT DISTINCT ON (x.video_id) x.* FROM segment_studio_ai_raw_results x
      ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY x.video_id, x.created_at DESC)
    SELECT COALESCE(json_agg(json_build_object(
      'videoId', l.video_id, 'runId', l.run_id, 'aiRunId', l.ai_run_id, 'threshold', l.threshold,
      'interval', l.frame_interval_seconds, 'duration', l.duration_seconds, 'frameCount', l.frame_count,
      'schemaVersion', l.schema_version, 'models', l.models, 'payload', l.payload,
      'analyses', (SELECT r.analyses FROM segment_studio_analysis_runs r WHERE r.id = l.run_id),
      'journalModels', (SELECT a."Models" FROM ai_runs a WHERE a."RunKey" = l.ai_run_id AND a."TargetType" = 1 AND a."TargetId" = l.video_id LIMIT 1),
      'published', (SELECT COALESCE(json_agg(json_build_object('tag', t."Name", 'start', s."StartSec", 'end', s."EndSec", 'source', s."SourceKey")), '[]'::json)
        FROM segment_studio_items i JOIN segments s ON s."Id" = i.native_segment_id JOIN tags t ON t."Id" = s."TagId"
        WHERE s."HostType" = 1 AND s."HostId" = l.video_id AND s."Kind" = 'tag')
    ) ORDER BY l.video_id), '[]'::json) FROM latest l`;
}

function readRows(options) {
  const sql = rowsQuery(options);
  const command = options.local
    ? ["psql", "--no-psqlrc", "--tuples-only", "--no-align", "--quiet", "--command", sql]
    : ["docker", "exec", "--user", "postgres", options.container, "psql", "--dbname", "cove", "--no-psqlrc", "--tuples-only", "--no-align", "--quiet", "--command", sql];
  const result = spawnSync(command[0], command.slice(1), { encoding: "utf8", maxBuffer: 2 * 1024 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw new Error(`Database query failed: ${result.error?.message ?? result.stderr.trim()}`);
  const rows = JSON.parse(result.stdout);
  const unknown = rows.filter(row => row.schemaVersion !== 1);
  if (unknown.length) throw new Error(`Stored rows use a payload schema this report does not read: ${[...new Set(unknown.map(row => row.schemaVersion))].join(", ")}`);
  return rows;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) { console.log(help); return; }
  const rows = readRows(options);
  if (!rows.length) throw new Error("No stored AI predictions match; store some first");
  const result = evaluate(rows, options);
  console.log(render(result, { rowCount: rows.length, floor: options.floor }));
  if (options.json) {
    const plain = value => (value instanceof Map ? Object.fromEntries([...value].map(([key, item]) => [key, plain(item)])) : Array.isArray(value) ? value.map(plain) : value && typeof value === "object" ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, plain(item)])) : value);
    fs.writeFileSync(options.json, JSON.stringify(plain(result), null, 2));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
