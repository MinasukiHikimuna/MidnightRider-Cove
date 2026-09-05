# Segment Studio

Segment Studio gives you two ways to work with the segments in your Cove
library. **Basic mode** is a direct editor for ordinary segments stored in
Cove. **Full mode** adds Segment Studio-owned drafts, review, performer slots,
derivation, and other advanced tools.

Switching modes changes the tools you see. It does not migrate, approve, or
publish anything. Switching from Basic to Full clears Basic undo history and,
after confirmation, permanently removes only unprotected recycling-bin items.
Collected incorrect examples remain protected and manageable in either mode.

## Choose a mode

Open Segment Studio's mode menu and choose:

- **Basic** for straightforward Cove segment work. Segments you create are
  saved directly in Cove and do not need Segment Studio registration or review.
  You can edit timing and tags and use the recycling bin for bulk cleanup.
- **Full** when you need unpublished drafts, review decisions, performer slots,
  derivation rules and materialization, history, or shots.

AI feedback is shared by both modes. It applies only to segments whose active
origin or inherited provenance points to a registered AI source, including
registered native source and field provenance. A tag name or `_AI` suffix does
not make a segment eligible.

Basic shows ordinary native Cove segments. Full shows those same native segments
together with Segment Studio-owned items. Materialized derived segments always
remain Segment Studio-owned—even when approved—so they are available in Full
and never become hidden native Cove segments. Switching modes never converts
one storage type into the other.

This separation also applies when different people use different modes on the
same library. Basic edits the shared native segments; Full may add owned drafts
and derivations around them. Removing a native source in Basic automatically
deletes derived items supported only by that source and keeps derived items
that still have another source. A legacy import that made a derived item native
is invalid migration data, not a normal Basic/Full conflict, and must be
reloaded with the corrected migration.

The choice is remembered for your browser. If Basic mode is hiding unpublished
Full work, Segment Studio shows the number of hidden items and offers a shortcut
back to Full mode.

The **Videos** tab finds videos to open in the editor. The **Segments** tab finds
individual segments to preview or edit. Both use compact video-style cards and
Cove's numbered pagination controls above and below the results.

## Review performer-slot coverage

Open **Segment Studio → Settings → Performer slots** to see performer roles
inline for every tag in a Cove tag group. Tags are organized in the same group
order used by the editor. Within a group, they use `Sort Name` when set and
otherwise use their name. Slot-bearing tags without a group appear under
**Ungrouped**.

Each tag row shows all of its performer slots, gender hints, and whether the
same performer may fill multiple slots. Tags without roles remain visible with
a **No performer slots** label. Search by tag or slot label, filter to tags with
or without slots, and collapse groups when you need a shorter overview.

Choose **Edit** on a tag to use the same performer-role editor available from
the video editor and derivation settings. This dialog also lets you assign,
move, or unassign the tag in Cove's native tag groups. Manage the tag-group
catalog in Cove's tag settings. Saving refreshes the overview so the inline row
reflects the new configuration.

## Edit published segments

Basic mode opens the native segments already stored in Cove. Select a video,
choose a segment on the timeline or segment rail, and change its start time, end
time, or tag. Changes are saved directly to the Cove segment.

Pointer and keyboard selection leave the playhead and playback state unchanged.
Hold **Cmd** on macOS or **Ctrl** on other platforms while clicking segments in
either the timeline or segment rail to add them or, when several are selected,
remove them from the selection. The editor always keeps one segment selected.
The most recently added segment is active for the existing single-segment
editor and keyboard actions. Press **Enter** when you want to move to the active
segment and begin playback.

Choose **Select all** to clear editor filters, show derived segments, and select
every segment in the current video. Filtering reduces an existing selection to
the visible segments and keeps the first visible segment active when the prior
selection becomes hidden. Collapsing a Segment group never changes selection.
Changing videos starts a new selection, while deletion keeps surviving selected
segments and falls back to the first remaining visible segment when necessary.
Bulk review is atomic. Segment Studio validates the complete selection before
changing it, and a stale or invalid segment leaves the entire selection
unchanged so it can be reloaded and retried safely.

