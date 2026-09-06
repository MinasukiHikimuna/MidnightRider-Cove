# Data Quality

Data Quality is a self-contained Cove extension for running saved video review queues. Installing and enabling it adds a top-level page to **Settings → My → Interface → Navigation**, where it can be shown, hidden, and reordered with other extension pages.

The extension owns its page, interaction model, review storage bridge, editor, styles, and tests. Grid, List, and Wall modes share keyboard focus, explicit selection, preview, action targeting, and deterministic advancement. Wall mode uses muted viewport-aware previews, and the large preview reuses Cove's public `VideoPlayer` runtime component.

Reviews, ordered actions, native filters, annotations, tag bins, and preferred presentation are editable in the review route. Save or cancel returns to the current position. **Adjust queue** changes only the current session; **Save queue to review** explicitly replaces the saved queue.

Configuration and resumable progress use Cove's account-scoped saved-filter API. Existing prototype reviews migrate without changing IDs or restoring deletions. Accounts without saved-filter read permission retain browser-only storage; accounts with read but no write permission can run and temporarily adjust their account reviews. Migration conflicts retain both versions and offer a browser recovery export. See the [user guide](docs/video-data-quality.md), [storage contract](docs/storage-and-verification.md), and [TODO.md](TODO.md).

Registry publication and its final compatibility floor remain deferred. Visual-similarity searches are unavailable through the public extension API. Legacy multi-step actions use existing authorized bulk operations and can partially succeed. Present/absent tag assessments use the shared `confirmed_absent_tags` custom field and sequential read-modify-write requests; cross-writer concurrency, library-wide contradiction discovery, atomic actions, and undo remain separate follow-up work.
