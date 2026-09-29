#!/usr/bin/env node
// Backfills the playback history Blast From The Past needs to place a like, for likes that have none,
// such as ones imported from another app. See "Backfilling moments" in the extension README.
//
//   node backfill-moments.mjs --list [--all]                   liked videos with likes still lacking history
//   node backfill-moments.mjs --list <videoId>                 each like of a video and what covers it
//   node backfill-moments.mjs <videoId> <clipStart>... [--lead 15] [--like-at ISO] [--new] [--dry-run]
//   node backfill-moments.mjs --remove <videoId>
//   (every form takes --user <username> and --database <connection string>)
//
// It writes Cove's tables directly through psql, so it follows Cove's schema: rows are tagged
// {"backfilledBy": "blast-from-the-past-backfill"} and --remove deletes exactly those.

import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export const TAG = "blast-from-the-past-backfill";
const VIDEO = 1; // InteractionHostType.Video
const KIND = { pause: 4, seek: 5, like: 8 }; // InteractionKind
const ENDED = 3; // PlaybackSessionState.Ended

export const PAUSE_BEFORE_LIKE_MS = 8_000;
export const SESSION_END_AFTER_LIKE_MS = 2_000;
export const RUN_SECONDS = 60;
export const SAME_VIEWING_MS = 5 * 60_000;
export const MIN_LIKE_GAP_MS = 20_000;
export const MIN_POSITION_GAP_SECONDS = 5; // the widget merges moments of one session closer than this
export const NEW_LIKE_SPACING_MS = 30_000;

export class BackfillError extends Error {}

const fail = (message) => {
  throw new BackfillError(message);
};

export function parseSeconds(text) {
  const parts = String(text).split(":");
  if (parts.length > 3 || parts.some((part) => !/^\d+(\.\d+)?$/.test(part))) fail(`bad timestamp "${text}"`);
  return parts.reduce((total, part) => total * 60 + Number(part), 0);
}

