# Merge Opportunities

Cove extension that surfaces duplicate performer and studio records so the user
can review and resolve them one by one.

## What it does

Scans core tables and lists two classes of candidate duplicates:

1. **Same remote id** — the same `(endpoint, remoteId)` is attached to 2+ cove
   entities. Endpoint normalization strips the query string, so
   `https://stashdb.org?x` and `https://stashdb.org` group together.
2. **Name match** — the same normalized name (`lower(trim(name))`) on 2+
   entities whose remote ids span 2+ distinct providers. Single-provider
   same-name noise is excluded.

Each candidate shows its members (cover, video count, remote ids) and evidence:
for name matches, scene titles credited to 2+ members.

Three user actions (per candidate, host endpoints do the data change):

- **Merge** — pick the record to keep, `POST /api/{performers|studios}/merge`
  with `{targetId, sourceIds}`. Merge failures (e.g. extension-reference
  blocks) surface as a 409 from the host.
- **Attach** — copy the sources' remote ids onto the target only (additive,
  nothing removed), via the extension's `/attach` endpoint.
- **Delete orphan** — host `DELETE /api/{performers|studios}/{id}` for a
  member with 0 videos.

Decisions (`merged`, `attached`, `deleted`, `dismissed`) are stored in the
extension-owned `merge_opportunities_decisions` table so reviewed candidates
can be filtered out of the open list and re-opened later. Candidate groups
themselves are recomputed on every request — no materialized duplicate state.

## Endpoints

All under `/api/plugins/com.midnightrider.merge-opportunities`, all require
`ExtensionsConfigure`:

- `GET /candidates` — all candidate groups with member details + decisions
- `GET /candidates/{key}` — one candidate + shared-scene evidence
  (404 when the group no longer exists)
- `POST /candidates/{key}/decision` `{decision, targetEntityId?, note?}` —
  record/update a decision
- `DELETE /candidates/{key}/decision` — reopen
- `POST /attach` `{entityType, targetId, sourceIds}` — copy remote ids
  target ← sources, deduped, idempotent

Candidate keys: `{performer|studio}|remote-id|{provider}|{remoteId}` and
`{performer|studio}|name|{normalized-name}`.

## Layout

- `src/MergeOpportunities/` — `MergeOpportunitiesExtension.cs` (pages,
  migrations, endpoints), `MergeOpportunityCatalog.cs` (detection, attach,
  decisions), `Models.cs` (entity + DTOs), `extension.json`,
  `ui/MergeOpportunities.js` + `.css` (static, no build step)
- `tests/MergeOpportunities.Tests/` — xUnit, EF InMemory
- `tests/MergeOpportunities.Ui.Tests.mjs` — node:test source-pattern checks

## Dev

No `uiBuildDirectory` — the UI is static JS/CSS, no npm step.

```bash
~/.dotnet/dotnet restore MergeOpportunities.slnx \
    --property:UseLocalCoveSource=false --property:UseLocalCoveCore=false
~/.dotnet/dotnet test MergeOpportunities.slnx --no-restore \
    --property:UseLocalCoveSource=false --property:UseLocalCoveCore=false
node --test tests/MergeOpportunities.Ui.Tests.mjs
```

Deploy (live Cove):

```bash
~/.dotnet/dotnet publish src/MergeOpportunities/MergeOpportunities.csproj -c Release \
    --output /tmp/mop --no-restore \
    --property:UseLocalCoveSource=false --property:UseLocalCoveCore=false
docker cp /tmp/mop/MergeOpportunities.dll /tmp/mop/extension.json \
    cove-cove-1:/cove_config/extensions/com.midnightrider.merge-opportunities/
docker cp src/MergeOpportunities/ui/. \
    cove-cove-1:/cove_config/extensions/com.midnightrider.merge-opportunities/ui/
docker restart cove-cove-1
```
