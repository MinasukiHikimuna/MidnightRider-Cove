# Segment Studio

Segment Studio is a native Cove extension for direct segment editing, review,
performer-slot assignment, provenance, and derivation lineage. It supports a
streamlined basic workflow for canonical Cove segments and a full workflow for
extension-owned drafts and derived segments.

Its extension ID intentionally remains `segment-studio` so pre-release installs,
API routes, and migration receipts retain one continuous identity.

Version 0.1.0 requires Cove 1.3.2-dev.33 or later.

The extension includes video discovery, a timeline-first editor, review and
recycling-bin workflows, segment groups, provenance inspection, integrity
scanning, and AI feedback exports. See the packaged `docs` directory for the
user guide, administrator guide, and detailed design plans.

## Development

Run the complete .NET and UI suites from this package directory:

```bash
cd src/SegmentStudio/ui
npm ci
npm test
npm run build
cd ../../..
dotnet test SegmentStudio.slnx --configuration Release
```

The private migration operators under `scripts/` are not installed with the
extension. Their PostgreSQL integration tests require
`SEGMENT_STUDIO_MIGRATION_TEST_DATABASE_URL` to name an isolated PostgreSQL
database whose role can create temporary databases.

Installations that used Segment Studio's earlier organization model can migrate
it explicitly after upgrading. Stop Cove, back up PostgreSQL, then run:

```bash
psql "<connection-string>" -v ON_ERROR_STOP=1 \
  -f scripts/migrate-segment-groups-to-cove-tag-groups.sql
```

The script is rerunnable. It creates missing Cove tag groups by name and assigns
only tags that do not already have a native group, so existing Cove assignments
take precedence. The old extension tables remain available for rollback and
inspection.

Before applying the pre-release migration rebaseline, stop Cove and retain a
database backup. The rebaseline accepts only the exact 36-migration development
chain and replaces it with the public `001_initial_schema` receipt.
