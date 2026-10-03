# Blast From The Past

Blast From The Past adds a home dashboard widget that replays the moments in your viewing sessions that ended in a like. For each like it finds the playback session it happened in, works out where in the video you were, and plays a short looping clip around that point.

Cove records when a video was liked but not the position, so the widget recovers it from that session's playback history. A pause shortly before the like gives the exact position; otherwise it is estimated from a pause just after the like or from the watched stretch that was playing at that moment. Likes that have no matching playback session, such as ones imported from another app, are skipped. The widget asks the extension which of your liked videos have a like inside one of your playback sessions, then reads those videos in random order until it has enough moments, so a moment can come from any liked video however long ago it was last played.

One moment is featured in a player that opens on the clip and loops it. Its scrubber spans the whole video with the clip window and the like marked on it; moving the playhead elsewhere plays on from there, and **Back to the moment** returns to the loop. **Watch from** opens the video in Cove’s player at the clip start, or at the current position after moving away from it. The other moments are listed beside it on a wide dashboard, or below it in a narrow column. Each load shows a random set, and the shuffle button looks through your liked videos again for another, so any liked moment can come up.

Settings:

- **Start before the like**: how much of the lead-up to include, 0 seconds to 2 minutes (default 15 seconds).
- **Clip length**: how long the clip is, 5 seconds to 3 minutes (default 30 seconds).
- **Moments shown**: 1 to 12 (default 6).
- **Play clips automatically**: on by default. Clips play muted, loop, and pause when scrolled out of view. Autoplay is off when the system asks for reduced motion.

The extension adds one read-only endpoint, `GET /api/plugins/com.midnightrider.blast-from-the-past/candidates`, which returns only the ids of videos the signed-in user liked during their own playback sessions. It requires sign-in and video read access, rejects share links, and never considers other users' likes or sessions. The widget then loads those videos through Cove's authorization-filtered video search and the current user's video history, so a video you can no longer see is left out. The extension adds no database state.

## Backfilling moments

Likes made before Cove recorded playback sessions, or imported from another app, have no session to place them in, so the widget skips them. `scripts/backfill-moments.mjs` gives such a like the playback history the widget needs: you say where in the video the clip should start, and it writes a finished playback session that plays up to that point and pauses just before the like. The widget then shows it as **Paused at the like**, dated when the like was made. The script is not installed with the extension; run it from a checkout of this repository.

It writes Cove's own tables directly: `playback_sessions`, `playback_intervals`, `interactions` and `user_entity_affinities`. It follows the schema of the Cove version named by `minCoveVersion` in `extension.json`; a later Cove schema change may need an updated script. Each run is a single transaction, and every row it writes is tagged so it can be removed again. Back up those tables, or the whole database, before the first run, and try each command with `--dry-run`, which runs it and rolls it back.

It needs Node.js 20 or later and `psql` on the `PATH`. It connects the way `psql` does, from the standard `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER` and `PGPASSWORD` variables, or from a connection string passed with `--database`. Cove's managed PostgreSQL listens on `127.0.0.1`, port `5433` by default, with database `cove` and user `postgres`, and accepts connections only from the same machine; with your own PostgreSQL, use the details from Cove's connection string. When Cove has more than one user, choose whose likes to backfill with `--user <username>`. No Cove restart is needed; reload the dashboard.

```bash
node scripts/backfill-moments.mjs --list                  # liked videos with likes lacking history, newest like first
node scripts/backfill-moments.mjs --list 123              # each like of video 123 and what covers it
node scripts/backfill-moments.mjs 123 12:30 --dry-run     # try it
node scripts/backfill-moments.mjs 123 12:30               # the clip starts at 12:30
node scripts/backfill-moments.mjs 123 4:00 1:02:15        # two likes of video 123, oldest first
node scripts/backfill-moments.mjs --remove 123            # remove everything backfilled for video 123
```

- **Clip starts** are video positions in seconds, `m:ss` or `h:mm:ss`. The like is placed that many seconds later, 15 by default; pass `--lead` with your widget's **Start before the like** setting if you changed it.
- **Which likes** are filled: the video's likes that have no playback history, one clip start each, assigned oldest first in the order `--list <videoId>` shows them. With fewer clip starts than such likes, the most recent ones are filled. `--like-at <ISO time>` fills the like made at that time instead.
- **New likes** are created only with `--new`: with it, a video whose likes all have history gets new likes dated a minute ago, and `--like-at` creates a like at a time the video has none. New likes count towards the video's like counter.
- **One viewing**: likes made within five minutes of each other share one session that plays up to each position in turn, so give clip starts for all of them together. Likes less than 20 seconds apart, or positions in one viewing less than 5 seconds apart, are refused, because the widget could not tell them apart.
- **Last played**: a backfilled session can move the video's last played time forward to when the like was made. `--remove` deletes only the rows the script wrote, takes back the likes it created, and restores last played.

Build a development ZIP from the repository root with `package-midnight-rider-extension --repository . --extension com.midnightrider.blast-from-the-past --configuration Debug` and install the URL it prints through Cove's extension installer.
