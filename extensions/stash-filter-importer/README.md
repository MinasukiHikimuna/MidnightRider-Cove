# Stash Filter Importer

Stash Filter Importer reviews saved `SCENES`, `PERFORMERS`, `IMAGES`, `GALLERIES`, `TAGS`, `STUDIOS`, and `SCENE_MARKERS` filters in a server-readable Stash SQLite backup and creates compatible Cove saved filters for the corresponding modes.

Version 1.0 is deliberately review-first: it never writes to the backup, stores the submitted path only in the browser's local storage, never drops unsupported rules, starts with no filters selected, and refuses duplicate Cove names. Any same-name Cove filter is shown as already in Cove; it cannot be selected or overwritten. Stash display modes are translated to Cove's named modes when the target list supports them, while incompatible display modes are omitted and reported as adapted. Stash's four zoom positions are normalized across Cove's wider card-size range as `0`, `2.75`, `5.25`, and `8`. Video marker-presence filters map to Cove's broader raw-segment presence criterion and are marked as adapted. Performer filters conservatively support the observed name/search paging and sort fields plus favorite, gender, tag, O-counter, and endpoint-aware remote-ID criteria. Tag filters support the observed direct-parent, favorite, description, executable count, and endpoint-aware remote-ID criteria; recursive parent and missing-image rules remain unsupported because Cove cannot execute equivalent filters. Studio filters support the observed search, paging, sort, and endpoint-aware remote-ID criteria. Scene-marker filters target Cove's recommended derived Segments view and are scoped to user tag segments. Primary-only marker tags and parent hierarchies, numeric duration, marker timestamps, compatible aggregate sorts, zoom, and missing end times (as a duration under one second) are adapted; secondary or mixed marker tags or hierarchies, exclusions, multiple required tags, parent-scene criteria, and end-time-presence (`NOT_NULL`) filters remain unsupported. Stash ID criteria preserve their optional metadata-service endpoint through Cove's paired remote-ID filters. Tag references map only through unique case-insensitive names; performer and studio references map only through unambiguous endpoint-scoped remote IDs preserved by Cove's Stash migration. URL/API-key connections, guessed entity matching, other entity-reference types, other modes, partial imports, and registry publication are outside this release.

## Troubleshooting analysis performance

Open Cove **Settings → Server → Logs** and filter for the `StashFilterAnalyzer` category after its first event. Debug logging records aggregate phase timings and counts without database contents. `SavedFilterSchema` measures targeted schema validation, while `SavedFilterRead` measures inventory reading; normal analysis intentionally does not run a full-database integrity scan. Other phase names identify dependency reads, Cove reference resolution, translation, and summarization. Enable Trace for up to 15 minutes to add phase-start and per-filter translation progress; Trace logs only ordinal, mode, status, rule count, importability, and duration.

## Development

```sh
dotnet test StashFilterImporter.slnx
node --test tests/StashFilterImporter.Ui.Tests.mjs
dotnet build StashFilterImporter.slnx --configuration Release
```

Package validation is performed against the staged package:

```sh
node scripts/validate-extension-package.mjs <package-directory> 1.0.0 com.midnightrider.stash-filter-importer
```