The segment rail and swimlane timeline use Cove's native tag groups. Group order
comes from Cove, and tags use **Sort Name** when set and otherwise use their
name. Select a group heading in either surface, or press **B**, to collapse or
expand the group containing the selected segment. Collapsing changes
only the presentation: it does not clear the selected segment or modify segment
data. The group heading remains available so it can be expanded again with the
pointer, and pressing **B** also expands the hidden selected group. Segment Studio
remembers collapsed groups in the current browser, and arrow navigation skips
their hidden lanes.

### Undo history

Choose **History** to inspect the ten most recent reversible editor actions.
Selecting an older state reverses that action and every newer dependent action;
selecting a newer state reapplies the required actions. A successful bulk
operation is one history entry. Bulk review changes and their history entry are
saved together, so undo never represents a partially applied selection.

History restoration uses the same item revisions and native update timestamps
as ordinary editing. A concurrency conflict stops restoration, reloads current
data and history, and does not advance the history cursor. Ownership transitions
are restored through stable Segment Studio item identity rather than assuming a
native segment ID remains unchanged.

Dependency-aware segment deletion, segment merging, permanent rejected-segment
deletion, and completed review are irreversible history barriers. After any of
them succeeds, Segment Studio clears the video's history for every user so an
older snapshot cannot recreate deleted lineage or refer to consumed segments.
Preview or failed irreversible operations leave history unchanged.

Choose **Keyboard shortcuts** in the editor header to see the bindings available
in the current mode. The reference is generated from the same registry that
handles key presses, so Basic mode does not advertise Full-only commands.
Press **Escape**, click the close button, or click outside the dialog to dismiss
it. Under **Segment Studio → Settings**, you can replace any binding, detect
conflicts before saving, reset the Stash Marker Studio defaults, or import and
export the browser-local key map. Actions that Stash leaves unbound, including
medium seeking, can be assigned there.

For timeline control, press **H** to center the playhead, **+** or **=** to zoom
in, **-** or **_** to zoom out, and **0** to fit the full video. On the desktop
split layout, press **Ctrl/Cmd+ArrowUp** or **Ctrl/Cmd+ArrowDown** to give the
swimlanes more or less vertical space. Press **1** through **9** to seek to 10%
through 90% of the video's media duration.

In a swimlane timeline, **Shift+click** another segment to select the contiguous
range from the active segment to that segment. Use **Ctrl/Cmd+Shift+click** to
add the range to the existing selection. You can also **Ctrl/Cmd+click** a
segment after selecting one range, then **Shift+click** elsewhere in that
segment's swimlane to add a second range without losing the first. Repeat this
in the same or another swimlane. The segment detail pane groups the selection
by the same Cove tag groups and performer swimlanes shown on the timeline. Each
swimlane starts collapsed with selected and review-state counts; expand it to
inspect segment timing, source, and derivation status. Choose a segment in the
expanded list to reduce the selection and return to its editable detail view.
When every selected segment belongs to one swimlane, press **R** to replace
them with one manually sourced segment spanning the
earliest start through the latest end (or the latest point time). Merging
permanently removes the other segments and discards their model, run, confidence,
and active provenance data.

When tag groups are configured, press **Shift+ArrowUp** or
**Shift+ArrowDown** to select the group above or below without changing the
selected segment. The selected group is highlighted in the timeline; press
**B** to collapse or reopen it.

In Full mode, **N** and **M** select the previous or next unreviewed segment
in the current swimlane. Add **Shift** to continue across visible swimlanes.
These searches stop at the first or last candidate instead of wrapping. In
either mode, **Tab** and **Shift+Tab** select the next or previous swimlane whose
segment touches the playhead. All of these keyboard selection commands leave
the playhead and playback state unchanged.

In Full mode, press **Z** to approve the selected segment or return an
approved segment to unreviewed. Press **X** to reject the selected segment or
return a rejected segment to unreviewed. Press **Shift+X** to confirm permanent
deletion of every rejected segment in the current video. Press **G** to open
performer-slot assignment when slots are available for the selected segment.

Press **Space** or **K** to play or pause. **J** and **L** seek backward or
forward by the small interval; **Ctrl+Shift+J** and **Ctrl+Shift+L** use the long
interval. Press **Enter** to seek to the selected segment and begin playback.
The small, medium, and long seek intervals—and the frame-step sizes used by the
next shortcut slice—can be changed under **Segment Studio → Settings**. They are
browser-local preferences.

