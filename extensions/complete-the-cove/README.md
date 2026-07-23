# Complete the Cove

This extension keeps a catalog of metadata-server scenes that are missing from one Cove instance. It does not create Cove videos. Select a performer, studio, or tag from that entity's **Missing Scenes** tab, then run a refresh there or from the top-level **Missing Scenes** page. The main **Refresh** action refreshes every provider enabled for Complete the Cove; use its arrow menu to refresh only one enabled provider.

## Behavioral mapping

- A selected performer maps independently to each supported metadata server for which it has a remote ID.
- A selected studio maps to scenes from that studio and its direct child studios.
- A selected tag maps to scenes containing that tag's provider-specific remote ID.
- Cove `VideoRemoteId` rows for each configured provider determine which scenes already exist locally.
- Missing scene metadata, relationships, selection links, refresh state, and cover blob IDs live in extension-owned tables. Cover bytes live in Cove's extension blob store.
- Successful refreshes reconcile the selected entity: new missing scenes are added, scenes now present in Cove are removed, and scenes shared by another selection remain.
- Individual missing scenes can be ignored from their detail page. Ignored scenes remain hidden across catalog refreshes until **Show ignored scenes** is enabled and the scene is unignored.
- Missing Scenes URLs preserve search, provider, performer, studio, and tag filters, sorting, page, and the **Show ignored scenes** option in both the top-level catalog and entity tabs. Opening a scene and using **Back to Missing Scenes** restores the originating catalog view, and the URL can be bookmarked or shared.
- Exact, case-insensitive tag names configured in `excluded_tags` are omitted.

## Intentionally unsupported legacy behavior

- No second Cove or Stash instance, Stash cache synchronization, Marker Studio integration, or source-to-target copy.
- No creation of metadata-only Cove videos; catalog entries remain extension-owned until a future explicit import workflow is designed.
- No automatic `Completionist` tag selection in this first release; selection uses the dedicated entity-tab control.
- Any configured HTTPS StashBox GraphQL instance can use the generic StashBox discovery client. TPDB uses its separate REST client and normalizes responses into the same catalog model. Choose one or more configured providers on the extension settings page. These choices belong to Complete the Cove and do not alter provider availability elsewhere in Cove; only enabled choices appear in the refresh arrow menu. An existing blank selection continues to use every supported provider.
