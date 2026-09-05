# Complete the Cove

This extension keeps a catalog of metadata-server videos that are missing from one Cove instance. It does not create Cove videos. Select a performer, studio, or tag from that entity's **Missing Videos** tab, then run a refresh there or from the top-level **Missing Videos** page. The main **Refresh** action refreshes every provider enabled for Complete the Cove; use its arrow menu to refresh only one enabled provider.

## How refreshing avoids unnecessary work

A refresh checks the full provider catalog for the selected performer, studio, or tag so it can detect new videos, removals, and metadata changes. Refreshing one record limits tracking-source synchronization and discovery to that record.

- **Fewer provider requests:** StashBox and TPDB fetch up to 100 videos per page, with requests made sequentially. StashBox requests the total count only on the first page and queries a studio and its direct children together.
- **Less local work:** Videos and their relationships are read in batches. Only changed metadata and relationships are written; unchanged videos keep their existing records and timestamps. Local ownership and exclusions determine which videos remain missing, while shared and ignored entries retain their existing rules.
- **Reuse existing covers:** Cached covers are reused when their source URL is unchanged. Only new, changed, or previously unsuccessful covers are downloaded, sequentially through a reused connection pool.

Reconciliation reports progress after each batch. Refreshing still reads the full matching catalog; it does not assume that older provider results are unchanged.

## Behavioral mapping

- A selected performer maps independently to each supported metadata server for which it has a remote ID.
- A selected studio maps to videos from that studio and its direct child studios.
- A selected tag maps to videos containing that tag's provider-specific remote ID.
- Cove `VideoRemoteId` rows for each configured provider determine which videos already exist locally.
- Missing video metadata, relationships, selection links, refresh state, and cover blob IDs live in extension-owned tables. Cover bytes live in Cove's extension blob store.
- Successful refreshes reconcile the selected entity: new missing videos are added, videos now present in Cove are removed, and videos shared by another selection remain.
- Individual missing videos can be ignored from their detail page. The **Ignored status** filter can show all videos, only ignored videos, or only videos that are not ignored.
- Missing Videos uses Cove's native list controls for search, sorting, pagination, saved filters, and performer, studio, and tag criteria. URLs preserve the current view in both the top-level catalog and entity tabs. Opening a video and using **Back to Missing Videos** restores the originating catalog view, and the URL can be bookmarked or shared.
- Exact, case-insensitive tag names configured in `excluded_tags` are omitted.

## Intentionally unsupported legacy behavior

- No second Cove or Stash instance, Stash cache synchronization, Marker Studio integration, or source-to-target copy.
- No creation of metadata-only Cove videos; catalog entries remain extension-owned until a future explicit import workflow is designed.
- No automatic `Completionist` tag selection in this first release; selection uses the dedicated entity-tab control.
- Any configured HTTPS StashBox GraphQL instance can use the generic StashBox discovery client. TPDB uses its separate REST client and normalizes responses into the same catalog model. Choose one or more configured providers on the extension settings page. These choices belong to Complete the Cove and do not alter provider availability elsewhere in Cove; only enabled choices appear in the refresh arrow menu. An existing blank selection continues to use every supported provider.
