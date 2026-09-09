# Data Quality review interaction contract

This contract defines the dedicated Data Quality review route, including editing and durable progress. It uses Culture staging as a reference for its compact queue controls, visible focused item, separate selection, numbered actions, paging, adjustable presentation, and inline preview affordance. The task-local Culture environment was inspected separately: it exposed the same review controls and shortcut legend, but its result requests failed and no cards were available for interaction. The retired Cove prototype was also inspected during phases 1–3 through Videos → Data quality; it preserves the full library grid and review editor, but has no independent card focus, continuous preview loop, or deterministic advancement after an action.

## Focus and selection

Focus is the single queue item that receives navigation and open/preview commands. Exactly one loaded item is focused whenever the queue has results. Arrow keys move focus spatially through the current grid: Left and Right move one item, while Up and Down move by the current column count. Movement clamps at the first and last loaded item and scrolls the focused card into view. In a tag List view, vertical movement advances one row.

Selection is an explicit set of action targets and is independent of focus. Space toggles the focused item. `A` selects all currently shown queue items when any shown item is unselected, and clears the shown selection when all are selected. Mouse selection uses the same set. Moving focus never changes selection.

An action targets the selected set when it is non-empty; otherwise it targets only the focused item. The action bar must state that target before execution, and a pending action retains an immutable snapshot of its targets. Selection changes made after execution starts are preserved and are never cleared by completion of the older action.

## Shortcut scope

The dedicated review surface owns Arrow keys, Space, Enter, Escape, `A`, and action keys `1`–`9` while focus is on the review surface. Enter opens the focused video in the large preview or the focused tag detail in a new tab. Escape closes the video preview; on the queue it clears selection. Number keys invoke the corresponding visible review action. Shortcuts ignore auto-repeat and do not run with Control, Alt, or Meta modifiers.

Review shortcuts are suspended while the event target is a text input, textarea, select, button, link, combobox, contenteditable element, the native player, or an unrelated dialog. Inside the review preview, the player keeps its normal media keys; review actions run only from the preview action buttons or from `1`–`9` when focus is outside player controls. Arrow keys change preview items only when focus is outside the player and action controls.

## Preview and restoration

The preview is an in-route modal using Cove’s `VideoPlayer`. It opens the focused item without changing filters, sort, page, card size, focus, or selection. Previous and Next move through the loaded queue and update focus. Closing restores DOM focus to the originating card when it still exists, or to the deterministic successor chosen after a queue change, and scrolls that card into view without resetting the page position.

Preview actions use the same target rule as the grid. The preview states whether the action will affect the explicit selection or the previewed item. Opening and navigating the preview does not silently add items to selection.

## Advancement and changing queues

Before an action begins, the route records the ordered target IDs, the focused ID, its loaded index, the current selection version, and whether the preview is open. Video actions keep their ordered bulk-step behavior. Actions with explicit present/absent assessments resolve tag trees before writes and process videos sequentially, applying legacy steps in order before the exact-ID assessments determine their named tags' final state. Tag actions use one bulk request to set or clear `tagGroupId`; Skip performs no write. After every action attempt the route refreshes the queue because success or partial failure may change membership, waiting for the video query cache only when a video action wrote metadata.

After a fully successful metadata action or a skip action, processed targets are removed from selection. If the user changed selection while the request was pending, only processed IDs that remain selected are removed; all new selections are preserved. Focus advances to the first still-matching item at or after the old focused index. If no item remains there, it uses the preceding item. When a refreshed page becomes empty and a later page cannot exist, the route moves to the nearest valid previous page. A preview stays open on that successor when one exists and closes into the empty state when none exists.

After failure, focus and preview remain on the same item when it still matches. If completed work removed it from the queue, the same successor rule applies. Selection is retained for targets that still match so the reviewer can inspect and retry. A legacy-action error identifies completed and failed steps; an assessment-action error identifies completed videos and the affected video. The extension does not claim rollback or undo.

Loading keeps the existing grid visible but marks actions unavailable. Initial load, empty results, refresh, and query failure have distinct messages and retry controls. A result refresh must never temporarily retarget an action.

## Review state and bounded extension seams

The Data Quality extension owns the dedicated route, top-level navigation contribution, review surface, native filter integration, editor, styles, and account storage adapter. Cove exposes its label, icon, visibility, and order in Settings → My → Interface alongside other extension pages. There is no entry point or return link in a generic entity list. The route adopts existing video reviews and account-imported review bundles without changing their IDs. Every review targets one immutable entity type. Video reviews support Grid and Wall; tag reviews support native-style Grid and compact List views and default to an ungrouped, name-sorted queue. Opening a review resumes its saved progress when the queue signature matches, otherwise it applies the saved queue at page one. Ordinary focus, selection, preview/open, paging, display mode, card width, and temporary filter changes do not modify the saved review. Edit review preserves position and explicit selection through save or cancel. Native filter changes refresh the current page, preserving surviving focus or using its nearest index. Temporary adjustments stay separate until explicitly saved.

The implementation keeps four narrow extension boundaries: a saved-review repository, a queue query adapter, an authorized action executor, and a review-surface state machine. It calls Cove's public authenticated APIs for queries and mutations and reuses the public `VideoPlayer` runtime component for large previews. Release packaging must adopt the published post-merge Cove compatibility floor. Configuration and progress now use account-scoped saved-filter storage; see [storage-and-verification.md](storage-and-verification.md) for migration and concurrency boundaries. Registry publication, atomic actions, and undo remain deferred.
