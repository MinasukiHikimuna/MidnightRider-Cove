# Data Quality review interaction contract

## Video and performer occurrence reviews

The active video and its player are visible beside the review panel. On narrower screens they stack, with queue navigation available below. The queue has independent scrolling and does not depend on space left beneath the player. Current tags and the active performer are prominent. Occurrence tagging applies to this performer in this video; video tagging applies to the video. Matching partners are processed together, without remounting the player or changing clip boundaries.

Configured actions run their ordered tag steps, including multiple observations or explicit absence tags, and advance only after confirmed success. Shift-click, Shift plus the action shortcut, and **Apply & stay** save without advancement. Number shortcuts ignore repeat and browser modifiers and are inactive in inputs, tag editing, dialogs, links, buttons, and player controls. No advance-behavior preference is stored.

**Edit tags** creates a local draft using the shared Cove tag selector. Arbitrary additions and removals do not change the review definition. **Save** stays on the item; **Save & next** advances; **Cancel** discards the draft and returns focus to Edit tags. Duplicate submissions and competing navigation are disabled while saving. A partial failure retains the item and inputs, refreshes actual tag state, and does not report full success. A confirmed save followed by failed queue navigation is identified separately.

## Query and navigation

The URL carries the complete effective query using native `q`, `filters`, `sort`, `direction`, `sorts`, `perPage`, `page`, `seed`, and `searchMode` conventions. `performerScope` contains target mode, selected performers, performer profile criteria, and occurrence-tag conditions; these remain distinct from scene conditions in `filters`. `startFrom` records traversal direction. Multi-column `sorts` uses the host's comma-separated `key:direction` format.

A bare review link reads the saved review and serializes its defaults. A link with query state never merges hidden saved criteria back in. Explicit `{}` scene filters and empty search remain empty. Reset replaces the URL with current saved defaults; saving defaults explicitly writes the review while preserving the effective query. Ordinary changes replace browser history; browser navigation restores URL state. Switching reviews starts from defaults unless the destination has explicit query state.

New reviews start from the end. Existing explicit direction is honored, and an explicit URL page takes precedence over the default starting page. Scenes traverse toward the configured end; matching performers in each scene stay together. Skip performs no mutation and creates no exclusion, outcome, or completion record. Video and occurrence reviews neither read nor write legacy progress.

The loaded-page cursor remains stable during tagging. At forward boundaries the current page is reconciled for scenes shifted into it; reverse traversal proceeds to the preceding page. Reconciliation waits for the host query cache after writes, clamps invalid pages, and avoids choosing the just-traversed loaded items again. Revisiting or refreshing a page creates a fresh cursor. The native toolbar shows the matching scene range and total. The scene queue sits to the left of the player with native pagination; it does not repeat counts, direction, or page navigation controls. No matches and reaching the end in the current direction have distinct messages.

## Undo

One in-memory operation records changed tag membership, its before/after state, and its loaded-page cursor. Undo remains available after advancement, re-reads the affected item, and restores only that operation's changes, including absence assessments. Unrelated tags, custom fields, and occurrence context are preserved. Detectable conflicts stop before undo writes; occurrence applications also compare application identity. Undo returns to the affected item and page for inspection. It does not cover tag-group actions or other non-tag operations, and does not survive closing the workspace.

Cove's current APIs do not offer atomic compare-and-swap tag changes. A write racing after the final read cannot be detected reliably. Multi-request saves and undo can partially fail; the interface reports this and retains inspection/recovery context instead of claiming rollback.

## Tag-group reviews

Tag-group reviews retain native Grid/List selection, focused-item keyboard navigation, group assignment or clearing, and account-scoped progress. Their existing workflow is separate from the filter-driven video and occurrence workspace. The review catalog and immutable review entity types are unchanged.
