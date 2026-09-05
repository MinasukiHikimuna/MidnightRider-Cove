# Data Quality review extension

Build a dedicated review experience that makes both running a review and adjusting it as you go fluent. Use Culture's data-quality workflow as a reference, including its easy modification of reviews, without treating its behavior as a fixed specification. Reuse Cove's player, filtering, authorization, metadata operations, and UI components where practical.

## Phase 1 — Define the interaction model

- [x] Inspect the Culture staging workflow and the current Cove prototype through the live UI. Distinguish verified staging behavior from behavior observed only in the task-local Culture environment.
- [x] Compare keyboard navigation, selection, preview, action execution, and review editing; record useful behavior and friction.
- [x] Define focused card versus selected videos, shortcut assignments and scope, bulk-action targets, preview navigation, and focus restoration.
- [x] Define advancement after success, skip, failure, and changes that remove videos from the matching queue. Preserve deliberate new selections during pending work.
- [x] Define how editing a review returns to the same review position, and distinguish temporary filters from saved queue changes.
- [x] Identify reusable Cove components and the minimum future extension interfaces before implementing the dedicated route.

Exit criterion: a documented interaction contract and bounded implementation plan for phases 2–3.

## Phase 2 — Build the dedicated review grid

- [x] Add a dedicated Data Quality review route and review surface owned by the extension, with no coupling to the generic Videos list.
- [x] Reuse existing saved reviews, queue definitions, and actions.
- [x] Implement keyboard movement, visible focus, explicit selection, bulk selection, and adjustable card sizing.
- [x] Preserve filters, sort, and position through ordinary review interactions, with predictable loading, empty, and error states.
- [x] Reuse Cove components where practical; keep review state and navigation separate from generic library browsing.

Exit criterion: existing reviews can be run from the dedicated grid using keyboard navigation and current action capabilities.

## Phase 3 — Complete the preview-and-act loop

- [x] Open a large video preview with one shortcut, reusing Cove's video player.
- [x] Support next/previous navigation and review actions inside the preview with unambiguous action targets.
- [x] Restore the focused card and scroll position when the preview closes.
- [x] Advance predictably after successful actions, including when updated metadata removes items from the queue; retain useful context after failures.
- [x] Prevent shortcut conflicts with player controls, text inputs, editors, and unrelated dialogs.
- [x] Verify the navigate → preview → apply action → advance loop in the live UI and compare its fluency with Culture.
- [x] Run relevant checks and review the complete implementation diff before handoff.

Exit criterion: the core review loop works continuously from the keyboard without losing position or obscuring which videos an action affects.

Phases 1–3 are the first delivery. Use actual review experience to prioritize phase 4.

## Phase 4 — Make reviews easy to modify

- [ ] Expand the compact in-route editor while preserving the current review position after save or cancel.
- [ ] Support action duplication and reordering, ordered tag operations, clear shortcut assignments, and validation before saving.
- [ ] Provide native filter editing with distinct temporary adjustments and saved queue updates.
- [ ] Add configurable card annotations, tag bins, and per-review presentation settings, informed by Culture's editor.
- [ ] Use plain-language action steps and test the adjust → resume workflow.

Exit criterion: users can adapt a review during use without rebuilding it or losing their place.

## Phase 5 — Package it as a durable extension

- [x] Keep the workflow behind narrow extension-owned storage, query, action, and review-surface boundaries.
- [x] Build, install, and verify a development extension package through Cove's live UI.
- [ ] Publish a durable registry package after establishing the post-merge Cove compatibility floor.
- [ ] Persist review configuration per account across browsers.
- [x] Adopt existing browser-edited and account-imported prototype reviews without changing IDs or restoring locally deleted imports.
- [ ] Add resumable review progress with defined behavior when the queue changes.

Exit criterion: the installed extension retains configuration and supports resuming reviews independently of the prototype sidebar.

## Phase 6 — Harden and retire the prototype

- [ ] Verify large queues and the full set of permission variants.
- [x] Verify keyboard conflicts, partial failures, and changing results for the phases 1–3 workflow.
- [ ] Compare real review workflows with Culture and resolve remaining interaction friction.
- [x] Complete the automated tests, live-UI verification, and code review required for phases 1–3.
- [x] Remove the prototype sidebar and links between Data Quality and the generic Videos list.

Exit criterion: the extension replaces the prototype with verified workflow coverage and documented remaining limitations.

## Separate backend milestone — Atomic actions and undo

- [ ] Design atomic multi-step metadata actions and undo as a separately scoped backend capability.
- [ ] Until then, preserve explicit partial-failure reporting and avoid implying rollback or undo exists.

This milestone must not silently expand phases 1–3.

## Phase 1–3 delivery notes

The interaction contract is recorded in `docs/data-quality-review-interaction.md`. Culture staging supplied the verified reference for populated queues, visible focus, numbered actions, paging, sizing, and inline play. The task-local Culture environment exposed the same controls but its backing result requests failed, so no card behavior was inferred from it.

The Data Quality extension owns the review route and contributes it to Cove's top-level navigation manifest, so the destination can be enabled and sorted in Settings → My → Interface with other extension pages. There is no link in either direction between it and the generic Videos list, and Cove core contains no Data Quality changes. The extension adopts the same account-imported and browser-edited review storage as the prototype and uses Cove's authenticated video query APIs, filter expressions, authorized bulk tag operations, tag-tree resolution, media URLs, and public video player. Grid, List, and Wall presentation modes preserve the same focus, selection, preview, and action behavior. Grid and Wall use Auto fit by default; Wall uses muted, viewport-aware generated previews without engagement tracking, while List provides compact horizontal rows. Manual card width remains available for grid views. A development ZIP containing the extension DLL, manifest, JavaScript, and CSS was packaged, installed, and verified through the live UI; registry publication remains deferred.

Remaining limitations are intentionally deferred: the extension includes the existing compact review editor, while expanded filter editing and resumable route state belong to phase 4; visual-similarity queue evaluation is unavailable because Cove does not expose that search through its public extension API; view choice, manual card width, and page progress are session-only; account imports remain browser-adopted prototype storage; final registry packaging, the post-merge Cove compatibility floor, and configuration migration remain phase 5; atomic actions and undo remain the separate backend milestone. Successful actions refresh and advance, while partial failures report completed steps and retain retry context without claiming rollback.