Use **,** and **.** for the small frame step, **Shift+,**/**Shift+.** or
**;**/**:** for the medium step, and **Ctrl+;**/**Ctrl+Shift+:** for the long
step. Frame stepping always pauses playback and uses the selected streamed
source's frame rate, with a 30 fps fallback when source metadata is unavailable
or invalid.

Press **I** or **O** to jump to the selected segment's start or end; add
**Shift** to jump to the video's start or end. Press **Q** to edit its tag,
**W** or **E** to set its start or end at the playhead, and **T** to copy its
timing. **Shift+T** pastes that timing with normal range validation and undo
support. Select two or more segments in one swimlane and press **R** to merge
their full time span. The native confirmation dialog explains the destructive
change and can disable future merge confirmations. Restore the dialog with
**Confirm segment merges** in Segment Studio settings.

Press **P** to activate the segment nearest the playhead in the currently
selected swimlane without moving playback.

In either mode, select one or more segments and press **C** to collect them as
incorrect examples. The selection can span any number of swimlanes. Segment
Studio verifies registered AI provenance for every candidate on the server;
eligible segments are collected and ineligible segments remain unchanged. In
Basic, each collected native segment moves to a protected recycling-bin entry.
In Full, each collected native segment becomes a rejected Segment Studio item.
Extension-owned items remain extension-owned and become rejected, even when
managed while Basic is active. Collection preserves source, run, model,
confidence, field provenance, lineage assertions, timing, tag data, payload,
image, and collection-time provenance in a durable snapshot. When every
selected Full item is already collected, pressing **C** removes all of them
from the collection instead.

Press **Shift+C** to manage the video's collection. **Restore to review** atomically
restores a Basic native example with its original content and provenance, or
returns a Full example to unreviewed without changing extension ownership.
When the video has collected examples, the header also shows an **AI feedback**
button with the collection count; it opens the same dialog as **Shift+C**.
The dialog groups examples by tag, showing the tag and count once above its
individual time ranges. Tag sections start collapsed; expand one to inspect or
remove its examples. Collected Full items are hidden from the editor's review
swimlanes automatically without deleting the segments or discarding their
feedback data. Restoring a working example returns it to unreviewed and makes
it visible again. Completing its ZIP export clears the working reference and
makes the still-rejected segment visible for normal cleanup.

Press **Shift+X** to permanently delete rejected segments. After deletion,
Segment Studio focuses the first unapproved segment in the first affected
swimlane, or continues through lower swimlanes when that lane has none.

The **Shots** timeline is extension-owned structural data, not ordinary Cove
segments. Press **Y** or **U** to jump to the previous or next shot. Press
**Shift+A** or **V** to split the shot at the playhead; on a video without shot
data, this creates the first two ranges spanning the video. Press **Shift+V** at
an existing boundary to remove it and merge the adjacent shots. Shot edits do
not create tags, change review state, or publish Cove segments.

Basic mode does not track review progress. There are no approve, reject,
unreview, slot, or complete-review controls, and a video cannot be marked review
complete from this mode.

If somebody else changes the same segment before your edit is saved, Segment
Studio shows the newer version instead of overwriting it. Review the conflict and
apply your change again if it is still appropriate.

## Remove an unwanted segment

In Basic mode, select one or more segments and press **X**, or choose **Move to
bin**, to remove them from Cove without confirming each cleanup action. Segment
Studio keeps recoverable extension-owned copies containing the segment fields
and images. The items appear in Segment Studio's recycling bin.

If a native segment is a derivation source, moving it to the bin also removes
extension-owned derived segments that no longer have any supporting source.
A derived segment supported by another source is retained. Legacy data in which
a selected native segment is itself derived is blocked with an instruction to
reload it through the corrected migration.

Moving a segment to the bin deletes its original Cove identity. Bookmarks,
ratings, playback history, deep links, group membership, and data another
extension attached to that old identity are not restored later. The recycling
bin explains this identity boundary before restoration.

### Restore a segment

Open the recycling bin, select an item, and choose **Restore**. Segment Studio
creates a new native Cove segment with the retained timing, tag, payload, source
details, image, and Segment Studio metadata. The restored item leaves the bin.
Its new Cove segment has a new native ID. Derived descendants removed with the
old source are not recreated automatically; Full mode can materialize them
again when needed.

Choose **Empty recycling bin** to permanently delete every eligible item you can
access. Segment Studio asks once before emptying the whole bin. This action
cannot be undone. A bin item protected by the incorrect-example collection
cannot be restored, purged, or removed by **Empty recycling bin**. Remove it
from the collection dialog to restore it safely.

Deleting a video also permanently deletes its Segment Studio drafts and bin
items. Cove blocks deletion of a tag that is still used by an unpublished item;
retag or permanently delete those items first. If a retained image is missing or
broken, Segment Studio keeps the bin item and asks you to repair the image or
explicitly discard it before restoration.

### Download incorrect examples for training

Open the incorrect-example collection with **Shift+C**, then choose **Download
AI Feedback ZIP**. The browser uses an offscreen copy of the same-origin video
to extract JPEG frames at Marker Studio-compatible duration thresholds and
offsets. Segment Studio revalidates membership, versions, timestamps, and AI
provenance before storing the immutable export.

The ZIP contains legacy-compatible `metadata.json`, sampled JPEGs below
`frames/<tag>/`, and an enriched `manifest.json` with export-local references
and source, run, model, confidence, and provenance details. It does not contain
video titles, library paths, or Cove database IDs. The ZIP is downloaded for
manual submission; Segment Studio does not upload it to a training service.
Each filename ends with the export's opaque reference so separate downloads do
not overwrite one another, without exposing the video's Cove database ID.

After the browser has received and started the download, Segment Studio clears
only the examples captured in that export. Their segments remain rejected or
binned. A failed capture or download leaves the working collection intact, and
a completed immutable export remains available from its authenticated download
endpoint even if its original segment or working example is later deleted.

Choose **Delete permanently** to remove a rejected item and its extension-owned
image. An item with an export still being captured must finish or have that
export cancelled before it can be purged. Permanent deletion cannot be undone.

## Use Full mode to review unpublished segments

Full mode combines two kinds of items in one editor:

- Native Cove segments are already published and appear as approved.
- Extension-owned drafts are unpublished and have an explicit review state.

An unpublished draft can be **Unreviewed**, **Approved**, or **Rejected**.
Approval accepts the draft for publication but does not publish it immediately.
Publishing happens when you complete the review.

You can filter the editor by review state, activity, video, performer-slot
assignment, and the other filters available to the current Segment Studio
version. Filters and counts cover both published native segments and unpublished
drafts.

### Run Full Scan

**Full Scan** can add shot boundaries and extension-owned AI drafts to the Full
review workflow. When an AI model emits a label that is not yet a Cove tag,
Segment Studio creates that source tag so the result is not silently discarded.
Basic mode does not expose Full Scan or this review workflow.

### Create and edit a draft

Press **A** to create a segment of up to 20 seconds at the playhead, then set its
timing and tag. In Full mode the new segment belongs to Segment Studio and remains
unpublished until the review is completed. Manually created segments start
Approved, so they do not need a separate review decision.
If the video has no segments or swimlanes yet, **A** first asks you to choose
the tag that will create the initial swimlane. With an existing swimlane
selected, **A** continues to use that swimlane's tag automatically.
You can split, duplicate, retag, or adjust a draft without creating a native Cove
segment prematurely.

Press **S** with the playhead inside the selected segment to split it. The
original item keeps the first range and a new segment receives the second range;
both start Approved. Press **D** to duplicate the selected segment in place, or
**Shift+D** to duplicate it at the playhead while preserving its duration.
Duplicates start Approved. For Segment Studio-owned Review drafts, existing
performer assignments are copied when they remain valid for the resulting
activity. New segments and duplicates automatically receive performer-slot
assignments when the video performers and gender hints have exactly one valid
combination; ambiguous slots remain empty.

Changing timing, tag, payload, source identity, or another review-significant
field on an approved draft returns it to Unreviewed. Editing performer slots or
other completeness metadata does not remove its approval.

### Assign performer slots

Activities can define ordered performer slots. Select a segment and choose
**Edit performer slots** to open the assignment dialog. Slot information belongs
to Segment Studio and works for both published native segments and unpublished
drafts. The selected-segment summary and timeline continue to show whether the
slots are empty, partially filled, or complete without keeping the assignment
form open.

The dialog ranks video performers whose gender matches a slot's gender hints
ahead of other candidates. In the common case this puts the inferred assignment
near the top while still allowing any authorized performer to be selected.
When a segment is retagged, copied assignments are retained only when their
performers match any gender hints on the corresponding new slots. An
incompatible copied assignment is cleared, but the user can assign any
authorized performer afterward. If the remaining empty slots have exactly one
valid assignment from the video's performers, Segment Studio fills them
automatically.

A segment can be approved even when optional slots are empty. Required slots are
checked separately when you complete the review. Changing a segment's tag may
clear copied slot assignments that do not belong to the new activity or do not
match the corresponding new slot's gender hints.

If a tag is changed outside Segment Studio, assignments from the old activity
are ignored and the editor shows a repair notice. Choose the correct tag or
reassign the affected slots. Cove blocks deletion of a tag or performer still
required by Segment Studio until the affected drafts or assignments are changed
or removed.

### Approve, reject, or unreview

- **Approve** marks an unpublished draft as ready to publish.
- **Reject** keeps the item extension-owned and excludes it from publication.
- **Unreview** returns an extension-owned item to the Unreviewed queue.

A native segment is already published, so approving it makes no change.
Rejecting or unreviewing a native segment first removes it from Cove and converts
it into an extension-owned Rejected or Unreviewed item. Segment Studio shows the
same native-ID relationship warning used by Move to bin.

## Complete a review

Open a video's review summary and choose **Complete review**. Segment Studio
checks that:

- no unpublished item remains Unreviewed;
- every required slot and other blocking metadata requirement is satisfied; and
- none of the items included in the completion plan changed after the summary
  was prepared.

Segment Studio then publishes every approved draft as a native Cove segment.
Rejected items remain extension-owned. The review is recorded as complete only
after every approved draft has been published.

If publication is interrupted, reopen the completion summary and resume it.
Already published items stay published, and Segment Studio does not create them
twice. If an unpublished item changed externally, Segment Studio asks you to
prepare a new completion plan for the remaining work.

A completed video returns to **Needs review** when its eligible segments,
dispositions, required slot assignments, or slot definitions change, or when an
eligible item is added or removed. Segments already published remain native;
only the completion record becomes stale.

## Finish an upgrade from an earlier Segment Studio version

An existing installation may continue to show the compatibility interface until
an administrator normalizes its older review and slot data. Open the upgrade
tool to preview the affected rows and confirm the operation. Accepted segments
stay native and rejected segments move into extension ownership. Existing slot
assignments are moved to stable Segment Studio items non-destructively before
the tool asks permission to convert any native segment.

The operation is resumable. Rows changed after the preview or rows with data that
cannot be transferred safely remain in compatibility mode and are reported for
repair. Basic and Full modes become available after normalization completes;
choosing a mode never performs the normalization itself.

## Review existing Cove segments again

Native Cove segments are treated as already accepted. To put existing published
segments through the explicit review workflow, open Segment Studio's maintenance
tools and choose **Convert published segments to review candidates**.

Choose the whole eligible library or a narrower selection, such as particular
videos or videos containing a selected performer. Segment Studio previews the
exact current selection and explains that the original native IDs and their
relationships will be lost. Type the requested confirmation to begin.

The operation converts the frozen selection into extension-owned Unreviewed
items in resumable batches. Segments changed after the preview are skipped and
reported instead of being overwritten. Switching to Full mode alone never
performs this conversion.

## Understand published and approved

Publication and approval answer different questions:

- **Published** describes where the segment lives. Published segments are native
  Cove segments.
- **Approved** is the review decision for an unpublished draft. It means the
  draft is ready to publish when the review completes.

Native segments appear in the Approved filter because Segment Studio treats
already-published library content as accepted. Approval does not guarantee that
optional performer slots or other enrichment are complete.

## Disable or remove Segment Studio safely

Disabling Segment Studio hides its unpublished drafts and recycling-bin items
without deleting them. Enable the extension again to continue working with
them.

Before uninstalling Segment Studio or permanently removing its data, Cove warns
when unpublished drafts, rejected items, pending exports, or retained images
remain. Restore, publish, export, or purge those items according to your needs.
If physical image cleanup fails after a purge, Segment Studio reports a retryable
cleanup task; the deleted segment does not reappear.
