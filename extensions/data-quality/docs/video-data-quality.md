# Data Quality extension

Install and enable the Data Quality extension, then place its top-level page through **Settings → My → Interface → Navigation**. The extension owns this route and has no link to the generic Videos list.

Choose a saved review to open its queue. Existing browser reviews and account import bundles are adopted without changing their IDs. **Manage reviews** supports naming, describing, duplicating, deleting, and importing reviews, plus compact editing of labeled tag actions. Local edits remain scoped to the current account and browser. An adopted-ID history preserves deletion of an account-imported review on later loads.

The queue offers Grid, List, and Wall modes. Grid and Wall start in Auto fit mode and use the available viewport; a manual card width remains available. Wall plays muted generated previews only near and within the viewport, falls back to cover images when previews are unavailable, and does not record engagement. The large preview reuses Cove's public `VideoPlayer` component.

Focus and selection are separate. Arrow keys move the single focused video. Space toggles its selection, `A` toggles the videos shown on the page, Enter opens the preview, and keys 1–9 run the matching action. An action targets the explicit selection when one exists and otherwise targets the focused video. The target is stated beside the action controls. Review shortcuts stop in editors and dialogs; player focus retains playback controls.

Actions use Cove's authenticated extension API and existing video write permissions. Parent-and-descendant removal resolves the current tag tree before the first write. Each action step is a separate request, so a later failure does not undo earlier steps. After success or failure, the queue refreshes, selection is limited to targets that still match, and focus advances or stays according to the interaction contract. The UI reports partial progress without promising rollback or undo.

Expanded filter editing, cross-browser configuration migration, resumable progress, durable registry packaging, atomic actions, and undo remain later work. Visual-similarity queue evaluation also remains unavailable until Cove exposes it through the public extension API. See [data-quality-review-interaction.md](data-quality-review-interaction.md) and [TODO.md](../TODO.md) for the contract and phase boundaries.
