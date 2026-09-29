# Blast From The Past

Blast From The Past adds a home dashboard widget that replays the moments in your viewing sessions that ended in a like. For each like it finds the playback session it happened in, works out where in the video you were, and plays a short looping clip around that point.

Cove records when a video was liked but not the position, so the widget recovers it from that session's playback history. A pause shortly before the like gives the exact position; otherwise it is estimated from a pause just after the like or from the watched stretch that was playing at that moment. Likes that have no matching playback session, such as ones imported from another app, are skipped. The widget asks the extension which of your liked videos have a like inside one of your playback sessions, then reads those videos in random order until it has enough moments, so a moment can come from any liked video however long ago it was last played.

One moment is featured in a player that opens on the clip and loops it. Its scrubber spans the whole video with the clip window and the like marked on it; moving the playhead elsewhere plays on from there, and **Back to the moment** returns to the loop. **Watch from** opens the video in Cove’s player at the clip start, or at the current position after moving away from it. The other moments are listed beside it on a wide dashboard, or below it in a narrow column. Each load shows a random set, and the shuffle button picks another.

Settings:

- **Start before the like**: how much of the lead-up to include, 0 seconds to 2 minutes (default 15 seconds).
- **Clip length**: how long the clip is, 5 seconds to 3 minutes (default 30 seconds).
- **Moments shown**: 1 to 12 (default 6).
- **Play clips automatically**: on by default. Clips play muted, loop, and pause when scrolled out of view. Autoplay is off when the system asks for reduced motion.

The extension adds one read-only endpoint, `GET /api/plugins/com.midnightrider.blast-from-the-past/candidates`, which returns only the ids of videos the signed-in user liked during their own playback sessions. It requires sign-in and video read access, rejects share links, and never considers other users' likes or sessions. The widget then loads those videos through Cove's authorization-filtered video search and the current user's video history, so a video you can no longer see is left out. The extension adds no database state.

Build a development ZIP from the repository root with `package-midnight-rider-extension --repository . --extension com.midnightrider.blast-from-the-past --configuration Debug` and install the URL it prints through Cove's extension installer.
