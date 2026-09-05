# Data Quality

Data Quality is a self-contained Cove extension for running saved video review queues. Installing and enabling it adds a top-level page to **Settings → My → Interface → Navigation**, where it can be shown, hidden, and reordered with other extension pages.

The extension owns its page, interaction model, review storage bridge, editor, styles, and tests. Grid, List, and Wall modes share keyboard focus, explicit selection, preview, action targeting, and deterministic advancement. Wall mode uses muted viewport-aware previews, and the large preview reuses Cove's public `VideoPlayer` runtime component.

Browser-edited reviews remain local to the current account and browser. Existing prototype storage and account-imported review bundles are adopted without changing their IDs. Cross-browser configuration migration, expanded filter editing, resumable progress, atomic actions, and undo remain later work; see [TODO.md](TODO.md).
