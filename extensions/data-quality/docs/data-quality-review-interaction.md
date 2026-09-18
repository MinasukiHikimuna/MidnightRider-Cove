# Data Quality review interaction contract

## Video and performer occurrence reviews

The active video and its player are visible beside the review panel. On narrower screens they stack, with queue navigation available below. The queue has independent scrolling and does not depend on space left beneath the player. Current tags and the active performer are prominent. Occurrence tagging applies to this performer in this video; video tagging applies to the video. Matching partners are processed together, without remounting the player or changing clip boundaries.

Configured actions run their ordered tag steps, including multiple observations or explicit absence tags, and advance only after confirmed success. Shift-click, Shift plus the action shortcut, and **Apply & stay** save without advancement. Number shortcuts ignore repeat and browser modifiers and are inactive in inputs, tag editing, dialogs, links, buttons, and player controls. No advance-behavior preference is stored.

**Edit tags** creates a local draft using the shared Cove tag selector. Arbitrary additions and removals do not change the review definition. **Save** stays on the item; **Save & next** advances; **Cancel** discards the draft and returns focus to Edit tags. Duplicate submissions and competing navigation are disabled while saving. A partial failure retains the item and inputs, refreshes actual tag state, and does not report full success. A confirmed save followed by failed queue navigation is identified separately.

## Query and navigation

The URL carries the complete effective query using native `q`, `filters`, `sort`, `direction`, `sorts`, `perPage`, `page`, `seed`, and `searchMode` conventions. `performerScope` contains target mode, selected performers, performer profile criteria, and occurrence-tag conditions; these remain distinct from scene conditions in `filters`. `startFrom` records traversal direction. Multi-column `sorts` uses the host's comma-separated `key:direction` format.

A bare review link reads the saved review and serializes its defaults. A link with query state never merges hidden saved criteria back in. Explicit `{}` scene filters and empty search remain empty. Changing queue criteria reveals compact save and reset icon buttons for video, performer-occurrence, and tag reviews. Reset replaces the URL with current saved defaults; save writes the effective queue criteria directly to the review. Ordinary changes replace browser history; browser navigation restores URL state. Switching reviews starts from defaults unless the destination has explicit query state.

New reviews start from the end. Existing explicit direction is honored, and an explicit URL page takes precedence over the default starting page. Scenes traverse toward the configured end; matching performers in each scene stay together. Skip performs no mutation and creates no exclusion, outcome, or completion record. Video and occurrence reviews neither read nor write legacy progress.

Each successful tag save refreshes the loaded scene page, removing occurrences that no longer match and updating the scene count. A scene stays until its last matching performer has been tagged. Apply & stay keeps the current item open for inspection even if it leaves the queue. At forward boundaries the current page is reconciled for scenes shifted into it; reverse traversal proceeds to the preceding page. Reconciliation waits for the host query cache after writes, clamps invalid pages, and avoids choosing the just-traversed loaded items again. Revisiting or refreshing a page creates a fresh cursor. The native toolbar shows the matching scene range and total. The scene queue sits to the left of the player with native pagination; it does not repeat counts, direction, or page navigation controls. No matches and reaching the end in the current direction have distinct messages.

## Tag-group reviews

Tag-group reviews retain native Grid/List selection, focused-item keyboard navigation, group assignment or clearing, and account-scoped progress. Their existing workflow is separate from the filter-driven video and occurrence workspace. The review catalog and immutable review entity types are unchanged.

## Edit a media review

**Edit review** opens a draft in the existing review workspace. Change the name, description, actions, tag choices, direction, scene filters, and performer matching there; the scene list previews the draft criteria. **Save review** persists the complete rule, including performer criteria such as Female. **Cancel** discards the rule draft and restores the query and selected item from before editing. Failed saves leave the draft open for correction or retry. Tag actions and their shortcuts are disabled while editing the rule.

Management retains creation, duplication, deletion, import, and export. Editing an existing video or occurrence review from management opens this workspace mode; legacy tag-group reviews retain their existing editor.

## Batch occurrence approval

Choose a configured occurrence action and preview all matching appearances across every scene page. The preview uses the effective URL query, independently of the visible page and traversal order, and matches occurrence conditions with the same subtag setting as the queue. It shows performer scope, scene filters, changes, and conflicts, with occurrence links for inspection. Conflict replacement is explicit and defaults to skipping: conflicts come from net removals in the ordered action, including removal-tree descendants resolved during preview. Existing correct answers require no writes. Legacy choice-only reviews have no configured actions, so their batch control stays disabled.

The run freezes target pairs before writes and processes at most five occurrences at once. A fresh read checks affected tag values and application identities; changed answers are skipped, removed performer links fail, and unrelated tags and partners are preserved. Final action deltas are applied through existing occurrence APIs and verified after writing. These APIs do not provide an atomic compare-and-swap, so concurrent changes between the final read and write remain a limitation.

Cancellation lets in-flight writes settle and keeps remaining items available. Retry attempts only failed items with known current state. If a write cannot be verified, inspect the linked occurrence and create a fresh preview; do not blindly retry. Batch undo uses the recorded changes, including verified partial writes, and retains conflicts or incomplete undo operations for inspection. The modal locks normal review edits and shortcuts. Closing the modal after a write refreshes the queue and retains batch results; opening the rule editor preserves them. Results are lost when leaving the workspace or explicitly discarding them for a new batch. Keep the browser page open while running.
