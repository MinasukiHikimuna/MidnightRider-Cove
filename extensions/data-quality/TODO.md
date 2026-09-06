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

Phases 1–3 were the first delivery. Phases 4–6 now complete the extension-only workflows; registry publication remains deferred.

## Phase 4 — Make reviews easy to modify

- [x] Expand the compact in-route editor while preserving the current review position after save or cancel.
- [x] Support action duplication and reordering, ordered tag operations, clear shortcut assignments, and validation before saving.
- [x] Provide native filter editing with distinct temporary adjustments and saved queue updates.
- [x] Add configurable card annotations, tag bins, and per-review presentation settings, informed by Culture's editor.
- [x] Use plain-language action steps and test the adjust → resume workflow.

Exit criterion: users can adapt a review during use without rebuilding it or losing their place.

## Phase 5 — Package it as a durable extension

- [x] Keep the workflow behind narrow extension-owned storage, query, action, and review-surface boundaries.
- [x] Build, install, and verify a development extension package through Cove's live UI.
- [ ] Publish a durable registry package after establishing the post-merge Cove compatibility floor. **Explicitly deferred by this task; no registry publication, push, or PR is authorized.**
- [x] Persist review configuration per account across browsers.
- [x] Adopt existing browser-edited and account-imported prototype reviews without changing IDs or restoring locally deleted imports.
- [x] Add resumable review progress with defined behavior when the queue changes.

Exit criterion: the installed extension retains configuration and supports resuming reviews independently of the prototype sidebar.

## Phase 6 — Harden and retire the prototype

- [x] Verify large queues and the full set of permission variants.
- [x] Verify keyboard conflicts, partial failures, and changing results for the phases 1–3 workflow.
- [x] Compare real review workflows with Culture and resolve remaining interaction friction.
- [x] Complete the automated tests, live-UI verification, and code review required for phases 1–3.
- [x] Remove the prototype sidebar and links between Data Quality and the generic Videos list.

Exit criterion: the extension replaces the prototype with verified workflow coverage and documented remaining limitations.

## Separate backend milestone — Atomic actions and undo

- [ ] Design atomic multi-step metadata actions and undo as a separately scoped backend capability.
- [ ] Until then, preserve explicit partial-failure reporting and avoid implying rollback or undo exists.

This milestone must not silently expand phases 1–3.

## Phase 1–3 delivery notes

The interaction contract is recorded in `docs/data-quality-review-interaction.md`. Culture staging supplied the verified reference for populated queues, visible focus, numbered actions, paging, sizing, and inline play. The task-local Culture environment exposed the same controls but its backing result requests failed, so no card behavior was inferred from it.

The Data Quality extension owns the review route and contributes it to Cove's top-level navigation manifest, so the destination can be enabled and sorted in Settings → My → Interface with other extension pages. There is no link in either direction between it and the generic Videos list, and Cove core contains no Data Quality changes. The extension adopts the same account-imported and browser-edited review storage as the prototype and uses Cove's authenticated video query APIs, filter expressions, authorized bulk tag operations, tag-tree resolution, media URLs, and public video player. Grid and Wall preserve the same responsive card presentation, focus, selection, preview, and action behavior; Wall substitutes muted, viewport-aware generated previews without engagement tracking. Video titles and the large preview open video details in a new tab. Legacy List or Tagger preferences normalize to Grid, and manual card width remains available in both supported modes. A development ZIP containing the extension DLL, manifest, JavaScript, and CSS was packaged, installed, and verified through the live UI; registry publication remains deferred.

## Phase 4–6 delivery notes

The editor now supports ordered action/step editing, action duplication and reordering, validated digit shortcuts, Cove's native filter dialog, explicit temporary and saved queues, annotations, descendant-tag bins, and per-review presentation. Saving or canceling returns to the current review position and selection. Configuration version 2 and progress version 1 use account-scoped saved-filter records; migration preserves review/action IDs, edits, imported-ID history, and local deletions. Original browser snapshots remain untouched for recovery and are no longer written by the extension. Unscoped legacy browser data is offered for explicit export/import because automatic migration cannot establish its account owner. Obsolete browser-only storage code and prototype-era guidance have been replaced; no active prototype surface remains.

The verification suite covers editing, resumption, ordered actions, shortcuts, asynchronous saves and imports, cache expiry after mutation, changing results, migration and deletion history, malformed/future storage, concurrent reads, stale browser conflicts, permission transitions, and progress synchronization failures. Live checks covered Grid/Wall navigation and matching card structure, direct new-tab video links, preview → act → advance, saved edit/cancel focus restoration on a later page, native temporary filtering/reset/save, annotations and tag bins, a queue exceeding 30,000 videos, cross-browser configuration and position/view persistence, a shrinking final page, real fixture mutations with an injected second-step failure, query/save failures and retries, injected read-only/browser-only permission responses, denied tag access, and player/navigation shortcut boundaries. Permission injection verifies the extension UI boundary; existing Cove authorization remains responsible for server enforcement. Disposable fixture records and private browser evidence remain task-local.

Culture staging was inspected with populated queues and its rich editor. Task-local Culture was inspected separately: its editor was available but its backing Stash result requests failed. No staging data was changed. All product changes remain inside this extension.

Final verification passed: 81 automated UI tests, production extension UI build, development ZIP validation/installation, live extension verification, and independent final code review. See [storage-and-verification.md](docs/storage-and-verification.md) for the detailed persistence and changing-result contract.

Remaining public-API boundaries: visual-similarity queue evaluation is unavailable; saved-filter writes lack atomic compare-and-swap, so simultaneous cross-browser writes remain a race despite revision checks; metadata actions wait approximately 1.1 seconds before refreshing because Cove caches identical filtered queries for one second and exposes no invalidation hook. Present/absent assessments use sequential read-modify-write requests because the API has no transaction, concurrency token, or field-specific mutation endpoint; other writers can introduce later contradictions, and library-wide contradiction discovery and resolution remain follow-up work. Tag-bin counts cover the loaded page, and resumption uses identity within the saved page or its nearest index rather than scanning the whole library. Registry publication and its post-merge compatibility floor remain deferred. Atomic actions and undo remain the separate backend milestone.