export function clock(seconds) {
  const value = Math.max(0, Math.round(seconds));
  const h = Math.floor(value / 3600);
  const m = Math.floor((value % 3600) / 60);
  const s = String(value % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

export const when = (ms) => new Date(ms).toISOString().replace("T", " ").slice(0, 19);

const covered = (like) => like.real || like.backfilledAt != null;

export const status = (like) =>
  like.real ? "real session" : like.backfilledAt != null ? `backfilled at ${clock(like.backfilledAt)}` : "missing";

// Splits items with an `ms` timestamp, sorted by time, into runs made during one viewing.
export function viewings(items) {
  const groups = [];
  for (const item of items) {
    const last = groups.at(-1);
    if (last && item.ms - last.at(-1).ms <= SAME_VIEWING_MS) last.push(item);
    else groups.push([item]);
  }
  return groups;
}

// Decides which likes get history, oldest first. `likes` are the video's likes sorted by time, each
// { ms, real, backfilledAt }; `positions` are like positions in seconds, assigned to the targets in order.
// New likes are created only with `allowNew` (--new).
export function chooseTargets({ likes, positions, likeAtMs = null, allowNew = false, now = Date.now() }) {
  const missing = likes.filter((like) => !covered(like));
  let targets;
  if (likeAtMs != null) {
    if (positions.length !== 1) fail("--like-at takes a single clip start");
    if (!Number.isFinite(likeAtMs)) fail("bad --like-at time");
    if (likeAtMs > now) fail("--like-at must be in the past");
    const existing = likes.find((like) => Math.abs(like.ms - likeAtMs) <= 2_000);
    if (existing && covered(existing)) fail(`the like at ${when(existing.ms)} already has history (${status(existing)})`);
    if (!existing && !allowNew) fail(`the video has no like at ${when(likeAtMs)}; pass --new to create one`);
    targets = [existing ? { ms: existing.ms, create: false } : { ms: likeAtMs, create: true }];
  } else if (!missing.length) {
    if (!allowNew) fail(likes.length ? "every like of the video already has history; pass --new to add new likes" : "the video has no likes; pass --new to create them");
    const last = now - 60_000;
    targets = positions.map((_, i) => ({ ms: last - (positions.length - 1 - i) * NEW_LIKE_SPACING_MS, create: true }));
  } else if (positions.length > missing.length) {
    fail(`the video has ${missing.length} like${missing.length === 1 ? "" : "s"} without history but ${positions.length} clip starts were given; see --list <videoId>`);
  } else {
    targets = missing.slice(-positions.length).map((like) => ({ ms: like.ms, create: false }));
  }

  // Filling only part of one viewing would leave its other likes to a later, overlapping session.
  const targetSet = new Set(targets.map((target) => target.ms));
  for (const group of viewings(missing)) {
    const picked = group.filter((like) => targetSet.has(like.ms));
    if (picked.length && picked.length < group.length) {
      fail(`the likes at ${group.map((like) => when(like.ms)).join(", ")} were one viewing; give clip starts for all ${group.length}`);
    }
  }
  for (const target of targets) {
    const near = likes.find((like) => covered(like) && Math.abs(like.ms - target.ms) <= SAME_VIEWING_MS);
    if (near) fail(`the like at ${when(target.ms)} is in the same viewing as the like at ${when(near.ms)}, which already has history (${status(near)})`);
  }
  return targets.map((target, i) => ({ ...target, positionSec: positions[i] }));
}

// Lays out one ended session per viewing. For each like: play up to its position (after seeking there
// from the previous like), pause 8s before the like, like. The session ends 2s after its last like.
// The widget reads a pause just before a like, with no playback in between, as the exact like position.
export function planSessions(moments) {
  return viewings(moments).map((group) => {
    for (let i = 1; i < group.length; i += 1) {
      if (group[i].ms - group[i - 1].ms < MIN_LIKE_GAP_MS) {
        fail(`the likes at ${when(group[i - 1].ms)} and ${when(group[i].ms)} are too close together to backfill separately`);
      }
      for (let j = 0; j < i; j += 1) {
        if (Math.abs(group[i].positionSec - group[j].positionSec) < MIN_POSITION_GAP_SECONDS) {
          fail(`likes in one viewing need positions at least ${MIN_POSITION_GAP_SECONDS}s apart, or the widget shows them as one moment`);
        }
      }
    }
    const runs = [];
    const events = [];
    let startedAtMs;
    group.forEach((moment, i) => {
      const pauseAt = moment.ms - PAUSE_BEFORE_LIKE_MS;
      const earliest = i ? group[i - 1].ms + SESSION_END_AFTER_LIKE_MS : -Infinity;
      const runSeconds = Math.max(0, Math.min(RUN_SECONDS, moment.positionSec, (pauseAt - earliest) / 1000));
      const startSec = moment.positionSec - runSeconds;
      const playFrom = pauseAt - runSeconds * 1000;
      if (i) events.push({ kind: "seek", at: playFrom, meta: { fromSec: group[i - 1].positionSec, toSec: startSec } });
      if (runSeconds > 0) runs.push({ startSec, endSec: moment.positionSec, recordedAt: pauseAt });
      events.push({ kind: "pause", at: pauseAt, meta: { positionSec: moment.positionSec } });
      if (moment.create) events.push({ kind: "like", at: moment.ms, meta: {} });
      if (!i) startedAtMs = playFrom - 2_000;
    });
    return {
      moments: group,
      startedAtMs,
      endedAtMs: group.at(-1).ms + SESSION_END_AFTER_LIKE_MS,
      lastPositionSec: group.at(-1).positionSec,
      watchedSec: runs.reduce((total, run) => total + run.endSec - run.startSec, 0),
      runs,
      events,
    };
  });
}

// "Last played" as it was before backfilling: while the current value is the end of a backfilled session,
// step back to the value that session recorded before it was written. Each session is used once, so a
// value a session recorded that equals another's end cannot loop.
export function restoreLastConsumed(current, backfilled) {
  const remaining = [...backfilled];
  let value = current;
  while (value) {
    const index = remaining.findIndex((session) => session.endMs === Date.parse(value));
    if (index < 0) break;
    value = remaining.splice(index, 1)[0].before ?? null;
  }
  return value;
}

// Database access, only when run as a command.

const USAGE = `usage: backfill-moments.mjs --list [--all] | --list <videoId>
       backfill-moments.mjs <videoId> <clipStart>... [--lead 15] [--like-at ISO] [--new] [--dry-run]
       backfill-moments.mjs --remove <videoId>
options for all: --user <username> (needed when Cove has several users), --database <connection string>`;

function parseArgs(argv) {
  const options = { lead: 15, dryRun: false, remove: false, list: false, all: false, positional: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => argv[++i] ?? fail(`${arg} needs a value`);
    if (arg === "--lead") options.lead = Number(next());
    else if (arg === "--like-at") options.likeAt = next();
    else if (arg === "--user") options.user = next();
    else if (arg === "--database") options.database = next();
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--new") options.allowNew = true;
    else if (arg === "--remove") options.remove = true;
    else if (arg === "--list") options.list = true;
    else if (arg === "--all") options.all = true;
    else if (arg === "-h" || arg === "--help") options.help = true;
    else if (arg.startsWith("--")) fail(`unknown option ${arg}`);
    else options.positional.push(arg);
  }
  return options;
}

const literal = (value) => `'${String(value).replaceAll("'", "''")}'`;
const ts = (ms) => `${literal(new Date(ms).toISOString())}::timestamptz`;
const json = (value) => `${literal(JSON.stringify(value))}::jsonb`;

function table(rows, columns) {
  const widths = columns.map(([title, get]) => Math.max(title.length, ...rows.map((row) => String(get(row)).length)));
  const line = (cells) => cells.map((cell, i) => String(cell).padEnd(widths[i])).join("  ").trimEnd();
  console.log(line(columns.map(([title]) => title)));
  for (const row of rows) console.log(line(columns.map(([, get]) => get(row))));
}

function run(argv) {
  const options = parseArgs(argv);
  if (options.help) {
    console.log(USAGE);
    return;
  }
  const psql = (sql) => execFileSync("psql",
    [...(options.database ? ["-d", options.database] : []), "-X", "-q", "-A", "-t", "-v", "ON_ERROR_STOP=1", "-c", sql],
    { encoding: "utf8" }).trim();
  const queryJson = (sql) => JSON.parse(psql(`select coalesce(json_agg(q), '[]') from (${sql}) q`) || "[]");

  const users = queryJson(options.user
    ? `select "Id" as id from users where "Username" = ${literal(options.user)}`
    : `select "Id" as id from users`);
  if (options.user && !users.length) fail(`no user "${options.user}"`);
  if (users.length !== 1) fail(users.length ? "Cove has several users; choose one with --user <username>" : "Cove has no users");
  const userId = users[0].id;

  const durationSql = (video) => `coalesce((select coalesce(f."VideoFile_Duration", f."Duration") from files f where f."Id" = ${video}."PrimaryFileId"),
    (select max(coalesce(f."VideoFile_Duration", f."Duration")) from files f where f."VideoId" = ${video}."Id"), 0)`;

  // Every like of the user's videos (or of one video) with what covers it. A real session covers a like
  // within the widget's session window: from 10s before the session starts to 2 min after it ends.
  const likesSql = (videoId) => {
    const same = `s."UserId" = i."UserId" and s."HostType" = i."HostType" and s."HostId" = i."HostId"`;
    const likeMs = `floor(extract(epoch from i."At") * 1000)::bigint`;
    return `select i."HostId" as "videoId", ${likeMs} as ms,
        exists (select 1 from playback_sessions s where ${same} and s."Context"->>'backfilledBy' is null
          and i."At" between s."StartedAt" - interval '10 seconds' and coalesce(s."EndedAt", s."LastSeenAt") + interval '120 seconds') as real,
        (select (m->>'positionSec')::float8 from playback_sessions s, jsonb_array_elements(s."Context"->'moments') m
          where ${same} and s."Context"->>'backfilledBy' = ${literal(TAG)} and (m->>'likeAtMs')::bigint = ${likeMs} limit 1) as "backfilledAt"
      from interactions i
      where i."UserId" = ${userId} and i."HostType" = ${VIDEO} and i."Kind" = ${KIND.like}${videoId ? ` and i."HostId" = ${videoId}` : ""}`;
  };

  const videoId = options.positional.length ? Number(options.positional[0]) : null;
  if (videoId !== null && (!Number.isInteger(videoId) || videoId <= 0)) fail(`bad video ID "${options.positional[0]}"`);

  if (options.list && videoId === null) {
    const rows = queryJson(`with likes as (${likesSql(null)}),
        per as (select "videoId", count(*) as likes, count(*) filter (where real) as real,
          count(*) filter (where not real and "backfilledAt" is not null) as backfilled, max(ms) as "lastLikeMs" from likes group by 1)
      select p.*, p.likes - p.real - p.backfilled as missing, v."Title" as title, ${durationSql("v")} as duration
      from per p join videos v on v."Id" = p."videoId"
      ${options.all ? "" : "where p.likes > p.real + p.backfilled"}
      order by p."lastLikeMs" desc, p."videoId"`);
    if (!rows.length) {
      console.log("Every like has playback history.");
      return;
    }
    table(rows, [
      ["video", (row) => row.videoId],
      ["likes", (row) => row.likes],
      ["real", (row) => row.real],
      ["backfilled", (row) => row.backfilled],
      ["missing", (row) => row.missing],
      ["length", (row) => clock(row.duration)],
      ["last like", (row) => when(row.lastLikeMs).slice(0, 10)],
      ["title", (row) => (row.title ?? "").slice(0, 60)],
    ]);
    console.log(`\n${rows.length} videos, ${rows.reduce((total, row) => total + row.missing, 0)} likes without history.`);
    return;
  }

  if (videoId === null) fail(USAGE);
  const owned = `"UserId" = ${userId} and "HostType" = ${VIDEO} and "HostId" = ${videoId}`;
  const lastConsumed = () => queryJson(`select "LastConsumedAt" as at from user_entity_affinities where ${owned}`)[0]?.at ?? null;

  if (options.remove) {
    // Walk "last played" back past every value a backfilled session set, to what it was before the first of them.
    const backfilled = queryJson(`select floor(extract(epoch from "EndedAt") * 1000)::bigint as "endMs", "Context"->>'lastConsumedBefore' as before
      from playback_sessions where ${owned} and "Context"->>'backfilledBy' = ${literal(TAG)}`);
    const restored = restoreLastConsumed(lastConsumed(), backfilled);
    psql(`begin;
      with removed as (delete from interactions where ${owned} and "Kind" = ${KIND.like} and "Meta"->>'backfilledBy' = ${literal(TAG)} returning 1)
      update user_entity_affinities set "LikeCount" = greatest(0, "LikeCount" - (select count(*) from removed)),
        "LastConsumedAt" = ${restored ? `${literal(restored)}::timestamptz` : "null"}, "UpdatedAt" = now() where ${owned};
      delete from interactions where ${owned} and "Meta"->>'backfilledBy' = ${literal(TAG)};
      delete from playback_sessions where ${owned} and "Context"->>'backfilledBy' = ${literal(TAG)};
      commit;`);
    console.log(`Removed backfilled history of video ${videoId}.`);
    return;
  }

  const [video] = queryJson(`select v."Id" as id, v."Title" as title, ${durationSql("v")} as duration from videos v where v."Id" = ${videoId}`);
  if (!video) fail(`no video ${videoId}`);
  const durationSec = Number(video.duration) || 0;
  const likes = queryJson(`${likesSql(videoId)} order by ms`);

  if (options.list) {
    console.log(`Video ${videoId}${video.title ? ` · ${video.title}` : ""} · ${clock(durationSec)}`);
    if (!likes.length) console.log("No likes.");
    viewings(likes).forEach((group, index) => {
      if (index) console.log("");
      for (const like of group) console.log(`  ${when(like.ms)}  ${status(like)}`);
    });
    const missing = likes.filter((like) => !covered(like)).length;
    if (missing) console.log(`\n${missing} without history; clip starts fill them oldest first. Likes in one block were one viewing and share a session.`);
    return;
  }

  if (options.positional.length < 2) fail("give a video ID and at least one clip start, e.g. 123 12:30");
  if (!Number.isFinite(options.lead) || options.lead < 0 || options.lead > 120) fail("--lead must be 0-120 seconds");
  const positions = options.positional.slice(1).map((text) => parseSeconds(text) + options.lead);
  for (const position of positions) {
    if (durationSec > 0 && position >= durationSec) {
      fail(`like position ${clock(position)} (clip start + lead) is past the end of the video (${clock(durationSec)})`);
    }
  }

  const moments = chooseTargets({ likes, positions, likeAtMs: options.likeAt ? Date.parse(options.likeAt) : null, allowNew: options.allowNew });
  const sessions = planSessions(moments);

  const scopeKey = `video:${videoId}`;
  const lastConsumedBefore = lastConsumed();
  const playerMeta = { muted: false, surface: "detail", scopeKey, fullscreen: false, playbackRate: 1 };
  const statements = sessions.flatMap((session) => {
    const context = { backfilledBy: TAG, lastConsumedBefore, moments: session.moments.map(({ ms, positionSec }) => ({ likeAtMs: ms, positionSec })) };
    const intervals = session.runs.length
      ? `insert into playback_intervals ("PlaybackSessionId", "UserId", "HostType", "HostId", "StartSec", "EndSec", "RecordedAt",
          "Surface", "ScopeKey", "PlaybackRate", "CreatedAt", "UpdatedAt")
        select session."Id", ${userId}, ${VIDEO}, ${videoId}, run.start_sec, run.end_sec, run.recorded_at, 'detail', ${literal(scopeKey)}, 1, run.recorded_at, run.recorded_at
        from session, (values ${session.runs.map((item) => `(${item.startSec}::float8, ${item.endSec}::float8, ${ts(item.recordedAt)})`).join(", ")})
          as run(start_sec, end_sec, recorded_at);`
      : `select "Id" from session;`;
    const events = session.events.map((event) => {
      const meta = event.kind === "like" ? { backfilledBy: TAG } : { ...playerMeta, ...event.meta, backfilledBy: TAG };
      return `(${userId}, ${VIDEO}, ${videoId}, ${KIND[event.kind]}, ${ts(event.at)}, ${json(meta)}, ${ts(event.at)}, ${ts(event.at)})`;
    });
    return [
      `with session as (
        insert into playback_sessions ("UserId", "HostType", "HostId", "SessionId", "StartedAt", "LastSeenAt", "EndedAt", "State",
          "MediaDurationSec", "LastPositionSec", "TotalWatchedSec", "IsCompleted", "CountsAsView", "DerivedLikeAwarded",
          "Surface", "ScopeKey", "Autoplay", "Muted", "Fullscreen", "PlaybackRate", "Route", "Context", "CreatedAt", "UpdatedAt")
        values (${userId}, ${VIDEO}, ${videoId}, gen_random_uuid(), ${ts(session.startedAtMs)}, ${ts(session.endedAtMs)}, ${ts(session.endedAtMs)}, ${ENDED},
          ${durationSec}, ${session.lastPositionSec}, ${session.watchedSec}, false, false, false,
          'detail', ${literal(scopeKey)}, true, false, false, 1, ${literal(`/video/${videoId}`)}, ${json(context)}, ${ts(session.startedAtMs)}, ${ts(session.endedAtMs)})
        returning "Id")
      ${intervals}`,
      `insert into interactions ("UserId", "HostType", "HostId", "Kind", "At", "Meta", "CreatedAt", "UpdatedAt") values ${events.join(", ")};`,
    ];
  });

  // New likes count towards the video's like counter, and "last played" moves forward to the latest session.
  const created = moments.filter((moment) => moment.create).length;
  const lastSeenMs = Math.max(...sessions.map((session) => session.endedAtMs));
  statements.push(`insert into user_entity_affinities ("UserId", "HostType", "HostId", "IsFavorite", "LikeCount", "LastConsumedAt", "CreatedAt", "UpdatedAt")
    values (${userId}, ${VIDEO}, ${videoId}, false, ${created}, ${ts(lastSeenMs)}, now(), now())
    on conflict ("UserId", "HostType", "HostId") do update set
      "LikeCount" = user_entity_affinities."LikeCount" + ${created},
      "LastConsumedAt" = greatest(user_entity_affinities."LastConsumedAt", excluded."LastConsumedAt"),
      "UpdatedAt" = now();`);

  psql(`begin;\n${statements.join("\n")}\n${options.dryRun ? "rollback" : "commit"};`);

  console.log(`${options.dryRun ? "[dry run, rolled back] " : ""}Video ${videoId}${video.title ? ` · ${video.title}` : ""}`);
  for (const session of sessions) {
    for (const moment of session.moments) {
      const viewing = session.moments.length > 1 ? `  (one viewing of ${session.moments.length})` : "";
      console.log(`  ${moment.create ? "new" : "existing"} like ${when(moment.ms)}: paused at ${clock(moment.positionSec)}, clip from ${clock(Math.max(0, moment.positionSec - options.lead))}${viewing}`);
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    run(process.argv.slice(2));
  } catch (error) {
    console.error(`error: ${error instanceof BackfillError ? error.message : error?.stderr?.toString().trim() || error.message}`);
    process.exit(1);
  }
}
